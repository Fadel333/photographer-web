import type { Package, Booking, BookingInquiry } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
  });
  if (!res.ok) {
    let detail = res.statusText;
    try { detail = (await res.json()).detail ?? detail; } catch {}
    throw new Error(`${res.status}: ${detail}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  listPackages: () => request<Package[]>("/packages"),
  createInquiry: (data: BookingInquiry) =>
    request<Booking>("/bookings/inquiry", {
      method: "POST",
      body: JSON.stringify(data),
    }),

    listBlockedDates: () => request<{ id: number; start_date: string; end_date: string; reason: string }[]>("/blocked-dates"),
};