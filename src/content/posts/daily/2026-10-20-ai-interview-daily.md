---
title: "AI Engineer 面試日練 — 2026-10-20：Deep Learning & NLP"
date: 2026-10-20
category: daily
type: digest
tags: [ai-engineer-interview, daily, deep-learning]
lang: zh-TW
description: "星期二主題 Deep Learning & NLP：從「Transformer 長文件爆記憶體」這道情境題出發，練習怎麼分清楚 FlashAttention 和 Sliding Window Attention 解決的其實是兩個不同問題。"
tldr: "今天的核心是 self-attention 的 Q/K/V 機制與 √dₖ scaling、multi-head attention 為什麼要多頭、positional encoding 為什麼必要，以及 self-attention 的 O(n²) 成本要怎麼拆解來解決。練習題是一道常見的情境面試題——Transformer 處理長文件時爆記憶體怎麼辦——關鍵不是背出 FlashAttention 或 Sliding Window Attention 的名字，是能講清楚前者優化的是 GPU 記憶體搬運（I/O bound），後者才是真正把演算法複雜度從 O(n²) 降到線性，兩者解決的是不同層次的問題。"
series:
  name: "AI Engineer 面試日練"
  order: 62
---

> 🌏 [English version](/posts/daily/2026-10-20-ai-interview-daily-en)

## 今日主題

星期二固定練 Deep Learning & NLP：CNN、RNN、Transformer、attention、tokenization、fine-tuning、embeddings 這幾塊是所有 AI/ML Engineer 面試裡出現頻率最高的架構題。這類題目常被包裝成情境題——「你的模型在 production 遇到某個限制，你怎麼處理」——而不是單純問定義，因為面試官真正要看的是你能不能把一個架構限制（例如 attention 的計算複雜度）拆成可以動手解決的工程選項，而不是只背出論文裡的名詞。

## 核心概念速記

### Self-attention 與 Q/K/V

每個 token 會被投影成三個向量：Query（我在找什麼）、Key（我能被怎麼找到）、Value（我實際帶的資訊）。計算時先用 Q 和所有 token 的 K 做內積得到分數，再除以 √dₖ 做縮放，通過 softmax 轉成機率分佈，最後用這個分佈去加權所有 token 的 V。除以 √dₖ 這一步很常被追問——當 dₖ（Key 向量維度）變大時，內積的數值會被放大，不縮放的話 softmax 會被少數幾個極端值主導、梯度變得很小，縮放是為了讓 softmax 的輸入維持在一個梯度穩定的範圍。

### Multi-head attention 為什麼要多頭

單一一組 Q/K/V 只能學到一種「關注模式」，例如只抓語法上的主詞-動詞關係。Multi-head attention 把向量切成多組較小的子空間，每組獨立算一次 attention，讓模型同時學到多種不同的關係——有些頭專注語法結構，有些頭專注語意相似度，最後把所有頭的輸出串接再線性投影回原始維度。面試時要能講出一個關鍵細節：多頭不是增加參數換效能的 trick，是給模型「平行學習多種關注模式」的結構性空間。

### Positional encoding 為什麼必要

Self-attention 本身對順序是不敏感的——如果把輸入 token 打亂重排，attention 計算出來的結果集合不會變，模型沒有辦法單靠 attention 知道「誰在誰前面」。Positional encoding 把位置資訊直接加進 token 的 embedding，讓模型在做 attention 運算之前就拿到順序訊號。原始 Transformer 用固定的 sinusoidal 編碼，後來的模型多半改用可學習的位置 embedding，近年主流 LLM（如 Llama 系列）則改用 RoPE（Rotary Position Embedding），讓 attention 分數本身就隨 token 之間的相對距離變化，比絕對位置編碼更容易泛化到訓練時沒見過的長度。

### Self-attention 的 O(n²) 成本與兩種不同層次的解法

輸入有 n 個 token 時，每個 token 都要跟其他 n 個 token 算一次 attention 分數，產生一個 n×n 的分數矩陣——文字長度翻倍，計算量變成 4 倍。這個瓶頸有兩種本質不同的解法，面試時最容易混在一起講：FlashAttention 不改變數學結果、也不改變 O(n²) 的理論複雜度，它優化的是 GPU 記憶體搬運——標準 attention 要把 n×n 的中間矩陣在 HBM（大但慢）和 SRAM（小但快 10-20 倍）之間來回讀寫四次,GPU 大部分時間在等資料而不是在算數學,FlashAttention 用 tiling 把矩陣切成小塊、在 SRAM 內一次做完 softmax 和加權,避免整個矩陣落地到 HBM。Sliding Window Attention 才是真正改變計算量本身——讓每個 token 只看固定範圍內的鄰近 token，把複雜度從 O(n²) 降到 O(n×w)，代價是犧牲了超出 window 範圍的直接長距依賴。

## 今日練習題

### 題目

你的 Transformer 模型在處理長文件時，因為 self-attention 的計算量是 quadratic（O(n²)），在長輸入上跑到記憶體不足（OOM）。請說明你會怎麼處理這個問題。

**來源**：整理自 amitshekhariitbhu/ai-engineering-interview-questions（GitHub AI Engineering 面試題庫，收錄 LLM/Transformer 架構類情境題）　**難度**：進階　**環節**：onsite / system design

### 拆解思路

1. **先釐清問題**：先問清楚是訓練時 OOM 還是推理（inference）時 OOM，文件實際長度是多少（幾千 token 還是數十萬 token），硬體限制是單張 GPU 還是可以多卡分散，以及任務本身能不能接受犧牲一點長距依賴的準確度換取記憶體。這幾個答案會直接決定該往哪個方向解。
2. **建立框架**：把手段分兩層講——先問「現有複雜度下記憶體效率有沒有榨到最大」（FlashAttention、KV cache 量化/分頁），如果榨到最大還是不夠，再問「要不要真的降低計算複雜度本身」（Sliding Window Attention、稀疏 attention、分段 chunking 再做跨段整合）。先講框架再填細節，避免一聽到「OOM」就直接跳答案。
3. **深入核心**：這題的技術核心是分清楚 FlashAttention 和 Sliding Window Attention 解決的不是同一層問題。FlashAttention 不改變 O(n²) 的理論複雜度，它解決的是 GPU 記憶體搬運的 I/O 瓶頸（HBM↔SRAM 的來回讀寫），數學結果完全不變；Sliding Window Attention 才是真正把複雜度從 O(n²) 降到 O(n×w)，但犧牲了視窗外的直接長距依賴（雖然透過多層堆疊,資訊仍能間接傳遞到更遠的位置）。面試時把這兩者講混,會被追問「所以你到底降低了計算量還是沒有」,一旦答不清楚會直接扣分。
4. **收尾**：總結成一句話——「先用 FlashAttention 把現有複雜度下的記憶體效率榨到最大，如果文件長度還是超出可接受範圍，才上 Sliding Window Attention 或分段處理去真正降低複雜度，並用長距依賴相關的任務指標驗證犧牲的那部分有沒有傷到效果」,再補一句生產環境怎麼監控：inference latency、OOM 發生率，以及如果換成 windowed attention 要追蹤長距任務的準確度是否下降。

### 範例回答（面試時可以這樣講）

> **先確認瓶頸在哪一層**：我會先問清楚是訓練還是推理階段 OOM、文件平均長度多少、以及這個任務是不是真的需要很長的長距依賴（例如法律合約的條款互相引用，還是一般長文摘要）。如果文件長度在幾千到一萬 token 左右，我會先確認目前是不是已經用了 FlashAttention——它不改變 O(n²) 的理論複雜度，但解決的是標準 attention 要把 N×N 的中間矩陣在 GPU 的 HBM 和 SRAM 之間來回讀寫四次的 I/O 瓶頸，用 tiling 把計算切成小塊留在快速的 SRAM 裡做完，光這一步通常就能讓同樣的記憶體預算處理長好幾倍的輸入。
>
> **如果榨完 I/O 效率還是不夠**：那就要動到真正的計算複雜度。我會上 Sliding Window Attention，讓每個 token 只關注固定範圍內的鄰近 token，把複雜度從 O(n²) 降到 O(n×w)，文字長度翻倍時工作量只跟著線性增加，不會變成四倍。代價是視窗外的 token 沒辦法直接互相看到,但透過多層堆疊,資訊還是能一層一層往外傳遞到更遠的位置,只是路徑變長了。
>
> **接到生產環境的驗證**：換成 windowed attention 之後，我不會只看 OOM 有沒有解決，還會特地挑幾個需要長距依賴的任務（例如長文件裡前後呼應的條款）做對照評估，確認犧牲的那部分沒有明顯傷到效果。上線後持續監控 inference latency 和 OOM 發生率，如果業務上真的需要很長的長距依賴，我才會進一步考慮分段 chunking 搭配跨段的 retrieval 機制去補回來。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有先問清楚文件長度、訓練/推理階段、是否能接受犧牲長距依賴 | |
| 有分清楚 FlashAttention（I/O 優化，不降低理論複雜度）vs Sliding Window Attention（真正把 O(n²) 降到線性）的差異 | |
| 有講出 O(n²) 的根源：每個 token 都要跟所有其他 token 算一次 attention 分數 | |
| 有提到 trade-off：windowed/sparse attention 會犧牲視窗外的直接長距依賴 | |
| 有提到上線後要監控 latency、OOM 發生率，並用長距任務指標驗證效果 | |
| 加分：提到 KV cache 分頁/量化，或分段 chunking 搭配 retrieval 補長距依賴 | |

## 延伸閱讀

- [How does Sliding Window Attention work? — Outcome School](https://outcomeschool.com/blog/how-does-sliding-window-attention-work) — 用教室比喻把「為什麼 O(n²) 會爆」和「window 怎麼把複雜度降成線性」講得很直覺，適合當這題的第一手補充。
- [What is Flash Attention and Why Is It So Fast? — Outcome School](https://outcomeschool.com/blog/decoding-flash-attention) — 詳細拆解 HBM/SRAM 的速度差異和 tiling 怎麼減少記憶體搬運，補強本篇沒有展開的 GPU 記憶體機制細節。

## 參考資料

- [amitshekhariitbhu/ai-engineering-interview-questions — GitHub](https://github.com/amitshekhariitbhu/ai-engineering-interview-questions) — 本篇練習題「Transformer 長文件 OOM」的原始問法來源，同時也是 Q/K/V、positional encoding、multi-head attention 等核心概念題目的整理清單。
- [Math Behind Attention: Q, K, V — Outcome School](https://outcomeschool.com/blog/math-behind-attention-qkv) — 對應「Self-attention 與 Q/K/V」一節的數學細節，含 √dₖ scaling 的推導。
- [How does Sliding Window Attention work? — Outcome School](https://outcomeschool.com/blog/how-does-sliding-window-attention-work) — 對應「O(n²) 成本與兩種不同層次的解法」一節中 Sliding Window Attention 的機制說明。
- [What is Flash Attention and Why Is It So Fast? — Outcome School](https://outcomeschool.com/blog/decoding-flash-attention) — 對應同一節中 FlashAttention 的 HBM/SRAM I/O 瓶頸說明。
