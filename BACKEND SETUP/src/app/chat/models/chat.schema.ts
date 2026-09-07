import mongoose from "mongoose";



const ChatSchema = new mongoose.Schema({
    chatName:{type: String,trim:true},
    isGroupChat:{type: Boolean, default: false},
    users:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    latestMessage:{type: mongoose.Schema.Types.ObjectId, ref:"Message"},
    groupAdmin:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    userKey: { type: String, index: true },
},{
    timestamps:true
});

ChatSchema.index({ isGroupChat: 1, users: 1 }, { unique: true, partialFilterExpression: { isGroupChat: false } });



const ChatModel = mongoose.models.Chat || mongoose.model("Chat", ChatSchema);


export default ChatModel;