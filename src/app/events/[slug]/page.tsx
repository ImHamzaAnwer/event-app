import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import { CalendarDays, Clock3, MapPinned } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const EventDetailItem = ({
  icon: Icon,
  label,
}: {
  icon: IconType;
  label: string;
}) => {
  return (
    <div className="flex items-center gap-2 text-gray-700">
      <Icon className="size-5" />
      <p className="text-sm">{label}</p>
    </div>
  );
};

const EventProgram = ({ programItems }: { programItems: string[] }) => {
  if (!programItems || programItems.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-3">Program</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        {programItems.map((item: string) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-2 flex-wrap mt-6">
    {tags.map((tag) => (
      <span
        key={tag}
        className="px-3 py-1 text-sm bg-gray-200 rounded-full text-gray-700"
      >
        {tag}
      </span>
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
    <section id="event" className="max-w-6xl mx-auto px-4 py-12">
      {/* HEADER */}
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
        <p className="mt-3 text-gray-600 text-lg">{description}</p>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex flex-col lg:flex-row gap-12">
        {/* LEFT CONTENT */}
        <div className="flex-1 space-y-10">
          <Image
            className="rounded-xl w-full object-cover"
            src={image}
            width={1200}
            height={800}
            alt="banner"
          />

          {/* Overview */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">Overview</h2>
            <p className="text-gray-700">{overview}</p>
          </section>

          {/* Event Details */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">Event Details</h2>
            <div className="flex flex-col gap-2">
              <EventDetailItem icon={Clock3} label={date} />
              <EventDetailItem icon={CalendarDays} label={time} />
              <EventDetailItem icon={MapPinned} label={location} />
            </div>
          </section>

          {/* Composers */}
          {composers?.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-3">Composers</h2>
              <div className="flex flex-wrap gap-2">
                {composers.map((composer: string) => (
                  <span
                    key={composer}
                    className="px-3 py-1 bg-gray-200 rounded-full text-gray-700"
                  >
                    {composer}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Performers */}
          {performers?.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-3">Performers</h2>
              <div className="flex flex-wrap gap-2">
                {performers.map((performer: string) => (
                  <span
                    key={performer}
                    className="px-3 py-1 bg-gray-200 rounded-full text-gray-700"
                  >
                    {performer}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Program */}
          <EventProgram programItems={program} />

          {/* Organizer */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">About the Organizer</h2>
            <p className="text-gray-700">{organizer}</p>
          </section>

          {/* Tags */}
          <EventTags tags={tags} />
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="lg:w-80 w-full">
          <div className="p-6 border rounded-xl shadow-sm bg-white sticky top-24">
            <h2 className="text-xl font-semibold mb-1">Book your spot</h2>
            <p className="text-sm text-gray-600 mb-4">
              {bookings > 0
                ? `Join ${bookings} people who have already booked their spot`
                : "Be the first to book your spot"}
            </p>

            <BookEvent eventId={event._id} slug={slug} />
          </div>
        </aside>
      </div>

      {/* SIMILAR EVENTS */}
      {similarEvents?.length > 0 && (
        <section className="pt-20">
          <h2 className="text-2xl font-semibold mb-6">Similar Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarEvents.map((similarEvent: IEvent) => (
              <EventCard key={similarEvent.slug} {...similarEvent} />
            ))}
          </div>
        </section>
      )}
    </section>
  );
};

export default EventDetailsPage;
