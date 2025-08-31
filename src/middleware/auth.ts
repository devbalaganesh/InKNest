//import { Request,Response,NextFunction } from "express";
//import jwt from 'jsonwebtoken';


//const JWT_SECRET = process.env.JWT_SECRET || "dskdjkasdjajajja";
//export const authenticate = (req:Request,res:Response,next :NextFunction)=>{
    //const autheHeader = req.headers.authorization;
    //if(!autheHeader) return res.status(401).json({error:"Authorization is missing"});


  // const token = autheHeader.split(' ')[1];
    //if(!token) return res.status(402).json({error:"Token missing"});




    //try{
        //const payload = jwt.verify(token,JWT_SECRET);
        //(req as any).user = payload;
        //next();
    //}
    //catch(err){

       // return res.status(403).json({error:"Invalid or expird Token"})
    //}
    
//}