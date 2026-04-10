import { OAuth2Client } from 'google-auth-library';
import { User } from "../../model/authModel.js";
import { generateToken } from "../../services/generateToken.js";
import statusCode from "../../utils/statusCode.js";
import { generateOtp } from '../../utils/generateOtp.js';
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

      // if(existingUser){
      //   if(existingUser.isVerified) return res.status(statusCode.CONFLICT).json({message:"User is already registered"});

      //   //User exist but not verified ,update user data with new details and resent otp
      //   existingUser.name=name,
      //   existingUser.password=password,
      //   existingUser.otp=otp,
      //   //existingUser.otpExpiry=
      //   else{

      //   }
      // }

      

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