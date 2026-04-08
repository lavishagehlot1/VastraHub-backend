import express from 'express';
import { loginUser, registerUser } from '../controller/authController/authController.js';
const authRoute=express.Router();
authRoute.post('/register',registerUser);
authRoute.post('/login',loginUser);
export default authRoute;