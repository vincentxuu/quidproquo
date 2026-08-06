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
glossary:
  - term: "BVLOS"
    aliases: ["Beyond Visual Line of Sight", "超視距"]
    definition: "超視距飛行，指無人機飛到操作員肉眼看不見的範圍外。"
    advanced: "多數國家目前只用個案豁免（waiver）核准 BVLOS，需要 detect-and-avoid（偵測與避讓）能力與可靠的通訊鏈路。BVLOS 能不能常態化，直接決定物流、長距離巡檢這類商業模式的單位經濟。"
    context: "本文把 BVLOS 法規視為無人機規模化的兩個天花板之一。"
    links:
      - label: "FAA Part 108 NPRM"
        url: "https://www.faa.gov/uas"
  - term: "FPV"
    aliases: ["First-Person View", "第一人稱視角無人機"]
    definition: "操作員透過機上鏡頭即時畫面操控的無人機，多為小型四旋翼。"
    advanced: "俄烏戰場上的主力型態：單價從數百到數千美元，可攜帶爆裂物執行一次性攻擊。低成本、高產量、易受電子干擾，因此衍生出光纖導引與 AI 終端導引兩條演進路線。"
    context: "本文用 FPV 產量說明軍用需求如何重塑整個供應鏈。"
  - term: "非紅供應鏈"
    aliases: ["民主供應鏈", "non-red supply chain"]
    definition: "整機與關鍵零組件都不使用中國製造來源的供應鏈。"
    advanced: "在無人機領域具體化為認證制度：美國國防部的 Blue UAS（軍用）與 Green UAS（商用）清單，以及 NDAA 對聯邦採購的來源限制。台灣把「2027 年全非紅供應鏈」寫進政策目標。"
    context: "本文的台灣段落幾乎整段建立在這個概念上。"
  - term: "Blue UAS / Green UAS"
    definition: "美國國防部體系的無人機信任認證清單，Blue 為軍用級、Green 為商用級。"
    advanced: "Blue UAS Cleared List 由國防合約管理局（DCMA）維護，是美軍採購的信任標章；Green UAS 由 AUVSI 營運，是進入 Blue 的前置門票。兩者都要求供應鏈溯源與資安檢測。"
    context: "台灣是美國本土之外第一個取得 Green UAS 認證授權的國家。"
  - term: "C-UAS"
    aliases: ["counter-UAS", "反制系統", "反無人機"]
    definition: "偵測、辨識、追蹤並攔截無人機的系統總稱。"
    advanced: "手段分軟殺（干擾 GPS／通訊鏈路、協定接管）與硬殺（動能攔截、雷射、攔截無人機）。光纖導引與自主導航無人機讓純干擾式軟殺失效，是這個市場高速成長的主因。"
    context: "本文把 C-UAS 視為與無人機本體對稱的另一半市場。"
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

## 延伸閱讀

本文是無人機系列的總覽，後續支線陸續發布，往五個方向深入：

- **台灣供應鏈**：把上面的五層框架套到台灣的 267 家業者，用整機廠公開的 BOM 拆分驗證缺口確實落在第 3 層
- **法規**：台灣現行規定的白話版（什麼要註冊、什麼要考照、什麼會被罰）、操作證制度的分級與規費，以及 BVLOS 在美歐台三地的制度對照
- **產業週期**：2016 年那次消費級泡沫是怎麼破的，這一輪的三個結構差異與三個相同警訊
- **職涯**：十一種職務按產業鏈層級排開，標出每個角色對軟體背景的可遷移度
- **框架檢驗**：用四條件框架量這個板塊，以及三類具體風險

**全系列都帶 `drone` 標籤——[#drone](/tags/drone) 是這個系列的完整索引，新文章發布後會自動出現在那裡。**

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
