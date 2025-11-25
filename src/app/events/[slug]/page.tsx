import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import Image from "next/image";
import { notFound } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => {
  return (
    <div className="flex-row-gap-2 items-center">
      <Image src={icon} alt={alt} width={17} height={17} />
      <p>{label}</p>
    </div>
  );
};

const EventProgram = ({ programItems }: { programItems: string[] }) => {
  if (!programItems || programItems.length === 0) return null;
  
  return (
    <div className="agenda">
      <h2>Program</h2>
      <ul>
        {programItems.map((item: string) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags.map((tag) => (
      <div key={tag} className="pill">
        {tag}
      </div>
    ))}
  </div>
);

const EventDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const response = await fetch(`${BASE_URL}/api/events/${slug}`);
  const data = await response.json();
  const event = data.event;

  if (!event) {
    notFound();
  }

  const {
    title,
    description,
    overview,
    image,
    date,
    time,
    location,
    program,
    composers,
    performers,
    tags,
    organizer,
  } = event;

  if (!description) return notFound();

  const similarEvents = await getSimilarEventsBySlug(slug);

  const bookings = 10;

  return (
    <section id="event">
      <div className="header">
        <h1>{title}</h1>
        <p className="mt-2">{description}</p>
      </div>

      <div className="details">
        <div className="content">
          <Image
            className="banner"
            src={image}
            width={800}
            height={800}
            alt="banner"
          />

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2 className="mb-1">Event Details</h2>
            <EventDetailItem
              icon={"/icons/calendar.svg"}
              label={date}
              alt={"date"}
            />
            <EventDetailItem
              icon={"/icons/clock.svg"}
              label={time}
              alt={"time"}
            />
            <EventDetailItem
              icon={"/icons/pin.svg"}
              label={location}
              alt={"location"}
            />
          </section>

          {composers && composers.length > 0 && (
            <section className="flex-col-gap-2">
              <h2>Composers</h2>
              <div className="flex flex-row gap-1.5 flex-wrap">
                {composers.map((composer: string) => (
                  <div key={composer} className="pill">
                    {composer}
                  </div>
                ))}
              </div>
            </section>
          )}

          {performers && performers.length > 0 && (
            <section className="flex-col-gap-2">
              <h2>Performers</h2>
              <div className="flex flex-row gap-1.5 flex-wrap">
                {performers.map((performer: string) => (
                  <div key={performer} className="pill">
                    {performer}
                  </div>
                ))}
              </div>
            </section>
          )}

          <EventProgram programItems={program} />

          <section className="flex-col-gap-2">
            <h2>About the organizer</h2>
            <p>{organizer}</p>
          </section>

          <EventTags tags={tags} />
        </div>

        <aside className="booking">
          <div className="signup-card">
            <h2>Book your spot</h2>
            <p className="text-sm">
              {bookings > 0
                ? `Join ${bookings} people who have already booked their spot`
                : "Be the first to book your spot"}
            </p>
            <BookEvent eventId={event._id} slug={slug} />
          </div>
        </aside>
      </div>

      {similarEvents && similarEvents?.length > 0 && (
        <div className="flex flex-col w-full gap-4 pt-20">
          <h2>Similar Events</h2>
          <div className="events">
            {similarEvents.map((similarEvent: IEvent) => {
              return <EventCard key={similarEvent.slug} {...similarEvent} />;
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default EventDetailsPage;
