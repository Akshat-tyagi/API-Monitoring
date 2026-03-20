import "dotenv/config"
import express from "express";
// import dotenv from "dotenv";
import authroutes from "./routes/authroutes.js"
// dotenv.config()

const app = express();

app.use(express.json());

app.use("/api/login",authroutes);

app.listen(3000);