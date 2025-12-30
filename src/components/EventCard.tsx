import { CalendarDays, Clock3, MapPinned } from "lucide-react";
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
      <div className="w-[360px] h-[260px]">
        <Image
          src={image}
          alt={title}
          width={150}
          height={100}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      <div className="space-y-2 py-2 px-1">
        <span className="bg-black text-white py-1 px-2 text-xs rounded-sm">
          Dance
        </span>

        <p className="text-lg font-semibold mt-2">{title}</p>

        <div className="flex gap-2">
          <MapPinned className="size-5" />
          <p className="text-sm font-light">{location}</p>
        </div>

        <div className="datetime flex gap-2 text-sm font-light">
          <div className="flex gap-2">
            <CalendarDays className="size-5" />
            <p className="text-sm font-light">{date}</p>
          </div>

          <div className="flex gap-2">
            <Clock3 className="size-5" />
            <p className="text-sm font-light">{time}</p>
          </div>
        </div>
      </div>

      <button className="btn btn-secondary text-sm block mt-3">
        More details
      </button>
    </Link>
  );
};

export default EventCard;
