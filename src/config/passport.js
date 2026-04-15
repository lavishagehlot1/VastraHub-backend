import dotenv from 'dotenv';
dotenv.config(); // safe, redundant if index.js already loads


import passport, { strategies } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../model/authModel.js';

passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:process.env.GOOGLE_CALLBACK_URL
},async(accessToken ,refreshToken,profile,done)=>{ //done callback to pass back success or failure
     // `profile` contains Google user info
  // `done` passes user info back to Passport
    try{
        //chck ifuser already exist with goggle id
        // const email = profile.
        // let user= await User.findOne({googleId:profile.id});
        // if(user){
        //     return done(null,user)
        // }

        //check if email exist register through email/password
        const existingUser=await User.findOne({email:profile.emails[0].value});
        if(existingUser){
            existingUser.provider='google';
            existingUser.googleId=profile.id;
            existingUser.isVerified=true
            await existingUser.save();
            return done(null,existingUser);
        }

        console.log("existingUser==",existingUser);
        //if new user ,create in db
        const users=await User.create({
            name:profile.displayName,
            email:profile.emails[0].value,
            provider:'google',
            googleId:profile.id,
            isVerified:true,//google user are verified automatically
            password:null
        })
        return done(null,users)
    }catch(err){
        return done(err,false);
    }
}))


export default passport;













/**
 * profile
profile is an object that Google sends back to your app after the user successfully authenticates.
It contains all the user information Google knows about the authenticated user.
Typical fields include:
{
  "id": "1234567890",           // Google's unique ID for this user
  "displayName": "John Doe",    // User's full name
  "name": { "familyName": "Doe", "givenName": "John" },
  "emails": [ { "value": "john@example.com", "verified": true } ],
  "photos": [ { "value": "profile-picture-url" } ]
}
In Passport, you use profile.id as a unique identifier for the Google account.
Other fields like profile.displayName and profile.emails[0].value are used to create or update your user in your DB.





done
done is a callback function provided by Passport.
Its job is to tell Passport whether authentication succeeded or failed.

Signature:

done(error, user, info)
error → any error that occurred during authentication (set null if no error).
user → the authenticated user object (from your DB) if login/register succeeded.
info → optional object with extra info (usually false if not used).

Examples:

// Successful login
done(null, user);

// Failed login
done(null, false);

// Error occurred
done(err, false);


What is a “Strategy” in Passport?
In Passport, a strategy is a plugin that knows how to authenticate a user with a specific service.
Passport itself is framework-agnostic: it doesn’t know how to talk to Google, Facebook, or a database.
Each strategy knows how to:
Redirect the user to the service (Google, Facebook, etc.)
Handle the callback
Extract user info
Examples of strategies:
passport-local → username/password login
passport-google-oauth20 → Google OAuth 2.0 login
passport-facebook → Facebook login


2Google Strategy (passport-google-oauth20)
The Google Strategy is a Passport plugin that implements OAuth 2.0 flow for Google.
It handles all the hard work:
Redirecting users to Google login
Exchanging the Google “code” for access tokens
Providing the user profile in the profile object




Frontend → Google → Strategy → profile → done → req.user → JWT → App
 */


















