---
title: "CMU 11-868 L18：ZeRO 怎麼把資料平行的記憶體切掉——optimizer state、梯度、參數各切一刀"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, cmu, ai-course, distributed-training, memory, gpu]
lang: zh-TW
series:
  name: "CMU 11-868 LLM Systems 導讀"
  order: 13
tldr: "資料平行每張卡都存一份完整的參數、梯度和 optimizer state；用 Adam 混合精度訓練時，每個參數約要 20 bytes，其中 16 bytes 是 optimizer 相關，LLaMA-3 8B 光這些就要 160GB。CMU 11-868 L18 以 ZeRO 論文為主軸，逐格動畫示範三個階段：ZeRO-1 切 optimizer state、ZeRO-2 再切梯度、ZeRO-3 連參數也切。投影片的結論是前兩階段不增加通訊、最多省 8 倍記憶體；第三階段每張卡的用量隨 GPU 數下降，代價是投影片估的約 3 倍通訊。"
description: "CMU 11-868 LLM Systems（Spring 2026）L18 Memory Optimization in Distributed Training 導讀：DDP 混合精度訓練的記憶體組成、ZeRO stage 1/2/3 的切分與 NCCL 通訊步驟、各階段的記憶體公式與通訊成本、activation checkpoint 分片、固定大小 buffer、記憶體重整、ZeRO++ 的量化通訊，以及 ZeRO 與 PP／TP 組成 3D parallelism。"
draft: false
glossary:
  - term: "ZeRO"
    aliases: ["Zero Redundancy Optimizer"]
    definition: "DeepSpeed 的記憶體優化方法：在資料平行中不讓每張卡都存一份完整的 optimizer state、梯度與參數，而是切成 K 份、每張卡只負責一份，需要時再透過集體通訊取得。"
    context: "stage 1 切 optimizer state、stage 2 再切梯度、stage 3 再切參數。"
  - term: "reduce-scatter"
    aliases: ["ReduceScatter"]
    definition: "一種集體通訊：先把所有參與者的張量加總（reduce），再把結果切成 K 份，每個參與者只拿到自己負責的那一份。"
    context: "L18 的 ZeRO-1 用 ncclReduceScatter 讓每張卡只拿到自己那一份的全域梯度。"
  - term: "mixed precision training"
    aliases: ["混合精度訓練"]
    definition: "forward 與 backward 用 FP16 參數與梯度計算，optimizer 另外保留 FP32 的參數、動量與變異數做更新，再把結果轉回 FP16。"
    context: "L18 以這個設定算出每個參數約 20 bytes 的記憶體帳。"
---

> 🌏 [English version](/en/posts/ai/2026-09-30-cmu11868-zero-memory-optimization-en)

> **本文依據 [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/) 的 2026 春季版。** 這是 [CMU 11-868 LLM Systems 導讀](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)系列的第 13 篇。[上一篇](/posts/ai/2026-09-30-cmu11868-model-parallel-moe)用切層、切矩陣、切專家處理「模型放不下」；本篇換一個角度：**不切模型，只把資料平行裡重複的東西去掉。**

這一講是 [Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) 第 11 週 3/23 的「Memory Optimization in Distributed Training」，reading 只有一篇：[ZeRO（Rajbhandari et al., SC 2020）](https://arxiv.org/abs/1910.02054)。[L18 投影片](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-18-zero-20eb6c8d8c1e7092e1b922abf03d8cdd.pdf)有 76 頁，其中第 18 到 63 頁是逐格動畫，一格只多畫一個步驟。本課沒有公開錄影，以下根據投影片與論文摘要，頁碼指 PDF 頁碼。

## 場景：資料平行省了通訊，卻浪費了記憶體

第 5 頁的對照表點出兩種平行方式的取捨：

| | 優點 | 缺點 |
|---|---|---|
| 模型平行 | 記憶體效率好 | 計算與通訊效率差（投影片舉例：用 Megatron 訓練 40B 模型只達到峰值效能的 5%） |
| 資料平行 | 計算與通訊效率好 | 記憶體效率差：每張卡都有一份完整模型 |

ZeRO 要的是兩邊的優點：保留資料平行的計算效率，同時拿掉記憶體上的重複。

## 記憶體帳：每個參數 20 bytes 從哪來

第 6 頁用 Adam 加混合精度訓練，列出每張 GPU 在 DDP 下要存的東西（N 是參數量）：

| 項目 | 大小 |
|---|---|
| FP16 模型參數 | 2N bytes |
| FP16 梯度 | 2N bytes |
| Adam 的 optimizer state（FP32 的參數、梯度、動量、變異數） | 4 × 4 × N = 16N bytes |
| 各層 forward activation | d × len × b × n_layer，和 batch、序列長度有關 |

合計是 **20N 加上 activation**。第 9–11 頁用 16 層 Transformer、兩張 GPU 的例子逐格把這些格子疊上去：兩張卡上的每一格都一模一樣。

第 12 頁把帳算到真實模型上：

| | LLaMA-3 8B | GPT-3 175B |
|---|---|---|
| 參數 | 16GB | 350GB |
| 梯度 | 16GB | 350GB |
| Optimizer state | 128GB | 2,800GB |
| 合計 | 160GB | 3,500GB |

optimizer state 佔了八成。這就是 ZeRO 先從它下手的原因。

第 13 頁再補兩項容易漏掉的用量：**暫存 buffer**（all-reduce、計算梯度 norm 時，常把所有梯度融合成一個攤平的大 buffer 以提高吞吐量）和**記憶體碎片**（投影片說極端情況可達 30%）。

第 16 頁列出減少記憶體的四類方法：ZeRO（切 optimizer state、梯度、參數）、減少 activation（checkpoint、壓縮）、CPU offload（投影片提醒 CPU–GPU 來回搬運可能佔掉 50% 時間）、記憶體效率高的 optimizer（只保留較粗粒度的統計量）。本講的主角是第一類。

## 直覺：K 張卡各管一份

第 17 頁的核心想法只有一句：**把 DDP 裡重複的資料切成 K 份，每張卡只負責一份。** 切什麼決定了是哪一階段：

- ZeRO-1：切 optimizer state
- ZeRO-2：再切梯度
- ZeRO-3：再切參數

投影片舉的效果是 7B 模型的記憶體從 120GB 降到 30GB（4 張 GPU），實作在 DeepSpeed 裡。

## 機制一：ZeRO-1，切 optimizer state

第 18–41 頁用兩張 GPU（K = 2）逐步走完一次迭代：

1. 每張卡用**完整的** FP16 參數做 forward，得到 activation 和 loss（第 19–26 頁）
2. 從 loss 做 backward，得到**完整的** FP16 本地梯度（第 27–33 頁）
3. 用 `ncclReduceScatter` 把兩張卡的梯度加總平均，但每張卡只拿到**自己負責那一半**的全域梯度，轉成 FP32（第 34–35 頁）
4. 每張卡只更新自己那一半的 FP32 變異數、動量、參數（第 36–38 頁）
5. 把更新後的 FP32 參數複製成 FP16（第 39–40 頁）
6. 用 `ncclAllGather` 把各卡更新好的 FP16 參數拼回完整的一份，進入下一輪（第 41 頁）

關鍵在第 3 步和第 6 步：原本 DDP 的 all-reduce，本來就可以拆成 reduce-scatter 加 all-gather。ZeRO-1 只是讓兩步之間的 optimizer 更新各做各的那一半。

## 機制二：ZeRO-2，梯度也只留一份

第 42 頁的想法：每張卡還是替自己那份資料算出**所有**參數的梯度，但只**保存**自己負責的那一份，其餘的交給負責的卡。梯度記憶體因此降為 1/K。

第 43–50 頁改用四張卡（K = 4），把參數分成 M0 到 M3 四段，GPU i 負責 Mi。backward 由後往前：

1. 算到 M3 那段時，GPU 0、1、2 暫時用 buffer 存 M3 的梯度
2. 用 `ncclReduce` 把 M3 的梯度送到 GPU 3
3. GPU 0、1、2 刪掉 M3 的梯度，只有 GPU 3 保留
4. 繼續往前算 M2、M1、M0，每段重複一次

梯度一算完就送走、就刪掉，所以任何時刻每張卡只需要自己那份加上一段暫存 buffer。

## 機制三：ZeRO-3，連參數也切

第 51–63 頁把參數也切成四份，每張卡平常只存一份 FP16 參數：

- **Forward**：算第一段層之前，GPU 0 用 `ncclBroadcast` 把它負責的參數送給其他三張卡，大家一起算完第一段，GPU 1、2、3 再把這些參數刪掉；接著 GPU 1、2、3 依序廣播自己那段（第 52–57 頁）
- **Backward**：從第 4 段開始算，梯度和 ZeRO-2 一樣 reduce 到 GPU 3，其他卡刪掉這段的參數和梯度；接著 GPU 2 再廣播一次第 3 段的參數，大家算完梯度送回 GPU 2，依此類推（第 58–63 頁）

參數在 forward 要廣播一次，backward 又要廣播一次，因為 forward 用完就刪了。

## 三個階段的記憶體與通訊

第 64 頁把 N 個參數、optimizer 每個參數需要 M bytes（例如 8、12 或 16）、K 張 GPU 的情況寫成公式：

| 設定 | 每張卡的記憶體 |
|---|---|
| 原始 DDP | 4N + M·N |
| ZeRO-1 | 4N + M·N / K |
| ZeRO-2 | 2N + (2 + M)·N / K |
| ZeRO-3 | (4 + M)·N / K |

<details>
<summary>用第 12 頁的 LLaMA-3 8B 代入（我的計算，不是投影片內容）</summary>

N = 8B、M = 16、K = 4：

- 原始 DDP：4 × 8 + 16 × 8 = 160GB（和第 12 頁一致）
- ZeRO-1：32 + 128 / 4 = 64GB
- ZeRO-2：16 + 18 × 8 / 4 = 52GB
- ZeRO-3：20 × 8 / 4 = 40GB

以上都還沒算 activation、暫存 buffer 和碎片。

</details>

第 65 頁講通訊成本：

- **ZeRO-1、ZeRO-2 不增加額外通訊**，同時最多可省 8 倍記憶體。原因就是上面說的：reduce-scatter 加 all-gather 本來就是 all-reduce 的拆法
- **ZeRO-3** 在 forward 和 backward 各多一次廣播，再加上 ZeRO-2 的 reduce，投影片的算法是總共 3 倍的通訊；基準的 DDP 需要一次 ScatterReduce 加一次 AllGather

第 64 頁最後一行寫得很直接：省下的記憶體「代價是額外的參數傳輸」。

## 其他記憶體優化

第 67–70 頁補充 ZeRO 論文裡的其他技巧，以及後續的 ZeRO++：

- **Partitioned activation checkpointing**（第 67 頁）：tensor parallelism 在設計上會讓每張卡都有一份 activation。把每份 activation 切到不同卡，需要時再收回來
- **固定大小 buffer**（第 68 頁）：做 all-reduce 時用 buffer 提高頻寬，類似 PyTorch DDP 的 bucketing。現代實作常把所有參數融合進單一 buffer，ZeRO 改用固定大小的 buffer，對大模型更有效率
- **記憶體重整**（第 69 頁）：把長壽的資料（參數、optimizer state）放在一起，和短命的資料（用完就丟的 activation）分開；投影片提到還可以像 LightSeq 那樣重用記憶體
- **ZeRO++ 的量化通訊**（第 70 頁，Wang et al. ICLR 2024）：forward 廣播參數時做 block-wise 量化（FP16 轉 INT8，zero-point quantization）；backward 的 ReduceScatter 量化成 INT8 或 INT4；另外在每個節點內保留一份完整參數，減少跨節點的傳輸

## 效果與組合

第 71–72 頁引論文的數字：理論上在 32GB V100 叢集上，用 1,024 張 V100 可以訓練 1 兆參數的模型；實測訓練了 17B 的 Turing-NLG（投影片標注為 2020 年 1 月時最大的模型），以及在 400 張 GPU 上訓練 100B 模型，吞吐量約為基準的 10 倍、理論峰值的 30%。論文摘要的說法是：在 400 張 GPU 上以超線性加速訓練超過 100B 參數的模型，吞吐量 15 PetaFLOPS，可訓練模型大小是當時最佳做法的 8 倍，效能是 10 倍；不需要模型平行就能訓練到 13B。

第 73–74 頁把 ZeRO 和 pipeline parallelism、tensor parallelism 組成 3D parallelism，也就是把本篇和上一篇的方法疊在一起用。

第 75 頁的總結：ZeRO 大幅降低記憶體、可擴展、好用；缺點是某些階段會增加通訊，影響大小取決於硬體互連（PCI-E 或 NVLink）。第 76 頁附了課程的 [DeepSpeed 範例 notebook](https://github.com/llmsystem/llmsys_code_examples/blob/main/deepspeed_example/DeepSpeed-Example.ipynb)。HW6 會直接用 DeepSpeed 的 ZeRO 加 LoRA 微調 Llama-2-7B，詳見 [HW6 導讀](/posts/ai/2026-09-30-cmu11868-hw6-training-inference-systems)。

## 怎麼做：沒修課也能練的三件事

1. **替自己的模型算一次帳**：拿你正在訓練或想訓練的模型參數量，代入第 64 頁的四條公式，找出在你手上的 GPU 數與記憶體下，至少要開到哪一個 ZeRO 階段。
2. **在兩張卡上比較 stage 1、2、3**：用課程的 DeepSpeed notebook 或 DeepSpeed 官方範例，只改 config 的 `zero_optimization.stage`，記錄每個階段的峰值記憶體與每步時間，看通訊代價在你的互連上有多大。
3. **把 all-reduce 拆開看**：用 `torch.distributed` 在兩個 process 上分別實作「all-reduce」和「reduce-scatter 加 all-gather」，確認結果相同，這就是 ZeRO-1 不增加通訊的原因。

## 延伸閱讀

- 系列上一篇：[L16–L17 模型平行與 MoE](/posts/ai/2026-09-30-cmu11868-model-parallel-moe)
- 系列下一篇：[HW5：資料平行與管線平行](/posts/ai/2026-09-30-cmu11868-hw5-distributed-training)
- 站內：[CS336 資源計算](/posts/ai/2026-08-22-cs336-resource-accounting)（每個參數要幾 bytes 的另一種算法）、[CS336 平行化機制](/posts/ai/2026-08-22-cs336-parallelism-mechanics)、[CS336 平行化策略](/posts/ai/2026-08-22-cs336-parallelism-strategies)

## 參考資料

- 課程：[CMU 11-868 LLM Systems Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)（3/23 講題與 reading）
- 投影片：[L18 Memory Optimization in Distributed Training](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-18-zero-20eb6c8d8c1e7092e1b922abf03d8cdd.pdf)（76 頁）
- 論文：[Rajbhandari et al., ZeRO: Memory Optimizations Toward Training Trillion Parameter Models](https://arxiv.org/abs/1910.02054)（摘要中的 100B、400 GPU、15 PetaFLOPS、8 倍、10 倍、13B）
- 論文：[Wang et al., ZeRO++: Extremely Efficient Collective Communication for Giant Model Training](https://arxiv.org/abs/2306.10209)
- 程式：[llmsys_code_examples 的 DeepSpeed 範例 notebook](https://github.com/llmsystem/llmsys_code_examples/blob/main/deepspeed_example/DeepSpeed-Example.ipynb)
