"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import jsPDF from "jspdf";

interface ITicket {
  ticketNumber: string;
  qrCode: string;
  price: number;
  status: string;
}

interface IBookingWithEvent {
  orderId: string;
  name: string;
  email: string;
  phone: string;
  quantity: number;
  ticketPrice: number;
  totalAmount: number;
  paymentStatus: string;
  status: string;
  eventId: {
    title: string;
    date: string;
    venue: string;
  };
}

const BookingSuccessPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  console.log(orderId, "heheh")

  const [booking, setBooking] = useState<IBookingWithEvent | null>(null);
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const fetchBooking = async () => {
      setLoading(true);
      try {
        // Fetch booking + tickets from API
        const res = await fetch(`/api/bookings/${orderId}`);
        const data = await res.json();

        setBooking(data.booking);
        setTickets(data.tickets);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [orderId]);

  const downloadPdf = () => {
    if (!booking || tickets.length === 0) return;

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Booking Confirmation: ${booking.orderId}`, 10, 20);
    doc.setFontSize(12);
    doc.text(`Event: ${booking.eventId.title}`, 10, 30);
    doc.text(`Date: ${booking.eventId.date}`, 10, 37);
    doc.text(`Venue: ${booking.eventId.venue}`, 10, 44);
    doc.text(`Name: ${booking.name}`, 10, 51);
    doc.text(`Email: ${booking.email}`, 10, 58);
    doc.text(`Phone: ${booking.phone}`, 10, 65);
    doc.text(`Quantity: ${booking.quantity}`, 10, 72);
    doc.text(`Total Paid: ${booking.totalAmount} PKR`, 10, 79);

    tickets.forEach((ticket, index) => {
      doc.text(
        `Ticket ${index + 1}: ${ticket.ticketNumber} | QR: ${ticket.qrCode}`,
        10,
        90 + index * 7
      );
    });

    doc.save(`Booking-${booking.orderId}.pdf`);
  };

  if (loading) return <p>Loading...</p>;
  if (!booking) return <p>Booking not found!</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Booking Confirmed!</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold">Event Details</h2>
        <p>Title: {booking.eventId.title}</p>
        <p>Date: {booking.eventId.date}</p>
        <p>Venue: {booking.eventId.venue}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold">Your Booking</h2>
        <p>Name: {booking.name}</p>
        <p>Email: {booking.email}</p>
        <p>Phone: {booking.phone}</p>
        <p>Quantity: {booking.quantity}</p>
        <p>Total Paid: {booking.totalAmount} PKR</p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold">Tickets</h2>
        {tickets.map((ticket) => (
          <div
            key={ticket.ticketNumber}
            className="border p-2 rounded mb-2"
          >
            <p>Ticket Number: {ticket.ticketNumber}</p>
            <p>QR Code: {ticket.qrCode}</p>
            <p>Status: {ticket.status}</p>
          </div>
        ))}
      </div>

      <button
        onClick={downloadPdf}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Download PDF
      </button>
    </div>
  );
};

export default BookingSuccessPage;
