import { Router } from 'express';
import { searchController } from '../controllers/searchController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

/**
 * @swagger
 * /api/v1/search/universal:
 *   get:
 *     summary: Unified platform search
 *     tags: [Search]
 */
router.get('/universal', authMiddleware, searchController.unifiedSearch);

/**
 * @swagger
 * /api/v1/search/ai-discover:
 *   post:
 *     summary: Semantic AI discovery
 *     tags: [Search]
 */
router.post('/ai-discover', authMiddleware, searchController.aiDiscover);

export default router;
