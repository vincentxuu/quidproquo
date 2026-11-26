# 單繩加細拉繩（tag line／pull cord／Reepschnur）垂降：影片與專業來源

研究日期：2026-10-24。所有列出的網頁、PDF 都實際打開（curl 轉文字；Alpine Team NZ 部落格、Lacrux 加用 r.jina.ai）。影片字幕在 `.work/rappel-how-to/videos-tagline/`（`<id>.en-orig.vtt` 是原語言自動字幕，`<id>.txt` 是每約 15 秒一段、帶秒數的整理版；**`en.vtt` 對 Haley、NZ 兩支是機器回譯，不要引用，一律用 en-orig**）。

工具降級（toolDegradation）：Groundlane 先前回 401，本輪沒有重試；搜尋用 Keenable keyless（可用）＋ `yt-dlp ytsearch`；頁面用 curl＋Python html→text，抓不到時用 r.jina.ai。YouTube 字幕下載中途多次 429，改用 `--cookies-from-browser chrome` 並加間隔後成功。Lacrux〈Single rope and tagline in multi-pitch climbing〉curl 與 jina 都只拿到導覽列，**沒讀到內文，不列來源**。

與 `sources-professional.md` 的關係：B7、B14、C5 已有的 Petzl S3/S6、bergundsteigen S16、Alpine Team NZ S33、Edelrid S19 這次全部重開核對，下面引文是重開後的原文；有兩處需要修正舊稿（見 §4）。

---

## 1. 影片（排序＝建議放進文章的優先順序）

### V1. Colin Haley — Rappelling with Ropes of Very Different Diameters — `xQWcuY6lv0o` ★首選

- 上傳：**2026-08-27**；長度 424 s（7:04）；頻道 Colin Haley（2.35 萬訂閱）。
- 資格：職業阿爾卑斯式攀登者（Cerro Torre 冬季獨攀等），**不是認證嚮導**。Climbing 2026-09-03 報導稱他 "Renowned American alpinist"，並引用他的作法。
- 贊助：影片與說明欄**沒有揭露**。他的網站 About 頁寫 "my main sponsors – Patagonia, Petzl, and Scarpa"（https://www.colinhaley.com/about-me/），影片示範的拉繩是 Petzl Pur'Line，屬利害關係，引用時要寫。
- 做法（混合派）：兩條繩用 EDK 連接，**直徑差很多時打兩個 EDK**；在連接結旁邊的**粗繩**上打雙套結扣一個有鎖鉤環，鉤環扣回垂降環另一側的粗繩（＝ Reepschnur 式 carabiner block）；**兩股照樣都放進管狀器垂降**（說明欄："Even though the single rope is completely "blocked" with the locking carabiner, I still put both ropes in my belay device and rappel as normal"）；**拉細繩**。
- 最佳片段：
  - **172 s**（2:52）knot migration 原理："the skinny rope passes through the belay device much faster and the knot starts to migrate away from the rappel anchor… someone might rappel off the end of the skinny rope and have a bad accident, which is exactly what happened recently."（188–218 s）
  - **233 s**（3:53）為什麼拉細繩："I prefer almost always to set things up to pull the skinny rope"，並承認缺點：拉粗繩比較好拉、卡住時手上留的是粗繩（233–266 s）。
  - **298 s**（4:58）示範雙套結＋有鎖鉤環 block："right next to the knot connecting the two ropes, I make a clove hitch. I take a locking carabiner… clip this locking carabiner into the single rope on the other side of the rappel anchor."；330–362 s：結完全不會移、細繩斷了也還掛在粗繩上。
  - 378–420 s：鉤環增加卡繩機會（他的經驗是很少）、鉤環會被岩石刮。
- 與原廠／其他來源的衝突：
  - Petzl：block 之後 "the rappel is done only on the single rope… Do not descend on the retrieval cord"；Haley 兩股都進器材。不過 Petzl 用 REVERSO 時也要求 "pass the cord through the second rope slot"，所以「細繩在器材裡」本身兩者一致，差別在 Haley 把細繩也當成垂降繩的一部分（未 block 時兩股都受力）。
  - bergundsteigen（Semmel）："Under no circumstances should you tie two sack stitches one after the other"；Haley 打兩個 EDK。Edelrid 則支持在單股細滑繩時加第二個 flat overhand。→ 兩說並列。
  - bergundsteigen 說鉤環固定法 "rather problematic… only a good option for steep abseils"；Haley 說實務上很少卡。
- 開頭 31–109 s 是「多數人用兩條半繩／雙繩比較好」的前言，可跳過或當 caveat。

### V2. New Zealand Alpine Team — How to rappel with a tagline. — `lC1PIOGWsZM`

- 上傳：**2026-10-04**；長度 183 s（3:03）；頻道 New Zealand Alpine Team（7,040 訂閱）。
- 資格：說明欄 "Team mentor and IFMGA guide Kim Ladiges"；explore-share 嚮導頁列 Certificates "IFMGA, NZMGA, TCIA"（https://explore-share.com/mountain-guide/kim-ladiges）。
- 贊助：無揭露、未見產品導購。
- 做法（第三派，拉粗繩＋預掛）：結放在讓他**拉粗繩（lead line）**的那側；第二人**先把垂降器和 prusik 掛在兩股上（pre-rig）**，第一人的器材和 prusik 在下面，兩人的器材把兩股鎖住，繩子不會滑；第一人到站後**繼續把器材留在繩上、或把繩尾綁在下方固定點**，第二人才不會滑繩。
- 最佳片段：
  - **22 s**（0:22）點出爭議："a lot of people are talking about always setting it up so you pull the tagline… that is a solution, but personally we prefer not to do it that way"。
  - **37 s**（0:37）為什麼拉粗繩："anytime there's going to be a hard pull, I always try and put it through with the lead line… if there's any problem, you end up with the lead line to solve your issues"（37–67 s）。
  - **99 s**（1:39）示範 pre-rig："I've pre-rigged the second person… once I disconnect and start abseiling, there's no issue that this rope is going to pull through because of the friction through this. It's basically blocked in here."（99–131 s）
  - **146 s**（2:26）第二人的保護："once I'm at the bottom, I need to make sure that the ends of the rope are not just free. Otherwise, the second person's going to have slippage. So, either I leave my belay device on… or I tie the ends off to the anchor."（146–170 s）
- 衝突（要在文中明講）：
  - 英國 IFMGA 嚮導 Calum Muskett（Climbing 2026-09-03）把「中點放細繩、拉粗繩」稱為 "inherently unsafe"；Haley、bergundsteigen、Alpine Savvy 預設拉細繩。Ladiges 的拉粗繩**只有在第二人預掛＋第一人在下方鎖住繩尾時**才成立，片段要包含 146–170 s，不能只剪前半。
  - 同一團隊 2013 部落格（Alpine Team NZ）寫 6 mm tag line "too thin and weak to abseil directly on"、只垂降在主繩上；這支 2026 影片改為兩股一起下。屬同機構前後立場不同。
  - Petzl：只垂降單繩、不垂降在拉繩上。

### V3. EDELRID — Single Rope Multi-Pitch Climbing – Our Favorite Setup & Tips — `aDVjeWyhXpE`

- 上傳：**2025-09-29**；長度 680 s（11:20）；頻道 EDELRID（原廠，2.8 萬訂閱）。
- 資格：說明欄只寫 "Daniel and Dörte share our go-to setup"，**個人資格未查到**；層級屬第 3 層（原廠：用法、原理）。
- 贊助：原廠影片，說明欄列出全部自家產品（EAGLE LITE 9.5、TAGLINE 4 mm、PINCH、TILLIT 等）。
- 做法（Petzl 派，單股＋knot block）：繩子由外往內穿環，**八字結當 block 卡在環上、八字結上的鉤環扣回受力股**當備援；tagline 一端接在系統上、裝在拖包／繩袋裡隨人下降，最後拉 tagline 收繩。
- 最佳片段：
  - **433 s**（7:13）"we want to repel on the single rope using the pinches… want to use the tag line as a draw cord to pull the rope"；**448 s**（7:28）"We have a figure eight knot as a stopper knot which gets blocked in the eyelet. We connect the carabiner from the figure eight knot to the standing rope to have this as a backup in case the knot… should slide through the eyelet."；479 s 負重測試後才解開自我確保。
  - **585 s**（9:45）**knot 穿過大環的示範**："The eyelid is big enough that the figure of eight knot jumps through the eyelet. And even if we fix it with a carabiner on the other side, as soon as the carabiner has jumped through the eyelet, it's hard to pull it backwards. So in this case, it's easier to use a clove hitch… and a locking carabiner"（585–650 s）。
- 限制／衝突：
  - **器材是 EDELRID PINCH（輔助制動器），不是管狀器**；本文主題是 tube，要寫明「器材不同，block 與備援鉤環的作法相同」。
  - 用的是 **4 mm** Edelrid TAGLINE；Pingora 事故（§3）用的也是 Edelrid 4 mm。不要讓讀者以為 4 mm 可以拿來垂降。
  - 結論與 Petzl 一致（block＋有鎖鉤環備援、只垂降單股），與 bergundsteigen「鉤環固定法有問題」相反。

### 備選（不建議優先放，但可在特定段落引用）

| id | 上傳 | 長度 | 頻道／資格 | 用途與秒數 | 限制 |
|---|---|---|---|---|---|
| `TuqUlkAQvBI` Rappelling on 5mm? | **2025-01-22** | 722 s | HowNOT2（Ryan Jenks；自營器材店，說明欄每條繩都連到自家店） | **細繩摩擦**：190 s Beal 說要雙股（"supposed to be double stranded"）；221 s "my ATC is definitely not rated for 5 mm"、237 s Alpine ATC 太快（"instant retake… terrifying"）；267 s Beal 建議 Air Force 1 兩股放同一孔；299 s 繩繞兩次進 ATC 增摩擦；589–669 s 說明書的 Machard/prusik 能不能抓住，French prusik 可、3 圈 prusik 太滑 | 是**垂降在兩股 5 mm 上**，不是 tag line 法；單人慢拉、娛樂性測試 |
| `S3JLEA5lgvs` Which Rope Block Systems are SAFER for Single Strand Rappels? | **2025-07-07** | 410 s | Short Guys Beta Works（Jason Kolaczkowski；About 頁：在 Colorado Mountain Club 教學多年，**非認證嚮導**） | **block 分類與取捨**：83 s 只靠結（要小環；結可能被吸進環卡住，114 s）；147 s 鉤環 block（雙套／三套結扣鉤環、要大到不會穿環）；259 s Reepschnur hitch（最穩、最容易卡）；337 s 兩條繩時把 bight knot 打在垂降股，接繩結失效也不會掉 | 以 Grigri 單股為例；業餘教練 |
| `dZ9rH1upD54` Calata in doppia con Singola & Cordino | **2026-06-20** | 1004 s | Mic & Fil - Enjoy Life（義大利文；**資格未查到**） | **管狀器混合派**：227–279 s EDK 再加一個 "nodo tampone"（"Coi due diametri diversi gli attriti cambiano parecchio… è obbligatoria"）；311–443 s 在細繩上打雙套結扣小鉤環、扣回單繩，"per scongiurare… che il nodo possa passare dentro l'anello… [il dyneema] potrebbe scorrere dentro la piastrina"；553–599 s 自我確保扣在拉繩上方；767–848 s 下一段結會在錯的一側，要固定繩後解結重打 | 義大利文、資格不明；作法同 Haley |
| `MFAmzTRo63I` Petzl RAD LINE Masterclass Ep1 | **2024-02-06** | 1182 s | Dave Searle（說明欄揭露："affiliated with [Petzl] (UK Team member) and most of the gear in this video for free"） | **6 mm 摩擦**：669–700 s Munter 可用但扭繩；845–890 s 兩股 RAD LINE 時加一個鉤環過兩股增加摩擦；748 s "you always want to use a third hand" | 主題是滑雪登山用 RAD LINE 雙股垂降，不是 tag line |
| `cCS2Oj6q1MU` The Dangerous Truths About Thin Taglines on Rappels | 2024-10-07 | 282 s | Short Guys Beta Works | 106 s "there isn't even enough friction to repel on the line itself"；123 s 細繩難拉；171 s 細繩易纏、用繩袋 | 示範 3 mm Amsteel，作者自承 "falling outside of standard practice"，**不建議放** |

搜尋過但不收：Ryan Tilley 兩支（2020）、Outdoor Research（2018）、EpicTV Brette Harrington（2017）、Michael Schneiter Reepschnur（2020）、Mark Smiley（2021）、Skills for Climbing（2021）、BetaClimbers（2019）、HowNOT2 "How to rappel with NOT enough rope"（2023-10-11）——都早於 2024；Ripperkon（2025-02-23，非專業）、Les Manips d'Alain（2024-08-23，法文、資格不明）、Arrampicando con Giuseppe `ZvYYmMRW7OI`（字幕確認 "cordino" 指 prusik 繩，題目不符）、ÖAV `4APkPXusR9I`（2026-05-26，字幕沒有提到 Hilfsleine）。頻道掃描結果在 `videos-tagline/chscan.md`，搜尋清單在 `search.tsv`、`search2.tsv`、`dates.tsv`。

**沒找到的**：沒有 2024+ 的專業影片**完整示範 bergundsteigen 的純 (b) 法**（兩股進 tube＋多一個鉤環、結在細繩側、拉細繩、不加 block）。最接近的是 V1 Haley（兩股進器材、拉細繩，但多加 block）。Petzl、Beal、bergundsteigen、Hard Is Easy、JB Mountain Skills、BMC、AMGA 頻道都沒有這個主題的 2024+ 影片（頻道掃描 37 個頻道）。

---

## 2. 專業來源（全部打開）

### P1. Petzl — Multi-pitch rappelling with a single rope（頁面無日期）
https://petzl.com/INT/en/Sport/Multi-pitch-rappelling-with-a-single-rope

- "When the rappel length exceeds half the rope's total length, a rope retrieval cord must be used. In this configuration, the rappel is done only on the single rope with the GRIGRI or REVERSO (with backup device or friction hitch). The rope must be rigged to the anchor with a blocking technique (knot block at the rappel ring attached to a locking carabiner) and attached to a retrieval cord. Do not descend on the retrieval cord; it is only used to retrieve the rope."
- 兩種 block 圖：(1) "Blocked on a small ring with backup. If the knot goes through the ring, the fall will be stopped, but rope retrieval will be complicated… The next rappel cannot be set up until the rope has been fully retrieved… Bulky: more likely to get the rope stuck"；(2) "Blocked without a rope-joining knot, with auto-locking carabiner… The next rappel can be set up without threading the rope through the ring… With a large ring, risk of poor carabiner positioning and/or stuck rope."
- "Petzl recommends that the rappel setup always be secured with a locking carabiner clipped to the rope, to back up the knot block. There is a risk of the knot passing through the ring, even if the block seems secure."
- "The difference in diameter between the ropes may require a special joining knot (e.g. flat overhand bend with stopper knot)."
- "Blocking techniques are cumbersome; beware of sticking the rope: if the single rope gets stuck out of reach, the retrieval cord can not be used to belay for the recovery. The techniques presented above are not suitable for the rapid execution of a long series of rappels…"
- "Before un-tethering from the anchor, put your body weight on your rappel system and verify that it is properly set up. Take care to rappel on the correct strand. Do not rappel on the cord."
- "The retrieval cord is used to retrieve the rope. So it's important to keep it with you at all times… With a GRIGRI: clip the cord to your belay loop with a quickdraw. **With a REVERSO: pass the cord through the second rope slot.**"
- "In the event of difficulty pulling on the cord (small diameter, friction...), use an ascender for better grip (BASIC, ASCENSION, TIBLOC)."

### P2. Petzl — Rappelling on the RAD LINE cord（頁面無日期）
https://petzl.com/us/en/sport/tech-tips/basic-techniques/rappelling-on-the-rad-line-cord/RADsystem-pe05-descente-rappel-JIVE_SPO_a77w0000000PC6hAAG.html

- 情境是**垂降在 RAD LINE 本身**（不是 tag line 法），但說明 tube 在 6 mm 上的摩擦：
- "The REVERSO is designed for use on single ropes greater than 8.9 mm in diameter, and on half or twin ropes greater than 7.5 mm in diameter. With the 6 mm RAD LINE cord, the braking capability of the REVERSO is insufficient. While rappelling, if the user needs to negotiate tricky sections, free a hand and/or untangle the rope, there is a risk of losing control of the rappel."
- "Even so, there is a way to use the REVERSO with the RAD LINE cord: set up your REVERSO with two braking carabiners… In any case, using a rappel backup system is recommended."
- 10 m 懸空測試結果（配置名稱在圖片裡，文字抓不到）："Good control… One-handed braking: ok"／"Acceptable friction, but requires greater vigilance"／"Very low friction"。

### P3. Beal — BACK UP LINE 使用說明書（Notice，PDF 建立 2026-07-08，檔名 202607）
產品頁：https://beal-planet.com/en/products/back-up-line-5mm ；說明書：https://www.beal-planet.com/cdn/shop/files/BEAL_-_XNOTICE.BACK_UP_202607_-_Notice_livret_100x100.pdf

- "The Back Up Line is a static rope only suitable for abseiling and hauling specifically for crevasse rescue."
- "**In case of abseiling with 1 strand of single rope joined to one strand of Back Up line, it's recommended to use the Beal AIRFORCE 3 in conjunction with a Machard knot of 5 mm as Beal Jammy. (Fig.4)**"
- "For Abseiling on two strand of Back Up Line… Beal AIRFORCE 3 in conjunction with a Prusik knot of 5 mm as Beal Jammy. (Fig.5)"；"For Abseiling on one strand of Back Up Line, it's recommended to use Beal Expresso, AIRFORCE 1 or 3 in conjunction with two carabiners… reserved for expert users… (Fig.6)"
- UIAA 110 警語："Abrupt stops while abseiling may result in arrest forces of 6 kN"；並提醒細徑靜力繩會降低器材性能與握持，"Before first use, realize your own test to ensure your devices are suitable."
- Fig.4「Back Up Line + Single Rope」有兩張圖（我看圖判讀，非原文）：左圖只有單繩（灰）進器材、Back Up Line（粉）另外用鉤環掛在吊帶旁；右圖兩股一起進 tube、Machard 包兩股。**圖上沒有畫 block 結**。所以 Beal 說明書允許「單繩＋Back Up Line 兩股一起垂降」，屬 (b) 派，但沒有談結放哪側、拉哪條。
- 規格（產品頁）：5.5 mm（頁面標題仍寫 5MM）、21 g/m、EN 564:2023、UIAA 102、UIAA 110、斷裂 15 kN；"ultra-static… should not be used for roping, progressing or any situation requiring dynamic qualities."

### P4. bergundsteigen — #alpinhack: Rappelling with aid lines (Rad Line & Co)
作者 **Chris Semmel**（"Bergführer, Sicherheitsforscher und Sachverständiger"）；網頁 **2025-05-05**；頁面註記 "Published in issue #126 (Frühling 24)"。https://www.bergundsteigen.com/en/artikel/alpinhacks-abseilen-mit-hilfsleinen-rad-line-co/

- "Yes, you can also use ropes with different diameters for abseiling. A single rope and a 5 to 6 mm cord can also be used."
- "A simple sack stitch is sufficient as a connecting knot, even with ropes of different thicknesses… strength… 4-5 kN before the knot unravels"；載荷推算：垂降時站點 1–2.5 kN，結只受 0.5–1.25 kN；"Under no circumstances should you tie two sack stitches one after the other… greatly increases the risk of the rope getting caught"；尾巴 30 cm。
- "Even a 5 mm polyamide cord in combination with a single rope has a strength of 4 kN."
- 器材："The tube works as an abseiling device. If you combine a thin single rope with a cord, the braking effect can be very low, which is why you should use two carabiners under the tube (Fig. 2)."
- 滑移："the thinner rope in the tube is subject to less braking force. As a result, it slides upwards towards the abseil station… Slipping is avoided if the knot is placed on the side of the thin rope and rests against the abseil eye."；第二人下降時，下方的人用手輕握細繩防滑。
- 鉤環固定法："Techniques with a carabiner attachment to fix the single strand to the belay… are rather problematic… often difficult to pull off… can easily become entangled… only a good option for steep abseils (e.g. canyoning)."
- 拉繩："It is always best to pull off at the aid line… the thicker, stiffer rope falls down. If you were to pull off on the thicker strand, the thin auxiliary rope would fall down along the rock, which would lead to more frequent snagging…"

### P5. Alpine Team NZ（New Zealand Alpine Team）— Abseiling with a single rope plus tag line
2013-06-08 發佈（頁面另標 Updated: May 2, 2023）；https://alpineteam.co.nz/post/abseiling-with-a-single-rope-plus-tag-line

- "you can bring a lightweight tag line (6mm). This is too thin and weak to abseil directly on, but can be used to pull your main rope down."
- "thread the climbing rope through the anchor, tie a figure 8 on a bight and clip back into main strand. Clip one end of tag line into same biner. Abseil off single strand of climbing rope."
- "The tag line is easily tangled, so I prefer to clip the other end of tag line to descending climber and have 2nd climber at top feed out tag line as they descend…"
- "The down side of this method is that the rope is harder to pull down (more friction) and more likely to get stuck. I would generally prefer to climb and abseil on 2 half ropes if this is an option."

### P6. Edelrid — Knots for connecting ropes when rappelling – a comparison（知識庫，無日期）
https://edelrid.com/int-en/knowledge/knowledge-base/knots-for-connecting-ropes-when-rappelling-comparison

- 開頭列出情境之一："when climbing using a single rope then rappelling by combining this with a thin take line."
- RAPLINE PROTECT PRO DRY 6.0 mm（EN 564、11.0 kN）測試：flat overhand 4.2 kN 開始翻、4.7 kN "Rolled off the end"；兩個 flat overhand 4.1 kN 翻、5.7 kN 斷；double fisherman 6.9 kN 斷、不翻；figure-8 3.3 kN 開始翻。
- "When connecting a single rope and a RAPLINE PROTECT, the requirements are only just met."（要求：單股 120 kg 時 2 kN 前不翻、5 kN 前不斷；雙股時減半）
- 結論："When rappelling/lowering on a single strand with thin, smooth half ropes, the flat overhand bend should be secured against rolling off the end of the rope with a second such bend."；尾巴約 30 cm、四股分別拉緊。
- Edelrid TAGLINE 4MM 產品頁（https://edelrid.com/int-en/sport/ropes/tagline-4mm）只寫 "Light tagline on the market | 10 g per metre"，內文主要靠 JS／影片，文字抓不到用途限制。

### P7. Mammut
6.0 Rappel Cord 產品頁（https://mammut.com/us/en/p/2020-00701-1037/60-rappel-cord）curl 只拿到 1.8 KB 外框，**沒有可用內容**；Mammut 沒有找到 tag line 垂降的技術頁。不列來源。

### P8. DAV／SAC／BMC
搜尋（Keenable）沒有找到三者專門談「單繩＋細拉繩」的頁面。已知相關：DAV Panorama 4/2020（S13）談細繩摩擦用 Doppelkarabinermethode，BMC S10/S11 只談單繩下放或兩條繩的 figure-8 block（見 `sources-professional.md` B14）。不新增。

---

## 3. 事故與事件

| 事件 | 日期 | 系統 | 經過（原文） | 來源 |
|---|---|---|---|---|
| **挪威 knot migration 死亡** | 2026 年 7 月下旬 | 9.6 mm Edelrid 動力繩＋6 mm Petzl Pur'line，double fisherman 連接，穿過繩環 master point；**兩人都用 ATC＋prusik、兩股一起垂降** | "the thin tag line moved through the belay device faster than the thicker dynamic line due to differences in friction… the joining knot… was moving away from the anchor point, shortening the tag line… When they were about 10 meters (33 feet) above their partner, the end of the tag line went through their ATC and they sustained a fatal 100-meter fall." 第一人下降時中點在粗繩（結在細繩側、靠住 master point），第二人下降前或下降中，結已移到另一側。"If the midpoint had been set on the dynamic line, the joining knot likely would have been blocked by the master point knot." | Climbing，Natalie Berry，2026-09-03 發佈（9-10 更新；應家屬要求移除姓名）https://climbing.com/videos/death-of-27-year-old-climber-exposes-danger-of-knot-migration-during-rappel |
| 同上，專家意見 | — | — | Calum Muskett（英國 IFMGA）："setting the midpoint on the tag line and pulling the dynamic rope [is] 'inherently unsafe'"；Haley："use two dynamic ropes when you can, and if using a tag line, always fix the dynamic rope and use the tag line for retrieval"；Landefeld 的減險法：第一人到站後拉一公尺細繩、用有鎖鉤環扣在確保環 | 同上 |
| 同上，Alpine Savvy 解析 | 2026-09-21 | — | "For most climbers, in most cases, it's best practice to rig to pull the skinny rope."；"It tends to happen more at the start of the rappel… If you're on a vertical or free hanging rappel, knot migration is more likely."；結若能穿過大的 master point："if you're doing a knot block and only rapping on one strand, this could kill you!"；第二人減險：器材翻成低摩擦、或兩股放同一孔；第一人可把粗繩固定在站點、只垂降粗繩，並 "always keep control of the skinny rope… clip it to their harness… or put it through the other slot in their tube" | John Godino，https://alpinesavvy.com/blog/knot-migration-what-is-it-how-to-fix-it |
| 同上，Kirkpatrick | 2026-09-14 | — | 以假想情境說明：舊 ATC＋濕繩更容易滑；防第一人：兩股打 Stone knot 或有人握住；"just because the rope didn't creep for the first person doesn't mean it won't for the last"；細繩尾端打 overhand on a bight 讓人能扣進去；也列出拉粗繩的好處（好拉、卡住時能爬粗繩） | Andy Kirkpatrick，https://andykirkpatrick.substack.com/p/sequences-in-a-tragedy（**文中有點名死者；Climbing 應家屬要求不具名，寫文章時不要寫名字**） |
| **Pingora（Wind River）卡繩、直升機與救難隊救援** | 2026-08-20 | 9.3 mm 單繩＋Edelrid **4 mm** tagline，flat overhand、"Reepschnur carabiner block"，拉 tagline | "After pulling about 70 feet of tagline down, he says he 'felt the rope become lodged'"；只剩 4 mm 靜力繩，不能先鋒回去，最後用 inReach 求救、在壁上過夜。IFMGA Zach Lovell："Lower-angled terrain, especially if riddled with flakes and blocks, can lead to stuck rappels and can be much more problematic with a single/tag system… since a static tagline isn't appropriate to lead on." | Climbing，Maya Silver，2026-09-16 https://climbing.com/news/a-climber-and-his-rescuer-share-takeaways-after-getting-benighted-on-pingora-peak |
| **Red Rock, Community Pillar 死亡** | 內文寫 "On January 18"（攀登年 2025）；圖說寫 "November 2025"——**來源內部矛盾，日期待查** | Reepschnur（rope／carabiner／knot block），**Grigri** 單股 | "she had attached her Grigri to the 'pull' strand rather than the 'rappel' strand. When she weighted the device, the rope pulled through the anchor"；日落後半小時、低溫、趕時間。分析："Attaching a rappel device to the pull strand… results in an immediate, unobstructed fall"；pull strand "can be extended at the bottom of the rappel with slings, a cordelette, etc." | ANAC 2026（Joe De Luca, Climbing Magazine and The Editors）https://publications.americanalpineclub.org/articles/13201217659 |
| **Psycho Tower 險些致死** | 2025-04-10 | 單人攀登後 carabiner block，對折 9.5 mm 70 m，**Grigri**；**沒有 tag line** | 預穿下一段時把拉繩端穿過鍊環，掉了垂降股後誤把拉繩股裝進 Grigri；只輕拉測試就解開自我確保，"instantly toppled backward"，靠抓住繩尾止住 20–30 呎墜落。作者："This accident would not have happened had I been doing traditional, non-Reepschnur rappels"；腰高的站點讓他跳過完整負重測試。編按：carabiner block "also called a knot block, a rope block, or a Reepschnur" | ANAC 2026（Marcel Such）https://publications.americanalpineclub.org/articles/13201217645 |

注意：兩件 AAC 案例都是 **Grigri 單股 block，不是 tube＋tag line**；可用來支撐「block 法掛錯股＝直接墜落」「上站前要完整負重測試」，但不能寫成 tag line 事故。

---

## 4. 整理給寫文章用

### 兩（三）派作法

**(a) Block 派：只垂降單繩、細繩只用來拉**（Petzl P1、Alpine Team NZ 2013 P5、Edelrid 影片 V3）
1. 單繩穿環；在環的一側打 block 結（八字 on a bight 或 flat overhand＋butterfly 等），結要比環大。
2. 結上的有鎖鉤環扣回受力股（Petzl："always be secured with a locking carabiner… risk of the knot passing through the ring, even if the block seems secure"）；大環改用雙套結＋鉤環（Edelrid V3 585 s）。
3. 細繩接在 block 那側（接繩結或直接扣鉤環）。
4. 器材只裝**對面那股**（受力股）；用 REVERSO 時細繩穿第二個槽，只為了帶著走（Petzl）。加摩擦套結。
5. 解自我確保前完整負重測試、確認是對的那股（Petzl；AAC 兩案）。
6. 到底後拉細繩；拉不動用上升器／Tibloc（Petzl）。
- 風險：結穿環、拉錯股＝直接墜落、結和鉤環較易卡、繩卡住時手上只剩細繩、每段都要重穿整條繩、細繩被風吹走。

**(b) 兩股派：兩股都進 tube、不 block**（bergundsteigen P4；Beal 說明書 Fig.4 右圖 P3）
1. 單繩＋5–6 mm 繩用單一個 flat overhand（Sackstich）連接，尾巴 30 cm（bergundsteigen；Edelrid、Petzl、Haley 主張再加一個）。
2. **結放在細繩那側、抵住垂降環**（粗繩穿環）＝ 收繩時拉細繩。
3. tube 下加兩個鉤環增加摩擦（bergundsteigen；Petzl RAD LINE 頁同理）；Beal：Airforce 3＋5 mm Machard。
4. 第二人下降時，下方的人輕握細繩防滑（bergundsteigen）。
5. 拉細繩，粗繩自己掉下來（bergundsteigen）。
- 風險：結若在粗繩側或穿過大環 → knot migration（挪威事故）；細繩摩擦不足；拉細繩費力、卡住時只剩細繩。

**(a+b) 混合派**：Haley V1、Mic & Fil、（Climbing 報導中的 Haley 建議）——兩股進 tube，但在粗繩上加雙套結鉤環 block、拉細繩。結不會移、細繩斷也還在粗繩上；代價是多一個會卡的鉤環。

**拉粗繩派（少數、進階）**：Ladiges V2、Kirkpatrick、Alpine Savvy（"experts-only"）。理由：好拉、卡住時有動力繩可爬、多段垂降不必每段重打結。前提：第二人預掛、第一人在下方鎖住繩尾或固定在站點。Muskett 稱 "inherently unsafe"。

### 拉哪一條（更新 C5）
- 拉細繩：bergundsteigen、Haley、Alpine Savvy（預設）、Muskett、Climbing 報導。
- 拉粗繩：Synnott（S30）、Ladiges、Kirkpatrick（列為優點）、YOSAR（S26，細繩穿固定點）。
- 2026 年挪威事故後，主流共識偏向「預設拉細繩」，拉粗繩要搭配預掛／鎖住繩尾。

### 需要修正 `sources-professional.md` 的地方
1. **S19 Edelrid**（B7 與 C2）：舊稿寫「以 thin take line 搭單繩垂降時，flat overhand 要再加一個同樣的結」。原文結論是 "**When rappelling/lowering on a single strand with thin, smooth half ropes**, the flat overhand bend should be secured… with a second such bend"；對單繩＋RAPLINE 的結論只有 "the requirements are only just met"。舊稿把半繩單股的建議套到 tag line，**要改寫為依原文**。
2. **S16 bergundsteigen**：作者是 **Chris Semmel**（舊表寫「編輯部」）；頁面另標出自 issue #126 (Frühling 24)。
3. Petzl S3：REVERSO 搭拉繩時，拉繩「穿第二個槽」——細繩其實在器材裡，只是不受力；文章若寫「只垂降單繩」要避免讀者以為細繩不進器材。

### 未開但值得追的線索
- Andy Kirkpatrick《Down》p.329 起談 knot migration（Alpine Savvy 轉述，列出至少六種減險法）——書，未讀。
- Mountain Project 討論串 "Rappel accident involving knot migration"（論壇，不當來源）。
