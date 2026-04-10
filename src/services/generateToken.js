import jwt from 'jsonwebtoken';
export const generateToken=({payload,type="access"})=>{
    const secret=type=="access"?process.env.JWT_SECRET:process.env.JWT_REFRESH_SECRET;

    const expiresIn=type=="access"?"1h":"7d";
    return jwt.sign(payload,secret,{expiresIn});
}

export const verifyToken=(token,type="access")=>{
    try{
        const secret=type=="access"?process.env.JWT_SECRET:process.env.JWT_REFRESH_SECRET;
        return jwt.verify(token,secret);
    }catch(err){
        throw new Error("Invalid token or Expired token");
    }
}