import { Schema, model, models, Document, Types } from 'mongoose';
import Event from './event.model';

// TypeScript interface for Booking document
export interface IBooking extends Document {
  _id: string;
  eventId: Types.ObjectId;
  userId?: Types.ObjectId;

  name: string;
  email: string;
  phone: string;

  quantity: number;
  ticketPrice: number;
  totalAmount: number;
  currency: string;

  paymentStatus: "pending" | "completed" | "failed";
  status: "pending" | "confirmed" | "cancelled";

  orderId: string;

  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator(email: string) {
          const emailRegex =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
          return emailRegex.test(email);
        },
        message: "Please provide a valid email address",
      },
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      validate: {
        validator(phone: string) {
          const phoneRegex = /^[0-9]{10,15}$/;
          return phoneRegex.test(phone);
        },
        message: "Please provide a valid phone number",
      },
    },

    quantity: {
      type: Number,
      required: true,
      min: [1, "At least 1 ticket must be purchased"],
    },

    ticketPrice: {
      type: Number,
      required: true,
      min: [0, "Ticket price cannot be negative"],
    },

    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative"],
    },

    currency: {
      type: String,
      default: "PKR",
      uppercase: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },

    orderId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

// Pre-save hook to validate events exists before creating booking
BookingSchema.pre('save', async function (next) {
  const booking = this as IBooking;

  if (booking.isModified('eventId') || booking.isNew) {
    try {
      const eventExists = await Event.findById(booking.eventId).select('_id');

      if (!eventExists) {
        const error = new Error(`Event with ID ${booking.eventId} does not exist`);
        error.name = 'ValidationError';
        return next(error);
      }
    } catch {
      const validationError = new Error('Invalid event ID format or database error');
      validationError.name = 'ValidationError';
      return next(validationError);
    }
  }

  next();
});

// Indexes
BookingSchema.index({ eventId: 1 });
BookingSchema.index({ eventId: 1, createdAt: -1 });
BookingSchema.index({ email: 1 });

const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;