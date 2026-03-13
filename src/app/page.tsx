// src/app/page.tsx
// ─────────────────────────────────────────────
// Homepage — Server Component
// Fetches brands from Airtable (or local seed data)
// and passes them to the client-side BrandExplorer
// ─────────────────────────────────────────────

import { getBrands } from "@/lib/airtable";
import BrandExplorer from "@/components/BrandExplorer";

// ISR — rebuild page every 5 minutes
export const revalidate = 300;

export default async function HomePage() {
  const brands = await getBrands();

  return (
    <main>
      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden text-center"
        style={{
          background:
            "linear-gradient(135deg, #3d5c42 0%, #2d4a32 50%, #1e3324 100%)",
          padding: "6rem 1.5rem 5rem",
        }}
      >
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='1'%3E%3Cpath d='M0 0h1v1H0zm20 0h1v1h-1zm0 20h1v1h-1zM0 20h1v1H0z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-6 px-4 py-2 rounded-full border"
            style={{
              color: "#a8c5a0",
              borderColor: "rgba(168,197,160,0.3)",
              background: "rgba(255,255,255,0.08)",
            }}
          >
            🌱 Ethical Fashion Directory
          </div>

          <h1
            className="font-serif text-white mb-5 leading-tight"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 900 }}
          >
            Find Brands That
            <br />
            <em style={{ color: "#a8c5a0", fontStyle: "normal" }}>
              Actually Care
            </em>
          </h1>

          <p
            className="mb-6 mx-auto leading-relaxed"
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: "1.1rem",
              maxWidth: 560,
            }}
          >
            Combining <strong style={{ color: "#a8c5a0" }}>Good On You</strong> expert ratings with
            a <strong style={{ color: "#a8c5a0" }}>campus sustainability survey</strong> — two
            perspectives on every brand, so you can shop with real confidence.
          </p>

          {/* Source badges */}
          <div className="flex justify-center gap-3 mb-8 flex-wrap">
            {[
              { icon: "🌿", label: "Good On You Ratings" },
              { icon: "🎓", label: "27-Person Campus Survey" },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full"
                style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.15)" }}>
                {b.icon} {b.label}
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div
            className="flex justify-center gap-8 pt-6 mt-2 flex-wrap"
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
          >
            {[
              { num: brands.length.toString(), label: "Brands Rated" },
              { num: "2", label: "Rating Sources" },
              { num: "27", label: "Survey Respondents" },
              { num: "17+", label: "Categories" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <span
                  className="font-serif text-white block"
                  style={{ fontSize: "2rem", fontWeight: 700 }}
                >
                  {s.num}
                </span>
                <span
                  className="text-xs tracking-wide"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRAND EXPLORER (client component with search/filter) ── */}
      <BrandExplorer brands={brands} />
    </main>
  );
}
