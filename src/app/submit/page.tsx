// src/app/submit/page.tsx
// ─────────────────────────────────────────────
// Submit a Brand page
// Points to your Google Form or Tally.so form
// ─────────────────────────────────────────────

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit a Brand | Ethical Finder",
  description: "Know an ethical brand we're missing? Submit it for review.",
};

export default function SubmitPage() {
  const formUrl =
    process.env.NEXT_PUBLIC_SUBMIT_FORM_URL ||
    "https://forms.gle/dpb24kVGjneaj3sr9";

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="text-5xl mb-6">🌿</div>
      <h1 className="font-serif text-4xl font-black mb-4">
        Submit a Brand
      </h1>
      <p className="text-lg mb-8" style={{ color: "#6b6b6b", lineHeight: 1.7 }}>
        Help us build the most comprehensive ethical fashion directory. If you
        know a brand doing great work — or one that deserves scrutiny — submit
        it for review and our team will assess and add it.
      </p>

      <div
        className="rounded-2xl p-8 mb-8 text-left"
        style={{ background: "#f5f0e8", border: "1px solid #e8e4dc" }}
      >
        <h2 className="font-serif text-xl font-bold mb-4">What we review:</h2>
        <ul className="space-y-3" style={{ color: "#6b6b6b" }}>
          {[
            "🧵 Labour conditions & fair wages",
            "🌱 Environmental practices & materials",
            "🔍 Supply chain transparency",
            "📜 Third-party certifications (B Corp, GOTS, Fair Trade)",
            "🤝 Community impact & giving back",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <a
        href={formUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-8 py-4 rounded-2xl text-white font-bold text-lg transition-all hover:opacity-90"
        style={{ background: "#3d5c42" }}
      >
        Open Submission Form →
      </a>

      <p className="mt-4 text-sm" style={{ color: "#aaa" }}>
        Reviews typically take 3–5 business days.
      </p>
    </div>
  );
}
