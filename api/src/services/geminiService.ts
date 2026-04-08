/**
 * geminiService.ts — Legacy compatibility shim
 * Delegates to the unified aiService which supports OmniRoute + Gemini
 */
export { generateContent as getGeminiResponse, generateContent, listAvailableModels, default } from './aiService';
