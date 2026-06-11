---
title: "How to Use Claude Code Agent Teams? Design Patterns from 6,400+ Agents on GitHub"
date: 2026-04-04
type: guide
category: ai
tags: [claude-code, agent-teams, subagent, multi-agent, orchestrator-pattern, ai-pipeline, context-engineering, harness-engineering, temporal, swarm, quality-gates]
lang: en
tldr: "There are already 6,400+ .claude/agents/*.md files on GitHub. We dissected 4 representative projects — ChemistryTimes (content production pipeline), claude-sub-agent (document-driven development pipeline), agentic (Temporal.io DAG parallel execution), and vs-copilot-multi-agent (hook-enforced memory persistence) — plus ruflo's enterprise-grade swarm architecture, distilling 6 design patterns and 5 practical trends."
description: "An in-depth teardown of 5 Claude Code multi-agent project architectures, covering orchestrator pipelines, DAG parallel execution, knowledge persistence, swarm orchestration, and more — distilling cross-project design trends and practical lessons."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-03-chemistry-times-analysis)

There are currently over 6,400 `.claude/agents/*.md` files on GitHub. The Claude Code multi-agent ecosystem is growing rapidly, but most people are still stuck at the "install a bunch of subagents and use them haphazardly" stage.

This post dissects 5 representative projects to see how they design agent pipelines, manage context, and ensure quality — then distills reusable design patterns.

## Case Study 1: ChemistryTimes — A 10-Agent Virtual Newsroom

**Project**: [chemistrywow31/chemistry-times](https://github.com/chemistrywow31/chemistry-times)
**Purpose**: Automatically publishes a bilingual (Traditional Chinese + English) internal newsletter daily at 08:30
**Tech**: Go + Gin + MongoDB + Docker Compose
**Agent count**: 10 (base) / 14 (English learning edition)
**Pattern**: Orchestrator-led sequential pipeline + partial parallelism

### Architecture

```
.claude/agents/
├── editor-in-chief.md          # Editor-in-chief (orchestrator, sonnet)
├── journalism/
│   ├── digital-journalist.md   # Digital journalist
│   └── data-auditor.md         # Fact checker
├── analysis/
│   ├── tech-analyst.md         # Tech analyst
│   ├── marketing-analyst.md    # Marketing analyst
│   └── online-english-education-analyst.md
├── writing/
│   ├── chinese-daily-writer.md # Chinese writer
│   └── english-daily-writer.md # English writer
├── production/
│   └── html-daily-producer.md  # HTML producer
└── review/
    ├── code-reviewer.md        # Code reviewer
    └── process-reviewer.md     # Process reviewer
```

### Pipeline

Six phases, with Phase 4 being the only parallel segment:

```
Topic Selection → Interviews → Fact-checking → Analysis+Writing(parallel) → HTML Production → Review+Publish
```

The editor-in-chief dispatches all agents via the Task tool, running in subagent mode within a single Claude Code session. No lateral delegation is allowed, and no sub-coordinators can be created — a pure star topology.

### Key Highlight: Context Management Discipline

This is the most rigorous context management among all case studies:

- **500-word summary cap**: Subagent results must not exceed 500 words
- **Workspace offloading**: Raw data exceeding 200 words is written to `workspace/` files
- **Worklog system**: Each phase leaves behind three documents: `references.md` / `findings.md` / `decisions.md`
- **Status format**: `DONE` / `DONE_WITH_CONCERNS` / `BLOCKED` / `NEEDS_CONTEXT`
- **Source attribution**: Each agent declares its input sources and output destinations

### Quality Gates

3 gates (4 for the English learning edition); pipeline stops if any gate fails:

| Gate | Owner | What It Verifies |
|------|-------|------------------|
| Fact-checking | Data Auditor | Data accuracy, source credibility |
| Code review | Code Reviewer | HTML/CSS/JS correctness |
| Final approval | Editor-in-Chief | Editorial consistency, topic balance |

### Degradation Strategy

If Phase 4 produces fewer than 3 articles, the scope is narrowed or the English version is skipped. This is extremely rare in other projects.

### English Learning Edition (14 Agents)

The base version extends to a 10-phase pipeline, adding translation, grammar analysis (CEFR B1-B2), TTS audio (OpenAI API), and educational quality review. Phase 6 is stream-triggered — the educational pipeline starts as soon as English content is ready, without waiting for the Chinese version.

### Design Decisions

- **Orchestrator uses sonnet instead of opus**: Cost consideration — the coordinator doesn't need the strongest generation capability
- **Chinese and English writers work independently in parallel**: Rather than writing one language first and translating, this avoids quality degradation
- **Skills separated from Agents**: 6 skills (`daily-production-pipeline`, `fact-checking-framework`, etc.) serve as shared SOPs that agents invoke as needed

## Case Study 2: claude-sub-agent — Document-driven Development Pipeline

**Project**: [zhsama/claude-sub-agent](https://github.com/zhsama/claude-sub-agent)
**Purpose**: An automated development pipeline that turns project ideas into production-ready code
**Agent count**: 8 core + 4 specialists
**Pattern**: Three-phase sequential pipeline, document-driven handoff

### Architecture

```
agents/spec-agents/
├── spec-orchestrator.md    # Workflow coordination (doesn't directly dispatch agents)
├── spec-analyst.md         # Requirements analyst
├── spec-architect.md       # System architect
├── spec-planner.md         # Implementation planner
├── spec-developer.md       # Full-stack developer
├── spec-tester.md          # Test specialist
├── spec-reviewer.md        # Code reviewer
└── spec-validator.md       # Final validator
```

There are also 4 domain experts (`senior-backend-architect`, `senior-frontend-architect`, `ui-ux-master`, `refactor-agent`) who join at specific phases.

### Pipeline: Three Phases + Quality Gates

```
Phase 1: Planning (20-25%)          Phase 2: Development (60-65%)       Phase 3: Validation (15-20%)
analyst → architect → planner       developer → tester                  reviewer → validator
        ↓                                   ↓                                   ↓
   [Gate: 95% threshold]              [Gate: 80-85%]                    [Gate: 85-95%]
```

Each gate failure routes back to the corresponding upstream agent for rework, with a maximum of 3 iterations. Expected convergence path: Round 1 (80-90%) → Round 2 (90-95%) → Round 3 (95%+).

### Core Mechanism: Document Handoff

Agents **do not communicate directly**. Each agent:

1. Reads documents produced by the previous agent
2. Performs its specialized work
3. Writes structured documents to the filesystem
4. Gets routed to the next agent via slash command or orchestrator

Produced documents include: `requirements.md`, `user-stories.md`, `architecture.md`, `api-spec.md` (OpenAPI 3.0), `tasks.md` (with dependency matrix and Gantt chart), `test-plan.md`.

### Tool Permission Isolation

This is the most noteworthy design — different agents have different tool access:

| Agent | Exclusive Tools | Significance |
|-------|----------------|--------------|
| developer | `Bash`, `Edit`, `MultiEdit` | **The only agent that can modify files** |
| reviewer | `mcp__ESLint__lint-files`, `mcp__ide__getDiagnostics` | Can run linter and IDE diagnostics |
| analyst, architect | `WebFetch` | Can look up external data |
| orchestrator | `Task` | Can dispatch tasks but **doesn't directly invoke agents** |

Only the developer can actually touch code. The reviewer can run lint but must route back to the developer to change code. This "least privilege" design prevents agents from overstepping boundaries.

### Comparison with ChemistryTimes

| Dimension | ChemistryTimes | claude-sub-agent |
|-----------|----------------|------------------|
| Orchestrator role | Actively dispatches all agents | Designs workflow but doesn't directly dispatch |
| Agent communication | Relayed through orchestrator | Filesystem handoff |
| Quality gates | 3 gates, binary pass/fail | 3 gates, score-based + backtrack rework |
| Parallel execution | Phase 4 has parallelism | Fully sequential |
| Tool isolation | Not explicitly restricted | Strict per-agent tool permissions |

## Case Study 3: agentic — Temporal.io + DAG Parallel Execution

**Project**: [skmtkytr/agentic](https://github.com/skmtkytr/agentic)
**Purpose**: General-purpose task decomposition and parallel execution engine
**Tech**: TypeScript + Temporal.io + Claude Agent SDK + Svelte Web UI
**Agent count**: 6 functional agents
**Pattern**: DAG-based wave parallel execution + dual-layer retry

### Architecture

Unlike the previous two case studies, agentic's agents aren't roles defined in `.claude/agents/*.md` files — they're **Temporal Activities** implemented in TypeScript:

```
Prompt → Planner → Validator → [Executor ×N ‖ Reviewer ×N] → Integrator → Integration Reviewer → Result
```

The entire pipeline is a Temporal Workflow, with each agent being an Activity.

### 6 Agents

| Agent | Responsibility | Key Mechanism |
|-------|---------------|---------------|
| **Planner** | Decomposes natural language prompt into a DAG | Zod schema enforces structured output; LLM-generated IDs replaced with `crypto.randomUUID()` |
| **Validator** | Validates DAG correctness | Checks for circular dependencies, dangling references, task ambiguity. Fatal errors terminate the workflow immediately |
| **Executor** | Executes a single task | Injects completed task results as context; optional tools (Read/Write/Bash/WebFetch, etc.) |
| **Reviewer** | Reviews a single task's output | Three outcomes: pass / pass+revision / fail (triggers retry). Verifies whether tools were actually used |
| **Integrator** | Merges all task results | Large results read from files (context management); output written to `_integrated/response.md` |
| **Integration Reviewer** | Final quality scoring | 5 dimensions scored 1-5 (completeness, correctness, structure, practicality, overall); overall must be >= 4 to pass |

### Core Mechanism: Wave-based DAG Execution

The `executeDag()` function implements wave-based parallel execution:

1. Each round identifies all tasks whose dependencies are satisfied
2. Limited to `maxParallelTasks` (default 3)
3. `Promise.all()` for parallel execution
4. Deadlock detection: if no tasks are ready but some remain incomplete, throws `PlanCircularDependencyError`

Each task goes through an Executor → Reviewer loop within a wave. Failed tasks retry with the reviewer's feedback injected.

### Dual-Layer Retry

**Layer 1: Task-level**
Reviewer rejects → feedback injected into task description → Executor retries (`maxTaskRetries` times)

**Layer 2: Pipeline-level**
Integration Reviewer rejects → **entire pipeline restarts from Planner**, carrying the failure reason. All state is reset. (`maxPipelineRetries` times)

### Context Management

- **Large results written to files**: `os.tmpdir()/agentic/{workflowId}/{taskId}/result.md`, passing file paths instead of inline content
- **Reviewer reads from files**: If the result is a file, the Reviewer gets the `Read` tool to access it, not inline
- **Truncation protection**: Integration Reviewer has a 15,000-character inline limit, tool evidence capped at 10 entries
- **Tool output truncation**: Evidence tool output limited to 500 characters, reviewer limited to 200 characters

### The Value of Temporal.io

Using Temporal.io provides capabilities the previous two case studies lack:

- **Persistent state**: Workflow state is automatically persisted, recoverable after crashes
- **Signal/Query**: External systems can send `cancelSignal` to cancel, or query `statusQuery` for real-time status
- **Retry policy**: 10-second initial interval, exponential backoff, max 3 retries, auth errors not retried
- **Worker configuration**: Up to 10 parallel activities, 20 parallel workflows

### Comparison with Previous Case Studies

| Dimension | ChemistryTimes | claude-sub-agent | agentic |
|-----------|----------------|------------------|---------|
| Agent definition | `.md` role files | `.md` role files | TypeScript Activities |
| Execution model | Single session | Slash command chaining | Temporal Workflow |
| Parallel execution | Partial parallelism | Fully sequential | DAG wave parallelism |
| Retry | None | Max 3 rounds of backtracking | Dual-layer (task + pipeline) |
| State persistence | None | None | Temporal auto-persistence |
| Quality scoring | Binary | Score-based | 5 dimensions, 1-5 scale |

## Case Study 4: vs-copilot-multi-agent — Hook-Enforced Memory Persistence

**Project**: [ethansadism/vs-copilot-multi-agent](https://github.com/ethansadism/vs-copilot-multi-agent)
**Purpose**: Cross-platform (Claude Code + VS Code Copilot) multi-agent development framework
**Agent count**: 4 (PM + 3 Specialists)
**Pattern**: PM coordinator + enforced knowledge persistence

### Architecture

The biggest difference from other case studies: this project's core isn't pipeline design — it's **memory management**.

```
PM (Opus) ─── dispatches ──→ Crawler Expert (Sonnet)
              │               Database Expert (Sonnet)
              │               Frontend Engineer (Sonnet)
              │
              └── manages ──→ contracts/ (cross-agent interface contracts)
                              memory-kb/ (knowledge base)
```

The PM is the sole coordinator (`disable-model-invocation: true` — other agents cannot invoke the PM). The three Specialists each handle crawling, database, and frontend respectively.

### Core Innovation: "No Memory Written = Task Incomplete"

Memory persistence is enforced at **three levels**:

**Level 1: Agent Definition Rules**
Each specialist's `.md` file explicitly states: "The Stop hook checks whether memory has been updated; if not updated, it blocks (task cannot be completed). No record = task incomplete."

**Level 2: SubagentStop Hook**
`subagent-memory-check.sh` runs when an agent attempts to finish:
1. Reads the timestamp file written at agent startup
2. Scans `.md` files under `memory-kb/<agent>/` for any files newer than the startup time
3. If **no files have been updated** → `exit 2` (block), forcing the agent to go back and write memory

**Level 3: Session Stop Hook**
When the entire session ends, checks whether `project-overview.md` has been updated within the last 10 minutes. If not, a reminder is issued.

### Contracts System: Cross-Agent Interface Contracts

When a task involves 2+ agents sharing interfaces (API endpoints, DB schemas, WebSocket events), the PM **must write a contract in `contracts/` before dispatching tasks**:

```markdown
# mta_demo4 Interface Contracts
## API Contracts
### GET /api/stocks
- response_field :: price (float)
- producer :: database
- consumer :: frontend
## DB Schema Contracts
### stock_prices
- column :: ticker (varchar, unique)
```

The PM includes the contract's permalink when dispatching tasks. After task completion, the PM cross-validates field names — inconsistencies are sent back for revision.

The `validate-write-note.sh` hook also validates contract tag format (must have `type:contract` + `app:` tag); incorrect format triggers an immediate block.

### Complete System of 8 Hooks

| Hook | Purpose |
|------|---------|
| **SessionStart** | Mode selection (regular / PM), loads active topics |
| **UserPromptSubmit** | Audit logging + keyword detection ("note" / "save" triggers topic archival) |
| **SubagentStart** | Records startup time, lists existing knowledge, lists shared contracts |
| **PostToolUse** | Audits every tool invocation |
| **PreCompact** | Auto-saves session activity to `conversations/` before context compression |
| **Stop** | Checks whether project-overview has been updated |
| **PreToolUse** | Validates `write_note` tag compliance |
| **SubagentStop** | **Enforced memory write check** |

### Wiki-links Knowledge Graph

Uses `[[Note Title]]` syntax for bidirectional links and `key :: value` syntax for queryable knowledge atoms:

```markdown
## Observations
- app :: mta_demo3
- problem_id :: CRAWLER-001
- root_cause :: TWSE API requires TLS 1.2

## Relations
- relates_to [[Crawler Best Practices]]
```

Basic Memory MCP provides semantic search (`search_notes`) and graph traversal. All memory **stays out of git** — "everyone owns their own knowledge base."

### PreCompact: Auto-Save Before Context Compression

This is the most clever hook — before Claude Code performs context compaction:

1. Automatically saves session activity to `conversations/` as a markdown note
2. Extracts recent hook events, modified notes, and git diff
3. Injects project summary + knowledge base statistics into the post-compression context

This creates a **recovery point that survives even when the context window is compressed**.

### Comparison with Other Case Studies

| Dimension | ChemistryTimes | claude-sub-agent | agentic | vs-copilot |
|-----------|----------------|------------------|---------|------------|
| Memory persistence | Worklog files | Document handoff | tmpdir files | **MCP semantic search + hook enforcement** |
| Cross-session knowledge | None | None | None | **Wiki-links knowledge graph** |
| Agent interface | Orchestrator relay | Documents | Workflow functions | **Contracts system** |
| Hook usage | None | None | None | **8 hooks with full coverage** |

## Case Study 5: Ruflo — Enterprise-Grade Swarm + RL Routing

**Project**: [ruvnet/ruflo](https://github.com/ruvnet/ruflo) (29.6k stars)
**Purpose**: Enterprise-grade AI agent orchestration platform
**Tech**: TypeScript monorepo (10 packages), v3.0.0-alpha.1
**Agent count**: 15 default, supports 100+
**Pattern**: Queen-led hierarchical-mesh swarm + reinforcement learning routing

### Architecture

Ruflo is fundamentally different from the previous four case studies — it's not "a few agents strung together" but a **distributed system simulation framework**.

The default 15 agents are distributed across 6 domains:

```
Layer 0:  agent-1 (Queen Coordinator)
Layer 1:  agent-2~4 (Security) | agent-5~9 (Core) | agent-10~12 (Integration)
Layer 2:  agent-13 (Test) | agent-14 (Perf) | agent-15 (Release)
```

Supports 4 topologies:

| Topology | Communication Method | Suitable Scale |
|----------|---------------------|----------------|
| **Hierarchical-Mesh** (default) | Queen + intra-domain mesh | 100+ agents |
| Mesh | Fully connected peer-to-peer | ~20 agents |
| Hierarchical | Strict tree structure | 100+ agents |
| Centralized | Single hub | ~50 agents |

### Queen Coordinator

Integrates three functions in a single class (~2,025 lines):

- **Strategic**: Task analysis, complexity scoring, time estimation, pattern matching (< 50ms)
- **Tactical**: Agent capability scoring, primary/backup agent assignment, execution strategy selection (< 20ms)
- **Adaptive**: Learning integration, health monitoring, bottleneck detection (< 30ms)

### Consensus Mechanisms

In-process simulations of three distributed consensus algorithms:

**Raft**: Election timeout randomized at 150-300ms, 50ms heartbeat, majority-vote commit. Standard textbook implementation, but peers are `Map` objects, not network connections.

**Byzantine (PBFT)**: Four phases (pre-prepare → prepare → commit → reply), tolerates f <= floor((n-1)/3) faulty nodes.

**Gossip**: Every 100ms, randomly selects 3 neighbors for broadcast, TTL 10 hops, 90% participation rate required for convergence.

Importantly: all three are **single-process simulations**, not actual distributed systems. Suitable for multi-agent coordination on a single machine.

### Q-Learning Routing

Tabular Q-Learning for task routing:

- Continuous state discretized into 10 bins x 8 dimensions
- Epsilon-greedy exploration (1.0 → 0.01, 10,000-step decay)
- Q-table LRU eviction to 80% when exceeding 10,000 states
- Single update < 1ms

Additionally supports DQN, PPO, A2C, SARSA, Curiosity, and Decision Transformer — 9 RL algorithms in total.

### SONA (WASM Fast Path)

Uses `@ruvector/sona` (Rust-compiled WASM) for < 0.05ms pattern matching. If a high-confidence match is found (based on learned past trajectories), it can skip the LLM and route directly — this is the implementation of "simple tasks don't need an LLM."

### Pragmatic Assessment

**Worth learning**:
- The abstraction of 4 topology modes (not every scenario fits the same topology)
- RL-based routing lets the system learn from history
- Agent health monitoring + automatic failover

**Caveats**:
- All distributed algorithms are in-process simulations, not actual distributed deployments
- "100+ agents" means 100+ logical state objects, not 100+ independent processes
- v3.0.0-alpha status — many features are still under development
- `AGENTS.md` explicitly states "claude-flow does NOT execute code" — it's a coordination layer; actual work is still done via the Claude API

### Fundamental Difference from Other Case Studies

The previous four case studies use "pipeline" thinking — tasks flow from A to B to C. Ruflo uses "network" thinking — tasks are routed to the most suitable agent, and the routing itself is learned.

| Dimension | Pipeline Pattern (Cases 1-4) | Swarm Pattern (Ruflo) |
|-----------|-----------------------------|-----------------------|
| Suitable for | Fixed processes, clear steps | Variable tasks, dynamic routing needed |
| Complexity | Low, easy to understand and debug | High, requires understanding distributed concepts |
| Agent count | 4-14 | 15-100+ |
| Learning capability | None | RL-based routing |
| Deployment barrier | Zero (pure markdown) | High (TypeScript monorepo) |

## Six Design Patterns

From the 5 case studies and the broader GitHub ecosystem, we can distill 6 multi-agent design patterns:

### 1. Orchestrator Pipeline

**Representative**: ChemistryTimes
**Characteristics**: A single orchestrator sequentially dispatches specialized agents, star topology
**Best for**: Repetitive tasks with fixed processes and high quality requirements (daily reports, code review, CI/CD)
**Key design**: Orchestrator only coordinates, never executes; strict role boundaries

### 2. Document-driven Handoff

**Representative**: claude-sub-agent
**Characteristics**: Agents exchange artifacts through the filesystem, no direct communication
**Best for**: Multi-phase development processes requiring traceable intermediate artifacts
**Key design**: Per-agent tool permission isolation, score-based quality gates + backtrack rework

### 3. DAG Wave Execution

**Representative**: agentic
**Characteristics**: Tasks decomposed into a DAG, wave-based parallel execution, external workflow engine control
**Best for**: Parallelizable complex tasks requiring persistent state and crash recovery
**Key design**: Dual-layer retry (task + pipeline), Temporal.io provides state persistence

### 4. Knowledge-Persistent Coordination

**Representative**: vs-copilot-multi-agent
**Characteristics**: Hook-enforced memory persistence, cross-session knowledge accumulation, semantic search
**Best for**: Long-term projects requiring cross-session team knowledge accumulation
**Key design**: SubagentStop hook blocks agents that haven't written memory; contracts system manages cross-agent interfaces

### 5. Hierarchical Swarm

**Representative**: Ruflo
**Characteristics**: Queen-led multi-topology, RL routing, consensus mechanisms
**Best for**: Large-scale, multi-domain enterprise scenarios requiring dynamic routing
**Key design**: Learned routing replaces fixed pipelines, WASM fast path skips LLM

### 6. Parallel Agent Teams (Supplementary)

**Representative**: [Anthropic C Compiler](https://www.anthropic.com/engineering/building-c-compiler)
**Characteristics**: Multiple independent Claude Code instances working in parallel, shared task list + mailbox
**Best for**: Large, partitionable codebase projects
**Key design**: Each agent owns an independent domain to minimize conflicts; 16 agents / ~2,000 sessions / $20K

## Five Practical Trends

### 1. Model Tiering Is Standard Practice

| Project | Orchestrator | Worker |
|---------|-------------|--------|
| ChemistryTimes | Sonnet | (default) |
| vs-copilot | **Opus** | Sonnet |
| Ruflo | Opus | Sonnet/Haiku |
| claude-sub-agent | (unspecified) | (unspecified) |

Most projects use higher-tier models for decision-making and lower-tier models for execution. ChemistryTimes goes against the grain by using sonnet as the orchestrator — a pragmatic cost choice: if the orchestrator only needs stable instruction-following rather than creative generation, sonnet is sufficient.

### 2. Context Management Determines Success or Failure

Every case study developed its own context management strategy:

| Strategy | Used By |
|----------|---------|
| Summary word limit | ChemistryTimes (500 words) |
| File offloading | ChemistryTimes (workspace), agentic (tmpdir) |
| Truncation protection | agentic (inline 15K chars, tool output 500 chars) |
| PreCompact auto-save | vs-copilot (saves notes before context compression) |
| Wiki-links knowledge graph | vs-copilot (cross-session knowledge accumulation) |

The context window is the **hard ceiling** of multi-agent systems. Without addressing this, more agents means worse quality.

### 3. Three Approaches to Quality Gates

- **Binary** (ChemistryTimes): pass/fail, failure stops the pipeline
- **Score-based + backtracking** (claude-sub-agent): Below threshold routes back to upstream for rework, max 3 rounds
- **Multi-dimensional scoring** (agentic): 5 dimensions scored 1-5, overall must be >= 4 to pass

No single approach is universally best. Binary is simple and reliable, score-based is more granular but requires threshold calibration, and multi-dimensional is most comprehensive but increases LLM call costs.

### 4. Memory Persistence Is an Emerging Battleground

vs-copilot's hook-enforced memory + Basic Memory MCP is the most complete implementation we've seen. Most projects (including ChemistryTimes and claude-sub-agent) have session-scoped knowledge — it's gone when the session ends.

Cross-session knowledge accumulation is the next problem to solve. Approaches include:
- MCP servers (Basic Memory, SQLite)
- Git-tracked markdown notes
- External vector databases

### 5. 3-5 Agents Is the Sweet Spot

| Agent Count | Case Study | Observation |
|-------------|-----------|-------------|
| 4 | vs-copilot | Most streamlined, compensated by hooks and contracts |
| 6 | agentic | Functional division, just right |
| 8-12 | claude-sub-agent | Covers the complete development lifecycle, slightly heavy |
| 10-14 | ChemistryTimes | Uses strict context discipline to offset overhead |
| 15-100+ | Ruflo | Requires RL routing to manage |

Beyond 5 agents, coordination overhead grows faster than throughput. ChemistryTimes works with 10 because its context management discipline (500-word cap, workspace offloading) keeps coordination costs manageable. Ruflo uses 15+ by relying on RL routing and topology management.

**Takeaway**: More agents isn't always better. Start with 3-5 to get things working, add more only when you hit bottlenecks, and ensure each addition comes with a corresponding context management strategy.

## More Projects Worth Exploring

| Project | Stars | One-liner |
|---------|-------|-----------|
| [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) | 16.2k | 130+ plug-and-play subagent catalog |
| [K-Dense-AI/claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills) | 17.3k | 134 scientific research skills, 100+ databases |
| [disler/claude-code-hooks-multi-agent-observability](https://github.com/disler/claude-code-hooks-multi-agent-observability) | 1.3k | Multi-agent real-time monitoring dashboard |
| [cs50victor/claude-code-teams-mcp](https://github.com/cs50victor/claude-code-teams-mcp) | 229 | Agent teams protocol as an MCP server |
| [baryhuang/claude-code-by-agents](https://github.com/baryhuang/claude-code-by-agents) | 826 | @mention routing to local/remote instances |
| [lst97/claude-code-sub-agents](https://github.com/lst97/claude-code-sub-agents) | 1.5k | 33 subagents with intelligent auto-delegation |

---

## References

- [Claude Code Sub-agents Documentation](https://code.claude.com/docs/en/sub-agents)
- [Claude Code Agent Teams Documentation](https://code.claude.com/docs/en/agent-teams)
- [Building a C compiler with a team of parallel Claudes - Anthropic](https://www.anthropic.com/engineering/building-c-compiler)
- [chemistrywow31/chemistry-times](https://github.com/chemistrywow31/chemistry-times)
- [zhsama/claude-sub-agent](https://github.com/zhsama/claude-sub-agent)
- [skmtkytr/agentic](https://github.com/skmtkytr/agentic)
- [ethansadism/vs-copilot-multi-agent](https://github.com/ethansadism/vs-copilot-multi-agent)
- [ruvnet/ruflo](https://github.com/ruvnet/ruflo)
