# Review: 2026-10-18-italy-crag-cala-gonone（中英共用）

日期：2026-10-18。文章：`src/content/posts/climbing/2026-10-18-italy-crag-cala-gonone.md`、`-en.md`。研究筆記：`.research/2026-10-18-italy-crag-cala-gonone.md`。系列〈義大利岩場〉order 2001。獨立審稿（非原作者）。

toolDegradation：Groundlane MCP「not connected」→ Groundlane 直接 HTTP 401 → 頁面改用 r.jina.ai 讀取（多個並行 session 觸發 429，改逐頁重試）；calagonone.eu 攀岩頁 jina 回 CAPTCHA，改用 Exa web_fetch_exa；theCrag 兩頁 jina 只回空殼，改用 Exa。ARST 時刻表直接 curl 讀取。

## post-verify

本次重開全部 13 個引用來源＋ Climbing Sardinia 的 La Poltrona、Budinetto、Cala Luna – Grottoni 子區頁，抽 26 條宣告。

- 🟢 theCrag 總覽：1,001 條、Mostly Sport；Cala Fuili 251、Cala Luna 179、Margheddie 113、La Poltrona 76、Biddiriscottai 60、Buchi Arta 53、Millennium 35、Grotta dei Colombi 4；Conca 2025 guidebook「9 best sport climbing areas」「over 700 routes」。
- 🟢 Climbing Sardinia 總覽：「Sardinia's climbing paradise」「Over 50 climbing sectors」；Biddiriscottai 46 條鈦錨栓＋5 條多段、10 條 6a–6a+ 多段；Puschtra 2024 換鈦；夏季 Sardi di Cuore／Fuili Spigolo 2 pm、Fuili Ferry 5 pm、Buchi Arta「on shade until 1 pm」、7a max；冬季 La Poltrona、Budinetto；Grotta dei Colombi 垂降進入、L'alchimista 6c 鈦；Pederiva／Thailandia／Raoni／Zedda Piras；S'atta Ruja 90+ 條 6a–7b。
- 🟢 Climb Europe：single pitch、hard limestone；Millennium F6a–F8c+、比 Grande Grotta；Grotta dei Colombi 多段 210 m、6b–6c；Margheddie 150 m、4b–8a；Cala Fuili 5a–8c；秋到春；60 m＋16 快扣、多段 70 m＋扁帶、部分雙繩。
- 🟢 calagonone.eu 攀岩頁：春秋最好、全年可爬；2021 更新、correnti galvaniche 由內侵蝕；Biddiriscottai 過半換鈦；Oviglia 在 Millennium 用 inox marino＋鈦固定點；Piguet 在 Cala Fuili 海灘換鈦；ASD Ortoblock 重打 Codula Fuili；Cala Luna 與 Puschtra「molto, molto pericoloso」。
- 🟢 calagonone.eu 交通頁：ARST Nuoro (+39) 0784 290800；「ignore the instruction of the navigator」、Monte Bardia 隧道；Mistral 陣風、受山谷導向。
- 🟢 ARST 520：努奧羅 Centro Intermodale 06:55 → Via Cala Luna-Poste 08:04（逐站核對時間鏈）；Dorgali Lamarmora 07:41 → 08:04 約 20 分鐘；運行條件 FER／FEST／SCO 等。
- 🟢 La Favorita：SS131DCN 約 70 km、Dorgali 出口、SP38→SS125→SP26；Olbia 機場 120 km／1 h 30、Cagliari 210 km。
- 🟢 theCrag Millennium：座標 40.290570, 9.640568；1.8 km 碎石路；「It's not a full-on via ferrata」、單條 PAS、一段值得掛；約 45 分鐘；Millennium Bug 7b+ 110 m 5 段、12 快扣、2×50 m、FA 2010；Millennium 7c+ 40 m 2 段；Il vecchio e il mare 8b 60 m 2 段；Opus 掛「Corroded bolts」。
- 🟢 Planetmountain：Giupponi & Oviglia 30/06/2011 ground-up、FFA 19/10/2011；必要 7a；「more dangerous for the second than the leader」；Carto/Osalla、第一個髮夾彎直上水泥路轉碎石路。
- 🟢 Climbing Sardinia 鈦錨栓說明（2025-01-18）：抗腐蝕但不耐磨、鋼鋁碰鈦鏽得快、跟攀時加鉤環、別留快扣、留鉤環或穿錨栓下降。
- 🟢 SardegnaTurismo：出 Dorgali 短隧道後見奧羅塞灣；Ziu Martine 距村三公里多、在國家公園範圍內。Versante Sud：Felderer、2024、480 頁、含 Oliena／Gonone／Baunei／Jerzu／Ulassai。
- 🔵→已修：**Cala Luna 的風險寫得太輕。** 原文「查到的來源沒有後續整修紀錄」；Climbing Sardinia 的 Cala Luna – Grottoni 子區頁寫錨栓全不可靠、岩面濕滑、上方落石、「please choose a different location」，且因當初未經許可打錨栓、屬受保護地景而拿不到重打許可，可能整區拆除。中英規範節補成獨立一條，子區表的 Cala Luna 列加警告，參考資料加該頁。
- 🔵→已修：Cala Luna 接近方式原寫「Gommone（橡皮艇）」，英文子區頁實際寫「Approach by boat」、從 Buchi Arta 走 90 分鐘；改成這兩個查得到的寫法。
- 🔵→已修：子區卡片標籤原寫義大利文「Falesia invernale」「Tutto l'anno」，連結的英文頁實際是「Winter crag」「Climb all year」，改成英文原文。
- 🔵→已修：ARST 連結 `arstspa.info/520.pdf` 現已 302 轉到 `app.arstspa.it/quadri/520.html`（HTML，不是 PDF），中英三處連結更新、拿掉「PDF」；FER 原譯「平日」，改「feriale，非假日」。
- 🔵→已修：L'alchimista 難度兩來源不同（Climbing Sardinia 6c、calagonone.eu 6c+、210 m），並列；calagonone.eu 也把它列在 Grotta dei Colombi，原「Biddiriscottai（calagonone.eu）」的岩區歸屬改為 Grotta dei Colombi。
- 🔵→已修：Il vecchio e il mare 難度 theCrag 8b、calagonone.eu 8a，並列。
- 🔵→已修：「Climbing Sardinia 與兩位合作者」補上 Louis Piguet、Mario Ogliengo 的名字（兩個來源都有）。
- 🔵→已修：國家公園原寫「這段海岸屬於」，來源只說 Ziu Martine 海灘在範圍內，改成這個寫法。
- 🟡→已改弱：「作者 2017 年另有義大利文版」— 本次讀到的 theCrag 頁沒列 2017 版作者，改成「theCrag 另列一本 2017 年的義大利文《Arrampicare a Cala Gonone》」。
- 未寫入（維持作者決定）：鳥類繁殖期封閉（開過的來源都沒有）、Olbia→Nuoro 的巴士業者與班次。
- 備註未改：calagonone.eu 把「grottone dei Colombi」稱為 Millennium，與 theCrag／Climb Europe 把兩者分成兩區不同；文章照 theCrag 分區，影響不大。

本次只檢查了文中已提出的宣告，未評估文章對主題的覆蓋是否完整（覆蓋交 post-review）。
- 🔵→已改版（2026-10-18，依程度分級）：「代表性路線」改成「依程度挑路線」四級表（入門 5／中級 6／進階 6／高手 3），中英同步，原有 4 條＋Millennium Bug 首攀落差、Harry Potter／Gli Dei tossici 句全保留。新增並開啟查證的來源：Mountain Project Classic Climbs（Spigolo Fuili 5a、Vai Tossina! 5c、The Oblong Box 6a+、Porto io i nuts! 6b、Opus 6b、33 Trentini 6c、Condom Stress 6c+、Il Mio Miglior Amico 7a、Crisi al buio 7a+、La Legge Delle Chiodande 7b；Millennium 標 7a 兩段，與 theCrag 7c+ 並列；Trentatre trentini theCrag 6b+／MP 6c 並列）；thetopo Cala Fuili 路線表（Banane al cioccolato 5、Alta marea 6a、Raoni 8a 等攀登數與評分，Ferry 子區多數 4–5+）；Climbook Amelia（Il bacio della sirena 5c 14 次、Alta marea 11 次）；Climbing Sardinia Pederiva 頁（「the reign of the 7 grade」、Cappuccetto rosso 7a 1989 Pederiva、L'anno nuovo 8a 2007 Bertoni、25 m）。Cala Luna 警告在表後保留一行。分布句來源沒有，略過。沒有空的等級。
- 🔵→已補（2026-10-18 指南書）：「查資料的入口」改成「指南書」區塊並加註「路線難度與路線數主要來自 theCrag、Mountain Project 等線上資料庫，以指南書為準」，中英同步，新連結補進參考資料。收錄：Segnavia《Arrampicare a Cala Gonone》／《Climbing in Cala Gonone》第 10 版（2025，分語言、104 頁精選，取代 2017 第 9 版）、Versante Sud《Sardegna Est Falesie》（2024）、Pietra di Luna《Sardinia – The 100 Finest Multipitch Sport Climbs》（2026-02）；註明無 Rockfax 書；來源 edizionisegnavia.it（Exa）、versantesud.it、Climb Europe、Oliunìd、UKC。完整欄位表見 `.research/2026-10-18-italy-guidebooks.md`。工具降級：Groundlane MCP、firecrawl 未連線 → Keenable 搜尋＋curl 抓出版社頁＋Exa web_fetch（Cloudflare 擋頁）。

## post-review

- 機械檢查：`pnpm check:tw`（zh）0 blocking、0 to review；`check:references` 0 error（本篇無警告）；`check:lang-parity` OK；`check:post-quality` 本篇未列名；`check-process-leak` 對本篇兩檔無輸出。
- frontmatter：tags 6 個（含 sardinia）；tldr 有 1,001 條、季節、錨栓鏽蝕、ARST 520 具體名詞；description 列章節、不重複 tldr；series「義大利岩場」order 2001，中英一致。
- 結構：與日本範本 `2026-10-12-japan-crag-ogawayama.md` 同樣七節（這是什麼樣的岩場／什麼季節去／怎麼去〔大眾運輸、開車、停車〕／去之前要知道的規範／代表性路線／查資料的入口／參考資料）＋語言導覽列 ✅。
- 首次出現專名 inline 連結：theCrag、Climbing Sardinia、Climb Europe、calagonone.eu、ARST、La Favorita、SardegnaTurismo、Planetmountain、Versante Sud 都有；新增的 Cala Luna 子區頁連結中英都補上。
- 中英對齊：本輪所有修正同時套到中英；夏季背陰岩區中文拆成清單後，英文同步拆成清單。
- 跨篇連結：本篇沒有提到其他義大利岩場篇，無 sibling 連結需求（範本也沒有）。
- 風險排序：原稿把 Cala Luna 寫成一般子區，讀者可能照表去爬；修正後子區表、接近、規範三處都提示改去別區。

## post-polish

- 第一輪 register-scan：長句 9 句、但書 4/35 段（11%）、引述 0、姓名當主詞 0、模板化轉折 0、英文術語 0；數字密度 4 段（夏季背陰、ARST、開車路線、Millennium Bug 首攀）。
- 已改：開頭段的分號長句拆成兩句；「適合誰」的分號拆句；夏季背陰岩區的三段分號串改成三點清單（同時解除數字密度）；Millennium 接近路 70 字長句拆成三句，「有一段墜落就完了，值得掛上」改成「有一段一摔就完了，那段要掛上」；開車路線拆成兩句；國家公園段拆句。
- 保留：ARST 與開車路線的數字（時刻、公里、道路編號是讀者要照抄的資訊）；Millennium Bug 首攀兩來源並列的段落（是查證差異，不刪）。
- 保護片段（數字、引號、連結）回讀未變；改後重跑 check:tw、check:references、check:lang-parity 皆同前。
