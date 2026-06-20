require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateResumeQuestions = async (resumeText) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are an experienced Technical Interviewer.

Below is a candidate's resume.

${resumeText}

Generate exactly 10 interview questions.

Rules:

1. Ask questions only from the resume.
2. Mix HR and Technical questions.
3. Ask about projects.
4. Ask about skills.
5. Ask about education.
6. Ask about certifications.
7. Return ONLY a JSON array.

Example:

[
"Tell me about yourself.",
"Explain your Hospital Management System.",
"What is React?",
"Explain Python Lists.",
"..."
]

Do not return markdown.
Do not return explanations.
`;

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    return JSON.parse(text);

  } catch (error) {
    console.log("Resume Question Error:", error);
    throw error;
  }
};

module.exports = generateResumeQuestions;