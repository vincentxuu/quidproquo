---
title: "Looplane remote execution on Cloudflare: Worker, Sandbox, Capability DO, and durable RunSession"
date: 2026-08-30
category: tech
type: deep-dive
tags: [looplane, coding-agent, cloudflare, workers, durable-objects, sandbox, capability]
lang: en
tldr: "Looplane's old synchronous M6 path completed one real deployed coding run. It has since grown into an asynchronous control plane with RunSession, SSE, approvals, cancellation, and artifacts, but that newer path has not been live-revalidated. Audience-separated HMAC capabilities enter the Sandbox while provider credentials stay in the Worker; this is not production-traffic or SLO proof."
description: "A deep dive into Looplane remote execution on Cloudflare: Worker ingress, Sandbox, Capability DO, durable RunSession, async status, SSE events, approval/cancel/artifact routes, and token-audience boundaries."
series:
  name: "Looplane Architecture Notes"
  order: 19
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-23-looplane-cloudflare-deployment)

The [previous IDE/LSP bridge article](/posts/tech/2026-08-30-looplane-ide-lsp-vscode-bridge-en) completes the local path through orders 0–18. This capstone asks which local guarantees survive the Worker/container boundary and which responsibilities must move into a remote control plane.

First, the evidence boundary: the 2026-08-21 M6 record proves one deployed synchronous Worker → Sandbox → Groq → tool/edit/check run. The newer asynchronous RunSession, SSE, approval, cancel, and artifact lifecycle has code and test evidence but has not been live-revalidated. Neither layer proves production traffic, long-lived attachments, high concurrency, or an SLO.

## One boundary, four components

The Cloudflare slice does not rewrite `AgentRunner` in TypeScript. It packages the same Python `looplane` wheel into a Cloudflare Sandbox container, places a Worker in front as the control plane, then uses Capability DO and RunSession DO for model-call budget and durable run state. The boundary has four components.

```
Caller -> [Worker: handleRun] ---- HMAC run token ----> [Sandbox: looplane-sandbox-run]
              │                                              │
              ├── activateCapability(runId, model, exp, max) -> [DO: RunCapability]
              │                                              │
              └── each model call:
                    Sandbox -> [Worker: handleModelProxy] -> upstream provider
                                  │
                                  ├── verifyRunToken(HMAC)
                                  └── consumeCapability(DO)
```

The Worker holds `OPENAI_API_KEY`, `OPENAI_MODEL`, `MODEL_API_URL`, `CONTROL_PLANE_TOKEN`, and `RUN_TOKEN_SECRET`. The Sandbox exec environment gets only non-secret variables: `LOOPLANE_MODEL_ID`, `LOOPLANE_MODEL_GATEWAY_URL`, and `LOOPLANE_MAX_BUNDLE_BYTES`. The actual model "key" inside the Sandbox is `/workspace/.looplane-run-token`, an HMAC-signed token file owned by the `looplane` user with mode `0600`; the Python entrypoint opens it with `O_RDONLY | O_CLOEXEC | O_NOFOLLOW`, reads it, and unlinks it.

The provider API key never enters the Sandbox environment, source tree, request JSON, result bundle, or error response.

## Boundary 1: Worker ingress trusts nothing

`POST /v1/runs` creates the run; the resource surface then includes `/v1/runs/:id`, events, approvals, cancel, and artifacts. `validateRunRequest` re-canonicalizes creation input:

- `instruction`: non-empty string, no NUL, at most 32,000 characters.
- `model`: must exactly match `env.OPENAI_MODEL`; the caller cannot choose a model.
- `files`: 1-32 files; each path must be POSIX-relative, contain no `\0`, `\\`, `..`, or `.git`, and use an allowed text extension.
- `allowedPaths`: each entry must bind to uploaded files or to an uploaded subtree with a `/**` suffix.
- `checks`: 1-4 argv arrays, each exactly equal to one of four allowlisted commands:
  - `git diff --check`
  - `python3 -m pytest -q`
  - `python3 -m compileall -q .`
  - `python3 -m unittest discover`

There is no shell parsing and no string concatenation. The check is element-wise argv equality, mirroring the local `VerificationCommand` plus `shell=False` boundary.

The Worker also caps ingress size: 768 KiB total request body, 64 KiB per file, 512 KiB total source tree, `maxSteps <= 20`, `wallTimeSeconds <= 220`, and a fixed 300-second run-token lifetime. Bad requests are rejected before reaching the Sandbox.

## Boundary 2: HMAC run token, not provider key

After validation, the Worker creates a five-minute HMAC token:

```typescript
export async function createRunToken(
  secret: string,
  runId: string,
  model: string,
  nowSeconds: number,
): Promise<string> {
  const payload: RunCapability = {
    v: 1,
    aud: "/internal/v1/chat/completions",
    runId,
    model,
    iat: nowSeconds,
    exp: nowSeconds + LIMITS.runTokenSeconds,
  };
  const encoded = bytesToBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = await hmac(secret, encoder.encode(encoded));
  return `${encoded}.${bytesToBase64Url(signature)}`;
}
```

The token contains only audience, run ID, model, issued-at time, and expiration. It contains no provider API key, prompt, source, or artifact data. `RUN_TOKEN_SECRET` stays in the Worker. HMAC uses a secret of at least 32 bytes, and verification uses constant-time comparison.

The Worker writes this token into the Sandbox at `/workspace/.looplane-run-token`. `sandbox_entry._read_and_remove_run_token()` opens it with `O_NOFOLLOW`, checks `0600` permissions and owner, reads it, unlinks it, and fsyncs the parent directory. It is not in the exec environment or process list, and it should not be inherited accidentally by child tools.

Inside the Sandbox, that token becomes the `api_key` for `OpenAICompatibleModel`, whose `base_url` points back to the Worker route `${origin}/internal/v1`. So the Sandbox does not call the provider directly. It calls the Worker; the Worker calls the provider.

## Boundary 3: `/internal/v1/chat/completions`

`handleModelProxy` processes Sandbox model calls in a fixed order:

1. Verify the bearer token with `verifyRunToken()`, checking audience, run ID, model, issued-at, and expiration.
2. Consume one request from `RunCapability.consume(runId, model)`.
3. Only after both pass, forward to `validatedModelApiUrl(env.MODEL_API_URL)` with `Authorization: Bearer ${env.OPENAI_API_KEY}`.

```typescript
const capability = await verifyRunToken(env.RUN_TOKEN_SECRET, token, ...);
const body = validateModelBody(await readJsonBounded(...), capability, env.OPENAI_MODEL);
const consumption = await dependencies.consumeCapability(env, capability.runId, capability.model);
if (consumption === "inactive" || consumption === "expired") throw new RequestProblem(401, "inactive_run_token");
if (consumption === "exhausted") throw new RequestProblem(429, "model_request_budget_exhausted");
// Only now may env.OPENAI_API_KEY be attached to the upstream fetch.
```

`validateModelBody` rejects unknown keys, forces `stream: false`, and caps `max_tokens` at 4096. Provider responses are capped with both `content-length` and streaming limits, and must be valid JSON.

`validatedModelApiUrl` is not arbitrary URL passthrough. It rejects HTTP, query strings, fragments, and paths outside `/chat/completions`. Groq, OpenRouter, and official OpenAI can fit the shape, but callers cannot choose URLs per request.

## Capability DO: per-run strongly consistent budget

The HMAC token is stateless. `RunCapability` Durable Object stores the per-run model-call budget. Activation sets `maxRequests = maxSteps + 2`, giving a small allowance beyond nominal model steps.

Each run maps to its own DO ID with `idFromName(runId)`, so runs do not share state. `/consume` performs an atomic transaction:

```typescript
await this.ctx.storage.transaction(async (transaction) => {
  const record = await transaction.get<CapabilityRecord>("capability");
  if (record === undefined || record.model !== body.model) return;
  if (record.expiresAt <= now) { outcome = "expired"; await transaction.delete("capability"); return; }
  if (record.usedRequests >= record.maxRequests) { outcome = "exhausted"; return; }
  record.usedRequests += 1;
  remaining = record.maxRequests - record.usedRequests;
  outcome = "ok";
  await transaction.put("capability", record);
});
```

This gives three guarantees: the model identity must match, concurrent requests cannot over-consume the budget, and expired records become inactive. Activation rejects an already-active run, so a capability cannot be swapped mid-run.

The DO stores only model, expiration, max requests, and used requests. It does not store provider keys, prompts, artifacts, or raw tokens.

On completion or failure, the Worker calls `revokeCapability` and `destroySandbox` in a `finally` block, each wrapped in bounded timeout helpers. Cleanup failure is surfaced as `sandbox_cleanup_failed`, not silently ignored.

## RunSession DO: from synchronous response to attachable durable run

`POST /v1/runs` now creates a queued `RunSession` Durable Object before `ctx.waitUntil` launches the Sandbox, then immediately returns status, event, and approval URLs. RunSession transactionally maintains queued / running / completed / failed / cancelled state, terminal metadata, artifact keys, pending approvals, and decision history. Late completion cannot overwrite a cancelled terminal state. Cancellation is best-effort: a queued run can terminate immediately, while a running run records `cancelRequested` and relies on cooperative shutdown.

Events have two read modes. `/events` returns NDJSON by default; `?stream=1` replays the bounded buffer, pushes new SSE events, sends idle heartbeats, and honors `Last-Event-ID` for integer-sequence catch-up. Model proxying, event append, and approval polling use separate HMAC token audiences. Each token enters the Sandbox as an owner-only file and is removed after reading, so one token cannot acquire all three authorities. Clients can inspect pending approvals, submit allow_once / allow_session / deny / cancel, and fetch artifacts after termination.

Durable does not mean permanently connected. DO eviction or a client network break requires SSE reconnection with `Last-Event-ID`; the event buffer is bounded and artifacts are not an unlimited history store. Unit tests and local contracts cover these routes, but live Cloudflare authorization, long attaches, and high-concurrency runs still need production validation.

## Sandbox container: same Python runner, hardened entrypoint

The Sandbox image starts from a digest-pinned `cloudflare/sandbox:0.12.7-python` base, installs the `looplane` wheel and hash-locked requirements, and exposes one root-owned `0555` wrapper: `looplane-sandbox-run`. The control plane writes model, event, and approval audience tokens; the wrapper checks the model and event files, while the Python entrypoint securely reads and removes all three.

```sh
#!/bin/sh
set -eu
workspace=/workspace
token_file=/workspace/.looplane-run-token
event_token_file=/workspace/.looplane-event-token

test "$(id -u)" -eq 0
test -d "$workspace/source"
test -f "$workspace/request.json"
test -f "$token_file"
test ! -L "$token_file"
test -f "$event_token_file"
test ! -L "$event_token_file"

chown -R looplane:looplane "$workspace"
chmod 0700 "$workspace"
chmod 0600 "$token_file"
chmod 0600 "$event_token_file"

exec setpriv --reuid=looplane --regid=looplane --init-groups --no-new-privs \
  env HOME=/home/looplane PATH=/usr/local/bin:/usr/bin:/bin \
      LOOPLANE_MODEL_ID="$LOOPLANE_MODEL_ID" \
      LOOPLANE_MODEL_GATEWAY_URL="$LOOPLANE_MODEL_GATEWAY_URL" \
      LOOPLANE_MAX_BUNDLE_BYTES="$LOOPLANE_MAX_BUNDLE_BYTES" \
      python3 -m looplane.sandbox_entry /workspace/request.json
```

Caller data is never inserted into a shell command. The wrapper verifies its required token files, changes ownership to a non-root `looplane` user, applies `--no-new-privs`, and launches one fixed Python module. The approval token is handled by the Python entrypoint's `O_NOFOLLOW` read-and-remove path even though it is not checked in this shell excerpt.

Python then builds a normal `TaskContract` and runs the same `AgentRunner`:

```python
base_sha = await asyncio.to_thread(_initialize_source_repository, source)
task = TaskContract(
    repository=source, instruction=request.instruction,
    allowed_paths=request.allowed_paths, verification=request.verification,
    limits=request.limits, task_id=request.task_id, base_sha=base_sha,
)
if model is None:
    _harden_linux_process()
    run_token = _read_and_remove_run_token(root)
    selected_model = OpenAICompatibleModel(
        model=_required_env("LOOPLANE_MODEL_ID"),
        api_key=run_token,                                   # token, not provider API key
        base_url=_required_env("LOOPLANE_MODEL_GATEWAY_URL"),
        supports_tool_calling=True,
        provider_name="cloudflare-model-proxy",
    )
result = await AgentRunner(task, selected_model, runs, allow_unsafe_local_exec=True).run()
```

`_initialize_source_repository` turns the uploaded source tree into a Git repository and commits it, giving the same disposable-workspace semantics as local `LocalGitWorkspace`, but with HTTP-uploaded source and no upstream `.git`.

`_harden_linux_process()` uses `prctl(PR_SET_DUMPABLE, 0)` so same-UID repository checks cannot read the agent's memory through `/proc/<pid>/mem`.

## How the cloud boundary preserves local guarantees

| Local boundary established earlier | Cloudflare equivalent |
|---|---|
| Workspace and artifact contract | The Worker uploads source, the Sandbox prepares the workspace, and the Worker validates output size, paths, and shape |
| Native loop and provider contract | The Sandbox runs the same Python `AgentRunner`; provider credentials stay in the Worker's model proxy |
| Tools, permission, and containment | Ingress narrows paths and argv, the Sandbox keeps bounded execution, and token audiences separate model, event, and approval authority |
| Journal and durable state | The Sandbox creates the run bundle; RunSession DO stores remote status, events, approvals, cancellation, and artifact metadata |
| Extensions and collaboration | External CLIs, MCP, skills, and subagent transport are not silently treated as cloud capabilities when this slice has not connected them |
| Client, SDK, and IDE | Cloudflare exposes a headless run resource and SSE attach; it does not replace local conversation ownership or the IDE bridge |

After the Sandbox returns, `validateSandboxResponse` checks result shape, run ID, status/exit-code consistency, verification argv equality, and changed files within `allowedPaths`. Sandbox output is not a trust boundary. The Worker and DO are.

## The trade-off

Looplane's Cloudflare slice does not reinvent the agent. It puts the local Python `AgentRunner` into a digest-pinned Sandbox, keeps ingress and model proxying in a Worker, keeps per-run budget in a Capability DO, and lets only an HMAC token cross the Worker/Sandbox boundary.

The cost is substantial: the Worker, Sandbox, Capability DO, RunSession DO, and internal event/approval routes all repeat request validation while preserving HTTPS-only URLs, pinned images, hash-locked requirements, `--no-new-privs`, `PR_SET_DUMPABLE=0`, `O_NOFOLLOW`, token audiences, and constant-time HMAC checks. The return is that the control plane manages run resources, capabilities, events, and artifacts without taking ownership of the native agent loop.

The planned series therefore has a specific shape: establish contracts locally, then project them into a remote control plane. The old synchronous M6 path has one real deployed smoke; the async RunSession/SSE/approval path still needs live revalidation. Client invocation, `CONTROL_PLANE_TOKEN` handling, long attachments, high concurrency, and production traffic remain unproven.

---

## References

- [Looplane official repo](https://github.com/vincentxuu/looplane) -- the ground truth for all code references in this article
- [Looplane `run-session-do.ts` at 2ed5efb](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/cloudflare/src/run-session-do.ts) -- durable status, SSE, approvals, cancellation, and artifact resources
- [Looplane M6 docs](https://github.com/vincentxuu/looplane/blob/main/docs/stages/m6-cloudflare-sandbox-service.md) -- official M6 deployment-slice design notes
- [Looplane M6 live evidence](https://github.com/vincentxuu/looplane/blob/main/docs/research/m6-live-evidence.md) -- the 2026-08-21 deployed smoke and its evidence boundary
- [Cloudflare Sandbox](https://developers.cloudflare.com/sandbox/) -- `@cloudflare/sandbox` SDK behavior
- [Cloudflare Durable Objects SQLite storage](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/) -- transaction behavior behind `RunCapability`
- [Cloudflare Workers bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/) -- Worker binding model
- [HMAC](https://en.wikipedia.org/wiki/HMAC) -- background for HMAC-signed run tokens and constant-time comparison
- [OpenAI Chat Completions API](https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create) -- the OpenAI-compatible wire forwarded by `/internal/v1/chat/completions`
- [Linux `prctl(2)`](https://man7.org/linux/man-pages/man2/prctl.2.html) -- `PR_SET_DUMPABLE` process hardening
