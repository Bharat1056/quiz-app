import { Quiz } from "../model/quiz.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { google } from "googleapis";
import axios from "axios";
import cron from "node-cron";
import { Question } from "../model/question.model.js";

export const createUser = asyncHandler(async (req, res) => {
  const { role, email, regdNo, name, password } = req.body;

  if (!role || !name) {
    throw new apiError(400, "Role and name are required");
  }

  if (role === "admin" && (!email || !password || regdNo)) {
    throw new apiError(400, "Invalid Credentials for admin");
  }

  if (role === "user" && (!regdNo || email || password)) {
    throw new apiError(400, "Invalid Credentials for user");
  }

  if (role !== "admin" && role !== "user") {
    throw new apiError(400, "Invalid role");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { regdNo }, { name }],
  });
  if (existingUser) {
    throw new apiError(400, "User already exists");
  }

  let newUser;
  if (role === "user") {
    newUser = new User({ role, regdNo, name });
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    newUser = new User({ role, email, name, password: hashedPassword });
  }

  await newUser.save();

  res.status(201).json(apiResponse(newUser));
});

export const createQuiz = asyncHandler(async (req, res) => {
  const { quizName, totalMarks, timeLimit, startTime } = req.body;

  if (!quizName || !totalMarks || !timeLimit || !startTime) {
    throw new apiError(400, "All fields are required");
  }

  const newQuiz = new Quiz({
    quizName,
    totalMarks,
    timeLimit,
    startTime,
    createdBy: req.user._id, // via middleware
  });
  const calendar = google.calendar("v3");

  const auth = new google.auth.GoogleAuth({
    keyFile: "path/to/your-service-account-file.json",
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  const authClient = await auth.getClient();

  const event = {
    summary: quizName,
    description: `${req.user.name}, ${quizName} is starting`,
    start: {
      dateTime: new Date(startTime).toISOString() - timeLimit * 2 * 60000,
      timeZone: "UTC",
    },
    end: {
      dateTime: new Date(
        new Date(startTime).getTime() + timeLimit * 60000
      ).toISOString(),
      timeZone: "UTC",
    },
    attendees: [{ email: req.user.email }],
  };

  await calendar.events.insert({
    auth: authClient,
    calendarId: "primary",
    resource: event,
  });

  await newQuiz.save();

  const remainingTime = new Date(startTime).getTime() - Date.now();

  const scheduleQuizActivation = (quizId, remainingTime) => {
    cron.schedule(new Date(Date.now() + remainingTime), async () => {
      try {
        await axios.post(`http://localhost:3000/api/quiz/activate/${quizId}`);
      } catch (error) {
        console.error("Error activating quiz:", error);
      }
    });
  };

  scheduleQuizActivation(newQuiz._id, remainingTime);

  res.status(201).json(apiResponse(newQuiz));
});

export const activateQuiz = asyncHandler(async (req, res) => {
  const { quizId } = req.params;

  if (!quizId) {
    throw new apiError(400, "Quiz ID is required");
  }

  const quiz = await Quiz.findByIdAndUpdate(
    quizId,
    { available: true },
    { new: true }
  );
  res.status(200).json(apiResponse(quiz));
});

export const getMarksOfUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new apiError(400, "User ID is required");
  }

  const user = await User.findById(userId)
    .select("name regdNo marks")
    .populate("marks.quizId");
  res.status(200).json(apiResponse(user));
});

export const getMarksOfQuiz = asyncHandler(async (req, res) => {
  const { quizId } = req.params;

  if (!quizId) {
    throw new apiError(400, "Quiz ID is required");
  }

  const quiz = await Quiz.findById(quizId).populate("attendees questions");
  res.status(200).json(apiResponse(quiz));
});

export const joinQuiz = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  const { userId } = req.body;

  if (!quizId) {
    throw new apiError(400, "Quiz ID is required");
  }

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    throw new apiError(404, "Quiz not found");
  }
  quiz.attendees.push(userId);
  await quiz.save();
  res.status(200).json(apiResponse(quiz));
});

// attempt quiz - WebSocket
// user leave - socket breaks - quiz may/mayn't submitted

export const submitAnswer = async (msg, ws) => {
  const { quizId, userId, questionId, answer } = JSON.parse(msg);

  if (!quizId || !userId || !questionId) {
    ws.send(apiResponse(null, "All fields are required"));
    return;
  }

  const user = await User.findById(userId);
  if (!user) {
    ws.send(apiResponse(null, "User not found"));
    return;
  }

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    ws.send(apiResponse(null, "Quiz not found"));
    return;
  }

  const question = quiz.questions.find((q) => q._id === questionId);
  if (!question) {
    ws.send(apiResponse(null, "Question not found"));
    return;
  }

  const remainingTime = Date.now() - (quiz.startTime + quiz.timeLimit);

  if (remainingTime <= 0) {
    await Question.updateMany({ quizId }, { $set: { submitted: true } });
    ws.send(apiResponse(null, "Quiz Time expired"));
  }

  const existingMark = user.marks.find(
    (mark) => mark.quizId.toString() === quizId
  );

  if (question.correctAnswer === answer) {
    if (existingMark) {
      existingMark.marks += question.marks;
    } else {
      user.marks.push({ quizId, marks: question.marks });
    }
    await user.save();
  }

  if (quiz.quizType === "submit-once") {
    question.submitted = true;
  } else {
    question.submitted = false;
  }

  await question.save();

  ws.send(apiResponse(user));
};
