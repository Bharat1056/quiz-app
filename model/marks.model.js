import mongoose, { Schema } from "mongoose";

const marksSchema = new Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    totalMarks: {
      type: Number,
      default: 0,
      required: true,
    },
    submitted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Marks = mongoose.model("Marks", marksSchema);