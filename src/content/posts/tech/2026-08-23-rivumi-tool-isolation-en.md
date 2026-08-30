---
title: "Rivumi's tool isolation: path allowlists, strict argv, process groups, and credential-free subprocesses"
date: 2026-08-30
category: tech
type: deep-dive
tags: [rivumi, coding-agent, ai-agent, python, sandbox]
lang: en
tldr: "This article follows one Rivumi tool call through its mechanical execution boundary: `SafePathPolicy` for paths and symlink escape, fixed argv with `shell=False`, a sanitized subprocess environment, read-version hashes plus atomic replace for writes, and process-group cleanup at timeout. Permission policy, OS containment, and tool programs are reserved for later articles."
description: "A deep dive into Rivumi's tool isolation design: SafePathPolicy path allowlists, strict VerificationCommand argv, credential-free sanitized_subprocess_env, process-group timeouts, _BoundedCapture output caps, and why prompt injection has little leverage at this layer."
series:
  name: "Rivumi Architecture Notes"
  order: 8
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-23-rivumi-tool-isolation)

The previous article separated the native loop from the external CLI runtime. Either lane eventually reaches the same question: how does a path, argv, or write request land safely in a workspace? This article follows only Rivumi's mechanical execution boundary: path, argv, environment, atomic writes, and timeout cleanup. Whether a call should be allowed, asked, or denied belongs to order 9; OS containment belongs to order 10; programs and transactions belong to order 11.

## Why the tool boundary matters more than the model

Models can be prompt-injected. Filesystem APIs cannot. A subprocess can be put in a process group and killed. The most damaging failure mode is not "the model says something wrong"; it is "the injected model asks the system to read `~/.ssh/id_rsa` or run `curl ... | sh`."

Seven single-step native tools are enough to explain this executor: `list_files`, `read_file`, `search_text`, `replace_text`, `apply_patch`, `run_check`, and `git_diff`. The first three read files, two edit tools write, `run_check` executes predeclared commands, and `git_diff` reads the workspace diff. They share `SafePathPolicy` and bounded execution contracts. Higher-level authority policy, tool programs, MCP, and subagent orchestration are outside this article's data flow.

## Path layer: SafePathPolicy and symlink escape detection

`SafePathPolicy` takes a workspace root and an `allowed_paths` tuple, then resolves model-supplied relative paths into "inside the workspace, inside the allowlist, not `.git`, and not escaping through a symlink." The first wall is `_validate_relative_input` in `policy.py:42-57`:

```python
@staticmethod
def _validate_relative_input(path: str | Path) -> str:
    raw = str(path)
    if not raw or "\x00" in raw:
        raise PathPolicyError("path must be a non-empty relative path")
    if "\\" in raw:
        raise PathPolicyError("backslashes are not accepted in tool paths")

    posix_path = PurePosixPath(raw)
    windows_path = PureWindowsPath(raw)
    if posix_path.is_absolute() or windows_path.is_absolute() or windows_path.drive:
        raise PathPolicyError(f"absolute paths are forbidden: {raw!r}")
    if ".." in posix_path.parts:
        raise PathPolicyError(f"path traversal is forbidden: {raw!r}")
    if any(part == ".git" for part in posix_path.parts):
        raise PathPolicyError("the workspace .git directory is never tool-accessible")
    return raw
```

Those checks block NUL-byte tricks, Windows path injection, absolute paths, directory traversal, and `.git` access before the filesystem is touched.

`resolve()` handles the subtler case where a symlink inside the workspace points outside it:

```python
def resolve(
    self,
    path: str | Path,
    *,
    allow_workspace_root: bool = False,
) -> Path:
    raw = self._validate_relative_input(path)
    candidate = (self.workspace_root / raw).resolve(strict=False)
    try:
        relative = candidate.relative_to(self.workspace_root).as_posix()
    except ValueError as exc:
        raise PathPolicyError(f"path escapes workspace through a symlink: {raw!r}") from exc
    ...
```

Because `Path.resolve(strict=False)` follows symlinks, `workspace/link -> /etc/passwd` cannot pass a naive prefix check. Rivumi checks the resolved path against the resolved workspace root. `_walk_files` also uses `followlinks=False`, so directory walking cannot be pulled outside the workspace by a symlink.

`allowed_paths` matching is segment-aware. `_match_path_glob` treats only a full `**` segment as a cross-directory wildcard:

```python
@staticmethod
def _match_path_glob(relative: str, pattern: str) -> bool:
    """Match path segments; only a complete ``**`` segment crosses directories."""

    path_parts = tuple(PurePosixPath(relative).parts)
    pattern_parts = tuple(PurePosixPath(pattern).parts)

    @cache
    def match(path_index: int, pattern_index: int) -> bool:
        if pattern_index == len(pattern_parts):
            return path_index == len(path_parts)
        current = pattern_parts[pattern_index]
        if current == "**":
            return match(path_index, pattern_index + 1) or (
                path_index < len(path_parts) and match(path_index + 1, pattern_index)
            )
        return (
            path_index < len(path_parts)
            and fnmatch.fnmatchcase(path_parts[path_index], current)
            and match(path_index + 1, pattern_index + 1)
        )

    return match(0, 0)
```

That avoids the common mistake of letting `*` behave like `**`. The contract layer also normalizes patterns and rejects absolute paths, `..`, trailing slashes, and NUL bytes before the policy is even built.

## argv layer: tuple allowlists and `shell=False`

The second layer is `VerificationCommand`:

```python
class VerificationCommand(ContractModel):
    """An exact argv allowlist entry; it is never interpreted by a shell."""

    name: str = Field(min_length=1)
    argv: tuple[str, ...] = Field(min_length=1)
    timeout_seconds: float = Field(default=300.0, gt=0)

    @field_validator("argv")
    @classmethod
    def validate_argv(cls, value: tuple[str, ...]) -> tuple[str, ...]:
        if any(not part or "\x00" in part for part in value):
            raise ValueError("verification argv entries must be non-empty and NUL-free")
        return value
```

The important words are `tuple`, `min_length=1`, and NUL-free. Verification commands are immutable argv entries, not shell strings. `ToolExecutor.__init__` then injects the allowed command names into the `run_check` JSON schema as an `enum`, so the model sees `run_check` as "pick one known name." It cannot send `"curl ... | sh"` as a command.

Even if a provider adapter fails to enforce the schema, `ToolExecutor.run_check` looks up the command name in the allowlist again. Execution goes through `run_bounded_command(...)` with `shell=False`, so no byte of the command is parsed as shell syntax.

## Subprocess layer: clean env, process groups, bounded capture

`run_bounded_command` is the common subprocess entrypoint for the base native tool executor, verification, and workspace Git operations. MCP, LSP, TUI sidecars, and conversation runtimes have separate subprocess paths. The common helper strips host credentials, starts a new process group, captures bounded output, and kills the whole process tree on timeout.

`sanitized_subprocess_env` builds from a small allowlist:

```python
_SAFE_ENV_KEYS = {
    "LANG", "LC_ALL", "LC_CTYPE",
    "PATH", "SYSTEMROOT",
    "TEMP", "TERM", "TMP", "TMPDIR", "TZ",
}
_SENSITIVE_ENV_MARKERS = ("API", "AUTH", "CREDENTIAL", "GITHUB", "PASSWORD", "SECRET", "TOKEN")

def sanitized_subprocess_env(*, task_home: Path | None = None) -> dict[str, str]:
    env = {key: value for key, value in os.environ.items() if key in _SAFE_ENV_KEYS}
    env["PATH"] = env.get("PATH", os.defpath)
    env.update(
        {
            "GIT_ASKPASS": "/usr/bin/false",
            "GIT_CONFIG_GLOBAL": os.devnull,
            "GIT_CONFIG_NOSYSTEM": "1",
            "GIT_TERMINAL_PROMPT": "0",
            "PYTHONDONTWRITEBYTECODE": "1",
        }
    )
    ...
    assert not any(marker in key.upper() for key in env for marker in _SENSITIVE_ENV_MARKERS)
    return env
```

This is an allowlist, not a blacklist. `MY_APP_TOKEN`, `ANTHROPIC_API_KEY`, and `GH_TOKEN` never get inherited. `GIT_ASKPASS=/usr/bin/false` and `GIT_TERMINAL_PROMPT=0` prevent credential prompts. Workspace calls also move caches and temp files into `run_dir/.task-env` through `XDG_CACHE_HOME`, `XDG_CONFIG_HOME`, `PIP_CACHE_DIR`, `UV_CACHE_DIR`, and `TMPDIR`.

For timeouts, Rivumi uses `start_new_session=True` and signals the process group:

```python
def _signal_process_group(process: subprocess.Popen[bytes], sig: int) -> None:
    if os.name == "posix":
        with suppress(ProcessLookupError):
            os.killpg(process.pid, sig)
        return
    if process.poll() is None:
        if sig == signal.SIGTERM:
            process.terminate()
        else:
            process.kill()

def _stop_process_tree(process: subprocess.Popen[bytes]) -> None:
    """Best-effort process-tree cleanup, with a real process group on POSIX."""

    _signal_process_group(process, signal.SIGTERM)
    with suppress(subprocess.TimeoutExpired):
        process.wait(timeout=0.5)
    _signal_process_group(process, getattr(signal, "SIGKILL", signal.SIGTERM))
    try:
        process.wait(timeout=1.0)
    except subprocess.TimeoutExpired:
        process.kill()
        process.wait()
```

That matters because test commands often fork children. Killing only the parent process is not enough.

Output is bounded with `_BoundedCapture`, which keeps both head and tail:

```python
class _BoundedCapture:
    """Drain a pipe fully while retaining only bounded head and tail bytes."""

    def __init__(self, max_bytes: int) -> None:
        self.max_bytes = max_bytes
        self._head_limit = max_bytes // 2
        self._tail_limit = max_bytes - self._head_limit
        self._head = bytearray()
        self._tail = bytearray()
        self.total_bytes = 0

    def add(self, chunk: bytes) -> None:
        self.total_bytes += len(chunk)
        remaining_head = self._head_limit - len(self._head)
        if remaining_head > 0:
            self._head.extend(chunk[:remaining_head])
            chunk = chunk[remaining_head:]
        if chunk and self._tail_limit:
            self._tail.extend(chunk)
            if len(self._tail) > self._tail_limit:
                del self._tail[: len(self._tail) - self._tail_limit]
```

Keeping only the tail misses stack-trace headers; keeping only the head misses failure summaries. Keeping both ends gives the model useful signal without letting a subprocess dump megabytes into context. The pipe is still fully drained, so the child process does not deadlock because the retained output is bounded.

## Write layer: read-version hashes and atomic replace

`replace_text` shows the write-side contract:

```python
relative = target.relative_to(self.workspace).as_posix()
read_version = self._read_versions.get(relative)
current_version = hashlib.sha256(original).hexdigest()
if read_version is None:
    raise ToolExecutionError("read_file must be called before replace_text")
if read_version != current_version:
    raise ToolExecutionError("file changed after read_file; read it again before editing")
```

The model must read a file before replacing text in it. `read_file` records the SHA-256 of the bytes it returned; `replace_text` compares that hash with current bytes. If the file changed between read and write, the write is rejected.

The replacement itself writes to a temporary `target.name.rivumi-replace-<uuid>` file, fsyncs it, atomically replaces the target with `os.replace`, then fsyncs the parent directory. It opens with `O_NOFOLLOW` and `O_EXCL`, and rolls back to original bytes if a later step fails.

The last gate is `git ls-files --error-unmatch`: only Git-tracked files can be changed with `replace_text`. New files must go through `apply_patch`, which uses `git add --intent-to-add` so they appear in the reviewable diff.

## Dispatch guard: the model cannot choose the timeout

`ToolExecutor.execute` is the single dispatch entrypoint:

```python
if "timeout_seconds" in call_arguments:
    raise ToolExecutionError("timeout_seconds is controlled by the harness")
if name in {"replace_text", "apply_patch", "run_check", "git_diff"}:
    result = handler(**call_arguments, timeout_seconds=timeout_seconds)
else:
    result = handler(**call_arguments)
```

The model cannot set `timeout_seconds=86400` to route around the harness. Timeout comes from the outer budget, verification command limits, and harness policy. The executor also catches only expected tool-boundary failures. Unexpected bugs do not get silently converted into harmless tool observations.

## Overall architecture

```
                       ┌────────────────────────────────────┐
                       │        AgentRunner (loop.py)       │
                       │  limits + verification-as-gate     │
                       └─────────────────┬──────────────────┘
                                         │
                                         ▼
                       ┌────────────────────────────────────┐
                       │   ToolExecutor.execute(call)       │
                       │   rejects "timeout_seconds" arg    │
                       │   maps name -> handler             │
                       └─────────────────┬──────────────────┘
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        ▼                                ▼                                ▼
┌──────────────┐               ┌─────────────────┐               ┌──────────────────┐
│ SafePathPolicy│              │ replace/apply/   │              │  run_check / git │
│ relative path │◄────────────│   patch policy   │              │  -> run_bounded_ │
│ validation    │              │  + read-version │              │     command      │
│ + segment glob│              │  + atomic write │              │                  │
│ + symlink     │              │  + git-tracked  │              │  shell=False     │
│   escape det. │              │                 │              │  start_new_session│
└──────┬───────┘               └────────┬────────┘              │  + killpg        │
       │                                │                         │  + _BoundedCapture│
       ▼                                ▼                         │                  │
┌──────────────┐               ┌─────────────────┐               │ env: sanitized   │
│ .git always  │               │ read-version    │               │ subprocess env   │
│ blocked      │               │ hash compare    │               │ whitelist+assert │
└──────────────┘               └─────────────────┘               └──────────────────┘
```

## The trade-off

For the seven single-step base tools described here, Rivumi's "the loop belongs to the harness" claim becomes concrete: **each side effect is statically narrowed by Python types and dynamically checked at runtime**. Dynamic MCP capabilities and other subprocess-owning integrations have separate boundaries. The native model sees a filesystem subset, an argv-name allowlist, and bounded credential-free subprocesses.

The external CLI runtime does not remove this principle; it moves the boundary later. Claude Code, Codex CLI, OpenCode, Pi, and OMP may use their own tools inside their own loops, but only inside a disposable clone. When they return to Rivumi, their patch still passes path-bounded audit, binary/symlink/rename/copy checks, final verification, and source-invariant comparison. The Cloudflare slice follows the same shape: Worker ingress validates paths and argv, the Sandbox runs the native bounded toolset, and provider credentials remain in the Worker model proxy.

If this layer holds, prompt injection has less host surface to exploit. It still does not answer who has authority to execute a call or what kernel resources a process can reach. The next layers are [allow/ask/deny permissions](/posts/tech/2026-08-30-rivumi-permission-layering-en), [local OS sandboxing](/posts/tech/2026-08-30-rivumi-local-os-sandbox-en), and [tool programs with rollback-capable transactions](/posts/tech/2026-08-30-rivumi-tool-program-transactions-en). None can be replaced by the path and argv checks described here.

## References

- [Rivumi official repo](https://github.com/vincentxuu/rivumi) -- the ground truth for all code references in this article
- [Rivumi `tools.py` at 2ed5efb](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/tools.py) -- core tools, path-bounded search, atomic writes, and timeout dispatch
- [Rivumi M1 docs](https://github.com/vincentxuu/rivumi/blob/main/docs/stages/m1-local-harness.md) -- harness design notes
- [Pydantic v2 validators](https://docs.pydantic.dev/latest/concepts/validators/) -- behavior behind `VerificationCommand.validate_argv` and `TaskContract.validate_allowed_paths`
- [POSIX `killpg(3)`](https://man7.org/linux/man-pages/man3/killpg.3.html) -- process-group signaling
- [Python `subprocess.Popen`](https://docs.python.org/3/library/subprocess.html#subprocess.Popen) -- `start_new_session` behavior
- [OpenAI Codex CLI](https://github.com/openai/codex) -- a reference point for sandbox capability and human approval
- [SWE-ReX](https://github.com/SWE-agent/SWE-ReX) -- a reference point for separating agent and runtime
- [Aider](https://aider.chat/) -- a reference point for unified diff and Git review boundaries
