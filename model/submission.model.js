import mongoose, { Schema } from "mongoose";

const submissionSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    quizId: {
      type: mongoose.Schema.ObjectId,
      ref: "Quiz",
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Submission = mongoose.model("Submission", submissionSchema);
