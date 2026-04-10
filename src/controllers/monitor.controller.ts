import * as z from "zod";
import type { Request, Response } from "express";
import prisma from "../db/prisma.js"
import monitorQueue from "../queue/monitor.queue.js";

const createmonitorschema = z.object({
    name:z.string().min(4,"should be atleast 4 characters"),
    url:z.url()
})

async function createmonitor(req:Request,res:Response){
    const parsed = createmonitorschema.safeParse(req.body);
    try {
        if(!parsed.success){
            return res.status(400).json({message:"invalid request"});
        }
        if(!req.userId){
            return res.status(401).json({message:"unauthorised"});
        }
        const {name,url} = parsed.data;
        const newmonitor = await prisma.monitor.create({
            data:{
                name,
                url,
                interval:60,
                userId:req.userId
            }
        });
        //adding job to the monitor queue
        await monitorQueue.add(
            "ping",
            {monitorId:newmonitor.id,url:newmonitor.url},
            {
                repeat:{
                    every:newmonitor.interval * 1000
                },
                removeOnComplete:true,
            }
        );
        return res.status(201).json({message:"monitor created",data:newmonitor});
    } catch (error) {
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            (error as { code?: string }).code === "P2002"
        ) {
            return res.status(409).json({ message: "you already monitor this url" });
        }
        res.status(500).json({message:"something went wrong"});
    }
}

async function getallmonitor(req:Request,res:Response){
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: "unauthorised" });
    }
    try {
        const monitors = await prisma.monitor.findMany({
            where:{
                userId
            }
        });
        return res.status(200).json({monitors:monitors}); 
    } catch (error) {
        return res.status(500).json({message:"something went wrong"});
    }
}

async function deletemonitor(req:Request, res:Response){
    try {
        const id = Number(req.params.id);
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "unauthorised" });
        }
        if (!Number.isFinite(id) || !Number.isInteger(id)) {
            return res.status(400).json({ message: "invalid monitor id" });
        }
        const deletemonitor = await prisma.monitor.deleteMany({
            where:{
                userId,
                id
            }
        });
        if(deletemonitor.count===0){
            return res.status(404).json({message:"monitor not found"});
        };
        //remove from queue using the ID
        await monitorQueue.removeRepeatableByKey(`ping#${id}`);

        return res.status(200).json({message:"monitor deleted successfully"});
    } catch (error) {
        return res.status(500).json({message:"something went wrong"});
    }
}

async function getmonitorstats(req:Request,res:Response){
    try {
        const id = Number(req.params.id);
        const userId = req.userId;
        if(!userId){
            return res.status(401).json({message:"unauthorised"});
        }
        const monitor = await prisma.monitor.findFirst({
            where:{
                id,userId
            }
        });
        if(!monitor){
            return res.status(404).json({message:"monitor not found"});
        }
        const checks = await prisma.check.findMany({
            where:{
                monitorId:id,
                createdAt:{
                    gte:new Date(Date.now()-1000*60*60*24)
                }
            }
        });

        const upCount = checks.filter(c => c.status === 'UP').length;
        const downCount = checks.filter(c => c.status === 'DOWN').length;
        const total = upCount + downCount;
        const uptime = total > 0 ? ((upCount / total) * 100).toFixed(2) : 0;
        const avgResponseTime = total > 0 ? Math.round(checks.reduce((sum, c) => sum + c.responseTime, 0) / total) : 0;

        return res.status(200).json({
            uptime: `${uptime}%`,
            avgResponseTime: `${avgResponseTime}ms`,
            checksCount: total,
            upCount,
            downCount
        });

    } catch (error) {
        
    }
}

export default {createmonitor,getallmonitor,deletemonitor};


