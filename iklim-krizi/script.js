/* ── Sayfa kaydırma kilidi ──
   Pencereler ve büyütülmüş grafik açıkken arkadaki sayfa kaymamalı. body'ye
   overflow:hidden yetmiyor: html'de overflow-x:clip olduğu için kilit görünüm
   alanına aktarılmıyor, ayrıca Lenis tekerleği kendisi işliyor. Kilit html'e
   yazılıyor ve Lenis modülüne olayla bildiriliyor. */
function setPageScrollLocked(locked) {
  document.documentElement.classList.toggle('ik-scroll-locked', locked);
  document.dispatchEvent(new CustomEvent('ik:scroll-lock', { detail: { locked } }));
}

/* ── Küresel sıcaklık anomalisi verisi ──
   NASA GISS GISTEMP v4, yıllık küresel ortalama (J-D sütunu), 1951-1980
   ortalamasına göre °C. Kaynak:
   https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts+dSST.csv
   (son güncelleme 2026-09-08, erişim 2026-09-13). Değerler dosyadan birebir;
   ısınma şeridi dikişleri ve Global Isınma sahnesi aynı diziyi kullanıyor. */
const GISTEMP_FIRST_YEAR = 1880;
const GISTEMP_ANNUAL = [
  -0.18, -0.09, -0.12, -0.18, -0.29, -0.34, -0.32, -0.37, -0.18, -0.11, // 1880–1889
  -0.36, -0.23, -0.28, -0.32, -0.31, -0.23, -0.12, -0.12, -0.28, -0.18, // 1890–1899
  -0.09, -0.16, -0.29, -0.38, -0.48, -0.27, -0.23, -0.39, -0.43, -0.49, // 1900–1909
  -0.44, -0.45, -0.37, -0.36, -0.17, -0.15, -0.37, -0.46, -0.30, -0.28, // 1910–1919
  -0.28, -0.19, -0.29, -0.27, -0.27, -0.22, -0.11, -0.22, -0.20, -0.36, // 1920–1929
  -0.16, -0.09, -0.16, -0.29, -0.13, -0.20, -0.15, -0.03, -0.01, -0.02, // 1930–1939
   0.12,  0.18,  0.06,  0.09,  0.20,  0.09, -0.07, -0.03, -0.11, -0.11, // 1940–1949
  -0.18, -0.07,  0.01,  0.08, -0.13, -0.14, -0.19,  0.05,  0.06,  0.03, // 1950–1959
  -0.02,  0.06,  0.03,  0.05, -0.20, -0.11, -0.06, -0.02, -0.08,  0.05, // 1960–1969
   0.03, -0.08,  0.01,  0.16, -0.07, -0.01, -0.10,  0.18,  0.07,  0.16, // 1970–1979
   0.26,  0.32,  0.14,  0.31,  0.16,  0.12,  0.18,  0.32,  0.39,  0.27, // 1980–1989
   0.45,  0.41,  0.22,  0.23,  0.32,  0.45,  0.33,  0.47,  0.61,  0.38, // 1990–1999
   0.39,  0.53,  0.63,  0.62,  0.53,  0.68,  0.64,  0.66,  0.54,  0.66, // 2000–2009
   0.72,  0.61,  0.65,  0.68,  0.75,  0.90,  1.01,  0.92,  0.85,  0.98, // 2010–2019
   1.01,  0.85,  0.89,  1.17,  1.29,  1.19 // 2020–2025
];

/* ── Sıcaklık anomalisi renk ölçeği ──
   Dikişler ve Global Isınma sahnesi aynı ıraksak ölçeği okuyor: 11 token
   adımı, orta adım baz dönem ortalaması, iki uç serinin en büyük mutlak
   sapması. Şeritler sert duraklı tek bir linear-gradient olarak basılıyor:
   yüzlerce öğe yerine tek arka plan, her genişlikte keskin. */
const anomalyStripes = (function () {
  const rootStyle = getComputedStyle(document.documentElement);
  const SCALE_STEPS = 11;
  const scale = Array.from({ length: SCALE_STEPS }, (_, step) => rootStyle.getPropertyValue(`--anomaly-${step}`).trim());
  const middleStep = (SCALE_STEPS - 1) / 2;
  const bound = Math.max(...GISTEMP_ANNUAL.map((value) => Math.abs(value)));

  function colorFor(value) {
    const step = Math.round((value / bound) * middleStep) + middleStep;
    return scale[Math.min(SCALE_STEPS - 1, Math.max(0, step))];
  }

  function gradient(values) {
    const width = 100 / values.length;
    const stops = values.map((value, i) => `${colorFor(value)} ${(i * width).toFixed(3)}% ${((i + 1) * width).toFixed(3)}%`);
    return `linear-gradient(90deg, ${stops.join(', ')})`;
  }

  return { scale, bound, gradient };
})();

/* ── Isınma şeridi dikişleri ──
   Bölüm sınırlarındaki .ik-seam öğeleri seriyi ardışık dönemlere bölüyor:
   ilk dikiş 1880'lerden, son dikiş son yıllardan, yani sayfa aşağı indikçe
   şeritler kızarıyor. */
(function () {
  const seams = Array.prototype.slice.call(document.querySelectorAll('.ik-seam'));
  if (!seams.length) return;

  const yearsPerSeam = Math.ceil(GISTEMP_ANNUAL.length / seams.length);
  // Çizilme animasyonu yalnızca görünürlük izlenebiliyorsa: aksi halde şerit
  // hiç açılmadan gizli kalırdı.
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
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.replace('is-waiting', 'is-drawn');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  seams.forEach((seam) => observer.observe(seam));
})();

/* ── BAŞLIKLARDA YEAR EKSENİ (Climate Crisis fontunun "zamanın etkisini
   metaforik gösteren" YEAR ekseni) ──
   Google Fonts'un Climate Crisis açıklamasındaki fikir birebir uygulanıyor:
   font-variation-settings: "YEAR" değeri arttıkça harfler "eriyormuş" gibi
   bozuluyor. Ayrı bir sayaç/rozet YOK — sadece her section'ın kendi başlığı
   (h2/h3) ve alt başlığı (açıklama paragrafı), o section aktif olduğunda
   2000-2040 aralığında bir YEAR değeri alıyor; --yr CSS değişkeni :root'a
   yazılıp aşağı doğru inherit olduğu için style.css'teki ilgili
   başlık/alt-başlık kuralları (font-variation-settings:"YEAR" var(--yr))
   otomatik güncelleniyor — diğer tüm metinler düz fontta kalıyor. */
(function () {
  const sectionIds = [
    'sdg-section', 'happening-section', 'causes-section',
    'consequences-section', 'actions-section', 'progress-section', 'resources-section'
  ];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if (!sections.length) return;

  const YEAR_MIN = 2000;
  const YEAR_MAX = 2040;
  const root = document.documentElement;

  function activate(index) {
    const t = sections.length > 1 ? index / (sections.length - 1) : 0;
    const year = YEAR_MIN + t * (YEAR_MAX - YEAR_MIN);
    root.style.setProperty('--yr', year.toFixed(1));
  }

  // rootMargin ile viewport'un dikey ortasında ince bir "izleme şeridi"
  // tanımlanıyor (threshold yerine) — böylece tetikleme, section'ın
  // yüksekliğinden bağımsız olarak her zaman section sınırı viewport'un
  // ortasından geçtiği anda gerçekleşiyor (çok uzun section'larda sabit bir
  // oran/threshold kullanmak, aktifleşmenin geç kalmasına yol açıyordu).
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const index = sections.indexOf(entry.target);
      if (index !== -1) activate(index);
    });
  }, { threshold: 0, rootMargin: '-45% 0px -45% 0px' });

  sections.forEach((section) => observer.observe(section));
})();

/* ── SDG Orbital Sistemi ── */
(function () {

  /* ── 1. VERİ TABANI ─────────────────────────────────────── */
  // Her hedefin açıklaması, BM'nin sdgs.un.org/goals sayfasındaki resmi
  // hedef ifadesinin Türkçe çevirisiyle başlıyor, ardından iklim krizi
  // bağlamındaki etkisini anlatan cümlelerle devam ediyor.
  // Her hedefin "Şu An Dünyada" / "Bu Hedef Ne Amaçlıyor" metinleri ve
  // istatistiği, BM'nin sdgs.un.org/goals/goalN sayfalarından (her hedef
  // için ayrı ayrı) doğrulanmış güncel verilerle yazıldı.
  const sdgData = [
    {
      id: 1, title: "Yoksulluğa Son", color: "#E5243B", tag: "SOSYAL",
      status: "Küresel yoksullukla mücadelede ilerleme neredeyse durma noktasında: dünya nüfusunun yaklaşık onda biri hâlâ aşırı yoksulluk içinde yaşıyor. 3,8 milyar insanın hiçbir sosyal koruma kapsamı yok; bu oran düşük gelirli ülkelerde %9,7'ye inerken yüksek gelirli ülkelerde %85,9'a çıkıyor.",
      aim: "Bu hedef, 2030'a kadar yoksulluğu her biçimiyle ve her yerde sona erdirmeyi amaçlıyor: sadece aşırı yoksulluğu değil, her ülkenin kendi tanımına göre yoksulluğu da en az yarıya indirmeyi. Yoksullara gerçekten ulaşan sosyal koruma sistemleri kurmayı, ekonomik kaynaklara ve toprağa eşit erişimi, iklim ve ekonomik şoklara karşı dayanıklılığı hedefliyor.",
      stat: "847M", statLabel: "kişi 2024'te günlük 3 doların altında yaşıyordu"
    },
    {
      id: 2, title: "Açlığa Son", color: "#DDA63A", tag: "GIDA",
      status: "2024'te küresel açlık hafifçe geriledi ama hâlâ 2015 seviyesinin oldukça üzerinde. 2,3 milyar insan orta ya da ciddi düzeyde gıda güvensizliği yaşıyor (2015'te 1,6 milyardı) ve 150,2 milyon çocuk gelişim geriliği (bodurluk) yaşıyor.",
      aim: "Bu hedef, 2030'a kadar açlığı sona erdirmeyi, gıda güvenliğini ve beslenmeyi iyileştirmeyi, sürdürülebilir tarımı yaygınlaştırmayı amaçlıyor. Küçük ölçekli üreticilerin verimliliğini ve gelirini ikiye katlamayı, tarımı iklim değişikliğine karşı dirençli hale getirmeyi hedefliyor.",
      stat: "%8,2", statLabel: "dünya nüfusu 2024'te yetersiz besleniyordu"
    },
    {
      id: 3, title: "Sağlıklı Bireyler", color: "#4C9F38", tag: "SAĞLIK",
      status: "Sağlıkta ilerleme dengesiz: 5 yaş altı ölümler 2015'teki 6,1 milyondan 2024'te 4,9 milyona geriledi, ama bulaşıcı olmayan hastalıklar (kalp hastalığı, kanser, diyabet vb.) 2021'de 70 yaş altı 18 milyon kişinin ölümüne yol açtı; bu da her 2 saniyede bir erken ölüm demek. 2030'a kadar 11,1 milyon sağlık çalışanı açığı öngörülüyor.",
      aim: "Bu hedef, her yaştan insan için sağlıklı bir yaşamı ve refahı güvence altına almayı amaçlıyor: anne ve çocuk ölümlerini keskin biçimde azaltmak, AIDS/tüberküloz/sıtma salgınlarını sona erdirmek, bulaşıcı olmayan hastalıklardan erken ölümleri azaltmak ve herkesin mali zorluk yaşamadan kaliteli sağlık hizmetine erişebildiği evrensel sağlık kapsayıcılığına ulaşmak.",
      stat: "197", statLabel: "her 100.000 canlı doğumda anne ölümü (2023)"
    },
    {
      id: 4, title: "Nitelikli Eğitim", color: "#C5192D", tag: "EĞİTİM",
      status: "Okullaşma arttı ama öğrenme çıktıları geriliyor: 57 ülkede ortaokul sonunda okuma yeterliliği 2012-2022 arasında %59'dan %47'ye, matematik yeterliliği %41'den %36'ya düştü. 754 milyon yetişkin hâlâ okuma yazma bilmiyor (%63'ü kadın) ve ilkokulların beşte birinden fazlasında elektrik, su ya da sanitasyon gibi temel hizmetler yok.",
      aim: "Bu hedef, herkes için kapsayıcı, hakkaniyetli ve nitelikli eğitimi, yaşam boyu öğrenme fırsatlarını güvence altına almayı amaçlıyor: her kız ve erkek çocuğun sadece okula gitmesini değil, gerçek öğrenme çıktılarıyla ücretsiz ilk ve orta öğretimi tamamlamasını, evrensel okuryazarlığı hedefliyor.",
      stat: "%58", statLabel: "öğrenci ilkokul sonunda asgari okuma yeterliliğine ulaşabiliyor (2019)"
    },
    {
      id: 5, title: "Cinsiyet Eşitliği", color: "#FF3A21", tag: "EŞİTLİK",
      status: "Dünya genelinde yaklaşık her 3 kadından biri (840 milyon kişi) hayatının bir döneminde fiziksel ve/veya cinsel şiddete maruz kalıyor. Kadınlar, erkeklerin sahip olduğu yasal hakların yalnızca %64'üne sahip. Genç kadınların beşte biri 18 yaşından önce evlendirildi, 230 milyon kadın ve kız çocuğu kadın sünnetine (FGM) maruz kaldı.",
      aim: "Bu hedef, kadın ve kız çocuklarına yönelik her türlü ayrımcılığı ve şiddeti sona erdirmeyi, çocuk evliliği ve kadın sünneti gibi zararlı uygulamaları ortadan kaldırmayı amaçlıyor. Kadınların siyasi, ekonomik ve kamusal yaşamda eşit katılımını, üreme sağlığına erişimini, toprak/mülkiyet/finansal hizmetlerde eşit haklarını hedefliyor.",
      stat: "840M", statLabel: "kadın ve kız çocuğu hayatında fiziksel/cinsel şiddete maruz kaldı"
    },
    {
      id: 6, title: "Temiz Su ve Sanitasyon", color: "#26BDE2", tag: "SU",
      status: "2,1 milyar insan güvenle yönetilen içme suyuna, 3,4 milyar insan güvenli sanitasyona, 1,7 milyar insan ise temel hijyen hizmetlerine erişemiyor. Evsel atık suların yalnızca %56'sı güvenli şekilde arıtılıyor. BM'nin kendi değerlendirmesi açık: Hedef 6'nın hiçbir alt hedefi 2030 rotasında değil.",
      aim: "Bu hedef, herkes için güvenli içme suyuna, yeterli sanitasyon ve hijyene evrensel ve uygun fiyatlı erişimi güvence altına almayı amaçlıyor; bu hedefte özellikle kadınlar, kız çocukları ve kırılgan gruplar gözetiliyor. Su kirliliğini azaltmayı, suyu verimli kullanmayı, nehir/göl/sulak alan gibi tatlı su ekosistemlerini sürdürülebilir yönetmeyi hedefliyor.",
      stat: "2,1B", statLabel: "kişi güvenle yönetilen içme suyuna hâlâ erişemiyor"
    },
    {
      id: 7, title: "Erişilebilir Enerji", color: "#FCC30B", tag: "ENERJİ",
      status: "Küresel elektrik erişimi 2024'te %92'ye ulaştı, ama 655 milyon insan hâlâ elektriksiz yaşıyor. Nüfusun yaklaşık %75'i temiz pişirme imkânına sahip, 2 milyardan fazla insan hâlâ kirletici yakıtlara bağımlı. Yenilenebilir enerji, nihai enerji tüketiminin %18'ine ulaştı (2015'te %15,6 idi).",
      aim: "Bu hedef, 2030'a kadar herkes için uygun fiyatlı, güvenilir, sürdürülebilir ve modern enerjiye erişimi güvence altına almayı amaçlıyor. Küresel enerji karışımında yenilenebilir payını belirgin biçimde artırmayı ve enerji verimliliğindeki iyileşme hızını ikiye katlamayı hedefliyor.",
      stat: "655M", statLabel: "kişi hâlâ elektriğe erişemiyor (küresel erişim %92 olmasına rağmen)"
    },
    {
      id: 8, title: "İnsana Yakışır İş", color: "#A21942", tag: "EKONOMİ",
      status: "Küresel işsizlik 2025'te yaklaşık %4,9'da sabit kaldı, ama gençler yetişkinlere kıyasla neredeyse 4 kat daha fazla işsizlik riskiyle karşı karşıya. Kayıt dışı istihdam küresel iş gücünün %57,9'unu oluşturuyor. 2024'te yaklaşık 138 milyon çocuk (tüm çocukların %8'i) çocuk işçiliğine maruz kaldı.",
      aim: "Bu hedef, sürdürülen ve kapsayıcı ekonomik büyümeyi, tam ve üretken istihdamı, herkes için insana yakışır işi bir arada sağlamayı amaçlıyor; büyüme her ne pahasına olursa olsun değil, güvenli koşullar, adil ücret ve yasal korumayla gerçekleşmeli. Zorla çalıştırma, modern kölelik ve çocuk işçiliğini tamamen ortadan kaldırmayı hedefliyor.",
      stat: "138M", statLabel: "çocuk 2024'te çocuk işçiliğine maruz kaldı"
    },
    {
      id: 9, title: "Sanayi ve Yenilikçilik", color: "#FD6925", tag: "İNOVASYON",
      status: "Sanayi ve yakıt yakmadan kaynaklanan küresel CO₂ emisyonu 2024'te rekor kırarak 37,6 gigatona ulaştı. Dijital altyapı erişimi son derece eşitsiz: 2025'te 5G ağları yüksek gelirli ülkelerin %84'üne ulaşırken düşük gelirli ülkelerde bu oran yalnızca %4.",
      aim: "Bu hedef, herkes için işleyen dayanıklı altyapı ve kapsayıcı, sürdürülebilir sanayileşmeyi amaçlıyor. Sanayinin daha temiz ve kaynak verimli teknolojilere geçişini, özellikle en az gelişmiş ülkelerde evrensel ve uygun fiyatlı internet erişimini hedefliyor.",
      stat: "%4", statLabel: "düşük gelirli ülkelerde 5G kapsama oranı (yüksek gelirlilerde %84)"
    },
    {
      id: 10, title: "Eşitsizliklerin Azaltılması", color: "#DD1367", tag: "ADALET",
      status: "Dünya nüfusunun %13'ü kendi ülkesinin medyan gelirinin yarısından azıyla yaşıyor (Latin Amerika'da bu oran %20'ye çıkıyor). Neredeyse her 5 kişiden biri ayrımcılığa maruz kaldığını bildiriyor. 2024 ortası itibarıyla 37,8 milyon kişi mülteci statüsünde (2015'e göre iki kattan fazla artış).",
      aim: "Bu hedef, ülkeler içindeki ve ülkeler arasındaki gelir uçurumunu kapatmayı amaçlıyor. En yoksul %40'lık kesimin gelirinin ulusal ortalamadan daha hızlı artmasını, yaş/cinsiyet/engellilik/ırk fark etmeksizin eşit fırsatı, gelişmekte olan ülkelerin küresel ekonomik kurumlarda daha güçlü sesini hedefliyor.",
      stat: "37,8M", statLabel: "kişi 2024 ortası itibarıyla mülteci statüsündeydi"
    },
    {
      id: 11, title: "Sürdürülebilir Şehirler", color: "#FD9D24", tag: "KENTSEL",
      status: "Dünya nüfusunun yarısından fazlası zaten şehirlerde yaşıyor, bu oranın 2050'ye kadar %70'e çıkması bekleniyor. 2022'de 1,12 milyar insan gecekondu ya da benzeri koşullarda yaşıyordu (2015'e göre 130 milyon fazla). Kentlilerin yalnızca %61,5'i toplu taşımaya rahat erişebiliyor.",
      aim: "Bu hedef, büyümeye devam eden şehirleri kapsayıcı, güvenli, dayanıklı ve sürdürülebilir kılmayı amaçlıyor. Herkesin uygun fiyatlı konuta ve iyileştirilmiş gecekondu alanlarına erişimini, güvenli ve erişilebilir toplu taşımayı, şehirlerin çevresel ayak izinin azaltılmasını hedefliyor.",
      stat: "1,12B", statLabel: "kişi 2022'de gecekondu benzeri koşullarda yaşıyordu"
    },
    {
      id: 12, title: "Sorumlu Tüketim", color: "#BF8B2E", tag: "TÜKETİM",
      status: "Her yıl yaklaşık 1,05 milyar ton gıda israf ediliyor (bunun %60'ı hane halkı kaynaklı); bu, yüz milyonlarca insan aç yaşarken gerçekleşiyor. 2023'te dünya 65 milyon ton e-atık üretti (kişi başına 8,1 kg), bunun sadece 15,5 milyon tonu (dörtte birinden azı) resmi olarak geri dönüştürüldü.",
      aim: "Bu hedef, ekonomik büyüme ile çevresel tahribat arasındaki bağı koparmayı amaçlıyor. Kişi başına küresel gıda israfını perakende ve tüketici düzeyinde yarıya indirmeyi, kimyasalların ve atıkların çevreye duyarlı yönetimini, büyük şirketlerin sürdürülebilir ve şeffaf uygulamalar benimsemesini hedefliyor.",
      stat: "65M ton", statLabel: "e-atık üretildi (2023), sadece %24'ü geri dönüştürüldü"
    },
    {
      id: 13, title: "İklim Eylemi", color: "#3F7E44", tag: "ACİL",
      status: "2025'te küresel ortalama sıcaklık, sanayi öncesi döneme göre 1,43°C daha yüksek; bu da Paris Anlaşması'nın 1,5°C sınırına doğrudan dayanıyor. Atmosferdeki CO₂ seviyesi 2024'te 2 milyon yılın en yüksek noktasına ulaştı (sanayi öncesinin %152 üzerinde). İklim afetleri her yıl ortalama 123 milyon insanı etkiliyor.",
      aim: "Bu hedef, iklim değişikliğiyle ve etkileriyle mücadele için acil eylemi amaçlıyor. Bu on yılda hızlı ve derin emisyon azaltımı olmazsa 1,5°C sınırının aşılacağı ve milyarlarca hayatın risk altına gireceği öngörülüyor. İklim afetlerine dayanıklılığı, iklim eylemini ulusal politikalara entegre etmeyi, gelişmekte olan ülkelere iklim finansmanını hedefliyor.",
      stat: "1,43°C", statLabel: "2025'te sanayi öncesi döneme göre küresel sıcaklık artışı"
    },
    {
      id: 14, title: "Sudaki Yaşam", color: "#0A97D9", tag: "OKYANUS",
      status: "Okyanuslar sanayi öncesi döneme kıyasla yaklaşık %30 daha asidik; bu da mercanları ve deniz canlılarını doğrudan tehdit ediyor. Küresel balık stoklarının %37,7'si 2021'de aşırı avlanmaya maruz kaldı (2019'da %35,4 idi). Deniz alanı planlaması yapan 126 ülkeden sadece 45'inin resmi onaylı planı var (2024).",
      aim: "Bu hedef, okyanusları ve deniz kaynaklarını korumayı ve sürdürülebilir kullanmayı amaçlıyor; dünya yüzeyinin %70'inden fazlasını kaplayan okyanuslara 3 milyardan fazla insan geçim kaynağı için bağımlı durumda. Deniz kirliliğini azaltmayı, kıyı ve deniz ekosistemlerini korumayı, aşırı avlanmayı sona erdirmeyi, kıyı/deniz alanlarının en az %10'unu koruma altına almayı hedefliyor.",
      stat: "%37,7", statLabel: "küresel balık stoku 2021'de aşırı avlanmaya maruz kaldı"
    },
    {
      id: 15, title: "Karasal Yaşam", color: "#56C02B", tag: "EKOSİSTEM",
      status: "Küresel orman örtüsü 2025'te kara alanının %31,8'ine geriledi (4,14 milyar hektar); 1990'dan bu yana 203,1 milyon hektar (%4,7) kayıp yaşandı. Tarımsal genişleme, küresel ormansızlaşmanın neredeyse %90'ının doğrudan nedeni. 2015-2019 arasında her yıl en az 100 milyon hektar verimli arazi kayboldu; bu durum 1,3 milyar insanı doğrudan etkiliyor.",
      aim: "Bu hedef, karasal ekosistemleri korumayı, eski haline getirmeyi ve sürdürülebilir kullanımını desteklemeyi amaçlıyor: ormanları sürdürülebilir yönetmek, çölleşmeyle mücadele etmek, arazi bozulmasını durdurup tersine çevirmek, biyoçeşitlilik kaybını durdurmak. BM'nin kendi ifadesiyle biyoçeşitlilik \"insanlığın yaşam destek sistemi.\"",
      stat: "1,3B", statLabel: "kişi arazi bozulmasından doğrudan etkileniyor"
    },
    {
      id: 16, title: "Barış ve Adalet", color: "#00689D", tag: "YÖNETİŞİM",
      status: "Şiddetli çatışmalar on yılların en yüksek seviyesine ulaştı. Haziran 2025 itibarıyla 117,3 milyon insan zorla yerinden edildi, bunların 42,5 milyonu mülteci. Küresel cinayet oranı 2015'teki 100.000 kişide 5,9'dan 2024'te 5,1'e geriledi; bu, 2030 hedefi olan %50 azalmanın çok gerisinde.",
      aim: "Bu hedef, barışçıl ve kapsayıcı toplumları, herkes için adalete erişimi, her düzeyde etkili ve hesap verebilir kurumları amaçlıyor. Şiddeti ve ölüm oranlarını azaltmayı, çocuk istismarı ve insan kaçakçılığını sona erdirmeyi, yolsuzluğu ve yasa dışı mali akışları önemli ölçüde kısmayı hedefliyor.",
      stat: "117,3M", statLabel: "kişi dünya genelinde zorla yerinden edildi (Haziran 2025)"
    },
    {
      id: 17, title: "Hedefler İçin Ortaklık", color: "#19486A", tag: "ORTAKLIK",
      status: "Büyük bağışçı ülkelerin resmi kalkınma yardımı 2025'te 174,3 milyar dolara geriledi; 2024'e göre %23,1'lik bu düşüş \"kayıtlardaki en büyük yıllık azalış\" oldu. Gelişmekte olan ülkelerin toplam dış borcu 2024'te rekor kırarak 8,9 trilyon dolara ulaştı.",
      aim: "Bu hedef, diğer tüm hedefleri finanse edecek ve hayata geçirecek küresel ortaklıkları güçlendirmeyi amaçlıyor. Zengin ülkelerin uzun süredir taahhüt ettiği yardım hedeflerini (gayri safi milli hasılanın %0,7'si) karşılamasını, borç yönetimine destek olmasını, teknoloji ve bilgi paylaşımını, adil bir küresel ticaret sistemini hedefliyor.",
      stat: "$4T", statLabel: "gelişmekte olan ülkelerdeki yıllık SKH yatırım açığı"
    }
  ];

  /* ── 2. STATE ────────────────────────────────────────────── */
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

  /* ── 3. DOM REFERANSLARI ─────────────────────────────────── */
  const canvas = document.getElementById('sdgCanvas');
  const infoCard = document.getElementById('sdgInfoCard');
  const cardInner = document.getElementById('sdgCardInner');
  const orbitRing = canvas ? canvas.querySelector('.sdg-orbit-ring') : null;

  if (!canvas || !infoCard || !cardInner) {
    return;
  }

  /* ── 4. YARDIMCI FONKSİYONLAR ───────────────────────────── */
  /* Node'ların yörünge yarıçapı artık genişlik breakpoint'lerini JS'te
     tekrarlamıyor: .sdg-orbit-ring CSS'te ne kadar büyük render edilirse
     (sabit piksel, clamp() veya yeni yatay-telefon kısa-ekran kuralı fark
     etmez), node'lar her zaman tam o halkanın üzerinde duracak şekilde
     halkanın gerçek render genişliğini okuyor — tek doğruluk kaynağı CSS. */
  function getRadius() {
    if (orbitRing) return orbitRing.clientWidth / 2;
    return canvas.clientWidth * 0.42;
  }

  function imgSrc(id) {
    return `assets/image/sdg/e-web-${String(id).padStart(2, '0')}.png`;
  }

  /* ── 5. NODE'LARI OLUŞTUR ───────────────────────────────── */
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
      // Logo yüklenemezse SDG numarası göster
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

  /* ── 7. ANİMASYON DÖNGÜSÜ ───────────────────────────────── */
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

  /* ── 8. TIKLAMA HANDLER ─────────────────────────────────── */
  function handleNodeClick(id) {
    if (activeId === id) {
      resetState();
      return;
    }

    autoRotate = false;
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
    activeId = id;

    // Tüm node'ları soluklaştır, aktifi öne çıkar
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

  /* ── 9. BİLGİ KARTINI GÜNCELLE ─────────────────────────── */
  function showInfoCard(id) {
    const sdg = sdgData.find((s) => s.id === id);
    if (!sdg) return;

    // CSS değişkenini card inner'a uygula
    cardInner.style.setProperty('--sdg-color', sdg.color);

    cardInner.innerHTML = `
      <div class="sdg-card-top">
        <img class="sdg-card-logo" src="${imgSrc(sdg.id)}" alt="SDG ${sdg.id}" onerror="this.style.display='none'">
        <div class="sdg-card-titles">
          <h3>${sdg.title}</h3>
          <p class="sdg-card-subtitle">Sürdürülebilir Kalkınma Hedefi ${sdg.id}</p>
        </div>
      </div>
      <div class="sdg-card-block">
        <span class="sdg-card-eyebrow">Şu An Dünyada</span>
        <p class="sdg-card-desc">${sdg.status}</p>
      </div>
      <div class="sdg-card-block">
        <span class="sdg-card-eyebrow">Bu Hedef Ne Amaçlıyor</span>
        <p class="sdg-card-desc">${sdg.aim}</p>
      </div>
      <div class="sdg-card-stat">
        <div class="sdg-stat-value">${sdg.stat}</div>
        <div class="sdg-stat-label">${sdg.statLabel}</div>
      </div>
    `;

    // Animasyonu sıfırla ve başlat
    infoCard.classList.remove('sdg-card-visible');
    void infoCard.offsetWidth; // reflow
    infoCard.classList.add('sdg-card-visible');
  }

  /* ── 10. SIFIRLAMA ──────────────────────────────────────── */
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

  /* ── 10b. KAPATMA DÜĞMESİ (tam ekran mobil kart) ────────── */
  infoCard.addEventListener('click', (e) => {
    if (e.target.closest('.sdg-card-close')) {
      e.stopPropagation();
      resetState();
    }
  });

  /* ── 11. DIŞARI TIKLAMA → SIFIRLA ──────────────────────── */
  const sectionEl = document.getElementById('sdg-section');
  sectionEl.addEventListener('click', (e) => {
    if (activeId !== null
      && !e.target.closest('.sdg-node')
      && !e.target.closest('.sdg-card-panel')) {
      resetState();
    }
  });

  /* ── 12. PENCERE YENİDEN BOYUTLANMA ─────────────────────── */
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

  /* ── 13. INTERSECTION OBSERVER — PERFORMANS ─────────────── */
  const sectionObserver = new IntersectionObserver((entries) => {
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
  }, { threshold: 0.08 });

  sectionObserver.observe(sectionEl);

})();

/* ── Lenis (framer.com/m/Lenis) — ataletli/akışkan kaydırma ──
   Native scroll'un yerini, fare tekerleği/touch girdisini yumuşak bir
   "lerp" ile deferre eden Lenis alıyor. GSAP ScrollTrigger zaten section
   giriş animasyonları ve kronoloji dolum çubuğu için kullanıldığından,
   Lenis'i kendi rAF döngüsüyle DEĞİL, GSAP'ın ticker'ıyla sürüyoruz —
   resmi Lenis+ScrollTrigger entegrasyon deseni: aksi halde iki ayrı rAF
   döngüsü birbirinden bağımsız ilerleyip scroll konumunda küçük bir
   gecikme/titreme (jitter) yaratabiliyordu. */
(function () {
  if (typeof Lenis === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const lenis = new Lenis({
    duration: 1.2,
    smoothWheel: true,
    autoRaf: false
  });

  // Pencere ya da büyütülmüş grafik açıkken Lenis tekerleği yakalayıp arkadaki
  // sayfayı kaydırıyordu. Kilit olayında duruyor; pencerelerin kendi içi
  // data-lenis-prevent ile tarayıcının normal kaydırmasına bırakılıyor.
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

/* ── Bölüm Bazlı Giriş Animasyonları (GSAP ScrollTrigger) ──
   Her bölümün kendine özgü tek bir "imza" hareketi var; AOS genel
   fade-up girişleri yönetmeye devam ediyor, GSAP sadece kart/öğe
   gruplarının stagger hareketini ekliyor — farklı mekanizmalar
   oldukları için çakışmıyorlar. */
(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero: video arka plana hafif parallax
  if (document.querySelector('.ik-hero-video')) {
    gsap.to('.ik-hero-video', {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: {
        trigger: '.ik-hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // Diğer tüm "tek seferlik" giriş animasyonları ScrollTrigger'ın
  // start/end+onEnter mekaniği yerine IntersectionObserver ile tetiklenir —
  // gerçek görünürlük durumuna baktığı için scroll pozisyonu/hızından
  // bağımsız her zaman güvenilir şekilde tetiklenir. Sebepler grafiklerinin
  // (SVG) lazy-init'i de zaten bu deseni kullanıyor.
  const signatureAnimations = [
    {
      sectionId: 'sdg-section',
      play: () => {
        if (!document.getElementById('sdgCanvas')) return;
        gsap.from('#sdgCanvas', { opacity: 0, scale: 0.85, duration: 0.8, ease: 'power2.out' });
      }
    },
    {
      sectionId: 'causes-section',
      play: () => {
        if (!document.querySelector('.cause-tab-content')) return;
        gsap.from('.cause-tab-content', { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' });
      }
    },
    {
      sectionId: 'resources-section',
      play: () => {
        if (!document.querySelector('.resource-card')) return;
        gsap.from('.resource-card', {
          opacity: 0, scale: 0.92, y: 16, duration: 0.5, stagger: 0.06, ease: 'power2.out'
        });
      }
    }
  ];

  signatureAnimations.forEach((entry) => {
    const section = document.getElementById(entry.sectionId);
    if (!section) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          entry.play();
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(section);
  });
})();

/* ── Sebepler Grafikleri: El Yapımı SVG Bileşenler ──
   Kullanıcının paylaştığı React DonutChart / CleanWireframeAnalytics
   referans bileşenlerindeki görsel dile sadık bir port: yuvarlak uçlu
   halka segmentleri + hover'da glow (DonutChart.tsx), yumuşak bezier
   eğrili çizgi + gradient dolgu + animasyonlu "çizilme" + hover tooltip
   (CleanWireframeAnalytics). Bu proje React/Framer Motion/Tailwind/bir
   derleme adımı kullanmadığından aynı teknikler (stroke-dasharray/
   dashoffset animasyonu, kübik bezier interpolasyonu, CSS transition)
   saf JS + inline SVG ile yeniden uygulandı; Chart.js bu bölümde artık
   kullanılmıyor. */
(function () {
  const rendered = {};
  const SVG_NS = 'http://www.w3.org/2000/svg';

  // Renkler style.css token'larından okunuyor. Önceki palet renk körlüğü ve
  // okunurluk kontrollerinden geçmiyordu (amber çok açık, slate kimlik
  // taşımayacak kadar grimsi). Dilimler sabit sırayla en fazla 4 renk alıyor.
  const rootStyle = getComputedStyle(document.documentElement);
  const token = (name) => rootStyle.getPropertyValue(name).trim();
  const SERIES_COLORS = [1, 2, 3, 4].map((slot) => token(`--data-series-${slot}`));
  // Emisyon artışı kötü, orman alanı artışı iyi: bu anlamı taşıyan eğriler
  // durum renkleri alıyor ve değişim etiketinde yön işaretiyle birlikte duruyor.
  const TREND_BAD = token('--status-critical');
  const TREND_GOOD = token('--status-good');

  function svgEl(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);
    if (attrs) {
      Object.keys(attrs).forEach((key) => el.setAttribute(key, attrs[key]));
    }
    return el;
  }

  /* ── Donut Chart (DonutChart.tsx'in saf JS/SVG portu) ──
     Her segment kendi <circle>'ı: stroke-dasharray ile dilim genişliği,
     stroke-dashoffset ile başlangıç noktası, stroke-linecap:round ile
     yuvarlak uçlar. -90deg rotate, 12 hizasından başlaması için. */
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

    svg.appendChild(svgEl('circle', {
      cx: size / 2, cy: size / 2, r: radius,
      fill: 'none', stroke: 'rgba(255,255,255,0.12)', 'stroke-width': strokeWidth
    }));

    // DonutChart.tsx'teki onSegmentHover callback'inin karşılığı: merkez
    // içerik varsayılan olarak en büyük dilimi gösterir, hover edilen
    // dilim değiştikçe (değer + renk + etiket) canlı güncellenir.
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

      // fill:"none" (SVG "boyama yok" değeri) — fill:"transparent" (alfa=0
      // ama yine de "boyanmış" sayılır) kullanılsaydı, her segmentin GÖRÜNMEZ
      // iç diski de pointer-events:visiblePainted altında tıklanabilir
      // olurdu; üstteki (DOM'da sonraki) segmentin dolgusu, alttaki
      // segmentin GÖRÜNÜR halka parçasının hover'ını çalardı.
      const circle = svgEl('circle', {
        cx: size / 2, cy: size / 2, r: radius,
        fill: 'none', stroke: color, 'stroke-width': strokeWidth,
        'stroke-linecap': 'round',
        'stroke-dasharray': `${dash} ${circumference}`,
        'stroke-dashoffset': circumference
      });
      circle.classList.add('donut-segment');
      circle.style.setProperty('--segment-color', color);
      // Sadece "çizilme" (stroke-dashoffset) girişi kademeli gecikmeli —
      // DonutChart.tsx'in animationDelayPerSegment=0.05 varsayılanıyla aynı.
      // Diğer üç transition (filter/transform/opacity, hover tepkisi) 0s
      // kalmalı; tek bir transitionDelay değeri TÜM listeye uygulanıp
      // hover glow/scale'ini de kalıcı olarak geciktirirdi.
      circle.style.transitionDelay = `${i * 0.05}s, 0s, 0s, 0s`;
      circle.dataset.targetOffset = targetOffset;

      // Klavyeyle dilimler arasında gezilebiliyor; fare ve dokunma aşağıda
      // SVG'nin bütününden açıyla çözülüyor.
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

    // Parmağın/imlecin altındaki dilim açıdan bulunuyor: dilimler 12 hizasından
    // saat yönünde diziliyor. Telefonda seçim, dokunuşu taklit eden fare
    // olaylarına bırakılınca bazı tarayıcılar dokunuşun hemen ardından "çıktı"
    // olayı gönderip seçimi en büyük dilime geri alıyordu; pointer olayları ve
    // konum hesabı her tarayıcıda aynı çalışıyor.
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
    // Fareyle grafikten çıkınca en büyük dilime dönüyor; dokunmatikte seçim
    // ekranda kalıyor ve grafiğin dışına dokununca sıfırlanıyor.
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

    // Girişte "çizilme" animasyonu: bir sonraki frame'e ertelenip CSS
    // transition tetiklenir (aynı frame'de set edilirse transition atlanır).
    requestAnimationFrame(() => requestAnimationFrame(() => {
      segments.forEach((s) => { s.circle.style.strokeDashoffset = s.circle.dataset.targetOffset; });
    }));
  }

  /* ── Yumuşak Bezier Çizgi + Alan Grafiği ──
     CleanWireframeAnalytics'teki generateSmoothPath ile aynı kübik bezier
     interpolasyonu: her nokta çifti arasında kontrol noktaları önceki/
     sonraki noktaya göre hesaplanır. */
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
      y: padding.top + (1 - v / maxVal) * chartH
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
      svg.appendChild(svgEl('line', {
        x1: padding.left, x2: width - padding.right, y1: y, y2: y,
        stroke: 'rgba(255,255,255,0.08)', 'stroke-width': 1
      }));
    }

    const areaPath = svgEl('path', { d: smoothPath(points, height - padding.bottom), fill: `url(#${gradientId})` });
    areaPath.classList.add('trend-area');
    svg.appendChild(areaPath);

    const linePath = svgEl('path', {
      d: smoothPath(points),
      fill: 'none', stroke: color, 'stroke-width': 2.5,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round'
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
        cx: p.x, cy: p.y, r: 3.5,
        fill: color, stroke: 'rgba(255,255,255,0.9)', 'stroke-width': 1.5
      });
      dot.classList.add('trend-dot');
      dot.style.transitionDelay = `${0.6 + i * 0.06}s`;
      svg.appendChild(dot);
      dots.push(dot);

      // Klavye için odaklanabilir, görünmez nokta; fare ve dokunma aşağıda
      // SVG'nin bütününden en yakın noktaya çözülüyor.
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

    // Parmağın/imlecin yatayda en yakın olduğu yıl seçiliyor: nokta telefonda
    // ~3px'e küçüldüğü için tam üstüne dokunmak gerekmiyor. Dilim grafiğiyle
    // aynı gerekçe: dokunuşu taklit eden fare olaylarına güvenilmiyor.
    function nearestPoint(event) {
      const rect = svg.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * width;
      let nearest = 0;
      points.forEach((p, i) => { if (Math.abs(p.x - x) < Math.abs(points[nearest].x - x)) nearest = i; });
      return nearest;
    }

    svg.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'mouse') showPoint(nearestPoint(event));
    });
    svg.addEventListener('pointerleave', (event) => {
      if (event.pointerType === 'mouse') hidePoint();
    });
    svg.addEventListener('pointerdown', (event) => showPoint(nearestPoint(event)));
    // Dokunmatikte ipucu ekranda kalıyor, grafiğin dışına dokununca kapanıyor.
    document.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'mouse' && !container.contains(event.target)) hidePoint();
    });

    labels.forEach((label, i) => {
      // İlk/son etiket "middle" ile ortalanırsa metin viewBox kenarından
      // taşıp SVG'nin varsayılan clip'iyle kırpılıyordu (ör. "1990" →
      // "990") — uç etiketler, viewBox içine doğru genişleyecek şekilde
      // start/end hizalanıyor.
      const anchor = i === 0 ? 'start' : i === labels.length - 1 ? 'end' : 'middle';
      const text = svgEl('text', { x: points[i].x, y: height - 8, 'text-anchor': anchor });
      text.classList.add('trend-axis-label');
      text.textContent = label;
      svg.appendChild(text);
    });

    container.appendChild(svg);
    container.appendChild(tooltip);

    // CleanWireframeAnalytics'teki alt Peak/Average/Growth metrik kartlarının
    // birebir karşılığı: en yüksek değer, ortalama ve baştan sona büyüme
    // oranı, veriden hesaplanıp grafiğin altında gösteriliyor.
    const growthPct = values[0] !== 0 ? Math.round(((values[values.length - 1] - values[0]) / values[0]) * 100) : 0;
    const metrics = document.createElement('div');
    metrics.className = 'trend-metrics';
    metrics.innerHTML =
      `<div class="trend-metric"><span class="trend-metric-value"><span class="trend-metric-icon" aria-hidden="true" style="color: ${color}">${growthPct >= 0 ? '↑' : '↓'}</span> ${growthPct > 0 ? '+' : ''}${growthPct}%</span><span class="trend-metric-label">Değişim</span></div>`;
    container.appendChild(metrics);

    // getTotalLength() DOM'a eklendikten sonra çağrılıyor — bazı tarayıcılarda
    // ayrık (detached) SVG path'lerde güvenilir sonuç vermeyebiliyor.
    const length = linePath.getTotalLength();
    linePath.style.strokeDasharray = length;
    linePath.style.strokeDashoffset = length;

    requestAnimationFrame(() => requestAnimationFrame(() => {
      linePath.style.strokeDashoffset = '0';
      areaPath.classList.add('is-visible');
      dots.forEach((d) => d.classList.add('is-visible'));
      metrics.classList.add('is-visible');
    }));
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
    renderDonut('causeAgricultureChart', ['Hayvancılık CH₄', 'Pirinç tarlaları', 'Gübre N₂O', 'Arazi kullanımı'], [31, 20, 30, 19]);
  }
  function initCauseTransportChart() {
    // TÜİK 2017 seragazı emisyon envanteri (ÇŞB Çevresel Göstergeler, §10.3):
    // ulaştırma kaynaklı CO₂'nin türe göre gerçek payı.
    renderDonut('causeTransportChart', ['Karayolu', 'Havayolu', 'Denizyolu', 'Demiryolu/Diğer'], [93, 4.5, 1.1, 1.4]);
  }

  function initCauseEnergyTrendChart() {
    // Türkiye enerji kaynaklı seragazı emisyonu, milyon ton CO₂e
    // (TÜİK Seragazı Emisyon İstatistikleri, ÇŞB Çevresel Göstergeler §4.2, 1990-2018).
    renderTrendChart(
      'causeEnergyTrendChart',
      ['1990', '2000', '2010', '2018'],
      [139.6, 216.1, 287.0, 373.1],
      TREND_BAD
    );
  }
  function initCauseDeforestationTrendChart() {
    // Türkiye toplam orman alanı, milyon hektar (Tarım ve Orman Bakanlığı,
    // Orman Genel Müdürlüğü — ÇŞB Çevresel Göstergeler §9.7, 1973-2018).
    // Not: küresel ormansızlaşma eğiliminin aksine Türkiye'nin orman alanı
    // büyüyor — bkz. sekme altındaki açıklama metni.
    renderTrendChart(
      'causeDeforestationTrendChart',
      ['1973', '1999', '2010', '2018'],
      [20.2, 20.76, 21.54, 22.62],
      TREND_GOOD
    );
  }
  function initCauseIndustryTrendChart() {
    // Türkiye endüstriyel işlemler ve ürün kullanımı emisyonu, milyon ton CO₂e
    // (TÜİK, ÇŞB Çevresel Göstergeler §4.2, 1990-2018).
    renderTrendChart(
      'causeIndustryTrendChart',
      ['1990', '2000', '2010', '2018'],
      [22.8, 26.2, 48.1, 65.2],
      TREND_BAD
    );
  }
  function initCauseAgricultureTrendChart() {
    // Türkiye tarımsal faaliyetler emisyonu, milyon ton CO₂e
    // (TÜİK, ÇŞB Çevresel Göstergeler §4.2, 1990-2018).
    renderTrendChart(
      'causeAgricultureTrendChart',
      ['1990', '2000', '2010', '2018'],
      [45.7, 42.3, 44.0, 64.9],
      TREND_BAD
    );
  }
  function initCauseTransportTrendChart() {
    // Türkiye ulaştırma toplam seragazı emisyonu, milyon ton CO₂e
    // (TÜİK, ÇŞB Çevresel Göstergeler §10.3, 1990-2017).
    renderTrendChart(
      'causeTransportTrendChart',
      ['1990', '2000', '2010', '2017'],
      [27.0, 36.5, 45.4, 84.7],
      TREND_BAD
    );
  }

  const initializers = [
    { sectionId: 'causes-section', fn: initCauseEnergyChart },
    { sectionId: 'causes-section', fn: initCauseEnergyTrendChart }
  ];

  initializers.forEach((entry) => {
    const section = document.getElementById(entry.sectionId);
    if (!section) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          entry.fn();
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });

    observer.observe(section);
  });

  // Sebepler sekmeleri: ilk sekmenin grafiği yukarıdaki IntersectionObserver ile
  // çizilir; diğer 4 sekme, Bootstrap'ın native "shown.bs.tab" event'iyle ilk
  // açıldığında lazy-init edilir.
  const causeChartInitByTab = {
    'cause-deforestation': [initCauseDeforestationChart, initCauseDeforestationTrendChart],
    'cause-industry': [initCauseIndustryChart, initCauseIndustryTrendChart],
    'cause-agriculture': [initCauseAgricultureChart, initCauseAgricultureTrendChart],
    'cause-transport': [initCauseTransportChart, initCauseTransportTrendChart]
  };

  document.querySelectorAll('#causeTabsNav .cause-tab-btn').forEach((btn) => {
    btn.addEventListener('shown.bs.tab', (e) => {
      const targetId = e.target.getAttribute('data-bs-target').replace('#', '');
      const initFns = causeChartInitByTab[targetId];
      if (initFns) initFns.forEach((fn) => fn());
    });
  });
})();

/* ── Sebepler Başlığı: Sekme Değişince Renkli "Sweep" ile Yazı Değişimi ──
   Sekmelerin kendine özel renkleri kaldırıldı; başlık artık her zaman beyaz
   dinleniyor (sweep band'ı hâlâ DiaTextReveal'ın varsayılan renk paletiyle
   geçiyor, ama sonunda beyaza yerleşiyor). */
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
    void suffixText.offsetWidth; // reflow, animasyonları yeniden tetikler
    suffixText.classList.add('dip', 'sweep-in');
    setTimeout(() => {
      suffixText.classList.remove('dip');
    }, DIP_RESET_MS);
  }

  /* Başlık (sabit metin + değişen sekme adı) en soldan en sağa kadar uzansın:
     doğal genişliği ölçüp mevcut alana sığacak şekilde font-size'ı ölçekler.
     Genişlik toplamını önceden hesaplayıp tek seferde bir ölçek uygulamak
     güvenilir çıkmadı: .cause-heading-suffix flex item'ı (overflow-x:hidden,
     min-width:0) bazı genişliklerde, statik metin + suffix'in toplamı
     kapsayıcıya rahatça sığsa bile kendi içeriğinden daha dar render
     edilebiliyor (Chromium'un flex "resolving flexible lengths" algoritmasının
     bu kombinasyonda ürettiği bir sonuç — kesin nedeni CSS uzmanlığı
     gerektiriyor). Kesin/döngüsel biçim yerine EMPIRİK bir yaklaşım
     kullanıyoruz: gerçek taşmayı (suffixText'in sağ kenarı, onu kırpan
     .cause-heading-suffix'in sağ kenarını ne kadar geçiyor) doğrudan ölçüp,
     sığana kadar ikili arama (binary search) ile küçültüyoruz — sebep ne
     olursa olsun sonucu garanti eder. */
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
    if (overflowPx() <= 0.5) return; // doğal boyutta zaten sığıyor

    let lo = HEADING_FIT_MIN_SCALE;
    let hi = 1;
    for (let i = 0; i < 14; i++) {
      const mid = (lo + hi) / 2;
      applyScale(mid);
      if (overflowPx() > 0.5) hi = mid; else lo = mid;
    }
    applyScale(lo);
  }

  document.querySelectorAll('#causeTabsNav .cause-tab-btn').forEach((btn) => {
    btn.addEventListener('shown.bs.tab', (e) => {
      const name = e.target.getAttribute('data-cause-name');
      if (!name) return;

      // DiaTextReveal'da metin React state ile anında değişir, kaybolmaz —
      // değişimi gizleyen şey eşzamanlı oynayan "dip" (opaklık/blur/kayma) efekti.
      suffixText.textContent = name;
      playDipAndSweep();
      requestAnimationFrame(fitHeadingWidth);
    });
  });

  // İlk yüklemede de bir kez sweep oynat (component mount olduğunda olduğu gibi)
  playDipAndSweep();
  fitHeadingWidth();

  // Montserrat web fontu ilk ölçümden SONRA yüklenirse (FOUT), scrollWidth
  // yedek fontun metrikleriyle hesaplanmış olur — font tamamen hazır
  // olduğunda ölçümü gerçek font metrikleriyle tekrar yapıyoruz.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitHeadingWidth);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fitHeadingWidth, HEADING_RESIZE_DEBOUNCE_MS);
  });

  // Başlık ".cause-fullwidth-heading" üzerinden "YEAR" değişken font eksenini
  // miras alıyor (bkz. dosyanın başındaki YEAR ekseni bloğu, --yr) — section
  // scroll ile aktifleşince YEAR değeri 1.2s'lik bir geçişle değişiyor ve
  // harfler "eriyerek" şekil değiştiriyor. Bu şekil değişimi glifin doğal
  // genişliğini de değiştirdiğinden, sayfa ilk yüklendiğinde (henüz hiçbir
  // section aktifleşmeden, YEAR başlangıç değerindeyken) yapılan tek seferlik
  // ölçüm, kullanıcı gerçekten bu section'a kaydırdığında geçersiz kalıyordu
  // — metin, ölçümden SONRA değişen glif genişliğiyle taşıyordu. Geçiş
  // bittiğinde ("transitionend") ölçümü tazeleyerek bunu düzeltiyoruz.
  const fullwidthHeading = document.querySelector('.cause-fullwidth-heading');
  if (fullwidthHeading) {
    fullwidthHeading.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'font-variation-settings') fitHeadingWidth();
    });
  }
})();

/* ── Sebep Örnekleri: CardStack (fanlanmış kart istifi) ──
   Her sekmenin altında 3 örnek kart fan şeklinde dizilir; tıklanan kart
   öne/ortaya gelir. Pozisyonlar sabit data-index'e göre değil, aktif
   karta göre (i - activeIndex) DİNAMİK olarak hesaplanıp her kartın
   --offset CSS değişkenine yazılır — böylece hangi kart aktif olursa
   olsun her zaman merkeze gelir, diğerleri ondan doğru offsetle kayar
   (önceden "ortadaki" kart sabit merkez pozisyonda kalıp aktif karta
   görünmez şekilde üst üste biniyordu). Noktalı navigasyon kaldırıldı,
   sadece kartlara tıklayarak geçiş yapılıyor. */
(function () {
  document.querySelectorAll('.cause-stack').forEach((stack) => {
    const cards = Array.prototype.slice.call(stack.querySelectorAll('.cause-stack-card'));
    const total = cards.length;
    if (!total) return;

    /* Sonsuz döngü: i ile activeIndex arasındaki en kısa (sarmalı) mesafe
       offset olarak kullanılır, böylece dizinin başı/sonu birbirine bağlanır. */
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

/* ── Veri sahneleri (Global Isınma / Okyanusların Isınması / Orman Yangınları) ──
   Üç sahne aynı motoru paylaşıyor. Sahne ekrandayken kaydırma başına (rAF ile
   kısılmış) bir kez, metni okuma çizgisine en yakın adım aktif sayılıyor ve
   sahnenin görseli o adıma göre güncelleniyor. Okuma çizgisi geniş ekranda
   menünün altında kalan alanın ortası; mobilde yapışık görselin altında kalan
   alanın ortası, çünkü adımlar orada okunuyor. Şeritlerin açılma hızı kendi
   denetleyicisinde (initStripesScene) tanımlı.
   Grafikler düz HTML: veriden oran hesaplanıp CSS değişkeni olarak yazılıyor,
   böylece her genişlikte 2px boşluk ve 4px köşe aynı kalıyor. */
(function () {
  const scenes = Array.prototype.slice.call(document.querySelectorAll('.ik-scene[data-scene]'));
  if (!scenes.length) return;

  /* OGM Ormancılık İstatistikleri 2024, tablo 2.11 "Orman yangınları, 1988-2024"
     (yayın 26.09.2025): https://www.ogm.gov.tr/tr/e-kutuphane/resmi-istatistikler
     (erişim 2026-09-13). Satır: [yıl, yangın sayısı, yanan alan (hektar)]. */
  const FOREST_FIRES = [
    [1988, 1372, 18210], [1989, 1633, 13099], [1990, 1750, 13742], [1991, 1481, 8081],
    [1992, 2117, 12232], [1993, 2545, 15393], [1994, 3239, 30828], [1995, 1770, 7676],
    [1996, 1645, 14922], [1997, 1339, 6317], [1998, 1932, 6764], [1999, 2075, 5804],
    [2000, 2353, 26353], [2001, 2631, 7394], [2002, 1471, 8514], [2003, 2177, 6644],
    [2004, 1762, 4876.2], [2005, 1530, 2821], [2006, 2227, 7761.6], [2007, 2829, 11664.4],
    [2008, 2135, 29749], [2009, 1793, 4679], [2010, 1861, 3317], [2011, 1954, 3612],
    [2012, 2450, 10454], [2013, 3755, 11456], [2014, 2149, 3117], [2015, 2150, 3219],
    [2016, 3188, 9156], [2017, 2411, 11993], [2018, 2167, 5644], [2019, 2688, 11332],
    [2020, 3399, 20971], [2021, 2793, 139503], [2022, 2160, 12799], [2023, 2579, 15520],
    [2024, 3797, 27485]
  ];

  /* Aynı tablonun 2024 satırındaki çıkış nedenleri, tablodaki sütun sırasıyla.
     Renkler sabit kategorik sırayı izliyor; nedeni bilinmeyen yangınlar bir
     kimlik taşımadığı için kategorik renk değil nötr gri alıyor. */
  const FIRE_CAUSES_2024 = [
    { label: 'Kasıt', count: 127, hectares: 223, color: 'var(--data-series-1)' },
    { label: 'İhmal ve kaza', count: 1860, hectares: 19906, color: 'var(--data-series-2)' },
    { label: 'Doğal', count: 726, hectares: 734, color: 'var(--data-series-3)' },
    { label: 'Bilinmeyen', count: 1084, hectares: 6622, color: 'var(--chart-context)' }
  ];

  // Yangın başına alanın karşılaştırma dönemi: sayfanın önceki sürümündeki
  // EFFIS rakamının (3,73 ha) dönemi; OGM verisiyle de aynı sonucu veriyor.
  const PER_FIRE_REFERENCE = [2007, 2016];
  const BASELINE_YEARS = [1951, 1980];

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // style.css'teki geniş sahne düzeniyle birebir aynı koşul.
  const wideLayout = window.matchMedia('(min-width: 992px), (orientation: landscape) and (max-height: 600px) and (min-width: 640px)');

  const formatNumber = (value, decimals = 0) => value.toLocaleString('tr-TR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  const formatSigned = (value, decimals) => `${value > 0 ? '+' : value < 0 ? '−' : ''}${formatNumber(Math.abs(value), decimals)}`;
  const formatPercent = (share) => `%${formatNumber(Math.round(share * 100))}`;

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  let headerOffset = 0;

  // Yapışık görseller sabit üst menünün altında duruyor. Menü sitenin
  // şablonundan geldiği için yüksekliği ölçülüyor; menü sabit değilse 0.
  function syncHeaderOffset() {
    const navbar = document.querySelector('.navbar');
    headerOffset = navbar && getComputedStyle(navbar).position === 'fixed'
      ? Math.round(navbar.getBoundingClientRect().bottom)
      : 0;
    document.documentElement.style.setProperty('--ik-header-offset', `${headerOffset}px`);
  }

  // Araç ipucu yalnızca fare ve kalemle: dokunmatikte parmak sayfayı kaydırırken
  // sürekli açılıp kapanırdı. Gösterdiği her değer tablo ikizinde de var.
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
    target.addEventListener('pointerleave', () => { tip.hidden = true; });
  }

  // Her grafiğin tablo ikizi: renk ve yükseklikle okunan değerlerin sayısal hâli.
  // Pencere panelinin kendisi olarak dönüyor; düğmesini ve penceresini "Ek
  // içerik pencereleri" modülü data-reveal-* değerlerinden kuruyor.
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

  /* ── Global Isınma: yıl yıl açılan ısınma şeritleri ── */
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

    // Lejant dikişlerle aynı 11 adımı gösteriyor; uçlar serinin en büyük
    // mutlak sapması, orta adım baz dönem ortalaması.
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
      element('span', '', `${formatSigned(anomalyStripes.bound, 1)} °C`)
    );
    legend.append(ramp, ticks);

    let shownYear = null;

    attachTooltip(frame, stripes, (event) => {
      const rect = stripes.getBoundingClientRect();
      const index = Math.min(years - 1, Math.max(0, Math.floor(((event.clientX - rect.left) / rect.width) * years)));
      if (shownYear === null || GISTEMP_FIRST_YEAR + index > shownYear) return null;
      return { title: String(GISTEMP_FIRST_YEAR + index), detail: `${formatSigned(GISTEMP_ANNUAL[index], 2)} °C`, top: stripes.offsetTop };
    });

    scene.querySelector('.ik-reveal').prepend(dataTable({
      id: 'global-isinma-tablo',
      label: 'Veri tablosu',
      title: `Yıllık küresel sıcaklık sapması, ${GISTEMP_FIRST_YEAR}-${lastYear}`,
      meta: '1951-1980 ortalamasına göre, °C · NASA GISS GISTEMP v4',
      caption: 'NASA GISTEMP v4: yıllık küresel sıcaklık sapması, 1951-1980 ortalamasına göre (°C)',
      head: ['Yıl', 'Sapma (°C)'],
      rows: GISTEMP_ANNUAL.map((value, index) => [String(GISTEMP_FIRST_YEAR + index), formatSigned(value, 2)])
    }));

    /* Hız: panel ekranda ilk kez tam görününce şeritler kısa bir geçişle
       INTRO_YEAR'a kadar açılıyor. Sonra yıl kaydırmaya doğrusal bağlı: panelin
       tam göründüğü konumda INTRO_YEAR, son adımın (Türkiye'de Sıcaklık)
       aktifleştiği konumda son yıl. Konumlar her karede yeniden ölçülüyor,
       böylece yazı tipi yüklenmesi ve yeniden boyutlandırma aralığı bozmuyor. */
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
    // Motorla aynı kural: adım, önceki adımla arasındaki orta nokta okuma
    // çizgisine geldiğinde aktifleşiyor.
    const activationScroll = (index) => (documentCenter(steps[index - 1]) + documentCenter(steps[index])) / 2 - stuckReadingLine(media);

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
      // Hareket azaltılmışsa yıl kaydırmayla akmıyor: her adım, bir sonraki
      // adımın başladığı konumdaki yılı tek seferde gösteriyor.
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
      // Rekor etiketi yalnızca rekor yılın şeridi çizildiyse: çizilmemiş bir
      // şeridin üstünde etiket görünmesin.
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
      // Fontun YEAR ekseni 1979-2050 arası; öncesi erimemiş hâlde kalıyor.
      yearOutput.style.fontVariationSettings = `"YEAR" ${Math.min(2050, Math.max(1979, year))}`;
      valueOutput.textContent = `${formatSigned(GISTEMP_ANNUAL[index], 2)} °C`;
    }

    return {
      update(stepIndex) {
        activeStep = stepIndex;
        draw();
      }
    };
  }

  /* ── Okyanusların Isınması: NASA fotoğrafları arasında çapraz geçiş ── */
  function initPhotoScene(scene, steps) {
    const photos = Array.prototype.slice.call(scene.querySelectorAll('.ik-photo'));
    return {
      update(stepIndex) {
        const active = Number(steps[stepIndex].dataset.photo);
        photos.forEach((photo, index) => photo.classList.toggle('is-active', index === active));
      }
    };
  }

  /* ── Orman Yangınları: yanan alan sütunları, yangın başına alan, nedenler ── */
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

    // Eksende ilk ve son yıl ile iki ara on yıl; kalan yıllar ipucunda ve tabloda.
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
      const index = Math.min(bars.length - 1, Math.max(0, Math.floor(((event.clientX - rect.left) / rect.width) * bars.length)));
      const [year, count, hectares] = FOREST_FIRES[index];
      return {
        title: String(year),
        detail: `${formatNumber(Math.round(hectares))} ha · ${formatNumber(count)} yangın`,
        top: plot.offsetHeight * (1 - hectares / axisMax)
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
      // Etiket sütunun üstünde ortalı; grafik kenarına taşacaksa içeri kayıyor.
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
      placeLabel
    };
  }

  function buildPerFireBars(host) {
    const perFire = (rows) => rows.reduce((sum, row) => sum + row[2], 0) / rows.reduce((sum, row) => sum + row[1], 0);
    const reference = FOREST_FIRES.filter((row) => row[0] >= PER_FIRE_REFERENCE[0] && row[0] <= PER_FIRE_REFERENCE[1]);
    const latest = FOREST_FIRES[FOREST_FIRES.length - 1];
    const items = [
      { label: `${PER_FIRE_REFERENCE[0]}-${PER_FIRE_REFERENCE[1]} ortalaması`, value: perFire(reference), highlighted: false },
      { label: String(latest[0]), value: perFire([latest]), highlighted: true }
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
    const totals = FIRE_CAUSES_2024.reduce((sum, cause) => ({
      count: sum.count + cause.count,
      hectares: sum.hectares + cause.hectares
    }), { count: 0, hectares: 0 });

    [['count', 'Yangın sayısı'], ['hectares', 'Yanan alan']].forEach(([key, label]) => {
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

    // Lejant, kimliği renkten bağımsız taşıyan küçük bir tablo: her neden
    // iki çubuktaki payıyla yazılı, ince dilimlerin değeri de okunuyor.
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
        element('td', '', formatPercent(cause.hectares / totals.hectares))
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
          String(year), formatNumber(count), formatNumber(hectares, Number.isInteger(hectares) ? 0 : 1)
        ])
      }),
      dataTable({
        id: 'orman-yanginlari-nedenler',
        label: 'Çıkış nedenleri',
        title: '2024 yılında çıkış nedenlerine göre orman yangınları',
        meta: 'Yangın sayısı ve yanan alan · OGM Ormancılık İstatistikleri 2024',
        caption: 'OGM: 2024 yılında çıkış nedenlerine göre orman yangınları',
        head: ['Neden', 'Yangın sayısı', 'Yanan alan (ha)'],
        rows: FIRE_CAUSES_2024.map((cause) => [cause.label, formatNumber(cause.count), formatNumber(cause.hectares)])
      })
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
      resize: columns.placeLabel
    };
  }

  /* ── Motor ── */
  const controllers = { stripes: initStripesScene, photos: initPhotoScene, fires: initFireScene };
  const entries = [];

  function apply(entry, index) {
    if (index !== entry.activeIndex) {
      entry.steps.forEach((step, stepIndex) => step.classList.toggle('is-active', stepIndex === index));
      entry.activeIndex = index;
    }
    entry.controller.update(index);
  }

  // Görsel yapışmışken okuma çizgisinin ekrandaki yeri. Kaydırma konumu
  // hesaplayan kod (şerit hızı) bunu kullanıyor: o anlarda görsel zaten yapışık.
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

  // Metni çizgiye en yakın adım aktif: iki adımın ortası çizgiyi geçince
  // sıradakine geçiliyor. Önceki kural (adımın üst kenarı) grafiği bir adımda
  // tutarken o adımın metni çoktan ekranın üstüne kaymış oluyordu.
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

  // Geniş düzende yapışık görsel menünün altında kalan alanda dikey ortalı;
  // yükseklik sahneye göre değiştiği için her sahne kendi değerini alıyor.
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
    // .is-ready önce: canlı grafikler görünür olmadan etiketler ölçülemiyor.
    scene.classList.add('is-ready');
    const entry = {
      scene,
      steps,
      media: scene.querySelector('.ik-scene-media'),
      controller: init(scene, steps),
      visible: false,
      activeIndex: -1
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
  // Web fontları geç yüklenince etiket genişlikleri değişiyor.
  if (document.fonts) document.fonts.ready.then(relayout);
})();

/* ── Ek içerik pencereleri (tablo ikizleri, sıcaklık spirali videosu) ──
   Her .ik-reveal grubundaki paneller için grafiğin altında küçük, yan yana
   düğmeler kuruluyor; içerik tarayıcının yerel <dialog> penceresinde açılıyor.
   Böylece sayfa yerinden oynamıyor, odak pencerede tutuluyor, Esc kapatıyor
   ve kapanınca odak düğmeye dönüyor. Veri sahneleri modülü tablo panellerini
   eklediği için bu modül ondan sonra çalışmalı. <dialog> desteklenmiyorsa ya
   da JS yoksa paneller sayfada açık kalıyor. */
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
    // Lenis bu öğenin içindeki tekerlek/dokunma olaylarına karışmıyor: tablo
    // pencerenin içinde tarayıcının normal kaydırmasıyla kayıyor.
    dialog.setAttribute('data-lenis-prevent', '');
    // Kenardaki karartılmış alana tıklamak kapatıyor: olay hedefi yalnızca
    // pencerenin kendisi olduğunda tıklama içeriğin dışındadır.
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => {
      setPageScrollLocked(false);
      // Kapanan pencerede video arka planda çalmaya devam etmesin.
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
        // Video pencere açılınca kendiliğinden başlıyor (sessiz olduğu için
        // tarayıcılar izin veriyor). Tarayıcı yine de engellerse denetimler
        // görünür kalıyor ve kullanıcı oynat düğmesiyle başlatabiliyor.
        dialog.querySelectorAll('video').forEach((video) => {
          const attempt = video.play();
          if (attempt) attempt.catch(() => { video.controls = true; });
        });
      });
      toggles.appendChild(button);
    });

    group.appendChild(toggles);
    group.classList.add('is-ready');
  });
})();

/* ── Counter FX (Framer referansı: layerInView tetikli, 0'dan hedefe sayan
   istatistik değerleri) ── HTML'deki gerçek değer, JS çalışmayan tarayıcılar
   ve crawler'lar için değişmeden kalır (bkz. data-count-to ile aynı metin).
   JS varsa ve prefers-reduced-motion kapalıysa, görünüme girmeden hemen önce
   "0"a resetlenip kendi IntersectionObserver'ı ile (threshold 0.2, tek seferlik
   — tetiklendikten sonra disconnect) 2 saniyelik ease-out eğrisiyle hedefe
   sayıyor. Türkçe biçimlendirme (binlik ayracı "." ondalık ayracı ",")
   toLocaleString('tr-TR') ile yapılıyor; data-count-plus="true" pozitif
   değerlerin başına "+", data-count-percent="true" ise "%" işareti ekliyor
   (negatif değerlerde "-" işareti zaten sayının kendisinden geliyor, ayrı bir
   prefix'e gerek yok). */
(function () {
  const counters = Array.prototype.slice.call(document.querySelectorAll('[data-count-to]'));
  if (!counters.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // HTML'deki statik gerçek değer zaten doğru — animasyon için sıfırlamaya gerek yok.
    return;
  }

  function formatCount(value, decimals, plus, percent) {
    const sign = value < 0 ? '-' : (plus ? '+' : '');
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

  // Aynı istatistik grubu (ör. Vital Signs şeridi) içindeki sayaçlar hafif
  // kademeli (staggered) başlıyor — hepsi aynı anda sıçramak yerine soldan
  // sağa/yukarıdan aşağı bir "dalga" hissi veriyor.
  const groups = new Map();
  counters.forEach((el) => {
    const group = el.closest('.vital-signs-strip') || el;
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(el);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      // HTML kaynağındaki gerçek değer, element görünüme girip animasyon
      // başlayacağı ana kadar ekranda kalır (JS yoksa ya da JS'in DOM'u henüz
      // taramadığı bir crawler'da kalıcı olarak) — sıfıra sadece tam bu anda,
      // yukarı sayma animasyonunun başlangıç karesi olarak geçiyoruz.
      el.textContent = '0';
      const group = el.closest('.vital-signs-strip') || el;
      const siblings = groups.get(group) || [el];
      const index = siblings.indexOf(el);
      animateCount(el, Math.max(0, index) * 80);
      observer.unobserve(el);
    });
  }, { threshold: 0.2 });

  counters.forEach((el) => observer.observe(el));
})();

/* ── Canlı CO₂ Sayacı (NOAA Mauna Loa temel + yıllık ortalama artış hızı) ──
   Sabit bir geçmiş tarihten bugüne kadar geçen süreyi gerçek zamanlı
   hesaplayıp güncel atmosferik CO₂ seviyesini tahmin eder — sayı her saniye
   o anki gerçek tarihe göre yeniden hesaplanır, uydurma bir animasyon değildir. */
(function () {
  const valueEl = document.getElementById('co2CounterValue');
  if (!valueEl) return;

  const BASELINE_DATE = new Date('2024-01-01T00:00:00Z').getTime();
  const BASELINE_PPM = 422.8; // NOAA Mauna Loa, 2023 küresel yıllık ortalama
  const ANNUAL_GROWTH = 2.4; // ppm/yıl, son 10 yıl ortalama artış hızı
  const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;
  const COUNTER_REFRESH_MS = 1000;

  function currentEstimate() {
    const elapsedYears = (Date.now() - BASELINE_DATE) / MS_PER_YEAR;
    return BASELINE_PPM + ANNUAL_GROWTH * elapsedYears;
  }

  function render() {
    valueEl.textContent = currentEstimate().toFixed(2);
  }

  render();
  setInterval(render, COUNTER_REFRESH_MS);

  // İlk görünür olduğunda DiaTextReveal tarzı sweep'i bir kez oynat
  const counter = document.getElementById('co2Counter');
  if (counter && typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          valueEl.classList.remove('sweep-in');
          void valueEl.offsetWidth;
          valueEl.classList.add('sweep-in');
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(counter);
  }
})();

/* ── Sayfa Genel JS ── */
document.addEventListener('DOMContentLoaded', () => {
  // --- Text Rotator Logic ---
  const ROTATOR_TRANSITION_MS = 600; // CSS transition süresi ile eşzamanlı
  const ROTATOR_INTERVAL_MS = 3500;
  const rotatorWords = ["Neler oluyor?", "Sebebi ne?", "Neler olacak?", "Neler yapmalıyız?", "Neler yapılıyor?"];
  const rotatorElement = document.getElementById("hero-rotator");
  let currentWordIndex = 0;

  function animateRotator() {
    // 1. Çıkış animasyonunu tetikle
    rotatorElement.classList.remove("visible");
    rotatorElement.classList.add("exit");

    setTimeout(() => {
      // 2. Metni güncelle
      rotatorElement.textContent = rotatorWords[currentWordIndex];

      // 3. Çıkış sınıfını temizle, elementi başlangıç konumuna (aşağıya) al
      rotatorElement.classList.remove("exit");

      // DOM reflow zorunluluğu (Animasyonun tekrar tetiklenmesi için)
      void rotatorElement.offsetWidth;

      // 4. Giriş animasyonunu tetikle
      rotatorElement.classList.add("visible");

      // 5. İndeksi güncelle
      currentWordIndex = (currentWordIndex + 1) % rotatorWords.length;
    }, ROTATOR_TRANSITION_MS);
  }

  if (rotatorElement) {
    // İlk kelimeyi yükle
    animateRotator();
    // Döngüyü periyodik olarak çalıştır
    setInterval(animateRotator, ROTATOR_INTERVAL_MS);
  }
});

/* ── Lightbox: grafik görsellerine tıkla-büyüt ──
   data-lightbox-src taşıyan her düğme görseli tam ekran karartılmış bir
   katmanda açıyor; görsel yalnızca açılınca yükleniyor. Tıklanabilir <img>
   yerine düğme: klavyeyle de açılıyor. Katmana, X'e veya Esc'e basmak
   kapatıyor ve odak açan düğmeye dönüyor.
   Görsele tıklamak (dokunmak, Enter/boşluk) tıklanan noktaya yakınlaştırıyor,
   tekrar tıklamak özgün boyuta döndürüyor. Yakınken fare hareketi ya da
   parmakla sürükleme görselin görünen kısmını kaydırıyor. */
(function () {
  const triggers = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox-src]'));
  if (!triggers.length) return;

  const ZOOM_MIN = 2;
  const ZOOM_MAX = 4;
  // Bu kadar pikselden fazla sürükleme bir tıklama sayılmıyor (yakınlığı bozmasın).
  const DRAG_TOLERANCE = 6;

  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Büyütülmüş grafik');
  overlay.setAttribute('data-lenis-prevent', '');
  overlay.innerHTML = '<button type="button" class="lightbox-close" aria-label="Kapat">&times;</button><img class="lightbox-img" alt="" tabindex="0" role="button" aria-pressed="false">';
  document.body.appendChild(overlay);
  const lightboxImg = overlay.querySelector('.lightbox-img');
  const closeBtn = overlay.querySelector('.lightbox-close');
  let opener = null;
  let zoomed = false;
  let pointerStart = null;

  function setOrigin(clientX, clientY) {
    const rect = lightboxImg.getBoundingClientRect();
    // Ölçekli görselin kutusu değil, ölçeksiz yerleşim kutusu esas alınıyor.
    const baseWidth = lightboxImg.offsetWidth;
    const baseHeight = lightboxImg.offsetHeight;
    const left = rect.left + rect.width / 2 - baseWidth / 2;
    const top = rect.top + rect.height / 2 - baseHeight / 2;
    const x = Math.min(100, Math.max(0, ((clientX - left) / baseWidth) * 100));
    const y = Math.min(100, Math.max(0, ((clientY - top) / baseHeight) * 100));
    lightboxImg.style.setProperty('--zoom-x', `${x}%`);
    lightboxImg.style.setProperty('--zoom-y', `${y}%`);
  }

  function setZoom(next, clientX, clientY) {
    zoomed = next;
    if (zoomed) {
      // Küçük grafiklerde en az 2 kat; büyük görselde kendi çözünürlüğüne kadar.
      const natural = lightboxImg.naturalWidth / Math.max(1, lightboxImg.offsetWidth);
      lightboxImg.style.setProperty('--zoom-scale', String(Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, natural))));
      if (clientX !== undefined) setOrigin(clientX, clientY);
    }
    overlay.classList.toggle('is-zoomed', zoomed);
    lightboxImg.setAttribute('aria-pressed', String(zoomed));
    lightboxImg.setAttribute('aria-label', zoomed ? 'Grafiği özgün boyutuna döndür' : 'Grafiği yakınlaştır');
  }

  function open(trigger) {
    opener = trigger;
    lightboxImg.src = trigger.dataset.lightboxSrc;
    lightboxImg.alt = trigger.dataset.lightboxAlt || '';
    lightboxImg.style.setProperty('--zoom-x', '50%');
    lightboxImg.style.setProperty('--zoom-y', '50%');
    setZoom(false);
    overlay.classList.add('active');
    setPageScrollLocked(true);
    closeBtn.focus();
  }

  function close() {
    if (!overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    setZoom(false);
    setPageScrollLocked(false);
    if (opener) opener.focus();
    opener = null;
  }

  lightboxImg.addEventListener('pointerdown', (e) => {
    pointerStart = { x: e.clientX, y: e.clientY };
  });
  lightboxImg.addEventListener('pointermove', (e) => {
    if (!zoomed) return;
    // Farede imleç, dokunmatikte parmak (basılıyken) görünen kısmı taşıyor.
    if (e.pointerType !== 'mouse' && !pointerStart) return;
    setOrigin(e.clientX, e.clientY);
  });
  lightboxImg.addEventListener('pointerup', (e) => {
    const start = pointerStart;
    pointerStart = null;
    if (!start || Math.hypot(e.clientX - start.x, e.clientY - start.y) > DRAG_TOLERANCE) return;
    setZoom(!zoomed, e.clientX, e.clientY);
  });
  lightboxImg.addEventListener('pointercancel', () => { pointerStart = null; });
  lightboxImg.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    const rect = lightboxImg.getBoundingClientRect();
    setZoom(!zoomed, rect.left + rect.width / 2, rect.top + rect.height / 2);
  });

  triggers.forEach((trigger) => trigger.addEventListener('click', () => open(trigger)));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    // Odak katmandaki iki öğe (kapat, görsel) arasında dönüyor; arkadaki sayfaya kaçmıyor.
    if (e.key === 'Tab') {
      e.preventDefault();
      (document.activeElement === closeBtn ? lightboxImg : closeBtn).focus();
    }
  });
})();

/* ── KARŞILAŞABİLECEĞİMİZ GELECEK: "CardShowcase" (Framer referansı) ──
   Aktif kart flex-basis ile genişleyip açıklamasını gösterirken diğerleri
   ince şeride daralıyor (CSS: .active). Bir ilerleme çubuğu dolup otomatik
   bir sonraki karta geçiyor; karta tıklamak o karta atlıyor. Zamanlayıcı
   fare üzerideyken veya bölüm ekran dışındayken duraklıyor (biriken süre
   sayacı kullanıldığı için duraklama sonrası ani atlama olmuyor). */
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
  wrap.addEventListener('mouseenter', () => { hoverPaused = true; });
  wrap.addEventListener('mouseleave', () => { hoverPaused = false; });

  if (typeof IntersectionObserver !== 'undefined') {
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => { viewPaused = !entry.isIntersecting; });
    }, { threshold: 0.2 }).observe(wrap);
  } else {
    viewPaused = false;
  }

  setActive(0, false);
  requestAnimationFrame(tick);
})();

/* ── NELER YAPILIYOR: Kronoloji (Zaman Tüneli) ──
   Omurga hattı üzerindeki dolgu (spine-fill), kullanıcının .timeline
   içinde scroll ile ne kadar ilerlediğini gösterir. Her kilometre taşı
   görünür olduğunda is-in-view sınıfıyla kalıcı olarak belirir, işaretçisi
   "yanar" — geri scroll'da sönmez (site genelindeki "bir kere oyna, geri
   sarma" giriş animasyonu deseniyle tutarlı). */
(function () {
  const timeline = document.getElementById('progressTimeline');
  const spineFill = document.getElementById('timelineSpineFill');
  if (!timeline || !spineFill) return;

  const items = Array.prototype.slice.call(timeline.querySelectorAll('.timeline-item'));

  function updateSpineFill() {
    // Dolgunun ucu hep ekranın ortasında: çizgi kaydırmayla birebir ilerliyor.
    // Önceki formül payda olarak "yükseklik + ekranın yarısı" kullandığı için
    // dolgu kaydırmanın gerisinde kalıyordu.
    const rect = timeline.getBoundingClientRect();
    const viewportMid = window.innerHeight * 0.5;
    const progress = Math.max(0, Math.min(1, (viewportMid - rect.top) / rect.height));
    // Dolgu hep tam boy; yalnızca görünen kısmı açılıyor. Böylece renk geçişi
    // omurga boyunca sabit kalıyor, yükseklikle birlikte sıkışmıyor.
    spineFill.style.setProperty('--spine-progress', progress.toFixed(3));
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateSpineFill();
      ticking = false;
    });
  }, { passive: true });

  updateSpineFill();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in-view');
      }
    });
  }, { threshold: 0.35 });

  items.forEach((item) => observer.observe(item));
})();

/* ── NELER YAPILIYOR: Kart etkileşimleri (React "Timeline3D" referansı) ──
   Karta veya işaretçisine tıklamak açıklamayı sabitliyor (dokunmatik için de
   çalışır); masaüstünde hover aynı .active görünümünü CSS üzerinden zaten
   tetikliyor. Fareyle hafif 3B eğim efekti (referanstaki mousePosition +
   rotateX/rotateY mantığının vanilla JS karşılığı) sadece hover destekleyen
   cihazlarda ve rAF ile throttle edilerek çalışıyor. */
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

/* ── ADIM KARUSELİ (Neler Yapmalıyız?) ──
   Kullanıcının verdiği "ScrollReelTestimonials" React bileşeninin vanilla JS
   portu: ortadaki sütun gerçek fotoğraf + bulanık dolgu hücrelerinden oluşan
   bir "makara", yan sütunlar ters yönde kayarak counter-rotate efekti
   veriyor. Adım değişince eski metin bloğu kısa bir "exit" ile kaybolur,
   yeni başlık karakter karakter (staggered) yükselerek belirir. */
(function () {
  const CELL = 130;
  const GAP = 10;
  const STEP = 3 * (CELL + GAP);
  const EXIT_MS = 220;
  const SLIDE_MS = 800;
  const CHAR_STAGGER_MS = 6;

  /* Rakamların kaynakları (erişim 2026-09-15): termostat, Energy Saving Trust;
     trende/otomobile/iç hat uçuşuna göre salım (35 / 170 / 246 g CO₂e/km) ve
     gıda başına salım, Our World in Data (UK DESNZ; Poore ve Nemecek 2018);
     damlayan musluk, US EPA WaterSense; karbon fiyatı, Karbon Fiyatlandırması
     Üst Düzey Komisyonu (2017); AB sınırda karbon düzenlemesi kesin dönemi
     1 Ocak 2026; kentleşme, BM DESA (2018). */
  const individualSteps = [
    { photo: 'assets/image/wikipedia/enerji-tasarrufu.jpg', title: 'Enerji Tasarrufu',
      desc: 'LED ampuller aynı ışığı eski ampullerden çok daha az elektrikle verir. Kapalı sandığımız ama fişte duran cihazlar da bekleme modunda elektrik çekmeye devam eder. Evde harcanan enerji azaldıkça onu üretmek için yakılan yakıt da azalır.',
      examples: ['Çamaşırı 30°C\'de ve makine doluyken yıka', 'Kışın termostatı 1°C düşürmek ısınma faturasını yaklaşık %4-5 azaltır', 'Kullanmadığın cihazları prizden çek'] },
    { photo: 'assets/image/wikipedia/ulasim-tercihleri.jpg', title: 'Ulaşım Tercihleri',
      desc: 'Ulaşım, kişisel karbon ayak izinin en büyük kalemlerinden biri. Trende kilometre başına düşen salım benzinli bir otomobilin yaklaşık beşte biri, iç hat uçuşunun ise yedide biri kadar. Kısa yollarda yürümek ya da bisiklet, uzun yollarda tren ve otobüs seçmek fark yaratır.',
      examples: ['3 km altındaki yolları yürüyerek ya da bisikletle git', 'Şehir içinde otomobil yerine toplu taşımayı dene', 'Yakın şehirlere uçak yerine tren ya da otobüsle git'] },
    { photo: 'assets/image/wikipedia/beslenme-aliskanliklari.jpg', title: 'Beslenme Alışkanlıkları',
      desc: 'Gıda üretimi, dünyadaki sera gazı salımının yaklaşık dörtte birinden sorumlu. En büyük fark tabakta ne olduğundan gelir: 1 kg sığır eti üretmek yaklaşık 60 kg sera gazı çıkarırken 1 kg tavuk 6 kg, 1 kg bezelye ise yalnızca 1 kg çıkarır.',
      examples: ['Haftada birkaç öğünde kırmızı et yerine baklagil ya da tavuk seç', 'Taşımanın payı çoğu gıdada %10\'dan az: ne yediğin, nereden geldiğinden daha önemli', 'Alışverişini planla, artan yemeği değerlendir'] },
    { photo: 'assets/image/wikipedia/bilincli-tuketim.jpg', title: 'Bilinçli Tüketim',
      desc: 'Aldığımız her ürünün üretimi enerji ve hammadde harcar. Daha az ama daha uzun ömürlü ürünler almak, eşyaları onarmak ve ikinci el kullanmak hem çöpü hem de üretimden gelen salımı azaltır.',
      examples: ['Almadan önce "gerçekten ihtiyacım var mı?" diye sor', 'Bozulan elektroniği atmadan önce tamir ettirmeyi dene', 'Tek kullanımlık plastik yerine tekrar kullanılabilir çanta ve şişe kullan'] },
    { photo: 'assets/image/wikipedia/dogayla-birlikte-yasamak.jpg', title: 'Doğayla Birlikte Yaşamak',
      desc: 'Ağaçlar ve yeşil alanlar havadaki karbonu tutar, şehirleri serinletir ve canlılara yaşam alanı sağlar. Balkonda bitki yetiştirmek ya da bir ağaçlandırma çalışmasına katılmak küçük görünse de, birçok insan yaptığında etkisi büyür.',
      examples: ['Mutfak atıklarını kompost yapıp toprağa geri kazandır', 'Yerel ağaçlandırma ve temizlik etkinliklerine gönüllü katıl', 'Damlayan musluğu tamir et: saniyede bir damla, yılda 11.000 litreden fazla su demek'] },
    { photo: 'assets/image/wikipedia/savunuculuk-ve-farkindalik.jpg', title: 'Savunuculuk ve Farkındalık',
      desc: 'Tek başına attığımız adımlar önemli, ama en büyük değişim birlikte ses çıkardığımızda olur. Çevrendekilerle konuşmak, belediyenin ve şirketlerin iklim planlarını sormak sistemin değişmesini hızlandırır.',
      examples: ['Yaşadığın şehrin bir iklim eylem planı olup olmadığını öğren', 'Okulunda ya da iş yerinde tasarruf ve geri dönüşüm önerileri sun', 'Güvenilir bilimsel kaynaklara dayanan içerikleri paylaş'] }
  ];

  const societalSteps = [
    { photo: 'assets/image/un/UN7436150.jpg', title: 'Yenilenebilir Enerjiye Geçiş',
      desc: 'Elektriği kömür ve doğal gaz yerine güneşten, rüzgârdan ve sudan üretmek, salımları azaltmanın en etkili yollarından biri. Devletlerin ve şirketlerin yatırımlarını bu kaynaklara yönlendirmesi dönüşümü hızlandırır.',
      examples: ['Çatı üstü güneş panellerinin desteklenmesi', 'Fosil yakıtlara verilen desteklerin kademeli olarak kaldırılması', 'Güneş ve rüzgâr elektriğini depolayacak bataryalara yatırım yapılması'] },
    { photo: 'assets/image/wikipedia/karbon-fiyatlandirmasi.png', title: 'Karbon Fiyatlandırması',
      desc: 'Havaya salınan her ton karbona bir fiyat koymak "kirleten öder" demektir. Kirletmek pahalılaştıkça temiz üretim daha cazip hâle gelir.',
      examples: ['Uzmanlara göre Paris hedefleri için 2030\'a kadar ton başına 50-100 dolarlık bir karbon fiyatı gerekiyor', 'Toplanan gelir temiz enerjiye ve toplu taşımaya harcanabilir', 'AB, 2026\'dan itibaren çelik, çimento ve alüminyum gibi ürünlerin ithalatında karbon bedeli almaya başladı'] },
    { photo: 'assets/image/wikipedia/ormanlarin-korunmasi.jpg', title: 'Ormanların Korunması',
      desc: 'Ormanlar dünyanın en büyük doğal karbon depolarından. Var olan ormanları korumak ve yeni ağaçlar dikmek, havadaki karbonu azaltmanın en doğal yolu.',
      examples: ['Orman kesilerek üretilen ürünlerin ticaretinin sınırlanması', 'Ormanda yaşayan yerel halkların arazi haklarının korunması', 'Ormanlarını koruyan ülkelere mali destek sağlanması (REDD+)'] },
    { photo: 'assets/image/wikipedia/uluslararasi-isbirligi.jpg', title: 'Uluslararası İşbirliği',
      desc: 'İklim krizi sınır tanımaz: bir ülkenin salımı herkesi etkiler. Paris Anlaşması gibi anlaşmalar ülkeleri ortak ve takip edilebilir hedefler etrafında buluşturur.',
      examples: ['Ülkelerin salım azaltma hedeflerini (NDC) güçlendirmesi', 'Gelişmekte olan ülkelere iklim finansmanı sağlanması', 'Temiz teknolojilerin ülkeler arasında paylaşılması'] },
    { photo: 'assets/image/wikipedia/sanayi-donusumu.jpg', title: 'Sanayi Dönüşümü',
      desc: 'Çimento, çelik ve kimya fabrikaları çok yüksek ısıya ihtiyaç duyar ve bu ısıyı elektrikle üretmek her zaman kolay değildir. Yeşil hidrojen ve karbon yakalama gibi teknolojiler bu sektörlerin salımını azaltmanın başlıca yolları.',
      examples: ['Kamu ihalelerinde düşük karbonlu çelik ve çimentonun tercih edilmesi', 'Yeşil hidrojen altyapısına yatırım yapılması', 'Fabrika salımlarının düzenli olarak ölçülüp denetlenmesi'] },
    { photo: 'assets/image/wikipedia/surdurulebilir-sehirler.jpg', title: 'Sürdürülebilir Şehirler',
      desc: '2050\'de dünya nüfusunun %68\'inin şehirlerde yaşayacağı öngörülüyor. Toplu taşıması güçlü, yürünebilir ve yeşil alanı bol şehirler hem salımı azaltır hem de günlük yaşamı kolaylaştırır.',
      examples: ['Okul, market ve parkın kısa yürüme mesafesinde olduğu mahalleler', 'Eski binaların yalıtılıp enerji verimli hâle getirilmesi', 'Kent ormanları ve yeşil koridorlar'] }
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
      featured.style.backgroundImage = `url('${step.photo}')`;
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
      li.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${ex}`;
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
    prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'reel-nav-btn';
    nextBtn.setAttribute('aria-label', 'Sonraki adım');
    nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
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
        stage.innerHTML = '';
        stage.appendChild(newSlide);
        currentSlide = newSlide;
      }, EXIT_MS);
      setTimeout(() => { animating = false; }, SLIDE_MS);
    }

    prevBtn.addEventListener('click', () => paginate(-1));
    nextBtn.addEventListener('click', () => paginate(1));
    container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); paginate(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); paginate(-1); }
    });

    // Sütunlar mount anında (transition tanımlanmadan önce) hemen doğru
    // konuma yerleşsin diye ilk yerleşim transition'sız yapılıyor.
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

  // Diğer grafik/animasyon bileşenlerinde kullanılan lazy-init deseniyle
  // tutarlı: reel, viewport'a girene kadar inşa edilmiyor — hem gereksiz DOM
  // maliyetinden kaçınıyor hem de ilk başlığın karakter-karakter yükseliş
  // animasyonunun sayfa yüklenir yüklenmez (ekran dışındayken) değil,
  // kullanıcı gerçekten gördüğünde oynamasını sağlıyor.
  const reelConfigs = [
    { id: 'individualReel', steps: individualSteps },
    { id: 'societalReel', steps: societalSteps }
  ];

  reelConfigs.forEach(({ id, steps }) => {
    const el = document.getElementById(id);
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          createStepReel(el, steps);
          observer.disconnect();
        }
      });
    }, { threshold: 0.15 });
    observer.observe(el);
  });
})();

document.addEventListener('DOMContentLoaded', () => {
  const SCROLL_TO_TOP_THRESHOLD = 300;

  // AOS Initialize
  AOS.init({
    duration: 800,
    offset: 100,
    once: true,
    easing: 'ease-out-cubic'
  });

  const scrollToTopButton = document.querySelector('.scroll-to-top');
  let isScrolling = false;

  function checkScroll() {
    const currentScroll = window.scrollY;
    if (scrollToTopButton) {
      scrollToTopButton.classList.toggle('show', currentScroll > SCROLL_TO_TOP_THRESHOLD);
    }
    isScrolling = false;
  }

  // Passive true ile tarayıcıya "scroll'u engellemeyeceğim" garantisi veriyoruz.
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(checkScroll);
      isScrolling = true;
    }
  }, { passive: true });
});

/* ── Kaynaklar: Bento Grid ──
   Fare hareketiyle hafif 3D tilt (--rx/--ry), scroll'da kademeli giriş ve
   kart özelliğine göre (counter/timeline/chart) tek seferlik animasyon. */
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
    // HTML'deki gerçek değer JS'siz/crawler'da kalıcı kalır; hareket
    // kısıtlanmışsa da dokunmadan bırakıyoruz.
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

  const observer = new IntersectionObserver((entries) => {
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
  }, { threshold: 0.25 });

  cards.forEach((card) => observer.observe(card));
})();

/* ── Neler Yapmalıyız? Dynamic Heading ──
   "Neler Yapmalıyız?" başlığı, bölüm görünür olduğunda en popüler 5 dilde hızla
   (300ms aralıkla) belirip kaybolur, son adımda Türkçe'de durur ve bir daha
   değişmez — referans DynamicText bileşenindeki "son indekste dur" mantığı. */
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
    { text: 'Neler Yapmalıyız?', dir: 'ltr' }
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

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        start();
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(section);
})();

/* ── Kahraman videosu: hareket kısıtlıyken hiç oynatma (poster kalır). ──
   Tek bir play() çağrısı yeterli olmayabiliyor: tarayıcının otomatik
   oynatma politikası ilk çağrıyı (sayfa henüz tam hazır değilken, veya
   video verisi henüz gelmemişken) reddedebiliyor ve .catch(() => {}) bu
   reddi sessizce yutup video kalıcı olarak poster karede donuk kalıyordu.
   Aşağıdaki üç yeniden deneme yolu birbirinden bağımsız, herhangi biri
   başarılı olduğunda diğerleri zaten gereksiz kalır (play() zaten
   oynatılan bir videoda no-op'tur): (1) hemen, (2) video verisi gelince
   (canplay), (3) kullanıcı sayfayla ilk etkileşime geçtiğinde — tarayıcı
   politikaları bir kullanıcı hareketinden sonra oynatmaya neredeyse her
   zaman izin verir. */
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

/* ── Okuma ilerleme çubuğu + Başa dön butonu + Bölüm nokta menüsü ── */
(function () {
  const fill = document.getElementById('readingProgressFill');
  const bar = document.getElementById('readingProgress');
  const backToTop = document.getElementById('backToTop');
  const dotLinks = Array.prototype.slice.call(document.querySelectorAll('#sectionDotnav [data-section]'));
  const sections = dotLinks
    .map((a) => document.getElementById(a.dataset.section))
    .filter(Boolean);

  let ticking = false;

  function update() {
    ticking = false;
    const doc = document.documentElement;
    const scrollTop = window.scrollY;
    const scrollable = doc.scrollHeight - doc.clientHeight;
    const pct = scrollable > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollable) * 100)) : 0;
    if (fill) fill.style.width = pct.toFixed(1) + '%';
    if (bar) bar.setAttribute('aria-valuenow', String(Math.round(pct)));

    if (backToTop) {
      const shouldShow = scrollTop > window.innerHeight * 0.8;
      if (shouldShow) {
        backToTop.hidden = false;
        requestAnimationFrame(() => backToTop.classList.add('is-visible'));
      } else {
        backToTop.classList.remove('is-visible');
        backToTop.hidden = true;
      }
    }

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
        // Görsel uzama ekran okuyucuya aktarılmıyor; bulunulan bölüm ayrıca bildiriliyor.
        if (isActive) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }
  }

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });
  }

  update();
})();

/* ── Site tek sayfa: hiçbir tıklama adres çubuğunu değiştirmesin ──
   Önceden iki ayrı mekanizma URL'yi yazıyordu: (1) Sebepler sekmeleri
   ?sekme=ulasim sorgu parametresine, (2) dot-nav/skip-link gibi href="#id"
   bağlantıları native tarayıcı davranışıyla #id'ye. İkisi bağımsız çalışıp
   birbirini temizlemediğinden, bir sekmeye tıklayıp sonra bir bölüme
   kaydırıldığında ?sekme=ormansizlasma#resources-section gibi tutarsız,
   paylaşılması anlamsız linkler birikiyordu. Kullanıcı isteği: tek sayfa
   için tek, sabit link — hiçbiri adres çubuğunu değiştirmesin.
   Sekme senkronizasyonu (1) tamamen kaldırıldı. (2) için: tüm href="#id"
   bağlantıları yakalanıp preventDefault ile native atlama engelleniyor,
   kaydırma JS'e devrediliyor (Lenis varsa onunla — sitenin geri kalanıyla
   aynı akıcı his — yoksa native smooth scroll). Native çapa davranışının
   kaybolan tek gerçek faydası olan "hedefe odak taşıma" (klavye/ekran
   okuyucu için, özellikle skip-link'te önemli) manuel olarak korunuyor. */
(function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function scrollToTarget(target) {
    if (window.lenis && typeof window.lenis.scrollTo === 'function') {
      window.lenis.scrollTo(target, { immediate: reducedMotion });
    } else {
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    }

    // Section/main gibi doğal olarak odaklanamayan hedefler için geçici
    // tabindex — native "#id" atlamasının odak taşıma tarafını taklit eder.
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
    if (!id) return; // href="#" (ör. navbar dropdown-toggle) — dokunma
    const target = document.getElementById(id);
    if (!target) return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToTarget(target);
    });
  });
})();

/* ── SDG dönen Dünya videosu: prefers-reduced-motion açıksa hiç oynatma,
   ilk kareyle sabit dursun. ── */
(function () {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const earth = document.querySelector('.sdg-center-gif');
  if (earth) earth.pause();
})();

/* ── İklim Krizinin Sebepleri sekmeleri: ARIA Authoring Practices'e uygun
   ok tuşu gezinmesi (role="tablist"/"tab" kullanan tek grup bu). Bootstrap'ın
   kendi Tab bileşeni tıklama/Enter'ı zaten yönetiyor; burada sadece
   Sol/Sağ/Home/End ile odağı ve seçimi taşıyoruz. ── */
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
    // Bootstrap'ın kendi Tab API'sini tetikleyerek panel içeriğini değiştir.
    if (window.bootstrap && window.bootstrap.Tab) {
      window.bootstrap.Tab.getOrCreateInstance(nextTab).show();
    } else {
      nextTab.click();
    }
  });

  // Dar ekranda sekme çubuğu yatay kayıyor; seçilen sekme yarım kalmasın diye
  // çubuğun ortasına alınıyor. scrollIntoView sayfayı dikeyde de oynatacağı
  // için yalnızca çubuğun kendi yatay kaydırması kullanılıyor.
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revealTab(tab) {
    const listRect = tablist.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    const offset = (tabRect.left - listRect.left) - (listRect.width - tabRect.width) / 2;
    tablist.scrollTo({
      left: Math.max(0, tablist.scrollLeft + offset),
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('shown.bs.tab', () => revealTab(tab));
  });
})();


/* ── GÖRSEL KÜNYESİ ──
   CC BY ve CC BY-SA lisansları fotoğrafçının adının ve lisansın belirtilmesini
   zorunlu kılıyor; Kaynakça'daki genel kaynak bağlantısı bunu karşılamıyor.
   Künyeyi görselin üstündeki küçük bir düğmeye bağladık: neden kartlarında
   tıklama zaten kartlar arasında geçiş yaptığı için fotoğrafın kendisini
   tıklanabilir yapmak mevcut etkileşimi bozardı. Düğme her görselde aynı yerde
   duruyor, bu yüzden keşfedilebilir ve dokunmatikte de çalışıyor. */
(function () {
  const CREDITS = {
    "assets/image/wikipedia/garzweiler-acik-maden-ocagi.jpg": {
      "title": "Garzweiler Açık Maden Ocağı",
      "author": "Martin Falbisoner",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Garzweiler_surface_mine%2C_October_2018%2C_-02.jpg"
    },
    "assets/image/wikipedia/komur-termik-santrali.jpg": {
      "title": "Çin Termik Santralleri / CO₂ göstergesi",
      "author": "Tobixen",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:ChineseCoalPower_opt.jpg"
    },
    "assets/image/wikipedia/nijer-deltasi.jpg": {
      "title": "Nijer Deltası",
      "author": "Luka Tomac / Friends of the Earth International",
      "license": "CC BY-SA 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Kegbara-_dere_community_oil_spill%2C_Ogoniland%2C_Nigeria_(22707273700).jpg"
    },
    "assets/image/wikipedia/avustralya-lng-tesisleri.jpg": {
      "title": "Avustralya LNG Tesisleri",
      "author": "Ken Hodge",
      "license": "CC BY 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:LNG_Carrier_Excel_at_Wickham_Point_in_April_2016_(25732343124).jpg"
    },
    "assets/image/wikipedia/hindistan-komur-madenleri.jpg": {
      "title": "Hindistan Kömür Madenleri",
      "author": "Rosehubwiki, Kuber Patel",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:NCL_Singrauli_Nigahi_Coal_Mine_at_Night.jpg"
    },
    "assets/image/wikipedia/bati-teksas-permian-havzasi.png": {
      "title": "Batı Teksas Permian Havzası",
      "author": "Emmanuel Roquette",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:PermianBasin-02.png"
    },
    "assets/image/wikipedia/amazon-yagmur-ormanlari.jpg": {
      "title": "Amazon Yağmur Ormanları",
      "author": "NASA (Jesse Allen, Robert Simmon)",
      "license": "Public domain",
      "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Licensing",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Fires_and_Deforestation_on_the_Amazon_Frontier%2C_Rondonia%2C_Brazil_-_August_12%2C_2007.jpg"
    },
    "assets/image/wikipedia/borneo-adasi.jpg": {
      "title": "Borneo Adası",
      "author": "T. R. Shankar Raman",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:OilPalm_DSC_9183.JPG"
    },
    "assets/image/wikipedia/kongo-havzasi.jpg": {
      "title": "Kongo Havzası",
      "author": "Photokadaffi",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Dans_la_for%C3%AAt_d'Eseka.jpg"
    },
    "assets/image/wikipedia/endonezya-turbaliklari.jpg": {
      "title": "Endonezya Turbalıkları",
      "author": "Muhammad Pasya Ramadhan",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Peatland_Forest_fires.jpg"
    },
    "assets/image/wikipedia/cerrado-savanalari-brezilya.jpg": {
      "title": "Cerrado Savanaları",
      "author": "Rafael Ribeiro",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Pasto_do_Cerrado_Mineiro_ao_p%C3%B4r_do_sol.jpg"
    },
    "assets/image/wikipedia/ruhr-bolgesi-celik-tesisleri.jpg": {
      "title": "Ruhr Bölgesi Çelik Tesisleri",
      "author": "Andreas Schiblon",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Hochofen-8---DU-Hubertusstrasse.jpg"
    },
    "assets/image/wikipedia/cin-aluminyum-tesisleri.jpg": {
      "title": "Çin Alüminyum Tesisleri",
      "author": "Bilinmeyen fotoğrafçı",
      "license": "CC BY 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/3.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Aluminium-4.jpg"
    },
    "assets/image/wikipedia/hindistan-tugla-ocaklari.jpg": {
      "title": "Hindistan Tuğla Ocakları",
      "author": "McKay Savage",
      "license": "CC BY 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:India_-_Sights_%26_Culture_-_Rural_Brick_Making_Kiln_03_(4040765932).jpg"
    },
    "assets/image/wikipedia/brezilya-sigir-ciftlikleri.jpg": {
      "title": "Brezilya Sığır Çiftlikleri",
      "author": "Christopher Borges",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Tocando_a_Boiada.jpg"
    },
    "assets/image/wikipedia/guneydogu-asya-pirinc-tarlalari.jpg": {
      "title": "Güneydoğu Asya Pirinç Tarlaları",
      "author": "Quangpraha",
      "license": "CC0",
      "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Terraced_paddy_fields%2C_Sonla%2C_Vietnam.jpg"
    },
    "assets/image/wikipedia/avrupa-yogun-tarim-alanlari.jpg": {
      "title": "Avrupa Yoğun Tarım Alanları",
      "author": "Axel Hartmann",
      "license": "CC BY-SA 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Agricultural_landscape_Mergelland.jpg"
    },
    "assets/image/wikipedia/meksika-avokado-bahceleri.png": {
      "title": "Meksika Avokado Bahçeleri",
      "author": "El Comandante",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Municipios_michoacanos_productores_de_aguacate_en_2004.svg"
    },
    "assets/image/wikipedia/abd-buyuk-ovalarda-mono-kultur.jpg": {
      "title": "ABD Büyük Ovalarda Mono-Kültür",
      "author": "formulanone",
      "license": "CC BY-SA 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Concentric_Circle_Farmland_(50902375916).jpg"
    },
    "assets/image/wikipedia/hollanda-yogun-hayvancilik-tesisleri.jpg": {
      "title": "Hollanda Yoğun Hayvancılık Tesisleri",
      "author": "Agnes Monkelbaan",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Melkveebedrijf_kattewaardweg_Kampen_02-03-2021_(actm.)_01.jpg"
    },
    "assets/image/wikipedia/los-angeles-otoyol-agi.jpg": {
      "title": "Los Angeles Otoyol Ağı",
      "author": "Bilinmiyor",
      "license": "Public domain",
      "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Licensing",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Los_Angeles_Freeway_Interchange.jpg"
    },
    "assets/image/wikipedia/kuresel-konteyner-gemiciligi.jpg": {
      "title": "Küresel Konteyner Gemiciliği",
      "author": "Martin Dörsch",
      "license": "CC0",
      "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Container_ship_in_Koper_2013.jpg"
    },
    "assets/image/wikipedia/atlantik-hava-trafigi.jpg": {
      "title": "Atlantik Hava Trafiği",
      "author": "AlixSaz",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Contrails_in_the_sky_at_sunset.jpg"
    },
    "assets/image/wikipedia/dubai-havalimani.jpg": {
      "title": "Dubai Havalimanı",
      "author": "Andy Mabbett",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Dubai_International_Airport_-_2024-10-24_-_Andy_Mabbett_-_51.jpg"
    },
    "assets/image/wikipedia/suveys-panama-kanali.jpg": {
      "title": "Süveyş ve Panama Kanalı",
      "author": "NASA",
      "license": "Public domain",
      "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Licensing",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Suez_Canal%2C_Port_Said_-_ISS.jpg"
    },
    "assets/image/pexels/endonezya-iki-tekerlekli-tasit.jpg": {
      "title": "Endonezya İki Tekerlekli Taşıt Sorunu",
      "author": "Ary Wibowo",
      "license": "Pexels License",
      "licenseUrl": "https://www.pexels.com/license/",
      "source": "Pexels",
      "sourceUrl": "https://www.pexels.com/photo/30865547/"
    },
    "assets/image/wikipedia/enerji-tasarrufu.jpg": {
      "title": "Enerji Tasarrufu",
      "author": "NIST",
      "license": "Public domain",
      "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Licensing",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Assorted_LED_Lamps.jpg"
    },
    "assets/image/wikipedia/ulasim-tercihleri.jpg": {
      "title": "Ulaşım Tercihleri",
      "author": "Tony Webster",
      "license": "CC BY 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Holmens_Kanal_Cyclists_(15325678721).jpg"
    },
    "assets/image/wikipedia/beslenme-aliskanliklari.jpg": {
      "title": "Beslenme Alışkanlıkları",
      "author": "Rexness",
      "license": "CC BY-SA 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:InSeason_Farmer's_Market%2C_North_Melbourne_Australia_(4570521176).jpg"
    },
    "assets/image/wikipedia/bilincli-tuketim.jpg": {
      "title": "Bilinçli Tüketim",
      "author": "Tiia Monto",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Second_hand_clothes.jpg"
    },
    "assets/image/wikipedia/dogayla-birlikte-yasamak.jpg": {
      "title": "Doğayla Birlikte Yaşamak",
      "author": "Dietmar Rabich",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Vancouver_(BC%2C_Canada)%2C_Comox_Street%2C_Urban_gardening_--_2022_--_1938.jpg"
    },
    "assets/image/wikipedia/savunuculuk-ve-farkindalik.jpg": {
      "title": "Savunuculuk ve Farkındalık",
      "author": "Leonhard Lenz",
      "license": "CC0",
      "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:3rd_Global_Climate_Strike_Berlin_FridaysForFuture_demonstration_view_from_stage_50.jpg"
    },
    "assets/image/wikipedia/karbon-fiyatlandirmasi.png": {
      "title": "Karbon Fiyatlandırması",
      "author": "World Bank Staff and contributors",
      "license": "CC BY 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/3.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Carbon_taxes_and_emission_trading_worldwide.svg"
    },
    "assets/image/wikipedia/ormanlarin-korunmasi.jpg": {
      "title": "Ormanların Korunması",
      "author": "Michael hunter",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Reforestation_Near_Kings_Forest_Hamilton_Ontario.JPG"
    },
    "assets/image/wikipedia/uluslararasi-isbirligi.jpg": {
      "title": "Uluslararası İşbirliği",
      "author": "Press Information Department",
      "license": "Public domain",
      "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Licensing",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:COP_22_High_Level_Segment_Opening_Session_Prime_Minister_Sheikh_Hasina_Marrakech_Morocco_2016-11-15.jpg"
    },
    "assets/image/wikipedia/sanayi-donusumu.jpg": {
      "title": "Sanayi Dönüşümü",
      "author": "T. Allom (illüstrasyon), J. Tingle (gravür)",
      "license": "Public domain",
      "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Licensing",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Powerloom_weaving_in_1835.jpg"
    },
    "assets/image/wikipedia/surdurulebilir-sehirler.jpg": {
      "title": "Sürdürülebilir Şehirler",
      "author": "USDA",
      "license": "Public domain",
      "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Licensing",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:New_York_City_High_Line_-_Urban_Forestry_-_20150915-OSEC-LSC-0161_(20974909154).jpg"
    },
    "assets/image/wikipedia/paris-anlasmasi.jpg": {
      "title": "Paris Anlaşması",
      "author": "Presidencia de la República Mexicana",
      "license": "CC BY 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:COP21_participants_-_30_Nov_2015_(23430273715).jpg"
    },
    "assets/image/wikipedia/cin-gunes-enerjisi.jpg": {
      "title": "Çin'in Güneş Enerjisi Atılımı",
      "author": "NASA Earth Observatory",
      "license": "Public domain",
      "licenseUrl": "https://commons.wikimedia.org/wiki/Commons:Licensing",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Building_a_Great_Solar_Wall_in_China_(153759_-_2_20241208_lrg).jpg"
    },
    "assets/image/wikipedia/norvec-elektrikli-arac.jpg": {
      "title": "Norveç'te Elektrikli Araç Devrimi",
      "author": "Wolfmann",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Electric_vehicle_charging_station_Ladestasjon_for_elbil_Nissan_VW_e-golf_Storgaten_T%C3%B8nsberg_kommune_Norway_2017-09-20_04.jpg"
    },
    "assets/image/wikipedia/avrupa-yesil-mutabakati.jpg": {
      "title": "Avrupa Yeşil Mutabakatı",
      "author": "almathias",
      "license": "CC0",
      "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Berlaymont_building_in_Brussels.jpg"
    },
    "assets/image/wikipedia/batarya-teknolojisi.jpg": {
      "title": "Bataryada Atılım",
      "author": "RudolfSimon",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Lithium-Ion_Battery_for_BMW_i3_-_SB-LiMotive_Cells.JPG"
    },
    "assets/image/wikipedia/karbon-yakalama-teknolojisi.jpg": {
      "title": "Climeworks'ün Karbon Yakalama Tesisi",
      "author": "TRx340",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/deed.tr",
      "source": "Wikimedia Commons",
      "sourceUrl": "https://commons.wikimedia.org/wiki/File:Climeworks-Anlage.jpg"
    },
    "assets/image/un/UN7262680.jpg": {
      "title": "Grönland buz tabakası",
      "author": "UN Photo",
      "license": "BM Fotoğraf Arşivi kullanım şartları",
      "licenseUrl": "https://media.un.org/photo/en/terms-and-conditions",
      "source": "BM Fotoğraf Arşivi",
      "sourceUrl": "https://media.un.org/photo/en"
    },
    "assets/image/un/UN7319884.jpg": {
      "title": "Doğu Afrika Miombo Ormanları",
      "author": "UN Photo",
      "license": "BM Fotoğraf Arşivi kullanım şartları",
      "licenseUrl": "https://media.un.org/photo/en/terms-and-conditions",
      "source": "BM Fotoğraf Arşivi",
      "sourceUrl": "https://media.un.org/photo/en"
    },
    "assets/image/un/UN7417696.jpg": {
      "title": "Teksas Körfez Kıyısı",
      "author": "UN Photo",
      "license": "BM Fotoğraf Arşivi kullanım şartları",
      "licenseUrl": "https://media.un.org/photo/en/terms-and-conditions",
      "source": "BM Fotoğraf Arşivi",
      "sourceUrl": "https://media.un.org/photo/en"
    },
    "assets/image/un/UN7417711.jpg": {
      "title": "Macaristan PVC ve Plastik Sektörü",
      "author": "UN Photo",
      "license": "BM Fotoğraf Arşivi kullanım şartları",
      "licenseUrl": "https://media.un.org/photo/en/terms-and-conditions",
      "source": "BM Fotoğraf Arşivi",
      "sourceUrl": "https://media.un.org/photo/en"
    },
    "assets/image/un/UN7436150.jpg": {
      "title": "Yenilenebilir Enerjiye Geçiş",
      "author": "UN Photo",
      "license": "BM Fotoğraf Arşivi kullanım şartları",
      "licenseUrl": "https://media.un.org/photo/en/terms-and-conditions",
      "source": "BM Fotoğraf Arşivi",
      "sourceUrl": "https://media.un.org/photo/en"
    },
    "assets/image/un/UN7771324.jpg": {
      "title": "Çimento Fabrikaları",
      "author": "UN Photo",
      "license": "BM Fotoğraf Arşivi kullanım şartları",
      "licenseUrl": "https://media.un.org/photo/en/terms-and-conditions",
      "source": "BM Fotoğraf Arşivi",
      "sourceUrl": "https://media.un.org/photo/en"
    }
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
      ['Kaynak', credit.source, credit.sourceUrl]
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
        link.rel = 'noopener';
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
    close.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
    close.addEventListener('click', (e) => { e.stopPropagation(); closePopover(); });
    box.appendChild(close);

    return box;
  }

  /* Kutu body'ye basılıyor: reel küçük resmi ve şerit kartları overflow:hidden
     olduğu için görselin içine eklenirse kırpılıyordu. Konum her seferinde
     rozetin ekrandaki yerinden hesaplanıyor. */
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
    // Şerit (hover-ticker) kayarken künye okunamaz; açıkken durduruyoruz.
    document.body.classList.add('media-credit-open');
    openPopover = { button, node };
  }

  function makeBadge(credit) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'media-credit-badge';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', credit.title + ' — görsel künyesi');
    button.innerHTML = '<i class="fa-solid fa-info" aria-hidden="true"></i>';
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
    // Reel görselleri JS ile sonradan basılıyor; eklendiklerinde rozetlerini al.
    const reel = document.getElementById('actions-section');
    if (reel) new MutationObserver(() => scan(reel)).observe(reel, { childList: true, subtree: true });
  });
})();
