require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ============================================
// Common Gemini Request Function
// ============================================
const generateWithRetry = async (prompt) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const MAX_RETRIES = 5;

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
  const result = await model.generateContent(prompt);

    return result.response.text();
    } catch (err) {
      if (
        (err.status === 429 || err.status === 503) &&
        i < MAX_RETRIES - 1
      ) {
        console.log("Gemini busy... Retrying...");
        await new Promise((resolve) =>
          setTimeout(resolve, 5000)
        );
      } else {
        throw err;
      }
    }
  }
};

// ============================================
// Evaluate Interview Answers
// ============================================
const analyzeInterview = async (answers) => {
  const prompt = `
You are an expert HR interviewer.

Evaluate the following interview answers.

Answers:
${JSON.stringify(answers, null, 2)}

Return the response exactly in this format.

Overall Score: X.X/10

Strengths:
- Point 1
- Point 2
- Point 3

Weaknesses:
- Point 1
- Point 2
- Point 3

Suggestions:
- Point 1
- Point 2
- Point 3
`;

  return await generateWithRetry(prompt);
};

// ============================================
// Generate Resume Interview Questions
// ============================================
const generateResumeQuestions = async (resumeText) => {
  const prompt = `
You are a Senior Technical Interviewer.

Below is a candidate's resume.

Generate exactly 15 interview questions.

Rules:

- Questions must be based only on the resume.
- Include technical questions.
- Include project questions.
- Include internship questions.
- Include skill-based questions.
- Include behavioral questions.
- Include one introduction question.
- Return ONLY a JSON array.

Example:

[
  "Tell me about yourself.",
  "Explain your Hospital Management System project.",
  "What challenges did you face?"
]

Resume:

${resumeText}
`;

  const response = await generateWithRetry(prompt);

  try {
    const cleaned = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const questions = JSON.parse(cleaned);

if (!Array.isArray(questions)) {
    throw new Error("Invalid questions format");
}

return questions;
  } catch (error) {
    console.log("JSON Parsing Error:", error);

    return response
      .split("\n")
      .map((q) =>
        q.replace(/^\d+\.\s*/, "").trim()
      )
      .filter((q) => q.length > 5);
  }
};

module.exports = {
  analyzeInterview,
  generateResumeQuestions,
};