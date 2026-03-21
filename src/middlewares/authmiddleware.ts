import type { JwtPayload } from "jsonwebtoken";
import jwttoken from "../utils/jwttoken.js";
import type { NextFunction, Request, Response } from "express";

function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.authtoken;
  
  try {
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const verify = jwttoken.verifyToken(token) as JwtPayload;
    if (!verify) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.userId = verify.userId;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unable to verify token" });
  }
}
export default auth;