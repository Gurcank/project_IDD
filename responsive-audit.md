# Responsive Denetim — iklim-krizi

> `responsive-plan.md`'nin Faz 0 çıktısı. Next.js/CSS-Modules varsayımıyla yazılmış plan, bu projede
> **statik HTML + tek `style.css` + tek `script.js` + Bootstrap 5** karşılığına çevrilerek uygulandı.
> React'e özgü adımlar (`app/layout.tsx`, `next/image`, `useEffect`+`ResizeObserver` bileşeni, CSS
> Modules token dosyası) yoktur; bunların vanilla eşdeğerleri kullanıldı.

## 0. Yöntem

Statik kod taraması (§4.1 komutlarının bu projeye uyarlanmış hâli) + **gerçek tarayıcıda ölçüm**
(headless Chrome/CDP ile 320/360/390/768/1024/1440/1920 px ve 844×390 yatay mod). "İyi göründü"
değil, her iddia `document.documentElement.scrollWidth` ve `getBoundingClientRect()` ile doğrulandı.

## 1. Üç soru (§4.3)

1. **Referans genişlik:** Sabit bir Figma genişliği yok — tasarım zaten `clamp()` ile akışkan.
   En sık geçen kapsayıcı üst sınırları: causes-section `1560px`, genel Bootstrap `.container`
   varsayılanı, hero içerik `800px`. Faz 2'deki yeni token katmanı 320→1440 aralığını temel aldı.
2. **Düzen deseni sayısı (4):**
   - **Akışkan `clamp()` bileşeni** — SDG orbit, hero tipografisi, `indicator-block` iç boşluğu
   - **İçerik kartı ızgarası** — `indicator-stats`, bento-grid, card-showcase (zaten `grid`/`flex`)
   - **Yerel kırpmalı dekoratif taşma** — ambient blob'lar, hero videosu, SDG dünya videosu, vital-signs ticker'ı (bkz. §3)
   - **Breakpoint'te tam yeniden kurulan blok** — navbar (Bootstrap collapse), sekmeler → dikey yığın (`@media max-width:767px`)
3. **En riskli bölüm:** Canvas/WebGL/3D **yok** (grep boş döndü) — plan'ın varsaydığı en riskli kategori bu projede mevcut değil. En karmaşık JS-güdümlü düzen SDG yörünge görselleştirmesi (`getRadius()` ile 17 düğümün konumunu her boyutta yeniden hesaplıyor); en yakın analog bu, ve zaten 250–560 px arası özel breakpoint'lere sahip.

## 2. Statik tarama bulguları

| Kontrol | Sonuç |
|---|---|
| Viewport meta | Var (`width=device-width, initial-scale=1.0`), `user-scalable=no`/`maximum-scale` **yok** (doğru) — ama `viewport-fit=cover` eksik |
| `box-sizing: border-box`, `-webkit-text-size-adjust` | Kodda yok ama **Bootstrap 5 Reboot zaten sağlıyor** (CDN CSS'i indirilip doğrulandı) — yinelemeye gerek yok |
| `overflow-wrap: break-word` | Sadece footer e-posta satırında var, genel değil |
| `img/video/canvas/svg{max-width:100%;height:auto}` genel kuralı | Yok — bileşen bazlı sabit boyutlar var ama genel güvenlik ağı eksik |
| Kırılma noktaları | 575/767/991/1100/1200 px + `orientation:landscape`/`max-height:500px` — **zaten içerik-bazlı**, cihaz adıyla değil (`.iphone` gibi isim yok) ✓ |
| `prefers-reduced-motion` | **6 ayrı yerde** kontrol ediliyor (script.js) + 3 yerde CSS'te — GSAP, sayaçlar, hero videosu, SDG videosu, smooth-scroll hepsi kapsanmış ✓ |
| `(hover: hover)` ile dokunmatik ayrımı | Var (script.js:1425) — plan'ın §9.3'te istediği tam olarak bu ✓ |
| SVG grafikler (donut/trend) | `aspect-ratio:1` ve `flex:1` kullanıyor, sabit px yükseklik yok ✓ zaten modern desen |
| Form / input / textarea | **Yok** — §10.3 (iOS zoom) bu sayfada uygulanamaz (N/A) |
| `outline: none` kullanımı | 1 yerde (`.reel`), hemen ardından `:focus-visible` ile telafi edilmiş — ihlal değil |
| `:focus-visible` kapsamı | Dot-nav, back-to-top, `.reel`'de var; genel/evrensel değil |

## 3. "Taşma" — gerçek mi, kasıtlı mı?

§7.4'teki teşhis betiği 320–1920 px arası her genişlikte 59–134 arası "taşan" eleman buluyor,
**ama `document.documentElement.scrollWidth > clientWidth` sekiz konfigürasyonun hiçbirinde
doğru değil** — yani sayfanın kendisi hiçbir genişlikte yatay kaydırma gerektirmiyor
(WCAG 1.4.10 tabanı şimdiden geçiyor). Betiğin bulduğu "taşma", ata elementin kendi
`overflow:hidden`'ı ile zaten kırpılan, kasıtlı tasarım parçaları:

| Element | Neden taşıyor | Yerel kırpma var mı |
|---|---|---|
| `.ambient-blob-*` | Dekoratif bulanık daireler, kadraj dışına taşacak şekilde tasarlanmış | `.ambient-bg{overflow:hidden}` ✓ |
| `#heroVideo` | `object-fit:cover` benzeri kadraj için videodan taşırılıyor | `.hero-section{overflow:hidden}` ✓ |
| `.sdg-center-gif` | Bu oturumda eklenen zoom-crop (video kaynağındaki beyaz boşluğu kırpmak için `scale(2.05)`) | `.sdg-center-core{overflow:hidden}` ✓ |
| `.hover-ticker-track` + kartları | Sonsuz kayan istatistik şeridi, tekrar için 2× genişlikte | `.hover-ticker{overflow:hidden}` ✓ |

Bu, `html{overflow-x:hidden}` ile gerçek içeriği gizlemekten (§12'nin yasakladığı) **kategorik
olarak farklı**: her taşan eleman kendi doğrudan ebeveyninde kırpılıyor, body seviyesindeki
`overflow-x:clip`'e (zaten var, `style.css:45`) güvenmiyor. Yani mevcut `overflow-x:clip` bir
"kusuru gizleme" değil, gerçekten hiçbir gerçek içeriğin kırpılmadığının ikinci bir garantisi.
**Sonuç: Faz 3'ün varsaydığı "absolute + px'ten Grid'e acil dönüşüm" ihtiyacı bu projede yok.**

## 4. Gerçek, somut boşluklar (bu oturumda düzeltilecek)

1. **Hero mobil breakpoint'i `100svh` düzeltmesini kaybediyor.** Taban kural (`.hero-section`)
   `height:100vh` sonrası `height:100svh` ile üzerine yazıyor (doğru, adres çubuğu sorunu
   çözülmüş) — ama `@media (max-width:767px)` içindeki override sadece `height:100vh` yazıp
   `100svh`'yi tekrar etmiyor, yani **tam da sorunun en çok yaşandığı mobil genişlikte** eski
   hatalı davranışa geri dönülüyor. Yorum da yanlış yönlendiriyor ("100vh yapıldı" — oysa 100vh
   asıl sorunun kendisi).
2. Genel `img,picture,video,canvas,svg,iframe{max-width:100%;height:auto}` güvenlik ağı yok.
3. `overflow-wrap: break-word` sadece footer'da, genel metin etiketlerinde değil.
4. `viewport-fit=cover` eksik (çentikli ekran güvenli alanı için önkoşul).
5. Footer sosyal medya ikonları (`fs-4` + `me-3`) **22×32 px** ölçülüyor — WCAG 2.5.8 (AA)
   24×24 px tabanının **altında** ve aralarındaki 16 px boşluk da 24 px istisnasını karşılamıyor.
   (Bir önceki oturumda footer "birebir aynı" kopyalanırken ortaya çıktı.)
6. Navbar hamburger butonu `aria-controls`/`aria-expanded`/`aria-label` kaybetmiş (aynı "birebir
   kopya" isteğinin yan etkisi) — §10.5'in ilk maddesi doğrudan bunu istiyor. Görsel etkisi sıfır,
   düzeltilebilir.
7. Merkezi bir akışkan tipografi/aralık token katmanı (§6) yok — bileşen başına ad-hoc `clamp()`
   var (ve iyi çalışıyor), ama Faz 2'nin istediği tek-kaynak `--step-*`/`--space-*` sistemi yok.

## 5. Kapsam dışı bırakılanlar (ve neden)

- **Faz 5 (Canvas/3D resize)** — proje canvas/WebGL kullanmıyor, uygulanamaz.
- **§10.3 (iOS input zoom)** — sayfada `<input>/<select>/<textarea>` yok, uygulanamaz.
- **Faz 3'ün "absolute → Grid" acil dönüşümü** — §3'te kanıtlandığı gibi gerçek bir taşma yok;
  mevcut yerel-kırpma deseni zaten doğru. Zorla Grid'e çevirmek "değiştirilmesi istenmeyen kodu
  yol üstünde düzeltmek" olurdu (§12, son madde).
- **3900 satırlık `style.css`'in tamamını yeni token sistemine geçirmek** — riski ödülünden
  yüksek, tek oturumda "tek değişiklik tek konu" ilkesini ihlal eder (§12). Token katmanı
  **altyapı olarak eklenir**, mevcut çalışan `clamp()` değerleri tek tek değiştirilmez.
- **`next/image` `sizes` / çoklu-çözünürlük görsel üretimi (§8.3)** — Next.js'e özgü, bu statik
  sitede karşılığı yok; görsel yeniden kodlama (yeni WebP boyutları üretmek) bu oturumun görsel
  işleme araçları dışında — ayrı bir öneri olarak not edildi, uygulanmadı.

## 6. Faz 7 — Doğrulama sonuçları

Uygulanan değişikliklerden **önce** ve **sonra**, aynı 8 genişlikte (320/360/390/768/1024/1440/1920 px
+ 844×390 yatay) §7.4 betiği yeniden koşturuldu:

| Genişlik | Önce: yatay scroll var mı | Sonra: yatay scroll var mı |
|---|---|---|
| 320–1920 px + yatay mod (8 konfigürasyon) | Hiçbirinde yok | Hiçbirinde yok (değişmedi) |

Ayrıca doğrulandı:

- **Footer sosyal ikonları:** `::after{inset:-8px}` uygulandıktan sonra efektif dokunma alanı
  ~37.5×48.3 px (`getComputedStyle` ile ölçüldü) — 24×24 tabanının üstünde, 44×44'e yakın.
  Görünen ikon boyutu/rengi/boşluğu değişmedi.
- **Navbar hamburger:** `aria-controls="navbarNav"`, `aria-expanded="false"`,
  `aria-label="Menüyü aç/kapat"` DOM'da mevcut (`document.querySelector` ile doğrulandı).
- **Konsol hatası:** Hiçbir test genişliğinde JS hatası yok.
- **Yanlış alarm — not düşülmesi gereken:** 320 px'te causes-section başlığının
  (`.cause-fullwidth-heading`) ilk ekran görüntüsü metni kırpılmış gösterdi; bu, GSAP giriş
  animasyonunun/Lenis kaydırmasının henüz oturmadığı **geçici bir kare** çıktı — doğrudan
  `getBoundingClientRect()` ölçümü (`left:0, right:320`, `white-space:normal` aktif) sıfır taşma
  gösterdi. Zaten `@media (max-width:1200px)` içinde bu tam senaryo için önceden yazılmış bir
  düzeltme var (yorumu: "tablet ve küçük laptop genişliklerinde de tek satıra sığmayıp taşıyordu").
  Bu oturumdaki hiçbir değişiklik bu bileşene dokunmadı.

## 6b. Ek düzeltme — §6'daki "yanlış alarm" değerlendirmesi eksikti

Kullanıcı bir sonraki oturumda "İklim Krizinin Sebebi başlığı ekrana sığmıyor" diye bildirdi.
320 px'teki "yanlış alarm" tespiti (yukarıda) doğruydu, ama bu elementin **1200 px ve üzerindeki
gerçek genişliğini hiç doğrudan ölçmemiştim** — Faz 7'nin 8 genişlik taramasında 1440/1920 px de
vardı ve bu eleman aslında listede yer alıyordu, ama 88–134 toplam taşma arasında konsola sadece
ilk 25'i yazdırıp gözle kontrol ettiğimden gözden kaçmış. Kullanıcının raporu üzerine doğrudan
ölçünce: **1200–1920 px arasının tamamında, tam olarak `--scrollbar-width`'in yarısı kadar
(~8px) sabit bir taşma** bulundu — klasik `width:100vw` + `left:50%`/`margin-left:-50vw`
"tam genişliğe taşma" tekniğinin, `100vw`'nin dikey scrollbar'ı sayıp `%`'nin saymamasından
kaynaklanan bilinen kusuru. Body'deki `overflow-x:clip` bunu scrollbar olarak göstermiyordu ama
başlığın kenarlarını sessizce kırpıyordu.

**Düzeltme:** `script.js`'e gerçek scrollbar genişliğini ölçüp `--scrollbar-width` CSS
değişkenine yazan küçük bir IIFE eklendi (yükte + resize'da); `.cause-fullwidth-header`'ın
`width` ve `margin-left` hesabı bu değişkenle telafi edildi. 320/768/1024/1200/1201/1366/1440/
1536/1600/1920 px'in **tamamında** doğrulandı: `left:0, right:clientWidth` tam olarak eşleşiyor,
hiçbir kenarda taşma kalmadı.

**Ders:** "İlk 25'e bakıp kalanı aynı 4 kategoriye ait varsaydım" yeterli doğrulama değildi;
tam listeyi (veya en azından her genişlikte yeni/beklenmeyen bir sınıf adı var mı diye) kontrol
etmek gerekiyordu. Bu oturumda düzeltildi.

## 7. Bu oturumda uygulanan faz sırası

Faz 0 (bu dosya) → Faz 1 (viewport-fit, genel medya/metin güvenlik ağı) → Faz 2 (token katmanı,
altyapı olarak) → Faz 4 (hero `100svh` düzeltmesi) → Faz 6 (dokunma hedefi + navbar ARIA) →
Faz 7 (320–1920 px + yatay mod yeniden ölçüm, öncesi/sonrası karşılaştırma).
Faz 3 ve 5 yukarıdaki gerekçeyle atlandı.
