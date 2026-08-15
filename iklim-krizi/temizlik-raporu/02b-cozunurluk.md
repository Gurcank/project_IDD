# 02b — Medya Çözünürlük Politikası (Faz 4)

**Not:** Bu analiz salt tespit amaçlıdır; hiçbir dosya silinmedi/değiştirilmedi. Kapsam: **halen kullanılan** (Faz 1/3'te referanslı bulunan) içerik medyaları — `image/un/` (kullanılmıyor, dokunulmuyor) ve Faz 3'te arşivlenen 9 dosya bu raporun dışında.

## Yöntem ve sınırlama

- Çözünürlükler PowerShell/System.Drawing ile ölçüldü. **`.webp` ve `.avif` formatları bu ortamda okunamadı** (GDI+ codec eksikliği) — bu dosyalar için "ölçülemedi" olarak işaretlendi, silinmeleri/değiştirilmeleri ÖNERİLMİYOR (kanıtsız karar verilmez, şablon kural 7).
- Video (`.mp4`) için de yerel ffprobe/ffmpeg bulunamadı; dosya adındaki `14619128_1920_1080_24fps` kalıbı (kaynak stok-video sitesinin kendi adlandırma biçimi) 1920×1080 olduğuna işaret ediyor ama bu ÖLÇÜLMEDİ, sadece dosya adından çıkarım.
- Eşik: şablona göre 4K (3840×2160) veya Full HD (1920×1080) **altı** "içerik medyası" (hero/galeri/banner/ürün fotoğrafı) elenmeye aday. Bu sitede 4K medya yok; pratik eşik Full HD (1920px uzun kenar) olarak uygulandı.

## Muaf kategoriler (silinmeyecek, çözünürlük sorunu değil)

| Grup | Sayı | Gerekçe |
|---|---|---|
| `image/sdg/e-web-01..17.png` | 17 | İkon seti — şablonun muaf listesinde ("ikon setleri") |
| `assets/video/placidplace-earth-19822.gif` (958×718) | 1 | SDG orbitinin küçük dairesel merkez süsü olarak kullanılıyor (`.sdg-center-gif`) — galeri/banner değil, dekoratif ikon ölçeğinde görüntüleniyor; bu ölçekte 958×718 fazlasıyla yeterli |
| `assets/video/14619128_1920_1080_24fps.mp4` | 1 | Hero arka plan videosu, dosya adından 1920×1080 (Full HD) — eşiği karşılıyor, ölçülmedi ama işaretlenmiyor |

## İçerik medyası — Full HD altı (eylem gerektirebilir)

### Kategori A — Ciddi düşük çözünürlük (<500px uzun kenar, gözle fark edilir bulanıklık riski yüksek)

| Dosya | Çözünürlük | Kategori | Karar | Yerine ne konacak |
|---|---|---|---|---|
| `causes/avustralya-lng-tesisleri.jpg` | 299×168 | Cause-stack kart fotoğrafı | RİSKLİ | Belirsiz — kaynak yenilenmeli |
| `causes/cin-termik-santralleri.jpg` | 300×168 | Cause-stack + vital-sign kart (2 yerde kullanılıyor) | RİSKLİ | Belirsiz — kaynak yenilenmeli |
| `causes/garzweiler-acik-maden-ocagi.jpg` | 300×168 | Cause-stack kart fotoğrafı | RİSKLİ | Belirsiz — kaynak yenilenmeli |
| `causes/hollanda-yogun-hayvancilik-tesisleri.jpg` | 300×168 | Cause-stack kart fotoğrafı | RİSKLİ | Belirsiz — kaynak yenilenmeli |
| `causes/hindistan-komur-madenleri.jpg` | 287×176 | Cause-stack kart fotoğrafı | RİSKLİ | Belirsiz — kaynak yenilenmeli |
| `causes/indias-brick-kilns.jpg` | 284×178 | Cause-stack kart fotoğrafı | RİSKLİ | Belirsiz — kaynak yenilenmeli |
| `causes/bati-teksas-permian-havzasi.jpg` | 275×183 | Cause-stack kart fotoğrafı | RİSKLİ | Belirsiz — kaynak yenilenmeli |
| `causes/ruhr-bolgesi-celik-tesisleri.jpg` | 272×185 | Cause-stack kart fotoğrafı | RİSKLİ | Belirsiz — kaynak yenilenmeli |
| `causes/nijer-deltasi.jpg` | 267×189 | Cause-stack kart fotoğrafı | RİSKLİ | Belirsiz — kaynak yenilenmeli |
| `progress/electric-vehicle.jpg` | 275×183 | İlerleme hikayesi kartı | RİSKLİ | Belirsiz — kaynak yenilenmeli |
| `progress/paris-agreement.jpg` | 275×183 | İlerleme hikayesi kartı | RİSKLİ | Belirsiz — kaynak yenilenmeli |

**11 dosya, hepsi 260-300px genişliğinde** — muhtemelen kaynak web sitesinden thumbnail/küçük önizleme boyutunda indirilmiş, orijinal büyük çözünürlük hiç alınmamış. Bu boyutta bir fotoğraf, kart genişliği genelde 300-500px olan bu sitede bile hafif bulanık görünür; daha büyük ekranda/yakınlaştırmada belirgin şekilde pikselleşir.

### Kategori B — Orta düzey (500-1500px uzun kenar, Full HD altında ama kart boyutunda kabul edilebilir)

| Dosya | Çözünürlük |
|---|---|
| `causes/borneo-adasi.jpg` | 500×300 |
| `causes/atlantik-hava-trafigi.png` | 676×364 |
| `causes/indonesias-two-wheeled-vehicle-problem.jpg` | 653×433 |
| `causes/teksas-korfez-kiyisi.jpg` | 640×478 |
| `causes/amazon-yagmur-ormanlari.jpg` | 726×555 |
| `causes/abd-buyuk-ovalarda-mono-kultur.jpg` | 770×513 |
| `causes/dubai-havalimani.jpg` | 860×484 |
| `causes/kongo-havzasi.jpg` | 871×490 |
| `progress/european-green-deal.jpg` | 800×500 |
| `causes/suez-and-panama-canal-traffic-congestion.jpeg` | 700×500 |
| `causes/cerrado-savanalari-brezilya.jpg` | 900×506 |
| `causes/dogu-afrika-miombo-ormanlari.jpg` | 900×600 |
| `causes/chinese-aluminum-plants.jpg` | 900×614 |
| `causes/hungarys-pvc-and-plastics-sector.jpeg` | 900×598 |
| `causes/cimento-fabrikalari.jpg` | 1200×800 |
| `progress/lithium-ion-battery.jpeg` | 1200×588 |
| `future/eriyen-buzullar.jpg` | 1400×933 |
| `progress/renewable-energy.jpg` | 1500×1000 |

**Karar: DOKUNMA.** Full HD eşiğinin altında ama bu sitedeki kullanım bağlamında (kart/galeri fotoğrafı, tam ekran hero değil) görsel kalite kaybı düşük risk. Değiştirme önerilmiyor.

### Kategori C — Full HD ve üzeri

| Dosya | Çözünürlük |
|---|---|
| `causes/kuresel-konteyner-gemiciligi.jpg` | 1920×1080 |

## Ölçülemeyen (webp/avif) — 24 dosya

| Klasör | Dosya sayısı | Format |
|---|---|---|
| `image/actions/` | 12 | avif |
| `image/causes/` | 5 | webp |
| `image/causes/` | 1 | avif |
| `image/nasa/` | 5 | webp |
| `image/progress/` | 1 | webp |

**Karar: RİSKLİ — bu ortamda doğrulanamadı.** Bu formatlar modern, verimli sıkıştırma kullanır; küçük dosya boyutu (çoğu 50-300 KB) düşük çözünürlük anlamına gelmeyebilir (avif/webp aynı görsel kalitede jpg'den çok daha küçük dosya üretir). Ancak emin olunamadığından şablon kuralı gereği (§7 "%100 emin değilsen silme/karar verme") bu liste için kesin bir düşük-çözünürlük kararı verilmiyor. Doğru değerlendirme için `cwebp`/`avifdec` gibi bir araçla yerel ölçüm önerilir.

## Özet

| Kategori | Dosya | Karar |
|---|---|---|
| Muaf (ikon/dekoratif/hero-video) | 19 | Dokunma |
| Full HD ve üzeri | 1 | Dokunma |
| Orta (500-1500px) | 18 | Dokunma — risk düşük |
| **Ciddi düşük (<500px)** | **11** | **RİSKLİ — kullanıcı kararı gerekli** |
| Ölçülemeyen (webp/avif) | 24 | RİSKLİ — bu ortamda doğrulanamadı, karar verilmiyor |

## Onay bekleyen karar

**11 "ciddi düşük çözünürlük" dosyası** için: (a) olduğu gibi bırakılsın mı (görsel etki sınırlı kart boyutunda kabul edilebilir olabilir), (b) ileride daha yüksek çözünürlüklü kaynaklarla değiştirilmek üzere ayrı bir "RİSKLİ — değiştirilecek" listesine mi alınsın? Bu görevin kapsamında yeni fotoğraf kaynağı bulma/indirme yok — sadece karar ve önceliklendirme yapılabilir.
