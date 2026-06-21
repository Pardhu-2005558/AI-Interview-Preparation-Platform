const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const ResumeInterview = require("../models/ResumeInterview");
const {
  generateResumeQuestions,
  analyzeInterview,
} = require("../services/geminiService");

// ==========================================
// Generate Resume Interview
// ==========================================
const generateResumeInterview = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

    // Get userId from request body
    const { userId } = req.body;

    console.log("================================");
    console.log("Resume Interview API");
    console.log("Received userId:", userId);
    console.log("Body:", req.body);
    console.log("================================");

    // Security check - ensure userId is present
    if (!userId) {
      // Clean up uploaded file if it exists
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    let resumeText = "";

    // PDF
    if (req.file.mimetype === "application/pdf") {
      const pdfBuffer = fs.readFileSync(req.file.path);
      const pdfData = await pdfParse(pdfBuffer);
      
      // Check if PDF content was extracted
      if (!pdfData.text) {
        throw new Error("Unable to read PDF content.");
      }
      
      resumeText = pdfData.text;
    }

    // DOCX
    else if (
      req.file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({
        path: req.file.path,
      });

      resumeText = result.value;
    }

    else {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(400).json({
        success: false,
        message: "Only PDF and DOCX files are allowed",
      });
    }

    if (!resumeText || resumeText.trim().length < 50) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(400).json({
        success: false,
        message: "Unable to extract resume text",
      });
    }

    // Generate questions using Gemini
    const questions = await generateResumeQuestions(resumeText);

    // Check if questions were generated successfully
    if (!Array.isArray(questions) || questions.length === 0) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(500).json({
        success: false,
        message: "Failed to generate interview questions.",
      });
    }

    // Create interview with userId
    const interview = await ResumeInterview.create({
      user: userId,
      fileName: req.file.originalname,
      resumeText,
      questions,
    });

    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(201).json({
      success: true,
      interviewId: interview._id,
      questions: interview.questions,
    });

  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Get All Resume Interviews
// ==========================================
const getResumeInterviews = async (req, res) => {
  try {
    const interviews = await ResumeInterview.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      interviews,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Get Single Resume Interview
// ==========================================
const getResumeInterview = async (req, res) => {
  try {
    const interview = await ResumeInterview.findById(
      req.params.id
    );

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    res.json({
      success: true,
      interview,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Submit Answers
// ==========================================
const submitResumeAnswers = async (req, res) => {
  try {
    const { answers } = req.body;

    // Validate answers is an array
    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Answers must be an array.",
      });
    }

    // Format answers for Gemini with better validation
    const formattedAnswers = {};
    answers.forEach((item, index) => {
      formattedAnswers[index] = item?.answer?.trim() || "";
    });

    // Check if every answer is empty
    const hasAnswers = Object.values(formattedAnswers).some(
      (answer) => answer.length > 0
    );

    if (!hasAnswers) {
      return res.status(400).json({
        success: false,
        message: "Please answer at least one question.",
      });
    }

    // Generate AI feedback with fallback
    let feedback = await analyzeInterview(formattedAnswers);
    feedback = feedback || "AI evaluation unavailable.";

    // Extract score from feedback - supports /5, /10, and /100
    let score = 0;

    const match = feedback.match(
      /(Overall\s*Score|Score)\s*:\s*(\d+(\.\d+)?)\s*(\/\s*(5|10|100))?/i
    );

    if (match) {
      const obtained = parseFloat(match[2]);

      if (match[4]) {
        const total = parseFloat(match[5]);
        score = Number(((obtained / total) * 10).toFixed(1));
      } else {
        score = Number(obtained.toFixed(1));
      }
    }

    // Safety check
    if (isNaN(score)) {
      score = 0;
    }

    // Update interview with answers, feedback, and score
    const updatedInterview = await ResumeInterview.findByIdAndUpdate(
      req.params.id,
      {
        answers,
        completed: true,
        feedback,
        score,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedInterview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: "Interview submitted successfully.",
      score,
      feedback,
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
  generateResumeInterview,
  getResumeInterviews,
  getResumeInterview,
  submitResumeAnswers,
};