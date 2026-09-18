---
title: "Framework Update: CrewAI 1.15.22"
date: 2026-09-18
category: daily
type: digest
tags: [ai-agent, framework, daily, crewai]
lang: en
description: "CrewAI 1.15.22 adds an llm_overlay context variable that dynamically routes agent roles to different models at runtime, plus a validated integration catalog for CrewAI Platform."
tldr: "CrewAI 1.15.22 in three points: (1) a new `llm_overlay` context variable that routes a specific agent role to a different model at runtime, instead of hardcoding the model when the agent is created; (2) CrewAI Platform integration gains an application catalog, connection aliases, setup-time integration validation, and deployment-failure logging; (3) tracing now captures human feedback and pause events; no breaking changes in this release."
series:
  name: "AI Framework Changelog"
  order: 23
---

> 🌏 [中文版](/posts/daily/2026-09-18-framework-crewai-1.15.22)

## Release Info

| Field | Value |
|---|---|
| Framework | CrewAI |
| Version | v1.15.22 |
| Previous | v1.15.21 |
| Released | 2026-09-16 |
| Release Notes | [GitHub Release](https://github.com/crewAIInc/crewAI/releases/tag/1.15.22) |
| GitHub | [crewAIInc/crewAI](https://github.com/crewAIInc/crewAI) |
| Stars | 58.7k |

## Why This Release Matters

[The previous release covered here (1.15.18)](/en/posts/daily/2026-08-28-framework-crewai-1.15.18-en) promoted conversational Flow to a stable API; the in-between releases, 1.15.19 through 1.15.21, were pure bug-fix versions with no article of their own. 1.15.22 brings back something worth writing about. The core addition is `llm_overlay`: which model an agent role uses has historically been hardcoded at the moment you create the agent. `llm_overlay` lets you decide, at the context layer, which model a given role should route to for this particular run — far lighter weight than re-instantiating an agent, and useful for multi-agent deployments that want to switch models dynamically based on task difficulty, cost, or latency. The other thread running through this release is CrewAI Platform integration work — an application catalog, setup-time validation, deployment-failure logging — the more operational side of the project, reflecting that CrewAI's SaaS platform is advancing in step with the open-source framework.

## Key Changes

- **New `llm_overlay` context variable**: routes a specific agent role to a different model at runtime → no need to hardcode a model when creating the agent; you can decide at runtime which model a role should use based on task type or cost
- **Aliases as connection identifiers**: integration connections can now be referenced by alias instead of raw ID
- **Tracing captures human feedback and pause events**: feedback and pause actions in human-in-the-loop flows are now recorded in tracing
- **Deployment-failure reasons are logged**: when a deployment fails on CrewAI Platform, the failure reason is now retained for debugging
- **Platform integrations are validated during crew setup**: integration configuration is checked when a crew is created, instead of only surfacing at execution time
- **Platform tools added to the JSON crew wizard**: crews defined via JSON can now attach platform tools directly
- **CrewAI Platform application catalog exposed**: the list of available platform applications is now accessible via API
- **OpenRouter added as an embedding provider**: teams already routing models through OpenRouter can now use the same provider for embeddings
- **A batch of edge-case fixes**: inline skill definitions accept CRLF, text file URLs are read through the safe fetcher, streamed tool calls on Azure are keyed by the correct wire index, Gemini preserves file data content parts, `read_only` honors access timestamps, and every OpenAI reasoning model now receives `reasoning_effort`

## Breaking Changes

None in this release.

## Migration Guide

Upgrade directly — no code changes required.

```bash
pip install --upgrade crewai==1.15.22
```

To route a role to a different model at runtime with the new `llm_overlay`:

```python
from crewai import Agent, Crew, Task

researcher = Agent(
    role="Researcher",
    goal="...",
    backstory="...",
    llm="gpt-4o-mini",  # default model
)

# Route the Researcher role to a different model at kickoff time via llm_overlay
crew = Crew(agents=[researcher], tasks=[...])
crew.kickoff(inputs={}, llm_overlay={"Researcher": "gpt-4o"})
```

## How This Compares to Other Frameworks

Runtime model switching like `llm_overlay` currently requires manually swapping model objects inside graph or agent logic in Pydantic AI and LangGraph; CrewAI packages it as a context-layer overlay parameter, which fits more naturally with role-based multi-agent design, where the role stays fixed but the model underneath can vary. The CrewAI Platform-side work — the application catalog, setup validation — follows a pattern increasingly common among open-source framework vendors: keep the core framework open source, then use a managed platform layer to add the observability and integration management enterprises want. That's the same direction Mastra Platform and Agno's AgentOS are heading.

## Today's Takeaway

I used to assume that "switching models" in a multi-agent framework should be a static decision made when an agent is created. Seeing `llm_overlay` turn it into a context variable that can be overridden at runtime made it clear: role and model are actually two independently variable dimensions. The same "Researcher" role can use a cheap model for simple tasks and dynamically switch to a stronger one for hard ones, without maintaining a separate agent definition for each — real, usable flexibility for cost-sensitive production deployments.

## References

- [CrewAI 1.15.22 — GitHub Release](https://github.com/crewAIInc/crewAI/releases/tag/1.15.22)
- [crewAIInc/crewAI — GitHub](https://github.com/crewAIInc/crewAI)
- [CrewAI 1.15.18 — previous framework update](/en/posts/daily/2026-08-28-framework-crewai-1.15.18-en)
- [Full Changelog: 1.15.21...1.15.22](https://github.com/crewAIInc/crewAI/compare/1.15.21...1.15.22)
