---
title: "Rivumi's TUI and CLI ergonomics: approval flow, geometry tests, resume, and daily-driver UX"
date: 2026-08-23
category: tech
type: deep-dive
tags: [rivumi, coding-agent, cli, tui, ux, terminal]
lang: en
tldr: "Rivumi splits daily-driver UX into two modes: `interactive` with a TTY, TUI, and approval prompts, and `headless` for CI or scheduled runs with plain stdout. Approval is not a hard-coded yes/no: `ApprovalDecision` has ALLOW_ONCE, ALLOW_SESSION, DENY, and CANCEL, while `TTYApprovalPolicy` supports session-scoped grants. The current TUI is runtime-first, with Rivumi Agent, Claude Code, Codex CLI, OpenCode, Pi, and OMP selection, statusline usage, `/usage`, `/context`, `/model`, `/new`, `/resume`, and `/history`."
description: "A deep dive into Rivumi's TUI and CLI design: _terminal_supports_tui, _stdin_is_tty mode routing, TTYApprovalPolicy session-scoped grants, four ApprovalDecision values, AgentRunner.resume state restoration, lazy imports, and screenshot-backed geometry tests."
series:
  name: "Rivumi 架構拆解"
  order: 7
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-23-rivumi-tui-cli-ergonomics)

The first six articles covered how the loop runs, how the workspace is protected, and how verification is enforced. This article looks at how that system becomes a daily-driver CLI. Approval prompts cannot spam the user. Resume cannot create panic. Wide and narrow terminals both need to work.

The module docstring in `src/rivumi/cli.py` is direct: the interactive CLI and headless harness are two modes over the same `AgentRunner`. The core assertion is: **`AgentRunner` is a pure async runner; the CLI layer turns it into a tool humans can use.** The loop itself does not know a TTY exists.

## Two modes, split by `_stdin_is_tty()`

`cli.py:230-240` defines the basic routing checks:

```python
def _stdin_is_tty() -> bool:
    return sys.stdin.isatty()


def _terminal_supports_tui() -> bool:
    return (
        _stdin_is_tty()
        and sys.stdout.isatty()
        and os.environ.get("TERM", "").lower() != "dumb"
        and (os.environ.get("RIVUMI_NO_TUI") or os.environ.get("PCA_NO_TUI")) != "1"
    )
```

The checks separate three questions: is stdin a TTY, is stdout also a TTY, and has the user disabled the TUI through `RIVUMI_NO_TUI=1` or the legacy `PCA_NO_TUI=1`? If input is piped or output is redirected, Rivumi should not start an interactive TUI.

The routing centers on `headless = print_mode or not _stdin_is_tty()`. `--print` / `-p` forces non-interactive output even when a TTY is available, which is useful for CI-adjacent usage.

`interactive_setup` is the first-run path. When no config exists and a TTY is available, Rivumi offers provider setup: Ollama local, OpenAI or compatible API, Anthropic, Gemini, and Workers AI. It can probe local Ollama models and write `~/.config/rivumi/config.json`. The README's daily-use shape is `rivumi [PROMPT] | rivumi -p [PROMPT] | rivumi exec [PROMPT] | rivumi resume`.

## ApprovalDecision is not yes/no

`approvals.py:29-33` defines four decisions:

```python
class ApprovalDecision(StrEnum):
    ALLOW_ONCE = "allow_once"
    ALLOW_SESSION = "allow_session"
    DENY = "deny"
    CANCEL = "cancel"
```

`ALLOW_ONCE` approves one action. `ALLOW_SESSION` grants the same effect class for the rest of the session. `DENY` refuses the action but keeps the run alive by sending a denial observation back to the model. `CANCEL` hard-stops the run.

`TTYApprovalPolicy.decide()` is the prompt users see:

```python
async def decide(self, request: ApprovalRequest) -> str:
    if request.effect == ToolEffect.READ or request.effect in self._grants:
        return ApprovalDecision.ALLOW_ONCE
    if not self._input.isatty():
        return ApprovalDecision.DENY

    self._output.write(
        f"\nApproval required: {request.effect.value} ({request.reason.value})\n"
    )
    if request.preview:
        self._output.write(f"{request.preview}\n")
    self._output.write("Allow? [y] once / [a] session / [n] deny / [c] cancel: ")
    self._output.flush()
    answer = self._input.readline().strip().lower()
    decision = {
        "y": ApprovalDecision.ALLOW_ONCE,
        "yes": ApprovalDecision.ALLOW_ONCE,
        "a": ApprovalDecision.ALLOW_SESSION,
        "always": ApprovalDecision.ALLOW_SESSION,
        "c": ApprovalDecision.CANCEL,
        "cancel": ApprovalDecision.CANCEL,
    }.get(answer, ApprovalDecision.DENY)
    if decision == ApprovalDecision.ALLOW_SESSION:
        self._grants.add(request.effect)
    return decision
```

Three details matter:

- `READ` effects never prompt. `list_files`, `read_file`, `search_text`, and `git_diff` are pure reads.
- `ALLOW_SESSION` grants by effect class, so a user can allow all `MODIFY` actions for one session without being asked every time.
- Non-TTY input returns `DENY` rather than blocking forever in CI.

`TOOL_EFFECTS` maps every tool to `READ`, `MODIFY`, or `EXECUTE`. A new tool without explicit effect classification fails closed.

`HeadlessApprovalPolicy` implements the same Protocol for CI and automation. It can allow modify while keeping execute tied to `allow_unsafe_local_exec`.

## Resume restores in-memory runner state

`rivumi resume <session>` is a Typer command:

```python
@app.command()
def resume(
    session: Annotated[str, typer.Argument(help="Session id or 'last'")] = "last",
    run_root: Annotated[Path, typer.Option("--run-root")] = DEFAULT_RUN_ROOT,
    api_url: Annotated[...],
    ...
) -> None:
    ...
    try:
        run_dir = _resolve_resume_dir(run_root, session)
        manifest = asyncio.run(SessionStore(run_dir).load())
        _, _, api_url = _resolve_cli_settings(
            provider=manifest.provider_name,
            ...
        )
        ...
        result = asyncio.run(
            _resume_and_close(
                run_dir,
                selected_model,
                approval_policy=TTYApprovalPolicy(sys.stdin, sys.stderr),
                ...
            )
        )
```

Resume must use the same provider, model, and protocol as the persisted session. `AgentRunner.resume()` rejects mismatches because the saved conversation belongs to a specific provider/protocol boundary.

The resume constructor restores runner internals from the manifest:

```python
manifest, task = await store.claim_and_validate_resume(lease)
if (
    manifest.provider_name != model.provider_name
    or manifest.model_id != model.model_id
    or manifest.protocol != str(model.protocol)
):
    raise SessionValidationError(...)
runner = cls(task, model, resolved.parent, run_id=resolved.name, ...)
runner._session_store = store
runner._session_lease = lease
runner._manifest = manifest
runner._sequence = manifest.last_event_sequence + 1
runner._messages = list(manifest.messages)
runner._usage = manifest.usage
runner._step = manifest.step
runner._last_fingerprint = manifest.last_action_fingerprint
runner._repeat_count = manifest.repeat_count
runner._last_verification = manifest.verification
runner._run_dir_initialized = True
workspace = resolved / "workspace"
runner._executor = ToolExecutor(...)
runner._resume_ready = True
return runner
```

`_resume_ready = True` tells `AgentRunner.run()` to skip fresh workspace preparation and continue from persisted messages. Event sequence, usage, step count, repetition fingerprint, and verification state all continue from the manifest.

Before the UI resumes, `claim_and_validate_resume` reconciles the manifest with `events.jsonl`. If the session stopped at `tool.started` or `verification.started`, it hard-fails instead of pretending automatic recovery is safe.

## Lazy imports protect startup time

`cli.py:21-25` documents a deliberate import policy:

```python
# NOTE: heavy, route-specific modules (provider SDKs, vendor backends, gateway,
# Textual, conversation controllers, runtime discovery) are imported lazily inside
# the command/helper that needs them so `rivumi --help`, `config`, and other
# lightweight routes never load the OpenAI/Anthropic SDKs, uvicorn, Textual, or
# external runtime implementations. See docs/startup-performance-playbook.md.
```

Heavy modules such as OpenAI SDK, Anthropic SDK, Textual, uvicorn, and external runtime implementations are imported inside the commands that need them. `rivumi --help`, `rivumi config --show`, and `rivumi status` should not pay that cold-start cost.

That matters for daily-driver UX. A help command that stalls for hundreds of milliseconds before printing text feels broken, even if the agent loop itself is excellent.

## TUI layout needs geometry tests and screenshots

README requires this workflow for TUI layout changes:

```bash
uv run pytest tests/test_tui.py -q
uv run python scripts/render_tui_screenshot.py --width 120 --height 36 --name wide
uv run python scripts/render_tui_screenshot.py --width 60 --height 22 --name narrow
uv run python scripts/render_tui_screenshot.py --state thinking --name loading
for frame in 0 1 2 3 4 5; do
  uv run python scripts/render_tui_screenshot.py \
    --state thinking --loading-frame "$frame" --name "loading-frame-$frame"
done
```

This is not cosmetic. It verifies:

- geometry behavior across terminal sizes
- a wide 120x36 layout
- a narrow 60x22 layout
- the thinking/loading state
- each loading animation frame

Unit tests cannot reliably catch a 60-column terminal pushing the statusline out of view. Rendered artifacts in `.artifacts/tui/*.png` make TUI review concrete.

## Overall architecture

```
rivumi command (Typer)
├── bare (no subcommand) -> interactive TUI mode
├── rivumi exec <PROMPT> -> headless agent run
├── rivumi run <PROMPT>  -> alias for exec
├── rivumi resume [id]   -> restore non-terminal session
├── rivumi config        -> show / interactive / write CLI config
├── rivumi gateway       -> start ModelGateway on loopback
├── rivumi status        -> list runs in run_root
├── rivumi sessions      -> list resumable / completed sessions
├── rivumi export-otel   -> export run events as OTel-style telemetry
└── interactive runtime selector
    ├── Rivumi Agent
    ├── Claude Code
    ├── Codex CLI
    ├── OpenCode
    ├── Pi
    └── OMP

AgentRunner (pure async) <- ApprovalPolicy (TTY | Headless | Callback)
       ↑
       └── EventSink -> CompositeEventSink(JsonlEventSink, TUI sink)
                      └── TUI slash commands: /usage /context /model /new /resume /history
```

## The trade-off

The CLI/TUI layer's core claim is: **`AgentRunner` is pure async; the harness does not know about the terminal.** Daily-driver UX lives in `cli.py`, `approvals.py`, and the TUI module. Approval style, resume presentation, terminal layout, onboarding, and config storage are outside the loop.

The cost is code volume and edge cases. `cli.py` is larger than `loop.py`, and onboarding, resume, and TUI rendering all need their own tests. The return is that `AgentRunner` can be used by `AgentRunner.resume()`, `ModelGateway`, and the Cloudflare Worker without carrying an "interactive mode" branch. Human decisions collapse into the `ApprovalPolicy` Protocol; the implementation can be TTY prompt, callback, or headless policy.

The next article covers the Cloudflare deployment slice: how the same AgentRunner runs in a Sandbox container while provider credentials stay in the Worker control plane.

---

## References

- [Rivumi official repo](https://github.com/vincentxuu/rivumi) -- the ground truth for all code references in this article
- [Rivumi README setup workflow](https://github.com/vincentxuu/rivumi#set-up-with-uv) -- geometry-test and screenshot-render workflow
- [Typer](https://typer.tiangolo.com/) -- the CLI routing framework used by `cli.py`
- [Textual](https://textual.textualize.io/) -- the TUI framework behind Rivumi's layout and async UI
- [Python asyncio event loop](https://docs.python.org/3/library/asyncio-eventloop.html) -- async runtime background
- [PEP 492](https://peps.python.org/pep-0492/) -- async/await language background
- [Rich](https://rich.readthedocs.io/) -- terminal rendering background
- [Pydantic v2 strict mode](https://docs.pydantic.dev/latest/concepts/strict_mode/) -- frozen and `extra=forbid` behavior
