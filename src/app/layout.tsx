// src/app/layout.tsx
// ─────────────────────────────────────────────
// Root layout — wraps every page
// Sets up fonts, global metadata, Navbar & Footer
// ─────────────────────────────────────────────

import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ethical Finder — Discover Fashion Brands That Actually Care",
  description:
    "Search and discover ethical fashion brands rated on sustainability, labour rights, environmental impact, and transparency. Make conscious shopping decisions.",
  keywords:
    "ethical fashion, sustainable brands, fair trade clothing, ethical shopping, conscious fashion",
  openGraph: {
    title: "Ethical Finder",
    description: "Conscious fashion, rated honestly.",
    siteName: "Ethical Finder",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="bg-[#faf8f3] text-[#2a2a2a] font-sans">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
