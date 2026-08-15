# 05 — Doğrulama ve Final Raporu (Faz 7)

**Not:** Şablonda bu dosya `04-ozet.md` olarak adlandırılmış; Faz 5/6 raporlarıyla numara çakışmaması için `05` kullanıldı.

## Doğrulama

- **typecheck/lint/test/build:** Bu proje için karşılığı yok (framework/build aracı yok, Faz 0'da not edildi).
- **Silinen/taşınan medyaya kalan referans var mı?** Tüm projede (`index.html`, `style.css`, `script.js`) tarandı:
  - `_arsiv/` klasörüne taşınan 9 dosyaya hiçbir referans kalmadı — **0 sonuç**.
  - Faz 2'de silinen 13 ölü CSS seçici için hiçbir referans kalmadı — **0 sonuç**.
- **Ekran görüntüsü karşılaştırması:** Bu ortamda çalışan bir Python/Playwright kurulumu yok (Faz 2'de de karşılaşılan bir kısıt) — otomatik görsel karşılaştırma yapılamadı. Yapılan tüm değişiklikler statik olarak doğrulandı (CSS parantez dengesi, HTML yapı bütünlüğü, grep ile sıfır-referans teyidi). Kullanıcının tarayıcıda hızlı bir gezinme yapması önerilir.

## ⚠️ Kapsam dışı, çözülmemiş bulgu (Faz 1'den beri açık)

`index.html` içindeki **5 cause-stack-card** hâlâ `assets/image/backgrounds/` klasörüne referans veriyor, klasör diskte hâlâ yok (bu oturumun ilk commit'inden önce, muhtemelen önceki bir tasarım değişikliğinde silinmiş, referanslar temizlenmemiş). Bu temizlik görevinin kapsamı (ölü kod/kullanılmayan medya/çözünürlük/optimizasyon/metin) bu sorunu kapsamıyor — bir **görsel bug**, ayrı olarak ele alınmalı: ya bu 5 dosya bulunup eklenmeli ya da kartlar başka görsellerle güncellenmeli. Etkilenen kartlar: `index.html` içinde `--stack-img` ile `zbynek-burival-grmwvnvssdu-unsplash.jpg`, `jamie-morris-796foi6eo9o-unsplash.jpg`, `patrick-hendry-6xedizgopaw-unsplash.jpg`, `no-one-cares-l-5mjnbrmrs-unsplash.jpg`, `engin-akyurt-h4ggjhkhwf0-unsplash.jpg` kullanan kartlar.

## Öncesi / Sonrası Özet

| Metrik | Öncesi (main, `e92401a`) | Sonrası (`temizlik/2026-08-15`) | Değişim |
|---|---|---|---|
| `index.html` satır | 1368 | 1357 | −11 |
| `style.css` satır | 4039 | 3793 | −246 |
| `script.js` satır | 1886 | 1886 | 0 (1 satır içerik değişti, satır sayısı aynı) |
| Toplam kod satırı | 7293 | 7036 | −257 |
| `assets/` dosya sayısı | 115 | 106 | −9 (`_arsiv/`e taşındı) |
| `assets/` boyutu | ~52 MB | ~50 MB | −~1.5 MB |
| CDN kütüphane sayısı | 7 | 7 | değişmedi (şablon kuralı: sürüm/bağımlılık değişikliği yok) |
| Preconnect kapsamı (render-blocking CSS origin) | 3/5 (%60) | 5/5 (%100) | +2 origin |
| Ölü CSS seçici | 13 (+2 `@keyframes`) | 0 | −13 |
| Kırık medya referansı | 5 | 5 | **değişmedi — kapsam dışı, yukarıda not edildi** |
| Kullanılmayan medya (referanssız) | 42 dosya (~7.8 MB) | 33 dosya (~6.3 MB, `image/un/`, bilinçli korundu) | −9 dosya arşivlendi |
| Düşük çözünürlüklü öncelik listesi | — | 11 dosya (bekliyor, değiştirilmedi) | yeni tespit |
| AI-klişe metin adayı | 7 | 0 | −7 |

## Geri Alma Talimatı

Tüm temizlik çalışması `main`'den ayrılan `temizlik/2026-08-15` dalında, 6 ayrı commit halinde:

| Commit | Faz | İçerik | Geri alma |
|---|---|---|---|
| `e92401a` | Faz 0 hazırlık | Bu oturumun tüm önceki (tema/timeline) işi `main`'e commit'lendi | `main` dalının kendisi — geri alınmaz, bu temizliğin başlangıç noktası |
| `13fe318` | Faz 2 | 13 ölü CSS seçici + dil değiştirici iskeleti silindi | `git revert 13fe318` |
| `a0bf2a2` | Faz 3 | 9 dosya `_arsiv/`e taşındı | `git revert a0bf2a2` (dosyaları `assets/` konumuna geri koyar) |
| `47cb320` | Faz 4 | Çözünürlük raporu (dosya değişikliği yok) | `git revert 47cb320` |
| `04a5d6f` | Faz 4 | Öncelik listesi eklendi (rapor) | `git revert 04a5d6f` |
| `a40e376` | Faz 5 | 2 preconnect eklendi | `git revert a40e376` |
| `5aa6c87` | Faz 6 | 7 metin değişikliği | `git revert 5aa6c87` |

**Tüm temizlik dalını geri almak için:** `main` dalına geç, `temizlik/2026-08-15` dalını hiç merge etmeden sil (`git branch -D temizlik/2026-08-15`) — `main` hiç etkilenmedi.

**Temizliği kalıcı hale getirmek için:** `temizlik/2026-08-15` → `main`'e merge edilmeli (kullanıcı onayı gerekir, bu rapor bunu otomatik yapmaz).

**`_arsiv/` içindeki 9 dosyanın kalıcı silinmesi:** Kullanıcı doğruladıktan sonra `git rm -r iklim-krizi/_arsiv` ile ayrı bir commit'te yapılmalı (şablon kuralı — arşivleme ile kalıcı silme iki ayrı onay adımı).

## Kapsam dışı bırakılanlar (bilinçli kullanıcı kararları)

- `image/un/` klasörü (33 dosya, 6.3 MB) — kullanılmıyor ama dokunulmadı, ileride kullanılacağı varsayılıyor.
- 11 düşük çözünürlüklü fotoğraf — önceliklendirildi ama değiştirilmedi (yeni görsel kaynağı bulma bu görevin kapsamında değil).
- 24 webp/avif dosyanın çözünürlüğü — bu ortamda ölçülemedi, karar verilmedi.
