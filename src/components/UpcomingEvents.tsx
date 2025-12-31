import { IEvent } from "@/database";
import { getAllEvents } from "@/lib/actions/event.actions";
import EventCard from "./EventCard";

export default async function UpcomingEvents() {
  const events: IEvent[] = await getAllEvents();

  return (
    <div className="py-6 pl-6">
      <h2 className="text-4xl mb-5 font-bold font-heading">Upcoming Events</h2>
      <div className="flex items-center gap-3 overflow-x-auto py-4">
        {events &&
          events.length > 0 &&
          events.map((event: IEvent) => (
            <EventCard width="350px" key={event.slug} {...event} />
          ))}
      </div>
    </div>
  );
}
