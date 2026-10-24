import Link from "next/link";

export default function Nav() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur bg-white/70 border-b border-neutral-200">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl tracking-tight">Klik Haus</Link>
        <div className="flex gap-3 sm:gap-6 text-xs sm:text-sm">
          <Link href="/gallery" className="hover:opacity-60">Gallery</Link>
          <Link href="/packages" className="hover:opacity-60">Packages</Link>
          <Link href="/book" className="hover:opacity-60">Book</Link>
          <Link href="/contact" className="hover:opacity-60">Contact</Link>
         
        </div>
      </div>
    </nav>
  );
}