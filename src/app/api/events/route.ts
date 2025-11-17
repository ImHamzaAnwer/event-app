import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const formData = await req.formData();
        let event;

        try {
            event = Object.fromEntries(formData.entries());
        } catch (error) {
            console.log(error);
            return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
        }

        const file = formData.get("image") as File;
        if (!file) return NextResponse.json({ error: "Image is required" }, { status: 400 });

        const tags = JSON.parse(formData.get("tags") as string)
        const agenda = JSON.parse(formData.get("agenda") as string)

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({
                resource_type: "image",
                folder: "events",
            }, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            })
                .end(buffer)
        })

        event.image = (uploadResult as { secure_url: string }).secure_url;

        const createdEvent = await Event.create({ ...event, agenda, tags });

        return NextResponse.json({ message: "Event created successfully", event: createdEvent }, { status: 201 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to create event", message: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();
        const events = await Event.find().lean().sort({ createdAt: -1 });
        return NextResponse.json({ message: "Events fetched successfully", events }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to get events", message: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
    }
}