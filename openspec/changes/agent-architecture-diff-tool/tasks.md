## 1. Project Setup

- [x] 1.1 Create project directory `~/Projects/agent-architecture-diff-tool/` with `reference/` and `skill/` subdirectories, git init
- [x] 1.2 Create README.md with project overview, architecture diagram, installation and usage instructions

## 2. Reference Architecture — Harness Engineering

- [x] 2.1 Write architecture.md header and category intro for Harness Engineering
- [x] 2.2 Write dimensions A1-A8 (Hooks, Permissions, Tools, Config, Resilience, Multi-Model, Modes, Background) — read claude-code-source files for each dimension to write accurate Why, Reference, and Maturity Levels
- [x] 2.3 Write dimensions A9-A16 (Skills/Plugins, Agent Dispatch, Output Control, Planning, MCP, Security, Observability, IDE Integration)
- [x] 2.4 Write dimensions A17-A23 (Commands, SDK, Concurrency, Migration, File Safety, Sandbox, Computer Use)

## 3. Reference Architecture — Context Engineering

- [x] 3.1 Write category intro and dimensions B1-B5 (Context Assembly, Instruction Layering, Memory, History, Token Budget)
- [x] 3.2 Write dimensions B6-B10 (Dynamic Injection, Retrieval Strategy, Multimodal Input, Eviction, Cache)

## 4. Reference Architecture — Prompt Engineering

- [x] 4.1 Write category intro and all 6 dimensions (C1-C6) — read actual prompt files in claude-code-source to quote real examples for each pattern

## 5. Detection Signals

- [x] 5.1 Write signals.yaml header and Harness Engineering signals (A1-A23) with file_signals, code_signals, absence_signals per dimension, covering both TypeScript and Python patterns
- [x] 5.2 Write Context Engineering signals (B1-B10)
- [x] 5.3 Write Prompt Engineering evaluation criteria (C1-C6) with files_to_read and evaluation_criteria questions

## 6. Skill Implementation

- [x] 6.1 Write agent-diff.md skill frontmatter, overview, and prerequisites section
- [x] 6.2 Write the analysis workflow: reference file loading, subagent dispatch instructions for all 6 subagents with exact prompt templates
- [x] 6.3 Write report generation section with full report template and aggregation logic

## 7. Installation & Verification

- [x] 7.1 Symlink skill to `~/.claude/skills/agent-diff.md`
- [x] 7.2 Test `/agent-diff` on `~/Projects/MaiAgentAI` — verify all 39 dimensions scored with evidence
- [x] 7.3 Test `/agent-diff` on a second agent project — verify scores differ appropriately
- [x] 7.4 Fix any issues found during testing (signal accuracy, report format, subagent prompts)
