import { Router } from 'express';
import { synergyController } from '../controllers/synergyController.js';
import { authMiddleware, requireLecturer, requireClient } from '../middleware/auth.js';

const router = Router();

// Academy Side AI
router.post('/academy/course-helper', 
  authMiddleware, 
  requireLecturer, 
  synergyController.generateCourseHelper
);

// Studio Side AI
router.post('/studio/analyze-brief', 
  authMiddleware, 
  requireClient, 
  synergyController.analyzeProjectBrief
);

// Synergy: Bridging domains
router.get('/recommendations', 
  authMiddleware, 
  synergyController.getRecommendedJobs
);

export default router;
