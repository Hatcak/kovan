import type { ToolInput } from "./catalog";

/**
 * Server-side calls to each provider. Any provider secret (for example
 * GITHUB_TOKEN) is read from process.env here and never leaves the server:
 * agents only ever see their Kovan key and the trimmed result.
 */

export class UpstreamError extends Error {}

const TIMEOUT_MS = 8000;

async function getJson(url: string, headers: Record<string, string> = {}): Promise<unknown> {
  const res = await fetch(url, {
    headers: { accept: "application/json", "user-agent": "Kovan/0.1", ...headers },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: "no-store",
  });
  if (res.status === 404) throw new UpstreamError("Kaynakta bulunamadı.");
  if (!res.ok) throw new UpstreamError(`Kaynak ${res.status} hatası döndürdü.`);
  return res.json();
}

const clampInt = (value: string | undefined, min: number, max: number, fallback: number) => {
  const n = Number.parseInt(value ?? "", 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};

const csv = (value: string | undefined, fallback: string) =>
  (value ?? fallback)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 10);

type Json = Record<string, unknown>;

export const executors: Record<string, (input: ToolInput) => Promise<unknown>> = {
  async "wikipedia.summary"({ title, lang }) {
    const code = /^[a-z]{2,3}$/.test(lang ?? "") ? lang : "tr";
    const data = (await getJson(
      `https://${code}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`,
    )) as Json;
    return {
      title: data.title,
      description: data.description ?? null,
      extract: data.extract,
      url: (data.content_urls as { desktop?: { page?: string } } | undefined)?.desktop?.page ?? null,
    };
  },

  async "hackernews.top"({ limit }) {
    const n = clampInt(limit, 1, 20, 5);
    const ids = ((await getJson("https://hacker-news.firebaseio.com/v0/topstories.json")) as number[]).slice(0, n);
    const items = await Promise.all(
      ids.map((id) => getJson(`https://hacker-news.firebaseio.com/v0/item/${id}.json`) as Promise<Json>),
    );
    return items.map((it) => ({
      title: it.title,
      score: it.score,
      comments: it.descendants ?? 0,
      url: it.url ?? `https://news.ycombinator.com/item?id=${it.id}`,
    }));
  },

  async "weather.current"({ city }) {
    const geo = (await getJson(
      `https://geocoding-api.open-meteo.com/v1/search?count=1&language=tr&name=${encodeURIComponent(city)}`,
    )) as { results?: Json[] };
    const place = geo.results?.[0];
    if (!place) throw new UpstreamError(`"${city}" için konum bulunamadı.`);
    const wx = (await getJson(
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`,
    )) as { current: Json };
    return {
      place: `${place.name}, ${place.country}`,
      time: wx.current.time,
      temperatureC: wx.current.temperature_2m,
      humidityPct: wx.current.relative_humidity_2m,
      windKmh: wx.current.wind_speed_10m,
    };
  },

  async "crypto.price"({ coin, vs }) {
    const id = coin.toLowerCase();
    const currencies = csv(vs, "usd,try").map((c) => c.toLowerCase());
    const data = (await getJson(
      `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(id)}&vs_currencies=${currencies.join(",")}&include_24hr_change=true`,
    )) as Record<string, Json>;
    if (!data[id]) throw new UpstreamError(`"${coin}" bulunamadı. CoinGecko kimliği kullanın, örn. bitcoin.`);
    return { coin: id, ...data[id] };
  },

  async "fx.rates"({ base, symbols }) {
    const from = (base ?? "USD").toUpperCase();
    const to = csv(symbols, "TRY,EUR").map((s) => s.toUpperCase());
    const data = (await getJson(
      `https://api.frankfurter.dev/v1/latest?base=${encodeURIComponent(from)}&symbols=${encodeURIComponent(to.join(","))}`,
    )) as Json;
    return { base: data.base, date: data.date, rates: data.rates };
  },

  async "github.repo"({ repo }) {
    if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) throw new UpstreamError('Depo "sahip/depo" biçiminde olmalı.');
    const token = process.env.GITHUB_TOKEN;
    const data = (await getJson(
      `https://api.github.com/repos/${repo}`,
      token ? { authorization: `Bearer ${token}` } : {},
    )) as Json;
    return {
      name: data.full_name,
      description: data.description,
      stars: data.stargazers_count,
      forks: data.forks_count,
      openIssues: data.open_issues_count,
      language: data.language,
      updatedAt: data.pushed_at,
      url: data.html_url,
    };
  },

  async "npm.package"({ name }) {
    if (!/^(@[\w.-]+\/)?[\w.-]+$/.test(name)) throw new UpstreamError("Geçersiz paket adı.");
    const data = (await getJson(`https://registry.npmjs.org/${name}/latest`)) as Json;
    return {
      name: data.name,
      version: data.version,
      description: data.description,
      license: data.license ?? null,
      homepage: data.homepage ?? null,
    };
  },
};
