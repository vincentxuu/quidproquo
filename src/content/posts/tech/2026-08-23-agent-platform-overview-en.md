---
title: "Agent Platform: An In-Depth Look at an Open-Source AI Workflow Control Plane (Part 1)—Architecture and Positioning"
date: 2026-08-23
category: tech
type: deep-dive
tags: ["ai-agent", "workflow", "control-plane", "cloudflare", "agent-platform", "architecture"]
lang: en
description: "Agent Platform is a local-first AI agent workflow control platform that can be deployed to Cloudflare. This first article in the series examines its product positioning, system layers, core abstractions, and design philosophy."
tldr: "Agent Platform turns AI agents from a blank chat window into a structured workflow platform whose behavior can be defined, versioned, observed, verified, and improved. Its built-in Deep Research seed flow demonstrates the complete feedback loop."
---
> 🌏 [中文版](/posts/tech/2026-08-23-agent-platform-overview)

tags: ["ai-agent", "workflow", "control-plane", "cloudflare", "agent-platform", "system-architecture"]
## TL;DR

Agent Platform is an **open-source AI Workflow Control Plane**, not another chatbot framework. It provides eight command surfaces (Define → Configure → Run → Observe → Control → Verify → Produce → Improve) for turning high-value knowledge work into flows that are controllable, auditable, and rerunnable. Its architecture uses a Cloudflare-first deployment model (Workers + D1 + KV + R2 + Vectorize + Queues + Workflows + Durable Objects), while `npm run dev` runs the complete demo locally. The built-in Deep Research seed flow demonstrates the full cycle from planning and search through evidence extraction, synthesis, verification, and report production.

---

## Why Do We Need Another AI Agent Platform?

There is no shortage of agent frameworks: LangGraph, AutoGen, CrewAI, OpenAI Agents SDK, Vercel AI SDK, and many others. Most of them, however, solve **how to let a model call tools**, not **how to run multistep knowledge work under control in production**.

The actual problems are:

| What traditional frameworks focus on | What production environments actually need |
|--------------|----------------|
| Single-turn or multi-turn conversations | Versioned flows, checkpoints, resume/retry-step |
| Tool calls | Provider fallback, budget guards, human approval gates |
| Prompt engineering | Evidence stores, citation tracking, artifact versioning |
| Logging | Structured traces, derived cost/latency/token metrics, quality gates |
| A single run | Evaluation suites, learning loops, regression prevention |

Agent Platform has a precise position: **a Flow is the root product resource, and a Run is an execution instance of a flow version**. You do not “chat with AI” inside the platform. You **define a flow → configure providers, policies, and skills → execute a run → inspect evidence and artifacts → use the result to improve the next flow version**.

---

## Product Positioning in One Sentence

> **Open-source AI workflow control plane for creating, versioning, running, observing, and verifying auditable agent flows.**

In other words:
> A configurable AI agent workflow platform that manages flows, models, tools, data sources, execution policies, verification mechanisms, evidence, and final artifacts in one place.

Three core decisions define it:
1. **Flow-first, not chatbot-first** — begin with controlled processes, then add autonomy gradually
2. **Command surface is MVP** — all eight commands are callable from day one; they are not an admin panel added later
3. **Local-first DX** — `git clone && pnpm install && npm run dev` runs the complete demo without any cloud resource dependency

---

## The Complete System Stack

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

Each layer has its own spec under `openspec/specs/`. The layers communicate through explicit contracts instead of putting all logic into a single orchestrator.

### Cloudflare-First Deployment Topology

The production environment does not run a long-lived Node process. Instead, each capability maps to a native Cloudflare service:

| Platform capability | Cloudflare service | Responsibility |
|----------|----------------|------|
| Web console | Workers Assets | Serves the React + Vite static management interface |
| API gateway | Workers | `/api/health`, `/api/flows`, `/api/runs`, auth/policy/provider routing |
| Durable execution state | Durable Objects | One coordinator per run, with a single writer and real-time state |
| Durable flow execution | Workflows | Flow step execution, pause/resume, retry, step status |
| Background jobs | Queues | Evaluations, artifact export, provider health, non-blocking retries |
| Relational contract | D1 | Existing migration schema |
| Large output | R2 | Reports, evidence bundles, step output, proposal diffs |
| Fast state/cache | KV | Sessions, idempotency, provider health, UI run snapshots |
| Native model option | Workers AI | One optional LLM provider available to the provider router |

Local development uses Node to simulate the same interfaces. `packages/runtime` supports both runtimes.

---

## Eight Command Surfaces

This is Agent Platform's biggest difference from other frameworks: **every command is a first-class API**, not an administrative feature added later.

| Command | Core action | API entry point |
|------|---------|---------|
| **Define** | Create, clone, and edit flow drafts; validate them; publish immutable versions | `POST /api/flows`, `POST /api/flows/:id/versions` |
| **Configure** | Add, test, and disable providers; version policies; install/evaluate skills; bind them to steps | `POST /api/providers`, `/api/policies`, `/api/skills` |
| **Run** | Start a run from a specific flow version + preset, including input validation | `POST /api/flows/:id/runs` |
| **Observe** | Timeline, step details, provider/tool calls, cost, latency, tokens, context snapshots | `GET /api/runs/:id/observability` |
| **Control** | Cancel, resume, retry a single step, and require human approval for external writes | `POST /api/runs/:id/cancel\|retry-step` |
| **Verify** | Review evidence, claims, citations, confidence, and conflicts; approve/reject | `GET /api/runs/:id/evidence/:index` |
| **Produce** | Generate Markdown reports and JSON evidence bundles; version, regenerate, and export them | `GET /api/runs/:id/artifacts/:id` |
| **Improve** | Generate eval cases, skill proposals, policy suggestions, and memory proposals from runs | `GET /api/improvements` |

Every Web UI page maps to one of these commands; the interface is not merely a collection of CRUD list pages.

---

## A Quick Tour of the Core Data Model

### Flow Family
```
Flow → FlowVersion → FlowInputSchema
FlowStep → FlowEdge → FlowPreset → ArtifactSchema
```
- Flow states: `draft` (editable) → `published` (immutable and available for production runs) → `archived` (audit trail retained)
- A Run must bind to a specific `flow_id` + `flow_version_id`, ensuring reproducibility

### Skill Family
```
Skill → SkillVersion → SkillFile → SkillBinding → SkillInvocation
SkillPermission → SkillEval → SkillEvalRun
```
- Skill package structure: `skill.yaml` (metadata/version/permissions/eval) + `SKILL.md` (execution instructions) + `references/` `scripts/` `assets/` `evals/`
- A FlowStep binds explicitly with `uses: citation-extractor@1.0.0`; **it does not depend on the model deciding which skill to load**

### Provider / Tool Family
```
Provider (LLM/Search/Reader/Knowledge/Action/Verifier)
MCP Server → MCP Tool → ToolInvocation
```
- The Groundlane MCP server provides `web_search`, `web_fetch`, and `web_extract`, along with 12 search adapters, RRF fusion, and budget controls
- Step-local tool selection exposes only the subset of tools allowed by the flow, skill, and policy

### Policy Family
```
Policy → PolicyVersion → Guard (input/tool/output/budget) → ApprovalGate → LoopProtection
```
- Budgets, allow/deny lists, guardrails, human approval, and escalation are **configuration, not hardcoded logic**

### Observability / Evidence / Artifact Family
```
FlowRun → StepRun → SkillInvocation → ProviderCall → ToolInvocation
EvidenceItem (claim ↔ source ↔ excerpt ↔ citation ↔ confidence ↔ conflict)
ArtifactVersion (markdown_report, evidence_bundle, ...)
```
- A hierarchical structured trace supports claim-to-source traceability
- Artifacts are versioned and support approve/reject/regenerate/export

---

## Deep Research Seed Flow: Demonstrating the Complete Feedback Loop

The built-in Deep Research flow is not a toy demo. It is the reference implementation that validates the entire runtime contract:

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

**Three presets**: Quick (low cost and fast) → Standard (balanced) → Deep (high coverage with multiple verification passes)

Without an API key, it runs in **deterministic offline mode** by reading `fixtures/local-research-sources.json`. It still produces complete evidence, artifacts, and traces, making it suitable for CI/CD, evaluation, and offline development.

---

## Design Philosophy: Why Divide the System This Way?

### 1. Flow ≠ DAG Builder v1
The first flow editor uses a **structured form + schema/YAML view** instead of a drag-and-drop visual DAG. The reasons are:
- Engineering-grade schemas require precise control over input validation, preset binding, and policy references
- A visual builder can easily create flows that look connected but cannot run
- Curated flows provide more guidance as reusable templates than a blank canvas does

### 2. Skill ≠ MCP Tool ≠ A2A
| Concept | Responsibility | Example |
|------|------|------|
| **Flow** | Task orchestration: which steps exist and how they connect | Deep Research |
| **Skill** | Capability package/methodology: how to complete a class of work reliably | citation-extractor |
| **MCP** | Tool and data-source connectivity through a unified interface | web_search, browser.fetch |
| **A2A** | Protocol for delegating to external agents | Delegate a step to an agent on another platform |
| **Policy** | Cost, permissions, verification, and human review | max_cost_usd, approval_gate |

Skills use **progressive disclosure**:
- Level 1: `skill.yaml` is always scannable so the router can determine relevance
- Level 2: `SKILL.md` is loaded only after a step confirms it will use the skill
- Level 3: `references/scripts/assets` are loaded only when execution requires them

### 3. Learning Loop: Agents Propose, Humans Review
> Agent can propose learning, but production knowledge requires eval and human approval.

Learning signals include `user_correction`, `run_failed_then_succeeded`, `step_retry_succeeded`, `verifier_failure`, `cost_outlier`, `provider_failure`, and more.

The system produces four types of reviewable proposals:
- **MemoryUpdate** — small preferences or conventions
- **SkillProposal** — a new skill or a change to an existing skill
- **PolicySuggestion** — provider fallback changes, tool restrictions, or approval gates
- **EvalCase** — a real failure converted into a regression test

The process is: run completed → learning candidate detector → trace summarizer → proposal → human review → sandbox eval → publish.

### 4. Evaluation Is a Quality Gate, Not an After-the-Fact Statistic
The evaluation types cover the full system: Flow/Step/Skill/Artifact/Evidence/Policy/Regression.
They run at three points: **Pre-run** binding validation, **In-run** step-boundary validation, and **Post-run** artifact/evidence/trajectory evaluation.

The skill publication gate is: `draft → trigger eval → functional eval → policy eval → regression eval → human review → publish`. A failure blocks publication.

---

## Quick Start: Five Minutes Locally

```bash
git clone https://github.com/agent-platform/agent-platform.git
cd agent-platform
pnpm install
cp .dev.vars.example .dev.vars   # 選填：加入 provider keys
npm run dev
# → http://127.0.0.1:8787
```

1. Open the Web UI → **Run** tab
2. Select **Deep Research** → **Standard** preset
3. Enter a topic, such as “agent memory systems comparison” → **Start run**
4. Watch the streaming timeline → when it finishes, open **Evidence** / **Artifacts**

If no provider key is available, the platform automatically uses fixtures in offline mode, preserving every step of the full experience.

---

## Series Roadmap

This is the first article in the series. The remaining articles examine each subsystem in depth:

| Part | Topic | Core content |
|------|------|----------|
| **2** | Flow Runtime & Versioning | FlowVersion immutability, step DAGs, checkpoint/resume/retry-step, presets |
| **3** | Skill System & Learning Loop | skill.yaml/SKILL.md, explicit binding, invocation tracking, learning signal → proposal → eval → publish |
| **4** | Provider Router & MCP Integration | Groundlane MCP, 12 search adapters, RRF fusion, fallback chains, step-local tool selection |
| **5** | Policy Engine & Runtime Guards | Budget/allow-deny/guardrails, human approval, loop protection, escalation records |
| **6** | Observability, Evidence & Artifacts | Structured traces, evidence store (claim ↔ source), artifact versioning, export |
| **7** | Evaluation & Quality Gates | Eval suites/cases, quality gates, regression prevention, skill publication blocking |
| **8** | Context/Memory & Cloudflare Deployment | ContextSnapshot, budget allocation, procedural/episodic/semantic memory, hands-on Wrangler deployment |

---

## References

- [Agent Platform GitHub Repo](https://github.com/vincentxuu/agent-platform)
- [Agent Platform README](https://github.com/vincentxuu/agent-platform/blob/main/README.md)
- [Agent Gateway Planning Document](https://github.com/vincentxuu/agent-platform/blob/main/agent-gateway-plan.md)
- [OpenSpec Specs](https://github.com/vincentxuu/agent-platform/tree/main/openspec/specs) — specifications for seven major capabilities
- [Groundlane MCP Server](https://github.com/vincentxuu/groundlane) — a unified interface for search, reading, and extraction
- [free-llm-models](https://github.com/vincentxuu/free-llm-models) — a verified list of free models
