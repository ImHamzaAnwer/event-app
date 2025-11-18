"use server";

import { Event, IEvent } from "@/database";
import connectDB from "../mongodb";

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