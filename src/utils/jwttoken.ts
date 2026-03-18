import jwt, { type JwtPayload } from "jsonwebtoken";

const jwt_secret = process.env.jwt_secret as string;

function createToken(userId:number){
    const token = jwt.sign({userId},jwt_secret,{
        expiresIn:"1h"
    });
    return token; 
}

function verifyToken(token:string){
    const decoded = jwt.verify(token,jwt_secret) as JwtPayload;
    return decoded.userId; 
}

export default {createToken , verifyToken};