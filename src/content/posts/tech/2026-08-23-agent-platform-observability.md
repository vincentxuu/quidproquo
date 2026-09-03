---
title: "Agent Platform 深度解析（六）— Observability、Evidence 與 Artifacts：結構化 Trace、Claim-to-Source 追溯與版本化產出"
date: 2026-08-23
category: tech
type: deep-dive
tags: ["ai-agent", "observability", "evidence", "artifacts", "trace", "audit", "agent-platform"]
lang: zh-TW
description: "Agent Platform Observability/Evidence/Artifacts 深度解析：結構化 Trace 階層、衍生指標、Evidence Store（Claim↔Source↔Excerpt↔Citation）、Artifact 版本化、Markdown Report + JSON Evidence Bundle MVP 格式、Context Snapshot 預算分配與壓縮、Scoped Memory（Procedural/Episodic/Semantic）、Memory Write Proposal 機制。"
tldr: "Observability 不是事後加的 log，而是第一公民：結構化 Trace 連結 FlowRun→StepRun→SkillInvocation→ProviderCall→ToolInvocation→GuardResult→EvidenceItem→ArtifactVersion。Evidence Store 讓每個 claim 追溯到 source/excerpt/citation/confidence/conflict。Artifact 版本化支援 approve/reject/regenerate 不刪除歷史。Context Snapshot 按類別分配 token budget，超額自動壓縮記錄決定。Memory 分 procedural/episodic/semantic 三類，寫入需 proposal 經人工審核。"
---

> 🌏 [English version](/posts/tech/2026-08-23-agent-platform-observability-en)

## TL;DR

Agent Platform 把**可觀測性、證據追溯、產出版本化**做成第一公民，不是事後補上的 log：

- **結構化 Trace**：`FlowRun → StepRun → SkillInvocation → ProviderCall/ToolInvocation → GuardResult → EvidenceItem → ArtifactVersion` 完整階層，每個節點可點進去看細節
- **衍生指標**：從 trace 自動聚合 cost/latency/token/retry/fallback/tool usage/provider health/skill health/quality metrics
- **Evidence Store**：`Claim ← Citation → EvidenceItem → Source` 完整鏈路，支援 claim-to-source 點擊追溯、confidence 標註、conflict 記錄、人工 approve/reject/annotate
- **Artifact Versioning**：Markdown Report + JSON Evidence Bundle，版本化、可 approve/reject、可 regenerate 不刪除舊版
- **Context Snapshot**：10 類 ContextBlock、token budget 比例分配、超額自動 truncate 壓縮並記錄壓縮決定
- **Scoped Memory**：Procedural（規則/慣例）、Episodic（run 摘要）、Semantic（知識/事實）三類，按 org/user/project/flow/skill/session/run 作用域隔離，寫入需 MemoryWriteProposal 經人工審核

---

## 為什麼需要這套系統？

傳統 agent 框架的可觀測性通常止於「印 log」：

| 傳統做法 | Agent Platform |
|---------|----------------|
| 印 `console.log`、事後 grep | 結構化 trace 物件，自動關聯 run/step/skill/provider/tool |
| 成本、延遲事後算 | 即時衍生指標，按 step/provider/skill/tool 多維切分 |
| 輸出報告無法驗證來源 | Evidence Store：每個 claim 連結 source/excerpt/citation/confidence |
| 重跑覆蓋舊結果 | Artifact 版本化：regenerate 產新版本，舊版本保留可對比 |
| Context 塞滿 token 不知道砍哪裡 | Budget allocation + 自動壓縮 + 記錄壓縮決定 |
| 記憶直接寫入生產污染環境 | Memory Write Proposal：agent 提案、人工審核、才生效 |

---

## 結構化 Trace：完整執行階層

### Trace 階層模型

```
FlowRun (run_abc123)
  ├── StepRun: clarify (step_xyz789)
  │     ├── SkillInvocation: research-planner@1.0.0
  │     │     ├── ProviderCall: openai/gpt-4o (planner)
  │     │     └── GuardResult: input.length passed
  │     ├── ToolInvocation: web_search (tavily)
  │     ├── GuardResult: tool.permission passed
  │     └── Output: { subquestions: [...] }
  │
  ├── StepRun: search (step_def456)
  │     ├── SkillInvocation: (tool_group, no skill)
  │     ├── ProviderCall: tavily/search
  │     ├── ProviderCall: exa/search (fallback)
  │     ├── GuardResult: budget.cost passed
  │     └── Output: { sources: [...] }
  │
  ├── StepRun: verify (step_ghi789)
  │     ├── SkillInvocation: (verifier)
  │     ├── GuardResult: output.citation_required blocked
  │     ├── EvidenceItem: claim_1 → source_A
  │     ├── EvidenceItem: claim_2 → source_B (conflict)
  │     └── Output: { coverage_insufficient: true }
  │
  └── ArtifactVersion: markdown_report v1
        ├── Source: synthesize step output
        ├── EvidenceRefs: [evidence_1, evidence_2, ...]
        └── Status: approved
```

### Span & Event 記錄

```typescript
// packages/runtime/src/observability-evidence-artifacts.ts
startSpan({ runId, stepRunId, type, name, parentId, inputRef, metadata })
// type: "step" | "skill" | "provider_call" | "tool_invocation" | "proxy_request" | "guard" | "verifier"

finishSpan(spanId, { status, outputRef, error })
// 記錄 durationMs、status、outputRef、error

recordEvent({ runId, traceSpanId, type, payload })
// type: "step.started" | "step.succeeded" | "proxy_fallback" | "guard.blocked" | "evidence.added" | "artifact.created"
```

**Web UI Timeline 直接讀 spans + events**，渲染成可展開的階層視圖，點任一節點看完整 input/output/guard/metrics。

---

## 衍生指標：從 Trace 自動聚合

```typescript
deriveMetrics({ runId, providerCalls, toolInvocations, skillInvocations, guardResults }) {
  const metrics = [
    ["cost.total_usd", sum(providerCalls, "costUsd") + sum(toolInvocations, "costUsd")],
    ["usage.provider_calls", providerCalls.length],
    ["usage.tool_invocations", toolInvocations.length],
    ["usage.skill_invocations", skillInvocations.length],
    ["reliability.guard_blocks", guardResults.filter(r => r.status === "blocked").length],
    ["reliability.retry_count", sum(providerCalls, "retryCount") + sum(toolInvocations, "retryCount")]
  ];
  return metrics.map(([name, value]) => recordMetric(name, value, { runId }));
}
```

**指標分類完整表**：

| 類別 | 指標名稱 | 維度 | 用途 |
|------|---------|------|------|
| **Cost** | `cost.total_usd` | run/step/provider/skill/tool | 預算控制、成本歸因 |
|  | `cost.by_provider` | provider | 找出最貴 provider |
|  | `cost.by_step` | stepId | 優化昂貴步驟 |
| **Latency** | `latency.step_duration_ms` | stepId | 找 bottleneck |
|  | `latency.provider_call_ms` | provider | 比較 provider 速度 |
|  | `latency.proxy_stream_chunks` | model/provider | streaming 體驗 |
| **Tokens** | `tokens.input/output/total` | run/step/model | 控制 context、估算成本 |
| **Reliability** | `guard.blocks` | guardType | 找出常被擋的規則 |
|  | `retry.count` | provider/tool/step | 穩定性分析 |
|  | `fallback.count` | from→to provider | Fallback 效果 |
| **Quality** | `evidence.citation_coverage` | run | 報告可信度 |
|  | `evidence.conflict_count` | run | 衝突嚴重度 |
|  | `verifier.pass_rate` | run | 驗證通過率 |

**Proxy 專用指標**（`proxy_*` prefix）：
```typescript
// 記錄於 finishProxySpan、recordFallbackAttempt、recordProxyStreamChunks
"proxy_request_duration_ms"
"proxy_tokens_input/output"
"proxy_cost_usd"
"proxy_fallback_count" (含 fromProvider/toProvider/status)
"proxy_stream_chunks"
```

Web UI Observability 頁面提供：**按 client/model/provider 分組**的 proxy metrics。

---

## Evidence Store：Claim-to-Source 完整追溯

### 資料模型

```typescript
// Source：原始來源
interface Source {
  id: string;
  url: string;
  title: string;
  provider: string;           // "tavily", "exa", "jina"
  retrievedAt: string;
  metadata: { author, publishDate, ... };
}

// EvidenceItem：從來源抽取的證據片段
interface EvidenceItem {
  id: string;
  runId: string;
  stepRunId: string;
  sourceId: string;           // 關聯 Source
  excerpt: string;            // 原文摘錄
  confidence: "high" | "medium" | "low";
  supportsStep: string;       // 支撐哪個步驟
  metadata: { location, page, ... };
}

// Claim：報告中的結論/斷言
interface Claim {
  id: string;
  runId: string;
  artifactVersionId: string;  // 所屬 artifact 版本
  text: string;               // 結論文字
  confidence: "high" | "medium" | "low";
  status: "unverified" | "supported" | "rejected" | "conflicted";
}

// Citation：Claim ↔ EvidenceItem 連結
interface Citation {
  id: string;
  claimId: string;
  evidenceItemId: string;
  citationText: string;       // 如 "[1]"、"(Smith 2024)"
  status: "valid" | "invalid" | "weak";
}

// Conflict：證據衝突
interface Conflict {
  id: string;
  claimIds: string[];         // 相互衝突的 claims
  evidenceItemIds: string[];  // 對應證據
  description: string;        // 衝突說明
  severity: "low" | "medium" | "high";
  status: "open" | "resolved" | "acknowledged";
}
```

### 追溯流程

```
用戶點擊報告中的 claim "Graph-based orchestration is mainstream"
    ↓
UI 查詢 Citations: claimId → [citation_1, citation_2]
    ↓
每個 citation → EvidenceItem (excerpt, confidence, sourceId)
    ↓
每個 sourceId → Source (url, title, retrievedAt, provider)
    ↓
UI 呈現：
  Claim: "Graph-based orchestration is mainstream" (confidence: high, status: supported)
  ├── Citation [1] → EvidenceItem_123 (excerpt: "LangGraph adoption grew 300%...", confidence: high)
  │     └── Source_456 (url: https://langchain.com/langgraph, provider: tavily, retrieved: 2026-08-20)
  ├── Citation [2] → EvidenceItem_124 (excerpt: "AutoGen v0.4 introduces graph...", confidence: medium)
  │     └── Source_789 (url: https://github.com/microsoft/autogen, provider: exa, retrieved: 2026-08-20)
  └── Conflicts: 0
```

### 人工審核

```typescript
// 用戶在 Evidence 頁面操作
approveEvidence(evidenceItemId, reviewer, reason)
rejectEvidence(evidenceItemId, reviewer, reason)
annotateEvidence(evidenceItemId, annotation, reviewer)

// 記錄審核決定，保留原始 evidence 不變
interface EvidenceReview {
  evidenceItemId: string;
  decision: "approve" | "reject" | "annotate";
  reviewer: string;
  reason: string;
  timestamp: string;
  originalEvidence: EvidenceItem;  // 完整保留
}
```

---

## Artifact Versioning：產出物版本化

### 兩大 MVP Artifact 類型

| 類型 | ID | 說明 |
|------|----|------|
| **Markdown Report** | `markdown_report` | 給人看的研究報告、含引用標註 |
| **JSON Evidence Bundle** | `json_evidence_bundle` | 給機器/下游處理的完整證據包 |

### 版本化機制

```typescript
createArtifact({ runId, type, name })
// 建立 artifact 容器，status: "draft"

addArtifactVersion({ artifactId, content, sourceStepRunId, evidenceRefs })
// 產出新版本：version = existing.length + 1
// 記錄 sourceStepRunId、evidenceRefs（關聯哪些 evidence）
```

**版本歷史範例**：
```
Artifact: markdown_report (artifact_abc)
  ├── v1: 初版 (source: synthesize step, evidence: 15 items, status: draft)
  ├── v2: 用戶點擊 Regenerate (source: synthesize step, evidence: 18 items, status: draft)
  ├── v3: 用戶修正後 Regenerate (source: synthesize step, evidence: 18 items, status: approved)
  └── v4: 用戶手動編輯 (source: manual, evidence: 18 items, status: approved)
```

### Approve/Reject/Regenerate

| 操作 | 行為 | 版本影響 |
|------|------|---------|
| **Approve** | 記錄決策、審核者、時間、當前 evidence 狀態 | 版本 status → `approved`，不刪除舊版 |
| **Reject** | 記錄決策、原因、當前 evidence 狀態 | 版本 status → `rejected`，不刪除舊版 |
| **Regenerate** | 從 sourceStepRunId 重新生成內容 | **新增版本 v+1**，舊版保留 |
| **Export** | 下載 Markdown/JSON/PDF | 任意版本可導出 |

**關鍵**：`regenerate` **不刪除舊版本**，支援版本對比、回滾、審計。

---

## Markdown Report 生成：自動引用注入

```typescript
createMarkdownReport({ title, claims }) {
  const lines = [`# ${title}`, ""];
  for (const claim of claims) {
    const citations = this.citations.filter(c => c.claimId === claim.id);
    const citationText = citations.map(c => `[${c.evidenceItemId}]`).join(" ");
    lines.push(`- ${claim.text}${citationText ? ` ${citationText}` : ""}`);
  }
  return `${lines.join("\n")}\n`;
}
```

**輸出範例**：
```markdown
# Agent Memory Systems Comparison

- Graph-based orchestration is becoming mainstream [evidence_123] [evidence_124]
- LangGraph provides the most mature developer experience [evidence_125]
- AutoGen v0.4 introduces graph-based workflows [evidence_126]
- Memory isolation between agents remains a challenge [evidence_127] [evidence_128]
```

**Evidence Bundle JSON 結構**：
```json
{
  "runId": "run_abc123",
  "sources": [...],
  "evidence": [...],
  "claims": [...],
  "citations": [...],
  "conflicts": [...]
}
```

---

## Context Snapshot：Token Budget 分配與自動壓縮

### 10 類 ContextBlock

```typescript
const CONTEXT_BLOCK_TYPES = [
  "instructions",           // 系統指令、flow 定義
  "skill_guidance",         // SKILL.md 內容
  "tool_descriptions",      // 當前步驟允許的工具描述
  "task_state",             // 當前任務狀態、已完成步驟輸出
  "history",                // 對話/執行歷史
  "retrieval_evidence",     // 檢索到的證據
  "artifacts",              // 已產出的 artifact
  "environment",            // 環境資訊（時間、用戶、配置）
  "examples",               // Few-shot 範例
  "dynamic_run_data"        // 動態運行數據
];
```

### Budget 分配比例

```typescript
allocateBudgets(totalBudgetTokens = 8000, responseBudgetTokens = 1200) {
  const available = totalBudgetTokens - responseBudgetTokens;  // 6800
  return {
    instructions:           budget(available, 0.12),  // 816 tokens
    skill_guidance:         budget(available, 0.14),  // 952 tokens
    tool_descriptions:      budget(available, 0.12),  // 816 tokens
    task_state:             budget(available, 0.10),  // 680 tokens
    history:                budget(available, 0.08),  // 544 tokens
    retrieval_evidence:     budget(available, 0.28),  // 1904 tokens (最大塊)
    artifacts:              budget(available, 0.08),  // 544 tokens
    environment:            budget(available, 0.03),  // 204 tokens
    examples:               budget(available, 0.03),  // 204 tokens
    dynamic_run_data:       budget(available, 0.02),  // 136 tokens
    response:               { allocatedTokens: 1200, usedTokens: 0 }
  };
}
```

**設計哲學**：`retrieval_evidence` 佔最大比例（28%），因為研究型工作最需要證據支撐。

### 自動壓縮機制

```typescript
assembleSnapshot({ blocks, totalBudgetTokens, responseBudgetTokens, selectedTools }) {
  // 1. 按 priority 降序排序
  // 2. 依類別預算依序塞入
  // 3. 超額 → compressBlock(block, targetTokens)
  
  compressBlock(block, targetTokens) {
    const compressedContent = content.split(/\s+/).slice(0, targetTokens).join(" ");
    return {
      block: { ...block, content: compressedContent, tokenCount: estimate(compressedContent) },
      record: {
        id: "...", sourceRef: block.id, compressedRef: newId,
        method: "truncate_words",
        originalTokens: block.tokenCount,
        compressedTokens: newTokenCount
      }
    };
  }
}
```

**壓縮決策記錄** 完整保留在 `snapshot.compressions[]`，Observability 可見：
- 原始 block 類型、token 數
- 壓縮後 token 數
- 壓縮方法（目前：truncate_words，未來：summarize/embed/reference）
- 何時、哪個步驟觸發壓縮

### Step-Local Tool Descriptions

```typescript
if (selectedTools.length > 0) {
  selectedBlocks.push(createBlock({
    type: "tool_descriptions",
    content: selectedTools.map(t => `${t.name}: ${t.description}`).join("\n"),
    priority: 100,  // 最高優先級，保證進 context
    metadata: { toolIds: selectedTools.map(t => t.name) }
  }));
}
```

**效果**：`citation-extractor` 步驟只看 `web_fetch`、`web_extract` 描述，**不看** `web_search`、`github_create_issue` 等無關工具，省 token、減幻覺。

---

## Scoped Memory：三類記憶、分層隔離、可審核寫入

### 三種記憶類型

| 類型 | 內容 | 生命週期 | 典型例子 |
|------|------|---------|---------|
| **Procedural** | 可重用的工作流規則、工具使用慣例、最佳實踐 | 長期、跨 run | "搜尋時優先用 Tavily+Exa RRF fusion"、"引用必須含 URL+日期" |
| **Episodic** | 具體 run 的經驗摘要、成功/失敗模式 | 中期、跨 run 可檢索 | "Run #123: topic=agent memory, 成功模式：plan→search(2 providers)→rank→read→extract" |
| **Semantic** | 領域知識、事實、實體關係 | 長期、跨專案 | "LangGraph 是 LangChain 旗下圖編排框架"、"GPT-4o 發布於 2024-05" |

### 作用域隔離

```typescript
createMemoryItem({ type, content, summary, scopes, sourceRunId }) {
  // scopes 陣列，每個 scope 有 type + ref
  scopes: [
    { type: "organization", ref: "org_acme" },
    { type: "project", ref: "proj_research" },
    { type: "flow", ref: "deep_research" },
    { type: "skill", ref: "citation-extractor" },
    { type: "session", ref: "sess_789" },
    { type: "run", ref: "run_abc123" }
  ]
}
```

**檢索時按 scope 過濾**：只載入與當前 run/flow/skill 相關的 memory items，避免污染、洩露、token 浪費。

### Memory Write Proposal：寫入需審核

```typescript
proposeMemoryWrite({ memoryType, proposedContent, scopes, sourceRunId, rationale }) {
  const proposal = {
    id: this.idFactory("memory_proposal"),
    memoryType,           // "procedural" | "episodic" | "semantic"
    proposedContent,
    scopes,
    sourceRunId,
    status: "pending",    // pending → approved/rejected
    rationale,            // 為什麼要寫入
    createdAt: now()
  };
  this.memoryWriteProposals.push(proposal);
  return proposal;
}
```

**流程**：
```
Learning Loop 產生 signal (e.g., "verifier failure → need more sources")
    ↓
Propose procedural memory: "當 coverage insufficient 時，增加 search provider 從 1→2"
    ↓
Human Review (Web UI: Improve → Memory Proposals)
    ↓
Approve → 寫入 MemoryItem (status: "active")
Reject → 記錄拒絕原因，不寫入
```

**核心原則**：**Agent 提案，人類審核，不自動寫入生產記憶**。這防止幻覺規則污染知識庫。

---

## Web UI 可視化介面

| 頁面 | 核心功能 | 數據源 |
|------|---------|--------|
| **Timeline** | 步驟流程圖、耗時、狀態、展開看 span/event | traceSpans + traceEvents |
| **Step Detail** | 單步驟：skill/provider/tool/guard/evidence/artifact 完整記錄 | SkillInvocation + ProviderCall + GuardResult + EvidenceItem |
| **Observability** | Cost breakdown、latency、tokens、retry、fallback、provider health | metricPoints (derived) |
| **Evidence** | Claim-to-source 追溯、confidence、conflict、approve/reject/annotate | EvidenceItem + Claim + Citation + Source + Conflict |
| **Artifacts** | 版本列表、內容預覽、approve/reject/regenerate/export | Artifact + ArtifactVersion |
| **Context** | 每步驟 context snapshot、block 明細、budget 分配、壓縮記錄 | ContextSnapshot |
| **Memory** | Procedural/Episodic/Semantic 列表、scope 過濾、proposal 審核 | MemoryItem + MemoryWriteProposal |

---

## 常見陷阱與最佳實踐

| 陷阱 | 正確做法 |
|------|----------|
| 只記錄最終輸出，不記錄中間證據 | **每步驟產出 evidence**，claim 立即 link evidence，最終報告自動組裝引用 |
| Artifact 重跑覆蓋舊版 | **版本化**：regenerate 產新版，舊版保留，支援對比/回滾 |
| Context 塞滿不砍、或隨機砍 | **Budget allocation + priority + 壓縮記錄**：透明、可審計、可調優 |
| 記憶直接寫入、跑步污染 | **MemoryWriteProposal**：所有長期記憶寫入經人工審核 |
| 不記錄壓縮決定，事後不知道為什麼丟資訊 | **Compression record**：original/compressed tokens、method、sourceRef 完整保留 |
| Evidence 只有 claim 沒有 confidence/conflict | **必填 confidence + conflict detection**，verifier 自動檢查、人工複核 |

---

## 總結：Observability/Evidence/Artifacts 核心契約

```
Run Execution
    → Trace Spans (hierarchical: run → step → skill → provider/tool → guard)
    → Trace Events (step.started, proxy_fallback, guard.blocked, evidence.added)
    → Metric Points (derived: cost, latency, tokens, reliability, quality)
    
Evidence Pipeline
    → Sources (url, title, provider, retrievedAt)
    → EvidenceItems (sourceId, excerpt, confidence, supportsStep)
    → Claims (artifactVersionId, text, confidence, status)
    → Citations (claimId, evidenceItemId, citationText, status)
    → Conflicts (claimIds, evidenceItemIds, severity, status)
    → Human Review (approve/reject/annotate, preserve original)
    
Artifact Pipeline
    → Artifact (runId, type, name, status)
    → ArtifactVersion (artifactId, version, content, sourceStepRunId, evidenceRefs)
    → Approve/Reject/Regenerate/Export (all versions preserved)
    
Context Assembly
    → ContextBlocks (10 types, priority, tokenCount)
    → Budget Allocation (proportional, response reserved)
    → Compression (truncate_words, record decision)
    → Step-Local Tool Descriptions (priority 100)
    
Memory System
    → MemoryItem (procedural/episodic/semantic, scopes, sourceRunId)
    → MemoryWriteProposal (pending → approved/rejected, rationale)
    → Retrieval (scope-filtered)
```

**三大不變量**：
1. **Trace 完整階層** —— 從 run 到單一 tool call 全鏈路可查
2. **Evidence 可追溯** —— 每個 claim 都能點到 source/excerpt/citation
3. **Artifact/Memory 版本化 + 審核** —— 不刪除歷史、不自動寫入生產

---

## 參考資料

- [Agent Platform: Observability Evidence Artifacts Spec](https://github.com/vincentxuu/agent-platform/blob/main/openspec/specs/observability-evidence-artifacts/spec.md)
- [Observability Evidence Artifacts Implementation](https://github.com/vincentxuu/agent-platform/blob/main/packages/runtime/src/observability-evidence-artifacts.ts)
- [Context Memory Management Spec](https://github.com/vincentxuu/agent-platform/blob/main/openspec/specs/context-memory-management/spec.md)
- [Context Memory Implementation](https://github.com/vincentxuu/agent-platform/blob/main/packages/runtime/src/context-memory.ts)
- [Agent Gateway Plan - Observability System](https://github.com/vincentxuu/agent-platform/blob/main/agent-gateway-plan.md#46-observability-system)
- [Agent Gateway Plan - Evidence/Audit Store](https://github.com/vincentxuu/agent-platform/blob/main/agent-gateway-plan.md#413-evidence--audit-store)
- [Agent Gateway Plan - Artifact System](https://github.com/vincentxuu/agent-platform/blob/main/agent-gateway-plan.md#414-artifact-system)
- [Agent Gateway Plan - Context Management](https://github.com/vincentxuu/agent-platform/blob/main/agent-gateway-plan.md#47-context-management)
- [Agent Gateway Plan - Memory System](https://github.com/vincentxuu/agent-platform/blob/main/agent-gateway-plan.md#48-memory-system)
