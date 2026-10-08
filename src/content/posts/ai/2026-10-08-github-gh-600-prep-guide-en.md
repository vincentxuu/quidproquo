---
title: "GitHub Agentic AI Developer (GH-600): It Tests How You Run Coding Agents, Not How You Write Them"
date: 2026-10-08
type: guide
category: ai
tags: [certification, github, coding-agent, multi-agent, mcp, career]
lang: en
series:
  name: "AI Certification Prep"
  order: 29
tldr: "GH-600 is GitHub's agent certification (listed as Intermediate), covering how to operate, supervise, and govern AI agents inside a software development workflow. The six areas weigh 15–20 / 20–25 / 10–15 / 15–20 / 15–20 / 10–15, the heaviest being tools and environment (MCP, permissions, CI invocation, error handling). The most common verb in the objectives is configure (15 of 65), followed by identify and implement. Official specs: $165 in the US, $83 in Taiwan, 120 minutes, pass at 700, valid 2 years, English only, no official practice assessment, and under 6 hours of official self-paced material."
description: "A preparation guide for GitHub Certified: Agentic AI Developer (GH-600), built on the official study guide's six weighted skill areas: what each tests, which areas the two official learning paths cover, a five-week schedule with its derivation, how to compensate for thin material, and how it divides the work with GH-300."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-08-github-gh-600-prep-guide)
>
> This is a preparation path built from official material, not an exam-day account. I have not sat this exam. Every "what it tests" points back to the [official study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-600), and every "how to prepare" points to official training and GitHub documentation. No leaked questions. Verified 2026-10-08.

Getting a coding agent to open a branch and send a pull request is easy. The hard part is noticing when it is wrong, stopping it, and recovering. GH-600 is about that. The certification is meant to show you can do "operating, integrating, supervising, and governing AI agents" in production development workflows, with GitHub as the system of record and control plane.

It sits one layer above [GH-300](/posts/ai/2026-10-08-github-gh-300-prep-guide-en): GH-300 tests whether you can use Copilot, and GH-600 tests whether you can let a group of agents run safely inside a team's process.

## Who This Is For

The audience profile in the study guide lists five responsibilities:

- Operating agent workflows inside the SDLC
- Supervising autonomous behavior with GitHub controls
- Evaluating and tuning agent outputs using scans and artifacts
- Configuring custom agents
- Coordinating multi-agent execution safely

It asks for experience with the SDLC, GitHub workflows and controls, and code quality, security, and review practices, plus hands-on use of coding agents including "GitHub Copilot, MCP servers and agent customization such as custom instructions, custom agents, tools, and Copilot setup steps".

**A good fit**: platform engineers, DevOps engineers, technical leads, and anyone who decides how far an agent is allowed to go in the team's repositories.

**Not a fit**: people who have not yet run agents inside a team workflow. The objectives are written from an operator's seat, and without having dealt with an agent breaking something or two agents editing the same file, they read as abstractions. It also does not suit people who want an exam on building an agent framework from scratch, which is closer to Microsoft's [AI-500](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide-en).

## Official Specs

| Item | Detail |
|---|---|
| Exam code | GH-600 |
| Certification | GitHub Certified: Agentic AI Developer |
| Price | **$165 USD** in the US, **$83 USD** in Taiwan (priced by the country where the exam is proctored) |
| Duration | **120 minutes** |
| Questions | Not listed on the Microsoft Learn certification page; GitHub's certification FAQ gives a general figure for its exams of 60 scored multiple-choice questions plus roughly 10–15 unscored items |
| Format | The certification page says "You may have interactive components to complete as part of this exam" |
| Passing score | **700** (the [general passing score for Microsoft technical exams](https://learn.microsoft.com/en-us/credentials/certifications/exam-scoring-reports) on a 1–1,000 scale; the certification page states no separate figure) |
| Validity | **2 years** |
| Languages | **English only** |
| Proctoring | Pearson VUE |
| Prerequisites | None listed |

The price is one tier above GH-300's $99 and matches Microsoft's associate exams.

## The Six Skill Areas

| Skill area | Weight |
|---|---|
| Prepare agent architecture and SDLC processes | 15–20% |
| **Implement tool use and environment interaction** | **20–25%** |
| Manage memory, state, and execution | 10–15% |
| Perform evaluation, error analysis, and tuning | 15–20% |
| Orchestrate multi-agent coordination | 15–20% |
| Implement guardrails and accountability | 10–15% |

The six are evenly spread, and even the heaviest is only 20–25%.

## Preparing Area by Area

### Prepare agent architecture and SDLC processes (15–20%)

**What it tests**:

- **Integrating agents into the SDLC**: identify which steps agents perform; identify and mitigate common agent anti-patterns; define inputs, outputs, and success criteria.
- **Boundaries between planning, reasoning, and action**: **configure planning to be distinct from execution**; have the agent output a structured plan; validate plans; **prevent action until it is checked and approved** (the official wording is garbled, "Prevent agent action until the agent checked and approved", and is read here from context as the plan being checked and approved).
- **Observability and control**: plan and implement the degree of autonomy and its guardrails; have agents produce inspectable artifacts within standard development tooling; **configure human intervention without slowing delivery**.

**How to prepare**: the core is the plan-then-approve pattern. Exercise: configure an agent to write its plan as an issue comment or a file, and only let it act after a person has read it. The page the study guide lists for this area is [preparing for custom agents](https://docs.github.com/copilot/how-tos/administer-copilot/manage-for-organization/prepare-for-custom-agents), but it only explains which repository holds an organization's custom agents and does not cover planning or approval.

### Implement tool use and environment interaction (20–25%, the heaviest)

**What it tests**, in four groups:

| Subtopic | Objectives |
|---|---|
| Tools | Identify required tools; configure tools; **configure tool permissions** |
| **MCP servers** | Add an MCP server as an agent tool; configure a GitHub remote MCP server; **configure MCP registries**; **configure MCP allow lists** |
| Development environment integration | Evaluate the agent's execution context; scope an agent to a specific repository; **invoke an agent in a CI workflow**; branch-based scope; let the agent create branches and pull requests on its own; handle environment-specific constraints |
| Safe execution and error handling | Error handling, **retries, rollbacks, escalation paths**; traceability and accountability for agent actions |

Two of the four MCP objectives are controls (registries and allow lists). The exam is about how an organization limits which servers an agent can reach.

**How to prepare**: configure it for real. A minimal exercise: set up a custom agent for one repository, attach an MCP server, restrict its tool permissions, and have it triggered from CI to open a pull request by itself. The page the study guide lists for this area is [custom agents and sub-agent orchestration in the Copilot SDK](https://docs.github.com/copilot/how-tos/copilot-sdk/use-copilot-sdk/custom-agents), which covers scoping an agent's tools and attaching MCP servers in code. Repository-level configuration, CI invocation, opening pull requests, MCP registries, and allow lists need other GitHub Copilot documentation.

### Manage memory, state, and execution (10–15%)

**What it tests**:

- **Memory strategies**: choose between short-term, long-term, and external memory; scope memory to task-relevant information; **define expiration, pruning, and reset rules**.
- **State and drift**: capture task progress and decisions as durable artifacts; **resume work without repeating steps or diverging from earlier decisions**; detect and correct drift during long runs.
- **Continuity across tools**: share agent state; prevent conflicting context; prevent stale context.

**How to prepare**: read GitHub's [Copilot memory documentation](https://docs.github.com/copilot/concepts/agents/copilot-memory). Exercise: interrupt an agent mid-task, pick the work up in a new session, and see what it relies on to know where it stopped. Note that Copilot Memory stores repository-level facts and personal preferences, and deletes unused ones after 28 days. It does not hold task progress; resuming work depends on artifacts such as pull requests, issues, and files.

### Perform evaluation, error analysis, and tuning (15–20%)

**What it tests**:

- **Success criteria and evaluation signals**: specify expected outcomes and operational constraints; identify qualitative and quantitative signals; align criteria with development intent; **generate evaluation signals with automated scanning tools**.
- **Failure analysis**: identify failures from logs, plans, traces, outputs, and workflow artifacts; **classify root causes, with reasoning errors, tool misuse, and context or environment issues given as examples**.
- **Tuning**: revise instructions, workflows, or constraints; refine memory usage; refine tool usage and tool access.

**How to prepare**: the three root-cause categories the guide names make a workable frame for this area. Exercise: collect three agent failures, assign each to a category, and write the matching fix (change instructions, change tool permissions, supply context).

### Orchestrate multi-agent coordination (15–20%)

**What it tests**, in four groups:

- **Operating multi-agent workflows**: apply an orchestration pattern; **configure agent isolation for parallel execution**; **detect and resolve agent conflicts, including overlapping code changes, duplicated effort, and contradictory outputs**.
- **Observability**: have multi-agent workflows produce artifacts suitable for review and audit; document key decisions, handoffs, and outcomes across agents; post-hoc analysis.
- **Failure and degradation**: identify failed, partial, or stalled executions; respond to degraded behavior or coordination; **multi-agent recovery patterns, including rollback and human-in-the-loop**.
- **Agent lifecycle**: add agents to existing workflows; **update, reconfigure, or replace agents without disrupting active workflows**; retire agents while preserving auditability and workflow continuity.

The fourth group is rare in other certifications. It tests rollout, replacement, and retirement, treating an agent as a service to be operated.

**How to prepare**: the shared multi-agent concepts (orchestration topologies, handoffs, human-in-the-loop) are covered in [Where multi-agent architecture overlaps across exams](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains-en). What is specific to GH-600 is conflict: how to isolate two agents working on the same repository in parallel, and what to do when they collide. Exercise: have two agents work related tasks on separate branches, then handle the merge conflict.

### Implement guardrails and accountability (10–15%)

**What it tests**:

- **Autonomy levels**: classify agent actions by operational, security, and compliance risk to right-size human intervention; assign autonomy levels that maximize delivery speed while complying with organizational security and Responsible AI standards.
- **Guardrails and human-in-the-loop**: identify the actions that need human judgment; block actions that violate policy; **scope permissions and execution contexts to least privilege**; **require explicit authorization or controlled paths for irreversible or compliance-sensitive changes**; **preserve execution velocity by minimizing approvals that do not materially reduce risk**.

The last objective is worth remembering. The exam's position is not that more approvals mean more safety; approvals should go where they reduce risk. The first area has the same shape (human intervention without slowing delivery).

**How to prepare**: the matching documentation is [building guardrails](https://docs.github.com/copilot/tutorials/cloud-agent/build-guardrails) and [risks and mitigations](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/risks-and-mitigations). Exercise: list ten actions an agent could take in your team's repositories, assign each an autonomy level and an approval requirement, and write down why.

## A Five-Week Schedule and How It Was Derived

**Derivation**: there are two official learning paths with three modules each:

| Learning path | Modules | Areas covered |
|---|---|---|
| [Developing in Agentic AI Systems Part 1](https://learn.microsoft.com/en-us/training/paths/gh-developing-agentic-systems-1/) | Foundations of Agentic AI in GitHub; Designing Agent Architecture and SDLC Integration; Tooling, MCP, and Agent Execution Environments | Areas 1 and 2 |
| [Part 2](https://learn.microsoft.com/en-us/training/paths/github-agentic-systems-part-two/github-agentic-systems-part-two/) | Multi-Agent systems and orchestration; Memory, State, and Evaluation; Governance, guardrails, and operations | Areas 3 to 6 |

The durations in the Microsoft Learn catalog add up to about 5.8 hours, and the instructor-led course [GH-600T00-A](https://learn.microsoft.com/en-us/training/courses/gh-600t00) is one day. **That is thin for six areas**: the "Memory, State, and Evaluation" module is listed at 50 minutes and maps to areas 3 and 4, which together carry 25–35% of the exam. Most of the schedule therefore goes to hands-on work, and 6–8 hours a week gives five weeks.

| Week | Content | Basis |
|---|---|---|
| 1 | Read the study guide, take Part 1 | About 2.8 hours of material |
| 2 | **Tools and environment (20–25%)**: custom agents, MCP, CI invocation | Heaviest area, and all of it needs real configuration |
| 3 | Part 2 plus memory and evaluation (25–35% combined) | The two thinnest areas; fill in with documentation and practice |
| 4 | Multi-agent coordination (15–20%) and guardrails (10–15%) | Run parallel agents and resolve a conflict once |
| 5 | Self-assess against the study guide line by line | There is no official practice assessment |

**One gap in the material**: no unit title in either learning path maps directly to the retries, rollbacks, and escalation paths in area 2, so those come from documentation and practice.

**Failure cost is on the high side**: the certification page links to Microsoft's [retake policy](https://learn.microsoft.com/en-us/credentials/support/retake-policy): 24 hours after a first failure, 14 days between later attempts, at most 5 attempts in 12 months. Each attempt costs $165 ($83 in Taiwan) and there is no practice assessment to gauge readiness first, so leave slack in the schedule.

## Known Traps

1. **There is no official practice assessment.** The GH-300 certification page has a "Practice for the exam" section and the GH-600 page does not. Only the exam sandbox is available, for getting used to the interface.
2. **The study guide lists half the material.** "Get trained" names only the three Part 1 modules; Part 2 is reachable from the instructor-led course page. Following the study guide alone misses the material for multi-agent, memory, evaluation, and governance.
3. **One documentation link in the study guide is broken.** The link for area 6 fuses two URLs into one and goes nowhere. The correct targets are two separate pages, the two listed under area 6 above. Areas 2 and 5 also link to the same page.
4. **The study guide is missing from the Microsoft Learn sidebar.** You cannot find GH-600 from the table of contents on other exams' study guide pages; go through the link on the certification page.
5. **The renewal text is Microsoft boilerplate.** "Useful links" in the study guide says certifications expire annually. That is template text. GitHub certifications are valid for two years, as the certification page says.
6. **The product moves fast.** MCP registries, allow lists, and the cloud agent are all still evolving. The study guide notes that most questions cover generally available features, but commonly used preview features may appear.

## After the Exam: Two-Year Validity, Renewal in Transition

Same as GH-300. The certification page says GitHub certifications are valid for two years and are moving to Microsoft's recertification process, which will let you maintain the credential without retaking the full exam. Certifications that expire before the new process launches are extended by 6 months. Details are in the [renewal section of the GH-300 guide](/posts/ai/2026-10-08-github-gh-300-prep-guide-en).

## Things That Will Go Stale

| Item | Status (verified 2026-10-08) | When to recheck |
|---|---|---|
| Weights | 15–20 / 20–25 / 10–15 / 15–20 / 15–20 / 10–15 | On each revision |
| Price | $165 US, $83 Taiwan | Every six months |
| Practice assessment | None | Monthly |
| Exam languages | English only (the course is also offered in Japanese, Korean, Portuguese, and Spanish) | Quarterly |
| Study guide material list and broken link | Lists Part 1 only; area 6 link is fused | When GitHub fixes it |
| Renewal process | In transition, not yet live | Quarterly |

## References

- [GitHub Certified: Agentic AI Developer certification page](https://learn.microsoft.com/en-us/credentials/certifications/agentic-ai-developer/)
- [GH-600 official study guide (full objectives and weights)](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-600)
- [GH-600T00-A instructor-led course page (source of the two learning paths)](https://learn.microsoft.com/en-us/training/courses/gh-600t00)
- [Learning path: Developing in Agentic AI Systems Part 1 of 2](https://learn.microsoft.com/en-us/training/paths/gh-developing-agentic-systems-1/)
- [Learning path: Developing in agentic AI systems part 2 of 2](https://learn.microsoft.com/en-us/training/paths/github-agentic-systems-part-two/github-agentic-systems-part-two/)
- [GitHub Docs: Preparing for custom agents](https://docs.github.com/copilot/how-tos/administer-copilot/manage-for-organization/prepare-for-custom-agents)
- [GitHub Docs: Custom agents](https://docs.github.com/copilot/how-tos/copilot-sdk/use-copilot-sdk/custom-agents)
- [GitHub Docs: Copilot memory](https://docs.github.com/copilot/concepts/agents/copilot-memory)
- [GitHub Docs: Building guardrails](https://docs.github.com/copilot/tutorials/cloud-agent/build-guardrails)
- [GitHub Docs: Risks and mitigations for the cloud agent](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/risks-and-mitigations)
- [Microsoft exam retake policy](https://learn.microsoft.com/en-us/credentials/support/retake-policy)

**Related on this site**

- [GitHub Copilot certification (GH-300) preparation path](/posts/ai/2026-10-08-github-gh-300-prep-guide-en)
- [Where multi-agent architecture overlaps across exams](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains-en)
- [Microsoft AI-500 preparation path](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide-en)
- [What AI certifications engineers can take in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en)
