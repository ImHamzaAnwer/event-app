/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface EventFormProps {
  initialData?: any; // event when editing
  mode: "create" | "edit";
}

const EventForm = ({ initialData, mode }: EventFormProps) => {
  const router = useRouter();
  const isEditing = mode === "edit";

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    overview: initialData?.overview || "",
    venue: initialData?.venue || "",
    location: initialData?.location || "",
    date: initialData?.date?.split("T")[0] || "",
    time: initialData?.time || "",
    organizer: initialData?.organizer || "",
    capacity: initialData?.capacity || 0,
    price: initialData?.price || 0,
    featured: initialData?.featured || false,
    isCancelled: initialData?.isCancelled || false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState(initialData?.image || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Array fields
  const [tags, setTags] = useState<string[]>([]);
  const [composers, setComposers] = useState<string[]>([]);
  const [program, setProgram] = useState<string[]>([]);
  const [performers, setPerformers] = useState<string[]>([]);

  // Array input helpers
  const [tagInput, setTagInput] = useState("");
  const [composerInput, setComposerInput] = useState("");
  const [programInput, setProgramInput] = useState("");
  const [performerInput, setPerformerInput] = useState("");

  useEffect(() => {
    if (!initialData) return;
    setTags(initialData.tags ?? []);
    setComposers(initialData.composers ?? []);
    setProgram(initialData.program ?? []);
    setPerformers(initialData.performers ?? []);
    setExistingImage(initialData.image || "");

    setFormData((prev) => ({
      ...prev,
      capacity: initialData.capacity ?? "",
      price: initialData.price ?? "",
    }));
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!isEditing && !imageFile) {
        setError("Please select an image");
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          formDataToSend.append(key, String(value));
        }
      });

      if (isEditing) formDataToSend.append("eventId", initialData._id);
    
      // Add arrays as JSON strings
      formDataToSend.append("tags", JSON.stringify(tags));
      formDataToSend.append("composers", JSON.stringify(composers));
      formDataToSend.append("program", JSON.stringify(program));
      formDataToSend.append("performers", JSON.stringify(performers));

      // Add image file
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      if (isEditing) {
        const response = await axios.put("/api/events", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          router.push("/dashboard");
        }
      } else {
        const response = await axios.post("/api/events", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 201) {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      console.error("Error creating event:", err);
      const errorMessage =
        err instanceof Error && "response" in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data
              ?.error
          : undefined;
      setError(errorMessage || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const addToArray = (
    value: string,
    setArray: React.Dispatch<React.SetStateAction<string[]>>,
    setInput: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (value.trim()) {
      setArray((prev) => [...prev, value.trim()]);
      setInput("");
    }
  };

  const removeFromArray = (
    index: number,
    setArray: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setArray((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white text-black! p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={100}
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              maxLength={1000}
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Overview <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              maxLength={500}
              rows={3}
              value={formData.overview}
              onChange={(e) =>
                setFormData({ ...formData, overview: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              required
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border rounded-md"
            />
            <div className="mt-2">
              {imageFile ? (
                <Image
                  width={120}
                  height={120}
                  alt=""
                  src={URL.createObjectURL(imageFile)}
                  className="h-32 w-auto rounded"
                />
              ) : existingImage ? (
                <Image
                  width={120}
                  height={120}
                  alt=""
                  src={existingImage}
                  className="h-32 w-auto rounded"
                />
              ) : (
                <p>No image uploaded</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="bg-white text-black! p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Event Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Venue <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.venue}
              onChange={(e) =>
                setFormData({ ...formData, venue: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              required
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Organizer <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.organizer}
              onChange={(e) =>
                setFormData({ ...formData, organizer: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Classical Music Fields */}
      <div className="bg-white text-black! p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Classical Music Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Composers</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={composerInput}
                onChange={(e) => setComposerInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addToArray(composerInput, setComposers, setComposerInput);
                  }
                }}
                placeholder="Add composer name"
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <button
                type="button"
                onClick={() =>
                  addToArray(composerInput, setComposers, setComposerInput)
                }
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {composers.map((composer, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                >
                  {composer}
                  <button
                    type="button"
                    onClick={() => removeFromArray(idx, setComposers)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Program</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={programInput}
                onChange={(e) => setProgramInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addToArray(programInput, setProgram, setProgramInput);
                  }
                }}
                placeholder="Add piece/work name"
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <button
                type="button"
                onClick={() =>
                  addToArray(programInput, setProgram, setProgramInput)
                }
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {program.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-2"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeFromArray(idx, setProgram)}
                    className="text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Performers</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={performerInput}
                onChange={(e) => setPerformerInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addToArray(
                      performerInput,
                      setPerformers,
                      setPerformerInput
                    );
                  }
                }}
                placeholder="Add performer/ensemble name"
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <button
                type="button"
                onClick={() =>
                  addToArray(performerInput, setPerformers, setPerformerInput)
                }
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {performers.map((performer, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center gap-2"
                >
                  {performer}
                  <button
                    type="button"
                    onClick={() => removeFromArray(idx, setPerformers)}
                    className="text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Fields */}
      <div className="bg-white p-6 text-black! rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addToArray(tagInput, setTags, setTagInput);
                  }
                }}
                placeholder="Add tag"
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <button
                type="button"
                onClick={() => addToArray(tagInput, setTags, setTagInput)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeFromArray(idx, setTags)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Capacity</label>
              <input
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Featured Event</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isCancelled}
                onChange={(e) =>
                  setFormData({ ...formData, isCancelled: e.target.checked })
                }
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Cancel Event</span>
            </label>
          </div>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {loading
            ? isEditing
              ? "Updating..."
              : "Publishing..."
            : isEditing
            ? "Update"
            : "Publish"}
        </button>
        <Link
          href="/dashboard"
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Cancel
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </form>
  );
};

export default EventForm;
