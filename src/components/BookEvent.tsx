"use client";

import { useRouter } from "next/navigation";

const BookEvent = ({ slug }: { slug: string }) => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/events/${slug}/purchase`)}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
    >
      Purchase Tickets
    </button>
  );
};

export default BookEvent;
