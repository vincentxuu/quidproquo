---
title: "CMU 11-868 L21 FlashAttention：attention 慢在搬資料，不在算——Tri Dao 從 FA1 講到 FA4"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, ai-course, cmu, flashattention, attention, gpu]
lang: zh-TW
series:
  name: "CMU 11-868 LLM Systems 導讀"
  order: 16
tldr: "標準 attention 會把 N×N 的分數矩陣寫回 HBM 再讀出來，時間大多花在搬資料。FlashAttention 用 tiling 加 softmax rescaling，讓每一塊都在 SRAM 裡算完，backward 則重算而不存。Tri Dao 在 11-868 的客座講義裡給了一組數字：backward 的 FLOPs 多了 13%，HBM 讀寫少了 9 倍，時間快了 6 倍。之後 FA3、FA4 的主題也一樣：硬體變了，瓶頸跟著搬家，演算法就得跟著改。"
description: "CMU 11-868 LLM Systems（2026 春季版）L21「Optimizing Attention for Modern Hardware」導讀，講者 Tri Dao：IO-aware 的觀點、tiling 與 online softmax 的推導、backward 的重算、FlashAttention-3 在 Hopper 上的非同步與 FP8、FlashAttention-4 面對 Blackwell 非對稱擴展的改法，以及 decode 階段的 Flash-Decoding 與 GQA packing。"
draft: false
glossary:
  - term: "IO-aware"
    aliases: ["IO-awareness"]
    definition: "設計演算法時把不同層級記憶體之間的讀寫次數當成主要成本，而不只計算 FLOPs。"
    context: "FlashAttention 論文認為過去的高效 attention 缺的就是這個原則。"
    links:
      - label: "FlashAttention（arXiv 2205.14135）"
        url: "https://arxiv.org/abs/2205.14135"
  - term: "online softmax"
    aliases: ["softmax rescaling", "線上 softmax"]
    definition: "分塊計算 softmax 時，只保留目前為止的最大值與指數和；看到新區塊就用比例因子修正先前的部分結果，最後得到與一次算完完全相同的答案。"
    context: "FlashAttention 能分塊計算而不改變結果，靠的就是這個技巧。"
  - term: "HBM"
    aliases: ["high bandwidth memory"]
    definition: "GPU 或 TPU 晶片外的主記憶體，容量大，但頻寬遠低於晶片上的 SRAM。"
    context: "FlashAttention 要減少的就是對 HBM 的讀寫。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu11868-flashattention-en)

**影片狀態：已查核：官方公開頁未列對應錄影。** [影片來源與說明](#課程影片來源)

**本文依據 [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/) 2026 春季版。** 這是 [CMU 11-868 LLM Systems 導讀](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)系列第 16 篇，接在 [L19–L20 模型量化](/posts/ai/2026-09-30-cmu11868-model-quantization)之後。

4/1 這一講是客座，講者是 FlashAttention 的作者 [Tri Dao](https://tridao.me)，[Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) 上的題目是「Optimizing Attention for Modern Hardware」。官方材料是一份 61 頁的[投影片](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-21-FlashAttention_tridao2026.4-50476379a6127697ae7fbf974ad28348.pdf)，reading 是四篇論文：[FlashAttention](https://arxiv.org/abs/2205.14135)、[FlashAttention-2](https://arxiv.org/abs/2307.08691)、[FlashAttention-3](https://arxiv.org/abs/2407.08608)、[FlashAttention-4](https://arxiv.org/abs/2603.05451)。存取等級 **A3**，但官方課表未列本課公開錄影連結，客座的口頭內容讀不到。以下只根據投影片與論文，頁碼以 PDF 檔為準。

這是系列裡比較硬的一篇。會先講場景與直覺，推導放在折疊區塊。沒讀過 GPU 記憶體階層的讀者，建議先看 [L02–L04 GPU 程式模型](/posts/ai/2026-09-30-cmu11868-gpu-programming-acceleration)與 [L10 LightSeq](/posts/ai/2026-09-30-cmu11868-accelerating-transformer-lightseq)。

整篇只回答一個問題：**為什麼 attention 的瓶頸是 IO，而不是 FLOPs？**

## 課程影片來源

已核對 Spring 2026 官方 Syllabus：各講公開列出 slides、reading 與 homework，未列對應講次的公開錄影連結。本文因此以投影片、論文或作業導讀，沒有對應講次播放器；這項結論只限官方公開頁面，不代表校內沒有錄影。

官方來源：

- [CMU 11-868 Spring 2026 官方課表與教材](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus/)

查核日期：2026-10-10。

## 場景：序列一長，訓練就慢下來

投影片第 2–3 頁先講動機：讀整本書、整個 codebase 需要長 context；影像解析度變高、音訊與影片天生是很長的序列。可是 context 一拉長，訓練就變慢甚至跑不動。

第 5 頁把 attention 寫成三步：S = QKᵀ、A = softmax(S)、O = AV。Q、K、V 是 N × d，中間的 S 與 A 是 N × N。投影片給的典型值是 N 在 1K–8K、head 維度 d 在 64–128。所以 N × N 的中間矩陣比輸入大得多，而且隨序列長度平方成長。

第 6 頁是當時的主流解法：approximate attention，用品質換速度、減少 FLOPs。Tri Dao 的問題是：有沒有一個又快、又省記憶體、而且**精確**的 attention？

## 直覺：最大的成本是搬位元

第 7 頁的答案只有一句：**The biggest cost is in moving the bits!** 標準實作要反覆從慢的 GPU 記憶體讀寫。

第 8 頁畫出 GPU 的運作：輸入放在 HBM（GPU 主記憶體），搬到運算單元與 SRAM 計算，結果再寫回 HBM。HBM 大而慢，SRAM 小而快。標準 attention 的每一步都是一個獨立 kernel：算完 S 寫回 HBM，下一個 kernel 讀 S 算 softmax、寫回 A，再下一個讀 A 乘 V。N × N 的矩陣來回搬了好幾趟。

所以問題不在算多少，而在**搬多少**。這就是 IO-aware：把各層記憶體之間的讀寫次數當成主要成本。

## 機制：tiling 加 recomputation

第 9 頁列出兩個難題與對應解法：

| 難題 | 解法 |
|---|---|
| softmax 要對整列做正規化，但分塊時看不到整列 | **Tiling**：一塊一塊從 HBM 載入 SRAM，搭配 softmax rescaling |
| backward 需要 forward 的 N × N attention 矩陣 | **Recomputation**：不存這個矩陣，backward 時在 SRAM 裡重算 |

### Tiling：分母錯了，事後修正

第 10–12 頁一步步推。把 Q 切塊很容易，每一塊 query 互不相干。難的是 K 與 V：softmax 的分母要加總整列的 exp(S)，切成兩塊 K 時，算完第一塊還不知道第二塊的值。

第 12 頁的解法是：先用第一塊的局部分母算出一個「分母錯了」的部分輸出；算第二塊時，把舊的輸出乘上「舊分母 / 新分母」修正，再加上第二塊的貢獻。每一步都在 SRAM 裡做，不寫回 HBM，最後得到的答案完全正確。

<details>
<summary>兩塊 K／V 時的 rescaling 推導（投影片第 12 頁）</summary>

把 K、V 各切成兩塊，S⁽ⁱ⁾ = Q(K⁽ⁱ⁾)ᵀ，A⁽ⁱ⁾ = exp(S⁽ⁱ⁾)。

想要的輸出是

O = (A⁽¹⁾V⁽¹⁾ + A⁽²⁾V⁽²⁾) / l，其中 l = Σ exp(S⁽¹⁾) + Σ exp(S⁽²⁾)（逐列加總）。

1. 只看第一塊：l⁽¹⁾ = Σ exp(S⁽¹⁾)，O⁽¹⁾ = A⁽¹⁾V⁽¹⁾ / l⁽¹⁾。分母少了第二塊。
2. 看到第二塊：l⁽²⁾ = l⁽¹⁾ + Σ exp(S⁽²⁾)，然後

   O⁽²⁾ = (l⁽¹⁾ / l⁽²⁾) · O⁽¹⁾ + A⁽²⁾V⁽²⁾ / l⁽²⁾

   第一項把舊輸出的分母從 l⁽¹⁾ 換成 l⁽²⁾，展開後正好等於 O。

實作上還會多追蹤一個逐列的 running max，指數先減掉最大值以免溢位；換最大值時，舊結果同樣乘上一個比例因子修正（FlashAttention 論文的 Algorithm 1）。

</details>

### Recomputation：多算一點，少搬很多

第 14 頁處理 backward。forward 只存每列的 softmax 正規化常數（長度 N），backward 時從 Q、K、V 在 SRAM 裡把 attention 重算一次。投影片附了一組對照：

| | 標準 attention | FlashAttention |
|---|---|---|
| GFLOPs | 66.6 | 75.2（多 13%） |
| HBM 讀寫（GB） | 40.3 | 4.4（少 9 倍） |
| 執行時間（ms） | 41.7 | 7.3（快 6 倍） |

FLOPs 變多，時間反而少很多。這張表就是聚焦問題的答案：attention 的時間主要花在 HBM 讀寫上。

第 15 頁的總結：2–4 倍加速、10–20 倍記憶體節省（記憶體隨序列長度線性成長），而且**沒有任何近似**。

## 硬體變了，瓶頸也跟著搬家

講義後半（第 16–56 頁）在回答：新硬體出來之後，attention 要怎麼重新設計。這段的主軸是：每一代 GPU 都讓某個單元變快，瓶頸就移到沒變快的那個單元。

### FlashAttention-2：在 A100 上逼近 matmul

投影片第 17 頁只用一行帶過：FA2 在 A100 上達到約 70% 的使用率，但在 H100 上只有 35–40%。FA2 本身的改動寫在論文摘要：減少非 matmul 的 FLOPs、單一 head 也沿序列方向跨 thread block 平行、在 thread block 內重新分配 warp 之間的工作以減少 shared memory 通訊，約比 FA1 快 2 倍。

### FlashAttention-3：Hopper 上的非同步與 FP8

第 18 頁列出 FA3 的三個方向，講義說在 Hopper 上加速 1.6–3 倍：

1. **新指令**：WGMMA（吞吐量更高、非同步的矩陣乘指令）與 TMA（加速 global memory 到 shared memory 的搬運，也省暫存器）。兩者都是非同步的：thread 發出指令後可以先做別的事（第 19 頁）。
2. **非同步重疊**：讓 softmax 與 matmul 同時進行。
3. **低精度 FP8**。

第 20 頁用數字說明為什麼要重疊。以 head 維度 128、block 128 × 128 為例：FP16 的 WGMMA 要 2048 個 cycle，softmax 裡的指數運算（MUFU.EX2，由 special function unit 執行）要 1024 個 cycle，是 matmul 的一半。**指數單元的吞吐量遠低於 Tensor Core**，如果兩者輪流做，Tensor Core 有三分之一的時間在等。投影片還補一句：換成 FP8 或 Blackwell，兩者都是 1024 個 cycle。

後面幾頁是一連串的優化，每一步都附上 TFLOPS：

| 頁 | 手法 | 效果 |
|---|---|---|
| 21 | Pingpong 排程：兩個 warpgroup 用 barrier 輪流，一個做 softmax 時另一個做 matmul | 580 → 640 TFLOPS |
| 22 | 同一 warpgroup 內，第 k 輪的 GEMM 與第 k+1 輪的 softmax 重疊 | 640 → 670 TFLOPS |
| 26 | Persistent kernel：CTA 數量固定為 SM 數，隱藏 prologue／epilogue | 670 → 700 TFLOPS |
| 27–46 | Causal attention 的負載平衡：最長的工作先排（LPT） | 670 → 730 TFLOPS（causal） |

LPT 那一段用一個小例子（2 個 batch、3 個 SM）演示：照順序排時三個 SM 的工作量是 [9, 5, 6]，最長的那塊總是最後才排到；改成最長的先排，變成 [7, 7, 6]。

FP8 的問題是 outlier 讓量化誤差變大。第 24 頁的解法是 incoherent processing：Q 與 K 同乘一個隨機正交矩陣（Hadamard），因為 (QJ)(KJ)ᵀ = QKᵀ，結果不變，outlier 卻被攤平。投影片說在模擬 outlier 的資料上，量化誤差降低 2.6 倍。這跟[上一篇](/posts/ai/2026-09-30-cmu11868-model-quantization) LLM.int8() 碰到的是同一個問題，只是解法不同。

第 47–49 頁的 benchmark：BF16 頁標題寫加速 1.8–2.2 倍（比較對象只在圖上，文字層沒有標明），最高 840 TFLOPS，causal attention 達 730–750 TFLOPS，投影片說已經接近 matmul 的速度；FP8 最高 1.3 PFLOPS。這些是 2026 年講義上的數字，比 FA3 論文摘要（2024）寫的 740 TFLOPS 更高。

### FlashAttention-4：Blackwell 的非對稱擴展

第 50 頁點出 Blackwell 的特性：矩陣乘單元變快了，但指數單元與 shared memory 的速度沒變。結果是 **forward 卡在指數運算，backward 卡在 shared memory 流量**。投影片註明 FA4 論文發表於 MLSys 2026。

對應的改法（第 51–52 頁）：

- Forward：query tile 之間的 pingpong pipeline；用多項式（Chebyshev）在軟體裡模擬指數函數，分擔指數單元的負擔；一種新的 online softmax 變體，跳過 90% 的 rescaling。
- Backward：用新的 2-CTA MMA 指令，讓兩個 CTA 合作以減少 shared memory 頻寬。

第 53–55 頁的結果：forward 最高約 1600 TFLOPS，投影片說新版 cuDNN 已經納入許多 FA4 的優化；backward 比沒有 Blackwell 優化的 FA2 基準快 4 倍。FA4 用 Python 內嵌的 CuTe-DSL 寫成，把它的抽象（block sparse、masking）拿去加速 FlexAttention，全面快了 2.7–3.0 倍。

## 推論時的 attention

第 57–60 頁轉向 decode。decode 時 query 只有幾個 token，context 卻可能長達 128k。

- **Flash-Decoding**（從 FA2 開始）：沿著 KV 的序列長度切分，讓 GPU 有足夠的工作量。
- **GQA packing**：WGMMA 的 tile 在 M 維度是 64 寬，query 很短時大半被浪費。MQA／GQA 裡多個 query head 共用一組 KV，可以把它們打包填滿 tile。FA2 只處理 query 長度為 1 的情形，FA3 推廣到任意 query 長度。

## 這一講要帶走什麼

第 61 頁的總結把 FlashAttention 定位成「為現代硬體最佳化的快速、精確 attention」，關鍵的演算法想法是非同步與低精度。放回這門課的脈絡，比較值得記的是方法論：

1. 先問時間花在哪一層記憶體，而不是 FLOPs 有多少。
2. 必要時多算一點（recomputation），換取少搬很多。
3. 每一代硬體都要重新找瓶頸：A100 是 HBM，Hopper 是指數單元與 Tensor Core 的落差，Blackwell 是指數單元與 shared memory。

**今天就能做的事**：打開 [flash-attention repo](https://github.com/Dao-AILab/flash-attention)，對照講義第 56 頁提到的 `flash_attn/cute/flash_fwd_sm100.py`，找出 online softmax rescaling 的那一段。

下一篇把同一個問題搬到 TPU：[L12–L13 TPU、JAX 與 Pallas](/posts/ai/2026-09-30-cmu11868-tpu-jax-pallas)。Splash Attention 就是 FlashAttention 的 tiling 思路在 TPU 上的實作。

## 延伸閱讀

- Stanford CS336 的 [GPU 篇](/posts/ai/2026-08-22-cs336-gpu-tpu)與 [Triton kernel 篇](/posts/ai/2026-08-22-cs336-kernels-triton)，也把 FlashAttention 當成 IO-aware 的範例。
- [CME295 LLM 系統篇](/posts/ai/2026-09-29-cme295-llm-systems)從服務端的角度介紹 FlashAttention 與 KV cache。

## 系列導覽

- 上一篇：[L19–L20 模型量化](/posts/ai/2026-09-30-cmu11868-model-quantization)
- 下一篇：[L12–L13 TPU、JAX 與 Pallas／Splash Attention](/posts/ai/2026-09-30-cmu11868-tpu-jax-pallas)
- 系列總覽：[CMU 11-868 LLM Systems 導讀](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [CMU 11-868 LLM Systems, Spring 2026 — Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)
- [L21 Optimizing Attention for Modern Hardware 投影片（Tri Dao, 2026-04-01）](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-21-FlashAttention_tridao2026.4-50476379a6127697ae7fbf974ad28348.pdf)
- [Dao et al., FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness（arXiv 2205.14135）](https://arxiv.org/abs/2205.14135)
- [Dao, FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning（arXiv 2307.08691）](https://arxiv.org/abs/2307.08691)
- [Shah et al., FlashAttention-3: Fast and Accurate Attention with Asynchrony and Low-precision（arXiv 2407.08608）](https://arxiv.org/abs/2407.08608)
- [Zadouri et al., FlashAttention-4: Algorithm and Kernel Pipelining Co-Design for Asymmetric Hardware Scaling（arXiv 2603.05451）](https://arxiv.org/abs/2603.05451)
- [Dao-AILab/flash-attention（GitHub）](https://github.com/Dao-AILab/flash-attention)
- [NVIDIA CUTLASS 範例 77_blackwell_fmha](https://github.com/NVIDIA/cutlass/tree/main/examples/77_blackwell_fmha)
