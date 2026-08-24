---
title: "Agent Platform 深度解析（二）— Flow Runtime：版本化流程、Checkpoint 與 Resume/Retry 機制"
date: 2026-08-23
category: tech
tags: ["ai-agent", "workflow", "flow-runtime", "checkpoint", "versioning", "agent-platform", "durable-execution"]
lang: zh-TW
description: "Agent Platform 核心子系統 Flow Runtime 深度解析：FlowVersion 不變性設計、Step DAG 執行邏輯、Checkpoint 持久化、Resume/Retry-step 控制，以及 Deep Research seed flow 的實際結構。"
tldr: "Flow Runtime 是 Agent Platform 的心臟：Flow 發布即不可變、Run 綁定具體 version+preset、Step 以 DAG 邊緣條件流轉、每個邊界存 checkpoint、支援 resume/retry-step 不丟失 trace 歷史。"
---
tags: ["ai-agent", "workflow", "flow-runtime", "checkpoint", "versioning", "agent-platform", "durable-execution", "step-dag"]
## TL;DR

Flow Runtime 實作了**「版本化流程定義 + Step DAG 執行 + Checkpoint 持久化 + 細粒度控制」**四大核心：
- **FlowVersion 不變性**：發布後不可修改，Run 綁定 `flow_id + flow_version_id` 保證可重現
- **Step DAG + 條件邊緣**：`findNextStepIds` 依 `stepOutput[condition]` 決定下一步，支援 `verify → search (coverage_insufficient)` 回圈
- **Checkpoint 每步存**：completed/current/remaining steps、keyOutputs、token/cost、artifact/evidence refs、approval state 全存
- **Resume/Retry-step**：`resumeLatestCheckpoint` 從中斷點繼續、`retryStep` 建立新 attempt 保留舊錯誤記錄

Deep Research seed flow 10 步驟示範完整閉環：`clarify → build_brief → plan → search → rank_sources → read_sources → extract_evidence → synthesize → verify → export`，三種 preset（Quick/Standard/Deep）只差 policy 預算。

---

## 為什麼 Flow Runtime 要這樣設計？

大多數 agent 框架把「流程定義」與「執行狀態」混在一起，導致：
- 無法對同一 flow 跑多個版本對比
- 中斷後只能重跑全流程，不能從失敗步驟 retry
- 無法審計「當時用了哪個版本的 flow、哪個 preset、哪些參數」

Agent Platform 的設計原則：**Flow 是靜態模板，Run 是動態實例，兩者嚴格分離，中間用 Checkpoint 連接**。

---

## 核心資料模型

### Flow 定義（靜態、可版本化）

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

**關鍵點**：
- `version` 是整數，發布時 `+1`，**舊版本永不修改**
- `steps` 只有 `id`、`type`、`skill`/`providerRole`，**不含執行邏輯**（邏輯在 Skill/Provider/Handler）
- `edges.condition` 讓 DAG 變成**狀態機**——`verify` 步驟輸出 `{ coverage_insufficient: true }` 即可回圈到 `search`

### Run 狀態（動態、每次執行獨立）

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

**Run 與 FlowVersion 綁定是不可變的**——即使 flow 發布 v2，v1 的 run 仍能重跑、resume、audit。

### StepRun（步驟級執行記錄）

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

- `attempt` 記錄重試次數，**每次 retry 建立新 StepRun，舊的保留**，不覆蓋
- `output` 是給 `findNextStepIds` 判斷 condition 用的關鍵資料

---

## 執行流程：從 Create Run 到 Complete

### 1. 建立 Run（`createRun`）

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

**入度為 0 的步驟** = `clarify`（Deep Research 第一步）。`findInitialStepIds` 反向找 `edges.to` 不在其中的 step。

### 2. 步驟執行週期

```
StepRun: pending → startStep() → running → completeStep() → succeeded
                              ↘ failStep() → failed
```

**completeStep 核心邏輯**：

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

### 3. `findNextStepIds`：條件邊緣如何運作

```typescript
export function findNextStepIds(flow, fromStepId, stepOutput = {}) {
  return flow.edges
    .filter(edge => edge.from === fromStepId)
    .filter(edge => edge.condition ? Boolean(stepOutput[edge.condition]) : true)
    .map(edge => edge.to);
}
```

Deep Research 的關鍵邊緣：
```typescript
{ from: "verify", to: "search", condition: "coverage_insufficient" },
{ from: "verify", to: "export", condition: "passed" }
```

- `verify` 步驟輸出 `{ coverage_insufficient: true }` → 回圈到 `search`（補強來源）
- `verify` 輸出 `{ passed: true }` → 進入 `export` 產出 artifact
- 兩者互斥（verifier 邏輯保證），形成**有上界的回圈**（policy `max_iterations` 限制）

---

## Checkpoint：耐久執行的基石

每個 step boundary（成功、失敗、取消）都呼叫 `saveCheckpoint`：

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

**Checkpoint 存什麼？** 答案是「恢復執行所需的一切」：
| 欄位 | 用途 |
|------|------|
| `completedStepIds` | 知道哪些步驟已做完，不重跑 |
| `currentStepIds` | 知道從哪裡繼續 |
| `remainingStepIds` | 知道還有哪些步驟 |
| `keyOutputs` | 下游步驟需要的上游輸出（如 `plan` 的輸出給 `search` 用） |
| `tokenUsage` / `costUsd` | 成本追蹤不歸零 |
| `artifactRefs` / `evidenceRefs` | 產出物引用不丟失 |
| `approval state` | （生產版會加）人工核准狀態 |

**本機版用 InMemory Map，生產版映射到 Durable Object + D1/KV/R2**，介面相同。

---

## Resume：從中斷點繼續

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

**關鍵設計**：Run 物件本身一直在記憶體/資料庫中，**Checkpoint 只是快照備份**。Resume 時只需把 `currentStepIds` 和 `remainingStepIds` 回寫，其他狀態（outputs、cost、artifacts）原本就保留在 run 上。

> 生產環境：Durable Object 持有 run 狀態，checkpoint 定期 flush 到 D1。Worker 重啟、部署、擴容都不丟失 run 狀態。

---

## Retry-step：單步重試不影響全流程

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

**設計細節**：
- **舊 StepRun 保留**（`failed` 狀態、錯誤訊息、attempt 數）——完整審計軌跡
- **新 StepRun** 從 `pending` 開始，`attempt = 2`（或更高）
- Run `status` 從 `failed` 回到 `active`，`currentStepIds` 只含該步驟
- **不重跑上游步驟**——`completedStepIds`、`outputs` 都在，下游直接用現有資料

這對於「搜尋 API 瞬時失敗」、「模型輸出格式錯誤需調整 prompt 再試」等情境極度重要。

---

## Cancel / Pause：優雅停止

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

- `canceled` 狀態不可 resume（需人工判斷），但保留完整 trace
- `paused` 狀態（生產版由 approval gate 或 policy 觸發）可 resume

---

## Deep Research Flow 實戰剖析

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

### 步驟職責對照

| Step | Type | Skill/Provider | 負責工作 | 輸出關鍵欄位 |
|------|------|----------------|----------|--------------|
| clarify | agent | research-planner | 澄清研究範圍、產出子問題 | `subquestions[]` |
| build_brief | transform | — | 整理 research brief | `brief` |
| plan | agent | research-planner | 規劃搜尋策略、關鍵字 | `search_plan` |
| search | tool_group | search provider | 多 provider 平行搜尋、去重 | `sources[]` |
| rank_sources | agent | source-ranker | 來源可信度排序、過濾 | `ranked_sources[]` |
| read_sources | tool_group | reader provider | 抓取全文、提取段落 | `source_contents[]` |
| extract_evidence | agent | citation-extractor | 抽取 claims + citations + excerpts | `evidence_items[]` |
| synthesize | agent | report-synthesizer | 綜合生成 Markdown 報告草稿 | `draft_report` |
| verify | verifier | — | 檢查 evidence coverage、conflict | `{ passed, coverage_insufficient }` |
| export | artifact | — | 產出 markdown_report + evidence_bundle | artifact refs |

### Preset 差異只在 Policy

```typescript
// Quick: 低成本、快速、單輪
{ max_cost_usd: 1, max_iterations: 2, min_sources_per_subquestion: 1 }

// Standard: 平衡、雙輪驗證、衝突檢查
{ max_cost_usd: 3, max_iterations: 4, min_sources_per_subquestion: 3, conflict_check: true }

// Deep: 高覆蓋、多輪、過時來源檢查
{ max_cost_usd: 8, max_iterations: 6, min_sources_per_subquestion: 5, 
  conflict_check: true, stale_source_check: true }
```

**同一 FlowDefinition，換 preset 就換 policy**——不需要複製 flow、不需要改步驟邏輯。這就是「配置勝過硬編碼」的體現。

---

## 離線模式：無 API Key 也能跑完整流程

```bash
# 無 .dev.vars 時自動啟用
npm run dev
```

實作於 `packages/runtime/src/fixtures/local-research-sources.json`：
- 預載「agent memory systems」等主題的模擬搜尋結果、全文、evidence
- 走完整 10 步驟、產出真實 markdown + JSON evidence bundle
- 適合：CI/CD regression test、離線開發、demo、eval suite 執行

---

## 從 InMemory 到 Cloudflare Durable Execution

| 本機 | 生產 |
|------|------|
| `InMemoryFlowRuntime` (Map) | `DurableFlowRuntime` (Durable Object) |
| `checkpoints` Map | DO 狀態 + 定期 flush 到 D1 |
| `stepRuns` Map | DO 狀態 + D1 持久化 |
| `events` Map | Queues 發送到觀測系統 |
| 單進程 | 多 Worker 實例共享 DO 狀態 |

**遷移無縫**：Runtime 介面相同（`createRun`、`completeStep`、`resumeLatestCheckpoint`...），上層呼叫端零感知。

---

## 常見陷阱與最佳實踐

| 陷阱 | 正確做法 |
|------|----------|
| 直接修改已發布 flow 的 steps | **建立新版本**（`POST /api/flows/:id/versions`），舊 run 不受影響 |
| 在 step 輸出塞巨大物件導致 checkpoint 過大 | 只存「下游需要的 key」，大物件存 R2 存 ref |
| Retry 時想重跑上游步驟 | **不要**——retry 只重跑該步驟；要重跑上游請 cancel 後重新 run |
| 忽略 `condition` 寫死邊緣 | 善用 condition 讓 verifier 控制流向，而非硬編碼 |
| 以為 preset 只是 UI 提示 | **Preset 直接注入 policy**，runtime guard 會強制執行 |

---

## 總結：Flow Runtime 的核心契約

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

**四大不變量**：
1. **Run 不可變綁定 FlowVersion** —— 永遠可重現
2. **Checkpoint 捕獲完整恢復狀態** —— 中斷不丟失
3. **StepRun 不覆蓋，只新增** —— 完整重試歷史
4. **Edge condition 由 stepOutput 決定** —— 流程邏輯資料驅動

---

## 參考資料

- [Agent Platform: Flow Runtime Spec](https://github.com/vincentxuu/agent-platform/blob/main/openspec/specs/flow-runtime/spec.md)
- [Flow Runtime Implementation](https://github.com/vincentxuu/agent-platform/blob/main/packages/runtime/src/flow-runtime.ts)
- [Core Flow Definitions](https://github.com/vincentxuu/agent-platform/blob/main/packages/core/src/flow.ts)
- [Deep Research Flow Definition](https://github.com/vincentxuu/agent-platform/blob/main/packages/core/src/deep-research-flow.ts)
- [Agent Gateway Plan - Flow Definition Layer](https://github.com/vincentxuu/agent-platform/blob/main/agent-gateway-plan.md#42-flow-definition-layer)