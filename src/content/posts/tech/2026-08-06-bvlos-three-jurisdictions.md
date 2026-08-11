---
title: "BVLOS 三地對照：美國還沒發布、歐盟已經能飛、台灣根本沒有這個框架"
date: 2026-08-06
type: deep-dive
category: tech
tags: [drone, regulation, bvlos, uav, taiwan]
lang: zh-TW
tldr: "歐盟自 2020 年底起就有可行路徑——Specific 類別憑風險評估取得營運授權，加上 U-space 法規 (EU) 2021/664 逐步部署。美國的 Part 108 到 2026 年 7 月仍在 OIRA 審查、尚未發布。台灣則連框架都還沒有：《管理規則》給的是「延伸視距飛航」（900 公尺、400 呎、要目視觀察員），真正的視距外只能靠法人逐案申請、許可效期 3 個月。"
description: "比較美國、歐盟、台灣三地的超視距飛行制度：Part 107 豁免與 Part 108 的實際進度、EASA 三分類與 Specific 類別的授權路徑、台灣的延伸視距與逐案許可模式，以及這個落差對物流與長距離巡檢商業模式的實際影響。"
draft: false
series:
  name: "無人機拆解"
  order: 11
---

> 🌏 [English version](/posts/tech/2026-08-06-bvlos-three-jurisdictions-en)

[產業地圖](/posts/tech/2026-08-06-drone-industry-map)裡把 BVLOS 法規列為無人機規模化的兩個天花板之一。這篇把三個法域攤開比較，結論比我原本以為的更懸殊：**歐盟已經能飛、美國還在等最後一哩、台灣連框架都還沒建。**

先定義清楚。**BVLOS（Beyond Visual Line of Sight，超視距）指的是無人機飛到操作員肉眼看不見的範圍外。** 它之所以是天花板，是因為沒有它，物流與長距離巡檢的單位經濟永遠算不平——你省下的人力會被「每段航程配一個觀察員」吃回去。

## 美國：Part 107 是豁免模式，Part 108 還沒到

現行的 Part 107 **禁止** BVLOS，但可以個案申請豁免（waiver）。這個模式的問題不在能不能過，而在**一次只核准一個作業**——固定航線的重複作業無法規模化。

Part 108 就是要把「一次一張豁免」換成標準化框架。時程依 [Airdata 整理](https://airdata.com/blog/2026/part-108)：

| 時間 | 事件 |
|---|---|
| 2025-06-06 | 行政命令 14307 要求 FAA 在 NPRM 後 240 天內發布終版規則 |
| 2026-02-01 | 原訂期限 |
| ~2026-03-16 | 43 天政府停擺後的順延期限 |
| 2026-07-10 | 規則送進 OIRA 做最後審查（重大規則審查可長達 90 天） |
| 2026 底–2027 初 | 預估實際發布時點，之後還有 6–12 個月過渡期 |

換句話說：**美國業界已經喊了五年的 BVLOS 常態化，到 2026 年 8 月仍然沒有落地。**

## 歐盟：不是「開放 BVLOS」，是「BVLOS 本來就在框架裡」

這是三地最大的認知差異。歐盟沒有一條叫做「BVLOS 規則」的東西，因為它的法規結構從一開始就不是按「看不看得到」分類，而是**按風險分類**。

依 [EASA 說明](https://www.easa.europa.eu/en/domains/drones-air-mobility/operating-drone)，[Regulation (EU) 2019/947](https://www.easa.europa.eu/en/document-library/regulations/commission-implementing-regulation-eu-2019947)（連同 2019/945）**自 2020 年 12 月 31 日起適用於所有歐盟會員國**，並把所有民用無人機作業分成三類：

| 類別 | 風險 | 需要什麼 |
|---|---|---|
| **Open** | 低 | 不需營運授權，符合次分類（A1/A2/A3）的內建限制即可 |
| **Specific** | 中 | 須先向國家主管機關取得**營運授權**，授權基礎是營運人自行執行的**風險評估** |
| **Certified** | 高 | 航空器與營運人皆須取證、遠端駕駛員須持照 |

**BVLOS 落在 Specific 類別。** EASA 的原文是：

> The 'specific' category covers riskier civil drone operations, where safety is ensured by the drone operator by obtaining an operational authorisation from the national competent authority before starting the operation.

關鍵差別在於：**這不是逐次活動的許可，而是對「一種作業」的授權。** 拿到授權之後，符合該作業描述的飛行就可以持續執行，不必每次重新申請。這正是美國想用 Part 108 達成、而目前還沒達成的事。

流量管理則由另一套法規處理——[Regulation (EU) 2021/664](https://www.easa.europa.eu/en/document-library/regulations/commission-implementing-regulation-eu-2021664)（U-space 法規，2021 年 4 月通過），在預期交通量較大的空域（例如都會區）建立無人機的數位交通管理服務。

**所以歐盟的位置是：五年前就有可行路徑，現在在解決的是規模化與空域整合，不是「能不能飛」。**

## 台灣：有「延伸視距」，但那不是 BVLOS

這是我查完法規原文後最意外的一點。

《遙控無人機管理規則》**沒有 BVLOS 這個制度**。它有的是**「延伸視距飛航」**，定義寫在第 2 條：

> 延伸視距飛航：指操作人於視距外，藉由目視觀察員於其半徑三百公尺範圍內與遙控無人機保持直接目視接觸，並提供操作人必要飛航資訊之操作方式；延伸視距最大範圍為以操作人為半徑九百公尺、相對地面或水面高度不逾四百呎之區域。

拆開來看三個限制：

1. **仍然要有人用肉眼看著無人機**——只是從操作人換成目視觀察員
2. **觀察員半徑 300 公尺、整體半徑 900 公尺**
3. **高度不逾 400 呎**

**這是 EVLOS（延伸視距），不是 BVLOS。** 差別是本質的：延伸視距仍然依賴人眼，所以它的成本結構跟 VLOS 一樣——你想飛 10 公里的管線巡檢，就得沿線佈觀察員。物流與長距離巡檢想要的那種「無人在現場」的經濟性，延伸視距給不了。

那真正的視距外呢？依《民用航空法》第 99 條之 14，「目視範圍內操作」是八項操作限制之一，**可以申請排除**——但條件疊起來很緊：

- 只有**政府機關（構）、學校或法人**能申請（自然人不行，即使考到高級證）
- 操作人須持**專業高級 G1**（該組涵蓋視距外操作、夜間飛行、400 呎以上）
- 須於**活動日 15 日前**檢附活動計畫書向民航局申請許可
- **許可期限以 3 個月為限**（農政機關登記合格法人從事特定活動 6 個月；政府機關為執行業務 1 年）

這是**逐案許可模式**，而且效期只有一季。它與美國 Part 107 的 waiver 屬於同一個層級——也就是美國正想離開的那個層級。

## 三地對照

| | 美國 | 歐盟 | 台灣 |
|---|---|---|---|
| **BVLOS 的法律位置** | Part 107 禁止，可個案豁免 | Specific 類別的常規作業 | 民航法八項限制之一，可逐案申請排除 |
| **標準化框架** | Part 108（**尚未發布**） | 已有（2019/947，2020-12-31 起適用） | **無** |
| **授權對象** | 逐次作業 | **一種作業**（取得後可持續執行） | 逐次活動，許可 3 個月 |
| **申請前置** | 依個案 | 風險評估 | 活動日 15 日前 |
| **誰能申請** | 營運人 | 營運人 | **僅法人／機關／學校** |
| **交通管理** | UTM 建置中 | U-space 法規 (EU) 2021/664 | 尚無對應法規 |
| **中間層級** | — | — | 延伸視距（900m／400 呎／需觀察員） |

## 這個落差的實際意義

**第一，台灣的「低空經濟」論述跑在法規前面。** 物流無人機、長距離管線巡檢、跨縣市配送這些應用，在現行框架下都只能用「法人逐案申請、許可 3 個月」的方式做示範性營運，無法變成可規模化的商業模式。**技術不是瓶頸，制度才是。**

**第二，這對台灣的出口導向反而不是壞事。** [台灣無人機產值八成來自公部門採購、外銷僅占 22.9%](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers)，主要出口市場是捷克、波蘭、美國。**做整機與模組出口，賣的是別人的法規環境，不是自己的。** 台廠受國內 BVLOS 缺位的影響，比想像中小。

真正受影響的是**國內的服務端**——巡檢 DaaS、物流營運、測繪服務這類第 5 層業者。他們的天花板是台灣的法規，不是技術。

**第三，補框架比補技術快，但沒有捷徑。** 歐盟從 2019 年發布到 2020 年底適用，中間有完整的風險評估方法論（SORA）與國家主管機關的授權能量要建。台灣目前連中間層級（延伸視距）都設得比歐盟 Specific 類別保守很多，往上補要處理的不只是條文，還有偵測與避讓（detect-and-avoid）能力的認定標準、通訊鏈路的可靠度要求，以及主管機關的審查量能。

## 一句話總結

**歐盟解決的是「怎麼安全地飛」，美國還在解決「什麼時候能發布規則」，台灣還在「要不要建這個框架」的前一步。** 判斷任何一家無人機服務業者的成長天花板時，先問它在哪個法域營運——這個變數的權重，目前高於它的技術能力。

## 參考資料

**美國**

- [Airdata — FAA Part 108 Explained: Everything Drone Operators Need to Know in 2026](https://airdata.com/blog/2026/part-108)（EO 14307、期限順延、OIRA 審查時程）
- [FAA — Unmanned Aircraft Systems](https://www.faa.gov/uas)

**歐盟**

- [EASA — Operating a drone](https://www.easa.europa.eu/en/domains/drones-air-mobility/operating-drone)（三分類定義與 Specific 類別授權說明）
- [EASA — Rules & Standards](https://www.easa.europa.eu/en/domains/drones-air-mobility/rules-standards)
- [Commission Implementing Regulation (EU) 2019/947 — EASA](https://www.easa.europa.eu/en/document-library/regulations/commission-implementing-regulation-eu-2019947)
- [Commission Implementing Regulation (EU) 2021/664（U-space）— EASA](https://www.easa.europa.eu/en/document-library/regulations/commission-implementing-regulation-eu-2021664)
- [EASA — Civil Drones 專區](https://www.easa.europa.eu/en/domains/civil-drones)

**台灣**

- [遙控無人機管理規則 — 全國法規資料庫](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=K0090083)（第 2 條延伸視距定義、第 29 條操作限制、第 32 條活動許可）
- [交通部民用航空局 — 無人機專區](https://www.caa.gov.tw/article.aspx?a=188&lang=1)

**站內**

- [無人機產業地圖：從零組件、法規天花板到非紅供應鏈重組](/posts/tech/2026-08-06-drone-industry-map)
- [台灣無人機供應鏈：267 家在哪裡、卡在哪一層](/posts/tech/2026-08-06-taiwan-drone-supply-chain-layers)
- [台灣無人機法規白話版：什麼要註冊、什麼要考照、什麼會被罰](/posts/policy/2026-08-06-taiwan-drone-regulation-guide)
