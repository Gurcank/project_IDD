# Proje Temizlik, Optimizasyon ve Metin Düzenleme Görevi

> Kullanım: Bu dosyayı projenin köküne (`docs/temizlik-promptu.md` gibi) koy ve Claude Code'a şunu yaz:
> **"`docs/temizlik-promptu.md` dosyasını oku. Plan modunda başla. Sadece Faz 0 ve Faz 1'i yap, sonra dur."**

---

## 0. İhlal edilemez kurallar

1. **Güvenlik ağı önce.** `git status` temiz olmalı. Değilse dur ve bana söyle. Sonra `git checkout -b temizlik/<tarih>` ile yeni bir dal (branch) aç. Her fazın sonunda ayrı commit at.
2. **Onaysız silme yok.** Her silme işleminden önce rapor üret, listeyi bana göster, onay bekle. "Küçük dosya, zararsız" gerekçesiyle atlama.
3. **UI/UX'e dokunma.** Tarayıcıda görünen çıktı birebir aynı kalacak.
   - Değiştirilmeyecekler: `className` / `style` değerleri, Tailwind sınıfları, CSS/SCSS dosyalarındaki renk-boşluk-font-animasyon değerleri, DOM ağacının yapısı, component hiyerarşisi, responsive breakpoint'ler (ekran genişliğine göre kırılma noktaları), `z-index`, hover/focus durumları, geçiş süreleri, kullanıcı akışları, tıklama davranışları, sayfa sıralaması.
   - JSX içinde sadece **görünmeyen** şeyler temizlenebilir: kullanılmayan import'lar, ölü prop'lar, yorum satırına alınmış eski kod, `console.log` kalıntıları.
4. **Davranış değişmeyecek.** URL yolları, query parametreleri, API endpoint şekilleri, `localStorage` / `cookie` anahtarları, analytics event isimleri, form alan `name` değerleri, env değişken isimleri aynı kalacak.
5. **Bağımlılık (dependency) sürümü yükseltme, framework upgrade yapma, yeni kalıcı kütüphane ekleme.** Tek istisna: analiz için geçici `devDependency` kurabilirsin, iş bitince kaldır.
6. **Her fazdan sonra doğrula:** typecheck → lint → test → build. Herhangi biri kırılırsa fazı geri al (`git revert`), sebebini raporla.
7. **%100 emin değilsen silme.** Şüpheli her şey "RİSKLİ" listesine gider, silinmez.
8. Tüm raporları `temizlik-raporu/` klasörüne yaz.

---

## Faz 1 — Keşif (hiçbir şeyi değiştirme)

- Stack tespiti: Next.js sürümü, App Router mu Pages Router mı, TypeScript/JavaScript, styling yöntemi, state yönetimi, test altyapısı, CI.
- Giriş noktalarını çıkar: `app/`, `pages/`, `middleware`, API route'ları, script'ler, `public/`.
- **Dinamik referans kalıplarını tara** (bunlar statik analizde "kullanılmıyor" görünür ama kullanılır):
  - `import()` ile string birleştirme, değişkenli `require()`, `next/dynamic`
  - Şablon dizesiyle üretilen yollar: `` `/images/${slug}.jpg` ``
  - CMS / JSON / MDX içerikleri, i18n (çoklu dil) dosyaları
  - CSS `url()`, `background-image`, `<Image src>`, `new Image()`
  - `manifest.json`, `sitemap`, `robots`, OG/Twitter meta görselleri, e-posta şablonları
- Çıktı → `temizlik-raporu/00-envanter.md`: sayfa sayısı, component sayısı, toplam medya boyutu (MB), build çıktısındaki bundle boyutu, bağımlılık sayısı. Bu, sonraki fazların "öncesi" ölçümü.

---

## Faz 2 — Ölü kod temizliği

**Araçlar (geçici kur, sonuçları körü körüne uygulama):** `knip`, `ts-prune`, `depcheck`, ESLint'in kullanılmayan değişken kuralı, `madge` (döngüsel bağımlılık tespiti).

**Hedefler:**
- Hiçbir yerden import edilmeyen dosyalar
- Kullanılmayan export'lar, fonksiyonlar, tipler, sabitler
- Ulaşılamayan kod blokları (erken `return` sonrası, hep `false` olan koşullar)
- `package.json`'da olup kullanılmayan bağımlılıklar
- Kapatılmış ve bir daha açılmayacak feature flag'ler ve o flag'in ölü dalı
- Yorum satırına alınmış eski kod blokları
- `console.log` / debug kalıntıları
- Kullanılmayan env değişkenleri, boş dosya ve klasörler

**Asla dokunma (framework çağırır, "kullanılmıyor" görünür):** `layout`, `page`, `route`, `loading`, `error`, `not-found`, `template`, `middleware`, `sitemap`, `robots`, `opengraph-image`, `generateStaticParams`, `generateMetadata`, `metadata` export'ları, `next.config`, Tailwind/PostCSS/ESLint config'leri, migration dosyaları.

**Kural:** Araç bir şeyi "ölü" dediyse, silmeden önce `grep`/`ripgrep` ile ikinci bir doğrulama yap ve kanıtı rapora yaz.

Çıktı → `temizlik-raporu/01-olu-kod.md`, üç listeli:
| Dosya/Sembol | Karar (SİL / RİSKLİ / DOKUNMA) | Gerekçe | Kanıt (arama sonucu) |

---

## Faz 3 — Kullanılmayan medya dosyaları

1. `public/`, `assets/`, `static/` altındaki tüm medyayı listele: yol, boyut (KB/MB), çözünürlük, format.
2. Her dosya için referans araması yap — kod, CSS, MDX/Markdown, JSON, CMS içeriği, i18n dosyaları, manifest/sitemap/meta dahil.
3. Dosya adı bir slug veya id ile dinamik üretiliyorsa → otomatik **RİSKLİ**, silme.
4. Çıktı → `temizlik-raporu/02-kullanilmayan-medya.md`: silinecek liste + kazanılacak toplam MB.
5. **Silme yöntemi:** doğrudan `rm` yapma. Önce `_arsiv/` klasörüne taşı ve commit at. Ben doğruladıktan sonra kalıcı silme yapılır.

---

## Faz 4 — Medya çözünürlük politikası (dikkatli uygula)

**Kural:** 4K (3840×2160) veya Full HD (1920×1080) altındaki medyalar elenecek — **ama yalnızca içerik medyası için.**

**İçerik medyası:** hero görselleri, galeri fotoğrafları, banner'lar, ürün fotoğrafları, videolar, blog kapak görselleri.

**Muaf — asla silme, çözünürlüğü küçük olması normaldir:**
- Tüm SVG dosyaları (vektördür, çözünürlüğü yoktur)
- Logo, favicon, `apple-touch-icon`, PWA ikonları (192/512), uygulama ikonları
- OG / Twitter paylaşım görselleri (standardı 1200×630'dur)
- İkon setleri, sprite dosyaları, pattern/doku görselleri
- Avatar, placeholder, blur placeholder görselleri
- `next/image` tarafından üretilmiş responsive türevler ve `srcset` varyantları
- E-posta şablonu görselleri (e-posta istemcileri büyük dosyayı kırpar)

Çıktı → `temizlik-raporu/02b-cozunurluk.md`:
| Dosya | Kategori | Çözünürlük | Karar | Gerekçe |

**Uyarı olarak rapora yaz:** düşük çözünürlüklü kaynak silinip yerine yenisi konmazsa o alan boş kalır. Silinecek her içerik görseli için "yerine ne konacak" sütunu ekle.

---

## Faz 5 — Kod optimizasyonu (görsel çıktı değişmeden)

**Ölçüm zorunlu:** her optimizasyon için öncesi/sonrası sayı ver (bundle boyutu, build süresi, istek sayısı). Ölçemediğin optimizasyonu yapma.

**İzin verilenler:**
- Tekrarlayan mantığı ortak fonksiyona/hook'a çıkarma
- Gereksiz state ve `useEffect` kaldırma (türetilebilir değeri state'te tutmama)
- Gereksiz yeniden render — `memo`/`useMemo`/`useCallback` **sadece ölçülmüş bir sorun varsa**
- Gereksiz `"use client"` işaretlerini kaldırıp server component'te bırakma
- Sıralı (waterfall) veri çekmeyi paralele çevirme, N+1 sorgu düzeltme
- `import * as X` gibi tree-shaking'i (kullanılmayan kodun elenmesini) bozan import'ları düzeltme
- Ağır kütüphaneleri `next/dynamic` ile tembel yükleme — **görsel sonuç aynı kalmak şartıyla**, layout kayması (CLS) yaratmayacaksa
- Görsel formatı optimizasyonu (WebP/AVIF) — **piksel çıktısı gözle ayırt edilemez olmalı**

**Yasak:**
- Mimari yeniden yazım, klasör yapısını topluca değiştirme
- State yönetimi kütüphanesini değiştirme, CSS yaklaşımını değiştirme
- "Daha temiz olur" diye çalışan bir API'nin şeklini değiştirme
- Toplu yeniden adlandırma (rename) operasyonları

Her değişiklik ayrı ve küçük commit olsun, mesajı tek satır ve açıklayıcı.

---

## Faz 6 — Metinleri profesyonelleştir (AI izlerini temizle)

**Kapsam:** kullanıcıya görünen tüm metinler — başlıklar, paragraflar, buton yazıları, form etiketleri, hata ve boş durum mesajları, meta description, e-posta şablonları.

**Temizlenecek Türkçe kalıplar:**
"günümüzün dijital dünyasında", "sadece bir X değil, aynı zamanda Y", "keşfedin / yolculuğa çıkın", "adeta", "eşsiz deneyim", "çözüm ortağınız", "fark yaratın", "tam size göre", üçlü sıfat dizileri ("hızlı, güvenilir ve modern"), gereksiz ünlem, emoji, abartılı öz övgü, her paragrafı özetle kapatma alışkanlığı.

**İngilizce metin varsa:** "delve", "in today's fast-paced world", "unlock", "unleash", "seamless", "robust", "elevate", "it's not just X — it's Y", arka arkaya em dash, üçlü liste ritmi.

**Yerine ne gelecek:** kısa ve düz cümle, aktif çatı, somut ve doğrulanabilir iddia, sayı/detay, satış dili yerine bilgi. Bir cümle bir iş yapsın.

**Kısıtlar:**
- Karakter sayısı orijinalin ±%15'i içinde kalsın — yoksa yerleşim (layout) kayar, bu UI'a dokunmak sayılır.
- Buton ve etiket metinlerinde uzunluk artışı **kesinlikle yok**.
- i18n anahtarlarını, yer tutucuları (`{name}`, `%s`), HTML etiketlerini ve link anchor'larını koru.
- SEO anahtar kelimeleri kaybolmasın; başlık hiyerarşisi (H1/H2) değişmesin.
- Marka adı, ürün adı, yasal metin, fiyat, tarih, iletişim bilgisi **hiç değişmez**.

Çıktı → `temizlik-raporu/03-metin-degisiklikleri.md`: her metin için dosya yolu, öncesi, sonrası, karakter sayısı. **Onay almadan uygulama.**

---

## Faz 7 — Doğrulama ve final raporu

- typecheck, lint, test, build → hepsi yeşil olmalı.
- Silinen medyaya kalan referans var mı? Tüm projede arama yap, bulunan her referansı raporla.
- Playwright/Cypress varsa: temizlik öncesi ve sonrası ana sayfaların ekran görüntüsünü karşılaştır, farkı raporla.
- Öncesi/sonrası tablo: bundle boyutu, toplam medya boyutu (MB), dosya sayısı, bağımlılık sayısı, satır sayısı.
- Çıktı → `temizlik-raporu/04-ozet.md` + geri alma talimatı (hangi commit neyi yaptı).

---

## Çalışma şekli

- **Plan modunda başla.** Her fazın planını göster, onayımı al, sonra uygula.
- **Tek seferde tüm fazları yapma.** Her fazın sonunda dur ve rapor ver.
- Emin olmadığın her noktada tahmin etme, sor.
- Bir şeyi silmenin gerekçesi "araç öyle dedi" olamaz; kanıtı raporda görmek istiyorum.
