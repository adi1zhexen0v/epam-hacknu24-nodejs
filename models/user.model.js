import mongoose from "mongoose";

const pointsSchema = new mongoose.Schema(
  {
    grammarPoints: {
      type: Number,
      required: true,
      default: 0,
    },
    readingPoints: {
      type: Number,
      required: true,
      default: 0,
    },
    speakingPoints: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: false,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
    trim: true,
  },
  role: {
    type: String,
    enum: ["Kazakh", "Kazakhstani", "Non-Kazakhstani"],
    default: "Kazakhtani",
  },
  mainPoints: {
    type: pointsSchema,
    default: {
      grammarPoints: 0,
      readingPoints: 0,
      speakingPoints: 0,
    },
  },
});

export const User = mongoose.model("User", userSchema);
