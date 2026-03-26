import { Router } from 'express';
import { authController } from '../controllers/authController';
import { userController } from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Dev backdoor
router.post('/dev/auth', authController.devLogin);

// Secure sync
router.post('/sync', authController.syncUser);

// Synergy Stats (Professional Hook Entry)
router.get('/synergy-stats', authMiddleware, userController.getSynergyStats);

// Role switching (BIBLE logic)
router.post('/switch-role', authMiddleware, authController.switchRole);

// Current user
router.get('/me', authMiddleware, authController.me);

// Get user by ID
router.get('/users/:id', authController.getUser);

export default router;
