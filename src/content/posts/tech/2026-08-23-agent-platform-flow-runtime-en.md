---
title: "Agent Platform Deep Dive (Part 2) — Flow Runtime: Versioned Flows, Checkpoints, and Resume/Retry Mechanisms"
date: 2026-08-23
category: tech
type: deep-dive
tags: ["ai-agent", "workflow", "flow-runtime", "checkpoint", "versioning", "agent-platform", "durable-execution"]
lang: en
description: "A deep dive into Agent Platform's core Flow Runtime subsystem: immutable FlowVersions, Step DAG execution, checkpoint persistence, resume and retry-step controls, and the actual structure of the Deep Research seed flow."
tldr: "Flow Runtime is the heart of Agent Platform: a Flow becomes immutable when published, each Run is bound to a specific version and preset, Steps move through a DAG according to edge conditions, every boundary saves a checkpoint, and resume/retry-step preserves the complete trace history."
---
> 🌏 [中文版](/posts/tech/2026-08-23-agent-platform-flow-runtime)

tags: ["ai-agent", "workflow", "flow-runtime", "checkpoint", "versioning", "agent-platform", "durable-execution", "step-dag"]
## TL;DR

Flow Runtime implements four core capabilities: **versioned flow definitions, Step DAG execution, checkpoint persistence, and fine-grained controls**:
- **Immutable FlowVersions**: A published version cannot be changed. Binding each Run to `flow_id + flow_version_id` makes it reproducible.
- **Step DAGs with conditional edges**: `findNextStepIds` chooses the next step from `stepOutput[condition]`, including loops such as `verify → search (coverage_insufficient)`.
- **A checkpoint after every step**: completed/current/remaining steps, keyOutputs, token/cost, artifact/evidence refs, and approval state are all persisted.
- **Resume/Retry-step**: `resumeLatestCheckpoint` continues from the interruption point, while `retryStep` creates a new attempt and preserves the earlier error record.

The ten-step Deep Research seed flow demonstrates the complete loop: `clarify → build_brief → plan → search → rank_sources → read_sources → extract_evidence → synthesize → verify → export`. Its three presets—Quick, Standard, and Deep—differ only in their policy budgets.

---

## Why Is Flow Runtime Designed This Way?

Most agent frameworks mix flow definitions with execution state. That creates three problems:
- You cannot compare multiple versions of the same flow.
- After an interruption, you must rerun the entire flow instead of retrying the failed step.
- You cannot audit which flow version, preset, or parameters a run used at the time.

Agent Platform follows one principle: **a Flow is a static template, a Run is a dynamic instance, and the two are strictly separated and connected by Checkpoints**.

---

## Core Data Model

### Flow Definition (Static and Versioned)

```typescript
// packages/core/src/flow.ts
interface FlowDefinition {
  id: string;                    // "deep_research"
  name: string;                  // "Deep Research"
  version: number;               // 1, 2, 3... 發布時遞增
  description?: string;
  inputs: FlowInput[];           // 輸入 schema + required/default
  presets: FlowPreset[];         // Quick/Standard/Deep，各帶 policy
  steps: FlowStep[];             // 10 個步驟定義
  edges: FlowEdge[];             // DAG 邊緣，含 condition
  artifacts: FlowArtifact[];     // 輸出 artifact 類型
}

interface FlowStep {
  id: string;                    // "search"
  type: "agent" | "tool_group" | "transform" | "verifier" | "artifact";
  skill?: string;                // "source-ranker@1.0.0" (explicit binding)
  providerRole?: string;         // "search" / "reader" (tool_group 用)
}

interface FlowEdge {
  from: string;
  to: string;
  condition?: string;            // 如 "coverage_insufficient"，依 stepOutput 判斷
}

interface FlowPreset {
  id: "quick" | "standard" | "deep";
  name: string;
  policy: PolicyConfig;          // max_cost_usd, max_iterations, min_sources...
}
```

**Key points**:
- `version` is an integer incremented by `+1` on publication. **Older versions are never modified.**
- `steps` contain only `id`, `type`, and `skill`/`providerRole`. They **do not contain execution logic**; that logic lives in the Skill, Provider, or Handler.
- `edges.condition` turns the DAG into a **state machine**. If the `verify` step returns `{ coverage_insufficient: true }`, the flow can loop back to `search`.

### Run State (Dynamic and Independent for Each Execution)

```typescript
// packages/runtime/src/flow-runtime.ts
interface FlowRun {
  id: string;                    // "run_abc123"
  flowId: string;                // "deep_research"
  flowVersion: number;           // 1 ——**關鍵：鎖定具體版本**
  presetId: string;              // "standard"
  status: "active" | "succeeded" | "failed" | "paused" | "canceled";
  inputs: Record<string, any>;   // 用戶填入的 topic、audience...
  currentStepIds: string[];      // 當前可執行步驟（支援並行）
  completedStepIds: string[];    // 已完成步驟
  remainingStepIds: string[];    // 剩餘步驟
  outputs: Record<string, any>;  // stepId → output 映射
  artifactRefs: string[];        // 產出的 artifact IDs
  evidenceRefs: string[];        // 產出的 evidence IDs
  costUsd: number;               // 累積成本
  tokenUsage: { input: number; output: number };
  createdAt: string;             // ISO timestamp
  endedAt?: string;
  error?: ErrorInfo;
}
```

**The binding between a Run and its FlowVersion is immutable.** Even after a flow publishes v2, a v1 run can still be rerun, resumed, and audited.

### StepRun (Step-Level Execution Record)

```typescript
interface StepRun {
  id: string;                    // "step_xyz789"
  runId: string;
  stepId: string;                // 對應 FlowStep.id
  status: "pending" | "running" | "succeeded" | "failed" | "paused" | "canceled" | "skipped";
  attempt: number;               // retry 時 +1
  output?: any;                  // 步驟輸出，供 edge condition 判斷
  error?: ErrorInfo;
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
}
```

- `attempt` records the retry count. **Each retry creates a new StepRun and keeps the old one** instead of overwriting it.
- `output` provides the key data that `findNextStepIds` uses to evaluate conditions.

---

## Execution Flow: From Create Run to Complete

### 1. Create a Run (`createRun`)

```typescript
createRun({ flow, presetId, inputs }) {
  // 1. 驗證 flow 定義完整性
  assertValidFlowDefinition(flow);
  
  // 2. 找 preset，驗證 inputs
  const preset = flow.presets.find(p => p.id === presetId);
  const inputErrors = validateFlowInputs(flow, inputs);
  
  // 3. 建立 FlowRun 記錄
  const run = {
    id: runId,
    flowId: flow.id,
    flowVersion: flow.version,   // 鎖定版本
    presetId,
    status: "active",
    inputs,
    currentStepIds: findInitialStepIds(flow),  // 入度為 0 的步驟
    completedStepIds: [],
    remainingStepIds: flow.steps.map(s => s.id),
    outputs: {},
    artifactRefs: [],
    evidenceRefs: [],
    costUsd: 0,
    tokenUsage: { input: 0, output: 0 },
    createdAt: now()
  };
  
  // 4. 為每個初始步驟建立 StepRun (pending)
  for (const stepId of initialStepIds) {
    createStepRun(runId, stepId);
  }
  
  // 5. 存第一個 checkpoint
  saveCheckpoint(runId);
  
  return run;
}
```

The **step with an in-degree of zero** is `clarify`, the first step in Deep Research. `findInitialStepIds` finds the steps that do not appear in `edges.to`.

### 2. Step Execution Lifecycle

```
StepRun: pending → startStep() → running → completeStep() → succeeded
                              ↘ failStep() → failed
```

The core logic in **completeStep**:

```typescript
completeStep({ flow, stepRunId, output }) {
  const stepRun = requireStepRun(stepRunId);
  const run = requireRun(stepRun.runId);
  
  // 1. 標記步驟成功
  stepRun.status = "succeeded";
  stepRun.output = output;
  stepRun.endedAt = now();
  
  // 2. 更新 Run 狀態
  run.outputs[stepRun.stepId] = output;
  run.completedStepIds.push(stepRun.stepId);
  run.remainingStepIds = run.remainingStepIds.filter(id => id !== stepRun.stepId);
  
  // 3. 依 edges + output 找下一步（關鍵：condition 判斷）
  const nextStepIds = findNextStepIds(flow, stepRun.stepId, output);
  run.currentStepIds = nextStepIds;
  
  // 4. 為每個下一步建立 StepRun (pending)
  for (const nextStepId of nextStepIds) {
    createStepRun(run.id, nextStepId);
  }
  
  // 5. 無下一步 = 流程結束
  if (nextStepIds.length === 0) {
    run.status = "succeeded";
    run.endedAt = now();
  }
  
  // 6. 存 checkpoint
  saveCheckpoint(run.id);
  
  return { run, stepRun, nextStepIds };
}
```

### 3. `findNextStepIds`: How Conditional Edges Work

```typescript
export function findNextStepIds(flow, fromStepId, stepOutput = {}) {
  return flow.edges
    .filter(edge => edge.from === fromStepId)
    .filter(edge => edge.condition ? Boolean(stepOutput[edge.condition]) : true)
    .map(edge => edge.to);
}
```

The key edges in Deep Research:
```typescript
{ from: "verify", to: "search", condition: "coverage_insufficient" },
{ from: "verify", to: "export", condition: "passed" }
```

- If `verify` returns `{ coverage_insufficient: true }`, the flow loops back to `search` to strengthen its source coverage.
- If `verify` returns `{ passed: true }`, the flow proceeds to `export` and produces an artifact.
- The verifier logic guarantees that the two conditions are mutually exclusive, creating a **bounded loop** limited by the policy's `max_iterations`.

---

## Checkpoints: The Foundation of Durable Execution

Every step boundary—success, failure, or cancellation—calls `saveCheckpoint`:

```typescript
saveCheckpoint(runId) {
  const run = requireRun(runId);
  const checkpoint = {
    id: checkpointId,
    runId,
    completedStepIds: [...run.completedStepIds],
    currentStepIds: [...run.currentStepIds],
    remainingStepIds: [...run.remainingStepIds],
    keyOutputs: run.outputs,           // 所有步驟輸出
    tokenUsage: run.tokenUsage,
    costUsd: run.costUsd,
    artifactRefs: [...run.artifactRefs],
    evidenceRefs: [...run.evidenceRefs],
    createdAt: now()
  };
  this.checkpoints.set(runId, checkpoint);
  return checkpoint;
}
```

**What does a Checkpoint store?** Everything needed to recover execution:
| Field | Purpose |
|------|------|
| `completedStepIds` | Identifies completed steps so they are not rerun |
| `currentStepIds` | Identifies where execution should continue |
| `remainingStepIds` | Identifies which steps remain |
| `keyOutputs` | Stores upstream outputs needed downstream, such as the output from `plan` that `search` consumes |
| `tokenUsage` / `costUsd` | Prevents cost tracking from resetting |
| `artifactRefs` / `evidenceRefs` | Preserves references to generated outputs |
| `approval state` | Stores human approval state; this will be added in the production version |

**The local version uses an in-memory Map. The production version maps the same interface to a Durable Object plus D1/KV/R2.**

---

## Resume: Continue from the Interruption Point

```typescript
resumeLatestCheckpoint(runId) {
  const run = requireRun(runId);
  const checkpoint = this.checkpoints.get(runId);
  if (!checkpoint) throw new Error("No checkpoint found");
  
  run.status = "active";
  run.currentStepIds = checkpoint.currentStepIds;   // 回復當時可執行步驟
  run.remainingStepIds = checkpoint.remainingStepIds;
  
  // 注意：completedStepIds、outputs、cost、token、artifact/evidence refs
  // 都已在 run 物件上，不需從 checkpoint 還原（checkpoint 只是備份）
  
  recordEvent(runId, "run.resumed", { checkpointId: checkpoint.id });
  return { run, checkpoint };
}
```

**Key design decision**: The Run object itself remains in memory or in the database. **The Checkpoint is only a snapshot backup.** Resume only needs to write `currentStepIds` and `remainingStepIds` back to the Run. Other state—outputs, cost, and artifacts—was already preserved on the Run.

> In production, a Durable Object holds the Run state while checkpoints are periodically flushed to D1. Worker restarts, deployments, and scaling do not lose Run state.

---

## Retry-step: Retry One Step Without Affecting the Entire Flow

```typescript
retryStep(stepRunId) {
  const failedStep = requireStepRun(stepRunId);
  if (failedStep.status !== "failed") throw new Error("Only failed steps can be retried");
  
  // 建立新 StepRun，attempt +1，狀態重置為 pending
  const retry = {
    ...failedStep,
    id: newId("step"),
    status: "pending",
    attempt: failedStep.attempt + 1,
    error: undefined,
    startedAt: undefined,
    endedAt: undefined,
    createdAt: now()
  };
  
  // Run 狀態回到 active，currentStepIds 指向這個步驟
  const run = requireRun(failedStep.runId);
  run.status = "active";
  run.currentStepIds = [failedStep.stepId];
  
  this.stepRuns.set(retry.id, retry);
  recordEvent(run.id, "step.retry_created", { 
    originalStepRunId: stepRunId, 
    retryStepRunId: retry.id 
  });
  saveCheckpoint(run.id);
  
  return retry;
}
```

**Design details**:
- **The old StepRun remains**, including its `failed` status, error message, and attempt number, providing a complete audit trail.
- **The new StepRun** begins in `pending` with `attempt = 2` or higher.
- The Run's `status` changes from `failed` back to `active`, and `currentStepIds` contains only that step.
- **Upstream steps are not rerun.** `completedStepIds` and `outputs` are already present, so downstream execution can use the existing data.

This is essential when a search API fails transiently or a model returns an invalid output format and needs another attempt with an adjusted prompt.

---

## Cancel / Pause: Stop Gracefully

```typescript
cancelRun(runId) {
  const run = requireRun(runId);
  run.status = "canceled";
  run.endedAt = now();
  
  // 進行中的 StepRun 標記 canceled
  for (const stepRun of stepRuns.values()) {
    if (stepRun.runId === runId && 
        ["pending", "running"].includes(stepRun.status)) {
      stepRun.status = "canceled";
      stepRun.endedAt = now();
    }
  }
  
  recordEvent(runId, "run.canceled", {});
  saveCheckpoint(runId);
  return run;
}
```

- A `canceled` Run cannot be resumed without human review, but its complete trace is retained.
- A `paused` Run, triggered in production by an approval gate or policy, can be resumed.

---

## Deep Research Flow in Practice

```typescript
// packages/core/src/deep-research-flow.ts
const deepResearchFlow = {
  id: "deep_research",
  version: 1,
  inputs: [
    { id: "topic", type: "string", required: true },
    { id: "audience", type: "string", required: false },
    { id: "freshness_days", type: "number", required: false, default: 365 }
  ],
  presets: [
    { id: "quick",   policy: { max_cost_usd: 1, max_iterations: 2, min_sources_per_subquestion: 1 } },
    { id: "standard", policy: { max_cost_usd: 3, max_iterations: 4, min_sources_per_subquestion: 3, conflict_check: true } },
    { id: "deep",    policy: { max_cost_usd: 8, max_iterations: 6, min_sources_per_subquestion: 5, conflict_check: true, stale_source_check: true } }
  ],
  steps: [
    { id: "clarify", type: "agent", skill: "research-planner@1.0.0" },
    { id: "build_brief", type: "transform" },
    { id: "plan", type: "agent", skill: "research-planner@1.0.0" },
    { id: "search", type: "tool_group", providerRole: "search" },
    { id: "rank_sources", type: "agent", skill: "source-ranker@1.0.0" },
    { id: "read_sources", type: "tool_group", providerRole: "reader" },
    { id: "extract_evidence", type: "agent", skill: "citation-extractor@1.0.0" },
    { id: "synthesize", type: "agent", skill: "report-synthesizer@1.0.0" },
    { id: "verify", type: "verifier" },
    { id: "export", type: "artifact" }
  ],
  edges: [
    { from: "clarify", to: "build_brief" },
    { from: "build_brief", to: "plan" },
    { from: "plan", to: "search" },
    { from: "search", to: "rank_sources" },
    { from: "rank_sources", to: "read_sources" },
    { from: "read_sources", to: "extract_evidence" },
    { from: "extract_evidence", to: "synthesize" },
    { from: "synthesize", to: "verify" },
    { from: "verify", to: "search", condition: "coverage_insufficient" },
    { from: "verify", to: "export", condition: "passed" }
  ],
  artifacts: [
    { id: "markdown_report", type: "markdown_report" },
    { id: "evidence_bundle", type: "json_evidence_bundle" }
  ]
};
```

### Step Responsibilities

| Step | Type | Skill/Provider | Responsibility | Key Output Field |
|------|------|----------------|----------|--------------|
| clarify | agent | research-planner | Clarify the research scope and produce subquestions | `subquestions[]` |
| build_brief | transform | — | Assemble the research brief | `brief` |
| plan | agent | research-planner | Plan the search strategy and keywords | `search_plan` |
| search | tool_group | search provider | Search multiple providers in parallel and deduplicate results | `sources[]` |
| rank_sources | agent | source-ranker | Rank and filter sources by credibility | `ranked_sources[]` |
| read_sources | tool_group | reader provider | Fetch full text and extract passages | `source_contents[]` |
| extract_evidence | agent | citation-extractor | Extract claims, citations, and excerpts | `evidence_items[]` |
| synthesize | agent | report-synthesizer | Synthesize a draft Markdown report | `draft_report` |
| verify | verifier | — | Check evidence coverage and conflicts | `{ passed, coverage_insufficient }` |
| export | artifact | — | Produce markdown_report and evidence_bundle | artifact refs |

### Presets Differ Only in Policy

```typescript
// Quick: 低成本、快速、單輪
{ max_cost_usd: 1, max_iterations: 2, min_sources_per_subquestion: 1 }

// Standard: 平衡、雙輪驗證、衝突檢查
{ max_cost_usd: 3, max_iterations: 4, min_sources_per_subquestion: 3, conflict_check: true }

// Deep: 高覆蓋、多輪、過時來源檢查
{ max_cost_usd: 8, max_iterations: 6, min_sources_per_subquestion: 5, 
  conflict_check: true, stale_source_check: true }
```

**The same FlowDefinition can change policy by changing the preset.** There is no need to copy the flow or modify step logic. This is configuration over hard-coding in practice.

---

## Offline Mode: Run the Complete Flow Without an API Key

```bash
# 無 .dev.vars 時自動啟用
npm run dev
```

Implemented in `packages/runtime/src/fixtures/local-research-sources.json`:
- Preloaded simulated search results, full text, and evidence for topics such as "agent memory systems"
- Runs all ten steps and produces actual Markdown plus a JSON evidence bundle
- Suitable for CI/CD regression tests, offline development, demos, and eval suite runs

---

## From InMemory to Cloudflare Durable Execution

| Local | Production |
|------|------|
| `InMemoryFlowRuntime` (Map) | `DurableFlowRuntime` (Durable Object) |
| `checkpoints` Map | DO state plus periodic flushes to D1 |
| `stepRuns` Map | DO state plus D1 persistence |
| `events` Map | Queues send events to the observability system |
| Single process | Multiple Worker instances share DO state |

**Seamless migration**: The Runtime interface remains the same—`createRun`, `completeStep`, `resumeLatestCheckpoint`, and so on—so callers in upper layers do not need to know which implementation is in use.

---

## Common Pitfalls and Best Practices

| Pitfall | Correct Approach |
|------|----------|
| Modify the steps of a published flow directly | **Create a new version** with `POST /api/flows/:id/versions`; old Runs remain unaffected |
| Put huge objects in step outputs and make checkpoints too large | Store only the keys needed downstream; put large objects in R2 and store refs |
| Rerun upstream steps during Retry | **Do not.** Retry reruns only that step. To rerun upstream steps, cancel and create a new Run |
| Ignore `condition` and hard-code edges | Use conditions so the verifier controls flow direction instead of hard-coding it |
| Treat a preset as only a UI hint | **A Preset injects policy directly**, and the runtime guard enforces it |

---

## Summary: Flow Runtime's Core Contract

```
Flow (immutable template) 
  + Preset (policy config)
  + Inputs (user values)
  → Run (mutable execution)
    → StepRun[] (per-step trace)
    → Checkpoint[] (recovery snapshots)
    → Events[] (audit log)
    → Artifacts/Evidence (outputs)
```

**Four invariants**:
1. **A Run is immutably bound to a FlowVersion** — It remains reproducible.
2. **A Checkpoint captures the complete recovery state** — Interruptions do not lose state.
3. **StepRuns are appended, never overwritten** — The full retry history remains available.
4. **Edge conditions are determined by stepOutput** — Flow logic is data-driven.

---

## References

- [Agent Platform: Flow Runtime Spec](https://github.com/vincentxuu/agent-platform/blob/main/openspec/specs/flow-runtime/spec.md)
- [Flow Runtime Implementation](https://github.com/vincentxuu/agent-platform/blob/main/packages/runtime/src/flow-runtime.ts)
- [Core Flow Definitions](https://github.com/vincentxuu/agent-platform/blob/main/packages/core/src/flow.ts)
- [Deep Research Flow Definition](https://github.com/vincentxuu/agent-platform/blob/main/packages/core/src/deep-research-flow.ts)
- [Agent Gateway Plan - Flow Definition Layer](https://github.com/vincentxuu/agent-platform/blob/main/agent-gateway-plan.md#42-flow-definition-layer)
