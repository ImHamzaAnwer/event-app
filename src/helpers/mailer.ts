import User from "@/database/user.model";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export const sendEmail = async ({ email, emailType, userId }: { email: string, emailType: string, userId: number }) => {
    try {
        const hashedToken = await bcrypt.hash(userId.toString(), 10);
        console.log(hashedToken, "hashedToken")
        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000
            })
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + 3600000
            })

        }

        const transporter = nodemailer.createTransport({
            host: process.env.NODEMAILER_HOST,
            port: process.env.NODEMAILER_PORT,
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASS
            }
        } as SMTPTransport.Options);


        const link = `https://localhost:3000/verifyToken?token=${hashedToken}`
        const response = await transporter.sendMail({
            from: '"Events App" <hamza.anwer8@gmail.com>',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your account" : "Reset Your Password",
            html: `<p>
                        Click 
                        <a href="${link}">here</a> to ${emailType === "VERIFY" ? "vertify your account" : "reset your password"}
                         or copy paste this link into your browser</p> <br/>
                         
                         ${link}`,
        });


        return response
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : "something went wrong")
    }
}