# 05 — Doğrulama ve Final Raporu (Faz 7)

**Not:** Şablonda bu dosya `04-ozet.md` olarak adlandırılmış; Faz 5/6 raporlarıyla numara çakışmaması için `05` kullanıldı.

## Doğrulama

- **typecheck/lint/test/build:** Bu proje için karşılığı yok (framework/build aracı yok, Faz 0'da not edildi).
- **Silinen/taşınan medyaya kalan referans var mı?** Tüm projede (`index.html`, `style.css`, `script.js`) tarandı:
  - `_arsiv/` klasörüne taşınan 9 dosyaya hiçbir referans kalmadı — **0 sonuç**.
  - Faz 2'de silinen 13 ölü CSS seçici için hiçbir referans kalmadı — **0 sonuç**.
- **Ekran görüntüsü karşılaştırması:** Bu ortamda çalışan bir Python/Playwright kurulumu yok (Faz 2'de de karşılaşılan bir kısıt) — otomatik görsel karşılaştırma yapılamadı. Yapılan tüm değişiklikler statik olarak doğrulandı (CSS parantez dengesi, HTML yapı bütünlüğü, grep ile sıfır-referans teyidi). Kullanıcının tarayıcıda hızlı bir gezinme yapması önerilir.

## ✅ Kırık `backgrounds/` referansları — çözüldü (ayrı iş olarak, Faz 7 sonrası)

Kök neden analizi yapıldı: bu 5 referans, 5 adet **dış** `.cause-stack` sarmalayıcı `<div>`'in inline `--stack-img` stiliydi. CSS'te `--stack-img` sadece `.cause-stack-card` kuralında (`background-image: ...var(--stack-img)`) tüketiliyor; her tek kart (`.cause-stack-card`, toplam 30 adet) kendi `causes/` fotoğrafını inline olarak AYRICA tanımlıyor ve bu, dıştaki sarmalayıcıdan miras alınan değeri her zaman gölgeliyor. Yani bu 5 URL tarayıcı tarafından **hiçbir zaman indirilmiyor/render edilmiyordu** — görsel etkisi sıfır olan, tamamen ölü bir inline attribute'tu. Çözüm: yeni fotoğraf kaynağı bulmaya gerek kalmadan, 5 sarmalayıcıdaki ölü `style="--stack-img:url('assets/image/backgrounds/...)"` attribute'ları kaldırıldı (`index.html`, `energy`/`deforestation`/`industry`/`agriculture`/`transport` stack'leri). Görsel çıktı değişmedi (zaten hiç render edilmiyordu); `grep "assets/image/backgrounds/" index.html` artık 0 sonuç veriyor.

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
| Kırık medya referansı | 5 | 0 | −5 (ölü kod olduğu tespit edilip kaldırıldı, yukarıda detay var) |
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
