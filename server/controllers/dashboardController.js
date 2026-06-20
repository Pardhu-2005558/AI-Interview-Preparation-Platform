const Interview = require("../models/Interview");
const Resume = require("../models/Resume");
const ResumeInterview = require("../models/ResumeInterview");

const getDashboardStats = async (req, res) => {
  try {
    const { userId } = req.params;

    // ============================
    // AI Interviews
    // ============================
    const totalInterviews = await Interview.countDocuments({
      userId,
    });

    // ============================
    // Resume Uploads
    // ============================
    const totalResumes = await Resume.countDocuments({
      userId,
    });

    // ============================
    // Resume Interviews
    // (No authentication used)
    // ============================
    const totalResumeInterviews =
      await ResumeInterview.countDocuments();

    // ============================
    // Fetch Interviews
    // ============================
    const interviews = await Interview.find({
      userId,
    });

    const resumeInterviews =
      await ResumeInterview.find({
        completed: true,
      });

    // ============================
    // Merge Scores
    // ============================
    const allScores = [];

    interviews.forEach((i) => {
      if (typeof i.score === "number")
        allScores.push(i.score);
    });

    resumeInterviews.forEach((i) => {
  if (typeof i.score === "number") {
    let score = i.score;

    // Convert old 0-100 scores to 0-10
    if (score > 10) {
      score = Number((score / 10).toFixed(1));
    }

    allScores.push(score);
  }
});

    let averageScore = 0;
    let bestScore = 0;

    if (allScores.length > 0) {
      const total = allScores.reduce(
        (a, b) => a + b,
        0
      );

      averageScore = Number(
        (total / allScores.length).toFixed(1)
      );

      bestScore = Math.max(...allScores);
    }

    // ============================
    // Latest Interview
    // ============================
    const latestInterview =
      await Interview.findOne({
        userId,
      }).sort({
        createdAt: -1,
      });

    // ============================
    // Latest Resume
    // ============================
    const latestResume =
      await Resume.findOne({
        userId,
      }).sort({
        createdAt: -1,
      });

    // ============================
    // Latest Resume Interview
    // ============================
    const latestResumeInterview =
      await ResumeInterview.findOne().sort({
        createdAt: -1,
      });

    res.json({
      success: true,

      totalInterviews,

      totalResumes,

      totalResumeInterviews,

      averageScore,

      bestScore,

      latestInterview,

      latestResume,

      latestResumeInterview,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};