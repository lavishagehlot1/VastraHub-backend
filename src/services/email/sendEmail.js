import nodemailer from 'nodemailer';
import { registerTemplate } from './templatesHTML/registrationTemplate.js';
import { resendOtpTemplate } from './templatesHTML/resentOtp';
import { registerSuccessTemplate } from './templatesHTML/registrationSuccess';
import { forgotPasswordTemplate } from './templatesHTML/forgetPassword.js';
import passwordResetSuccessTemplate from './templatesHTML/passwordReset';
//create transporter
const transporter=nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port:process.env.SMTP_PORT,
    secure:process.env.SMTP_PORT=405, //true if using port 465
    auth:{
        user:process.env.SSMTP_USER,
        pass:process.env.SMTP_PASS

    }
});

const emailConfig={
    register:{
        subject:"OTP for registration",
        template:(name,otp)=>registerTemplate(name,otp),
    },
    resentOtp:{
        subject:"Resent otp for verification",
        template:(name,otp)=>resendOtpTemplate(name,otp),
    },
    registrationSuccess:{
        subject:'Your regisration is successfull',
        template:(name)=>registerSuccessTemplate(name)
    },
    forgetPassword:{
        subject:"Reset your password",
        template:(name,link)=>forgotPasswordTemplate(name,link)
    },
    passwordResetSuccess:{
        subject:"Password is updated sucessfully",
        template:(name)=>passwordResetSuccessTemplate(name)
    }
}

//function 
const sendEmail=async({to,type='register',userName="",otp=""})=>{
  try{
    const config=emailConfig[type]|| emailConfig.register;
    const html=config.template(name,otp);

    await transporter.sendMail({
      from: `"Support" <${process.env.SMTP_USER}>`,
      to,
      subject:config.subject,
      html
    })

  }catch(err){
    console.log("Email error:",err.name,err.message);
    throw new Error("Email sending failed");
  }
}

































