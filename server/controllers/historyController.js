// historyController.js
const Interview = require("../models/Interview");
const Resume = require("../models/Resume");

// Get Interview History
const getInterviewHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const interviews = await Interview.find({ userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      interviews,
    });
  } catch (error) {
    console.log("Interview History Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch interview history",
    });
  }
};

// Get Resume History
const getResumeHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const resumes = await Resume.find({ userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      resumes,
    });
  } catch (error) {
    console.log("Resume History Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch resume history",
    });
  }
};

module.exports = {
  getInterviewHistory,
  getResumeHistory,
};