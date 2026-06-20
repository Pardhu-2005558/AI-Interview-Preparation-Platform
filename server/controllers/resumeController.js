const Resume = require("../models/Resume");

const extractResumeText = require("../services/resumeParser");
const analyzeResume = require("../services/resumeAIService");

const uploadResume = async (req, res) => {
  try {
    console.log("========== RESUME UPLOAD ==========");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No resume uploaded",
      });
    }

    const userId = req.body.userId;

    console.log("Received User ID:", userId);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId not received from frontend",
      });
    }

    console.log("File:", req.file.originalname);

    // Extract resume text
    const resumeText = await extractResumeText(req.file.path);

    console.log("Resume Text Extracted Successfully");

    // AI Analysis
    const analysis = await analyzeResume(resumeText);

    console.log("Resume Analysis Completed");

    // Save to MongoDB
    const newResume = new Resume({
      userId,
      fileName: req.file.filename,
      analysis,
    });

    await newResume.save();

    console.log("Resume Saved Successfully");

    return res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      analysis,
    });

  } catch (error) {
    console.error("Resume Upload Error:", error);

    if (error.status === 503) {
      return res.status(503).json({
        success: false,
        message:
          "Gemini AI is currently busy. Please wait a few seconds and try again.",
      });
    }

    if (error.status === 401) {
      return res.status(401).json({
        success: false,
        message: "Invalid Gemini API Key.",
      });
    }

    if (
      error.message &&
      error.message.toLowerCase().includes("pdf")
    ) {
      return res.status(400).json({
        success: false,
        message: "Unable to read the uploaded PDF.",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  uploadResume,
};