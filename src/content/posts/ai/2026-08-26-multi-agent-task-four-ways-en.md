---
title: "One Multi-Agent Task, Four Implementations: Omnigent YAML vs LangGraph vs CrewAI vs Goose"
date: 2026-08-26
category: ai
type: deep-dive
tags: [multi-agent, omnigent, langgraph, crewai, goose]
lang: en
tldr: "The same Polly task — parallel git worktrees plus cross-vendor review — implemented four ways: Omnigent YAML governs at the Server layer, LangGraph controls flow with a StateGraph, CrewAI assembles roles quickly, and Goose ships a desktop Recipe, compared on tokens, latency, and maintainability."
description: "Using Omnigent's Polly pattern (parallel worktrees + cross-vendor review) as a fixed task, this post implements and compares minimal working code in Omnigent YAML, LangGraph, CrewAI, and Goose, contrasting tokens, latency, governance, and maintainability with selection guidance."
series:
  name: "Meta-Harness 與 Agent 治理"
  order: 3
---

> 🌏 [中文版](/posts/ai/2026-08-26-multi-agent-task-four-ways)

The previous post placed [Omnigent](https://github.com/omnigent-ai/omnigent) ([omnigent.ai](https://omnigent.ai/)), [Zed ACP](https://agentclientprotocol.com/), [Vercel HarnessAgent](https://vercel.com/changelog/use-acp-compatible-harnesses-with-the-ai-sdk-harness-layer) and [Cloudflare Flue](https://blog.cloudflare.com/agents-platform-flue-sdk/) into a four-layer model. This post gets concrete: one task, four implementations.

The reference task is [Omnigent's built-in Polly](https://github.com/omnigent-ai/omnigent/tree/main/examples/polly) pattern — the most representative multi-agent collaboration template in the series: **plan → parallel git worktree delegation → cross-vendor review → aggregate and merge**. Problem statement: "Add rate-limit middleware to the API, including tests and docs."

## The baseline: the Polly Pattern

```
Issue: "Add rate-limit middleware to API"
  │
  ├─ Planner: splits into 3 sub-tasks (middleware / tests / docs)
  ├─ Workers: each implements in an isolated git worktree, in parallel
  ├─ Reviewers: each diff is reviewed by a different vendor model
  │             (e.g., author uses Claude, reviewer uses GPT)
  └─ Aggregator: collects reviews; a human decides to merge
```

Two observable collaboration properties matter most: **parallel worktree isolation** and **cross-vendor review routing**. They are exactly where the four frameworks diverge.

## 1. [Omnigent](https://github.com/omnigent-ai/omnigent) YAML — governance at the Server layer

Polly is YAML plus Server-side Policy and Session. Its value is portability, governance, and collaboration.

```yaml
# examples/polly/polly.yaml (abridged)
name: polly
prompt: |
  You are Polly, an orchestrator. You do not write code yourself.
  Plan the task, delegate to sub-agents in parallel git worktrees,
  then route each diff to a cross-vendor reviewer.

executor:
  harness: claude-sdk   # one-line switch: claude-native / codex / pi / opencode ...

tools:
  planner:
    type: agent
    prompt: Break the issue into sub-tasks with acceptance criteria.
  worker_claude:
    type: agent
    prompt: Implement one sub-task in an isolated git worktree.
    executor: { harness: claude-sdk }
    tools:
      shell: { type: function, callable: tools.shell.exec }
  worker_codex:
    type: agent
    prompt: Implement one sub-task in an isolated git worktree.
    executor: { harness: codex }
  reviewer_gpt:
    type: agent
    executor: { harness: openai-agents }
    prompt: Review the diff. Approve or request changes with rationale.
  reviewer_claude:
    type: agent
    executor: { harness: claude-sdk }
    prompt: Review the diff. Approve or request changes with rationale.

policies:
  budget:
    type: function
    handler: omnigent.policies.builtins.cost.cost_budget
    factory_params: { max_cost_usd: 5.00 }
  ask_on_push:
    type: function
    handler: omnigent.policies.builtins.safety.ask_on_os_tools
```

Run: `omnigent run examples/polly --harness claude-sdk` or `omnigent start` then open `http://localhost:6767` and share the Session URL.

**Philosophy**: orchestration is declarative YAML; governance lives in [Server-side Policies](https://omnigent.ai/docs/policies/overview) (`allow / deny / ask`) and the [Omnibox sandbox](https://omnigent.ai/docs/policies/os-sandbox). Cross-vendor capability comes from binding each sub-agent to a different `harness`, not from prompt tricks.

**Good fit**: teams already using multiple harnesses who need shareable live Sessions and auditable cost and permission guardrails.
**Not a good fit**: single-harness, single-machine use; low tolerance for alpha (`0.11.0.dev0`); or Windows-native FS/network isolation needs.

## 2. [LangGraph](https://github.com/langchain-ai/langgraph) — precise flow control with StateGraph

[LangGraph](https://langchain-ai.github.io/langgraph/) ([docs](https://langchain-ai.github.io/langgraph/)) is LangChain's orchestration layer built around **StateGraph + conditional edges**. Parallel fan-out uses the `Send` API; state merging is governed by reducers.

```python
from langgraph.graph import StateGraph, START, END
from langgraph.types import Send
from typing import TypedDict, Annotated
import operator

class State(TypedDict):
    issue: str
    plan: list[str]
    diffs: Annotated[list[str], operator.add]
    reviews: Annotated[list[str], operator.add]

def planner(state: State):
    return {"plan": ["middleware", "tests", "docs"]}

def worker(state: dict):
    diff = run_in_worktree(state["sub_task"])
    return {"diffs": [diff]}

def fanout(state: State):
    return [Send("worker", {"sub_task": t}) for t in state["plan"]]

def reviewer(state: State):
    reviews = [review_with_other_vendor(d) for d in state["diffs"]]
    return {"reviews": reviews}

g = StateGraph(State)
g.add_node("planner", planner)
g.add_node("worker", worker)
g.add_node("reviewer", reviewer)
g.add_edge(START, "planner")
g.add_conditional_edges("planner", fanout, ["worker"])
g.add_edge("worker", "reviewer")
g.add_edge("reviewer", END)
app = g.compile()
app.invoke({"issue": "Add rate-limit middleware", "diffs": [], "reviews": []})
```

**Philosophy**: the workflow is a graph where every node's input and output is observable state. `Send` makes "plan then run N workers in parallel" a first-class pattern — ideal when you need precise branching and join semantics.

**Good fit**: complex flows with conditional branches and traceable state, especially inside the LangChain ecosystem.
**Not a good fit**: quick role-based assembly or one-line cross-vendor harness swapping (LangGraph does not abstract harnesses; you wrap them yourself).

## 3. [CrewAI](https://github.com/crewAIInc/crewAI) — fast role-play assembly

[CrewAI](https://crewai.com/) ([docs](https://docs.crewai.com/)) sells **roles, tasks, and Crews**. Define each agent's role and goal in natural language — closest to "get a group of people in a room."

```python
from crewai import Agent, Task, Crew, Process

planner = Agent(role="Planner", goal="Break the issue into sub-tasks",
                backstory="You are a senior planner.", verbose=True)
coder_a = Agent(role="Backend Coder", goal="Implement middleware in worktree A",
                backstory="You write clean Python middleware.")
coder_b = Agent(role="Test Engineer", goal="Add tests in worktree B",
                backstory="You care about coverage.")
reviewer = Agent(role="Reviewer", goal="Cross-vendor review",
                 backstory="You review diffs from a different model family.")

t1 = Task(description="Plan sub-tasks for: {issue}", expected_output="3 sub-tasks", agent=planner)
t2 = Task(description="Implement middleware", expected_output="diff in worktree A", agent=coder_a)
t3 = Task(description="Add tests", expected_output="diff in worktree B", agent=coder_b)
t4 = Task(description="Review all diffs and list blockers", expected_output="review report", agent=reviewer)

crew = Crew(agents=[planner, coder_a, coder_b, reviewer],
            tasks=[t1, t2, t3, t4], process=Process.sequential, verbose=True)
crew.kickoff(inputs={"issue": "Add rate-limit middleware"})
# For parallel worktrees, use async_execution=True or nested crews
```

**Philosophy**: minimize the cost of defining a workflow by leaning on role descriptions and task prompts. Parallelism comes via `async_execution` and worktree wrappers, but isolation granularity and scheduling observability are weaker than LangGraph or Omnigent.

**Good fit**: prototypes, teams where non-engineers need to read the workflow, quick demos of multi-agent collaboration.
**Not a good fit**: strong worktree isolation, auditable cross-vendor routing, or flows that need precise replay and debugging.

## 4. [Goose](https://github.com/block/goose) — desktop automation via Recipe

[Goose](https://block.github.io/goose/) ([website](https://block.github.io/goose/)) is Block's open-source desktop agent. Its [Recipe](https://block.github.io/goose/docs/guides/recipes/) is a shareable YAML automation script — a natural way to turn Polly's steps into a one-click desktop task.

```yaml
# recipe.yaml
version: 1.0.0
title: polly-rate-limit
description: Plan, parallel worktree, cross-vendor review
prompt: |
  Implement rate-limit middleware for the API.
  Steps: plan sub-tasks, create git worktrees, implement in parallel,
  then review each diff with a different model.
instructions: |
  Use shell tools to create worktrees under .worktrees/,
  run tests in each worktree, and collect diffs.
activities:
  - Plan sub-tasks and write to plan.md
  - Create worktrees: git worktree add .worktrees/a -b feat/rate-limit-a
  - Implement and test in each worktree
  - Review diffs and output report
extensions:
  - type: builtin
    name: developer
    display_name: Developer
    timeout: 300
```

Run: `goose run --recipe recipe.yaml` or load the Recipe in the Goose desktop app. Extend via [MCP extensions](https://block.github.io/goose/docs/mcp/) for databases, browsers, or custom tools.

**Philosophy**: automation as a shareable desktop script with an emphasis on local execution and one-click replay. Parallel worktrees are created via shell tools; cross-vendor review requires separate model configs inside the Recipe — less declarative than Omnigent's `executor.harness`.

**Good fit**: personal desktop automation, solo validation, Recipe-based team sharing.
**Not a good fit**: Server-side governance, persisted shared Sessions, or per-task cloud sandbox isolation.

## Side-by-side comparison

| Dimension | [Omnigent](https://github.com/omnigent-ai/omnigent) YAML | [LangGraph](https://langchain-ai.github.io/langgraph/) | [CrewAI](https://docs.crewai.com/) | [Goose](https://block.github.io/goose/) |
|---|---|---|---|---|
| Abstraction | meta-harness above harnesses | in-harness flow graph | role-and-task collaboration | single-machine Recipe automation |
| Parallel worktrees | native (Polly) | `Send` fan-out, you wrap git | `async_execution` + tool wrappers | shell tools, you build it |
| Cross-vendor review | each sub-agent binds a different harness | route to different models yourself | each Agent with a different LLM | switch models inside Recipe |
| Governance | three-layer Policy + Omnibox sandbox | none built-in, add externally | none built-in | local permissions + extensions |
| Observability | persisted Session + WebSocket sync | state and graph traversal | logs and verbose output | local logs and Recipe report |
| Best for | multi-harness teams needing collaboration and audit | engineering teams needing precise flow control | rapid prototyping and non-engineering readability | individuals and small-team automation |

## Tokens, latency, and maintainability

Qualitative comparison — actual numbers depend on model choice, task granularity, and tool-call count. Run the same issue three times per stack and average.

- **Tokens**: Omnigent and LangGraph have similar orchestration overhead; total tokens are dominated by `sub-tasks × model calls`. CrewAI's role prompts tend to add 10–20% system-prompt tokens; Goose Recipes are the leanest but grow once review logic is added back.
- **Latency**: with three parallel workers, end-to-end latency approaches `max(worker)` rather than `sum(worker)`. Omnigent and LangGraph achieve this via native fan-out; CrewAI defaults to `Process.sequential` and needs explicit async; Goose depends on how shell parallelism is implemented.
- **Maintainability**: adding a reviewer in Omnigent is a one-line `executor.harness` change with policies centralized in `policies`; LangGraph makes flow changes traceable but requires editing nodes and edges per branch; CrewAI adds roles fastest but workflow is implicit in task ordering and can bloat; Goose Recipes are the most readable but grow quickly under complex branching and audit requirements.

Selection heuristic:

- Already juggling multiple harnesses and need shareable live Sessions → [Omnigent](https://github.com/omnigent-ai/omnigent).
- Complex flows needing reproducible conditional branches → [LangGraph](https://langchain-ai.github.io/langgraph/).
- Fastest way to get a group of roles moving → [CrewAI](https://docs.crewai.com/).
- Single-machine automation you want to share as a desktop script → [Goose](https://block.github.io/goose/).

They can also be stacked: Omnigent as the control plane, LangGraph for the worker's precise flow, CrewAI role descriptions for review, and a Goose Recipe for external distribution.

## Overall

The same task reveals four different places to save effort: [Omnigent](https://github.com/omnigent-ai/omnigent) saves cross-harness governance and collaboration cost, [LangGraph](https://langchain-ai.github.io/langgraph/) saves debugging cost for complex flows, [CrewAI](https://docs.crewai.com/) saves the cost of getting a team together, and [Goose](https://block.github.io/goose/) saves the cost of turning steps into a replayable script. There is no universal winner — only which cost hurts most right now.

The next post returns to governance internals: Omnibox egress policies and secretless credential brokering for enterprise deployment.

## References

- [Omnigent — a meta-harness for building and running AI agents](https://omnigent.ai/)
- [omnigent-ai/omnigent](https://github.com/omnigent-ai/omnigent) / [Polly example](https://github.com/omnigent-ai/omnigent/tree/main/examples/polly) / [Agent YAML Spec](https://github.com/omnigent-ai/omnigent/blob/main/docs/AGENT_YAML_SPEC.md)
- [Omnibox sandbox](https://omnigent.ai/docs/policies/os-sandbox) / [Policy overview](https://omnigent.ai/docs/policies/overview)
- [LangGraph docs](https://langchain-ai.github.io/langgraph/) / [LangGraph GitHub](https://github.com/langchain-ai/langgraph)
- [CrewAI docs](https://docs.crewai.com/) / [CrewAI GitHub](https://github.com/crewAIInc/crewAI)
- [Goose website](https://block.github.io/goose/) / [Goose GitHub](https://github.com/block/goose) / [Goose Recipe guide](https://block.github.io/goose/docs/guides/recipes/)
- [Block/Goose extensions and MCP](https://block.github.io/goose/docs/mcp/) / [What Is a Meta-Harness? — codepick.dev](https://codepick.dev/en/guides/meta-harness-2026/)
