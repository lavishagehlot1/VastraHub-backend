
import mongoose from "mongoose";
 const productSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    category:{
        type:String,
        required:true,
        trim:true
    },
    brand:{
        type:String,
        trim:true
    },
    stock:{
        type:Number,
        min:0
    },
    images:[{
        type:String
    }],
    sellerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    rating:{
        type:Number,
        min:0,
        max:5,
        default:0
    },
    numReviews:{
        type:Number,
        default:0
    },
    isActive:{
        type:Boolean,
        default:true
    }
 },{timestamps:true});

 const productModel=mongoose.model('product',productSchema);
 export default productModel;