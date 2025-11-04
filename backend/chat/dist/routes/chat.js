import express from 'express';
import isAuth from '../middleware/isAuth.js';
import { crateNewChat, getAllChats } from '../controllers/chat.js';
const router = express.Router();
router.post('/chat/new', isAuth, crateNewChat);
router.get('/chats/all', isAuth, getAllChats);
export default router;
//# sourceMappingURL=chat.js.map