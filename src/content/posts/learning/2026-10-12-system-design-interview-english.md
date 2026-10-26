---
title: "系統設計面試怎麼講：問規模、劃範圍、講取捨、下決定的十二句"
date: 2026-10-12
category: learning
type: guide
tags: [english-speaking, english, speaking, language-learning]
lang: zh-TW
description: "系統設計面試沒有程式碼，四十五分鐘幾乎都在講話。這篇整理十二句：開場怎麼問使用者數、流量與讀寫比，怎麼劃範圍、說出假設、把細節先放著，怎麼講一個做法的代價、怎麼下決定、怎麼指出瓶頸與當場改口。句子來自 System Design Primer、Google 官方的面試說明，以及 interviewing.io 三場模擬面試的逐字稿。"
tldr: "開場問 How many users are there? 和 What is the expected read to write ratio?；先放著的細節說 I'm going to put a pin in that；講代價用 …but it will come at the cost of latency；比較完要下決定：I'm going to go with an event queue because I'd rather…；講完一段問 Do you think that makes sense?。"
series:
  name: "英文口說練習"
  order: 14
draft: false
---

> 🌏 [English version](/posts/learning/2026-10-12-system-design-interview-english-en)

這是面試口說的第三塊。[寫程式面試](/posts/learning/2026-10-12-coding-interview-english)和[被追問時怎麼接](/posts/learning/2026-10-12-interview-thinking-time-english)之後，剩下系統設計面試。

這篇例句取自模擬面試逐字稿的選取片段，不是真實徵才面試的完整紀錄。文字轉錄可能有辨識誤差，也沒有逐句對照原音；可用來練需求、取捨與追問，不用來判定術語語域、英美差異或容量數字的唸法。

## 我當時想說什麼

系統設計面試不寫程式。[Google 官方的說明影片](https://www.youtube.com/watch?v=Gg318hR5JY0)開頭就講了兩件事：

> You will not be coding in this interview. There will also be significant time constraints. We'll expect you to gather requirements and to develop an initial solution in the first 20 minutes.

```youtube
url: https://www.youtube.com/watch?v=Gg318hR5JY0
title: Life at Google：Prepare for Your Google Interview: Systems Design（Google 官方的系統設計面試說明）
```

所以整場都在講話，而且題目是故意講得不清楚的。同一支影片說：

> The problem you will solve during your interview will be deliberately underspecified. … You will need to ask clarifying questions.

我要練的是三段話：

1. 開場問清楚規模和範圍
2. 邊畫邊講，把假設和先跳過的東西說出口
3. 講取捨、下決定、指出弱點

這次的來源：

- 雇主的官方說明：Google 的 *Prepare for Your Google Interview: Systems Design* 影片。只有要求，沒有示範對話
- 社群教材：GitHub 上的 [System Design Primer](https://github.com/donnemartin/system-design-primer#how-to-approach-a-system-design-interview-question)，「怎麼著手」那一節列了可以直接問的問題
- 模擬面試平台的指南：interviewing.io 的 [System Design Interview Guide](https://interviewing.io/guides/system-design-interview)
- 模擬面試的逐字稿：interviewing.io 公開的三場系統設計模擬面試。這是實際的對話，由語音轉成文字，講話的人都是匿名

逐字稿每場有四萬到六萬字元。我沒有從頭讀到尾，而是依功能搜尋應徵者的說法，再讀那一句前後的段落。

## 在這個情境可以怎麼說

### 一、開場：問規模，劃範圍

| 想說的意思 | 這個情境可用的說法 | 和來源的關係 |
| --- | --- | --- |
| 我想先列出功能需求。 | The first thing I want to lay out is the functional requirements. | 原句 |
| 有多少使用者？ | How many users are there? | 原句 |
| 預期每秒有多少請求？ | How many requests per second do we expect? | 原句 |
| 預期的讀寫比是多少？ | What is the expected read to write ratio? | 原句 |
| 刪除的情況要包含在這次的設計範圍裡嗎？ | Do you want to handle the delete case in the scope of this design? | 改寫 |

中間三句是 System Design Primer 的原句。它把第一步叫做 *Outline use cases, constraints, and assumptions*，列了八個問題，另外幾個是 *Who is going to use it?*、*How are they going to use it?*、*How much data do we expect to handle?*。

Google 的說明也要求數字：*We want to see numeric estimates for these properties, such as how many requests per second the system can handle.*

第一句和最後一句出自模擬面試。[存貨與訂單那一場](https://interviewing.io/mocks/faang-system-design-inventory-orders)的應徵者一開口就說 *the first thing I want to lay out is the functional requirements*。[相片分享那一場](https://interviewing.io/mocks/faang-system-design-photo-sharing-service)的應徵者問 *do you want to go through the delete case in the scope of this design or should we just… handle the creation and the visibility case?*，我只留前半，把 *go through* 換成 *handle*。這位應徵者在事後的回饋裡被稱讚把功能需求問得很清楚。

### 二、邊畫邊講：說出假設，把細節先放著

| 想說的意思 | 這個情境可用的說法 | 和來源的關係 |
| --- | --- | --- |
| 我先假設使用者都已經登入。 | I'm going to make the assumption that users are already logged in. | 改寫 |
| 這個我先記著，晚點再回來談。 | I'm going to put a pin in that. We will come back to that. | 原句 |

兩句都出自相片分享那一場。第一句的原話是 *I'm going to go ahead and make the assumption that all our clients are going to come from a variety of different types*，假設的內容是我換的。

第二句的原話是 *I'm going to put a pin in that. We will come back to that if we dive into it a little bit more. For the time being, though, I want to jump into the design.* 面試官在事後的回饋裡特別提到這個做法：先說會回來，表示你沒有忘記那件事。

### 三、講取捨，下決定

| 想說的意思 | 這個情境可用的說法 | 和來源的關係 |
| --- | --- | --- |
| 我們可以加一個佇列，但代價是延遲會變高。 | We can add a queue, but it will come at the cost of latency. | 改寫 |
| 我選事件佇列，因為我寧可使用者最後一定拿到正確的資料。 | I'm going to go with an event queue because I'd rather the user always get the right information eventually. | 改寫 |

*at the cost of* 在兩個來源都出現。[設計聊天服務那一場](https://interviewing.io/mocks/faang-system-design-designing-whatsapp)，面試官問有沒有更好的選項，應徵者回答 *we can definitely suggest, but it will come at the cost of consistency, and latency*。Google 的說明舉的例子也是同一個說法：

> Do you store data on a rotating disk and pay less money for the storage at the cost of increased latency?

[Cambridge 的 trade-off](https://dictionary.cambridge.org/us/dictionary/english/trade-off) 的第一個定義是「在兩個相反的情況或特質之間取得平衡」，例句 *There is a trade-off between doing the job accurately and doing it quickly*。

**第二句是面試官說的，不是應徵者。** 存貨與訂單那一場結束後，面試官指出應徵者一直說「可以這樣或那樣」卻沒說為什麼，然後示範該怎麼講：*okay, so I'm going to go with an event queue because I'd rather the user … always get the right information eventually*。

interviewing.io 的指南講的是同一件事。它說很多應徵者會列出幾個選項和優缺點，然後就跳到下一個元件；它給的修正是補上最後一句：

> We could use this type of DB, or this other, or that other, and these are some pros and cons… And based on all these tradeoffs, I'll use THAT type of DB.

Google 的說明也是這個要求：*We're looking for systems designers that can consider multiple solutions, commit to one, and then iterate on it.*

### 四、指出瓶頸，當場改口，確認對方跟上

| 想說的意思 | 這個情境可用的說法 | 和來源的關係 |
| --- | --- | --- |
| 我會說同步服務是瓶頸。 | I would say the synchronization service is the bottleneck. | 改寫 |
| 現在想一想，用 NoSQL 資料庫可能比較合理。 | It may actually make more sense, now that I'm thinking about this, to use a NoSQL database. | 改寫 |
| 你覺得這樣合理嗎？ | Do you think that makes sense? | 原句 |

瓶頸那句出自聊天服務那一場。面試官問流量變大時哪個元件會先撐不住，應徵者說 *I would say synchronisation service, I think is the bottleneck*。Google 的說明把 *Is there a bottleneck in the design?* 列為設計時該自問的問題。

改口那句出自相片分享那一場。應徵者原本說資料會是關聯式的，講到追蹤者服務時改變想法：*So it may actually make more sense now that I'm thinking about this, to throw a higher availability, higher write throughput database…*。我把後半換成 *use a NoSQL database*。事後的回饋稱讚的正是這一段對資料庫選擇的說明。

最後一句出自存貨與訂單那一場，應徵者講完打算先談哪幾項之後問的。

## 也可以這樣說嗎

| 英文 | 對誰／做什麼時用 | 是否仍是同一個意思 |
| --- | --- | --- |
| How many users are there? | 問使用者數量 | 主要說法 |
| What type of scale do you want to design this for? | 同一情境，問得比較開放 | 是（相片分享那一場應徵者的原話） |
| I'm going to go with an event queue because… | 下決定並給理由 | 主要說法 |
| Based on all these tradeoffs, I'll use… | 剛列完幾個選項的優缺點 | 是（interviewing.io 指南的示範） |
| Do you think that makes sense? | 確認對方同意方向 | 主要說法 |
| Does that make sense? | 同一情境，短一點 | 是（逐字稿裡面試官的說法） |

## 換內容再說一次

先看中文，自己說一次，再看參考說法。

1. 預期要處理多少資料？
   - *How much data do we expect to handle?*
2. 留言要包含在這次的設計範圍裡嗎？
   - *Do you want to handle comments in the scope of this design?*
3. 我先假設有網頁和手機兩種用戶端。
   - *I'm going to make the assumption that we have a web client and a mobile client.*
4. 我們可以加快取，但代價是一致性。
   - *We can add a cache, but it will come at the cost of consistency.*
5. 我選 API 呼叫，因為系統比較簡單。
   - *I'm going to go with an API call because it's a simpler system.*
6. 我會說資料庫是瓶頸。
   - *I would say the database is the bottleneck.*

第 1 句是 System Design Primer 的原句；其餘是我把來源句子的內容換掉。

## 一段短對話

以下是自己寫的練習示例，不是真實面試，也不是來源逐字稿裡的對話。

> A: I'd like you to design a photo sharing service.
>
> B: The first thing I want to lay out is the functional requirements. How many users are there?
>
> A: About 500 million.
>
> B: What is the expected read to write ratio?
>
> A: People view far more photos than they upload.
>
> B: I'm going to make the assumption that users are already logged in.
>
> A: That's fine. How would you keep the feed fast?
>
> B: We can add a cache, but it will come at the cost of consistency.
>
> A: Would you still add it?
>
> B: I'm going to go with the cache because I'd rather the feed load quickly.
>
> A: Where do you expect problems as traffic grows?
>
> B: I would say the database is the bottleneck. Do you think that makes sense?

## 不看英文，你會怎麼說

自評的標準是能不能把意思說出來，不是字有沒有完全一樣。

| 中文情境 | 參考說法 |
| --- | --- |
| 說要從哪裡談起 | The first thing I want to lay out is the functional requirements. |
| 問使用者數量 | How many users are there? |
| 問流量 | How many requests per second do we expect? |
| 問讀寫比 | What is the expected read to write ratio? |
| 確認範圍 | Do you want to handle the delete case in the scope of this design? |
| 說出假設 | I'm going to make the assumption that users are already logged in. |
| 細節先放著 | I'm going to put a pin in that. We will come back to that. |
| 講代價 | We can add a queue, but it will come at the cost of latency. |
| 下決定並給理由 | I'm going to go with an event queue because I'd rather the user always get the right information eventually. |
| 指出瓶頸 | I would say the synchronization service is the bottleneck. |
| 當場改口 | It may actually make more sense, now that I'm thinking about this, to use a NoSQL database. |
| 確認對方同意 | Do you think that makes sense? |

## 整體來說

十二句裡六句是來源原句，六句是改寫。最值得先練的是開場那三個問規模的問題，還有 *I'm going to go with … because I'd rather…*。前者每一題都用得到，後者是三個來源都在強調、卻最容易漏掉的一步：比較完要下決定。

這一批和前兩篇不同的地方，是依據裡有實際的對話，而且對話後面附了面試官的回饋，所以看得到哪些說法被當成優點。限制也在這裡：那是模擬面試，不是語言教材，沒有人保證那些句子的文法都對；我只挑了文法上站得住、而且另一個來源也有同樣說法或要求的句子。

## 更新紀錄

- 2026-10-25：納入統一口說系列；查證待辦移至研究紀錄，保留教材來源與使用範圍。

## 參考資料

- [Life at Google: Prepare for Your Google Interview: Systems Design](https://www.youtube.com/watch?v=Gg318hR5JY0)：系統設計面試的要求；題目刻意不講清楚、要數字估計、要講取捨並下決定
- [System Design Primer: How to approach a system design interview question](https://github.com/donnemartin/system-design-primer#how-to-approach-a-system-design-interview-question)：開場可以問的八個問題
- [interviewing.io: System Design Interview Guide for Senior Engineers](https://interviewing.io/guides/system-design-interview)：比較完要下決定的示範句
- [interviewing.io 模擬面試：Photo Sharing Service](https://interviewing.io/mocks/faang-system-design-photo-sharing-service)：劃範圍、說出假設、把細節先放著、當場改口
- [interviewing.io 模擬面試：Inventory and Orders](https://interviewing.io/mocks/faang-system-design-inventory-orders)：開場、面試官示範怎麼下決定、確認對方同意
- [interviewing.io 模擬面試：Designing WhatsApp](https://interviewing.io/mocks/faang-system-design-designing-whatsapp)：講代價、指出瓶頸
- [Cambridge Dictionary: trade-off](https://dictionary.cambridge.org/us/dictionary/english/trade-off)、[bottleneck](https://dictionary.cambridge.org/us/dictionary/english/bottleneck)：兩個詞的定義與例句
