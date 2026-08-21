# Responsive Dönüşüm Planı — iklimkrizi

> **Bu dosya nedir:** Claude Code'un her oturumda okuyup uygulayacağı çalışma planı ve kural seti.
> Tek seferde çalıştırılacak bir betik değil; fazlara bölünmüş, her fazın sonunda doğrulanan bir dönüşüm.
>
> **Nereye koy:** `docs/responsive-plan.md`
> **Claude Code'un her seferinde görmesi için:** Projede `CLAUDE.md` varsa şu satırı ekle:
> `Responsive işleri için önce docs/responsive-plan.md dosyasını oku.`

---

## 1. Proje bağlamı

| Konu | Durum |
|---|---|
| Framework | Next.js |
| Stil | CSS Modules / styled-components (**Tailwind yok**) |
| Sayfa tipi | Statik, görsel ağırlıklı |
| Baskın yapılar | Tam ekran hero + büyük görseller · Canvas/3D/grafik · Sabit `px` ölçüler + `position: absolute` |
| Tasarım esnekliği | Olabildiğince korunacak; teknik olarak mümkün değilse değiştirilebilir |

**Not (bir kez söylenip geçilecek):** `project-rules` skill'i "aksi belli olmadıkça Tailwind varsay" diyor. Bu projede aksi belli: CSS Modules kullanılıyor. Dolayısıyla `tailwind.config` yerine **CSS custom property (CSS değişkeni — `--isim` şeklinde tanımlanan, tema değeri taşıyan CSS özelliği)** katmanı kuruyoruz. `project-rules`'un öncelik sırasına göre mevcut kod deseni kazanır; geri kalan tüm kuralları (isimlendirme, TypeScript, erişilebilirlik, `useEffect` disiplini) aynen geçerli.

---

## 2. Baştan söylenmesi gereken şey

`position: absolute` + sabit `px` ile kurulmuş bir düzen, **320 px genişlikte birebir korunamaz.** Bunu iki yoldan biriyle "çözmüş" gibi yapabilirsin ve ikisi de yanlıştır:

1. **Tüm sayfayı `transform: scale()` ile küçültmek.** Tasarım korunur ama 16 px metin mobilde 4 px olur, kullanıcı zoom yapamaz, dokunma hedefleri parmak boyutunun altına düşer. WCAG 1.4.10 (Reflow) doğrudan ihlal edilir.
2. **`html { overflow-x: hidden }` yazmak.** Taşma gizlenir, kaybolmaz. İçeriğin bir kısmı erişilemez hale gelir.

Doğru yaklaşım, sayfayı ikiye ayırmak:

| Bölüm türü | Strateji | Neden |
|---|---|---|
| Metin taşıyan içerik blokları | **Akışa çevir** (Grid/Flex) | Metin okunabilir kalmalı; ölçeklenemez |
| Yazısız dekoratif kompozisyon (üst üste binen görseller, illüstrasyon) | **Oransal ölçekle** (`aspect-ratio` + `%` konum) | Kompozisyonun kendisi tasarımın parçası; oranı korunmalı |
| Hero (arka plan görsel + üstünde metin) | **Karma**: arka plan ölçeklenir, metin akışa girer | İkisi farklı işler yapıyor |
| Canvas / 3D / grafik | **Kapsayıcıyı ölç, canvas'ı yeniden boyutlandır** | CSS ile germek görüntüyü bulanıklaştırır |
| Navigasyon | **Tamamen yeniden kur** | Yatay menü mobilde çalışmaz, taviz yok |

Yani cevap: **tasarımın büyük kısmı korunur, düzenin kendisi değişir.** Bu ikisi aynı şey değil — renk, tipografi, görsel dil, ritim aynen kalır; kutuların nereye oturduğu değişir.

---

## 3. Kabul kriterleri

Faz sonlarında bunlar ölçülecek. "Bence iyi göründü" kabul değil.

- [ ] **320 CSS px** genişlikte hiçbir sayfada yatay kaydırma yok — WCAG 2.2 SC 1.4.10 (Reflow), Level AA
- [ ] **%400 zoom**'da (1280×1024 CSS px eşdeğeri) içerik erişilebilir kalıyor
- [ ] Tüm tıklanabilir/dokunulabilir hedefler **≥ 24×24 CSS px** — WCAG 2.2 SC 2.5.8, Level AA
- [ ] Birincil butonlar ve mobil navigasyon **≥ 44×44 CSS px** (SC 2.5.5, AAA — zorunlu değil ama mobilde pratik gereklilik)
- [ ] Form input'larında `font-size ≥ 16px` (iOS Safari otomatik zoom'u engellemek için)
- [ ] Hero'da mobil adres çubuğu açılıp kapanırken içerik kırpılmıyor
- [ ] Canvas/3D bölümleri düşük güçlü mobil cihazda çalışıyor veya statik alternatife düşüyor
- [ ] `prefers-reduced-motion: reduce` seçili kullanıcıda hareket duruyor
- [ ] Lighthouse: "viewport meta tag" ve "content sized correctly for viewport" denetimleri geçiyor
- [ ] CLS (Cumulative Layout Shift — sayfa yüklenirken içeriğin zıplaması) < 0.1

---

## 4. Faz 0 — Envanter

**Kod yazma. Önce sayfayı tanı.** Çıktı: `docs/responsive-audit.md`.

### 4.1 Tarama komutları

```bash
# 1) Sabit px ölçüler (3+ haneli — 100px altı genelde padding/border, sorun değil)
rg -n -g '*.css' -g '*.scss' -g '*.tsx' -g '*.ts' \
   '(width|height|min-width|max-width|min-height|top|left|right|bottom):\s*[0-9]{3,}px'

# 2) Absolute / fixed konumlandırma
rg -n -g '*.css' -g '*.scss' -g '*.tsx' 'position:\s*[\x27"]?(absolute|fixed)'

# 3) vh kullanımları (mobil adres çubuğu sorunu adayları)
rg -n -g '*.css' -g '*.scss' -g '*.tsx' '[0-9]+vh'

# 4) next/image yerine ham <img>
rg -n -g '*.tsx' '<img\s'

# 5) Mevcut medya sorguları — hangi kırılma noktaları zaten var?
rg -n -g '*.css' -g '*.scss' -g '*.tsx' '@media'

# 6) Canvas / WebGL / grafik kütüphaneleri
rg -n -g '*.tsx' -g '*.ts' '(getContext|three|@react-three|d3|chart\.js|mapbox|leaflet)'

# 7) Viewport meta zaten var mı?
rg -n 'viewport' app/layout.tsx pages/_app.tsx pages/_document.tsx 2>/dev/null
```

### 4.2 Denetim dosyasının formatı

`docs/responsive-audit.md` içine, her bölüm için tek satır:

| Bölüm / Component | Dosya | Düzen tipi | Sabit px sayısı | Strateji (§2 tablosu) | Zorluk | Sıra |
|---|---|---|---|---|---|---|
| Hero | `components/Hero/Hero.tsx` | absolute | 12 | Karma | Yüksek | 1 |
| … | | | | | | |

### 4.3 Cevaplanması gereken üç soru

1. **Tasarımın referans genişliği kaç px?** (En sık geçen container genişliği: 1440? 1920? 1280?) Bu sayı, oransal dönüşümlerin paydası olacak — not et.
2. **Kaç farklı düzen deseni var?** 20 component olabilir ama muhtemelen 4–5 desen tekrarlanıyor. Deseni çöz, 20 kere aynı işi yapma.
3. **Hangi bölüm en riskli?** Genelde canvas/3D. En son ona dokun, önce kolay kazanımları topla.

**Faz 0 bitmeden Faz 1'e geçme.** Denetim dosyası olmadan yapılan dönüşüm, tahmin üstüne tahmin olur.

---

## 5. Faz 1 — Temel

### 5.1 Viewport meta etiketi

Bu olmadan yazdığın hiçbir medya sorgusu mobilde çalışmaz. Mobil tarayıcı, etiket yoksa sayfayı ~980 px genişlikte varsayıp uzaklaştırarak gösterir.

**App Router** (`app/layout.tsx`):

```ts
import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover', // çentikli ekranlarda env(safe-area-inset-*) için gerekli
};
```

**Pages Router** (`pages/_app.tsx` — `_document.tsx` değil):

```tsx
<Head>
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
</Head>
```

**Asla yazma:** `maximum-scale=1`, `user-scalable=no`. Kullanıcının zoom yapmasını engeller; görme güçlüğü olan kullanıcı için site kullanılamaz hale gelir.

### 5.2 Global temel

```css
/* app/styles/base.css */
*, *::before, *::after { box-sizing: border-box; }

html { -webkit-text-size-adjust: 100%; } /* iOS'ta yatayda metni kendiliğinden büyütmesini engeller */

body { margin: 0; }

/* Medya asla kapsayıcısını taşırmaz */
img, picture, video, canvas, svg, iframe {
  display: block;
  max-width: 100%;
  height: auto;
}

/* Uzun URL / kelime taşmalarını kes */
p, h1, h2, h3, h4, li, a { overflow-wrap: break-word; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

`height: auto` satırı önemli: `<img width height>` niteliklerini koyduğunda (koymalısın, CLS'yi önlüyor) `max-width: 100%` tek başına oranı bozar.

### 5.3 Kırılma noktaları — cihaza göre değil, içeriğe göre

web.dev'in açık uyarısı: kırılma noktalarını cihaz sınıflarına, marka adına veya işletim sistemine göre tanımlama; bakımı imkânsızlaşır. Düzenin ne zaman bozulduğuna bak.

`rem` cinsinden tanımla — kullanıcı tarayıcı yazı tipi boyutunu büyüttüğünde kırılma noktaları da kayar:

```css
/* app/styles/breakpoints.css — başlangıç seti, Faz 0 bulgularına göre revize edilecek */
/* 40rem = 640px, 48rem = 768px, 64rem = 1024px, 80rem = 1280px */
```

styled-components kullanıyorsan tek yerde tut:

```ts
// lib/breakpoints.ts
export const bp = {
  sm: '40rem',
  md: '48rem',
  lg: '64rem',
  xl: '80rem',
} as const;

export const above = (key: keyof typeof bp) => `@media (min-width: ${bp[key]})`;
```

**Mobile first:** temel stiller küçük ekran için yazılır, `min-width` ile yukarı doğru katman eklenir. `max-width` ile aşağı doğru istisna yazmak, üst üste binen ve birbirini ezen kurallar üretir.

---

## 6. Faz 2 — Akışkan ölçek sistemi

Kırılma noktasında zıplayan yazı tipi yerine, genişlikle birlikte sürekli değişen bir ölçek. Bu, **sabit px'ten kurtulmanın en hızlı yolu.**

### 6.1 Formül

`minPx` → `maxPx` arası, `minVw` → `maxVw` genişliklerinde:

```
eğim     = (maxPx - minPx) / (maxVw - minVw)
kesişim  = minPx - eğim × minVw

clamp( minPx/16 rem,  kesişim/16 rem + eğim×100 vw,  maxPx/16 rem )
```

**Kritik kural:** `vw` tek başına asla kullanılmaz. MDN'in açık uyarısı — sadece `vw` ile ayarlanan metni kullanıcı zoom yapamaz, çünkü boyut yalnızca görüntü alanına bağlı kalır. `rem` ile toplayınca zoom geri gelir.

### 6.2 Hesaplanmış örnekler (320 px → 1440 px)

```css
/* app/styles/tokens.css */
:root {
  /* Tipografi */
  --step--1: clamp(0.875rem, 0.839rem + 0.179vw, 1rem);      /* 14 → 16 */
  --step-0:  clamp(1rem,     0.929rem + 0.357vw, 1.25rem);   /* 16 → 20 */
  --step-1:  clamp(1.25rem,  1.107rem + 0.714vw, 1.75rem);   /* 20 → 28 */
  --step-2:  clamp(1.5rem,   1.143rem + 1.786vw, 2.75rem);   /* 24 → 44 */
  --step-3:  clamp(2rem,     1.286rem + 3.571vw, 4.5rem);    /* 32 → 72 */

  /* Aralık */
  --space-xs: clamp(0.5rem,  0.429rem + 0.357vw, 0.75rem);   /*  8 → 12 */
  --space-s:  clamp(1rem,    0.857rem + 0.714vw, 1.5rem);    /* 16 → 24 */
  --space-m:  clamp(1.5rem,  1.143rem + 1.786vw, 2.75rem);   /* 24 → 44 */
  --space-l:  clamp(2.5rem,  1.786rem + 3.571vw, 5rem);      /* 40 → 80 */
  --space-xl: clamp(4rem,    2.571rem + 7.143vw, 9rem);      /* 64 → 144 */

  /* Ölçü */
  --measure: 65ch;              /* okuma sütunu üst sınırı */
  --container: 75rem;           /* 1200px */
  --gutter: var(--space-s);
}
```

Doğrulama: `--step-0` 320 px'te `0.929×16 + 0.00357×320 = 14.86 + 1.14 = 16px` ✓, 1440 px'te `14.86 + 5.14 = 20px` ✓.

Yeni değer üretmek için [utopia.fyi/type/calculator](https://utopia.fyi/type/calculator) kullanılabilir; formül aynı.

### 6.3 Kapsayıcı deseni

```css
.container {
  width: 100%;
  max-width: var(--container);
  margin-inline: auto;
  padding-inline: var(--gutter);
}
```

Sayfada `--gutter` dışında yatay padding yazma. Tek kaynak.

---

## 7. Faz 3 — Absolute düzenin dönüştürülmesi

Bu fazın tamamı **§2'deki karar tablosuna** göre yürür.

### 7.1 Dekoratif kompozisyon → oransal ölçekleme

Kompozisyonun kendisi tasarımın parçasıysa (üst üste binen görseller, serbest yerleşim illüstrasyon), `px` değerlerini yüzdeye çevir. Mekanik bir dönüşüm, güvenle otomatikleştirilebilir:

```css
/* ÖNCE */
.scene { position: relative; width: 1440px; height: 900px; }
.leaf  { position: absolute; left: 320px; top: 180px; width: 240px; }

/* SONRA */
.scene {
  position: relative;
  width: 100%;
  aspect-ratio: 1440 / 900;   /* oran korunur, yükseklik kendiliğinden gelir */
}
.leaf {
  position: absolute;
  left:  22.222%;   /*  320 / 1440 */
  top:   20%;       /*  180 /  900 */
  width: 16.667%;   /*  240 / 1440 */
}
```

**Sınır:** bu yaklaşım yaklaşık **600 px'e kadar** iyi çalışır. Altında ya kompozisyon parçalanır ya da `aspect-ratio` mobil için ayrı verilir:

```css
@media (max-width: 40rem) {
  .scene { aspect-ratio: 3 / 4; }  /* dikey ekrana uygun kadraj */
  .leaf  { left: 8%; width: 34%; } /* kompozisyon mobil için yeniden kurgulanır */
}
```

Bu, tasarımın "değişmesi gereken" kısmı. Kaçınılmaz — ama renk, görsel ve tipografi aynen kalır.

### 7.2 İçerik blokları → Grid

```css
/* ÖNCE: absolute üç sütun */
.card-1 { position: absolute; left: 0;     width: 400px; }
.card-2 { position: absolute; left: 440px; width: 400px; }
.card-3 { position: absolute; left: 880px; width: 400px; }

/* SONRA: medya sorgusu bile gerekmeyen otomatik ızgara */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(18rem, 100%), 1fr));
  gap: var(--space-m);
}
```

`min(18rem, 100%)` kısmı önemli: `minmax(18rem, 1fr)` tek başına, 288 px'ten dar ekranda taşma yapar.

### 7.3 Container queries — bileşen kendi genişliğine baksın

Aynı kart hem tam genişlikte hem dar bir sütunda kullanılıyorsa, medya sorgusu (sayfa genişliğine bakar) yanlış aracı. **Container query (kapsayıcı sorgusu — bileşenin kendi kapsayıcısının genişliğine göre stil uygular)** doğru aracı:

```css
.card-wrap { container-type: inline-size; container-name: card; }

.card { display: grid; gap: var(--space-s); }

@container card (min-width: 30rem) {
  .card { grid-template-columns: 1fr 2fr; align-items: center; }
}
```

Tarayıcı desteği: Chrome 105, Safari 16, Firefox 110 — 2023 başından beri tüm güncel tarayıcılarda. Fallback gerekmiyor.

### 7.4 Taşma teşhisi

Her fazın sonunda DevTools konsolunda çalıştır:

```js
const w = document.documentElement.clientWidth;
[...document.querySelectorAll('*')]
  .map(el => ({ el, r: el.getBoundingClientRect() }))
  .filter(({ r }) => r.right > w + 1 || r.left < -1)
  .forEach(({ el, r }) => {
    console.log(Math.round(r.left), Math.round(r.right), el);
    el.style.outline = '2px solid magenta';
  });
```

Bulduğun her taşmayı **kaynağında** düzelt. `overflow-x: hidden` ile örtme.

---

## 8. Faz 4 — Hero ve büyük görseller

### 8.1 `100vh` sorunu

Mobil tarayıcıda `100vh`, adres çubuğu **gizliyken**ki yüksekliktir. Çubuk görünürken içeriğin altı kesilir.

```css
.hero {
  min-height: 100vh;   /* eski tarayıcı yedeği */
  min-height: 100svh;  /* small viewport height — çubuk görünürkenki yükseklik */
}
```

- `svh` — en küçük hâl. Hero için **bunu kullan**: hiçbir durumda içerik kesilmez.
- `dvh` — dinamik, kaydırırken değişir. Yükseklik değiştikçe düzen zıplar; hero'da kullanma.
- `lvh` — en büyük hâl, `100vh` ile aynı sorunu taşır.

`min-height` kullan, `height` değil. İçerik uzarsa hero büyüyebilmeli.

### 8.2 Çentik / gesture bar

`viewport-fit=cover` ayarlandıysa:

```css
.hero__content {
  padding-block-end: max(var(--space-l), env(safe-area-inset-bottom));
  padding-inline: max(var(--gutter), env(safe-area-inset-left), env(safe-area-inset-right));
}
```

### 8.3 `next/image` ve `sizes`

En sık yapılan hata: `sizes` yazmamak veya yanlış yazmak. `sizes` yoksa Next.js `100vw` varsayar; 320 px'lik bir kart için 2000 px'lik görsel indirilir.

```tsx
// Hero — tam genişlik, LCP adayı
<Image
  src="/hero.jpg"
  alt=""                       // dekoratifse boş alt; anlam taşıyorsa açıklama yaz
  fill
  priority                     // LCP görselinde şart, sadece bir tanesinde
  sizes="100vw"
  quality={80}
  style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
/>

// Izgara içindeki kart görseli
<Image
  src={card.image}
  alt={card.title}
  width={800}
  height={600}
  sizes="(max-width: 40rem) 100vw, (max-width: 64rem) 50vw, 33vw"
  placeholder="blur"
  blurDataURL={card.blurDataURL}
/>
```

`sizes` değerleri **§5.3'teki kırılma noktalarıyla aynı olmalı.** Ayrışırsa yanlış boyut indirilir.

### 8.4 Sanat yönü (art direction)

Yatay bir hero görseli dikey telefon ekranında işe yaramıyorsa — kadraj değişmeli, ölçek değil:

```tsx
<picture>
  <source media="(max-width: 40rem)" srcSet="/hero-portrait.avif" type="image/avif" />
  <source media="(max-width: 40rem)" srcSet="/hero-portrait.webp" type="image/webp" />
  <source srcSet="/hero-wide.avif" type="image/avif" />
  <img src="/hero-wide.jpg" alt="" width={1920} height={1080} />
</picture>
```

`next/image` bunu doğrudan desteklemez; sanat yönü gerekiyorsa ham `<picture>` doğru seçim. `project-rules` "ham `<img>` kullanma" diyor — bu, kuralın haklı istisnası, ve nedeni koda bir satır yorum olarak yazılmalı.

---

## 9. Faz 5 — Canvas / 3D / grafik

En riskli bölüm. **En son buraya dokun.**

### 9.1 Canvas boyutlandırma

Canvas'ın iki boyutu var: CSS boyutu (ekranda kapladığı yer) ve buffer boyutu (`canvas.width/height` — gerçek piksel sayısı). Sadece CSS'i değiştirirsen görüntü gerilir ve bulanıklaşır.

```ts
function resizeCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
  // 3x ekranda dpr sınırlanmazsa 9 kat piksel işlenir — düşük güçlü telefonda FPS çöker
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const { width, height } = canvas.getBoundingClientRect();

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
```

```ts
// ResizeObserver, React dışındaki bir sisteme (tarayıcının layout motoru) senkronizasyon.
useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const observer = new ResizeObserver(() => resizeCanvas(canvas, ctx));
  observer.observe(canvas);

  return () => observer.disconnect();
}, []);
```

`window.addEventListener('resize')` değil `ResizeObserver` — kapsayıcı, pencere boyutu değişmeden de (yan panel açılması, font yüklenmesi) boyut değiştirebilir. Cleanup zorunlu.

### 9.2 Mobil düşüş stratejisi

Bir 3D sahne masaüstünde 60 FPS veriyorsa, orta seviye bir telefonda 12 FPS verip pili bitirir. Karar ağacı:

```ts
const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isLowEnd = (navigator.hardwareConcurrency ?? 4) <= 4;
```

| Durum | Yapılacak |
|---|---|
| `prefers-reduced-motion` | Animasyonu durdur, ilk kareyi statik göster |
| Dar ekran + zayıf cihaz | Statik `<Image>` fallback (sahnenin ekran görüntüsü) |
| Dar ekran + yeterli cihaz | Parçacık/poligon sayısını azalt, `dpr` sınırını 1.5'e çek |
| Geniş ekran | Tam sahne |

`prefers-reduced-motion` kontrolü opsiyonel değil — `project-rules`'un erişilebilirlik tabanında zorunlu.

### 9.3 Grafik / harita

- Grafiklerde kapsayıcıya `aspect-ratio` ver, sabit yükseklik verme.
- Eksen etiketleri dar ekranda üst üste biniyorsa: etiket sayısını azalt veya döndür — **veriyi gizleme.** web.dev'in uyarısı: "ekrana sığmadığı için içeriği gizleme"; ekran boyutu kullanıcının neyi görmek istediğini tahmin etmez.
- Hover ile açılan tooltip mobilde çalışmaz. `@media (hover: hover)` ile ayır, dokunmatikte tap ile açılan bir alternatif ver.

---

## 10. Faz 6 — Tipografi, dokunma, erişilebilirlik

### 10.1 Okuma sütunu

```css
.prose { max-width: var(--measure); }  /* 65ch */
```

Klasik okunabilirlik teorisi satır başına 70–80 karakter önerir. Bunu bir başlangıç noktası olarak al, kesin bir kural olarak değil — deneysel dayanağı zayıf (bkz. §12, kanıt düzeyi tablosu).

### 10.2 Dokunma hedefleri

```css
.btn, .nav a, .icon-btn {
  min-block-size: 44px;
  min-inline-size: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Görsel olarak küçük ikon, dokunma alanı büyük */
.icon-btn {
  position: relative;
  padding: 0;
}
.icon-btn::after {
  content: '';
  position: absolute;
  inset: -12px;   /* dokunma alanını görünür kutunun dışına taşır */
}
```

WCAG 2.2 SC 2.5.8 (AA) tabanı 24×24 CSS px. 44×44 ise SC 2.5.5 (AAA) — zorunlu değil, ama mobilde pratikte gereken değer. Yan yana duran küçük hedefler için alternatif: aralarında en az 24 px boşluk bırakmak da kriteri karşılıyor.

### 10.3 iOS input zoom'u

```css
input, select, textarea { font-size: 16px; }
```

16 px'in altındaki input'a odaklanıldığında iOS Safari sayfayı otomatik yakınlaştırır ve geri çıkmaz. `user-scalable=no` ile çözme — bu, çözüm değil erişilebilirlik ihlali.

### 10.4 Odak halkası

```css
:focus-visible {
  outline: 3px solid var(--focus-color);
  outline-offset: 2px;
}
```

`outline: none` yazıp yerine bir şey koymamak, klavye kullanıcısını sayfada kör bırakır.

### 10.5 Mobil navigasyon

Yatay menü mobilde çalışmaz. Hamburger menü yazarken:

- `<button aria-expanded aria-controls>` — `<div onClick>` değil
- Açıkken `Escape` kapatır
- Açıkken odak menü içinde kalır (focus trap)
- Açıkken arkadaki gövde kaymaz: `body { overflow: hidden }` + kaydırma çubuğu genişliği telafisi
- Kapanınca odak, açan butona geri döner

---

## 11. Faz 7 — Doğrulama

Her fazın sonunda, **iddia etmeden önce çalıştır.**

### 11.1 Genişlikler

| Genişlik | Neyi test ediyor |
|---|---|
| 320 px | WCAG 1.4.10 tabanı — en dar gerçekçi cihaz |
| 360 px | Yaygın Android |
| 390 px | Yaygın iPhone |
| 768 px | Tablet dikey |
| 1024 px | Tablet yatay / küçük dizüstü |
| 1440 px | Tasarımın referans genişliği |
| 1920 px | Geniş masaüstü — burada içerik dağılıyor mu? |

Ayrıca: **yatay mod** (`orientation: landscape`) — 390×844 telefon yan çevrildiğinde yükseklik 390 px olur, `100svh` hero'nun içeriği sığıyor mu?

### 11.2 Kontroller

```bash
npx @lhci/cli autorun --collect.settings.preset=mobile
# veya tek sayfa için:
npx lighthouse http://localhost:3000 --preset=desktop --view
```

Chrome DevTools:
1. Device Mode'u aç
2. Menüden **"Show media queries"** — kırılma noktaların sayfanın üstünde renkli çubuklar olarak görünür, hangisinin aktif olduğunu tıklayarak test edebilirsin
3. Rendering panelinde `prefers-reduced-motion: reduce` zorla, animasyonların durduğunu doğrula
4. §7.4'teki taşma betiğini her genişlikte çalıştır

Projede `check` skill'i var — faz sonlarında onu çalıştır; types, lint, build, responsive layout ve erişilebilirlik denetimini birlikte yapıyor.

### 11.3 Gerçek cihaz

Emülatör dokunma isabetini, gerçek FPS'i ve pil davranışını göstermez. En az bir kez gerçek telefonda aç:

```bash
next dev -H 0.0.0.0
# telefondan http://<bilgisayarın-yerel-ip>:3000
```

---

## 12. Yapılmayacaklar

- ❌ `html { overflow-x: hidden }` ile taşmayı örtmek — sorunu gizler, çözmez
- ❌ Tüm sayfayı `transform: scale()` ile küçültmek — metin okunamaz hale gelir, zoom bozulur
- ❌ `user-scalable=no` veya `maximum-scale=1`
- ❌ Mobilde içeriği "sığmadığı için" gizlemek — ekran boyutu, kullanıcının neyi görmek istediğini tahmin etmez
- ❌ `max-width` ile aşağı doğru istisna zinciri kurmak — mobile first, `min-width` ile yukarı
- ❌ Kırılma noktalarını cihaz adına göre isimlendirmek (`.iphone`, `.ipad-pro`)
- ❌ Sadece `vw` ile yazı tipi boyutu
- ❌ Tek seferde tüm siteyi yeniden yazmak — faz faz, her fazda doğrulama
- ❌ `useEffect` içinde ne olduğunu açıklayan yorum olmadan yan etki bırakmak (`project-rules`)
- ❌ Değiştirilmesi istenmeyen kodu "yol üstünde" düzeltmek — tek değişiklik, tek konu

---

## 13. Kaynaklar ve kanıt düzeyi

| Kaynak | Ne için kullanıldı | Kanıt düzeyi |
|---|---|---|
| [MDN — Responsive web design](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design) · Mozilla katkıcıları, son güncelleme 19 Aralık 2025 | Temel teknikler, `max-width: 100%`, medya sorguları, `vw`+`rem` uyarısı, viewport meta | **Güçlü** — kurumsal, sürekli güncellenen referans dokümantasyon |
| [web.dev — Duyarlı web tasarımıyla ilgili temel bilgiler](https://web.dev/articles/responsive-web-design-basics?hl=tr) · Pete LePage & Rachel Andrew, Google | Viewport meta gerekçesi, kırılma noktası seçme yöntemi, "içeriği gizleme" uyarısı | **Güçlü ama eski** — sayfada belirtilen son güncelleme **12 Şubat 2019**. Container query, `dvh/svh`, `aspect-ratio` gibi sonradan gelen özellikleri içermiyor; bu dosyada o boşluklar MDN ve spesifikasyonlarla dolduruldu |
| [W3C WCAG 2.2 — SC 1.4.10 Reflow (AA)](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) | 320 CSS px hedefi, %400 zoom eşdeğeri | **En güçlü** — W3C Recommendation, normatif standart |
| [W3C WCAG 2.2 — SC 2.5.8 Target Size Minimum (AA)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | 24×24 CSS px dokunma hedefi tabanı ve boşluk istisnası | **En güçlü** — normatif standart, AA seviyesi |
| [W3C WCAG 2.2 — SC 2.5.5 Target Size Enhanced (AAA)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html) | 44×44 px önerisi | **Güçlü ama zorunlu değil** — AAA seviyesi, uyum için gerekmiyor |
| [Utopia — fluid type calculator](https://utopia.fyi/type/calculator) | `clamp()` değerleri üretmek | **Araç** — matematiği §6.1'de açık, doğrulanabilir |
| Ignatovich, D. — "Responsive Web Design: Principles and Best Practices", Medium | *Kullanılmadı* | **Zayıf** — kişisel blog, hakem süreci ve editoryal denetim yok, tarih belirsiz. Verdiğin diğer iki kaynak aynı konuları daha güvenilir şekilde kapsadığı için bu dosyada ona dayanan bir iddia yok |

### Kanıtı zayıf olduğu için işaretlenen iddialar

- **"Satır başına 70–80 karakter ideal"** — web.dev bunu "klasik okunabilirlik teorisi" olarak aktarıyor, kaynak göstermeden. Tipografi geleneğinden gelen bir başparmak kuralı; kontrollü okuma hızı çalışmalarıyla desteklenmiş bir eşik değil. Başlangıç değeri olarak kullan, kendi içeriğinde gözle doğrula.
- **`devicePixelRatio` üst sınırı olarak 2** — spesifikasyondan değil, yaygın uygulama pratiğinden geliyor. Kendi sahnende FPS ölçüp ayarla.
- **Kırılma noktası seti (40/48/64/80rem)** — evrensel bir doğru değil. web.dev'in yöntemi geçerli olan: tarayıcıyı yavaşça genişlet, düzen bozulduğu yere kırılma noktası koy. Faz 0'dan sonra bu seti revize et.
