import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/database/booking.model";
import Ticket from "@/database/ticket.model";

export async function GET(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
    try {
        await connectDB();

        const { orderId } = await params;

        const booking = await Booking.findOne({ orderId })
            .populate("eventId", "title date venue")

        if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

        const tickets = await Ticket.find({ bookingId: booking._id }).lean();

        return NextResponse.json({ booking, tickets });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
