---
title: "Agent Skills: A Skill Framework That Makes AI Agents Work Like Senior Engineers"
date: 2026-04-10
type: guide
category: ai
tags: [agent-skills, ai-agent, harness-engineering, claude-code, cursor, gemini-cli, development-workflow]
lang: en
tldr: "Agent Skills is Addy Osmani's open-source collection of 19 production-grade engineering skills that drive AI agents to follow senior engineering discipline through /spec → /plan → /build → /test → /review → /ship commands, instead of cutting corners."
description: "An introduction to Addy Osmani's Agent Skills open-source project — a set of production-grade engineering workflows designed for AI coding agents, covering 7 development stage commands, 19 core skills, 3 expert roles, and unique designs like anti-rationalization tables."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-10-agent-skills-engineering-workflows)

AI coding agents are powerful, but they share a common tendency: taking the shortest path. If it runs, that's good enough — tests can wait, error handling can be skipped. This is fine during prototyping, but it's a disaster in production.

Addy Osmani's (Google Chrome team) [Agent Skills](https://github.com/addyosmani/agent-skills) attempts to solve this problem: encoding senior engineering discipline into structured Markdown skills, so AI agents follow production-grade standards at every step.

---

## Core Concept: Skills Are Not Prompts — They Are Workflows

Agent Skills are different from typical system prompts or coding guidelines. Each skill is a complete workflow that includes concrete steps, quality gates, verification requirements, and even lists of "excuses you might use to skip this step."

This is closer to the harness engineering philosophy — rather than just telling an agent to "write good code," you design an environment where it's hard to write bad code.

---

## Seven Development Stage Commands

The entire framework is designed around the development lifecycle with seven slash commands:

```
/spec  →  Define requirements, clarify boundaries
/plan  →  Break down tasks, mark dependencies
/build →  Incremental implementation, step-by-step verification
/test  →  Browser testing, debugging
/review → Code review, quality gates
/code-simplify → Simplify code
/ship  →  Deploy to production
```

The key point is that this doesn't just suggest you "should plan before coding" — each command has a corresponding skill document that defines exactly what to do, how to verify completion, and what constitutes a red flag.

---

## 19 Core Skills

Categorized by development stage:

### Define (2)

- **Idea Refinement**: Guides exploration and idea clarification, preventing you from diving straight into implementation
- **Specification-Driven Development**: Write specs before code, defining inputs, outputs, and boundary conditions

### Plan (1)

- **Task Breakdown**: Decompose specs into atomic tasks, arrange dependency order, and keep each change around 100 lines

### Build (5)

- **Incremental Implementation**: Don't write everything at once — each step has a verification checkpoint
- **Test-Driven Development**: Write tests first, following the test pyramid (80% unit / 15% integration / 5% E2E)
- **Context Engineering**: Manage the agent's context to ensure sufficient background information at every step
- **Frontend UI Engineering**: A frontend-specialized build workflow
- **API and Interface Design**: Incorporates design principles like Hyrum's Law

### Verify (2)

- **Browser Testing**: Browser testing with Chrome DevTools
- **Debugging and Error Recovery**: A structured debugging process, not trial and error

### Review (4)

- **Code Review and Quality Gates**: Review by senior engineer standards
- **Code Simplification**: Apply Chesterton's Fence principle — understand why something exists before deciding whether to remove it
- **Security and Hardening**: Security scanning and hardening
- **Performance Optimization**: Performance targets and measurement

### Ship (5)

- **Git Workflow**: Trunk-based development, feature flags
- **CI/CD and Automation**: Automated pipelines
- **Deprecation and Migration**: Deprecation and migration strategies
- **Documentation and ADR**: Documentation and Architecture Decision Records
- **Shipping Procedures**: Go-live checklists

---

## Three Expert Roles

Beyond skills, Agent Skills provides three switchable review perspectives:

| Role | Perspective | Focus Areas |
|------|------------|-------------|
| Code Reviewer | Senior Staff Engineer | Architecture, readability, maintainability |
| Test Engineer | QA Expert | Test coverage, edge cases, test pyramid |
| Security Auditor | Security Engineer | OWASP Top 10, injection attacks, access control |

This lets you perform multi-angle reviews on the same code, rather than relying on a single perspective.

---

## Design Philosophy: Making It Hard for Agents to Cut Corners

Several design details in Agent Skills are particularly noteworthy:

### Anti-Rationalization Tables

Each skill has a built-in table listing common "excuses for skipping this step" along with corresponding rebuttals. For example:

| Excuse | Rebuttal |
|--------|----------|
| "This is just a small change, no need for tests" | Small changes account for the majority of regressions |
| "I'll add documentation later" | Later never comes |
| "I'm in a rush, let's ship first" | Fixing production bugs takes far longer than writing tests |

This design directly targets a weakness of LLMs: they're excellent at rationalizing their own shortcuts. With explicit rebuttals, agents find it harder to convince themselves to skip critical steps.

### Verification Requirements Are Mandatory

Each skill ends with verification checkpoints that require concrete evidence — test results, build output, runtime data. Not "I think it's done," but "here's the output proving it's done."

### Progressive Disclosure

The modular design allows each skill to operate independently — you don't need to load all 19 at once. This controls token usage and prevents the context window from being filled with irrelevant instructions.

---

## Platform Support

Agent Skills are essentially structured Markdown, so they work with virtually any AI coding tool:

| Platform | Installation |
|----------|-------------|
| Claude Code | Marketplace install or `--plugin-dir` for local loading |
| Cursor | Place in `.cursor/rules/` |
| Gemini CLI | `gemini skills install` |
| Windsurf | Copy to rules settings |
| GitHub Copilot | Place in `.github/copilot-instructions.md` |
| Others | Any agent that accepts Markdown instructions |

---

## Overall Assessment

Agent Skills addresses a clear problem: AI agents optimize for speed by default, but production environments require reliability.

This framework is a good fit for:
- Teams already using AI agents for development but dissatisfied with output quality
- Those who want to maintain engineering discipline in AI-assisted development, rather than fixing things after the fact
- Those who need a standardized process that's cross-platform and incrementally adoptable

Not a good fit for:
- Pure prototyping or hackathons where speed matters more than quality
- Teams with mature internal engineering standards (potential conflicts)

The core trade-off is exchanging tokens and step count for quality assurance. If your AI agents frequently produce code that "runs but isn't production-ready," Agent Skills is worth trying.

## References

- [Agent Skills - GitHub](https://github.com/addyosmani/agent-skills)
- [Addy Osmani - GitHub](https://github.com/addyosmani)
- [Claude Code - Anthropic](https://docs.anthropic.com/en/docs/claude-code)
- [Cursor IDE](https://cursor.com)
- [Gemini CLI - Google](https://github.com/google-gemini/gemini-cli)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Hyrum's Law](https://www.hyrumslaw.com/)
