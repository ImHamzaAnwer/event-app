import BuyTicketsForm from "@/components/BuyTicketForm";
import Event, { EventLean } from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { notFound } from "next/navigation";

export default async function BuyTicketsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  await connectDB();
  console.log(slug, "slugslugslug")

  const event = await Event.findOne({ slug }).lean<EventLean>();

  if (!event) return notFound();

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-2">{event.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {new Date(event.date).toDateString()}
      </p>

      <BuyTicketsForm
        eventId={event?._id.toString()}
        ticketPrice={event.ticketPrice}
      />
    </div>
  );
}
