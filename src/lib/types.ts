export type EventType = "wedding" | "funeral" | "birthday" | "photoshoot" | "other";

export type BookingStatus =
  | "inquiry" | "contacted" | "confirmed"
  | "deposit_paid" | "completed" | "cancelled";

export interface Package {
  id: number;
  event_type: EventType;
  name: string;
  description: string;
  price_cents: number;
  deposit_pct: number;
  duration_hours: number;
  active: boolean;
}

export interface Booking {
  id: number;
  customer_name: string;
  customer_email: string;
  event_type: EventType;
  event_date: string;
  status: BookingStatus;
  total_cents: number;
  deposit_cents: number;
}

export interface BookingInquiry {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  event_type: EventType;
  event_date: string;
  start_time?: string | null;
  duration_hours?: number;
  location?: string;
  package_id?: number | null;
  notes?: string;
  terms_accepted: boolean;
}