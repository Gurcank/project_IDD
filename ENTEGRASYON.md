# İklim Krizi sayfasını iklimdd.org'a ekleme

Bu proje, sayfayı sitenin (Laravel 12, `dogantatarjr/idd-org`) klasör yapısıyla birebir aynı tutuyor. Sayfa `/iklimkrizi` adresinde, **Projelerimiz → İklim Krizi** olarak açılır. Header, footer, başa dön butonu, Bootstrap, AOS ve fontlar sitenin `frontend.master` şablonundan gelir.

## 1. Kopyalanacak dosyalar

| Bu projede                                           | Site reposunda |
| ---------------------------------------------------- | -------------- |
| `resources/views/frontend/iklim-krizi.blade.php`     | aynı yol       |
| `public/assets/iklim-krizi/` (css, js, image, video) | aynı yol       |

İkisi de yeni; sitenin mevcut hiçbir dosyasının üzerine yazmaz. `public/assets/iklim-krizi/` toplam 11,4 MB, 109 dosya (görseller 5,9 MB, videolar 5,2 MB).

Yalnızca bu iki yol kopyalanır. `package.json`, `node_modules/` ve lint/format ayarları bu reponun geliştirme araçlarıdır; siteye kopyalanmaz.

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
- [ ] Konsolda `Failed to find a valid digest in the 'integrity' attribute` hatası yok (GSAP ve Lenis SRI ile yükleniyor; bkz. 5. bölüm).
- [ ] Konsoldaki tek hata sitenin kendi slider kodundan geliyor (`Cannot set properties of null (setting 'textContent')`). Bu hata slider'ı olmayan her sayfada zaten çıkıyor, bu sayfanın çalışmasını etkilemiyor.

## 5. Dikkat edilecekler

- **`public/iklimkrizi/` adında klasör açılmamalı.** Sunucu aynı adlı klasörü rotanın önüne koyar ve sayfa açılmaz. Dosyalar bu yüzden `public/assets/iklim-krizi/` altında.
- **Bağlantılarda sona `/` konmamalı.** `/iklimkrizi/` adresi sunucuda `/public/iklimkrizi` adresine yönleniyor.
- **Canlı site GitHub'daki sürümden yeni.** Canlı header'da COP31 butonu var, canlı footer'da telefon satırı yok. Eklemeler canlıdaki dosyalara yapılmalı; GitHub'daki header canlının üzerine kopyalanırsa COP31 butonu kaybolur.
- **JSON-LD anahtarları Blade dosyasında `@@context`, `@@type` biçiminde.** Bu bilinçli: `@context` Laravel 12'de bir Blade komutu. Tek `@` ile yazılırsa sayfa derlenmez ve hata verir. Sayfaya çıkan HTML'de tek `@` görünür.
- **Sayfa, `frontend.partials.scripts` dosyasındaki AOS başlatma koduna ve başa dön butonuna dayanıyor.** AOS hiç yüklenemezse sayfa giriş animasyonlu öğeleri kendisi görünür yapar; animasyonlar oynamaz ama içerik kaybolmaz.
- **GSAP ve Lenis sürümleri sabit ve SRI (`integrity`) ile yükleniyor.** CDN'deki dosya değişirse tarayıcı script'i çalıştırmaz; sayfa bu durumda animasyonsuz ve normal kaydırmayla çalışmaya devam eder. Sürüm yükseltirken yeni hash'i resmi dosyadan hesaplayın:

  ```bash
  curl -sL https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js | openssl dgst -sha384 -binary | openssl base64 -A
  ```

## 6. Sayfayı güncelleme

İlk bölümdeki iki yolu yeniden kopyalamak yeterli. İkinci bölümdeki eklemeler yalnızca bir kez yapılır.

Sayfanın önceki bir sürümü sunucuya yüklendiyse: bu sürümde `image/csb/` ve `image/sdg/` altındaki PNG'ler ile `image/nasa/oklahoma-sel-yolu.gif` WebP'ye çevrildi. Sunucuda kalan eski `.png`/`.gif` dosyaları artık kullanılmıyor ve silinebilir.
