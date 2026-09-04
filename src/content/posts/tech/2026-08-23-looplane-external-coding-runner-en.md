---
title: "Looplane's ExternalCodingRunner: why Codex and Claude Code CLI are external runtimes, not ModelProviders"
date: 2026-08-30
category: tech
type: deep-dive
tags: [looplane, coding-agent, codex-cli, claude-code, orchestration]
lang: en
tldr: "`ExternalCodingRunner` is Looplane's second runtime lane. The external coding CLI owns its model loop and credentials; Looplane hands off a task and disposable clone, then treats the returned patch as untrusted input and reruns path audit, verification, and the source invariant. This is a capability-bounded handoff, not another `ModelProvider`."
description: "A deep dive into Looplane's ExternalCodingRunner handoff: why an external coding CLI is not a ModelProvider, which capabilities Looplane delegates, and how returned patches pass boundary validation, final verification, and source-invariant audit."
series:
  name: "Looplane Architecture Notes"
  order: 7
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-23-looplane-external-coding-runner)

In the complete series plan, orders 4–6 cover Looplane's native lane, from the loop and provider contract through routing and fallback. This article switches to the second runtime lane: the same task may be delegated to Codex CLI, Claude Code CLI, OpenCode, Pi, or OMP, each of which already owns its own loop. Looplane handles the handoff: it sends a task and bounded workspace, receives a patch, and audits that patch itself.

The module docstring in `src/looplane/backends.py` makes the boundary explicit:

> External agent backends own their model loop and are deliberately separate from `ModelProvider`. They are not a way to forward provider credentials.

That sentence carries three claims: external backends own their own loop; they are not model transports; and they are not a credential-forwarding mechanism. Looplane does not read Codex CLI's `~/.codex/auth.json` or Claude Code's credential store. Those CLIs are integrated collaborators, not resources to be extracted.

## Why not wrap external CLIs as ModelProviders?

The tempting design is to make Codex CLI a `ModelProvider`. Then Looplane's native loop could call Codex through `complete(messages, tools) -> ModelTurn` and avoid a separate integration path.

Looplane avoids that for four reasons:

- **The loops cannot be merged**: Codex CLI and Claude Code CLI have their own tool loops, approval flows, retries, and prompt-injection defenses. Squashing that into one non-streaming `ModelTurn` loses their semantics.
- **The tool sets differ**: official CLIs manage their own shell, MCP, and Git capabilities. Looplane's native lane has seven single-step tools plus separately bounded programs, transactions, and dynamic capabilities. Forcing both lanes into one schema would blur capability ownership and approval boundaries.
- **The credential owner differs**: external Codex CLI owns its ChatGPT subscription OAuth. Native providers may use API keys or Looplane's explicit experimental, app-owned Codex OAuth adapter; neither path extracts the external CLI's login state.
- **The verification boundary must remain Looplane-owned**: order 4 requires Looplane verification before completion. If the external loop both edits and accepts its own result, the workspace, argv, and timeout guarantees lose their final acceptance gate.

So Looplane creates a second path: **an external CLI is an `ExternalAgentBackend`; it runs inside Looplane's disposable clone; the resulting patch returns to Looplane for audit and verification.** The loop is theirs. The boundary is Looplane's.

## Four gates inside ExternalCodingRunner.run()

`ExternalCodingRunner.run()` in `src/looplane/external_runner.py:553-810` has four gates. Each failure maps to a specific terminal reason.

**Gate 1: approval.** The first action is asking permission to let the external CLI edit Looplane's disposable clone. The preview is explicit:

> Allow `codex` to edit Looplane's disposable clone. The source repository remains read-only to the delegated workflow.

The user is approving modifications to a clone, not to the source repository. `allow_external_modify` is the explicit escape hatch for headless or CI-like environments.

**Gate 2: disposable clone plus source invariant.** Looplane uses the same `LocalGitWorkspace` as the native loop. It also captures a source invariant: HEAD SHA, porcelain status, and file-byte hashes.

Then `_isolate_git_metadata(workspace, run_dir, ...)` moves the clone's `.git` directory into `run_dir/.git-isolated/` and leaves a relative symlink from the workspace. This keeps external CLIs away from the original source repository's Git metadata. If prompt injection pushes them toward `git push` or `git fetch`, they are operating on the isolated clone metadata, not the source.

**Gate 3: patch boundary validation.** After the external CLI finishes, Looplane extracts a unified diff with `executor.reviewable_patch(...)` and validates it:

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

Binary patches, symlinks, renames, and copies are rejected. Looplane's native editing surface is path-bounded text edits and patches; allowing an external CLI to rename, copy, or create symlinks would bypass that policy.

**Gate 4: final verification plus source invariant.** Looplane reruns all `task.verification` commands through its own `ToolExecutor.run_check`, ignoring any verification the external CLI claims to have done. After verification passes, Looplane extracts the patch again and ensures verification did not modify it. If tests wrote files or changed the diff, the run is rejected.

Finally, `_source_invariant_matches(...)` compares the source snapshot taken before delegation with current source state. HEAD, status, and file bytes must match. If the source repo changed during delegation, the terminal reason becomes `source_repository_changed`, even if the patch itself looked valid.

## Shared artifact layout

External runs leave the same core artifacts as native runs: `request.json`, `events.jsonl`, `checkpoint.json`, `changes.patch`, `test.log`, and `result.json`. They also write `backend-result.json`, which records the external CLI's own event stream and result metadata. `RunResult.artifacts` includes that extra file so UI can decide whether to show the delegated runtime's transcript.

External terminal reasons include:

- `verified`: verification passed and the source invariant held.
- `verification_failed`: the external CLI produced a patch, but Looplane verification failed.
- `no_changes`: the external CLI claimed completion without a diff.
- `source_repository_changed`: the source repo changed during delegation.
- `external_agent_error`, `policy_or_artifact_error`, `timeout`, `user_cancelled`: backend failure, patch validation failure, timeout, or cancellation.

`external_failure_hint(terminal_reason, backend_name)` maps those outcomes to user-facing hints, such as telling the user to install `codex` when the executable is missing.

## Backend integration shape

Looplane splits backend integration into two layers:

- `src/looplane/backends.py` defines the `ExternalAgentBackend` Protocol: `async def run(task, working_directory, event_sink) -> ExternalAgentResult`.
- `src/looplane/external_cli_base.py` handles common subprocess work: spawn the CLI, capture a JSONL stream, parse events, and emit `ExternalAgentEvent`s.

Concrete implementations live in `codex_backend.py`, `claude_backend.py`, `opencode_backend.py`, `pi_backend.py`, and `omp_backend.py`. Each constructs its CLI invocation, parses output, projects `ExternalAgentEvent`s, and returns a patch to `ExternalCodingRunner`. The `codex_conversation.py` and `claude_agent_session.py` modules belong to the order 17 conversation/client integration, not this order 7 backend handoff.

`backend_name`, `local_only`, and `experimental` are protocol attributes. The current Codex, Claude Code, OpenCode, Pi, and OMP backends all set `local_only=True` and `experimental=True`: they are local experimental delegation paths, not Cloudflare runtimes or production-readiness labels.

## Why this is not credential tunneling

M4 introduced a real temptation: users already have subscriptions logged into official CLIs, so Looplane could try to read those credentials and reuse them as API keys.

It does not. The reasons are concrete:

- **Credential scope**: CLI login state belongs to that CLI's authentication flow. Extracting its token into another provider path bypasses the original credential owner and its refresh or revocation lifecycle.
- **Isolation**: sharing the token couples two programs' failure modes and log surfaces.
- **Verification boundary**: using the subscription token directly as a `ModelProvider` would collapse the whole external patch-audit path.

The contract is: **the backend runs through its CLI-owned login state and returns a result**. This external path does not extract CLI credentials, forward them into `ModelProvider`, or write authentication strings into `events.jsonl`. Looplane may implement OAuth for a separate native provider path, but that credential boundary stays explicit. If an external backend needs login repair, the runner surfaces a repair hint instead of taking ownership of the CLI's login data.

## The trade-off

`ExternalCodingRunner` solves the tension between "I want to use my Codex or Claude Code subscription" and "I do not want to lose Looplane's safety guarantees." The answer is: **delegate the loop, keep the boundary**.

Disposable clones, `SafePathPolicy`, verification-as-gate, and source-isolation E2E remain in force. The external CLI is the delegated driver, but Looplane decides whether the result is acceptable.

The next article covers the mechanical boundary both runtime lanes depend on: how `ToolExecutor` constrains a tool call's path, argv, environment, atomic write, and timeout.

---

## References

- [Looplane official repo](https://github.com/vincentxuu/looplane) -- the ground truth for all code references in this article
- [Looplane M4 docs](https://github.com/vincentxuu/looplane/blob/main/docs/stages/m4-provider-completion.md) -- official milestone for subscription-backed paths
- [Looplane M5 docs](https://github.com/vincentxuu/looplane/blob/main/docs/stages/m5-subscription-backed-external-coding.md) -- `ExternalCodingRunner` contract definition
- [OpenAI Codex CLI](https://github.com/openai/codex) -- the runtime wrapped by `codex_backend.py`
- [Claude Code CLI](https://docs.claude.com/en/docs/claude-code) -- the runtime wrapped by `claude_backend.py`
- [OpenCode](https://opencode.ai/) -- a local-only runtime integration target
- [Anthropic Claude Agent SDK](https://docs.claude.com/en/api/agent-sdk/overview) -- background for wrapping Claude Code-style agent sessions
- [Python asyncio subprocesses](https://docs.python.org/3/library/asyncio-subprocess.html) -- subprocess-stream handling background
