/**
 * RG Academy — Unified AI Service
 * Routes through OmniRoute (local dev) or Gemini (production)
 * 
 * OmniRoute: http://localhost:4000/v1  (OpenAI-compatible)
 * Gemini: https://generativelanguage.googleapis.com/v1beta
 */

import axios from 'axios';

// --- OMNI ROUTE CONFIG ---
const OMNI_URL   = process.env.OMNI_BASE_URL || 'http://localhost:4000/v1';
const OMNI_KEY   = process.env.OMNI_API_KEY  || '';
const OMNI_MODEL = process.env.OMNI_MODEL    || 'alibaba/qwen3-coder-plus';

// --- VISION MODEL CONFIG (for image analysis) ---
// Try OpenRouter vision models first, fall back to Gemini
const OMNI_VISION_MODEL = process.env.OMNI_VISION_MODEL || 'openai/gpt-4o-mini';
const GEMINI_VISION_MODEL = 'gemini-1.5-flash';

// --- GEMINI FALLBACK CONFIG ---
const GEMINI_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_VISION_MODEL}:generateContent`;

// Use OmniRoute when explicitly enabled OR in development mode
const USE_OMNI = process.env.USE_OMNI === 'true' || process.env.NODE_ENV !== 'production';

// ─────────────────────────────────────────────────────────
//  generateContent — main entry, backward-compatible
// ─────────────────────────────────────────────────────────
export const generateContent = async (
  prompt: string,
  options: { temperature?: number; maxTokens?: number; systemPrompt?: string } = {}
): Promise<string> => {
  const { temperature = 0.7, maxTokens = 2048, systemPrompt } = options;

  if (USE_OMNI) {
    return generateViaOmniRoute(prompt, { temperature, maxTokens, systemPrompt });
  }
  return generateViaGemini(prompt, { temperature, maxTokens });
};

// ─────────────────────────────────────────────────────────
//  generateContentWithImages — for image analysis tasks
// ─────────────────────────────────────────────────────────
export const generateContentWithImages = async (
  prompt: string,
  imageUrls: string[],
  options: { temperature?: number; maxTokens?: number; systemPrompt?: string } = {}
): Promise<string> => {
  const { temperature = 0.7, maxTokens = 2048, systemPrompt } = options;

  // Build multimodal content for vision model
  const contents: any[] = imageUrls.map(url => ({
    type: 'image_url',
    image_url: { url }
  }));
  contents.unshift({ type: 'text', text: prompt });

  const messages: { role: string; content: any[] }[] = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: [{ type: 'text', text: systemPrompt }] });
  }
  messages.push({ role: 'user', content: contents });

  if (USE_OMNI) {
    return generateVisionViaOmniRoute(messages, { temperature, maxTokens });
  }
  return generateVisionViaGemini(prompt, imageUrls, { temperature, maxTokens });
};

// ─────────────────────────────────────────────────────────
//  OmniRoute vision path
// ─────────────────────────────────────────────────────────
async function generateVisionViaOmniRoute(
  messages: { role: string; content: any[] }[],
  options: { temperature: number; maxTokens: number }
): Promise<string> {
  let lastError: string = '';
  
  // Try vision model first
  try {
    const response = await axios.post(
      `${OMNI_URL}/chat/completions`,
      {
        model: OMNI_VISION_MODEL,
        messages,
        temperature: options.temperature,
        max_tokens: options.maxTokens,
      },
      {
        headers: {
          Authorization: `Bearer ${OMNI_KEY}`,
          'Content-Type': 'application/json',
          'X-RG-Source': 'rg-academy-server',
        },
        timeout: 60000,
      }
    );

    const text = response.data?.choices?.[0]?.message?.content;
    if (!text) throw new Error('Empty response from OmniRoute vision');
    console.log(`[AI] OmniRoute Vision ✅ model=${OMNI_VISION_MODEL}`);
    return text;
  } catch (err: any) {
    lastError = err.message;
    console.warn(`[AI] OmniRoute Vision model ${OMNI_VISION_MODEL} failed:`, lastError);
  }
  
  // Try OpenRouter alternatives for vision
  const visionModels = ['openai/gpt-4o', 'google/gemini-pro-vision', 'anthropic/claude-3-opus'];
  for (const model of visionModels) {
    try {
      const response = await axios.post(
        `${OMNI_URL}/chat/completions`,
        {
          model,
          messages,
          temperature: options.temperature,
          max_tokens: options.maxTokens,
        },
        {
          headers: {
            Authorization: `Bearer ${OMNI_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 60000,
        }
      );
      const text = response.data?.choices?.[0]?.message?.content;
      if (text) {
        console.log(`[AI] OmniRoute Vision ✅ model=${model}`);
        return text;
      }
    } catch (err: any) {
      console.warn(`[AI] OmniRoute Vision try ${model}:`, err.message);
    }
  }
  
  // All OmniRoute options failed, fall back to Gemini
  console.warn('[AI] All OmniRoute vision models failed, falling back to Gemini');
  const textPrompt = messages.find(m => m.role === 'user')?.content.find(c => c.type === 'text')?.text || '';
  const imageUrls = messages.filter(m => m.role === 'user').flatMap(m => 
    m.content.filter(c => c.type === 'image_url').map(c => c.image_url.url)
  );
  return generateVisionViaGemini(textPrompt, imageUrls, options);
}

// ─────────────────────────────────────────────────────────
//  Gemini vision fallback
// ─────────────────────────────────────────────────────────
async function generateVisionViaGemini(
  prompt: string,
  imageUrls: string[],
  options: { temperature: number; maxTokens: number }
): Promise<string> {
  if (!GEMINI_KEY) {
    throw new Error('GEMINI_API_KEY is not set and vision models are unavailable.');
  }

  try {
    // Gemini vision format: use imageUrl objects for remote URLs
    const parts: any[] = [{ text: prompt }];
    
    for (const url of imageUrls) {
      if (url.startsWith('data:')) {
        // Base64 inline
        const match = url.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          parts.push({ inlineData: { mimeType: match[1], data: match[2] } });
        }
      } else {
        // URL reference - use imageUrl object
        parts.push({ imageUrl: { url } });
      }
    }

    const response = await axios.post(
      `${GEMINI_URL}?key=${GEMINI_KEY}`,
      {
        contents: [{ parts }],
        generationConfig: {
          temperature: options.temperature,
          maxOutputTokens: options.maxTokens,
        },
      }
    );

    const candidates = response.data?.candidates;
    if (!candidates?.length || !candidates[0]?.content?.parts?.length) {
      throw new Error('Invalid Gemini vision response: no candidates');
    }
    console.log('[AI] Gemini Vision ✅');
    return candidates[0].content.parts[0].text;
  } catch (error: any) {
    console.error('[AI Gemini Vision Error]:', error.response?.data || error.message);
    throw new Error('Failed to generate AI content with images.');
  }
}

// ─────────────────────────────────────────────────────────
//  OmniRoute path — OpenAI-compatible /v1/chat/completions
// ─────────────────────────────────────────────────────────
async function generateViaOmniRoute(
  prompt: string,
  options: { temperature: number; maxTokens: number; systemPrompt?: string }
): Promise<string> {
  const messages: { role: string; content: string }[] = [];

  if (options.systemPrompt) {
    messages.push({ role: 'system', content: options.systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });

  try {
    const response = await axios.post(
      `${OMNI_URL}/chat/completions`,
      {
        model: OMNI_MODEL,
        messages,
        temperature: options.temperature,
        max_tokens: options.maxTokens,
      },
      {
        headers: {
          Authorization: `Bearer ${OMNI_KEY}`,
          'Content-Type': 'application/json',
          'X-RG-Source': 'rg-academy-server',
        },
        timeout: 30000,
      }
    );

    const text = response.data?.choices?.[0]?.message?.content;
    if (!text) throw new Error('Empty response from OmniRoute');
    console.log(`[AI] OmniRoute ✅ model=${OMNI_MODEL} tokens=${response.data?.usage?.total_tokens ?? '?'}`);
    return text;
  } catch (err: any) {
    console.warn('[AI] OmniRoute failed, falling back to Gemini:', err.message);
    return generateViaGemini(prompt, options);
  }
}

// ─────────────────────────────────────────────────────────
//  Gemini fallback — original implementation
// ─────────────────────────────────────────────────────────
async function generateViaGemini(
  prompt: string,
  options: { temperature: number; maxTokens: number }
): Promise<string> {
  if (!GEMINI_KEY) {
    throw new Error('GEMINI_API_KEY is not set and OmniRoute is unavailable.');
  }

  try {
    const response = await axios.post(
      `${GEMINI_URL}?key=${GEMINI_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: options.temperature,
          maxOutputTokens: options.maxTokens,
        },
      }
    );

    const candidates = response.data?.candidates;
    if (!candidates?.length || !candidates[0]?.content?.parts?.length) {
      throw new Error('Invalid Gemini response: no candidates');
    }
    console.log('[AI] Gemini ✅');
    return candidates[0].content.parts[0].text;
  } catch (error: any) {
    console.error('[AI Gemini Error]:', error.response?.data || error.message);
    throw new Error('Failed to generate AI content.');
  }
}

// ─────────────────────────────────────────────────────────
//  listAvailableModels — OmniRoute only
// ─────────────────────────────────────────────────────────
export const listAvailableModels = async (): Promise<string[]> => {
  try {
    const res = await axios.get(`${OMNI_URL}/models`, {
      headers: { Authorization: `Bearer ${OMNI_KEY}` },
      timeout: 5000,
    });
    return res.data?.data?.map((m: any) => m.id) ?? [];
  } catch {
    return [];
  }
};

// ─────────────────────────────────────────────────────────
//  Backward compat: re-export generateContent as default
// ─────────────────────────────────────────────────────────
export default { generateContent, listAvailableModels };
