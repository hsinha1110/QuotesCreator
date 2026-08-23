const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ===============================
// GENERATE AI QUOTE
// ===============================
const generateQuote = async (req, res) => {
  try {
    const {
      category = "Motivation",
      mood = "Positive",
      language = "English",
    } = req.body || {};

    const prompt = `
Generate ONE original quote.

Category: ${category}
Mood: ${mood}
Language: ${language}

IMPORTANT:
- The quote MUST be written completely in ${language}.
- Do NOT translate it into English.
- Do NOT mix languages.
- Return ONLY the quote.
- No explanation.
- No quotation marks.
- Keep it short and meaningful.
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.6,
      max_completion_tokens: 300,
      include_reasoning: false,
    });

    const quote = completion.choices[0]?.message?.content?.trim();

    if (!quote) {
      return res.status(500).json({
        success: false,
        message: "AI did not return a quote",
      });
    }

    return res.status(200).json({
      success: true,
      quote,
      language,
    });
  } catch (error) {
    console.error("Groq Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate quote",
      error: error.message,
    });
  }
};

module.exports = {
  generateQuote,
};
