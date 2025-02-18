import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import crypto from "crypto"
import { generateTokenAndSetCookie, generateVerificationtoken } from "../utils/tokenGenerator.js"
import { sendResetPasswordEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailTrap/email.js"
export const signup = async (req, res) => {
    const { email, password, name } = req.body

    try {

        if (!email || !password || !name) {
            throw new Error("All feilds are required")
        }
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json({ success: false, messege: "User already exits" })

        }

        const hashedPassword = bcryptjs.hashSync(password, 12)
        const verificationToken = generateVerificationtoken()
        const user = new User({
            name,
            email,
            password: hashedPassword,
            verificationToken,
            verificationExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)

        })
        console.log("Setting verificationExpiresAt to:", user.verificationExpiresAt);
        await user.save()

        await sendVerificationEmail(user.email, verificationToken)
        generateTokenAndSetCookie(res, user._id)
        res.status(201).json({
            success: true,
            messege: "User created successfuly ",
            user: { ...user._doc, password: undefined }
        })
    } catch (error) {
        res.status(400).json({ success: false, messege: error })
        console.log(error)
    }
}
export const login = async (req, res) => {
    const { email, password } = req.body
    console.log(req.body)

    try {
        const user = await User.findOne({ email })

        if (!user) res.status(400).json({ success: false, messege: "invalid credentails" })

        const isPasswordValid = bcryptjs.compare(password, user.password)

        if (!isPasswordValid) res.status(400).json({ success: false, messege: "invalid credentails" })

        generateTokenAndSetCookie(res, user._id)

        user.lastlogin = Date.now()

        await user.save()

        res.status(201).json({
            success: true,
            messege: "User created successfuly ",
            user: { ...user._doc, password: undefined }
        })
    } catch (error) {
        res.status(400).json({ success: false, messege: error })
        console.log(error)
    }
}
export const logout = (req, res) => {
    res.clearCookie("token")
    res.status(200).json({
        success: true,
        messege: "User logout successfuly ",
    })
}
export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({ verificationToken: code, });


        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }
        if (user.verificationExpiresAt < Date.now()) return res.status(400).json({ success: false, message: "Invalid or expired verification code" });


        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpiresAt = undefined;

        await user.save()

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.log("error in verifyEmail ", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email }); 

        if (!user) return res.status(400).json({ success: false, message: "Email not found" });

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetPasswordExpiresAt;
        
        await user.save();

        await sendResetPasswordEmail(user.email, `${process.env.BASE_URL}/reset-password/${resetToken}`);

        res.status(201).json({ success: true, message: "Password reset link sent to your email" });
    } catch (error) {
        console.log("error in forgotPassword", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const resetPassword = async (req,res)=>{
    try {
        const {token} = req.params
        const {password} = req.body
        const user = await User.findOne({
            resetPasswordToken:token
        })
        console.log(user)
        if(!user)return res.status(400).json({ success: false, message: "Invalid asdfor expired reset code" });
        if (user.resetPasswordExpiresAt < Date.now()) return res.status(400).json({ success: false, message: "Invalid or expired reset code" });

        const hashedPassword = await bcryptjs.hash(password,12)

        user.password = hashedPassword
        user.resetPasswordExpiresAt = undefined
        user.resetPasswordToken = undefined
        await user.save()

        await sendResetSuccessEmail(user.email)
        res.status(201).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.log("error in forgotPassword", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}
export const checkAuth = async (req,res)=>{
    try {
        console.log(req.user)
        const user = await User.findById(req.user.userId)
        console.log(user)
        if(!user){
       return  res.status(401).json({ success: false, message: "User not found" });
        }
        res.status(201).json({
            success: true,
           user: {
                ...user._doc,
                password: undefined,
            }
        })
    } catch (error) {
        
        res.status(500).json({ success: false, message: "Server error" });
    }
}