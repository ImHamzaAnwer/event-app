import User from "@/database/user.model";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

interface SignupBody {
    email: string;
    password: string;
    username: string;
}

export async function POST(req: NextRequest) {
    try {
        const userInfo: SignupBody = await req.json();
        const { email, password, username } = userInfo;

        await connectDB();

        const user = await User.findOne({ email })

        if (user) return NextResponse.json({ error: "User already exists" }, { status: 500 })

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const createdUser = await User.create({
            email,
            username,
            password: hashedPassword
        })

        // send vertification email

        await sendEmail({ email, emailType: "VERIFY", userId: createdUser._id })

        return NextResponse.json({ message: "user registered successfully", user: createdUser }, { status: 200 })
    }
    catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "" }, { status: 500 })
    }
}