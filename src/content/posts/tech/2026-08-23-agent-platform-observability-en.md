---
title: "Agent Platform Deep Dive (Part 6) — Observability, Evidence, and Artifacts: Structured Traces, Claim-to-Source Lineage, and Versioned Outputs"
date: 2026-08-23
category: tech
type: deep-dive
tags: ["ai-agent", "observability", "evidence", "artifacts", "trace", "audit", "agent-platform"]
lang: en
description: "A deep dive into Agent Platform's observability, evidence, and artifact systems: structured trace hierarchies, derived metrics, the Evidence Store (Claim↔Source↔Excerpt↔Citation), artifact versioning, the Markdown Report and JSON Evidence Bundle MVP formats, Context Snapshot budget allocation and compression, scoped procedural/episodic/semantic memory, and the Memory Write Proposal mechanism."
tldr: "Observability is a first-class capability, not logging added after the fact: a structured trace connects FlowRun→StepRun→SkillInvocation→ProviderCall→ToolInvocation→GuardResult→EvidenceItem→ArtifactVersion. The Evidence Store traces every claim back to its source, excerpt, citation, confidence, and conflicts. Artifact versioning supports approve/reject/regenerate without deleting history. Context Snapshots allocate token budgets by category and record automatic compression when a block exceeds its budget. Procedural, episodic, and semantic memory can be written only through proposals reviewed by a human."
---

> 🌏 [中文版](/posts/tech/2026-08-23-agent-platform-observability)

## TL;DR

Agent Platform treats **observability, evidence lineage, and output versioning** as first-class capabilities, not logs added after the fact:

- **Structured traces**: a complete `FlowRun → StepRun → SkillInvocation → ProviderCall/ToolInvocation → GuardResult → EvidenceItem → ArtifactVersion` hierarchy, with drill-down details at every node
- **Derived metrics**: automatic aggregation of cost, latency, tokens, retries, fallbacks, tool usage, provider health, skill health, and quality metrics from traces
- **Evidence Store**: a complete `Claim ← Citation → EvidenceItem → Source` chain with clickable claim-to-source lineage, confidence labels, conflict records, and human approve/reject/annotate actions
- **Artifact Versioning**: versioned Markdown Reports and JSON Evidence Bundles that can be approved, rejected, or regenerated without deleting older versions
- **Context Snapshot**: ten ContextBlock types, proportional token-budget allocation, automatic truncation when a block exceeds its budget, and a record of every compression decision
- **Scoped Memory**: procedural rules and conventions, episodic run summaries, and semantic knowledge and facts, isolated by org/user/project/flow/skill/session/run scope; writes require human-reviewed MemoryWriteProposals

---

## Why Does the Platform Need This System?

Observability in conventional agent frameworks often stops at printing logs:

| Conventional approach | Agent Platform |
|---------|----------------|
| Print `console.log` and grep afterward | Structured trace objects automatically associate runs, steps, skills, providers, and tools |
| Calculate cost and latency afterward | Derive metrics in real time, segmented across step, provider, skill, and tool dimensions |
| No way to verify the sources behind an output report | Evidence Store links every claim to a source, excerpt, citation, and confidence level |
| A rerun overwrites the previous result | Artifact versioning creates a new version on regeneration and preserves old versions for comparison |
| Fill the context window without knowing what to remove | Budget allocation, automatic compression, and recorded compression decisions |
| Write memory directly into production and contaminate the environment | Memory Write Proposal: the agent proposes, a human reviews, and only then does the change take effect |

---

## Structured Traces: The Complete Execution Hierarchy

### Trace Hierarchy Model

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

### Recording Spans and Events

```typescript
// packages/runtime/src/observability-evidence-artifacts.ts
startSpan({ runId, stepRunId, type, name, parentId, inputRef, metadata })
// type: "step" | "skill" | "provider_call" | "tool_invocation" | "proxy_request" | "guard" | "verifier"

finishSpan(spanId, { status, outputRef, error })
// 記錄 durationMs、status、outputRef、error

recordEvent({ runId, traceSpanId, type, payload })
// type: "step.started" | "step.succeeded" | "proxy_fallback" | "guard.blocked" | "evidence.added" | "artifact.created"
```

The **Web UI Timeline reads spans and events directly**, renders an expandable hierarchy, and lets users inspect the complete input, output, guard results, and metrics at any node.

---

## Derived Metrics: Automatic Aggregation from Traces

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

**Complete metric taxonomy**:

| Category | Metric | Dimensions | Purpose |
|------|---------|------|------|
| **Cost** | `cost.total_usd` | run/step/provider/skill/tool | Budget control and cost attribution |
|  | `cost.by_provider` | provider | Identify the most expensive provider |
|  | `cost.by_step` | stepId | Optimize expensive steps |
| **Latency** | `latency.step_duration_ms` | stepId | Find bottlenecks |
|  | `latency.provider_call_ms` | provider | Compare provider speed |
|  | `latency.proxy_stream_chunks` | model/provider | Assess the streaming experience |
| **Tokens** | `tokens.input/output/total` | run/step/model | Control context and estimate cost |
| **Reliability** | `guard.blocks` | guardType | Find rules that block frequently |
|  | `retry.count` | provider/tool/step | Analyze reliability |
|  | `fallback.count` | from→to provider | Measure fallback effectiveness |
| **Quality** | `evidence.citation_coverage` | run | Assess report credibility |
|  | `evidence.conflict_count` | run | Measure the severity of conflicts |
|  | `verifier.pass_rate` | run | Measure verification pass rate |

**Proxy-specific metrics** (with the `proxy_*` prefix):
```typescript
// 記錄於 finishProxySpan、recordFallbackAttempt、recordProxyStreamChunks
"proxy_request_duration_ms"
"proxy_tokens_input/output"
"proxy_cost_usd"
"proxy_fallback_count" (含 fromProvider/toProvider/status)
"proxy_stream_chunks"
```

The Web UI Observability page presents proxy metrics **grouped by client, model, and provider**.

---

## Evidence Store: Complete Claim-to-Source Lineage

### Data Model

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

### Lineage Flow

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

### Human Review

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

## Artifact Versioning: Versioned Outputs

### Two MVP Artifact Types

| Type | ID | Description |
|------|----|------|
| **Markdown Report** | `markdown_report` | A human-readable research report with citation markers |
| **JSON Evidence Bundle** | `json_evidence_bundle` | A complete evidence package for machines and downstream processing |

### Versioning Mechanism

```typescript
createArtifact({ runId, type, name })
// 建立 artifact 容器，status: "draft"

addArtifactVersion({ artifactId, content, sourceStepRunId, evidenceRefs })
// 產出新版本：version = existing.length + 1
// 記錄 sourceStepRunId、evidenceRefs（關聯哪些 evidence）
```

**Example version history**:
```
Artifact: markdown_report (artifact_abc)
  ├── v1: 初版 (source: synthesize step, evidence: 15 items, status: draft)
  ├── v2: 用戶點擊 Regenerate (source: synthesize step, evidence: 18 items, status: draft)
  ├── v3: 用戶修正後 Regenerate (source: synthesize step, evidence: 18 items, status: approved)
  └── v4: 用戶手動編輯 (source: manual, evidence: 18 items, status: approved)
```

### Approve/Reject/Regenerate

| Action | Behavior | Effect on versions |
|------|------|---------|
| **Approve** | Record the decision, reviewer, time, and current evidence state | Set version status to `approved`; do not delete older versions |
| **Reject** | Record the decision, reason, and current evidence state | Set version status to `rejected`; do not delete older versions |
| **Regenerate** | Regenerate content from `sourceStepRunId` | **Add version v+1** and preserve the old version |
| **Export** | Download Markdown, JSON, or PDF | Export any version |

The key invariant is that `regenerate` **does not delete older versions**, which preserves comparisons, rollback, and audit history.

---

## Generating Markdown Reports: Automatic Citation Injection

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

**Example output**:
```markdown
# Agent Memory Systems Comparison

- Graph-based orchestration is becoming mainstream [evidence_123] [evidence_124]
- LangGraph provides the most mature developer experience [evidence_125]
- AutoGen v0.4 introduces graph-based workflows [evidence_126]
- Memory isolation between agents remains a challenge [evidence_127] [evidence_128]
```

**Evidence Bundle JSON structure**:
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

## Context Snapshot: Token-Budget Allocation and Automatic Compression

### Ten ContextBlock Types

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

### Budget Allocation Ratios

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

The design gives `retrieval_evidence` the largest share, 28%, because research work depends most heavily on supporting evidence.

### Automatic Compression

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

Every **compression decision** is preserved in `snapshot.compressions[]` and exposed through observability:

- Original block type and token count
- Compressed token count
- Compression method (currently `truncate_words`; planned methods include summarize/embed/reference)
- When and at which step compression was triggered

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

The result: the `citation-extractor` step sees descriptions for `web_fetch` and `web_extract` only. It **does not see** unrelated tools such as `web_search` or `github_create_issue`, saving tokens and reducing hallucinations.

---

## Scoped Memory: Three Memory Types, Layered Isolation, and Reviewable Writes

### Three Memory Types

| Type | Content | Lifecycle | Example |
|------|------|---------|---------|
| **Procedural** | Reusable workflow rules, tool-use conventions, and best practices | Long-lived and shared across runs | "Prioritize Tavily+Exa RRF fusion for search"; "Citations must include a URL and date" |
| **Episodic** | Summaries of specific run experiences and successful or failed patterns | Medium-lived and retrievable across runs | "Run #123: topic=agent memory; successful pattern: plan→search(2 providers)→rank→read→extract" |
| **Semantic** | Domain knowledge, facts, and entity relationships | Long-lived and shared across projects | "LangGraph is LangChain's graph orchestration framework"; "GPT-4o was released in 2024-05" |

### Scope Isolation

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

Retrieval filters by scope. It loads only memory items relevant to the current run, flow, or skill, which prevents contamination, leakage, and wasted tokens.

### Memory Write Proposal: Writes Require Review

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

**Flow**:
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

The core rule is: **the agent proposes, a human reviews, and the agent never writes directly into production memory**. This prevents hallucinated rules from contaminating the knowledge base.

---

## Web UI Views

| Page | Core capabilities | Data source |
|------|---------|--------|
| **Timeline** | Step flowchart, duration, status, and expandable span/event details | traceSpans + traceEvents |
| **Step Detail** | Complete skill/provider/tool/guard/evidence/artifact record for one step | SkillInvocation + ProviderCall + GuardResult + EvidenceItem |
| **Observability** | Cost breakdown, latency, tokens, retries, fallbacks, and provider health | metricPoints (derived) |
| **Evidence** | Claim-to-source lineage, confidence, conflicts, and approve/reject/annotate actions | EvidenceItem + Claim + Citation + Source + Conflict |
| **Artifacts** | Version list, content preview, approve/reject/regenerate/export | Artifact + ArtifactVersion |
| **Context** | Per-step context snapshots, block details, budget allocation, and compression records | ContextSnapshot |
| **Memory** | Procedural/Episodic/Semantic lists, scope filters, and proposal review | MemoryItem + MemoryWriteProposal |

---

## Common Pitfalls and Best Practices

| Pitfall | Correct approach |
|------|----------|
| Record only the final output, not intermediate evidence | **Produce evidence at every step**, link claims to evidence immediately, and assemble citations automatically in the final report |
| Overwrite an old artifact when rerunning | **Version it**: regeneration creates a new version while preserving old versions for comparison and rollback |
| Fill the context without removing anything, or remove content at random | **Budget allocation + priority + compression records** make the process transparent, auditable, and tunable |
| Write memory directly and contaminate the environment while runs are active | Use **MemoryWriteProposal** so every long-term memory write receives human review |
| Fail to record compression decisions, making lost information impossible to explain later | A **compression record** preserves original/compressed token counts, method, and `sourceRef` |
| Store claims without evidence confidence or conflicts | **Require confidence and conflict detection**; the verifier checks them automatically and a human reviews them |

---

## Summary: Core Observability, Evidence, and Artifact Contracts

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

**Three invariants**:

1. **Complete trace hierarchy** — every link from the run down to an individual tool call is inspectable
2. **Traceable evidence** — every claim links back to a source, excerpt, and citation
3. **Versioned and reviewed artifacts and memory** — history is never deleted, and production memory is never written automatically

---

## References

- [Agent Platform: Observability Evidence Artifacts Spec](https://github.com/vincentxuu/agent-platform/blob/main/openspec/specs/observability-evidence-artifacts/spec.md)
- [Observability Evidence Artifacts Implementation](https://github.com/vincentxuu/agent-platform/blob/main/packages/runtime/src/observability-evidence-artifacts.ts)
- [Context Memory Management Spec](https://github.com/vincentxuu/agent-platform/blob/main/openspec/specs/context-memory-management/spec.md)
- [Context Memory Implementation](https://github.com/vincentxuu/agent-platform/blob/main/packages/runtime/src/context-memory.ts)
- [Agent Gateway Plan — Observability System](https://github.com/vincentxuu/agent-platform/blob/main/agent-gateway-plan.md#46-observability-system)
- [Agent Gateway Plan — Evidence/Audit Store](https://github.com/vincentxuu/agent-platform/blob/main/agent-gateway-plan.md#413-evidence--audit-store)
- [Agent Gateway Plan — Artifact System](https://github.com/vincentxuu/agent-platform/blob/main/agent-gateway-plan.md#414-artifact-system)
- [Agent Gateway Plan — Context Management](https://github.com/vincentxuu/agent-platform/blob/main/agent-gateway-plan.md#47-context-management)
- [Agent Gateway Plan — Memory System](https://github.com/vincentxuu/agent-platform/blob/main/agent-gateway-plan.md#48-memory-system)
