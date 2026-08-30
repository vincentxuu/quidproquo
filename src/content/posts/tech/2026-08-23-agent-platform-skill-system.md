---
title: "Agent Platform 深度解析（三）— Skill System：版本化能力包、顯式綁定與 Learning Loop 閉環"
date: 2026-08-23
category: tech
tags: ["ai-agent", "skill-system", "learning-loop", "agent-platform", "evaluation", "versioning"]
lang: zh-TW
description: "Agent Platform Skill System 深度解析：skill.yaml + SKILL.md 雙檔架構、四層漸進式揭露、FlowStep 顯式綁定 `@version`、Invocation 完整追蹤、內建四大 Deep Research skills，以及 Learning Loop 從 signal 到 proposal 再到 eval gate 的閉環機制。"
tldr: "Skill = 可版本化、可安裝、可審計的能力包。雙檔架構分離 metadata 與指令，顯式綁定替代模型路由，invocation 全記錄。Learning Loop 從 run 產生 signal → proposal → sandbox eval → human review → publish，嚴守「Agent 提案、人類審核、Eval 閘門」原則。"
---
> 🌏 [English version](/posts/tech/2026-08-23-agent-platform-skill-system-en)

tags: ["ai-agent", "skill-system", "learning-loop", "agent-platform", "evaluation", "versioning", "skill-package", "progressive-disclosure"]
## TL;DR

Skill System 是 Agent Platform 的**「方法論層」**，解決「怎麼穩定完成某類工作」：
- **雙檔架構**：`skill.yaml`（metadata/版本/權限/eval）+ `SKILL.md`（執行指令），分離平台管理與執行邏輯
- **四層漸進式揭露**：L1 `skill.yaml` 永遠可掃描 → L2 `SKILL.md` step 確認用時載入 → L3 `references/` `scripts/` `assets/` 執行需求時載入
- **顯式綁定**：FlowStep 寫 `uses: citation-extractor@1.0.0`，**不依賴模型自行決定載入哪個 skill**
- **Invocation 追蹤**：每次呼叫記錄 skillVersionId、input/output ref、permission decisions、tool usage、duration、error
- **內建 4 大 Skills**：research-planner、source-ranker、citation-extractor、report-synthesizer，驗證完整 Deep Research 循環
- **Learning Loop 閉環**：run 完成 → signal 捕獲 → proposal 生成 → human review → sandbox eval → quality gate → publish

---

## 為什麼需要 Skill System？

傳統 agent 框架把「prompt」、「tool」、「workflow」混在一起：
- Prompt 寫在代碼裡，難版本化、難審計、難複用
- 模型自己決定「要不要用這個工具、怎麼用」，不可控
- 沒有「能力包」概念，無法跨 flow 複用「研究規劃」、「證據抽取」等方法論

Agent Platform 把**「任務編排」（Flow）**與**「能力包」（Skill）」分離：

| 層級 | 責任 | 例子 |
|------|------|------|
| **Flow** | 任務編排：什麼步驟、怎麼串、什麼條件分支 | Deep Research 10 步驟 DAG |
| **Skill** | 能力包/方法論：怎麼穩定完成某類工作 | citation-extractor：怎麼從來源抽取 claims+citations |
| **MCP** | 工具與資料源連接：統一介面 | web_search、browser.fetch、reader.read |
| **Policy** | 成本、權限、驗證、人類審核 | max_cost_usd、approval_gate |

**Skill 不是 Flow，也不是 MCP Tool，更不是 A2A**。它是**「可安裝、可版本化、可觸發、可審計的程序性知識封裝」**。

---

## Skill Package 結構：雙檔架構

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

### skill.yaml：平台端 metadata

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

**必填欄位**：`id`、`name`、`version`、`description`、`permissions`、`evals`

### SKILL.md：執行端指令

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

這就是**給模型看的系統提示詞**。平台在 step 執行時，將 `SKILL.md` 內容注入 context，模型按指令產出結構化輸出。

> **關鍵分離**：`skill.yaml` 給平台工具（registry、validator、router、eval runner）看；`SKILL.md` 給模型看。兩者職責正交，互不干擾。

---

## 四層漸進式揭露

為了不把所有 skill 內容一次塞進 context（token 爆炸、洩露實作細節），採用分層載入：

| 層級 | 內容 | 載入時機 | 用途 |
|------|------|----------|------|
| **L1: skill.yaml** | metadata、permissions、evals、schemas | Registry 掃描、flow validation、skill router 判斷 relevance | 永遠可見，**不載入指令內容** |
| **L2: SKILL.md** | 執行指令（系統提示詞） | FlowStep 確認 `uses: skill@version` 時 | 只有要用時才載入 |
| **L3: references/** | 領域知識、schema 定義、規則文檔 | SKILL.md 明確 `@reference` 且執行需要時 | 按需載入 |
| **L3: scripts/** | 驗證/轉換腳本 | 評測階段、artifact 生成階段 | 離線/批次執行 |
| **L3: assets/** | 模板、範例 | SKILL.md 指向時 | 產出 artifact 時 |
| **L3: evals/** | trigger/golden cases | 評測執行時 | CI/CD、publish gate |

**效果**：一個擁有 50 個 skills 的平台，流程執行時只載入**該流程綁定的 3-5 個 skills 的 L1+L2**，其他完全不進 context。

---

## 顯式綁定：FlowStep 宣告 `uses: skill@version`

```yaml
# FlowDefinition.steps 片段
steps:
  - id: extract_evidence
    type: agent
    uses: citation-extractor@1.0.0    # 顯式綁定版本
    input:
      sources: "{{steps.read_sources.output}}"
```

**為什麼不讓模型自己決定用哪個 skill？**

| 模型路由 | 顯式綁定 |
|---------|---------|
| 不可預測：同輸入可能選不同 skill | 確定性：同 flow version 永遠用同 skill version |
| 難審計：為什麼這步用了那個 skill？ | 完整追蹤：step 宣告、registry 解析、invocation 記錄 |
| 難測試：無法固定行為 | 可測試：eval case 針對特定 skill version |
| 升級風險：模型可能突然換行為 | 受控升級：flow 發布新版本時才升級 skill binding |

**生產流程原則**：FlowStep 以 **explicit binding 為主、router trigger 為輔**。Router 只在「未綁定 skill 的通用步驟」或「探索性階段」建議。

---

## Invocation Tracking：完整審計軌跡

每次 skill 執行，`SkillRegistry.recordInvocation` 記錄：

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

**Web UI「步驟詳情」頁面直接讀這個記錄**，顯示：
- 用了哪個 skill version
- 允許了哪些工具、實際呼叫了哪些
- 輸入/輸出引用（可點進去看原始資料）
- 耗時、成本、錯誤

---

## 內建四大 Deep Research Skills

| Skill | 步驟 | 輸入 | 輸出關鍵欄位 | Permissions | Evals |
|-------|------|------|-------------|-------------|-------|
| **research-planner** | `clarify`、`plan` | topic、audience、freshness、brief | `subquestions[]`、`search_plan`、`stopping_conditions` | `provider:llm` | trigger、output-schema |
| **source-ranker** | `rank_sources` | `sources[]`、`subquestion` | `ranked_sources[]`（含 relevance/authority/freshness 分數） | `provider:llm` | output-schema |
| **citation-extractor** | `extract_evidence` | `source_contents[]` | `evidence_items[]`（claim、excerpt、source_ref、citation_status、confidence、conflicts） | `provider:llm`、`reader:read` | output-schema、citation-quality |
| **report-synthesizer** | `synthesize` | `evidence_items[]`、`brief` | `draft_report`（Markdown，claim 保留 evidence ID 連結） | `provider:llm` | output-schema、artifact-format |

這四個 skills 串起完整研究閉環：**規劃 → 搜尋 → 排序 → 讀取 → 抽取證據 → 綜合 → 驗證 → 產出**。

---

## Learning Loop：從 Run 到 Improvement 的閉環

> **核心原則**：Agent can propose learning, but production knowledge requires eval and human approval.

### 1. Learning Signals（學習訊號來源）

| Signal | 觸發條件 | 範例 |
|--------|----------|------|
| `user_correction` | 使用者在 Evidence/Artifact 頁面修正、拒絕 | 使用者標記某 claim 「引用錯誤」 |
| `run_failed_then_succeeded` | 同 flow、同輸入，先失敗後重跑成功 | retry-step 後通過 |
| `step_retry_succeeded` | 某步驟 retry 後成功 | search 步驟第 2 次嘗試成功 |
| `verifier_failure` | verifier 判定 coverage insufficient | verify 輸出 `coverage_insufficient: true` |
| `cost_outlier` | 成本超過 preset policy 2x | Deep Research 跑了 $15（preset max $8） |
| `provider_failure` | 主要 provider 失敗、fallback 生效 | Tavily 失敗、fallback 到 Exa |
| `high_tool_count` | 單步驟 tool 呼叫超過閾值 | search 步驟呼叫 20+ 次 API |
| `manual_feedback` | 使用者在 Improve 頁面主動提交 | 「這個 flow 需要加入 PDF 解析」 |

### 2. 從 Signal 到 Proposal 的流程

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

### 3. 四類可審核提案

| 提案類型 | 來源 | 風險等級 | 審核流程 |
|---------|------|---------|---------|
| **MemoryUpdate** | 小型偏好、專案慣例、工具注意事項 | 低 | 直接 review → apply |
| **SkillProposal** | 從成功/失敗 trajectory 提取新 skill、或修改既有 skill | 中 | review → sandbox eval → quality gate → publish new SkillVersion |
| **PolicySuggestion** | provider 常失敗建議調整 fallback、某 tool 需加限制、某 flow 需要 approval gate | 中 | review → sandbox eval → apply policy version |
| **EvalCase** | 真實失敗案例轉 regression test | 低 | review → 加入 regression suite |

**關鍵**：**所有提案都停在「待審核」狀態，不自動生效**。這避免了「模型幻覺產生的錯誤規則污染生產環境」。

### 4. Skill 發布 Quality Gate

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

**任何一關失敗 = 保持 draft 狀態，記錄失敗 gate**。這是 Skill 系統的「免疫系統」。

---

## 實作細節：SkillRegistry 核心 API

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

**InvocationContext 內容**：
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

Step handler 拿到這個 context，組裝 prompt 給模型，模型產出 → 驗證 outputSchema → 寫入 stepRun.output → `recordInvocation`。

---

## 常見陷阱與最佳實踐

| 陷阱 | 正確做法 |
|------|----------|
| 把業務邏輯寫在 SKILL.md 裡（如具體 API 呼叫） | SKILL.md 只寫**「做什麼、輸出什麼格式、遵守什麼原則」**；具體工具調用由 handler + MCP 處理 |
| 不寫 `output_schema`，靠模型自由發揮 | **必填 `output_schema`**，eval gate 會驗證，下游 step 依賴結構化輸出 |
| Skill 之間互相依賴（A 呼叫 B） | **Skill 不互相呼叫**；Flow 負責編排，Skill 只負責單一能力 |
| 升級 skill 時不跑 eval 直接發布 | **務必跑全套 eval**，Regression case 專門防這種回歸 |
| 把「提示詞工程」當成 Skill | Skill = 方法論 + 權限 + 評測 + 版本；單純 prompt template 不算 skill |

---

## 總結：Skill System 的核心契約

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

**三大不變量**：
1. **SkillVersion 不可變** —— 發布後不修改，升級發新版本
2. **顯式綁定勝過隱式路由** —— 生產 flow 必須宣告 `uses: skill@version`
3. **學習不自動生效** —— 所有改進經過 Human Review + Eval Gate

---

## 參考資料

- [Agent Platform: Skill Packages Spec](https://github.com/vincentxuu/agent-platform/blob/main/openspec/specs/skill-packages/spec.md)
- [Agent Platform: Evaluation & Learning Loop Spec](https://github.com/vincentxuu/agent-platform/blob/main/openspec/specs/evaluation-learning-loop/spec.md)
- [Skill Registry Implementation](https://github.com/vincentxuu/agent-platform/blob/main/packages/runtime/src/skill-packages.ts)
- [Built-in Skills](https://github.com/vincentxuu/agent-platform/tree/main/skills) — citation-extractor、source-ranker、research-planner、report-synthesizer
- [Agent Gateway Plan - Skill System](https://github.com/vincentxuu/agent-platform/blob/main/agent-gateway-plan.md#43-skill-system)
- [Agent Gateway Plan - Learning Loop](https://github.com/vincentxuu/agent-platform/blob/main/agent-gateway-plan.md#44-learning-loop)
