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
  if (document.querySelector('.hero-video')) {
    gsap.to('.hero-video', {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
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
      sectionId: 'actions-section',
      play: () => {
        const title = document.querySelector('#actions-section .section-title');
        if (!title) return;
        gsap.from(title, { opacity: 0, y: 24, duration: 0.5, ease: 'power2.out' });
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

  // Modern, tutarlı kategorik palet: 5 donut grafiğinde de aynı 4 renk
  // kullanılıyor (tutarlı kategorik kodlama, dataviz'de iyi bir pratik).
  const MODERN_CHART_COLORS = ['#ff6b6b', '#ffb648', '#38bdf8', '#94a3b8'];

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
      centerValue.style.color = MODERN_CHART_COLORS[index % MODERN_CHART_COLORS.length];
      centerLabel.textContent = labels[index];
    }

    let cumulative = 0;
    const segments = [];

    values.forEach((value, i) => {
      if (!value) return;
      const fraction = total === 0 ? 0 : value / total;
      const dash = fraction * circumference;
      const targetOffset = -(cumulative * circumference);
      const color = MODERN_CHART_COLORS[i % MODERN_CHART_COLORS.length];

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

      circle.addEventListener('mouseenter', () => {
        segments.forEach((s) => s.classList.toggle('is-dimmed', s !== circle));
        showSegment(i);
      });

      svg.appendChild(circle);
      segments.push(circle);
      cumulative += fraction;
    });

    // Tek tek segmentler yerine SVG'nin bütününden çıkışta sıfırlanır —
    // komşu iki dilim arasında geçerken merkezin varsayılana "titreyerek"
    // dönmesini (ve hemen tekrar değişmesini) önler.
    svg.addEventListener('mouseleave', () => {
      segments.forEach((s) => s.classList.remove('is-dimmed'));
      showSegment(maxIndex);
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
      segments.forEach((s) => { s.style.strokeDashoffset = s.dataset.targetOffset; });
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

    points.forEach((p, i) => {
      const dot = svgEl('circle', {
        cx: p.x, cy: p.y, r: 3.5,
        fill: color, stroke: 'rgba(255,255,255,0.9)', 'stroke-width': 1.5
      });
      dot.classList.add('trend-dot');
      dot.style.transitionDelay = `${0.6 + i * 0.06}s`;
      dot.addEventListener('mouseenter', () => {
        tooltip.textContent = `${labels[i]}: ${values[i]}`;
        tooltip.style.left = `${(p.x / width) * 100}%`;
        tooltip.style.top = `${(p.y / height) * 100}%`;
        tooltip.classList.add('is-visible');
        dot.setAttribute('r', 5.5);
      });
      dot.addEventListener('mouseleave', () => {
        tooltip.classList.remove('is-visible');
        dot.setAttribute('r', 3.5);
      });
      svg.appendChild(dot);
      dots.push(dot);
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
      `<div class="trend-metric"><span class="trend-metric-value">${growthPct > 0 ? '+' : ''}${growthPct}%</span><span class="trend-metric-label">Değişim</span></div>`;
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
      '#ff6b6b'
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
      '#4ade80'
    );
  }
  function initCauseIndustryTrendChart() {
    // Türkiye endüstriyel işlemler ve ürün kullanımı emisyonu, milyon ton CO₂e
    // (TÜİK, ÇŞB Çevresel Göstergeler §4.2, 1990-2018).
    renderTrendChart(
      'causeIndustryTrendChart',
      ['1990', '2000', '2010', '2018'],
      [22.8, 26.2, 48.1, 65.2],
      '#a78bfa'
    );
  }
  function initCauseAgricultureTrendChart() {
    // Türkiye tarımsal faaliyetler emisyonu, milyon ton CO₂e
    // (TÜİK, ÇŞB Çevresel Göstergeler §4.2, 1990-2018).
    renderTrendChart(
      'causeAgricultureTrendChart',
      ['1990', '2000', '2010', '2018'],
      [45.7, 42.3, 44.0, 64.9],
      '#34d399'
    );
  }
  function initCauseTransportTrendChart() {
    // Türkiye ulaştırma toplam seragazı emisyonu, milyon ton CO₂e
    // (TÜİK, ÇŞB Çevresel Göstergeler §10.3, 1990-2017).
    renderTrendChart(
      'causeTransportTrendChart',
      ['1990', '2000', '2010', '2017'],
      [27.0, 36.5, 45.4, 84.7],
      '#38bdf8'
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

/* ── "Tabs card" (Orman Yangınları / Deniz Sıcaklığı / Global Isınma) ──
   Masaüstünde Framer'ın Tabs-card bileşeninin aynısı: solda isim+açıklama
   listesi, sağda tıklanan öğenin fotoğrafı çapraz geçişle (cross-fade)
   görünüyor. ≤767px'te satır düzeni sütuna dönüyor (style.css) ama ortak
   fotoğraf çerçevesi kendi genişliğini absolute konumlu <img>'lardan
   alamadığından (normal akıştan çıkmış elemanlar üst kapsayıcı boyutuna
   katkı vermez) genişliği sıfıra çöküp görünmez oluyordu — düzeltmek
   yetmiyordu, kullanıcı isteği: mobilde çerçeve tıklanan başlığın hemen
   altında, akordeon gibi görünsün. Tek fotoğraf çerçevesi DOM'da tıklanan
   sekmenin (tabs-list içindeki) hemen ardına taşınıyor; masaüstünde
   card'ın son çocuğu olarak (özgün konumu) geri veriliyor. Görsellerin
   kendisi zaten aynı elemanlar olduğundan lightbox/crossfade bağlı kalıyor. */
(function () {
  const mobileQuery = window.matchMedia('(max-width: 767px)');

  document.querySelectorAll('.indicator-tabs-card').forEach((card) => {
    const tabs = Array.prototype.slice.call(card.querySelectorAll('.indicator-tab-item'));
    const photos = Array.prototype.slice.call(card.querySelectorAll('.indicator-tab-photo-img'));
    const photoPanel = card.querySelector('.indicator-tabs-photo');
    if (!tabs.length) return;

    let activeIndex = 0;

    function positionPhotoPanel() {
      if (!photoPanel) return;
      if (mobileQuery.matches) {
        const activeTab = tabs[activeIndex];
        if (activeTab && activeTab.nextElementSibling !== photoPanel) {
          activeTab.insertAdjacentElement('afterend', photoPanel);
        }
      } else if (card.lastElementChild !== photoPanel) {
        card.appendChild(photoPanel);
      }
    }

    function setActive(index) {
      activeIndex = index;
      tabs.forEach((tab, i) => tab.classList.toggle('active', i === index));
      photos.forEach((photo, i) => photo.classList.toggle('active', i === index));
      positionPhotoPanel();
    }

    tabs.forEach((tab, i) => tab.addEventListener('click', () => setActive(i)));
    mobileQuery.addEventListener('change', positionPhotoPanel);
    setActive(0);
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
    const group = el.closest('.vital-signs-strip, .indicator-stats') || el;
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
      const group = el.closest('.vital-signs-strip, .indicator-stats') || el;
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

/* ── "Expanded Card" (Deniz Sıcaklığı — Akdeniz/Ege/Karadeniz/Marmara) ──
   Flex 1↔5 geçişi CSS'te tanımlı (.active sınıfı); burada sadece hangi
   kartın .active olacağını yönetiyoruz — masaüstünde üzerine gelinen kart
   genişliyor, 768px altında CSS zaten hepsini dikey açık gösteriyor. */
(function () {
  document.querySelectorAll('.expanded-card').forEach((wrap) => {
    const items = Array.prototype.slice.call(wrap.querySelectorAll('.expanded-card-item'));
    if (!items.length) return;

    function setActive(index) {
      items.forEach((item, i) => item.classList.toggle('active', i === index));
    }

    items.forEach((item, i) => {
      item.addEventListener('mouseenter', () => setActive(i));
      item.addEventListener('focus', () => setActive(i));
    });
  });
})();

/* ── Lightbox: grafik/chart görsellerine tıkla-büyüt ──
   .zoomable-chart sınıflı her <img>, tıklanınca tam ekran karartılmış bir
   katmanda büyütülmüş halde açılıyor; katmana/X'e/Esc'e tıklamak kapatıyor. */
(function () {
  const imgs = Array.prototype.slice.call(document.querySelectorAll('.zoomable-chart'));
  if (!imgs.length) return;

  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = '<button type="button" class="lightbox-close" aria-label="Kapat">&times;</button><img class="lightbox-img" alt="">';
  document.body.appendChild(overlay);
  const lightboxImg = overlay.querySelector('.lightbox-img');
  const closeBtn = overlay.querySelector('.lightbox-close');

  function open(img) {
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || '';
    overlay.classList.add('active');
    document.body.classList.add('lightbox-open');
  }

  function close() {
    overlay.classList.remove('active');
    document.body.classList.remove('lightbox-open');
  }

  imgs.forEach((img) => img.addEventListener('click', () => open(img)));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
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

/* ── ŞU AN NELER YAPILIYOR: Kronoloji (Zaman Tüneli) ──
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
    const rect = timeline.getBoundingClientRect();
    const viewportMid = window.innerHeight * 0.5;
    const total = rect.height + viewportMid;
    const passed = viewportMid - rect.top;
    const progress = Math.max(0, Math.min(1, passed / total));
    spineFill.style.height = `${(progress * 100).toFixed(1)}%`;
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

/* ── ŞU AN NELER YAPILIYOR: Kart etkileşimleri (React "Timeline3D" referansı) ──
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

/* ── ADIM KARUSELİ (Ne Yapmalıyız?) ──
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

  const individualSteps = [
    { icon: 'fa-bolt', color: 'green', photo: 'assets/image/actions/energy-saving.avif', title: 'Enerji Tasarrufu',
      desc: 'Enerji verimli cihazlar ve LED aydınlatma aynı işi çok daha az elektrikle yapar. Bekleme modundaki cihazların çektiği "hayalet enerji" bile boşuna tüketiliyor. Bu küçük alışkanlıklar yılda 200 kg\'a kadar CO₂ tasarrufu sağlayabilir.',
      examples: ["Çamaşırı 30°C'de ve tam dolu makinede yıka", 'Termostatı 1°C değiştirmek bile ~%5 tasarruf sağlar', 'Mümkünse enerji tedarikçini yenilenebilire geçir'] },
    { icon: 'fa-bicycle', color: 'blue', photo: 'assets/image/actions/transportation-preferences.avif', title: 'Ulaşım Tercihleri',
      desc: 'Ulaşım, bireysel karbon ayak izinin en büyük kalemlerinden biri. Toplu taşıma, bisiklet ya da yürüyüşü tercih etmek; uzun mesafelerde de trenin uçağa göre yolcu-km başına ortalama 8 kat daha az CO₂ üretmesi, ulaşım seçimlerini iklim açısından belirleyici kılıyor.',
      examples: ['Haftada 3 gün toplu taşıma = yılda ~1 ton CO₂ az', '3 km altındaki mesafeleri yürüyerek ya da bisikletle git', 'Mümkün olan seyahatlerde uçuş yerine tren tercih et'] },
    { icon: 'fa-carrot', color: 'orange', photo: 'assets/image/actions/eating-habits.avif', title: 'Beslenme Alışkanlıkları',
      desc: 'Gıda üretimi küresel sera gazı emisyonlarının önemli bir kısmından sorumlu; kırmızı et bu payın en büyük tekil kaynağı. Tüketimini azaltıp yerel, mevsimsel ve bitki ağırlıklı beslenmeye yönelmek bireysel karbon ayak izini belirgin biçimde küçültüyor.',
      examples: ['Haftada 1 gün etsiz beslenme = ~200 kg CO₂/yıl az', 'Yerel pazardan alışveriş yap, nakliye emisyonunu kır', 'Plan yap, porsiyonu küçült, gıda israfını sıfırla'] },
    { icon: 'fa-recycle', color: 'emerald', photo: 'assets/image/actions/conscious-consumption.avif', title: 'Bilinçli Tüketim',
      desc: 'Her ürünün üretiminde harcanan enerji ve hammadde, satın alma kararlarını iklim açısından önemli kılıyor. Daha az ve bilinçli satın almak, ürünleri uzun süre kullanmak; onarmak ve ikinci eli tercih etmek hem atığı hem de üretim kaynaklı emisyonları azaltıyor.',
      examples: ['Almadan önce "gerçekten ihtiyacım var mı?" diye sor', 'Elektronikte önce onarımı dene, değiştirmeyi son çare yap', 'Tekli plastik ambalaj yerine dökme/büyük boy al'] },
    { icon: 'fa-seedling', color: 'lightgreen', photo: 'assets/image/actions/living-in-harmony-with-nature.avif', title: 'Doğayla Birlikte Yaşamak',
      desc: 'Yeşil alanlar hem karbon depoluyor hem de yerel biyoçeşitliliği destekliyor. Balkonunda ya da bahçende bitki yetiştirmek küçük bir adım gibi görünse de, olgun bir ağacın yılda ortalama 21-25 kg CO₂ emdiği düşünülürse toplu etkisi büyüyor.',
      examples: ['Mutfak atığını kompostlayıp toprağa besin olarak ver', 'Yerel ağaçlandırma projelerine gönüllü katıl', 'Damlayan bir musluk yılda 20.000L suyu boşa akıtabilir'] },
    { icon: 'fa-bullhorn', color: 'purple', photo: 'assets/image/actions/advocacy-and-awareness.avif', title: 'Savunuculuk ve Farkındalık',
      desc: 'Bireysel adımlar önemli, ama en büyük etki toplu sesle ortaya çıkıyor. Çevrendeki insanları bilinçlendirmek ve oy verirken iklim politikasını önceliklendirmek, sistemsel değişimi hızlandıran dolaylı ama güçlü bir yol.',
      examples: ['Yaşadığın şehrin iklim eylem planını takip et', 'İş yerinde sürdürülebilirlik odaklı öneriler sun', 'Bilimsel kaynaklara dayanan iklim içeriklerini paylaş'] }
  ];

  const societalSteps = [
    { icon: 'fa-solar-panel', color: 'orange', photo: 'assets/image/actions/transition-to-renewable-energy.avif', title: 'Yenilenebilir Enerjiye Geçiş',
      desc: 'Küresel enerji üretiminin fosil yakıtlardan güneş, rüzgâr ve diğer temiz kaynaklara kaydırılması, emisyonları azaltmanın en yüksek etkili yollarından biri. Hükümetlerin ve şirketlerin yatırım önceliklerini bu yönde değiştirmesi dönüşümün hızını doğrudan belirliyor.',
      examples: ['Devlet teşvikleri çatı üstü güneş enerjisini yaygınlaştırabilir', 'Fosil yakıt sübvansiyonlarının kademeli kaldırılması kritik', 'Enerji depolama teknolojilerine Ar-Ge yatırımı şart'] },
    { icon: 'fa-scale-balanced', color: 'red', photo: 'assets/image/actions/carbon-pricing.avif', title: 'Karbon Fiyatlandırması',
      desc: 'Karbon vergisi ve emisyon ticaret sistemleri, sera gazı salımının gerçek maliyetini fiyatlara yansıtarak "kirleten öder" ilkesini işletir. Bu mekanizmalar, temiz teknolojilere geçişi piyasa içinden hızlandıran güçlü araçlar.',
      examples: ['Ton başına $50-100 CO₂ fiyatı dönüşümü tetikleyecek düzeyde', 'Vergi gelirleri yeşil altyapıya ayrılabilir', 'Sınır karbon mekanizmaları haksız rekabeti önler'] },
    { icon: 'fa-tree', color: 'emerald', photo: 'assets/image/actions/protection-of-forests.avif', title: 'Ormanların Korunması',
      desc: 'Ormanlar dünyanın en büyük doğal karbon yutaklarından biri; hem ormansızlaşmayı durdurmak hem de büyük ölçekli ağaçlandırma projeleri yürütmek, atmosferdeki karbonu dengelemenin en doğrudan yollarından biri.',
      examples: ['Orman tahribatına yol açan ürünlere ithalat kısıtlaması', 'Yerel halklara ormanlık arazide mülkiyet hakkı tanınmalı', 'REDD+ gibi karbon kredisi mekanizmaları yaygınlaşmalı'] },
    { icon: 'fa-handshake', color: 'blue', photo: 'assets/image/actions/international-cooperation.avif', title: 'Uluslararası İşbirliği',
      desc: 'İklim krizi sınır tanımıyor; Paris Anlaşması gibi küresel çerçeveler, ülkelerin ortak, ölçülebilir ve denetlenebilir hedefler etrafında birleşmesini sağlayarak bireysel çabaların toplamından daha büyük bir etki yaratıyor.',
      examples: ['Ulusal Katkı Beyanlarının (NDC) güçlendirilmesi zorunlu', 'Gelişmekte olan ülkelere iklim finansmanı artmalı', 'Teknoloji transferi yeşil dönüşümü demokratikleştirir'] },
    { icon: 'fa-industry', color: 'yellow', photo: 'assets/image/actions/industrial-transformation.avif', title: 'Sanayi Dönüşümü',
      desc: 'Çimento, çelik ve kimya gibi ağır sanayiler, üretim süreçlerinin doğası gereği kolayca elektrifiye edilemiyor. Yeşil hidrojen ve karbon yakalama teknolojileri, bu sektörlerin emisyonlarını azaltmanın önündeki en kritik açık.',
      examples: ['Kamu ihalelerinde düşük karbonlu "yeşil çelik" şartı aranmalı', 'H₂ altyapısına kamu yatırımı ölçek ekonomisiyle maliyeti düşürür', 'Sanayi emisyonlarına sektörel denetim mekanizması gerekiyor'] },
    { icon: 'fa-city', color: 'teal', photo: 'assets/image/actions/sustainable-cities.avif', title: 'Sürdürülebilir Şehirler',
      desc: '2050\'de dünya nüfusunun %68\'inin kentlerde yaşayacağı öngörülüyor; bu da şehir planlamasını iklim mücadelesinin merkezine taşıyor. Toplu taşımayı, yaya bölgelerini ve yeşil alanları bütünleştiren akıllı şehirler hem emisyonu azaltıyor hem yaşam kalitesini artırıyor.',
      examples: ['15 dakikalık şehir konsepti trafiği belirgin biçimde düşürür', 'Mevcut binaların enerji verimliliğine yükseltilmesi teşvik edilmeli', 'Kent ormanları gibi doğa tabanlı çözümler standart hale gelmeli'] }
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

  function renderSlide(step, i, count) {
    const slide = document.createElement('div');
    slide.className = 'reel-slide';

    const eyebrow = document.createElement('div');
    eyebrow.className = 'reel-eyebrow';
    eyebrow.innerHTML = `<span class="action-step-icon-badge action-step-icon-badge--${step.color}"><i class="fa-solid ${step.icon}"></i></span>`;
    const num = document.createElement('span');
    num.className = 'reel-eyebrow-number';
    num.textContent = `ADIM ${String(i + 1).padStart(2, '0')}/${String(count).padStart(2, '0')}`;
    eyebrow.appendChild(num);
    slide.appendChild(eyebrow);

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
        const newSlide = renderSlide(steps[index], index, count);
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
    currentSlide = renderSlide(steps[0], 0, count);
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

/* ── Ne Yapmalıyız? Dynamic Heading ──
   "Ne Yapmalıyız?" başlığı, bölüm görünür olduğunda en popüler 5 dilde hızla
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
    { text: 'Ne Yapmalıyız?', dir: 'ltr' }
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

/* ── Sebepler Başlığı: Scroll Hızına Bağlı Skew (VelocityText esinli) ──
   Referans bileşen, çok uzun bir scroll alanında metni kaydırma hızına göre
   eğip kaydıran bir "velocity marquee". Bu sayfa bölüm-bazlı sabit (~100vh)
   sayfalama kullandığı için aynı uzun-scroll mekaniği yok — ama "metin,
   scroll hızı ve yönüyle orantılı eğilir" özünü gerçek scroll hızından
   (px/ms) hesaplayıp başlığa sürekli uygulayan bir yay (spring) animasyonuyla
   koruyoruz: hızlı scroll = daha çok eğim, durunca yumuşakça düzleşir. */
(function () {
  const heading = document.querySelector('.cause-heading');
  const section = document.getElementById('causes-section');
  if (!heading || !section) return;

  const SKEW_SENSITIVITY = 60;
  const SKEW_MAX_DEG = 18;
  const SPRING_FACTOR = 0.12;

  heading.style.transformOrigin = 'left center';

  let lastY = window.scrollY;
  let lastT = performance.now();
  let currentSkew = 0;
  let frameId = null;

  // Bölüm ekran dışındayken bu döngü sonsuza dek çalışıp her karede
  // stil yazıp duruyordu (sayfanın geri kalanında hiç görünmese bile) —
  // diğer bölüm animasyonlarındaki gibi IntersectionObserver ile
  // sadece görünürken çalıştırıyoruz.
  function loop() {
    const now = performance.now();
    const dt = Math.max(now - lastT, 1);
    const velocity = (window.scrollY - lastY) / dt;

    const targetSkew = Math.max(-SKEW_MAX_DEG, Math.min(SKEW_MAX_DEG, velocity * SKEW_SENSITIVITY));
    currentSkew += (targetSkew - currentSkew) * SPRING_FACTOR;
    if (Math.abs(currentSkew) < 0.01) currentSkew = 0;

    heading.style.transform = `skewX(${currentSkew.toFixed(2)}deg)`;

    lastY = window.scrollY;
    lastT = now;
    frameId = requestAnimationFrame(loop);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (!frameId) {
          lastY = window.scrollY;
          lastT = performance.now();
          loop();
        }
      } else if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    });
  }, { threshold: 0.08 });

  observer.observe(section);
})();

/* ── Kahraman videosu: hareket kısıtlıyken hiç oynatma (poster kalır). ── */
(function () {
  const video = document.getElementById('heroVideo');
  if (!video) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  video.play().catch(() => {});
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
      dotLinks.forEach((a, i) => a.classList.toggle('is-active', i === activeIndex));
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
})();
