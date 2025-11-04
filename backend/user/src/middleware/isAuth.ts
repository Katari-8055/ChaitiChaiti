import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

interface IUser {
  _id: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

interface CustomJwtPayload extends JwtPayload {
  id: string;
  email: string;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

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

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as CustomJwtPayload;

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
  } catch (error) {
    res.status(401).json({
      message: "JWT error",
      error: (error as Error).message,
    });
  }
};
