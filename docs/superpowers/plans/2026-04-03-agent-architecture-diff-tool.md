# Agent Architecture Diff Tool — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Claude Code skill (`/agent-diff`) that analyzes any AI agent project against a 39-dimension capability checklist extracted from Claude Code's source, producing a scored gap report with action plans.

**Architecture:** Two reference files (`architecture.md` + `signals.yaml`) serve as the "answer key." A Claude Code skill reads them, dispatches 6 parallel subagents to scan the target project, then aggregates results into a Markdown report.

**Tech Stack:** Markdown, YAML, Claude Code Skill (`.md` with frontmatter)

**Spec:** `docs/superpowers/specs/2026-04-03-agent-architecture-diff-tool-design.md`

**Reference source:** `/Users/xiaoxu/Projects/claude-code-source`

---

## File Map

### New files
| File | Responsibility |
|------|---------------|
| `~/Projects/agent-architecture-diff-tool/reference/architecture.md` | Human-readable capability checklist: 39 dimensions with Why, Claude Code Reference, Maturity Levels (0-5) |
| `~/Projects/agent-architecture-diff-tool/reference/signals.yaml` | Machine-readable detection signals: file_signals, code_signals, absence_signals, evaluation_criteria per dimension |
| `~/Projects/agent-architecture-diff-tool/skill/agent-diff.md` | Claude Code skill that orchestrates the analysis |
| `~/Projects/agent-architecture-diff-tool/README.md` | Project overview, setup instructions, usage |

### No test files
This is a content + skill project. Verification is done by running `/agent-diff` on a real agent project and reviewing the output.

---

## Task 0: Project Setup

**Files:**
- Create: `~/Projects/agent-architecture-diff-tool/`
- Create: `~/Projects/agent-architecture-diff-tool/README.md`

- [ ] **Step 1: Create project directory and git init**

```bash
mkdir -p ~/Projects/agent-architecture-diff-tool/{reference,skill}
cd ~/Projects/agent-architecture-diff-tool
git init
```

- [ ] **Step 2: Create README.md**

Write a README with:
- Project name and one-line description
- Architecture diagram (the 2-phase design)
- How to install the skill (symlink to `~/.claude/skills/`)
- How to use (`/agent-diff` in any agent project)
- How to update the reference files

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "feat: initial project setup with README"
```

---

## Task 1: architecture.md — Harness Engineering (A1-A23)

**Files:**
- Create: `~/Projects/agent-architecture-diff-tool/reference/architecture.md`

**Source:** Extract from the design spec + deep analysis of `/Users/xiaoxu/Projects/claude-code-source`

This is the largest task. For each of the 23 Harness Engineering dimensions, write:
- **Why** — 1-2 sentences on why this capability matters
- **Claude Code Reference** — Specific implementation details (file paths, mechanisms, numbers)
- **Maturity Levels** — 0 through 5, each with concrete description

- [ ] **Step 1: Write the document header and category intro**

```markdown
# AI Agent Architecture — Capability Reference

A comprehensive capability checklist for AI agent harnesses, extracted from Claude Code's architecture.
Use with `signals.yaml` and the `/agent-diff` skill to analyze any agent project.

## How to Read This Document

Each dimension has:
- **Why**: Why this capability matters for a production agent
- **Claude Code Reference**: How Claude Code implements it (the "5/5" example)
- **Maturity Levels**: 0 (absent) through 5 (production-grade)

Score your agent on each dimension. A score of 2/5 might be perfectly appropriate for your use case.

---

## A. Harness Engineering

The structural and runtime capabilities of the agent framework.
```

- [ ] **Step 2: Write dimensions A1-A8 (Core Infrastructure)**

Dimensions: Hooks/Lifecycle, Permission Model, Tool System, Configuration Layering, Error Handling & Resilience, Multi-Model Support, Operational Modes, Background Execution.

For each dimension, deeply read the relevant source files in `claude-code-source` (listed in the spec) and write accurate, specific reference details. Do NOT copy from the spec verbatim — the spec is a summary. Go deeper into the source for each dimension.

Key source files to read per dimension:
- A1 Hooks: `/src/types/hooks.ts`, `/src/utils/hooks.ts`, `/src/utils/hooks/hookEvents.ts`
- A2 Permissions: `/src/types/permissions.ts`, `/src/utils/permissions/permissions.ts`
- A3 Tools: `/src/Tool.ts`, `/src/tools.ts`
- A4 Config: `/src/utils/settings/settings.ts`, `/src/utils/settings/types.ts`
- A5 Resilience: `/src/services/api/withRetry.ts` or equivalent retry logic
- A6 Multi-model: model selection in `/src/utils/settings/`, `/src/tools/AgentTool/`
- A7 Modes: plan mode, sandbox mode, coordinator mode references
- A8 Background: `/src/tools/AgentTool/forkSubagent.ts`, daemon references

- [ ] **Step 3: Write dimensions A9-A16 (Extensibility + Operations)**

Dimensions: Skill/Plugin System, Agent Dispatch, Output Control, Planning & Task Management, MCP Integration, Security & Privacy, Observability & Cost Tracking, IDE & External Integration.

Key source files:
- A9 Skills: `/src/skills/bundledSkills.ts`, `/src/skills/loadSkillsDir.ts`, `/src/utils/plugins/pluginLoader.ts`
- A10 Agents: `/src/tools/AgentTool/AgentTool.ts`, `/src/tools/AgentTool/loadAgentsDir.ts`
- A11 Output: `/src/constants/outputStyles.ts`
- A12 Planning: `/src/tasks/`, `/src/tools/TaskCreateTool/`
- A13 MCP: `/src/services/mcp/config.ts`, `/src/services/mcp/types.ts`
- A14 Security: `/src/utils/sandbox/`, `/src/constants/cyberRiskInstruction.ts`
- A15 Observability: `/src/utils/telemetry/`, `/src/services/analytics/`
- A16 IDE: `/src/utils/claudeInChrome/`, extension references

- [ ] **Step 4: Write dimensions A17-A23 (Advanced Capabilities)**

Dimensions: Command System, SDK/Programmatic API, Concurrency Management, Version Migration, File Operation Safety, Sandbox Execution Environment, Computer Use.

Key source files:
- A17 Commands: `/src/commands.ts`, `/src/commands/`
- A18 SDK: `/src/entrypoints/agentSdkTypes.ts`, `/src/bridge/`
- A19 Concurrency: `isConcurrencySafe` in Tool.ts, lock files
- A20 Migration: `/src/migrations/`
- A21 File Safety: `/src/tools/FileEditTool/`, `/src/tools/FileWriteTool/`
- A22 Sandbox: `/src/utils/sandbox/sandbox-adapter.ts`
- A23 Computer Use: `/src/utils/computerUse/`

- [ ] **Step 5: Commit**

```bash
cd ~/Projects/agent-architecture-diff-tool
git add reference/architecture.md
git commit -m "feat: add Harness Engineering dimensions (A1-A23)"
```

---

## Task 2: architecture.md — Context Engineering (B1-B10)

**Files:**
- Modify: `~/Projects/agent-architecture-diff-tool/reference/architecture.md`

- [ ] **Step 1: Write the category intro**

```markdown
---

## B. Context Engineering

How the agent decides what information goes into the LLM's context window — what goes in, how it's structured, when it's injected, and when it's evicted.
```

- [ ] **Step 2: Write dimensions B1-B5**

Dimensions: Context Assembly Pipeline, Instruction Layering & Merging, Memory System, Conversation History Management, Token Budget & Allocation.

Key source files:
- B1: `/src/constants/prompts.ts`, `/src/constants/systemPromptSections.ts`, `/src/utils/systemPrompt.ts`
- B2: CLAUDE.md loading logic, `/src/utils/queryContext.ts`
- B3: `/src/memdir/memoryTypes.ts`, `/src/memdir/memdir.ts`, `/src/memdir/memoryScan.ts`
- B4: `/src/history.ts`, `/src/assistant/sessionHistory.ts`
- B5: token estimation in `/src/utils/`, compaction triggers

- [ ] **Step 3: Write dimensions B6-B10**

Dimensions: Dynamic Injection, Information Retrieval Strategy, Multimodal Input, Context Eviction & Compression, Cache Strategy.

Key source files:
- B6: `wrapInSystemReminder()`, hook `additionalContext`
- B7: Glob/Grep/Read tool prompts, file state cache
- B8: `/src/services/voice.ts`, image handling, PDF reading
- B9: `/src/services/compact/compact.ts`
- B10: cache boundary in `/src/utils/api.ts`, `splitSysPromptPrefix()`

- [ ] **Step 4: Commit**

```bash
cd ~/Projects/agent-architecture-diff-tool
git add reference/architecture.md
git commit -m "feat: add Context Engineering dimensions (B1-B10)"
```

---

## Task 3: architecture.md — Prompt Engineering (C1-C6)

**Files:**
- Modify: `~/Projects/agent-architecture-diff-tool/reference/architecture.md`

- [ ] **Step 1: Write the category intro**

```markdown
---

## C. Prompt Engineering

Quality assessment of how prompts and instructions are written. Unlike A and B, these are evaluated by reading actual prompt content and assessing quality — not by structural scanning.
```

- [ ] **Step 2: Write all 6 dimensions**

Dimensions: Instruction Writing Patterns, Tool Description Quality, Few-Shot & Example Design, Reasoning & Thinking Guidance, Guardrails & Boundary Control, Tone Style & User Adaptation.

For each dimension, read the actual prompt content in `claude-code-source`:
- C1: Read `/src/constants/prompts.ts` fully — study how instructions are structured
- C2: Read 5-6 tool `prompt.ts` files (BashTool, FileEditTool, AgentTool, GrepTool, TaskCreateTool) — study description patterns
- C3: Look for example blocks in prompts and skills
- C4: Extended thinking config, skill reasoning patterns
- C5: Read the guardrails sections in the system prompt (reversibility, OWASP, scope limits)
- C6: Output style definitions, user memory integration, language preferences

Write each dimension with:
- **Why** — why this prompt quality dimension matters
- **Claude Code Reference** — specific examples from the actual prompts (quote real text)
- **What Good Looks Like** — characteristics of well-written prompts in this dimension
- **What Bad Looks Like** — common anti-patterns

Note: These dimensions don't have maturity levels 0-5 like A and B. Instead they have qualitative evaluation criteria (defined in signals.yaml).

- [ ] **Step 3: Commit**

```bash
cd ~/Projects/agent-architecture-diff-tool
git add reference/architecture.md
git commit -m "feat: add Prompt Engineering dimensions (C1-C6)"
```

---

## Task 4: signals.yaml — Harness Engineering Signals

**Files:**
- Create: `~/Projects/agent-architecture-diff-tool/reference/signals.yaml`

- [ ] **Step 1: Write the YAML header and structure**

```yaml
# Agent Architecture Diff Tool — Detection Signals
# Used by the /agent-diff skill to scan target agent projects.
#
# Structure per dimension:
#   file_signals: glob patterns for relevant files
#   code_signals: grep patterns with weight (high/medium/low) and description
#   absence_signals: patterns that indicate missing abstraction
#
# For Prompt Engineering (C category):
#   files_to_read: glob patterns for prompt/instruction files
#   evaluation_criteria: questions for semantic evaluation

harness_engineering:
```

- [ ] **Step 2: Write signals for A1-A12**

For each dimension, write file_signals, code_signals, and absence_signals. Extract from the spec but also consider additional patterns specific to Python agents (since the user's agents are mixed TS/Python):

For Python agents, add patterns like:
- A1 Hooks: `decorator.*before|decorator.*after|@hook|@middleware`
- A2 Permissions: `@require_permission|check_access|role_required`
- A3 Tools: `@tool|tool_schema|ToolDefinition`
- etc.

- [ ] **Step 3: Write signals for A13-A23**

- [ ] **Step 4: Commit**

```bash
cd ~/Projects/agent-architecture-diff-tool
git add reference/signals.yaml
git commit -m "feat: add Harness Engineering signals (A1-A23)"
```

---

## Task 5: signals.yaml — Context Engineering + Prompt Engineering Signals

**Files:**
- Modify: `~/Projects/agent-architecture-diff-tool/reference/signals.yaml`

- [ ] **Step 1: Write Context Engineering signals (B1-B10)**

```yaml
context_engineering:
  B1_context_assembly_pipeline:
    file_signals: [...]
    code_signals: [...]
    absence_signals: [...]
  # ... B2-B10
```

- [ ] **Step 2: Write Prompt Engineering evaluation criteria (C1-C6)**

These use a different structure — `files_to_read` and `evaluation_criteria` (questions):

```yaml
prompt_engineering:
  C1_instruction_writing_patterns:
    files_to_read:
      - "**/*prompt*"
      - "**/*system*"
      - "**/*instruction*"
      - "**/CLAUDE.md"
      - "**/AGENTS.md"
      - "**/*skill*"
    evaluation_criteria:
      - "Are instructions ordered by priority (most important first)?"
      - "Are non-negotiable rules marked with strong language (NEVER, MUST, CRITICAL)?"
      # ...
  # ... C2-C6
```

- [ ] **Step 3: Commit**

```bash
cd ~/Projects/agent-architecture-diff-tool
git add reference/signals.yaml
git commit -m "feat: add Context + Prompt Engineering signals"
```

---

## Task 6: agent-diff.md Skill

**Files:**
- Create: `~/Projects/agent-architecture-diff-tool/skill/agent-diff.md`

This is the core deliverable — the skill that orchestrates the entire analysis.

- [ ] **Step 1: Write the skill frontmatter and overview**

```markdown
---
name: agent-diff
description: Analyze an AI agent project against a 39-dimension capability checklist extracted from Claude Code's architecture. Produces a scored gap report with action plans.
---

# Agent Architecture Diff

Analyze the current project against a 39-dimension capability reference extracted from Claude Code.

## Prerequisites

Reference files must exist at:
- `~/Projects/agent-architecture-diff-tool/reference/architecture.md`
- `~/Projects/agent-architecture-diff-tool/reference/signals.yaml`
```

- [ ] **Step 2: Write the analysis workflow**

The skill should instruct Claude to:

1. Read `~/Projects/agent-architecture-diff-tool/reference/architecture.md`
2. Read `~/Projects/agent-architecture-diff-tool/reference/signals.yaml`
3. Identify the target project (current working directory)
4. Dispatch 6 parallel subagents:

```markdown
## Analysis Workflow

### Step 1: Load Reference Files

Read the following files:
- `~/Projects/agent-architecture-diff-tool/reference/architecture.md`
- `~/Projects/agent-architecture-diff-tool/reference/signals.yaml`

### Step 2: Dispatch Parallel Subagents

Use the Agent tool to dispatch 6 subagents in parallel. Each subagent receives:
- The relevant section of architecture.md (dimensions + maturity levels)
- The relevant section of signals.yaml (detection signals)
- Instruction to scan the CURRENT WORKING DIRECTORY

**Subagent 1 — Harness Core (A1-A8):**
Scan for: Hooks, Permissions, Tools, Config, Resilience, Multi-model, Modes, Background.
Use file_signals and code_signals from signals.yaml.
For each dimension: report { dimension_id, score (0-5), evidence (file paths + code snippets), gaps, suggested_actions }.

**Subagent 2 — Harness Extensibility (A9-A16):**
Scan for: Skills/Plugins, Agent Dispatch, Output Control, Planning, MCP, Security, Observability, IDE.

**Subagent 3 — Harness Advanced (A17-A23):**
Scan for: Commands, SDK, Concurrency, Migration, File Safety, Sandbox, Computer Use.

**Subagent 4 — Context Engineering (B1-B5):**
Scan for: Context Assembly, Instruction Layering, Memory, History, Token Budget.

**Subagent 5 — Context Engineering (B6-B10):**
Scan for: Dynamic Injection, Retrieval Strategy, Multimodal Input, Eviction, Cache.

**Subagent 6 — Prompt Engineering (C1-C6):**
This subagent works differently — it reads actual prompt/instruction files found via files_to_read patterns,
then evaluates quality using evaluation_criteria questions.
Score each dimension qualitatively: 0 (absent), 1 (minimal), 2 (basic), 3 (adequate), 4 (good), 5 (excellent).
```

- [ ] **Step 3: Write the report generation section**

```markdown
### Step 3: Aggregate Results

After all 6 subagents return, aggregate their results into a single report.

### Step 4: Generate Report

Write the report to `agent-diff-report.md` in the current working directory.

Report structure:
[include the full report template from the spec]
```

- [ ] **Step 4: Write subagent prompt templates**

For each of the 6 subagents, write the exact prompt that will be passed to the Agent tool. The prompt must include:
- Which dimensions to evaluate
- The maturity level definitions for those dimensions
- The signals to search for
- The expected output format: `{ dimension_id, score, evidence, gaps, suggested_actions }`
- Instruction to scan only the current working directory

- [ ] **Step 5: Commit**

```bash
cd ~/Projects/agent-architecture-diff-tool
git add skill/agent-diff.md
git commit -m "feat: add /agent-diff Claude Code skill"
```

---

## Task 7: Install & Verify

- [ ] **Step 1: Symlink the skill to ~/.claude/skills/**

```bash
ln -s ~/Projects/agent-architecture-diff-tool/skill/agent-diff.md ~/.claude/skills/agent-diff.md
```

- [ ] **Step 2: Test on MaiAgentAI project**

In a new Claude Code session:
```bash
cd ~/Projects/MaiAgentAI
# then invoke /agent-diff
```

Review the generated `agent-diff-report.md`:
- Are all 39 dimensions scored?
- Are scores reasonable given what we know about MaiAgentAI?
- Is evidence cited with actual file paths?
- Are action plans actionable?

- [ ] **Step 3: Fix any issues found during testing**

Common issues to watch for:
- Subagent prompts too long (need to trim)
- Signals too broad (false positives) or too narrow (false negatives)
- Report format inconsistencies
- Missing dimensions in output

- [ ] **Step 4: Test on a second project**

Pick one of the numbered agent projects:
```bash
cd ~/Projects/MaiAgentAI/projects/01-qa-rag-agent
# invoke /agent-diff
```

Compare the two reports — scores should differ since these are different-complexity agents.

- [ ] **Step 5: Final commit**

```bash
cd ~/Projects/agent-architecture-diff-tool
git add -A
git commit -m "fix: refinements from integration testing"
```

---

## Task 8: Update OpenSpec Change

- [ ] **Step 1: Write the proposal artifact**

Write `openspec/changes/agent-architecture-diff-tool/proposal.md` in the quidproquo project based on the completed work.

- [ ] **Step 2: Mark the change as complete**

```bash
cd ~/Projects/quidproquo
openspec status --change "agent-architecture-diff-tool"
```

- [ ] **Step 3: Commit in quidproquo**

```bash
cd ~/Projects/quidproquo
git add openspec/changes/agent-architecture-diff-tool/
git add docs/superpowers/specs/2026-04-03-agent-architecture-diff-tool-design.md
git add docs/superpowers/plans/2026-04-03-agent-architecture-diff-tool.md
git commit -m "feat: add agent-architecture-diff-tool spec and plan"
```
