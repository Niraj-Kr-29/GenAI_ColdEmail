import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profilePicture: {
        type: String
    },
    college: {
        type: String   
    },
    education: {
        type: String   
    },
    yearOfExp: {
        type: String   
    },
    linkedInUrl: {
        type: String   
    },
    resumeUrl: {
        type: String   
    },
    skills: {
        type: Array
    },
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    }

})

export const User = mongoose.model("User", userSchema)