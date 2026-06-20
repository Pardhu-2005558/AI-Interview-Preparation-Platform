const Resume = require("../models/Resume");

const extractResumeText = require("../services/resumeParser");
const generateResumeQuestions = require("../services/resumeQuestionService");

const generateQuestions = async (req, res) => {
  try {
    const { resumeId } = req.body;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "Resume ID is required",
      });
    }

    // Find Resume
    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // Read uploaded PDF again
    const resumePath = "uploads/" + resume.fileName;

    // Extract text
    const resumeText = await extractResumeText(resumePath);

    console.log("Resume Text Extracted Successfully");

    // Generate Questions
    const questions = await generateResumeQuestions(resumeText);

    console.log("Generated Resume Questions");

    return res.status(200).json({
      success: true,
      questions,
    });

  } catch (error) {
    console.log("Resume Question Error:");
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  generateQuestions,
};