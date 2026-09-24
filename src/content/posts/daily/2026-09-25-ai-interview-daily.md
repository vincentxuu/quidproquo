---
title: "AI Engineer 面試日練 — 2026-09-25：Coding"
date: 2026-09-25
category: daily
type: digest
tags: [ai-engineer-interview, daily, coding]
lang: zh-TW
description: "星期五輪到 Coding——今天練 Anthropic 反覆在 SWE、ML、hardware、EM 各條線都會出的 GPU batching 題:實作一個同步等待的單 GPU inference batching scheduler,用 max batch size 跟 max wait window 兩個觸發條件搶第一個先到的,再延伸到 continuous batching 跟 PagedAttention 怎麼解決固定批次的浪費。"
tldr: "今天的 Coding 輪練是 Anthropic 在 SWE / ML / hardware / EM 各條面試線都會考的高頻題:設計並實作一個單 GPU 的 inference batching scheduler,支援最多 100 筆輸入一批、使用者同步等待結果,核心張力是 throughput 跟 latency 的取捨。核心概念涵蓋 dynamic batching 的兩個觸發條件(batch size 上限 / 等待時間上限)、依序列長度分桶減少 padding 浪費、continuous batching(iteration-level scheduling)跟傳統固定批次的差異、PagedAttention 怎麼用分頁管理 KV cache 記憶體、以及 backpressure 怎麼在佇列爆滿時維持有界的尾端延遲。練習題把 Anthropic 這道系統設計題轉成可以真的寫程式碼實作的 scheduler class,附完整拆解與範例回答。"
series:
  name: "AI Engineer 面試日練"
  order: 37
---

> 🌏 [English version](/en/posts/daily/2026-09-25-ai-interview-daily-en)

## 今日主題

星期五輪到 Coding。今天選的題目不是抽象演算法,而是 Anthropic 在 SWE、ML、hardware、甚至 EM 面試線都反覆出現的高頻題——設計並實作一個單 GPU 的 inference batching scheduler。這題之所以被各職能反覆考,是因為它同時測三件事:你懂不懂 throughput 跟 latency 的根本張力、你能不能把這個張力寫成真正可執行的排程邏輯(而不是只會畫方塊圖)、以及你知不知道業界(像 vLLM)是怎麼把這個基礎版本再往上優化成 continuous batching。今天把這題從系統設計題目落地成一段可以實際手刻的 Python scheduler。

## 核心概念速記

### Dynamic batching:用兩個觸發條件搶第一個先到的

單 GPU inference 最基本的矛盾是:批次做得越大,GPU 利用率越高、單位成本越低,但早到的請求要等到湊滿一批才會被處理,延遲就拉長。業界標準解法是 dynamic batching——同時設兩個觸發條件,一個是 `max_batch_size`(例如 100 筆),一個是 `max_wait_ms`(例如 5-20 毫秒),兩個條件誰先到就先出批次。面試時把這兩個參數講清楚,等於直接點出這題的核心旋鈕:`max_wait_ms` 調大,throughput 上去但延遲變高;調小則相反,這是講清楚 trade-off 而不是只講「做 batching」的關鍵一句話。

### 依序列長度分桶,padding 不該吃掉算力

一批請求裡如果長度差很多,傳統做法是把所有序列 padding 到批次裡最長的那個,短序列會浪費大量算力在處理無意義的 padding token 上。常見的緩解方式是依長度分桶(length bucketing)——把長度相近的請求分進同一個桶,再各自湊批,讓 padding 浪費控制在桶內的長度差距,而不是整個批次的最大長度差距。面試官常追問「如果請求長度分布很極端怎麼辦」,答案是桶的粒度本身就是一個可調參數,桶太細會讓每桶湊批變慢、桶太粗又浪費 padding,要看實際流量分布去調。

### Continuous batching:token generation 不該用固定批次

Static batching 有個致命缺點:一批裡各個序列的生成長度不一樣,先生成完的序列必須空等到整批都結束才能離開,GPU 在等待期間是浪費的。Continuous batching(也叫 iteration-level scheduling,vLLM 等推論引擎的核心設計)把批次的組成單位從「一整個請求」改成「一次 forward pass 的一個 iteration」——每跑完一步,結束的序列立刻離開批次釋放資源,佇列裡等待的新請求立刻補位進來,批次組成幾乎每個 iteration 都在變動。這是靜態批次跟生產級 LLM serving 引擎最大的差異,面試時提到這個概念,是區分「懂 batching 概念」跟「懂 LLM serving 系統」的分水嶺。

### PagedAttention:KV cache 記憶體才是真正的瓶頸

能塞進一批的請求數量,實際上常常不是被算力限制,而是被 KV cache 的記憶體用量限制——傳統做法會為每個序列預先配置到最大 context 長度的連續記憶體,但大多數請求根本用不到那麼長,造成 60-80% 的記憶體浪費。PagedAttention(vLLM 提出)借用作業系統虛擬記憶體分頁的概念,把 KV cache 切成固定大小的區塊(例如 16 個 token 一頁),依實際需要動態配置、非連續存放。記憶體浪費大幅下降,直接換來更大的可用批次,吞吐量因此顯著提升,這是「continuous batching + PagedAttention」常被綁在一起講的原因——一個解決排程浪費,一個解決記憶體浪費。

### Backpressure:佇列滿了不能讓延遲失控

如果進來的請求速度長期超過 GPU 處理速度,佇列會無限增長,尾端延遲(tail latency)會失控,對同步等待結果的使用者來說是不可接受的。設計時要明確定義佇列上限跟溢出行為——常見做法是設定佇列容量上限,超過時直接回傳「系統忙碌,稍後重試」或路由到備援資源,而不是讓請求無限排隊。面試時被問「流量突然暴增怎麼辦」,能講出「backpressure + 明確的溢出路徑」比只講「加更多 GPU」更能顯示你考慮過生產環境的真實限制。

## 今日練習題

### 題目

實作一個單 GPU 的 synchronous inference batching scheduler:提供一個方法 `submit(request) -> response`,呼叫端呼叫後會阻塞,直到這個 request 被排進某一批、GPU 端函式 `run_batch(requests: list) -> list` 執行完成、拿到對應的 response 才回傳。scheduler 需要支援兩個參數:`max_batch_size`(一批最多幾筆)、`max_wait_ms`(一個請求最多等多久,不管有沒有湊滿批次都要出批)。額外要求:多個執行緒可能同時呼叫 `submit`,需要 thread-safe;討論題:如果 `run_batch` 執行時間會隨批次大小變動(例如批次越大單次執行越久),你的 `max_wait_ms` 邏輯要怎麼調整才不會讓已經等很久的請求又被拖延?

**來源**：Anthropic Inference Batching System(整理自 Exponent 面試題庫，2026 AI Engineer 面試指南收錄）　**難度**：進階　**環節**：technical screen / system design 混合

### 拆解思路

1. **先釐清問題**：先確認「同步等待」是指呼叫端這條執行緒真的被阻塞(blocking call),還是允許用 callback/future 非阻塞回傳;確認 `run_batch` 是否保證輸入輸出的順序一致(通常是,但要問清楚,否則配對結果會出錯);確認多執行緒情境下,是否有請求優先權(例如某些請求該插隊),先假設沒有除非面試官特別提。
2. **建立框架**:用一個執行緒安全的佇列(如 `queue.Queue` 或搭配 `threading.Condition`)接收請求,搭配一個背景執行緒(或計時器)做排程判斷。核心邏輯是「誰先到誰先觸發出批」:每次有新請求進佇列就檢查是否達到 `max_batch_size`,達到就立刻出批;否則檢查佇列裡最早的請求是否已經等超過 `max_wait_ms`,超過就強制出批(即使沒湊滿)。
3. **深入核心**:最容易忽略的正確性陷阱是「等待時間的計時基準」——`max_wait_ms` 應該從佇列裡最早的請求進來那一刻起算,而不是每次檢查時重新算,否則會變成請求永遠等不到超時。thread-safety 上,用一個鎖保護佇列的讀寫,搭配 `threading.Event` 或 `Condition` 讓 `submit` 的呼叫執行緒能在自己的請求出結果之前阻塞、結果出來後被喚醒。討論題的答案是:如果批次執行時間隨批次大小變動,`max_wait_ms` 不該只保證「進佇列到出批」的時間,還要把預估的 `run_batch` 執行時間算進使用者能接受的總延遲預算裡——用較大批次時應該相應縮小允許的等待窗口,或是把批次大小上限跟等待窗口做成一個聯合的延遲預算函式,而不是兩個獨立寫死的常數。
4. **收尾**:講清楚這個基礎版本跟生產級系統的差距在哪——這裡是每批固定组成、跑完才能處理下一批(static batching),生產環境會換成 continuous batching,讓提早結束的序列立刻讓位給新請求,同時用 PagedAttention 這類技術管理 KV cache 記憶體,讓可容納的批次更大。主動點出這個差距,是把一個 coding round 的題目延伸成展現系統認知的機會。

### 範例回答（面試時可以這樣講）

> **問題框定**：這題我先確認一下,`submit` 是真的阻塞呼叫端執行緒直到拿到結果,還是可以用 future 非阻塞;假設是前者。另外我假設 `run_batch` 保證輸入輸出順序一致,而且多執行緒會同時呼叫 `submit`,所以整個 scheduler 內部狀態要 thread-safe。基於這個範圍,我會用一個共享佇列加一把鎖,搭配背景排程執行緒。
>
> **核心邏輯**：`submit` 把請求連同一個 `threading.Event` 一起放進佇列,然後在那個 Event 上阻塞等待。背景執行緒不斷檢查兩個條件:佇列長度是否達到 `max_batch_size`,或是佇列裡最早那筆請求的等待時間是否超過 `max_wait_ms`(這個時間要從那筆請求進佇列的時間戳計算,不能每次重新起算)。只要有一個條件成立,就把佇列裡現有的請求(最多取 `max_batch_size` 筆)整批取出、呼叫 `run_batch`,拿到結果後依序寫回每個請求對應的 response 欄位,再逐一設置它們的 Event 喚醒對應的 `submit` 呼叫。
>
> **正確性與延伸**：我會用兩個簡單情境驗證——單一請求且沒有其他人跟它湊批,應該在 `max_wait_ms` 後被強制出批而不是無限等待;快速連續丟進 100 筆請求,應該立刻觸發 `max_batch_size` 出批而不用等到超時。討論題我會提到,如果批次執行時間隨大小變動,我會把「已等待時間 + 預估這批的執行時間」一起納入延遲預算,而不是讓 `max_wait_ms` 單獨判斷,避免大批次把已經等很久的請求再往後拖。最後我會提到,這個版本是 static batching,如果要做到生產等級,我會換成 continuous batching 讓序列逐 iteration 進出批次,並用 PagedAttention 管理 KV cache,把可容納的批次做大。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 明確講出兩個出批觸發條件(batch size 上限 / 等待時間上限)誰先到誰觸發 | |
| 等待時間的計時基準是「最早請求進佇列的時間」,不是每次重新起算 | |
| 有處理多執行緒 thread-safety(鎖 + Event/Condition 喚醒機制) | |
| 討論題有把「批次執行時間隨大小變動」納入延遲預算的調整邏輯 | |
| 主動延伸到 continuous batching 跟 PagedAttention 作為生產級優化 | |
| 加分項:提到 backpressure(佇列滿了該怎麼處理溢出) | |

## 延伸閱讀

- [Achieve 23x LLM Inference Throughput & Reduce p50 Latency — Anyscale](https://www.anyscale.com/blog/continuous-batching-llm-inference) — continuous batching 跟 PagedAttention 怎麼疊加帶來吞吐量提升的完整解說,補今天「Continuous batching」段落的量化細節。
- [vLLM Explained: PagedAttention and Continuous Batching — RunPod](https://www.runpod.io/articles/guides/vllm-pagedattention-continuous-batching) — 圖解 PagedAttention 怎麼用分頁管理 KV cache,適合還不熟悉這個概念的讀者先建立直覺。
- [45+ AI Engineer Interview Questions & Answers (2026 Guide) — Exponent](https://www.tryexponent.com/blog/ai-engineer-interview-questions/) — 今日題目與 LLM serving 面試框架的原始出處,附完整的 AI Engineer 面試題庫分類。

## 參考資料

- [45+ AI Engineer Interview Questions & Answers (2026 Guide) — Exponent](https://www.tryexponent.com/blog/ai-engineer-interview-questions/) — 今日練習題原題描述、Anthropic inference batching 題目與 LLM serving 面試框架的來源。
- [Design an inference batching system for a single GPU — Exponent 題庫](https://www.tryexponent.com/questions/5780/inference-batching-system) — 今日練習題的原始題目頁面。
- [Achieve 23x LLM Inference Throughput & Reduce p50 Latency — Anyscale](https://www.anyscale.com/blog/continuous-batching-llm-inference) — 對應「Continuous batching」與「PagedAttention」段落的技術細節來源。
- [vLLM Explained: PagedAttention and Continuous Batching — RunPod](https://www.runpod.io/articles/guides/vllm-pagedattention-continuous-batching) — 對應「PagedAttention」段落 KV cache 分頁管理的來源。
