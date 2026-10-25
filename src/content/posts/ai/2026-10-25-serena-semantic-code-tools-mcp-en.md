---
title: "How Serena Lets a Coding Agent Edit Code Like an IDE: Semantic Tools, Two Backends, and Claude Code Setup"
date: 2026-10-25
category: ai
type: deep-dive
tags: [serena, mcp, coding-agent, lsp, claude-code, open-source]
lang: en
tldr: "Serena is an MCP server that uses language servers so a coding agent can find, rename, and rewrite code by symbol instead of by grep and line numbers. The free LSP backend covers 40-plus languages; move and inline refactors need the paid JetBrains plugin, and v2 moved the license to GPL."
description: "A guide to Serena's symbol-level tools, the differences between its LSP and JetBrains backends, Claude Code installation and hooks, and the license and agent-adoption problems to know first."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-25-serena-semantic-code-tools-mcp)

A coding agent's default way of reading code is grep plus reading whole files: search for a string, open the file, then edit by line number or text match. In a large project that burns context and makes wrong edits easy. [Serena](https://github.com/oraios/serena) takes the opposite approach and lets the agent work the way a person uses an IDE, by symbol: functions, classes, and methods. This guide covers the tools it provides, how its two backends differ, how to connect it to Claude Code, and the limits to know before adopting it.

## What it is

Serena describes itself as "The IDE for Your Coding Agent." It is an MCP server offering [symbol-level retrieval, editing, refactoring, and debugging tools](https://github.com/oraios/serena), and any client that supports [MCP](/posts/ai/2026-03-22-mcp-model-context-protocol) (in Chinese) can use it, including Claude Code, Codex, VS Code, Cursor, and the JetBrains IDEs.

Be clear about what it is **not**: Serena is not an agent and has no model. It only provides tools, and your existing LLM decides when to call them. That fact decides whether it works in practice, and the Limits section returns to it.

## Who it is for

It suits people who already use a coding agent on a project big enough that grep starts to fail: renaming across files, finding every caller of a function, moving code. You need to be able to configure an MCP server and install [uv](https://docs.astral.sh/uv/getting-started/installation/).

For small projects, single-file edits, or work that is mostly config files and shell, the gain is limited. The project's own evaluation says so too; see Limits.

## Content map

Two tables cover its capabilities. The first lists tool categories, with names taken from the [official tools page](https://oraios.github.io/serena/01-about/035_tools.html):

| Category | Representative tools | What they do |
|---|---|---|
| Symbol retrieval | `find_symbol`, `find_referencing_symbols`, `get_symbols_overview` | Find symbols, find who references them, outline a file's symbols without reading the whole file |
| Symbol editing | `replace_symbol_body`, `insert_before_symbol`, `insert_after_symbol`, `safe_delete_symbol` | Rewrite or insert at a symbol; check for remaining usages before deleting |
| Refactoring | `rename_symbol` (LSP); `jet_brains_move`, `jet_brains_inline_symbol` (JetBrains) | Rename across files; move and inline need JetBrains |
| Memory and orientation | `onboarding`, `write_memory`, `read_memory` | Learn the project structure, then store it as memory files for later sessions |
| Basic files and shell | `read_file`, `search_for_pattern`, `execute_shell_command` | Fallbacks; off by default inside harnesses like Claude Code because the harness already has them |

The second compares the two backends. Serena's semantic ability comes from one of two mutually exclusive choices described in the [README](https://github.com/oraios/serena):

| | Language server (default) | JetBrains plugin |
|---|---|---|
| Cost | Free | Paid, with a trial |
| Languages | 40-plus | Whatever the JetBrains IDEs support (not Rider or CLion) |
| Rename | Symbols | Symbols, files, directories |
| Move, inline, propagate deletions | Not available | Available |
| Type hierarchy, debugging | Not available | Available |

v2 also adds a [REPL interface](https://oraios.github.io/serena/01-about/035_tools.html), currently marked BETA. Instead of each operation being its own MCP tool, the REPL mode exposes one tool that runs Python, and the agent composes several operations and brings back only the result it needs. The official example finds a class and lists its members in one call:

```python
result = s.lsp.find_symbol("SerenaAgent", depth=1)
[member.name for member in result.symbols[0].iter_children()]
```

## A concrete example: connecting to Claude Code

Per the [README install steps](https://github.com/oraios/serena), Serena installs with uv, and the project says explicitly not to install it from an MCP or plugin marketplace because those install commands are outdated:

```bash
uv tool install -p 3.13 serena-agent
serena init
serena setup claude-code
```

`serena setup claude-code` is the shortcut given in the [official clients page](https://oraios.github.io/serena/02-usage/030_clients.html). For manual setup, use `--scope user` with `--project-from-cwd` globally, or `--project "$(pwd)"` for a single project:

```bash
claude mcp add --scope user serena -- serena start-mcp-server --context claude-code --project-from-cwd
```

Check the connection with `/mcp`; if Serena starts too slowly, raise `MCP_TIMEOUT` (the official example uses 60000). Then give it a task that actually needs semantic tools, for example: "rename `UserService.get` to `fetch` and update every call site." The agent should call `rename_symbol` to rename across files in one step instead of grepping and replacing file by file.

## Limits

**The agent may not use it.** The official [clients page](https://oraios.github.io/serena/02-usage/030_clients.html) states this problem directly: recent Claude Code changes (dynamic tool loading) often keep the agent from loading Serena's tools, or make it forget them in a long session, a behavior called agent drift. The page is blunter still: Claude Code's built-in tool descriptions take almost 16k tokens, cannot be adjusted, and create a strong bias toward internal tools, making it "almost impossible" to convince Opus 4.7 to use Serena. There are two countermeasures: set up the official `serena-hooks` (remind, activate, cleanup, auto-approve, all marked alpha), or override the system prompt with `claude --system-prompt="$(serena prompts print-cc-system-prompt-override)"`. Installing it is not the same as the agent using it, so check that the agent actually calls it.

**The `auto-approve` hook skips confirmation.** When Claude Code is in `acceptEdits` or `auto` mode, it approves all Serena calls automatically, including file-changing tools like `replace_symbol_body` and `rename_symbol`. Enable it only for projects and models you trust; for authorization design, see the [tool authorization post in the AI security series](/posts/ai/2026-10-22-ai-security-tool-authorization) (in Chinese).

**The free backend has fewer refactors.** Per the [README capability tables](https://github.com/oraios/serena), the language server backend renames symbols only, with no move, inline, or propagated deletion; those need the paid JetBrains plugin. Language coverage also depends on each language server's quality, and some languages need extra dependencies.

**The evidence for effectiveness is agent self-report.** The README and the [evaluation page](https://oraios.github.io/serena/04-evaluation/000_evaluation-intro.html) cite one-sentence verdicts from agents after about 20 routine tasks. The docs say plainly that the agent evaluating itself is deliberate, and that results where Serena adds nothing or is out of scope are recorded too. The same page concludes that its strength is collapsing cross-file, semantics-dependent operations into single calls, while built-in tools remain better for small local text edits, text search, config files, and shell work. This is the project's own evaluation, not an independent benchmark; for a third-party comparison, see the [CodeGraph post's comparison with Serena](/posts/ai/2026-05-23-codegraph-code-knowledge-graph-mcp) (in Chinese).

**The license changed in v2.** The [LICENSE overview](https://github.com/oraios/serena/blob/main/LICENSE) states that SolidLSP, the language-server client library, stays MIT, while the Serena application moved to GPL-3.0-or-later starting with v2; the last MIT release is v1.7.0. Using it as a tool is fine; before embedding Serena's code in a product you distribute, read the full LICENSE.

## How to use it

1. **Confirm the bottleneck really is grep.** Pick a real task such as a cross-file rename or "who calls this function," run it once without Serena, and note the step count and token use as a baseline.
2. **Install on one project only.** Use `--project "$(pwd)"` for a single project rather than enabling it globally at first.
3. **Confirm with `/mcp`, then assign a semantic task.** Watch whether the agent actually calls `find_referencing_symbols` or `rename_symbol`. If not, set up hooks first; if hooks still do not help, consider the system prompt override.
4. **For large projects, consider the JetBrains backend.** Pay only when you need move and inline; run the free backend for two weeks to see if it is enough.
5. **Compare on the same task.** After installing, rerun the task from step 1 and compare steps and tokens; if there is no clear improvement, turn it off.

For how Serena's LSP route trades off against a pre-built index, read the [CodeGraph overview](/posts/ai/2026-05-23-codegraph-code-knowledge-graph-mcp) (in Chinese); for how coding agents handle LSP diagnostics internally, see the [LSP integration post](/posts/ai/2026-08-30-coding-agent-lsp-integration) (in Chinese).

## References

- [oraios/serena (README)](https://github.com/oraios/serena)
- [LICENSE: Serena Licensing Overview](https://github.com/oraios/serena/blob/main/LICENSE)
- [Tools and APIs (official docs)](https://oraios.github.io/serena/01-about/035_tools.html)
- [Connecting Your MCP Client (official docs)](https://oraios.github.io/serena/02-usage/030_clients.html)
- [Evaluation (official docs)](https://oraios.github.io/serena/04-evaluation/000_evaluation-intro.html)
- [uv installation](https://docs.astral.sh/uv/getting-started/installation/)
- [MCP overview](/posts/ai/2026-03-22-mcp-model-context-protocol) (in Chinese)
- [CodeGraph: code knowledge graph MCP](/posts/ai/2026-05-23-codegraph-code-knowledge-graph-mcp) (in Chinese)
- [Learning design from mature coding agents (36): LSP integration](/posts/ai/2026-08-30-coding-agent-lsp-integration) (in Chinese)
- [AI security: tool authorization](/posts/ai/2026-10-22-ai-security-tool-authorization) (in Chinese)
