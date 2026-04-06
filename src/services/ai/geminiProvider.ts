import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Initializes the GoogleGenerativeAI client using the GEMINI_API_KEY.
 * The key is provided to the frontend build by Vite's Define plugin.
 */
const apiKey = process.env.GEMINI_API_KEY || '';

if (!apiKey) {
  console.warn('[AI_STANDBY] GEMINI_API_KEY is not defined. AI nodes will operate in simulation mode.');
}

/**
 * Global AI client and helper functions for model generation.
 */
export const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Retrieves a specialized generative model.
 * @param modelName Defaults to gemini-1.5-flash for performance.
 * @returns A GenerativeModel instance for content generation.
 */
export const getGeminiModel = (modelName: string = 'gemini-1.5-flash') => {
  return genAI.getGenerativeModel({ model: modelName });
};
