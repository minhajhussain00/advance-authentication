import express from "express"
import { login, logout, signup,verifyEmail, forgotPassword, resetPassword, checkAuth } from "../controller/auth.controller.js"
import { verifyToken } from "../middleware/verifyToken.js"
const router = express.Router()

router
    .post("/signup",signup)
    .post("/login",login)
    .post("/logout",logout)
    .post("/verify-email",verifyEmail)
    .post("/forgot-password",forgotPassword)
    .post("/reset-password/:token",resetPassword )
    .get("/check-auth",verifyToken,checkAuth)

export default router