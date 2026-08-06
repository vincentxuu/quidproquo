---
title: "無人機的四種商業模式：為什麼賣機體是最差的一種"
date: 2026-08-06
type: deep-dive
category: product
tags: [drone, business-model, uav, saas, supply-chain]
lang: zh-TW
tldr: "硬體毛利 35–55% 且長期被 DJI 壓價，自主軟體與 DaaS 訂閱毛利 60–80% 且會重複發生。Skydio 2023 年軟體訂閱已占營收約 30%、整體毛利率 38%；印度 Garuda 的 DaaS 在 FY24 占營收 62%，現金循環天數 351 天，遠優於國防為主的同業 597 天。台灣目前幾乎全押在毛利最低、可替代性最高的那一格。"
description: "拆解無人機產業的四種商業模式——賣硬體、賣服務（DaaS）、賣軟體訂閱、賣資料——各自的毛利結構、現金循環、客戶黏著度與規模化條件，以及台灣廠商目前的位置與可能的移動路徑。"
draft: false
---

> 🌏 [English version](/posts/product/2026-08-06-drone-business-models-en)

[產業地圖](/posts/tech/2026-08-06-drone-industry-map)說價值集中在第 3 層與第 5 層，[台灣供應鏈那篇](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers)說台灣站在第 2 層。這篇補上為什麼——**因為賣機體這件事，在商業模式的四個選項裡是最差的一個。**

## 四種模式，四種完全不同的財務長相

| 模式 | 收入型態 | 毛利 | 現金循環 | 規模化瓶頸 |
|---|---|---|---|---|
| **賣硬體** | 一次性 | 低 | 長（庫存＋應收） | 製造規模與零組件成本 |
| **賣服務（DaaS）** | 重複 | 中高 | 中 | 營運人力與法規 |
| **賣軟體訂閱** | 重複 | 最高 | 短 | 硬體裝機基數 |
| **賣資料／分析** | 重複 | 最高 | 短 | 資料量與垂直知識 |

差距有多大？依 [Pulse 整理的商用無人機製造業 KPI 基準](https://pulserevops.com/industry-kpis/ik0291)：

> 持久的毛利在軟體，不在機體。硬體毛利率落在 35–55%，且長期承受價格壓力。自主飛行軟體、機隊管理、資料管線與 DaaS 訂閱的毛利率是 60–80%，而且會重複發生。

同一份基準還給了一個更尖銳的判準：

> 一家出貨 800 台但只有 200 台掛上自主軟體的製造商，生意比出貨 500 台、軟體附加率 90% 的競爭者更差。**單看出貨台數是虛榮指標。**

這句話值得記下來，因為台灣的產業敘事——「產值 129 億元」「出口 12.3 萬架」——用的正好都是台數與產值，不是收入結構。

## 模式一：賣硬體——被 DJI 定義的天花板

硬體是最直觀的模式，也是最難守的。問題不在做不出來，在**價格由別人決定**。

[產業週期史](/posts/tech/2026-08-06-drone-industry-cycle-history)那篇講過 2016 年那次的結局：DJI 靠垂直整合與製造自動化，能在競爭者無法獲利的價格點賺錢，一年之內清掉了美歐的消費級玩家。那個成本結構今天仍然存在。

對台廠的意義：**非紅供應鏈給了你訂單，但沒有給你定價權。** 認證解決的是「能不能賣」，不是「能賣多貴」。當歐美日的合格供應商從 3 家變成 10 家，價格戰會在認證名單內部重新開始一次。

## 模式二：賣服務（DaaS）——客戶要的是結果，不是飛機

DaaS 的核心洞察很簡單：**大多數企業不想買無人機，他們只想把事情做完。** 買飛機、訓飛手、處理法規，全部是他們不想碰的成本。

[市場估計](https://www.prnewswire.com/news-releases/drones-as-a-service-daas-shifts-from-emerging-tech-to-revenue-engine-for-leading-drone-manufacturers-302662085.html)全球 DaaS 市場目前約 60–80 億美元，多數預測認為十年內可到 150–200 億美元以上。

印度的 Garuda Aerospace 是把這條路走通的具體案例。依 [Unlisted Network 的整理](https://unlistednetwork.com/blog/how-garuda-aerospace-quietly-became-indias-agriculture-drone-leader/)，其 FY24 收入結構是 **DaaS 占約 62%、賣機體占約 38%**，營收從 FY23 的約 4.7 億盧比成長到 FY25 的約 11.7 億盧比。

更有意思的是現金面的對照：Garuda 的現金循環週期約 **351 天**，而以國防為主的同業 IdeaForge 約 **597 天**。同一個產業、同一個國家，商業模式差異直接反映在資金效率上——**國防合約的應收帳款週期長，是這個產業被低估的成本。**

## 模式三：賣軟體訂閱——把一次性收入變成年金

這條路的邏輯是：硬體賣出去只是開始，真正的價值在後面幾年的訂閱。

Skydio 是最清楚的樣本。依 [Sacra 的估算](https://sacra.com/c/skydio/)，其 2024 年營收約 1.8 億美元（較 2023 年的 1 億多美元成長約 80%），而 **2023 年軟體訂閱已占總營收約 30%**，整體毛利率約 38%，累計 bookings 約 12 億美元、其中逾五成來自國防。

38% 的整體毛利率說明了一件事：**即使軟體占比已到三成，硬體仍然把混合毛利拉在低檔。** 這也是為什麼前述 KPI 基準強調要把硬體與軟體毛利分開報——混在一起看不出飛輪有沒有在轉。

軟體訂閱的策略價值不只是毛利，是**轉換成本**。客戶把無人機嵌進日常工作流程之後，換供應商要重做流程、重訓人員、重接系統。這是硬體本身給不了的黏著度。

## 模式四：賣資料與分析——毛利最高、離機體最遠

[市場分析](https://www.marketresearchfuture.com/reports/drones-market-1124)指出，DroneDeploy、Pix4D 這類公司賣的是把飛行資料變成可用結論的 SaaS 訂閱——營建進度追蹤、體積量測、植被健康指數。它們不一定製造無人機，卻站在整條鏈毛利最高的位置。

這一格的門檻不是飛行技術，是**垂直領域知識**。要做營建進度分析，你得懂工程排程；要做植被健康，你得懂農藝。這也是為什麼它難被硬體廠商順手做掉。

## 台灣的位置與可能的移動

把台灣放進這張表，位置很明確：**幾乎全在模式一。**

- 整機與模組製造 → 模式一
- 八成產值來自公部門與國防採購 → 模式一裡最長帳期的那種
- DaaS、軟體訂閱、資料分析 → 少數新創，規模都小

而且台灣的國內服務市場還被法規壓著——[BVLOS 三地對照](/posts/tech/2026-08-06-bvlos-three-jurisdictions)那篇談過，台灣沒有標準化的超視距框架，物流與長距離巡檢無法規模化。**模式二在台灣的天花板不是技術也不是資本，是法規。**

那還剩什麼路？我認為有兩條比較實際：

**第一條：往模式三走，但賣給國外整機廠。** 台灣有 ICT 與嵌入式軟體的底子，飛控軟體、機隊管理、邊緣 AI 模組都是可以掛在別人硬體上賣的東西。這條路不需要台灣的法規改變——你賣的是別人法域裡的產品。

**第二條：在模式一裡挑毛利最高的那幾格。** 同樣是賣硬體，第 3 層的飛控電腦、抗干擾通訊模組、光電酬載，毛利與可替代性都遠優於第 2 層的馬達與機架。這正是政策押注「3 晶 2 軟」的邏輯。

兩條路指向同一個地方：**離開機體。**

## 判斷一家無人機公司的三個問題

1. **重複性收入占多少？** 依前述 KPI 基準，領先廠商把這個比例推向總營收的 30–50%，而傳統 OEM 卡在 5–10%。這個數字決定它被當成硬體商還是軟體商評價。
2. **硬體毛利與軟體毛利有沒有分開報？** 混合毛利率上升可能是軟體占比提高（好），也可能只是硬體變便宜（不好）。合報就看不出差別。
3. **客戶結構是商用還是國防？** 兩者的銷售週期與帳期完全不同——依前述基準，商用案子約 3–9 個月、勝率 25–45%；國防案子 12–36 個月、勝率 10–30%，而且應收週期長得多。

## 整體來說

**無人機這門生意的錢，不在會飛的那個東西上。** 硬體是取得客戶的成本，軟體與服務才是回收的地方。這個結構跟印表機、跟刮鬍刀、跟很多硬體轉服務的產業一樣——差別只在無人機還很早，多數玩家仍停在第一步。

台灣目前的強項（快速、彈性的整機與模組製造）恰好是這條價值鏈上議價力最低的一段。要往上走，[技術上是爬到第 3 層](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers)，商業上是**把一次性收入變成重複性收入**。這兩件事其實是同一件事的兩種說法。

## 參考資料

**商業模式與 KPI**

- [Pulse Industry KPIs — Commercial UAV & Drone Manufacturing 銷售 KPI 基準](https://pulserevops.com/industry-kpis/ik0291)（硬體與軟體毛利區間、重複性收入占比、商用與國防銷售週期）
- [Smarter.com — Evaluating Drone Companies for Investment: Market, Business Models, and Trade-Offs](https://www.smarter.com/so-smart/evaluating-drone-companies-investment-market-business-models-trade-offs)
- [Market Research Future — Drones Market Trends, Analysis, Revenue, and Forecast](https://www.marketresearchfuture.com/reports/drones-market-1124)（DaaS 與資料分析層）

**個案**

- [Sacra — Skydio revenue, funding & news](https://sacra.com/c/skydio/)（營收估算、軟體訂閱占比、毛利率、bookings 結構）
- [Unlisted Network — How Garuda Aerospace Quietly Became India's Agriculture Drone Leader](https://unlistednetwork.com/blog/how-garuda-aerospace-quietly-became-indias-agriculture-drone-leader/)（DaaS 營收占比、現金循環週期對照）
- [PR Newswire — Drones-as-a-Service Shifts from Emerging Tech to Revenue Engine](https://www.prnewswire.com/news-releases/drones-as-a-service-daas-shifts-from-emerging-tech-to-revenue-engine-for-leading-drone-manufacturers-302662085.html)（DaaS 市場規模估計）

**工具與平台**

- [DroneDeploy](https://www.dronedeploy.com/)
- [Pix4D](https://www.pix4d.com/)

**站內**

- [無人機產業地圖：從零組件、法規天花板到非紅供應鏈重組](/posts/tech/2026-08-06-drone-industry-map)
- [台灣無人機供應鏈：267 家在哪裡、卡在哪一層](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers)
- [無人機產業週期史：2016 年那次泡沫是怎麼破的，這次哪裡不一樣](/posts/tech/2026-08-06-drone-industry-cycle-history)
- [BVLOS 三地對照：美國還沒發布、歐盟已經能飛、台灣根本沒有這個框架](/posts/tech/2026-08-06-bvlos-three-jurisdictions)
