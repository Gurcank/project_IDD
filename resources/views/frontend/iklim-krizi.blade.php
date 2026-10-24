{{-- Climate crisis page: iklimdd.org → Projelerimiz → İklim Krizi (/iklimkrizi).
     Extends the site's frontend.master layout, which already provides the header,
     footer, back-to-top button, Bootstrap, AOS, Font Awesome, Bootstrap Icons,
     Inter and Montserrat; only page-specific markup and assets live here.
     Integration steps: ENTEGRASYON.md --}}
@extends('frontend.master')

@section('title', 'İklim Krizi')

@php
  // Cache-busting query string: the site serves static files with a 7-day cache,
  // so a changed file needs a new URL. A missing file must not turn the whole
  // page into a 500 error, so it falls back to an unversioned URL.
  $assetVersion = static fn (string $path): string => is_file(public_path($path)) ? (string) filemtime(public_path($path)) : '0';
@endphp

{{-- Highlights "Projelerimiz" and its "İklim Krizi" dropdown item in the site menu. --}}
@section('projects-sit', 'active')
@section('iklimkrizi-sit', 'active')

@push('head')
  <meta name="description" content="Türkiye ve dünya verileriyle iklim krizi: sıcaklık artışı, deniz seviyesi, orman yangınları ve emisyonlar. NASA, IPCC ve ÇŞB kaynaklarıyla hazırlandı.">

  {{-- No trailing slash: iklimdd.org redirects URLs ending in "/" to /public/... --}}
  <link rel="canonical" href="https://iklimdd.org/iklimkrizi">

  {{-- Open Graph (Facebook, WhatsApp, LinkedIn previews) --}}
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://iklimdd.org/iklimkrizi">
  <meta property="og:title" content="İklim Krizi: Veriler, Kanıtlar ve Türkiye">
  <meta property="og:description" content="Türkiye ve dünya verileriyle iklim krizi: sıcaklık artışı, deniz seviyesi, orman yangınları ve emisyonlar. NASA, IPCC ve ÇŞB kaynaklarıyla hazırlandı.">
  <meta property="og:image" content="{{ asset('assets/iklim-krizi/image/og-iklim-krizi.jpg') }}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Sonbahar renklerindeki ağaçlarla kaplı tepeler arasında bir göl ve uzakta dağlar">
  <meta property="og:locale" content="tr_TR">
  <meta property="og:site_name" content="İklim Değişmeden Değiş">

  {{-- Twitter/X card --}}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="İklim Krizi: Veriler, Kanıtlar ve Türkiye">
  <meta name="twitter:description" content="Türkiye ve dünya verileriyle iklim krizi: sıcaklık artışı, deniz seviyesi, orman yangınları ve emisyonlar.">
  <meta name="twitter:image" content="{{ asset('assets/iklim-krizi/image/og-iklim-krizi.jpg') }}">
  <meta name="twitter:image:alt" content="Sonbahar renklerindeki ağaçlarla kaplı tepeler arasında bir göl ve uzakta dağlar">

  {{-- "@@" renders as a single "@". A bare "@context" key is compiled as a
       Blade directive in Laravel 12 and breaks the page. --}}
  {{-- Structured data (JSON-LD) --}}
  <script type="application/ld+json">
  {
    "@@context": "https://schema.org",
    "@@graph": [
      {
        "@@type": "Organization",
        "name": "İklim Değişmeden Değiş (IDD ORG)",
        "url": "https://iklimdd.org/",
        "logo": "https://iklimdd.org/idd-logo.png",
        "sameAs": [
          "https://www.instagram.com/idd.org.tr/",
          "https://www.linkedin.com/company/i%CC%87klim-de%C4%9Fi%C5%9Fmeden-de%C4%9Fi%C5%9F-%C5%9Firket",
          "https://open.spotify.com/show/0FnjKhFwwugAHvTSIOiVS0",
          "https://www.youtube.com/@iklimdegismedendegis"
        ]
      },
      {
        "@@type": "Article",
        "headline": "İklim Krizi: Veriler, Kanıtlar ve Türkiye",
        "description": "Türkiye ve dünya verileriyle iklim krizi: sıcaklık artışı, deniz seviyesi, orman yangınları ve emisyonlar.",
        "image": "{{ asset('assets/iklim-krizi/image/og-iklim-krizi.jpg') }}",
        "author": { "@@type": "Organization", "name": "İklim Değişmeden Değiş (IDD ORG)" },
        "publisher": {
          "@@type": "Organization",
          "name": "İklim Değişmeden Değiş (IDD ORG)",
          "logo": { "@@type": "ImageObject", "url": "https://iklimdd.org/idd-logo.png" }
        },
        "mainEntityOfPage": "https://iklimdd.org/iklimkrizi"
      }
    ]
  }
  </script>

  {{-- The hero poster is the first large paint (and the only one with reduced
       motion). The browser only discovers a <video> poster late, so it is
       fetched early with high priority. --}}
  <link rel="preload" as="image" type="image/webp" fetchpriority="high" href="{{ asset('assets/iklim-krizi/image/hero-poster.webp') }}">

  {{-- The layout already requests Google Fonts CSS; preconnecting to the font
       file host saves a round trip for the Climate Crisis font below. --}}
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  {{-- Climate Crisis: variable "melting" display font used in headings.
       Requesting YEAR@1979..2050 loads the font's real YEAR axis, which
       script.js animates through font-variation-settings. --}}
  <link href="https://fonts.googleapis.com/css2?family=Climate+Crisis:YEAR@1979..2050&amp;display=swap"
    rel="stylesheet">

  {{-- Loaded after the site's global styles so page rules win without !important. --}}
  <link rel="stylesheet" href="{{ asset('assets/iklim-krizi/css/style.css') }}?v={{ $assetVersion('assets/iklim-krizi/css/style.css') }}">
@endpush

@section('content')

  <a href="#main-content" class="skip-link">İçeriğe atla</a>

  {{-- Reading progress bar along the top edge. Decorative: the section menu
       below already exposes the current section to assistive tech. --}}
  <div class="reading-progress" id="readingProgress" aria-hidden="true">
    <div class="reading-progress-fill" id="readingProgressFill"></div>
  </div>

  {{-- Section indicator: fixed capsule on the right on desktop; the current
       section's dot stretches, clicking scrolls to that section. --}}
  <nav class="section-dotnav" id="sectionDotnav" aria-label="Bölümler arası hızlı gezinme">
    <a href="#hero-section" data-dot data-section="hero-section"><span class="section-dotnav-dot"></span><span class="section-dotnav-label">Ana Sayfa</span></a>
    <a href="#sdg-section" data-dot data-section="sdg-section"><span class="section-dotnav-dot"></span><span class="section-dotnav-label">Hedefler</span></a>
    <a href="#happening-section" data-dot data-section="happening-section"><span class="section-dotnav-dot"></span><span class="section-dotnav-label">Neler Oluyor?</span></a>
    <a href="#causes-section" data-dot data-section="causes-section"><span class="section-dotnav-dot"></span><span class="section-dotnav-label">Sebebi Ne?</span></a>
    <a href="#consequences-section" data-dot data-section="consequences-section"><span class="section-dotnav-dot"></span><span class="section-dotnav-label">Neler Olacak?</span></a>
    <a href="#actions-section" data-dot data-section="actions-section"><span class="section-dotnav-dot"></span><span class="section-dotnav-label">Neler Yapmalıyız?</span></a>
    <a href="#progress-section" data-dot data-section="progress-section"><span class="section-dotnav-dot"></span><span class="section-dotnav-label">Neler Yapılıyor?</span></a>
    <a href="#resources-section" data-dot data-section="resources-section"><span class="section-dotnav-dot"></span><span class="section-dotnav-label">Kaynaklar</span></a>
  </nav>

  <main id="main-content" data-asset-base="{{ asset('assets/iklim-krizi') }}/">

  {{-- Hero --}}

  <section class="ik-hero-section" id="hero-section">
    <video id="heroVideo" autoplay muted loop playsinline preload="auto" poster="{{ asset('assets/iklim-krizi/image/hero-poster.webp') }}"
      class="ik-hero-video" aria-hidden="true">
      <source src="{{ asset('assets/iklim-krizi/video/hero-buzul-erimesi-720p.webm') }}" type="video/webm">
      <source src="{{ asset('assets/iklim-krizi/video/hero-buzul-erimesi-720p.mp4') }}" type="video/mp4">
    </video>

    <div class="video-overlay"></div>

    <div class="container ik-hero-content" data-aos="fade-up">
      <h1 class="ik-hero-title">İklim Krizi</h1>

      <div class="text-rotator-wrapper">
        <span id="hero-rotator" class="rotator-text"></span>
      </div>

      <p class="ik-hero-subtitle">Soyut raporları ve karmaşık grafikleri bir kenara bıraktık. İklim krizi uzak kutuplardaki
        eriyen buzullardan ibaret değil; her gün soluduğumuz havada, attığımız her adımda ve aldığımız her kararda
        saklı. Gerçek, tüm çıplaklığıyla karşımızda duruyor.</p>
    </div>
  </section>

  {{-- Sustainable Development Goals --}}

  <div class="ik-seam" aria-hidden="true"></div>

  <section id="sdg-section" class="sdg-section theme-green">

    <div class="sdg-zone">

      <div class="sdg-text-panel">
        <h2 class="sdg-main-title">Sürdürülebilir<br>Kalkınma<br>Hedefleri</h2>
        <p class="sdg-main-desc">
          Birleşmiş Milletler'in 17 hedefi, gezegeni ve insanlığı kurtarmak için çizilen küresel haritadır.
          İklim krizi bu hedeflerin tamamını tehdit ediyor.
        </p>
      </div>

      <div class="sdg-orbit-wrapper">
        <div class="sdg-orbit-canvas" id="sdgCanvas">
          <div class="sdg-orbit-ring"></div>
          <div class="sdg-center-core">
            <video autoplay muted loop playsinline aria-hidden="true" class="sdg-center-gif">
              <source src="{{ asset('assets/iklim-krizi/video/dunya-earth-loop.webm') }}" type="video/webm">
              <source src="{{ asset('assets/iklim-krizi/video/dunya-earth-loop.mp4') }}" type="video/mp4">
            </video>
          </div>
        </div>
      </div>

      <div class="sdg-card-panel" id="sdgInfoCard">
        <button type="button" class="sdg-card-close" aria-label="Kapat">&times;</button>
        <div class="sdg-card-inner" id="sdgCardInner"></div>
      </div>

      {{-- The interactive orbit of the 17 goals is drawn by JavaScript; this plain
           list keeps the goals readable when JS is unavailable. --}}
      <noscript>
        <ol class="sdg-fallback-list">
          <li>Yoksulluğa Son</li>
          <li>Açlığa Son</li>
          <li>Sağlıklı Bireyler</li>
          <li>Nitelikli Eğitim</li>
          <li>Cinsiyet Eşitliği</li>
          <li>Temiz Su ve Sanitasyon</li>
          <li>Erişilebilir Enerji</li>
          <li>İnsana Yakışır İş</li>
          <li>Sanayi ve Yenilikçilik</li>
          <li>Eşitsizliklerin Azaltılması</li>
          <li>Sürdürülebilir Şehirler</li>
          <li>Sorumlu Tüketim</li>
          <li>İklim Eylemi</li>
          <li>Sudaki Yaşam</li>
          <li>Karasal Yaşam</li>
          <li>Barış ve Adalet</li>
          <li>Hedefler İçin Ortaklık</li>
        </ol>
        <p><a href="https://sdgs.un.org/goals" target="_blank" rel="noopener noreferrer">BM'nin resmi Sürdürülebilir Kalkınma Hedefleri sayfasını görüntüle →</a></p>
      </noscript>

    </div>

  </section>

  {{-- What is happening --}}

  <div class="ik-seam" aria-hidden="true"></div>

  <section id="happening-section" class="section-dark theme-white">

    <div class="section-header" data-aos="fade-up">
      <h2 class="section-title">Neler <em>Oluyor?</em></h2>
      <p class="section-desc">Buzullar eriyor, denizler ısınıyor, termometreler rekor kırıyor. Kutuplardan
        Türkiye kıyılarına, gezegenin şu anda verdiği sinyalleri kanıtlarıyla ve rakamlarıyla bir araya getirdik.</p>
    </div>

    {{-- Vital signs (science.nasa.gov/climate-change): endlessly scrolling card
         strip driven by pure CSS (@keyframes hover-ticker-scroll). The cards are
         rendered twice so the loop is seamless; the second copy is aria-hidden so
         screen readers hear each card once. Hovering pauses the strip. --}}
    <div class="hover-ticker" id="vitalSignsTicker">
      <div class="hover-ticker-track">
        @foreach ([false, true] as $isLoopCopy)
          <div class="vital-sign-card"@if ($isLoopCopy) aria-hidden="true"@endif>
            <div class="vital-sign-card-bg" style="background-image:url('{{ asset('assets/iklim-krizi/image/wikipedia/komur-termik-santrali.webp') }}');"></div>
            <i class="fa-solid fa-smog"></i>
            <span class="vital-sign-value"><span class="count-num" data-count-to="431" aria-live="off">431</span>&#8239;<small>ppm</small></span>
            <span class="vital-sign-label">Atmosferdeki CO₂ yoğunluğu, Haziran 2026 itibarıyla</span>
          </div>
          <div class="vital-sign-card"@if ($isLoopCopy) aria-hidden="true"@endif>
            <div class="vital-sign-card-bg" style="background-image:url('{{ asset('assets/iklim-krizi/image/nasa/kum-tepeleri-gun-dogumu.webp') }}');"></div>
            <i class="fa-solid fa-temperature-high"></i>
            <span class="vital-sign-value"><span class="count-num" data-count-to="1.19" data-count-decimals="2" data-count-plus="true" aria-live="off">+1,19</span>&#8239;<small>°C</small></span>
            <span class="vital-sign-label">1951-1980 dönemi ortalamasına kıyasla 2025 yılı küresel ortalama sıcaklık artışı</span>
          </div>
          <div class="vital-sign-card"@if ($isLoopCopy) aria-hidden="true"@endif>
            <div class="vital-sign-card-bg" style="background-image:url('{{ asset('assets/iklim-krizi/image/nasa/metan-yogunlugu.webp') }}');"></div>
            <i class="fa-solid fa-flask"></i>
            <span class="vital-sign-value"><span class="count-num" data-count-to="1938" aria-live="off">1.938</span>&#8239;<small>ppb</small></span>
            <span class="vital-sign-label">Atmosferdeki metan (CH₄) yoğunluğu, Mart 2026 itibarıyla</span>
          </div>
          <div class="vital-sign-card"@if ($isLoopCopy) aria-hidden="true"@endif>
            <div class="vital-sign-card-bg" style="background-image:url('{{ asset('assets/iklim-krizi/image/nasa/grace-fo-uydusu.webp') }}');"></div>
            <i class="fa-solid fa-icicles"></i>
            <span class="vital-sign-value"><span class="count-num" data-count-to="-12.2" data-count-decimals="1" data-count-percent="true" aria-live="off">-%12,2</span>&#8239;<small>/on yıl</small></span>
            <span class="vital-sign-label">Arktik deniz buzunun eylül ayı yıllık en düşük seviyesindeki on yıllık gerileme oranı</span>
          </div>
          <div class="vital-sign-card"@if ($isLoopCopy) aria-hidden="true"@endif>
            <div class="vital-sign-card-bg" style="background-image:url('{{ asset('assets/iklim-krizi/image/un/UN7262680.webp') }}');"></div>
            <i class="fa-solid fa-mountain"></i>
            <span class="vital-sign-value"><span class="count-num" data-count-to="-266" aria-live="off">-266</span> / <span class="count-num" data-count-to="-135" aria-live="off">-135</span>&#8239;<small>Gt/yıl</small></span>
            <span class="vital-sign-label">Grönland ve Antarktika buz tabakalarının yıllık kütle kaybı</span>
          </div>
          <div class="vital-sign-card"@if ($isLoopCopy) aria-hidden="true"@endif>
            <div class="vital-sign-card-bg" style="background-image:url('{{ asset('assets/iklim-krizi/image/nasa/sentinel-6-uydusu.webp') }}');"></div>
            <i class="fa-solid fa-water"></i>
            <span class="vital-sign-value"><span class="count-num" data-count-to="102.4" data-count-decimals="1" data-count-plus="true" aria-live="off">+102,4</span>&#8239;<small>mm</small></span>
            <span class="vital-sign-label">Küresel ortalama deniz seviyesi yükselişi, uydu ölçümlerinin başladığı 1993'ten bu yana</span>
          </div>
          <div class="vital-sign-card"@if ($isLoopCopy) aria-hidden="true"@endif>
            <div class="vital-sign-card-bg" style="background-image:url('{{ asset('assets/iklim-krizi/image/nasa/mercan-resifi.webp') }}');"></div>
            <i class="fa-solid fa-droplet"></i>
            <span class="vital-sign-value"><span class="count-num" data-count-to="372" data-count-plus="true" aria-live="off">+372</span>&#8239;<small>ZJ</small></span>
            <span class="vital-sign-label">Okyanuslarda 1955'ten bu yana biriken fazladan ısı enerjisi</span>
          </div>
        @endforeach
      </div>
    </div>

    {{-- Evidence of change (science.nasa.gov/climate-change/evidence): rows
         alternate text/photo sides (zigzag). --}}
    <div class="container evidence-zigzag">
      <div class="evidence-row">
        <div class="evidence-row-text">
          <h3>Buz Tabakaları Küçülüyor</h3>
          <p>NASA'nın GRACE uydu verilerine göre Grönland buz tabakası 1993-2019 arasında yılda ortalama 279 milyar ton, Antarktika ise 148 milyar ton buz kaybetti.</p>
        </div>
        <img loading="lazy" class="evidence-row-photo" src="{{ asset('assets/iklim-krizi/image/nasa/thwaites-buzulu.webp') }}" alt="Thwaites buzulu" decoding="async" width="1600" height="900">
      </div>
      <div class="evidence-row">
        <div class="evidence-row-text">
          <h3>Buzullar Geri Çekiliyor</h3>
          <p>Alpler'den Himalayalar'a, Andlar'dan Alaska ve Afrika'ya kadar dünyanın hemen her yerindeki buzullar hızla küçülüyor.</p>
        </div>
        <img loading="lazy" class="evidence-row-photo" src="{{ asset('assets/iklim-krizi/image/nasa/miles-buzulu.webp') }}" alt="Geri çekilen buzul" decoding="async" width="1024" height="683">
      </div>
      <div class="evidence-row">
        <div class="evidence-row-text">
          <h3>Kar Örtüsü Azalıyor</h3>
          <p>Uydu gözlemleri, Kuzey Yarımküre'deki ilkbahar kar örtüsünün son 50 yılda azaldığını ve karların her geçen yıl daha erken eridiğini gösteriyor.</p>
        </div>
        <img loading="lazy" class="evidence-row-photo" src="{{ asset('assets/iklim-krizi/image/nasa/kar-ortusu.webp') }}" alt="Azalan kar örtüsü uydu görüntüsü" decoding="async" width="320" height="240">
      </div>
      <div class="evidence-row">
        <div class="evidence-row-text">
          <h3>Deniz Seviyesi Yükseliyor</h3>
          <p>Küresel deniz seviyesi son yüzyılda yaklaşık 20 santimetre yükseldi. Son yirmi yıldaki yükseliş hızı ise geçen yüzyılın neredeyse iki katı ve her yıl biraz daha hızlanıyor.</p>
        </div>
        <img loading="lazy" class="evidence-row-photo" src="{{ asset('assets/iklim-krizi/image/nasa/norfolk-su-baskini.webp') }}" alt="Kıyıda su baskını" decoding="async" width="640" height="480">
      </div>
      <div class="evidence-row">
        <div class="evidence-row-text">
          <h3>Arktik Deniz Buzu Azalıyor</h3>
          <p>Arktik deniz buzunun hem kapladığı alan hem de kalınlığı son birkaç on yılda hızla azaldı.</p>
        </div>
        <img loading="lazy" class="evidence-row-photo" src="{{ asset('assets/iklim-krizi/image/nasa/arktik-deniz-buzu-min.webp') }}" alt="Arktik deniz buzu" decoding="async" width="320" height="240">
      </div>
      <div class="evidence-row">
        <div class="evidence-row-text">
          <h3>Aşırı Hava Olayları Sıklaşıyor</h3>
          <p>ABD'de 1950'den bu yana rekor yüksek sıcaklık olayları artarken rekor düşük sıcaklık olayları azalıyor. Yoğun yağış olaylarının sayısı da giderek artıyor.</p>
        </div>
        <img loading="lazy" class="evidence-row-photo" src="{{ asset('assets/iklim-krizi/image/nasa/belcika-sel.webp') }}" alt="Belçika'da sel" decoding="async" width="768" height="576">
      </div>
    </div>

    {{-- Data scenes: Global warming → Oceans → Forest fires, moving from the planet
         to our seas and forests. The media stays sticky while the narrative steps
         scroll beside it (below it on mobile); the "Data scenes" module in
         script.js maps the active step and scroll progress onto the media.
         Without JS the static ÇŞB charts stand in for the live charts. --}}
    <div class="container ik-scenes">

      {{-- Global warming: data.giss.nasa.gov/gistemp + cevreselgostergeler.csb.gov.tr/sicaklik-85727 --}}
      <article class="ik-scene" id="global-isinma" data-scene="stripes" aria-labelledby="global-isinma-title">
        <header class="ik-scene-header" data-aos="fade-up">
          <h3 class="ik-scene-title" id="global-isinma-title">Global Isınma</h3>
          <p class="ik-scene-lead">NASA'nın Goddard Uzay Çalışmaları Enstitüsü (GISS) yaklaşık 45 yıldır küresel sıcaklığı izliyor. Aşağı kaydırdıkça 1880'den bugüne her yıl grafiğe bir şerit olarak ekleniyor.</p>
        </header>

        <div class="ik-scene-body">
          <div class="ik-scene-media">
            <figure class="ik-chart ik-chart-live">
              <div class="ik-stripes-readout" aria-hidden="true">
                <span class="ik-stripes-year"></span>
                <span class="ik-stripes-value">
                  <span class="ik-stripes-value-number"></span>
                  <span class="ik-stripes-value-label">1951-1980 ortalamasına göre</span>
                </span>
              </div>
              <div class="ik-stripes-frame">
                <div class="ik-stripes-marks" aria-hidden="true"><span class="ik-stripes-record"></span></div>
                <div class="ik-stripes" role="img" aria-label="NASA GISTEMP v4 verisiyle 1880-2025 arasında her yıl için bir şerit. 1977'den bu yana hiçbir yıl 1951-1980 ortalamasının altında kalmadı; en sıcak yıl +1,29 °C ile 2024."></div>
                <div class="ik-stripes-axis" aria-hidden="true">
                  <span class="ik-stripes-axis-start"></span>
                  <span class="ik-stripes-baseline">1951-1980 ortalaması</span>
                  <span class="ik-stripes-axis-end"></span>
                </div>
              </div>
              <div class="ik-scale-legend" aria-hidden="true"></div>
              <figcaption class="ik-chart-source">Kaynak: <a href="https://data.giss.nasa.gov/gistemp/" target="_blank" rel="noopener noreferrer">NASA GISS, GISTEMP v4</a> (yıllık küresel ortalama). Şerit fikri: <a href="https://showyourstripes.info/" target="_blank" rel="noopener noreferrer">Ed Hawkins, #ShowYourStripes</a>.</figcaption>
            </figure>
            <noscript>
              <figure class="ik-chart">
                <img class="ik-chart-fallback" src="{{ asset('assets/iklim-krizi/image/csb/dunya-turkiye-yillik-sicakliklar.webp') }}" alt="Grafik: Dünyada ve Türkiye'de yıllık ortalama sıcaklıklar, 1971-2023" width="674" height="292" loading="lazy" decoding="async">
                <figcaption class="ik-chart-source">Kaynak: ÇŞB Çevresel Göstergeler</figcaption>
              </figure>
            </noscript>
            <div class="ik-reveal">
              <div class="ik-reveal-panel" id="global-isinma-spiral" data-reveal-label="Sıcaklık spirali" data-reveal-title="NASA'nın küresel sıcaklık spirali" data-reveal-meta="1880'den bugüne küresel sıcaklık sapmaları · NASA GISS" data-reveal-icon="fa-circle-play">
                <video class="ik-data-video" src="{{ asset('assets/iklim-krizi/video/gistemp-spiral.mp4') }}" controls muted playsinline preload="none"></video>
              </div>
            </div>
          </div>

          <ol class="ik-scene-steps">
            <li class="ik-scene-step">
              <h4 class="ik-scene-step-title">Her Şerit Bir Yıl</h4>
              <p>Maviler 1951-1980 ortalamasından serin, kırmızılar sıcak geçen yılları gösteriyor; renk koyulaştıkça fark büyüyor. Sayfadaki bölümleri ayıran ince şeritler de bu verinin dönemleri.</p>
            </li>
            <li class="ik-scene-step" data-marks="baseline">
              <h4 class="ik-scene-step-title">Neden Sıcaklık Değil de Sapma?</h4>
              <p>GISS bir yılın sıcaklığını, 1951-1980 ortalamasından ne kadar saptığıyla ölçüyor. Yakın istasyonlardaki sapmalar ~1.300 km'ye kadar güçlü biçimde birbirine benzediği için ölçümün seyrek olduğu bölgeler de güvenilir biçimde hesaplanabiliyor.</p>
            </li>
            <li class="ik-scene-step" data-marks="baseline">
              <h4 class="ik-scene-step-title">Son Kırk Yıl</h4>
              <p>1976, bu ortalamanın altında kalan son yıl oldu; 1977'den bu yana hiçbir yıl altına inmedi. Isınmanın büyük kısmı son 40 yılda yaşandı ve her on yıl bir öncekinden sıcak geçti: 1980'ler <strong>+0,25 °C</strong>, 1990'lar <strong>+0,39 °C</strong>, 2000'ler <strong>+0,59 °C</strong>, 2010'lar <strong>+0,81 °C</strong>.</p>
            </li>
            <li class="ik-scene-step" data-marks="baseline record">
              <h4 class="ik-scene-step-title">2024: Kayıtların En Sıcak Yılı</h4>
              <p>NASA GISS'e göre 2024, ölçümlerin başladığı 1880'den bu yana en sıcak yıl oldu: 1951-1980 ortalamasına göre <strong>+1,29 °C</strong>, sanayi öncesine (1850-1900) göre <strong>+1,47 °C</strong>. +1 °C'yi aşan beş yılın hepsi 2016 ve sonrasında. Ölçek için: son buzul çağını tetikleyen küresel sıcaklık düşüşü yalnızca 5 °C'ydi.</p>
            </li>
            <li class="ik-scene-step" id="turkiyede-sicaklik" data-marks="baseline record">
              <h4 class="ik-scene-step-title">Türkiye'de Sıcaklık</h4>
              <p>2018'de Türkiye'nin ortalama sıcaklığı 15,4 °C ile 1981-2010 ortalamasının (13,5 °C) <strong>1,9 °C</strong> üzerindeydi; aynı yıl dünya ortalaması kendi bazının 0,36 °C üzerindeydi. 2007'den bu yana (2011 hariç) her yıl pozitif anomali gözleniyor; donlu gün sayısı özellikle doğu ve iç kesimlerde azalıyor.</p>
              <p>Enerji talebi de değişiyor: 2007-2018 ortalamasına göre 2018'de ısıtma gün-derecesi 2.058'den 1.725'e (-%16) düşerken soğutma gün-derecesi 358'den 381'e (+%6) çıktı.</p>
              <div class="ik-doc-links">
                <button type="button" class="ik-doc-link" aria-haspopup="dialog" data-lightbox-src="{{ asset('assets/iklim-krizi/image/csb/dunya-turkiye-yillik-sicakliklar.webp') }}" data-lightbox-alt="Grafik: Dünyada ve Türkiye'de yıllık ortalama sıcaklıklar, 1971-2023 (ÇŞB)"><span class="ik-doc-link-icon" aria-hidden="true"><i class="fa-solid fa-chart-line"></i></span><span class="ik-doc-link-text"><span class="ik-doc-link-name">Dünya ve Türkiye sıcaklıkları</span><span class="ik-doc-link-meta">ÇŞB grafiği · 1971‑2023</span></span><i class="fa-solid fa-up-right-and-down-left-from-center ik-doc-link-expand" aria-hidden="true"></i></button>
              </div>
            </li>
          </ol>
        </div>
      </article>

      {{-- Ocean warming: MGM 2024 sea surface temperature reports +
           cevreselgostergeler.csb.gov.tr/deniz-suyu-sicakligi-85730 + NASA ocean warming --}}
      <article class="ik-scene" id="okyanuslarin-isinmasi" data-scene="photos" aria-labelledby="okyanuslarin-isinmasi-title">
        <header class="ik-scene-header" data-aos="fade-up">
          <h3 class="ik-scene-title" id="okyanuslarin-isinmasi-title">Okyanusların Isınması</h3>
          <p class="ik-scene-lead">Deniz suyu sıcaklığı iklim değişikliğinin en doğru göstergelerinden biri. Denizlerdeki ısınma hem ekolojik yapıyı hem de kıyı ekonomilerini doğrudan etkiliyor.</p>
        </header>

        <div class="ik-seas">
          <figure class="ik-chart ik-seas-figure">
            {{-- Map: Natural Earth 1:10m land and sea polygons (public domain), cropped and
                 simplified for this page. Sea colour encodes the increase between the two
                 periods (style.css: .ik-map-sea). --}}
            <div class="ik-seas-map" role="img" aria-label="Harita: 1970-1980 ile 2014-2024 dönem ortalamaları arasında deniz suyu sıcaklığındaki artış. Marmara +2,2 °C, Ege +1,6 °C, Karadeniz +1,4 °C, Akdeniz +1,3 °C.">
              <svg class="ik-seas-map-svg" viewBox="0 0 1000 633" aria-hidden="true" focusable="false"><rect class="ik-map-water" width="1000" height="633"/><path class="ik-map-sea" data-sea="karadeniz" d="M834 0l24 19 27 27 29 21 18 6 12 8 3 7 14 5 4 5 8 33 5 12 0 9-3 7-14 18-16 11-13 4-7 6-21 9-7 1-6-2-9 0-19-8-29 5-14 6-9 0-23-5-8-4-34-7-4-6-10-6-7 1-7 6-5-1-6-4-5-6-6-16-7-2-18 5-13-6-8-10-1-5 2-4-7-2-13 6-72-3-49 18-11 9-31 17-5 10-5 4-22 1-23-7-21 3-30-5-13 1-5-2-30-14-7-6-11-19 2-7-2-5-13-20-11-7 13-16 7-2 2-28 10-14 9-2 7 3 5-7 1-19 4-12-1-14z"/><path class="ik-map-sea" data-sea="marmara" d="M344 204l5 0 3 5 13 8 24 3-1 1-44 7-8 6 13 7-2 3-19 0-17-1-16 2-1-1 3-7-6-1-5 0-2 2 6 6-6 3-13 1-7-4-2-5-8 1-6 3-14 0-2-2 4-4 24-12 9-10 3-9 13-2 8 1 13-6 30 7 8-2z"/><path class="ik-map-sea" data-sea="ege" d="M209 263l-4 14 1 13-3 6 1 7 35-7 4 1 0 2-11 15 8 11-2 10 10 5-5 7-7 4 7 15 3 2 9-1-3 3-11 2-7-2-3 5-4-5 0-9-4-5-3-1-3 1-1 4 3 8 0 5-4 0-3 6 15 8 5-3 6 4 4 5 3-1 14 6 1 6-1 10-8 2 0 2 4 4 3 13 4 3 4 0 7 6 1 6-12 2-2 3 1 7 4-3 44-1-12 13-3 1-15 2-8 3-8-7-8 4-6 1-4 3-2 0 2-3-24 11-7 6-3-3 0-3-43-7-1 3-5-5-26-13-2 2-2-4-8-9-4-1 1-4-2-8-1 0-3-15-2 2 0-4-11-8-2-28-3-8-14-5-5-9-10-2-6-9-6 0-5-5-23-8 2-2 10 0 13-9-5 0-4-8-2-6 4-3 3-2 9 5 0 3-3 5 2 2 3 0 6-5-5-11-6-9-7-5-7-15-12-15-1-5 4-16-1-8 9-5 6-1-4 6 2 6 21 12 1 8 3 6 12 4 2-2-10-7-4-10 2-2 11 2 9 13 5 4 3-4-2-6-12-11 1-3 4-2 5 1 12 5 9 8-6-11-9-6-9 0-1-4 2-4-7-9 1-4 16 1 8-4 7-8 5-2 10 5 5 1 16-9 7 4 4-1 8 4 18 3 8 4 4 10 34-1-3 6-14 6-9 8 0 8-2 7zM234 415l6 4 10-4-1-4-10-3-9 2-3 4 7 1zM202 313l-8 1-4 6 3 4 9 2 5-6 5 0-9 7 3 4 11 3 8-1-3-5 5 2 0-5-10-10 1-4-3-3-9 1 0 2-4 2zM193 381l5 5 5-4 1-4 2-1 0-15-7-4-9 2 1 4 7 10-6 5 1 2zM175 448l-9 8 5 9 5-3 1-4 1-7-3-3zM167 267l-4 4-3-3-9 1 1 9 6 1 3-4 1 5 4 1 5-15-4 1zM137 397l-3 2 0 4 13 13 1-4-2-10-5 0-4-5zM131 231l6-2 1-6-3-5-5 0-5 7 0 2 6 4zM70 335l-5-5-3 0-19 11 1 1 7-1 11 4 18 16 2 7 5 3 14 0 7 12 2 6 7 6 9 3 2-3 0-7-1-1-10-1-4-4-5-15 1-5-4-7-1-2-11-1-18-8-5-9zM78 554l-18-16-9-23 3-7-4-4 4-10 3 2-5-13 0-13-10-28-4-7-2-9 2-3 4 3 8 3 4 3 0 5 4 2 16-7-5-9-10-2-2-7 0-5-6-5 8-5 11-2 4-3 4 2 20 21 4-2 11 8 0 4 2-2 3 15 1 0 2 8-1 4 4 1 8 9 2 4 2-2 26 13 5 5 1-3 43 7 0 3 3 3 7-6 24-11-2 3 2 0 4-3 6-1 8-4 8 7-1 2 4 1 6 1 7-4 14-1-3 5 0 3 3-1 3 15-11 4-10 11 2 7-2 7 1 2-28 20 3-13-4 2 0 4-4 8 2 5 0 5-41 8-6 6-7 0-11 6-3-1 1-12-1-1-13 3-18-3-5-4-14-1-14 4-7 0-1-2-1-5-4 1-4-3 5-2-2-4-3 0-4 4-8 0-3-1-3-7-1 7-2 2-3-3-2 2z"/><path class="ik-map-sea" data-sea="akdeniz" d="M0 633l0-139 24 2 0-8 6-14 9 0 10 16 5 4-4 10 4 4-3 7 9 23 18 16-1 8 2 10 2 1 12-1 29 6 12 4 2 9 3 1 51-5 16 0 4-2 4-17 39-8 0-5-2-5 4-8 0-4 4-2-3 13 28-20 5 0 6-8 6-1-1-4 4-5 4-10 0-5-4 2-3-15 6-3 5-8 9 1 16 8 4 0 4-3 3 2 6 19 4 4 6 5 17 6 26-9 8 4 3-2 6-16 1-18 3-4 29 3 6 1 21 12 12 5 18 22 7 6 13 4 7-4 29-3 9-2 13-8 17-19 15-12 5-2 5 1 18 11 11 3 7-1 5-4 1-4 19-12 7 7 0 9-15 16-3 6 7 20-6 10-4 18 7 9 2 13-2 17 4 26-9 7-5 9zM511 591l6 14 12 6 9-1 4 5 3 1 3-7 17-5 14-14 18-1-7-14 1-6 31-23-18 7-7 5-22 7-15 1-18-3-3 14-6 1-6-2-4 2-9 7-4-2 1 8z"/><path class="ik-map-land" d="M676 633l8-9-1-2 5 0 5-5-7-24 2-6 0-6 3-6-2-5 0-9-5-5-2 0 0-2-3-3 3-2 0-4 3-5-2-6 4 0 5-10-9-20 12-14 7-4 2-4-1-8-5-7-6-1-9 9-6 0-3 3 0-1-2 3 3-1 1-2 3 1-5 4 4-3-3 6-4 2-3-2 2 2-4-1-5 4-18-12-4 0 0-1-7-5-4 0-6 3-14 12-5 7-5 4 0 5-4 2-2 6-1-5-3-2-4 5-5 4 0 2-2-3-5 4-5-2-15 1-3 4-7-1-7 4-7-1-15-8-17-24-10-2-4-4-18-8-2-2-19-4-9 1-4-3-6 7 0 16-4 9 2 3-5 8-1 1-1-4-6-3-5 1-2 4-4-1-3 2-7 2-3 3-3-1-2 2-2-4-3 0 2-1-10-2 0-2-3 2-13-10 2-1-2-4 2-1-1-4-5 0 2-5 3 0-1-2-7-6-5 6 1 2 1-3 1 1-2 3-2 1 1-3-5-3-4 0-1-2-1 1-1-7 0 1-3-1-1 2-2-1-2-5-3 2 2 1-1 3-4-2 0 1-2 0 2-2-3-1-1 5 3 3-3 0-10 10-3 0-1-2 4 0 2-3-2 0 0-3-1 1-3-1 8-2-2-2 1-1 1 1-1-3-3 2-6 2-10-1-2 6-6-2-4 3-3-1-3-3 3 0 2-3 8-1 1-2 6 1 7-2 6 2 2-1-3-4 3 0-2-3 2-1-1-1 6 1 0 1 0-2 1 0 2-4 1 1 4-3-10 0-1 1-6-1-10 3-10-1-1 2-6-3-2 0 0 2-1-2-2 0-1 4-2 0-2-7 3-3-2-1 3 0 0-2 1 2 3-1 3 4 6-3-2-4 3 0-1 1 2-1-1-2 1-3-3 0-2 3 0-3-3 1 2-5-1-1-1 3-3-1 0-3 2-2-1-1-5 3 1 1-4 1-3-2 2-3 0-4-3 0 2-8-10-4 1-2 9-1 2-2-1-8 2-4-2-4-4 0-9-5-5 2-5-12-6 1-3 7-3-5-5-3 0 2-2-4-1 2-6-3 3-3 0-3 1-1 0 3 3 1 0-2 5-1-2-4 2 1 1-1-3-3-3 1 1-2-3-9 3-3 5 2 6 8 1 3-3 1 0 3 4 7 2-8 4 4 11-3 4 1 4-4-7 0-5 2-6-7 4 2-3-3 1-3-3 0-3-3 1-1-1-4 5-2 4 1 1-2-2-3 2-1 2 2-1-3 6-2-1-4-3 2-3-2-3 2-3-2-1-5 4-3 0-1-6-7-1-4-6-1 2-3 1 2 7-7 0-2 6-4 0-5-23 3-11 4-8-1 4-11 0-19 2-4 2 1 6-4 2-9 5-1 11-12 13 1 5-4 10-1 2 3-2 1 8 5 15 0 6-4-4-1-6-6 4-3 14 4-7 5 2 2 20-2 15 2 6-2 13 2 3-4 3 0-2-2-5-1-2 1-10-4 10-7 15-2 6-3 1 2 4-3 3 2 10-2 8 1 1-3-8 1-5-3-15 2-3-4-3 1 2-2-1-2-12-7-1-3 3-3 1-4-1-1 5-5 35 5 13 0 7-4 27 8 20 0 8-6 1-9 37-19 5-6 7-2 10-6 16-3 20-9 49 5 8-2 10 2 10-4 3-6 4 1 3 4 4-1 2 1-5 1-1 5 7 11 3 3 14 5 19-7-2 6 3-5 3 2 5 6 0 9 13 13 2 1 4-1 5-7 7 0 11 5 3 7 4 2 8 1 12 6 4-1 4-5 1 1 3 0 0 4 6 5 18 2 3 2 11-1 5-3 4 1 9-5 13-3 5 2 8-4 3 1 7 6 5-1 8 4 5-1 6 4 9-3 8-6 5 1 7-4 6-6 5 0 24-12 16-23 2-5-1-11-5-8-9-36-4-5-8-3-4 1-6-13-5 1-4-5-13-2-9-5-3 2-6-12-14-5-3-6-8-5-19-21-11-8-6-8-7-3-504 0 0 2-2 1 2 10-4 13-1 12 2 4-2 6-5 5-7-4-8 2-3 2-4 9-6 2 2 2-3 9 1 20-8 0 0 3-5 2 1 5-7 0-3 6 1 2 0-2 2 2 1-2 5 1 1 2 3 0-1 1 1 4 3 0-1 5 12 14 2 9-3 1 0 4 6 13 4 4 10 7 26 12 10 2-3 4 1 2-4 8-8 3-10 0-4-8-1 0 2 3-1 3-5-3-14-3-7 3-4 4-10-2-11 1-4 10-7 9-6 4-6 1-3 3-15 7-4 7-13 10 2 3-11 6 5-11-2-7 17-10 5-1 3-4 3 1 2-3-2-4-9 2-5 2-3-1-17 1-5-13 3-2-3 0 0 1-4-2-19-1-12-5-1 1-5-1-2-1 2-2-2-1-5 0-2 4-5 2-4 4-5 0-2-2-2 2-3-6-3-1-6 2-4 3 1 2-1 1 2 0-12 7-6 0-7-4-6 3-1 4 5 6 6 3-5 2 2 6 7 2 1-4 3 5 8 3 8 11-5 1-7-9-7-2-4-4-10 1-2 3 1 3 3 4 11 5-1 5 2 1-2 4 1 0-4 0-4-4-1 1-1-6-6-7-12-4-3 1-2 2 2 5 6 7 9 3 1 3 3 1-3 1-11-4-6 1 1-3-3-6 1-5-2-4-13-5-3-4-4 0-3-8 6-1 2-2-3-5-4 0 0 3-4 1-1 3-4 0-1 3-3 1 4 6-6 13 1 7 7 6 1 5 6 6 5 13 7 5 9 12 4 9-7 3 1 1-1 1-8 0 2-3 1-1-1 4 6-5-4-8-10-4 1 4-5 1-1 4 1 4 1-2 2 1 1 3 3 4-1 4 5-2-4 5-7 2-3 3-5 0-3-2-5 2 0 1 2 0-1 1 2 1 6-1 4 4 13 3 3 7 4-1 0-3 6 3 1 3-2 3 4 1-2 2 9 1 1-1 3 2-1 1 5 7 14 4 5 5 0 5-4 1 3 7-1 5 1 1-1 1 2 2 0 3 1 1 0 7-2 3-4-2-3-7-4-3-2 2-4-9-3 1 0-2-4-1 2-4-4 0-3 1-2 3-9 0-7 4-4-1-1 3 1 2 5 0 4 3 0 2-4 2 3 1 0 7 8 5 1-2-2-3 4-2-1 6 2 2-1 0 4 2 3 3-13 3-2 1 2 2-4 1 1 2-2 0-5-3 0-3 1 0 1-2 2 1-1-2-4-1 0-2-2 2-4-5-4 1-3-5-3 2 2 11 7 13 0 5 2-1 2 3 1 9 4 8-1 2 2 0-1 3-2-1-1 2 0 2 1 0-1 3 2 4 4 3-1 2 4 3-1 2-5-1-2-5-4 0-5-7 1-2-3-2-1 1-1-8-5-1-5 2 0 3-3 3 1 3-1-1 0 3-2 0 1 9-1 5-1-4-5-4 1-2 0-10-1 0-7-12-4-1 1-7-6-1-2 1 0-83 11 8 5 1 18 7 9 8 4 0 1-2-6-4 1-1 4-2 6 2 5-2 2-1-2-3 3 0-5-2 1-1-1-1-3 2-6-3-1 1 2 1-3 0-1-3-4 1-2-2 2-2-6-2-2-5 0 2-3 2 1 2-2 1-5-9-3-2-1 7-8-1-2 3-2-3-7-2 0-371 1000 0 0 633zM128 386l-1 11-4 2-3-4-3 3-4-7-4 0-1-9-3 0 2-4-3 2 1-3-5-2 2-1-1-3-19-1-3-3 2-3-1-3-5-3-3-5-12-10-12-3 1 2-8 2 0-2 10-5 5-5 8-2 7 5 2 8 6 4 6 1 2 2 5 3 11 0 4 2-2 3 5 5-2 3 0 4 4 8 0 4 4 4 7 1 5-1zM228 329l0 3-3-1-3-6-2 1 5 6-1 2-5 1-13-4-4-4 7-3 4-3-1-1-5 0-6 7-8-4-3-2 0-3 4-5 1 2 5-1 6-2 0-4 10 0 0 2 3 1-2 4 8 7 3 7zM246 561l2-1 0 3-7 3-1-1 3-4 3 0zM267 496l0 2 3 0-4 2-1-3-3 0 0-3 3 0 2 2zM79 437l-4 1-1 2-6 1 4-4 7 0zM77 411l-1 5-4 0-1-5 6 0zM280 227l4 0-1 2-6 3-3-2 1-4 5 1zM241 452l1 2-2 0-4-5 4-1 1 4zM258 555l1 3-3 0-2 4-2-3 1-6-2-3 4-8 0-5 3-2 0 7-3 6 3 7zM50 504l5 5-3 1 0 5-3 0-4-4 0-8 2-4 3 5zM216 483l5 4-4 1-3 4-3-5 4 1 3-1-2-4zM122 476l3-1 1 6-11 2 2-7 3 3 2-1-3-2 3 0zM261 466l4 3-7 3-4 4-4-1-3 1-1 5-2-2 0-4 3 0 9-8 5-1zM198 464l4 3-4 0-6 6-6 2-1-2 5 0 0-3 7-3-1-2 2-1zM162 457l-4 4-4-2 2-6 4-2 0 1 1 0 2-1-1 6zM175 448l3 3-1 8-1 3-5 3-6-10 10-7zM168 434l-4 0 0-5 2-1 1 2 1-1 3 1-3 4zM153 423l-5-4 0-2 13 3 0 3-2 3-6-3zM118 416l1 4-6 6 0-7 5-3zM216 416l-7 8-12 3 5-8 6 1 8-4zM250 414l1 1-14 4-4-4-5 2-1-4 4-3 7-2 8 4-1-2 6 1-2 1 1 2zM148 411l-2 5-9-11-1-2-2 1-1-5 5-3 3 6 5 0 0 4 2 2-2 3 2 0zM133 345l-1 2-3-1-2 2-2-3 2 0 0-3-6-2 1-6 5 2 1 4 5 5zM171 266l0 3-5 5 0 8-6-4 2-2-1-2-4 4 2 3-3-1 1-2-6 1 1-5-2-5 10-1 3 3 8-5zM199 258l-1 2-12 2-5-2 5-5 8-2 3 1-1 4 3 0zM183 240l-1 1-5 2-7-5 7-2 5 1 1 3zM138 222l-1 0 1 1 0 6-7 3-3-3-3-1 0-5 6-6 4 1 3 4zM178 357l1 2-1 3-2 0-2-4 4-1zM71 323l-2-1 4-3 2 3-3 2-1-1zM149 296l2 2-3 5-1-5 2-2zM167 494l6 5-2 4-5-2 4-2-3-5zM291 487l0 3-2 0-1-3-3 0 4-4 1 0-2 2 3-1 0 3zM162 478l0-3 2-2 5 6-2 3-5-4zM134 458l3 6-3 2-3-7 0-2 3 1zM243 464l2-6-3-3 8 6 0 3-5 1-2-1zM121 449l4-2 0 5 0-1-1 2-2-1-2 0 1-3zM117 434l4-5-1 3 3 2-2 4-4 2 2-3 0-3-2 0zM146 432l1 3-4 2 0-2-1 0 1-7 3 1 0 3zM70 403l4-5-4 1 2-1-1-1 4-1 3 3-3 4-5 0zM83 325l-4-6 6 5 4 0-4 3-3-1 1-1zM96 318l-2 4-3 1 5-8 2 0-2 3zM309 497l-4 12-5 8 2 1-1 3-4-1-9 10-2 1-2-1-1-3 2-8-4-5 5-2 1-5 5-5 11-5 3 0 2-2 1 2zM206 362l-2 3 2 1 0 11-2 1 0 4-4 2-1 2-2 0-6-5 7-7-3-7-5-4 1-4 8-1 4 4 1-2 2 2zM214 568l-3 4 2 4 1-1-2 7-2 4-5 2-8-2-8 2-23 1-17 4-13 0 0-10-9-2-8-5-18 0-3-3-8-1-7 2-4-1-4-4 2-1 1-17 1-2 1 6 2 1 3-1 0-8 1-3 2 1 0 6 2 3 10 1 4-2-1-3 5 1 0 4-5 1 5 3 4-1 0 6 4 2 19-5 6 1 2-1 3 1 1-1 4 1 1 4 15 0 4 3 10-3 5 1-2 2 2 3-2 4 1 4 3 1 5-5 8-3 3 3 3-1 7-7zM621 545l2-1-1 3-21 15-5 6-3 0-3 2-1 8 10 12-7-1-5 3-5-3-4 1-3 10-9 3-2 0 0 1-7 3-8 1-4 4 1 4-4 0-2-6-12 0-12-6-2-6-3-3-2-13 7 3 6-8 16 1 3-5 0-10 7 2 18 2 11-2 6-4 13-3 7-5 18-8z"/><line class="ik-map-leader" x1="312" y1="222" x2="426" y2="294"/></svg>
              <p class="ik-seas-label" style="--left: 62.4%; --top: 13.1%;">Karadeniz <strong>+1,4 °C</strong></p>
              <p class="ik-seas-label" style="--left: 42.6%; --top: 46.5%;">Marmara <strong>+2,2 °C</strong></p>
              <p class="ik-seas-label" style="--left: 15.3%; --top: 55.5%;">Ege <strong>+1,6 °C</strong></p>
              <p class="ik-seas-label" style="--left: 40.6%; --top: 88.9%;">Akdeniz <strong>+1,3 °C</strong></p>
            </div>
            <div class="ik-seas-legend" aria-hidden="true">
              <span class="ik-seas-legend-title">1970-1980 ortalamasına göre artış</span>
              <span class="ik-seas-legend-ramp"></span>
              <span class="ik-seas-legend-ticks"><span>0</span><span>+1 °C</span><span>+2 °C</span></span>
            </div>
            <figcaption class="ik-chart-source">Kaynak: MGM 2024 deniz suyu sıcaklığı değerlendirmeleri (<a href="https://www.mgm.gov.tr/FILES/resmi-istatistikler/denizSuyu/2024-Karadeniz.pdf" target="_blank" rel="noopener noreferrer">Karadeniz</a>, <a href="https://www.mgm.gov.tr/FILES/resmi-istatistikler/denizSuyu/2024-Marmara.pdf" target="_blank" rel="noopener noreferrer">Marmara</a>, <a href="https://www.mgm.gov.tr/FILES/resmi-istatistikler/denizSuyu/2024-Ege.pdf" target="_blank" rel="noopener noreferrer">Ege</a>, <a href="https://www.mgm.gov.tr/FILES/resmi-istatistikler/denizSuyu/2024-Akdeniz.pdf" target="_blank" rel="noopener noreferrer">Akdeniz</a>). Harita: <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener noreferrer">Natural Earth</a>.</figcaption>
          </figure>

          <div class="ik-seas-text">
            <h4 class="ik-seas-title">Dört Denizimiz de Isındı</h4>
            <p>Meteoroloji Genel Müdürlüğü'nün (MGM) 2024 değerlendirmesinde 1970-1980 ve 2014-2024 dönem ortalamaları karşılaştırıldığında en büyük artış Marmara'da: <strong>15,0 °C'den 17,2 °C'ye</strong>. Dört denizde de artışın büyük bölümü son iki dönemde, 2003-2024 arasında gerçekleşti.</p>
            <div class="ik-reveal">
              <div class="ik-reveal-panel" id="denizler-donem-ortalamalari" data-reveal-label="Dönem ortalamaları" data-reveal-title="Deniz suyu sıcaklığı dönem ortalamaları (°C)" data-reveal-meta="MGM 2024 değerlendirmeleri, beş dönem" data-reveal-icon="fa-table">
              <p class="ik-reveal-title">Dönem ortalamaları (°C)</p>
              <div class="ik-data-scroll" tabindex="0" role="region" aria-label="Deniz suyu sıcaklığı dönem ortalamaları">
                <table class="ik-data-table">
                  <caption class="visually-hidden">MGM'ye göre beş dönemin ortalama deniz suyu sıcaklığı (°C)</caption>
                  <thead>
                    <tr><th scope="col">Dönem</th><th scope="col">Karadeniz</th><th scope="col">Marmara</th><th scope="col">Ege</th><th scope="col">Akdeniz</th></tr>
                  </thead>
                  <tbody>
                    <tr><th scope="row">1970-1980</th><td>15,1</td><td>15,0</td><td>18,2</td><td>21,0</td></tr>
                    <tr><th scope="row">1981-1991</th><td>14,8</td><td>15,2</td><td>18,3</td><td>21,1</td></tr>
                    <tr><th scope="row">1992-2002</th><td>14,9</td><td>15,4</td><td>18,5</td><td>21,4</td></tr>
                    <tr><th scope="row">2003-2013</th><td>15,6</td><td>15,8</td><td>19,0</td><td>21,9</td></tr>
                    <tr><th scope="row">2014-2024</th><td>16,5</td><td>17,2</td><td>19,8</td><td>22,3</td></tr>
                  </tbody>
                  <tfoot>
                    <tr><th scope="row">Artış</th><td>+1,4</td><td>+2,2</td><td>+1,6</td><td>+1,3</td></tr>
                  </tfoot>
                </table>
              </div>
              </div>
            </div>
            <p class="ik-doc-links-label">ÇŞB'nin yıllık grafikleri, 1970-2023</p>
            <div class="ik-doc-links">
              <button type="button" class="ik-doc-link" aria-haspopup="dialog" data-lightbox-src="{{ asset('assets/iklim-krizi/image/csb/karadeniz-suyu-sicakligi.webp') }}" data-lightbox-alt="Grafik: Karadeniz'de yıllık ortalama deniz suyu sıcaklıkları, 1970-2023 (ÇŞB)"><span class="ik-doc-link-icon" aria-hidden="true"><i class="fa-solid fa-chart-line"></i></span><span class="ik-doc-link-text"><span class="ik-doc-link-name">Karadeniz</span><span class="ik-doc-link-meta">Yıllık ortalama</span></span><i class="fa-solid fa-up-right-and-down-left-from-center ik-doc-link-expand" aria-hidden="true"></i></button>
              <button type="button" class="ik-doc-link" aria-haspopup="dialog" data-lightbox-src="{{ asset('assets/iklim-krizi/image/csb/marmara-denizi-suyu-sicakligi.webp') }}" data-lightbox-alt="Grafik: Marmara Denizi'nde yıllık ortalama deniz suyu sıcaklıkları, 1970-2023 (ÇŞB)"><span class="ik-doc-link-icon" aria-hidden="true"><i class="fa-solid fa-chart-line"></i></span><span class="ik-doc-link-text"><span class="ik-doc-link-name">Marmara</span><span class="ik-doc-link-meta">Yıllık ortalama</span></span><i class="fa-solid fa-up-right-and-down-left-from-center ik-doc-link-expand" aria-hidden="true"></i></button>
              <button type="button" class="ik-doc-link" aria-haspopup="dialog" data-lightbox-src="{{ asset('assets/iklim-krizi/image/csb/ege-denizi-suyu-sicakligi.webp') }}" data-lightbox-alt="Grafik: Ege Denizi'nde yıllık ortalama deniz suyu sıcaklıkları, 1970-2023 (ÇŞB)"><span class="ik-doc-link-icon" aria-hidden="true"><i class="fa-solid fa-chart-line"></i></span><span class="ik-doc-link-text"><span class="ik-doc-link-name">Ege</span><span class="ik-doc-link-meta">Yıllık ortalama</span></span><i class="fa-solid fa-up-right-and-down-left-from-center ik-doc-link-expand" aria-hidden="true"></i></button>
              <button type="button" class="ik-doc-link" aria-haspopup="dialog" data-lightbox-src="{{ asset('assets/iklim-krizi/image/csb/akdeniz-suyu-sicakligi.webp') }}" data-lightbox-alt="Grafik: Akdeniz'de yıllık ortalama deniz suyu sıcaklıkları, 1970-2023 (ÇŞB)"><span class="ik-doc-link-icon" aria-hidden="true"><i class="fa-solid fa-chart-line"></i></span><span class="ik-doc-link-text"><span class="ik-doc-link-name">Akdeniz</span><span class="ik-doc-link-meta">Yıllık ortalama</span></span><i class="fa-solid fa-up-right-and-down-left-from-center ik-doc-link-expand" aria-hidden="true"></i></button>
            </div>
          </div>
        </div>

        <h4 class="ik-scene-subtitle">NASA: Okyanus Isınmasının Etkileri</h4>

        <div class="ik-scene-body">
          <div class="ik-scene-media">
            <div class="ik-photos">
              <figure class="ik-photo">
                <img loading="lazy" decoding="async" src="{{ asset('assets/iklim-krizi/image/nasa/hurricane-lee-static.webp') }}" width="767" height="589" alt="NOAA GOES-East uydusu, 7 Eylül 2023'te Kasırga Lee'nin hızla şiddetlenişini görüntüledi">
                <figcaption>Kasırga Lee, 7 Eylül 2023 · NOAA GOES-East uydusu</figcaption>
              </figure>
              <figure class="ik-photo">
                <img loading="lazy" decoding="async" src="{{ asset('assets/iklim-krizi/image/nasa/article-i-before-after-1000.webp') }}" width="768" height="368" alt="Mercan beyazlaması: 2014-2015 arası Amerikan Samoası'nda bir resifin bozulma süreci">
                <figcaption>Mercan beyazlaması, Amerikan Samoası, 2014-2015</figcaption>
              </figure>
              <figure class="ik-photo">
                <img loading="lazy" decoding="async" src="{{ asset('assets/iklim-krizi/image/nasa/arcticseaice-dms-201185-06318-lrg.webp') }}" width="768" height="512" alt="NASA'nın Operation IceBridge uçuşunda, Mart 2011'de görüntülenen kırılan Arktik deniz buzu">
                <figcaption>Arktik deniz buzu, Mart 2011 · NASA Operation IceBridge</figcaption>
              </figure>
              <figure class="ik-photo">
                <img loading="lazy" decoding="async" src="{{ asset('assets/iklim-krizi/image/nasa/slide1.webp') }}" width="768" height="432" alt="NASA: Ekvator boyunca deniz yüzeyi yüksekliği anomalisi, El Niño'nun Pasifik Okyanusu üzerindeki imzası">
                <figcaption>Ekvator boyunca deniz yüzeyi yüksekliği anomalisi · NASA</figcaption>
              </figure>
              <figure class="ik-photo">
                <img loading="lazy" decoding="async" src="{{ asset('assets/iklim-krizi/image/nasa/eo-pe-iss062e117852.webp') }}" width="2048" height="1365" alt="Uluslararası Uzay İstasyonu'ndan çekilmiş Karayip Denizi fotoğrafı">
                <figcaption>Karayip Denizi, Uluslararası Uzay İstasyonu'ndan · NASA</figcaption>
              </figure>
            </div>
          </div>

          <ol class="ik-scene-steps">
            <li class="ik-scene-step" data-photo="0">
              <h5 class="ik-scene-step-title">Kasırgalar Değişiyor</h5>
              <p>Kasırgaların oluşup güçlenebilmesi için sıcak suya ihtiyacı var. Isınan okyanus sıcaklıkları, fırtınaların hızla şiddetlenmesinde önemli bir etken; yükselen deniz seviyeleri de kıyıdaki fırtına kabarması sellerini kötüleştiriyor.</p>
            </li>
            <li class="ik-scene-step" data-photo="1">
              <h5 class="ik-scene-step-title">Ekosistemler Değişiyor</h5>
              <p>Okyanus hem karbondioksiti hem ısıyı emiyor; çözünen karbondioksit suyu asitleştirip mercanların kabuk oluşturmasını zorlaştırıyor. Deniz sıcak hava dalgaları birçok mercanın hayatta kalamayacağı sıcaklıklar yaratıyor.</p>
            </li>
            <li class="ik-scene-step" data-photo="2">
              <h5 class="ik-scene-step-title">Deniz Buzu İnceliyor</h5>
              <p>Açık renkli deniz buzu güneş ışığını uzaya yansıtır; koyu renkli açık su ise emer. Isınan sular buzu alttan, ısınan hava üstten eritiyor; buz küçüldükçe ısınma daha da hızlanıyor.</p>
            </li>
            <li class="ik-scene-step" data-photo="3">
              <h5 class="ik-scene-step-title">El Niño Sıcaklığı Artırıyor</h5>
              <p>Tropikal Pasifik'in normalden sıcak hale gelmesiyle oluşan El Niño, birikmiş küresel ısınmaya eklenerek sıcak bir yılı daha da sıcak hale getirebiliyor (2023'te olduğu gibi).</p>
            </li>
            <li class="ik-scene-step" data-photo="4">
              <h5 class="ik-scene-step-title">Okyanus Dolaşımı Değişiyor</h5>
              <p>Grönland ve Antarktika buz tabakalarından okyanusa akan fazla tatlı su, derin okyanus akıntılarını yönlendiren sıcaklık-tuzluluk dengesini bozabilir. NASA uyduları bu ısı taşınımı değişimlerini izliyor.</p>
            </li>
          </ol>
        </div>
      </article>

      {{-- Forest fires: OGM Forestry Statistics 2024 (table 2.11) +
           cevreselgostergeler.csb.gov.tr/orman-yanginlari-85850 --}}
      <article class="ik-scene" id="orman-yanginlari" data-scene="fires" aria-labelledby="orman-yanginlari-title">
        <header class="ik-scene-header" data-aos="fade-up">
          <h3 class="ik-scene-title" id="orman-yanginlari-title">Orman Yangınları</h3>
          <p class="ik-scene-lead">Akdeniz iklim kuşağında yer alan Türkiye ormanlarının büyük bölümü yangın tehdidi altında.</p>
        </header>

        <div class="ik-fire-opener">
          <div class="ik-hero-figure">
            <p class="ik-hero-figure-value"><span class="count-num" data-count-to="27485" aria-live="off">27.485</span> <span class="ik-hero-figure-unit">hektar</span></p>
            <p class="ik-hero-figure-label">2024'te Türkiye'de orman yangınlarında yanan alan: yaklaşık 38.500 futbol sahası büyüklüğünde.</p>
            <p class="ik-chart-source">Kaynak: OGM, Ormancılık İstatistikleri 2024. Futbol sahası: 105 × 68 m (FIFA önerisi).</p>
          </div>
          <figure class="ik-fire-opener-photo">
            <img loading="lazy" decoding="async" width="768" height="512" src="{{ asset('assets/iklim-krizi/image/nasa/nasa-firesense-2023-8640-x-5760-gaw-78.webp') }}" alt="Kontrollü bir orman yangınından yükselen duman, Fishlake Ulusal Ormanı, Utah, ABD">
            <figcaption>Temsili görsel: NASA FIRMS, Utah, ABD</figcaption>
          </figure>
        </div>

        <div class="ik-scene-body">
          <div class="ik-scene-media">
            <figure class="ik-chart ik-chart-live">
              <div class="ik-fires-views">
                <div class="ik-fires-view" data-view="area">
                  <p class="ik-chart-title">Yıllık yanan alan, 1988-2024 (hektar)</p>
                  <div class="ik-columns" role="img" aria-label="Sütun grafik: Türkiye'de 1988-2024 arasında her yıl yanan orman alanı. En büyük kayıp 139.503 hektar ile 2021; 2024'te 27.485 hektar."></div>
                </div>
                <div class="ik-fires-view" data-view="per-fire">
                  <p class="ik-chart-title">Yangın başına ortalama yanan alan (hektar)</p>
                  <div class="ik-hbars" role="img" aria-label="Çubuk grafik: yangın başına ortalama yanan alan 2007-2016 döneminde 3,7 hektar, 2024'te 7,2 hektar."></div>
                </div>
                <div class="ik-fires-view" data-view="causes">
                  <p class="ik-chart-title">2024'te yangınların çıkış nedenleri</p>
                  <div class="ik-stack" role="img" aria-label="Yığılmış çubuk grafik: 2024'te yangın sayısının %49'u ihmal ve kaza, %29'u bilinmeyen, %19'u doğal, %3'ü kasıt kaynaklı; yanan alanın %72'si ihmal ve kaza, %24'ü bilinmeyen, %3'ü doğal, %1'i kasıt kaynaklı yangınlarda."></div>
                </div>
              </div>
              <figcaption class="ik-chart-source">Kaynak: <a href="https://www.ogm.gov.tr/tr/e-kutuphane/resmi-istatistikler" target="_blank" rel="noopener noreferrer">OGM, Ormancılık İstatistikleri 2024</a> (tablo 2.11).</figcaption>
            </figure>
            <noscript>
              <figure class="ik-chart">
                <img class="ik-chart-fallback" src="{{ asset('assets/iklim-krizi/image/csb/orman-yanginlari-1990-2024.webp') }}" alt="Grafik: Orman yangınları 1990-2024" width="678" height="290" loading="lazy" decoding="async">
                <figcaption class="ik-chart-source">Kaynak: ÇŞB Çevresel Göstergeler</figcaption>
              </figure>
            </noscript>
            <div class="ik-reveal"></div>
          </div>

          <ol class="ik-scene-steps">
            <li class="ik-scene-step" data-view="area" data-highlight="2024">
              <h4 class="ik-scene-step-title">2024: En Çok Yangın Çıkan Yıl</h4>
              <p>2024'te <strong>3.797</strong> orman yangını çıktı: 1988'den bu yana kayıtlardaki en yüksek sayı. Yanan alan bir önceki yıla göre <strong>%77</strong> artarak 15.520 hektardan 27.485 hektara çıktı.</p>
            </li>
            <li class="ik-scene-step" data-view="area" data-highlight="2021">
              <h4 class="ik-scene-step-title">2021: Rekor Kayıp</h4>
              <p>2021'de çıkan 2.793 yangın, sayıca 2024'ün gerisinde kalsa da <strong>139.503 hektar</strong> alanı yaktı. Bu, 1988'den bu yana en büyük kayıp ve 2024'te yanan alanın yaklaşık beş katı.</p>
            </li>
            <li class="ik-scene-step" data-view="per-fire">
              <h4 class="ik-scene-step-title">Yangın Başına Yanan Alan</h4>
              <p>2007-2016 döneminde bir yangında ortalama 3,7 hektar alan yanıyordu. 2024'te bu değer <strong>7,2 hektara</strong>, yaklaşık iki katına çıktı. Oran yıldan yıla dalgalanıyor: 2021'de yaklaşık 50 hektardı.</p>
            </li>
            <li class="ik-scene-step" data-view="causes">
              <h4 class="ik-scene-step-title">Yangınlar Nereden Çıkıyor?</h4>
              <p>2024'teki yangınların <strong>%49'u</strong> ihmal ve kazalardan çıktı; yanan alanın <strong>%72'si</strong> bu yangınlarda kaybedildi. Doğal nedenler yangınların %19'unu oluştursa da yanan alanın yalnızca %3'ünde etkili oldu.</p>
              <div class="ik-doc-links">
                <button type="button" class="ik-doc-link" aria-haspopup="dialog" data-lightbox-src="{{ asset('assets/iklim-krizi/image/csb/orman-yanginlari-1990-2024.webp') }}" data-lightbox-alt="Grafik: Orman yangınları 1990-2024 (ÇŞB)"><span class="ik-doc-link-icon" aria-hidden="true"><i class="fa-solid fa-chart-column"></i></span><span class="ik-doc-link-text"><span class="ik-doc-link-name">Orman yangınları</span><span class="ik-doc-link-meta">ÇŞB grafiği · 1990‑2024</span></span><i class="fa-solid fa-up-right-and-down-left-from-center ik-doc-link-expand" aria-hidden="true"></i></button>
                <button type="button" class="ik-doc-link" aria-haspopup="dialog" data-lightbox-src="{{ asset('assets/iklim-krizi/image/csb/yangin-cikis-nedenleri-1997-2024.webp') }}" data-lightbox-alt="Grafik: Çıkış nedenlerine göre yangın sayıları 1997-2024 (ÇŞB)"><span class="ik-doc-link-icon" aria-hidden="true"><i class="fa-solid fa-chart-column"></i></span><span class="ik-doc-link-text"><span class="ik-doc-link-name">Çıkış nedenleri</span><span class="ik-doc-link-meta">ÇŞB grafiği · 1997‑2024</span></span><i class="fa-solid fa-up-right-and-down-left-from-center ik-doc-link-expand" aria-hidden="true"></i></button>
              </div>
            </li>
          </ol>
        </div>
      </article>

    </div>
  </section>

  {{-- Causes of the climate crisis --}}

  <div class="ik-seam" aria-hidden="true"></div>

  <section id="causes-section" class="section-dark theme-gray">
    <div class="cause-fullwidth-header">
      <h2 class="cause-fullwidth-heading cause-heading">
        <span class="cause-heading-static">İklim Krizinin Sebebi</span>
        <span class="cause-heading-suffix" id="causeHeadingSuffix">
          <span class="cause-heading-suffix-text">Enerji ve Fosil Yakıtlar</span>
        </span>
      </h2>
      <p class="cause-fullwidth-desc">
        İklim değişikliği gökten inmedi; onu biz, özellikle son 150 yılda fosil yakıt yakarak, ormanları
        yok ederek ve üretim biçimimizle inşa ettik. Sebepleri bilmek, çözüm yolunu gösteriyor.
      </p>
    </div>

    <div class="container">
      <ul class="nav cause-tabs-nav" id="causeTabsNav" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="cause-tab-btn active" id="cause-tab-energy" data-bs-toggle="tab" data-bs-target="#cause-energy" type="button"
            role="tab" aria-selected="true" aria-controls="cause-energy" data-cause-name="Enerji ve Fosil Yakıtlar">
            <span class="cause-tab-btn-icon"><i class="fa-solid fa-fire"></i></span>
            <span class="cause-tab-btn-label"><span>Enerji ve Fosil Yakıtlar</span></span>
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="cause-tab-btn" id="cause-tab-deforestation" data-bs-toggle="tab" data-bs-target="#cause-deforestation" type="button"
            role="tab" aria-selected="false" aria-controls="cause-deforestation" data-cause-name="Ormansızlaşma">
            <span class="cause-tab-btn-icon"><i class="fa-solid fa-tree"></i></span>
            <span class="cause-tab-btn-label"><span>Ormansızlaşma</span></span>
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="cause-tab-btn" id="cause-tab-industry" data-bs-toggle="tab" data-bs-target="#cause-industry" type="button"
            role="tab" aria-selected="false" aria-controls="cause-industry" data-cause-name="Sanayi Üretimi">
            <span class="cause-tab-btn-icon"><i class="fa-solid fa-industry"></i></span>
            <span class="cause-tab-btn-label"><span>Sanayi Üretimi</span></span>
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="cause-tab-btn" id="cause-tab-agriculture" data-bs-toggle="tab" data-bs-target="#cause-agriculture" type="button"
            role="tab" aria-selected="false" aria-controls="cause-agriculture" data-cause-name="Tarım ve Hayvancılık">
            <span class="cause-tab-btn-icon"><i class="fa-solid fa-cow"></i></span>
            <span class="cause-tab-btn-label"><span>Tarım ve Hayvancılık</span></span>
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="cause-tab-btn" id="cause-tab-transport" data-bs-toggle="tab" data-bs-target="#cause-transport" type="button"
            role="tab" aria-selected="false" aria-controls="cause-transport" data-cause-name="Ulaşım">
            <span class="cause-tab-btn-icon"><i class="fa-solid fa-car"></i></span>
            <span class="cause-tab-btn-label"><span>Ulaşım</span></span>
          </button>
        </li>
      </ul>

      <div class="tab-content cause-tab-content" id="causeTabsContent">
        <div class="tab-pane fade show active cause-tab-grid" id="cause-energy" role="tabpanel" aria-labelledby="cause-tab-energy" tabindex="0">
          <h3 class="visually-hidden">Enerji ve Fosil Yakıtlar</h3>
          <div class="cause-tab-row">
            <div class="cause-tab-chart">
              <div class="chart-wrapper">
                <div id="causeEnergyChart"></div>
              </div>
              <span class="cause-chart-caption">Kaynağa göre emisyon payı (%)</span>
            </div>
            <div class="cause-tab-text">
              <p>Elektrik üretmek, evleri ısıtmak ve fabrikaları çalıştırmak için kömür, petrol ve doğal gaz
                yakıyoruz. Dünyadaki sera gazlarının dörtte üçünden fazlası bu yakıtlardan geliyor.</p>
              <p><em>Türkiye'de:</em> 2018'de Türkiye'nin sera gazı salımı 520,9 milyon tona ulaştı. Bu, 1990'daki
                miktarın yaklaşık 2,4 katı; aynı dönemde AB ülkeleri salımlarını %21 azalttı. Kişi başına düşen
                salım 4 tondan 6,4 tona çıktı. Bu salımın yaklaşık dörtte üçü (%71,6) enerjiden geliyor.</p>
              <p><em>Elektrik:</em> Bir kişinin yıllık elektrik tüketimi 1990'dan 2018'e neredeyse dört katına çıktı:
                yaklaşık 1.000 kWh'ten 3.709 kWh'e, yani günde yaklaşık 10 kWh. İyi haber: elektriğimizin üçte biri
                (%32,5) yenilenebilir kaynaklardan geliyor; bu oran AB ortalamasıyla (%32,1) aynı düzeyde.</p>
            </div>
            <div class="cause-tab-chart">
              <div class="chart-wrapper">
                <div id="causeEnergyTrendChart"></div>
              </div>
              <span class="cause-chart-caption">Türkiye enerji kaynaklı seragazı emisyonu, milyon ton CO₂e (TÜİK/ÇŞB, 1990-2018)</span>
            </div>
          </div>
          <div class="cause-stack-row">
            <div class="cause-stack" data-cause-stack="energy">
              <div class="cause-stack-cards">
                <div class="cause-stack-card active" data-index="0" style="--stack-img:url('{{ asset('assets/iklim-krizi/image/wikipedia/garzweiler-acik-maden-ocagi.webp') }}');">
                  <h4>Garzweiler Açık Maden Ocağı</h4>
                  <p>Almanya'nın en büyük linyit ocaklarından biri; kömür çıkarmak için köyler boşaltılıyor,
                    ormanlar kesiliyor ve binlerce hektarlık alan devasa bir çukura dönüşüyor.</p>
                </div>
                <div class="cause-stack-card" data-index="1" style="--stack-img:url('{{ asset('assets/iklim-krizi/image/wikipedia/komur-termik-santrali.webp') }}');">
                  <h4>Çin Termik Santralleri</h4>
                  <p>Dünya kömür tüketiminin yarısından fazlasını tek başına gerçekleştiren Çin'de, binlerce aktif
                    termik santral küresel kömür kaynaklı CO₂ emisyonunun en büyük tekil kaynağını oluşturuyor.</p>
                </div>
                <div class="cause-stack-card" data-index="2" style="--stack-img:url('{{ asset('assets/iklim-krizi/image/wikipedia/nijer-deltasi.webp') }}');">
                  <h4>Nijer Deltası</h4>
                  <p>Boru hatlarındaki sızıntılar ve fazla gazın yakılması (flaring), on yıllardır bölgenin sucul
                    ekosistemlerini kirletip yerel toplulukların tarım ve balıkçılık gelirini yok ediyor.</p>
                </div>
                <div class="cause-stack-card" data-index="3" style="--stack-img:url('{{ asset('assets/iklim-krizi/image/wikipedia/bati-teksas-permian-havzasi.webp') }}');">
                  <h4>Batı Teksas Permian Havzası</h4>
                  <p>ABD'nin en büyük ham petrol üretim merkezi; kuyu başlarından sızan metan, bazı ölçümlerde
                    havzanın yakıt tüketiminden kaynaklanan emisyondan bile daha güçlü bir ısınma etkisi yaratıyor.</p>
                </div>
                <div class="cause-stack-card" data-index="4" style="--stack-img:url('{{ asset('assets/iklim-krizi/image/wikipedia/avustralya-lng-tesisleri.webp') }}');">
                  <h4>Avustralya LNG Tesisleri</h4>
                  <p>Dünyanın önde gelen sıvılaştırılmış doğal gaz ihracatçılarından Avustralya'da, kıyı
                    tesislerinden kaynaklanan metan kaçakları uydu verileriyle ancak son yıllarda sistematik olarak
                    izlenmeye başlandı.</p>
                </div>
                <div class="cause-stack-card" data-index="5" style="--stack-img:url('{{ asset('assets/iklim-krizi/image/wikipedia/hindistan-komur-madenleri.webp') }}');">
                  <h4>Hindistan Kömür Madenleri</h4>
                  <p>Jharkhand ve Odisha eyaletlerindeki açık ocak madenler, milyonlarca insanı hem solunum
                    yollarını tahriş eden kömür tozuna hem de bölgenin yüksek CO₂ emisyon yüküne maruz bırakıyor.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="tab-pane fade cause-tab-grid" id="cause-deforestation" role="tabpanel" aria-labelledby="cause-tab-deforestation" tabindex="0">
          <h3 class="visually-hidden">Ormansızlaşma</h3>
          <div class="cause-tab-row">
            <div class="cause-tab-chart">
              <div class="chart-wrapper">
                <div id="causeDeforestationChart"></div>
              </div>
              <span class="cause-chart-caption">Ormansızlaşma nedenine göre pay (%)</span>
            </div>
            <div class="cause-tab-text">
              <p>Ağaçlar büyürken havadaki karbonu çekip gövdelerinde ve toprakta saklar. Bir orman kesilip
                yakıldığında bu karbon yeniden havaya karışır ve karbonu temizleyecek ağaç da kalmaz.</p>
              <p><em>Türkiye'de durum farklı:</em> Ormanlarımız büyüyor. 1973'te 20,2 milyon hektar olan orman
                alanı 2018'de 22,6 milyon hektara çıktı; bugün ülkenin yaklaşık üçte biri (%29) orman. Pasta grafik
                dünyadaki orman kaybının nedenlerini, çizgi grafik Türkiye'nin orman alanını gösteriyor. Büyüyen
                ormanlar daha çok karbon da tutuyor: yıllık tutulan karbon 1990'dan 2017'ye neredeyse iki katına
                çıktı (55,8 milyon tondan 102,3 milyon tona).</p>
            </div>
            <div class="cause-tab-chart">
              <div class="chart-wrapper">
                <div id="causeDeforestationTrendChart"></div>
              </div>
              <span class="cause-chart-caption">Türkiye toplam orman alanı, milyon hektar (Tarım ve Orman Bakanlığı/ÇŞB, 1973-2018)</span>
            </div>
          </div>
          <div class="cause-stack-row">
            <div class="cause-stack" data-cause-stack="deforestation">
              <div class="cause-stack-cards">
                <div class="cause-stack-card active" data-index="0" style="--stack-img:url('{{ asset('assets/iklim-krizi/image/wikipedia/amazon-yagmur-ormanlari.webp') }}');">
                  <h4>Amazon Yağmur Ormanları</h4>
                  <p>Brezilya'da sığır otlatma ve soya tarımı için her yıl milyonlarca hektar orman açılıyor;
                    dünyanın en büyük karbon yutaklarından biri bu baskı altında küçülmeye devam ediyor.</p>
                </div>
                <div class="cause-stack-card" data-index="1" style="--stack-img:url('{{ asset('assets/iklim-krizi/image/wikipedia/borneo-adasi.webp') }}');">
                  <h4>Borneo Adası</h4>
                  <p>Endonezya ve Malezya'da palmiye yağı plantasyonları için temizlenen ormanlar, orangutan başta
                    olmak üzere adaya özgü pek çok türün yaşam alanını yok ediyor.</p>
                </div>
                <div class="cause-stack-card" data-index="2" style="--stack-img:url('{{ asset('assets/iklim-krizi/image/wikipedia/kongo-havzasi.webp') }}');">
                  <h4>Kongo Havzası</h4>
                  <p>Dünyanın Amazon'dan sonraki en büyük yağmur ormanı, kereste ticareti, madencilik ve küçük
                    ölçekli tarımın artan baskısı altında giderek küçülüyor.</p>
                </div>
                <div class="cause-stack-card" data-index="3" style="--stack-img:url('{{ asset('assets/iklim-krizi/image/wikipedia/endonezya-turbaliklari.webp') }}');">
                  <h4>Endonezya Turbalıkları</h4>
                  <p>Palmiye yağı tarımı için kurutulan tropikal turbalıklar, binlerce yıldır toprakta biriken
                    karbonu hızla atmosfere salıyor; kurumuş turba aynı zamanda büyük orman yangınlarına zemin
                    hazırlıyor.</p>
                </div>
                <div class="cause-stack-card" data-index="4" style="--stack-img:url('{{ asset('assets/iklim-krizi/image/wikipedia/cerrado-savanalari-brezilya.webp') }}');">
                  <h4>Cerrado Savanaları, Brezilya</h4>
                  <p>Amazon kadar gündeme gelmese de Cerrado, küresel soya ve sığır talebinin baskısıyla her yıl
                    yaklaşık 1 milyon hektar kaybediyor; oysa bölge kendine özgü zengin bir biyoçeşitliliğe ev
                    sahipliği yapıyor.</p>
                </div>
                <div class="cause-stack-card" data-index="5" style="--stack-img:url('{{ asset('assets/iklim-krizi/image/un/UN7319884.webp') }}');">
                  <h4>Doğu Afrika Miombo Ormanları</h4>
                  <p>Odun kömürü üretimi ve geçimlik tarım, Tanzanya ve Mozambik'teki Miombo ormanlarını hızla
                    tahrip ediyor; yerel halkın çoğu için uygun fiyatlı bir enerji alternatifi bulunmuyor.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="tab-pane fade cause-tab-grid" id="cause-industry" role="tabpanel" aria-labelledby="cause-tab-industry" tabindex="0">
          <h3 class="visually-hidden">Sanayi Üretimi</h3>
          <div class="cause-tab-row">
            <div class="cause-tab-chart">
              <div class="chart-wrapper">
                <div id="causeIndustryChart"></div>
              </div>
              <span class="cause-chart-caption">Sektöre göre emisyon payı (%)</span>
            </div>
            <div class="cause-tab-text">
              <p>Çimento, çelik ve kimyasal üretimi iki yoldan sera gazı çıkarır: fırınları çalıştırmak için çok
                enerji harcanır, üretimin kendisi de gaz açığa çıkarır. Örneğin çimentonun hammaddesi kireçtaşı
                ısıtıldığında içindeki karbon CO₂ olarak havaya karışır.</p>
              <p><em>Türkiye'de:</em> Sanayi süreçleri 2018'deki toplam salımın %12,5'ini, yani her 8 tonun 1'ini
                oluşturuyor. Bu salım 1990'dan 2018'e neredeyse üç katına çıktı: 22,8 milyon tondan 65,2 milyon
                tona.</p>
            </div>
            <div class="cause-tab-chart">
              <div class="chart-wrapper">
                <div id="causeIndustryTrendChart"></div>
              </div>
              <span class="cause-chart-caption">Türkiye endüstriyel işlemler/ürün kullanımı emisyonu, milyon ton CO₂e (TÜİK/ÇŞB, 1990-2018)</span>
            </div>
          </div>
          <div class="cause-stack-row">
            <div class="cause-stack" data-cause-stack="industry">
              <div class="cause-stack-cards">
                <div class="cause-stack-card active" data-index="0" style="--stack-img:url('{{ asset('assets/iklim-krizi/image/wikipedia/ruhr-bolgesi-celik-tesisleri.webp') }}');">
                  <h4>Ruhr Bölgesi Çelik Tesisleri</h4>
                  <p>Almanya'nın tarihi ağır sanayi merkezinde yüksek fırınlar ve çelik tesisleri yüzyılı aşkın
                    süredir bölgenin emisyon profilini belirliyor; dönüşüm için yeşil hidrojen tabanlı üretim
                    planlanıyor.</p>
                </div>
                <div class="cause-stack-card" data-index="1" style="--stack-img:url('{{ asset('assets/iklim-krizi/image/un/UN7771324.webp') }}');">
                  <h4>Çimento Fabrikaları</h4>
                  <p>Hindistan ve Çin'deki tesisler küresel çimento üretiminin yarısından fazlasını karşılıyor;
                    hem yüksek sıcaklıkta pişirme süreci hem de kalkerin kimyasal dönüşümü büyük miktarda CO₂ açığa
                    çıkarıyor.</p>
                </div>
                <div class="cause-stack-card" data-index="2" style="--stack-img:url('{{ asset('assets/iklim-krizi/image/un/UN7417696.webp') }}');">
                  <h4>Teksas Körfez Kıyısı</h4>
                  <p>Yoğun petrokimya tesisleri kompleksi, ABD'nin en büyük endüstriyel emisyon bölgelerinden
                    birini oluştururken çevredeki yerleşim bölgelerinde hava kalitesi sorunlarını da beraberinde
                    getiriyor.</p>
                </div>
                <div class="cause-stack-card" data-index="3" style="--stack-img:url('{{ asset('assets/iklim-krizi/image/wikipedia/cin-aluminyum-tesisleri.webp') }}');">
                  <h4>Çin Alüminyum Tesisleri</h4>
                  <p>Küresel alüminyum üretiminin %60'ından fazlasını gerçekleştiren Çin tesisleri büyük ölçüde
                    kömür enerjisiyle çalışıyor; bu da ton başına düşen karbon izini dünya ortalamasının çok
                    üzerinde tutuyor.</p>
                </div>
                <div class="cause-stack-card" data-index="4" style="--stack-img:url('{{ asset('assets/iklim-krizi/image/wikipedia/hindistan-tugla-ocaklari.webp') }}');">
                  <h4>Hindistan Tuğla Ocakları</h4>
                  <p>Ülke genelindeki 140.000'den fazla geleneksel tuğla fırını, düşük verimli katı yakıt
                    kullanarak hem CO₂ hem de sağlığa zararlı kara karbon (kurum) salımına yol açıyor.</p>
                </div>
                <div class="cause-stack-card" data-index="5" style="--stack-img:url('{{ asset('assets/iklim-krizi/image/un/UN7417711.webp') }}');">
                  <h4>Macaristan PVC ve Plastik Sektörü</h4>
                  <p>Orta Avrupa'daki petrokimya tesisleri, hem üretim süreçlerindeki enerji yoğunluğu hem de
                    plastik atığın yakılmasıyla yüksek emisyon değerleri üretmeye devam ediyor.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="tab-pane fade cause-tab-grid" id="cause-agriculture" role="tabpanel" aria-labelledby="cause-tab-agriculture" tabindex="0">
          <h3 class="visually-hidden">Tarım ve Hayvancılık</h3>
          <div class="cause-tab-row">
            <div class="cause-tab-chart">
              <div class="chart-wrapper">
                <div id="causeAgricultureChart"></div>
              </div>
              <span class="cause-chart-caption">Kaynağa göre emisyon payı (%)</span>
            </div>
            <div class="cause-tab-text">
              <p>İnek ve koyunlar sindirim sırasında metan, fazla kullanılan gübre ise toprakta diazot monoksit
                (N₂O) açığa çıkarır. Bu gazlar havayı CO₂'den çok daha güçlü ısıtır: 100 yıllık süreçte aynı
                miktar metan yaklaşık 28 kat, N₂O ise yaklaşık 265 kat daha fazla ısıtır (IPCC).</p>
              <p><em>Türkiye'de:</em> Tarım da toplam salımın %12,5'ini, yani her 8 tonun 1'ini oluşturuyor. 1990'da
                45,7 milyon ton olan salım 2000'lerde azaldıktan sonra yeniden arttı ve 2018'de 64,9 milyon tona
                ulaştı.</p>
              <p><em>Daha az toprak, daha çok gübre:</em> 1990'dan 2018'e nüfus %45 artarken kişi başına düşen
                tarım arazisi bir futbol sahası büyüklüğünden yaklaşık üçte ikisine indi (0,76 hektardan 0,46
                hektara). Aynı topraktan daha çok ürün almak için gübre kullanımı arttı: 2018'de hektar başına 93,3
                kg. Organik tarım ise arazinin yalnızca %2,7'sinde yapılıyor (AB'de %7).</p>
            </div>
            <div class="cause-tab-chart">
              <div class="chart-wrapper">
                <div id="causeAgricultureTrendChart"></div>
              </div>
              <span class="cause-chart-caption">Türkiye tarımsal faaliyet emisyonu, milyon ton CO₂e (TÜİK/ÇŞB, 1990-2018)</span>
            </div>
          </div>
          <div class="cause-stack-row">
            <div class="cause-stack" data-cause-stack="agriculture">
              <div class="cause-stack-cards">
                <div class="cause-stack-card active" data-index="0" style="--stack-img:url('{{ asset('assets/iklim-krizi/image/wikipedia/brezilya-sigir-ciftlikleri.webp') }}');">
                  <h4>Brezilya Sığır Çiftlikleri</h4>
                  <p>Endüstriyel ölçekte et üretimi için ayrılan geniş otlaklar hem ormansızlaşmayı tetikliyor hem
                    de sığırların sindirim süreci kaynaklı metan salımını artırıyor.</p>
                </div>
                <div class="cause-stack-card" data-index="1" style="--stack-img:url('{{ asset('assets/iklim-krizi/image/wikipedia/guneydogu-asya-pirinc-tarlalari.webp') }}');">
                  <h4>Güneydoğu Asya Pirinç Tarlaları</h4>
                  <p>Su altında bırakılan pirinç tarlalarında organik madde oksijensiz ortamda ayrışıyor; bu
                    anaerobik süreç, CO₂'den çok daha güçlü ısınma potansiyeline sahip metanın önemli
                    kaynaklarından birini oluşturuyor.</p>
                </div>
                <div class="cause-stack-card" data-index="2" style="--stack-img:url('{{ asset('assets/iklim-krizi/image/wikipedia/avrupa-yogun-tarim-alanlari.webp') }}');">
                  <h4>Avrupa Yoğun Tarım Alanları</h4>
                  <p>Verimi artırmak için kullanılan aşırı azotlu gübreler, topraktan atmosfere CO₂'den çok daha
                    güçlü ısınma potansiyeline sahip nitröz oksit salınımına yol açıyor.</p>
                </div>
                <div class="cause-stack-card" data-index="3" style="--stack-img:url('{{ asset('assets/iklim-krizi/image/wikipedia/meksika-avokado-bahceleri.webp') }}');">
                  <h4>Meksika Avokado Bahçeleri</h4>
                  <p>Küresel avokado talebindeki patlama, Michoacan eyaletindeki ormanların tarım arazisine
                    dönüştürülmesine, yoğun su tüketimine ve artan pestisit kirliliğine neden oluyor.</p>
                </div>
                <div class="cause-stack-card" data-index="4" style="--stack-img:url('{{ asset('assets/iklim-krizi/image/wikipedia/abd-buyuk-ovalarda-mono-kultur.webp') }}');">
                  <h4>ABD Büyük Ovalarda Mono-Kültür</h4>
                  <p>Yüzlerce kilometre boyunca tek tip mısır ya da soya yetiştirilen alanlarda toprak karbonu
                    hızla tükeniyor, doğal biyoçeşitlilik neredeyse sıfıra iniyor.</p>
                </div>
                <div class="cause-stack-card" data-index="5" style="--stack-img:url('{{ asset('assets/iklim-krizi/image/wikipedia/hollanda-yogun-hayvancilik-tesisleri.webp') }}');">
                  <h4>Hollanda Yoğun Hayvancılık Tesisleri</h4>
                  <p>Dünyanın en yoğun hayvancılık sektörüne sahip ülkelerinden biri olan Hollanda, aşırı gübre ve
                    amonyak salımı nedeniyle AB'nin nitrojen krizinin merkezinde yer alıyor.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="tab-pane fade cause-tab-grid" id="cause-transport" role="tabpanel" aria-labelledby="cause-tab-transport" tabindex="0">
          <h3 class="visually-hidden">Ulaşım</h3>
          <div class="cause-tab-row">
            <div class="cause-tab-chart">
              <div class="chart-wrapper">
                <div id="causeTransportChart"></div>
              </div>
              <span class="cause-chart-caption">Türkiye'de ulaşım türüne göre CO₂ payı, 2017 (TÜİK/ÇŞB)</span>
            </div>
            <div class="cause-tab-text">
              <p>Otomobiller, kamyonlar, gemiler ve uçaklar dünyadaki sera gazı salımının beşte birine yakınını
                oluşturuyor. Türkiye'de ulaşımdan gelen CO₂'nin %93'ü karayolundan; yani neredeyse tamamı otomobil,
                otobüs ve kamyonlardan.</p>
              <p><em>Türkiye'de araç sayısı:</em> 1979'da 1,57 milyon olan motorlu taşıt sayısı 2018'de 22,87 milyona
                çıktı: yaklaşık 40 yılda 15 kat. Araçlarımız da yaşlı: yaklaşık her 4 otomobilden 1'i (%23,4) 20
                yaşın üzerinde; bu oran Almanya'da %7,3. Eski araçlar aynı yol için daha fazla yakıt yakıyor.</p>
            </div>
            <div class="cause-tab-chart">
              <div class="chart-wrapper">
                <div id="causeTransportTrendChart"></div>
              </div>
              <span class="cause-chart-caption">Türkiye ulaştırma toplam seragazı emisyonu, milyon ton CO₂e (TÜİK/ÇŞB, 1990-2017)</span>
            </div>
          </div>
          <div class="cause-stack-row">
            <div class="cause-stack" data-cause-stack="transport">
              <div class="cause-stack-cards">
                <div class="cause-stack-card active" data-index="0" style="--stack-img:url('{{ asset('assets/iklim-krizi/image/wikipedia/los-angeles-otoyol-agi.webp') }}');">
                  <h4>Los Angeles Otoyol Ağı</h4>
                  <p>Dünyanın en yoğun karayolu trafiğine sahip şehirlerinden biri; günlük milyonlarca özel araç
                    yolculuğu, kentin en büyük tekil emisyon kaynaklarından birini oluşturuyor.</p>
                </div>
                <div class="cause-stack-card" data-index="1" style="--stack-img:url('{{ asset('assets/iklim-krizi/image/wikipedia/kuresel-konteyner-gemiciligi.webp') }}');">
                  <h4>Küresel Konteyner Gemiciliği</h4>
                  <p>Ağır fuel-oil ile çalışan dev konteyner gemileri küresel ticaretin omurgasını oluştursa da,
                    denizcilik sektörü kükürt oksit ve CO₂ salımıyla iklim ve hava kalitesi üzerinde ciddi bir
                    baskı yaratıyor.</p>
                </div>
                <div class="cause-stack-card" data-index="2" style="--stack-img:url('{{ asset('assets/iklim-krizi/image/wikipedia/atlantik-hava-trafigi.webp') }}');">
                  <h4>Atlantik Hava Trafiği</h4>
                  <p>Kıtalar arası uçuşların yüksek irtifada bıraktığı kondensasyon izleri ve azot oksitler,
                    havacılığın iklim etkisini yalnızca yakılan yakıtın CO₂'siyle sınırlı tutmuyor.</p>
                </div>
                <div class="cause-stack-card" data-index="3" style="--stack-img:url('{{ asset('assets/iklim-krizi/image/wikipedia/dubai-havalimani.webp') }}');">
                  <h4>Dubai Havalimanı</h4>
                  <p>Dünyanın en yoğun uluslararası havalimanlarından biri; yılda 90 milyonu aşan yolcu trafiğiyle
                    küresel havacılık emisyonlarının sembol noktalarından birine dönüştü.</p>
                </div>
                <div class="cause-stack-card" data-index="4" style="--stack-img:url('{{ asset('assets/iklim-krizi/image/pexels/endonezya-iki-tekerlekli-tasit.webp') }}');">
                  <h4>Endonezya İki Tekerlekli Taşıt Sorunu</h4>
                  <p>Jakarta ve diğer büyük şehirlerde 100 milyonun üzerinde motosiklet, düzenli denetime tabi
                    olmayan egzoz emisyonlarıyla hem karbon salımını hem de yerel hava kirliliğini ağırlaştırıyor.</p>
                </div>
                <div class="cause-stack-card" data-index="5" style="--stack-img:url('{{ asset('assets/iklim-krizi/image/wikipedia/suveys-panama-kanali.webp') }}');">
                  <h4>Süveyş ve Panama Kanalı Trafik Sıkışıklığı</h4>
                  <p>İki stratejik kanalda uzun süre bekleyen ya da yavaş seyreden devasa tankerlerin gereksiz
                    yakıt tüketimi, denizcilik emisyon hesaplarında genelde göz ardı edilen büyük bir kalemi
                    oluşturuyor.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {{-- Two possible futures (consequences) --}}

  <div class="ik-seam" aria-hidden="true"></div>

  <section id="consequences-section" class="section-dark theme-green">
    <div class="section-header" data-aos="fade-up">
      <h2 class="section-title">Karşılaşabileceğimiz <em>Gelecek</em></h2>
    </div>

    {{-- Horizontal card strip: the active card widens to reveal its description
         while the others narrow; it auto-advances and clicking a card jumps to it
         (script.js: future card showcase). --}}
    <div class="card-showcase" id="futureCardShowcase">
      <div class="card-showcase-track" id="futureCardShowcaseTrack">
        <div class="card-showcase-card active" style="--cs-img:url('{{ asset('assets/iklim-krizi/image/nasa/solomon-kiyisi.webp') }}');">
          <div class="card-showcase-progress"><span></span></div>
          <div class="card-showcase-photo"></div>
          <div class="card-showcase-body">
            <h3>Küresel Deniz Seviyesi 2100'e Kadar 30 cm ile 2 Metre Arasında Yükselebilir</h3>
            <p>Küresel deniz seviyesi, güvenilir kayıtların tutulmaya başladığı 1880'den bu yana yaklaşık 20 santimetre yükseldi. Bilim insanları 2100'e kadar en az 30 santimetre daha, yüksek emisyon senaryosunda ise 2 metreye kadar yükselebileceğini öngörüyor.</p>
          </div>
        </div>
        <div class="card-showcase-card" style="--cs-img:url('{{ asset('assets/iklim-krizi/image/nasa/shahdag-milli-parki.webp') }}');">
          <div class="card-showcase-progress"><span></span></div>
          <div class="card-showcase-photo"></div>
          <div class="card-showcase-body">
            <h3>İklim Değişiklikleri Bu Yüzyıl Boyunca ve Sonrasında Sürecek</h3>
            <p>Küresel iklimin bu yüzyıl boyunca ve sonrasında ısınmaya devam etmesi öngörülüyor; bugün atılan adımlar bu eğrinin ne kadar dik olacağını belirleyecek.</p>
          </div>
        </div>
        <div class="card-showcase-card" style="--cs-img:url('{{ asset('assets/iklim-krizi/image/nasa/iss-karayip-denizi.webp') }}');">
          <div class="card-showcase-progress"><span></span></div>
          <div class="card-showcase-photo"></div>
          <div class="card-showcase-body">
            <h3>Kasırgalar Daha Güçlü ve Yıkıcı Hale Gelecek</h3>
            <p>Bilim insanları, iklim ısınmaya devam ettikçe kasırgalarla ilişkili fırtına şiddetinin ve yağış oranlarının artacağını öngörüyor.</p>
          </div>
        </div>
        <div class="card-showcase-card" style="--cs-img:url('{{ asset('assets/iklim-krizi/image/nasa/effectsbannernew-opt.webp') }}');">
          <div class="card-showcase-progress"><span></span></div>
          <div class="card-showcase-photo"></div>
          <div class="card-showcase-body">
            <h3>Daha Fazla Kuraklık ve Sıcak Hava Dalgası</h3>
            <p>Kuraklıkların ve sıcak hava dalgalarının daha yoğun hale gelmesi, soğuk hava dalgalarının ise daha az yoğun ve daha seyrek olması bekleniyor.</p>
          </div>
        </div>
        <div class="card-showcase-card" style="--cs-img:url('{{ asset('assets/iklim-krizi/image/nasa/orman-yangini-sezonu.webp') }}');">
          <div class="card-showcase-progress"><span></span></div>
          <div class="card-showcase-photo"></div>
          <div class="card-showcase-body">
            <h3>Orman Yangını Sezonu Uzayacak</h3>
            <p>İnsan kaynaklı iklim değişikliğinin son on yıllarda yanan orman alanını zaten iki katına çıkardığı tahmin ediliyor. 2050'ye doğru yangınla yanan alanın 2 ila 6 kat daha artması bekleniyor.</p>
          </div>
        </div>
        <div class="card-showcase-card" style="--cs-img:url('{{ asset('assets/iklim-krizi/image/nasa/oklahoma-sel-yolu.webp') }}');">
          <div class="card-showcase-progress"><span></span></div>
          <div class="card-showcase-photo"></div>
          <div class="card-showcase-body">
            <h3>Yağış Düzenlerinde Değişimler</h3>
            <p>İklim değişikliği yağışı dengesiz biçimde etkiliyor: bazı bölgeler artan yağış ve sel yaşarken bazıları kuraklık çekiyor.</p>
          </div>
        </div>
        <div class="card-showcase-card" style="--cs-img:url('{{ asset('assets/iklim-krizi/image/nasa/tarim-arazisi.webp') }}');">
          <div class="card-showcase-progress"><span></span></div>
          <div class="card-showcase-photo"></div>
          <div class="card-showcase-body">
            <h3>Donsuz Mevsim (ve Yetişme Sezonu) Uzayacak</h3>
            <p>Donsuz mevsimin ve buna bağlı yetişme sezonunun süresi 1980'lerden bu yana artıyor; bu durum ekosistemleri ve tarımı doğrudan etkileyecek.</p>
          </div>
        </div>
        <div class="card-showcase-card" style="--cs-img:url('{{ asset('assets/iklim-krizi/image/nasa/sicak-hava-dalgasi.webp') }}');">
          <div class="card-showcase-progress"><span></span></div>
          <div class="card-showcase-photo"></div>
          <div class="card-showcase-body">
            <h3>Küresel Sıcaklıklar Yükselmeye Devam Edecek</h3>
            <p>2023 yazı, NASA kayıtlarındaki en sıcak yaz oldu: önceki en sıcak yazdan 0,23°C, 1951-1980 ortalamasından ise 1,2°C daha sıcak.</p>
          </div>
        </div>
        <div class="card-showcase-card" style="--cs-img:url('{{ asset('assets/iklim-krizi/image/nasa/arktik-buzsuzlasma.webp') }}');">
          <div class="card-showcase-progress"><span></span></div>
          <div class="card-showcase-photo"></div>
          <div class="card-showcase-body">
            <h3>Arktik'in Büyük Olasılıkla Buzsuz Kalması Bekleniyor</h3>
            <p>Arktik Okyanusu'ndaki deniz buzu örtüsünün azalmaya devam etmesi ve mevcut projeksiyonlar gerçekleşirse yüzyılın ortasından önce, yaz sonlarında neredeyse buzsuz hale gelmesi bekleniyor.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  {{-- What we should do --}}

  <div class="ik-seam" aria-hidden="true"></div>

  <section id="actions-section" class="section-dark theme-gray">
    <div class="container">
      <div class="section-header" data-aos="fade-up">
        <h2 class="section-title dynamic-heading">
          <span class="dynamic-heading-word" id="actionsDynamicHeading">Neler Yapmalıyız?</span>
        </h2>
      </div>

      <div class="steps-group">
        <h3 class="steps-group-title"><i class="fa-solid fa-person-walking"></i> Bireysel Adımlar</h3>
        <p class="steps-group-desc">Her gün attığın küçük adımlar, zamanla büyük bir sonuca dönüşür.</p>
        <div class="reel" id="individualReel"></div>
        {{-- Plain-list fallback for the JS step carousel, so the steps stay readable
             without JavaScript and for crawlers. --}}
        <noscript>
          <div class="reel-fallback">
            <article class="reel-fallback-item">
              <h4>1. Enerji Tasarrufu</h4>
              <p>LED ampuller aynı ışığı eski ampullerden çok daha az elektrikle verir. Kapalı sandığımız ama fişte duran cihazlar da bekleme modunda elektrik çekmeye devam eder. Evde harcanan enerji azaldıkça onu üretmek için yakılan yakıt da azalır.</p>
              <ul><li>Çamaşırı 30°C'de ve makine doluyken yıka</li><li>Kışın termostatı 1°C düşürmek ısınma faturasını yaklaşık %4-5 azaltır</li><li>Kullanmadığın cihazları prizden çek</li></ul>
            </article>
            <article class="reel-fallback-item">
              <h4>2. Ulaşım Tercihleri</h4>
              <p>Ulaşım, kişisel karbon ayak izinin en büyük kalemlerinden biri. Trende kilometre başına düşen salım benzinli bir otomobilin yaklaşık beşte biri, iç hat uçuşunun ise yedide biri kadar. Kısa yollarda yürümek ya da bisiklet, uzun yollarda tren ve otobüs seçmek fark yaratır.</p>
              <ul><li>3 km altındaki yolları yürüyerek ya da bisikletle git</li><li>Şehir içinde otomobil yerine toplu taşımayı dene</li><li>Yakın şehirlere uçak yerine tren ya da otobüsle git</li></ul>
            </article>
            <article class="reel-fallback-item">
              <h4>3. Beslenme Alışkanlıkları</h4>
              <p>Gıda üretimi, dünyadaki sera gazı salımının yaklaşık dörtte birinden sorumlu. En büyük fark tabakta ne olduğundan gelir: 1 kg sığır eti üretmek yaklaşık 60 kg sera gazı çıkarırken 1 kg tavuk 6 kg, 1 kg bezelye ise yalnızca 1 kg çıkarır.</p>
              <ul><li>Haftada birkaç öğünde kırmızı et yerine baklagil ya da tavuk seç</li><li>Taşımanın payı çoğu gıdada %10'dan az: ne yediğin, nereden geldiğinden daha önemli</li><li>Alışverişini planla, artan yemeği değerlendir</li></ul>
            </article>
            <article class="reel-fallback-item">
              <h4>4. Bilinçli Tüketim</h4>
              <p>Aldığımız her ürünün üretimi enerji ve hammadde harcar. Daha az ama daha uzun ömürlü ürünler almak, eşyaları onarmak ve ikinci el kullanmak hem çöpü hem de üretimden gelen salımı azaltır.</p>
              <ul><li>Almadan önce "gerçekten ihtiyacım var mı?" diye sor</li><li>Bozulan elektroniği atmadan önce tamir ettirmeyi dene</li><li>Tek kullanımlık plastik yerine tekrar kullanılabilir çanta ve şişe kullan</li></ul>
            </article>
            <article class="reel-fallback-item">
              <h4>5. Doğayla Birlikte Yaşamak</h4>
              <p>Ağaçlar ve yeşil alanlar havadaki karbonu tutar, şehirleri serinletir ve canlılara yaşam alanı sağlar. Balkonda bitki yetiştirmek ya da bir ağaçlandırma çalışmasına katılmak küçük görünse de, birçok insan yaptığında etkisi büyür.</p>
              <ul><li>Mutfak atıklarını kompost yapıp toprağa geri kazandır</li><li>Yerel ağaçlandırma ve temizlik etkinliklerine gönüllü katıl</li><li>Damlayan musluğu tamir et: saniyede bir damla, yılda 11.000 litreden fazla su demek</li></ul>
            </article>
            <article class="reel-fallback-item">
              <h4>6. Savunuculuk ve Farkındalık</h4>
              <p>Tek başına attığımız adımlar önemli, ama en büyük değişim birlikte ses çıkardığımızda olur. Çevrendekilerle konuşmak, belediyenin ve şirketlerin iklim planlarını sormak sistemin değişmesini hızlandırır.</p>
              <ul><li>Yaşadığın şehrin bir iklim eylem planı olup olmadığını öğren</li><li>Okulunda ya da iş yerinde tasarruf ve geri dönüşüm önerileri sun</li><li>Güvenilir bilimsel kaynaklara dayanan içerikleri paylaş</li></ul>
            </article>
          </div>
        </noscript>
      </div>

      <div class="steps-group">
        <h3 class="steps-group-title"><i class="fa-solid fa-earth-americas"></i> Toplumsal Adımlar</h3>
        <p class="steps-group-desc">Toplumsal dönüşüm politika, teknoloji ve kolektif eylemle ilerler.</p>
        <div class="reel" id="societalReel"></div>
        <noscript>
          <div class="reel-fallback">
            <article class="reel-fallback-item">
              <h4>1. Yenilenebilir Enerjiye Geçiş</h4>
              <p>Elektriği kömür ve doğal gaz yerine güneşten, rüzgârdan ve sudan üretmek, salımları azaltmanın en etkili yollarından biri. Devletlerin ve şirketlerin yatırımlarını bu kaynaklara yönlendirmesi dönüşümü hızlandırır.</p>
              <ul><li>Çatı üstü güneş panellerinin desteklenmesi</li><li>Fosil yakıtlara verilen desteklerin kademeli olarak kaldırılması</li><li>Güneş ve rüzgâr elektriğini depolayacak bataryalara yatırım yapılması</li></ul>
            </article>
            <article class="reel-fallback-item">
              <h4>2. Karbon Fiyatlandırması</h4>
              <p>Havaya salınan her ton karbona bir fiyat koymak "kirleten öder" demektir. Kirletmek pahalılaştıkça temiz üretim daha cazip hâle gelir.</p>
              <ul><li>Uzmanlara göre Paris hedefleri için 2030'a kadar ton başına 50-100 dolarlık bir karbon fiyatı gerekiyor</li><li>Toplanan gelir temiz enerjiye ve toplu taşımaya harcanabilir</li><li>AB, 2026'dan itibaren çelik, çimento ve alüminyum gibi ürünlerin ithalatında karbon bedeli almaya başladı</li></ul>
            </article>
            <article class="reel-fallback-item">
              <h4>3. Ormanların Korunması</h4>
              <p>Ormanlar dünyanın en büyük doğal karbon depolarından. Var olan ormanları korumak ve yeni ağaçlar dikmek, havadaki karbonu azaltmanın en doğal yolu.</p>
              <ul><li>Orman kesilerek üretilen ürünlerin ticaretinin sınırlanması</li><li>Ormanda yaşayan yerel halkların arazi haklarının korunması</li><li>Ormanlarını koruyan ülkelere mali destek sağlanması (REDD+)</li></ul>
            </article>
            <article class="reel-fallback-item">
              <h4>4. Uluslararası İşbirliği</h4>
              <p>İklim krizi sınır tanımaz: bir ülkenin salımı herkesi etkiler. Paris Anlaşması gibi anlaşmalar ülkeleri ortak ve takip edilebilir hedefler etrafında buluşturur.</p>
              <ul><li>Ülkelerin salım azaltma hedeflerini (NDC) güçlendirmesi</li><li>Gelişmekte olan ülkelere iklim finansmanı sağlanması</li><li>Temiz teknolojilerin ülkeler arasında paylaşılması</li></ul>
            </article>
            <article class="reel-fallback-item">
              <h4>5. Sanayi Dönüşümü</h4>
              <p>Çimento, çelik ve kimya fabrikaları çok yüksek ısıya ihtiyaç duyar ve bu ısıyı elektrikle üretmek her zaman kolay değildir. Yeşil hidrojen ve karbon yakalama gibi teknolojiler bu sektörlerin salımını azaltmanın başlıca yolları.</p>
              <ul><li>Kamu ihalelerinde düşük karbonlu çelik ve çimentonun tercih edilmesi</li><li>Yeşil hidrojen altyapısına yatırım yapılması</li><li>Fabrika salımlarının düzenli olarak ölçülüp denetlenmesi</li></ul>
            </article>
            <article class="reel-fallback-item">
              <h4>6. Sürdürülebilir Şehirler</h4>
              <p>2050'de dünya nüfusunun %68'inin şehirlerde yaşayacağı öngörülüyor. Toplu taşıması güçlü, yürünebilir ve yeşil alanı bol şehirler hem salımı azaltır hem de günlük yaşamı kolaylaştırır.</p>
              <ul><li>Okul, market ve parkın kısa yürüme mesafesinde olduğu mahalleler</li><li>Eski binaların yalıtılıp enerji verimli hâle getirilmesi</li><li>Kent ormanları ve yeşil koridorlar</li></ul>
            </article>
          </div>
        </noscript>
      </div>
    </div>
  </section>

  {{-- What is being done --}}

  <div class="ik-seam" aria-hidden="true"></div>

  <section id="progress-section" class="section-dark progress-parallax-section theme-white">
    <div class="section-header" data-aos="fade-up">
      <h2 class="section-title">Neler <em>Yapılıyor?</em></h2>
      <p class="section-desc">İklim krizine karşı bugün dünya çapında atılan somut adımlar.</p>
    </div>

    <div class="timeline" id="progressTimeline">
      <div class="timeline-spine">
        <div class="timeline-spine-fill" id="timelineSpineFill"></div>
      </div>

      <div class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="timeline-card">
          <div class="timeline-card-media">
            <img loading="lazy" src="{{ asset('assets/iklim-krizi/image/wikipedia/paris-anlasmasi.webp') }}" alt="Paris Anlaşması" decoding="async" width="1920" height="1028">
          </div>
          <div class="timeline-card-body">
            <h3>Paris Anlaşması</h3>
            <div class="timeline-card-desc">
              <p>195 ülke ve Avrupa Birliği (toplam 196 taraf), küresel ısınmayı 2°C'nin belirgin şekilde altında tutmayı ve mümkünse 1,5°C ile
                sınırlamayı taahhüt etti. Ülkeler her yıl COP zirvelerinde emisyon hedeflerini (NDC) güncelliyor;
                2023'teki ilk Küresel Stok Alma değerlendirmesi, taahhütlerin ne kadarının gerçek azaltıma
                dönüştüğünü resmen ölçtü.</p>
            </div>
          </div>
          <div class="timeline-card-progress"></div>
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="timeline-card">
          <div class="timeline-card-media">
            <img loading="lazy" src="{{ asset('assets/iklim-krizi/image/nasa/eo-pe-iss062e117852.webp') }}" alt="NASA'nın iklim gözlem uyduları" decoding="async" width="2048" height="1365">
          </div>
          <div class="timeline-card-body">
            <h3>NASA'nın İklim Gözlem Filosu</h3>
            <div class="timeline-card-desc">
              <p>NASA'nın Yer Sistemi Gözlemevi (Earth System Observatory) kapsamındaki uydular iklim değişikliğini
                uzaydan izliyor: OCO-2/OCO-3 atmosferdeki karbondioksiti, GRACE-FO ikiz uyduları Grönland ve
                Antarktika buz tabakalarının aylık kütle kaybını, NASA-ISRO ortak görevi NISAR ise ormanlardaki ve
                buzullardaki değişimi santimetre hassasiyetinde ölçüyor. Bu veriler dünya çapındaki iklim
                politikalarının bilimsel temelini oluşturuyor.</p>
            </div>
          </div>
          <div class="timeline-card-progress"></div>
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="timeline-card">
          <div class="timeline-card-media">
            <img loading="lazy" src="{{ asset('assets/iklim-krizi/image/wikipedia/cin-gunes-enerjisi.webp') }}" alt="Çin'in güneş enerjisi atılımı" decoding="async" width="1280" height="853">
          </div>
          <div class="timeline-card-body">
            <h3>Çin'in Güneş Enerjisi Atılımı</h3>
            <div class="timeline-card-desc">
              <p>Çin, 2023'te tek başına dünyanın yeni güneş enerjisi kapasitesinin yarısına yakınını, yaklaşık
                217 GW'ı kurdu. Güneş panellerinin maliyeti son on yılda %80 düştü; bugün dünyanın çoğu
                bölgesinde güneş ve rüzgâr enerjisi yeni kurulan fosil yakıt santrallerinden daha ucuz.</p>
            </div>
          </div>
          <div class="timeline-card-progress"></div>
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="timeline-card">
          <div class="timeline-card-media">
            <img loading="lazy" src="{{ asset('assets/iklim-krizi/image/wikipedia/norvec-elektrikli-arac.webp') }}" alt="Norveç'te elektrikli araç devrimi" decoding="async" width="1920" height="1160">
          </div>
          <div class="timeline-card-body">
            <h3>Norveç'te Elektrikli Araç Devrimi</h3>
            <div class="timeline-card-desc">
              <p>Norveç'te 2024'te satılan yeni araçların %88,9'u tam elektrikliydi; bu dünyada bir ilk. Vergi
                muafiyetleri, otoyol ücretlerinde indirim ve yaygın şarj altyapısı bu dönüşümü on yıldan kısa
                sürede gerçekleştirdi; büyük otomotiv üreticileri de içten yanmalı motordan çıkış takvimleri
                açıklıyor.</p>
            </div>
          </div>
          <div class="timeline-card-progress"></div>
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="timeline-card">
          <div class="timeline-card-media">
            <img loading="lazy" src="{{ asset('assets/iklim-krizi/image/wikipedia/avrupa-yesil-mutabakati.webp') }}" alt="Avrupa Yeşil Mutabakatı" decoding="async" width="1920" height="1440">
          </div>
          <div class="timeline-card-body">
            <h3>Avrupa Yeşil Mutabakatı</h3>
            <div class="timeline-card-desc">
              <p>Avrupa Birliği, 2050'ye kadar net sıfır emisyon hedefini yasal olarak bağlayıcı hale getiren
                Yeşil Mutabakat'ı kabul etti. Karbon sınırında düzenleme mekanizması (CBAM) ve sıkı emisyon
                hedefleri artık yürürlükte, üye ülkelerin politikalarını doğrudan şekillendiriyor.</p>
            </div>
          </div>
          <div class="timeline-card-progress"></div>
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="timeline-card">
          <div class="timeline-card-media">
            <img loading="lazy" src="{{ asset('assets/iklim-krizi/image/wikipedia/batarya-teknolojisi.webp') }}" alt="Batarya Teknolojisi" decoding="async" width="1920" height="1356">
          </div>
          <div class="timeline-card-body">
            <h3>Bataryada Atılım</h3>
            <div class="timeline-card-desc">
              <p>Lityum-iyon batarya maliyetleri 2010'dan bu yana %90'ın üzerinde geriledi. Bu düşüş, hem
                elektrikli araçları hem de şebeke ölçekli enerji depolamayı fosil yakıtla ekonomik olarak rekabet
                edebilir hale getirdi.</p>
            </div>
          </div>
          <div class="timeline-card-progress"></div>
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="timeline-card">
          <div class="timeline-card-media">
            <img loading="lazy" src="{{ asset('assets/iklim-krizi/image/wikipedia/karbon-yakalama-teknolojisi.webp') }}" alt="Climeworks'ün karbon yakalama tesisi" decoding="async" width="1920" height="1315">
          </div>
          <div class="timeline-card-body">
            <h3>Climeworks'ün Karbon Yakalama Tesisi</h3>
            <div class="timeline-card-desc">
              <p>İsviçreli Climeworks, 2024'te İzlanda'da dünyanın en büyük doğrudan hava yakalama (DAC) tesisi
                Mammoth'u devreye aldı; tesis tam kapasitede yılda 36.000 ton CO₂'yi doğrudan havadan çekip yer altında
                bazalt kayaçlara mineralize ediyor. Benzer tesisler dünya genelinde çoğalıyor.</p>
            </div>
          </div>
          <div class="timeline-card-progress"></div>
        </div>
      </div>
    </div>
  </section>

  {{-- Resources --}}

  <div class="ik-seam" aria-hidden="true"></div>

  <section id="resources-section" class="section-dark theme-green">
    <div class="container">
      <div class="section-header" data-aos="fade-up">
        <h2 class="section-title">Daha Fazla <em>Öğrenin</em></h2>
        <p class="section-desc">
          Bu sayfa bir başlangıç noktası. İklim krizini daha derinlemesine anlamak isteyenler için güvenilir
          kaynaklar derledik.
        </p>
      </div>

      <div class="bento-grid" id="bentoGrid">
        <a class="bento-card bento-span-2" data-bento="spotlight" href="https://www.un.org/climatechange"
          target="_blank" rel="noopener noreferrer">
          <div class="bento-card-head">
            <h3 class="bento-card-title">UN Climate Action</h3>
            <i class="fa-solid fa-arrow-up-right-from-square bento-card-arrow"></i>
          </div>
          <p class="bento-card-desc">Birleşmiş Milletler'in küresel iklim politikaları, anlaşma takibi ve resmi karar süreçlerine dair kapsamlı kaynak merkezi.</p>
          <ul class="bento-spotlight-list">
            <li><i class="fa-solid fa-circle-check"></i><span>Paris Anlaşması'nın takibi ve uygulanması</span></li>
            <li><i class="fa-solid fa-circle-check"></i><span>Ulusal katkı beyanları (NDC) raporları</span></li>
            <li><i class="fa-solid fa-circle-check"></i><span>İklim finansmanı mekanizmaları</span></li>
            <li><i class="fa-solid fa-circle-check"></i><span>COP zirve süreci ve karar metinleri</span></li>
          </ul>
        </a>

        <a class="bento-card" data-bento="counter" href="https://climate.nasa.gov" target="_blank" rel="noopener noreferrer">
          <div class="bento-card-head">
            <h3 class="bento-card-title">NASA Climate</h3>
            <i class="fa-solid fa-arrow-up-right-from-square bento-card-arrow"></i>
          </div>
          <p class="bento-card-desc">NASA'nın uydu gözlemleriyle beslenen, sürekli güncellenen küresel iklim verileri ve görselleştirmeleri.</p>
          <div class="bento-counter">
            <span class="bento-counter-value" data-counter-end="1.2" data-counter-decimals="1" aria-live="off">1.2</span><span
              class="bento-counter-suffix">°C</span>
          </div>
          <span class="bento-counter-label">1880'den bu yana küresel ortalama ısınma</span>
        </a>

        <a class="bento-card" data-bento="timeline" href="https://www.ipcc.ch" target="_blank" rel="noopener noreferrer">
          <div class="bento-card-head">
            <h3 class="bento-card-title">IPCC</h3>
            <i class="fa-solid fa-arrow-up-right-from-square bento-card-arrow"></i>
          </div>
          <p class="bento-card-desc">Hükümetlerarası İklim Değişikliği Paneli, binlerce bilim insanının katkısıyla hazırlanan değerlendirme raporlarının resmi kaynağı.</p>
          <ul class="bento-timeline">
            <li><span class="bento-timeline-year">1988</span><span class="bento-timeline-event">IPCC kuruldu</span>
            </li>
            <li><span class="bento-timeline-year">2007</span><span class="bento-timeline-event">4. Değerlendirme
                Raporu</span></li>
            <li><span class="bento-timeline-year">2015</span><span class="bento-timeline-event">Paris Anlaşması'na
                bilimsel temel</span></li>
            <li><span class="bento-timeline-year">2023</span><span class="bento-timeline-event">6. Değerlendirme
                Sentez Raporu</span></li>
          </ul>
        </a>

        <a class="bento-card" data-bento="chart"
          href="https://ourworldindata.org/co2-and-greenhouse-gas-emissions" target="_blank" rel="noopener noreferrer">
          <div class="bento-card-head">
            <h3 class="bento-card-title">Our World in Data</h3>
            <i class="fa-solid fa-arrow-up-right-from-square bento-card-arrow"></i>
          </div>
          <p class="bento-card-desc">CO₂ ve sera gazı emisyonlarına dair açık, güncel verilerle desteklenmiş kapsamlı görselleştirmeler ve analizler.</p>
          <div class="bento-chart-row">
            <span>Enerji kaynaklı CO₂ payı</span>
            <span class="bento-chart-value">%75</span>
          </div>
          <div class="bento-chart-track">
            <div class="bento-chart-fill" data-chart-value="75"></div>
          </div>
        </a>

        <a class="bento-card" href="https://www.imdb.com/title/tt14539726/" target="_blank" rel="noopener noreferrer">
          <div class="bento-card-head">
            <h3 class="bento-card-title">Breaking Boundaries</h3>
            <span class="bento-card-tag"><i class="fa-solid fa-clapperboard"></i> Belgesel</span>
            <i class="fa-solid fa-arrow-up-right-from-square bento-card-arrow"></i>
          </div>
          <p class="bento-card-desc">David Attenborough'un anlattığı, gezegenin ekolojik sınırlarını bilimsel
            verilerle ele alan Netflix belgeseli.</p>
        </a>

        <a class="bento-card" href="https://www.imdb.com/title/tt9253866/" target="_blank" rel="noopener noreferrer">
          <div class="bento-card-head">
            <h3 class="bento-card-title">Our Planet</h3>
            <span class="bento-card-tag"><i class="fa-solid fa-clapperboard"></i> Belgesel</span>
            <i class="fa-solid fa-arrow-up-right-from-square bento-card-arrow"></i>
          </div>
          <p class="bento-card-desc">Dünyanın en kırılgan ekosistemlerini ve iklim değişikliğinin bu ekosistemler
            üzerindeki etkisini gözler önüne seren Netflix belgesel serisi.</p>
        </a>

        <a class="bento-card" href="https://www.imdb.com/title/tt0497116/" target="_blank" rel="noopener noreferrer">
          <div class="bento-card-head">
            <h3 class="bento-card-title">An Inconvenient Truth</h3>
            <span class="bento-card-tag"><i class="fa-solid fa-clapperboard"></i> Belgesel</span>
            <i class="fa-solid fa-arrow-up-right-from-square bento-card-arrow"></i>
          </div>
          <p class="bento-card-desc">Al Gore'un iklim krizine küresel farkındalık kazandıran, alanının öncü yapımlarından belgesel filmi.</p>
        </a>
      </div>
    </div>
  </section>

  {{-- Bibliography --}}

  <section id="sources-section" class="sources-section theme-green">
    <div class="container sources-inner">
      <span class="sources-label">Kaynakça</span>
      <div class="sources-links">
        <a href="https://science.nasa.gov/climate-change/" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-satellite"></i> NASA: Climate Change</a>
        <a href="https://cevreselgostergeler.csb.gov.tr/" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-landmark"></i> ÇŞB: Çevresel Göstergeler</a>
        <a href="https://sdgs.un.org/" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-earth-europe"></i> BM: Sürdürülebilir Kalkınma Hedefleri</a>
        <a href="https://media.un.org/photo/en" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-camera"></i> BM Fotoğraf Arşivi</a>
        <a href="https://commons.wikimedia.org/" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-wikipedia-w"></i> Wikimedia Commons</a>
        <a href="https://www.pexels.com/" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-image"></i> Pexels</a>
      </div>
    </div>
  </section>

  </main>

@endsection

@push('scripts')
  {{-- GSAP + ScrollTrigger for section entrance animations. Versions are pinned
       and verified with SRI so a CDN change cannot alter or inject code. --}}
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js" integrity="sha384-XmJ9SoHtVOHoQUcKvFAzVXwdkKo1Ie3bhmSoIAkcdsHGaIrVJIkmozyq0FJeb/Ly" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/ScrollTrigger.min.js" integrity="sha384-wl5TeDVvOWt30Pbf8aSo2ZrzsOjddu3avOBvHe+p+OhJt9gP6w9YXmDkN5DK2/dF" crossorigin="anonymous"></script>
  {{-- Lenis: smooth (inertial) scrolling --}}
  <script src="https://cdn.jsdelivr.net/npm/lenis@1.3.25/dist/lenis.min.js" integrity="sha384-ClD7pCgIUz5M81HT8aZmMxCsWmfsycmBiwL5gy1pUbdWHvICIbea22N9sTtAFotA" crossorigin="anonymous"></script>

  <script src="{{ asset('assets/iklim-krizi/js/script.js') }}?v={{ $assetVersion('assets/iklim-krizi/js/script.js') }}"></script>
@endpush
