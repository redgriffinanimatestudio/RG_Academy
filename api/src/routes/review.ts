import { Router } from 'express';
import { reviewController } from '../controllers/reviewController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

/**
 * Visual Review Room Routes
 */

router.post('/sessions', authMiddleware, reviewController.getOrCreateSession);
router.get('/sessions/:sessionId', reviewController.getOrCreateSession); // Reuse or split
router.post('/annotations', authMiddleware, reviewController.addAnnotation);
router.get('/sessions/:sessionId/annotations', reviewController.getAnnotations);
router.patch('/sessions/:sessionId/close', authMiddleware, reviewController.closeSession);

export default router;
