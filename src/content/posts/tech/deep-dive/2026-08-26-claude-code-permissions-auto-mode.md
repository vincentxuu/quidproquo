---
title: "讓 Claude Code 自主到什麼程度：permission modes、auto mode 分類器與 allow/deny rules"
date: 2026-08-26
type: deep-dive
category: tech
tags: [claude-code, permissions, auto-mode]
lang: zh-TW
tldr: "Claude Code 共有六個 permission mode，日常主要在 Manual、Accept edits、Plan、Auto 四個之間用 Shift+Tab 切換；Pro／Max／Team 方案預設進入 auto mode，由背景分類模型審查每個動作，預設攔下 force push、`curl | bash`、production deploy 等風險操作。本文講四個模式的取捨、permission rules 的寫法，以及組織層的 trust config。"
description: "從每步都問到全不問的光譜：拆解 Claude Code 四個 permission mode、auto mode 分類器的預設封鎖清單、allow/deny/ask rule 語法與 managed settings 的組織治理。"
draft: true
series:
  name: "Claude Code 深入介紹"
  order: 7
---

> 🌏 [English version](/posts/tech/deep-dive/2026-08-26-claude-code-permissions-auto-mode-en)

上一篇[系列入口](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works)提到，checkpoints 和 permission modes 是 Claude Code 的兩道安全防線。這篇把第二道展開：它解決的是一個兩難——每次動作都問你，長任務會被提示打斷到失去耐心；完全不問，你又等於把檔案系統和終端機整台交出去。Permission modes 就是這兩個極端之間的刻度。

## 四個模式構成的光譜

按 `Shift+Tab` 會在模式間循環切換，狀態列顯示目前所在位置。官方文件列出六個值，但日常會碰到的主要是四個：

| 模式（config 值） | 不問你就先做什麼 | 適合 |
|------|------|------|
| Manual（`default`） | 只有讀取 | 敏感工作、不熟的 codebase |
| Accept edits（`acceptEdits`） | 讀取、改檔案、常見檔案指令（`mkdir`、`mv`、`cp` 等），限工作目錄內 | 一邊跑一邊用 git diff 事後審 |
| Plan（`plan`） | 只探索和提計畫，編輯被封鎖直到你核准計畫 | 動手前先看懂現場 |
| Auto（`auto`） | 幾乎所有事，但每個動作先過一道背景分類器 | 長任務、減少提示疲勞 |

另外兩個是邊界案例：`dontAsk` 不出現在 Shift+Tab 循環裡，只放行預先核准的工具，給鎖死 allowlist 的 CI 用；`bypassPermissions` 則跳過所有權限提示——那是另一篇文章的主題，結尾會談。

幾個細節值得知道：Manual 在 UI 上叫 Manual，但 config 值是 `default`，CLI 也接受 `manual` 別名；`auto` 從專案的 `.claude/settings.json` 設定不生效，要放在 `~/.claude/settings.json`；寫入 protected paths（如 `.git`、`.claude`）在任何模式下都不會被自動核准。

## Auto mode 怎麼運作

Auto mode 的核心不是「不檢查」，而是把檢查者從你換成一個獨立的**分類器模型**：每個動作執行前先送審，攔下超出任務範圍、指向陌生基礎設施、或疑似被 Claude 讀到的惡意內容驅動的操作。在 Pro／Max／Team 方案，它是 v2.1.228 起（Windows 為 v2.1.233）互動 session 的內建起始模式；首次以 auto mode 開 session 時會顯示通知並連到說明頁。

分類器有一份很長的預設封鎖清單，包括：

- 下載即執行（`curl | bash`）、把敏感資料送到外部端點
- production 部署與 migration、雲端儲存的大量刪除、授予 IAM 或 repo 權限
- force push、`git reset --hard` 這類丟棄未 commit 變更的操作、`terraform destroy`
- commit 或 push 會在執行時把 secret 送出 repo 的變更

預設放行的則包括：工作目錄內的檔案操作、安裝 lockfile 宣告的依賴、讀 `.env` 並把憑證送給對應 API、唯讀 HTTP 請求，以及 push 到目前工作 repo 的任何分支。想看完整清單可以跑 `claude auto-mode defaults`。

分類器內部有四層優先序：`hard_deny` 無條件擋（使用者意圖和例外規則都不適用）→ `soft_deny` 可被明確的使用者意圖覆蓋（「清理一下 repo」不算授權 force push，「force-push 這個分支」才算）→ `allow` 規則作為 soft block 的例外 → 其餘放行。而 `permissions.deny` 又在分類器之前評估——它在**所有**模式下都生效，包括 bypassPermissions，是最硬的一道。

官方文件對此模式的警告值得原樣引用：

> Auto mode reduces permission prompts but does not guarantee safety. Use it for tasks where you trust the general direction, not as a replacement for review on sensitive operations.

## 用 permission rules 微調

Mode 決定基線，[permission rules](https://code.claude.com/docs/en/permissions) 疊在上面處理個案。規則格式是 `Tool` 或 `Tool(specifier)`，分成 allow（免問）、ask（強制問）、deny（禁止）三種，評估順序固定為 deny → ask → allow，規則再具體也改不了這個順序：

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(git commit *)"
    ],
    "ask": ["Bash(gh pr create *)"],
    "deny": ["Bash(git push *)", "Read(./.env)", "WebFetch(domain:evil.example)"]
  }
}
```

幾個寫法要點：`*` 放在子命令之後——`Bash(git log *)` 只放行 `git log` 系列，`Bash(git *)` 等於放行所有 git 操作；`Read` 和 `Edit` 規則用 gitignore 語法，`Read(./.env)` 一條就能連帶擋掉同路徑的編輯和新建檔；deny 一條裸工具名（如 `"WebFetch"`）會把工具整個從 Claude 的 context 移除。特別重要的是 **ask 規則連 auto mode 都會強制跳出提示**——想要「其他全自動、push 前一定要過人」就是靠它。

## 組織層治理

個人偏好之上還有第四層：managed settings。管理員可以在這層設定 `permissions.defaultMode` 統一起始模式，用 `disableBypassPermissionsMode` 或 `disableAutoMode` 設成 `"disable"` 直接移除對應模式——被移除的 `auto` 連 Shift+Tab 都不再出現，`--permission-mode auto` 起動的 session 會退回 Manual。

Auto mode 自己還有一套組織級 trust config，就是 [`autoMode`](https://code.claude.com/docs/en/auto-mode-config) 設定區塊。核心概念是 `autoMode.environment`：預設分類器只信任工作目錄和 repo 既有的 remotes，推到公司其他 repo、寫入團隊的 cloud bucket 都會被擋，直到你用自然語言條列哪些 repos、buckets、domains 是可信的：

```json
{
  "autoMode": {
    "environment": [
      "$defaults",
      "Source control: github.example.com/acme-corp and all repos under it",
      "Trusted internal domains: *.corp.example.com"
    ]
  }
}
```

安全設計上有一點很聰明：分類器**不讀**專案層的 `.claude/settings.json` 裡的 `autoMode`，只接受 user settings、managed settings 和 `--settings` 旗標三個來源——因為專案目錄裡的檔案可能來自別人 check-in 的 repo，不能讓 repo 替自己擴大信任範圍。個人可以追加條目，但刪不掉 managed settings 給的條目；要絕對不可逾越的邊界，還是用前一節的 `permissions.deny` 放 managed settings。

## 怎麼選

我的實際用法：不熟的 codebase 先 Plan，看懂了切 Accept edits 邊跑邊審 diff；信任的專案和長任務直接 Auto，配一條 `Bash(git push *)` 的 ask rule 當人工關卡；碰到金流、資料庫 migration 這類出了事 rewind 也救不回來的操作，回到 Manual。Auto mode 的分類器大幅降低了自主的風險，但它降低的是「意外」，不是「你本來就不該放手的那件事」。

順帶一提：如果你心裡想的是「何必分級，直接全關最快」，那正是 `--dangerously-skip-permissions` 的世界。想走那條路之前，先看[繞過所有權限提示的代價分析](/posts/tech/2026-03-16-claude-code-dangerously-skip-permissions)（[English](/posts/tech/2026-03-16-claude-code-dangerously-skip-permissions-en)）——那篇講的是這條光譜最右端的成本。

## 參考資料

- [Choose a permission mode — Claude Code Docs](https://code.claude.com/docs/en/permission-modes.md) — 六個模式的行為對照、Shift+Tab 切換細節、auto mode 分類器的預設封鎖與放行清單
- [Configure permissions — Claude Code Docs](https://code.claude.com/docs/en/permissions.md) — allow/ask/deny rule 語法、萬用字元比對規則、評估順序
- [Configure auto mode — Claude Code Docs](https://code.claude.com/docs/en/auto-mode-config.md) — `autoMode.environment` trust 設定、hard/soft deny 分層、managed settings 的組織控制

## 更新紀錄

- 2026-08-26：初版，依 2026-08 官方文件撰寫（auto mode 為 Pro/Max/Team 預設起始模式，Manual label 需 v2.1.200+）。
