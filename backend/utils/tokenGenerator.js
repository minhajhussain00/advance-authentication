import jwt from "jsonwebtoken"
export const generateVerificationtoken = ()=>{
    return Math.floor(100000 + Math.random() *90232 ).toString()
}
export const generateTokenAndSetCookie= (res,userId)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"7d"})
    res.cookie("token",token,{
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.NODE_ENV ==="pro",
        maxAge:7*24*60*60 *1000
    })
    return token
}