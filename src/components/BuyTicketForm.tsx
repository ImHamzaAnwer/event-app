/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  eventId: string;
  ticketPrice: number;
}

export default function BuyTicketsForm({ eventId, ticketPrice }: Props) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    quantity: 1,
  });

  const [loading, setLoading] = useState(false);
  const totalAmount = form.quantity * ticketPrice;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/events/book-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          ...form,
        }),
      });

      const data = await res.json();
      console.log(data, "ok janu")
      if (!data.success) {
        alert(data.error || "Booking failed");
        return;
      }

      // later → redirect to payment / success page
      router.push(`/booking/success?orderId=${data.orderId}`);
    } catch (e) {
      console.log(e, "eeeee-e-e-e-e-e-e-e-e-ee-");
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        name="name"
        value={form.name}
        onChange={handleChange}
      />
      <Input
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
      />
      <Input
        label="Phone"
        name="phone"
        value={form.phone}
        onChange={handleChange}
      />

      <div>
        <label className="block text-sm mb-1">Tickets</label>
        <select
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          {[1, 2, 3, 4, 5].map((q) => (
            <option key={q} value={q}>
              {q}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-between text-sm font-medium">
        <span>Total</span>
        <span>${totalAmount}</span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-2 rounded disabled:opacity-60"
      >
        {loading ? "Processing..." : "Buy Tickets"}
      </button>
    </form>
  );
}

/* small reusable input */
function Input({ label, ...props }: any) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <input {...props} className="w-full border rounded px-3 py-2" required />
    </div>
  );
}
