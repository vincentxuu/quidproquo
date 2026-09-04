---
title: "Looplane's disposable workspace and run bundle: why the source repository stays untouched"
date: 2026-08-30
category: tech
type: deep-dive
tags: [looplane, coding-agent, git, sandbox, artifacts]
lang: en
tldr: "Looplane clones an exact Git commit into a detached-HEAD workspace inside the run directory before a runtime edits or verifies code. The source repository, execution workspace, and run artifacts therefore have distinct boundaries. This provides source isolation and an audit bundle, but it is not an OS sandbox."
description: "Trace Looplane from a pinned source commit through disposable-workspace preparation to request, event, patch, verification, and result artifacts."
series:
  name: "Looplane Architecture Notes"
  order: 2
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-23-looplane-disposable-clone-run-bundle)

After a user submits a task, Looplane does not place the agent inside the repository currently open on their machine. `AgentRunner.run()` resolves a base commit and asks `LocalGitWorkspace.prepare()` to create a disposable workspace. This article follows two questions: where code is changed, and which files remain for inspection after the run.

## Three locations with three responsibilities

```text
source repository
    │  resolve exact base SHA; read only
    ▼
run_dir/workspace/        run_dir/
detached-HEAD clone       request.json
patch / test / verify     events.jsonl
                         session.json
                         checkpoint.json
                         changes.patch
                         verification.json (native)
                         result.json
```

The source repository is an input. `workspace/` is the runtime's working tree. The remaining files in the run directory form the audit and resume bundle. With those locations separated, cancelling a task does not require restoring the user's dirty worktree, and review does not depend on nobody touching the repository after the agent stops.

## How `prepare()` pins the input

`LocalGitWorkspace` requires a full 40-character commit SHA and a one-segment `workspace_name`. `prepare()` then:

1. Resolves the real source path and rejects a run directory inside the source repository.
2. Uses `git rev-parse --verify <sha>^{commit}` to require an exact existing commit.
3. Runs `git clone --no-hardlinks --no-checkout` so the workspace does not share local hard links with the source.
4. Runs `git checkout --detach <sha>` and compares the resulting workspace `HEAD` again.

Any failure raises `WorkspacePreparationError`; the loop does not continue in a directory that is merely close to the requested version. This is the article's fail-closed boundary. A bad SHA, a pre-existing workspace, a run directory under the source, or an expired preparation deadline stops before the first tool call.

`test_disposable_workspace_is_pinned_to_commit_not_dirty_source` in `tests/test_runtime.py` verifies that uncommitted source content is absent from the clone. `test_disposable_workspace_keeps_source_unchanged_and_produces_patch` compares source state before and after execution and confirms that changes appear in the workspace and patch artifact instead.

## Run-bundle files answer different questions

The workspace preserves executable state; the run bundle preserves inspectable state. The table describes the main native-run artifacts. External runs share core request, event, patch, and result artifacts but do not promise the identical native `verification.json` layout.

| File | Question answered |
|---|---|
| `request.json` | What task, allowed paths, verification commands, and pinned SHA were requested? |
| `events.jsonl` | In what order did model, tool, approval, and verification events occur? |
| `session.json` | Which messages, usage, step, sequence, and lease state are needed for resume? |
| `checkpoint.json` | Which versioned checkpoint state is available for recovery? |
| `changes.patch` | What changed in the workspace relative to the base commit? |
| `test.log` / `verification.json` | Which checks ran, what did they output, and did they pass? |
| `result.json` | What were the run status, terminal reason, and artifact map? |

`result.json` is not a substitute for every source of truth. Reconstructing the process requires the event journal and session state. Reviewing the final change can start with `changes.patch`. The state-first journal article later in the series covers crash recovery, replay, and fork behavior.

## Source isolation is not an OS sandbox

A disposable workspace prevents direct edits to the source repository. A clone alone cannot stop a process from reading host files, using the network, or exercising the operating-system privileges of the current account. Looplane has separate path policy, permission layering, and OS-sandbox backends; those are different guarantees.

The local clone therefore separates changes and artifacts for a trusted repository. It should not be described as hostile-code containment. Untrusted verification commands belong to the later tool-boundary, permission, and OS-sandbox articles, not to capabilities retroactively assigned to `LocalGitWorkspace`. For a broader product-level view of sandbox choices, see the [Codex CLI overview](/posts/tech/2026-03-31-codex-cli-openai-coding-agent-en); this article stays on Looplane's source boundary.

## What this does not provide

The design does not make every clone cheap; large repositories still pay copying cost. Artifacts also do not become a reproducible build by themselves. Package registries, external services, and time can still drift. The concrete guarantees are a pinned Git input, an isolated modification location, and a fixed audit layout.

The [next article](/posts/tech/2026-08-30-looplane-prompt-instructions-memory-en) follows prompt assembly, instruction precedence, and explicit memory. The native loop starts at order 4 so workspace preparation and model turns do not get mixed into one subject.

---

## References

- [Looplane official repository](https://github.com/vincentxuu/looplane) — ground truth for `LocalGitWorkspace`, `AgentRunner`, and focused tests
- [Git `clone --no-hardlinks`](https://git-scm.com/docs/git-clone) — semantics of avoiding local hard links
- [Git detached HEAD](https://git-scm.com/docs/git-checkout#Documentation/git-checkout.txt---detach) — semantics of a pinned checkout
- [Reproducible Builds](https://reproducible-builds.org/) — background principles for reproducible inputs and environments
