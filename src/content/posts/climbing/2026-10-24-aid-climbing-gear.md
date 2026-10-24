---
title: "人工攀登器材怎麼用：繩梯、daisy、fifi、上升器、滑輪與帶齒滑輪的操作與挑選"
date: 2026-10-24
category: climbing
tags: [climbing, climbing-gear, big-wall, multi-pitch, trad-climbing]
lang: zh-TW
type: guide
description: "給準備從傳攀、多繩距走向人工攀登與大岩壁的人：繩梯、daisy chain 與可調 daisy、fifi hook、上升器、滑輪、帶齒滑輪（Micro Traxion 這類）各是什麼、怎麼操作、哪裡最容易出事，附先鋒循環、bounce test、雙上升器爬繩的步驟，現行型號與台灣價格，以及 HowNOT2、EDELRID 的實測影片。不講拖包系統。"
tldr: "人工攀登器材幾乎都只標「承受體重」：繩梯、daisy、fifi 是用來站、用來掛，擋墜落的永遠是攀登繩。先鋒的循環是放保護點、掛繩梯、退一階再 bounce test、踩上去、扣繩；縫線 daisy 一個鉤環絕不扣兩個小環，BD 說扣錯可能弱到約 2.2 kN。爬繩用兩個上升器、每 5–7 m 打備份結扣回吊帶；不要在上升器或帶齒滑輪上製造墜落，HowNOT2 量到約 4.7 kN 就把繩皮扯掉。第一組上升器（左右手各一）可以從 BD Index 或 Petzl ASCENSION 選，台灣單顆約 NT$2,700–3,000。"
draft: false
glossary:
  - term: "繩梯"
    aliases: ["aider", "etrier", "ladder", "踏帶"]
    definition: "用扁帶做成、有好幾階的梯子，扣在保護點或上升器上讓人踩著往上。"
    context: "分成三角階的傳統 etrier 和每階都撐開的 ladder 兩種。"
  - term: "上升器"
    aliases: ["ascender", "jumar", "手式上升器", "上攀器"]
    definition: "夾在繩子上、只能往上滑不能往下滑的器材，讓人沿著固定好的繩子爬上去。"
    context: "大岩壁的跟攀者用兩個上升器爬繩，順路拆掉先鋒者放的裝備。"
  - term: "daisy chain"
    aliases: ["daisy", "菊繩"]
    definition: "一條縫成很多小環的扁帶，一端接吊帶、一端扣保護點或上升器，讓人掛在上面。"
    context: "小環的縫線只撐得住體重，不是個人固定（PAS），也不能拿來墜落。"
  - term: "可調 daisy"
    aliases: ["adjustable daisy", "Easy Daisy", "EVOLV ADJUST", "Speedaisy"]
    definition: "用扣具或夾具調長度的 daisy，可以一手把自己拉近保護點，不用換小環。"
  - term: "fifi hook"
    aliases: ["fifi", "懸吊鉤"]
    definition: "接在吊帶上的小金屬鉤，掛進繩梯頂端的鉤環，讓人在繩梯上短暫休息、把腰拉近岩壁。"
    context: "只在受張力時掛得住，一放鬆就可能掉。"
  - term: "bounce test"
    aliases: ["彈跳測試", "衝擊測試"]
    definition: "踩上一個保護點前，先用體重在它上面彈跳，模擬一次小墜落，確認它撐得住再把全身重量交給它。"
  - term: "帶齒滑輪"
    aliases: ["progress-capture pulley", "單向制停滑輪", "止退滑輪", "Micro Traxion", "PCD"]
    definition: "裡面有帶齒凸輪的滑輪：繩子往一個方向可以順順地拉，反方向會被齒咬住停下來。"
    context: "常用來拖吊、救援、當緊急上升器；凸輪的齒在衝擊下會剝掉繩皮。"
  - term: "備份結"
    aliases: ["catastrophe knot", "tie in short", "back-up knot"]
    definition: "爬繩時每隔一段，在上升器下方的繩上打一個結、扣回吊帶，萬一兩個上升器都脫繩，最多只會掉到這個結。"
---

> 🌏 [English version](/posts/climbing/2026-10-24-aid-climbing-gear-en)

人工攀登（aid climbing）是踩在自己放的裝備上往上爬。〈[大岩壁與人工攀登](/posts/climbing/2026-10-19-big-wall-aid-climbing)〉講了它是什麼、A／C 等級怎麼讀、一個繩隊怎麼分工。這篇接著講手上的東西：繩梯、daisy、fifi hook、上升器、滑輪與帶齒滑輪，每一件是什麼、怎麼操作、最常在哪裡出事，以及現在買得到哪些型號。

拖包系統（haul）不在這篇的範圍，滑輪只講拖包以外的用途。

讀之前，你應該已經能用傳攀保護先鋒、架固定點，也讀過〈[多繩距入門](/posts/climbing/2026-10-17-multi-pitch-basics)〉和〈[自我救援基礎](/posts/climbing/2026-10-17-self-rescue-basics)〉。讀完你應該能在離地不高的地方，自己練一輪人工先鋒和一段雙上升器爬繩，也知道第一套該先買哪幾件。台灣沒有大岩壁，但這些動作都能在龍洞離地不高的地方練熟，器材在台灣也買得到。

## 先記住一件事：這些器材多半只撐得住體重

翻開說明書，人工攀登器材大多寫著同一句話。[BD 的 daisy 與繩梯說明書](https://cdn.shopify.com/s/files/1/0880/2195/8973/files/MM5825_E_Daisy-Etrier_IS-WEB.pdf)寫繩梯「只設計來承受體重」；[Metolius 的 Easy Aider／Easy Daisy 說明書](https://outdoorplay.com/pdfs/metolius-easy-aider-daisy-manual.pdf)寫「只承受體重」、要另外做全強度的連接當備份、不能拿來確保。

[BD 的 QC Lab 文章](https://blackdiamondequipment.com/en_US/stories/experience-story-qc-lab-daisy-chain-dangers-en-glbl)講得最直白：正確的人工攀登，繩子永遠在系統裡。繩梯讓你站，daisy 和 fifi 讓你掛，墜落時接住你的是攀登繩和確保者。後面每一節的規則，幾乎都是從這句推出來的。

| 器材 | 用來做什麼 | 一般帶多少 | 能不能承受墜落 |
|---|---|---|---|
| 繩梯 | 踩著往上 | 先鋒 2 條（也有人用 4 條）；爬繩 1–2 條 | 不能，只撐體重 |
| daisy／可調 daisy | 把自己掛在保護點或上升器上 | 2 條 | 縫線 daisy 不能；Petzl 動力繩款只限墜落係數 1 以下 |
| fifi hook | 掛在繩梯頂端短暫休息 | 1 個 | 不能 |
| 上升器 | 沿固定繩往上 | 2 個 | 不能在上面製造墜落 |
| 滑輪 | 讓繩子轉向、省力 | 視用途 | 看型號強度 |
| 帶齒滑輪 | 拉繩時鎖住不倒退 | 1–2 個 | 帶齒功能只標約 4 kN 破斷 |

## 繩梯：先鋒怎麼一步一步往上

### 兩種形狀

繩梯（aider、etrier）分兩種。傳統 etrier 的每一階是扁帶摺成的三角形，左右交錯，例如 [BD Six-Step Etrier](https://blackdiamondequipment.com/products/etrier-ladder)、[Metolius 5 Step Aider](https://metoliusclimbing.com/products/5-step-aider)。梯式（ladder）兩側各一條扁帶，中間每一階都是撐開的，例如 [BD StepUp 6](https://blackdiamondequipment.com/products/stepup-6-ladder)、[Metolius 8 Step Aider](https://metoliusclimbing.com/collections/all/products/8-step-aider)。

[Fish 的繩梯 FAQ](http://fishproducts.com/faqs/aiderfaq.html) 說梯式的階一直是開的，腳比較好踩進去，頂端有把手可以抓。窄扁帶做的輕量款比較輕、好收，但 Fish 說長的大岩壁或鞋很軟時，可能壓得腳弓痛。只在自由攀登路線上偶爾踩一兩步，[Metolius Pocket Aider](https://metoliusclimbing.com/products/pocket-aider) 這種收得進口袋的就夠了。

### 先鋒的基本循環

[Chris McNamara 在 SuperTopo 的教學](http://supertopo.com/a/How-To-Big-Wall-Climb-Leading-1%C2%97Low-Angle-Terrain/a10536n.html)先教低角度地形，不用 daisy 也不用 fifi，只有兩條繩梯：

1. 放好一個保護點，把繩梯**直接扣在保護點上**，不要扣在保護點已經掛著的鉤環上，那會讓你少一截伸手距離。
2. 一路往上踩，踩到**腰跟保護點同高**（能更高就更高）。
3. 拿另一條繩梯，扣上下一個保護點。
4. 換過去，把下面那條繩梯取下來，每次都扣回吊帶的同一個位置，下次才摸得到。
5. 把攀登繩扣進剛才那個保護點，再往上踩到腰跟鉤環同高。

這份清單沒寫測試。每換到一個新保護點、把體重交給它之前，都要先做下一節的 bounce test。

到了垂直或外傾的地形，[McNamara 的第二課](http://supertopo.com/a/How-to-Big-Wall-Climb-Leading-2-Vertical-and-Overhanging-Terrain/a10538n.html)在第 2、3 步之間加一個動作：需要平衡時，把 fifi hook 掛進繩梯頂端的鉤環，能的話再往上踩一階，讓 fifi 繃緊、位在腰下方，把你拉向岩壁。

### bounce test：退一階再測

踩上去之前，要先 [bounce test](https://climbing.com/skills/tech-tip-aid-topstep-mania)。McNamara 在[放保護點那一課](http://supertopo.com/a/How-to-Big-Wall-Climb-Leading-3-Placing-Gear/a10568n.html)把目標寫得很清楚：製造夠大的力，模擬一次小墜落。他的做法：

- 一隻腳踩進要測的那條繩梯，另一隻腳留在前一個保護點的繩梯上。
- 分三段加力：輕、中、重。比你以為的再用力一點。
- **往下看，不要盯著保護點**。它要是被拔出來，會直接打到你的臉。

Climbing.com 的 [Topstep 教學](https://climbing.com/skills/tech-tip-aid-topstep-mania)和 [Andy Kirkpatrick](https://andy-kirkpatrick.com/articles/view/top_stepping) 都強調同一件事：站在最上面兩階（top step）放好新保護點後，**先退下至少一階再測**。這樣萬一新保護點被拔出來，衝擊比較小。不要站在頂階上測試。

### 頂階與伸手距離

越往上踩，下一個保護點就能放得越高，整段路線要放的點就越少。[Kirkpatrick](https://andy-kirkpatrick.com/articles/view/top_stepping) 說頂階的核心是張力：腰和保護點之間要有一條繃緊的連接，fifi 只有在受張力時才掛得住，一分心就會掉。所以 [Climbing.com](https://climbing.com/skills/tech-tip-aid-topstep-mania) 的建議是，掛著 fifi 時另外用一條短快扣把確保環扣到同一個點上，不要完全信任 fifi。

[Climbing.com 的〈A game of inches〉](https://climbing.com/skills/tech-tips-aid-a-game-of-inches)再補兩點：不要放鼻子高度那種好放的點，盡量往上伸；U 型桿的 cam 扣在鋼索彎折處，不要扣在攀登繩要扣的那條縫線扁帶上。

一條還是兩條？[McNamara](http://supertopo.com/a/How-To-Big-Wall-Climb-Leading-1%C2%97Low-Angle-Terrain/a10536n.html) 的裝備清單是兩條繩梯；[Fish](http://fishproducts.com/faqs/aiderfaq.html) 說標準配備是兩對（四條）；Kirkpatrick 在〈[Pounding Steel](https://andy-kirkpatrick.com/blog/view/pounding_steel)〉建議一條、兩條、三條、四條都試過再決定。第一次練，先從每人兩條開始。

## daisy 與可調 daisy：掛自己用，不是個人固定

### 縫線 daisy：一個鉤環絕不扣兩個小環

傳統 daisy chain 是一條縫成很多小環的扁帶。它的危險在縫線。[BD 的 QC Lab](https://blackdiamondequipment.com/en_US/stories/experience-story-qc-lab-daisy-chain-dangers-en-glbl) 說，你把一個鉤環同時扣進尾端的大環和中間某個小環，想把 daisy 收短，結果可能變成鉤環只扣在小環的縫線上，強度低到約 500 磅（約 2.2 kN）；扣出來是哪一種，幾乎是一半一半的機率。

所以規則只有兩條：

- **要收短，就用第二個鉤環扣中間的小環**，不要一個鉤環扣兩個小環。[Alpinesavvy](https://alpinesavvy.com/blog/all-about-sewn-pocket-daisy-chains) 的說法是，除非 daisy 完全伸直，否則你需要兩個有鎖鉤環。
- **永遠不要在 daisy 上墜落**，也不要掛在 daisy 上爬到保護點上方。BD 在[〈Personal Anchor Systems Explained〉](https://blackdiamondequipment.com/blogs/stories/qc-lab-personal-anchor-systems-explained)說小環一般只有 2–5 kN，落墜測試時小環一個個被扯開；它不是緩衝器，也不是在確保站把自己固定住的 PAS。

### 可調 daisy：現在大多數人用這種

[Alpinesavvy](https://alpinesavvy.com/blog/all-about-sewn-pocket-daisy-chains) 說，做人工攀登的人多半覺得可調 daisy 比較好用：一手拉扁帶就能把自己收近保護點，不用換小環，也沒有扣錯小環的問題。但可調不代表比較強，每一款的標示差很多：

| 型號 | 材質與調整方式 | 標示 | 原廠怎麼說 |
|---|---|---|---|
| [Metolius Easy Daisy](https://metoliusclimbing.com/products/easy-daisy) | 扁帶＋鋁扣，99 g | 1.3 kN | 只承受體重；要放長得先卸掉重量；不能扣進釋放環和尾端 |
| [Yates 550 Adjustable Daisy](http://yatesgear.com/?product_id=1007&route=product/product) | 扁帶＋凸輪扣，6 oz | 5 kN | 可以 girth hitch 在吊帶上 |
| [BD Speedaisy](https://blackdiamondequipment.com/products/speedaisy) | 繩＋鋁夾具，180 g，負重時也能調 | 只承受體重 | 不是個人固定系統 |
| [BD Speedfi](https://blackdiamondequipment.com/products/speedfi) | 可調 daisy＋鋼製 fifi 一體，195 g | 只承受體重 | 同上 |
| [Petzl DUAL EVOLV ADJUST](https://www.petzl.com/us/en/sport/products/climbing-mountaineering-lanyards/dual-evolv-adjust/DUAL-EVOLV-ADJUST_SPO_a2m68000000XZb3AAG.html) | 9.0 mm 動力繩、雙臂，15–150 cm，315 g | EN 17520 | 專為人工攀登設計；只能用在墜落係數 1 以下 |

Petzl 的動力繩款是另一類東西：它通過 EN 17520 個人確保挽索標準，[Petzl 的說明頁](https://petzl.com/US/en/Sport/Using-the-EVOLV-ADJUST-lanyard)說 2025 年起的 EVOLV ADJUST 用在人工攀登往上推進時，仍然要搭配另一套確保（也就是攀登繩），只有在確保站上可以單獨用。2025 年以前的舊款不是個人防護裝備，靜態強度低於 UIAA 要求的 15 kN，不能單獨使用。

EN 17520 測什麼，EDELRID Knowledge Base 這支從 6:00 開始講：挽索要撐過三次墜落係數 2 的落錘，第一次的衝擊力不能超過 10 kN；可調長度的款式，掛 1.3 kN 時滑移不能超過 50 mm。7:00 起他們提醒，自己把挽索的繩段換掉、改裝過的，就不符合標準了。

```youtube
url: https://www.youtube.com/watch?v=jrI7ldXQYNg
title: Are certified self belay slings really better?（EDELRID Knowledge Base）
start: 360
```

這是廠商頻道，片子是德文配音，英文字幕是翻譯過的；測的是扁帶和動力繩挽索，不是縫線 daisy。

### daisy 接在吊帶哪裡

這一點各家說法不同。[McNamara](http://supertopo.com/a/How-to-Big-Wall-Climb-Leading-2-Vertical-and-Overhanging-Terrain/a10538n.html) 和 [Climbing.com 的陡壁爬繩教學](https://climbing.com/skills/learn-this-efficient-jugging-in-high-angle-terrain)把 daisy girth hitch 在繫繩點上，不接確保環；[Petzl DUAL EVOLV ADJUST](https://www.petzl.com/us/en/sport/products/climbing-mountaineering-lanyards/dual-evolv-adjust/DUAL-EVOLV-ADJUST_SPO_a2m68000000XZb3AAG.html) 的說明寫接在確保環上；[Alpinesavvy](https://alpinesavvy.com/blog/all-about-sewn-pocket-daisy-chains) 說兩種都可以。[BD](https://blackdiamondequipment.com/blogs/stories/qc-lab-personal-anchor-systems-explained) 舉過一個事故例子：長期 girth hitch 在確保環上的 daisy，會在看不見的地方把確保環磨穿。

照你那條 daisy 的說明書接，並且定期把 girth hitch 拆開，看下面的確保環和扁帶。

## fifi hook：短暫休息用

fifi hook 是接在吊帶上的小金屬鉤，掛進繩梯頂端的鉤環，讓你在繩梯上放開雙手、把腰拉近岩壁。[McNamara](http://supertopo.com/a/How-to-Big-Wall-Climb-Leading-2-Vertical-and-Overhanging-Terrain/a10538n.html) 說 fifi 接好後的長度大約四英寸（約 10 公分），站在傳統繩梯的第三階時，剛好勾得到繩梯頂端的鉤環。

它好不好用，兩派說法相反。McNamara 說盡量不要用 fifi，真的要用，只掛在鉤環上休息，不要掛在 daisy 上；[Climbing.com 的 Topstep 教學](https://climbing.com/skills/tech-tip-aid-topstep-mania)說 fifi 很關鍵，能讓腳步推進得快、髖部貼近岩壁。兩邊都同意的是：fifi 只有受張力才掛得住，掛著時另外用短快扣做備份。

兩個實用的小改裝：[Alpinesavvy](https://alpinesavvy.com/blog/add-a-release-loop-to-your-fifi-hook) 建議在 fifi 上綁一條細繩，fifi 受力卡住時往下拉它就能撬開；近年也有很多人改用可調 fifi，例如 BD Speedfi。

型號：[Petzl FIFI](https://www.petzl.com/us/en/sport/products/aid-climbing-accessories/fifi/FIFI_SPO_a2mw0000000Hec1AAC.html) 鋼製 38 g，[Petzl 台灣官網](https://www.petzltw.com/products/fifi)叫它「人工攀登專用懸吊鉤」，NT$680；[BD Fifi Hook](https://blackdiamondequipment.com/products/fifi-hook) 22 g，只承受體重。

## 上升器：爬固定繩

### 三種上升器

[Petzl 的型錄](https://catalogs.petzl.com/Petzl-sport-workbook-2026-spring-summer/en/38-Ascenders.html)把上升器分成三類：

- **手式上升器**：有握把，大岩壁爬繩用的就是這種，一次用兩個。例如 [Petzl ASCENSION](https://www.petzl.com/us/en/sport/products/ascenders/ascension/ASCENSION_SPO_a2mw0000000KiOfAAK.html)、[BD Index](https://blackdiamondequipment.com/products/index-ascender)。
- **胸式上升器**：固定在胸前，例如 [Petzl CROLL S](https://m.petzl.com/US/en/Sport/Ascenders/CROLL-S)。洞穴和工業繩索的單繩技術（SRT）常用，大岩壁比較少見；[Kirkpatrick](https://andy-kirkpatrick.com/blog/view/uk-nose-training) 建議先學雙握把上升器，不要先學 SRT 的 frog 系統。
- **緊急上升器**：很輕、平常帶著備用，例如 [Petzl TIBLOC](https://catalogs.petzl.com/Petzl-sport-workbook-2026-spring-summer/en/38-Ascenders.html)（35 g）。

上升器通過的 EN 567 標準，[Petzl 說明](https://petzl.com/US/en/Sport/Using-only-one-ascender-)沒有墜落測試。這就是為什麼上升器上不能有鬆繩、不能在上面墜落。

### 雙上升器怎麼架

下面是最常見的一種架法：

- **上方上升器**用慣用手，接一條 daisy 到吊帶。[Climbing.com 的爬繩教學](https://climbing.com/skills/learn-this-how-to-rope-jug)說長度約比手臂伸直短 15–20 公分，daisy 拉到全長時手肘還微彎。爬繩時你坐在這個上升器上休息。
- **下方上升器**接繩梯，腳踩著它往上推。它也接一條較短的 daisy 到吊帶，當備份。
- **上方上升器頂端的孔再扣一個鉤環繞住繩子**。這是 [HowNOT2 大岩壁指南](https://hownot2.com/post/bigwalls-ascending)的做法，[Climbing.com](https://climbing.com/skills/learn-this-efficient-jugging-in-high-angle-terrain) 說斜向段一定要扣。[Petzl ASCENSION 說明書](https://www.petzl.com/on/demandware.static/-/Sites-petzl-master-catalog/default/dw6093247e/media/product/technical-notice-ASCENSION-4_068Tx00000KzbaDIAR.pdf)的說法是：上升器要沿著繩子的方向受力，避不開斜拉時，用挽索的連接鉤環把繩子一起扣住，免得上升器在繩上打滑。
- **鉤環用自動鎖**。[Climbing.com](https://climbing.com/skills/learn-this-how-to-rope-jug) 提醒，螺旋鎖會在爬繩時被轉開。
- **每隔一段打備份結**（見下一節）。

```diagram
title: 雙上升器爬繩的連接方式
desc: 上方上升器用長 daisy 接吊帶讓人坐著，下方上升器掛繩梯讓腳踩，另用短 daisy 接吊帶；上升器下方每隔一段打備份結扣回吊帶。
caption: 簡化示意。也有人把繩梯掛在上方上升器，或兩個上升器各掛一條，照你上課學的系統。
---
<svg viewBox="0 0 640 468">
  <path class="dg-line dg-line--strong" d="M260 24V58M260 118V210M260 270V374M260 434V452"/>
  <text class="dg-tag" x="272" y="32" dominant-baseline="central">固定繩</text>

  <path class="dg-line" d="M340 88H512Q520 88 520 96V198" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M340 240H458" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M340 404H512Q520 404 520 396V282" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M180 240H88Q80 240 80 248V318" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="180" y="60" width="160" height="56" rx="6"/>
  <text class="dg-label" x="260" y="80" text-anchor="middle" dominant-baseline="central">上方上升器</text>
  <text class="dg-sub" x="260" y="100" text-anchor="middle" dominant-baseline="central">坐在這裡休息</text>

  <rect class="dg-box" x="180" y="212" width="160" height="56" rx="6"/>
  <text class="dg-label" x="260" y="232" text-anchor="middle" dominant-baseline="central">下方上升器</text>
  <text class="dg-sub" x="260" y="252" text-anchor="middle" dominant-baseline="central">踩著它往上推</text>

  <rect class="dg-box dg-box--warn" x="180" y="376" width="160" height="56" rx="6"/>
  <text class="dg-label" x="260" y="396" text-anchor="middle" dominant-baseline="central">備份結</text>
  <text class="dg-sub" x="260" y="416" text-anchor="middle" dominant-baseline="central">每 5–7 m 打一個</text>

  <rect class="dg-box dg-box--accent" x="460" y="200" width="140" height="80" rx="6"/>
  <text class="dg-label" x="530" y="230" text-anchor="middle" dominant-baseline="central">吊帶</text>
  <text class="dg-sub" x="530" y="252" text-anchor="middle" dominant-baseline="central">繫繩點或確保環</text>

  <rect class="dg-box" x="20" y="320" width="120" height="56" rx="6"/>
  <text class="dg-label" x="80" y="340" text-anchor="middle" dominant-baseline="central">繩梯</text>
  <text class="dg-sub" x="80" y="360" text-anchor="middle" dominant-baseline="central">腳踩</text>

  <text class="dg-edge" x="428" y="76" text-anchor="middle" dominant-baseline="central">長 daisy</text>
  <text class="dg-edge" x="400" y="228" text-anchor="middle" dominant-baseline="central">短 daisy</text>
  <text class="dg-edge" x="428" y="392" text-anchor="middle" dominant-baseline="central">有鎖鉤環</text>
</svg>
```

下方那條 daisy 該多緊，兩篇 Climbing.com 的教學說法相反：[一篇](https://climbing.com/skills/learn-this-how-to-rope-jug)說比前臂短幾英寸，[另一篇](https://climbing.com/skills/learn-this-efficient-jugging-in-high-angle-terrain)說保留 15–20 公分的鬆度、永遠不要繃緊，只當備份。上方那條兩篇一致。

### 怎麼爬

- **低角度或垂直**：[HowNOT2 的大岩壁指南](https://hownot2.com/post/bigwalls-ascending)說可以直接沿繩走上去，重心放在腳上，幾乎不用坐上方上升器。
- **外傾**：每一步都要坐。[McNamara](http://supertopo.com/a/How-to-Big-Wall-Climb-Following-2-Vertical-and-Overhanging-Terrain/a10539n.html) 說先檢查上方 daisy 有沒有太長，坐在上方上升器上時手臂不該出力；腳踩下方上升器那條繩梯的第二、三階。兩隻腳同時踩上下兩條繩梯，是最快把自己累垮的方法。
- **過岩緣**：把上方上升器拿下來、越過岩緣再扣回去，或兩個上升器一起往外拉、讓上方那個往上跳幾公分。拿下任何一個上升器之前，先確認自己有備份結扣著。

比利時的大岩壁攀登者 Siebe Vanhee 在酋長岩上示範他的爬繩方式：長的 daisy 接右手的上升器，長度調到手肘微彎；兩條腳環，左邊比右邊短一點；另外一條可調 daisy 扣在上方上升器。垂直地形時上升器貼近胸口，小步小步走，用腿不用二頭肌。

```youtube
url: https://www.youtube.com/watch?v=6CpgXkbcZsI
title: Big wall tips and tricks: How to jug !（Siebe Vanhee）
```

只有一分半，是他個人偏好的一種做法，他自己也說爬繩的方法有一百萬種；備份結和斜向段都沒有講到。外傾地形的版本見[同一系列的下一支](https://www.youtube.com/watch?v=MiyNkeKTz9Y)：先坐進上方上升器，拿掉右腳腳環，單腳加單手往上推。

### 備份結：隨時兩點連在繩上

[Kirkpatrick](https://andy-kirkpatrick.com/articles/view/moving_up_and_down_fixed_ropes) 的規則是：上升器會跳開、鉤環會自己脫開，所以隨時都要有兩點連在繩上；拿下上方上升器繞過障礙前，先扣好一個備份結或固定點，永遠不要只掛在一個上升器上。[Petzl](https://petzl.com/US/en/Sport/Using-only-one-ascender-) 也說單一上升器不可靠。

大約每 5–7 公尺打一個備份結，斜向和外傾段更密；用 8 字或單結做繩耳，有鎖鉤環扣回吊帶。（[Alpinesavvy](https://alpinesavvy.com/blog/rope-ascending-with-the-petzl-traxion) 寫約每 5 公尺，[Climbing.com](https://climbing.com/skills/learn-this-efficient-jugging-in-high-angle-terrain) 寫每 20–25 英尺，約 6–7.5 公尺。）

只綁在繩尾不夠。[美國登山事故報告 2005 年刊記錄的 Tangerine Trip 死亡事故](http://publications.americanalpineclub.org/articles/13200505302/Fall-on-Rock-Failure-to-Backup-Ascenders-California-Yosemite-Valley-El-Capitan-Tangerine-Trip)提到，1980 年 Walter Bertsch 在爬繩時掉了整整一個繩長，雖然被先鋒繩接住，還是死了。

### 斜向段：爬繩最容易出事的地方

McNamara 在[清斜向段那一課](http://supertopo.com/a/How-To-Big-Wall-Climb-Following-4-Traversing-Terrain/a10967n.html)說，清斜向段有時比先鋒還危險：上升器被斜拉會扭著脫出繩子；幾乎所有爬繩時跟上升器脫開的案例，都發生在斜向段。

美國登山事故報告裡有好幾起：

- [1992 年 Zodiac](http://publications.americanalpineclub.org/articles/13199303600/Fall-on-Rock-Ascenders-Detached-from-Rope-California-Yosemite-Valley-El-Capitan)：清一段 35–40° 斜拉的繩段，重裝上方上升器時脫繩，掉了約 30 公尺。巡山員 John Dill 的分析是：上升器開口那一側壓在岩壁上往上推，粗糙的岩面會勾開安全扣。
- [Mescalito](http://publications.americanalpineclub.org/articles/13201103000/Fall-on-Rock-Self-Belay-Error-Mistake-With-Ascenders-Summit-Fever-California-Yosemite-Valley-El-Capitan)：daisy 扣太短、繩子轉了 45°，上方上升器被扯離繩子。報告寫：上升器裝上繩後，要把它推到跟繩子平行，親眼看凸輪和安全扣完全閉合。

清斜向段的做法：

1. **tie in short**：一進斜向段就打備份結扣回吊帶。
2. **上方上升器的頂孔扣鉤環繞住繩子**，防止被斜拉脫出（Climbing.com 陡壁爬繩教學）。
3. **太斜就重新人工攀過去**（re-aid）：McNamara 說接近水平的橫渡，上升器不是設計來這樣用的，可能把繩子磨爛甚至磨斷；把繩梯和 daisy 移到保護點上，像先鋒一樣一個點一個點過去。
4. **擺盪點用 lower out**：短擺盪從繩尾拉出一段繩，穿過固定點再扣回吊帶，用它把自己慢慢放出去。[Alpinesavvy 介紹的另一種做法](https://alpinesavvy.com/blog/lowering-out-consider-using-a-designated-cord)是帶一條 5–6 mm、約 5 公尺的專用細繩，用義大利半扣放自己；能放出的距離只有細繩長度的一半。

### 不要在上升器上墜落

上升器的齒咬在繩皮上。上方有鬆繩時一掉下去，齒就會把繩皮扯掉。[Petzl 的測試](https://www.petzl.com/US/en/Sport/Ascending-the-rope-in-self-rescue---take-care-when-approaching-the-anchor)用 80 kg 假人、墜落係數 1，在 8 mm 低延展繩上量到 5.4 kN，繩皮斷、繩芯受損；他們的結論是，差 50 公分就能讓一次「普通」的墜落變成「嚴重」的墜落。所以 Petzl 說明書寫：不要爬到上升器或固定點上方，繩子保持繃緊，靠近固定點時尤其不能有衝擊。

EDELRID Knowledge Base 這支從 0:40 開始，用 80 kg 沙袋砸在帶齒的 Spoc 上：離固定點遠的時候，繩子夠長、吸收得了衝擊，沒有損傷；沙袋和轉向點同高、留 0.5 公尺鬆繩時，繩皮破了，10 股繩芯斷了 2 股；留 2 公尺鬆繩時，繩子直接被切斷。

```youtube
url: https://www.youtube.com/watch?v=ypf0Tq_fUpk
title: The Risk of Rope Clamps when Belaying or Simul-Climbing（EDELRID Knowledge Base）
start: 40
```

測的是滑輪型的帶齒器材，不是手式上升器，但齒咬繩皮的機制一樣。這是廠商頻道，測的是自家產品，片子是德文配音。

### 上升器型號

| 型號 | 重量 | 繩徑 | 標準 | 台灣價格（2026-10-24） |
|---|---|---|---|---|
| [Petzl ASCENSION](https://www.petzl.com/us/en/sport/products/ascenders/ascension/ASCENSION_SPO_a2mw0000000KiOfAAK.html) | 165 g | 8–13 mm | EN 567、UIAA | NT$3,000（[Petzl 台灣](https://www.petzltw.com/)）；NT$2,700（[山水戶外](https://www.tpshanshui.com.tw/products/b17ala-b17ara)、[馬布谷](https://mabuvalley.com/products/petzl-ascension-%E4%B8%8A%E5%8D%87%E5%99%A8-%E5%8F%B3%E6%89%8B)） |
| [BD Index](https://blackdiamondequipment.com/products/index-ascender) | 199 g | 8–13 mm | EN 567 | NT$2,970（[天嵐](https://tianlan.cyberbiz.co/products/620004-black)） |
| [Kong Futura Hand](https://kongusa.com/products/futura-hand) | 125 g | 9–11 mm | EN 567、EN 12841/B | — |
| [CAMP Turbohand Pro](https://camp.it/prodotti3.aspx?ART=~2155&CAT=60&CDV=12&j=catsaf_nu) | 198 g | 8–13 mm | EN 567；10–13 mm 半靜力繩 EN 12841/B | — |

[OutdoorGearLab 2024 年的上升器評比](https://www.outdoorgearlab.com/topics/climbing/best-ascender)選 BD Index 當最佳整體，理由是板機式扳手，拇指或食指都能開凸輪；OutdoorGearLab 說它在一段繩距剛起爬、上升器下方的繩子還沒有重量時特別好用。ASCENSION 在台灣比較好買，Petzl 台灣官網就叫它「手式上升器」，分左右手兩個型號。兩種都是一組買左右各一個。

## 滑輪：拖包以外的用途

滑輪讓繩子轉向、減少摩擦。拖包會用到，但這篇不講；你最可能先用到滑輪的地方是救援。〈[自我救援基礎](/posts/climbing/2026-10-17-self-rescue-basics)〉講了什麼情況要拉人；這裡只講滑輪的部分。

[Petzl 的機械效益說明](https://m.petzl.com/US/en/Professional/How-to-calculate-mechanical-advantage?ActivityName=Technical-rescue)舉的例子是：你徒手最多拉得動 20 kg，用 3:1 系統可以拉起 60 kg，代價是要把物體拉高 1 公尺，你得拉 3 公尺的繩。這是理想值，真實滑輪的效率大約 50–98%。效率越低，你拉的力越多是在對抗摩擦。

同一家廠商的滑輪，效率差很多：

| 型號 | 重量 | 效率 | 繩徑 | 強度 | 備註 |
|---|---|---|---|---|---|
| [Petzl PARTNER](https://catalogs.petzl.com/Petzl-sport-workbook-2026-spring-summer/en/39-Pulleys-and-Trolleys.html) | 56 g | 91% | 7–11 mm | — | 輕量；[Petzl 台灣](https://www.petzltw.com/) NT$1,900 |
| [Petzl FIXE](https://www.petzl.com/us/en/operators/products/single-pulleys/fixe/FIXE-PRO_OPE_a2mTx000004HH3lIAG.html) | 90–98 g | 71% | 6–13 mm | 23 kN | 側板固定、沒有滾珠軸承，效率低 |
| [Petzl RESCUE M](https://m.petzl.com/US/en/Tactical/Pulleys/RESCUE-M) | 158 g | 95% | 6–13 mm | 36 kN | 救援用 |
| [Petzl SPIN L1](https://www.petzl.com/us/en/operators/products/pulleys-with-swivel/spin-l1/SPIN-L1_OPE_a2m1r000002cHezAAE.html) | 290 g | 95% | 7–13 mm | 36 kN | 附轉環 |

滑輪的標準是 EN 12278（見 [Petzl 型錄](https://catalogs.petzl.com/Petzl-sport-workbook-2026-spring-summer/en/39-Pulleys-and-Trolleys.html)各型號的認證欄）。一顆輕量滑輪搭配下面的帶齒滑輪，就能組出 3:1 的救援系統；怎麼架請跟課學。

## 帶齒滑輪：拉得動、退不回去

### 它是什麼

帶齒滑輪（progress-capture pulley）是滑輪加一個帶齒的凸輪：繩子往一個方向拉很順，反方向會被齒咬住停下。[Petzl 台灣](https://www.petzltw.com/)叫它「單向制停滑輪」，台灣店家也叫單向滑輪（例如[伊凱文](https://www.eamkevc.com.tw/tw/html/product/show.php?pid=1894&cid=76&cid2=172)）。

| 型號 | 重量 | 效率 | 繩徑 | 當帶齒滑輪的破斷強度 | 台灣價格（2026-10-24） |
|---|---|---|---|---|---|
| [Petzl NANO TRAXION](https://www.petzl.com/us/en/sport/products/progress-capture-pulleys/nano-traxion/NANO-TRAXION_SPO_a2m1r000002bl1IAAQ.html) | 53 g | 91% | 7–11 mm | 4 kN | NT$3,800 定價，官網特價 NT$3,040（[Petzl 台灣](https://www.petzltw.com/)） |
| [Petzl MICRO TRAXION](https://www.petzl.com/int/en/sport/products/progress-capture-pulleys/micro-traxion/MICRO-TRAXION_SPO_a2mw0000000HePgAAK.html) | 85 g | 91% | 7–11 mm | 4 kN | NT$3,980（Petzl 台灣）；NT$3,580（[伊凱文](https://www.eamkevc.com.tw/tw/html/product/show.php?pid=1894&cid=76&cid2=172)） |
| [Petzl PRO TRAXION](https://www.petzl.com/us/en/operators/products/progress-capture-pulleys/pro-traxion/PRO-TRAXION_OPE_a2m68000000PBIuAAO.html) | 295 g | 95% | 8–13 mm | 4 kN | — |
| [Edelrid SPOC](https://edelrid.de/en/sports/pulleys/spoc.html) | 60 g | 92% | 7–11 mm | — | — |

Micro 的凸輪可以鎖在打開的位置，變成一般滑輪（[HowNOT2 的 TRS 指南](https://hownot2.com/trs-guide)）。PRO TRAXION 比較大、比較重，主要是拖包用。

### Petzl 准你拿它做什麼

[Petzl 的 MICRO TRAXION 產品頁](https://www.petzl.com/US/en/Sport/Pulleys/MICRO-TRAXION)寫它的用途是冰河裂隙救援、拖拉、自我救援，以及**當作緊急上升器**。[說明書](https://www.petzl.com/on/demandware.static/-/Sites-petzl-master-catalog/default/dwc33c3a4e/media/product/technical-notice-MICROTRAXION-1_068Tx00000GXHYmIAP.pdf)寫，當一般滑輪時工作負重 5 kN、破斷 15 kN，當帶齒滑輪時破斷只有 4 kN；用它爬繩時，不要爬到它或固定點上方，繩子要保持繃緊。

另外兩件 Petzl 明講的事：

- **不能拿來確保跟攀者**。[Petzl 的警告頁](https://www.petzl.com/us/en/sport/tech-tips/basic-techniques/belaying-the-second-with-a-micro-traxion-or-nano-traxion--beware-of-any-fall/MICRO-TRAXION---sport-7---Assurage-du-second-avec-_SPO_a77w0000000KysSAAS.html)說，MICRO 和 NANO TRAXION 不是確保器，50 公分的鬆繩很快就會形成；他們的測試裡有一條很舊的繩子整條斷掉。
- **固定繩上的自我確保（toprope solo），Petzl 不建議**。[Petzl 的技術說明](https://petzl.com/us/en/sport/tech-tips/expert-techniques/self-belay--solo-climbing-with-one-or-two-fixed-ropes/auto-assurage-2023_SPO_a77Tx00000000KzIAI.html)寫，他們沒有任何器材是專為自我確保攀登設計的，某些上升器可以由專家拿來用；要用就用兩套，而且最好是兩種不同的器材（例如一個 NANO 加一個 MICRO），免得同一個錯誤犯兩次，例如兩顆 MICRO 都忘了把凸輪放下來。同一份說明也提醒，繩子受力會延展約 10%，50 公尺的路線前 5 公尺有撞地風險。先鋒的 rope solo，這份說明完全沒有涵蓋。

自我確保的整體風險，見〈[無繩獨攀與帶繩獨攀](/posts/climbing/2026-10-19-free-solo-rope-solo)〉。HowNOT2 的 TRS 指南也點出一個容易犯的錯：Micro 的凸輪鎖在打開位置時，它就只是滑輪。出發前一定要在地面先坐上去一次，確認它真的會咬住。

### 有鬆繩就會剝皮

HowNOT2 這支從 1:06 開始：200 磅的石頭掛在 Micro Traxion 上，繩子完全沒有鬆度時約 2 kN，沒事；留出鬆繩、做成墜落係數 1 時，繩皮被扯掉，還斷了兩股繩芯。說明欄寫的衝擊力是 4.67 kN，跟 Petzl 標的 4 kN 破斷是同一個量級。後面他們用 EDELRID 的 G-Screamer 把衝擊壓到約 4 kN（量到 4.05 kN）。

```youtube
url: https://www.youtube.com/watch?v=XcDa2wESs7o
title: Don't break your rope（HowNOT2）
start: 66
end: 300
```

一顆石頭、樣本很少。EDELRID 有參與這集，還請 Tommy Caldwell 介紹 G-Screamer；說明欄有導購到 HowNOT2 自家商店。片頭 0:44 他轉述 Petzl「只要沒有鬆繩就可以」，Petzl 的原文見上面的說明書。

## 第一套怎麼湊

依你要做的事，從少到多：

### 只想在自由攀登路線上偶爾踩一兩步（A0、短人工段）

- 一條輕量繩梯，例如 Metolius Pocket Aider，或 Petzl 台灣有賣的 7 階梯式 [WALLSTEP](https://www.petzltw.com/products/wallstep)（145 g，NT$2,600）。
- 一條短快扣，用來把自己扣近保護點。

### 想練爬繩，準備當大岩壁的跟攀者

- 兩個手式上升器（左右各一）：BD Index 或 Petzl ASCENSION。
- 兩條可調 daisy，或一條 Petzl DUAL EVOLV ADJUST（[Petzl 台灣](https://www.petzltw.com/products/dual-evolv-adjust) NT$3,500）。
- 一到兩條繩梯，接在下方上升器上。
- 三到四個自動鎖鉤環，加一支 GriGri 當備份。[Kirkpatrick](https://andy-kirkpatrick.com/blog/view/uk-nose-training) 建議用 GriGri 當隨時跟著往上的備份。

### 想先鋒人工攀登

- 兩條繩梯（之後再決定要不要四條）。[OutdoorGearLab 2024 年的繩梯評比](https://www.outdoorgearlab.com/topics/climbing/best-aider)選 Yates Big Wall Ladder 當最佳整體，Metolius 5 Step Aider 當最划算。
- 兩條 daisy 或可調 daisy：[Climbing.com 的 Topstep 清單](https://climbing.com/skills/tech-tip-aid-topstep-mania)是兩條 140 cm daisy。
- 一個 fifi hook，加一條 15 cm 快扣當 fifi 的備份。
- 一顆輕量滑輪和一顆帶齒滑輪，留給救援。

上面提到的 Petzl 器材（上升器、DUAL EVOLV ADJUST、FIFI、WALLSTEP、帶齒滑輪），[Petzl 台灣官網](https://www.petzltw.com/)都有列。

## 在台灣怎麼練

台灣沒有大岩壁，但每一個動作都能在離地很近的地方先練熟。

- **先鋒循環**：[Climbing.com 的大岩壁教學](https://www.climbing.com/skills/how-to-climb-a-big-wall/)建議先在短裂隙上練不用槌子的人工攀登。在龍洞找一條你已經會自由攀登的短裂隙，帶頂繩，用繩梯一個點一個點爬上去，練到每次都記得退一階再測。
- **雙上升器爬繩**：在頂繩路線上架一條固定繩，從地面練起，練架設、練坐、練打備份結，也練「爬到一半換成垂降」的轉換。
- **斜向段**：找一段斜的繩段練扣頂孔和 tie in short。這是最容易出事的地方，先在地面附近練。

## 檢查與汰換

- **上升器與帶齒滑輪**：[Petzl ASCENSION 說明書](https://www.petzl.com/on/demandware.static/-/Sites-petzl-master-catalog/default/dw6093247e/media/product/technical-notice-ASCENSION-4_068Tx00000KzbaDIAR.pdf)寫，齒缺了或磨平就不要用；凸輪裡卡了泥沙或異物會讓它咬不住。
- **daisy 與繩梯**：[Metolius](https://metoliusclimbing.com/products/easy-daisy) 說扁帶磨損就換；[BD](https://blackdiamondequipment.com/blogs/stories/qc-lab-personal-anchor-systems-explained) 提醒長期 girth hitch 的地方會磨到看不見。每次用完拆開看一次。
- **墜落過的器材**：上升器或帶齒滑輪上發生過衝擊，先檢查繩子有沒有剝皮。

其他判斷，見〈[攀岩裝備的檢查、保養與汰換](/posts/climbing/2026-10-19-climbing-gear-inspection-retirement)〉。

## 練習題：五個情境

答案在每題下方，先自己想再看。

**1. 你要把縫線 daisy 收短一點，順手把扣著尾端大環的鉤環也扣進中間一個小環。這樣可以嗎？**

<details><summary>答案</summary>

不行。這樣鉤環可能只扣在小環的縫線上，BD 說強度可能低到約 2.2 kN，而且一半一半的機率扣成這樣。收短要用第二個鉤環扣中間的小環；一個鉤環永遠只扣一個環。

</details>

**2. 你站在繩梯頂階，剛放好一顆 cam，想馬上在這裡用力彈跳測試。**

<details><summary>答案</summary>

先退下至少一階再測。Climbing.com 和 Kirkpatrick 都說不要站在頂階上測試：新的保護點被拔出來時，你站得越高，掉在下面那個保護點上的衝擊越大。測的時候往下看，不要盯著 cam。

</details>

**3. 你在清一段大約 40° 斜拉的繩段，下方上升器卡在保護點下面，你想把上方上升器拿下來、越過保護點再裝回去。**

<details><summary>答案</summary>

拿下任何一個上升器之前，先在下面打一個備份結扣回吊帶（tie in short）。裝回去時把上升器推到跟繩子平行，親眼看凸輪和安全扣有沒有完全閉合，上方上升器的頂孔扣鉤環繞住繩子。太斜就改成重新人工攀過去。Zodiac（1992 年）和 Mescalito 的事故，都是在這種情況下上升器脫繩。

</details>

**4. 朋友說他在確保站用 Metolius Easy Daisy 把自己掛在固定點上，因為它可以調長度很方便。**

<details><summary>答案</summary>

Easy Daisy 只標 1.3 kN、只承受體重，Metolius 說不能當唯一的連接，BD 說 daisy 不是個人固定系統，Metolius 也說在確保站用 PAS 比 daisy 安全。確保站要用 PAS 或用攀登繩打結固定；Petzl 的 DUAL EVOLV ADJUST 通過 EN 17520，可以在確保站單獨使用，但仍然只能用在墜落係數 1 以下。

</details>

**5. 你想在龍洞用一顆 Micro Traxion 掛在固定繩上，自己練頂繩攀登。**

<details><summary>答案</summary>

Petzl 不建議自我確保攀登，沒有任何 Petzl 器材是為這件事設計的；真要做，用兩套、最好是兩種不同的器材，例如 NANO 加 MICRO。出發前在地面坐上去確認凸輪真的會咬住，也要算到繩子受力會延展約 10%，前幾公尺有撞地風險。系統裡不要有鬆繩：Micro Traxion 當帶齒滑輪只標 4 kN 破斷，HowNOT2 量到墜落係數 1 時約 4.7 kN 就把繩皮扯掉。

</details>

## 下一步

人工攀登和爬繩都是大岩壁的基本功。回到〈[大岩壁與人工攀登](/posts/climbing/2026-10-19-big-wall-aid-climbing)〉看它們在一整個繩隊的流程裡放在哪裡，或讀〈[自我救援基礎](/posts/climbing/2026-10-17-self-rescue-basics)〉，把滑輪和帶齒滑輪用在救援上。

## 延伸觀看：器材實測與教學頻道

- **[HowNOT2](https://www.youtube.com/@HowNOT2)**：Ryan Jenks 經營，2016 年從走繩（highline）安全教學起家，後來把攀岩、洞穴、溪降器材拿去拉斷，還有在真岩上拉 bolt 的 Bolt Busters 系列。看點是「標示強度以外」的情況：打結、磨損、舊裝備、放錯位置。限制：多數是自製機器慢拉、每組 1–3 個樣本，他自己也說這是娛樂不是科學；頻道背後有網路器材店，部分受測品是店內商品。
- **[Hard Is Easy](https://www.youtube.com/@HardIsEasy)**：署名 Ben 的攀岩者獨自經營，以前是軟體工程師。一次在泰國 Tonsai 看到確保者接太硬、攀者撞上岩石，他回家設計實驗，從此專拍確保、繩子、鉤環與確保器的實驗與物理解說，近年多支在 Mammut 實驗室合拍。限制：實驗多是自己設計，不是 EN／UIAA 標準測試。
- **[EDELRID Knowledge Base](https://www.youtube.com/@EDELRIDKnowledgeBase)**：德國器材廠 EDELRID 的產品與教育團隊 2025 年開的頻道，在自家實驗室做拉力、落錘、銳角切割測試，會報 kN 數字。限制：廠商頻道，畫面多是自家產品。

## 參考資料

- [How To Big Wall Climb: Leading 1 – Low Angle Terrain（Chris McNamara, SuperTopo）](http://supertopo.com/a/How-To-Big-Wall-Climb-Leading-1%C2%97Low-Angle-Terrain/a10536n.html)
- [How to Big Wall Climb: Leading 2 – Vertical and Overhanging Terrain（SuperTopo）](http://supertopo.com/a/How-to-Big-Wall-Climb-Leading-2-Vertical-and-Overhanging-Terrain/a10538n.html)
- [How to Big Wall Climb: Leading 3 – Placing Gear（SuperTopo）](http://supertopo.com/a/How-to-Big-Wall-Climb-Leading-3-Placing-Gear/a10568n.html)
- [How to Big Wall Climb: Following 2 – Vertical and Overhanging Terrain（SuperTopo）](http://supertopo.com/a/How-to-Big-Wall-Climb-Following-2-Vertical-and-Overhanging-Terrain/a10539n.html)
- [How To Big Wall Climb: Following 4 – Traversing Terrain（SuperTopo）](http://supertopo.com/a/How-To-Big-Wall-Climb-Following-4-Traversing-Terrain/a10967n.html)
- [Tech Tip: Aid Topstep Mania（Climbing.com）](https://climbing.com/skills/tech-tip-aid-topstep-mania)
- [Tech Tips: Aid — A Game of Inches（Climbing.com）](https://climbing.com/skills/tech-tips-aid-a-game-of-inches)
- [Learn This: How to Rope Jug（Climbing.com）](https://climbing.com/skills/learn-this-how-to-rope-jug)
- [Learn This: Efficient Jugging in High-Angle Terrain（Climbing.com）](https://climbing.com/skills/learn-this-efficient-jugging-in-high-angle-terrain)
- [How to Climb a Big Wall（Climbing.com）](https://www.climbing.com/skills/how-to-climb-a-big-wall/)
- [Top Stepping（Andy Kirkpatrick）](https://andy-kirkpatrick.com/articles/view/top_stepping)
- [Moving Up and Down Fixed Ropes（Andy Kirkpatrick）](https://andy-kirkpatrick.com/articles/view/moving_up_and_down_fixed_ropes)
- [Pounding Steel（Andy Kirkpatrick）](https://andy-kirkpatrick.com/blog/view/pounding_steel)
- [UK Nose Training（Andy Kirkpatrick）](https://andy-kirkpatrick.com/blog/view/uk-nose-training)
- [QC Lab: Daisy Chain Dangers（Black Diamond）](https://blackdiamondequipment.com/en_US/stories/experience-story-qc-lab-daisy-chain-dangers-en-glbl)
- [QC Lab: Personal Anchor Systems Explained（Black Diamond）](https://blackdiamondequipment.com/blogs/stories/qc-lab-personal-anchor-systems-explained)
- [Daisy Chain & Etrier 說明書 MM5825（Black Diamond，PDF）](https://cdn.shopify.com/s/files/1/0880/2195/8973/files/MM5825_E_Daisy-Etrier_IS-WEB.pdf)
- [Easy Aider／Easy Daisy 說明書（Metolius，PDF）](https://outdoorplay.com/pdfs/metolius-easy-aider-daisy-manual.pdf)
- [All about sewn pocket daisy chains（Alpinesavvy）](https://alpinesavvy.com/blog/all-about-sewn-pocket-daisy-chains)
- [Add a release loop to your fifi hook（Alpinesavvy）](https://alpinesavvy.com/blog/add-a-release-loop-to-your-fifi-hook)
- [Rope ascending with the Petzl Traxion（Alpinesavvy）](https://alpinesavvy.com/blog/rope-ascending-with-the-petzl-traxion)
- [Lowering out? Consider using a designated cord（Alpinesavvy）](https://alpinesavvy.com/blog/lowering-out-consider-using-a-designated-cord)
- [Using the EVOLV ADJUST lanyard（Petzl）](https://petzl.com/US/en/Sport/Using-the-EVOLV-ADJUST-lanyard)
- [Using only one ascender（Petzl）](https://petzl.com/US/en/Sport/Using-only-one-ascender-)
- [Ascending the rope in self-rescue: take care when approaching the anchor（Petzl）](https://www.petzl.com/US/en/Sport/Ascending-the-rope-in-self-rescue---take-care-when-approaching-the-anchor)
- [ASCENSION 說明書（Petzl，2025 年版 PDF）](https://www.petzl.com/on/demandware.static/-/Sites-petzl-master-catalog/default/dw6093247e/media/product/technical-notice-ASCENSION-4_068Tx00000KzbaDIAR.pdf)
- [MICRO TRAXION 說明書（Petzl，PDF）](https://www.petzl.com/on/demandware.static/-/Sites-petzl-master-catalog/default/dwc33c3a4e/media/product/technical-notice-MICROTRAXION-1_068Tx00000GXHYmIAP.pdf)
- [MICRO TRAXION 產品頁（Petzl）](https://www.petzl.com/US/en/Sport/Pulleys/MICRO-TRAXION)
- [Belaying a second with the MICRO TRAXION = danger（Petzl）](https://www.petzl.com/us/en/sport/tech-tips/basic-techniques/belaying-the-second-with-a-micro-traxion-or-nano-traxion--beware-of-any-fall/MICRO-TRAXION---sport-7---Assurage-du-second-avec-_SPO_a77w0000000KysSAAS.html)
- [Self-belay: solo climbing with one or two fixed ropes（Petzl）](https://petzl.com/us/en/sport/tech-tips/expert-techniques/self-belay--solo-climbing-with-one-or-two-fixed-ropes/auto-assurage-2023_SPO_a77Tx00000000KzIAI.html)
- [How to calculate mechanical advantage（Petzl）](https://m.petzl.com/US/en/Professional/How-to-calculate-mechanical-advantage?ActivityName=Technical-rescue)
- [Petzl Sport 2026 春夏型錄：上升器](https://catalogs.petzl.com/Petzl-sport-workbook-2026-spring-summer/en/38-Ascenders.html)、[滑輪](https://catalogs.petzl.com/Petzl-sport-workbook-2026-spring-summer/en/39-Pulleys-and-Trolleys.html)
- [Petzl 台灣官網](https://www.petzltw.com/)
- [Big Wall Bible: Ascending（HowNOT2）](https://hownot2.com/post/bigwalls-ascending)
- [TRS Guide（HowNOT2）](https://hownot2.com/trs-guide)
- [The Best Ascenders（OutdoorGearLab，2024）](https://www.outdoorgearlab.com/topics/climbing/best-ascender)
- [The Best Aiders（OutdoorGearLab，2024）](https://www.outdoorgearlab.com/topics/climbing/best-aider)
- [Aider FAQ（Fish Products）](http://fishproducts.com/faqs/aiderfaq.html)
- [Fall on Rock, Ascenders Detached from Rope, El Capitan（Accidents in North American Climbing 1993）](http://publications.americanalpineclub.org/articles/13199303600/Fall-on-Rock-Ascenders-Detached-from-Rope-California-Yosemite-Valley-El-Capitan)
- [Fall on Rock, Failure to Backup Ascenders, Tangerine Trip（Accidents in North American Climbing 2005）](http://publications.americanalpineclub.org/articles/13200505302/Fall-on-Rock-Failure-to-Backup-Ascenders-California-Yosemite-Valley-El-Capitan-Tangerine-Trip)
- [Fall on Rock, Mistake With Ascenders, Mescalito（Accidents in North American Climbing 2011）](http://publications.americanalpineclub.org/articles/13201103000/Fall-on-Rock-Self-Belay-Error-Mistake-With-Ascenders-Summit-Fever-California-Yosemite-Valley-El-Capitan)
- [Don't break your rope（HowNOT2，YouTube）](https://www.youtube.com/watch?v=XcDa2wESs7o)
- [Big wall tips and tricks: How to jug !（Siebe Vanhee，YouTube）](https://www.youtube.com/watch?v=6CpgXkbcZsI)
- [Big wall tips and tricks: How to jug in steep terrain!（Siebe Vanhee，YouTube）](https://www.youtube.com/watch?v=MiyNkeKTz9Y)
- [The Risk of Rope Clamps when Belaying or Simul-Climbing（EDELRID Knowledge Base，YouTube）](https://www.youtube.com/watch?v=ypf0Tq_fUpk)
- [Are certified self belay slings really better?（EDELRID Knowledge Base，YouTube）](https://www.youtube.com/watch?v=jrI7ldXQYNg)
- [大岩壁與人工攀登](/posts/climbing/2026-10-19-big-wall-aid-climbing)
- [多繩距入門](/posts/climbing/2026-10-17-multi-pitch-basics)
- [自我救援基礎](/posts/climbing/2026-10-17-self-rescue-basics)
- [無繩獨攀與帶繩獨攀](/posts/climbing/2026-10-19-free-solo-rope-solo)
- [攀岩裝備的檢查、保養與汰換](/posts/climbing/2026-10-19-climbing-gear-inspection-retirement)
