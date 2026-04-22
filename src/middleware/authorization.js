import { User } from "../model/authModel.js";
import { verifyToken } from "../services/generateToken.js";
import statusCode from "../utils/statusCode.js";

export const authorization=async(req,res,next)=>{
   
        const authHeader=req.headers.authorization;
        console.log("AUTHHEADER:",authHeader)
        //header has all data that is comingfrom frontend and authorization has our token 
        if(!authHeader||!authHeader.startsWith('Bearer ')){
            return res.status(statusCode.UNAUTHORIZED).json({message:"No token is provided"} )
        }
        const token=authHeader.split(" ")[1];
        console.log("Token:",token);
         try{
            console.log("Token:",token)
            const decode=verifyToken(token,"access");
            console.log("DECODE=",decode);
            const user=await User.findById(decode.id);
            if(!user){
                return res.status(statusCode.UNAUTHORIZED).json({message:"not found"})
            }
            req.user=decode;
            next();

    }catch(err){
        console.log("ERROR IN AUTHORZATION:",err.name,err.message);
        return res.status(statusCode.UNAUTHORIZED).json({message:"Invalid token"})
    }
}