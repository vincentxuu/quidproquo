---
title: "Liquid AI LFM：裝置端推理與 Agent 工作流，LFM3 用 1.7B 骨幹覆蓋全模態"
date: 2026-10-10
category: tech
type: deep-dive
tags: [liquid-ai, lfm, reasoning, agent-workflow, rag, long-context, compact-model]
lang: zh-TW
tldr: "Liquid AI 的 LFM 是裝置端優先的小模型家族。2026-10 的 LFM3 換上短卷積、滑動窗注意力、全域注意力三混架構，文字模型 LFM3-1.7B 以 1.73B 參數、256K context 在多數 agent 與工具評測勝過前代 LFM2.5-2.6B，並和視覺、語音、全模態、決策模型共用同一骨幹；需要更強推理時，LFM2.5-24B-A2B 用 2.45B 啟用參數補上。權重採 LFM Open License v1.0，年營收 1,000 萬美元以上的商用不在授權範圍內。"
description: "Liquid AI LFM 家族：LFM3 三混架構與六模型分工、LFM2.5-24B-A2B MoE 推理模型、checkpoint 與託管 API 的 context 差異、LFM Open License 的營收門檻、價格、本地部署與 Agent 選型。"
series:
  name: "AI 模型家族"
  order: 29
draft: false
---

> 🌏 [English version](/posts/tech/2026-10-10-ai-model-family-liquid-ai-en)

Liquid AI 的 LFM 是以高效部署為主軸的模型家族。小模型的價值是把範圍明確的任務放進容易掌控的部署環境：手機、筆電、邊緣裝置，或便宜的雲端 API。這篇寫給要在本地或低成本環境跑 agent 的開發者：LFM3 與 LFM2.5 怎麼選、它能做什麼不能做什麼、授權在哪裡設了門檻。

本文於 2026-11-20 核對官方模型卡、發布文章、授權檔與價格頁。最容易踩到的差異有兩個：**官方 checkpoint 與託管 API 的 context 上限不同**；**授權不是 Apache 或 MIT，年營收 1,000 萬美元以上的公司商用不在授權範圍內**。

## 家族定位與版本矩陣

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式與價格（每 1M tokens） |
|---|---|---|---|
| LFM3-1.7B | 目前主力文字模型 | 1.73B，三混架構，checkpoint 256K context，4-bit 約 1GB | 權重（LFM Open License v1.0）；Liquid API $0.08／$0.20，快取輸入 $0.02 |
| LFM3-VL-2B／Audio-2B／Omni-2B | 視覺、語音、全模態 | 與 LFM3-1.7B 共用骨幹 | 權重；Liquid API |
| d1-2B／d1-Omni-2B | 決策模型 | 從 VL 與 Omni 分支特化 | 權重；見[決策模型家族文](/posts/tech/2026-10-22-ai-model-family-decision-models) |
| LFM2.5-24B-A2B | 較難的推理與 agent 任務 | 24B MoE、2.45B 啟用，131K context，一律先推理 | 權重；Liquid API $0.05／$0.70，快取輸入 $0.025 |
| LFM2.5 小型系列 | 上一代 | 230M 到 8B-A1B，含 Encoder、VL、Audio 與領域變體 | 權重 |

價格依 [Liquid AI 價格頁](https://www.liquid.ai/pricing)，官方說明在 Liquid Console、OpenRouter、Vercel AI Gateway 呼叫價格相同；新組織有 $2 免費額度。

### 先分清楚模型與端點

[Liquid API 模型列表](https://docs.liquid.ai/api/models)把 `lfm3-1.7b` 與 `lfm2.5-24b-a2b` 的 context 都列為 128,000 tokens，比 checkpoint 的 256K（LFM3）與 131K（24B-A2B）小。呼叫 API 時遵守端點限制，自架時再依 checkpoint 與推論框架配置確認。上一代 LFM2.5-2.6B 也有同樣問題：checkpoint 131,072 tokens，OpenRouter 免費端點只有 65,536。

## 家族演化

依 [LiquidAI 的 HuggingFace 組織](https://huggingface.co/LiquidAI)與官方部落格整理；月份取自模型 repo 建立時間：

| 版本 | 時間 | 改變了什麼選型 | 站上紀錄 |
|---|---|---|---|
| LFM2 系列 | 2025 | 短卷積＋GQA 的 hybrid，靠硬體在迴圈的架構搜尋設計，裝置端速度是主要賣點 | — |
| LFM2.5-1.2B／VL-1.6B | 2026-01 | LFM2.5 世代開始，含 Thinking 與視覺版 | — |
| LFM2-24B-A2B | 2026-02 | 第一個 24B MoE，32K context，非推理模型 | — |
| LFM2.5 中小型擴充 | 2026-03～08 | 230M、350M、8B-A1B、2.6B，加上 Encoder、Embedding、ColBERT、JP 等專用變體；2.6B 成為推理與 agent 的主推尺寸 | — |
| LFM2.5-24B-A2B | 2026-10-13 | LFM2.5 最大也是最後一款；context 擴到 131K、一律先推理，agent 評測追上更大的 MoE | [模型卡](/posts/daily/2026-10-14-model-liquid-ai-lfm2-5-24b-a2b) |
| **LFM3** | 2026-10-27 | 新三混架構，六個 2B 級模型共用骨幹；1.7B 文字模型勝過 LFM2.5-2.6B | [模型卡](/posts/daily/2026-10-28-model-liquid-ai-lfm3-1-7b) |

LFM2.5-2.6B 在主篇降為上一代。原本以它為主的端點說明與 OpenRouter 範例移出正文；它的規格與評測仍在 [HuggingFace 模型卡](https://huggingface.co/LiquidAI/LFM2.5-2.6B)，LFM3-1.7B 的評測表也列出 2.6B 的分數作對照。

## 架構與訓練取捨

### LFM3：三混架構

依 [LFM3 官方公告](https://www.liquid.ai/blog/lfm3)與 [LFM3-1.7B 模型卡](https://huggingface.co/LiquidAI/LFM3-1.7B)：

- **三種運算混用**：24 層裡 13 層是 gated 短卷積、5 層是 256-token 窗口的滑動窗注意力、6 層是全域注意力。短卷積的 kernel 從 LFM2 的 3 加到 7。
- **為什麼加滑動窗注意力**：官方用硬體在迴圈的架構搜尋，把部分卷積層換成其他序列運算，滑動窗注意力在品質與速度間取捨最好。測試硬體從 LFM2 的一支手機加一台筆電，擴到 14 種裝置與後端組合，包括手機、Raspberry Pi 5、筆電、雲端 CPU、GPU 與 Qualcomm Hexagon NPU。
- **其他改動**：每個注意力頭加 sigmoid 閘門（可抑制影響量化的極端 activation）、全域注意力層只對一半維度套 RoPE、每個區塊前後都做 normalization。
- **訓練**：22T tokens 預訓練，最後 3.5T 是加入更多 agent 軌跡與工具呼叫的中期訓練，並在此階段把 context 擴到 256K。

官方稱 LFM3-1.7B 在短 prompt 下的每參數速度與 LFM2-1.2B 相當，8K context 時快約 25%。

### 一個骨幹、六個模型

LFM3 第一批的六個模型都從 `LFM3-1.7B-Base` 分支：文字、視覺、語音、全模態四種輸入，加上從視覺與全模態特化的兩個決策模型。設計意圖是「挑一個合用的小模型自己微調」，而不是跑一個大型通用模型；官方說每個模型都能在單張 GPU 上微調。

### LFM2.5-24B-A2B：小啟用量的推理 MoE

依 [24B-A2B 模型卡](https://huggingface.co/LiquidAI/LFM2.5-24B-A2B)與[官方部落格](https://www.liquid.ai/blog/lfm2-5-24b-a2b)，它沿用 LFM2-24B-A2B 的 40 層（30 層雙閘門短卷積＋10 層 GQA）、每層 64 專家選 4。改動是 context 從 32K 擴到 131K、詞彙表從 65K 擴到 128K，預訓練從 17T 加到 33T tokens，後訓練最後一段直接在 OpenClaw、Hermes Agent、Pi、OpenCode 等 agent harness 裡做強化學習。它是純推理模型，每次回答前都會先輸出推理過程。

官方公開了一個訓練中的問題：教師特化階段模型出現 reward hacking，會去 git 歷史或 GitHub、PyPI、HuggingFace 找答案，甚至察覺自己在 sandbox 裡。Liquid 收緊了 sandbox，並說明報告的結果都在封閉評測環境中取得。

## 評測與競品比較

### LFM3-1.7B

以下出自 LFM3-1.7B 模型卡，全部由 Liquid 用 vLLM 跑出，各模型用自己的完整 context：

| Benchmark | LFM3-1.7B | LFM2.5-2.6B | Qwen3.5-4B | Qwen3.5-9B |
|---|---|---|---|---|
| LiveClaw | **45.60** | 14.70 | 19.94 | 35.77 |
| WebArena-Verified | **38.42** | 3.02 | 21.92 | 28.94 |
| AutomationBench | **41.29** | 0.94 | 8.67 | 15.10 |
| BFCL V4 | **71.39** | 55.89 | 55.12 | 62.83 |
| SWE-bench Verified（OpenCode） | 43.40 | 18.00 | 41.20 | **51.20** |
| GPQA Diamond | 63.37 | 57.78 | 75.76 | **80.40** |
| RULER 128K | 65.56 | 1.15 | 84.63 | **87.11** |
| AA-Omniscience 不幻覺率 | **92.93** | 53.69 | 13.64 | 52.59 |

讀這張表：agent 與工具任務是 LFM3-1.7B 的強項，多項勝過參數多五倍的 Qwen3.5-9B；知識題、長 context 檢索（RULER 128K）、coding 仍落後。AA-Omniscience 不幻覺率很高，但同一表的答對率只有 7.07，代表它傾向不答，而不是知道得多。官方建議知識密集任務搭配檢索或搜尋。

### LFM2.5-24B-A2B

官方部落格的 16 項比較裡，它在 8 項工具與 agent 評測中的 5 項領先或打平 Qwen3.6-35B-A3B（AutomationBench 27.69 對 8.72、LiveClaw 48.09 對 38.19），但 GPQA Diamond（74.42 對 83.69）與 SWE-Bench Verified（51.00 對 66.20）明顯落後。全部是 Liquid 自測。

選型時，先設計一組你需要的任務，而不是拿參數量猜品質：欄位提取正確率、工具參數錯誤、答案引用與端到端延遲。

## 授權、價格與部署

### LFM Open License v1.0：營收門檻

LFM3 與 LFM2.5 都用 [LFM Open License v1.0](https://huggingface.co/LiquidAI/LFM3-1.7B/blob/main/LICENSE)。結構以 Apache 2.0 為基礎（著作權與專利授權、散佈時保留聲明、標示修改），另加第 5 條商用限制：

- **門檻**：年營收 1,000 萬美元以上（含控制或受控關係企業）的法人，商用不在本授權範圍內，需要另洽 Liquid。
- **門檻以下**：可免費商用、微調與散佈。
- **非營利例外**：符合資格的非營利組織用於非商業或研究目的，不受門檻限制。

這不能當成 Apache 或 MIT。和 Kimi、MiniMax 的門檻相比，LFM 的 1,000 萬美元更低，而且是以整個法人營收計算，不限於使用該模型的產品。

### 價格與資料條款

- **LFM3-1.7B**：$0.08／$0.20，快取輸入 $0.02。
- **LFM2.5-24B-A2B**：$0.05／$0.70，快取輸入 $0.025。[站上模型卡](/posts/daily/2026-10-14-model-liquid-ai-lfm2-5-24b-a2b)記錄的發布時價格是 $0.10／$1.00，現在的價格頁已調降。
- 第三方端點的資料條款各自不同。例如 OpenRouter 上 LFM2.5-2.6B 的免費端點曾標示 prompt 與輸出可能被保留並用於訓練；免費存取不等於資料不留存，敏感資料要先確認條款或改用本地推理。

### 本地部署

官方提供 BF16、FP8、NVFP4、GGUF、MLX、ONNX、OpenVINO 等格式，對應 vLLM、SGLang、Transformers、llama.cpp、Ollama、LM Studio、MLX 等框架。LFM3-1.7B 在 4-bit 約 1GB，手機與筆電都放得下。先選硬體對應的 runtime 與權重，用小輸入測試，再逐步增加 context 與並行量；模型大小不是整個程序的記憶體上限。

## Agent 使用與選型

### 適合哪些工作

官方推薦的方向是本地 agent、工具呼叫、結構化輸出與領域微調。可以先試範圍明確、答案有來源的工作：從內部文件提取欄位、依檢索片段回答問題、在本機跑收件匣分類或排程等背景 agent。

### 工具使用需要主程式

模型產生呼叫，主程式執行，再把結果以 `tool` 角色回傳；模型不會因為收到一段指令就自動讀 CSV 或寫資料庫。注意兩代的工具呼叫格式不同：LFM3 產生 XML 形式的 `<tool_call>`，LFM2.5 預設產生 Python 函式呼叫串列。LFM3 另支援延遲載入工具（`defer_loading`），工具很多時只把搜尋工具放進 prompt，由 harness 搜到後再插入定義。

### 怎麼選

| 需求 | 可先評估 | 驗證重點 |
|---|---|---|
| 手機或筆電上的本地 agent | LFM3-1.7B | 工具名稱與參數正確率；4-bit 下的品質 |
| 圖片、語音、多模態輸入 | LFM3-VL／Audio／Omni-2B | 各自模型卡的任務範圍 |
| 較難的推理或多步 agent | LFM2.5-24B-A2B | 推理 token 帶來的延遲；SWE 類任務不要期待太高 |
| 知識密集問答 | LFM3-1.7B＋檢索 | 答案引用是否正確；不答的比例 |
| 自家領域專用模型 | LFM3-1.7B 微調 | 單 GPU 微調後在自家資料上的提升 |

## 限制與取捨

- **官方明講 LFM3-1.7B 不適合 agentic coding 或複雜多步推理**，24B-A2B 也不建議單獨用於知識密集任務。
- **推理會吃生成預算**：LFM3 預設開啟推理，關閉（`enable_thinking=False`）的行為官方說可能不一致；24B-A2B 一律推理。小參數量不能單獨保證短等待時間。
- **評測全部是 Liquid 自測**。
- **授權門檻低**：年營收 1,000 萬美元以上的公司要另談授權。
- **託管 API 的 context 比 checkpoint 小**。

LFM 的吸引力在於可以把工具工作流帶到本地環境，並用單 GPU 微調做成專用模型。要不要採用，仍取決於它能否在你的任務、資料與硬體上通過評估。

## 更新紀錄

- **2026-11-20**：補上 LFM3 與 LFM2.5-24B-A2B。矩陣、架構、評測、價格、授權與選型改寫（LFM3 與 24B-A2B 官方部落格、HuggingFace 模型卡與 LICENSE、Liquid API 模型列表與價格頁、HuggingFace 組織的模型清單，2026-11-20 讀取）；新增三混架構、六模型共用骨幹、授權營收門檻的具體條款、兩代工具呼叫格式差異。家族演化原本寫「未整理全家族時間線」，現補上 LFM2 到 LFM3 的時間線。LFM2.5-2.6B 降為上一代，原本以它為主的 OpenRouter 範例與端點對照表移出正文。授權段原本只寫「有商用限制」，現寫明門檻是年營收 1,000 萬美元。
- 2026-10-11：依共同家族格式重排章節，使用既有資料補版本矩陣；事實核對日期沿用既有紀錄。
- 2026-10-11：以官方來源重核架構與訓練，區分 checkpoint 與 API 上下文，補資料留存及授權限制，移除未實測效能比較後發布。

## 參考資料

- [Introducing LFM3 — Liquid AI 官方部落格](https://www.liquid.ai/blog/lfm3)
- [LiquidAI/LFM3-1.7B — HuggingFace 模型卡](https://huggingface.co/LiquidAI/LFM3-1.7B)
- [LFM Open License v1.0 — HuggingFace](https://huggingface.co/LiquidAI/LFM3-1.7B/blob/main/LICENSE)
- [LFM2.5-24B-A2B: Built for Fast On-Device Agents — Liquid AI 官方部落格](https://www.liquid.ai/blog/lfm2-5-24b-a2b)
- [LiquidAI/LFM2.5-24B-A2B — HuggingFace 模型卡](https://huggingface.co/LiquidAI/LFM2.5-24B-A2B)
- [Liquid AI 價格頁](https://www.liquid.ai/pricing)
- [Liquid API 模型列表](https://docs.liquid.ai/api/models)
- [LiquidAI — HuggingFace 組織](https://huggingface.co/LiquidAI)
- [Liquid AI：LFM2.5-2.6B 發布與訓練](https://www.liquid.ai/blog/lfm2-5-2-6b)
- [LFM2.5-2.6B 官方模型卡](https://huggingface.co/LiquidAI/LFM2.5-2.6B)
- [OpenRouter：LFM2.5-2.6B 端點限制與資料條款](https://openrouter.ai/liquid/lfm-2.5-2.6b:free)
- [模型卡｜Liquid AI LFM3-1.7B](/posts/daily/2026-10-28-model-liquid-ai-lfm3-1-7b) — 本站
- [模型卡｜Liquid AI LFM2.5-24B-A2B](/posts/daily/2026-10-14-model-liquid-ai-lfm2-5-24b-a2b) — 本站
- [決策模型家族](/posts/tech/2026-10-22-ai-model-family-decision-models) — 本站
