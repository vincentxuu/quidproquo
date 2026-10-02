---
title: "Product Builder 面試日練 — 2026-10-03：Technical PM"
date: 2026-10-03
category: daily
type: digest
tags: [product-builder-interview, daily, technical-pm]
lang: zh-TW
description: "用 Stripe 的日期版本釘選機制練一道 Technical PM 真題「如何淘汰一個做了破壞性授權變更的公開 API」，案例是 Stripe 用版本轉換模組讓 2011 年串接的帳號至今零強制升級。"
tldr: "Technical PM 面試考的不是你會不會畫架構圖，而是你能不能把一個破壞性 API 變更，拆解成客戶分群、相容層設計、分階段淘汰時程這幾個具體決策，並且敢真的設一個會執行的下線日期。今天的框架是 Use Case → Contract → Compatibility → Operability → DX 五層 API 設計框架，搭配 ADR（背景→決策→後果→回頭觸發點）把決策寫下來。練習題是「如何規劃一個破壞性授權變更的 API 淘汰計畫」，拆解思路是先釐清變更性質、用呼叫量數據把客戶分群、評估相容層的可行性、分四階段淘汰（警告→溝通→軟性截止→下線），最後用流量遷移率當領先指標。案例是 Stripe 從 2011 年至今用日期命名版本與版本轉換模組，讓每個帳號在第一次呼叫時自動釘選版本，之後所有破壞性變更都由內部轉換模組吸收，開發者可以永遠留在自己被釘選的版本上；2024 年 9 月起進一步把節奏公開為每月小版本、每年兩次大版本。"
series:
  name: "Product Builder 面試日練"
  order: 45
---

> 🌏 [English version](/en/posts/daily/2026-10-03-product-builder-interview-daily-en)

## 今日主題

Technical PM 面試最容易被看穿的，不是你懂不懂系統設計語言，而是當面試官丟出一個「API 要不要做破壞性變更」或「這個服務要不要拆分」的情境時，你是把技術決策當成工程部門的事情丟回去，還是真的能主導一個涉及版本相容、客戶遷移、淘汰時程的決策，並對後果負責。這類面試考的是「PM 高度的系統設計」——不要求你會寫 code，但要求你能在一輪 20-30 分鐘的對話裡，把技術約束轉成產品決策，還要讓現場工程師覺得這個決策站得住腳。

## 核心框架速記

**API 設計與版本演進框架（Use Case → Contract → Compatibility → Operability → DX）**

| 層次 | 要回答的問題 | 常見盲點 |
|---|---|---|
| Use Case | 誰呼叫這個 API？要解決什麼任務？延遲與一致性要求是什麼？ | 跳過使用情境直接討論技術規格 |
| Contract | 資源、認證方式、錯誤格式、冪等性、分頁怎麼定義？ | 把介面設計得太聰明，犧牲可預測性 |
| Compatibility | 版本策略、淘汰政策、溝通計畫是什麼？ | 把破壞性變更當成純工程決定，忽略既有客戶 |
| Operability | 流量限制、可觀測性、SLO、支援成本怎麼算？ | 只想著上線，沒想維運 |
| Developer Experience | 文件、範例、沙盒、第一次成功呼叫要多久？ | 把 DX 當成錦上添花而非核心交付 |

**ADR 速記格式（Architecture Decision Record）**——當技術決策做完，用這個格式把決策寫下來，讓團隊有共識也有回頭路：

1. **背景（Context）**：現在面臨什麼限制或壓力，為什麼現在要做這個決定
2. **決策（Decision）**：選了哪個方案，排除了哪些
3. **後果（Consequences）**：這個決定帶來什麼成本與風險，誰要承擔
4. **回頭觸發點（Revisit trigger）**：什麼情況發生時，這個決定需要重新檢視

ADR 的價值不是寫給自己看，而是讓六個月後接手的人（甚至是當初持反對意見的工程師）能看懂「為什麼當時這樣選」，不用把討論重跑一次。

## 今日練習題

### 題目

「我們要對一個公開 API 做破壞性變更（修改既有的授權機制），你會怎麼規劃淘汰計畫？」

（來源：整理自 Product HQ《Technical PM interview questions I'd actually ask》練習題庫，與 AI Interviewer《Technical Product Manager Interview Preparation》API lifecycle 題型綜合）

### 拆解思路

1. **釐清問題**：先問清楚——這個破壞性變更是為了修安全漏洞（時程被迫壓縮）還是架構重構（時程有彈性）？目前有多少活躍客戶在用舊的授權方式？
2. **盤點影響面**：拉出每個客戶、每個 endpoint 的呼叫量數據，找出「呼叫量大但遷移意願低」的高風險客戶群——這群人決定了淘汰計畫的時程下限。
3. **結構化分析**：用 Contract → Compatibility 這兩層重新檢視——能不能做一個相容層，讓舊版請求在內部被轉譯成新授權機制，爭取遷移時間，而不是要求所有客戶同時切換？
4. **提出方案**：分階段淘汰——先在回應裡加入 deprecation warning（不影響現有呼叫但提示即將變更）、發布遷移指南與程式碼範例、對高呼叫量客戶直接發信甚至一對一協助，最後才設定一個「真的會執行」的下線日期。
5. **定義成功**：追蹤的不是「公告發了沒」，而是「舊版流量佔比下降到多少」與「下線當天有沒有高流量客戶還沒遷移」這兩個領先指標，下線前兩週如果還有大客戶卡住，要有延後或額外協助的應變機制。

### 範例回答（面試時可以這樣講）

> **先框定變更的性質**：我會先確認這個授權機制的變更是出於安全考量還是架構重構——如果是安全漏洞，時程沒有太多談判空間，策略會偏向「強制但給足夠緩衝」；如果是重構，我會優先考慮能不能做一個相容層把破壞性變更吸收在後端，讓大部分客戶感覺不到變化。
>
> **接著談怎麼排優先序**：我會拉出每個客戶過去 90 天在舊授權端點的呼叫量，把客戶分成三群——呼叫量低且技術能力強的（可以快速自行遷移）、呼叫量高的頭部客戶（遷移失敗的代價最大，需要一對一支援）、呼叫量低但沒有技術資源跟進的長尾客戶（最容易被漏掉，需要自動化的提醒機制）。資源會優先放在頭部客戶身上，因為他們的遷移風險直接等於業務風險。
>
> **最後談執行節奏**：我會分四個階段——先在 API 回應標頭加入 deprecation warning 並發布遷移指南，接著對頭部客戶直接聯繫並提供遷移協助，中段設一個「軟性截止日」讓系統發出更明顯的警告但還不拒絕請求，最後才是真正的下線日期。整個過程中我會每週看一次舊版流量佔比的下降曲線，如果某群客戶的遷移速度明顯落後，代表溝通或工具沒做到位，寧可延後下線日期也不要在下線當天讓客戶的生產環境出事。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有先釐清變更性質（安全 vs 重構）以及對時程的影響 | |
| 有用客戶呼叫量數據把影響面分群，而非一視同仁 | |
| 有考慮用相容層吸收部分破壞性變更，而非直接要求全員遷移 | |
| 有提出分階段的具體淘汰計畫（警告→溝通→軟性截止→下線） | |
| 有定義領先指標（流量遷移率）而非只看「公告發了沒」 | |
| 加分項：有提到下線日期需要「真的會執行」，而非形同虛設的通知 | |

## 今日案例

**Stripe：用日期命名的 API 版本，把「誰決定何時升級」的權力交還給開發者**

Stripe 的 API 從 2011 年至今沒有強制升級過任何一個帳號。做法是每個帳號在第一次呼叫 API 時會被自動釘選（pin）在當下最新的 API 版本，之後除非開發者主動用 `Stripe-Version` header 指定或在後台手動升級，否則所有請求都沿用這個被釘選的版本。當 Stripe 要推出一個破壞性變更時，並不是直接改寫既有端點，而是新增一個以日期命名的版本（例如 `2017-02-14`），並在請求處理管線裡加入對應的「版本轉換模組」——系統會從最新版本開始，依序往回套用每一個版本轉換模組，直到轉換成呼叫端被釘選的那個版本為止。等於 Stripe 內部永遠只維護一套最新邏輯，對外卻能讓一個 2015 年就串接的帳號，看到的回應格式仍然是 2015 年的樣子（來源：Stripe 官方部落格《APIs as infrastructure: future-proofing Stripe with versioning》；Stripe 工程師 Brandur Leach 部落格《Why Doesn't Stripe Automatically Upgrade API Versions?》）。2024 年 9 月起，Stripe 進一步把節奏公開化：每月發布不含破壞性變更的小版本，每年兩次發布含破壞性變更的大版本（例如 2024-09-30 的 "acacia"），開發者可以放心升級到任何月版本而不用動既有程式碼，只有大版本才需要評估相容性（來源：Stripe API Reference《Versioning》文件）。

**面試連結**：這個案例是回答「如何在不破壞既有客戶的前提下持續演進 API」最有力的素材——核心論點是把版本相容性變成架構層的責任（版本轉換模組），而不是要求每個客戶配合公司的發布節奏；也可以用在「技術決策如何兼顧工程效率與客戶信任」這類問題，因為 Stripe 的做法本質上是用內部的工程複雜度（維護轉換模組）換取外部開發者的零遷移成本。

## 延伸閱讀

- [APIs as infrastructure: future-proofing Stripe with versioning](https://stripe.com/blog/api-versioning) — Stripe 官方部落格，完整說明版本釘選機制與版本轉換模組如何運作。
- [Why Doesn't Stripe Automatically Upgrade API Versions?](https://brandur.org/api-upgrades) — Stripe 前工程師 Brandur Leach 解釋為什麼不做自動升級、以及理論上可行的折衷方案。
- [Technical PM interview questions I'd actually ask](https://producthq.org/career/technical-product-manager/technical-product-manager-interview-questions) — 今日練習題與 API 技術決策框架的主要出處。

## 參考資料

- [APIs as infrastructure: future-proofing Stripe with versioning — Stripe Blog](https://stripe.com/blog/api-versioning) — 今日案例「版本釘選機制」與「版本轉換模組」出處。
- [Why Doesn't Stripe Automatically Upgrade API Versions? — brandur.org](https://brandur.org/api-upgrades) — 今日案例「帳號首次呼叫自動釘選版本」細節出處。
- [Versioning — Stripe API Reference](https://docs.stripe.com/api/versioning) — 今日案例「2024 年起月版本／年度大版本」節奏出處。
- [Technical PM interview questions I'd actually ask — Product HQ](https://producthq.org/career/technical-product-manager/technical-product-manager-interview-questions) — 今日練習題「API 淘汰計畫」與核心框架 Use Case → Contract → Compatibility → Operability → DX 出處。
- [Technical Product Manager Interview Preparation — AI Interviewer](https://ai-interviewer.tech/blog/technical-product-manager-interview-preparation) — 練習題 API lifecycle 深度要求（使用量數據、遷移指南、強制下線日期）出處。
