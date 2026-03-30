import { Router } from 'express';
import { chatController } from '../controllers/chatController.js';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { CreateRoomSchema, SendMessageSchema } from '../utils/validation.js';

const router = Router();

router.use(authMiddleware);

router.get('/rooms', chatController.getRooms);
router.post('/rooms', validate(CreateRoomSchema), chatController.createRoom);
router.get('/rooms/:roomId/messages', chatController.getMessages);
router.post('/rooms/:roomId/messages', validate(SendMessageSchema), chatController.sendMessage);

export default router;
