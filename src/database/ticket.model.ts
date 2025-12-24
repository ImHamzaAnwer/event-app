import { Schema, model, models, Document, Types } from "mongoose";

/**
 * Ticket lifecycle:
 * - issued   → created after successful payment
 * - scanned  → used at entry gate
 * - cancelled → refunded or invalidated
 */
export interface ITicket extends Document {
    eventId: Types.ObjectId;
    bookingId: Types.ObjectId;

    ticketNumber: string;        // Human-readable ticket code
    qrCode: string;              // Encoded string used for QR

    attendeeName?: string;       // Optional (for transfer)
    attendeeEmail?: string;

    seat?: {
        section?: string;
        row?: string;
        number?: string;
    };

    price: number;

    status: "issued" | "scanned" | "cancelled";

    scannedAt?: Date;
    scannedBy?: Types.ObjectId;  // Gate staff / device

    issuedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const TicketSchema = new Schema<ITicket>(
    {
        eventId: {
            type: Schema.Types.ObjectId,
            ref: "Event",
            required: true,
            index: true,
        },

        bookingId: {
            type: Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
            index: true,
        },

        ticketNumber: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        qrCode: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        attendeeName: {
            type: String,
            trim: true,
        },

        attendeeEmail: {
            type: String,
            lowercase: true,
            trim: true,
        },

        seat: {
            section: { type: String },
            row: { type: String },
            number: { type: String },
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        status: {
            type: String,
            enum: ["issued", "scanned", "cancelled"],
            default: "issued",
            index: true,
        },

        scannedAt: {
            type: Date,
        },

        scannedBy: {
            type: Schema.Types.ObjectId,
            ref: "User", // staff/admin
        },

        issuedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);


TicketSchema.index({ eventId: 1 });
TicketSchema.index({ bookingId: 1 });
TicketSchema.index({ status: 1 });
TicketSchema.index({ eventId: 1, status: 1 });


const Ticket = models.Ticket || model<ITicket>("Ticket", TicketSchema);
export default Ticket;