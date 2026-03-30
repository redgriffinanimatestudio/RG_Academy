import axios from 'axios';

const API_KEY = process.env.GEMINI_API_KEY || "";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export const generateContent = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY is not set.");
  }

  try {
    const response = await axios.post(`${API_URL}?key=${API_KEY}`, {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    });

    return response.data.candidates[0].content.parts[0].text;
  } catch (error: any) {
    console.error('[Gemini Service Error]:', error.response?.data || error.message);
    throw new Error("Failed to generate AI content.");
  }
};
