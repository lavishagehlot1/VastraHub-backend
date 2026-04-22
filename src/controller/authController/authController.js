import { OAuth2Client } from 'google-auth-library';
import { User } from "../../model/authModel.js";
import { generateToken, verifyToken } from "../../services/generateToken.js";
import statusCode from "../../utils/statusCode.js";
import { generateOtp } from '../../utils/generateOtp.js';
import sendEmail from '../../services/email/sendEmail.js';
import bcrypt from 'bcrypt';
export const registerUser=async(req,res,next)=>{
    try{
      const{name,email,password}=req.body;
      console.log('Data from potman',req.body);
      if(!name||!email||!password) return res.status(statusCode.BAD_REQUEST).json({message:"All fields are required"});

      //if email is already registered
      const existingUser=await User.findOne({email});
      console.log("User is already exist:",existingUser);

      const otp=generateOtp();
      console.log("GENERATED OTP:",otp);

      if(existingUser){
        if(existingUser.isVerified) return res.status(statusCode.CONFLICT).json({message:"User is already registered"});

        //User exist but not verified ,update user data with new details and resent otp
        existingUser.name=name,
        existingUser.password=password,
        existingUser.otp=otp
        existingUser.otpExpiry=Date.now()+10*60*1000; //otp valid for 10 minutes
       await existingUser.save();

       //await sendEmail(email,otp,'resendOtp',name);
       await sendEmail({
          to: email,
          otp: otp,
          type: "resendOtp",
          name: name,
        });
       return res.status(statusCode.SUCCESS).json({message:`OTP send to your email for verification`})
      }else{
        const newUser=await User.create({
          name,
          email,
          password,
          otp,
          otpExpiry:Date.now() + 10 * 60 * 1000,
          isVerified:false
        })
        console.log("USER DATA:",newUser);
      }
      
      await sendEmail(
        {to:email,
          otp: otp,
          type: 'verifyOtp',
          name: name});

return res.status(statusCode.SUCCESS).json({
  message: "OTP sent to your email for verification",

});
      

    }catch(err){
        console.log("server error:",err.message,err.name)
        next(err)
    }
}

export const loginUser=async(req,res,next)=>{
    try{
      const{email,password}=req.body;
      console.log("Data coming from :",req.body);
      if(!email||!password) return res.status(statusCode.BAD_REQUEST).json({message:'All fields are required'});

      //find existing email
      const findUser=await User.findOne({email});
      console.log("User from database",findUser);
        if(!findUser) return res.status(statusCode.BAD_REQUEST).json({message:'User not found,please register first'});

       const accessToken = generateToken({payload:{id:findUser._id,role:findUser.role},type:"access"});
        console.log("ACCESS TOKEN:",accessToken);

       // console.log("ACCESS SECRET:", process.env.JWT_SECRET);
        //console.log("REFRESH SECRET:", process.env.JWT_REFRESH_SECRET);

        const refreshToken=generateToken({payload:{id:findUser._id},type:"refresh"});
        console.log("REFRESH TOKEN:",refreshToken);

        //SAVE hashed REFRESH TOKEN IN DATABASE
        const hashedRefreshToken=await bcrypt.hash(refreshToken,12);
        findUser.refreshToken=hashedRefreshToken;
        await findUser.save();

        //SEND REFRESH TOKEN IN HTTPONLY COOKIE
        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            secure:true,
            sameSite:"strict",
            maxAge:7*24*60*60*1000 //7 days
        })
        return res.status(statusCode.SUCCESS).json({message:"User is login sucessfully",accessToken})

    }catch(err){
        console.log("server error:",err.message,err.name)
        next(err)
    }
};


export const refreshToken=async(req,res,next)=>{
  try{
     const Token=req.cookies.refreshToken;
    console.log("REFRESH TOKEN FROM COOKIE:",Token);
    if(!Token) return res.status(statusCode.UNAUTHORIZED).json({message:"No refresh token provided"});
        const decoded=await verifyToken(Token,"refresh");
        console.log("Decoded refresh token:",decoded);
        //check if user exist in database
        const users=await User.findById(decoded.id);
        if(!users) return res.status(statusCode.NOT_FOUND).json({message:"User not found"});
        console.log("User data from database:",users);

        //check if refresh token is valid using bcrypt compare
        const isValidRefreshToken=await bcrypt.compare(Token,users.refreshToken);
        if(!isValidRefreshToken) return res.status(statusCode.UNAUTHORIZED).json({message:"Invalid refresh token"});
        console.log("Refresh token is valid",isValidRefreshToken);
    

        //generate new access token
        const newAccessToken=await generateToken({payload:{id:users._id},type:"access"});
        console.log("NEW ACCESS TOKEN:",newAccessToken);
        
        return res.status(statusCode.SUCCESS).json({message:"New access token generated",newAccessToken});
  }catch(err){
     console.log("REFRESH TOKEN ERROR:",err.name);
        return res.status(statusCode.UNAUTHORIZED).json({message:"Invalid or expired refresh token"});
  }
}



// export const googleAuthCallback=async(req,res,next)=>{
//     try{
//          const user=req.user;
//          if(!user) return res.status(statusCode.BAD_REQUEST).json({
//             success:false,
//             message:'Authentication failed'
//          })

//          //generate tokn
//          const token=generateToken({payload:{userId:user._id,email:user.email,role:user.role}})

//          return res.status(statusCode.SUCCESS).json({
//             success: true,
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         provider: user.provider
//       }
//          })
//     }catch(err){
//         console.log("SERVER ERROR:",err.message,err.name);
//         next(err);
//     }
// }





// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// export const googleAuthCallback = async (req, res, next) => {
//     try {
//         let user;

//         if (req.user) {
//             // Passport browser flow
//             user = req.user;
//         } else if (req.body.id_token) {
//             // Postman / id_token flow
//             const ticket = await client.verifyIdToken({
//                 idToken: req.body.id_token,
//                 audience: process.env.GOOGLE_CLIENT_ID
//             });
//             const payload = ticket.getPayload();
//             const { sub: googleId, email, name } = payload;

//             // Check if user exists
//             user = await User.findOne({ googleId });
//             if (!user) {
//                 const existingUser = await User.findOne({ email });
//                 if (existingUser) {
//                     existingUser.googleId = googleId;
//                     existingUser.provider = 'google';
//                     existingUser.isVerified = true;
//                     await existingUser.save();
//                     user = existingUser;
//                 } else {
//                     user = await User.create({
//                         name,
//                         email,
//                         googleId,
//                         provider: 'google',
//                         isVerified: true,
//                         password: null
//                     });
//                 }
//             }
//         } else {
//             return res.status(statusCode.BAD_REQUEST).json({
//                 success: false,
//                 message: 'No authentication data provided'
//             });
//         }

//         // Generate JWT
//         const token = generateToken({
//             payload: { userId: user._id, email: user.email, role: user.role }
//         });

//         return res.status(statusCode.SUCCESS).json({
//             success: true,
//             token,
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 provider: user.provider
//             }
//         });
//     } catch (err) {
//         console.error("SERVER ERROR:", err.message);
//         next(err);
//     }
// };

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuthCallback = async (req, res, next) => {
  try {
    if (!req.body.id_token) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: 'No ID token provided'
      });
    }

    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: req.body.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    // Find or create user
    let user = await User.findOne({ googleId });
    if (!user) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        existingUser.googleId = googleId;
        existingUser.provider = 'google';
        existingUser.isVerified = true;
        await existingUser.save();
        user = existingUser;
      } else {
        user = await User.create({
          name,
          email,
          googleId,
          provider: 'google',
          isVerified: true,
          password: null,
        
        });
      }
    }

    // Generate JWT
    const token = generateToken({
      payload: { userId: user._id, email: user.email, role: user.role }
    });

    return res.status(statusCode.SUCCESS).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        provider: user.provider,
      
      }
    });

  } catch (err) {
    console.error("SERVER ERROR:", err.message, err.name);
    // return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
    //   success: false,
    //   message: "Google authentication failed",
    //   error: err.message
    // });
    next(err);
  }
};