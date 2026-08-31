---
title: "pi-mono 深度導讀 13：Agent Harness、Skills、System Prompt 組裝——從零構建 Agent 行為"
date: 2026-08-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, agent-harness, skills, system-prompt, prompt-templates]
lang: zh-TW
series:
  name: "pi-mono 深度導讀"
  order: 13
tldr: "AgentHarness 核心類別、System Prompt 動態組裝流程、Skills 載入與格式化、Prompt Templates 系統、Harness 如何決定 Tool 可用性、Result Handling、Telemetry Schema 註冊、預設 Harness 建構、Extension 如何擴充 Harness。"
description: "深入 pi-agent-core Harness 系統：AgentHarness 類別職責、System Prompt 從基礎模板動態組裝（角色、工具、技能、規則）、Skills 系統（載入、格式化、注入上下文）、Prompt Templates 變數替換、Tool 可用性判斷（Trust、Execution Mode）、Turn Result 處理、Telemetry Schema 自動註冊、預設 Harness 建構流程、Extension 透過 Hooks 擴充 Harness 行為。適合研究 Agent 行為組裝、Prompt Engineering 架構的工程師。"
draft: false
---

> 🌏 [English version](/en/posts/tech/2026-08-31-pi-mono-deep-dive-agent-harness-en)

## TL;DR

- **AgentHarness**：Agent 行為的中央組裝器，負責 System Prompt、Tools、Skills、Compaction、Branch Summary、Telemetry
- **System Prompt 組裝**：基礎模板 → 角色定義 → 工具描述 → 技能注入 → 規則附加 → 動態變數替換
- **Skills 系統**：`.pi/skills/` 目錄掃描、Frontmatter 解析、Markdown 內容、格式化為 XML/JSON 注入 Prompt
- **Prompt Templates**：`{{variable}}` 替換、條件區塊、迴圈、巢狀 Template
- **Tool 可用性**：Trust 檢查、Execution Mode、Extension Hooks 動態增減
- **Telemetry Schema**：Harness 自動註冊 AI/Harness Telemetry Schema

---

## Harness 在架構中的位置

```
┌─────────────────────────────────────────────────────────────────┐
│                      pi-agent-core                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐                                             │
│  │   AgentHarness  │ ◄── 核心組裝器                               │
│  ├─────────────────┤                                             │
│  │ System Prompt   │ ◄── 動態組裝                                 │
│  │ Tools           │ ◄── 可用性判斷、Execution Mode              │
│  │ Skills          │ ◄── 載入、格式化、注入                       │
│  │ Compaction      │ ◄── 策略、摘要生成                          │
│  │ Branch Summary  │ ◄── 生成、儲存                              │
│  │ Telemetry       │ ◄── Schema 註冊、Span 啟動                  │
│  └─────────────────┘                                             │
│           │                                                        │
│           ▼                                                        │
│  ┌─────────────────┐                                             │
│  │   AgentLoop     │ ◄── 使用 Harness 提供的配置                  │
│  └─────────────────┘                                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## AgentHarness 類別

### 核心定義

```typescript
// packages/agent/src/harness/agent-harness.ts
export class AgentHarness {
  // 配置
  readonly systemPromptTemplate: string;
  readonly skills: Skill[];
  readonly tools: AgentTool[];
  readonly compactionSettings: CompactionSettings;
  readonly telemetrySchema: TelemetrySchema;
  
  // 狀態
  private currentTools: AgentTool[] = [];
  private currentSkills: Skill[] = [];

  constructor(config: AgentHarnessConfig) {
    this.systemPromptTemplate = config.systemPromptTemplate;
    this.skills = config.skills ?? [];
    this.tools = config.tools ?? [];
    this.compactionSettings = config.compactionSettings ?? DEFAULT_COMPACTION_SETTINGS;
    this.telemetrySchema = config.telemetrySchema ?? AGENT_TELEMETRY_SCHEMAS;
  }

  // 核心：建構 AgentLoopConfig
  buildLoopConfig(context: AgentContext): AgentLoopConfig {
    return {
      model: context.model,
      tools: this.getAvailableTools(context),
      systemPrompt: this.buildSystemPrompt(context),
      convertToLlm: this.convertToLlm.bind(this),
      transformContext: this.transformContext.bind(this),
      reasoning: context.thinkingLevel,
      toolExecution: this.determineToolExecution(),
      beforeToolCall: this.onBeforeToolCall.bind(this),
      afterToolCall: this.onAfterToolCall.bind(this),
      shouldStopAfterTurn: this.shouldStopAfterTurn.bind(this),
      prepareNextTurn: this.prepareNextTurn.bind(this),
    };
  }
}
```

---

## System Prompt 動態組裝

### 組裝流程

```typescript
// packages/agent/src/harness/system-prompt.ts
export function buildSystemPrompt(
  template: string,
  context: SystemPromptContext
): string {
  let prompt = template;
  
  // 1. 基礎角色定義
  prompt = replaceVariable(prompt, "role", context.role ?? DEFAULT_ROLE);
  
  // 2. 工具描述注入
  const toolsDescription = formatToolsForPrompt(context.tools);
  prompt = replaceVariable(prompt, "tools", toolsDescription);
  
  // 3. 技能注入
  if (context.skills.length > 0) {
    const skillsText = formatSkillsForPrompt(context.skills);
    prompt = replaceVariable(prompt, "skills", skillsText);
  } else {
    prompt = removeSection(prompt, "skills");
  }
  
  // 4. 規則附加
  const rulesText = formatRules(context.rules);
  prompt = replaceVariable(prompt, "rules", rulesText);
  
  // 5. 動態變數替換
  prompt = replaceVariables(prompt, context.variables);
  
  return prompt;
}

interface SystemPromptContext {
  role: string;
  tools: AgentTool[];
  skills: Skill[];
  rules: string[];
  variables: Record<string, string>;
}
```

### 預設 Template（簡化版）

```markdown
# Role
{{role}}

# Available Tools
{{tools}}

# Skills
{{skills}}

# Rules
{{rules}}

# Current Context
- Working Directory: {{cwd}}
- Current Model: {{model}}
- Thinking Level: {{thinkingLevel}}
- Date: {{date}}
```

### 變數替換實作

```typescript
function replaceVariables(template: string, variables: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] ?? match;
  });
}

function formatToolsForPrompt(tools: AgentTool[]): string {
  return tools.map(tool => 
    `## ${tool.name}\n${tool.description}\n\nParameters:\n\`\`\`json\n${JSON.stringify(tool.parameters, null, 2)}\n\`\`\``
  ).join("\n\n");
}

function formatSkillsForPrompt(skills: Skill[]): string {
  return skills.map(skill => 
    `<skill name="${skill.name}">\n${skill.description}\n\n${skill.instructions}\n</skill>`
  ).join("\n\n");
}
```

---

## Skills 系統

### Skill 定義

```typescript
// packages/agent/src/harness/skills.ts
export interface Skill {
  name: string;
  description: string;
  // Frontmatter 可選欄位
  version?: string;
  author?: string;
  tags?: string[];
  // 核心：使用說明
  instructions: string;
  // 可選：參考資料
  references?: string[];
  // 可選：範例
  examples?: SkillExample[];
}

export interface SkillExample {
  scenario: string;
  prompt: string;
  expectedOutcome: string;
}
```

### 載入流程

```typescript
// packages/agent/src/harness/skills.ts
export async function loadSkills(
  skillsDir: string,
  options: LoadSkillsOptions = {}
): Promise<LoadSkillsResult> {
  const skills: Skill[] = [];
  const errors: LoadError[] = [];

  // 1. 掃描目錄
  const files = await glob("**/*.md", { cwd: skillsDir });
  
  for (const file of files) {
    try {
      const content = await readFile(join(skillsDir, file), "utf8");
      const skill = parseSkill(content, file);
      if (skill) skills.push(skill);
    } catch (e) {
      errors.push({ file, error: e });
    }
  }

  // 2. 排序（依名稱）
  skills.sort((a, b) => a.name.localeCompare(b.name));

  return { skills, errors };
}

function parseSkill(content: string, filename: string): Skill | null {
  // 解析 Frontmatter
  const { frontmatter, body } = parseFrontmatter(content);
  
  if (!frontmatter.name) {
    return null;
  }

  return {
    name: frontmatter.name,
    description: frontmatter.description ?? "",
    version: frontmatter.version,
    author: frontmatter.author,
    tags: frontmatter.tags,
    instructions: body.trim(),
    references: frontmatter.references,
    examples: frontmatter.examples,
  };
}
```

### 格式化注入 Prompt

```typescript
// packages/coding-agent/src/core/skills.ts
export function formatSkillsForPrompt(skills: Skill[]): string {
  if (skills.length === 0) return "";
  
  return skills.map(skill => {
    let text = `<skill name="${skill.name}">\n`;
    text += `<description>${escapeXml(skill.description)}</description>\n`;
    
    if (skill.instructions) {
      text += `<instructions>\n${skill.instructions}\n</instructions>\n`;
    }
    
    if (skill.examples?.length) {
      text += "<examples>\n";
      for (const ex of skill.examples) {
        text += `  <example>\n    <scenario>${escapeXml(ex.scenario)}</scenario>\n    <prompt>${escapeXml(ex.prompt)}</prompt>\n    <outcome>${escapeXml(ex.expectedOutcome)}</outcome>\n  </example>\n`;
      }
      text += "</examples>\n";
    }
    
    text += "</skill>";
    return text;
  }).join("\n\n");
}
```

### 範例 Skill 檔案

```markdown
---
name: "code-review"
description: "程式碼審查技巧與最佳實踐"
version: "1.0.0"
tags: ["review", "quality"]
---

當進行程式碼審查時，請遵循以下原則：

1. **關注點分離**：每個 PR 只做一件事
2. **測試覆蓋**：新功能必須包含測試
3. **文檔同步**：API 變更需更新文檔

## 審查清單
- [ ] 邏輯正確性
- [ ] 錯誤處理
- [ ] 效能考量
- [ ] 安全性

## 範例
<example>
<scenario>審查新增的 API endpoint</scenario>
<prompt>請審查這個新的 /api/users endpoint 實作</prompt>
<outcome>發現缺少輸入驗證、建議加上 rate limiting、測試案例不足</outcome>
</example>
```

---

## Prompt Templates 系統

### Template 語法

```typescript
// packages/agent/src/harness/prompt-templates.ts
export interface PromptTemplate {
  name: string;
  template: string;
  // 可選：參數 Schema
  parameters?: Record<string, { type: string; description: string; required?: boolean }>;
}

// 支援語法：
// {{variable}} - 變數替換
// {{#if condition}}...{{/if}} - 條件
// {{#each array}}...{{/each}} - 迴圈
// {{> partial}} - 部分模板
```

### Template 引擎

```typescript
export function renderTemplate(
  template: PromptTemplate,
  data: Record<string, unknown>
): string {
  let result = template.template;
  
  // 1. 條件區塊
  result = result.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, condition, content) => {
    return data[condition] ? content : "";
  });
  
  // 2. 迴圈
  result = result.replace(/\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, arrayName, content) => {
    const array = data[arrayName] as unknown[];
    if (!Array.isArray(array)) return "";
    return array.map((item, index) => 
      content.replace(/\{\{this\}\}/g, JSON.stringify(item))
             .replace(/\{\{@index\}\}/g, String(index))
    ).join("");
  });
  
  // 3. 部分模板
  result = result.replace(/\{\{>\s*(\w+)\s*\}\}/g, (match, partialName) => {
    return partials[partialName] ?? "";
  });
  
  // 4. 變數替換
  result = result.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return String(data[key] ?? "");
  });
  
  return result;
}
```

### 內建 Templates

```typescript
// 內建常用 Templates
export const BUILTIN_TEMPLATES: Record<string, PromptTemplate> = {
  "compact-summary": {
    name: "compact-summary",
    template: `請將以下對話壓縮成摘要：
{{#each messages}}
- {{role}}: {{content}}
{{/each}}

摘要要求：
1. 關鍵決策與結論
2. 重要程式碼變更
3. 解決的問題
4. 待辦事項`,
  },
  "branch-summary": {
    name: "branch-summary",
    template: `分支 {{branchName}} 被捨棄，關鍵資訊：
{{#each messages}}
- {{role}}: {{content}}
{{/each}}

請生成 200 字內摘要。`,
  },
};
```

---

## Tool 可用性判斷

### Trust 機制

```typescript
// packages/coding-agent/src/core/trust-manager.ts
export class TrustManager {
  private trustStore: TrustStore;

  async checkTool(toolName: string, args: unknown): Promise<TrustResult> {
    const projectTrust = await this.getProjectTrust();
    
    // 1. 全域信任
    if (projectTrust === "full") return { allowed: true };
    
    // 2. 工具級信任
    const toolTrust = projectTrust.tools?.[toolName];
    if (toolTrust === "allow") return { allowed: true };
    if (toolTrust === "deny") return { allowed: false, reason: "Tool denied by project trust" };
    
    // 3. 預設：需要詢問
    return { 
      allowed: false, 
      reason: "Project not trusted for this operation",
      requirePrompt: true 
    };
  }
}
```

### Execution Mode 決定

```typescript
// packages/agent/src/harness/agent-harness.ts
determineToolExecution(): "parallel" | "sequential" {
  // 1. 全域設定
  const global = this.settings?.toolExecution;
  if (global) return global;
  
  // 2. 工具級覆蓋
  const hasSequential = this.currentTools.some(t => t.executionMode === "sequential");
  if (hasSequential) return "sequential";
  
  return "parallel";  // 預設
}
```

### Extension 動態增減工具

```typescript
// Extension 可在 onAgentStart 注入工具
onAgentStart: async (event) => {
  return {
    tools: [
      ...event.tools,
      createCustomTool("my-tool", ...),
    ],
    systemPrompt: event.systemPrompt + "\n\n# Custom Tool Available\nYou can now use my-tool.",
  };
}
```

---

## Telemetry Schema 註冊

### Harness 啟動時註冊

```typescript
// packages/agent/src/harness/agent-harness.ts
export class AgentHarness {
  // ...
  
  registerTelemetry(telemetryContext: TelemetryContext): void {
    // 1. 建立 Typed Starters
    this.startAiSpan = createTypedSpanStarter(AI_TELEMETRY_SCHEMA, telemetryContext);
    this.startHarnessSpan = createTypedSpanStarter(HARNESS_TELEMETRY_SCHEMA, telemetryContext);
    
    // 2. 記錄 Harness 初始化
    const span = this.startHarnessSpan.harness_init({
      harness_version: "1.0.0",
      tools_count: this.currentTools.length,
      skills_count: this.currentSkills.length,
    });
    span.end();
  }
}
```

### 在 Agent Loop 中使用

```typescript
// packages/agent/src/agent-loop.ts
async function runLoop(...) {
  // 每個 Turn 開始
  const turnSpan = harness.startHarnessSpan.agent_turn({
    turn_id: turnId,
    model: config.model.id,
    tools_called: toolCalls.map(tc => tc.name),
  });
  
  // LLM 呼叫
  const llmSpan = harness.startAiSpan.llm_call({
    model: config.model.id,
    provider: config.model.provider,
  });
  
  // 工具執行
  for (const toolCall of toolCalls) {
    const toolSpan = harness.startAiSpan.tool_execution({
      tool_name: toolCall.name,
      tool_call_id: toolCall.id,
    });
    // ...
    toolSpan.end({ success: !isError });
  }
  
  turnSpan.end();
}
```

---

## 預設 Harness 建構

### createDefaultHarness

```typescript
// packages/agent/src/harness/agent-harness.ts
export function createDefaultHarness(options: CreateHarnessOptions = {}): AgentHarness {
  return new AgentHarness({
    systemPromptTemplate: options.systemPromptTemplate ?? DEFAULT_SYSTEM_PROMPT_TEMPLATE,
    skills: options.skills ?? [],
    tools: options.tools ?? createDefaultTools(),
    compactionSettings: options.compactionSettings ?? DEFAULT_COMPACTION_SETTINGS,
    telemetrySchema: options.telemetrySchema ?? AGENT_TELEMETRY_SCHEMAS,
  });
}

function createDefaultTools(): AgentTool[] {
  return [
    createReadTool(),
    createWriteTool(),
    createEditTool(),
    createBashTool(),
    createGrepTool(),
    createFindTool(),
    createLsTool(),
  ];
}
```

### 在 AgentSession 中使用

```typescript
// packages/coding-agent/src/core/agent-session.ts
export class AgentSession {
  private harness: AgentHarness;
  
  constructor(config: AgentSessionConfig) {
    this.harness = config.harness ?? createDefaultHarness({
      skills: this.loadSkills(),
      tools: this.getTools(),
      compactionSettings: this.compactionSettings,
    });
  }
  
  start(prompts: AgentMessage[]): EventStream<AgentEvent, AgentMessage[]> {
    const loopConfig = this.harness.buildLoopConfig(this.buildContext());
    return agentLoop(prompts, this.context, loopConfig, this.abortSignal, this.streamFunction);
  }
}
```

---

## Extension 擴充 Harness

### Hook 擴充點

```typescript
// Extension 可擴充 Harness 行為
interface Extension {
  // 在 Harness 建構 LoopConfig 時
  onBuildLoopConfig?: (config: AgentLoopConfig, context: AgentContext) => Partial<AgentLoopConfig>;
  
  // 修改 System Prompt
  onBuildSystemPrompt?: (prompt: string, context: SystemPromptContext) => string;
  
  // 修改工具列表
  onBuildTools?: (tools: AgentTool[], context: AgentContext) => AgentTool[];
  
  // 修改 Skills
  onBuildSkills?: (skills: Skill[], context: AgentContext) => Skill[];
  
  // 自訂 Compaction
  onCompaction?: (context: AgentContext, signal: AbortSignal) => Promise<CompactionResult>;
  
  // 自訂 Branch Summary
  onBranchSummary?: (options: GenerateBranchSummaryOptions) => Promise<BranchSummaryResult>;
}
```

### AgentHarness 整合 Extension

```typescript
// packages/agent/src/harness/agent-harness.ts
buildLoopConfig(context: AgentContext): AgentLoopConfig {
  let config = this.buildBaseConfig(context);
  
  // 套用 Extension Hooks
  for (const ext of this.extensions) {
    if (ext.onBuildLoopConfig) {
      config = { ...config, ...ext.onBuildLoopConfig(config, context) };
    }
    if (ext.onBuildSystemPrompt) {
      config.systemPrompt = ext.onBuildSystemPrompt(config.systemPrompt, this.buildPromptContext(context));
    }
    if (ext.onBuildTools) {
      config.tools = ext.onBuildTools(config.tools, context);
    }
    if (ext.onBuildSkills) {
      config.skills = ext.onBuildSkills(config.skills, context);
    }
  }
  
  return config;
}
```

---

## 參考資料

- [GitHub - earendil-works/pi — packages/agent/src/harness/](https://github.com/earendil-works/pi/tree/main/packages/agent/src/harness)
- [Pi 官方文件：Harness](https://pi.dev/docs/latest/harness)
- [Pi 官方文件：Skills](https://pi.dev/docs/latest/skills)
- [Prompt Engineering Best Practices](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/#prompt-engineering)

---

## 下一篇預告

> **第 14 篇：Testing、Quality Gates、Supply-chain Hardening**
>
> Faux Provider 測試、Browser Smoke Test、Vitest 單元測試、Biome Lint/Format、tsgo Type Check、Pinned Dependencies、Shrinkwrap 生成、Install Lock、npm Trusted Publishing、CI Pipeline。