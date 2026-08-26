---
title: "How Claude Code Orchestrates Subagents at Scale: Dynamic Workflows, ultracode, and Rerunnable Scripts"
date: 2026-08-26
type: deep-dive
category: tech
tags: [claude-code, dynamic-workflows, orchestration]
lang: en
tldr: "Dynamic workflows let Claude write multi-agent orchestration as a JavaScript script that a runtime executes in the background — up to 1,000 agents per run, savable as a /<name> command. This piece covers trigger methods, the save-and-rerun flow, three fit scenarios (codebase audit, large migration, cross-checked research), and where they differ from Agent Teams."
description: "A deep dive into Claude Code dynamic workflows: how scripts are generated and saved, which task sizes they fit, and how they differ from subagents and Agent Teams."
draft: true
series:
  name: "Claude Code Deep Dives"
  order: 27
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-08-26-claude-code-dynamic-workflows)

If you have used [sub-agents for parallel execution](/posts/tech/deep-dive/2026-03-28-claude-code-sub-agent-parallel-execution-en), you have probably hit the same wall: asking Claude to spin up five subagents to scan five directories works fine, but running the same sweep every week — or rerunning it with different parameters — means directing the whole thing from scratch again. Claude decides turn by turn how many agents to spawn, results land in its context window, and nothing about the orchestration survives.

Dynamic workflows exist precisely for this. Built into Claude Code since v2.1.154, available on all paid plans (Pro users enable them via `/config`).

## An Orchestration Script That Writes Itself

The substance of a dynamic workflow is a JavaScript program: Claude writes it based on the task you describe, and an independent runtime executes it in the background while your session stays responsive. The key difference is **where the plan lives**. With subagents and skills, the plan sits in Claude's context, decided turn by turn; in a workflow, the plan is code — loops, branching, and intermediate results all live in script variables, and Claude's context only receives the final report.

The docs put the decision criterion plainly: "Reach for a workflow when a task needs more agents than one conversation can coordinate, or when you want the orchestration codified as a script you can read and rerun."

The script shape is plain. `agent()` spawns one subagent, `pipeline()` runs one per item in a list:

```javascript
export const meta = {
  name: 'audit-routes',
  description: 'Audit every route handler for missing auth checks',
}

const found = await agent('List every .ts file under src/routes/.', {
  schema: { type: 'object', required: ['files'], properties: { files: { type: 'array', items: { type: 'string' } } } },
})

const audits = await pipeline(found.files, file =>
  agent(`Audit ${file} for missing authentication checks.`, { label: file }),
)

return audits.filter(Boolean)
```

You rarely need to write this yourself — but it is plain text: readable, diffable across runs, and editable by hand before asking Claude to relaunch from the modified version.

## From One Sentence to One Command

There are two ways to generate a workflow:

- **Add the keyword `ultracode` to your prompt**, e.g. `ultracode: audit every API endpoint under src/routes/ for missing auth checks`. Saying "use a workflow" in natural language works identically. Press `Option+W` to dismiss an accidental trigger, or turn off the keyword trigger in `/config`.
- **`/effort ultracode`**: let Claude decide per task whether it warrants a workflow for the whole session. The cost is more tokens and longer runs on every substantive request — switch back to `/effort high` for routine work.

Workflows run in the background. Type `/workflows` to see each phase's agent count, token usage, and elapsed time; you can pause mid-run, stop individual agents, or kill the whole run. On first launch, Claude Code shows the planned phases and asks for approval — `Ctrl+G` opens the raw script so you can read it before deciding.

Once a run does what you wanted, select it in `/workflows` and press `s` to save: to `.claude/workflows/` in your project (shared with everyone who clones the repo) or `~/.claude/workflows/` in your home directory (every project, visible only to you). Saved workflows become `/<name>` commands, appearing in autocomplete alongside the bundled `/deep-research`. The save location is checked for symlinks, so files never land somewhere unexpected through a link. For what else lives under `.claude/`, see [A Complete Tour of the .claude Directory](/posts/tech/deep-dive/2026-08-26-claude-code-claude-directory-en).

## Three Scenarios Where They Shine

The three situations the official docs call out map neatly onto three needs: bigger than one context, longer than one run, more trustworthy than one source.

**Codebase audit.** One agent per route handler hunting for missing authentication checks, then independent agents adversarially verify each finding before it is reported. This breadth-plus-cross-check pattern is nearly impossible to direct by hand.

**Large migrations.** Five hundred files moving from styled-components to Tailwind: discover the list first, transform each file on an isolated copy to avoid conflicts, then verify each result. The script tracks progress; you don't watch.

**Cross-checked research.** The bundled `/deep-research` is the ready-made example: fan out web searches across angles, fetch sources and check them against each other, vote claim by claim, filter out anything that fails cross-checking, and return a cited report. Claims the verifiers couldn't check — after a rate limit, say — are marked unverified rather than counted as refuted.

## How This Differs from Agent Teams

[Agent Teams](/posts/tech/deep-dive/2026-03-28-claude-code-agent-teams-guide-en) and dynamic workflows both mean "many Claudes working at once," but the control logic is inverted. A team has a lead agent supervising teammates turn by turn — right for long tasks that need live coordination and discussion. A workflow's plan is fixed in the script: no in-flight judgment, but in exchange you get determinism — the same script is the same orchestration every time, and you can save it as a command any teammate can rerun. Reach for teams when coordination matters; reach for workflows when repeatability does.

## Limits and Cost Considerations

The limits are documented plainly: the script itself cannot touch the filesystem, run shell commands, or load modules (any `import()` fails before the run starts) — agents do the actual work. Each run caps at 1,000 agents total, up to 16 concurrent. There is no mid-run user input; if you need sign-off between stages, split each stage into its own workflow. Resume only works within the same session, and replay follows start order: cached results stop at the first agent that didn't finish, and everything started after it reruns even if it had completed — so scripts built from many small agents preserve progress far better than one long-running agent.

Cost is the real gate. Multi-agent runs can consume meaningfully more tokens than conversational work, and they count toward your plan's usage limits like any session. Three practical levers: trial-run on a small slice first to gauge spend; expect a `Large workflow` warning past 25 agents or a projected total above 1.5 million tokens (advisory only — it doesn't pause anything); and set the size guideline in `/config` to small (under 5), medium (under 15, the default), or large (under 50). Fan-out agents also share prompt cache: held agents are released once the first response begins, so they read the cached prefix instead of reprocessing it.

## Why It Matters

Several earlier pieces on this site examine Anthropic's harness engineering — the [harness design analysis](/posts/ai/2026-03-28-anthropic-harness-design-en), the [evolution of harness engineering](/posts/ai/2026-03-28-harness-engineering-evolution-en), and [harness engineering patterns](/posts/ai/2026-03-30-harness-engineering-patterns-en). Their shared thesis: agent quality depends on how the harness orchestrates context, tools, and verification loops. Dynamic workflows are essentially that orchestration capability externalized into a script you can read, edit, and rerun — orchestration that used to hide inside Claude's turn-by-turn decisions now sits in a file under version control. For the rest of the multi-agent picture, see [F1: The Multi-Agent Overview](/posts/tech/deep-dive/2026-08-26-claude-code-multi-agent-overview-en).

## References

- [Orchestrate subagents at scale with dynamic workflows — Claude Code Docs](https://code.claude.com/docs/en/workflows) — official documentation on triggers, script structure, runtime limits, and cost controls; the primary source for this piece

## Changelog

- 2026-08-26: Initial version, based on the official documentation as of August 2026 (v2.1.154+, enabled via `/config` on Pro).
