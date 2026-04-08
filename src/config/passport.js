import passport, { strategies } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../model/authModel';

passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.OOGLE_CLIENT_SECRET,
    callbackURL:process.env.GOOGLE_CALLBACK_URL
},async(accessToken ,refreshToken,Profiler,done)=>{
    try{
        
    }catch(err){
        return done(err,false);
    }
}))




































/**import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/User.js'; // relative path to User model
import dotenv from 'dotenv';

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ provider: 'google', provider_id: profile.id });
        if(user) return done(null, user);

        const existingUser = await User.findOne({ email: profile.emails[0].value });
        if(existingUser) {
            existingUser.provider = 'google';
            existingUser.provider_id = profile.id;
            await existingUser.save();
            return done(null, existingUser);
        }

        user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            provider: 'google',
            provider_id: profile.id,
            password: null
        });
        return done(null, user);

    } catch(err) {
        return done(err, false);
    }
}));

export default passport; */