---
title: "AI Agent 的 Tool 描述不該是靜態的：從 Claude Code 學到的動態 prompt() 設計"
date: 2026-04-03
type: guide
category: ai
tags: [react-agent, tool-use, prompt-engineering, claude-code, few-shot, dynamic-prompt]
lang: zh-TW
tldr: "Claude Code 的 45 個 tool 中，每個 prompt() 都會根據用戶類型、feature flags、系統能力動態調整。將這個模式套用到 ReAct Agent，根據 orchestrator 模型能力、locale、可用 tools 三個維度動態生成 tool description，小模型自動補 few-shot，大模型省 token。"
description: "分析 Claude Code 如何動態生成 tool description，並設計一套適用於多 provider ReAct Agent 的動態 prompt 策略，讓同一套 tool 在不同模型和語言下都能發揮最佳效果。"
draft: false
---

大部分 AI Agent 的 tool description 是寫死的字串。寫一次，貼進 system prompt，所有使用者、所有模型看到的都一樣。

逆向分析 Claude Code 後發現，它的 45 個 tool 沒有一個是靜態的。每個 tool 都有一個 `prompt()` 方法，根據當前 context 動態生成描述。這個設計在多 provider、多語系的 ReAct Agent 中特別有價值。

## Claude Code 怎麼做的

Claude Code 的 tool 定義不是一個 JSON schema 加一段 description string。每個 tool 都有一個 `prompt()` 方法：

```typescript
prompt(options: {
  getToolPermissionContext: () => Promise<ToolPermissionContext>
  tools: Tools
  agents: AgentDefinition[]
  allowedAgentTypes?: string[]
}): Promise<string>
```

回傳的是一段動態組裝的字串，作為 LLM API 的 tool description。

### BashTool：根據用戶類型切換整段描述

BashTool 是最極端的例子。它根據 `process.env.USER_TYPE` 切換完全不同的描述：

- **內部員工（ant）**：精簡指令，引導用 `/commit` 等 skill
- **外部用戶**：完整的 git 安全協議、sandbox 限制說明、背景任務指引

同一個 tool，不同人看到的描述差異超過 50%。

### FileEditTool：根據用戶設定調整格式說明

```typescript
const prefixFormat = isCompactLinePrefixEnabled()
  ? 'line number + tab'
  : 'spaces + line number + arrow'
```

用戶在設定裡選了不同的行號格式，tool description 跟著變。這確保 LLM 產生的 `old_string` 和 `new_string` 格式與用戶實際看到的一致。

### WebSearchTool：注入當前時間

```typescript
const currentMonthYear = getLocalMonthYear()
return `...The current month is ${currentMonthYear}...`
```

看起來很小，但效果顯著——LLM 搜尋時知道「現在是 2026 年 4 月」，不會搜過時的資訊。

### EnterPlanModeTool：根據 feature flag 省略段落

```typescript
const whatHappens = isPlanModeInterviewPhaseEnabled()
  ? ''
  : WHAT_HAPPENS_SECTION
```

新功能灰度發布時，description 跟著調整。不是改 code 切描述，而是 feature flag 自動控制。

### 一個關鍵細節：prompt() 只呼叫一次

Claude Code 不是每個 API call 都重新呼叫 `prompt()`。`toolSchemaCache.ts` 在 session 內第一次 render 後就鎖定 bytes，後續 API call 重用快取的 schema。這是為了避免 prompt 的微小變動觸發 ~11K tokens 的 prompt cache break。

所以動態是「session 級」的動態，不是「turn 級」的。

## 為什麼靜態 description 在多 provider 場景會出問題

NobodyClimb 的 ReAct Agent 有一個特殊設計：orchestrator 的 provider 和模型可以透過 admin dashboard 即時切換，不用改 code 或重新部署。

這意味著同一套 7 個 tool，可能被這些模型使用：

| Provider | 模型 | Tool Use 能力 |
|----------|------|--------------|
| Workers AI | Llama 3.1 8B | 弱，常填錯參數 |
| Workers AI | Llama 4 Scout 17B | 中等 |
| GitHub Models | GPT-4o | 強 |
| Anthropic | Claude Sonnet | 強 |
| Google | Gemini Flash | 中等 |

如果 tool description 是靜態的，你只有兩個選擇：

1. **寫給強模型看**：精簡描述，省 token。但小模型看不懂，fill rate 暴跌
2. **寫給弱模型看**：詳細描述 + few-shot。但大模型浪費 token，還可能被 few-shot 綁住思路

兩個都不對。正確的做法是讓 description 根據模型能力自動調整。

## 三個維度的動態適配

分析 Claude Code 的模式後，react-agent 的 `prompt(ctx: ToolContext)` 設計了三個適配維度：

### 維度一：Orchestrator 模型能力

這是最有價值的維度。核心是一個 `isSmallModel()` helper：

```typescript
function isSmallModel(config: ModelConfig): boolean {
  const markers = ['8b', 'scout', 'mini', 'flash']
  return markers.some(m => config.model.toLowerCase().includes(m))
}
```

小模型時，prompt 末尾附加 few-shot 使用範例：

```typescript
// search_routes tool
prompt(ctx) {
  const base = ctx.locale === 'zh-TW'
    ? '搜尋攀岩路線。支援按岩場、難度、路線類型篩選。'
    : 'Search climbing routes by crag, grade, and style.'

  if (isSmallModel(ctx.models.orchestrator)) {
    return base + `\n\n使用範例：
- 「龍洞 5.10 的裂隙路線」→ { "query": "裂隙", "crag": "龍洞", "grade_min": "5.10a" }
- 「適合新手的 sport 路線」→ { "query": "新手 sport" }
- 「北部有什麼多繩距路線」→ { "query": "多繩距", "area": "北部" }`
  }
  return base
}
```

大模型不需要這些範例——它們從 parameter schema 就能推斷出正確格式。省下來的 token 乘以 7 個 tool，每次 API call 省幾百 tokens。

Workers AI 的 Llama 模型特別需要這種引導。實測中，沒有 few-shot 時 Llama 8B 的參數填錯率超過 30%（把 crag 名稱填到 query 裡、grade 格式不對等），加了 few-shot 後降到 5% 以下。

### 維度二：Locale

攀岩平台支援中文、英文、日文。tool description 跟著 locale 切換：

```typescript
// weather tool
prompt(ctx) {
  if (ctx.locale === 'zh-TW') {
    return '查詢岩場天氣預報（溫度、降雨機率、風速）。\n' +
      '岩場名稱支援中英文：「龍洞」=「Longdong」、「大砲岩」=「Cannon Rock」'
  }
  if (ctx.locale === 'ja') {
    return 'クライミングエリアの天気予報を取得（気温、降水確率、風速）。'
  }
  return 'Get weather forecast for a crag (temperature, rain probability, wind).'
}
```

中文 locale 額外附加岩場名稱的中英對應。因為用戶輸入「龍洞天氣」，但底層 API 可能需要英文名 "Longdong"。這個映射寫在 description 裡，LLM 就知道怎麼轉換，不需要額外的 tool call。

### 維度三：可用 Tools

當 tool 之間有互補關係時，prompt 附加組合使用提示：

```typescript
// search_routes tool
prompt(ctx) {
  let desc = '搜尋攀岩路線。'

  if (ctx.availableTools.includes('weather')) {
    desc += '\n提示：如果用戶問「今天適合去哪裡」，建議先用 weather 確認天氣，再用此 tool 搜尋路線。'
  }
  return desc
}
```

這個維度的價值在於**引導 LLM 的 tool selection 策略**。沒有這個提示時，LLM 面對「龍洞今天適合嗎？」會直接呼叫 `search_routes`，得到路線列表但沒有天氣資訊，再用第二個 turn 呼叫 `weather`。有了提示後，LLM 在第一個 turn 就同時呼叫兩個 tool（利用 `concurrencySafe` 並行執行），省一個 turn。

一個 turn = 一次 orchestrator LLM call。省一個 turn 在 Anthropic 上大約省 $0.01-0.03，在 Workers AI 上免費但省 2-3 秒延遲。

## 不該做的維度

分析過程中考慮過但最終排除的維度：

**Turn 級動態**：每個 turn 根據已有的 tool results 調整 description。例如「已經查過天氣了，不需要再呼叫 weather」。

排除原因：會導致每個 turn 的 tool schema 不同，破壞 provider prompt cache。Claude Code 的做法是 session 內鎖定 schema bytes，正是為了避免這個問題。引導 LLM 不重複呼叫的正確做法是在 message history 裡自然呈現已有的 tool results，LLM 自己會判斷。

**用戶歷史級動態**：根據用戶過去的查詢習慣調整 description。例如「這個用戶常問天氣，把 weather tool 的描述加長」。

排除原因：過度擬合。tool description 應該描述 tool 的能力，不是用戶的偏好。用戶偏好應該透過 system prompt 或 user_profile tool 的結果傳遞給 LLM。

## 實作注意事項

### prompt() 的回傳值影響 prompt cache

如果用 Anthropic 作為 orchestrator，tool schema 是 prompt cache 的一部分。`prompt()` 在同一個 session 內回傳值必須穩定——同樣的 context 輸入，永遠產生同樣的字串。

不要在 `prompt()` 裡用 `Date.now()` 或隨機數。Claude Code 的 `WebSearchTool` 用 `getLocalMonthYear()` 而不是 `new Date().toISOString()`，就是為了保證同一個月內回傳值不變。

### few-shot 的品質比數量重要

給小模型的 few-shot 範例應該覆蓋**最常見的參數組合模式**，不是列舉所有可能。3 個好範例勝過 10 個平庸的。

`search_routes` 的三個範例分別覆蓋：
1. 指定岩場 + 難度（最常見）
2. 不指定岩場的模糊搜尋
3. 指定地區的搜尋

這三個模式覆蓋了 90% 的實際查詢。

### isSmallModel() 會過時

模型能力在快速提升。今天的「小模型」marker（8b, mini, flash）半年後可能已經不準。`isSmallModel()` 應該是可配置的，或者直接在 ModelConfig 裡加一個 `capabilities` 欄位，讓 admin 在 dashboard 決定哪些模型需要 few-shot。

不過作為 v1，基於名稱關鍵字的判斷夠用。

## 整體來說

Tool description 是 Agent 系統中最容易被忽略的設計點。大部分實作把它當成「文件」——寫一次就不管了。但 Claude Code 的做法說明，description 是**介面的一部分**，跟 API schema 一樣需要根據 context 調整。

三個維度的優先順序：

1. **模型能力**（影響最大）：小模型沒有 few-shot 就填不對參數，大模型有了 few-shot 就浪費 token
2. **Locale**（必要性高）：多語系平台不做就沒法用
3. **可用 tools**（錦上添花）：引導 tool selection 策略，省 turn 省錢

核心原則：**description 不是給人看的文件，是給 LLM 看的介面。同一個介面在不同 runtime 下該有不同的表現。**

---

## 參考資料

- [Anthropic Tool Use Documentation](https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview)
- [OpenAI Function Calling Guide](https://platform.openai.com/docs/guides/function-calling)
- [ReAct: Synergizing Reasoning and Acting in Language Models (Yao et al., 2022)](https://arxiv.org/abs/2210.03629)
