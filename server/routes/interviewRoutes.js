// interviewRoutes.jsx
const express = require("express");

const {
  saveInterview,
} = require("../controllers/interviewController");

const router = express.Router();

router.post("/", saveInterview);

module.exports = router;