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
      <div className="overflow-hidden rounded-md bg-gray-900 p-2">
        <div className="w-full h-[200px]">
          <Image
            src={image}
            alt={title}
            width={100}
            height={100}
            className="w-full h-[200px] object-cover rounded-lg"
          />
        </div>

        <div className="space-y-2 py-2 px-1">
          <div className="flex gap-2">
            <MapPinned className="size-5 text-white" />
            <p className="text-white text-sm font-light">{location}</p>
          </div>

          <p className="text-white text-lg">{title}</p>

          <div className="datetime flex gap-2 text-sm font-light">
            <div className="flex gap-2">
              <CalendarDays className="size-5 text-white" />
              <p className="text-white text-sm font-light">{date}</p>
            </div>

            <div className="flex gap-2">
              <Clock3 className="size-5 text-white" />
              <p className="text-white text-sm font-light">{time}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
