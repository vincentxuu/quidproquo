---
title: "Agent Platform Deep Dive (Part 5) — Policy Engine: Runtime Guards, Budget Control, Human Approval, and Loop Protection"
date: 2026-08-23
category: tech
tags: ["ai-agent", "policy-engine", "runtime-guards", "budget-control", "human-approval", "loop-protection", "agent-platform"]
lang: en
description: "A deep dive into the Agent Platform Policy Engine: versioned policy configuration, the four-layer guard pipeline for input, tools, output, and budgets, approval for external writes, loop detection and circuit breakers, escalation records, proxy-specific policies, and a standard research policy example."
tldr: "The Policy Engine acts as the Agent Platform's constitution and enforcement layer: policies are versioned and bound to flows and presets; four guard layers enforce rules at step boundaries; budgets cap cost, tokens, runtime, iterations, and tool calls; external writes require human approval; loop detection trips circuit breakers; and escalation records provide an auditable trail. Rules are configuration-driven, so adding one means changing JSON rather than hard-coded logic."
---
> 🌏 [中文版](/posts/tech/2026-08-23-agent-platform-policy-engine)

## TL;DR

The Policy Engine answers one question: **how do you keep AI under control in production?**

- **Versioned policies**: Each policy has an `id` and `version`, can be bound to a flow or preset, becomes immutable after publication, and binds each run to a specific version.
- **Four-layer guard pipeline**: Input (length and sensitive data) → Tool (permissions, schema, and external writes) → Output (schema, citations, and format) → Budget (cost, tokens, runtime, iterations, and tool calls).
- **Human approval gate**: External writes to GitHub, Slack, Notion, or email force the run to pause, create an approval request, and wait for a person to review it.
- **Loop protection**: Repeated tool calls, similar outputs, and lack of progress produce a loop signal and trip a circuit breaker.
- **Escalation records**: Verifier failures, provider failures, and cost outliers trigger escalation to a stronger model, more context, or human intervention, with both the reason and outcome recorded.
- **Proxy policy**: The OpenAI-compatible proxy gets its own budgets for daily cost, tokens, requests, and requests per minute, plus model allowlists and denylists and rate limits.

---

## Why Do You Need a Policy Engine?

Putting an LLM directly into a production workflow creates several risks:

| Risk | Consequence | Policy Engine control |
|------|-------------|-----------------------|
| Prompt injection or excessive input length | Runaway cost or exposure of sensitive data | Input Guard: `maxInputLength` and sensitive-data pattern checks |
| The model calls arbitrary tools or unauthorized APIs | Data leakage or accidental deletion of production data | Tool Guard: an `allowedTools` allowlist and mandatory approval for external writes |
| Invalid output format, missing citations, or hallucinations | Downstream steps fail and reports become unreliable | Output Guard: schema validation, enforced `citation_required`, and artifact format checks |
| Infinite loops, repeated calls, or failure to converge | Money burns while the run stalls without producing anything | Loop Detection: repeated-tool and repeated-output detection with a circuit breaker |
| Uncontrolled cost or token usage | Surprise bills and budget overruns | Budget Guard: hard limits across multiple dimensions, enforced in real time |
| Model behavior drifts or violates policy | Compliance risk and lower quality | Escalation: record drift and trigger an escalation path |

**Core philosophy**: A policy is **configuration**, not code. Operations teams can adjust budgets, add or remove permitted tools, and change approval thresholds without modifying the codebase.

---

## Policy Data Model: Versioned, Bindable, and Auditable

```typescript
interface Policy {
  id: string;                    // "research_standard"
  name: string;                  // "Research Standard"
  version: number;               // 1, 2, 3... 發布時遞增
  budget: BudgetConfig;          // 成本/token/runtime/iterations 多維上限
  providers: ProviderBinding;    // 各角色綁定哪些 provider
  quality: QualityConfig;        // citation/conflict/stale 檢查
  security: SecurityConfig;      // input/tool/external write 權限
  human: HumanApprovalConfig;    // 人工核准規則
  retry: RetryConfig;            // retry/backoff 策略
  proxy: ProxyPolicyConfig;      // OpenAI Proxy 專用政策
  createdAt: string;
  updatedAt: string;
  status: "draft" | "published" | "archived";
}
```

### Policy Binding Chain

```
FlowDefinition
  └── presets[].policy       // 每個 preset 內嵌或引用 policy
       ↓
Run (創建時)
  └── presetId → policy config（快照，不再跟隨 policy 變更）
       ↓
Step Execution
  └── PolicyRuntimeControls.runXxxGuards({ policyId, runId, stepRunId, ... })
```

**The key point**: A run takes a **snapshot** of the preset policy when it is created. Later policy changes do not affect active or historical runs. This preserves reproducibility and audit integrity.

---

## Four-Layer Guard Pipeline: Enforced at Step Boundaries

The runtime invokes the corresponding guards before, during, and after each step:

```
Step Start
    ↓
runInputGuards(policyId, runId, stepRunId, inputs)
    ↓  (blocked → step failed, 記錄 GuardResult)
Step Execution (model/tool calls)
    ↓  每次 tool call 前
runToolGuard(policyId, runId, stepRunId, tool, input)
    ↓  (blocked → tool call rejected; external write → paused + approval)
Step Complete (model 回傳 output)
    ↓
runOutputGuards(policyId, runId, stepRunId, output, outputSchema, artifact)
    ↓  (blocked → step failed)
Budget Check (持續/步驟結束)
    ↓
runBudgetGuard(policyId, runId, stepRunId, usage)
    ↓  (blocked → run paused/failed)
```

Every guard returns `GuardResult[]`, so **every decision is recorded**:

```typescript
interface GuardResult {
  id: string;                    // "guard_abc123"
  runId: string;
  stepRunId: string;
  guardType: "input.length" | "tool.permission" | "output.schema" | "budget.cost" | ...;
  status: "passed" | "blocked" | "warn" | "paused";
  mode: "observe" | "block";     // observe=只記錄不攔截（如 warn）
  message: string;               // 人類可讀說明
  metadata: { actual, limit, toolName, ... };  // 結構化細節
  createdAt: string;
}
```

The Web UI's step details view displays all `GuardResult` records, making the cause of a failure immediately visible.

---

## 1. Input Guard: The First Line of Defense

```typescript
runInputGuards({ policyId, runId, stepRunId, inputs }) {
  const policy = requirePolicy(policyId);
  const serialized = JSON.stringify(inputs || {});
  
  // 1. 長度限制（預設 20000 chars）
  const maxInputLength = policy.security.maxInputLength ?? 20000;
  if (serialized.length > maxInputLength) {
    return blocked("input.length", `Input length ${serialized.length} exceeds ${maxInputLength}`);
  }
  
  // 2. 不支援內容模式（如二進位、特定格式）
  if (policy.security.unsupportedContentPatterns?.some(p => serialized.includes(p))) {
    return blocked("input.unsupported_content", "Input matched unsupported content policy");
  }
  
  // 3. 敏感資料佔位符檢測（警告不阻擋）
  if (policy.security.sensitiveDataPatterns?.some(p => serialized.includes(p))) {
    return warn("input.sensitive_data", "Input matched sensitive data placeholder policy");
  }
  
  return passed("input");
}
```

**Example configuration**:

```json
{
  "security": {
    "maxInputLength": 12000,
    "unsupportedContentPatterns": ["<binary>", "[IMAGE]"],
    "sensitiveDataPatterns": ["SECRET=", "PRIVATE_KEY", "API_KEY="]
  }
}
```

---

## 2. Tool Guard: Gatekeeping Tool Calls

```typescript
runToolGuard({ policyId, runId, stepRunId, tool, input }) {
  const policy = requirePolicy(policyId);
  
  // 1. 白名單檢查：tool.name 或 tool.permissionScope 必須在 allowedTools
  const allowedTools = policy.security.allowedTools || [];
  if (allowedTools.length > 0 && 
      !allowedTools.includes(tool.name) && 
      !allowedTools.includes(tool.permissionScope)) {
    return blocked("tool.permission", `Tool is not allowed: ${tool.name}`);
  }
  
  // 2. Schema 驗證：input 必須符合 tool.inputSchema.required
  const schemaResult = validateRequiredFields(tool.inputSchema, input || {});
  if (!schemaResult.valid) {
    return blocked("tool.schema", schemaResult.message);
  }
  
  // 3. 外部寫入：強制 Human Approval
  const externalWriteTools = policy.security.externalWriteTools || [];
  if (externalWriteTools.includes(tool.name) || 
      externalWriteTools.includes(tool.permissionScope)) {
    const approval = createApprovalRequest({
      runId, stepRunId,
      actionType: "external_write",
      actionPayloadRef: `tool://${tool.name}`
    });
    return paused("tool.external_write_approval", 
      `External write requires approval: ${tool.name}`,
      { approvalRequestId: approval.id });
  }
  
  return passed("tool");
}
```

**Key design choices**:

- `allowedTools` accepts either a **tool name** such as `search.web` or a **permission scope** such as `search:read`.
- `externalWriteTools` explicitly lists tools that require approval, including `github_create_issue`, `slack_post_message`, `notion_create_page`, and `send_email`.
- **After an approval request is created, the step enters the `paused` state**. The tool does not run until a person reviews the request.

### Approval Flow

```
Tool Guard 攔截 external write
    ↓
createApprovalRequest() → ApprovalRequest { status: "pending" }
    ↓
StepRun.status = "paused"
    ↓
Web UI: Timeline 顯示「等待核准」、Evidence/Artifact 頁面可見
    ↓
人工操作：Approve / Reject
    ↓
Approve → StepRun.status = "running" → 繼續執行 tool
Reject  → StepRun.status = "failed" → 記錄拒絕原因
```

---

## 3. Output Guard: Enforcing Output Quality

```typescript
runOutputGuards({ policyId, runId, stepRunId, output, outputSchema, artifact }) {
  const policy = requirePolicy(policyId);
  const results = [];
  
  // 1. Output Schema 驗證
  if (outputSchema) {
    const schemaResult = validateRequiredFields(outputSchema, output || {});
    if (!schemaResult.valid) {
      results.push(blocked("output.schema", schemaResult.message));
    }
  }
  
  // 2. Artifact 格式檢查（Markdown report 必須以 # 開頭）
  if (artifact?.type === "markdown_report" && 
      typeof artifact.content === "string" && 
      !artifact.content.trim().startsWith("#")) {
    results.push(blocked("output.artifact_format", 
      "Markdown report artifacts must start with a heading"));
  }
  
  // 3. Citation Required：quality.citationRequired=true 時，所有 claims 必須有 citations
  if (policy.quality.citationRequired && Array.isArray(output?.claims)) {
    const unsupported = output.claims.filter(c => !c.citations || c.citations.length === 0);
    if (unsupported.length > 0) {
      results.push(blocked("output.citation_required", 
        `${unsupported.length} claims are missing citations`,
        { unsupportedClaims: unsupported.map(c => c.id || c.text) }));
    }
  }
  
  return results.length > 0 ? results : [passed("output")];
}
```

**Quality configuration**:

```json
{
  "quality": {
    "citationRequired": true,      // 強制引用
    "conflictCheck": true,         // 衝突檢測
    "staleSourceCheck": true       // 過時來源檢測
  }
}
```

---

## 4. Budget Guard: Hard Limits Across Multiple Dimensions

```typescript
runBudgetGuard({ policyId, runId, stepRunId, usage }) {
  const policy = requirePolicy(policyId);
  const budget = policy.budget;
  
  const checks = [
    ["budget.cost", usage.costUsd, budget.maxCostUsd],
    ["budget.tokens", usage.tokens, budget.maxTokens],
    ["budget.runtime", usage.runtimeMs, budget.maxRuntimeMs],
    ["budget.iterations", usage.iterations, budget.maxIterations],
    ["budget.tool_calls", usage.toolCalls, budget.maxToolCalls],
    ["budget.parallel_units", usage.parallelUnits, budget.maxParallelUnits]
  ];
  
  for (const [guardType, actual, limit] of checks) {
    if (limit !== undefined && actual !== undefined && actual > limit) {
      return blocked(guardType, `${guardType} ${actual} exceeds ${limit}`, { actual, limit });
    }
  }
  
  return passed("budget");
}
```

**Complete list of budget dimensions**:

| Dimension | Field | Unit | Typical value (Standard preset) | Description |
|-----------|-------|------|---------------------------------|-------------|
| **Cost** | `maxCostUsd` | USD | 3.0 | Total cost limit; the run stops when it is exceeded |
| **Tokens** | `maxTokens` | tokens | 100,000 | Total input and output tokens |
| **Runtime** | `maxRuntimeMs` | ms | 30 min | Wall-clock time limit |
| **Iterations** | `maxIterations` | count | 4 | Maximum number of verify→search loops |
| **Tool calls** | `maxToolCalls` | count | 50 | Total number of tool calls |
| **Parallel units** | `maxParallelUnits` | count | 5 | Number of steps or tools that can run concurrently |

**Behavior when a limit is exceeded**: With `mode: "block"`, the run enters the `failed` or `paused` state and records a `GuardResult`. Observability displays an explicit “Budget exceeded” error.

---

## Loop Detection and Circuit Breakers: Preventing Infinite Loops

```typescript
detectLoop({ runId, stepRunId, recentToolCalls = [], recentOutputs = [], noProgress = false }) {
  const repeatedTool = hasRecentDuplicate(recentToolCalls);      // 連續兩次同工具
  const repeatedOutput = hasRecentDuplicate(recentOutputs);      // 連續兩次同輸出
  
  if (!repeatedTool && !repeatedOutput && !noProgress) return null;
  
  const signal = {
    id: this.idFactory("loop_signal"),
    runId, stepRunId,
    signalType: repeatedTool ? "repeated_tool_call" 
               : repeatedOutput ? "similar_output" 
               : "no_progress",
    severity: "warning",
    metadata: { recentToolCalls, noProgress },
    createdAt: now()
  };
  this.loopSignals.push(signal);
  
  // Circuit Breaker：標記該 step 熔斷
  this.circuitBreakers.set(`${runId}:${stepRunId}`, {
    scope: "step", scopeRef: stepRunId, status: "open", openedAt: now()
  });
  
  return signal;
}

function hasRecentDuplicate(values) {
  if (values.length < 2) return false;
  return values.at(-1) === values.at(-2);  // 簡單版：連續兩次相同
}
```

**Trigger conditions**:

| Signal type | Trigger | Typical scenario |
|-------------|---------|------------------|
| `repeated_tool_call` | The same tool is called twice in a row with the same arguments | A search API returns no results, and the model repeatedly retries the same query |
| `similar_output` | The model produces identical or extremely similar output twice in a row | The model is stuck in the same reasoning loop and cannot break out |
| `no_progress` | A step goes too long without meaningful output | The model falls into prolonged reasoning and wastes tokens |

**Circuit breaker state**:

- `open`: The circuit is open. Before the same step runs again, the runtime checks the breaker and can be configured to `stop`, `retry`, `fallback`, or `escalate`.
- A production implementation integrates `policy.retry` to choose the exact behavior.

---

## Escalation Records: Traceable and Recoverable Failures

```typescript
recordEscalation({ runId, stepRunId, reason, action, outcome, originalContextRef, metadata }) {
  const record = {
    id: this.idFactory("escalation"),
    runId, stepRunId,
    reason,           // "verifier_failure", "provider_failure", "cost_outlier", "loop_detected"
    action,           // "upgrade_model", "expand_context", "alternative_strategy", "human_review"
    outcome,          // "succeeded", "failed", "pending"
    originalContextRef, // 指向觸發時的 context snapshot
    metadata,
    createdAt: now()
  };
  this.escalationRecords.push(record);
  return record;
}
```

**Common escalation paths**:

| Reason | Action | Outcome tracking |
|--------|--------|------------------|
| `verifier_failure` (insufficient coverage) | `expand_context` (more sources), `upgrade_model` (a stronger model), or `human_review` | Whether the next verification passes |
| `provider_failure` (the primary provider is down) | `fallback_provider` (automatic) or `upgrade_model` | Whether the fallback succeeds |
| `cost_outlier` | `reduce_scope` (narrow the research scope) or `human_review` | Whether cost returns to budget |
| `loop_detected` | `alternative_strategy` (change the approach) or `human_review` | Whether the run exits the loop |

The Web UI's **Observability → Escalations** page shows the complete escalation chain, providing the evidence needed for a postmortem.

---

## Proxy Policy: Dedicated Controls for an OpenAI-Compatible Proxy

```typescript
runProxyGuards({ policyId, runId, stepRunId, clientId, model, usage, isStreaming }) {
  const policy = requirePolicy(policyId);
  const results = [];
  
  // 1. Model Allow/Deny List
  const allowedModels = policy.proxy?.allowedModels || [];
  const deniedModels = policy.proxy?.deniedModels || [];
  if (allowedModels.length > 0 && !allowedModels.includes(model)) {
    results.push(blocked("proxy.model_denied", `Model '${model}' not in allowed list`));
  }
  if (deniedModels.includes(model)) {
    results.push(blocked("proxy.model_denied", `Model '${model}' explicitly denied`));
  }
  
  // 2. Proxy Budget（獨立於 Run budget）
  const proxyBudget = policy.proxy?.budget || {};
  // maxCostUsd, maxTokens, maxRequests, maxDailyCost, maxDailyTokens, maxRequestsPerMinute
  // ... 檢查邏輯同 Budget Guard
  
  // 3. Daily Window Reset 檢查
  if (proxyBudget.dailyWindowReset && usage?.proxyLastDailyReset) {
    // 24小時視窗過期提醒
  }
  
  // 4. Rate Limit (streaming 時特別重要)
  if (proxyBudget.maxRequestsPerMinute && usage?.proxyRequestsThisMinute > proxyBudget.maxRequestsPerMinute) {
    results.push(blocked("proxy.rate_limit", `Rate limit exceeded`));
  }
  
  return results.length > 0 ? results : [passed("proxy")];
}
```

**Proxy policy example**:

```json
{
  "proxy": {
    "allowedModels": ["gpt-4o", "claude-3.5-sonnet", "gemini-3.5-flash", "llama-3.3-70b-versatile"],
    "deniedModels": ["gpt-4", "gpt-3.5-turbo"],
    "budget": {
      "maxCostUsd": 10.00,
      "maxTokens": 1000000,
      "maxDailyCost": 5.00,
      "maxDailyTokens": 500000,
      "maxRequestsPerMinute": 60
    }
  }
}
```

---

## Standard Research Policy: A Ready-to-Use Reference Configuration

```typescript
// packages/runtime/src/policy-runtime-controls.ts
export function createStandardResearchPolicy() {
  return {
    id: "research_standard",
    name: "Research Standard",
    budget: {
      maxCostUsd: 3,
      maxTokens: 100000,
      maxRuntimeMs: 30 * 60 * 1000,   // 30 min
      maxIterations: 4,               // verify→search 回圈上限
      maxToolCalls: 50,
      maxParallelUnits: 5
    },
    providers: {
      llm: {
        planner: ["openai", "anthropic"],      // 規劃用雙 provider 容錯
        synthesizer: ["openai"],                // 綜合用單一穩定 provider
        verifier: ["anthropic", "openai"]       // 驗證用雙 provider 交叉驗證
      },
      search: ["mvp-search"],                   // 統一 search router
      reader: ["jina-reader"]
    },
    quality: {
      minSourcesPerSubquestion: 3,
      citationRequired: true,
      conflictCheck: true,
      staleSourceCheck: true
    },
    security: {
      maxInputLength: 12000,
      allowedTools: ["search.web", "reader.read_url", "search:read", "reader:read"],
      externalWriteTools: [],                    // Deep Research 不做外部寫入
      sensitiveDataPatterns: ["SECRET=", "PRIVATE_KEY"]
    },
    human: {
      approvalRequiredBeforeActions: false,
      approvalRequiredBeforeExternalWrite: true
    },
    retry: {
      maxRetries: 2,
      backoffMs: 1000
    }
  };
}
```

**Policy differences by preset**:

| Preset | maxCostUsd | maxIterations | minSources | conflictCheck | staleCheck |
|--------|------------|---------------|------------|---------------|------------|
| Quick | $1 | 2 | 1 | false | false |
| Standard | $3 | 4 | 3 | true | true |
| Deep | $8 | 6 | 5 | true | true |

**The same `FlowDefinition` can switch policies by switching presets**, with no code changes.

---

## Policy Lifecycle: Draft → Published → Archived

```
Create Policy Draft (Web UI / API)
    ↓
Edit: budget/providers/quality/security/human/retry/proxy
    ↓
Validate: schema 檢查、provider readiness 檢查
    ↓
Publish → PolicyVersion (immutable, status: "published")
    ↓
Bind: FlowPreset.policy = "research_standard@v1" 或內嵌 policy config
    ↓
Run: 創建時快照 policy config
    ↓
Archive: 禁用於新 runs，保留歷史 runs 審計
```

**Benefits of versioning**:

- The same flow can compare runs under a v1 policy with the old budget against runs under a v2 policy with the new budget.
- An audit can identify exactly which policy version was in effect at the time.
- Rolling back only requires changing the preset binding to point to an older version.

---

## Common Pitfalls and Best Practices

| Pitfall | Correct approach |
|---------|------------------|
| Hard-coding policy in the codebase, so changing a budget requires redeployment | Keep **policy as independent configuration**, with live updates in the Web UI and versioned publication |
| Omitting `allowedTools`, allowing the model to call arbitrary tools | Apply **least privilege**: each flow or skill declares only the tools it needs |
| Allowing external writes without approval, risking accidental deletion of production data | Add **every external-write tool to `externalWriteTools`** and require approval |
| Setting only `maxCostUsd`, leaving token and runtime usage uncontrolled | Use a **multi-dimensional budget** covering cost, tokens, runtime, iterations, and tool calls |
| Making loop detection too sensitive or not sensitive enough, causing false positives or missed loops | Start with the simple rule of two identical consecutive events, then adopt semantic similarity detection in production |
| Failing to record an escalation's outcome, leaving no way to know whether it helped | Make `outcome` **required**, and visualize escalation success rates in Observability |

---

## Summary: The Policy Engine's Core Contract

```
Policy (versioned, immutable once published)
    ├── budget: { cost, tokens, runtime, iterations, tool_calls, parallel }
    ├── providers: { llm: {planner, synthesizer, verifier}, search, reader }
    ├── quality: { citationRequired, conflictCheck, staleSourceCheck }
    ├── security: { maxInputLength, allowedTools, externalWriteTools, sensitivePatterns }
    ├── human: { approvalRequiredBeforeActions, approvalRequiredBeforeExternalWrite }
    ├── retry: { maxRetries, backoffMs }
    └── proxy: { allowedModels, deniedModels, budget: { daily, rate limit } }

FlowPreset.policy → Policy config (snapshot at run creation)
    ↓
PolicyRuntimeControls
    ├── runInputGuards()      → Input length, sensitive data
    ├── runToolGuard()        → Tool allowlist, schema, external write → approval
    ├── runOutputGuards()     → Schema, artifact format, citation required
    ├── runBudgetGuard()      → Multi-dimension hard limits
    ├── detectLoop()          → Repeated tool/output, no progress → circuit breaker
    ├── runProxyGuards()      → Proxy-specific model list, budget, rate limit
    └── recordEscalation()    → Reason, action, outcome, context ref

All GuardResults + ApprovalRequests + LoopSignals + EscalationRecords
    → Persisted → Observability UI → Audit Trail
```

**Three invariants**:

1. **Versioned policies and run snapshots** — Historical runs are unaffected by policy changes.
2. **Every guard decision is recorded** — Every `block`, `warn`, and `passed` result is available as a `GuardResult`.
3. **Configuration-driven rules** — Operations can adjust strategy by changing JSON or the Policy UI, without touching code.

---

## References

- [Agent Platform: Policy Runtime Controls Spec](https://github.com/vincentxuu/agent-platform/blob/main/openspec/specs/policy-runtime-controls/spec.md)
- [Policy Runtime Controls Implementation](https://github.com/vincentxuu/agent-platform/blob/main/packages/runtime/src/policy-runtime-controls.ts)
- [Agent Gateway Plan — Policy Engine](https://github.com/vincentxuu/agent-platform/blob/main/agent-gateway-plan.md#45-policy-engine)
- [Provider Config](https://github.com/vincentxuu/agent-platform/blob/main/packages/runtime/src/provider-config.json) — provider types and readiness
- [Proxy Model Mapping](https://github.com/vincentxuu/agent-platform/blob/main/packages/runtime/src/proxy-model-mapping.json) — fallback-chain configuration
