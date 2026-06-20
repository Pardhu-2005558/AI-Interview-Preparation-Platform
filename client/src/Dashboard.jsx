import { useEffect, useState } from "react";
import PerformanceChart from "./PerformanceChart";
import axios from "axios";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({
    totalInterviews: 0,
    totalResumes: 0,
    totalResumeInterviews: 0,
    averageScore: 0,
    bestScore: 0,
    latestInterview: null,
    latestResume: null,
    latestResumeInterview: null,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await axios.get(
         `https://ai-interview-preparation-platform-hdj7.onrender.com/api/dashboard/${user._id}`
      );

      setStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const buttonStyle = {
    width: "260px",
    padding: "14px",
    margin: "10px",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#1677ff",
    color: "white",
  };

  const cardStyle = {
    width: "220px",
    padding: "20px",
    borderRadius: "10px",
    background: "#ffffff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    textAlign: "center",
  };

  return (
    <div
      style={{
        width: "95%",
        margin: "30px auto",
        fontFamily: "Arial",
      }}
    >
      <h1 style={{ textAlign: "center" }}>
        AI Interview Preparation Platform
      </h1>

      <h2 style={{ textAlign: "center" }}>
        Welcome, {user?.name}
      </h2>

      <p style={{ textAlign: "center" }}>
        <b>Email:</b> {user?.email}
      </p>

      <h2 style={{ marginTop: "40px" }}>
        Dashboard Analytics
      </h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        <div style={cardStyle}>
          <h3>📝 Interviews</h3>
          <h1>{stats.totalInterviews}</h1>
        </div>

        <div style={cardStyle}>
          <h3>📄 Resumes</h3>
          <h1>{stats.totalResumes}</h1>
        </div>

        <div style={cardStyle}>
          <h3>🎯 Resume Interviews</h3>
          <h1>{stats.totalResumeInterviews}</h1>
        </div>

        <div style={cardStyle}>
          <h3>⭐ Average Score</h3>
          <h1>{stats.averageScore}/10</h1>
        </div>

        <div style={cardStyle}>
          <h3>🏆 Best Score</h3>
          <h1>{stats.bestScore}/10</h1>
        </div>
      </div>

      <div
        style={{
          marginTop: "40px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          background: "#fafafa",
        }}
      >
        <h2>Recent Activity</h2>

        <p>
          <b>Latest Interview:</b>{" "}
          {stats.latestInterview
            ? new Date(
                stats.latestInterview.createdAt
              ).toLocaleString()
            : "No Interviews"}
        </p>

        <p>
          <b>Latest Resume:</b>{" "}
          {stats.latestResume
            ? stats.latestResume.fileName
            : "No Resume Uploaded"}
        </p>
        <p>
  <b>Latest Resume Interview:</b>{" "}
  {stats.latestResumeInterview
    ? new Date(
        stats.latestResumeInterview.createdAt
      ).toLocaleString()
    : "No Resume Interviews"}
</p>
      </div>

      <div
        style={{
          marginTop: "40px",
          textAlign: "center",
        }}
      >
        <button
          style={buttonStyle}
          onClick={() =>
            (window.location.href = "/interview")
          }
        >
          📝 Start AI Interview
        </button>

        <button
          style={buttonStyle}
          onClick={() =>
            (window.location.href = "/resume")
          }
        >
          📄 Resume Analyzer
        </button>

        <button
          style={buttonStyle}
          onClick={() =>
            (window.location.href =
              "/resume-interview")
          }
        >
          🎯 Resume Interview
        </button>

        <button
          style={buttonStyle}
          onClick={() =>
            (window.location.href =
              "/interview-history")
          }
        >
          📋 Interview History
        </button>

        <button
          style={buttonStyle}
          onClick={() =>
            (window.location.href =
              "/resume-history")
          }
        >
          📑 Resume History
        </button>

        <button
          style={buttonStyle}
          onClick={() =>
            (window.location.href =
              "/resume-interview-history")
          }
        >
          📚 Resume Interview History
        </button>

        <br />

        <button
          onClick={logout}
          style={{
            ...buttonStyle,
            marginTop: "20px",
            backgroundColor: "#ff4d4f",
          }}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;