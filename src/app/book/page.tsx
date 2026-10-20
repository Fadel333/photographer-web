"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { EventType, Package } from "@/lib/types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type Blocked = { id: number; start_date: string; end_date: string; reason: string };

export default function BookPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [packages, setPackages] = useState<Package[]>([]);
  const [blocked, setBlocked] = useState<Blocked[]>([]);
  const [eventDate, setEventDate] = useState("");
  const [selectedPkg, setSelectedPkg] = useState<number | null>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("package");
    if (p) setSelectedPkg(Number(p));
    api.listPackages().then(setPackages).catch(() => {});
    fetch(`${API}/blocked-dates`).then(r => r.ok ? r.json() : []).then(setBlocked).catch(() => {});
  }, []);

  const pkg = packages.find((p) => p.id === selectedPkg);
  const dateConflict = blocked.find(
    (b) => eventDate && eventDate >= b.start_date && eventDate <= b.end_date
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (dateConflict) {
      setError(`That date is unavailable: ${dateConflict.reason || "blocked"}`);
      setStatus("error");
      return;
    }
    setStatus("sending");
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      const booking = await api.createInquiry({
        customer_name: String(fd.get("name")),
        customer_email: String(fd.get("email")),
        customer_phone: String(fd.get("phone") ?? ""),
        event_type: String(fd.get("event_type")) as EventType,
        event_date: String(fd.get("event_date")),
        location: String(fd.get("location") ?? ""),
        package_id: selectedPkg ?? undefined,
        notes: String(fd.get("notes") ?? ""),
        terms_accepted: fd.get("terms") === "on",
      });
      // Redirect to the success/payment page!
      window.location.href = `/book/success?booking_id=${booking.id}`;
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "done") {
    return (
      <main className="max-w-xl mx-auto px-6 py-32 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-6">Inquiry received</p>
        <h1 className="font-serif text-4xl md:text-5xl">Thank you. ✨</h1>
        <p className="mt-6 text-neutral-600 max-w-sm mx-auto">
          We&apos;ll be in touch within 24 hours to confirm details and next steps.
        </p>
        <div className="mt-12 flex gap-4 justify-center flex-wrap">
          <Link href="/gallery" className="border border-neutral-300 px-6 py-3 rounded hover:border-black">
            View our work
          </Link>
          <Link href="/" className="bg-black text-white px-6 py-3 rounded hover:bg-neutral-800">
            Back home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-24">
      <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-4">Klik Haus Booking</p>
      <h1 className="font-serif text-4xl md:text-5xl mb-3">Tell us about your day.</h1>
      <p className="text-neutral-500 mb-12 max-w-md">
        Fill in what you know — we&apos;ll respond within 24 hours to talk through the rest.
      </p>

      {pkg && (
        <div className="border border-neutral-200 rounded-lg p-5 mb-10 bg-neutral-50">
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">Selected package</p>
          <p className="font-serif text-xl">{pkg.name}</p>
          <p className="text-sm text-neutral-600 mt-1">
            GH₵{(pkg.price_cents / 100).toLocaleString()} · {pkg.duration_hours}h · {pkg.deposit_pct}% deposit (GH₵
            {((pkg.price_cents * pkg.deposit_pct) / 10000).toLocaleString()})
          </p>
          <Link href="/packages" className="text-xs underline mt-3 inline-block">
            Change package
          </Link>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Your name</label>
            <input name="name" required className="w-full border border-neutral-300 p-3 rounded focus:outline-none focus:border-black" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Email</label>
            <input name="email" type="email" required className="w-full border border-neutral-300 p-3 rounded focus:outline-none focus:border-black" />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Phone (optional)</label>
          <input name="phone" className="w-full border border-neutral-300 p-3 rounded focus:outline-none focus:border-black" />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Event type</label>
            <select name="event_type" required className="w-full border border-neutral-300 p-3 rounded focus:outline-none focus:border-black">
              <option value="wedding">Wedding</option>
              <option value="funeral">Funeral</option>
              <option value="birthday">Birthday</option>
              <option value="matriculation">Matriculation</option>
              <option value="photoshoot">Photoshoot</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Event date</label>
            <input
              name="event_date"
              type="date"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className={`w-full border p-3 rounded focus:outline-none focus:border-black ${
                dateConflict ? "border-red-400" : "border-neutral-300"
              }`}
            />
            {dateConflict && (
              <p className="text-red-600 text-xs mt-2">
                Unavailable: {dateConflict.reason || "already blocked"}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Location</label>
          <input name="location" placeholder="e.g. Accra, Aburi, Cape Coast" className="w-full border border-neutral-300 p-3 rounded focus:outline-none focus:border-black" />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Anything we should know?</label>
          <textarea name="notes" rows={4} placeholder="Guest count, venue, vibe, must-have moments…" className="w-full border border-neutral-300 p-3 rounded focus:outline-none focus:border-black" />
        </div>

        <label className="flex items-start gap-3 text-sm text-neutral-600 pt-2">
          <input name="terms" type="checkbox" required className="mt-1" />
          <span>I agree to be contacted about my inquiry and accept the booking terms and privacy policy.</span>
        </label>

        <button
          disabled={status === "sending" || !!dateConflict}
          className="w-full bg-black text-white py-4 rounded hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {status === "sending" ? "Sending…" : "Send inquiry"}
        </button>

        {status === "error" && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded">{error}</div>
        )}
      </form>

      <p className="text-xs text-neutral-400 mt-12 text-center">
        Prefer email? Write to <a href="mailto:reginaldzokottoh@gmail.com" className="underline">reginaldzokottoh@gmail.com</a>
      </p>
    </main>
  );
}