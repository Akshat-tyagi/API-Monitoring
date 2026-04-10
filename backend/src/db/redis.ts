import {Redis} from "ioredis";

const redis = new Redis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: null
});

redis.on("connect",()=>{
    console.log("redis connected");
});
redis.on("error",(error)=>{
    console.error("redis err:",error);
});

export default redis;