# 垂降操作（how to rappel）— 專業來源證據表

研究日期：2026-10-24。所有列出的來源都已實際打開（curl 抓 HTML/PDF 轉文字後逐段讀；Jina Reader 只在 curl 抓不到時使用，有標註）。引文是原文或貼近原文的轉述；德文、義大利文來源附上中文轉述。

工具降級（toolDegradation）：
- Groundlane MCP：工具清單裡只有 `authenticate`，代表需要登入，無法搜尋或抓頁；直接 HTTP POST `groundlane…/mcp` 回 **401**。
- 改用 Keenable keyless 搜尋（可用），再用 curl 加 Python html→text 抓頁；curl 拿不到內容時退到 r.jina.ai。
- Black Diamond QC Lab 兩篇（"What is the strongest rappel knot?"、"Can a hot belay device melt my rappel slings?"）：curl 與 jina 都回 404，Exa `web_fetch` 回 CRAWL_NOT_FOUND，Tavily `extract` advanced 只抓到導覽列。**不列為來源**。
- DMM "How to break nylon & Dyneema slings"：404（curl、jina 都一樣）。**不列為來源**，只透過 AAC 和 Mountaineers 的轉引帶到。
- Mammut、Beal、FFME、ACMG 本身、ÖAV 網站：搜尋找不到垂降操作的一手頁面。ÖAV 的立場改用 bergundsteigen 2/08 的轉述，ACMG 改用 ACMG/IFMGA 嚮導 Cyril Shokoples 的 BRAKES 文件。

---

## A. 來源清單

| # | 組織 | 標題 | 作者／資格 | 日期 | URL | 打開？ |
|---|---|---|---|---|---|---|
| S1 | Petzl | Rappelling（Tech Tip） | Petzl（廠商） | 頁面沒有標日期 | https://petzl.com/int/en/sport/tech-tips/basic-techniques/rappelling/escalade-grde-voie-rappel_SPO_a77w0000000KypxAAC.html | 有 |
| S2 | Petzl | Knot for joining rappel ropes | Petzl | 頁面沒有標日期 | https://petzl.com/INT/en/Sport/Knot-for-joining-rappel-ropes | 有（測試數據在圖片裡，文字抓不到） |
| S3 | Petzl | Multi-pitch rappelling with a single rope | Petzl | 頁面沒有標日期 | https://petzl.com/INT/en/Sport/Multi-pitch-rappelling-with-a-single-rope | 有 |
| S4 | Petzl | Rappelling: installing a REVERSO on a CONNECT ADJUST adjustable single lanyard | Petzl | 頁面沒有標日期 | https://petzl.com/us/en/sport/tech-tips/expert-techniques/rappelling--installing-a-reverso-on-a-connect-adjust-adjustable-single-lanyard/Descente-en-rappel---Installation-d-un-REVERSO-sur_SPO_a77Tx000000Ib17IAC.html | 有 |
| S5 | Petzl | Rappelling with GRIGRI and NEOX | Petzl | 頁面沒有標日期 | https://petzl.com/US/en/Sport/Rappelling-with-GRIGRI-and-NEOX?ProductName=GRIGRI | 有 |
| S6 | Petzl | Rappelling on the RAD LINE cord | Petzl | 頁面沒有標日期 | https://petzl.com/us/en/sport/tech-tips/basic-techniques/rappelling-on-the-rad-line-cord/RADsystem-pe05-descente-rappel-JIVE_SPO_a77w0000000PC6hAAG.html | 有 |
| S7 | Petzl | Belay loop and tie-in points: where do I attach my lanyard, my belay device and my rope? | Petzl | 頁面沒有標日期 | https://petzl.com/INT/en/Sport/Belay-loop-and-tie-in-points--where-do-I-attach-my-lanyard--my-belay-device-and-my-rope- | 有 |
| S8 | Petzl（以廣告形式刊在 Climbing） | Rappelling On A Single Line With Assisted Braking Belay Devices | Petzl Technical Institute | 2017-05-01 | https://climbing.com/gear/rappelling-on-a-single-line-with-assisted-braking-belay-devices | 有 |
| S9 | UIAA | Alpine Skills: Which knot to use to join two ropes（節錄自 UIAA Alpine Summer Skills Handbook，與 Petzl Foundation 合作） | UIAA | 2019-02-14（2023-11-06 修改） | https://theuiaa.org/mountaineering/alpine-skills-which-knot-to-use-to-join-two-ropes | 有 |
| S10 | BMC | How to abseil | BMC（未署名；教學影片由 BMC/MTE Training Officer Jon Garside 主講） | 頁面沒有可靠日期 | https://thebmc.co.uk/en/climb-skills-abseiling | 有 |
| S11 | BMC | Alpine skills: 6 tips for multipitch abseiling | Mike Margeson（BA, MIC, IML；AMI Professional Officer）；另含 Steve Long（Mountain Safety Consultant）、Jon Garside 的 Q&A | 頁面沒有可靠日期 | https://thebmc.co.uk/en/alpine-skills-multipitch-abseiling-tips | 有 |
| S12 | BMC | Abseiling: do you know the risks? | BMC | 頁面沒有可靠日期 | http://thebmc.co.uk/en/abseiling-do-you-know-the-risks | 有 |
| S13 | DAV（Deutscher Alpenverein）Sicherheitsforschung | Sicherheitsrelevantes zum Abseilen（Panorama 4/2020 "Abseilen (1): Die Methode – Das richtige Setup"） | Christoph Hummel，DAV-Sicherheitsforschung；插圖 Georg Sojer | 2020-07-13 | https://alpenverein.de/artikel/klettern-abseilen_c1137d30-6bc6-436a-9c7c-d7660a300a6d（PDF：https://www.dav-hameln.de/111%20-%20Sektion%20Hameln/Dokumente/PDF/DAV/Sicherheit/Klettern/Panorama-4-2020-Sicherheitsforschung-Abseilen.pdf） | 有（兩者都打開） |
| S14 | bergundsteigen（DAV/ÖAV/SAC/AVS 合辦的專業期刊） | Fehler beim Abseilen: 20 Tipps | Andi Dick（DAV 編輯；感謝 DAV-Sifo 的 Lukas Fritz、Julia Janotte，ÖAV 的 Gerhard Mössmer） | 2024-06-03 | https://bergundsteigen.com/artikel/fehler-beim-abseilen-20-tipps | 有 |
| S15 | bergundsteigen | Kurzprusik a.D.（bergundsteigen 2/08，第 38–41 頁） | René M. Kieselmann、Michael Reinhard（Bergwacht Schwarzwald 教官） | 2008 | https://assets.bergundsteigen.com/2021/08/38-41-kurzprusik-ad.pdf | 有 |
| S16 | bergundsteigen | #alpinhack: Rappelling with aid lines (Rad Line & Co) | bergundsteigen 編輯部 | 2025-05-05 | https://www.bergundsteigen.com/en/artikel/alpinhacks-abseilen-mit-hilfsleinen-rad-line-co/ | 有 |
| S17 | SAC（Schweizer Alpen-Club） | Abseilen mit oder ohne Selbstsicherung?（Die Alpen 讀者來信加官方回應） | 回應者：Bruno Hasler，Bergführer，SAC 中央 Fachleiter Ausbildung | 2019-09-16（網頁發佈日） | https://www.sac-cas.ch/de/die-alpen/abseilen-mit-oder-ohne-selbstsicherung-15417/ | 有 |
| S18 | ENSA（法國國立滑雪登山學校）測試室，經 Climbing 刊出 | How to make the Euro Death Knot and offset figure-8 safe for joining two rappel ropes | Philippe Batoux（ENSA 測試室主管）等 ENSA 教官 | 2021-09-21 | https://climbing.com/skills/how-to-rappel-safely-with-euro-death-knot-offset-figure-8/ | 有（Outside+ 頁面，全文可讀） |
| S19 | Edelrid | Knots for connecting ropes when rappelling – a comparison | Edelrid 知識庫 | 頁面沒有標日期 | https://edelrid.com/int-en/knowledge/knowledge-base/knots-for-connecting-ropes-when-rappelling-comparison | 有 |
| S20 | AAC（American Alpine Club）ANAM | Know the Ropes: Rappelling – Fundamentals to Save Your Life | Rob Hess，UIAGM/IFMGA | 2012 | https://publications.americanalpineclub.org/articles/13201200200/Know-the-Ropes-Rappelling-Fundamentals-to-Save-Your-Life | 有 |
| S21 | AAC ANAC 2025 | Know the Ropes: Crafty Rappel Techniques | John Godino（前 USFS wilderness ranger、攀登教練，Alpinesavvy） | 2025 | http://publications.americanalpineclub.org/articles/13201217362 | 有 |
| S22 | AAC | The Prescription—The Stacked Rappel（Stanley Headwall 死亡事故，含 IFMGA/AMGA 嚮導 Jason Antin 的影片） | AAC／ANAC，事故陳述來自 Alik Berg | 2026-01-20 | https://americanalpineclub.org/news/2026/1/20/the-prescriptionthe-stacked-rappel | 有 |
| S23 | Climbing（作者是 AMGA 前技術總監） | Learn This: Preferred Knots for Rappelling | Rob Hess，IFMGA/UIAGM，曾任 AMGA 技術總監 8 年 | 2012-09-20 | https://climbing.com/skills/preferred-knots-for-rappelling/ | 有 |
| S24 | Climbing（作者是 American Alpine Institute 嚮導） | 5 Steps for Safer Rappelling | 未署名，作者自述是 American Alpine Institute 的 Director of Operations 兼嚮導（即 Jason Martin，姓名由 S25 參考文獻推定） | 2015-12 印刷版；2016-06-08 上網 | https://climbing.com/skills/5-steps-for-safer-rappelling | 有 |
| S25 | The Mountaineers（引用 AMGA SPI 課程） | How To: Extended Rappel and Updated Belay Techniques | Abby Hunt、Stef Schiller（參加 AMGA SPI 訓練後回報）；參考 Gaines & Martin《AMGA Single-Pitch Manual》2014 | 頁面沒有可靠日期（約 2015） | https://mountaineers.org/blog/extended-rappel-and-updated-belay-techniques | 有（curl 403，改用 jina） |
| S26 | Climbing（YOSAR 與優勝美地嚮導） | Rappelling Is Climbing's Most Dangerous Activity. Here's How To Make It Safer. | Alexa Flower（YOSAR）、Miranda Oakley（Yosemite Mountain Guides） | 2022-06-03 | https://climbing.com/skills/rappelling-best-practices | 有 |
| S27 | Rescue Dynamics | BRAKES – A "Not So New" Acronym for Rappel Safety Checks | Cyril Shokoples，ACMG/IFMGA 山岳嚮導 | 2005，2019 更新 | http://rescuedynamics.ca/articles/pdfs/BRAKESRappelAcronym.pdf（資格：http://rescuedynamics.ca/what.htm） | 有 |
| S28 | Jackson Hole Mountain Guides | How to Rappel Safely: Step-by-Step Guide + Common Mistakes | JHMG（嚮導公司，Rob Hess 經營） | 2026-07-01 | https://themountainguides.com/blog/rappelling-safety-common-mistakes-and-how-to-back-up-your-system | 有 |
| S29 | Climbing | Rappelling: Learn the Basics of This Essential Technique | Climbing 編輯部 | 2013-11-29 | https://climbing.com/skills/rappelling-learn-the-basics-of-this-essential-technique | 有 |
| S30 | Climbing | Six Tips For Safer, More Efficient, Rappelling | Mark Synnott（職業攀登者；頁面只寫 "decades of experience"，嚮導資格未在本頁查證） | 2022-06-24 | https://climbing.com/skills/how-to-rappel-safety-techniques | 有 |
| S31 | Gripped | Simul-Rappelling is Dangerous, Go One at a Time | Gripped 編輯部（附 IFMGA 嚮導 Dale Remsberg、Olivia Race 的示範影片） | 2020-03-13 | https://gripped.com/profiles/simul-rappelling-is-dangerous-go-one-at-a-time | 有 |
| S32 | Alpine Team（紐西蘭嚮導公司） | How to descend safely by abseiling | Alpine Team NZ 嚮導（頁面未列姓名） | 2014-07-19 | https://alpineteam.co.nz/post/how-to-descend-safely-by-abseiling | 有 |
| S33 | Alpine Team（紐西蘭） | Abseiling with a single rope plus tag line | 同上 | 2013-06-08 | https://alpineteam.co.nz/post/abseiling-with-a-single-rope-plus-tag-line | 有（jina） |
| S34 | CAI（Club Alpino Italiano）Sezione di Mantova，Scuola Carlo Moccia–Renzo Morari（由 FALC 轉載） | Manovre: Calata in Corda Doppia, Rev. 04 | CAI 曼托瓦分會登山學校 | 約 2019–2020 | https://www.falc.net/wp-content/uploads/2020/12/a1-a2-falc-alpinismo-calata-in-doppia.pdf | 有 |
| S35 | CAI Lucca 登山學校 | Corso di Alpinismo A1 2018 – Corda doppia | Fabrizio Sargenti（CAI Lucca 教官） | 2018-04-27 | https://www.scuolacailucca.it/wp-content/uploads/2018/05/LEZIONE-CAI-DOPPIE-PDF.pdf | 有 |
| S36 | Mountaineering Ireland／Mountain Training Board Ireland | Single Pitch Award Handbook | MI | 2002，2014 修訂 | https://mountaineering.ie/_files/20166284310_fd5dbbbf.pdf | 有 |
| S37 | TOCC 臺灣戶外攀岩協會 | 龍洞的上方固定點 | TOCC Rebolting Team | 2024-07-02 更新 | https://www.tocc-climbing.org/post/%E9%BE%8D%E6%B4%9E%E7%9A%84%E4%B8%8A%E6%96%B9%E5%9B%BA%E5%AE%9A%E9%BB%9E | 有 |
| (S38) | 健行筆記使用者筆記（**不是專業來源**，只當台灣口令的參考） | 山學筆記#38｜基礎攀降 | 個人課程筆記 | 不明 | https://hiking.biji.co/index.php?q=review&act=info&review_id=30853 | 有 |

打開過但沒有拿來支撐主張的頁面：OR × AMGA "Rigging a rappel"（https://outdoorresearch.com/blogs/stories/amga-video-rigging-a-rappel，只有影片，沒有文字）、AMGA SPI Program Handbook 2024（第三方鏡像，只有課綱列出 "Rappelling and lowering techniques"）、BMC "Abseiling: not the quickest way to reach the ground"（內容與 S12 重複）、Petzl "Accessing an exposed rappel station"（溪降情境，題目不符）、TOCC EMS Project（沒有垂降內容）、SAC 攀登路線安全頁（沒有垂降細節）。

---

## B. 依主題整理的證據

### B1. 垂降前檢查固定點

- **S11 BMC／Margeson**："Each anchor should be critically inspected – whether a gleaming abseil station or a mountain-crag thread… check every chain ring (and especially whether any maillon rapides are fully screwed up)… If you are not completely happy about an abseil anchor then leave behind an additional piece of gear, or replace the in-situ tat. Carry a few metres of 5 or 6 millimetre cord and a small, sharp knife."
- **S10 BMC**：使用既有垂降點時要仔細檢查，看錨栓是否牢固、有沒有嚴重鏽蝕、扁帶有沒有損傷。"Retrieving a rope after abseiling can drastically weaken slings by melting them, sometimes after only a single abseil… It is preferable to link the abseil rope to the anchor arrangement with a reliable metal link such as a krab."
- **S20 AAC／Hess 2012**：2000 年以來垂降事故的主因包括 "Inadequate anchor systems… anchor failure" 和 "Rappelling off the end of the rope(s)—largely due to uneven ropes"。繩子若直接跑在扁帶上會在收繩時傷到扁帶，建議加一個 5/16" 快扣。
- **S21 AAC／Godino 2025**："Every rappel anchor, especially one that looks like a rat's nest, is guilty until proven innocent." HowNOT2 測試老舊褪色扁帶，約 3 kN 就斷。2022 年 Tahquitz Rock 事故中，扁帶淋濕後顏色變深，看起來比實際新，結果在一人體重下斷裂，兩人死亡。建議帶刀和 6 mm 輔助繩，掛點加一個膠帶封口的普通鉤環（"cheapskate locker"）。
- **S13 DAV**："Der Standplatz muss solide sein! Bei allen Aktionen am Stand sind wir stets ohne Redundanz daran gesichert."（中譯：在確保站上做的每個動作，都只靠確保站本身撐著，沒有備援。）
- **S37 TOCC**：龍洞部分路線的上方固定點有垂降環，多數是 316 不鏽鋼，少數是鈦合金。岩友自己加掛的鋁合金垂降環「往往不到一年的時間，這些設備的強度就已大幅削弱」，304 不鏽鋼梅隆鎖在濱海岩場「有極高的安全疑慮」。TOCC 要大家「辨識其材質並檢查其外觀鏽蝕狀況」，發現異常就通報 Rebolting Team；也「建議各位盡可能以雙繩垂降的方式撤退」。
- **S32 Alpine Team NZ**：在山區用單點垂降站時，先另外做一個備份固定點，用 screamer 帶點鬆度接到垂降點。用力 bounce test（向下與向外）之後，最後一個人再拆掉備份。S12 BMC 的做法相同："whenever possible use a second anchor point as a back-up… the last person… can remove the back-up anchor for use lower down."

### B2. 穿繩與兩條繩對接（joining knot）

- **S9 UIAA**："Use an overhand knot to tie together two rappel ropes of the same diameter. Tighten the knot by pulling separately on each of the four strands, making sure you've left tails at least 30 cm in length… Use the double fisherman knot to tie together two ropes of different diameters… Leave at least 20 cm tails… It has the advantage that the two ropes are aligned, but gets stuck more easily."
- **S2 Petzl**：比較三種結：flat overhand、figure-eight、flat overhand 加 stopper。測試條件是 PASO GUIDE 7.7 mm、尾巴 30 cm。flat overhand 的優點是「收繩時卡住的風險較低」，缺點是 "Does not work with ropes of different diameters… capsizing starts at around 3 kN"。figure-eight："Risk of capsizing at very low loads when not correctly tightened. Capsizing 'consumes' the tails and the knot can come untied… Begins to capsize at around 1.5 kN (PUR LINE and VOLTA GUIDE)"。flat overhand 加 stopper："Works with ropes of different diameters… Somewhat greater risk of jamming"。結論："whichever knot is chosen, it must be correctly tightened while leaving at least 30 cm of tail. Simply pulling on the two strands together on each side of the knot is insufficient. The 4 strands must be individually tightened."
- **S18 ENSA／Batoux 2021**：offset overhand（EDK）和 offset figure-8 "are perfectly suitable for joining rappel ropes when using normal rappelling techniques IF: All knots are vigorously tightened… The free ends are at least 30 centimeters"。極端垂降情境下錨點受力約為體重的 3 倍（動力繩）或 5 倍（靜力繩），而測試的結在這些值的 3–4 倍才失效。**沒有拉緊的結**在「漸進加載」時會翻轉並吃掉尾巴：75 kg 測試者在負載 80 daN 時結翻轉，之後急停到 190 daN 時結脫開。衝擊加載反而會把結瞬間拉緊、不會翻轉。歐洲業界與業餘普遍使用 offset 結；北美則稱它 EDK 並勸阻。
- **S19 Edelrid**：86 kg 的人急停時，錨點峰值 2.6 kN；平順垂降約 0.9 kN。flat overhand 是最小、不對稱的結，最不容易卡；double fisherman 最強，但卡繩風險大；figure-of-eight bend 在最低的力就開始翻轉。結論："the flat overhand bend can be justifiably used… When rappelling/lowering on a single strand with thin, smooth half ropes, the flat overhand bend should be secured against rolling off the end of the rope with a second such bend." 所有結都要約 30 cm 尾巴，四股分別拉緊。
- **S13 DAV**："Seilverbindungsknoten… Immer mit gelegtem Sackstich! Wenn dieser ordentlich festgezogen wird (dazu jeden Strang einzeln ordentlich gegen den Knoten ziehen), kann er nicht 'rollen'. Mindestens 30 Zentimeter Seil überstehen lassen!"（中譯：對接一律用 flat overhand；每股分別拉緊就不會翻滾；尾巴至少 30 cm。）
- **S16 bergundsteigen 2025**：一般單繩接 5–6 mm 輔助繩時，單一 Sackstich 就夠。對接結只承受一半負載，換算約 0.5–1.25 kN。"Under no circumstances should you tie two sack stitches one after the other… greatly increases the risk of the rope getting caught"。尾巴 30 cm，是預留給初次翻滾的緩衝。
- **S20／S23 Rob Hess（AAC 2012、Climbing 2012）**：flat overhand "has at times been unfairly demonized. When used correctly, this knot is superior… no matter what orientation it starts in, when it comes time to pull the ropes, the knot shifts into an advantageous position"。要點：整理好結型、每股用力拉緊、尾巴 12–18 吋（約 30–45 cm）。S23 還提到它是 AMGA 嚮導訓練常用的結，"works well with ropes of different diameter"；長距離頂繩或打繩環時則改用 double fisherman 或 Flemish bend。
- **S26 YOSAR／Flower & Oakley**：推薦 flat overhand，尾巴 1.5 呎，可以再加一個 flat overhand 當備份。"Do not mistake the flat overhand for the flat figure 8… When loaded, this knot gets pulled in opposite directions, causing it to roll apart. Never use the flat figure 8 for rappelling." 另外："Thread the thinner rope through the anchor (this will make the ropes easier to pull)."
- **S11 BMC／Margeson**：偏好 overhand，"less prone to jamming on retrieval, but don't forget to leave reasonable tails of about 50cm"。**S12 BMC**："Probably the most reliable is the double fisherman's knot, but this can become jammed… An alternative is an overhand knot but make sure the ends of the knot are long."
- **S34 CAI Mantova**：用「nodo semplice」（flat overhand，義大利稱 nodo galleggiante）對接，尾巴至少 40 cm，拉對向兩股拉緊。理由是這種結容易翻轉，比較能從裂縫裡脫出。**S35 CAI Lucca**：尾巴至少 30 cm，結要擺在上坡側，方便收繩。
- **S22 AAC 事故**：Stanley Headwall 那起死亡事故，對接用的是 single flat overhand；事後確認**對接結不是事故原因**，原因是垂降器只扣到一股繩。

### B3. 繩尾止滑結（stopper knots）

- **S1 Petzl**："Tying a knot at the end of the rope is a necessary precaution in a variety of situations (long rappel, poor visibility, fatigue)." 換站時也要 "Verify that there are stopper knots at the end of each rope."
- **S20 Hess 2012**："Consider tying knots in each individual strand as oppose to tying them together, as this lets kinks dissipate. The triple barrel knot is a good choice." 風大或地形容易吃繩時，可以把打結的繩尾扣在吊帶上帶下去。
- **S24 AAI**："Always close the system… the triple barrel knot is a clean knot that won't slip through any belay device… People seldom think about tying knots in the ends of the rope in single-pitch terrain, but ironically, that's where most people accidentally rappel off a single end."
- **S21 Godino 2025**：ANAC 2025 的案例中，一端有止滑結、一端沒有，結果死亡。"Relying solely on stopper knots is risky—they may fail under force or pass through certain descenders. Recently, HowNOT2.com measured the force required to pull a stopper knot through an ATC at 6kN." 最後一次垂降落地後，第一個下去的人就把止滑結解開，養成習慣就不會帶著結拉繩。
- **S27 Shokoples**：依 ANAM，"Rappelling off the ends of the rope is the leading cause of rappel accidents and accounts for about 30% of rappel accidents reported in ANAM since 2000."
- **S14 bergundsteigen 20 Tipps**：繩尾結「幾乎總是值得打」，每端各打 Sackstich、八字或 double Spierenstich（double fisherman 的半結），讓兩股能各自退扭。但風大或地形破碎時，繩尾結可能會勾住。
- **S11 BMC／Steve Long**：列出正反兩面。不打結的好處是 "Less prone to catching on spikes"，壞處是 "More prone to dying due to abseiling off the end"；打結的壞處是 "Very prone to catching on spikes"。他認為打結是 "reasonable compromise"，但 "there is no set rule"。
- **S13 DAV**："Ein (Sackstich-)Knoten am Ende jedes Seilstrangs ist sinnvoll, wenn nicht 100-prozentig sicher ist, dass beide Seilstränge lang genug sind… muss man hier je nach Situation abwägen."（中譯：不能百分之百確定兩股都夠長時就打；但結有時會在風中勾住，要視情況權衡。）
- **S32 Alpine Team NZ**："When you knot the ends of your rope for throwing only tie one knot. If you tie two separate knots there is more chance they will get stuck in a crack."（也就是兩端綁在一起打一個結。）

### B4. 延伸垂降器（extended rappel）

- **S4 Petzl**："Extending the descender above the friction hitch, while keeping it within reach, helps limit any bad interactions between the two… The position of the descender on the lanyard must not interfere with the friction hitch when it is under load. Verify that your rappel system is working properly before untethering… Do not leave a descender permanently attached to a lanyard."
- **S1 Petzl 步驟**：先裝摩擦套結，以 girth hitch 套在確保環上；垂降器接在 DUAL CONNECT ADJUST 的固定臂；收掉垂降器與固定點之間、垂降器與摩擦套結之間的鬆繩；最後才把可調臂從固定點拆下。下降時，可調臂可以扣在拉繩那一股上當記號。
- **S25 Mountaineers（AMGA SPI）**：延伸的好處是 Safer（autoblock 讓繩維持在理想制動位置）、Smoother、Snag free（autoblock 和衣物都遠離垂降器）、Easier to manage group（可以多人同時架設）。用一條 120 cm 尼龍扁帶 girth hitch 穿過兩個綁繩點，在中點打 overhand 或八字結；垂降器鉤環穿過扁帶兩腳（形成冗餘）；autoblock 掛在確保環。理由是 Dyneema 當 PAS 時遇到 factor 2 墜落，受傷風險較高。"This is not intended for use with a Munter rappel."
- **S20 Hess 2012**：傳統的「確保環掛垂降器、腿環掛 autoblock」"can be effective, but is hard to adjust so that the auto-block sling does not move up against the belay device"。延伸系統用尼龍扁帶或 PAS，要 girth hitch 在綁繩點，"Harness manufacturers specify that slings or personal anchoring slings are not to be girth hitched to the belay loop"。延伸也能讓頭髮、衣物遠離垂降器。"Daisy chains are for aid climbing and should not to be used as personal anchoring slings."
- **S24 AAI**："Many climbers and most guides elect to rappel on an extension… Multiple people can set up their rappels simultaneously… allows for people to check one another… put the friction hitch backup directly on the belay loop… decreasing the likelihood that the friction hitch will touch the rappel device."
- **S26 YOSAR**：用雙肩長扁帶或 PAS 延伸。延伸後就能直接改成上攀；預先架設時，上面的人也不會被繩子拉來拉去。
- **S13 DAV**：Selbstsicherungsschlinge 用 120 cm 扁帶（不要用 Dyneema，因為容易老化），依方法在距吊帶 10–30 cm 處打一個結，鉤環用 Mastwurf（雙套結）固定。
- **S15 bergundsteigen 2/08（轉述 ÖAV）**："Der Alpenverein (OeAV) lehrt heute das Abseilen vorzugsweise mit erhöhtem Abseilpunkt. Dabei wird die Selbstsicherungsschlinge ungefähr in Höhe des Brustbeins abgeknotet… kann man es sich nun auch leisten, den Kurzprusik direkt im Hüftgurtring zu befestigen."（中譯：ÖAV 優先教「抬高垂降點」，自我確保扁帶大約在胸骨高度打結、掛垂降器，Kurzprusik 直接掛確保環。）
- **S34／S35 CAI**：用動力繩段做 longe（以雙重 bowline 接到吊帶），在 30–40 cm 處打 overhand 形成偏移的環掛垂降器；Machard 掛在確保環。S35 寫「讓下降時垂降器大約在眼睛高度」。
- **S7 Petzl（吊帶連接點）**："the lanyard can be attached to the belay loop or to the two tie-in points. But as a matter of comfort, it is preferable to attach your lanyard to the belay loop." 垂降器／確保器**不要**掛在兩個綁繩點上，因為鉤環會橫向受力。

### B5. 摩擦套結備份：掛哪裡、多長

- **S10/S12 BMC**："it's a very good idea to use an autobloc… The most common autobloc is a French prusik… wrap the prusik loop around the control rope four or five times… attach that to the leg loop of your dominant hand. If you have too many turns it can be very hard to release it… Remember that the prusik is not fail-safe, it could rub against something and release, so always try to keep hold of the control rope." **S11 Jon Garside**：「1.5 m 的 5 mm 輔助繩用 double fisherman 接成環」；掛在腿環 "will help to keep the prusik knot away from the belay device, where it could jam"。**S11 Margeson**：要故意停下時，不要只靠 prusik，先把控制繩繞過背後和對側腿。
- **S13 DAV（三種方法都可接受）**：
  - *Klassische Methode*：垂降器掛確保環，**短的**後備掛在腿環內側下方。缺點是 "Erhöhte Gefahr, dass die Hintersicherung am Abseilgerät ansteht und dann nicht greift – deshalb wichtig: kurze Hintersicherung!"
  - *Schweizer Methode*：垂降器掛在打短的自我確保扁帶上，後備掛確保環。缺點是 "Durch den Greifreflex besteht die Gefahr, dass der Abseilende sich im Notfall an der Hintersicherung festklammert und so deren Ansprechen verhindert"，而且套結抓住之後比較難解開。
  - *Kombi-Methode*：垂降器延伸，後備掛在腿環下方。
  - "Korrekt ausgeführt, eignen sich alle drei Methoden." 無論哪種，"Die Hintersicherung… unten innen an der Beinschlaufe einhängen!"
  - 材料：軟的 Reepschnur 打 Prusik，或 30 cm 縫製 Dyneema 扁帶打 FB-Kreuzklemm（1.5 圈，單股或極細繩時 2.5 圈）。硬的 Kevlar 芯輔助繩反應差，6 mm 硬輔助繩是第二起事故的推定原因。"Je dünner das Seil… desto größer ist die Gefahr, dass die Hintersicherung nicht greift." 30 cm 扁帶用在經典法上太長，會頂到垂降器。
  - 實作提示：先裝後備，再往上拉約 50 cm 繩，這樣裝垂降器時不必對抗下垂繩的重量，也順便測試後備會不會抓。
- **S15 bergundsteigen 2/08**：Bergwacht 訓練事故。Kurzprusik 太長，又掛在腿環上方的連接帶而不是腿環本身；受訓者往後倒時 prusik 滑到八字環上、失去作用，往下滑了約 20 m。教訓："ein zu langer Kurzprusik wird mitgeschoben und kann nicht seine Bremswirkung entwickeln!" 夥伴檢查要「用手拉，確認距離與功能」，不能只用眼睛看。Kurzprusik 掛在腿環就夠，因為它只代替制動手，受力很小。
- **S20 Hess 2012**：摩擦套結 "best done on the brake-hand side of the system… The friction hitch of choice is the auto-block… The main disadvantage is that… the auto-block can be released or caused to slide under load if it hooks up against or bumps into an object… if the auto-block hitch sling is too long and slides up against the rappel device." 也提到 autoblock 其實只有第一個人需要，後面的人可以用 fireman's belay。
- **S24 AAI**：有兩個選項，"an autoblock hitch below the device… or putting a prusik hitch on both strands above the rappel device"。上方 prusik "has gone a bit out of fashion"，好處是很容易轉成上攀。腿環若是自動回扣式扣具，autoblock 的鉤環可能把扣具弄開，所以要掛在大腿內側或專用的環上。若要空出雙手處理事情，在摩擦套結下方再打一個 overhand on a bight 當 blocker。
- **S27 Shokoples（ACMG/IFMGA）**："Seriously consider not using a rappel backup on your harness leg loop. This can inadvertently fail if you turn sideways and in some cases even when you lift your leg too high. In many cases it is better and safer to use an extension… and have your Prusik safety, autoblock or similar backup attached to your belay/rappel loop." 沒有適當的後備，是 ANAM 垂降事故第三常見的原因（約 20%）。
- **S26 YOSAR**：prusik 至少繞三圈，用有鎖鉤環掛確保環（沒延伸時就掛腿環）。"Never rely on one friction hitch! If you need to let go of the rope, tie a backup knot a foot below your hitch."
- **S28 JHMG**：autoblock 繞兩股、位在垂降器下方、掛確保環，"we teach and use a backup on nearly every descent"。
- **S29 Climbing basics（2013）**：autoblock 繞兩股、在垂降器下方、掛腿環，"It needs to be short enough so it can't get caught in the belay device"。
- **S32 Alpine Team NZ**："Always use a prussic when abseiling in the mountains… if you are knocked out or hit by rock fall… I prefer to have my abseil device away from my harness on my safety chain with the prussic connected to my harness and sitting under the abseil device. However each to his own."

### B6. 垂降前檢查口訣與負重測試

- **S27 BRAKES（Shokoples，2005／2019）**：B = Buckles、R = Rappel device/Rope（雙繩一定要兩股都穿過）、A = Anchor、K = Knots、E = Ends、S = Safety backup、S = Sharp edges。"Touch each component and speak out loud." 也建議 "When practical consider stacked rappels." 沒有用 tether 被列為第四常見的事故原因。
- **S24 AAI** 刊出同一套 BRAKES，標明 "developed by Cyril Shokoples"。**S21 Godino** 把它用在 stacked rappel 上，B = Belay device、R = Rope、A = Anchor、K = Knot、E = Extension、S = Safety backup，字母解釋與原版不同（**這是版本差異，寫文章時要註明**）。
- **S15 A.B.S.-Check（Christian Berghold，bergundsteigen 2/08）**：A = Anker（固定點品質、冗餘、鉤環鎖了沒、結對不對），B = Bremse（繩穿對了嗎、穿的是正確的繩嗎、垂降器鉤環鎖了沒），S = Stop（繩尾打結或確認到地、自我確保扁帶準備好、Kurzprusik 有裝）。
- **S13 DAV「Belastungstest（Selbstcheck）」**：還連著自我確保時，把垂降器和後備往固定點方向推，坐進系統，讓垂降器承受全身重量。接著檢查：繩有沒有正確穿過固定點、垂降器裝對了嗎、鉤環扣對位置且鎖了嗎、後備有沒有抓住、夠不夠短、是不是掛在腿環上碰不到 tube。兩起 DAV 課程事故（一起只扣到一股繩，另一起掛在裝備環）"hätten durch eine einfache Maßnahme erkannt und behoben werden können: wenn das Abseilsystem vor dem Aushängen der Selbstsicherung belastet und überprüft worden wäre"。
- **S3 Petzl**："Before un-tethering from the anchor, put your body weight on your rappel system and verify that it is properly set up." **S29 Climbing basics**：把制動端的繩拉到底，直到確定體重壓在垂降系統上、tether 是鬆的。
- **S14 bergundsteigen**：一個人也要做負重測試（例如拆運動路線時）。自我確保要用有鎖或 Safelock 鉤環，並用雙套結固定（"Keinen Gummi wie bei Exen!"），不要用快扣。動態材料（如 Petzl Adjust）做的自我確保比扁帶耐衝擊。也記錄了「解錯成同伴的自我確保」這類失誤。

### B7. 單繩加拉繩（tag line／pull cord）與阻擋式垂降（blocked rappel）

- **S3 Petzl**：垂降長度不超過繩長一半時，單繩對折即可。超過一半時 "a rope retrieval cord must be used… the rappel is done only on the single rope… rigged to the anchor with a blocking technique (knot block at the rappel ring attached to a locking carabiner)… Do not descend on the retrieval cord… Petzl recommends that the rappel setup always be secured with a locking carabiner clipped to the rope, to back up the knot block. There is a risk of the knot passing through the ring, even if the block seems secure." 限制："if the single rope gets stuck out of reach, the retrieval cord can not be used to belay for the recovery… not suitable for the rapid execution of a long series of rappels." 用 GRIGRI 時，拉繩用快扣扣在確保環；用 REVERSO 時，拉繩穿過第二個繩槽。拉繩太細不好拉時，可以用上升器輔助。
- **S8 Petzl Technical Institute**：列出三種 block 方法和各自的優缺點：flat overhand 加 butterfly 或雙套結鉤環；兩個 figure-8 on a bight 加鉤環；八字結回穿加鉤環。
- **S33 Alpine Team NZ**：6 mm tag line "too thin and weak to abseil directly on"。climbing rope 穿過固定點，打 figure 8 on a bight 扣回主股，tag line 的一端也扣進同一個鉤環。
- **S6 Petzl RAD LINE**：REVERSO 用在 6 mm RAD LINE 上制動力不足；真的要用，就裝兩個制動鉤環，並且 "using a rappel backup system is recommended"。
- **S16 bergundsteigen（不同意見）**：單繩加 5–6 mm 輔助繩**兩股一起垂降**是可以的；tube 要用兩個鉤環增加摩擦。對接結放在細繩那一側，抵著垂降環，可以防止繩子在環裡滑移；收繩時拉**細繩**，讓粗繩自己落下，比較不容易卡。"Techniques with a carabiner attachment to fix the single strand… are rather problematic… often difficult to pull off… can easily become entangled… only a good option for steep abseils (e.g. canyoning)."
- **S30 Synnott**："For an easier pull, rig the rappels so that you're always pulling the fat rope."（與 S16 衝突，見 C 節。）
- **S19 Edelrid**：以 thin take line 搭單繩垂降時，flat overhand 要再加一個同樣的結，防止翻出繩尾。

### B8. 多段垂降流程（第一人、第二人、換站、全程掛著）

- **S1 Petzl**："All maneuvers at the anchor must be done while directly connected to the anchor." 抵達下一站：把可調臂拉到最長，先扣站，站穩後再調短；把繩子拿出垂降器和摩擦套結；"Attach the two ropes to the anchor so you don't lose them and to back up the second climber's descent"；解開繩尾結；把要拉的那端穿過下一個垂降環；"Once the second climber is directly connected to the anchor, pull the rope." 拉繩時第二人拉，第一人負責讓繩順利穿過環；對接結到站後，第一人就能開始裝下一段。
- **S11 Margeson**：自己的兩次險情，一次是到站後忘了扣 cowstail 就解開垂降器，另一次是繩只穿過固定點的一邊。"Before you leave each set of abseil anchors, get your partner to double check you… When you arrive at the next anchor you can hold the rope from below to further protect them." 拉繩前先把一端扣在固定點上，"avoiding the schoolboy error of your rope flying off down the cliff"。拉之前先確認要拉哪一條（不同顏色的繩有幫助）；第一個人先試拉。
- **S12 BMC**："Once the first climber has completed the abseil they should do a short test pull to ensure the rope will run properly." 最後一人可以把一個鉤環扣在要拉的那條繩上，幫忙把兩股分開。
- **S14 bergundsteigen**：Tipp 7「Partnercheck unten」，建議至少後備保持掛在繩上，等兩人都到下站、互相檢查並坐進自我確保之後才解開。解開垂降器前先多拉兩公尺繩，上面的人就能立刻出發。第二人垂降時，第一人可以先拉上繩尾、解結、穿好要拉的那端並打上止滑結。一人拉、一人穿，"achtet dabei aber darauf, dass immer etwas Durchhang bleibt"。
- **S26 YOSAR**："Do not release the ropes once you've reached the next anchor": 第一人扣站之後，從垂降器多送 5–10 呎繩，但**垂降器留在繩上**，喊 "Off rappel!"，再開始穿要拉的那端。第二人到站扣好後，兩人才把垂降器拿下，用手抓兩股或用鉤環扣進固定點。也提醒落下的繩會拖走其餘的繩，可以先把一側用雙套結扣在自己或固定點上。
- **S32 Alpine Team NZ**：事先分好角色。第一人帶整副器材和最好的頭燈，負責架下一站；第二人拆備份、拉繩。抵達後，第一人先放好下一站的單點，扣進去做 bounce test，再加備份，最後才離開垂降繩。
- **S22／S21 Stacked rappel（AAC 2025–2026）**：兩人都先架好垂降器（都延伸）再出發，可以互做 BRAKES 檢查。上面那個人的垂降器把兩股鎖住，等於把雙股都固定了，所以第一人下去時只需要在一股打止滑結。2024 年 Stanley Headwall 死亡事故（"improperly threaded rappel device"），AAC 的結論是 "The simple solution to that is a basic partner or function check. Alternately, rappelling using the stacked rappel method… deserves broader adoption."
- **S14 bergundsteigen**：Schweizer Methode 加上兩人預先掛好，也有同樣的「上方垂降器擋住繩子」效果，可以防止第一人滑過較短的那端時把繩拉走。
- **S31 Gripped**：simul-rappel 只限緊急狀況，"Having two climbers arrive at an anchor at the same time is actually slower"。

### B9. 拉繩（拉哪一條、結在哪側、避免卡繩）

- **S34 CAI Mantova**："Per il recupero si andrà a tirare l'estremo della corda non passata nell'ancoraggio"（中譯：收繩時拉沒有穿過固定點的那條繩，也就是結所在那側的繩）。理由是這樣垂降環不會被拉力壓向岩壁，否則容易擠壓、增加摩擦，甚至卡住；長距離 40–50 m 時差別更明顯。穿繩方向是由外往內。
- **S35 CAI Lucca**：結放在上坡側，方便收繩。**S26 YOSAR**：細繩穿過固定點，"this will make the ropes easier to pull"。
- **S13 DAV**："Bewährt hat sich dabei, den freien Karabiner der Selbstsicherung in den Seilstrang einzuhängen, der dann beim Seilabziehen 'zieht'." 這樣可以記住要拉哪一條，也能防止繩子絞在一起。**S1 Petzl** 用可調臂做同樣的事。
- **S10 BMC**："Try to pull the rope slowly and treat spikes directly below the anchor with suspicion."；**S30 Synnott**："Clean and jerk"：繩尾快要穿出時加速拉，穿過的瞬間往外甩，讓繩子離開岩壁。
- **S12 BMC 卡繩處置**：先甩或換拉的角度；還握有兩端時，可以兩股一起 prusik 上去，或攀回去（間隔綁回繩上）。"Do not prussik on a single rope as it could pull free at any moment with fatal consequences." 只剩一端時，用手上的繩攀回去。
- **S14 Tipp 16**："keinesfalls daran vorbeiseilen, sondern von oberhalb versuchen, das Seil… zu lösen… Der Seilrest darf beim Abseilen nie oberhalb sein!"（中譯：繩在下方卡住時，不要垂降越過它，要從上方處理；剩下的繩永遠不能在你上方。）**S21 Godino**："never go below any rope that's stuck."
- **S30 Synnott**：每個新站點都偏離上一站的落線（之字形），避免拉繩時帶下的落石打到人；要把繩疊好，被石頭打到後檢查繩皮。
- **S32 Alpine Team NZ**：拉繩前確認所有繩尾結都解開，要拉的那端已穿過下一站，需要時把繩扣在吊帶上；繩落下時靠牆、低頭。

### B10. 丟繩、背繩、掛袋

- **S10 BMC**：先確認下方沒有人，一端固定，其餘疊成整齊一堆，最後幾公尺繞成圈丟下，"shout 'Rope below!' loudly"，再確認繩有到地。
- **S20 Hess**：丟繩之前先把繩暫時固定在固定點上。蝴蝶捲繩，前半段先丟，等幾秒再丟後半段（含繩尾）。風大或有樹叢障礙時，用 saddle bag：兩股分開，從打結的繩尾開始，由大圈往小圈蝴蝶捲，用扁帶托住扣在裝備環上，"Do not girth hitch the coil with the sling"。
- **S24 AAI**："consider tying the ends of the rope off and clipping them to a gear loop, then rappelling with saddlebags… provides the security of a closed system."
- **S26 YOSAR**：saddlebags 的做法是兩端繩尾一起打 overhand on a bight 扣在吊帶上，往上收圈，掛在裝備環上的肩帶扁帶裡。
- **S14 Tipp 15**："In komplexem Gelände… vor allem bei Wind kann das Seil sich bösartig verklemmen, besonders mit Knoten und wenn es ausgeworfen wird" → 背在肩上邊下邊放，或捲成短圈用扁帶掛在吊帶上。繩子沿著板岩滑下通常比丟出去好。
- **S32 Alpine Team NZ**：風大或板岩、碎石地形時，分成約 15 m 的小捆，掛在吊帶上，邊下邊放。
- **S11 Margeson／S14 Tipp 17**：第一人用**下放**的方式下去，可以探路、在風中把繩送到對的位置、繞過勾繩的地形；但需要看得到或聽得到對方。

### B11. 溝通

- **S10 BMC**："shout 'Rope below!' loudly to warn anyone."；**S29**：到站扣好、把垂降器拿下之後喊 "Off rappel!"。**S26**：第一人喊 "Off rappel!" 之後才開始穿下一站的繩。
- **S20 Hess**："In terms of communications, if you are unsure of what was said, ask again." 團隊要互相檢查。
- **S14 Tipp 17**：用下放的方式時，"Sicht- und/oder Rufverbindung wichtig für gutes Timing"。
- **S38（台灣個人課程筆記，非專業來源）**：課堂口令是「準備下降 → 確保完成 → 開始下降 → 請下降」。寫文章若要用台灣口令，**需要另找 TOCC 或協會教材確認**；目前沒有找到專業版本。

### B12. 輔助制動器（GRIGRI 等）：廠商立場

- **S5 Petzl**："GRIGRI and NEOX enable rappelling on a single rope: on a retrievable system with one strand blocked, or on a fixed rope… The handle helps adjust the friction, but the descent is controlled by the hand gripping the brake side of the rope." 適用 EN 892 動力繩或 EN 1891 低延展繩，直徑要在裝置標示範圍內。**警告**："a strong pull on the brake side of the rope can cause the GRIGRI or NEOX to unblock… if the rope below the user is heavily loaded… equal to or greater than that of the person rappelling." 底下的人可以做 bottom belay，但 "must pull by hand, without hanging on the rope"；救援者不可沿受困者的繩上攀。排隊時預先裝在繩上的 GRIGRI，可能被下方垂降者的重量翻轉而解鎖。
- **S3 Petzl**："With a GRIGRI, it is not possible to rappel on the two strands coming out of the anchor. So one must rappel on a single strand, blocked at the rappel ring by a knot attached to a locking carabiner."
- **S28 JHMG**：GRIGRI "rappels on a single strand, so it is used with a blocked rope or a fixed line rather than a standard double-strand rappel"。
- **S16 bergundsteigen**：認為用鉤環固定單股的技術有問題（見 B7）。

### B13. Fireman's belay（下方拉繩控制）

- **S20 Hess 2012**："Rappel backups in the form of an auto-block are really only necessary for the first person on a particular rappel. Subsequent rappellers can be protected by a simple 'fireman's belay' from the first person down… pull tight on the ropes to arrest any unwanted movement."
- **S11 Margeson**：到下一站後 "you can hold the rope from below to further protect them"。**S14 Tipp 11**：拆運動路線時，地面的夥伴可以確認兩端都到地，並用 Zugsicherung（拉繩確保）增加冗餘。
- **S17 SAC（官方回應）**：讀者 Dani Weber 主張第一人用後備、之後的人不用、由第一人拉繩保護。SAC Fachleiter Ausbildung Bruno Hasler 回應這偏離了「SAC-Lehrmeinung, die besagt, dass grundsätzlich mit Selbstsicherung abgeseilt wird」，並指出 "Das oben angeführte Vorgehen versagt, wenn der Abseilende das Abseilgerät falsch einhängt oder am falschen Ort am Sitzgurt (z.B. in der Materialschlaufe) einhängt."
- **S5 Petzl**：GRIGRI 加上下方用力拉繩，可能造成解鎖（見 B12），只能用手拉，不能吊在繩上。
- **S15 bergundsteigen 2/08**：教學初期應該有冗餘，例如上方第二條繩確保，"oder eine Person am Fuß der Abseilstrecke hält die Seile"。

### B14. 單繩固定垂降（static／blocked）的風險

- **S3 Petzl**：結有可能穿過環，"even if the block seems secure"，所以要加有鎖鉤環當備援。一旦結穿過，墜落會被擋住，但收繩會變得麻煩。若單繩卡在搆不到的地方，拉繩無法拿來當確保。必須拉繩完全收回才能架下一段，不適合長串的垂降。"Take care to rappel on the correct strand. Do not rappel on the cord."
- **S8 Petzl**：block 方法會變大、更容易卡，鉤環位置也可能不對。
- **S16 bergundsteigen**：鉤環固定法不容易拉、容易纏繞，只建議用在很陡的地方（例如溪降）。
- **S10/S11 BMC／Garside（只有一條繩時）**：可以綁在一端用下放的方式下降；兩條繩時，把要垂降的繩穿過固定點，打 figure-of-eight on a bight 扣回繩下方，另一條繩也接在這個八字上。

### B15. 常見錯誤（綜合）

- 只扣到一股繩：S13 DAV 事故一、S22 Stanley Headwall、S24 AAI "One of the most common mistakes is the failure to capture both strands"、S27 BRAKES-R。
- 垂降器掛在裝備環：S13 DAV 事故二、S14、S17。
- 繩尾不等長或沒打結就滑出繩尾：S20、S21、S27（約 30%）、S14 Tipp 10–12（中點標記可能因剪短而不準，要從兩端量起）。
- 後備太長、頂到垂降器：S15、S13、S20、S29。
- 後備材料太硬、抓不住：S13。
- 到站忘了扣自我確保：S11 Margeson 的親身經驗。
- 繩只穿過固定點的一部分：S11 Old Man of Hoy。
- 對接結沒拉緊或尾巴太短：S18、S2。
- 對接結的長尾巴被誤當成主繩扣進垂降器：S14 讀者來信 Bernhard Streicher，他和同伴把尾巴留到約 1.5 m。
- 衣物或頭髮被捲進垂降器：S12、S20（延伸可以降低這個風險）。
- 八字環橫卡在鉤環閘門上：S12 "At least one fatality."
- 細繩搭垂降器摩擦不足：S11、S13 Doppelkarabinermethode（兩個鉤環）、S16。
- 用快扣當自我確保：S14 Tipp 3–4。
- 扁帶自我確保受到動態衝擊會斷：S14 多洛米蒂嚮導的案例。

---

## C. 各來源意見分歧

1. **摩擦套結掛在哪裡**
   - 腿環、在垂降器下方（傳統做法）：BMC（S10/S11，掛慣用手側腿環，理由是讓 prusik 遠離垂降器）、DAV「klassische」與「Kombi」法（S13，要求後備夠短、掛在腿環內側下方）、Climbing basics 2013（S29）、AAI（S24，目前多數人用）。
   - 確保環加上延伸垂降器：Petzl（S1/S4）、AMGA SPI 系的 Mountaineers（S25）、Shokoples（S27，明確勸不要用腿環，因為側身或抬腿時可能失效）、YOSAR（S26）、JHMG（S28）、ÖAV（S15，抬高到胸骨）、CAI（S34/S35）、Hess（S20）。
   - DAV 點出確保環做法（Schweizer）的缺點：遇緊急狀況會本能地抓住後備，反而讓它抓不住；套結抓住後也比較難解開。所以 DAV 認為三種方法都可以，並另外提出 Kombi（延伸加腿環）。
   - 在垂降器上方用 prusik：AAI（S24）說已經不流行，但改成上攀很方便。其他專業來源都沒有推薦。
2. **對接結**
   - flat overhand（EDK）是主流：UIAA（同直徑時）、Petzl、ENSA、Edelrid、DAV、bergundsteigen、AAC/Hess、YOSAR、BMC Margeson、CAI。
   - BMC S12 說 double fisherman 「probably the most reliable」，但會卡；UIAA 在**不同直徑**時建議 double fisherman。
   - 不同直徑：Petzl 說單一 flat overhand 不行，要加一個 stopper；Edelrid 說用單股細繩時要加第二個 overhand；YOSAR 認為可選擇加。Hess 說 flat overhand 「works well with ropes of different diameter」；bergundsteigen 說單一 Sackstich 夠，**而且明確反對連打兩個**，因為更容易卡。
   - flat figure-8：YOSAR 說「Never use」；Petzl 說沒拉緊時在很低的負載就會翻轉；Edelrid 說它在最低的力就開始翻轉；ENSA 則說拉緊、尾巴 ≥30 cm 時「perfectly suitable」。
   - 尾巴長度：UIAA、Petzl、ENSA、Edelrid、DAV、bergundsteigen 都是 ≥30 cm；Hess 12–18 吋；YOSAR 1.5 呎；CAI Mantova ≥40 cm；BMC Margeson 約 50 cm；UIAA 的 double fisherman 是 ≥20 cm。UIAA 另外提醒尾巴不能長到讓人誤垂降到尾巴上，S14 就有這樣的案例。
3. **繩尾止滑結**
   - 一律要打：AAC Godino、AAI、JHMG、Hess、Petzl（長距離、能見度差、疲勞時）。
   - 視情況：DAV、BMC/Steve Long（「沒有固定規則」）、bergundsteigen（幾乎都該打，但風大時可能勾住）。
   - 每股各打，讓扭轉能退掉：Hess、bergundsteigen。兩端綁在一起打一個結：Alpine Team NZ，理由是比較不容易卡進裂縫。
   - 結型：triple barrel（Hess、AAI），或 Sackstich、八字、double Spierenstich（bergundsteigen）。另外 Godino 引述 HowNOT2 的數據：止滑結約 6 kN 會被拉過 ATC。
4. **後面的人用後備，還是用 fireman's belay**：Hess（S20）認為只有第一人需要 autoblock。SAC 官方認為一律要用後備，理由是如果垂降器扣錯，fireman's belay 救不了。Petzl 補充，用 GRIGRI 時從下方用力拉繩反而可能讓它解鎖。
5. **單繩加細拉繩**
   - 只垂降主繩，用 block 加鉤環，不能垂降在拉繩上：Petzl（S3、S8）、Alpine Team NZ。
   - 兩股一起垂降，tube 加兩個鉤環；結在細繩側、拉細繩；鉤環固定法問題多：bergundsteigen（S16）。
   - 拉哪一條：Synnott（S30）說永遠拉粗繩；YOSAR 把細繩穿過固定點（等於拉粗的那條）；bergundsteigen（S16）說拉細的 aid line，讓粗繩自己落下比較不卡。理由不同：前者為了好拉、摩擦小，後者為了不卡、不纏。CAI Mantova 從穿繩方向和環的擠壓來談，說拉結那側的繩。
6. **自我確保接在哪裡**：AAC Hess 2012 說吊帶廠商規定扁帶或 PAS 不能 girth hitch 在確保環，要穿綁繩點。Petzl S7 說 lanyard 掛在確保環或兩個綁繩點都安全，為了舒適偏好確保環（Petzl 的 lanyard 本來就是設計來 girth hitch 在確保環上的）。DAV 和 bergundsteigen 只要求固定點，沒有談這個。這條建議**依吊帶和繫繩的廠商說明書**決定。
7. **延伸長度**：DAV 10–30 cm；Petzl 「within reach」；Mountaineers 和 YOSAR 是 120 cm 扁帶對折加中點打結（約 60 cm 的一半）；ÖAV 在胸骨高度；CAI Lucca 30–40 cm，讓垂降器約在眼睛高度。共同點是後備要碰不到垂降器，垂降器又要伸手可及。
8. **檢查口訣不只一套**：BRAKES 有 Shokoples 原版與 Godino 的變體（E = Ends 或 Extension、S = Safety/Sharp edges）；德語圈有 Berghold 的 A.B.S.-Check，DAV 則叫 Belastungstest（Selbstcheck）。內容大致重疊，重點都是：還掛著時先負重測試，再加上夥伴檢查。
9. **丟繩還是帶繩下去**：S10 BMC 的入門做法是丟繩並喊 "Rope below!"；風大、地形破碎、有樹叢時，AAC、AAI、YOSAR、bergundsteigen、Alpine Team NZ 都建議 saddlebag 或背繩。BMC 和 bergundsteigen 另外提出可以先把第一人下放下去。

---

## D. 各來源一致的步驟（給寫文章用）

1. 能走下去就走下去（AAI S24、YOSAR S26、BMC S12、bergundsteigen S14）；事前研究下降路線（S14 Tipp 18、S26）。
2. 到站先用有鎖鉤環掛上自我確保（Petzl S1、DAV S13、bergundsteigen S14）。
3. 檢查固定點：錨栓、鏈、環的材質與磨損，扁帶褪色或被遮住的部分；需要時用自己的材料補強，並帶刀和輔助繩（S10、S11、S20、S21、S37）。
4. 穿繩：找中點，或兩條繩打 flat overhand、四股分別拉緊、尾巴 ≥30 cm；先記下要拉哪一條（S9、S2、S13、S20）。
5. 繩尾打止滑結，或用 saddlebag 把繩尾帶在身上（S1、S20、S24、S21）；確認下方沒有人，喊 "Rope below"（S10）。
6. 裝摩擦套結（短、軟、碰不到垂降器）→ 裝垂降器，兩股都穿，鉤環上鎖。常見做法是延伸垂降器（S1、S4、S13、S25）。
7. 還掛著時負重測試，加上夥伴檢查（BRAKES 或 A.B.S.）；可以用 stacked rappel 互相檢查（S13、S27、S21、S22）。
8. 解開自我確保，制動手始終握住繩；一隻手推著摩擦套結往下，平順下降、不要彈跳，眼睛注意繩尾（S13、S12、S28）。
9. 到下一站：先扣站，再把繩拿出垂降器；第一人把繩固定在站上、試拉；第二人下來時，第一人可以在下方拉繩保護（S1、S11、S12、S26）。
10. 拉繩：先解開止滑結，確認拉的是正確那條、要拉的那端穿過下一站，把一端扣住免得繩整條掉下去；拉繩時躲落石；繩卡住時不要垂降越過它（S1、S11、S12、S14、S21、S32）。
