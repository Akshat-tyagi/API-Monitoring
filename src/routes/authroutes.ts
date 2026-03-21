import express from "express";
import authcontrollers from "../controllers/authcontrollers.js";

const router = express.Router();

router.post("/signup",authcontrollers.signupuser);
router.post("/signin",authcontrollers.signinuser);

export default router;