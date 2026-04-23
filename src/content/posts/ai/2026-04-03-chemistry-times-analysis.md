---
title: "Claude Code Agent Teams 怎麼用？從 GitHub 6,400+ 個 agent 看設計模式"
date: 2026-04-04
type: guide
category: ai
tags: [claude-code, agent-teams, subagent, multi-agent, orchestrator-pattern, ai-pipeline, context-engineering, harness-engineering, temporal, swarm, quality-gates]
lang: zh-TW
tldr: "GitHub 上已有 6,400+ 個 .claude/agents/*.md 檔案。我們拆解了 4 個代表性專案——ChemistryTimes（內容生產 pipeline）、claude-sub-agent（document-driven 開發流水線）、agentic（Temporal.io DAG 平行執行）、vs-copilot-multi-agent（Hook 強制記憶寫入）——加上 ruflo 的企業級 swarm 架構，歸納出 6 種設計模式和 5 個實戰趨勢。"
description: "深度拆解 5 個 Claude Code multi-agent 專案的架構設計，涵蓋 orchestrator pipeline、DAG 平行執行、知識持久化、swarm 編排等模式，歸納跨專案的設計趨勢與實戰經驗。"
draft: false
---

GitHub 上目前有超過 6,400 個 `.claude/agents/*.md` 檔案。Claude Code 的 multi-agent 生態系正在快速成長，但多數人還停留在「裝一堆 subagent 然後隨便用」的階段。

這篇拆解 5 個代表性專案，看它們怎麼設計 agent pipeline、怎麼管 context、怎麼保證品質——然後歸納出可複用的設計模式。

## 案例一：ChemistryTimes — 10 Agent 的虛擬編輯部

**專案**：[chemistrywow31/chemistry-times](https://github.com/chemistrywow31/chemistry-times)
**用途**：每天 08:30 自動發刊的雙語（繁中+英文）內部電子報
**技術**：Go + Gin + MongoDB + Docker Compose
**Agent 數**：基礎版 10 / 英文學習版 14
**模式**：Orchestrator-led sequential pipeline + 部分平行

### 架構

```
.claude/agents/
├── editor-in-chief.md          # 總編輯（orchestrator, sonnet）
├── journalism/
│   ├── digital-journalist.md   # 數位記者
│   └── data-auditor.md         # 查核員
├── analysis/
│   ├── tech-analyst.md         # 科技分析師
│   ├── marketing-analyst.md    # 行銷分析師
│   └── online-english-education-analyst.md
├── writing/
│   ├── chinese-daily-writer.md # 中文寫手
│   └── english-daily-writer.md # 英文寫手
├── production/
│   └── html-daily-producer.md  # HTML 製作人
└── review/
    ├── code-reviewer.md        # 程式碼審查
    └── process-reviewer.md     # 流程審查
```

### Pipeline

六階段，Phase 4 是唯一的平行段：

```
選題 → 採訪 → 事實查核 → 分析+撰稿(平行) → HTML製作 → 審查+發佈
```

總編輯透過 Task tool 調度所有 agent，跑在單一 Claude Code session 的 subagent mode。不允許橫向委派，不允許建立 sub-coordinator——純星狀拓撲。

### 最大亮點：Context 管理紀律

這是所有案例中 context 管理做得最嚴格的：

- **500 字摘要上限**：subagent 回報結果不超過 500 字
- **Workspace offloading**：超過 200 字的原始資料寫入 `workspace/` 檔案
- **Worklog 系統**：每個 phase 留下 `references.md` / `findings.md` / `decisions.md` 三份文件
- **狀態格式**：`DONE` / `DONE_WITH_CONCERNS` / `BLOCKED` / `NEEDS_CONTEXT`
- **來源標記**：每個 agent 聲明輸入來源和輸出位置

### 品質閘門

3 道（英文學習版 4 道），任一失敗 pipeline 停止：

| Gate | 負責人 | 驗證內容 |
|------|--------|----------|
| 事實查核 | Data Auditor | 資料正確性、來源可信度 |
| 程式碼審查 | Code Reviewer | HTML/CSS/JS 正確性 |
| 最終核准 | Editor-in-Chief | 編輯一致性、主題平衡 |

### 降級策略

Phase 4 產出不到 3 篇 → 縮小範圍或跳過英文版。這在其他專案極少見。

### 英文學習版（14 Agents）

基礎版擴展為 10 階段 pipeline，新增翻譯、文法分析（CEFR B1-B2）、TTS 語音（OpenAI API）、教育品質審查。Phase 6 是串流觸發——英文內容完成即啟動教育 pipeline，不等中文版。

### 設計決策

- **Orchestrator 用 sonnet 而非 opus**：成本考量，coordinator 不需要最強生成能力
- **中英文寫手同步獨立寫作**：不是先寫一種再翻譯，避免品質損失
- **Skills 跟 Agents 分離**：6 個 skills（`daily-production-pipeline`、`fact-checking-framework` 等）作為共用 SOP，agent 按需呼叫

## 案例二：claude-sub-agent — Document-driven 開發流水線

**專案**：[zhsama/claude-sub-agent](https://github.com/zhsama/claude-sub-agent)
**用途**：把專案想法變成 production-ready 程式碼的自動化開發流水線
**Agent 數**：8 個核心 + 4 個專家
**模式**：三階段 sequential pipeline，document-driven handoff

### 架構

```
agents/spec-agents/
├── spec-orchestrator.md    # 工作流協調（不直接調度 agent）
├── spec-analyst.md         # 需求分析師
├── spec-architect.md       # 系統架構師
├── spec-planner.md         # 實作規劃師
├── spec-developer.md       # 全端開發者
├── spec-tester.md          # 測試專家
├── spec-reviewer.md        # 程式碼審查
└── spec-validator.md       # 最終驗證
```

另外還有 4 個領域專家（`senior-backend-architect`、`senior-frontend-architect`、`ui-ux-master`、`refactor-agent`），在特定階段加入。

### Pipeline：三階段 + 品質閘門

```
Phase 1: Planning (20-25%)          Phase 2: Development (60-65%)       Phase 3: Validation (15-20%)
analyst → architect → planner       developer → tester                  reviewer → validator
        ↓                                   ↓                                   ↓
   [Gate: 95% threshold]              [Gate: 80-85%]                    [Gate: 85-95%]
```

每個閘門失敗會回到對應的上游 agent 重做，最多 3 輪迭代。預期收斂路徑：Round 1 (80-90%) → Round 2 (90-95%) → Round 3 (95%+)。

### 核心機制：Document Handoff

Agent 之間**不直接溝通**。每個 agent：

1. 讀取前一個 agent 產出的文件
2. 執行自己的專業工作
3. 寫出結構化文件到檔案系統
4. 由 slash command 或 orchestrator 路由到下一個

產出的文件包括：`requirements.md`、`user-stories.md`、`architecture.md`、`api-spec.md`（OpenAPI 3.0）、`tasks.md`（含依賴矩陣和 Gantt chart）、`test-plan.md`。

### 工具權限分離

這是最值得注意的設計——不同 agent 有不同的工具存取權：

| Agent | 特有工具 | 意義 |
|-------|----------|------|
| developer | `Bash`, `Edit`, `MultiEdit` | **唯一能改檔案的 agent** |
| reviewer | `mcp__ESLint__lint-files`, `mcp__ide__getDiagnostics` | 能跑 linter 和 IDE 診斷 |
| analyst, architect | `WebFetch` | 能查外部資料 |
| orchestrator | `Task` | 能發任務但**不直接調度 agent** |

只有 developer 能真正動程式碼。reviewer 能跑 lint 但要改 code 必須回到 developer。這種「最小權限」設計防止了 agent 越界。

### 跟 ChemistryTimes 比

| 維度 | ChemistryTimes | claude-sub-agent |
|------|----------------|------------------|
| Orchestrator 角色 | 主動調度所有 agent | 設計工作流但不直接調度 |
| Agent 溝通 | 透過 orchestrator 中轉 | 透過檔案系統 handoff |
| 品質閘門 | 3 道，binary pass/fail | 3 道，分數制 + 回溯重做 |
| 平行執行 | Phase 4 有平行 | 完全序列 |
| 工具隔離 | 未明確限制 | 嚴格的 per-agent 工具權限 |

## 案例三：agentic — Temporal.io + DAG 平行執行

**專案**：[skmtkytr/agentic](https://github.com/skmtkytr/agentic)
**用途**：通用任務分解與平行執行引擎
**技術**：TypeScript + Temporal.io + Claude Agent SDK + Svelte Web UI
**Agent 數**：6 個功能性 agent
**模式**：DAG-based wave 平行執行 + 雙層 retry

### 架構

跟前兩個案例不同，agentic 的 agent 不是用 `.claude/agents/*.md` 定義的角色，而是用 TypeScript 實作的 **Temporal Activities**：

```
Prompt → Planner → Validator → [Executor ×N ‖ Reviewer ×N] → Integrator → Integration Reviewer → 結果
```

整個 pipeline 是一個 Temporal Workflow，每個 agent 是一個 Activity。

### 6 個 Agent

| Agent | 職責 | 關鍵機制 |
|-------|------|----------|
| **Planner** | 把自然語言 prompt 分解為 DAG | Zod schema 強制結構化輸出，LLM 生成的 ID 替換為 `crypto.randomUUID()` |
| **Validator** | 驗證 DAG 正確性 | 檢查循環依賴、懸空引用、任務模糊度。致命錯誤直接終止 workflow |
| **Executor** | 執行單一任務 | 注入已完成任務的結果作為 context，可選工具（Read/Write/Bash/WebFetch 等） |
| **Reviewer** | 審查單一任務的輸出 | 三種結果：pass / pass+修訂 / fail（觸發重試）。會驗證工具是否真的被使用 |
| **Integrator** | 合併所有任務結果 | 大結果從檔案讀取（context 管理），產出寫入 `_integrated/response.md` |
| **Integration Reviewer** | 最終品質評分 | 5 維度 1-5 分（完整性、正確性、結構、實用性、整體），overall ≥ 4 才通過 |

### 核心機制：Wave-based DAG 執行

`executeDag()` 函數實作波次平行執行：

1. 每輪找出所有依賴已滿足的任務
2. 限制到 `maxParallelTasks`（預設 3）
3. `Promise.all()` 平行執行
4. 死鎖偵測：如果沒有任務 ready 但還有未完成的，拋出 `PlanCircularDependencyError`

每個任務在一個波次內走 Executor → Reviewer 迴圈。失敗的任務帶著 reviewer 的 feedback 重試。

### 雙層 Retry

**第一層：Task-level**
Reviewer 拒絕 → feedback 注入任務描述 → Executor 重試（`maxTaskRetries` 次）

**第二層：Pipeline-level**
Integration Reviewer 拒絕 → **整個 pipeline 從 Planner 重來**，帶上失敗原因。所有狀態歸零。（`maxPipelineRetries` 次）

### Context 管理

- **大結果寫檔**：`os.tmpdir()/agentic/{workflowId}/{taskId}/result.md`，傳 file path 而非 inline
- **Reviewer 讀檔**：如果結果是檔案，Reviewer 拿到 `Read` tool 去讀，不走 inline
- **截斷保護**：Integration Reviewer 的 inline 上限 15,000 字元，工具證據上限 10 筆
- **工具輸出截斷**：evidence 中的工具輸出限 500 字元，reviewer 限 200 字元

### Temporal.io 的價值

用 Temporal.io 帶來幾個前兩個案例沒有的能力：

- **持久化狀態**：workflow 狀態自動持久化，crash 後可恢復
- **Signal/Query**：外部可發 `cancelSignal` 取消，可查 `statusQuery` 取得即時狀態
- **Retry policy**：10 秒初始間隔、指數退避、最多 3 次、auth 錯誤不重試
- **Worker 配置**：最多 10 個平行 activity、20 個平行 workflow

### 跟前兩個案例比

| 維度 | ChemistryTimes | claude-sub-agent | agentic |
|------|----------------|------------------|---------|
| Agent 定義 | `.md` 角色檔 | `.md` 角色檔 | TypeScript Activities |
| 執行模式 | 單一 session | Slash command 串接 | Temporal Workflow |
| 平行執行 | 部分平行 | 完全序列 | DAG wave 平行 |
| Retry | 無 | 最多 3 輪回溯 | 雙層（task + pipeline） |
| 狀態持久化 | 無 | 無 | Temporal 自動持久化 |
| 品質評分 | Binary | 分數制 | 5 維度 1-5 分 |

## 案例四：vs-copilot-multi-agent — Hook 強制記憶寫入

**專案**：[ethansadism/vs-copilot-multi-agent](https://github.com/ethansadism/vs-copilot-multi-agent)
**用途**：跨平台（Claude Code + VS Code Copilot）的多 agent 開發框架
**Agent 數**：4（PM + 3 Specialist）
**模式**：PM coordinator + 強制知識持久化

### 架構

跟其他案例最大的差異：這個專案的核心不是 pipeline 設計，而是**記憶管理**。

```
PM (Opus) ─── 調度 ──→ Crawler Expert (Sonnet)
              │         Database Expert (Sonnet)
              │         Frontend Engineer (Sonnet)
              │
              └── 管理 ──→ contracts/（跨 agent 介面合約）
                           memory-kb/（知識庫）
```

PM 是唯一的 coordinator（`disable-model-invocation: true`，其他 agent 不能呼叫 PM）。三個 Specialist 各自負責爬蟲、資料庫、前端。

### 核心創新：「不寫記憶 = 任務未完成」

記憶寫入在**三個層級**強制執行：

**Level 1：Agent 定義規則**
每個 specialist 的 `.md` 裡明確寫著：「Stop hook 會檢查記憶是否更新；未更新則封鎖（無法完成任務）。不記錄 = 任務未完成。」

**Level 2：SubagentStop Hook**
`subagent-memory-check.sh` 在 agent 嘗試結束時：
1. 讀取 agent 啟動時寫的 timestamp 檔
2. 掃描 `memory-kb/<agent>/` 下的 `.md` 檔是否有比啟動時間更新的
3. 如果**沒有任何更新的檔案** → `exit 2`（block），強制 agent 回去寫記憶

**Level 3：Session Stop Hook**
整個 session 結束時，檢查 `project-overview.md` 是否在最近 10 分鐘內被更新。沒有就提醒。

### Contracts 系統：跨 Agent 介面合約

當任務涉及 2+ agent 共享介面時（API endpoint、DB schema、WebSocket event），PM **必須先在 `contracts/` 寫合約**再派任務：

```markdown
# mta_demo4 Interface Contracts
## API Contracts
### GET /api/stocks
- response_field :: price (float)
- producer :: database
- consumer :: frontend
## DB Schema Contracts
### stock_prices
- column :: ticker (varchar, unique)
```

PM 派任務時帶上合約的 permalink。任務完成後 PM 交叉驗證欄位名稱——不一致就退回修改。

`validate-write-note.sh` Hook 還會驗證合約的 tag 格式（必須有 `type:contract` + `app:` tag），格式不對直接 block。

### 8 個 Hook 的完整系統

| Hook | 用途 |
|------|------|
| **SessionStart** | 模式選擇（一般 / PM），載入活躍 topic |
| **UserPromptSubmit** | 審計日誌 + 關鍵字偵測（「筆記」「儲存」觸發 topic 存檔） |
| **SubagentStart** | 記錄啟動時間、列出既有知識、列出共享合約 |
| **PostToolUse** | 審計每一次工具呼叫 |
| **PreCompact** | context 壓縮前自動儲存 session 活動到 `conversations/` |
| **Stop** | 檢查 project-overview 是否更新 |
| **PreToolUse** | 驗證 `write_note` 的 tag 合規性 |
| **SubagentStop** | **強制記憶寫入檢查** |

### Wiki-links 知識圖譜

用 `[[Note Title]]` 語法建立雙向連結，用 `key :: value` 語法建立可查詢的知識原子：

```markdown
## Observations
- app :: mta_demo3
- problem_id :: CRAWLER-001
- root_cause :: TWSE API requires TLS 1.2

## Relations
- relates_to [[Crawler Best Practices]]
```

Basic Memory MCP 提供語義搜尋（`search_notes`）和圖譜遍歷。所有記憶**不進 git**——「每個人擁有自己的記憶庫」。

### PreCompact：Context 壓縮前的自動存檔

這是最巧妙的 hook——在 Claude Code 做 context compaction 之前：

1. 自動把 session 活動存到 `conversations/` 作為 markdown note
2. 提取最近的 hook events、修改過的 notes、git diff
3. 注入專案摘要 + 知識庫統計到壓縮後的 context

這創造了一個**即使 context window 被壓縮也能存活的恢復點**。

### 跟其他案例比

| 維度 | ChemistryTimes | claude-sub-agent | agentic | vs-copilot |
|------|----------------|------------------|---------|------------|
| 記憶持久化 | Worklog 檔案 | 文件 handoff | tmpdir 檔案 | **MCP 語義搜尋 + Hook 強制** |
| 跨 session 知識 | 無 | 無 | 無 | **Wiki-links 知識圖譜** |
| Agent 介面 | Orchestrator 中轉 | 文件 | Workflow 函數 | **Contracts 合約** |
| Hook 使用 | 無 | 無 | 無 | **8 個 Hook 全覆蓋** |

## 案例五：Ruflo — 企業級 Swarm + RL 路由

**專案**：[ruvnet/ruflo](https://github.com/ruvnet/ruflo)（29.6k stars）
**用途**：企業級 AI agent 編排平台
**技術**：TypeScript monorepo（10 packages），v3.0.0-alpha.1
**Agent 數**：預設 15，支援 100+
**模式**：Queen-led hierarchical-mesh swarm + 強化學習路由

### 架構

Ruflo 跟前四個案例完全不同——它不是「幾個 agent 串起來」，而是一個**分散式系統模擬框架**。

預設 15 agent 分佈在 6 個領域：

```
Layer 0:  agent-1 (Queen Coordinator)
Layer 1:  agent-2~4 (Security) | agent-5~9 (Core) | agent-10~12 (Integration)
Layer 2:  agent-13 (Test) | agent-14 (Perf) | agent-15 (Release)
```

支援 4 種拓撲：

| 拓撲 | 通訊方式 | 適用規模 |
|------|----------|----------|
| **Hierarchical-Mesh**（預設） | Queen + 域內 mesh | 100+ agent |
| Mesh | 全連接 peer-to-peer | ~20 agent |
| Hierarchical | 嚴格樹狀 | 100+ agent |
| Centralized | 單一 hub | ~50 agent |

### Queen Coordinator

整合三種職能在一個類別裡（~2,025 行）：

- **Strategic**：任務分析、複雜度評分、耗時估算、pattern matching（< 50ms）
- **Tactical**：agent 能力評分、主/備 agent 指派、執行策略選擇（< 20ms）
- **Adaptive**：學習整合、健康監控、瓶頸偵測（< 30ms）

### 共識機制

三種分散式共識演算法的 in-process 模擬：

**Raft**：選舉超時 150-300ms 隨機化、50ms 心跳、多數決 commit。標準教科書實作，但 peers 是 `Map` 物件不是網路連線。

**Byzantine (PBFT)**：四階段（pre-prepare → prepare → commit → reply），容忍 f ≤ ⌊(n-1)/3⌋ 個故障節點。

**Gossip**：每 100ms 隨機選 3 個鄰居廣播，TTL 10 hop，90% 參與率才算收斂。

重要的是：這三個都是**單 process 模擬**，不是真的分散式。適合單機器上的多 agent 協調。

### Q-Learning 路由

表格式 Q-Learning 做任務路由：

- 連續狀態離散化為 10 bins × 8 維度
- ε-greedy 探索（1.0 → 0.01，10,000 步衰減）
- Q-table 超過 10,000 狀態時 LRU 淘汰到 80%
- 單次更新 < 1ms

另外還有 DQN、PPO、A2C、SARSA、Curiosity、Decision Transformer 共 9 種 RL 演算法。

### SONA（WASM 快速路徑）

透過 `@ruvector/sona`（Rust 編譯的 WASM）做 < 0.05ms 的 pattern matching。如果找到高信度匹配（基於過去的 trajectory 學習），可以跳過 LLM 直接路由——這是「簡單任務不用 LLM」的實作方式。

### 務實評估

**值得學的**：
- 4 種拓撲模式的抽象（不是所有場景都適合同一種拓撲）
- RL-based 路由讓系統能從歷史中學習
- Agent 健康監控 + 自動 failover

**需要注意的**：
- 所有分散式演算法是 in-process 模擬，不是真正的分散式部署
- 「100+ agents」是 100+ 邏輯狀態物件，不是 100+ 獨立 process
- v3.0.0-alpha 狀態，很多功能還在開發中
- `AGENTS.md` 明確寫著「claude-flow does NOT execute code」——它是 coordination layer，實際工作還是靠 Claude API

### 跟其他案例的根本差異

前四個案例是「pipeline」思維——任務從 A 流到 B 流到 C。Ruflo 是「network」思維——任務被路由到最適合的 agent，routing 本身是學習出來的。

| 維度 | Pipeline 模式（案例 1-4） | Swarm 模式（Ruflo） |
|------|---------------------------|---------------------|
| 適用場景 | 流程固定、步驟明確 | 任務多變、需要動態路由 |
| 複雜度 | 低，容易理解和除錯 | 高，需要理解分散式概念 |
| Agent 數量 | 4-14 | 15-100+ |
| 學習能力 | 無 | RL-based routing |
| 部署門檻 | 零（純 markdown） | 高（TypeScript monorepo） |

## 六種設計模式

從 5 個案例和更廣泛的 GitHub 生態系中，可以歸納出 6 種 multi-agent 設計模式：

### 1. Orchestrator Pipeline

**代表**：ChemistryTimes
**特徵**：一個 orchestrator 依序調度專業 agent，星狀拓撲
**適合**：流程固定、品質要求高的重複性任務（日報、code review、CI/CD）
**關鍵設計**：orchestrator 不做事只協調，嚴格的角色邊界

### 2. Document-driven Handoff

**代表**：claude-sub-agent
**特徵**：agent 間透過檔案系統交換 artifacts，無直接溝通
**適合**：多階段開發流程，需要可追溯的中間產物
**關鍵設計**：per-agent 工具權限隔離，分數制品質閘門 + 回溯重做

### 3. DAG Wave Execution

**代表**：agentic
**特徵**：任務分解為 DAG，波次平行執行，外部 workflow engine 管控
**適合**：可平行化的複雜任務，需要持久化狀態和 crash recovery
**關鍵設計**：雙層 retry（task + pipeline），Temporal.io 提供狀態持久化

### 4. Knowledge-Persistent Coordination

**代表**：vs-copilot-multi-agent
**特徵**：Hook 強制記憶寫入，跨 session 知識累積，語義搜尋
**適合**：長期專案，需要跨 session 累積團隊知識
**關鍵設計**：SubagentStop hook 封鎖未寫記憶的 agent，contracts 系統做跨 agent 介面管理

### 5. Hierarchical Swarm

**代表**：Ruflo
**特徵**：Queen-led 多拓撲，RL 路由，共識機制
**適合**：大規模、多領域、需要動態路由的企業場景
**關鍵設計**：學習式路由取代固定 pipeline，WASM 快速路徑跳過 LLM

### 6. Parallel Agent Teams（補充）

**代表**：[Anthropic C 編譯器](https://www.anthropic.com/engineering/building-c-compiler)
**特徵**：多個獨立 Claude Code 實例平行工作，共享 task list + mailbox
**適合**：大型、可分割的程式碼專案
**關鍵設計**：每個 agent 負責獨立領域減少衝突，16 agent / ~2,000 session / $20K

## 五個實戰趨勢

### 1. Model Tiering 是標配

| 專案 | Orchestrator | Worker |
|------|-------------|--------|
| ChemistryTimes | Sonnet | （預設） |
| vs-copilot | **Opus** | Sonnet |
| Ruflo | Opus | Sonnet/Haiku |
| claude-sub-agent | （未指定） | （未指定） |

多數專案用高階模型做決策、低階模型做執行。ChemistryTimes 反其道用 sonnet 當 orchestrator 是一個務實的成本選擇——如果 orchestrator 只需要穩定的指令跟隨而非創造性生成，sonnet 就夠了。

### 2. Context 管理決定成敗

每個案例都發展出自己的 context 管理策略：

| 策略 | 誰在用 |
|------|--------|
| 摘要字數上限 | ChemistryTimes（500 字） |
| 檔案 offloading | ChemistryTimes（workspace）、agentic（tmpdir） |
| 截斷保護 | agentic（inline 15K 字元、工具輸出 500 字元） |
| PreCompact 自動存檔 | vs-copilot（context 壓縮前存 note） |
| Wiki-links 知識圖譜 | vs-copilot（跨 session 知識累積） |

Context window 是 multi-agent 系統的**硬天花板**。不處理這個問題，agent 越多品質越差。

### 3. 品質閘門的三種實作

- **Binary**（ChemistryTimes）：pass/fail，失敗停 pipeline
- **分數制 + 回溯**（claude-sub-agent）：低於閾值回到上游重做，最多 3 輪
- **多維度評分**（agentic）：5 維度 1-5 分，overall ≥ 4 才通過

沒有哪種一定最好。Binary 簡單可靠，分數制更細緻但需要校準閾值，多維度最完整但增加 LLM 呼叫成本。

### 4. 記憶持久化是新興戰場

vs-copilot 的 Hook 強制記憶 + Basic Memory MCP 是目前看到最完整的實作。多數專案（包括 ChemistryTimes 和 claude-sub-agent）的知識是 session-scoped 的——session 結束就沒了。

跨 session 知識累積是下一個要解決的問題。方向包括：
- MCP server（Basic Memory、sqlite）
- Git-tracked markdown notes
- 外部 vector database

### 5. 3-5 個 Agent 是甜蜜點

| Agent 數 | 案例 | 觀察 |
|----------|------|------|
| 4 | vs-copilot | 最精簡，靠 Hook 和 contracts 補強 |
| 6 | agentic | 功能性分工，剛好 |
| 8-12 | claude-sub-agent | 涵蓋完整開發週期，偏多 |
| 10-14 | ChemistryTimes | 用嚴格 context 紀律抵消 overhead |
| 15-100+ | Ruflo | 需要 RL 路由才能管理 |

超過 5 個 agent 後，協調開銷增長快於吞吐量。ChemistryTimes 用 10 個之所以可行，是因為它的 context 管理紀律（500 字上限、workspace offload）讓協調成本可控。Ruflo 用 15+ 個則靠 RL 路由和拓撲管理。

**結論**：agent 不是越多越好。先用 3-5 個跑通，碰到瓶頸再加，每加一個都要有對應的 context 管理策略。

## 更多值得探索的專案

| 專案 | Stars | 一句話 |
|------|-------|--------|
| [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) | 16.2k | 130+ 即插即用 subagent 目錄 |
| [K-Dense-AI/claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills) | 17.3k | 134 科研 skills，100+ 資料庫 |
| [disler/claude-code-hooks-multi-agent-observability](https://github.com/disler/claude-code-hooks-multi-agent-observability) | 1.3k | Multi-agent 即時監控 dashboard |
| [cs50victor/claude-code-teams-mcp](https://github.com/cs50victor/claude-code-teams-mcp) | 229 | Agent teams 協議做成 MCP server |
| [baryhuang/claude-code-by-agents](https://github.com/baryhuang/claude-code-by-agents) | 826 | @mention 路由到本地/遠端實例 |
| [lst97/claude-code-sub-agents](https://github.com/lst97/claude-code-sub-agents) | 1.5k | 33 subagent 智能自動委派 |

---

## 參考資料

- [Claude Code Sub-agents Documentation](https://code.claude.com/docs/en/sub-agents)
- [Claude Code Agent Teams Documentation](https://code.claude.com/docs/en/agent-teams)
- [Building a C compiler with a team of parallel Claudes - Anthropic](https://www.anthropic.com/engineering/building-c-compiler)
- [chemistrywow31/chemistry-times](https://github.com/chemistrywow31/chemistry-times)
- [zhsama/claude-sub-agent](https://github.com/zhsama/claude-sub-agent)
- [skmtkytr/agentic](https://github.com/skmtkytr/agentic)
- [ethansadism/vs-copilot-multi-agent](https://github.com/ethansadism/vs-copilot-multi-agent)
- [ruvnet/ruflo](https://github.com/ruvnet/ruflo)
