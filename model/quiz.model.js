import mongoose, { Schema } from "mongoose";

const quizSchema = new Schema(
  {
    quizName: {
      type: String,
      require: true,
      trim: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questions: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Question",
    },
    available: {
      type: Boolean,
      default: false,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    timeLimit: {
      type: Number,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    attendees: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Quiz = mongoose.model("Quiz", quizSchema);
