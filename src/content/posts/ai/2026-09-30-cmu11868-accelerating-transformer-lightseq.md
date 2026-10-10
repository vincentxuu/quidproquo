---
title: "CMU 11-868 L10：在 GPU 上加速 Transformer，LightSeq 把時間花在哪裡省下來"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, cmu, ai-course, llm, gpu, cuda, transformer]
lang: zh-TW
series:
  name: "CMU 11-868 LLM Systems 導讀"
  order: 9
tldr: "11-868 第 10 講用 Lei Li 團隊自己的 LightSeq／LightSeq2 當教材，拆出四招：把矩陣乘法以外的小運算融合成一個 kernel、改寫 LayerNorm 與 Softmax 的公式來減少 thread 同步、參數與梯度用 FP16 存但 FP32 算、依反向傳播的相依關係重用記憶體。投影片報告的 WMT14 英德翻譯訓練加速是 1.4–3.5 倍。沒有錄影，本文依投影片頁碼與兩篇論文整理。"
description: "CMU 11-868 LLM Systems（2026 春季版）第 10 講導讀：kernel launch 為什麼貴、LightSeq2 的 kernel fusion、LayerNorm 與 Softmax 的 reduction 改寫、混合精度更新與記憶體重用，以及推論端的 Hierarchical Auto Regressive Search。附投影片頁碼、論文數字與讀法。"
draft: false
glossary:
  - term: "kernel fusion"
    aliases: ["融合 kernel", "fused kernel", "kernel 融合"]
    definition: "把原本要分成好幾個 GPU kernel 依序執行的運算，寫成一個 kernel 一次做完，省下多次 kernel launch 與中間結果寫回、讀出顯示卡記憶體的時間。"
    context: "L10 第 10 頁用三個矩陣相加示範：分兩個 kernel 要 4 次讀、2 次寫，融合後只要 3 次讀、1 次寫。"
  - term: "LightSeq"
    aliases: ["LightSeq2"]
    definition: "ByteDance AI Lab 開發的 Transformer GPU 加速函式庫。LightSeq（NAACL 2021）專注推論，LightSeq2（SC22）把加速延伸到訓練。"
    context: "11-868 講師 Lei Li 是兩篇論文的作者之一，第 10 講整堂以它為教材。"
    links:
      - label: "bytedance/lightseq（GitHub）"
        url: "https://github.com/bytedance/lightseq"
  - term: "thread 同步"
    aliases: ["thread synchronization", "__syncthreads"]
    definition: "一個 CUDA block 裡的 thread 必須等所有人都算完某一步、才能進行下一步的等待點。做 reduction（例如加總、取最大值）時通常需要。"
    context: "L10 的第二招就是改寫公式，讓 LayerNorm 與 Softmax 少一次同步。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu11868-accelerating-transformer-lightseq-en)

> **版本說明**：本文依據 [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/) 2026 春季版。事實皆於 2026-09-30 打開[課程 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)、[L10 投影片 PDF](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-10-transformer-acc-5ba466406bf7296f86cd244ad0405867.pdf)（66 頁）與兩篇 reading 核對。存取等級 **A3**：講義、作業、起始碼全部公開，但**本課沒有公開錄影**，以下只根據投影片與論文，引用處標頁碼。

**系列位置**：上一篇 [HW3：在 MiniTorch 實作 decoder-only Transformer](/posts/ai/2026-09-30-cmu11868-hw3-transformer-architecture)｜下一篇 [HW4：Softmax 與 LayerNorm 的 CUDA 融合 kernel](/posts/ai/2026-09-30-cmu11868-hw4-transformer-cuda-acceleration)｜[系列總覽](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)

## 課程影片來源

本篇依官方講義、投影片或作業導讀；本次檢查官方公開頁面，尚未核實本文對應講次的公開錄影。這不表示課程沒有錄影。

課程與錄影入口：

- [cmu-11-868-llm-systems — official course materials and recording index](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)

## 這一講在回答什麼

到 HW3 為止，你已經用自己的 MiniTorch 框架拼出一個能訓練的 Transformer。它能跑，但慢。第 10 講問的是：**模型大小還塞得進一張 GPU 時，單卡訓練與推論能再快多少、從哪裡快？**

課程 Syllabus 把這個主題排在 2 月 16 日與 18 日兩堂（Part 1、Part 2），但兩堂共用同一份投影片，所以 PDF 編號 11 是缺號。兩堂各配一篇 reading：[LightSeq](https://arxiv.org/abs/2010.13887)（推論）與 [LightSeq2](https://arxiv.org/abs/2110.05722)（訓練）。這兩篇都出自 ByteDance AI Lab，11-868 講師 Lei Li 是作者之一，所以這一講等於作者親自拆解自己的系統。

投影片第 6 頁把範圍講得很清楚：這堂只處理「模型比 GPU 記憶體小」的情況，以 [LightSeq 函式庫](https://github.com/bytedance/lightseq)為底。模型大到一張卡放不下，是下一講[分散式訓練](/posts/ai/2026-09-30-cmu11868-data-parallel-training)的事。

## 直覺：GPU 不是慢在算，是慢在「開工」和「搬貨」

先看一個會讓人意外的數字。投影片第 9 頁標出，**一次 kernel launch 大約要 3–5 微秒，相當於 4,000 個時脈週期**。一個 Transformer 層裡，除了幾個大矩陣乘法，還有一堆小運算：加 bias、dropout、residual、LayerNorm、softmax。PyTorch 預設把每個小運算各發一個 kernel，每個 kernel 都要先把輸入從顯示卡記憶體讀出來、算完再寫回去。

第 10 頁用最簡單的例子說明代價：

- `E = A + B + D` 分兩步做（先 `C = A + B`，再 `E = C + D`）：兩個 kernel、**4 次讀、2 次寫**
- 寫成一個「三矩陣相加」kernel：一個 kernel、**3 次讀、1 次寫**

中間結果 `C` 根本不需要寫回記憶體。這就是整堂課第一招的核心：矩陣乘法交給 cuBLAS，**其他所有運算想辦法融合**。

## 機制：LightSeq2 的四招

投影片第 8 頁把 LightSeq／LightSeq2 的優化分成三類：計算圖改寫、相依 reduction 的改寫、記憶體管理。後面的章節按四個 Technique 展開。

### 第一招：kernel fusion，只留 GEMM 給 cuBLAS

第 12 頁畫出一整個 Transformer 層被重新切分後的樣子：Q／K／V 投影、FFN 的兩個線性層、輸出投影這些 GEMM 用 cuBLAS；夾在中間的「加 bias ＋ dropout ＋ residual」「加 bias ＋ ReLU ＋ dropout」「加 bias ＋ reshape Q、K、V」都各自融合成一個自訂的 elementwise kernel；LayerNorm、softmax、cross entropy 則是自訂的 reduce kernel。

投影片挑了幾個具體例子：

| 運算 | 融合前 | 融合後 | 頁碼 |
|---|---|---|---|
| Embedding 前向 `y = Dropout(s·E_w + P_p)` | 5 次 kernel launch | 1 次 | p.13 |
| Embedding 反向 | 3 次 | 1 次（同一個詞的梯度用 AtomicAdd 累加） | p.14 |
| Criterion（label smoothing cross entropy） | 前向、反向分開算 | 利用梯度 `∇x = q − p` 的形式，把 softmax、log、內積融合成 elementwise 運算 | p.17–18 |

第 19 頁還有一個不是 elementwise 的例子：encoder–decoder 模型裡，每個 decoder 層都要拿 encoder 輸出做 cross attention 的投影。LightSeq2 把所有層的權重 `[W1, …, WL]` 拼在一起，**做一次大 GEMM 再切開**，取代 L 次小 GEMM。

投影片第 15–16 頁直接貼了 LightSeq 的 `embedding_kernels.cu` 程式碼。想看真實寫法，可以去 [GitHub](https://github.com/bytedance/lightseq/blob/master/lightseq/csrc/kernels/cuda/embedding_kernels.cu) 對照。

### 第二招：改寫公式，少一次同步

LayerNorm 要算平均值 μ(x) 和標準差 σ(x)。照定義算，σ(x) 需要先知道 μ(x)，所以兩次 reduction 必須一前一後，中間要一次 thread 同步。第 21 頁的改寫是：

σ(x) = √(μ(x²) − μ(x)²)

現在 μ(x) 和 μ(x²) 可以同時算，**兩次同步變一次**。投影片另外註明計算用 FP32、儲存用 FP16。第 22 頁對 LayerNorm 反向傳播做同樣的事：把 ∇x 的公式重新整理成兩個可以並行的加總 Σ wⱼ∇yⱼ 與 Σ wⱼ∇yⱼxⱼ，再加上逐元素運算。

Softmax 前向也有兩次 reduction：先取最大值（避免指數溢位），再加總指數。第 23 頁直說「Two reduce: Costly!」。第 24 頁的處理方式不是改公式，而是**依形狀調參**：每列長度 ≤ 32 時一個 warp 處理一列，32 到 64 之間每個 thread 負責兩個元素，依此類推。第 25–26 頁展示 LightSeq 用 C++ template 把 block 數、每個 thread 處理幾個元素這些參數寫死在編譯期，呼叫時再挑對的版本。

第 22 頁和第 24 頁的角落寫著「You will implement LayerNorm／Softmax in hw3!」，這是舊學期的作業編號。2026 春季版這兩個 kernel 在 [HW4](/posts/ai/2026-09-30-cmu11868-hw4-transformer-cuda-acceleration)。

### 第三招：混合精度，但只在該用 FP32 的地方用

第 27 頁列出低精度的好處：模型和資料佔的記憶體少，batch 可以開大；同樣頻寬下資料在顯示卡記憶體與 SM 之間搬得更快；FP16 的 FLOPs 最多可到 FP32 的 8 倍。第 28 頁接著指出限制：前向、反向可以用 FP16 或 FP8，**optimizer 更新參數時需要 FP32**。NVIDIA 的 APEX 能自動做混合精度，但缺少針對 LLM 的細緻記憶體優化。

第 29 頁是 LightSeq2 的做法：參數和梯度以 FP16 存在**一塊連續的 workspace**，trainer 讀進來時轉成 FP32 計算、更新完再寫回 FP16，中間的 FP32 副本不實際佔記憶體。因為所有參數在同一塊連續空間，整個更新**只需要一次 kernel launch**，不用每個參數張量各發一次。

### 第四招：依反向傳播的相依關係重用記憶體

第 30 頁逐行列出 self-attention 反向傳播的每一步，標出哪些中間張量之後不會再用、它的空間可以直接給下一步。例如 ∇out 用完後，∇Z 就寫進同一塊空間。整個過程的瓶頸在 attention 分數的梯度，大小跟序列長度的平方成正比；其他張量都靠輪流重用同幾塊 B×L×H 的空間解決。

LightSeq 推論論文把這件事推得更遠：因為輸入長度不固定，它**預先為每個 kernel 定好最大記憶體，讓彼此沒有相依的運算共用**。[論文第 1 節](https://arxiv.org/abs/2010.13887)報告這讓記憶體配置次數少了 8 倍，而推論速度沒有損失。

## 效果：投影片報告的數字

以下全部是投影片自己報告的實驗結果（LightSeq2 論文的實驗），硬體與基準各不相同：

| 任務 | 基準 | 報告的加速 | 頁碼 |
|---|---|---|---|
| WMT14 英德翻譯訓練（24＋24 層 Transformer，單機 8 張 A100） | Fairseq ＋ Apex | V100 上 1.4–2.8 倍、A100 上 1.5–3.5 倍 | p.31–32 |
| 同上，單一訓練步 | Fairseq | 457 ms → 214 ms | p.33 |
| 各運算子 | Fairseq | LayerNorm 4 倍、Softmax 2.5–3.4 倍、Dropout 1.1–2.5 倍、Trainer 2.3 倍 | p.34 |
| 多機（1 到 5 台，每台 8 張 A100） | — | 1.12–1.41 倍 | p.35 |
| GPT-2 Large 訓練（WikiText） | Hugging Face | V100 上 1.7–1.8 倍、A100 上 1.6–1.9 倍 | p.37 |
| BERT 句對判斷（MRPC） | Hugging Face／DeepSpeed | 1.28–1.44 倍 | p.38 |
| ViT 影像分類（CIFAR-10） | Hugging Face | 1.2–1.7 倍 | p.40 |

第 36 頁另外報告訓練記憶體少了約 6 GB。[LightSeq2 論文摘要](https://arxiv.org/abs/2110.05722)的說法是：在不同 GPU 上比既有系統快 1.4–3.5 倍，在 WMT14 英德翻譯上達到 308% 的訓練加速。

讀這張表要記得一件事：第 32 頁註明「A100 is more efficient in GEMM」，用來說明為什麼 A100 上的加速上限比 V100 高。我的解讀是：矩陣乘法越快，非 GEMM 運算佔總時間的比例就越高，融合它們的收益也跟著變大。換句話說，**加速倍數取決於你的瓶頸原本在哪裡**，不是一個固定值。

## 推論端：beam search 怎麼少排一次序

投影片後半（p.42 起）轉到推論，主角是 [LightSeq](https://arxiv.org/abs/2010.13887)（NAACL 2021）。推論沒有反向傳播，但多了一個訓練沒有的瓶頸：beam search。

第 45 頁指出，beam search 每一步要做兩件事：對整個詞表算 softmax，再從 k × V 個候選裡挑出前 k 名。**對 k × V 個元素排序很貴**。LightSeq 的 Hierarchical Auto Regressive Search（HARS）改成「先粗篩、再精排」：

1. 把每個 beam 的 logits 分成 k 組，取每組最大值（p.46）
2. 這 k 個最大值裡的最小者，是「第 k 名至少有這麼大」的粗略門檻 ℛ
3. 只把大於 ℛ 的 logits 寫回記憶體，再對這一小批排序（p.47）

第 48–54 頁用 beam 數 2、詞表 8 的例子逐步示範：16 個 logits 最後只剩 5 個要排序。排序變成一連串可平行的取最大值、過濾、重排。

第 55 頁補了其他推論細節：跨層共用張量記憶體、以 FP16 為主計算、用 `float4` 與 `half2` 提高頻寬、推論不需保留中間結果與梯度。第 61–62 頁報告機器翻譯推論最多 14 倍、GPT-2 推論 6 倍加速；LightSeq 論文摘要的說法是比 TensorFlow 快最多 14 倍、比 FasterTransformer 快 1.4 倍。

<details>
<summary>投影片上的 API 用法（p.57–59）</summary>

投影片展示了兩種接法。一是把 Hugging Face BERT 的某一層換成 LightSeq2 的層：

```python
from lightseq.training import LSTransformerEncoderLayer
config = LSTransformerEncoderLayer.get_config(
    model="bert-base",
    max_batch_tokens=4096,
    max_seq_len=512,
    fp16=True,
    local_rank=0)
ls_layer = LSTransformerEncoderLayer(config)
# replace the 1st Hugging Face layer with LightSeq2
bert_model.layer[0] = ls_layer
```

二是在 Fairseq 裡用 `lightseq-train` 指令，把架構、optimizer、criterion 都換成 `ls_` 前綴的版本；第 59 頁說它也能和 Apex、DeepSpeed 一起用。

</details>

## 這一講沒講什麼

- **FlashAttention**：這一講的 attention 仍然把 L×L 的分數矩陣寫進記憶體，只是把 softmax 做快。把整個 attention 融合、不寫出分數矩陣，是本系列 [FlashAttention 篇](/posts/ai/2026-09-30-cmu11868-flashattention)的主題。
- **Triton**：LightSeq 全部手寫 CUDA。Syllabus 底部列了「Triton for Kernel Optimization」這個未排日期的講題，但沒有投影片。
- **量化**：第 64 頁把量化列在「其他加速方法」，細節留到後面的[量化篇](/posts/ai/2026-09-30-cmu11868-model-quantization)。

## 怎麼讀這一講

1. 先讀投影片第 9–12 頁，拿一個你熟悉的 Transformer 層，自己數一數 PyTorch 預設會發幾個 kernel、哪些可以融合。
2. 再讀第 21–24 頁的 LayerNorm 與 Softmax 改寫，這是 [HW4](/posts/ai/2026-09-30-cmu11868-hw4-transformer-cuda-acceleration) 要你親手寫的東西。回頭看一下 [HW1](/posts/ai/2026-09-30-cmu11868-hw1-cuda-programming) 自己寫過的 reduce kernel，會更清楚「少一次同步」省下什麼。
3. 論文部分，LightSeq2 論文第 IV 節（The LightSeq2 System）對應投影片前半，LightSeq 的 HARS 一節對應後半。

今晚可以做的一件事：用 PyTorch profiler 跑一次你手邊任何一個 Transformer 的前向，數一下非 GEMM kernel 佔了幾個、佔多少時間。

## 延伸閱讀

- 同一件事在 Triton 裡怎麼做、怎麼先量再優化：[CS336 Lecture 6：寫 Triton kernel 前，先學會 benchmark 與 profile](/posts/ai/2026-08-22-cs336-kernels-triton)
- GPU 記憶體階層與「少搬資料」的直覺：[CS336 Lecture 5：GPU 快不是因為每個 thread 快，而是資料少搬幾次](/posts/ai/2026-08-22-cs336-gpu-tpu)
- 本課前面的 GPU 程式模型：[L02–L04 GPU 程式模型與加速](/posts/ai/2026-09-30-cmu11868-gpu-programming-acceleration)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [CMU 11-868 LLM Systems（Spring 2026）課程首頁](https://llmsystem.github.io/llmsystem2026spring/) — 講師、課程描述
- [11-868 Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) — 2/16、2/18 兩堂共用 L10 投影片，各配一篇 reading
- [L10 投影片：Accelerating Transformer Training and Inference（PDF，66 頁）](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-10-transformer-acc-5ba466406bf7296f86cd244ad0405867.pdf) — 本文所有頁碼出處
- [Wang et al., LightSeq: A High Performance Inference Library for Transformers（NAACL 2021, arXiv 2010.13887）](https://arxiv.org/abs/2010.13887) — kernel 數減少 4 倍、記憶體配置減少 8 倍、HARS、14 倍／1.4 倍推論加速
- [Wang et al., LightSeq2: Accelerated Training for Transformer-based Models on GPUs（SC22, arXiv 2110.05722）](https://arxiv.org/abs/2110.05722) — 1.4–3.5 倍訓練加速、WMT14 英德 308%
- [bytedance/lightseq（GitHub）](https://github.com/bytedance/lightseq) — 投影片引用的 CUDA kernel 原始碼
- [lightseq embedding_kernels.cu](https://github.com/bytedance/lightseq/blob/master/lightseq/csrc/kernels/cuda/embedding_kernels.cu) — 第 15–16 頁的程式碼範例
- [lightseq softmax_kernels.cu](https://github.com/bytedance/lightseq/blob/master/lightseq/csrc/kernels/cuda/softmax_kernels.cu) — 第 25–26 頁的 template 調參範例
