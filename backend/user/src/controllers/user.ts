import { generateToken } from "../config/generateToken.js";
import { publishToQueue } from "../config/Rabitmq.js";
import TryCatch from "../config/TryCatch.js";
import { redisClient } from "../index.js";
import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import { User } from "../model/User.js";

export const loginUser = TryCatch(async (req, res) => {
  const { email } = req.body;

  const rateLimitKey = `otp:ratelimit:${email}`;
  const ratelimit = await redisClient.get(rateLimitKey);
  if (ratelimit) {
    res.status(429).json({
      message: "Too many request, please try again later",
    });
    return;
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const otpKey = `otp:${email}`;

  await redisClient.set(otpKey, otp, {
    EX: 60 * 5,
  });

  await redisClient.set(rateLimitKey, "true", {
    EX: 60,
  });

  const message = {
    to: email,
    subject: "Your Otp Code",
    body: `Your OTP is ${otp}. It is valid for 5 Minutes.`,
  };

  await publishToQueue("send-otp", message);

  res.status(200).json({
    message: "OTP sent successfully",
  });
});

export const verifyUser = TryCatch(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    res.status(400).json({
      message: "All fields are required",
    });
    return;
  }

  const otpKey = `otp:${email}`;
  const savedOtp = await redisClient.get(otpKey);
  if (savedOtp !== otp) {
    res.status(400).json({
      message: "Invalid OTP",
    });
    return;
  }

  await redisClient.del(otpKey);

  let user = await User.findOne({ email });
  if (!user) {
    const name = email.slice(0, email.indexOf("@"));
    user = await User.create({ email, name });
  }

  const token = generateToken(user);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // ✅ true on production
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // ✅ 7 days
  });

  console.log("User verified:", user.email);

  res.json({
    message: "User Verified Successfully",
    user,
    token,
  });
});

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user;

  res.json(user);
});

export const updateName = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    res.status(404).json({
      message: "User not found",
    });
    return;
  }

  user.name = req.body.name;

  await user.save();

  const token = generateToken(user);

  res.json({
    message: "User name updated successfully",
    user,
    token,
  });
});

export const getAllUsers = TryCatch(async (req: AuthenticatedRequest, res) => {
  const users = await User.find();
  res.json(users);
});

export const getUser = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});
