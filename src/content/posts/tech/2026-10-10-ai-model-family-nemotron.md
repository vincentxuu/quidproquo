---
title: "NVIDIA Nemotron 系列：開放權重推理與多模態模型家族"
date: 2026-10-10
category: tech
type: deep-dive
tags: [nvidia, nemotron, moe, open-weight, reasoning, multimodal, agentic]
lang: zh-TW
tldr: "Nemotron 涵蓋文字推理、多模態理解與安全分類；Ultra、Super、Lightning、Nano Omni 及 Content Safety 的架構、上下文與授權不同。本文區分官方模型規格與 API 端點限制。"
description: "NVIDIA Nemotron 家族選型：混合 MoE、Nano Omni 音訊與視覺、Content Safety、各型號授權，以及免費端點與本地部署取捨。"
draft: false
series:
  name: "AI 模型家族"
  order: 31
---

> 🌏 [English version](/posts/tech/2026-10-10-ai-model-family-nemotron-en)

**NVIDIA Nemotron** 包含文字推理、多模態理解與內容安全模型。它不是單一架構或單一授權的產品：Ultra、Super、Lightning、Nano Omni 與 Content Safety 各自有不同角色。選型的第一步，是確認需要的是產生答案、理解影音，還是判斷輸入與輸出是否符合安全政策。

## 家族定位與版本矩陣

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式 |
|---|---|---|---|
| Nemotron 3 Ultra | 大型文字推理 | 550B／55B；官方 1M | 官方模型資料；OpenRouter 免費路由 |
| Nemotron 3 Super | 文字推理與多代理 | 120B／12B；官方 1M，免費端點 262,144 | 開放權重；OpenRouter 免費路由 |
| Nemotron 3.5 Lightning | 本地推論 | 30B／3B；官方 1M | OpenMDW-1.1 權重；免費路由 |
| Nemotron 3 Nano Omni | 影音、圖像與文字理解 | 31B／約 3B；256K；文字輸出 | NVIDIA Open Model Agreement；免費路由狀態須確認 |
| Nemotron 3.5 Content Safety | 安全分類 | 4B dense；128K | OpenMDW-1.1 與 Gemma 條款；免費路由 |

### 家族概覽：模型規格與 API 限制要分開

以下依 NVIDIA 官方模型卡與 OpenRouter 端點資料整理，查核日期為 2026-10-11。

| 模型 | 官方總／活躍參數 | 官方上下文 | OpenRouter 免費路由上下文 | 角色 |
|---|---|---|---|---|
| Nemotron 3 Ultra | 550B／55B | 1M | 1,000,000 | 大型文字推理 |
| Nemotron 3 Super | 120B／12B | 1M | 262,144 | 文字推理、工具使用、多代理應用 |
| Nemotron 3.5 Lightning | 30B／3B | 1M | 1,000,000 | 效率與本地推論 |
| Nemotron 3 Nano Omni | 模型卡列 31B／約 3B，名稱保留 30B-A3B | 256K | 256,000 | 文字、圖像、音訊、影片理解 |
| Nemotron 3.5 Content Safety | 4B，dense 模型 | 128K | 128,000 | 文字與單張圖像的安全分類 |

Super 的「模型支援 1M」與「免費 API 限制約 262K」可以同時成立。不能把供應商端點的限制寫成模型的訓練上限；實際呼叫仍以所選端點為準。

Nano Omni 的官方卡列出音訊輸入，因此它不只有圖像與影片能力。模型卡的 31B 規格與路由名稱的 30B-A3B 也應一起交代，避免把名稱當成精確參數計數。

## 家族演化

本篇依任務角色整理 3 與 3.5 的型號，未整理完整發布時間線：Ultra、Super 偏文字推理，Lightning 偏本地推論，Nano Omni 處理多模態理解，Content Safety 做分類。這些角色不能排成單一路線的升級順序。

## 架構與訓練取捨

### 架構差異

#### Ultra 與 Super：混合架構、LatentMoE 與 MTP

Ultra 與 Super 結合 Mamba、Attention 與 MoE。官方還列出 **LatentMoE** 與 **Multi-Token Prediction（MTP）**：前者是專家架構設計，後者支援 speculative decoding。這些設計著重推論效率，但不能在沒有相同硬體、輸入長度與並行設定時，直接推成實際服務一定快幾倍。

#### Lightning：較小的活躍計算量

3.5 Lightning 同樣是 Mamba-2、MoE、Attention 混合架構。官方 NVFP4 模型卡提供單 GPU 與不同硬體的部署路徑，也列出 DSpark、MTP、DFlash 等推測解碼方法。選擇它可先從本地 agent 或子代理工作流評估，延遲仍須在自己的請求與硬體上測量。

#### Nano Omni 與 Content Safety：不同的任務

Nano Omni 在語言模型骨幹之外使用視覺與語音編碼器，輸出是文字，可用於會議影音摘要、文件理解與 GUI 工作流。它沒有因此變成影片生成模型。

Content Safety 則由 Google **Gemma-3-4B-it** 微調而來，採 dense Transformer 與視覺編碼器。它接受 prompt、可選圖像、可選回答及自訂安全政策，回傳安全標籤。這不是 MoE 推理家族的另一個尺寸，也不能保證應用自動符合所有政策。

## 評測與競品比較

官方評測可用來建立評估方向，不能取代自己的驗收集。NVIDIA 模型卡提供測試設定與部分可重現流程；比較分數前，要先確認工具、harness、推理預算及精度格式一致。

本文引用資料未提供模型版本、benchmark、harness、工具權限與推理預算一致的可比較結果。產品定位與參數量不足以建立排名；可依下列任務驗證方式比較候選模型。

延伸選型可參考 [LongCat 模型家族](/posts/tech/2026-10-10-ai-model-family-longcat)、[Cohere North 模型家族](/posts/tech/2026-10-10-ai-model-family-cohere-north)、[Apodex 模型家族](/posts/tech/2026-10-10-ai-model-family-apodex)、[Liquid AI 模型家族](/posts/tech/2026-10-10-ai-model-family-liquid-ai)、[Dots 模型家族](/posts/tech/2026-10-10-ai-model-family-dots-studio)，並依任務與部署條件比較。

## 授權、價格與部署

### 開放權重不代表整個家族共用授權

| 模型 | 官方模型卡所列條款 |
|---|---|
| Nemotron 3 Super／文字 Nano | NVIDIA Nemotron Open Model License |
| Nemotron 3.5 Lightning | OpenMDW-1.1 |
| Nemotron 3 Nano Omni | NVIDIA Open Model Agreement |
| Nemotron 3.5 Content Safety | OpenMDW-1.1、Gemma Terms of Use 與 Gemma Prohibited Use Policy |

下載特定 checkpoint 時，要讀它自己的條款。模型權重與 NIM 容器也可能有不同條款；Super 模型卡就分別列出模型授權與 NIM 軟體條款。不能用一個家族的「開放」標籤代替逐項核對。

### OpenRouter 路由與範例

本次端點資料列出以下免費路由；「目錄存在」與「即時推理成功」是不同證據，本文沒有實際呼叫模型：

| 模型 | 完整路由 ID |
|---|---|
| Ultra | `nvidia/nemotron-3-ultra-550b-a55b:free` |
| Super | `nvidia/nemotron-3-super-120b-a12b:free` |
| Lightning | `nvidia/nemotron-3.5-lightning:free` |
| Nano Omni | `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` |
| Content Safety | `nvidia/nemotron-3.5-content-safety:free` |

Nano Omni 的端點在查核時顯示非正常服務狀態，因此不能承諾該免費路由當下可用。使用前要重查供應商狀態；免費額度、資料使用政策與服務承諾也應查閱當前條款。

下面示範呼叫 Super；需自行設定 API key，並由應用處理限流、錯誤與回答驗證：

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer ${OPENROUTER_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"model":"nvidia/nemotron-3-super-120b-a12b:free","messages":[{"role":"user","content":"Explain the assumptions in this technical proposal."}]}'
```

端點支援的 `tools`、結構化輸出或模態不一定相同。安全分類模型尤其不應直接套用通用 agent 的工具呼叫範例。

## Agent 使用與選型

### 工具使用與多代理分工

模型產生文字與工具呼叫請求；主程式要提供工具、執行請求、回傳結果，並管理狀態、權限、稽核紀錄與並行工作。Super 的多代理定位不代表一次聊天呼叫會自行啟動其他代理。

例如文件處理流程，可以由 Nano Omni 先讀取影音或掃描文件，主程式再把文字交給 Super 做推理，最後交給 Content Safety 做指定政策的分類。這是應用設計建議，仍須驗證各階段的輸出、格式與錯誤處理。

### 選擇與驗證

| 需求 | 可先評估 | 要量測什麼 |
|---|---|---|
| 複雜文字推理 | Ultra／Super | 自己任務的正確率、完成成本、推理預算 |
| 本地或大量子代理工作 | Lightning | 實際硬體記憶體、並行與延遲 |
| 文件、影音理解 | Nano Omni | 輸入格式、長度、轉錄與圖表理解 |
| 自訂內容安全政策 | Content Safety | 誤判、漏判、政策覆蓋與分類格式 |

Nemotron 的價值在於多種任務角色與部署路徑。先挑符合任務的型號，再核對端點和授權，比直接把最大模型當成所有工作的答案更實際。

## 限制與取捨

自建服務還要規劃完整權重、上下文快取與並行記憶體。量化權重可能降低記憶體需求，但必須依對應模型卡與硬體部署配方驗證。把活躍參數直接當成總記憶體需求，會低估 MoE 部署成本。

## 更新紀錄

- 2026-10-11：依共同家族格式重排章節，使用既有資料補版本矩陣；事實核對日期沿用既有紀錄。
- 2026-10-11：核對官方模型卡與端點，區分 Super 模型與 API 上下文、補 Nano Omni 音訊及參數說明，修正各型號授權與免費路由可用性，完成草稿發布。

## 參考資料

- [NVIDIA Nemotron 3 Ultra 官方介紹](https://research.nvidia.com/labs/nemotron/Nemotron-3-Ultra/)
- [Nemotron 3 Super 官方模型卡](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-BF16)
- [Nemotron 3 Nano 官方模型卡](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-BF16)
- [Nemotron 3.5 Lightning 官方模型卡](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-NVFP4)
- [Nemotron 3 Nano Omni 官方模型卡](https://huggingface.co/nvidia/Nemotron-3-Nano-Omni-30B-A3B-Reasoning-BF16)
- [Nemotron 3.5 Content Safety 官方模型卡](https://huggingface.co/nvidia/Nemotron-3.5-Content-Safety)
- [NVIDIA Nemotron Open Model License](https://www.nvidia.com/en-us/agreements/enterprise-software/nvidia-nemotron-open-model-license/)
- [OpenRouter Super 端點資料](https://openrouter.ai/api/v1/models/nvidia/nemotron-3-super-120b-a12b:free/endpoints)
- [OpenRouter Nano Omni 端點資料](https://openrouter.ai/api/v1/models/nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free/endpoints)
