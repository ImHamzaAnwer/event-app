import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import { getAllEvents } from "@/lib/actions/event.actions";

const EventsPage = async () => {
  const events: IEvent[] = await getAllEvents();

  return (
    <section>
      <div className="mt-20 space-y-7">
        <h1>Featured Events</h1>

        <ul className="events">
          {events &&
            events.length > 0 &&
            events.map((event: IEvent) => (
              <EventCard key={event.slug} {...event} />
            ))}
        </ul>
      </div>
    </section>
  );
};

export default EventsPage;
