import { User } from "../../model/authModel.js";
export const registerUser=async(req,res,next)=>{
    try{

    }catch(err){
        console.log("server error:",err.message,err.name)
        next(err)
    }
}

export const loginUser=async(req,res,next)=>{
    try{

    }catch(err){
        console.log("server error:",err.message,err.name)
        next(err)
    }
}