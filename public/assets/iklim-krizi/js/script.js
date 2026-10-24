/* ── Asset root ──
   The base URL comes from Blade's asset() via <main data-asset-base>, so paths
   in this file stay relative and survive a domain or folder change. */
const IK_ASSET_BASE = (function () {
  const main = document.getElementById('main-content');
  const base = main ? main.getAttribute('data-asset-base') : '';
  if (!base) {
    console.error('İklim Krizi: #main-content üzerinde data-asset-base yok; görseller yüklenemez.');
    return '';
  }
  return base.endsWith('/') ? base : `${base}/`;
})();

function ikAssetUrl(relativePath) {
  return IK_ASSET_BASE + relativePath;
}

/* ── DOM helpers ──
   Markup is always built with DOM APIs and text is set with textContent, never
   by parsing HTML strings: even though today's data is static, a future edit
   that pulls text from elsewhere cannot turn into an XSS sink. */
function ikEl(tag, { className, text, attrs } = {}, children = []) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  if (attrs) Object.entries(attrs).forEach(([name, value]) => el.setAttribute(name, value));
  el.append(...children);
  return el;
}

// Font Awesome icons are decorative here; the owning control carries the label.
function ikIcon(className) {
  return ikEl('i', { className, attrs: { 'aria-hidden': 'true' } });
}

/* ── Skip link ──
   The site layout renders the menu before the page content, so a skip link
   left inside the content would only be reached after every menu item. It is
   moved to the start of <body>; without JS it still works where it is. */
(function () {
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) document.body.prepend(skipLink);
})();

/* ── Page scroll lock ──
   Dialogs and the zoomed chart must not scroll the page behind them.
   overflow:hidden on <body> is not enough: <html> has overflow-x:clip, so the
   lock would not reach the viewport, and Lenis handles the wheel itself. The
   lock goes on <html> and Lenis is notified through an event. */
function setPageScrollLocked(locked) {
  document.documentElement.classList.toggle('ik-scroll-locked', locked);
  document.dispatchEvent(new CustomEvent('ik:scroll-lock', { detail: { locked } }));
}

/* ── Global temperature anomaly data ──
   NASA GISS GISTEMP v4, annual global mean (J-D column), °C relative to the
   1951-1980 mean. Source:
   https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts+dSST.csv
   (last updated 2026-09-08, accessed 2026-09-13). Values are copied verbatim;
   the section seams and the Global Warming scene share this array. */
const GISTEMP_FIRST_YEAR = 1880;
const GISTEMP_ANNUAL = [
  -0.18,
  -0.09,
  -0.12,
  -0.18,
  -0.29,
  -0.34,
  -0.32,
  -0.37,
  -0.18,
  -0.11, // 1880–1889
  -0.36,
  -0.23,
  -0.28,
  -0.32,
  -0.31,
  -0.23,
  -0.12,
  -0.12,
  -0.28,
  -0.18, // 1890–1899
  -0.09,
  -0.16,
  -0.29,
  -0.38,
  -0.48,
  -0.27,
  -0.23,
  -0.39,
  -0.43,
  -0.49, // 1900–1909
  -0.44,
  -0.45,
  -0.37,
  -0.36,
  -0.17,
  -0.15,
  -0.37,
  -0.46,
  -0.3,
  -0.28, // 1910–1919
  -0.28,
  -0.19,
  -0.29,
  -0.27,
  -0.27,
  -0.22,
  -0.11,
  -0.22,
  -0.2,
  -0.36, // 1920–1929
  -0.16,
  -0.09,
  -0.16,
  -0.29,
  -0.13,
  -0.2,
  -0.15,
  -0.03,
  -0.01,
  -0.02, // 1930–1939
  0.12,
  0.18,
  0.06,
  0.09,
  0.2,
  0.09,
  -0.07,
  -0.03,
  -0.11,
  -0.11, // 1940–1949
  -0.18,
  -0.07,
  0.01,
  0.08,
  -0.13,
  -0.14,
  -0.19,
  0.05,
  0.06,
  0.03, // 1950–1959
  -0.02,
  0.06,
  0.03,
  0.05,
  -0.2,
  -0.11,
  -0.06,
  -0.02,
  -0.08,
  0.05, // 1960–1969
  0.03,
  -0.08,
  0.01,
  0.16,
  -0.07,
  -0.01,
  -0.1,
  0.18,
  0.07,
  0.16, // 1970–1979
  0.26,
  0.32,
  0.14,
  0.31,
  0.16,
  0.12,
  0.18,
  0.32,
  0.39,
  0.27, // 1980–1989
  0.45,
  0.41,
  0.22,
  0.23,
  0.32,
  0.45,
  0.33,
  0.47,
  0.61,
  0.38, // 1990–1999
  0.39,
  0.53,
  0.63,
  0.62,
  0.53,
  0.68,
  0.64,
  0.66,
  0.54,
  0.66, // 2000–2009
  0.72,
  0.61,
  0.65,
  0.68,
  0.75,
  0.9,
  1.01,
  0.92,
  0.85,
  0.98, // 2010–2019
  1.01,
  0.85,
  0.89,
  1.17,
  1.29,
  1.19, // 2020–2025
];

/* ── Temperature anomaly colour scale ──
   The seams and the Global Warming scene read the same diverging scale:
   11 token steps, the middle step is the baseline mean and the ends are the
   largest absolute anomaly. Stripes are painted as one hard-stop
   linear-gradient: one background instead of hundreds of elements, crisp at
   any width. */
const anomalyStripes = (function () {
  const rootStyle = getComputedStyle(document.documentElement);
  const SCALE_STEPS = 11;
  const scale = Array.from({ length: SCALE_STEPS }, (_, step) =>
    rootStyle.getPropertyValue(`--anomaly-${step}`).trim(),
  );
  const middleStep = (SCALE_STEPS - 1) / 2;
  const bound = Math.max(...GISTEMP_ANNUAL.map((value) => Math.abs(value)));

  function colorFor(value) {
    const step = Math.round((value / bound) * middleStep) + middleStep;
    return scale[Math.min(SCALE_STEPS - 1, Math.max(0, step))];
  }

  function gradient(values) {
    const width = 100 / values.length;
    const stops = values.map(
      (value, i) => `${colorFor(value)} ${(i * width).toFixed(3)}% ${((i + 1) * width).toFixed(3)}%`,
    );
    return `linear-gradient(90deg, ${stops.join(', ')})`;
  }

  return { scale, bound, gradient };
})();

/* ── Warming stripe seams ──
   The .ik-seam elements between sections split the series into consecutive
   periods: the first seam starts in the 1880s and the last ends in recent
   years, so the stripes redden as the reader scrolls down. */
(function () {
  const seams = Array.prototype.slice.call(document.querySelectorAll('.ik-seam'));
  if (!seams.length) return;

  const yearsPerSeam = Math.ceil(GISTEMP_ANNUAL.length / seams.length);
  // Animate the reveal only when visibility can be observed; otherwise the
  // stripe would stay hidden forever.
  const animate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window;

  seams.forEach((seam, index) => {
    const values = GISTEMP_ANNUAL.slice(index * yearsPerSeam, (index + 1) * yearsPerSeam);
    if (!values.length) return;
    const firstYear = GISTEMP_FIRST_YEAR + index * yearsPerSeam;

    const stripes = document.createElement('span');
    stripes.className = 'ik-seam-stripes';
    stripes.style.backgroundImage = anomalyStripes.gradient(values);
    const label = document.createElement('span');
    label.className = 'ik-seam-label';
    label.textContent = `${firstYear}–${firstYear + values.length - 1}`;
    seam.append(stripes, label);
    if (animate) seam.classList.add('is-waiting');
  });

  if (!animate) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.replace('is-waiting', 'is-drawn');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  seams.forEach((seam) => observer.observe(seam));
})();

/* ── YEAR axis in headings ──
   The Climate Crisis font's YEAR axis distorts the letters as if they were
   melting. When a section becomes active, its heading and lead paragraph get
   a YEAR value between 2000 and 2040: --yr is written on :root and inherited,
   so the font-variation-settings rules in style.css update on their own while
   all other text keeps the regular font. */
(function () {
  const sectionIds = [
    'sdg-section',
    'happening-section',
    'causes-section',
    'consequences-section',
    'actions-section',
    'progress-section',
    'resources-section',
  ];
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
  if (!sections.length) return;

  const YEAR_MIN = 2000;
  const YEAR_MAX = 2040;
  const root = document.documentElement;

  function activate(index) {
    const t = sections.length > 1 ? index / (sections.length - 1) : 0;
    const year = YEAR_MIN + t * (YEAR_MAX - YEAR_MIN);
    root.style.setProperty('--yr', year.toFixed(1));
  }

  // A thin tracking band in the vertical middle of the viewport (rootMargin
  // instead of threshold) fires exactly when a section boundary crosses the
  // middle, regardless of section height; a fixed threshold activated very
  // tall sections too late.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = sections.indexOf(entry.target);
        if (index !== -1) activate(index);
      });
    },
    { threshold: 0, rootMargin: '-45% 0px -45% 0px' },
  );

  sections.forEach((section) => observer.observe(section));
})();

/* ── SDG orbit ── */
(function () {
  /* ── 1. Data ── */
  // Each goal's "Şu An Dünyada" / "Bu Hedef Ne Amaçlıyor" text and statistic
  // are written from the UN's per-goal pages (sdgs.un.org/goals/goalN) and
  // verified against them.
  const sdgData = [
    {
      id: 1,
      title: 'Yoksulluğa Son',
      color: '#E5243B',
      tag: 'SOSYAL',
      status:
        "Küresel yoksullukla mücadelede ilerleme neredeyse durma noktasında: dünya nüfusunun yaklaşık onda biri hâlâ aşırı yoksulluk içinde yaşıyor. 3,8 milyar insanın hiçbir sosyal koruma kapsamı yok; bu oran düşük gelirli ülkelerde %9,7'ye inerken yüksek gelirli ülkelerde %85,9'a çıkıyor.",
      aim: "Bu hedef, 2030'a kadar yoksulluğu her biçimiyle ve her yerde sona erdirmeyi amaçlıyor: sadece aşırı yoksulluğu değil, her ülkenin kendi tanımına göre yoksulluğu da en az yarıya indirmeyi. Yoksullara gerçekten ulaşan sosyal koruma sistemleri kurmayı, ekonomik kaynaklara ve toprağa eşit erişimi, iklim ve ekonomik şoklara karşı dayanıklılığı hedefliyor.",
      stat: '847M',
      statLabel: "kişi 2024'te günlük 3 doların altında yaşıyordu",
    },
    {
      id: 2,
      title: 'Açlığa Son',
      color: '#DDA63A',
      tag: 'GIDA',
      status:
        "2024'te küresel açlık hafifçe geriledi ama hâlâ 2015 seviyesinin oldukça üzerinde. 2,3 milyar insan orta ya da ciddi düzeyde gıda güvensizliği yaşıyor (2015'te 1,6 milyardı) ve 150,2 milyon çocuk gelişim geriliği (bodurluk) yaşıyor.",
      aim: "Bu hedef, 2030'a kadar açlığı sona erdirmeyi, gıda güvenliğini ve beslenmeyi iyileştirmeyi, sürdürülebilir tarımı yaygınlaştırmayı amaçlıyor. Küçük ölçekli üreticilerin verimliliğini ve gelirini ikiye katlamayı, tarımı iklim değişikliğine karşı dirençli hale getirmeyi hedefliyor.",
      stat: '%8,2',
      statLabel: "dünya nüfusu 2024'te yetersiz besleniyordu",
    },
    {
      id: 3,
      title: 'Sağlıklı Bireyler',
      color: '#4C9F38',
      tag: 'SAĞLIK',
      status:
        "Sağlıkta ilerleme dengesiz: 5 yaş altı ölümler 2015'teki 6,1 milyondan 2024'te 4,9 milyona geriledi, ama bulaşıcı olmayan hastalıklar (kalp hastalığı, kanser, diyabet vb.) 2021'de 70 yaş altı 18 milyon kişinin ölümüne yol açtı; bu da her 2 saniyede bir erken ölüm demek. 2030'a kadar 11,1 milyon sağlık çalışanı açığı öngörülüyor.",
      aim: 'Bu hedef, her yaştan insan için sağlıklı bir yaşamı ve refahı güvence altına almayı amaçlıyor: anne ve çocuk ölümlerini keskin biçimde azaltmak, AIDS/tüberküloz/sıtma salgınlarını sona erdirmek, bulaşıcı olmayan hastalıklardan erken ölümleri azaltmak ve herkesin mali zorluk yaşamadan kaliteli sağlık hizmetine erişebildiği evrensel sağlık kapsayıcılığına ulaşmak.',
      stat: '197',
      statLabel: 'her 100.000 canlı doğumda anne ölümü (2023)',
    },
    {
      id: 4,
      title: 'Nitelikli Eğitim',
      color: '#C5192D',
      tag: 'EĞİTİM',
      status:
        "Okullaşma arttı ama öğrenme çıktıları geriliyor: 57 ülkede ortaokul sonunda okuma yeterliliği 2012-2022 arasında %59'dan %47'ye, matematik yeterliliği %41'den %36'ya düştü. 754 milyon yetişkin hâlâ okuma yazma bilmiyor (%63'ü kadın) ve ilkokulların beşte birinden fazlasında elektrik, su ya da sanitasyon gibi temel hizmetler yok.",
      aim: 'Bu hedef, herkes için kapsayıcı, hakkaniyetli ve nitelikli eğitimi, yaşam boyu öğrenme fırsatlarını güvence altına almayı amaçlıyor: her kız ve erkek çocuğun sadece okula gitmesini değil, gerçek öğrenme çıktılarıyla ücretsiz ilk ve orta öğretimi tamamlamasını, evrensel okuryazarlığı hedefliyor.',
      stat: '%58',
      statLabel: 'öğrenci ilkokul sonunda asgari okuma yeterliliğine ulaşabiliyor (2019)',
    },
    {
      id: 5,
      title: 'Cinsiyet Eşitliği',
      color: '#FF3A21',
      tag: 'EŞİTLİK',
      status:
        "Dünya genelinde yaklaşık her 3 kadından biri (840 milyon kişi) hayatının bir döneminde fiziksel ve/veya cinsel şiddete maruz kalıyor. Kadınlar, erkeklerin sahip olduğu yasal hakların yalnızca %64'üne sahip. Genç kadınların beşte biri 18 yaşından önce evlendirildi, 230 milyon kadın ve kız çocuğu kadın sünnetine (FGM) maruz kaldı.",
      aim: 'Bu hedef, kadın ve kız çocuklarına yönelik her türlü ayrımcılığı ve şiddeti sona erdirmeyi, çocuk evliliği ve kadın sünneti gibi zararlı uygulamaları ortadan kaldırmayı amaçlıyor. Kadınların siyasi, ekonomik ve kamusal yaşamda eşit katılımını, üreme sağlığına erişimini, toprak/mülkiyet/finansal hizmetlerde eşit haklarını hedefliyor.',
      stat: '840M',
      statLabel: 'kadın ve kız çocuğu hayatında fiziksel/cinsel şiddete maruz kaldı',
    },
    {
      id: 6,
      title: 'Temiz Su ve Sanitasyon',
      color: '#26BDE2',
      tag: 'SU',
      status:
        "2,1 milyar insan güvenle yönetilen içme suyuna, 3,4 milyar insan güvenli sanitasyona, 1,7 milyar insan ise temel hijyen hizmetlerine erişemiyor. Evsel atık suların yalnızca %56'sı güvenli şekilde arıtılıyor. BM'nin kendi değerlendirmesi açık: Hedef 6'nın hiçbir alt hedefi 2030 rotasında değil.",
      aim: 'Bu hedef, herkes için güvenli içme suyuna, yeterli sanitasyon ve hijyene evrensel ve uygun fiyatlı erişimi güvence altına almayı amaçlıyor; bu hedefte özellikle kadınlar, kız çocukları ve kırılgan gruplar gözetiliyor. Su kirliliğini azaltmayı, suyu verimli kullanmayı, nehir/göl/sulak alan gibi tatlı su ekosistemlerini sürdürülebilir yönetmeyi hedefliyor.',
      stat: '2,1B',
      statLabel: 'kişi güvenle yönetilen içme suyuna hâlâ erişemiyor',
    },
    {
      id: 7,
      title: 'Erişilebilir Enerji',
      color: '#FCC30B',
      tag: 'ENERJİ',
      status:
        "Küresel elektrik erişimi 2024'te %92'ye ulaştı, ama 655 milyon insan hâlâ elektriksiz yaşıyor. Nüfusun yaklaşık %75'i temiz pişirme imkânına sahip, 2 milyardan fazla insan hâlâ kirletici yakıtlara bağımlı. Yenilenebilir enerji, nihai enerji tüketiminin %18'ine ulaştı (2015'te %15,6 idi).",
      aim: "Bu hedef, 2030'a kadar herkes için uygun fiyatlı, güvenilir, sürdürülebilir ve modern enerjiye erişimi güvence altına almayı amaçlıyor. Küresel enerji karışımında yenilenebilir payını belirgin biçimde artırmayı ve enerji verimliliğindeki iyileşme hızını ikiye katlamayı hedefliyor.",
      stat: '655M',
      statLabel: 'kişi hâlâ elektriğe erişemiyor (küresel erişim %92 olmasına rağmen)',
    },
    {
      id: 8,
      title: 'İnsana Yakışır İş',
      color: '#A21942',
      tag: 'EKONOMİ',
      status:
        "Küresel işsizlik 2025'te yaklaşık %4,9'da sabit kaldı, ama gençler yetişkinlere kıyasla neredeyse 4 kat daha fazla işsizlik riskiyle karşı karşıya. Kayıt dışı istihdam küresel iş gücünün %57,9'unu oluşturuyor. 2024'te yaklaşık 138 milyon çocuk (tüm çocukların %8'i) çocuk işçiliğine maruz kaldı.",
      aim: 'Bu hedef, sürdürülen ve kapsayıcı ekonomik büyümeyi, tam ve üretken istihdamı, herkes için insana yakışır işi bir arada sağlamayı amaçlıyor; büyüme her ne pahasına olursa olsun değil, güvenli koşullar, adil ücret ve yasal korumayla gerçekleşmeli. Zorla çalıştırma, modern kölelik ve çocuk işçiliğini tamamen ortadan kaldırmayı hedefliyor.',
      stat: '138M',
      statLabel: "çocuk 2024'te çocuk işçiliğine maruz kaldı",
    },
    {
      id: 9,
      title: 'Sanayi ve Yenilikçilik',
      color: '#FD6925',
      tag: 'İNOVASYON',
      status:
        "Sanayi ve yakıt yakmadan kaynaklanan küresel CO₂ emisyonu 2024'te rekor kırarak 37,6 gigatona ulaştı. Dijital altyapı erişimi son derece eşitsiz: 2025'te 5G ağları yüksek gelirli ülkelerin %84'üne ulaşırken düşük gelirli ülkelerde bu oran yalnızca %4.",
      aim: 'Bu hedef, herkes için işleyen dayanıklı altyapı ve kapsayıcı, sürdürülebilir sanayileşmeyi amaçlıyor. Sanayinin daha temiz ve kaynak verimli teknolojilere geçişini, özellikle en az gelişmiş ülkelerde evrensel ve uygun fiyatlı internet erişimini hedefliyor.',
      stat: '%4',
      statLabel: 'düşük gelirli ülkelerde 5G kapsama oranı (yüksek gelirlilerde %84)',
    },
    {
      id: 10,
      title: 'Eşitsizliklerin Azaltılması',
      color: '#DD1367',
      tag: 'ADALET',
      status:
        "Dünya nüfusunun %13'ü kendi ülkesinin medyan gelirinin yarısından azıyla yaşıyor (Latin Amerika'da bu oran %20'ye çıkıyor). Neredeyse her 5 kişiden biri ayrımcılığa maruz kaldığını bildiriyor. 2024 ortası itibarıyla 37,8 milyon kişi mülteci statüsünde (2015'e göre iki kattan fazla artış).",
      aim: "Bu hedef, ülkeler içindeki ve ülkeler arasındaki gelir uçurumunu kapatmayı amaçlıyor. En yoksul %40'lık kesimin gelirinin ulusal ortalamadan daha hızlı artmasını, yaş/cinsiyet/engellilik/ırk fark etmeksizin eşit fırsatı, gelişmekte olan ülkelerin küresel ekonomik kurumlarda daha güçlü sesini hedefliyor.",
      stat: '37,8M',
      statLabel: 'kişi 2024 ortası itibarıyla mülteci statüsündeydi',
    },
    {
      id: 11,
      title: 'Sürdürülebilir Şehirler',
      color: '#FD9D24',
      tag: 'KENTSEL',
      status:
        "Dünya nüfusunun yarısından fazlası zaten şehirlerde yaşıyor, bu oranın 2050'ye kadar %70'e çıkması bekleniyor. 2022'de 1,12 milyar insan gecekondu ya da benzeri koşullarda yaşıyordu (2015'e göre 130 milyon fazla). Kentlilerin yalnızca %61,5'i toplu taşımaya rahat erişebiliyor.",
      aim: 'Bu hedef, büyümeye devam eden şehirleri kapsayıcı, güvenli, dayanıklı ve sürdürülebilir kılmayı amaçlıyor. Herkesin uygun fiyatlı konuta ve iyileştirilmiş gecekondu alanlarına erişimini, güvenli ve erişilebilir toplu taşımayı, şehirlerin çevresel ayak izinin azaltılmasını hedefliyor.',
      stat: '1,12B',
      statLabel: "kişi 2022'de gecekondu benzeri koşullarda yaşıyordu",
    },
    {
      id: 12,
      title: 'Sorumlu Tüketim',
      color: '#BF8B2E',
      tag: 'TÜKETİM',
      status:
        "Her yıl yaklaşık 1,05 milyar ton gıda israf ediliyor (bunun %60'ı hane halkı kaynaklı); bu, yüz milyonlarca insan aç yaşarken gerçekleşiyor. 2023'te dünya 65 milyon ton e-atık üretti (kişi başına 8,1 kg), bunun sadece 15,5 milyon tonu (dörtte birinden azı) resmi olarak geri dönüştürüldü.",
      aim: 'Bu hedef, ekonomik büyüme ile çevresel tahribat arasındaki bağı koparmayı amaçlıyor. Kişi başına küresel gıda israfını perakende ve tüketici düzeyinde yarıya indirmeyi, kimyasalların ve atıkların çevreye duyarlı yönetimini, büyük şirketlerin sürdürülebilir ve şeffaf uygulamalar benimsemesini hedefliyor.',
      stat: '65M ton',
      statLabel: "e-atık üretildi (2023), sadece %24'ü geri dönüştürüldü",
    },
    {
      id: 13,
      title: 'İklim Eylemi',
      color: '#3F7E44',
      tag: 'ACİL',
      status:
        "2025'te küresel ortalama sıcaklık, sanayi öncesi döneme göre 1,43°C daha yüksek; bu da Paris Anlaşması'nın 1,5°C sınırına doğrudan dayanıyor. Atmosferdeki CO₂ seviyesi 2024'te 2 milyon yılın en yüksek noktasına ulaştı (sanayi öncesinin %152 üzerinde). İklim afetleri her yıl ortalama 123 milyon insanı etkiliyor.",
      aim: 'Bu hedef, iklim değişikliğiyle ve etkileriyle mücadele için acil eylemi amaçlıyor. Bu on yılda hızlı ve derin emisyon azaltımı olmazsa 1,5°C sınırının aşılacağı ve milyarlarca hayatın risk altına gireceği öngörülüyor. İklim afetlerine dayanıklılığı, iklim eylemini ulusal politikalara entegre etmeyi, gelişmekte olan ülkelere iklim finansmanını hedefliyor.',
      stat: '1,43°C',
      statLabel: "2025'te sanayi öncesi döneme göre küresel sıcaklık artışı",
    },
    {
      id: 14,
      title: 'Sudaki Yaşam',
      color: '#0A97D9',
      tag: 'OKYANUS',
      status:
        "Okyanuslar sanayi öncesi döneme kıyasla yaklaşık %30 daha asidik; bu da mercanları ve deniz canlılarını doğrudan tehdit ediyor. Küresel balık stoklarının %37,7'si 2021'de aşırı avlanmaya maruz kaldı (2019'da %35,4 idi). Deniz alanı planlaması yapan 126 ülkeden sadece 45'inin resmi onaylı planı var (2024).",
      aim: "Bu hedef, okyanusları ve deniz kaynaklarını korumayı ve sürdürülebilir kullanmayı amaçlıyor; dünya yüzeyinin %70'inden fazlasını kaplayan okyanuslara 3 milyardan fazla insan geçim kaynağı için bağımlı durumda. Deniz kirliliğini azaltmayı, kıyı ve deniz ekosistemlerini korumayı, aşırı avlanmayı sona erdirmeyi, kıyı/deniz alanlarının en az %10'unu koruma altına almayı hedefliyor.",
      stat: '%37,7',
      statLabel: "küresel balık stoku 2021'de aşırı avlanmaya maruz kaldı",
    },
    {
      id: 15,
      title: 'Karasal Yaşam',
      color: '#56C02B',
      tag: 'EKOSİSTEM',
      status:
        "Küresel orman örtüsü 2025'te kara alanının %31,8'ine geriledi (4,14 milyar hektar); 1990'dan bu yana 203,1 milyon hektar (%4,7) kayıp yaşandı. Tarımsal genişleme, küresel ormansızlaşmanın neredeyse %90'ının doğrudan nedeni. 2015-2019 arasında her yıl en az 100 milyon hektar verimli arazi kayboldu; bu durum 1,3 milyar insanı doğrudan etkiliyor.",
      aim: 'Bu hedef, karasal ekosistemleri korumayı, eski haline getirmeyi ve sürdürülebilir kullanımını desteklemeyi amaçlıyor: ormanları sürdürülebilir yönetmek, çölleşmeyle mücadele etmek, arazi bozulmasını durdurup tersine çevirmek, biyoçeşitlilik kaybını durdurmak. BM\'nin kendi ifadesiyle biyoçeşitlilik "insanlığın yaşam destek sistemi."',
      stat: '1,3B',
      statLabel: 'kişi arazi bozulmasından doğrudan etkileniyor',
    },
    {
      id: 16,
      title: 'Barış ve Adalet',
      color: '#00689D',
      tag: 'YÖNETİŞİM',
      status:
        "Şiddetli çatışmalar on yılların en yüksek seviyesine ulaştı. Haziran 2025 itibarıyla 117,3 milyon insan zorla yerinden edildi, bunların 42,5 milyonu mülteci. Küresel cinayet oranı 2015'teki 100.000 kişide 5,9'dan 2024'te 5,1'e geriledi; bu, 2030 hedefi olan %50 azalmanın çok gerisinde.",
      aim: 'Bu hedef, barışçıl ve kapsayıcı toplumları, herkes için adalete erişimi, her düzeyde etkili ve hesap verebilir kurumları amaçlıyor. Şiddeti ve ölüm oranlarını azaltmayı, çocuk istismarı ve insan kaçakçılığını sona erdirmeyi, yolsuzluğu ve yasa dışı mali akışları önemli ölçüde kısmayı hedefliyor.',
      stat: '117,3M',
      statLabel: 'kişi dünya genelinde zorla yerinden edildi (Haziran 2025)',
    },
    {
      id: 17,
      title: 'Hedefler İçin Ortaklık',
      color: '#19486A',
      tag: 'ORTAKLIK',
      status:
        "Büyük bağışçı ülkelerin resmi kalkınma yardımı 2025'te 174,3 milyar dolara geriledi; 2024'e göre %23,1'lik bu düşüş \"kayıtlardaki en büyük yıllık azalış\" oldu. Gelişmekte olan ülkelerin toplam dış borcu 2024'te rekor kırarak 8,9 trilyon dolara ulaştı.",
      aim: "Bu hedef, diğer tüm hedefleri finanse edecek ve hayata geçirecek küresel ortaklıkları güçlendirmeyi amaçlıyor. Zengin ülkelerin uzun süredir taahhüt ettiği yardım hedeflerini (gayri safi milli hasılanın %0,7'si) karşılamasını, borç yönetimine destek olmasını, teknoloji ve bilgi paylaşımını, adil bir küresel ticaret sistemini hedefliyor.",
      stat: '$4T',
      statLabel: 'gelişmekte olan ülkelerdeki yıllık SKH yatırım açığı',
    },
  ];

  /* ── 2. State ── */
  const ACTIVE_NODE_OFFSET_Y = -72;
  const ACTIVE_NODE_Z_INDEX = 500;
  const DIMMED_NODE_Z_INDEX = 10;
  const ROTATION_STEP_DEGREES = 0.16;
  const ORBIT_BASE_Z_INDEX = 100;
  const ORBIT_Z_INDEX_DEPTH_FACTOR = 40;

  let rotationAngle = 0;
  let autoRotate = true;
  let animFrameId = null;
  let activeId = null;

  /* ── 3. DOM references ── */
  const canvas = document.getElementById('sdgCanvas');
  const infoCard = document.getElementById('sdgInfoCard');
  const cardInner = document.getElementById('sdgCardInner');
  const orbitRing = canvas ? canvas.querySelector('.sdg-orbit-ring') : null;

  if (!canvas || !infoCard || !cardInner) {
    return;
  }

  /* ── 4. Helpers ── */
  /* The orbit radius is read from the ring's rendered width instead of
     repeating CSS breakpoints here, so the nodes always sit on the ring
     whatever size CSS gives it: CSS is the single source of truth. */
  function getRadius() {
    if (orbitRing) return orbitRing.clientWidth / 2;
    return canvas.clientWidth * 0.42;
  }

  function imgSrc(id) {
    return ikAssetUrl(`image/sdg/e-web-${String(id).padStart(2, '0')}.webp`);
  }

  /* ── 5. Build nodes ── */
  sdgData.forEach((sdg) => {
    const node = document.createElement('div');
    node.className = 'sdg-node';
    node.setAttribute('data-id', sdg.id);
    node.style.setProperty('--sdg-node-color', sdg.color);

    const img = document.createElement('img');
    img.className = 'sdg-node-logo';
    img.src = imgSrc(sdg.id);
    img.alt = `SDG ${sdg.id}: ${sdg.title}`;
    img.setAttribute('draggable', 'false');
    img.setAttribute('loading', 'lazy');
    img.onerror = function () {
      // If the logo fails to load, show the goal number instead.
      this.style.display = 'none';
      const fallback = document.createElement('div');
      fallback.style.cssText = `width:${this.width}px;height:${this.height}px;border-radius:8px;background:${sdg.color};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:0.85rem;font-family:Montserrat,sans-serif`;
      fallback.textContent = sdg.id;
      this.parentNode.appendChild(fallback);
    };

    node.appendChild(img);

    node.addEventListener('click', (e) => {
      e.stopPropagation();
      handleNodeClick(sdg.id);
    });

    canvas.appendChild(node);
  });

  const nodes = canvas.querySelectorAll('.sdg-node');

  /* ── 6. Animation loop ── */
  function updatePositions() {
    const total = sdgData.length;
    const radius = getRadius();

    nodes.forEach((node, index) => {
      if (node.classList.contains('sdg-is-active')) {
        node.style.transform = `translate3d(0px,${ACTIVE_NODE_OFFSET_Y}px,0)`;
        node.style.opacity = '1';
        node.style.zIndex = ACTIVE_NODE_Z_INDEX;
        return;
      }
      if (node.classList.contains('sdg-dimmed')) {
        // opacity set by class
        return;
      }

      const angle = ((index / total) * 360 + rotationAngle) % 360;
      const rad = (angle * Math.PI) / 180;
      const x = radius * Math.cos(rad);
      const y = radius * Math.sin(rad);
      const depth = Math.cos(rad);
      const zIndex = Math.round(ORBIT_BASE_Z_INDEX + ORBIT_Z_INDEX_DEPTH_FACTOR * depth);

      node.style.transform = `translate3d(${x}px,${y}px,0)`;
      node.style.zIndex = zIndex;
      node.style.opacity = '1';
    });

    if (autoRotate) {
      rotationAngle = (rotationAngle + ROTATION_STEP_DEGREES) % 360;
      animFrameId = requestAnimationFrame(updatePositions);
    }
  }

  /* ── 7. Click handling ── */
  function handleNodeClick(id) {
    if (activeId === id) {
      resetState();
      return;
    }

    autoRotate = false;
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
    activeId = id;

    // Dim every node and bring the active one forward.
    nodes.forEach((n) => {
      n.classList.remove('sdg-is-active');
      n.classList.add('sdg-dimmed');
      n.style.opacity = '';
      n.style.zIndex = DIMMED_NODE_Z_INDEX;
    });

    const activeNode = canvas.querySelector(`.sdg-node[data-id="${id}"]`);
    if (activeNode) {
      activeNode.classList.remove('sdg-dimmed');
      activeNode.classList.add('sdg-is-active');
      activeNode.style.transform = `translate3d(0px,${ACTIVE_NODE_OFFSET_Y}px,0)`;
      activeNode.style.opacity = '1';
      activeNode.style.zIndex = ACTIVE_NODE_Z_INDEX;
    }

    showInfoCard(id);
  }

  /* ── 8. Info card ── */
  function showInfoCard(id) {
    const sdg = sdgData.find((s) => s.id === id);
    if (!sdg) return;

    cardInner.style.setProperty('--sdg-color', sdg.color);

    const logo = ikEl('img', { className: 'sdg-card-logo', attrs: { src: imgSrc(sdg.id), alt: `SDG ${sdg.id}` } });
    // A missing logo should not leave a broken-image icon in the card.
    logo.addEventListener('error', () => {
      logo.style.display = 'none';
    });

    cardInner.replaceChildren(
      ikEl('div', { className: 'sdg-card-top' }, [
        logo,
        ikEl('div', { className: 'sdg-card-titles' }, [
          ikEl('h3', { text: sdg.title }),
          ikEl('p', { className: 'sdg-card-subtitle', text: `Sürdürülebilir Kalkınma Hedefi ${sdg.id}` }),
        ]),
      ]),
      ikEl('div', { className: 'sdg-card-block' }, [
        ikEl('span', { className: 'sdg-card-eyebrow', text: 'Şu An Dünyada' }),
        ikEl('p', { className: 'sdg-card-desc', text: sdg.status }),
      ]),
      ikEl('div', { className: 'sdg-card-block' }, [
        ikEl('span', { className: 'sdg-card-eyebrow', text: 'Bu Hedef Ne Amaçlıyor' }),
        ikEl('p', { className: 'sdg-card-desc', text: sdg.aim }),
      ]),
      ikEl('div', { className: 'sdg-card-stat' }, [
        ikEl('div', { className: 'sdg-stat-value', text: sdg.stat }),
        ikEl('div', { className: 'sdg-stat-label', text: sdg.statLabel }),
      ]),
    );

    // Restart the entrance animation.
    infoCard.classList.remove('sdg-card-visible');
    void infoCard.offsetWidth; // Force a reflow so removing and re-adding the class replays the animation.
    infoCard.classList.add('sdg-card-visible');
  }

  /* ── 9. Reset ── */
  function resetState() {
    activeId = null;
    nodes.forEach((n) => {
      n.classList.remove('sdg-is-active', 'sdg-dimmed');
      n.style.opacity = '';
      n.style.zIndex = '';
      n.style.transform = '';
    });
    infoCard.classList.remove('sdg-card-visible');
    autoRotate = true;
    updatePositions();
  }

  /* ── 10. Close button (full-screen card on mobile) ── */
  infoCard.addEventListener('click', (e) => {
    if (e.target.closest('.sdg-card-close')) {
      e.stopPropagation();
      resetState();
    }
  });

  /* ── 11. Outside click resets ── */
  const sectionEl = document.getElementById('sdg-section');
  sectionEl.addEventListener('click', (e) => {
    if (activeId !== null && !e.target.closest('.sdg-node') && !e.target.closest('.sdg-card-panel')) {
      resetState();
    }
  });

  /* ── 12. Resize ── */
  const RESIZE_DEBOUNCE_MS = 200;
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (autoRotate && !animFrameId) {
        updatePositions();
      }
    }, RESIZE_DEBOUNCE_MS);
  });

  /* ── 13. Pause off-screen (performance) ── */
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!animFrameId && autoRotate) {
            updatePositions();
          }
        } else {
          cancelAnimationFrame(animFrameId);
          animFrameId = null;
        }
      });
    },
    { threshold: 0.08 },
  );

  sectionObserver.observe(sectionEl);
})();

/* ── Lenis smooth scrolling ──
   Lenis is driven by GSAP's ticker rather than its own rAF loop, which is
   the official Lenis + ScrollTrigger integration: two independent rAF loops
   drift apart and make the scroll position jitter. */
(function () {
  if (typeof Lenis === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const lenis = new Lenis({
    duration: 1.2,
    smoothWheel: true,
    autoRaf: false,
  });

  // While a dialog or the zoomed chart is open, Lenis would otherwise capture
  // the wheel and scroll the page behind it. It stops on the lock event; the
  // dialogs themselves opt out with data-lenis-prevent and scroll natively.
  document.addEventListener('ik:scroll-lock', (event) => {
    if (event.detail.locked) lenis.stop();
    else lenis.start();
  });

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    });
  }
})();

/* ── Section entrance animations (GSAP) ──
   AOS keeps handling the generic fade-up entrances; GSAP only adds the
   staggered motion of card groups. The two touch different elements, so they
   do not conflict. */
(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero: subtle parallax on the background video.
  if (document.querySelector('.ik-hero-video')) {
    gsap.to('.ik-hero-video', {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: {
        trigger: '.ik-hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  // One-off entrances are triggered by IntersectionObserver instead of
  // ScrollTrigger start/end callbacks: it reacts to actual visibility, so it
  // fires reliably whatever the scroll position or speed.
  const signatureAnimations = [
    {
      sectionId: 'sdg-section',
      play: () => {
        if (!document.getElementById('sdgCanvas')) return;
        gsap.from('#sdgCanvas', { opacity: 0, scale: 0.85, duration: 0.8, ease: 'power2.out' });
      },
    },
    {
      sectionId: 'causes-section',
      play: () => {
        if (!document.querySelector('.cause-tab-content')) return;
        gsap.from('.cause-tab-content', { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' });
      },
    },
    {
      sectionId: 'resources-section',
      play: () => {
        if (!document.querySelector('.resource-card')) return;
        gsap.from('.resource-card', {
          opacity: 0,
          scale: 0.92,
          y: 16,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power2.out',
        });
      },
    },
  ];

  signatureAnimations.forEach((entry) => {
    const section = document.getElementById(entry.sectionId);
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            entry.play();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );

    observer.observe(section);
  });
})();

/* ── Causes charts: hand-built SVG components ──
   The page has no build step or framework, so the donut and line charts are
   plain JS + inline SVG (stroke-dasharray/dashoffset animation, cubic bezier
   interpolation, CSS transitions) instead of a charting library. */
(function () {
  const rendered = {};
  const SVG_NS = 'http://www.w3.org/2000/svg';

  // Colours come from style.css tokens. The previous palette failed
  // colour-blindness and legibility checks. Slices take at most 4 colours in a
  // fixed order.
  const rootStyle = getComputedStyle(document.documentElement);
  const token = (name) => rootStyle.getPropertyValue(name).trim();
  const SERIES_COLORS = [1, 2, 3, 4].map((slot) => token(`--data-series-${slot}`));
  // Rising emissions are bad and growing forest area is good: those curves get
  // status colours, and the change label repeats the meaning with an arrow.
  const TREND_BAD = token('--status-critical');
  const TREND_GOOD = token('--status-good');

  function svgEl(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);
    if (attrs) {
      Object.keys(attrs).forEach((key) => el.setAttribute(key, attrs[key]));
    }
    return el;
  }

  /* ── Donut chart ──
     Each slice is its own <circle>: stroke-dasharray sets the slice length,
     stroke-dashoffset its start and stroke-linecap:round the rounded ends.
     Rotated -90deg so it starts at 12 o'clock. */
  function renderDonut(containerId, labels, values) {
    const container = document.getElementById(containerId);
    if (!container || rendered[containerId]) return;
    rendered[containerId] = true;

    const size = 220;
    const strokeWidth = 26;
    const radius = size / 2 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    const total = values.reduce((sum, v) => sum + v, 0);
    const maxIndex = values.indexOf(Math.max(...values));

    container.classList.add('donut-chart');

    const svg = svgEl('svg', { viewBox: `0 0 ${size} ${size}` });
    svg.classList.add('donut-chart-svg');

    svg.appendChild(
      svgEl('circle', {
        cx: size / 2,
        cy: size / 2,
        r: radius,
        fill: 'none',
        stroke: 'rgba(255,255,255,0.12)',
        'stroke-width': strokeWidth,
      }),
    );

    // The centre shows the largest slice by default and follows the hovered
    // slice (value, colour and label).
    const centerValue = document.createElement('span');
    centerValue.className = 'donut-center-value';
    const centerLabel = document.createElement('span');
    centerLabel.className = 'donut-center-label';

    function showSegment(index) {
      if (total === 0 || index < 0) return;
      const pct = Math.round((values[index] / total) * 100);
      centerValue.textContent = `${pct}%`;
      centerLabel.textContent = labels[index];
    }

    let cumulative = 0;
    const segments = [];

    values.forEach((value, i) => {
      if (!value) return;
      const fraction = total === 0 ? 0 : value / total;
      const dash = fraction * circumference;
      const targetOffset = -(cumulative * circumference);
      const color = SERIES_COLORS[i];

      // fill:"none" rather than "transparent": a transparent fill still counts as
      // painted, so each slice's invisible inner disc would catch the pointer and
      // steal hover from the visible ring of the slice below it.
      const circle = svgEl('circle', {
        cx: size / 2,
        cy: size / 2,
        r: radius,
        fill: 'none',
        stroke: color,
        'stroke-width': strokeWidth,
        'stroke-linecap': 'round',
        'stroke-dasharray': `${dash} ${circumference}`,
        'stroke-dashoffset': circumference,
      });
      circle.classList.add('donut-segment');
      circle.style.setProperty('--segment-color', color);
      // Only the draw-in (stroke-dashoffset) transition is staggered. The other
      // three transitions (hover filter/transform/opacity) must stay at 0s; a
      // single transitionDelay would apply to the whole list and permanently delay
      // the hover glow/scale too.
      circle.style.transitionDelay = `${i * 0.05}s, 0s, 0s, 0s`;
      circle.dataset.targetOffset = targetOffset;

      // Slices are reachable by keyboard; mouse and touch are resolved from the
      // angle on the whole SVG below.
      circle.setAttribute('tabindex', '0');
      circle.setAttribute('role', 'button');
      circle.setAttribute('aria-label', `${labels[i]}: %${Math.round(fraction * 100)}`);
      circle.addEventListener('focus', () => selectSegment(i));

      svg.appendChild(circle);
      segments.push({ circle, index: i, start: cumulative, end: cumulative + fraction });
      cumulative += fraction;
    });

    function selectSegment(index) {
      segments.forEach((s) => {
        s.circle.classList.toggle('is-dimmed', s.index !== index);
        s.circle.classList.toggle('is-active', s.index === index);
      });
      showSegment(index);
    }

    function resetSegments() {
      segments.forEach((s) => s.circle.classList.remove('is-dimmed', 'is-active'));
      showSegment(maxIndex);
    }

    // The slice under the pointer is found from the angle (slices run clockwise
    // from 12 o'clock). Relying on emulated mouse events for touch made some
    // browsers fire an "out" right after the tap and snap back to the largest
    // slice; pointer events plus geometry behave the same everywhere.
    function segmentAt(event) {
      const rect = svg.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      const distance = (Math.hypot(x, y) / (rect.width / 2)) * (size / 2);
      if (distance < radius - strokeWidth || distance > radius + strokeWidth) return -1;
      let angle = Math.atan2(y, x) + Math.PI / 2;
      if (angle < 0) angle += 2 * Math.PI;
      const position = angle / (2 * Math.PI);
      const hit = segments.find((s) => position >= s.start && position < s.end);
      return hit ? hit.index : -1;
    }

    svg.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') return;
      const index = segmentAt(event);
      if (index !== -1) selectSegment(index);
    });
    // With a mouse, leaving the chart returns to the largest slice; on touch the
    // selection stays until the user taps outside the chart.
    svg.addEventListener('pointerleave', (event) => {
      if (event.pointerType === 'mouse') resetSegments();
    });
    svg.addEventListener('pointerdown', (event) => {
      const index = segmentAt(event);
      if (index !== -1) selectSegment(index);
    });
    document.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'mouse' && !container.contains(event.target)) resetSegments();
    });

    container.appendChild(svg);

    if (total > 0) {
      showSegment(maxIndex);
      const center = document.createElement('div');
      center.className = 'donut-center';
      center.appendChild(centerValue);
      center.appendChild(centerLabel);
      container.appendChild(center);
    }

    // Defer to the next frame so the CSS transition runs (a value set in the
    // same frame skips the transition).
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        segments.forEach((s) => {
          s.circle.style.strokeDashoffset = s.circle.dataset.targetOffset;
        });
      }),
    );
  }

  /* ── Smooth bezier line + area chart ──
     Cubic bezier interpolation: control points for each pair of points are
     derived from the previous and next points. */
  function smoothPath(points, closeAtY) {
    if (points.length < 2) return '';
    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[i + 1];
      const cp1x = prev.x + (curr.x - prev.x) * 0.5;
      const cp1y = prev.y;
      const cp2x = curr.x - (next ? (next.x - curr.x) * 0.3 : 0);
      const cp2y = curr.y;
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${curr.x},${curr.y}`;
    }
    if (closeAtY !== undefined) {
      d += ` L ${points[points.length - 1].x},${closeAtY} L ${points[0].x},${closeAtY} Z`;
    }
    return d;
  }

  function renderTrendChart(containerId, labels, values, color) {
    const container = document.getElementById(containerId);
    if (!container || rendered[containerId]) return;
    rendered[containerId] = true;

    const width = 400;
    const height = 220;
    const padding = { top: 14, right: 8, bottom: 26, left: 8 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;
    const maxVal = Math.max(...values) * 1.15;

    const points = values.map((v, i) => ({
      x: padding.left + (i / (values.length - 1)) * chartW,
      y: padding.top + (1 - v / maxVal) * chartH,
    }));

    container.classList.add('trend-chart');

    const gradientId = `trendGradient-${containerId}`;
    const svg = svgEl('svg', { viewBox: `0 0 ${width} ${height}`, preserveAspectRatio: 'none' });
    svg.classList.add('trend-chart-svg');

    const defs = svgEl('defs');
    const gradient = svgEl('linearGradient', { id: gradientId, x1: 0, y1: 0, x2: 0, y2: 1 });
    gradient.appendChild(svgEl('stop', { offset: '0%', 'stop-color': color, 'stop-opacity': 0.4 }));
    gradient.appendChild(svgEl('stop', { offset: '100%', 'stop-color': color, 'stop-opacity': 0 }));
    defs.appendChild(gradient);
    svg.appendChild(defs);

    for (let i = 0; i <= 3; i++) {
      const y = padding.top + (chartH / 3) * i;
      svg.appendChild(
        svgEl('line', {
          x1: padding.left,
          x2: width - padding.right,
          y1: y,
          y2: y,
          stroke: 'rgba(255,255,255,0.08)',
          'stroke-width': 1,
        }),
      );
    }

    const areaPath = svgEl('path', { d: smoothPath(points, height - padding.bottom), fill: `url(#${gradientId})` });
    areaPath.classList.add('trend-area');
    svg.appendChild(areaPath);

    const linePath = svgEl('path', {
      d: smoothPath(points),
      fill: 'none',
      stroke: color,
      'stroke-width': 2.5,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    });
    linePath.classList.add('trend-line');
    svg.appendChild(linePath);

    const tooltip = document.createElement('div');
    tooltip.className = 'trend-tooltip';
    const dots = [];

    function hidePoint() {
      tooltip.classList.remove('is-visible');
      dots.forEach((d) => d.setAttribute('r', 3.5));
    }

    points.forEach((p, i) => {
      const dot = svgEl('circle', {
        cx: p.x,
        cy: p.y,
        r: 3.5,
        fill: color,
        stroke: 'rgba(255,255,255,0.9)',
        'stroke-width': 1.5,
      });
      dot.classList.add('trend-dot');
      dot.style.transitionDelay = `${0.6 + i * 0.06}s`;
      svg.appendChild(dot);
      dots.push(dot);

      // Invisible focusable points for keyboard users; mouse and touch are resolved
      // to the nearest point on the whole SVG below.
      const hit = svgEl('circle', { cx: p.x, cy: p.y, r: 18, fill: 'transparent' });
      hit.classList.add('trend-hit');
      hit.setAttribute('tabindex', '0');
      hit.setAttribute('role', 'button');
      hit.setAttribute('aria-label', `${labels[i]}: ${values[i]}`);
      hit.addEventListener('focus', () => showPoint(i));
      hit.addEventListener('blur', hidePoint);
      svg.appendChild(hit);
    });

    function showPoint(index) {
      hidePoint();
      const p = points[index];
      tooltip.textContent = `${labels[index]}: ${values[index]}`;
      tooltip.style.left = `${(p.x / width) * 100}%`;
      tooltip.style.top = `${(p.y / height) * 100}%`;
      tooltip.classList.add('is-visible');
      dots[index].setAttribute('r', 5.5);
    }

    // Pick the year nearest to the pointer horizontally: points shrink to ~3px on
    // phones, so the user should not have to hit them exactly. Same reason as the
    // donut: emulated mouse events are unreliable on touch.
    function nearestPoint(event) {
      const rect = svg.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * width;
      let nearest = 0;
      points.forEach((p, i) => {
        if (Math.abs(p.x - x) < Math.abs(points[nearest].x - x)) nearest = i;
      });
      return nearest;
    }

    svg.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'mouse') showPoint(nearestPoint(event));
    });
    svg.addEventListener('pointerleave', (event) => {
      if (event.pointerType === 'mouse') hidePoint();
    });
    svg.addEventListener('pointerdown', (event) => showPoint(nearestPoint(event)));
    // On touch the tooltip stays until the user taps outside the chart.
    document.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'mouse' && !container.contains(event.target)) hidePoint();
    });

    labels.forEach((label, i) => {
      // First/last labels are anchored start/end instead of middle; centred, they
      // overflowed the viewBox and got clipped (e.g. "1990" → "990").
      const anchor = i === 0 ? 'start' : i === labels.length - 1 ? 'end' : 'middle';
      const text = svgEl('text', { x: points[i].x, y: height - 8, 'text-anchor': anchor });
      text.classList.add('trend-axis-label');
      text.textContent = label;
      svg.appendChild(text);
    });

    container.appendChild(svg);
    container.appendChild(tooltip);

    // Overall change from the first to the last value, shown under the chart.
    const growthPct = values[0] !== 0 ? Math.round(((values[values.length - 1] - values[0]) / values[0]) * 100) : 0;
    const metrics = document.createElement('div');
    metrics.className = 'trend-metrics';
    const trendIcon = ikEl('span', {
      className: 'trend-metric-icon',
      text: growthPct >= 0 ? '↑' : '↓',
      attrs: { 'aria-hidden': 'true' },
    });
    trendIcon.style.color = color;
    metrics.append(
      ikEl('div', { className: 'trend-metric' }, [
        ikEl('span', { className: 'trend-metric-value' }, [trendIcon, ` ${growthPct > 0 ? '+' : ''}${growthPct}%`]),
        ikEl('span', { className: 'trend-metric-label', text: 'Değişim' }),
      ]),
    );
    container.appendChild(metrics);

    // getTotalLength() is called after the path is in the DOM; some browsers
    // return unreliable lengths for detached SVG paths.
    const length = linePath.getTotalLength();
    linePath.style.strokeDasharray = length;
    linePath.style.strokeDashoffset = length;

    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        linePath.style.strokeDashoffset = '0';
        areaPath.classList.add('is-visible');
        dots.forEach((d) => d.classList.add('is-visible'));
        metrics.classList.add('is-visible');
      }),
    );
  }

  function initCauseEnergyChart() {
    renderDonut('causeEnergyChart', ['Kömür', 'Petrol', 'Doğal Gaz', 'Diğer'], [40, 32, 22, 6]);
  }
  function initCauseDeforestationChart() {
    renderDonut('causeDeforestationChart', ['Tarım açma', 'Hayvancılık', 'Kereste', 'Kentleşme'], [48, 26, 16, 10]);
  }
  function initCauseIndustryChart() {
    renderDonut('causeIndustryChart', ['Çimento', 'Çelik/Metal', 'Kimyasal', 'Diğer'], [27, 25, 19, 29]);
  }
  function initCauseAgricultureChart() {
    renderDonut(
      'causeAgricultureChart',
      ['Hayvancılık CH₄', 'Pirinç tarlaları', 'Gübre N₂O', 'Arazi kullanımı'],
      [31, 20, 30, 19],
    );
  }
  function initCauseTransportChart() {
    // TÜİK 2017 greenhouse gas inventory (ÇŞB Environmental Indicators §10.3):
    // actual share of transport CO₂ by mode.
    renderDonut('causeTransportChart', ['Karayolu', 'Havayolu', 'Denizyolu', 'Demiryolu/Diğer'], [93, 4.5, 1.1, 1.4]);
  }

  function initCauseEnergyTrendChart() {
    // Turkey energy-related GHG emissions, million t CO₂e
    // (TÜİK GHG statistics, ÇŞB Environmental Indicators §4.2, 1990-2018).
    renderTrendChart(
      'causeEnergyTrendChart',
      ['1990', '2000', '2010', '2018'],
      [139.6, 216.1, 287.0, 373.1],
      TREND_BAD,
    );
  }
  function initCauseDeforestationTrendChart() {
    // Turkey total forest area, million ha (Ministry of Agriculture and Forestry,
    // General Directorate of Forestry; ÇŞB Environmental Indicators §9.7, 1973-2018).
    // Unlike the global deforestation trend, Turkey's forest area is growing;
    // the tab's description explains why.
    renderTrendChart(
      'causeDeforestationTrendChart',
      ['1973', '1999', '2010', '2018'],
      [20.2, 20.76, 21.54, 22.62],
      TREND_GOOD,
    );
  }
  function initCauseIndustryTrendChart() {
    // Turkey industrial processes and product use emissions, million t CO₂e
    // (TÜİK, ÇŞB Environmental Indicators §4.2, 1990-2018).
    renderTrendChart('causeIndustryTrendChart', ['1990', '2000', '2010', '2018'], [22.8, 26.2, 48.1, 65.2], TREND_BAD);
  }
  function initCauseAgricultureTrendChart() {
    // Turkey agriculture emissions, million t CO₂e
    // (TÜİK, ÇŞB Environmental Indicators §4.2, 1990-2018).
    renderTrendChart(
      'causeAgricultureTrendChart',
      ['1990', '2000', '2010', '2018'],
      [45.7, 42.3, 44.0, 64.9],
      TREND_BAD,
    );
  }
  function initCauseTransportTrendChart() {
    // Turkey total transport GHG emissions, million t CO₂e
    // (TÜİK, ÇŞB Environmental Indicators §10.3, 1990-2017).
    renderTrendChart('causeTransportTrendChart', ['1990', '2000', '2010', '2017'], [27.0, 36.5, 45.4, 84.7], TREND_BAD);
  }

  const initializers = [
    { sectionId: 'causes-section', fn: initCauseEnergyChart },
    { sectionId: 'causes-section', fn: initCauseEnergyTrendChart },
  ];

  initializers.forEach((entry) => {
    const section = document.getElementById(entry.sectionId);
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            entry.fn();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );

    observer.observe(section);
  });

  // The first tab's charts are drawn by the observer above; the other four
  // tabs are initialised lazily on Bootstrap's "shown.bs.tab" event the first
  // time they open.
  const causeChartInitByTab = {
    'cause-deforestation': [initCauseDeforestationChart, initCauseDeforestationTrendChart],
    'cause-industry': [initCauseIndustryChart, initCauseIndustryTrendChart],
    'cause-agriculture': [initCauseAgricultureChart, initCauseAgricultureTrendChart],
    'cause-transport': [initCauseTransportChart, initCauseTransportTrendChart],
  };

  document.querySelectorAll('#causeTabsNav .cause-tab-btn').forEach((btn) => {
    btn.addEventListener('shown.bs.tab', (e) => {
      const targetId = e.target.getAttribute('data-bs-target').replace('#', '');
      const initFns = causeChartInitByTab[targetId];
      if (initFns) initFns.forEach((fn) => fn());
    });
  });
})();

/* ── Causes heading: coloured sweep when the tab changes ──
   The sweep band passes through colour but the heading always settles on
   white. */
(function () {
  const suffix = document.getElementById('causeHeadingSuffix');
  const suffixText = suffix ? suffix.querySelector('.cause-heading-suffix-text') : null;
  if (!suffix || !suffixText) return;

  const DIP_RESET_MS = 340;
  const HEADING_RESIZE_DEBOUNCE_MS = 150;
  const HEADING_FIT_MOBILE_BREAKPOINT = 769;
  const HEADING_FIT_MIN_SCALE = 0.7;

  function playDipAndSweep() {
    suffixText.classList.remove('dip', 'sweep-in');
    void suffixText.offsetWidth; // Force a reflow so the animations replay.
    suffixText.classList.add('dip', 'sweep-in');
    setTimeout(() => {
      suffixText.classList.remove('dip');
    }, DIP_RESET_MS);
  }

  /* Fit the heading (fixed text + changing tab name) to the full width by
     scaling font-size. Computing one scale from the summed widths was
     unreliable: the .cause-heading-suffix flex item (overflow-x:hidden,
     min-width:0) sometimes renders narrower than its content even when it
     would fit. So the actual overflow is measured (how far the suffix text's
     right edge passes its clipping box) and the size is binary-searched until
     it fits, which holds whatever the cause. */
  const staticEl = document.querySelector('.cause-heading-static');
  const headingEl = document.querySelector('.cause-heading');
  function fitHeadingWidth() {
    if (!headingEl || !staticEl) return;
    if (window.innerWidth < HEADING_FIT_MOBILE_BREAKPOINT) {
      staticEl.style.fontSize = '';
      suffixText.style.fontSize = '';
      return;
    }
    staticEl.style.fontSize = '';
    suffixText.style.fontSize = '';
    const naturalStaticBase = parseFloat(getComputedStyle(staticEl).fontSize);
    const naturalSuffixBase = parseFloat(getComputedStyle(suffixText).fontSize);

    function applyScale(scale) {
      staticEl.style.fontSize = `${naturalStaticBase * scale}px`;
      suffixText.style.fontSize = `${naturalSuffixBase * scale}px`;
    }

    function overflowPx() {
      const textRight = suffixText.getBoundingClientRect().right;
      const wrapRight = suffix.getBoundingClientRect().right;
      return textRight - wrapRight;
    }

    applyScale(1);
    if (overflowPx() <= 0.5) return; // Already fits at its natural size.

    let lo = HEADING_FIT_MIN_SCALE;
    let hi = 1;
    for (let i = 0; i < 14; i++) {
      const mid = (lo + hi) / 2;
      applyScale(mid);
      if (overflowPx() > 0.5) hi = mid;
      else lo = mid;
    }
    applyScale(lo);
  }

  document.querySelectorAll('#causeTabsNav .cause-tab-btn').forEach((btn) => {
    btn.addEventListener('shown.bs.tab', (e) => {
      const name = e.target.getAttribute('data-cause-name');
      if (!name) return;

      // The text swaps instantly; what hides the swap is the simultaneous "dip"
      // effect (opacity/blur/offset).
      suffixText.textContent = name;
      playDipAndSweep();
      requestAnimationFrame(fitHeadingWidth);
    });
  });

  // Play the sweep once on first load as well.
  playDipAndSweep();
  fitHeadingWidth();

  // If the Montserrat web font arrives after the first measurement (FOUT), the
  // width was computed with fallback-font metrics; measure again once fonts
  // are ready.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitHeadingWidth);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fitHeadingWidth, HEADING_RESIZE_DEBOUNCE_MS);
  });

  // The heading inherits the YEAR font axis (--yr, see the YEAR axis block at
  // the top). When the section activates, YEAR changes over a 1.2s transition
  // and the "melting" glyphs change width, so a measurement taken on page load
  // is stale by the time the user scrolls here and the text overflows.
  // Re-measure on transitionend.
  const fullwidthHeading = document.querySelector('.cause-fullwidth-heading');
  if (fullwidthHeading) {
    fullwidthHeading.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'font-variation-settings') fitHeadingWidth();
    });
  }
})();

/* ── Cause examples: fanned card stack ──
   Three example cards fan out under each tab and the clicked card moves to
   the front. Positions are computed relative to the active card
   (i - activeIndex) and written to each card's --offset, so whichever card
   is active always lands in the centre and the others shift around it. */
(function () {
  document.querySelectorAll('.cause-stack').forEach((stack) => {
    const cards = Array.prototype.slice.call(stack.querySelectorAll('.cause-stack-card'));
    const total = cards.length;
    if (!total) return;

    /* Wrap-around: the shortest circular distance between i and activeIndex is
       used as the offset, so the ends of the list connect. */
    function wrappedOffset(i, activeIndex) {
      let diff = i - activeIndex;
      diff = ((diff % total) + total) % total;
      if (diff > total / 2) diff -= total;
      return diff;
    }

    const setActive = (index) => {
      index = ((index % total) + total) % total;
      cards.forEach((card, i) => {
        const offset = wrappedOffset(i, index);
        card.classList.toggle('active', i === index);
        card.style.setProperty('--offset', offset);
        card.dataset.visible = Math.abs(offset) <= 1 ? 'true' : 'false';
      });
    };

    cards.forEach((card, i) => {
      card.addEventListener('click', () => setActive(i));
    });

    setActive(Math.floor(total / 2));
  });
})();

/* ── Data scenes (Global warming / Ocean warming / Forest fires) ──
   The three scenes share one engine. While a scene is on screen, once per
   scroll (rAF-throttled) the step whose text is closest to the reading line
   becomes active and the scene's media updates for that step. The reading
   line is the middle of the area below the menu on wide screens, and the
   middle of the area below the sticky media on mobile, because that is where
   the steps are read. The stripes' reveal speed is defined in its own
   controller (initStripesScene). Charts are plain HTML: ratios computed from
   the data are written as CSS variables, so the 2px gaps and 4px corners stay
   the same at every width. */
(function () {
  const scenes = Array.prototype.slice.call(document.querySelectorAll('.ik-scene[data-scene]'));
  if (!scenes.length) return;

  /* OGM Forestry Statistics 2024, table 2.11 "Forest fires, 1988-2024"
     (published 2025-09-26): https://www.ogm.gov.tr/tr/e-kutuphane/resmi-istatistikler
     (accessed 2026-09-13). Row: [year, number of fires, burned area (ha)]. */
  const FOREST_FIRES = [
    [1988, 1372, 18210],
    [1989, 1633, 13099],
    [1990, 1750, 13742],
    [1991, 1481, 8081],
    [1992, 2117, 12232],
    [1993, 2545, 15393],
    [1994, 3239, 30828],
    [1995, 1770, 7676],
    [1996, 1645, 14922],
    [1997, 1339, 6317],
    [1998, 1932, 6764],
    [1999, 2075, 5804],
    [2000, 2353, 26353],
    [2001, 2631, 7394],
    [2002, 1471, 8514],
    [2003, 2177, 6644],
    [2004, 1762, 4876.2],
    [2005, 1530, 2821],
    [2006, 2227, 7761.6],
    [2007, 2829, 11664.4],
    [2008, 2135, 29749],
    [2009, 1793, 4679],
    [2010, 1861, 3317],
    [2011, 1954, 3612],
    [2012, 2450, 10454],
    [2013, 3755, 11456],
    [2014, 2149, 3117],
    [2015, 2150, 3219],
    [2016, 3188, 9156],
    [2017, 2411, 11993],
    [2018, 2167, 5644],
    [2019, 2688, 11332],
    [2020, 3399, 20971],
    [2021, 2793, 139503],
    [2022, 2160, 12799],
    [2023, 2579, 15520],
    [2024, 3797, 27485],
  ];

  /* Ignition causes from the same table's 2024 row, in the table's column
     order. Colours follow the fixed categorical order; unknown causes carry no
     identity, so they get a neutral grey instead of a categorical colour. */
  const FIRE_CAUSES_2024 = [
    { label: 'Kasıt', count: 127, hectares: 223, color: 'var(--data-series-1)' },
    { label: 'İhmal ve kaza', count: 1860, hectares: 19906, color: 'var(--data-series-2)' },
    { label: 'Doğal', count: 726, hectares: 734, color: 'var(--data-series-3)' },
    { label: 'Bilinmeyen', count: 1084, hectares: 6622, color: 'var(--chart-context)' },
  ];

  // Comparison period for area per fire: the period of the EFFIS figure
  // (3.73 ha) used by the previous version of the page; OGM data gives the
  // same result.
  const PER_FIRE_REFERENCE = [2007, 2016];
  const BASELINE_YEARS = [1951, 1980];

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Must match the wide scene layout condition in style.css.
  const wideLayout = window.matchMedia(
    '(min-width: 992px), (orientation: landscape) and (max-height: 600px) and (min-width: 640px)',
  );

  const formatNumber = (value, decimals = 0) =>
    value.toLocaleString('tr-TR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const formatSigned = (value, decimals) =>
    `${value > 0 ? '+' : value < 0 ? '−' : ''}${formatNumber(Math.abs(value), decimals)}`;
  const formatPercent = (share) => `%${formatNumber(Math.round(share * 100))}`;

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  let headerOffset = 0;

  // Sticky media sits below the fixed site menu. The menu comes from the site
  // layout, so its height is measured; 0 if the menu is not fixed.
  function syncHeaderOffset() {
    const navbar = document.querySelector('.navbar');
    headerOffset =
      navbar && getComputedStyle(navbar).position === 'fixed' ? Math.round(navbar.getBoundingClientRect().bottom) : 0;
    document.documentElement.style.setProperty('--ik-header-offset', `${headerOffset}px`);
  }

  // Tooltips only for mouse and pen: on touch they would flicker open and shut
  // while the finger scrolls. Every value they show is also in the table twin.
  function attachTooltip(host, target, describe) {
    const tip = element('div', 'ik-chart-tooltip');
    tip.hidden = true;
    host.appendChild(tip);

    target.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch') return;
      const content = describe(event);
      if (!content) {
        tip.hidden = true;
        return;
      }
      tip.replaceChildren(element('strong', '', content.title), document.createTextNode(` · ${content.detail}`));
      tip.hidden = false;
      const hostRect = host.getBoundingClientRect();
      const half = tip.offsetWidth / 2;
      const x = Math.min(Math.max(event.clientX - hostRect.left, half), hostRect.width - half);
      tip.style.left = `${x}px`;
      tip.style.top = `${content.top}px`;
    });
    target.addEventListener('pointerleave', () => {
      tip.hidden = true;
    });
  }

  // Each chart's table twin: the numeric form of values read from colour and
  // height. Returned as the dialog panel itself; the "Extra content dialogs"
  // module builds its button and dialog from the data-reveal-* attributes.
  function dataTable({ id, label, title, meta, caption, head, rows }) {
    const panel = element('div', 'ik-reveal-panel');
    panel.id = id;
    panel.dataset.revealLabel = label;
    panel.dataset.revealTitle = title;
    panel.dataset.revealMeta = meta;
    panel.dataset.revealIcon = 'fa-table';

    const scroll = element('div', 'ik-data-scroll');
    scroll.tabIndex = 0;
    scroll.setAttribute('role', 'region');
    scroll.setAttribute('aria-label', caption);

    const table = element('table', 'ik-data-table');
    table.appendChild(element('caption', 'visually-hidden', caption));
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    head.forEach((label) => {
      const cell = element('th', '', label);
      cell.scope = 'col';
      headRow.appendChild(cell);
    });
    thead.appendChild(headRow);

    const tbody = document.createElement('tbody');
    rows.forEach((cells) => {
      const row = document.createElement('tr');
      cells.forEach((value, index) => {
        const cell = element(index === 0 ? 'th' : 'td', '', value);
        if (index === 0) cell.scope = 'row';
        row.appendChild(cell);
      });
      tbody.appendChild(row);
    });

    table.append(thead, tbody);
    scroll.appendChild(table);
    panel.appendChild(scroll);
    return panel;
  }

  /* ── Global warming: stripes revealed year by year ── */
  function initStripesScene(scene, steps) {
    const years = GISTEMP_ANNUAL.length;
    const lastYear = GISTEMP_FIRST_YEAR + years - 1;
    const stripeEdge = (index) => (index / years) * 100;

    const frame = scene.querySelector('.ik-stripes-frame');
    const stripes = scene.querySelector('.ik-stripes');
    const yearOutput = scene.querySelector('.ik-stripes-year');
    const valueOutput = scene.querySelector('.ik-stripes-value-number');

    const fill = element('div', 'ik-stripes-fill');
    fill.style.backgroundImage = anomalyStripes.gradient(GISTEMP_ANNUAL);
    const cover = element('div', 'ik-stripes-cover');
    stripes.append(fill, cover);

    scene.querySelector('.ik-stripes-axis-start').textContent = String(GISTEMP_FIRST_YEAR);
    scene.querySelector('.ik-stripes-axis-end').textContent = String(lastYear);

    const baseline = scene.querySelector('.ik-stripes-baseline');
    const baselineStart = stripeEdge(BASELINE_YEARS[0] - GISTEMP_FIRST_YEAR);
    baseline.style.left = `${baselineStart}%`;
    baseline.style.width = `${stripeEdge(BASELINE_YEARS[1] + 1 - GISTEMP_FIRST_YEAR) - baselineStart}%`;

    const recordValue = Math.max(...GISTEMP_ANNUAL);
    const recordIndex = GISTEMP_ANNUAL.indexOf(recordValue);
    const record = scene.querySelector('.ik-stripes-record');
    record.textContent = `${GISTEMP_FIRST_YEAR + recordIndex}: ${formatSigned(recordValue, 2)} °C`;
    record.style.right = `${100 - stripeEdge(recordIndex + 1)}%`;

    // The legend shows the same 11 steps as the seams; the ends are the series'
    // largest absolute anomaly and the middle step is the baseline mean.
    const legend = scene.querySelector('.ik-scale-legend');
    const ramp = element('span', 'ik-scale-legend-ramp');
    anomalyStripes.scale.forEach((color) => {
      const swatch = element('span');
      swatch.style.background = color;
      ramp.appendChild(swatch);
    });
    const ticks = element('span', 'ik-scale-legend-ticks');
    ticks.append(
      element('span', '', `${formatSigned(-anomalyStripes.bound, 1)} °C`),
      element('span', '', '0'),
      element('span', '', `${formatSigned(anomalyStripes.bound, 1)} °C`),
    );
    legend.append(ramp, ticks);

    let shownYear = null;

    attachTooltip(frame, stripes, (event) => {
      const rect = stripes.getBoundingClientRect();
      const index = Math.min(years - 1, Math.max(0, Math.floor(((event.clientX - rect.left) / rect.width) * years)));
      if (shownYear === null || GISTEMP_FIRST_YEAR + index > shownYear) return null;
      return {
        title: String(GISTEMP_FIRST_YEAR + index),
        detail: `${formatSigned(GISTEMP_ANNUAL[index], 2)} °C`,
        top: stripes.offsetTop,
      };
    });

    scene.querySelector('.ik-reveal').prepend(
      dataTable({
        id: 'global-isinma-tablo',
        label: 'Veri tablosu',
        title: `Yıllık küresel sıcaklık sapması, ${GISTEMP_FIRST_YEAR}-${lastYear}`,
        meta: '1951-1980 ortalamasına göre, °C · NASA GISS GISTEMP v4',
        caption: 'NASA GISTEMP v4: yıllık küresel sıcaklık sapması, 1951-1980 ortalamasına göre (°C)',
        head: ['Yıl', 'Sapma (°C)'],
        rows: GISTEMP_ANNUAL.map((value, index) => [String(GISTEMP_FIRST_YEAR + index), formatSigned(value, 2)]),
      }),
    );

    /* Pacing: when the panel is first fully visible, the stripes run up to
       INTRO_YEAR in a short transition. After that the year maps linearly to
       scroll: INTRO_YEAR where the panel is fully visible, the last year where
       the last step (Turkey temperatures) activates. Positions are re-measured
       every frame so font loading and resizing do not break the range. */
    const INTRO_YEAR = 1939;
    const INTRO_DURATION_MS = 900;
    const body = scene.querySelector('.ik-scene-body');
    const media = scene.querySelector('.ik-scene-media');
    const lastStep = steps.length - 1;
    const recordYear = GISTEMP_FIRST_YEAR + recordIndex;

    let activeStep = 0;
    let introStarted = reducedMotion;
    let introYearsLeft = reducedMotion ? 0 : INTRO_YEAR - GISTEMP_FIRST_YEAR;

    const documentCenter = (step) => {
      const rect = step.getBoundingClientRect();
      return rect.top + window.scrollY + rect.height / 2;
    };
    // Same rule as the engine: a step activates when the midpoint between it
    // and the previous step reaches the reading line.
    const activationScroll = (index) =>
      (documentCenter(steps[index - 1]) + documentCenter(steps[index])) / 2 - stuckReadingLine(media);

    function scrollRange() {
      const start = body.getBoundingClientRect().top + window.scrollY + media.offsetHeight - window.innerHeight;
      return { start, end: Math.max(start + 1, activationScroll(lastStep)) };
    }

    function yearAt(scrollPosition, range) {
      const progress = Math.min(1, Math.max(0, (scrollPosition - range.start) / (range.end - range.start)));
      return Math.round(INTRO_YEAR + (lastYear - INTRO_YEAR) * progress);
    }

    function targetYear(range) {
      if (!reducedMotion) return yearAt(window.scrollY, range);
      // With reduced motion the year does not follow the scroll: each step shows
      // the year at the position where the next step starts, in one go.
      if (activeStep >= lastStep) return lastYear;
      return yearAt(activationScroll(activeStep + 1), range);
    }

    function draw() {
      const range = scrollRange();
      if (!introStarted && window.scrollY >= range.start) {
        introStarted = true;
        playIntro();
      }
      const year = introStarted ? targetYear(range) - introYearsLeft : GISTEMP_FIRST_YEAR;
      if (year !== shownYear) render(year);
      const marks = (steps[activeStep].dataset.marks || '').split(' ');
      frame.classList.toggle('shows-baseline', marks.indexOf('baseline') !== -1);
      // Show the record label only once the record year's stripe is drawn, so it
      // never floats above an undrawn stripe.
      frame.classList.toggle('shows-record', marks.indexOf('record') !== -1 && year >= recordYear);
    }

    function playIntro() {
      const totalYears = INTRO_YEAR - GISTEMP_FIRST_YEAR;
      let startTime = null;
      function tick(now) {
        if (startTime === null) startTime = now;
        const t = Math.min(1, (now - startTime) / INTRO_DURATION_MS);
        introYearsLeft = Math.round(totalYears * Math.pow(1 - t, 3));
        draw();
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    function render(year) {
      shownYear = year;
      const index = year - GISTEMP_FIRST_YEAR;
      cover.style.transform = `scaleX(${1 - (index + 1) / years})`;
      yearOutput.textContent = String(year);
      // The font's YEAR axis spans 1979-2050; earlier years stay un-melted.
      yearOutput.style.fontVariationSettings = `"YEAR" ${Math.min(2050, Math.max(1979, year))}`;
      valueOutput.textContent = `${formatSigned(GISTEMP_ANNUAL[index], 2)} °C`;
    }

    return {
      update(stepIndex) {
        activeStep = stepIndex;
        draw();
      },
    };
  }

  /* ── Ocean warming: cross-fade between NASA photos ── */
  function initPhotoScene(scene, steps) {
    const photos = Array.prototype.slice.call(scene.querySelectorAll('.ik-photo'));
    return {
      update(stepIndex) {
        const active = Number(steps[stepIndex].dataset.photo);
        photos.forEach((photo, index) => photo.classList.toggle('is-active', index === active));
      },
    };
  }

  /* ── Forest fires: burned-area columns, area per fire, causes ── */
  function buildFireColumns(host) {
    const TICK_STEP = 50000;
    const axisMax = Math.ceil(Math.max(...FOREST_FIRES.map((row) => row[2])) / TICK_STEP) * TICK_STEP;
    const years = FOREST_FIRES.map((row) => row[0]);

    const grid = element('div', 'ik-columns-grid');
    for (let tick = 0; tick <= axisMax; tick += TICK_STEP) {
      const line = element('span', 'ik-columns-gridline');
      line.style.bottom = `${(tick / axisMax) * 100}%`;
      if (tick > 0) line.appendChild(element('span', 'ik-columns-tick', formatNumber(tick)));
      grid.appendChild(line);
    }

    const plot = element('div', 'ik-columns-plot');
    const bars = FOREST_FIRES.map((row) => {
      const bar = element('span', 'ik-column');
      bar.style.setProperty('--value', (row[2] / axisMax).toFixed(4));
      plot.appendChild(bar);
      return bar;
    });

    const label = element('span', 'ik-column-label');
    label.hidden = true;
    host.append(grid, plot, label);

    // The axis shows the first and last year plus two decades in between; the
    // other years are in the tooltip and the table.
    const axis = element('div', 'ik-columns-axis');
    axis.setAttribute('aria-hidden', 'true');
    [years[0], 2000, 2010, years[years.length - 1]].forEach((year) => {
      const index = years.indexOf(year);
      if (index === -1) return;
      const tick = element('span', '', String(year));
      tick.style.left = `${((index + 0.5) / years.length) * 100}%`;
      axis.appendChild(tick);
    });
    host.insertAdjacentElement('afterend', axis);

    attachTooltip(host, plot, (event) => {
      const rect = plot.getBoundingClientRect();
      const index = Math.min(
        bars.length - 1,
        Math.max(0, Math.floor(((event.clientX - rect.left) / rect.width) * bars.length)),
      );
      const [year, count, hectares] = FOREST_FIRES[index];
      return {
        title: String(year),
        detail: `${formatNumber(Math.round(hectares))} ha · ${formatNumber(count)} yangın`,
        top: plot.offsetHeight * (1 - hectares / axisMax),
      };
    });

    let highlighted = null;

    function placeLabel() {
      const index = years.indexOf(highlighted);
      if (index === -1) {
        label.hidden = true;
        return;
      }
      const hectares = FOREST_FIRES[index][2];
      label.textContent = `${formatNumber(Math.round(hectares))} ha`;
      label.hidden = false;
      // The label is centred above its column and nudged inward if it would
      // overflow the chart edge.
      const half = label.offsetWidth / 2;
      const center = bars[index].offsetLeft + bars[index].offsetWidth / 2;
      label.style.left = `${Math.min(Math.max(center, half), plot.clientWidth - half)}px`;
      label.style.bottom = `calc(${((hectares / axisMax) * 100).toFixed(2)}% + var(--space-xs) / 2)`;
    }

    return {
      highlight(year) {
        if (year === highlighted) return;
        highlighted = year;
        bars.forEach((bar, index) => bar.classList.toggle('is-highlighted', years[index] === year));
        placeLabel();
      },
      placeLabel,
    };
  }

  function buildPerFireBars(host) {
    const perFire = (rows) => rows.reduce((sum, row) => sum + row[2], 0) / rows.reduce((sum, row) => sum + row[1], 0);
    const reference = FOREST_FIRES.filter((row) => row[0] >= PER_FIRE_REFERENCE[0] && row[0] <= PER_FIRE_REFERENCE[1]);
    const latest = FOREST_FIRES[FOREST_FIRES.length - 1];
    const items = [
      {
        label: `${PER_FIRE_REFERENCE[0]}-${PER_FIRE_REFERENCE[1]} ortalaması`,
        value: perFire(reference),
        highlighted: false,
      },
      { label: String(latest[0]), value: perFire([latest]), highlighted: true },
    ];
    const scaleMax = Math.ceil(Math.max(...items.map((item) => item.value)) / 5) * 5;

    items.forEach((item) => {
      const row = element('div', 'ik-hbar-row');
      const track = element('div', 'ik-hbar-track');
      const bar = element('span', item.highlighted ? 'ik-hbar is-highlighted' : 'ik-hbar');
      bar.style.setProperty('--value', (item.value / scaleMax).toFixed(4));
      track.append(bar, element('span', 'ik-hbar-value', `${formatNumber(item.value, 1)} ha`));
      row.append(element('span', 'ik-hbar-label', item.label), track);
      host.appendChild(row);
    });
  }

  function buildCauseStacks(host) {
    const totals = FIRE_CAUSES_2024.reduce(
      (sum, cause) => ({
        count: sum.count + cause.count,
        hectares: sum.hectares + cause.hectares,
      }),
      { count: 0, hectares: 0 },
    );

    [
      ['count', 'Yangın sayısı'],
      ['hectares', 'Yanan alan'],
    ].forEach(([key, label]) => {
      const row = element('div', 'ik-stack-row');
      const bar = element('div', 'ik-stack-bar');
      FIRE_CAUSES_2024.forEach((cause) => {
        const segment = element('span', 'ik-stack-segment');
        segment.style.flexGrow = (cause[key] / totals[key]).toFixed(4);
        segment.style.background = cause.color;
        bar.appendChild(segment);
      });
      row.append(element('span', 'ik-stack-label', label), bar);
      host.appendChild(row);
    });

    // The legend is a small table that carries identity independent of colour:
    // each cause is listed with its share in both bars, so thin slices are
    // readable too.
    const legend = element('table', 'ik-stack-legend');
    const head = document.createElement('tr');
    ['Neden', 'Sayı', 'Alan'].forEach((text) => head.appendChild(element('th', '', text)));
    const thead = document.createElement('thead');
    thead.appendChild(head);
    const tbody = document.createElement('tbody');
    FIRE_CAUSES_2024.forEach((cause) => {
      const row = document.createElement('tr');
      const name = document.createElement('td');
      const swatch = element('span', 'ik-stack-swatch');
      swatch.style.background = cause.color;
      name.append(swatch, document.createTextNode(cause.label));
      row.append(
        name,
        element('td', '', formatPercent(cause.count / totals.count)),
        element('td', '', formatPercent(cause.hectares / totals.hectares)),
      );
      tbody.appendChild(row);
    });
    legend.append(thead, tbody);
    host.appendChild(legend);
  }

  function initFireScene(scene, steps) {
    const views = Array.prototype.slice.call(scene.querySelectorAll('.ik-fires-view'));
    const columns = buildFireColumns(scene.querySelector('.ik-columns'));
    buildPerFireBars(scene.querySelector('.ik-hbars'));
    buildCauseStacks(scene.querySelector('.ik-stack'));

    scene.querySelector('.ik-reveal').append(
      dataTable({
        id: 'orman-yanginlari-tablo',
        label: 'Veri tablosu',
        title: 'Yıllara göre orman yangınları, 1988-2024',
        meta: 'Yangın sayısı ve yanan alan · OGM Ormancılık İstatistikleri 2024',
        caption: 'OGM: yıllara göre orman yangını sayısı ve yanan alan, 1988-2024',
        head: ['Yıl', 'Yangın sayısı', 'Yanan alan (ha)'],
        rows: FOREST_FIRES.map(([year, count, hectares]) => [
          String(year),
          formatNumber(count),
          formatNumber(hectares, Number.isInteger(hectares) ? 0 : 1),
        ]),
      }),
      dataTable({
        id: 'orman-yanginlari-nedenler',
        label: 'Çıkış nedenleri',
        title: '2024 yılında çıkış nedenlerine göre orman yangınları',
        meta: 'Yangın sayısı ve yanan alan · OGM Ormancılık İstatistikleri 2024',
        caption: 'OGM: 2024 yılında çıkış nedenlerine göre orman yangınları',
        head: ['Neden', 'Yangın sayısı', 'Yanan alan (ha)'],
        rows: FIRE_CAUSES_2024.map((cause) => [cause.label, formatNumber(cause.count), formatNumber(cause.hectares)]),
      }),
    );

    let activeView = null;
    return {
      update(stepIndex) {
        const { view, highlight } = steps[stepIndex].dataset;
        if (view !== activeView) {
          views.forEach((node) => node.classList.toggle('is-active', node.dataset.view === view));
          activeView = view;
        }
        columns.highlight(highlight ? Number(highlight) : null);
      },
      resize: columns.placeLabel,
    };
  }

  /* ── Engine ── */
  const controllers = { stripes: initStripesScene, photos: initPhotoScene, fires: initFireScene };
  const entries = [];

  function apply(entry, index) {
    if (index !== entry.activeIndex) {
      entry.steps.forEach((step, stepIndex) => step.classList.toggle('is-active', stepIndex === index));
      entry.activeIndex = index;
    }
    entry.controller.update(index);
  }

  // Where the reading line sits on screen while the media is sticky. The
  // scroll-position code (stripe pacing) uses it; at those moments the media
  // is already sticky.
  function stuckReadingLine(media) {
    const viewportHeight = window.innerHeight;
    if (wideLayout.matches || !media) return headerOffset + (viewportHeight - headerOffset) / 2;
    const mediaBottom = Math.min(viewportHeight, headerOffset + media.offsetHeight);
    return mediaBottom + (viewportHeight - mediaBottom) / 2;
  }

  function readingLine(entry) {
    const viewportHeight = window.innerHeight;
    if (wideLayout.matches || !entry.media) return stuckReadingLine(entry.media);
    const mediaBottom = Math.min(viewportHeight, Math.max(0, entry.media.getBoundingClientRect().bottom));
    return mediaBottom + (viewportHeight - mediaBottom) / 2;
  }

  // The step whose text is closest to the line is active: once the midpoint
  // between two steps crosses the line, the next one takes over. The previous
  // rule (a step's top edge) kept a chart on a step whose text had already
  // scrolled off the top.
  function activeStepIndex(entry) {
    const line = readingLine(entry);
    const centers = entry.steps.map((step) => {
      const rect = step.getBoundingClientRect();
      return rect.top + rect.height / 2;
    });
    let index = 0;
    for (let i = 1; i < centers.length; i++) {
      if ((centers[i - 1] + centers[i]) / 2 <= line) index = i;
    }
    return index;
  }

  let frameRequested = false;

  function update() {
    frameRequested = false;
    entries.forEach((entry) => {
      if (entry.visible) apply(entry, activeStepIndex(entry));
    });
  }

  function requestUpdate() {
    if (frameRequested) return;
    frameRequested = true;
    requestAnimationFrame(update);
  }

  // On wide layouts the sticky media is vertically centred in the area below
  // the menu; the height differs per scene, so each scene gets its own value.
  function syncMediaTop(entry) {
    const free = window.innerHeight - headerOffset - entry.media.offsetHeight;
    entry.media.style.setProperty('--ik-media-top', `${Math.round(headerOffset + Math.max(0, free / 2))}px`);
  }

  function relayout() {
    syncHeaderOffset();
    entries.forEach((entry) => {
      if (entry.controller.resize) entry.controller.resize();
      syncMediaTop(entry);
    });
    requestUpdate();
  }

  syncHeaderOffset();

  scenes.forEach((scene) => {
    const init = controllers[scene.dataset.scene];
    const steps = Array.prototype.slice.call(scene.querySelectorAll('.ik-scene-step'));
    if (!init || !steps.length) return;
    // .is-ready first: labels cannot be measured until the live charts are visible.
    scene.classList.add('is-ready');
    const entry = {
      scene,
      steps,
      media: scene.querySelector('.ik-scene-media'),
      controller: init(scene, steps),
      visible: false,
      activeIndex: -1,
    };
    entries.push(entry);
    apply(entry, 0);
    syncMediaTop(entry);
  });

  if (!entries.length) return;

  const visibility = new IntersectionObserver((observed) => {
    observed.forEach((item) => {
      const entry = entries.find((candidate) => candidate.scene === item.target);
      if (entry) entry.visible = item.isIntersecting;
    });
    requestUpdate();
  });
  entries.forEach((entry) => visibility.observe(entry.scene));

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', relayout);
  // Label widths change when web fonts load late.
  if (document.fonts) document.fonts.ready.then(relayout);
})();

/* ── Extra content dialogs (table twins, temperature spiral video) ──
   For the panels in each .ik-reveal group, small side-by-side buttons are
   built under the chart and the content opens in a native <dialog>: the page
   does not shift, focus stays in the dialog, Esc closes it and focus returns
   to the button. Must run after the Data scenes module, which adds the table
   panels. Without <dialog> support or JS the panels stay open on the page. */
(function () {
  if (typeof HTMLDialogElement !== 'function') return;

  function icon(className, extraClass) {
    const glyph = document.createElement('i');
    glyph.className = `fa-solid ${className}${extraClass ? ` ${extraClass}` : ''}`;
    glyph.setAttribute('aria-hidden', 'true');
    return glyph;
  }

  function buildDialog(panel) {
    const dialog = document.createElement('dialog');
    dialog.className = 'ik-dialog';
    const titleId = `${panel.id}-title`;
    dialog.setAttribute('aria-labelledby', titleId);

    const header = document.createElement('div');
    header.className = 'ik-dialog-header';
    const heading = document.createElement('div');
    const title = document.createElement('h2');
    title.className = 'ik-dialog-title';
    title.id = titleId;
    title.textContent = panel.dataset.revealTitle || panel.dataset.revealLabel;
    heading.appendChild(title);
    if (panel.dataset.revealMeta) {
      const meta = document.createElement('p');
      meta.className = 'ik-dialog-meta';
      meta.textContent = panel.dataset.revealMeta;
      heading.appendChild(meta);
    }
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'ik-dialog-close';
    close.setAttribute('aria-label', 'Pencereyi kapat');
    close.appendChild(icon('fa-xmark'));
    close.addEventListener('click', () => dialog.close());
    header.append(heading, close);

    const body = document.createElement('div');
    body.className = 'ik-dialog-body';
    const inPageTitle = panel.querySelector('.ik-reveal-title');
    if (inPageTitle) inPageTitle.remove();
    body.appendChild(panel);

    dialog.append(header, body);
    // Lenis leaves wheel/touch events inside this element alone, so the table
    // scrolls natively inside the dialog.
    dialog.setAttribute('data-lenis-prevent', '');
    // Clicking the dimmed backdrop closes the dialog: the click is outside the
    // content only when the event target is the dialog itself.
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', () => {
      setPageScrollLocked(false);
      // Do not keep playing the video in a closed dialog.
      body.querySelectorAll('video').forEach((video) => video.pause());
    });
    document.body.appendChild(dialog);
    return dialog;
  }

  document.querySelectorAll('.ik-reveal').forEach((group) => {
    const panels = Array.prototype.slice.call(group.querySelectorAll(':scope > .ik-reveal-panel'));
    if (!panels.length) return;

    const toggles = document.createElement('div');
    toggles.className = 'ik-reveal-toggles';

    panels.forEach((panel) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'ik-reveal-toggle';
      button.setAttribute('aria-haspopup', 'dialog');
      const label = document.createElement('span');
      label.textContent = panel.dataset.revealLabel;
      button.append(icon(panel.dataset.revealIcon, 'ik-reveal-icon'), label);

      const dialog = buildDialog(panel);
      button.addEventListener('click', () => {
        dialog.showModal();
        setPageScrollLocked(true);
        // The video starts when the dialog opens (allowed because it is muted). If
        // the browser still blocks it, the controls stay visible so the user can
        // press play.
        dialog.querySelectorAll('video').forEach((video) => {
          const attempt = video.play();
          if (attempt)
            attempt.catch(() => {
              video.controls = true;
            });
        });
      });
      toggles.appendChild(button);
    });

    group.appendChild(toggles);
    group.classList.add('is-ready');
  });
})();

/* ── Count-up statistics ──
   The real value stays in the HTML for no-JS browsers and crawlers (same
   text as data-count-to). With JS and without reduced motion, each value
   resets to 0 just before it enters the viewport and counts up over 2s with
   ease-out (one-shot IntersectionObserver, threshold 0.2). Turkish number
   format ("." thousands, "," decimals) via toLocaleString('tr-TR');
   data-count-plus="true" prefixes positive values with "+" and
   data-count-percent="true" adds "%" (negatives already carry their "-"). */
(function () {
  const counters = Array.prototype.slice.call(document.querySelectorAll('[data-count-to]'));
  if (!counters.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // The static value in the HTML is already correct; no reset needed.
    return;
  }

  function formatCount(value, decimals, plus, percent) {
    const sign = value < 0 ? '-' : plus ? '+' : '';
    const abs = Math.abs(value);
    const numStr = abs.toLocaleString('tr-TR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    return sign + (percent ? '%' : '') + numStr;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCount(el, delayMs) {
    const to = parseFloat(el.dataset.countTo);
    const decimals = parseInt(el.dataset.countDecimals || '0', 10);
    const duration = parseInt(el.dataset.countDuration || '2000', 10);
    const plus = el.dataset.countPlus === 'true';
    const percent = el.dataset.countPercent === 'true';

    setTimeout(() => {
      const start = performance.now();
      function frame(now) {
        const t = Math.min(1, (now - start) / duration);
        const value = (to - 0) * easeOutCubic(t);
        el.textContent = formatCount(value, decimals, plus, percent);
        if (t < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }, delayMs);
  }

  // Counters in the same group (e.g. the vital signs strip) start slightly
  // staggered, so they ripple instead of all jumping at once.
  const groups = new Map();
  counters.forEach((el) => {
    const group = el.closest('.vital-signs-strip') || el;
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(el);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        // The real value from the HTML stays on screen until the element enters the
        // viewport and the animation starts (permanently without JS, or for a
        // crawler that does not run JS); it only drops to 0 as the first frame of
        // the count-up.
        el.textContent = '0';
        const group = el.closest('.vital-signs-strip') || el;
        const siblings = groups.get(group) || [el];
        const index = siblings.indexOf(el);
        animateCount(el, Math.max(0, index) * 80);
        observer.unobserve(el);
      });
    },
    { threshold: 0.2 },
  );

  counters.forEach((el) => observer.observe(el));
})();

/* ── AOS fallback ──
   The site's AOS stylesheet hides [data-aos] elements until the site's AOS
   script reveals them. That script comes from an unpinned third-party CDN; if
   it fails to load, the content would stay invisible, so reveal it here. */
window.addEventListener('load', () => {
  if (typeof AOS !== 'undefined') return;
  document.querySelectorAll('[data-aos]').forEach((el) => el.classList.add('aos-animate'));
});

/* ── Hero text rotator ── */
document.addEventListener('DOMContentLoaded', () => {
  const ROTATOR_TRANSITION_MS = 600; // Must match the CSS transition duration.
  const ROTATOR_INTERVAL_MS = 3500;
  const rotatorWords = ['Neler oluyor?', 'Sebebi ne?', 'Neler olacak?', 'Neler yapmalıyız?', 'Neler yapılıyor?'];
  const rotatorElement = document.getElementById('hero-rotator');
  let currentWordIndex = 0;

  function animateRotator() {
    // Exit animation, swap the text while hidden, then replay the entrance.
    rotatorElement.classList.remove('visible');
    rotatorElement.classList.add('exit');

    setTimeout(() => {
      rotatorElement.textContent = rotatorWords[currentWordIndex];

      rotatorElement.classList.remove('exit');

      // Force a reflow so the entrance animation replays.
      void rotatorElement.offsetWidth;

      rotatorElement.classList.add('visible');

      currentWordIndex = (currentWordIndex + 1) % rotatorWords.length;
    }, ROTATOR_TRANSITION_MS);
  }

  if (rotatorElement) {
    animateRotator();
    setInterval(animateRotator, ROTATOR_INTERVAL_MS);
  }
});

/* ── Possible futures: card showcase ──
   The active card widens via flex-basis to show its description while the
   others narrow to slim strips (CSS: .active). A progress bar fills and
   advances to the next card; clicking a card jumps to it. The timer pauses
   on hover and while the section is off-screen; it accumulates elapsed time,
   so resuming never jumps ahead. */
(function () {
  const wrap = document.getElementById('futureCardShowcase');
  const track = document.getElementById('futureCardShowcaseTrack');
  if (!wrap || !track) return;

  const cards = Array.prototype.slice.call(track.querySelectorAll('.card-showcase-card'));
  const count = cards.length;
  if (!count) return;

  const DURATION_MS = 5500;
  let currentIndex = 0;
  let elapsedMs = 0;
  let lastTick = null;
  let hoverPaused = false;
  let viewPaused = true;

  function progressBar(card) {
    return card.querySelector('.card-showcase-progress span');
  }

  function setActive(index, scrollIntoView) {
    currentIndex = ((index % count) + count) % count;
    cards.forEach((card, i) => {
      card.classList.toggle('active', i === currentIndex);
      const bar = progressBar(card);
      if (bar) bar.style.width = '0%';
    });
    elapsedMs = 0;
    if (scrollIntoView !== false) {
      cards[currentIndex].scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
    }
  }

  function tick(now) {
    if (lastTick === null) lastTick = now;
    const delta = now - lastTick;
    lastTick = now;
    if (!hoverPaused && !viewPaused) {
      elapsedMs += delta;
      const bar = progressBar(cards[currentIndex]);
      if (bar) bar.style.width = Math.min(100, (elapsedMs / DURATION_MS) * 100) + '%';
      if (elapsedMs >= DURATION_MS) setActive(currentIndex + 1);
    }
    requestAnimationFrame(tick);
  }

  cards.forEach((card, i) => {
    card.addEventListener('click', () => setActive(i));
  });
  wrap.addEventListener('mouseenter', () => {
    hoverPaused = true;
  });
  wrap.addEventListener('mouseleave', () => {
    hoverPaused = false;
  });

  if (typeof IntersectionObserver !== 'undefined') {
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          viewPaused = !entry.isIntersecting;
        });
      },
      { threshold: 0.2 },
    ).observe(wrap);
  } else {
    viewPaused = false;
  }

  setActive(0, false);
  requestAnimationFrame(tick);
})();

/* ── What is being done: timeline ──
   The fill on the spine shows how far the user has scrolled through
   .timeline. Each milestone gets is-in-view once visible and stays lit; it
   does not turn off when scrolling back (consistent with the page's
   play-once entrance animations). */
(function () {
  const timeline = document.getElementById('progressTimeline');
  const spineFill = document.getElementById('timelineSpineFill');
  if (!timeline || !spineFill) return;

  const items = Array.prototype.slice.call(timeline.querySelectorAll('.timeline-item'));

  function updateSpineFill() {
    // The fill's tip stays in the middle of the screen, so the line moves 1:1
    // with the scroll. The previous formula divided by "height + half the
    // screen" and lagged behind.
    const rect = timeline.getBoundingClientRect();
    const viewportMid = window.innerHeight * 0.5;
    const progress = Math.max(0, Math.min(1, (viewportMid - rect.top) / rect.height));
    // The fill is always full height and only its visible part is revealed, so
    // the colour gradient stays fixed along the spine instead of compressing.
    spineFill.style.setProperty('--spine-progress', progress.toFixed(3));
  }

  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateSpineFill();
        ticking = false;
      });
    },
    { passive: true },
  );

  updateSpineFill();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in-view');
        }
      });
    },
    { threshold: 0.35 },
  );

  items.forEach((item) => observer.observe(item));
})();

/* ── What is being done: card interactions ──
   Clicking a card or its marker pins the description open (works on touch);
   on desktop, hover already shows the same .active look via CSS. The subtle
   3D tilt follows the mouse only on hover-capable devices, rAF-throttled. */
(function () {
  const timeline = document.getElementById('progressTimeline');
  if (!timeline) return;

  const items = Array.prototype.slice.call(timeline.querySelectorAll('.timeline-item'));

  items.forEach((item) => {
    const card = item.querySelector('.timeline-card');
    const marker = item.querySelector('.timeline-marker');
    if (!card || !marker) return;

    function toggle() {
      const active = card.classList.toggle('active');
      marker.classList.toggle('active', active);
    }

    card.addEventListener('click', toggle);
    marker.addEventListener('click', toggle);
  });

  if (window.matchMedia('(hover: hover)').matches) {
    let rafId = null;
    timeline.addEventListener('mousemove', (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const rect = timeline.getBoundingClientRect();
        const mx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const my = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        items.forEach((item, i) => {
          const card = item.querySelector('.timeline-card');
          if (!card) return;
          const isLeftSide = i % 2 === 0;
          card.style.setProperty('--tilt-y', (mx * (isLeftSide ? -3 : 3)).toFixed(2) + 'deg');
          card.style.setProperty('--tilt-x', (my * -3).toFixed(2) + 'deg');
        });
      });
    });
  }
})();

/* ── Step carousel (What we should do) ──
   The middle column is a "reel" of real photos and blurred filler cells;
   the side columns slide the opposite way for a counter-rotation effect.
   On step change the old text exits briefly and the new title rises in
   character by character (staggered). */
(function () {
  const CELL = 130;
  const GAP = 10;
  const STEP = 3 * (CELL + GAP);
  const EXIT_MS = 220;
  const SLIDE_MS = 800;
  const CHAR_STAGGER_MS = 6;

  /* Sources for the figures (accessed 2026-09-15): thermostat, Energy Saving
     Trust; emissions per km by train/car/domestic flight (35 / 170 / 246 g
     CO₂e/km) and per food, Our World in Data (UK DESNZ; Poore & Nemecek 2018);
     dripping tap, US EPA WaterSense; carbon price, High-Level Commission on
     Carbon Prices (2017); EU CBAM definitive period from 1 January 2026;
     urbanisation, UN DESA (2018). */
  const individualSteps = [
    {
      photo: 'image/wikipedia/enerji-tasarrufu.webp',
      title: 'Enerji Tasarrufu',
      desc: 'LED ampuller aynı ışığı eski ampullerden çok daha az elektrikle verir. Kapalı sandığımız ama fişte duran cihazlar da bekleme modunda elektrik çekmeye devam eder. Evde harcanan enerji azaldıkça onu üretmek için yakılan yakıt da azalır.',
      examples: [
        "Çamaşırı 30°C'de ve makine doluyken yıka",
        'Kışın termostatı 1°C düşürmek ısınma faturasını yaklaşık %4-5 azaltır',
        'Kullanmadığın cihazları prizden çek',
      ],
    },
    {
      photo: 'image/wikipedia/ulasim-tercihleri.webp',
      title: 'Ulaşım Tercihleri',
      desc: 'Ulaşım, kişisel karbon ayak izinin en büyük kalemlerinden biri. Trende kilometre başına düşen salım benzinli bir otomobilin yaklaşık beşte biri, iç hat uçuşunun ise yedide biri kadar. Kısa yollarda yürümek ya da bisiklet, uzun yollarda tren ve otobüs seçmek fark yaratır.',
      examples: [
        '3 km altındaki yolları yürüyerek ya da bisikletle git',
        'Şehir içinde otomobil yerine toplu taşımayı dene',
        'Yakın şehirlere uçak yerine tren ya da otobüsle git',
      ],
    },
    {
      photo: 'image/wikipedia/beslenme-aliskanliklari.webp',
      title: 'Beslenme Alışkanlıkları',
      desc: 'Gıda üretimi, dünyadaki sera gazı salımının yaklaşık dörtte birinden sorumlu. En büyük fark tabakta ne olduğundan gelir: 1 kg sığır eti üretmek yaklaşık 60 kg sera gazı çıkarırken 1 kg tavuk 6 kg, 1 kg bezelye ise yalnızca 1 kg çıkarır.',
      examples: [
        'Haftada birkaç öğünde kırmızı et yerine baklagil ya da tavuk seç',
        "Taşımanın payı çoğu gıdada %10'dan az: ne yediğin, nereden geldiğinden daha önemli",
        'Alışverişini planla, artan yemeği değerlendir',
      ],
    },
    {
      photo: 'image/wikipedia/bilincli-tuketim.webp',
      title: 'Bilinçli Tüketim',
      desc: 'Aldığımız her ürünün üretimi enerji ve hammadde harcar. Daha az ama daha uzun ömürlü ürünler almak, eşyaları onarmak ve ikinci el kullanmak hem çöpü hem de üretimden gelen salımı azaltır.',
      examples: [
        'Almadan önce "gerçekten ihtiyacım var mı?" diye sor',
        'Bozulan elektroniği atmadan önce tamir ettirmeyi dene',
        'Tek kullanımlık plastik yerine tekrar kullanılabilir çanta ve şişe kullan',
      ],
    },
    {
      photo: 'image/wikipedia/dogayla-birlikte-yasamak.webp',
      title: 'Doğayla Birlikte Yaşamak',
      desc: 'Ağaçlar ve yeşil alanlar havadaki karbonu tutar, şehirleri serinletir ve canlılara yaşam alanı sağlar. Balkonda bitki yetiştirmek ya da bir ağaçlandırma çalışmasına katılmak küçük görünse de, birçok insan yaptığında etkisi büyür.',
      examples: [
        'Mutfak atıklarını kompost yapıp toprağa geri kazandır',
        'Yerel ağaçlandırma ve temizlik etkinliklerine gönüllü katıl',
        'Damlayan musluğu tamir et: saniyede bir damla, yılda 11.000 litreden fazla su demek',
      ],
    },
    {
      photo: 'image/wikipedia/savunuculuk-ve-farkindalik.webp',
      title: 'Savunuculuk ve Farkındalık',
      desc: 'Tek başına attığımız adımlar önemli, ama en büyük değişim birlikte ses çıkardığımızda olur. Çevrendekilerle konuşmak, belediyenin ve şirketlerin iklim planlarını sormak sistemin değişmesini hızlandırır.',
      examples: [
        'Yaşadığın şehrin bir iklim eylem planı olup olmadığını öğren',
        'Okulunda ya da iş yerinde tasarruf ve geri dönüşüm önerileri sun',
        'Güvenilir bilimsel kaynaklara dayanan içerikleri paylaş',
      ],
    },
  ];

  const societalSteps = [
    {
      photo: 'image/un/UN7436150.webp',
      title: 'Yenilenebilir Enerjiye Geçiş',
      desc: 'Elektriği kömür ve doğal gaz yerine güneşten, rüzgârdan ve sudan üretmek, salımları azaltmanın en etkili yollarından biri. Devletlerin ve şirketlerin yatırımlarını bu kaynaklara yönlendirmesi dönüşümü hızlandırır.',
      examples: [
        'Çatı üstü güneş panellerinin desteklenmesi',
        'Fosil yakıtlara verilen desteklerin kademeli olarak kaldırılması',
        'Güneş ve rüzgâr elektriğini depolayacak bataryalara yatırım yapılması',
      ],
    },
    {
      photo: 'image/wikipedia/karbon-fiyatlandirmasi.webp',
      title: 'Karbon Fiyatlandırması',
      desc: 'Havaya salınan her ton karbona bir fiyat koymak "kirleten öder" demektir. Kirletmek pahalılaştıkça temiz üretim daha cazip hâle gelir.',
      examples: [
        "Uzmanlara göre Paris hedefleri için 2030'a kadar ton başına 50-100 dolarlık bir karbon fiyatı gerekiyor",
        'Toplanan gelir temiz enerjiye ve toplu taşımaya harcanabilir',
        "AB, 2026'dan itibaren çelik, çimento ve alüminyum gibi ürünlerin ithalatında karbon bedeli almaya başladı",
      ],
    },
    {
      photo: 'image/wikipedia/ormanlarin-korunmasi.webp',
      title: 'Ormanların Korunması',
      desc: 'Ormanlar dünyanın en büyük doğal karbon depolarından. Var olan ormanları korumak ve yeni ağaçlar dikmek, havadaki karbonu azaltmanın en doğal yolu.',
      examples: [
        'Orman kesilerek üretilen ürünlerin ticaretinin sınırlanması',
        'Ormanda yaşayan yerel halkların arazi haklarının korunması',
        'Ormanlarını koruyan ülkelere mali destek sağlanması (REDD+)',
      ],
    },
    {
      photo: 'image/wikipedia/uluslararasi-isbirligi.webp',
      title: 'Uluslararası İşbirliği',
      desc: 'İklim krizi sınır tanımaz: bir ülkenin salımı herkesi etkiler. Paris Anlaşması gibi anlaşmalar ülkeleri ortak ve takip edilebilir hedefler etrafında buluşturur.',
      examples: [
        'Ülkelerin salım azaltma hedeflerini (NDC) güçlendirmesi',
        'Gelişmekte olan ülkelere iklim finansmanı sağlanması',
        'Temiz teknolojilerin ülkeler arasında paylaşılması',
      ],
    },
    {
      photo: 'image/wikipedia/sanayi-donusumu.webp',
      title: 'Sanayi Dönüşümü',
      desc: 'Çimento, çelik ve kimya fabrikaları çok yüksek ısıya ihtiyaç duyar ve bu ısıyı elektrikle üretmek her zaman kolay değildir. Yeşil hidrojen ve karbon yakalama gibi teknolojiler bu sektörlerin salımını azaltmanın başlıca yolları.',
      examples: [
        'Kamu ihalelerinde düşük karbonlu çelik ve çimentonun tercih edilmesi',
        'Yeşil hidrojen altyapısına yatırım yapılması',
        'Fabrika salımlarının düzenli olarak ölçülüp denetlenmesi',
      ],
    },
    {
      photo: 'image/wikipedia/surdurulebilir-sehirler.webp',
      title: 'Sürdürülebilir Şehirler',
      desc: "2050'de dünya nüfusunun %68'inin şehirlerde yaşayacağı öngörülüyor. Toplu taşıması güçlü, yürünebilir ve yeşil alanı bol şehirler hem salımı azaltır hem de günlük yaşamı kolaylaştırır.",
      examples: [
        'Okul, market ve parkın kısa yürüme mesafesinde olduğu mahalleler',
        'Eski binaların yalıtılıp enerji verimli hâle getirilmesi',
        'Kent ormanları ve yeşil koridorlar',
      ],
    },
  ];

  function makeCell() {
    const cell = document.createElement('div');
    cell.className = 'reel-cell';
    return cell;
  }

  function buildSideColumn(count) {
    const col = document.createElement('div');
    col.className = 'reel-col';
    const sideCellCount = 4 + 2 * count;
    for (let i = 0; i < sideCellCount; i++) col.appendChild(makeCell());
    return col;
  }

  function buildMiddleColumn(steps) {
    const col = document.createElement('div');
    col.className = 'reel-col';
    for (let i = 0; i < 3; i++) col.appendChild(makeCell());
    steps.forEach((step, i) => {
      const featured = document.createElement('div');
      featured.className = 'reel-featured';
      featured.style.backgroundImage = `url('${ikAssetUrl(step.photo)}')`;
      col.appendChild(featured);
      if (i < steps.length - 1) {
        col.appendChild(makeCell());
        col.appendChild(makeCell());
      }
    });
    for (let i = 0; i < 3; i++) col.appendChild(makeCell());
    return col;
  }

  function appendChars(parent, text, counterRef) {
    text.split(' ').forEach((word, wi, words) => {
      const wordSpan = document.createElement('span');
      wordSpan.style.display = 'inline-block';
      wordSpan.style.whiteSpace = 'nowrap';
      Array.from(word).forEach((ch) => {
        const charSpan = document.createElement('span');
        charSpan.className = 'reel-char';
        charSpan.textContent = ch;
        charSpan.style.animationDelay = `${counterRef.i * CHAR_STAGGER_MS}ms`;
        counterRef.i++;
        wordSpan.appendChild(charSpan);
      });
      parent.appendChild(wordSpan);
      if (wi < words.length - 1) {
        parent.appendChild(document.createTextNode(' '));
        counterRef.i++;
      }
    });
  }

  function renderSlide(step) {
    const slide = document.createElement('div');
    slide.className = 'reel-slide';

    const title = document.createElement('h4');
    title.className = 'reel-title';
    appendChars(title, step.title, { i: 0 });
    slide.appendChild(title);

    const desc = document.createElement('p');
    desc.className = 'reel-desc';
    desc.textContent = step.desc;
    slide.appendChild(desc);

    const list = document.createElement('ul');
    list.className = 'reel-examples';
    step.examples.forEach((ex) => {
      const li = document.createElement('li');
      li.append(ikIcon('fa-solid fa-check-circle'), ` ${ex}`);
      list.appendChild(li);
    });
    slide.appendChild(list);

    return slide;
  }

  function createStepReel(container, steps) {
    if (!container || container.dataset.reelBuilt) return;
    container.dataset.reelBuilt = 'true';

    const count = steps.length;
    let index = 0;
    let animating = false;
    let currentSlide = null;

    container.setAttribute('tabindex', '0');
    container.setAttribute('role', 'region');
    container.setAttribute('aria-roledescription', 'carousel');
    // Two carousels share the page; naming each after its group title keeps the
    // regions distinguishable for screen-reader landmark navigation.
    const groupTitle = container.closest('.steps-group')?.querySelector('.steps-group-title');
    if (groupTitle) {
      groupTitle.id ||= `${container.id}-title`;
      container.setAttribute('aria-labelledby', groupTitle.id);
    }

    const viewport = document.createElement('div');
    viewport.className = 'reel-viewport';
    const columns = document.createElement('div');
    columns.className = 'reel-columns';
    const leftCol = buildSideColumn(count);
    const midCol = buildMiddleColumn(steps);
    const rightCol = buildSideColumn(count);
    columns.appendChild(leftCol);
    columns.appendChild(midCol);
    columns.appendChild(rightCol);
    viewport.appendChild(columns);

    const content = document.createElement('div');
    content.className = 'reel-content';
    const stage = document.createElement('div');
    stage.className = 'reel-stage';
    content.appendChild(stage);

    const nav = document.createElement('div');
    nav.className = 'reel-nav';
    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'reel-nav-btn';
    prevBtn.setAttribute('aria-label', 'Önceki adım');
    prevBtn.append(ikIcon('fa-solid fa-chevron-left'));
    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'reel-nav-btn';
    nextBtn.setAttribute('aria-label', 'Sonraki adım');
    nextBtn.append(ikIcon('fa-solid fa-chevron-right'));
    const counter = document.createElement('span');
    counter.className = 'reel-nav-counter';
    nav.appendChild(prevBtn);
    nav.appendChild(nextBtn);
    nav.appendChild(counter);
    content.appendChild(nav);

    container.appendChild(viewport);
    container.appendChild(content);

    function updateNav() {
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === count - 1;
      counter.textContent = `${index + 1} / ${count}`;
    }

    function updateColumns() {
      const centerIdx = (count - 1) / 2;
      const middleY = (centerIdx - index) * STEP;
      const sideY = -middleY;
      midCol.style.transform = `translateY(${middleY}px)`;
      leftCol.style.transform = `translateY(${sideY}px)`;
      rightCol.style.transform = `translateY(${sideY}px)`;
    }

    function paginate(dir) {
      if (animating) return;
      const next = index + dir;
      if (next < 0 || next >= count) return;
      animating = true;
      index = next;
      updateColumns();
      updateNav();

      if (currentSlide) currentSlide.classList.add('is-exiting');
      setTimeout(() => {
        const newSlide = renderSlide(steps[index]);
        stage.replaceChildren(newSlide);
        currentSlide = newSlide;
      }, EXIT_MS);
      setTimeout(() => {
        animating = false;
      }, SLIDE_MS);
    }

    prevBtn.addEventListener('click', () => paginate(-1));
    nextBtn.addEventListener('click', () => paginate(1));
    container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        paginate(1);
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        paginate(-1);
      }
    });

    // Place the columns without a transition on mount so they start in the
    // right position.
    columns.style.transition = 'none';
    updateColumns();
    updateNav();
    currentSlide = renderSlide(steps[0]);
    stage.appendChild(currentSlide);
    requestAnimationFrame(() => {
      leftCol.style.transition = '';
      midCol.style.transition = '';
      rightCol.style.transition = '';
    });
  }

  // Lazy-initialised like the other components: the reel is not built until it
  // enters the viewport, which avoids DOM cost and makes the first title's
  // character-by-character entrance play when the user actually sees it.
  const reelConfigs = [
    { id: 'individualReel', steps: individualSteps },
    { id: 'societalReel', steps: societalSteps },
  ];

  reelConfigs.forEach(({ id, steps }) => {
    const el = document.getElementById(id);
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            createStepReel(el, steps);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
  });
})();

/* AOS (with the same options) and the back-to-top button are initialised by
   the site's frontend.partials.scripts; they are not initialised again here. */

/* ── Resources: bento grid ──
   Subtle 3D tilt on mouse move (--rx/--ry), staggered entrance on scroll and
   a one-shot animation per card type (counter/timeline/chart). */
(function () {
  const cards = document.querySelectorAll('.bento-card');
  if (!cards.length) return;

  const TILT_MAX_DEG = 6;

  cards.forEach((card) => {
    let tiltFrameId = null;
    let lastEvent = null;
    card.addEventListener('mousemove', (e) => {
      lastEvent = e;
      if (tiltFrameId) return;
      tiltFrameId = requestAnimationFrame(() => {
        tiltFrameId = null;
        const rect = card.getBoundingClientRect();
        const px = (lastEvent.clientX - rect.left) / rect.width - 0.5;
        const py = (lastEvent.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--rx', `${(px * TILT_MAX_DEG * 2).toFixed(2)}deg`);
        card.style.setProperty('--ry', `${(-py * TILT_MAX_DEG * 2).toFixed(2)}deg`);
      });
    });
    card.addEventListener('mouseleave', () => {
      if (tiltFrameId) {
        cancelAnimationFrame(tiltFrameId);
        tiltFrameId = null;
      }
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateCounter(el) {
    // The real value in the HTML stays for no-JS and crawlers; with reduced
    // motion it is left untouched.
    if (prefersReducedMotion) return;
    const end = parseFloat(el.dataset.counterEnd || '0');
    const decimals = parseInt(el.dataset.counterDecimals || '0', 10);
    const DURATION_MS = 1400;
    el.textContent = (0).toFixed(decimals);
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      const eased = 1 - (1 - progress) ** 3;
      el.textContent = (end * eased).toFixed(decimals);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const card = entry.target;
        const index = Array.prototype.indexOf.call(cards, card);
        setTimeout(() => card.classList.add('bento-in-view'), index * 70);

        const counterEl = card.querySelector('.bento-counter-value[data-counter-end]');
        if (counterEl) animateCounter(counterEl);

        const chartFill = card.querySelector('.bento-chart-fill[data-chart-value]');
        if (chartFill) {
          chartFill.style.setProperty('--target-width', `${chartFill.dataset.chartValue}%`);
          requestAnimationFrame(() => chartFill.classList.add('bento-chart-animate'));
        }

        observer.unobserve(card);
      });
    },
    { threshold: 0.25 },
  );

  cards.forEach((card) => observer.observe(card));
})();

/* ── What we should do: dynamic heading ──
   When the section becomes visible, the heading cycles quickly (300ms)
   through five widely spoken languages and stops on Turkish for good. */
(function () {
  const el = document.getElementById('actionsDynamicHeading');
  const section = document.getElementById('actions-section');
  if (!el || !section) return;

  const STEP_MS = 900;
  const TRANSITION_MS = 350;
  const items = [
    { text: 'What Should We Do?', dir: 'ltr' },
    { text: '¿Qué Deberíamos Hacer?', dir: 'ltr' },
    { text: '我们应该做什么？', dir: 'ltr' },
    { text: 'हमें क्या करना चाहिए?', dir: 'ltr' },
    { text: 'ماذا يجب أن نفعل؟', dir: 'rtl' },
    { text: 'Neler Yapmalıyız?', dir: 'ltr' },
  ];

  let index = 0;
  let started = false;

  function render(i) {
    el.textContent = items[i].text;
    el.style.direction = items[i].dir;
  }

  function start() {
    if (started) return;
    started = true;

    render(0);
    el.classList.add('is-entering');

    const interval = setInterval(() => {
      if (index >= items.length - 1) {
        clearInterval(interval);
        return;
      }
      el.classList.remove('is-entering');
      el.classList.add('is-leaving');
      setTimeout(() => {
        index += 1;
        render(index);
        el.classList.remove('is-leaving');
        el.classList.add('is-entering');
      }, TRANSITION_MS);
    }, STEP_MS);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          start();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 },
  );

  observer.observe(section);
})();

/* ── Hero video: never play with reduced motion (the poster stays) ──
   A single play() is not enough: the autoplay policy can reject the first
   call (page not ready or no data yet), and the rejection was swallowed,
   leaving the video frozen on its poster. Three independent retries follow;
   once one succeeds the others are no-ops (play() on a playing video does
   nothing): (1) immediately, (2) on canplay, (3) on the first user
   interaction, after which browsers almost always allow playback. */
(function () {
  const video = document.getElementById('heroVideo');
  if (!video) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  function tryPlay() {
    if (!video.paused) return;
    video.play().catch(() => {});
  }

  tryPlay();
  video.addEventListener('canplay', tryPlay, { once: true });

  const interactionEvents = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
  function onFirstInteraction() {
    tryPlay();
    interactionEvents.forEach((evt) => window.removeEventListener(evt, onFirstInteraction));
  }
  interactionEvents.forEach((evt) => window.addEventListener(evt, onFirstInteraction, { passive: true, once: true }));
})();

/* ── Reading progress bar + section dot menu ── */
(function () {
  const fill = document.getElementById('readingProgressFill');
  const dotLinks = Array.prototype.slice.call(document.querySelectorAll('#sectionDotnav [data-section]'));
  const sections = dotLinks.map((a) => document.getElementById(a.dataset.section)).filter(Boolean);

  let ticking = false;

  function update() {
    ticking = false;
    const doc = document.documentElement;
    const scrollTop = window.scrollY;
    const scrollable = doc.scrollHeight - doc.clientHeight;
    const pct = scrollable > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollable) * 100)) : 0;
    if (fill) fill.style.width = pct.toFixed(1) + '%';

    if (sections.length) {
      const viewportMid = window.innerHeight * 0.5;
      let activeIndex = 0;
      sections.forEach((section, i) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= viewportMid) activeIndex = i;
      });
      dotLinks.forEach((a, i) => {
        const isActive = i === activeIndex;
        a.classList.toggle('is-active', isActive);
        // The visual stretch is not announced; the current section is exposed
        // separately.
        if (isActive) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }
  }

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true },
  );

  update();
})();

/* ── Single page: no click changes the address bar ──
   The page should have one stable, shareable URL. In-page href="#id" links
   (dot menu, skip link) are intercepted and scrolled by JS (via Lenis when
   present, otherwise native smooth scroll) instead of the native jump that
   appends #id. The one real benefit of the native jump, moving focus to the
   target (important for keyboard and screen-reader users, especially with
   the skip link), is preserved manually. */
(function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function scrollToTarget(target) {
    if (window.lenis && typeof window.lenis.scrollTo === 'function') {
      window.lenis.scrollTo(target, { immediate: reducedMotion });
    } else {
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    }

    // Temporary tabindex for targets that are not focusable (section, main),
    // mimicking the focus move of a native "#id" jump.
    const addedTabindex = !target.hasAttribute('tabindex');
    if (addedTabindex) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    if (addedTabindex) {
      target.addEventListener('blur', function onBlur() {
        target.removeAttribute('tabindex');
        target.removeEventListener('blur', onBlur);
      });
    }
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    const id = link.getAttribute('href').slice(1);
    if (!id) return; // href="#" (e.g. the navbar dropdown toggle): leave alone.
    const target = document.getElementById(id);
    if (!target) return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToTarget(target);
    });
  });
})();

/* ── SDG spinning Earth video: with reduced motion never play; keep the first frame ── */
(function () {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const earth = document.querySelector('.sdg-center-gif');
  if (earth) earth.pause();
})();

/* ── Causes tabs: arrow-key navigation per the ARIA Authoring Practices ──
   Bootstrap's Tab component already handles click/Enter; this only moves
   focus and selection with Left/Right/Home/End. */
(function () {
  const tablist = document.getElementById('causeTabsNav');
  if (!tablist) return;
  const tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
  if (!tabs.length) return;

  tablist.addEventListener('keydown', (e) => {
    const currentIndex = tabs.indexOf(document.activeElement);
    if (currentIndex === -1) return;
    let nextIndex = null;
    if (e.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') nextIndex = 0;
    else if (e.key === 'End') nextIndex = tabs.length - 1;
    if (nextIndex === null) return;
    e.preventDefault();
    const nextTab = tabs[nextIndex];
    nextTab.focus();
    // Use Bootstrap's own Tab API to switch the panel.
    if (window.bootstrap && window.bootstrap.Tab) {
      window.bootstrap.Tab.getOrCreateInstance(nextTab).show();
    } else {
      nextTab.click();
    }
  });

  // On narrow screens the tab bar scrolls horizontally; centre the selected
  // tab so it is not cut off. scrollIntoView would also move the page
  // vertically, so only the bar's own horizontal scroll is used.
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revealTab(tab) {
    const listRect = tablist.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    const offset = tabRect.left - listRect.left - (listRect.width - tabRect.width) / 2;
    tablist.scrollTo({
      left: Math.max(0, tablist.scrollLeft + offset),
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('shown.bs.tab', () => revealTab(tab));
  });
})();

/* ── Image credits ──
   CC BY and CC BY-SA require naming the author and the licence; the general
   source link in the bibliography does not satisfy that. Credits hang off a
   small button on each image: making the photo itself clickable would break
   the cause cards, where a click already switches cards. The button sits in
   the same corner on every image, so it is discoverable and works on touch. */
(function () {
  const CREDITS = {
    'image/wikipedia/garzweiler-acik-maden-ocagi.webp': {
      title: 'Garzweiler Açık Maden Ocağı',
      author: 'Martin Falbisoner',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Garzweiler_surface_mine%2C_October_2018%2C_-02.jpg',
    },
    'image/wikipedia/komur-termik-santrali.webp': {
      title: 'Çin Termik Santralleri / CO₂ göstergesi',
      author: 'Tobixen',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:ChineseCoalPower_opt.jpg',
    },
    'image/wikipedia/nijer-deltasi.webp': {
      title: 'Nijer Deltası',
      author: 'Luka Tomac / Friends of the Earth International',
      license: 'CC BY-SA 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Kegbara-_dere_community_oil_spill%2C_Ogoniland%2C_Nigeria_(22707273700).jpg',
    },
    'image/wikipedia/avustralya-lng-tesisleri.webp': {
      title: 'Avustralya LNG Tesisleri',
      author: 'Ken Hodge',
      license: 'CC BY 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/2.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:LNG_Carrier_Excel_at_Wickham_Point_in_April_2016_(25732343124).jpg',
    },
    'image/wikipedia/hindistan-komur-madenleri.webp': {
      title: 'Hindistan Kömür Madenleri',
      author: 'Rosehubwiki, Kuber Patel',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:NCL_Singrauli_Nigahi_Coal_Mine_at_Night.jpg',
    },
    'image/wikipedia/bati-teksas-permian-havzasi.webp': {
      title: 'Batı Teksas Permian Havzası',
      author: 'Emmanuel Roquette',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:PermianBasin-02.png',
    },
    'image/wikipedia/amazon-yagmur-ormanlari.webp': {
      title: 'Amazon Yağmur Ormanları',
      author: 'NASA (Jesse Allen, Robert Simmon)',
      license: 'Public domain',
      licenseUrl: 'https://commons.wikimedia.org/wiki/Commons:Licensing',
      source: 'Wikimedia Commons',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Fires_and_Deforestation_on_the_Amazon_Frontier%2C_Rondonia%2C_Brazil_-_August_12%2C_2007.jpg',
    },
    'image/wikipedia/borneo-adasi.webp': {
      title: 'Borneo Adası',
      author: 'T. R. Shankar Raman',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:OilPalm_DSC_9183.JPG',
    },
    'image/wikipedia/kongo-havzasi.webp': {
      title: 'Kongo Havzası',
      author: 'Photokadaffi',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Dans_la_for%C3%AAt_d'Eseka.jpg",
    },
    'image/wikipedia/endonezya-turbaliklari.webp': {
      title: 'Endonezya Turbalıkları',
      author: 'Muhammad Pasya Ramadhan',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Peatland_Forest_fires.jpg',
    },
    'image/wikipedia/cerrado-savanalari-brezilya.webp': {
      title: 'Cerrado Savanaları',
      author: 'Rafael Ribeiro',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Pasto_do_Cerrado_Mineiro_ao_p%C3%B4r_do_sol.jpg',
    },
    'image/wikipedia/ruhr-bolgesi-celik-tesisleri.webp': {
      title: 'Ruhr Bölgesi Çelik Tesisleri',
      author: 'Andreas Schiblon',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Hochofen-8---DU-Hubertusstrasse.jpg',
    },
    'image/wikipedia/cin-aluminyum-tesisleri.webp': {
      title: 'Çin Alüminyum Tesisleri',
      author: 'Bilinmeyen fotoğrafçı',
      license: 'CC BY 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/3.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Aluminium-4.jpg',
    },
    'image/wikipedia/hindistan-tugla-ocaklari.webp': {
      title: 'Hindistan Tuğla Ocakları',
      author: 'McKay Savage',
      license: 'CC BY 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/2.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:India_-_Sights_%26_Culture_-_Rural_Brick_Making_Kiln_03_(4040765932).jpg',
    },
    'image/wikipedia/brezilya-sigir-ciftlikleri.webp': {
      title: 'Brezilya Sığır Çiftlikleri',
      author: 'Christopher Borges',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Tocando_a_Boiada.jpg',
    },
    'image/wikipedia/guneydogu-asya-pirinc-tarlalari.webp': {
      title: 'Güneydoğu Asya Pirinç Tarlaları',
      author: 'Quangpraha',
      license: 'CC0',
      licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Terraced_paddy_fields%2C_Sonla%2C_Vietnam.jpg',
    },
    'image/wikipedia/avrupa-yogun-tarim-alanlari.webp': {
      title: 'Avrupa Yoğun Tarım Alanları',
      author: 'Axel Hartmann',
      license: 'CC BY-SA 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Agricultural_landscape_Mergelland.jpg',
    },
    'image/wikipedia/meksika-avokado-bahceleri.webp': {
      title: 'Meksika Avokado Bahçeleri',
      author: 'El Comandante',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Municipios_michoacanos_productores_de_aguacate_en_2004.svg',
    },
    'image/wikipedia/abd-buyuk-ovalarda-mono-kultur.webp': {
      title: 'ABD Büyük Ovalarda Mono-Kültür',
      author: 'formulanone',
      license: 'CC BY-SA 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Concentric_Circle_Farmland_(50902375916).jpg',
    },
    'image/wikipedia/hollanda-yogun-hayvancilik-tesisleri.webp': {
      title: 'Hollanda Yoğun Hayvancılık Tesisleri',
      author: 'Agnes Monkelbaan',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Melkveebedrijf_kattewaardweg_Kampen_02-03-2021_(actm.)_01.jpg',
    },
    'image/wikipedia/los-angeles-otoyol-agi.webp': {
      title: 'Los Angeles Otoyol Ağı',
      author: 'Bilinmiyor',
      license: 'Public domain',
      licenseUrl: 'https://commons.wikimedia.org/wiki/Commons:Licensing',
      source: 'Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Los_Angeles_Freeway_Interchange.jpg',
    },
    'image/wikipedia/kuresel-konteyner-gemiciligi.webp': {
      title: 'Küresel Konteyner Gemiciliği',
      author: 'Martin Dörsch',
      license: 'CC0',
      licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Container_ship_in_Koper_2013.jpg',
    },
    'image/wikipedia/atlantik-hava-trafigi.webp': {
      title: 'Atlantik Hava Trafiği',
      author: 'AlixSaz',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Contrails_in_the_sky_at_sunset.jpg',
    },
    'image/wikipedia/dubai-havalimani.webp': {
      title: 'Dubai Havalimanı',
      author: 'Andy Mabbett',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Dubai_International_Airport_-_2024-10-24_-_Andy_Mabbett_-_51.jpg',
    },
    'image/wikipedia/suveys-panama-kanali.webp': {
      title: 'Süveyş ve Panama Kanalı',
      author: 'NASA',
      license: 'Public domain',
      licenseUrl: 'https://commons.wikimedia.org/wiki/Commons:Licensing',
      source: 'Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Suez_Canal%2C_Port_Said_-_ISS.jpg',
    },
    'image/pexels/endonezya-iki-tekerlekli-tasit.webp': {
      title: 'Endonezya İki Tekerlekli Taşıt Sorunu',
      author: 'Ary Wibowo',
      license: 'Pexels License',
      licenseUrl: 'https://www.pexels.com/license/',
      source: 'Pexels',
      sourceUrl: 'https://www.pexels.com/photo/30865547/',
    },
    'image/wikipedia/enerji-tasarrufu.webp': {
      title: 'Enerji Tasarrufu',
      author: 'NIST',
      license: 'Public domain',
      licenseUrl: 'https://commons.wikimedia.org/wiki/Commons:Licensing',
      source: 'Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Assorted_LED_Lamps.jpg',
    },
    'image/wikipedia/ulasim-tercihleri.webp': {
      title: 'Ulaşım Tercihleri',
      author: 'Tony Webster',
      license: 'CC BY 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/2.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Holmens_Kanal_Cyclists_(15325678721).jpg',
    },
    'image/wikipedia/beslenme-aliskanliklari.webp': {
      title: 'Beslenme Alışkanlıkları',
      author: 'Rexness',
      license: 'CC BY-SA 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:InSeason_Farmer's_Market%2C_North_Melbourne_Australia_(4570521176).jpg",
    },
    'image/wikipedia/bilincli-tuketim.webp': {
      title: 'Bilinçli Tüketim',
      author: 'Tiia Monto',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Second_hand_clothes.jpg',
    },
    'image/wikipedia/dogayla-birlikte-yasamak.webp': {
      title: 'Doğayla Birlikte Yaşamak',
      author: 'Dietmar Rabich',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Vancouver_(BC%2C_Canada)%2C_Comox_Street%2C_Urban_gardening_--_2022_--_1938.jpg',
    },
    'image/wikipedia/savunuculuk-ve-farkindalik.webp': {
      title: 'Savunuculuk ve Farkındalık',
      author: 'Leonhard Lenz',
      license: 'CC0',
      licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:3rd_Global_Climate_Strike_Berlin_FridaysForFuture_demonstration_view_from_stage_50.jpg',
    },
    'image/wikipedia/karbon-fiyatlandirmasi.webp': {
      title: 'Karbon Fiyatlandırması',
      author: 'World Bank Staff and contributors',
      license: 'CC BY 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/3.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Carbon_taxes_and_emission_trading_worldwide.svg',
    },
    'image/wikipedia/ormanlarin-korunmasi.webp': {
      title: 'Ormanların Korunması',
      author: 'Michael hunter',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Reforestation_Near_Kings_Forest_Hamilton_Ontario.JPG',
    },
    'image/wikipedia/uluslararasi-isbirligi.webp': {
      title: 'Uluslararası İşbirliği',
      author: 'Press Information Department',
      license: 'Public domain',
      licenseUrl: 'https://commons.wikimedia.org/wiki/Commons:Licensing',
      source: 'Wikimedia Commons',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:COP_22_High_Level_Segment_Opening_Session_Prime_Minister_Sheikh_Hasina_Marrakech_Morocco_2016-11-15.jpg',
    },
    'image/wikipedia/sanayi-donusumu.webp': {
      title: 'Sanayi Dönüşümü',
      author: 'T. Allom (illüstrasyon), J. Tingle (gravür)',
      license: 'Public domain',
      licenseUrl: 'https://commons.wikimedia.org/wiki/Commons:Licensing',
      source: 'Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Powerloom_weaving_in_1835.jpg',
    },
    'image/wikipedia/surdurulebilir-sehirler.webp': {
      title: 'Sürdürülebilir Şehirler',
      author: 'USDA',
      license: 'Public domain',
      licenseUrl: 'https://commons.wikimedia.org/wiki/Commons:Licensing',
      source: 'Wikimedia Commons',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:New_York_City_High_Line_-_Urban_Forestry_-_20150915-OSEC-LSC-0161_(20974909154).jpg',
    },
    'image/wikipedia/paris-anlasmasi.webp': {
      title: 'Paris Anlaşması',
      author: 'Presidencia de la República Mexicana',
      license: 'CC BY 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/2.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:COP21_participants_-_30_Nov_2015_(23430273715).jpg',
    },
    'image/wikipedia/cin-gunes-enerjisi.webp': {
      title: "Çin'in Güneş Enerjisi Atılımı",
      author: 'NASA Earth Observatory',
      license: 'Public domain',
      licenseUrl: 'https://commons.wikimedia.org/wiki/Commons:Licensing',
      source: 'Wikimedia Commons',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Building_a_Great_Solar_Wall_in_China_(153759_-_2_20241208_lrg).jpg',
    },
    'image/wikipedia/norvec-elektrikli-arac.webp': {
      title: "Norveç'te Elektrikli Araç Devrimi",
      author: 'Wolfmann',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Electric_vehicle_charging_station_Ladestasjon_for_elbil_Nissan_VW_e-golf_Storgaten_T%C3%B8nsberg_kommune_Norway_2017-09-20_04.jpg',
    },
    'image/wikipedia/avrupa-yesil-mutabakati.webp': {
      title: 'Avrupa Yeşil Mutabakatı',
      author: 'almathias',
      license: 'CC0',
      licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Berlaymont_building_in_Brussels.jpg',
    },
    'image/wikipedia/batarya-teknolojisi.webp': {
      title: 'Bataryada Atılım',
      author: 'RudolfSimon',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Lithium-Ion_Battery_for_BMW_i3_-_SB-LiMotive_Cells.JPG',
    },
    'image/wikipedia/karbon-yakalama-teknolojisi.webp': {
      title: "Climeworks'ün Karbon Yakalama Tesisi",
      author: 'TRx340',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.tr',
      source: 'Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Climeworks-Anlage.jpg',
    },
    'image/un/UN7262680.webp': {
      title: 'Grönland buz tabakası',
      author: 'UN Photo',
      license: 'BM Fotoğraf Arşivi kullanım şartları',
      licenseUrl: 'https://media.un.org/photo/en/terms-and-conditions',
      source: 'BM Fotoğraf Arşivi',
      sourceUrl: 'https://media.un.org/photo/en',
    },
    'image/un/UN7319884.webp': {
      title: 'Doğu Afrika Miombo Ormanları',
      author: 'UN Photo',
      license: 'BM Fotoğraf Arşivi kullanım şartları',
      licenseUrl: 'https://media.un.org/photo/en/terms-and-conditions',
      source: 'BM Fotoğraf Arşivi',
      sourceUrl: 'https://media.un.org/photo/en',
    },
    'image/un/UN7417696.webp': {
      title: 'Teksas Körfez Kıyısı',
      author: 'UN Photo',
      license: 'BM Fotoğraf Arşivi kullanım şartları',
      licenseUrl: 'https://media.un.org/photo/en/terms-and-conditions',
      source: 'BM Fotoğraf Arşivi',
      sourceUrl: 'https://media.un.org/photo/en',
    },
    'image/un/UN7417711.webp': {
      title: 'Macaristan PVC ve Plastik Sektörü',
      author: 'UN Photo',
      license: 'BM Fotoğraf Arşivi kullanım şartları',
      licenseUrl: 'https://media.un.org/photo/en/terms-and-conditions',
      source: 'BM Fotoğraf Arşivi',
      sourceUrl: 'https://media.un.org/photo/en',
    },
    'image/un/UN7436150.webp': {
      title: 'Yenilenebilir Enerjiye Geçiş',
      author: 'UN Photo',
      license: 'BM Fotoğraf Arşivi kullanım şartları',
      licenseUrl: 'https://media.un.org/photo/en/terms-and-conditions',
      source: 'BM Fotoğraf Arşivi',
      sourceUrl: 'https://media.un.org/photo/en',
    },
    'image/un/UN7771324.webp': {
      title: 'Çimento Fabrikaları',
      author: 'UN Photo',
      license: 'BM Fotoğraf Arşivi kullanım şartları',
      licenseUrl: 'https://media.un.org/photo/en/terms-and-conditions',
      source: 'BM Fotoğraf Arşivi',
      sourceUrl: 'https://media.un.org/photo/en',
    },
  };

  const POPOVER_CLASS = 'media-credit-popover';
  let openPopover = null;

  function closePopover() {
    if (!openPopover) return;
    openPopover.button.setAttribute('aria-expanded', 'false');
    openPopover.node.remove();
    document.body.classList.remove('media-credit-open');
    openPopover = null;
  }

  function buildPopover(credit) {
    const box = document.createElement('div');
    box.className = POPOVER_CLASS;
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Görsel künyesi');

    const title = document.createElement('strong');
    title.className = 'media-credit-title';
    title.textContent = credit.title;
    box.appendChild(title);

    const rows = [
      ['Fotoğraf', credit.author, null],
      ['Lisans', credit.license, credit.licenseUrl],
      ['Kaynak', credit.source, credit.sourceUrl],
    ];
    rows.forEach(([label, value, href]) => {
      const row = document.createElement('p');
      row.className = 'media-credit-row';
      const key = document.createElement('span');
      key.className = 'media-credit-key';
      key.textContent = label;
      row.appendChild(key);
      if (href) {
        const link = document.createElement('a');
        link.href = href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = value;
        row.appendChild(link);
      } else {
        const span = document.createElement('span');
        span.textContent = value;
        row.appendChild(span);
      }
      box.appendChild(row);
    });

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'media-credit-close';
    close.setAttribute('aria-label', 'Künyeyi kapat');
    close.append(ikIcon('fa-solid fa-xmark'));
    close.addEventListener('click', (e) => {
      e.stopPropagation();
      closePopover();
    });
    box.appendChild(close);

    return box;
  }

  /* The popover is appended to <body>: inside the reel thumbnails and the
     strip cards (overflow:hidden) it was clipped. Its position is computed
     from the badge's on-screen position each time. */
  function placePopover(button, node) {
    const badge = button.getBoundingClientRect();
    const box = node.getBoundingClientRect();
    const margin = 12;

    let left = badge.right - box.width;
    left = Math.max(margin, Math.min(left, window.innerWidth - box.width - margin));

    let top = badge.top - box.height - 8;
    if (top < margin) top = badge.bottom + 8;

    node.style.left = `${Math.round(left)}px`;
    node.style.top = `${Math.round(top)}px`;
  }

  function togglePopover(button, credit) {
    const wasOpen = openPopover && openPopover.button === button;
    closePopover();
    if (wasOpen) return;
    const node = buildPopover(credit);
    document.body.appendChild(node);
    placePopover(button, node);
    button.setAttribute('aria-expanded', 'true');
    // The credit cannot be read while the ticker strip moves; pause it while open.
    document.body.classList.add('media-credit-open');
    openPopover = { button, node };
  }

  function makeBadge(credit) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'media-credit-badge';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', credit.title + ' — görsel künyesi');
    button.append(ikIcon('fa-solid fa-info'));
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      togglePopover(button, credit);
    });
    return button;
  }

  function creditFor(text) {
    if (!text) return null;
    const match = Object.keys(CREDITS).find((path) => text.indexOf(path) !== -1);
    return match ? CREDITS[match] : null;
  }

  function attach(host, credit) {
    if (!host || host.querySelector(':scope > .media-credit-badge')) return;
    if (host.closest('[aria-hidden="true"]')) return;
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    host.appendChild(makeBadge(credit));
  }

  function scan(root) {
    (root || document).querySelectorAll('.cause-stack-card').forEach((card) => {
      const credit = creditFor(card.getAttribute('style'));
      if (credit) attach(card, credit);
    });

    (root || document).querySelectorAll('.vital-sign-card-bg').forEach((bg) => {
      const credit = creditFor(bg.getAttribute('style'));
      if (credit) attach(bg.parentNode, credit);
    });

    (root || document).querySelectorAll('.timeline-card-media').forEach((media) => {
      const img = media.querySelector('img');
      const credit = img && creditFor(img.getAttribute('src'));
      if (credit) attach(media, credit);
    });

    (root || document).querySelectorAll('.reel-featured').forEach((featured) => {
      const credit = creditFor(featured.getAttribute('style'));
      if (credit) attach(featured, credit);
    });
  }

  document.addEventListener('click', (e) => {
    if (openPopover && !e.target.closest('.' + POPOVER_CLASS)) closePopover();
  });

  let reflowQueued = false;
  function reflowPopover() {
    if (!openPopover || reflowQueued) return;
    reflowQueued = true;
    requestAnimationFrame(() => {
      reflowQueued = false;
      if (openPopover) placePopover(openPopover.button, openPopover.node);
    });
  }
  window.addEventListener('scroll', reflowPopover, { passive: true });
  window.addEventListener('resize', reflowPopover);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && openPopover) {
      const button = openPopover.button;
      closePopover();
      button.focus();
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    scan();
    // Reel images are inserted later by JS; give them badges when they appear.
    const reel = document.getElementById('actions-section');
    if (reel) new MutationObserver(() => scan(reel)).observe(reel, { childList: true, subtree: true });
  });
})();
