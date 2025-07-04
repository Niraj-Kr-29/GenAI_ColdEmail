import passport from "passport";
import { User } from "../models/user.model.js";

const googleAuthCallback =  async(req, res) => {
    try {
        const user = req.user
        if(user.college != undefined){
           res.redirect("https://gen-ai-cold-email-frontend.vercel.app/primary")
        }
        else{
            res.redirect("https://gen-ai-cold-email-frontend.vercel.app/profileCompletePage")
        }
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!", error });
    }
}

const logout = async(req,res,next)=>{
    try {
        console.log('Logging out user :', req.user.name)
        req.logout((err)=>{
            if(err){
               next(err)
            }

            req.session.destroy(()=>{
                console.log('Session destroyed from MongoDB')
                res.clearCookie('connect.sid')
                res.status(200).json({message: "Logged Out Successfully"})
            })
        })
    } catch (error) {
        console.error(error)
    }
}

export {googleAuthCallback, logout}