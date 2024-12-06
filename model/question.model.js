import mongoose, { mongo, Schema } from "mongoose";

const questionSchema = new Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
    questionText: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      index: true,
    },
    questionType: {
      type: String,
      enum: ["multiple-choice", "direct-answer"],
      default: "direct-answer",
    },
    options: {
      type: [String],
    },
    correctAnswer: {
      type: String,
      default: "",
    },
    mark: {
      type: Number,
      required: true,
    },
    submitted: {
      type: [mongoose.Schema.ObjectId],
      ref: "Submission",
    },
  },
  { timestamps: true }
);

export const Question = mongoose.model("Question", questionSchema);
