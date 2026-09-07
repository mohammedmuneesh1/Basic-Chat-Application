import mongoose, { Document, Schema } from "mongoose";
import bcrypt from 'bcrypt';


interface User extends Document {
    name:string;
    email: string;
    password: string;
    isEmailVerified: boolean;
    role:'User'|'Admin';
    pic?:string
    isActive:boolean,
    isDeleted:boolean,
    readReceiptsEnabled:boolean;
  }

  


const UserSchema = new Schema<User>({
    name:{type:String,required:true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: true }, 
    role: { type: String, enum: ['User', 'Admin'], default: 'User' },
    isActive:{type:Boolean,default:true},
    isDeleted:{type:Boolean,default:false},
 pic: {
    type: Schema.Types.Mixed, // 👈 Mixed allows ObjectId or string
    ref: "Media",
    default:
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  },
   readReceiptsEnabled: { type: Boolean, default: true },

  },{
    timestamps:true,
  });




 const UserModel =  mongoose.models.User || mongoose.model<User>("User", UserSchema);
export default UserModel;

// UserSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {  // Example: Check if 'password' was modified
//     return next();
//   }
//   // Do something (e.g., hash the password) if modified
//   const salt = await bcrypt.genSalt(10);
//   const hashed = await bcrypt.hash(this.password, salt);
//   this.password = hashed;
//   next();
// });
