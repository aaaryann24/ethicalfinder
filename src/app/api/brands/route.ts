// src/app/api/brands/route.ts
// ─────────────────────────────────────────────
// REST API endpoint: GET /api/brands
// Returns all published brands as JSON
// Cached for 5 minutes
// ─────────────────────────────────────────────

import { NextResponse } from "next/server";
import { getBrands } from "@/lib/airtable";

export const revalidate = 300;

export async function GET() {
  try {
    const brands = await getBrands();
    return NextResponse.json(
      { success: true, count: brands.length, data: brands },
      {
        headers: {
          "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}
