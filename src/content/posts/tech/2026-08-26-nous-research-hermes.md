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
tldr: "Nous Research 不預訓練，只做 fine-tuning 和 RL——Hermes 4 在 MATH-500 拿 96.3%，NousCoder-14B 只用 24K 樣本就把 Qwen3-14B 的 coding 能力拉高 7%。但真正的護城河是 Hermes Agent 框架：236K GitHub stars，全球第 19 名，3,000 位貢獻者。模型線另有 Hermes 4.3-36B（Seed-OSS 底、在 Psyche 網路上完成後訓練）、數學專用的 Nomos 1，以及 2026-11-06 用 Inkling 當 teacher、調整 Qwen3.8-27B 價值觀的 Arete-27B。"
description: "Nous Research 深入介紹：團隊背景、Hermes 4／4.3、NousCoder、Nomos 1 與 Arete-27B 模型、DataForge + Atropos 訓練方法論、Hermes Agent 框架生態，以及 uncensored AI 哲學的爭議與影響。"
draft: false
glossary:
  - term: "Rejection Sampling"
    def: "從模型產出的多個回應中，只挑通過品質門檻的樣本進入訓練集，確保訓練資料品質"
  - term: "RefusalBench"
    def: "測量模型拒絕回答合理請求頻率的 benchmark——分數越高代表模型越少不必要地拒答"
---

> :globe: [English version](/posts/tech/2026-08-26-nous-research-hermes-en)

Nous Research 的起源不是某個創辦人的車庫，而是一群開源 LLM 社群的研究者自發聚在一起。2023 年由 Jeffrey Quesnelle、Karan Malhotra、Shivani Mitra 和社群暱稱 Teknium 的研究者共同成立，從鬆散的研究社群變成一間公司。他們的主張很明確：AI 不應該有過度的安全護欄，使用者有權決定模型該回答什麼。這個哲學讓他們在開源社群有了忠實追隨者，也讓他們成為爭議的焦點。

## 家族定位與版本矩陣

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式 |
|---|---|---|---|
| Hermes 4 | 混合推理／對話 | 70B／405B（Llama 3.1 底）與 14B（Qwen3-14B 底）；可切換思考 | Hugging Face 權重；70B／405B 為 Llama 3 授權、14B 為 Apache 2.0；405B 在 OpenRouter |
| Hermes 4.3-36B | 中尺寸混合推理 | Seed-OSS-36B 底；官方稱約等於 Hermes 4 70B | Hugging Face；Apache 2.0 |
| NousCoder-14B | 程式碼 RL | Qwen3-14B 基底 | Hugging Face；Apache 2.0 |
| Nomos 1 | 數學解題與證明 | Qwen3-30B-A3B-Thinking-2507 底，搭配 Nomos 推理 harness | Hugging Face；Apache 2.0 |
| Arete-27B | 價值觀調整的通用助理 | Qwen3.8-27B 底，只做 SFT，teacher 是 Inkling | Hugging Face；Apache 2.0 |
| Hermes Agent | 模型無關工作流 | 框架，並非模型版本 | GitHub；可接其他模型 |

## 家族演化

Hermes 4 於 2025 年 8 月發布，NousCoder-14B 在 2026 年 1 月接續推出；家族從混合推理延伸到可重現的 coding RL，Hermes Agent 則提供獨立於模型的工作流。

| 時間 | 版本 | 改變了什麼選型 |
|---|---|---|
| 2025-08 | Hermes 4（70B／405B／14B） | 混合推理旗艦；70B／405B 繼承 Llama 3.1 授權，14B 換成 Qwen3 底、Apache 2.0 |
| 2025-11 | Hermes 4.3-36B | 第一個在 Psyche 去中心化網路上完成後訓練的 Hermes；Apache 2.0 的中尺寸選項，不受 Llama 授權限制 |
| 2025-12 | Nomos 1 | 與 Hillclimb AI 合作的數學專用模型，要搭 Nomos 推理 harness 用 |
| 2026-01 | NousCoder-14B | execution-reward RL 的 coding 模型，訓練流程完全公開 |
| 2026-02 | Hermes Agent | 官方 releases 頁列為正式發布的 agent 框架 |
| 2026-11-06 | Arete-27B | 第一個以「調整基底模型價值觀」為目標的模型，用 SFT 而非 RL |

## 架構與訓練取捨

### 不預訓練的策略

跟 [Ornith（DeepReinforce）](/posts/tech/2026-08-26-ornith-deepreinforce-model-family)一樣，Nous Research 不自己從頭預訓練基礎模型。他們站在 Meta 的 Llama 和阿里的 Qwen 肩膀上，把資源集中在 fine-tuning 和強化學習。

但他們的 fine-tuning 不是一般的 SFT。Nous 自研了兩套工具：

- **[DataForge](https://github.com/NousResearch/DataForge)**：圖結構合成資料產生器。不是隨便讓 GPT-4 產問答對，而是用圖的方式建構知識關係，確保訓練資料的多樣性和覆蓋度
- **[Atropos](https://github.com/NousResearch/Atropos)**：開源 RL 框架，核心是 rejection sampling——模型產出多組回應，只有通過驗證的才進入訓練。NousCoder 更進一步用 execution-reward RL：程式碼會被實際執行，依正確性給獎勵

這套流程讓他們用相對少的運算資源產出高品質的模型。

### Hermes 4：混合推理模型

Hermes 4 於 2025 年 8 月發布，70B 與 405B 基於 Llama 3.1，14B 則改用 Qwen3-14B 當底（Hugging Face 的 `base_model` 欄）。旗艦 405B 用 192 張 NVIDIA B200 訓練，總計 71,616 GPU 小時。訓練資料包含 350 萬條推理樣本和 160 萬條非推理樣本。

它的特色是**混合推理模式**——可以開關「思考」功能。開啟時走長鏈推理（類似 o1），關閉時走一般對話。

### NousCoder-14B：24K 樣本的效率示範

2026 年 1 月發布的 [NousCoder-14B](https://huggingface.co/NousResearch/NousCoder-14B) 基於 Qwen3-14B，用 execution-reward RL 訓練。最引人注目的數字不是分數本身，而是**訓練規模**：只用了 24,000 個樣本。

更重要的是，NousCoder-14B 是**完全可重現**的——訓練程式碼、資料集、benchmark 工具鏈全部公開。在多數團隊只釋出權重的環境下，這是難得的透明度。

### Hermes 4.3-36B：在網路上分散訓練

[Hermes 4.3-36B](https://huggingface.co/NousResearch/Hermes-4.3-36B) 以 ByteDance 的 Seed-OSS-36B-Base 為底，是第一個在 [Psyche](https://psyche.network) 網路上以去中心化方式完成後訓練的 Hermes。模型卡同時列了 Psyche 版與集中式訓練版的成績，Psyche 版在 AIME 24／25、GPQA Diamond 等項略高於集中式版本，和 Hermes 4 70B 互有勝負。後訓練資料從 Hermes 3 的約 100 萬筆、12 億 token 擴大到約 500 萬筆、600 億 token。

### Nomos 1：數學專用

[Nomos 1](https://huggingface.co/NousResearch/nomos-1) 是和 Hillclimb AI 合作、以 Qwen3-30B-A3B-Thinking-2507 為底的數學解題與證明模型，設計上要和同時開源的 [Nomos 推理 harness](https://github.com/NousResearch/nomos) 一起用；模型卡建議不要加 system prompt。

### Arete-27B：用 SFT 調整價值觀

[Arete-27B](https://huggingface.co/NousResearch/Arete-27B)（2026-11-06）以 Qwen3.8-27B 為底，Nous 在模型卡寫明目的是「reinforce western values on a Chinese-trained model」：他們觀察到 Qwen3.8-27B 在政治敏感題目上有拒答、迴避與官方框架的回答，於是針對言論自由、國家意識形態、民主、資料隱私等七個類別調整。

做法只有 SFT，沒有 RL、偏好優化或架構修改：用 Inkling 當 teacher 產生約兩萬個提示的回答，以 64K context、約 5,280 萬 token 訓練兩個 epoch；視覺編碼器凍結，訓練資料只有文字。選開放模型當 teacher，官方說是為了避開蒸餾閉源模型的使用條款問題。

## 評測與競品比較

Hermes 4 405B 的成績採推理模式；NousCoder-14B 以 LiveCodeBench v6 Pass@1 對照 Qwen3-14B 基底。任務與尺寸不同，這兩張表不能合成單一家族排名。


### Hermes 4 推理模式結果

Hermes 4 405B 的成績（推理模式）：

| Benchmark | Hermes 4 405B | 對比 |
|---|---|---|
| MATH-500 | **96.3%** | — |
| AIME 2024 | **81.9%** | — |
| AIME 2025 | **78.1%** | — |
| RefusalBench | **57.1%** | GPT-4o 17.67%、Claude Sonnet 4 17% |

RefusalBench 的差距值得注意：Hermes 4 回答了 57.1% 的請求，而 GPT-4o 和 Claude Sonnet 4 只回答了約 17%。這反映的是 Nous 的核心哲學——減少不必要的拒答。這個數字是優點還是風險，取決於你的使用場景和對 AI 安全的看法。


### NousCoder-14B 程式碼比較

| Benchmark | NousCoder-14B | Qwen3-14B（基底） | 提升 |
|---|---|---|---|
| LiveCodeBench v6 | **67.87%** Pass@1 | ~60.79% | +7.08% |

### Hermes 4.3、Nomos 1 與 Arete-27B 的官方數字

三個模型各自用不同評測，以下分開列，不合成排名：

- **Hermes 4.3-36B**：RefusalBench 非推理模式 74.60%、推理模式 72.29%，高於 Hermes 4 70B 推理模式的 59.50%（模型卡，5 次平均）。Psyche 版 AIME 25 為 69.3、GPQA Diamond 65.5；Hermes 4 70B 分別是 67.4 與 66.1。
- **Nomos 1**：Putnam 2025 在 Nomos 推理 harness 下 87/120，同條件的 Qwen3-30B-A3B-Thinking-2507 是 24/120。這個分數綁定 harness，不是模型單獨作答的結果。
- **Arete-27B**：在 Nous 自建、803 題的 [Propaganda_Eval](https://huggingface.co/datasets/NousResearch/Propaganda_Eval) 上，事實分數從 2.32 升到 2.98（滿分 5），含宣傳框架的回答從 22% 降到 0.9%，評分模型是 Grok 4.7。模型卡說七個類別都有改善，通用能力與 agent 評測「沒有明顯退步」，但這是 Nous 自己的評測與判準，題目與框架定義也是他們設計的。

## 授權、價格與部署

託管端點目前查得到的是 OpenRouter 上的 `nousresearch/hermes-4-405b`，provider 為 Nebius，每百萬 token input $1、output $3（資料日期 2026-11-23）；其他模型本篇未整理託管價格與硬體預算。框架授權與模型繼承的權重授權要分開審查。

### 授權與限制

授權是 Nous 的弱點之一。因為不自己預訓練，模型的授權繼承自基底模型：

- **Hermes 4 70B／405B**：跟隨 Llama 3.1 的社群授權——開源，但月活超過 7 億的應用需要向 Meta 申請額外授權
- **Hermes 4 14B、Hermes 4.3-36B、NousCoder-14B、Nomos 1、Arete-27B**：Hugging Face 標 Apache 2.0，沒有 Llama 的月活門檻
- **Hermes Agent 框架**：開源

跟 Ornith 的 MIT 全開放比起來，Hermes 4 70B／405B 的授權限制（來自 Llama 3.1）在大規模部署時需要注意；要避開這個限制，同家族的 Apache 2.0 選項是 Hermes 4.3-36B 與 14B。

## Agent 使用與選型

### Hermes Agent：比模型更大的生態系

Nous 真正的護城河可能不是模型，而是 [Hermes Agent](https://github.com/NousResearch/hermes-agent) 框架。截至 2026 年 8 月，它有 **236,000 個 GitHub stars**（全球第 19 名）、超過 3,000 位貢獻者，是 2026 年成長最快的開源 agent 框架。

Hermes Agent 的設計哲學：

- **自架優先**：模型跑在本地，不依賴任何雲端 API
- **模型無關**：可以接任何 LLM，不綁定 Nous 的模型
- **持久記憶**：agent 有長期記憶，不是每次對話從零開始
- **自我改進**：agent 可以學習新技能並持續優化
- **多 agent 通訊**：支援 bot-to-bot 訊息傳遞

這個框架的成功讓 Nous 從「做模型的小團隊」變成「有生態系的平台」。即使他們的模型在 benchmark 上不是最高分，龐大的使用者社群也為他們提供了持續的影響力。

### 模型怎麼選

- 要自架、少拒答的通用助理，又要避開 Llama 授權：Hermes 4.3-36B。
- 要最大的 Hermes、走 API：Hermes 4 405B（OpenRouter）。
- 競賽式程式題：NousCoder-14B；數學證明：Nomos 1，記得搭 Nomos harness。
- 需要 Qwen 系模型在政治敏感題目上不照官方框架回答：評測 Arete-27B，並用自己的題目驗證，因為公開的改善數字只來自 Nous 的評測集。

## 限制與取捨

### 選用理由與保留條件

**選用時可考慮的理由：**

1. **訓練效率**——24K 樣本做出的 NousCoder-14B 比基底模型強 7%，而且完全可重現。這證明「有好的 RL 框架，資料量不是決定性的」
2. **生態系**——Hermes Agent 236K stars 不是虛的。模型可以被替換，生態系不容易被取代
3. **哲學定位**——uncensored AI 有爭議，但也有確實的需求場景（研究、安全測試、內部工具）

**需要保留的地方：**

- Uncensored 模型在面對惡意使用時缺乏防護，不適合面向一般使用者的產品
- 模型授權繼承自基底，70B／405B 不如 Ornith（MIT）或 DeepSeek（MIT）乾淨
- Arete-27B 的價值觀調整有明確立場，是否符合你的需求要自己判斷；它不是「中立化」，而是換成另一套價值觀
- 團隊規模約 30-50 人，長期維護能力是未知數

## 更新紀錄

- 2026-11-23：補上 Hermes 4.3-36B（2025-11）、Nomos 1（2025-12）與 Arete-27B（2026-11-06）：版本矩陣、家族演化時間線、各自的訓練方式與官方數字、授權與選型。修正 Hermes 4 14B 的底模：原文寫三個尺寸都基於 Llama 3.1，實際上 14B 是 Qwen3-14B、Apache 2.0。補 OpenRouter 上 Hermes 4 405B 的價格。
- 2026-10-11：整理格式、版本矩陣與選型章節，沿用既有來源與日期；本次未重新查證事實。

## 參考資料

- [Nous Research 官網](https://nousresearch.com)
- [Hermes Agent — GitHub](https://github.com/NousResearch/hermes-agent)
- [Atropos RL 框架 — GitHub](https://github.com/NousResearch/Atropos)
- [DataForge — GitHub](https://github.com/NousResearch/DataForge)
- [NousCoder-14B — Hugging Face](https://huggingface.co/NousResearch/NousCoder-14B)
- [Hermes 4 — Hugging Face](https://huggingface.co/NousResearch)
- [Nous Research Releases](https://nousresearch.com/releases)
- [Hermes 4.3-36B — Hugging Face](https://huggingface.co/NousResearch/Hermes-4.3-36B)
- [Introducing Hermes 4.3 — Nous Research](https://nousresearch.com/introducing-hermes-4-3/)
- [Nomos 1 — Hugging Face](https://huggingface.co/NousResearch/nomos-1)
- [Nomos 推理 harness — GitHub](https://github.com/NousResearch/nomos)
- [Arete-27B — Hugging Face](https://huggingface.co/NousResearch/Arete-27B)
- [Arete — Nous Research](https://nousresearch.com/arete)
- [Propaganda_Eval 資料集 — Hugging Face](https://huggingface.co/datasets/NousResearch/Propaganda_Eval)
- [OpenRouter：nousresearch/hermes-4-405b](https://openrouter.ai/nousresearch/hermes-4-405b)
- [Ornith：小團隊用自我改進 RL 做出的開源 Coding 黑馬](/posts/tech/2026-08-26-ornith-deepreinforce-model-family)
