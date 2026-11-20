---
title: "NVIDIA Nemotron 系列：開放權重推理與多模態模型家族，3.5 世代補上視覺 Super 與筆電級 Bolt"
date: 2026-10-10
category: tech
type: deep-dive
tags: [nvidia, nemotron, moe, open-weight, reasoning, multimodal, agentic]
lang: zh-TW
tldr: "Nemotron 是 NVIDIA 的開放權重模型家族，依部署位置分成 Ultra、Super、Lightning、Nano、Bolt 等層，另有語音、檢索、安全與實驗性的 Labs 線。2026 年 10 月的 3.5 世代把 Super 換成可讀圖片與影片的 Super VL（120B／12B 啟用、1M context），並從它壓縮出能塞進 24GB 的 Bolt 74B-A9B。新模型多半改用 OpenMDW-1.1 授權，但舊型號仍是各自的 NVIDIA 條款，要逐個 checkpoint 核對。"
description: "NVIDIA Nemotron 家族選型：3.5 Super VL、Bolt、Lightning、Ultra、Nano Omni 的分工，Transcribe、Embed、Rerank 與 Content Safety 子線，Labs 實驗模型 Dory，各型號授權，以及 OpenRouter 端點與本地部署取捨。"
draft: false
series:
  name: "AI 模型家族"
  order: 31
---

> 🌏 [English version](/posts/tech/2026-10-10-ai-model-family-nemotron-en)

**NVIDIA Nemotron** 不是單一模型，而是一組依部署位置分層的開放權重模型：資料中心用 Ultra、Super，常駐 agent 用 Lightning，子代理用 Nano，筆電與裝置用 Bolt；另有語音、檢索、內容安全，以及實驗新架構的 Nemotron Labs。這篇寫給要在 Nemotron 裡挑模型的開發者：每一層解決什麼問題、3.5 世代換了什麼、授權與端點要注意哪些差異。

選型的第一步，是確認需要的是產生答案、理解影音、轉錄語音、做檢索，還是判斷輸入與輸出是否符合安全政策。

## 家族定位與版本矩陣

依 [NVIDIA Nemotron 產品頁](https://developer.nvidia.com/topics/ai/nemotron)、各 HuggingFace 模型卡與 OpenRouter 模型列表整理，2026-11-20 核對。OpenRouter 價格是第三方路由的每 1M tokens 報價，不是 NVIDIA 官方定價：

| 模型／產品線 | 定位 | 關鍵差異 | 授權與存取 |
|---|---|---|---|
| Nemotron 3 Ultra 550B-A55B | 最高推理準確度 | 550B／55B 啟用，官方 1M context | OpenMDW-1.1；OpenRouter $0.50／$2.20，另有免費路由 |
| **Nemotron 3.5 Super VL 120B-A12B** | 推理、工具、多模態 agent | 文字／圖片／影片輸入，1M context，原生 MTP | OpenMDW-1.1；OpenRouter $0.15／$0.50，另有免費路由 |
| Nemotron 3.5 Lightning 30B-A3B | 常駐 agent 的專門任務 | 30B／3B 啟用，1M context | OpenMDW-1.1；OpenRouter $0.07／$0.20，另有免費路由 |
| Nemotron 3 Nano Omni 30B-A3B | 影音、圖像、文字理解的子代理 | 256K，文字輸出 | NVIDIA Open Model Agreement；OpenRouter 免費路由 |
| **Nemotron 3.5 Bolt 74B-A9B** | 筆電上的日常 agent | 從 Super VL 壓縮，24GB 版用 2-bit 專家權重，256K | OpenMDW-1.1；權重 |
| **Nemotron 3.5 Bolt E4B** | 裝置端語音與助理介面 | 從 Gemma-4-E4B-it 後訓練，8B（4B 有效），輸入輸出各 64K | OpenMDW-1.1，另受 Gemma 4 的 Apache 2.0 條款約束 |
| Nemotron 3.5 Transcribe 30B-A4B | 離線語音轉錄與理解 | 40 種語言、單段錄音最長 1 小時 | OpenMDW-1.1；權重 |
| Nemotron 3.5 Embed／Rerank／Parse | 檢索與文件抽取 | Embed 1B／8B、Rerank 8B | 各自模型卡 |
| Nemotron 3.5 Content Safety | 安全分類 | 4B dense，128K | OpenMDW-1.1＋Gemma 條款；OpenRouter $0.20／$0.20 |
| Nemotron Labs（Dory、Sigma 等） | 實驗新架構 | Dory 是 4B 循環模型 | Dory 為 OpenMDW-1.1；Sigma 為 Nemotron Open Model License |

### 模型規格與 API 限制要分開

OpenRouter 上 Ultra 的付費端點 context 是 262,144，免費端點是 1,000,000；舊的 Nemotron 3 Super 付費端點也只有 262,144，而官方 checkpoint 支援 1M。呼叫 API 時以所選端點為準，不能把端點限制寫成模型上限。「目錄存在」與「即時推理成功」也是不同證據，本文沒有實際呼叫這些端點。

## 家族演化

依 [nvidia 的 HuggingFace 組織](https://huggingface.co/nvidia)整理，月份取自模型 repo 建立時間：

| 版本 | 時間 | 改變了什麼選型 | 站上紀錄 |
|---|---|---|---|
| Nemotron 3 Nano 30B-A3B | 2025-12 | 3 世代開始，Mamba＋Attention＋MoE 混合架構成為主線 | — |
| Nemotron 3 Super 120B-A12B | 2026-03 | 文字推理與多代理的主力，加入 LatentMoE 與 MTP | — |
| Nemotron 3 Nano Omni | 2026-04 | 單一模型處理影音、圖像、文字理解 | — |
| Nemotron 3.5 Content Safety | 2026-05 | 支援自訂政策的安全分類，改用 OpenMDW 授權 | — |
| Nemotron 3 Ultra 550B-A55B | 2026-06 | 家族最大型號，最高推理準確度 | — |
| Nemotron 3.5 Lightning 30B-A3B | 2026-08 | 3.5 世代第一款，主打常駐 agent 的效率 | — |
| **Nemotron 3.5 Bolt／Transcribe／Embed** | 2026-10 | 新增筆電級 Bolt、語音轉錄與檢索模型 | — |
| **Nemotron 3.5 Super VL** | 2026-10 | Super 層換成原生多模態，授權改為 OpenMDW-1.1 | — |
| Nemotron Labs Dory 1.0 | 2026-10-16 | 循環架構，同一權重可在推理時調整運算量 | [模型卡](/posts/daily/2026-10-19-model-nvidia-nemotron-dory-1-0) |

3.5 世代的兩個方向：Super 層從純文字變成可讀圖片與影片，新增的 Bolt 則把同一套能力往下壓到筆電。授權也從各型號各自的 NVIDIA 條款，逐步統一到 OpenMDW-1.1。

Nemotron 3 Super（純文字）在主篇降為上一代；它的規格與評測保留在 [HuggingFace 模型卡](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-BF16)，OpenRouter 上仍有付費端點。

## 架構與訓練取捨

### Super VL 與 Ultra：混合架構、LatentMoE 與 MTP

Ultra 與 Super 結合 Mamba-2、Attention 與 MoE，並使用 **LatentMoE** 專家架構與 **Multi-Token Prediction（MTP）**，後者支援推測解碼。[Super VL 模型卡](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Super-VL-120B-A12B-BF16)在這套骨幹上加了 C-RADIO 視覺編碼器與視覺語言連接層，推理模式可設關閉、中等或完整。BF16 版的部署建議是 4 張 H100 或 2 張 GB200；要在 DGX Spark 或較少 GPU 上跑，官方指向 NVFP4 版。這些設計著重推論效率，但不能在沒有相同硬體、輸入長度與並行設定時，直接推成實際服務一定快幾倍。

### Bolt 74B-A9B：從 Super VL 壓縮出筆電版

依 [Bolt 74B-A9B 模型卡](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Bolt-74B-A9B-BF16)，它用 NVIDIA 的 Star Elastic 方法從 Super VL 壓縮而來：一個受預算條件控制的 router 在各層挑選專家數與 MoE 寬度，專家 top-K 從母模型的 22 降到 9，目標是 batch 1、128K context 下總記憶體低於 24GB。這個預算已經把後續量化（2-bit 路由專家權重、16-bit SSM 狀態等）算進去，所以架構搜尋和量化是一起最佳化的。

BF16 版主要給微調與研究用；實際推論官方建議用 24GB 版搭配 llama.cpp 或 vLLM。代價是 2-bit 量化後部分分數下降，例如官方表上 AA-Omniscience 不幻覺率從 BF16 的 56.14 變成 61.27、答對率從 21.80 降到 16.90。

### Lightning：較小的活躍計算量

3.5 Lightning 同樣是 Mamba-2、MoE、Attention 混合架構。官方 NVFP4 模型卡提供單 GPU 與不同硬體的部署路徑，也列出 DSpark、MTP、DFlash 等推測解碼方法。選擇它可先從常駐 agent 或子代理工作流評估，延遲仍須在自己的請求與硬體上測量。

### Nano Omni、Transcribe 與 Content Safety：不同的任務

Nano Omni 在語言模型骨幹之外使用視覺與語音編碼器，輸出是文字，可用於會議影音摘要、文件理解與 GUI 工作流；它不是影片生成模型。[Transcribe](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Transcribe-30B-A4B) 則是專門的語音模型：34B 總參數（含音訊編碼器）、約 4.3B 啟用，處理轉錄、說話者標註、語音翻譯與音訊問答。

Content Safety 由 Google **Gemma-3-4B-it** 微調而來，採 dense Transformer 與視覺編碼器。它接受 prompt、可選圖像、可選回答及自訂安全政策，回傳安全標籤。這不是 MoE 推理家族的另一個尺寸，也不能保證應用自動符合所有政策。

### Labs：Dory 的循環架構

[Dory 1.0](https://huggingface.co/nvidia/NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16) 把 36 層分成 8 層輸入、20 層共用的循環區塊、8 層輸出，推理時可讓循環區塊跑 1、2 或 4 次，用同一份權重換取不同運算量；另支援只保留最後一輪 KV cache，讓記憶體不隨循環次數增加。它是 Labs 的實驗模型，vLLM 支援在本文核對時仍在審查中。

## 評測與競品比較

### Super VL 的位置

以下出自 Super VL 模型卡，NVIDIA 自測：

| Benchmark | Nemotron 3.5 Super VL | Nemotron 3 Ultra | Qwen3.8-Flash-Next | GLM-5.3-Flash |
|---|---|---|---|---|
| GPQA Diamond | 89.52 | 87.0 | **92.7** | 91.2 |
| SWE-bench Verified | 71.10 | 73.9 | 78.7 | **79.10** |
| Terminal-Bench 2.1 | 60.67 | 54.80 | **85.80** | 82.70 |
| BrowseComp | 78 | 67.85 | **89.0** | 86.6 |
| AA-Omniscience 幻覺率（越低越好） | 30.0 | **22.1** | 41.3 | 30.3 |
| OSWorld-Verified | 51.14 | — | **55.8** | 14.78 |

讀這張表：NVIDIA 自己的對照表裡，Super VL 在 coding 與終端任務明顯落後同期的 Qwen3.8-Flash-Next 與 GLM-5.3-Flash，強項是幻覺率較低、長圖譜推理（GraphWalks 89.71）等項目。它的價值在於「開放權重＋開放訓練資料＋多模態＋可在 NVIDIA 硬體上高效部署」的組合，而不是單項分數。

### Bolt 74B-A9B 的位置

Bolt 模型卡和同記憶體級的模型比較：24GB 版在 Terminal-Bench 2.1 拿 50.98、BrowseComp 66.75、GPQA Diamond 86.43，都高於 Qwen3.6-35B-A3B（44.38、48.74、83.40）與 Nemotron 3.5 Lightning。同樣是 NVIDIA 自測。

官方評測可用來建立評估方向，不能取代自己的驗收集；比較分數前，要先確認工具、harness、推理預算及精度格式一致。

延伸選型可參考 [LongCat 模型家族](/posts/tech/2026-10-10-ai-model-family-longcat)、[Cohere North 模型家族](/posts/tech/2026-10-10-ai-model-family-cohere-north)、[Apodex 模型家族](/posts/tech/2026-10-10-ai-model-family-apodex)、[Liquid AI 模型家族](/posts/tech/2026-10-10-ai-model-family-liquid-ai)、[Dots 模型家族](/posts/tech/2026-10-10-ai-model-family-dots-studio)，並依任務與部署條件比較。

## 授權、價格與部署

### 開放權重不代表整個家族共用授權

依各 HuggingFace 模型卡的授權欄位：

| 模型 | 授權 |
|---|---|
| 3 Ultra、3.5 Super VL、3.5 Lightning、3.5 Bolt 74B-A9B、3.5 Transcribe、Labs Dory | OpenMDW-1.1 |
| 3.5 Bolt E4B | OpenMDW-1.1，另受 Gemma 4 的 Apache 2.0 條款約束 |
| 3.5 Content Safety | OpenMDW-1.1、Gemma Terms of Use 與 Gemma Prohibited Use Policy |
| 3 Super（純文字）、文字 Nano、Labs Sigma | NVIDIA Nemotron Open Model License |
| 3 Nano Omni | NVIDIA Open Model Agreement |

新型號多半改用 OpenMDW-1.1，但同一家族裡仍有三種 NVIDIA 條款並存。下載特定 checkpoint 時，要讀它自己的條款；模型權重與 NIM 容器也可能有不同條款。

### 端點與價格

NVIDIA 本身透過 NIM 微服務與 build.nvidia.com 提供 API 試用，OpenRouter 則有第三方路由。以下為 2026-11-20 OpenRouter 模型列表的路由 ID：

| 模型 | 付費路由（每 1M tokens） | 免費路由 |
|---|---|---|
| Ultra | `nvidia/nemotron-3-ultra-550b-a55b`（$0.50／$2.20） | `:free` |
| Super VL | `nvidia/nemotron-3.5-super-vl`（$0.15／$0.50） | `:free` |
| Lightning | `nvidia/nemotron-3.5-lightning`（$0.07／$0.20） | `:free` |
| Nano Omni | — | `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` |
| Content Safety | `nvidia/nemotron-3.5-content-safety`（$0.20／$0.20） | — |

免費額度、資料使用政策與服務承諾要查閱當前條款；端點支援的 `tools`、結構化輸出或模態也不一定相同。安全分類模型尤其不應直接套用通用 agent 的工具呼叫範例。

下面示範呼叫 Super VL；需自行設定 API key，並由應用處理限流、錯誤與回答驗證：

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer ${OPENROUTER_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"model":"nvidia/nemotron-3.5-super-vl","messages":[{"role":"user","content":"Explain the assumptions in this technical proposal."}]}'
```

### 本地部署

自建服務要規劃完整權重、context 快取與並行記憶體。Bolt 24GB 版是目前唯一以「單機 24GB」為設計目標的型號；Super VL 的 BF16 版需要 4 張 H100，NVFP4 版門檻較低。把活躍參數直接當成總記憶體需求，會低估 MoE 部署成本。

## Agent 使用與選型

### 工具使用與多代理分工

模型產生文字與工具呼叫請求；主程式要提供工具、執行請求、回傳結果，並管理狀態、權限、稽核紀錄與並行工作。Super VL 的多代理定位不代表一次聊天呼叫會自行啟動其他代理。

例如文件處理流程，可以由 Nano Omni 或 Transcribe 先讀取影音，主程式再把文字交給 Super VL 推理，最後交給 Content Safety 做指定政策的分類。這是應用設計建議，仍須驗證各階段的輸出、格式與錯誤處理。

### 選擇與驗證

| 需求 | 可先評估 | 要量測什麼 |
|---|---|---|
| 最高推理準確度 | Ultra | 自己任務的正確率、完成成本、推理預算 |
| 多模態 agent、文件與影片理解 | Super VL | 圖表與文件抽取正確率；推理模式的 token 成本 |
| 筆電上的本地 agent | Bolt 74B-A9B 24GB | 24GB 量化版在自家任務的品質落差 |
| 裝置端語音助理 | Bolt E4B | 首字延遲與多輪工具呼叫穩定度 |
| 常駐 agent、大量子代理 | Lightning | 實際硬體記憶體、並行與延遲 |
| 會議與錄音轉錄 | Transcribe | 自家語言與口音的錯字率 |
| 自訂內容安全政策 | Content Safety | 誤判、漏判、政策覆蓋與分類格式 |

Nemotron 的價值在於多種任務角色、開放訓練資料與部署路徑。先挑符合任務的型號，再核對端點和授權，比直接把最大模型當成所有工作的答案更實際。

## 限制與取捨

- **評測都是 NVIDIA 自測**，Super VL 在自家表上的 coding 項目落後同期開放模型。
- **授權要逐個 checkpoint 核對**：三種 NVIDIA 條款與 OpenMDW-1.1 並存，部分型號還疊加 Gemma 條款。
- **量化有代價**：Bolt 24GB 版的部分分數低於 BF16 版。
- **Labs 模型是實驗性質**：Dory 的推論框架支援尚未正式釋出。
- **OpenRouter 價格是第三方報價**，不是 NVIDIA 的服務承諾。

## 更新紀錄

- **2026-11-20**：補上 3.5 世代。矩陣、架構、評測、授權、端點與選型改寫（NVIDIA Nemotron 產品頁、Super VL／Bolt／Transcribe／Dory 等 HuggingFace 模型卡與授權欄位、OpenRouter 模型列表，2026-11-20 讀取）；新增 Super VL、Bolt 74B-A9B 與 E4B、Transcribe、檢索模型與 Labs 線，以及 Bolt 從 Super VL 壓縮的方法。家族演化原本寫「未整理完整發布時間線」，現補上 3 Nano 到 3.5 Super VL 的時間線。Nemotron 3 Super（純文字）降為上一代，範例改為呼叫 Super VL。授權表補上 Ultra（原本未列）為 OpenMDW-1.1。OpenRouter 路由改為 2026-11-20 的清單，原本「Nano Omni 端點非正常服務」的說法已無法對應當前狀態，改為只列路由與價格。
- 2026-10-11：依共同家族格式重排章節，使用既有資料補版本矩陣；事實核對日期沿用既有紀錄。
- 2026-10-11：核對官方模型卡與端點，區分 Super 模型與 API 上下文、補 Nano Omni 音訊及參數說明，修正各型號授權與免費路由可用性，完成草稿發布。

## 參考資料

- [NVIDIA Nemotron 產品頁](https://developer.nvidia.com/topics/ai/nemotron)
- [Nemotron 3.5 Super VL 官方模型卡](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Super-VL-120B-A12B-BF16)
- [Nemotron 3.5 Bolt 74B-A9B 官方模型卡](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Bolt-74B-A9B-BF16)
- [Nemotron 3.5 Bolt E4B 官方模型卡](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Bolt-E4B-BF16)
- [Nemotron 3.5 Transcribe 官方模型卡](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Transcribe-30B-A4B)
- [Nemotron Labs Dory 1.0 官方模型卡](https://huggingface.co/nvidia/NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16)
- [NVIDIA Nemotron 3 Ultra 官方介紹](https://research.nvidia.com/labs/nemotron/Nemotron-3-Ultra/)
- [Nemotron 3 Super 官方模型卡](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-BF16)
- [Nemotron 3 Nano 官方模型卡](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-BF16)
- [Nemotron 3.5 Lightning 官方模型卡](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-NVFP4)
- [Nemotron 3 Nano Omni 官方模型卡](https://huggingface.co/nvidia/Nemotron-3-Nano-Omni-30B-A3B-Reasoning-BF16)
- [Nemotron 3.5 Content Safety 官方模型卡](https://huggingface.co/nvidia/Nemotron-3.5-Content-Safety)
- [OpenMDW License 1.1](https://openmdw.ai/license/1-1/)
- [NVIDIA Nemotron Open Model License](https://www.nvidia.com/en-us/agreements/enterprise-software/nvidia-nemotron-open-model-license/)
- [OpenRouter 模型列表 API](https://openrouter.ai/api/v1/models)
- [模型卡｜NVIDIA Nemotron Labs Dory 1.0](/posts/daily/2026-10-19-model-nvidia-nemotron-dory-1-0) — 本站
