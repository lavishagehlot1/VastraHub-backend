import mongoose from "mongoose";

const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    slug:{
        type:String,
        unique:true,
        lowercase:true,
        trim:true
    },
    parentCategory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category',
        default:null
    },
},{timestamps:true});

const categoryModel=mongoose.model('category',categorySchema);

export default categoryModel;