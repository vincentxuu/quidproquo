---
title: "AI Engineer 面試日練 — 2026-09-11：Coding"
date: 2026-09-11
category: daily
type: digest
tags: [ai-engineer-interview, daily, coding]
lang: zh-TW
description: "今天練 ML coding 面試最愛出的動態 batching 實作題：怎麼把個別抵達的推論請求填進固定容量的 batch、正確維護 slot 對應與多種停止條件，以及為什麼面試官越來越少考裸演算法，轉而考驗生產判斷力。"
tldr: "今天的 Coding 輪練的是 xAI 一道真實的 dynamic batching for token decoding 題目——在固定容量 B 的 batch 裡動態填補完成的 slot，同時正確處理 stop_token、stop_sequence、max_tokens 三種停止條件，並維持 slot_id 到 request_id 的正確對應。核心概念涵蓋 continuous batching 如何在 GPU 利用率跟延遲之間取捨、NumPy 用 broadcasting 跟 boolean mask 取代顯式迴圈、padding 與 attention mask 怎麼處理不定長輸入,以及 batch inference API 該用 queue depth 而非單純 GPU utilization 來驅動自動擴縮。額外補一個面試設計視角:2026 年的 ML coding 面試越來越少考裸演算法背誦,轉而用真實的生產情境題(像今天這題)測你的工程判斷力。"
series:
  name: "AI Engineer 面試日練"
  order: 23
---

> 🌏 [English version](/en/posts/daily/2026-09-11-ai-interview-daily-en)

## 今日主題

今天輪到 Coding。這一輪考的不是刷題網站上那種跟 ML 完全無關的演算法題,而是「ML-flavored」的實作題——用 Python(常常搭配 NumPy)寫出跟推論、資料處理直接相關的邏輯,像今天這題「動態把個別抵達的請求填進固定容量的 batch」。2026 年幾家前沿 AI 公司的 coding round,已經很習慣直接把生產環境會遇到的問題(batching、padding、queue 管理)包成一道 live coding 題,考的是你寫程式時會不會順手處理好 edge case、資料結構選得對不對,而不是你背了多少演算法模板。這種題型常出現在 onsite 的 coding 環節,是區分「會寫 leetcode」跟「敢把程式碼丟進推論服務」的分水嶺。

## 核心概念速記

### Dynamic / continuous batching 的填槽邏輯

固定容量 B 的 batch 裡,每個 slot 都在跑不同進度的生成;一旦某個 slot 的請求提早結束(碰到 stop token 或 max_tokens),就要立刻從等待佇列(waiting queue)裡拉下一個請求補進這個 slot,而不是等整個 batch 全部跑完才重新組 batch。這就是 continuous batching 的核心——讓 GPU 幾乎不會因為「等最慢的那個」而閒置,是 vLLM 這類推論引擎能撐起高吞吐的關鍵設計。

### NumPy 向量化:用 broadcasting 跟 boolean mask 取代迴圈

NumPy 的效能來自把逐元素運算下放到 C 層的向量化操作,而不是 Python 的 for-loop。面試官很愛考「這段迴圈怎麼向量化」——用 broadcasting 讓不同形狀的陣列自動對齊做運算,用 boolean mask(比較運算產生的 True/False 陣列)取代 `if` 判斷去篩選或更新元素。寫出迴圈版本的答案通常能過,但面試官接著一定會問「這樣在 10 萬筆資料上跑得動嗎」。

### Padding 與 attention mask 處理不定長輸入

一個 batch 裡的序列長度通常不一樣,要 pad 到同一個長度才能塞進同一個張量運算,但 padding 出來的位置不能真的參與計算——這就需要一個 attention mask 去標記哪些位置是真實 token、哪些是 padding,在算 attention score 或做 loss 的時候把 padding 位置遮掉。這題常跟 batching 題一起出,因為 batch 裡新舊 slot 混雜時,padding 長度會隨時變動。

### Batch inference API:用 queue depth 驅動自動擴縮

生產環境的 batch inference API 不會只看 GPU utilization 來決定要不要擴 worker,因為利用率是落後指標,等你看到利用率飆高,佇列可能早就塞爆了。比較穩健的做法是用 queue depth(佇列裡等待的請求數)或「目標等待時間」當領先指標,搭配 shape bucketing(把長度相近的請求分桶以減少 padding 浪費)跟 idempotency 語意去設計整個 job 生命週期。

### Coding 面試的設計哲學:考生產判斷力,不是考背誦

越來越多團隊發現,單純的演算法背誦題預測不了「這個人能不能在生產環境把模型顧好」——反而是「怎麼處理 feature engineering 邊界情況」「怎麼設計 batching 邏輯」這種帶著真實工程情境的題目,更能看出候選人的資料結構選擇跟 edge case 敏感度。如果面試官全程盯著你寫,通常想看的是你「先講清楚假設再動手」的習慣,而不是你打字有多快。

## 今日練習題

### 題目

給你一個「模擬語言模型」黑盒介面:`model_next(batch_prefixes)` 接收一個 token list 的 list(每個元素是目前 batch 中一個活躍序列的 prefix),回傳一個等長的 `next_tokens` 整數陣列,`next_tokens[i]` 是 `batch_prefixes[i]` 這個序列生成的下一個 token。現在有一批請求(request),每個請求帶有:`max_tokens`(允許生成的最大 token 數,不含 prompt)、以及一個停止條件(可能是單一 `stop_token`,也可能是 `stop_sequence`——當生成結果的結尾出現這個 token 序列就停止),還有一個 callback 用來回傳最終生成結果。請實作一個動態 batching 的解碼引擎:batch 容量固定為 `B`;請求先進入等待佇列;你反覆呼叫 `model_next` 推進所有活躍序列;序列可能在不同時間點因為 `max_tokens`、`stop_token` 或 `stop_sequence` 而提早結束;一旦某個 slot 空出來,要從等待佇列補上新請求;要用 `slot_id -> request_id` 的對應維持正確性,確保 refill 之後 token 不會接錯人;最後,batch 快跑完時 `len(active) < B` 的情況也要正確處理。

**來源**：PracHub Knowledge Hub（xAI Interview Question 題庫收錄）　**難度**：進階　**環節**：onsite live coding

### 拆解思路

1. **先釐清問題**：先問清楚 `model_next` 是不是每次呼叫都重新吃完整 prefix(還是只吃增量 token、內部自己維護 KV cache)、請求是一開始就全部在等待佇列裡還是會邊跑邊抵達、`stop_sequence` 需不需要處理跨呼叫的部分比對(例如停止序列橫跨這次跟下次生成的 token)。
2. **建立框架**：維護三塊狀態——固定長度 `B` 的 active slots 陣列(每個 slot 存目前的 request 物件、已生成的 token 序列)、一個等待佇列(FIFO 存還沒進 batch 的請求)、以及 `slot_id -> request_id` 的對應表。主迴圈:組出目前所有 active slot 的 `batch_prefixes`、呼叫 `model_next`、把回傳的 `next_tokens` 逐一 append 進對應 slot 的輸出、檢查每個 slot 是否該結束。
3. **深入核心**：這題最關鍵的正確性陷阱是「refill 之後的狀態污染」——一個 slot 結束後被新請求佔用,如果沒有把這個 slot 的生成緩衝區、`max_tokens` 計數器、`stop_sequence` 匹配狀態整個重置乾淨,新請求的輸出就會混進舊請求殘留的 token。效能上的核心 trade-off 則是「填滿再跑」跟「有空位就跑」之間的取捨——太急著用不滿的 batch 跑會浪費 GPU 利用率,但等太久才填滿又會拉高等待中請求的延遲,這正是 continuous batching 在正式系統裡要解的問題。
4. **收尾**：講清楚三種停止條件怎麼各自檢查——`max_tokens` 只要數已生成 token 數、`stop_token` 直接比對最新 token、`stop_sequence` 則要看已生成序列的「尾端」是否等於停止序列(用一個滑動比對或後綴檢查,而不是整段字串比對)。最後可以主動延伸到「這就是 vLLM PagedAttention、continuous batching 想解決的問題,只是我們在做的是簡化版」,讓面試官知道你懂這題在生產環境對應到什麼。

### 範例回答（面試時可以這樣講）

> **問題框定**：在寫程式碼之前我想先確認幾個假設——`model_next` 每次都吃完整 prefix、所有請求一開始就在等待佇列裡(不用處理併發到達)、`stop_sequence` 需要在每次生成新 token 後檢查目前輸出的尾端。基於這個範圍,我會維護三塊狀態:固定長度 `B` 的 `active_slots`、一個 `waiting_queue`,以及每個 slot 各自的生成緩衝區跟停止條件檢查器。
>
> **核心邏輯**：主迴圈每一輪先組出所有 active slot 的 prefix 丟給 `model_next`,拿到 `next_tokens` 後逐一 append 進對應 slot 的輸出緩衝區,同時檢查這個 slot 是否已經達到 `max_tokens`、命中 `stop_token`,或是輸出尾端符合 `stop_sequence`。一旦某個 slot 判定結束,立刻呼叫它的 callback 回傳結果、把這個 slot 的所有狀態(緩衝區、計數器、停止條件匹配狀態)重置乾淨,再從 `waiting_queue` 補一個新請求進來,並更新 `slot_id -> request_id` 的對應。如果等待佇列空了,這個 slot 就先標記為閒置,下一輪只把真正 active 的 slot 組進 `batch_prefixes`,自然處理 `len(active) < B` 的情況。
>
> **正確性與延伸**：我會特別強調 refill 那一刻的狀態隔離,這是最容易出 bug 的地方——寧可多寫一個明確的 `reset_slot` 函式,也不要讓新舊請求的狀態共用同一塊可變物件。收尾我會提到,這其實是簡化版的 continuous batching,正式系統像 vLLM 會再疊上 PagedAttention 去管理 KV cache 的記憶體碎片,但今天這題已經把「動態填槽、正確的 slot 對應、多種停止條件」這三個核心邏輯都覆蓋到了。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 明確定義 active slots、waiting queue、slot 各自的生成狀態 | |
| slot 結束後的狀態重置(緩衝區、計數器、停止條件)有講清楚,避免污染新請求 | |
| 三種停止條件(max_tokens／stop_token／stop_sequence)分別怎麼檢查 | |
| `len(active) < B` 的部分填滿情況有正確處理 | |
| 提到這跟正式環境 continuous batching / vLLM 的對應關係 | |
| 加分項：討論 GPU 利用率跟延遲之間「填滿再跑 vs 有空位就跑」的取捨 | |

## 延伸閱讀

- [Design a batch inference API — PracHub（Anthropic Interview Question）](https://prachub.com/interview-questions/design-a-batch-inference-api) — 把今天的 coding 題再往上拉一層,變成完整的批次推論 API 系統設計題,適合當作明天(週六)如果想再練一次同主題時的延伸。
- [microsoft/batch-inference — GitHub](https://github.com/microsoft/batch-inference) — 一個真實開源的動態 batching 函式庫,GPT completion 場景號稱 16x 吞吐提升,可以對照今天自己寫的簡化版看差在哪。
- [Real-time, Batch, and Micro-Batching Inference Explained — dat1.co](https://dat1.co/blog/real-time-batch-and-micro-batching-inference-explained) — 把即時推論、批次推論、micro-batching 三種模式的取捨講得很直白,適合補強「什麼情境該選哪種」的直覺。

## 參考資料

- [Implement dynamic batching for token decoding — PracHub（xAI Interview Question）](https://prachub.com/interview-questions/implement-dynamic-batching-for-token-decoding) — 今日練習題原題與 slot 對應、停止條件設計的來源。
- [Design a batch inference API — PracHub（Anthropic Interview Question）](https://prachub.com/interview-questions/design-a-batch-inference-api) — Queue depth 驅動自動擴縮、shape bucketing 概念的來源。
- [Machine Learning Engineers Interview Questions (25 That Predict Performance) — Korebpo](https://korebpo.com/machine-learning-engineers-interview-questions) — 「coding 面試考生產判斷力而非背誦」這個面試設計視角的來源。
