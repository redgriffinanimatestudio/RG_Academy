import { Router } from 'express';
import academyRoutes from './academy';
import studioRoutes from './studio';
import networkingRoutes from './networking';
import adminRoutes from './admin';
import authRoutes from './auth';
import notificationRoutes from './notifications';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'active', timestamp: new Date().toISOString(), version: '2.6.0' });
});

// Mount routes
router.use('/', authRoutes);           // /api/dev/auth, /api/sync, /api/me, /api/users/:id
router.use('/', academyRoutes);        // /api/courses, /api/categories, /api/enroll, etc.
router.use('/v1/studio', studioRoutes); // /api/v1/studio/projects, etc.
router.use('/v1/studio', networkingRoutes); // /api/v1/studio/profiles, etc.
router.use('/v1/admin', adminRoutes);  // /api/v1/admin/stats, etc.
router.use('/notifications', notificationRoutes); // /api/notifications/:userId

export default router;
