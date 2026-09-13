---
title: "From Stripe to Meta: How Silicon Valley's Top Companies Replace Keyboards with AI Agents"
date: 2026-04-04
type: guide
category: ai
tags: [ai-agent, coding-agents, stripe-minions, agentic-coding, developer-tools, automation, meta, google, uber, amazon]
lang: en
tldr: "Top Silicon Valley companies are independently building internal AI coding agents that automate everything from a Slack message to a merged PR. This article deep-dives into architectures from Stripe, Ramp, Coinbase, and Spotify — including their 2026 growth numbers (Stripe 7,000+ PRs/week, Ramp 75% of merged PRs) — then expands to cover Google, Meta, Amazon, Uber, Shopify, PostHog, and more."
description: "A deep look at Stripe Minions, Ramp Inspect, Coinbase Forge (formerly Cloudbot), and Spotify Honk — their architecture designs and latest key metrics — followed by an expanded survey of Google Agent Smith, Meta DevMate, Amazon's Kiro, Shopify River, and over a dozen other companies' internal AI coding agents."
draft: false
series:
  name: "AI Agent Systems in Practice"
  order: 5
---

> 🌏 [中文版](/posts/ai/2026-04-04-internal-ai-coding-agents)

In early 2026, a pattern began to emerge: elite engineering teams across Silicon Valley were independently building their own AI coding agents. Not Copilot-style autocomplete, but genuine end-to-end automation — from a single Slack message to a production-ready PR, with no human touching the keyboard.

This article first deep-dives into the approaches of four representative companies — Stripe, Ramp, Coinbase, and Spotify — then expands to cover the full landscape across Google, Meta, Amazon, Uber, and more than a dozen others, along with the common architectural patterns they've converged on.

---

## Stripe Minions — 1,300 PRs per Week via Slack Emoji Workflow

Stripe's Minions is the most publicly documented internal coding agent to date, built by engineer Steve Kaliski's team and shared with technical details in February 2026.

### Trigger Mechanism

An engineer adds a specific emoji reaction to any task-describing message in Slack (e.g., `:create-minion-payserver:`), and a bot confirms the Minion has been launched. The original Slack message becomes the agent's prompt directly.

It also supports triggers via CLI, web interface, and automated systems (e.g., flaky test detectors). But the most common path is Slack.

### Five-Layer Pipeline

The Minions architecture breaks down into five layers:

```
1. Invocation    — Slack emoji / CLI / Web / automated system triggers
2. Devbox        — Isolated VM, ~10 sec startup, pre-loaded with Stripe codebase and services
3. Toolshed MCP  — Centralized MCP Server managing ~500 internal tools
4. Agent Loop    — Blueprint architecture (alternating deterministic + agentic nodes)
5. Output        — Lint → CI (up to 2 rounds) → Open PR for human review
```

### Blueprint Architecture

This is the core design of Minions. A Blueprint is an orchestration template that chains together two fundamentally different types of steps:

- **Deterministic Nodes**: Fixed, predictable operations — git push, linting, CI execution, format checks
- **Agentic Nodes**: LLM-driven reasoning and code generation

The two alternate in a feedback loop: AI generates code → deterministic node verifies it compiles → AI proposes a refactor → tests run to confirm nothing breaks. Rather than relying on AI to be correct every time, deterministic checkpoints catch errors.

A typical Blueprint flow looks like this:

```
Slack trigger (deterministic) → clone repo + env setup (deterministic)
→ understand task + plan implementation (agentic) → write code (agentic)
→ run linter (deterministic) → push branch (deterministic)
→ fix CI failures (agentic, up to 2 attempts) → push final version (deterministic)
→ PR ready for review
```

The CI fix cap of 2 attempts is deliberate — if the LLM can't fix it in two tries, a third won't help either; it's just burning compute. At that point, the system flags the task for human takeover.

This is really two more general engineering patterns applied to an agent pipeline. The Blueprint's "deterministic nodes guard agentic nodes" is, at its core, a **thin spec, thick gate** design: the prompt (spec) can stay loose, because what actually catches errors isn't demanding the agent get it right in one shot — it's the row of "thick," deterministic gates behind it (lint, CI, type checks). The 2-attempt CI cap, meanwhile, is a **circuit breaker** — a pattern borrowed straight from distributed-systems reliability engineering — applied to a coding agent: rather than letting the agent retry indefinitely and burn compute while stalling the whole pipeline, you set a failure threshold and trip the breaker, handing off to a human instead of assuming "one more try will probably work."

Different task types (dependency updates, API migrations, test generation, documentation) have specialized Blueprints, and the orchestration layer automatically routes to the right one.

### Toolshed MCP Server

Stripe has over 500 internal tools, but feeding all of them to the AI causes token paralysis. Toolshed is a centralized MCP (Model Context Protocol) Server that curates a subset of roughly 15 of the most relevant tools based on the task type, giving the agent precise, high-density context from the start.

### Devbox Isolation Environment

Each Minion runs in an isolated AWS EC2 VM (Devbox) — identical specs to what human engineers use, pre-loaded with Stripe's full source code, warmed Bazel cache, and type-checking cache.

Stripe pre-provisions a warm pool, pulling a machine from the pool on trigger, enabling startup in **~10 seconds**. No internet access, no production access, no real user data — fully sandboxed. The blast radius of any error is contained within a single disposable VM.

Another detail: as the agent navigates the filesystem, directory-scoped rule files are automatically appended — rather than dumping an entire global context in at once, guidance is dynamically provided based on the current directory. This prevents context window overflow.

### Key Metrics

- Weekly merges climbed from the **1,300+ PRs** disclosed at launch to **7,000+ PRs** within eight months (August 2026), roughly **~30%** of all merged PRs company-wide
- All PRs contain zero human-written code
- Every PR still requires human code review
- The underlying code supports Stripe's **$1 trillion+** in annual payment volume

### Origin and Design Philosophy

Minions' core agent is an internal fork of Block's open-source Goose. The key modification was stripping out everything designed for human use — interruptibility, confirmation dialogs, human-triggered commands — and replacing them with a fully unattended one-shot mode.

Steve Kaliski calls this pattern **"pair prompting"** — a new form of pair programming. His core insight: "A good human developer experience also produces good AI agent results." The infrastructure that makes human developers efficient (devbox, tooling, CI) equally makes agents efficient.

Stripe's architectural philosophy can be distilled into one sentence: **"The walls matter more than the model"** — the guardrails, infrastructure, and constraints around the agent matter more than which LLM you use. Devbox infrastructure, 3 million tests, 500 MCP tools — this is not something a startup can replicate overnight.

---

## Ramp Inspect — 30% of Merged PRs from an Agent

Ramp is one of Silicon Valley's fastest-growing corporate spend management platforms. Their internal coding agent is called Inspect.

### Technical Architecture

Inspect is built on OpenCode (an open-source AI coding CLI tool), paired with Modal cloud containers for isolated sandbox environments. Each task executes in an independent container that can run tests, lint, and type checks, ensuring generated code passes basic quality gates before submission.

### Trigger Mechanism

Primarily triggered via Slack — engineers describe tasks in a Slack channel, Inspect spins up a container, executes the work, and posts back a PR link in Slack when done. CLI is also supported.

### Use Cases

- Bug fixes
- Small feature implementations
- Refactoring and code migrations
- Test writing
- Boilerplate generation

All agent-produced PRs still require human review. Inspect is positioned as augmentation, not a replacement for human judgment.

### Key Metrics

- About 30% of merged PRs in January 2026, climbing to **75% by August 2026** — three out of every four merged PRs — with more than **1 million cumulative sessions**
- Team adoption is extremely high, with most engineers using it daily
- The bottleneck has shifted from "writing code" to "reviewing PRs" — a wall every team hits once it reaches this scale

### Visual Verification

Inspect integrates visual DOM verification — it doesn't just check whether the code runs, but can verify the correctness of UI changes through DOM snapshots. This is particularly valuable for frontend tasks.

---

## Coinbase Forge — Agent Councils + Auto-Merge, Plus Mux for Multi-Agent Orchestration

Coinbase's internal coding agent has been renamed twice: it started as Claudebot, was renamed Cloudbot once it went multi-model, and was renamed again in 2026 to its current name, **Forge** (this article uses the current name throughout; older sources referring to Cloudbot mean the same system). Its biggest differentiators are the **agent council** mechanism and **auto-merge** capability.

### Agent Councils

Forge doesn't operate as a single agent working alone. It uses a multi-agent "council" architecture — one agent writes code, while others serve as reviewers and validators, completing a round of internal review before any human gets involved.

This ensemble/consensus mechanism reduces the risk of a single LLM making mistakes and gives the system confidence to auto-merge under specific conditions.

### Auto-Merge

Unlike the other three companies, Forge can automatically merge PRs when **all CI tests pass + the agent council review is positive**, without requiring human intervention. Human developers only need to manually review complex cases.

This is a bold design choice — removing humans from the loop and placing full trust in automated quality gates.

### Trigger Mechanism

Triggered via Slack commands or PR comments, primarily handling mechanical tasks like dependency upgrades, code migrations, boilerplate, and test generation.

### Built from Scratch

Unlike Stripe and Ramp, which each modified open-source tools (Goose and OpenCode respectively), Coinbase's Forge is entirely custom-built — including the agent council, auto-merge pipeline, and internal architecture comprehension capabilities.

### Key Metrics

- As of February 2026, Forge produces **5%** of all merged PRs company-wide, cutting PR cycle time from ~150 hours to ~15 hours (10x)
- Serves 1,000+ engineers, integrated into daily workflows through Slack, Linear, and MCP

### Mux — An Engineer's Side Project That Became Company-Wide Infrastructure

In May 2026, Coinbase's engineering blog disclosed a separate internal tool called **Mux**: a multi-agent orchestration layer that lets engineers run several agents in parallel at once. It didn't start as a top-down product initiative — one engineer built it to solve their own problem, giving each agent its own git worktree, its own branch, its own terminal, so nothing conflicts and nothing needs stashing. It spread organically after being shared in a Slack channel, with no adoption campaign.

Within one month of launch (as of April 2026), Mux had already reached:

- **600+ users** (engineers, PMs, and designers), including 335 active and 197 power users
- **5,068 merged PRs** across 461 repos and 10 orgs
- **3.5x more merged PRs per engineer** for power users compared to baseline (39.6 vs. 11.4)

Coinbase's own framing: engineers are shifting from implementers to orchestrators — watching three or four agents run in parallel (one implementing an API, one writing tests, one fixing a bug, one refactoring), reviewing and integrating their output rather than writing the code themselves.

---

## Spotify Honk — From Phone-Described Requirements to Merged PR

Spotify's internal coding agent is called Honk, with complete technical details shared across three Spotify Engineering Blog posts (November-December 2025).

### Origin

Spotify started building its **Fleet Management** framework back in 2022 for applying code changes in bulk across hundreds of repos. In July 2025, they integrated the Claude Agent SDK into this framework, and Honk was born.

Before this, Spotify had tried building agents in-house, but found that homegrown solutions "required overly rigid instructions and got stuck on complex multi-step edits." Switching to Claude Code, they found a **declarative prompt style** — telling the agent what outcome you want rather than step-by-step instructions — worked much better.

### Workflow

Claude Code reads the codebase, understands the architecture, writes the implementation, runs tests, pushes the new version, and finally **notifies engineers via Slack**. Engineers can review directly **on their phones** and merge to production if everything looks good.

Migration prompts are **version-controlled in Git**, and Spotify's internal orchestration system handles triggering the Claude Code agent.

### Three-Layer Quality Assurance

In their Part 3 blog post, Spotify detailed three failure modes they worry about most:

1. **Agent doesn't produce a PR** — low impact, just retry
2. **PR passes CI but the functionality is wrong** — the most serious, erodes team trust
3. **Unpredictable output**

The solution is a **verification loop**: the agent generates changes → runs formatter/linter/build/test → on failure, feeds error messages back into the loop, with verifier and judge mechanisms guiding the agent toward correctness.

### Primary Use Case

Honk's killer application is **large-scale code migration** — deprecated API migrations across hundreds of repos. To date, it has completed roughly **50 migrations**.

CTO Gustav Soderstrom told analysts:

> Spotify's best developers haven't written a single line of code since December 2025.

### Key Metrics

- **1,500+ agent PRs** merged cumulatively
- Currently merging **1,000 PRs** every 10 days — at QCon London in March 2026, the Spotify team confirmed this same volume took three months to reach just six months earlier, roughly an 18x speedup
- Migration tasks save **60-90%** of time
- Built on Claude Code + Claude Agent SDK

### Late 2026: From Migration Tool to Everyday Infrastructure

An April 2026 Part 4 blog post recorded a lesson learned: when Honk was applied to a cross-team downstream dataset migration, the scope exceeded what it could verify on its own, so its key ability — verifying its own work — wasn't available, and downstream teams had to fall back on manual testing before merging. A reminder that this system's competence has limits; not every task can be handed off blindly.

By the June 2026 post "Coding is no longer the constraint," Spotify had folded Honk directly into its Fleet Management tooling: Fleetshift handles the human-facing orchestration (picking targets, scheduling, tracking progress), while Honk does the actual code changes. A team can see at a glance how many PRs a migration has opened, how many merged, and which need attention. The title says it all — writing code is no longer the bottleneck, reviewing it is, the same wall Ramp Inspect hit.

---

## Common Architectural Patterns

LangChain founder Harrison Chase observed that Stripe, Ramp, and Coinbase independently developed yet converged on remarkably similar architectures. In March 2026, he released Open SWE — an open-source framework that abstracts these common patterns.

Here are the core design choices across all four companies:

### 1. Isolated Cloud Sandboxes

Every agent task runs in an isolated container or VM with no access to production, no internet access (Stripe), or access only to a specific scope of resources. This is the foundation of trust.

### 2. Slack-First Triggers

All four companies use Slack as their primary trigger entry point. Engineers don't need to switch tools — they issue commands right where they already communicate.

### 3. Curated Tool Sets

Rather than feeding agents every internal tool, they dynamically curate a small, precise subset based on the task type. Stripe's Toolshed manages ~500 tools but only serves ~15 at a time.

### 4. Context Injection

Rich context is injected from sources like Linear issues, GitHub PRs, and Slack threads, giving the agent a full understanding of the task's background.

### 5. Sub-Agent Orchestration

Complex tasks are split across multiple sub-agents working together, rather than a single agent handling everything.

### 6. Thick Gates Guard Thin Specs, and Failures Trip a Breaker

The four companies' verification mechanisms look different on the surface — Stripe's deterministic nodes, Ramp's self-verifying sandboxes, Coinbase's agent council, Spotify's verification loop — but they converge on the same principle: **the spec/prompt on the agent side can stay thin, because what actually catches errors is the thick, deterministic gate layer behind it** (lint, CI, tests, council review). And every system caps how many times it will retry — a circuit breaker pattern borrowed from distributed systems: rather than letting an agent retry indefinitely and burn compute, you trip the breaker after a fixed number of failures and hand off to a human. It's also why Stripe's engineering team says **"the walls matter more than the model"** — swapping the underlying LLM is comparatively easy, but this ring of verification gates and circuit breakers is what actually absorbs production risk at scale.

### Side-by-Side Comparison

| Feature | Stripe Minions | Ramp Inspect | Coinbase Forge | Spotify Honk |
|---------|---------------|--------------|-------------------|--------------|
| **Base** | Goose fork | OpenCode | Custom-built | Claude Code + Agent SDK |
| **Trigger** | Slack emoji | Slack / CLI | Slack / PR comment | Natural language description |
| **Sandbox** | Isolated VM | Modal container | Cloud sandbox | Background environment |
| **Review** | Human required | Human required | Agent council + auto-merge | Human required |
| **Weekly PRs** | 1,300+ → **7,000+** (Aug 2026) | 30% → **75%** (Aug 2026) | 5% company-wide + Mux's 5,068 PRs/month | 1,000/10 days |
| **Differentiator** | Blueprint architecture | Visual DOM verification | Auto-merge, plus Mux multi-agent orchestration | Verification loop + migration optimization |

---

## Other Companies Doing the Same

It's not just the four above. From fintech startups to the AI labs building the frontier models themselves, here are other large companies with publicly available information:

### Google — Agent Smith, Plus a Broader Official 75% Figure

Google's internal coding agent **Agent Smith** was responsible for **25%+ of new production code** by Q3 2024 (Sundar Pichai, earnings call), surpassing 30% in Q1 2025. It takes high-level task descriptions, breaks them into subtasks, writes code across multiple files, runs tests, and iterates until the PR is ready for human review. After its official launch in early 2026, it became so popular that Google had to throttle internal access.

In April 2026, Pichai posted a higher, broader-scoped number on Google's official Cloud Next blog: **75% of all new code company-wide is now AI-generated and approved by engineers**, up from 50% the previous fall. This isn't the same measurement as Agent Smith's 30% — that figure tracks fully autonomous, end-to-end agent PRs, while this one covers all "AI-produced, human-reviewed" code (including autocomplete and Gemini-assisted work, a much broader category). The two numbers coexisting actually makes a point: fully autonomous agent penetration is still far behind the overall penetration of "AI-assisted coding."

On the external product side, Google launched **Antigravity** — an agent-first IDE that supports orchestrating multiple parallel agents across different workspaces simultaneously.

### Anthropic — Using Claude to Write Claude's Own Code

Anthropic itself is the most extreme case of this pattern. In May 2026, an official research report, "When AI Builds Itself," disclosed a striking figure: **more than 80% of the code merged into Anthropic's own production codebase was written by Claude** — before Claude Code launched in research preview in February 2025, that share was in the low single digits.

The same report explains why quality hasn't collapsed alongside that growth: Anthropic runs an automated Claude reviewer internally, and a retrospective analysis found it would have caught roughly a third of the production bugs behind past claude.ai incidents. It's the same logic as Stripe's deterministic nodes — what actually absorbs risk at scale is the review gate, not the model itself.

Other numbers are equally striking:

- In Q2 2026, the typical engineer merged **8x** as much code per day as in 2024 — Anthropic itself flags this as inflated, since code volume was never a good productivity metric; an internal poll of 130 research staff put the more conservative self-estimated gain at roughly **4x**
- On the hardest, least-specified engineering tasks, Claude's success rate climbed from 26% six months earlier to **76%** (May 2026)
- In April 2026, Claude shipped **800+ fixes** that cut one class of API errors by a factor of a thousand; the supervising engineer estimated a human would have needed **4 years** to do the same work
- Anthropic expects the Claude-authored share to cross **90%** by the end of 2026

Dario Amodei mentioned at the World Economic Forum in January 2026 that engineers inside the company had told him, "I don't write code anymore."

### OpenAI — Codex Goes From Engineering Tool to Company-Wide Default

OpenAI is following a similar path, with a somewhat different framing. President Greg Brockman said at Sequoia's AI Ascent conference in May 2026 that AI now writes **80%** of the company's code (up from 20%). Earlier that same month, Fortune reported that both Claude Code's creator Boris Cherny (now at Anthropic) and an OpenAI researcher had publicly said they no longer write any of their own code — "100%."

Rather than a single headline percentage, OpenAI tends to emphasize Codex's penetration: as of June 2026, **97.9% of employees use Codex** (up from roughly 40% in August 2025), and its use has long since spread beyond engineering — Legal and Recruiting now treat Codex as their primary tool too, with the median Legal employee's monthly output 13x what it was in November 2025. Calvin French-Owen, an engineer who worked on the Codex project, wrote after leaving the company that a team once built a complete internal beta product from scratch with Codex in seven weeks — business logic, infrastructure, tooling, and documentation, almost entirely generated by Codex.

One caveat worth keeping in mind: self-reported productivity numbers like these are contested industry-wide — a February 2026 NBER paper found that 80% of companies actively using AI reported no measurable productivity impact. However striking the AI labs' own internal case studies are, they don't guarantee every company can replicate the same results.

### Meta — DevMate + Multi-Agent System

Meta's approach is the most aggressive: **DevMate** isn't a single agent but an agent network — comprising Planner, Researcher, Builder, Reviewer, Negotiator, and other roles working together to complete tasks.

The metrics are staggering: DevMate ultimately produces **50% of code changes**. Since early 2025, per-engineer output has increased 30%, with heavy users seeing 80% YoY improvement. The H1 2026 internal target is for 65% of engineers to produce 75%+ of their code with AI.

In August 2026, Meta took a different route: launching **Muse Code**, the company's first terminal coding agent (beta), running Meta's own Muse Spark 1.2 model. It's built for long-horizon, multi-file changes across large repos, using persistent sub-agents to plan, implement, and validate. It's not the same system as DevMate's multi-agent network — a sign Meta is betting on several different shapes of coding agent at once, rather than converging on a single architecture.

### Amazon — Q Developer Winds Down, Handing Off to Kiro

Amazon used Q Developer's code transformation feature to migrate **30,000 Java applications** from Java 8/11 to Java 17. CEO Andy Jassy revealed in an earnings call: it saved **4,500 developer-years of effort** and **$260 million**. The average upgrade time per application dropped from ~50 person-days to a few hours, with 79% of auto-generated code reviews accepted directly.

But this success story is itself being wound down: AWS officially announced in May 2026 that Q Developer would **stop accepting new signups** (as of May 15) and reach **full end-of-support in April 2027**, redirecting resources to a new product, **Kiro** — a "spec-driven" agentic IDE where engineers write a structured spec first, and the agent plans, implements, and validates against it, rather than responding turn-by-turn to prompts. The latest Claude Opus 4.7 is available only on Kiro, while Q Developer Pro is capped at Opus 4.6. The migration numbers above still stand, but they're Amazon's previous-generation answer.

Kiro isn't just something AWS sells to customers — AWS uses it internally too. At AWS Summit London in April 2026, UK & Ireland managing director Alison Kay gave a concrete example: AWS needed to rebuild the inference engine behind Bedrock from scratch. "If you'd asked me two years ago what that would've taken, I would've said 40 engineers, 12 months, and a whole lot of coffee." In practice, working alongside Kiro agents that wrote code, tested it, found bugs, fixed them, and deployed around the clock — "while the engineers slept, the agents kept building" — the rebuild took just **6 engineers, 76 days**. AWS CEO Matt Garman has separately said that around **80% of developers at the company use AI in some way every day**.

Garman is also one of the industry's rare public skeptics on this exact topic: as Google and Microsoft tout their "share of AI-generated code," he's called it a "silly metric" — "there might be bad code, by the way. Measuring lines of code is never actually the best metric. Oftentimes, fewer lines of code is way better than more, so I'm never really sure why that's the exciting metric people like to brag about." It's the same warning as the review bottleneck Ramp and Spotify both ran into: a higher PR count or code volume doesn't necessarily mean delivery actually sped up.

### Uber — Minions + Shepherd + uReview

Uber's agent system comprises three roles: **Minions** (task agent), **Shepherd** (migration agent), and **uReview** (code review agent). uReview analyzes **90%+ of ~65,000 weekly code diffs**, with a median review time of just 4 minutes, and 65% of AI comments adopted (higher than the 51% rate for human reviewers). By March 2026, 84% of developers were agentic coding users; updated figures put it at **92% using an agent at least monthly, with 31% of code written by AI**. A separate agent, **AutoCover**, is dedicated to generating tests and produces roughly **5,000 merged tests per month**.

In September 2026, Uber's engineering team formalized the whole system as an **inner loop / outer loop** architecture: an agent completes planning and validation inside its own sandbox (inner loop) before pushing a PR to the company's shared CI (outer loop) — avoiding having every small task compete for expensive shared CI resources. It's the same thin-spec-thick-gate logic as Stripe's "deterministic nodes guard agentic nodes," just under a different name.

### Shopify — River, Putting an Agent in Public Slack Channels

Shopify's internal agent is called **River**, and its most distinctive design choice is that it only responds in **public** Slack channels — it refuses DMs. The point is to turn "watching someone else work with the agent" into a built-in company-wide learning environment, what Shopify calls a "Lehrwerkstatt" (teaching workshop). River is deeply integrated into Shopify's monorepo, "World" — it can read code, run tests, open PRs, query the data warehouse, and inspect production traces.

Numbers from a 30-day window: **5,938 employees** used River across **4,450 channels**, the main repo opened 1,870 PRs in a single week, and about **one in eight (12.5%) of merged PRs** were co-authored by River. In September 2026, Shopify extended River into vulnerability remediation — when a finding is detected, it opens a Slack thread automatically, generates a fix PR, and tracks it through to CI passing and the vulnerability record being updated.

### PostHog — A Smaller Company's Different Answer: Agents Reviewing Agents

Not every story here happens at a giant company. PostHog's engineers published how they deal with "agents writing code faster than any human can review": the fix isn't asking humans to review faster, it's having other agents catch a first pass. Their approach runs several reviewer agents at once, each with different instructions and even different underlying models (one watches for security holes, one for database design, one for performance, one for naming conventions) — with the key rule that **the agent that wrote the code can't be the one reviewing it**, since agents are typically blind to their own mistakes. It's the same intuition as Coinbase's agent council, just small enough for one engineer to assemble on their own.

### Goldman Sachs — Devin Deployment

Goldman Sachs was the **first major bank to deploy Devin (Cognition)** (July 2025), scaling from hundreds to 12,000 developers. Primarily used to migrate internal code to newer language versions. Reported 3-4x productivity gains.

### Walmart — WIBEY

Walmart's developer agent **WIBEY** is one of four "super agents" that saved approximately **4 million developer hours** in 2024-2025. Built on Walmart's proprietary Element ML platform, it is currently being refactored into an agent orchestration architecture.

### Industry Landscape

| Company | Tool | Key Metrics |
|---------|------|-------------|
| Google | Agent Smith / company-wide AI assist | Agent Smith 30%+ fully autonomous PRs; company-wide AI-generated code share 75% (Apr 2026) |
| Anthropic | Claude Code (self-hosted) | 80%+ of production code written by Claude, expected to top 90% by year-end |
| OpenAI | Codex (self-hosted) | 80% of code AI-written; 97.9% of employees use Codex daily |
| Meta | DevMate + Muse Code | 50% code changes, multi-agent network; added terminal agent Muse Code in Aug 2026 |
| Amazon | Q Developer → Kiro | 4,500 developer-years, $260M saved; AWS itself uses Kiro (Bedrock inference engine rewrite: 40 eng/12mo → 6 eng/76 days) |
| Uber | Minions/Shepherd/uReview/AutoCover | 92% monthly agent usage, 31% of code AI-written, 90% diffs auto-reviewed |
| Shopify | River (Slack-native agent) | 1/8 (12.5%) of merged PRs, across 4,450+ Slack channels; also used for security remediation |
| Goldman Sachs | Devin | First bank deployment, 12,000 developers |
| Walmart | WIBEY | 4 million hours saved |
| PostHog | StampHog + multi-agent review | Agents reviewing agents, cross-checked by different roles/models |
| Block | Goose (open source) | 27,000 GitHub stars, base for Stripe Minions |
| Apple | Xcode Intelligence | Claude integration, agentic coding |
| Airbnb | Internal platform | Q1 2026 earnings call: 60% of new code AI-written; 97% tech debt migration success rate |

---

## The Big Picture

From the deep analysis of four companies to the full industry landscape, the conclusion is clear: **AI coding agents are no longer experiments — they are production infrastructure**.

The core trade-offs are evident:

- **Speed vs. Control**: Coinbase chose auto-merge for maximum velocity; the other three retained human review as a last line of defense
- **Custom-built vs. Open-source base**: Coinbase is fully custom, Stripe forks Goose, Ramp uses OpenCode, Spotify uses the Claude SDK — there's no single right answer; it depends on the existing tech stack and internal requirements
- **General-purpose vs. Specialized**: All systems started with "well-defined, mechanical tasks" (migrations, dependency upgrades, bug fixes), then gradually expanded to more complex scenarios

For teams looking to build similar systems, LangChain's Open SWE framework is a starting point — it packages the architectural patterns that Stripe, Ramp, and Coinbase independently converged on into an out-of-the-box open-source solution.

Looking back after six months, the growth rate tells you more than the architecture itself: Stripe went from 1,300 PRs/week to 7,000+, Ramp from 30% to 75% of merged PRs. But in those months, no company ripped out and rewrote its whole system, and none of this came from swapping in a smarter LLM. What actually moved was the wall itself: Coinbase added Mux to turn a single agent into a fleet of orchestrated agents, while Ramp and Spotify both independently found their bottleneck shifting from "writing code" to "reviewing PRs" and reinforced the review layer in response. That's exactly what Stripe's engineering team meant by **the walls matter more than the model** — scaling comes from thickening the verification gates and widening the orchestration, not from waiting for a smarter model to show up.

For most teams, the question worth asking right now is: **How much of your engineering team's work could actually be replaced by a single Slack message?**

## Update Log

- 2026-09-13: Added the latest mid/late-2026 metrics for the four flagship case studies — Stripe Minions 1,300 → 7,000+ PRs/week, Ramp Inspect 30% → 75% of merged PRs, and Spotify Honk's shift from migration bottleneck to review bottleneck. Renamed Coinbase Cloudbot to its current name, Forge, and added its new multi-agent orchestration tool, Mux. Added Amazon's transition from Q Developer to Kiro (including AWS's own internal use of Kiro to rebuild the Bedrock inference engine, plus its CEO's skepticism of the "share of AI-generated code" metric), Google's official 75% AI-generated-code figure, Meta's new Muse Code, and Uber's latest adoption figures and inner/outer loop architecture. Added four new case studies — Anthropic (Claude writes 80%+ of its own code), OpenAI (97.9% employee penetration for Codex), Shopify River, and PostHog's agent-reviews-agent pattern. Named the "thin spec, thick gate" and "circuit breaker" design patterns in the Blueprint and common-architecture sections, and elevated "the walls matter more than the model" into the article's throughline argument.

---

## References

- [Stripe Dev Blog: Minions — Stripe's one-shot, end-to-end coding agents (Part 1)](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents)
- [Stripe Dev Blog: Minions — Part 2](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2)
- [Lenny's Newsletter: How Stripe built "minions" — Steve Kaliski](https://www.lennysnewsletter.com/p/how-stripe-built-minionsai-coding)
- [ByteByteGo: How Stripe's Minions Ship 1,300 PRs a Week](https://blog.bytebytego.com/p/how-stripes-minions-ship-1300-prs)
- [InfoQ: Stripe Engineers Deploy Minions](https://www.infoq.com/news/2026/03/stripe-autonomous-coding-agents/)
- [MindStudio: Stripe Minions Blueprint Architecture](https://www.mindstudio.ai/blog/stripe-minions-blueprint-architecture-deterministic-agentic-nodes)
- [Anup.io: Stripe's coding agents — the walls matter more than the model](https://www.anup.io/stripes-coding-agents-the-walls-matter-more-than-the-model/)
- [SitePoint: Deconstructing Stripe's Minions — One-Shot Agents at Scale](https://www.sitepoint.com/stripe-minions-architecture-explained/)
- [InfoQ: Ramp Builds Internal Coding Agent That Powers 30% of Pull Requests](https://www.infoq.com/news/2026/01/ramp-coding-agent-platform/)
- [DevOps.com: Open SWE Captures the Architecture That Stripe, Coinbase and Ramp Built Independently](https://devops.com/open-swe-captures-the-architecture-that-stripe-coinbase-and-ramp-built-independently-for-internal-coding-agents/)
- [Spotify Engineering: 1,500+ PRs Later — Spotify's Background Coding Agent (Part 1)](https://engineering.atspotify.com/2025/11/spotifys-background-coding-agent-part-1)
- [Spotify Engineering: Context Engineering — Background Coding Agents (Part 2)](https://engineering.atspotify.com/2025/11/context-engineering-background-coding-agents-part-2)
- [Spotify Engineering: Feedback Loops — Background Coding Agents (Part 3)](https://engineering.atspotify.com/2025/12/feedback-loops-background-coding-agents-part-3)
- [TechCrunch: Spotify says its best developers haven't written a line of code since December](https://techcrunch.com/2026/02/12/spotify-says-its-best-developers-havent-written-a-line-of-code-since-december-thanks-to-ai/)
- [Anthropic Customer Story: Spotify](https://claude.com/customers/spotify)
- [GitHub: langchain-ai/open-swe](https://github.com/langchain-ai/open-swe)
- [LangChain Blog: Open SWE — An Open-Source Framework for Internal Coding Agents](https://blog.langchain.com/open-swe-an-open-source-framework-for-internal-coding-agents/)
- [Harrison Chase on X: Internal cloud coding agents](https://x.com/hwchase17/status/2033977192053612621)
- [ChatPRD: Stripe's AI Minions Ship 1300 PRs Weekly from a Slack Emoji](https://www.chatprd.ai/how-i-ai/stripes-ai-minions-ship-1300-prs-weekly-from-a-slack-emoji)
- [Anthropic: 2026 Agentic Coding Trends Report](https://resources.anthropic.com/2026-agentic-coding-trends-report)
- [Fortune: Over 25% of Google's code written by AI](https://fortune.com/2024/10/30/googles-code-ai-sundar-pichai/)
- [Google Developers Blog: Build with Google Antigravity](https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/)
- [LinearB: How Meta Built Agentic Infrastructure](https://linearb.io/blog/meta-ai-control-plane-james-everingham-guildai)
- [Engineering at Meta: Ranking Engineer Agent](https://engineering.fb.com/2026/03/17/developer-tools/ranking-engineer-agent-rea-autonomous-ai-system-accelerating-meta-ads-ranking-innovation/)
- [Amazon CEO Andy Jassy: Q Developer saves 4,500 developer-years](https://finance.yahoo.com/news/amazon-ceo-andy-jassy-says-213018283.html)
- [Pragmatic Engineer: How Uber uses AI for development](https://newsletter.pragmaticengineer.com/p/how-uber-uses-ai-for-development)
- [Uber Blog: uReview — Scalable GenAI for Code Review](https://www.uber.com/blog/ureview/)
- [CNBC: Goldman Sachs pilots autonomous coder Devin](https://www.cnbc.com/2025/07/11/goldman-sachs-autonomous-coder-pilot-marks-major-ai-milestone.html)
- [Walmart Tech: From Models to Agents — WIBEY](https://tech.walmart.com/content/walmart-global-tech/en_us/blog/post/wibey-announcement.html)
- [Pragmatic Engineer: AI Tooling for Software Engineers in 2026](https://newsletter.pragmaticengineer.com/p/ai-tooling-2026)
- [Block Open Source: Introducing Goose](https://block.xyz/inside/block-open-source-introduces-codename-goose)
- [GitHub: block/goose](https://github.com/block/goose)
- [a16z Podcast Summary: Stripe's Will Gaybrick on Minions scaling to 7,000 PRs/week](https://www.signalcast.app/episode/a16z-podcast/stripes-ai-strategy-build-more-not-less)
- [Linear Customer Story: The coding agent behind 75% of Ramp's merged PRs](https://linear.app/customers/ramp)
- [Pragmatic Engineer: Why Ramp built its own in-house coding agent, Inspect](https://newsletter.pragmaticengineer.com/p/why-ramp-built-inspect)
- [Coinbase Blog: Coding Had a Concurrency Problem — How Mux Helped Solve It](https://www.coinbase.com/blog/coding-had-a-concurrency-problem-how-mux-helped-solve-it)
- [Forbes: Coinbase Forge Illustrates The Power Of Internal Architectures](https://www.forbes.com/sites/johnwerner/2026/08/05/coinbase-forge-illustrates-the-power-of-internal-architectures/)
- [Spotify Engineering: Background Coding Agents — Dataset Migrations (Honk, Part 4)](https://engineering.atspotify.com/2026/4/background-coding-agents-dataset-migrations-honk-part-4)
- [Spotify Engineering: Coding Is No Longer the Constraint](https://engineering.atspotify.com/2026/6/code-with-claude-coding-is-no-longer-the-constraint)
- [InfoQ: QCon London 2026 — Rewriting All of Spotify's Code Base, All the Time](https://www.infoq.com/news/2026/03/spotify-honk-rewrite/)
- [AWS DevOps Blog: Amazon Q Developer End-of-Support Announcement](https://aws.amazon.com/blogs/devops/amazon-q-developer-end-of-support-announcement/)
- [TechCrunch: Meta launches Muse Code, an AI agent for large code bases](https://techcrunch.com/2026/08/05/meta-launches-muse-code-an-ai-agent-for-large-code-bases/)
- [Pragmatic Engineer: How Uber uses AI for development (March 2026 update)](https://newsletter.pragmaticengineer.com/p/how-uber-uses-ai-for-development)
- [Pragmatic Engineer Newsletter: How Uber built an AI software factory for agentic coding](https://newsletter.port.io/p/how-uber-built-a-software-factory)
- [Shopify Engineering: Under the River](https://shopify.engineering/under-the-river)
- [Shopify Engineering: How River takes security work from a fix to merge](https://shopify.engineering/river-vulnerability-remediation)
- [TechCrunch: Airbnb says AI now writes 60% of its new code](https://techcrunch.com/2026/05/08/airbnb-says-ai-now-writes-60-of-its-new-code/)
- [PostHog Newsletter: Stop being the code review bottleneck](https://newsletter.posthog.com/p/code-review-tips)
- [Google Blog: Sundar Pichai shares news from Google Cloud Next 2026](https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/cloud-next-2026-sundar-pichai/)
- [Anthropic: When AI Builds Itself](https://www.anthropic.com/institute/recursive-self-improvement)
- [VentureBeat: Anthropic says 80% of its new production code is now authored by Claude](https://venturebeat.com/technology/anthropic-says-80-of-its-new-production-code-is-now-authored-by-claude-how-your-enterprise-can-keep-up)
- [Business Insider: OpenAI's President Says AI Has Gone From Writing 20% to 80% of Its Code](https://www.businessinsider.com/openai-president-ai-now-writing-80-percent-of-code-2026-5)
- [Fortune: Top engineers at Anthropic, OpenAI say AI now writes 100% of their code](https://fortune.com/2026/01/29/100-percent-of-code-at-anthropic-and-openai-is-now-ai-written-boris-cherny-roon/)
- [Metaintro: Nearly Every OpenAI Employee Now Codes With Codex](https://www.metaintro.com/blog/openai-employees-codex-ai-coding-preview-2026)
- [ITPro: "While the engineers slept, the agents kept building" — AWS UK chief touts big gains with AI-powered coding](https://www.itpro.com/software/development/while-the-engineers-slept-the-agents-kept-building-aws-uk-chief-touts-big-gains-with-ai-powered-coding)
