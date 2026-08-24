---
title: "GPT——閉源 API 收營收、開源 GPT-OSS 補生態，統一路由架構的全球最大 AI 平台"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, gpt, openai, model-family-gpt, reasoning, agentic-coding, model-selection]
lang: zh-TW
type: deep-dive
tldr: "GPT 是 OpenAI 推出的 LLM 家族，從 2018 年的 117M 參數到 2026 年的 GPT-5.6 Sol/Terra/Luna 三層產品線，擁有超過 10 億使用者和 200 萬企業客戶。GPT-5.6 Sol 在 LiveBench 81.1%、Terminal-Bench 2.1 88.8%、Artificial Analysis Coding Agent Index 80 等多項 benchmark 領先，同時首次推出開源模型 GPT-OSS（Apache 2.0）。"
description: "GPT 模型家族完整介紹：從 2018 年 GPT-1 到 2026 年 GPT-5.6 的演化脈絡、閉源 API 線與開源 GPT-OSS 線的雙軌策略、GPT-5 統一路由架構、Sol/Terra/Luna 三層定價比較、benchmark 數據、以及 Agent 開發者的選型指南"
series:
  name: "AI 模型家族"
  order: 3
draft: false
glossary:
  - term: "RLHF"
    def: "Reinforcement Learning from Human Feedback，用人類回饋做强化學習的對齊方法，GPT-3.5 和 ChatGPT 的核心訓練技術"
  - term: "Reasoning effort"
    def: "GPT-5.6 的推理深度控制參數——從 none 到 max，讓使用者在速度和品質之間做選擇"
  - term: "Programmatic Tool Calling"
    def: "GPT-5.6 的新功能——模型能在記憶體中寫程式並執行，協調多個工具處理中間結果"
  - term: "GPT-OSS"
    def: "OpenAI 首次開源的權重模型（2025/08），包含 120B 和 20B 兩個尺寸，Apache 2.0 授權"
---

> 🌏 [English version](/posts/tech/2026-08-24-ai-model-family-gpt-en)

2022 年 11 月 30 日，ChatGPT 上線，5 天內達到 100 萬使用者，兩個月內突破 1 億——人類歷史上成長最快的消費產品。四年後的 2026 年 7 月，GPT-5.6 Sol/Terra/Luna 三層產品線正式上線，覆蓋從 $0.20 到 $30 的每個價格帶，OpenAI 使用者數突破 10 億、企業客戶超過 200 萬。這是「AI 模型家族」系列的第三篇家族深度介紹，追蹤 GPT 從 GPT-1 到 GPT-5.6 的完整演化。

怎麼解讀文中引用的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。這篇是[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)系列的一部分。

## 家族演化時間線

| 版本 | 發佈 | 關鍵事實 |
|---|---|---|
| GPT-1 | 2018-06 | 117M 參數，首個生成式預訓練模型 |
| GPT-2 | 2019-02 | 1.5B 參數，以「太危險」延遲釋出，引發安全辯論（後全開源）|
| GPT-3 | 2020-05 | 175B 參數，few-shot 學習，API 開放（半開放，需申請）|
| GPT-3.5 | 2022-03 | ~175B，RLHF 微調，ChatGPT 的基礎 |
| ChatGPT | 2022-11 | ~175B，消費級 AI 革命，2 個月破 1 億使用者 |
| GPT-4 | 2023-03 | ~1T（MoE），多模態，通過律師考試 90th percentile |
| GPT-4 Turbo | 2023-11 | ~1T，128K context，更快更便宜 |
| GPT-4o | 2024-05 | 原生多模態（文字＋視覺＋語音）|
| o1 | 2024-09 | 首個推理模型，「先想再說」|
| o3 / o4-mini | 2025-04 | 推理模型升級 |
| GPT-4.1 | 2025-04 | API 專用，1M context |
| GPT-5 | 2025-08 | 統一路由架構：快速模型＋推理模型＋即時路由器 |
| GPT-5.5 | 2026-04 | 效率與 Agent 能力提升，1M context |
| GPT-OSS | 2025-08 | OpenAI 史上首次開源權重：120B / 20B，Apache 2.0 |
| GPT-5.6 Sol/Terra/Luna | 2026-07 | 三層產品線，1.05M context |

八年、多個里程碑。GPT 的主線很清楚：**從研究論文到消費產品到平台生態**。GPT-3 證明 scaling law，ChatGPT 創造消費需求，GPT-4 確立品質標準，GPT-5 之後專注 Agent 能力與效率優化。2025 年還多了一條支線——第一次把權重放出來（GPT-OSS）。

## 兩條產品線：閉源 API 收營收，開源 GPT-OSS 補生態

看懂 GPT 在 2026 年的佈局，關鍵是把它拆成兩條線——和 Qwen 相反的方向（Qwen 是開源起家、近年往閉源收），GPT 是閉源起家、近年才往開源補：

**閉源 API 線**（OpenAI 官方 API / ChatGPT / Azure OpenAI Service）：GPT-5 之後的旗艦全部只在 API 上，無權重可下載。2026 年這條線從單一 GPT-5 細分成 Sol（旗艦）/ Terra（平衡）/ Luna（高效）三個 SKU，覆蓋每個價格帶。這條線負責營收——10 億使用者與 200 萬企業客戶都跑在這上面。

**開源權重線**（GPT-OSS）：2025 年 8 月才首次釋出 120B 與 20B 兩個尺寸，Apache 2.0。這條線負責生態位——給需要自架、微調、資料主權的開發者一條退路，但明確不是前沿模型。

中間的轉折值得記：OpenAI 從 2019 年 capped-profit 轉型、2026 年傳出 IPO，商業壓力只增不減。GPT-OSS 的開源更像戰略回應（對上 Llama、Qwen、DeepSeek 的開源攻勢），而不是路線回歸——閉源旗艦這條主軸從沒鬆動過。

## 架構：為什麼一個系統能打多種任務

### 統一路由架構：一個系統，不是一個模型

2025 年 8 月的 GPT-5 標誌著 OpenAI 從「單一模型」轉向「統一系統」：

**GPT-5 = 快速模型 + 推理模型 + 即時路由器**

路由器根據對話類型、複雜度、工具需求和使用者明確意圖（例如「仔細想想」），即時決定用哪個模型。概念類似 Anthropic 的 adaptive thinking，但 GPT-5 的實現更明確——背後是兩個獨立模型，而 Claude 是一個模型內部調整推理深度。

實用意義是開發者不用選模型，系統自動決定。但代價是路由行為不透明，有時模型選擇不符合預期，成本可控性也隨之下降。

### GPT-5.6 的推論效率：模型在幫自己降價

2026 年 7 月的 GPT-5.6 上線後經歷兩次降價，背後是效率紅利：GPT-5.6 Sol 幫自己優化了推論 kernel，端到端服務成本降 20%；speculative decoding 效率提升 15%。模型在幫自己降價。

- **2026/07/30**：Luna 降 80%（從 $1/$6 → $0.20/$1.20），Terra 降 20%
- **2026/08/21**：Sol 降 20%+（促銷價至 11/21）

這是 OpenAI 在 2026 年的核心策略：用效率換價格帶，把前沿品質往下壓到更多層級。

### 原生多模態與 GPT-OSS 架構

GPT-4o（2024-05）確立了原生多模態路線——文字、視覺、語音在同一模型內處理，不是外掛 adapter。這條能力延續到 GPT-5 主線。

另一邊的 GPT-OSS 是 OpenAI 第一次把權重交出去。120B 與 20B 兩個尺寸都支援 function calling 與 structured outputs，可在自有基礎設施部署，授權是乾淨的 Apache 2.0。雖然品質落後閉源旗艦一大截，但它證明 OpenAI 也開始認真經營開源生態位。

## GPT-5.6：Sol、Terra、Luna 怎麼選

2026 年 7 月的三層命名，定位完全不同：

| 項目 | GPT-5.6 Sol | GPT-5.6 Terra | GPT-5.6 Luna |
|---|---|---|---|
| 定位 | 旗艦推理，複雜任務 | 日常平衡，高性價比 | 高吞吐，低成本 |
| Input ($/MTok) | $5 | $2 | $0.20 |
| Output ($/MTok) | $30 | $12 | $1.20 |
| Long context input | $10 | $4 | $0.40 |
| Long context output | $45 | $18 | $1.80 |
| Cache 命中 | $0.50 | $0.20 | $0.02 |
| Batch API | $2.50 / $15 | $1 / $6 | $0.10 / $0.60 |
| Fast mode | $10 / $60 | $4 / $24 | $0.40 / $2.40 |
| Context | 1.05M | 1.05M | 1.05M |
| Max output | 128K | 128K | 128K |
| Reasoning effort | none → max | none → max | none → max |
| 授權 | 閉源 API | 閉源 API | 閉源 API |

### 授權陷阱：旗艦閉源，開源的不是前沿

OpenAI 的授權佈局是系列裡最分層的——開源和閉源之間有一道明確界線：

- **閉源旗艦（GPT-5.6 全系列）**：只有 API，無權重，授權即 OpenAI 服務條款。最強模型完全不可自架
- **開源權重（GPT-OSS 120B / 20B）**：Apache 2.0，可下載、微調、自架——但只有中大型（120B）和中小型（20B），不是前沿模型
- **歷史遺留**：GPT-2 全開源，GPT-3 半開放（經申請），GPT-4 起完全閉源

這裡的但書是：**「OpenAI 開源」≠「最強模型開源」**。GPT-OSS 是真 Apache 2.0，授權比 Llama 4 的 Community License 乾淨，但 120B 的活躍參數和品質都落後 GPT-5.6 Sol 一大截。如果你的場景需要「Apache 2.0 + 前沿品質」，GPT-OSS 給不了，得看 DeepSeek（MIT）或 Qwen（多數 Apache）。

另一個陷阱是 **API 定價波動**：OpenAI 在 2025–2026 年多次調整 GPT 定價（多數是降價，但也曾對長 context 加價），合約期內的價格不保證長期不變。還有一個容易被忽略的細節——**超過 272K input tokens 後，input 加倍、output 加 50%**。長文件 workload（codebase、合約、會議記錄）的實際成本比短 context 定價高約 2 倍。

### 效能位置

| 指標 | GPT-5.6 Sol | 對照 |
|---|---|---|
| [Artificial Analysis Coding Agent Index](https://artificialanalysis.ai) | **80** | Terra 77.4；Claude Fable 5 77.2；GPT-5.5 76.4；Claude Opus 4.8 72.5。Sol 用的 output token 不到 Fable 5 一半、時間一半、成本約 1/3 |
| [LiveBench](https://livebench.ai) Overall | **81.1%** | Claude Fable 5 83.0%；GPT-5.5 80.2%；Claude Opus 5 80.1%；Terra 77.9% |
| Terminal-Bench 2.1 | **88.8%** | Sol Ultra 91.9%；Claude Mythos 5 88%；GPT-5.5 85.6%；Fable 5 83.1% |
| BrowseComp | **90.4%** | Sol Ultra 92.2%；Claude Mythos 5 88%；Terra 87.5%；Fable 5 84.3% |
| Agents' Last Exam | **53.6** | Claude Fable 5 40.5；Fable 5 (medium) 42.2——Sol 用 medium 推理就已超越 Fable 5，成本約 1/4 |

和競品直接對照：

| 指標 | GPT-5.6 Sol | Claude Fable 5 | DeepSeek V4 Pro |
|---|---|---|---|
| LiveBench overall | 81.1% | **83.0%** | 77.4% |
| Coding Agent Index | **80** | 77.2 | — |
| BrowseComp | **90.4%** | 84.3% | — |
| Terminal-Bench 2.1 | **88.8%** | 83.1% | 82.7% |
| SWE-bench Verified | ~95% | 95% | **96.4%** |
| Output 定價 ($/MTok) | $30 | $50 | **$0.87** |
| Context | 1.05M | 1M | 1M |

GPT-5.6 Sol 在 agentic 任務（BrowseComp、Terminal-Bench、Agents' Last Exam）明顯領先，但 SWE-bench Verified 上 DeepSeek V4 Pro 以約 1/34 的價格追平甚至略超。LiveBench 這種綜合榜則是 Claude Fable 5 略勝。

## 子線與生態系：一張表看懂 GPT 有多少產品

「家族大」在閉源陣營裡 GPT 排第二（僅次 Qwen）。除了通用主線，它同時經營著多條子線：

| 子線 | 代表版本 | 定位 |
|---|---|---|
| 旗艦推理 | GPT-5.6 / Sol / Pro | 統一路由，最高智慧 |
| 輕量 | GPT-5.6 mini / nano | 高速低價，嵌入式 |
| 開源權重 | GPT-OSS 120B / 20B | Apache 2.0，可自架 |
| 推理專線 | o-series（o4 / o5）| 深度思考，test-time compute |
| 圖像 | DALL·E 3 / 4 | 文生圖 |
| 語音 | Whisper（開源）/ GPT-4o-realtime | 轉錄 / 語音對話 |
| 嵌入 | text-embedding-3 | RAG 主力 |
| 開發者工具 | Codex / Assistants API / Function Calling | Agent 基礎設施 |
| 消費者產品 | ChatGPT | 全球最大 AI 應用 |

兩個觀察：

**統一路由是 GPT-5 的核心賭注。** 不像 Claude 把模型拆成 Fable/Opus/Sonnet/Haiku 四層讓開發者選，GPT-5 用一個路由器根據任務難度自動分配運算。好處是開發者不用手動選模型；壞處是成本可控性變低——你不知道每次請求跑的是哪一層。

**子線廣度僅次於 Qwen。** Codex（coding agent）、Whisper（開源語音）、DALL·E（圖像）、embedding 線各自獨立，生態完整度在閉源陣營裡最高。最後一個提醒：API 型號裡的 Sol/Terra/Luna/mini/nano 是服務層級標籤，不保證有可下載權重——判斷能不能自架，看授權欄位，不是看型號後綴。

## 跟競品的位置

把 GPT 放回 2026 年的格局：

- **對上 Claude**：GPT-5.6 在 agentic 任務（BrowseComp、Terminal-Bench、Agents' Last Exam）領先，Claude 在 coding 可靠性與綜合榜（LiveBench 83.0%）更穩。兩家是閉源雙雄
- **對上 DeepSeek V4**：DeepSeek 在 SWE-bench Verified 以約 1/34 價格追平甚至略超，且 MIT 可自架。GPT 的優勢是生態成熟度（Codex、Assistants API）與全球可用性
- **對上 Gemini 3.1**：Gemini 在科學推理與原生多模態領先，GPT 在 agentic 任務更強，通用能力互有勝負
- **對上開源（Llama 4 / Qwen / Kimi / Mistral）**：GPT 品質領先，但價格是開源的 20–50 倍。GPT-OSS 提供開源退路，但品質非前沿

## 對 Agent 開發者的意義

- **要最強的 agentic 表現** → GPT-5.6 Sol（max）：Coding Agent Index 80、BrowseComp 90.4%、Agents' Last Exam 53.6，多項領先
- **日常 coding 平衡品質成本** → GPT-5.6 Terra，$12 output，Coding Agent Index 77.4，多數任務夠用
- **高吞吐分類 / 摘要** → GPT-5.6 Luna，$1.20 output，1.05M context，適合大量輕量請求
- **追求最低 SWE-bench 分數** → DeepSeek V4 Pro，$0.87 output、SWE-bench Verified 96.4%，成本約 Sol 的 1/34
- **要自架 + Apache 2.0** → GPT-OSS 120B/20B 可自架，但非前沿；前沿自架看 Qwen 或 DeepSeek
- **引用 benchmark 時** → GPT 的命名矩陣（世代 × Sol/Terra/Luna × mini/nano × 閉源/開源）是所有家族裡最容易搞錯的。型號和日期必須寫全，否則比的是不同場次

## 整體來說

GPT 的故事是「從研究論文到全球基礎設施」。OpenAI 用 GPT-3 證明 scaling law，用 ChatGPT 創造消費需求，用 GPT-4 確立品質標準，用 GPT-5 的統一路由架構重新定義模型使用方式。到 GPT-5.6，三層產品線（Sol/Terra/Luna）覆蓋了從 $0.20 到 $30 的每個價格帶，1.05M context 與 128K output 覆蓋了大多數場景。

對 Agent 開發者來說，GPT-5.6 在 agentic 任務（BrowseComp、Terminal-Bench、Agents' Last Exam）上的領先是真實的。但定價也是最高的一檔——Sol 的 $30/MTok output 是 Claude 的 1.2 倍、DeepSeek 的約 34 倍。務實的做法是：用 Sol 處理最複雜的 Agent 任務，用 Terra 處理日常 coding，用 Luna 處理高吞吐量工作。

真正值得盯著的是授權的分層化：旗艦全閉源、GPT-OSS 真 Apache 2.0 但非前沿。「開源」在 GPT 身上目前只有一個層級是真的，而那個層級還不是最強的模型。

---

## 參考資料

- [GPT-5.6: Frontier intelligence that scales with your ambition — OpenAI](https://openai.com/index/gpt-5-6/)
- [Advancing the price-performance frontier with GPT-5.6 — OpenAI](https://openai.com/index/advancing-the-price-performance-frontier-with-gpt-5-6/)
- [Introducing GPT-5 — OpenAI](https://openai.com/index/introducing-gpt-5/)
- [OpenAI API Pricing](https://developers.openai.com/api/docs/pricing)
- [OpenAI — Wikipedia](https://en.wikipedia.org/wiki/OpenAI)
- [GPT-5 History Timeline & OpenAI Evolution](https://aitimeline.in/gpt-5-history-timeline-openai-evolution-1334/)
- [The Complete History of OpenAI](https://www.datastudios.org/post/the-complete-history-of-openai-founding-structure-gpt-models-chatgpt-and-the-road-to-2026)
- [OpenAI Pricing in 2026 — What You Actually Pay Per Token — StackWrite](https://stackwrite.com/blog/openai-api-pricing-2026/)
- [LiveBench Leaderboard](https://livebench.ai)
- [Artificial Analysis Coding Agent Index](https://artificialanalysis.ai)
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站