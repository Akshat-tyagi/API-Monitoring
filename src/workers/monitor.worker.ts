import { Worker } from "bullmq";
import redis from "../db/redis.js";
import prisma from "../db/prisma.js";

const monitorWorker = new Worker(
    "monitors",
    async(job)=>{
        const {monitorId , url } = job.data;
        try {
            const startTime = Date.now();
            const response = await fetch(url);
            const responseTime= Date.now()-startTime;
            const statusCode = response.status;
            const status = response.ok?"UP":"DOWN";

            const check = await prisma.check.create({
                data:{
                    monitorId,
                    status,
                    responseTime,
                    statusCode
                }
            });
            //get last 2 checks
            const lastTwoChecks = await prisma.check.findMany({
                where:{monitorId},
                orderBy:{createdAt:"desc"},
                take:2
            });
            //detect incident
            if(lastTwoChecks.length===2){
                const currentCheck = lastTwoChecks[0];
                const previousCheck = lastTwoChecks[1];
                if(previousCheck.status==="UP" && currentCheck.status==="DOWN"){
                    await prisma.incident.create({
                        data:{
                            monitorId
                        }
                    });
                    console.log(`incident created for monitor ${monitorId}`);
                }
                if(previousCheck.status==="DOWN"&&currentCheck.status==="UP"){
                    await prisma.incident.updateMany({
                        where:{
                            monitorId,
                            resolvedAt:null
                        },
                        data:{
                            resolvedAt:new Date()
                        }
                    });
                    console.log(`incident resolved for monitor ${monitorId}`);
                }
            }
            console.log(`check created for monitor ${monitorId}`);
            return {success:true,check}
        } catch (error) {
            console.error(`error pinging the monitor ${monitorId}`)

            await prisma.check.create({
                data:{
                    monitorId,
                    status:"DOWN",
                    responseTime:0,
                    statusCode:null
                }
            });
            throw error;
        }
    },
    {connection:redis}
)

export default monitorWorker;