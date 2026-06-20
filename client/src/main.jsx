import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import Dashboard from "./Dashboard";
import Interview from "./Interview";
import ResumeUpload from "./ResumeUpload";
import ResumeHistory from "./ResumeHistory";
import InterviewHistory from "./InterviewHistory";

// Resume Interview
import ResumeInterview from "./ResumeInterview";
import ResumeInterviewHistory from "./ResumeInterviewHistory";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/interview" element={<Interview />} />

      <Route path="/resume" element={<ResumeUpload />} />

      <Route
        path="/resume-interview"
        element={<ResumeInterview />}
      />

      <Route
        path="/resume-interview-history"
        element={<ResumeInterviewHistory />}
      />

      <Route
        path="/resume-history"
        element={<ResumeHistory />}
      />

      <Route
        path="/interview-history"
        element={<InterviewHistory />}
      />
    </Routes>
  </BrowserRouter>
);