---
title: "Qwen（通義千問）：阿里巴巴的開源 LLM 家族，從 72B 到 397B 的演進全覽"
date: 2026-04-28
type: project
category: ai
tags: [qwen, alibaba, llm, open-source, moe, multimodal, apache2, ai-model, dashscope, on-device-ai, agentic-coding]
lang: zh-TW
tldr: "Qwen（通義千問）是阿里巴巴推出的開源 LLM 家族，以 Apache 2.0 授權、201 語言覆蓋和快速迭代聞名。最新的 Qwen3.6（2026/04）聚焦 Agentic Coding，27B Dense 版本在 SWE-bench 77.2%、Terminal-Bench 59.3%，與 Claude Opus 同級；新增 Thinking Preservation 讓 agent 跨輪保留推理脈絡。"
description: "深入介紹阿里巴巴旗下 Qwen（通義千問）模型家族，涵蓋公司背景、完整演進史（Qwen1 → Qwen3.6）、Qwen3.5/3.6 技術架構（Gated DeltaNet + MoE）、Benchmark 比較、DashScope API，以及 Qwen 在繁中、多語言、行動端、Agentic Coding 場景的定位。"
draft: false
---

2025 年 4 月，阿里巴巴發布 Qwen3——一個在技術上讓整個開源社群重新審視「中國模型」的系列。它引入了**思考模式可切換**的機制，讓同一個模型能在快速回應和深度推理之間動態切換，而不是像 DeepSeek-R1 那樣固定只走推理路線。

到了 2026 年 Q1，Qwen3.5 系列進一步升級：旗艦 397B 原生整合視覺與影片，行動端的 9B 版本打敗了上一代 30B，而 35B 版本僅用 3B 啟用參數就超越了舊旗艦 235B。這種效率躍進，讓 Qwen 成為開源模型中「小尺寸但能打大仗」的代表。

2026 年 4 月底，**Qwen3.6** 發布，聚焦在社群最直接的回饋：讓模型在 agentic coding 場景更穩定、更實用。它新增了 **Thinking Preservation**（跨輪保留推理脈絡），27B Dense 版本在 SWE-bench Verified 達到 77.2%、Terminal-Bench 2.0 達到 59.3%，逼近 Claude Opus 4.5 的水準。

---

## 阿里巴巴與通義千問

Qwen（全名**通義千問**）是阿里巴巴集團旗下**阿里雲**主導開發的 LLM 產品線，對應的國際品牌即為 Qwen。

阿里在 AI 領域的布局比多數人意識到的早——早在 2017 年就成立了**達摩院**（DAMO Academy），持續在 NLP、CV、語音等領域投入基礎研究。Qwen 系列從 2023 年底開始對外開源，最初以 7B 和 14B 為主，逐步演進到如今的 400B 級旗艦。

阿里雲的 API 平台叫做 **DashScope**（靈積），是 Qwen 系列的主要發布管道。中國市場以外，Qwen 模型也在 Hugging Face 和 OpenRouter 上廣泛流通。

---

## Qwen 演進史

| 時間 | 系列 | 關鍵里程碑 |
|------|------|------------|
| 2023/08 | **Qwen-7B / 14B** | 初代開源，通義千問品牌正式亮相 |
| 2024/02 | **Qwen1.5** | 0.5B～72B 完整尺寸覆蓋，繁中和多語言強化 |
| 2024/06 | **Qwen2** | 72B 旗艦，128K context，超越 LLaMA 3 70B |
| 2024/09 | **Qwen2.5** | 引入 Qwen2.5-Coder（72B 開源代碼 SOTA）、Qwen2.5-VL（視覺語言）、Qwen2.5-Math |
| 2025/04 | **Qwen3** | 235B-A22B MoE 旗艦，**思考模式切換**（/think / /no_think），Apache 2.0 |
| 2026/02 | **Qwen3.5-397B** | 397B-A17B 多模態旗艦，Gated DeltaNet + MoE，201 語言，262K context |
| 2026/02 | **Qwen3.5 Medium** | 122B / 35B / 27B 三尺寸，35B-A3B 超越舊版 235B 旗艦 |
| 2026/03 | **Qwen3.5 Small** | 0.8B～9B 行動端系列，9B 超越舊版 Qwen3-30B |
| **2026/04** | **Qwen3.6** | 35B-A3B（MoE）+ 27B（Dense），主打 Agentic Coding，新增 Thinking Preservation |

整個 Qwen 家族的節奏是：**先用密集模型（Dense）建立基準線，再用 MoE 大幅壓低推論成本，最後把小模型塞進手機**。這條路線和 Meta 的 LLaMA 類似，但速度更快，專模型（Coder、VL、Math）的廣度也更大。

---

## Qwen3 的核心突破：思考模式切換

Qwen3 系列（2025/04）帶來了一個在當時很有辨識度的設計：**同一個模型可以動態選擇「思考」或「不思考」**。

- 在 prompt 中加入 `/think` → 觸發深度推理（類似 o1 或 DeepSeek-R1 的 chain-of-thought）
- 加入 `/no_think` → 直接快速回應，延遲更低、成本更低

這解決了一個實際問題：推理模型不應該對「你好」這種問題也跑 5 秒的思考鏈。Qwen3 讓開發者決定何時需要推理力，何時要速度。

### Qwen3 旗艦規格

```
Qwen3-235B-A22B
總參數：    235B
啟用參數：  22B
架構：      MoE
Context：  128K tokens
授權：      Apache 2.0
```

---

## Qwen3.5：架構全面升級

2026 年 Q1 推出的 Qwen3.5 系列，在 Qwen3 的基礎上做了三個主要升級：

1. **新架構**：引入 **Gated Delta Networks**（取代部分傳統 Attention 層），搭配 sparse MoE
2. **原生多模態**：從預訓練就整合文字、圖片、影片，不是後掛 adapter
3. **多語言覆蓋**：從 Qwen3 的數十語言擴展到 **201 種語言**

### 旗艦：Qwen3.5-397B-A17B

```
總參數：    397B
啟用參數：  17B
Expert 數： 512
每 token：  10 routed experts + 1 shared expert
Context：  262K tokens（可擴展至 1M）
多模態：    文字 / 圖片 / 影片
語言支援：  201 種語言
授權：      Apache 2.0
```

Gated Delta Networks 的作用是讓模型在處理長序列時更有效率——傳統 Transformer Attention 的計算量隨 context 長度平方增長，Delta Networks 系列架構改善了這個問題，讓 262K context 在實際推論中更可行。

### Qwen3.5 Medium 系列（2026/02/24）

| 模型 | 總參數 | 啟用參數 | 架構 | 亮點 |
|------|--------|----------|------|------|
| Qwen3.5-122B-A10B | 122B | 10B | MoE | BFCL-V4 72.2，Agentic 任務最強 |
| **Qwen3.5-35B-A3B** | 35B | 3B | MoE | 超越上一代 235B-A22B 旗艦 |
| Qwen3.5-27B | 27B | 27B | Dense | SWE-bench Verified 72.4 |

**35B-A3B 是這批最值得注意的**。啟用 3B 參數就超越前代 22B 啟用的旗艦——這意味著同樣的推論成本（VRAM、計算量）可以跑出強得多的模型，對自架推論服務的成本影響很大。

### Qwen3.5 Small 系列（2026/03/01）

| 尺寸 | 多模態 | 亮點 |
|------|--------|------|
| 0.8B | 否 | 極低功耗，嵌入式/邊緣裝置 |
| 2B | 否 | 手機主力，平衡性能與大小 |
| 4B | 是 | 行動端多模態入門 |
| 9B | 是 | 超越上一代 Qwen3-30B |

全系列 Apache 2.0，262K context，201 語言。對繁體中文和多語言場景的行動端應用來說，這是目前最值得考慮的選項之一。

---

## Qwen3.6：聚焦 Agentic Coding（2026/04）

Qwen3.6 是 Qwen3.5 之後最新的發布，距今約一週。它沒有走「更大更強」的路線，而是根據社群回饋調整：讓模型在 agentic coding 的實際任務中更穩定、前端工作流更準確、repository-level 推理更流暢。

**兩個版本：**

| 模型 | 架構 | 參數 | 啟用參數 |
|------|------|------|----------|
| Qwen3.6-35B-A3B | MoE | 35B | 3B（256 experts，8 routed + 1 shared） |
| Qwen3.6-27B | Dense | 27B | 27B（全啟用） |

兩者都支援多模態（文字、圖片、影片），262K context（YaRN 可擴展至 1M），Apache 2.0。

### 最重要的新功能：Thinking Preservation

Qwen3 系列預設只保留當前輪次的 thinking block，前幾輪的推理脈絡會被丟棄。這在單輪問答沒問題，但在 agent 的多步執行中，模型每輪都要從頭推理，浪費 tokens 也容易失去一致性。

Qwen3.6 引入 `preserve_thinking` 選項，啟用後會保留歷史輪次的推理內容：

```python
client.chat.completions.create(
    model="Qwen/Qwen3.6-27B",
    messages=messages,
    extra_body={
        "chat_template_kwargs": {"preserve_thinking": True},
    },
)
```

這對 agentic 任務的影響是雙向的：推理更一致，同時 KV cache 命中率提高，實際 token 消耗反而可能減少。

### 注意：不再支援 `/think` 軟切換

Qwen3 系列支援在 prompt 內用 `/think` 和 `/nothink` 切換模式。**Qwen3.6 移除了這個機制**，改成 API 參數控制：

- 啟用思考（預設）：正常呼叫即可
- 關閉思考（直接回應）：傳入 `enable_thinking: False`

```python
# 關閉 thinking（DashScope API）
extra_body={"enable_thinking": False}

# 關閉 thinking（自架 vLLM/SGLang）
extra_body={"chat_template_kwargs": {"enable_thinking": False}}
```

### Benchmark：Qwen3.6-27B vs 同級競品

| 任務 | Qwen3.5-27B | Qwen3.6-35B-A3B | **Qwen3.6-27B** | Claude Opus 4.5 |
|------|-------------|-----------------|-----------------|-----------------|
| SWE-bench Verified | 75.0% | 73.4% | **77.2%** | 80.9% |
| SWE-bench Pro | 51.2% | 49.5% | **53.5%** | 57.1% |
| Terminal-Bench 2.0 | 41.6% | 51.5% | **59.3%** | 59.3% |
| SkillsBench | 27.2% | 28.7% | **48.2%** | 45.3% |
| AIME 2026 | 92.6% | 92.7% | **94.1%** | 95.1% |
| GPQA Diamond | 85.5% | 86.0% | **87.8%** | 87.0% |

**Qwen3.6-27B** 在 Terminal-Bench 2.0 和 GPQA Diamond 上追平或超越 Claude Opus 4.5，而後者是閉源旗艦模型。

值得注意的是，35B-A3B（MoE）在多數 agentic coding 指標上反而略輸 27B（Dense）。Dense 架構在處理需要全局一致性的 repository-level 任務時，比 MoE 的 sparse activation 更穩定。

---

## Qwen 專模型生態

除了通用對話模型，Qwen 還有幾個重要的垂直專模型：

### Qwen2.5-Coder

以 Qwen2.5-72B 為基底的代碼專用模型。在 SWE-bench Verified 上一度是開源模型 SOTA（在 MiniMax-M2.5 超越前）。支援 92 種程式語言，128K context。

### Qwen2.5-VL

視覺語言模型。支援文件理解（包含複雜表格和版面）、數學圖表解析、影片片段問答。在 DocVQA 等文件理解 benchmark 上表現突出。

### Qwen2.5-Math

數學專用模型，對應 DeepSeek-Math 的角色。在 MATH 和 AIME 等數學 benchmark 上顯著優於同尺寸通用模型。

### qwen3-embedding

嵌入模型，用於 RAG 和語意搜尋。官方推薦三個 embedding 選項之一（另外兩個是 embeddinggemma 和 all-minilm）。

---

## Benchmark 比較

### 前沿開源模型排名（Artificial Analysis Intelligence Index，2026 Q1）

| 模型 | 分數 | 備注 |
|------|------|------|
| GLM-5（推理模式） | 50 | 開源第一 |
| Kimi K2.5 | 47 | Agent Swarm |
| **Qwen3.5** | **45** | — |
| DeepSeek-V3.1 | — | 成本最低 |

Qwen3.5 在前沿開源排名中位居第三，在 GLM-5 和 Kimi K2.5 之後。但在特定任務上，Qwen3.5-122B 的 agentic benchmark（BFCL-V4 72.2）是同類最強。

### 程式碼能力（SWE-bench Verified）

| 模型 | 分數 |
|------|------|
| MiniMax-M2.5 | 80.2% |
| Claude Opus 4.6 | 80.9% |
| Qwen3.5-27B（Dense） | 72.4% |
| GPT-5 mini | ~72% |

---

## DashScope API

Qwen 系列透過阿里雲 **DashScope** 平台提供 API，也在 OpenRouter 上可取用。

定價策略比 OpenAI 和 Anthropic 積極許多——Qwen 的旗艦模型定價通常是 Claude Sonnet 的 1/5 到 1/3。具體價格可查 DashScope 官方定價頁，會隨模型版本更新。

**部署選項：**
- **DashScope API**：阿里雲托管，最省事
- **OpenRouter**：國際市場存取，可直接比價
- **本地部署**：Ollama、vLLM、llama.cpp 都支援 Qwen 系列
- **授權**：全系列 Apache 2.0，商用無限制

---

## 什麼情境選 Qwen？

**繁體中文 / 多語言**：Qwen 對中文的支援品質在開源模型中一直領先。201 語言的覆蓋讓它在東南亞、中東等多語言場景有優勢。

**行動端 / 邊緣推論**：Qwen3.5 Small 系列是 2026 Q1 行動端的首選之一，特別是需要多模態的場景。

**Agent 任務**：Qwen3.5-122B-A10B 在 BFCL-V4（函式調用 benchmark）拿下 72.2，是這個尺寸的最強選項，適合需要穩定工具調用的 agent 應用。

**Agentic Coding / 終端機自動化**：Qwen3.6-27B 在 Terminal-Bench 2.0 達到 59.3%，追平 Claude Opus 4.5；SkillsBench 48.2% 超越 Claude Opus。用 Qwen Code（類 Claude Code 的終端 agent）搭配 DashScope API，是目前開源方案中最完整的 coding agent 組合。

**跨輪 Agent 推理一致性**：需要多步執行且要求推理脈絡連貫的場景，Qwen3.6 的 `preserve_thinking` 是目前開源模型中少見的功能，能減少跨輪推理的 token 浪費。

**成本敏感的生產環境**：35B-A3B 啟用 3B 參數能打出舊 235B 的水準，換算成推論成本，是目前性價比最高的選項之一。

**不適合 Qwen 的情境**：如果需要開源模型中的絕對排名頂點，GLM-5 目前在多數 benchmark 仍略勝；如果需要超長 context 的 agent orchestration，Kimi K2.5 的架構更專門。軟體工程的最高水位（SWE-bench ~80%+）目前仍是 Claude Opus 4.5 和 MiniMax-M2.5 的地盤，Qwen3.6-27B 的 77.2% 已經很接近但還有差距。

---

## 整體來說

Qwen 的核心優勢不是單一模型的一場勝利，而是**整個家族的密度**：通用對話、代碼、視覺、數學、嵌入、行動端——每個場景都有對應選項，全部 Apache 2.0，全部可以本地跑。

Qwen3.6 顯示了阿里在做的事：不只是刷 benchmark，而是根據社群實際使用回饋調整模型行為。Thinking Preservation 這個功能，是在開發者真正用 Qwen 跑多步 agent 之後，才有人知道需要的設計。

在 2026 年的開源模型格局裡，Qwen 代表的是「生態完整度最高的選手」。對需要在多個 AI 任務上做整合的開發者來說，能用同一個家族的模型覆蓋大多數場景，架構上的一致性是真實的優勢。

---

## 參考資料

- [Qwen3 技術報告（Hugging Face）](https://huggingface.co/papers/2505.09388)
- [Qwen3.5-397B-A17B — Hugging Face](https://huggingface.co/Qwen/Qwen3.5-397B-A17B)
- [Qwen Blog（官方技術部落格）](https://qwenlm.github.io/blog/)
- [DashScope API 平台](https://dashscope.aliyun.com/)
- [Artificial Analysis Intelligence Index](https://artificialanalysis.ai/leaderboards/models)
- [Qwen2.5-Coder 論文](https://arxiv.org/abs/2409.12186)
- [Qwen2.5-VL 論文](https://arxiv.org/abs/2502.13923)
- [Qwen3.6-35B-A3B — Hugging Face](https://huggingface.co/Qwen/Qwen3.6-35B-A3B)
- [Qwen3.6-27B — Hugging Face](https://huggingface.co/Qwen/Qwen3.6-27B)
- [Qwen Code（終端 AI agent）](https://github.com/QwenLM/qwen-code)
