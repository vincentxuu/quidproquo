---
title: "Product Builder 面試日練 — 2026-09-26:Technical PM"
date: 2026-09-26
category: daily
type: digest
tags: [product-builder-interview, daily, technical-pm]
lang: zh-TW
description: "今日練 Technical PM:用 RFC 流程與 ADR(Architecture Decision Record)拆解「核心 API 要不要做 breaking change」這道情境題,案例是 Stripe 用日期命名版本讓現有整合十幾年不用改一行程式碼。"
tldr: "Technical PM 面試最容易穿幫的地方,是被問「這個 API 要怎麼升級」時,只會說「多寫一版文件」,答不出工程團隊維護雙版 schema 的實際成本,也答不出怎麼幫還沒升級的客戶爭取時間卻不拖垮整個團隊的路線圖。今天練一道情境題:B2B API 平台的核心 resource 要把單一數字欄位改成巢狀物件以支援多幣別,工程 lead 想直接在下一版強制升級。答案框架是 RFC 流程(Problem → Options → Decision → Cost)把技術決策攤開來討論,搭配 ADR 把「為什麼選這個方案、放棄了什麼」寫成有時效性的紀錄。案例是 Stripe 的日期命名 API 版本系統——每月發相容版本、每半年才發一次可能有 breaking change 的具名大版本(如 2026-08-26.dahlia),讓 2012 年寫的整合程式碼到今天都還能跑,靠的不是「不做 breaking change」,而是把 breaking change 的成本主動吸收在自己身上,而不是丟給客戶。"
series:
  name: "Product Builder 面試日練"
  order: 38
---

> 🌏 [English version](/en/posts/daily/2026-09-26-product-builder-interview-daily-en)

## 今日主題

Technical PM 面試裡最常見的陷阱,是被問「這個 API 要怎麼升級」或「這個系統設計有什麼取捨」時,只能講出「我會跟工程team溝通」這種沒有內容的空話——答不出具體要用什麼流程讓決策攤開來討論,也答不出工程團隊維護舊版相容的真實成本會落在誰身上。

這個主題在面試中重要,是因為它同時考驗你有沒有能力在不寫 code 的情況下,理解一個技術決策的架構後果;也考驗你能不能設計出一套流程,讓「這個決定為什麼是這樣」在半年後還查得到,而不是全靠某個工程師的記憶。Amazon PM-T 的技術深度輪面試就明講,面試官要看的正是候選人「能不能看出一個設計太複雜、或限制了未來的可擴展性」,而不是要你自己畫架構圖。

## 核心框架速記

### RFC 流程(Request for Comments)

工程團隊在做有架構後果的決策前,先寫一份文件讓相關人審閱,而不是直接開始寫程式碼:

| 步驟 | 內容 | 面試時的用法 |
|------|------|------------|
| Problem(問題) | 現況卡在哪裡,為什麼現在必須決定 | 先講清楚「不做這個決定會怎樣」,而不是直接跳到解法 |
| Options(選項) | 至少列出 2-3 個可行方案,含各自的優缺點 | 一定要講出你放棄的選項,以及放棄的理由——這才顯示出你真的評估過 |
| Decision(決策) | 選了哪個方案、由誰拍板 | 講清楚決策的邊界:這次決定的範圍是什麼,不包含哪些後續問題 |
| Cost(成本) | 這個決定要花多少工程時間、對既有使用者的影響、要維護多久 | 面試官最想聽到這段——沒有成本評估的技術決策,聽起來像沒做過功課 |

**面試時的用法**:被問「你會怎麼推動一個有爭議的技術決策」時,不要只講「開會討論」,要講出你會用 RFC 把「問題→選項→決策→成本」寫下來讓工程團隊書面審閱,因為書面討論能讓有異議的人先在文件裡提出,而不是等到開發到一半才翻案。

### ADR(Architecture Decision Record)

RFC 決議之後留下的精簡紀錄,通常只有 Context(當時的背景與限制)、Decision(做了什麼決定)、Consequences(這個決定帶來的後果,包含好的和壞的)三段。

**面試時的用法**:被問「半年前的技術決策,你怎麼確保新加入的工程師能理解」時,要講清楚 ADR 跟一般會議記錄的差別——ADR 特別會寫下「當時考慮過但放棄的選項」,這樣未來有人想重新提案同一個方案時,能直接看到當初為什麼沒選,不用重新吵一次。

## 今日練習題

### 題目

「你是一家 B2B API 平台的 Technical PM,平台已經有 300 多家企業客戶串接你們的核心 API。工程團隊發現,要支援客戶要求已久的多幣別功能,最乾淨的做法是把某個核心 resource 裡的 `amount` 欄位,從單一數字改成 `{value, currency}` 的巢狀物件——這是一個 breaking change。工程 lead 希望直接在下一個版本強制升級,理由是同時維護新舊兩種 schema 太痛苦,而且多數客戶遲早都要升級。身為 PM,你要怎麼決定這個 breaking change 要怎麼推出?」

(來源:自擬,情境設計參考 Stripe API 版本控管公開文件與工程部落格)

### 拆解思路

1. **釐清問題**:先問工程team——如果不做 breaking change,用「新增一個欄位、舊欄位繼續保留」的 additive 方式能不能做到?如果技術上真的不行,再問清楚有多少比例的現有客戶會被這個改動影響,以及這些客戶的技術資源夠不夠自己升級。
2. **定義使用者**:至少要分兩種客戶——技術資源充足、有專職工程team維護整合的大型企業客戶;以及可能是一人團隊、串好就很少回頭維護的中小型開發者。方案不能假設所有客戶都能在同一時間窗口內完成遷移。
3. **結構化分析**:用 RFC 走一輪——Problem(現有 schema 無法表達幣別)、Options(A. 直接覆寫 breaking change、B. 新增欄位並行維護、C. 版本化 API,讓新舊客戶各自停留在自己 pin 住的版本)、Decision 與 Cost(每個選項對工程team的長期維護成本、對客戶的遷移成本)。用 ADR 把最終選擇和放棄的選項記下來,方便半年後新人理解。
4. **提出方案**:採用版本化 API 而不是直接覆寫——讓現有客戶預設停留在他們串接時的版本,新客戶預設拿到新版本,同時發布 migration guide 跟自動化遷移工具,把「維護多版本」的成本放在平台這一側吸收,而不是要求客戶被動接受破壞性改動。
5. **定義成功**:主要指標是「主動升級到新版本的客戶比例」與遷移期間 support ticket 數量有沒有異常上升;護欄指標是舊版本 API 的錯誤率或延遲有沒有因為要維護多版本而變差——因為版本化策略如果拖垮了系統可靠度,對客戶造成的傷害會比一次性 breaking change 更大。

### 範例回答(面試時可以這樣講)

> **問題釐清與定位**:「我會先確認技術上真的沒有 additive 的做法——如果新增一個 `amount_details` 欄位、舊的 `amount` 欄位繼續保留能達到同樣效果,那根本不需要 breaking change。假設工程team確認真的做不到,我會接著去看這 300 家客戶裡,有多少比例是靠自己工程team維護整合、又有多少是小團隊串完就很少回來維護的,因為這會決定我們能不能強制在一個時間點切換。」
>
> **結構化分析與方案**:「我會用 RFC 把三個選項攤開來寫清楚——直接覆寫、新舊欄位並行、或是版本化 API,每個選項都寫上對工程team的長期維護成本跟對客戶的遷移成本。我會選版本化 API,讓現有客戶預設停留在他們串接當下的版本,新客戶才拿到新的 schema,再搭配 migration guide 跟遷移工具。這跟直接覆寫的差別是,我們把『同時維護多版本』的成本主動吸收在自己team身上,而不是把破壞性改動丟給客戶——這也是我準備這題時,看到 Stripe 版本系統設計裡最核心的判斷。決定之後我會寫成 ADR,記下我們為什麼放棄直接覆寫,方便半年後新加入的工程師理解,不用重新吵一次。」
>
> **成功定義**:「我會追蹤主動升級到新版本的客戶比例,還有遷移期間 support ticket 數量有沒有異常增加,這樣才知道客戶是不是真的能順利升級,而不是我們自己覺得文件寫得夠清楚。但我也會盯著護欄指標——舊版本 API 的錯誤率跟延遲有沒有因為要同時維護兩套 schema 而變差,因為如果版本化策略拖垮了系統可靠度,對客戶造成的傷害會比一次性的 breaking change 更嚴重。」

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點:

| 核對項目 | 有提到? |
|---------|---------|
| 先確認有沒有 additive 做法能避免 breaking change,而不是直接接受工程team的前提 | |
| 區分技術資源充足與資源有限的兩種客戶群,而非假設所有客戶能同時遷移 | |
| 用 RFC 把選項與各自成本攤開,而不是直接拍板單一方案 | |
| 提到用 ADR 留下決策紀錄,方便未來查詢與交接 | |
| 成功指標同時包含遷移進度與系統可靠度護欄指標 | |
| 加分項:提到把維護成本主動放在平台端吸收,而非轉嫁給客戶 | |

## 今日案例

**Stripe:用日期命名版本,讓 2012 年寫的整合程式碼到今天都還能跑**

Stripe 的 API 版本系統是「不用『不做 breaking change』來解決 breaking change 問題」的代表案例。從 2024 年 9 月的 acacia 版本開始,Stripe 每個月都會發一個新的 API 版本,但保證這些月度版本完全向後相容,客戶不用改任何程式碼就能安全升級;真正可能包含破壞性改動的,是每半年才發一次、各自有代號的大版本(例如 2025 年的 basil、目前最新的 2026-08-26.dahlia)。客戶的帳號會 pin 在自己串接時的版本,除非主動升級,否則系統會一直用當初那個版本處理請求與 webhook。工程team公開寫過,他們刻意不做「自動幫客戶升級」這件事,正是因為一次沒溝通好的自動升級可能直接讓客戶的金流整合壞掉。當歐盟 SCA(強制多步驟身份驗證)法規上路、原本的 charge 物件無法表達「這筆交易需要非同步的多步驟驗證」時,Stripe 沒有硬改舊物件,而是設計了全新的 PaymentIntents 物件,把新的業務現實變成新的架構原語,再提供遷移工具跟指南——把「維護相容性」的成本,實實在在地放在自己工程team身上。

**面試連結**:這個案例是「B2B API 平台要不要強制升級 breaking change」這道情境題的真實對照版本,可以直接拿來回答「舉一個你認為做得好的 API 設計案例」,也可以用來檢驗自己的方案有沒有漏掉關鍵細節——尤其是「破壞性改動的成本該由誰承擔」跟「用新的架構原語表達新的業務現實,而不是硬改舊物件」,正是 RFC 流程裡 Cost 這一欄最容易被面試者輕描淡寫帶過的地方。

## 延伸閱讀

- [Amazon Technical Product Manager (PM-T / PMT) Interview Guide](https://www.tryexponent.com/guides/amazon-technical-product-manager-interview) — Amazon PM-T 技術深度輪的完整拆解,含面試官在意的架構流暢度與工程協作評分標準
- [Product at Stripe: a case study in developer-first product strategy](https://www.uladshauchenka.com/p/product-at-stripe-a-case-study-in) — 完整拆解 Stripe 把 API 版本控管、冪等性、SCA 遷移當成產品決策而非純工程問題的方法論
- [Architecture: Write It Down Before Rewriting](https://dev.to/fattakhov/architecture-write-it-down-before-rewriting-2lcl) — RFC 與 ADR 的實務流程,含「哪些改動需要走 RFC、哪些不用」的判斷門檻

## 參考資料

- [Amazon Technical Product Manager (PM-T / PMT) Interview Guide](https://www.tryexponent.com/guides/amazon-technical-product-manager-interview) — 對應「今日主題」中 Amazon PM-T 技術深度輪的評分標準
- [Product at Stripe: a case study in developer-first product strategy](https://www.uladshauchenka.com/p/product-at-stripe-a-case-study-in) — 對應「今日案例」中 PaymentIntents 與版本控管哲學的完整脈絡
- [Stripe API Versioning](https://docs.stripe.com/api/versioning) — 對應「今日案例」中月度相容版本與具名大版本的官方版本控管機制說明
