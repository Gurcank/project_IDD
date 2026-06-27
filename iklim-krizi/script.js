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
    return `assets/image/E_WEB_${String(id).padStart(2, '0')}.png`;
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
        node.style.zIndex = '500';
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
      n.style.zIndex = '10';
    });

    const activeNode = canvas.querySelector(`.sdg-node[data-id="${id}"]`);
    if (activeNode) {
      activeNode.classList.remove('sdg-dimmed');
      activeNode.classList.add('sdg-is-active');
      activeNode.style.transform = `translate3d(0px,${ACTIVE_NODE_OFFSET_Y}px,0)`;
      activeNode.style.opacity = '1';
      activeNode.style.zIndex = '500';
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
        const panels = document.querySelectorAll('.results-panel');
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
        if (!document.querySelector('.action-columns')) return;
        gsap.from('.action-column:nth-child(1) .action-item', {
          opacity: 0, x: -30, duration: 0.5, stagger: 0.08, ease: 'power2.out'
        });
        gsap.from('.action-column:nth-child(2) .action-item', {
          opacity: 0, x: 30, duration: 0.5, stagger: 0.08, ease: 'power2.out'
        });
      }
    },
    {
      sectionId: 'progress-section',
      play: () => {
        if (!document.querySelector('#progress-section .info-card')) return;
        gsap.from('#progress-section .info-card', {
          opacity: 0, scale: 0.9, duration: 0.5, stagger: 0.08, ease: 'back.out(1.7)'
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

  const palette = {
    green: '#2c7933',
    lightGreen: '#56c02b',
    blue: '#0a97d9',
    amber: '#fcc30b',
    orange: '#fd6925',
    red: '#e5243b',
    brown: '#bf8b2e'
  };

  const AXIS_TICK_COLOR = 'rgba(255,255,255,0.55)';
  const AXIS_GRID_COLOR = 'rgba(255,255,255,0.06)';

  function legendPosition() {
    return window.matchMedia('(max-width: 575px)').matches ? 'bottom' : 'right';
  }

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

  /* Sade bar grafiklerin (legend gizli, ortak eksen stili) tekrar eden seçeneklerini tek yerden üretir. */
  function barOptions(extra) {
    return baseOptions(Object.assign({
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: AXIS_TICK_COLOR }, grid: { display: false } },
        y: { ticks: { color: AXIS_TICK_COLOR }, grid: { color: AXIS_GRID_COLOR } }
      }
    }, extra));
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

  function initCauseEnergyChart() {
    if (chartInstances.causeEnergy) return;
    const ctx = document.getElementById('causeEnergyChart');
    if (!ctx) return;
    chartInstances.causeEnergy = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Kömür', 'Doğal Gaz', 'Petrol', 'Yenilenebilir', 'Nükleer'],
        datasets: [{
          label: 'Küresel Elektrik Üretiminde Pay (%)',
          data: [35, 23, 3, 30, 9],
          backgroundColor: [palette.brown, palette.blue, '#555', palette.lightGreen, palette.amber],
          borderRadius: 6
        }]
      },
      options: barOptions()
    });
  }

  function initCauseDeforestationChart() {
    if (chartInstances.causeDeforestation) return;
    const ctx = document.getElementById('causeDeforestationChart');
    if (!ctx) return;
    chartInstances.causeDeforestation = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['2001', '2007', '2013', '2019', '2023'],
        datasets: [{
          label: 'Kaybedilen Orman Alanı (Milyon Hektar)',
          data: [12.8, 15.4, 17.9, 23.1, 28.3],
          borderColor: palette.brown,
          backgroundColor: 'rgba(191,139,46,0.18)',
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 6,
          pointBackgroundColor: palette.brown
        }]
      },
      plugins: [referenceLinePlugin(12.8, 'rgba(255,255,255,0.85)')],
      options: baseOptions({
        plugins: {
          legend: { display: false },
          tooltip: styledTooltip()
        },
        scales: {
          x: { ticks: { color: AXIS_TICK_COLOR }, grid: { color: AXIS_GRID_COLOR } },
          y: { ticks: { color: AXIS_TICK_COLOR }, grid: { color: AXIS_GRID_COLOR } }
        }
      })
    });
  }

  function initCauseIndustryChart() {
    if (chartInstances.causeIndustry) return;
    const ctx = document.getElementById('causeIndustryChart');
    if (!ctx) return;
    chartInstances.causeIndustry = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Çimento', 'Çelik', 'Kimyasallar', 'Diğer'],
        datasets: [{
          label: 'Endüstriyel CO₂ Emisyonu (Gt)',
          data: [2.6, 2.6, 1.4, 2.2],
          backgroundColor: palette.orange,
          borderRadius: 6
        }]
      },
      options: barOptions()
    });
  }

  function initCauseAgricultureChart() {
    if (chartInstances.causeAgriculture) return;
    const ctx = document.getElementById('causeAgricultureChart');
    if (!ctx) return;
    chartInstances.causeAgriculture = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Hayvancılık (Metan)', 'Gübre Kullanımı', 'Pirinç Tarımı', 'Diğer'],
        datasets: [{
          data: [44, 24, 12, 20],
          backgroundColor: [palette.lightGreen, palette.amber, palette.blue, '#777'],
          borderColor: '#000',
          borderWidth: 2
        }]
      },
      options: baseOptions({
        plugins: {
          legend: { position: legendPosition(), labels: { color: 'rgba(255,255,255,0.7)' } }
        }
      })
    });
  }

  function initCauseTransportChart() {
    if (chartInstances.causeTransport) return;
    const ctx = document.getElementById('causeTransportChart');
    if (!ctx) return;
    chartInstances.causeTransport = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Karayolu', 'Denizcilik', 'Havacılık', 'Demiryolu'],
        datasets: [{
          label: 'Ulaşım Türüne Göre CO₂ Payı (%)',
          data: [74, 11, 12, 3],
          backgroundColor: palette.red,
          borderRadius: 6
        }]
      },
      options: barOptions()
    });
  }

  function initRenewableGrowthChart() {
    const ctx = document.getElementById('renewableGrowthChart');
    if (!ctx) return;
    chartInstances.renewableGrowth = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['2015', '2018', '2020', '2022', '2024'],
        datasets: [{
          label: 'Yenilenebilir Enerji Kapasitesi (GW)',
          data: [1856, 2378, 2802, 3372, 4200],
          backgroundColor: palette.green,
          borderRadius: 6
        }]
      },
      options: barOptions()
    });
  }

  const initializers = [
    { sectionId: 'causes-section', fn: initCauseEnergyChart },
    { sectionId: 'progress-section', fn: initRenewableGrowthChart }
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
    'cause-deforestation': initCauseDeforestationChart,
    'cause-industry': initCauseIndustryChart,
    'cause-agriculture': initCauseAgricultureChart,
    'cause-transport': initCauseTransportChart
  };

  document.querySelectorAll('#causeTabsNav .cause-tab-btn').forEach((btn) => {
    btn.addEventListener('shown.bs.tab', (e) => {
      const targetId = e.target.getAttribute('data-bs-target').replace('#', '');
      const initFn = causeChartInitByTab[targetId];
      if (initFn) initFn();
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
    if (!cards.length) return;

    const setActive = (index) => {
      cards.forEach((card, i) => {
        card.classList.toggle('active', i === index);
        card.style.setProperty('--offset', i - index);
      });
    };

    cards.forEach((card, i) => {
      card.addEventListener('click', () => setActive(i));
    });

    var initialIndex = cards.findIndex((card) => card.classList.contains('active'));
    setActive(initialIndex === -1 ? 0 : initialIndex);
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
