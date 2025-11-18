"use server";

import { Booking } from "@/database";
import connectDB from "../mongodb";

export const bookEvent = async (eventId: string, slug: string, email: string) => {
    try {
        connectDB();
        await Booking.create({ eventId, slug, email })
        return { success: true }
    } catch {
        return { error: "Failed to book event" }
    }
} 