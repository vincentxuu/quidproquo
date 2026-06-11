---
title: "Advanced Harness Engineering Patterns: Tool Registry, Guard System, and Checkpoint-Resume"
date: 2026-03-30
type: guide
category: ai
tags: [harness-engineering, tool-registry, guard-system, checkpoint-resume, agent]
lang: en
tldr: "A Harness is more than just an LLM wrapper. Tool Registry manages dynamic tool loading and selection, Guard System establishes a four-layer defense network, and Checkpoint-Resume enables long-running tasks to survive interruptions. These three patterns form the critical infrastructure of production-grade Agent systems."
description: "A deep dive into three advanced Harness Engineering patterns: Tool Registry with dynamic loading and MCP integration, a four-layer Guard System (Input/Output/Tool/Budget), Checkpoint-Resume with state snapshots and recovery, and the Escalation pattern with tiered fallback strategies."
draft: false
series:
  name: "AI Agent 實戰"
  order: 4
---

> 🌏 [中文版](/posts/ai/2026-03-30-harness-engineering-patterns)

In previous articles, we examined Harness Engineering from different angles: [Three Evolutions](/posts/ai/2026-03-28-harness-engineering-evolution) traced the timeline from Prompt to Context to Harness, [Anthropic's Hands-On Approach](/posts/ai/2026-03-28-anthropic-harness-design) demonstrated dual-Agent architecture and cross-session state management, and [Phil Schmid's Perspective](/posts/ai/2026-03-28-phil-schmid-agent-harness) positioned the Harness as the operating system for AI systems.

This article digs deeper: what exactly needs to be built inside a Harness?

The answer is three core subsystems plus several protective mechanisms. Each one is straightforward on its own, but together they represent the gap between a production-grade Agent system and a demo.

---

## 1. Harness Architecture Recap

Let's start with the architecture diagram. Everything that follows is based on this:

```
┌─────────────────────────────────────────────────┐
│                  Application                     │
├─────────────────────────────────────────────────┤
│                                                  │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│   │  Input    │  │  Tool    │  │  Output   │     │
│   │  Guards   │→ │  Guards  │→ │  Guards   │     │
│   └──────────┘  └──────────┘  └──────────┘     │
│        │              │              │           │
│        ▼              ▼              ▼           │
│   ┌─────────────────────────────────────────┐   │
│   │            HARNESS LAYER                │   │
│   │                                         │   │
│   │  ┌─────────────┐  ┌─────────────────┐  │   │
│   │  │   Tool      │  │   Checkpoint    │  │   │
│   │  │   Registry  │  │   Manager       │  │   │
│   │  └─────────────┘  └─────────────────┘  │   │
│   │                                         │   │
│   │  ┌─────────────┐  ┌─────────────────┐  │   │
│   │  │   Budget    │  │   Escalation    │  │   │
│   │  │   Tracker   │  │   Controller    │  │   │
│   │  └─────────────┘  └─────────────────┘  │   │
│   │                                         │   │
│   └─────────────────────────────────────────┘   │
│                      │                           │
│                      ▼                           │
│              ┌──────────────┐                    │
│              │     LLM      │                    │
│              │   Provider   │                    │
│              └──────────────┘                    │
│                                                  │
└─────────────────────────────────────────────────┘
```

The Harness is the control layer between the LLM and the Application. It doesn't perform inference — it governs *how* inference happens: deciding which tools are available, which inputs are valid, which outputs are trustworthy, when to save progress, and when to escalate.

If you're new to the Harness concept, I recommend reading [From Prompt to Harness: Three Evolutions of AI Engineering](/posts/ai/2026-03-28-harness-engineering-evolution) and [Anthropic's Harness Design](/posts/ai/2026-03-28-anthropic-harness-design) first, then coming back here for implementation details.

---

## 2. Tool Registry Design

### The Problem: More Tools, Worse Selection

The most common source of Agent capabilities is tool calling. But here's a counterintuitive fact: **the more tools you give a model, the lower its probability of choosing the right one.**

A rule of thumb is to keep the number of tools available per call **under 20**. Beyond that threshold, models start exhibiting:

- Wrong tool selection (semantic overlap between tool descriptions)
- Forgetting certain tools exist (attention dilution)
- Inventing nonexistent tool names (hallucination)

So you can't just dump all tools into the context. You need a **Tool Registry** — a centralized system for managing all available tools that dynamically selects which ones to load based on task type.

### Tool Definition Schema

Each tool needs four things:

| Field | Description |
|-------|-------------|
| `name` | Unique identifier, snake_case |
| `description` | Natural language description for the LLM, explaining when to use this tool |
| `parameters` | Parameter definitions in JSON Schema format |
| `execute` | The actual execution function |

This structure aligns with OpenAI function calling, Anthropic tool use format, and MCP (Model Context Protocol) tool definitions.

### MCP Integration

MCP is a tool standardization protocol proposed by Anthropic that lets different tool servers expose tool definitions in a unified format. Tool Registry is a natural consumer of MCP:

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  MCP     │     │  MCP     │     │  Local   │
│  Server  │     │  Server  │     │  Tools   │
│  (DB)    │     │  (API)   │     │          │
└────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │
     └────────────────┼────────────────┘
                      │
              ┌───────▼───────┐
              │  Tool         │
              │  Registry     │
              │               │
              │  - register() │
              │  - get()      │
              │  - list()     │
              │  - filter()   │
              └───────────────┘
```

### TypeScript Implementation

```typescript
interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>; // JSON Schema
  tags: string[];                       // For dynamic filtering
  execute: (params: Record<string, unknown>) => Promise<unknown>;
}

class ToolRegistry {
  private tools = new Map<string, ToolDefinition>();

  register(tool: ToolDefinition): void {
    if (this.tools.has(tool.name)) {
      throw new Error(`Tool "${tool.name}" already registered`);
    }
    this.tools.set(tool.name, tool);
  }

  get(name: string): ToolDefinition | undefined {
    return this.tools.get(name);
  }

  list(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }

  /**
   * Filter tools by tags — the core of dynamic loading
   * Example: registry.filterByTags(['database', 'read'])
   * Returns only tools that have both 'database' and 'read' tags
   */
  filterByTags(tags: string[]): ToolDefinition[] {
    return this.list().filter((tool) =>
      tags.every((tag) => tool.tags.includes(tag))
    );
  }

  /**
   * Get a recommended tool subset based on task type
   * This mapping can be hardcoded or dynamically determined by the LLM
   */
  getToolsForTask(taskType: string): ToolDefinition[] {
    const taskToolMap: Record<string, string[]> = {
      'data-analysis': ['sql_query', 'csv_parse', 'chart_create', 'file_read'],
      'code-generation': ['file_read', 'file_write', 'shell_exec', 'grep_search'],
      'research': ['web_search', 'web_fetch', 'summarize', 'file_write'],
      'customer-support': ['kb_search', 'ticket_create', 'ticket_update', 'email_send'],
    };

    const toolNames = taskToolMap[taskType] ?? [];
    return toolNames
      .map((name) => this.tools.get(name))
      .filter((t): t is ToolDefinition => t !== undefined);
  }

  /**
   * Convert to the format required by LLM APIs (Anthropic example)
   */
  toApiFormat(tools: ToolDefinition[]): Array<{
    name: string;
    description: string;
    input_schema: Record<string, unknown>;
  }> {
    return tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      input_schema: tool.parameters,
    }));
  }
}
```

### Dynamic Loading in Practice

Here's the actual workflow:

1. At startup, all tools register with the Registry (including tools returned by MCP servers)
2. When a task arrives, determine its type first
3. Use `getToolsForTask()` or `filterByTags()` to get the tool subset needed for that task
4. Pass only those tools into the LLM API call
5. LLM selects a tool → Registry retrieves the corresponding `execute` function → executes → returns result

The benefits of this approach:

- **Reduced hallucination**: Fewer tools means the model is less likely to get confused
- **Lower token consumption**: Tool definitions take up context space; loading fewer saves significant tokens
- **Permission isolation**: Different task types only see the tools they're supposed to use, reducing accidental misuse

---

## 3. Guard System: Four Layers of Defense

Tools are in place. The next question is: **how do you ensure every piece of data entering and leaving the Harness is safe?**

The Guard System consists of four gates, each intercepting problems at a different level:

```
User Input
    │
    ▼
┌──────────────────┐
│  Input Guards    │  ← PII detection / injection prevention / length limits
│  (Entry check)   │
└────────┬─────────┘
         │ ✓ Passed
         ▼
┌──────────────────┐
│  LLM Inference   │
│  + Tool Calls    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Tool Guards     │  ← Permission checks / parameter validation / rate limiting
│  (Tool-level)    │
└────────┬─────────┘
         │ ✓ Passed
         ▼
┌──────────────────┐
│  Tool Results    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Output Guards   │  ← Format validation / hallucination detection / toxicity filtering
│  (Exit check)    │
└────────┬─────────┘
         │ ✓ Passed
         ▼
┌──────────────────┐
│  Budget Guards   │  ← Token usage / API cost / time limits
│  (Resource ctrl) │  (Runs throughout, checked at every step)
└──────────────────┘
         │
         ▼
    Return to User
```

### 3.1 Input Guards: Entry Check

Intercept problems before user input reaches the LLM.

| Guard | What It Does | Why It's Needed |
|-------|-------------|-----------------|
| PII detection | Scans input for personal data (names, phone numbers, ID numbers) | Prevents PII from entering the LLM, especially when using third-party APIs |
| Injection prevention | Detects prompt injection attempts | Malicious users may try to override system instructions |
| Length limits | Rejects overly long inputs | Prevents a single input from consuming the entire context window |
| Language detection | Confirms input language is within supported range | Some Agents are optimized only for specific languages |

### 3.2 Output Guards: Exit Check

The last line of defense before LLM responses are sent out.

| Guard | What It Does | Why It's Needed |
|-------|-------------|-----------------|
| Format validation | Confirms response matches expected format (JSON, Markdown, etc.) | Downstream systems need structured output |
| Hallucination detection | Compares response against known facts or source documents | LLMs can confidently produce nonsense |
| Toxicity filtering | Detects harmful, biased, or inappropriate content | Brand protection and regulatory compliance |
| Citation verification | Confirms cited sources actually exist and content matches | Prevents fake citations (a common RAG issue) |

### 3.3 Tool Guards: Tool-Level Interception

Permission and security checks when an Agent calls a tool.

| Guard | What It Does | Why It's Needed |
|-------|-------------|-----------------|
| Permission checks | Confirms current user/role has permission to use that tool | Not every user should have access to `shell_exec` |
| Parameter validation | Validates tool parameters against JSON Schema | Prevents malformed parameters from causing system errors |
| Rate limiting | Limits call count for the same tool | Prevents infinite loops or resource exhaustion |
| Sensitive operation confirmation | Requires secondary confirmation for write/delete operations | Prevents irreversible erroneous operations |

### 3.4 Budget Guards: Resource Control

Runs throughout the entire task lifecycle, continuously tracking resource consumption.

| Guard | What It Does | Why It's Needed |
|-------|-------------|-----------------|
| Token budget | Tracks cumulative token usage, stops when threshold is exceeded | A single task shouldn't consume an entire month's API quota |
| Cost tracking | Calculates API call costs in real-time (including price differences between models) | Financial control |
| Time limits | Forces termination on timeout | Prevents Agents from running indefinitely |
| Step limits | Limits total number of inference/tool call steps | The most basic infinite loop protection |

### TypeScript Implementation

```typescript
type GuardResult =
  | { passed: true }
  | { passed: false; reason: string; action: 'block' | 'warn' | 'modify' };

interface Guard {
  name: string;
  type: 'input' | 'output' | 'tool' | 'budget';
  check(context: GuardContext): Promise<GuardResult>;
}

interface GuardContext {
  input?: string;
  output?: string;
  toolCall?: { name: string; params: Record<string, unknown> };
  session: {
    totalTokens: number;
    totalCost: number;
    startTime: number;
    stepCount: number;
  };
}

class GuardPipeline {
  private guards: Guard[] = [];

  /**
   * Chain-add a guard
   */
  add(guard: Guard): GuardPipeline {
    this.guards.push(guard);
    return this;
  }

  /**
   * Execute all guards of the specified type in sequence
   * If any guard returns 'block', the entire pipeline halts
   */
  async run(
    type: Guard['type'],
    context: GuardContext
  ): Promise<{ passed: boolean; failures: Array<{ guard: string; reason: string }> }> {
    const relevant = this.guards.filter((g) => g.type === type);
    const failures: Array<{ guard: string; reason: string }> = [];

    for (const guard of relevant) {
      const result = await guard.check(context);
      if (!result.passed) {
        failures.push({ guard: guard.name, reason: result.reason });
        if (result.action === 'block') {
          return { passed: false, failures };
        }
        // 'warn' and 'modify' continue executing subsequent guards
      }
    }

    return { passed: failures.length === 0, failures };
  }
}

// ── Usage examples ────────────────────────────────────────

// PII detection guard
const piiGuard: Guard = {
  name: 'pii-detector',
  type: 'input',
  async check(ctx) {
    const piiPatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/,     // SSN
      /\b[A-Z]\d{9}\b/,             // Taiwan National ID
      /\b09\d{8}\b/,                // Taiwan mobile number
    ];
    const hasPii = piiPatterns.some((p) => p.test(ctx.input ?? ''));
    if (hasPii) {
      return { passed: false, reason: 'Input contains PII', action: 'block' };
    }
    return { passed: true };
  },
};

// Token budget guard
const tokenBudgetGuard: Guard = {
  name: 'token-budget',
  type: 'budget',
  async check(ctx) {
    const MAX_TOKENS = 500_000;
    if (ctx.session.totalTokens > MAX_TOKENS) {
      return {
        passed: false,
        reason: `Token budget exceeded: ${ctx.session.totalTokens}/${MAX_TOKENS}`,
        action: 'block',
      };
    }
    return { passed: true };
  },
};

// Tool rate limit guard
const toolRateLimitGuard: Guard = {
  name: 'tool-rate-limit',
  type: 'tool',
  callCounts: new Map<string, number>(),
  async check(ctx) {
    const toolName = ctx.toolCall?.name ?? '';
    const count = (this.callCounts.get(toolName) ?? 0) + 1;
    this.callCounts.set(toolName, count);

    const MAX_CALLS_PER_TOOL = 50;
    if (count > MAX_CALLS_PER_TOOL) {
      return {
        passed: false,
        reason: `Tool "${toolName}" called ${count} times (limit: ${MAX_CALLS_PER_TOOL})`,
        action: 'block',
      };
    }
    return { passed: true };
  },
} as Guard & { callCounts: Map<string, number> };

// Assemble the pipeline
const pipeline = new GuardPipeline()
  .add(piiGuard)
  .add(tokenBudgetGuard)
  .add(toolRateLimitGuard);

// Run checks
const inputCheck = await pipeline.run('input', {
  input: userMessage,
  session: currentSession,
});

if (!inputCheck.passed) {
  console.error('Guards blocked:', inputCheck.failures);
  return;
}
```

The key design principle for Guards is: **each layer is independent, pluggable, and testable.** You can set them to `warn` only during development and switch to `block` in production. You can also load different guard combinations based on user tiers — paid users can have a higher token budget than free users.

---

## 4. Checkpoint-Resume Pattern

### The Problem: Long Tasks Will Always Fail

Any Agent task running for more than a few minutes faces a harsh reality: it **will** be interrupted at some point.

There are too many possible causes:

- API rate limit triggered
- Temporary network outage
- Token budget exhausted, requiring human approval for additional allocation
- Deployment updates causing restarts
- Model returning malformed responses requiring retries

Without a Checkpoint mechanism, interruption = starting over. For a task that has been running for 30 minutes and called 200 tools, starting over not only wastes money but can also cause inconsistencies because external state has already changed (e.g., partial data has been written).

### What a Checkpoint Needs to Store

An effective checkpoint requires at least four things:

| Data | Description |
|------|-------------|
| Task progress | Which subtasks are completed, current step |
| Accumulated context | Key findings and intermediate conclusions so far |
| Intermediate results | Outputs already produced (files, database write records, etc.) |
| Session state | Token usage, cost, tool call history |

### Approach 1: File System

The simplest approach, and the one Anthropic uses in their own Agent systems (`claude-progress.txt`).

```
project/
├── .agent/
│   ├── progress.txt          # Human-readable description of current progress
│   ├── checkpoints/
│   │   ├── cp-001.json       # First checkpoint
│   │   ├── cp-002.json       # Second checkpoint
│   │   └── cp-003.json       # Latest checkpoint
│   └── results/
│       ├── step-01-output.md # Intermediate outputs from each step
│       └── step-02-output.md
```

The advantage: you can just `cat` the file to check progress, and you can manually edit checkpoints to influence the Agent's next step. The disadvantage: you need to handle file locking yourself when running multiple Agents concurrently.

### Approach 2: Database

Suitable for multi-user, multi-Agent production environments.

```sql
CREATE TABLE sessions (
  id           UUID PRIMARY KEY,
  task_type    TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'running',  -- running | paused | completed | failed
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE checkpoints (
  id           UUID PRIMARY KEY,
  session_id   UUID REFERENCES sessions(id),
  step_number  INT NOT NULL,
  state        JSONB NOT NULL,       -- Full task state snapshot
  metadata     JSONB DEFAULT '{}',   -- Token usage, cost, etc.
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_checkpoints_session
  ON checkpoints(session_id, step_number DESC);
```

### TypeScript Implementation

```typescript
interface CheckpointData {
  stepNumber: number;
  taskProgress: {
    completedSteps: string[];
    currentStep: string;
    remainingSteps: string[];
  };
  context: {
    keyFindings: string[];
    intermediateResults: Record<string, unknown>;
  };
  session: {
    totalTokens: number;
    totalCost: number;
    toolCallCount: number;
    elapsedMs: number;
  };
}

class CheckpointManager {
  constructor(
    private sessionId: string,
    private storageDir: string
  ) {}

  /**
   * Save a checkpoint
   * Called every N steps or at each significant milestone
   */
  async save(data: CheckpointData): Promise<string> {
    const checkpointId = `cp-${String(data.stepNumber).padStart(4, '0')}`;
    const filePath = `${this.storageDir}/checkpoints/${checkpointId}.json`;

    await fs.mkdir(`${this.storageDir}/checkpoints`, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    // Sync update the human-readable progress file
    const progressText = [
      `Session: ${this.sessionId}`,
      `Step: ${data.stepNumber}`,
      `Current: ${data.taskProgress.currentStep}`,
      `Completed: ${data.taskProgress.completedSteps.join(', ')}`,
      `Remaining: ${data.taskProgress.remainingSteps.join(', ')}`,
      `Tokens used: ${data.session.totalTokens}`,
      `Cost: $${data.session.totalCost.toFixed(4)}`,
      `Updated: ${new Date().toISOString()}`,
    ].join('\n');

    await fs.writeFile(`${this.storageDir}/progress.txt`, progressText);

    return checkpointId;
  }

  /**
   * Restore to the latest checkpoint
   */
  async restore(): Promise<CheckpointData | null> {
    const checkpoints = await this.list();
    if (checkpoints.length === 0) return null;

    // Get the latest one
    const latest = checkpoints[checkpoints.length - 1];
    const filePath = `${this.storageDir}/checkpoints/${latest}.json`;
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as CheckpointData;
  }

  /**
   * List all checkpoints, sorted by step number
   */
  async list(): Promise<string[]> {
    try {
      const files = await fs.readdir(`${this.storageDir}/checkpoints`);
      return files
        .filter((f) => f.endsWith('.json'))
        .map((f) => f.replace('.json', ''))
        .sort();
    } catch {
      return [];
    }
  }

  /**
   * Clean up old checkpoints, keeping only the most recent N
   */
  async prune(keepCount: number = 5): Promise<void> {
    const all = await this.list();
    const toDelete = all.slice(0, -keepCount);
    for (const cp of toDelete) {
      await fs.unlink(`${this.storageDir}/checkpoints/${cp}.json`);
    }
  }
}
```

### Usage Pattern

```typescript
const checkpointMgr = new CheckpointManager(sessionId, '.agent');

// Try to resume from the last interruption point
const lastCheckpoint = await checkpointMgr.restore();
let currentStep = lastCheckpoint?.stepNumber ?? 0;
let completedSteps = lastCheckpoint?.taskProgress.completedSteps ?? [];

// Agent main loop
for (const step of taskSteps.slice(currentStep)) {
  // Execute the step...
  const result = await executeStep(step);
  completedSteps.push(step.name);
  currentStep++;

  // Save a checkpoint after each completed step
  await checkpointMgr.save({
    stepNumber: currentStep,
    taskProgress: {
      completedSteps,
      currentStep: step.name,
      remainingSteps: taskSteps.slice(currentStep).map((s) => s.name),
    },
    context: {
      keyFindings: accumulatedFindings,
      intermediateResults: { [step.name]: result },
    },
    session: getSessionMetrics(),
  });
}

// Clean up old checkpoints after task completion
await checkpointMgr.prune(3);
```

Checkpoint granularity requires a tradeoff: too frequent wastes I/O, too sparse loses too much progress on recovery. Generally, **saving once per meaningful subtask completion** is a reasonable starting point.

---

## 5. Escalation Pattern

### The Problem: Not Every Task Needs the Most Powerful Model

In production environments, using the cheapest model that can complete the task is basic cost discipline. But the problem is: you don't know upfront how powerful a model a task requires.

The Escalation pattern's strategy is: **start with the cheapest option and escalate on failure.**

```
Level 0: Fast model (Haiku / GPT-4o-mini)
    │
    │ Failed or insufficient quality
    ▼
Level 1: Retry with different strategy (add context / decompose task)
    │
    │ Still failed
    ▼
Level 2: Strong model (Sonnet / GPT-4o)
    │
    │ Still failed
    ▼
Level 3: Most powerful model (Opus / o3)
    │
    │ Still failed
    ▼
Level 4: Human-in-the-Loop (notify human for intervention)
```

The key isn't just escalation — it's **recording the reason for each escalation**. These records are the most valuable data — they tell you which task types require stronger models, where your prompts fall short, and whether your tool definitions are ambiguous.

### TypeScript Implementation

```typescript
interface EscalationLevel {
  name: string;
  model: string;
  maxRetries: number;
  strategy?: (task: Task) => Task; // Optional task transformation strategy
}

interface EscalationRecord {
  fromLevel: string;
  toLevel: string;
  reason: string;
  taskType: string;
  timestamp: number;
}

class EscalationController {
  private levels: EscalationLevel[] = [
    {
      name: 'fast',
      model: 'claude-haiku',
      maxRetries: 2,
    },
    {
      name: 'retry-with-strategy',
      model: 'claude-haiku',
      maxRetries: 1,
      strategy: (task) => ({
        ...task,
        // Add few-shot examples or decompose into subtasks
        prompt: addFewShotExamples(task.prompt),
      }),
    },
    {
      name: 'standard',
      model: 'claude-sonnet',
      maxRetries: 2,
    },
    {
      name: 'powerful',
      model: 'claude-opus',
      maxRetries: 1,
    },
  ];

  private records: EscalationRecord[] = [];

  async execute(task: Task): Promise<TaskResult> {
    for (let i = 0; i < this.levels.length; i++) {
      const level = this.levels[i];
      const effectiveTask = level.strategy ? level.strategy(task) : task;

      for (let retry = 0; retry < level.maxRetries; retry++) {
        try {
          const result = await this.runWithModel(level.model, effectiveTask);

          // Quality check — completion alone isn't enough, quality must meet standards
          if (await this.qualityCheck(result, task)) {
            return result;
          }
        } catch (error) {
          // Retry or escalate
          continue;
        }
      }

      // Record escalation reason
      if (i < this.levels.length - 1) {
        this.records.push({
          fromLevel: level.name,
          toLevel: this.levels[i + 1].name,
          reason: `Level "${level.name}" failed after ${level.maxRetries} retries`,
          taskType: task.type,
          timestamp: Date.now(),
        });
      }
    }

    // All levels failed → human-in-the-loop
    return this.escalateToHuman(task);
  }

  private async escalateToHuman(task: Task): Promise<TaskResult> {
    // Send notification (Slack, Email, etc.), pause task and wait for human response
    await notify({
      channel: 'agent-escalation',
      message: `Task ${task.id} requires human intervention`,
      context: {
        taskType: task.type,
        attempts: this.records.filter((r) => r.taskType === task.type),
      },
    });

    // Pause, wait for human to resume from checkpoint
    throw new EscalationError('Escalated to human', task.id);
  }

  /**
   * Get escalation records for analysis
   * Reviewing these records periodically reveals where improvements are needed
   */
  getRecords(): EscalationRecord[] {
    return [...this.records];
  }
}
```

Escalation and Checkpoint-Resume are natural companions: when escalating to human-in-the-loop, save a checkpoint first, then resume from the checkpoint after the human handles it.

---

## 6. Infinite Loop Protection

The most common failure mode in Agent systems is **infinite loops** — the model keeps repeating the same action, or oscillates endlessly between two states.

Three lines of defense:

### 6.1 Maximum Step Limit

The simplest and most reliable defense.

```typescript
const MAX_ITERATIONS = 100;
let iterations = 0;

while (!task.isComplete()) {
  if (++iterations > MAX_ITERATIONS) {
    throw new Error(`Task exceeded max iterations (${MAX_ITERATIONS})`);
  }
  await executeNextStep();
}
```

### 6.2 Similarity Detection

Detects whether outputs from consecutive steps are highly similar, indicating the system is stuck in the same place.

```typescript
class SimilarityDetector {
  private recentOutputs: string[] = [];
  private windowSize = 5;
  private threshold = 0.9;

  /**
   * Returns true if a loop is detected
   */
  check(output: string): boolean {
    this.recentOutputs.push(output);
    if (this.recentOutputs.length > this.windowSize) {
      this.recentOutputs.shift();
    }

    if (this.recentOutputs.length < 3) return false;

    // Check similarity of recent outputs
    const last = this.recentOutputs[this.recentOutputs.length - 1];
    const similarCount = this.recentOutputs
      .slice(0, -1)
      .filter((prev) => this.cosineSimilarity(prev, last) > this.threshold)
      .length;

    // If more than half of recent outputs are similar to the latest, flag as loop
    return similarCount >= Math.floor(this.recentOutputs.length / 2);
  }

  private cosineSimilarity(a: string, b: string): number {
    // Simplified version: uses character n-grams
    // Production environments can use embedding comparison
    const ngramA = this.getNgrams(a, 3);
    const ngramB = this.getNgrams(b, 3);
    const intersection = ngramA.filter((ng) => ngramB.includes(ng));
    return intersection.length / Math.max(ngramA.length, ngramB.length);
  }

  private getNgrams(text: string, n: number): string[] {
    const ngrams: string[] = [];
    for (let i = 0; i <= text.length - n; i++) {
      ngrams.push(text.slice(i, i + n));
    }
    return ngrams;
  }
}
```

### 6.3 Circuit Breaker

Borrowed from microservices architecture's Circuit Breaker pattern. When consecutive failures reach a threshold, it temporarily stops attempts and waits for a cooldown period before resuming.

```typescript
class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private failureThreshold: number = 5,
    private cooldownMs: number = 60_000
  ) {}

  /**
   * Check before executing an action
   */
  canProceed(): boolean {
    if (this.state === 'closed') return true;

    if (this.state === 'open') {
      // Check if cooldown period has elapsed
      if (Date.now() - this.lastFailureTime > this.cooldownMs) {
        this.state = 'half-open';
        return true; // Allow one attempt
      }
      return false;
    }

    // half-open: allow attempt
    return true;
  }

  recordSuccess(): void {
    this.failureCount = 0;
    this.state = 'closed';
  }

  recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.failureThreshold) {
      this.state = 'open';
    }
  }
}
```

How the three defenses relate:

```
Each step
  │
  ├─ Step count check (hard limit, non-overridable)
  │
  ├─ Similarity detection (soft judgment, triggers strategy change on detection)
  │
  └─ Circuit Breaker (consecutive failure protection, pauses for cooldown on trigger)
```

---

## 7. Observability Metrics

Once the Harness is running, you need to know how well it's performing. Here are six core metrics recommended for production environments:

| Metric | What It Measures | Health Baseline | Alert Condition |
|--------|-----------------|-----------------|-----------------|
| **Steps per Task** | Average steps to complete a task | Depends on task type | Sudden increase >50% |
| **Tool Error Rate** | Percentage of failed tool calls | < 5% | > 10% |
| **Loop Detection Count** | Times similarity detection triggered | 0 | > 0 (investigate every occurrence) |
| **Token Efficiency** | Tokens consumed per completed subtask | Stable or decreasing | Continuously increasing |
| **Task Completion Rate** | Percentage of successfully completed tasks | > 95% | < 90% |
| **Cost per Task** | API cost per task | Depends on business ROI | Exceeds ROI threshold |

Additional metrics worth tracking but not directly alerting on:

| Metric | Purpose |
|--------|---------|
| **Escalation Rate** | Frequency of escalation to stronger models — high rates indicate prompts or tool definitions need improvement |
| **Checkpoint Restore Count** | Frequency of checkpoint restores — high rates indicate infrastructure instability |
| **Guard Block Rate** | Frequency of blocks across guard layers — sudden spikes may indicate attacks or model behavior drift |
| **P95 Latency per Step** | Long-tail single-step latency — helps identify infrastructure issues |

These metrics are most conveniently tracked using [Langfuse](/posts/ai/2026-03-26-langfuse-llm-observability-guide) or similar LLM observability platforms. Each Agent step becomes a span, the entire task becomes a trace, and Guard results and Checkpoint events are attached as events.

---

## Summary

Let's map the four patterns from this article back to the architecture diagram:

```
                     ┌────────────────────┐
                     │   Observability    │
                     │   (Metrics)        │
                     └────────┬───────────┘
                              │ Observes all layers
    ┌─────────────────────────┼─────────────────────────┐
    │                         │          HARNESS         │
    │                         │                          │
    │  ┌──────────┐   ┌──────┴──────┐   ┌───────────┐  │
    │  │ Guard    │   │ Escalation  │   │ Loop      │  │
    │  │ System   │   │ Controller  │   │ Protection│  │
    │  │ (4 layers)│  │ (Tiered)    │   │ (3 lines) │  │
    │  └──────────┘   └─────────────┘   └───────────┘  │
    │                                                    │
    │  ┌──────────────┐   ┌──────────────────────────┐  │
    │  │ Tool         │   │ Checkpoint               │  │
    │  │ Registry     │   │ Manager                  │  │
    │  │ (Dynamic)    │   │ (Interrupt-Resume)       │  │
    │  └──────────────┘   └──────────────────────────┘  │
    │                                                    │
    └────────────────────────────────────────────────────┘
```

Each pattern is straightforward on its own. But without any one of them, your Agent system is just a demo — it runs, but it can't go to production.

- **Tool Registry** ensures the model only sees the tools it should see
- **Guard System** ensures all data entering and leaving the system is safe
- **Checkpoint-Resume** makes long-running tasks resilient to interruptions
- **Escalation** finds the balance between cost and quality
- **Infinite loop protection** prevents the most common runaway failure mode
- **Observability metrics** tell you when it's time to intervene

These aren't theoretical. If you're building an Agent system, start with Guard System and Checkpoint — they have the highest ROI, are the most straightforward to implement, and you'll be most grateful for them when things go wrong.

## References

- [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) — Anthropic's agent design philosophy; the source for Guard System and tool design principles
- [Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) — Anthropic's hands-on guide with concrete checkpoint and progress file implementations
- [Model Context Protocol Introduction](https://modelcontextprotocol.io/introduction) — The MCP protocol, the standard interface for Tool Registry integration
- [LangGraph GitHub Repository](https://github.com/langchain-ai/langgraph) — A mainstream agent framework with built-in durable execution and checkpointing
- [A Survey on Large Language Model based Autonomous Agents](https://arxiv.org/abs/2308.11432) — arXiv paper providing academic research background on agent safety and controllability
- [Circuit Breaker Pattern — Microsoft Azure Architecture](https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker) — The authoritative reference for the Circuit Breaker design pattern, the theoretical foundation for Section 6
- [Retrieval-Augmented Generation for Large Language Models: A Survey](https://arxiv.org/abs/2312.10997) — arXiv paper covering hallucination detection and output guard design in RAG systems
