import mongoose from "mongoose";

const userSchema  = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    lastlogin:{
        type:Date,
       default:Date.now()
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    resetPasswordToken:String,
    resetPasswordExpiresAt:Date,
    verificationToken:String,
    verificationExpiresAt: { type: Date },
},{timestamps:true})

const User = mongoose.model("User",userSchema)

export default User