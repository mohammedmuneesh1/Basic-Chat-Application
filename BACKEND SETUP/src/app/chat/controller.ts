import { Request, Response } from "express";
import ResponseHandler from "../../utils/Response-Error-Handler/responseHandler";
import ChatModel from "./models/chat.schema";
import { UserAuth } from "../../middleware/customMiddleware/userAuth";
import UserModel from "../user/models/user.schema";
import { isValidObjectId } from "mongoose";
import MessageModel from "../message/models/message.schema";


// export async function GET_ALL_CHATS(req:Request,res:Response):Promise<Response>{
//     return ResponseHandler(res,200,true,chats,'chat has been fetched successfully.');
// }

// export async function GET_CHAT_BY_ID(req:Request,res:Response):Promise<Response>{
//     const chatId = req.params.id;
//     const chat = chats.find((chat) => chat._id === chatId);
//     if(!chat){
//         return ResponseHandler(res,404,false,null,'chat not found.');
//     }
//     return ResponseHandler(res,200,true,chat,'chat has been fetched successfully.');
// }

// export async function accessChatOneToOne(
//   req: UserAuth,
//   res: Response
// ): Promise<Response> {
//   //⚠️⚠️ NOTE:THIS RESPONSIBLE FOR FETCHING OR CREATING ""ONE TO ONE""  CHAT ⚠️⚠️
//   //⚠️⚠️ NOTE:THIS API ROUTE NOT FOR CREATING GROUP CHAT  ⚠️⚠️
//   //⚠️⚠️ NOTE: WE TAKE USER ID TO WHOEVER WE CREATE CHAT   ⚠️⚠️
//   //⚠️⚠️ NOTE:IF CHAT EXIST, RETURN IT , ELSE CREATE NEW    ⚠️⚠️

//   const { userId } = req.body;
//   console.log('userId',userId);
//   const loggedUserId = req?.uId as string;

//   if (!userId) {
//     return ResponseHandler(
//       res,
//       200,
//       false,
//       null,
//       "userId required with requesdt"
//     );
//   }

//   // let isChat = await ChatModel.find({
//   //   isGroupChat: false,
//   //   $and: [
//   //     { users: { $elemMatch: { $eq: userId } } },
//   //     { users: { $elemMatch: { $eq: loggedUserId } } },
//   //   ],
//   // })
//   //   .populate("users", "-password")
//   //   .populate("latestMessage");
//   // })


//   let isChat = await ChatModel.findOne({
//   isGroupChat: false,
//   users: { $all: [userId, loggedUserId] }, // both users exist in array
//   $expr: { $eq: [{ $size: "$users" }, 2] }, // only these 2 users
// })
// .populate("users", "-password")
// .populate("latestMessage");



// // if (isChat.length > 0){
//   if (isChat){

//   //     isChat = await UserModel.populate(isChat, {
//   //   path: "latestMessage.sender",
//   //   select: "name pic email",
//   // });

//     await UserModel.populate(isChat, {
//     path: "latestMessage.sender",
//     select: "name pic email",
//   });



//     return ResponseHandler(
//       res,
//       200,
//       true,
//       isChat[0],
//       "chat has been fetched successfully."
//     );
//   }
//   else {


//     const chatData = {
//       isGroupChat: false,
//       chatName: "sender",
//       users: [userId, loggedUserId],
//     };

//     const createdChat = await ChatModel.create(chatData);

//     const fullChat = await ChatModel.findById(createdChat._id).populate([
//       {
//         path: "users",
//         select: "-password",
//       },
//     ]);

//     return ResponseHandler(
//       res,
//       200,
//       true,
//       fullChat,
//       "chat has been created successfully."
//     );

//     // const createdChat = await ChatModel.create(chatData);
//     // const fullChat = await ChatModel.findById(createdChat._id).populate("users ","-password");
//     // return ResponseHandler(res,200,true,fullChat,'chat has been created successfully.');
//   }

// }


export async function accessChatOneToOne(req: UserAuth, res: Response): Promise<Response> {
  const { userId } = req.body;
  const loggedUserId = req?.uId as string;

  if (!userId) {
    return ResponseHandler(res, 200, false, null, "userId required with requesdt");
  }

  const [a, b] = [loggedUserId, userId].sort(); // stable order
  const userKey = `${a}_${b}`;

  // Atomic: upsert the chat if not found 
  // // WE USED THIS
  //  METHOD BECUASE REACT DEVELOPMENT MODE, TWO SAME DOUCMENT CREATION HAS BEEN FOUND OUT. SO MOVED TO THIS  
  const chat = await ChatModel.findOneAndUpdate(
    { isGroupChat: false, userKey },
    {
      //Fields inside $setOnInsert are only applied when a new document is inserted.
      $setOnInsert: {
        isGroupChat: false,
        chatName: "sender",
        users: [a, b],
        userKey,
      },
    },
    { new: true, upsert: true }
  )
    .populate("users", "-password")
    .populate("latestMessage");

  // If you want to populate latestMessage.sender:
  await UserModel.populate(chat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  return ResponseHandler(res, 200, true, chat, chat.wasNew ? "chat has been created successfully." : "chat has been fetched successfully.");
}

export async function fetchAllUserByIdChats(
  req: UserAuth,
  res: Response
): Promise<Response> {
  //fetching all chats of the user
 
  const uId = req?.uId as string;
    if (!uId || (uId && !isValidObjectId(uId))) {
              res.clearCookie("token", {
                   httpOnly: true,
                   secure: process.env.NODE_ENV === "production",
                   sameSite: "strict",
            });
    return ResponseHandler(res, 401, false, null, "userId required with requesdt");
  }

  const [userChats,userData] = await Promise.all([
    ChatModel.find({
    users: { $elemMatch: { $eq: uId } },
  })
    .populate([
      {
        path: "users",
        // match: { isActive:{ $eq: true } },
        // match: { isDeleted: false },  
        // select: "-password -__v -createdAt -updatedAt -isEmailVerified -readReceiptsEnabled -email",
      },
      {
        path: "groupAdmin",
        select: "-password",
      },
      {
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "-password",
        },
        // select:'',
      },
    ])
    .sort({ updatedAt: -1 }),
    UserModel.findOne({
      _id:uId,
    }).select('name email')
  ]); 

  if(!userData){
    
              res.clearCookie("token", {
             httpOnly: true,
             secure: process.env.NODE_ENV === "production",
             sameSite: "strict",
      });
    return ResponseHandler(res, 401, false, null, "Invalid user found.");
  }


  // const userDataTrail = userChats?.filter((val)=>val?.users?.isDeleted === false);
//   const cleanedChats = userChats?.map(chat => {
//   const plainChat = chat.toObject();
//   return{
//       ...plainChat,
//   users: plainChat.users.filter(
//     //eslint-disable-next-line
//     (user:any) => user.isDeleted === false)
//   }
// });


  // console.log('userData',cleanedChats);
  // console.log('userDataTrail',userDataTrail);

  return ResponseHandler(res, 200, false, 
    {
    chatList:userChats,
    userData,
  }
  , "user by id chats has been fetched successfully.");
}

export async function createGroupChat(
  req: UserAuth,
  res: Response
): Promise<Response> {
  const { name, users } = req.body;

  if (!name || !users) {
    return ResponseHandler(
      res,
      200,
      false,
      null,
      "chatName and users required with request"
    );
  }

  if (users?.length < 2) {
    return ResponseHandler(
      res,
      200,
      false,
      null,
      "More than 2 users are required to create a group chat"
    );
  }

  const loggedUserId = req?.uId as string;

  const groupChat = new ChatModel({
    chatName: name,
    isGroupChat: true,
    users: [...users, loggedUserId],
    groupAdmin: loggedUserId,
  });

  await groupChat.save(); // Creates the chat

  // Populate directly on the same document (no new query)
  await groupChat.populate([
    { path: "users", select: "-password" },
    { path: "groupAdmin", select: "-password" },
  ]);
  return ResponseHandler(
    res,
    200,
    true,
    groupChat,
    "group chat has been created successfully."
  );
}

export async function renameGroupChat(req: UserAuth, res: Response): Promise<Response> {
    const {name,chatId} = req.body;
    if(!chatId) return ResponseHandler(res,200,false,null,'chatId is required.');
    if(!name) return ResponseHandler(res,200,false,null,'name is required.');

    const updatedChat = await ChatModel.findByIdAndUpdate(chatId,{chatName:name},{new:true}).populate([
        {path:'users',select:'-password'},
        {path:'groupAdmin',select:'-password'},
        {path:'latestMessage',populate:{path:'sender',select:'-password'}},
    ]);
    if(!updatedChat) return ResponseHandler(res,200,false,null,'chat not found.');
  return ResponseHandler(res, 200, true, updatedChat, "group chat has been renamed successfully.");
}


export async function AddMembersToGroup(req: UserAuth, res: Response): Promise<Response> {
    const {users,chatId} = req.body;

    if(!users || !users.length ) return ResponseHandler(res,200,false,null,'users are required.');
    if(!chatId ) return ResponseHandler(res,200,false,null,'chat Id is required.');





  const updatedGroupChat = await ChatModel.findByIdAndUpdate(
  chatId,
  { $addToSet: { users: { $each: users } } },
  { new: true } // returns updated doc
).populate([
  { path: 'users', select: '-password' },
  { path: 'groupAdmin', select: '-password' },
  { path: 'latestMessage', populate: { path: 'sender', select: '-password' } },
]);

return ResponseHandler(res, 200, false, updatedGroupChat, `Members has been added to ${updatedGroupChat?.name}.`);
}







export async function removeMembersFromGroup(req: UserAuth, res: Response): Promise<Response> {
      const {users,chatId} = req.body;
      if(!users || !users.length ) return ResponseHandler(res,200,false,null,'users are required.');
    if(!chatId  ) return ResponseHandler(res,200,false,null,'chat Id is required.');

    
  const updatedGroupChat = await ChatModel.findByIdAndUpdate(
  chatId,
  { $pull: { users: { $in: users } } },
  { new: true } // returns updated doc
).populate([
  { path: 'users', select: '-password' },
  { path: 'groupAdmin', select: '-password' },
  { path: 'latestMessage', populate: { path: 'sender', select: '-password' } },
]);
  return ResponseHandler(res, 200, false, updatedGroupChat, `Members has been removed from ${updatedGroupChat} group.`);
}






export async function getChatById(req: UserAuth, res: Response): Promise<Response> {
  const chatId = req.params.chatId;

  if(!chatId || !isValidObjectId(chatId)){
    return ResponseHandler(res, 200, false, null, "invalid chat found.");
  }

  const isChatExist = await ChatModel.findOne({
    _id:chatId,
  }).populate([
    {
     path:'users',
     select:'name email pic' 
    },
    {
      path:'groupAdmin',
      select:'name email pic'
    },
  ]);

  if(!isChatExist){
    return ResponseHandler(res, 200, false, null, "chat not found.");
  }

  const messages = await MessageModel.find({chat:chatId}).populate([
    {
      path:'sender',
      select:'name email pic'
    },
  ]);

  const finalData = {
    chatData:isChatExist,
    messageData:messages
  }

  return ResponseHandler(res, 200, false, finalData, "chat by id fetched successfully.");
}

export async function trailFn(req: UserAuth, res: Response): Promise<Response> {
  return ResponseHandler(res, 200, false, null, "hello");
}


