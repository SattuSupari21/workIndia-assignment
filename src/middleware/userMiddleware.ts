import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction, RequestHandler } from "express";
import dotenv from "dotenv";

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export interface TokenInterface {
  userId: string;
}

export const verifyToken: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      res.status(401).json({ error: "Unauthorized Access!" });
    }
    const decodedToken = jwt.verify(
      token!,
      process.env.JWT_SECRET || "random-secret",
    ) as TokenInterface;
    req.userId = decodedToken.userId;
    next();
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
};
