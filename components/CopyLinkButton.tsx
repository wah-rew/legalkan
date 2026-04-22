"use client";

export default function CopyLinkButton({ slug }: { slug: string }) {
  const handleCopy = () => {
    navigator.clipboard
      .writeText(`https://legal-kan.com/blog/${slug}`)
      .then(() => alert("Link disalin!"))
      .catch(() => alert("Gagal menyalin link"));
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.5rem 1rem",
        borderRadius: "10px",
        background: "rgba(13,27,62,0.07)",
        color: "#0D1B3E",
        fontSize: "0.78rem",
        fontWeight: 700,
        border: "none",
        cursor: "pointer",
      }}
    >
      <span>🔗</span> Salin Link
    </button>
  );
}
