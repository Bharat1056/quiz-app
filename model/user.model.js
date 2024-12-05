import mongoose, { Schema } from "mongoose";

const marksSchema = new Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    marks: {
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

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      trim: true,
      index: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    password: {
      type: String,
    },
    regdNo: {
      type: Number,
      trim: true,
      index: true,
      match: /^\d{10}$/,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: true,
    },
    marks: {
      type: [marksSchema],
    },
  },
  { timeStamps: true }
);

export const Marks = mongoose.model("Marks", marksSchema);
export const User = mongoose.model("User", userSchema);
