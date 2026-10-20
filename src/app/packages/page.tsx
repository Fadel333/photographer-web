"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Package } from "@/lib/types";

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.listPackages()
      .then(setPackages)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed"));
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-6 py-24">
      <h1 className="font-serif text-5xl mb-3">Packages</h1>
      <p className="text-neutral-500 mb-16 max-w-md">
        Choose a package to start your booking. Every event is quoted individually after an inquiry.
      </p>

      {error && <p className="text-red-600">API error: {error}</p>}
      {packages.length === 0 && !error && (
        <p className="text-neutral-500">No packages yet.</p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {packages.map((p) => (
          <div key={p.id} className="border border-neutral-200 rounded-lg p-8 hover:border-black transition-colors">
            <p className="text-xs uppercase tracking-widest text-neutral-500">{p.event_type}</p>
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