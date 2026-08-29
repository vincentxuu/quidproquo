---
title: "Rivumi's disposable clone and run bundle: why the source repo stays untouched"
date: 2026-08-23
category: tech
type: deep-dive
tags: [rivumi, coding-agent, git, sandbox, artifacts]
lang: en
tldr: "Rivumi never edits the source repository. `LocalGitWorkspace.prepare()` clones a pinned base commit into a detached-HEAD disposable workspace with `--no-hardlinks`; every patch, test, and verification command runs there. The run leaves behind request.json, events.jsonl, checkpoint.json, session.json, changes.patch, test.log, result.json, and verification.json, which `rivumi resume` and `rivumi sessions` use to recover state."
description: "A deep dive into Rivumi's workspace isolation design: full-SHA validation, no-hardlinks cloning, detached HEAD, run_dir-not-inside-source checks, run bundles, session manifests, artifact timing, and why a disposable clone is not an OS sandbox."
series:
  name: "Rivumi 架構拆解"
  order: 2
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-23-rivumi-disposable-clone-run-bundle)

The previous article took apart the loop. This one looks at what happens before the loop runs: workspace preparation. Rivumi makes a hard claim: **the agent never edits the source repository**. Every patch, test, and verification command runs inside a disposable clone, and the source worktree's HEAD, status, and file bytes remain unchanged after the run.

That guarantee comes from two pieces working together: `LocalGitWorkspace` clones a pinned base commit into a detached-HEAD workspace, and the run leaves a bundle of artifacts that lets a reviewer return to the exact state of the run.

## Why disposable workspaces are necessary

"Just edit the source repo, run tests, and inspect the diff" sounds natural, but it fails in production for three reasons:

- **Auditability**: if the agent patches the source repo directly, answering "what did this run change?" depends on the repo still being in the post-run state. A reset or cleanup can erase the evidence.
- **Reproducibility**: commands such as `pip install -e .` or `pnpm install` leave behind `__pycache__`, `node_modules`, `.venv`, and other side effects that can influence the next run and cannot always be restored by Git.
- **Cancellation**: abandoning a run should be cheap. If the agent worked in the source repo, cancellation means manually reverting an unknown sequence of edits. If it worked in a disposable clone, cancellation means deleting the workspace.

A disposable clone solves all three: **audit through artifacts in the clone, reproduce by cloning the same SHA again, cancel by removing `workspace/`.**

## LocalGitWorkspace: every guard is in `prepare()`

`LocalGitWorkspace` in `src/rivumi/runtime.py:361-466` enforces the boundary. Its constructor already establishes two invariants:

```python
@dataclass
class LocalGitWorkspace:
    source_repo: Path
    run_dir: Path
    base_sha: str
    workspace_name: str = "workspace"
    git_timeout_seconds: float = 30.0

    def __post_init__(self) -> None:
        self.source_repo = Path(self.source_repo).resolve(strict=False)
        self.run_dir = Path(self.run_dir).resolve(strict=False)
        if not self.workspace_name or Path(self.workspace_name).name != self.workspace_name:
            raise ValueError("workspace_name must be one path segment")
        if not _FULL_SHA.fullmatch(self.base_sha):
            raise ValueError("base_sha must be a full 40-character Git commit SHA")
```

`base_sha` must be a full 40-character commit SHA; short SHAs, branches, and tags are rejected. `workspace_name` must be one path segment, preventing `../foo` or absolute-path escapes.

`prepare()` performs the actual conversion from source repository to disposable clone:

```python
def prepare(self, *, timeout_seconds: float | None = None) -> Path:
    deadline = time.monotonic() + timeout_seconds if timeout_seconds is not None else None

    def remaining() -> float | None:
        if deadline is None:
            return None
        value = deadline - time.monotonic()
        if value <= 0:
            raise WorkspacePreparationError(
                "workspace preparation exceeded the harness timeout"
            )
        return value

    source = self.source_repo.resolve(strict=True)
    if not source.is_dir():
        raise WorkspacePreparationError(f"source repository is not a directory: {source}")

    run_dir = self.run_dir.resolve(strict=False)
    try:
        run_dir.relative_to(source)
    except ValueError:
        pass
    else:
        raise WorkspacePreparationError("run_dir must not be inside the source repository")

    if self.workspace_path.exists():
        raise WorkspacePreparationError(f"workspace already exists: {self.workspace_path}")
    self.run_dir.mkdir(parents=True, exist_ok=True)

    resolved = self._git(
        ("-C", str(source), "rev-parse", "--verify", f"{self.base_sha}^{{commit}}"),
        cwd=self.run_dir,
        timeout_seconds=remaining(),
    )
    if not resolved.ok or resolved.stdout.strip().lower() != self.base_sha.lower():
        raise WorkspacePreparationError(
            "base_sha is not an exact commit in the source repository"
        )

    cloned = self._git(
        (
            "clone",
            "--no-hardlinks",
            "--no-checkout",
            "--",
            str(source),
            str(self.workspace_path),
        ),
        cwd=self.run_dir,
        timeout_seconds=remaining(),
    )
    if not cloned.ok:
        raise WorkspacePreparationError(f"git clone failed: {cloned.stderr.strip()}")

    checked_out = self._git(
        ("checkout", "--detach", self.base_sha),
        cwd=self.workspace_path,
        timeout_seconds=remaining(),
    )
    if not checked_out.ok:
        raise WorkspacePreparationError(f"git checkout failed: {checked_out.stderr.strip()}")
    head = self._git(
        ("rev-parse", "HEAD"),
        cwd=self.workspace_path,
        timeout_seconds=remaining(),
    )
    if not head.ok or head.stdout.strip().lower() != self.base_sha.lower():
        raise WorkspacePreparationError("disposable workspace HEAD does not match base_sha")
    return self.workspace_path
```

Each step maps to a concrete risk:

- `source.resolve(strict=True)` resolves symlinks before any containment checks.
- `run_dir.relative_to(source)` rejects a run directory inside the source repo, avoiding accidental source-tree pollution.
- `rev-parse --verify base_sha^{commit}` proves that the requested commit exists exactly.
- `git clone --no-hardlinks --no-checkout` avoids shared inodes and postpones checkout until Rivumi chooses the exact commit.
- `git checkout --detach base_sha` keeps the workspace off any branch.
- A final `git rev-parse HEAD` verifies that the checkout really landed on `base_sha`.

None of these steps writes into the source repo. Git commands either read the source or operate inside the new workspace. `_git()` also uses `sanitized_subprocess_env`, so subprocesses do not inherit host credentials or global Git configuration.

## Run bundle: artifacts for different readers

The artifact map in `loop.py:691-697` gives the fixed layout:

```python
artifacts={
    "request": str(self.run_dir / "request.json"),
    "events": str(self.run_dir / "events.jsonl"),
    "checkpoint": str(self.run_dir / "checkpoint.json"),
    "patch": str(self.run_dir / "changes.patch"),
    "test_log": str(self.run_dir / "test.log"),
    "result": str(self.run_dir / "result.json"),
},
```

Together with `verification.json` and `session.json`, those files answer different questions:

| File | Written when | Question it answers |
|---|---|---|
| `request.json` | At run start | What was this run supposed to do? It stores the frozen `TaskContract` snapshot. |
| `events.jsonl` | On every event | What happened, in order? Append-only audit trail. |
| `checkpoint.json` | On status changes | Which phase was the run in? Useful, but not the state of record. |
| `changes.patch` | Whenever diff changes, and at finish | What final patch is reviewable? Even failed runs get a file. |
| `test.log` | After verification, and at finish | What did verification print? |
| `result.json` | At run finish | Frozen `RunResult`, including status, terminal reason, verification outcomes, and artifact paths. |
| `verification.json` | After `_verify_all` | A direct JSON dump of `VerificationOutcome` values. |
| `session.json` | On state commit | The state of record for resume: messages, usage, step, event sequence, and writer lease. |

The important detail is that `RunResult.artifacts` records where the artifacts are. A reviewer can start with `result.json` and find the event log, patch, and test output without re-opening the loop implementation.

## Why this is not a real sandbox

`LocalGitWorkspace` is workspace isolation, not hostile-code OS isolation. It protects:

- the source worktree
- the source `.git` directory
- separation between runs

It does not protect:

- the host filesystem, if another layer manages to bypass the path policy
- the network, unless Docker or Cloudflare Sandbox adds that boundary
- process privileges, because local subprocesses run as the current user
- every language runtime cache, except for targeted hardening such as `PYTHONDONTWRITEBYTECODE=1`

So Rivumi's local mode is appropriate for known, non-hostile repositories owned by the developer. Truly untrusted code needs a stronger runtime boundary, such as Docker or Cloudflare Sandbox. The Cloudflare deployment slice wraps the same idea in a container later in the series.

## Source-isolation E2E

The M1 release-gate verification includes a source-isolation E2E check:

> Source-isolation E2E compares source HEAD, porcelain status, and file bytes before and after.

Before the agent runs, Rivumi snapshots three source-repo properties: HEAD commit, `git status --porcelain`, and file-byte hashes. After the loop finishes, it snapshots them again. The two snapshots must match exactly. That is stronger evidence than a unit test saying "we called git clone": it proves the source repository did not change at the filesystem level.

Later live-provider evaluation (`scripts/eval_live_provider.py`) carries the same invariant forward. Each eval cross-checks source HEAD, status, and bytes after the run; any mismatch fails the evaluation. The disposable-clone guarantee is checked every time, not merely asserted in documentation.

## Overall architecture

```
TaskContract ──► AgentRunner
                  │
                  ├── LocalGitWorkspace.prepare() ──► detached HEAD clone in run_dir/workspace/
                  │                                     │
                  │                                     │ (all patch / test / verification happens here)
                  │
                  ├── events.jsonl      ◄── append-only, fsync
                  ├── checkpoint.json   ◄── atomic_write_json
                  ├── request.json      ◄── atomic_write_json (immutable TaskContract snapshot)
                  ├── changes.patch     ◄── written on diff updates and at final state
                  ├── test.log          ◄── stdout/stderr for verification commands
                  ├── verification.json ◄── atomic_write_json
                  └── result.json       ◄── atomic_write_json (RunResult + artifact map)
```

## The trade-off

The disposable clone and run bundle are one design, not two: **the clone keeps the source untouched; the bundle keeps the run inspectable**. `LocalGitWorkspace.prepare()` explicitly rejects risky workspace layouts, while fixed artifact paths, `session.json`, append-only events, and the `RunResult` artifact map make the run auditable.

The external runtime path now uses the same boundary. Codex CLI, Claude Code, OpenCode, Pi, and OMP work inside the disposable clone. When they finish, Rivumi performs path-bounded patch audit and final verification, instead of letting an external CLI treat the source repo as its working directory.

The cost is an extra clone per run. Because `--no-hardlinks` forces physical separation, large repositories may pay seconds or minutes. The return is that review does not have to trust the agent. A reviewer reads `result.json` and `changes.patch` to answer what happened, why it happened, and whether it passed. If the work needs to continue, `rivumi resume` restores state from `session.json` instead of replaying the whole loop.

The next article covers tool isolation: `SafePathPolicy`, `ToolExecutor`, and `sanitized_subprocess_env`.

---

## References

- [Rivumi official repo](https://github.com/vincentxuu/rivumi) -- the ground truth for all code references in this article
- [Rivumi M1 docs](https://github.com/vincentxuu/rivumi/blob/main/docs/stages/m1-local-harness.md) -- official local-harness design notes
- [Git clone documentation](https://git-scm.com/docs/git-clone) -- the behavior of `git clone --no-hardlinks`
- [Git checkout documentation](https://git-scm.com/docs/git-checkout) -- detached HEAD behavior
- [Python `tempfile` and atomic writes](https://docs.python.org/3/library/tempfile.html) -- background for temporary-file based artifact writes
- [Reproducible builds](https://reproducible-builds.org/) -- the engineering principle behind fixed inputs and repeatable outputs
