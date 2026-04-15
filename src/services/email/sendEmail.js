import nodemailer from "nodemailer";
import { registerTemplate } from "./templatesHTML/registrationTemplate.js";
import { resendOtpTemplate } from "./templatesHTML/resentOtp.js";
import { registerSuccessTemplate } from "./templatesHTML/registrationSuccess.js";
import { forgotPasswordTemplate } from "./templatesHTML/forgetPassword.js";
import passwordResetSuccessTemplate from "./templatesHTML/passwordReset.js";

const emailConfig = {
  register: {
    subject: "OTP for registration",
    template: (name, otp) => registerTemplate(name, otp),
  },
  resendOtp: {
    subject: "Resent OTP for verification",
    template: (name, otp) => resendOtpTemplate(name, otp),
  },
  registrationSuccess: {
    subject: "Your registration is successful",
    template: (name) => registerSuccessTemplate(name),
  },
  forgetPassword: {
    subject: "Reset your password",
    template: (name, link) => forgotPasswordTemplate(name, link),
  },
  passwordResetSuccess: {
    subject: "Password updated successfully",
    template: (name) => passwordResetSuccessTemplate(name),
  },
};

const sendEmail = async ({ to, type = "register", name = "", otp = "" }) => {
  try {
    //  create transporter INSIDE function
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const config = emailConfig[type] || emailConfig.register;
    const html = config.template(name, otp);

    await transporter.sendMail({
      from: `"Support" <${process.env.SMTP_USER}>`,
      to,
      subject: config.subject,
      html,
    });

    console.log(" Email sent successfully");
  } catch (err) {
    console.log(" Email error:", err.message);
    throw new Error("Email sending failed");
  }
};

export default sendEmail;