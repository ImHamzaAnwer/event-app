import { NextResponse } from "next/server";
import Event from "@/database/event.model";
import Booking from "@/database/booking.model";
import Ticket from "@/database/ticket.model";
import connectDB from "@/lib/mongodb";

const MAX_TICKETS_PER_PERSON = 5;

export async function POST(req: Request) {
  try {
    await connectDB();

    const {
      eventId,
      name,
      email,
      phone,
      quantity,
    } = await req.json();

    // ----------------------------
    // Basic validation
    // ----------------------------
    if (!eventId || !name || !email || !phone || !quantity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (quantity < 1 || quantity > MAX_TICKETS_PER_PERSON) {
      return NextResponse.json(
        { error: `You can buy up to ${MAX_TICKETS_PER_PERSON} tickets` },
        { status: 400 }
      );
    }

    // ----------------------------
    // Fetch event
    // ----------------------------
    const event = await Event.findById(eventId);

    console.log(event, "event---a-a-a--")

    if (!event || event.isCancelled) {
      return NextResponse.json(
        { error: "Event not available" },
        { status: 404 }
      );
    }

    // ----------------------------
    // Availability check
    // ----------------------------
    if (
      event.ticketsSold + quantity >
      event.totalTickets
    ) {
      return NextResponse.json(
        { error: "Not enough tickets available" },
        { status: 409 }
      );
    }

    // ----------------------------
    // Price calculation
    // ----------------------------
    const ticketPrice = event.ticketPrice;
    console.log(ticketPrice, "ticketPrice===================")
    const totalAmount = ticketPrice * quantity;

    // ----------------------------
    // Create booking (order)
    // ----------------------------
    const booking = await Booking.create({
      eventId: event._id,
      name,
      email,
      phone,
      quantity,
      ticketPrice,
      totalAmount,
      paymentStatus: "completed", // simulate payment
      status: "confirmed",
      orderId: generateOrderId(),
    });

    // ----------------------------
    // Create tickets
    // ----------------------------
    const tickets = Array.from({ length: quantity }).map(() => ({
      eventId: event._id,
      bookingId: booking._id,
      ticketNumber: generateTicketNumber(),
      qrCode: generateQrPayload(),
      price: ticketPrice,
      status: "issued",
    }));

    await Ticket.insertMany(tickets);

    // ----------------------------
    // Update inventory
    // ----------------------------
    event.ticketsSold += quantity;
    await event.save();

    // ----------------------------
    // Response
    // ----------------------------
    return NextResponse.json(
      {
        success: true,
        orderId: booking.orderId,
        bookingId: booking._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("BOOK EVENT ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


function generateOrderId() {
  return `ORD-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;
}

function generateTicketNumber() {
  return `TCK-${Math.random()
    .toString(36)
    .substring(2, 10)
    .toUpperCase()}`;
}

function generateQrPayload() {
  return Math.random()
    .toString(36)
    .substring(2, 15);
}
