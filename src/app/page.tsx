"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const FEATURED = [
  { src: "/gallery/1.jpg", caption: "Live performance — Accra" },
  { src: "/gallery/2.jpg", caption: "Editorial — Red Room" },
  { src: "/gallery/3.jpg", caption: "Studio portrait — Osu" },
  { src: "/gallery/4.jpg", caption: "Fashion story — Labadi" },
  { src: "/gallery/5.jpg", caption: "Matriculation — Kumasi" },
  { src: "/gallery/23.jpg", caption: "Editorial — Blue" },
];

const SERVICES = [
  { title: "Weddings", desc: "Full-day coverage, from preparation to the last dance." },
  { title: "Matriculation", desc: "The gown, the campus, and the pride of a milestone reached." },
  { title: "Birthdays", desc: "The people, the laughter, the moments in between." },
  { title: "Portraits", desc: "Editorial portraiture for individuals and families." },
];

const PROCESS = [
  { step: "01", title: "Inquire", desc: "Tell us about your day — date, place, and the feeling you want to remember." },
  { step: "02", title: "Consult", desc: "We talk through the schedule, the light, and what matters most to you." },
  { step: "03", title: "The day", desc: "We photograph quietly, without directing, letting the day unfold." },
  { step: "04", title: "Gallery", desc: "Edited images delivered within three weeks, in a private online gallery." },
];

const STATS = [
  { value: "140+", label: "Events photographed" },
  { value: "3 yrs", label: "Behind the camera" },
  { value: "18 days", label: "Average gallery delivery" },
  { value: "8", label: "Cities across Ghana" },
];

const VALUES = [
  {
    title: "Unposed",
    desc: "We don't direct. We wait, watch, and photograph what actually happens — the glance between vows, the child asleep in a chair, the moment after the toast.",
  },
  {
    title: "Quiet",
    desc: "You will barely notice us. That's the point. The best photographs happen when people forget they're being photographed.",
  },
  {
    title: "Personal",
    desc: "Every event is different. A wedding in Accra is not a wedding in Aburi. We adapt to the light, the people, the rhythm of the day.",
  },
];

const TESTIMONIALS = [
  {
    quote: "They disappeared into the day. What came back was not a performance — it was us, on our best day, exactly as we remember it.",
    author: "Ama & Kwesi",
    context: "Wedding, Accra",
  },
  {
    quote: "They made my matriculation feel like a movie. Every photo captures the pride my parents felt that day.",
    author: "Efua",
    context: "Matriculation, KNUST",
  },
  {
    quote: "I cried when I saw the gallery. Not because it was beautiful — because it was true.",
    author: "Akosua",
    context: "30th birthday, Labadi",
  },
];

const FAQS = [
  {
    q: "How far in advance should I book?",
    a: "For weddings and matriculations, 3–6 months is ideal. For birthdays and portrait sessions, we can often accommodate 2–4 weeks notice. If you're unsure, send an inquiry — we'll tell you honestly.",
  },
  {
    q: "Do you travel outside Accra?",
    a: "Yes. We photograph across Ghana and occasionally beyond. Travel within Greater Accra is included; further destinations are quoted individually.",
  },
  {
    q: "How many photographs will we receive?",
    a: "A full-day wedding typically yields 400–600 edited images. A portrait or matriculation session, 40–80. Everything is edited, nothing is left unprocessed.",
  },
  {
    q: "What is the booking process?",
    a: "Send an inquiry through the site. We'll respond within 24 hours to schedule a call. Once we confirm the date and details, a deposit secures your booking.",
  },
  {
    q: "How long until we see our photographs?",
    a: "Three weeks on average. A small preview gallery is shared within 72 hours of the event.",
  },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-line", {
        y: 60, opacity: 0, duration: 1.2, stagger: 0.15, ease: "power3.out",
      });
      gsap.to(imgRef.current, {
        yPercent: 15, ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  // Hidden admin: type "admin" anywhere
  useEffect(() => {
    let buffer = "";
    const handler = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-5);
      if (buffer === "admin") window.location.href = "/admin";
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <main>
      {/* HERO - SPLIT LAYOUT */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center pt-24 pb-12 overflow-hidden bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16 w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* LEFT: TEXT */}
          <div className="z-10 order-2 lg:order-1 text-center lg:text-left mt-6 lg:mt-0">
            <p className="hero-line text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-neutral-500 mb-4 sm:mb-6">
              Wedding · Matriculation · Birthday · Portrait
            </p>
            <p className="hero-line text-sm md:text-base font-serif italic text-neutral-500 mb-2 sm:mb-3">
              Gu Mi Nfoniii
            </p>
            <h1 className="hero-line font-serif text-4xl sm:text-5xl md:text-7xl leading-[1.1] md:leading-[1.05] text-neutral-900">
              Moments that <br className="hidden sm:block" /> stay with you.
            </h1>
            <p className="hero-line mt-4 sm:mt-6 max-w-md mx-auto lg:mx-0 text-neutral-600 text-base sm:text-lg">
              Cinematic photography for life&apos;s most important days — by Klik Haus.
            </p>

            <div className="hero-line mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link href="/packages" className="bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded hover:bg-neutral-800 transition-colors text-center">
                View packages
              </Link>
              <Link href="/book" className="border border-neutral-300 text-neutral-900 px-6 sm:px-8 py-3 sm:py-4 rounded hover:border-black transition-colors text-center">
                Book a session
              </Link>
            </div>
          </div>

          {/* RIGHT: IMAGE (The Woman) */}
          <div className="order-1 lg:order-2 relative w-full h-[45vh] sm:h-[55vh] md:h-[60vh] lg:h-[80vh] rounded-lg overflow-hidden shadow-2xl">
            <div ref={imgRef} className="absolute inset-0 scale-110">
              <Image
                src="/hero.jpg"
                alt="Matriculation portrait"
                fill
                priority
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

        </div>
      </section>

      {/* PULL QUOTE */}
      <section className="max-w-3xl mx-auto px-6 py-16 sm:py-20 text-center">
        <p className="font-serif italic text-xl sm:text-2xl md:text-3xl text-neutral-700 leading-snug">
          &ldquo;They disappeared into the day. What came back was not a performance — it was us, on our best day.&rdquo;
        </p>
        <p className="mt-6 text-xs uppercase tracking-[0.3em] text-neutral-500">
          — Ama &amp; Kwesi, Wedding
        </p>
      </section>

      {/* INTRO */}
      <section className="max-w-3xl mx-auto px-6 py-12 sm:py-20 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-6">The approach</p>
        <h2 className="font-serif text-3xl md:text-5xl leading-tight">
          Quiet, observational, unposed. <br />
          We photograph the day as it happens.
        </h2>
      </section>

      {/* STATS STRIP */}
      <section className="border-y border-neutral-200 py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-serif text-3xl sm:text-4xl md:text-5xl">{s.value}</p>
              <p className="text-[10px] sm:text-xs uppercase tracking-widest text-neutral-500 mt-2">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-[10px] uppercase tracking-widest text-neutral-400 mt-8">
          Every number is real. No vanity metrics.
        </p>
      </section>

      {/* FEATURED GALLERY */}
      <section className="px-4 sm:px-6 py-20 sm:py-32 max-w-7xl mx-auto">
        <div className="flex justify-between items-baseline mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Selected work</p>
          <Link href="/gallery" className="text-sm underline">View all →</Link>
        </div>
        <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
          {FEATURED.map((photo, i) => (
            <motion.div
              key={photo.src}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[4/5] overflow-hidden rounded group bg-neutral-100"
            >
              <Image
                src={photo.src}
                alt={photo.caption}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm">{photo.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BEHIND THE CAMERA */}
      <section className="py-20 sm:py-32 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded bg-neutral-100">
            <Image
              src="/klik-haus.jpg"
              alt="Klik Haus"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-4">Behind the camera</p>
            <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-6">
              Most of the work is waiting for the right moment.
            </h2>
            <p className="text-neutral-600 leading-relaxed">
              I started Klik Haus because I wanted to be the person who noticed
              what everyone else missed. Hundreds of ceremonies later, I still watch
              more than I shoot. If I do my job well, you&apos;ll forget I&apos;m there —
              and the photographs will feel like the day itself.
            </p>
            <p className="mt-6 text-sm uppercase tracking-widest text-neutral-500">
              — Klik Haus
            </p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-neutral-50 py-20 sm:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-6">What we believe</p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl mb-12 sm:mb-16 max-w-2xl">
            Three things we never compromise on.
          </h2>
          <div className="grid gap-10 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <p className="text-xs uppercase tracking-widest text-neutral-400 mb-3">0{i + 1}</p>
                <h3 className="font-serif text-2xl mb-3">{v.title}</h3>
                <p className="text-neutral-600 leading-relaxed text-sm sm:text-base">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 sm:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-6">What we cover</p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl mb-12 sm:mb-16 max-w-2xl">
            Every kind of day that deserves to be remembered.
          </h2>
          <div className="grid gap-x-12 gap-y-8 sm:gap-y-10 md:grid-cols-2">
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="border-t border-neutral-300 pt-6"
              >
                <h3 className="font-serif text-xl sm:text-2xl mb-2">{s.title}</h3>
                <p className="text-neutral-600 text-sm sm:text-base">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-black text-white py-20 sm:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] mb-12 opacity-60">In their words</p>
          <div className="space-y-12 sm:space-y-16">
            {TESTIMONIALS.map((t, i) => (
              <motion.blockquote
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="max-w-3xl"
              >
                <p className="font-serif text-xl sm:text-2xl md:text-3xl leading-snug">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="mt-4 sm:mt-6 text-xs sm:text-sm uppercase tracking-widest text-white/50">
                  — {t.author}, {t.context}
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-20 sm:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-6">How it works</p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl mb-12 sm:mb-16 max-w-xl">
            From first message to final gallery.
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((p) => (
              <div key={p.step}>
                <p className="font-serif text-4xl sm:text-5xl mb-3 sm:mb-4 text-neutral-200">{p.step}</p>
                <h3 className="font-serif text-lg sm:text-xl mb-2 sm:mb-3">{p.title}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-neutral-50 py-20 sm:py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-6">Questions</p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl mb-12 sm:mb-16">
            What people usually ask.
          </h2>
          <div className="space-y-0 divide-y divide-neutral-200 border-y border-neutral-200">
            {FAQS.map((f, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center text-left py-5 sm:py-6 group"
                >
                  <span className="font-serif text-lg sm:text-xl pr-6 group-hover:text-neutral-600">
                    {f.q}
                  </span>
                  <span className="text-xl sm:text-2xl text-neutral-400 shrink-0">
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openFaq === i ? "auto" : 0,
                    opacity: openFaq === i ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="pb-5 sm:pb-6 text-neutral-600 text-sm sm:text-base leading-relaxed pr-4 sm:pr-12">{f.a}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 sm:py-40 px-6 text-center max-w-3xl mx-auto">
        <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl leading-tight">
          Let&apos;s photograph something that matters.
        </h2>
        <p className="mt-4 sm:mt-6 text-neutral-500 max-w-md mx-auto text-sm sm:text-base">
          Tell us about your day. We respond to every inquiry within 24 hours.
        </p>
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link href="/book" className="bg-black text-white px-8 py-3 rounded hover:bg-neutral-800">
            Start an inquiry
          </Link>
          <Link href="/packages" className="border border-neutral-300 px-8 py-3 rounded hover:border-black">
            View packages
          </Link>
        </div>
      </section>

      {/* FOOTER */} 
      <footer className="border-t border-neutral-200 py-12 sm:py-16 px-6">
        <div className="max-w-5xl mx-auto grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-serif text-2xl mb-3">Klik Haus</p>
            <p className="text-sm text-neutral-500 leading-relaxed">
              <span className="italic block mb-2 text-neutral-800">Gu Mi Nfoniii</span>
              Cinematic photography for weddings, matriculations, birthdays, and portraits.
              Based in Accra, travelling across Ghana.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-500 mb-4">Explore</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/gallery" className="hover:underline">Gallery</Link></li>
              <li><Link href="/packages" className="hover:underline">Packages</Link></li>
              <li><Link href="/book" className="hover:underline">Book a session</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-500 mb-4">Contact</p>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:reginaldzokottoh@gmail.com" className="hover:underline">reginaldzokottoh@gmail.com</a></li>
              <li className="text-neutral-500">Accra, Ghana</li>
            </ul>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-neutral-100 flex flex-col sm:flex-row sm:justify-between gap-4 text-xs text-neutral-400">
          <span>© 2026 Klik Haus. All rights reserved.</span>
          <span>Built by FADI Technologies</span>
        </div>
      </footer>
    </main>
  );
}