import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://genai-coldemail.onrender.com/auth/google/callback"
},
async (accessToken, refreshToken, profile, done ) => { 
    const { sub, name,email,picture } = profile._json
    try {
        // Pehle check karo ki user exist karta hai ya nahi
        let user = await User.findOne({googleId: sub})

        if(!user){
            // Agar user exist nahi karta, to naye user ko database me save kar do
            user = new User({
                googleId: sub,
                name,
                email,
                profilePicture: picture,
                accessToken,
                refreshToken
            })
        }
        else{
            user.accessToken = accessToken,
            user.refreshToken = refreshToken
        }

        user.save()
        return done(null, user)
    } catch (error) {
        return done(error, null)
    }
}
))