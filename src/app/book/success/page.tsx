"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type Booking = {
  id: number;
  customer_name: string;
  customer_email: string;
  event_type: string;
  event_date: string;
  status: string;
  total_cents: number;
  deposit_cents: number;
};

export default function BookSuccessPage() {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("booking_id");
    if (!id) {
      setLoading(false);
      return;
    }
    fetch(`${API}/bookings/${id}/public`)
      .then((r) => (r.ok ? r.json() : null))
      .then((b) => setBooking(b))
      .catch(() => setError("Could not load booking"))
      .finally(() => setLoading(false));
  }, []);

  async function payDeposit() {
    if (!booking) return;
    setPaying(true);
    setError("");
    try {
      const res = await fetch(`${API}/bookings/${booking.id}/deposit`, {
        method: "POST",
      });
      if (!res.ok) throw new Error(`Payment init failed (${res.status})`);
      const { authorization_url } = await res.json();
      window.location.href = authorization_url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setPaying(false);
    }
  }

  if (loading) {
    return (
      <main className="max-w-xl mx-auto px-6 py-32 text-center">
        <p className="text-neutral-500">Loading your booking…</p>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="max-w-xl mx-auto px-6 py-32 text-center">
        <h1 className="font-serif text-4xl mb-4">Booking not found</h1>
        <p className="text-neutral-600 mb-8">
          We couldn&apos;t locate that booking. Please check your confirmation email.
        </p>
        <Link href="/" className="underline">← Back home</Link>
      </main>
    );
  }

  const depositGHS = (booking.deposit_cents / 100).toLocaleString();
  const alreadyPaid = booking.status === "deposit_paid" || booking.status === "completed";

  return (
    <main className="max-w-xl mx-auto px-6 py-24">
      {alreadyPaid ? (
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-4">Payment received</p>
          <h1 className="font-serif text-4xl md:text-5xl mb-4">Thank you. ✨</h1>
          <p className="text-neutral-600 mb-8">
            Your deposit has been paid. We&apos;ll send a confirmation email shortly with next steps.
          </p>
          <div className="border rounded-lg p-6 text-left bg-neutral-50">
            <p className="text-xs uppercase tracking-widest text-neutral-500 mb-3">Your booking</p>
            <p className="font-serif text-xl">{booking.customer_name}</p>
            <p className="text-sm text-neutral-600 capitalize">
              {booking.event_type} · {booking.event_date}
            </p>
            <p className="text-sm mt-3">
              Deposit paid: <span className="font-medium">GH₵{depositGHS}</span>
            </p>
          </div>
          <Link href="/gallery" className="inline-block mt-10 underline text-sm">
            Browse our work while you wait →
          </Link>
        </div>
      ) : (
        <>
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-4">
            Step 2 of 2
          </p>
          <h1 className="font-serif text-4xl md:text-5xl mb-4">
            Your inquiry is in.
          </h1>
          <p className="text-neutral-600 mb-10">
            To confirm your date, please pay the deposit. We&apos;ll be in touch within 24 hours with the next steps.
          </p>

          <div className="border rounded-lg p-6 mb-8">
            <p className="text-xs uppercase tracking-widest text-neutral-500 mb-3">Booking summary</p>
            <p className="font-serif text-xl">{booking.customer_name}</p>
            <p className="text-sm text-neutral-600 capitalize">
              {booking.event_type} · {booking.event_date}
            </p>
            <div className="mt-4 pt-4 border-t border-neutral-200 flex justify-between text-sm">
              <span>Total</span>
              <span>GH₵{(booking.total_cents / 100).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mt-1 font-medium">
              <span>Deposit due</span>
              <span>GH₵{depositGHS}</span>
            </div>
          </div>

          <button
            onClick={payDeposit}
            disabled={paying}
            className="w-full bg-black text-white py-4 rounded hover:bg-neutral-800 disabled:opacity-50 transition-colors"
          >
            {paying ? "Redirecting to Paystack…" : `Pay GH₵${depositGHS} deposit`}
          </button>

          {error && (
            <p className="text-red-600 text-sm mt-4 text-center">{error}</p>
          )}

          <p className="text-xs text-neutral-400 mt-6 text-center">
            Secure payment via Paystack. You&apos;ll be redirected back once complete.
          </p>
        </>
      )}
    </main>
  );
}