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
  let rotationAngle = 0;
  let autoRotate = true;
  let animFrameId = null;
  let activeId = null;

  /* ── 3. DOM REFERANSLARI ─────────────────────────────────── */
  const canvas = document.getElementById('sdgCanvas');
  const infoCard = document.getElementById('sdgInfoCard');
  const cardInner = document.getElementById('sdgCardInner');
  const navDots = document.getElementById('sdgNavDots');

  if (!canvas || !infoCard || !cardInner || !navDots) {
    return;
  }

  /* ── 4. YARDIMCI FONKSİYONLAR ───────────────────────────── */
  function getRadius() {
    const w = window.innerWidth;
    if (w > 1100) return 240;
    if (w > 991) return 210;
    if (w > 575) return 150;
    return 125;
  }

  function imgSrc(id) {
    return 'assets/image/E_WEB_' + String(id).padStart(2, '0') + '.png';
  }

  /* ── 5. NODE'LARI OLUŞTUR ───────────────────────────────── */
  sdgData.forEach(function (sdg) {
    var node = document.createElement('div');
    node.className = 'sdg-node';
    node.setAttribute('data-id', sdg.id);
    node.style.setProperty('--sdg-node-color', sdg.color);

    var img = document.createElement('img');
    img.className = 'sdg-node-logo';
    img.src = imgSrc(sdg.id);
    img.alt = 'SDG ' + sdg.id + ': ' + sdg.title;
    img.setAttribute('draggable', 'false');
    img.setAttribute('loading', 'lazy');
    img.onerror = function () {
      // Logo yüklenemezse SDG numarası göster
      this.style.display = 'none';
      var fallback = document.createElement('div');
      fallback.style.cssText = [
        'width:' + this.width + 'px',
        'height:' + this.height + 'px',
        'border-radius:8px',
        'background:' + sdg.color,
        'color:#fff',
        'display:flex',
        'align-items:center',
        'justify-content:center',
        'font-weight:900',
        'font-size:0.85rem',
        'font-family:Montserrat,sans-serif'
      ].join(';');
      fallback.textContent = sdg.id;
      this.parentNode.appendChild(fallback);
    };

    node.appendChild(img);

    node.addEventListener('click', function (e) {
      e.stopPropagation();
      handleNodeClick(sdg.id);
    });

    canvas.appendChild(node);
  });

  /* ── 6. NAV DOTS OLUŞTUR ────────────────────────────────── */
  sdgData.forEach(function (sdg) {
    var dot = document.createElement('button');
    dot.className = 'sdg-dot';
    dot.setAttribute('data-id', sdg.id);
    dot.setAttribute('title', 'SDG ' + sdg.id + ': ' + sdg.title);
    dot.setAttribute('aria-label', 'SDG ' + sdg.id + ': ' + sdg.title);

    dot.addEventListener('click', function (e) {
      e.stopPropagation();
      handleNodeClick(sdg.id);
    });

    navDots.appendChild(dot);
  });

  var nodes = canvas.querySelectorAll('.sdg-node');

  /* ── 7. ANİMASYON DÖNGÜSÜ ───────────────────────────────── */
  function updatePositions() {
    var total = sdgData.length;
    var radius = getRadius();

    nodes.forEach(function (node, index) {
      if (node.classList.contains('sdg-is-active')) {
        node.style.transform = 'translate3d(0px,-72px,0)';
        node.style.opacity = '1';
        node.style.zIndex = '500';
        return;
      }
      if (node.classList.contains('sdg-dimmed')) {
        // opacity set by class
        return;
      }

      var angle = ((index / total) * 360 + rotationAngle) % 360;
      var rad = (angle * Math.PI) / 180;
      var x = radius * Math.cos(rad);
      var y = radius * Math.sin(rad);
      var depth = Math.cos(rad);
      var zIndex = Math.round(100 + 40 * depth);
      var opacity = Math.max(0.35, Math.min(1, 0.35 + 0.65 * ((1 + Math.sin(rad)) / 2)));

      node.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
      node.style.zIndex = zIndex;
      node.style.opacity = opacity;
    });

    if (autoRotate) {
      rotationAngle = (rotationAngle + 0.16) % 360;
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
    nodes.forEach(function (n) {
      n.classList.remove('sdg-is-active');
      n.classList.add('sdg-dimmed');
      n.style.opacity = '';
      n.style.zIndex = '10';
    });

    var activeNode = canvas.querySelector('.sdg-node[data-id="' + id + '"]');
    if (activeNode) {
      activeNode.classList.remove('sdg-dimmed');
      activeNode.classList.add('sdg-is-active');
      activeNode.style.transform = 'translate3d(0px,-72px,0)';
      activeNode.style.opacity = '1';
      activeNode.style.zIndex = '500';
    }

    showInfoCard(id);
  }

  /* ── 9. BİLGİ KARTINI GÜNCELLE ─────────────────────────── */
  function showInfoCard(id) {
    var sdg = sdgData.find(function (s) { return s.id === id; });
    if (!sdg) return;


    // CSS değişkenini card inner'a uygula
    cardInner.style.setProperty('--sdg-color', sdg.color);

    cardInner.innerHTML =
      '<div class="sdg-card-top">'
      + '<img class="sdg-card-logo" src="' + imgSrc(sdg.id) + '" alt="SDG ' + sdg.id + '" onerror="this.style.display=\'none\'">'
      + '<div class="sdg-card-titles">'
      + '<h3>' + sdg.title + '</h3>'
      + '<p class="sdg-card-subtitle">Sürdürülebilir Kalkınma Hedefi ' + sdg.id + '</p>'
      + '</div>'
      + '</div>'
      + '<p class="sdg-card-desc">' + sdg.desc + '</p>'
      + '<div class="sdg-card-stat">'
      + '<div class="sdg-stat-value">' + sdg.stat + '</div>'
      + '<div class="sdg-stat-label">' + sdg.statLabel + '</div>'
      + '</div>';

    // Animasyonu sıfırla ve başlat
    infoCard.classList.remove('sdg-card-visible');
    void infoCard.offsetWidth; // reflow
    infoCard.classList.add('sdg-card-visible');

    // Nav dots güncelle
    navDots.querySelectorAll('.sdg-dot').forEach(function (dot) {
      var dotId = parseInt(dot.getAttribute('data-id'), 10);
      if (dotId === id) {
        dot.classList.add('sdg-dot-active');
        dot.style.background = sdg.color;
        dot.style.transform = 'scale(1.4)';
      } else {
        dot.classList.remove('sdg-dot-active');
        dot.style.background = '';
        dot.style.transform = '';
      }
    });
  }

  /* ── 10. SIFIRLAMA ──────────────────────────────────────── */
  function resetState() {
    activeId = null;
    nodes.forEach(function (n) {
      n.classList.remove('sdg-is-active', 'sdg-dimmed');
      n.style.opacity = '';
      n.style.zIndex = '';
      n.style.transform = '';
    });
    infoCard.classList.remove('sdg-card-visible');
    navDots.querySelectorAll('.sdg-dot').forEach(function (dot) {
      dot.classList.remove('sdg-dot-active');
      dot.style.background = '';
      dot.style.transform = '';
    });
    autoRotate = true;
    updatePositions();
  }

  /* ── 11. DIŞARI TIKLAMA → SIFIRLA ──────────────────────── */
  var sectionEl = document.getElementById('sdg-section');
  sectionEl.addEventListener('click', function (e) {
    if (activeId !== null
      && !e.target.closest('.sdg-node')
      && !e.target.closest('.sdg-info-wrapper')) {
      resetState();
    }
  });

  /* ── 12. PENCERE YENİDEN BOYUTLANMA ─────────────────────── */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (autoRotate && !animFrameId) {
        updatePositions();
      }
    }, 200);
  });

  /* ── 13. INTERSECTION OBSERVER — PERFORMANS ─────────────── */
  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
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

/* ── Reveal Sequencer ── */
(function () {
  var lines = document.querySelectorAll('.reveal-line');
  var cue = document.querySelector('.reveal-scroll-cue');
  if (!lines.length) return;

  var DISPLAY_MS = 2000;
  var index = 0;

  function showNext() {
    var current = lines[index];
    current.classList.add('visible');

    var isLast = index === lines.length - 1;

    if (!isLast) {
      setTimeout(function () {
        current.classList.remove('visible');
        current.classList.add('exit');
        index += 1;
        showNext();
      }, DISPLAY_MS);
    } else if (cue) {
      setTimeout(function () {
        cue.classList.add('visible');
      }, 800);
    }
  }

  showNext();
})();

/* ── Chart.js Bölümleri (lazy init via IntersectionObserver) ── */
(function () {
  if (typeof Chart === 'undefined') return;

  var chartInstances = {};

  var palette = {
    green: '#2c7933',
    lightGreen: '#56c02b',
    blue: '#0a97d9',
    amber: '#fcc30b',
    orange: '#fd6925',
    red: '#e5243b',
    brown: '#bf8b2e'
  };

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

  function initEmissionsDoughnutChart() {
    var ctx = document.getElementById('emissionsDoughnutChart');
    if (!ctx) return;
    chartInstances.emissionsDoughnut = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Enerji / Elektrik', 'Tarım, Orman ve Arazi', 'Sanayi', 'Ulaşım', 'Binalar'],
        datasets: [{
          data: [34, 22, 24, 15, 5],
          backgroundColor: [palette.blue, palette.brown, palette.orange, palette.red, palette.amber],
          borderColor: '#000',
          borderWidth: 2
        }]
      },
      options: baseOptions({
        plugins: {
          legend: {
            position: legendPosition(),
            labels: { color: 'rgba(255,255,255,0.7)' }
          }
        }
      })
    });
  }

  function initCo2LineChart() {
    var ctx = document.getElementById('co2LineChart');
    if (!ctx) return;
    chartInstances.co2Line = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['1960', '1980', '2000', '2010', '2020', '2024'],
        datasets: [{
          label: 'CO₂ (ppm)',
          data: [317, 339, 369, 389, 412, 424],
          borderColor: palette.lightGreen,
          backgroundColor: 'rgba(86,192,43,0.15)',
          fill: true,
          tension: 0.35,
          pointBackgroundColor: palette.lightGreen
        }]
      },
      options: baseOptions({
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: 'rgba(255,255,255,0.55)' }, grid: { color: 'rgba(255,255,255,0.06)' } },
          y: { ticks: { color: 'rgba(255,255,255,0.55)' }, grid: { color: 'rgba(255,255,255,0.06)' } }
        }
      })
    });
  }

  function initTempProjectionChart() {
    var ctx = document.getElementById('tempProjectionChart');
    if (!ctx) return;
    var years = ['2020', '2040', '2060', '2080', '2100'];
    chartInstances.tempProjection = new Chart(ctx, {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: 'SSP1-1.9 (Güçlü Eylem)',
            data: [1.1, 1.4, 1.5, 1.4, 1.4],
            borderColor: palette.lightGreen,
            backgroundColor: 'transparent',
            tension: 0.35
          },
          {
            label: 'SSP2-4.5 (Orta Yol)',
            data: [1.1, 1.6, 2.0, 2.4, 2.7],
            borderColor: palette.amber,
            backgroundColor: 'transparent',
            tension: 0.35
          },
          {
            label: 'SSP5-8.5 (Eylemsizlik)',
            data: [1.1, 1.9, 2.8, 3.6, 4.4],
            borderColor: palette.red,
            backgroundColor: 'transparent',
            tension: 0.35
          }
        ]
      },
      options: baseOptions({
        plugins: {
          legend: { position: legendPosition(), labels: { color: 'rgba(255,255,255,0.7)' } }
        },
        scales: {
          x: { ticks: { color: 'rgba(255,255,255,0.55)' }, grid: { color: 'rgba(255,255,255,0.06)' } },
          y: {
            ticks: { color: 'rgba(255,255,255,0.55)', callback: function (v) { return v + '°C'; } },
            grid: { color: 'rgba(255,255,255,0.06)' }
          }
        }
      })
    });
  }

  function initRenewableGrowthChart() {
    var ctx = document.getElementById('renewableGrowthChart');
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
      options: baseOptions({
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: 'rgba(255,255,255,0.55)' }, grid: { display: false } },
          y: { ticks: { color: 'rgba(255,255,255,0.55)' }, grid: { color: 'rgba(255,255,255,0.06)' } }
        }
      })
    });
  }

  var initializers = [
    { sectionId: 'causes-section', fn: function () { initEmissionsDoughnutChart(); initCo2LineChart(); } },
    { sectionId: 'consequences-section', fn: initTempProjectionChart },
    { sectionId: 'progress-section', fn: initRenewableGrowthChart }
  ];

  initializers.forEach(function (entry) {
    var section = document.getElementById(entry.sectionId);
    if (!section) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          entry.fn();
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });

    observer.observe(section);
  });
})();

/* ── Sayfa Genel JS ── */
document.addEventListener('DOMContentLoaded', function () {
  // --- Text Rotator Logic ---
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
    }, 600); // CSS transition süresi ile eşzamanlı
  }

  if (rotatorElement) {
    // İlk kelimeyi yükle
    animateRotator();
    // 3.5 saniyede bir döngüyü çalıştır
    setInterval(animateRotator, 3500);
  }
});

document.addEventListener('DOMContentLoaded', function () {
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
      if (currentScroll > 300) {
        scrollToTopButton.classList.add('show');
      } else {
        scrollToTopButton.classList.remove('show');
      }
    }
    isScrolling = false;
  }

  // Passive true ile tarayıcıya "scroll'u engellemeyeceğim" garantisi veriyoruz.
  window.addEventListener('scroll', function () {
    if (!isScrolling) {
      window.requestAnimationFrame(checkScroll);
      isScrolling = true;
    }
  }, { passive: true });
});
