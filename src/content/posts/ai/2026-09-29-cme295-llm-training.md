---
title: "CME295 第 4 講：LLM 訓練的帳單，預訓練、SFT 與 LoRA 各花在哪裡"
date: 2026-09-29
category: ai
type: deep-dive
tags: [cme295, pre-training, fine-tuning, lora, stanford]
lang: zh-TW
series:
  name: "Stanford CME295 導讀"
  order: 4
tldr: "CME295 第 4 講把 LLM 訓練拆成兩段：先用上兆個 token 做預訓練（Llama 3 用了 15 兆），再用數千到數百萬筆示範資料做 SFT，讓模型從「接話」變成「回答」。中間穿插一張省記憶體的地圖：ZeRO、FlashAttention、混合精度；最後用 LoRA 與 QLoRA 讓沒有大 GPU 的人也能微調，QLoRA 在 65B 模型上省下約 16 倍 VRAM。"
description: "Stanford CME295 Lecture 4 導讀：預訓練的目標、資料規模與 scaling law、訓練時記憶體卡在哪、資料平行與 ZeRO、FlashAttention 與混合精度的地圖、SFT 與 instruction tuning 的資料和評估難題、LoRA 的低秩分解與套用位置、QLoRA 的 NF4 量化，以及 2026 版怎麼把這講拆開重組。"
draft: false
glossary:
  - term: "Chinchilla law"
    aliases: ["Chinchilla scaling law", "compute-optimal"]
    definition: "在固定運算預算下，模型參數量和訓練 token 數應該一起放大；依論文表格，每個參數大約要配 20 個訓練 token。"
    context: "本講用它說明 GPT-3 這類早期模型「參數太多、資料太少」。"
    links:
      - label: "Hoffmann et al., 2022"
        url: "https://arxiv.org/abs/2203.15556"
  - term: "ZeRO"
    aliases: ["Zero Redundancy Optimization"]
    definition: "資料平行訓練時，把原本每張 GPU 各存一份的優化器狀態、梯度、參數切開分給不同 GPU，省下重複的記憶體。"
    context: "ZeRO-1、2、3 分別多切一種東西，期中考第 IV.7 題考這個。"
  - term: "mixed precision training"
    aliases: ["混合精度訓練"]
    definition: "前向與反向傳播用 FP16 或 BF16 等低精度計算，權重更新時保留一份高精度副本，兼顧速度與數值穩定。"
    context: "本講把它列為加速訓練、降低記憶體用量的手段之一。"
  - term: "instruction tuning"
    aliases: ["指令微調"]
    definition: "SFT 的一種特例：用「指令＋理想回答」的配對資料繼續訓練，讓預訓練模型學會照指示回答。"
    context: "本講用它把只會接話的預訓練模型「畢業」成助理。"
  - term: "QLoRA"
    aliases: ["NF4"]
    definition: "把凍結的基礎權重量化成 4-bit NormalFloat（NF4）存放，只用較高精度訓練小小的 LoRA 矩陣，計算時再還原精度。"
    context: "本講的最後一段，讓單張較小的 GPU 也能微調大模型。"
---

> 🌏 [English version](/posts/ai/2026-09-29-cme295-llm-training-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

本篇對應 Stanford [CME295](/posts/ai/2026-09-29-stanford-cme295-transformers-llms) 2025 版第 4 講「LLM training」（2025 年 10 月 17 日）。主要來源是 [128 頁投影片](https://cme295.stanford.edu/slides/fall25-cme295-lecture4.pdf)，[錄影](https://www.youtube.com/watch?v=VlA_jt_3Qc4)可以對照著看；本文內容只根據投影片上的文字與圖表，沒有轉述課堂口頭說明。

前三講回答的是「LLM 長什麼樣子」。第 4 講換一個問題：這樣一台機器，要怎麼從一堆隨機權重變成會回答問題的助理？投影片的答案分兩段。先**預訓練**，讓模型學會語言和程式碼的模式；再**微調**，讓它學會照指示做事。兩段的成本差了好幾個數量級，這一講大半篇幅在講錢和記憶體花在哪、怎麼省。

## 課程影片來源

下列影片取自 Stanford Online 的 CME295 Autumn 2025 官方播放清單；2026-10-10 已即時對照播放清單的講次標題與影片 ID，兩者相符。

```youtube
url: https://www.youtube.com/watch?v=VlA_jt_3Qc4
title: Stanford CME295 Transformers & LLMs | Autumn 2025 | Lecture 4 - LLM Training
```

原始影片：[Stanford CME295 Transformers & LLMs | Autumn 2025 | Lecture 4 - LLM Training](https://www.youtube.com/watch?v=VlA_jt_3Qc4)

內容核對：已依字幕核對（2026-10-10）：抽樣讀取字幕的前／中／後段並以關鍵字搜尋，另對照頁面描述的章節表（非逐字比對）。確認影片是 Autumn 2025 第 4 講 LLM Training（頁面日期 2025-10-17，長 1:47:27）；章節是預訓練、FLOPs、scaling laws／Chinchilla、ZeRO、模型平行、Flash Attention、量化、混合精度、SFT、instruction tuning、LoRA、QLoRA，與本文主題一致。本文只引投影片，沒有轉述課堂口述。

課程與錄影入口：

- [官方課程／講次來源](https://cme295.stanford.edu/syllabus/2025/)
- [CME295 Autumn 2025 播放清單（Stanford Online，9 支）](https://www.youtube.com/playlist?list=PLoROMvodv4rOCXd21gf0CF4xr35yINeOy)

查核日期：2026-10-10。

## 先看一個反例：預訓練完的模型只會接話

投影片用一個問題開場：「Can I put my teddy bear in the washer?」（泰迪熊可以丟洗衣機嗎？）

只做完預訓練的模型會回：「Teddy bears are often made of materials like polyester and cotton, with plastic eyes and sometimes small accessories.」它沒有答錯什麼，只是在續寫一段像網頁會出現的文字，完全沒回答問題。

做過 instruction tuning 的模型則回：「No, it might get damaged. Try hand washing instead.」

這兩個回答的差別，就是這一講的兩個階段。

```mermaid
flowchart LR
  I["隨機初始化的模型"] -->|"預訓練<br/>上兆 token・下一個 token 預測<br/>成本：至少數百萬美元"| P["預訓練模型<br/>懂語言與程式碼，但只會接話"]
  P -->|"SFT / instruction tuning<br/>數千到數百萬筆示範"| S["助理模型<br/>會照指示回答"]
  P -.->|"LoRA / QLoRA<br/>只訓練一小部分參數"| S
  S -->|"偏好微調（第 5 講）"| A["比較不會亂來的模型"]
```

這個兩段式本身就是典範轉移。投影片對比了三種做法。傳統機器學習每個任務從頭訓練一個模型，垃圾郵件偵測、情緒分析、翻譯各一個。遷移學習重用訓練好的模型的一部分。LLM 則是先訓練一個懂語言的模型，再針對最終用途調整它。

## 第一階段：預訓練

### 目標和資料

預訓練的目標很單純：**預測下一個 token**。給模型「[BOS] A teddy bear is」，要它猜下一個字。

要學的是「語言與程式碼的模式」，所以資料混合了網頁爬下來的文字（投影片舉 [Common Crawl](https://commoncrawl.org/)、Wikipedia）和程式碼（GitHub、Stack Overflow），也包含多種語言。規模是**兆級 token**：

| 模型 | 預訓練 token 數 |
|---|---|
| [GPT-3](https://arxiv.org/abs/2005.14165)（2020） | 3,000 億 |
| [Llama 3](https://arxiv.org/abs/2407.21783)（2024） | 15 兆 |

### 用 FLOPs 算規模

投影片特別分開兩個常被混用的詞：**FLOPs** 是運算總量（做了多少次浮點運算），**FLOPS** 或 FLOP/s 是每秒能做幾次。前者是訓練的帳單，後者是硬體的速度。量級上，小型神經網路的訓練約 10⁷ FLOPs，大型 RNN 約 10¹⁴，LLM 約 10²⁵；硬體端，手機約 10¹² FLOPS，一般電腦約 10¹⁴，超級電腦約 10¹⁸。

### Scaling law：大模型比較省資料

投影片從 [Kaplan 等人的 scaling law 論文](https://arxiv.org/abs/2001.08361)拿了兩個結論：

- **Scaling**：測試 loss 隨運算量、資料量、參數量三者各自呈冪次下降，在對數座標上是直線
- **Sample efficiency**：大模型用同樣多的 token 能把 loss 壓得更低，也就是說大模型學得比較快

接著是 [Chinchilla law](https://arxiv.org/abs/2203.15556)。投影片貼了論文裡的表，列出不同參數量對應的「compute-optimal」訓練 token 數：

| 參數量 | 最佳訓練 token 數 |
|---|---|
| 10 億 | 202 億 |
| 670 億 | 1.5 兆 |
| 1,750 億 | 3.7 兆 |

從表格可以讀出大約每個參數配 20 個 token。拿來對照上面那張表：GPT-3 有 1,750 億參數，只訓練了 3,000 億 token，還不到 Chinchilla 建議量的十分之一。之後的模型就開始往「資料多、模型別太大」的方向調。scaling law 的推導和怎麼用小實驗外推，[CS336 Lecture 9](/posts/ai/2026-08-22-cs336-scaling-laws-foundations) 講得比較完整。

### 預訓練的代價

投影片把挑戰分成兩類：

- **成本**：至少數百萬美元、耗時、耗電
- **學到的知識**：有「knowledge cutoff」，投影片附了 OpenAI 模型頁面上的截止日期截圖。學到的知識很難修改。還有投影片加了引號的「plagiarism」，也就是模型可能照搬訓練資料

## 預訓練的帳單：記憶體先爆

預訓練為什麼這麼貴？投影片從一次訓練步驟要存哪些東西開始算：

| 階段 | 要存什麼 | 大小取決於 |
|---|---|---|
| 初始化 | 模型參數 | 數十億到數千億個 |
| 前向傳播 | activations（計算 loss 要用） | 模型大小、batch size、context 長度 |
| 反向傳播 | 梯度 | 跟參數一樣多 |
| 權重更新 | 優化器狀態 | Adam 每個參數多存兩個值 |

<details>
<summary>公式：Adam 為什麼吃記憶體</summary>

```
θ_{t+1} ← θ_t − α · m_t / (√v_t + ε)

m_{t+1} ← β₁ m_t + (1 − β₁) ∇L(θ_t)        # 梯度的移動平均
v_{t+1} ← β₂ v_t + (1 − β₂) (∇L(θ_t))²     # 梯度平方的移動平均
```

m 和 v 都跟參數一樣大，所以光是優化器狀態，就是參數量的兩倍。投影片建議延伸閱讀 [Adam](https://arxiv.org/abs/1412.6980) 與 [AdamW](https://arxiv.org/abs/1711.05101) 原論文。

</details>

問題在於一張 GPU 的記憶體只有幾十 GB。投影片拿 [NVIDIA H100](https://www.nvidia.com/en-us/data-center/h100/) 的規格表當例子，框出 GPU memory 那一列（80GB 與 94GB 兩個版本）。一個千億參數的模型光是參數就放不下，更別說梯度和優化器狀態。

## 省記憶體與加速：一張地圖

這一講接下來用大約一半的投影片講訓練最佳化。這些主題在 2026 版被抽出去，自成一講「LLM systems」（本系列 [order 10](/posts/ai/2026-09-29-cme295-llm-systems)），站上也已經有 CS336 的深入篇，所以這裡只給地圖，每一格說清楚它在解什麼：

| 手法 | 在解什麼 | 投影片的重點 | 深入閱讀 |
|---|---|---|---|
| 資料平行 | 資料太多，一張卡跑太慢 | batch 切給多張 GPU，每張都放完整模型 | [CS336 Lecture 7](/posts/ai/2026-08-22-cs336-parallelism-mechanics) |
| [ZeRO](https://arxiv.org/abs/1910.02054) | 資料平行時每張卡都存一樣的東西，很浪費 | ZeRO-1 切優化器狀態；ZeRO-2 再切梯度；ZeRO-3 連參數也切 | [CS336 Lecture 8](/posts/ai/2026-08-22-cs336-parallelism-strategies) |
| 模型平行 | 模型本身一張卡放不下 | 把計算拆到多張卡：張量（TP）、管線（PP）、序列（SP）、context（CP）、expert（EP）平行 | 投影片推薦 Hugging Face 的 [Ultra-Scale Playbook](https://huggingface.co/spaces/nanotron/ultrascale-playbook) |
| [FlashAttention](https://arxiv.org/abs/2205.14135) | attention 一直在慢速的 HBM 和快速的 SRAM 之間搬資料 | 用 tiling 把區塊留在 SRAM 裡算完再寫回；反向傳播時寧可重算也不存大矩陣；結果完全精確，不是近似 | [CS336 Lecture 5](/posts/ai/2026-08-22-cs336-gpu-tpu) |
| [混合精度訓練](https://arxiv.org/abs/1710.03740) | FP32 又慢又佔空間 | 前向的 activations、反向的梯度用低精度；權重更新保留高精度 | [CS336 Lecture 2](/posts/ai/2026-08-22-cs336-resource-accounting) |

FlashAttention 那格值得多看一眼，因為它違反直覺。投影片引用原論文的一組數據：FlashAttention 的運算量反而比較多（75.2 對 66.6 GFLOPs），但 HBM 讀寫從 40.3 GB 降到 4.4 GB，執行時間從 41.7 ms 降到 7.3 ms。GPU 上的瓶頸常常是搬資料，不是算。投影片的原話是「More FLOPs, but less runtime!!」

混合精度那格需要知道浮點數怎麼切。投影片列了各格式的位元分配：

| 格式 | exponent 位元 | mantissa 位元 |
|---|---|---|
| FP32 | 8 | 23 |
| FP16 | 5 | 10 |
| BF16 | 8 | 7 |

BF16 保留了跟 FP32 一樣的 exponent 範圍，犧牲的是精度。投影片的結論是精度越低，GPU 算得越快。

推論端的最佳化（KV cache、speculative decoding 等）在前幾講已經提過，也不在本講範圍，想看可以讀 [CS336 Lecture 10](/posts/ai/2026-08-22-cs336-inference)。

## 第二階段：SFT，讓模型「畢業」成助理

### 做法

SFT（Supervised FineTuning）的想法是調整權重來改變模型行為：

1. 收集「輸入／理想輸出」配對，也就是 SFT 資料
2. 用同樣的「預測下一個 token」目標訓練，差別在於**以輸入為條件**，只學怎麼產生輸出

當資料是「指令＋回答」時，這就叫 **instruction tuning**，投影片引用 [FLAN 論文](https://arxiv.org/abs/2109.01652)。範例包括寫泰迪熊讀詩的短篇故事、列出下雨天泰迪熊能做的三件事、寫首詩、解釋為什麼泰迪熊是好朋友。

### 資料

資料可以是人寫的，也可以是合成的，投影片列出四類：助理對話、合成指令、數學／推理／程式碼、安全對齊。規模是數千到數百萬筆：

| 模型 | SFT 資料筆數（投影片表格） |
|---|---|
| GPT-3 系列 | 1.3 萬 |
| Llama 3 | 1,000 萬 |

跟預訓練的兆級 token 比，SFT 小了好幾個數量級，這是它能讓更多團隊負擔得起的原因。

### 難處

投影片列了五個挑戰：需要**非常高品質**的資料、對 prompt 分布很敏感、泛化能力、**很難評估**，以及計算成本仍然不低。

評估那一項投影片展開講了兩條路：

- **Benchmark**：一般知識看 MMLU、基礎推理看 ARC-Challenge、數學看 GSM8K、程式看 HumanEval。投影片提醒，要跨模型比較，建議先在測試任務上訓練過再比，引用 [Dominguez-Olmedo 等人](https://arxiv.org/abs/2407.07890)的研究：有沒有針對測試任務訓練過，會混淆評估結果
- **真實體感**：像 Chatbot Arena（現在叫 [LMArena](https://lmarena.ai/leaderboard)）讓使用者對兩個匿名模型的回答做 A/B 投票。好處是替「vibes」打了個分數；問題包括新模型曝光不均的冷啟動、容易被操縱、使用者無法判斷事實正確性、個人偏好不具代表性、安全拒答會被扣分

投影片的結語是：「evaluation is a hard problem in itself!」本系列 [order 8](/posts/ai/2026-09-29-cme295-llm-evaluation) 會專門談這件事。

SFT 之後還有一步。投影片最後的生命週期圖是：初始化 → 預訓練 → SFT → **偏好微調**，後者讓模型「比較不會亂來」，合起來叫 alignment。那是[第 5 講](/posts/ai/2026-09-29-cme295-preference-tuning)的主題。

## LoRA：沒有大 GPU 也能微調

### 直覺

SFT 要更新整個模型的權重，投影片直說：「not everyone has big GPUs」。[LoRA](https://arxiv.org/abs/2106.09685)（Low-Rank Adaptation）的做法是凍結原本的權重矩陣 W₀，只訓練一個「修正量」，而且這個修正量用兩個又細又長的小矩陣相乘來表示。

投影片提到三個好處：

- 只訓練一小部分參數，效果跟全量微調相近
- **換矩陣就是換任務**：同一個 W₀，掛上垃圾郵件偵測的 B、A 就做垃圾郵件，換成情緒分析的 B、A 就做情緒分析，不用存好幾份完整模型
- 同類方法還有 prefix tuning 和 adapters

<details>
<summary>公式：低秩分解省了多少</summary>

```
W = W₀ + B · A

W₀ : d × k，凍結不動
B  : d × r，要訓練
A  : r × k，要訓練
r  ≪ min(d, k)
```

算術舉例（不是投影片上的數字）：一個 4096 × 4096 的矩陣有約 1,677 萬個參數。r = 8 時，B 和 A 加起來只有 4096×8 + 8×4096 = 65,536 個，約 0.4%。

</details>

### 要套在哪一層

這是投影片裡比較新的內容。原始 LoRA 論文只在 attention 的權重矩陣上實驗；投影片引用 Thinking Machines 在 2025 年發表的 [LoRA Without Regret](https://thinkingmachines.ai/blog/lora/)，指出現在的建議是 attention 和前饋層（FFN）都套，而**前饋層是最重要的位置**。

同一篇也列了兩個訓練時的差異，投影片標註為經驗觀察：

- LoRA 需要比全量微調**更高的 learning rate**
- LoRA 在**大 batch size** 下表現比全量微調差（原文說是「某些情境下」，而且提高 rank 也補不回來）

LoRA Without Regret 的細節站上有另一篇整理：[CS224N 第 18 講材料紀錄](/posts/ai/2026-08-22-cs224n-tinker-lora)。

### QLoRA：再把凍結的權重壓小

LoRA 省了梯度和優化器狀態，但凍結的 W₀ 還是得整份放在記憶體裡。[QLoRA](https://arxiv.org/abs/2305.14314) 的想法是把凍結權重**量化**成低位元存放：

- **存放**：凍結權重用 4-bit；LoRA 的 B、A 用全精度
- **計算**：用到時還原成較高精度再算
- **NF4**：一般的 INT8 量化把數值範圍均分；NF4（4-bit NormalFloat）依常態分布的分位數切，因為神經網路權重大致呈常態分布，這樣切比較不浪費
- **Double quantization**：量化需要存「量化常數」，QLoRA 把這些常數再量化一次

投影片引用論文在 LLaMA 65B 上的結果：微調時 VRAM 省下約 16 倍，double quantization 再多省約 6%。

## 連回你用的模型

你今天在聊天介面裡用的模型，幾乎都走過這張圖的每一步：預訓練、SFT，再加上偏好微調。模型說它的知識截止在某個日期，那是預訓練資料的邊界；它願意照你的格式回答，是 SFT 的功勞。

如果你自己在做微調，這一講的實用結論有三個：

1. **先想清楚要改的是行為還是知識。** SFT 擅長改行為（格式、語氣、照指示），投影片把「很難修改學到的知識」列為預訓練的挑戰之一。
2. **LoRA 的預設值可以更新了。** 如果你的設定檔只在 attention 上掛 LoRA，照 LoRA Without Regret 的建議把 FFN 也加上，並把 learning rate 調高重新掃一次。
3. **評估比訓練難。** 在 benchmark 上贏不代表真實使用體驗好，Arena 分數也有它的偏誤，兩種都看。

## 2026 版改了什麼

2026 版的投影片除了第 1 講以外都還沒釋出，以下只根據 [2026 課表](https://cme295.stanford.edu/syllabus/)的主題清單比對：

- **訓練一講擴大成完整的後訓練流水線**：2026 第 3 講「LLM training」（10 月 9 日）列出 pretraining、SFT、LoRA，接著把 2025 年放在第 5、6 講的偏好微調（RLHF、DPO）和 reasoning 也收進來，再新增 on-policy distillation 與「distillation to smaller models」兩項。
- **系統最佳化獨立成一講**：2026 第 5 講「LLM systems」（10 月 30 日）列出 distributed training、inference optimizations、KV caching、speculative decoding、efficient kernels、Flash Attention、hardware trade-offs。本講的資料平行、ZeRO、FlashAttention 大概會移到那裡，見本系列 [order 10](/posts/ai/2026-09-29-cme295-llm-systems)。
- **量化沒有出現在 2026 課表上**：兩講的主題清單都沒有列出 quantization、mixed precision 或 QLoRA。它們可能被收進「hardware trade-offs」或 LoRA 段落裡，要等投影片釋出才能確認。

## 自我檢測

以下題目改寫自 [2025 期中考](https://cme295.stanford.edu/exams/fall25-cme295-midterm.pdf)第 IV 大題「LLM training」，答案在[解答 PDF](https://cme295.stanford.edu/exams/fall25-cme295-midterm-solutions.pdf)：

1. SFT 最貼切的描述是什麼？它跟訓練 reward model、跑 PPO 差在哪？（第 3 題）
2. 混合精度訓練實務上哪些東西用低精度、哪些保留高精度？（第 5 題）
3. FlashAttention 主要在最佳化什麼？它是精確計算還是近似？（第 6 題）
4. ZeRO 的哪個版本把優化器狀態、梯度、參數三者都切分到不同裝置？（第 7 題）
5. QLoRA 的凍結權重用什麼格式存？LoRA 矩陣和矩陣乘法又用什麼精度？（第 8 題）
6. 跟預訓練模型相比，instruction tuning 想達成什麼？列出課堂提到的兩個實務挑戰。（第 9 題）

## 想深入

- 預訓練的另一種講法：[CS224N 第 7 講：預訓練、subword 與 in-context learning](/posts/ai/2026-08-22-cs224n-pretraining)
- LoRA 與其他參數高效微調：[CS224N 第 9 講：Prompting、LoRA 與參數高效微調](/posts/ai/2026-08-22-cs224n-efficient-adaptation)
- 自己算 FLOPs 與記憶體：[CS336 Lecture 2](/posts/ai/2026-08-22-cs336-resource-accounting)
- GPU 為什麼卡在搬資料：[CS336 Lecture 5](/posts/ai/2026-08-22-cs336-gpu-tpu)
- ZeRO、FSDP 與 3D 平行：[CS336 Lecture 8](/posts/ai/2026-08-22-cs336-parallelism-strategies)
- SFT 之後的 RLHF：[CS336 Lecture 15](/posts/ai/2026-08-22-cs336-sft-rlhf)，以及本系列[第 5 講](/posts/ai/2026-09-29-cme295-preference-tuning)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。即時對照 Stanford Online 的 CME295 Autumn 2025 播放清單，講次與影片 ID 相符，狀態改為已附影片。
- 2026-10-10：依字幕核對影片內容。影片是 2025 第 4 講，主題與日期皆與本文相符，沒有需修正之處。

## 參考資料

- [CME 295 2025 版課表](https://cme295.stanford.edu/syllabus/2025/)
- [CME 295 2026 版課表](https://cme295.stanford.edu/syllabus/)
- [2025 版第 4 講投影片（PDF）](https://cme295.stanford.edu/slides/fall25-cme295-lecture4.pdf)
- [2025 版第 4 講錄影](https://www.youtube.com/watch?v=VlA_jt_3Qc4)
- [2025 期中考](https://cme295.stanford.edu/exams/fall25-cme295-midterm.pdf)／[解答](https://cme295.stanford.edu/exams/fall25-cme295-midterm-solutions.pdf)
- [Brown et al., Language Models are Few-Shot Learners (2020)](https://arxiv.org/abs/2005.14165)
- [Llama Team, The Llama 3 Herd of Models (2024)](https://arxiv.org/abs/2407.21783)
- [Kaplan et al., Scaling Laws for Neural Language Models (2020)](https://arxiv.org/abs/2001.08361)
- [Hoffmann et al., Training Compute-Optimal Large Language Models (2022)](https://arxiv.org/abs/2203.15556)
- [Kingma & Ba, Adam (2014)](https://arxiv.org/abs/1412.6980)
- [Loshchilov & Hutter, Decoupled Weight Decay Regularization (2017)](https://arxiv.org/abs/1711.05101)
- [NVIDIA H100 Tensor Core GPU](https://www.nvidia.com/en-us/data-center/h100/)
- [Rajbhandari et al., ZeRO (2019)](https://arxiv.org/abs/1910.02054)
- [Hugging Face, The Ultra-Scale Playbook (2025)](https://huggingface.co/spaces/nanotron/ultrascale-playbook)
- [Dao et al., FlashAttention (2022)](https://arxiv.org/abs/2205.14135)
- [Micikevicius et al., Mixed Precision Training (2017)](https://arxiv.org/abs/1710.03740)
- [Wei et al., Finetuned Language Models Are Zero-Shot Learners (2021)](https://arxiv.org/abs/2109.01652)
- [Dominguez-Olmedo et al., Training on the Test Task Confounds Evaluation and Emergence (2024)](https://arxiv.org/abs/2407.07890)
- [LMArena Leaderboard](https://lmarena.ai/leaderboard)
- [Hu et al., LoRA: Low-Rank Adaptation of Large Language Models (2021)](https://arxiv.org/abs/2106.09685)
- [Schulman et al., LoRA Without Regret (Thinking Machines, 2025)](https://thinkingmachines.ai/blog/lora/)
- [Dettmers et al., QLoRA: Efficient Finetuning of Quantized LLMs (2023)](https://arxiv.org/abs/2305.14314)
- [Stanford CME295 導讀（本系列總覽）](/posts/ai/2026-09-29-stanford-cme295-transformers-llms)
