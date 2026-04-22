import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS, CATEGORIES } from "@/lib/blog-posts";

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

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "KUR & UMKM": { bg: "rgba(255,209,102,0.12)", text: "#D4A017", border: "rgba(255,209,102,0.3)" },
  Properti: { bg: "rgba(255,77,109,0.10)", text: "#FF4D6D", border: "rgba(255,77,109,0.25)" },
  Freelancer: { bg: "rgba(6,214,160,0.10)", text: "#028A66", border: "rgba(6,214,160,0.25)" },
  "Hukum Dasar": { bg: "rgba(155,138,251,0.12)", text: "#7C5CBF", border: "rgba(155,138,251,0.3)" },
  "Tips Legal": { bg: "rgba(96,198,255,0.12)", text: "#0077A8", border: "rgba(96,198,255,0.3)" },
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPage() {
  const sortedPosts = [...BLOG_POSTS].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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

      {/* ── Category Filter Display (static) ── */}
      <div
        style={{
          background: "white",
          borderBottom: "1px solid rgba(13,27,62,0.07)",
          padding: "0.875rem 1rem",
          overflowX: "auto",
        }}
      >
        <div
          style={{
            maxWidth: "72rem",
            margin: "0 auto",
            display: "flex",
            gap: "0.5rem",
            flexWrap: "nowrap",
          }}
        >
          {CATEGORIES.map((cat) => (
            <span
              key={cat}
              style={{
                display: "inline-block",
                padding: "0.375rem 0.875rem",
                borderRadius: "9999px",
                fontSize: "0.78rem",
                fontWeight: 600,
                whiteSpace: "nowrap",
                background: cat === "Semua" ? "#0D1B3E" : "rgba(13,27,62,0.06)",
                color: cat === "Semua" ? "white" : "#4A5F8A",
                border: `1px solid ${cat === "Semua" ? "transparent" : "rgba(13,27,62,0.1)"}`,
              }}
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* ── Article Grid ── */}
      <main
        style={{
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "2.5rem 1rem 4rem",
        }}
      >
        <style>{`
          .blog-card {
            background: white;
            border-radius: 20px;
            padding: 1.5rem;
            border: 1px solid rgba(13,27,62,0.07);
            box-shadow: 0 2px 12px rgba(13,27,62,0.04);
            height: 100%;
            display: flex;
            flex-direction: column;
            transition: all 0.2s ease;
            cursor: pointer;
          }
          .blog-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 24px rgba(13,27,62,0.1);
          }
          .blog-posts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
          }
        `}</style>
        <div className="blog-posts-grid">
          {sortedPosts.map((post) => {
            const colors = CATEGORY_COLORS[post.category] ?? {
              bg: "rgba(13,27,62,0.06)",
              text: "#4A5F8A",
              border: "rgba(13,27,62,0.1)",
            };
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{ textDecoration: "none" }}
              >
                <article className="blog-card">
                  {/* Category Badge */}
                  <div style={{ marginBottom: "1rem" }}>
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        padding: "0.25rem 0.625rem",
                        borderRadius: "9999px",
                        background: colors.bg,
                        color: colors.text,
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      {post.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    style={{
                      fontFamily: "var(--font-jakarta)",
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: "#0D1B3E",
                      lineHeight: 1.4,
                      marginBottom: "0.75rem",
                      flex: "1",
                    }}
                  >
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p
                    style={{
                      fontSize: "0.82rem",
                      color: "#6B7FA8",
                      lineHeight: 1.6,
                      marginBottom: "1.25rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {post.excerpt}
                  </p>

                  {/* Meta: Date + Read Time */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: "1rem",
                      borderTop: "1px solid rgba(13,27,62,0.06)",
                    }}
                  >
                    <span style={{ fontSize: "0.72rem", color: "#9BAAC5" }}>
                      {formatDate(post.date)}
                    </span>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        color: "#FF4D6D",
                        fontWeight: 600,
                      }}
                    >
                      {post.readTime} mnt baca →
                    </span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        {/* ── Bottom CTA ── */}
        <div
          style={{
            marginTop: "3rem",
            padding: "2rem",
            borderRadius: "24px",
            background: "linear-gradient(135deg, #FF4D6D 0%, #e03055 100%)",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-jakarta)",
              fontWeight: 800,
              fontSize: "1.4rem",
              color: "white",
              marginBottom: "0.5rem",
            }}
          >
            Butuh dokumen legal?
          </h3>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", marginBottom: "1.25rem" }}>
            Dari kontrak sewa sampai NDA — buat sekarang, selesai dalam 5 menit.
          </p>
          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "0.875rem 2rem",
              borderRadius: "14px",
              background: "#0D1B3E",
              color: "#FFD166",
              fontWeight: 800,
              fontSize: "0.9rem",
              textDecoration: "none",
            }}
          >
            Buat sekarang →
          </Link>
        </div>
      </main>
    </div>
  );
}
