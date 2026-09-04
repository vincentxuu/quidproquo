---
title: "Learning Design from Mature Coding Agents (10): Edit Tool Trade-offs — unified diff, exact edit, hashline, and whole-file"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 10
tags: [coding-agent, harness-engineering, edit-tool, unified-diff, llm, tool-design]
lang: en
description: "How Codex, Claude Code, OpenCode, Pi, and OMP design their file edit tools: why LLMs fail at unified diffs, the cost of fuzzy fallbacks, hashline's content-hash anchors, and how looplane's constrained replace_text took qwen3:4b from reliable failure to 5/5."
tldr: "LLMs break unified diffs on bookkeeping: wrong hunk counts, hallucinated context lines. The five reference projects split into two camps — simplify the diff grammar (Codex drops line numbers), or drop diffs entirely (Claude Code/Pi/OpenCode exact replace); OMP goes further by binding read state into the format via hash anchors. looplane took the minimal-intervention path: keep the guarded apply_patch, add a zero-fuzzy replace_text, and its qwen3:4b eval went from stable failure to 5/5."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-edit-tool-tradeoffs)

## The design problem

The edit tool is the most frequently called tool in a coding agent — and the one that fails most often. The problem isn't that models don't understand code; it's that unified diff is a format designed for deterministic programs like `diff` and `patch`, not for LLMs. Every time a model emits a hunk it must correctly answer questions it never needed to answer:

- Is this line context or a change? Does it need a leading space?
- Are the hunk header's start line and line count right? How much does the offset shift after this change?
- Does the file end with a newline?

Get any single digit wrong and `git apply` returns `corrupt patch`. When I ran local small models against looplane, this is exactly the failure I saw: twice, the model found the right line and flipped minus to plus correctly — but the patch ended immediately after the added line, or declared hunk counts that didn't match the body. Semantically perfect, bookkeeping fatally wrong. A sneakier variant is the hallucinated context line: the model invents surrounding code from memory, the hunk is grammatically valid but the content doesn't exist, and apply fails all the same.

So every agent must answer: how much "precision" should the edit format demand from the model? And who cleans up when it fails?

## What the five projects do

### Codex: custom patch format — no line numbers, multi-tier fuzzy matching

Codex doesn't use standard unified diff. It defines its own `*** Begin Patch` envelope. Look at `codex/codex-rs/apply-patch/src/parser.rs#UpdateFileChunk`: each chunk carries only `change_context` (a single locating context line), `old_lines`, `new_lines`, and `is_end_of_file` — no line numbers or counts at all. That eliminates the entire failure class of "miscounted hunk headers."

The cost lands on the application side. `codex/codex-rs/apply-patch/src/seek_sequence.rs#seek_sequence` matches with decreasing strictness: exact first, then ignoring trailing whitespace, then ignoring leading and trailing whitespace, then normalizing Unicode quotes/dashes/fullwidth spaces to ASCII before retrying; EOF patterns are searched from end-of-file first. There's also a lenient parse mode in `parser.rs#ParseMode` just to handle GPT-4.1's habit of wrapping heredocs inside shell command arrays. The lesson: even after simplifying the grammar, you still need escape hatches for the model's habitual failure modes.

### Claude Code: exact replace with a read-freshness gate

Claude Code's Edit tool is str_replace-style: `claude-code-source/src/tools/FileEditTool/types.ts#inputSchema` has exactly four fields — `file_path`, `old_string`, `new_string`, `replace_all`. The model never touches diff syntax.

The real design lives in the gating. `claude-code-source/src/tools/FileEditTool/FileEditTool.ts#validateInput` checks `readFileState` first: never-read files are rejected, files whose mtime is newer than the recorded read are rejected too (with a full-content comparison fallback when mtime looks unreliable), and only then does it count occurrences of `old_string` — zero reports not-found, more than one without `replace_all` demands more context. After a successful edit the read timestamp is updated so subsequent stale writes are also blocked. "Read before edit" isn't prompt advice here; it's enforced in code.

### OpenCode: exact replace, but nine replacers to clean up

OpenCode is also exact replace, but `opencode/packages/opencode/src/tool/edit.ts#replace` tries nine replacers in order: simple, line-trimmed, block-anchor, whitespace-normalized, indentation-flexible, escape-normalized... progressively loosening up to ContextAwareReplacer. Failure means none of them matched. One notable self-protection: `isDisproportionateMatch` refuses the replacement if the fuzzy-expanded match spans far more text than the model's `oldString`. This admits the core risk of fuzzy fallback — you might be replacing something other than what the model intended.

### Pi: batched exact edits, diff generated by the harness

Pi's `pi-mono/packages/coding-agent/src/core/tools/edit.ts` takes an `edits[{oldText, newText}]` array for multiple replacements per call, with all edits matched against the original file (not applied incrementally). The prompt only asks oldText to be "small while unique." The philosophy mirrors Codex's from the opposite direction: the model picks content, the harness computes the diff itself — the review artifact is always correct because the model never wrote it.

### OMP: hashline — binding read state into the edit format

OMP (a Pi fork) goes furthest. `oh-my-pi/packages/coding-agent/src/utils/edit-mode.ts#EditMode` defines five modes: `replace`, `patch`, `hashline`, `apply_patch`, `sloppy` — with `hashline` as the default. The format, implemented in `oh-my-pi/packages/hashline/src/patcher.ts#Patcher`: each section starts with `[PATH#TAG]`, where TAG is a whole-file content hash recorded at read time; before applying, the patcher verifies the hash and on mismatch either refuses or runs three-way merge recovery via `oh-my-pi/packages/hashline/src/recovery.ts#Recovery`. Line operations like `PUT A.=B:` name explicit ranges — line numbers stop being model-computed bookkeeping and become part of the read output.

Even more interesting is routing: `edit-mode.ts#resolveEditMode` queries a per-model variant via `getEditVariantForModel`, falling back to `sloppy` mode when a model can't handle hashline. The same codebase openly acknowledges that different models suit different edit languages.

OMP also ships measurements: in `oh-my-pi/packages/typescript-edit-benchmark/all_models_results.json`, deepseek-v3.2 scores 55% task success but 100% edit success — a reliable edit tool doesn't mean passing tasks. Conversely gemini-3f hits 80% task success with only 74% edit success. The two metrics decouple, which is precisely the point: the edit tool is an independent engineering variable.

## looplane's choice and how it differs

looplane's M2 had only a guarded `apply_patch`, and in real-provider evals qwen3:4b kept dying the same death: finding the right line, emitting a corrupt patch. For M3 I added a constrained exact edit, implemented in `src/looplane/tools.py#replace_text`:

- A prior `read_file` is mandatory, and the harness records the SHA-256 of the full content — any post-read change rejects the call outright. This upgrades Claude Code's mtime-heuristic freshness check into exact content comparison.
- `old_text` must occur exactly once; zero matches report observed=0, multiple report observed=N. No trimming, no normalization.
- The target must be an existing Git-tracked UTF-8 text file; new files go through `apply_patch` only, keeping every creation reviewable as a diff.
- Writes use a sibling temp file with fsync and atomic replace; afterwards the tool runs `git diff --check` plus cumulative patch budget checks, and any failure restores the original bytes and mode.
- No fuzzy matching, no regex, no replace_all, no whole-file writer.

The prompt version `m3-exact-edit-v1` in `src/looplane/prompts.py` encodes one decision rule: small changes to existing files use `replace_text`; create/delete and complex structural edits use `apply_patch`. The existing `src/looplane/tools.py#apply_patch` is untouched and still enforces safe rejection via `git apply --whitespace=error-all`.

Result: on the same tiny-python-bug fixture, the real Ollama eval went from reliable failure to five consecutive passes (5/5). That's not qwen3:4b getting smarter — it's the harness taking "count hunk lines," a job deterministic code does better, away from the model. The difference from OpenCode's nine-replacer chain is one of attitude: I'd rather leave failures in place with classifiable messages (0 matches → re-read) than silently repair toward a target the model may not have meant.

## Papers and engineering evidence

None of this trade-off analysis is new. Aider's engineering benchmark ([unified diffs](https://aider.chat/docs/unified-diffs.html)) documented early how poorly GPT-4 Turbo wrote unified diffs unaided, and how explicit diff-syntax rules in prompts claw completion rates back — prompting helps, but Aider also repairs patches in code, implicitly admitting prompts alone aren't enough. On the academic side, [SWE-agent](https://arxiv.org/abs/2405.15793) introduced the agent-computer interface (ACI): the shape of the tool interface is itself a performance variable, and edit-command design affects success rates as much as model capability. OMP's edit benchmark provides the freshest corroboration: edit success and task success are two curves you can tune independently.

## What could still improve

- **Per-model edit mode routing.** OMP's `resolveEditMode` already demonstrates per-model variants; looplane currently serves one toolset to all models. Supporting smaller models makes this the natural next step.
- **Richer approval preview.** Approval currently shows the path and both fragments; computing a diff preview before mutation, like OpenCode does, would improve informed review.
- **Hashline-style content anchors.** looplane already keeps a read-version ledger; in principle the hash could travel inside the edit call itself so stale edits are rejected at schema level rather than compared afterward. But beware: that couples writes to the read tool's output format — exactly why my M3 notes judged it "not the smallest answer."
- **More fixtures.** The eval currently covers single-file small edits; CRLF, BOM, repeated lines needing disambiguation context, and multi-file refactors remain on the list. An edit tool's reliability claim extends exactly as far as its fixture list.

The core lesson loops back to one sentence: give deterministic work to deterministic code. What models are good at is deciding *where* to change and *what* to change — not counting hunk lines.

## References

- [Aider — unified diffs](https://aider.chat/docs/unified-diffs.html): measured GPT-4 Turbo unified-diff failure rates and mitigation strategies.
- [SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering](https://arxiv.org/abs/2405.15793): the original ACI paper — direct evidence that interface design drives agent success rates.
- [openai/codex — apply-patch crate](https://github.com/openai/codex/tree/main/codex-rs/apply-patch): source for Codex's custom patch format, parser, and seek_sequence fuzzy matching.
- [can1357/oh-my-pi — hashline package](https://github.com/can1357/oh-my-pi/tree/main/packages/hashline): full implementation of the hash-anchored line-editing format.
- [sst/opencode — edit tool](https://github.com/sst/opencode/blob/dev/packages/opencode/src/tool/edit.ts): exact replace with the nine-replacer chain.
- [badlogic/pi-mono — coding-agent edit tool](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent/src/core/tools): batched exact edits with harness-generated diffs.
