---
title: "多繩距怎麼拖包：先鋒拖繩、帶齒滑輪、腳踩拖吊到大岩壁拖包袋"
date: 2026-10-24
category: climbing
tags: [climbing, multi-pitch, big-wall, climbing-gear, trad-climbing]
lang: zh-TW
type: guide
description: "給已經會爬多繩距、想讓跟攀者空手爬難段的人：什麼時候值得拖包、什麼時候背著爬，一套輕量拖包要帶哪些器材（拖繩、帶齒滑輪、包、扁帶），出發前怎麼準備、到確保站怎麼一步一步拖上來、跟攀者負責什麼、腳踩拖吊怎麼架，哪裡最容易出事；後半講大岩壁的 1:1 體重拖、docking、lower out 與空中配重拖，附瑞牆山、Squamish、優勝美地 The Nose、Zion、酋長岩 Lurking Fear 的路線影片與實測影片。"
tldr: "拖包是先鋒拖一條 6–8 mm 的靜力細繩，到確保站用 Micro Traxion 這類帶齒滑輪把包拉上來，讓跟攀者空手爬；只在陡、難、沒有浮石的繩距拖，拖繩要一直繃緊、包卡住不要猛扯。大岩壁的 30–40 kg 拖包改用 Pro Traxion 與體重拖，到站先掛 docking 繩再卸力。"
draft: false
glossary:
  - term: "拖包"
    aliases: ["hauling", "haul", "荷上げ", "荷揚げ", "拉包"]
    definition: "先鋒到確保站後，用另一條繩把背包或拖包袋拉上來，讓跟攀者不用背著包爬。"
  - term: "拖繩"
    aliases: ["tagline", "tag line", "haul line", "拖包繩"]
    definition: "先鋒爬的時候拖在吊帶後面的第二條繩，到站後用來拖包；多繩距多用 6–8 mm 的靜力細繩，大岩壁用 9–10 mm 的靜力繩。"
  - term: "帶齒滑輪"
    aliases: ["progress-capture pulley", "PCP", "Micro Traxion", "Nano Traxion", "Pro Traxion", "Spoc"]
    definition: "裡面有帶齒凸輪的滑輪：繩子往一個方向可以順順地拉，反方向會被齒咬住停下來。"
    context: "凸輪的齒在衝擊下會剝掉繩皮，只能在繩子沒有鬆弛時使用。"
  - term: "docking"
    aliases: ["docking cord", "掛包繩"]
    definition: "包拖到確保站後，用一段獨立的繩把包掛在固定點上，讓包的重量離開帶齒滑輪。"
  - term: "lower out"
    aliases: ["放包", "lowering out"]
    definition: "下方的人用繩尾或確保器把包慢慢放出去，讓它垂到上方確保站正下方，不要整包盪過去撞岩壁。"
  - term: "空中配重拖"
    aliases: ["space hauling", "space haul", "スペースホーリング", "counterweight hauling"]
    definition: "一個人掛在拖繩的另一端當配重，用體重把包吊起來；拖得最快，也最危險。"
  - term: "旋轉環"
    aliases: ["swivel", "スイベル"]
    definition: "裝在拖繩和包之間、有軸承可以轉動的連接器，讓包旋轉時拖繩不會跟著絞。"
---

> 🌏 [English version](/posts/climbing/2026-10-24-multipitch-hauling-en)

拖包（hauling）是多繩距裡一個很小、但很容易被忽略的技術：先鋒爬的時候，吊帶後面多拖一條細繩；到了確保站，用這條繩把背包拉上來，跟攀者就能空手爬。

下面這支是日本瑞牆山十一面岩的〈秋一番〉（5.10c，8 段）。從 4 分鐘開始看：地上有一個小拖包和一條粉紅色細繩，先鋒帶著繩子出發；4 分 49 秒字卡寫「荷上げ」（日文的拖包），包沿著岩壁被拉上去，之後跟攀者空身爬。整個動作只有幾秒，確保站上怎麼架看不到，這篇就是把那幾秒拆開。

```youtube
url: https://www.youtube.com/watch?v=S-3yQfoi2V8
title: 【滝行】ハラケンと行く本人達大爆笑マルチピッチクライミング-瑞牆山　十一面壁『秋一番』5.10c/8p（TAKEMOVIE（タケムービー））
start: 240
```

讀之前，你應該已經會換段、架確保站，讀過〈[多繩距入門](/posts/climbing/2026-10-17-multi-pitch-basics)〉和〈[建立固定點](/posts/climbing/2026-10-17-building-anchors)〉。帶齒滑輪是什麼，〈[人工攀登器材怎麼用](/posts/climbing/2026-10-24-aid-climbing-gear)〉有完整一節；包本身怎麼挑，見〈[多繩距攀登包怎麼挑](/posts/climbing/2026-10-19-multipitch-climbing-backpacks)〉。

這篇前半講自由攀登多繩距的輕量拖包，後半講大岩壁。讀完你應該能在龍洞離地不高的地方，自己練一輪「拖繩出發、到站拖包、跟攀者放包」。

## 什麼時候值得拖、什麼時候背著爬

拖包不是越多越好。來源之間的立場差很多：

- **支持拖的**：[Climbing.com 的 Jeff Achey](https://www.climbing.com/skills/how-to-haul-pack-climbing/) 說，把大 cam、接近鞋、水和雨具放進小拖包，先鋒和跟攀者都可能多爬一個等級。代價是每拖一次大約 10 分鐘，六段就多一小時；超過 10 段又要一天爬完，拖包可能太慢。
- **有條件的**：[VDiff Climbing](https://vdiffclimbing.com/basic-hauling) 說拖包通常只在比 80 度還陡、障礙少、沒有浮石的地形划算，否則背著比較好。
- **能不拖就不拖的**：[Andy Kirkpatrick](https://andy-kirkpatrick.com/articles/view/rucksack_hauling_strategies) 的舊文直接寫「能避免就避免」：多半會變成又費時又費力的惡夢，比背著爬還累。

[EDELRID 的單繩多繩距影片](https://www.youtube.com/watch?v=aDVjeWyhXpE)在拓樸圖上逐段標了「背」和「拖」：第一段不陡、平台多，跟攀者背；第二、三段很陡，用拖繩拖；最後一段又緩，再背。這是最實用的判斷方式：**不是整條路線拖或不拖，是每一段各自決定**。

```youtube
url: https://www.youtube.com/watch?v=aDVjeWyhXpE
title: Single Rope Multi-Pitch Climbing – Our Favorite Setup & Tips | EDELRID（EDELRID）
start: 110
```

這是廠商頻道，片中器材都是自家產品；170–240 秒用 Spoc 確保跟攀者是 EDELRID 自己的做法，不在這篇的範圍。

| 這一段的地形 | 建議 |
|---|---|
| 垂直或外傾、乾淨的面或裂隙 | 拖 |
| 煙囪、擠的地方，背包會卡 | 拖，或臨時用扁帶把包吊上去 |
| 緩坡、平台多、四級地形 | 跟攀者背 |
| 大橫渡 | 背；真的要拖就留長一點的繩尾讓跟攀者放包 |
| 浮石多、下方有其他繩隊 | 背；包會把石頭拖下去 |

如果你的包只有一兩公升水和一件外套，還有第三個選項：不帶包，把東西掛在吊帶上。[HowNOT2 和 Brent Barghahn 在 Red Rock 爬六段](https://www.youtube.com/watch?v=R_mOcEGilLo)就這樣做，不過整支片在推 Avant 的產品。

## 一套輕量拖包要帶什麼

| 器材 | 常見選擇 | 重點 |
|---|---|---|
| 拖繩 | 60–65 m、6–8 mm 靜力細繩，例如 [Petzl PUR LINE 6 mm](https://www.petzl.com/us/en/sport/products/cords/pur-line-6-mm/PUR-LINE-6-mm_SPO_a2m1r000002bfKZAAY.html)、[Maxim 7 mm](https://shop.maximropes.com/products/personal-escape-rope)、[Sterling 6 mm TRC](https://sterlingrope.com/6-mm-trc)、[Edelrid Rap Line 6 mm](https://edelrid.com/eu-en/sport/ropes/rap-line-protect-pro-dry-6mm)、[Beal Back Up Line](https://beal-planet.com/en/products/back-up-line-5mm) | 都是低延伸繩，不能拿來確保或先鋒 |
| 帶齒滑輪 | [Petzl MICRO TRAXION](https://www.petzl.com/int/en/sport/products/progress-capture-pulleys/micro-traxion/MICRO-TRAXION_SPO_a2mw0000000HePgAAK.html)、NANO TRAXION、[EDELRID SPOC](https://edelrid.de/en/sports/pulleys/spoc.html)；包很輕可以只用手拉 | 腳踩拖吊要兩顆 |
| 包 | 小拖包（[BD Wall Hauler 40](https://www.blackdiamondequipment.com/products/wall-hauler-40-haul-bag)、[Metolius Sentinel](https://metoliusclimbing.com/products/haul-bag)）或原廠標明可拖拉的攀登包 | 一般背包用一兩趟就磨爛；推薦款見〈[拖包怎麼挑](#拖包怎麼挑小拖包與大岩壁拖包推薦)〉 |
| 連接 | 兩個有鎖鉤環，或兩個開口相反的鉤環 | 拖繩接包不用單一無鎖鉤環 |
| 掛包扁帶 | 60 cm 扁帶 | 到站後把包掛在固定點上 |

德奧瑞山岳會合辦的期刊 bergundsteigen 訪問過 Babsi Zangerl 和 Jacopo Larcher，[他們在阿爾卑斯的長路線](https://www.bergundsteigen.com/artikel/die-tagline-wie-haule-ich-richtig-tipps-von-babsi-zangerl-jacopo-larcher/)多半爬單繩、用細的靜力拖繩拖包；包比較輕時，只用一顆 Micro Traxion 手拉，不用上升器和腳環。他們也說最好用拖包，因為比背包耐磨得多。

**拖繩要用靜力繩，還是拿一條動力繩來拖？**Achey 說絕對不要拿細的動力雙繩當拖繩：它太有彈性，垂降拉繩很難用，萬一要爬它過岩角也很危險；他推薦 65 m、6–8 mm 的靜力繩。[Kirkpatrick](https://andy-kirkpatrick.com/articles/view/rucksack_hauling_strategies1) 寫的是英國情境，常用雙繩系統的其中一條拖包。Achey 反對的理由是垂降拉繩和攀爬；如果拖繩還要兼垂降拉繩，或緊急時可能要爬它，選靜力繩。

**超細的 HMPE 繩有額外限制**。PUR LINE 6 mm 是 HMPE 材質，延伸不到 2%，65 m 只有 1.3 kg；但 [Petzl 說明書](https://petzl.com/sfc/servlet.shepherd/version/download/068Tx00000K2Q1LIAV)寫它完全不吸收能量，不能用來確保；它的熔點 140°C 也比尼龍低，要避開摩擦生熱。Petzl 列出可以拿它拖包的器材是 TIBLOC、BASIC、ASCENSION、MICRO TRAXION 和 NANO TRAXION。

**帶齒滑輪要買哪一顆**：MICRO TRAXION 是最常見的選擇，原廠寫明設計用途包含拖吊。如果你已經有一顆，先用它；第二顆等你要練腳踩拖吊再買。

| 器材 | 規格 | 台灣官網價（2026-10） |
|---|---|---|
| MICRO TRAXION | 85 g，標示效率 91%，7–11 mm 繩 | [NT$3,980](https://www.petzltw.com/products/micro-traxion) |
| NANO TRAXION | 53 g，標示效率 91%，7–11 mm 繩 | [NT$3,040](https://www.petzltw.com/products/nano-traxion)（特價） |
| PUR LINE 6 mm | 65 m，1.3 kg | [NT$11,500](https://www.petzltw.com/products/pur-line-6-mm) |

實測效率會比標示低。[Short Guys Beta Works](https://www.youtube.com/watch?v=K31d5NA0z8I) 用測力計拉 22.7 kg，比較九種做法：只用鉤環轉向約 52%，SPOC 約 77%，Micro Traxion 約 79%。每種只量一次、只用一條繩，但結論很清楚：沒有滑輪的話，你一半的力氣花在摩擦上。

```youtube
url: https://www.youtube.com/watch?v=K31d5NA0z8I
title: Watch This Before Building Your Next Haul System（Short Guys Beta Works）
start: 40
```

**吊帶的拖繩環**：[BD 的 QC Lab 文章](https://blackdiamondequipment.com/blogs/stories/qc-lab-full-strength-haul-loops)說吊帶後面的拖繩環只需要撐住一條拖繩的重量，絕對不能拿來繫繩、確保或掛自己。拖繩扣在拖繩環上爬，包的重量永遠在確保站上，不在你身上。VDiff 另外提醒：小心把拖繩扣在裝備環上，萬一拖繩卡住，裝備環可能被扯斷。

## 出發前：包和拖繩怎麼準備

1. **包要「乾淨」**。Achey 的說法是 haul clean：腰帶和肩帶收好或拆掉，側面不要掛任何東西，要掛就掛在包的下方。Kirkpatrick 補充：腰帶繞到包後面扣起來，扣具很愛卡進裂隙；硬的東西不要貼著布，幾秒就磨出洞。
2. **拖繩接在原廠標明的拖拉環上**，用兩個有鎖鉤環或開口相反的兩個鉤環，繩結盡量貼近包。[Petzl 的拖包說明](https://web.archive.org/web/20230514145345/https://www.petzl.com/US/en/Sport/Hauling-a-bag--preparation-and-technique)建議用剪開的寶特瓶套在繩結上，減少磨擦。
3. **包不要綁在繩尾**。Achey 用雙套結把包綁在離繩尾約 4–5 m 的地方，多出來的這段讓跟攀者在橫渡時慢慢把包放出去，不用讓它整包盪過去。Petzl 的影片則是盡量多留繩尾，用單套結（bowline）接包。
4. **拖繩先穿好帶齒滑輪**。[Petzl 的 PUR LINE 示範](https://www.youtube.com/watch?v=wYRd6WUBBCo)（2023 年）在出發前就把拖繩穿進 TRAXION、在後面打一個單結擋住，整組扣在吊帶上，到站直接掛上去。
5. **拖繩扣在吊帶後面的拖繩環**，在地上堆成一堆、和先鋒繩分開，不要讓兩條繩纏在一起。6 mm 這種細繩很容易打結，[Alpinesavvy](https://alpinesavvy.com/blog/hauling-not-just-for-big-walls) 建議用繩袋或收納袋裝。

## 到確保站：一步一步拖上來

先把下面這張圖看懂。拖繩從包出發，往上穿過確保站上的帶齒滑輪，自由端在你手上；繩子的盡頭扣回確保站，所以你不會整條掉下去。

```diagram
title: 輕量拖包在確保站上的配置
desc: 帶齒滑輪掛在確保站的高處，拖繩從下方的包往上穿過滑輪，自由端由先鋒手拉或腳踩；拖繩盡頭扣回確保站；包綁在離繩尾幾公尺處，繩尾由跟攀者控制放包。
caption: 簡化示意。有兩顆 bolt 時，Alpinesavvy 建議把滑輪掛在其中一顆 bolt 上，不掛在主繩環；照你上課學的系統。
---
<svg viewBox="0 0 640 452">
  <rect class="dg-box dg-box--accent" x="200" y="20" width="240" height="56" rx="6"/>
  <text class="dg-label" x="320" y="40" text-anchor="middle" dominant-baseline="central">確保站</text>
  <text class="dg-sub" x="320" y="60" text-anchor="middle" dominant-baseline="central">先鋒自己先掛好</text>

  <path class="dg-line dg-line--strong" d="M260 76V120"/>
  <rect class="dg-box" x="160" y="120" width="200" height="56" rx="6"/>
  <text class="dg-label" x="260" y="140" text-anchor="middle" dominant-baseline="central">帶齒滑輪</text>
  <text class="dg-sub" x="260" y="160" text-anchor="middle" dominant-baseline="central">盡量掛高</text>

  <path class="dg-line dg-line--strong" d="M200 176V300"/>
  <rect class="dg-box" x="100" y="300" width="200" height="56" rx="6"/>
  <text class="dg-label" x="200" y="320" text-anchor="middle" dominant-baseline="central">包</text>
  <text class="dg-sub" x="200" y="340" text-anchor="middle" dominant-baseline="central">兩個有鎖鉤環</text>

  <path class="dg-line" d="M200 356V398"/>
  <rect class="dg-box" x="100" y="398" width="200" height="40" rx="6"/>
  <text class="dg-label" x="200" y="418" text-anchor="middle" dominant-baseline="central">繩尾 4–5 m</text>

  <path class="dg-line" d="M320 176V200Q320 208 328 208H452" marker-end="url(#arrow)"/>
  <rect class="dg-box" x="456" y="180" width="164" height="56" rx="6"/>
  <text class="dg-label" x="538" y="200" text-anchor="middle" dominant-baseline="central">自由端</text>
  <text class="dg-sub" x="538" y="220" text-anchor="middle" dominant-baseline="central">手拉或腳踩</text>

  <path class="dg-line" d="M538 180V56Q538 48 530 48H444" marker-end="url(#arrow)"/>
  <rect class="dg-box dg-box--warn" x="456" y="300" width="164" height="56" rx="6"/>
  <text class="dg-label" x="538" y="320" text-anchor="middle" dominant-baseline="central">跟攀者</text>
  <text class="dg-sub" x="538" y="340" text-anchor="middle" dominant-baseline="central">解包、用繩尾放包</text>
  <path class="dg-line" d="M304 418H530Q538 418 538 410V360" marker-end="url(#arrow)"/>

  <text class="dg-edge" x="552" y="110" text-anchor="start" dominant-baseline="central">盡頭扣回</text>
  <text class="dg-edge" x="212" y="240" text-anchor="start" dominant-baseline="central">拖繩</text>
</svg>
```

步驟（綜合 Achey、Petzl 影片與 [Alpinesavvy 的腳踩拖吊](https://alpinesavvy.com/blog/foot-haul-your-pack-on-a-multi-pitch)）：

1. **先把自己掛好**，確保站架完、自我確保。
2. **掛帶齒滑輪**，盡量高。有兩顆 bolt 時，Alpinesavvy 建議掛在其中一顆 bolt 上，不掛在主繩環。裝好先試拉一下：包那一側要拉得上來、放手不會往下滑。
3. **把拖繩盡頭扣回確保站，再從吊帶解下來**。順序反過來，一失手整條拖繩就掉了。
4. **收繩**，一路拉到碰到包為止，喊「準備拖」（haul is on）。喊話聽不到時，Achey 用拖繩連扯三下當暗號。
5. **跟攀者解開包**，喊「拖」（haul away）。橫渡段用繩尾把包慢慢放到你正下方。
6. **拉**。包輕就手拉；重一點就改用腳踩（見下一節）。
7. **到站後先掛包、再卸力**：用 60 cm 扁帶把包掛在確保站上，再放鬆滑輪，讓包的重量轉到扁帶上。[Alpinesavvy](https://alpinesavvy.com/bonus-articles/drop-proof-your-pack) 建議扁帶先用套結（girth hitch）同時套住拖拉環和一條肩帶，打開包前先掛好，就不容易掉包。
8. **替下一個先鋒整理拖繩**：Barghahn 在[影片](https://www.youtube.com/watch?v=VmN-jcHG7hI)裡，包掛好後把拖繩從包那端開始、像收先鋒繩一樣堆好，放進一個不扣緊的快扣裡，讓它能順順跟著下一個先鋒出去。

**到站後先拖包，還是先確保跟攀者？**Achey 和 VDiff 是先拖完再確保：包卡住時，跟攀者還在下面，可以去解。Alpinesavvy 是先把包拉離下方確保站幾公尺，接著確保跟攀者，等他上路後再拖：好處是不用一邊確保一邊拖。兩種做法都是為了讓先鋒不必一邊確保一邊拖。真的要同時做，要用 guide 模式這類能自鎖的確保器，Kirkpatrick 寫的就是這種做法。如果那段拖包很可能拖下石頭，Achey 說先讓跟攀者爬離危險區再拖。

### 腳踩拖吊：手只負責收繩

包再重一點，或後面還有好幾段，用腳拖比用手拖省力很多。Achey 的說法是：長路線先沒力的是手臂，不是腿，別把手臂浪費在拖包。

做法來自 Avant 的 Brent Barghahn，[Alpinesavvy 整理過](https://alpinesavvy.com/blog/foot-haul-your-pack-on-a-multi-pitch)：

1. 確保站上掛第一顆帶齒滑輪，照上面的配置。
2. 第二顆帶齒滑輪夾在拖繩的自由端，下面掛一條 60 cm 扁帶當腳環。
3. 在確保站上加一個鉤環當轉向，讓自由端從滑輪出來後先往上、再往下到腳環。
4. 踩腳環往下推，手只負責把穿過來的繩子收走。兩腳可以輪流換。

Alpinesavvy 說這樣 1:1 拖 15 kg 左右沒問題；Barghahn 在[原始影片](https://www.youtube.com/watch?v=VmN-jcHG7hI)裡說，用這套拖 30 磅（約 14 kg）左右的包還算輕鬆。他也說他不是嚮導，這是他的個人經驗。

Petzl 的 PUR LINE 影片另外示範兩種：把 NANO TRAXION 裝在繫繩點上、用體重往下坐拉；或在確保站上加轉向、身體往下坐，這時人要用動力繩挽索掛在確保站上。

### 跟攀者要做的事

跟攀者不是只等著爬：

- **解包和放包**：喊「拖」之前，先確認包沒有掛在任何東西上。橫渡段用繩尾慢慢放，[Siebe Vanhee 在酋長岩的短片](https://www.youtube.com/watch?v=EFmFTiciV8k)示範了輕背包怎麼放，他也說重包有別的做法。
- **一邊爬一邊顧包**：包卡在屋簷或裂隙裡，爬到旁邊時把它推出來。

Kirkpatrick 還寫了兩種變形：碎石多的地形，把包掛在跟攀繩上方 1 公尺左右，跟攀者綁兩條繩、包跟著他上去（protected haul）；地形緩或複雜時，改由跟攀者負責大部分的拖（assisted haul）。

## 哪裡最容易出事

**包拖下石頭**。Achey、Kirkpatrick、VDiff 都特別提醒這點。拖的包會撞鬆石頭，砸到跟攀者或下面的繩隊。浮石多的段落就背著爬。

**包卡住時猛扯**。Kirkpatrick 的話很直接：別硬扯，扯下來的可能是一塊石頭，掉在你夥伴頭上。日本的[石田登山塾](https://ishidatozanjukunisshi.blogspot.com/2018/12/blog-post_58.html)記錄過一次講習的失敗：拖繩落進裂隙裡，包卡在一個只有 15 cm 的小屋簷下，怎麼拉都上不來。他們的結論是先理解包為什麼會卡：繩子在裂隙裡，包就會被往裂隙裡帶。

**帶齒滑輪吃到衝擊**。Micro、Nano、Pro Traxion 的帶齒凸輪，原廠標的破斷強度都是 4 kN。[Kirkpatrick](https://andykirkpatrick.substack.com/p/advanced-hauling) 也說任何上升器或帶齒器材都不該承受超過 4 kN，先被剝掉的是繩皮，接著是繩子。HowNOT2 把 200 磅的石頭掛在 Micro Traxion 上：繩子沒有鬆弛時約 2 kN 沒事；留一段鬆弛讓它掉下去，衝擊 4.67 kN，繩皮被扯掉、斷了兩股芯。包卡住後突然鬆脫，或 docking 時拖繩留了鬆弛，就是這種情況。

```youtube
url: https://www.youtube.com/watch?v=XcDa2wESs7o
title: Don’t break your rope（HowNOT2）
start: 22
end: 300
```

片中測的是拿 Micro Traxion 確保人，石頭只有一顆、樣本少，EDELRID 有參與。拿到拖包上的教訓是同一個：拖繩要一直是繃緊的。

**繩子互相摩擦**。[Petzl 的護繩指南](https://petzl.com/us/en/sport/tech-tips-by-product/product-information-and-specifications/how-to-protect-the-rope-/CORDES-precautions_SPO_a77w0000000KyvgAAC.html)寫明繩對繩、繩對扁帶的摩擦是禁止的。拖繩和先鋒繩分開堆、分開出，不要讓受力中的拖繩在先鋒繩上滑。

**掉包**。從背上卸下包的那一刻最容易掉：先掛、再卸。

**帶著包垂降**。撤退或下山垂降時，EDELRID 那支影片的做法是把拖繩收進包裡，包掛在確保器下方、吊帶的確保環上。

## 大岩壁：包變成 30–40 kg 的拖包袋

上面講的是讓跟攀者輕鬆一點的小包。大岩壁的拖包袋裝的是好幾天的水、食物和睡袋，每人每天大約要 3–4 公升水（見〈[大岩壁與人工攀登](/posts/climbing/2026-10-19-big-wall-aid-climbing)〉），包就重到用手拉不動。

[Petzl](https://web.archive.org/web/20230514145345/https://www.petzl.com/US/en/Sport/Hauling-a-bag--preparation-and-technique) 建議拆成幾個 30–40 kg 的包，不要一個 80 kg 的大包：他們常看到沒經驗的隊伍帶一個巨大的包，一段拖兩三個小時。

### 器材換成什麼

| 器材 | 輕量拖包 | 大岩壁 |
|---|---|---|
| 拖繩 | 6–8 mm 靜力細繩 | 9–10 mm 靜力繩，60 m |
| 帶齒滑輪 | Micro／Nano Traxion | [Petzl PRO TRAXION](https://www.petzl.com/us/en/operators/products/progress-capture-pulleys/pro-traxion/PRO-TRAXION_OPE_a2m68000000PBIuAAO.html)（295 g，效率 95%，原廠寫明「設計來拖重物」；台灣官網 NT$7,300） |
| 包 | 小拖包或攀登包 | 拖包袋：[BD Wall Hauler](https://www.blackdiamondequipment.com/products/wall-hauler-70-haul-bag) 40／70／140 L、[Metolius](https://metoliusclimbing.com/products/haul-bag) Sentinel 46 L 到 El Cap 157 L |
| 旋轉環 | 不一定要 | [Petzl SWIVEL](https://www.petzl.com/us/en/sport/products/accessories-for-anchors/swivel-s/SWIVEL-S_SPO_a2mw0000000HfRdAAK.html)、[BD Rotor](https://www.blackdiamondequipment.com/products/rotor)、[Kong Dancer](https://kongusa.com/products/dancer) |
| 掛包 | 60 cm 扁帶 | docking 繩：約 5 m 的 7–8 mm 輔繩對折 |
| 放包 | 拖繩繩尾 | 拖繩多留的尾端，或另一條 lower out 繩 |

**一定要旋轉環嗎？**Petzl 和 [Climbing.com 的 Alexa Flower](https://www.climbing.com/skills/learn-this-efficient-hauling/) 都把它列在標準配置，說可以防止包旋轉把拖繩絞成一團；[SuperTopo 的 Chris McNamara](http://www.supertopo.com/a/How-To-Big-Wall-Climb-Hauling-and-Bivy-Gear/a10540n.html) 說他很少用，只在 The Nose 這種低角度、很多橫渡的路線上覺得有幫助。如果你要買 DMM 的旋轉環，先看 [DMM 的召回公告](https://dmmwales.com/pages/important-safety-notice-product-recall-dmm-compact-swivel-units)：有一款 Director 連接器在旋轉環處斷開，公告列出的型號要立刻停用。

### 1:1 體重拖

這是大岩壁最基本的拖法，綜合 Petzl、Flower 與 McNamara 的步驟：

1. PRO TRAXION 掛在確保站上，高度大約在眼睛的位置。
2. 拖繩盡頭用有鎖鉤環扣在確保站上。萬一系統失效，包的重量會落到確保站，而不是拖包的人身上。
3. 用一條快扣從主繩環扣到滑輪後面的拖繩上，當滑輪的備份。PRO TRAXION 要確定已經鎖上、沒有裝反；Kirkpatrick 說裝反是 PRO TRAXION 最經典的錯誤。
4. 在拖繩的自由端裝一個上升器，用短的挽索接到吊帶。
5. 雙腳踩在拖繩兩側，往下蹲、用體重把包吊起來，再站起來把上升器往上推。

Petzl 說這種體重拖只適合 30–40 kg 以內的包，而且拖的人要一直用繩子連在確保站上。New Zealand Alpine Team 的[示範片](https://www.youtube.com/watch?v=cZYye9n-93M)說他們的經驗上限大約 40 kg，片中也示範了用剪開的寶特瓶護結。

```youtube
url: https://www.youtube.com/watch?v=cZYye9n-93M
title: How to haul a climbing haul bag with a one to one hauling system（New Zealand Alpine Team）
```

他們用兩顆 Micro Traxion，是隊員自己的做法；Micro Traxion 拖重物的限制以 Petzl 說明書為準。

包比人重、或地形不夠陡時，就要加機械利益。大岩壁常用的 2:1 叫 Z pull，和你在救援課學的 3:1 Z 字拖不是同一套，[Alpinesavvy](https://alpinesavvy.com/blog/the-2-to-1-z-pull-haul-explained) 解釋了它的來源與架法。

機械利益在實際上會打折。[VDiff](https://vdiffclimbing.com/bigwall-hauling-1) 說 3:1 理論上省三倍力，實際大約只有 2.5 倍。地形也會改變需要的比例：同樣的包，外傾地形用體重拉得動，到了斜板可能就要 2:1。

### docking 與 lower out

**docking**：包拖到站後，不要直接拉到頂住滑輪，會卡死、很難放行。用一條 docking 繩把包掛在確保站上，再放開滑輪的齒，讓 docking 繩吃重。[Alpinesavvy](https://alpinesavvy.com/blog/haul-bag-rigging-101) 說 docking 繩通常是 5 m 左右、對折的 7–8 mm 輔繩，用義大利半扣加騾子結（Munter-mule）綁，滿載時也能鬆開；不要用縫線 daisy，橫渡時很難解。

**lower out**：下一段的先鋒喊「準備拖」後，跟攀者解開 docking 繩的騾子結，用義大利半扣把包慢慢放出去，直到包垂到上方確保站正下方，再喊「拖」。這樣包不會整包盪過去撞岩壁。放包的過程中，docking 繩還在你手上的義大利半扣裡；等包的重量完全轉到拖繩上、確認受力正常，才把 docking 繩拆掉。[Kirkpatrick](https://andykirkpatrick.substack.com/p/advanced-hauling) 的規則就是：包完全離開確保站、最後一個人確認一切受力正常之前，不要解開 docking。

### 空中配重拖：最快，也最危險

空中配重拖（space hauling）是一個人掛在拖繩另一端，懸空當配重，把包吊起來。[Kirkpatrick](https://andykirkpatrick.substack.com/p/advanced-hauling) 說這是吊重包最快的方法：每加一級機械利益，拖的時間也跟著變長。

他也講了兩個事故。一個是拖繩在岩角上斷掉，整包掉到酋長岩底；他推測對方用的是 9 mm 輔繩，不是真正的靜力繩，並說如果當時有人在做空中配重拖，那個人就死了。另一個是朋友當配重，包過了幾個摩擦點後突然變輕，人整個往下掉，直到包撞上確保站才停。

所以當配重的人一定要綁在另一條繩上，最好是動力的先鋒繩，扣在確保站（最好不是主繩環），留 10–20 m 的長度，萬一失手最多掉到這裡。[SuperTopo 的 McNamara](http://www.supertopo.com/a/How-to-Big-Wall-Climb-Hauling-Managing-the-Belay-The-Changeover/a10574n.html) 寫的是留至少 20 英尺。這是要上課學的技術，不要看文章自己試。

[Kirkpatrick 在《Higher Education》裡寫](https://alpinesavvy.com/blog/haul-bag-rigging-101)（經 Alpinesavvy 轉引），拖包可能是大岩壁最危險的環節；他教學員把包當成交給你看管的大白鯊或犀牛，能不能讓它乖乖的，靠的是多疑、預判和對它破壞力的尊重。

最後一條是法規：[優勝美地](https://home.nps.gov/yose/planyourvisit/climbing_regulations.htm)禁止從岩壁上丟任何東西，國家公園說從岩壁丟下來的拖包差點砸中地面的攀岩者，也好幾次被誤認成墜落的人。

## 拖包怎麼挑：小拖包與大岩壁拖包推薦

前面講的是怎麼拖，這一節講拖什麼。先分清楚三種包：

- **原廠標明有拖拉環的攀登包**：只在一兩段難段拖一下，其餘背著爬。怎麼挑見〈[多繩距攀登包怎麼挑](/posts/climbing/2026-10-19-multipitch-climbing-backpacks)〉。
- **小拖包**（約 25–55 L）：自由攀登多繩距要整條路線拖，或大岩壁上掛在大包下面當副包（sub-bag）。
- **大岩壁拖包**（約 70–160 L）：裝好幾天的水、食物和睡袋。

### 怎麼挑：六個判準

1. **布料**。[OutdoorGearLab 的選購指南](https://www.outdoorgearlab.com/topics/climbing/best-haul-bag/buying-advice)偏好聚氨酯（PU、Metolius 叫 Durathane）塗層：比較耐磨，放久了也不像乙烯基（PVC）塗層那樣變脆；乙烯基的好處是便宜、輕。[bergundsteigen](https://www.bergundsteigen.com/artikel/how-to-bigwall-2-3-richtig-haulen/) 也建議不要買便宜版本。
2. **兩條拖帶、長度不同**。拖的時候只掛一條，另一條留著，打開包取物時包仍然掛在繩上。Metolius、BD、Edelrid、Climbing Technology 的現行款都是這種設計。
3. **背負系統能收或能拆**。Achey 說肩帶和腰帶會卡，拖之前要收好或拆掉；包旁邊不要掛任何東西。
4. **縫線**。OutdoorGearLab 說他們測壞的拖包，先爆的永遠是縫線；Metolius 的主縫是熱熔接。
5. **開口**。大包太深時，要整個人探進去才拿得到底部；捲頂或寬開口比較好拿。正面全長拉鍊在平台上好用，懸空時用不上（[Vertical Life 的 Edelrid KURT 評測](https://verticallifemag.com/articles/edelrid-kurt-55l/)）。
6. **排水孔與底部掛點**。下雨時水會積在包底，Metolius Half Dome、Fish Grade V 有排水孔；底部掛點用來掛副包或排泄物筒（poop tube）。

**容量怎麼抓**：OutdoorGearLab 說 The Nose 這種低角度、橫渡多的路線，一個大包比較好拖；Zodiac 這種外傾路線，兩個中包比較好輪替。bergundsteigen 的估算是兩人爬五天、每人每天 4 公升水，包會到 60–70 kg，所以照 Petzl 的建議拆成幾個 30–40 kg 的包。

### 小拖包

| 型號 | 容量 | 空重 | 特色 | 原廠價格 | 評測 | 適合 |
|---|---|---|---|---|---|---|
| [Metolius Mescalito Haul Pack](https://www.metoliusclimbing.com/products/haul-packs) | 24 L | 0.85 kg | 輕版 Durathane、肩帶可收、腰帶可拆 | USD 119.95 | — | 一日多繩距，只拖水和外套 |
| [Metolius Express Haul Pack](https://www.metoliusclimbing.com/products/haul-packs) | 39 L | 1.2 kg | 同上，容量較大 | USD 139.95 | — | 一日多繩距、要拖接近鞋和大 cam |
| [Edelrid KURT HAULBAG 55](https://edelrid.com/eu-en/sport/backpacks-and-rope-bags-shop/kurt-haulbag-55) | 55 L | 約 1.4 kg | 帆布、背負系統整組可拆、兩條不同長度拖環；PRO 版加正面全長拉鍊 | EUR 140 | [Vertical Life 2024](https://verticallifemag.com/articles/edelrid-kurt-55l/)：重量約 BD Wall Hauler 40 的一半 | 要大一點又要背得舒服 |
| [BD Wall Hauler 40](https://www.blackdiamondequipment.com/products/wall-hauler-40-haul-bag) | 40 L | 1.99 kg | TPU 塗層、偏置提把、捲頂 | USD 219.95 | [OutdoorGearLab 2024](https://www.outdoorgearlab.com/topics/climbing/best-haul-bag)：72 分，底部不好掛東西 | 耐操、不在意重量 |
| [Metolius Sentinel](https://metoliusclimbing.com/products/haul-bag) | 46 L | 2.1 kg | Durathane、主縫熔接、背負可收；原廠定位短岩壁或副包 | USD 189.95 | OutdoorGearLab 2024：85 分，但認為多數人買大一號或背包更合適 | 大岩壁副包、短岩壁 |
| [Climbing Technology AZIMUT](https://www.climbingtechnology.com/en/outdoor-en/bags-and-backpacks/haul-bags2/azimut)／[CRAGGY](https://www.climbingtechnology.com/en/outdoor-en/bags-and-backpacks/haul-bags2/craggy) | 25–35 L／40–50 L | 1.2／1.9 kg | PVC 塗層、兩種長度拖帶、背負可拆 | 官網未標 | — | 歐洲通路好買 |
| [Grivel Grand Cap 40](https://grivel.com/products/grand-cap-40) | 40 L | 1.5 kg | 帆布、捲頂加正面全長開口 | EUR 170（歐洲官網缺貨） | — | 想要正面開口 |

**輕，但不耐拖**：[Blue Ice Alpine Hauler](https://blueice.com/products/alpine-hauler) 只有 575 g，原廠也寫它以背著爬為主、難段才拖。[Climbing.com 2026 年的評測](https://www.climbing.com/gear/blue-ice-alpine-hauler-backpack-review)在低角度路段拖了兩段就破了六個洞，結論是「它是背包，不是拖包」。

### 大岩壁拖包

| 型號 | 容量 | 空重 | 特色 | 原廠價格 | 評測 |
|---|---|---|---|---|---|
| [Metolius Quarter Dome](https://metoliusclimbing.com/products/haul-bag) | 69 L | 2.3 kg | Sentinel 的放大版 | USD 219.95 | OutdoorGearLab 2024：81 分 |
| [Metolius Half Dome](https://metoliusclimbing.com/products/haul-bag) | 125 L | 3.4 kg | Durathane、主縫熔接、排水孔、頂蓋內袋 | USD 279.95 | OutdoorGearLab 2024 綜合最佳（87 分），說它是酋長岩上最常見的拖包 |
| [Metolius El Capitan](https://metoliusclimbing.com/products/haul-bag) | 157 L | 3.6 kg | Half Dome 的放大版 | USD 299.95 | OutdoorGearLab 2024：84 分，嫌長圓筒太大 |
| [BD Wall Hauler 70](https://www.blackdiamondequipment.com/products/wall-hauler-70-haul-bag) | 70 L | 2.46 kg | TPU 塗層、偏置提把、捲頂 | USD 259.95 | OutdoorGearLab 2024 最佳性價比（83 分）；金屬扣下山時會一直鬆 |
| [BD Wall Hauler 140](https://www.blackdiamondequipment.com/products/wall-hauler-140-haul-bag) | 140 L | 3.11 kg | 同系列，原廠定位遠征 | USD 319.95 | OutdoorGearLab 2024：78 分 |
| [Climbing Technology ZENITH](https://www.climbingtechnology.com/en/outdoor-en/bags-and-backpacks/haul-bags2/zenith) | 70–85 L | 2.7 kg | PVC 塗層、背負可拆、底部交叉織帶可掛副包 | 官網未標 | — |
| [Edelrid LYNN HAULBAG 95](https://edelrid.com/int-en/professional/transport/lynn-haulbag-95) | 95 L | 約 2.5 kg | 帆布、內襯泡棉防穿刺；原廠歸在專業線 | EUR 240 | — |

價格是 2026-10-24 各原廠官網標價，未換算。2024 年以後的拖包群測只有 OutdoorGearLab 一篇，而且只比了 Metolius 和 BD，其他品牌只有原廠資料。

### 怎麼選

- **自由攀登多繩距、只拖一兩段**：用原廠標明有拖拉環的攀登包，不用另外買。
- **整條路線都要拖**：Metolius Express 39 L 最輕；要更大、背得舒服，選 Edelrid KURT 55。
- **第一面大岩壁、一兩晚**：BD Wall Hauler 70 或 Metolius Quarter Dome；要用很多次，Metolius Half Dome 是最多人用的那一個。
- **台灣怎麼買**：2026-10 台灣只找到 KONG Genius II（30 L，偏洞穴與繩索作業）在 [Concordia](https://concordia.com.tw/index.php?route=product/product&product_id=3869) 預購，Metolius、BD Wall Hauler、Edelrid、Climbing Technology 的拖包都沒找到台灣現貨，實際上要國外網購或代購。

## 國外路線影片：看別人在真的路線上怎麼拖

下面四支各對應一種情境。它們都是個人紀錄片，不是教學片，看的是「什麼時候拖、拖的時候發生了什麼」，系統細節以上面的原廠與教學來源為準。

**Squamish The Chief〈Grand Wall〉：只在擠的地方臨時拖背包**。Split Pillar 之後是一段擠煙囪，跟攀者背著包很難過；先鋒說「我丟一條扁帶下去把它吊上來」。這就是輕量拖包最常見的用法：整條路線背著，只有一兩段拖。

```youtube
url: https://www.youtube.com/watch?v=myft0_VxnNM
title: Climbing Canada's most iconic big wall（Noah Kane）
start: 1078
```

Petzl 贊助的影片，拖包只有約 30 秒，沒講系統怎麼架。

**優勝美地〈The Nose〉：lower out 和扶包過屋簷**。第 5 段頂（Sickle Ledge），跟攀者先把拖包從平台上 lower out，先鋒才開始拖；9 分 40 秒左右，跟攀者說要先扶著包、等它過了小屋簷再放，不然風一吹會卡住。

```youtube
url: https://www.youtube.com/watch?v=CvbMH2OdKuQ
title: Experience The MOST ICONIC Climb In North America | The Nose Yosemite El Cap [4K]（Brox_Rocks）
start: 445
```

長篇 vlog，拖包是零散片段。

**Zion〈Touchstone Wall〉：包掛在哪一側、坐下來拖**。第一段頂，他把兩個包掛在確保站左側，因為下一段往左上，不想讓包橫過夥伴的路線；下一段頂兩人坐下用體重拖，包被風吹過屋簷，沒有卡住。

```youtube
url: https://www.youtube.com/watch?v=0ZNqq0fzd3o
title: Climbing Touchstone | Zion National Park（Daniel Bell）
start: 108
```

「風把包吹過屋簷」是運氣，不是方法。

**酋長岩〈Lurking Fear〉：和開頭同一個頻道，一個人拖 25 kg**。TAKEMOVIE 一個人 rope solo：先固定繩子、用上升器爬上去，再把裝了三天行李、約 25 kg 的拖包拉上來，花了 30 分鐘。13 分 50 秒左右他介紹拖包袋：布料比一般背包硬很多，可以在岩壁上磨著拉，肩帶可以拆。

```youtube
url: https://www.youtube.com/watch?v=jgZa027Q8cg
title: いざ、エルキャピタンの大岩壁へ再び（前編）＿Lurking Fear (600m 20p/C2/5.6)（TAKEMOVIE（タケムービー））
start: 606
```

作者自稱業餘愛好者；一個人的固定繩加拖包流程和兩人繩隊不同。

另一支值得看的是〈[Washington Column South Face](https://www.youtube.com/watch?v=QNpMmIgRIAg)〉，兩個人第一次爬大岩壁：11 分 08 秒他們發現包拉不動，是因為同伴只用手把上升器往下拉，沒有把自己扣上上升器、用體重。低角度的平台上拖包也明顯困難得多。

## 在台灣怎麼練

台灣沒有大岩壁，但輕量拖包需要的動作，龍洞的短多繩距都練得到：

1. **先在地面練**。在岩場底部找一個固定點，把包掛在一條拖繩上，練掛滑輪、收繩、手拉、腳踩、掛包。[Pete Zabrok 在 Climbing.com 的技術短文](https://www.climbing.com/skills/tech-tip-aid-21-hauling-ratchet/)建議先在你家岩場拿石頭練 2:1，他說他不是在開玩笑。
2. **選一段短、陡、乾淨、下方沒人的路線**，先鋒拖繩上去、跟攀者放包，練一次完整的喊話與流程。
3. **練到確保站上的順序變成反射**：掛自己、掛滑輪、扣繩尾、解吊帶、收繩、喊話。
4. **大岩壁的 1:1 體重拖、docking、lower out 與空中配重拖，請上大岩壁課**。

## 練習題

1. 你們要爬一條 8 段的路線，第 3、4 段是外傾裂隙，其餘是緩坡和平台。要不要帶拖繩？哪幾段拖？
   - 參考：帶。只在第 3、4 段拖，其餘段落跟攀者背；到了第 5 段把包交還給跟攀者。
2. 到站後你先從吊帶解下拖繩，正要掛到滑輪上時手滑了，會發生什麼？順序應該怎麼排？
   - 參考：整條拖繩和下面的包可能一起掉。先把拖繩盡頭扣在確保站上，再從吊帶解下。
3. 包拉到一半卡住了，你用力扯了幾下，包突然鬆脫往下掉了 1 公尺，被 Micro Traxion 接住。可能發生了什麼？
   - 參考：帶齒凸輪吃了衝擊，拖繩可能被剝皮。停下來，叫跟攀者爬上去處理，檢查拖繩；下次卡住時不要硬扯。
4. 下一段是往右的大橫渡，包要怎麼放？
   - 參考：包綁在離繩尾 4–5 m 處，跟攀者解包後用繩尾慢慢放，讓包垂到上方確保站正下方再喊「拖」；或這段改由跟攀者背。
5. 你的大岩壁拖包約 45 kg，你的體重 60 kg，路線是斜板。1:1 拉得動嗎？
   - 參考：包已超過 Petzl 說的 30–40 kg，地形又不陡，1:1 很可能很吃力。拆成兩包，或改用 2:1。

## 延伸觀看：器材實測與教學頻道

- **[HowNOT2](https://www.youtube.com/@HowNOT2)**：Ryan Jenks 經營，2016 年從走繩（highline）安全教學起家，後來把攀岩、洞穴、溪降器材拿去拉斷，還有在真岩上拉 bolt 的 Bolt Busters 系列。看點是「標示強度以外」的情況：打結、磨損、舊裝備、放錯位置。限制：多數是自製機器慢拉、每組 1–3 個樣本，他自己也說這是娛樂不是科學；頻道背後有網路器材店，部分受測品是店內商品。
- **[Hard Is Easy](https://www.youtube.com/@HardIsEasy)**：署名 Ben 的攀岩者獨自經營，以前是軟體工程師。一次在泰國 Tonsai 看到確保者接太硬、攀者撞上岩石，他回家設計實驗，從此專拍確保、繩子、鉤環與確保器的實驗與物理解說，近年多支在 Mammut 實驗室合拍。限制：實驗多是自己設計，不是 EN／UIAA 標準測試。這個頻道目前沒有拖包或帶齒滑輪的片。

## 更新紀錄

- 2026-10-24：新增〈拖包怎麼挑〉一節：六個判準、小拖包與大岩壁拖包的現行款比較與台灣購買現況。

## 參考資料

- [How to Haul a Pack for Climbing（Climbing.com，Jeff Achey，2023）](https://www.climbing.com/skills/how-to-haul-pack-climbing/)
- [Learn This: Efficient Hauling（Climbing.com，Alexa Flower，2016）](https://www.climbing.com/skills/learn-this-efficient-hauling/)
- [Tech Tip – Aid – 2:1 Hauling Ratchet（Climbing.com，Pete Zabrok，2004）](https://www.climbing.com/skills/tech-tip-aid-21-hauling-ratchet/)
- [Hauling a bag: preparation and technique（Petzl，原頁已下架，Wayback 2023 存檔）](https://web.archive.org/web/20230514145345/https://www.petzl.com/US/en/Sport/Hauling-a-bag--preparation-and-technique)
- [How to protect the rope?（Petzl）](https://petzl.com/us/en/sport/tech-tips-by-product/product-information-and-specifications/how-to-protect-the-rope-/CORDES-precautions_SPO_a77w0000000KyvgAAC.html)
- [PUR LINE 6 mm 產品頁](https://www.petzl.com/us/en/sport/products/cords/pur-line-6-mm/PUR-LINE-6-mm_SPO_a2m1r000002bfKZAAY.html)與[技術說明書](https://petzl.com/sfc/servlet.shepherd/version/download/068Tx00000K2Q1LIAV)（Petzl）
- [#PetzlTips - Raising the haul bag on a multi-pitch route with a PUR LINE（Petzl，2023）](https://www.youtube.com/watch?v=wYRd6WUBBCo)
- [MICRO TRAXION](https://www.petzl.com/int/en/sport/products/progress-capture-pulleys/micro-traxion/MICRO-TRAXION_SPO_a2mw0000000HePgAAK.html)、[PRO TRAXION](https://www.petzl.com/us/en/operators/products/progress-capture-pulleys/pro-traxion/PRO-TRAXION_OPE_a2m68000000PBIuAAO.html)、[SWIVEL](https://www.petzl.com/us/en/sport/products/accessories-for-anchors/swivel-s/SWIVEL-S_SPO_a2mw0000000HfRdAAK.html)（Petzl）；台灣價格見 [Petzl 台灣官網](https://www.petzltw.com/products/micro-traxion)（in Chinese，2026-10 查）
- [SPOC（EDELRID）](https://edelrid.de/en/sports/pulleys/spoc.html)、[Rap Line Protect Pro Dry 6 mm（EDELRID）](https://edelrid.com/eu-en/sport/ropes/rap-line-protect-pro-dry-6mm)
- [Personal Escape Rope 7 mm（Maxim）](https://shop.maximropes.com/products/personal-escape-rope)、[6 mm TRC（Sterling）](https://sterlingrope.com/6-mm-trc)、[Back Up Line（Beal）](https://beal-planet.com/en/products/back-up-line-5mm)
- [Wall Hauler 40](https://www.blackdiamondequipment.com/products/wall-hauler-40-haul-bag)、[Wall Hauler 70](https://www.blackdiamondequipment.com/products/wall-hauler-70-haul-bag)、[Rotor](https://www.blackdiamondequipment.com/products/rotor)、[QC Lab: Full Strength Haul Loops](https://blackdiamondequipment.com/blogs/stories/qc-lab-full-strength-haul-loops)（Black Diamond）
- [Best Haul Bags for Big Wall Climbing](https://www.outdoorgearlab.com/topics/climbing/best-haul-bag)與[選購指南](https://www.outdoorgearlab.com/topics/climbing/best-haul-bag/buying-advice)（OutdoorGearLab，2024-10 更新）
- [The Ultimate Edelrid Kurt 55L Haulbag Review（Vertical Life，2024）](https://verticallifemag.com/articles/edelrid-kurt-55l/)
- [The Alpine Hauler Is One of the Best Packs I've Used (With One Major Caveat)（Climbing.com，2026）](https://www.climbing.com/gear/blue-ice-alpine-hauler-backpack-review)
- [Haul Packs（Metolius）](https://www.metoliusclimbing.com/products/haul-packs)、[KURT HAULBAG 55](https://edelrid.com/eu-en/sport/backpacks-and-rope-bags-shop/kurt-haulbag-55)、[LYNN HAULBAG 95](https://edelrid.com/int-en/professional/transport/lynn-haulbag-95)（Edelrid）、[AZIMUT](https://www.climbingtechnology.com/en/outdoor-en/bags-and-backpacks/haul-bags2/azimut)、[CRAGGY](https://www.climbingtechnology.com/en/outdoor-en/bags-and-backpacks/haul-bags2/craggy)、[ZENITH](https://www.climbingtechnology.com/en/outdoor-en/bags-and-backpacks/haul-bags2/zenith)（Climbing Technology）、[Grand Cap 40（Grivel）](https://grivel.com/products/grand-cap-40)、[Alpine Hauler（Blue Ice）](https://blueice.com/products/alpine-hauler)
- [Haul Bags（Metolius）](https://metoliusclimbing.com/products/haul-bag)、[Dancer（Kong）](https://kongusa.com/products/dancer)
- [Important Safety Notice: Product Recall DMM Compact Swivel Units（DMM）](https://dmmwales.com/pages/important-safety-notice-product-recall-dmm-compact-swivel-units)
- [Hauling – not just for big walls](https://alpinesavvy.com/blog/hauling-not-just-for-big-walls)、[Foot haul your pack on a multi-pitch](https://alpinesavvy.com/blog/foot-haul-your-pack-on-a-multi-pitch)、[Drop-proof your pack](https://alpinesavvy.com/bonus-articles/drop-proof-your-pack)、[Haul bag rigging 101](https://alpinesavvy.com/blog/haul-bag-rigging-101)、[The 2 to 1 "Z pull" haul, explained](https://alpinesavvy.com/blog/the-2-to-1-z-pull-haul-explained)（Alpinesavvy）
- [Hauling Your Rucksack](https://andy-kirkpatrick.com/articles/view/rucksack_hauling_strategies)、[Rucksack Hauling Strategies](https://andy-kirkpatrick.com/articles/view/rucksack_hauling_strategies1)（Andy Kirkpatrick，器材描述已過時）；[Advanced Hauling（Andy Kirkpatrick，2021）](https://andykirkpatrick.substack.com/p/advanced-hauling)
- [Basic Hauling Techniques for Multi-Pitch Trad](https://vdiffclimbing.com/basic-hauling)、[Big Wall Hauling Systems Explained](https://vdiffclimbing.com/bigwall-hauling-1)（VDiff Climbing）
- [Die Tagline – wie haule ich richtig?](https://www.bergundsteigen.com/artikel/die-tagline-wie-haule-ich-richtig-tipps-von-babsi-zangerl-jacopo-larcher/)、[How to Bigwall (2/3): Richtig Haulen](https://www.bergundsteigen.com/artikel/how-to-bigwall-2-3-richtig-haulen/)（bergundsteigen，德奧瑞山岳會合辦期刊，in German）
- [荷上げ失敗を考察（石田登山塾日誌，2018）](https://ishidatozanjukunisshi.blogspot.com/2018/12/blog-post_58.html)（in Japanese）
- [How to Big Wall Climb – Hauling, Managing the Belay, The Changeover](http://www.supertopo.com/a/How-to-Big-Wall-Climb-Hauling-Managing-the-Belay-The-Changeover/a10574n.html)、[Gear 3: Haulbags, Hauling and Bivy Gear](http://www.supertopo.com/a/How-To-Big-Wall-Climb-Hauling-and-Bivy-Gear/a10540n.html)（SuperTopo，Chris McNamara；網站常在維護）
- [Climbing Regulations（Yosemite National Park）](https://home.nps.gov/yose/planyourvisit/climbing_regulations.htm)
- [Efficient Foot Hauling: Dealing with your Multi-Pitch Climbing Baggage（Brent Barghahn）](https://www.youtube.com/watch?v=VmN-jcHG7hI)
- [Big wall tips and tricks: How to lower out a backpack !（Siebe Vanhee，2024）](https://www.youtube.com/watch?v=EFmFTiciV8k)
