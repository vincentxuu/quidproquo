# R-videos — 多繩距／大岩壁拖包文章的影片（2026-10-24）

規則：`.agents/skills/post/references/climbing-gear-videos.md`；日期門檻：上傳 ≥ 2024-01-01，內容明顯是舊片重上也算舊。

toolDegradation：全程 shell `yt-dlp`（加 `--cookies-from-browser chrome`），沒用到 web fetch 鏈。
流程：先 grep 既有清單（`.work/aid-climbing-gear/lists2/`、`R-videos*.md`、`.work/climbing-gear-videos-20261023/`）→ `node scripts/yt-candidates.mjs --match "haul|traxion|pulley|lower.?out|docking|荷上げ|ホーリング|홀링|拖包" --search ... --verify`（37 個頻道、15 支候選）→ 關鍵字補漏（路線名、日文、韓文，約 60 組）→ 逐支查確切 upload_date → 讀字幕／說明欄 → 有畫面才算數的時間點，用 360p 片段抽格（ffmpeg tile）看過。
原始資料（scratchpad，session 結束會清掉）：`/private/tmp/claude-501/-Users-xiaoxu-Projects-quidproquo/29836343-db19-4e57-973d-bb9f915b4148/scratchpad/haulvids/`（`cands.md` 腳本輸出、`search*.txt`／`*meta*.txt` 搜尋與日期、`subs/<id>.txt` 字幕文字檔、`frames/*.jpg` 抽格）。

每支都用 yt-dlp 確認過 id、標題、頻道、上傳日期、長度；下面的 start 都小於長度。秒數來自字幕；標「畫面」的是抽格確認過。

---

## 參考影片：S-3yQfoi2V8（使用者給的）

- 【滝行】ハラケンと行く本人達大爆笑マルチピッチクライミング-瑞牆山　十一面壁『秋一番』5.10c/8p（TAKEMOVIE（タケムービー））
- 上傳 2026-06-25，長度 1686 s。
- 字幕 240 s：「今回はこいつで上げるっていうことで、バックロープを持ってってもらって」（這次用這個〔小拖包〕拉上去，讓先鋒帶著拖包繩上去）。
- 畫面（抽格）：242–247 s 地上的小拖包＋粉紅色拖包繩，字卡「ホールバッグ」；251 s 字卡「全ピッチ繋げて登りますよ」；約 260 s 字卡「登攀開始」，先鋒出發；**289–294 s 字卡「荷上げ」，小背包沿岩壁被拉上去**；約 296 s 起跟攀者空身爬。
- 建議 **start = 240**（從「用拖包繩拉上去」那句講起，含拖包特寫）。只想直接看拉包畫面的話用 **start = 286**。使用者原本記的 04:15（255 s）會錯過拖包介紹，04:48（288 s）接近拉包畫面的開頭。
- 限制：拉包畫面只有約 6 秒、看不到確保站上怎麼架（用什麼滑輪看不出來）；娛樂向 vlog。

---

## A. 技術／器材（建議 5 支＋選用）

HowNOT2 2024+ 沒有專講拖包的片（拖包系列 `chJjIaTlZXU`、`JSiqHwS9TYU`、`V_Uejam7EdQ`、`kaEZzS5Fmdk` 都是 2021–2023）。Hard Is Easy 頻道沒有拖包、滑輪或 progress capture 的片。所以 HowNOT2 只用一支相關的（A5），其餘找別的頻道。

### A1. cZYye9n-93M — How to haul a climbing haul bag with a one to one hauling system（New Zealand Alpine Team）
- 上傳 2024-02-01，長度 142 s。地點：紐西蘭 Fiordland 的 Airport Wall（字幕）。
- 示範內容：1:1 拖包：anchor 上一個 Micro Traxion 當 progress capture，第二個 Micro Traxion 扣在吊帶上，抓著 anchor、用體重往下坐（0–60 s）。拖包繩結上套剪開的寶特瓶當護結（70 s）。拖包到站後不要直接拉到頂住 Micro Traxion，否則會卡住；改用 docking cord 打義大利半扣＋mule overhand 把包掛好（80–110 s）。放行時先用身上的 Micro Traxion 吃重，解開上方，再降到 docking cord 上（110–140 s）。
- start：**0**（講 docking 用 **78**）。
- 關鍵數字：他們說 1:1 大約適用到 **40 kg（80 lb）**的包；示範的過夜包約 20 kg。
- 限制：紐西蘭登山隊員的個人作法（兩顆 Micro Traxion）；40 kg 是經驗值，不是原廠數字。Micro Traxion 用於拖吊時的負重上限以 Petzl 說明書為準。

### A2. aDVjeWyhXpE — Single Rope Multi-Pitch Climbing – Our Favorite Setup & Tips | EDELRID（EDELRID）
- 上傳 2025-09-29，長度 680 s。四段運動攀多繩距（6a／7a／7a+），單繩＋tagline。
- 示範內容：110–150 s 拓樸圖逐段標「背」或「拖」：第一段不陡、多平台 → 跟攀者背包上去；第二、三段陡 → 用 tagline 拖；最後一段又緩 → 背。字幕原話「hauling is not that recommendable in ledgy pitches or in not vertical terrain」。150–180 s tagline 要一直塞在小袋裡、別讓它散著。250–270 s 換先鋒時，下一個先鋒帶 Spoc＋tagline 上去拖包。畫面（抽格）：250–270 s 包到站、290–320 s 包掛在確保站側邊不擋路、約 390 s 包沿岩壁被拉上。440–570 s 垂降時 tagline 收在拖包裡、把包掛在確保器下方的確保環。
- start：**110**；講換先鋒時帶 Spoc 拖包用 **250**。
- 關鍵數字：無。
- 限制：原廠頻道，整支在用自家 Pinch、Ohm(ega)、Spoc、Switch、G-Screamer。170–240 s 用 Spoc 確保跟攀者並加 G-Screamer，是 EDELRID 的作法；Spoc 確保那段不要嵌。

### A3. K31d5NA0z8I — Watch This Before Building Your Next Haul System（Short Guys Beta Works）
- 上傳 2026-09-07，長度 343 s。
- 示範內容：用 Tindeq 測力計拉 22.7 kg（50 lb）負重，比較 9 種 progress capture 在 1:1 和 3:1 下的效率。只用鉤環當轉向：拉 43.3 kg，效率約 52%（40–60 s）；加 prusik 幾乎不變（80 s）；確保器 guide mode 在 1:1 拉到 76.5 kg 都拉不動、在 3:1 反而可用（140–200 s）；GriGri 約 36%（240 s）；Tibloc 跟單一鉤環差不多（250 s）；**EDELRID Spoc 29.5 kg（約 77%）、Petzl Micro Traxion 28.4 kg（約 79%，最佳）**（260–290 s）。
- start：**40**（只講專用滑輪用 **255**）。
- 關鍵數字：Micro Traxion 實測約 79%（他自己說低於原廠標的 90%+，可能是繩子差異）。
- 限制：單一繩子、每種一次量測；自動字幕數字要對說明欄（說明欄沒列數字）。效率數字寫進文章時以 Petzl／EDELRID 原廠標值為主，這支當「實測會比標值低」的佐證。

### A4. NvmmbX7aquc ＋ EFmFTiciV8k — Siebe Vanhee 的兩支短片
- **NvmmbX7aquc** How to haul when climbing bigwalls tutorial! #bigwall #tutorial #rockclimbing #yosemite：上傳 2024-03-02，長度 91 s。包不重時用 1:1，anchor 上放小的 Spoc 或 Micro Traxion；拉的那股繩上他也用 Spoc（「比用上升器順」）扣回吊帶，用體重拉（0–60 s；口述有點含糊，畫面為準）；沒有平台時把兩邊繩梯調成差不多長，腳有地方撐（70 s）。start **0**。
- **EFmFTiciV8k** Big wall tips and tricks: How to lower out a backpack ! #bigwall #climbing #tutorial：上傳 2024-04-27，長度 82 s，說明欄「Filmed on El Capitan」。輕背包的 lower out：拖包繩上往 hauler 那一側轉向，往下那一側進確保器，讓包的重量從 anchor 移到自己身上，再慢慢放到 hauler 正下方，避免包盪出去撞壞（0–80 s）。start **0**。
- 限制：兩支都是職業大岩壁攀登者的個人作法、很短；EFmFTiciV8k 只講「輕背包」，他自己說重包有別的方法。82 s 低於腳本的 90 s 門檻（短片），要嵌就嵌，但只能當補充。

### A5. XcDa2wESs7o — Don’t break your rope（HowNOT2）
- 上傳 2025-12-03，長度 968 s（同一支已在 `.work/aid-climbing-gear/R-videos.md` 審過）。
- 示範內容：22–44 s Ryan 先說 Micro Traxion 常被拿來拖包、當 progress capture。之後 200 lb 石頭掛在 Micro Traxion 上：繩子沒鬆弛時約 2 kN 沒事（66 s）；留一段鬆弛、做成 factor 1 時外皮被扯掉、斷了兩股芯；再用 EDELRID G-Screamer 壓到約 4 kN。
- start：**22**，end ≈ **300**。
- 關鍵數字（說明欄）：FF1 衝擊力 4.67 kN，外皮被扯掉。
- 跟拖包的關係：包卡在岩角、突然鬆脫，或 docking／放行時繩子有鬆弛，就是這種情境。文章要寫成「帶齒的 progress capture 不能吃衝擊，拖包繩要保持沒有鬆弛」。
- 限制：測的情境是用 Micro Traxion 確保人；一顆石頭、樣本少；EDELRID 參與、說明欄導購到 hownot2.com。44 s 轉述 Petzl「只要沒有鬆弛就可以」，要以 Petzl 原文為準。

### 選用
- **VoCdbU2l4Z8** How to Solo Haul for Multipitch Projecting（Avant Climbing Innovations，Brent Barghahn）：2024-11-07，510 s。**260–340 s** 用身上兩個 progress capture 滑輪＋腳踩扁帶＋轉向做 foot haul，「手只負責收繩，腿出力」；420–480 s tagline 下垂段纏到包的風險、下方有人時不要用。限制：自己一個人 rope solo 練線的情境，用的是自家賣的 Solo Haul Hook（fifi 放包），商業關係要寫。start **260**。
- **0n-99M5eCVU** Hauling systems: 2:1（19 s）／**35oXnl0f8yg** 2:1 redirect（30 s）／**5aC2kmYg5_Y** 3:1 with prusik（29 s）（AlpineSavvy，三支都 2026-10-18）：T method 算機械利益的示意短片。說明欄：2:1「拉 2 m、包上升 1 m」、progress capture 可放在包上或 anchor；2:1 redirect 時 anchor 受力約拉力的 3 倍。限制：短片（< 90 s）、沒有實地畫面，只當 2:1／3:1 的圖解；要用的話連到 Alpine Savvy 原文比嵌片好。
- **xT7rYBaU-cI** Climbing Systems Q&A（Avant，2025-10-29，1567 s）：**920–970 s** 口述他最愛的 2:1（「Mark Hudon special」）：anchor 上 progress capture，另外一組上升器＋滑輪做 2:1 ratchet，「第一次用 2:1 會覺得包沒在動」，做對了只要坐下去。只有口述、沒畫面 → 只能當文字出處，不嵌。
- **R_mOcEGilLo** I wish I knew this 20 years ago!（HowNOT2 × Brent，2025-03-13，933 s，Red Rock 六段）：反面選項「不背包、不拖包」，用 Avant snack pack 把水和食物掛身上（說明欄「climbing with a backpack sucks」）。300–470 s 講為什麼不背包。適合放在「什麼時候根本不用拖」那段；但整支在推 Avant 產品。

---

## B. 國外路線影片（建議 5 支＋選用 1）

### B1. myft0_VxnNM — Climbing Canada's most iconic big wall（Noah Kane）
- 上傳 2024-12-07，長度 2613 s。Squamish The Chief 的 Grand Wall，自由攀為主、bolt ladder 用人工。
- 拖包時刻：Split Pillar 之後的擠煙囪（1040–1060 s 先鋒說「squeeze chimney…gear getting caught」）。**1080 s** 跟攀者「especially with the backpack」→ 先鋒「I could also probably drop a sling and just haul it up」→「Haul away」。畫面（抽格）：約 1102 s 黑色背包被拉上來、1106–1108 s 包到跟攀者旁、1116 s 包掛在確保站。
- start：**1078**。
- 適合放在：(A) 自由攀登多繩距的輕量拖包——只有難段（煙囪、擠的地方）才臨時把背包拉上去。
- 限制：Petzl 贊助（Spirit 鉤環）、有贈獎段落（200 s）；拖包只有約 30 秒、沒講系統怎麼架。

### B2. CvbMH2OdKuQ — Experience The MOST ICONIC Climb In North America | The Nose Yosemite El Cap [4K]（Brox_Rocks）
- 上傳 2026-05-20，長度 5227 s。說明欄：2026-05-11 出發，Bryce Ungersma 與 Kyle Broxterman。
- 拖包時刻：**450 s**「just got to the top of pitch five. I am ready to haul. Kyle is going to get the bag off the ledge for me. Lowered out.」——跟攀者在 Sickle Ledge 把拖包 lower out 後先鋒開始拖。畫面（抽格）：443 s 綠色 Metolius 拖包＋戴手套拉繩、449 s 包掛在站上、455–461 s 包在跟攀者下方的斜板上。**580–600 s**「haul away」、跟攀者說「我先扶著包，等它過了這個小屋簷再放，不然風一吹會卡住」。100 s、490 s 另有兩次 lower out（攀者自己）。
- start：**445**；講「包過屋簷前先扶著」用 **580**。
- 限制：長篇 vlog，拖包只是片段；沒有講系統。

### B3. QNpMmIgRIAg — Our First Big Wall!!! - South Face of Washington Column 5.10 C1（Ryan Delena）
- 上傳 2024-12-03，長度 1560 s。Yosemite Washington Column South Face，作者說是上 Nose 前的練習。
- 拖包時刻：450–490 s 帶大拖包橫渡平台很痛苦。**580–640 s**「here comes the bag…it's not nearly as hard as carrying it」、用 Scott's Wall Gear 的 docking cord 掛好包、趁跟攀者清線時先把拖包繩重新理好、幫下一段整好器材——「big wall efficiency versus multi-pitch efficiency」。**670–700 s** 教訓：同伴只用手臂把上升器往下拉、沒把自己扣上上升器，所以包拉不動；要把 tether 扣到上升器、用體重。畫面（抽格）：605 s 包到站、620–640 s 包在低角度的平台上拖、670–690 s 第 3 段確保站同伴在拖包。
- start：**580**；只講「用體重、不用手臂」用 **668**。
- 適合放在：1:1 body-weight haul、docking、低角度地形很難拖。
- 限制：作者自己也是第一次大岩壁；作法是新手經驗，不是教學片。

### B4. jgZa027Q8cg — いざ、エルキャピタンの大岩壁へ再び（前編）＿Lurking Fear (600m 20p/C2/5.6)（TAKEMOVIE（タケムービー））
- 上傳 2026-04-01，長度 2004 s。和參考影片同一個頻道，El Capitan Lurking Fear，一個人 rope solo（前一次敗退見 NcZIACmt4OI，2024-05-14，沒有字幕）。
- 拖包時刻：220 s「今天的目標是固定繩和荷上げ：先把繩子拉到第三段，再拖 haul bag」。**610 s**「離地約 100 m，先把繩子垂到地面，再荷上げ」。640 s「裝了三天份行李的 haul bag 約 25 kg，花 30 分鐘才拖完」（自動字幕寫成「25km」，是 kg）。畫面（抽格）：618–620 s 拓樸圖、634–638 s 用上升器爬繩（字卡「アッセンダー」）、640–652 s 在站上拖、658 s 字卡「荷上げ完了」。**830–860 s** 介紹 haul bag：布料比一般背包硬幾十倍、可以在岩壁上磨著拉、肩帶可拆。
- start：**606**；講拖包本身用 **830**。
- 適合放在：大岩壁拖包段落，日文、和開頭參考影片同頻道，讀者容易接上。
- 限制：作者自稱「素人愛好家」；solo 的固定繩＋拖包流程和兩人隊伍不同；拖包畫面第一人稱、包本身看不太清楚；說明欄有 Lost Arrow 與 Amazon 導購。

### B5. 0ZNqq0fzd3o — Climbing Touchstone | Zion National Park（Daniel Bell）
- 上傳 2024-05-06，長度 1061 s。Zion Touchstone Wall，兩人、兩個拖包。
- 拖包時刻：30 s「top of the first pitch, I started hauling, got the rope fixed for Cat」。**110–130 s**「both bags docked…I docked them on the left side 'cause it looks like the next pitch goes up and left, so I don't want the bag to come across Cat」——依下一段路線方向決定把包掛在哪一側。**230–280 s** 下一段頂：「start hauling…we sit down」（坐下用體重拖）、「the wind blew it past the roof so it didn't get stuck」、兩個包都 docked。畫面（抽格）：約 112 s 綠色拖包掛在站下、130–142 s 包上方是屋簷、約 154 s anchor 上的帶齒滑輪、250–274 s 站上拖包系統。
- start：**108**；講坐下拖、包過屋簷用 **230**。
- 適合放在：docking 位置（掛在不擋下一段的那側）、1:1 body-weight haul、屋簷會卡包。
- 限制：個人 vlog、自拍為主，系統細節不清楚；「風把包吹過屋簷」是運氣，不是方法。

### 選用 B6. mF4ExC25UuI — Tips for Big Wall Glamping（HowNOT2）
- 上傳 2025-11-05，長度 1366 s。Yosemite 一條「冷門的 A3、11 段」路線（沒講路名），Ryan 與 Andrea。
- 拖包時刻：160 s 拖包的 docking：「muenter mule overhand」，帶 15 ft 的 bail／backup cord「long enough to lower out」。440 s Pro Traxion「makes hauling quite easy versus just using a Micro Traxion. It's worth the weight」。**1030–1100 s** 第一段頂：HMS 鉤環、**swivel＋Pro Traxion 放在 anchor 盡量高的位置**，腳踩推、手收，「safe and controlled」。畫面（抽格）：1026–1032 s 地上的拖包、1035–1065 s swivel＋Pro Traxion 特寫、1080–1090 s 拖包。
- start：**1030**（講 docking 與 lower-out 繩用 **160**）。
- 限制：路名不明（不算「指定路線」）；Rocky Talkie 贊助、說明欄導購 Arete 拖包繩與 squash bag；「Pro Traxion 值得多背重量」是他的偏好。若 A 段已用 A5 的 HowNOT2，這支可二擇一。

---

## 不採用（共 48 支）

日期不符（< 2024-01-01）：
- chJjIaTlZXU How NOT to Haul on El Capitan（HowNOT2，頻道清單約 2021）、JSiqHwS9TYU Hauling Giant Big Wall Bags up El Capitan（HowNOT2，2022-11-09）、kaEZzS5Fmdk My Haul Bag Exploded（HowNOT2，2023-04-26）、V_Uejam7EdQ Packing Haul Bags for Big Walling（HowNOT2，約 2022）——主題最貼，但都早於門檻。
- wYRd6WUBBCo #PetzlTips - Raising the haul bag on a multi-pitch route with a PUR LINE（Petzl Sport，2023-06-27）——主題正中（多繩距用 PUR LINE 拖包），差半年；文字可改引 Petzl 官網同名技術頁。
- VmN-jcHG7hI Efficient Foot Hauling（Brent Barghahn，2023-06-07）→ 用 2024 的 VoCdbU2l4Z8 代替。
- 4GvnpOqFhlE How To Haul A Haul Bag On A Big Wall（EpicTV，2019-01-04）、RvW6hzzRr8g How to dock and release a haul bag（Broad Beta，2022-06-26）、L-6W2DpXxyI 2:1 haul and dock（Ben Frank，2019）、vgG0jsBTuF8 Haul Bag Set up and How to Dock（Ryan Tilley，2020）、xUsP9zDhjLI How to haul a haul bag（Ryan Tilley，2021）、NUFAERVqqh4 Climbing with a Tag Line（Ryan Tilley，2020）、5GD0YUzgKrE／tgOR6M2JEZQ docking／2:1（Peter Adamson，2022）、vILWIP3AmEI far end haul（AlpineSavvy，2022）、RwFrI0bW4sk 2:1 for 4 person（2020）、v5pGlWAZBYM Arc'teryx Paolo Marazzi（2018）、dBoAJ2xXG18／k3RRy-vPUzw Mark Hudon（2012／2018）、qumM1l-el1U ER등산학교 hauling（2021-10-15）、yZKoPEJV3Fg Multipitch Rescue Part 2: Hauling（2023）。
- 路線片：tJ5RYuJUsCk Nose（Tyler Karow，2019）、gSJCYvY_6Vk WCSF（Michael Tillman，2023-07-04）、PfIhAIKREuo WCSF（Gravity Lab，2022）、05IRNAvywbE RNWF（Tyler Karow，2018）、5t8zfRi6uY8 Moonlight Buttress（Bron and Jacob，2017）、EcyJj_b0maQ Leaning Tower（2017）、AsPDU8Wb20Q 瑞牆山河微笑（2021）。

內容不符或品質不足：
- 2avTCEfwHL0 #PetzlTips- Hauling a Second（Petzl，2024-09-23）：拉的是跟攀者（人），不是包；沒有字幕，說明欄只有兩句。
- J7KtFCciz4E Cold Haul（Andy Kirkpatrick，2025-09-08 上傳）：2002 年 Les Drus 冬攀紀錄片重上 → 算舊片。（200 s 有拖包底部破掉、包掉 300 m 的故事，可當文字軼事但要寫年份。）
- vTmGWU1Fa3o Drill powered pulleys?（HowNOT2，2025-02-23）：電鑽動力上升器／滑輪，主要是繩索作業；自家商品推廣。
- Sg0PwlN-wEs 4 Big Walls IN A DAY! Uncut Interview（HowNOT2，頻道清單約 2025）：速攀不拖包，沒有拖包畫面。
- 9-4ubg0YSxU Lurking Fear（Jacob Deeter，2026-10-21）：170 s 有 docked haul bag 一句，其餘只是提到；B4 同路線較好。
- uYSBOM9tMz4 【壁2日目】ビッグウォール入門！『ワシントンコラム South Face』〜後編〜（TAKEMOVIE，2024-01-10，1421 s）：只有口述——210 s「昨天荷上げ很辛苦」、1140 s「包變輕了，直接背上去」；沒有拖包畫面說明。前編（第 1 天，可能有拖包）沒在搜尋結果裡出現，沒查。
- aRAQ__Fl1f4 Lurking Fear（後編）（TAKEMOVIE，2026-04-10，1815 s）：1390 s 只說要帶著 haul bag 橫渡；拖包用前編 B4。
- pQ3idPNgqas Our First Big Wall: Touchstone Wall（Jacob Deeter，2026-07-08）：只有「hauling's a bit of a bear」幾句；同路線用 B5。
- 2ez_OfUBOWU（Gravity Lab El Cap，2025-07）、LpQemvpSPOg（Nose，2025-11）、lNuJ6IKePQc（Leaning Tower，2025-01）、Y10D9HQmqjs（Leaning Tower，2024-04，只有一句「time to start hauling」）、BWFcxHCfa9U（WCSF，2026-05，450 s 只說 top of pitch 1 bag is up）、oss_GJ3Dypg（Nose，2026-07，6513 s，零星提到）：拖包只被提一句或沒有畫面說明，比 B2／B3 弱。
- yRi2GLXLtTk Big Wall Climbing in Squamish!（Gravity Lab，2025-11）：simul 速攀，沒拖包。
- dAfqQdg2jnM（Cochamó，2025-02）、vc3n4_i0k8w（Madagascar，2026-05）、a3farSlmWyg（Rab Picaflor，2024-09）：字幕裡沒有 haul；歐洲／南美／韓國找不到 2024+ 有拖包畫面的路線片。
- UQiaJKvxaII 자유등반에서의 3대1홀링시스템（2024-03-02）：主題貼（自由攀登時用 3:1），但沒有字幕、說明欄未讀到內容 → 依規則不列入，可之後補看。
- lqXPUXXL4ro Chongo 2:1（2024-10-11，27 s）：無說明、無字幕、個人短片。

沒找到 2024+ 的主題：space haul 的專門教學、重包 lower out、swivel 的獨立說明（只有 B5 帶到）。
