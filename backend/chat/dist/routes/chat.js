import express from 'express';
import isAuth from '../middleware/isAuth.js';
import { crateNewChat } from '../controllers/chat.js';
const router = express.Router();
router.post('/chat/new', isAuth, crateNewChat);
export default router;
//# sourceMappingURL=chat.js.map