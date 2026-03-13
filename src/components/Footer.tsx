// src/components/Footer.tsx

import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="text-center py-12 px-6 mt-16"
      style={{ background: "#2a2a2a", color: "rgba(255,255,255,0.55)" }}
    >
      <div
        className="font-serif font-black text-2xl mb-3"
        style={{ color: "white" }}
      >
        🌿 ETHICAL<span style={{ color: "#a8c5a0" }}>FINDER</span>
      </div>
      <p className="text-sm leading-relaxed mb-6 max-w-sm mx-auto">
        A community-driven directory helping conscious consumers find fashion
        brands that align with their values.
      </p>
      <div className="flex justify-center gap-6 mb-6 flex-wrap">
        {[
          { href: "/", label: "Browse Brands" },
          { href: "/submit", label: "Submit a Brand" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="text-sm transition-colors hover:text-white"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            {l.label}
          </Link>
        ))}
      </div>
      <div
        className="text-xs pt-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
      >
        © {new Date().getFullYear()} EthicalFinder. Made with 🌿 for conscious
        consumers everywhere.
      </div>
    </footer>
  );
}
