import { Router } from "express";
import {getUserDetails, updateUserProfile} from '../controllers/user.controller.js'
import { isAuthenticated } from "../middlewares/authmiddleware.js";

const router = Router()

router.route('/update_profile').patch(isAuthenticated, updateUserProfile)
router.route('/getUserDetails').get(getUserDetails)

export default router