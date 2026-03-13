// src/components/BrandCard.tsx
"use client";
import Link from "next/link";
import { Brand } from "@/lib/types";
import { isBadTag, goodOnYouColor, goodOnYouEmoji, getScoreColor } from "@/lib/utils";

interface Props {
  brand: Brand;
  index: number;
  onClick: (brand: Brand) => void;
}

export default function BrandCard({ brand, index, onClick }: Props) {
  const delayClass = index < 6 ? `card-delay-${index + 1}` : "";
  const goyColor = goodOnYouColor(brand.goodOnYouRating);
  const notRated = !brand.goodOnYouRating && !brand.campusRatings;
  const hasCampus = brand.campusRatings && brand.campusRatings.total_responses > 0;

  return (
    <div
      className={`animate-fade-up ${delayClass} cursor-pointer`}
      style={{ background: "white", borderRadius: 16, border: "1px solid #e8e4dc", padding: "1.25rem", transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)" }}
      onClick={() => onClick(brand)}
      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-4px)"; el.style.boxShadow = "0 12px 40px rgba(42,42,42,0.15)"; el.style.borderColor = "#a8c5a0"; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = ""; el.style.boxShadow = ""; el.style.borderColor = "#e8e4dc"; }}
    >
      {/* Header row: logo + scores */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center justify-center font-serif font-bold text-xl flex-shrink-0"
          style={{ width: 48, height: 48, borderRadius: 12, background: "#eef4ef", color: "#3d5c42", border: "1px solid #e8e4dc" }}>
          {brand.logoLetter || brand.name.charAt(0)}
        </div>

        {/* Rating badges */}
        <div className="flex items-start gap-2">
          {/* Good On You badge */}
          {brand.goodOnYouRating ? (
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <span style={{ fontSize: "0.85rem" }}>{goodOnYouEmoji(brand.goodOnYouRating)}</span>
                <span className="text-xs font-bold" style={{ color: goyColor }}>{brand.goodOnYouRating}</span>
              </div>
              <div className="text-xs" style={{ color: "#bbb" }}>Good On You</div>
            </div>
          ) : notRated ? (
            <div className="text-right">
              <div className="text-xs font-semibold" style={{ color: "#bbb" }}>Not Rated</div>
            </div>
          ) : null}

          {/* Campus score badge */}
          {hasCampus && (
            <div className="text-right pl-2" style={{ borderLeft: "1px solid #e8e4dc" }}>
              <div className="font-serif font-bold leading-none" style={{ fontSize: "1.2rem", color: getScoreColor(brand.campusRatings!.overall_avg * 2) }}>
                {brand.campusRatings!.overall_avg.toFixed(1)}
              </div>
              <div className="text-xs" style={{ color: "#bbb" }}>Campus/5</div>
            </div>
          )}
        </div>
      </div>

      {/* Brand info */}
      <div className="font-serif font-bold text-base mb-0.5" style={{ color: "#2a2a2a" }}>{brand.name}</div>
      <div className="text-xs mb-2" style={{ color: "#9b9b9b" }}>{brand.category}</div>
      <p className="text-xs leading-relaxed mb-3" style={{ color: "#6b6b6b" }}>
        {brand.description.length > 90 ? brand.description.slice(0, 90) + "…" : brand.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {brand.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-xs font-semibold px-2 py-0.5 rounded-full border"
            style={isBadTag(tag)
              ? { background: "#fff0ec", color: "#b85c3a", borderColor: "rgba(193,123,92,0.2)" }
              : { background: "#eef4ef", color: "#3d5c42", borderColor: "rgba(107,143,113,0.2)" }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2.5" style={{ borderTop: "1px solid #f0ece4" }}>
        <span className="text-xs" style={{ color: "#bbb" }}>{brand.countryFlag} {brand.country}</span>
        <Link href={`/brands/${brand.slug}`}
          className="text-xs font-semibold no-underline" style={{ color: "#3d5c42" }}
          onClick={e => e.stopPropagation()}>
          Details →
        </Link>
      </div>
    </div>
  );
}
