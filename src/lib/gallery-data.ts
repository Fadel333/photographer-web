export type EventCategory = "wedding" | "birthday" | "matriculation" | "portrait";

export type GalleryEvent = {
  slug: string;
  title: string;
  category: EventCategory;
  location: string;
  year: string;
  blurb: string;
  count: number;
  photos?: string[];
};

export const EVENTS: GalleryEvent[] = [
  {
    slug: "all-work",
    title: "All Work",
    category: "portrait",
    location: "Ghana",
    year: "2025",
    blurb: "A curated selection of portraits, celebrations, and milestones.",
    count: 42,
  },
];

export function getEvent(slug: string): GalleryEvent | undefined {
  return EVENTS.find((e) => e.slug === slug);
}

export function photosFor(event: GalleryEvent): string[] {
  return Array.from(
    { length: event.count },
    (_, i) => `/gallery/${i + 1}.jpg`
  );
}