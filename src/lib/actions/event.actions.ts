"use server";

import { Event, IEvent } from "@/database";
import connectDB from "../mongodb";
import getUserDetails from "@/helpers/getUserDetails";

export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        await connectDB();

        const event = await Event.findOne({ slug }).lean<IEvent | null>();
        if (!event) {
            return [];
        }

        return await Event.find({
            _id: { $ne: event._id },
            tags: { $in: event.tags },
        }).lean<IEvent[]>();

    } catch (error) {
        console.error("getSimilarEventsBySlug failed", error);
        return [];
    }
}

export const getAllEvents = async () => {
    await connectDB()
    const user = await getUserDetails(); // works in server component
    const events = await Event.find({ createdBy: user?._id }).lean<IEvent[]>().sort({ createdAt: -1 });
    return events;
}