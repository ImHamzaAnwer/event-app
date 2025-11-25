import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database";
import { fetchEvents } from "@/lib/eventService";

const Home = async () => {
  const events: IEvent[] = await fetchEvents();

  return (
    <section>
      <h1 className="text-center">
        The Hub for every Dev <br /> Event you can&apos;t miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Workshops, Conferences, and more - all in one place
      </p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

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

export default Home;
