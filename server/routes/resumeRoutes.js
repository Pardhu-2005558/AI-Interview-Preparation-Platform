const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const {
  uploadResume,
} = require("../controllers/resumeController");

// Upload Resume
router.post(
  "/upload",
  upload.single("resume"),
  uploadResume
);

module.exports = router;