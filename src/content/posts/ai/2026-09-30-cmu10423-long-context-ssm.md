---
title: "CMU 10-423 L19 + L21：長上下文與 State Space／Hybrid 模型——attention 成本隨長度平方成長時的三條路"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, long-context, attention, state-space-model, mamba, flashattention]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 18
tldr: "CMU 10-423 Spring 2026 的 L19 和 L21 都在處理同一個問題：序列一長，標準 attention 的記憶體與 KV cache 就撐不住。L19 給兩條路：用 sparse、sliding window、dilated attention 近似注意力，或保留完整注意力、改用 Blockwise Parallel Transformer 與 Ring Attention 把計算拆到多張 GPU。L21 給第三條路：換掉 attention，改用只保留固定大小隱藏狀態的 state space model（S4、Mamba），或把 attention 和線性注意力層交錯成 hybrid 模型（Jamba、Nemotron-H、Qwen3-Next）。"
description: "CMU 10-423/623/723 Generative AI（Spring 2026）第 19 講與第 21 講導讀：上下文長度演進表、Needle-in-a-Haystack 測試、延長短上下文模型的配方、長上下文 ICL 與微調的比較、近似注意力、sequence parallelism、Blockwise Parallel Transformer 與 Ring Attention，以及 SSM 的三種表示法、S4、Mamba、線性注意力與 hybrid 模型。"
draft: false
glossary:
  - term: "Ring Attention"
    aliases: ["RingAttention", "環狀注意力"]
    definition: "把長序列切塊分給多個裝置，各裝置用 blockwise 方式計算自己那塊 query 的注意力，同時把 key/value 區塊沿著環狀拓樸傳給下一個裝置；能放進記憶體的序列長度因此隨裝置數量增加。"
    context: "CMU 10-423 第 19 講「efficient full attention」一節的主角。"
    links:
      - label: "Ring Attention（Liu et al., 2023）"
        url: "https://arxiv.org/abs/2310.01889"
  - term: "selective SSM"
    aliases: ["selective state space model", "選擇性狀態空間模型"]
    definition: "Mamba 採用的 SSM 變體：讓參數 B 和 C 隨每個時間步的輸入改變，而不是固定不變。代價是不能先算好一個卷積核，改用掃描（scan）實作。"
    context: "CMU 10-423 第 21 講從 S4 過渡到 Mamba 的關鍵差異。"
    links:
      - label: "Mamba（Gu & Dao, 2023）"
        url: "https://arxiv.org/abs/2312.00752"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu10423-long-context-ssm-en)

**本文依據 [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 版。** 這是 [CMU 10-423 導讀](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)系列第 18 篇，也是「Advanced Topics」單元的第一篇。範圍是兩講：3 月 25 日的 Lecture 19「Long Context in LLM」（講者 Matt Gormley），以及 4 月 1 日的 Lecture 21「State Space Models / Hybrid Models」（講者 Aran Nayebi 與 Matt Gormley）。

用到的官方材料：[講次表](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)、[L19 投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture19-long.pdf)與[課堂手寫版](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture19-long-ink.pdf)（各 40 頁）、[L21 投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture21-ssm.pdf)（42 頁，沒有手寫版）。講次表這兩講都沒列 readings，本文只引投影片本身與投影片標註的論文。這門課的存取等級是 **A3**（定義見[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)），但錄影放在要 CMU 登入的 Panopto，所以本篇完全依投影片撰寫，課堂口述拿不到。

L19 和 L21 中間隔了一講 L20 推理模型。導讀把它們合成一篇，因為兩講回答的是同一個問題：**attention 的成本隨序列長度平方成長，還有哪些路可走？**

## 課程影片來源

官方課站將 Spring 2026 錄影放在 SCS Panopto；匿名頁面未載入影片並提示登入。本文依公開投影片與作業導讀，錄影需依課程授權存取。

課程與錄影入口：

- [CMU 10-423/623/723 Spring 2026 — official Panopto recordings](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [cmu-10-423-generative-ai — official course materials and recording index](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## 先看問題長什麼樣：一段影片就爆掉 context

L19 開場沒有先講公式，而是貼了一段完整的 PyTorch 程式：用 ViT 把影片抽成 10 個影格，每個影格變成一串影像 token，接上 GPT-2 做影片問答。程式本身沒錯，下一頁卻只有一行錯誤訊息：輸入超過 Transformer 的最大上下文長度 4096 token。

這個例子把長上下文的需求講得很具體：多模態輸入、長文件、長對話，都會讓 token 數輕易超過模型的上限。投影片接著用兩張表列出 2019 到 2026 年的模型上下文長度，從 [GPT-2](/posts/ai/2026-09-30-cmu10423-transformer-lm-decoding) 的 1024 一路列到 2026 年多個 1M 等級的模型，最長的一筆是 Grok 4.20 的 2M。

## 怎麼知道模型真的「用得上」長上下文

投影片介紹的第一個工具是 [Needle-in-a-Haystack 測試](https://github.com/gkamradt/LLMTest_NeedleInAHaystack)。投影片的定位很保守：這是「極度簡單、最低限度」的檢查。做法是：

1. 做一份很長的文件
2. 把一個事實埋在文件的某個深度
3. 問模型一個答案正是那個事實的問題

能通過只代表模型找得到資訊，不代表它能在長文裡做推理。

## 短上下文模型怎麼延長

投影片引 [Fu et al. 2024](https://arxiv.org/abs/2402.10171) 的結論：延長短上下文模型有兩個關鍵成分，**可延伸的位置編碼**，以及**仔細挑選的長資料**。配方是：

- 先用 4k 的 block size 在 1 兆 token 上預訓練短上下文模型
- 調整位置編碼的超參數
- 把 block size 拉到 80k 繼續預訓練，但只用 50 億 token

這裡的「可延伸位置編碼」可以回頭對照 [L4 的 RoPE](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa)。

### 長上下文讓 ICL 重新變得有競爭力

[L10 的 PEFT 與 ICL](/posts/ai/2026-09-30-cmu10423-peft-in-context-learning) 曾有一張投影片說「微調通常勝過 in-context learning」，旁邊還註記：那是 2023 年的共識，現在可能不一樣了（見 Lecture 19）。L19 在這裡兌現。

投影片引 [Bertsch et al. 2024](https://arxiv.org/abs/2405.00200)：只要有一個裝得下大量示範的長上下文模型，ICL 有時能勝過微調。實驗用 LLaMA2-7B，在 Clinic-150（151 個類別）與 Trecfine（50 個類別）兩個多類別分類資料集上，比較三種做法：LoRA 微調、隨機挑訓練樣本當示範的 ICL、用 BM25 挑最相似樣本的檢索式 ICL。

## 第一條路：近似注意力

投影片先點出真正的瓶頸：標準注意力的計算和記憶體都是 O(N²)，計算量也許還能接受，**記憶體通常不行**。一種解法是近似注意力的計算，投影片列了三個例子：

| 方法 | 年份 | 複雜度 | 投影片重點 |
|---|---|---|---|
| [Sparse Attention](https://arxiv.org/abs/1904.10509) | 2019 | O(N√N) | 只讓部分位置互相注意 |
| Sliding Window Attention（[Longformer](https://arxiv.org/abs/2004.05150)） | 2020 | O(N) | 因果遮罩只保留一個窗口 |
| Dilated Attention（[LongNet](https://arxiv.org/abs/2307.02486)） | 2023 | O(N) | 混合多種擴張率 |

Sliding window 是 L4 與 HW1 的舊識，這一講補上實作面的三種寫法：

1. **直接做矩陣乘法再遮罩**：還是慢
2. **for 迴圈**：漸進上更快、更省記憶體，但 PyTorch 的 for 迴圈太慢，實務上不能用
3. **sliding chunks**：把 Q 和 K 切成 w×w 的區塊、彼此重疊 ½w，區塊內做完整注意力再遮掉多餘部分；實務上很快、很省記憶體

Dilated attention 的評語最值得記：執行時間很好，但它「已經是另一個模型了」。近似注意力改變的是模型本身，不只是實作。

## 第二條路：保留完整注意力，把計算拆開

L19 後半換個方向：不近似，只讓完整注意力跑得動。

投影片先引 Ring Attention 論文的圖說明一件反直覺的事：Transformer LM 的 FLOPs 並沒有隨上下文長度增加得像你想像那麼快，因為除了 O(N²) 的注意力，模型裡還有很多計算密集的元件。

接下來是一條遞進的路線：

- **[Sequence parallelism](https://arxiv.org/abs/2105.13120)**：把長序列切塊，每塊交給一個裝置，前面裝置的計算要傳給後面的裝置。問題是擴展效率不好，因為後面的 query 仍然要注意 O(N) 個 key/value。
- **[Blockwise Parallel Transformer（BPT）](https://arxiv.org/abs/2305.19370)**：[L18 的 FlashAttention](/posts/ai/2026-09-30-cmu10423-distributed-efficient-inference) 只在注意力層做分塊計算；BPT 把注意力、前饋網路和殘差連接都一起分塊。關鍵在於 softmax 對平移不變，所以可以一塊一塊算注意力，再依其他區塊的統計量重新縮放先前的輸出。每個 query 區塊 Qᵢ 會逐一走過所有 key/value 區塊 Kⱼ、Vⱼ。
- **[Ring Attention](https://arxiv.org/abs/2310.01889)**：用 BPT 在多個裝置上處理超長序列，並讓 key/value 區塊在裝置之間的傳遞方式，和它們在注意力計算中被使用的順序完全一致（投影片的暱稱是「傳包裹」）。結果是：能放進記憶體的序列長度，隨可用裝置數量成長。

投影片列的 Ring Attention 結果：7B 模型在 32 張 A100 上能處理 400 萬 token 的上下文。最後一頁接到同一群作者的 [Large World Model](https://arxiv.org/abs/2402.08268)，也就是上下文長度表裡那筆來自學界、1M token 的 LWModel。

## 第三條路：換掉 attention——State Space Model

L21 的動機頁一句話講完取捨：Transformer 在推論時很慢，因為 KV cache 隨序列長度線性成長；SSM 推論時很快，因為它像 RNN 一樣只在記憶體裡保留固定大小的隱藏狀態。而且只要用對技巧，SSM 也能有效率地訓練。投影片還提到 SSM 能在不同的輸入粒度之間自然轉換（例如 16kHz 與 8kHz 的聲音）。

### 同一個模型，三種寫法

這一講的核心是 SSM 的三種表示法。投影片的圖改編自 Albert Gu 在 Fall 2024 這門課的客座演講。

**連續表示**：把一維函數 x(t) 映射到一維函數 y(t)，中間經過 N 維的隱藏狀態 h(t)：

```text
h'(t) = A h(t) + B x(t)
y(t)  = C h(t) + D x(t)
```

它能完整表示任意連續的一維到一維函數，但沒辦法直接處理真實資料。

**離散遞迴表示**：把連續參數 A、B、C、D 換成它們的函數 Ā、B̄、C̄、D̄，得到和 RNN 一樣的遞迴：

```text
h_{k+1} = Ā h_k + B̄ x_k
y_k     = C̄ h_k + D̄ x_k
```

S4 用 bilinear transformation（一階 Padé 近似）做離散化。

**卷積表示**：假設初始狀態為 0，把遞迴展開，每個 y_k 都是過去輸入的加權和，權重是 C̄ Āʲ B̄。整條序列因此可以寫成一次全域卷積 y = K̄ ∗ x，其中卷積核 K̄ = (C̄B̄, C̄ĀB̄, …, C̄Ā^(L−1)B̄)。**所有 y_k 都能平行計算。**

<details>
<summary>展開：從遞迴到卷積的前三步</summary>

設 h₋₁ = 0，並先忽略 D̄：

- h₀ = B̄x₀，所以 y₀ = C̄B̄x₀
- h₁ = ĀB̄x₀ + B̄x₁，所以 y₁ = C̄ĀB̄x₀ + C̄B̄x₁
- h₂ = Ā²B̄x₀ + ĀB̄x₁ + B̄x₂，所以 y₂ = C̄Ā²B̄x₀ + C̄ĀB̄x₁ + C̄B̄x₂

規律是 y_k = Σⱼ C̄ Ā^(k−j) B̄ xⱼ，係數只和距離 k−j 有關，這正是卷積。

</details>

### 為什麼兩種表示都要

投影片把三類模型放進一張表：

| | 訓練 | 推論 |
|---|---|---|
| 遞迴（RNN） | 慢 | 快 |
| Attention | 快 | 慢 |
| SSM | 快 | 快 |

SSM 推論時用遞迴表示，不需要 KV cache，可以生成真正很長的序列；訓練時用卷積表示，能像 Transformer 一樣平行訓練。

把 SSM 放進語言模型時，做法和多頭注意力類似：取 H 份一維 SSM、各有自己的參數，就像注意力的多個 head 或卷積的多個 channel。整個 S4 LM 由多層 SSM 層（加上非線性等子層）堆起來，語言模型的部分和 RNN-LM、Transformer-LM 一樣。

### S4 要加的兩個技巧

投影片提醒這裡數值不穩定特別嚴重，S4 需要：

- **HiPPO 矩陣**：非常小心地初始化 A
- **高效計算**：分解 A，讓卷積核 K̄ 能有效率且數值穩定地算出來

### Mamba：讓參數跟著輸入變

[Mamba](https://arxiv.org/abs/2312.00752) 的 selective state space model 和 S4 的差別是：參數 B 和 C 在每個時間步都會改變。代價是卷積核 K̄ 不能先一次算好，改用高效的 scan 實作（投影片在這裡標了「回想 FlashAttention 那一講」）。投影片的結論是：Mamba 是第一個能挑戰 Transformer 的非注意力語言模型。

### 線性注意力：Transformer 和 SSM 之間的橋

線性注意力和標準注意力一樣，只是拿掉 softmax。拿掉之後，它可以改寫成一條遞迴，於是 Transformer 和 SSM 之間有了直接的連結。投影片的圖出自 [Gated Delta Networks](https://arxiv.org/abs/2412.06464) 論文，並列出多種已提出的線性注意力形式。

## Hybrid 模型：兩邊各取所長

L21 最後一段是 hybrid 模型。投影片列了三個動機：長上下文的可擴展性、更好的硬體利用率，以及混合不同歸納偏置帶來的泛化能力。三個例子的共同點是：**標準注意力層與線性注意力層交錯排列**。前者對序列長度是平方複雜度，後者是線性，目標是降低記憶體需求、加快生成。

| 模型 | 投影片重點 |
|---|---|
| [Jamba](https://arxiv.org/abs/2403.19887) | 投影片稱它是第一個結合 Transformer 層與 SSM 層的 hybrid 模型（2024）；大幅縮小長上下文的 KV cache，單張 GPU 能放下更長的上下文，生成吞吐量更高 |
| [Nemotron-H](https://arxiv.org/abs/2504.03624) | 保留標準 Transformer（Nemotron-T）的表現，同時大幅提升吞吐量；另有 VLM 版本 |
| [Qwen3-Next](https://qwen.ai/blog?id=4074cca80393150c248e508aa62983f9cb7d27cd) | 用 Gated DeltaNet 層取代一般的線性注意力層；和同尺寸的 dense 模型相比，訓練與生成時間都大幅減少 |

## 三條路一張表

| 路線 | 改的地方 | 代價 | 出處 |
|---|---|---|---|
| 近似注意力 | 注意力的稀疏模式 | 變成另一個模型 | L19 |
| 完整注意力 + 分塊／多裝置 | 計算與通訊的排程 | 需要很多裝置 | L19 |
| SSM／hybrid | 把部分或全部注意力換成固定大小狀態的層 | 需要特殊初始化與 scan 實作 | L21 |

## 課程怎麼驗收這兩講

- **Quiz**：講次表把 L19 排進 Quiz 5（4 月 6 日，L16–L20），L21 排進 Quiz 6（4 月 20 日，L21–L24）。題目不公開。
- **考試**：L19 投影片的提醒頁寫明，3 月 30 日晚上的考試只涵蓋 Lectures 1–15，所以這兩講不在考試範圍，[練習考卷](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)也沒有對應題目。
- **作業**：L15 之後沒有程式作業。想動手的讀者可以把這兩講當成期末專案或 [HW623](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/HW623.pdf) 選題的起點。

**怎麼做**：今晚拿 N = 1（純量）的離散 SSM，隨手設 Ā = 0.5、B̄ = 1、C̄ = 2，輸入 x = [1, 0, 3, 1]。先用遞迴一步步算出 y，再算卷積核 K̄ = [2, 1, 0.5, 0.25] 做一次卷積，確認兩個結果一樣。算完這一次，「訓練用卷積、推論用遞迴」就不再是口號。

## 這一篇可以確認與不能確認的

可以確認：講次表的日期、講者與 Quiz 範圍，兩份投影片的文字、表格與出處標註，投影片引用論文的標題（以 arXiv 核對）。不能確認：課堂口頭講解（Panopto 需登入）、只以圖呈現的數據（例如 Needle-in-a-Haystack 熱圖、Mamba 與 Jamba 的實驗曲線、S4 離散化公式的圖）、投影片課堂問題的官方答案。L19 手寫版抽出的文字和原版相同，我沒有逐頁比對手寫註記。上下文長度表裡的模型規格是投影片自己整理的，本文沒有逐一對照各家官方文件。

延伸閱讀：站上 [CS336 的架構與超參數篇](/posts/ai/2026-08-22-cs336-architectures-hyperparameters)與[推論篇](/posts/ai/2026-08-22-cs336-inference)從自己訓練 LM 的角度談位置編碼與 KV cache；[CMU 11-868 導讀](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)從系統角度談分散式訓練與推論。

系列導覽：上一篇 [L17–L18：分散式訓練、FlashAttention 與高效解碼](/posts/ai/2026-09-30-cmu10423-distributed-efficient-inference)｜下一篇 [L20：推理模型](/posts/ai/2026-09-30-cmu10423-reasoning-models)｜[系列總覽](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [CMU 10-423/623/723 Generative AI（Spring 2026）課程首頁](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [課程講次表（L19、L21 日期與 Quiz 範圍）](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
- [Lecture 19 投影片：Long Context in LLMs](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture19-long.pdf)
- [Lecture 19 投影片（課堂手寫版）](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture19-long-ink.pdf)
- [Lecture 21 投影片：State Space Models + Hybrid Models](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture21-ssm.pdf)
- [gkamradt/LLMTest_NeedleInAHaystack](https://github.com/gkamradt/LLMTest_NeedleInAHaystack)
- [Fu et al. 2024：Data Engineering for Scaling Language Models to 128K Context](https://arxiv.org/abs/2402.10171)
- [Bertsch et al. 2024：In-Context Learning with Long-Context Models: An In-Depth Exploration](https://arxiv.org/abs/2405.00200)
- [Child et al. 2019：Generating Long Sequences with Sparse Transformers](https://arxiv.org/abs/1904.10509)
- [Beltagy et al. 2020：Longformer: The Long-Document Transformer](https://arxiv.org/abs/2004.05150)
- [Ding et al. 2023：LongNet: Scaling Transformers to 1,000,000,000 Tokens](https://arxiv.org/abs/2307.02486)
- [Li et al. 2021：Sequence Parallelism: Long Sequence Training from System Perspective](https://arxiv.org/abs/2105.13120)
- [Liu & Abbeel 2023：Blockwise Parallel Transformer for Large Context Models](https://arxiv.org/abs/2305.19370)
- [Liu et al. 2023：Ring Attention with Blockwise Transformers for Near-Infinite Context](https://arxiv.org/abs/2310.01889)
- [Liu et al. 2024：World Model on Million-Length Video And Language With Blockwise RingAttention](https://arxiv.org/abs/2402.08268)
- [Hazy Research：The Annotated S4 系列部落格（投影片圖片來源）](https://hazyresearch.stanford.edu/blog/2022-01-14-s4-3)
- [Gu & Dao 2023：Mamba: Linear-Time Sequence Modeling with Selective State Spaces](https://arxiv.org/abs/2312.00752)
- [Yang et al. 2024：Gated Delta Networks: Improving Mamba2 with Delta Rule](https://arxiv.org/abs/2412.06464)
- [Lieber et al. 2024：Jamba: A Hybrid Transformer-Mamba Language Model](https://arxiv.org/abs/2403.19887)
- [NVIDIA 2025：Nemotron-H: A Family of Accurate and Efficient Hybrid Mamba-Transformer Models](https://arxiv.org/abs/2504.03624)
- [Qwen3-Next 官方部落格](https://qwen.ai/blog?id=4074cca80393150c248e508aa62983f9cb7d27cd)
- [Spring 2026 Practice Exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)
