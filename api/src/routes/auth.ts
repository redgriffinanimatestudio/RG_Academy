import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Dev backdoor
router.post('/dev/auth', authController.devLogin);

// Secure sync
router.post('/sync', authController.syncUser);

// Current user
router.get('/me', authMiddleware, authController.me);

// Get user by ID
router.get('/users/:id', authController.getUser);

export default router;
