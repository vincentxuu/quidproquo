---
title: "OMP KDL rule tree 與 60+ providers routing：為什麼 provider 政策不寫在 TS 而寫在 KDL？"
date: 2026-08-31
category: tech
type: deep-dive
tags: [omp, kdl, rule-tree, provider-routing, compat-engine, architecture, typescript]
lang: zh-TW
series:
  name: "OMP 內部設計導讀"
  order: 7
tldr: "OMP 把 60+ 個 provider 的 routing、compat、thinking、quota 等政策全部寫在 KDL（taxonomy/classes/providers/runtime），編譯成 rules.json 再由 runtime engine 解析。這樣做的核心理由：分層所有權、編譯期驗證、規則優先級解決——三件事若用 TS 硬編碼會散在各處、難以驗證、優先級靠人眼。"
description: "深入 OMP 的 KDL rule tree 架構：taxonomy（identity 分類）、classes（lineage 真相）、providers（deployment contract）、runtime/behavior（heuristics）。解析 classifyModel() 如何做 identity 分類與 effort collapse，buildModel() 如何把 KDL 編譯成 rules.json，cascade resolver 如何用 (exactness, dimensions, priority) 解決規則衝突，以及 60+ providers 的 routing 邏輯如何用 rule tree 表達。"
draft: false
---

[OMP 內部設計導讀](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork)系列第 7 篇。前 6 篇拆解了 agent loop、append-only context、approval 三層、bash tokenized approval、四種 compaction 策略、hashline edit noop guard、provider quirks 與 session tree。這篇聚焦 **compat engine 的規則層**——為什麼 60+ providers 的所有 routing/compat/thinking/quota 政策不寫在 TS，而集中在一棵 KDL rule tree 裡。

---

## TL;DR

- **四層 KDL 所有權**：`taxonomy/*.kdl`（identity 分類）、`classes/*.kdl`（model lineage 真相）、`providers/*.kdl`（deployment contract）、`runtime/behavior.kdl`（heuristics）——各層職責互不重疊
- **為什麼不用 TS**：分層所有權讓不同角色（catalog maintainer vs provider integrator）只改各自層；編譯期驗證（未知 directive、重複 axis、ambiguity error）在 `bun run gen:compat` 就擋下；優先級用 `(exactness, dimensions, priority)` 元組機械比較，不用靠人眼讀 code
- **`classifyModel()`**：`provider + modelId → ModelIdentity{class, family, revision, effort, thinkingVariant, logicalId}`，走「reviewed override → suffix collapse → class/family/revision ranker」
- **`buildModel()` / `resolveModelPolicy()`**：KDL → `rules.json`（編譯產物）→ `resolveCascade(target)` 用 flat rule list + per-axis 獨立解析 + ambiguity 檢查
- **60+ providers routing**：`runtime/behavior.kdl` 的 `api-routes`、`quota-tiers`、`exclude-models`、`model-limits`、`pricing-peer` 等節點，用 `exact/prefix/substring/glob/token` matcher 表達；`behavior.ts` 提供 typed accessor（`apiRouteFor`、`quotaTierFor`、`isExcludedModel`…）

---

## 情境

你在維護一個支援 60+ 個 LLM provider（OpenAI、Anthropic、Google、OpenRouter、Cursor、GitHub Copilot、xAI、Bedrock、Vertex、Moonshot、DeepSeek、Qwen、GLM、MiniMax、Kimi、Ollama、LM Studio、vLLM、LiteLLM…）的 coding agent。每個 provider：

- 有自己的 API 格式（chat completions / responses / anthropic-messages / bedrock-converse / google-generative-ai…）
- 有自己的 model ID 命名慣例（`gpt-5.6`、`claude-opus-4-6`、`gemini-3-pro`、`kimi-k3`、`deepseek-v4-flash`…）
- 有自己的 reasoning/thinking 控制介面（effort / budget / adaptive / google-level…）
- 有自己的 quota tier、plan requirement、model limits、pricing、hosted default model
- 甚至同一個 model ID 在不同 provider 上走的 wire protocol 完全不同（例：`gpt-5.6` 在 OpenAI 走 Responses、在 OpenRouter 走 chat completions、在 GitHub Copilot 走 Responses、在 Cursor 走自家格式）

**怎麼在不寫 60 個 if-else 檔案的前提下，統一表達、驗證、解析這些政策？**

這就是 OMP 的 KDL rule tree 要解決的問題。

---

## 問題：TS 硬編碼會怎麼樣？

若把這些政策寫在 TS：

```typescript
// 假設的反面教材
function resolveCompat(provider: string, modelId: string): Compat {
  if (provider === "openai") {
    if (modelId.startsWith("gpt-5.6")) return { reasoningDisableMode: "none-effort", ... };
    if (modelId.startsWith("o3")) return { thinkingFormat: "openai", ... };
  }
  if (provider === "openrouter") {
    if (modelId.startsWith("anthropic/")) return { thinkingFormat: "openrouter", ... };
  }
  // ... 60 個 provider × N 條規則
}
```

會發生三類災難：

1. **所有權混亂**：catalog maintainer 想改 `gemini` 的 family 定義，provider integrator 想改 `google-vertex` 的 deployment contract，兩人改同一個 TS 檔，PR 冲突不斷
2. **驗證靠人眼**：`thinking-efforts "low" "medium" "high"` 寫錯成 `"hign"`、同一個 axis 在同一個 rule 被 assign 兩次、兩條 rule 同樣優先級爭同一個 axis——這些在 TS 裡是 runtime bug 或 silent override
3. **優先級隱性**：rule A 比 rule B 精確？還是 B 覆蓋更多 dimension？TS 裡只能靠「寫在後面蓋前面」或「人眼比對」——沒有機械可驗證的優先級語意

---

## 解法：四層 KDL 所有權

OMP 把規則拆成四層，**每層有清楚的擁有者與職責**，編譯器在 `bun run gen:compat` 靜態檢查，runtime 只讀編譯產物 `rules.json`。

### 第 1 層：`taxonomy/*.kdl` —— Identity 分類權威

**擁有者**：catalog maintainer（負責 model identity 正確性）

定義：
- **Class membership matchers**：`exact` (rank 4) > `bounded` (3) > `namespace` (2) > `prefix` (1) > `glob` (0)
- **Product families**：`family "flash" glob="*flash*"` + `priority`
- **Revision extraction**：`revision prefix="claude-"`、`skip-bare "o1" "o3"`
- **Reviewed identity overrides**：針對特定 `provider + model` 的精確修正（`logical`、`class`、`family`、`revision`、`effort`、`thinking-variant`）
- **Suffix collapse vocabulary**：`thinking-suffix`、`effort-suffix`、`effort-lane-suffix`、`routing-variant-suffix`、`effort-family`、`variant-family`、`pair-token`、`provider-alias`
- **Discovery vocabulary**：`recover-canonical-params`、`borrow-responses-route`、`billing-variant-suffix`、`trailing-marker`、`pro-reasoning-alias`、`canonical-family-token`…

**關鍵檔案**：
- `packages/catalog/src/compat/rules/taxonomy/openai.kdl` — OpenAI class 定義
- `packages/catalog/src/compat/rules/taxonomy/_collapse.kdl` — 共用 collapse vocabulary
- `packages/catalog/src/compat/rules/taxonomy/_discovery.kdl` — 共用 discovery vocabulary
- `packages/catalog/scripts/compat-compiler/compile-taxonomy.ts#compileTaxonomy` — 編譯入口

### 第 2 層：`classes/*.kdl` —— Model Lineage 真相

**擁有者**：catalog maintainer（針對 model lineage 的行為真相）

定義：**inherent to a model line**，可選擇性 scoped 到某些 providers（`on "provider-a" "provider-b"`）。

例：`classes/openai.kdl`
```kdl
class "openai" {
  family "gpt" {
    revision "<5.2" { thinking-efforts "minimal" "low" "medium" "high" }
  }
  family "codex" {
    revision "<5.2" { thinking-efforts "minimal" "low" "medium" "high" }
    revision "=5.1" { models "*codex-mini*" { thinking-efforts "medium" "high" } }
  }
  revision ">=5.2 <5.6" { thinking-efforts "low" "medium" "high" "xhigh" }
  revision ">=5.6" { thinking-efforts "low" "medium" "high" "xhigh" "max"; requires-reasoning-off-juice-instruction #true }
  family "codex" { revision ">=1" { limits-patch { context-window 272000 } } }
}
```

這層**不包含 provider-specific deployment 細節**——那是第 3 層的事。

**關鍵檔案**：
- `packages/catalog/src/compat/rules/classes/*.kdl`（20+ 檔）
- `packages/catalog/scripts/compat-compiler/compile-cascade.ts#compileCascade` — 同樣走 cascade compiler

### 第 3 層：`providers/*.kdl` —— Deployment Contract

**擁有者**：provider integrator（負責該 provider 的 deployment 行為）

定義：**behavior imposed by a host**，以及 taxonomy 無法精確表達的 per-model residue（需附 `// residue:` 註釋）。

例：`providers/openai.kdl`
```kdl
provider "openai" {
  thinking-mode "effort"
  class "unknown" {
    revision ">=5.6 <5.7" { reasoning-disable-mode "none-effort"; thinking-efforts "low" "medium" "high" "xhigh" "max" }
    revision ">=5 <6" { apply-patch-tool-type "freeform" }
  }
  models "codex-mini-latest" "gpt-realtime-2.1" { thinking-efforts "minimal" "low" "medium" "high" "xhigh" }
  class "openai" {
    family "gpt" { revision "=5.6" { reasoning-disable-mode "none-effort" } }
    revision ">=5 <6" { apply-patch-tool-type "freeform" }
  }
  models "daybreak-blue-latest" "gpt-5.6" "gpt-5.6-sol*" { long-context-cost { inputThreshold 272000 input 10.0 output 45.0 cacheRead 1.0 cacheWrite 12.5 } }
}
```

**關鍵檔案**：
- `packages/catalog/src/compat/rules/providers/*.kdl`（60+ 檔）
- 同樣走 `compileCascade`

### 第 4 層：`runtime/behavior.kdl` —— Heuristics（Exact Lookup 之前/之外）

**擁有者**：catalog maintainer + provider integrator 共同維護

定義：**用於 exact bundled-model lookup 之前或之外**的啟發式規則：

| 節點 | 用途 | 例 |
|---|---|---|
| `openai-responses-heuristic` | 發現的 OpenAI id 是否走 Responses API | `include-prefix "gpt-" "o1"` |
| `model-operations` | 發現的 model 額外支援的 operation | `operation "generate_image"` |
| `cursor-effort` | Cursor 的 effort-suffix sibling 解析 | `family-marker="gpt-"` |
| `quota-tiers` | Provider 的 quota scope/display tier | `tier "Flash" "gemini-2.5-flash"…` + `fallback "Flash" substring="flash"` |
| `hosted-default` | Model-less hosted operation 的預設 model | `provider="kimi-search" model="kimi-for-coding"` |
| `exclude-models` | 非 chat/unsupported SKU 排除 | `substring="embedding" substring="tts"` |
| `api-routes` | 發現的 model id 走哪個 wire API | `route "anthropic-messages" prefix="anthropic/" strip-prefix=#true` |
| `model-limits` | Context/max-token pin | `limits "gpt-5.6" context=272000 max-tokens=128000` |
| `plan-requirement` | Subscription tier requirement | `tier "pro" substring="-spark"` |
| `pricing-peer` | Cross-provider pricing alias | `peers="google" "google-vertex" "anthropic"` |

**關鍵檔案**：
- `packages/catalog/src/compat/rules/runtime/behavior.kdl`
- `packages/catalog/scripts/compat-compiler/compile-behavior.ts#compileBehavior`
- `packages/catalog/src/compat/behavior.ts` — Typed accessors（`apiRouteFor`、`quotaTierFor`、`isExcludedModel`、`modelLimitsFor`、`planRequirementFor`、`pricingPeerFor`、`hostedDefaultModel`、`modelOperationOverrides`、`cursorEffortSuffix`）

---

## 為什麼用 KDL？（三大理由）

### 1. 分層所有權

| 層 | 擁有者 | 改動頻率 | 衝突機率 |
|---|---|---|---|
| taxonomy | Catalog maintainer | 低（model identity 相對穩定） | 低 |
| classes | Catalog maintainer | 中（新 model generation） | 低 |
| providers | Provider integrator | 高（provider 端 API 變動） | 中 |
| runtime/behavior | 共同維護 | 中高（heuristics 需隨發現調整） | 中 |

**不同角色改不同資料夾**，PR 不會打架。`taxonomy/openai.kdl` 與 `providers/openai.kdl` 職責正交。

### 2. 編譯期驗證（`bun run gen:compat`）

`compat-compiler` 在編譯階段就會擋下：

- **Unknown directive / property** → `unknown directive \`typo-xxx\``
- **Duplicate axis in same block** → `axis \`thinking-efforts\` assigned twice in one block`
- **Ambiguous class/family match** → `ambiguous class for \`model-x\`: \`class-a\` and \`class-b\` tie`
- **Ambiguous cascade overlap** → `ambiguous overlap for \`provider/model\` on axis \`thinking-efforts\`: rules \`A\` and \`B\` tie; add an explicit priority`
- **Malformed value shape** → `directive \`thinking-efforts\` has a malformed value`
- **Missing required collapse/discovery** → `missing non-empty \`collapse\` definition`

這些在 TS 硬編碼裡只能靠 code review 或 runtime 發現。

### 3. 機械化優先級解決

Cascade resolver（`packages/catalog/src/compat/cascade.ts#resolveCascade`）對**每個 axis 獨立**解析，排名元組：

```text
(model-selector exactness, constrained-dimension count, priority)
```

- **Exactness**：`models` selector 有 exact match → 2；glob/token → 1；無 models selector → 0
- **Dimension count**：rule 涵蓋的維度數（class、provider/on、family、revision、models），越多越精確
- **Priority**：區塊上的 `priority=`（預設 0），僅用於**刻意**解決 equal-specificity overlap

**File order 和 declaration order 完全不參與比較**。兩條 rule 同元組爭同 axis → **編譯期直接報錯**，強迫作者加 `priority=` 或重寫 rule。

這比「寫在後面蓋前面」或「人眼判斷」嚴謹得多。

---

## `classifyModel()`：Identity 分類管線

`packages/catalog/src/compat/taxonomy.ts#classifyModel` 是 **provider + modelId → ModelIdentity** 的單一入口：

```typescript
export function classifyModel(
  provider: string,
  modelId: string,
  opts?: ClassifyOptions
): ModelIdentity
```

### 三階段管線

```
provider + modelId
       │
       ▼
┌──────────────────┐
│ 1. Reviewed      │  ── override id="..." provider="..." model="..." logical="..." class="..." family="..." revision="..." effort="..." thinking-variant=#true
│    override?     │     精確修正，provider-specific 勝過 agnostic，expires-at-ms 可過期
└────────┬─────────┘
         │ hit
         ▼
┌──────────────────┐
│ 2. Suffix        │  ── collapseVariantId(provider, model)
│    collapse      │     thinking-suffix / effort-suffix / effort-lane-suffix / routing-variant-suffix
│                  │     回傳 { logicalId, effort?, thinkingVariant }
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 3. Class/Family/ │  ── classifyRanks(logicalId)
│    Revision      │     matcher rank: (kindRank, tokenByteLength)
│    ranker        │     family rank: (priority, nonWildcardBytes)
│                  │     revision: prefix 解析 + skip-bare
└────────┬─────────┘
         │
         ▼
ModelIdentity { class, family?, revision?, effort?, thinkingVariant?, logicalId? }
```

### Matcher Rank 細節（`taxonomy.ts:42-48`）

```typescript
const MATCHER_RANK = {
  exact: 4,      // bare name 完全相等
  bounded: 3,    // bare name 等於 token 或 token + [-_.:0-9]
  namespace: 2,  // full id 的某個 /-segment 相等（或 bounded）
  prefix: 1,     // bare name startsWith token
  glob: 0,       // anchored * wildcard
};
```

**Tiebreak**：同 rank 時比 `token.length`（byte length），較長者勝。跨 class/family 同 rank → `AmbiguousIdentityError`。

### 實際例：`openai/gpt-5.6-luna` 怎麼分類？

1. **Override**？無
2. **Collapse**？無 suffix match
3. **Class matchers**（`taxonomy/openai.kdl:3-16`）：
   - `namespace "openai" bounded=#true` → rank (2, 5) ✓
   - `prefix "gpt-"` → rank (1, 4)
   - `exact "o1"` 等不 match
   → **class = "openai"**
4. **Families**（`taxonomy/openai.kdl:17-31`）：
   - `family "gpt" glob="gpt-*"` priority 0, nonWildcardBytes=4
   - `family "codex" glob="*codex*"` priority 10
   - `family "o-series" glob="o1"…` priority 0
   → **family = "gpt"**
5. **Revision**（`taxonomy/openai.kdl:33-37`）：
   - `revision prefix="gpt-" anywhere=#true` → 從 `gpt-5.6-luna` 抓 `5.6` → **revision = "5.6.0"**
6. 回傳：`{ class: "openai", family: "gpt", revision: "5.6.0", logicalId: "openai/gpt-5.6-luna" }`

---

## `buildModel()` / `resolveModelPolicy()`：KDL → Runtime Resolution

### 編譯流程：`bun run gen:compat`

```bash
cd packages/catalog
bun run gen:compat
# 實際跑：scripts/compile-compat.ts → scripts/compat-compiler/index.ts#compileCompatRules
```

**輸入**：`rules/taxonomy/*.kdl` + `rules/classes/*.kdl` + `rules/providers/*.kdl` + `rules/runtime/behavior.kdl`（共 103 個 .kdl 檔）

**輸出**：`src/compat/rules.json`（251KB，committed to git）

**編譯步驟**（`compat-compiler/index.ts:39-54`）：

```typescript
const [taxonomy, classes, providers, runtime] = await Promise.all([
  readGroup(rulesDir, "taxonomy"),
  readGroup(rulesDir, "classes"),
  readGroup(rulesDir, "providers"),
  readGroup(rulesDir, "runtime"),
]);
return {
  version: 1,
  files: [...].sort(),
  taxonomy: compileTaxonomy(taxonomy),      // → CompiledTaxonomy
  cascade: compileCascade([...classes, ...providers]), // → CompiledCascade (flat rule list)
  behavior: compileBehavior(behaviorSource), // → CompiledBehavior
};
```

**關鍵點**：
- `compileCascade` 把巢狀 KDL（`class → on → family → revision → models`）攤平成 **flat rule list**（`CompiledRule[]`），每條 rule 帶 `source: "file:line"` 診斷標籤
- `compileTaxonomy` 產出 `CompiledClass[]`、`CompiledCollapse`、`CompiledDiscovery`
- `compileBehavior` 產出 `CompiledBehavior`（typed accessors 直接吃這個）

### Runtime Resolution：`resolveModelPolicy(spec)`

`packages/catalog/src/compat/resolve.ts#resolveModelPolicy` 是 **單一 model spec 完整解析入口**：

```typescript
export function resolveModelPolicy<TApi extends Api>(spec: ModelSpec<TApi>): ResolvedModelPolicy<TApi>
```

**Layered resolution order**（文件頂部註解）：

1. **Unconditional per-API compat defaults**（`detectOpenAICompat` 等）
2. **Host-derived flags**：URL/provider detection via `hosts.ts`（`modelMatchesHost`），compound host×identity branches，**keyed on ModelIdentity fields，never on model-name matching**
3. **Compat-cascade axes** compiled from `rules/`（pure identity- and provider-keyed policy lives there, not here）
4. **Spec-authored sparse overrides**（`applyCompatOverrides`），then legacy fixups

**核心流程**：

```typescript
const identity = classifyModel(spec.provider, spec.id);  // ← taxonomy
const facts = new IdentityFacts(identity);
const axes = resolveCascade(buildResolveTarget(spec, identity)); // ← cascade
const compat = resolveOpenAICompatPolicy(spec, facts, axes);     // ← per-API detector + axes
const thinking = resolveThinkingPolicy(spec, facts, axes, compat);
return { identity, compat, thinking, catalog: axes.catalog };
```

### `resolveCascade(target)`：Per-Axis Independent Resolution

`packages/catalog/src/compat/cascade.ts#resolveOverIndex`：

```typescript
function resolveOverIndex(index: IndexedRule[], target: ResolveTarget): ResolvedAxes {
  const wire: WinnerTable = {};
  const thinking: WinnerTable = {};
  const catalog: WinnerTable = {};
  let reasoning = target.reasoning;
  // ... reasoning upgrade via exact-efforts rule ...
  for (const rule of index) {
    const rank = rankRule(rule, target, revision, modelLower);
    if (!rank) continue;
    contest(wire, rule.compiled.wire, rank, rule, target);
    contest(catalog, rule.compiled.catalog, rank, rule, target);
    if (reasoning) contest(thinking, rule.compiled.thinking, rank, rule, target);
  }
  return { wire: collect(wire), thinking: collect(thinking), catalog: collect(catalog) };
}
```

**關鍵設計**：

- **Per-axis 獨立**：wire/thinking/catalog 三組 winner table 完全分開，**不交叉干擾**
- **Rank function**（`rankRule`）：
  ```typescript
  // exactness: 2=exact models match, 1=glob/token, 0=no models selector
  // dimensions: class + provider + family + revision + models 計數
  // priority: rule.priority ?? 0
  return [exactness, dimensions, priority];
  ```
- **Contest**（`contest`）：同 axis 同 rank → `AmbiguousOverlapError`（編譯期就應該被擋下，但 runtime 再守一次）

---

## 60+ Providers Routing：Rule Tree 如何表達 Routing 邏輯

Routing 邏輯集中在 **`runtime/behavior.kdl`**，由 `behavior.ts` 的 typed accessors 解析。

### 1. API Routes：`apiRouteFor(provider, model)`

**KDL**：
```kdl
api-routes provider="cloudflare-ai-gateway" {
  route "anthropic-messages" prefix="anthropic/" strip-prefix=#true
  route "openai-completions" prefix="openai/" strip-prefix=#true
  route "openai-completions" prefix="workers-ai/" strip-prefix=#false
}
api-routes provider="github-copilot" default="openai-completions" {
  route "anthropic-messages" glob="claude-haiku-*" glob="claude-sonnet-*" glob="claude-opus-*"
  route "openai-responses" exact="grok-4.5" exact="grok-4.6" prefix="gpt-5" prefix="oswe" prefix="mai-"
}
api-routes provider="zenmux" default="openai-completions" {
  route "anthropic-messages" prefix="anthropic/"
}
```

**Runtime**（`behavior.ts:129-143`）：
```typescript
export function apiRouteFor(provider: string, model: string): ApiRouteMatch | undefined {
  const table = behavior.apiRoutes.find(candidate => candidate.provider === provider);
  if (!table) return undefined;
  const lower = model.toLowerCase();
  for (const route of table.routes) {
    if (!matchesList(route.match, model, lower)) continue;
    const out: ApiRouteMatch = { api: route.api };
    if (route.stripPrefix) {
      const prefix = route.match.prefix?.find(candidate => model.startsWith(candidate));
      if (prefix) out.requestModelId = model.slice(prefix.length);
    }
    return out;
  }
  return table.default !== undefined ? { api: table.default } : undefined;
}
```

**Matcher 支援**：`exact`、`prefix`、`substring`、`glob`、`token`（bounded by non-alphanumeric）。

### 2. Quota Tiers：`quotaTierFor(provider, model)`

**KDL**：
```kdl
quota-tiers provider="google-gemini-cli" {
  tier "3-Flash" "gemini-3-flash-preview" "gemini-3-flash" "gemini-3.5-flash"
  tier "Flash" "gemini-2.5-flash" "gemini-2.5-flash-lite" "gemini-2.0-flash" "gemini-1.5-flash"
  tier "Pro" "gemini-2.5-pro" "gemini-3-pro-preview" "gemini-3.1-pro-preview" ...
  fallback "Flash" substring="flash"
  fallback "Pro" substring="pro"
}
quota-tiers provider="openai-codex" {
  tier "spark" "gpt-5.3-codex-spark"
  tier "chat" "gpt-5.3-codex"
  fallback "spark" substring="-spark"
  fallback "chat" substring="gpt-"
}
```

**Runtime**：exact memberships 優先，fallback substring 保留新發現 id 的 quota 語意。

### 3. Exclude Models：`isExcludedModel(provider, model)`

**KDL**：
```kdl
exclude-models provider="nanogpt" substring="embedding" substring="image" substring="vision" ...
exclude-models provider="aimlapi" token="audio" token="embed" token="embedding" ...
exclude-models provider="siliconflow" substring="embedding" substring="reranker" substring="bge-" ...
exclude-models provider="amazon-bedrock" prefix="ai21.jamba" prefix="amazon.titan-text-express" ...
```

**Runtime**：`matchesList` 同 `apiRouteFor`。

### 4. Model Limits：`modelLimitsFor(provider, model)`

**KDL**：
```kdl
model-limits provider="github-copilot" {
  limits "claude-opus-4.6" context=168000 max-tokens=32000
  limits "gpt-5.2" context=272000 max-tokens=128000
}
model-limits provider="alibaba-token-plan" {
  limits "qwen3.6-plus" context=1000000 max-tokens=65536
  limits "deepseek-v4-flash" context=1000000 max-tokens=384000
}
```

### 5. Pricing Peer：`pricingPeerFor(provider, model)`

**KDL**：
```kdl
pricing-peer provider="google-antigravity" peers="google" "google-vertex" "anthropic" {
  alias "gemini-3-flash" peer-id="gemini-3-flash-preview"
  alias "claude-opus-4-6" peer-id="claude-opus-4-6@default"
}
pricing-peer provider="xai-oauth" peers="xai" {
  alias "grok-4.20-multi-agent-0309" peer-id="grok-4.20-multi-agent-beta-latest"
}
```

---

## 編譯與驗證流程完整圖

```
rules/taxonomy/*.kdl (25 files)
rules/classes/*.kdl  (20 files)
rules/providers/*.kdl (60+ files)
rules/runtime/behavior.kdl
         │
         ▼
┌─────────────────────────────────────┐
│  scripts/compat-compiler/           │
│  ├── kdl-reader.ts      (parse + validation)
│  ├── compile-taxonomy.ts (→ CompiledTaxonomy)
│  ├── compile-cascade.ts  (→ CompiledCascade: flat rule list)
│  ├── compile-behavior.ts (→ CompiledBehavior)
│  └── index.ts            (compileCompatRules)
└────────────────┬────────────────────┘
                 │
                 ▼
      src/compat/rules.json (251KB, committed)
      ┌─────────────────────────────────────────────────────────┐
      │ {                                                       │
      │   version: 1,                                           │
      │   files: ["taxonomy/...", "classes/...", ...],          │
      │   taxonomy: { classes: [...], collapse: {...}, ... },   │
      │   cascade: { rules: [ { source, class?, providers?,     │
      │                            family?, revision?, models?, │
      │                            priority?, wire?, thinking?, catalog? } ] }, │
      │   behavior: { openaiResponsesHeuristic?, modelOperations│
      │               cursorEffort?, quotaTiers, hostedDefaults,│
      │               apiRoutes, modelLimits, excludeModels,    │
      │               planRequirements, pricingPeers }          │
      │ }                                                       │
      └─────────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│  Runtime (packages/catalog/src/compat/) │
│  ├── taxonomy.ts  → classifyModel(), collapseVariantId(), ... │
│  ├── cascade.ts   → resolveCascade(target)                     │
│  ├── behavior.ts  → apiRouteFor(), quotaTierFor(), ...        │
│  └── resolve.ts   → resolveModelPolicy(spec)                  │
└─────────────────────────────────────┘
```

**驗證指令**：
```bash
bun test test/compat-compile.test.ts      # rules.json 是否與 KDL 同步
bun test test/compat-parity.test.ts       # engine 是否復現每個 models.json 烘焙值
bun test test/compat-conformance.test.ts  # 規則結構一致性
bun test test/compat-cascade.test.ts      # cascade resolver 邏輯
bun test test/compat-taxonomy.test.ts     # taxonomy 分類邏輯
```

---

## 學到的事

1. **KDL 不是為了「配置檔好看」**——它是**有 schema、有驗證、有優先級語意的 DSL**，編譯期就能擋下 ambiguity、duplicate、unknown directive、malformed shape
2. **分層所有權是架構決策，不是檔案整理**——taxonomy/class/provider/runtime 四層各有擁有者，改動頻率與衝突域不同，合在一起會亂
3. **Flat rule list + per-axis independent resolution**——比巢狀 if-else 或優先級鏈乾淨得多；ambiguity 直接報錯，不靠「寫在後面贏」
4. **`classifyModel` 是 identity 的單一真相來源**——override → collapse → ranker 三階段管線，lenient mode 只給 discovery normalization 用，catalog compilation 嚴格模式
5. **Behavior heuristics 專門處理「exact lookup 之前/之外」**——responses routing、quota tier、exclude models、api routes、pricing peer… 這些不屬於「model lineage 真相」也不屬於「deployment contract」，是 discovery-time 的守門員

---

## 參考資料

- `packages/catalog/src/compat/rules/README.md` — 完整 KDL grammar、cascade grammar、behavior grammar、vendoring provenance
- `packages/catalog/scripts/compat-compiler/` — 編譯器完整實作（kdl-reader、compile-taxonomy、compile-cascade、compile-behavior）
- `packages/catalog/src/compat/taxonomy.ts` — `classifyModel`、`collapseVariantId`、`stripThinkingVariantSuffix`、identity override、discovery vocabulary
- `packages/catalog/src/compat/cascade.ts` — `resolveCascade`、`rankRule`、`contest`、`AmbiguousOverlapError`
- `packages/catalog/src/compat/behavior.ts` — `apiRouteFor`、`quotaTierFor`、`isExcludedModel`、`modelLimitsFor`、`planRequirementFor`、`pricingPeerFor`、`hostedDefaultModel`、`modelOperationOverrides`、`cursorEffortSuffix`
- `packages/catalog/src/compat/resolve.ts` — `resolveModelPolicy`、layered resolution order、`IdentityFacts`、per-API detectors
- `packages/catalog/src/compat/types.ts` — `CompiledCompatRules`、`CompiledCascade`、`CompiledRule`、`CompiledTaxonomy`、`CompiledBehavior`、`ModelIdentity`、`ResolveTarget`、`ResolvedAxes`

---

*本文屬 [OMP 內部設計導讀](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork) 系列第 7 篇。下一篇：OMP session tree 與 subagent isolation（待發布）*