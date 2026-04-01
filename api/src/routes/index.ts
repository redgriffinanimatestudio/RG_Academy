import { Router, Request, Response } from 'express';
import academyRoutes from './academy';
import studioRoutes from './studio';
import networkingRoutes from './networking';
import adminRoutes from './admin';
import authRoutes from './auth';
import notificationRoutes from './notifications';
import chatRoutes from './chat';
import hrRoutes from './hr';
import financeRoutes from './finance';
import supportRoutes from './support';
import systemRoutes from './system';
import synergyRoutes from './synergy';
import reviewRoutes from './review';
import aiRoutes from './ai';
import searchRoutes from './search';
import agencyRoutes from './agency';

import { academyController } from '../controllers/academyController.js';
import { authController } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

import dashboardRoutes from './dashboard';

const router = Router();

// Logging middleware
router.use((req, res, next) => {
  console.log(`[API] Incoming: ${req.method} ${req.url}`);
  next();
});

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'active', timestamp: new Date().toISOString(), version: '2.6.0' });
});

// Explicit Role Switch Route (Fixing 404)
router.post('/switch-role', authMiddleware, authController.switchRole);

// Mount routes
router.use('/auth', authRoutes);           // /api/auth/*
router.get('/users/:userId/enrollments', (req: any, res: any) => academyController.getUserEnrollments(req, res)); // Direct alias for frontend
router.use('/v1/academy', academyRoutes); // /api/v1/academy/courses, etc.
router.use('/v1/studio', studioRoutes);   // /api/v1/studio/projects, etc.
router.use('/v1/studio', networkingRoutes); // /api/v1/studio/profiles, etc.
router.use('/v1/admin', adminRoutes);     // /api/v1/admin/stats, etc.
router.use('/v1/hr', hrRoutes);           // /api/v1/hr/openings, etc.
router.use('/v1/finance', financeRoutes); // /api/v1/finance/stats, etc.
router.use('/v1/support', supportRoutes); // /api/v1/support/, etc.
router.use('/v1/system', systemRoutes);   // /api/v1/system/health, etc.
router.use('/v1/synergy', synergyRoutes); // /api/v1/synergy/recommendations, etc.
router.use('/v1/review', reviewRoutes);   // /api/v1/review/sessions, etc.
router.use('/v1/ai', aiRoutes);           // /api/v1/ai/trajectory, etc.
router.use('/v1/search', searchRoutes);   // /api/v1/search/universal, etc.
router.use('/v1/agency', agencyRoutes);   // /api/v1/agency/summary, etc.
router.use('/v1/dashboard', dashboardRoutes); // /api/v1/dashboard/student/summary, etc.
router.use('/notifications', notificationRoutes); 
router.use('/chat', chatRoutes);

export default router;
