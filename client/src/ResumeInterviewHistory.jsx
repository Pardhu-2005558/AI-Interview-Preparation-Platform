import { useEffect, useState } from "react";
import axios from "axios";

function ResumeInterviewHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setError(null);
      // ✅ FIX: Call the correct endpoint that returns all interviews
      const res = await axios.get(
        "http://localhost:5000/api/resume-interview"
      );

      // ✅ FIX: Access the correct property from response
      setHistory(res.data.interviews || []);
    } catch (error) {
      console.error("Error loading history:", error);
      setError("Failed to load interview history. Please try again.");
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "40px",
          fontFamily: "Arial",
        }}
      >
        <h2>Loading Resume Interview History...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "40px",
          fontFamily: "Arial",
        }}
      >
        <h2 style={{ color: "red" }}>{error}</h2>
        <button
          onClick={loadHistory}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "90%",
        maxWidth: "1200px",
        margin: "30px auto",
        fontFamily: "Arial",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        Resume Interview History
      </h1>

      {history.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <h2>No Resume Interviews Found.</h2>
          <p style={{ color: "#666" }}>
            You haven't completed any resume interviews yet.
          </p>
        </div>
      ) : (
        history.map((item, index) => {
          const questions = Array.isArray(item.questions)
            ? item.questions
            : [];

          const answers = Array.isArray(item.answers)
              ? item.answers
              : {};

          return (
            <div
              key={item._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "20px",
                marginBottom: "25px",
                background: "#fafafa",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <h2 style={{ color: "#333", marginTop: "0" }}>
                Interview #{index + 1}
              </h2>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(item.createdAt).toLocaleString()}
              </p>

              <p>
                <strong>File:</strong> {item.fileName || "Unknown"}
              </p>

              <p>
                <strong>Score:</strong>{" "}
                <span
                  style={{
                    fontWeight: "bold",
                    color: item.score >= 7 ? "#28a745" : item.score >= 5 ? "#ffc107" : "#dc3545",
                  }}
                >
                  {item.score ?? 0}/10
                </span>
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color: item.completed ? "#28a745" : "#ffc107",
                    fontWeight: "bold",
                  }}
                >
                  {item.completed ? "Completed" : "In Progress"}
                </span>
              </p>

              <h3 style={{ marginTop: "20px" }}>Questions & Answers</h3>

              {questions.length === 0 ? (
                <p style={{ color: "#666" }}>No Questions Available.</p>
              ) : (
                questions.map((question, qIndex) => (
                  <div
                    key={qIndex}
                    style={{
                      marginBottom: "18px",
                      padding: "10px",
                      background: "white",
                      borderRadius: "5px",
                      border: "1px solid #eee",
                    }}
                  >
                    <p style={{ margin: "5px 0" }}>
                      <strong>Q{qIndex + 1}. </strong>
                      {question}
                    </p>

                    <p style={{ margin: "5px 0", paddingLeft: "20px" }}>
                      <strong>Answer:</strong> {answers[qIndex]?.answer ?? "No Answer"}                      
                    </p>
                  </div>
                ))
              )}

              {item.feedback && (
                <>
                  <h3 style={{ marginTop: "20px" }}>AI Feedback</h3>
                  <pre
                    style={{
                      whiteSpace: "pre-wrap",
                      background: "#f5f5f5",
                      padding: "15px",
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                      fontFamily: "inherit",
                      lineHeight: "1.6",
                    }}
                  >
                    {item.feedback}
                  </pre>
                </>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default ResumeInterviewHistory;