---
title: "Rivumi's Cloudflare deployment slice: Worker control plane, Sandbox container, and Capability Durable Object"
date: 2026-08-23
category: tech
type: deep-dive
tags: [rivumi, coding-agent, cloudflare, workers, durable-objects, sandbox, capability]
lang: en
tldr: "Rivumi's Cloudflare slice is M6 milestone work, not a production service proven by traffic. It shares the same Python AgentRunner used locally, but moves execution and credentials to different places. The boundary is: the Worker holds provider credentials and HTTP coordination; the Sandbox receives only a five-minute, run-scoped, HMAC-signed model capability; every model call consumes budget through a Capability Durable Object; completion or failure revokes the capability and destroys the container."
description: "A deep dive into Rivumi's Cloudflare deployment slice: Worker ingress, model proxy, HMAC run tokens, Capability Durable Object request budgets, Sandbox entrypoint hardening, and how the same Python AgentRunner keeps the local loop, disposable clone, and verification gate intact."
series:
  name: "Rivumi 架構拆解"
  order: 8
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-23-rivumi-cloudflare-deployment)

The previous seven articles covered Rivumi's local architecture: provider-neutral loop, disposable clone, tool isolation, state-first journaling, `ExternalCodingRunner`, `ModelProvider` multi-gateway, and TUI/CLI ergonomics. The Cloudflare path should not be a different agent. It should carry those guarantees into a cloud execution slice without leaking credentials.

First, the status boundary: this article describes the Worker + Sandbox deployment slice that exists in the public repo. It does **not** claim that Rivumi is already a production service proven by real traffic. The M6 milestone summary is the design sentence: **keep HTTP coordination and provider credentials in a Worker; pass only a short-lived, run-scoped model capability into the Sandbox container**.

## One boundary, four components

The Cloudflare slice does not rewrite `AgentRunner` in TypeScript. It packages the same Python `rivumi` wheel into a Cloudflare Sandbox container, places a Cloudflare Worker in front as the control plane, and uses a Durable Object for per-run model-call budget.

```
Caller -> [Worker: handleRun] ---- HMAC run token ----> [Sandbox: rivumi-sandbox-run]
              │                                              │
              ├── activateCapability(runId, model, exp, max) -> [DO: RunCapability]
              │                                              │
              └── each model call:
                    Sandbox -> [Worker: handleModelProxy] -> upstream provider
                                  │
                                  ├── verifyRunToken(HMAC)
                                  └── consumeCapability(DO)
```

The Worker holds `OPENAI_API_KEY`, `OPENAI_MODEL`, `MODEL_API_URL`, `CONTROL_PLANE_TOKEN`, and `RUN_TOKEN_SECRET`. The Sandbox exec environment gets only non-secret variables: `RIVUMI_MODEL_ID`, `RIVUMI_MODEL_GATEWAY_URL`, and `RIVUMI_MAX_BUNDLE_BYTES`. The actual model "key" inside the Sandbox is `/workspace/.rivumi-run-token`, an HMAC-signed token file owned by the `rivumi` user with mode `0600`; the Python entrypoint opens it with `O_RDONLY | O_CLOEXEC | O_NOFOLLOW`, reads it, and unlinks it.

The provider API key never enters the Sandbox environment, source tree, request JSON, result bundle, or error response.

## Boundary 1: Worker ingress trusts nothing

`POST /v1/runs` is the only non-healthcheck public entrypoint. `validateRunRequest` re-canonicalizes all caller input:

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

The Worker writes this token into the Sandbox at `/workspace/.rivumi-run-token`. `sandbox_entry._read_and_remove_run_token()` opens it with `O_NOFOLLOW`, checks `0600` permissions and owner, reads it, unlinks it, and fsyncs the parent directory. It is not in the exec environment or process list, and it should not be inherited accidentally by child tools.

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

## Sandbox container: same Python runner, hardened entrypoint

The Sandbox image starts from a digest-pinned `cloudflare/sandbox:0.12.7-python` base, installs the `rivumi` wheel and hash-locked requirements, and exposes one root-owned `0555` wrapper: `rivumi-sandbox-run`.

```sh
#!/bin/sh
set -eu
workspace=/workspace
token_file=/workspace/.rivumi-run-token

test "$(id -u)" -eq 0
test -d "$workspace/source"
test -f "$workspace/request.json"
test -f "$token_file"
test ! -L "$token_file"

chown -R rivumi:rivumi "$workspace"
chmod 0700 "$workspace"
chmod 0600 "$token_file"

exec setpriv --reuid=rivumi --regid=rivumi --init-groups --no-new-privs \
  env HOME=/home/rivumi PATH=/usr/local/bin:/usr/bin:/bin \
      RIVUMI_MODEL_ID="$RIVUMI_MODEL_ID" \
      RIVUMI_MODEL_GATEWAY_URL="$RIVUMI_MODEL_GATEWAY_URL" \
      RIVUMI_MAX_BUNDLE_BYTES="$RIVUMI_MAX_BUNDLE_BYTES" \
      python3 -m rivumi.sandbox_entry /workspace/request.json
```

Caller data is never inserted into a shell command. The wrapper verifies the token is not a symlink, changes ownership to a non-root `rivumi` user, applies `--no-new-privs`, and launches one fixed Python module.

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
        model=_required_env("RIVUMI_MODEL_ID"),
        api_key=run_token,                                   # token, not provider API key
        base_url=_required_env("RIVUMI_MODEL_GATEWAY_URL"),
        supports_tool_calling=True,
        provider_name="cloudflare-model-proxy",
    )
result = await AgentRunner(task, selected_model, runs, allow_unsafe_local_exec=True).run()
```

`_initialize_source_repository` turns the uploaded source tree into a Git repository and commits it, giving the same disposable-workspace semantics as local `LocalGitWorkspace`, but with HTTP-uploaded source and no upstream `.git`.

`_harden_linux_process()` uses `prctl(PR_SET_DUMPABLE, 0)` so same-UID repository checks cannot read the agent's memory through `/proc/<pid>/mem`.

## How the cloud boundary preserves local guarantees

| Local guarantee | Cloudflare equivalent |
|---|---|
| Provider-neutral `AgentRunner` loop | Same wheel, same `python3 -m rivumi.sandbox_entry` runner |
| Disposable clone and allowed paths | Uploaded source tree becomes a Git repo; `allowed_paths` enter `TaskContract` |
| Tool isolation and argv allowlist | Worker ingress rejects non-allowlisted checks; Sandbox uses the same bounded runtime |
| State-first event journaling | Sandbox writes the same `request.json`, `events.jsonl`, `checkpoint.json`, `changes.patch`, `test.log`, and `result.json` bundle |
| `ExternalCodingRunner` is not `ModelProvider` | Cloud slice runs native `AgentRunner`; official CLIs and local-only runtimes are not tunneled into Cloudflare |
| ModelProvider multi-gateway | Worker proxy binds `MODEL_API_URL` and `OPENAI_MODEL`, while Sandbox uses canonical `OpenAICompatibleModel` |
| TUI/CLI ergonomics | Unchanged locally; this is a headless cloud slice |

After the Sandbox returns, `validateSandboxResponse` checks result shape, run ID, status/exit-code consistency, verification argv equality, and changed files within `allowedPaths`. Sandbox output is not a trust boundary. The Worker and DO are.

## The trade-off

Rivumi's Cloudflare slice does not reinvent the agent. It puts the local Python `AgentRunner` into a digest-pinned Sandbox, keeps ingress and model proxying in a Worker, keeps per-run budget in a Capability DO, and lets only an HMAC token cross the Worker/Sandbox boundary.

The cost is substantial: TypeScript control-plane code, a Durable Object, a wrapper script, a Dockerfile, repeated request validation, HTTPS-only provider URLs, pinned images, hash-locked requirements, `--no-new-privs`, `PR_SET_DUMPABLE=0`, `O_NOFOLLOW`, and constant-time HMAC checks. The return is that the Cloudflare slice does not need to know how the loop works. Future changes to the Python entrypoint, provider adapters, verification argv set, or model count do not have to rewrite the core Worker trust decisions.

The evidence supports "the deployment boundary is defined in code," not "a production service has been proven under traffic." A future cloud client should focus on invocation, `CONTROL_PLANE_TOKEN` handling, dry-run versus deploy evidence, and clear run-bundle provenance rather than rewriting the agent loop.

---

## References

- [Rivumi official repo](https://github.com/vincentxuu/rivumi) -- the ground truth for all code references in this article
- [Rivumi M6 docs](https://github.com/vincentxuu/rivumi/blob/main/docs/stages/m6-cloudflare-sandbox.md) -- official M6 deployment-slice design notes
- [Cloudflare Sandbox](https://developers.cloudflare.com/sandbox/) -- `@cloudflare/sandbox` SDK behavior
- [Cloudflare Durable Objects SQLite storage](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/) -- transaction behavior behind `RunCapability`
- [Cloudflare Workers bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/) -- Worker binding model
- [HMAC](https://en.wikipedia.org/wiki/HMAC) -- background for HMAC-signed run tokens and constant-time comparison
- [OpenAI Chat Completions API](https://platform.openai.com/docs/api-reference/chat) -- the OpenAI-compatible wire forwarded by `/internal/v1/chat/completions`
- [Linux `prctl(2)`](https://man7.org/linux/man-pages/man2/prctl.2.html) -- `PR_SET_DUMPABLE` process hardening
