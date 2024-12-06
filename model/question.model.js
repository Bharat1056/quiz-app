import mongoose, { Schema } from "mongoose";

const questionSchema = new Schema(
  {
    quizId: {
      type: mongoose.Schema.ObjectId,
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
      default: [],
    },
    correctAnswer: {
      type: String,
      default: "",
    },
    marks: {
      type: Number,
      required: true,
    },
    submitted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Question = mongoose.model("Question", questionSchema);
