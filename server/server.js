const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load Environment Variables
dotenv.config();

// Database Connection
const connectDB = require("./config/db");

// ================= Routes =================

const authRoutes = require("./routes/authRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const aiRoutes = require("./routes/aiRoutes");

const resumeRoutes = require("./routes/resumeRoutes");
const resumeQuestionRoutes = require("./routes/resumeQuestionRoutes");
const resumeInterviewRoutes = require("./routes/resumeInterviewRoutes");

const historyRoutes = require("./routes/historyRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// ==========================================

const app = express();

// ================= Middleware =================

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ===============================================

// ================= API Routes =================

// Authentication
app.use("/api/auth", authRoutes);

// Normal Interview
app.use("/api/interview", interviewRoutes);

// AI Evaluation
app.use("/api/ai", aiRoutes);

// Resume Upload
app.use("/api/resume", resumeRoutes);

// Resume Question Generation
app.use("/api/resume", resumeQuestionRoutes);

// Resume-Based Interview
app.use("/api/resume-interview", resumeInterviewRoutes);

// Interview History
app.use("/api/history", historyRoutes);

// Dashboard
app.use("/api/dashboard", dashboardRoutes);

// ===============================================

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Interview Preparation Platform API Running...",
  });
});

// ================= 404 Handler =================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found",
  });
});

// ================= Error Handler =================

app.use((err, req, res, next) => {
  console.error("Server Error:");
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ===============================================

const PORT = process.env.PORT || 5000;

// ================= Start Server =================

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log("=========================================");
      console.log("AI Interview Preparation Platform");
      console.log("MongoDB Connected Successfully!");
      console.log(`Server running on Port ${PORT}`);
      console.log("=========================================");
    });
  } catch (error) {
    console.error("Server Startup Failed");
    console.error(error);
    process.exit(1);
  }
};

startServer();