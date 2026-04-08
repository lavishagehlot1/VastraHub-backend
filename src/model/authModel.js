import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const authSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
         unique: true,
        lowercase: true,
         trim: true,
         match: [/^\S+@\S+\.\S+$/, 'Please use a valid email']
    },
    password:{
        type:String,
        required:function (){return this.provider==='local'},//only required for local user
        minLength:6,
        default:null
    },
    provider:{
        type:String,
        enum:['local','google'],
        default:'local'
    },
    provider_id:{
        type:String,//store goggle orfacebook id
        default:null
    },
    role:{
        type:String,
        enum:['user','admin','seller'],
        default:'user'
    },
    isVerified:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

authSchema.pre('save',async function(){
    if(this.provider!=='local') return;
    if(!this.isModified('password')) return 
    this.password=await bcrypt.hash(this.password,12)
})

authSchema.methods.comparePassword=async function(userPassword){
    if(this.provider!=='local') return false;
    return await bcrypt.compare(userPassword,this.password)
}

export const User = mongoose.model("User",authSchema);