import { AuthRequest } from '../middleware/auth.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const aiController = {
  // 1. AI Trajectory Engine: Generate Path based on current skills
  async getTrajectory(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const profile = await prisma.profile.findUnique({
        where: { userId },
        include: { skills: { include: { skill: true } } }
      });

      if (!profile) return res.status(404).json({ success: false, error: 'Profile not found' });

      // Fetch user enrollments for context
      const enrollments = await prisma.enrollment.findMany({
        where: { userId },
        include: { course: true }
      });

      const skillContext = profile.skills.map(s => `${s.skill.name} (LVL ${s.proficiency})`).join(', ');
      const courseContext = enrollments.map(e => `${e.course.title} (${e.progress}% complete)`).join(', ');
      
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        As a Sentient Industrial Career Architect, analyze this professional profile:
        Current Skills: ${skillContext}
        Current Courses: ${courseContext}
        
        Generate a "Hierarchical Career Roadmap" in JSON format:
        {
          "title": "Industrial Growth Vector",
          "description": "Short strategic brief for this trajectory",
          "readiness": 85, // Current readiness % for target specialist role
          "nodes": [
            { 
              "id": "node-1", 
              "title": "Industrial Foundation", 
              "type": "learning | milestone | project | assessment",
              "status": "completed | in-progress | locked",
              "requirement": "What to master", 
              "link": "/aca/eng/course/slug", // Optional platform link
              "dependencies": [] // Array of IDs this node depends on
            }
          ],
          "targetSkills": [
            { "skill": "Skill Name", "current": 3, "target": 8 }
          ],
          "aiInsight": "Short personalized advice on the next bottleneck"
        }
        
        Ensure the structure is a valid DAG (Directed Acyclic Graph).
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const jsonStr = responseText.match(/\{[\s\S]*\}/)?.[0] || '{}';
      const trajectoryData = JSON.parse(jsonStr);

      return res.json({ success: true, data: trajectoryData });
    } catch (error: any) {
      console.error("[AI] Trajectory Error:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  // 2. AI Simulation: Personality-based interaction
  async startSimulation(req: AuthRequest, res: Response) {
    try {
      const { type, persona } = req.body;
      const userId = req.user!.id;

      const simulation = await prisma.aiSimulation.create({
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

  async simChat(req: AuthRequest, res: Response) {
    try {
      const { simulationId, message } = req.body;
      const userId = req.user!.id;

      const simulation = await prisma.aiSimulation.findUnique({
        where: { id: simulationId }
      });

      if (!simulation || simulation.userId !== userId) {
        return res.status(404).json({ success: false, error: 'Simulation not found' });
      }

      const history = JSON.parse(simulation.history);
      history.push({ role: 'user', content: message });

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const chat = model.startChat({
        history: history.map((h: any) => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }]
        }))
      });

      const result = await chat.sendMessage(message);
      const aiResponse = result.response.text();

      history.push({ role: 'assistant', content: aiResponse });

      await prisma.aiSimulation.update({
        where: { id: simulationId },
        data: { history: JSON.stringify(history) }
      });

      return res.json({ success: true, response: aiResponse });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  // 3. AI Discover: Convert Natural Language to Search Intents
  async discover(req: Request, res: Response) {
    try {
      const { q } = req.body;
      if (!q) return res.status(400).json({ success: false, error: 'Query required' });

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        As a Global Discovery Architect, analyze this user query: "${q}"
        
        Map it to platform entities in JSON format:
        {
          "intent": "learning | hiring | networking | system",
          "categories": ["Architecture", "VFX", "Gamedev"],
          "filters": { "level": "beginner | intermediate | advanced", "lod": 100-500 },
          "suggestedKeywords": ["Revit", "Maya"],
          "aiInsight": "Short personalized advice based on query"
        }
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const jsonStr = responseText.match(/\{[\s\S]*\}/)?.[0] || '{}';
      const discoveryData = JSON.parse(jsonStr);

      return res.json({ success: true, data: discoveryData });
    } catch (error: any) {
      console.error("[AI] Discovery Error:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};
