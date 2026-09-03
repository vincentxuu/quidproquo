---
title: "AI Engineer 面試日練 — 2026-08-21：Coding（ML 手刻實作）"
date: 2026-08-21
category: daily
type: digest
tags: [ai-engineer-interview, daily, coding]
lang: zh-TW
description: "今日練 ML coding round 手刻實作：NumPy 向量化、softmax 數值穩定性、multi-head attention 從零實作，以及批次推論的 padding/masking 處理。"
tldr: "ML coding round 考的不是背 leetcode，而是能不能只用 NumPy 把 attention、k-means 這類 ML 元件從零寫出來，同時講清楚每一步的 shape 和複雜度。今天聚焦五個高頻考點：向量化思維、softmax 數值穩定性、shape 追蹤與複雜度分析、batch inference 的 padding/masking，以及手刻演算法時該怎麼驗證正確性。"
series:
  name: "AI Engineer 面試日練"
  order: 2
---

> 🌏 [English version](/en/posts/daily/2026-08-21-ai-interview-daily-en)

## 今日主題

ML coding round 是 ML engineer 面試和一般軟體工程師面試最大的分岔點。你拿到的不是 LRU cache 或 rate limiter 這類通用資料結構題，而是「不准用 `torch.nn`、不准用 autograd，只用 NumPy 把這個 ML 元件寫出來」。面試官在乎的不只是最終能不能跑，而是你有沒有向量化的直覺、有沒有踩過數值穩定性的坑、以及能不能邊寫邊講出每一步的 tensor shape。

這類題目最常出現在 frontier lab 的 ML engineer 或 research engineer loop 裡，60 分鐘、live shared editor、協作式撰寫。今天不練泛用演算法題，而是練這個賽道專屬的手刻能力。

## 核心概念速記

### NumPy 向量化與 Broadcasting

避免用 Python for-loop 逐元素運算，是 ML coding round 的第一道門檻。面試官會盯著你的巢狀迴圈問「這樣跑 batch size 1000 會多慢」，你要能立刻把它改寫成矩陣運算——用 broadcasting 讓 `(batch, seq, dim)` 的張量直接做矩陣乘法，而不是對每個 batch 或每個 token 迴圈處理。

### Softmax 的數值穩定性

Softmax 是幾乎每題手刻都會用到的元件，但直接對原始 logits 取 exp 容易在數值大時 overflow。標準作法是先減去該軸的最大值再取 exp（`x - np.max(x, axis=-1, keepdims=True)`），數學上不改變結果，卻是面試官用來判斷你有沒有寫過生產程式碼的分水嶺。

### Shape 追蹤與複雜度分析

手刻 attention、convolution 這類題目時，面試官在意你能不能邊寫邊講出每一步的 tensor shape，以及整體時間複雜度。Self-attention 的核心成本是 `QKᵀ` 這步的 O(n²d)，這也是為什麼長序列需要 flash attention 或 sparse attention 這類優化——先講清楚 naive 版本的瓶頸，才有資格講優化方向。

### Batch Inference 的 Padding 與 Masking

真實資料的序列長度不一致，批次推論要 pad 到相同長度，但 padding 的位置不能參與 attention 或 loss 計算。做法是建立一個 boolean mask，在算完 attention score、softmax 之前把 padding 位置填成 `-inf`（或極小值），確保 softmax 後那些位置的權重趨近於零。

### 手刻演算法的測試策略

從零實作一個 ML 演算法時，不要等寫完才測試。面試官期待你用小到能手算的例子（例如 `seq_len=2` 的 attention、3 個點的 k-means）驗證中間結果，或是跟 `sklearn`／`scipy` 的內建實作比對輸出。這個習慣本身就是加分項，因為它展現了你在生產環境會怎麼防止 silent bug。

## 今日練習題

### 題目

「不使用 `torch.nn` 或 autograd，只用 NumPy，從零實作 scaled dot-product attention 與 multi-head attention。」

**來源**：OpenAI ML Engineer 面試 Round 2　**難度**：進階　**環節**：onsite ML coding round（60 分鐘，live shared editor）

### 拆解思路

1. **先釐清問題**：問清楚 batch size、序列長度、是否需要處理 padding mask、是否要支援 causal mask（decoder-only 場景）。這些決定你要不要在 attention score 算完後加額外的 masking 邏輯。

2. **建立框架**：先寫單頭版本的 scaled dot-product attention（`Q, K, V → softmax(QKᵀ/√d)V`），確認 shape 對得上，再抽象成 multi-head——把 embedding 維度切成 h 個 head，平行算完再 concat 回去，過一層 output projection。

3. **深入核心**：面試官最想聽到的 trade-off 是「for-loop 逐 head 算 vs. 用 reshape 把 head 維度攤平成 batch 維度一次算完」——後者才是生產程式碼會用的寫法，能展示你懂怎麼用 NumPy 的 broadcasting 榨乾效能。另一個常被追問的點是 softmax 的數值穩定性，以及 causal mask 要怎麼在不寫 for-loop 的情況下用 `np.triu` 生成。

4. **收尾**：主動提「這個 naive 實作是 O(n²d)，真實系統會用 flash attention 或 KV cache 來處理長序列或自回歸生成」，並用小 case 手算結果來驗證正確性，而不是寫完就假設它是對的。

### 範例回答（面試時可以這樣講）

> 我會先寫單頭版本，把三個矩陣乘法和一個 softmax 串起來。**輸入是 `Q`、`K`、`V`，shape 都是 `(batch, seq_len, d_k)`。** 先算 `scores = Q @ K.transpose(-1, -2) / sqrt(d_k)`，得到 `(batch, seq_len, seq_len)` 的 attention score matrix。如果有 mask，就在這一步把要遮蔽的位置設成 `-1e9`，再做 softmax——softmax 要先減掉該軸的 max 避免 overflow。最後 `output = softmax(scores) @ V`，拿回 `(batch, seq_len, d_k)`。
>
> **Multi-head 的關鍵是不要真的寫 for-loop 跑 h 次。** 我會把 `d_model` 切成 h 個 `d_k = d_model // h`，用 `reshape` 加 `transpose` 把 head 維度搬到跟 batch 同一層，變成 `(batch * h, seq_len, d_k)`，這樣單頭那段程式碼可以原封不動重用，NumPy 的矩陣乘法會自動平行處理每個 head。算完後再 reshape 回 `(batch, seq_len, d_model)`，過一層 output projection `W_o`。
>
> **驗證的部分**，我會先用一個 `seq_len=2, d_model=4` 的小 case 手算 attention score，對照程式輸出；如果有 causal mask，再用 `np.triu` 生成上三角遮罩測邊界情況，確認第一個 token 只能看到自己，不會偷看未來的 token。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| Q/K/V 的 shape 有講清楚 | |
| Softmax 數值穩定性（減去 max） | |
| Multi-head 用 reshape/transpose 而非 for-loop | |
| Masking 在 softmax 之前套用 -inf | |
| 複雜度分析：O(n²d) | |
| 用小 case 手算驗證正確性 | |
| 加分：提到 flash attention / KV cache 優化方向 | |

## 延伸閱讀

- [Interview Coder — OpenAI ML Engineer Interview (2026): Process & Prep](https://www.interviewcoder.co/blog/openai-ml-engineer-interview) — 完整拆解 OpenAI ML engineer 六輪面試，附 attention、k-means、2D convolution 的 NumPy 手刻範例
- [Sundeep Teki — AI Career Advice for OpenAI, Anthropic & DeepMind Roles](https://www.sundeepteki.org/advice.html) — Anthropic Research Engineer 2026 面試指南，涵蓋 PyTorch/JAX/NumPy 手刻實作與六個月準備框架
- [Shadecoder — Machine Learning Coding Interview Prep Guide (2026)](https://www.shadecoder.com/blogs/machine-learning-coding-interview-prep-guide-2026-skills-practice-tools) — ML coding round 常見題型分類：資料前處理、演算法手刻、模型評估、優化問題

## 參考資料

- [Interview Coder — OpenAI ML Engineer Interview (2026): Process & Prep](https://www.interviewcoder.co/blog/openai-ml-engineer-interview) — 今日練習題來源：ML coding round 的 attention 手刻題型與 60 分鐘 live coding 格式
- [Sundeep Teki — AI Career Advice for OpenAI, Anthropic & DeepMind Roles](https://www.sundeepteki.org/advice.html) — 核心概念中「ML-native coding fluency」與手刻優先於框架 API 的面試趨勢
- [Shadecoder — Machine Learning Coding Interview Prep Guide (2026)](https://www.shadecoder.com/blogs/machine-learning-coding-interview-prep-guide-2026-skills-practice-tools) — 核心概念速記中資料前處理與演算法從零實作的常見考法
