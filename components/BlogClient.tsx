"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog-posts";

interface BlogClientProps {
  posts: BlogPost[];
  categories: string[];
}

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

export default function BlogClient({ posts, categories }: BlogClientProps) {
  const [activeCategory, setActiveCategory] = useState("Semua");

  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [posts]
  );

  const filteredPosts = useMemo(
    () =>
      activeCategory === "Semua"
        ? sortedPosts
        : sortedPosts.filter((p) => p.category === activeCategory),
    [sortedPosts, activeCategory]
  );

  return (
    <>
      {/* ── Category Filter ── */}
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
          {categories.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  display: "inline-block",
                  padding: "0.375rem 0.875rem",
                  borderRadius: "9999px",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  background: isActive ? "#0D1B3E" : "rgba(13,27,62,0.06)",
                  color: isActive ? "white" : "#4A5F8A",
                  border: `1px solid ${isActive ? "transparent" : "rgba(13,27,62,0.1)"}`,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {cat}
              </button>
            );
          })}
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

        {/* Article count */}
        <p
          style={{
            fontSize: "0.82rem",
            color: "#6B7FA8",
            marginBottom: "1.5rem",
            fontWeight: 500,
          }}
        >
          {filteredPosts.length} artikel ditemukan
        </p>

        <div className="blog-posts-grid">
          {filteredPosts.map((post) => {
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
    </>
  );
}
