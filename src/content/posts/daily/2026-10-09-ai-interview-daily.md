---
title: "AI Engineer 面試日練 — 2026-10-09：Coding"
date: 2026-10-09
category: daily
type: digest
tags: [ai-engineer-interview, daily, coding]
lang: zh-TW
description: "星期五輪到 Coding，這次換掉前幾週反覆出現的 scheduler、tokenizer、sampling 題型，改練 LLM API gateway 幾乎都要自己刻過一次的元件：實作一個 cost 會隨 token 數變動的 token bucket rate limiter，重點放在 lazy refill 的時間計算、check-then-deduct 的 race condition，以及單次請求 cost 超過 bucket 容量時要怎麼處理。"
tldr: "今天的 Coding 輪練換個方向，從前幾週已經練熟的推論排程、tokenizer、sampling 轉向 LLM API gateway 另一個幾乎每家公司都要自己刻的元件：token bucket rate limiter。跟一般 API 限流不同，LLM API 的限流單位是 token 而不是請求數（OpenAI、Anthropic 都用 TPM／RPM 雙軌限制），單一請求的 cost 可能是幾千個 token，不是固定的 1。核心概念涵蓋 lazy refill（檢查時才用經過時間 × refill rate 計算補了多少 token，不用背景 timer）、check-then-deduct 的 race condition（多執行緒同時檢查餘額會超放）、單次請求 cost 超過 bucket 總容量時的邊界處理，以及延伸到多台 API gateway 實例共享同一組 quota 時，怎麼用 Redis Lua script 做跨機器的原子操作、並用 Redis 自己的時間而非各台機器的本地時鐘。練習題來自 AI Engineering 面試題庫收錄的真實題目。"
series:
  name: "AI Engineer 面試日練"
  order: 51
---

> 🌏 [English version](/en/posts/daily/2026-10-09-ai-interview-daily-en)

## 今日主題

星期五輪到 Coding。前幾週已經把推論排程（兩次）、BPE tokenizer、longest-match tokenizer、動態 batching 解碼引擎、temperature/top-k/top-p sampling 都練過了，今天換一個同樣是 LLM API gateway 必備、但角度完全不同的元件：token bucket rate limiter。這題好考的地方在於它表面上是個教科書等級的經典演算法，但套到 LLM API 上會多出一個關鍵變數——cost 不是固定的 1，而是跟著 token 數變動，這個差異會讓好幾個「一般 rate limiter」不會踩到的邊界情況冒出來。今天練的內容適合 backend / infra 方向的 technical screen，也適合被追問「你們公司怎麼限制使用者呼叫 LLM API 的頻率」這類問題時，能講出具體的演算法設計而不是只會說「加個 middleware」。

## 核心概念速記

### Token bucket 的核心是 lazy refill，不是背景 timer

Token bucket 演算法維護一個「桶子」，桶子裡有目前可用的 token 數，有一個容量上限（burst capacity）跟一個固定的補充速率（refill rate，每秒補幾個 token）。正確的工程實作不會真的開一個背景執行緒每秒去加 token，而是「lazy refill」：只在每次有請求進來檢查餘額時，才用「現在時間減去上次檢查的時間」乘上 refill rate，算出這段時間理論上該補多少 token，加進餘額裡再跟容量上限取 min，然後才判斷夠不夠扣。這個做法的好處是不需要常駐背景任務，桶子閒置再久也不會佔用運算資源，正確性只取決於時間差的計算有沒有做對。

### LLM API 的 rate limit 單位是 token，不是請求數

一般 API 限流（例如每個 user 每分鐘 100 次請求）每次扣的 cost 都是固定的 1，但 LLM API 不一樣：OpenAI、Anthropic 這類供應商的限流同時卡 RPM（每分鐘請求數）跟 TPM（每分鐘 token 數）兩條線，而且 TPM 通常先被打到——一個帶了 4 萬字 context 的長文件請求，可能一次就吃掉你一分鐘 token 預算的大半，但請求數幾乎沒動。這代表 rate limiter 的 `try_acquire` 不能只傳「這是第幾個請求」，必須接受一個動態的 `cost` 參數（通常是這次請求預估的 input token 數，有時還要加上預期的 output token 數），每次扣的量都不一樣。

### Check-then-deduct 是一個典型的 race condition

把 lazy refill 跟扣款兩個步驟拆開想：先讀目前餘額、判斷夠不夠、再扣款，這三步如果不是一個原子操作，多執行緒同時呼叫就會出事——兩個執行緒同時讀到餘額還夠，各自都通過判斷，但扣款之後餘額變成負的，等於放行了超過限制的請求。正確做法是整段「讀餘額 → 算 refill → 判斷 → 扣款」要包在同一個鎖（單機版用 `threading.Lock`）或同一個原子操作（分散式版用 Redis Lua script）裡，確保中間不會被其他請求插隊。

### 單次請求的 cost 超過桶子總容量時要有明確決定

如果一個請求的 cost（例如 5000 個 token）本身就超過桶子的最大容量（例如 capacity 只設 3000），這個請求無論等多久、桶子補到全滿都不可能通過判斷，如果呼叫端用「失敗就重試」的邏輯去呼叫這種 rate limiter，會變成無限重試、永遠卡住卻查不出原因。正確的設計要把這種情況跟「暫時沒額度，稍後會有」區分開來，通常是在 cost 超過 capacity 時直接回傳一個不同的結果（例如拋出明確的例外或回傳一個表示「永遠不可能通過」的狀態），而不是跟一般的「餘額不足，請重試」用同一個回傳值。

## 今日練習題

### 題目

請實作一個 `TokenBucketLimiter` class，建構子接收 `capacity: float`（桶子最大容量）跟 `refill_rate: float`（每秒補充的 token 數），並提供方法 `try_acquire(cost: float, now: float) -> bool`：每次呼叫先用 `now` 跟上次呼叫的時間差乘上 `refill_rate` 計算這段時間補了多少 token、加進餘額後跟 `capacity` 取 min，再判斷餘額是否 `>= cost`——夠的話扣除 `cost` 並回傳 `True`，不夠的話餘額不變、回傳 `False`。要求正確處理以下邊界情況：`cost` 剛好等於目前餘額、`cost` 超過 `capacity`（這個請求理論上永遠不可能通過，需要能跟「暫時不夠、稍後會夠」的情況區分開來）、`now` 跟上次呼叫時間差為零或極小（避免浮點數誤差讓餘額略微超過 `capacity`）、以及多執行緒同時呼叫 `try_acquire` 時的 thread-safety。額外討論題：如果這個 rate limiter 要在多台 API gateway 實例之間共享同一組全域 quota（例如同一個付費方案下所有 server 加總的 TPM 限制），你會怎麼改？

**來源**：AI Engineering 面試題庫收錄的真實題目（GitHub 開源整理，原題為「Implement a token-bucket rate limiter for an LLM API where cost scales with tokens, then make it distributed」）　**難度**：中等　**環節**：technical screen / infra coding round

### 拆解思路

1. **先釐清問題**：先確認 `now` 是呼叫端傳入的時間戳（方便測試，不用真的等待），還是函式內部自己呼叫 `time.monotonic()`；確認 `cost` 永遠是正數，以及 `capacity` 和 `refill_rate` 在建構時是否可能是不合理的值（例如 0 或負數）需不需要檢查。這會決定介面設計要多嚴謹。
2. **建立框架**：核心邏輯分三步——(1) 算 elapsed：`now - self._last_refill_time`；(2) 補充餘額：`self._tokens = min(self.capacity, self._tokens + elapsed * self.refill_rate)`，同時更新 `self._last_refill_time = now`；(3) 判斷並扣款：`if self._tokens >= cost: self._tokens -= cost; return True`，否則 `return False`。整段用一個鎖包起來保證原子性。
3. **深入核心**：這題真正的技術深度在於把「演算法本身」跟「LLM API 的特殊性」分開想——一般 token bucket 教學幾乎都假設 cost 固定是 1，但這裡 cost 是變動的，這個變動會直接影響「永遠不可能通過」這個邊界情況是否存在（固定 cost=1 時只要 capacity >= 1 就一定有機會通過，但變動 cost 時某些請求天生就超過容量）。討論題的答案方向是：把狀態從單機記憶體移到 Redis，用 Lua script 把「讀餘額、算 refill、判斷、扣款」整段包成一個原子的 `EVAL` 呼叫，確保多台 gateway 同時打同一個 key 不會超放；而且時間要改用 Redis 自己的 `TIME` 指令而不是各台 app server 的本地時鐘，因為不同機器的系統時間可能有幾百毫秒到幾秒的 clock skew，如果拿本地時間去算 elapsed，不同機器算出來的補充量會不一致，等於限流規則在不同機器上不是同一套。
4. **收尾**：把答案收斂成「lazy refill 計算經過時間該補多少 → 判斷餘額夠不夠扣動態 cost → 整段操作要原子 → 超容量請求要能跟暫時不足區分」這四層邏輯，並主動點出「LLM API 的 cost 是變動的」這個跟教科書版本最大的差異，展現你不是在背誦演算法，而是真的想過它套到 LLM 場景會多出什麼問題。

### 範例回答（面試時可以這樣講）

> 我會把這個 class 的狀態設計成三個欄位：`capacity`、`refill_rate`、以及目前餘額跟上次檢查的時間戳。**`try_acquire` 的第一步是 lazy refill**：用傳入的 `now` 減掉上次檢查的時間算出 elapsed，乘上 `refill_rate` 就是這段時間理論上補了多少 token，加進餘額後跟 `capacity` 取 min 避免超過上限，同時把這次的 `now` 存起來當下次的基準。**第二步才是判斷**：如果餘額大於等於這次請求的 `cost` 就扣款並回傳 `True`，否則完全不動餘額、回傳 `False`。
>
> **這題跟一般 rate limiter 最大的差異是 cost 會變動**，因為 LLM API 的限流單位是 token 而不是請求數——一個長 context 的請求可能一次吃掉大半的分鐘預算。這代表我要特別處理 `cost` 本身超過 `capacity` 的情況：這種請求不管桶子補多滿都不可能通過，如果我讓它跟「餘額暫時不足」回傳同一個 `False`，呼叫端的重試邏輯會無限卡住、卻完全查不出原因，所以我會讓它拋出一個明確的例外或用不同的回傳值區分開來。**整個讀餘額、算 refill、判斷、扣款的流程我會包在一個鎖裡**，否則兩個執行緒同時讀到餘額還夠，各自扣完之後餘額會變負的，等於放行了超過限制的流量。如果要擴展到多台 gateway 共享同一組 quota，我會把狀態搬到 Redis，用 Lua script 把整段操作包成一次原子的 `EVAL`，而且時間要用 Redis 的 `TIME` 指令，不能用各台機器自己的系統時鐘，因為機器之間的 clock skew 會讓同一套限流規則在不同機器上算出不同結果。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| Lazy refill：用經過時間 × refill rate 計算補充量，不是背景 timer | |
| 點出 LLM API 的 cost 是依 token 數變動，不是固定 1 | |
| Check-then-deduct 是 race condition，需要鎖或原子操作包起來 | |
| cost 超過 capacity 時要跟「暫時不足」區分，避免呼叫端無限重試 | |
| 加分項：分散式版本提到 Redis Lua script 的原子性，以及要用 Redis 的時間而非各機器本地時鐘 | |

## 延伸閱讀

- [Token bucket rate limiter with Redis and Go — Redis Docs](https://redis.io/docs/latest/develop/use-cases/rate-limiter/go) — 官方文件示範怎麼用 Lua script 把 token bucket 的讀取、refill、扣款包成一個原子操作，對應今天「分散式版本」那段的實作細節。
- [Stop 429s, 15% Token Drift: Gateway LLM Rate Limits for Engineers — MLflow](https://mlflow.org/articles/rate-limiting-llm) — 解釋 LLM API 為什麼要同時卡 RPM 跟 TPM 兩條線、TPM 通常先被打到，對應今天「LLM API 的限流單位是 token」這段的背景。
- [How to Build a Distributed Rate Limiting System Using Redis and Lua Scripts — freeCodeCamp](https://www.freecodecamp.org/news/build-rate-limiting-system-using-redis-and-lua/) — 完整的分散式 token bucket 教學，附可直接參考的 Lua script 跟 Docker 測試環境。

## 參考資料

- [AI Engineering Interview Questions — GitHub（amitshekhariitbhu 開源整理）](https://github.com/amitshekhariitbhu/ai-engineering-interview-questions) — 今天練習題「Implement a token-bucket rate limiter for an LLM API where cost scales with tokens, then make it distributed」的原始出處。
- [Token bucket rate limiter with Redis and Go — Redis Docs](https://redis.io/docs/latest/develop/use-cases/rate-limiter/go) — 對應「Check-then-deduct 是一個典型的 race condition」與分散式討論題的 Lua script 原子操作說明。
- [Stop 429s, 15% Token Drift: Gateway LLM Rate Limits for Engineers — MLflow](https://mlflow.org/articles/rate-limiting-llm) — 對應「LLM API 的 rate limit 單位是 token，不是請求數」段落 RPM/TPM 雙軌限制的說明來源。
- [How to Build a Distributed Rate Limiting System Using Redis and Lua Scripts — freeCodeCamp](https://www.freecodecamp.org/news/build-rate-limiting-system-using-redis-and-lua/) — 對應「單次請求的 cost 超過桶子總容量」與分散式版本的 clock skew 討論。
