import { useState } from "react";
import axios from "axios";

function ResumeInterview() {
  const [resume, setResume] = useState(null);
  const [interviewId, setInterviewId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateQuestions = async () => {
    if (!resume) {
      alert("Please upload a resume.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", resume);

      const res = await axios.post(
        "http://localhost:5000/api/resume-interview/generate",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setQuestions(res.data.questions);
      setInterviewId(res.data.interviewId);
      setAnswers({});
      setFeedback("");
      setScore(null);

    } catch (err) {
      console.log(err);
      alert(
        err.response?.data?.message ||
        "Failed to generate interview."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index, value) => {
    setAnswers({
      ...answers,
      [index]: value,
    });
  };

  const submitInterview = async () => {
    if (!interviewId) {
      alert("Please generate the interview first.");
      return;
    }

    if (Object.keys(answers).length !== questions.length) {
      alert("Please answer all questions.");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/resume-interview/${interviewId}/submit`,
        {
          answers: Object.keys(answers).map((key) => ({
            question: questions[key],
            answer: answers[key],
          })),
        }
      );

      setFeedback(res.data.feedback);
      setScore(res.data.score || 0);

      alert("Resume Interview Submitted Successfully!");

    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Something went wrong.");
      }
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
        Resume Based Interview
      </h1>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={(e) => setResume(e.target.files[0])}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
        }}
      />

      {resume && (
        <p>
          Selected Resume:
          <b> {resume.name}</b>
        </p>
      )}

      {interviewId && (
        <p style={{ color: "green" }}>
          Interview Created Successfully
        </p>
      )}

      <button
        onClick={generateQuestions}
        disabled={loading}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
          opacity: loading ? 0.6 : 1,
        }}
      >
        Generate Resume Interview
      </button>

      {loading && (
        <h3 style={{ color: "blue" }}>
          Generating Questions...
        </h3>
      )}

      {questions.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h2>Resume-Based Questions</h2>

          {questions.map((question, index) => (
            <div
              key={index}
              style={{
                marginBottom: "25px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
              }}
            >
              <h4>
                {index + 1}. {question}
              </h4>

              <textarea
                rows="4"
                placeholder="Type your answer..."
                value={answers[index] || ""}
                onChange={(e) =>
                  handleAnswer(index, e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px",
                }}
              />
            </div>
          ))}

          <button
            onClick={submitInterview}
            disabled={!questions.length}
            style={{
              padding: "12px 30px",
              background: "#1677ff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              opacity: !questions.length ? 0.5 : 1,
            }}
          >
            Submit Resume Interview
          </button>
        </div>
      )}

      {feedback && (
        <div
          style={{
            marginTop: "40px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            background: "#f8f8f8",
          }}
        >
          <h2>AI Evaluation</h2>

          <h3 style={{ color: "green" }}>
            Overall Score: {score}
          </h3>

          <pre
            style={{
              whiteSpace: "pre-wrap",
              lineHeight: "1.7",
              fontSize: "15px",
            }}
          >
            {feedback}
          </pre>
        </div>
      )}
    </div>
  );
}

export default ResumeInterview;