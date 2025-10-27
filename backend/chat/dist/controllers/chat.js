import TryCatch from "../config/TryCatch.js";
import { Chat } from "../models/chat.js";
export const crateNewChat = TryCatch(async (req, res) => {
    const userId = req.user?._id;
    const { otherUserId } = req.body;
    if (!otherUserId) {
        res.status(400).json({ message: "otherUserId is required" });
        return;
    }
    const existingChat = await Chat.findOne({
        users: { $all: [userId, otherUserId], $size: 2 },
    });
    if (existingChat) {
        res.json({ message: "Chat already exists", chat: existingChat._id });
        return;
    }
    const newChat = await Chat.create({
        users: [userId, otherUserId],
    });
    await newChat.save();
    res.status(201).json({ message: "New Chat Created", chatId: newChat._id });
});
//# sourceMappingURL=chat.js.map