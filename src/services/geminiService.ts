import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || "";

export const getGeminiResponse = async (prompt: string) => {
  if (!API_KEY) {
    console.warn("[AI] GEMINI_API_KEY is not set. Simulation mode active.");
    return "AI Module is in standby (Key Missing).";
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    // Use the reliable thinking-exp model or fallback to 1.5 flash
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error("[AI] Reasoning Error:", error);
    throw error;
  }
};
