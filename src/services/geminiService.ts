import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY || "";

export const getGeminiResponse = async (prompt: string) => {
  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY is not set.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: {
      thinkingConfig: {
        thinkingLevel: ThinkingLevel.HIGH,
      },
    },
  });

  return response.text;
};
