---
title: "Agent Platform Deep Dive (3) — Skill System: Versioned Capability Packages, Explicit Binding, and the Learning Loop"
date: 2026-08-23
category: tech
type: deep-dive
tags: ["ai-agent", "skill-system", "learning-loop", "agent-platform", "evaluation", "versioning"]
lang: en
description: "A deep dive into Agent Platform's Skill System: its dual-file skill.yaml + SKILL.md architecture, four-layer progressive disclosure, explicit FlowStep binding with @version, complete invocation tracking, four built-in Deep Research skills, and a closed Learning Loop from signals to proposals and eval gates."
tldr: "A Skill is a versioned, installable, and auditable capability package. Its dual-file architecture separates metadata from instructions, explicit binding replaces model-driven routing, and every invocation is recorded. The Learning Loop turns run signals into proposals, sandbox evaluations, human review, and publication while enforcing the principle: agents propose, humans review, and evals serve as the gate."
---
> 🌏 [中文版](/posts/tech/2026-08-23-agent-platform-skill-system)

tags: ["ai-agent", "skill-system", "learning-loop", "agent-platform", "evaluation", "versioning", "skill-package", "progressive-disclosure"]
## TL;DR

The Skill System is Agent Platform's **methodology layer**. It addresses how to complete a class of work reliably:
- **Dual-file architecture**: `skill.yaml` (metadata/version/permissions/evals) + `SKILL.md` (execution instructions), separating platform management from execution logic
- **Four-layer progressive disclosure**: L1 `skill.yaml` is always scannable → L2 `SKILL.md` loads when a step confirms it will use the skill → L3 `references/`, `scripts/`, and `assets/` load when execution requires them
- **Explicit binding**: a FlowStep declares `uses: citation-extractor@1.0.0` and **does not rely on the model to decide which skill to load**
- **Invocation tracking**: every invocation records the skillVersionId, input/output refs, permission decisions, tool usage, duration, and errors
- **Four built-in Skills**: research-planner, source-ranker, citation-extractor, and report-synthesizer validate the full Deep Research cycle
- **Closed Learning Loop**: run completes → signal captured → proposal generated → human review → sandbox eval → quality gate → publish

---

## Why Do You Need a Skill System?

Traditional agent frameworks mix prompts, tools, and workflows together:
- Prompts live in code, making them hard to version, audit, and reuse
- The model decides whether and how to use a tool, which makes behavior difficult to control
- Without the concept of a capability package, methodologies such as research planning and evidence extraction cannot be reused across flows

Agent Platform separates **task orchestration (Flow)** from **capability packages (Skill)**:

| Layer | Responsibility | Example |
|------|------|------|
| **Flow** | Task orchestration: steps, sequencing, and conditional branches | A 10-step Deep Research DAG |
| **Skill** | Capability package/methodology: how to complete a class of work reliably | citation-extractor: how to extract claims + citations from sources |
| **MCP** | Tool and data-source connections through a unified interface | web_search, browser.fetch, reader.read |
| **Policy** | Cost, permissions, validation, and human review | max_cost_usd, approval_gate |

**A Skill is not a Flow, an MCP Tool, or A2A**. It is **a package of procedural knowledge that can be installed, versioned, triggered, and audited**.

---

## Skill Package Structure: A Dual-File Architecture

```
skills/
  citation-extractor/
    skill.yaml          # 平台 metadata：id、version、permissions、evals、schemas
    SKILL.md            # 執行指令：給模型看的系統提示詞
    references/         # 參考資料：evidence-schema.md、citation-rules.md
    scripts/            # 驗證/轉換腳本：validate_evidence.ts
    assets/             # 模板：report-template.md
    evals/              # 評測案例：trigger-cases.json、golden-cases.json
```

### skill.yaml: Platform Metadata

```yaml
# skills/citation-extractor/skill.yaml
id: citation-extractor
name: Citation Extractor
version: 1.0.0
description: Extracts claims, citations, excerpts, source mappings, conflicts, and confidence from read sources.

# 權限宣告：step 能用什麼 provider/tool
permissions:
  - provider:llm          # 可呼叫 LLM
  - reader:read           # 可用 reader 讀取來源

# 評測配置：發布前必跑的 eval
evals:
  - output-schema         # 輸出符合 schema
  - citation-quality      # citation 品質檢查

# 選塊：input/output schema 路徑（相對 package root）
# input_schema: ./schemas/input.json
# output_schema: ./schemas/output.json
```

**Required fields**: `id`, `name`, `version`, `description`, `permissions`, and `evals`

### SKILL.md: Execution Instructions

```markdown
# Citation Extractor

Extract evidence from source material.

Return:

- claims
- supporting excerpts
- source references
- citation status
- conflicts
- confidence
```

These are **system-prompt instructions for the model**. When the platform executes the step, it injects the contents of `SKILL.md` into the context, and the model follows the instructions to produce structured output.

> **The key separation**: `skill.yaml` is for platform tools (registry, validator, router, and eval runner), while `SKILL.md` is for the model. Their responsibilities are orthogonal and do not interfere with each other.

---

## Four-Layer Progressive Disclosure

To avoid putting every skill's contents into the context at once—which would exhaust tokens and expose implementation details—the system loads them in layers:

| Layer | Contents | When Loaded | Purpose |
|------|------|----------|------|
| **L1: skill.yaml** | metadata, permissions, evals, schemas | Registry scan, flow validation, and skill router relevance checks | Always visible; **instruction contents are not loaded** |
| **L2: SKILL.md** | Execution instructions (system prompt) | When a FlowStep confirms `uses: skill@version` | Loaded only when needed |
| **L3: references/** | Domain knowledge, schema definitions, and rule documents | When `SKILL.md` explicitly uses `@reference` and execution requires it | Loaded on demand |
| **L3: scripts/** | Validation/transformation scripts | During evaluation and artifact generation | Run offline/in batch |
| **L3: assets/** | Templates and examples | When referenced by `SKILL.md` | Used to produce artifacts |
| **L3: evals/** | Trigger/golden cases | During evaluation | CI/CD and the publish gate |

**Result**: on a platform with 50 skills, a flow run loads only **L1 + L2 for the 3–5 skills bound to that flow**. None of the other skills enter the context.

---

## Explicit Binding: FlowStep Declares `uses: skill@version`

```yaml
# FlowDefinition.steps 片段
steps:
  - id: extract_evidence
    type: agent
    uses: citation-extractor@1.0.0    # 顯式綁定版本
    input:
      sources: "{{steps.read_sources.output}}"
```

**Why not let the model decide which skill to use?**

| Model Routing | Explicit Binding |
|---------|---------|
| Unpredictable: the same input may select different skills | Deterministic: the same flow version always uses the same skill version |
| Hard to audit: why did this step use that skill? | Fully traceable: step declaration, registry resolution, and invocation record |
| Hard to test: behavior cannot be pinned down | Testable: eval cases target a specific skill version |
| Upgrade risk: the model may suddenly change behavior | Controlled upgrades: the skill binding changes only when a new flow version is published |

**Production flow principle**: a FlowStep should use **explicit binding as the default and router triggers as a supplement**. Router recommendations are limited to general-purpose steps with no bound skill or to exploratory stages.

---

## Invocation Tracking: A Complete Audit Trail

For every skill execution, `SkillRegistry.recordInvocation` records:

```typescript
interface SkillInvocation {
  id: string;                    // "skill_invocation_abc123"
  runId: string;
  stepRunId: string;
  skillVersionId: string;        // "citation-extractor@1.0.0"
  status: "pending" | "running" | "succeeded" | "failed" | "canceled";
  inputRef: string;              // 指向 stepRun.input 或 context snapshot
  outputRef: string;             // 指向 stepRun.output 或 artifact
  permissionDecisions: PermissionDecision[];  // 每個 tool/provider 是否允許
  toolUsage: ToolUsage[];        // 實際呼叫了哪些 tool、幾次、成本
  startedAt: string;
  endedAt: string;
  error?: ErrorInfo;
}
```

The Web UI's Step Details page reads this record directly and shows:
- Which skill version was used
- Which tools were permitted and which were actually invoked
- Input/output references, with links to the raw data
- Duration, cost, and errors

---

## Four Built-in Deep Research Skills

| Skill | Steps | Input | Key Output Fields | Permissions | Evals |
|-------|------|------|-------------|-------------|-------|
| **research-planner** | `clarify`, `plan` | topic, audience, freshness, brief | `subquestions[]`, `search_plan`, `stopping_conditions` | `provider:llm` | trigger, output-schema |
| **source-ranker** | `rank_sources` | `sources[]`, `subquestion` | `ranked_sources[]` (including relevance/authority/freshness scores) | `provider:llm` | output-schema |
| **citation-extractor** | `extract_evidence` | `source_contents[]` | `evidence_items[]` (claim, excerpt, source_ref, citation_status, confidence, conflicts) | `provider:llm`, `reader:read` | output-schema, citation-quality |
| **report-synthesizer** | `synthesize` | `evidence_items[]`, `brief` | `draft_report` (Markdown, with evidence ID links retained for claims) | `provider:llm` | output-schema, artifact-format |

Together, these four skills form a complete research loop: **plan → search → rank → read → extract evidence → synthesize → validate → produce output**.

---

## Learning Loop: Closing the Loop from Run to Improvement

> **Core principle**: Agent can propose learning, but production knowledge requires eval and human approval.

### 1. Learning Signals

| Signal | Trigger | Example |
|--------|----------|------|
| `user_correction` | The user corrects or rejects something on the Evidence/Artifact page | The user marks a claim as having an "incorrect citation" |
| `run_failed_then_succeeded` | The same flow and input fail, then succeed after a rerun | Passes after retry-step |
| `step_retry_succeeded` | A step succeeds after a retry | The search step succeeds on the second attempt |
| `verifier_failure` | The verifier determines that coverage is insufficient | verify outputs `coverage_insufficient: true` |
| `cost_outlier` | Cost exceeds the preset policy by 2x | A Deep Research run costs $15 (preset maximum: $8) |
| `provider_failure` | The primary provider fails and the fallback takes effect | Tavily fails and falls back to Exa |
| `high_tool_count` | Tool calls in a single step exceed the threshold | The search step makes 20+ API calls |
| `manual_feedback` | The user submits feedback from the Improve page | "This flow needs PDF parsing" |

### 2. From Signal to Proposal

```
Run completed
    ↓
Learning Candidate Detector  （掃描上述 signals）
    ↓
Trace Summarizer  （將相關 stepRun、toolUsage、evidence、error 摘要化）
    ↓
Proposal Generator  （依 signal 類型產出四類提案之一）
    ↓
Human Review  （Web UI: Improve 頁面）
    ↓
Sandbox Eval  （用 historical runs 跑 proposal，對比 metric）
    ↓
Quality Gate  （通過 output-schema、policy、regression evals）
    ↓
Publish  （SkillVersion 升版、Policy 更新、EvalCase 入庫、Memory 寫入）
```

### 3. Four Reviewable Proposal Types

| Proposal Type | Source | Risk Level | Review Process |
|---------|------|---------|---------|
| **MemoryUpdate** | Small preferences, project conventions, and tool caveats | Low | Direct review → apply |
| **SkillProposal** | Extract a new skill from successful/failed trajectories, or modify an existing skill | Medium | review → sandbox eval → quality gate → publish new SkillVersion |
| **PolicySuggestion** | A provider frequently fails, suggesting a fallback change; a tool needs tighter limits; or a flow needs an approval gate | Medium | review → sandbox eval → apply policy version |
| **EvalCase** | Turn a real failure into a regression test | Low | review → add to regression suite |

**The key**: **every proposal remains in a pending-review state and never takes effect automatically**. This prevents erroneous rules hallucinated by the model from contaminating the production environment.

### 4. Quality Gates for Skill Publication

```
SkillVersion draft
    ↓
Trigger Eval  （輸入觸發條件是否正確識別）
    ↓
Functional Eval  （golden cases：輸出是否符合預期）
    ↓
Policy Eval  （permissions 是否合規、tool usage 是否超標）
    ↓
Regression Eval  （跑所有 regression cases，確保不回歸）
    ↓
Human Review  （最終把關）
    ↓
Publish  （status: draft → published）
```

**If any gate fails, the version remains a draft and the failed gate is recorded**. This is the Skill System's immune system.

---

## Implementation Details: The Core SkillRegistry API

```typescript
// packages/runtime/src/skill-packages.ts
class SkillRegistry {
  // 1. 發現並載入 skills 目錄下所有 package
  discoverSkills(rootDir: string): SkillVersion[]
  
  // 2. 載入單一 package（驗證 skill.yaml + SKILL.md 存在）
  loadSkillPackage(packagePath: string): SkillVersion
  
  // 3. 解析 FlowStep binding → 取得 SkillVersion
  resolveBinding(binding: string): SkillVersion  // "citation-extractor@1.0.0"
  
  // 4. 建立執行上下文（注入給 step handler）
  createInvocationContext({ binding, inputRef, allowedAssets }): InvocationContext
  
  // 5. 記錄 invocation（審計用）
  recordInvocation(invocation: SkillInvocation): SkillInvocationRecord
}
```

**InvocationContext contents**:
```typescript
{
  skillVersionId: "citation-extractor@1.0.0",
  inputRef: "stepRun_123.output",
  instructions: "# Citation Extractor\n\nExtract evidence...",  // SKILL.md 完整內容
  metadata: { id, name, version, description, permissions, evals },
  permissions: ["provider:llm", "reader:read"],
  allowedAssets: ["report-template.md"],
  outputSchema: { ... },  // 來自 skill.yaml output_schema
  inputSchema: { ... }
}
```

The step handler receives this context and assembles a prompt for the model. The model produces output → the platform validates outputSchema → writes to stepRun.output → calls `recordInvocation`.

---

## Common Pitfalls and Best Practices

| Pitfall | Correct Approach |
|------|----------|
| Putting business logic in SKILL.md, such as specific API calls | SKILL.md should state only **what to do, what format to return, and what principles to follow**; the handler + MCP manage concrete tool calls |
| Omitting `output_schema` and letting the model improvise | **Require `output_schema`**; the eval gate validates it, and downstream steps depend on structured output |
| Making Skills depend on each other (A calls B) | **Skills do not call one another**; the Flow orchestrates them, and each Skill handles one capability |
| Publishing a Skill upgrade without running evals | **Always run the full eval suite**; regression cases exist specifically to prevent this kind of regression |
| Treating prompt engineering as a Skill | A Skill = methodology + permissions + evaluation + versioning; a prompt template alone is not a Skill |

---

## Summary: The Skill System's Core Contract

```
Skill Package (file system)
    → skill.yaml (platform metadata) + SKILL.md (execution instructions)
    → Registry.loadSkillPackage() → SkillVersion (registered)
    
FlowStep.uses: "skill@version"
    → Registry.resolveBinding() → SkillVersion
    → Registry.createInvocationContext() → InvocationContext
    
Step Handler.execute(context)
    → Model呼叫 → Output驗證 → StepRun.output
    → Registry.recordInvocation() → SkillInvocation (audit trail)
    
Run completed
    → LearningLoop.detectSignals() → Proposals[]
    → HumanReview → SandboxEval → QualityGate → Publish
```

**Three invariants**:
1. **SkillVersion is immutable** — never modify a published version; release a new version for an upgrade
2. **Explicit binding takes precedence over implicit routing** — production flows must declare `uses: skill@version`
3. **Learning never takes effect automatically** — every improvement passes Human Review + Eval Gate

---

## References

- [Agent Platform: Skill Packages Spec](https://github.com/vincentxuu/agent-platform/blob/main/openspec/specs/skill-packages/spec.md)
- [Agent Platform: Evaluation & Learning Loop Spec](https://github.com/vincentxuu/agent-platform/blob/main/openspec/specs/evaluation-learning-loop/spec.md)
- [Skill Registry Implementation](https://github.com/vincentxuu/agent-platform/blob/main/packages/runtime/src/skill-packages.ts)
- [Built-in Skills](https://github.com/vincentxuu/agent-platform/tree/main/skills) — citation-extractor, source-ranker, research-planner, report-synthesizer
- [Agent Gateway Plan - Skill System](https://github.com/vincentxuu/agent-platform/blob/main/agent-gateway-plan.md#43-skill-system)
- [Agent Gateway Plan - Learning Loop](https://github.com/vincentxuu/agent-platform/blob/main/agent-gateway-plan.md#44-learning-loop)
