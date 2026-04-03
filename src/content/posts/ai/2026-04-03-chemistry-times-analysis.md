---
title: "ChemistryTimes 專案分析：AI 驅動的雙語每日電子報系統"
date: 2026-04-03
category: ai
tags: [chemistry-times, claude-code, agent-teams, subagent, orchestrator-pattern, multi-agent, ai-pipeline, content-automation, context-engineering, harness-engineering]
lang: zh-TW
tldr: "ChemistryTimes 用 Claude Code 的 agent teams 建了一套 10 人編輯部：總編輯當 orchestrator，用 Task tool 調度記者、查核員、分析師、寫手、製作人、審稿人，六階段串接完成每日雙語電子報。這是目前看到最完整的 Claude Code multi-agent 內容生成實作之一。"
description: "深度分析 ChemistryTimes 如何用 Claude Code agent teams 實作 AI 自動化內容生成——10 個 agent 的角色設計、六階段 pipeline、coordinator pattern、context 管理紀律、品質閘門，以及進階版的英文學習 pipeline（14 agents + TTS）。"
draft: false
---

## 專案概述

[ChemistryTimes](https://github.com/chemistrywow31/chemistry-times) 是一個 AI 驅動的內部每日電子報系統（Go + Gin + MongoDB），每天 08:30 發刊。技術架構本身不複雜（Go monolith + Docker Compose），真正有意思的是它的 **AI agent pipeline 設計**。

這篇聚焦分析它如何用 Claude Code 的 agent teams 實作自動化內容生成。

## Agent Team 架構

### 基礎版：10 個 Agent 的編輯部

ChemistryTimes 用 Claude Code 的 `.claude/agents/` 目錄定義了一個虛擬編輯部，每個 agent 都有獨立的 `.md` 設定檔：

```
.claude/agents/
├── editor-in-chief.md              # 總編輯（orchestrator）
├── journalism/
│   ├── digital-journalist.md       # 數位記者
│   └── data-auditor.md             # 資料查核員
├── analysis/
│   ├── tech-analyst.md             # 科技分析師
│   ├── marketing-analyst.md        # 行銷分析師
│   └── online-english-education-analyst.md  # 英語教育分析師
├── writing/
│   ├── chinese-daily-writer.md     # 中文寫手
│   └── english-daily-writer.md     # 英文寫手
├── production/
│   └── html-daily-producer.md      # HTML 製作人
└── review/
    ├── code-reviewer.md            # 程式碼審查
    └── process-reviewer.md         # 流程審查
```

這不是隨便取的名字——每個 agent 都有明確的**職責邊界**、**輸入來源**、**輸出格式**和**不可做的事**。

### 總編輯：純粹的 Orchestrator

`editor-in-chief.md` 是整個系統的核心設計。它的職責是：

1. **選題**：選定當天的五大分類主題（AI 動態、技術發展、遊戲產業、軟體職缺、資金動向），每則給一句 brief，並分類為 Deep Dive 或 News Brief
2. **優先級**：P0（必刊，最多 3 則）、P1（有空間就刊）、P2（留到明天）
3. **調度分析師**：多領域主題指定主責分析師和協作分析師，給明確的切入角度
4. **協調寫手**：中英文寫手**同步啟動**，給相同的素材包
5. **審稿**：看編輯一致性、主題平衡、雙語切換功能
6. **授權發佈**：只有總編輯能授權 HTML Producer 上傳到伺服器
7. **維護行事曆**：追蹤已刊、待追蹤、覆蓋缺口

關鍵限制：**總編輯不寫稿、不查核、不審程式碼、不評估團隊效率**。這是 orchestrator pattern 的核心——協調者只協調，不做事。

使用的 model 是 `sonnet`，而非 opus。這是一個成本考量——orchestrator 不需要最強的生成能力，它需要的是穩定的指令跟隨。

## 六階段 Pipeline

```
Phase 1        Phase 2          Phase 3         Phase 4            Phase 5         Phase 6
選題 ──────▶ 採訪報導 ──────▶ 事實查核 ──────▶ 分析 + 撰稿 ──────▶ HTML 製作 ──────▶ 審查 + 發佈
Editor        Journalist       Auditor        Analysts ║          Producer       Reviewer
                                               Writers ║                         Editor
                                              (parallel)
```

### Phase 1：選題（Editor-in-Chief）

總編輯從新聞源和前一天的 editorial calendar 中確定當天主題。每個主題帶一句 brief 和優先級。

### Phase 2：採訪報導（Digital Journalist）

數位記者根據選題去收集素材。這裡用的是 Claude Code 的 web search / web fetch 能力，不是自己爬網頁。

### Phase 3：事實查核（Data Auditor）

資料查核員交叉比對記者收集的資訊。這個角色的存在是整個 pipeline 設計中最有意思的決定之一——它強制在「收集」和「分析」之間加了一道品質閘門。

### Phase 4：平行分析 + 寫作

這是 pipeline 中唯一的**平行階段**：

- 科技分析師、行銷分析師、教育分析師**同時**分析各自領域的文章
- 分析結果加上原始素材，**同步**送給中文寫手和英文寫手

兩個寫手各自獨立寫作——不是一個寫完另一個翻譯。中文用台灣口語風（「超有感」、「根本神操作」），英文用 AP 風格新聞寫法（80%+ 主動語態）。

**降級規則**：如果 Phase 4 產出不到 3 篇文章，縮小範圍或跳過英文版。這種 escalation rule 在實務中很重要——pipeline 不是永遠都能跑完的。

### Phase 5：HTML 製作（HTML Daily Producer）

製作人把寫好的內容組裝成單一 HTML 檔：sidebar 目錄、雙語切換、inline styles、相對路徑。不用 CDN，唯一例外是 Google Fonts 的 Huninn 字體。

### Phase 6：審查 + 發佈

兩道審查：
1. **Code Reviewer**：驗證 HTML/CSS/JS 的正確性
2. **Editor-in-Chief**：最終編輯審查

通過後才授權 Producer 執行上傳。

## 運作機制：Subagent Mode

整個 agent team 跑在**單一 Claude Code session** 裡。CLAUDE.md 裡寫得很清楚：

> The team operates in "subagent mode" where the Editor-in-Chief delegates all work through the Task tool within a single Claude Code session.

這意味著：

- **總編輯是 main agent**，透過 Claude Code 的 `Task` tool（即 Agent tool）呼叫其他 agent
- **不允許橫向委派**：agent 不能直接叫另一個 agent 做事
- **不允許建立 sub-coordinator**：只有一個 orchestrator

這種「星狀拓撲」的好處是控制流完全可預測。壞處是所有 context 都要經過總編輯中轉，會累積 token 消耗。

## Context 管理紀律

這是整個專案最值得學的設計模式。CLAUDE.md 定義了嚴格的 context management discipline：

### 1. 單目標 Task 呼叫

每次呼叫 subagent 只給一個明確目標。不是「去收集新聞然後寫成文章」，而是「去收集這三個主題的新聞素材」。

### 2. 500 字摘要上限

Agent 回報結果時，摘要不超過 500 字。這是為了控制 main agent（總編輯）的 context window 不被撐爆。

### 3. 大量資料寫入 workspace

超過 200 字的原始資料（HTML、文章全文、表格）寫入 `workspace/` 目錄的檔案，不放在 context 裡傳遞。這是 **context offloading** 的標準做法。

### 4. 來源標記

每個 agent 必須聲明：
- 收到的輸入來自哪裡
- 輸出放在哪裡

這讓 debug 時可以追蹤資料流。

### 5. 狀態回報格式

四種狀態：`DONE` / `DONE_WITH_CONCERNS` / `BLOCKED` / `NEEDS_CONTEXT`

這不是隨便定的——它讓 orchestrator 知道下一步該做什麼：DONE 就繼續，BLOCKED 就介入，DONE_WITH_CONCERNS 就決定要不要修。

## Worklog 系統

```
.worklog/
└── yyyymm/
    └── task-name/
        └── phase-n-label/
            ├── references.md    # 參考來源
            ├── findings.md      # 發現與分析
            └── decisions.md     # 決策理由、替代方案、證據鏈
```

每個 phase 都留下三份文件。這有兩個用途：

1. **決策追蹤**：事後可以回溯「為什麼選了這個主題」「為什麼用了這個數據」
2. **Context offload**：大量中間產物不佔用 context window，需要時再讀

每次 Task dispatch 都會帶上 worklog path 和上游參考。這讓 subagent 在獨立 context 裡也能知道上下文。

## 品質閘門（Quality Gates）

三道門，全部必須通過：

| Gate | 負責人 | 驗證內容 |
|------|--------|----------|
| 事實查核 | Data Auditor | 資料正確性、來源可信度 |
| 程式碼審查 | Code Reviewer | HTML/CSS/JS 正確性 |
| 最終核准 | Editor-in-Chief | 編輯一致性、主題平衡、雙語切換 |

任何一道門失敗，pipeline 停止。由總編輯決定修復方式。

## Skills 系統

除了 agents，專案也定義了 Claude Code 的 skills（`.claude/skills/`）：

| Skill | 用途 |
|-------|------|
| `daily-production-pipeline` | 端到端工作流規格 |
| `fact-checking-framework` | 查核方法論 |
| `github-trending-analysis` | GitHub 趨勢分析 |
| `multi-platform-intelligence` | 多平台情報收集 |
| `post-uploader` | 文章上傳 |
| `ui-ux-pro-max` | UI/UX 設計指引 |

Skills 跟 agents 的差別：agents 是「角色」，skills 是「能力」。Agent 可以呼叫 skill，就像員工可以使用公司的 SOP 手冊。

## 進階版：English Learning Pipeline（14 Agents）

基礎版之外，還有一個 `chemistry-times-english-learning` 變體，把電子報升級為英文學習平台。

### 新增的 4 個 Agent

基礎版 10 個 agent 之上，增加了 `education/` 類別下的專門角色：

- **Professional Translator**：翻譯專家
- **Grammar Analyst**：文法分析師（校準到 CEFR B1-B2）
- **Education Expert**：教育品質審查
- **TTS Producer**（透過 skill）：語音合成

### 10 階段 Pipeline

基礎版 6 階段擴展為 10 階段：

```
1. 選題 → 2. 採訪 → 3. 查核 → 4. 分析（平行）
→ 5. 內容製作（CN Writer ║ EN Curator，平行）
→ 6. 教育 Pipeline（Translator ║ Grammar Analyst，平行，EN 內容完成即觸發）
→ 7. 教育品質審查 → 8. HTML 製作 → 9. Code Review → 10. 最終核准 + 發佈
```

關鍵設計：**Phase 6 是串流觸發的**。英文內容一完成，教育 pipeline 就開始跑，不用等中文版。而中文寫手跟英文+教育 pipeline 是完全平行的。

### 雙模式文章

產出的 HTML 支援兩種模式切換（純 JS + CSS，不換頁）：

**中文版**：台灣口語風的獨立中文文章

**English Learning 版**：
- 原文英文段落（不修改）
- 可折疊的中文翻譯
- 可折疊的文法分析（CEFR B1-B2 校準）
- 詞彙表（單字、定義、詞性）
- 每段的 TTS 語音播放（OpenAI API 生成）

### 額外的 Skills

英文學習版多了 3 個 skills：

| Skill | 用途 |
|-------|------|
| `boss` | 管理層指令 |
| `english-learning-assembly` | 英文學習模組組裝 |
| `tts-producer` | TTS 語音生成（OpenAI API） |

### 第 4 道品質閘門

基礎版 3 道閘門之外，新增 **Education Expert 品質審查**——驗證翻譯準確性、文法分析的 CEFR 校準、教學設計合理性。

## 設計模式總結

ChemistryTimes 的 AI 架構體現了幾個值得學習的模式：

### 1. Orchestrator ≠ Worker

總編輯只協調，不生產內容。這避免了 orchestrator 既要做決策又要做執行的 context 混亂。

### 2. 角色邊界嚴格

每個 agent 的 `.md` 裡明確寫出「不可做的事」。總編輯不寫稿，查核員不分析，分析師不寫 HTML。這防止 agent 越界導致品質下降。

### 3. Context 是有限資源

500 字摘要上限、workspace 檔案 offloading、worklog 系統——整個設計圍繞著「context window 是稀缺資源」這個現實。

### 4. 品質閘門是 Pipeline 的骨架

不是「做完就發」，而是每個關鍵節點都有 gate。這讓自動化系統有了人工審核的等效物。

### 5. 降級優於失敗

不到 3 篇就縮小範圍，時間不夠就跳過英文版。比起整個 pipeline 失敗，graceful degradation 實用得多。

### 6. 平行但有紀律

Phase 4 的分析師平行跑、中英寫手平行跑、教育版的 Phase 6 串流觸發——但每個平行段都有明確的匯合點和品質閘門。

## 生態系比較：GitHub 上的 Multi-Agent 專案

ChemistryTimes 不是唯一用 Claude Code agent teams 的專案。GitHub 上目前有超過 6,400 個 `.claude/agents/*.md` 檔案，但絕大多數用於程式開發。以下按模式分類比較。

### Orchestrator-led Pipeline（跟 ChemistryTimes 最像）

| 專案 | Agent 數 | 模式 | 特色 |
|------|----------|------|------|
| [zhsama/claude-sub-agent](https://github.com/zhsama/claude-sub-agent) | 8+ | 三階段 sequential pipeline | orchestrator → analyst → architect → planner → developer → tester → reviewer → validator，每階段有品質閘門 |
| [skmtkytr/agentic](https://github.com/skmtkytr/agentic) | 6 | DAG 平行執行 | Planner → Validator → Executor → Reviewer → Integrator → Integration Reviewer，Temporal.io 排程 |
| [badvision/clawed](https://github.com/badvision/clawed) | 多階段 | 品質閘門 + 角色分離 | 多階段開發工作流，human-in-the-loop escalation |

### 團隊模擬（角色扮演式）

| 專案 | Agent 數 | 模式 | 特色 |
|------|----------|------|------|
| [peterfei/ai-agent-team](https://github.com/peterfei/ai-agent-team) | 6 | 完整開發團隊 | PM、前端、後端、測試、DevOps、Tech Lead，支援中英文 |
| [yosuke1114/scrum_team_agents](https://github.com/yosuke1114/scrum_team_agents) | 4 | Scrum 儀式驅動 | SM、PO、Developer、Reviewer，跑在 tmux panes |
| [ethansadism/vs-copilot-multi-agent](https://github.com/ethansadism/vs-copilot-multi-agent) | 4 | PM(Opus) + Specialists(Sonnet) | Agent 完成任務前**必須**寫入知識文件，跟 ChemistryTimes 的 worklog 概念相似 |

### Swarm / 大規模編排

| 專案 | Stars | 模式 | 特色 |
|------|-------|------|------|
| [ruvnet/ruflo](https://github.com/ruvnet/ruflo) | 29.6k | Queen-led 階層式 swarm | 100+ agent，Q-Learning router，Byzantine 容錯共識 |
| [affaan-m/claude-swarm](https://github.com/affaan-m/claude-swarm) | 93 | Opus 架構師 + Haiku 執行者 | 預算控制、檔案鎖定、rich terminal UI |
| [catlog22/Claude-Code-Workflow](https://github.com/catlog22/Claude-Code-Workflow) | — | Event-driven Beat Model | 22 agent，中央協調器只在 callback 啟動，宣稱減少 60% 協調開銷 |

### PM 式任務路由

| 專案 | Stars | 模式 | 特色 |
|------|-------|------|------|
| [bobmatnyc/claude-mpm](https://github.com/bobmatnyc/claude-mpm) | 99 | PM 分析需求 → 委派 | 47+ agent，auto-pause at 70/85/95% token，Slack/Notion 整合 |
| [wshobson/agents](https://github.com/wshobson/agents) | — | Plugin marketplace | 182 agent + 147 skills + 16 orchestrator，三層 model 策略 |

### 基礎設施 / Observability

| 專案 | Stars | 用途 |
|------|-------|------|
| [disler/claude-code-hooks-multi-agent-observability](https://github.com/disler/claude-code-hooks-multi-agent-observability) | 1.3k | 即時 dashboard 監控 multi-agent 的 12 種 lifecycle event |
| [cs50victor/claude-code-teams-mcp](https://github.com/cs50victor/claude-code-teams-mcp) | 229 | 把 agent teams 協議做成獨立 MCP server |
| [baryhuang/claude-code-by-agents](https://github.com/baryhuang/claude-code-by-agents) | 826 | @mention 路由到本地/遠端 Claude Code 實例 |

### Agent 集合（即插即用）

| 專案 | Stars | 規模 |
|------|-------|------|
| [K-Dense-AI/claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills) | 17.3k | 134 科研 skills，100+ 資料庫 |
| [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) | 16.2k | 130+ 分類 subagent 目錄 |
| [lst97/claude-code-sub-agents](https://github.com/lst97/claude-code-sub-agents) | 1.5k | 33 subagent，智能自動委派 |
| [rohitg00/awesome-claude-code-toolkit](https://github.com/rohitg00/awesome-claude-code-toolkit) | 1k+ | 135 agent + 176 plugins + 35 skills |
| [ChrisRoyse/610ClaudeSubagents](https://github.com/ChrisRoyse/610ClaudeSubagents) | 109 | 610+ agent（188 coding + 422 non-coding） |

### 官方案例：Anthropic 的 C 編譯器

Anthropic 用 **16 個平行 Claude agent** 寫了一個 10 萬行 Rust C 編譯器，能編譯 Linux kernel、FFmpeg、PostgreSQL。花了約 2,000 個 Claude Code session、$20K API 費用。每個 agent 負責獨立領域（重複程式碼合併、效能優化、Rust 風格審查、文件撰寫），最大化減少檔案衝突。

詳見 [Building a C compiler with a team of parallel Claudes](https://www.anthropic.com/engineering/building-c-compiler)。

### 生態系設計趨勢

從這些專案中可以歸納出幾個共同趨勢：

1. **Model tiering 是標配**：幾乎所有專案都用 Opus 做 orchestrator、Sonnet/Haiku 做執行。ChemistryTimes 的總編輯用 sonnet 是成本考量——orchestrator 不需要最強生成能力
2. **3-5 個 agent 是甜蜜點**：超過後協調開銷增長快於吞吐量。ChemistryTimes 用 10 個算偏多，但它用嚴格的 context 管理紀律來抵消這個代價
3. **檔案驅動溝通 > 訊息傳遞**：用 workspace 檔案、structured artifacts 做 agent 間介面，比直接傳 context 更省 token
4. **品質閘門是 pipeline 架構的標配**：幾乎所有 sequential pipeline 都在階段間加 gate
5. **記憶持久化是新興模式**：markdown 檔案、MCP server、SQLite 用於跨 session 知識累積

### ChemistryTimes 在生態系中的定位

| 維度 | ChemistryTimes | 多數 GitHub 專案 |
|------|----------------|------------------|
| **用途** | 內容生產（新聞電子報） | 程式開發 |
| **Context 管理** | 500 字上限 + workspace offload + worklog | 少數有，多數沒有明確策略 |
| **品質閘門** | 3-4 道，任一失敗停止 pipeline | 1-2 道，多數較寬鬆 |
| **降級策略** | 有（< 3 篇縮小範圍、跳過英文版） | 極少見 |
| **雙版本架構** | 10 agent → 14 agent 可擴展 | 多數是固定配置 |
| **每日生產環境** | 08:30 發刊的真實日報 | 多數是 demo 或開發工具 |

ChemistryTimes 最獨特的不是 agent 數量或技術複雜度，而是它的**運營紀律**——context 管理、worklog、降級策略——這些在 demo 專案裡看不到，只有真正跑在生產環境的系統才會被迫發展出來。

## 技術棧快速參考

| 層級 | 技術選型 |
|------|----------|
| 後端 | Go 1.24 + Gin |
| 資料庫 | MongoDB 7（兩個 collection：articles、game_articles） |
| 前端 | Go templates + 原生 JS，iframe 嵌入文章 |
| AI | Claude Code agent teams（base: 10 agents / learning: 14 agents） |
| 部署 | Docker Compose（App + MongoDB + Nginx + Certbot） |
| 內容格式 | 單一自包含 HTML，inline styles，NYT 風格排版 |
| 語音 | OpenAI TTS API（英文學習版） |

---

## 參考資料

- [chemistrywow31/chemistry-times - GitHub](https://github.com/chemistrywow31/chemistry-times)
- [Claude Code Sub-agents Documentation](https://code.claude.com/docs/en/sub-agents)
- [Claude Code Agent Teams Documentation](https://code.claude.com/docs/en/agent-teams)
- [Building a C compiler with a team of parallel Claudes - Anthropic](https://www.anthropic.com/engineering/building-c-compiler)
- [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents)
- [ruvnet/ruflo](https://github.com/ruvnet/ruflo)
- [disler/claude-code-hooks-multi-agent-observability](https://github.com/disler/claude-code-hooks-multi-agent-observability)
- [zhsama/claude-sub-agent](https://github.com/zhsama/claude-sub-agent)
- [skmtkytr/agentic](https://github.com/skmtkytr/agentic)
- [bobmatnyc/claude-mpm](https://github.com/bobmatnyc/claude-mpm)
- [wshobson/agents](https://github.com/wshobson/agents)
