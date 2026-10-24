# İklim Krizi sayfası (iklimdd.org/iklimkrizi)

İklim Değişmeden Değiş (IDD ORG) sitesinin **Projelerimiz → İklim Krizi** sayfası. Türkiye ve dünya verileriyle sıcaklık artışı, deniz seviyesi, orman yangınları, emisyonlar ve çözüm adımlarını anlatıyor.

Bu repo yalnızca sayfanın kendisini içeriyor. Sayfa, ana sitenin ([`dogantatarjr/idd-org`](https://github.com/dogantatarjr/idd-org), Laravel 12) klasör yapısıyla birebir aynı yollarda duruyor ve sitenin `frontend.master` şablonunu genişletiyor. Header, footer, Bootstrap, AOS, Font Awesome ve site fontları o şablondan geliyor.

## Klasör yapısı

```text
resources/views/frontend/iklim-krizi.blade.php   Sayfanın Blade görünümü
public/assets/iklim-krizi/
  css/style.css                                  Sayfaya özel stiller (yalnızca bu sayfada yüklenir)
  js/script.js                                   Sayfaya özel etkileşimler (tek dosya, bağımsız modüller)
  image/                                         Görseller (WebP; paylaşım görseli JPG)
  video/                                         Hero, dönen Dünya ve sıcaklık spirali videoları
ENTEGRASYON.md                                   Siteye ekleme adımları ve yayın kontrol listesi
GORSEL-KAYNAKLAR.md                              Görsellerin kaynak ve lisans bilgileri
```

Siteye yalnızca `resources/views/frontend/iklim-krizi.blade.php` ve `public/assets/iklim-krizi/` kopyalanır. Kalan dosyalar bu reponun geliştirme araçlarıdır.

## Siteye ekleme

Ayrıntılı adımlar [ENTEGRASYON.md](ENTEGRASYON.md) dosyasında. Özetle sitede dört küçük ekleme gerekiyor:

1. `routes/web.php`: `/iklimkrizi` rotası.
2. `TemplateController`: `iklimKrizi()` metodu.
3. `frontend/master.blade.php`: `@stack('head')` ve `@stack('scripts')` satırları.
4. `partials/header.blade.php`: Projelerimiz menüsüne "İklim Krizi" öğesi.

## Geliştirme

Gereksinim: Node.js 20.19 veya üstü (yalnızca lint ve biçimlendirme için; sayfanın çalışması için derleme adımı yok).

```bash
npm ci
```

```bash
npm run lint
```

```bash
npm run format
```

| Komut                  | Ne yapar                                           |
| ---------------------- | -------------------------------------------------- |
| `npm run lint`         | ESLint (`script.js`) ve Stylelint (`style.css`)    |
| `npm run format`       | Prettier ile JS, CSS, JSON ve Markdown biçimlendir |
| `npm run format:check` | Biçimlendirmeyi değiştirmeden kontrol et           |
| `npm run audit`        | Geliştirme bağımlılıklarında güvenlik taraması     |

Prettier Blade dosyasını biçimlendirmez; Blade elle düzenlenir. Kod, değişken adları ve kod yorumları İngilizce, sayfadaki metinler Türkçedir.

Sayfayı görmek için ana sitenin yerel kopyasına ENTEGRASYON.md'deki adımlarla eklenip `php artisan serve` ile açılması gerekir.

## Güvenlik notları

- Sayfa form, kullanıcı girdisi, API anahtarı ya da ortam değişkeni (env) içermiyor.
- GSAP 3.15.0 ve Lenis 1.3.25 jsDelivr'den sabit sürümle ve SRI (`integrity` + `crossorigin`) ile yükleniyor. Sürüm değişirse hash yeniden hesaplanmalı (komut ENTEGRASYON.md'de).
- `script.js` HTML string'inden DOM üretmiyor (`innerHTML` yok); metinler `textContent` ile yazılıyor.
- Yeni sekmede açılan tüm harici bağlantılarda `rel="noopener noreferrer"` var.
- HTTP güvenlik başlıkları ve CSP site düzeyinde ayarlanır; bu repo yalnızca sayfa içinde yapılabilenleri kapsıyor.

## Erişilebilirlik ve performans

- `prefers-reduced-motion` açıkken videolar oynamaz; kayan şerit, giriş animasyonları ve sayaçlar durur.
- JavaScript yoksa SDG listesi, adım listesi ve ÇŞB grafikleri düz içerik olarak görünür.
- Hero poster görseli yüksek öncelikle önceden yükleniyor; sayfa altındaki görseller `loading="lazy"`.
- Bilinen eksik: hero videosu, dönen Dünya videosu ve kayan veri şeridi için görünür bir durdur/oynat düğmesi yok (WCAG 2.2.2).

## Görsel lisansları

Her görselin kaynağı, lisansı ve atıf metni [GORSEL-KAYNAKLAR.md](GORSEL-KAYNAKLAR.md) dosyasında. CC BY ve CC BY-SA görsellerin künyesi sayfada her görselin köşesindeki bilgi düğmesinden de açılıyor.
