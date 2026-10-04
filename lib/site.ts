/** Brand and copy shared across the marketing site and the panel. */
export const site = {
  name: "Kovan",
  tagline: "Ajanlarınız için tek API cüzdanı",
  description:
    "Kovan, yapay zekâ ajanınızı tek bir anahtarla birçok veri kaynağına bağlar. Ayrı kayıt, ayrı abonelik, ayrı anahtar yok: ajan aracı çağırır, kullandığı kadar kredi düşer.",
  // trim() also strips a stray BOM that some shells prepend when piping values in
  url: (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000").replace(/\/$/, ""),
  repo: "https://github.com/Hatcak/kovan",
} as const;
