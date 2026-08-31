---
title: "OMP 內部設計導讀（8）：Provider Quirk 與相容層 —— 為什麼要在 KDL 表達不寫在 TS"
date: 2026-08-31
category: tech
type: deep-dive
tags: [omp, oh-my-pi, coding-agent, provider-compat, kdl, harmony, reasoning-effort]
lang: zh-TW
description: "深入解析 OMP 如何用 KDL 規則樹隔離各 provider 的特有怪癖：OpenAI reasoning effort 階梯、Anthropic prompt cache breakpoint、Gemini manifest extensions、GPT-5 Harmony leak 檢測與修復。"
tldr: "OMP 把所有 provider 特有的 wire 行為寫進 KDL 規則樹，靜態編譯成 JSON 再由 cascade resolver 套用，避免 TS 程式碼被無數 if-else 污染，並能在 CI 捕捉衝突。"
series:
  name: "OMP 內部設計導讀"
  order: 8
---

## TL;DR

OMP（oh-my-pi）面對幾十種 LLM provider，各自有獨特的 wire 契約差異：OpenAI 的 reasoning effort 階梯、Anthropic 的 `cache_control` breakpoint、Gemini 的 `thinkingConfig`、`systemInstruction` 結構、GPT-5 Harmony 協定的 control-token leak。把這些寫在 TypeScript 會導致：

1. **條件爆炸**：`if (provider === "openai" && model.startsWith("gpt-5") && baseUrl.includes("api.openai.com")) …` 散落各處
2. **無法靜態驗證**：衝突規則只能在 runtime 發現
3. **無法版本化**：provider 行為變更無法追蹤、回滾

OMP 的解法：**所有 provider 特有行為寫成 KDL 規則**，經 `scripts/compat-compiler` 編譯成 `rules.json`，runtime 只跑純函數 `resolveCascade(target)`。規則以 `(class, provider, family, revision, models)` 為鍵，**後勝、同分報錯**，CI 即可捕捉 ambiguous overlap。

---

## 情境

當你在寫一個 coding agent，要同時支援：

- 官方 OpenAI `/v1/chat/completions` 與 `/v1/responses`
- Azure OpenAI（deployment name mapping、api-version query param）
- OpenRouter、Groq、Cerebras、Fireworks、Together 等 OpenAI-compatible gateway
- Anthropic Messages API（官方、Bedrock、Vertex、GitHub Copilot、ZenMux）
- Google Gemini（Generative AI、Vertex AI、Cloud Code Assist）
- OpenAI Codex（ChatGPT Plus/Pro 訂閱、OAuth、WebSocket/SSE 雙通道）
- 幾十種本地推理後端（llama.cpp、vLLM、Ollama、LM Studio）

每個 provider 在 **wire 格式**、**stream 事件**、**auth header**、**tool call 結構**、**reasoning 參數**、**prompt cache** 上都有細微差異。例如：

| Provider | 怪癖 |
|----------|------|
| OpenAI gpt-5.6+ | `reasoning_effort: "none"` 會被拒，必須送 `reasoning: { effort: "none" }` 或完全移除 |
| OpenRouter | 同一模型可能跑在不同後端，`reasoning_effort` 支援度不一，需 400 fallback |
| Anthropic | 官方 API 需 `cache_control: { type: "ephemeral", ttl: "1h" }`，Bedrock/Vertex 則強制簽名 thinking block |
| Gemini 2.5+ | `thinkingConfig: { thinkingBudget: 12000 }` 對應 budget 模式，Gemini 3 改用 `thinkingLevel` |
| GPT-5 (Harmony) | 模型偶爾在 tool args 裡洩漏 `to=functions.edit code …` 等未括號的 routing token |

若在 TS 裡硬寫 `if-else`，幾個月後沒人敢動。

---

## 問題

### 1. OpenAI Reasoning Effort 階梯怎麼表達？

OpenAI 官方定義的 reasoning effort 有 `minimal | low | medium | high`，但：

- **GPT-5.6+** 加入 `xhigh`、`max` 五階
- **OpenRouter GLM-5.2** 支援 `xhigh` 但 clamp `max → high`
- **Kimi K3 / DeepSeek V4 Flash** 只有 `low | high | max` 三階
- **Z.ai GLM-5.2 / Umans / Baseten** 只有 `high | max` 兩階
- **Fireworks / Ollama** 各自有自訂映射

這些不能寫死在程式碼，因為 **同一模型在不同 gateway 行為不同**。

### 2. Anthropic Prompt Cache Breakpoint

Anthropic 官方支援在訊息尾部兩輪各自最後一個 content block 掛 `cache_control: { type: "ephemeral", ttl: "1h" }`。但：

- **Bedrock / Vertex / Azure Foundry** 代理 Anthropic 時，**強制要求 thinking block 簽名**，不能隨意插入 cache breakpoint
- **GitHub Copilot / ZenMux / Cloudflare AI Gateway** 同樣 enforce 簽名
- 非官方 endpoint 若送 `cache_control` 會被拒或忽略

### 3. Gemini Manifest Extensions

Gemini 的 `generateContent` 請求結構與 OpenAI 完全不同：

```json
{
  "systemInstruction": { "parts": [{ "text": "..." }] },
  "tools": [{ "functionDeclarations": [...] }],
  "generationConfig": {
    "thinkingConfig": { "thinkingLevel": "HIGH" }  // 或 thinkingBudget
  }
}
```

- **Gemini 2.x** 用 `thinkingBudget`（token 數）
- **Gemini 3** 用 `thinkingLevel`（`MINIMAL | LOW | MEDIUM | HIGH`）
- **Vertex AI** 拒絕 `functionCall.id` / `functionResponse.id`
- **Cloud Code Assist** 需 `includeThoughts: false` 搭配 level/budget 關閉 thinking

### 4. GPT-5 Harmony Leak

GPT-5 系列模型使用 Harmony 協定框架 tool call：

```
<|start|>assistant<|channel|>commentary to=functions.edit<|message|>{ARGS}<|call|>
```

**缺陷**：模型在生成 `{ARGS}` 時，logit mask 封鎖了 `<|channel|>` 等 control token，導致機率質量「洩漏」到未加括號的 plain-text 形式：

```
analysis to=functions.edit code 以上內容… （夾雜中文博彩垃圾、假 tool result framing）
```

這會直接寫入檔案（`edit` tool 的 patch DSL）或污染 `eval` cell。統計顯示 gpt-5.4 約 **163 ppm** 發生率。

---

## 嘗試過程

### 嘗試 1：集中式 TS 條件判斷（失敗）

早期版本在 `buildOpenAICompat.ts`、`buildAnthropicCompat.ts` 裡塞滿 `if (model.id.startsWith("gpt-5"))`。問題：

- 新增 provider 需改動核心檔
- 同一模型換 gateway 行為不同，無法用 model id 區分
- 無法單元測試「規則衝突」

### 嘗試 2：JSON Schema 定義 compat flag（失敗）

改用 `model.compat.supportsReasoningEffort = true` 等 boolean flag。問題：

- 無法表達「GPT-5.6 用 `none-effort`，GPT-5.5 用 `lowest-effort`」這類 **enum-valued policy**
- 無法表達 **effort map**（`minimal → low`, `xhigh → high`）
- 版本邊界（`revision >= 5.6`）只能寫在 code 裡

### 嘗試 3：KDL 規則樹 + Cascade Resolver（成功）

參考 Rust 版 `cascade.rs`，設計 **三層 namespace**：

| Namespace | 用途 | 例子 |
|-----------|------|------|
| `wire` | 請求/回應 wire 相容旗標、effort map、stream timeout | `supportsReasoningEffort`, `reasoningEffortMap`, `streamIdleTimeoutMs` |
| `thinking` | 思考控制面：mode、ladder、default level、effort map | `thinking-mode "effort"`, `thinking-efforts "low" "high" "max"` |
| `catalog` | 價格、context window、tool type 等 metadata | `long-context-cost`, `apply-patch-tool-type "freeform"` |

規則寫在 `packages/catalog/src/compat/rules/providers/*.kdl`，編譯時檢查：

- 指令必須在 `AXES` 表內（`packages/catalog/src/compat/axes.ts`）
- 值必須符合封閉詞彙表（如 `thinking-mode` 只能是 `effort | budget | google-level | anthropic-adaptive | anthropic-budget-effort`）
- 同一 axis 被兩條同分規則爭奪 → **CI 編譯期報錯 `AmbiguousOverlapError`**

---

## 解法

### 1. KDL 規則怎麼寫

以 `openai.kdl` 為例：

```kdl
provider "openai" {
    thinking-mode "effort"
    class "unknown" {
        revision ">=5.6 <5.7" {
            reasoning-disable-mode "none-effort"
            thinking-efforts "low" "medium" "high" "xhigh" "max"
        }
        revision ">=5 <6" {
            apply-patch-tool-type "freeform"
        }
    }
    // residue models not isolated by taxonomy
    models "codex-mini-latest" "gpt-realtime-2.1" {
        thinking-efforts "minimal" "low" "medium" "high" "xhigh"
    }
    class "openai" {
        family "gpt" {
            revision "=5.6" {
                reasoning-disable-mode "none-effort"
            }
        }
        revision ">=5 <6" {
            apply-patch-tool-type "freeform"
        }
    }
    models "daybreak-blue-latest" "gpt-5.6" "gpt-5.6-sol*" {
        long-context-cost {
            inputThreshold 272000
            input 10.0
            output 45.0
            cacheRead 1.0
            cacheWrite 12.5
        }
    }
}
```

**關鍵設計**：

- **`class` / `family` / `revision`** 為結構化選擇器，不依賴 model id 字串比對
- **`models`** 為 residue 兜底：taxonomy 無法精確分類的 rolling alias（如 `daybreak-blue-latest`）
- **`thinking-mode "effort"`** 宣告此 provider 走 OpenAI-style effort ladder
- **`reasoning-disable-mode`** 區分關閉 reasoning 時的 wire 行為：
  - `"none-effort"`：送 `reasoning: { effort: "none" }`（GPT-5.6+）
  - `"lowest-effort"`：送 `reasoning_effort: "minimal"`（舊版）
  - `"openrouter-enabled-false"`：送 `reasoning: { enabled: false }`（OpenRouter）
  - `"zai-thinking-disabled"`：送額外 body `thinking: { type: "enabled" }` 關閉（Z.ai/Kimi）

### 2. Cascade Resolver 如何套用

`packages/catalog/src/compat/cascade.ts:188` `resolveCascade(target)`：

```typescript
function resolveCascade(target: ResolveTarget): ResolvedAxes {
  // 1. 建立 rule index（編譯期只做一次）
  // 2. 對每條 rule 計算 rank = (exactness, dimensions, priority)
  //    - exactness: 2=exact model match, 1=glob match, 0=無 models selector
  //    - dimensions: 有幾個 selector 維度 (class, provider, family, revision, models)
  //    - priority: KDL 顯式指定的 priority
  // 3. 同 axis 同分 → throw AmbiguousOverlapError
  // 4. 回傳 { wire, thinking, catalog } 三組 resolved assignments
}
```

**Ranking 範例**：

| Rule | Selectors | Exactness | Dimensions | Priority | Rank |
|------|-----------|-----------|------------|----------|------|
| `class "openai" family "gpt" revision "=5.6"` | class+family+revision | 0 | 3 | 0 | (0,3,0) |
| `models "gpt-5.6" "gpt-5.6-sol*"` | models (glob) | 1 | 1 | 0 | (1,1,0) **勝** |
| `models "gpt-5.6-cyber"` | models (exact) | 2 | 1 | 0 | (2,1,0) **勝** |

**後勝原則**：同 rank 以文件順序為 tie-break，**但同分不同值直接報錯**，強迫作者加 `priority=`。

### 3. Runtime 怎麼用

`packages/catalog/src/compat/resolve.ts:1227` `resolveModelPolicy(spec)`：

```typescript
export function resolveModelPolicy<TApi extends Api>(spec: ModelSpec<TApi>) {
  const identity = resolveIdentity(spec)        // taxonomy 分類：class, family, revision
  const facts = new IdentityFacts(identity)     // helper: revGte, is(), family()
  const axes = resolveCascade(buildResolveTarget(spec, identity))  // KDL 結果
  
  // Layer 1+2: detected baseline (URL/host-based, 仍在 TS)
  const compat = detectOpenAICompat(spec, d)    // 或 detectAnthropicCompat 等
  
  // Layer 3: KDL cascade axes 覆蓋
  applyWireAxes(compat, axes.wire, api)
  applyCompatOverrides(compat, spec.compat)     // Layer 4: spec 手寫 override
  
  // Layer 5: 思考 metadata 解析
  const thinking = resolveThinkingPolicy(spec, facts, axes, compat)
  
  return { identity, compat, thinking, catalog: axes.catalog }
}
```

**Layering 總覽**：

| Layer | 來源 | 可否覆蓋 |
|-------|------|----------|
| 1 | API-level unconditional defaults | 是 |
| 2 | Host/URL detection (`hosts.ts`) | 是 |
| 3 | **KDL cascade (rules/)** | **是，最高優先** |
| 4 | Spec-authored sparse overrides (`spec.compat`) | 是 |
| 5 | Legacy builder fixups | — |

---

## 為什麼會這樣

### 為什麼不用 TS 寫 `if-else`？

1. **開放世界假設**：provider 行為隨時變，新 gateway 隨時冒出。KDL 是**資料**，可熱更新、可版本控制、可 grep。
2. **靜態驗證**：`scripts/compat-compiler` 在 build 時把 KDL → `rules.json`，同時檢查：
   - 未知 directive
   - 值不在封閉詞彙表
   - Ambiguous overlap（同 axis 同分衝突）
3. **單一責任**：`resolve.ts` 只管 **identity → policy** 的 pure function mapping，無副作用，易測試。
4. **可審計**：`rules.json` 是完整快照，`git diff` 即可看見「GPT-5.6 新增 xhigh 功率階梯」這類變更。

### 為什麼要分 `wire` / `thinking` / `catalog` 三個 namespace？

- **Wire axes** 直接映射到 transport 層（`openai-completions.ts`、`anthropic.ts` 等），決定請求怎麼組、stream 怎麼解析
- **Thinking axes** 決定 UI 顯示什麼 effort 選單、預設值、effort→wire value 映射
- **Catalog axes** 只影響生成 `models.json` 的價格、context window、tool type 等 metadata，**不影響 runtime 行為**

這樣 transport 層 import `ResolvedOpenAICompat` 時，**TypeScript 型別系統保證只能讀 wire axes**，不會誤讀 `long-context-cost`。

### 為什麼 `models` selector 是兜底而非主流？

Taxonomy（`packages/catalog/src/compat/taxonomy.ts`）負責把 **任意 model id** 解析成結構化 `{class, family, revision, effort, thinkingVariant}`。規則應優先針對 **class/family/revision** 寫，因為：

- 同一 family 的新版本自動繼承規則
- Rolling alias（`gpt-5.6-latest`）不需每次更新規則
- `models` 只處理 taxonomy **無法區分** 的極少數 residue（如 Daybreak 系列沒有 `gpt-` 前綴）

---

## 學到的事

1. **Provider quirk 是資料，不是代碼**。把「GPT-5.6 用 `none-effort`」寫成 KDL 規則，比寫在 `if (revision === "5.6")` 更安全、更可遷移。
2. **Cascade resolver = 純函數 + 靜態排名**。消除 runtime 順序依賴，CI 即可捕捉衝突。
3. **Identity-based matching > string matching**。用 `class "openai" family "gpt" revision ">=5.6"` 而不是 `models "gpt-5.6*"`，新模型自動生效。
4. **Residue models 要有註解**。每個 `models` 區塊上方的 `// residue:` 註解強迫作者說明「為什麼 taxonomy 分不開」，避免濫用。
5. **Harmony leak 是架構層面的防禦**。不能只在 `edit` tool 處理，要在 **agent loop 統一掃描** assistant text / thinking / tool args，支援 **truncate-resume**（hashline DSL）與 **abort-retry**（JSON schema）兩條路徑。

---

## 參考資料

- [oh-my-pi: compat rules (KDL)](https://github.com/xiaoxu199/oh-my-pi/tree/main/packages/catalog/src/compat/rules/providers)
- [oh-my-pi: compat resolver (resolve.ts)](https://github.com/xiaoxu199/oh-my-pi/blob/main/packages/catalog/src/compat/resolve.ts)
- [oh-my-pi: cascade resolver (cascade.ts)](https://github.com/xiaoxu199/oh-my-pi/blob/main/packages/catalog/src/compat/cascade.ts)
- [oh-my-pi: axes vocabulary (axes.ts)](https://github.com/xiaoxu199/oh-my-pi/blob/main/packages/catalog/src/compat/axes.ts)
- [oh-my-pi: ERRATA-GPT5-HARMONY.md](https://github.com/xiaoxu199/oh-my-pi/blob/main/docs/ERRATA-GPT5-HARMONY.md)
- [oh-my-pi: harmony-leak.ts](https://github.com/xiaoxu199/oh-my-pi/blob/main/packages/ai/src/utils/harmony-leak.ts)
- [oh-my-pi: provider-quirks.md](https://github.com/xiaoxu199/oh-my-pi/blob/main/docs/provider-quirks.md)
- [oh-my-pi: model-thinking.ts](https://github.com/xiaoxu199/oh-my-pi/blob/main/packages/catalog/src/model-thinking.ts)