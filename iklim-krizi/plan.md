# İklim Krizi — Proje Planı

## Amaç
IDD ORG (İklim Değişmeden Değiş) web sitesine eklenecek, tek sayfalık (`/iklim-krizi/`), statik bir mikro-site. Belgesel anlatımından ilham alan, görsellik odaklı, interaktif ve medya yoğun, modern/üst düzey bir kullanıcı deneyimi sunuyor. Soyut rapor ve grafik yığını değil; izleyiciyi hikayeye sokan bir "scrollytelling" deneyimi hedefleniyor.

## Teknik Yapı
- **Statik**: Sadece `index.html`, `style.css`, `script.js` + `assets/` (image, video).
- **Kütüphaneler (CDN)**: Bootstrap 5, Font Awesome, Bootstrap Icons, Google Fonts (Open Sans / Inter / Montserrat), AOS (scroll-reveal), Chart.js (veri grafikleri), GSAP + ScrollTrigger (bölüm geçiş animasyonları).
- Ana siteye **iframe değil, doğrudan path** (`/iklim-krizi/`) olarak entegre edilecek; navbar üstte zaten ana sitenin menüsünü taşıyor.

## Bölümler (mevcut durum + içerik amacı)

1. **Hero**
   - Tam ekran arkaplan videosu (`14619128_1920_1080_24fps.mp4`) + karartma overlay.
   - Başlık "İklim Krizi" + JS ile değişen rotator metin (`#hero-rotator`) + güçlü, duygusal alt metin.
   - Amaç: İlk 3 saniyede izleyiciyi içeri çekmek, belgesel açılışı hissi vermek.

2. **SDG (Sürdürülebilir Kalkınma Hedefleri)**
   - Ortada dönen Dünya GIF'i etrafında 17 SDG ikonunun yörüngede dizildiği interaktif "orbit" bileşeni (`#sdgCanvas`).
   - Tıklanan/hover edilen hedef, yan panelde (`#sdgInfoCard`) detay kartı açıyor.
   - Amaç: İklim krizinin tüm kalkınma hedeflerini nasıl etkilediğini görsel ve keşfedilebilir şekilde anlatmak.

3. **İklim Krizinin Sebepleri**
   - 5 sekmeli (tab) yapı: Enerji ve Fosil Yakıtlar, Ormansızlaşma, Sanayi Üretimi, Tarım ve Hayvancılık, Ulaşım.
   - Her sekmede: açıklama metni + Chart.js grafiği + arkaplan fotoğrafı geçişi + "stack card" formatında 3 gerçek dünya örneği (Garzweiler maden ocağı, Amazon, Borneo, vb.).
   - Enerji sekmesinde canlı/simüle edilen CO₂ ppm sayacı (NOAA Mauna Loa bazlı tahmini artış).
   - Amaç: Nedenleri somut, yer-temelli örneklerle (yer adı + görsel) anlatmak — soyut istatistik değil.

4. **Bir Şey Yapılmazsa Ne Olacak?**
   - IPCC senaryolarına dayalı sıcaklık artışı projeksiyon grafiği (`tempProjectionChart`).
   - 4 etki kartı: deniz seviyesi yükselişi, ekstrem hava olayları, tür kaybı riski, su kıtlığı.
   - Amaç: Aksiyon alınmazsa somut/sayısal sonuçları göstermek, "bilim kurgu değil" mesajı.

5. **Ne Yapmalıyız?**
   - İki kolon: Bireysel Adımlar (enerji tasarrufu, ulaşım, beslenme, bilinçli tüketim) ve Sistemsel/Politika Adımları (yenilenebilir enerji, karbon fiyatlandırma, orman koruma, uluslararası işbirliği).
   - Amaç: Çözümü hem birey hem sistem ölçeğinde dengeli sunmak, umut/eyleme geçirme tonu.

6. **Şu An Neler Yapılıyor?**
   - 4 bilgi kartı: Paris Anlaşması, COP süreci, yenilenebilir enerji patlaması, elektrikli araç devrimi.
   - 2015-2024 küresel yenilenebilir enerji kapasitesi grafiği (`renewableGrowthChart`).
   - Amaç: Olumlu ilerlemeyi göstererek dengeyi kurmak — "her şey kötü değil ama yeterli değil" tonu.

7. **Kaynaklar**
   - 3 belgesel kartı (Breaking Boundaries, Our Planet, An Inconvenient Truth) + 4 kurum/kaynak linki (IPCC, NASA Climate, UN Climate Action, Our World in Data).
   - Amaç: İzleyiciyi sayfa sonrası derinleşmeye yönlendirmek; projenin ilham kaynağı olan belgesellere referans.

8. **Footer**
   - IDD logosu, misyon metni, iletişim bilgisi, sosyal medya linkleri (Instagram, LinkedIn, Spotify, YouTube).

## Tasarım Dili
- Koyu tema (`section-dark`), büyük tipografi (Montserrat/Inter), renkli aksan kartlar (`--card-color` custom property ile her kartın kendi rengi).
- AOS ile scroll-reveal (fade-up, delay kademeleri), GSAP/ScrollTrigger ile bölüm bazlı animasyonlar.
- Görseller Unsplash kaynaklı (`assets/image/`), sekme geçişlerinde arkaplan fotoğrafı crossfade ile değişiyor.

## Açık / Geliştirilebilir Noktalar
- `script.js` içindeki hero rotator metinleri, SDG kart içerikleri (17 hedefin tam listesi), CO₂ sayacının canlı hesaplama mantığı ve grafik veri setleri detaylı kontrol edilmeli.
- Mobil deneyim: orbit bileşeni ve stack card'lar küçük ekranda test edilmeli.
- Performans: video + çoklu görsel + GSAP/Chart.js birlikte yüklendiğinde sayfa açılış hızı (lazy-load / poster image değerlendirilebilir).
- Erişilebilirlik: video `autoplay muted loop` zaten doğru; ancak `prefers-reduced-motion` için GSAP/AOS animasyonlarının azaltılması düşünülebilir.
