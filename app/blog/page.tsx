import type { Metadata } from "next";
import { BLOG_POSTS, CATEGORIES } from "@/lib/blog-posts";
import BlogClient from "@/components/BlogClient";

export const metadata: Metadata = {
  title: "Blog LegalKan — Tips Legal untuk UMKM Indonesia",
  description:
    "Panduan, tips, dan artikel hukum praktis untuk UMKM Indonesia. Dari syarat KUR, cara buat kontrak, sampai panduan NIB — semua gratis di Blog LegalKan.",
  keywords:
    "tips legal UMKM, panduan kontrak Indonesia, syarat KUR, cara daftar NIB, hukum usaha Indonesia",
  openGraph: {
    title: "Blog LegalKan — Tips Legal untuk UMKM Indonesia",
    description:
      "Panduan hukum praktis untuk pelaku usaha Indonesia. Gratis dan mudah dipahami.",
    type: "website",
  },
};

export default function BlogPage() {
  return (
    <div style={{ background: "#F8F9FF", minHeight: "100vh" }}>
      {/* ── Hero ── */}
      <section
        style={{
          background: "linear-gradient(135deg, #0D1B3E 0%, #162348 100%)",
          padding: "4rem 1rem 3rem",
        }}
      >
        <div style={{ maxWidth: "72rem", margin: "0 auto", textAlign: "center" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "0.7rem",
              fontWeight: 700,
              padding: "0.3rem 0.875rem",
              borderRadius: "9999px",
              background: "rgba(255,77,109,0.15)",
              color: "#FF8A9B",
              border: "1px solid rgba(255,77,109,0.2)",
              marginBottom: "1.25rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            📚 Blog LegalKan
          </span>
          <h1
            style={{
              fontFamily: "var(--font-jakarta)",
              fontWeight: 800,
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              color: "white",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: "1rem",
            }}
          >
            Tips Legal untuk{" "}
            <span style={{ color: "#FFD166" }}>UMKM Indonesia</span>
          </h1>
          <p
            style={{
              color: "#94A3CB",
              fontSize: "1rem",
              maxWidth: "36rem",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Panduan hukum yang mudah dipahami — tanpa bahasa kaku, tanpa jargon
            ribet. Seperti ngobrol sama teman yang kebetulan paham hukum.
          </p>
        </div>
      </section>

      {/* ── Interactive filter + article grid (client component) ── */}
      <BlogClient posts={BLOG_POSTS} categories={CATEGORIES} />
    </div>
  );
}
