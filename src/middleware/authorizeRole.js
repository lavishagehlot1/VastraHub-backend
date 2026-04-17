import statusCode from "../utils/statusCode.js";

export const authorize=(...roles)=>{ //rest parameter so you can pass multiple roles
    return(req,res,next)=>{
        const role=req.user.role; //uer role extractedfrom token coimng from authenticated middleware.
        if(!roles.includes(role)) return res.status(statusCode.FORBIDDEN).json({message:"You don't have access"});
        next();
    }
}