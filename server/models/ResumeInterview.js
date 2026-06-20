const mongoose = require("mongoose");

const resumeInterviewSchema = new mongoose.Schema(
  {
    // User - Made optional since auth is removed
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },

    // Uploaded Resume File Name
    fileName: {
      type: String,
      required: true,
    },

    // Extracted Resume Text
    resumeText: {
      type: String,
      required: true,
    },

    // AI Generated Questions
    questions: {
      type: [String],
      default: [],
    },

    // Candidate Answers
    answers: {
      type: [
        {
          question: String,
          answer: String,
        },
      ],
      default: [],
    },

    // AI Evaluation
    feedback: {
      type: String,
      default: "",
    },

    score: {
      type: Number,
      default: 0,
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    suggestions: {
      type: [String],
      default: [],
    },

    // Interview Status
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ResumeInterview",
  resumeInterviewSchema
);