---
title: "Agent Platform Deep Dive (VII)—Evaluation & Quality Gates: Comprehensive Evaluation, Regression Prevention, and an Immune System for Skill Releases"
date: 2026-08-23
category: tech
tags: ["ai-agent", "evaluation", "quality-gates", "regression-testing", "skill-publishing", "agent-platform"]
lang: en
description: "A deep dive into the Agent Platform Evaluation System: seven eval categories (Flow, Step, Skill, Artifact, Evidence, Policy, and Regression), three execution stages (Pre-run, In-run, and Post-run), a ten-dimension core Scorecard, five Quality Gates for Skill releases, the Learning Loop from Signal to Proposal, conversion of real Runs into Eval Cases, and mandatory Quality Gates that block unqualified releases."
tldr: "Evaluation is Agent Platform's quality immune system: instead of collecting statistics only after a run, it enforces checks throughout Pre-run, In-run, and Post-run execution. Seven eval categories cover Flow → Step → Skill → Artifact → Evidence → Policy → Regression. A Skill release must pass five gates—Trigger, Functional, Policy, Regression, and Human Review—and any failure blocks it. The Learning Loop moves from Run signals through Proposal, Human Review, Sandbox Eval, Quality Gate, and Publish, under one strict rule: agents propose, humans review, and eval gates decide whether a change can ship."
---

> 🌏 [中文版](/posts/tech/2026-08-23-agent-platform-evaluation)

## TL;DR

The Evaluation System is Agent Platform's **quality control layer**, not an after-the-fact reporting system:

- **Seven eval categories**: Flow, Step, Skill, Artifact, Evidence, Policy, and Regression, covering the entire lifecycle
- **Three execution stages**: Pre-run (binding validation) → In-run (schema, policy, citation, coverage, and budget checks at step boundaries) → Post-run (artifact, evidence, trajectory, cost, latency, and feedback)
- **Ten-dimension Scorecard**: correctness, coverage, citation_quality, schema_validity, policy_compliance, cost_efficiency, latency, tool_selection_accuracy, retry_recovery, and human_acceptance
- **Five Skill release gates**: Trigger Eval → Functional Eval → Policy Eval → Regression Eval → Human Review; **any failure keeps the Skill in draft status**
- **Closed Learning Loop**: Run completion → Signal capture → Proposal generation → Human Review → Sandbox Eval → Quality Gate → Publish
- **Regression Prevention**: real failure → EvalCase Proposal → Review → Regression Suite; all subsequent versions must run it

---

## Why Does Agent Platform Need System-Level Evaluation?

Most agent frameworks treat evaluation as an afterthought:

- Run a few test cases, decide the output “looks good,” and release it
- Maintain no regression suite, so prompt or model upgrades silently break existing behavior
- Leave evaluation outside the release process, making quality thresholds dependent on manual enforcement
- Track no quantitative metrics for evidence quality or citation coverage

Agent Platform makes Evaluation **platform-level infrastructure** embedded in the runtime:

| Conventional approach | Agent Platform |
|---------|----------------|
| Ad hoc scripts and notebooks | Structured, versioned Eval Suites, Cases, Runs, and Results |
| Test only the final output | Seven eval categories spanning Flow, Step, Skill, Artifact, Evidence, and Policy |
| Run tests manually before release | **Mandatory Quality Gates**: a failing Skill draft cannot be published |
| Discard failures or discuss them only in issues | **Automatically convert them into Regression Cases** that must run thereafter |
| No way to quantify whether this version is better than the previous one | Ten Scorecard dimensions, historical trends, and Sandbox A/B comparisons |

---

## Seven Evaluation Categories: Comprehensive Coverage

| Eval type | Evaluation target | Core question | Typical metric |
|-----------|---------|---------|------------|
| **Flow Eval** | Entire workflow | Did it complete the task? Did quality and cost meet the preset? | task_completion_rate, preset_quality_pass, cost_within_budget |
| **Step Eval** | Individual step | Does the output match the schema? Can downstream steps use it? | schema_validity, downstream_compatibility |
| **Skill Eval** | Capability package | Are triggers accurate? Is behavior correct? Does the output match its schema? Are tool permissions valid? Are cost and latency acceptable? | trigger_accuracy, functional_correctness, output_schema_pass, tool_permission_pass, cost_latency_within_budget |
| **Artifact Eval** | Final deliverable | Is it complete, correctly formatted, readable, and usable? | completeness, format_validity, readability, adoption_rate |
| **Evidence Eval** | Evidence chain | Citation coverage? Claim-to-source mapping? Excerpt validity? Conflict detection? Source freshness? | citation_coverage, claim_source_mapping_rate, excerpt_validity, conflict_detection_rate, stale_source_rate |
| **Policy Eval** | Policy enforcement | Were budget, allowlist, permission, approval, and external-write rules enforced correctly? | budget_enforcement_rate, allowlist_compliance, approval_gate_triggered, external_write_blocked |
| **Regression Eval** | Historical failures | Do real failures, user corrections, or verifier failures still recur? | regression_pass_rate, fixed_cases_stay_fixed |

---

## Three Execution Stages: Move Quality Checks Earlier

### Pre-run: Static Validation Before Run Creation

```typescript
// 檢查項目
PreRunEval.check(flowVersion, preset, skillBindings, providerConfig, policy) {
  // 1. Flow 定義完整性
  validateFlowDefinition(flowVersion);
  
  // 2. Skill bindings 解析
  for (const step of flowVersion.steps) {
    if (step.uses) {
      const skillVersion = skillRegistry.resolveBinding(step.uses);
      // 檢查 skill 狀態、permissions、schemas
    }
  }
  
  // 3. Provider readiness
  for (const requiredRole of flowVersion.requiredProviderRoles) {
    const available = providerRouter.getAvailableProviders(requiredRole, preset.policy);
    if (available.length === 0) throw Error(`No provider for role: ${requiredRole}`);
  }
  
  // 4. Policy 版本存在且 published
  // 5. MCP tool bindings 有效
  
  return { valid: true, warnings: [] };
}
```

**A failure blocks Run creation**, preventing wasted resources.

### In-run: Real-Time Validation at Step Boundaries

The platform automatically runs the following checks when each step finishes:

```typescript
InRunEval.atStepBoundary(stepRun, policy, skillVersion) {
  const results = [];
  
  // 1. Output Schema 驗證
  if (skillVersion?.metadata.output_schema) {
    results.push(validateSchema(stepRun.output, skillVersion.metadata.output_schema));
  }
  
  // 2. Policy Guards（已在 Policy Engine 執行，這裡記錄結果）
  results.push(...stepRun.guardResults);
  
  // 3. Citation Coverage（若 step 產出 claims）
  if (stepRun.output?.claims && policy.quality.citationRequired) {
    results.push(evaluateCitationCoverage(stepRun.output.claims));
  }
  
  // 4. Budget Check
  results.push(checkBudget(stepRun.runId, policy.budget));
  
  // 5. Evidence Quality（若為 extract_evidence 步驟）
  if (stepRun.stepId === "extract_evidence") {
    results.push(evaluateEvidenceQuality(stepRun.output.evidenceItems));
  }
  
  return results;
}
```

**Key point**: an In-run eval failure **does not necessarily block the Flow**, depending on guard mode. It **must still be recorded**, visible through Observability, and available to the Learning Loop.

### Post-run: End-to-End Quality Evaluation

After a Run ends—succeeded, failed, or canceled—the platform executes:

```typescript
PostRunEval.evaluate(run, flowVersion, preset) {
  const results = {
    artifact: evaluateArtifacts(run.artifactVersions),
    evidence: evaluateEvidenceBundle(run.evidenceBundle),
    trajectory: evaluateTrajectory(run.stepRuns),
    cost: evaluateCostEfficiency(run.costUsd, preset.policy.budget),
    latency: evaluateLatency(run.stepRuns),
    userFeedback: await collectUserFeedback(run.id)
  };
  
  // 計算綜合 Scorecard
  results.scorecard = computeScorecard(results);
  
  return results;
}
```

---

## The Core Scorecard: Quantifying Quality Across Ten Dimensions

```typescript
interface Scorecard {
  correctness: number;           // 0-1: 任務完成正確性（人工/自動評分）
  coverage: number;              // 0-1: 子問題覆蓋率、來源覆蓋率
  citation_quality: number;      // 0-1: 引用完整性、excerpt 相關性、conflict 處理
  schema_validity: number;       // 0-1: 所有 step/artifact 輸出符合 schema 比例
  policy_compliance: number;     // 0-1: Guard pass rate、approval 正確觸發率
  cost_efficiency: number;       // 0-1: 實際成本 / 預算、token 效率
  latency: number;               // 0-1: 總耗時 / maxRuntimeMs、step latency 分布
  tool_selection_accuracy: number; // 0-1: 工具選擇是否最優（對比 oracle）
  retry_recovery: number;        // 0-1: 失敗後 retry 成功率
  human_acceptance: number;      // 0-1: 用戶 approve/reject/regenerate 比例
}
```

**Every dimension has explicit calculation logic**; none is merely a subjective score. The system writes the Scorecard to `run.evaluation.scorecard`, and the Web UI visualizes its trends.

---

## Skill Release Quality Gates: Five Stages

```
SkillVersion Draft
    ↓
[1] Trigger Eval
    檢查：skill.yaml triggers.phrases/step_types 是否能正確識別適用場景
    輸入：trigger-cases.json (正/負樣本)
    → 失敗：trigger 不準確，阻擋發布
    ↓
[2] Functional Eval
    檢查：golden-cases.json 輸出是否符合預期
    包含：正常輸入、邊界輸入、異常輸入
    → 失敗：功能不正確，阻擋發布
    ↓
[3] Policy Eval
    檢查：permissions 是否合規、tool usage 是否超標、cost/latency 是否在預算
    → 失敗：違規，阻擋發布
    ↓
[4] Regression Eval
    檢查：跑所有 regression cases（來自真實失敗、user correction）
    → 失敗：引入回歸，阻擋發布
    ↓
[5] Human Review
    最後把關：審核 eval 結果、審核變更內容、確認無風險
    → 失敗：人工判定有風險，阻擋發布
    ↓
SkillVersion Published (status: "published")
```

**Failure at any stage keeps the Skill in `draft` status and records the failed gate**. The Web UI displays the exact cause.

### Skill Eval Configuration (skill.yaml)

```yaml
evals:
  trigger_cases: ./evals/trigger-cases.json      # [1] Trigger Eval
  golden_cases: ./evals/golden-cases.json        # [2] Functional Eval
  # [3] Policy Eval: 自動從 skill.yaml permissions + policy 衍生
  # [4] Regression Eval: 自動從平台 regression suite 衍生
  # [5] Human Review: 平台強制步驟
```

---

## Learning Loop: A Closed Loop from Run to Improvement

> **Core principle**: Agent can propose learning, but production knowledge requires eval and human approval.

### 1. Learning Signals: Eight Sources

| Signal | Trigger | Captured data |
|--------|---------|---------|
| `user_correction` | A user corrects or rejects content on an Evidence or Artifact page | Original claim or evidence, correction, and reviewer |
| `run_failed_then_succeeded` | The same Flow and inputs fail, then succeed on a rerun | Comparison between the two Runs and the steps with critical differences |
| `step_retry_succeeded` | A step succeeds after retry | Original error, retry parameters, and successful output |
| `verifier_failure` | A verifier finds coverage insufficient | Verifier output, evidence state, and gap analysis |
| `cost_outlier` | Cost exceeds the preset policy by 2x | Cost distribution, expensive steps, and provider details |
| `provider_failure` | The primary provider fails and fallback activates | Failed provider, fallback chain, and whether it succeeded |
| `high_tool_count` | One step exceeds the tool-call threshold | Tool sequence, parameters, and output |
| `manual_feedback` | A user submits feedback from the Improve page | Written feedback and suggestion type |

### 2. Signal → Proposal Flow

```
Run Completed
    ↓
Learning Candidate Detector (掃描所有 signals)
    ↓
Trace Summarizer (提取相關 stepRun/toolUsage/evidence/error)
    ↓
Proposal Generator (依 signal 類型產出四類提案之一)
    ↓
Human Review (Web UI: Improve 頁面)
    ↓
Sandbox Eval (用 historical runs 跑 proposal，對比 metric)
    ↓
Quality Gate (通過 output-schema、policy、regression evals)
    ↓
Publish (SkillVersion 升版 / Policy 更新 / EvalCase 入庫 / Memory 寫入)
```

### 3. Four Reviewable Proposal Types

| Proposal type | Source | Risk | Review flow |
|---------|------|------|---------|
| **MemoryUpdate** | Small preferences, conventions, and tool caveats | Low | Direct review → Apply |
| **SkillProposal** | Extract a new Skill from a trajectory or modify an existing Skill | Medium | Review → Sandbox Eval → Quality Gate → Publish new SkillVersion |
| **PolicySuggestion** | Repeated provider failures suggest fallback changes; tool usage needs limits; an approval gate is needed | Medium | Review → Sandbox Eval → Apply Policy Version |
| **EvalCase** | Convert a real failure into a regression test | Low | Review → Add to Regression Suite |

**Key point**: every Proposal **stops at pending review** and never takes effect automatically.

### 4. Converting a Real Run into an EvalCase

```typescript
// 用戶在 Web UI 點擊 "Convert to Eval Case"
createEvalCaseFromRun({ runId, stepRunId, description, expectedBehavior }) {
  // 1. 提取輸入
  const input = run.inputs;
  
  // 2. 提取期望行為（從成功的 retry 或人工修正）
  const expected = stepRun.output;  // 或用戶手動輸入
  
  // 3. 關聯 trace evidence
  const traceEvidence = {
    stepRuns: run.stepRuns.filter(s => s.stepId === stepRunId),
    evidenceItems: run.evidenceItems.filter(e => e.supportsStep === stepRunId),
    guardResults: run.guardResults.filter(g => g.stepRunId === stepRunId)
  };
  
  // 4. 建立 EvalCase Proposal（非直接入庫）
  return {
    type: "EvalCaseProposal",
    input,
    expected,
    traceEvidence,
    description,
    status: "pending_review"
  };
}
```

**After review approval** → add it to the Regression Suite → require it for every subsequent Skill or Flow version release.

---

## Eval Suite/Case/Run/Result Data Model

```typescript
// Eval Suite：一組相關的 eval cases
interface EvalSuite {
  id: string;
  name: string;              // "deep_research_regression"
  description: string;
  targetType: "flow" | "skill" | "artifact" | "evidence" | "policy";
  targetRef: string;         // "deep_research@v1" 或 "citation-extractor@1.0.0"
  required: boolean;         // true = 發布門檻必跑
  createdAt: string;
}

// Eval Case：單一測試案例
interface EvalCase {
  id: string;
  suiteId: string;
  name: string;
  input: any;                // 輸入參數
  expected: any;             // 期望輸出/行為
  traceEvidence?: TraceRef;  // 來源 run/step 追溯
  tags: string[];            // "regression", "edge_case", "golden"
  status: "draft" | "active" | "archived";
  createdAt: string;
}

// Eval Run：一次評測執行
interface EvalRun {
  id: string;
  suiteId: string;
  targetVersion: string;     // 被測版本
  caseResults: EvalCaseResult[];
  aggregateMetrics: Scorecard;
  status: "running" | "completed" | "failed";
  startedAt: string;
  endedAt: string;
}

// Eval Case Result：單案例結果
interface EvalCaseResult {
  caseId: string;
  status: "passed" | "failed" | "error";
  actualOutput: any;
  metrics: { correctness, coverage, citation_quality, ... };
  error?: ErrorInfo;
  durationMs: number;
}
```

---

## Sandbox Eval: Validating Proposals in Isolation

```typescript
async function runSandboxEval(proposal, historicalRuns) {
  // 1. 建立沙箱環境（隔離的 runtime、臨時 skill/policy/memory）
  const sandbox = createSandbox({
    skillVersions: proposal.skillChanges,
    policyVersion: proposal.policyChanges,
    memoryItems: proposal.memoryChanges
  });
  
  // 2. 對 historical runs 重放（相同 inputs）
  const results = [];
  for (const run of historicalRuns) {
    const sandboxRun = await sandbox.executeFlow(run.flowId, run.presetId, run.inputs);
    results.push(compareRuns(run, sandboxRun));
  }
  
  // 3. 聚合對比指標
  return {
    scorecardDelta: aggregateScorecards(results),
    regressionCheck: checkNoRegressions(results),
    improvementCheck: checkImprovements(results),
    costDelta: aggregateCostDelta(results),
    latencyDelta: aggregateLatencyDelta(results)
  };
}
```

**Sandbox properties**:

- Isolated runtime that does not affect production data
- A/B comparisons using historical Runs (old version versus the version with the Proposal applied)
- Detailed comparison reports for Human Review

---

## Regression Prevention: How the Immune System Works

```
真實 Run 失敗
    ↓
用戶修正（retry-step / 修改輸入 / 人工干預）
    ↓
Run 最終成功
    ↓
Learning Loop 捕獲 "run_failed_then_succeeded" signal
    ↓
產生 EvalCase Proposal（含失敗→成功的關鍵差異）
    ↓
Human Review 確認：這是真實 bug 修復，不是運氣
    ↓
加入 Regression Suite（標記 required: true）
    ↓
後續所有 SkillVersion/FlowVersion 發布前
    → 必跑此 Regression Case
    → 失敗 = 阻擋發布
```

**Effect**: the same class of bug **can never be released to production again**.

---

## Web UI: Evaluation & Improve Interfaces

| Page | Function | Data source |
|------|------|--------|
| **Evaluations** | Eval Suite list, execution history, Scorecard trends, and Case details | EvalSuite + EvalRun + EvalCaseResult |
| **Skill Eval** | Skill release pipeline: Trigger, Functional, Policy, Regression, and Human status | SkillVersion + EvalRun (target=skill) |
| **Improve** | Learning Proposal list: Memory, Skill, Policy, and EvalCase, with status tracking | LearningSignal + Proposal + SandboxEvalResult |
| **Regression** | Regression Suite management, Case browsing, creation, and archiving | EvalSuite (targetType=regression) |

---

## Common Pitfalls and Best Practices

| Pitfall | Correct approach |
|------|----------|
| Run only Post-run evals, with no Pre-run or In-run checks | **Cover all three stages**: Pre-run blocks invalid Runs, In-run exposes problems immediately, and Post-run computes an overall score |
| Hard-code Eval Cases, forcing test-code changes whenever the Flow changes | **Store Eval Cases as data**: keep them in the database, version them, manage them in the Web UI, and convert Runs into Cases with one action |
| Maintain no Regression Suite, allowing upgrades to break behavior silently | **Enforce a Regression Gate**: all releases must run required suites, and any failure blocks release |
| Test only Skill functionality before release, ignoring policy and cost | **Run all five gates**: Trigger → Functional → Policy → Regression → Human; none is optional |
| Let the Learning Loop write directly to production Memory or Skills | **Use Proposals**: Agent proposal → Human Review → Sandbox Eval → Quality Gate → Publish |
| Use vague Scorecard metrics that cannot be computed automatically | **Define all ten dimensions explicitly and make them computable**; only correctness and human_acceptance require human scoring |

---

## Summary: Core Contracts of the Evaluation System

```
Eval Suite (versioned, target: flow/skill/artifact/evidence/policy/regression)
    → Eval Cases (input, expected, traceEvidence, tags)
    
Pre-run Eval:   Flow/skill/policy/provider binding 驗證 → 阻擋無效 run
In-run Eval:    Step boundary: schema/policy/citation/coverage/budget → 記錄 GuardResult
Post-run Eval:  Artifact/Evidence/Trajectory/Cost/Latency/Feedback → Scorecard

Scorecard (10 dims): correctness, coverage, citation_quality, schema_validity,
                     policy_compliance, cost_efficiency, latency, tool_selection_accuracy,
                     retry_recovery, human_acceptance

Skill Publish Gate (5 stages, any fail = block):
    Trigger Eval → Functional Eval → Policy Eval → Regression Eval → Human Review
    
Learning Loop:
    Run → Signals (8 types) → Trace Summarizer → Proposals (4 types)
    → Human Review → Sandbox Eval (A/B vs historical) → Quality Gate → Publish
    
Regression Prevention:
    Real failure → User correction → Success → EvalCase Proposal
    → Review → Regression Suite (required) → All future publishes must pass
```

**Three invariants**:

1. **Eval is embedded in execution**—Pre-run, In-run, and Post-run, not added afterward
2. **Quality Gates enforce release blocks**—a failing Skill draft cannot be published, with no exceptions
3. **Learning never takes effect automatically**—every improvement passes Human Review, Sandbox Eval, and a Quality Gate

---

## References

- [Agent Platform: Evaluation Learning Loop Spec](https://github.com/vincentxuu/agent-platform/blob/main/openspec/specs/evaluation-learning-loop/spec.md)
- [Agent Gateway Plan - Evaluation System](https://github.com/vincentxuu/agent-platform/blob/main/agent-gateway-plan.md#45-evaluation-system)
- [Agent Gateway Plan - Learning Loop](https://github.com/vincentxuu/agent-platform/blob/main/agent-gateway-plan.md#44-learning-loop)
- [Agent Gateway Plan - Skill System](https://github.com/vincentxuu/agent-platform/blob/main/agent-gateway-plan.md#43-skill-system) (Skill release gate)
- [OpenSpec Specs](https://github.com/vincentxuu/agent-platform/tree/main/openspec/specs) — complete definitions of the seven core capabilities
