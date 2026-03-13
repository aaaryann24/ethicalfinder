// src/lib/utils.ts
// ─────────────────────────────────────────────
// Helper functions used across the app
// ─────────────────────────────────────────────

import { Brand, ScoreLevel } from "./types";

// ── Good On You helpers ──────────────────────
export function goodOnYouColor(rating?: string): string {
  switch (rating) {
    case "Great":            return "#3d7a47";
    case "Good":             return "#6b8f71";
    case "It's a Start":     return "#b8952a";
    case "Not Good Enough":  return "#c17b5c";
    case "We Avoid":         return "#a33333";
    default:                 return "#9b9b9b";
  }
}

export function goodOnYouEmoji(rating?: string): string {
  switch (rating) {
    case "Great":            return "🌟";
    case "Good":             return "✅";
    case "It's a Start":     return "🌱";
    case "Not Good Enough":  return "⚠️";
    case "We Avoid":         return "❌";
    default:                 return "❓";
  }
}

export function getScoreLevel(score: number): ScoreLevel {
  if (score >= 8) return "excellent";
  if (score >= 6) return "good";
  if (score >= 4) return "fair";
  return "poor";
}

export function getScoreLabel(score: number): string {
  if (score >= 8) return "Excellent";
  if (score >= 6) return "Good";
  if (score >= 4) return "Fair";
  return "Poor";
}

export function getScoreColor(score: number): string {
  if (score >= 8) return "#3d7a47";
  if (score >= 6) return "#6b8f71";
  if (score >= 4) return "#b8952a";
  return "#c17b5c";
}

export function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export function isBadTag(tag: string): boolean {
  return ["Fast Fashion", "Concerns", "Greenwashing", "Investigated"].includes(
    tag
  );
}

export function filterBrands(
  brands: Brand[],
  filter: string,
  query: string
): Brand[] {
  let list = [...brands];

  // Search filter
  if (query.trim()) {
    const q = query.toLowerCase();
    list = list.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q)) ||
        b.description.toLowerCase().includes(q) ||
        b.country.toLowerCase().includes(q)
    );
  }

  // Score/tag filters
  switch (filter) {
    case "great":
      return list.filter((b) => b.goodOnYouRating === "Great");
    case "good":
      return list.filter((b) => b.goodOnYouRating === "Good");
    case "start":
      return list.filter((b) => b.goodOnYouRating === "It's a Start");
    case "avoid":
      return list.filter((b) =>
        b.goodOnYouRating === "Not Good Enough" || b.goodOnYouRating === "We Avoid"
      );
    case "sustainable":
      return list.filter((b) =>
        b.tags.some((t) =>
          ["Organic", "Recycled", "Sustainable", "Carbon Neutral", "Circular"].includes(t)
        )
      );
    case "fairtrade":
      return list.filter((b) =>
        b.tags.some((t) => t.toLowerCase().includes("fair")) ||
        (b.certifications || "").toLowerCase().includes("fair")
      );
    case "vegan":
      return list.filter((b) =>
        b.tags.some((t) => t.toLowerCase().includes("vegan")) ||
        (b.certifications || "").toLowerCase().includes("vegan")
      );
    case "campus-fav":
      return list.filter((b) => b.campusRatings && b.campusRatings.overall_avg >= 4.0);
    case "local":
      return list.filter((b) =>
        b.tags.some((t) => ["B Corp", "Small", "Artisan"].includes(t))
      );
    default:
      return list;
  }
}
