import {Redis} from "ioredis";
import { error } from "node:console";

const redis = new Redis(process.env.REDIS_URL!);

redis.on("connect",()=>{
    console.log("redis connected");
});
redis.on("error",(error)=>{
    console.error("redis err:",error);
});

export default redis;