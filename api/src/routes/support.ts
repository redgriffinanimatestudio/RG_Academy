import { Router } from 'express';
import { supportController } from '../controllers/supportController';
import { authMiddleware, checkRole } from '../middleware/auth';

const router = Router();

// --- PUBLIC SUPPORT ACCESS (Any authenticated user) ---
router.post('/create', authMiddleware, supportController.createReport);

// --- PROTECTED SUPPORT ACCESS (Support Staff only) ---
router.use(authMiddleware, checkRole(['support', 'admin']));
router.get('/summary', supportController.getSummary);
router.get('/', supportController.getReports);
router.patch('/:reportId/resolve', supportController.resolveReport);
router.delete('/:reportId', supportController.deleteReport);


export default router;
