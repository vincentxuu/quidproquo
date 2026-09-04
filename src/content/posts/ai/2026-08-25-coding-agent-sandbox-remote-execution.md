---
title: "跟成熟 coding agent 學設計（11）：沙箱與遠端執行——Cloudflare Sandbox 部署實戰"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 11
tags: [coding-agent, harness-engineering, sandbox, cloudflare-workers, durable-objects, sse]
lang: zh-TW
description: "拆解 Codex、Claude Code、OpenCode、Pi、OMP 五家的沙箱策略：本地 OS 級沙箱與雲端沙箱其實是兩種問題。對照 looplane 用 Cloudflare Worker control plane + Durable Object + Sandbox binding 做遠端執行的實戰，包括 SSE file stream 解碼與 stale wheel 兩個真實踩坑。"
tldr: "本地沙箱管的是『agent 在你的機器上爆炸半徑多大』，雲端沙箱管的是『怎麼把程式碼安全地搬到別人的機器上跑』——五家成熟專案幾乎都在做前者，只有 looplane 真的部署了後者。實戰教訓：mock 測不出 SSE framing、CI 綠燈擋不住 stale wheel，而清理路徑要跟成功路徑一樣有 timeout。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-sandbox-remote-execution-en)

## 設計問題

Agent 要跑模型生成的程式碼，第一反應是「加個沙箱」。但沙箱其實是兩個不同的問題：

**本地沙箱**問的是：agent 在使用者的機器上執行指令時，爆炸半徑怎麼壓？防線是作業系統——Seatbelt、Landlock、restricted token。**遠端沙箱**問的是完全不同的事：把程式碼搬到一台用完就丟的機器上跑，憑證怎麼不落地？run 的生命週期誰管？結果怎麼安全地傳回來？

五家參考專案幾乎都只回答了第一題。第二題要等你自己部署才知道水有多深——這篇就是 looplane 跳下去之後的紀錄。

## 五家怎麼做

### Codex：OS 級沙箱，按平台分流

Codex 的沙箱完全是本地的。`codex/codex-rs/sandboxing/src/manager.rs#get_platform_sandbox` 按編譯目標選後端：macOS 用 Seatbelt、Linux 用 seccomp（配 Landlock）、Windows 用 restricted token。Linux 側 `codex/codex-rs/linux-sandbox/src/landlock.rs#set_no_new_privs` 先設 `no_new_privs` 再套檔案系統規則，Windows 則有獨立 crate `windows-sandbox-rs/src/lib.rs#run_windows_sandbox_capture`。三個平台三套實作，但沒有一套涉及「把程式碼送到雲上」。

### Claude Code：沙箱變成 bash 指令的前置判定

Claude Code 也是本地路線：`claude-code-source/src/tools/BashTool/shouldUseSandbox.ts` 在每次 bash 呼叫前決定這條指令要不要進沙箱，底層由 `claude-code-source/src/utils/sandbox/sandbox-adapter.ts` 的 SandboxManager 對接 macOS 的 `sandbox-exec` 與 Linux 的 bubblewrap。值得注意的是它的誠實註解：排除清單（excludedCommands）明說不是 security boundary，真正的控制是 permission prompt。

### Pi：本體不內建沙箱，外包給擴充功能

Pi 的 core 完全不管隔離，官方範例 `pi-mono/packages/coding-agent/examples/extensions/sandbox/index.ts` 示範用 `@anthropic-ai/sandbox-runtime` 把 bash 包進 sandbox-exec／bubblewrap。有個細節很值得看：`pi-mono/packages/coding-agent/src/bun/restore-sandbox-env.ts#restoreSandboxEnv` 處理了一個真實 bug——Bun 編譯的二進位檔在沙箱環境裡 `process.env` 是空的，得從 `/proc/self/environ` 救回來。「你的程式碼必須能在沙箱裡活著」本身就是一個工程問題。

### OMP：快照隔離，不是安全邊界

OMP（pi fork）的 `oh-my-pi/crates/pi-iso/src/apfs.rs` 用 APFS clonefile 做 workspace 快照、`btrfs.rs` 用 subvolume——目的是實驗可 rollback，不是擋惡意程式碼。隔離與安全的責任線劃得很清楚。

### OpenCode：「containers」目錄其實是 CI 映像

這是我查證時修正自己的一次：OpenCode 的 `opencode/packages/containers/` 看名字以為是 agent 執行沙箱，讀了 README 才知道是給 GitHub Actions 用的預建映像——`base/Dockerfile` 就是 Ubuntu 24.04 加 build tools，`script/build.ts` 推到 ghcr.io 加速 CI。它沒有內建的不可信程式碼沙箱。這也是個提醒：看到「container」三個字先問是誰在什麼場景跑什麼。

## looplane 的選擇與踩坑

looplane M6 選了第二題：真的把 Python agent loop 部署到 Cloudflare。架構分三層：

**Worker 是 control plane，不是 agent。** `cloudflare/wrangler.jsonc` 定義 Worker `looplane-control-plane`、一個 `lite` 容器 class、兩個 Durable Object binding。請求契約極窄：`cloudflare/src/control-plane.ts#validateRunRequest` 只收 UTF-8 文字檔 map、白名單 argv 的四條檢查指令（`ALLOWED_CHECK_ARGV`）、以及大小上限；Git 憑證、任意 shell、自選映像全部進不來。

**Durable Object 管 capability 生命週期。** `cloudflare/src/capability-do.ts#RunCapability` 用 SQLite DO 做 per-run 的啟用、原子性扣款（`maxSteps + 2` 次模型請求預算）、到期與撤銷。模型 API key 只活在 Worker secrets，容器裡的 agent 拿到的只是一枚短命 HMAC run token，audience 綁死內部 proxy 路徑。

**容器內最小權限。** 入口固定為 `FIXED_COMMAND`（`/usr/local/bin/looplane-sandbox-run`），root-owned wrapper 用 `setpriv --reuid=looplane --no-new-privs` 降權後才交給 Python；token 寫成 owner-only 檔案而非環境變數，Python 側 `sandbox_entry.py#_read_and_remove_run_token` 讀完立即 unlink，並用 `PR_SET_DUMPABLE 0` 關掉 dumpability。基礎映像 pin 到 digest。

然後是真實部署教會我的事，兩件事 mock 全都沒抓到：

**SSE framing。** 上線第一次真實 run 就失敗：Sandbox SDK 的 `readFileStream()` 回傳的不是裸檔案位元組，而是 [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) 框架——直接當 JSON parse 當然炸。修法是改用官方 `streamFile()` 解碼器（見 `cloudflare/src/index.ts` 的 `decodeFileStream`），而且 byte cap 要套在**解碼後**的內容上，不是原始串流。commit `0b65df9`。

**Stale wheel。** 容器映像裡烤的是 Python wheel，但 `wrangler deploy` 不會幫你重建 wheel——CI 全綠也可能部署三天前的舊版。修法是把重建寫進部署生命週期：`cloudflare/package.json` 的 `"deploy"` 強制先跑 `build:runtime` 再 Wrangler 打包。commit `cebe5c9`。

另外一個設計原則：**清理路徑跟成功路徑一樣有界**。`destroySandboxBounded` 和 `revokeCapabilityBounded` 各自包了 timeout，任何清理失敗會把一個原本成功的回應換成 500——因為留著一枚未撤銷的 capability 比「這次 run 失敗」嚴重得多。

## 工程依據

[Cloudflare Sandbox SDK](https://developers.cloudflare.com/sandbox/) 的核心模型是一個 Durable Object class 即一台容器：Worker 用 [Containers](https://developers.cloudflare.com/containers/) binding 取得 `getSandbox()` handle，每個 instance 有自己的檔案系統與 exec 介面，生命週期由平台管理。looplane 把 run id 直接當 sandbox id，於是「一 run 一拋棄式容器」不需要自己寫排程器。capability 的強一致性需求（同一 run 的預算扣款不能 race）正是 [Durable Objects](https://developers.cloudflare.com/durable-objects/) 的設計用途——單點序列化，SQLite storage 保狀態。SSE 則是這類 SDK 常見的串流傳輸選擇，事件框架的代價就是消費端必須用對應的 decoder，MDN 對 [EventSource 資料格式](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)的描述可以直接對照 `streamFile()` 的輸入格式。

## 改善路線

按優先順序：

1. **Egress 網路政策。** 目前容器能自由連外，hostile code containment 明確不在保證範圍內。下一步至少把模型流量收斂到內部 proxy、其餘預設拒絕。
2. **非同步化。** 端點是同步的，240 秒 timeout 限制了 run 的上限。durable queue + status/cancel API 是顯然的下一站。
3. **多實例與暖池。** `max_instances: 1` 意味著一次只服務一個 run；冷啟動延遲也全靠使用者等待。
4. **保留本地沙箱這條線。** Codex 的 Landlock/seccomp 藍圖仍然適用——就算跑在容器裡，容器內的 process 也該有第二道牆。「雲端沙箱」不是跳過本地沙箱的理由，是多買了一層保險。

一句話總結：五家教的都是怎麼在**你的**機器上縮小爆炸半徑；遠端執行要多回答三個新問題——憑證不落地、生命週期有人管、回傳通道要解碼——而這三題只有在真的部署之後才會變成具體的 bug。

## 參考資料

- [Cloudflare Sandbox SDK](https://developers.cloudflare.com/sandbox/)
- [Cloudflare Containers](https://developers.cloudflare.com/containers/)
- [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)
- [MDN — Server-Sent Events（EventSource 資料格式）](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [openai/codex — codex-rs/sandboxing 與 linux-sandbox](https://github.com/openai/codex/tree/main/codex-rs/sandboxing)
- [anthropics/claude-code](https://github.com/anthropics/claude-code)
- [sst/opencode — packages/containers](https://github.com/sst/opencode/tree/main/packages/containers)
- [badlogic/pi-mono — sandbox extension 範例](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent/examples/extensions/sandbox)
