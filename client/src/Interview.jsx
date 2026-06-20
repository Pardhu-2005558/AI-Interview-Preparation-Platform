import { useState } from "react";
import axios from "axios";

function Interview() {
  const questions = [
    "Tell me about yourself",
    "What are your strengths?",
    "What are your weaknesses?",
    "Why should we hire you?",
    "Where do you see yourself in 5 years?"
  ];

  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (index, value) => {
    setAnswers({
      ...answers,
      [index]: value,
    });
  };

  const submitInterview = async () => {
    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user"));

      // Step 1 - Save Interview
      const interviewResponse = await axios.post(
        "https://ai-interview-preparation-platform-hdj7.onrender.com/api/interview",
        {
          userId: user._id,
          answers,
        }
      );

      // Correctly get interview ID
      const interviewId = interviewResponse.data.interview._id;

      // Step 2 - AI Evaluation
      const aiResponse = await axios.post(
        "https://ai-interview-preparation-platform-hdj7.onrender.com/api/ai/evaluate",
        {
          interviewId,
          answers,
        }
      );

      setScore(aiResponse.data.score);
      setFeedback(aiResponse.data.feedback);

      alert("Interview Submitted Successfully!");

    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Something went wrong.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "900px",
        margin: "auto",
        fontFamily: "Arial",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#1e3a8a",
        }}
      >
        AI Interview Questions
      </h1>

      {questions.map((q, index) => (
        <div
          key={index}
          style={{
            marginBottom: "25px",
          }}
        >
          <h3>
            {index + 1}. {q}
          </h3>

          <textarea
            rows="4"
            cols="70"
            placeholder="Type your answer..."
            onChange={(e) =>
              handleChange(index, e.target.value)
            }
          />
        </div>
      ))}

      <button
        onClick={submitInterview}
        disabled={loading}
        style={{
          padding: "12px 25px",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        {loading ? "Analyzing..." : "Submit Interview"}
      </button>

      {feedback && (
        <div
          style={{
            marginTop: "40px",
            background: "#f8fafc",
            padding: "25px",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          }}
        >
          <h2
            style={{
              color: "#1e40af",
              textAlign: "center",
            }}
          >
            AI Interview Evaluation Report
          </h2>

          <h3
            style={{
              color: "green",
              textAlign: "center",
            }}
          >
            Overall Score: {score}/10
          </h3>

          <pre
            style={{
              whiteSpace: "pre-wrap",
              fontSize: "16px",
              lineHeight: "1.7",
            }}
          >
            {feedback}
          </pre>
        </div>
      )}
    </div>
  );
}

export default Interview;