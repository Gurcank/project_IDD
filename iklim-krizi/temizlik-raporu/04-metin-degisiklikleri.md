# 04 — Metin Değişiklikleri (Faz 6)

**Not:** Şablonda bu rapor `03-metin-degisiklikleri.md` olarak adlandırılmış, ancak Faz 5 çıktısı zaten `03-kod-optimizasyonu.md` adını aldığından çakışmayı önlemek için `04` numarası kullanıldı.

**Kapsam:** `index.html` + `script.js` içindeki tüm kullanıcıya görünen metin (başlıklar, paragraflar, kart açıklamaları, buton/etiket metinleri, veri dizilerindeki string alanlar) tarandı. **7 aday** bulundu, hepsi ±%15 karakter sınırı içinde. Marka adı, kurum adları (NASA/BM/ÇŞB/TÜİK), tarih, sayısal veri, kaynak linki hiçbirine dokunulmadı. Buton/nav/tab metinlerinde klişe bulunmadı.

**Bilinçli olarak işaretlenmeyen:** SDG 7 verisindeki "uygun fiyatlı, güvenilir, sürdürülebilir ve modern enerji" — bu BM'nin resmi SDG 7.1 hedef metninin birebir çevirisi, klişe değil kaynak sadakati.

| # | Konum | Öncesi | Sonrası | Karakter (önce→sonra) | Kategori |
|---|---|---|---|---|---|
| 1 | `index.html:127` (Hero) | "Gerçeği tüm çıplaklığıyla hissetmeye hazır mısınız?" | "Gerçek, tüm çıplaklığıyla karşımızda duruyor." | 51→45 (−11,8%) | Retorik "hazır mısınız?" kanca kalıbı + ses tutarsızlığı ("biz" dilinden "siz"e ani geçiş) |
| 2 | `index.html:419` (Deniz Sıcaklığı, NASA paragrafı) | "...okyanusun ısınması yalnızca deniz suyu sıcaklığıyla sınırlı kalmıyor — kasırgalardan mercan resiflerine, deniz buzundan derin okyanus akıntılarına kadar zincirleme etkiler yaratıyor." | "...okyanusun ısınması geniş bir zincirleme etki yaratıyor: kasırgalardan mercan resiflerine, deniz buzundan derin okyanus akıntılarına kadar birçok süreci birlikte değiştiriyor." | 182→174 (−4,4%) | "Sadece/yalnızca X değil" kontrast kalıbı |
| 3 | `index.html:534` (Sebepler başlık açıklaması) | "Sebepleri anlamak, çözümün ilk adımıdır." | "Sebepleri bilmek, çözüm yolunu gösteriyor." | 40→42 (+5%) | Paragrafı özet/slogan cümlesiyle kapatma |
| 4 | `index.html:1021` (Ne Yapmalıyız, bireysel grup açıklaması) | "Her gün attığın küçük adımlar, toplamda büyük bir fark yaratır." | "Her gün attığın küçük adımlar, zamanla büyük bir sonuca dönüşür." | 63→64 (+1,6%) | "Fark yaratmak" şablon ifadesi |
| 5 | `index.html:1027` (Ne Yapmalıyız, toplumsal grup açıklaması) | "Gerçek dönüşüm politika, teknoloji ve kolektif eylemle gelir." | "Toplumsal dönüşüm politika, teknoloji ve kolektif eylemle ilerler." | 61→66 (+8,2%) | "Gerçek X, Y ile gelir" motivasyonel slogan kalıbı |
| 6 | `index.html:1307-1310` (Kaynaklar/kapanış metni) | "İklim için harekete geçmek, yalnızca bilimin değil, sanatın, teknolojinin ve dayanışmanın da ortak sorumluluğudur. Değişim ise birlikte düşündüğümüzde, ürettiğimizde ve harekete geçtiğimizde mümkündür. Çünkü iklim krizi tek bir alanın değil, insanlığın yaratıcılığının sınavıdır." | "İklim için harekete geçmek; bilimin, sanatın, teknolojinin ve dayanışmanın ortak sorumluluğudur. Değişim, birlikte düşündüğümüzde, ürettiğimizde ve harekete geçtiğimizde mümkün olur. İklim krizi, birçok alanın bir arada çalışmasını gerektiren bir sınavdır." | 279→256 (−8,2%) | "Sadece/yalnızca X değil, Y de" kalıbı (2 kez) + abartılı öz-tanım kapanışı |
| 7 | `script.js:1401` (bireysel adım verisi, enerji) | "...Bekleme modundaki cihazların çektiği "hayalet enerji" bile fark yaratabiliyor — bu küçük alışkanlıklar yılda 200 kg'a kadar CO₂ tasarrufu sağlayabilir." | "...Bekleme modundaki cihazların çektiği "hayalet enerji" bile boşuna tüketiliyor — bu küçük alışkanlıklar yılda 200 kg'a kadar CO₂ tasarrufu sağlayabilir." | 77→77 (0%) | "Fark yaratmak" şablon ifadesi |

## Karar ve uygulama

Kullanıcı onayı: **7 değişikliğin tamamı onaylandı ve uygulandı** (`index.html`: 6 değişiklik, `script.js`: 1 değişiklik). Başlık hiyerarşisi, marka/kurum adları, tarih, sayısal veri ve kaynak linkleri değişmedi.
