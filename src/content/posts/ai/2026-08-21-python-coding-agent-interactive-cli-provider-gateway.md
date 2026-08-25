---
title: "用 Python 寫私人 coding agent：M2 從 demo harness 走到互動 CLI 與 model gateway"
date: 2026-08-21
category: ai
tags: [coding-agent, python, cli, oauth, ollama, model-gateway, harness-engineering]
lang: zh-TW
type: project
description: "Python coding agent 的第二個里程碑：互動 approval、可恢復 session、明確 provider protocol、ChatGPT/Codex OAuth 與 OMP-style model gateway。"
tldr: "真正的 coding-agent CLI 不能只是啟動別人的 CLI；它要自己擁有 loop、approval、session 與 verification，再把 Ollama、API、Codex OAuth 和 model gateway 放在可替換的 transport 層。"
draft: false
---

M1 做完後，我手上有一個會產生 patch、重跑測試、留下 artifact 的 Python harness。但執行方式仍是 demo script 與 headless command。它證明核心 loop 能工作，卻還不是我每天會打開來用的 coding agent。

M2 的問題因此很直接：**怎麼讓裸 `pca` 成為自己的互動式 agent，而不是包一層 shell 去啟動 Codex、Claude Code 或 Ollama？**

## TL;DR

- `pca` 現在直接執行自己的 Python agent loop，會即時顯示 model、tool 與 verification 事件。
- read tool 自動執行；patch 與 repository code execution 必須選 once、session、deny 或 cancel。
- 每個 run 有 versioned `session.json`、append-only events 與 OS writer lock；Ctrl-C 後可以 `pca resume`。
- Pi 與 OpenCode 主要是 client adapter；真正有 HTTP gateway 邊界的是 OMP 的 `auth-gateway`。
- Ollama 是 `openai_chat` protocol 的 local preset；ChatGPT/Codex 則是獨立 OAuth audience 與 `openai_codex_responses`，不能只換 `base_url`。
- 這次真實 Ollama transport 與 gateway 成功，但 0.6B／4B 模型沒有完成 tiny-bug coding eval。這是模型能力失敗，不該包裝成 E2E success。

## 第一個錯誤方向：直接啟動別人的 CLI

最容易的做法，是讓 `pca` 根據參數呼叫：

```text
codex
claude
codex --oss --local-provider ollama
```

這樣確實立刻得到成熟的 UI、登入、approval 與 session。但我的 Python code 只剩 launcher；真正的 messages、tools、permissions、checkpoint 與 verification 都被另一個 agent loop 擁有。

一旦這樣做，前一階段刻意建立的 `ModelProvider`、`ToolExecutor`、path policy 與 artifact contract 全部繞過。更麻煩的是，之後搬到 Cloudflare Sandbox 時，local 與 cloud 根本不是同一套 agent。

所以 launcher 被刪掉。這個專案的邊界改成：

```text
pca / pca run / pca resume
              |
              v
         AgentRunner
          /      \
 approvals       SessionStore
    |                 |
    v                 v
ToolExecutor       artifacts
    |
    v
ModelProvider -> explicit protocol adapter -> model endpoint
```

外部 CLI 可以當參考或測試對象，但不再是預設 runtime。

## Approval 不是 `input()` 塞進 ToolExecutor

如果在 `apply_patch()` 裡直接呼叫 `typer.confirm()`，headless CI 會卡住，core test 也開始依賴 TTY。M2 改成注入 `ApprovalPolicy`：

```python
class ApprovalPolicy(Protocol):
    async def decide(self, request: ApprovalRequest) -> ApprovalDecision: ...
```

每個 tool 有明確 effect：

- `list_files`、`read_file`、`search_text`、`git_diff` 是 read；
- `apply_patch` 是 modify；
- `run_check` 與 harness final verification 是 execute。

互動 CLI 使用 `TTYApprovalPolicy`；headless run 使用永遠不讀 stdin 的 deterministic policy。Approval 只決定是否允許這次 side effect，不能放寬 path allowlist、patch size 或 exact argv。

事件也先寫進 durable JSONL，再投影到 terminal。使用者看到的 `tool requested`、`approval resolved` 與 `check passed` 都有磁碟證據，不是畫面上閃過就消失。

## Resume 不是重新跑一次

M1 已經有 checkpoint，但還不能安全 resume。只把 messages 讀回來不夠：step、usage、repeated-action guard、last verification、event sequence 與正在執行的 action 都可能不同步。

M2 新增 `session.json` 與單一 writer fencing：

- `flock` 才是真正的 OS writer lock；JSON token 只負責擋 stale writer。
- resume 會比對 run ID、task ID、base SHA、provider、wire protocol 與 model。
- `events.jsonl` 必須從 0 連續；正常狀態要和 manifest 一致，只有 manifest 領先一筆的
  state-first crash window 可以自動修復。
- `workspace/` 必須仍是同一個 Git root，HEAD 仍固定在原 base commit。
- terminal session 不能假裝繼續；symlink、event gap、錯誤 JSON 與 concurrent writer 都會 fail closed。

真實 Ollama run 中途按 Ctrl-C 後，`pca resume last` 從下一個 event sequence 接回同一個 workspace。這次不是模擬 pause，而是實際殺掉互動程序再開。

獨立 release review 又逼出兩個不能靠 happy-path 掩蓋的 crash window。現在每筆 event 會先原子保存完整 session state 與預定 sequence，再 append JSONL；若程序正好死在兩者之間，resume 可以辨識並修復「manifest 領先一筆」的狀態。相反地，最後一筆若是 `tool.started` 或 `verification.started`，agent 會拒絕自動恢復，因為它無法證明副作用究竟有沒有完成。卡在 approval prompt，或已核准但尚未寫入 started event 的中斷，則明確記成「未執行」，補上 tool observation 後讓模型重新請求。step、累積 wall time 與 session approval grant 也不會因重啟重置。

## Pi、OpenCode、OMP 到底是不是反向代理

實際讀 source 後，答案比「都是 OpenAI-compatible」細很多。

Pi 與 OpenCode 的常態做法是 **client adapter**：在 process 內選 provider protocol、base URL 與 credential。`baseURL` 的意思是「把這個 client 的 request 送到另一個 upstream」，不是它自己開始監聽 HTTP port。

OMP 除了相同的 adapter core，還有真正的 `auth-gateway`。它接受 Chat Completions、Responses 或 Anthropic Messages，先轉成 neutral context，再走 provider adapter，最後編碼回外部 wire：

```text
foreign HTTP wire
  -> strict parser
  -> canonical messages / tools
  -> provider adapter
  -> canonical model turn
  -> foreign HTTP wire
```

它刻意不提供 raw arbitrary-URL passthrough。否則 request 可以變成 SSRF，provider token 也可能被送到攻擊者指定的 host。

M2 採用這個邊界，新增純 ASGI `ModelGateway`。目前只有 `/healthz`、`/v1/models` 與 non-streaming `/v1/chat/completions`；CLI 只綁 loopback，可設定另一層 Bearer，request body 與 model 都受限。Gateway 是選配 transport wrapper，不是 agent loop。

## ChatGPT/Codex 訂閱不是改 URL

OpenCode、Pi 與 OMP 都把 Codex 定義成獨立 protocol，原因是它需要：

- 自己的 OAuth PKCE grant；
- 固定 ChatGPT/Codex credential audience；
- account routing claim/header；
- Codex Responses request shaping 與 SSE event parsing；
- tool call item ID 與 tool-result replay。

因此 M2 新增 `openai_codex_responses` adapter，並用獨立 0600 credential store 保存這個 application 自己取得的 grant。它不讀 `~/.codex`，也不搬用 Pi、OpenCode 或 Claude Code 的 token。Generic `api_url` 無法取得這份 OAuth bearer。

這條路徑目前仍標為 experimental，必須顯式登入與 opt in。Mock contract 已覆蓋 PKCE、refresh、401 retry、SSE text/tool/usage 與 secret redaction，但這個里程碑沒有拿新 grant 做 live inference，因此不能宣稱 ChatGPT subscription E2E 已通過。

Claude Pro/Max 更保守：OpenCode 現行文件直接寫第三方 subscription plugin 被 Anthropic 禁止，其他專案雖仍有技術實作，政策證據卻不一致。所以這一版只接受 Anthropic API key 或 operator-approved proxy，不做 credential scraping，也不宣稱 Claude plan quota 可供第三方 harness 使用。

## 真實 Ollama 測試教了什麼

我拉了 `qwen3:0.6b` 與 `qwen3:4b`，不是只跑 HTTP mock。

成功的部分：

- adapter 真實回傳 `ADAPTER_OK` 與 usage；
- 強制工具題能正確產生 `read_file(path="src/example.py")`；
- `pca gateway` 的 `/v1/chat/completions` 經 canonical translation 回傳 `GATEWAY_OK`；
- gateway 第一次關閉抓到 cross-event-loop client close bug，改成 ASGI lifespan 後 Ctrl-C 乾淨退出。

沒有成功的部分更重要：

- 0.6B 把 shell snippet 當 patch；approval 阻擋後取消。
- 4B 讀到正確 source，也知道 `left - right` 要改成 `left + right`，但送出 corrupt unified diff。
- 接著模型多次撞 output limit。原本 loop 會把空的 truncated turn 當 final answer、立刻跑 verification；現在 `finish_reason=length` 會要求模型精簡續答，不再誤判完成。

因此 M2 的 live 結論是：**transport、tool schema、approval、resume 與 gateway 有真實證據；4B local model 的完整 coding eval 沒過。** 換更強模型、改善 edit format 或提供弱模型專用 replace tool，應該由下一輪 eval 決定，不該偷偷放寬完成標準。

## 這一階段留下的界線

現在 `pca` 已經像一個真正的 CLI，而不是 demo：它有自己的 loop、即時 trace、approval、session、resume、headless mode、provider protocols 與 model gateway。

這一階段最後固定在 implementation commit `8151447`。commit 前不是只跑目前 worktree：我另外 export exact staged snapshot，在隔離目錄重新跑 Ruff、128 項測試與 wheel/sdist build，再由獨立 reviewer 對 crash recovery 做到最終 GO。

但它仍不是 hostile-code runner。Approval 不會隔離 filesystem 或 network；disposable clone 也不是 OS sandbox。Gateway 尚無 streaming 與 remote TLS；Codex OAuth 尚缺 live grant 與 inter-process refresh fencing；Cloudflare Sandbox deployment 仍是下一階段。

最重要的收穫不是多了幾個 command，而是邊界終於清楚：**CLI 是 agent 的操作介面，provider adapter 是模型 client，model gateway 是 wire translation service。三者不能混成一個「反正能呼叫模型」的黑盒子。**

---

## 參考資料

- [OMP providers](https://github.com/can1357/oh-my-pi/blob/72000acfeb902e21816252699482887f34d1a5a4/docs/providers.md)
- [OMP auth broker and gateway](https://github.com/can1357/oh-my-pi/blob/72000acfeb902e21816252699482887f34d1a5a4/docs/auth-broker-gateway.md)
- [OpenCode providers](https://github.com/anomalyco/opencode/blob/11e8110f9e6863369d361d31f601cecc8202c9c6/packages/web/src/content/docs/providers.mdx)
- [OpenCode Codex OAuth adapter](https://github.com/anomalyco/opencode/blob/11e8110f9e6863369d361d31f601cecc8202c9c6/packages/opencode/src/plugin/openai/codex.ts)
- [Pi custom provider](https://github.com/badlogic/pi-mono/blob/5cd93f688aaab89dbb6dfa4aca535f21796ae185/packages/coding-agent/docs/custom-provider.md)
- [Pi Codex Responses transport](https://github.com/badlogic/pi-mono/blob/5cd93f688aaab89dbb6dfa4aca535f21796ae185/packages/ai/src/api/openai-codex-responses.ts)
- [QuidProQuo：模型只是元件，harness 才是系統](https://quidproquo.cc/posts/ai/2026-08-10-model-component-harness-system)
- [QuidProQuo：prompt injection 只能在 harness 層做損害控制](https://quidproquo.cc/posts/ai/2026-08-10-agent-security-harness-layer)
