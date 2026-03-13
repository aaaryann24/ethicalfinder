// src/lib/airtable.ts
// ─────────────────────────────────────────────
// Fetches brand data from Airtable
// Falls back to local JSON if env vars not set
// ─────────────────────────────────────────────

import { Brand } from "./types";
import { slugify } from "./utils";
import brandsData from "../data/brands.json";

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || "Brands";

function mapAirtableRecord(record: {
  id: string;
  fields: Record<string, unknown>;
}): Brand {
  const fields = record.fields;
  const name = (fields["Name"] as string) || "";
  return {
    id: record.id,
    slug: (fields["Slug"] as string) || slugify(name),
    name,
    category: (fields["Category"] as string) || "Uncategorized",
    country: (fields["Country"] as string) || "Unknown",
    countryFlag: (fields["Country_Flag"] as string) || "🌍",
    score: Number(fields["Score"]) || 0,
    labourScore: Number(fields["Labour_Score"]) || 0,
    envScore: Number(fields["Env_Score"]) || 0,
    transparency: Number(fields["Transparency"]) || 0,
    communityScore: Number(fields["Community_Score"]) || 0,
    tags: (fields["Tags"] as string[]) || [],
    description: (fields["Description"] as string) || "",
    website: (fields["Website"] as string) || "#",
    founded: Number(fields["Founded"]) || 0,
    certifications: (fields["Certifications"] as string) || "None listed",
    status: "published",
    logoLetter: name.charAt(0).toUpperCase(),
  };
}

export async function getBrands(): Promise<Brand[]> {
  // If no Airtable config, return local seed data
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.log("⚠️  No Airtable config found — using local seed data");
    return brandsData as Brand[];
  }

  try {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
      AIRTABLE_TABLE_NAME
    )}?filterByFormula=%7BStatus%7D%3D'Published'&sort%5B0%5D%5Bfield%5D=Score&sort%5B0%5D%5Bdirection%5D=desc`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) throw new Error(`Airtable error: ${res.status}`);

    const data = await res.json();
    return data.records.map(mapAirtableRecord);
  } catch (err) {
    console.error("Airtable fetch failed, using seed data:", err);
    return brandsData as Brand[];
  }
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    const brand = (brandsData as Brand[]).find((b) => b.slug === slug);
    return brand || null;
  }

  try {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
      AIRTABLE_TABLE_NAME
    )}?filterByFormula=%7BSlug%7D%3D'${slug}'`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
      next: { revalidate: 300 },
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (!data.records.length) return null;
    return mapAirtableRecord(data.records[0]);
  } catch {
    return null;
  }
}
