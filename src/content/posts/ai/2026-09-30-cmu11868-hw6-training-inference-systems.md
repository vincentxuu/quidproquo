---
title: "CMU 11-868 作業六：用 DeepSpeed ZeRO＋LoRA 訓練 Llama-2-7B，用 SGLang 做推論"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, ai-course, cmu, homework, lora, distributed-training, sglang, llm-inference]
lang: zh-TW
series:
  name: "CMU 11-868 LLM Systems 導讀"
  order: 20
tldr: "11-868 第六份作業第一次放下自己寫的 MiniTorch，改用產業框架。兩題各 50 分：第一題改一支 DeepSpeed 訓練腳本，打開 LoRA，讓 Llama-2-7B 在 2 張 16GB 的 V100 上訓練得起來；第二題填完 SGLang 推論腳本的 TODO，並調參數讓生成跑快一點。兩題要的 GPU 互相衝突：SGLang 不支援 V100，要換 L40S、A6000 或 A100。春季版 4/13 截止，作業頁不提供評分測資。"
description: "CMU 11-868 LLM Systems（Spring 2026）作業六導讀：Assignment 6 的目標、環境設定、Problem 1（DeepSpeed ZeRO & LoRA，50 分）與 Problem 2（SGLang 推論，50 分）要做什麼與交什麼、起始碼 llmsys_hw6 的結構、依賴的第 18、22、23 講、硬體需求與校外讀者會卡住的地方。不提供解答。"
draft: false
glossary:
  - term: "DeepSpeed-Chat"
    aliases: ["dschat"]
    definition: "Microsoft DeepSpeed 團隊釋出的訓練範例程式集，涵蓋 SFT、reward model 與 RLHF 流程，內建 ZeRO 與 LoRA 選項。"
    context: "HW6 的 deepspeed 資料夾沿用它的 dschat 套件與 main.py。"
  - term: "mem_fraction_static"
    aliases: []
    definition: "SGLang 引擎的參數，決定 GPU 記憶體中保留給模型權重與 KV cache 記憶體池的比例。"
    context: "HW6 Problem 2 列出它和 dp_size、batch size 等，作為可以探索的加速參數。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu11868-hw6-training-inference-systems-en)

**影片狀態：已查核：官方公開頁未列對應錄影。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文依據 [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/) 2026 春季版。作業頁在跨學期共用的[作業站](https://llmsystem.github.io/llmsystemhomework/assignment_6/)，起始碼在 [llmsys_hw6](https://github.com/llmsystem/llmsys_hw6)，兩者都是 2026-09-30 所見。這個 repo 最後一次 commit 是 2026-03-23（訊息為「update hw6」），也就是春季截止日之前，之後沒有再被 Fall 2026 改動。[Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) 只列出 HW6 在 4/13 截止，沒有寫發放日。存取等級 **A3**：題目與起始碼公開；拿不到的是繳交系統、評分細則與學校提供的 PSC GPU。

**系列位置**：上一篇 [L22、L24 LLM 服務：排程、RadixAttention 與 PagedAttention](/posts/ai/2026-09-30-cmu11868-llm-serving-sglang-vllm)｜下一篇 [L26–L30 大規模服務：prefill／decode 拆分、KV cache 與異質硬體](/posts/ai/2026-09-30-cmu11868-serving-at-scale-kv-cache)｜[系列總覽](/posts/ai/2026-09-30-cmu11868-llm-systems-overview)

作業一到作業五，你都在自己寫的 [MiniTorch](https://llmsystem.github.io/llmsystemhomework/) 上加東西：CUDA kernel、自動微分、Transformer、融合 kernel、資料平行與管線平行。作業六換了方向。作業頁第一句寫的目標是「熟悉我們用來做訓練與推論的常見框架」。

換句話說，前五份作業讓你知道框架裡面長什麼樣；這一份讓你用真的框架，把前面學的 ZeRO、LoRA、RadixAttention 跑在一個 7B 模型上。

本文只講題目結構、配分、需要的資源，以及校外讀者會卡在哪。**不提供任何題目的解答。**

## 課程影片來源

已核對 Spring 2026 官方 Syllabus：各講公開列出 slides、reading 與 homework，未列對應講次的公開錄影連結。本文因此以投影片、論文或作業導讀，沒有對應講次播放器；這項結論只限官方公開頁面，不代表校內沒有錄影。

官方來源：

- [CMU 11-868 Spring 2026 官方課表與教材](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus/)

查核日期：2026-10-10。

## 它在課程裡的位置

兩題各自對應前面的講座：

| 題目 | 依賴的講座 | 本系列對應篇 |
|---|---|---|
| Problem 1：DeepSpeed ZeRO & LoRA | 第 18 講 ZeRO（3/23）、第 23 講 PEFT（4/8） | [L18 ZeRO](/posts/ai/2026-09-30-cmu11868-zero-memory-optimization)、[L23 LoRA 與 QLoRA](/posts/ai/2026-09-30-cmu11868-peft-lora) |
| Problem 2：SGLang 推論 | 第 22 講 LLM serving with SGL（4/6） | [L22、L24 LLM 服務](/posts/ai/2026-09-30-cmu11868-llm-serving-sglang-vllm) |

截止日 4/13 當天正好是第 24 講 vLLM。也就是說，春季的學生是在聽完 SGLang 與 PEFT 兩講之後、只剩約一週的時間內寫完這份作業。

## 起始碼長什麼樣

[llmsys_hw6](https://github.com/llmsystem/llmsys_hw6) 只有兩個資料夾：

- `deepspeed/`：訓練部分。腳本開頭標示版權屬於 Microsoft、署名 DeepSpeed Team，裡面的 `dschat` 套件（含 `utils/module/lora.py`、`rlhf/` 等）與 `main.py` 沿用 DeepSpeed-Chat 的結構。你要改的是 `run_llama2_7b_lora.sh`。
- `sglang/`：推論部分，只有一支 `run_sglang.py`。

`run_llama2_7b_lora.sh` 目前是一支能跑的全參數訓練腳本：預設 ZeRO stage 3、BF16、開啟 gradient checkpointing，並在呼叫 `main.py` 的地方留了一行「TODO: modify the args to start training for LoRA」。`main.py` 的參數區段本身已經有 LoRA 與 offload 相關的選項，作業要你想清楚的是怎麼組合它們。

`run_sglang.py` 預設模型是 `Qwen/Qwen2.5-7B-Instruct-1M`，讀的是 [AlpacaEval](https://huggingface.co/datasets/tatsu-lab/alpaca_eval) 的評估題目，把 instruction 收成 prompt 清單。裡面有三個 TODO：初始化 SGLang 引擎、選 batch size、把分批的 prompt 送去 `llm.generate` 並收集輸出。輸出每 10 筆取 1 筆寫進 `outputs.jsonl`。

## 環境設定

作業頁要求用 conda 建一個 Python 3.9 的環境以避開相依問題，在 PSC 上載入 CUDA 12.6.1 與 GCC 10.2.0，再安裝 `datasets` 與 `sglang[all]>=0.4.4.post3`（從 FlashInfer 的 wheel 來源安裝）。

作業頁建議在 PSC 上開一個 2 GPU、4 小時的互動 session（`GPU-shared` partition），並把 Hugging Face 的快取目錄設到 PSC 的專案空間，否則模型會塞爆家目錄，出現 Disk Quota Exceeded。

這裡有一個作業頁自己沒解決的矛盾：環境設定說用 Python 3.9，Problem 2 的 NOTE 卻說安裝 SGLang 可能需要 Python 3.10 以上。實務上，兩題分開建兩個環境比較省事。

## Problem 1：DeepSpeed ZeRO & LoRA（50 分）

**要做什麼**。作業頁說，這題「延續我們的範例」繼續訓練，但打開 LoRA，讓它能放進 2 張 GPU。具體任務是更新 `deepspeed/run_llama2_7b_lora.sh` 來使用 LoRA，並自行探索不同設定，讓訓練能在 **2 張 V100、每張 16GB** 上跑起來。

**事前準備**。模型是 [meta-llama/Llama-2-7b-hf](https://huggingface.co/meta-llama/Llama-2-7b-hf)，要先在 Hugging Face 申請存取權，並用 `huggingface-cli login` 登入。

**要交什麼**。改好的 `run_llama2_7b_lora.sh`，以及訓練 log。腳本最後一行有被註解掉的 log 導向，取消註解就會存到輸出資料夾。

**這題真正在考什麼**。回到 [L23](/posts/ai/2026-09-30-cmu11868-peft-lora) 的記憶體帳：BF16 的 7B 模型光權重就約 14GB，一張 16GB 的卡幾乎沒有空間放梯度與 Adam 的 optimizer state。ZeRO stage 3 會把參數、梯度與 optimizer state 分到兩張卡上；LoRA 則把需要梯度與 optimizer state 的參數縮到很小。你要調的是這兩者（加上 batch size、序列長度、gradient checkpointing、offload 等）怎麼搭配，才不會 OOM。作業頁鼓勵探索，所以 log 裡能看出你試過什麼，比只交一組能跑的參數更有說服力。

## Problem 2：SGLang 推論（50 分）

**硬體先講清楚**。作業頁的 NOTE 寫明：SGLang 不支援 V100（compute capability 低於 sm75），要改用 L40S、A6000、A100 等 GPU。所以這題和 Problem 1 不能用同一種卡。

**背景說明**。作業頁花了不少篇幅介紹 [SGLang](https://arxiv.org/abs/2312.07104) 的 runtime 加速，內容和第 22 講呼應：

- **RadixAttention**：生成完不丟掉 prompt 與生成結果的 KV cache，而是存在 radix tree 裡，讓前綴搜尋、重用、插入與驅逐都更快。驅逐用 LRU，淘汰的是最久沒用的葉節點，共同祖先會保留到它們自己也被淘汰為止。
- **Cache-aware 排程**：批次處理時依已命中的前綴長度排序，命中越長越優先，取代 FIFO。
- **壓縮有限狀態機的 constrained decoding**：把 FSM 中相鄰、只有單一轉移的邊合併成一條，一次解碼多個 token。

作業頁也提到 SGLang 的後端建立在 [FlashInfer](https://arxiv.org/abs/2501.01005) 上。

**要做什麼**。填完 `sglang/run_sglang.py` 的 TODO。作業頁歡迎你探索不同參數讓它跑更快，列出的包括 temperature、top_k、top_p、max_new_tokens、batch size、`mem_fraction_static`、`dp_size`。

**要交什麼**。`sglang/run_sglang.py` 與推論 log。

**這題真正在考什麼**。程式本身很短，難的是把服務那兩講的觀念對到參數上：依 [SGLang 文件](https://sgl-project.github.io/advanced_features/server_arguments.html)，`mem_fraction_static` 是靜態配置（模型權重加 KV cache 記憶體池）佔 GPU 記憶體的比例；`dp_size` 對應第 24 講說的資料平行，也就是複製多份引擎；batch size 決定排程器一次能看到多少請求。起始碼的預設 `max_new_tokens` 是 8192，而這個上限會直接影響每個請求可能佔用的 KV cache。

## 需要什麼運算資源

- **Problem 1**：2 張 GPU，作業頁以 2 張 16GB V100 為目標。記憶體更大的卡會比較寬鬆，但就少了「塞不下」的練習。
- **Problem 2**：sm75 以上的 GPU（作業頁舉 L40S、A6000、A100）。
- **儲存空間**：7B 模型的權重要放在有足夠配額的地方，作業頁特別提醒家目錄會爆。
- **帳號**：Llama-2 需要 Hugging Face 的存取核准。

## 校外讀者會卡在哪

1. **沒有 PSC**。作業頁的 `srun`、`module load` 與 `/ocean/projects/...` 路徑都是 PSC 專用。校外讀者要換成自己的雲端 GPU，並自行處理 CUDA 與編譯器版本。
2. **兩題要兩種卡**。租雲端時，Problem 1 想重現 16GB 的限制、Problem 2 又不能用 V100，最省事的做法是兩題都用 sm75 以上的卡，再用較小的 batch 或限制可用記憶體來模擬 Problem 1 的壓力。這是本文的建議，不是作業頁的要求。
3. **README 和作業頁不一致**。repo 裡的 README 還是舊版：連結指向 `llmsys_f25_hw6`、兩題配分寫成各 5 分，並多了一句「應該能在 15 分鐘內完成所有生成」。配分與要求以[作業站頁面](https://llmsystem.github.io/llmsystemhomework/assignment_6/)為準（各 50 分）；15 分鐘那句作業頁沒有，可以當成參考值。
4. **評分方式不公開**。作業頁只列要交的檔案，沒有寫 log 要達到什麼 loss、推論要多快才算完成。
5. **是不是 optional 作業**。[Logistics](https://llmsystem.github.io/llmsystem2026spring/docs/Logistics) 只說有五份必修、兩份選修作業，沒有說是哪兩份，所以無法判斷作業六是否為選修。

## 自學怎麼做

1. 先讀 [L18 ZeRO](/posts/ai/2026-09-30-cmu11868-zero-memory-optimization) 與 [L23 LoRA](/posts/ai/2026-09-30-cmu11868-peft-lora)，在紙上算出 Llama-2-7B 在「全參數＋ZeRO-3」與「LoRA＋ZeRO-3」下，每張卡大約要放多少東西。
2. 先不改參數跑一次原始腳本，確認它在你的硬體上怎麼失敗，再開始打開 LoRA。
3. Problem 2 先用小 batch 跑通，再逐一調 `mem_fraction_static`、`dp_size` 與 batch size，每次只改一個，記下吞吐與總時間。
4. 讀完 [L22、L24](/posts/ai/2026-09-30-cmu11868-llm-serving-sglang-vllm) 後，試著用自己的話解釋為什麼某個參數讓它變快或變慢。

## 延伸閱讀

- 另一門課的平行化觀念：[CS336 平行化機制](/posts/ai/2026-08-22-cs336-parallelism-mechanics)
- 推論系統的另一種講法：[CS336 推論](/posts/ai/2026-08-22-cs336-inference)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [CMU 11-868 LLM Systems（Spring 2026）課程首頁](https://llmsystem.github.io/llmsystem2026spring/)
- [11-868 Syllabus（Spring 2026）](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) — HW6 於 4/13 截止
- [11-868 Logistics（Spring 2026）](https://llmsystem.github.io/llmsystem2026spring/docs/Logistics) — 五份必修、兩份選修作業，未指明是哪兩份
- [Assignment 6: Advanced Training and Inference Systems](https://llmsystem.github.io/llmsystemhomework/assignment_6/) — 目標、環境設定、兩題配分、任務與繳交項目、SGLang 的 GPU 限制
- [llmsystem/llmsys_hw6 GitHub repo](https://github.com/llmsystem/llmsys_hw6) — 起始碼（最後 commit 2026-03-23）
- [meta-llama/Llama-2-7b-hf](https://huggingface.co/meta-llama/Llama-2-7b-hf) — Problem 1 的模型，需申請存取
- [tatsu-lab/alpaca_eval 資料集](https://huggingface.co/datasets/tatsu-lab/alpaca_eval) — `run_sglang.py` 讀的評估題目
- [Zheng et al., SGLang: Efficient Execution of Structured Language Model Programs（arXiv 2312.07104）](https://arxiv.org/abs/2312.07104)
- [SGLang Server Arguments 文件](https://sgl-project.github.io/advanced_features/server_arguments.html) — `mem_fraction_static` 的定義
- [Ye et al., FlashInfer（arXiv 2501.01005）](https://arxiv.org/abs/2501.01005) — 作業頁所說 SGLang 的後端
