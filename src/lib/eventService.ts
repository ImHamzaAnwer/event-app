import { IEvent } from "@/database";
import axios from "axios";

export const fetchEvents = async (): Promise<IEvent[]> => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events`);
    if (res.status === 200) return res.data.events;
    throw new Error("Failed to fetch events");
};

export const deleteEvent = async (eventId: string): Promise<boolean> => {
    const res = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events`, { data: { eventId } });
    if (res.status === 200) return true;
    return false;
};