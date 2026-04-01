import { Router } from 'express';
import { financeController } from '../controllers/financeController';
import { authMiddleware, checkRole } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);
// --- PERSONAL FINANCE (Any Authenticated User) ---
router.get('/balance', financeController.getMyBalance);

// --- TREASURY & ESCROW OPS (Finance/Admin Only) ---
router.use(checkRole(['finance', 'admin']));
router.get('/summary', financeController.getStats);
router.get('/stats', financeController.getStats);

router.get('/escrows', financeController.getEscrows);
router.post('/escrow/:escrowId/release', financeController.releasePayment);

export default router;
