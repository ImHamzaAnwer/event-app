import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        await connectDB();
        const { slug } = await params;


        // Validate slug format before querying database
        if (!slug || typeof slug !== 'string' || slug.trim() === "") {
            return NextResponse.json(
                { error: "Slug is invalid or missing" },
                { status: 400 }
            );
        }

        const sanitizedSlug = slug.trim().toLowerCase();


        const event = await Event.findOne({ slug: sanitizedSlug }).lean();
        if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
        return NextResponse.json({ message: "Event fetched successfully", event }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to get event", message: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
    }
}