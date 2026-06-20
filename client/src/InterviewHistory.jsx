import { useEffect, useState } from "react";
import axios from "axios";

function InterviewHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await axios.get(
        `http://localhost:5000/api/history/interviews/${user._id}`
      );

      setHistory(res.data.interviews);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        width: "95%",
        margin: "30px auto",
        fontFamily: "Arial",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#1e40af",
        }}
      >
        Interview History
      </h1>

      {history.length === 0 ? (
        <h3 style={{ textAlign: "center" }}>
          No Interview History Found
        </h3>
      ) : (
        history.map((interview, index) => (
          <div
            key={interview._id}
            style={{
              background: "#f8fafc",
              marginBottom: "25px",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 0 10px rgba(0,0,0,0.15)",
            }}
          >
            <h2>
              Interview #{index + 1}
            </h2>

            <p>
              <b>Date:</b>{" "}
              {new Date(interview.createdAt).toLocaleString()}
            </p>

            <p>
              <b>Score:</b>{" "}
              {interview.score}/10
            </p>

            <hr />

            <h3>Your Answers</h3>

            <pre
              style={{
                whiteSpace: "pre-wrap",
                background: "#ffffff",
                padding: "15px",
                borderRadius: "8px",
              }}
            >
              {JSON.stringify(interview.answers, null, 2)}
            </pre>

            <h3>AI Feedback</h3>

            <pre
              style={{
                whiteSpace: "pre-wrap",
                background: "#ffffff",
                padding: "15px",
                borderRadius: "8px",
              }}
            >
              {interview.feedback}
            </pre>
          </div>
        ))
      )}
    </div>
  );
}

export default InterviewHistory;