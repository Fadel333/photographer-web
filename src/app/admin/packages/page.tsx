"use client";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type Package = {
  id: number; event_type: string; name: string; description: string;
  price_cents: number; deposit_pct: number; duration_hours: number; active: boolean;
};

const EVENT_TYPES = ["wedding", "funeral", "birthday", "photoshoot", "other"];

export default function AdminPackages() {
  const [token, setToken] = useState<string | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [editing, setEditing] = useState<Package | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("admin_token"));
    load();
  }, []);

  async function load() {
    const res = await fetch(`${API}/packages`);
    if (res.ok) setPackages(await res.json());
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    if (!token) { setErr("Sign in at /admin first"); return; }
    const fd = new FormData(e.currentTarget);
    const body = {
      event_type: String(fd.get("event_type")),
      name: String(fd.get("name")),
      description: String(fd.get("description") ?? ""),
      price_cents: Math.round(Number(fd.get("price")) * 100),
      deposit_pct: Number(fd.get("deposit_pct")),
      duration_hours: Number(fd.get("duration_hours")),
    };

    const url = editing ? `${API}/packages/${editing.id}` : `${API}/packages`;
    const method = editing ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(`${res.status}: ${j.detail ?? res.statusText}`);
      return;
    }
    setEditing(null);
    (e.target as HTMLFormElement).reset();
    load();
  }

  async function remove(p: Package) {
    if (!token) return;
    if (!confirm(`Remove "${p.name}"? Existing bookings are kept.`)) return;
    const res = await fetch(`${API}/packages/${p.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) { setErr(`${res.status}`); return; }
    load();
  }

  if (!token) {
    return (
      <main className="max-w-md mx-auto py-24 px-6">
        <p>Please <a href="/admin" className="underline">sign in</a> first.</p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl mb-8">Manage packages</h1>

      <form onSubmit={submit} className="grid gap-3 md:grid-cols-2 border rounded-lg p-6 mb-12">
        <select name="event_type" required defaultValue={editing?.event_type ?? "wedding"} key={editing?.id ?? "new"}
          className="border p-2 rounded">
          {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input name="name" required defaultValue={editing?.name ?? ""} placeholder="Package name"
          className="border p-2 rounded" />
        <input name="description" defaultValue={editing?.description ?? ""} placeholder="Description"
          className="border p-2 rounded md:col-span-2" />
        <input name="price" type="number" step="0.01" required
          defaultValue={editing ? (editing.price_cents / 100).toString() : ""} placeholder="Price (GH₵)"
          className="border p-2 rounded" />
        <input name="deposit_pct" type="number" required defaultValue={editing?.deposit_pct ?? 30}
          placeholder="Deposit %" className="border p-2 rounded" />
        <input name="duration_hours" type="number" required defaultValue={editing?.duration_hours ?? 8}
          placeholder="Duration (hours)" className="border p-2 rounded" />
        <div className="flex gap-3 md:col-span-2">
          <button className="bg-black text-white px-6 py-2 rounded">
            {editing ? "Save changes" : "Add package"}
          </button>
          {editing && (
            <button type="button" onClick={() => setEditing(null)}
              className="border border-neutral-300 px-6 py-2 rounded">
              Cancel edit
            </button>
          )}
        </div>
        {err && <p className="text-red-600 md:col-span-2">{err}</p>}
      </form>

      <ul className="space-y-3">
        {packages.map((p) => (
          <li key={p.id} className="border rounded p-4 flex justify-between items-center gap-4">
            <div>
              <p className="text-xs uppercase text-neutral-500">{p.event_type}</p>
              <p className="font-serif text-lg">{p.name}</p>
              <p className="text-sm text-neutral-600">
                GH₵{(p.price_cents / 100).toLocaleString()} · {p.duration_hours}h · {p.deposit_pct}% deposit
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button onClick={() => setEditing(p)} className="text-sm underline">Edit</button>
              <button onClick={() => remove(p)} className="text-sm text-red-600">Delete</button>
            </div>
          </li>
        ))}
        {packages.length === 0 && (
          <li className="text-neutral-500 text-sm">No active packages. Add one above.</li>
        )}
      </ul>
    </main>
  );
}