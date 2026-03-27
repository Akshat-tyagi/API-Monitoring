import express from "express";
import auth from "../middlewares/authmiddleware.js";
import monitorController from "../controllers/monitor.controller.js";

const router = express.Router();

router.use(auth);

router.post("/", monitorController.createmonitor);
router.get("/", monitorController.getallmonitor);
router.delete("/:id", monitorController.deletemonitor);

export default router;