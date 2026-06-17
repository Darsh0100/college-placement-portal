const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    skills: [
      {
        type: String,
      },
    ],

    jobType: {
      type: String,
      enum: ["Internship", "Full-Time", "Part-Time", "Remote", "Contract"],
      required: true,
    },

    package: {
      type: Number,
      required: true,
    },

    openings: {
      type: Number,
      default: 1,
    },

    eligibility: {
      minCGPA: {
        type: Number,
        default: 0,
      },

      allowedBranches: [
        {
          type: String,
        },
      ],

      maxBacklogs: {
        type: Number,
        default: 0,
      },
    },

    applicationDeadline: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },

    applicantsCount: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);
