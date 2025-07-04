import { oAuth2Client } from "../config/googleOAuth.js";
import { User } from "../models/user.model.js";

export const refreshAccessToken = async (userId,refreshToken) => {
    try {
        oAuth2Client.setCredentials({refresh_token: refreshToken});
        const { credentials } = await oAuth2Client.refreshAccessToken()
        const newAccessToken = credentials.access_token

        await User.findByIdAndUpdate(userId,{accessToken: newAccessToken})

        console.log("Access token refreshed successfully");
    } catch (error) {
        console.error("Error refreshing access token:", error);
        return null;
    }
}