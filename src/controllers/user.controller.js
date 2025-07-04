import { User } from "../models/user.model.js";

const updateUserProfile = async(req,res)=>{
    const {name,college, education, yearOfExp, linkedInUrl, resumeUrl, skills} = req.body

    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {   
                name,
                college,
                education,
                yearOfExp,
                linkedInUrl,
                resumeUrl,
                skills
            },
            {new: true},
        )
        res.status(200).json({
            user,
            message: "User profile updated successfully"
        })
        console.log("Updated User :", user)
    } catch (error) {
        console.error("profile updation error", error)
        res.status(500).json({message: "Failed to update user profile"})
    }
}

const getUserDetails = async(req,res) => {
    console.log("Method called", req.user.name)
    console.log(req.cookies)
    console.log(req.session)
    try{
        const user = await User.findById(req.user._id)
        res.status(200).json(user)
    }
    catch(error){
        console.error(error, "error in getting user details")
        res.status(500).json({message: "Failed to get user details"})
    }
}

export {updateUserProfile, getUserDetails}