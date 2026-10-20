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

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border rounded-lg p-3 sm:p-4">
      <p className="text-[10px] sm:text-xs uppercase tracking-widest text-neutral-500">{label}</p>
      <p className="font-serif text-xl sm:text-2xl mt-1 sm:mt-2">{value}</p>
    </div>
  );
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("admin_token");
    if (t) {
      setToken(t);
      load(t);
    }
  }, []);

  async function load(t: string) {
    try {
      const res = await fetch(`${API}/bookings`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (!res.ok) throw new Error(`${res.status}`);
      setBookings(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    }
  }

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const body = new URLSearchParams();
    body.set("username", String(fd.get("email")));
    body.set("password", String(fd.get("password")));

    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) {
      setError("Bad credentials");
      return;
    }
    const { access_token } = await res.json();
    localStorage.setItem("admin_token", access_token);
    setToken(access_token);
    load(access_token);
  }

  async function setStatus(id: number, status: string) {
    if (!token) return;
    await fetch(`${API}/bookings/${id}/status?status=${status}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    load(token);
  }

  if (!token) {
    return (
      <main className="max-w-md mx-auto px-4 sm:px-6 py-20 sm:py-24">
        <h1 className="font-serif text-3xl sm:text-4xl mb-8">Klik Haus Admin</h1>
        <form onSubmit={login} className="space-y-4">
          <input name="email" type="email" required placeholder="Email" className="w-full border p-3 rounded" />
          <input name="password" type="password" required placeholder="Password" className="w-full border p-3 rounded" />
          <button className="w-full bg-black text-white py-3 rounded">Sign in</button>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-4 mb-10">
        <h1 className="font-serif text-3xl sm:text-4xl">Inquiries</h1>
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/admin/packages" className="text-sm underline hover:text-black">
            Manage packages
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("admin_token");
              setToken(null);
              setBookings([]);
            }}
            className="text-sm text-neutral-500 hover:text-black"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* STATS STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
        <Stat label="Total inquiries" value={bookings.length} />
        <Stat label="Pending" value={bookings.filter((b) => b.status === "inquiry").length} />
        <Stat label="Confirmed" value={bookings.filter((b) => b.status === "confirmed" || b.status === "deposit_paid").length} />
        <Stat
          label="Upcoming value"
          value={`GH₵${(
            bookings
              .filter((b) => b.status !== "cancelled")
              .reduce((s, b) => s + b.total_cents, 0) / 100
          ).toLocaleString()}`}
        />
      </div>

      {/* BOOKINGS LIST */}
      {bookings.length === 0 && <p className="text-neutral-500">No inquiries yet.</p>}

      <div className="space-y-4">
        {bookings.map((b) => (
          <div key={b.id} className="border rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row sm:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-neutral-500">
                {b.event_type} · {b.event_date}
              </p>
              <h2 className="font-serif text-lg sm:text-xl mt-1">{b.customer_name}</h2>
              <p className="text-sm text-neutral-600 break-all">{b.customer_email}</p>
              <p className="text-sm mt-2">
                GH₵{(b.total_cents / 100).toLocaleString()} · deposit GH₵{(b.deposit_cents / 100).toLocaleString()}
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto mt-2 sm:mt-0">
              <span className="text-xs px-2 py-1 rounded bg-neutral-100">{b.status}</span>
              {b.status === "inquiry" && (
                <button onClick={() => setStatus(b.id, "confirmed")}
                  className="bg-black text-white px-4 py-2 rounded text-sm w-full sm:w-auto">
                  Confirm
                </button>
              )}
              {b.status !== "cancelled" && b.status !== "completed" && (
                <button onClick={() => setStatus(b.id, "cancelled")}
                  className="text-sm text-neutral-500 hover:text-red-600 w-full sm:w-auto text-left sm:text-right mt-1">
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* BLOCKED DATES */}
      <BlockedDates token={token} />
    </main>
  );
}

function BlockedDates({ token }: { token: string }) {
  const [items, setItems] = useState<{ id: number; start_date: string; end_date: string; reason: string }[]>([]);
  const [err, setErr] = useState("");

  async function load() {
    const res = await fetch(`${API}/blocked-dates`);
    if (res.ok) setItems(await res.json());
  }
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`${API}/blocked-dates`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        start_date: String(fd.get("start")),
        end_date: String(fd.get("end")),
        reason: String(fd.get("reason") ?? ""),
      }),
    });
    if (!res.ok) { setErr(`${res.status}`); return; }
    (e.target as HTMLFormElement).reset();
    load();
  }

  async function remove(id: number) {
    await fetch(`${API}/blocked-dates/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    load();
  }

  return (
    <section className="mt-16 sm:mt-24 pt-10 sm:pt-12 border-t border-neutral-200">
      <h2 className="font-serif text-2xl sm:text-3xl mb-4 sm:mb-6">Blocked dates</h2>
      <p className="text-sm text-neutral-500 mb-6 max-w-lg">
        Mark days you are unavailable (e.g. out of town or editing). The booking form will automatically reject inquiries on these dates.
      </p>
      
      <form onSubmit={add} className="flex flex-col md:flex-row flex-wrap gap-4 mb-8 bg-neutral-50 p-4 sm:p-6 rounded-lg border border-neutral-200">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Start date</label>
          <input name="start" type="date" required className="w-full border p-3 rounded focus:border-black outline-none" />
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">End date</label>
          <input name="end" type="date" required className="w-full border p-3 rounded focus:border-black outline-none" />
        </div>
        <div className="flex-[2] min-w-[250px]">
          <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Reason</label>
          <input name="reason" placeholder="e.g. Out of town" className="w-full border p-3 rounded focus:border-black outline-none" />
        </div>
        <div className="flex items-end pb-1 w-full md:w-auto">
          <button className="bg-black text-white px-6 py-3 rounded hover:bg-neutral-800 transition-colors w-full md:w-auto">Block Date</button>
        </div>
      </form>
      
      {err && <p className="text-red-600 text-sm mb-4">Error: {err}</p>}
      
      <ul className="space-y-3">
        {items.map((b) => (
          <li key={b.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center border p-4 rounded bg-white gap-3">
            <span className="font-medium text-sm sm:text-base">
              {b.start_date} <span className="text-neutral-400 mx-1 sm:mx-2">→</span> {b.end_date}
              {b.reason && <span className="text-neutral-500 font-normal block sm:inline sm:ml-3 italic mt-1 sm:mt-0">({b.reason})</span>}
            </span>
            <button onClick={() => remove(b.id)} className="text-sm text-red-600 hover:underline self-start sm:self-auto">Remove</button>
          </li>
        ))}
        {items.length === 0 && <li className="text-neutral-500 text-sm py-4">No blocked dates yet.</li>}
      </ul>
    </section>
  );
}