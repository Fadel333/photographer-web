 "use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Package } from "@/lib/types";

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setPackages(null);

    api.listPackages()
      .then((data) => {
        if (!cancelled) setPackages(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load packages");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  // --- LOADING STATE (skeleton) ---
  if (packages === null && !error) {
    return (
      <main className="max-w-5xl mx-auto px-6 py-24">
        <h1 className="font-serif text-5xl mb-3">Packages</h1>
        <p className="text-neutral-500 mb-16 max-w-md">
          Choose a package to start your booking.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="border border-neutral-200 rounded-lg p-8 animate-pulse"
            >
              <div className="h-3 w-20 bg-neutral-200 rounded mb-4" />
              <div className="h-7 w-48 bg-neutral-200 rounded mb-4" />
              <div className="h-4 w-full bg-neutral-200 rounded mb-2" />
              <div className="h-4 w-2/3 bg-neutral-200 rounded mb-8" />
              <div className="h-9 w-32 bg-neutral-200 rounded" />
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-neutral-400 mt-12">
          Waking up the server… this may take up to 30 seconds on first visit.
        </p>
      </main>
    );
  }

  // --- ERROR STATE (with retry) ---
  if (error) {
    return (
      <main className="max-w-xl mx-auto px-6 py-32 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-4">
          A small delay
        </p>
        <h1 className="font-serif text-3xl md:text-4xl mb-4">
          We&apos;re taking longer than usual.
        </h1>
        <p className="text-neutral-600 mb-8">
          The server may still be waking up. Give it a moment and try again.
        </p>
        <button
          onClick={() => setAttempt((a) => a + 1)}
          className="bg-black text-white px-8 py-3 rounded hover:bg-neutral-800 transition-colors"
        >
          Try again
        </button>
        <p className="mt-6 text-xs text-neutral-400">
          Or email <a href="mailto:reginaldzokottoh@gmail.com" className="underline">reginaldzokottoh@gmail.com</a>
        </p>
      </main>
    );
  }

  // --- SUCCESS STATE ---
  return (
    <main className="max-w-5xl mx-auto px-6 py-24">
      <h1 className="font-serif text-5xl mb-3">Packages</h1>
      <p className="text-neutral-500 mb-16 max-w-md">
        Choose a package to start your booking. Every event is quoted individually after an inquiry.
      </p>

      {packages!.length === 0 && (
        <p className="text-neutral-500">No packages yet. Check back soon.</p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {packages!.map((p) => (
          <div
            key={p.id}
            className="border border-neutral-200 rounded-lg p-8 hover:border-black transition-colors"
          >
            <p className="text-xs uppercase tracking-widest text-neutral-500">
              {p.event_type}
            </p>
            <h2 className="font-serif text-2xl mt-2">{p.name}</h2>
            <p className="text-neutral-600 mt-3">{p.description}</p>
            <p className="mt-6 text-2xl font-serif">
              GH₵{(p.price_cents / 100).toLocaleString()}
            </p>
            <p className="text-sm text-neutral-500 mt-1">
              {p.duration_hours}h · {p.deposit_pct}% deposit
            </p>
            <Link
              href={`/book?package=${p.id}`}
              className="mt-8 inline-block bg-black text-white px-8 py-3 rounded hover:bg-neutral-800 transition-colors"
            >
              Book this
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}