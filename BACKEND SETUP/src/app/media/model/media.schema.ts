
import mongoose from "mongoose";

const mediaFileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    isPrivate:{
      type:Boolean,
      default:false
    },
    mediaType:{
      type:String,
      enum:['userProfile']
    },
    storageType: {
      type: String,
      required: true,
      enum: ["local", "s3","cloudinary"],
    },

    cloudinaryKey:{
      type:String,
    },
    s3Key: {
      type: String,
    },
    duration:{
      type:Number,
    },
    mimeType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const MediaModel = mongoose.models.Media || mongoose.model("Media", mediaFileSchema);
export default MediaModel;














