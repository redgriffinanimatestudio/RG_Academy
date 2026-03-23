import { Router } from 'express';
import { networkingController } from '../controllers/networkingController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Profiles
router.get('/profiles/:userId', networkingController.getProfile);
router.post('/profiles', authMiddleware, networkingController.updateProfile);

// Portfolio
router.post('/portfolio', authMiddleware, networkingController.addPortfolioItem);
router.delete('/portfolio/:itemId', authMiddleware, networkingController.deletePortfolioItem);

// Connections
router.post('/connections', authMiddleware, networkingController.follow);
router.delete('/connections', authMiddleware, networkingController.unfollow);
router.get('/users/:userId/followers', networkingController.getFollowers);
router.get('/users/:userId/following', networkingController.getFollowing);

// Feed
router.get('/feed/:userId', networkingController.getActivityFeed);

// Discovery
router.get('/discovery/search', networkingController.searchProfiles);
router.get('/discovery/recommendations', authMiddleware, networkingController.getRecommendations);

export default router;
