import jwttoken from "../utils/jwttoken.js";
import type { NextFunction, Request, Response } from "express";

function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.authtoken;
  
  try {
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const userId = jwttoken.verifyToken(token) as number | undefined;
    if (userId == null || typeof userId !== "number") {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.userId = userId;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unable to verify token" });
  }
}
export default auth;