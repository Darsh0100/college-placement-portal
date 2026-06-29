const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index:true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "recruiter", "admin"],
      default: "student",
    },

    skills: {
      type: [String],
      default: [],
    },

    branch: {
      type: String,
      enum: ["CSE", "IT","CSE-AIML","CSE-DS", "ECE", "EE", "ME", "CE"], // Enforces data integrity
      // required: true
    },

    cgpa: {
      type: Number,
      min: 0,
      max: 10,
    },

    resumeUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
