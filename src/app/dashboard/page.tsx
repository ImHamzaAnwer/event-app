"use client";

import { IEvent } from "@/database";
import { deleteEvent, fetchEvents } from "@/lib/eventService";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEvents = async () => {
      try {
        setLoading(true);
        const events: IEvent[] = await fetchEvents();
        if (events?.length > 0) setEvents(events);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    getEvents();
  }, []);

  const onDeleteEvent = async (eventId: string) => {
    const isDeleted = await deleteEvent(eventId);
    if (isDeleted) {
      setEvents((prev) => prev.filter((event) => event._id !== eventId));
    }
  };

  const getStatusBadge = (event: IEvent) => {
    if (event.isCancelled) {
      return (
        <span className="px-2 py-1 bg-red-500/20 text-red-500 rounded text-xs">
          Cancelled
        </span>
      );
    }

    // Check if event is happening now (date and time match current time)
    const eventDateTime = new Date(`${event.date}T${event.time}`);
    const now = new Date();
    const isHappeningNow =
      eventDateTime <= now &&
      now <= new Date(eventDateTime.getTime() + 3 * 60 * 60 * 1000); // 3 hours window

    if (isHappeningNow) {
      return (
        <span className="px-2 py-1 bg-purple-500/20 text-purple-500 rounded text-xs">
          Happening Now
        </span>
      );
    }

    if (eventDateTime > now) {
      return (
        <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded text-xs">
          Coming Soon
        </span>
      );
    }

    return (
      <span className="px-2 py-1 bg-gray-500/20 text-gray-500 rounded text-xs">
        Past
      </span>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        {events.length > 0 && (
          <Link
            href="/dashboard/create"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Event
          </Link>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p>Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No events found</p>
          <Link
            href="/dashboard/create"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Your First Event
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Composers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event._id?.toString()} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {event.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {event.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{event.date}</div>
                    <div className="text-sm text-gray-500">{event.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(event)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {event.composers && event.composers.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {event.composers.slice(0, 2).map((composer) => (
                            <span
                              key={composer}
                              className="px-2 py-1 bg-gray-100 rounded text-xs"
                            >
                              {composer}
                            </span>
                          ))}
                          {event.composers.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{event.composers.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(event.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/events/${event.slug}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                      <button className="text-indigo-600 hover:text-indigo-900">
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteEvent(event._id as string)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
