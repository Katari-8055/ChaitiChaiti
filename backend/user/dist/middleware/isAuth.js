import jwt, {} from "jsonwebtoken";
export const isAuth = async (req, res, next) => {
    try {
        let token;
        // ✅ 1) Try cookie first
        if (req.cookies?.token) {
            token = req.cookies.token;
        }
        // ✅ 2) Fallback → Bearer header
        if (!token && req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            res.status(401).json({ message: "Please login - token missing" });
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            res.status(401).json({ message: "Invalid token payload" });
            return;
        }
        // ✅ Attach user to req
        req.user = {
            _id: decoded.id,
            email: decoded.email,
        };
        next();
    }
    catch (error) {
        res.status(401).json({
            message: "JWT error",
            error: error.message,
        });
    }
};
//# sourceMappingURL=isAuth.js.map