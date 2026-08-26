---
title: "Nous Research：從研究社群到開源 AI 生態系的反叛者"
date: 2026-08-26
category: tech
type: deep-dive
tags: [nous-research, open-source, reinforcement-learning, fine-tuning, hermes-agent, llama, code-model]
lang: zh-TW
series:
  name: "AI 模型家族"
  order: 15
tldr: "Nous Research 不預訓練，只做 fine-tuning 和 RL——Hermes 4 在 MATH-500 拿 96.3%，NousCoder-14B 只用 24K 樣本就把 Qwen3-14B 的 coding 能力拉高 7%。但真正的護城河是 Hermes Agent 框架：236K GitHub stars，全球第 19 名，3,000 位貢獻者。"
description: "Nous Research 深入介紹：團隊背景、Hermes 4 與 NousCoder 模型、DataForge + Atropos 訓練方法論、Hermes Agent 框架生態，以及 uncensored AI 哲學的爭議與影響。"
draft: false
glossary:
  - term: "Rejection Sampling"
    def: "從模型產出的多個回應中，只挑通過品質門檻的樣本進入訓練集，確保訓練資料品質"
  - term: "RefusalBench"
    def: "測量模型拒絕回答合理請求頻率的 benchmark——分數越高代表模型越少不必要地拒答"
---

> 🌏 [English version](/en/posts/tech/2026-08-26-nous-research-hermes-en)

Nous Research 的起源不是某個創辦人的車庫，而是一群開源 LLM 社群的研究者自發聚在一起。2023 年由 Jeffrey Quesnelle、Karan Malhotra、Shivani Mitra 和社群暱稱 Teknium 的研究者共同成立，從鬆散的研究社群變成一間公司。他們的主張很明確：AI 不應該有過度的安全護欄，使用者有權決定模型該回答什麼。這個哲學讓他們在開源社群有了忠實追隨者，也讓他們成為爭議的焦點。

## 不預訓練的策略

跟 [Ornith（DeepReinforce）](/posts/tech/2026-08-26-ornith-deepreinforce-model-family)一樣，Nous Research 不自己從頭預訓練基礎模型。他們站在 Meta 的 Llama 和阿里的 Qwen 肩膀上，把資源集中在 fine-tuning 和強化學習。

但他們的 fine-tuning 不是一般的 SFT。Nous 自研了兩套工具：

- **[DataForge](https://github.com/NousResearch/DataForge)**：圖結構合成資料產生器。不是隨便讓 GPT-4 產問答對，而是用圖的方式建構知識關係，確保訓練資料的多樣性和覆蓋度
- **[Atropos](https://github.com/NousResearch/Atropos)**：開源 RL 框架，核心是 rejection sampling——模型產出多組回應，只有通過驗證的才進入訓練。NousCoder 更進一步用 execution-reward RL：程式碼會被實際執行，依正確性給獎勵

這套流程讓他們用相對少的運算資源產出高品質的模型。

## Hermes 4：混合推理模型

Hermes 4 於 2025 年 8 月發布，基於 Llama 3.1，有 14B、70B 和 405B 三個規模。旗艦 405B 用 192 張 NVIDIA B200 訓練，總計 71,616 GPU 小時。訓練資料包含 350 萬條推理樣本和 160 萬條非推理樣本。

它的特色是**混合推理模式**——可以開關「思考」功能。開啟時走長鏈推理（類似 o1），關閉時走一般對話。

Hermes 4 405B 的成績（推理模式）：

| Benchmark | Hermes 4 405B | 對比 |
|---|---|---|
| MATH-500 | **96.3%** | — |
| AIME 2024 | **81.9%** | — |
| AIME 2025 | **78.1%** | — |
| RefusalBench | **57.1%** | GPT-4o 17.67%、Claude Sonnet 4 17% |

RefusalBench 的差距值得注意：Hermes 4 回答了 57.1% 的請求，而 GPT-4o 和 Claude Sonnet 4 只回答了約 17%。這反映的是 Nous 的核心哲學——減少不必要的拒答。這個數字是優點還是風險，取決於你的使用場景和對 AI 安全的看法。

## NousCoder-14B：24K 樣本的效率示範

2026 年 1 月發布的 [NousCoder-14B](https://huggingface.co/NousResearch/NousCoder-14B) 基於 Qwen3-14B，用 execution-reward RL 訓練。最引人注目的數字不是分數本身，而是**訓練規模**：只用了 24,000 個樣本。

| Benchmark | NousCoder-14B | Qwen3-14B（基底） | 提升 |
|---|---|---|---|
| LiveCodeBench v6 | **67.87%** Pass@1 | ~60.79% | +7.08% |

更重要的是，NousCoder-14B 是**完全可重現**的——訓練程式碼、資料集、benchmark 工具鏈全部公開。在多數團隊只釋出權重的環境下，這是難得的透明度。

## Hermes Agent：比模型更大的生態系

Nous 真正的護城河可能不是模型，而是 [Hermes Agent](https://github.com/NousResearch/hermes-agent) 框架。截至 2026 年 8 月，它有 **236,000 個 GitHub stars**（全球第 19 名）、超過 3,000 位貢獻者，是 2026 年成長最快的開源 agent 框架。

Hermes Agent 的設計哲學：

- **自架優先**：模型跑在本地，不依賴任何雲端 API
- **模型無關**：可以接任何 LLM，不綁定 Nous 的模型
- **持久記憶**：agent 有長期記憶，不是每次對話從零開始
- **自我改進**：agent 可以學習新技能並持續優化
- **多 agent 通訊**：支援 bot-to-bot 訊息傳遞

這個框架的成功讓 Nous 從「做模型的小團隊」變成「有生態系的平台」。即使他們的模型在 benchmark 上不是最高分，龐大的使用者社群也為他們提供了持續的影響力。

## 授權與限制

授權是 Nous 的弱點之一。因為不自己預訓練，模型的授權繼承自基底模型：

- **Hermes 4**：跟隨 Llama 3.1 的社群授權——開源，但月活超過 7 億的應用需要向 Meta 申請額外授權
- **NousCoder-14B**：跟隨 Qwen3 的 Apache 2.0 授權——完全開放
- **Hermes Agent 框架**：開源

跟 Ornith 的 MIT 全開放比起來，Hermes 4 的授權限制（來自 Llama 3.1）在大規模部署時需要注意。

## 值不值得關注

**值得，原因不只一個：**

1. **訓練效率**——24K 樣本做出的 NousCoder-14B 比基底模型強 7%，而且完全可重現。這證明「有好的 RL 框架，資料量不是決定性的」
2. **生態系**——Hermes Agent 236K stars 不是虛的。模型可以被替換，生態系不容易被取代
3. **哲學定位**——uncensored AI 有爭議，但也有確實的需求場景（研究、安全測試、內部工具）

**需要保留的地方：**

- Uncensored 模型在面對惡意使用時缺乏防護，不適合面向一般使用者的產品
- 模型授權繼承自基底，不如 Ornith（MIT）或 DeepSeek（MIT）乾淨
- 團隊規模約 30-50 人，長期維護能力是未知數

## 參考資料

- [Nous Research 官網](https://nousresearch.com)
- [Hermes Agent — GitHub](https://github.com/NousResearch/hermes-agent)
- [Atropos RL 框架 — GitHub](https://github.com/NousResearch/Atropos)
- [DataForge — GitHub](https://github.com/NousResearch/DataForge)
- [NousCoder-14B — Hugging Face](https://huggingface.co/NousResearch/NousCoder-14B)
- [Hermes 4 — Hugging Face](https://huggingface.co/NousResearch)
- [Ornith：小團隊用自我改進 RL 做出的開源 Coding 黑馬](/posts/tech/2026-08-26-ornith-deepreinforce-model-family)
