"use client";
import { useState } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const fd = new FormData(e.currentTarget);

    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();

    if (!name || !email || !email.includes("@") || !message) {
      setError("Please fill in your name, a valid email, and a message.");
      setStatus("error");
      return;
    }

    try {
      // Reuse the inquiry endpoint with a light payload.
      // The full booking flow lives at /book — this is just a "hello".
      const res = await fetch(`${API}/bookings/inquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name,
          customer_email: email,
          customer_phone: "",
          event_type: "other",
          event_date: new Date().toISOString().slice(0, 10),
          location: "",
          notes: message,
          terms_accepted: true,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.detail || `${res.status}`);
      }
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "done") {
    return (
      <main className="max-w-xl mx-auto px-6 py-32 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-6">Message sent</p>
        <h1 className="font-serif text-4xl md:text-5xl mb-4">Thank you. ✨</h1>
        <p className="text-neutral-600 max-w-sm mx-auto">
          We&apos;ll be in touch within 24 hours. In the meantime, feel free to browse our work.
        </p>
        <div className="mt-10 flex gap-3 justify-center flex-wrap">
          <Link href="/gallery" className="border border-neutral-300 px-6 py-3 rounded hover:border-black">
            View gallery
          </Link>
          <Link href="/" className="bg-black text-white px-6 py-3 rounded hover:bg-neutral-800">
            Back home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-16 sm:py-24">
      {/* HERO */}
      <header className="max-w-2xl mb-16">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-4">Contact</p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-tight">
          Let&apos;s talk.
        </h1>
        <p className="mt-6 text-neutral-600 max-w-lg">
          Whether you&apos;re planning a wedding, a matriculation shoot, or a portrait session —
          tell us a little about it, and we&apos;ll respond within 24 hours.
        </p>
      </header>

      {/* TWO CONTACT CARDS */}
      <div className="grid gap-4 md:grid-cols-2 mb-16">
        <a
          href="mailto:reginaldzokottoh@gmail.com"
          className="border border-neutral-200 rounded-lg p-6 hover:border-black transition-colors group"
        >
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">Email</p>
          <p className="font-serif text-xl">reginaldzokottoh@gmail.com</p>
          <p className="text-sm text-neutral-600 mt-3">
            For detailed inquiries, corporate bookings, and collaboration requests.
          </p>
          <span className="inline-block mt-4 text-sm underline group-hover:text-black">
            Send an email →
          </span>
        </a>

        <a
          href="https://wa.me/233546081145?text=Hi%20Klik%20Haus%2C%20I%27d%20like%20to%20ask%20about%20a%20session"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-neutral-200 rounded-lg p-6 hover:border-black transition-colors group"
        >
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">WhatsApp</p>
          <p className="font-serif text-xl">+233 54 608 1145</p>
          <p className="text-sm text-neutral-600 mt-3">
            For quick questions and urgent availability checks.
          </p>
          <span className="inline-block mt-4 text-sm underline group-hover:text-black">
            Message on WhatsApp →
          </span>
        </a>
      </div>

      {/* SHORT FORM */}
      <section className="border-t border-neutral-200 pt-12 mb-16">
        <h2 className="font-serif text-3xl mb-2">Or send a message</h2>
        <p className="text-neutral-500 mb-8">
          Not ready to book yet? Tell us a little about your plans.
        </p>

        <form onSubmit={onSubmit} className="space-y-5 max-w-xl">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Your name</label>
              <input
                name="name"
                required
                className="w-full border border-neutral-300 p-3 rounded focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full border border-neutral-300 p-3 rounded focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Message</label>
            <textarea
              name="message"
              rows={5}
              required
              placeholder="Tell us about your event, dates, location, and what you're looking for…"
              className="w-full border border-neutral-300 p-3 rounded focus:outline-none focus:border-black"
            />
          </div>

          <button
            disabled={status === "sending"}
            className="w-full bg-black text-white py-4 rounded hover:bg-neutral-800 disabled:opacity-50 transition-colors"
          >
            {status === "sending" ? "Sending…" : "Send message"}
          </button>

          {status === "error" && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded">
              {error}
            </div>
          )}

          <p className="text-xs text-neutral-400">
            We respond to every message within 24 hours.
          </p>
        </form>
      </section>

      {/* STUDIO DETAILS */}
      <section className="border-t border-neutral-200 pt-12 grid gap-8 md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-3">Based in</p>
          <p className="font-serif text-lg">Accra, Ghana</p>
          <p className="text-sm text-neutral-600 mt-2">Available across Ghana and internationally.</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-3">Response time</p>
          <p className="font-serif text-lg">Within 24 hours</p>
          <p className="text-sm text-neutral-600 mt-2">Monday–Saturday, 9am–6pm GMT.</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-3">Planning an event?</p>
          <p className="font-serif text-lg">Start an inquiry</p>
          <Link href="/book" className="text-sm underline mt-2 inline-block">
            Use the booking form →
          </Link>
        </div>
      </section>

      {/* MINI FAQ */}
      <section className="border-t border-neutral-200 pt-12 mt-16 max-w-2xl">
        <h2 className="font-serif text-2xl mb-6">Quick answers</h2>
        <div className="space-y-4 text-sm">
          <div>
            <p className="font-medium">Do you travel outside Accra?</p>
            <p className="text-neutral-600 mt-1">
              Yes. Travel within Greater Accra is included; further destinations are quoted individually.
            </p>
          </div>
          <div>
            <p className="font-medium">How far in advance should I book?</p>
            <p className="text-neutral-600 mt-1">
              3–6 months for weddings and matriculations; 2–4 weeks for portraits and birthdays.
            </p>
          </div>
          <div>
            <p className="font-medium">Do you offer prints?</p>
            <p className="text-neutral-600 mt-1">
              Yes. Prints and albums can be added to any package — ask when you get in touch.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}