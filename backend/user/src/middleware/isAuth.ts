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
  user: IUser;
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Please login - no auth header" });
      return;
    }

    const token = authHeader.split(" ")[1];

    

    const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string);

    // ✅ Type guard: jwt.verify() can return string | JwtPayload
    if (typeof decoded === "string" || !decoded) {
      res.status(401).json({ message: "Invalid token payload" });
      return;
    }

    const decodedValue = decoded as CustomJwtPayload;

    if (!decodedValue.user) {
      res.status(401).json({ message: "Invalid token data" });
      return;
    }

    req.user = decodedValue.user;
    next();
  } catch (error) {
    res.status(401).json({ message: "JWT Error", error: (error as Error).message });
  }
};
