---
title: "Rivumi's provider-neutral agent loop: why the model is a component, not the orchestrator"
date: 2026-08-23
category: tech
type: deep-dive
tags: [rivumi, coding-agent, ai-agent, python, llm]
lang: en
tldr: "Rivumi is a Python-first coding agent. Its central claim is that the loop belongs to the harness, not to the model: `ModelProvider` is a Protocol, and OpenAI-compatible, OpenAI Responses, Anthropic, Gemini, Workers AI, and scripted adapters are only protocol boundaries. `AgentRunner` owns step, repetition, and wall-time guards, while deterministic rules such as path allowlists, argv, process groups, token budgets, and verification gates live in Python code, not in prompts."
description: "A deep dive into Rivumi's provider-neutral loop design: AgentRunner step, repetition, and wall-time guards, the ModelProvider Protocol, immutable ContractModel values, and the architectural split from Claude Code, Codex, Aider, and mini-SWE-agent."
series:
  name: "Rivumi 架構拆解"
  order: 1
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-23-rivumi-provider-neutral-agent-loop)

[Rivumi](https://github.com/vincentxuu/rivumi) is a Python-first coding agent. Its author describes it as a provider-neutral coding-agent harness. This eight-part series opens it up piece by piece. The first and most important claim is simple: **the agent loop belongs to the harness, not to the model**.

The model is a callable component, not the orchestrator. OpenAI-compatible, OpenAI Responses, Anthropic, Gemini, Workers AI, and scripted models are protocol adapters under the `ModelProvider` Protocol. Ollama and self-hosted vLLM use the OpenAI-compatible loopback or custom-endpoint path. Deterministic rules such as path allowlists, strict argv handling, process-group timeouts, token, step, and wall-time budgets, and verification gates live in Python code, not in a prompt.

Once that assertion is clear, Rivumi's other decisions start to connect: why the source repository is never edited, why the disposable clone must use detached HEAD, why `LocalGitWorkspace` is not an OS sandbox, and why a run is not complete until verification passes.

## Why the loop must be provider-neutral

Most coding-agent loops look roughly like this:

```
loop:
  prompt = build_prompt(history, tools)
  response = provider.complete(prompt)   # the model decides what happens next
  for tool_call in response.tool_calls:
      result = execute(tool_call)
      history.append(result)
  if response.is_final: break
```

That pattern gives control of the loop to the model. The model decides when to stop, which tool to call, and whether verification is necessary. It works on small fixtures, but it breaks down in real projects:

- **The model can declare success too early**: "fixed" is not evidence. The test exit code decides whether a patch works.
- **The model can repeat the same action**: calling the same failing `apply_patch` three times burns tokens and patch budget.
- **The model can forget the budget**: raw tool output gets poured back into the next prompt until the context collapses.
- **The model can route around the sandbox**: if the loop exposes an ordinary shell, prompt injection can turn into arbitrary file reads.

Rivumi moves those decisions out of the prompt and into `AgentRunner`. The contract with the model is narrower: **give me tool calls; I will run them; I will feed observations back into history; when you stop calling tools, I will run verification before I mark the run complete.**

## AgentRunner: three guards and one run

The loop entrypoint is `AgentRunner.run()` in `src/rivumi/loop.py`, about 340 lines of code. A run has three deterministic guards:

- **Step guard**: `while self._step < self.task.limits.max_steps`, with a default of 12 steps.
- **Repetition guard**: `_record_fingerprint(call)` detects the same tool call three times in a row and hard-fails with `terminal_reason="repeated_action"`.
- **Wall-time guard**: the runner computes `deadline = monotonic + (wall_time_budget - already_active_wall_time)`, calls `self._remaining(deadline)` before every await, and returns `RunStatus.FAILED` with `terminal_reason="wall_time_exceeded"` on timeout.

The shape of `run()` looks like this, excerpted from `loop.py:707-1051`:

```python
async def run(self) -> RunResult:
    self._run_started_monotonic = time.monotonic()
    deadline = self._run_started_monotonic + (
        self.task.limits.wall_time_seconds - self._active_wall_time_base
    )
    try:
        if not self.allow_unsafe_local_exec and not self._interactive_approvals:
            raise UnsafeLocalExecutionError(
                "local verification executes repository code without an OS sandbox; "
                "set allow_unsafe_local_exec=True only for a trusted repository"
            )
        if not self.model.capabilities.tool_calling:
            raise ValueError(
                f"model {self.model.provider_name}/{self.model.model_id} "
                "does not advertise tool calling"
            )
        # ... new run: write manifest, prepare disposable workspace, initialize messages ...
        while self._step < self.task.limits.max_steps:        # step guard
            if self._cancel_requested.is_set(): ...
            try:
                remaining = self._remaining(deadline)         # wall-time guard
            except TimeoutError:
                return await self._finish(
                    status=RunStatus.FAILED,
                    terminal_reason="wall_time_exceeded", ...)
            self._step += 1
            turn = await self._complete_model_or_cancel(remaining)
            if turn is None: return await self._finish(... CANCELLED ...)
            self._messages.append(turn.as_message())
            if turn.tool_calls:
                for call in turn.tool_calls:
                    if self._record_fingerprint(call):        # repetition guard
                        return await self._finish(
                            status=RunStatus.FAILED,
                            terminal_reason="repeated_action", ...)
                    # ... approval, execution, observation ...
                continue
            # No tool calls: run verification.
            outcomes = await self._verify_all(deadline)
            if all(outcome.ok for outcome in outcomes):
                return await self._finish(status=RunStatus.COMPLETED, ...)
            # Otherwise feed the failure back into messages and let the model repair.
            ...
        return await self._finish(
            status=RunStatus.FAILED,
            terminal_reason="max_steps_exceeded", ...)
    except ProviderError as exc: ...
    finally: ...
```

Three details matter. First, **tool calls never finish the loop**. Verification only starts when the model stops emitting tool calls. Second, failed verification output is fed back as a user message marked as untrusted test output, so the model gets another repair turn, but repeated fingerprints still hard-fail. Third, every terminal path has an explicit `terminal_reason`: `verified`, `wall_time_exceeded`, `max_steps_exceeded`, `repeated_action`, `user_cancelled`, or a provider-specific reason. There is no silent success.

## Repetition detection: hash plus count, not prompt text

The repetition guard is one of the most useful details to inspect. In `loop.py:517-534`:

```python
@staticmethod
def _fingerprint(call: ToolCall) -> str:
    payload = json.dumps(
        {"name": call.name, "arguments": call.arguments},
        ensure_ascii=False, sort_keys=True, separators=(",", ":"),
    ).encode()
    return hashlib.sha256(payload).hexdigest()

def _record_fingerprint(self, call: ToolCall) -> bool:
    fingerprint = self._fingerprint(call)
    if fingerprint == self._last_fingerprint:
        self._repeat_count += 1
    else:
        self._last_fingerprint = fingerprint
        self._repeat_count = 1
    return self._repeat_count >= 3
```

`sort_keys=True` and `separators=(",", ":")` normalize the JSON. If the model writes `{"a": 1, "b": 2}` as `{"b":2,"a":1}`, Rivumi still treats it as the same call. SHA-256 is used because the fingerprint is serialized into `checkpoint.json` and the manifest; a stable hash is easier to persist than ad hoc equality logic.

The counter lives across steps, so the third appearance of the same tool call across multiple turns is enough to stop the run.

This belongs in Python for the same reason a rate limiter or retry budget belongs in code: **the controlled actor should not be allowed to rewrite the control rule**. A prompt instruction such as "stop after three repeats" can be forgotten, rationalized away, or ignored under pressure. `_record_fingerprint` cannot.

## ModelProvider: one contract for multiple protocol adapters

In `models.py:64-79`:

```python
@runtime_checkable
class ModelProvider(Protocol):
    provider_name: str
    model_id: str
    protocol: ModelProtocol
    capabilities: ModelCapabilities

    async def complete(
        self,
        messages: Sequence[ConversationItem],
        tools: Sequence[ToolDefinition] = (),
    ) -> ModelTurn: ...

    async def aclose(self) -> None: ...
```

`complete()` is non-streaming. A `ModelTurn` returns content, tool calls, usage, and finish reason all at once. That is deliberate. Rivumi centralizes output accumulation and truncation in the loop with `bounded_text(turn.content, 2_000)`, rather than making every adapter solve streaming chunk behavior independently. A future streaming path can be added behind `ModelCapabilities.streaming=True`, but the default boundary remains non-streaming.

`protocol` is a `ModelProtocol` enum, separate from provider identity:

```python
class ModelProtocol(StrEnum):
    SCRIPTED = "scripted"
    OPENAI_CHAT = "openai_chat"
    OPENAI_CODEX_RESPONSES = "openai_codex_responses"
    ANTHROPIC_MESSAGES = "anthropic_messages"
    GEMINI_GENERATE_CONTENT = "gemini_generate_content"
    WORKERS_AI_RUN = "workers_ai_run"
```

That means an OpenAI-compatible adapter can serve Ollama, self-hosted vLLM, the official API, or a custom endpoint. The adapter translates provider-specific request and response shapes into canonical `ConversationItem` and `ModelTurn` values; the rest of the loop runs the same way.

Errors are canonical too. `ProviderError` carries a `ProviderErrorKind`: `RETRYABLE`, `AUTH`, `RATE_LIMIT`, `INVALID_REQUEST`, or `PROVIDER`, plus a `retryable` property. HTTP 401 becomes auth, 429 becomes rate limit, 5xx becomes retryable, and Workers AI code 7505 becomes rate limit. `AgentRunner` catches `ProviderError`; it does not need to know whether the lower layer used the `openai` SDK, Anthropic's wire protocol, or a raw `httpx` call.

## ContractModel: immutable values with extra=forbid

Cross-component values inherit from `ContractModel` in `src/rivumi/contracts.py`:

```python
class ContractModel(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
```

`extra="forbid"` raises on undeclared fields instead of silently ignoring them. `frozen=True` prevents mutation after construction. Together they make values such as `Message`, `ToolObservation`, and `VerificationOutcome` safe to put into lists, sets, checkpoints, and manifests without worrying that another layer will mutate them behind the runner's back.

`TaskContract` captures the same idea:

```python
class TaskContract(ContractModel):
    repository: Path
    instruction: str = Field(min_length=1)
    allowed_paths: tuple[str, ...] = Field(min_length=1)
    verification: tuple[VerificationCommand, ...] = Field(min_length=1)
    limits: Limits = Field(default_factory=Limits)
    task_id: str = Field(default_factory=lambda: uuid4().hex, min_length=1)
    base_sha: str | None = None
```

`allowed_paths` and `verification` are tuples, not lists. `VerificationCommand.argv` is also a tuple, validated to reject empty strings, NUL bytes, and non-strict strings. Combined with runtime `shell=False`, Rivumi can keep the promise that verification commands are exact argv allowlist entries, not shell-escaped strings.

## Limits live in code, not in prompts

```python
class Limits(ContractModel):
    max_steps: int = Field(default=12, ge=1)
    wall_time_seconds: float = Field(default=900.0, gt=0)
    max_tool_output_bytes: int = Field(default=200_000, ge=1)
    max_patch_bytes: int = Field(default=100_000, ge=1)
```

These are not suggestions shown to the model. They are guards that the runner enforces: `max_steps` controls the outer loop, `wall_time_seconds` creates the deadline, `max_tool_output_bytes` bounds single tool output, and `max_patch_bytes` caps accumulated patch size.

The reason is the same as in production rate limiting: **a budget cannot be controlled by the thing being budgeted**. "Please finish in 12 steps" is negotiable prompt text. `terminal_reason="max_steps_exceeded"` is not.

## How this differs from Claude Code, Codex, Aider, and mini-SWE-agent

Placed on the coding-agent spectrum, Rivumi's position is clear:

| Project | Loop ownership | Provider boundary | Verification gate |
|---|---|---|---|
| **Rivumi** | Its own `AgentRunner` | Canonical `ModelProvider` Protocol, multiple protocol adapters | Reruns all `verification` argv before `COMPLETED` |
| **Claude Code** | Bound to Anthropic's stack | Mainly Anthropic | Model declaration plus internal heuristics |
| **Codex CLI** | OpenAI Responses plus its own loop | Mainly OpenAI, OAuth subscription | Model declaration plus CLI sandbox exit codes |
| **Aider** | Direct model API loop | Multiple providers, adapter-specific | Relies on the model to call lint and tests |
| **mini-SWE-agent** | Minimal Python loop | Multiple providers | Similar to Aider |

The essential split is this: **is the loop a public abstraction or a private implementation detail, and is verification a Python guard or a model self-report?** Rivumi chooses the former. That lets it add OpenAI-compatible, OpenAI Responses, Anthropic, Gemini, Workers AI, scripted fixtures, and loopback endpoints such as Ollama or vLLM without changing the loop. Official Codex CLI, Claude Code, OpenCode, Pi, and OMP stay behind the external runtime boundary (`ExternalCodingRunner`) instead of being mixed into `ModelProvider`.

## Overall architecture

```
TaskContract ──┐
               ▼
        AgentRunner ─── events.jsonl / checkpoint.json / request.json
        │      │  \
        │      │   └── ModelProvider (Protocol)
        │      │         ├─ Scripted (deterministic fixture)
        │      │         ├─ OpenAI-compatible (Ollama / vLLM / official / custom endpoint)
        │      │         ├─ OpenAI Responses
        │      │         ├─ Anthropic (Messages API)
        │      │         ├─ Gemini (generateContent)
        │      │         └─ Workers AI (run endpoint)
        │      │
        │      └──── ToolExecutor -> SafePathPolicy -> LocalGitWorkspace
        │                          ├─ list_files / read_file / search_text
        │                          ├─ apply_patch (unified diff + accumulated cap)
        │                          ├─ replace_text (exact string replacement)
        │                          ├─ run_check (allowlisted argv)
        │                          └─ git_diff
        │
        └────── verification: rerun all task.verification argv; all must pass before COMPLETED
```

## The trade-off

Rivumi is not betting on one model being strongest. It is betting that the shape of the loop is an independent, auditable, testable engineering problem. The three `AgentRunner` guards, the transport-decoupled `ModelProvider` Protocol, immutable `ContractModel` values, and code-enforced `Limits` all follow from that bet.

The cost is obvious: more code, canonical translation for every provider adapter, and no free reuse of every advanced streaming or function-calling feature exposed by model SDKs. The return is also clear: **one loop can serve five transports, and adding the sixth does not require rewriting the core**. The same verification gate can run after an external runtime such as Codex CLI or Claude Code CLI. The same `RunResult` shape works for every provider, so UI, CI, and the Cloudflare Worker do not need provider-specific branches.

The next article opens `LocalGitWorkspace` and the disposable clone boundary: why the source repository must not be edited, why HEAD must be detached, and why this "sandbox" is not really an OS sandbox.

---

## References

- [Rivumi official repo](https://github.com/vincentxuu/rivumi) -- the ground truth for all code references in this article
- [Rivumi M1 docs](https://github.com/vincentxuu/rivumi/blob/main/docs/stages/m1-local-harness.md) -- the official design note for the agent loop
- [mini-SWE-agent](https://github.com/SWE-bench/mini-SWE-agent) -- the source of the "Model / Agent / Environment" Python boundary Rivumi explicitly references
- [Aider](https://aider.chat/) -- a reference point for unified diff and Git as review boundaries
- [SWE-ReX](https://github.com/SWE-bench/SWE-ReX) -- a reference point for separating agent and runtime
- [OpenAI Codex CLI](https://github.com/openai/codex) -- a reference point for separating sandbox capability from human approval
- [Pydantic v2 -- strict mode and frozen models](https://docs.pydantic.dev/latest/concepts/strict_mode/) -- documentation for the behavior behind `ContractModel`
