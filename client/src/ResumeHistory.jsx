// ResumeHistory.jsx
import { useEffect, useState } from "react";
import axios from "axios";

function ResumeHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await axios.get(
        `http://localhost:5000/api/history/resumes/${user._id}`
      );

      setHistory(res.data.resumes);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        width: "90%",
        margin: "30px auto",
        fontFamily: "Arial",
      }}
    >
      <h1>Resume History</h1>

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>S.No</th>
            <th>Resume</th>
            <th>Uploaded Date</th>
            <th>Analysis</th>
          </tr>
        </thead>

        <tbody>
          {history.map((resume, index) => (
            <tr key={resume._id}>
              <td>{index + 1}</td>

              <td>{resume.fileName}</td>

              <td>
                {new Date(
                  resume.createdAt
                ).toLocaleString()}
              </td>

              <td>
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    maxWidth: "500px",
                  }}
                >
                  {resume.analysis}
                </pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResumeHistory;