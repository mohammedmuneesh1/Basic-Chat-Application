import { Request, Response } from "express";
import { UserAuth } from "../../middleware/customMiddleware/userAuth";
import UserModel from "./models/user.schema";
import ResponseHandler from "../../utils/Response-Error-Handler/responseHandler";





export async function searchUserProfile (req:UserAuth,res:Response):Promise<Response> {
    
    const search = req.query.search as string ?? "";


    if(search.length<3){
        // return ResponseHandler(res,200,true,
        //     {
        //     data:[],
        //     totalDocuments:0,
        //     limit:0,
        //     currentPage:1,
        //     totalPage:1,
        // },"User Data Fetched Successfully.");
    }

    const uId = req?.uId as string;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 30;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const skip = (page - 1) * limit;
    const searchQry={
        $or:[{name:{$regex:search,$options:"i"}},
            {email:{$regex:search,$options:"i"}}],
           _id:{$ne:uId}
    }

    const [userData,totalDocuments] = await Promise.all([
        UserModel.find(searchQry)
    .limit(limit)
    .skip(skip).select('name role'),
    UserModel.find(searchQry).countDocuments(),
    ]);

    const totalPage = totalDocuments > 0 ? Math.ceil(totalDocuments / limit) : 1;


    return ResponseHandler(res,200,true,
        {
        data:userData,
        totalDocuments:totalDocuments,
        limit:limit,
        currentPage:page,
        totalPage:totalPage,
    },"User Data Fetched Successfully.");





    







} 