import "dotenv/config"
import express from "express";
import cookieParser from "cookie-parser";
import authroutes from "./routes/authroutes.js";
import monitorRoutes from "./routes/monitor.routes.js";

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/api/login", authroutes);
app.use("/api/monitors", monitorRoutes);

app.listen(3000);