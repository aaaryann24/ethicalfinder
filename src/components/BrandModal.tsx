// src/components/BrandModal.tsx
"use client";
import { Brand } from "@/lib/types";
import { getScoreColor, getScoreLabel, isBadTag, goodOnYouColor, goodOnYouEmoji } from "@/lib/utils";
import { useEffect } from "react";

interface Props {
  brand: Brand | null;
  onClose: () => void;
}

function StarBar({ value, max = 5 }: { value: number; max?: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 rounded-full overflow-hidden" style={{ height: 6, background: "#e8e4dc" }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: value >= 4 ? "#3d7a47" : value >= 3 ? "#b8952a" : "#c17b5c" }}
        />
      </div>
      <span className="text-xs font-semibold w-8 text-right" style={{ color: "#2a2a2a" }}>
        {value.toFixed(1)}
      </span>
    </div>
  );
}

export default function BrandModal({ brand, onClose }: Props) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = brand ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [brand]);

  if (!brand) return null;

  const hasGOY  = brand.goodOnYouRating && brand.goodOnYouScore;
  const hasCampus = brand.campusRatings && brand.campusRatings.total_responses > 0;
  const notRated = !hasGOY && !hasCampus;
  const goyColor = goodOnYouColor(brand.goodOnYouRating);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(30,51,36,0.72)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ background: "white", borderRadius: 24, padding: "2rem" }}
      >
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 flex items-center justify-center"
          style={{ width: 36, height: 36, borderRadius: "50%", background: "#f5f0e8", border: "none", cursor: "pointer", color: "#6b6b6b", fontSize: "1.1rem" }}>
          ✕
        </button>

        {/* Header */}
        <div className="flex gap-4 mb-5 items-start">
          <div className="flex-shrink-0 flex items-center justify-center font-serif font-bold text-3xl"
            style={{ width: 72, height: 72, borderRadius: 16, background: "#eef4ef", color: "#3d5c42", border: "1px solid #e8e4dc" }}>
            {brand.logoLetter}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-serif font-black text-2xl mb-0.5" style={{ color: "#2a2a2a" }}>{brand.name}</h2>
            <p className="text-sm mb-2" style={{ color: "#6b6b6b" }}>{brand.category} · {brand.countryFlag} {brand.country}</p>
            <div className="flex flex-wrap gap-1.5">
              {brand.tags.map((t) => (
                <span key={t} className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                  style={isBadTag(t)
                    ? { background: "#fff0ec", color: "#b85c3a", borderColor: "rgba(193,123,92,0.2)" }
                    : { background: "#eef4ef", color: "#3d5c42", borderColor: "rgba(107,143,113,0.2)" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── DUAL RATING SECTION ── */}
        <div className="grid gap-3 mb-5" style={{ gridTemplateColumns: hasGOY && hasCampus ? "1fr 1fr" : "1fr" }}>

          {/* Good On You Panel */}
          {hasGOY && (
            <div className="rounded-2xl p-4" style={{ background: "#f5f0e8", border: "1px solid #e8e4dc" }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#6b6b6b" }}>Good On You</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "white", color: goyColor, border: `1px solid ${goyColor}` }}>
                  Expert Rating
                </span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span style={{ fontSize: "2rem" }}>{goodOnYouEmoji(brand.goodOnYouRating)}</span>
                <div>
                  <div className="font-serif font-bold text-lg leading-tight" style={{ color: goyColor }}>
                    {brand.goodOnYouRating}
                  </div>
                  <div className="text-xs" style={{ color: "#9b9b9b" }}>
                    Score: {brand.goodOnYouScore}/5
                  </div>
                </div>
              </div>
              {/* Score dots */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="flex-1 rounded-full" style={{
                    height: 6,
                    background: n <= (brand.goodOnYouScore || 0) ? goyColor : "#ddd"
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* Campus Survey Panel */}
          {hasCampus && (
            <div className="rounded-2xl p-4" style={{ background: "#eef4ef", border: "1px solid rgba(107,143,113,0.25)" }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#6b6b6b" }}>Campus Survey</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "white", color: "#3d5c42", border: "1px solid rgba(61,92,66,0.3)" }}>
                  {brand.campusRatings!.total_responses} respondents
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-serif font-bold" style={{ fontSize: "2rem", color: getScoreColor(brand.campusRatings!.overall_avg * 2) }}>
                  {brand.campusRatings!.overall_avg.toFixed(2)}
                </span>
                <span className="text-sm" style={{ color: "#9b9b9b" }}>/5</span>
              </div>
              {/* Sub-scores */}
              {brand.campusRatings!.ethical_avg !== undefined && (
                <div className="space-y-1.5 mt-2">
                  {[
                    { label: "Ethical", val: brand.campusRatings!.ethical_avg! },
                    { label: "Environmental", val: brand.campusRatings!.environmental_avg! },
                    { label: "Animal", val: brand.campusRatings!.animal_avg! },
                    { label: "Transparency", val: brand.campusRatings!.transparency_avg! },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="flex justify-between text-xs mb-0.5" style={{ color: "#6b6b6b" }}>
                        <span>{s.label}</span>
                      </div>
                      <StarBar value={s.val} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Not Rated Panel */}
          {notRated && (
            <div className="rounded-2xl p-4 text-center" style={{ background: "#f9f7f2", border: "1px dashed #e8e4dc" }}>
              <div className="text-2xl mb-2">❓</div>
              <p className="text-sm font-semibold" style={{ color: "#6b6b6b" }}>Not Yet Independently Rated</p>
              <p className="text-xs mt-1" style={{ color: "#aaa" }}>This brand hasn't been assessed by Good On You or included in the campus survey.</p>
            </div>
          )}
        </div>

        {/* ── INSIGHT CALLOUT: GOY vs Campus gap ── */}
        {hasGOY && hasCampus && brand.campusRatings!.ethical_avg !== undefined && (() => {
          const goyNorm = (brand.goodOnYouScore || 0);
          const campusNorm = brand.campusRatings!.overall_avg;
          const gap = campusNorm - goyNorm;
          const significant = Math.abs(gap) > 0.5;
          if (!significant) return null;
          return (
            <div className="rounded-xl px-4 py-3 mb-4 text-sm" style={{ background: gap > 0 ? "#fff8ec" : "#f0f7f0", border: `1px solid ${gap > 0 ? "#f0c040" : "#a8c5a0"}` }}>
              {gap > 0
                ? `📊 Students rated this brand higher than its verified score — campus perception exceeds independently measured ethics (+${gap.toFixed(2)} pts on 5-pt scale).`
                : `📊 Students rated this brand lower than its Good On You score — suggesting campus awareness of its limitations despite public claims (-${Math.abs(gap).toFixed(2)} pts on 5-pt scale).`}
            </div>
          );
        })()}

        {/* Details */}
        <div className="space-y-4 mb-5">
          <div>
            <h3 className="font-serif font-bold text-base mb-1">About</h3>
            <p className="text-sm leading-relaxed" style={{ color: "#6b6b6b" }}>{brand.description}</p>
          </div>
          {brand.keyPractices && (
            <div>
              <h3 className="font-serif font-bold text-base mb-1">Key Practices</h3>
              <p className="text-sm" style={{ color: "#6b6b6b" }}>{brand.keyPractices}</p>
            </div>
          )}
          <div>
            <h3 className="font-serif font-bold text-base mb-1">Certifications</h3>
            <p className="text-sm" style={{ color: "#6b6b6b" }}>{brand.certifications}</p>
          </div>
          {brand.founded > 0 && (
            <div>
              <h3 className="font-serif font-bold text-base mb-1">Founded</h3>
              <p className="text-sm" style={{ color: "#6b6b6b" }}>{brand.founded}</p>
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="flex gap-3">
          <a href={brand.website !== "#" ? brand.website : undefined}
            target="_blank" rel="noopener noreferrer"
            className={`flex-1 text-center py-3 rounded-xl font-semibold text-white text-sm no-underline transition-opacity ${brand.website === "#" ? "opacity-40 cursor-not-allowed pointer-events-none" : "hover:opacity-80"}`}
            style={{ background: "#3d5c42" }}>
            Visit Website →
          </a>
          <a href={`/brands/${brand.slug}`}
            className="flex-1 text-center py-3 rounded-xl font-semibold text-sm no-underline border transition-colors hover:border-sage"
            style={{ borderColor: "#e8e4dc", color: "#2a2a2a" }}>
            Full Profile
          </a>
        </div>
      </div>
    </div>
  );
}
