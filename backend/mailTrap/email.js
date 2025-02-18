import { client,sender } from "./index.js"
import {PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE} from "./emailTemplate.js"

export const sendVerificationEmail = async (email,token)=>{
    const recipient = [{ email }];
    try {
        const response = await client.send({
            from:sender,
            to:recipient,
            subject:"Verify your email",
            html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",token),
            category:"Email Verification"
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({success:false, messege:error})
    }
}

export const sendWelcomeEmail = async (email,name)=>{
    const recipient = [{email}]

    try {
        
        const response = await client.send({
            from:sender,
            to:recipient,
            template_uuid: "68a434b5-95dc-4bc0-b7e8-99d2dc48fd49",
            template_variables: {
              "company_info_name": "MnM",
              "name": name
            }
        })
        console.log(response)
    } catch (error) {
        console.log(error)
        res.status(400).json({success:false, messege:error})
    }
}

export const sendResetPasswordEmail = async (email,url)=>{
    const recipient = [{email}]
    try {
        const response = await client.send({
            from:sender,
            to:recipient,
            subject:"Reset password",
            html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",url),
            category:"Password reset"
        })
        console.log(response)
    } catch (error) {
        console.log(error)
        res.status(400).json({success:false, messege:error})
    }
}

export const sendResetSuccessEmail  = async (email)=>{
    const recipient = [{email}]
    try {
        const response = await client.send({
            from:sender,
            to:recipient,
            subject:"Password reset success",
            html:PASSWORD_RESET_SUCCESS_TEMPLATE,
            category:"Password reset"
        })
        console.log(response)
    }catch(err){
        console.log(err)
        res.status(400).json({success:false, messege:error})
    }
}