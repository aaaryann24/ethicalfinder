// src/components/Navbar.tsx
// ─────────────────────────────────────────────
// Sticky top navigation bar
// ─────────────────────────────────────────────

"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-6"
      style={{
        height: 64,
        background: "rgba(250,248,243,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #e8e4dc",
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 no-underline">
        <span
          className="font-serif font-black text-xl tracking-tight"
          style={{ color: "#3d5c42" }}
        >
          🌿 ETHICAL
          <span style={{ color: "#c17b5c" }}>FINDER</span>
        </span>
      </Link>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-8">
        {[
          { href: "/", label: "Browse Brands" },
          { href: "/submit", label: "Submit a Brand" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium no-underline transition-colors"
            style={{ color: "#6b6b6b" }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/submit"
        className="hidden md:block text-sm font-semibold text-white no-underline px-5 py-2 rounded-full transition-all hover:opacity-80"
        style={{ background: "#3d5c42" }}
      >
        + Submit Brand
      </Link>

      {/* Mobile hamburger */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-2"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
      >
        <span
          className="block w-5 h-0.5 transition-all"
          style={{ background: "#2a2a2a" }}
        />
        <span
          className="block w-5 h-0.5 transition-all"
          style={{ background: "#2a2a2a" }}
        />
        <span
          className="block w-5 h-0.5 transition-all"
          style={{ background: "#2a2a2a" }}
        />
      </button>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div
          className="absolute top-16 left-0 right-0 flex flex-col p-4 gap-3 md:hidden"
          style={{ background: "#faf8f3", borderBottom: "1px solid #e8e4dc" }}
        >
          <Link
            href="/"
            className="text-sm font-medium py-2"
            style={{ color: "#2a2a2a" }}
            onClick={() => setMenuOpen(false)}
          >
            Browse Brands
          </Link>
          <Link
            href="/submit"
            className="text-sm font-medium py-2"
            style={{ color: "#2a2a2a" }}
            onClick={() => setMenuOpen(false)}
          >
            Submit a Brand
          </Link>
        </div>
      )}
    </nav>
  );
}
