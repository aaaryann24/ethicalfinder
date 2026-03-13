// src/components/BrandExplorer.tsx
"use client";
import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import { Brand, FilterType, SortType } from "@/lib/types";
import { filterBrands, goodOnYouColor, goodOnYouEmoji, getScoreColor } from "@/lib/utils";
import BrandCard from "./BrandCard";
import BrandModal from "./BrandModal";
import Link from "next/link";

interface Props { brands: Brand[]; }

const FILTER_PILLS: { label: string; value: FilterType; tip?: string }[] = [
  { label: "All",               value: "all" },
  { label: "🌟 Great",          value: "great" },
  { label: "✅ Good",           value: "good" },
  { label: "🌱 Starting",       value: "start" },
  { label: "⚠️ Avoid",         value: "avoid" },
  { label: "🎓 Campus",         value: "campus-fav" },
  { label: "♻️ Sustainable",    value: "sustainable" },
  { label: "🤝 Fair Trade",     value: "fairtrade" },
  { label: "🌱 Vegan",          value: "vegan" },
];

const CATEGORIES = [
  "Outdoor","Sportswear","Activewear","Fast Fashion","Basics","Denim",
  "Footwear","Accessories","Swimwear","Lingerie","Womenswear","Childrenswear",
  "Circular Fashion","Jewelry","Handcrafted","Essentials","Loungewear",
];

function CampusInsights({ brands }: { brands: Brand[] }) {
  const withCampus = brands.filter(b => b.campusRatings && b.campusRatings.total_responses >= 5);
  if (!withCampus.length) return null;
  const top = [...withCampus].sort((a, b) => b.campusRatings!.overall_avg - a.campusRatings!.overall_avg)[0];
  const lowest = [...withCampus].sort((a, b) => a.campusRatings!.overall_avg - b.campusRatings!.overall_avg)[0];
  const totalRespondents = Math.max(...withCampus.map(b => b.campusRatings!.total_responses));
  return (
    <div className="rounded-2xl p-4" style={{ background: "#eef4ef", border: "1px solid rgba(107,143,113,0.25)" }}>
      <h3 className="font-serif font-bold text-sm mb-3">🎓 Campus Survey</h3>
      <p className="text-xs mb-3" style={{ color: "#6b6b6b" }}>{totalRespondents} respondents · {withCampus.length} brands</p>
      <div className="space-y-2">
        <div className="text-xs" style={{ color: "#6b6b6b" }}>
          <span className="font-semibold" style={{ color: "#3d5c42" }}>Highest: </span>
          {top.name} — {top.campusRatings!.overall_avg.toFixed(2)}/5
        </div>
        <div className="text-xs" style={{ color: "#6b6b6b" }}>
          <span className="font-semibold" style={{ color: "#c17b5c" }}>Lowest: </span>
          {lowest.name} — {lowest.campusRatings!.overall_avg.toFixed(2)}/5
        </div>
      </div>
    </div>
  );
}

export default function BrandExplorer({ brands }: Props) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("goodonyou-desc");
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fuse = useMemo(() => new Fuse(brands, {
    keys: ["name", "category", "tags", "description", "country", "goodOnYouRating", "keyPractices"],
    threshold: 0.3,
  }), [brands]);

  const displayBrands = useMemo(() => {
    let list = query.trim() ? fuse.search(query).map(r => r.item) : [...brands];
    list = filterBrands(list, activeFilter, "");
    if (selectedCategories.length > 0) {
      list = list.filter(b => selectedCategories.includes(b.category));
    }
    switch (sortBy) {
      case "goodonyou-desc": list.sort((a, b) => (b.goodOnYouScore || 0) - (a.goodOnYouScore || 0)); break;
      case "campus-desc":    list.sort((a, b) => (b.campusRatings?.overall_avg || 0) - (a.campusRatings?.overall_avg || 0)); break;
      case "score-desc":     list.sort((a, b) => b.score - a.score); break;
      case "score-asc":      list.sort((a, b) => a.score - b.score); break;
      case "alpha":          list.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return list;
  }, [brands, query, activeFilter, sortBy, selectedCategories, fuse]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const counts = useMemo(() => ({
    great:   brands.filter(b => b.goodOnYouRating === "Great").length,
    good:    brands.filter(b => b.goodOnYouRating === "Good").length,
    start:   brands.filter(b => b.goodOnYouRating === "It's a Start").length,
    avoid:   brands.filter(b => b.goodOnYouRating === "Not Good Enough" || b.goodOnYouRating === "We Avoid").length,
    unrated: brands.filter(b => !b.goodOnYouRating).length,
  }), [brands]);

  const SidebarContent = () => (
    <div className="flex flex-col gap-4">
      {/* Good On You breakdown */}
      <div className="rounded-2xl p-4" style={{ background: "white", border: "1px solid #e8e4dc" }}>
        <h3 className="font-serif font-bold text-sm mb-3">Good On You Rating</h3>
        {[
          { label: "🌟 Great",        count: counts.great,   color: goodOnYouColor("Great"),           filter: "great" as FilterType },
          { label: "✅ Good",         count: counts.good,    color: goodOnYouColor("Good"),            filter: "good" as FilterType },
          { label: "🌱 It's a Start", count: counts.start,   color: goodOnYouColor("It's a Start"),    filter: "start" as FilterType },
          { label: "⚠️ Avoid",       count: counts.avoid,   color: goodOnYouColor("Not Good Enough"), filter: "avoid" as FilterType },
          { label: "❓ Not Assessed", count: counts.unrated, color: "#9b9b9b",                         filter: "all" as FilterType },
        ].map(row => (
          <div key={row.label}
            className="flex items-center justify-between py-2 cursor-pointer rounded-lg px-2 transition-colors"
            style={{ cursor: "pointer" }}
            onClick={() => { setActiveFilter(row.filter); setSidebarOpen(false); }}>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: row.color }} />
              <span className="text-sm" style={{ color: "#2a2a2a" }}>{row.label}</span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "#f5f0e8", color: "#6b6b6b" }}>{row.count}</span>
          </div>
        ))}
      </div>

      <CampusInsights brands={brands} />

      {/* Category filter */}
      <div className="rounded-2xl p-4" style={{ background: "white", border: "1px solid #e8e4dc" }}>
        <h3 className="font-serif font-bold text-sm mb-3">Category</h3>
        <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto">
          {CATEGORIES.map(cat => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer text-sm py-0.5" style={{ color: "#2a2a2a" }}>
              <input type="checkbox" checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                style={{ accentColor: "#3d5c42" }} />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-2xl p-4" style={{ background: "#f5f0e8", border: "1px solid #e8e4dc" }}>
        <h3 className="font-serif font-bold text-sm mb-2">Know a missing brand?</h3>
        <p className="text-xs mb-3" style={{ color: "#6b6b6b" }}>Help us grow the directory.</p>
        <Link href="/submit"
          className="block text-center text-xs font-bold text-white py-2 rounded-xl no-underline"
          style={{ background: "#c17b5c" }}
          onClick={() => setSidebarOpen(false)}>
          Submit a Brand →
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* ── SEARCH + FILTER BAR ── */}
      <div style={{ background: "white", borderBottom: "1px solid #e8e4dc" }}>

        {/* Search row */}
        <div className="flex items-center gap-2 px-4 pt-3 pb-2">
          <input
            type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="🔍  Search brands…"
            className="flex-1 text-sm outline-none border rounded-full px-4 py-2"
            style={{ borderColor: "#e8e4dc", background: "#faf8f3", color: "#2a2a2a", minWidth: 0 }}
          />
          {/* Mobile filter button */}
          <button
            className="lg:hidden flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-full border flex-shrink-0"
            style={{ borderColor: "#e8e4dc", color: "#2a2a2a", background: "white", cursor: "pointer" }}
            onClick={() => setSidebarOpen(true)}
          >
            ⚙️ Filter
            {(activeFilter !== "all" || selectedCategories.length > 0) && (
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#c17b5c" }} />
            )}
          </button>
        </div>

        {/* Filter pills — horizontally scrollable */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {FILTER_PILLS.map(pill => (
            <button key={pill.value}
              onClick={() => setActiveFilter(pill.value)}
              className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all"
              style={activeFilter === pill.value
                ? { background: "#3d5c42", borderColor: "#3d5c42", color: "white", cursor: "pointer" }
                : { background: "transparent", borderColor: "#e8e4dc", color: "#2a2a2a", cursor: "pointer" }}>
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── MOBILE SIDEBAR DRAWER ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setSidebarOpen(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-80 overflow-y-auto p-4"
            style={{ background: "#faf8f3" }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif font-bold text-lg">Filters</h2>
              <button onClick={() => setSidebarOpen(false)}
                style={{ background: "#e8e4dc", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: "1rem" }}>
                ✕
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* ── MAIN LAYOUT ── */}
      <div className="max-w-screen-xl mx-auto px-4 py-6 lg:py-8"
        style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "2rem" }}>

        {/* Desktop sidebar — hidden on mobile */}
        <aside className="hidden lg:flex flex-col gap-4">
          <SidebarContent />
        </aside>

        {/* Grid */}
        <main>
          {/* Results header */}
          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <p className="text-sm" style={{ color: "#6b6b6b" }}>
              <strong style={{ color: "#2a2a2a" }}>{displayBrands.length}</strong> of {brands.length} brands
              {query && <span> for &ldquo;<strong style={{ color: "#3d5c42" }}>{query}</strong>&rdquo;</span>}
            </p>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as SortType)}
              className="text-sm border rounded-lg px-3 py-1.5"
              style={{ borderColor: "#e8e4dc", background: "white", color: "#2a2a2a" }}>
              <option value="goodonyou-desc">Good On You ↓</option>
              <option value="campus-desc">Campus Score ↓</option>
              <option value="score-desc">Score ↓</option>
              <option value="score-asc">Score ↑</option>
              <option value="alpha">A–Z</option>
            </select>
          </div>

          {/* Data source legend */}
          <div className="flex gap-3 mb-4 flex-wrap">
            {[
              { dot: "#3d7a47", label: "Good On You" },
              { dot: "#6b8f71", label: "Campus Survey" },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-1.5 text-xs" style={{ color: "#9b9b9b" }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.dot }} />
                {s.label}
              </div>
            ))}
          </div>

          {/* Brand cards grid */}
          {displayBrands.length === 0 ? (
            <div className="text-center py-16" style={{ color: "#9b9b9b" }}>
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-serif text-xl font-bold mb-2" style={{ color: "#2a2a2a" }}>No brands found</h3>
              <p className="text-sm">Try a different search or clear the filters.</p>
              <button onClick={() => { setQuery(""); setActiveFilter("all"); setSelectedCategories([]); }}
                className="mt-4 text-sm font-semibold px-4 py-2 rounded-full border"
                style={{ borderColor: "#3d5c42", color: "#3d5c42", background: "transparent", cursor: "pointer" }}>
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-3"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 270px), 1fr))" }}>
              {displayBrands.map((brand, idx) => (
                <BrandCard key={brand.id} brand={brand} index={idx} onClick={setSelectedBrand} />
              ))}
            </div>
          )}

          {/* Submit banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8 rounded-2xl p-5"
            style={{ background: "#f5f0e8", border: "1px solid #e8e4dc" }}>
            <div>
              <h3 className="font-serif font-bold text-base mb-1">Know a brand we&apos;re missing?</h3>
              <p className="text-sm" style={{ color: "#6b6b6b" }}>Help build the most complete ethical fashion directory.</p>
            </div>
            <Link href="/submit"
              className="flex-shrink-0 text-sm font-bold text-white px-5 py-2.5 rounded-full no-underline"
              style={{ background: "#c17b5c" }}>
              Submit Brand →
            </Link>
          </div>
        </main>
      </div>

      <BrandModal brand={selectedBrand} onClose={() => setSelectedBrand(null)} />
    </>
  );
}