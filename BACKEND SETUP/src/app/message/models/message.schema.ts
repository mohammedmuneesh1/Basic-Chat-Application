import mongoose from 'mongoose'

const messageModel = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    content:{
        type:String,
        trim:true,
    },
    chat:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Chat",
    },
      type: {                 // message kind/scene
    type: String,
    enum: ["text", "image", "video", "file"], // extend as needed
    default: "text",
  },
  isDeleted:{
    type:Boolean,
    default:false
  },
readBy: [{
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  readAt: { type: Date, default: Date.now }
}]

},{
    timestamps:true
});


const MessageModel = mongoose.models.Message || mongoose.model("Message", messageModel);
export default MessageModel;










//READ RECEIPT LOGIC


// const message = await MessageModel.findById(messageId);

// // Only add to readBy if recipient allows read receipts
// if (recipient.readReceiptsEnabled) {
//   const alreadyRead = message.readBy.some(
//     r => r.user.toString() === recipient._id.toString()
//   );

//   if (!alreadyRead) {
//     message.readBy.push({ user: recipient._id, readAt: new Date() });
//     await message.save();
//   }
// }