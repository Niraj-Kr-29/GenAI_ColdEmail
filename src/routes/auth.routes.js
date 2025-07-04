import { Router } from "express";
import passport from "passport";
import { googleAuthCallback, logout } from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middlewares/authmiddleware.js";

const router = Router();

router.route("/google").get(passport.authenticate("google", {
    scope: ["email", "profile", "https://www.googleapis.com/auth/gmail.send"],
    accessType: "offline",
    prompt: "consent"
}))

router.route("/google/callback").get(passport.authenticate("google", {failureRedirect: "/"}), googleAuthCallback)

router.route("/logout").get(isAuthenticated, logout)

export default router