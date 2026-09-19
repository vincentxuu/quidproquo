---
title: "One Missing 'Write a Script': How Skill Instructions Determine LLM Success or Failure"
date: 2026-09-19
category: ai
type: debug
tags: [agent-skills, llm, bedrock, claude, debugging, context-engineering, stream-stall]
lang: en
tldr: "An AI assistant platform running Opus 4.6 hit stream_stall (90s timeout) twice consecutively when generating docx. Root cause: skill instructions lacked one sentence — 'Write a script' — causing the model to output JS code inline instead of writing a file and executing with node. Claude.ai's official SKILL.md has that sentence, and the model consistently takes the safe path."
description: "A complete debugging walkthrough of how a subtle difference in LLM skill instructions caused consecutive production failures — from DB forensics to comparing claude.ai's API behavior."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-19-docx-skill-instructions-stream-stall)

## TL;DR

the AI assistant platform with Opus 4.6 hit Bedrock's `stream_stall` (90-second timeout) twice consecutively when generating a Word document. The investigation started from `retry_attempts` in the DB, traced 600K cumulative input tokens, and decomposed the agent loop steps to find: successful conversations used the bash tool to execute JS scripts, while failed ones wrote JS code inline in the text output. The root cause was the seed reconciler overwriting the docx skill instructions with a condensed version missing the key directive to write files and execute them. Claude.ai uses the official SKILL.md that explicitly says "Write a `docx` (npm) script," and the model consistently takes the safe path.

## Context

Early morning on 2026-09-19, a user on the dev environment's the AI assistant platform (Claude 4.6 Opus via [Amazon Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html)) sent a simple prompt — asking for an ELI5-style explanation document covering five AI topics. Twice in a row, 4 minutes apart, same prompt, same chatbot, same LLM: "Sorry, the system is temporarily unable to process your request."

## The Error

Querying the outgoing message metadata from the dev DB:

```json
{
  "retry_attempts": [
    {"finish_reason": "stream_stall", "timeout_seconds": 90}
  ],
  "llm_input_token_usage": 159,
  "cache_read_input_tokens": 393946,
  "cache_creation_input_tokens": 200777
}
```

`stream_stall` — the [Bedrock ConverseStream](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_ConverseStream.html) produced no new chunk for 90 seconds, triggering the system's stall guard. Both conversations showed nearly identical metadata.

## Investigation

### Layer 1: How does a 159-token prompt become 600K input?

The user's prompt was only 159 non-cache tokens, but `cache_read + cache_creation` totaled ~600K. the AI assistant platform's configuration: 22 tools, 13 skills, 4,628-character system prompt — roughly 60K tokens of static context.

The 600K came from **agent loop accumulation**. the AI assistant platform runs canvas agent mode, resending full context after each tool call. Bedrock prompt caching helped (static parts sent once), but each step's new tool results added incremental tokens, plus the non-streaming retry after the stall counted again — 4 loop steps + 1 retry accumulated to 600K.

### Layer 2: Why did it stall?

The system's `_StallGuardedEventStream` monitors ConverseStream chunk intervals with a reader thread. Beyond 90 seconds, it declares a stall. Reconstructing the agent steps from `content_payload`:

| Step | LLM Decision | Tool Calls |
|---|---|---|
| 1 | Search 5 topics | `Global_Tavily_Search_Tool` ×5 |
| 2 | Load docx skill | `skill_expand_tool` (docx) |
| 3 | Read SKILL.md | `read_workspace_file` |
| 4 | Start generating docx... | **← stall** |

At step 4, the model attempted to **write complete JavaScript code directly in the text response** (docx-js API calls). Under Opus 4.6's inference latency with a large context, chunk intervals exceeded 90 seconds.

### Layer 3: What did successful conversations look like?

Querying all Opus 4.6 + docx skill conversations over the past 60 days — 6 successes, 3 failures (including prod stalls). Successful tool call sequences were completely different:

```
skill_expand_tool → read SKILL.md → read docx-js.md
→ bash (write JS file) → bash (node run) → bash (validate)
→ present_files ✅
```

**Every success used the `bash` tool to write a JS file and execute with `node`.** Every failure wrote code inline in text output. The difference wasn't the model version or Bedrock load — it was which execution path the model chose.

### Layer 4: Why was the model's path choice unstable?

Checking the docx skill's update history revealed it was **overwritten by the seed reconciler the day before the failures** (09-18). The condensed version (3,266 chars) listed tools but didn't explicitly say "write to a file and execute with node."

Traced to the [seed reconciler phase 2 PR](https://github.com/Playma-Co-Ltd/maiagent-django/pull/7116) — the engineer snapshotted skill content from the prod DB into code, but prod's docx skill was already the condensed version. The reconciler merely codified the status quo.

## Comparison: How does claude.ai do it?

Using Playwright to operate claude.ai with the same prompt, the network requests revealed the key API call:

```
GET /api/organizations/.../conversations/.../wiggle/download-file
    ?path=/mnt/skills/public/docx/SKILL.md
```

Claude.ai reads skill content from `/mnt/skills/public/docx/SKILL.md` in the sandbox. A diff confirmed it's nearly identical to the [official Anthropic GitHub version](https://github.com/anthropics/skills/tree/main/skills/docx) (91 lines).

The official SKILL.md's directive for creating new documents:

> **Create** a new document: Write a `docx` (npm) script — see gotchas below

Reconstructing claude.ai's full execution from the conversation API:

| # | Tool | Action |
|---|---|---|
| 1 | `view` | Read SKILL.md |
| 2 | `bash_tool` | Check `require('docx')` + query Chinese fonts |
| 3 | `create_file` | Write `make_rag_doc.js` (12,340 chars) |
| 4 | `bash_tool` | `node make_rag_doc.js` → produce .docx |
| 5 | `bash_tool` | `soffice` → PDF → `pdftoppm` → images |
| 6-8 | `view` | Inspect page-1/2/3.jpg to verify rendering |
| 9 | `bash_tool` | Found list numbering bug → fix JS → rerun |
| 10 | `present_files` | Deliver |

The model saw "Write a `docx` (npm) script" → naturally wrote `make_rag_doc.js` and executed with `node`. Each step was an independent tool call — no possibility of a 90-second stall.

## Fix

Added three mandatory execution rules to the `skill-docx` instructions in the seed registry:

```markdown
## ⚠️ Execution rules (mandatory)
- You MUST read `/workspace/skills/docx/SKILL.md` completely before
  writing any code.
- When creating a new document, write a `docx` (npm) script to a
  `.js` file, then execute it with `node <file>`. NEVER write
  JavaScript code inline in your text response.
- After generating the .docx, verify the output:
  soffice → convert to PDF → pdftoppm → visually check page images.
```

[PR #8285](https://github.com/Playma-Co-Ltd/maiagent-django/pull/8285): 1 file, 1 line changed.

## Root Cause

Three layers stacked:

1. **Opus 4.6's inference latency under large context**: 22 tools + 13 skills + multi-step agent loop history — generating long JS code blocks pushed inter-token latency past 90 seconds.
2. **Condensed skill instructions didn't guide the model to the safe path**: Listed "Create new documents: `docx-js`" but never said "write to a file and execute with node." The model sometimes chose bash (success), sometimes inline text (failure).
3. **90-second stall timeout is tight for Opus long output**: Claude.ai's same task took over 3 minutes (including multi-step tool calls + verification loops), but its Code Interpreter has no chunk-level stall timeout.

The fundamental issue wasn't that Opus is too slow — it was that **a one-sentence difference in skill instructions sent the model down a different path**.

## Takeaway

Skill instructions aren't just "telling the model what tools exist" — they're **path design**. When multiple viable paths exist (bash execution vs inline output), instructions must explicitly direct the model to the one you want.

"Write a script" isn't a suggestion. It's a guardrail.

## References

- [Anthropic Skills — docx SKILL.md](https://github.com/anthropics/skills/tree/main/skills/docx) — The official docx skill used by claude.ai
- [Amazon Bedrock ConverseStream API](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_ConverseStream.html) — The underlying API where stream_stall occurs
- [PR #8285: fix(seeds): add execution rules to docx skill](https://github.com/Playma-Co-Ltd/maiagent-django/pull/8285) — The fix
- [PR #7116: feat(seeds): seed reconciler phase 2](https://github.com/Playma-Co-Ltd/maiagent-django/pull/7116) — The PR that introduced docx skill management via seed reconciler
