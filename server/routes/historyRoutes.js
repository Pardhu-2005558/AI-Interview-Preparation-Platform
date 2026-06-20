// historyRoutes.js
const express = require("express");
const router = express.Router();

const {
  getInterviewHistory,
  getResumeHistory,
} = require("../controllers/historyController");

router.get("/interviews/:userId", getInterviewHistory);

router.get("/resumes/:userId", getResumeHistory);

module.exports = router;