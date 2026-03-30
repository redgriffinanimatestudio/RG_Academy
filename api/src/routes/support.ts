import { Router } from 'express';
import { supportController } from '../controllers/supportController';
import { authMiddleware, checkRole } from '../middleware/auth';

const router = Router();

// --- PUBLIC SUPPORT ACCESS (Any authenticated user) ---
router.post('/create', authMiddleware, supportController.createReport);

// --- PROTECTED SUPPORT ACCESS (Support Staff only) ---
router.get('/', authMiddleware, checkRole(['support', 'admin']), supportController.getReports);
router.patch('/:reportId/resolve', authMiddleware, checkRole(['support', 'admin']), supportController.resolveReport);
router.delete('/:reportId', authMiddleware, checkRole(['support', 'admin']), supportController.deleteReport);

export default router;
