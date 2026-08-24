---
title: "Gemini——Google 的原生多模態旗艦，1M context 與科學推理的雙料冠軍"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, gemini, google-deepmind, model-family-gemini, multimodal, reasoning, model-selection]
lang: zh-TW
type: deep-dive
tldr: "Gemini 是 Google DeepMind 推出的原生多模態 LLM 家族，以 1M context window、原生影片/語音輸入和科學推理能力聞名。3.1 Pro 在 GPQA Diamond 94.1% 和 ARC-AGI-2 77.1% 拿下科學推理雙冠，定價 $2/$12 只有 Claude 的 1/6。3.7 Flash 以 $0.75/$3.75 提供接近 Pro 的 Agent 能力。"
description: "Gemini 模型家族完整介紹：從 2023 年 Gemini 1.0 到 2026 年 3.1 Pro / 3.7 Flash 的演化脈絡、原生多模態架構、1M context 技術、定價比較、benchmark 數據、以及 Agent 開發者的選型指南"
series:
  name: "AI 模型家族"
  order: 4
draft: false
glossary:
  - term: "原生多模態"
    def: "從預訓練就整合文字、圖片、影片、語音等多種模態，而不是後掛視覺/語音 adapter"
  - term: "ARC-AGI-2"
    def: "人工通用智慧評測的第二代——測試模型解決全新邏輯模式的能力，被認為是最接近衡量「真正智慧」的 benchmark"
  - term: "Context caching"
    def: "Gemini 的快取機制——重複使用的 context 可以快取，cache hit 時 input 成本降 75%"
  - term: "Deep Think"
    def: "Gemini 的深度推理模式——花更多時間思考以提高複雜問題的準確度"
---

> 🌏 [English version](/posts/tech/2026-08-24-ai-model-family-gemini-en)

2023 年 12 月，Google DeepMind 發佈了 Gemini 1.0——第一個從預訓練就整合文字、圖片、影片、語音的「原生多模態」模型。兩年半後的 2026 年 2 月，Gemini 3.1 Pro 以 GPQA Diamond 94.1% 成為科學推理最強的模型，ARC-AGI-2 77.1% 是 Fluid Intelligence benchmark 的最高分。定價 $2/$12 只有 Claude Opus 的 1/6。這是「AI 模型家族」系列的第四篇家族深度介紹，追蹤 Gemini 從 1.0 到 3.7 Flash 的完整演化。

怎麼解讀文中引用的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。這篇是[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)系列的一部分。

## 家族演化時間線

| 版本 | 發佈 | Context | 關鍵里程碑 |
|---|---|---|---|
| Gemini 1.0 Ultra/Pro/Nano | 2023-12 | 32K | 首個原生多模態模型 |
| Gemini 1.5 Pro | 2024-02 | 1M | 業界首個 1M context |
| Gemini 1.5 Flash | 2024-05 | 1M | 輕量版，速度優先 |
| Gemini 2.0 Flash | 2024-12 | 1M | Agent 能力、工具使用 |
| Gemini 2.5 Pro | 2025-03 | 1M | 推理能力大幅提升 |
| Gemini 2.5 Flash | 2025-04 | 1M | 性價比 Flash |
| Gemini 3.0 Pro | 2025-11 | 1M | Gemini 3 系列首發 |
| Gemini 3.1 Pro | 2026-02 | 1M | ARC-AGI-2 77.1%，GPQA 94.1% |
| Gemini 3.1 Flash-Lite | 2026-03 | 1M | $0.25/$1.50，最快最便宜 |
| Gemini 3.5 Flash | 2026-05 | 1M | Agent 能力接近 Pro |
| Gemini 3.6 Flash | 2026-07 | 1M | 持續迭代 |
| Gemini 3.7 Flash | 2026-08 | 1M | 最聰明的 Flash，$0.75/$3.75 |

兩年半、12 個里程碑。Gemini 的演化有一條清晰的主線：**從多模態到 Agent，從旗艦到全尺寸覆蓋**。1M context 是 Gemini 最早建立的技術壁壘，之後每一代都在多模態理解和 Agent 能力上持續推進。

## 兩條產品線：閉源 Gemini 收營收，開源 Gemma 補生態

看懂 Gemini 在 2026 年的佈局，關鍵是把它拆成兩條線——和 GPT 的雙軌類似：

**閉源 API 線**（AI Studio / Vertex AI）：Gemini 3 全系列只在 Google 基礎設施上，無權重可下載。從 1.5 時代就維持 1M context，定價 $2/$12 起。這條線負責營收——Google 的企業與消費者流量都跑在這上面，TPU 自研晶片和全球數據中心是它的基礎設施護城河。

**開源權重線**（Gemma 2 / 3，2B–27B）：Apache 2.0，可下載、微調、自架。這條線負責生態位——給需要自架、微調、資料主權的開發者一條退路，但明確不是前沿模型。

中間的轉折值得記：Google 在 2017 年發表 Transformer 論文、2014 年收購 DeepMind，2023 年 12 月把 Brain 和 DeepMind 合併為 **Google DeepMind**，Gemini 成為統一品牌——整合研究力量對抗 OpenAI 與 Microsoft。Gemma 的開源更像戰略補位，而不是路線回歸——閉源旗艦這條主軸從沒鬆動過。

## 架構：原生多模態與 1M Context 的兩個壁壘

### 原生多模態

Gemini 從第一代就是原生多模態——文字、圖片、影片、語音在預訓練階段就一起訓練，而不是先把文字模型訓練好，再後掛視覺 adapter。

這意味著 Gemini 能「真正理解」影片和語音，而不只是把它們轉成文字再處理。3.1 Pro 支援：

- **文字**：標準 LLM 能力
- **圖片**：理解、分析、推理
- **影片**：直接處理影片片段（不是截圖）
- **語音**：原生語音理解和生成
- **PDF**：直接解析文件

### 1M Context Window

2024 年 2 月，Gemini 1.5 Pro 成為業界首個支援 1M token context window 的模型。這不是噱頭——1M tokens 大約等於：

- 10 本完整的小說
- 3 萬行程式碼
- 5 小時的語音轉錄

到了 3.1 Pro，1M context 已經成熟穩定。但要注意：**超過 200K tokens 後，定價翻倍**（$4/$18）。如果你的 workload 總是超過 200K，實際成本比 $2/$12 高得多。

### Deep Think

Gemini 的深度推理模式，類似 Claude 的 extended thinking 或 GPT 的 reasoning effort。3.1 Pro 的 Deep Think 在 ARC-AGI-2 上從 31.1%（3 Pro）跳到 77.1%——這是 2026 年最大的單一能力躍進之一。

## Gemini 3.1 Pro 和 3.7 Flash 怎麼選

2026 年 2 月的旗艦與 8 月的工作馬，定位完全不同：

| 項目 | Gemini 3.1 Pro | Gemini 3.7 Flash | Gemini 3.1 Flash-Lite |
|---|---|---|---|
| 定位 | 旗艦推理，科學/研究 | Agent 工作馬，平衡 | 高吞吐，最低成本 |
| Input ($/MTok) | $2（≤200K）/ $4（>200K）| $0.75（促銷至 2026/12）| $0.25 |
| Output ($/MTok) | $12（≤200K）/ $18（>200K）| $3.75（促銷至 2026/12）| $1.50 |
| Context caching | $0.20 / $0.40 | $0.075 | $0.025 |
| Context | 1M | 1M | 1M |
| Max output | 64K | 64K | 64K |
| Deep Think | ✓ | ✓ | ✓ |
| 原生多模態 | ✓（文字/圖/影/音/PDF）| ✓ | ✓（文字/圖/影，音訊加價）|

定價與規格來自 [Gemini Developer API Pricing](https://ai.google.dev/gemini-api/docs/pricing) 與 [Gemini API Models](https://ai.google.dev/gemini-api/docs/models)。

### 授權陷阱：最強模型綁在 Google 基礎設施上

Google 的授權佈局和 OpenAI 類似——閉源旗艦 + 開源小模型雙軌：

- **閉源旗艦（Gemini 3.1 全系列）**：只有 API（AI Studio / Vertex AI），無權重，授權即 Google 服務條款
- **開源權重（Gemma 2 / 3，2B–27B）**：Apache 2.0，可下載、微調、自架——但只有中小型，不是前沿
- **企業部署**：Vertex AI 上的 Gemini 受 Google Cloud 合約約束，資料處理地點可選區域

這裡的但書是：**Gemini 最強的模型幾乎綁死在 Google 基礎設施上**。想用 1M context 或原生影片理解，就必須走 Google 的 API 或 Vertex。Gemma 雖然 Apache 2.0，但 27B 的規模和品質都遠落後 Gemini 3.1 Pro。如果你的場景需要「Apache 2.0 + 前沿品質」，Gemini 給不了，得看 DeepSeek（MIT）或 Qwen（多數 Apache）。

另一個陷阱是 **Google 生態綁定**：Gemini 的深度優勢（搜尋、YouTube、Maps、Workspace）只有在 Google 生態內才能發揮。離開 Google 基礎設施，Gemini 就退化成一個普通的前沿模型，優勢大幅縮水。

還有一個定價陷阱：**Gemini 的 200K 門檻加價**——一旦 input 總量超過 200K tokens，整個請求（包括 output）都按長 context 費率計費。199K input → $2/$12，201K input → $4/$18（整個請求，不只是超出部分）。另外 **Gemini 3.7 Flash 的 $0.75/$3.75 只到 2026/12/31**，之後恢復 $1.50/$7.50。

### 效能位置

| 指標 | Gemini 3.1 Pro | 對照 |
|---|---|---|
| GPQA Diamond（研究生級科學問題）| **94.1%** | GPT-5.6 Sol 94.6%；Claude Fable 5 92.6%；Opus 4.8 92% |
| ARC-AGI-2（Fluid Intelligence）| **77.1%**（Deep Think）| Claude Opus 4.8 68.8%；Sonnet 4.6 60.4%；GPT-5.2 52.9% |
| SWE-bench Verified | 80.6% | Claude Opus 5 96%；DeepSeek V4 Pro 96.4%；Fable 5 95%——Gemini 落後約 15pp |
| MMMU-Pro（多模態學科推理）| **80.5~82%** | Qwen3-VL-235B 69.3%；GPT-5.4 81% |
| DocVQA | 92% | Qwen3-VL-235B 96.5%；GPT-5.4 95%——文件理解上 Qwen 開源反而更強 |

和競品直接對照：

| 指標 | Gemini 3.1 Pro | Claude Fable 5 | GPT-5.6 Sol | DeepSeek V4 Pro |
|---|---|---|---|---|
| GPQA Diamond | **94.1%** | 92.6% | 94.6% | — |
| ARC-AGI-2 | **77.1%** | — | — | — |
| SWE-bench Verified | 80.6% | 95% | ~95% | **96.4%** |
| MMMU-Pro | **82%** | — | — | — |
| Context | 1M | 1M | 1.05M | 1M |
| Output 上限 | 64K | 128K | 128K | 128K |
| 原生影片/語音 | **✓** | ✗ | ✗ | ✗ |
| Output 定價 ($/MTok) | $12 | $50 | $30 | **$0.87** |

Gemini 的獨特優勢是**科學推理 + 原生多模態 + 低定價**的組合。但 64K output 上限和 SWE-bench 落後是明顯的限制。

## 子線與生態系：一張表看懂 Gemini 有多少產品

| 子線 | 代表版本 | 定位 |
|---|---|---|
| 旗艦推理 | Gemini 3.1 Pro / Flash | 最高智慧 / 高效率 |
| 輕量 | Gemini 3.1 Flash-Lite | 高速低價，大規模分類 |
| 開源權重 | Gemma 3（2B–27B）| Apache 2.0，可自架 |
| 圖像 | Imagen 4 | 文生圖 |
| 語音 / 音訊 | Chirp / Lyria | 轉錄 / 音樂生成 |
| 影片 | Veo 3 | 文生影片 |
| 嵌入 | Gecko / text-embedding | RAG 主力 |
| 開發者工具 | AI Studio / Vertex AI Agent Builder | Agent 基礎設施 |
| 消費者產品 | Gemini App / NotebookLM | 全球第二大 AI 應用 |

兩個觀察：

**多模態廣度是 Gemini 最被低估的資產。** 文字、圖像、影片、語音、程式碼——Gemini 的原生多模態覆蓋比任何競爭者都完整，且從預訓練階段就融合（不是後掛 adapter）。對需要「看懂影片 + 聽得懂語音 + 讀得懂圖表」的 Agent 場景，Gemini 目前獨佔。

**基礎設施優勢是隱性護城河。** Google 擁有全球最大的 TPU 叢集，這讓 Gemini 的推論成本和可用性都高於多數競爭者。但這也意味著 Gemini 的命運和 Google Cloud 深度綁定——對不想依賴單一雲的企業，這是風險。

## 跟競品的位置

把 Gemini 放回 2026 年的格局：

- **對上 Claude**：Gemini 在科學推理（GPQA 94.1%）和原生多模態領先，Claude 在 coding（SWE-bench 95%）和 agentic 可靠性更穩
- **對上 GPT-5.6**：GPT 在 agentic 任務（BrowseComp、Terminal-Bench）更強，Gemini 在科學和多模態領先，兩家通用能力互有勝負
- **對上 DeepSeek V4**：DeepSeek 在 SWE-bench Verified 以 1/40 價格追平，且 MIT 可自架。Gemini 的優勢是 1M context 和多模態廣度
- **對上開源（Llama 4 / Qwen / Kimi / Mistral）**：Gemini 品質領先，但價格是開源的 10–50 倍，且最強模型不開源

## 對 Agent 開發者的意義

- **科學研究和推理** → Gemini 3.1 Pro：GPQA Diamond 94.1%、ARC-AGI-2 77.1%——需要深度科學推理的場景，Gemini 目前最強
- **影片和語音理解** → Gemini 3.1 Pro：原生支援影片和語音輸入，不需要先轉文字。這在影片分析、語音助理等場景是獨特優勢
- **長文件處理** → Gemini 3.1 Pro：1M context 在處理大量文件時有優勢，特別是搭配 context caching 可以大幅降低成本
- **Google 生態整合** → 如果你已經在用 Google Workspace、Google Cloud，Gemini 的整合最自然
- **高性價比** → Gemini 3.1 Pro 的 $2/$12 定價是 Claude 的 1/6、GPT 的 1/2.5，但能力在科學推理上不輸
- **高吞吐分類/摘要** → Gemini 3.7 Flash：$0.75/$3.75（促銷），1M context，適合大量輕量請求
- **Coding agent 的長時間任務** → SWE-bench Verified 80.6% 落後 Claude 約 15pp，64K output 上限限制了複雜任務，此場景建議改選 Claude Opus 5 或 DeepSeek V4 Pro
- **本地部署** → Gemini 旗艦綁在 Google 基礎設施上，需自架看 Gemma（非前沿）或 Qwen / DeepSeek

## 整體來說

Gemini 的故事是「用基礎設施優勢換取定價和多模態領先」。Google 擁有 TPU 自研晶片和全球最大數據中心網路，這讓 Gemini 能以 $2/$12 的定價提供 1M context 和原生多模態——這是 Claude 和 GPT 做不到的。

但 Gemini 也有明確的限制：64K output 上限、SWE-bench 落後、agent 穩定性不如 Claude。它的最佳定位是**科學推理 + 多模態理解 + 高性價比**的組合——如果你的場景需要深度科學推理或影片/語音理解，Gemini 是最划算的選擇。

---

## 參考資料

- [Google DeepMind Gemini](https://deepmind.google/models/gemini/pro/)
- [Gemini 3.1 Pro Model Card](https://deepmind.google/models/model-cards/gemini-3-1-pro/)
- [Gemini 3.7 Flash: our most intelligent workhorse model](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-3-7-flash/)
- [Gemini 3.1 Pro: Announcing our latest Gemini AI model](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-1-pro/)
- [Gemini Developer API Pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [Gemini API Models](https://ai.google.dev/gemini-api/docs/models)
- [Gemini 3.1 Pro — BenchLM](https://benchlm.ai/models/gemini-3-1-pro)
- [Gemini 3.1 Pro — Artificial Analysis](https://renas.ai/models/gemini-3-1-pro)
- [Gemini 3.1 Pro reviewed — benchor](https://benchr.org/articles/gemini-3-1-pro-review)
- [ARC-AGI-2 Benchmark](https://arcprize.org)
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站