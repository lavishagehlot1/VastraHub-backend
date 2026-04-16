import express from 'express';
import { googleAuthCallback, loginUser, refreshToken, registerUser } from '../controller/authController/authController.js';
import passport from "../config/passport.js";
import { auth } from 'google-auth-library';
const authRoute=express.Router();


authRoute.post('/register',registerUser);
authRoute.post('/login',loginUser);

authRoute.post('/refreshToken',refreshToken);

//redirect user to google login
authRoute.get('/google',passport.authenticate('google',{scope:['profile','email']}));

//Google callback--> passport stretagy--> controller
authRoute.get('/google/callback',
    passport.authenticate('google',{session:false}),
    googleAuthCallback
)

// Postman / id_token flow
authRoute.post('/google/idtoken', googleAuthCallback);
export default authRoute;
























// Frontend (click "Continue with Google")
//         ↓
// GET /auth/google → Passport redirects to Google login
//         ↓
// User authenticates with Google
//         ↓
// Google redirects → /auth/google/callback?code=XYZ
//         ↓
// Passport Google Strategy runs:
//    - Gets profile
//    - Checks DB
//    - Creates user if new
//    - Calls done(null, user)
//         ↓
// req.user is now set
//         ↓
// googleAuthCallback runs:
//    - Generates your app JWT
//    - Sends response { token, user } to frontend