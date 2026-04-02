import { Queue } from "bullmq";
import redis from "../db/redis.js";

export const monitorQueue = new Queue("monitors",{
    connection:redis,
});

export default monitorQueue;