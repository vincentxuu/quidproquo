---
title: "衛星通訊器與 PLB 怎麼挑：雙向還是單向、台灣怎麼開通，以及 inReach、ZOLEO、ResQLink 等 6 款現行機型"
date: 2026-11-01
category: climbing
tags: [climbing, climbing-gear, multi-pitch, alpine-climbing, taiwan, travel]
lang: zh-TW
type: guide
description: "給要到沒有手機訊號的岩壁、高山或國外攀登的人：雙向衛星通訊器、個人定位無線電示標（PLB）、手機衛星 SOS 差在哪，深谷和樹林裡訊號會慢多少，台灣怎麼合法開通與登錄，到多洛米蒂、日本、韓國有哪些限制；附 Garmin inReach Mini 3 Plus、Mini 3、Messenger Plus、ZOLEO、ACR ResQLink 400、Ocean Signal rescueME PLB1 比較，按下 SOS 之後的流程與救援費用，以及 DC Rainmaker、HikingGuy、Meg in the Forest 等實測與真實救援影片。"
tldr: "在台灣最直接的選擇是 Garmin inReach Mini 3（NT$14,990）：先到中華電信雙證件實名拿註冊碼，再向 Garmin 訂閱，所有方案都含 SOS。iPhone 和 Pixel 的衛星 SOS 在台灣不能用，到義大利才能用。PLB 不用月費，但在台灣要燒 416 國碼、向航港局登錄；日本禁止陸上使用，韓國不允許。Backpacking Light 在深谷實測，Iridium 的 inReach 平均 1–2 分鐘送達，Globalstar 的 SPOT X 約 15 分鐘、iPhone 約 11 分鐘。台灣近年有三起 inReach 求救，從通報到接觸傷者要 14–20 小時，電要撐得過一晚。"
draft: false
series:
  name: "攀岩裝備"
  order: 12
glossary:
  - term: "PLB"
    aliases: ["個人定位無線電示標", "個人指位無線電示標", "personal locator beacon", "406 MHz 信標"]
    definition: "只做一件事的求救發報器：按下去就用 406 MHz 把求救訊號和座標送上 COSPAS-SARSAT 搜救衛星，再轉到登錄國家的任務管制中心。不用訂閱，但只能單向發送，不能傳文字。"
    context: "在台灣持有 PLB 要燒 416 國碼並向交通部航港局登錄。"
  - term: "雙向衛星通訊器"
    aliases: ["satellite messenger", "satellite communicator", "inReach", "衛星訊息機"]
    definition: "透過商用衛星網路收發文字訊息的小型裝置，多半也有 SOS 鍵、軌跡追蹤和天氣預報。要按月或按年訂閱。"
    context: "Garmin inReach 和 ZOLEO 走 Iridium（銥衛星），SPOT 走 Globalstar。"
  - term: "Garmin Response"
    aliases: ["IERCC", "GEOS", "國際緊急回應協調中心", "國際緊急應變協調中心"]
    definition: "Garmin 的 24 小時緊急應變中心。inReach 按下 SOS 後訊號先到這裡，由值班人員跟你來回傳訊確認狀況，再通知當地的救援單位。"
    context: "前身是 GEOS 經營的 IERCC，Garmin 2021 年收購；台灣的陸域求救會轉給消防署。"
  - term: "Iridium"
    aliases: ["銥衛星", "Iridium IMT", "SBD"]
    definition: "低軌道的商用通訊衛星群，多顆衛星輪流經過頭頂，沒有固定要對準的方向。"
    context: "inReach Mini 3 用舊的 SBD 短訊息平台，Mini 3 Plus 和 Messenger Plus 改用較新的 IMT，訊息較長、可傳照片和語音。"
---

> 🌏 [English version](/posts/climbing/2026-11-01-satellite-messengers-plb-en)

在龍洞，手機多半有訊號。到了中級山的斷崖下、溪谷裡，或多洛米蒂的北壁，手機可能一格都沒有。衛星通訊器和個人定位無線電示標（PLB）就是給這種時候用的：不靠基地台，直接把求救訊號和座標送上衛星，再轉到救援單位。雙向的衛星通訊器還能跟救援中心來回傳文字，告訴他們誰受傷、傷得多重、你們有沒有保暖裝備。

這篇只回答三件事：要買哪一種、哪一台，以及在台灣和國外能不能合法用。出事後現場怎麼分工、119 和 112 怎麼選，見〈[岩場急救與事故應變](/posts/climbing/2026-10-18-crag-first-aid)〉。繩索上怎麼自救，見〈[自我救援基礎](/posts/climbing/2026-10-17-self-rescue-basics)〉。多繩距和高山攀登的整體準備，見〈[多繩距入門](/posts/climbing/2026-10-17-multi-pitch-basics)〉和〈[高山攀登是什麼](/posts/climbing/2026-10-19-alpine-climbing)〉。讀完你應該能決定要雙向通訊器、PLB 還是兩個都帶，挑出一台，並知道開通和出國前要辦哪些事。

## 先分三類：雙向通訊器、PLB、手機衛星 SOS

| | 雙向衛星通訊器 | PLB | 手機直連衛星 |
|---|---|---|---|
| 代表 | Garmin inReach、ZOLEO、SPOT X | ACR ResQLink 400、Ocean Signal rescueME PLB1 | iPhone 14 以後、Pixel 9 以後 |
| 衛星網 | Iridium（inReach、ZOLEO）；Globalstar（SPOT） | COSPAS-SARSAT 搜救衛星（406 MHz） | Apple 用 Globalstar；Pixel 用 Skylo 的同步軌道衛星 |
| 能做什麼 | 雙向文字，部分機型可傳照片、語音 | 只能單向發出求救 | 可以跟救援單位互傳文字 |
| 費用 | 機器加月費 | 買斷，不用月費；電池 5–7 年要送回原廠換 | Apple 啟用後免費兩年 |
| SOS 送到哪 | 業者的 24 小時中心，再轉當地救援 | 登錄國家的任務管制中心，再轉搜救單位 | 當地緊急服務或 Apple 的轉接中心 |
| 在台灣 | inReach 合法上市 | 合法，要燒 416 國碼並登錄 | **不能用** |

Colorado 搜救單位的入門文（[Colorado SAR，2023-12 更新](https://coloradosar.org/plbs-and-satellite-messaging-devices-a-primer)）把兩種專用機的差別講得很清楚。PLB 的發射功率比衛星通訊器大約三倍，比較能穿過濃密的樹冠。但不管哪一種，窄溝、濃密樹冠和惡劣天候都可能擋住訊號，所以有些人兩種都帶。

PLB 原廠 Ocean Signal 也在 FAQ 裡建議跟 iPhone「When practical, carry both」（[Ocean Signal](https://oceansignal.com/products/rescueme-plb1/)）。加拿大國家公園的山區搜救頁說得更直接：衛星電話和信標有用，但「cannot be relied upon absolutely」。你還是要能自救，也要讓自己和繩伴撐得過等救援的時間（[Parks Canada](https://parks.canada.ca/pn-np/mtn/securiteenmontagne-mountainsafety/programme-program/res-sar.aspx)）。

今晚就能做的事：打開手機設定，查你的手機有沒有衛星 SOS 功能。有的話也記住：在台灣它不會出現。

## 六個判準

### 1. 雙向還是單向：受傷後你需要說話

PLB 按下去，救援單位只知道「這個座標有人需要幫忙」。雙向通訊器可以回答他們最想知道的事：幾個人、誰受傷、傷在哪、意識清不清楚。Garmin 的 SOS 說明寫，值班人員會先傳訊到你的裝置確認狀況，同時聯絡你登記的緊急聯絡人，問病史、人數和行程（[Garmin FAQ](https://support.garmin.com/en-US/?faq=dENvi0yoo51ib0Zh8L4El6)）。

雙向還能補上最後一段。Adventure Otaku 引述一位前海巡搜救飛行員：直升機從頭頂飛過卻沒看到人，這種事真的會發生。有 inReach，你可以傳「你剛飛過我」（[Adventure Otaku，2025](https://www.youtube.com/watch?v=uccNr93hUgA)）。

PLB 的好處在另一邊：不用訂閱、不會因為忘了續約就失效，而且直接進政府的搜救系統。

今晚就能做的事：想像你的繩伴在第三段摔斷腿。寫下你要讓救援知道的三件事，再看看你現在的裝備能不能把這三件事送出去。

### 2. 衛星網路：深谷和樹林裡差很多

岩壁正下方、溪谷、北壁這些地方，天空只剩一條縫。Backpacking Light 在 170 次並排測試裡量了送達時間（[BPL，測試表 2024-11 更新](https://backpackinglight.com/gear-guide-satellite-messaging-devices-messengers)）：

| 環境 | Messenger Plus | inReach Mini 2 | ZOLEO | SPOT X | iPhone 14 |
|---|---|---|---|---|---|
| 開闊天空，平均送達 | 38 秒 | 37 秒 | 41 秒 | 164 秒 | 141 秒 |
| 濃密樹林，平均送達 | 85 秒 | 94 秒 | 112 秒 | 382 秒 | 294 秒 |
| 深山谷，平均送達 | 91 秒 | 73 秒 | 135 秒 | 873 秒 | 649 秒 |
| 深山谷，失敗率 | 0% | 1% | 4% | 21% | 18% |

差別來自衛星網。BPL 的解釋是 Globalstar 衛星之間沒有互相轉送，要正好同時看得到地面站才傳得出去，所以在山區常延遲好幾分鐘、失敗也多得多。Iridium 是低軌、多顆衛星輪流經過，inReach 和 ZOLEO 都走這個網。

手機的情況更麻煩。Apple 說理想狀況要 30 秒以上，樹林裡可能要好幾分鐘，濃密樹葉、山丘、峽谷都可能擋住連線（[Apple](https://support.apple.com/en-us/105097)）。Pixel 用的是固定位置的同步軌道衛星，Google 要你轉向、傾斜手機去對準它（[Google](https://support.google.com/pixelphone/answer/15254448?hl=en)）。北半球的同步衛星在南方天空，我推測北壁和朝北的深谷對 Pixel 特別不利。Outdoor Life 2024 年在深峽谷測 iPhone 的衛星訊息，70 分鐘後才送達，畫面上完全沒有顯示延遲（[Outdoor Life](https://www.outdoorlife.com/gear/testing-the-iphone-satellite-mesenger)）；那是訊息功能，不是 SOS。

專用機也不是萬能：HikingGuy 在窄峽谷裡，兩支手機和 inReach Mini 2 全部送不出去（影片見後面）。能移到開闊處就先移。垂直岩壁正下方、煙囪地形的公開實測目前沒有，深谷的數字是最接近的參考。

今晚就能做的事：想一條你常去、兩側有高牆的路線。標出最近的開闊點（稜線、確保站、谷口），出事時那裡就是你發訊的地方。

### 3. 電池與低溫：救援是以「天」計的

台灣近年有三起 inReach 求救，從通報到接觸傷者要 14–20 小時（見後面的案例表）。Meg in the Forest 替朋友按了 SOS，她的 inReach Mini 在等救援時電池用光兩次（[Meg in the Forest，2025](https://www.youtube.com/watch?v=pmV3dEgBLMA)）。SOS 期間追蹤會被強制開啟、電源鍵失效，很耗電。所以行動電源要帶。

低溫的部分，這幾款的操作溫度下限多半是 −20 °C。

要注意的是充電。Garmin 寫冰點以下只能慢充，ZOLEO 冰點以下不能充。

實際用起來，Treeline 整個冬天把 Mini 3 Plus 掛在背包外側滑雪、健行，寫「Cold did not slow down the unit's ability to function and battery drain was minimal」（[Treeline Review，2026](https://www.treelinereview.com/gearreviews/garmin-inreach-mini-3-plus-review)）。

PLB 的電池是一次性的，不能自己換，到期或用過一次就要送回原廠（年限見後面的型號表）。

今晚就能做的事：把你的行動電源和通訊器的充電線放在同一個收納袋，出門前一起拿。

### 4. 訂閱：不用時怎麼辦

| | 月費 | 不用時 |
|---|---|---|
| Garmin inReach（美國方案） | US$7.99–49.99，啟用費 US$39.99 | 可暫停；Garmin 寫部分機型暫停期間仍能發 SOS |
| Garmin inReach（台灣方案） | 基本／安心／標準／高階四種，啟用費 TWD 1,310 | 所有方案都含 SOS |
| ZOLEO | US$19.99／34.99，最短 3 個月 | 暫停期間**不能**發 SOS |
| SPOT | 年約每月 US$11.95 起 | — |
| PLB | 不用 | 不用；ACR 寫信標登錄效期 2 年 |

Garmin 的 FAQ 寫「Select Garmin devices maintain SOS capability even when service is suspended」，但沒有列出是哪些機型，買之前要問清楚（[Garmin FAQ](https://support.garmin.com/en-US/?faq=dENvi0yoo51ib0Zh8L4El6)）。ZOLEO 方案頁則寫暫停期間「you cannot send messages, check-ins, or SOS alerts」（[ZOLEO](https://www.zoleo.com/en-us/plans)）。

HikingGuy 用美國價格算過一台 PLB 電池效期內的成本。特價的 inReach Mini 2 加啟用費，每年只開一個月最便宜的方案，總花費還比一台 rescueME PLB1 低一點（[HikingGuy，2026](https://www.youtube.com/watch?v=l32PzWZmJE8)）。這是美國方案的算法，台灣方案的價格不同。

今晚就能做的事：把你一年真的會去沒訊號地方的月份圈出來。只有兩三個月的話，算一下暫停和最低方案的組合。

### 5. 帶在哪裡：兩派說法

原廠和嚮導都沒有寫過攀岩時的掛法，只有兩派理由：

- **放背包裡**：Alpine Savvy 2022 年寫，他問過的嚮導和搜救人員都說放包內或口袋，「never on the backpack strap」，因為掛外面容易被扯掉、撞壞（[Alpine Savvy](https://alpinesavvy.com/blog/where-do-you-carry-your-satcom-device)）。
- **放身上**：墜落時可能連包一起掉。LA Times 報導一位在 Sierra 獨攀墜落的攀岩者「lost her backpack」，但還是用 inReach 發出了 SOS，報導沒寫裝置掛在哪（[LA Times，2025](https://www.latimes.com/california/story/2025-07-08/after-climber-survives-gruesome-injury-in-sierras-it-takes-five-helicopters-to-rescue-her)）。

天線方向也有關係。Garmin 手冊要你讓天線朝向天空；Mini 3 Plus 是外露的螺旋天線，Messenger Plus 是較大的貼片天線，對角度比較寬容（[Justin Outdoors，2026](https://www.youtube.com/watch?v=XTvS2lIFZEE)）。

放在背包裡，墜落後就可能拿不到。所以多繩距時，本文建議放在身上的口袋，或用短繩加有鎖鉤環接在吊帶後方的裝備環。這是從「墜落後還拿得到」推出來的，沒找到原廠或嚮導的書面建議。

另一個常見的狀況是根本沒帶。AAC 2024 年的事故報告收錄了 Ines Papert 在加拿大 BC 的事故：她忘了帶 Garmin，最後靠繩伴的 iPhone 衛星 SOS 獲救。她事後說「I was kicking myself for not bringing an inReach」（[AAC，2024](https://publications.americanalpineclub.org/articles/13201217213)）。

今晚就能做的事：把通訊器掛在你平常放的位置，做一次「背包掉下去」的想像：它還在你身上嗎？

### 6. 你要去的地方能不能用

台灣、義大利、日本、韓國的規定都不一樣，PLB 在有些國家陸上根本不能用。下面兩節分開講。

## 在台灣：合法性、開通、登錄

### inReach：中華電信實名加 Garmin 訂閱

inReach 在台灣是合法上市的，中華電信的專頁列有 Mini 2 的 NCC 字號（[中華電信](https://www.cht.com.tw/home/campaign/garMINInpromo)）。開通分兩步：

1. 帶雙證件到中華電信做實名認證，拿衛星服務註冊碼。中華電信寫，這一步是因為「電信服務必須落實實名制」，這部分的基本服務免費。
2. 到 Garmin Explore 填註冊碼、選方案啟用（[Garmin 台灣方案頁](https://www.garmin.com.tw/products/subscription-plans/inreach-subscription-consumer-enabled/)）。

中華電信也寫，銥衛星在台灣「並不能提供通話服務」，只在 SBD 平台上提供簡訊。

Garmin 台灣目前賣的是 Mini 3，NT$14,990（[Garmin 台灣](https://www.garmin.com.tw/products/outdoor/inreach-mini-3/)）。它的 NCC 字號沒有印在台灣產品頁和中文手冊上。想自己確認，可以到 NCC 的[型式認證查詢](https://nccmember.ncc.gov.tw/etrade2/QRY/QRY02)用原廠型號 A04998 查，或問 Garmin 台灣客服。

Garmin 台灣的原廠教學影片把開通流程和 SOS 操作講了一遍。8:40 起講 SOS：按下後有一段倒數，期間按任一鍵可以取消，通知會送到全天待命的 IERCC。片中也提醒，沒有有效訂閱時主畫面會顯示「未啟動」，訊息、追蹤、SOS 都不能用。這是原廠頻道，只當中文操作說明看。

```youtube
url: https://www.youtube.com/watch?v=4AUmh3iOLz4
title: 【教學】inReach Mini 3：衛星通訊、開通流程、SOS 求救完整教學（Garmin Taiwan）
start: 520
```

### 自己從國外買、或用國外帳號訂閱

這部分法條有寫，但 NCC 沒有公開解釋，所以只能說到法條為止。

- [電信管制射頻器材製造輸入及申報作業管理辦法](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=K0060146)第 9 條第 1 項第 6 款，是自用器材免核准證的通道，但明文排除「行動衛星地球電臺」。
- 同辦法第 16 條：外國旅客輸入自用的行動衛星地球電臺，可以免進口核准證，限一部。
- NCC 沒有公開解釋的有三件事：手持的 Iridium、Globalstar 訊息機算不算「行動衛星地球電臺」；本國人自己帶一部回來要怎麼辦；沒經中華電信實名的國外訂閱，在台灣用算不算違法。要確定只能寫信問 NCC。
- ZOLEO 和 SPOT 在台灣沒有代理。

Garmin 台灣的方案頁自己也提醒：部分司法管轄區管制或禁止使用衛星通訊設備，使用者要自己了解並遵守當地的法律。

### PLB：燒 416 國碼、向航港局登錄

PLB 在台灣陸、海、空都可以用（[COSPAS-SARSAT 各國規定](http://cospas-sarsat.int/en/beacon-ownership/national-beacon-regulations-for-plbs)），但有兩道手續。前述辦法第 29 條要求持有者向交通部航港局登錄；航港局 2025 年的〈個人定位無線電示標登錄作業管理規範〉寫（[行政院公報](https://gazette.nat.gov.tw/EG_FileManager/eguploadpub/eg031191/ch06/type2/gov50/num16/Eg.htm)）：

> 持有者購買PLB時須先向廠商確認該PLB已燒錄416國碼，可於國內辦理PLB登錄；非416國碼者，應請廠商重新燒錄。

也就是說，網購的美國版、英國版 PLB 要先請廠商重新燒錄國碼。登錄在[航港局無線電示標平台](https://beaconregistration.mtnet.gov.tw/RadioBeacon/index.do)，航港局會在七個工作日內送進國際信標資料庫（IBRD）。

在台灣按下 PLB，訊號由臺北任務管制中心（TAMCC）接收，它設在民航局；航港局的說明寫維運「將委由」中華搜救協會辦理，現在是否已委託沒有寫明（[航港局](https://www.motcmpb.gov.tw/Article?nodeId=357&siteId=1)）；確認不是誤發後通報搜救單位。在國外按，由當地附近的任務管制中心接收，TAMCC 也會收到。誤觸要立刻打 02-2701-3400 取消。

### 手機衛星 SOS：台灣不在名單上

Apple 的「透過衛星傳送的 SOS 緊急服務」支援國家名單沒有台灣（[Apple 台灣](https://support.apple.com/zh-tw/101573)），Pixel 也沒有。台灣的電信商目前只有合作備忘錄，例如台灣大 2026 年 3 月和 AST SpaceMobile 簽的備忘錄（[台灣大](https://corp.taiwanmobile.com/press-release/news/press_20260302_441365.html)），還沒有開通。

### 按下 inReach SOS 之後，台灣怎麼轉

中華電信的說明是 IERCC「第一時間通知國內救援單位：陸域為消防署；海域為海巡署」。消防署 2025 年 4 月的貼文寫得更細。救災救護指揮中心接到 Garmin IERCC 通報後，先聯繫使用者登記的地面聯絡人，再通報空勤總隊和臺中市消防局（[消防署 Threads](https://www.threads.com/@nfa_taiwan/post/DILdAXqpQa7)）。也有先落到某個縣市消防局再轉轄區的例子。

2024 年以後的公開案例：

| 日期 | 地點 | 經過 | 多久接觸到人 |
|---|---|---|---|
| 2024-03 | 宜蘭安平坑林道 | inReach 發 SOS | 搜索 14 小時後找到（[宜蘭縣消防局](https://fire.e-land.gov.tw/News_Content.aspx?n=6055&s=230335)） |
| 2025-01 | 苗栗佳仁山 | inReach 發 SOS | 隔天空勤救出（[前進新聞網轉述消防署](https://twvanguard.com/%E7%94%9F%E6%B4%BB%E8%B3%87%E8%A8%8A/17108)） |
| 2025-04 | 臺中九仙山 | inReach 發 SOS，持續跟地面聯絡人傳訊 | 約 20 小時；消防署說是當年第 4 件（[消防署](https://www.threads.com/@nfa_taiwan/post/DILdAXqpQa7)） |
| 2025-06 | 南投干卓萬栗栖溪 | 溪谷暴漲受困，「無法撥打112」，改按 inReach | 凌晨 2:21 員警抵達，用繩索協助脫困（[新竹縣消防局轉載](https://fire.hsinchu.gov.tw/cht/index.php?article_id=40448&code=list&flag=detail&ids=14)） |
| 2026-01 | 新竹品田山斷崖 | 獨攀者發 SOS | 約 16.5 小時（[新竹縣政府](https://information.hsinchu.gov.tw/News_Content.aspx?n=2203&s=278988&sms=8603)） |
| 2026-08 | 南湖、奇萊北壁 | **沒有人按 SOS**，inReach 追蹤訊號中斷，家屬和留守人發現後報案 | 南湖當天找到；奇萊約 1.5 天（[聯合報](https://udn.com/news/story/7320/9670069)） |

最後一列值得多看一眼：沒有按 SOS，是「追蹤加留守人」把人找回來的。

## 出國：多洛米蒂與阿爾卑斯、日本、韓國

### 義大利（多洛米蒂）

- **先打 112。** CAI 的說明是撥 112 進單一應答中心，醫療轉 118，山區再轉 Soccorso Alpino。而且「la chiamata è gratuita e può essere effettuata anche qualora il telefono non abbia una SIM」，不用 SIM 卡也能打（[CAI《Lo Scarpone》，2025](https://loscarpone.cai.it/dettaglio/chiamate-di-emergenza-quando-e-come-attivare-i-soccorsi-in-montagna)）。CAI 也提醒，112 還沒推廣到每個大區，沒設的地方醫療緊急打 118。
- **iPhone 在義大利能用衛星 SOS。** 台灣買的 iPhone 到義大利可以用，排除名單只有亞美尼亞、白俄羅斯、中國大陸等幾國（[Apple](https://support.apple.com/en-us/101573)）。Apple 的轉接中心支援義大利文和日文，沒有中文，要用英文。Pixel 在義大利也可以用。
- **衛星 SOS 還是 112？** 兩者要先用哪個，歐洲官方沒有直接的說法。本文的建議是：有手機訊號就先撥 112，語音直接連當地派遣；沒有訊號才按衛星 SOS，訊息會經過 Garmin Response 中心再轉給當地救援。Apple 自己的指引也是「First, try calling the local emergency number」。
- **GeoResQ。** 義大利山岳救援隊 CNSAS 經營、CAI 推廣的求救 app，要靠手機網路。費用說法互相衝突：CAI 2023 年寫從那天起所有人免費（[CAI](https://cai.it/news/2023/07/georesq-lapp-per-il-soccorso-in-montagna-diventa-gratuita-per-tutti)），CNSAS 英文頁仍寫付費、CAI 會員半價（[CNSAS](https://cnsas.it/en/georesq)）。
- **SOS EU ALP。** DAV 寫這個 app 用在巴伐利亞、奧地利和南提洛（[DAV，2025](https://www.alpenverein.de/artikel/notruf-und-rettung-in-den-alpen_3802c636-0bd1-4f83-a33a-e9b266bd51d8)）。多洛米蒂有一部分在南提洛（波札諾省），Cortina 則在威尼托，哪個 app 能用，要看你在哪一省。
- **PLB 在義大利可以用。** COSPAS-SARSAT 的國家規定頁把義大利列為陸海空都可用。義大利衛星站的問答寫，信標「must be registered with the Italian Satellite Station Cospas-Sarsat in Bari」，講的是義大利國碼的信標；外國旅客帶去的信標要不要另外登錄，沒有寫（[Cospas-Sarsat Italy](https://cospas-sarsat-italy.it/en/questions-and-answers)）。
- **救援費用。** 威尼托對岩壁、冰攀受傷的人就算住院也收費，細節見〈[義大利岩場總覽](/posts/climbing/2026-10-18-italy-crags-overview)〉。要爬〈[Tre Cime](/posts/climbing/2026-10-19-italy-crag-tre-cime)〉這類北壁，出發前確認保險有沒有涵蓋山區救援。

### 瑞士、奧地利

- 瑞士 Rega 的現行 FAQ 寫，可以把 alarm@rega.ch 存進 inReach，傳訊時會附上位置，Rega 可以直接回覆。但這只在瑞士和邊境附近有效，出了國就按 SOS 鍵（[Rega](https://rega.ch/en/about-us/contact/emergency-numbers)）。所以在多洛米蒂用不上。
- 奧地利和瑞士的 PLB 陸上警報會轉給警察，COSPAS-SARSAT 的國家規定頁寫「Appropriate SAR action cannot be guaranteed」，手機或衛星電話比較適合。
- Rega 直升機任務平均約 4,500 瑞郎，原則上由被救的人或保險付（[Rega](https://rega.ch/en/rega-patron/become-a-patron/questions-and-answers-on-the-subject-of-patronage-and-donations)）。下奧地利與維也納的山岳救援 2026 年起，標準編組每小時 €612，就算最後是直升機救出也照收（[Bergrettung NÖ/W](https://bergrettung-nw.at/wp-content/uploads/sites/2/2026/02/20260128_Informationsblatt-Einsatzverrechnung-2026_Umsatzsteuer-u-Erhoehung-auf-36-Euro_ENG.pdf)）。

### 日本

- **PLB 不能在陸上用。** COSPAS-SARSAT 規定頁寫日本「Land activations are prohibited and subject to penalty by radio law」。去〈[日本岩場](/posts/climbing/2026-10-12-japan-crags-overview)〉爬，PLB 留在家。
- iPhone 衛星 SOS 在日本可以用，Pixel 不行。
- inReach 在日本按 SOS，據ヤマレコ的影片，Garmin 應答中心會用英文或日文跟你確認，判定要救援才轉給日本警察（影片見後面）。

### 韓國

- **PLB 陸、海、空都不允許。**
- iPhone 和 Pixel 的衛星 SOS 名單都沒有韓國。
- 剩下的選項是雙向通訊器。Garmin 手冊提醒有些地區管制衛星通訊設備，去〈[韓國岩場](/posts/climbing/2026-10-21-korea-crags-overview)〉之前先問清楚當地規定。

今晚就能做的事：把你下一趟要去的國家寫下來，對照上面三項（PLB、手機衛星 SOS、當地緊急電話），把能用的那幾個號碼存進手機。

## 六款現行機型

只收 2026-11-01 原廠還在賣的機型。價格是當天原廠標價，幣別照原廠。

| 型號 | 類型／網路 | 重量 | 電池 | 防水 | 訊息 | 機身價 | 適合誰／缺點 |
|---|---|---|---|---|---|---|---|
| [Garmin inReach Mini 3 Plus](https://www.garmin.com/en-US/p/1756582) | 雙向／Iridium IMT | 125.2 g | 效能模式、每 10 分鐘一則約 95 小時；10 分鐘追蹤約 350 小時 | IP67 | 1,600 字、30 秒語音、照片（透過 app） | US$499.99 | 手機不一定在身上、要直接在機器上打字傳語音的多繩距和高山攀登者；貴，同樣效能模式下電池比 Messenger Plus 短 |
| [Garmin inReach Mini 3](https://www.garmin.com.tw/products/outdoor/inreach-mini-3/) | 雙向／Iridium SBD | 122.2 g | 10 分鐘追蹤約 350 小時 | IP67 | 160 字 | NT$14,990（Garmin 台灣）；US$449.99 | 台灣最容易買到、只要 SOS 和報平安的人；訊息短，沒有語音和照片，也沒附 Plus 有的扣環 |
| [Garmin inReach Messenger Plus](https://www.garmin.com/en-US/p/1191310) | 雙向／Iridium IMT | 117.2 g | 效能模式、每 10 分鐘一則約 110 小時；低耗電加 10 分鐘追蹤約 600 小時 | IPX7 | 1,600 字、語音、照片 | US$399.99（查價當天特價 US$299.99） | 主要用手機打字、重視電池的人，可反向替手機充電；機身螢幕小、只有按鍵，手機壞了就難操作 |
| [ZOLEO](https://www.zoleo.com/en-us/satellite-communicator) | 雙向／Iridium | 150 g | 200 小時以上 | IP68 | 文字，全靠手機 app | US$199.00（[官網](https://www.zoleo.com/en-us/product/zoleo-global-satellite-communicator)，價格常變動） | 預算有限、出國用；沒有螢幕，暫停訂閱就不能 SOS，台灣沒有代理 |
| [ACR ResQLink 400](https://www.acrartex.com/products/resqlink-400/) | PLB／406 MHz | 144 g | 連續 24 小時以上；5 年或用過就換 | 5 m／1 小時，可浮 | 只有 SOS | US$409.95 | 不想付月費、只要最後手段的人；單向，電池要送回原廠換，在台灣要找人燒 416 碼 |
| [Ocean Signal rescueME PLB1](https://oceansignal.com/us/products/plb1-personal-locator-beacon) | PLB／406 MHz | 約 116 g | 24 小時以上；7 年換電池 | 15 m | 只有 SOS | £309.95（英國官網） | 要最輕的 PLB，原廠稱「The world's smallest PLB」；只用 GPS 定位，沒有浮袋就不會浮，其他同上 |

幾個要知道的細節：

- **重量說法不一。** Mini 3 Plus 原廠寫 125.2 g，Treeline 的推薦清單寫「3.5 ounces」（約 99 g），Treeline 自己的單品評測又寫 4.5 oz。rescueME PLB1 則是美國產品頁和手冊差 1 g。
- **Mini 3 Plus 曾連續幾小時送不出訊息。** DC Rainmaker 2025 年 12 月的長篇評測寫，一次長程健行中 Mini 3 Plus 好幾個小時送不出衛星訊息。同時帶的 Mini 2 正常，只有重開機才恢復（[DC Rainmaker](https://www.dcrainmaker.com/2025/12/garmin-inreach-mini-3-3-plus-in-depth-review-upgrade.html)）。Garmin 告訴他原因是：配對的手機沒有網路時，裝置可能不改走衛星。Garmin 的韌體更新紀錄裡，v5.03（2026-02-10）寫「Fixed possible issue where messages could fail to send」（[Garmin](https://support.garmin.com/en-US/?faq=eyVr0c3POoA4fSAeHYsQy6)）；時間和描述都對得上，但 Garmin 沒有說就是這一個問題。出發前更新韌體，等很久送不出去就重開機。
- **中文訊息比原廠寫的短很多。** 據ヤマレコ的影片，非 Plus 機型一則訊息的上限是 160 位元組，英文剛好 160 字；中文、日文一個字占 3 位元組，只剩約 53 字。原廠寫的「160 characters」指的是英文字元，Plus 機型的上限則大十倍。
- **評選結果不一致。** Backpacker 把 Messenger Plus 列為整體最愛，Mini 3 Plus 列為不靠手機時的首選（[Backpacker](https://www.backpacker.com/gear/outdoor-electronics/best-satellite-communicators)）。Switchback 把 Mini 3 Plus 列為整體最佳、ZOLEO 列為預算款，但也說 Mini 3 Plus「long-term durability in harsh conditions is still an open question」（[Switchback Travel](https://www.switchbacktravel.com/backpacking/best-satellite-messengers)）。BPL 實測裡，Messenger Plus 在樹林和深谷都沒有失敗（見判準 2）。
- **Treeline 的 PLB 段落**同時列了 ResQLink 400 和 rescueME PLB1，但把後者的品牌標成 ACR，實際是 Ocean Signal（[Treeline Review](https://www.treelinereview.com/gearreviews/best-personal-locator-beacons)）。

### 備註款與不收的

- **[SPOT X](https://www.findmespot.com/en-us/products-services/spot-x) 與 [SPOT Gen4](https://www.findmespot.com/en-us/products-services/spot-gen4)**（Globalstar）：SPOT X 是雙向機，US$249.99；Gen4 是單向機，US$149.99。BPL 實測 SPOT X 在深谷平均約 15 分鐘才送達；Outdoor Life 在峽谷測 Gen4，兩則訊息都延遲約 10 分鐘。攀岩的地形對 Globalstar 不利，不推薦。SPOT X 的涵蓋圖上台灣和日韓同一個顏色，但圖沒說明顏色代表哪一級；台灣也沒有代理。
- **[ACR ResQLink View](https://www.acrartex.com/products/resqlink-view/)**：US$469.95，多一個數字螢幕，運作 28 小時，其他同 400。
- **rescueME PLB3**：有 AIS 和回傳確認，但設計給救生衣用，攀岩不需要。
- **Motorola Defy Satellite Link 不收**：廠商 Bullitt 2024 年 1 月倒閉，已經不賣了。

## 手機衛星 SOS：不是型號，但要知道它的極限

- **在台灣不能用**（見前面）。到義大利、日本可以。
- **要手動對準，峽谷和樹林會慢。** 見判準 2 和後面 Chase the Summit、HikingGuy 的影片。
- **來源有衝突。** AAC 那篇 Papert 事故報告寫 iPhone 衛星 SOS 不能直接跟搜救對話，只能傳一則 40 字的訊息給一位緊急聯絡人；這和 Apple 官方說的可以跟緊急服務互傳文字不一樣。
- **T-Mobile T-Satellite**（Starlink 直連手機）在美國開闊天空下 5–10 秒就能送出（Backpacker 實測）。在美國境內，不是 T-Mobile 客戶也能單獨訂；出國要有 T-Mobile 的合格方案、且住在美國，T-Mobile 國際漫遊頁寫的範圍是美國、加拿大、紐西蘭和日本，台灣和歐洲都不行（[T-Mobile](https://www.t-mobile.com/cell-phone-plans/international-roaming-plans)）。HikingGuy 用了幾個月，結論是照樣帶 inReach、掛最便宜的方案只留 SOS（[HikingGuy，2026](https://www.youtube.com/watch?v=_zqiT5RX3SA)）。
- 日本有 au Starlink Direct 和長野縣警的三方實證實驗，ヤマレコ 2025 年的影片講了流程，但目前只是實驗（[ヤマレコ，2025](https://www.youtube.com/watch?v=aeW7i5jFp7Y)）。

## 實測與心得影片

只收 2024 年以後、講到具體機型或真實救援的影片，起播時間都對過字幕。HikingGuy.com 幾乎每款都測過，下面盡量配其他頻道平衡。攀岩頻道近兩年沒有拍這類裝置，攀岩時怎麼掛也沒有專門影片。

### 機型評測

**Mini 3 和 Mini 3 Plus 的長篇評測。** DC Rainmaker 從 9:22 開始講 SOS：鍵在硬塑膠蓋下，掀蓋長按才觸發，他認為 Essential 或 Standard 方案就夠。18:55 起講前面提過的送不出訊息：約 8 小時健行的前 3 小時，強制重開機才恢復。說明欄寫 Mini 3 Plus 自購、基本款是借的，附 Amazon 聯盟連結。

```youtube
url: https://www.youtube.com/watch?v=il3Q104Hq3A
title: Garmin inReach Mini 3 & 3 Plus In-Depth Review: 37 Things to Know!（DC Rainmaker）
start: 562
```

**用了半年之後。** HikingGuy 從 6:28 開始講電池：省電模式加 10 分鐘追蹤，實際拿到 130–300 小時，達不到原廠的 350 小時，差別主要看頭上有沒有樹。12:00 起講他為什麼有手機衛星還是帶專用機：救援常拖幾小時到幾天，手機電量以小時計，inReach 以天計。說明欄寫「Tested & Not Sponsored」，附聯盟連結。

```youtube
url: https://www.youtube.com/watch?v=ZtwOCMDGqUU
title: Garmin inReach Mini 3 Plus: 6 Months Later（HikingGuy.com）
start: 388
```

**Mini 3 Plus 還是 Messenger Plus。** Justin Outdoors 在加拿大洛磯山實測，3:02 起講電池：不開追蹤時，Mini 3 Plus 效能模式約 4 天，Messenger Plus 約 7 天。6:14 起講天線：Mini 3 Plus 的外露螺旋天線要朝天，Messenger Plus 的貼片天線放在背包或帳篷裡收發比較快。他會選 Messenger Plus，除非不帶手機。說明欄有聯盟連結。

```youtube
url: https://www.youtube.com/watch?v=XTvS2lIFZEE
title: Battle of the SOS Devices - InReach Mini 3 Plus vs Messenger Plus（Justin Outdoors）
start: 182
```

**ZOLEO 新款。** HikingGuy 從 2:48 開始講：雙向通訊完全靠手機 app，機身只有 SOS、報到鍵和燈號。5:31 起講訂閱：SOS 也要有訂閱才能用，最短 3 個月。6:37 起講電池：原廠宣稱 200 小時以上，他實際約 190 小時，開 12 分鐘位置分享掉到約 80 小時。說明欄寫「Not Sponsored」，附 REI 聯盟連結。

```youtube
url: https://www.youtube.com/watch?v=GKTBqqf4ag4
title: inReach Rival? The New ZOLEO, Trail Tested（HikingGuy.com）
start: 168
```

### 手機衛星和專用機在峽谷、樹林

**這個主題最有用的一支。** HikingGuy 在聖地牙哥的峽谷比 Pixel 9、iPhone 和 inReach Mini 2。5:16 起是峽谷口，兩側高牆：Pixel 9 送得出去，iPhone 要繞來繞去找衛星。6:44 起進到窄峽谷：兩支手機拿不到 GPS 定位就不發 SOS，Mini 2 等了約 10 分鐘也送不出去。說明欄寫「Not Sponsored」，附聯盟連結。

```youtube
url: https://www.youtube.com/watch?v=fkBdII0Ideg
title: Pixel 9 Satellite SOS vs iPhone vs inReach（HikingGuy.com）
start: 316
```

**樹林下的 iPhone 和 inReach。** Chase the Summit 從 7:24 開始在高大樹林下測：iPhone 中途要轉身換衛星，約 3–4 分鐘才送出，還重複送了兩次。12:01 起是 inReach Messenger，不必對準，約 20–25 秒送達。說明欄寫明是聯盟連結。

```youtube
url: https://www.youtube.com/watch?v=l0KpggA1Shw
title: Real Life Test: Apple Satellite Messaging vs Garmin InReach!（Chase the Summit）
start: 444
```

### 真實按下 SOS

**Wind River 的一次救援。** Meg in the Forest 從 0:17 開始講她在 Wind River 山脈、離開步道的岩石埡口替同伴按 SOS 的經過。0:36 起講操作：掀蓋長按約 4 秒，大聲蜂鳴、20 秒倒數，接著自動送出位置；SOS 期間追蹤強制開啟、電源鍵失效。2:37 起講她的經驗：給 Garmin Response 的訊息比給任何人的都快，而且不計費。直升機第一次降不下來，最後花了 20 小時。她在同一次救援的心得版裡補充：Garmin 只把進度告訴登記的緊急聯絡人，她說先生沒登記所以問不到（同一支影片稍後又稱他是緊急聯絡人，前後說法不一致）；出發前要檢查聯絡人和醫療備註（[4:21 起](https://www.youtube.com/watch?v=pmV3dEgBLMA&t=261s)）。說明欄寫明不收贊助，附聯盟連結。

```youtube
url: https://www.youtube.com/watch?v=zW-degk5bOA
title: What Happens When You Push the SOS Button on Your Garmin InReach Mini（Meg in the Forest）
start: 17
```

### PLB 還是衛星通訊器

**暫停方案保留 SOS 之後，PLB 還值得嗎。** HikingGuy 從 0:52 開始講 Garmin 的改變：暫停狀態下仍能用 SOS。1:10 起用美國價格算 7 年成本。4:06 起講 PLB 的優勢：發射功率較高、較能穿樹冠，而且直接連政府搜救系統。說明欄寫「Not Sponsored」，附聯盟連結。

```youtube
url: https://www.youtube.com/watch?v=l32PzWZmJE8
title: Garmin inReach: Did This SOS Update Kill the PLB?（HikingGuy.com）
start: 52
```

**PLB 使用者的後悔。** Adventure Otaku 用的是 2022 年自購的 ACR ResQLink。1:18 起講 PLB 的好處：沒有訂閱，買了登錄、定期看電池效期。5:10 起講缺點：救援不知道發生什麼事；換電池要寄回原廠或授權中心。7:15 起是前面提過的「直升機飛過頭頂」。說明欄沒有揭露贊助，但有聯盟連結（含 ACR ResQLink）。

```youtube
url: https://www.youtube.com/watch?v=uccNr93hUgA
title: PLB vs Inreach - Did I make a mistake?（Adventure Otaku）
start: 78
```

### 日文

**中日文訊息長度與日本的救援流程。** ヤマレコ社長的頻道從 5:06 開始講：160 位元組在英文是 160 字，日文、中文一字占 3 位元組，只剩約 53 字。19:39 起講按下 SOS 後，Garmin 應答中心用英文或日文確認，判定要救援才轉日本警察。23:29 起說誤按但已經啟動應對的，可能被收每小時 US$340 以內的費用。字幕裡自述不是 Garmin 業配；ヤマレコ自己經營登山 app。

```youtube
url: https://www.youtube.com/watch?v=1NnOmP0IJYk
title: 【世界で使える最強のSOSサービス】Garmin inReachについて徹底解説！（ヤマレコ社長の絶対遭難させないチャンネル）
start: 306
```

中文影片只有 Garmin Taiwan 的原廠教學（前面已嵌入），沒有台灣攀岩者 2024 年以後的實測。

## 按下 SOS 之後

### 流程

Garmin inReach 的流程（[Garmin FAQ](https://support.garmin.com/en-US/?faq=dENvi0yoo51ib0Zh8L4El6)、[Mini 3 手冊](https://www8.garmin.com/manuals/webhelp/GUID-F31CF821-79A9-46E5-A45B-8765F918488F/EN-US/inReach_Mini_3_OM_EN-US.pdf)）：

1. 掀開 SOS 蓋、長按，倒數結束後自動送出。關機狀態也能按，只要有電。
2. 前 10 分鐘每分鐘回報一次位置，之後每 10 分鐘一次。
3. Garmin Response 傳訊到你的裝置問狀況，同時聯絡你的緊急聯絡人。
4. 中心通知當地最適合的救援單位。你沒回覆也會派人：「Rescuers will be dispatched even if they cannot reach you via your device」。

Garmin 2025 年的 SOS 年報說，那年收到超過 3,000 件求救，其中超過 12% 最後自行脫困（[Garmin 新聞稿](https://finance.yahoo.com/news/garmin-releases-annual-inreach-sos-120100013.html)）。HikingGuy 解讀 Garmin 2023 年報告的影片也說，不確定要不要按時，可以先按、用訊息跟 Garmin Response 討論（[HikingGuy，2024](https://www.youtube.com/watch?v=BubPk8T2fO8)）。

### 要準備回答的問題

Garmin 會問狀況、病史、人數、行程；加拿大國家公園的派遣員會問性別、年齡、姓名、位置和傷勢。先把答案想好：

- 誰受傷、傷在哪、意識清不清楚
- 一共幾個人、其他人的狀況
- 確切位置：路線名稱、第幾段、在確保站還是吊在繩上
- 有沒有保暖裝備

### 誤觸與取消

- **Garmin**：長按 SOS 鍵 → Cancel SOS → 確認，等收到確認訊息。取消之後 Garmin Response 就不能再跟你的裝置聯絡。倒數時間 Garmin 美國手持機 FAQ 寫 20 秒，挪威區（nb-NO）頁面寫 30 秒，以你手上的機器為準。
- **不要拿 SOS 測試。** Garmin 寫「Never trigger an SOS to test your device. Unapproved testing may result in unnecessary dispatch and financial penalties」。要測要先預約。
- **rescueME PLB1**：啟動後約 50 秒才真的發射，這段時間可以取消。誤觸要打電話給當地緊急服務，報 15 碼的 HEX 識別碼、位置和啟動時間；手冊也寫故意或誤觸可能被起訴罰款（[PLB1 手冊](https://chmarine.com/content/Ocean%20Signal/912S-01260-issue-02.23-PLB1-User-Manual.pdf)）。手冊建議能的話把 PLB 平放在地上、天線直立。
- **台灣登錄的 PLB**：打 02-2701-3400 給臺北任務管制中心。

### 誰付救援費

Garmin 不收跟 Garmin Response 聯絡的錢，但「you are financially responsible for any rescue or aid fees」，它的救援保險只在美國（含屬地）、加拿大賣。

台灣有搜救收費條文的縣市只有 6 個：臺中、南投、花蓮、苗栗、屏東和高雄，都是 2016–2018 年制定、之後沒有修過。條件是在縣市公告的管制山域出事、由縣市搜救，收的是實際支出，包括航空器。上限是你投保的登山綜合保險緊急救援保額；臺中公告的最低保額依路線是 30 萬或 50 萬。違反規定（例如沒申請許可）就沒有上限（[臺中市登山活動管理自治條例](https://law.taichung.gov.tw/LawContent.aspx?id=GL003013)）。高雄只在違規時收（[高雄市山域事故救援管理自治條例](https://outlaw.kcg.gov.tw/LawContent.aspx?id=GL001547)）。新北市（龍洞所在地）、宜蘭、臺東、新竹縣、桃園等都沒有這類條例。

國外的費用見前面的義大利、瑞士、奧地利段落。

## 依情境怎麼挑

### 龍洞與台灣單繩距岩場

多半有手機訊號，先照〈[岩場急救與事故應變](/posts/climbing/2026-10-18-crag-first-aid)〉打 119 或 112。要不要加衛星通訊器，看你會不會去手機訊號不穩的地方。NCC 2022 年說山區訊號「無法全面涵蓋」（[NCC，2022-02](https://www.ncc.gov.tw/chncc/app/data/view?id=50&module=news&serno=47094_8_news)），並呼籲山友除了手機也帶 PLB 或衛星電話（[NCC，2022-04](https://www.ncc.gov.tw/chncc/app/data/view?id=50&module=news&serno=47360_8_news)）。

### 台灣高山、溪谷、中級山

- 首選 inReach Mini 3，走中華電信實名開通，在台灣合法、有中文操作說明，求救會轉到消防署。
- 偶爾才去的話，先租。消防署輔導了 3 家團體提供衛星定位設備租借和留守平台（[消防署](https://www.nfa.gov.tw/cht/index.php?article_id=16678&code=list&flag=detail&ids=1468)）。馬布谷的 inReach 補助後每天 50 元，最少租 3 天，押金 3,600 元（[馬布谷](https://mabuvalley.com/products/garmin-inreach-rental)）。
- 開追蹤、找留守人。2026 年 8 月南湖和奇萊兩案都是追蹤加留守人找回來的。警政署的入山申辦系統也建議攜帶 inReach 這類衛星定位儀（[警政署入山案件申辦系統](https://nv2.npa.gov.tw/NM107-604Client/)）。
- 想要不怕訂閱過期的備援，加一台 PLB，記得燒 416 碼、登錄。

### 多洛米蒂、阿爾卑斯

- 先存 112，有訊號就先打。
- 有 iPhone 14 以後的手機，到義大利就能用衛星 SOS，但要有心理準備在北壁、深谷會很慢。
- 主力還是 inReach。Mini 3 Plus 或 Messenger Plus 的長訊息在跟國外救援說明狀況時比較夠用。
- PLB 在義大利能用，到奧地利、瑞士就只會轉給警察。
- 出發前查好保險是否涵蓋山區救援。

### 日本、韓國

- PLB 不要帶。
- 日本：iPhone 衛星 SOS 可以用，inReach 有日文對應。
- 韓國：手機衛星 SOS 都不能用，剩下雙向通訊器，先問當地規定。

## 檢查與保養重點

- **出發前一晚**：充滿電，行動電源和線一起帶。PLB 看電池效期，ACR 5 年、PLB1 7 年，用過一次就要送回原廠換。
- **訂閱和韌體**：開機看主畫面是不是「未啟動」；更新韌體，Mini 3 Plus 尤其要。
- **緊急聯絡人和醫療備註**：每次出發前確認，Garmin 只會把進度告訴登記的人。
- **PLB 登錄**：ACR 寫信標登錄效期 2 年，到期要更新。
- **防水等級**：Mini 3 系列 IP67、ZOLEO IP68，Messenger Plus 只有 IPX7，PLB1 防水 15 m。
- **低溫充電**：0 °C 以下 Garmin 只能慢充，ZOLEO 不能充。
- **不要按 SOS 測試**：想測試，Garmin 要先預約。

其他攀岩裝備的檢查與汰換，見〈[攀岩裝備的檢查、保養與汰換](/posts/climbing/2026-10-19-climbing-gear-inspection-retirement)〉。

## 練習題：四個情境

答案在每題下方，先自己想再看。

**1. 你在網路上買了一台美國版的 ACR ResQLink 400，準備帶去爬台灣的中級山。**

<details><summary>答案</summary>

先別帶。台灣要求 PLB 燒錄 416 國碼才能在國內登錄，美國版要請廠商重新燒錄，再到航港局的無線電示標平台登錄。登錄之後，在台灣按下由臺北任務管制中心接收。

</details>

**2. 你們在多洛米蒂的北壁第五段，繩伴墜落受傷。手機有一格訊號，身上也有 inReach。**

<details><summary>答案</summary>

有訊號就先撥 112，語音直接連到當地派遣，說清楚路線、第幾段和傷勢。通話斷了或打不通，再按 inReach SOS，用訊息補充狀況。Apple 和 Pixel 的衛星 SOS 在義大利也能用，但在北壁、深谷可能很慢。

</details>

**3. 你在溪谷裡按了 inReach 的「傳送訊息」報平安，過了 30 分鐘手機 app 還顯示傳送中。**

<details><summary>答案</summary>

先往開闊處移動，天線朝天。等很久還是送不出去，就重開機；DC Rainmaker 遇過 Mini 3 Plus 連續幾小時卡住，重開機才恢復。回家後更新韌體。如果是真的緊急狀況，SOS 也一樣要看得到天空，能移到開闊處就先移。

</details>

**4. 你下個月要去日本和韓國各爬一週，手上有 inReach 和一台登錄好的 PLB。**

<details><summary>答案</summary>

PLB 留在家：日本禁止陸上使用，韓國陸海空都不允許。帶 inReach，日本有日文對應；iPhone 衛星 SOS 在日本可以用，韓國不行。出發前確認 inReach 的訂閱是啟用狀態、緊急聯絡人是最新的。

</details>

## 下一步

衛星通訊器管的是「跟外面的人說話」。同一個隊伍裡，繩伴之間在風大、看不到對方時怎麼溝通，見下一篇：[第 13 篇：攀登用對講機](/posts/climbing/2026-11-01-climbing-radios)。

## 參考資料

原廠產品頁與價格（2026-11-01 查）見上表連結。

- [PLBs and Satellite Messaging Devices: A Primer（Colorado SAR，2023-12-28 更新）](https://coloradosar.org/plbs-and-satellite-messaging-devices-a-primer)
- [How SOS Coverage and Emergency Response Works（Garmin）](https://support.garmin.com/en-US/?faq=dENvi0yoo51ib0Zh8L4El6)
- [inReach Mini 3 Owner's Manual（Garmin）](https://www8.garmin.com/manuals/webhelp/GUID-F31CF821-79A9-46E5-A45B-8765F918488F/EN-US/inReach_Mini_3_OM_EN-US.pdf)
- [Update and Learn More About the Software on Your inReach Mini 3（Garmin）](https://support.garmin.com/en-US/?faq=eyVr0c3POoA4fSAeHYsQy6)
- [Garmin releases annual inReach SOS report（Garmin 新聞稿，2026-02）](https://finance.yahoo.com/news/garmin-releases-annual-inreach-sos-120100013.html)
- [inReach 方案（Garmin 台灣）](https://www.garmin.com.tw/products/subscription-plans/inreach-subscription-consumer-enabled/)
- [ZOLEO Plans](https://www.zoleo.com/en-us/plans)
- [rescueME PLB1 User Manual（Ocean Signal，912S-01260）](https://chmarine.com/content/Ocean%20Signal/912S-01260-issue-02.23-PLB1-User-Manual.pdf)
- [Gear Guide: Satellite Messaging Devices（Backpacking Light，2025-12-02；測試表 2024-11-15 更新）](https://backpackinglight.com/gear-guide-satellite-messaging-devices-messengers)
- [Testing the iPhone Satellite Messenger（Outdoor Life，2024-10-30）](https://www.outdoorlife.com/gear/testing-the-iphone-satellite-mesenger)
- [Garmin inReach Mini 3 & 3 Plus In-Depth Review（DC Rainmaker，2025-12-22）](https://www.dcrainmaker.com/2025/12/garmin-inreach-mini-3-3-plus-in-depth-review-upgrade.html)
- [Garmin inReach Mini 3 Plus Review（Treeline Review，2026）](https://www.treelinereview.com/gearreviews/garmin-inreach-mini-3-plus-review)
- [Best Satellite Messengers and Personal Locator Beacons（Treeline Review，2026）](https://www.treelinereview.com/gearreviews/best-personal-locator-beacons)
- [Best Satellite Communicators（Backpacker，2026-08-18 更新）](https://www.backpacker.com/gear/outdoor-electronics/best-satellite-communicators)
- [Best Satellite Messengers of 2026（Switchback Travel，2026-09-29）](https://www.switchbacktravel.com/backpacking/best-satellite-messengers)
- [Use Emergency SOS via satellite on your iPhone（Apple 105097）](https://support.apple.com/en-us/105097)
- [透過衛星傳送的 SOS 緊急服務（Apple 101573）](https://support.apple.com/zh-tw/101573)
- [Satellite SOS on Pixel（Google）](https://support.google.com/pixelphone/answer/15254448?hl=en)
- [Where do you carry your satcom device?（Alpine Savvy，2022-10-14）](https://alpinesavvy.com/blog/where-do-you-carry-your-satcom-device)
- [After climber survives gruesome injury in Sierras, it takes five helicopters to rescue her（LA Times，2025-07-08）](https://www.latimes.com/california/story/2025-07-08/after-climber-survives-gruesome-injury-in-sierras-it-takes-five-helicopters-to-rescue-her)
- [North American Climbing Accidents 2024：Chinese Puzzle Wall（AAC）](https://publications.americanalpineclub.org/articles/13201217213)
- [Mountain parks search and rescue（Parks Canada）](https://parks.canada.ca/pn-np/mtn/securiteenmontagne-mountainsafety/programme-program/res-sar.aspx)
- [National Beacon Regulations for the Use of PLBs（COSPAS-SARSAT）](http://cospas-sarsat.int/en/beacon-ownership/national-beacon-regulations-for-plbs)
- [Questions and answers（Cospas-Sarsat Italy）](https://cospas-sarsat-italy.it/en/questions-and-answers)
- [International roaming plans（T-Mobile）](https://www.t-mobile.com/cell-phone-plans/international-roaming-plans)
- [Garmin inReach 申辦（中華電信）](https://www.cht.com.tw/home/campaign/garMINInpromo)
- [電信管制射頻器材製造輸入及申報作業管理辦法（全國法規資料庫）](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=K0060146)
- [個人定位無線電示標登錄作業管理規範（交通部航港局，2025-10-09，行政院公報）](https://gazette.nat.gov.tw/EG_FileManager/eguploadpub/eg031191/ch06/type2/gov50/num16/Eg.htm)
- [無線電示標平台（交通部航港局）](https://beaconregistration.mtnet.gov.tw/RadioBeacon/index.do)
- [未來展望：航安業務（交通部航港局）](https://www.motcmpb.gov.tw/Article?nodeId=357&siteId=1)
- [台灣大與 AST SpaceMobile 簽署低軌衛星通訊合作備忘錄（台灣大，2026-03-02）](https://corp.taiwanmobile.com/press-release/news/press_20260302_441365.html)
- [九仙山 inReach 求救案（消防署 Threads，2025-04-08）](https://www.threads.com/@nfa_taiwan/post/DILdAXqpQa7)
- [安平坑林道救援（宜蘭縣政府消防局，2024-03-20）](https://fire.e-land.gov.tw/News_Content.aspx?n=6055&s=230335)
- [干卓萬栗栖溪受困案（新竹縣政府消防局轉載，2025-06）](https://fire.hsinchu.gov.tw/cht/index.php?article_id=40448&code=list&flag=detail&ids=14)
- [品田山斷崖救援（新竹縣政府，2026-01-08）](https://information.hsinchu.gov.tw/News_Content.aspx?n=2203&s=278988&sms=8603)
- [南湖、奇萊北壁失聯案（聯合報，2026-08-04）](https://udn.com/news/story/7320/9670069)
- [臺中市登山活動管理自治條例](https://law.taichung.gov.tw/LawContent.aspx?id=GL003013)
- [高雄市山域事故救援管理自治條例](https://outlaw.kcg.gov.tw/LawContent.aspx?id=GL001547)
- [NCC 持續改善山區行動通訊品質（NCC，2022-02-02）](https://www.ncc.gov.tw/chncc/app/data/view?id=50&module=news&serno=47094_8_news)
- [NCC 呼籲山友攜帶 PLB 或衛星電話（NCC，2022-04-01）](https://www.ncc.gov.tw/chncc/app/data/view?id=50&module=news&serno=47360_8_news)
- [炎炎夏日登山最佳攻略：租用衛星定位設備（消防署，2024-08-03）](https://www.nfa.gov.tw/cht/index.php?article_id=16678&code=list&flag=detail&ids=1468)
- [Garmin inReach 租借（馬布谷）](https://mabuvalley.com/products/garmin-inreach-rental)
- [入山案件申辦系統公告（警政署）](https://nv2.npa.gov.tw/NM107-604Client/)
- [Chiamate di emergenza: quando e come attivare i soccorsi in montagna（CAI Lo Scarpone，2025-08-26）](https://loscarpone.cai.it/dettaglio/chiamate-di-emergenza-quando-e-come-attivare-i-soccorsi-in-montagna)
- [GeoResQ diventa gratuita per tutti（CAI，2023-07-10）](https://cai.it/news/2023/07/georesq-lapp-per-il-soccorso-in-montagna-diventa-gratuita-per-tutti)
- [GeoResQ（CNSAS）](https://cnsas.it/en/georesq)
- [Notruf und Rettung in den Alpen（DAV，2025-07-06）](https://www.alpenverein.de/artikel/notruf-und-rettung-in-den-alpen_3802c636-0bd1-4f83-a33a-e9b266bd51d8)
- [Emergency numbers（Rega）](https://rega.ch/en/about-us/contact/emergency-numbers)
- [Questions and answers on patronage（Rega）](https://rega.ch/en/rega-patron/become-a-patron/questions-and-answers-on-the-subject-of-patronage-and-donations)
- [Einsatzverrechnung 2026（Bergrettung Niederösterreich/Wien）](https://bergrettung-nw.at/wp-content/uploads/sites/2/2026/02/20260128_Informationsblatt-Einsatzverrechnung-2026_Umsatzsteuer-u-Erhoehung-auf-36-Euro_ENG.pdf)
- [Garmin inReach Mini 3 & 3 Plus In-Depth Review（DC Rainmaker，2026-02-02）](https://www.youtube.com/watch?v=il3Q104Hq3A)
- [Garmin inReach Mini 3 Plus: 6 Months Later（HikingGuy.com，2026-08-14）](https://www.youtube.com/watch?v=ZtwOCMDGqUU)
- [Battle of the SOS Devices（Justin Outdoors，2026-10-02）](https://www.youtube.com/watch?v=XTvS2lIFZEE)
- [inReach Rival? The New ZOLEO, Trail Tested（HikingGuy.com，2026-09-16）](https://www.youtube.com/watch?v=GKTBqqf4ag4)
- [Pixel 9 Satellite SOS vs iPhone vs inReach（HikingGuy.com，2024-08-26）](https://www.youtube.com/watch?v=fkBdII0Ideg)
- [Real Life Test: Apple Satellite Messaging vs Garmin InReach!（Chase the Summit，2024-08-29）](https://www.youtube.com/watch?v=l0KpggA1Shw)
- [T-Satellite Is Amazing!（HikingGuy.com，2026-04-04）](https://www.youtube.com/watch?v=_zqiT5RX3SA)
- [What Happens When You Push the SOS Button on Your Garmin InReach Mini（Meg in the Forest，2025-10-06）](https://www.youtube.com/watch?v=zW-degk5bOA)
- [I hit the Garmin InReach SOS Button and here's what I learned（Meg in the Forest，2025-09-16）](https://www.youtube.com/watch?v=pmV3dEgBLMA)
- [When to Hit SOS on Your inReach, According to Garmin（HikingGuy.com，2024-02-29）](https://www.youtube.com/watch?v=BubPk8T2fO8)
- [Garmin inReach: Did This SOS Update Kill the PLB?（HikingGuy.com，2026-06-09）](https://www.youtube.com/watch?v=l32PzWZmJE8)
- [PLB vs Inreach - Did I make a mistake?（Adventure Otaku，2025-09-21）](https://www.youtube.com/watch?v=uccNr93hUgA)
- [Garmin inReachについて徹底解説！（ヤマレコ，2024-11-19）](https://www.youtube.com/watch?v=1NnOmP0IJYk)
- [衛星経由SOSの新時代、実証実験の全貌！（ヤマレコ，2025-05-30）](https://www.youtube.com/watch?v=aeW7i5jFp7Y)
- [inReach Mini 3 完整教學（Garmin Taiwan，2026-01-14）](https://www.youtube.com/watch?v=4AUmh3iOLz4)
