---
title: "Agent Platform 深度解析（七）— Evaluation & Quality Gates：全維度評測、Regression Prevention 與技能發布免疫系統"
date: 2026-08-23
category: tech
tags: ["ai-agent", "evaluation", "quality-gates", "regression-testing", "skill-publishing", "agent-platform"]
lang: zh-TW
description: "Agent Platform Evaluation System 深度解析：7 類 Eval（Flow/Step/Skill/Artifact/Evidence/Policy/Regression）、三種執行時機（Pre-run/In-run/Post-run）、核心 Scorecard 10 維度、Skill 發布 Quality Gate 五關、Learning Loop 從 Signal 到 Proposal 的閉環、Eval Case 從真實 Run 轉化、Quality Gate 強制阻擋不合格發布。"
tldr: "Evaluation 是 Agent Platform 的「品質免疫系統」：不只是事後統計，而是內建於執行流程的 Pre-run/In-run/Post-run 三階段把關。7 類 Eval 全覆蓋 Flow→Step→Skill→Artifact→Evidence→Policy→Regression。Skill 發布必須通過 Trigger→Functional→Policy→Regression→Human Review 五關，任一失敗即阻擋。Learning Loop 從 Run 捕獲 Signal → 產生 Proposal → Human Review → Sandbox Eval → Quality Gate → Publish，嚴守「Agent 提案、人類審核、Eval 閘門」鐵律。"
---

## TL;DR

Evaluation System 是 Agent Platform 的**「品質控制層」**，而非事後報表：
- **7 類 Eval**：Flow、Step、Skill、Artifact、Evidence、Policy、Regression —— 全生命週期覆蓋
- **三階段執行**：Pre-run（binding 驗證）→ In-run（step boundary schema/policy/citation/coverage/budget）→ Post-run（artifact/evidence/trajectory/cost/latency/feedback）
- **10 維 Scorecard**：correctness、coverage、citation_quality、schema_validity、policy_compliance、cost_efficiency、latency、tool_selection_accuracy、retry_recovery、human_acceptance
- **Skill 發布五關**：Trigger Eval → Functional Eval → Policy Eval → Regression Eval → Human Review，**任一失敗 = 保持 draft 狀態**
- **Learning Loop 閉環**：Run 完成 → Signal 捕獲 → Proposal 生成 → Human Review → Sandbox Eval → Quality Gate → Publish
- **Regression Prevention**：真實失敗案例 → EvalCase Proposal → Review → 加入 Regression Suite → 後續版本必跑

---

## 為什麼需要系統級 Evaluation？

大多數 agent 框架的 evaluation 是事後想法：
- 跑幾個測試案例、看看輸出「感覺不錯」就發布
- 沒有 regression suite，升級 prompt/model 後舊功能悄悄壞掉
- 沒有把評測整合進發布流程，品質門檻靠人工把關
- Evidence quality、citation coverage 沒有量化指標

Agent Platform 把 Evaluation 做成**平台級基礎設施**，內建於 runtime：

| 傳統做法 | Agent Platform |
|---------|----------------|
| Ad-hoc scripts、notebooks | 結構化 Eval Suite/Case/Run/Result，版本化管理 |
| 只測最終輸出 | 7 類 Eval 橫跨 Flow/Step/Skill/Artifact/Evidence/Policy |
| 發布前手動跑測試 | **Quality Gate 強制阻擋**：Skill draft 失敗即不可發布 |
| 失敗案例丟棄或只在 issue 討論 | **自動轉化為 Regression Case**，入庫必跑 |
| 無法量化「這版比上版好嗎」 | Scorecard 10 維度、歷史趨勢、Sandbox A/B 對比 |

---

## 7 類 Evaluation：全維度覆蓋

| Eval 類型 | 評估對象 | 核心問題 | 典型 Metric |
|-----------|---------|---------|------------|
| **Flow Eval** | 整條 workflow | 是否完成任務？品質/成本是否符合 preset？ | task_completion_rate、preset_quality_pass、cost_within_budget |
| **Step Eval** | 單一步驟 | 輸出符合 schema？可被下游使用？ | schema_validity、downstream_compatibility |
| **Skill Eval** | 能力包 | Trigger 正確？功能正確？Output schema？Tool permissions？Cost/latency？ | trigger_accuracy、functional_correctness、output_schema_pass、tool_permission_pass、cost_latency_within_budget |
| **Artifact Eval** | 最終產出 | 完整性？格式？可讀性？可採用性？ | completeness、format_validity、readability、adoption_rate |
| **Evidence Eval** | 證據鏈 | Citation coverage？Claim-to-source mapping？Excerpt validity？Conflict detection？Source freshness？ | citation_coverage、claim_source_mapping_rate、excerpt_validity、conflict_detection_rate、stale_source_rate |
| **Policy Eval** | 策略執行 | Budget/allowlist/permission/approval/external write 是否正確執行？ | budget_enforcement_rate、allowlist_compliance、approval_gate_triggered、external_write_blocked |
| **Regression Eval** | 歷史失敗 | 真實失敗案例、user correction、verifier failure 是否仍復現？ | regression_pass_rate、fixed_cases_stay_fixed |

---

## 三階段執行時機：把關前移

### Pre-run：靜態驗證（Run 創建前）

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

**失敗即阻擋 Run 創建**，不浪費資源。

### In-run：Step Boundary 即時驗證

每個 step 完成時，自動執行：

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

**關鍵**：In-run eval 失敗**不一定阻擋流程**（視 guard mode），但**必須記錄**，Observability 可見、Learning Loop 可捕獲。

### Post-run：全流程品質評估

Run 結束後（succeeded/failed/canceled），執行：

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

## 核心 Scorecard：10 維度量化品質

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

**每個維度都有明確計算邏輯**，不是主觀打分。Scorecard 寫入 `run.evaluation.scorecard`，Web UI 可視化趨勢圖。

---

## Skill 發布 Quality Gate：五關斬將

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

**任何一關失敗 = 保持 `draft` 狀態，記錄失敗 gate**，Web UI 顯示具體失敗原因。

### Skill Eval 配置（skill.yaml）

```yaml
evals:
  trigger_cases: ./evals/trigger-cases.json      # [1] Trigger Eval
  golden_cases: ./evals/golden-cases.json        # [2] Functional Eval
  # [3] Policy Eval: 自動從 skill.yaml permissions + policy 衍生
  # [4] Regression Eval: 自動從平台 regression suite 衍生
  # [5] Human Review: 平台強制步驟
```

---

## Learning Loop：從 Run 到 Improvement 的閉環

> **核心原則**：Agent can propose learning, but production knowledge requires eval and human approval.

### 1. Learning Signals（8 類訊號來源）

| Signal | 觸發條件 | 捕獲內容 |
|--------|---------|---------|
| `user_correction` | 使用者在 Evidence/Artifact 頁面修正/拒絕 | 原 claim/evidence、修正內容、reviewer |
| `run_failed_then_succeeded` | 同 flow+inputs，先失敗後重跑成功 | 兩次 run 對比、關鍵差異步驟 |
| `step_retry_succeeded` | 某步驟 retry 後成功 | 原錯誤、retry 參數、成功輸出 |
| `verifier_failure` | verifier 判定 coverage insufficient | verifier 輸出、evidence state、缺口分析 |
| `cost_outlier` | 成本超過 preset policy 2x | 成本分佈、昂貴步驟、provider 明細 |
| `provider_failure` | 主要 provider 失敗、fallback 生效 | 失敗 provider、fallback 鏈、成功與否 |
| `high_tool_count` | 單步驟 tool 呼叫超過閾值 | tool 序列、參數、輸出 |
| `manual_feedback` | 使用者在 Improve 頁面主動提交 | 文字反饋、建議類型 |

### 2. Signal → Proposal 流程

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

### 3. 四類可審核提案

| 提案類型 | 來源 | 風險 | 審核流程 |
|---------|------|------|---------|
| **MemoryUpdate** | 小型偏好/慣例/工具注意事項 | 低 | Direct review → Apply |
| **SkillProposal** | 從 trajectory 提取新 skill、修改既有 skill | 中 | Review → Sandbox Eval → Quality Gate → Publish new SkillVersion |
| **PolicySuggestion** | Provider 常失敗建議調整 fallback、tool 需限制、需要 approval gate | 中 | Review → Sandbox Eval → Apply Policy Version |
| **EvalCase** | 真實失敗案例轉 regression test | 低 | Review → 加入 Regression Suite |

**關鍵**：所有提案**停在「待審核」**，不自動生效。

### 4. EvalCase 從真實 Run 轉化

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

**審核通過後** → 加入 Regression Suite → 後續所有 Skill/Flow 版本發布必跑。

---

## Eval Suite/Case/Run/Result 資料模型

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

## Sandbox Eval：隔離環境驗證 Proposal

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

**Sandbox 特性**：
- 隔離 runtime，不影響生產數據
- 用歷史 runs 做 A/B 對比（舊版 vs 應用 proposal 後）
- 產出詳細對比報告，Human Review 時參考

---

## Regression Prevention：免疫系統運作

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

**效果**：同類 bug **永遠不會再次發布到生產**。

---

## Web UI：Evaluation & Improve 介面

| 頁面 | 功能 | 數據源 |
|------|------|--------|
| **Evaluations** | Eval Suite 列表、執行歷史、Scorecard 趨勢、Case 詳情 | EvalSuite + EvalRun + EvalCaseResult |
| **Skill Eval** | Skill 發布管道：Trigger/Functional/Policy/Regression/Human 狀態 | SkillVersion + EvalRun (target=skill) |
| **Improve** | Learning Proposals 列表：Memory/Skill/Policy/EvalCase、狀態追蹤 | LearningSignal + Proposal + SandboxEvalResult |
| **Regression** | Regression Suite 管理、案例瀏覽、新增/封存 | EvalSuite (targetType=regression) |

---

## 常見陷阱與最佳實踐

| 陷阱 | 正確做法 |
|------|----------|
| 只做 Post-run eval，Pre/In-run 沒把關 | **三階段全覆蓋**：Pre-run 阻擋無效 run、In-run 即時暴露問題、Post-run 綜合評分 |
| Eval case 寫死在代碼，改流程要改測試 | **Eval Case 數據化**：存 DB、版本化、Web UI 管理、從 Run 一鍵轉化 |
| 沒有 Regression Suite，升級後悄悄壞掉 | **強制 Regression Gate**：所有發布必跑 required suites，失敗即阻擋 |
| Skill 發布只跑功能測試，不檢查 policy/cost | **五關全跑**：Trigger→Functional→Policy→Regression→Human，缺一不可 |
| Learning Loop 直接寫入生產記憶/技能 | **Proposal 機制**：Agent 提案 → Human Review → Sandbox Eval → Quality Gate → Publish |
| Scorecard 指標模糊、無法自動計算 | **10 維度明確定義、可自動計算**，人工只打 correctness/human_acceptance |

---

## 總結：Evaluation System 核心契約

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

**三大不變量**：
1. **Eval 內建於執行流程** —— Pre/In/Post 三階段，不是事後補充
2. **Quality Gate 強制阻擋** —— Skill draft 失敗即不可發布，零例外
3. **學習不自動生效** —— 所有改進經過 Human Review + Sandbox Eval + Quality Gate

---

## 參考資料

- [Agent Platform: Evaluation Learning Loop Spec](https://github.com/vincentxuu/agent-platform/blob/main/openspec/specs/evaluation-learning-loop/spec.md)
- [Agent Gateway Plan - Evaluation System](https://github.com/vincentxuu/agent-platform/blob/main/agent-gateway-plan.md#45-evaluation-system)
- [Agent Gateway Plan - Learning Loop](https://github.com/vincentxuu/agent-platform/blob/main/agent-gateway-plan.md#44-learning-loop)
- [Agent Gateway Plan - Skill System](https://github.com/vincentxuu/agent-platform/blob/main/agent-gateway-plan.md#43-skill-system) (Skill 發布 gate)
- [OpenSpec Specs](https://github.com/vincentxuu/agent-platform/tree/main/openspec/specs) — 7 大能力規格完整定義