---
title: "pi-mono Deep Dive 13: Agent Harness, Skills, System Prompt Assembly — Building Agent Behavior from Scratch"
date: 2026-08-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, agent-harness, skills, system-prompt, prompt-templates]
lang: en
series:
  name: "pi-mono Deep Dive"
  order: 13
tldr: "AgentHarness Core Class, System Prompt Dynamic Assembly Flow, Skills Loading & Formatting, Prompt Templates System, How Harness Decides Tool Availability, Result Handling, Telemetry Schema Registration, Default Harness Construction, Extension Harness Extension."
description: "Deep dive into pi-agent-core Harness System: AgentHarness Class Responsibilities, System Prompt Assembly from Base Template (Role, Tools, Skills, Rules), Skills System (Loading, Formatting, Context Injection), Prompt Templates Variable Substitution, Tool Availability Decision (Trust, Execution Mode), Turn Result Handling, Telemetry Schema Auto-registration, Default Harness Construction, Extension Harness Extension via Hooks. For Engineers Researching Agent Behavior Assembly and Prompt Engineering Architecture."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-31-pi-mono-deep-dive-agent-harness)

## TL;DR

- **AgentHarness**: Central Assembler of Agent Behavior, Responsible for System Prompt, Tools, Skills, Compaction, Branch Summary, Telemetry
- **System Prompt Assembly**: Base Template → Role Definition → Tool Descriptions → Skill Injection → Rules Append → Dynamic Variable Substitution
- **Skills System**: `.pi/skills/` Directory Scan, Frontmatter Parsing, Markdown Content, Format as XML/JSON for Prompt Injection
- **Prompt Templates**: `{{variable}}` Substitution, Conditional Blocks, Loops, Nested Templates
- **Tool Availability**: Trust Check, Execution Mode, Extension Hooks Dynamic Add/Remove
- **Telemetry Schema**: Harness Auto-registers AI/Harness Telemetry Schemas

---

## Harness Position in Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      pi-agent-core                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐                                             │
│  │   AgentHarness  │ ◄── Core Assembler                           │
│  ├─────────────────┤                                             │
│  │ System Prompt   │ ◄── Dynamic Assembly                         │
│  │ Tools           │ ◄── Availability Decision, Execution Mode   │
│  │ Skills          │ ◄── Load, Format, Inject                     │
│  │ Compaction      │ ◄── Strategy, Summary Generation            │
│  │ Branch Summary  │ ◄── Generate, Store                         │
│  │ Telemetry       │ ◄── Schema Registration, Span Starting      │
│  └─────────────────┘                                             │
│           │                                                        │
│           ▼                                                        │
│  ┌─────────────────┐                                             │
│  │   AgentLoop     │ ◄── Uses Harness-Provided Config            │
│  └─────────────────┘                                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## AgentHarness Class

### Core Definition

```typescript
// packages/agent/src/harness/agent-harness.ts
export class AgentHarness {
  // Config
  readonly systemPromptTemplate: string;
  readonly skills: Skill[];
  readonly tools: AgentTool[];
  readonly compactionSettings: CompactionSettings;
  readonly telemetrySchema: TelemetrySchema;
  
  // State
  private currentTools: AgentTool[] = [];
  private currentSkills: Skill[] = [];

  constructor(config: AgentHarnessConfig) {
    this.systemPromptTemplate = config.systemPromptTemplate;
    this.skills = config.skills ?? [];
    this.tools = config.tools ?? [];
    this.compactionSettings = config.compactionSettings ?? DEFAULT_COMPACTION_SETTINGS;
    this.telemetrySchema = config.telemetrySchema ?? AGENT_TELEMETRY_SCHEMAS;
  }

  // Core: Build AgentLoopConfig
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

## System Prompt Dynamic Assembly

### Assembly Flow

```typescript
// packages/agent/src/harness/system-prompt.ts
export function buildSystemPrompt(
  template: string,
  context: SystemPromptContext
): string {
  let prompt = template;
  
  // 1. Base Role Definition
  prompt = replaceVariable(prompt, "role", context.role ?? DEFAULT_ROLE);
  
  // 2. Tool Descriptions Injection
  const toolsDescription = formatToolsForPrompt(context.tools);
  prompt = replaceVariable(prompt, "tools", toolsDescription);
  
  // 3. Skills Injection
  if (context.skills.length > 0) {
    const skillsText = formatSkillsForPrompt(context.skills);
    prompt = replaceVariable(prompt, "skills", skillsText);
  } else {
    prompt = removeSection(prompt, "skills");
  }
  
  // 4. Rules Append
  const rulesText = formatRules(context.rules);
  prompt = replaceVariable(prompt, "rules", rulesText);
  
  // 5. Dynamic Variable Substitution
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

### Default Template (Simplified)

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

### Variable Substitution Implementation

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

## Skills System

### Skill Definition

```typescript
// packages/agent/src/harness/skills.ts
export interface Skill {
  name: string;
  description: string;
  // Optional Frontmatter Fields
  version?: string;
  author?: string;
  tags?: string[];
  // Core: Usage Instructions
  instructions: string;
  // Optional: References
  references?: string[];
  // Optional: Examples
  examples?: SkillExample[];
}

export interface SkillExample {
  scenario: string;
  prompt: string;
  expectedOutcome: string;
}
```

### Loading Flow

```typescript
// packages/agent/src/harness/skills.ts
export async function loadSkills(
  skillsDir: string,
  options: LoadSkillsOptions = {}
): Promise<LoadSkillsResult> {
  const skills: Skill[] = [];
  const errors: LoadError[] = [];

  // 1. Scan Directory
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

  // 2. Sort (by name)
  skills.sort((a, b) => a.name.localeCompare(b.name));

  return { skills, errors };
}

function parseSkill(content: string, filename: string): Skill | null {
  // Parse Frontmatter
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

### Formatting for Prompt Injection

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

### Example Skill File

```markdown
---
name: "code-review"
description: "Code Review Techniques & Best Practices"
version: "1.0.0"
tags: ["review", "quality"]
---

When conducting code reviews, follow these principles:

1. **Separation of Concerns**: Each PR Does One Thing
2. **Test Coverage**: New Features Must Include Tests
3. **Documentation Sync**: API Changes Require Doc Updates

## Review Checklist
- [ ] Logic Correctness
- [ ] Error Handling
- [ ] Performance Considerations
- [ ] Security

## Example
<example>
<scenario>Reviewing New API Endpoint</scenario>
<prompt>Please review this new /api/users endpoint implementation</prompt>
<outcome>Found missing input validation, suggested rate limiting, insufficient test cases</outcome>
</example>
```

---

## Prompt Templates System

### Template Syntax

```typescript
// packages/agent/src/harness/prompt-templates.ts
export interface PromptTemplate {
  name: string;
  template: string;
  // Optional: Parameter Schema
  parameters?: Record<string, { type: string; description: string; required?: boolean }>;
}

// Supported Syntax:
// {{variable}} - Variable Substitution
// {{#if condition}}...{{/if}} - Conditional
// {{#each array}}...{{/each}} - Loop
// {{> partial}} - Partial Template
```

### Template Engine

```typescript
export function renderTemplate(
  template: PromptTemplate,
  data: Record<string, unknown>
): string {
  let result = template.template;
  
  // 1. Conditional Blocks
  result = result.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, condition, content) => {
    return data[condition] ? content : "";
  });
  
  // 2. Loops
  result = result.replace(/\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, arrayName, content) => {
    const array = data[arrayName] as unknown[];
    if (!Array.isArray(array)) return "";
    return array.map((item, index) => 
      content.replace(/\{\{this\}\}/g, JSON.stringify(item))
             .replace(/\{\{@index\}\}/g, String(index))
    ).join("");
  });
  
  // 3. Partial Templates
  result = result.replace(/\{\{>\s*(\w+)\s*\}\}/g, (match, partialName) => {
    return partials[partialName] ?? "";
  });
  
  // 4. Variable Substitution
  result = result.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return String(data[key] ?? "");
  });
  
  return result;
}
```

### Built-in Templates

```typescript
// Built-in Common Templates
export const BUILTIN_TEMPLATES: Record<string, PromptTemplate> = {
  "compact-summary": {
    name: "compact-summary",
    template: `Compress the following conversation into a summary:
{{#each messages}}
- {{role}}: {{content}}
{{/each}}

Summary Requirements:
1. Key Decisions & Conclusions
2. Important Code Changes
3. Resolved Issues
4. Outstanding Items`,
  },
  "branch-summary": {
    name: "branch-summary",
    template: `Branch {{branchName}} Abandoned, Key Info:
{{#each messages}}
- {{role}}: {{content}}
{{/each}}

Generate Summary Under 200 Words.`,
  },
};
```

---

## Tool Availability Decision

### Trust Mechanism

```typescript
// packages/coding-agent/src/core/trust-manager.ts
export class TrustManager {
  private trustStore: TrustStore;

  async checkTool(toolName: string, args: unknown): Promise<TrustResult> {
    const projectTrust = await this.getProjectTrust();
    
    // 1. Global Trust
    if (projectTrust === "full") return { allowed: true };
    
    // 2. Tool-level Trust
    const toolTrust = projectTrust.tools?.[toolName];
    if (toolTrust === "allow") return { allowed: true };
    if (toolTrust === "deny") return { allowed: false, reason: "Tool denied by project trust" };
    
    // 3. Default: Require Prompt
    return { 
      allowed: false, 
      reason: "Project not trusted for this operation",
      requirePrompt: true 
    };
  }
}
```

### Execution Mode Decision

```typescript
// packages/agent/src/harness/agent-harness.ts
determineToolExecution(): "parallel" | "sequential" {
  // 1. Global Setting
  const global = this.settings?.toolExecution;
  if (global) return global;
  
  // 2. Per-tool Override
  const hasSequential = this.currentTools.some(t => t.executionMode === "sequential");
  if (hasSequential) return "sequential";
  
  return "parallel";  // Default
}
```

### Extension Dynamic Tool Add/Remove

```typescript
// Extension Can Inject Tools in onAgentStart
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

## Telemetry Schema Registration

### Harness Startup Registration

```typescript
// packages/agent/src/harness/agent-harness.ts
export class AgentHarness {
  // ...
  
  registerTelemetry(telemetryContext: TelemetryContext): void {
    // 1. Create Typed Starters
    this.startAiSpan = createTypedSpanStarter(AI_TELEMETRY_SCHEMA, telemetryContext);
    this.startHarnessSpan = createTypedSpanStarter(HARNESS_TELEMETRY_SCHEMA, telemetryContext);
    
    // 2. Record Harness Init
    const span = this.startHarnessSpan.harness_init({
      harness_version: "1.0.0",
      tools_count: this.currentTools.length,
      skills_count: this.currentSkills.length,
    });
    span.end();
  }
}
```

### Usage in Agent Loop

```typescript
// packages/agent/src/agent-loop.ts
async function runLoop(...) {
  // Turn Start
  const turnSpan = harness.startHarnessSpan.agent_turn({
    turn_id: turnId,
    model: config.model.id,
    tools_called: toolCalls.map(tc => tc.name),
  });
  
  // LLM Call
  const llmSpan = harness.startAiSpan.llm_call({
    model: config.model.id,
    provider: config.model.provider,
  });
  
  // Tool Execution
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

## Default Harness Construction

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

### Usage in AgentSession

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

## Extension Harness Extension

### Hook Extension Points

```typescript
// Extension Can Extend Harness Behavior
interface Extension {
  // When Harness Builds LoopConfig
  onBuildLoopConfig?: (config: AgentLoopConfig, context: AgentContext) => Partial<AgentLoopConfig>;
  
  // Modify System Prompt
  onBuildSystemPrompt?: (prompt: string, context: SystemPromptContext) => string;
  
  // Modify Tool List
  onBuildTools?: (tools: AgentTool[], context: AgentContext) => AgentTool[];
  
  // Modify Skills
  onBuildSkills?: (skills: Skill[], context: AgentContext) => Skill[];
  
  // Custom Compaction
  onCompaction?: (context: AgentContext, signal: AbortSignal) => Promise<CompactionResult>;
  
  // Custom Branch Summary
  onBranchSummary?: (options: GenerateBranchSummaryOptions) => Promise<BranchSummaryResult>;
}
```

### AgentHarness Integrates Extension

```typescript
// packages/agent/src/harness/agent-harness.ts
buildLoopConfig(context: AgentContext): AgentLoopConfig {
  let config = this.buildBaseConfig(context);
  
  // Apply Extension Hooks
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

## References

- [GitHub - earendil-works/pi — packages/agent/src/harness/](https://github.com/earendil-works/pi/tree/main/packages/agent/src/harness)
- [Pi Official Docs: Harness](https://pi.dev/docs/latest/harness)
- [Pi Official Docs: Skills](https://pi.dev/docs/latest/skills)
- [Prompt Engineering Best Practices](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/#prompt-engineering)

---

## Next Up

> **Part 14: Testing, Quality Gates, Supply-chain Hardening**
>
> Faux Provider Testing, Browser Smoke Test, Vitest Unit Tests, Biome Lint/Format, tsgo Type Check, Pinned Dependencies, Shrinkwrap Generation, Install Lock, npm Trusted Publishing, CI Pipeline.