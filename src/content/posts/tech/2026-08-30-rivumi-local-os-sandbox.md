---
title: "Rivumi 的 local OS sandbox：macOS、bubblewrap 與 Landlock 如何 fail closed"
date: 2026-08-30
category: tech
type: deep-dive
tags: [rivumi, coding-agent, sandbox, bubblewrap, landlock, seccomp]
lang: zh-TW
tldr: "Rivumi 可把指定的 local command／verification 包進 macOS sandbox-exec、Linux bubblewrap 或 Landlock/seccomp。需要的 backend 不存在時以 exit 126 停止，不直接裸跑；但這個範圍不涵蓋 external CLI、MCP/LSP 或整個 Rivumi process。"
description: "追蹤 Rivumi verification sandbox profile 如何解析成 macOS sandbox-exec、Linux bubblewrap 或 Landlock/seccomp wrapper，並說清楚 fail-closed 與適用範圍。"
series:
  name: "Rivumi 架構拆解"
  order: 10
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-30-rivumi-local-os-sandbox-en)

[上一篇](/posts/tech/2026-08-30-rivumi-permission-layering)決定一個 command 有沒有 authority。通過 permission 之後，程序仍可能讀 host 檔案、開子程序或碰到網路。Rivumi 的 local OS sandbox 把部分 command execution 再包進平台限制，讓「允許執行」不等於「取得目前帳號的完整權限」。

## 同一個 verification profile，三種 backend

`resolve_command_sandbox()` 目前接受 `verification` profile 與 `auto`、`bubblewrap`、`landlock` backend。workspace 與 task home 可讀，task home 與工作目錄是可寫 root；所有路徑在產生 wrapper 前先正規化。

macOS 的 auto backend 產生 `sandbox-exec` profile。profile 以 deny default 起始，開放 process、必要的 metadata/sysctl read，再對固定系統位置與設定 roots 開 read，對工作目錄與 write roots 開 write。profile 沒有開放 network 規則，因此不能把「command 已獲准」誤讀成任意連線權。

Linux auto 先找 bubblewrap。wrapper 使用 `--unshare-all`、new session、唯讀 bind 與可寫 bind，並提供獨立 `/tmp`。若 bubblewrap 不可用，auto 可以選擇 Rivumi 的 Landlock wrapper：先設定 `no_new_privs`，套 filesystem rules，再依 x86_64／aarch64 套 seccomp syscall 限制，最後才 `exec` 目標 argv。

## Backend 缺少時不會偷偷裸跑

如果使用者明確指定 bubblewrap 但 executable 不存在，或平台不支援要求的 backend，`sandboxed_command_argv()` 回傳錯誤。`run_bounded_command()` 將它投影成 exit 126，不執行原 command。Landlock policy 或 seccomp 初始化失敗也在 `exec` 之前結束。

fail-closed 是 sandbox 最關鍵的 contract。若缺少 sandbox 時自動退回 unsandboxed execution，設定檔看起來有保護，實際執行卻沒有，會比明確失敗更危險。

## 這不是全程 VM

Rivumi 只在有配置 wrapper 的 local command／verification execution path 套這層限制。Python 主程序、TUI sidecar、external coding CLI、MCP server、LSP process 與遠端 runtime 不會因此自動被包進同一個 sandbox。

另外，Landlock 與 seccomp 的能力受 Linux kernel 與 CPU architecture 影響；macOS profile 和 bubblewrap 的具體 system roots 也由程式設定。這是一組可測的本地 command boundary，不是對 hostile repository 的通用虛擬機保證。

通過 sandbox 後，複數 tool call 如何安排順序、平行化與失敗回復，是 [下一篇 tool programs 與 transactions](/posts/tech/2026-08-30-rivumi-tool-program-transactions)的主題。

---

## 參考資料

- [runtime sandbox source](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/runtime.py)
- [Landlock/seccomp wrapper](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/landlock_run.py)
- [sandbox-focused runtime tests](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/tests/test_runtime.py)
- [bubblewrap project](https://github.com/containers/bubblewrap)
- [Linux Landlock documentation](https://docs.kernel.org/userspace-api/landlock.html)
