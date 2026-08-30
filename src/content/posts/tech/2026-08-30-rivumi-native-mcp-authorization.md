---
title: "Rivumi 的 Native MCP：transport、authorization 與 approval 邊界"
date: 2026-08-30
category: tech
type: deep-dive
tags: [rivumi, coding-agent, mcp, oauth, tool-safety]
lang: zh-TW
tldr: "Rivumi 只有在明確 allowlist 後才載入專案 MCP server，將 stdio 或 Streamable HTTP 能力投影到既有 ToolExecutor，再沿用 hook、approval、timeout 與 cleanup 邊界。"
description: "追蹤 Rivumi Native MCP 從設定載入、stdio／Streamable HTTP、tools/resources/prompts 投影，到 OAuth PKCE、approval 與 client cleanup 的完整資料流。"
series:
  name: "Rivumi 架構拆解"
  order: 14
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-30-rivumi-native-mcp-authorization-en)

[上一篇](/posts/tech/2026-08-30-rivumi-context-compaction)處理長 session 的 context 壓力。接下來要把外部 capability 接進 coding agent 的 native loop：[Rivumi](https://github.com/vincentxuu/rivumi) 支援 MCP，但專案裡出現 `.mcp.json`，不代表裡面的 command 會立刻執行。

## 設定檔不是啟動授權

`load_native_mcp_server_configs()` 先讀 `RIVUMI_MCP_ALLOWLIST`。預設 allowlist 是空的，因此專案設定不會啟動任何 server；只有名稱明確列入後，對應設定才會進入 `ToolExecutor`。

每個 server 只能選一種 transport：argv 形式的 stdio subprocess，或 absolute URL 的 HTTP client。HTTP 不接受 URL credentials、query、fragment，也不跟 redirect；未加密 HTTP 只允許 loopback。stdio 則用 sanitized environment 加上設定中明列的變數啟動。這些檢查縮小誤連線與環境外洩面，但 allowlist 一個 stdio server，仍等於授權 Rivumi 在 host 啟動那條 command；MCP client 本身不會替它建立 OS sandbox。

## 兩種 transport，回到同一個 executor

stdio client 以逐行 JSON-RPC 溝通；HTTP client 用 Streamable HTTP POST，response 可以是 JSON，也可以是 `text/event-stream`。這裡的 SSE 是 HTTP response 的表示方式，不是另一條 legacy SSE transport。

initialize 完成後，client 會分頁列出 tools、resources 與 prompts。遠端 tool 以 `mcp__<server>__<tool>` 加入動態 definitions；resources 與 prompts 則各自透過固定的 list/read、list/get bridge 進入 executor。模型看到的介面不同，最後都回到既有 tool call 路徑：pre-tool hook、permission approval、bounded observation 與 journal event，不會另開一條無治理的捷徑。

```text
.mcp.json + explicit allowlist
  -> stdio process | Streamable HTTP client
  -> tools + resource/prompt bridges
  -> ToolExecutor
  -> hooks -> approval -> bounded result
```

## Authorization 不等於 trust

HTTP server 可以從環境變數讀 bearer token，也可以使用 operator 預先設定的 authorization-code flow。Rivumi 產生 PKCE S256 verifier、state 與 callback，交換 access token；本機 credential file 拒絕 symlink，權限必須是 `0600`，寫入時使用暫存檔與 atomic replace。

這份實作仍有清楚邊界：沒有觀察到 dynamic client registration，也沒有自動 refresh-token exchange。protected-resource discovery 只找 metadata，不會替 operator 補完 OAuth 設定。換句話說，它實作的是一條受控登入路徑，不是完整 OAuth 平台。

Approval 也採保守預設。未知 MCP tool 視為 execute；只有遠端 annotations 同時表明 `readOnlyHint: true` 且不是 destructive，才會降為 read。annotation 是 server 提供的 hint，不是安全證明。固定的 resource／prompt bridge 雖標成 read-only，取回的文字仍是不受信任輸入。

## Session 結束前要收乾淨

MCP response、分頁、輸出與等待時間都有上限。stdio request timeout 會關閉 process；HTTP client 保存 server 回傳的 session ID，後續 request 帶回。turn 之間可刷新 tool definitions，runner 的 finalizer 最後呼叫 `ToolExecutor.close()`，逐一關閉 client，避免 server process 留在背景。

Native MCP 的重點不是「能連多少 server」，而是外部能力接進來後，仍服從原本的 executor 與 authority 邊界。[下一篇](/posts/tech/2026-08-30-rivumi-skills-hooks-plugins)會拆開另一組常被混在一起的擴充機制：skills、blocking hooks 與 plugin packages。

---

## 參考資料

- [MCP client and authorization implementation](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/mcp_client.py)
- [ToolExecutor MCP projection and cleanup](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/tools.py)
- [MCP approval classification](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/approvals.py)
- [Native loop integration](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/loop.py)
- [MCP client tests](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/tests/test_mcp_client.py)
