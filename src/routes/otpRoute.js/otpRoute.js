import express from 'express';
import { forgetPassword, resetPassword, verifyOtp } from '../../controller/authController/otpController.js';
const otpRoute=express.Router();
otpRoute.post('/verifyOtp',verifyOtp);
otpRoute.post('/forgetPassword',forgetPassword);
otpRoute.post('/resetPassword',resetPassword);
export default otpRoute;