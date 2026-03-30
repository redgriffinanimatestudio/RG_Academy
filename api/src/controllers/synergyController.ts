import { success, error } from '../utils/response.js';
import { generateContent } from '../services/geminiService.js';
import { AuthRequest } from '../middleware/auth.js';
import { Response } from 'express';
import prisma from '../utils/prisma.js';

export const synergyController = {
  /**
   * AI-powered course summary generator for Lecturers
   */
  async generateCourseHelper(req: AuthRequest, res: Response) {
    try {
      const { title, topics, targetAudience } = req.body;
      const prompt = `Act as an expert curriculum designer. Generate a compelling course description and summary for a course titled "${title}". 
      Key topics: ${topics}. Target audience: ${targetAudience}. 
      Return the result in JSON format with 'description', 'learningOutcomes' (array), and 'summary'.`;

      const aiResponse = await generateContent(prompt);
      // Try to parse JSON if AI returned it, otherwise return as text
      try {
        const parsed = JSON.parse(aiResponse.replace(/```json|```/g, ''));
        return success(res, parsed);
      } catch (e) {
        return success(res, { text: aiResponse });
      }
    } catch (e) {
      return error(res, 'AI generation failed');
    }
  },

  /**
   * AI-powered project brief analyzer for Clients
   */
  async analyzeProjectBrief(req: AuthRequest, res: Response) {
    try {
      const { description } = req.body;
      const prompt = `Analyze this creative project brief: "${description}". 
      Provide a breakdown of:
      1. Required skills (list)
      2. Estimated complexity (1-10)
      3. Potential challenges.
      Return as professional analysis.`;

      const analysis = await generateContent(prompt);
      return success(res, { analysis });
    } catch (e) {
      return error(res, 'AI analysis failed');
    }
  },

  /**
   * Synergy: Recommended jobs for LMS Students
   */
  async getRecommendedJobs(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      // 1. Get user's enrolled courses and achievements
      const userWithSkills = await prisma.user.findUnique({
        where: { id: userId },
        include: { 
          enrollments: { include: { course: true } },
          achievements: true
        }
      });

      if (!userWithSkills) return error(res, 'User not found');

      const skills = userWithSkills.enrollments.map(e => e.course.title).join(', ');
      
      // 2. Get active projects
      const projects = await prisma.project.findMany({ 
        where: { status: 'open' },
        take: 10
      });

      const projectsText = projects.map(p => `ID: ${p.id}, Title: ${p.title}, Desc: ${p.description}`).join('; ');

      const prompt = `Based on the student's learned skills: [${skills}], and their achievements: [${userWithSkills.achievements.map(a => a.name).join(', ')}], 
      recommend the top 3 best matching projects from this list: [${projectsText}]. 
      Explain why each project is a good fit.`;

      const recommendations = await generateContent(prompt);
      return success(res, { recommendations });
    } catch (e) {
      return error(res, 'Synergy recommendation failed');
    }
  }
};
