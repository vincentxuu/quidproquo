# 固定單繩垂降（tube 器材）與八字環垂降：影片＋專業來源

研究日期：2026-10-24。範圍：(1) 繩子綁死在固定點、不回收的單股垂降，用 tube 類器材；(2) 八字環（figure-8 descender）垂降。GRIGRI 單股垂降另有人負責，這裡不重複。

工具紀錄（toolDegradation）：Groundlane 未試（同一任務上游已回 401）；搜尋用 Keenable keyless＋Exa（web_search_exa／web_fetch_exa），下載用 curl＋pdftotext。YouTube 用 `yt-dlp`（中途 429，改 `--cookies-from-browser chrome` 後恢復）＋`scripts/yt-candidates.mjs`（掃 tier 1、3 頻道，結果 `videos-fixed/yt-candidates.md`）。字幕、info.json、逐秒文字（`<id>.txt`）都在 `videos-fixed/`。

---

## 一、影片

### A. 固定單繩、tube 器材、加摩擦

| 排名 | ID | 標題（頻道） | 上傳日 | 長度 | 建議片段 | 備註 |
|---|---|---|---|---|---|---|
| 1 | yAUSU27gvTc | Heavy Load or Icy- or Thin-Line Rappels Need This Friction Hack（Short Guys Beta Works） | 2026-08-17 | 4:26 | **57**（Z 型加摩擦）、**160**（guide mode 孔扣鉤環往後壓）、**206**（並排第二個鉤環） | 三種方法由強到弱。說明欄有章節 0:58／2:40／3:27。講者 Jason，**沒有查到認證**（之前研究也記為非認證）；說明欄寫明可能含聯盟連結。片子沒有特別講「單股」，講的是 plaquette 的通用加摩擦，單股固定繩直接適用。 |
| 2 | TuqUlkAQvBI | Rappelling on 5mm?（HowNOT2） | 2025-01-22 | 12:02 | **350**–**431** | 主題是 5 mm 輔助繩，不是一般固定繩；只取這段：ATC 單股加腿環 Z 摩擦、load cell 量到 65 kg 的人約 1.76–1.9 kN。**和第 1 支衝突**：HowNOT2 把 Z 掛在腿環，Short Guys（97 s）說不要掛腿環，翻轉時會失效。HowNOT2 自營器材店，說明欄有商品連結。 |
| 舊片備用 | JHt7TC9OTv4 | Quick Tip: Adding More Friction to the Rappel（Ryan Tilley） | 2020-06-07 | 2:41 | 56（第二個 locker 並排）、109（ATC 耳朵扣到延伸） | 2024 前，內容同第 1 支的兩種；132 s 說加摩擦「not a replacement for your third hand」。講者資格未查到。 |
| 舊片備用 | 6r2ALO6zZR0 | Adding Friction On Rappel（Live Rogue） | 2019-05-18 | 2:55 | 57（ATC Guide 在細的溪降單繩上加 redirect） | 溪降頻道，資格未查到；不建議用。 |
| 補充（只有架設） | uZYbL61GO6w | My favourite way to rig a fixed line for abseiling, top rope solo etc.（JB Mountain Skills） | 2025-06-22 | 8:50 | 53（固定繩的用途：下海崖、TRS、教練架設）、107（八字結起頭）、181（overhand 連第二個點） | 只示範把繩子固定在多個點，**沒有示範用器材下降**。Rab 寄外套（6–18 s 自述），器材店 Outside 支持頻道。 |

關鍵字幕摘錄：

- yAUSU27gvTc 57：「The most complicated setup in this list is a z-system below the rappel device… brake strand running through a locker. Then we go back up and to an additional locking carabiner」；88：「note the extra rope in the system that could create a sudden drop if the rope came out of one of the extra carabiners. So, lockers.」；97：「we typically don't want to attach our friction loop at our leg loop because it will fail if our leg raises, say if we flip over」；142：「Each carabiner is roughly 50% efficient」；160：「clip it to the guide-mode connection at the top of our device and then pin the device back by clipping that additional carabiner to our extension」；174：「this top strand could block the brake strand, again locking up the system. Larger ropes make this more likely.」；206–226：並排第二個鉤環「produces the least additional friction」；40：「some of these could create so much friction that the system simply locks up… trying them out… in a controlled environment is a good idea.」
- TuqUlkAQvBI 359：「you're not supposed to repel with one strand but if you can wrap it around something enough you can get the friction that you need it's just whether or not you have the safety ratio you need」；372–380：「if I have an extended repel and my atc's up here that gives me room between a carabin on my leg Loop… I put a single strand in this one ATC I went down here and back up」；410：「I got to 1.76 and now I got 1.9 I was only 65」；431：「make sure you practice that before you need it」。

**沒找到**：Petzl、BD、Edelrid、DMM、AMGA、BMC 2024 年後專講「tube 器材單股固定繩垂降」的影片。搜尋過的關鍵字見 `videos-fixed/search*.tsv`。

### B. 八字環

| 排名 | ID | 標題（頻道） | 上傳日 | 長度 | 建議片段 | 備註 |
|---|---|---|---|---|---|---|
| 1 | JwSJrWQnNrA | Rappelling Wizards - Intro to Canyoning（HowNOT2） | 2024-01-10 | 49:27 | **905**–**941**（溪降器材從八字環演變；climbing 以前用八字環；八字環不能半路加摩擦）；986–1007（O-ring 讓器材固定、不會卡住和橫向受力） | Ryan Jenks 與 Glacier Black 器材設計者 Brent 對談；HowNOT2 代理 Glacier Black（說明欄寫「We sell all Glacier Black's products」）。說明欄章節 14:03 Descenders。 |
| 2 | EM2XS8x0VKo | 6 ways to rappel like a pro using the figure 8 - CANYONEEERS' TECH TUESDAY #2（Sven Van Cleemput） | 2022-11-22 | 3:41 | **46**（最低摩擦 fast way）、**68**（climbing 傳統穿法，繩子朝腹部）、**117**（再繞鉤環加摩擦；130–144 繩子從右側出，下降時把鉤環閂轉緊）、153（他的常用法） | 說明欄自述「professional canyoning guide based in the French Alps」，沒查到認證機構；1,550 訂閱。2024 前，但示範內容是經典技術。181 起講八字環也能「加鉤環」逐步加摩擦，和第 1 支「不能半路加」說法不同：他的做法是一開始就預先掛多個鉤環。 |
| 3 | ZWwjv8TVKCk | Climbing vs canyon rappelling（HowNOT2） | 2022-05-25 | 29:22 | **215**–**340**（八字環雙股會扭繩、扭轉進器材會卡住、拉繩困難） | HowNOT2 溪降課第 5 集，講者 Brent Roth。2024 前。 |

關鍵字幕摘錄：

- JwSJrWQnNrA 902–932：「the canyon devices are based off of a figure8 style right so before we had atcs so back before we used atcs regularly we used figure8 … even when I was climbing … the issue with this is you can't add friction as easily on the Fly you got a plan ahead so whatever mode you put it in is the mode you're getting」；935–941：「there's ways you can can have an extra carabin or to rig where you have kind of a z rig to add more friction but you got to plan ahead」；986–1007：「there's an o-ring in there that will allow the device to stay in place … the red one currently does not … this will move all over and it can get stuck in various places and crossload」；1993–2007：「could you go down with a climbing rope an ATC and a climbing harness yes yes and yes」。
- EM2XS8x0VKo 85–96：「we want to avoid that the Rope is getting stuck so whenever we use the traditional climbing way the Rope can get stuck while it's touching the rock」；130–144：「make sure that the Rope is always exiting to the right… when you're AB sailing the Rope is going to slightly get the locking mechanism and so when it's to the right one as we descend it closes the Carabiner which is a good thing」。
- ZWwjv8TVKCk 218–257：「what's the significant difference between repelling on an eight with a double strand and a device like this … that keeps the two strands separate … sometimes twists will happen in the Rope… the more twists that I introduce … it's going to be a real Joy pulling it down … it's not uncommon that this will get pinched up on a rock」；315–331：「if twists start going through here they're going into the device they can get jammed up … ideally you want to prevent twists from going into the device」。

**沒找到**：示範「八字環撬開鎖好扣門」失效的影片。Over The Edge Rescue〈Figure 8 Block Failure〉（JkbJF61xZL0，2018）講的是溪降繩結阻擋，不是這個。

**排除**：Rappel Club（vo7sS99cl1k，2024-05-11，eBay 救援八字環 canyon mode，資格不明）、AOKWIT 等廠商短片、HowNOT2〈How strong is a Petzl 8 descender?〉（l8VvEWdDMus，講拉斷強度，與垂降操作無關）、HowNOT2〈How much force does it take to RAPPEL in different modes?〉（VpPxj2zFStk，2022，溪降器材摩擦量測；612–702 有八字環／ATC 數字，但條件是 5 lb 尾端負重和最滑的繩，難轉成攀岩情境，可當備用）。

---

## 二、器材說明書與廠商立場（固定單繩）

| 來源 | 日期 | 立場（原文） | URL |
|---|---|---|---|
| Black Diamond ATC-Guide／ATC-Alpine Guide 說明書 M10798_C | 未標日期（日期碼範例 2018；EN 15151-2 Type 4） | 「Use the ATC-Guide in the HFM when you want more holding power—typically when using small diameter ropes, **when rappelling a single line** or when belaying a climber working a route.」HFM 的摩擦是 RFM 的「two to three times」。另：「Smaller diameter ropes and new dry treated ropes feed through belay/rappel devices faster and can be more difficult to control」。 | https://blackdiamond-cms.zaneray.com/cms/media/92ef04c4-847c-44ef-91f2-ec78c4418012_M10798_C_ATC-Guide_IS-WEB.pdf （curl 下載失敗，全文經 Exa 讀取）；同文 globetrotter 副本 https://media.globetrotter.de/file/1145004_b_atcguide_alpine_black_diamond_24.pdf |
| Black Diamond 舊版 Belay Devices 說明書 MM5853_F（ATC-XP／ATC-Guide／ATC／ATC-Sport／Super 8） | ©2007 | 同一句「rappelling a single line」用 HFM。**BD 明文允許單股垂降，前提是用高摩擦模式**；基本款 ATC 沒有 HFM 的說法。 | http://www.kakibusok.plus.com/Equipment/GuideMode/MM5853_F_Belay_devicesWEB.pdf |
| Petzl REVERSO 說明書 D0017100E (310326) ／英文 D0017100D (200918) | 2026-03-31（日文現行版）；2018-09-20（英文） | 第 8 節只寫：「Rappelling: Braking is achieved by the hand gripping the brake-side ropes. Use a rappel backup system (SHUNT or friction hitch) with the REVERSO.」**沒有禁止也沒有明文提到單股**。另：「Thin ropes … can be more difficult to control while descending」，單繩 ≥ 8.5 mm。 | https://www.petzl.co.jp/download/pdf/ifu/D017AA.pdf ；https://gzhls.at/blob/ldb/3/c/1/c/93dd2540c7d8b02aea3b939f95ab180cbd17.pdf |
| Petzl Tech Tip〈Multi-pitch rappelling with a single rope〉 | 未標日期 | 「the rappel is done only on the single rope with the GRIGRI or **REVERSO (with backup device or friction hitch)**」——Petzl 明文接受 REVERSO 單股垂降，條件是加後備。 | https://www.petzl.com/US/en/Sport/Multi-pitch-rappelling-with-a-single-rope |
| Edelrid GIGA JUL 說明書 | PDF 建立 2024-03-19 | 「13 Abseiling may be done in both the brake-assisted and the manual mode. Attention: For abseiling and lowering secure the rope ends with stop knots and secure the securing device with a blocking [knot].」「4c If only one rope is used, it should always be placed in the brake slot that is opposite the karabiner opening」（4c 寫在裝繩段落，未特指垂降）。 | https://chalkr.de/media/edelrid/edelrid-gebrauchsanleitung-giga-jul.pdf |
| Edelrid MEGA JUL／MICRO JUL 說明書 | 未標日期 | 「11. Abseiling: … turn the securing device around so that the thumb bracket points to the body … Additionally, use a Prusik sling for back securing.」「If an unfavourable combination of karabiner, securing device and rope is employed, the rope's run may either be inhibited or too fast.」可用 EN 1891 靜力繩垂降：「Use of static ropes is allowed … for lowering/abseiling of a person only」。**沒有單股垂降的明文**。 | https://avs.edelrid.com/images/attribut/54544_GAL_MegaJul_MicroJul_MegaJulSport_ANSICHT.pdf （內容經 Exa 讀取 diazilla 副本 https://diazilla.com/doc/559090/7b-7a-5a-5b ） |
| Petzl RAD LINE（既有研究 S6） | — | REVERSO 用在 6 mm 上制動不足，要兩個制動鉤環並建議後備。 | 見 sources-professional.md S6 |

結論：沒有任何一家說 tube 器材**不能**單股垂降。BD 明講用 HFM；Petzl 只要求後備（friction hitch／SHUNT）；Edelrid 要求繩尾打結＋prusik。共同點：細繩、新繩、滑繩摩擦不足，要先在安全處試。

### 事故（單股／固定繩）

| 年份 | 事件 | 重點原文 | URL |
|---|---|---|---|
| 2019（ANAC 2020） | Red River Gorge 搜救隊長單股垂降失控（Mad Rock Mad Lock，10 mm 動力繩，252 lb＋20 lb 裝備） | 「Rappelling a single strand of rope requires more friction and greater care with backups than rappelling on two strands.」器材被意外裝成低摩擦面；autoblock 有燒痕但沒停住，可能被制動手抓住而未完全作用。 | https://publications.americanalpineclub.org/articles/13201215612 |
| 1986（ANAC 1987） | Sedona 救援訓練，60 m 單股 10.5 mm 靜力繩、CMI 八字環，失控墜 7 m | 「as the rappeller descends, the friction caused by the balance of rope hanging below is always diminishing」；開始時太緊、接近底部太鬆；失控時用導引手抓住繩子，讓 prusik 無法作用。編輯註：單股時可把繩繞過背後換手增加摩擦。 | https://publications.americanalpineclub.org/articles/13198703202 |
| 2023（ANAC 2024） | Vermont，ATC Guide＋Klemheist，掛在八字結長尾上，滑墜 100 ft | 既有 sources-accidents.md 已收；固定繩的「掛錯股」典型。 | https://publications.americanalpineclub.org/articles/13201217172 |
| 2022（ANAC 2023） | Auburn，TRS 轉垂降，以為繩子還固定、只穿一股，致死 | 「the use of a single strand in her top-rope system may have distracted her into believing the rope was fixed, even when she had untied it from the anchor.」 | https://publications.americanalpineclub.org/articles/13201216604 |
| 2024（ANAC 2026） | Palisades，11 歲以單股 ATC 垂降，繩子沒固定 | 既有 sources-accidents.md 已收；「The fix was one simple step: a knot clipped directly to the anchor.」 | https://publications.americanalpineclub.org/articles/13201217622.pdf |

風險整理（有來源）：摩擦只有雙股一半左右且隨下方繩重遞減（AAC 1987、HowNOT2 VpPxj2zFStk 680–687「being fireman belayed by the weight of my own rope… when you get halfway down… I'm going fast」）；細／新／濕繩更滑（BD、Petzl、Edelrid）；後備被抓住就不作用（AAC 2019、1987）；「以為固定其實沒固定」與「掛錯股／長尾」（AAC 2022、2023、2024）；加摩擦掛腿環翻轉會失效（Short Guys 97 s）；加太多會鎖死（Short Guys 40、174 s）。

---

## 三、八字環：專業來源與事故

| 來源 | 日期 | 原文 | URL |
|---|---|---|---|
| BMC〈Abseiling: do you know the risks?〉 | 頁面只寫「08 Jul」，無年份 | 「take care when using a figure of eight to abseil because it can accidentally mis-align itself across the karabiner gate. If it becomes even lightly loaded when mis-aligned it can lever open and detach itself from a properly screwed up karabiner with dire consequences. **At least one fatality and a number of serious injuries** have resulted from this.」 | https://www.thebmc.co.uk/en/abseiling-do-you-know-the-risks （舊版 https://services.thebmc.co.uk/abseiling-not-the-quickest-way-to-reach-the-ground ） |
| UIAA Journal 3/2000，Neville McMillan（UIAA 安全委員會英國代表、BMC 技術委員會主席）〈Karabiner Breakings when Using a Figure-of-Eight〉 | 2000 | 1995 英國：FoE 撬開扣門但沒脫出；1996 英國：冒險中心學員在 40 m 橋上垂降，「his body-weight was sufficient to cause the FoE to lever open the karabiner gate, breaking a notch out of the locking sleeve… He died」；1997 德國確保時同樣失效。「the load required to produce the failure is only slightly above a typical climber's static weight」；「Karabiner gate-locking sleeves are only designed to prevent the inadvertent opening… not designed to resist the leverage which a FoE can apply」。對策：prusik 後備（「does not avoid the mode of failure… but does provide a safety backup」）；不要把鉤環同時扣腿環與腰帶；用讓八字環固定在鉤環一端的鉤環（DMM Belaymaster）；或用不鏽鋼 Maillon；或隨時保持受力、正確對位，「Jumping over an edge should be avoided」。 | http://theuiaa.org/documents/safety/Karabiner_Breakings_when_using_a_Figure-of-eight.pdf |
| Pit Schubert（時任 DAV 安全圈主持），SAC《Die Alpen》1998/10，轉載自 DAV Mitteilungen 6/97 | 1997／1998 | 法庭鑑定：同型鉤環「eine Abseilachter-Belastung von ganzen 1,03 kN (ca. 103 kp) ausreicht, um den Schraubverschluss zu durchstanzen」，死者 98 kg。1996 德國 Klettergarten 一例雙手燒傷到骨。「100%ig sichere」做法：「zwei parallel und gegenläufig eingehängte Karabiner」（八字環孔徑不小於 25 mm）。 | https://www.sac-cas.ch/de/die-alpen/schwachstelle-bei-karabinern-mit-verschluss-sicherung-14092/ |
| bergundsteigen 2/12，Pit Schubert〈abgeseilt〉 | 2012-04-23 | 「Wenige Vorteile und viele Nachteile haben ihn auch aus den aktuellen Ausbildungen und Lehrschriften verschwinden lassen, junge Sportkletterer kennen ihn nur vom Hörensagen und vertrauen auf Tuber & Co.」普通直八字環配單繩 10–11 mm 夠，配半繩／雙繩要「arg festhalten」否則燙手或鬆手。 | https://www.bergundsteigen.com/magazinartikel/abgeseilt/ ；PDF https://assets.bergundsteigen.com/2021/08/70-72-abgeseilt.pdf |
| Petzl HUIT／HUIT ANTIBRULURE 產品頁 | 未標日期 | 「Square shape helps reduce rope twist and girth hitch formation」；8–13 mm；HUIT 工作負荷 100 kg。 | https://www.petzl.com/INT/en/Professional/Descenders/HUIT |
| Petzl HUIT 說明書 D01600-G | (240204) | 圖示章節含「Single rope」「Thin rope」「Additional braking」「Safety: Shunt / Prusik」；確保動態：「Maximum shock load 2 – 3 kN, but at the risk of substantial rope-slip, with burning of the hands and possibility of letting go in a heavy fall」。 | https://media.petzl.com/sfc/servlet.shepherd/version/download/068w0000001NyKjAAK |
| Petzl Tech Tip〈Friction modes and tie-offs for the HUIT〉（與 CREPS Rhône-Alpes 合作，canyoning） | 未標日期 | 「Rappelling on a single strand of rope requires knowing how to adjust the descender friction」；「The choice must be made before starting the rappel.」；洞穴式 vertaco 鎖定「can be difficult to undo if the user's feet are not on a supporting surface」。 | https://petzl.com/US/en/Sport/Friction-modes-and-tie-offs-for-the-HUIT?ActivityName=canyoning |
| DMM Braking Devices 說明書（Beetle／Mantis／Pivot／Figure of 8／Anka） | 未標日期（引用 EU 2016/425） | 「12.1 Only use locking carabiners… We recommend the use the DMM Belay Master carabiner for belaying and abseiling.」EN 892 動力繩或 EN 1891 低延展繩（後者只限垂降）。DMM Figure 8 規格：8.9–11 mm／7.3–9.2 mm，116 g，EN 15151-2。 | https://assets.dmmwales.com/download/73/ ；https://products.papertrail.io/dmm/f2f0aafb-figure-8-matt-grey/ |
| Black Diamond Super 8（MM5853_F） | ©2007 | 「The Super 8 is designed to be used in traditional figure 8 mode」；「Make sure the rope(s) runs around the top of the stem, not just through the big hole.」 | 同上 BD 舊版 |

「為什麼攀岩不再用」（有來源的理由）：
1. 鉤環被撬開的失效模式，靠鎖扣擋不住（UIAA 2000、BMC、Schubert 1997）。
2. 摩擦開始前就要決定，半路難加（Petzl HUIT tech tip、HowNOT2 2024 905–941）；配細繩、雙繩摩擦不足（Schubert 2012）。
3. 雙股會扭繩、扭轉進器材卡住、拉繩困難（HowNOT2 2022 215–340；Petzl 用方形設計「reduce rope twist and girth hitch formation」）。
4. 不能當像樣的確保器（Petzl 說明書確保時大量滑繩、燒手；UIAA：「For belaying there is no need to use a FoE」）。tube 一個抵兩用，所以教學與教科書轉向 tube（Schubert 2012）。
5. 溪降、救援仍用：單股、粗繩或濕繩、要能快速脫離（HowNOT2 2024 874–891；Sven 2022）。

**DAV／bergundsteigen 近年文章**：bergundsteigen 2024-06-03 Andi Dick〈Fehler beim Abseilen: 20 Tipps〉只提到「Achter … gar nicht im Gurt eingehängt」與鉤環掛錯，沒有八字環撬開的新案例（https://www.bergundsteigen.com/artikel/fehler-beim-abseilen-20-tipps/）。

**沒找到**：AAC 近年（2015 後）八字環撬開鉤環的報告；Exa 搜尋只找到其他鉤環被撬開的 lead-fall 案例，不相關。

---

## 四、可直接寫進文章的要點（附來源）

固定單繩、tube：
- 可以，但摩擦大約只有雙股的一半，越往下越鬆：開頭繩子重，快到底才發現太快（AAC 1987；HowNOT2 2022 680 s）。
- 先選高摩擦：BD 說單股用 HFM；Petzl 要 friction hitch／SHUNT 後備；Edelrid 要 prusik 和繩尾結。
- 加摩擦三招由弱到強：並排第二個鉤環 → guide 孔扣鉤環壓住器材 → 腰間 Z 型；全部要在地面試，太多會鎖死；Z 不要掛腿環（Short Guys 2026）。
- 先確認繩子真的綁死、自己扣的是對的那一股（不是結的長尾）：AAC 2022、2023、2024 三起都出在這裡。
- 抓住 prusik 會讓它失效（AAC 2019、1987）。

八字環：
- 攀岩已被 tube 取代（Schubert 2012），溪降、救援、老一輩仍在用。
- 最大風險：八字環卡在鉤環閂口上，體重就能撬開鎖好的鉤環（1.03 kN，Schubert；BMC「at least one fatality」；UIAA 1996 橋上 40 m 致死）。對策：開始前和每次停下再受力前檢查對位、不要跳出邊緣、用 Belay Master 類鉤環或兩個反向鉤環、加 prusik 後備。
- 雙股會扭繩、卡住、難拉；方形八字環（HUIT）按 Petzl 的說法能減少扭繩和 girth hitch（繩子翻成雙套結鎖死）。
