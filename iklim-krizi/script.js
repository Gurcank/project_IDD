/* ── SDG Orbital Sistemi ── */
(function () {

  /* ── 1. VERİ TABANI ─────────────────────────────────────── */
  const sdgData = [
    {
      id: 1, title: "Yoksulluğa Son", color: "#E5243B", tag: "SOSYAL",
      desc: "Dünya genelinde 700 milyondan fazla insan günlük 2.15 doların altında geçimini sağlamaktadır. Bu hedef; sosyal koruma ağları oluşturmayı, ekonomik eşitsizlikleri azaltmayı ve dezavantajlı gruplara kaynak erişimi sağlamayı kapsamaktadır.",
      stat: "700M+", statLabel: "kişi günlük 2.15 $'ın altında yaşıyor"
    },
    {
      id: 2, title: "Açlığa Son", color: "#DDA63A", tag: "GIDA",
      desc: "Yaklaşık 690 milyon insan kronik açlıkla mücadele ederken iklim değişikliği tarım alanlarını tahrip ediyor. Sürdürülebilir tarım, gıda güvenliği ve küçük çiftçilerin güçlendirilmesi bu hedefin temel eksenini oluşturuyor.",
      stat: "690M", statLabel: "insan kronik açlık yaşıyor"
    },
    {
      id: 3, title: "Sağlıklı Bireyler", color: "#4C9F38", tag: "SAĞLIK",
      desc: "Evrensel sağlık hizmetine erişim, bulaşıcı hastalıklarla mücadele ve iklimle bağlantılı hastalıkların önlenmesi bu hedefin odağındadır. Dünya nüfusunun yarısı temel sağlık hizmetinden yoksun.",
      stat: "%50", statLabel: "dünya nüfusu temel sağlık hizmetine erişemiyor"
    },
    {
      id: 4, title: "Nitelikli Eğitim", color: "#C5192D", tag: "EĞİTİM",
      desc: "300 milyondan fazla çocuk okul dışında. Kapsayıcı ve kaliteli eğitim, iklim değişikliği farkındalığını içermeli ve sürdürülebilir bir geleceğin inşasında genç nesillere yol göstermelidir.",
      stat: "300M+", statLabel: "çocuk okul dışında kalıyor"
    },
    {
      id: 5, title: "Cinsiyet Eşitliği", color: "#FF3A21", tag: "EŞİTLİK",
      desc: "İklim krizinin en ağır yükünü taşıyanlar arasında kadınlar ve kız çocukları yer alıyor. Toplumsal cinsiyet eşitliğinin sağlanması, sürdürülebilir kalkınmanın hem koşulu hem de çıktısıdır.",
      stat: "%135", statLabel: "daha fazla iklim mültecisi kadınlardan oluşuyor"
    },
    {
      id: 6, title: "Temiz Su ve Sanitasyon", color: "#26BDE2", tag: "SU",
      desc: "2 milyardan fazla insan güvenli içme suyuna erişimi bulunmayan bölgelerde yaşıyor. İklim değişikliği su kaynaklarını tehdit ederken kuraklık ve sel döngüleri giderek sertleşiyor.",
      stat: "2B+", statLabel: "insan temiz suya erişemiyor"
    },
    {
      id: 7, title: "Erişilebilir Enerji", color: "#FCC30B", tag: "ENERJİ",
      desc: "759 milyon insan elektriklere sahip değil. Fosil yakıtlardan yenilenebilir enerjiye geçiş hem iklim krizini durdurmak hem de enerji yoksulluğunu ortadan kaldırmak için kritik bir dönüşümdür.",
      stat: "759M", statLabel: "insan elektriğe erişemiyor"
    },
    {
      id: 8, title: "İnsana Yakışır İş", color: "#A21942", tag: "EKONOMİ",
      desc: "Sürdürülebilir ekonomik büyüme, tam istihdam ve insana yakışır iş koşulları bu hedefin özünü oluşturur. Yeşil dönüşüm, doğru politikalarla milyonlarca yeni iş fırsatı yaratabilir.",
      stat: "470M", statLabel: "insan işsiz veya yetersiz istihdam edilmiş"
    },
    {
      id: 9, title: "Sanayi ve Yenilikçilik", color: "#FD6925", tag: "İNOVASYON",
      desc: "Sürdürülebilir altyapı, kapsayıcı sanayileşme ve inovasyonun teşvik edilmesi bu hedefin odağındadır. Temiz teknolojilere yapılan her dolar yatırım, iklim mücadelesinde çarpan etkisi yaratıyor.",
      stat: "%40", statLabel: "insanlık hâlâ internetle bağlanamıyor"
    },
    {
      id: 10, title: "Eşitsizliklerin Azaltılması", color: "#DD1367", tag: "ADALEt",
      desc: "İklim krizinin yükü eşitsiz dağılıyor: En az kirleten ülkeler en ağır sonuçları yaşıyor. Gelir, fırsat ve güç eşitsizliklerinin azaltılması hem adalet hem sürdürülebilirlik için zorunludur.",
      stat: "%82", statLabel: "küresel servet en zengin %1'in elinde"
    },
    {
      id: 11, title: "Sürdürülebilir Şehirler", color: "#FD9D24", tag: "KENTSEL",
      desc: "2050'de dünya nüfusunun %68'i kentte yaşayacak. İklim dayanıklılığına sahip, kapsayıcı ve sürdürülebilir kentler inşa etmek, mücadelenin en kritik cephelerinden birini oluşturuyor.",
      stat: "%68", statLabel: "2050'de dünya nüfusu kentte yaşayacak"
    },
    {
      id: 12, title: "Sorumlu Tüketim", color: "#BF8B2E", tag: "TÜKETİM",
      desc: "Küresel gıdanın üçte biri israf edilirken moda endüstrisi küresel CO₂ emisyonlarının %10'unu üretiyor. Döngüsel ekonomi modellerine geçiş ve üretim zincirinin dönüşümü kaçınılmazdır.",
      stat: "1/3", statLabel: "küresel gıda üretimi çöpe gidiyor"
    },
    {
      id: 13, title: "İklim Eylemi", color: "#3F7E44", tag: "ACİL",
      desc: "Küresel sıcaklık artışı 1.5°C eşiğini aşmak üzere. Acil önlemler alınmazsa aşırı hava olayları, kıtlık ve zorunlu göç milyarlarca insanı doğrudan etkileyecek. Zaman tükeniyor.",
      stat: "1.5°C", statLabel: "aşılmaması gereken ısınma eşiği"
    },
    {
      id: 14, title: "Sudaki Yaşam", color: "#0A97D9", tag: "OKYANUS",
      desc: "Okyanuslar ürettiğimiz CO₂'nin %30'unu, fazla ısının %90'ını absorbe ediyor. Okyanus asitlenmesi, sıcaklık artışı ve plastik kirlilik; mercan resifleri ve kıyı ekosistemlerini yok ediyor.",
      stat: "%50", statLabel: "mercan resifler son 30 yılda yok oldu"
    },
    {
      id: 15, title: "Karasal Yaşam", color: "#56C02B", tag: "EKOSİSTEM",
      desc: "Her yıl 10 milyon hektar orman tahrip ediliyor. Ormansızlaşma, biyoçeşitlilik kaybı ve çölleşme karbon yutaklarını ortadan kaldırarak iklim krizini derinleştiriyor.",
      stat: "10M ha", statLabel: "orman her yıl yok ediliyor"
    },
    {
      id: 16, title: "Barış ve Adalet", color: "#00689D", tag: "YÖNETİŞİM",
      desc: "İklim değişikliği, kaynak kıtlığı ve göç dalgaları aracılığıyla çatışma riskini artırıyor. Şeffaf kurumlar ve güçlü hukuk sistemleri olmadan iklim adaleti sağlanamaz.",
      stat: "2050", statLabel: "yılına kadar 1 milyar iklim mültecisi öngörülüyor"
    },
    {
      id: 17, title: "Hedefler İçin Ortaklık", color: "#19486A", tag: "ORTAKLIK",
      desc: "İklim kriziyle mücadele tek bir ülkenin, şirketin ya da bireyin sorunu değil. Küresel finansman mekanizmaları, teknoloji transferi ve uluslararası işbirliği olmadan 2030 hedeflerine ulaşmak imkânsız.",
      stat: "3.9T$", statLabel: "yıllık iklim finansmanı açığı"
    }
  ];

  /* ── 2. STATE ────────────────────────────────────────────── */
  const ACTIVE_NODE_OFFSET_Y = -72;
  const ACTIVE_NODE_Z_INDEX = 500;
  const DIMMED_NODE_Z_INDEX = 10;
  const ROTATION_STEP_DEGREES = 0.16;
  const ORBIT_BASE_Z_INDEX = 100;
  const ORBIT_Z_INDEX_DEPTH_FACTOR = 40;
  const RADIUS_BREAKPOINT_DESKTOP = 1100;
  const RADIUS_BREAKPOINT_TABLET = 575;
  const RADIUS_DESKTOP = 240;
  const RADIUS_TABLET = 150;
  const RADIUS_MOBILE = 125;

  let rotationAngle = 0;
  let autoRotate = true;
  let animFrameId = null;
  let activeId = null;

  /* ── 3. DOM REFERANSLARI ─────────────────────────────────── */
  const canvas = document.getElementById('sdgCanvas');
  const infoCard = document.getElementById('sdgInfoCard');
  const cardInner = document.getElementById('sdgCardInner');

  if (!canvas || !infoCard || !cardInner) {
    return;
  }

  /* ── 4. YARDIMCI FONKSİYONLAR ───────────────────────────── */
  function getRadius() {
    const w = window.innerWidth;
    if (w > RADIUS_BREAKPOINT_DESKTOP) return RADIUS_DESKTOP;
    if (w > RADIUS_BREAKPOINT_TABLET) return RADIUS_TABLET;
    return RADIUS_MOBILE;
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
      <p class="sdg-card-desc">${sdg.desc}</p>
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
  // start/end+onEnter mekaniği yerine IntersectionObserver ile tetiklenir.
  // Sebep: bu sayfadaki "tek scroll = bir bölüm" wheel-paging script'i
  // bölümler arasında hızlı/anlık scrollIntoView sıçramaları yapıyor; GSAP
  // ScrollTrigger'ın onEnter callback'i böyle ani sıçramalarda bazen hiç
  // tetiklenmiyor (animasyon "from" durumunda — yani opacity:0'da — asılı
  // kalabiliyor). IntersectionObserver gerçek görünürlük durumuna baktığı
  // için bu sorunu yaşamıyor; sayfadaki Chart.js lazy-init de zaten bu
  // deseni kullanıyor.
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
      sectionId: 'consequences-section',
      play: () => {
        const panels = document.querySelectorAll('.future-panel');
        panels.forEach((panel, i) => {
          gsap.from(panel, {
            opacity: 0,
            x: i % 2 === 0 ? -30 : 30,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power2.out'
          });
        });
      }
    },
    {
      sectionId: 'actions-section',
      play: () => {
        if (!document.querySelector('.action-zoom-grid')) return;
        // stagger kullanılmıyor: iki kart ayrı zamanlamayla animasyona
        // başlayınca geçiş sırasında biri diğerinden daha yukarıda/aşağıda
        // görünüyordu — eşzamanlı oynatarak bu görsel hizasızlığı önlüyoruz.
        gsap.from('.action-zoom-card', {
          opacity: 0, y: 24, duration: 0.5, ease: 'power2.out'
        });
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

/* ── Chart.js Bölümleri (lazy init via IntersectionObserver) ── */
(function () {
  if (typeof Chart === 'undefined') return;

  const chartInstances = {};

  const AXIS_TICK_COLOR = 'rgba(255,255,255,0.55)';
  const AXIS_GRID_COLOR = 'rgba(255,255,255,0.06)';
  const CHART_ANIMATION_DURATION_MS = 900;

  function baseOptions(extra) {
    return Object.assign({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: 'rgba(255,255,255,0.7)' }
        }
      },
      scales: {}
    }, extra);
  }

  /* PointsChart referansındaki temiz tooltip kartının Chart.js karşılığı. */
  function styledTooltip(extra) {
    return Object.assign({
      backgroundColor: 'rgba(15,15,15,0.95)',
      titleColor: '#fff',
      bodyColor: 'rgba(255,255,255,0.85)',
      borderColor: 'rgba(255,255,255,0.15)',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 10,
      displayColors: false
    }, extra);
  }

  /* PointsChart'taki yıldız işaretli "level" referans çizgisinin Chart.js
     karşılığı: belirli bir eşik değerinde kesikli çizgi + yıldız ikonu. */
  function drawStar(ctx, cx, cy, r, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI / 5) * i - Math.PI / 2;
      const radius = i % 2 === 0 ? r : r / 2.3;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function referenceLinePlugin(value, color) {
    return {
      id: `referenceLine-${value}`,
      afterDatasetsDraw: (chart) => {
        const yScale = chart.scales.y;
        if (!yScale) return;
        const y = yScale.getPixelForValue(value);
        const area = chart.chartArea;
        const ctx = chart.ctx;
        ctx.save();
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(area.left, y);
        ctx.lineTo(area.right, y);
        ctx.stroke();
        ctx.restore();
        drawStar(ctx, area.left, y, 6, color);
      }
    };
  }

  function donutOptions() {
    return baseOptions({
      cutout: '65%',
      plugins: {
        legend: { display: false },
        tooltip: styledTooltip()
      },
      animation: { animateRotate: true, animateScale: true, duration: CHART_ANIMATION_DURATION_MS },
      hoverOffset: 20,
      onHover: (event, elements, chart) => {
        chart.canvas.style.cursor = elements.length ? 'pointer' : 'default';
      }
    });
  }

  function makeDonut(canvasId, labels, data, colors) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    return new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderColor: '#0a0a0a',
          borderWidth: 2,
          hoverOffset: 20
        }]
      },
      options: donutOptions()
    });
  }

  function initCauseEnergyChart() {
    if (chartInstances.causeEnergy) return;
    chartInstances.causeEnergy = makeDonut(
      'causeEnergyChart',
      ['Kömür', 'Petrol', 'Doğal Gaz', 'Diğer'],
      [40, 32, 22, 6],
      ['#e74c3c', '#f39c12', '#3498db', '#95a5a6']
    );
  }

  function initCauseDeforestationChart() {
    if (chartInstances.causeDeforestation) return;
    chartInstances.causeDeforestation = makeDonut(
      'causeDeforestationChart',
      ['Tarım açma', 'Hayvancılık', 'Kereste', 'Kentleşme'],
      [48, 26, 16, 10],
      ['#27ae60', '#f39c12', '#795548', '#607d8b']
    );
  }

  function initCauseIndustryChart() {
    if (chartInstances.causeIndustry) return;
    chartInstances.causeIndustry = makeDonut(
      'causeIndustryChart',
      ['Çimento', 'Çelik/Metal', 'Kimyasal', 'Diğer'],
      [27, 25, 19, 29],
      ['#9b59b6', '#e74c3c', '#f1c40f', '#bdc3c7']
    );
  }

  function initCauseAgricultureChart() {
    if (chartInstances.causeAgriculture) return;
    chartInstances.causeAgriculture = makeDonut(
      'causeAgricultureChart',
      ['Hayvancılık CH₄', 'Pirinç tarlaları', 'Gübre N₂O', 'Arazi kullanımı'],
      [31, 20, 30, 19],
      ['#27ae60', '#2ecc71', '#f39c12', '#8bc34a']
    );
  }

  function initCauseTransportChart() {
    if (chartInstances.causeTransport) return;
    chartInstances.causeTransport = makeDonut(
      'causeTransportChart',
      ['Karayolu', 'Havacılık', 'Denizcilik', 'Tren/Diğer'],
      [45, 12, 11, 32],
      ['#3498db', '#2980b9', '#1abc9c', '#bdc3c7']
    );
  }

  /* Sebepler sekmelerindeki card stack'in yerini alan ikinci görsel: kategoriye
     özgü uzun dönem emisyon/kayıp eğilimini gösteren dolgulu çizgi grafik. */
  function makeTrendLine(canvasId, label, labels, data, color) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    return new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label,
          data,
          borderColor: color,
          backgroundColor: color + '26',
          fill: true,
          tension: 0.35,
          pointRadius: 3,
          pointBackgroundColor: color,
          pointBorderColor: '#0a0a0a',
          pointBorderWidth: 1.5
        }]
      },
      options: baseOptions({
        plugins: { legend: { display: false }, tooltip: styledTooltip() },
        scales: {
          x: { ticks: { color: AXIS_TICK_COLOR }, grid: { display: false } },
          y: { ticks: { color: AXIS_TICK_COLOR }, grid: { color: AXIS_GRID_COLOR } }
        },
        animation: { duration: CHART_ANIMATION_DURATION_MS, easing: 'easeOutQuart' }
      })
    });
  }

  function initCauseEnergyTrendChart() {
    if (chartInstances.causeEnergyTrend) return;
    chartInstances.causeEnergyTrend = makeTrendLine(
      'causeEnergyTrendChart', 'Fosil Yakıt CO₂ Emisyonu (Gt/yıl)',
      ['1990', '2000', '2010', '2020', '2023'],
      [21.6, 24.0, 30.6, 34.8, 36.8],
      '#e74c3c'
    );
  }

  function initCauseDeforestationTrendChart() {
    if (chartInstances.causeDeforestationTrend) return;
    chartInstances.causeDeforestationTrend = makeTrendLine(
      'causeDeforestationTrendChart', 'Yıllık Orman Kaybı (Milyon Hektar)',
      ['1990', '2000', '2010', '2020', '2023'],
      [7.3, 8.9, 9.7, 10.2, 10.0],
      '#27ae60'
    );
  }

  function initCauseIndustryTrendChart() {
    if (chartInstances.causeIndustryTrend) return;
    chartInstances.causeIndustryTrend = makeTrendLine(
      'causeIndustryTrendChart', 'Sanayi Kaynaklı CO₂ Emisyonu (Gt/yıl)',
      ['1990', '2000', '2010', '2020', '2023'],
      [4.8, 5.9, 7.6, 8.8, 9.3],
      '#9b59b6'
    );
  }

  function initCauseAgricultureTrendChart() {
    if (chartInstances.causeAgricultureTrend) return;
    chartInstances.causeAgricultureTrend = makeTrendLine(
      'causeAgricultureTrendChart', 'Tarımsal Sera Gazı Emisyonu (Gt CO₂e/yıl)',
      ['1990', '2000', '2010', '2020', '2023'],
      [4.7, 5.0, 5.3, 5.7, 5.9],
      '#2ecc71'
    );
  }

  function initCauseTransportTrendChart() {
    if (chartInstances.causeTransportTrend) return;
    chartInstances.causeTransportTrend = makeTrendLine(
      'causeTransportTrendChart', 'Ulaşım Kaynaklı CO₂ Emisyonu (Gt/yıl)',
      ['1990', '2000', '2010', '2020', '2023'],
      [4.6, 5.6, 6.7, 7.3, 8.1],
      '#3498db'
    );
  }

  /* "İlerleme" bölümündeki çok boyutlu radar grafiğin yerini alan, "İki Olası
     Gelecek" panellerinin fotoğraflarının üzerine binen iki mini gösterge:
     aynı 6 boyut, ama tek senaryoya (2075 eylem / eylemsizlik) indirgenmiş,
     küçük ve okunaklı bir gauge kartı olarak. */
  const GAUGE_LABEL_FONT_SIZE_MOBILE = 9;
  const GAUGE_LABEL_FONT_SIZE_DESKTOP = 12;
  const GAUGE_MOBILE_BREAKPOINT = 576;

  function makeScenarioGauge(canvasId, data, color) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    const labelFontSize = window.innerWidth < GAUGE_MOBILE_BREAKPOINT
      ? GAUGE_LABEL_FONT_SIZE_MOBILE
      : GAUGE_LABEL_FONT_SIZE_DESKTOP;
    return new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['CO₂', 'Orman Kaybı', 'Okyanus Isısı', 'Buz Kaybı', 'Aşırı Hava', 'Tür Kaybı'],
        datasets: [{
          data,
          borderColor: color,
          backgroundColor: color + '33',
          pointBackgroundColor: color,
          pointRadius: 2,
          borderWidth: 1.5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 0,
            max: 100,
            grid: { color: 'rgba(255,255,255,0.12)' },
            angleLines: { color: 'rgba(255,255,255,0.1)' },
            pointLabels: { color: 'rgba(255,255,255,0.75)', font: { size: labelFontSize } },
            ticks: { display: false }
          }
        },
        plugins: { legend: { display: false }, tooltip: styledTooltip() },
        animation: { duration: CHART_ANIMATION_DURATION_MS, easing: 'easeOutQuart' }
      }
    });
  }

  function initFutureRadarPositive() {
    if (chartInstances.futureRadarPositive) return;
    // Eylem senaryosu: CO₂/orman/okyanus/aşırı hava/tür kaybı düşük, buz kaybı düşük (= buz korunmuş).
    chartInstances.futureRadarPositive = makeScenarioGauge(
      'futureRadarPositive', [28, 22, 24, 18, 20, 16], '#56c02b'
    );
  }

  function initFutureRadarNegative() {
    if (chartInstances.futureRadarNegative) return;
    // Eylemsizlik senaryosu: tüm boyutlar 2075'te uç noktada (buz kaybı dahil yüksek = çok buz erimiş).
    chartInstances.futureRadarNegative = makeScenarioGauge(
      'futureRadarNegative', [95, 90, 92, 88, 96, 85], '#e74c3c'
    );
  }

  const initializers = [
    { sectionId: 'causes-section', fn: initCauseEnergyChart },
    { sectionId: 'causes-section', fn: initCauseEnergyTrendChart },
    { sectionId: 'consequences-section', fn: initFutureRadarPositive },
    { sectionId: 'consequences-section', fn: initFutureRadarNegative }
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
  const HEADING_FIT_MAX_SCALE = 3;

  function playDipAndSweep() {
    suffixText.classList.remove('dip', 'sweep-in');
    void suffixText.offsetWidth; // reflow, animasyonları yeniden tetikler
    suffixText.classList.add('dip', 'sweep-in');
    setTimeout(() => {
      suffixText.classList.remove('dip');
    }, DIP_RESET_MS);
  }

  /* Başlık (sabit metin + değişen sekme adı) en soldan en sağa kadar uzansın:
     doğal genişliği ölçüp mevcut alana sığacak şekilde font-size'ı ölçekler. */
  const headingEl = document.querySelector('.cause-heading');
  function fitHeadingWidth() {
    if (!headingEl) return;
    if (window.innerWidth < HEADING_FIT_MOBILE_BREAKPOINT) {
      headingEl.style.fontSize = '';
      return;
    }
    headingEl.style.fontSize = '';
    const available = headingEl.clientWidth;
    const natural = headingEl.scrollWidth;
    if (!available || !natural) return;
    const baseSize = parseFloat(getComputedStyle(headingEl).fontSize);
    const scale = Math.max(HEADING_FIT_MIN_SCALE, Math.min(available / natural, HEADING_FIT_MAX_SCALE));
    headingEl.style.fontSize = `${baseSize * scale}px`;
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
})();

/* ── Sebepler Arka Plan Fotoğrafı: Sekme Değişince Crossfade ──
   Fotoğraflar artık sekme içinde değil, bölümün arka planında; aktif
   sekmeye göre değişip yumuşak bir crossfade ile geçiş yapar. Sekme
   geçişindeki takılmayı önlemek için tüm fotoğraflar sayfa yüklenir
   yüklenmez tarayıcı önbelleğine ısıtılır (her biri zaten kart istifinde
   de kullanıldığı için tek seferlik decode maliyeti tüm kullanımları kapsar). */
(function () {
  const bgLayer = document.getElementById('causesBgLayer');
  const buttons = document.querySelectorAll('#causeTabsNav .cause-tab-btn');
  if (!bgLayer || !buttons.length) return;

  const CROSSFADE_DELAY_MS = 260;

  buttons.forEach((btn) => {
    const image = btn.getAttribute('data-bg-image');
    if (image) {
      const preload = new Image();
      preload.src = image;
    }
  });

  buttons.forEach((btn) => {
    btn.addEventListener('shown.bs.tab', (e) => {
      const image = e.target.getAttribute('data-bg-image');
      if (!image) return;

      bgLayer.style.opacity = '0';
      setTimeout(() => {
        bgLayer.style.backgroundImage = `url('${image}')`;
        bgLayer.style.opacity = '0.85';
      }, CROSSFADE_DELAY_MS);
    });
  });
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
  const rotatorWords = ["Sebepleri", "Ne olacak", "Neler yapabiliriz", "Neler yapılıyor"];
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

/* ── FUTURE SLIDER (İki Olası Gelecek) ── */
(function () {
  const container = document.getElementById('futureSlider');
  const handle = document.getElementById('futureSliderHandle');
  const panelLeft = document.getElementById('futurePanelLeft');
  const panelRight = document.getElementById('futurePanelRight');
  if (!container || !handle || !panelLeft || !panelRight) return;

  let isDragging = false;
  let sliderPos = 50; // %

  function updateSlider(percent) {
    sliderPos = Math.max(5, Math.min(95, percent));
    handle.style.left = `calc(${sliderPos}% - 24px)`;
    panelLeft.style.width = sliderPos + '%';
    panelRight.style.width = (100 - sliderPos) + '%';
  }

  function getPercent(clientX) {
    const rect = container.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  }

  handle.addEventListener('mousedown', (e) => {
    isDragging = true;
    handle.classList.add('dragging');
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSlider(getPercent(e.clientX));
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    handle.classList.remove('dragging');
  });

  handle.addEventListener('touchstart', (e) => {
    isDragging = true;
    handle.classList.add('dragging');
    e.preventDefault();
  }, { passive: false });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    updateSlider(getPercent(e.touches[0].clientX));
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
    handle.classList.remove('dragging');
  });

  updateSlider(50);
})();

/* ── ACTION MODAL (Çözüm Bölümü — zoom card + scroll-snap adım modalı) ── */
/* ── ACTION MODAL (Çözüm Bölümü) ──
   Kart tıklandığında, react-medium-image-zoom'daki "görselin bulunduğu
   yerden büyüyerek tam ekrana açılması" hissini taklit eder: tıklanan
   kartın ekran konumu/boyutu okunur, modal o konuma/boyuta denk gelecek
   transform ile (geçişsiz) konumlandırılır, sonra transform kimliğe
   (translate(0) scale(1)) animasyonla geri döndürülür — klasik FLIP
   tekniği. Kapanışta aynı transform tersten oynatılıp karta geri "küçülür".
   Adımlar arası geçiş artık ok tuşu/dot tıklamasının yanında DİKEY WHEEL
   SCROLL ile de yapılabiliyor (her adım kendi fotoğrafıyla tam ekranı kaplar,
   bir sonraki adım alttan kayarak gelir). */
(function () {
  function initModal(modalId, openBtnId, closeBtnId) {
    const modal = document.getElementById(modalId);
    const openBtn = document.getElementById(openBtnId);
    const closeBtn = document.getElementById(closeBtnId);
    const overlay = document.getElementById('actionModalOverlay');
    if (!modal || !openBtn || !closeBtn) return;

    const screens = Array.prototype.slice.call(modal.querySelectorAll('.action-step-screen'));
    const totalScreens = screens.length;
    let currentStep = 0;
    let stepCooldown = false;
    const STEP_COOLDOWN_MS = 650;
    const WHEEL_DELTA_THRESHOLD = 4;

    function renderSteps() {
      screens.forEach((screen, i) => {
        screen.classList.remove('is-active', 'is-prev');
        if (i === currentStep) screen.classList.add('is-active');
        else if (i < currentStep) screen.classList.add('is-prev');
      });
    }

    function goToStep(index) {
      const target = Math.max(0, Math.min(index, totalScreens - 1));
      if (target === currentStep) return;
      currentStep = target;
      renderSteps();
    }

    modal.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (stepCooldown || Math.abs(e.deltaY) <= WHEEL_DELTA_THRESHOLD) return;
      stepCooldown = true;
      goToStep(currentStep + (e.deltaY > 0 ? 1 : -1));
      setTimeout(() => { stepCooldown = false; }, STEP_COOLDOWN_MS);
    }, { passive: false });

    let touchStartY = null;
    modal.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; }, { passive: true });
    modal.addEventListener('touchend', (e) => {
      if (touchStartY === null) return;
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      touchStartY = null;
      if (stepCooldown || Math.abs(deltaY) < 40) return;
      stepCooldown = true;
      goToStep(currentStep + (deltaY > 0 ? 1 : -1));
      setTimeout(() => { stepCooldown = false; }, STEP_COOLDOWN_MS);
    }, { passive: true });

    modal.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goToStep(currentStep + 1);
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') goToStep(currentStep - 1);
      if (e.key === 'Escape') closeModal();
    });

    function applyZoomTransform(card) {
      const cardRect = card.getBoundingClientRect();
      const dx = cardRect.left + cardRect.width / 2 - window.innerWidth / 2;
      const dy = cardRect.top + cardRect.height / 2 - window.innerHeight / 2;
      const scaleX = cardRect.width / window.innerWidth;
      const scaleY = cardRect.height / window.innerHeight;
      modal.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
    }

    function openModal(card) {
      modal.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      currentStep = 0;
      renderSteps();

      modal.style.transition = 'none';
      applyZoomTransform(card);
      void modal.offsetWidth; // reflow: yukarıdaki transform'u hemen uygula

      requestAnimationFrame(() => {
        modal.style.transition = '';
        modal.classList.add('zoom-visible');
        modal.style.transform = 'translate(0, 0) scale(1, 1)';
      });

      modal.setAttribute('tabindex', '-1');
      modal.focus();
    }

    function closeModal(card) {
      modal.classList.remove('zoom-visible');
      applyZoomTransform(card);

      const onTransitionEnd = (e) => {
        if (e.propertyName !== 'transform') return;
        modal.removeEventListener('transitionend', onTransitionEnd);
        modal.classList.remove('active');
        modal.style.transition = 'none';
        modal.style.transform = '';
        void modal.offsetWidth;
        modal.style.transition = '';
      };
      modal.addEventListener('transitionend', onTransitionEnd);

      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    openBtn.addEventListener('click', () => openModal(openBtn));
    closeBtn.addEventListener('click', () => closeModal(openBtn));
    overlay.addEventListener('click', () => closeModal(openBtn));
    renderSteps();
  }

  initModal('individualModal', 'openIndividualModal', 'closeIndividualModal');
  initModal('systemicModal', 'openSystemicModal', 'closeSystemicModal');
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

/* ── Yönlü Scroll Paging: aşağı tek scroll = bir bölüm ileri, yukarı serbest ──
   Kullanıcı isteği: aşağı scroll yaparken bölümler arasında otomatik geçiş
   olsun, ama yukarı scroll tamamen serbest kalsın (snap zorlamasın). Bu yüzden
   sadece deltaY > 0 (aşağı) olan wheel event'leri preventDefault edilip
   scrollIntoView ile bir sonraki bölüme atlanır; yukarı yönde hiçbir şeye
   dokunulmaz. */
(function () {
  const sections = Array.from(document.querySelectorAll(
    '.hero-section, .sdg-section, #causes-section, #consequences-section, #actions-section, #progress-section, #resources-section'
  ));
  if (!sections.length) return;

  const PAGING_COOLDOWN_MS = 900;
  const WHEEL_DELTA_THRESHOLD = 4;
  let isPaging = false;

  // İlerleme bölümü artık tek bir sticky kart-yığını (N×100vh yüksekliğinde
  // doğal scroll alanı); kartlar arasında geçiş normal sayfa scroll'uyla
  // olur. Bölümün içindeyken ve henüz sonuna gelinmediyse sayfalamayı
  // devre dışı bırakıp scroll'u tamamen serbest bırakıyoruz.
  const progressSection = document.getElementById('progress-section');

  function currentSectionIndex() {
    const probe = window.scrollY + window.innerHeight / 2;
    let idx = 0;
    sections.forEach((section, i) => {
      // section.offsetTop, en yakın position:relative atadaki konuma göre
      // ölçer — bu artık bazı bölümler için body değil .flow-photo-wrap
      // olabiliyor (yanlış/küçük değerler verip sayfalamayı bozuyordu).
      // getBoundingClientRect().top + scrollY her zaman belge-bağıl, doğru
      // konumu verir.
      const docTop = section.getBoundingClientRect().top + window.scrollY;
      if (docTop <= probe) idx = i;
    });
    return idx;
  }

  window.addEventListener('wheel', (e) => {
    if (e.deltaY <= WHEEL_DELTA_THRESHOLD) return;

    // Açık bir modal varsa (Ne Yapmalıyız adım modalı gibi) sayfalama'ya
    // hiç dokunma, modalın kendi scroll/etkileşimi serbest kalsın.
    if (document.querySelector('.action-modal.active')) return;

    // "İki Olası Gelecek" panelleri kendi içinde dikey scroll oluyor; panelin
    // içinde hâlâ aşağı kaydırılacak içerik varsa önce onu bitirsin, bölüm
    // sayfalaması yalnızca panel sonuna gelindikten sonra devreye girsin.
    const innerScroll = e.target.closest('.future-panel-scroll');
    if (innerScroll && innerScroll.scrollTop + innerScroll.clientHeight < innerScroll.scrollHeight - 1) {
      return;
    }

    if (isPaging) {
      e.preventDefault();
      return;
    }

    if (progressSection) {
      const rect = progressSection.getBoundingClientRect();
      // scrollIntoView, scroll-padding-top boşluğu yüzünden bölümün üstünü
      // tam 0'a değil ~80px'e oturtur — bu yüzden burada "tepeye yakın" diye
      // gevşek bir eşik kullanmak gerekiyor; katı "<=1" eşiği hiç tetiklenmediği
      // için kart yığını içinde tek bir wheel tıkında sonraki bölüme atlanıyordu.
      // isPaging kontrolünden SONRA çalışıyor ki sıçrama animasyonu sürerken
      // (henüz rect henüz yerleşmemişken) yanlışlıkla serbest scroll'a düşmesin.
      if (rect.top <= 120 && rect.bottom > window.innerHeight + 1) {
        return;
      }
    }

    const next = sections[currentSectionIndex() + 1];
    if (!next) return; // son bölümden sonrası (footer) serbest scroll'a açık

    e.preventDefault();
    isPaging = true;
    next.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => { isPaging = false; }, PAGING_COOLDOWN_MS);
  }, { passive: false });
})();

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

  function animateCounter(el) {
    const end = parseFloat(el.dataset.counterEnd || '0');
    const decimals = parseInt(el.dataset.counterDecimals || '0', 10);
    const DURATION_MS = 1400;
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
  if (!heading) return;

  const SKEW_SENSITIVITY = 60;
  const SKEW_MAX_DEG = 18;
  const SPRING_FACTOR = 0.12;

  heading.style.transformOrigin = 'left center';

  let lastY = window.scrollY;
  let lastT = performance.now();
  let currentSkew = 0;

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
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();

/* ── "Adımları Keşfet" CO2 Attract Button ──
   Referans AttractButton'daki dağılmış parçacık mıknatıslama efekti, nokta
   yerine küçük "CO₂" etiketleriyle: buton etrafına rastgele dağılmış CO₂
   yazıları, üzerine gelince butona doğru "çekilir", ayrılınca eski dağınık
   konumlarına geri döner. */
(function () {
  const PARTICLE_COUNT = 14;
  const SCATTER_RADIUS_MIN_PX = 40;
  const SCATTER_RADIUS_MAX_PX = 170;

  document.querySelectorAll('.co2-attract-btn').forEach((btn) => {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Tamamen rastgele açı + rastgele yarıçap: parçacıklar düzenli bir
      // çember üzerinde değil, butonun her yönünde dağınık noktalarda durur.
      const angle = Math.random() * Math.PI * 2;
      const radius = SCATTER_RADIUS_MIN_PX + Math.random() * (SCATTER_RADIUS_MAX_PX - SCATTER_RADIUS_MIN_PX);
      const tx = Math.cos(angle) * radius;
      const ty = Math.sin(angle) * radius;
      const rot = (Math.random() * 30 - 15).toFixed(1);

      const particle = document.createElement('span');
      particle.className = 'co2-particle';
      particle.textContent = 'CO₂';
      particle.style.setProperty('--tx', `${tx.toFixed(1)}px`);
      particle.style.setProperty('--ty', `${ty.toFixed(1)}px`);
      particle.style.setProperty('--rot', `${rot}deg`);
      btn.appendChild(particle);
    }
  });
})();
