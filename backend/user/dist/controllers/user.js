import { publishToQueue } from "../config/Rabitmq.js";
import TryCatch from "../config/TryCatch.js";
import { redisClient } from "../index.js";
export const loginUser = TryCatch(async (req, res) => {
    const { email } = req.body;
    const rateLimitKey = `otp:ratelimit:${email}`;
    const ratelimit = await redisClient.get(rateLimitKey);
    if (ratelimit) {
        res.status(429).json({
            message: "Too many request, please try again later"
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
        body: `Your OTP is ${otp}. It is valid for 5 Minutes.`
    };
    await publishToQueue("send-otp", message);
    res.status(200).json({
        message: "OTP sent successfully"
    });
});
//# sourceMappingURL=user.js.map