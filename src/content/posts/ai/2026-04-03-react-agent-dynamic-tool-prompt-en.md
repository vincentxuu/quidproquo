---
title: "AI Agent Tool Descriptions Shouldn't Be Static: Dynamic prompt() Design Learned from Claude Code"
date: 2026-04-03
type: guide
category: ai
tags: [react-agent, tool-use, prompt-engineering, claude-code, few-shot, dynamic-prompt]
lang: en
tldr: "Every one of Claude Code's 45 tools uses a prompt() method that dynamically adjusts based on user type, feature flags, and system capabilities. Applying this pattern to a ReAct Agent, tool descriptions are dynamically generated along three dimensions: orchestrator model capability, locale, and available tools. Small models automatically get few-shot examples; large models save tokens."
description: "Analyzing how Claude Code dynamically generates tool descriptions, and designing a dynamic prompt strategy for multi-provider ReAct Agents so that the same set of tools performs optimally across different models and languages."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-03-react-agent-dynamic-tool-prompt)

Most AI Agent tool descriptions are hardcoded strings. Written once, pasted into the system prompt, identical for every user and every model.

After reverse-engineering Claude Code, I discovered that none of its 45 tools are static. Every tool has a `prompt()` method that dynamically generates its description based on the current context. This design is especially valuable in multi-provider, multilingual ReAct Agents.

## How Claude Code Does It

Claude Code's tool definitions aren't just a JSON schema plus a description string. Every tool has a `prompt()` method:

```typescript
prompt(options: {
  getToolPermissionContext: () => Promise<ToolPermissionContext>
  tools: Tools
  agents: AgentDefinition[]
  allowedAgentTypes?: string[]
}): Promise<string>
```

It returns a dynamically assembled string used as the tool description in the LLM API call.

### BashTool: Switching Entire Descriptions by User Type

BashTool is the most extreme example. It switches to completely different descriptions based on `process.env.USER_TYPE`:

- **Internal employees (ant)**: Concise instructions, directing users to skills like `/commit`
- **External users**: Full git safety protocols, sandbox restrictions, background task guidance

Same tool, but the descriptions differ by over 50% depending on who's using it.

### FileEditTool: Adjusting Format Instructions by User Settings

```typescript
const prefixFormat = isCompactLinePrefixEnabled()
  ? 'line number + tab'
  : 'spaces + line number + arrow'
```

When users choose different line number formats in their settings, the tool description follows suit. This ensures the LLM generates `old_string` and `new_string` in formats consistent with what the user actually sees.

### WebSearchTool: Injecting Current Time

```typescript
const currentMonthYear = getLocalMonthYear()
return `...The current month is ${currentMonthYear}...`
```

It looks trivial, but the effect is significant — the LLM knows "it's April 2026" when searching, so it won't search for outdated information.

### EnterPlanModeTool: Omitting Sections by Feature Flag

```typescript
const whatHappens = isPlanModeInterviewPhaseEnabled()
  ? ''
  : WHAT_HAPPENS_SECTION
```

During gradual feature rollouts, the description adjusts automatically. No code changes needed to switch descriptions — the feature flag handles it.

### A Key Detail: prompt() Is Only Called Once

Claude Code doesn't re-invoke `prompt()` on every API call. `toolSchemaCache.ts` locks the bytes after the first render within a session, and subsequent API calls reuse the cached schema. This prevents minor prompt variations from triggering a ~11K token prompt cache break.

So the dynamism is "session-level," not "turn-level."

## Why Static Descriptions Break in Multi-Provider Scenarios

NobodyClimb's ReAct Agent has a unique design: the orchestrator's provider and model can be switched in real-time via an admin dashboard, without code changes or redeployment.

This means the same 7 tools might be used by these models:

| Provider | Model | Tool Use Capability |
|----------|-------|---------------------|
| Workers AI | Llama 3.1 8B | Weak, frequently fills parameters incorrectly |
| Workers AI | Llama 4 Scout 17B | Moderate |
| GitHub Models | GPT-4o | Strong |
| Anthropic | Claude Sonnet | Strong |
| Google | Gemini Flash | Moderate |

If tool descriptions are static, you only have two choices:

1. **Write for strong models**: Concise descriptions, save tokens. But small models can't understand them, and fill rates plummet
2. **Write for weak models**: Detailed descriptions + few-shot examples. But large models waste tokens, and few-shot examples may constrain their reasoning

Neither is correct. The right approach is to let descriptions automatically adjust based on model capability.

## Three Dimensions of Dynamic Adaptation

After analyzing Claude Code's patterns, the react-agent's `prompt(ctx: ToolContext)` was designed with three adaptation dimensions:

### Dimension 1: Orchestrator Model Capability

This is the most valuable dimension. The core is an `isSmallModel()` helper:

```typescript
function isSmallModel(config: ModelConfig): boolean {
  const markers = ['8b', 'scout', 'mini', 'flash']
  return markers.some(m => config.model.toLowerCase().includes(m))
}
```

For small models, few-shot usage examples are appended to the prompt:

```typescript
// search_routes tool
prompt(ctx) {
  const base = ctx.locale === 'zh-TW'
    ? '搜尋攀岩路線。支援按岩場、難度、路線類型篩選。'
    : 'Search climbing routes by crag, grade, and style.'

  if (isSmallModel(ctx.models.orchestrator)) {
    return base + `\n\nUsage examples:
- "Crack routes at Longdong 5.10" → { "query": "crack", "crag": "Longdong", "grade_min": "5.10a" }
- "Sport routes for beginners" → { "query": "beginner sport" }
- "Multi-pitch routes in the north" → { "query": "multi-pitch", "area": "north" }`
  }
  return base
}
```

Large models don't need these examples — they can infer the correct format from the parameter schema alone. The saved tokens multiplied by 7 tools means saving hundreds of tokens per API call.

Workers AI's Llama models especially need this kind of guidance. In testing, without few-shot examples, Llama 8B had a parameter error rate exceeding 30% (putting crag names in the query field, incorrect grade formats, etc.). After adding few-shot examples, it dropped below 5%.

### Dimension 2: Locale

The climbing platform supports Chinese, English, and Japanese. Tool descriptions switch with the locale:

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

The Chinese locale includes additional crag name mappings between Chinese and English. When a user types "龍洞天氣" (Longdong weather), but the underlying API might require the English name "Longdong," having this mapping in the description lets the LLM handle the conversion without an extra tool call.

### Dimension 3: Available Tools

When tools have complementary relationships, the prompt includes combination hints:

```typescript
// search_routes tool
prompt(ctx) {
  let desc = 'Search climbing routes.'

  if (ctx.availableTools.includes('weather')) {
    desc += '\nHint: If the user asks "where should I go today," consider calling weather first to check conditions, then use this tool to search for routes.'
  }
  return desc
}
```

The value of this dimension is **guiding the LLM's tool selection strategy**. Without this hint, when faced with "Is Longdong good today?", the LLM calls `search_routes` directly, gets a route list without weather info, then uses a second turn to call `weather`. With the hint, the LLM calls both tools in the first turn (using `concurrencySafe` for parallel execution), saving one turn.

One turn = one orchestrator LLM call. Saving one turn saves approximately $0.01-0.03 on Anthropic, and while free on Workers AI, it saves 2-3 seconds of latency.

## Dimensions That Were Rejected

Dimensions considered during analysis but ultimately excluded:

**Turn-level dynamism**: Adjusting descriptions each turn based on existing tool results. For example, "weather has already been checked, no need to call weather again."

Reason for exclusion: This would cause tool schemas to differ on every turn, breaking provider prompt cache. Claude Code's approach of locking schema bytes within a session exists precisely to avoid this problem. The correct way to prevent LLMs from making redundant calls is to let the message history naturally show existing tool results — the LLM can judge for itself.

**User-history-level dynamism**: Adjusting descriptions based on the user's past query patterns. For example, "this user frequently asks about weather, so make the weather tool description longer."

Reason for exclusion: Overfitting. Tool descriptions should describe the tool's capabilities, not the user's preferences. User preferences should be conveyed to the LLM through the system prompt or the results of a `user_profile` tool.

## Implementation Considerations

### prompt() Return Values Affect Prompt Cache

If using Anthropic as the orchestrator, the tool schema is part of the prompt cache. `prompt()` must return stable values within the same session — identical context inputs must always produce identical strings.

Don't use `Date.now()` or random numbers inside `prompt()`. Claude Code's `WebSearchTool` uses `getLocalMonthYear()` instead of `new Date().toISOString()` precisely to ensure the return value stays the same within a given month.

### Quality of Few-Shot Examples Matters More Than Quantity

Few-shot examples for small models should cover the **most common parameter combination patterns**, not enumerate every possibility. 3 good examples beat 10 mediocre ones.

The three examples for `search_routes` each cover:
1. Specific crag + grade (most common)
2. Fuzzy search without specifying a crag
3. Search by region

These three patterns cover 90% of real-world queries.

### isSmallModel() Will Become Outdated

Model capabilities are improving rapidly. Today's "small model" markers (8b, mini, flash) may be inaccurate in six months. `isSmallModel()` should be configurable, or better yet, add a `capabilities` field to ModelConfig and let admins decide via the dashboard which models need few-shot examples.

That said, as a v1, keyword-based detection is sufficient.

## Overall Takeaway

Tool descriptions are the most easily overlooked design point in Agent systems. Most implementations treat them as "documentation" — written once and never touched again. But Claude Code's approach shows that descriptions are **part of the interface**, requiring context-based adjustment just like an API schema.

Priority order for the three dimensions:

1. **Model capability** (highest impact): Small models can't fill parameters correctly without few-shot; large models waste tokens with them
2. **Locale** (high necessity): Multilingual platforms simply don't work without it
3. **Available tools** (nice to have): Guides tool selection strategy, saving turns and money

Core principle: **Descriptions aren't documentation for humans — they're interfaces for LLMs. The same interface should behave differently under different runtimes.**

---

## References

- [Anthropic Tool Use Documentation](https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview)
- [OpenAI Function Calling Guide](https://platform.openai.com/docs/guides/function-calling)
- [ReAct: Synergizing Reasoning and Acting in Language Models (Yao et al., 2022)](https://arxiv.org/abs/2210.03629)
