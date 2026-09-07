import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import ResponseHandler from "../../utils/Response-Error-Handler/responseHandler";
import { UserAuth } from "../../middleware/customMiddleware/userAuth";
import MessageModel from "./models/message.schema";
import UserModel from "../user/models/user.schema";
import ChatModel from "../chat/models/chat.schema";



export async function SEND_MESSAGE_FN(req:UserAuth,res:Response):Promise<Response>{
    const {content,chatId} = req.body;
 console.log('newMessage',content,chatId);

    if(!content || !chatId.trim() || !isValidObjectId(chatId)) return ResponseHandler(res,200,false,null,"Please provide valid message.");

 let newMessage = {
    sender:req?.uId,
    chat:chatId,
    content
 };
 


 let messageData = await MessageModel.create(newMessage);
 const [messageFinalData,updatingMessage] = await Promise.all([
      MessageModel.findById(messageData._id)
       .populate("sender", "name email pic")
       .populate({
         path: "chat",
         populate: {
           path: "users",
           select: "name pic email"
         }
       })
     ,
      ChatModel.findByIdAndUpdate(chatId,{
        latestMessage:messageData?._id,
     })
 ]);
return ResponseHandler(res,200,true,messageFinalData,'Message has been created successfully');
}


export async function GET_MESSAGES_BY_CHAT_ID_FN(req:UserAuth,res:Response):Promise<Response>{
    

    const chatId = req.params.chatId;
    if(!chatId || !isValidObjectId(chatId)){
        return ResponseHandler(res,200,false,null,"Please Provide valid id");
    }
    
    const isChatExist = await ChatModel.findById(chatId).populate([
        {
            path:"users",
            select:"name pic email",
        }
    ]);
    console.log('isChatExist',isChatExist);

    if(!isChatExist) return ResponseHandler(res,200,false,null,"Chat not found.");

    const isUserExistOnChat = isChatExist?.users?.find((user:any)=>user?._id?.toString() === req?.uId?.toString());
    console.log('isUserExistOnChat',isUserExistOnChat);

    if(!isUserExistOnChat) return ResponseHandler(res,200,false,null,"You are not a member of this chat.");


    const messageData = await MessageModel.find({
        chat:chatId,
    }).populate([
        {
            path:"sender",
            select:"name email pic"
        },
        {
            path:"chat",
            select:'users chatName groupAdmin',            
            populate:[{
                path:"users",
                select:"name pic email",
            },{
                path:'groupAdmin',
                select:"name pic email",
            }]
        }
    ]);
    return ResponseHandler(res,200,true,{
        chatData:isChatExist,
        messageData
    },'Message has been fetched successfully.')
}