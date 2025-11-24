import User from "@/database/user.model";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { token } = await req.json();

        if (!token) return NextResponse.json({ error: "Invalid Token" }, { status: 500 })

        const user = await User.findOne({ verifyToken: token, verifyTokenExpiry: { $gt: Date.now() } });

        if (!user) return NextResponse.json({ error: "Token is invalid" }, { status: 500 })

        user.isVerified = true;
        user.verifyTokenExpiry = undefined;
        user.verifyToken = undefined;

        await user.save()

        return NextResponse.json({ message: "Email verified successfully" }, { status: 200 })
    }
    catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "" }, { status: 500 })
    }
}