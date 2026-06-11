---
title: "Lessons from the Trenches: What AI Native Teams Must Get Right"
date: 2026-04-17
type: guide
category: ai
tags: [ai-native, coding-agent, spec-driven-development, monorepo, ci-cd, code-review, agent-platform, security, observability, git-worktree, adr, human-in-the-loop, cost-management, model-selection, developer-role, failure-handling]
lang: en
tldr: "Not everyone should use a coding agent to modify code directly. AI Native teams need interface specs, test-first development, monorepo, security guardrails, human-in-the-loop, and token budget controls. Building an agent platform layer on top of coding agents and clearly redefining developer roles is the right path forward."
description: "Practical lessons learned from transitioning to AI Native development: agent platform, interface-first, test-first, monorepo, project-level configuration, CI/CD, code review, small PRs, context engineering, branch isolation, security guardrails, agent observability, documentation as context, human-in-the-loop, token budget management, model selection strategy, developer role transformation, and agent failure handling — each backed by industry literature."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-17-ai-native-team-practices)

These aren't advanced techniques — for many people, they're probably basics. But every single one of these came from painful lessons learned while actually leading a team through the AI Native transition. Each one is something I only truly understood after hitting the wall.

---

## 1. Don't Let Everyone Use Coding Agents Directly on the Codebase

This was the first wall we hit. Giving everyone direct access to coding agents resulted in: inconsistent coding styles, architecture being randomly modified, and wildly varying PR quality. Everyone used different prompts, so the agent output was different every time.

The right approach is to build an **agent platform** layer on top of the coding agent, designing team-specific Development / Testing / Review Agents. These agents need configured rules, commands, skills, and references to ensure consistent output.

You can achieve some of this through the Claude Marketplace and similar tools, but there's still probabilistic variance. Wrapping your own agent platform layer on top of the coding agent gives you much better control.

This aligns with the 2026 [Multi-Agent Architecture](https://developers.openai.com/codex/guides/build-ai-native-engineering-team) trend: Planner → Architect → Implementer → Tester → Reviewer, with each agent handling its own role rather than one general-purpose agent doing everything.

## 2. Define Interfaces Before Development

Yes, this is equally important in human development, but it's even more critical in AI Native development.

This includes but isn't limited to:
- Frontend hook definitions
- Backend API request/response schemas
- DB schemas

Without clear interfaces, the agent is guessing. Guessed outputs lead to frontend-backend mismatches, schema conflicts, and ultimately more time spent fixing things.

This is the core concept of **Spec-Driven Development (SDD)**. [GitHub's spec-kit](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/) and [Kiro](https://kiro.dev/) both promote this approach: write the contract first (scope, constraints, verification criteria), then let the agent implement. The interfaces you define are part of the spec.

[Martin Fowler's SDD series](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html) is particularly worth reading — he provides a thorough comparison of the design philosophies behind Kiro, spec-kit, and Tessl.

## 3. Don't Write Code by Hand, But Do Write Tests by Hand

The developer's role shifts from writing production code to writing acceptance criteria. Write all unit tests and e2e tests first — these are your acceptance criteria.

Can you have AI write the tests? Yes. But you absolutely must review them yourself to ensure the test logic actually matches the behavior you want, not what the agent "thinks" is correct.

This maps to the most critical 2026 pattern: **Agent-Driven Test Loop** — the agent writes code, runs tests, fixes bugs, and reruns, all before opening a PR. But the quality of this loop depends entirely on how precise your tests are.

[Addy Osmani's LLM coding workflow](https://addyosmani.com/blog/ai-coding-workflow/) emphasizes this shift: human value isn't in writing code — it's in defining "what correct looks like."

## 4. Monorepo

Otherwise the context deprivation is just too painful.

While there are many ways to handle polyrepo context issues (cross-repo context injection, shared AGENTS.md), monorepo is simply the most direct solution. The agent can see all related code, shared types, and internal packages without you manually feeding context.

[Spectro Cloud](https://www.spectrocloud.com/blog/will-ai-turn-2026-into-the-year-of-the-monorepo) directly asked: "Will AI turn 2026 into the year of the monorepo?" The answer appears to be yes.

Combined with the [nested AGENTS.md](https://dev.to/datadog-frontend-dev/steering-ai-agents-in-monorepos-with-agentsmd-13g0) closest-wins strategy — global rules at the root level, domain rules in subdirectories — the agent automatically loads the most relevant context without getting overwhelmed by irrelevant information.

[Nx's AI agent skills](https://nx.dev/blog/nx-ai-agent-skills) demonstrate another approach: letting agents navigate the monorepo through the project graph, loading context on demand rather than brute-forcing everything into the context window.

## 5. Project-Level Hooks / Rules / CLAUDE.md / AGENTS.md

This is the infrastructure for keeping team agent behavior consistent.

- **CLAUDE.md / AGENTS.md**: Rule files in the project root that agents automatically read when starting a session
- **Hooks**: Shell commands triggered on specific events (tool calls, commits) to enforce lint, format, and security checks
- **Rules / Skills**: Team coding conventions and architecture decisions encoded as agent-understandable instructions

The key point from [HumanLayer's article](https://www.humanlayer.dev/blog/writing-a-good-claude-md): **fewer instructions is better — only include what's universally applicable**. Don't turn CLAUDE.md into an encyclopedia; the agent's context window is finite too.

[DeployHQ's cross-tool configuration guide](https://www.deployhq.com/blog/ai-coding-config-files-guide) is also worth referencing, covering CLAUDE.md, AGENTS.md, Cursor Rules, and other mainstream tool configurations.

## 6. Complete CI/CD

This part isn't much different from human development. You still need lint, test, build, and deploy pipelines — every single one.

The difference is: AI-generated code is more likely to break on edge cases, making CI's gatekeeper role more important than ever. It's not "just run CI" — CI needs to cover enough cases.

## 7. More Rigorous Code Review and Feature Acceptance

AI makes writing code cheap, but review becomes the bottleneck.

Every line of AI-generated code should be reviewed as if "written by a junior developer": Is the logic correct? Are there security issues? Did it sneak in unnecessary dependencies? Did it modify things it shouldn't have?

[Cortex's 2026 engineering leader guide](https://www.cortex.io/post/the-engineering-leaders-guide-to-ai-tools-for-developers-in-2026) articulates this shift clearly: the senior engineer's role moves from writing code to reviewing AI output, defining system constraints, and making architectural decisions.

## 8. Keep PRs as Small as Possible

Both humans and AI have limited context windows.

Large PRs aren't just hard for humans to review — agent output quality also degrades as scope increases. One PR solves one thing, with clear change scope and corresponding tests — this principle only becomes more important in the AI era, not less.

In SDD, this is called **small reviewable chunks**: each task can be independently implemented and tested, and reviewers look at one focused change at a time.

## 9. Context Engineering > Prompt Engineering

One final point that keeps appearing in the literature: the 2026 consensus is that "putting the right things into context" matters more than "writing good prompts."

Your CLAUDE.md, Skills, AGENTS.md, monorepo structure, test suite — all of these are context engineering. You're not teaching the agent how to write code; you're building an environment where the agent naturally writes the right code.

Skills should follow **progressive disclosure**: load on demand, don't stuff everything in at once. This aligns with [Nx's approach](https://nx.dev/blog/nx-and-ai-why-they-work-together) — start from the domain level to find relevant areas, narrow down through the project graph, and only then dive into the file system.

## 10. Branch Isolation: Agents Must Not Touch Main Directly

Related to point 1 about "not letting everyone modify the codebase directly" but at a different level — this is git workflow-level protection.

Agents should work on isolated branches or [git worktrees](https://www.augmentcode.com/guides/git-worktrees-parallel-ai-agent-execution). Multiple agents operating in the same working directory simultaneously cause silent file overwrites, stale context, and git lock contention. Worktrees give each agent its own working directory and git index, deferring conflicts to merge time where they can be resolved with standard git tools.

Claude Code already [natively supports worktree isolation](https://popularaitools.ai/blog/claude-code-git-worktrees-parallel-coding-2026) — adding `isolation: worktree` to a subagent automatically isolates it. But note that [runtime isolation](https://www.penligent.ai/hackinglabs/git-worktrees-need-runtime-isolation-for-parallel-ai-agent-development/) is a separate problem — ports, databases, caches, and test state also need isolation. Git worktrees alone aren't enough.

## 11. Security Guardrails: You Can't Rely on Human Eyes to Catch Security Issues

This lesson was learned the hard way. Agents will accidentally commit `.env` files, introduce vulnerable dependencies, and produce code with injection risks. Relying on human review to catch everything? You can't.

The numbers are alarming: GitGuardian's [2026 State of Secrets Sprawl](https://blog.gitguardian.com/the-state-of-secrets-sprawl-2026/) report shows that in 2025, **28.6 million new secrets** were exposed on public GitHub, a 34% year-over-year increase. AI-service related leaks surged 81%. AI-assisted commits have a [3.2% secret leak rate](https://www.helpnetsecurity.com/2026/04/15/product-showcase-gitguardian-ggshield-ai-hook/), double the 1.5% baseline.

Moreover, AI tools [rarely verify package authenticity](https://cycode.com/blog/ai-security-vulnerabilities/) — AI-assisted development increases dependency sprawl by 20-30%, significantly raising typosquatting attack risks.

The solution is enforcing interception at the hook and CI layers:
- **Pre-commit hooks**: Scan for secrets using [GitGuardian ggshield](https://www.helpnetsecurity.com/2026/04/15/product-showcase-gitguardian-ggshield-ai-hook/)
- **CI pipeline**: Dependency audits, SAST, container scanning
- **Agent-level guardrails**: Restrict which files agents can access, prohibit modifications to specific directories

## 12. Agent Observability / Evals: No Measurement, No Improvement

Your team's agents should be monitored like production services. Which task types have high success rates, which prompt patterns tend to fail, how many tokens are being spent, and what's the quality of each session.

[Anthropic's evals guide](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) explains this most clearly: automated evals for rapid iteration, production monitoring for real-world performance, and periodic human review for calibration. All three are essential.

Gartner predicts that by 2028, 60% of software teams will use AI evaluation and observability platforms. Leading teams today have already been [building traces, evals, and governance into their agent architecture from day one](https://www.braintrust.dev/articles/best-ai-agent-observability-tools-2026), rather than bolting them on after the fact.

The tooling ecosystem is already mature: [Braintrust](https://www.braintrust.dev/articles/best-ai-agent-observability-tools-2026), Langfuse, Arize, and [Confident AI](https://www.confident-ai.com/knowledge-base/compare/best-ai-observability-tools-2026) all provide comprehensive tracing, evaluation, and production monitoring.

## 13. Documentation as Context: ADRs Aren't Just for Humans Anymore

It's not just CLAUDE.md — it's about writing architectural decisions in a format agents can understand. This gives agents a basis for decision-making, so they don't reinvent the wheel every time.

**Architecture Decision Records (ADR)** are the best vehicle for this. Each ADR records: what was decided, why it was decided that way, and what alternatives were considered. In the human development era, ADRs were often written and never read. But in the AI Native era, ADRs are agent context — [Archgate](https://github.com/archgate/cli) can even turn ADRs into governance rules and pre-commit hooks in CI, making architectural decisions self-enforcing.

Going further, [Agent Decision Records (AgDR)](https://github.com/me2resh/agent-decision-record) extend the ADR standard specifically to record technical decisions made by AI agents. When an agent chooses a particular library or pattern, the AgDR records why — so next time, other agents (or humans) know the reasoning.

## 14. Human-in-the-Loop: Not All Decisions Should Be Left to Agents

The most dangerous misconception about agentic workflows: assuming more automation is always better.

Some operations agents should absolutely never decide on their own:
- Deploying to production
- Deleting data or executing migrations
- Modifying CI/CD pipelines
- Force pushing or rebasing shared branches

These should be designed as **approval gates** — the agent pauses at this step and waits for human confirmation before continuing. [HumanLayer](https://humanlayer.dev/) is a tool purpose-built for this problem, wrapping human approval as an API that agents call and wait for a response.

Claude Code's permission mode follows the same logic: clearly distinguishing which tool calls can execute automatically and which require confirmation each time.

When designing agentic workflows, start by listing all operations where "if the agent makes a wrong call, how big is the loss." Those are your approval gate checklist.

## 15. Token Budget Management: A New Cost Dimension in the AI Era

Engineering costs used to be primarily about human time. After going AI Native, there's a new one: token costs.

Without controls, token costs can spiral quickly: agent loops running too many iterations, context packed too large, developers running sessions without restraint.

A few basic principles:
- **Set per-task token budgets**: Give each task a token ceiling for the agent; interrupt and report if exceeded
- **Track cost per PR**: Know how many tokens each PR consumed; make cost visible
- **Progressive disclosure of skills**: Don't stuff all context in at once; load on demand

This data ultimately needs to flow into the observability dashboard from point 12 for meaningful optimization.

## 16. Model Selection Strategy: Match the Right Model to the Right Task

Not every task needs the most powerful model.

A pragmatic tiering approach:
- **Haiku**: Simple formatting, boilerplate generation, small-scope changes
- **Sonnet**: Day-to-day feature development, code review, test generation
- **Opus**: Architecture design, complex debugging, ADR writing, tasks requiring deep reasoning

Implement **model routing** at the agent platform layer — automatically select models based on task type rather than letting individuals decide or uniformly using the most expensive option. This controls costs while ensuring critical tasks have sufficient reasoning capability.

## 17. Developer Role Transformation: The Skill Tree Needs to Change Too

This is the hardest part, because it's a people problem, not a tooling problem.

The engineer's core value shifts from "writing fast and writing well" to:
- **Spec writing**: Breaking down requirements into precise specifications that agents can execute
- **Eval design**: Defining "what correct looks like" and writing tests that truly validate behavior
- **Context engineering**: Knowing how to give agents the right information, not the right instructions
- **Review ability**: Quickly assessing AI output for correctness, risk, and architectural soundness

A mindset shift is also needed: AI-generated code isn't "your code." Don't get defensive just because you wrote the prompt that produced it. Review AI code more strictly than human-written code, because AI doesn't take being questioned as a personal attack.

## 18. Agent Failure Handling: What to Do When Loops Get Stuck or Errors Occur Mid-Run

Agents won't always succeed. Designing failure handling is just as important as designing the happy path.

Common failure scenarios:
- **Agent loops**: The agent repeatedly tries the same approach, stuck on the same error
- **Context overflow**: The task is too large, and the context window fills up mid-execution
- **Tool call failures**: External API or file system errors cause the agent to abort

Basic protective mechanisms:
- **Maximum iteration limits**: Interrupt when exceeded; report current state for human intervention
- **Checkpoints**: Break long tasks into segments; commit after each segment; recover from the last checkpoint on failure
- **Git worktree's natural advantage**: When an agent fails, worktree changes don't affect the main branch — clean up and restart without residual effects

---

## The Big Picture

These practices aren't new inventions — many were already best practices in the human development era. But going AI Native amplifies the cost of not following them: no spec means wild guessing, no tests means wild coding, no review means reckless merging, no monorepo means broken context, no security guardrails means leaked secrets, no observability means flying blind, no human-in-the-loop means agents making decisions they shouldn't, no token budgets means runaway costs, no model strategy means performance-cost imbalance, no role transformation means productivity bottlenecks, and no failure handling means agents trapped in infinite loops.

AI drives the cost of writing code toward zero, but raises the cost of "ensuring the code is correct." A team's core competency shifts from "writing fast" to "clear specs, rigorous acceptance, thorough reviews, and sound governance."

Every lesson here is backed by industry literature — none of this is personal opinion. I hope it helps those walking the same path avoid a few pitfalls.

## References

- [Building an AI-Native Engineering Team – OpenAI Codex](https://developers.openai.com/codex/guides/build-ai-native-engineering-team)
- [Building AI-Native Development Teams in 2026 – Unicrew](https://unicrew.com/blog/building-ai-native-development-teams/)
- [The State of AI Coding Agents 2026 – Dave Patten](https://medium.com/@dave-patten/the-state-of-ai-coding-agents-2026-from-pair-programming-to-autonomous-ai-teams-b11f2b39232a)
- [My LLM coding workflow going into 2026 – Addy Osmani](https://addyosmani.com/blog/ai-coding-workflow/)
- [AI Coding Tools in 2026 – The Main Thread](https://www.the-main-thread.com/p/ai-coding-tools-2026-java-developers-agents-control)
- [Engineering Leader's Guide to AI Tools – Cortex](https://www.cortex.io/post/the-engineering-leaders-guide-to-ai-tools-for-developers-in-2026)
- [Spec-driven development with AI – GitHub Blog](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)
- [Exploring SDD: Kiro, spec-kit, and Tessl – Martin Fowler](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)
- [GitHub spec-kit](https://github.com/github/spec-kit)
- [Kiro – Agentic AI Development](https://kiro.dev/)
- [What Is Spec-Driven Development? – Augment Code](https://www.augmentcode.com/guides/what-is-spec-driven-development)
- [Will AI turn 2026 into the year of the monorepo? – Spectro Cloud](https://www.spectrocloud.com/blog/will-ai-turn-2026-into-the-year-of-the-monorepo)
- [Steering AI Agents in Monorepos with AGENTS.md – Datadog](https://dev.to/datadog-frontend-dev/steering-ai-agents-in-monorepos-with-agentsmd-13g0)
- [Teach Your AI Agent How to Work in a Monorepo – Nx](https://nx.dev/blog/nx-ai-agent-skills)
- [Monorepos & AI – monorepo.tools](https://monorepo.tools/ai)
- [Writing a good CLAUDE.md – HumanLayer](https://www.humanlayer.dev/blog/writing-a-good-claude-md)
- [Claude Code Customization Guide – alexop.dev](https://alexop.dev/posts/claude-code-customization-guide-claudemd-skills-subagents/)
- [How to Configure Every AI Coding Assistant – DeployHQ](https://www.deployhq.com/blog/ai-coding-config-files-guide)
- [Nx and AI – Why They Work Together](https://nx.dev/blog/nx-and-ai-why-they-work-together)
- [Git Worktrees for Parallel AI Agent Execution – Augment Code](https://www.augmentcode.com/guides/git-worktrees-parallel-ai-agent-execution)
- [Git Worktrees Need Runtime Isolation – Penligent](https://www.penligent.ai/hackinglabs/git-worktrees-need-runtime-isolation-for-parallel-ai-agent-development/)
- [The State of Secrets Sprawl 2026 – GitGuardian](https://blog.gitguardian.com/the-state-of-secrets-sprawl-2026/)
- [Stop secrets from leaking through AI coding tools – GitGuardian ggshield](https://www.helpnetsecurity.com/2026/04/15/product-showcase-gitguardian-ggshield-ai-hook/)
- [AI Security Vulnerabilities to Watch in 2026 – Cycode](https://cycode.com/blog/ai-security-vulnerabilities/)
- [As Coders Adopt AI Agents, Security Pitfalls Lurk – Dark Reading](https://www.darkreading.com/application-security/coders-adopt-ai-agents-security-pitfalls-lurk-2026)
- [Demystifying Evals for AI Agents – Anthropic](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [5 Best AI Agent Observability Tools 2026 – Braintrust](https://www.braintrust.dev/articles/best-ai-agent-observability-tools-2026)
- [Archgate – Enforce ADRs as Executable Rules](https://github.com/archgate/cli)
- [Agent Decision Records (AgDR)](https://github.com/me2resh/agent-decision-record)
- [Architecture Decision Record Examples – Joel Parker Henderson](https://github.com/joelparkerhenderson/architecture-decision-record)
- [HumanLayer – Human approval for AI agents](https://humanlayer.dev/)
- [Claude Code Permission Modes – Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/settings#permission-modes)
- [Anthropic API: Token usage and cost management](https://docs.anthropic.com/en/docs/build-with-claude/token-counting)
- [Choosing the right Claude model – Anthropic Docs](https://docs.anthropic.com/en/docs/about-claude/models/overview)
- [The Expanding Role of Software Engineers in the AI Era – GitHub Blog](https://github.blog/developer-skills/career-growth/the-expanding-role-of-software-engineers-in-the-ai-era/)
- [Patterns for Building LLM-based Systems & Products – Eugene Yan](https://eugeneyan.com/writing/llm-patterns/)
