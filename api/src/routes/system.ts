import { Router } from 'express';
import { systemController } from '../controllers/systemController';
import { authMiddleware, checkRole } from '../middleware/auth.js';

const router = Router();

// --- PUBLIC/READ ONLY ACCESS (For dashboards) ---
router.get('/health', systemController.getHealth);

// --- PROTECTED MANAGEMENT ACCESS ---
router.use(authMiddleware);
router.use(checkRole(['manager', 'chief_manager', 'admin']));

router.post('/metrics', systemController.recordMetric);
router.get('/audit-logs', systemController.getAuditLogs);

export default router;
