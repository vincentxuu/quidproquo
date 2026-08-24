---
title: "Agent Platform 深度解析（五）— Policy Engine：Runtime Guards、Budget Control、Human Approval 與 Loop Protection"
date: 2026-08-23
category: tech
tags: ["ai-agent", "policy-engine", "runtime-guards", "budget-control", "human-approval", "loop-protection", "agent-platform"]
lang: zh-TW
description: "Agent Platform Policy Engine 深度解析：版本化 Policy 配置、四層 Guard Pipeline（Input/Tool/Output/Budget）、Human Approval Gate 外部寫入核准、Loop Detection 與 Circuit Breaker、Escalation Records、Proxy API 專用 Policy、以及標準 Research Policy 範例。"
tldr: "Policy Engine 是 Agent Platform 的「憲法與執法者」：Policy 版本化綁定 Flow/Preset、四層 Guard 在 step boundary 強制執行、Budget 多維度限制（cost/tokens/runtime/iterations/tool_calls）、External write 必須人工核准、Loop detection 自動熔斷、Escalation 記錄可審計軌跡。配置驅動而非硬編碼，新增規則只改 JSON。"
---

## TL;DR

Policy Engine 解決**「生產環境怎麼把控 AI 不亂搞」**：
- **版本化 Policy**：`id`、`version`、可綁定 Flow/Preset，發布後不可變，Run 綁定具體版本
- **四層 Guard Pipeline**：Input（長度/敏感資料）→ Tool（權限/schema/external write）→ Output（schema/citation/format）→ Budget（cost/tokens/runtime/iterations/tool_calls）
- **Human Approval Gate**：外部寫入（GitHub/Slack/Notion/Email）強制暫停、建立 approval request、等待人工審核
- **Loop Protection**：偵測重複 tool call、相似 output、no-progress → 記錄 Loop Signal → Circuit Breaker 熔斷
- **Escalation Records**：verifier 失敗、provider 失敗、cost outlier 觸發升級（強模型、更多 context、人工介入），記錄原因與結果
- **Proxy Policy**：OpenAI 相容 Proxy 專用 budget（daily cost/tokens/requests/min）、model allow/deny list、rate limit

---

## 為什麼需要 Policy Engine？

直接把 LLM 放進生產流程的風險：

| 風險 | 後果 | Policy Engine 對策 |
|------|------|-------------------|
| Prompt injection、輸入過長 | 成本爆增、洩露敏感資料 | Input Guard：maxInputLength、敏感資料模式攔截 |
| 模型亂呼叫工具、呼叫未授權 API | 資料外洩、誤刪生產資料 | Tool Guard：allowedTools 白名單、external write 強制 approval |
| 輸出格式錯誤、缺引用、幻覺 | 下游步驟崩潰、報告不可信 | Output Guard：schema 驗證、citation_required 強制、artifact format 檢查 |
| 無限迴圈、重複呼叫、不收斂 | 燒錢、卡死、無產出 | Loop Detection：重複工具/輸出偵測、circuit breaker 熔斷 |
| 成本失控、token 爆炸 | 帳單驚喜、預算超支 | Budget Guard：多維度硬性上限、即時阻擋 |
| 模型行為漂移、政策違規 | 合規風險、品質下降 | Escalation：記錄漂移、觸發升級路徑 |

**核心哲學**：Policy 是**配置**，不是代碼。運營團隊不需要改代碼就能調整預算、增減允許工具、修改審核門檻。

---

## Policy 資料模型：版本化、可綁定、可審計

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

### Policy 綁定鏈

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

**關鍵**：Run 創建時**快照** preset policy，後續 policy 修改不影響進行中/歷史 runs。這保證了可重現性與審計完整性。

---

## 四層 Guard Pipeline：Step Boundary 強制執行

每個 step 執行前/中/後，Runtime 呼叫對應 Guard：

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

所有 Guard 都回傳 `GuardResult[]`，**每一個決定都被記錄**：

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

Web UI 「步驟詳情」直接顯示所有 GuardResults，失敗原因一目了然。

---

## 1. Input Guard：輸入端第一道防線

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

**配置範例**：
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

## 2. Tool Guard：工具呼叫的守門員

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

**關鍵設計**：
- `allowedTools` 支援 **tool name**（`search.web`）或 **permission scope**（`search:read`）兩種粒度
- `externalWriteTools` 明確列出需核准的工具（`github_create_issue`、`slack_post_message`、`notion_create_page`、`send_email`...）
- **Approval 建立後 step 狀態變 `paused`**，不執行工具，等待人工審核

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

## 3. Output Guard：輸出品質把關

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

**品質配置**：
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

## 4. Budget Guard：多維度硬性上限

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

**預算維度完整表**：

| 維度 | 欄位 | 單位 | 典型值（Standard preset） | 說明 |
|------|------|------|--------------------------|------|
| **成本** | `maxCostUsd` | USD | 3.0 | 總成本上限，超過即停止 |
| **Token** | `maxTokens` | tokens | 100,000 | input+output 總 token |
| **運行時間** | `maxRuntimeMs` | ms | 30 min | 壁鐘時間上限 |
| **迭代輪數** | `maxIterations` | count | 4 | verify→search 回圈上限 |
| **Tool 呼叫** | `maxToolCalls` | count | 50 | 總工具調用次數 |
| **並行單元** | `maxParallelUnits` | count | 5 | 同時進行的 step/工具數 |

**超限行為**：`mode: "block"` → Run 狀態變 `failed` 或 `paused`，記錄 `GuardResult`，Observability 可見「Budget exceeded」明確錯誤。

---

## Loop Detection & Circuit Breaker：防無限迴圈

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

**觸發條件**：
| Signal Type | 觸發條件 | 典型場景 |
|-------------|---------|---------|
| `repeated_tool_call` | 連續 2 次呼叫同一工具（同參數） | 搜尋 API 回傳空結果，模型反覆重試相同 query |
| `similar_output` | 連續 2 次模型輸出相同/極度相似 | 卡在相同推理循環、無法突破 |
| `no_progress` | 步驟長時間無實質產出 | 模型陷入冗長推理、token 浪費 |

**Circuit Breaker 狀態**：
- `open`：熔斷中，後續同 step 執行前檢查，可配置為 `stop`/`retry`/`fallback`/`escalate`
- 生產版會整合 `policy.retry` 配置決定具體行為

---

## Escalation Records：失敗可追溯、可復原

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

**常見升級路徑**：

| Reason | Action | Outcome 追蹤 |
|--------|--------|-------------|
| `verifier_failure` (coverage insufficient) | `expand_context` (更多來源) / `upgrade_model` (更強模型) / `human_review` | 下一輪 verify 是否通過 |
| `provider_failure` (主要 provider 掛了) | `fallback_provider` (自動) / `upgrade_model` | Fallback 是否成功 |
| `cost_outlier` | `reduce_scope` (縮小研究範圍) / `human_review` | 成本是否回歸預算 |
| `loop_detected` | `alternative_strategy` (換方法) / `human_review` | 是否跳出迴圈 |

**Web UI Observability → Escalations** 頁面顯示完整升級鏈，事後複盤關鍵依據。

---

## Proxy Policy：OpenAI 相容 Proxy 專用管控

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

**Proxy Policy 配置範例**：
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

## 標準 Research Policy：開箱即用的參考配置

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

**Preset 對應 Policy 差異**：

| Preset | maxCostUsd | maxIterations | minSources | conflictCheck | staleCheck |
|--------|------------|---------------|------------|---------------|------------|
| Quick | $1 | 2 | 1 | false | false |
| Standard | $3 | 4 | 3 | true | true |
| Deep | $8 | 6 | 5 | true | true |

**同一 FlowDefinition，換 Preset 即換 Policy**——零代碼變更。

---

## Policy 生命週期：Draft → Published → Archived

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

**版本化優勢**：
- 同一 Flow 可跑 v1 policy（舊預算）vs v2 policy（新預算）對比
- 審計時清楚知道「當時生效的是哪個 policy 版本」
- 回滾只需改 preset binding 指向舊版本

---

## 常見陷阱與最佳實踐

| 陷阱 | 正確做法 |
|------|----------|
| Policy 寫死在代碼裡，改預算要重新部署 | **Policy 獨立配置**，Web UI 熱更新、版本化發布 |
| 不設 `allowedTools`，模型隨意呼叫 | **最小權限**：每個 Flow/Skill 只宣告需要的 tools |
| External write 沒加 approval，誤刪生產資料 | **所有外部寫入工具加入 `externalWriteTools`**，強制 approval |
| Budget 只設 `maxCostUsd`，token/runtime 失控 | **多維度預算**：cost/tokens/runtime/iterations/tool_calls 全設 |
| Loop detection 太敏感/不敏感導致誤殺/漏網 | 先用簡單版（連續 2 次相同），生產再調整為語義相似度檢測 |
| Escalation 不記錄 outcome，事後不知道有沒有用 | **必填 outcome**，Observability 可視化升級成功率 |

---

## 總結：Policy Engine 的核心契約

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

**三大不變量**：
1. **Policy 版本化 + Run 快照** —— 歷史 run 不受政策變更影響
2. **Guard 決定全記錄** —— 每個 block/warn/passed 都有 GuardResult 可查
3. **配置驅動** —— 運營調整策略不動代碼，只改 JSON/Policy UI

---

## 參考資料

- [Agent Platform: Policy Runtime Controls Spec](https://github.com/vincentxuu/agent-platform/blob/main/openspec/specs/policy-runtime-controls/spec.md)
- [Policy Runtime Controls Implementation](https://github.com/vincentxuu/agent-platform/blob/main/packages/runtime/src/policy-runtime-controls.ts)
- [Agent Gateway Plan - Policy Engine](https://github.com/vincentxuu/agent-platform/blob/main/agent-gateway-plan.md#45-policy-engine)
- [Provider Config](https://github.com/vincentxuu/agent-platform/blob/main/packages/runtime/src/provider-config.json) — provider 類型與 readiness
- [Proxy Model Mapping](https://github.com/vincentxuu/agent-platform/blob/main/packages/runtime/src/proxy-model-mapping.json) — fallback chain 配置