import mongoose, { Schema } from "mongoose";

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
    userMarks: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Marks",
    },
  },
  { timeStamps: true }
);

export const User = mongoose.model("User", userSchema);
