import { JWT_SECRET } from "@/config/config";
import jwt from "jsonwebtoken";

const JWT_SECRE=JWT_SECRET!;

export function signToken(payload:object) {
    return jwt.sign(payload, JWT_SECRE,{expiresIn:"1h"});
}

export function verifyToken(token:string){
   return jwt.verify(token, JWT_SECRE) as {userId:string};
}
