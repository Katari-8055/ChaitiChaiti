import express from 'express';
import isAuth from '../middleware/isAuth.js';
import { crateNewChat, getAllChats, getMessagesByChat, sendMessage } from '../controllers/chat.js';
import { upload } from '../middleware/multer.js';

const router = express.Router();
router.post('/chat/new', isAuth, crateNewChat);
router.get('/chats/all', isAuth, getAllChats);
router.post('/message', isAuth, upload.single('image'), sendMessage)
router.get("/message/:chatId", isAuth, getMessagesByChat)

export default router;