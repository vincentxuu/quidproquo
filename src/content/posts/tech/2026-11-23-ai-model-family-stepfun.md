---
title: "StepFun Step（階躍星辰）——Step 5 Preview 用窄深 MoE 做長程 agent，授權從 Apache 2.0 改成自訂條款"
date: 2026-11-23
category: tech
tags: [ai-agent, llm, stepfun, open-source, model-family-stepfun, moe, model-selection]
lang: zh-TW
type: deep-dive
tldr: "階躍星辰（StepFun）目前的旗艦是 Step 5 Preview：600B 總參數、27B 啟用、1M context，9 月上線 API、10 月 15 日釋出權重，授權改成 StepFun Model License 1.0，硬體廠與營收超過 2,000 萬美元的 MaaS 業者要另簽商業授權。Artificial Analysis 現行指數給它 29 分，輸出偏長也偏慢；強項是金融與研究型 agent，長程終端 coding 仍落後閉源前沿。要 Apache 2.0 或低價高吞吐就用 Step 3.7 Flash；語音另有只走 API 的 StepAudio 3。"
description: "StepFun Step 模型家族介紹：Step 5 Preview 與 Step 3.7 Flash 的規格、窄深架構與 Sparse GQA、官方與第三方評測、StepFun Model License 條款、API 與 OpenRouter 價格、StepAudio 3 語音子線、2024→2026 演化時間線與 Agent 選型。"
series:
  name: "AI 模型家族"
  order: 37
draft: false
glossary:
  - term: "Sparse GQA"
    definition: "Step 5 Preview 全注意力層用的稀疏注意力：indexer 先把每 8 個歷史位置壓成一個區塊，每個 KV 組各自挑出最相關的 512 個區塊（約 4,096 個 token），再讀原始 K/V 計算"
  - term: "Gated SWA（Gated Sliding Window Attention）"
    aliases: ["Gated SWA"]
    definition: "加上閘門的滑動視窗注意力，只看最近一段 token；Step 5 Preview 用它和全注意力層以 3:1 交錯，比例沿用 Step 3.5 Flash"
  - term: "MTP-3（3-way Multi-Token Prediction）"
    aliases: ["MTP-3"]
    definition: "一次預測後面 3 個 token 的輔助頭，推論時當投機解碼的草稿，用來提高生成速度"
---

> :globe: [English version](/posts/tech/2026-11-23-ai-model-family-stepfun-en)

階躍星辰（StepFun）是 2023 年在上海成立的中國模型公司，模型都以「Step」命名，產品線橫跨文字、視覺與語音。這篇寫給要評估中國開放權重模型的 Agent 開發者：Step 5 Preview 和 Step 3.7 Flash 各適合什麼任務、跟 GLM、Kimi 和閉源前沿比起來站在哪裡，以及新授權對硬體產品、API 轉售和蒸餾有什麼限制。

2026 年 11 月的局面是：旗艦 Step 5 Preview 在 9 月 20 日上線 API，10 月 15 日釋出權重，名稱仍掛著 Preview。它是 Step 第一個不用 Apache 2.0 的開放權重旗艦，前一代 Step 3.5／3.7 Flash 仍是 Apache 2.0。

怎麼解讀文中的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。

## 家族定位與版本矩陣

以下價格取自 [StepFun 國際站定價頁](https://platform.stepfun.ai/docs/en/guides/pricing/details.md)，每 1M tokens，依序是輸入／輸出／快取命中：

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式與價格 |
|---|---|---|---|
| Step 5 Preview（`stepfun-ai/Step-5-Preview`，API 名 `step-5-preview`） | 目前旗艦，長程 agent | 600B 總參數、27B 啟用；1M context，API 單次輸出上限 64K；API 可輸入文字、圖片、影片 | 開放權重（StepFun Model License 1.0，FP8／BF16／NVFP4）＋API：$1.00／$2.70，快取 $0.10 |
| Step 3.7 Flash（`step-3.7-flash`） | 高頻多模態 agent | 198B（196B 語言主幹＋1.8B 視覺編碼器）、約 11B 啟用；256K；推理強度分 low／medium／high | 開放權重（HF 標 Apache 2.0）＋API：$0.20／$1.15，快取 $0.04 |
| Step 3.5 Flash／Step 3.5 Flash 2603 | 純文字推理 | 196B、11B 啟用；256K；2603 版多了 low 推理模式、提高 token 效率 | 開放權重（Apache 2.0）＋API：$0.10／$0.30，快取 $0.02 |
| StepAudio 3 系列 | 語音 | 全雙工即時對話（Realtime）、TTS、通用音訊與音樂生成、ASR Max | 只有 API，按通話分鐘、字元或音訊時長計價 |

兩個要先知道的事：

- **API 與權重的規格不完全一樣。** [官方文件](https://platform.stepfun.ai/docs/en/guides/models/step-5-preview)寫 API 支援影片輸入、單次最多輸出 64K；[HF 模型卡](https://huggingface.co/stepfun-ai/Step-5-Preview)只列文字與圖片輸入，自架時 1M context 由輸入與輸出共用。Artificial Analysis 和 Vals AI 也只列文字與圖片。
- **快取命中價已調過。** 發佈時的[模型卡](/posts/daily/2026-09-21-model-stepfun-step-5-preview)記的是 $0.05，現行定價頁是 $0.10。

### 子線與生態

HuggingFace 的 [`stepfun-ai` 組織](https://huggingface.co/stepfun-ai)下有 50 多個 repo，除了主線還有：

- **語音**：開放權重的 Step-Audio（2025-02）、Step-Audio-2-mini、推理型 Step-Audio-R1／R1.1、3B 的音訊編輯模型 Step-Audio-EditX；目前的旗艦 StepAudio 3 只走 API。語音模型的跨廠商比較見[語音與音訊總覽](/posts/tech/2026-08-26-ai-model-family-speech-audio)。
- **視覺與 GUI**：Step3-VL-10B、OCR 模型 GOT-OCR2.0、手機 GUI agent GELab-Zero-4B-preview。
- **影像與影片生成**：Step1X-Edit、NextStep-1、Step-Video-T2V 都有開放權重，但 API 上的影像生成已在 2026-10-10 全部停用。
- **數學形式化**：StepFun-Prover、StepFun-Formalizer。

API 有兩個平台：國際站 `platform.stepfun.ai`（`https://api.stepfun.ai/v1`）與中國站 `platform.stepfun.com`（`https://api.stepfun.com/v1`），金鑰不能混用。除了按量計費，StepFun 另有 Step Plan 訂閱與終端 coding agent Step Code。

## 家族演化

| 版本 | 發佈 | 改變了什麼選型 | 站上紀錄 |
|---|---|---|---|
| Step-1／Step-2 | 2024（Step-2 正式版 2024-07） | 閉源 API；Step-2 是兆參數 MoE。這批 API 已在 2026-07-08 停用 | — |
| Step-Audio、Step-Video-T2V | 2025-02 | 第一批開放權重，先從語音（Apache 2.0）和影片（MIT）開始 | — |
| Step3 | 2025-07 | 321B 總參數、38B 啟用的多模態 MoE，以 Apache 2.0 開放；API 版 2026-07-08 停用，官方建議改用 Step 3.7 Flash | — |
| Step 3.5 Flash | 2026-02 | 縮到 196B／11B，加上 MTP-3 與 3:1 滑動視窗，成為低價高吞吐的文字 agent 選項 | — |
| Step 3.7 Flash | 2026-05-29 | 同一個主幹加上原生視覺，不必另接視覺模型；推理強度可調三檔 | — |
| StepAudio 3 系列 | 2026-09（技術報告） | 全雙工即時語音與統一音訊生成，只提供 API | — |
| Step 5 Preview | 2026-09-20（API）／10-15（權重） | 旗艦重回大模型路線，context 到 1M；權重授權改為 StepFun Model License | [模型卡](/posts/daily/2026-09-21-model-stepfun-step-5-preview) |

兩年內的主軸是從閉源 API 公司轉成開放權重公司：2025 年起幾乎每條產品線都放權重，Step 3.x 全用 Apache 2.0。Step 5 Preview 是第一個例外，權重照樣開放，但條款多了署名、硬體與 MaaS 三道門檻。

## 架構與訓練取捨

### Step 5 Preview：窄而深

StepFun 在[架構部落格](https://platform.stepfun.com/blog/inside-step-5-preview)說明了設計理由。agent 任務的工具呼叫多、prefill 長，模型沒有多少機會寫出完整的推理鏈，只能在 prefill 時靠層數做隱式的多跳推理。層數不夠，長 prefill 時就會「用完層數」。所以 Step 5 Preview 選擇直接加深，而不是加寬：

- **92 個 Transformer block。** 官方說深度和 Kimi K3、Qwen3.8-Max 相當，總參數不到它們的四分之一，啟用參數不到三分之一。[config.json](https://huggingface.co/stepfun-ai/Step-5-Preview/blob/main/config.json) 的隱藏維度只有 4,096。
- **3:1 交錯注意力。** 每 3 層 Gated SWA（視窗 512）配 1 層全注意力，沿用 Step 3.5 Flash。官方試過多種線性注意力，認為差距很小，而 SWA 更容易配合投機解碼。
- **Sparse GQA。** 全注意力層用 GQA 加稀疏索引，參考 DeepSeek 的 DSA，但先把每 8 個歷史位置壓成一個區塊，再挑 512 個區塊（約 4,096 個 token）。官方的數字是 indexer 與 top-k 的成本降為 1/8，token 覆蓋率 78.06%，接近逐 token 挑 2,048 個的 79.09%。
- **MoE**：config 寫 352 個路由專家、每 token 選 8 個，加共用專家；另有 3 層 MTP 頭。

加深的代價是訓練不穩。官方遇到數值爆炸與梯度尖峰，解法是三項：隱藏狀態與梯度改用 FP32、RMSNorm 的縮放參數改用 FP32，以及只裁掉每層約 0.00004% 最大梯度的細粒度裁切。

強化學習的重點是長 rollout。官方把訓練與推論兩側做到逐位元一致（額外開銷不到 10%），把上下文壓縮當成策略的一部分端到端訓練，並把樣本遺失率壓到 1% 以下。rollout 推論的加速方面，MTP-3 約帶來 30% 的端到端加速，原生 FP8 MoE 再約 20%。

自架門檻：[模型卡](https://huggingface.co/stepfun-ai/Step-5-Preview)的 FP8 版要 4 張 B300 或 8 張 H200，BF16 版要 8 張 B300 或兩台 8 卡 H200。官方提供 vLLM（`vllm/vllm-openai:step-5-preview`）與 SGLang（`lmsysorg/sglang:step-5-preview`）映像檔，也註明 BF16 的 Transformers 分片流程還沒有端到端驗證過。

### Step 3.7 Flash：小主幹加視覺

[Step 3.7 Flash 模型卡](https://huggingface.co/stepfun-ai/Step-3.7-Flash)是 Step 3.5 Flash 的 196B 主幹（45 層、288 個專家選 8 個）加 1.8B 視覺編碼器，每 token 約啟用 11B，官方標最高每秒 400 token。它的價值在部署彈性：除了資料中心，官方也列出 128GB 統一記憶體的 Mac、DGX Station 與 Ryzen AI Max+ 395 這類工作站可以跑，並支援 vLLM、SGLang、Transformers 與 llama.cpp。

## 評測與競品比較

### 第三方：Artificial Analysis

[Artificial Analysis](https://artificialanalysis.ai/models/step-5) 的 Intelligence Index v5.0.1 給 Step 5 Preview 29 分（推理設定），高於同尺寸開放權重模型的中位數 23。它也標出兩個成本面的問題：跑完整套指數輸出 1.29 億 token，中位數約 1.04 億；每題平均 22.3 分鐘，中位數 14.3 分鐘，屬於明顯偏慢。每題成本 $2.35。

StepFun 發佈頁與當時的模型卡寫的是 44 分，那是發佈當時的指數版本；指數改版後題組不同，兩個分數不能互比。Step 3.7 Flash 在現行版本還沒有分數。

### 第三方：Vals AI

[Vals AI](https://www.vals.ai/models/stepfun_step-5-preview) 的 Vals Index 給 Step 5 Preview 54.76%，43 個模型中排第 29；Finance Index 55.43%（46 個中第 34）。Vals 自己跑的 Terminal-Bench 4.0 是 31.82%，略低於 StepFun 自報的 33.3%。

### 官方自報：Step 5 Preview 對上 GLM、Kimi 與閉源前沿

以下摘自 [Step 5 Preview 發佈頁](https://www.stepfun.com/step-5-preview)，全部是 StepFun 公布的數字。Step 5 Preview 用 High 推理，其他模型用 Max；DeepSWE 用 SWE-agent harness。對照組是發佈當時的版本，不是 Kimi K3.1 Pro、Claude Opus 5.5 這些之後的新版：

| Benchmark | Step 5 Preview | GLM-5.3 | Kimi K3 | GPT-6 Astra | Claude Opus 5 |
|---|---|---|---|---|---|
| DeepSWE v1.1 | 67.7 | 66.9 | 67.5 | 74.1 | 74.0 |
| Terminal-Bench v4 | 33.3 | 41.9 | 12.6 | 57.9 | 52.3 |
| SWE-Marathon v1.1（部分分數） | 72.7 | 67.4 | 84.4 | 77.3 | 85.6 |
| GDPval-AA v2.1（Elo） | 1566 | 1645 | 1524 | 1542 | 1708 |
| AutomationBench-AA | 51.0 | 62.2 | 58.3 | 68.5 | 56.6 |
| BrowseComp | 88.7 | — | 91.2 | 91.5 | 90.2 |
| FrontierFinance | 66.4 | 64.1 | 62.6 | 55.0 | 69.7 |
| AA-LCR v1.1 | 88.3 | 79.7 | 88.7 | 80.7 | 79.3 |
| MMMU-Pro | 76.0 | 純文字 | 81.0 | 87.0 | 85.0 |

讀法：

- **長程終端 coding 是弱項。** DeepSWE 跟 GLM、Kimi 打平，但 Terminal-Bench v4 與 SWE-Marathon 都明顯落後閉源前沿。官方在 StepCodeBench 的說明也承認，最難的長任務跟前沿還有明顯差距。
- **金融與長文件是強項。** FrontierFinance 只輸 Claude Opus 5，AA-LCR 長文推理接近表內最高；官方自建的三組 FinStepBench 也是同樣的走勢，但都是自建基準。
- **工作型 agent 沒有領先。** GDPval-AA 與 AutomationBench-AA 都低於 GLM-5.3，這兩項是 Artificial Analysis 的題組。

自建基準要另外看待：StepCodeBench（553 個 repo、9 類任務、33 種語言）49.0%，對照 Claude Opus 5 的 63.9%；FinStepBench 三組也是 StepFun 自己出題。發佈頁另有兩個 24 小時長任務案例：在 H100 上把 MLA kernel 優化到 508 TFLOPS（Claude Opus 5 為 493），以及把 Qwen3-30B-A3B 的 AIME24 從 53.3% 自動後訓練到 60%。這些是單一案例，不是可重跑的基準。

### Step 3.7 Flash

[Step 3.7 Flash 模型卡](https://huggingface.co/stepfun-ai/Step-3.7-Flash)與[官方部落格](https://static.stepfun.com/blog/step-3.7-flash/)的數字全是自報：SWE-Bench Pro 56.3（Step 3.5 Flash 51.3）、Terminal-Bench 2.1 59.5、ClawEval-1.1 67.1、Toolathlon 49.5、GDPval-AA 45.8、SimpleVQA（搭配搜尋）79.2。官方自己也寫 Terminal-Bench 與 GDPval 是待加強的項目。

### StepAudio 3

[StepAudio 3 Realtime 技術報告](https://arxiv.org/abs/2609.14005)自報 MMSU 90.6、Artificial Analysis Full-Duplex Bench 98.9、τ-Voice 任務成功率 56.0%；[ASR Max](https://platform.stepfun.ai/docs/en/guides/models/stepaudio-3-asr) 自報的脈絡推理錯誤率是 0.57%（上一代 1.59%）。第三方的 TTS 排名見[語音與音訊總覽](/posts/tech/2026-08-26-ai-model-family-speech-audio)。

## 授權、價格與部署

### StepFun Model License 1.0：三道門檻

[Step 5 Preview 的 LICENSE](https://huggingface.co/stepfun-ai/Step-5-Preview/blob/main/LICENSE.txt) 是 StepFun 自訂的授權，模型卡稱它為「Apache-2.0 風格」。基本授權很寬：永久、全球、免費，可以商用、修改、再散布，也附專利授權。差別在第 2 條：

| 情境 | 條件 |
|---|---|
| 一般商用、微調、再散布 | 附授權全文、保留聲明、標示修改、附模型卡或連結 |
| 任一曆月月活超過 1 億，或月營收超過 2,000 萬美元的商用產品 | 在介面（含「關於」頁）與使用者協議顯著標示「Powered by StepFun AI」 |
| 硬體裝置的製造商或品牌（手機、汽車、智慧眼鏡、穿戴、機器人、智慧家庭），把模型能力當成裝置功能商用 | 先與 StepFun 簽商業授權，**沒有規模門檻** |
| 經營 MaaS，且集團任 12 個月營收超過 2,000 萬美元 | 任何商用都要先簽商業授權 |
| 純內部使用、或經 StepFun 認證的散布通路 | 不受上兩列限制 |

另外兩個容易漏看的條款：

- **蒸餾算衍生作品。** 「以本模型輸出為主要材料訓練出的模型」視為衍生作品，要遵守同一份授權。
- **MaaS 的定義看控制權。** 第三方對輸入、參數或訓練資料有實質控制才算 MaaS；把能力嵌進一個功能明確的產品、或單純轉送請求到別家模型，都不算。

授權沒有地區排除條款；重大違約會終止授權，30 天內補正可以恢復。上一代 Step 3.5 Flash 與 Step 3.7 Flash 仍是 Apache 2.0，但 Step 3.7 Flash 的 repo 只在 metadata 標 Apache 2.0，沒有放 LICENSE 檔，法務審查時要留意。

### API 價格

- **Step 5 Preview**：$1.00／$2.70，快取命中 $0.10；輸出 token 含推理過程。
- **Step 3.7 Flash**：$0.20／$1.15，快取命中 $0.04。
- **Step 3.5 Flash（含 2603）**：$0.10／$0.30，快取命中 $0.02。
- **OpenRouter**：[Step 5 Preview](https://openrouter.ai/stepfun/step-5-preview) 有 StepFun（FP8、1M context、輸出 64K）與 Featherless（FP4、262K context、輸出 32K）兩家，價格相同；Step 3.7 Flash 由 StepFun 與 Novita 託管。在 [OpenRouter 排行](https://openrouter.ai/rankings)截至 11 月 22 日的「New & Trending」榜，Step 5 Preview 本週 3.23T tokens、週增超過 10 倍，排第 6，但不在週用量前十。
- **語音**：StepAudio 3 的新價格自 2026-11-23 中午（UTC+8）生效。Realtime 每通話分鐘 $0.125（雙方說話時間都算），TTS 每 1M 計費字元 $14（一個中文字算 3 個字元），音樂生成每輸出小時 $2.40 起，ASR Max 每音訊小時 $0.60，複製或設計聲音每個 $1.50。各模型頁上的單價和總表不一致，以[定價總表](https://platform.stepfun.ai/docs/en/guides/pricing/details.md)為準。
- **速率限制**：個人帳號依累計儲值分級，最低一級（累計不到 $15）是 5 個併發、每分鐘 100 次請求、50 萬 TPM。

### 停用與替代

依官方的[停用公告](https://platform.stepfun.ai/docs/en/guides/model-migration.md)：

- **2026-07-08**：`step-1-8k`、`step-1-32k`、`step-1v-8k`、`step-1v-32k`、`step-2-mini`、`step-2-16k`、`step-1o-vision-32k` 停用，建議改 `step-1o-turbo-vision`；`step-3` 停用，建議改 `step-3.7-flash`。
- **2026-10-10**：影像生成與編輯（`step-2x-large`、`step-image-edit-2`）停用，[公告](https://platform.stepfun.ai/docs/en/guides/image-offline-notice.md)沒有給替代模型。

### 自架

Step 5 Preview 的 vLLM 與 SGLang 指令都已帶好 MTP 投機解碼、`step5` 推理解析器與工具呼叫解析器。Step 3.7 Flash 另有 FP8、NVFP4 與 GGUF 版，NVIDIA NIM 也有上架。

## Agent 使用與選型

- **金融研究、長文件分析、深度搜尋類 agent** → Step 5 Preview。FrontierFinance 與 AA-LCR 接近閉源前沿，價格是閉源旗艦的一小部分；但要預期它慢，也要先用自己的任務量幻覺與輸出長度。
- **高頻、要看圖的 agent 或並行 coding agent** → Step 3.7 Flash。輸入價是 Step 5 Preview 的五分之一、輸出價不到一半，也可以在 128GB 記憶體的工作站上自架。
- **主力 coding agent 或終端操作** → Step 5 Preview 不是首選，Terminal-Bench v4 與 SWE-Marathon 落後 Claude Opus 5、GPT-6 Astra。
- **語音客服、車載、陪伴型對話** → StepAudio 3 Realtime，全雙工、邊想邊說，可在對話中呼叫工具；只能走 API，價格按通話分鐘計。
- **要 Apache 2.0** → Step 3.5 Flash（純文字）或 Step 3.7 Flash（文字＋圖片），都是 256K。
- **做手機、汽車、機器人等硬體產品，或通用 API 轉售** → 選 Step 5 Preview 前先依第 2(c) 條判斷要不要簽商業授權；硬體這條沒有規模門檻。
- **想用 Step 5 Preview 的輸出蒸餾自己的模型** → 產出的模型會被視為衍生作品。

接入方式：API 同時提供 OpenAI 相容的 Chat Completions 與 Messages API 格式，推理強度分別用 `reasoning_effort` 和 `output_config.effort` 控制（low／medium／high），支援工具呼叫與 JSON Schema 輸出。官方也列出 Step 3.7 Flash 可以接 Claude Code、KiloCode、OpenClaw 等 harness。工具、搜尋與程式執行由 host 端提供，模型本身不會碰你的本機環境。

最小的選型驗證：把同一組 agent 任務分別送 `step-5-preview` 的 high 與 low，再送 `step-3.7-flash` 的 medium，比較完成率、輸出 token、總耗時與帳單。Artificial Analysis 的資料顯示 Step 5 Preview 每題耗時明顯高於同級，延遲敏感的流程要把時間算進去。

## 限制與取捨

- **慢而且囉嗦。** Artificial Analysis 量到每題 22.3 分鐘（同級中位數 14.3）、輸出 token 比中位數多約兩成五；按 token 計價的優勢會被部分吃掉。
- **長程 coding 落後閉源前沿。** 官方自己的 Terminal-Bench v4、SWE-Marathon 與 StepCodeBench 說明都指向同一件事，Vals AI 量到的 Terminal-Bench 4.0 31.82% 也沒有比自報好。
- **發佈時的分數已經過時。** 44 分是舊版指數，現行版本是 29 分；官方對照表用的也是上一代競品。
- **授權不再是 Apache 2.0。** 硬體產品、大型 MaaS、大型產品署名與蒸餾都有條件，不能沿用「Step 開源＝可任意商用」的印象。
- **還是 Preview。** 名稱沒有正式版，API 與權重的規格也有差異（影片輸入、輸出上限），之後可能變動。
- **子線收縮。** API 上的影像生成已全部停用，語音旗艦只走 API，開放權重的語音模型停在 Step-Audio-R1.1 與 EditX 這一代。

Step 的策略可以概括成：用窄深架構與 1M context 把旗艦做進開放權重第一梯隊，主打金融與研究型 agent，價格放在中段，再用 Flash 線守住低價與寬鬆授權。對外部開發者來說，Step 5 Preview 值得排進金融與長文件 agent 的評測清單；它不是 coding 冠軍，跑得也不快，授權則比 Step 3.x 多了三道門檻。

## 參考資料

- [Step 5 Preview: Advancing the Pareto Frontier — StepFun 官方發佈頁（評測表）](https://www.stepfun.com/step-5-preview)
- [Inside Step 5 Preview: Architecture and Training for Agentic Work — StepFun 官方部落格](https://platform.stepfun.com/blog/inside-step-5-preview)
- [stepfun-ai/Step-5-Preview — HuggingFace 模型卡（規格、部署）](https://huggingface.co/stepfun-ai/Step-5-Preview)
- [StepFun Model License 1.0 — HuggingFace](https://huggingface.co/stepfun-ai/Step-5-Preview/blob/main/LICENSE.txt)
- [Step-5-Preview config.json — HuggingFace](https://huggingface.co/stepfun-ai/Step-5-Preview/blob/main/config.json)
- [Step 5 Preview — StepFun 開放平台文件](https://platform.stepfun.ai/docs/en/guides/models/step-5-preview)
- [Pricing and Rate Limits — StepFun 開放平台](https://platform.stepfun.ai/docs/en/guides/pricing/details.md)
- [Model Overview — StepFun 開放平台](https://platform.stepfun.ai/docs/en/guides/models/overview.md)
- [Model Lifecycle & Deprecations — StepFun 開放平台](https://platform.stepfun.ai/docs/en/guides/model-migration.md)
- [Image Model Retirement Notice — StepFun 開放平台](https://platform.stepfun.ai/docs/en/guides/image-offline-notice.md)
- [stepfun-ai/Step-3.7-Flash — HuggingFace 模型卡](https://huggingface.co/stepfun-ai/Step-3.7-Flash)
- [Step 3.7 Flash — StepFun 官方部落格](https://static.stepfun.com/blog/step-3.7-flash/)
- [stepfun-ai/Step-3.5-Flash — HuggingFace 模型卡](https://huggingface.co/stepfun-ai/Step-3.5-Flash)
- [Step 3.5 Flash 技術報告 — arXiv 2602.10604](https://arxiv.org/abs/2602.10604)
- [stepfun-ai/step3 — HuggingFace 模型卡](https://huggingface.co/stepfun-ai/step3)
- [Step-3 is Large yet Affordable — arXiv 2507.19427](https://arxiv.org/abs/2507.19427)
- [StepAudio 3 Realtime — StepFun 開放平台文件](https://platform.stepfun.ai/docs/en/guides/models/stepaudio-3-realtime.md)
- [StepAudio 3 Realtime Technical Report — arXiv 2609.14005](https://arxiv.org/abs/2609.14005)
- [StepAudio 3 Gen Technical Report — arXiv 2609.12945](https://arxiv.org/abs/2609.12945)
- [StepAudio 3 ASR — StepFun 開放平台文件](https://platform.stepfun.ai/docs/en/guides/models/stepaudio-3-asr)
- [stepfun-ai — HuggingFace 組織頁](https://huggingface.co/stepfun-ai)
- [StepFun: Step 5 Preview — OpenRouter（供應商與價格）](https://openrouter.ai/stepfun/step-5-preview)
- [OpenRouter Rankings](https://openrouter.ai/rankings)
- [Step 5 Preview — Artificial Analysis](https://artificialanalysis.ai/models/step-5)
- [Step 5 Preview — Vals AI](https://www.vals.ai/models/stepfun_step-5-preview)
- [Chinese AI can benefit from bigger models, more data, says start-up founder — South China Morning Post（Yahoo Finance 轉載）](https://finance.yahoo.com/news/chinese-ai-benefit-bigger-models-093000246.html)
- [模型卡｜Step 5 Preview](/posts/daily/2026-09-21-model-stepfun-step-5-preview) — 本站
- [AI 模型家族：語音與音訊](/posts/tech/2026-08-26-ai-model-family-speech-audio) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站，系列導讀
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
