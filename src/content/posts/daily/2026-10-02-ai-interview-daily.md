---
title: "AI Engineer 面試日練 — 2026-10-02：Coding"
date: 2026-10-02
category: daily
type: digest
tags: [ai-engineer-interview, daily, coding]
lang: zh-TW
description: "星期五輪到 Coding，這次換掉前幾週反覆出現的 batching scheduler 跟 tokenizer 題型，改練 LLM API 幾乎每家都會暴露的參數：實作一個吃 temperature、top-k、top-p 三個設定的 sampling 函式，重點放在面試官最愛追問的數值陷阱——softmax 不先減最大值會 overflow、temperature=0 要退化成 greedy 而不是除以零、top-p 累積機率門檻抓錯邊界會多留或少留一個 token。"
tldr: "今天的 Coding 輪練換個方向，不再碰前幾週已經練熟的 batching scheduler 跟 tokenizer，改做幾乎每個 LLM API 都會暴露、卻很少人真正手刻過的功能：實作一個吃 logits、temperature、top_k、top_p 四個參數的 sample_token 函式。核心概念涵蓋 softmax 數值穩定性（exp 之前要先減去最大值，否則大 logit 直接 overflow 成 inf）、temperature 的邊界情況（T=0 在公式上是除以零，業界慣例是退化成 greedy decoding 而不是丟例外）、top-k 與 top-p 的套用順序（先 temperature 整形分佈，再 top-k 砍固定數量，再 top-p 依累積機率動態砍）、以及 top-p 最容易寫錯的邊界判斷（要用「加入這個 token 之前」的累積機率跟門檻比較，不是加入後）。練習題來自 AI Engineering 面試題庫收錄的真實題目，額外延伸到 top_k 超過字典大小、renormalize 分母為零這類容易被面試官抓到的邊界案例。"
series:
  name: "AI Engineer 面試日練"
  order: 44
---

> 🌏 [English version](/en/posts/daily/2026-10-02-ai-interview-daily-en)

## 今日主題

星期五輪到 Coding。前幾週的 Coding 輪練已經把 batching scheduler（兩次）、BPE tokenizer、longest-match tokenizer 都練過了，今天換一個幾乎每個呼叫過 LLM API 的人都設定過參數、卻很少人真的手刻過實作的題目：從 logits 到最終選出一個 token，中間 temperature、top-k、top-p 三層設定具體怎麼運作。這題好考的地方不在演算法本身有多難，而在於它有一長串容易被面試官抓到的數值邊界情況——softmax 的 overflow、temperature 等於零怎麼辦、top-p 的累積機率門檻抓錯一格就整個邏輯錯掉。今天練的內容適合 technical screen 的 coding round，也適合被追問「你知道 API 裡那個 temperature 滑桿背後在做什麼嗎」這類問題時，能直接講出實作細節而不是只會背名詞。

## 核心概念速記

### Softmax 數值穩定性：exp 之前一定要先減去最大值

把 logits 轉成機率要用 softmax，數學式是每個值取 exp 再除以總和，但直接照公式實作在工程上會出事：如果某個 logit 數值偏大，`exp(logit)` 在浮點數裡很容易直接溢位成 `inf`，一旦分子或分母出現 `inf`，整個機率分布就會變成 `nan`，後面的 sampling 直接壞掉。標準解法是先把所有 logits 減去這批數值裡的最大值，再做 exp——這個操作在數學上完全不改變 softmax 的結果（因為分子分母同時乘上一個常數會互相抵消），但能保證 exp 裡最大的輸入是零，不可能溢位。面試官想聽到的是「這是工程實作的必要步驟，不是可做可不做的最佳化」。

### Temperature 整形分布，但 T=0 是公式上的除以零

Temperature 的作用是在 softmax 之前把每個 logit 除以溫度值：T 小於 1 會把分布壓得更尖銳（讓本來就最高分的 token 更容易雀屏中選），T 大於 1 會把分布拉平（讓原本分數較低的 token 也有機會）。但 T 等於零在數學上是未定義的，因為除以零沒有意義；業界的共同慣例是把 `temperature=0` 當成「要求 greedy decoding」的特殊訊號，直接回傳機率最高的 token，而不是真的去執行除以零讓程式丟例外。這是一個典型的「公式上的邊界情況該怎麼在程式碼裡變成明確分支」的設計決定，面試官很愛追問這一點來看你有沒有真的想過邊界情況，而不是只會抄公式。

### Top-k 與 top-p 的套用順序：先整形分布，再固定數量砍，再動態比例砍

生產環境的 LLM API 通常會把 temperature、top-k、top-p 三個機制疊在一起用，而且是有固定順序的：先用 temperature 整形 logits 的分布，接著用 top-k 砍成固定數量的候選（例如只留分數最高的 k 個，其餘全部丟棄後再重新 renormalize），最後用 top-p 在剩下的候選裡再依累積機率動態再砍一次（由高到低累加機率，一超過門檻 p 就停止，常見值是 0.9 到 0.95）。這個順序的理由是 top-k 先做一次粗篩縮小範圍、降低後續排序跟計算的量，top-p 再針對模型「有多確定」做動態微調——同樣設 p=0.9，模型很確定時可能只留一個 token，模型猶豫不決時可能留下十幾個，這是 top-p 比固定的 top-k 更常被當成預設值暴露在 API 上的原因。

### Top-p 最容易寫錯的地方：累積機率門檻要用「加入前」還是「加入後」判斷

實作 top-p 時最常見的 bug 出在累積機率怎麼跟門檻 p 比較。正確做法是依機率由高到低排序後，逐一累加，只要某個 token 加入「之前」的累積總和已經達到 p，這個 token 就不需要了，可以丟棄；反過來說，保留的是「讓累積總和第一次達到或超過 p」的那個 token 本身。如果判斷寫反成「加入後的累積總和超過 p 就丟棄這個 token」，會導致本該被保留的最後一個關鍵 token 被誤刪，當模型對下一個 token 非常確定、單一 token 機率就超過 p 時，這個 off-by-one 會讓候選池直接變空、renormalize 時除以零而整個邏輯崩潰。面試官如果追問「這段程式碼哪裡最容易寫錯」，這就是標準答案。

## 今日練習題

### 題目

請實作一個函式 `sample_token(logits: list[float], temperature: float, top_k: int, top_p: float) -> int`，輸入是模型對整個詞彙表的原始 logits，以及 temperature、top_k、top_p 三個取樣設定，回傳最終被選中的 token 在詞彙表裡的 index。要求正確處理以下邊界情況：`temperature == 0`（應退化成 greedy decoding）、`top_k` 大於詞彙表大小、`top_p == 1.0`（應等同於不做 top-p 過濾）、以及套用 top-k/top-p 過濾後候選池可能只剩一個 token 甚至理論上變空的情況。額外討論題：如果這個函式要在生產環境每秒被呼叫幾千次，你會怎麼設計才能避免每次都對整個詞彙表（可能幾萬到幾十萬個 token）做完整排序？

**來源**：AI Engineering 面試題庫收錄的真實題目（GitHub 開源整理，原題為「Implement top-k, top-p, and temperature sampling over a logits vector」），數值陷阱角度延伸自 AI infra coding 面試整理　**難度**：中等　**環節**：technical screen / ML coding round

### 拆解思路

1. **先釐清問題**：先確認輸入的 logits 是單一序列的下一個 token 分布，還是整個 batch 一起處理（這題先假設單一序列，batch 版本是常見的追問延伸）；確認 `temperature`、`top_k`、`top_p` 是否可能同時傳入預設值讓某層過濾形同虛設（例如 `top_k` 設成詞彙表大小、`top_p` 設成 1.0），這會決定要不要特別處理「這層什麼都不做」的快速路徑。
2. **建立框架**：按照業界慣例的固定順序處理——先檢查 `temperature == 0` 直接回傳 argmax（greedy），否則把 logits 除以 temperature；接著做 top-k 過濾（`k = min(top_k, len(logits))` 避免 index 錯誤），只保留分數最高的 k 個；再做 top-p 過濾，把剩下的候選依分數排序、計算 softmax 機率、累加判斷「加入前」是否已達門檻；最後對存活的候選重新做一次數值穩定的 softmax（先減最大值）、renormalize、用累積機率配一個均勻隨機數做抽樣。
3. **深入核心**：這題真正的技術深度在於把「公式」跟「浮點數現實」分開想——softmax 要先減最大值防溢位、temperature=0 要有明確分支而不是讓除以零的例外往上拋、top-p 的邊界判斷要用「加入前的累積總和」而不是「加入後」，三個陷阱任何一個漏掉都可能在正常輸入下跑得好好的、卻在某個邊界輸入（例如模型對某個 token 極度確定）直接壞掉。討論題的答案方向是：生產環境常見的做法是先用 top-k 的固定上限（例如 k=50）把要排序的範圍大幅縮小，再對這個小得多的子集合做 top-p 的排序跟累加，而不是對全詞彙表排序；如果詞彙表真的很大，也可以用近似的 top-k 選取（例如 partial sort / `torch.topk` 這類只找前 k 大而不做完整排序的操作）進一步降低複雜度。
4. **收尾**：把答案收斂成「temperature 整形分布 → top-k 固定數量過濾 → top-p 動態比例過濾 → 數值穩定的 softmax + renormalize → 抽樣」這條完整流水線，並主動點出三個最容易被面試官抓到的邊界情況（overflow、T=0、top-p 的 off-by-one），展現你不只是會呼叫 `torch.softmax`，而是真的想過這些函式在邊界輸入下會怎麼壞。

### 範例回答（面試時可以這樣講）

> 我會把這個函式拆成四個階段，每個階段處理一種邊界情況。**第一階段是 temperature**：如果 `temperature == 0`，我直接回傳 logits 裡最大值的 index 當作 greedy decoding，因為公式上除以零沒有意義，業界慣例是把這個值當成「要求確定性輸出」的訊號；否則把所有 logits 除以 temperature 來整形分布。**第二階段是 top-k**：我會把 `k` clamp 成 `min(top_k, len(logits))` 避免詞彙表比 k 還小時出錯，然後只保留分數最高的 k 個候選，其餘直接丟棄。
>
> **第三階段是 top-p**，這是最容易寫錯的部分。我會把剩下的候選依分數排序、算出 softmax 機率，再由高到低累加，用「加入這個 token 之前的累積總和是否已經達到 p」來判斷要不要保留它，而不是用加入後的總和判斷——這個方向反過來會讓本該保留的最後一個關鍵 token 被誤刪，極端情況下候選池會變空。**第四階段**是對存活下來的候選重新做一次數值穩定的 softmax（先減去這批分數裡的最大值再取 exp，避免大 logit 直接 overflow 成 inf），renormalize 之後用一個均勻隨機數配累積機率做抽樣，回傳對應的 token index。如果要上生產環境、每秒要跑幾千次，我會先用較小的固定 top-k（例如 50）把排序範圍縮小，再對這個小得多的子集合做 top-p 的運算，避免每次都對整個詞彙表排序。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| softmax 數值穩定性：exp 之前先減去最大值防 overflow | |
| temperature=0 的邊界處理：退化成 greedy，不是真的除以零 | |
| 清楚講出套用順序（temperature → top-k → top-p → softmax + renormalize → 抽樣） | |
| top-p 累積機率門檻用「加入前」而非「加入後」判斷 | |
| top_k 超過詞彙表大小時有 clamp，避免 index 錯誤 | |
| 加分項：討論題有提到用較小 top-k 先縮小範圍、避免對整個詞彙表排序的效能優化 | |

## 延伸閱讀

- [How do Top-k and Top-p Sampling work? — Outcome School](https://outcomeschool.com/blog/how-do-top-k-and-top-p-sampling-work) — 完整的 top-k / top-p 步驟拆解，附可直接參考的 PyTorch 實作程式碼，對應今天「套用順序」跟「top-p 邊界判斷」兩段的技術細節。
- [LLM Temperature, Top-P, and Top-K Explained — With Python Simulations — Machine Learning Plus](https://machinelearningplus.com/gen-ai/llm-temperature-top-p-top-k-explained) — 用 NumPy 模擬 softmax、top-k、top-p 的互動效果，程式碼裡明確示範了「減去最大值防止溢位」這個數值穩定性技巧。
- [Temperature, top-k, and top-p sampling — Sebastian Raschka](https://sebastianraschka.com/faq/docs/temperature-topk-topp-sampling.html) — 對 temperature=0 邊界情況的正式說明，解釋為什麼業界把它當成 greedy decoding 的慣例而非真的除以零。

## 參考資料

- [AI Engineer Interview Questions — GitHub（amitshekhariitbhu 開源整理）](https://github.com/amitshekhariitbhu/ai-engineering-interview-questions) — 今天練習題「Implement top-k, top-p, and temperature sampling over a logits vector」的原始出處。
- [Infra Coding Interview Questions & Answers (2026) — AI Infra Interviews](https://aiinfrainterviews.com/c/coding-systems) — 「數值陷阱」提問角度與 AI infra coding round 常見題型的參考來源。
- [How do Top-k and Top-p Sampling work? — Outcome School](https://outcomeschool.com/blog/how-do-top-k-and-top-p-sampling-work) — 對應「套用順序」與「Top-p 最容易寫錯的地方」兩段的技術細節與程式碼來源。
- [LLM Temperature, Top-P, and Top-K Explained — With Python Simulations — Machine Learning Plus](https://machinelearningplus.com/gen-ai/llm-temperature-top-p-top-k-explained) — 對應「Softmax 數值穩定性」段落 exp 減最大值技巧的程式碼來源。
- [Temperature, top-k, and top-p sampling — Sebastian Raschka](https://sebastianraschka.com/faq/docs/temperature-topk-topp-sampling.html) — 對應「Temperature 整形分布」段落 T=0 邊界情況的理論說明來源。
