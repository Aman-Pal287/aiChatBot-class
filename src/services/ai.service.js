const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

async function main(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  });
  return response.text;
}

module.exports = main;
