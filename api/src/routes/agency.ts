import { Router } from 'express';
import { agencyController } from '../controllers/agencyController';
import { authMiddleware, checkRole } from '../middleware/auth.js';

const router = Router();

// --- PROTECTED AGENCY ACCESS ---
router.use(authMiddleware);
router.use(checkRole(['agency', 'admin']));

router.get('/summary', agencyController.getSummary);
router.get('/roster', agencyController.getRoster);

export default router;
