const { analyzeInterview } = require("../services/geminiService");
const Interview = require("../models/Interview");

const evaluateInterview = async (req, res) => {
  console.log("========== AI ROUTE HIT ==========");
  console.log(req.body);

  try {
    const { interviewId, answers } = req.body;

    console.log("Calling Gemini...");

    // Generate AI Feedback
    const feedback = await analyzeInterview(answers);

    console.log("Feedback Generated:");
    console.log(feedback);

    let score = 0;

    const scoreMatch = feedback.match(
      /Overall\s*Score\s*:\s*(\d+(\.\d+)?)\s*\/\s*(5|10)/i
    );

    if (scoreMatch) {
      const obtained = parseFloat(scoreMatch[1]);
      const total = parseInt(scoreMatch[3]);

      score = Number(((obtained / total) * 10).toFixed(1));
    }

    console.log("Extracted Score:", score);

    if (interviewId) {
      const updatedInterview = await Interview.findByIdAndUpdate(
        interviewId,
        {
          score,
          feedback,
        },
        {
          new: true,
        }
      );

      if (!updatedInterview) {
        console.log("Interview not found.");
      } else {
        console.log("Interview Updated Successfully");
      }
    }

    return res.status(200).json({
      success: true,
      score,
      feedback,
    });

  } catch (error) {
    console.error("========== AI ERROR ==========");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  evaluateInterview,
};