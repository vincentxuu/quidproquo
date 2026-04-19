## Context

Developers building AI agents lack a systematic way to assess their agent's architectural maturity. Claude Code's source (`~/Projects/claude-code-source`) is one of the most mature agent harnesses available — it covers 39 capability dimensions across Harness Engineering (23), Context Engineering (10), and Prompt Engineering (6).

The detailed design spec already exists at `docs/superpowers/specs/2026-04-03-agent-architecture-diff-tool-design.md` with all 39 dimensions fully defined. The implementation plan exists at `docs/superpowers/plans/2026-04-03-agent-architecture-diff-tool.md`.

This design document covers the architectural decisions not covered in those files.

## Goals / Non-Goals

**Goals:**
- Extract a reusable, language-agnostic capability reference from Claude Code's source
- Build a Claude Code skill that produces actionable gap reports for any agent project
- Support both TypeScript and Python agent projects
- Make the reference document valuable as standalone educational material

**Non-Goals:**
- CLI tool (deferred — skill-first approach)
- FastAPI server / HTTP API
- Automated CI/CD integration
- Importing from or depending on MaiAgentAI/shared
- Real-time monitoring or continuous assessment

## Decisions

### D1: Two-file reference design (architecture.md + signals.yaml)

**Decision:** Separate human-readable reference (architecture.md) from machine-readable signals (signals.yaml).

**Alternatives considered:**
- Single file with embedded YAML: Rejected — makes architecture.md hard to read as educational material
- Database/JSON: Rejected — YAML is more readable for the signal definitions, and these files are small enough

**Rationale:** The reference document serves two audiences: humans learning about agent architecture, and the skill that needs structured signals for scanning. Separating them optimizes for both.

### D2: 6 parallel subagents for scanning

**Decision:** Dispatch 6 subagents in parallel, each handling a subset of dimensions.

**Grouping:**
- Subagent 1: Harness A1-A8 (core infrastructure)
- Subagent 2: Harness A9-A16 (extensibility + operations)
- Subagent 3: Harness A17-A23 (advanced capabilities)
- Subagent 4: Context B1-B5
- Subagent 5: Context B6-B10
- Subagent 6: Prompt C1-C6 (semantic evaluation — different approach)

**Alternatives considered:**
- Single subagent scanning all 39: Rejected — too much work for one context window, risk of quality degradation
- 39 subagents (one per dimension): Rejected — too much overhead, diminishing returns
- 3 subagents (one per category): Rejected — Harness (23 dimensions) is too large for one subagent

**Rationale:** 6 is the sweet spot — each subagent handles 5-10 dimensions, fits comfortably in context, and all run in parallel for speed.

### D3: Maturity levels 0-5 for structural dimensions, qualitative scoring for prompt dimensions

**Decision:** Harness (A) and Context (B) dimensions use quantitative 0-5 maturity levels. Prompt (C) dimensions use qualitative evaluation criteria.

**Rationale:** Structural capabilities (hooks, permissions, tools) can be objectively detected via file/code patterns. Prompt quality is inherently subjective and requires the LLM to read and evaluate actual content. Using the same 0-5 scale but with different evaluation methods per category.

### D4: Hardcoded reference file path

**Decision:** The skill reads reference files from `~/Projects/agent-architecture-diff-tool/reference/`. This path is hardcoded in the skill.

**Alternatives considered:**
- Environment variable: Rejected — adds setup friction
- Relative to skill location: Rejected — skill is symlinked, relative paths unreliable
- Bundled in skill file: Rejected — skill would be enormous (39 dimensions + signals)

**Rationale:** Simplest approach. If the user moves the project, they update one path in the skill file.

### D5: Scan current working directory as target

**Decision:** The skill always analyzes the project in the current working directory.

**Rationale:** This is the natural Claude Code workflow — you `cd` into a project and run commands. No need for path arguments.

## Risks / Trade-offs

### R1: Signal accuracy varies by language/framework
**Risk:** Signals designed for TypeScript agents may miss Python equivalents (e.g., `@middleware` decorator vs `middleware()` function).
**Mitigation:** Include both TS and Python patterns in signals.yaml. Test on both MaiAgentAI (Python) and other TS projects. Accept that signals are heuristics, not guarantees — the LLM evaluates context around matches.

### R2: Reference document becomes stale
**Risk:** Claude Code evolves, but architecture.md stays static.
**Mitigation:** Reference file is a snapshot of capabilities, not a live mirror. Re-run Phase 1 when claude-code-source has significant updates. Version the reference with a date header.

### R3: Subagent context limits
**Risk:** Large agent projects may produce too much signal data for a single subagent.
**Mitigation:** Subagents use targeted glob/grep (not full file reads). Signals include weight (high/medium/low) to prioritize what to examine. Subagents report top evidence, not exhaustive matches.

### R4: Score inflation/deflation
**Risk:** Scores may not be consistent across runs or across different projects.
**Mitigation:** Maturity levels have concrete, observable criteria (not subjective). The skill instructs subagents to cite specific evidence (file paths, code snippets) for every score. Reports include evidence so users can verify.
