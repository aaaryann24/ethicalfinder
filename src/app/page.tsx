// src/app/page.tsx
import { getBrands } from "@/lib/airtable";
import BrandExplorer from "@/components/BrandExplorer";

export const revalidate = 300;

export default async function HomePage() {
  const brands = await getBrands();

  return (
    <main>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden text-center"
        style={{ background: "linear-gradient(135deg, #3d5c42 0%, #2d4a32 50%, #1e3324 100%)", padding: "clamp(3rem, 8vw, 6rem) 1.25rem clamp(2.5rem, 6vw, 5rem)" }}>

        {/* Subtle dot texture */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white'%3E%3Cpath d='M0 0h1v1H0zm20 0h1v1h-1zm0 20h1v1h-1zM0 20h1v1H0z'/%3E%3C/g%3E%3C/svg%3E")` }} />

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-5 px-4 py-2 rounded-full border"
            style={{ color: "#a8c5a0", borderColor: "rgba(168,197,160,0.3)", background: "rgba(255,255,255,0.08)" }}>
            🌱 Ethical Fashion Directory
          </div>

          {/* Headline */}
          <h1 className="font-serif text-white mb-4 leading-tight"
            style={{ fontSize: "clamp(2rem, 7vw, 4.5rem)", fontWeight: 900, letterSpacing: "-0.02em" }}>
            Find Brands That<br />
            <em style={{ color: "#a8c5a0", fontStyle: "normal" }}>Actually Care</em>
          </h1>

          {/* Sub */}
          <p className="mb-5 mx-auto leading-relaxed"
            style={{ color: "rgba(255,255,255,0.65)", fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)", maxWidth: 500 }}>
            Combining <strong style={{ color: "#a8c5a0" }}>Good On You</strong> expert ratings with
            a <strong style={{ color: "#a8c5a0" }}>campus sustainability survey</strong> — two
            perspectives on every brand.
          </p>

          {/* Source badges */}
          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            {[
              { icon: "🌿", label: "Good On You Ratings" },
              { icon: "🎓", label: "27-Person Campus Survey" },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.15)" }}>
                {b.icon} {b.label}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5"
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            {[
              { num: brands.length.toString(), label: "Brands Rated" },
              { num: "2",                      label: "Rating Sources" },
              { num: "27",                     label: "Respondents" },
              { num: "17+",                    label: "Categories" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <span className="font-serif text-white block font-bold" style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)" }}>{s.num}</span>
                <span className="text-xs tracking-wide" style={{ color: "rgba(255,255,255,0.45)" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BrandExplorer brands={brands} />
    </main>
  );
}