# İklim Krizi sayfasını iklimdd.org'a ekleme

Bu proje, sayfayı sitenin (Laravel 12, `dogantatarjr/idd-org`) klasör yapısıyla birebir aynı tutuyor. Sayfa `/iklimkrizi` adresinde, **Projelerimiz → İklim Krizi** olarak açılır. Header, footer, başa dön butonu, Bootstrap, AOS ve fontlar sitenin `frontend.master` şablonundan gelir.

## 1. Kopyalanacak dosyalar

| Bu projede | Site reposunda |
|---|---|
| `resources/views/frontend/iklim-krizi.blade.php` | aynı yol |
| `public/assets/iklim-krizi/` (css, js, image, video) | aynı yol |

İkisi de yeni; sitenin mevcut hiçbir dosyasının üzerine yazmaz. `public/assets/iklim-krizi/` toplam 11,6 MB, 109 dosya (görseller 6,0 MB, videolar 5,2 MB).

## 2. Sitenin dosyalarına dört ekleme

### 2.1 `routes/web.php`

`/book` rotasının altına:

```php
Route::get('/iklimkrizi', [TemplateController::class, 'iklimKrizi'])->name('iklimkrizi');
```

### 2.2 `app/Http/Controllers/TemplateController.php`

`book()` metodunun altına:

```php
    public function iklimKrizi()
    {
        return view('frontend.iklim-krizi');
    }
```

### 2.3 `resources/views/frontend/master.blade.php`

İki satır. Sayfanın açıklama, paylaşım (Open Graph) ve kanonik adres etiketleri ile CSS'i `<head>`'e, JS'i sayfa sonuna bu satırlardan girer. GitHub'daki sürümde başka hiçbir sayfa bu yığınlara içerik eklemiyor (74 Blade dosyası tarandı), bu yüzden diğer sayfaların çıktısı değişmez. Canlıya sonradan eklenmiş bir sayfa `@push('head')` ya da `@push('scripts')` kullanıyorsa, o içerik bu satırlarla birlikte görünür hâle gelir.

```blade
    <!-- Custom CSS -->
    @include('frontend.partials.styles')
    @stack('head')
```

```blade
    <!-- Custom JS -->
    @include('frontend.partials.scripts')
    @stack('scripts')
```

### 2.4 `resources/views/frontend/partials/header.blade.php`

Projelerimiz açılır menüsünde, "Kampanyalarımız" öğesinin altına:

```blade
                        <li>
                            <a class="dropdown-item @yield('iklimkrizi-sit')" href="/iklimkrizi">İklim Krizi</a>
                        </li>
```

## 3. Yayına alma

1. İlk bölümdeki iki yolu ve ikinci bölümdeki dört eklemeyi sunucuya yükleyin.
2. Sunucuda `php artisan view:clear` çalıştırın. Rotalar önbelleğe alınıyorsa (`php artisan route:cache`) `php artisan route:clear` da gerekir.
3. CSS ve JS adreslerine dosyanın değişme zamanı (`?v=...`) otomatik ekleniyor. Sitenin statik dosyaları 7 gün önbellekte tutuluyor; güncellemeler bu parametre sayesinde hemen görünmeli. Hostinger CDN'inin bu parametreyi önbellek anahtarına kattığı doğrulanmadı; ilk güncellemede kontrol edin.

## 4. Yayından sonra kontrol listesi

- [ ] `https://iklimdd.org/iklimkrizi` açılıyor.
- [ ] Menüde Projelerimiz ve açılır listede İklim Krizi işaretli görünüyor.
- [ ] Tarayıcının geliştirici araçlarında, Ağ (Network) sekmesinde 404 veren istek yok.
- [ ] Sayfa kaynağında `<link rel="canonical" href="https://iklimdd.org/iklimkrizi">` var ve JSON-LD bloğunda `"@context"` yazıyor.
- [ ] Global Isınma, Okyanuslar ve Orman Yangınları grafikleri kaydırırken ekranda sabit kalıyor.
- [ ] Konsoldaki tek hata sitenin kendi slider kodundan geliyor (`Cannot set properties of null (setting 'textContent')`). Bu hata slider'ı olmayan her sayfada zaten çıkıyor, bu sayfanın çalışmasını etkilemiyor.

## 5. Dikkat edilecekler

- **`public/iklimkrizi/` adında klasör açılmamalı.** Sunucu aynı adlı klasörü rotanın önüne koyar ve sayfa açılmaz. Dosyalar bu yüzden `public/assets/iklim-krizi/` altında.
- **Bağlantılarda sona `/` konmamalı.** `/iklimkrizi/` adresi sunucuda `/public/iklimkrizi` adresine yönleniyor.
- **Canlı site GitHub'daki sürümden yeni.** Canlı header'da COP31 butonu var, canlı footer'da telefon satırı yok. Eklemeler canlıdaki dosyalara yapılmalı; GitHub'daki header canlının üzerine kopyalanırsa COP31 butonu kaybolur.
- **JSON-LD anahtarları Blade dosyasında `@@context`, `@@type` biçiminde.** Bu bilinçli: `@context` Laravel 12'de bir Blade komutu. Tek `@` ile yazılırsa sayfa derlenmez ve hata verir. Sayfaya çıkan HTML'de tek `@` görünür.
- **Sayfa, `frontend.partials.scripts` dosyasındaki AOS başlatma koduna ve başa dön butonuna dayanıyor.** Bu kodlar siteden kaldırılırsa sayfadaki giriş animasyonlu öğeler görünmez kalır.

## 6. Sayfayı güncelleme

İlk bölümdeki iki yolu yeniden kopyalamak yeterli. İkinci bölümdeki eklemeler yalnızca bir kez yapılır.

## 7. İsteğe bağlı: site geneli öneriler

Sayfanın önceki sürümü, aşağıdaki düzeltmeleri yalnızca kendi içinde uyguluyordu. Header ve footer her sayfada aynı görünsün diye kaldırıldılar. Site geneline alınırlarsa her sayfada işe yararlar:

1. **Mobilde daha alçak menü çubuğu:** 991px ve altında menü çubuğu 73px. Logo 40px, dikey dolgu 0,5rem olursa 56px'e iner ve içeriğe daha çok yer kalır.
2. **Açılır menüde bulunulan sayfa:** Bugün Bootstrap'ın varsayılan mavisiyle (#0d6efd) işaretleniyor. Site yeşili (#2c7933) ve sol kenarda ince bir vurgu şeridi site paletiyle uyumlu olur.
3. **Footer'da taşan e-posta adresi:** 768–991px arasında e-posta adresi sütunundan taşıyor (768px'te 46px). Nedeni, `.contact-social-wrapper` üzerindeki satır içi `padding-left: 3rem`'in dar sütunda da uygulanması.
4. **Sosyal medya ikonlarının dokunma alanı:** Mobilde 22×32px. İkonlar arasında 16px boşluk olduğu için WCAG 2.5.8'in aralık istisnasını karşılıyor, yani zorunlu değil. Yine de görünür boyutu değiştirmeden büyütülürse parmakla dokunmak kolaylaşır.
