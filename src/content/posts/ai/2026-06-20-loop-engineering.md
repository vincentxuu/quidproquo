---
title: "Loop Engineering：當 AI 不再需要你打 Prompt"
date: 2026-06-20
category: ai
type: deep-dive
tags: [loop-engineering, ai-agent, claude-code, prompt-engineering, harness-engineering, agentic-coding]
lang: zh-TW
tldr: "Loop Engineering 是設計「自動 prompt agent 的系統」而非手動 prompt 的工程實踐。Boris Cherny 跑數百個 agent、Addy Osmani 正式命名、Blake Crosley 指出驗證成本才是真正瓶頸——這篇整理一手來源、五大構建塊、適用邊界與批評觀點。"
description: "2026 年 6 月，Loop Engineering 成為開發者社群最熱關鍵詞。本文整理 Addy Osmani、Boris Cherny、Peter Steinberger 的一手發言，解析五大構建塊、演進脈絡、適用條件與已知限制。"
draft: false
glossary:
  - term: "Loop Engineering"
    definition: "設計自動運行的回饋迴圈，讓 AI agent 自主找工作、執行、驗證、記錄狀態的工程實踐。"
    context: "本文主題。由 Addy Osmani 於 2026 年 6 月正式命名。"
  - term: "Harness Engineering"
    definition: "配置單一 agent 工作環境（設定檔、hooks、skills）的工程實踐，是 Loop Engineering 的下一層。"
    links:
      - label: "Addy Osmani - Harness Engineering"
        url: "https://addyosmani.com/blog/harness-engineering/"
  - term: "Maker-Checker Split"
    aliases: ["Maker/Checker"]
    definition: "將執行者（寫 code 的 agent）與驗證者（review code 的 agent）分離的設計模式。"
---

> 🌏 [English version](/posts/ai/2026-06-20-loop-engineering-en)

2026 年 6 月，三則看似獨立的發言在開發者社群引爆了一場認知震盪。[Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) 負責人 Boris Cherny 在 [Acquired Unplugged 訪談](https://workos.com/blog/boris-cherny-claude-code-acquired-interview-takeaways)中說：「I don't prompt Claude anymore. I have loops running that prompt Claude and figuring out what to do. My job is to write loops.」[OpenClaw](https://github.com/nicepkg/openclaw) 創辦人 Peter Steinberger 發推：「You shouldn't be prompting coding agents anymore. You should be designing loops that prompt your agents.」Google Chrome 工程負責人 [Addy Osmani](https://addyosmani.com/) 隨即發表文章，正式為這個模式命名——[Loop Engineering](https://addyosmani.com/blog/loop-engineering/)。

這篇文章要拆解的是：Loop Engineering 到底在解什麼問題、五大構建塊長什麼樣、什麼時候該用、什麼時候不該用，以及實踐者們已經踩到的坑。

## 從 Prompt 到 Loop：抽象層的四次跳躍

要理解 Loop Engineering 為何在此刻爆發，得先看開發者與 AI 的關係怎麼演進：

| 年份 | 核心技能 | 開發者角色 |
|------|---------|-----------|
| 2023 | Prompt Engineering | 寫出精準的 prompt，讓 AI 給出好回答 |
| 2024 | Agent Orchestration | 編排多個 agent 協作完成複雜任務 |
| 2025 | [Harness Engineering](https://addyosmani.com/blog/harness-engineering/) | 用設定檔（CLAUDE.md、hooks）配置 agent 的工作環境 |
| 2026 | Loop Engineering | 設計自動運行的回饋迴圈，讓 agent 自主持續工作 |

每一次跳躍，開發者都往上退了一層。Cherny 自己的軌跡就是最好的例子——依 [WorkOS 整理的訪談重點](https://workos.com/blog/boris-cherny-claude-code-acquired-interview-takeaways)，他從用 IDE 寫 code、到 prompt Claude 寫 code、到同時跑 5-10 個 Claude session、到 2024 年 11 月「卸載 IDE，因為一個月沒打開過」、到現在白天跑數百個 agent、晚上跑數千個。

Osmani 在[原文](https://addyosmani.com/blog/loop-engineering/)中把 Loop Engineering 定位在 Harness Engineering 的上一層：

> "Loop engineering sits one floor above the harness. The harness but it runs on a timer, it spawns little helpers, and it feeds itself."

Harness 是單一 agent 的工作環境；Loop 在 harness 之上加了定時器、子 agent、和自我驅動機制。

## Loop Engineering 的定義

Osmani 給了一個清晰的定義：

> "Loop engineering is replacing yourself as the person who prompts the agent. You design the system that does it instead."

一個 loop 的運作邏輯：

```
發現工作 → 分派給 agent → agent 執行 → 觀察結果 → 驗證正確性 → 記錄狀態 → 決定下一步 → 重複
```

這個迴圈持續運轉，直到目標達成或遇到需要人類判斷的節點才暫停。關鍵差異在於：prompt 是一次性的觸發，loop 是持續自我驅動的系統。

## 五大構建塊 + 記憶層

依 Osmani 的架構，一個完整的 loop 由五個組件加一個記憶層組成。他特別指出，Claude Code 和 [OpenAI Codex](https://openai.com/index/codex/) 現在都已內建這五個構建塊——「the shape is the same across products」。

### 1. Scheduled Automations（排程自動化）

Loop 的觸發器。可以是 cron job、GitHub Actions、PR event webhook，或產品內建的排程機制。Codex 的 Automations tab 讓你設定專案、prompt、頻率、是否跑在 worktree 上；Claude Code 的 `/loop` 和 `/schedule` 提供類似能力。

Osmani 舉了 OpenAI 內部的用法：每日 issue triage、彙整 CI 失敗、寫 commit briefing、搜尋上週新增的 bug。

### 2. Git Worktrees（隔離工作區）

每個 agent 在獨立的 git worktree 中工作，共享 git 歷史但互不干擾。這讓多個 agent 可以平行處理不同任務——一個修 bug、一個寫測試、一個做 refactor——而不會產生衝突。

這也是為什麼 loop 能在「你睡覺時」運作：worktree 模式讓筆電蓋上也不會中斷 agent 的工作。

### 3. Skills（專案知識）

透過 CLAUDE.md、AGENTS.md、skill 檔案等機制，將專案的規範、慣例、工作流程編碼成 agent 可理解的知識。Osmani 引用了他先前提出的 [intent debt](https://addyosmani.com/blog/intent-debt/) 概念：

> "An agent starts every session cold and will fill any hole in your intent with a confident guess. A skill is intent written down."

沒有 skills，agent 每次啟動都從零推導你的專案慣例；有了 skills，知識會累積。

### 4. Plugins / MCP Connectors（外部整合）

透過 [MCP（Model Context Protocol）](https://modelcontextprotocol.io/)連接外部工具：GitHub、Slack、資料庫、監控系統。讓 agent 不只能讀寫 code，還能與整個開發工具鏈互動。

### 5. Sub-agents（子代理）

將「執行者」（maker）和「驗證者」（checker）分離。這是 loop 中最關鍵的設計決定。Osmani 解釋了為什麼：

> "The reason it matters specifically inside a loop is the loop runs while you are not watching, so a verifier you actually trust is the only reason you can walk away."

Claude Code 的 `/goal` 就是這樣實作的——用另一個模型判斷 loop 是否完成，而不是讓做事的 agent 自己判斷。

### +1. Durable Memory（持久記憶）

跨 session 的狀態保留。Agent 本身是 amnesiac 的，但 filesystem 不是——`progress.txt`、`AGENTS.md`、`prd.json` 等檔案承載著跨 session 的記憶。依 Osmani 的[長時間 agent 文章](https://addyosmani.com/blog/long-running-agents/)，這也是 Ralph Wiggum loop（由 Geoffrey Huntley 和 Ryan Carson 推廣的早期 loop 模式）的核心設計：

> "The agent itself is amnesiac, but the filesystem isn't. Each iteration starts fresh and reads enough state from disk to keep going."

## 驗證成本才是真正的瓶頸

在所有討論 Loop Engineering 的文章中，[Blake Crosley 的分析](https://blakecrosley.com/blog/loops-win-where-verification-is-cheap)提出了最尖銳的洞見：

> "Verification cost, not loop construction, decides what you can automate."

他拉了 Cherny 三場演講的完整逐字稿，發現一個被多數人忽略的模式：Cherny 實際命名的每一個 loop，都有 machine-checkable 的成功條件——CI 修復、auto-rebasing、feedback clustering。不是開放式的 feature 開發。

這不是巧合。當驗證可以自動化（test suite 通過、lint 清潔、type check 無誤），loop 就能無限運轉。當驗證需要人類判斷（這個 UI 好不好看、這個架構決定對不對），loop 就退化成「產出一堆東西等你 review」的生產線。

[AlphaSignal 的分析](https://alphasignalai.substack.com/p/most-developers-do-not-need-agent)把這個觀察提煉成四個前提條件：

1. **任務可重複**：不是一次性的探索
2. **驗證可自動化**：有 test suite、linter、type checker
3. **Token 預算能承受浪費**：loop 會重試、會探索死路
4. **Agent 已有所需工具**：不需要人類幫忙操作外部系統

四個條件缺一個，loop 的成本就會超過收益。

## 已知的限制與批評

Loop Engineering 不是萬靈丹。連 Osmani 自己在文章開頭就表態：「it's still early, I'm skeptical and you absolutely have to be careful about token costs.」以下是目前已知的主要限制：

### Token 成本

Loop 會重讀 context、重試、探索多條路徑，token 消耗遠超單次 prompt。Osmani 直言：「usage patterns can vary wildly if you are token rich or poor.」[Towards AI 的質疑文](https://pub.towardsai.net/is-loop-engineering-really-what-we-need-77506986bf2a)計算過，一個同時跑 maker 和 checker 的 loop，「will burn through a limited plan before breakfast.」

### Comprehension Debt（理解負債）

這是比 technical debt 更隱蔽的問題。Towards AI 的 Hamza Boulahia 定義它為：

> "The gap between what exists in your codebase and what you actually understand about it."

Loop 產出的 code 你沒寫、可能沒仔細 review、不完全理解。技術債你至少知道欠了什麼；理解債是你連自己欠了什麼都不知道。

### Cognitive Surrender（認知投降）

Osmani 用了這個詞來描述一個微妙的風險：

> "When the loop runs itself it's very tempting to stop having an opinion and just take whatever it gives back. I called that cognitive surrender. Designing the loop is the cure when you do it with judgement and the accelerant when you do it to avoid thinking — same action, opposite result."

同一個 loop，用來加速你深度理解的工作是利器，用來逃避理解是毒藥。

### Early Exit 問題

Ralph Wiggum loop 的已知 bug——agent 過早宣告完成，loop 在半成品上退出。這就是為什麼 maker-checker split 不是可選項，而是必要條件。

### Review 成為新瓶頸

[Mark Norgren 的實踐紀錄](https://marknorgren.com/trackers/loop-engineering/)說得坦白：

> "Output piles up, and without the 'close the loop' part defined up front — that is acceptance criteria, validation, and verification — I become the bottleneck."

Loop 產出增加，人類 review 頻寬成為上限。你能跑多少個 loop，不取決於 token 預算，而取決於你能多快檢查產出。

## 實際場景

### 場景一：PR 自動維護

```
觸發：PR 收到 review comment
  → Agent 讀取 comment
  → 判斷是否可自動處理（machine-checkable？）
  → 修改 code 並 push
  → 等待 CI
  → CI 失敗 → 分析錯誤 → 修復 → 再 push
  → CI 通過 → 通知開發者做最終確認
```

這是 Cherny 自己在用的 loop 之一——babysit PR，自動處理 CI 失敗和 rebase。

### 場景二：睡前啟動的任務分解

```
開發者定義目標 + 驗收條件
  → Planner agent 拆解為子任務
  → 每個子任務分配給獨立 sub-agent（各在 worktree 中）
  → Checker agent 逐一驗證
  → 不通過 → 回饋修改
  → 全部通過 → 合併、跑完整測試、開 PR
```

### 場景三：持續品質守護

```
每次 push 到 main：
  → Agent 跑 lint、typecheck、test
  → 發現問題 → 自動開 branch 修復
  → 修復完成 → 開 PR 標記 auto-fix
```

## 現在就能開始的三件事

Loop Engineering 的進入門檻比想像中低，因為工具已經內建了核心能力。

### 1. 寫好你的 CLAUDE.md / AGENTS.md

把專案規範、慣例、「我們不這樣做因為那次出事」的知識寫下來。這是 loop 最基礎的構建塊——沒有它，agent 每次啟動都在猜。

### 2. 用 /goal 或 /loop 跑你的第一個 loop

不需要自己寫 bash orchestrator。Claude Code 的 `/goal` 會自動做 maker-checker split，`/loop` 會定時執行。從一個小任務開始——babysit 一個 PR、每小時跑一次 lint check。

### 3. 拆分 Maker 和 Checker

開始習慣用 sub-agent 做驗證。不是讓同一個 agent 自己檢查自己。這個簡單的分工就是 loop 品質保證的核心。

## 整體來說

Loop Engineering 是真實的工程演進，不是炒作。但它比 prompt engineering 更難，不是更容易——因為你現在要設計的不是一段文字，而是一個能在無人值守時穩定運作的系統。

Osmani 的結語值得反覆讀：

> "Build the loop. But build it like someone who intends to stay the engineer, not just the person who presses go."

[Pulumi 的 Engin Diri](https://www.pulumi.com/blog/stop-prompting-design-the-loop/) 換了個說法，但指向同一件事：

> "The loop will do the typing. The thinking is the work."

Loop 不會取代你的判斷力。它會放大你的判斷力——前提是你還有判斷力可以被放大。

## 參考資料

- [Addy Osmani - Loop Engineering](https://addyosmani.com/blog/loop-engineering/)
- [Addy Osmani - Loop Engineering（Substack 版）](https://addyo.substack.com/p/loop-engineering)
- [Addy Osmani - Self-Improving Coding Agents](https://addyosmani.com/blog/self-improving-agents/)
- [Addy Osmani - Long-running Agents](https://addyosmani.com/blog/long-running-agents/)
- [WorkOS - Boris Cherny Claude Code Interview Takeaways](https://workos.com/blog/boris-cherny-claude-code-acquired-interview-takeaways)
- [Blake Crosley - Loops Win Where Verification Is Cheap](https://blakecrosley.com/blog/loops-win-where-verification-is-cheap)
- [The New Stack - Loop Engineering](https://thenewstack.io/loop-engineering/)
- [Pulumi - Stop Prompting. Design the Loop.](https://www.pulumi.com/blog/stop-prompting-design-the-loop/)
- [Peter Steinberger 原始推文（via Digg）](https://digg.com/ai/7ifyvmb9)
- [Towards AI - Is Loop Engineering Really What We Need?](https://pub.towardsai.net/is-loop-engineering-really-what-we-need-77506986bf2a)
- [AlphaSignal - Most Developers Do Not Need Agent Loops Yet](https://alphasignalai.substack.com/p/most-developers-do-not-need-agent)
- [Mark Norgren - Loop Engineering Tracker](https://marknorgren.com/trackers/loop-engineering/)
- [Claude Code 官方文件](https://docs.anthropic.com/en/docs/claude-code/overview)
- [MCP（Model Context Protocol）](https://modelcontextprotocol.io/)
