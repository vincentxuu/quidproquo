---
title: "Claude——從 AI 安全實驗室到 SWE-bench 冠軍，閉源 Agent 最強選擇"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, claude, anthropic, model-family-claude, constitutional-ai, agentic-coding, model-selection]
lang: zh-TW
type: deep-dive
tldr: "Claude 是 Anthropic 推出的閉源 LLM 家族，以 Constitutional AI 訓練、Agent 能力和 Coding 表現聞名。2026 年 7 月的 Opus 5 以 SWE-bench Verified 96% 拿下 coding 冠軍，Fable 5 則以 LiveBench 83% 領跑通用能力。四層產品線（Fable / Opus / Sonnet / Haiku）從 $1 到 $10 覆蓋不同場景，是系列裡唯一完全沒有開放權重的家族。"
description: "Claude 模型家族完整介紹：從 2023 年 Claude 1 到 2026 年 Fable 5 的演化脈絡、API 平台與消費級產品線分家、Constitutional AI 與 Agent 架構、四層產品線定價比較、SWE-bench/LiveBench benchmark 數據、以及 Agent 開發者的選型指南"
series:
  name: "AI 模型家族"
  order: 7
draft: false
glossary:
  - term: "Constitutional AI"
    aliases: ["CAIS", "Constitutional AI Safety"]
    definition: "Anthropic 開發的 AI 對齊方法——用一套憲法原則（constitution）指導模型行為，讓模型自我批評和修正，減少人類標註依賴"
  - term: "MCP"
    aliases: ["Model Context Protocol"]
    definition: "Anthropic 提出的工具整合標準協議，讓 LLM 能統一呼叫外部工具和資料源，被稱為 AI 模型的 USB-C 接口"
  - term: "Adaptive Thinking"
    definition: "Claude 的動態推理機制——模型根據問題複雜度自動決定思考深度，簡單問題快速回答，複雜問題深入推理"
  - term: "Claude Code"
    definition: "2025 年 2 月隨 Claude 3.7 Sonnet 推出的 CLI 編碼 Agent，深度整合檔案讀寫、Git 操作與多檔案編輯工作流"
---

> 🌏 [English version](/posts/tech/2026-08-24-ai-model-family-claude-en)

2023 年 3 月，當 OpenAI 的 GPT-4 剛上線時，Anthropic 在同一週悄悄發佈了 Claude——一個以「安全」為核心設計哲學的語言模型。三年半後的 2026 年 7 月，Claude Opus 5 在 SWE-bench Verified 拿下 96%，成為 coding 能力最強的模型；Claude Fable 5 在 LiveBench 以 83% 領跑通用能力排行榜。這是「AI 模型家族」系列的第七篇深度介紹，追蹤 Claude 從 Claude 1 到 Fable 5 的完整演化。

怎麼解讀文中引用的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。這篇是[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)系列的一部分。

## 家族演化時間線

| 版本 | 時間 | 關鍵事實 |
|---|---|---|
| Claude 1 | 2023-03 | 首個公開模型，9K context，Constitutional AI 訓練 |
| Claude 2 | 2023-07 | 100K context，首次大規模公開，引用《世界人權宣言》原則 |
| Claude 2.1 | 2023-11 | 200K context，系統提示、tool use 實驗 |
| Claude 3 Opus/Sonnet/Haiku | 2024-03 | 三層產品線確立，多模態（視覺） |
| Claude 3.5 Sonnet | 2024-06 | Sonnet 品質超越前代 Opus，Artifacts 功能 |
| Claude 3.5 Sonnet (new) | 2024-10 | Computer Use 公測 |
| Claude 3.7 Sonnet | 2025-02 | 首個混合推理模型，Claude Code 啟動 |
| Claude 4 Opus/Sonnet | 2025-05 | Agent 編碼世代，MCP 標準化 |
| Claude 4.5 Sonnet/Haiku/Opus | 2025-09~11 | Sonnet 首次超越 Opus 基準 |
| Claude 4.6 Opus/Sonnet | 2026-02 | Agent Teams、1M context |
| Claude 4.7 Opus | 2026-04 | 新 tokenizer、adaptive thinking |
| Claude 4.8 Opus | 2026-05 | Dynamic Workflows、effort 控制 |
| Claude Fable 5 | 2026-06 | Mythos 級首次公開，LiveBench #1（83%） |
| Claude Sonnet 5 | 2026-06 | 最強 agentic Sonnet，$2/$10 定價 |
| Claude Opus 5 | 2026-07 | SWE-bench Verified 96%，coding 冠軍 |

三年半、15 個里程碑。Claude 的演化有一條清晰的主線：**從安全研究到 Agent 能力的逐步釋放**。3.7 Sonnet 引入推理、4.0 引入 Agent、4.6 引入 1M context、5.0 把所有能力推到極致，並在 2026 年 6 月新增 Mythos 級的 Fable 5，把產品線從三層拉到四層。

## 兩條產品線：API 平台 vs 消費級 Claude，加上四層推論等級

看懂 Claude 在 2026 年的動作，關鍵是把它拆成兩條平行線，再加上一張四層推論等級表：

**API 平台線**（developer / enterprise）：所有推理都走 Anthropic 官方 API，或經授權的雲端——AWS Bedrock、Google Cloud Vertex AI、Microsoft Foundry。這條線負責開發者與企業營收，也是 Claude Code、MCP、各種 Agent 工作流的承載層。

**消費級 Claude app 線**：面向終端使用者的 claude.ai 與桌面/行動 App，把同一批模型包成對話、寫作、分析產品。這條線不對外開放權重，也不提供自架選項。

中間還有推論等級的分層——2026 年 6 月 Claude 從三層擴展為四層，新增 Mythos 級（以 Fable 5 為公開版）：

| 項目 | Fable 5 | Opus 5 | Sonnet 5 | Haiku 4.5 |
|---|---|---|---|---|
| 定位 | 最強推理，長時間 Agent | 複雜 coding，企業工作 | 日常 coding，高吞吐 | 快速回應，低成本 |
| Input ($/MTok) | $10 | $5 | $2 | $1 |
| Output ($/MTok) | $50 | $25 | $10 | $5 |
| Cache 命中 | $1 | $0.50 | $0.20 | $0.10 |
| Batch API | $5/$25 | $2.50/$12.50 | $1/$5 | $0.50/$2.50 |
| Context | 1M | 1M | 1M | 200K |
| Max output | 128K | 128K | 128K | 64K |
| Adaptive thinking | 永遠開啟 | 預設開啟 | 預設開啟 | — |
| 延遲 | 最慢 | 中等 | 快 | 最快 |

定價有兩個值得記住的細節。其一是**五代 Opus 維持相同定價**：從 Opus 4.5 到 Opus 5，全部是 $5/$25，只有已退役的 Opus 4.1（$15/$75）不同——如果你還在用舊版 Opus 是為了「重現性」，你並沒有省到錢。其二是 **Sonnet 5 的「降價升級」**：從 Sonnet 4.6 的 $3/$15 降到 $2/$10，且永久維持（原訂 8/31 恢復 $3/$15 後取消），讓它成為 Claude 生態中性價比最高的選項。另外，Fast mode 讓 Opus 5 以 2.5x 速度運行、定價 $10/$50——恰好等於 Fable 5 的標準價格，用 Opus 5 fast mode 的人值得先試 Fable 5 標準模式。

## 架構：從安全研究到 Agent 能力

### Constitutional AI

Claude 從第一天就用 Constitutional AI 訓練。這個方法的核心是：不靠大量人類標註來判斷「什麼是好回答」，而是用一套**憲法原則**（constitution）讓模型自我批評和修正。

訓練過程分兩階段：

1. **監督學習階段**：讓模型生成回答，再根據憲法原則自我批評，產生修正後的版本，用這些版本微調
2. **RLAIF 階段**（RL from AI Feedback）：讓模型根據憲法原則評估兩個回答哪個更好，用這個偏好訓練獎勵模型，再用 RL 強化

這個方法的優勢是可擴展性——不依賴昂貴的人類標註，又能精確控制模型行為。Claude 2 的憲法引用了《世界人權宣言》等文件的原則，這也是為什麼 Claude 的拒答邊界由 Anthropic 決定、企業無法鬆綁。

### Adaptive Thinking

從 Claude 4.7 開始引入，到 Claude 5 成為預設行為。Adaptive Thinking 讓模型根據問題複雜度自動決定推理深度：

- 簡單問題（「1+1=？」）→ 直接回答，不消耗額外思考 token
- 複雜問題（「修復這個 bug」）→ 自動啟動深度推理

這跟 DeepSeek-R1 的固定推理路線不同——Adaptive Thinking 是動態的，不需要使用者手動選擇。Fable 5 把它設成永遠開啟，Opus 5 與 Sonnet 5 為預設開啟。

### MCP（Model Context Protocol）

2024 年 11 月發佈的工具整合標準。MCP 讓 Claude 能以統一協議呼叫外部工具和資料源，類似 AI 模型的 USB-C 接口。它已成為業界事實標準——OpenAI、Google、Microsoft 都已支援或宣布支援。對 Agent 開發者來說，這是 Claude 生態外溢影響力最大的那一環。

### Claude Code

2025 年 2 月隨 Claude 3.7 Sonnet 一起推出的 CLI 編碼工具。Claude Code 讓開發者在終端機中直接與 Claude 協作編碼，支援檔案讀寫、Git 操作、多檔案編輯。到 2026 年，它已成為 Anthropic 最重要的產品之一——不只是模型的包裝，而是深度整合了 Agent 工作流。

## Claude 5 系列：Fable 5 和 Opus 5 怎麼選

2026 年 6–7 月的 5 世代四層產品線，定位完全不同：

| 項目 | Fable 5 | Opus 5 | Sonnet 5 | Haiku 4.5 |
|---|---|---|---|---|
| 定位 | 最強推理，長時 Agent | 複雜 coding，企業工作 | 日常 coding，高吞吐 | 快速回應，低成本 |
| Input ($/MTok) | $10 | $5 | $2 | $1 |
| Output ($/MTok) | $50 | $25 | $10 | $5 |
| Context | 1M | 1M | 1M | 200K |
| Max output | 128K | 128K | 128K | 64K |
| Adaptive thinking | 永遠開啟 | 預設開啟 | 預設開啟 | — |
| 推薦場景 | 長程規劃、最難推理 | agentic coding 首選 | 預設推薦、平衡成本 | 分類/抽取、高吞吐 |

定價與規格來自[Claude 官方模型總覽](https://platform.claude.com/docs/en/about-claude/models/overview)與[Claude Pricing](https://platform.claude.com/docs/en/about-claude/pricing)。

### 授權陷阱：只有商用 API，沒有開放權重

Claude 是系列裡**唯一完全沒有開放權重的家族**——只有商用 API，沒有可下載的權重，也沒有 Apache/MIT 授權。它的「授權」就是 Anthropic 的服務條款（Terms of Service）和可使用政策（Acceptable Use Policy）。這帶來三個但書：

- **無法自架**：所有推理都必須走 Anthropic 的 API 或經授權的雲端（AWS Bedrock、GCP Vertex）。資料主權敏感的行業（醫療、國防）若要完全在地部署，Claude 直接出局
- **條款可變**：Anthropic 保留隨時調整價格、速率限制、可接受使用範圍的權利。2024 年曾因政策轉向引發開發者反彈
- **安全過濾不可關閉**：Constitutional AI 的拒答邊界由 Anthropic 決定，企業無法鬆綁——對需要處理灰色地帶內容的 Agent 場景是實質限制

對比 Qwen（Apache 2.0 / 自訂）、Llama 4（Community License，至少可下載）、DeepSeek（MIT）、Mistral（Apache/Modified MIT），Claude 的「開放度」是系列中最低的。如果你的部署依賴「能自己掌握模型」，Claude 不在選項內——這一行比 benchmark 分數更重要。

### 效能位置：coding 與 agentic 任務領先，但定價最高

**SWE-bench Verified**（真實軟體工程任務）：

| 模型 | 分數 | 定價 (output/MTok) |
|---|---|---|
| **Claude Opus 5** | **96%** | $25 |
| Claude Mythos 5 | 95.5% | $50 |
| Claude Fable 5 | 95% | $50 |
| DeepSeek V4 Pro 0813 | 96.4% | $0.87 |
| Claude Opus 4.8 | 88.6% | $25 |
| Kimi K3 | 93.4% | — |

Claude Opus 5 在 SWE-bench Verified 上以 96% 領先（Vals AI 獨立測試為 97%）。值得注意的是 DeepSeek V4 Pro 以 96.4% 幾乎追平，但 output 定價只有 Claude 的 1/28。

**SWE-bench Pro**（更難的軟體工程任務）：

| 模型 | 分數 |
|---|---|
| **Claude Mythos 5** | **80.3%** |
| Claude Fable 5 | 80% |
| Claude Opus 5 | 79.2% |

**LiveBench**（通用能力）：

| 模型 | Overall | Coding |
|---|---|---|
| **Claude Fable 5** | **83.0%** | 86.0% |
| GPT-5.6 Sol | 81.1% | 83.9% |
| Claude Opus 5 | 80.1% | 81.4% |
| Claude Sonnet 5 | 76.0% | 80.7% |

**跟競品的定位**：

| 指標 | Claude Fable 5 | GPT-5.6 Sol | DeepSeek V4 Pro |
|---|---|---|---|
| LiveBench overall | **83.0%** | 81.1% | 77.4% |
| SWE-bench Verified | 95% | ~95% | 96.4% |
| Output 定價 ($/MTok) | $50 | ~$30 | $0.87 |
| Context | 1M | 1M | 1M |
| 開源 | ✗ | ✗ | ✓ MIT |

Claude 在 coding 和 agentic 任務上領先，但定價最高。DeepSeek 在 SWE-bench Verified 上以 1/28 的價格幾乎追平——純 benchmark 之外，選 Claude 買的是整體 agentic 穩定性和企業支援。

## 子線與生態系：一張表看懂 Claude 有多少模型

「家族小」是 Claude 最容易被低估的特徵——它幾乎沒有獨立的視覺、語音、嵌入專模型線，子線都是同一個底座的不同服務層級：

| 子線 | 代表版本 | 定位 |
|---|---|---|
| 旗艦推理 | Claude Fable 5 | 最高智慧層，複雜推理與長程規劃 |
| 高端 | Claude Opus 5 | 高品質 coding / agentic |
| 中端 | Claude Sonnet 5 | 平衡品質與成本，預設推薦 |
| 輕量 | Claude Haiku 4.5 | 高速低價，分類 / 抽取 |
| 終端 Agent | Claude Code | 命令列 coding agent |
| 開放標準 | MCP（Model Context Protocol） | 開源協議，讓 Agent 接外部工具 |
| 企業產品 | Claude for Work / Teams | 企業版權限與治理 |

兩個觀察：

**MCP 是 Claude 最被低估的生態槓桿。** Anthropic 把 Model Context Protocol 開源，現在已成為 Agent 接外部工具的事實標準——即使你不跑 Claude，你的 Agent 基礎設施很可能已經建立在 MCP 上。這讓 Claude 的影響力超出單一模型範圍。

**產品線高度集中在 API 層。** 不像 Qwen 有 Coder/VL/Omni/Image 多條子線、DeepSeek 有 V3/R1/Coder 多線並行，Claude 的子線幾乎都是同一個底座的不同服務層級（Fable/Opus/Sonnet/Haiku），沒有獨立的視覺、語音、嵌入專模型線。這讓它的生態比開源家族窄，但產品體驗更一致。

## 跟競品的位置

把 Claude 放回 2026 年的格局：

- **對上 GPT-5.6**：Claude 在 coding（SWE-bench Verified 95%）和 agentic 可靠性上領先，GPT 在瀏覽器任務（BrowseComp 90.4%）和長時間 Agent（Agents' Last Exam）上更強。兩家是閉源雙雄，選誰往往取決於具體任務
- **對上 Gemini 3.1**：Gemini 在科學推理（GPQA 94.1%）和原生多模態上領先，Claude 在 coding 和文字任務上更穩
- **對上 DeepSeek V4**：DeepSeek 在 SWE-bench Verified（96.4%）以 1/28 價格追平甚至超越 Claude，且 MIT 授權可自架。Claude 的優勢是整體 agentic 穩定性和企業支援，不是純 benchmark
- **對上 Qwen3.8 / Kimi K3**：兩家都提供 2T 級開放權重，Claude 品質仍領先但價格是開源的數十倍，且無法自架
- **對上 Llama 4 / Mistral**：Llama 4（Community License，至少可下載）、Mistral（Apache/Modified MIT）都能自架，Claude 在 agentic 穩定性和工具生態（MCP）上領先，但開放度最低、價格最高
- **對上 GLM**：GLM 走開源＋國產合規路線，Claude 在英文 coding 與國際工具鏈整合上更成熟

## 對 Agent 開發者的意義

- **多步驟自主 Agent** → Claude 的 agentic 能力（tool use、computer use、multi-step planning）是目前所有模型中最穩定的。BrowseComp、OSWorld 等 Agent benchmark 上 Claude 持續領先
- **Coding agent 的長時間任務** → Opus 5 和 Fable 5 能維持數小時的自主編碼 session，不會丟失上下文
- **企業級 tool 整合** → MCP 協議已經是業界標準，Claude 對 MCP 的支援最原生
- **安全敏感場景** → Constitutional AI 的對齊品質在所有前沿模型中最好，Opus 5 被 Anthropic 認證為「最對齊的模型」
- **高吞吐 / 成本敏感 production** → Sonnet 5 的 $10/MTok 已經很划算，但 DeepSeek V4 Flash 的 $0.28 是另一個量級；明確的 bug fix 可用 DeepSeek V4 Pro（SWE-bench 96.4%，成本 1/28）
- **本地部署** → Claude 是閉源的，無法自架。需要本地部署請看 Qwen 或 DeepSeek

最務實的混用策略是**根據任務選模型**：

| 任務 | 推薦模型 | 原因 |
|---|---|---|
| 複雜 Agent 編排 | Claude Opus 5 / Fable 5 | agentic 能力最強 |
| 日常 coding agent | Claude Sonnet 5 | 品質夠好，成本低 60% |
| 明確的 bug fix | DeepSeek V4 Pro | SWE-bench 96.4%，成本 1/28 |
| 高吞吐分類/摘要 | DeepSeek V4 Flash | $0.14 input，2,500 並行 |
| 本地部署 | Qwen3.8-27B | Apache 2.0，可自架 |

## 整體來說

Claude 的故事是「安全研究如何變成商業競爭力」。Anthropic 從 AI 安全出發，用 Constitutional AI 建立了模型對齊的技術壁壘，再用 MCP 和 Claude Code 把模型能力轉化為開發者工具。2026 年的四層產品線——Fable（最強推理）、Opus（coding）、Sonnet（日常）、Haiku（快速）——覆蓋了從 $1 到 $10 的每個價格帶。

對 Agent 開發者來說，Claude 目前是 tool use 和多步驟自主任務的首選。Opus 5 在 SWE-bench Verified 96% 幾乎追平 DeepSeek V4 Pro，但 agentic benchmark 上的差距仍然明顯。如果你在做需要長時間自主運行的 Agent，Claude 的可靠性目前無人能及——只是這份可靠性不能用「自架」換來，也不能用開源授權鎖住。

---

## 參考資料

- [Anthropic 官方網站](https://www.anthropic.com)
- [Claude Models Overview — Claude Platform Docs](https://platform.claude.com/docs/en/about-claude/models/overview)
- [Claude Pricing — Claude Platform Docs](https://platform.claude.com/docs/en/about-claude/pricing)
- [Introducing Claude Opus 5](https://www.anthropic.com/news/claude-opus-5)
- [Introducing Claude Sonnet 5](https://www.anthropic.com/news/claude-sonnet-5)
- [Claude Fable 5 and Claude Mythos 5](https://www.anthropic.com/news/claude-fable-5-mythos-5)
- [Constitutional AI: Harmlessness from AI Feedback (arXiv:2212.08073)](https://arxiv.org/abs/2212.08073)
- [Claude Model History — ClaudeKit Guide](https://getclaudekit.com/blog/models/claude-model-history)
- [SWE-bench Verified Leaderboard](https://www.swebench.com)
- [LiveBench Leaderboard](https://livebench.ai)
- [Vals AI SWE-bench Results](https://www.vals.ai/benchmarks/swebench)
- [Anthropic Wikipedia](https://en.wikipedia.org/wiki/Anthropic)
- [Claude (AI) Wikipedia](https://en.wikipedia.org/wiki/Claude_(AI))
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站