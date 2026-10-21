import type { Package, Booking, BookingInquiry } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
  });
  if (!res.ok) {
    let detail: string = res.statusText;
    try {
      const data = await res.json();
      if (Array.isArray(data.detail)) {
        detail = data.detail
          .map((e: { loc?: string[]; msg?: string }) => {
            const field = e.loc?.filter((l) => l !== "body").join(".") ?? "field";
            return `${field}: ${e.msg ?? "invalid"}`;
          })
          .join("; ");
      } else if (typeof data.detail === "string") {
        detail = data.detail;
      }
    } catch {}
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