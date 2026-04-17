import mongoose from "mongoose";

const sellerSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        unique:true
    },
    status:{
        type:String,
        enum:['IN_PROGRESS','UNDER_REVIEW','APPROVED','REJECTED'],
        default:'IN_PROGRESS'
    },
    //Bussiness Info
    businessName:{
        type:String,
        trim:true,
    },
    businessType:{
        type:String,
        enum:['individual','company'],
    },
    address:{
        type:String
    },
    phone:{
        type:String
    },
    //Bank details
    bankDetails:{
        accountHolderName:String,
        accountNumber:String ,//encrypt this
        ifscCode:String
    },
    //Admin action
    rejectionReason:{
        type:String,
        default:null
    },
    submittedAt:Date,
    approvedAt:Date
},{timestamps:true});

export const seller=mongoose.model('seller',sellerSchema);