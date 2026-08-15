# 00 — Proje Envanteri (Faz 1 — Keşif)

Proje kökü: `iklim-krizi/`
Tarama tarihi: 2026-08-15

## 1. Giriş Noktaları

Repo genelinde tek bir HTML dosyası var: `iklim-krizi/index.html`. Başka `.html` dosyası yok — **index.html tek giriş noktasıdır.**

## 2. Dinamik Referans Kalıpları

### 2.1 Template literal ile üretilen yollar — `script.js`

```js
// script.js, satır 196-198
function imgSrc(id) {
  return `assets/image/sdg/e-web-${String(id).padStart(2, '0')}.png`;
}
```

`sdgData` dizisindeki `id: 1..17` değerleriyle çağrılıyor, şu 17 dosyayı dinamik üretiyor:
`assets/image/sdg/e-web-01.png` … `e-web-17.png`. Bunlar statik grepte "kullanılmıyor" görünse de kullanımdadır — kullanılmayan-medya listesine ASLA girmemeli.

Aynı klasörde `flag-of-the-united-nations-svg.png` bu kalıba uymuyor ve başka hiçbir yerde referans edilmiyor (bkz. madde 4).

### 2.2 String birleştirme (+)

`script.js` içinde `+` ile asset yolu üreten bir kalıp yok. Actions verisi (satır ~1400-1436) sabit string literal.

### 2.3 CSS `url()` — `style.css`

`style.css` içinde `url(` sıfır sonuç. Tüm arka plan görselleri `index.html` içinde inline `style="background-image:url(...)"` veya `style="--stack-img:url(...)"` ile veriliyor.

### 2.4 HTML'de img/video/inline background kalıpları

- `<img src="...">` — çok sayıda, yerel `assets/...` ve harici `https://...` karışık.
- `<source src="assets/video/14619128_1920_1080_24fps.mp4" type="video/mp4">` (satır 124).
- `<video src="https://assets.science.nasa.gov/...">` (satır 489, harici).
- `style="background-image:url('...')"` — vital-sign-card-bg kartları (satır 191-269).
- `style="--stack-img:url('...')"` — cause-stack-card kartları (satır 619-908).

**Kırık referanslar:** 5 cause-stack-card `assets/image/backgrounds/` klasörüne işaret ediyor, klasör diskte yok (bu oturumda commit edilmeden silinmiş — bkz. plan dosyası Faz 0 §1):

| Satır | Referans | Durum |
|---|---|---|
| 619 | `assets/image/backgrounds/zbynek-burival-grmwvnvssdu-unsplash.jpg` | KIRIK |
| 684 | `assets/image/backgrounds/jamie-morris-796foi6eo9o-unsplash.jpg` | KIRIK |
| 747 | `assets/image/backgrounds/patrick-hendry-6xedizgopaw-unsplash.jpg` | KIRIK |
| 816 | `assets/image/backgrounds/no-one-cares-l-5mjnbrmrs-unsplash.jpg` | KIRIK |
| 880 | `assets/image/backgrounds/engin-akyurt-h4ggjhkhwf0-unsplash.jpg` | KIRIK |

## 3. `assets/` Klasörü Tam Envanteri

Toplam: **~52 MB, 115 dosya** (image 19 MB, video 34 MB).

| Alt klasör | Dosya | Boyut | İçerik |
|---|---|---|---|
| `image/actions/` | 12 | 2.2 MB | Bireysel/toplumsal eylem kartları (.avif) |
| `image/causes/` | 30 | 2.7 MB | Cause-stack kartları |
| `image/future/` | 4 | 1.3 MB | Gelecek senaryosu görselleri |
| `image/nasa/` | 9 | 4.6 MB | NASA fotoğrafları |
| `image/progress/` | 7 | 328 KB | İlerleme/başarı hikayeleri |
| `image/sdg/` | 18 | 908 KB | SKA ikonları + BM bayrağı |
| `image/un/` | 33 | 6.3 MB | BM fotoğrafları |
| `video/` | 2 | 34 MB | Arka plan videosu + GIF |

`assets/image/backgrounds/` kodda referans ediliyor ama diskte yok (madde 2.4).

### Uzantı dağılımı (115 dosya)

| Uzantı | Adet |
|---|---|
| `.jpg` | 61 |
| `.png` | 20 |
| `.avif` | 14 |
| `.webp` | 13 |
| `.jpeg` | 5 |
| `.mp4` | 1 |
| `.gif` | 1 |

## 4. Referans Durumu — Kullanılan vs Kullanılmayan

| Klasör | Kullanılan | Kullanılmayan |
|---|---|---|
| `image/actions/` | 12/12 | 0 |
| `image/causes/` | 30/30 | 0 |
| `image/future/` | 1/4 | 3 |
| `image/nasa/` | 5/9 | 4 |
| `image/progress/` | 6/7 | 1 |
| `image/sdg/` | 17/18 | 1 |
| `image/un/` | 0/33 | 33 |
| `video/` | 2/2 | 0 |

### Referans edilmeyen dosyalar — tam liste (SİLİNMEDİ, sadece listelendi)

| Tam Yol | Boyut |
|---|---|
| `assets/image/sdg/flag-of-the-united-nations-svg.png` | 98.7 KB |
| `assets/image/progress/cop-summits.png` | 26.1 KB |
| `assets/image/nasa/nasa-firesense-2023-8640-x-5760-gaw-78.webp` | 10.0 KB |
| `assets/image/nasa/slide1.webp` | 140.7 KB |
| `assets/image/nasa/power-station-374097-1920.jpeg` | 172.4 KB |
| `assets/image/nasa/effectsbannernew-opt.jpeg` | 145.6 KB |
| `assets/image/future/dead-soil.jpg` | 473.6 KB |
| `assets/image/future/deforestation.avif` | 220.4 KB |
| `assets/image/future/olu-kiyilar.jpg` | 396.0 KB |
| `assets/image/un/UN71014338.jpg` | 82.2 KB |
| `assets/image/un/UN7123763.jpg` | 259.3 KB |
| `assets/image/un/UN7123956.jpg` | 398.2 KB |
| `assets/image/un/UN7123957.jpg` | 240.6 KB |
| `assets/image/un/UN713098.jpg` | 149.2 KB |
| `assets/image/un/UN7262680.jpg` | 115.1 KB |
| `assets/image/un/UN730286.jpg` | 261.8 KB |
| `assets/image/un/UN730288.jpg` | 183.9 KB |
| `assets/image/un/UN7319884.jpg` | 272.3 KB |
| `assets/image/un/UN7328301.jpg` | 161.3 KB |
| `assets/image/un/UN7329219.jpg` | 75.8 KB |
| `assets/image/un/UN7344398.jpg` | 294.3 KB |
| `assets/image/un/UN7348398.jpg` | 172.2 KB |
| `assets/image/un/UN7369403.jpg` | 145.3 KB |
| `assets/image/un/UN7406120.jpg` | 141.4 KB |
| `assets/image/un/UN7417696.jpg` | 114.4 KB |
| `assets/image/un/UN7417711.jpg` | 102.7 KB |
| `assets/image/un/UN7424567.jpg` | 87.5 KB |
| `assets/image/un/UN7428282.jpg` | 187.1 KB |
| `assets/image/un/UN7436150.jpg` | 81.5 KB |
| `assets/image/un/UN7461239.jpg` | 168.5 KB |
| `assets/image/un/UN7472231.jpg` | 104.2 KB |
| `assets/image/un/UN7489074.jpg` | 165.7 KB |
| `assets/image/un/UN7549379.jpg` | 101.8 KB |
| `assets/image/un/UN7661771.jpg` | 313.9 KB |
| `assets/image/un/UN7686926.jpg` | 308.9 KB |
| `assets/image/un/UN7731997.jpg` | 199.4 KB |
| `assets/image/un/UN7768472.jpg` | 246.6 KB |
| `assets/image/un/UN7771324.jpg` | 223.6 KB |
| `assets/image/un/UN7771340.jpg` | 253.3 KB |
| `assets/image/un/UN7771848.jpg` | 199.5 KB |
| `assets/image/un/UN7778908.jpg` | 256.5 KB |
| `assets/image/un/UN794697.jpg` | 259.1 KB |

**Toplam: 42 dosya, ~7.82 MB (assets toplamının ~%15'i).**

> `image/un/` klasörünün tamamı (33 dosya, 6.3 MB) untracked ve hiçbir yerde kullanılmıyor — tamamen kullanılmayan bir set mi yoksa entegrasyonu yarım kalmış bir bölüm mü, proje sahibine sorulmalı.

## 5. Harici (CDN) Bağımlılıkları

| Tür | Kütüphane | Versiyon |
|---|---|---|
| CSS/JS | Bootstrap 5 | 5.3.0 |
| CSS | Google Fonts (Open Sans, Inter, Montserrat, Climate Crisis) | — |
| CSS/JS | AOS | `@next` (pinlenmemiş) |
| CSS | Font Awesome | 6.4.0 |
| CSS | Bootstrap Icons | 1.7.2 |
| JS | GSAP + ScrollTrigger | `@3` (pinlenmemiş) |
| JS | Lenis | 1.3.25 |

Ek harici görsel kaynakları (yerel değil, canlı URL): `science.nasa.gov`, `assets.science.nasa.gov`, `webdosya.csb.gov.tr`, `iklimdd.org/idd-logo.png`.

## 6. Kaba Boyut Ölçümleri

| Dosya | Satır | Boyut |
|---|---|---|
| `index.html` | 1368 | 88.4 KB |
| `style.css` | 4039 | 92.7 KB |
| `script.js` | 1886 | 87.1 KB |
| **Toplam (kod)** | **7293** | **268.2 KB** |
| `assets/` | — | ~52 MB |

## Faz 2+ için not

1. 42 dosya (~7.8 MB) referanssız görünüyor, en büyüğü `image/un/` (33 dosya) — silmeden önce onay gerekiyor.
2. 5 kırık referans var (`assets/image/backgrounds/`) — dosyalar bu oturumda commit edilmeden silinmiş, kod hâlâ arıyor.
3. `imgSrc()` dinamik SDG döngüsü nedeniyle `e-web-01..17.png` hiçbir zaman "kullanılmıyor" sayılmamalı.
4. `style.css` hiç asset referansı içermiyor — tüm görsel bağlamalar `index.html` inline stillerinde.
5. Tek giriş noktası `index.html`.
