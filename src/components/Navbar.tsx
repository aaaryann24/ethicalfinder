// src/components/Navbar.tsx
"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6"
        style={{ height: 56, background: "rgba(250,248,243,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #e8e4dc" }}>

        <Link href="/" className="flex items-center gap-1.5 no-underline">
          <span className="font-serif font-black text-lg tracking-tight" style={{ color: "#3d5c42" }}>
            🌿 ETHICAL<span style={{ color: "#c17b5c" }}>FINDER</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium no-underline" style={{ color: "#6b6b6b" }}>Browse</Link>
          <Link href="/submit" className="text-sm font-medium no-underline" style={{ color: "#6b6b6b" }}>Submit a Brand</Link>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/submit"
            className="hidden md:block text-sm font-semibold text-white no-underline px-4 py-1.5 rounded-full"
            style={{ background: "#3d5c42" }}>
            + Submit
          </Link>
          {/* Hamburger */}
          <button className="md:hidden flex flex-col justify-center gap-1.5 p-2 -mr-1"
            onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span className="block h-0.5 rounded transition-all"
              style={{ width: 22, background: "#2a2a2a", transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "" }} />
            <span className="block h-0.5 rounded transition-all"
              style={{ width: 22, background: "#2a2a2a", opacity: menuOpen ? 0 : 1 }} />
            <span className="block h-0.5 rounded transition-all"
              style={{ width: 22, background: "#2a2a2a", transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "" }} />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-x-0 top-14 z-40 flex flex-col p-4 gap-1 shadow-lg"
          style={{ background: "#faf8f3", borderBottom: "1px solid #e8e4dc" }}>
          <Link href="/" className="text-base font-semibold py-3 px-3 rounded-xl no-underline"
            style={{ color: "#2a2a2a" }} onClick={() => setMenuOpen(false)}>
            🌿 Browse Brands
          </Link>
          <Link href="/submit" className="text-base font-semibold py-3 px-3 rounded-xl no-underline"
            style={{ color: "#2a2a2a" }} onClick={() => setMenuOpen(false)}>
            ✉️ Submit a Brand
          </Link>
        </div>
      )}
    </>
  );
}