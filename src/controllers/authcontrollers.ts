import * as z from "zod";
import type { Request,Response } from "express";
import passwordhash from "../utils/passwordhash.js";
import jwttoken from "../utils/jwttoken.js";
import prisma from "../db/prisma.js";

const signupuserSchema = z.object({
    username:z.string().min(4,"name should be atleat 4 characters"),
    email:z.string().email(),
    password:z.string()
    .min(8, { message: "Password should have minimum length of 8" })
    .max(15, "Password is too long")
    .regex(/^(?=.*[A-Z]).{8,}$/, {
        message:"Should Contain at least one uppercase letter and have a minimum length of 8 characters.",
    })
});    

async function signupuser(req:Request,res:Response){
    const parsed = signupuserSchema.safeParse(req.body);
    try{
        if(!parsed.success){
            return res.status(400).json({message:"something went wrong"});
        }
        const {username,email,password}=parsed.data;
        const hashedPass= await passwordhash.hashpass(password);
        const newuser = await prisma.user.create({
            data:{
                username,
                email,
                password:hashedPass
            }
        });
        const token = jwttoken.createToken(newuser.id)
        return res.status(200).json({token});
        
    }catch(err){
        res.status(500).json({message:"something went wrong"});
    }
}
export default {signupuser};