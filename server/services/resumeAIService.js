// server/services/resumeAIService.js

require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const analyzeResume = async (resumeText) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
You are an expert ATS Resume Analyzer.

Analyze the following resume carefully.

Resume:

${resumeText}

Return your response ONLY in this format.

Resume Score: x/10

ATS Score: x/100

Strengths:
- Point 1
- Point 2
- Point 3

Weaknesses:
- Point 1
- Point 2
- Point 3

Missing Skills:
- Point 1
- Point 2
- Point 3

Suggestions:
- Point 1
- Point 2
- Point 3

Recommended Job Roles:
- Role 1
- Role 2
- Role 3
`;

  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Gemini Resume Analysis Attempt ${attempt}`);

      const result = await model.generateContent(prompt);

      const response = await result.response;

      return response.text();
    } catch (error) {
      console.log(`Attempt ${attempt} Failed`);

      if (attempt === MAX_RETRIES) {
        console.error("Resume AI Error:", error);
        throw error;
      }

      console.log("Retrying in 3 seconds...");

      await sleep(3000);
    }
  }
};

module.exports = analyzeResume;