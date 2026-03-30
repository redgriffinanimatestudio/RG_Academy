import express from 'express';
import { aiController } from '../controllers/aiController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.use(authMiddleware);

router.get('/trajectory', aiController.getTrajectory);
router.post('/simulate/start', aiController.startSimulation);
router.post('/simulate/chat', aiController.simChat);

export default router;
