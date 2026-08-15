# 03 — Kod Optimizasyonu (Faz 5)

Kural: her optimizasyon için öncesi/sonrası ölçüm zorunlu; ölçemediğin optimizasyonu yapma. Bu proje npm/build araçları içermediğinden (webpack/vite yok), klasik "bundle boyutu" ölçümü yapılamıyor — ölçümler dosya/istek bazında yapıldı.

## Uygulanan: Eksik `preconnect` ipuçlarını tamamla

**Bulgu:** `index.html`'in `<head>`'inde render-blocking 5 harici CSS origin'i var (`fonts.googleapis.com`, `cdn.jsdelivr.net` [Bootstrap+Bootstrap Icons], `unpkg.com` [AOS], `cdnjs.cloudflare.com` [Font Awesome]) ama sadece 3'ü için `<link rel="preconnect">` tanımlıydı — `unpkg.com` ve `cdnjs.cloudflare.com` eksikti.

**Ölçüm (öncesi/sonrası — origin bazında, doğrudan sayılabilir):**

| | Öncesi | Sonrası |
|---|---|---|
| Render-blocking CSS origin sayısı | 5 | 5 |
| Preconnect edilen origin sayısı | 3 | **5** |
| Preconnect kapsama oranı | %60 | **%100** |

**Mekanizma:** `preconnect`, DNS çözümleme + TCP el sıkışması + TLS el sıkışmasını (HTTPS için) tarayıcının o origin'e ilk gerçek isteği göndermesinden ÖNCE, paralel olarak başlatır. Eksik olan 2 origin için tarayıcı bu üç adımı önceki gibi ancak stylesheet isteğini gördüğü anda sırayla başlatıyordu; artık diğer 3 origin'le aynı anda başlıyor. Bu sitede canlı ağ ölçümü (Lighthouse/WebPageTest) yapacak araç bu ortamda yok, bu yüzden gerçek milisaniye kazancı iddia edilmiyor — sadece mekanizma ve kapsama oranı raporlanıyor. `crossorigin` niteliği, sayfadaki mevcut yerleşik kalıpla tutarlı şekilde uygulandı: sadece gerçek kaynağın kendisi `crossorigin` modunda çekildiği durumlarda (`fonts.gstatic.com`) kullanılıyor; `unpkg.com`/`cdnjs.cloudflare.com` buradaki gibi düz `<link rel="stylesheet">` ile çekildiği için `crossorigin` eklenmedi (eklenirse eşleşmeyen bağlantı türü nedeniyle tarayıcı gereksiz ikinci bir bağlantı açabilir).

**Görsel etki:** Sıfır — sadece ağ zamanlamasını etkiler, DOM/CSS/JS çıktısı değişmedi.

**Dosya:** `index.html` (satır 10-15).

---

## Değerlendirildi, UYGULANMADI (gerekçeli)

| Optimizasyon | Neden uygulanmadı |
|---|---|
| `<script>` etiketlerine `defer` ekleme | 6 script etiketi zaten `</body>`'den hemen önce, dosyanın en sonunda — parser bu noktaya vardığında geri kalan HTML zaten ayrıştırılmış durumda. `defer` burada ölçülebilir bir kazanç sağlamaz (kazanç, script'in DOM ayrıştırmasının ORTASINDA bulunduğu durumlarda anlamlıdır). "Ölçemediğin optimizasyonu yapma" kuralı gereği atlandı. |
| CSS/JS minifikasyonu | Build adımı yok — minify edilmiş halini "dağıtım" (dist) olarak ayrı tutacak bir pipeline mevcut değil. `style.css`/`script.js` bu oturumda dahil olmak üzere elle düzenleniyor; minify edilmiş tek dosya üzerinde çalışmak gelecekteki düzenlemeleri ciddi şekilde zorlaştırır. Yeni build tooling eklemek şablon kuralına aykırı ("yeni kalıcı kütüphane ekleme yok"). Atlandı. |
| Kalan jpg/png görsellerini WebP/AVIF'e dönüştürme | Bu ortamda `cwebp`/`avifenc`/`ffmpeg` bulunamadı (Faz 4'te de doğrulandı) — dönüştürme yapılamadı, "piksel çıktısı gözle ayırt edilemez" garantisi doğrulanamayacağı için denenmedi. |
| Hero videosunun (34 MB `.mp4`) yeniden kodlanması | Aynı araç eksikliği — `ffmpeg` yok, öncesi/sonrası dosya boyutu+kalite karşılaştırması yapılamaz. |
| Tekrarlayan JS mantığını ortak fonksiyona çıkarma | `script.js` tamamı incelendi (Faz 2'de de okunmuştu) — 19 IIFE'nin her biri kendi DOM/state kapsamına sahip, aralarında birebir kopya-yapıştır mantık bulunamadı (ör. tab-switching benzer görünen 2-3 yerde var ama her biri farklı veri yapısı/DOM şekliyle çalışıyor, ortak soyutlama zorlaması "gereksiz abstraksiyon" riski taşır). |
| CSS'te tam yinelenen (duplicate) kural blokları | Otomatik taramayla (422 blok, tam metin karşılaştırması) sıfır tam-yinelenen blok bulundu — dosya bu açıdan zaten temiz, ekstra iş gerekmedi. |

## Dosya boyutu özeti (öncesi/sonrası — bu faz)

| Dosya | Faz 5 öncesi | Faz 5 sonrası |
|---|---|---|
| `index.html` | 1355 satır | 1357 satır (+2, preconnect satırları) |
| `style.css` | 3793 satır | 3793 satır (değişmedi) |
| `script.js` | 1886 satır | 1886 satır (değişmedi) |

## Doğrulama notu

Bu ortamda Python/Playwright/Lighthouse kurulu olmadığından gerçek ağ/performans ölçümü (ms cinsinden) alınamadı. Yapılan tek değişiklik (2 preconnect satırı) DOM yapısını, görünen içeriği veya CSS/JS davranışını etkilemez — riski sıfıra yakın. Kullanıcının tarayıcı DevTools → Network sekmesinde sayfayı yeniden yükleyip `unpkg.com`/`cdnjs.cloudflare.com` için bağlantı kurulum süresinin öne çekildiğini gözlemlemesi önerilir.
