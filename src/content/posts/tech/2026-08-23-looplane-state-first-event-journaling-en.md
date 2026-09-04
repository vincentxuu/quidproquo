---
title: "Looplane's state-first event journaling: recovering between manifest commits and JSONL appends"
date: 2026-08-30
category: tech
type: deep-dive
tags: [looplane, coding-agent, crash-recovery, journaling, file-locking]
lang: en
tldr: "Looplane maintains append-only `events.jsonl` and atomically replaced `session.json`, reconciling sequences before crash recovery. The same event contract now supports deterministic replay, canonical JSON replay, fork seeds at a selected sequence, and new workspaces without replaying old side effects; ambiguous `tool.started` or `verification.started` states still hard-fail."
description: "A deep dive into Looplane's crash-safe design: same-directory temp files and fsync for atomic JSON writes, O_APPEND event logs, fcntl.flock writer leases, claim_and_validate_resume reconciliation, and why tool.started and verification.started cannot auto-resume."
series:
  name: "Looplane Architecture Notes"
  order: 12
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-23-looplane-state-first-event-journaling)

[Order 11](/posts/tech/2026-08-30-looplane-tool-program-transactions-en) composes tool calls into bounded programs and rollback-capable transactions. This article follows the state lifecycle from completion or crash through resume, replay, and fork. Its core remains two files with different semantics: append-only `events.jsonl` and atomically replaced `session.json`.

Maintaining two write paths is not redundant. **Either file alone is insufficient to decide where a crashed process stopped or to provide both control state and reconstructable history.**

Suppose `AgentRunner` is about to run `replace_text`. It has appended a `tool.started` event to `events.jsonl`, but the process receives SIGKILL before the tool actually runs. The manifest still shows the previous state, while JSONL contains a new "started" line. Reading only the manifest suggests the tool never started. Reading only JSONL suggests it started but never completed. Both interpretations are unsafe.

Looplane's answer is not "just retry." The manifest carries `last_event_sequence`; event validation derives `last_event_type` from the validated JSONL tail. Resume combines sequence, tail-event type, and manifest state, then continues, resynchronizes, or hard-fails depending on where the crash happened.

## Two write paths, two guarantees

`events.jsonl` appends in `src/looplane/events.py:46-57`:

```python
def _append_bytes(path: Path, payload: bytes, *, durable: bool) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    descriptor = os.open(path, os.O_APPEND | os.O_CREAT | os.O_WRONLY, 0o600)
    try:
        view = memoryview(payload)
        while view:
            written = os.write(descriptor, view)
            view = view[written:]
        if durable:
            os.fsync(descriptor)
    finally:
        os.close(descriptor)
```

`O_APPEND` gives append semantics at the OS level, `0o600` restricts permissions, and `fsync` makes durable mode actually hit disk. There is no truncate, rewrite, or seek. Once a line is written, it remains part of the audit trail. `EventWriter.append` adds an `asyncio.Lock` so appends from the same process stay serialized.

`session.json` uses the opposite write pattern:

```python
def _atomic_write(path: Path, payload: bytes, *, durable: bool) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary_path: Path | None = None
    try:
        with tempfile.NamedTemporaryFile(
            dir=path.parent,
            prefix=f".{path.name}.",
            delete=False,
        ) as file:
            temporary_path = Path(file.name)
            file.write(payload)
            file.flush()
            if durable:
                os.fsync(file.fileno())
        os.replace(temporary_path, path)
        if durable:
            directory = os.open(path.parent, os.O_RDONLY)
            try:
                os.fsync(directory)
            finally:
                os.close(directory)
    finally:
        if temporary_path is not None and temporary_path.exists():
            temporary_path.unlink()
```

This is write-temp-then-rename. Readers see either a complete file or no file. They do not see a half-written JSON document. The parent directory is fsynced so the rename metadata is durable too.

Together, the two paths let Looplane say two different things: **`events.jsonl` records what happened; `session.json` records the latest consistent state.** Audit and control need different file semantics.

## SessionManifest: the state of record for resume

`SessionManifest` in `session.py:72-104` is what resume actually reads:

```python
class SessionManifest(ContractModel):
    schema_version: Literal[1] = _SCHEMA_VERSION
    run_id: str = Field(min_length=1)
    task_id: str = Field(min_length=1)
    provider_name: str = Field(min_length=1)
    model_id: str = Field(min_length=1)
    protocol: str = Field(min_length=1)
    prompt_version: str = Field(default="m2-unversioned-patch", min_length=1)
    base_sha: str = Field(pattern=r"^[0-9a-fA-F]{40}$")
    phase: SessionPhase = SessionPhase.CREATED
    step: int = Field(default=0, ge=0)
    messages: tuple[ConversationItem, ...] = ()
    usage: Usage = Field(default_factory=Usage)
    final_summary: str = ""
    last_action_fingerprint: str | None = None
    repeat_count: int = Field(default=0, ge=0)
    last_event_sequence: int = Field(default=-1, ge=-1)
    verification: tuple[VerificationOutcome, ...] = ()
    pending_action: ApprovalRequest | None = None
    approval_history: tuple[ApprovalAuditRecord, ...] = ()
    granted_effects: frozenset[ToolEffect] = frozenset()
    active_wall_time_seconds: float = Field(default=0.0, ge=0)
    active_started_at: datetime | None = None
    terminal: bool = False
    active_writer_token: str | None = None
    writer_claimed_at: datetime | None = None
    writer_heartbeat_at: datetime | None = None
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
```

Two fields drive crash recovery:

- `last_event_sequence`: the event sequence the manifest had reached when it was written.
- `active_writer_token` plus `writer_claimed_at`: writer fencing.

Other fields make guards resumable. `step`, `repeat_count`, and `last_action_fingerprint` keep the repetition guard alive across resume. `pending_action` preserves an approval prompt that was interrupted. `active_wall_time_seconds` and `active_started_at` keep the wall-time budget cumulative, so a resumed run does not get a fresh full budget.

`messages` and `approval_history` are tuples, matching `ContractModel(frozen=True)`. If state changes, Looplane writes a new manifest rather than mutating the old one.

## Writer lease: `fcntl.flock` is the fence

`acquire_writer` prevents two processes from writing one session at the same time:

```python
def acquire_writer(self) -> SessionWriterLease:
    if self.run_dir.is_symlink():
        raise SessionValidationError("session run directory cannot be a symlink")
    self.run_dir.mkdir(parents=True, exist_ok=True)
    flags = os.O_CREAT | os.O_RDWR
    if hasattr(os, "O_NOFOLLOW"):
        flags |= os.O_NOFOLLOW
    descriptor = os.open(self.run_dir / ".writer.lock", flags, 0o600)
    try:
        fcntl.flock(descriptor, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError as exc:
        os.close(descriptor)
        raise SessionBusyError("session already has an active writer") from exc
    token = uuid4().hex
    os.ftruncate(descriptor, 0)
    os.write(descriptor, f"pid={os.getpid()} token={token}\n".encode())
    if self.durable:
        os.fsync(descriptor)
    return SessionWriterLease(self.run_dir.resolve(), token, descriptor)
```

`fcntl.flock` is advisory, but the descriptor stays open inside `SessionWriterLease` until the run's `finally` block releases it. A second process trying to acquire the same `.writer.lock` gets `SessionBusyError`.

`O_NOFOLLOW` and the explicit symlink check block symlink tricks on the run directory and lock file. `SessionStore.save` also checks both the in-memory manifest token and the on-disk manifest token against the lease token before writing, so a live lease is not the only defense.

## Why `tool.started` cannot auto-resume

`claim_and_validate_resume` is the recovery core:

```python
async def claim_and_validate_resume(
    self, lease: SessionWriterLease, *, allow_terminal: bool = False
) -> tuple[SessionManifest, TaskContract]:
    manifest = await self.claim(lease)
    task = await self._validate_request(manifest)
    actual_last, last_event_type = await self._validate_events(manifest)
    manifest_was_ahead = manifest.last_event_sequence == actual_last + 1
    if manifest_was_ahead:
        manifest = manifest.model_copy(update={"last_event_sequence": actual_last})
        manifest = await self.save(manifest, lease)
    if not manifest_was_ahead and last_event_type in {
        "tool.started",
        "verification.started",
    }:
        raise SessionValidationError(
            "session stopped during a side effect; automatic resume cannot prove whether "
            "the action completed"
        )
    return manifest, task
```

`manifest_was_ahead` covers a crash after the manifest commit but before the JSONL append. If the manifest says it reached sequence 42 and JSONL ends at 41, Looplane can move the manifest back to 41 and continue. No side effect has been proven to start.

The inverse is not safe. If JSONL ends at `tool.started` or `verification.started`, the side effect may or may not have completed. The state cannot prove which. Retrying could duplicate a write or rerun a command after a partial side effect. Looplane hard-fails and asks the user to decide.

For production recovery, duplicated side effects are worse than a stuck run.

## The event log now supports replay and fork

The early implementation treated `events.jsonl` primarily as an audit trail. `session_replay.py` now provides a deterministic reducer that validates run IDs, duplicate sequences, JSONL bounds, and text bounds before producing canonical replay state. The CLI exposes `looplane sessions --replay`, `--replay-json`, and `--fork-from-event ... --sequence ...`. A fork seed describes only state proven before the chosen sequence. It does not rerun old tools, and continuing work prepares a new workspace instead of secretly rewinding the old one.

This sharpens the split: the manifest remains the authority for what happens next, while the event log becomes machine-reducible history rather than human-only audit. It does not erase the hard-fail boundary. A log ending inside an uncertain side effect, carrying duplicate sequences, or drifting between run IDs is rejected instead of being normalized into a plausible story. Server-hosted replay, complete redaction/deduplication, and live production traces remain open validation work.

## State-first is the result of the file semantics

Looplane is not state-first because it chose the phrase first. It becomes state-first because atomic state and append-only audit have different responsibilities:

- `events.jsonl` records what has happened. It is append-only, but it does not know what the next action should be.
- `session.json` records current state. It is atomically replaceable, but it does not explain how the state was reached.

Resume combines them. The manifest supplies the state of record; events supply the history of record. Looplane reconciles `manifest.last_event_sequence` against the event log and uses the last event type to decide whether automatic resume is valid.

The trade-off is that `session.json` can grow. Messages and approval history are stored in the manifest. For Looplane, that cost is acceptable because a single run is bounded by `max_steps` and manifest writes are simpler than reconstructing state from a long event stream.

## The trade-off

State-first journaling is not extra insurance. It is a forced split between audit and control. Append-only and atomic-replace files have opposite write semantics; putting both responsibilities in one file would make recovery less precise.

This is why the current TUI and session tooling can exist. `/resume` does not infer state from screen text. `/history` is not a vendor transcript replay. `looplane sessions` does not scan temporary logs. They all read versioned `session.json` and append-only events. External CLI vendor session IDs do not become Looplane's source of truth; Looplane stores the state, patch, usage, and event sequence that it can validate.

This lifecycle stops at the fork boundary; it does not extend into an SDK facade or WebSocket conversation ownership. The [next article](/posts/tech/2026-08-30-looplane-context-compaction-en) covers context pressure, compaction, and reinjection: how a long conversation preserves decisions and workspace state as it approaches its limit. SDK and embedding boundaries remain in order 17.

---

## References

- [Looplane official repo](https://github.com/vincentxuu/looplane) -- the ground truth for all code references in this article
- [Looplane `session_replay.py` at 2ed5efb](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/looplane/session_replay.py) -- deterministic replay reducer and fork seeds
- [Looplane M3 docs](https://github.com/vincentxuu/looplane/blob/main/docs/stages/m3-reliable-editing-real-provider-eval.md) -- official milestone notes for checkpoint and resume
- [Linux `flock(2)` advisory locks](https://man7.org/linux/man-pages/man2/flock.2.html) -- the locking semantics behind writer leases
- [Linux `open(2)` and `O_APPEND`](https://man7.org/linux/man-pages/man2/open.2.html) -- append behavior
- [SQLite WAL mode](https://www.sqlite.org/wal.html) -- a useful conceptual comparison for append-ahead recovery
- [Crash-only software](https://lwn.net/Articles/191059/) -- recovery-oriented design background
- [Pydantic v2 strict mode](https://docs.pydantic.dev/latest/concepts/strict_mode/) -- frozen model and `extra=forbid` behavior
- [Linux `fsync(2)`](https://man7.org/linux/man-pages/man2/fsync.2.html) -- durability behavior
