# 02 — Kullanılmayan Medya Dosyaları (Faz 3)

**Not:** Hiçbir dosya taşınmadı/silinmedi. Bu, Faz 1'deki referans taramasının (statik `class="..."`/`src="..."` + `script.js`'teki dinamik `imgSrc()` üretimi dahil) tekrar teyit edilmiş, çözünürlük bilgisiyle zenginleştirilmiş halidir.

## Yöntem

- `index.html`, `style.css`, `script.js` içinde her dosya adı için ayrı ayrı arama yapıldı.
- `script.js`'teki `imgSrc(id)` fonksiyonu ile dinamik üretilen `assets/image/sdg/e-web-01..17.png` **kullanılıyor** sayıldı (otomatik RİSKLİ/muaf) — bu 17 dosya aşağıdaki listede YOK.
- Slug/id ile dinamik üretilen başka bir kalıp bulunamadı (Faz 1'de doğrulandı) — bu yüzden aşağıdaki liste doğrudan "silinecek" adayı olarak değerlendirilebilir, RİSKLİ işaretli tek grup `image/un/` klasörü (gerekçe aşağıda).
- Çözünürlükler PowerShell/System.Drawing ile okundu; `.webp`/`.avif` formatları bu ortamdaki GDI+ kod çözücüsü tarafından desteklenmiyor (Windows'ta ayrı codec paketi gerekiyor) — bu 3 dosya için çözünürlük alınamadı, format bilgisiyle not edildi.

## Silinecek Aday Liste — Toplam 42 dosya, ~7.82 MB

### `image/future/` — 3 dosya, 1.05 MB

| Dosya | Boyut | Çözünürlük | Karar | Gerekçe |
|---|---|---|---|---|
| `dead-soil.jpg` | 473.6 KB | 1400×933 | SİL | Hiçbir yerde referans yok |
| `deforestation.avif` | 220.4 KB | (avif, okunamadı) | SİL | Hiçbir yerde referans yok |
| `olu-kiyilar.jpg` | 396.0 KB | 1400×933 | SİL | Hiçbir yerde referans yok |

### `image/nasa/` — 4 dosya, 468.5 KB

| Dosya | Boyut | Çözünürlük | Karar | Gerekçe |
|---|---|---|---|---|
| `nasa-firesense-2023-8640-x-5760-gaw-78.webp` | 10.0 KB | (webp, okunamadı) | SİL | Hiçbir yerde referans yok |
| `slide1.webp` | 140.7 KB | (webp, okunamadı) | SİL | Hiçbir yerde referans yok |
| `power-station-374097-1920.jpeg` | 172.4 KB | 1920×1280 | SİL | Hiçbir yerde referans yok |
| `effectsbannernew-opt.jpeg` | 145.6 KB | 1100×732 | SİL | Hiçbir yerde referans yok |

### `image/progress/` — 1 dosya, 26.1 KB

| Dosya | Boyut | Çözünürlük | Karar | Gerekçe |
|---|---|---|---|---|
| `cop-summits.png` | 26.1 KB | 300×121 | SİL | Hiçbir yerde referans yok |

### `image/sdg/` — 1 dosya, 98.7 KB

| Dosya | Boyut | Çözünürlük | Karar | Gerekçe |
|---|---|---|---|---|
| `flag-of-the-united-nations-svg.png` | 98.7 KB | 1280×854 | SİL | `imgSrc()` kalıbına uymuyor (17'lik dizinin dışında), başka referans yok |

### `image/un/` — 33 dosya, tamamı, 6.30 MB

| Dosya | Boyut | Çözünürlük |
|---|---|---|
| UN71014338.jpg | 82.2 KB | 1200×800 |
| UN7123763.jpg | 259.3 KB | 1200×800 |
| UN7123956.jpg | 398.2 KB | 1200×800 |
| UN7123957.jpg | 240.6 KB | 1200×800 |
| UN713098.jpg | 149.2 KB | 1200×804 |
| UN7262680.jpg | 115.1 KB | 1200×800 |
| UN730286.jpg | 261.8 KB | 1200×800 |
| UN730288.jpg | 183.9 KB | 1200×800 |
| UN7319884.jpg | 272.3 KB | 1200×800 |
| UN7328301.jpg | 161.3 KB | 1200×800 |
| UN7329219.jpg | 75.8 KB | 1200×800 |
| UN7344398.jpg | 294.3 KB | 1200×798 |
| UN7348398.jpg | 172.2 KB | 1200×800 |
| UN7369403.jpg | 145.3 KB | 1200×800 |
| UN7406120.jpg | 141.4 KB | 1200×800 |
| UN7417696.jpg | 114.4 KB | 1200×798 |
| UN7417711.jpg | 102.7 KB | 1200×771 |
| UN7424567.jpg | 87.5 KB | 1200×800 |
| UN7428282.jpg | 187.1 KB | 1200×800 |
| UN7436150.jpg | 81.5 KB | 1200×768 |
| UN7461239.jpg | 168.5 KB | 794×1200 |
| UN7472231.jpg | 104.2 KB | 1200×800 |
| UN7489074.jpg | 165.7 KB | 1200×800 |
| UN7549379.jpg | 101.8 KB | 1200×806 |
| UN7661771.jpg | 313.9 KB | 1200×800 |
| UN7686926.jpg | 308.9 KB | 1200×800 |
| UN7731997.jpg | 199.4 KB | 814×1200 |
| UN7768472.jpg | 246.6 KB | 1200×830 |
| UN7771324.jpg | 223.6 KB | 1200×791 |
| UN7771340.jpg | 253.3 KB | 1200×826 |
| UN7771848.jpg | 199.5 KB | 1200×794 |
| UN7778908.jpg | 256.5 KB | 1200×843 |
| UN794697.jpg | 259.1 KB | 1200×800 |

**Karar: RİSKLİ (silme önerilmiyor, kullanıcıya soruluyor).** Gerekçe: bu 33 dosya untracked (bu oturumda diske eklenmiş, hiç commit edilmemiş) — yani "eski kullanılmayan kalıntı" değil, **yakın zamanda eklenmiş ama sayfaya henüz entegre edilmemiş** bir set olabilir. Tutarlı isimlendirme (`UN` + BM medya kütüphanesi ID'si), tutarlı çözünürlük (~1200×800) ve klasörün TAMAMEN kullanılıyor olmaması (0/33), bunun "yanlışlıkla eklenmiş" değil "planlanmış ama yarım kalmış bir bölüm" olduğuna işaret ediyor.

## Toplam

| Kategori | Dosya | Boyut |
|---|---|---|
| Kesin SİL adayı (future+nasa+progress+sdg) | 9 | ~1.51 MB |
| RİSKLİ — kullanıcı kararı gerekli (`image/un/`) | 33 | ~6.30 MB |
| **Toplam potansiyel kazanç** | **42** | **~7.82 MB** |

## Silme yöntemi (şablon kuralı)

Onaylanan dosyalar doğrudan `rm` ile silinmeyecek — önce `iklim-krizi/_arsiv/` klasörüne taşınıp commit edilecek, kullanıcı doğruladıktan sonra kalıcı silme yapılacak.

## Karar ve uygulama

- **9 dosyalık kesin SİL listesi (future/nasa/progress/sdg, ~1.51 MB)**: onaylandı, `iklim-krizi/_arsiv/` altına orijinal klasör yapısı korunarak `git mv` ile taşındı (kalıcı silme değil — geri dönüşü kolay, `git log --follow` ile izlenebilir). Kullanıcı doğruladıktan sonra kalıcı silinecek.
- **`image/un/` klasörü (33 dosya, 6.3 MB)**: kullanıcı kararı — **olduğu gibi bırakıldı**, dokunulmadı. Muhtemelen ileride kullanılacak bir "BM fotoğrafları" bölümü için eklenmiş, temizlik kapsamı dışında tutuluyor.
