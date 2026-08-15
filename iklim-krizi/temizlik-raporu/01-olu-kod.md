# 01 — Ölü Kod Analizi (Faz 2)

**Not:** Bu analiz salt tespit amaçlıdır; hiçbir dosya değiştirilmedi/silinmedi. Bu proje npm/build araçları içermediğinden (knip/ts-prune/depcheck kullanılamaz), tüm tarama manuel grep/read ile yapıldı.

## Özet

- **script.js**: Tamamı okundu (~45 üst düzey fonksiyon/sabit, 19 IIFE). Kullanılmayan fonksiyon, sabit, `console.log/debug/warn` kalıntısı veya yorum satırına alınmış devre dışı kod bloğu **bulunamadı** — dosya bu açıdan temiz.
- **style.css / index.html**: 256 benzersiz class token'ı + 10 id seçici çapraz kontrol edildi (statik `class="..."` + script.js'teki dinamik `classList`/template-literal kullanımı dahil).
- **Toplam şüpheli seçici: 15** (13 class + 1 id + 2 ilişkili `@keyframes`) → **SİL: 13, RİSKLİ: 2** (bir kümede birlikte ele alınıyor, aşağıda detay var).

---

## Bölüm 1 — script.js

| Sembol | Karar | Gerekçe | Kanıt |
|---|---|---|---|
| *(bulgu yok)* | DOKUNMA | Tüm üst düzey fonksiyon/sabit tanımları en az bir event listener/rAF döngüsü/observer callback'i üzerinden çağrılıyor. | Dosyanın tamamı satır satır izlendi. |
| `console.log/debug/warn` | DOKUNMA (yok) | Dosyada hiç `console.*` çağrısı yok. | `grep "console\." script.js` → 0 sonuç |
| Yorum satırına alınmış kod | DOKUNMA (yok) | Tüm `/* */` blokları Türkçe dokümantasyon metni, devre dışı kod değil. | Elle okuma |
| Kullanılmayan yerel değişken | DOKUNMA (yok) | Üstteki tüm sabitler (`ACTIVE_NODE_OFFSET_Y`, `STEP_MS` vb.) en az bir yerde kullanılıyor. | Elle izleme |

---

## Bölüm 2 — style.css / index.html Ölü Seçiciler

| Seçici | Karar | Gerekçe | Kanıt |
|---|---|---|---|
| `.sdg-hint`, `.sdg-hint-icon`, `.sdg-hint-dots`, `.sdg-hint-dot` (+ `:nth-child`, `theme-green` override'ları) | **SİL** | SDG orbit "ipucu" animasyonu — HTML'de yok, script.js'te referans yok. | `style.css:808-880,1247,1251`. `grep "sdg-hint" index.html script.js` → 0 |
| `@keyframes sdgHintFloat`, `@keyframes sdgDotPulse` | **SİL** | Yukarıdaki ölü class'ların `animation:` değeri; transitif olarak ölü. | `style.css:827-837, 868-880` |
| `.sdg-eyebrow` | **SİL** | HTML'de hiç kullanılmıyor. | `style.css:619`. `grep` → 0 |
| `.sdg-header` (+ mobil override) | **SİL** | SDG bölümü artık `.sdg-zone`/`.sdg-text-panel` kullanıyor. | `style.css:612-617,1069-1072`. `grep` → 0 |
| `.sdg-orbit-ring-outer` (+ 3 override) | **SİL** | Sadece `.sdg-orbit-ring` var, "outer" katmanı HTML'de yok. | `style.css:728-732,1021-1024,1089-1092,1238-1240`. `grep` → 0 |
| `.section-eyebrow` | **SİL** | Hiçbir section'da kullanılmıyor. | `style.css:1590`. `grep` → 0 |
| `#main-slider` (+ mobil override) | **SİL** | Hero artık `.hero-section`/`.hero-video`; eski carousel kalıntısı. | `style.css:398-401,403-407`. `grep` → 0 |
| `footer .col-md-4:not(:last-child)` / `:not(:first-child)` | **SİL** | Footer artık `col-md-7`+`col-md-5` (2 sütun); `col-md-4` hiç yok. | `style.css:337,341`. `grep "col-md-4" index.html` → 0 |
| `.auth-buttons .btn` (birleşik seçicinin bu kısmı) | **SİL** | `.auth-buttons` sarmalayıcısı sayfada yok; muhtemelen ana site şablonundan kalıntı. | `style.css:220-224,287-291`. `grep "auth-buttons"` → 0 |
| `.navbar .lang-switcher`, `.navbar .lang-option` (+ varyantlar) | **RİSKLİ** | Sadece yorum satırına alınmış TR/EN dil değiştirici HTML bloğu içinde geçiyor (`index.html:104-107,111-114`) — fiilen ölü ama kasıtlı bir "ileride eklenecek özellik" iskeleti gibi duruyor. Silmeden önce onay gerekli. | `index.html:104-114` (yorumlu). `style.css:226-278,308-327` |
| `.navbar .lang-switcher-mobile` | DOKUNMA | Sarmalayıcı `<div>` (satır 110) yorumlanmamış, gerçekten render ediliyor (içi boş). Yukarıdaki karara bağlı. | `index.html:110` |

---

## Bölüm 3 — Yanlış Pozitif Olabilecekler (bilinçli olarak DOKUNMA)

| Seçici | Gerekçe |
|---|---|
| `.action-step-icon-badge--green/blue/orange/emerald/lightgreen/purple/red/yellow/teal` | script.js'te `` `action-step-icon-badge--${step.color}` `` template literal ile dinamik üretiliyor (satır 1500); `individualSteps`/`societalSteps` veri kümesindeki tüm renkler CSS'teki varyantlarla eşleşiyor. |
| Bootstrap class'ları (`.active`,`.fade`,`.show`,`.collapse`,`.dropdown-*`,`.nav-link`,`.col-md-5/7` vb.) | Harici kütüphane + gerçekten kullanılıyor. |
| `fa-solid fa-*`, `bi bi-*` | Font Awesome / Bootstrap Icons — harici, style.css'te özel tanım yok. |
| `#liquidBgCanvas` | style.css'te sadece yorum METNİ içinde geçiyor, gerçek bir kural yok. |
| `.donut-*`,`.trend-*`,`.reel-*`,`.card-showcase-*`,`.expanded-card-*`,`.timeline-*`,`.bento-*`,`.indicator-*`,`.cause-*`,`.vital-sign-*` | Ya statik HTML'de ya da script.js'te `classList`/`createElement`+`className` ile dinamik kuruluyor; tek tek doğrulandı, hepsi canlı. |

---

## Yöntem Notu

256 class token'ı + 10 id, hem `index.html`'deki statik `class="..."` hem de `script.js`'in tam metnine (dinamik `classList`/template-literal kullanımı için) karşı çapraz kontrol edildi. Daha önce bu oturumda zaten temizlenen `.timeline-card-category/-top/-date/-dot` seçicileri de kontrol edildi — her üç dosyada 0 sonuç, temizlik tamamlanmış.

## Karar ve uygulama

Kullanıcı onayı: **13 SİL öğesi onaylandı**, **`.lang-switcher`/`.lang-option` kümesi de temizlenmesi yönünde karar verildi** (RİSKLİ değil, SİL).

Uygulanan değişiklikler:
- `style.css`: 13 ölü seçici (+ ilişkili `@keyframes sdgHintFloat`, `@keyframes sdgDotPulse`, tüm responsive/tema override'ları dahil) kaldırıldı. Toplam ~150 satır CSS silindi. Süslü parantez dengesi doğrulandı (543 açık = 543 kapalı).
- `index.html`: yorum satırına alınmış TR/EN dil değiştirici bloğu (satır 104-114) ve onun boş sarmalayıcı `<div>`'leri (`d-none d-lg-flex`, `lang-switcher-mobile`) kaldırıldı.
- `.navbar .btn` ve footer `col-md-4` kuralları, artık anlamsız olan `.auth-buttons`/`col-md-4` varyantlarından ayrıştırılıp sadece gerçekten kullanılan seçiciler bırakıldı.

**Doğrulama notu:** Bu ortamda çalışan bir Python/Playwright kurulumu bulunmadığından tarayıcı tabanlı ekran görüntüsü karşılaştırması yapılamadı. Doğrulama, silinen her seçicinin silmeden ÖNCE `index.html`+`script.js`'te sıfır eşleşme verdiğinin grep ile teyidine ve silme SONRASI aynı taramanın yine sıfır sonuç verdiğinin + CSS parantez dengesinin doğrulanmasına dayanıyor. Kullanıcının tarayıcıda hızlı bir görsel kontrol yapması önerilir (navbar, footer, SDG bölümü — bu üç alan değişikliklerden etkilendi).
