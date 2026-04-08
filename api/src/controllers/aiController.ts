import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../utils/prisma';
import { generateContent, generateContentWithImages } from '../services/aiService';
import axios from 'axios';

// OmniRoute OpenAI-compatible config
const OMNI_URL   = process.env.OMNI_BASE_URL || 'http://localhost:4000/v1';
const OMNI_KEY   = process.env.OMNI_API_KEY  || 'sk-b62a19db50efd2e0-0c6386-1f7daa03';
const OMNI_MODEL = process.env.OMNI_MODEL    || 'alibaba/qwen3-coder-plus';
const USE_OMNI   = process.env.USE_OMNI === 'true' || process.env.NODE_ENV !== 'production';

// ─── Unified chat helper ─────────────────────────────────
async function omniChat(
  messages: { role: string; content: string }[],
  opts: { temperature?: number; max_tokens?: number } = {}
): Promise<string> {
  if (USE_OMNI) {
    try {
      const res = await axios.post(
        `${OMNI_URL}/chat/completions`,
        { model: OMNI_MODEL, messages, temperature: opts.temperature ?? 0.7, max_tokens: opts.max_tokens ?? 2048 },
        { headers: { Authorization: `Bearer ${OMNI_KEY}`, 'Content-Type': 'application/json' }, timeout: 30000 }
      );
      return res.data?.choices?.[0]?.message?.content ?? '';
    } catch (err: any) {
      console.warn('[AI] OmniRoute failed, falling back to geminiService:', err.message);
    }
  }
  // Fallback: use generateContent from aiService (which falls back to Gemini)
  const userMsg = messages.filter(m => m.role === 'user').map(m => m.content).join('\n');
  return generateContent(userMsg);
}

export const aiController = {
  // 1. AI Trajectory Engine
  async getTrajectory(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const profile = await prisma.profile.findUnique({
        where: { userId },
        include: { skills: { include: { skill: true } } }
      });

      if (!profile) return res.status(404).json({ success: false, error: 'Profile not found' });

      const enrollments = await prisma.enrollment.findMany({
        where: { userId },
        include: { course: true }
      });

      const skillContext = profile.skills.map(s => `${s.skill.name} (LVL ${s.proficiency})`).join(', ') || 'No skills yet';
      const courseContext = enrollments.map(e => `${e.course.title} (${e.progress}% complete)`).join(', ') || 'No courses';

      const prompt = `
        As a Sentient Industrial Career Architect, analyze this professional profile:
        Current Skills: ${skillContext}
        Current Courses: ${courseContext}
        
        Generate a "Hierarchical Career Roadmap" in JSON format:
        {
          "title": "Industrial Growth Vector",
          "description": "Short strategic brief for this trajectory",
          "readiness": 85,
          "nodes": [
            { 
              "id": "node-1", 
              "title": "Industrial Foundation", 
              "type": "learning | milestone | project | assessment",
              "status": "completed | in-progress | locked",
              "requirement": "What to master", 
              "link": "/aca/eng/course/slug",
              "dependencies": []
            }
          ],
          "targetSkills": [
            { "skill": "Skill Name", "current": 3, "target": 8 }
          ],
          "aiInsight": "Short personalized advice on the next bottleneck"
        }
        
        Ensure the structure is a valid DAG (Directed Acyclic Graph). Return ONLY valid JSON.
      `;

      const responseText = await omniChat([
        { role: 'system', content: 'You are an expert career architect. Respond only with valid JSON.' },
        { role: 'user', content: prompt }
      ]);

      const jsonStr = responseText.match(/\{[\s\S]*\}/)?.[0] || '{}';
      const trajectoryData = JSON.parse(jsonStr);

      return res.json({ success: true, data: trajectoryData });
    } catch (error: any) {
      console.error("[AI] Trajectory Error:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  // 2. AI Simulation: Start
  async startSimulation(req: AuthRequest, res: Response) {
    try {
      const { type, persona } = req.body;
      const userId = req.user!.id;

      const simulation = await prisma.aISimulation.create({
        data: {
          userId,
          type,
          persona,
          status: 'active',
          history: JSON.stringify([
            { role: 'system', content: `You are a ${persona} acting as a client for a CGI project. Objective: ${type}.` }
          ])
        }
      });

      return res.json({ success: true, data: simulation });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  // 2b. AI Simulation: Chat Turn
  async simChat(req: AuthRequest, res: Response) {
    try {
      const { simulationId, message } = req.body;
      const userId = req.user!.id;

      const simulation = await prisma.aISimulation.findUnique({ where: { id: simulationId } });
      if (!simulation || simulation.userId !== userId) {
        return res.status(404).json({ success: false, error: 'Simulation not found' });
      }

      const history: { role: string; content: string }[] = JSON.parse(simulation.history);
      history.push({ role: 'user', content: message });

      const aiResponse = await omniChat(history);
      history.push({ role: 'assistant', content: aiResponse });

      await prisma.aISimulation.update({
        where: { id: simulationId },
        data: { history: JSON.stringify(history) }
      });

      return res.json({ success: true, response: aiResponse });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  // 3. AI Discover: Natural Language → Search Intents
  async discover(req: Request, res: Response) {
    try {
      const { q } = req.body;
      if (!q) return res.status(400).json({ success: false, error: 'Query required' });

      const responseText = await omniChat([
        { role: 'system', content: 'You are a platform discovery engine. Respond only with valid JSON.' },
        { role: 'user', content: `
          Analyze this user query: "${q}"
          Map it to platform entities in JSON:
          {
            "intent": "learning | hiring | networking | system",
            "categories": ["Architecture", "VFX", "Gamedev"],
            "filters": { "level": "beginner | intermediate | advanced", "lod": 100 },
            "suggestedKeywords": ["Revit", "Maya"],
            "aiInsight": "Short personalized advice based on query"
          }
          Return ONLY valid JSON.
        ` }
      ]);

      const jsonStr = responseText.match(/\{[\s\S]*\}/)?.[0] || '{}';
      const discoveryData = JSON.parse(jsonStr);

      return res.json({ success: true, data: discoveryData });
    } catch (error: any) {
      console.error("[AI] Discovery Error:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  // 4. AI Grade Assist - Analyze submissions with optional image URLs
  async gradeAssist(req: AuthRequest, res: Response) {
    try {
      const { submissionId, assignmentTitle, contentUrl, maxScore, imageUrl } = req.body;
      
      if (!contentUrl && !imageUrl) {
        return res.status(400).json({ success: false, error: 'contentUrl or imageUrl required' });
      }

      const prompt = `
        You are an expert CGI instructor evaluating a student submission.
        Assignment: ${assignmentTitle}
        Max Score: ${maxScore || 100}
        
        ${imageUrl ? 'Analyze the provided image and assess:' : 'Analyze the portfolio URL and assess:'}
        - Technical execution quality
        - Creativity and originality  
        - adherence to assignment requirements
        - Areas for improvement
        
        Return a JSON with:
        {
          "score": <number between 0 and ${maxScore || 100}>,
          "rationale": "<2-3 sentence assessment>",
          "strengths": ["<strength 1>", "<strength 2>"],
          "improvements": ["<improvement 1>", "<improvement 2>"]
        }
        
        Return ONLY valid JSON.
      `;

      let result: string;
      
      if (imageUrl) {
        // Use vision-capable model for image analysis
        const imageUrls = Array.isArray(imageUrl) ? imageUrl : [imageUrl];
        result = await generateContentWithImages(prompt, imageUrls, {
          temperature: 0.3,
          maxTokens: 1024,
          systemPrompt: 'You are an expert CGI instructor. Respond only with valid JSON.'
        });
      } else {
        // Use text-only model for URL analysis
        result = await generateContent(prompt, {
          temperature: 0.3,
          maxTokens: 1024,
          systemPrompt: 'You are an expert CGI instructor. Respond only with valid JSON.'
        });
      }

      const jsonStr = result.match(/\{[\s\S]*\}/)?.[0] || '{}';
      const gradeData = JSON.parse(jsonStr);

      return res.json({ 
        success: true, 
        score: gradeData.score || 0, 
        rationale: gradeData.rationale || 'Unable to generate rationale',
        strengths: gradeData.strengths || [],
        improvements: gradeData.improvements || []
      });
    } catch (error: any) {
      console.error("[AI] Grade Assist Error:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};
