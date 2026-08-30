---
title: "Rivumi 的 Cloudflare 遠端執行：Worker、Sandbox、Capability DO 與 durable RunSession"
date: 2026-08-30
category: tech
type: deep-dive
tags: [rivumi, coding-agent, cloudflare, workers, durable-objects, sandbox, capability]
lang: zh-TW
tldr: "Rivumi 的舊同步 M6 路徑曾完成一次真實 deployed coding run；目前已擴成帶 RunSession、SSE、approval、cancel 與 artifact 的 async control plane，但新增路徑尚未 live revalidate。Sandbox 只拿分 audience 的短效 HMAC capability，provider credential 留在 Worker；現有證據不等於 production traffic 或 SLO。"
description: "深入拆解 Rivumi Cloudflare 遠端執行：Worker ingress、Sandbox、Capability DO、durable RunSession、async status、SSE events、approval/cancel/artifact routes，以及 credential 與 token audience 邊界。"
series:
  name: "Rivumi 架構拆解"
  order: 19
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-23-rivumi-cloudflare-deployment-en)

[上一篇 IDE/LSP bridge](/posts/tech/2026-08-30-rivumi-ide-lsp-vscode-bridge)完成 orders 0–18 的本機路徑。這篇 capstone 接著問：同一份 AgentRunner 搬進 Cloudflare Sandbox 後，哪些本機保證能跨過 Worker / container 邊界？又有哪些責任必須交給遠端 control plane？

Cloudflare 路徑已從最初的同步 M6 slice 擴成 async control plane。2026-08-21 的 M6 evidence 證明舊同步路徑曾完成一次 deployed Worker → Sandbox → Groq → tool/edit/check smoke；目前新增的 RunSession、SSE、approval 與 async lifecycle 則只有 code path 與測試證據，尚未重新做 live validation。兩者都不能當成 production traffic、長連線、高併發或 SLO 證明。

## 邊界一句話,程式碼四塊

Cloudflare 切片沿用 Python `rivumi` wheel，不在 TypeScript 重寫 AgentRunner。這份 wheel 進入 Cloudflare Sandbox，前方由 Worker 擔任 control plane；Capability DO 與 RunSession DO 分別管理模型能力預算和 durable run state。整個邊界有四個元件：

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

`POST /v1/runs` 是建立 run 的公開入口；建立後還有 `/v1/runs/:id`、events、approvals、cancel 與 artifacts 資源。`validateRunRequest` 把建立請求的每個欄位都當敵意輸入重做 canonical 化:

- `instruction`:必須是非空 string、不可含 NUL、長度 ≤ 32,000。
- `model`:必須嚴格等於 `env.OPENAI_MODEL`——caller **不能**挑模型。
- `files`:array,1–32 個;每個檔案的 `path` 必須是 POSIX 相對路徑、不含 `\0` / `\\` / `..` / `.git`、副檔名落在九個 text extension allowlist(`control-plane.ts:30-40`)內。
- `allowedPaths`:每個都必須 bind 到已上傳的檔案,或用 `/**` 結尾綁整個子樹(control-plane.ts:143-165)——這條限制直接對應前幾篇的 SafePathPolicy:declared 在 request,worktree 真的只動這些。
- `checks`:argv array,1–4 個,**每個 argv 都必須精準等於**四個 allowlist 之一(control-plane.ts:23-28 + 167-175):
  - `git diff --check`
  - `python3 -m pytest -q`
  - `python3 -m compileall -q .`
  - `python3 -m unittest discover`

沒有 shell parsing、沒有字串拼接；比對是 element-wise 的 `argv[i] === allowed[i]`。這條對應 order 8 的 `argvAllowed` + `shell=False` 子行程承諾——從 Python harness 延續到 Cloudflare boundary，規則一模一樣，只是搬到 TypeScript。

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

Run 結束或失敗，Worker 在 `finally` 區塊呼叫 `revokeCapability` 並 `destroySandbox`，兩個都有 bounded timeout。Async background flow 的 cleanup 失敗不會再回一個同步 HTTP 500；它會呼叫 `failRunSession(..., "sandbox_cleanup_failed")`，把 durable run resource 標成失敗終態。

## RunSession DO：從同步 response 變成可 attach 的 durable run

`POST /v1/runs` 會先建立 queued 的 `RunSession` Durable Object，再用 `ctx.waitUntil` 啟動 Sandbox，立即回傳 status、events 與 approvals URL。RunSession 在 transaction 中維護 queued / running / completed / failed / cancelled、terminal metadata、artifact keys、pending approvals 與 decision history。晚到的 completion 不能覆蓋已 cancelled 的 terminal 狀態；cancel 則是 best-effort，queued run 可直接終止，running run 先留下 `cancelRequested`，再由執行面協作停止。

事件有兩條讀法。預設 `/events` 回 NDJSON；加 `?stream=1` 會 replay bounded buffer，再以 SSE 推送新事件與 idle heartbeat，並依 `Last-Event-ID` 只補較新的 integer sequence。模型 proxy、event append、approval polling 使用不同 audience 的 HMAC token，Sandbox 內各自用 owner-only file 傳遞、讀完刪除，避免一支 token 同時取得模型、事件與審批權限。呼叫端也能查 pending approval、提交 allow_once / allow_session / deny / cancel，並在 terminal 後逐一讀取 artifact。

durable 不等於永遠連線。DO eviction 或 client network 中斷後，SSE subscriber 要靠 `Last-Event-ID` 重連；event buffer 有界，artifact 也不是無限歷史倉庫。這些 route 已有單元測試與本機 contract evidence，但真實 Cloudflare authorization、長時間 attach 與高併發 run 仍需 live validation。

## Sandbox 容器:同一份 Python AgentRunner,加一層 hardening

Sandbox image 從 digest-pinned 的 `cloudflare/sandbox:0.12.7-python` base 安裝 wheel 與 hash-locked requirements，再放入 root-owned `0555` 的 `rivumi-sandbox-run` wrapper。Control plane 會寫入 model、event、approval 三種 audience token；wrapper 先檢查 model 與 event token，Python entrypoint 再各自安全讀取並刪除三個 token：

```sh
#!/bin/sh
set -eu
workspace=/workspace
token_file=/workspace/.rivumi-run-token
event_token_file=/workspace/.rivumi-event-token

test "$(id -u)" -eq 0
test -d "$workspace/source"
test -f "$workspace/request.json"
test -f "$token_file"
test ! -L "$token_file"
test -f "$event_token_file"
test ! -L "$event_token_file"

chown -R rivumi:rivumi "$workspace"
chmod 0700 "$workspace"
chmod 0600 "$token_file"
chmod 0600 "$event_token_file"

exec setpriv --reuid=rivumi --regid=rivumi --init-groups --no-new-privs \
  env HOME=/home/rivumi PATH=/usr/local/bin:/usr/bin:/bin \
      RIVUMI_MODEL_ID="$RIVUMI_MODEL_ID" \
      RIVUMI_MODEL_GATEWAY_URL="$RIVUMI_MODEL_GATEWAY_URL" \
      RIVUMI_MAX_BUNDLE_BYTES="$RIVUMI_MAX_BUNDLE_BYTES" \
      python3 -m rivumi.sandbox_entry /workspace/request.json
```

這層 wrapper 確認必要 token 不是 symlink、把 workspace owner 換成非 root 的 `rivumi` user、用 `setpriv --no-new-privs` 降權，並把固定 env 傳給固定的 Python module。Approval token 由 Python entrypoint 的 `O_NOFOLLOW` 讀取路徑處理；它雖未出現在這段 shell 檢查，仍與 model/event token 分 audience、讀後刪除。Caller data 不會被插進 shell command。

然後 Python 端接手，延伸 order 4 的本地 `AgentRunner`，只是工作目錄是 `/workspace`、模型走 Worker proxy。`run_sandbox_request` 的核心如下：

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

`AgentRunner.run()` 跟 order 4 拆的 loop 完全同一份：三層 guards、repetition fingerprint、verification gate。`_initialize_source_repository` 把 Worker 上傳的純 source tree `git init` + commit 進去，形成 disposable workspace——對應 order 2 的 `LocalGitWorkspace`，差別在這裡的 source 從 HTTP 上傳，且 staged source 會拒絕 `.git`。

`_harden_linux_process()` 跑 `prctl(PR_SET_DUMPABLE, 0)`(sandbox_entry.py:44-60)——同 UID 的 repository check 不能用 `/proc/<pid>/mem` 偷讀 agent 的記憶體,即使後面 `allow_unsafe_local_exec=True`(因為 Sandbox 本來就已經是隔離環境)。

## 邊界怎麼延續本地保證

把這條 Cloudflare 切片放回規劃中的 orders 1–18，可以看出哪些保證直接延伸，哪些能力仍明確留在雲端邊界外：

| 前篇建立的本機邊界 | Cloudflare 對應 |
|---|---|
| Workspace 與 artifact contract | Worker 上傳 source tree，Sandbox 建立工作目錄；輸出再由 Worker 做大小、路徑與 shape 驗證 |
| Native loop 與 provider contract | Sandbox 跑同一份 Python `AgentRunner`；provider credential 留在 Worker 的 model proxy |
| Tool、permission 與 containment | request 先限制 path/argv，Sandbox 內仍跑 bounded toolset；HMAC audience 把 model、event、approval 權限拆開 |
| Journal 與 durable state | Sandbox 產生 run bundle；RunSession DO 保存遠端 status、events、approvals、cancel 與 artifact metadata |
| Extension 與 collaboration | 這個 slice 不把本機 external CLI、MCP、skills 或 subagent transport 偷渡成雲端能力；未接上的功能仍留在邊界外 |
| Client、SDK 與 IDE | Cloudflare 提供 headless run resource 與 SSE attach；它不取代前篇的本機 conversation ownership 或 IDE bridge |

Worker 拿到 response 之後做 `validateSandboxResponse`(control-plane.ts:613-737):它不只 parse JSON,還強制 `result.run_id === runId`、`status` 跟 exit code 對齊、`verification` 的 argv 跟 request 嚴格相等、`changed_files` 都落在 `allowedPaths` 內——任何一個對不上就 `502 sandbox_*_invalid`。換句話說,Sandbox 想憑空生 patch 出去、想用沒宣告的 check、想假報 success——都被 Worker 在 HTTP 邊界擋下。**Sandbox 不是 trust boundary;Worker + DO 才是 trust boundary**。

最後,整個 run 結束時 `finally` 一定做兩件事:revoke 該 runId 的 DO 紀錄、destroy Sandbox(control-plane.ts:843-859)。revoke 在前,destroy 在後,所以即使 destroy timeout 5 秒,Sandbox 也只剩一個 5 分鐘後會過期的 token 可以拿——而那時 DO 已經不認它、Provider URL 也已經驗證不了 `task_id`。

## 整體來說

Rivumi 的 Cloudflare 切片不重新發明 agent——它把本地那份 AgentRunner 放進 digest-pinned Sandbox、用 Worker 包 ingress 與 model proxy、用 Capability DO 包 per-run 預算,然後**只讓一支 HMAC token 過 Worker/Sandbox 邊界**。邊界上的每個欄位都重做一次 canonical 化,沒有一個 trust decision 留給 prompt 或 sandbox process。

這個設計的代價是顯而易見的:Worker、Sandbox、Capability DO、RunSession DO 與內部 event/approval route 都要重做 request 驗證，還要維持 HTTPS-only、digest-pinned image、hash-locked requirements、`--no-new-privs`、`PR_SET_DUMPABLE=0`、`O_NOFOLLOW`、token audience 與 constant-time HMAC。回報是 Cloudflare 控制面不需要接管 native loop；它只管理 run resource、能力、事件與 artifacts。到目前為止，公開證據支持的是「async durable boundary 已寫進 code 並有測試」，不是「production service 已跑穩」。

系列走到這裡，規劃路徑是「本機 contract 先成立，再投影到遠端 control plane」，不是讓雲端部署替其他 order 補洞。舊同步 M6 已有一次 real deployed smoke；目前仍待補的是 async RunSession/SSE/approval 路徑的 live revalidation，以及呼叫端、`CONTROL_PLANE_TOKEN` 保管、長連線、高併發與 production traffic 的 evidence chain。

---

## 參考資料

- [Rivumi 官方 repo](https://github.com/vincentxuu/rivumi)——本文所有引用來源的 ground truth
- [Rivumi `run-session-do.ts`（2ed5efb）](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/cloudflare/src/run-session-do.ts)——durable status、SSE、approval、cancel 與 artifact resource
- [Rivumi M6 文件](https://github.com/vincentxuu/rivumi/blob/main/docs/stages/m6-cloudflare-sandbox-service.md)——M6 milestone 的官方設計說明
- [Rivumi M6 live evidence](https://github.com/vincentxuu/rivumi/blob/main/docs/research/m6-live-evidence.md)——2026-08-21 舊同步路徑的 deployed smoke 與證據邊界
- [Cloudflare Sandbox](https://developers.cloudflare.com/sandbox/)——`@cloudflare/sandbox` SDK、`getSandbox` / `exec` / `readFileStream` / `destroy` 的官方文件
- [Cloudflare Durable Objects — SQLite storage](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/)——`RunCapability` 用 `ctx.storage.transaction` 做 atomic 預算扣減的底層
- [Cloudflare Workers — Container bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/)——`wrangler.jsonc` 的 `containers` 區段如何把 Sandbox Docker image 接到 Worker
- [HMAC 與 constant-time 比較](https://en.wikipedia.org/wiki/HMAC)——`createRunToken` / `verifyRunToken` / `constantTimeEqual` 的密碼學依據
- [OpenAI Chat Completions API](https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create)——`/internal/v1/chat/completions` 轉發的 wire format 來源,支援 Groq / OpenRouter / 官方 OpenAI
- [Linux capabilities — PR_SET_DUMPABLE](https://man7.org/linux/man-pages/man2/prctl.2.html)——`_harden_linux_process` 阻擋同 UID `/proc/<pid>/mem` 讀取的依據
