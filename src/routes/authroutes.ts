import express from "express";
import authcontrollers from "../controllers/authcontrollers.js";

const router = express.Router();

router.post("/signup",authcontrollers.signupuser);

export default router;