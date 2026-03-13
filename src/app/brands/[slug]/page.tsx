// src/app/brands/[slug]/page.tsx
// ─────────────────────────────────────────────
// Individual brand page — good for SEO
// e.g. /brands/patagonia
// ─────────────────────────────────────────────

import { getBrands, getBrandBySlug } from "@/lib/airtable";
import { notFound } from "next/navigation";
import { getScoreLabel, getScoreColor, isBadTag } from "@/lib/utils";
import type { Metadata } from "next";

export const revalidate = 300;

// Pre-generate all brand pages at build time
export async function generateStaticParams() {
  const brands = await getBrands();
  return brands.map((b) => ({ slug: b.slug }));
}

// Dynamic SEO metadata per brand
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const brand = await getBrandBySlug(params.slug);
  if (!brand) return { title: "Brand Not Found | Ethical Finder" };
  return {
    title: `${brand.name} Ethics Score & Review | Ethical Finder`,
    description: `${brand.name} scored ${brand.score}/10 for ethics. ${brand.description.slice(0, 150)}…`,
  };
}

export default async function BrandPage({
  params,
}: {
  params: { slug: string };
}) {
  const brand = await getBrandBySlug(params.slug);
  if (!brand) notFound();

  const scoreColor = getScoreColor(brand.score);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Back link */}
      <a
        href="/"
        className="inline-flex items-center gap-2 text-sm mb-8"
        style={{ color: "#6b8f71" }}
      >
        ← Back to all brands
      </a>

      {/* Header */}
      <div className="flex gap-6 mb-8 items-start">
        <div
          className="flex-shrink-0 flex items-center justify-center font-serif font-bold text-3xl rounded-2xl"
          style={{
            width: 80,
            height: 80,
            background: "#eef4ef",
            color: "#3d5c42",
            border: "1px solid #e8e4dc",
          }}
        >
          {brand.logoLetter}
        </div>
        <div>
          <h1 className="font-serif text-4xl font-black mb-1">{brand.name}</h1>
          <p style={{ color: "#6b6b6b" }}>
            {brand.category} · {brand.countryFlag} {brand.country}
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {brand.tags.map((t) => (
              <span
                key={t}
                className="text-xs font-semibold px-3 py-1 rounded-full border"
                style={
                  isBadTag(t)
                    ? {
                        background: "#fff0ec",
                        color: "#b85c3a",
                        borderColor: "rgba(193,123,92,0.2)",
                      }
                    : {
                        background: "#eef4ef",
                        color: "#3d5c42",
                        borderColor: "rgba(107,143,113,0.2)",
                      }
                }
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Score breakdown */}
      <div
        className="grid grid-cols-4 gap-4 rounded-2xl p-6 mb-8"
        style={{ background: "#f5f0e8" }}
      >
        {[
          { label: "Overall", val: brand.score },
          { label: "Labour", val: brand.labourScore },
          { label: "Environment", val: brand.envScore },
          { label: "Transparency", val: brand.transparency },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <span
              className="font-serif text-3xl font-bold block"
              style={{ color: getScoreColor(s.val) }}
            >
              {s.val}
            </span>
            <span
              className="text-xs uppercase tracking-wider"
              style={{ color: "#6b6b6b" }}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Details */}
      <div className="space-y-6">
        <div>
          <h2 className="font-serif text-xl font-bold mb-2">About</h2>
          <p style={{ color: "#6b6b6b", lineHeight: 1.7 }}>
            {brand.description}
          </p>
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold mb-2">Certifications</h2>
          <p style={{ color: "#6b6b6b" }}>{brand.certifications}</p>
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold mb-2">Founded</h2>
          <p style={{ color: "#6b6b6b" }}>{brand.founded}</p>
        </div>
      </div>

      {/* CTA */}
      <div className="flex gap-4 mt-10">
        <a
          href={brand.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center py-3 rounded-xl font-semibold text-white transition-all"
          style={{ background: "#3d5c42" }}
        >
          Visit Website →
        </a>
        <a
          href="/"
          className="flex-1 text-center py-3 rounded-xl font-semibold border transition-all"
          style={{ borderColor: "#e8e4dc", color: "#2a2a2a" }}
        >
          ← All Brands
        </a>
      </div>

      {/* Score rating label */}
      <p
        className="text-center mt-4 text-sm"
        style={{ color: scoreColor, fontWeight: 600 }}
      >
        {getScoreLabel(brand.score)} Ethics Rating
      </p>
    </div>
  );
}
