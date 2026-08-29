---
title: "Rivumi's ExternalCodingRunner: why Codex and Claude Code CLI are external runtimes, not ModelProviders"
date: 2026-08-23
category: tech
type: deep-dive
tags: [rivumi, coding-agent, codex-cli, claude-code, orchestration]
lang: en
tldr: "Rivumi has its native loop (`AgentRunner`) and an external-runtime integration path (`ExternalCodingRunner`). The latter does not wrap official Codex CLI, Claude Code CLI, or local-only OpenCode, Pi, and OMP as `ModelProvider`s. They own their own model loops. Rivumi creates the disposable clone, passes allowed paths and verification commands, validates the returned patch with SafePathPolicy and ToolExecutor, reruns final verification, and checks that the source repo did not change."
description: "A deep dive into Rivumi's ExternalCodingRunner design: how it splits responsibilities from AgentRunner, why Codex and Claude Code CLI are not ModelProviders, and how disposable clone, patch boundary validation, final verification, and source invariants preserve Rivumi's safety guarantees."
series:
  name: "Rivumi 架構拆解"
  order: 5
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-23-rivumi-external-coding-runner)

The first four articles covered Rivumi's native loop. This article covers its mirror path: the same task may be delegated to a runtime that already owns its own loop, such as Codex CLI, Claude Code CLI, OpenCode, Pi, or OMP. Rivumi does not take over those loops. It orchestrates: sends the task, receives a patch, and verifies the result itself.

The module docstring in `src/rivumi/backends.py` makes the boundary explicit:

> External agent backends own their model loop and are deliberately separate from `ModelProvider`. They are not a way to forward provider credentials.

That sentence carries three claims: external backends own their own loop; they are not model transports; and they are not a credential-forwarding mechanism. Rivumi does not read Codex CLI's `~/.codex/auth.json` or Claude Code's credential store. Those CLIs are integrated collaborators, not resources to be extracted.

## Why not wrap external CLIs as ModelProviders?

The tempting design is to make Codex CLI a `ModelProvider`. Then Rivumi's native loop could call Codex through `complete(messages, tools) -> ModelTurn` and avoid a separate integration path.

Rivumi avoids that for four reasons:

- **The loops cannot be merged**: Codex CLI and Claude Code CLI have their own tool loops, approval flows, retries, and prompt-injection defenses. Squashing that into one non-streaming `ModelTurn` loses their semantics.
- **The tool sets differ**: official CLIs may run shell, access MCP servers, or manage Git differently. Rivumi's native loop exposes seven tools. Combining them creates contradictory capabilities.
- **The auth model differs**: official CLIs often use subscription OAuth, while Rivumi's native loop uses canonical API-key providers.
- **The verification boundary must remain Rivumi-owned**: if the external loop both edits and decides verification, Rivumi becomes a broker and loses its M1 guarantees.

So Rivumi creates a second path: **an external CLI is an `ExternalAgentBackend`; it runs inside Rivumi's disposable clone; the resulting patch returns to Rivumi for audit and verification.** The loop is theirs. The boundary is Rivumi's.

## Four gates inside ExternalCodingRunner.run()

`ExternalCodingRunner.run()` in `src/rivumi/external_runner.py:553-810` has four gates. Each failure maps to a specific terminal reason.

**Gate 1: approval.** The first action is asking permission to let the external CLI edit Rivumi's disposable clone. The preview is explicit:

> Allow `codex` to edit Rivumi's disposable clone. The source repository remains read-only to the delegated workflow.

The user is approving modifications to a clone, not to the source repository. `allow_external_modify` is the explicit escape hatch for headless or CI-like environments.

**Gate 2: disposable clone plus source invariant.** Rivumi uses the same `LocalGitWorkspace` as the native loop. It also captures a source invariant: HEAD SHA, porcelain status, and file-byte hashes.

Then `_isolate_git_metadata(workspace, run_dir, ...)` moves the clone's `.git` directory into `run_dir/.git-isolated/` and leaves a relative symlink from the workspace. This keeps external CLIs away from the original source repository's Git metadata. If prompt injection pushes them toward `git push` or `git fetch`, they are operating on the isolated clone metadata, not the source.

**Gate 3: patch boundary validation.** After the external CLI finishes, Rivumi extracts a unified diff with `executor.reviewable_patch(...)` and validates it:

```python
@staticmethod
def _validate_external_patch(
    workspace: Path,
    patch: str,
    changed_paths: tuple[str, ...],
) -> None:
    forbidden = (
        "GIT binary patch",
        "Binary files ",
        "new file mode 120000",
        "old mode 120000",
        "rename from ",
        "rename to ",
        "copy from ",
        "copy to ",
    )
    if any(line.startswith(forbidden) for line in patch.splitlines()):
        raise ToolExecutionError(
            "external patch contains a binary, symlink, rename, or copy change"
        )
    for relative in changed_paths:
        target = workspace / relative
        if not target.exists():
            continue
        mode = target.lstat().st_mode
        if not stat.S_ISREG(mode):
            raise ToolExecutionError(f"external patch leaves a non-regular file: {relative}")
```

Binary patches, symlinks, renames, and copies are rejected. Rivumi's native editing surface is path-bounded text edits and patches; allowing an external CLI to rename, copy, or create symlinks would bypass that policy.

**Gate 4: final verification plus source invariant.** Rivumi reruns all `task.verification` commands through its own `ToolExecutor.run_check`, ignoring any verification the external CLI claims to have done. After verification passes, Rivumi extracts the patch again and ensures verification did not modify it. If tests wrote files or changed the diff, the run is rejected.

Finally, `_source_invariant_matches(...)` compares the source snapshot taken before delegation with current source state. HEAD, status, and file bytes must match. If the source repo changed during delegation, the terminal reason becomes `source_repository_changed`, even if the patch itself looked valid.

## Shared artifact layout

External runs leave the same core artifacts as native runs: `request.json`, `events.jsonl`, `checkpoint.json`, `changes.patch`, `test.log`, and `result.json`. They also write `backend-result.json`, which records the external CLI's own event stream and result metadata. `RunResult.artifacts` includes that extra file so UI can decide whether to show the delegated runtime's transcript.

External terminal reasons include:

- `verified`: verification passed and the source invariant held.
- `verification_failed`: the external CLI produced a patch, but Rivumi verification failed.
- `no_changes`: the external CLI claimed completion without a diff.
- `source_repository_changed`: the source repo changed during delegation.
- `external_agent_error`, `policy_or_artifact_error`, `timeout`, `user_cancelled`: backend failure, patch validation failure, timeout, or cancellation.

`external_failure_hint(terminal_reason, backend_name)` maps those outcomes to user-facing hints, such as telling the user to install `codex` when the executable is missing.

## Backend integration shape

Rivumi splits backend integration into two layers:

- `src/rivumi/backends.py` defines the `ExternalAgentBackend` Protocol: `async def run(task, working_directory, event_sink) -> ExternalAgentResult`.
- `src/rivumi/external_cli_base.py` handles common subprocess work: spawn the CLI, capture a JSONL stream, parse events, and emit `ExternalAgentEvent`s.

Concrete backends fall into two groups:

- `src/rivumi/codex_conversation.py` wraps Codex CLI, using ChatGPT OAuth subscription flow owned by Codex itself.
- `src/rivumi/claude_agent_session.py` wraps Claude Code CLI through the narrowest policy-compatible path, using file tools and avoiding shell, network, and MCP.
- OpenCode, Pi, and OMP are marked local-only experimental runtimes. They own their loops and tools; Rivumi receives the patch and verifies it.

`backend_name`, `local_only`, and `experimental` are protocol attributes, so UI can label which runtimes are official subprocess integrations and which are local-only experiments.

## Why this is not credential tunneling

M4 introduced a real temptation: users already have subscriptions logged into official CLIs, so Rivumi could try to read those credentials and reuse them as API keys.

It does not. The reasons are concrete:

- **License and account boundary**: a CLI OAuth token is for that CLI's own use, not for arbitrary third-party code.
- **Isolation**: sharing the token couples two programs' failure modes and log surfaces.
- **Verification boundary**: using the subscription token directly as a `ModelProvider` would collapse the whole external patch-audit path.

The contract is: **the backend reads its own credential, runs its own loop, and returns a result**. Rivumi never touches OAuth flows, never reads CLI credential files, and never writes auth strings into `events.jsonl`. If a backend needs login repair, Rivumi can only surface a hint such as "please run `codex login` again."

## The trade-off

`ExternalCodingRunner` solves the tension between "I want to use my Codex or Claude Code subscription" and "I do not want to lose Rivumi's safety guarantees." The answer is: **delegate the loop, keep the boundary**.

Disposable clones, `SafePathPolicy`, verification-as-gate, and source-isolation E2E remain in force. The external CLI is the delegated driver, but Rivumi decides whether the result is acceptable.

The next article turns back to the native loop and looks at the `ModelProvider` multi-gateway boundary.

---

## References

- [Rivumi official repo](https://github.com/vincentxuu/rivumi) -- the ground truth for all code references in this article
- [Rivumi M4 docs](https://github.com/vincentxuu/rivumi/blob/main/docs/stages/m4-provider-completion.md) -- official milestone for subscription-backed paths
- [Rivumi M5 docs](https://github.com/vincentxuu/rivumi/blob/main/docs/stages/m5-subscription-backed-external-coding.md) -- `ExternalCodingRunner` contract definition
- [OpenAI Codex CLI](https://github.com/openai/codex) -- the runtime wrapped by `codex_conversation.py`
- [Claude Code CLI](https://docs.claude.com/en/docs/claude-code) -- the runtime wrapped by `claude_agent_session.py`
- [OpenCode](https://opencode.ai/) -- a local-only runtime integration target
- [Anthropic Claude Agent SDK](https://docs.claude.com/en/api/agent-sdk/overview) -- background for wrapping Claude Code-style agent sessions
- [Python asyncio subprocesses](https://docs.python.org/3/library/asyncio-subprocess.html) -- subprocess-stream handling background
