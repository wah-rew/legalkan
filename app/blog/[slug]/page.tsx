import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS, getPostBySlug, getRelatedPosts } from "@/lib/blog-posts";
import CopyLinkButton from "@/components/CopyLinkButton";
import { JsonLd } from "@/components/JsonLd";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Artikel Tidak Ditemukan" };

  return {
    title: `${post.title} | Blog LegalKan`,
    description: post.metaDescription,
    keywords: `${post.category}, legal UMKM Indonesia, ${post.title.toLowerCase()}`,
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      type: "article",
      publishedTime: post.date,
      authors: ["Tim LegalKan"],
    },
  };
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

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug, 3);
  const colors = CATEGORY_COLORS[post.category] ?? {
    bg: "rgba(13,27,62,0.06)",
    text: "#4A5F8A",
    border: "rgba(13,27,62,0.1)",
  };

  const waText = encodeURIComponent(
    `Baca artikel menarik di LegalKan: ${post.title} — https://legal-kan.com/blog/${post.slug}`
  );

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: "Tim LegalKan",
    },
    publisher: {
      "@type": "Organization",
      name: "LegalKan",
      url: "https://www.legal-kan.com",
    },
  };

  return (
    <div style={{ background: "#F8F9FF", minHeight: "100vh" }}>
      <JsonLd data={articleSchema} />
      {/* ── Breadcrumb ── */}
      <div
        style={{
          background: "white",
          borderBottom: "1px solid rgba(13,27,62,0.07)",
          padding: "0.75rem 1rem",
        }}
      >
        <div
          style={{
            maxWidth: "72rem",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.78rem",
            color: "#9BAAC5",
          }}
        >
          <Link href="/" style={{ color: "#9BAAC5", textDecoration: "none" }}>
            Beranda
          </Link>
          <span>›</span>
          <Link href="/blog" style={{ color: "#9BAAC5", textDecoration: "none" }}>
            Blog
          </Link>
          <span>›</span>
          <span
            style={{
              color: "#0D1B3E",
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "200px",
            }}
          >
            {post.title}
          </span>
        </div>
      </div>

      {/* ── Article ── */}
      <article
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "2.5rem 1rem 4rem",
        }}
      >
        {/* Category + Meta */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flexWrap: "wrap",
            marginBottom: "1.25rem",
          }}
        >
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
          <span style={{ fontSize: "0.75rem", color: "#9BAAC5" }}>
            {formatDate(post.date)}
          </span>
          <span style={{ fontSize: "0.75rem", color: "#9BAAC5" }}>
            · {post.readTime} menit baca
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "var(--font-jakarta)",
            fontWeight: 800,
            fontSize: "clamp(1.6rem, 4vw, 2.25rem)",
            color: "#0D1B3E",
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
            marginBottom: "1rem",
          }}
        >
          {post.title}
        </h1>

        {/* Excerpt */}
        <p
          style={{
            fontSize: "1.05rem",
            color: "#4A5F8A",
            lineHeight: 1.7,
            marginBottom: "1.75rem",
            borderLeft: "3px solid #FF4D6D",
            paddingLeft: "1rem",
          }}
        >
          {post.excerpt}
        </p>

        {/* Author */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1rem 1.25rem",
            borderRadius: "16px",
            background: "white",
            border: "1px solid rgba(13,27,62,0.07)",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "9999px",
              background: "linear-gradient(135deg, #FF4D6D, #FFD166)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
              flexShrink: 0,
            }}
          >
            ⚖️
          </div>
          <div>
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#0D1B3E",
              }}
            >
              Tim LegalKan
            </div>
            <div style={{ fontSize: "0.72rem", color: "#9BAAC5" }}>
              Platform dokumen legal untuk UMKM Indonesia
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
          style={{
            fontSize: "0.95rem",
            lineHeight: 1.8,
            color: "#1E2D4A",
          }}
        />

        {/* Share Buttons */}
        <div
          style={{
            marginTop: "2.5rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid rgba(13,27,62,0.08)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{ fontSize: "0.82rem", fontWeight: 600, color: "#4A5F8A" }}
          >
            Bagikan:
          </span>
          <a
            href={`https://wa.me/?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.5rem 1rem",
              borderRadius: "10px",
              background: "#25D366",
              color: "white",
              fontSize: "0.78rem",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            <span>📱</span> WhatsApp
          </a>
          <CopyLinkButton slug={post.slug} />
        </div>

        {/* CTA Box */}
        <div
          style={{
            marginTop: "2.5rem",
            padding: "1.75rem",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #0D1B3E 0%, #162348 100%)",
            border: "1px solid rgba(255,77,109,0.2)",
          }}
        >
          <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>📝</div>
          <h3
            style={{
              fontFamily: "var(--font-jakarta)",
              fontWeight: 800,
              fontSize: "1.15rem",
              color: "white",
              marginBottom: "0.5rem",
            }}
          >
            Siap buat dokumen legal kamu?
          </h3>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#94A3CB",
              lineHeight: 1.6,
              marginBottom: "1.25rem",
            }}
          >
            LegalKan menyediakan 10+ jenis kontrak legal yang sesuai KUHPerdata
            Indonesia. Selesai dalam 5 menit, langsung dapat PDF.
          </p>
          <Link
            href={post.relatedContract}
            style={{
              display: "inline-block",
              padding: "0.75rem 1.5rem",
              borderRadius: "12px",
              background: "#FF4D6D",
              color: "white",
              fontWeight: 700,
              fontSize: "0.85rem",
              textDecoration: "none",
            }}
          >
            Buat Dokumen Sekarang →
          </Link>
        </div>
      </article>

      {/* ── Related Articles ── */}
      {related.length > 0 && (
        <section
          style={{
            background: "white",
            borderTop: "1px solid rgba(13,27,62,0.07)",
            padding: "2.5rem 1rem 3rem",
          }}
        >
          <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "var(--font-jakarta)",
                fontWeight: 700,
                fontSize: "1.25rem",
                color: "#0D1B3E",
                marginBottom: "1.5rem",
              }}
            >
              Artikel Terkait
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {related.map((rel) => {
                const relColors = CATEGORY_COLORS[rel.category] ?? {
                  bg: "rgba(13,27,62,0.06)",
                  text: "#4A5F8A",
                  border: "rgba(13,27,62,0.1)",
                };
                return (
                  <Link
                    key={rel.slug}
                    href={`/blog/${rel.slug}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{
                        padding: "1.25rem",
                        borderRadius: "16px",
                        border: "1px solid rgba(13,27,62,0.07)",
                        background: "#F8F9FF",
                        transition: "all 0.2s",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          padding: "0.2rem 0.5rem",
                          borderRadius: "9999px",
                          background: relColors.bg,
                          color: relColors.text,
                          border: `1px solid ${relColors.border}`,
                          marginBottom: "0.75rem",
                        }}
                      >
                        {rel.category}
                      </span>
                      <h3
                        style={{
                          fontFamily: "var(--font-jakarta)",
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          color: "#0D1B3E",
                          lineHeight: 1.4,
                          marginBottom: "0.5rem",
                        }}
                      >
                        {rel.title}
                      </h3>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          color: "#FF4D6D",
                          fontWeight: 600,
                        }}
                      >
                        Baca artikel →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <style>{`
        .blog-content h2 {
          font-family: var(--font-jakarta);
          font-weight: 700;
          font-size: 1.35rem;
          color: #0D1B3E;
          margin-top: 2rem;
          margin-bottom: 0.875rem;
          line-height: 1.3;
        }
        .blog-content h3 {
          font-family: var(--font-jakarta);
          font-weight: 700;
          font-size: 1.05rem;
          color: #1E2D4A;
          margin-top: 1.5rem;
          margin-bottom: 0.625rem;
        }
        .blog-content p {
          margin-bottom: 1rem;
        }
        .blog-content ul, .blog-content ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        .blog-content li {
          margin-bottom: 0.375rem;
          line-height: 1.7;
        }
        .blog-content strong {
          font-weight: 700;
          color: #0D1B3E;
        }
        .blog-content em {
          font-style: italic;
        }
        .blog-content a {
          color: #FF4D6D;
          font-weight: 600;
          text-decoration: underline;
        }
        .blog-content a:hover {
          color: #e03055;
        }
      `}</style>
    </div>
  );
}


