---
title: "pi-mono Deep Dive 1: pi from a CLI User's Perspective — Install, Modes, Session, Model Switch & Message Interjection"
date: 2026-08-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, session-management, ollama]
lang: en
series:
  name: "pi-mono Deep Dive"
  order: 1
tldr: "Treat pi as a black box first: 4 run modes, session tree persistence, mid-conversation model switching, Enter vs Alt+Enter message interjection, /tree branch navigation. Builds intuition for the architecture parts that follow."
description: "Complete walkthrough of pi CLI from user perspective: installation, Interactive/Print/JSON/RPC/SDK modes, session persistence with branching, hot model switching, message interjection mechanics, tree navigation, HTML export and gist sharing."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-31-pi-mono-deep-dive-cli-user-perspective)

## TL;DR

- **Install**: `npm i -g @earendil-works/pi-coding-agent` or `ollama launch pi`
- **5 Modes**: Interactive (default), Print, JSON, RPC, SDK — same core, different interfaces
- **Session**: JSONL in `~/.pi/agent/sessions/`, tree structure supports branching, replay, fork
- **Model Switch**: `/model`, `Ctrl+L` menu, `Ctrl+P` cycle favorites, works mid-session
- **Message Interjection**: `Enter` = steering (inject after current tool), `Alt+Enter` = follow-up (inject after agent stops)
- **Navigation**: `/tree` visual branch view, jump to any node; `/export` HTML, `/share` gist

---

## Installation & First Launch

```bash
# npm global install (recommended)
npm install -g @earendil-works/pi-coding-agent

# Or one-shot with Ollama (auto-pulls model)
ollama launch pi

# Verify version
pi --version
# @earendil-works/pi-coding-agent@0.x.x
```

> **Package & repo renamed**: npm scope `@mariozechner` → `@earendil-works`, GitHub `badlogic/pi-mono` → `earendil-works/pi`. Existing installs run `pi update --self` to auto-migrate.

First launch enters **Interactive mode** (TUI):

```
$ pi
╭────────────────────────────────────────────────────────────╮
│  pi 0.x.x  •  Session: a1b2c3d4  •  Model: anthropic/claude-3-5-sonnet-20241022 │
├────────────────────────────────────────────────────────────┤
│  > your prompt...                                             │
╰────────────────────────────────────────────────────────────╯
```

---

## Five Run Modes: One Core, Five Interfaces

| Mode | Trigger | Use Case | Output |
|---|---|---|---|
| **Interactive** | `pi` (no args) | Daily dev, long conversations | TUI, live rendering, keybindings |
| **Print** | `pi -p "prompt"` | Single-turn Q&A, script embedding | Plain text, direct to stdout |
| **JSON** | `pi --json -p "prompt"` | Programmatic integration, CI/CD | JSON object with metadata, tool calls |
| **RPC** | `pi --rpc` | Long-lived, IDE integration, daemon | JSON-RPC 2.0 over stdin/stdout |
| **SDK** | `import { createAgentSession } from '@earendil-works/pi-coding-agent'` | Embed in own app | Full programmatic control |

### Print Mode Examples

```bash
# Single-turn, pipeline-friendly
pi -p "Explain async/await in traditional Chinese" --model ollama:qwen3:1.7b

# Specify output format
pi --json -p "List 3 TypeScript utility types" | jq '.result'
```

### JSON Mode Output Structure

```json
{
  "sessionId": "a1b2c3d4",
  "model": "anthropic/claude-3-5-sonnet-20241022",
  "result": "Async/await is...",
  "toolCalls": [],
  "usage": { "inputTokens": 42, "outputTokens": 156 },
  "stopReason": "end_turn"
}
```

### RPC Mode: For IDEs/Plugins

```bash
# Start RPC server (stdin/stdout)
pi --rpc

# Client sends JSON-RPC 2.0 request
{"jsonrpc":"2.0","id":1,"method":"prompt","params":{"text":"hello"}}
# Streaming event responses
{"jsonrpc":"2.0","method":"event","params":{"type":"message_start",...}}
```

> **Architecture Preview**: All 5 modes share the same `AgentSession` core (`packages/coding-agent/src/core/sdk.ts`), differing only in how `runPrintMode`, `runRpcMode`, `InteractiveMode` wrap the event stream.

---

## Session: Not Just History — An Editable Tree

### Where It Lives

```
~/.pi/agent/sessions/
└── --your-project-path--/
    ├── 2026-08-31T10-30-00_a1b2c3d4.jsonl   # latest session
    └── 2026-08-30T14-22-11_e5f6g7h8.jsonl   # yesterday's session
```

- **Format**: JSONL (one entry per line), append-only
- **Naming**: `ISO8601_timestamp_sessionId.jsonl`
- **Encoding**: Directory name wraps `cwd` with `--`, path separators become `-`

### Entry Types at a Glance

| Entry Type | Purpose | Enters LLM Context? |
|---|---|---|
| `message` | user/assistant/toolResult | ✅ |
| `thinking_level_change` | Thinking level toggle | ✅ (via context settings) |
| `model_change` | Model switch record | ✅ (via context settings) |
| `compaction` | Summary compression point | ✅ (represents summarized history) |
| `branch_summary` | Branch summary | ✅ |
| `custom_message` | Extension-injected message | ✅ |
| `custom` | Extension internal state | ❌ |
| `label` | User bookmarks | ❌ |
| `session_info` | Display name | ❌ |

### Tree Structure: Branch, Reset, Fork

```bash
# In TUI
/tree          # Visual branch tree, ↑↓ to pick node, Enter to resume from there
/branch        # New branch from current position (history unchanged)
/reset         # Back to root (rewrite first user message)
/fork          # Copy entire session to new file (cross-project capable)
```

**Key Concept**: Session is an **append-only tree**. Every append creates a child of current leaf. `/branch` just moves leaf pointer to an old node; next message becomes a new branch. History is **never deleted or mutated**.

---

## Model Switching: Hot-Swap Mid-Session

pi supports 15+ providers: **Anthropic, OpenAI, Google, Azure, Bedrock, Mistral, Groq, Cerebras, xAI, Hugging Face, Kimi, MiniMax, NVIDIA, OpenRouter, Ollama**.

### Three Ways to Switch

```bash
# 1. Command menu (searchable, grouped)
/model

# 2. Hotkey menu (Ctrl+L)
# 3. Cycle favorites (Ctrl+P)
```

### Live Demo: Switch Mid-Conversation

```
> Write a quicksort in Python
# ... Claude 3.5 Sonnet replies ...

> /model switch to ollama:qwen3:1.7b
Model switched to ollama:qwen3:1.7b

> Now rewrite that in Rust
# ... Qwen3 1.7B continues with full context ...
```

**Under the Hood**: Switch writes a `model_change` entry; `buildSessionContext()` picks up latest model for next LLM call. System prompt, tools, history **fully preserved**.

---

## Message Interjection: Steering vs Follow-up

pi's most distinctive interaction — **you can send messages while the agent is working**:

| Key | Name | Timing | Use Case |
|---|---|---|---|
| `Enter` | **Steering** | After current tool finishes, before next LLM call | "Don't run that cmd", "Use grep instead", "Add condition" |
| `Alt+Enter` | **Follow-up** | After agent decides to stop (turn ends) | "Test after done", "Continue to next step" |

### Visual Timeline

```
Agent state:  [Thinking] → [Tool: bash] → [Thinking] → [Tool: edit] → [Thinking] → [Done]
                    ↑                          ↑
                Steering inject            Steering inject
                (before next turn)         (before next turn)
                                                             ↑
                                                     Follow-up inject
                                                     (after agent stops)
```

**Architecture Preview**: Maps to `AgentLoopConfig.getSteeringMessages()` (steering) and `getFollowUpMessages()` (follow-up), handled in the double-while loop in `agent-loop.ts`.

---

## Essential Commands Cheatsheet

| Command | Function | Key Params |
|---|---|---|
| `/model` | Switch model | Keyword filter |
| `/tree` | Show branch tree | Enter to resume, Space expand/collapse |
| `/branch` | Branch from current node | Optional summary of abandoned path |
| `/compact` | Manual compaction trigger | Compress old conversation |
| `/export` | Export HTML | `--file path.html` |
| `/share` | Upload gist | Requires GitHub token |
| `/session` | List/switch sessions | `new`, `resume <id>`, `list` |
| `/settings` | Settings panel | Theme, Keybindings, Tools, Trust |
| `/help` | All commands & keybindings | Categorized display |

### Key Keybindings

| Shortcut | Action |
|---|---|
| `Ctrl+L` | Model menu |
| `Ctrl+P` | Cycle favorite models |
| `Ctrl+O` | Open file (fuzzy) |
| `Ctrl+R` | Command history search |
| `Alt+Enter` | Follow-up message |
| `Escape` | Interrupt generation/tool |
| `Tab` | Autocomplete (commands, files, models) |

---

## Local Models: Ollama Integration in Practice

pi is uniquely small-model friendly — **tiny system prompt + 4 tools = low token burn**.

```bash
# Pull models
ollama pull qwen3:1.7b
ollama pull gemma2:2b

# Run with local model
pi -p "Say hello world in traditional Chinese" --model ollama:qwen3:1.7b

# Or pick Ollama group in /model inside Interactive mode
```

| Scenario | Suggested Tier | Tested Working Models |
|---|---|---|
| Light use (read files, small fixes) | 1.7B~2B | Qwen3:1.7B, Gemma2:2B |
| General dev (refactor, write tests) | 7B~8B | Qwen2.5:7B, Llama3.1:8B |
| Complex tasks (architecture, multi-file) | Flagship | Claude 3.5 Sonnet, GPT-4o, Opus |

> **Why do small models work?** Pi's system prompt ~300 tokens (Claude Code: thousands), only 4 tools, near-perfect prompt cache hit rate. Something "full-featured harnesses" can't achieve.

---

## Hands-On: Build Your First Session Tree

```bash
# 1. Enter a Git repo project dir
cd your-project

# 2. Launch pi
pi

# 3. Send a few prompts to establish mainline
> Help me add a README.md
> Now extract main function into separate module

# 4. View tree with /tree
/tree
# Select first user message → Enter to resume

# 5. Send new message at branch point (auto-creates branch)
> Actually write tests first then refactor

# 6. /tree again to see branches
# Two paths now, jump freely between them

# 7. Export HTML for review
/export --file session-review.html

# 8. Share with colleague
/share
# Outputs gist URL
```

---

## References

- [Pi Official Website pi.dev — CLI Docs & Command Reference](https://pi.dev/docs/latest)
- [GitHub - earendil-works/pi — Source: packages/coding-agent/src/cli.ts](https://github.com/earendil-works/pi/tree/main/packages/coding-agent/src)
- [Pi Author Blog: Building a Minimal Coding Agent — Interactive Mode Design](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/)
- [Ollama Official Model Library — Small Models Suitable for pi](https://ollama.com/search)
- [Previous Pi Intro: 4 Modes, Extension System, TUI Engine](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness-en)

---

## Next Up

> **Part 2: Monorepo Architecture & Core Abstractions**
>
> How do 7 packages divide responsibilities? Why one-way dependency flow? What does `pi-ai`, `pi-agent-core`, `pi-coding-agent`, `pi-tui`, `pi-telemetry`, `pi-client/server/protocol` each own? From "what users see" into "invisible architectural decisions".