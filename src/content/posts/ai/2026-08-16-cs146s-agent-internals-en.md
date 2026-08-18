---
title: "CS146S Week 1: A Coding Agent Is, Underneath, a While Loop"
date: 2026-08-16
category: ai
tags:
  - cs146s
  - ai-agent
  - agentic-coding
  - tool-use
  - claude-code
  - llm
lang: en
type: deep-dive
series:
  name: "CS146S: Ten Weeks of AI-Native Development"
  order: 2
tldr: "Week 1 of CS146S is 'build Claude Code in 200 lines' plus a dissection of production system prompts. The agent loop really is that small. The course slides close with four things Claude does underneath, one of them being `<system-reminder>` tags scattered everywhere to stop the model drifting — which appears in no official documentation."
description: "Stanford CS146S Fall 2026 Week 1, 'The Internals of Coding Agents': the minimal agent loop, the read/write/edit/bash tool set, how production coding agents structure system prompts, and what separates a hand-rolled agent from a usable one."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-16-cs146s-agent-internals)

This is the second post in the [CS146S series](/posts/ai/2026-08-16-cs146s-course-map-en), covering Week 1 of Fall 2026.

The two listed sessions are "Course intro + build Claude Code in 200 lines" and "How state-of-the-art coding agents are designed: deep dive into the system prompts that define the agent." Three topics: what an LLM actually is, what the agent loop looks like under the hood, and how the core tool set (read, write, edit, bash) carries a task to completion.

Note that this is not how the course opened a year ago. Fall 2025's Week 1 was "Introduction to Coding LLMs and AI Development," with sessions on "how an LLM is made" and "Power prompting for LLMs." In one year the opening moved from how the model gets built to how the agent gets assembled.

## How small the loop is

In [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), Anthropic cites Simon Willison's definition and says they "have gravitated towards a simple definition for agents: **LLMs autonomously using tools in a loop**."

That sentence translates almost directly into code:

```
messages = [user_request]

while True:
    response = model(messages, tools=TOOLS)
    messages.append(response)

    if not response.tool_calls:
        break                      # the model is done reaching for tools

    for call in response.tool_calls:
        result = TOOLS[call.name](**call.args)
        messages.append(tool_result(call.id, result))
```

No planner, no state machine, no orchestrator. The model decides whether to call a tool, the runtime pastes the result back into the conversation, and you ask again.

The course says 200 lines. The public implementation to compare against is Thorsten Ball's [How to Build an Agent](https://ampcode.com/how-to-build-an-agent), whose subtitle is explicit: "Building a fully functional, code-editing agent in less than 400 lines." That is Go, including terminal interaction, JSON schema generation, and three tools (`read_file`, `list_files`, `edit_file`). Getting under 200 lines in Python is plausible, because the SDK absorbs most of the boilerplate.

**The point is not the line count — it's that there is no magic here.** Most people intuit that a coding agent contains some planning machinery. Planning happens in the model's context; the code layer only wires tools up and feeds results back.

## Why four tools are enough

The course lists read, write, edit, and bash. It looks thin, but it maps exactly onto everything an engineer does at a terminal: look at files, change files, run things.

`bash` is the critical one, because it is the **escape hatch**: how tests run, how dependencies install, how you grep — none of it needs a dedicated tool. Describing Claude Code, Anthropic notes the model can "write targeted queries, store results, and leverage Bash commands like head and tail to analyze large volumes of data without ever loading the full data objects into context." The data processing happens in the execution environment, not in the context window.

The cost sits in the same sentence: a tool that runs arbitrary shell commands hands over the whole machine. That is why any usable agent needs a sandbox and a permission layer, and why [Week 7 spends a full week on security](/posts/ai/2026-08-16-cs146s-agent-security-en).

Tool definitions are a design problem in their own right. After [Writing tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents), Anthropic's context engineering post offers a test worth keeping:

> One of the most common failure modes we see is bloated tool sets that cover too much functionality or lead to ambiguous decision points about which tool to use. If a human engineer can't definitively say which tool should be used in a given situation, an AI agent can't be expected to do better.

Worth taping to your monitor the next time you write an MCP server.

## The system prompt is the real spec

The second session is a "deep dive into the system prompts that define the agent." *Define* is the accurate verb: same model, same tools, different system prompt, different agent.

A production coding agent's system prompt is usually handling:

- **Identity and scope**: what this tool is, what it may do, what it explicitly won't
- **Tool rules**: when to reach for which tool, parallel-call rules, when to ask a human first
- **Output format**: a terminal is plain text, so response length and shape need constraining
- **Environment facts**: OS, working directory, whether this is a git repo, today's date
- **Project-level context**: the contents of files like `CLAUDE.md` / `AGENTS.md`

Anthropic's guidance on system prompts is to find the "right altitude," with two failure modes at either end: "hardcoding complex, brittle logic in their prompts to elicit exact agentic behavior" at one extreme, and "vague, high-level guidance that fails to give the LLM concrete signals" at the other. The target is the altitude in between.

To see what one actually looks like, Fall 2025's Week 4 assigned a third-party reverse-engineering write-up, [Peeking Under the Hood of Claude Code](https://medium.com/@outsightai/peeking-under-the-hood-of-claude-code-70f5a94a9a62). It is not official documentation and should be read as field notes rather than a spec — but as a reference for how long a production agent prompt is and what it governs, it beats any secondhand description.

## The "Secret Sauce" slide

The matching Fall 2025 session was Week 2, "Building a coding agent from scratch," and [its slides are public](https://docs.google.com/presentation/d/11CP26VhsjnZOmi9YFgLlonzdib9BLyAlgc4cEvC5Fps/edit). Seven slides long, but the last one is titled "The 'Secret' Sauce" and lists four things Claude actually does underneath — none of which appear in any official documentation:

> - Front-load context with tiny targeted prompts
> - **System reminders everywhere including system/user prompts, tool calls, tool results to prevent drift (`<system-reminder>` tags)**
> - Command prefix extraction
> - Spawns sub agents (likely to help with preventing context overloading)

The second one deserves a pause. **System reminders are short nudges injected into the system prompt, the user prompt, tool calls, and tool results, wrapped in `<system-reminder>` tags, to stop the model drifting over a long conversation.** That is the flip side of "the agent loop is just a while loop": the loop itself has no memory, so behavioral consistency comes from re-reminding on every turn.

The deck's description of the architecture is also sharper than my code sketch above:

> User interacts with coding agent client (windsurf, cursor, claude code) and runs a loop with an underlying llm. Sometimes the llm issues tool calls which the client executes (**off-LLM**)

`off-LLM` is the key term — **tools execute outside the model**. The model only emits a structured "call this tool with these arguments"; the thing that actually runs `rm -rf` is the client. That is also why permissions and sandboxing are the client's responsibility, never the model's.

The course's terminology is equally plain: the system prompt defines overall behavior and directives, the user prompt is the request, the assistant prompt is the model's response.

## What separates a hand-rolled agent from a usable one

A 200-line agent runs. You would not do work with it. The gap looks roughly like this:

| What's missing | What happens without it |
|---|---|
| Permissions and sandboxing | One `rm -rf` ends the session |
| Context compaction | After dozens of tool calls you hit the limit and lose everything |
| Error recovery | A tool throws and the whole thing stalls instead of routing around it |
| Task tracking | Halfway through a long task it forgets what's left |
| Atomic file edits | A string replacement matches twice and silently breaks something |
| Cost control | Every turn resends the full history |

Two of those — compaction and task tracking — are exactly what [Week 2's context engineering](/posts/ai/2026-08-16-cs146s-context-engineering-en) covers, under the names compaction and structured note-taking.

Put differently: Week 1 teaches the skeleton, and the remaining nine weeks teach the ring around the skeleton. That structure is itself the course's argument — **the model and the loop are no longer the bottleneck.**

## A minimal hands-on route

Fall 2026's assignments aren't published, but the Fall 2025 [assignment repo](https://github.com/mihail911/modern-software-dev-assignments) is public, and `week2` is "Building a coding agent from scratch." The course slides give only three steps — read the terminal and keep appending to the conversation, tell the LLM which tools exist (their list is `Read_file`, `List_dir`, `Edit_file`), then create and edit files. Expanded into something you can follow:

1. Wire up tool use with the official SDK, with only `read_file`
2. Add `list_files` and watch whether the model explores before reading
3. Add `edit_file` (string replacement is fine) and have it fix a real bug
4. Add `bash`, run the tests, and observe how it responds to failure
5. Grow your system prompt from three lines to thirty and measure the behavior difference

Step 5 is the most valuable one, and the one most people skip.

## What will go stale

- Fall 2026 assignments and slides aren't published; the route above is inferred from the Fall 2025 repo
- "200 lines" is the Fall 2026 session title's claim and the code isn't public yet; the slides quoted here are from the equivalent Fall 2025 session
- The Claude Code system prompt analysis is third-party reverse engineering and drifts between versions

## References

- [CS146S Fall 2026 syllabus](https://themodernsoftware.dev/) — Week 1 topics and sessions
- [How to Build an Agent](https://ampcode.com/how-to-build-an-agent) — Thorsten Ball, a code-editing agent in under 400 lines of Go
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Anthropic Engineering, 2025-09-29
- [Writing tools for AI agents – with AI agents](https://www.anthropic.com/engineering/writing-tools-for-agents) — Anthropic Engineering, tool definition design
- [Peeking Under the Hood of Claude Code](https://medium.com/@outsightai/peeking-under-the-hood-of-claude-code-70f5a94a9a62) — third-party analysis, assigned in Fall 2025 Week 4
- [Building a coding agent from scratch](https://docs.google.com/presentation/d/11CP26VhsjnZOmi9YFgLlonzdib9BLyAlgc4cEvC5Fps/edit) — Fall 2025 Week 2 lecture slides, including the four "Secret Sauce" points
- [modern-software-dev-assignments](https://github.com/mihail911/modern-software-dev-assignments) — Fall 2025 assignments; `week2` builds an agent from scratch
