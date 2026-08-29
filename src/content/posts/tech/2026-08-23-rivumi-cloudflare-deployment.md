---
title: "Rivumi 的 Cloudflare 部署切片：Worker 控制面 + Sandbox 容器 + Capability DO 的邊界"
date: 2026-08-23
category: tech
type: deep-dive
tags: [rivumi, coding-agent, cloudflare, workers, durable-objects, sandbox, capability]
lang: zh-TW
tldr: "Rivumi 的 Cloudflare 切片是 M6 milestone 的工作,不是已驗證的 production service。它跟前面七篇看到的本地架構共享同一個 Python AgentRunner,差別在執行位置與憑證位置。邊界只有一句話:Worker 持有 provider credentials 與 HTTP 協調,Sandbox 容器只拿到一支五分鐘、run-scoped、HMAC 簽章的模型 capability;每次模型呼叫要再過一次 Capability DO 的 atomic 預算扣減,run 結束或失敗都會 revoke 能力並 destroy 容器。這篇拆 Worker ingress / model proxy / Capability DO / Sandbox entrypoint 四塊,以及這個邊界為什麼沒打破前七篇的 loop / clone / isolation / state / external runtime / multi-gateway / TUI 任何一個保證。"
description: "深入解析 Rivumi Cloudflare 部署切片:Worker 控制面只接受驗證過的請求,Sandbox 容器只收到 HMAC 簽章的短期 capability,Capability DO 控管每 run 的模型請求預算——同一份 Python AgentRunner 從本機到 Cloudflare 都跑相同的 loop、相同的 disposable clone、相同的 verification gate。"
series:
  name: "Rivumi 架構拆解"
  order: 8
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-23-rivumi-cloudflare-deployment-en)

前七篇把 Rivumi 的本地架構拆完——provider-neutral loop、disposable clone、tool isolation、state-first journaling、ExternalCodingRunner、ModelProvider multi-gateway、TUI/CLI ergonomics。本地能跑的東西,Cloudflare 跑法不應該是不同的 agent:第八篇要回答的是「Cloudflare 切片怎麼承接前面所有保證,而憑證不外洩」。先講邊界:這篇描述的是公開 repo 裡已收斂的 Worker + Sandbox deployment slice,不是宣稱它已經是經 production traffic 驗證的雲端服務。M6 milestone 的進度條只有一句結論:**Keep HTTP coordination and provider credentials in a Worker; pass only a short-lived, run-scoped model capability into the Sandbox container** (`progress.md` M6, bullet 1)。這篇把這句結論的程式碼依據拆開。

## 邊界一句話,程式碼四塊

Cloudflare 切片不是把 AgentRunner 改寫成 TypeScript,而是把同一個 Python `rivumi` wheel 放進 Cloudflare Sandbox 容器,在它前面擺一個 Cloudflare Worker 當 control plane,後面擺一個 Durable Object 當 per-run capability 預算。整個邊界只有四個元件:

```
Caller → [Worker: handleRun] ──── HMAC run token ────→ [Sandbox: rivumi-sandbox-run]
              │                                              │
              ├── activateCapability(runId, model, exp, max) → [DO: RunCapability]
              │                                              │
              └── each model call:
                    Sandbox → [Worker: handleModelProxy] ─→ upstream provider
                                  │
                                  ├── verifyRunToken(HMAC)
                                  └── consumeCapability(DO)
```

Worker 持有 `OPENAI_API_KEY` / `OPENAI_MODEL` / `MODEL_API_URL` / `CONTROL_PLANE_TOKEN` / `RUN_TOKEN_SECRET`(control-plane.ts:44-52)。Sandbox exec 環境只拿到三個非秘密變數:`RIVUMI_MODEL_ID`、`RIVUMI_MODEL_GATEWAY_URL`、`RIVUMI_MAX_BUNDLE_BYTES`(control-plane.ts:802-806);真正的「key」是 `/workspace/.rivumi-run-token` 這個檔案,內容是 HMAC 簽章後的 token,owner 是 `rivumi` 使用者、mode `0600`,Python entrypoint 用 `O_RDONLY | O_CLOEXEC | O_NOFOLLOW` 讀完就 `unlink()`(sandbox_entry.py:63-102)。

換句話說,Provider API key **永遠沒有**進到 Sandbox 的 exec 環境、source tree、request.json、result bundle、error response——這一條是 README 第 84-85 行的明文承諾。

## 邊界一:Worker ingress,什麼都不信

`POST /v1/runs` 是整個切片對外的唯一非 healthcheck 入口。`validateRunRequest` 把每個欄位都當敵意輸入重做一次 canonical 化(control-plane.ts:177-255):

- `instruction`:必須是非空 string、不可含 NUL、長度 ≤ 32,000。
- `model`:必須嚴格等於 `env.OPENAI_MODEL`——caller **不能**挑模型。
- `files`:array,1–32 個;每個檔案的 `path` 必須是 POSIX 相對路徑、不含 `\0` / `\\` / `..` / `.git`、副檔名落在九個 text extension allowlist(`control-plane.ts:30-40`)內。
- `allowedPaths`:每個都必須 bind 到已上傳的檔案,或用 `/**` 結尾綁整個子樹(control-plane.ts:143-165)——這條限制直接對應前幾篇的 SafePathPolicy:declared 在 request,worktree 真的只動這些。
- `checks`:argv array,1–4 個,**每個 argv 都必須精準等於**四個 allowlist 之一(control-plane.ts:23-28 + 167-175):
  - `git diff --check`
  - `python3 -m pytest -q`
  - `python3 -m compileall -q .`
  - `python3 -m unittest discover`

沒有 shell parsing、沒有字串拼接;比對是 element-wise 的 `argv[i] === allowed[i]`。這條對應到第三篇的 `argvAllowed` + `shell=False` 子行程承諾——從 Python harness 延續到 Cloudflare boundary,規則一模一樣,只是搬到 TypeScript。

整體 ingress 大小上限 768 KiB,單檔 64 KiB,source tree 合計 512 KiB,maxSteps ≤ 20,wallTimeSeconds ≤ 220,token lifetime 固定 300 秒(control-plane.ts:7-21)。這些上限是 Worker 在 SDK 階段就 reject,進不到 Sandbox。

## 邊界二:HMAC run token——「key」其實是 token,不是 API key

驗證通過後,Worker 為這個 run 產生一支 5 分鐘的 HMAC token,不是把 provider key 給 Sandbox。`createRunToken` 是經典的 base64url(HMAC-SHA256(payload))(control-plane.ts:307-324):

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

token 自帶的 claims 只有四個:audience、runId、model、有效期。**沒有**`OPENAI_API_KEY`、沒有 prompt、沒有 source、沒有 artifact。`RUN_TOKEN_SECRET` 留在 Worker env,Sandbox 永遠拿不到(README 第 95 行)。`hmac()` 也會強制 secret ≥ 32 bytes(control-plane.ts:274),且 HMAC 比對用 `constantTimeEqual` 防 timing oracle(control-plane.ts:289-296)。

Worker 把這個 token 寫到 Sandbox 的 `/workspace/.rivumi-run-token`(control-plane.ts:795-798),Python `sandbox_entry._read_and_remove_run_token()` 用 `O_NOFOLLOW` 開、`fstat()` 確認 mode 是 `0600` 且 owner 是當前 euid、讀完立即 `path.unlink()` 並 `fsync` 父目錄(sandbox_entry.py:66-101)。檔案本體用完就消失,不在 exec env,不在 `ps`,不會被 fork 出來的工具子行程誤讀。

然後這個 token 被拿來當 `OpenAICompatibleModel` 的 `api_key`——`base_url` 是 `${request.url.origin}/internal/v1`(control-plane.ts:747),也就是 Worker 自己開的另一條 route。所以「Sandbox 跟模型說話」其實是「Sandbox 跟 Worker 說話,Worker 再跟 provider 說話」。

## 邊界三:`/internal/v1/chat/completions`——token + DO 雙重驗證

Sandbox 裡的 `OpenAICompatibleModel` 把每一次 `complete()` 打到 `${base_url}/internal/v1/chat/completions`,也就是 `handleModelProxy`(control-plane.ts:883-941)。這個 handler 做了三件先後順序固定的事:

1. **HMAC 驗證**:把 bearer token 過 `verifyRunToken()`,確認 aud / runId / model / iat / exp 都對得上。
2. **DO 預算扣減**:再打 `RunCapability.consume(runId, model)`,atomic 地把 `usedRequests += 1`,回傳 `ok` / `expired` / `exhausted` / `inactive`。
3. **Provider 轉發**:**只有**前兩關都通過才把 request body 套上 `Authorization: Bearer ${env.OPENAI_API_KEY}` 轉發到 `validatedModelApiUrl(env.MODEL_API_URL)`(control-plane.ts:904-908)。

```typescript
const capability = await verifyRunToken(env.RUN_TOKEN_SECRET, token, ...);
const body = validateModelBody(await readJsonBounded(...), capability, env.OPENAI_MODEL);
const consumption = await dependencies.consumeCapability(env, capability.runId, capability.model);
if (consumption === "inactive" || consumption === "expired") throw new RequestProblem(401, "inactive_run_token");
if (consumption === "exhausted") throw new RequestProblem(429, "model_request_budget_exhausted");
// 此時才允許把 env.OPENAI_API_KEY 加到 upstream fetch
```

注意幾件事:

- `validateModelBody` 拒絕任何 caller 想多塞的欄位(`rejectUnknownKeys`),強制 `stream: false`、上限 `max_tokens: 4096`(control-plane.ts:863-881)——模型 response 也用 `content-length` + streaming cap 雙重限制 ≤ 1 MiB(control-plane.ts:909-923),且必須是合法 JSON 才回傳。
- Provider URL 不是自由格式:`validatedModelApiUrl` 拒絕 HTTP、拒絕 query string、拒絕 fragment、只接受 `/chat/completions` 路徑(README 第 87-90 行 + control-plane.ts:464-485)。Groq、OpenRouter、官方 OpenAI 都可以掛,但 caller 不能在 request 裡換 URL。
- API key **只活在**這個 handler 的記憶體變數裡,不會寫到 source、request、result、env、error body、log。

## Capability DO:per-run 強一致預算

HMAC token 是 stateless 的(到期就過),`RunCapability` Durable Object 是 stateful 的「這個 run 還剩多少 quota」。`activateCapability` 給的預算是 `maxSteps + 2`(control-plane.ts:768),所以即使模型需要額外 retry 也不會被預算先殺。

每個 run 在自己的 DO stub 上操作(命名空間用 `idFromName(runId)`,capability-do.ts:124-126)——不同 run 永遠不會互相干擾。`/consume` 是 atomic transaction(capability-do.ts:92-108):

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

這個 transaction 提供三個保證:**模型身份必須對**(不同模型拿這個 DO 的 quota 直接 401)、**預算不被超用**(同一個 isolate 內外的兩個 worker 也不可能 race 出多扣)、**過期當 inactive 處理**(還沒進 transaction 之前就先把過期 record 砍掉)。`activate` 也防重入:若 `expiresAt > now` 已經有 record 就回 `409 already_active`(capability-do.ts:62-76),這個 run 不會被中途偷換能力。

這個 DO **只**存 model / expiresAt / maxRequests / usedRequests(capability-do.ts:3-8)。沒有 provider key、沒有 prompt、沒有 artifact、沒有 raw token——所以即使 DO 的 SQLite 意外外洩,攻擊者拿到的也只是「某個 run 在某段時間最多打了 N 次某個模型」這種 metadata。

Run 結束或失敗,Worker 在 `finally` 區塊呼叫 `revokeCapability` 並 `destroySandbox`,兩個都包 `revokeCapabilityBounded` / `destroySandboxBounded` 的 5 秒 timeout wrapper(control-plane.ts:493-535, 843-859),任一失敗回傳 `500 sandbox_cleanup_failed`——不是靜默吞掉。

## Sandbox 容器:同一份 Python AgentRunner,加一層 hardening

Sandbox image 的 Dockerfile 很短(Dockerfile:1-15):從 digest-pinned 的 `cloudflare/sandbox:0.12.7-python` base,把 `rivumi-0.1.0-py3-none-any.whl` 跟 `requirements.txt`(hash-locked)用 `pip3 install --require-hashes` 灌進去,然後丟一個 28 行的 `rivumi-sandbox-run` shell wrapper。Wrapper 是 root-owned `0555`,handler 永遠是它——caller 沒辦法讓 Sandbox 跑別的指令:

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

這層 wrapper 做四件事:確認 token 不是 symlink、把 workspace owner 換成非 root 的 `rivumi` user、用 `setpriv --no-new-privs` 防止 setuid escape、傳固定 env 給固定的 Python module(`rivumi.sandbox_entry`)。Dockerfile 也只允許這個 binary 是 `0555` 的 root-owned——README 第 62-65 行明文「Caller data is never inserted into a shell command」。

然後 Python 端接手,做的事情是把它當作第七篇那個本地 `AgentRunner` 的延伸,只是工作目錄是 `/workspace`、模型走 Worker proxy。`run_sandbox_request` 的核心(sandbox_entry.py:192-225):

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
        api_key=run_token,                                   # ← 這是 token,不是 API key
        base_url=_required_env("RIVUMI_MODEL_GATEWAY_URL"),
        supports_tool_calling=True,
        provider_name="cloudflare-model-proxy",
    )
result = await AgentRunner(task, selected_model, runs, allow_unsafe_local_exec=True).run()
```

`AgentRunner.run()` 跟第一篇拆的 loop 完全同一份:三層 guards、repetition fingerprint、verification gate。`_initialize_source_repository` 把 Worker 上傳的純 source tree `git init` + commit 進去,變成 disposable clone——對應第二篇的 `LocalGitWorkspace`,差別在這裡的 source 是從 HTTP 上傳、沒有上游 `.git` 目錄(sandbox_entry.py:122-142 還會拒絕有 `.git` 的 staged source)。

`_harden_linux_process()` 跑 `prctl(PR_SET_DUMPABLE, 0)`(sandbox_entry.py:44-60)——同 UID 的 repository check 不能用 `/proc/<pid>/mem` 偷讀 agent 的記憶體,即使後面 `allow_unsafe_local_exec=True`(因為 Sandbox 本來就已經是隔離環境)。

## 邊界怎麼延續本地保證

把這條 Cloudflare 切片放回前七篇,每個保證都有對應的延伸,沒有任何一個被犧牲:

| 本地保證(前幾篇) | Cloudflare 對應 |
|---|---|
| Provider-neutral `AgentRunner` loop (post 1) | 同一份 wheel,跑同一個 `python3 -m rivumi.sandbox_entry` |
| Disposable clone + allowed_paths (post 2) | Worker 上傳 source tree → Sandbox `git init` 後 commit;allowed_paths 從 request JSON 帶進 `TaskContract` |
| Tool isolation + argv allowlist (post 3) | Worker ingress 已經拒絕非 allowlist 的 `checks` argv;Sandbox 跑的是同一個 `run_bounded_command` 跟 `sanitized_subprocess_env` |
| State-first events.jsonl + atomic_write (post 4) | Sandbox 寫入 `/workspace/runs/<run_id>/` 同一份 `request.json / events.jsonl / checkpoint.json / changes.patch / test.log / result.json` 六件,Worker 用 `readSandboxFileBounded` 串流讀出 |
| ExternalCodingRunner 不是 ModelProvider (post 5) | Sandbox 跑的只有 native AgentRunner;官方 Claude/Codex 與 local-only OpenCode/Pi/OMP 不借路到 Cloudflare |
| ModelProvider multi-gateway (post 6) | `MODEL_API_URL` + `OPENAI_MODEL` 雙綁定,Groq / OpenRouter / 官方 OpenAI 都能掛,但 worker 仍走 canonical `OpenAICompatibleModel`,繼續吃 `ProviderError` canonical 化 |
| TUI / CLI ergonomics (post 7) | 不被影響——這是 headless 切片,沒 TUI;`rivumi run` 在本機仍然是同一個 `AgentRunner`,不會用到 Cloudflare 邊界 |

Worker 拿到 response 之後做 `validateSandboxResponse`(control-plane.ts:613-737):它不只 parse JSON,還強制 `result.run_id === runId`、`status` 跟 exit code 對齊、`verification` 的 argv 跟 request 嚴格相等、`changed_files` 都落在 `allowedPaths` 內——任何一個對不上就 `502 sandbox_*_invalid`。換句話說,Sandbox 想憑空生 patch 出去、想用沒宣告的 check、想假報 success——都被 Worker 在 HTTP 邊界擋下。**Sandbox 不是 trust boundary;Worker + DO 才是 trust boundary**。

最後,整個 run 結束時 `finally` 一定做兩件事:revoke 該 runId 的 DO 紀錄、destroy Sandbox(control-plane.ts:843-859)。revoke 在前,destroy 在後,所以即使 destroy timeout 5 秒,Sandbox 也只剩一個 5 分鐘後會過期的 token 可以拿——而那時 DO 已經不認它、Provider URL 也已經驗證不了 `task_id`。

## 整體來說

Rivumi 的 Cloudflare 切片不重新發明 agent——它把本地那份 AgentRunner 放進 digest-pinned Sandbox、用 Worker 包 ingress 與 model proxy、用 Capability DO 包 per-run 預算,然後**只讓一支 HMAC token 過 Worker/Sandbox 邊界**。邊界上的每個欄位都重做一次 canonical 化,沒有一個 trust decision 留給 prompt 或 sandbox process。

這個設計的代價是顯而易見的:多寫 967 行的 TypeScript + 175 行的 capability DO + 28 行的 shell wrapper + Dockerfile;Worker、Sandbox、DO 三層邊界都要重做 request 驗證;HTTPS-only、digest-pinned base image、hash-locked requirements、`--no-new-privs`、`prctl PR_SET_DUMPABLE=0`、`O_NOFOLLOW`、`constantTimeEqual` 這些細節都要守。它的回報是:**Cloudflare 切片對「loop 怎麼跑」一無所知**——未來想把 `rivumi.sandbox_entry` 換成別的 Python entrypoint(例如加一個 streaming-mode adapter、加 multi-turn session resume)、想加第十個 provider、想把 verification argv 從四個擴到八個、想把 max steps 從 20 拉到 50,都不需要改 control-plane.ts 或 capability-do.ts;Worker 那一側的所有保證——HMAC 驗證、DO 預算、source path 校驗、argv 嚴格比對、Sandbox response schema 校驗——都跟 loop 解耦。只是到目前為止,公開證據能支持的是「部署切片的邊界已經寫清楚」,不是「production service 已經跑穩」。

如果後續要寫雲端呼叫端,重點不該是再重寫 agent loop,而是把本機 `rivumi` CLI / TUI 怎麼觸發 Cloudflare 切片、`CONTROL_PLANE_TOKEN` 怎麼保管、dry-run 跟真實 deploy 之間的 evidence chain 怎麼留清楚。

---

## 參考資料

- [Rivumi 官方 repo](https://github.com/vincentxuu/rivumi)——本文所有引用來源的 ground truth
- [Rivumi M6 文件](https://github.com/vincentxuu/rivumi/blob/main/docs/stages/m6-cloudflare-sandbox.md)——M6 milestone 的官方設計說明
- [Cloudflare Sandbox](https://developers.cloudflare.com/sandbox/)——`@cloudflare/sandbox` SDK、`getSandbox` / `exec` / `readFileStream` / `destroy` 的官方文件
- [Cloudflare Durable Objects — SQLite storage](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/)——`RunCapability` 用 `ctx.storage.transaction` 做 atomic 預算扣減的底層
- [Cloudflare Workers — Container bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/)——`wrangler.jsonc` 的 `containers` 區段如何把 Sandbox Docker image 接到 Worker
- [HMAC 與 constant-time 比較](https://en.wikipedia.org/wiki/HMAC)——`createRunToken` / `verifyRunToken` / `constantTimeEqual` 的密碼學依據
- [OpenAI-compatible Chat Completions](https://platform.openai.com/docs/api-reference/chat)——`/internal/v1/chat/completions` 轉發的 wire format 來源,支援 Groq / OpenRouter / 官方 OpenAI
- [Linux capabilities — PR_SET_DUMPABLE](https://man7.org/linux/man-pages/man2/prctl.2.html)——`_harden_linux_process` 阻擋同 UID `/proc/<pid>/mem` 讀取的依據
