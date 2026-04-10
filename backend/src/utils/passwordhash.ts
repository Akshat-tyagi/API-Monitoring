import bcrypt from "bcrypt";

async function hashpass(pass:string){
    const hashedpass = await bcrypt.hash(pass,10);
    return hashedpass;
}

async function matchhash(pass:string,hashpass:string):Promise<boolean>{
    const hashedpass = await bcrypt.compare(pass,hashpass);
    return hashedpass;
}

export default {hashpass , matchhash};