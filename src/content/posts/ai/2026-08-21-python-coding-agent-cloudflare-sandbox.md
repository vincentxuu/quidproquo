---
title: "用 Python 寫私人 coding agent：M6 把 AgentRunner 部署到 Cloudflare Sandbox"
date: 2026-08-21
category: ai
tags: [coding-agent, python, cloudflare, sandbox, durable-objects, agent-harness]
lang: zh-TW
type: project
tldr: "Worker 不必重寫 agent loop；讓它負責驗證、能力憑證與 provider secret，Python AgentRunner 留在一次性 Sandbox，才能同時保留既有 harness 與雲端邊界。"
description: "Python coding agent M6 實戰：用 Cloudflare Worker、Sandbox 與 Durable Object 部署既有 agent loop，並從真實 E2E 找出 SSE file stream 與 stale wheel 問題。"
draft: false
glossary:
  - term: run capability
    definition: "只允許單一 run、單一 model、有限次數且短時間有效的模型代理憑證；它不是 provider API key。"
---

## TL;DR

M6 沒有用 TypeScript 重寫 agent，而是把既有 Python `AgentRunner` 打包進 Cloudflare Sandbox。Worker 只當 control plane：驗證 bounded source、固定 model 與 exact checks，保管 provider key，再用短效 run capability 讓 Sandbox 呼叫內部模型 proxy。真實部署最後完成 calculator 修正、`pytest` 與完整 artifacts；過程也抓出本地 mock 看不到的 SSE file stream，以及裸 `wrangler deploy` 可能沿用舊 wheel 的問題。

## 情境

前五個階段已經有互動 CLI、approval、checkpoint、精準 edit、Ollama／API provider，還能把官方 Codex 與 Claude CLI 當本機 delegated backend。但「本機能跑」和「雲端 agent 服務」不是同一件事。Cloudflare 上需要 HTTP auth、provider secret、Container lifecycle 與輸入輸出上限；如果為此另寫一套 loop，之前累積的 policy、verification 與 artifacts 都會分叉。

所以這次的原則是：**Worker 協調，Sandbox 執行，Python harness 仍是唯一 agent core。**

## 問題

最初版本已有限時 HMAC token，獨立 review 仍找到關鍵缺口。token 放在 process environment，同容器的 repository check 可能從 process metadata 取得；而 token 只驗簽章與五分鐘期限，沒有 request quota，也無法在 run 結束立刻撤銷。另一邊，SDK 的 `mkdir`、`writeFile` 與 `exec` 即使回 `{success:false}`，若只等 Promise 不看欄位，控制面仍可能繼續執行。

短效不等於有界，沒有狀態的 capability 也不等於一次性。

## 解法

最終路徑是：

```text
caller
  → Worker: auth + source/path/check/model bounds
  → Durable Object: activate run + atomic request budget
  → Sandbox: fixed root-owned wrapper → non-root Python AgentRunner
  → Worker model proxy: capability + model pin → Groq API
  → exact result/check/path validation → revoke → bounded destroy
```

Worker 只接受小型 UTF-8 file map，不收 Git URL、archive、shell command、provider credential 或 caller-selected upstream。模型 key 永遠留在 Worker secret。Sandbox 只收到 `.pca-run-token`：wrapper 把 workspace 交給專用 `pca` user、設成 `0600`，Python 關閉 process dumpability 後讀取並立即 unlink。Durable Object 再把 token 綁到 active run、model、expiry 與 `maxSteps + 2` 次請求；teardown 前 revoke，簽章仍有效也不能重播。

completed response 不能只看 `ok: true`。Worker 會逐項比對 request 裡的 check 名稱、argv、exit status，changed files 也必須落在 allowed paths。capability revoke 與 Sandbox destroy 各自有 timeout；清理失敗會蓋掉原本的成功，避免回傳一個其實還沒收尾的 201。

## 真實部署才看到的錯

第一個 remote run 回 `invalid_sandbox_response`，但相同 image 在 Docker 裡直接跑是成功的。根因不是模型，而是 Cloudflare Sandbox SDK：`readFileStream()` 傳回的是 SSE framing，本地 mock 卻直接吐 raw JSON。Worker 把 transport 當檔案解析，當然永遠失敗。修正後改用官方 `streamFile()` 逐 chunk 解碼，byte cap 也套在解碼後的檔案內容；新的 regression 特別讓底層 stream 是 SSE、decoder 才吐 JSON。

第二個坑是部署生命週期。裸跑 `wrangler deploy` 會使用現有 `.artifacts`，Python source 改過卻可能還包舊 wheel。現在正式入口固定是 `npm run deploy`：先從 `uv.lock` 重建 wheel、hash-locked requirements 與 CycloneDX，再交給 Wrangler。base image 也釘 digest；同一份 source／lock 連建兩次得到相同 image ID。

## 結果

最終遠端 run 經過 Worker、Sandbox、內部 model proxy 與 Groq `openai/gpt-oss-120b`，只把 `calculator.py` 的減法改成加法，`python3 -m pytest -q` exit 0，回傳 44 個連續 events、patch、checkpoint、test log 與 result。控制 token 與 provider key 的 exact-value scan 都是 clean。

但這不是「任意惡意 repo 的 production sandbox」。repository check 與 agent 仍共享容器，且 outbound network 尚未封鎖；目前也沒有 durable queue、status/cancel API 或 artifact store。M6 證明的是一條真的可部署、可稽核、成本與能力有界的私人 headless agent 路徑，而不是多租戶平台。

## 學到的事

雲端化 agent 最容易重寫的是 loop，最不該重寫的也是 loop。真正新增的工作是 authority boundary：誰持有 key、誰能選 model、一次 run 能呼叫幾次、結果如何對照原始 contract、失敗後是否真的撤銷與清理。

還有一件老生常談但很真：mock 證明的是你的假設，remote E2E 才會告訴你 SDK 實際傳的是什麼。

---

## 參考資料

- [Cloudflare Sandbox SDK](https://developers.cloudflare.com/sandbox/)
- [Cloudflare Containers](https://developers.cloudflare.com/containers/)
- [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)
- [QuidProQuo：模型只是元件，harness 才是系統](https://quidproquo.cc/posts/ai/2026-08-10-model-component-harness-system)
- [QuidProQuo：prompt injection 只能在 harness 層做損害控制](https://quidproquo.cc/posts/ai/2026-08-10-agent-security-harness-layer)
