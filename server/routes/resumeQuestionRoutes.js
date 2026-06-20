const express = require("express");
const router = express.Router();

const {
  generateQuestions,
} = require("../controllers/resumeQuestionController");

// Generate Resume-Based Interview Questions
router.post("/questions", generateQuestions);

module.exports = router;