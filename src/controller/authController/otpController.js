import { User } from "../../model/authModel.js";
import sendEmail from "../../services/email/sendEmail.js";
import statusCode from "../../utils/statusCode.js";
import crypto from 'node:crypto'

export const verifyOtp=async(req,res,next)=>{
    try{
         const{email,otp}=req.body;
        console.log("Data from postman",req.body);
        //add validation for email and otp
        if(!email||!otp) return res.status(statusCode.BAD_REQUEST).json({message:"All fields are required"})

        //find user with email
        const existingUser=await User.findOne({email});
        if(!existingUser) return res.status(statusCode.NOT_FOUND).json({message:"User not found with this email"})

        //Check if user is already verified
        if(existingUser.isVerified) return res.status(statusCode.CONFLICT).json({message:"User already verified"})
            console.log(existingUser.isVerified)

        //Check if otp is valid
        if(existingUser.otp!==otp) return res.status(statusCode.BAD_REQUEST).json({message:'Invalid OTP'});

        //check if otp is expired
        if(existingUser.otpExpiry<Date.now()) return res.status(statusCode.BAD_REQUEST).json({message:'OTp has expired please request for new one'})

        //if otp is valid and not expires, update user as verified
        existingUser.isVerified=true;
        existingUser.otp=null; //clear otp after successful verification
        existingUser.otpExpiry=null; //clear otp expiry after successful verification
        await existingUser.save();

       // await sendEmail(email,null,"registrationSuccess",existingUser.name);
       await sendEmail({
             to: email,
             type: "registrationSuccess",
             name: existingUser.name,
        });

        return res.status(statusCode.SUCCESS).json({message:'User is registered sucessfully'});

    }catch(err){
        console.log("Server Error:",err.name);
        next(err);
    }
}

export const forgetPassword=async(req,res,next)=>{
    try{
        const{email}=req.body;
        console.log("Data from postman",req.body);
        if(!email) return res.status(statusCode.BAD_REQUEST).json({message:'Email is required'});

        //finduser with email is user exist in db or not
        const existingUser=await User.findOne({email});
        console.log("Existing user",existingUser);
        if(!existingUser) return res.status(statusCode.NOT_FOUND).json({message:'User not found with this email,please do register first'});

        //generate Token from password reset
        const resetToken=crypto.randomBytes(32).toString('hex');
        console.log("resetToken",resetToken);

        const hashedToken=crypto.createHash('sha256').update(resetToken).digest('hex');
        console.log("hashedToken",hashedToken);

        existingUser.paswordResetToken=hashedToken;
        existingUser.passwordResetTokenExpiry=Date.now()+10*60*100; //token valid for 10 minutes

        await existingUser.save();

        const resetLink=`${process.env.CLIENT_URL}/reset-pasword/${resetToken}`;
        console.log("reset link",resetLink);

        await sendEmail({
            to: email,
            link:resetLink,
            type: "forgetPassword",
            name: existingUser.name,
      }  )

      return res.status(statusCode.SUCCESS).json({message:'Password reset link has been sent to your email',resetLink,existingUser});

    }catch(err){
        console.log("SERVER ERROR:",err.name,err.message)
        next(err);
    }
}


export const resetPassword=async(req,res,next)=>{
    try{
        const{resetToken,newPassword,confirmPassword}=req.body;
        console.log("Data coming from postman",req.body);

        if(!resetToken||!newPassword||!confirmPassword) return res.status(statusCode.BAD_REQUEST).json({message:'All fields are required'});

        //comparing new password and comfirm password
        if(newPassword!==confirmPassword) return res.status(statusCode.BAD_REQUEST).json({message:'Both password should be same'});

        //Hashing the income token
        const hashedToken=crypto.createHash('sha256').update(resetToken).digest('hex');//digest("hex")-->hexadecimal form
        console.log("Hashed token:",hashedToken);

        //find user with valid token
        const exisitingUser=await User.findOne({
            paswordResetToken:hashedToken,
            passwordResetTokenExpiry:{$gt:Date.now()}
        });
        console.log("exisiting User:",exisitingUser);

        if(!exisitingUser) return res.status(statusCode.NOT_FOUND).json({message:'Token is invalid or expired'});

        //update password
        exisitingUser.password=newPassword;

        //clear reset fields
        exisitingUser.paswordResetToken=undefined;
        exisitingUser.passwordResetTokenExpiry=undefined;

        //save new  password
        await exisitingUser.save();

        await sendEmail({
           to: exisitingUser.email,
           null:null,
           type:'passwordReset',
           name:exisitingUser.name

    });
    return res.status(statusCode.SUCCESS).json({message:"Password reset sucessfully",exisitingUser})


    }catch(err){
        console.log("SERVER ERROR:",err.name,err.message)
        next(err);
    }
}