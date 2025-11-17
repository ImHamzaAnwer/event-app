import Image from "next/image";
import Link from "next/link";

interface EventCardProps {
  title: string;
  image: string;
  location: string;
  date: string;
  time: string;
  slug: string;
}

const EventCard = ({
  title,
  image,
  location,
  date,
  time,
  slug,
}: EventCardProps) => {
  return (
    <Link href={`/events/${slug}`}>
      <Image
        src={image}
        alt={title}
        width={410}
        height={300}
        className="poster"
      />

      <div className="flex gap-2">
        <Image src="/icons/pin.svg" alt="Location" width={14} height={14} />
        <p className="text-light-200 text-sm font-light">{location}</p>
      </div>

      <p className="title">{title}</p>

      <div className="datetime flex gap-2 text-sm font-light">
        <div className="flex gap-2">
          <Image src="/icons/calendar.svg" alt="Date" width={14} height={14} />
          <p>{date}</p>
        </div>

        <div className="flex gap-2">
          <Image src="/icons/clock.svg" alt="Time" width={14} height={14} />
          <p>{time}</p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
