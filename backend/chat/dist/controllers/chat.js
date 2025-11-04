import axios from "axios";
import TryCatch from "../config/TryCatch.js";
import { Chat } from "../models/chat.js";
import { Message } from "../models/messages.js";
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
export const getAllChats = TryCatch(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        res.status(400).json({ message: "UserId not found" });
        return;
    }
    const chats = await Chat.find({ users: userId }).sort({ updatedAt: -1 });
    const chatWithUserData = await Promise.all(chats.map(async (chat) => {
        const otherUserId = chat.users.find(id => id !== userId);
        const unseenCount = await Message.countDocuments({ chatId: chat._id, sender: { $ne: userId }, seen: false });
        try {
            const { data } = await axios.get(`${process.env.USER_SERVICE_URL}/api/v1/user/${otherUserId}`);
            return {
                user: data,
                chat: {
                    ...chat.toObject(),
                    latestMessage: chat.latestMessage || null,
                    unseenCount
                }
            };
        }
        catch (error) {
            console.error("Error fetching user data:", error);
            return {
                user: { _id: otherUserId, name: "Unknown User" },
                chat: {
                    ...chat.toObject(),
                    latestMessage: chat.latestMessage || null,
                    unseenCount
                }
            };
        }
    }));
    res.json({
        chats: chatWithUserData
    });
});
//# sourceMappingURL=chat.js.map