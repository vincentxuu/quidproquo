---
title: "CMU 10-423 L17–L18：分散式訓練、FlashAttention 與高效解碼——一張 GPU 放不下、推論又太慢時從哪裡下手"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, distributed-training, parallelism, flashattention, pagedattention, speculative-decoding]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 17
tldr: "CMU 10-423 Spring 2026 的 Scaling Up 單元後兩講。L17 從「GPU 之間的通訊才是主要瓶頸」出發，依序講資料平行、Megatron 式的張量平行、1F1B 管線平行、ZeRO 的 optimizer 平行、TeraPipe 的 token 平行與專家平行，結論是資料平行仍是主角，其他平行都在幫它塞進更多資料。L18 講兩件事：FlashAttention 用 tiling 加 online softmax 加 recomputation，在不改變結果的前提下減少 HBM 讀寫；解碼端則是 PagedAttention 管 KV cache 記憶體、speculative decoding 減少大模型呼叫次數。"
description: "CMU 10-423/623/723 Generative AI（Spring 2026）Lecture 17 與 Lecture 18 導讀：GPU 規格與通訊瓶頸、六種平行化（資料、張量、管線、optimizer／ZeRO、token、專家）、column／row parallel 的配對、1F1B 與 weight stashing；FlashAttention 的矩陣 tiling、online softmax、GPU 記憶體階層、operator fusion 與 recomputation；PagedAttention 與 speculative decoding。含投影片版本與校外可取得範圍的說明。"
draft: false
glossary:
  - term: "1F1B"
    aliases: ["one-forward-one-backward"]
    definition: "管線平行的一種排程：穩定狀態下，每張 GPU 交替做一次 microbatch 的前向與一次反向，減少管線的閒置時間。"
    context: "L17 投影片引 PipeDream 與 Megatron-LM 的圖說明 1F1B 與 pipeline flush。"
  - term: "online softmax"
    definition: "一邊掃過資料、一邊更新目前最大值與正規化分母的 softmax 算法，把 safe softmax 的三次記憶體掃描降成兩次，也讓 softmax 可以分塊計算。"
    context: "L18 用它解釋為什麼 attention 可以像矩陣乘法一樣做 tiling，這是 FlashAttention 的前提。"
    links:
      - label: "Milakov & Gimelshein 2018"
        url: "https://arxiv.org/abs/1805.02867"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu10423-distributed-efficient-inference-en)

**本文依據 [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 版。** 這是 [CMU 10-423 導讀](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)系列第 17 篇，也是「Scaling Up」單元的最後一篇。[上一篇](/posts/ai/2026-09-30-cmu10423-scaling-laws-moe)回答「模型該多大」，這一篇回答「那麼大的模型要怎麼訓練、怎麼服務」。

用到的官方材料：[Lecture 17 投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture17-distributed.pdf)與[手寫版](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture17-distributed-ink.pdf)、[Lecture 18 投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture18-efficient.pdf)、[課程講次表](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)。全部在 2026-09-30 下載核對。講次表這兩講沒有列 readings，本文引用的論文都是投影片上標註的出處。

> **版本說明**：L17 投影片（3 月 18 日）的 PDF 建立於 2026 年 3 月，但提醒頁寫的是 HW4「Out: Thu, Oct 23」、HW623「Due: Mon, Dec 1」，是 Fall 2025 的日期，內容應是沿用上學期版本；投影片註明取材自 Henry Chai 與 Pat Virtue。L18（3 月 23 日）的提醒頁則是 Spring 2026 的日期，沒有手寫版。錄影只放在 CMU 內部的 Panopto，校外看不到。

## 課程影片來源

官方課站將 Spring 2026 錄影放在 SCS Panopto；匿名頁面未載入影片並提示登入。本文依公開投影片與作業導讀，錄影需依課程授權存取。

課程與錄影入口：

- [CMU 10-423/623/723 Spring 2026 — official Panopto recordings](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [cmu-10-423-generative-ai — official course materials and recording index](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## L17：分散式訓練

### 瓶頸在 GPU 之間

L17 先回顧 L15 的 Llama 成本問題，引了一則新聞：Meta 新公布的兩個叢集各有 24,576 張 H100，舊叢集是 16,000 張 A100。接著一張 GPU 比較表（投影片原樣）：

| | A100 | H100 | B200 |
|---|---|---|---|
| 記憶體 | 80 GB | 80 GB | 192 GB |
| BF16 效能 | 0.6 PFLOPS | 1.9 PFLOPS | 4.5 PFLOPS |
| GPU 間頻寬 | 約 0.6 TB/s | 約 0.9 TB/s | 約 1.8 TB/s |
| 價格 | 約 1 萬美元 | 約 2.5 萬美元 | 約 5 萬美元 |

投影片的結論：**GPU 之間的通訊是分散式系統的主要瓶頸，而且加速它值很多錢。** 這一講的目標也跟著定下來：把訓練 LLM 的工作分給多張 GPU，同時讓 GPU 之間的通訊最少。好消息是 Transformer 架構非常容易平行化。

投影片列了六種平行：資料、模型（張量）、管線、optimizer、token、專家。下面照投影片順序走。

### 資料平行：最簡單，但每張卡都要放整個模型

每個 minibatch 平分給多張 GPU，各自做前向與反向，最後把梯度加總再廣播。投影片說這是「能用就用」的最簡單、最有效的平行，每次迭代只有一次 GPU 間通訊。

問題是每張 GPU 都要存一份完整模型。投影片用 Llama-4 算給你看：Maverick 約 4,000 億參數，用 16 位元（2 bytes）存就要約 800 GB；Behemoth 約 2 兆參數要約 4,000 GB，而一張 B200 只有 192 GB。所以要把模型拆開。

### 張量平行：column 與 row 交替

模型平行（也叫張量平行）把同一層的計算切到多張 GPU 上，Transformer 裡能切的是 MLP 與 attention 兩塊。投影片的推導取自 [Megatron-LM](https://arxiv.org/abs/1909.08053)：

- 線性層 $f(X) = XW$ 的權重可以按 column 切（**column-parallel**）或按 row 切（**row-parallel**）。
- column-parallel 的前向是把各段輸出串起來，反向要加總；row-parallel 正好相反。
- 所以連續兩個 MLP 可以一個用 column-parallel、一個用 row-parallel 交替，把跨 GPU 的加總減到最少。Megatron 的圖裡，$f$ 在前向是恆等、反向是加總，$g$ 在前向是加總、反向是恆等。
- 多頭注意力天生可以按 head 切開；如果 head 是橫向串接，輸出可以直接交給 row-parallel 的 MLP。

<details>
<summary>投影片的矩陣切法速記</summary>

設 $Z = XW$。按 column 切 $W = [W_1, W_2]$ 時，$Z = [XW_1, XW_2]$，各 GPU 只要完整的 $X$。按 row 切時，$X$ 也要對應切成 $[X_1, X_2]$，$Z = X_1 W_1 + X_2 W_2$，最後要一次加總。投影片的觀察是：兩種切法的前向與反向計算互為鏡像。
</details>

### 管線平行：1F1B 與 weight stashing

把不同層放在不同 GPU 就是管線平行，但層與層之間本來就是循序的，天真的做法有大量閒置時間。投影片依 [PipeDream](https://arxiv.org/abs/1806.03377) 的圖說明改進：

1. 同時處理多個 microbatch。
2. **1F1B**：穩定狀態下每張 GPU 交替做一次前向、一次反向。
3. 如果每次反向都更新權重，同一個 microbatch 前向與反向用的權重會不一樣，愈前面的 GPU 差得愈多，可能讓收斂變差。解法是 **weight stashing**：每次前向後存下權重，反向時載回來。
4. [Megatron-LM 2021](https://arxiv.org/abs/2104.04473) 的版本在 minibatch 之間做 pipeline flush 同步；投影片說即使前向與反向的計算量不同，1F1B 仍然很有效率。
5. 層要怎麼分給 GPU？先 profile 程式，再用動態規劃。

講到這裡投影片下了一個結論：**資料平行仍然是主角**，張量與管線平行是用來支援它，讓更多資料能推過前向與反向。

### Optimizer 平行：Adam 的狀態比權重還大

SGD 更新只需要梯度與目前的權重；Adam 還要存一階動量 $M$ 與二階動量 $S$。在混合精度訓練裡，$M$ 和 $S$ 與權重同形狀，而且因為 $S$ 有平方項，通常以 FP32 存。投影片引 [ZeRO](https://arxiv.org/abs/1910.02054) 的算法：Adam 的額外狀態 K = 12 bytes／參數（梯度、$M$、$S$ 各 4 bytes）。ZeRO-DP（zero redundancy optimizer 驅動的資料平行）就是把這些狀態分散到各 GPU，不要每張卡各存一份。

### Token 平行與專家平行

- **Token 平行**（[TeraPipe](https://arxiv.org/abs/2102.07988)）：causal attention 下，第 l 層第 t 個 token 只依賴第 l 層前面的 token，所以不必等上一層全部算完，第 l−1 層的前 t−1 個 token 好了就能開始。投影片說管線切得愈細閒置愈少，而且收益隨序列長度增加，模型又一直往長上下文走。它引的圖是 all-forward-all-backward 排程：不需要 weight stashing，但閒置時間比較多。
- **專家平行**：接續 [L16 的 MoE](/posts/ai/2026-09-30-cmu10423-scaling-laws-moe)，每個專家放一張 GPU，並設定容量。依 [GShard](https://arxiv.org/abs/2006.16668) 的做法，超過容量的 token 直接經由殘差連接送到下一層。依 [Switch Transformer](https://arxiv.org/abs/2101.03961) 的圖，capacity factor 太小容易超額分配，太大則有些 GPU 閒著。

投影片中段還更新了一次 LLM 規模表，新增 LLaMA-4（2025）：30 兆 token、2 兆參數（2,880 億活躍）。

## L18：FlashAttention 與高效解碼

### 為什麼要在乎 FlashAttention

投影片開宗明義：FlashAttention 算的是**精確**的 attention，所以 perplexity 與模型品質都不會變，要看的指標只有執行時間。它 2022 年 7 月發表在 ICML 的 HAET workshop，同年 12 月登上 NeurIPS；投影片形容它是近年最有影響力的 ML 想法之一，很多人用了卻不知道。

### 前置一：矩陣乘法的 tiling

矩陣乘法的每個輸出元素是一列與一行的內積，所以可以按區塊拆：輸出的每一塊，等於對應輸入區塊兩兩相乘再累加。tiling 就是利用這個分解：大矩陣放在又大又慢的記憶體，每次只把一對小塊搬進又小又快的記憶體計算，再累加回輸出。

問題是 attention 沒辦法直接照做：矩陣乘法裡的加法有結合律，attention 裡的 softmax 沒有。

### 前置二：online softmax

一般 softmax 為了避免 $e$ 的大次方溢位，會先減去最大值（safe softmax），每個深度學習框架都這樣實作。但 safe softmax 要掃三次資料，每次都讀記憶體。[Online softmax](https://arxiv.org/abs/1805.02867) 邊掃邊更新最大值與分母，降成兩次；投影片說這帶來表面上 1.33 倍、實測約 1.3 倍的加速，因為記憶體頻寬需求降低了。

### FlashAttention 本身

**GPU 記憶體階層**：SRAM 最小最快，HBM 較大但慢很多，CPU DRAM 最大也最慢。投影片引 [Data Movement Is All You Need](https://arxiv.org/abs/2007.00072) 的數據：Transformer 訓練中，矩陣乘法佔 99% 的 FLOPs，卻只佔 61% 的執行時間，大量時間花在搬資料。

**Operator fusion**：一般做法是每一層都把輸入從 HBM 搬到 SRAM、算完再寫回 HBM；融合後把輸入搬進 SRAM 一次做完一串運算，最後才寫回。投影片點明：標準 attention 就是前一種寫法，Q、K、V、分數矩陣 S、機率矩陣 P、輸出 O 都在 HBM 裡來回。

[FlashAttention](https://arxiv.org/abs/2205.14135) 把兩個都不新的想法組合起來：

1. **Tiling**：一塊一塊算 attention 權重，不必一次把全部搬進 SRAM。難點在 softmax 橫跨多個區塊，這正是 online softmax 派上用場的地方。
2. **Recomputation**：從不存完整的 attention 矩陣，反向傳播需要時再把那一塊重算出來。投影片先用一個兩層 MLP 示範：前向算完就刪掉隱藏層 $z$，反向時用 $x$ 重算。

投影片也引了 [FlashAttention-2](https://arxiv.org/abs/2307.08691) 的圖說明分塊的計算方式。

### 解碼端：PagedAttention

投影片先用作業系統的虛擬記憶體當背景：每個行程看到連續的虛擬位址，OS 透過頁表對應到分散的實體頁。

[PagedAttention](https://arxiv.org/abs/2309.06180) 就是 GPU 上 attention 的虛擬記憶體：

- **問題**：服務 LLM 時要保留隨 token 數成長的 KV cache，傳統系統配置一整塊連續記憶體，造成內部碎片（預留沒用到）、外部碎片（請求之間的空隙）與浪費的容量；記憶體利用率低，吞吐量（每秒 token 數）就低。
- **解法**：把 KV cache 切成固定 token 數的區塊，非連續存放，用 block table 對應邏輯與實體位址；attention kernel 逐塊計算；區塊只在需要時配置、不用時回收。

### 解碼端：Speculative decoding

投影片的四步演算法：

1. 把 prompt 預填（prefill）進大的目標模型。
2. 用小的草稿模型快速提出接下來 n 個 token。
3. 把這 n 個草稿 token 一次預填進目標模型驗證，保留前 k ≤ n 個。
4. 位置往前推 k，重複 2、3。

好處是每個輸出 token 需要的大模型呼叫次數變少、吞吐量提高，而且輸出分布與一般解碼相同。

## 考試與驗收

L18 的提醒頁寫明：3 月 30 日晚上的考試涵蓋 Lectures 1–15（與 Quiz 1–4 相同），可以帶一張雙面筆記，題型除了選擇題還有開放式問題。所以 L17、L18 不在考試範圍內，講次表把它們排進 Quiz 5（L16–L20）。這兩講沒有對應的程式作業，[練習考卷](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)也沒有專門的大題，想自我檢核只能靠投影片上的問題。

## 自學怎麼讀這兩講

1. L17 先把六種平行各用一句話寫下「切的是什麼、要通訊什麼」，再對照投影片編號 50 的結論「資料平行仍是主角」。
2. 張量平行的部分，自己在紙上用 2×2 區塊驗證 column／row 切法的前向與反向。
3. L18 先讀 tiling 與 online softmax，再讀 FlashAttention；順序反過來會看不懂為什麼 softmax 是難點。
4. 用 PagedAttention 那頁和作業系統頁表那頁逐項對照：頁 ↔ KV 區塊、頁表 ↔ block table。

**怎麼做**：今晚用 NumPy 寫一個 20 行的 online softmax：對一個長向量分三塊掃過，只維護目前最大值和分母，最後跟 `scipy.special.softmax` 比對結果。寫得出來，FlashAttention 的 tiling 就只剩把它套到 $QK^T$ 的每一列上。

## 這一篇可以確認與不能確認的

可以確認：兩份投影片的文字、表格與出處標註，講次表日期與 Quiz 5 範圍，L18 提醒頁的考試資訊。不能確認：課堂口頭講解與板書（錄影在 Panopto；L18 沒有手寫版）、只以圖呈現、文字抽不出來的數據（例如 FlashAttention 的實測加速倍數、speculative decoding 的圖）、投影片 GPU 表格數字的原始出處細節（投影片列的是 NVIDIA 規格書連結，我沒有逐一對照）。

## 延伸閱讀

- 平行化從 collective 組起：[CS336 Lecture 7：從 collective operations 組出資料、張量與管線平行](/posts/ai/2026-08-22-cs336-parallelism-mechanics)、[CS336 Lecture 8：ZeRO、FSDP 與 3D Parallelism](/posts/ai/2026-08-22-cs336-parallelism-strategies)
- 推論的瓶頸：[CS336 Lecture 10：LLM 推論的核心是少讀權重與 KV cache](/posts/ai/2026-08-22-cs336-inference)
- 系統課的深入版：[CMU 11-868 LLM Systems 導讀](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)，特別是 [L14–L15 資料平行](/posts/ai/2026-09-30-cmu11868-data-parallel-training)、[L18 ZeRO](/posts/ai/2026-09-30-cmu11868-zero-memory-optimization)、[L21 FlashAttention](/posts/ai/2026-09-30-cmu11868-flashattention)、[L22、L24 PagedAttention 與 LLM 服務](/posts/ai/2026-09-30-cmu11868-llm-serving-sglang-vllm)

系列導覽：上一篇 [L15–L16：Scaling laws 與 Mixture of Experts](/posts/ai/2026-09-30-cmu10423-scaling-laws-moe)｜下一篇 [L19、L21：長上下文與 State Space 模型](/posts/ai/2026-09-30-cmu10423-long-context-ssm)｜[系列總覽](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [CMU 10-423/623/723 Generative AI（Spring 2026）課程首頁](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [課程講次表](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html) — L17、L18 日期與 Quiz 5 範圍
- [Lecture 17 投影片：Distributed Training](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture17-distributed.pdf)、[手寫版](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture17-distributed-ink.pdf)
- [Lecture 18 投影片：Efficient Attention (FlashAttention) & Efficient Decoding Strategies](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture18-efficient.pdf)
- [Shoeybi et al. 2019：Megatron-LM](https://arxiv.org/abs/1909.08053)
- [Harlap et al. 2018：PipeDream](https://arxiv.org/abs/1806.03377)
- [Narayanan et al. 2021：Efficient Large-Scale Language Model Training on GPU Clusters Using Megatron-LM](https://arxiv.org/abs/2104.04473)
- [Rajbhandari et al. 2019：ZeRO: Memory Optimizations Toward Training Trillion Parameter Models](https://arxiv.org/abs/1910.02054)
- [Li et al. 2021：TeraPipe: Token-Level Pipeline Parallelism](https://arxiv.org/abs/2102.07988)
- [Lepikhin et al. 2020：GShard](https://arxiv.org/abs/2006.16668)
- [Fedus et al. 2021：Switch Transformers](https://arxiv.org/abs/2101.03961)
- [Milakov & Gimelshein 2018：Online normalizer calculation for softmax](https://arxiv.org/abs/1805.02867)
- [Ivanov et al. 2020：Data Movement Is All You Need](https://arxiv.org/abs/2007.00072)
- [Dao et al. 2022：FlashAttention](https://arxiv.org/abs/2205.14135)
- [Dao 2023：FlashAttention-2](https://arxiv.org/abs/2307.08691)
- [Kwon et al. 2023：Efficient Memory Management for Large Language Model Serving with PagedAttention](https://arxiv.org/abs/2309.06180)
