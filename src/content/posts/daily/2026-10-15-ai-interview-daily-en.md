---
title: "AI Engineer Interview Daily — 2026-10-15: LLM & Agent Engineering"
date: 2026-10-15
category: daily
type: digest
tags: [ai-engineer-interview, daily, llm-engineering]
lang: en
description: "Thursday's rotation is LLM & Agent Engineering — when to split one agent into several, how to draw tool boundaries, and which half of the problem MCP and A2A each cover — plus a design question on whether to split a coding assistant into planner, coder and reviewer agents."
tldr: "Today's practice is the architecture call on splitting agents: every hand-off is another step that can fail, and a 0.95 per-step success rate compounds to about 0.60 over 10 steps, so multi-agent designs only pay off when each worker's scope is narrow; keep tools few and well-scoped, because every tool definition costs context on every request and adds one more wrong choice; MCP connects an agent down to tools and data while A2A delegates long-running tasks between agents, and agents in one codebase should just use the framework's own orchestration; MCP tools, resources and prompts are controlled by different parties, and hints like readOnlyHint are not authorization — the server must enforce it. The practice question is adapted from systemdesign.academy's multi-agent system design problem."
series:
  name: "AI Engineer Interview Daily"
  order: 57
---

> 🌏 [中文版](/posts/daily/2026-10-15-ai-interview-daily)

## Today's Topic

Thursday is LLM & Agent Engineering. Recent weeks covered agent failure modes, termination conditions and evaluation metrics. Today moves one step earlier, to an architecture decision: when one agent isn't reliable enough, do you split it into several agents or fix its tools? When an interviewer says "design a multi-agent system," they are often waiting for you to say that most designs should be one agent with better tools, and to explain who catches the step that goes wrong once you do split.

## Core Concepts Cheat Sheet

### Reliability compounds: every hand-off is another place to fail

Each agent step has some chance of failing. At a 0.95 per-step success rate, 10 steps leave you at about 0.60 and 20 steps at about 0.36. Splitting one agent into several adds hand-off steps, and each hand-off multiplies in again. Multiple agents only pay off when each worker is narrow enough that its per-step success rate rises noticeably: a worker with three tools and one job beats a generalist holding thirty.

### Tool boundaries: few and well-scoped beats many and overlapping

Every tool definition takes up context on every request that carries the tool list, and every extra tool is one more option the model can pick wrongly. In practice a dozen clearly bounded tools usually beat forty overlapping ones; check by comparing tool-selection errors and task completion. Use strict schemas for arguments and validate them before execution. Actions that write, charge money or send email should require human approval by default.

### MCP and A2A cover different directions

MCP is vertical: an agent reaching down to tools and data through request/response calls, with a passive system on the other end. A2A is horizontal: one agent delegating a task to another agent that has its own model and state, with a task lifecycle that may run long and stream progress. Rule of thumb: if all your agents live in one codebase and one framework, use the framework's built-in orchestration and skip the extra network protocol; reach for A2A when agents come from different teams or vendors.

### MCP's three surfaces have different controllers, and hints are not authorization

An MCP server exposes three things: tools, which the model chooses to call; resources, which the host application decides to put in context; and prompt templates, which the user picks. Annotations such as `readOnlyHint` are hints, and the host must not treat them as guarantees. Real authorization belongs on the server, checking identity, operation and target resource on every request.

## Today's Practice Question

### The Question

Your team runs a coding assistant agent that reads the repo, edits files, runs tests and opens pull requests. Its error rate has been climbing, and someone proposes splitting it into planner, coder and reviewer agents. How do you evaluate the proposal?

**Source**: adapted from systemdesign.academy's multi-agent system design interview problem　**Difficulty**: intermediate　**Round**: onsite (LLM system design)

### How to Break It Down

1. **Clarify first**: what kind of errors are rising? Wrong tool, bad arguments, edits to the wrong files, or PRs opened with failing tests? How many steps does a task take today, and how many tools are attached? Are there traces to look at?
2. **Set up the framework**: do the reliability math. Three agents add at least two hand-offs, and each hand-off can drop context or pass the wrong format. The split only wins if each agent's per-step success rate rises enough to cover the extra steps.
3. **Go to the core trade-off**: most errors can be fixed at the tool layer first — merge overlapping tools, tighten schemas, make "open PR" a tool that refuses unless tests pass. The reviewer's real value is independent verification, which can start as a fixed check (run tests, run the linter, compare the diff scope) rather than another LLM agent.
4. **Close**: propose a measurable experiment. Ship the tool-layer fixes first and compare tool-selection errors and task completion in the traces; split agents only if that isn't enough, and split off only the most independent piece.

### Sample Answer (What You'd Actually Say)

> **Diagnose before splitting.** I'd pull the last 200 failed traces and sort the errors into four buckets: wrong tool, bad arguments, wrong edit scope, and missing verification. If most of them are wrong-tool errors, the problem is tool boundaries, not the number of agents.
>
> **Fix the tool layer first.** Merge overlapping tools, move arguments to strict schemas validated before execution, and add a precondition to the PR tool so it rejects any call while tests are failing. None of this adds hand-offs, so it's the cheapest win in the reliability math.
>
> **If I split anything, it's the reviewer, and it starts deterministic.** At 0.95 per step, a 12-step task succeeds about 0.54 of the time; add two hand-offs for 14 steps without improving the per-step rate and it drops to about 0.49. So I'd first make review a fixed step that runs tests and checks diff scope, and measure completion. If we still need semantic review, I'd add a reviewer agent that only reads the diff and can only return pass or a reason for rejection, and trace every hand-off's input and output with OpenTelemetry.

### Self-Check List

Use this table to check your answer for gaps:

| Check item | Covered? |
|---------|---------|
| Classify errors from traces before deciding to split | |
| Reliability compounds: hand-offs themselves can fail | |
| Tool-layer fixes (merge tools, strict schemas, preconditions) | |
| Every hand-off's input and output is traceable | |
| Verification starts as deterministic checks, not necessarily another LLM | |
| Bonus: distinguish in-framework orchestration from cross-team A2A | |

## Further Reading

- [Multi-Agent System Design Interview: The Reliability Math](https://systemdesign.academy/interview/design-multi-agent-system) — uses compounding reliability to explain why most designs should be one agent with better tools
- [Model Context Protocol System Design: The Tool Boundary](https://formation.dev/blog/mcp-system-design-tool-boundaries) — MCP's host/client/server boundary, who controls each surface, and where authorization lives
- [A2A vs MCP: Picking the Right Protocol for Your Multi-Agent System](https://joinloop.co.in/blog/a2a-vs-mcp-protocol-guide) — side-by-side on interaction shape, state and trust assumptions

## References

- [Multi-Agent System Design Interview: The Reliability Math — systemdesign.academy](https://systemdesign.academy/interview/design-multi-agent-system) — compounding reliability numbers, narrow workers, source of the practice question
- [Model Context Protocol System Design: The Tool Boundary — Formation](https://formation.dev/blog/mcp-system-design-tool-boundaries) — tool-count trade-offs, MCP's three surfaces, hints are not authorization
- [MCP Specification: Tools](https://modelcontextprotocol.io/specification/2025-06-18/server/tools) — official definition of model-controlled tools
- [A2A vs MCP — Loop](https://joinloop.co.in/blog/a2a-vs-mcp-protocol-guide) — how MCP and A2A split the work
- [AI Engineer Interview Preparation Guide — AI Interviewer](https://ai-interviewer.tech/blog/ai-engineer-interview-preparation-guide) — guarding against wrong tools and bad arguments, human approval for irreversible actions
