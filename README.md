# Kovan

**Yapay zekâ ajanları için tek API cüzdanı.** Ajanınız tek bir Kovan anahtarıyla birçok veri kaynağını çağırır;
her başarılı çağrıda kredi düşer, başarısız çağrıda iade edilir. (Monid benzeri.)

## Hızlı başlangıç

```bash
npm install
cp .env.example .env.local   # isteğe bağlı
npm run dev
```

http://localhost:3000 adresini açın, **Panel → Anahtarlar** sayfasından bir anahtar oluşturun ve deneyin:

```bash
curl http://localhost:3000/api/v1/call \
  -H "Authorization: Bearer kv_live_..." \
  -H "Content-Type: application/json" \
  -d '{"tool":"weather.current","input":{"city":"Ankara"}}'
```

## API

| Uç nokta | Açıklama |
|---|---|
| `GET /api/v1/tools` | Araç kataloğu (anahtar gerekmez) |
| `POST /api/v1/call` | `{ tool, input }` ile aracı çağırır |
| `GET /api/v1/balance` | Kalan kredi |

Çalışan araçlar: `wikipedia.summary`, `hackernews.top`, `weather.current`, `crypto.price`, `fx.rates`,
`github.repo`, `npm.package`. Tamamı anahtarsız açık kaynaklara bağlanır.

## Gizli bilgiler

- **Ana anahtar (`KOVAN_ADMIN_KEY`):** Yalnızca ortam değişkeninde (Vercel'in şifreli ortam değişkenleri ya da
  `.env.local`) durur. Tanımlıysa panel bu anahtarla girişe kilitlenir ve API'de `Bearer` anahtarı olarak çalışır.
  Değiştirirseniz tüm oturumlar kapanır.
- Sağlayıcı anahtarları (örn. `GITHUB_TOKEN`) yalnızca sunucuda, `.env.local` içinde durur. `.env.local`
  git'e girmez. Bunlara asla `NEXT_PUBLIC_` öneki vermeyin.
- Kovan anahtarları bir kez gösterilir; sunucuda sadece SHA-256 özeti saklanır.

## Yapı

| Dosya | Görev |
|---|---|
| `lib/catalog.ts` | Araç listesi ve parametreleri (yeni araç buraya) |
| `lib/executors.ts` | Her aracın sağlayıcıya yaptığı gerçek çağrı |
| `lib/engine.ts` | Doğrula, krediyi düş, çağır, hata olursa iade et, kaydet |
| `lib/store.ts` | Demo depolama (sunucu belleği) |
| `app/api/v1/*` | Ajanların çağırdığı HTTP uç noktaları |
| `app/panel/*` | Panel: genel bakış, araç deneme, anahtarlar, kullanım |

### Yeni araç eklemek

1. `lib/catalog.ts` içindeki `tools` listesine kaydı ekleyin (id, ad, kredi, parametreler).
2. `lib/executors.ts` içine aynı id ile çağrı fonksiyonunu yazın.

## Demo sınırları

- Veriler sunucu belleğinde tutulur; sunucu yeniden başlarsa sıfırlanır. Tek bir çalışma alanı vardır, giriş yoktur.
  Gerçek kullanım için `lib/store.ts` yerine bir veritabanı (örn. Supabase) ve kullanıcı girişi bağlayın.
- Kredi satın alma (ödeme) henüz yok.
