import User from "@/database/user.model";
import { getUserIdFromToken } from "@/helpers/getUserIdFromToken";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const id = await getUserIdFromToken(req)
        const user = await User.findOne({ _id: id }).select("-password")
        return NextResponse.json({ message: "user found", user })
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "" }, { status: 500 })
    }
}