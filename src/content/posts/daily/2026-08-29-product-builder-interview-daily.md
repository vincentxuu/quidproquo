---
title: "Product Builder 面試日練 — 2026-08-29：Technical PM"
date: 2026-08-29
category: daily
type: digest
tags: [product-builder-interview, daily, technical-pm]
lang: zh-TW
description: "今日練 Technical PM 面試：用「PM 系統設計四步法」與 ADR 拆解 API breaking change 決策，練一道『客戶要求破壞既有格式』的真實面試題。"
tldr: "Technical PM 面試考的不是你會不會寫程式，是你能不能把一個技術決策（要不要接受 breaking change）講成一個工程師會認同的產品判斷。今天用「釐清→草擬→拆解取捨→回扣產品」四步法搭配輕量版 ADR，練一道 API 版本控管的真實題，並對照 Stripe 用 idempotency key 把「網路重試會不會重複扣款」這個不確定性收斂成一紙契約的做法。"
series:
  name: "Product Builder 面試日練"
  order: 10
---

> 🌏 [English version](/en/posts/daily/2026-08-29-product-builder-interview-daily-en)

## 今日主題

Technical PM 面試考的重點,不是你有沒有工程背景、寫不寫得出程式,而是當一個技術決策擺在你面前——像是「要不要接受這個 API 的破壞性變更」——你能不能講出一個工程師會認同、又能對業務負責的判斷。這類題目常見於平台型產品、開發者工具、或任何有對外 API 的公司,面試官想看的是你有沒有把「技術限制」當成產品決策的輸入,而不是丟給工程團隊自己解決的黑盒子。

多數候選人的盲點,是把 Technical PM 準備成「PM 準備 + 硬技術知識」的疊加——多背幾個系統設計名詞、多練幾道 SQL,就以為過關了。但研究者發現,面試官真正在測的是第三種能力：能不能把一個模糊的技術情境,收斂成一個有明確取捨、可以被追蹤驗證的決策。今天要練的,就是這個收斂過程。

## 核心框架速記

**框架一：PM 系統設計/API 決策四步法**

面對任何技術決策題,不要直接跳進畫圖或列選項,先照這個順序走：

| 步驟 | 要做的事 | 常見失誤 |
|------|---------|---------|
| 1. 釐清 | 問清楚使用者、規模、限制條件,把模糊的題目收斂成具體範圍 | 沒問就開始畫架構圖,設計了一個不存在的問題 |
| 2. 草擬 | 畫出關鍵元件與資料流,點出一到兩個要優化的指標 | 一開始就深入單一元件的實作細節 |
| 3. 拆解取捨 | 針對每個關鍵決策點,講出「這樣做犧牲了什麼、換到了什麼」 | 只列選項不選,或用「看情況」帶過 |
| 4. 回扣產品 | 把技術選擇連回使用者體驗或商業指標,再收尾 | 講完架構就結束,沒人知道這跟產品有什麼關係 |

**框架二：輕量版 Architecture Decision Record（ADR）**

Technical PM 常需要「留下決策紀錄」讓工程團隊事後能追溯為什麼這樣選,面試中被問到任何技術取捨題,都可以用這個結構回答：

- **背景（Context）**：現在的限制是什麼、為什麼現在必須決定
- **決策（Decision）**：選了哪一條路
- **考慮過的替代方案（Alternatives）**：至少講一個沒選的選項,以及為什麼沒選
- **後果（Consequences）**：這個決策會在未來製造什麼新問題,以及怎麼監控

## 今日練習題

### 題目

你負責一個對外開放的 partner API。一個重要客戶要求你們在既有的回傳格式裡新增一個必要欄位,但工程團隊告訴你,這個改動會讓所有還在解析舊格式的客戶端全部壞掉,是一個 breaking change。你會怎麼處理?

（來源：自擬,綜合 PracHub Technical PM 面試指南 API 版本控管情境）

### 拆解思路

1. **釐清問題**：先確認這是不是真的必須 breaking——新增欄位如果客戶端有做好「忽略未知欄位」的容錯,通常不算破壞;只有改變既有欄位的型別或語意才是真正的 breaking change。同時問清楚有多少客戶端在用這支 API、他們的版本更新週期多長。
2. **定義使用者**：對外 API 的使用者要分兩層看——直接整合的開發者,以及背後受影響的終端使用者。哪些是流量前幾大、值得專案經理親自去談的關鍵客戶,哪些是可能已經沒人維護的長尾舊版本。
3. **結構化分析**：套用「API 相容性檢查」——這個變更影響的是新增資源、還是改變既有契約?如果真的是後者,走版本化路徑(URL `/v2` 或 header-based versioning),而不是直接動 `/v1` 底下的既有客戶。
4. **提出方案**：優先方案是把新欄位設計成可選、不影響舊解析邏輯;如果客戶堅持要的是真正不相容的改動,就開一個新版本,兩個版本並行一段淘汰窗口(例如 60 至 90 天),用 API gateway 的呼叫量紀錄找出還在用舊版的客戶,主動通知用量最大的前幾名。
5. **定義成功**：用「舊版本呼叫量下降曲線」和「客戶遷移完成率」當主要指標,同時盯 support ticket 數與非預期的 4xx 錯誤率當 guardrail。訂一個明確的時間點,如果某個關鍵客戶到期仍未遷移,要有事先講好的升級或延後決策,而不是臨時現場拍板。

### 範例回答（面試時可以這樣講）

> **先確認問題的邊界**：我會先問工程團隊,這次要新增的欄位,是不是真的會讓現有客戶端解析失敗——如果只是新增一個可選欄位,而客戶端本來就該對未知欄位容錯,那其實不需要走 breaking change 這條路,只是文件沒寫清楚相容性保證。假設確認後這真的是不相容的改動,我會先盤點目前用這支 API 的客戶數量與各自的呼叫量分布。
>
> **再決定怎麼分階段**：我不會直接改掉現有版本,而是開一個新版本、讓兩版並行。設一個明確的淘汰窗口,比如 90 天,並用 API gateway 的紀錄找出用量前 10% 的舊版客戶,主動寄信通知並提供遷移指南,而不是等他們自己發現壞掉才來找我們。這個決策的取捨很清楚：多維護一個版本會增加短期的工程負擔,但換到的是不會因為一次改動就讓所有整合方同時斷線。
>
> **最後回到怎麼衡量**：我會追蹤舊版本呼叫量的下降曲線和遷移完成率,如果窗口過了一半、還有大客戶完全沒動靜,我會主動安排一次對話,而不是讓淘汰日期硬性生效造成對方系統中斷。這個機制的核心,是把「這個 API 契約會怎麼演化」講清楚,讓下游團隊能規劃,而不是等我們臨時通知。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有先確認這是不是真的必須 breaking，而非直接假設 | |
| 有區分「新增欄位」與「改變既有契約」兩種情境 | |
| 有具體的版本化與淘汰窗口方案（而非只說「我們會溝通」） | |
| 有定義追蹤指標（呼叫量下降、遷移完成率、guardrail） | |
| 有講到對關鍵客戶的個別處理，而非一體適用 | |
| 加分項：有主動提到監控與升級決策點，而非等問題發生才反應 | |

## 今日案例

**Stripe：用 idempotency key 把「重試會不會重複扣款」收斂成一紙契約**

Stripe 為它的支付 API 設計了 idempotency key 機制——客戶端在建立一筆扣款請求時附上一個自訂的唯一 key,如果同一把 key 在 24 小時內重複送出(例如網路逾時後客戶端自動重試),Stripe 會直接回傳第一次呼叫的結果,不會重複執行扣款。這個設計的核心洞察是：對支付 API 來說,「請求失敗」和「扣款是否真的發生」是兩件事,客戶端經常無法確定,與其要求每個整合方自己處理這個模糊地帶,不如把冪等性做成 API 的一等公民。這個決策也直接影響了 Stripe 在開發者社群中「好整合、值得信任」的口碑。

**面試連結**：這個案例可以直接拿來回答「怎麼設計一個交易類 API」或「什麼是好的 API 設計」這類問題,重點是示範「把一個模糊的不確定性(重試會不會產生副作用)收斂成一個明確、可驗證的 API 契約」的能力——這正是 Technical PM 面試官最想聽到的層次,而不是列一串 REST 端點。

## 延伸閱讀

- [System Design Questions for Product Managers (+ how to answer)](https://igotanoffer.com/en/advice/system-design-questions-product-managers) — 完整的 4 步驟 PM 系統設計答題框架與多間公司真題拆解。
- [Technical Product Manager Interview Questions: APIs, Metrics, Systems, and Product Trade-Offs](https://prachub.com/resources/technical-product-manager-interview-questions-apis-metrics-systems-and-product-trade-offs) — API 契約、淘汰窗口、build-vs-buy 的實戰框架整理。
- [System Design for PMs: A Comprehensive Guide](https://sirjohnnymai.com/blog/system-design-for-pms/) — 說明 PM 系統設計與工程系統設計評分重點的差異。

## 參考資料

- [Technical Product Manager Interview Questions (2026)](https://www.kore1.com/technical-product-manager-interview-questions-2026/) — 對應「今日主題」中 Technical PM 面試考察的三個維度（系統流暢度、平台判斷、跨團隊信任）。
- [Technical Product Manager Interview Questions (and how to crack them)](https://igotanoffer.com/blogs/product-manager/technical-interview-questions) — 對應「核心框架速記」中的四步驟決策框架來源。
- [Technical Product Manager Interview Questions: APIs, Metrics, Systems, and Product Trade-Offs](https://prachub.com/resources/technical-product-manager-interview-questions-apis-metrics-systems-and-product-trade-offs) — 對應「今日練習題」中 breaking change 與淘汰窗口的處理方式。
- [Idempotent requests | Stripe API Reference](https://docs.stripe.com/api/idempotent_requests) — 對應「今日案例」中 Stripe idempotency key 機制的技術細節。
