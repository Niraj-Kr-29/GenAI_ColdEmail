import { Router } from "express";
import { generateEmail, sendEmail } from "../controllers/email.controller.js";
import { isAuthenticated } from "../middlewares/authmiddleware.js";

const router = Router()

router.route("/send").post(isAuthenticated, sendEmail)
router.route("/generate").post(isAuthenticated, generateEmail)

export default router;