import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    }
})

export const User = mongoose.model("User",authSchema);