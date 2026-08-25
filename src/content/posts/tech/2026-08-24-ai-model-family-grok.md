---
title: "Grok——從 314B 開源賭注到 Grok 4.6/Build/Imagine，xAI 的分發驅動追趕"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, grok, xai, model-family-grok, moe, open-source, model-selection]
lang: zh-TW
type: deep-dive
tldr: "Grok 是 xAI 的 LLM 家族，2023/07 成立、2024/03 以 314B MoE Apache 2.0 開源起手，兩年半迭代到 Grok 4.6（500K、$2/$6、四檔推理）與 2M 的 Grok 4 Fast；另有 Imagine 圖像/影片與 Grok Build 終端 coding agent——護城河在分發（X / grok.com / Tesla / Bedrock），而非單點模型能力。這篇追蹤 Grok 1→4.6 的演化、子線定位、定價與授權陷阱。"
description: "Grok（xAI）模型家族完整介紹：2023→2026 演化時間線、314B MoE 開源起點、Colossus 超算與 RL 推理擴展、Grok 4/4 Fast/4.6 定價與定位、Imagine 圖像/影片、Grok Build 終端 Agent、授權與競品對照。"
series:
  name: "AI 模型家族"
  order: 11
draft: false
glossary:
  - term: "Colossus"
    definition: "xAI 在曼菲斯自建的超算叢集，Grok 3 起的 RL 推理擴展在此訓練，規模達 20 萬張 GPU。"
  - term: "Grok Build"
    definition: "xAI 的終端原生 coding agent 框架與 TUI，支援互動、headless 與 ACP 編輯器嵌入，框架本身 Apache 2.0。"
  - term: "ACP"
    aliases: ["Agent Client Protocol"]
    definition: "讓 Agent 以標準協定嵌入編輯器的連接協議，Grok Build 與 Claude Code 等皆支援。"
  - term: "Grok Imagine"
    definition: "xAI 的圖像/影片生成模型線，透過 xAI API 以每張/每秒計費。"
---

> 🌏 [English version](/posts/tech/2026-08-24-ai-model-family-grok-en)

2024 年 3 月 17 日，xAI 把 314B 參數的 [Grok-1](https://github.com/xai-org/grok-1) 以 Apache 2.0 丟上 GitHub——當時業界還在爭「是否開源」，xAI 直接把最大的 MoE 權重開了。這是 Grok 家族的起點，也是至今唯一的開源權重。兩年半後，同一家族已長成四條線：會推理的 [Grok 4.6](https://docs.x.ai/docs/models/grok-4.6)（500K、$2/$6）、便宜到 98% 價差的 [Grok 4 Fast](https://x.ai/news/grok-4-fast)（2M）、做圖/影片的 [Imagine](https://docs.x.ai/docs/models/grok-imagine-image-2.0)，以及跑在終端機裡的 [Grok Build](https://github.com/xai-org/grok-build)。這篇追蹤 Grok 從開源賭注到全家桶的完整演化。

怎麼解讀文中引用的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。這篇是[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)系列的第十一篇家族深度介紹。

## 家族演化時間線

| 版本 | 發佈 | Context | 關鍵事實 |
|---|---|---|---|
| xAI 成立 | 2023-07-12 | — | Elon Musk 領軍，曼菲斯 Colossus 超算為底座 |
| Grok 亮相 | 2023-11-03 | 8K | 首個模型，[Announcing Grok](https://x.ai/blog/grok) |
| Grok-1 開源 | 2024-03-17 | 8K | 314B MoE（8 experts、每 token 2 個），64 層，Apache 2.0（[xai-org/grok-1](https://github.com/xai-org/grok-1) / [HF](https://huggingface.co/xai-org/grok-1)） |
| Grok-1.5 | 2024-03-28 | 128K | 16 倍 context、[NIAH 完美檢索](https://x.ai/blog/grok-1.5)，MATH 50.6% / GSM8K 90% / HumanEval 74.1% |
| Grok-1.5V | 2024-04-12 | 128K | 首個多模態（視覺），[RealWorldQA](https://x.ai/blog/grok-1.5v) |
| Grok-2 / mini | 2024-08-13 | — | [Grok-2 Beta](https://x.ai/blog/grok-2)，LMSYS `sus-column-r` 超越 Claude 3.5 Sonnet / GPT-4-Turbo；企業 API 同月上線 |
| Grok 3 / mini (Think) | 2025-02-19 | 1M | [Age of Reasoning Agents](https://x.ai/blog/grok-3)，Colossus 10 倍算力、Elo 1402（Chatbot Arena），1M context（8 倍於前代） |
| Grok 4 / Heavy | 2025-07-09 | 256K | [Grok 4](https://x.ai/news/grok-4)，256K、RL 於 20 萬 GPU Colossus，Heavy 以平行 test-time compute 取勝 |
| Grok Code Fast 1 | 2025-08-28 | 256K | [Speedy economical reasoning](https://x.ai/news/grok-code-fast-1)，為終端/編輯器而生，$1.00/$2.00 |
| Grok 4 Fast | 2025-09-19 | 2M | [2M context、40% 更少 thinking tokens、98% 價差](https://x.ai/news/grok-4-fast)，SOTA price-to-intelligence（Artificial Analysis） |
| Grok 4.3 / 4.20 | 2026-03 | 1M | 文件線仍在役，$1.25/$2.50，批次 8 折 |
| Grok 4.5 / 4.6 | 2026（文件現役） | 500K | [docs.x.ai 現役主力](https://docs.x.ai/developers/models)，$2.00/$6.00（>200K 翻倍 $4/$12），四檔推理 low/medium/high/xhigh |
| Grok Imagine | 2026 | — | 圖像 $0.02/$0.04/$0.05、影片 $0.05–$0.08/秒（[定價](https://docs.x.ai/docs/pricing)） |
| Grok Build | 2026-08-12 | — | [TUI + headless + ACP](https://docs.x.ai/build/overview)，[26k stars、Apache 2.0](https://github.com/xai-org/grok-build) |

兩年半、13 個里程碑。主線是「用算力與分發換追趕」——Colossus 每代翻倍，context 從 8K 拉到 2M，再用 X / grok.com / Tesla / Bedrock 把模型塞進分發。

## 三條子線：推理、圖像、終端

Grok 容易被當成「一個聊天模型」，實際已分三條子線，各自對位不同對手：

**推理/聊天線**（Grok 1 → 4.6 + 4 Fast）：xAI 的主戰場。[Grok 3](https://x.ai/blog/grok-3) 起以 RL 大規模擴展推理（Colossus 10 倍算力、秒到分鐘級 thinking、可回溯糾錯）；[Grok 4](https://x.ai/news/grok-4) 以 Heavy（平行 test-time compute）衝榜；[Grok 4 Fast](https://x.ai/news/grok-4-fast) 則以 2M、少 40% thinking tokens、降 98% 價格做「價效比之王」。

**圖像/影片線**（Imagine）：[grok-imagine-image](https://docs.x.ai/docs/models/grok-imagine-image-2.0)（$0.02）、[image-quality](https://docs.x.ai/docs/pricing)（$0.05）、[image-2.0](https://docs.x.ai/docs/models/grok-imagine-image-2.0)（$0.04）、[video](https://docs.x.ai/docs/pricing)（$0.05/秒）與 [video 1.5](https://docs.x.ai/docs/pricing)（$0.08/秒）。[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)的影像 ELO 顯示 [Grok Imagine 2.0](https://arena.ai/leaderboard/text-to-image) 在前五之列，但 xAI 官網的發佈文與榜單細節受 Cloudflare 阻擋未在此驗證，引用時以 LMArena/Artificial Analysis 帶日期為準。

**終端 coding 線**（Build / Code Fast）：[Grok Build](https://github.com/xai-org/grok-build) 是 xAI 的 coding agent 框架——全螢幕 TUI、可滑鼠、可擴展；支援三種跑法：互動式、headless（`grok -p "prompt" --output-format streaming-json` 供 CI/scripting）、以及經 [ACP](https://docs.x.ai/build/overview) 嵌入編輯器。框架本身 [Apache 2.0](https://github.com/xai-org/grok-build/blob/main/LICENSE)，模型側由 [Grok 4.6 驅動](https://docs.x.ai/build/overview#use-grok-46-on-the-api)（[grok-build-0.1 / grok-code-fast-1](https://docs.x.ai/docs/models/grok-build-0.1) 256K、$1/$2）。

## 架構：MoE 起手、Colossus 與 RL 擴展

### Grok-1 的 MoE 起點

[Grok-1 的 Model Specifications](https://github.com/xai-org/grok-1)（`model.py`）載明：8 個 experts、每 token 啟用 2 個、64 層、48 Q-heads / 8 KV-heads、embedding 6,144、SentencePiece 131,072、RoPE、8-bit/activation sharding。314B 總參數在當時是開源最大之一，但 8K context 與後續 128K/1M 相比已顯侷促。

### Colossus 與推理擴展

xAI 的敘事主脊是算力。[Grok 3](https://x.ai/blog/grok-3) 稱 RL 規模「前所未有」，在 Colossus 上以 10 倍於前代的算力訓練；[Grok 4](https://x.ai/news/grok-4) 進一步稱 20 萬 GPU Colossus、6 倍算力效率、10 倍於 Grok 3 reasoning 的算力。這解釋了 Grok 的迭代速度——不是架構奇襲，而是把 RL 與 test-time compute 推到極限（Heavy 以平行算力換分數）。

## 定價與效能：怎麼選

### API 定價（每百萬 tokens，來自 [docs.x.ai](https://docs.x.ai/docs/pricing)）

| 模型 | Context | Input (<200K) | Cached | Output (<200K) | Input (≥200K) | Output (≥200K) | 推理檔位 |
|---|---|---|---|---|---|---|---|
| Grok 4.6 | 500K | $2.00 | $0.50 | $6.00 | $4.00 | $12.00 | low/medium/high/xhigh（預設 high） |
| Grok 4.5 | 500K | $2.00 | $0.30 | $6.00 | $4.00 | $12.00 | 同上 |
| Grok 4.3 / 4.20（reasoning/non-reasoning/multi-agent）| 1M | $1.25 | $0.20 | $2.50 | $2.50 | $5.00 | —（批次 8 折） |
| Grok Build 0.1（Code Fast 1）| 256K | $1.00 | $0.20 | $2.00 | $2.00 | $4.00 | reasoning |
| Grok 4 Fast | 2M | —（以 4.5/4.6 為準，98% 價差）| — | — | — | — | 統一推理/非推理 |

兩個細節：**超過 200K tokens 價錢翻倍**（input 與 output 皆翻倍）；**批次 8 折**僅限 4.3/4.20。長文場景務必算翻倍後的實價。

### 效能位置（以 xAI 官方發佈為準，第三方榜單帶日期引用）

| 指標 | Grok 4（[官方](https://x.ai/news/grok-4)）| Grok 3（[官方](https://x.ai/blog/grok-3)）| 對照（系列內）|
|---|---|---|---|
| HLE（Humanity's Last Exam）| 44.4% Heavy / 38.6%（full set，含 Python+search）| — | DeepSeek V4 Pro 未披露；Claude/GPT 另見家族篇 |
| ARC-AGI v2 | 15.9%（vs Opus 8.6%）| — | — |
| GPQA | 87.5–88.4% | 84.6% | Gemini 3.1 Pro 94.1%（科學推理仍領先）|
| LiveCodeBench | 79.3% | 79.4% | DeepSeek V4 Pro 96.4%（SWE-bench Verified 不同榜）|
| AIME'25 | — | 93.3% cons@64 | — |

Grok 4 Fast 的官方對比（[Grok 4 Fast](https://x.ai/news/grok-4-fast)）：GPQA Diamond 85.7% vs Grok 4 87.5%、AIME'25 92.0% vs 91.7%、HLE 20.0% vs 25.4%、LiveCodeBench 80.0% vs 79.0%——用 2M 與 98% 價差換接近旗艦的分数。

站內 daily 的 Grok 4.6 紀錄（[Grok 4.6 daily](https://quidproquo.cc/posts/daily/2026-08-20-ai-agent-daily)）：GDPVal-AA v2 1753 Elo 全場最高，但硬核 coding（DeepSWE、Terminal-Bench）仍落後 GPT-5.6 Sol Max——呼應家族篇的「分發強、硬核 coding 仍追趕」定位。

### 怎麼選

- **要最強推理且需 500K** → Grok 4.6（high/xhigh），注意 >200K 翻倍。
- **要價效比與 2M 長文** → Grok 4 Fast，少 40% thinking tokens、98% 價差，保 85%+ GPQA。
- **要終端 coding agent** → Grok Build（框架 Apache 2.0）+ grok-build-0.1 / 4.6 API，支援 headless/ACP。
- **要圖/影片生成** → Imagine image $0.02–$0.05 / video $0.05–$0.08/秒，依品質檔位選。
- **要本地自架** → 只有 Grok-1（314B、Apache 2.0），後續皆閉源 API。

## 授權陷阱：開源只有一次

Grok 的授權是系列中最「斷崖」的一個：

- **Grok-1**：[Apache 2.0](https://github.com/xai-org/grok-1)，可商用、可自架、可改作——但 8K context、2024 年架構，已非前沿。
- **Grok 1.5 / 2 / 3 / 4 / 4 Fast / 4.5 / 4.6**：閉源 API，無權重下載。授權即 [xAI 服務條款](https://x.ai/legal/terms-of-service)。
- **Grok Build 框架**：[Apache 2.0](https://github.com/xai-org/grok-build/blob/main/LICENSE)，框架開源、模型閉源——可自架 harness，不可自架模型。
- **Grok Imagine**：API 計費，無權重。

對比：Qwen（多數 Apache 2.0）、DeepSeek（MIT）、Gemma（Apache 2.0，2B–27B）、Llama 4（Community License，可下載）、Mistral（Apache/Modified MIT）皆有可商用自架權重；Grok 只有 Grok-1 可自架，且與現役主力差距兩個世代。

## 子線與生態系

| 子線 | 代表版本 | 定位 |
|---|---|---|
| 旗艦推理 | Grok 4.6 500K | 最強推理，四檔可調，$2/$6 |
| 長文價效比 | Grok 4 Fast 2M | 2M、98% 價差、SOTA price-to-intelligence |
| 1M 旗艦 | Grok 4.3 / 4.20 1M | 1M、$1.25/$2.50、批次 8 折 |
| 輕量推理 | Grok Code Fast 1 / Build 0.1 256K | 終端/編輯器 coding，$1/$2 |
| 圖像 | Imagine image / image-quality / 2.0 | $0.02/$0.05/$0.04 每張 |
| 影片 | Imagine video / 1.5 | $0.05/$0.08 每秒 |
| 終端 Agent | Grok Build | TUI + headless + ACP，Apache 2.0 框架 |
| 開源權重 | Grok-1 314B | 唯一開源，Apache 2.0，8K |

兩個觀察：

**分發是 Grok 最被低估的槓桿。** X（Twitter）內建、grok.com、Tesla 車機、[Amazon Bedrock](https://aws.amazon.com/bedrock)（社群回報 2026-08 上架，本文撰寫時 xAI 官網未列，需以 AWS 公告為準）——Gro k 的觸達不靠榜單，靠 Elon 體系的分發。這也是 xAI 敢以「更快迭代、更低價格」換追趕的底氣。

**Build 的開源是 harness 開源。** [xai-org/grok-build](https://github.com/xai-org/grok-build)（26k stars）與 [grok-build-plugin-cc](https://github.com/xai-org/grok-build-plugin-cc) 開的是框架與 Claude Code 外掛，模型仍走 [xAI API](https://docs.x.ai/docs/models/grok-4.6)。對 Agent 開發者而言，Build 的價值是「可審、可改、可嵌」的 harness，而非可自架的模型。

## 跟競品的位置

把 Grok 放回 2026 年的格局：

- **對上 GPT-5.6**：GPT 在 SWE-bench Verified / Terminal-Bench / BrowseComp 等硬核 agentic 榜上仍領先 Grok（daily 紀錄 Grok 4.6 落後 Sol Max）；Grok 以 2M/500K 與更低定價追趕
- **對上 Claude Opus 5**：Claude 在 SWE-bench Verified 96% 與 agentic 穩定性領先；Grok 的優勢是分發與 terminal 原生（Build 對位 Claude Code）
- **對上 Gemini 3.1 Pro**：Gemini 在 GPQA 94.1% / ARC-AGI-2 77.1% 科學推理領先；Grok 在 HLE/ARC-AGI v2 有亮點但非全面超越
- **對上 DeepSeek V4**：DeepSeek 以 MIT + 1/28 價格在 SWE-bench 追平 Claude，Grok 無可商用自架權重（僅 Grok-1），私有化需走 xAI 官方部署
- **對上 Qwen3.8 / Kimi K3 / GLM-5.3**：三家皆有 1T+ 開源權重，Grok 無對等開源旗艦；Grok 的差異化是 Imagine 與 Build 的產品線寬度
- **對上開源小模型**：Grok 無 Phi/Gemma/Ornith 對位的開源小模型線，邊緣/本地場景不在 Grok 主線

## 對 Agent 開發者的意義

- **長文推理** → Grok 4 Fast（2M）或 Grok 4.6（500K）——>200K 注意翻倍，4.3/4.20 的 1M + 批次 8 折適合離峰批次
- **終端 coding** → Grok Build（Apache 2.0 框架）+ grok-build-0.1/4.6——headless 供 CI、ACP 供編輯器，對打 Claude Code
- **圖/影片生成** → Imagine（$0.02–$0.08）——與文字推理同帳號、同 API、同分發
- **X / Tesla 生態** → 已在 X 或 Tesla 體系內的產品，Grok 的整合阻力最小
- **高吞吐/成本敏感** → Grok 4 Fast 的 98% 價差 + 2M 是目前最激進的價效比定位；明確 bug fix 仍可考慮 DeepSeek V4 Pro（SWE-bench 96.4%，極低價）
- **本地/私有部署** → 僅 Grok-1 可自架；需私有化走 xAI API / 官方部署，評估供應商鎖定與 >200K 翻倍成本

務實的混用策略：

| 任務 | 推薦 | 原因 |
|---|---|---|
| 長文推理/研究 | Grok 4 Fast 2M 或 Grok 4.6 500K | 2M/500K + 四檔推理可調 |
| 終端 coding agent | Grok Build + grok-build-0.1 | harness 開源、可審可嵌 |
| 圖/影片生成 | Imagine image 2.0 / video 1.5 | 同 xAI 帳號一站式 |
| 明確 bug fix | DeepSeek V4 Pro | SWE-bench 96.4%，成本極低 |
| 複雜 agentic 編排 | Claude Opus 5 / GPT-5.6 Sol | agentic 穩定性仍領先 Grok |
| 本地部署 | Qwen3.8-27B / Gemma 3 27B | Grok 無現役開源權重 |

## 整體來說

Grok 的故事是「用分發與算力換追趕」。xAI 從 314B 開源起手證明誠意，之後把籌碼全押在 Colossus 的 RL 擴展與 X / Tesla / Bedrock 的分發——模型不是單點產品，而是 Elon 體系的流量入口。2026 年的 Grok 已非單一模型，而是四件套：500K 的 4.6、2M 的 4 Fast、做圖的 Imagine、跑終端的 Build。

代價是開放度與硬核 coding 的差距。旗艦無開源權重、Build 開的是 harness 而非模型；HLE/ARC-AGI 有亮點，但在 SWE-bench / Terminal-Bench 等工程榜上仍落後 GPT-5.6 與 Claude。這決定了 Grok 的務實定位：**分發內的預設選擇、長文價效比之王、終端原生 Agent 的第二選**——而非「最強 coding 模型」的替代。

---

## 參考資料

- [xAI 官方網站](https://x.ai)
- [Announcing Grok — xAI Blog](https://x.ai/blog/grok) — 2023-11-03 首發
- [Open Release of Grok-1 — xAI](https://x.ai/blog/grok-1) / [xai-org/grok-1 — GitHub](https://github.com/xai-org/grok-1) — 314B MoE、Apache 2.0
- [Grok-1 — HuggingFace (xai-org/grok-1)](https://huggingface.co/xai-org/grok-1) — 314B、Apache 2.0
- [Announcing Grok-1.5 — xAI Blog](https://x.ai/blog/grok-1.5) — 128K、NIAH
- [Grok-1.5 Vision Preview — xAI Blog](https://x.ai/blog/grok-1.5v) — 首個多模態
- [Grok-2 Beta Release — xAI Blog](https://x.ai/blog/grok-2) — Grok-2 / mini、LMSYS
- [Grok 3 Beta — The Age of Reasoning Agents — xAI Blog](https://x.ai/blog/grok-3) — 1M、Elo 1402、Colossus 10 倍
- [Grok 4 — xAI News](https://x.ai/news/grok-4) — 256K、Heavy、HLE/ARC-AGI
- [Grok Code Fast 1 — xAI News](https://x.ai/news/grok-code-fast-1) — 終端/編輯器 coding
- [Grok 4 Fast — xAI News](https://x.ai/news/grok-4-fast) — 2M、98% 價差、40% 更少 thinking
- [xAI Docs — Models](https://docs.x.ai/developers/models) — 現役模型清單、context、推理檔位
- [xAI Docs — Pricing](https://docs.x.ai/docs/pricing) — 全模型定價、>200K 翻倍、批次
- [Grok 4.6 — xAI Docs](https://docs.x.ai/docs/models/grok-4.6) — 500K、$2/$6
- [Grok Build 0.1 — xAI Docs](https://docs.x.ai/docs/models/grok-build-0.1) — 256K、$1/$2
- [Grok Imagine Image 2.0 — xAI Docs](https://docs.x.ai/docs/models/grok-imagine-image-2.0) — $0.04
- [Grok Build — GitHub (xai-org/grok-build)](https://github.com/xai-org/grok-build) — 26k stars、Apache 2.0、TUI/ACP
- [Grok Build Plugin CC — GitHub](https://github.com/xai-org/grok-build-plugin-cc) — Claude Code 外掛
- [Grok Build Overview — xAI Docs](https://docs.x.ai/build/overview) — 三種跑法、ACP
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站
