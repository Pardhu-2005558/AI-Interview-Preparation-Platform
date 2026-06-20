const express = require("express");
const router = express.Router();

const {
  generateResumeInterview,
  getResumeInterviews,
  getResumeInterview,
  submitResumeAnswers,
} = require("../controllers/resumeInterviewController");

const upload = require("../middleware/upload"); // or uploadMiddleware if that's your filename

router.post(
  "/generate",
  upload.single("resume"),
  generateResumeInterview
);

router.get("/", getResumeInterviews);

router.get("/:id", getResumeInterview);

router.put("/:id/submit", submitResumeAnswers);

module.exports = router;