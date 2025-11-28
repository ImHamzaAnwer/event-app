/* eslint-disable @typescript-eslint/no-explicit-any */
import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import getUserDetails from "@/helpers/getUserDetails";

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

        let tags: unknown = [];
        let program: unknown = [];
        let composers: unknown = [];
        let performers: unknown = [];
        try {
            const rawTags = formData.get("tags") as string | null;
            const rawProgram = formData.get("program") as string | null;
            const rawComposers = formData.get("composers") as string | null;
            const rawPerformers = formData.get("performers") as string | null;
            tags = rawTags ? JSON.parse(rawTags) : [];
            program = rawProgram ? JSON.parse(rawProgram) : [];
            composers = rawComposers ? JSON.parse(rawComposers) : [];
            performers = rawPerformers ? JSON.parse(rawPerformers) : [];
        } catch (error) {
            console.error("Failed to parse JSON fields", error);
            return NextResponse.json(
                { error: "Invalid JSON format in form data" },
                { status: 400 }
            );
        }
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

        // Get the authenticated user ID
        const user = await getUserDetails();
        const userId = await user?._id;
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const createdEvent = await Event.create({
            ...event,
            program,
            tags,
            composers: composers || [],
            performers: performers || [],
            createdBy: userId
        });

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
        const user = await getUserDetails();
        console.log(user, "hahahah")
        const events = await Event.find({ createdBy: user?._id }).lean().sort({ createdAt: -1 });
        return NextResponse.json({ message: "Events fetched successfully", events }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to get events", message: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();
        let eventData: any;

        try {
            eventData = Object.fromEntries(formData.entries());
        } catch (error) {
            console.log(error);
            return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
        }

        // Event identifier (ID or slug)
        const eventId = eventData.eventId
        if (!eventId) {
            return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
        }

        let tags: string[] = [];
        let program: string[] = [];
        let composers: string[] = [];
        let performers: string[] = [];

        try {
            tags = eventData.tags ? JSON.parse(eventData.tags) : [];
            program = eventData.program ? JSON.parse(eventData.program) : [];
            composers = eventData.composers ? JSON.parse(eventData.composers) : [];
            performers = eventData.performers ? JSON.parse(eventData.performers) : [];
        } catch (error) {
            console.error("Failed to parse array fields", error);
            return NextResponse.json({ error: "Invalid JSON format in array fields" }, { status: 400 });
        }

        const file = formData.get("image") as File;
        if (file) {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        resource_type: "image",
                        folder: "events",
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                ).end(buffer);
            });

            eventData.image = (uploadResult as { secure_url: string }).secure_url;
        }

        // Get authenticated user
        const user = await getUserDetails();
        const userId = await user?._id;
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Update the event
        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            {
                ...eventData,
                tags,
                program,
                composers,
                performers,
            },
            { new: true } // return the updated document
        );

        if (!updatedEvent) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Event updated successfully", event: updatedEvent }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to update event", message: error instanceof Error ? error.message : "Unknown" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const user = await getUserDetails();
        const userId = await user?._id;
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { eventId } = await req.json();
        await Event.deleteOne({ _id: eventId })
        return NextResponse.json({ message: "Event deleted successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to delete event", message: error instanceof Error ? error.message : "Unknown" }, { status: 500 });
    }
}