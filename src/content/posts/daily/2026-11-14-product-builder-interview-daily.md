---
title: "Product Builder 面試日練 — 2026-11-14：Technical PM"
date: 2026-11-14
category: daily
type: digest
tags: [product-builder-interview, daily, technical-pm]
lang: zh-TW
description: "Technical PM 面試日練：用 Stripe 2014 年把 verified 欄位換成 status 的真實案例，練習怎麼讓 API 新增功能又不打斷已整合客戶的系統。"
tldr: "核心框架是 API 相容性分類：新增欄位安全，改名稱或型別才算破壞性變更，破壞性變更改用以日期命名、首次呼叫自動 pin 住的版本機制處理；練習題是工程團隊想改掉一個兩百家客戶都在用的欄位，你怎麼讓新功能照樣上線。"
series:
  name: "Product Builder 面試日練"
  order: 87
---

> 🌏 [English version](/posts/daily/2026-11-14-product-builder-interview-daily-en)

## 今日主題

Technical PM 面試常考的情境，不是「你會不會寫程式」，而是工程團隊丟出一個技術限制時，你能不能先分辨清楚：這是真的沒辦法，還是只是其中一種做法沒辦法。copilotinterview.com 整理的 TPM 面試框架說得很直接，技術輪要看的是「你的理解到哪一層就停了」——面試官會一路往下問，看你是不是真的懂，還是只是會背名詞。今天用 API 變更最常見的場景練這件事：工程團隊說一個欄位非改不可，但已經有一堆客戶在用舊版本，你怎麼讓新功能上線又不讓舊客戶的系統壞掉。

## 核心框架速記

### API 變更相容性分類

不是每個「改 API」都一樣危險，先把變更分類，才知道該用哪種做法：

| 變更類型 | 範例 | 對既有客戶的影響 |
|---------|------|-----------------|
| 新增端點 | 加一個全新的 API | 不影響任何人，安全 |
| 新增欄位 | 回應多一個從沒出現過的欄位 | 不影響任何人，安全 |
| 改名稱或型別 | 把 boolean 欄位換成 enum | 讀取這個欄位的既有程式碼會直接壞掉，破壞性變更 |
| 改預設行為 | 原本不回傳的欄位現在預設回傳 | 看客戶程式碼怎麼寫，通常也算破壞性變更 |

### 破壞性變更的處理：以日期命名的滾動版本

真正的破壞性變更不代表要停下來協調所有客戶一起升級。Stripe 的做法是用日期命名版本（例如 `2017-05-24`），客戶第一次呼叫 API 時自動 pin 住當下最新版本，之後除非自己主動升級，呼叫都維持同一份行為契約；要用新版本就在請求帶 `Stripe-Version` header 或在後台手動升級。這跟傳統的 `v1`／`v2` 大版本比，差別在於每次變更範圍很小，客戶不會被迫一次吞下一大包不相容的改動。

把這兩層合起來看：**判斷權該留在工程端——這個變更到底算不算破壞性，是技術問題；但要不要為了新功能逼既有客戶立刻升級，這是 PM 該權衡的商業判斷，而且要用一套機制（而不是一次性協調）去解決，才不會每次改 API 都要重新吵一輪。**

## 今日練習題

### 題目

你是一個 B2B API 平台的 PM。工程團隊想把一個欄位的型別從目前的 boolean（`verified`）改成更有表達力的 enum（`status`，值包含 `verified`／`pending`／`failed`），因為新功能需要區分「審核中」和「審核失敗」這兩種狀態，現在的 boolean 做不到。問題是已經有 200 多家企業客戶的整合程式碼直接讀這個 boolean 欄位，一旦型別或名稱變了，他們的系統會直接解析失敗。CEO 想在下個季度上線這個新功能，你會怎麼推進？

(來源: 自擬，依據 Stripe 在 2014 年把銀行帳戶的 `verified` boolean 換成 `status` 欄位的真實 API 變更，出處見下方「今日案例」)

### 拆解思路

1. **釐清問題**：先確認工程團隊是不是真的要「覆蓋」現有欄位，還是只是提案裡沒想到別的做法——如果新增一個獨立欄位就能表達審核中/失敗，根本不用動到舊欄位，也就沒有破壞性變更這個問題。
2. **定義影響範圍**：哪些客戶的整合依賴這個欄位、這些客戶占的呼叫量或營收比重多大，新客戶和舊客戶的比例如何——這決定了「立刻切換」的代價有多高。
3. **結構化分析**：套用 API 相容性分類，把「改名稱或型別」釐清為破壞性變更，不能直接動；再看能不能用「新增欄位」滿足新功能需求，同時維持舊欄位不變。
4. **提出方案**：新增一個獨立的 `status` 欄位（additive，不影響任何既有客戶），`verified` 欄位維持原本的語意繼續回傳；新功能基於 `status` 開發，不等舊客戶遷移。如果未來真的要讓 `verified` 退役，另外走日期命名的版本升級路徑，讓客戶自己選時間點。
5. **定義成功**：新功能能在這個季度上線、既有 200 多家客戶的整合 0 個因此壞掉、未來要不要讓舊欄位退役是獨立的時程，不卡在這次發布上。

### 範例回答（面試時可以這樣講）

> **先確認這是不是真的無路可退**：聽到「要改欄位型別」，我第一個問題是問工程團隊：如果新增一個獨立的 `status` 欄位，舊的 `verified` 完全不動，能不能滿足新功能的需求？結果發現可以——工程一開始提的是「順手把舊欄位改乾淨」，不是新功能的必要條件。
>
> **把兩件事分開看**：新功能要不要上線，和舊欄位要不要退役，其實是兩個獨立的決定，沒必要綁在一起。我們這季只做新增欄位，保留 `verified` 繼續照舊規則算，新功能全部基於 `status` 開發。既有 200 多家客戶的整合完全不受影響，CEO 要的時程也不會被遷移協調卡住。
>
> **把退役這件事留一條路，但不急**：如果之後真的想讓舊欄位退役，我會建議走 Stripe 那種以日期命名的版本升級——帳號第一次呼叫時自動 pin 住當下版本，要升級的客戶自己選時間點帶新的版本號進來，而不是訂一個全員強制遷移的死線。這樣我們隨時可以推進 API 演進，但不會每次都要跟客戶打一場協調戰。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 問題定義：先確認是不是真的沒有 additive 的替代方案 | |
| 影響範圍：哪些客戶、多大比重會被破壞性變更打到 | |
| 框架運用：用相容性分類區分「安全」與「破壞性」變更 | |
| 具體方案：新功能上線與舊欄位退役拆成兩條獨立時程 | |
| 成功指標：既有整合 0 錯誤、新功能照常上線 | |
| 加分項：知道判斷「算不算破壞性變更」留給工程，但要不要為此逼客戶升級是 PM 的商業判斷 | |

## 今日案例

**Stripe 2014 年把 `verified` boolean 換成 `status` 欄位，之後長出一套滾動版本機制**

Stripe 工程部落格的文章〈APIs as infrastructure: future-proofing Stripe with versioning〉（Brandur Leach, 2017）裡提到一個具體例子：早期銀行帳戶端點用一個 boolean 欄位 `verified` 表示驗證狀態，2014 年他們把它換成了 `status` 欄位，因為需要表達更多種狀態。這個變更本身是破壞性的——任何讀取 `verified` 這個欄位的既有程式碼都會壞掉。Stripe 的做法不是逼所有客戶在同一天切換，而是沿用他們既有的「以日期命名、逐次小範圍破壞性變更」的版本機制：客戶帳號第一次呼叫 API 時自動 pin 住當時最新的版本，之後除非自己主動用 `Stripe-Version` header 或在後台升級，行為契約都不會變。文章裡提到，這套機制讓他們在六年內做了將近一百次破壞性升級，卻從來不需要走傳統的 `v1`／`v2` 大版本遷移。

**面試連結**：這個案例可以直接拿來回答「怎麼在不犧牲既有客戶信任的前提下讓產品／API 持續演進」類的問題——重點不是展示你懂 API 設計術語，而是示範你知道「破壞性變更」和「要不要逼客戶立刻升級」是兩層不同的決定，而且第二層可以靠機制解決，不用每次靠協調。

## 延伸閱讀

- [APIs as infrastructure: future-proofing Stripe with versioning](https://stripe.com/blog/api-versioning) — 今日案例與核心框架「滾動版本」做法的原始出處。
- [Google Technical Program Manager Interview Questions 2026](https://dataford.io/interview-guides/google/technical-program-manager) — 延伸練習：在架構模式之間做 tradeoff analysis 的面試題型。
- [AI Interview Assistant for Technical Program Manager Interviews](https://copilotinterview.com/blog/ai-interview-assistant-for-technical-program-managers) — 說明 TPM／Technical PM 技術輪實際在測什麼：技術深度、而不是背名詞。

## 參考資料

- [APIs as infrastructure: future-proofing Stripe with versioning](https://stripe.com/blog/api-versioning) — 今日主題、核心框架、今日案例引用的 `verified`→`status` 變更與滾動版本機制，皆出自此文。
- [AI Interview Assistant for Technical Program Manager Interviews](https://copilotinterview.com/blog/ai-interview-assistant-for-technical-program-managers) — 今日主題開頭引用的「技術輪測的是理解深度」說法。
- [Google Technical Program Manager Interview Questions 2026](https://dataford.io/interview-guides/google/technical-program-manager) — 延伸練習：架構模式間的 tradeoff analysis 題型佐證。
