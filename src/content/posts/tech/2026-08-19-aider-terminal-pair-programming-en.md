---
title: "Aider: The Oldest Terminal AI Pair Programmer, and Where Its Maintenance Stands"
date: 2026-08-19
type: project
category: tech
tags: [aider, coding-agent, ai-tools, cli, open-source, git]
lang: en
series:
  name: "Choosing an Agent CLI"
  order: 13
tldr: "Aider is a terminal AI pair programmer dating back to 2023 (Python, Apache-2.0, ~48.3k stars), designed against the grain of today's autonomous agents: you control context by hand with /add, every edit becomes its own atomic git commit, and architect/editor mode splits planning from editing across two models. But note the maintenance cadence: the latest PyPI release is 0.86.2 from 2026-02, the last commit was 2026-05, and the site still recommends Claude 3.7 Sonnet and o1."
description: "Aider's design philosophy, repo map, architect/editor mode, watch mode, and atomic commits — plus its actual maintenance activity measured in August 2026 and what that means for tool selection."
draft: false
---

🌏 [中文版](/posts/tech/2026-08-19-aider-terminal-pair-programming)

In this series, Aider is the one tool that doesn't want to be an agent.

Everything else competes on running autonomously for longer, dividing work across smarter subagents, or continuing after you close your laptop. Aider goes the other way: **you decide which files enter the context, it makes the edits, and every change becomes its own git commit.** It's a pair programmer, not a delegate.

This post covers its design trade-offs — and one thing you need to know before choosing it: its maintenance cadence slowed noticeably in 2026.

## Design philosophy: explicit context control

Most agent CLIs sell you on "it finds the files itself." Aider's default is the opposite — you use `/add` to put files into the chat, `/drop` to remove them, and `/read-only` to include immutable references.

In 2023 this was a necessity: context windows were small and agentic search was unreliable. By 2026 it reads instead as a **deliberate position**: you know exactly what the model saw, and exactly how many tokens you're paying for. The flip side is that in an unfamiliar codebase you have to know which files to add — which is precisely the work autonomous agents exist to remove.

To keep the model oriented while seeing only a few files, Aider builds a **repo map**: it uses tree-sitter to extract the structure and symbol definitions of the whole repo and compresses that into a map it puts in context. You don't add the whole project to the chat, and the model still knows where `UserService` is defined.

## Git as a first-class citizen

This is Aider's most recognizable feature: **every AI edit produces its own commit**, with a message written by the model.

```bash
/undo          # git revert the AI's last change
/diff          # show the working-tree diff
```

The value isn't saving keystrokes on `git commit` — it's the **granularity of recovery**. When an agent has changed seven files and step three went wrong, `git log` shows you what it did and `/undo` takes you back. Letting an agent run free for half an hour and reviewing one large diff at the end is a fundamentally different risk model.

The cost is equally direct: your history gets noisy. If you like shipping one clean commit per feature, you'll be squashing before you push.

## Architect / editor: two models, two jobs

Aider's `architect` mode splits one edit into two requests:

1. The **architect model** (your main model) thinks — it proposes how to solve the problem
2. The **editor model** does — it translates that proposal into concrete file edits

```bash
aider --architect --model <strong reasoner> --editor-model <cheap and fast>
aider --architect --auto-accept-architect   # skip the per-step prompt
```

The reason is stated plainly in the docs: certain LLMs "aren't able to propose coding solutions and specify detailed file edits all in one go." Strong reasoning models frequently mangle structured diff output, while cheaper models emit precise diffs but plan poorly. Two requests, each playing to a strength.

That observation has aged better than Aider itself — the Auto modes, Power settings, and mode tiers in every other tool in this series are solving the same problem. The difference is that Aider makes you name both models, and the others decide for you.

The cost is **two LLM requests**: slower, and in some pairings more expensive.

## Watch mode: driven by comments

Aider can run in the background watching for file changes. You write a comment in your own editor, save, and it goes to work:

```python
# make this function async AI!
def fetch_user(uid):
    ...
```

`AI!` means "do this"; `AI?` means "answer this." On save, Aider spots the marker, reads the surrounding context, makes the change, commits, and clears the marker.

What this solves is very practical: **you never leave your editor**. It doesn't ask you to move into a TUI or an IDE — it just watches the filesystem. That's a large part of why people still run it: it's nearly zero-footprint in your environment, identical whether you use VS Code, JetBrains, Vim over SSH, or a tmux split.

## Model freedom

Aider connects to 100+ LLMs, cloud and local, and `/model` switches mid-session. It also maintains a **polyglot leaderboard**: 225 Exercism exercises across C++, Go, Java, JavaScript, Python, and Rust, measuring whether a model can follow instructions and edit code successfully without human intervention.

That leaderboard is useful beyond Aider, because it measures **edit-format correctness** — whether the model emits a well-formed diff — which is a different question from the problem-solving ability most coding benchmarks measure, and arguably more decisive for whether an agent is pleasant to use.

## Maintenance: the part a selection guide has to say

A selection guide can't stop at design philosophy. These figures come from official sources on 2026-08-19:

| Item | Status |
|---|---|
| GitHub stars | ~48.3k |
| License | Apache-2.0 |
| Latest PyPI release | **0.86.2, published 2026-02-12** |
| Previous release | 0.86.1, published 2025-08-13 |
| Last commit | **2026-05-22** |
| Open issues | ~1,817 |

For contrast on cadence: in one week of August 2025, 0.85.3, 0.85.4, and 0.85.5 shipped within three days of each other. In the twelve months since, there has been one release. The homepage still reads "Aider works best with Claude 3.7 Sonnet, DeepSeek R1, OpenAI o1, o3-mini & GPT-4o" — that model list is itself a timestamp.

**None of this means it's broken.** The repo isn't archived, commits still landed through the first half of 2026 (expanding the Anthropic model list, adding bash tree-sitter support), and the core works fine when you install it. But if your criteria include "keeps pace with new models" or "someone answers issues," these numbers belong in the decision.

## Who it fits

**Good fit:**

- People who want **explicit context control** — you know which files matter and don't want an agent rummaging
- People who value **git history granularity** and fine-grained undo
- People who won't leave their editor — watch mode just sits alongside it
- People running **local models**, or pairing architect/editor themselves to control cost

**Poor fit:**

- Anyone wanting "give it one sentence and walk away" autonomy — that was never the goal
- Anyone needing MCP, subagent ecosystems, or cloud handoff
- Anyone who needs the tool to track model generations — see the section above

## Overall

Aider's real value is a set of design claims that are **still correct**: explicit context control, git as the undo mechanism, and separate models for planning versus editing. All three survive in today's tools under different names.

But "the design was right" and "you should use it now" are different questions. If you want that philosophy in a more current implementation, [Pi](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness-en) offers similar restraint; if you want autonomy and ecosystem, look at [Claude Code](/posts/tech/2026-03-31-claude-code-overview-anthropic-coding-agent-en) or [OpenCode](/posts/tech/2026-03-31-opencode-ai-terminal-coding-agent-en). Aider's best position today is the case where **you already know it and it's already enough**.

## References

- [Aider official site](https://aider.chat/)
- [Aider GitHub: Aider-AI/aider](https://github.com/Aider-AI/aider)
- [Aider docs: chat modes (code / ask / architect / help)](https://aider.chat/docs/usage/modes.html)
- [Aider docs: LLM leaderboards and the polyglot benchmark](https://aider.chat/docs/leaderboards/)
- [Aider documentation index](https://aider.chat/docs/)
- [PyPI: aider-chat release history](https://pypi.org/project/aider-chat/)
