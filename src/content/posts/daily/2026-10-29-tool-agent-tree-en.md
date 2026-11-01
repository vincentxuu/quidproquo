---
title: "Tool Pick｜agent-tree — Watch, Stop, and Switch Models on Your Claude Code Subagents, Live in the Terminal"
date: 2026-10-29
category: daily
type: digest
tags: [ai-agent, tool, daily, framework-plugin]
lang: en
description: "A Claude Code plugin opens a live tree panel in your terminal showing every subagent — and lets you click to stop one, swap its model, or send it a new instruction, not just watch"
tldr: "agent-tree is a Claude Code plugin that opens a live tree panel in your terminal showing every running subagent. Unlike comparable read-only monitors, it lets you click to stop a subagent, swap its model, or send it a new instruction. Install: `claude plugin install agent-tree --marketplace MikeGT4/agent-tree`. It solves the problem that once a multi-agent workflow is running, you can't see what's happening inside it or change course."
series:
  name: "AI Tool of the Day"
  order: 67
---

> 🌏 [中文版](/posts/daily/2026-10-29-tool-agent-tree)

## Tool Info

| Item | Value |
|---|---|
| Name | agent-tree |
| Type | Claude Code plugin |
| GitHub | [MikeGT4/agent-tree](https://github.com/MikeGT4/agent-tree) |
| Stars | 9 (created 2026-10-22, still shipping updates frequently) |
| Language | TypeScript |
| License | MIT |
| Install | `claude plugin install agent-tree --marketplace MikeGT4/agent-tree` |

## What problem it solves

You spin up several Claude Code subagents at once — one touching the frontend, one running tests, one digging through docs. All you can see in the terminal is a single scrolling log. Which subagent is stuck, which one is burning tokens, which one already went off track — you only find out once it finishes, and by then it's too late to do anything about it.

agent-tree turns that state into a live side panel: a main box shows the session's overall effort, context usage and cost, and each subagent gets its own box showing its model, current task type, and latest reply. What sets it apart from most "subagent monitoring" tools is that it isn't read-only — clicking a running subagent's model swaps it out; clicking into its task field, typing, and pressing Enter queues a new instruction that takes effect before its next step; and the ■ button on its box stops that subagent on the spot, without waiting for it to finish or killing the whole session with Ctrl+C.

It fits people who already run several subagents in parallel and get impatient waiting for all of them to finish before noticing one went sideways. If you only open one or two subagents occasionally and watch the terminal the whole time anyway, the panel won't change much.

```diagram
title: One step short of "watch" becomes "watch and act"
desc: Most subagent monitoring tools stop at the left path; agent-tree takes the extra step on the right, letting you intervene while the subagent is still running.
caption: Simplified from agent-tree's README and docs/GUIDE.md interaction flow.
step: The side panel shows each subagent's model, task, and latest reply live
step: You spot a subagent going the wrong way or using the wrong model
step: Click to switch its model, type a new instruction, or hit ■ to stop it — no need to wait for it to finish
---
<svg viewBox="0 0 640 300">
  <circle class="dg-dot" cx="320" cy="8" r="6" data-step="1"/>
  <path class="dg-line" d="M320 14V40" marker-end="url(#arrow)" data-step="1"/>

  <g data-step="1">
    <rect class="dg-box" x="100" y="40" width="440" height="56" rx="6"/>
    <text class="dg-label" x="320" y="59" text-anchor="middle" dominant-baseline="central">Live tree in the side panel</text>
    <text class="dg-sub" x="320" y="79" text-anchor="middle" dominant-baseline="central">One box per subagent: model / task / latest reply</text>
  </g>

  <path class="dg-line" d="M320 96V128" marker-end="url(#arrow)" data-step="2"/>

  <g data-step="2">
    <rect class="dg-box dg-box--accent" x="100" y="128" width="440" height="56" rx="6"/>
    <text class="dg-label" x="320" y="147" text-anchor="middle" dominant-baseline="central">You spot a subagent going wrong</text>
    <text class="dg-sub" x="320" y="167" text-anchor="middle" dominant-baseline="central">Wrong model, wrong direction, or stuck</text>
  </g>

  <path class="dg-line" d="M320 184V216" marker-end="url(#arrow)" data-step="3"/>

  <g data-step="3">
    <rect class="dg-box" x="100" y="216" width="440" height="56" rx="6"/>
    <text class="dg-label" x="320" y="235" text-anchor="middle" dominant-baseline="central">Switch model / inject instruction / ■ stop</text>
    <text class="dg-sub" x="320" y="255" text-anchor="middle" dominant-baseline="central">Intervene while it's still running, not after</text>
  </g>
</svg>
```

## Quick start

### Install

```bash
# Run in your terminal (not inside a Claude Code session)
claude plugin install agent-tree --marketplace MikeGT4/agent-tree

# Start Claude Code afterward; the panel opens by itself
# Or install from inside a session:
# /plugin install agent-tree --marketplace MikeGT4/agent-tree

# Needs Claude Code 2.1.292 or later; the README says it's tested with 2.1.312
```

### Basic usage

No extra setup is needed after install — the panel opens automatically once a subagent starts. You can also control it with slash commands:

```bash
/agent-tree                  # Reopen the panel manually
/agent-tree style braille    # Switch visual style (line / pixel / braille / HUD / ASCII)
/agent-tree clear            # Clear the current tree and start fresh
/agent-tree stop             # Close the panel
```

Inside the panel, use the mouse (or Tab to move focus, Enter to act): click a running subagent's model name to swap its model; click into its task field, type, and press Enter to send a new instruction before its next step; click the ■ on its box to stop that subagent immediately. Press `a` to open appearance settings (style, color, glow); `ctrl+x` then `tab` moves focus into the panel.

### Advanced usage (optional)

```bash
# Set the default model new subagents will use going forward
# (this does not change an already-running one)
# In the panel, press m, or click "Sub-agent model", and pick 0-4
```

The panel also has an advisor toggle (`/advisor`) you can set as your default on or off. It shares the same hook mechanism as model switching, stopping, and instruction injection — triggered only after you act in the panel. The plugin itself does one version check per day (reads `plugin list --json`, compares it against the version number on GitHub, and runs `plugin update` if a newer one exists), and sends nothing else.

## Comparison with existing tools

At least three people independently built a "draw your Claude Code subagents as a tree" tool within the same month, and their names collide:

| | agent-tree (MikeGT4) | agent-tree (SeanoChang) | cc-agent-tree (niemes) |
|---|---|---|---|
| Created | 2026-10-22 | 2026-10-07 | 2026-10-09 |
| Language | TypeScript | TypeScript | Python |
| Interactive? | Yes: switch model, inject instruction, stop subagent | Read-only, but flags anomalies (failures, stalls, two subagents editing the same file) and exports SVG/PNG | Read-only, zero external dependencies |
| Data source | Claude Code hook events (spawn / tool call / turn end) | Hook events + reads subagent transcripts | Tails existing `~/.claude/projects/*/*.jsonl` transcripts directly |
| Install | `claude plugin install` | `claude plugin install` (needs a build that supports function-hook mods) | Runs standalone, outside the plugin mechanism |

All three install in a few minutes. The real difference is "watch only" versus "watch and act." cc-agent-tree reads the transcript files Claude Code already writes, so it's the lightest to set up — but its own README states the transcript format is internal and can change. agent-tree (SeanoChang) adds anomaly detection and export. Only agent-tree (MikeGT4) connects "spotting the problem" to "fixing it on the spot," which is also why it's the one that got independent coverage from tech outlets. When installing, double-check the marketplace argument is exactly `MikeGT4/agent-tree` so you don't end up with one of the other two same-named projects.

## Things to watch out for

- **Needs a fairly new Claude Code build**: the panel relies on function-hook mod support; the README lists 2.1.292 as the minimum, and installing it on an older CLI won't show the side panel.
- **Young, single-maintainer project**: created on 2026-10-22, currently at 9 stars with one contributor, and tightly coupled to Claude Code's internal hook API — that layer can change, and the plugin would need to follow.
- **Updates itself automatically**: in interactive sessions it checks its version once a day and runs `plugin update` on its own. If you don't want background auto-updates, read [PRIVACY.md](https://github.com/MikeGT4/agent-tree/blob/main/PRIVACY.md) before installing.
- **Easy to mix up by name**: at least three unrelated projects from the same period are called "agent-tree" or something close — confirm the marketplace argument points to the right repo before installing.

## Takeaway

Three people independently building a "live tree view of Claude Code subagents" tool within the same month signals that running multiple subagents in parallel has become common enough that "I can't see what's happening inside" is now a problem worth solving. But only one of the three pushed past "seeing the problem" to "fixing it in the moment" — switching models, injecting instructions, stopping outright. Observability is table stakes; whether you can act the instant you spot a problem is what actually separates these tools.

## References

- [MikeGT4/agent-tree — GitHub](https://github.com/MikeGT4/agent-tree)
- [agent-tree README (raw)](https://raw.githubusercontent.com/MikeGT4/agent-tree/main/README.md)
- [agent-tree usage guide, docs/GUIDE.md (raw)](https://raw.githubusercontent.com/MikeGT4/agent-tree/main/docs/GUIDE.md)
- [agent-tree PRIVACY.md](https://github.com/MikeGT4/agent-tree/blob/main/PRIVACY.md)
- [Agent Tree: Live Terminal Monitor for Claude Code Agents — emergent.sh](https://emergent.sh/news/agent-tree-live-terminal-monitor-claude-code)
- [Agent Tree: Live Terminal Monitor for Claude Code Agents — byteiota](https://byteiota.com/agent-tree-live-terminal-monitor-for-claude-code-agents/)
- [SeanoChang/agent-tree — GitHub (unrelated same-named comparison)](https://github.com/SeanoChang/agent-tree)
- [niemes/cc-agent-tree — GitHub (unrelated same-named comparison)](https://github.com/niemes/cc-agent-tree)
