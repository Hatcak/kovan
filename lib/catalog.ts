/**
 * The tool catalog. Safe to import from client components: it holds only
 * metadata. The code that actually reaches each provider lives in
 * lib/executors.ts and never ships to the browser.
 */
export type ToolParam = {
  name: string;
  label: string;
  required: boolean;
  example: string;
  hint: string;
};

export type Tool = {
  id: string;
  name: string;
  category: string;
  provider: string;
  description: string;
  /** Credits debited per successful call. */
  cost: number;
  params: ToolParam[];
};

export const tools: Tool[] = [
  {
    id: "wikipedia.summary",
    name: "Wikipedia özeti",
    category: "Bilgi",
    provider: "Wikipedia",
    description: "Bir maddenin kısa özetini, açıklamasını ve bağlantısını döndürür.",
    cost: 1,
    params: [
      { name: "title", label: "Madde adı", required: true, example: "İstanbul", hint: "Wikipedia'daki başlık" },
      { name: "lang", label: "Dil", required: false, example: "tr", hint: "İki harfli dil kodu, varsayılan tr" },
    ],
  },
  {
    id: "hackernews.top",
    name: "Hacker News gündemi",
    category: "Haber",
    provider: "Hacker News",
    description: "Hacker News ön sayfasındaki en popüler başlıkları puan ve bağlantıyla getirir.",
    cost: 2,
    params: [
      { name: "limit", label: "Adet", required: false, example: "5", hint: "1 ile 20 arası, varsayılan 5" },
    ],
  },
  {
    id: "weather.current",
    name: "Anlık hava durumu",
    category: "Konum",
    provider: "Open-Meteo",
    description: "Şehir adından konumu bulur, anlık sıcaklık, rüzgâr ve nem bilgisini döndürür.",
    cost: 1,
    params: [{ name: "city", label: "Şehir", required: true, example: "Ankara", hint: "Şehir adı" }],
  },
  {
    id: "crypto.price",
    name: "Kripto fiyatı",
    category: "Finans",
    provider: "CoinGecko",
    description: "Bir kripto paranın güncel fiyatını ve 24 saatlik değişimini verir.",
    cost: 1,
    params: [
      { name: "coin", label: "Coin kimliği", required: true, example: "bitcoin", hint: "CoinGecko kimliği, örn. ethereum" },
      { name: "vs", label: "Para birimleri", required: false, example: "usd,try", hint: "Virgülle ayrılmış, varsayılan usd,try" },
    ],
  },
  {
    id: "fx.rates",
    name: "Döviz kurları",
    category: "Finans",
    provider: "Frankfurter (ECB)",
    description: "Avrupa Merkez Bankası verisiyle güncel döviz kurlarını döndürür.",
    cost: 1,
    params: [
      { name: "base", label: "Baz para", required: false, example: "USD", hint: "Varsayılan USD" },
      { name: "symbols", label: "Hedef paralar", required: false, example: "TRY,EUR", hint: "Virgülle ayrılmış, varsayılan TRY,EUR" },
    ],
  },
  {
    id: "github.repo",
    name: "GitHub deposu",
    category: "Geliştirici",
    provider: "GitHub",
    description: "Bir deponun yıldız, fork, açık issue sayısını, dilini ve son güncellemesini verir.",
    cost: 1,
    params: [
      { name: "repo", label: "Depo", required: true, example: "vercel/next.js", hint: "sahip/depo biçiminde" },
    ],
  },
  {
    id: "npm.package",
    name: "npm paketi",
    category: "Geliştirici",
    provider: "npm Registry",
    description: "Bir npm paketinin son sürümünü, açıklamasını ve lisansını getirir.",
    cost: 1,
    params: [
      { name: "name", label: "Paket adı", required: true, example: "react", hint: "npm paket adı" },
    ],
  },
];

/** Sources we plan to add. Listed without prices on purpose: they are not built. */
export const comingSoon = [
  "X (Twitter) gönderileri",
  "Instagram profilleri",
  "TikTok videoları",
  "LinkedIn şirket sayfaları",
  "Google Haritalar yorumları",
  "Trendyol ürün verisi",
];

export function findTool(id: string): Tool | undefined {
  return tools.find((t) => t.id === id);
}

export type ToolInput = Record<string, string>;

/** Checks required fields and trims values. Returns an error message or the clean input. */
export function validateInput(tool: Tool, raw: unknown): { ok: true; input: ToolInput } | { ok: false; error: string } {
  const source = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const input: ToolInput = {};
  for (const p of tool.params) {
    const value = source[p.name];
    const text = typeof value === "number" ? String(value) : typeof value === "string" ? value.trim() : "";
    if (text.length > 200) return { ok: false, error: `"${p.name}" en fazla 200 karakter olabilir.` };
    if (!text && p.required) return { ok: false, error: `"${p.name}" alanı zorunlu.` };
    if (text) input[p.name] = text;
  }
  return { ok: true, input };
}
