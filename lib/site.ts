/** Brand and copy shared across the marketing site and the panel. */
export const site = {
  name: "Kovan",
  tagline: "Ajanlarınız için tek API cüzdanı",
  description:
    "Kovan, yapay zekâ ajanınızı tek bir anahtarla birçok veri kaynağına bağlar. Ayrı kayıt, ayrı abonelik, ayrı anahtar yok: ajan aracı çağırır, kullandığı kadar kredi düşer.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  repo: "https://github.com/Hatcak/kovan",
} as const;
