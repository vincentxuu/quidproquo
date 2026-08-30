---
title: "Python Coding Agent M11: Why an Exec Loop Cannot Reproduce the Claude Code Conversation Experience"
date: 2026-08-22
category: ai
tags: [coding-agent, python, tui, claude-code, codex, agent-sdk]
lang: en
tldr: "A Claude Code- or Codex-style TUI depends on long-lived sessions, typed transcripts, and approval at tool boundaries—not a screen full of color."
description: "How I replaced one-shot CLI subprocesses with long-lived Codex app-server and Claude Agent SDK sessions, then built persistent and auditable coding-agent conversations in Python."
draft: false
glossary:
  - term: "typed transcript"
    definition: "A transcript that represents text, tools, results, diffs, and approvals as explicit event types with correlation IDs instead of printing raw provider logs."
  - term: "tool boundary"
    definition: "The point where the model is about to read a file, modify one, or run a command; PCA applies policy and requests user approval at this boundary."
---

> 🌏 [中文版](/posts/ai/2026-08-22-coding-agent-native-conversation-tui)

## TL;DR

A Claude Code- or Codex-style TUI depends on long-lived sessions, typed transcripts, and approval at tool boundaries—not a screen full of color.

## Context

My Python coding agent could already run models, modify an isolated clone, verify patches, and authenticate through local Claude Code and Codex subscriptions. Yet the experience still felt wrong after I wrapped it in a full-screen TUI. Ask it `hi`, and it printed the system message twice before repeating the answer. The next prompt looked like a continuation, but underneath it launched another `codex exec` or `claude -p` process.

The deeper problem was that the UI made me choose `Ask` or `Agent` before each turn. That choice exposes a harness implementation detail instead of reflecting what the user wants. The user should be able to keep talking and decide whether to allow an action only when the model actually reaches an Edit, Write, or Bash operation.

## The Problem

A one-shot subprocess is easy to wrap, but it lacks the three things that matter most in a coding-agent TUI:

1. Multi-turn state within the same native session.
2. Live events that correlate tool use, results, and diffs.
3. Bidirectional control that can pause before a side effect and receive a permission decision.

Putting everything into a `RichLog` also collapsed the protocol into the UI. `system → message → result` appeared as three blocks of text. A tool being requested, started, and completed became three Activity rows. That is not how Claude Code structures a conversation.

## What I Tried

I read the local Claude Code source instead of copying screenshots. Its user prompt is a filled content row without a `You` label. Assistant output is a small dot followed by Markdown, without an `Assistant` label. The same `tool_use_id` groups execution, progress, results, and diffs. A permission request does not open a modal away from the conversation; it becomes the only active control immediately below the transcript.

CSS changes could not fix this. The data flow had to change first.

## The Solution

I introduced a shared `ConversationRuntimeSession`:

```python
class ConversationRuntimeSession(Protocol):
    async def start(self) -> None: ...
    async def send_turn(self, text: str) -> str: ...
    def events(self) -> AsyncIterator[ConversationRuntimeEvent]: ...
    async def respond_approval(self, request_id, decision) -> None: ...
    async def interrupt(self, turn_id: str) -> None: ...
    async def aclose(self) -> None: ...
```

The Codex adapter starts a `codex app-server` process and sends multiple turns through the same thread. The Claude adapter uses a long-lived `query()` session from the official Agent SDK. A Node sidecar converts control requests into PCA's own strict JSONL protocol. Provider-specific thread, session, and tool IDs remain inside the adapters instead of leaking into the conversation store.

Both adapters share one persistent disposable Git workspace. It clones only the committed `HEAD`, isolates Git metadata, removes the origin, disables hooks, and checks complete before-and-after invariants against the source repository. The model can read and edit inside the clone. At the end of every turn, PCA recomputes a bounded patch. If the Claude SDK does not include a complete diff, PCA calculates it independently instead of trusting an incomplete provider event.

The UI became a typed projection. Text deltas merge into one assistant block. A tool row updates in place by action ID. A diff sits under the edit that produced it. The permission dock remains at the bottom. `Details` contains diagnostic data only; it no longer copies every protocol frame into the main transcript.

## Why This Happens

“Chat” and “agent” are not two kinds of session. They are the same session using different capabilities on different turns. Policy belongs at the effect the model is about to trigger—Read, Modify, or Execute—not at the wording of the prompt.

That is also why an intent classifier is a poor safety-mode switch. “Take a look at this” might produce an answer or read a file. “Fix it” might end with a conclusion that no change is required. Permission at the tool boundary matches the actual operation and produces safety rules that are easier to test.

## What I Learned

When building a coding-agent TUI, design the session protocol and transcript reducer before drawing the interface. A one-shot exec can finish a task, but it cannot naturally grow into the Claude Code experience.

---

## References

- [Claude Agent SDK overview](https://platform.claude.com/docs/en/agent-sdk/overview)
- [Codex app-server](https://developers.openai.com/codex/app-server/)
- [Claude Code overview](https://docs.anthropic.com/en/docs/claude-code/overview)
