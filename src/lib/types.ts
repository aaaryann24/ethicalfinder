// src/lib/types.ts
// ─────────────────────────────────────────────
// All TypeScript types for Ethical Finder
// ─────────────────────────────────────────────

export interface CampusRatings {
  overall_avg: number;
  ethical_avg?: number;
  environmental_avg?: number;
  animal_avg?: number;
  transparency_avg?: number;
  total_responses: number;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  category: string;
  country: string;
  countryFlag: string;
  // Our composite score (0–10 scale)
  score: number;
  labourScore: number;
  envScore: number;
  transparency: number;
  communityScore: number;
  tags: string[];
  description: string;
  website: string;
  founded: number;
  certifications: string;
  status: "published" | "draft";
  logoLetter?: string;
  // Good On You data
  goodOnYouRating?: string;   // "Great" | "Good" | "It's a Start" | "Not Good Enough" | "We Avoid"
  goodOnYouScore?: number;    // 1–5
  // Campus survey data
  campusRatings?: CampusRatings;
  // Key practices summary
  keyPractices?: string;
}

export type ScoreLevel = "excellent" | "good" | "fair" | "poor";

export type GoodOnYouLevel = "Great" | "Good" | "It's a Start" | "Not Good Enough" | "We Avoid";

export type FilterType =
  | "all"
  | "great"
  | "good"
  | "start"
  | "avoid"
  | "sustainable"
  | "fairtrade"
  | "vegan"
  | "campus-fav";

export type SortType = "score-desc" | "score-asc" | "alpha" | "campus-desc" | "goodonyou-desc";
