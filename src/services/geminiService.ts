import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || "";

export const getGeminiResponse = async (prompt: string, imageUrls?: string[]) => {
  if (!API_KEY) {
    console.warn("[AI] GEMINI_API_KEY is not set. Simulation mode active.");
    return "AI Module is in standby (Key Missing).";
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    // Use flash for both text and vision
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    let result;
    if (imageUrls && imageUrls.length > 0) {
      // Vision mode: include images in request with proper format
      const parts: any[] = [{ text: prompt }];
      for (const url of imageUrls) {
        if (url.startsWith('data:')) {
          // Base64 inline
          const match = url.match(/^data:([^;]+);base64,(.+)$/);
          if (match) {
            parts.push({ inlineData: { mimeType: match[1], data: match[2] } });
          }
        } else {
          // URL - use imageUrl object (not text)
          parts.push({ imageUrl: { url } });
        }
      }
      result = await model.generateContent({ contents: [{ role: 'user', parts }] });
    } else {
      // Text-only mode
      result = await model.generateContent(prompt);
    }
    
    return result.response.text();
  } catch (error: any) {
    console.error("[AI] Reasoning Error:", error);
    const errorMsg = error?.message || '';
    // Return a user-friendly message instead of throwing
    if (errorMsg.includes('image') || errorMsg.includes('vision') || errorMsg.includes('image input') || errorMsg.includes('400')) {
      return "Image analysis is not available with the current model. Please try text-only queries.";
    }
    throw error;
  }
};
