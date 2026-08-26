---
title: "Ornith：小團隊用自我改進 RL 做出的開源 Coding 黑馬"
date: 2026-08-26
category: ai
type: deep-dive
tags: [open-source, reinforcement-learning, agentic-coding, moe, code-model, benchmark, qwen, gemma]
lang: zh-TW
tldr: "DeepReinforce 用 self-improvement RL 訓練的 Ornith 1.5 家族：397B 旗艦在 SWE-bench Verified 拿 86.0 追平 Claude Opus 4.8，35B-A3B 每 token 只啟用 3B 參數卻在同量級 coding benchmark 全面領先，9B 版本可以跑在手機上。MIT 授權、完全開源。"
description: "Ornith 模型家族深入介紹：DeepReinforce 團隊背景、self-scaffolding 訓練方法論、三個規模的 benchmark 對比、實際部署方式與開源生態意義。"
draft: false
glossary:
  - term: "MoE"
    def: "Mixture of Experts，混合專家架構——模型有多組參數但每次只啟用一部分，兼顧能力和效率"
  - term: "GRPO"
    def: "Group Relative Policy Optimization，一種不需要 value model 的強化學習演算法，直接用組內相對獎勵更新策略"
  - term: "SWE-bench"
    def: "Software Engineering Benchmark，用真實 GitHub issue 測量模型解決軟體工程問題能力的標準測試集"
---

> 🌏 [English version](/en/posts/ai/2026-08-26-ornith-deepreinforce-model-family-en)

DeepReinforce 不是大廠。不是阿里、不是 Meta、不是 Google——是一個專注在 agentic coding 和強化學習的小團隊。但他們在 2026 年 8 月發布的 Ornith 1.5 家族，在多個 coding benchmark 上追平甚至超越了 Claude Opus 4.8，而且全部 MIT 授權開源。這篇整理他們怎麼做到的、值不值得關注。

## 團隊與定位

DeepReinforce（官網 [deep-reinforce.com](https://deep-reinforce.com)、產品頁 [ornith.ai](https://ornith.ai)）的核心主張是：與其手工設計 agent 的 scaffold 和訓練資料，不如讓模型自己學會怎麼搭 scaffold、自己產出訓練題目。

他們不從頭預訓練基礎模型——Ornith 建立在 Qwen3.5 和 Gemma 4 之上，透過繼續預訓練（CPT）、中間訓練和後訓練做出基底，再用自研的 self-improvement RL 框架做最後一哩。這個策略讓小團隊不需要幾千張 GPU 也能做出有競爭力的模型。

## 訓練方法：從 Self-Scaffolding 到 Self-Improvement

Ornith 的訓練方法是它最有意思的部分。

**Ornith 1.0** 引入 self-scaffolding：模型不只學解題，還學怎麼搭建解題用的 scaffold（工具呼叫策略、程式碼結構、推理框架）。scaffold 和解題 rollout 透過 GRPO 聯合優化。

**Ornith 1.5** 把這個迴圈擴展成完整的 self-improvement loop，加入了三個聯合優化的階段：

1. **Task Generation**——模型自己出題。依據 validity（題目合理）、frontier difficulty（剛好在模型能力邊緣）、novelty（不重複已見過的題）三個訊號給獎勵
2. **Scaffold Construction**——模型為每道題設計解題 scaffold
3. **Solution Rollout**——模型在 scaffold 裡執行解題，rollout 的獎勵回傳給前兩個階段

依 Ornith 官方技術報告所述：「Repeated over training, this creates a closed self-improvement loop in which stronger policies enable the generation of harder and more informative tasks, evolving scaffolds discover better ways to elicit the model's capabilities, and higher-quality rollouts provide increasingly effective learning signals.」

簡單說：模型越強 → 出的題越難 → scaffold 越聰明 → 解題品質越高 → 模型更強。這個正向循環不依賴人工標註的資料集，理論上可以持續改進。

## 模型家族規格

Ornith 1.5 有三個規模，全部 MIT 授權、權重公開在 [Hugging Face](https://huggingface.co/ornith-ai)：

| 模型 | 架構 | 總參數 | 每 token 啟用 | 特點 |
|---|---|---|---|---|
| Ornith 1.5-397B | MoE | 397B | 未公開 | 旗艦，追平閉源頂尖 |
| Ornith 1.5-35B-A3B | MoE | 35B | ~3B | 效率怪物，同量級王者 |
| Ornith 1.5-9B | Dense | 9B | 9B | 有量化版可跑手機 |

9B 版本提供 `Ornith-1.5-9B-Mobile` 量化版，官方表示可以部署在 iPhone 和 Android 裝置上。

## Benchmark 對比

以下數據來自 Ornith 官方技術報告，所有 Ornith 成績為五次獨立測試的平均值。

### 旗艦 397B vs 閉源頂尖

| Benchmark | Ornith 1.5-397B | Claude Opus 4.8 | GLM-5.2 | DeepSeek-V4-Flash |
|---|---|---|---|---|
| Terminal-Bench 2.1 | **86.1** | 85.0 | 82.7 | 82.7 |
| SWE-bench Verified | **86.0** | 85.8 | — | — |
| DeepSWE | 56.0 | **59.0** | 46.2 | 54.4 |
| GPQA Diamond | **92.8** | — | — | — |
| BrowseComp | **86.6** | — | — | — |

397B 在 Terminal-Bench 和 SWE-bench 上略贏 Claude Opus 4.8，DeepSWE 則小輸。整體而言與最強閉源模型打成平手——對一個開源模型來說這是很高的水準。

### 35B-A3B：真正的驚喜

35B-A3B 是整個家族最值得關注的成員。每個 token 只啟用約 3B 參數，卻在 coding benchmark 上全面領先同量級甚至更大的模型：

| Benchmark | Ornith 1.5-35B | Qwen3.6-35B | Gemma 4-31B | Muse Glimmer-30B | Qwen3.5-397B |
|---|---|---|---|---|---|
| SWE-bench Verified | **79.0** | 73.4 | 52.0 | 76.0 | 76.4 |
| SWE-bench Pro | **59.6** | 49.5 | 35.7 | — | — |
| SWE-bench Multilingual | **71.4** | 67.2 | — | — | 69.3 |
| Terminal-Bench 2.1 (Terminus-2) | **67.8** | 52.5 | 42.1 | 51.7 | 53.5 |
| Terminal-Bench 2.1 (Claude Code) | **68.5** | 49.2 | 43.4 | — | — |
| DeepSWE | **22** | 0 | 0 | — | 1 |
| NL2Repo | **46.2** | 29.4 | — | — | 36.8 |
| GPQA Diamond | **89.2** | 86.0 | — | — | 88.4 |

幾個重點：

- **SWE-bench Verified 79.0** 是同量級（30B-35B）唯一破 79 的模型，甚至超越 11 倍大的 Qwen3.5-397B（76.4）
- **DeepSWE 22 vs 0**——同量級的 Qwen3.6-35B 和 Gemma 4-31B 在這個 benchmark 上直接掛零，差距最為懸殊
- 在純推理（HLE with tools）上，35B 的 33.4 仍落後 Qwen3.5-397B 的 48.3，規模差距在通用推理上還是存在

### 9B：手機上的 Coding Agent

| Benchmark | Ornith 1.5-9B | Qwen3.5-9B |
|---|---|---|
| Terminal-Bench 2.1 | **46.2** | 21.3 |

9B 在 Terminal-Bench 上超過 Qwen3.5-9B 兩倍以上。官方稱 9B 的表現已經追平甚至超越 Gemma 4-31B 和 Qwen 3.6-35B 這些大好幾倍的模型。

## 實際使用

Ornith 相容 OpenAI API 格式，可以用 vLLM 或 SGLang 部署。依 GitHub repo 說明，可以直接接入 Claude Code、OpenCode 等 agentic coding CLI：

```python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1", api_key="EMPTY")
response = client.chat.completions.create(
    model="Ornith-1.5-35B-A3B",
    messages=[{"role": "user", "content": "Fix the bug in this function..."}]
)
```

35B-A3B 因為每 token 只啟用 3B 參數，推論成本遠低於同分數的模型。社群已有人在單張 A100 上跑 35B 本地部署的實測報告。9B 量化版甚至可以跑在消費級 GPU（12 GB 起）或手機上。

## 值不值得關注

**值得，原因有三：**

1. **方法論的意義**——self-improvement loop 不依賴人工標註就能持續改進。如果這條路可行，代表小團隊也能持續追趕甚至超越大廠的專有資料優勢
2. **效率的示範**——35B-A3B 用 3B 的推論成本做到 79 分的 SWE-bench，讓「自架開源模型做 agentic coding」從理論變成可行方案
3. **完全開源**——MIT 授權，權重、程式碼全公開，沒有「開源但不給商用」的限制

**需要保留的地方：**

- Benchmark 數據來自 Ornith 自己的測試，獨立第三方大規模複現還在進行中
- 通用推理能力（HLE、MATH）仍落後同規模閉源模型，Ornith 的強項集中在 coding 和 agentic 任務
- 團隊規模小，模型的長期維護和迭代速度是未知數

## 參考資料

- [Ornith 1.5 官方技術報告](https://ornith.ai/ornith_1_5.html)
- [DeepReinforce 官網](https://deep-reinforce.com)
- [Ornith GitHub Repository](https://github.com/ornith-ai/Ornith-1)
- [Ornith Hugging Face 模型頁](https://huggingface.co/ornith-ai)
- [Ornith 1.5 35B-A3B Benchmark 分析 — MindStudio](https://www.mindstudio.ai/blog/ornith-1-5-35b-a3b-benchmarks)
- [Ornith 1.5 Self-Improvement Loop 解析 — MindStudio](https://www.mindstudio.ai/blog/ornith-1-5-self-improvement-loop)
- [AI 模型用途總覽——2026 年你該知道的模型地圖](/posts/tech/2026-08-24-ai-model-landscape-overview)
