---
title: "Agent Platform：開源 AI Workflow Control Plane 深度解析（一）— 架構與定位"
date: 2026-08-23
category: tech
tags: ["ai-agent", "workflow", "control-plane", "cloudflare", "agent-platform", "architecture"]
lang: zh-TW
description: "Agent Platform 是一個 local-first、可部署到 Cloudflare 的 AI agent 工作流控制平台。本文為系列第一篇，解析其產品定位、系統分層、核心抽象與設計哲學。"
tldr: "Agent Platform 把 AI agent 從「空白聊天視窗」升級為「可定義、可版本化、可觀測、可驗證、可改進」的結構化工作流平台，內建 Deep Research seed flow 示範完整閉環。"
---
> 🌏 [English version](/posts/tech/2026-08-23-agent-platform-overview-en)

tags: ["ai-agent", "workflow", "control-plane", "cloudflare", "agent-platform", "system-architecture"]
## TL;DR

Agent Platform 是 **開源 AI Workflow Control Plane**，而非另一個 chatbot 框架。它提供 8 大指令面（Define → Configure → Run → Observe → Control → Verify → Produce → Improve），讓你把「高價值知識工作」轉成可控、可審計、可重跑的 flow。架構採 Cloudflare-first 部署（Workers + D1 + KV + R2 + Vectorize + Queues + Workflows + Durable Objects），本機 `npm run dev` 即可跑完整 demo。Deep Research 為內建 seed flow，展示從規劃、搜尋、抽取證據、綜合、驗證到產出報告的完整循環。

---

## 為什麼需要另一個 AI Agent 平台？

市面上不缺 agent 框架：LangGraph、AutoGen、CrewAI、OpenAI Agents SDK、Vercel AI SDK……但它們多半解決的是**「怎麼讓模型呼叫工具」**，而非**「怎麼在生產環境可控地跑多步驟知識工作」**。

真實痛點在於：

| 傳統框架關注點 | 生產環境真正需要 |
|--------------|----------------|
| 單輪/多輪對話 | 版本化 flow、checkpoint、resume/retry-step |
| 工具呼叫 | Provider fallback、budget guard、human approval gate |
| Prompt engineering | Evidence store、citation tracking、artifact versioning |
| 紀錄 log | 結構化 trace、cost/latency/token 衍生指標、quality gate |
| 單一 run | Evaluation suite、learning loop、regression prevention |

Agent Platform 的定位很精確：**Flow 是產品根資源，Run 是 flow version 的執行實例**。你不會在平台裡「跟 AI 聊天」，而是**定義 flow → 配置 provider/policy/skill → 執行 run → 觀測證據與產物 → 從結果改進下一版 flow**。

---

## 產品定位一句話

> **Open-source AI workflow control plane for creating, versioning, running, observing, and verifying auditable agent flows.**

中文版：
> 一個可配置的 AI Agent 工作流平台，統一管理 flows、模型、工具、資料來源、執行策略、驗證機制、證據與最終產物。

三個核心判斷：
1. **Flow-first, not chatbot-first** — 先用可控流程，再逐步加入 autonomy
2. **Command surface is MVP** — 8 大指令從 day one 就可呼叫，不是事後補上的 admin panel
3. **Local-first DX** — `git clone && pnpm install && npm run dev` 跑完整 demo，零雲端資源依賴

---

## 系統分層全景

```
Web UI
  ↓
Flow Definition Layer
  ↓
Skill System
  ↓
Learning Loop
  ↓
Evaluation System
  ↓
Observability System
  ↓
Policy Engine
  ↓
Context Management
  ↓
Memory System
  ↓
Runtime Controls
  ↓
AI Agent Harness
  ↓
MCP / Provider Router / A2A Adapter
  ↓
Evidence / Audit Store
  ↓
Artifact System
```

每一層都有獨立 spec（見 `openspec/specs/`），各層透過明確契約溝通，不是把所有邏輯塞進單一 orchestrator。

### Cloudflare-first 部署拓撲

正式環境不跑 Node 長程序，而是映射到 Cloudflare 原生服務：

| 平台能力 | Cloudflare 服務 | 責任 |
|----------|----------------|------|
| Web console | Workers Assets | 服務 React + Vite 靜態管理介面 |
| API gateway | Workers | `/api/health`、`/api/flows`、`/api/runs`、auth/policy/provider routing |
| Durable execution state | Durable Objects | 每個 run 一個 coordinator，單一寫入者 + 即時狀態 |
| Durable flow execution | Workflows | flow step execution、pause/resume、retry、step status |
| Background jobs | Queues | eval、artifact export、provider health、非阻塞 retry |
| Relational contract | D1 | 既有 migrations schema |
| Large output | R2 | report、evidence bundle、step output、proposal diff |
| Fast state/cache | KV | session、idempotency、provider health、UI run snapshot |
| Native model option | Workers AI | provider router 可選的 LLM provider 之一 |

本機開發用 Node 模擬同樣介面，`packages/runtime` 同時支援兩種 runtime。

---

## 8 大指令面（Command Surface）

這是 Agent Platform 與其他框架最大不同：**每個指令都是第一公民 API**，不是事後補上的管理功能。

| 指令 | 核心動作 | API 入口 |
|------|---------|---------|
| **Define** | 建立/複製/編輯 flow draft、驗證、發布不可變版本 | `POST /api/flows`、`POST /api/flows/:id/versions` |
| **Configure** | 新增/測試/停用 providers、版本化 policies、安裝/eval skills、綁定到 steps | `POST /api/providers`、`/api/policies`、`/api/skills` |
| **Run** | 從特定 flow version + preset 啟動 run（含輸入驗證） | `POST /api/flows/:id/runs` |
| **Observe** | Timeline、step 詳情、provider/tool 調用、成本、延遲、tokens、context 快照 | `GET /api/runs/:id/observability` |
| **Control** | 取消、恢復、重試單一 step、外部寫入需人工核准 | `POST /api/runs/:id/cancel\|retry-step` |
| **Verify** | 審閱 evidence、claims、citations、confidence、conflicts；approve/reject | `GET /api/runs/:id/evidence/:index` |
| **Produce** | 產生 Markdown 報告、JSON evidence bundles；版本化、重新產生、匯出 | `GET /api/runs/:id/artifacts/:id` |
| **Improve** | 從 runs 產生 eval cases、skill proposals、policy suggestions、memory proposals | `GET /api/improvements` |

Web UI 的每個頁面都對應一個指令，不是單純的 CRUD 列表頁。

---

## 核心資料模型速覽

### Flow 族群
```
Flow → FlowVersion → FlowInputSchema
FlowStep → FlowEdge → FlowPreset → ArtifactSchema
```
- Flow 狀態：`draft`（可編輯）→ `published`（不可變，供正式 run）→ `archived`（保留審計軌跡）
- Run 必須綁定具體 `flow_id` + `flow_version_id`，保證可重現

### Skill 族群
```
Skill → SkillVersion → SkillFile → SkillBinding → SkillInvocation
SkillPermission → SkillEval → SkillEvalRun
```
- 技能包結構：`skill.yaml`（metadata/版本/權限/eval）+ `SKILL.md`（執行指令）+ `references/` `scripts/` `assets/` `evals/`
- FlowStep 用 `uses: citation-extractor@1.0.0` 顯式綁定，**不依賴模型自行決定載入哪個 skill**

### Provider / Tool 族群
```
Provider (LLM/Search/Reader/Knowledge/Action/Verifier)
MCP Server → MCP Tool → ToolInvocation
```
- Groundlane MCP server 提供 `web_search`、`web_fetch`、`web_extract`，12 search adapters、RRF fusion、預算控制
- Step-local tool selection：只暴露 flow/skill/policy 允許的工具子集

### Policy 族群
```
Policy → PolicyVersion → Guard (input/tool/output/budget) → ApprovalGate → LoopProtection
```
- 預算、allow/deny list、guardrails、human approval、escalation 都是**配置而非硬編碼**

### Observability / Evidence / Artifact 族群
```
FlowRun → StepRun → SkillInvocation → ProviderCall → ToolInvocation
EvidenceItem (claim ↔ source ↔ excerpt ↔ citation ↔ confidence ↔ conflict)
ArtifactVersion (markdown_report, evidence_bundle, ...)
```
- 結構化 trace 階層，支援 claim-to-source 追溯
- Artifact 版本化，支援 approve/reject/regenerate/export

---

## Deep Research Seed Flow：展示完整閉環

內建的 Deep Research flow 不是 demo toy，而是驗證整個 runtime contract 的 reference implementation：

```yaml
id: deep_research
steps:
  - clarify          # agent: 澄清研究範圍
  - build_brief      # transform: 產出 research brief
  - plan             # agent: 規劃搜尋策略
  - search           # tool_group: 多 provider 搜尋
  - rank_sources     # agent: 來源排序去重
  - read_sources     # tool_group: 讀取全文
  - extract_evidence # agent: 抽取 claims + citations
  - synthesize       # agent: 綜合生成報告草稿
  - verify           # verifier: 檢查 evidence coverage
  - export           # artifact: 產出 markdown + JSON bundle
edges:
  - verify → search (condition: coverage_insufficient)  # 回圈補強
  - verify → export (condition: passed)
```

**Preset 三檔**：Quick（低成本、快速）→ Standard（平衡）→ Deep（高覆蓋、多輪驗證）

無 API key 時跑 **deterministic offline mode**（讀 `fixtures/local-research-sources.json`），仍產出完整 evidence、artifact、trace——適合 CI/CD、評估、離線開發。

---

## 設計哲學：為什麼這樣切？

### 1. Flow ≠ DAG Builder v1
第一版 flow editor 用**結構化表單 + schema/YAML 檢視**，不做拖拉式 visual DAG。理由：
- 工程級 schema 需要精確控制（input validation、preset binding、policy ref）
- Visual builder 容易產生「看起來通但跑不動」的流程
- Curated flows 作為可複製模板，比空白畫布更有引導性

### 2. Skill ≠ MCP Tool ≠ A2A
| 概念 | 責任 | 例子 |
|------|------|------|
| **Flow** | 任務編排（什麼步驟、怎麼串） | Deep Research |
| **Skill** | 能力包/方法論（怎麼穩定完成某類工作） | citation-extractor |
| **MCP** | 工具與資料源連接（統一介面） | web_search, browser.fetch |
| **A2A** | 外部 agent 委派協議 | 將步驟委派給其他平台的 agent |
| **Policy** | 成本、權限、驗證、人類審核 | max_cost_usd, approval_gate |

Skill 採 **progressive disclosure**：
- Level 1: `skill.yaml` 永遠可掃描，router 判斷 relevance
- Level 2: `SKILL.md` 只有 step 確認使用時才載入
- Level 3: `references/scripts/assets` 執行需要時才載入

### 3. Learning Loop：Agent 提案，人類審核
> Agent can propose learning, but production knowledge requires eval and human approval.

學習訊號來源：`user_correction`、`run_failed_then_succeeded`、`step_retry_succeeded`、`verifier_failure`、`cost_outlier`、`provider_failure`…

輸出四類可審核提案：
- **MemoryUpdate** — 小型偏好/慣例
- **SkillProposal** — 新 skill 或既有 skill 修改
- **PolicySuggestion** — provider fallback 調整、tool 限制、approval gate
- **EvalCase** — 真實失敗案例轉 regression test

流程：run completed → learning candidate detector → trace summarizer → proposal → human review → sandbox eval → publish。

### 4. Evaluation 是品質閘門，不是事後統計
Eval 類型完整覆蓋：Flow/Step/Skill/Artifact/Evidence/Policy/Regression。
三種執行時機：**Pre-run** 驗證 binding、**In-run** step boundary 驗證、**Post-run** artifact/evidence/trajectory 評估。

Skill 發布 gate：`draft → trigger eval → functional eval → policy eval → regression eval → human review → publish`。失敗即阻擋發布。

---

## 快速上手（本機 5 分鐘）

```bash
git clone https://github.com/agent-platform/agent-platform.git
cd agent-platform
pnpm install
cp .dev.vars.example .dev.vars   # 選填：加入 provider keys
npm run dev
# → http://127.0.0.1:8787
```

1. 開啟 Web UI → **Run** 分頁
2. 選 **Deep Research** → preset **Standard**
3. 輸入主題（例如：「agent memory systems comparison」）→ **Start run**
4. 觀看 streaming timeline → 完成後開啟 **Evidence** / **Artifacts**

無 provider key 時自動用 fixtures 跑離線模式，完整體驗不缺步驟。

---

## 系列文章規劃

本文為系列第一篇，後續深入各子系統：

| 篇次 | 主題 | 核心內容 |
|------|------|----------|
| **二** | Flow Runtime & Versioning | FlowVersion 不變性、step DAG、checkpoint/resume/retry-step、preset 機制 |
| **三** | Skill System & Learning Loop | skill.yaml/SKILL.md、explicit binding、invocation tracking、learning signal → proposal → eval → publish |
| **四** | Provider Router & MCP Integration | Groundlane MCP、12 search adapters、RRF fusion、fallback chain、step-local tool selection |
| **五** | Policy Engine & Runtime Guards | Budget/allow-deny/guardrails、human approval、loop protection、escalation records |
| **六** | Observability, Evidence & Artifacts | 結構化 trace、evidence store（claim↔source）、artifact versioning、export |
| **七** | Evaluation & Quality Gates | Eval suite/case、quality gate、regression prevention、skill 發布阻擋機制 |
| **八** | Context/Memory & Cloudflare Deployment | ContextSnapshot、budget allocation、procedural/episodic/semantic memory、wrangler 部署實戰 |

---

## 參考資料

- [Agent Platform GitHub Repo](https://github.com/vincentxuu/agent-platform)
- [Agent Platform README](https://github.com/vincentxuu/agent-platform/blob/main/README.md)
- [Agent Gateway 規劃文件](https://github.com/vincentxuu/agent-platform/blob/main/agent-gateway-plan.md)
- [OpenSpec Specs](https://github.com/vincentxuu/agent-platform/tree/main/openspec/specs) — 7 大能力規格
- [Groundlane MCP Server](https://github.com/vincentxuu/groundlane) — 搜尋/讀取/抽取統一介面
- [free-llm-models](https://github.com/vincentxuu/free-llm-models) — 免費模型驗證清單
