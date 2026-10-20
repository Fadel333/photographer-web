"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { EVENTS, photosFor } from "@/lib/gallery-data";

export default function GalleryPage() {
  const photos = photosFor(EVENTS[0]);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const current = lightbox !== null ? photos[lightbox] : null;

  const prev = useCallback(() => {
    if (lightbox === null) return;
    setLightbox((lightbox - 1 + photos.length) % photos.length);
  }, [lightbox, photos.length]);

  const next = useCallback(() => {
    if (lightbox === null) return;
    setLightbox((lightbox + 1) % photos.length);
  }, [lightbox, photos.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, prev, next]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl mb-3">Gallery</h1>
      <p className="text-neutral-500 mb-10 sm:mb-12 max-w-md text-sm sm:text-base">
        A curated selection of portraits, celebrations, and milestones.
      </p>

      {/* Masonry grid */}
      <div className="columns-2 md:columns-3 gap-2 sm:gap-4 [&>*]:mb-2 sm:mb-4">
        {photos.map((src, i) => (
          <motion.button
            key={src}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.05 }}
            onClick={() => setLightbox(i)}
            className="block w-full break-inside-avoid group relative overflow-hidden rounded bg-neutral-100"
          >
            <div className="relative aspect-[3/4]">
              <Image
                src={src}
                alt={`Gallery image ${i + 1}`}
                fill
                priority={i === 0}
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Full-Screen Lightbox */}
      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-2 sm:p-4 md:p-12"
            onClick={() => setLightbox(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/70 hover:text-white text-3xl sm:text-4xl z-50 transition-colors p-2"
              aria-label="Close"
            >
              ×
            </button>

            {/* Left Arrow */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-1 sm:left-4 md:left-8 text-white/50 hover:text-white text-4xl sm:text-5xl md:text-6xl z-50 transition-colors p-2 sm:p-4"
              aria-label="Previous"
            >
              ‹
            </button>

            {/* The Image Container - Responsive & Contained */}
            <motion.div
              key={current}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full h-full max-w-6xl flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={current}
                alt="Full screen view"
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </motion.div>

            {/* Right Arrow */}
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-1 sm:right-4 md:right-8 text-white/50 hover:text-white text-4xl sm:text-5xl md:text-6xl z-50 transition-colors p-2 sm:p-4"
              aria-label="Next"
            >
              ›
            </button>

            {/* Counter */}
            <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 text-center z-50">
              <p className="text-white/70 text-xs sm:text-sm tracking-widest uppercase">
                {lightbox! + 1} / {photos.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}