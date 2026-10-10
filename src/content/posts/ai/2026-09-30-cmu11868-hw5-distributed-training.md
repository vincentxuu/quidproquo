---
title: "CMU 11-868 HW5：在兩張 GPU 上自己寫資料平行與管線平行"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, cmu, ai-course, homework, distributed-training, pytorch, gpu]
lang: zh-TW
series:
  name: "CMU 11-868 LLM Systems 導讀"
  order: 14
tldr: "CMU 11-868 第五份作業改用 PyTorch 與 Hugging Face 的 GPT-2，要你只用 torch.distributed 和 torch.multiprocessing 寫出資料平行（切資料、建 process group、平均梯度，50 分），再寫出 GPipe 式的管線平行（切模型、產生時脈排程、用 worker thread 跑 micro-batch，50 分）。兩部分都要在至少兩張 GPU 上做 benchmark 並交圖：資料平行要在 2 張卡上達到至少 1.5 倍加速，管線平行要比單純模型平行快。2026 春季版 3/25 截止。"
description: "導讀 CMU 11-868 LLM Systems（Spring 2026）Assignment 5 Distributed Training and Parallelism：起始碼 llmsys_hw5 的結構與限制、Problem 1 資料平行三個小題、Problem 2 管線平行三個小題、benchmark 與評分門檻、PSC 與至少 2 張 GPU 的硬體需求、作業頁與起始碼的不一致處，以及它對應 L14–L16 的哪些觀念。不含解答。"
draft: false
glossary:
  - term: "process group"
    aliases: ["行程群組"]
    definition: "torch.distributed 裡一群彼此會做集體通訊的 process。每個 process 有一個 rank，整個群組的大小是 world size。"
    context: "HW5 Problem 1.2 要你用 init_process_group 建立它，MASTER_PORT 指定為 11868。"
  - term: "micro-batch"
    definition: "pipeline parallelism 把一個 mini-batch 再切出的小份資料，讓不同 stage 可以同時處理不同份，減少閒置。"
    context: "HW5 Problem 2.2 的 Pipe 模組把輸入切成 micro-batch 後依時脈排程計算。"
---

> 🌏 [English version](/en/posts/ai/2026-09-30-cmu11868-hw5-distributed-training-en)

> **本文依據 [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/) 的 2026 春季版。** 這是 [CMU 11-868 LLM Systems 導讀](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)系列的第 14 篇。作業頁與 repo 依 2026-09-30 所見；作業站是跨學期共用的，之後可能被 Fall 2026 修改。

這份作業把第 11 到 13 篇講的東西拿來動手：[資料平行](/posts/ai/2026-09-30-cmu11868-data-parallel-training)（L14–L15）和[管線平行](/posts/ai/2026-09-30-cmu11868-model-parallel-moe)（L16 上半）。[上一篇的 ZeRO](/posts/ai/2026-09-30-cmu11868-zero-memory-optimization) 不在這份作業裡，要到 HW6 才用 DeepSpeed 實際跑。

## 課程影片來源

本篇依官方講義、投影片或作業導讀；本次檢查官方公開頁面，尚未核實本文對應講次的公開錄影。這不表示課程沒有錄影。

課程與錄影入口：

- [cmu-11-868-llm-systems — official course materials and recording index](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)

## 基本資料

| 項目 | 內容 |
|---|---|
| 作業頁 | [Assignment 5: Distributed Training and Parallelism](https://llmsystem.github.io/llmsystemhomework/assignment_5/) |
| 起始碼 | 頁面連到 `llmsys_f25_hw5`，會 301 轉到 [llmsystem/llmsys_hw5](https://github.com/llmsystem/llmsys_hw5) |
| 截止 | 2026 春季版 3/25（[Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) 第 11 週）；發放日 Syllabus 沒寫 |
| 配分 | Problem 1 Data Parallel 50、Problem 2 Pipeline Parallel 50 |
| 硬體 | 至少 2 張 GPU；作業頁強烈建議用 PSC |
| 環境 | conda 建 Python 3.9 環境；`requirements.txt` 固定 torch 2.2.0、transformers 4.37.2、datasets 3.6.0 |
| 對應講次 | L14–L15（資料平行）、L16（pipeline）；3/20 的 Recitation 6 主題是 Distributed Training |

和前四份作業最大的不同：**這份作業不再用 MiniTorch。** 起始碼的 `project/run_data_parallel.py` 直接載入 Hugging Face 的預訓練 `GPT2LMHeadModel`，資料是 `bbaaaa/iwslt14-de-en-preprocess`，訓練集只取前 5,000 筆，預設跑 10 個 epoch。重點從「自己寫框架」換成「自己寫分散式的那一層」。

## 規則：只能用兩個套件做通訊

Problem 1 限定只能用 `torch.distributed` 和 `torch.multiprocessing.Process` 做 GPU 通訊，不准新增 `import`。Problem 2 只能用起始碼裡已經 import 的套件。所有要實作的地方都用 `BEGIN_HW5_*` 和 `END_HW5_*` 註解標起來，修改必須留在標記區塊內。作業頁說會人工檢查程式碼是否遵守套件限制。

## Problem 1：資料平行（50 分）

**1.1 切資料。** 在 `data_parallel/dataset.py` 實作三樣東西：

- `Partition`：依一組索引回傳資料的 dataset 類別
- `DataPartitioner`：把索引打亂後依比例切成幾份（例如四張卡時是 `[0.25, 0.25, 0.25, 0.25]`），`use(rank)` 取出某一份
- `partition_dataset`：算出每張卡的 batch size（總 batch 128、四張卡時每張 32），取出本 rank 的那份資料，包成 `DataLoader`

測試 `a5_1_1` 只檢查各份資料有沒有重疊。

**1.2 建 process group、平均梯度。** 在 `project/run_data_parallel.py` 實作 `setup`：把 `MASTER_ADDR` 設為 localhost、`MASTER_PORT` 設為 11868，呼叫 `init_process_group`；主程式要依 `world_size` 建立、啟動並正確收掉多個 process。再實作 `average_gradients`，走過模型所有參數，用 `torch.distributed` 的函式把梯度彙總，並在 `project/utils.py` 的 `train` 裡 backward 之後呼叫它。

測試方式是先用 `world_size` 2 跑一個 batch，把每個 rank 的梯度存成 `model{rank}_gradients.pth`，再用 `a5_1_2` 比較兩張卡的梯度是否一致。

**1.3 benchmark。** 比較單卡（batch 64）和兩張卡（總 batch 128）的訓練時間與 tokens per second。作業頁規定的算法：訓練時間取多張卡各自的平均；吞吐量把各卡的 tokens per second 相加。建議丟掉第一個 epoch 或至少先暖機一次。兩個指標各畫一張圖存進 `submit_figures`。**在 2 張 GPU 上達到至少 1.5 倍加速**（訓練時間與吞吐量）即得滿分。

## Problem 2：管線平行（50 分）

這部分實作的是 L16 講的 GPipe 式排程：把模型按層切到不同 GPU，把輸入切成 micro-batch，讓各 stage 同時處理不同份。

**2.1 切模型與排程。** 在 `pipeline/partition.py` 實作 `_split_module`，把一個 `nn.Sequential` 按層切成幾段、每段放一張 GPU。在 `pipeline/pipe.py` 實作 `_clock_cycles(num_batches, num_partitions)`，產生每個時間步要由哪個 stage 處理哪個 micro-batch 的排程。測試 `a5_2_1`。

**2.2 Pipe 模組。** 先讀懂 `worker.py`，再實作 `Pipe.forward` 和 `Pipe.compute`。`Pipe` 是一個通用包裝，能把任何 `nn.Sequential` 變成管線化模組。起始碼在 `create_workers` 裡替每張 GPU 開一個 worker thread，各自從 `in_queue` 取工作、把結果放進 `out_queue`；你要把計算包成 `Task` 放進對應裝置的佇列，再取回結果。作業頁特別提醒：`forward` 的結果要放在**最後一張卡**上，放在輸入 `x` 所在的卡會讓訓練失敗。測試 `a5_2_2`。

**2.3 接上 GPT-2。** 在 `pipeline/model_parallel.py` 實作 `_prepare_pipeline_parallel`：GPT-2 的各個 block 已經由 `GPT2ModelCustom.parallelize` 分到不同 GPU，你要把 `self.h` 裡的 transformer block 取出來包成 `nn.Sequential` 交給 `Pipe`。作業頁提醒 `GPT2Block` 回傳的是 tuple 而不是張量，只需要 hidden states；若自己加了沒有參數的輔助模組，要用 `WithDevice` 包起來，否則它會被判定在 CPU 上。

最後分別用 `--model_parallel_mode='model_parallel'` 和 `'pipeline_parallel'` 在兩張卡上訓練，畫圖比較。**管線平行的訓練時間更短、吞吐量更高**即得滿分。

## 繳交與評分

作業頁提供 `scripts/create_submission_zip.sh` 打包，以及 `scripts/run_benchmarks.py` 產生效能紀錄、`submit_figures/performance_summary.json` 與圖。助教會編譯執行程式碼、檢查圖，並人工檢查套件限制。

## 作業頁與起始碼的不一致

2026-09-30 對照作業頁與 `llmsys_hw5` main 分支時，看到三處對不上：

1. **`partition_dataset` 的簽名**：作業頁寫 `partition_dataset(dataset, batch_size=128, collate_fn=None)`，起始碼是 `partition_dataset(rank, world_size, dataset, batch_size=128, collate_fn=None)`。以起始碼為準。
2. **繳交檔名**：Submission 一節寫「submit the whole `llmsys_s25_hw5` as a zip on canvas」，還是 2025 春季的 repo 名。
3. **加速門檻**：Problem 1.3 寫訓練時間與吞吐量都要 1.5 倍，但 grader 模式的範例指令是 `--dp-time-threshold 1.2 --dp-throughput-threshold 1.5`（管線平行兩項都是 1.0）。實際評分用哪個值，官方頁面沒有說明。

另外，main 分支最後一筆 commit 是 2026-04-30，仍是春季狀態；repo 另有一個 `merged-hw5-hw6` 分支。Fall 2026 若修改作業，可能出現在那裡或 main 上。要對齊春季版，checkout 2026-03-25 之前的 commit 最保險。

## 校外讀者會卡在哪

- **兩張 GPU**：這是整個系列第一份硬性要求多卡的作業。PSC 是 [Logistics](https://llmsystem.github.io/llmsystem2026spring/docs/Logistics) 寫明提供給修課學生的運算資源，校外讀者要自己租雲端的雙卡機器；Logistics 也提醒 PSC 採排程制，不保證工作何時開始跑
- **1.5 倍加速不是自動的**：兩張卡的梯度同步有成本（L14–L15 講的就是這個），單卡 batch 64 對兩卡總 batch 128 的設定下，加速多少取決於你的互連與實作
- **沒有 Canvas 與人工評分**：測試只驗證正確性（資料不重疊、梯度一致、排程正確），效能與套件限制要自己檢查

## 怎麼做：沒修課也能練的三件事

1. **先在 CPU 上跑通資料平行**：`init_process_group` 用 `gloo` backend、兩個 process，就能在筆電上驗證 `DataPartitioner` 和 `average_gradients` 的正確性，再上 GPU 量加速。
2. **手寫一次時脈排程**：在紙上畫 3 個 stage、4 個 micro-batch 的 GPipe forward 排程，每個時間步寫出 (micro-batch, stage) 配對，再和 `_clock_cycles` 的測試對照。
3. **量一次 bubble**：管線平行跑通後，用 `run_pipeline.py` 的 `--n_chunk`（micro-batch 數，預設 4）改變切法，記錄吞吐量怎麼變，對照 L16 的 bubble 公式 O((K−1)/(M+K−1))。

## 延伸閱讀

- 系列上一篇：[L18 ZeRO：分散式訓練的記憶體優化](/posts/ai/2026-09-30-cmu11868-zero-memory-optimization)
- 系列下一篇：[L19–L20 模型量化](/posts/ai/2026-09-30-cmu11868-model-quantization)
- 前一份作業：[HW4：Softmax／LayerNorm 的 CUDA 融合 kernel](/posts/ai/2026-09-30-cmu11868-hw4-transformer-cuda-acceleration)；下一份作業：[HW6：DeepSpeed ZeRO＋LoRA 訓練、SGLang 推論](/posts/ai/2026-09-30-cmu11868-hw6-training-inference-systems)
- 站內：[CS336 平行化機制](/posts/ai/2026-08-22-cs336-parallelism-mechanics)、[CS336 平行化策略](/posts/ai/2026-08-22-cs336-parallelism-strategies)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- 作業：[Assignment 5: Distributed Training and Parallelism](https://llmsystem.github.io/llmsystemhomework/assignment_5/)（2026-09-30 查核）
- 起始碼：[llmsystem/llmsys_hw5](https://github.com/llmsystem/llmsys_hw5)（main 分支，最後 commit 2026-04-30；`requirements.txt`、`project/run_data_parallel.py`、`project/run_pipeline.py`、`data_parallel/dataset.py`、`pipeline/pipe.py`）
- 課程：[CMU 11-868 LLM Systems Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)（HW5 截止日、Recitation 6）、[Logistics](https://llmsystem.github.io/llmsystem2026spring/docs/Logistics)（PSC 運算資源）
- 投影片：[L16 Model Parallel Training](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-16-model-parallel-83b41612547620ee0e172caa1ee448ed.pdf)（GPipe 與 bubble 公式）
- 文件：[PyTorch torch.distributed](https://pytorch.org/docs/stable/distributed.html)（`init_process_group`、集體通訊）
