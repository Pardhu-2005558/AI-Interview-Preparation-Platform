const Interview = require("../models/Interview");

const saveInterview = async (req, res) => {
  try {
    const {
      userId,
      answers,
      score,
      feedback,
    } = req.body;

    const interview = await Interview.create({
      userId,
      answers,
      score,
      feedback,
    });

    res.status(201).json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error("Interview Save Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  saveInterview,
};