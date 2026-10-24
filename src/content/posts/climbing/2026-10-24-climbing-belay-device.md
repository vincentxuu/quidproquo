---
title: "第一個確保器怎麼挑：管狀、輔助管狀還是 GRIGRI 這類凸輪式，相容繩徑怎麼看，以及 14 款現行確保器比較"
date: 2026-10-24
category: climbing
tags: [climbing, climbing-gear, belay, indoor-climbing, sport-climbing, multi-pitch, beginner]
lang: zh-TW
type: guide
description: "給準備買第一個確保器的人：手動（管狀）和輔助制動兩大類差在哪，輔助制動再分輔助管狀和凸輪式；只在岩館、去戶外運攀、之後要爬多繩距各該先買哪一類；繩徑相容範圍怎麼讀；給繩手法和鉤環怎麼配。附 Black Diamond、Petzl、Edelrid、Mammut、DMM、Trango、Climbing Technology 共 14 款現行確保器比較，以及 Hard Is Easy、WeighMyRack、JB Mountain Skills、Edelrid 等 2024 年以後的實測與心得影片。"
tldr: "確保器分手動（管狀）和輔助制動；輔助制動再分輔助管狀（ATC Pilot、Smart 2.0、Jul²）和凸輪式（GRIGRI、NEOX、Pinch）。只在岩館和單繩距運攀，DAV 和 WeighMyRack 都建議第一個買輔助制動，輔助管狀約是凸輪式的一半價；之後要爬多繩距，還要一個能穿兩股、有 guide mode 的管狀，例如 ATC-Guide 或 Reverso，Giga Jul 兩種功能都有。輔助是「輔助」不是「自動」：Edelrid 示範輔助管狀拿錯角度時，繩子幾乎沒有制動力就滑過去，制動手永遠不能離開繩子。買之前查說明書的相容繩徑，例如 GRIGRI 是 8.5–11 mm、最佳 8.9–10.5 mm，Pilot 和 Smart 上限只到 10.5 mm。"
draft: false
series:
  name: "攀岩裝備"
  order: 4
glossary:
  - term: "輔助制動確保器"
    aliases: ["assisted braking", "ABD", "半自動確保器", "Halbautomat"]
    definition: "墜落時會自己夾住繩子的確保器。是「輔助」不是「自動」，仍然要用制動手握繩。"
    context: "Petzl GRIGRI 的說明書把它列為 EN 15151-1 type 6。DAV 把有輔助制動的確保器叫「半自動確保器」。"
  - term: "手動確保器"
    aliases: ["管狀確保器", "tube", "ATC", "manual belay device"]
    definition: "靠繩子在確保器裡彎折產生摩擦的確保器，制動完全靠你的制動手。"
    context: "ATC 原本是 Black Diamond 的型號，台灣岩友常拿來泛稱管狀確保器。"
  - term: "輔助管狀"
    aliases: ["assisted tube", "autotube", "被動式輔助制動"]
    definition: "外型像管狀、沒有可動零件的輔助制動確保器。墜落時確保器被拉起來，把繩子夾在確保器和鉤環之間；夾不夾得住和制動手的位置有關。"
    context: "例如 Black Diamond ATC Pilot、Mammut Smart 2.0、Edelrid Jul²。認證多是 EN 15151-2（手動制動器），這份標準也涵蓋一般管狀。"
  - term: "凸輪式確保器"
    aliases: ["cam-assisted", "GRIGRI 類", "主動式輔助制動", "EN 15151-1"]
    definition: "裡面有一個會轉動的凸輪，繩子被快速拉動時凸輪轉起來把繩子壓住。"
    context: "例如 Petzl GRIGRI、NEOX、Edelrid Pinch、Trango Vergo。"
  - term: "guide mode"
    aliases: ["跟攀模式", "自鎖模式", "Reverso 模式"]
    definition: "把管狀確保器直接掛在確保站上、從上方確保一或兩位跟攀者的用法。跟攀者墜落時，繩子會被確保器自己夾住。"
    context: "要有專門的掛孔才能用；多繩距常用，只在岩館用不到。"
  - term: "防恐慌"
    aliases: ["anti-panic"]
    definition: "下放時把手拉過頭，確保器會自己重新鎖住的設計，防止確保者慌張時一把拉開。"
    context: "GRIGRI+、Pinch 都有。Hard Is Easy 用 Pinch 下放時，防恐慌常常觸發，要再把把手拉過一段才會繼續放。"
---

> 🌏 [English version](/posts/climbing/2026-10-24-climbing-belay-device-en)

你在店裡看到兩條繩子，一條 9.8 mm、一條 8.9 mm，價格差不多。你想：細的比較輕，就買細的吧。店員問：「你要掛什麼確保器？」你答不出來。

確保器掛在吊帶的確保環上，繩子穿過它，攀爬者一掉，就靠它和你的制動手把人停住。買完〈[吊帶](/posts/climbing/2026-10-24-climbing-harness)〉，接著就該買它，因為你在岩館確保朋友時就用得到，而且它決定了你之後能買多粗、多細的繩。這篇只回答一件事：要買哪一個。**不講怎麼確保**；確保的操作在〈[岩館上攀確保](/posts/climbing/2026-10-17-gym-top-rope-belay)〉、〈[岩館先鋒](/posts/climbing/2026-10-17-gym-lead-climbing)〉和〈[戶外確保](/posts/climbing/2026-10-17-outdoor-belay)〉。讀完你應該知道自己該買哪一類，並能從後面的表挑出一兩款。

## 先分兩大類：手動和輔助制動

確保器大致分兩類：

- **手動確保器**：靠繩子在確保器裡彎折產生摩擦，制動完全靠你的制動手。外型多半是一個小管子，所以也叫管狀確保器。
- **輔助制動確保器**：墜落時會自己夾住繩子。〈[岩館上攀確保](/posts/climbing/2026-10-17-gym-top-rope-belay)〉說過，它是「輔助」不是「自動」，制動手仍然不能離開繩子。

輔助制動又分兩種，差在運作原理：

- **凸輪式**：像 GRIGRI，裡面有凸輪把繩子壓住。GRIGRI 的說明書把它列為 EN 15151-1。
- **輔助管狀**：像 ATC Pilot、Edelrid Jul²，外型是管狀、沒有可動零件，墜落時把繩子夾在確保器和鉤環之間，鎖不鎖和確保器、制動手的位置有關。[Jul²](https://www.edelrid.com/us-en/sport/belay-devices/jul-2) 和 Giga Jul 的原廠頁都標 EN 15151-2；這份標準的名稱是「手動制動器」，一般管狀也歸在這一類。

UIAA 在 [2009 年發布的第一份制動器標準（UIAA 129）](https://www.theuiaa.org/safety-standard-for-braking-devices-published/)涵蓋四種：手動、輔助鎖定、垂降器，以及帶防恐慌功能的垂降器。歐洲標準是 EN 15151。以 [Petzl GRIGRI 的說明書](https://www.petzl.com/sfc/servlet.shepherd/version/download/068Tx000009YCjEIAW)為例，它寫的是「EN 15151-1 type 6：用於確保與垂降、沒有防恐慌鎖定元件的裝置」。不同確保器屬於哪一型，看它的說明書。

「和位置有關」是什麼意思，Edelrid 自家知識頻道這支兩分多鐘的影片示範得很清楚。0:36 起是正確的基本姿勢：繩子方向正確、鉤環鎖上，制動手的拇指穿過拇指托、其他手指握住制動端。確保器拿高、拇指托朝下，這時一受力就鎖住，接墜時繩子一公分都沒滑。1:25 起是錯的姿勢：拇指托朝上，確保器被撐開，墜落時繩子直接從確保器跑過去，幾乎沒有制動力。這就是「輔助不是自動」。這是廠商自己的頻道，講的是有拇指托的輔助管狀，影片沒有唸出型號；你手上那台的基本姿勢看它的說明書。

```youtube
url: https://www.youtube.com/watch?v=XbPzg1NURjI
title: How to handle semi automatic belay devices with a thumb rest（EDELRID Knowledge Base）
start: 36
```

**不管買哪一類，制動手永遠握在繩上。** 這句話後面會一直出現。輔助制動確保器讓你在分心、手沒抓好時多一層機會，不是讓你可以放手；原廠說明書也都這樣要求。

今晚就能做的事：下次去岩館，看一眼租借櫃台的確保器，認出它是管狀、輔助管狀還是凸輪式。

## 四個判準

### 1. 先問你要在哪裡確保

第一個確保器該買哪一類，取決於你接下來一年在哪裡爬。

德國登山協會（DAV）[2024 年 7 月英文版的岩館入門手冊](https://alpenverein.de/files/2409-indoor-klettern-basics-english_ol.pdf)講得很短：建議用有輔助制動的確保器（他們叫「半自動確保器」）。

比價網站 WeighMyRack 的[選購影片](https://www.youtube.com/watch?v=tHcQHLmBXyY)給的方向一樣：主要在岩館和單繩距運攀，第一個買輔助管狀。理由是價格約凸輪式的一半，技巧也好學。英國登山教練 JB Mountain Skills 的[答案](https://www.youtube.com/watch?v=FMj1fCvnCOs)不同，他建議英國的新手第一個買有 guide mode 的管狀，因為英國傳攀多用半繩，要能穿兩股。兩邊不衝突，差在你會爬什麼：

- 只在岩館、運攀：第一個買輔助制動。
- 之後確定要爬多繩距或傳攀：還需要一個能穿兩股、有 guide mode 的管狀。可以先買它，也可以兩個都買。

今晚就能做的事：寫下你接下來一年最常爬的地方。只有岩館，還是會去龍洞這類岩場？會不會跟人爬多繩距？

### 2. 相容：繩徑要落在確保器的範圍內

繩徑就是繩子的粗細，單繩大約在 9–10 mm 上下。繩子細一點比較輕，粗一點比較耐用，怎麼挑留到系列的[第 8 篇：繩子](/posts/climbing/2026-10-24-climbing-rope)。這裡只要知道一件事：確保器是照某個繩徑範圍設計的。

[UIAA 2026 年的購買建議](https://theuiaa.org/uiaa/uiaa-advice-ten-things-to-consider-when-buying-climbing-gear)第二條就是相容性，它舉的例子是：為 9–10 mm 繩設計的確保器，搭 11 mm 的粗繩可能無法正常運作。

確保器能用的繩徑寫在說明書上。以 GRIGRI 的說明書為例：

- 相容 8.5 到 11 mm 的 EN 892 單繩。
- **8.9 到 10.5 mm** 運作最佳。
- 10.5 到 11 mm：粗繩或用舊的繩，給繩會比較費力。
- 8.5 到 8.9 mm：細繩比較難握住，下放、垂降和接墜落時比較難控制，需要更多警覺和經驗。

說明書還有兩個提醒：

- **繩徑有誤差。** 市售繩子的標稱繩徑有最多 ±0.2 mm 的誤差，所以接近上下限的組合要特別小心。
- **有些繩比較滑。** 有外皮處理的繩、全新的繩，以及結冰、濕、沾泥的繩，都可能降低 GRIGRI 的鎖定效果。換一條不熟悉的繩，就要重新熟悉確保器的手感。

範圍各家不一樣，後面的表都列了。最常踩到的是上限：ATC Pilot、Smart 2.0、Pinch 都只到 10.5 mm，Giga Jul 只到 10 mm。岩館的公用繩常常是用舊、起毛的粗繩，自己帶確保器去之前先問繩徑。

回到開頭那兩條繩：要先知道你的確保器適合什麼繩徑，再決定買 9.8 還是 8.9。

今晚就能做的事：找出你確保器的說明書（紙本或原廠網站），抄下它的相容繩徑和最佳範圍。再看你最常用的那條繩的繩徑，確認落在範圍內。
### 3. 給繩手法：你學的是哪一種

先鋒確保時要一直給繩。不同確保器，給繩的手法不一樣，學錯了就容易出事：

- **管狀和輔助管狀**：給繩手法跟一般管狀差不多。[Black Diamond 的 ATC Pilot 產品頁](https://blackdiamondequipment.com/products/atc-pilot-belay-device)也寫，它的穿繩方式和其他管狀確保器類似。
- **GRIGRI**：快速給繩時要用手指壓住凸輪。Hard Is Easy [2025 年分析一起 GRIGRI 事故](https://www.youtube.com/watch?v=WBGkKqLhM8Y)時提醒，Petzl 要求壓凸輪給繩時，至少要有三根手指一直握在繩上。那起事故裡，確保者壓著凸輪給繩，繩子從手裡滑掉。
- **NEOX、Pinch、Vergo**：原廠設計成不用壓凸輪也能給繩。日本山岳醫師たけちゃんねる的[比較影片](https://www.youtube.com/watch?v=D2YzrH2jQdA)提到，NEOX 的說明書已經拿掉壓凸輪的給繩法。

哪一種都學得會，重點是照你手上那台的說明書學，不要把 GRIGRI 的手法帶到別台，也不要反過來。

今晚就能做的事：問帶你確保的教練或岩館，他們教的是哪一種給繩手法，用的是哪一台。

### 4. 鉤環和配件：照原廠建議配

確保器要用一個有鎖鉤環掛在吊帶確保環上，常用的是 H 型（HMS）有鎖鉤環。[DAV 的岩館入門手冊](https://alpenverein.de/files/2409-indoor-klettern-basics-english_ol.pdf)也寫，鉤環要照確保器原廠的建議配。輔助管狀更要注意，因為它是靠鉤環把繩子夾住：

- **Mammut Smart 2.0**：原廠建議配 Smart HMS 鉤環。
- **Climbing Technology Click Up+**：要配 CT 指定的鉤環。
- **Edelrid Pinch**：可以不用鉤環，直接扣在確保環上。Hard Is Easy 提醒，確保環很細時可能扣錯位置，確保前一定要互檢。

鉤環怎麼挑，見下一篇〈[鉤環](/posts/climbing/2026-10-24-climbing-carabiners)〉。

今晚就能做的事：看你想買的確保器原廠頁，找「compatible carabiner」或「建議鉤環」那一行，把型號記下來。

## 14 款現行確保器比較

只收 2026-10-24 原廠官網還在賣的款式，依前面三類分表。價格是當天原廠美國官網標價（USD）；原廠沒標的列零售店並註明。繩徑和重量取自原廠頁。「適合誰／缺點」從規格和評測推出來，出處寫在格子裡；文字評測主要來自 [OutdoorGearLab 2025 年的清單](https://www.outdoorgearlab.com/topics/climbing/best-belay-device)和 [Climbing.com 2025 年的輔助制動清單](https://www.climbing.com/gear/best-belay-devices-assisted-braking-by-situation/)。

### 手動（管狀）

| 型號 | 繩徑（原廠） | 重量 | guide mode | 價格 | 適合誰／缺點 |
|---|---|---|---|---|---|
| [Black Diamond ATC-XP](https://blackdiamondequipment.com/products/atc-xp-belay-rappel-device) | 7.7–11 mm | 64 g | 沒有 | USD 34.95 | 只在岩館、預算最低的人，岩館租借最常見。沒有輔助制動也沒有 guide mode，WeighMyRack 說這一型已經不推薦 |
| [Black Diamond ATC-Guide](https://blackdiamondequipment.com/products/atc-guide-belay-rappel-device) | 8.1–11 mm | 80 g | 有 | USD 54.95 | 之後要爬多繩距、傳攀的人；OutdoorGearLab 2025 年的「最划算」。沒有輔助制動 |
| [Petzl REVERSO](https://www.petzl.com/US/en/Sport/Belay-Devices-And-Descenders/REVERSO) | 單繩 8.5–11、半繩 7.1–9.2、雙子繩 6.9–9.2 mm | 57 g | 有 | USD 49.95 | 和 ATC-Guide 同用途，全表最輕，原廠寫的繩徑範圍最完整 |
| [DMM Pivot](https://dmmwales.com/products/pivot) | 單繩 8.7–11、半繩／雙子繩 7.3–9.2 mm | 72 g | 有，可從上方下放 | GBP 37.50（DMM 英國） | 多繩距常要從確保站下放跟攀者的人；只在岩館用不到這個功能 |

### 輔助管狀（EN 15151-2，與一般管狀同一份標準）

| 型號 | 繩徑（原廠） | 重量 | guide mode | 價格 | 適合誰／缺點 |
|---|---|---|---|---|---|
| [Black Diamond ATC Pilot](https://blackdiamondequipment.com/products/atc-pilot-belay-device) | 8.7–10.5 mm | 86 g | 沒有，只能穿一股 | USD 54.95 | 從管狀轉輔助制動、預算有限的運攀者；Climbing.com 2025 年的「最適合嚮導與教練」 |
| [Mammut Smart 2.0](https://mammut.com/us/en/p/2040-02210-50076/smart-20) | 8.7–10.5 mm | 80 g | 沒有，只能穿一股 | USD 54.95 | 和 Pilot 同類；建議配 Smart HMS 鉤環。OutdoorGearLab 說有學習曲線 |
| [Edelrid Jul²](https://www.edelrid.com/us-en/sport/belay-devices/jul-2) | 8.9–11 mm | 105 g | 沒有，只能穿一股 | 原廠沒標；REI USD 49.95（快取頁，查價日不明） | 輔助管狀裡少數能用到 11 mm 粗繩的，適合常用岩館粗繩的人。我們沒找到 2024 年以後的文字評測 |
| [Edelrid Giga Jul](https://www.edelrid.com/us-en/sport/belay-devices/giga-jul) | 7.1–10 mm | 121 g | 有，可切換輔助和一般模式 | 原廠沒標；REI USD 69.95（快取頁，查價日不明） | 想要一個確保器同時做運攀和多繩距的人；OutdoorGearLab 2025 年的「最萬用」。上限只到 10 mm，粗的岩館繩不能用；JB Mountain Skills 說它貴、有切換鈕，不建議當第一個 |
| [Climbing Technology Click Up+](https://climbingtechnology.com/en/outdoor-en/belay-devices-and-descenders/manual-braking/click-up-plus) | 8.5–11 mm | 110 g | 沒有 | 原廠沒標；EpicTV US USD 82.65 | 想要管狀手感又要輔助制動的人；要配 CT 指定鉤環。原廠把它歸在「手動制動」、認證 EN 15151-2，但原廠頁也寫它有輔助制動系統，所以放進這一類 |

### 凸輪式（EN 15151-1）

| 型號 | 繩徑（原廠） | 重量 | 價格 | 適合誰／缺點 |
|---|---|---|---|---|
| [Petzl GRIGRI](https://www.petzl.com/US/en/Sport/Belay-Devices-And-Descenders/GRIGRI) | 8.5–11 mm（最佳 8.9–10.5） | 175 g | USD 104.95 | 岩館和運攀的萬用款；OutdoorGearLab 2025 年的「有經驗者最佳」。快速給繩要學壓凸輪；只能穿一股 |
| [Petzl GRIGRI+](https://www.petzl.com/US/en/Sport/Belay-Devices-And-Descenders/GRIGRI-PLUS) | 8.5–11 mm（最佳 8.9–10.5） | 200 g | USD 134.95 | 新手、常在岩館頂繩確保的人；有頂繩模式和防恐慌把手。貴；OutdoorGearLab 說模式切換容易忘 |
| [Petzl NEOX](https://www.petzl.com/US/en/Sport/Belay-Devices-And-Descenders/NEOX) | 8.5–11 mm（最佳 8.9–10.5） | 235 g | USD 154.95 | 以先鋒確保為主、從管狀轉過來的人；Climbing.com 2025 年說它給繩最順。重、貴；Hard Is Easy 測到完全沒握繩時比 GRIGRI 容易滑 |
| [Edelrid Pinch](https://www.edelrid.com/us-en/sport/belay-devices/pinch) | 8.5–10.5 mm | 234 g | 原廠沒標；REI USD 129.95（快取頁，查價日不明）；OutdoorGearLab、Climbing.com 2025 年評測列約 USD 120 | 左撇子、想少帶一個鉤環、不想學壓凸輪的人；左右手操作一樣，可直接扣在確保環上，[UKClimbing 2025 年的評測](https://www.ukclimbing.com/gear/climbing/belays/edelrid_pinch_-_better_than_the_grigri-16333)說這點改變很大。上限 10.5 mm；Hard Is Easy 覺得拉繩比 GRIGRI 費力 |
| [Trango Vergo](https://trango.com/products/vergo) | 8.9–10.7 mm | 195 g | USD 99.95 | 想要凸輪式又不想學壓凸輪的人；Climbing.com 2025 年說它「最直覺」。下放把手沒有中段，一拉就全開 |

讀評測時要注意：**GRIGRI+ 有新舊兩版。** Petzl 現行的 GRIGRI+ 是針對頂繩學習做的，英國零售商 Outside 2026 年的影片把它當新款介紹。OutdoorGearLab 2025 年評的「新手最佳」GRIGRI+ 可能是前一版，讀那篇評測時，別假設它測的就是你在店裡看到的那台；規格以 Petzl 現行頁為準。

在台灣，Petzl 台灣官網有上架 GRIGRI 和 GRIGRI+；登山補給站有 ATC-XP、ATC-Guide 和 GRIGRI 的商品頁。其他款式我們沒查到確定的台灣通路。

沒收進表的三款：

- **Wild Country Revo**：USD 199.95，對第一個確保器來說太貴；原廠頁沒有寫繩徑和重量。
- **Edelrid Mega Jul**：原廠不標價；同家的 Giga Jul 功能更多，近年的評測和討論多半轉到 Giga Jul。
- **Climbing Technology Alpine Up**：原廠不標價，主要是給多繩距進階者用的，不適合當第一個確保器。

## 實測與心得影片

下面挑了八支 2024 年以後、講到具體型號或判準的影片，每支都核對過字幕。有零售商或廠商關係的，各自在說明裡標出來。

Hard Is Easy 2025 年這支不是評測，是一起 GRIGRI 事故的逐格分析：一位職業攀岩選手在集訓時從牆頂摔到地面，雙腳和脊椎骨折。1:22 起他先講 Petzl 建議的給繩法：快速給繩可以壓凸輪，但至少要有三根手指一直握在繩上。5:32 起是事發那一刻：她在倒數第二個快扣附近做墜落練習，繩子開始繃緊、GRIGRI 開始鎖。確保的教練以為她要往上爬，壓下凸輪想給繩，繩子從他左手滑掉，不到一秒她就落地。他的結論是，照 Petzl 的建議用 GRIGRI，這類事故都能避免。說明欄沒有贊助，只有請觀眾支持頻道的連結。

```youtube
url: https://www.youtube.com/watch?v=WBGkKqLhM8Y
title: Coach Nearly Kills Pro Climber – GriGri Incident Analysis（Hard Is Easy）
start: 82
```

WeighMyRack 這支回答「第一個確保器買什麼」。0:20 起：主要在岩館和單繩距運攀，就買 Pilot、Smart 2.0、Jul² 這類輔助管狀，理由是價格約凸輪式的一半，給繩和下放也比較好學。4:10 起講多繩距：要能穿兩股、有 guide mode。5:32 起他說已經不推薦沒有 guide mode 的普通管狀。WeighMyRack 是比價網站，說明欄導向自家比價頁。

```youtube
url: https://www.youtube.com/watch?v=tHcQHLmBXyY
title: How to choose a belay device for climbing（WeighMyRack）
start: 20
```

JB Mountain Skills 2026 年給的是另一個答案。0:25 起他說答案看你在哪爬：在西班牙只爬運攀，他會推 GRIGRI 這一類；在英國，新手很快就會碰到半繩和傳攀，所以要能穿兩股。3:09 起他說不推 Giga Jul 當第一個，因為貴、有切換鈕容易搞混；3:29 起他的結論是買有 guide mode 的管狀，例如 ATC-Guide。說明欄沒有揭露器材來源。

```youtube
url: https://www.youtube.com/watch?v=FMj1fCvnCOs
title: What Belay Device Should You Buy First..?（JB Mountain Skills）
start: 25
```

Charlie Centa 這支講 Giga Jul 的一個設計陷阱。2:34 起他說，2024 年上嚮導課時買了 Giga Jul，幾週後就犯了 JB Mountain Skills 提醒過的錯。他用 guide mode 確保跟攀者時，鉤環扣進了掛孔旁邊那條鋼索，而那條鋼索不是設計來承受人的重量的。4:27 起他在岩館用測力計重現：鋼索撐住了他約 90 kg 的體重，繩子照樣鎖住。他在上面跳動、讀數到 160 kg，接著做接近係數 1 的短墜落，鋼索都沒有斷。結果沒斷，他還是想辦法不再扣錯：10:43 起，他在鋼索包上顯眼的電工膠帶，再加上每次受力前多檢查一次。片中說器材是他自己買的，說明欄沒有贊助。

```youtube
url: https://www.youtube.com/watch?v=pQFJ80d6xS0
title: Don't do THIS with the Giga Jul（Charlie Centa）
start: 154
```

Hard Is Easy 用 NEOX 五個月的長期心得。2:27 起他說繩子跑得非常順，如果你本來就用管狀的手法給繩，「去買這台」。7:42 起是完全沒握繩的測試：NEOX 比 GRIGRI 更容易滑。10:29 起他發現負重一大，NEOX 的滾輪就鎖住，收繩時跟 GRIGRI 沒有差別。0:23 起他說測試品是 Petzl 提供、可以自由評論，影片不是 Petzl 贊助；片尾有 Brilliant 業配。

```youtube
url: https://www.youtube.com/watch?v=oLB0PdEP6g4
title: Why NEOX is not a GriGri - Long Term Review（Hard Is Easy）
start: 147
```

Hard Is Easy 的 Pinch 長期心得，一開頭就說凸輪式裡 Pinch 大概是目前最好的 GRIGRI 替代品。9:43 起是三款凸輪式用管狀手法給繩的比較：細繩三台都好用；到 9.5 mm 左右 GRIGRI 開始容易卡住，Pinch 還好，NEOX 最順。19:06 起是不握繩的測試：GRIGRI 最穩、Pinch 次之、NEOX 最容易滑。Pinch 的來源沒有揭露；有 Brilliant 業配。

```youtube
url: https://www.youtube.com/watch?v=1ytFcTHETUQ
title: Edelrid Pinch - "Strange" Experiments and Long Term Review（Hard Is Easy）
start: 583
```

英國零售商 Outside 介紹新版 GRIGRI+。0:40 起先分 Petzl 三台：NEOX 給先鋒、GRIGRI 萬用、GRIGRI+ 給頂繩學習。2:24 起講頂繩模式：凸輪一直維持在輔助位置，給沒什麼經驗的確保者用很安心。5:08 起是防恐慌把手：下放時慌張拉太大力，它會自己鎖回去。這是零售商頻道。

```youtube
url: https://www.youtube.com/watch?v=b1ZgscEO0E0
title: Petzl GriGri+ VS The Original GriGri | Does it supersede it? | Review（Outside.co.uk）
start: 144
```

日本山岳醫師兼急診醫師たけちゃんねる的 NEOX 與 GRIGRI 比較，日文。0:41 起他說沒有贊助，並推薦 NEOX 給新手和從管狀轉過來的人。4:53 起講 NEOX 說明書拿掉了壓凸輪的給繩法。9:49 起他在岩館頂繩上做「完全放手」的測試，NEOX 多次沒鎖。12:41 起他說，為了安全，第一個確保器選輔助制動是合理的。

```youtube
url: https://www.youtube.com/watch?v=D2YzrH2jQdA
title: 【クライミング】NEOX VS GRIGRI その違いと注意点【Think】（【山岳医】たけちゃんねる【救急医】）
start: 41
```

中文影片裡，我們沒找到 2024 年以後、講確保器選購的影片。

## 三種情況怎麼挑

### 只在岩館

- 第一個買輔助制動。預算有限選輔助管狀：ATC Pilot、Smart 2.0，岩館粗繩多就看能用到 11 mm 的 Jul²。
- 常在岩館頂繩確保、或確保體重差很大的朋友，看 GRIGRI+。
- 不管買哪台，制動手都不離繩。學確保的方法見〈[岩館上攀確保](/posts/climbing/2026-10-17-gym-top-rope-belay)〉。

### 岩館加戶外運攀先鋒

- 凸輪式的 GRIGRI 是基準；不想學壓凸輪，看 NEOX、Pinch 或 Vergo。
- 預算有限，輔助管狀一樣能先鋒確保，先確認繩徑在範圍內。
- 先鋒確保的給繩手法照你那台的說明書練，見〈[岩館先鋒](/posts/climbing/2026-10-17-gym-lead-climbing)〉和〈[戶外確保](/posts/climbing/2026-10-17-outdoor-belay)〉。

### 之後要爬多繩距或傳攀

- 需要一個能穿兩股、有 guide mode 的管狀：ATC-Guide、Reverso，常要從上方下放跟攀者就看 Pivot。
- 想一台同時做運攀輔助制動和多繩距，看 Giga Jul，但它貴、有切換鈕，上限只到 10 mm。
- 多繩距的系統怎麼搭，見〈[多繩距入門](/posts/climbing/2026-10-17-multi-pitch-basics)〉；垂降要不要加普魯士繩備份，見〈[下放還是垂降](/posts/climbing/2026-10-17-lower-or-rappel)〉。

## 檢查與汰換重點

以 [GRIGRI 的說明書](https://www.petzl.com/sfc/servlet.shepherd/version/download/068Tx000009YCjEIAW)為例，檢查分三件事：

- **看繩子摩擦的地方**：每次使用前，檢查本體有沒有變形、裂痕、刻痕、磨損或腐蝕。也要看凸輪和制動板的狀況，以及機構裡有沒有卡沙子之類的異物。
- **每次上繩都檢查方向**：繩子裝反，鎖定和下放控制都不會作用。本體上有標示幫你確認方向，說明書要求每次使用前都做功能測試。Mike Vert [2024 年的影片](https://www.youtube.com/watch?v=O1RG2HLUHSo)從 0:45 起示範 GRIGRI 裝反時的墜落：繩子完全沒被夾住。確保前和攀爬者互檢，拉一下攀爬端，確認會鎖。
- **看認證標示**：本體上會標相容繩徑、製造年和符合的標準。標示看不清、不知道完整使用歷史的，說明書列為該退役的情況；來源不明、沒有標示的，不要拿來確保。

詳細的檢查與汰換規則，見本系列最後一篇〈[攀岩裝備怎麼檢查與汰換](/posts/climbing/2026-10-19-climbing-gear-inspection-retirement)〉。

## 練習題：四個情境

答案在每題下方，先自己想再看。

**1. 你的確保器說明書寫「適用 9–10 mm 繩」，朋友借你一條 11 mm 的粗繩。**

<details><summary>答案</summary>

UIAA 的購買建議正好用這個例子：為 9–10 mm 設計的確保器配 11 mm 繩可能無法正常運作。照說明書的範圍選繩，或換一個相容的確保器。

</details>

**2. 你剛買了一條全新、有外皮處理的 8.7 mm 繩，打算用 GRIGRI 確保朋友先鋒。**

<details><summary>答案</summary>

8.7 mm 在 GRIGRI 的相容範圍內，但不在最佳範圍（8.9–10.5 mm）。說明書寫細繩比較難握、比較難控制；全新和有外皮處理的繩也可能降低鎖定效果。這幾個條件疊在一起，要很有經驗、很警覺。如果你還在累積確保經驗，第一條繩選最佳範圍內的繩徑。

</details>

**3. 朋友說他的 ATC Pilot「會自己鎖」，所以確保時常常一手拿手機，另一手隨便扶著繩子。**

<details><summary>答案</summary>

輔助管狀鎖不鎖和確保器、制動手的位置有關。前面 Edelrid 的示範裡，輔助管狀拿錯角度時，墜落的繩子幾乎沒有制動力就從確保器跑過去。輔助是「輔助」不是「自動」，制動手要一直握在繩上、放在制動位置。請他把手機收起來。

</details>

**4. 你只在岩館爬，但半年後想跟朋友去爬多繩距。店員推薦你一台 GRIGRI。**

<details><summary>答案</summary>

GRIGRI 在岩館和運攀很好用，但只能穿一股，不能拿來從確保站上方確保跟攀者。WeighMyRack 和 JB Mountain Skills 都說，要爬多繩距，就需要一個能穿兩股、有 guide mode 的管狀。可以現在先買 GRIGRI 這類輔助制動，之後再加一個 ATC-Guide 或 Reverso；兩種都要練熟。

</details>

## 下一步

確保器要靠一個有鎖鉤環掛在吊帶上。下一篇講鉤環：確保用的 H 型、快扣用的 T 型差在哪，怎麼看鉤環上的標示。這是[第 5 篇：鉤環](/posts/climbing/2026-10-24-climbing-carabiners)。

## 延伸觀看：器材實測與教學頻道

本文嵌入的影片有幾支來自 Hard Is Easy。想自己往下挖，可以從這個頻道開始；看的時候記得它的限制。

- **[Hard Is Easy](https://www.youtube.com/@HardIsEasy)**：署名 Ben 的攀岩者獨自經營，以前是軟體工程師。一次在泰國 Tonsai 看到確保者接太硬、攀者撞上岩石，他回家設計實驗，從此專拍確保、繩子、鉤環與確保器的實驗與物理解說，近年多支在 Mammut 實驗室合拍。限制：實驗多是自己設計，不是 EN／UIAA 標準測試。

## 參考資料

原廠產品頁與價格（2026-10-24 查）見上表連結。

- [Indoor Klettern Basics（DAV，英文版，2024 年 7 月）](https://alpenverein.de/files/2409-indoor-klettern-basics-english_ol.pdf)
- [Safety standard for braking devices published（UIAA，2009-09-19）](https://www.theuiaa.org/safety-standard-for-braking-devices-published/)
- [UIAA Advice: Ten things to consider when buying climbing gear（UIAA，2026 年 2 月）](https://theuiaa.org/uiaa/uiaa-advice-ten-things-to-consider-when-buying-climbing-gear)
- [GRIGRI Technical Notice（Petzl）](https://www.petzl.com/sfc/servlet.shepherd/version/download/068Tx000009YCjEIAW)
- [Best Climbing Belay Device（OutdoorGearLab，2025-05-05）](https://www.outdoorgearlab.com/topics/climbing/best-belay-device)
- [What's the Best Belay Device With Assisted-Braking for You?（Climbing.com，2025-08-15）](https://www.climbing.com/gear/best-belay-devices-assisted-braking-by-situation/)
- [Edelrid Pinch - Better Than the GriGri? Review（UKClimbing，2025-04-21）](https://www.ukclimbing.com/gear/climbing/belays/edelrid_pinch_-_better_than_the_grigri-16333)
- [How to handle semi automatic belay devices with a thumb rest（EDELRID Knowledge Base，2025-03-13）](https://www.youtube.com/watch?v=XbPzg1NURjI)
- [Coach Nearly Kills Pro Climber – GriGri Incident Analysis（Hard Is Easy，2025-03-02）](https://www.youtube.com/watch?v=WBGkKqLhM8Y)
- [How to choose a belay device for climbing（WeighMyRack，2024-04-11）](https://www.youtube.com/watch?v=tHcQHLmBXyY)
- [What Belay Device Should You Buy First..?（JB Mountain Skills，2026-06-09）](https://www.youtube.com/watch?v=FMj1fCvnCOs)
- [Don't do THIS with the Giga Jul（Charlie Centa，2026-03-31）](https://www.youtube.com/watch?v=pQFJ80d6xS0)
- [Rock Climbing Belay Devices. Gri Gri vs. ATC（Mike Vert，2024-09-29）](https://www.youtube.com/watch?v=O1RG2HLUHSo)
- [Why NEOX is not a GriGri（Hard Is Easy，2024-06-15）](https://www.youtube.com/watch?v=oLB0PdEP6g4)
- [Edelrid Pinch - "Strange" Experiments and Long Term Review（Hard Is Easy，2025-04-13）](https://www.youtube.com/watch?v=1ytFcTHETUQ)
- [Petzl GriGri+ VS The Original GriGri（Outside.co.uk，2026-03-30）](https://www.youtube.com/watch?v=b1ZgscEO0E0)
- [NEOX VS GRIGRI その違いと注意点（たけちゃんねる，2024-07-07）](https://www.youtube.com/watch?v=D2YzrH2jQdA)
- [岩館上攀確保怎麼學](/posts/climbing/2026-10-17-gym-top-rope-belay)
- [岩館先鋒怎麼學](/posts/climbing/2026-10-17-gym-lead-climbing)
- [戶外確保：從岩館搬到岩場](/posts/climbing/2026-10-17-outdoor-belay)
