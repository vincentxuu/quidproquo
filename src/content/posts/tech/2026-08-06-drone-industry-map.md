---
title: "無人機產業地圖：從零組件、法規天花板到非紅供應鏈重組"
date: 2026-08-06
type: deep-dive
category: tech
tags: [drone, uav, supply-chain, taiwan, hardware, defense-tech]
lang: zh-TW
tldr: "全球無人機市場 2026 年約 690 億美元（IDTechEx），中國掌握約 80% 市場（CSIS）、DJI 占多旋翼七成以上。美國 FCC 在 2025 年 12 月把所有外國製無人機列入 Covered List；台灣產值一年從 50 億元跳到 129 億元，2026 Q1 出口就超過 2025 全年。這篇拆解產業鏈五層、四大需求板塊，以及卡住規模化的兩個天花板。"
description: "無人機產業的完整地圖：產業鏈分層、市場規模為何各家報告差十倍、軍用／農業／物流／巡檢四大需求、中國供應鏈壟斷與出口管制、美國 NDAA 與 FCC 政策槓桿、BVLOS 法規瓶頸，以及台灣在非紅供應鏈中的實際位置與缺口。"
draft: false
series:
  name: "無人機產業拆解"
  order: 1
---

> 🌏 [English version](/posts/tech/2026-08-06-drone-industry-map-en)

無人機產業最反直覺的一件事是：它看起來像消費電子，實際上運作起來像半導體——高度集中、少數國家掌握關鍵環節、地緣政治決定誰能買到什麼零件。2024 年 9 月中國限制飛控、碳纖機架、馬達、無線電模組出口到烏俄兩國之後，這件事就不再是分析師的說法，而是採購經理每天要處理的問題。

這篇文章拆解五件事：這個產業實際在賣什麼、市場規模為什麼各家數字差十倍、需求從哪裡來、什麼卡住了規模化，以及台灣現在站在哪個位置。

## 產業鏈長什麼樣：五層，價值不平均

無人機的物料清單其實不長。一台商用四旋翼拆開來，大概是這五層：

```
第 5 層  數據與服務    測繪軟體、巡檢 AI 分析、DaaS 營運商
           ↑ 毛利最高、規模化最難
第 4 層  整機系統整合   DJI / Skydio / Autel / Anduril / 台灣整機廠
           ↑ 品牌與認證在這層決定
第 3 層  關鍵模組      飛控電腦、通訊鏈路、光電酬載、電池模組
           ↑ 真正的瓶頸層
第 2 層  核心零組件    馬達、電變(ESC)、IMU、GNSS 模組、影像感測器
           ↑ 中國掌握度最高
第 1 層  材料與晶片    碳纖維、磁材、SoC / FPGA / RF 晶片、電芯
```

三個結構性事實：

第一，**價值集中在第 3 層與第 5 層**。整機組裝的門檻其實不高——這也是為什麼烏克蘭能在戰時冒出數百家整機廠。真正難替代的是飛控晶片、抗干擾通訊模組、高階光電酬載，以及把飛行資料變成可用結論的軟體。

第二，**第 1、2 層被中國吃得最深**。美國智庫 CSIS 估計中國掌握全球約 80% 的無人機市場，這個數字的分量不在整機，而在零組件——[CSIS 的分析](https://www.csis.org/analysis/why-chinas-uav-supply-chain-restrictions-weaken-ukraines-negotiating-power)指出，2024 年 9 月中國對烏俄兩國祭出的出口限制，涵蓋「飛控、碳纖機架、馬達、無線電模組、導航攝影機」，幾乎就是第 1、2 層的完整清單。同年 10 月，中國因 [Skydio](https://www.skydio.com/) 對台銷售而停供其無人機電池，逼得這家美國最大商用無人機廠商配給電池到 2025 年春天。一家美國公司被一顆電池卡住產線，這件事對整個產業的心理衝擊，遠大於任何一份市場報告。

第三，**第 4 層的集中度高到不正常**。[IMARC 的產業分析](https://www.imarcgroup.com/drones-market)估計 DJI 在全球消費與商用多旋翼市場約有 70% 以上的份額，消費級部分更高。單一廠商在硬體品類拿到這種佔比，在成熟產業裡幾乎沒有先例。

## 市場規模：為什麼每家報告差十倍

如果你 Google「無人機市場規模」，會拿到一堆互相矛盾的數字。這不是誰造假，是定義不同：

| 機構 | 2026 年規模 | 展望 | 涵蓋範圍 |
|---|---|---|---|
| [IDTechEx](https://www.idtechex.com/en/research-report/drones-market/1142) | US$69B | 2036 年 US$147.8B，CAGR 7.9% | 商用＋消費，含感測與自主技術 |
| [Fortune Business Insights](https://www.fortunebusinessinsights.com/drone-market-116193) | US$100.74B | 2034 年 US$210.26B，CAGR 9.63% | 民用＋軍用整體 |
| [Drone Industry Insights](https://droneii.com/product/drone-market-report) | — | 民用無人機 2026–2035 CAGR 7.2% | 只算民用 |

差異來自三個切法：軍用算不算、服務與軟體算不算、消費級玩具算不算。**看到任何無人機市場數字，先問這三個問題**，否則沒有可比性。

比較能反映真實動能的是資金流向。依 [Drone Industry Insights 的 2026–2035 報告](https://www.unmannedairspace.info/uncategorized/new-commercial-drone-market-forecasts-suggest-huge-potential-but-regulations-continue-to-hamper-growth)（透過 Unmanned Airspace 報導）：

> 「投資成長出現劇烈轉向。2024 年下跌 52% 之後，2025 年無人機投資創下 38.6 億美元的紀錄——其中 77% 流向軍民兩用（dual-use）公司。而 2026 年的頭兩個月？已經投入 17 億美元……但挑戰仍在。BVLOS 法規進展緩慢、合規成本高、休閒市場持平。成長幾乎完全由商用與軍民兩用應用驅動。」

這段話把整個產業的狀態說完了：錢在軍民兩用，成長被法規綁住，消費級已經不是故事主軸。

## 需求從哪來：四個板塊，成熟度差很多

**軍用／軍民兩用——目前的主引擎。** 俄烏戰爭把小型無人機從「輔助裝備」變成消耗品。烏克蘭 2025 年生產約 400 萬架無人系統，2026 年目標超過 700 萬架；[CFR 的分析](https://www.cfr.org/articles/how-ukraines-drone-innovation-reversed-russias-momentum)引述的對照組是美國每年約生產 10 萬架軍用無人機。這不是技術差距，是產業模式差距——烏克蘭把無人機當彈藥造，美國還在當飛機造。

**農業——最成熟、最無聊、也最賺錢。** Valour Consultancy 指出光是 DJI 一家的植保機隊就超過 30 萬架，中國市場已經飽和。農業噴灑是少數不需要 BVLOS、單機日產值明確、投資回收期能算清楚的應用。

**物流——2025 年才真正跨過門檻。** [Zipline](https://www.flyzipline.com/) 在 2026 年 1 月宣布累計超過 200 萬次商業配送，同時完成 6 億美元募資、估值 76 億美元，並揭露美國配送量「連續七個月維持每週約 15% 的成長」。從 100 萬次（2024 年 4 月）到 200 萬次只花了不到兩年。這是整個產業裡少數能拿出複利曲線的公司。

**巡檢與測繪——需求穩定，卡在合規。** 電力、油氣、鐵路、營建的巡檢需求早就存在，痛點不是技術而是「一次一張豁免」的審批模式，讓固定航線的重複作業無法規模化。

## 兩個天花板

### 天花板一：BVLOS 法規

超視距飛行沒開放，物流與長距離巡檢的單位經濟就永遠算不平——你省下的人力會被「每公里配一個觀測員」吃回去。

美國的 Part 108 是目前最接近突破的一次嘗試。依 [Airdata 整理的時程](https://airdata.com/blog/2026/part-108)：2025 年 6 月 6 日的行政命令 14307 要求 FAA 在 NPRM 後 240 天內發布終版規則，原訂 2026 年 2 月 1 日；43 天的政府停擺把期限推到約 3 月 16 日；2026 年 7 月 10 日規則送進 OIRA 做最後審查，而 OIRA 對重大規則的審查可長達 90 天。截至 2026 年 7 月，終版規則仍未發布，實際落地估計要到 2026 年底或 2027 年初，之後還有 6–12 個月的過渡期。

換句話說：**BVLOS 常態化這件事，市場已經喊了五年，但商業模式真正能改寫的時間點還沒到。**

### 天花板二：供應鏈與地緣政治

美國的政策槓桿走完了一個完整循環，值得完整看一遍：

1. **2024 年 12 月 23 日**：FY2025 NDAA 第 1709 條生效，給美國國安機關一年時間對 DJI、Autel 做正式資安稽核。沒做完的話，這些廠商自動進入 FCC 的 Covered List。
2. **2025 年 12 月 23 日**：期限到期，沒有任何聯邦機關承接這項稽核。
3. **2025 年 12 月 22 日**：FCC 的動作比預期更大——不只加入 DJI 與 Autel，而是把**所有外國製造的無人機與關鍵零組件**全部列入 Covered List，等於封鎖新的設備授權。
4. **2026 年 1 月 7 日**：FCC 發布公告（DA 26-22）踩了煞車。依 [Holland & Knight 的整理](https://www.hklaw.com/en/insights/publications/2026/01/fcc-exempts-certain-drones-from-covered-list)，國防部認定兩類產品不構成國安風險而豁免至 2027 年 1 月 1 日：列在 Blue UAS Cleared List 上的產品，以及符合 Buy American「domestic end product」門檻（美製內容超過總成本 65%）的產品。
5. **2026 年 5 月 8 日**：FCC 延長豁免，讓已部署的 Covered List 設備至少到 2029 年 1 月 1 日仍能接收韌體與資安更新——避免現場數十萬台設備變成無法修補的資安負債。

注意這裡的不對稱：**新授權被封鎖，既有設備被放行**。這對台灣、日本、歐洲的零組件廠是極明確的訊號——美國市場的入場券從「規格與價格」變成「認證與來源」。

中國那一側的動作是對稱的。2026 年 6 月 5 日中國海關總署發布第 77、78 號公告，[自 6 月 30 日起收緊工具機與無人機相關產品的出口申報要求](https://www.bhfs.com/insight/china-tightens-export-declaration-criteria-for-machine-tools-and-drone-related-products)，涵蓋無人機、關鍵零組件，以及反制系統。兩邊都在把供應鏈當籌碼用。

## 反制系統：對稱的另一半市場

無人機變便宜的直接後果是：任何機場、發電廠、軍事基地、大型集會都成了低成本威脅的目標。[MarketsandMarkets 估計](https://www.marketsandmarkets.com/Market-Reports/counter-cuas-systems-market-4197284.html) C-UAS 市場 2026 年為 91.7 億美元，2031 年成長到 297 億美元，CAGR 26.5%——成長率是無人機本體市場的三倍。

技術面上，反制方比想像中難做。傳統軟殺靠干擾 GPS 與通訊鏈路，但這兩條路都正在被繞過：光纖導引無人機拉一條實體線飛，完全免疫電子干擾——依前線研究者 Rob Lee 的觀察，[部分俄軍單位的 FPV 有 30–50% 是光纖導引](https://euromaidanpress.com/2026/01/26/ukraine-aims-to-build-7-million-drones-in-2026-70-times-more-than-the-us/)，烏克蘭方約 15%。而 AI 終端導引則讓無人機在失去鏈路後仍能自主完成攻擊。

結果是反制的重心從「干擾」移向「攔截」——用便宜的攔截無人機打便宜的攻擊無人機。這也解釋了為什麼 C-UAS 現在被當成獨立產業看待，而不是無人機的配件。

## 台灣站在哪裡

台灣是這輪重組裡數字最漂亮的受益者之一，而且成長是真的，不是統計基期的錯覺。

依行政院 2026 年 3 月的說明，台灣無人機產值[由 2024 年的 50 億元成長到 2025 年的 129 億元](https://www.ey.gov.tw/Page/9277F759E41CCD91/0bc0abcb-fbf3-4c42-819f-3288f891207f)，成長超過 2.5 倍；整機外銷金額從 1.4 億元跳到 29.5 億元，成長 21 倍。出口市場以捷克、波蘭、美國為主，占比超過九成。

2026 年的斜率更陡。經濟部在 7 月 30 日的行政院會報告中指出，[2026 年 1 至 3 月整機出口值達 1.15 億美元，超過 2025 年全年的 0.93 億美元](https://www.ey.gov.tw/PageRedirect.aspx?l=7c2b2995-19fe-4fad-8490-8d57900f7a78)——**一季超過去年一整年**。

政策面的骨架也已經搭好：

- **「無人載具產業發展統籌型計畫」**：2025–2030 年投入 442 億元，目標 2030 年產值 400 億元、打造台灣成為無人機民主供應鏈亞太中心。
- **技術聚焦「3 晶 2 軟」**：3 晶指飛行控制、通訊、衛星定位三種關鍵晶片模組；2 軟指飛行控制與地面控制軟體。這個選題很誠實——正好就是前面說的第 3 層瓶頸。
- **需求端拉動**：未來三年公部門規劃採購逾 10 萬架（公務商用型 5 萬 898 架、國防軍用型 4 萬 8,750 架）；行政院另提「國防自主無人載具採購特別條例」草案，規劃 2100 億元特別預算，目前仍在立法院審議。
- **認證接軌**：台灣是美國本土之外第一個取得 Green UAS 認證授權的國家；雷虎科技的 FPV 系列已取得美國國防部 [Blue UAS 認證](https://www.diu.mil/blue-uas)。

但要看清楚缺口在哪。依[中央社 2026 年 7 月的報導](https://www.cna.com.tw/news/afe/202607150278.aspx)，經濟部盤點的國產化比例是：**小型無人機約 7 成、中型約 6 成、大型約 3 成**。而業界的說法更具體——整機製造量能已大幅提升，但飛控晶片、長距離通訊模組、高階光電與雷達酬載仍需外購。

這正好對應產業鏈第 3 層。台灣目前的強項是「快速、彈性的整機與模組製造」，這是半導體與 ICT 供應鏈溢出的能力；弱項是高階酬載與長距鏈路，而這也正是全球最難替代、毛利最高的部分。267 家業者（北部 164、中部 57、南部 46）能不能從代工爬到這一層，是接下來五年真正的分水嶺。

## 整體來說

無人機產業目前的狀態可以壓縮成三句話：

1. **成長的錢在軍民兩用，不在消費級。** 2025 年 77% 的投資流向 dual-use 公司，這個比例短期不會反轉。
2. **供應鏈重組是政策驅動，不是市場驅動。** 誰能賣進美國，取決於認證與來源證明，不再只是規格與價格——這對非中國供應鏈是一次結構性的窗口，但窗口有時效（FCC 的豁免目前只到 2027 年 1 月 1 日）。
3. **真正的天花板是 BVLOS 法規，不是技術。** Part 108 落地前，物流與長距離巡檢的規模化都是紙上談兵；落地後，這兩塊的單位經濟會在一年內重算一次。

如果要用一個問題判斷任何一家無人機公司值不值得看：**它做的是第 3 層還是第 4 層？** 第 4 層的整機組裝終究會被價格戰打平，第 3 層的飛控、鏈路、酬載才是護城河所在。台灣的政策把資源押在「3 晶 2 軟」，方向是對的；能不能做出來，是另一回事。

## 這篇裡會過期的東西

（2026-08-10 補。）總覽文最容易被當成長期參考，但它引了幾個有明確到期日的數字。列出來，並附各自該去哪裡確認：

| 會過期的 | 為什麼會過期 | 去哪裡查 |
|---|---|---|
| FCC 對 Covered List 設備的豁免至 **2027-01-01** | 是行政決定，可能展延或提前終止 | [FCC Covered List](https://www.fcc.gov/supplychain/coveredlist) |
| 既有部署設備可接收韌體與資安更新至 **2029-01-01** | 同上 | 同上 |
| 市場規模預測（2026 / 2031 兩組） | 預測值每年改版，且各家範圍定義不同——這正是本文「差十倍」那節的重點 | 原報告發布頁 |
| 台灣產值與外銷占比 | 逐年統計 | 經濟部與公協會年度統計 |

**通則：這篇的結構性觀察（五層產業鏈、兩個天花板、非紅供應鏈的窗口邏輯）不會因為上面幾個數字改變而失效；會失效的是數字本身。引用前先確認上表那幾格。**

## 延伸閱讀

### 先讀哪幾篇：依你是誰

三十七篇不必照順序讀。挑一條線：

| 你是 | 建議順序 |
|---|---|
| **想先搞懂這個產業** | 本文 → [供應鏈分層](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers) → [產業週期史](/posts/tech/2026-08-06-drone-industry-cycle-history) |
| **要買機或要投標** | [怎麼讀規格表](/posts/tech/2026-08-07-drone-spec-sheet-reading) → [資安檢測規範拆解](/posts/policy/2026-08-08-drone-cybersecurity-testing-spec) → [酬載的成本階梯](/posts/tech/2026-08-09-drone-payload-cost-export-control) → [量產爬坡](/posts/tech/2026-08-09-drone-production-ramp-procurement) |
| **要飛，想弄清法規** | [法規白話版](/posts/policy/2026-08-06-taiwan-drone-regulation-guide) → [操作證怎麼考](/posts/policy/2026-08-06-taiwan-drone-license-guide) → [民航局題庫](/posts/policy/2026-08-07-caa-drone-exam-question-bank) → [BVLOS 三地對照](/posts/tech/2026-08-06-bvlos-three-jurisdictions) |
| **工程師／想轉進來** | [PX4 還是 ArduPilot](/posts/tech/2026-08-08-px4-vs-ardupilot) → [GPS 被干擾的七秒](/posts/tech/2026-08-08-gps-jamming-flight-controller) → [跳頻不是加密](/posts/tech/2026-08-08-drone-radio-link) → [職業地圖](/posts/career/2026-08-06-drone-industry-job-map) → [用架構圖當求職地圖](/posts/career/2026-08-06-software-to-drone-transition) |
| **看投資** | [四條件框架](/posts/investing/2026-08-06-drone-supply-chain-four-criteria) → [標案毛利](/posts/investing/2026-08-07-drone-maker-financials) → [國防預算三筆錢](/posts/investing/2026-08-06-drone-defense-budget-map) |
| **關心社會面** | [沒有隱私條款](/posts/policy/2026-08-07-drone-privacy-taiwan) → [炸機的解剖學](/posts/tech/2026-08-07-drone-crash-anatomy) → [反制為什麼難](/posts/tech/2026-08-07-counter-drone-why-hard) → [誰有權打下來](/posts/policy/2026-08-09-who-may-down-a-drone) |

**如果只讀一篇**：[供應鏈分層](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers)——整個系列的技術線都是從那篇的「缺口在第 3 層」長出來的。

> **關於這個系列的寫法**：所有數字都標了來源，算式都寫出來讓人重算。也因此出過錯——[酬載那篇](/posts/tech/2026-08-09-drone-payload-cost-export-control)的單價估計被[量產爬坡那篇](/posts/tech/2026-08-09-drone-production-ramp-procurement)的逐案紀錄推翻，而量產爬坡自己的第一條結論又被它補做的對照組推翻。更正都留在原文裡，沒有刪。

本文是無人機系列的總覽。三十七篇支線分六個方向往下鑽：

**台灣供應鏈**

- [台灣無人機供應鏈：267 家在哪裡、卡在哪一層](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers) — 把五層框架套到台灣，用整機廠公開的 BOM 拆分驗證缺口確實落在第 3 層

**法規**

- [台灣無人機法規白話版：什麼要註冊、什麼要考照、什麼會被罰](/posts/policy/2026-08-06-taiwan-drone-regulation-guide) — 依現行條文整理，並標出網路懶人包已經過時的說法
- [台灣無人機操作證怎麼考：分級、逐級制度、規費與時程](/posts/policy/2026-08-06-taiwan-drone-license-guide) — 三類證照、G1/G2/G3 分組、法定規費與完整時程
- [BVLOS 三地對照：美國還沒發布、歐盟已經能飛、台灣根本沒有這個框架](/posts/tech/2026-08-06-bvlos-three-jurisdictions) — 把本文第一個天花板攤開比較美歐台
- [無人機專章沒有隱私條款：被飛過的人只能回頭找刑法](/posts/policy/2026-08-07-drone-privacy-taiwan) — 專章為什麼不管隱私、刑法接住了哪些、法院怎麼認定，以及取證為什麼是真正的瓶頸
- [警察飛無人機的法源是完整的——但那是「飛」的法源，不是「拍」的法源](/posts/policy/2026-08-09-police-drone-evidence-authority) — 八個警察局已成立無人機隊，而民航法第 99 條之 16 給的是操作限制豁免；唯一為空中蒐證寫過的專門條文被起草機關自己建議再酌
- [反制無人機為什麼難：干擾正在失效，而台灣的難題不只是技術](/posts/tech/2026-08-07-counter-drone-why-hard) — 偵測四模態的盲區、電戰被光纖與自主導引繞過，以及監察院報告揭露的授權層級問題
- [誰有權把無人機打下來：台灣的法律授權了「排除」，卻沒授權任何一種手段](/posts/policy/2026-08-09-who-may-down-a-drone) — 中央法規裡「反制無人機」只出現在一張採購清單上；警械種類清單 31 項有戰防砲沒有干擾槍，電信管理法第 67 條沒有公務除外
- [台灣機場被無人機關場 23 次：而機場拿到的授權只有「取締」](/posts/policy/2026-08-09-airport-drone-incursions-taiwan) — 立法院預算評估報告裡的逐筆關場紀錄（47 架次、5,929 名旅客），六次「處理方式」是同一句複製貼上；民航局 2020 年就函請五個航空站買干擾槍
- [電廠、水廠、晶圓廠：關鍵基礎設施在民航法的授權表上，連一格都沒有](/posts/policy/2026-08-09-critical-infrastructure-drone-defence) — 第 99 條之 13 第 7 項但書只寫「政府機關（構）」，法人不在內；NCC 的干擾器輸入門鎖在一份不公開的名單上

**產業判斷**

- [無人機產業週期史：2016 年那次泡沫是怎麼破的，這次哪裡不一樣](/posts/tech/2026-08-06-drone-industry-cycle-history) — 上一輪的殘骸與這一輪的三個結構差異、三個相同警訊
- [無人機的四種商業模式：為什麼賣機體是最差的一種](/posts/product/2026-08-06-drone-business-models) — 毛利、現金循環與規模化條件的對照
- [「飛手年收 200 萬」之後：農噴走完了一輪循環](/posts/product/2026-08-07-agri-drone-unit-economics) — 農噴的實際費率與入場成本，以及削價與法規天花板的結構性成因
- [救災無人機：唯一一個 ROI 不是錢的應用，也是最容易被砍的預算](/posts/product/2026-08-07-drone-sar-value) — 農噴的對照組：規格由地形定義、補的是直升機到不了的那一格，以及算不出 ROI 的預算困境
- [巡檢是台灣跑得最遠的無人機應用——因為它繞開了 BVLOS](/posts/product/2026-08-07-drone-inspection-taiwan) — 橋梁、電塔、高鐵橋的實際量化成果，以及為什麼分段作業繞得過視距外法規
- [台灣的無人機物流已經有 24 條廊道——它走的不是等法規那條路](/posts/product/2026-08-07-drone-logistics-taiwan) — 六年三階段的實際進度，以及為什麼逐案核准對物流可行、對巡檢不可行

**人與職涯**

- [無人機產業的職業地圖：十一種角色，以及軟體人能切進哪幾格](/posts/career/2026-08-06-drone-industry-job-map) — 把職缺放回五層框架，標出對軟體背景的可遷移度
- [從軟體業轉進無人機：用 PX4 的架構圖當求職地圖](/posts/career/2026-08-06-software-to-drone-transition) — 三條遷移路徑的摩擦力差異，以及用 SITL 與真實 log 證明能力的順序
- [台灣無人機的四條學習路徑：科大、證照、競賽、在職訓練](/posts/education/2026-08-06-taiwan-drone-education-paths) — 課程體系、競賽題目設計與三種身分的具體建議
- [進入台灣無人機產業的四道門：公開資料能告訴你的入場機制](/posts/career/2026-08-06-drone-market-entry-mechanics) — 聯盟入會、研發補助、認證順序與標案機制，含公開資料回答不了的清單

**自己判讀公開資料**

- [怎麼讀無人機規格表：法規把哪幾行變成了分界線](/posts/tech/2026-08-07-drone-spec-sheet-reading) — 五道重量門檻、法規用哪三個模組認定「同一台」，以及三份可查的公開清冊
- [拆兩份運安會炸機報告：兩次都不是操作人的錯](/posts/tech/2026-08-07-drone-crash-anatomy) — 25 公斤統計門檻的意義，兩起事故的失效鏈，以及 PX4 log 該讀哪幾項
- [民航局把題庫全公開了：從四個科目看主管機關在意什麼](/posts/policy/2026-08-07-caa-drone-exam-question-bank) — 1,420 題背後的政策轉向，以及考試內容暴露的監理心智模型
- [PX4 還是 ArduPilot：真正的分岔在授權條款](/posts/tech/2026-08-08-px4-vs-ardupilot) — 把兩套飛控原始碼各 build 一次跑出來的數字：授權條款、擴充點、板子覆蓋、一年份的貢獻者結構，以及「自研飛控」實際上是什麼
- [跳頻不是加密：ExpressLRS 原始碼與台灣的頻道數功率上限](/posts/tech/2026-08-08-drone-radio-link) — 跳頻序列怎麼從一句綁定口令推導出來（含可複現的交叉驗證）、速率換靈敏度的實際代價，以及 LP0002 的 75 頻道門檻如何決定合法功率
- [類比 FPV 圖傳在台灣找不到條文可走](/posts/tech/2026-08-08-fpv-video-link-taiwan) — 逐格比對市售 FPV 頻道表與台灣的 125 MHz 窗口（四十格只有二十四格在內），以及類比圖傳為什麼 §4.10 與 §5.7 兩條路都進不去
- [燈光秀的「群飛」裡沒有群：兩百架只同步一個整數](/posts/tech/2026-08-09-drone-swarm-light-show) — 讀 Skybrush 開源燈光秀韌體 9,199 行證明機間零協調，再逐格對照資安檢測規範第 7 章十二項為什麼「遙控無人機」那一欄全是「-」
- [無人機熱像儀的價格為什麼跳著漲：出口管制畫出的成本階梯](/posts/tech/2026-08-09-drone-payload-cost-export-control) — 熱像儀出口管制的兩個門檻與常見感測器格式的逐格對照、FLIR Boson 同代同間距的四組定價比、以及用消防署兩個計畫解出的台灣單價
- [量產爬坡的公開證據不在工廠裡，在「無法決標公告」裡](/posts/tech/2026-08-09-drone-production-ramp-procurement) — 用政府採購網逐縣市重建消防署 88+88 案：中央統一定價、六件流標、七件決標全等於預算、臺中交期被壓成一半，並更正前一篇算錯的單價
- [飛控的「自主」有一份完整清單，共 56 項——而其中只有一項是為了機會](/posts/tech/2026-08-09-drone-autonomy-modereason) — 逐項分類 ArduPilot 的 ModeReason 列舉，再對照 PX4 主線那個 10 KB、預設關閉的端到端神經網路控制模組
- [GPS 被干擾的那七秒：飛控怎麼發現、又為什麼預設不偵測](/posts/tech/2026-08-08-gps-jamming-flight-controller) — 在模擬器裡真的打開干擾並記錄完整時間軸，PX4 的十二道 GNSS 閘門，以及為什麼干擾偵測預設關閉、詐騙偵測預設開啟
- [無人機資安檢測規範拆解：真正在測「打不打得倒」的那五項，全部是選測](/posts/policy/2026-08-08-drone-cybersecurity-testing-spec) — 必測七項裡無人機只佔三項、通訊安全可以「不加密但揭露」通過、韌體安全測的是更新機制，以及第 8 章選測項目為什麼才是買方該問的
- [無人機為什麼只能飛 30 到 45 分鐘：一條式子就算得出來](/posts/tech/2026-08-08-drone-endurance-physics) — 從動量理論算起：1.5 次方定律、最佳電池比例 2/3 的解析解、每公斤酬載換幾分鐘，以及台灣在 BOM 裡唯一領先的那一層
- [40 分鐘到 6 小時：無人機的續航階梯換的不是電池，是形態和能源](/posts/tech/2026-08-08-drone-airframe-configurations) — 定翼機航程為何與速度無關、VTOL 用四分之一航程換掉跑道、單旋翼靠槳盤面積翻倍，以及台灣從電動到燃料電池到內燃機每一階的國產機型

**框架與資金**

- [用四條件框架看無人機供應鏈：四條裡目前只成立一條](/posts/investing/2026-08-06-drone-supply-chain-four-criteria) — 用站上既有的尺量這個板塊，含三類具體風險
- [追無人機的國防預算：三筆錢、一條卡了兩個月的立法程序](/posts/investing/2026-08-06-drone-defense-budget-map) — 補助、採購、年度預算三條路徑的性質與確定性差異
- [「標案毛利到底多少」：財報回答了我以為要訪談才知道的事](/posts/investing/2026-08-07-drone-maker-financials) — 毛利 38% 但本業連三季虧損、存貨 385 天、擴產靠增資，以及驗收失敗的財務衝擊

全系列都帶 `drone` 標籤，可從 [#drone](/tags/drone) 一次瀏覽。

## 參考資料

**市場與產業數據**

- [IDTechEx — Drones Market 2026-2036: Technologies, Markets, and Opportunities](https://www.idtechex.com/en/research-report/drones-market/1142)
- [Fortune Business Insights — Drone Market Size, Share, Industry Report 2026-2034](https://www.fortunebusinessinsights.com/drone-market-116193)
- [Drone Industry Insights — Drone Market Report](https://droneii.com/product/drone-market-report)
- [Unmanned Airspace — New commercial drone market forecasts suggest huge potential but regulations continue to hamper growth](https://www.unmannedairspace.info/uncategorized/new-commercial-drone-market-forecasts-suggest-huge-potential-but-regulations-continue-to-hamper-growth)
- [IMARC Group — Drones Market Size, Growth & Industry Forecast to 2034](https://www.imarcgroup.com/drones-market)
- [MarketsandMarkets — Counter-UAS System (C-UAS) Market](https://www.marketsandmarkets.com/Market-Reports/counter-cuas-systems-market-4197284.html)

**供應鏈與地緣政治**

- [CSIS — Why China's UAV Supply Chain Restrictions Weaken Ukraine's Negotiating Power](https://www.csis.org/analysis/why-chinas-uav-supply-chain-restrictions-weaken-ukraines-negotiating-power)
- [Brownstein — China Tightens Export Declaration Criteria for Machine Tools and Drone-Related Products](https://www.bhfs.com/insight/china-tightens-export-declaration-criteria-for-machine-tools-and-drone-related-products)
- [Holland & Knight — FCC Exempts Certain Drones from Covered List](https://www.hklaw.com/en/insights/publications/2026/01/fcc-exempts-certain-drones-from-covered-list)
- [DRONELIFE — FCC Updates Covered List to Exempt Blue UAS and Qualified Domestic Products](https://dronelife.com/2026/01/07/cc-covered-list-blue-uas-buy-american-exemptions-2027/)
- [Council on Foreign Relations — How Ukraine's Drone Innovation Reversed Russia's Momentum](https://www.cfr.org/articles/how-ukraines-drone-innovation-reversed-russias-momentum)
- [Euromaidan Press — Ukraine aims to build 7 million drones in 2026](https://euromaidanpress.com/2026/01/26/ukraine-aims-to-build-7-million-drones-in-2026-70-times-more-than-the-us/)

**法規**

- [Airdata — FAA Part 108 Explained: Everything Drone Operators Need to Know in 2026](https://airdata.com/blog/2026/part-108)
- [FAA — Unmanned Aircraft Systems](https://www.faa.gov/uas)
- [DIU — Blue UAS](https://www.diu.mil/blue-uas)

**台灣**（中文來源）

- [行政院 — 無人機相關預算對民主供應鏈戰略布局及國軍戰力至關重要](https://www.ey.gov.tw/Page/9277F759E41CCD91/0bc0abcb-fbf3-4c42-819f-3288f891207f)
- [行政院 — 卓揆：2025-2030 年投入 442 億元強化無人機產業能量與供應鏈韌性](https://www.ey.gov.tw/PageRedirect.aspx?l=7c2b2995-19fe-4fad-8490-8d57900f7a78)
- [中央社 — 立法院 16 日審無人機條例，經濟部盼支持政院版本](https://www.cna.com.tw/news/afe/202607150278.aspx)
- [中央社 — 台灣打造無人機民主供應鏈，漢翔雷虎領軍拚美認證](https://www.cna.com.tw/news/afe/202510190031.aspx)
- [亞洲無人機 AI 創新應用研發中心](https://spacechiayi.tw/)

**公司**

- [Zipline](https://www.flyzipline.com/)
- [Skydio](https://www.skydio.com/)
- [DRONELIFE — Zipline Surpasses 2 Million Deliveries with Expansion to Houston and Phoenix](https://dronelife.com/2026/01/21/zipline-surpasses-2-million-deliveries-with-expansion-to-houston-and-phoenix/)
