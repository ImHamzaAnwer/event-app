import Link from "next/link";
import EventForm from "@/components/EventForm";

export default function CreateEventPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold">Create New Event</h1>
      </div>
      <EventForm mode="create" />
    </div>
  );
}
