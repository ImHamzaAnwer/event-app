import User from "@/database/user.model";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

interface LoginBody {
    email: string;
    password: string;
}

export async function POST(req: NextRequest) {
    try {
        const userInfo: LoginBody = await req.json();
        const { email, password } = userInfo;

        await connectDB();

        const user = await User.findOne({ email })

        const comparedPass = await bcrypt.compare(password, user.password)

        if (!user || !comparedPass) return NextResponse.json({ error: "Incorrect email or password" }, { status: 500 })

        const tokenPayload = {
            id: user._id,
            email: user.email,
            isAdmin: user?.isAdmin || false
        }

        const signedToken = jwt.sign(tokenPayload, process.env.AUTH_SECRET as string, { expiresIn: "1d" })


        const response = NextResponse.json({ message: "Loggend In", success: true })

        response.cookies.set("token", signedToken, { httpOnly: true, })

        return response;
    }
    catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "" }, { status: 500 })
    }
}