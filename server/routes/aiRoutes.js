// aiRoutes.js
const express = require("express");

const {
  evaluateInterview,
} = require("../controllers/aiController");

const router = express.Router();

router.post("/evaluate", evaluateInterview);

module.exports = router;