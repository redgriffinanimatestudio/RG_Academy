import { Router } from 'express';
import academyRoutes from './academy';
import studioRoutes from './studio';
import networkingRoutes from './networking';
import adminRoutes from './admin';
import authRoutes from './auth';
import notificationRoutes from './notifications';
import chatRoutes from './chat';

import { authController } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

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
router.use('/', authRoutes);           // /api/dev/auth, /api/sync, /api/me, /api/users/:id
router.use('/v1/academy', academyRoutes); // /api/v1/academy/courses, etc.
router.use('/v1/studio', studioRoutes);   // /api/v1/studio/projects, etc.
router.use('/v1/studio', networkingRoutes); // /api/v1/studio/profiles, etc.
router.use('/v1/admin', adminRoutes);     // /api/v1/admin/stats, etc.
router.use('/notifications', notificationRoutes); 
router.use('/chat', chatRoutes);

export default router;
