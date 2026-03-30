import { Router } from 'express';
import { hrController } from '../controllers/hrController';
import { authMiddleware, checkRole } from '../middleware/auth.js';

const router = Router();

// --- PUBLIC/LECTURER ACCESS ---
router.get('/openings', hrController.getOpenings);
router.post('/apply', authMiddleware, hrController.submitApplication);

// --- PROTECTED HR ACCESS ---
router.use(authMiddleware);
router.use(checkRole(['hr', 'admin']));

router.post('/openings', hrController.createOpening);
router.get('/applicants', hrController.getApplicants);
router.patch('/applicants/:appId/status', hrController.updateStatus);

export default router;
