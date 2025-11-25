import User from "@/database/user.model";
import { getUserIdFromToken } from "@/helpers/getUserIdFromToken";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const id = await getUserIdFromToken(req)
        
        if (!id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        
        const user = await User.findOne({ _id: id }).select("-password")
        
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }
        
        return NextResponse.json({ message: "user found", user })
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "" }, { status: 500 })
    }
}