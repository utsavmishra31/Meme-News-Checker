const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.checkMemeFact = async (req, res) => {
  try {
    const { text } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `

Analyze the following meme text and fact-check it using known news.

Meme Text: "${text}"

also tell Is the meme's claim True, False, or unverifiable?
provide reference and news source link.



`;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    res.status(200).json({ result: response });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
