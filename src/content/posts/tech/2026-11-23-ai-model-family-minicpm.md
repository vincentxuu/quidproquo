---
title: "MiniCPM（面壁小鋼炮）——MiniCPM5 文字小模型、MiniCPM-V 4.7 多模態與 OCR，全線 Apache 2.0 的端側家族"
date: 2026-11-23
category: tech
tags: [ai-agent, llm, openbmb, open-source, model-family-minicpm, on-device, multimodal, model-selection]
lang: zh-TW
type: deep-dive
tldr: "MiniCPM 是面壁智能與清華、OpenBMB 社群的端側模型家族，目前在架的是文字線 MiniCPM5-2B／1B、多模態線 MiniCPM-V 4.7（35B-A3B MoE 與 1B）、文件解析 MiniCPM-OCR 1.0 和全雙工的 MiniCPM-o 4.5，權重全部是不附加條款的 Apache 2.0。MiniCPM5-2B 在 Artificial Analysis v4.2 拿到 4B 以下開放權重最高的 15 分，強項是工具呼叫與 agent 任務，知識與終端 coding 仍弱；它沒有進 OpenRouter，主要靠自架與面壁自家平台取得。"
description: "MiniCPM（OpenBMB／面壁智能）模型家族介紹：MiniCPM5、MiniCPM-V 4.7、MiniCPM-OCR、MiniCPM-o 4.5 的定位與規格，訓練與端側推論設計，官方與 Artificial Analysis 評測，授權、開放平台積分價格、Hugging Face 與 Ollama 採用數字、車機與手機部署案例，以及 Agent 選型。"
series:
  name: "AI 模型家族"
  order: 41
draft: false
glossary:
  - term: "OPD（On-Policy Distillation）"
    aliases: ["On-Policy Distillation"]
    definition: "讓學生模型用自己生成的回答取樣，再以老師模型在同一位置的分布（MiniCPM5 用全詞表反向 KL）當訊號來訓練；MiniCPM5 用它把多個 RL 專家模型併回一個發布模型"
  - term: "LES（Lookahead Expert Scheduling）"
    aliases: ["Lookahead Expert Scheduling"]
    definition: "MiniCPM-V 4.7 35B-A3B 的端側 MoE 推論技術：用跨層路由預測先把下一層可能用到的專家權重載入記憶體，讓載入與計算重疊；預測只影響預載順序，實際路由不變"
---

> :globe: [English version](/posts/tech/2026-11-23-ai-model-family-minicpm-en)

MiniCPM（中文暱稱「面壁小鋼炮」）是面壁智能（ModelBest）與清華大學、OpenBMB 開源社群做的小模型家族，目標是讓模型在手機、PC、車機上本地跑，不靠雲端。這篇寫給要在裝置上放模型的 Agent 開發者：目前該選哪一條產品線、各自的強弱在哪，以及它跟 [Qwen](/posts/tech/2026-08-24-ai-model-family-qwen)、[Gemma](/posts/tech/2026-09-19-ai-model-family-gemma)、[Liquid AI LFM](/posts/tech/2026-10-10-ai-model-family-liquid-ai) 這些同樣做小模型的家族比起來站在哪裡。

2026 年 11 月在架的是四條線：文字的 MiniCPM5（9 月出 2B）、多模態的 MiniCPM-V 4.7（10 月）、文件解析的 MiniCPM-OCR（10 月底），以及能邊看邊聽邊說的 MiniCPM-o 4.5（2 月）。語音合成 VoxCPM 也屬同一個組織，本篇只在矩陣帶過。

怎麼解讀文中的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。

## 家族定位與版本矩陣

MiniCPM 的共同點是「端側優先」：每個模型都附 GGUF、MLX 或 int4 等量化版，並提供 llama.cpp、Ollama、vLLM、SGLang 的部署說明。權重放在 Hugging Face 的 [`openbmb` 組織](https://huggingface.co/openbmb)。

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式 |
|---|---|---|---|
| MiniCPM5-2B（`openbmb/MiniCPM5-2B`） | 文字主力 | 約 2.5B 稠密、標準 Llama 架構、131K context；同一個權重可切思考／不思考；原生工具呼叫 | 權重（Apache 2.0）＋面壁開放平台 API |
| MiniCPM5-1B | 更小的文字模型 | 約 1.08B、131K context，同一套訓練流程 | 權重＋API |
| MiniCPM-V 4.7 35B-A3B | 多模態旗艦 | MiniCPM-V 第一個 MoE（35B 總參數、約 3B 啟用）；圖片、多圖、影片；官方說 iPhone 17 Pro Max 上 3GB 記憶體可跑 13 tokens/s 以上 | 權重＋API（目前限時免費） |
| MiniCPM-V 4.7 1B | 手機級多模態 | 1B 等級，視覺 token 可選 4 倍或 16 倍壓縮 | 權重＋API（目前限時免費） |
| MiniCPM-OCR 1.0／OCR Jev | 文件解析與結果驗證 | 1.3B 解析模型＋2B 的「OCR 結果對不對」評分模型 | 權重＋API＋SDK |
| MiniCPM-o 4.5 | 全雙工語音視訊互動 | 9B，同時收影音串流、輸出語音與文字 | 權重＋API |
| VoxCPM2 | 語音合成 | 2B、30 種語言、聲音設計與複製 | 權重＋API，見[語音與音訊模型](/posts/tech/2026-08-26-ai-model-family-speech-audio) |

兩件要先知道的事：

- **文字線與多模態線的底座不同。** [MiniCPM5-2B](https://huggingface.co/openbmb/MiniCPM5-2B) 是面壁自己預訓練的 `LlamaForCausalLM`；[MiniCPM-V 4.7](https://huggingface.co/openbmb/MiniCPM-V-4.7-35B-A3B) 的模型卡則寫明語言骨幹來自 Qwen3.5／Qwen3.6、視覺模組是 SigLIP2，OCR 1.0 與 OCR Jev 也建在 Qwen3.5 上。多模態線的語言能力因此跟 Qwen 的世代綁在一起。
- **沒有 OpenRouter。** OpenRouter 的模型清單裡沒有任何 MiniCPM 條目；託管 API 只有面壁自己的[開放平台](https://platform.modelbest.cn/console/docs/models)，絕大多數使用者是下載權重自架。

## 家族演化

| 版本 | 發佈 | 改變了什麼選型 | 站上紀錄 |
|---|---|---|---|
| MiniCPM-2B | 2024-02 | 第一代，主打 2B 參數做到接近 Mistral-7B 的公開評測分數 | — |
| MiniCPM-Llama3-V 2.5／MiniCPM-V 2.6 | 2024-05／2024-08 | 多模態線成形，8B 等級可在手機跑；V 2.6 至今是 Ollama 下載最多的 MiniCPM | — |
| MiniCPM3-4B | 2024-09 | 文字線擴到 4B | — |
| MiniCPM-o 2.6 | 2025-01 | 第一個「o」：加上語音輸入輸出 | — |
| MiniCPM4／4.1 | 2025-06／2025-09 | 8B 與 0.5B，主打端側晶片上 5 倍以上的生成加速；4.1 加入可訓練稀疏注意力與混合推理 | — |
| MiniCPM-V 4.0 | 2025-07 | 4B 多模態，語言骨幹用自家 MiniCPM4-3B | — |
| MiniCPM-V 4.5 | 2025-08 | 8B 多模態，語言骨幹改用 Qwen3-8B，強調高影格率影片理解 | — |
| MiniCPM-o 4.5 | 2026-02 | 9B 全雙工，可以邊看、邊聽、主動說話；成為車機合作的主力模型 | — |
| MiniCPM-SALA | 2026-02 | 稀疏＋線性混合注意力的 1M context 實驗模型，消費級 GPU 可跑百萬 token | — |
| VoxCPM2 | 2026-04 | 語音合成擴到 2B、30 種語言 | — |
| MiniCPM-V 4.6 | 2026-05 | Qwen3.5-0.8B 骨幹加 SigLIP2，約 1.3B，6GB 記憶體手機可跑 | — |
| MiniCPM5-1B | 2026-05 | 新一代文字線，同一權重切換思考模式 | — |
| MiniCPM5-2B | 2026-09 | 1B 的放大版，第三方評測拿到 4B 以下最高分 | [模型卡](/posts/daily/2026-09-08-model-openbmb-minicpm5-2b) |
| MiniCPM-V 4.7 | 2026-10 | 第一個 MoE 多模態（35B-A3B）與 1B 版；手機上跑 35B 總參數 | — |
| MiniCPM-OCR 1.0／Jev | 2026-10 | 從通用多模態拆出專門的文件解析與結果驗證 | — |

兩年下來的主軸有兩條。一是產品線越拆越細：從單一的文字模型，分出視覺（V）、全模態（o）、OCR、語音、機器人（MiniCPM-Robot）。二是多模態線的語言骨幹在自家與外部模型之間換過幾次（V 4.0 用自家 MiniCPM4-3B，V 4.5 起改用 Qwen3 系列），面壁把力氣放在視覺壓縮與端側推論，讓模型在裝置上跑得動。舊世代的完整評測不在本篇並列；MiniCPM5-2B 發佈當時的第三方分數保留在[模型卡](/posts/daily/2026-09-08-model-openbmb-minicpm5-2b)。

## 架構與訓練取捨

### MiniCPM5：架構保守，力氣放在資料與後訓練

[MiniCPM5-2B 模型卡](https://huggingface.co/openbmb/MiniCPM5-2B)的規格很樸素：標準 `LlamaForCausalLM`、42 層、GQA（16 個 Q 頭、2 個 KV 頭）、2,516,756,480 參數、131,072 token context。選標準架構的好處是相容性：llama.cpp、Ollama、LM Studio、MLX、Google 的 LiteRT-LM 都能直接跑，不用等各家推論框架支援新運算子。代價是架構本身沒有省 KV cache 的設計，長 context 的記憶體要自己算。

差異集中在資料與後訓練，而且大部分資料集都公開：

- **分級資料管理**：預訓練與中段訓練語料依品質分級（[UltraData 論文](https://arxiv.org/abs/2602.09003)），網頁、程式碼、數學資料集以 Ultra-FineWeb、UltraData-Code、UltraData-Math 等名稱釋出。
- **400B tokens 的深度思考 SFT**，再針對數學、程式、agent、寫作等領域分別訓練 RL 老師模型。
- **OPD 合併**：16 個 RL 專家模型（其中 5 個是 agentic）用 on-policy distillation 併回一個發布模型，每個位置以全詞表反向 KL 當優勢估計。官方說 RL＋OPD 讓推理類平均加 10.96 分、agentic 類加 6.96 分。
- **agent 資料公開**：50 萬筆 agent SFT 樣本（UltraData-SFT-Agent-2609）與 8 萬多筆 RL 樣本（UltraData-RL-2609）。

對想自己微調的團隊，這代表 Base、Midtrain、SFT、最終版四個階段的權重都拿得到，可以從任一階段接手。

### MiniCPM-V 4.7：把 35B MoE 塞進手機

MoE 在雲端省算力，在手機上卻有個麻煩：每個 token 可能選到不同專家，記憶體放不下全部專家權重，臨時從儲存空間載入又會卡住生成。[MiniCPM-V 4.7 模型卡](https://huggingface.co/openbmb/MiniCPM-V-4.7-35B-A3B)用三件事處理：

- **LES**：跨層預測下一層會用到哪些專家，先預載；實際仍照原本路由計算，猜錯的專家照常載入。官方在 [GitHub](https://github.com/OpenBMB/MiniCPM-o) 說實機加速約 5 倍。
- **逐層細粒度量化**：壓縮專家權重，減少每次載入的資料量。
- **DSpark 投機解碼**：附帶獨立的草稿模型，跟專家排程與量化一起運作。

結果是官方宣稱的 iPhone 17 Pro Max 上 3GB 記憶體、每秒 13 個 token 以上。視覺端沿用 [LLaVA-UHD v4](https://github.com/THUMAI-Lab/LLaVA-UHD-v4) 的 ViT 內提前壓縮，並讓開發者每次請求選 4 倍（細節多）或 16 倍（省 token）壓縮。代價是：裝置上的速度仰賴面壁自家的 [llama.cpp-omni](https://github.com/OpenBMB/llama.cpp-omni) 分支與 App，一般 llama.cpp 或 Ollama 不一定有同樣的專家排程。

### MiniCPM-OCR：兩階段管線加一個「驗算」模型

[MiniCPM-OCR 1.0](https://huggingface.co/openbmb/MiniCPM-OCR-1.0) 不是端到端看整頁：先用 PaddlePaddle 的 PP-DocLayoutV3 切出版面區塊與閱讀順序，再把每個區塊送給 1.3B 的辨識模型。另一個 [MiniCPM-OCR Jev](https://huggingface.co/openbmb/MiniCPM-OCR-Jev) 是把 Qwen3.5-2B 的輸出頭換成二元分類頭，輸入區塊原圖與候選文字，輸出 0 到 1 的「這段辨識正確」分數，用來決定哪些區塊自動放行、哪些送人工複核。這個設計把「辨識」和「判斷辨識對不對」拆成兩個模型，代價是部署多一個 PaddlePaddle 環境。

### MiniCPM-o 4.5：全雙工的代價是尺寸

[MiniCPM-o 4.5](https://huggingface.co/openbmb/MiniCPM-o-4_5) 由 SigLIP2、Whisper-medium、CosyVoice2 與 Qwen3-8B 串成約 9B，把所有輸入輸出串流以毫秒對齊，每秒判斷一次要不要主動開口。它能做到「使用者還沒說完就判斷時機」，但 9B 對現有車機晶片偏大；面壁共同創辦人在[中國經濟網的訪問](http://m.ce.cn/bwzg/202604/t20260428_2935371.shtml)也說，要到下一代座艙晶片才有足夠空間部署。

## 評測與競品比較

### 第三方：Artificial Analysis

[Artificial Analysis 2026 年 9 月的評測文](https://artificialanalysis.ai/articles/openbmb-releases-minicpm5-2b)給 MiniCPM5-2B 在 Intelligence Index v4.2 的 15 分，是 4B 以下開放權重模型最高，第二名 Granite 4.2 3B 為 11 分。細項：

- **agent 任務是強項**：GDPval-AA v2 Elo 831，在 4B 以下領先；τ³-Bench Banking 21%，與 Ling 3.0 Tiny 並列第一。
- **知識、終端 coding 與科學推理是弱項**：Humanity's Last Exam 9%、Terminal-Bench v2.1 9%、CritPt 0%。
- **不知道就不答**：AA-Omniscience 只回答 29% 的題目，非幻覺率 78%；準確率 8% 本身不高。
- **省 token**：每個指數任務平均 19k 輸出 token，其中 11k 是推理。

要注意版本：Artificial Analysis 目前的 v5.0.1 [模型頁](https://artificialanalysis.ai/models/minicpm5-2b)沒有列出 MiniCPM5-2B 的指數分數，15 分是 v4.2 的結果，不能跟 v5 的分數直接比。MiniCPM-V 4.7、OCR 1.0 與 o 4.5 目前沒有 Artificial Analysis 分數。

### 官方自報：MiniCPM5-2B 對上同級小模型

以下摘自 [MiniCPM5-2B 模型卡](https://huggingface.co/openbmb/MiniCPM5-2B)。標 † 的是模型卡引用 Artificial Analysis 的數字，其餘是面壁內部重跑：

| Benchmark | MiniCPM5-2B | LFM2.5-2.6B | Qwen3.5-2B | Gemma-4-E2B-it | Qwen3.5-4B（參考） |
|---|---|---|---|---|---|
| 全表平均 | 53.9 | 33.2 | 28.0 | 24.6 | 51.1 |
| LiveCodeBench v6 | 69.1 | 42.1 | 20.2 | 42.9 | 56.4 |
| AIME 2026 | 86.5 | 45.2 | 29.0 | 39.8 | 82.7 |
| IFEval | 86.7 | 93.4 | 77.5 | 31.4 | 90.2 |
| MMLU-Pro | 70.8 | 65.2 | 64.3 | 56.0 | 78.0 |
| AA-LCR † | 59.0 | 5.3 | 28.7 | 17.0 | 61.0 |
| BFCL v4 | 66.6 | 61.1 | 43.6 | 36.6 | 56.8 |
| SWE-bench Verified | 46.4 | 6.0 | 5.0 | 2.0 | 33.6 |
| Terminal-Bench v2.1 † | 8.6 | 4.5 | 3.0 | 0.4 | 25.8 |
| GAIA（Text-103） | 88.7 | 49.5 | 47.9 | 30.1 | 78.6 |

讀法：

- **數學、程式與 agent 題目大幅領先同級。** SWE-bench Verified 46.4 甚至高過參考欄的 Qwen3.5-4B，但這是自報、尚無第三方重跑。
- **指令遵循與知識不是第一。** IFEval 輸給 LFM2.5-2.6B，MMLU-Pro 與 Terminal-Bench v2.1 落後 Qwen3.5-4B 一截，跟 Artificial Analysis 的結論一致。
- **跨廠商表格數字不一定一致。** 站內[韓國模型篇](/posts/tech/2026-11-23-ai-model-family-korea-models)引用的 Raon-1 官方表把 MiniCPM5 2B 的 BFCL v4 寫成 61.0，面壁自己的表是 66.6；引用時要寫明是哪一家的表。

### 官方自報：MiniCPM-V 4.7 35B-A3B

[MiniCPM-V 4.7 模型卡](https://huggingface.co/openbmb/MiniCPM-V-4.7-35B-A3B)的對照表全部是 instruct 模式，數字混合「對方公開報告」與「面壁本地重跑」，沒有逐格標示。MiniCPM-V 4.7 用 4 倍視覺壓縮：

| Benchmark | MiniCPM-V 4.7 35B-A3B | Qwen3.6 35B-A3B | Qwen3.6 27B | Gemma-4 31B |
|---|---|---|---|---|
| MMBench | 91.72 | 86.76 | 85.11 | 89.63 |
| OCRBench v2 | 68.47 | 66.50 | 65.49 | 54.14 |
| OmniDocBench v1.6 | 94.24 | 80.17 | 82.14 | 79.17 |
| CharXiv（推理） | 75.60 | 67.50 | 68.50 | 65.00 |
| Video-MME（無字幕） | 76.40 | 75.70 | 70.20 | 74.10 |
| ScreenSpot | 86.99 | 92.94 | 90.73 | 83.75 |
| MMLU-Pro（純文字） | 83.45 | 84.11 | 84.52 | 84.43 |
| LiveCodeBench v6（純文字） | 56.57 | 54.29 | 59.05 | 71.24 |
| τ²-Bench（純文字） | 84.65 | 79.65 | 79.70 | 67.35 |

讀法：文件、圖表與 OCR 是最大的差距來源，OmniDocBench 比同骨幹的 Qwen3.6 35B-A3B 高 14 分；GUI 定位（ScreenSpot）反而輸給 Qwen；純文字能力大致跟骨幹打平。官方另畫了一張「分數對推論時間」圖，說 35B-A3B 在 instruct 模式比 Qwen3.6 35B-A3B 分數高、時間短，1B 版明顯勝過 Qwen3.5 0.8B。

### MiniCPM-OCR

官方自報 [MiniCPM-OCR 1.0](https://huggingface.co/openbmb/MiniCPM-OCR-1.0) 在真實拍攝文件的 Real5-OmniDocBench 拿 93.68、OCRBench v2 54.7；RTX 5090 上單頁並行度 1 時每秒 1.2 頁，約是 PaddleOCR-VL-1.6 的 1.49 倍、MinerU2.5 Pro 的 3.62 倍。[OCR Jev](https://huggingface.co/openbmb/MiniCPM-OCR-Jev) 在自建的 JevOCRBench 上判斷正確與否的 AUROC 為 93.6，接近 Qwen3.5-397B-A17B 的 93.8。兩者都是自建或自報條件，換文件類型前要用自己的樣本重測。

## 授權、價格與部署

### 授權：全線 Apache 2.0，沒有附加條款

目前在架的 MiniCPM5、MiniCPM-V 4.7、MiniCPM-OCR、MiniCPM-o 4.5 與 VoxCPM2，Hugging Face metadata 都標 `apache-2.0`。HF repo 本身沒有 LICENSE 檔，模型卡的 License 節連到 GitHub 上的 [MiniCPM](https://github.com/OpenBMB/MiniCPM/blob/main/LICENSE)、[MiniCPM-V](https://github.com/OpenBMB/MiniCPM-V/blob/main/LICENSE)、[MiniCPM-OCR](https://github.com/OpenBMB/MiniCPM-OCR/blob/main/LICENSE) 等 repo，全文是標準 Apache 2.0，沒有營收門檻、月活門檻或地區限制。比較早期的 MiniCPM-V 2.6 等舊權重沒有標 license 欄位，要用舊版前得另外確認條款。

多模態線的語言骨幹來自 Qwen3.5／3.6，面壁以 Apache 2.0 發布整個權重；若法務要追到上游，需另外核對 Qwen 對應版本的授權。

### API：面壁開放平台，以積分計價

[面壁開放平台](https://platform.modelbest.cn/console/docs/models)提供 OpenAI 相容的 `https://api.modelbest.cn/v1`，價格以「積分／百萬 token」標示：

| 模型 | 輸入 | 輸出 | 備註 |
|---|---|---|---|
| MiniCPM5-2B | 0.15 | 0.3 | 128K context |
| MiniCPM5-1B | 0.1 | 0.2 | 128K context |
| MiniCPM-V 4.7 35B-A3B／1B | 限時免費 | 限時免費 | 256K context |
| MiniCPM-OCR 1.0／Jev | 限時免費 | 限時免費 | |
| MiniCPM-o 4.5 Realtime | 3 | 9 | 即時語音視訊 |
| VoxCPM2 | 1 | 8 | |

平台文件沒有寫積分與貨幣的換算比例，預設每分鐘 30 個請求；正式採用前要在控制台確認實際扣款。這個平台適合試用與比對，不是 MiniCPM 的主要使用方式。

### 自架與端側

- **文字線**：MiniCPM5 官方 GitHub 提供 vLLM、SGLang、llama.cpp、Ollama、LM Studio、MLX、LiteRT-LM（Android／iOS）、vLLM Ascend 的部署說明，每一種都附 agent 可直接讀的 Skill 檔。工具呼叫建議用 SGLang 的 `minicpm5` parser。
- **國產晶片**：模型卡列出 FlagOS 對 NVIDIA、海光、沐曦、天數智芯、摩爾線程、崑崙芯、昇騰、Arm v9 等平台的版本。
- **多模態線**：MiniCPM-V 4.7 支援 iOS、Android、HarmonyOS，首發即支援 Rockchip、後摩、Intel、AMD、Arm 晶片；Intel 平台有 OpenVINO 版本。

### 採用程度

Hugging Face 的下載數是近 30 天（2026-11-23 抓取），只算語言與多模態線：

| 產品線 | HF 30 天下載（全部變體） | 衍生模型（以主模型為 base_model，不含 openbmb 自家） | Ollama 下載 |
|---|---|---|---|
| MiniCPM-V 4.7 | 約 275 萬 | 35B-A3B 83、1B 79 | 7,605（openbmb/minicpm-v4.7） |
| MiniCPM5 | 約 236 萬 | 2B 284、1B 242 | 16.3K（minicpm5-2b）＋13.2K（minicpm5） |
| MiniCPM-OCR | 約 64 萬 | 15 | 1,616 |
| MiniCPM-V 4.6 | 約 35 萬 | 54 | 106.1K（官方庫 minicpm-v4.6） |
| MiniCPM-o 4.5 | 約 30 萬 | 24 | 10.2K |

Ollama 上累積最多的反而是舊版：官方庫的 `minicpm-v`（8B，V 2.6 世代）有 580 萬次下載。HF 的 MiniCPM5-2B 衍生模型多半是社群量化版與去審查版（Ollama 上也看得到 abliterated、heretic 這類名稱）。

裝置端的落地案例來自面壁與媒體：

- **車機**：[新華網報導](https://www.news.cn/auto/20260719/bcf02346528a4cf0873587c164e8fa7e/c.html)面壁 7 月在 WAIC 的發表：MiniCPM 已搭載於吉利銀河 M9、長安馬自達 EZ-60 的座艙，同場公布的開源累計下載超過 3,800 萬次（公司數字，統計到 2026-06-30）。[中國經濟網](http://m.ce.cn/bwzg/202604/t20260428_2935371.shtml)列出已定點的車企：吉利、上汽大眾、廣汽、長城、長安馬自達，EZ-60 是第一個量產車型。
- **手機**：[面壁官網](https://modelbest.cn/)說 MiniCPM 是三星 Galaxy AI 在中國完成生成式 AI 備案時的端側模型提供方；三星沒有公開說明用在哪些機型、哪些功能，[KrASIA](https://kr-asia.com/modelbests-on-device-ai-model-is-coming-to-samsung-smartphones) 等報導也指出細節未揭露。
- **晶片與 Tier 1**：面壁在北京車展與安波福、梧桐科技簽合作，主推 MiniCPM-o 4.5 進座艙 AI Box。

## Agent 使用與選型

- **手機或 PC 上的本地 agent、工具呼叫** → MiniCPM5-2B。4B 以下工具呼叫與 agent 任務分數最高，131K context、Apache 2.0；搭 SGLang 的 `minicpm5` parser 拿到 OpenAI 格式的 `tool_calls`。
- **記憶體只有幾 GB、只要基本問答** → MiniCPM5-1B，或直接用 MiniCPM5-2B 的 4-bit 量化版比較品質再決定。
- **裝置上看圖、讀螢幕截圖或影片** → MiniCPM-V 4.7 1B；需要更強且能接受 3GB 以上記憶體與專用推論分支 → 35B-A3B。
- **大量文件轉 Markdown、要知道哪段可能錯** → MiniCPM-OCR 1.0 搭 Jev，用 Jev 的分數設閾值把低信心區塊送人工。
- **語音助理或座艙互動要能插話、主動提醒** → MiniCPM-o 4.5，但要有能放 9B 的硬體。
- **需要大量事實知識、終端操作型 coding agent** → 不要選 MiniCPM5；Terminal-Bench 與 HLE 都明顯落後較大的模型，改用雲端模型或至少 9B 以上的開放權重。
- **一定要走託管 API、要多家供應商備援** → MiniCPM 不適合，OpenRouter 上沒有，只有面壁一家。

最小的選型驗證：拿自己的工具清單跑一輪 MiniCPM5-2B 的思考與不思考模式（`enable_thinking`），比較工具呼叫的格式正確率、完成率與輸出 token 數；再用同一份任務量化成 4-bit 跑在目標裝置上，看速度與品質掉多少。端側模型的瓶頸常在量化後的品質與發熱，不在 benchmark。

## 限制與取捨

- **小模型的知識天花板。** 第三方與官方表都顯示 MiniCPM5-2B 在 HLE、Terminal-Bench、CritPt 偏弱；它的高分集中在工具呼叫與 agent 流程，沒有檢索輔助時不適合單獨當知識來源。
- **評測以自報為主。** MiniCPM-V 4.7、OCR、o 4.5 都沒有第三方整體分數；V 4.7 的對照表沒有逐格標明哪些是重跑、哪些引用。
- **端側速度依賴自家工具鏈。** 35B-A3B 的手機數字建立在 LES 與面壁的 llama.cpp 分支上，換成一般推論框架不一定重現。
- **多模態線依附 Qwen。** V 4.5 之後的語言骨幹是 Qwen3 系列，能力上限與更新節奏都受上游影響。
- **託管通路單一。** 沒有 OpenRouter 或其他第三方託管，API 以積分計價且換算未公開；要 SLA 與多供應商備援的團隊只能自架。
- **部署案例多為公司說法。** 車機與三星的合作來自面壁與媒體報導，搭載的具體模型版本、功能範圍多半沒有公開。

MiniCPM 的策略可以概括成：不追大模型排名，而是把「同樣記憶體下能跑多強的模型」做到極致，再用 Apache 2.0 與完整部署教學換取開發者與車廠、手機廠的採用。對要在裝置上放 agent 的團隊，MiniCPM5-2B 與 MiniCPM-V 4.7 1B 值得排進第一輪測試；需要知識深度或託管服務時，它就不是首選。

## 參考資料

- [openbmb/MiniCPM5-2B — Hugging Face 模型卡（規格、評測表、訓練流程、部署）](https://huggingface.co/openbmb/MiniCPM5-2B)
- [openbmb/MiniCPM5-1B — Hugging Face 模型卡](https://huggingface.co/openbmb/MiniCPM5-1B)
- [openbmb/MiniCPM-V-4.7-35B-A3B — Hugging Face 模型卡](https://huggingface.co/openbmb/MiniCPM-V-4.7-35B-A3B)
- [openbmb/MiniCPM-V-4.7-1B — Hugging Face 模型卡](https://huggingface.co/openbmb/MiniCPM-V-4.7-1B)
- [openbmb/MiniCPM-V-4.6 — Hugging Face 模型卡](https://huggingface.co/openbmb/MiniCPM-V-4.6)
- [openbmb/MiniCPM-OCR-1.0 — Hugging Face 模型卡](https://huggingface.co/openbmb/MiniCPM-OCR-1.0)
- [openbmb/MiniCPM-OCR-Jev — Hugging Face 模型卡](https://huggingface.co/openbmb/MiniCPM-OCR-Jev)
- [openbmb/MiniCPM-o-4_5 — Hugging Face 模型卡](https://huggingface.co/openbmb/MiniCPM-o-4_5)
- [openbmb/MiniCPM-SALA — Hugging Face 模型卡](https://huggingface.co/openbmb/MiniCPM-SALA)
- [openbmb/VoxCPM2 — Hugging Face 模型卡](https://huggingface.co/openbmb/VoxCPM2)
- [OpenBMB/MiniCPM — GitHub（更新紀錄、部署與微調說明、LICENSE）](https://github.com/OpenBMB/MiniCPM)
- [OpenBMB/MiniCPM-o（MiniCPM-V）— GitHub（V 4.7、o 4.5 說明與更新紀錄）](https://github.com/OpenBMB/MiniCPM-o)
- [MiniCPM API Guide — GitHub](https://github.com/OpenBMB/MiniCPM-V/blob/main/docs/api.md)
- [OpenBMB/MiniCPM-OCR — GitHub](https://github.com/OpenBMB/MiniCPM-OCR)
- [OpenBMB/llama.cpp-omni（LES）— GitHub](https://github.com/OpenBMB/llama.cpp-omni)
- [UltraData: Tiered Data Management — arXiv 2602.09003](https://arxiv.org/abs/2602.09003)
- [LLaVA-UHD v4 — GitHub](https://github.com/THUMAI-Lab/LLaVA-UHD-v4)
- [模型列表及價格 — 面壁開放平台（簡體中文）](https://platform.modelbest.cn/console/docs/models)
- [ModelBest 官網](https://modelbest.cn/)
- [OpenBMB releases MiniCPM5-2B — Artificial Analysis](https://artificialanalysis.ai/articles/openbmb-releases-minicpm5-2b)
- [MiniCPM5-2B — Artificial Analysis 模型頁](https://artificialanalysis.ai/models/minicpm5-2b)
- [openbmb — Ollama](https://ollama.com/openbmb)
- [minicpm-v — Ollama 官方庫](https://ollama.com/library/minicpm-v)
- [「智在終端，惠及千行」面壁智能論壇 — 新華網（簡體中文）](https://www.news.cn/auto/20260719/bcf02346528a4cf0873587c164e8fa7e/c.html)
- [面壁智能「上車」背後 — 中國經濟網（簡體中文）](http://m.ce.cn/bwzg/202604/t20260428_2935371.shtml)
- [ModelBest's on-device AI model is coming to Samsung smartphones — KrASIA](https://kr-asia.com/modelbests-on-device-ai-model-is-coming-to-samsung-smartphones)
- [模型卡｜MiniCPM5-2B](/posts/daily/2026-09-08-model-openbmb-minicpm5-2b) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站，系列導讀
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
