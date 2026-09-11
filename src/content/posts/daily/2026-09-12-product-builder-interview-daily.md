---
title: "Product Builder 面試日練 — 2026-09-12：Technical PM"
date: 2026-09-12
category: daily
type: digest
tags: [product-builder-interview, daily, technical-pm]
lang: zh-TW
description: "今日練 Technical PM 面試：用 RFC 流程和 Architecture Decision Record 讓工程判斷可被追溯,再練一道「合作夥伴逾時重試造成重複下單」的 API 設計題,案例是 Stripe 用 Idempotency-Key header 解決同一問題的作法。"
tldr: "Technical PM 題最常見的失分點,是把技術判斷講成「工程說了算」或「我全部自己決定」,講不出怎麼把決策過程開放給團隊、又不失去方向。今天用 RFC 流程收斂多方意見、用 Architecture Decision Record 留下決策的來龍去脈,再練一道「合作夥伴系統逾時後自動重試,造成重複下單」的 API 設計題——怎麼設計讓重試變安全,又怎麼知道修好了。案例是 Stripe 的 Idempotency-Key header:同一個問題,他們在支付 API 上已經解了十年,至今仍是這類題目最常被拿出來對照的答案。"
series:
  name: "Product Builder 面試日練"
  order: 24
---

> 🌏 [English version](/en/posts/daily/2026-09-12-product-builder-interview-daily-en)

## 今日主題

Technical PM 這輪考的不是「你懂不懂技術」,而是你能不能在一個具體的系統限制裡,主導出一個工程團隊會接受、且半年後還看得懂為什麼這樣決定的方案。多數人講這類題目容易停在兩個極端——「這個我不懂,交給工程判斷」或「我自己拍板,工程照做」——面試官接下來一定會問「那你怎麼讓一個不同意的資深工程師點頭」。

今天用 RFC 流程把技術決策開放給團隊評論、收斂分歧,再用 Architecture Decision Record(ADR)把決策的理由寫下來,讓 Technical PM 題不再只是喊「我很懂技術」,而是有具體的協作機制和可追溯的紀錄。

## 核心框架速記

### RFC 流程(Request for Comments)

技術決策不是一個人在會議室裡拍板,而是用一份文件把方案攤開,讓所有會被影響的人在文件裡把分歧講清楚:

| 階段 | 做什麼 | Technical PM 的角色 |
|------|------|------|
| 起草 | 寫清楚問題、目標、限制,至少列兩個方案的取捨 | 主筆或跟工程 lead 共筆,把商業限制翻譯成技術限制的語言 |
| 開放評論 | 設一個固定期限(例如 3-5 天),讓所有 stakeholder 都能留言 | 主動標記會被影響的下游團隊,不是等他們自己發現 |
| 收斂決策 | 對每條有分歧的評論回覆立場,不是全部照單全收 | 判斷哪些是個人偏好、哪些是真的風險,不能各打五十大板 |
| 定案與公告 | 標記狀態為 accepted,回寫成一份 ADR | 確保決策有可追溯的紀錄,不是散落在聊天訊息裡 |

**常見失誤**:把 RFC 當成蓋橡皮章的形式流程——評論期沒人真的看,或主導者迴避處理有分歧的評論,決策最後靠會議室裡的權力關係定案,而不是文件裡的論證。

### Architecture Decision Record(ADR)

ADR 的目的是留下「為什麼」,不是「做了什麼」——讓半年後的人(可能是你自己)看得懂當時的取捨。Michael Nygard 在 2011 年提出的四段式格式,今天仍是業界標準:

1. **Context**:當時的限制是什麼,為什麼這個決定現在非做不可
2. **Decision**:做了什麼決定,用一句話講清楚
3. **Status**:proposed / accepted / superseded——決定不是永久的,可以被之後的 ADR 取代
4. **Consequences**:這個決定帶來的好處跟代價,包含之後可能會後悔的地方

**常見失誤**:只寫 Decision 那一段,沒寫 Context 跟 Consequences——半年後沒人知道當時為什麼沒選另一個方案,同樣的辯論會重新發生一次。

## 今日練習題

### 題目

「你負責一個 B2B 平台的訂單 API。合作夥伴的系統在呼叫下單 API 時,如果在逾時前沒收到回應,會自動重試同一個請求。上線後你發現,部分合作夥伴因為這個重試機制造成重複下單,客訴開始增加。你會怎麼設計 API 讓重試變安全,又要怎麼知道這個修復真的有效?」

(題型:API 設計/技術權衡題;自擬 based on Technical PM 面試題庫中常見的重試/重複下單情境)

### 拆解思路

1. **釐清問題**:先問清楚重試發生在哪一層——是合作夥伴的 SDK 自動重試,還是他們自己寫的重試邏輯?逾時的時間窗口多長?目前 API 有沒有任何去重機制,還是完全沒有?
2. **定義使用者**:這裡的使用者是整合這個 API 的合作夥伴工程團隊,不是終端消費者。要理解他們的限制——多數合作夥伴沒辦法馬上改自己的重試邏輯,方案要在「不要求對方配合太多」的前提下解決問題。
3. **結構化分析**:核心問題是伺服器要能分辨「同一個邏輯請求的第二次嘗試」跟「使用者真的想再下一筆訂單」。這需要決定:去重的識別鍵放在哪裡、有效期多長、儲存在哪裡,以及「識別鍵一樣但內容不一樣」這種矛盾情況怎麼處理。
4. **提出方案**:要求呼叫端在請求標頭帶一個 Idempotency-Key,伺服器在一段時間內(例如 24 小時)快取這個 key 對應的處理結果——同一個 key 重試時直接回傳原本的結果,不重新執行下單邏輯;如果同一個 key 但請求內容不同,回傳明確的錯誤,而不是默默用新內容覆蓋。
5. **定義成功**:上線後追蹤「重複下單客訴數」和「因逾時重試產生的支援工單量」有沒有下降,同時要盯著 API 平均延遲有沒有因為多了一次查詢快取而上升——修好一個問題、拖慢所有請求,不算真的解決。

### 範例回答(面試時可以這樣講)

> **釐清問題**:「我會先確認重試發生在哪一層——是合作夥伴用的官方 SDK 內建自動重試,還是他們自己寫的邏輯?逾時窗口設多長?現在的 API 完全沒有去重機制,還是有但沒處理好這個情境?這會決定我是要教育合作夥伴改重試邏輯,還是把去重責任整個收回到我們這邊。」
>
> **方案設計**:「我傾向把責任收回到 API 這一層,因為要求所有合作夥伴同時改自己的重試邏輯不現實。具體做法是要求每個下單請求帶一個 Idempotency-Key,伺服器收到後先查這個 key 有沒有處理過——處理過就直接回傳原本的結果,不會再跑一次下單邏輯;如果同一個 key 帶著不一樣的訂單內容進來,我會回傳一個明確的錯誤,而不是猜測使用者的意圖,因為猜錯的代價比要求對方重新確認更高。」
>
> **成功定義與風險**:「上線後我會盯兩個指標——重複下單客訴數,還有因為逾時重試產生的支援工單量,這兩個應該要往下降。但我也會盯 API 平均延遲,因為多了一次去重查詢,如果延遲明顯上升,代表我們用效能換正確性換得不划算,要重新設計儲存方式,而不是接受這個代價。這個決定我會寫一份 ADR,記錄為什麼選擇伺服器端去重而不是要求合作夥伴改重試邏輯,免得半年後有新人又想重新討論一次。」

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點:

| 核對項目 | 有提到? |
|---------|---------|
| 區分「網路層重試」跟「使用者真的想再下一筆」這兩種情況 | |
| 提到識別鍵(idempotency key)的生命週期與儲存設計 | |
| 講清楚「識別鍵相同但內容不同」時怎麼處理,而不是默默覆蓋 | |
| 定義了具體的成功指標(客訴數、工單量) | |
| 有考慮到方案對延遲/效能的影響,不只看正確性 | |
| 加分項:提到用 RFC 或 ADR 跟工程團隊溝通這個決策,留下可追溯的紀錄 | |

## 今日案例

**Stripe:用 Idempotency-Key header 讓支付 API 的重試變安全**

Stripe 在自家 API 文件裡明確要求:呼叫端在請求標頭放一個 Idempotency-Key(建議用 V4 UUID 或其他有足夠隨機性的字串),伺服器用這個 key 辨識「這是同一個邏輯請求的重試」還是「一筆新的請求」。Stripe 在 2017 年發表的技術部落格〈Designing robust and predictable APIs with idempotency〉說明,他們官方的 Ruby 函式庫甚至內建了自動重試機制,搭配 idempotency key 使用指數退避與 jitter 的重試時間——因為在支付這個場景,「重複扣款」的代價遠比「多等一秒鐘」高得多。這套設計至今仍是 Stripe API 的核心機制,寫在現行的官方文件裡。

**面試連結**:這個案例是「合作夥伴逾時重試造成重複下單」問題的真實答案版本,可以直接拿來回答「舉一個 API 設計如何處理重試安全的例子」,或用來檢驗自己剛才的方案是不是重新發明了 Stripe 已經驗證過的模式。重點不是背 Idempotency-Key 這個名詞,而是講清楚為什麼「代價不對稱」(重複扣款代價 vs. 多一次確認的代價)決定了要把去重責任收回伺服器端,而不是留給合作夥伴自己處理。

## 延伸閱讀

- [Technical Product Manager Interview Questions: APIs, Metrics, Systems, and Product Trade-Offs](https://prachub.com/resources/technical-product-manager-interview-questions-apis-metrics-systems-and-product-trade-offs) — PracHub 整理的 Technical PM 面試題庫,涵蓋 API 契約、系統邊界、build-versus-buy 等常見情境
- [A Structured RFC Process](https://philcalcado.com/2018/11/19/a_structured_rfc_process.html) — Phil Calçado(前 DigitalOcean/SoundCloud 工程主管)整理的 RFC 流程實務做法,含評論期、狀態追蹤的具體設計
- [Designing robust and predictable APIs with idempotency](https://stripe.com/blog/idempotency) — Stripe 官方部落格說明 idempotency key 機制的設計理由與實作細節

## 參考資料

- [Idempotent requests | Stripe API Reference](https://docs.stripe.com/api/idempotent_requests) — 對應「今日案例」,Stripe 現行 API 文件中 Idempotency-Key header 的正式規格
- [Designing robust and predictable APIs with idempotency](https://stripe.com/blog/idempotency) — 對應「今日案例」,Stripe 2017 年說明 idempotency 機制設計理由的官方部落格
- [A Structured RFC Process](https://philcalcado.com/2018/11/19/a_structured_rfc_process.html) — 對應「核心框架速記」RFC 流程的階段設計
- [Technical Product Manager Interview Questions: APIs, Metrics, Systems, and Product Trade-Offs](https://prachub.com/resources/technical-product-manager-interview-questions-apis-metrics-systems-and-product-trade-offs) — 對應「今日練習題」重試/重複下單情境的題庫來源
