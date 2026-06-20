// client/src/ResumeUpload.jsx

import { useState } from "react";
import axios from "axios";

function ResumeUpload() {
  const [resume, setResume] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadResume = async () => {
    if (!resume) {
      alert("Please select a PDF Resume");
      return;
    }

    // Get logged-in user
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user._id) {
      alert("User not logged in.");
      return;
    }

    const formData = new FormData();

    formData.append("resume", resume);

    // IMPORTANT
    formData.append("userId", user._id);

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/resume/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAnalysis(response.data.analysis);
    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Resume Upload Failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "900px",
        margin: "30px auto",
        fontFamily: "Arial",
      }}
    >
      <h1 style={{ textAlign: "center" }}>
        AI Resume Analyzer
      </h1>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setResume(e.target.files[0])}
      />

      <button
        onClick={uploadResume}
        style={{
          marginLeft: "20px",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Analyze Resume
      </button>

      {loading && (
        <h3 style={{ color: "blue" }}>
          Analyzing Resume...
        </h3>
      )}

      {analysis && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            background: "#f8f8f8",
          }}
        >
          <h2>Resume Analysis</h2>

          <pre
            style={{
              whiteSpace: "pre-wrap",
              fontSize: "15px",
              lineHeight: "1.6",
            }}
          >
            {analysis}
          </pre>
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;