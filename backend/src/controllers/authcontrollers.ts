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
            return res.status(400).json({ message: "invalid request" });
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
        const token = jwttoken.createToken(newuser.id);
        return res
            .status(201)
            .cookie("authtoken", token, { httpOnly: true, sameSite: "lax", path: "/" })
            .json({ message: "signed up successfully", userId: newuser.id });
    }catch(err){
        console.error(err);
        if (
            typeof err === "object" &&
            err !== null &&
            "code" in err &&
            (err as { code?: string }).code === "P2002"
        ) {
            return res.status(409).json({ message: "username or email already taken" });
        }
        res.status(500).json({ message:"something went wrong"});
    }
}

const signinschema = z.object({
    email:z.string().email(),
    password:z.string().min(8,"password should be atleast 8 characters long")
});

async function signinuser(req:Request,res:Response){
    const parsed = signinschema.safeParse(req.body);
    if(!parsed.success){
        return res.status(400).json({ message: "invalid request" });
    }
    try {
        const {email,password}= parsed.data;
        const user = await prisma.user.findUnique({
            where:{
                email
            }
        });
        if(!user){
            return res.status(400).json({message:"user does not exist"});
        };
        const hashedpass = user.password;
        const matchpass = await passwordhash.matchhash(password,hashedpass);
        if(!matchpass){
            return res.status(400).json({message:"incorrect credentials"});
        }
        const token = jwttoken.createToken(user.id);
        return res
            .status(200)
            .cookie("authtoken", token, { httpOnly: true, sameSite: "lax", path: "/" })
            .json({ message: "signed in successfully", userId: user.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"something went wrong"});
    }
}

export default {signupuser,signinuser};