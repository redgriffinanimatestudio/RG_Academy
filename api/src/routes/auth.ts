import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { logout } from '../controllers/logoutController';
import { userController } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { LoginSchema, RegisterSchema, SwitchRoleSchema } from '../utils/validation.js';

const router = Router();

// Logout (JWT revoke)
router.post('/logout', logout);

// Dev backdoor
router.post('/dev/auth', validate(LoginSchema), authController.devLogin);
router.post('/dev/activate', authMiddleware, authController.devActivate);
router.post('/login', validate(LoginSchema), authController.login);

// Registration
router.post('/register', validate(RegisterSchema), authController.register);
router.post('/check-email', authController.checkEmail);
router.post('/social-auth', authController.socialAuth);

// Fast OTP
router.post('/otp/send', authController.sendOtp);
router.post('/otp/verify', authController.verifyOtp);

// Onboarding wizard submission (requires guest token)
router.post('/onboarding', authMiddleware, authController.onboarding);

// Secure sync
router.post('/sync', authController.syncUser);

// Synergy Stats (Professional Hook Entry)
router.get('/synergy-stats', authMiddleware, userController.getSynergyStats);

// Role switching (BIBLE logic)
router.post('/switch-role', authMiddleware, validate(SwitchRoleSchema), authController.switchRole);

// Current user
router.get('/me', authMiddleware, authController.me);

// Get user by ID
router.get('/users/:id', authController.getUser);

export default router;
