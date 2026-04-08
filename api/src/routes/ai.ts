import express from 'express';
import axios from 'axios';
import { aiController } from '../controllers/aiController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

const OMNI_URL = process.env.OMNI_BASE_URL || 'http://localhost:4000/v1';
const OMNI_KEY = process.env.OMNI_API_KEY  || 'sk-b62a19db50efd2e0-0c6386-1f7daa03';

// --- PUBLIC: OmniRoute Gateway Status ---
router.get('/status', async (_req, res) => {
  try {
    const r = await axios.get(`${OMNI_URL}/models`, {
      headers: { Authorization: `Bearer ${OMNI_KEY}` },
      timeout: 4000,
    });
    const models = r.data?.data?.map((m: any) => m.id) ?? [];
    return res.json({ success: true, gateway: 'OmniRoute', url: OMNI_URL, models });
  } catch {
    return res.json({ success: false, gateway: 'OmniRoute', url: OMNI_URL, status: 'unreachable' });
  }
});

// --- PROTECTED ---
router.use(authMiddleware);

router.get('/trajectory', aiController.getTrajectory);
router.post('/simulate/start', aiController.startSimulation);
router.post('/simulate/chat', aiController.simChat);
router.post('/grade-assist', aiController.gradeAssist);

export default router;
