import jwt, {} from "jsonwebtoken";
import { Document } from "mongoose";
export const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "Please Login - No Auth Header" });
            return;
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (typeof decoded === "string" || !decoded) {
            res.status(401).json({ message: "Invalid token payload" });
            return;
        }
        const decodedValue = decoded;
        if (!decodedValue.user) {
            res.status(401).json({ message: "Invalid token data" });
            return;
        }
        req.user = decodedValue.user;
        next();
    }
    catch (error) {
        res.status(401).json({
            message: "JWT Error",
            error: error.message,
        });
    }
};
export default isAuth;
//# sourceMappingURL=isAuth.js.map