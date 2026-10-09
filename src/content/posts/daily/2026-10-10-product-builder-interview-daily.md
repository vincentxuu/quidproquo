---
title: "Product Builder 面試日練 — 2026-10-10：Technical PM"
date: 2026-10-10
category: daily
type: digest
tags: [product-builder-interview, daily, technical-pm]
lang: zh-TW
description: "用 Use Case → Contract → Compatibility → Operability → DX 框架練一道改編自 Stripe 真實案例的 API 破壞性變更題，案例是 Stripe 用 rolling dated version 與 version change module 封裝相容邏輯，六年做近百次破壞性升級卻幾乎不影響既有整合。"
tldr: "Technical PM 面試考 API 設計，真正要看的不是你會不會畫架構圖，而是你怎麼在『不能打斷任何一個現有整合』的前提下，還能讓系統往前走。今天練一道改編自 Stripe 真實歷史的題目：『你要把一個布林欄位換成列舉欄位，但已經有數千個第三方整合依賴舊格式，你會怎麼規劃這次變更？』答案框架是 Use Case → Contract → Compatibility → Operability → DX：先搞清楚誰在呼叫、呼叫的契約是什麼，再決定相容策略、維運成本與開發者體驗怎麼兼顧。案例是 Stripe 自 2011 年公司成立起維護所有 API 版本的相容性，不用 v1/v2/v3 大版號，改用以日期命名的 rolling version，把每次破壞性變更封裝進獨立的 version change module，六年內做了近百次破壞性升級，對現有整合幾乎無感。"
series:
  name: "Product Builder 面試日練"
  order: 52
---

> 🌏 [English version](/en/posts/daily/2026-10-10-product-builder-interview-daily-en)

## 今日主題

Technical PM 面試考 API 設計時，最容易讓候選人答得空洞的地方，不是「要不要支援 REST 還是 GraphQL」，而是被追問「這個欄位改了之後，已經在用舊格式的客戶怎麼辦」的時候。2026 年的 Technical PM 面試越來越少問「你懂不懂系統架構」，越來越多問「你怎麼在已經有大量外部依賴的情況下還能推進變更」——因為大多數 Technical PM 要處理的不是從零設計一個全新系統，而是在一個已經被成千上萬個第三方整合「焊死」的介面上，想辦法繼續往前走。

## 核心框架速記

**API 與技術取捨框架**不是籠統地說「要考慮相容性」，而是依序檢查五個維度，一個一個把抽象的「不要打斷客戶」拆成具體的設計決策：

| 維度 | 問題 | 決定什麼 |
|------|------|---------|
| Use Case（使用情境） | 誰在呼叫這個 API？為了什麼任務？對延遲與一致性的要求是什麼？ | 這次變更影響的是哪一群使用者 |
| Contract（契約） | 目前的欄位、型別、錯誤碼、分頁方式是什麼？ | 什麼東西絕對不能變 |
| Compatibility（相容性） | 用大版號（v1/v2/v3）還是漸進式版本？要不要自動把舊客戶釘在舊版？ | 變更推出的節奏與使用者的升級成本 |
| Operability（維運性） | 舊版本要維護到什麼時候？誰負責？維護成本會不會隨時間失控？ | 相容邏輯要不要封裝、怎麼封裝 |
| DX（開發者體驗） | 文件、changelog、警告訊息怎麼讓開發者提早知道要改什麼？ | 溝通變更的具體機制 |

這個框架的重點是：相容性不是「要或不要」的二元選擇，而是先分清楚誰在用、契約的邊界在哪裡，才能決定用什麼節奏推變更，以及怎麼讓維護成本不會隨著版本數量線性爆炸。

## 今日練習題

### 題目

「你的 API 裡有一個銀行帳戶物件，目前用一個布林欄位 `verified` 表示是否已驗證。現在產品需要更細的狀態（例如待驗證、驗證中、已驗證、驗證失敗），你打算把 `verified` 換成一個列舉型的 `status` 欄位。但這個 API 已經有數千個第三方開發者的正式環境在呼叫，而且你的公司以『絕不打斷既有整合』作為核心承諾。你會怎麼規劃這次變更？」

（來源：自擬，改編自 Stripe 官方部落格《APIs as infrastructure: future-proofing Stripe with versioning》所記錄的真實案例——Stripe 在 2014 年確實把銀行帳戶的 `verified` 布林欄位換成 `status` 欄位）

### 拆解思路

1. **釐清問題**：先問面試官「有多少比例的現存整合實際讀取 `verified` 這個欄位」「`status` 的列舉值會不會隨時間增加新值（這會影響要不要宣告成 open enum）」「這次變更除了欄位本身，有沒有連動到其他回應結構（會不會有副作用）」。
2. **定義使用者**：把呼叫者拆成兩群——剛開始整合、還沒寫死任何假設的新帳號，跟已經上線多年、程式碼可能沒人維護的舊帳號。新帳號可以直接用新契約，舊帳號才是相容性設計真正要保護的對象。
3. **結構化分析**：用 Contract → Compatibility → Operability → DX 依序檢查。Contract：`verified` 欄位的型別與名稱不能無預警消失。Compatibility：不用一次性的大版號（那等於強迫所有人重新整合），改用以日期命名的 rolling version，讓每個版本只包含一小批變更。Operability：把這次轉換邏輯封裝成一個獨立的「版本變更模組」，而不是把 if-else 判斷散落在核心程式碼裡。DX：文件與 changelog 要能自動標注「你目前的版本缺少這個欄位」。
4. **提出方案**：新帳號第一次呼叫 API 時自動釘選（pin）在當下最新版本；已經在用的帳號維持釘在他們原本的版本，直到自己選擇升級。中間用一個獨立的轉換模組，在回應產生時「往回走」，把新格式轉換成舊版本期待的格式，讓核心程式碼永遠只用最新語意寫，不用為了相容性到處加判斷。
5. **定義成功**：追蹤還釘在舊版本的帳號數有沒有隨時間自然下降（代表相容設計沒有變成永久負擔）、版本變更模組的數量是否可控（避免技術債線性累積到拖慢新功能開發）、以及這次變更上線後有沒有因為相容性問題產生的支援工單或客訴。

### 範例回答（面試時可以這樣講）

> **先框定範圍**：我不會把這當成「要不要做這個變更」的問題，而是「怎麼讓這個變更對現有客戶變成無感的事」。我會先搞清楚有多少既有整合實際依賴 `verified` 這個欄位、他們的程式碼多半寫死了什麼假設，因為相容性設計要保護的不是抽象的「所有使用者」，而是這群具體依賴舊契約的人。
>
> **接著談怎麼拆解**：我不會用大版號強迫所有人一次性重新整合，那等於把一次小變更變成所有客戶的遷移專案。我會用以日期命名的漸進式版本，讓這次變更只是眾多小版本裡的一個，新帳號自動釘在最新版本，舊帳號維持釘在原本的版本不受影響，中間用一個獨立封裝的轉換邏輯去銜接——這個轉換邏輯只活在一個模組裡，不會散落到核心程式碼裡，變成到處都要判斷版本的意大利麵條。
>
> **最後講怎麼知道有沒有做對**：我會追蹤還停在舊版本的帳號比例有沒有隨時間自然往下走，這代表相容層沒有變成永久包袱；我會盯著版本變更模組的數量，如果這個數字線性累積到失控，代表我們在用相容性換取維護成本，需要重新考慮退役舊版本的時間表；我也會確保文件與 changelog 在使用者登入時就能提示「你目前的版本缺少這個欄位」，把溝通變更的成本從人工客服轉移到系統自動完成。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有先問清楚誰依賴舊欄位、依賴程度多深 | |
| 有區分新整合與既有整合兩種使用者 | |
| 有用 Contract/Compatibility/Operability/DX 拆解變更策略 | |
| 有提出具體的版本推出機制（而非只說「要做好版本管理」） | |
| 有定義可量測的成功指標（舊版本比例下降、相容模組數量可控、支援工單量） | |
| 加分項：有講到相容性不是免費的，需要明確的退役時間表 | |

## 今日案例

**Stripe：用 rolling dated version 做到六年近百次破壞性升級、客戶幾乎無感**

Stripe 自 2011 年公司成立以來，承諾維護每一個版本的 API 相容性。它沒有用常見的 `v1`、`v2`、`v3` 大版號機制——因為大版號之間的變更幅度往往大到幾乎等於重新整合，而且總會有一群使用者卡在舊版本升不上去，最後 Stripe 得在「強迫客戶升級」跟「永久維護舊版本」之間二選一。Stripe 的做法是用發布日期命名的 rolling version（例如 `2017-05-24`），每個版本只包含一小批破壞性變更，讓升級變得像走樓梯而不是跳懸崖。使用者第一次呼叫 API 時，帳號會自動釘選在當下最新版本，之後每次呼叫都隱含套用這個版本，除非主動在請求裡指定 `Stripe-Version` 標頭或在後台手動升級。真正關鍵的設計在底層：每一次破壞性變更都被封裝進一個獨立的「版本變更模組」（version change module），核心程式碼永遠只用最新語意寫，完全不需要散落的版本判斷；產生回應時，系統會從最新版本「往回走」，依序套用每個版本變更模組，把資料轉換成呼叫者所在版本期待的格式。靠這套機制，Stripe 在六年內做了近百次破壞性升級，卻幾乎沒有打斷現有整合（來源：Stripe 官方部落格）。

**面試連結**：這個案例可以直接拿來回答「怎麼在大量第三方依賴的情況下還能持續推進 API」這類問題——用它證明「向後相容」不是靜態地凍結介面，而是把變更的複雜度封裝到一個可控的機制裡，讓核心程式碼保持乾淨，同時讓舊客戶在自己準備好之前完全不受影響。

## 延伸閱讀

- [Technical PM interview questions I'd actually ask — Product HQ](https://producthq.org/career/technical-product-manager/technical-product-manager-interview-questions) — 完整收錄 System design-lite、API 與技術取捨、工程優先序三類框架與練習題庫，今天的框架與練習題正是從這篇延伸。
- [Preparing for Stripe API upgrades — Stripe Dot Dev Blog](https://stripe.dev/blog/prepare-for-api-upgrades) — 從開發者（而非 API 提供者）的角度看同一套版本機制，補上今天案例裡「DX」那一塊的實際操作細節。
- [Versioning — Stripe API Reference](https://docs.stripe.com/api/versioning) — 這套機制在 2024 年之後的演進：改成每月發布不含破壞性變更的小版本，每半年才發布一次包含破壞性變更的大版本，呼應今天框架裡「Operability」維度隨時間調整節奏的實例。

## 參考資料

- [APIs as infrastructure: future-proofing Stripe with versioning — Stripe Blog](https://stripe.com/blog/api-versioning) — 今日案例出處，`verified` → `status` 欄位變更的真實歷史、rolling dated version 與 version change module 機制細節出處。
- [Technical PM interview questions I'd actually ask — Product HQ](https://producthq.org/career/technical-product-manager/technical-product-manager-interview-questions) — 今日核心框架「Use Case → Contract → Compatibility → Operability → DX」出處，對應今天練習題的拆解思路。
- [Versioning — Stripe API Reference](https://docs.stripe.com/api/versioning) — 延伸閱讀對應之版本機制演進細節出處。
