---
title: "CMU 11-868 HW3：用自己寫的 MiniTorch 做一個 GPT-2，拿去翻德文"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, cmu, ai-course, transformer, cuda, gpu]
lang: zh-TW
series:
  name: "CMU 11-868 LLM Systems 導讀"
  order: 8
tldr: "HW3 要你在 HW1、HW2 做出來的 MiniTorch 上補齊 softmax loss、Dropout、LayerNorm、Embedding，再組出 pre-LN 的 GPT-2 decoder，最後在 IWSLT14 德英翻譯上訓練。配分是 tensor functions 20、basic modules 20、decoder LM 40、翻譯管線 20；滿分條件是通過私有測試且 BLEU 約 20±2。作業頁警告光訓練就要至少 10 小時，PSC 的 V100 一個 epoch 約一小時，要跑 10 個 epoch。2026 春季版 2/4 發、2/18 截止。"
description: "CMU 11-868 LLM Systems（2026 春季版）Assignment 3 導讀：作業要做什麼、四個 Problem 的配分與檔案位置、依賴 HW1 CUDA kernel 與 HW2 autodiff 的地方、硬體與訓練時間、校外自學會卡在哪，以及 llmsys_hw3 repo 已被 Fall 2026 修改的版本注意事項。不提供解答。"
draft: false
glossary:
  - term: "MiniTorch"
    definition: "源自 Sasha Rush 的教學用深度學習框架；CMU 11-868 在上面加了真正的 CUDA kernel，學生在七份作業中逐步補齊張量運算、自動微分、Transformer 與加速 kernel。"
    context: "CMU 11-868 作業共用的框架。"
  - term: "Pre-LN"
    definition: "把 LayerNorm 放在注意力與 FFN 子層之前、殘差相加之前的 Transformer 層寫法；原始 Transformer 是放在殘差相加之後（Post-LN）。GPT-2 與 LLaMA 都用 pre-LN。"
    context: "HW3 Problem 3 指定 TransformerLayer 要用 pre-LN。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu11868-hw3-transformer-architecture-en)

> **版本說明**：本文依據 [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/) 2026 春季版的時程，作業內容依 [Assignment 3 作業頁](https://llmsystem.github.io/llmsystemhomework/assignment_3/)與 [llmsys_hw3 repo](https://github.com/llmsystem/llmsys_hw3) 在 **2026-09-30 所見**。作業站跨學期共用，**llmsys_hw3 已有 Fall 2026 的修改**（見文末「版本注意」）。存取等級 **A3**：題目、起始碼、本機測試都公開；私有測試與 Canvas 繳交不公開，也沒有公開錄影。本文不提供解答或參考實作。

**系列位置**：上一篇 [L08–L09：Tokenization、解碼與 speculative decoding](/posts/ai/2026-09-30-cmu11868-tokenization-decoding)｜下一篇 [L10：在 GPU 上加速 Transformer（LightSeq）](/posts/ai/2026-09-30-cmu11868-accelerating-transformer-lightseq)｜[系列總覽](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)

前兩份作業做的是地基：[HW1](/posts/ai/2026-09-30-cmu11868-hw1-cuda-programming) 寫 map、zip、reduce、matmul 的 CUDA kernel，[HW2](/posts/ai/2026-09-30-cmu11868-hw2-minitorch-framework) 寫自動微分和一個情感分類器。HW3 第一次把它們組成一個真正的語言模型。

作業頁的開場白只有兩句：在 MiniTorch 上實作 decoder-only 的 GPT-2 架構，拿 IWSLT14 德英翻譯訓練並量測效能。第二句是警告：**Problem 4 的訓練至少要花 10 小時**。

## 時程與依賴

依 [2026 春季 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)：

| 日期 | 事件 |
|---|---|
| 2/2 | L06 Transformer |
| 2/4 | L07 Pre-trained LLMs；HW2 截止、**HW3 發下** |
| 2/6 | Recitation 3：The Annotated Transformer |
| 2/9、2/11 | L08 Tokenization、L09 Decoding |
| 2/16 | L10 Accelerating Transformer on GPU Part 1 |
| 2/18 | L10 Part 2；**HW3 截止** |

觀念上要讀過 [L06–L07](/posts/ai/2026-09-30-cmu11868-transformer-pretrained-llms)，Problem 4 的 `generate` 則跟 [L09](/posts/ai/2026-09-30-cmu11868-tokenization-decoding) 的 greedy decoding 有關。

程式上，HW3 直接吃你前兩份作業的成果。作業頁的 setup 要你：

- 把 `llmsys_hw2/minitorch/autodiff.py` 複製過來，`run_sentiment.py` 改名成 `project/run_sentiment_linear.py`
- 從 `llmsys_hw1/src/combine.cu` 只抽出 `MatrixMultiplyKernel`、`mapKernel`、`zipKernel`、`reduceKernel` 四個函式的實作，貼進新的 `src/combine.cu`
- 跑 `bash compile_cuda.sh` 編譯 kernel

作業頁說明了為什麼只抽函式：HW3 的 `combine.cu` 和 `cuda_kernel_ops.py` 改過，GPU 記憶體的配置、釋放與 host/device 複製都搬進了 `combine.cu`；張量底層儲存也從 `numpy.float64` 改成 `numpy.float32`。

換句話說，**HW1 或 HW2 有 bug，會在 HW3 以奇怪的方式爆出來**。作業頁 FAQ 的 Q3 就是一例：forward 測試過了、gradient 斷言卻失敗，官方指向 `autodiff.py` 的 `backpropagate`。

## 四個 Problem

| Problem | 內容 | 要改的檔案 | 配分 |
|---|---|---|---|
| 1 | Tensor functions：`logsumexp`、`softmax_loss` | `minitorch/nn.py` | 20 |
| 2 | Basic modules：`Linear`、`Dropout`、`LayerNorm1d`、`Embedding` | `minitorch/modules_basic.py` | 20 |
| 3 | Decoder-only Transformer LM：`MultiHeadAttention`、`TransformerLayer`、`DecoderLM` | `minitorch/transformer.py` | 40 |
| 4 | 機器翻譯管線：`generate` | `project/run_machine_translation.py` | 20 |

每個 Problem 的程式碼區塊都用 `BEGIN ASSIGN3_x` / `END ASSIGN3_x` 標出來，並附對應的 pytest 指令（例如 `python -m pytest -l -v -k "test_softmax_loss_student"`）。

### Problem 1：softmax loss

作業頁給了公式 ℓ(z, y) = log Σ exp(z_i) − z_y，要你用 `logsumexp`、`one_hot` 等既有運算組出來。輸入是 (minibatch, C) 的 logits 和 (minibatch,) 的標籤，輸出形狀是 (minibatch,)，不做 reduction。

### Problem 2：四個基本模組

- `Linear`：沿用 HW2，但要配合新的 `backend` 參數
- `Dropout`：`self.training` 為 false 時不能動任何值；為了跟 autograder 的亂數種子對齊，作業頁指定用 `np.random.binomial` 產生 mask
- `LayerNorm1d`：對 2D 張量做 layer normalization
- `Embedding`：把 one-hot 詞向量映射成 embedding

### Problem 3：組出 GPT-2

這是配分最重的一題，作業頁寫得最詳細。架構依 [GPT-2 論文](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)，四個模組裡 `FeedForward` 已經寫好給你。

`MultiHeadAttention` 的關鍵是形狀。作業頁逐步寫出：輸入 X 是 B×S×D（批次、序列長度、隱藏維度），投影成 Q、K、V 後拆成 h 個頭，permute 成 B×h×S×D_h，K 還要把最後兩維轉置；算完 `softmax(QKᵀ/√D_h + M)V`（M 是 causal mask）之後，再 permute、reshape 回 B×S×D，過輸出投影。批次矩陣乘法已經幫你實作好。

這一段就是 [L06 第 12 頁](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-06-transformer-14bd7575a2f6c8bac60522354c11d691.pdf)那兩個形狀（len × dim、len × len）的完整版，只是多了批次和頭兩個維度。

`TransformerLayer` 指定用 **pre-LN**，作業頁附了 post-LN 與 pre-LN 的對照圖，並引用 [On Layer Normalization in the Transformer Architecture](https://arxiv.org/abs/2002.04745)。

`DecoderLM` 的流程是：取 token 與位置 embedding 相加、過 dropout、依序過所有 Transformer 層、最後一層 LayerNorm、線性層投影到詞表大小。

### Problem 4：翻譯管線

要實作的是 `generate`：對每筆來源句子用 **argmax 解碼**生成目標句，而且是**一筆一筆**跑，不做 batch。作業頁建議先讀檔案裡的 `collate_batch` 和 `loss_fn`，理解資料處理和 loss 計算。

跑 `python project/run_machine_translation.py` 之後，輸出和 BLEU 會存在 `./workdir_vocab10000_lr0.02_embd256`。作業頁給的參考值：

- 第 1 個 epoch BLEU 約 7，10 個 epoch 後約 20
- 在 PSC 的 V100 上，一個 epoch 約一小時
- 預設超參數不保證穩定（可能出現 nan），可以調學習率、詞表大小、embedding 維度、層數、頭數、dropout

## 評分與繳交

在 Canvas 交整個 `llmsys_hw3` 的 zip，內含完整程式碼、一個最佳結果的 workdir 目錄，以及訓練進度的截圖（或 sbatch 的 slurm log）。

評分分兩部分：私有的 MiniTorch 測試，加上 IWSLT 的評估結果。作業頁的滿分條件是**通過所有測試，且 BLEU 約 20 ± 2**。

## 校外自學會卡在哪

1. **要 NVIDIA GPU**。整份作業建立在你自己編譯的 CUDA kernel 上。作業頁的指令是 PSC 環境（`module load cuda/12.4.0`、Python 3.12+、用 `uv` 建虛擬環境），校外讀者要自己準備有 CUDA 的機器或雲端 GPU
2. **訓練時間**。依作業頁的 V100 參考值，10 個 epoch 就是十個小時左右；換成較慢的卡會更久。建議先用小的超參數確認 loss 會降，再開長訓練
3. **CUDA 與驅動版本**。作業頁 FAQ 的 Q1 是 nvcc 比驅動支援的 CUDA 新，導致 PyTorch `Aborted (core dumped)`，官方解法是把 CUDA 與 PyTorch 對齊到同一版本
4. **前兩份作業要先做對**。沒做 HW1、HW2 的話，HW3 缺 kernel 和 autodiff，無法單獨開始
5. **拿不到私有測試**。本機 pytest 只是公開的那一半；BLEU 20 ± 2 可以自己量，是校外最可靠的自我檢查

## 版本注意

作業站和 repo 跨學期共用。2026-09-30 查 [llmsys_hw3 的 commit 紀錄](https://github.com/llmsystem/llmsys_hw3/commits/main)：

- 2026 春季期間有多筆修正（2/4–2/6：Embedding docstring、`datasets` 版本、Adam 二階動量係數、transformer 模組檔名、view backward）
- Fall 2026 的修改：2026-08-28 有一筆「add unit test for machine translation; cleanup code comment inconsistency」，9/9 合併進 main

若要對齊春季版，2/18 截止前的最後一個 commit 是 `376bf97`（2026-02-06）。作業頁的題目與配分則以查核當天所見為準；Fall 2026 正在進行，之後可能再改。

## 延伸閱讀

- [The Annotated Transformer](https://nlp.seas.harvard.edu/annotated-transformer/)：Recitation 3 的教材，形狀與 mask 的寫法可以對照
- [CS336 系列總覽](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch)：CS336 的作業一也要你從零寫 Transformer LM，但用 PyTorch；11-868 的差別是底下的框架和 kernel 都是你自己寫的
- [CMU 11-785 Lecture 18：Attention 與 Transformer](/posts/ai/2026-08-22-cmu-11785-18-attention-transformers)

## 參考資料

- [11-868 Assignment 3: Transformer Architecture 作業頁](https://llmsystem.github.io/llmsystemhomework/assignment_3/)
- [llmsys_hw3 起始碼 repo](https://github.com/llmsystem/llmsys_hw3)
- [11-868 作業站總覽](https://llmsystem.github.io/llmsystemhomework/)
- [11-868 Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)
- [L06 Transformer 投影片（PDF）](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-06-transformer-14bd7575a2f6c8bac60522354c11d691.pdf)
- [Radford et al., Language Models are Unsupervised Multitask Learners（GPT-2，2019）](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)
- [Xiong et al., On Layer Normalization in the Transformer Architecture（2020）](https://arxiv.org/abs/2002.04745)
- [The Annotated Transformer（Harvard NLP）](https://nlp.seas.harvard.edu/annotated-transformer/)
