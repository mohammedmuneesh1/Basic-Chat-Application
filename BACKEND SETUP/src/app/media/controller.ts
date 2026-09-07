import { Request, Response } from "express";
import ResponseHandler from "../../utils/Response-Error-Handler/responseHandler";


export async function trailFn(req:Request,res:Response){
    const  file = req.body;
     console.log('file',file);
    return ResponseHandler(res,200,true,null,'file has been uploaded successfully.');
}







