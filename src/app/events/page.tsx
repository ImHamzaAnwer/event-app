import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import { getAllEvents } from "@/lib/actions/event.actions";

const EventsPage = async () => {
  const events: IEvent[] = await getAllEvents();

  return (
    <section className="bg-arts-beige p-5">
      <h1 className="text-arts-primary text-3xl font-semibold font-heading">
        Featured Events
      </h1>

      <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {events &&
          events.length > 0 &&
          events.map((event: IEvent) => (
            <EventCard key={event.slug} {...event} />
          ))}
      </ul>
    </section>
  );
};

export default EventsPage;
