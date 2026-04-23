---
title: "用 Claude Code Skill 把 Debug 對話變成 GitHub Issue：/file-bug-issue 的設計"
date: 2026-03-27
type: guide
category: tech
tags: [claude-code, skill, github-issues, bug-tracking, remote-agent, automation, dx]
lang: zh-TW
tldr: "Debug 到一半發現修不了？用 /file-bug-issue 直接把對話中的錯誤分析、重現步驟、已嘗試的方案打包成一個結構完整的 GitHub issue。搭配 Remote Agent，還能讓 AI 自動接手修復。"
description: "介紹自製的 /file-bug-issue Claude Code skill，如何從對話上下文自動收集錯誤資訊並建立結構化的 GitHub issue，以及它如何與 Scheduled Remote Agent 串接形成 bug 追蹤到自動修復的流水線。"
draft: false
series:
  name: "Claude Code 自動化指南"
  order: 16
---

CI 又紅了。PostgreSQL 在跑到第 20 個 schema 檔時 crash，錯誤訊息是 `FATAL: the database system is shutting down`。

花了二十分鐘分析：Docker 預設 `/dev/shm` 只有 64MB，schema 檔案越加越多，shared memory 不夠用。加上 `docker-compose.dev.yml` 掛了 `initdb.d`，啟動時自動跑一次 schema，CI 又手動跑第二次，雙重執行直接把記憶體壓爆。

根因找到了，修法也很清楚（加 `shm_size`、拆 CI 專用 compose、合併 SQL 連線）。但這不是我現在該修的東西——手上有別的任務要做，而且這個修復牽涉到改 CI workflow 和 docker-compose，最好開個 issue 追蹤。

問題是：我剛花了二十分鐘的分析都在 Claude Code 的對話裡。如果我現在跳去 GitHub 手動開 issue，要把錯誤訊息、重現步驟、根因分析、建議修法全部重新打一遍。或者更常見的結果——開了一個只寫「CI schema validation 失敗」的 issue，三天後回來看完全不記得細節。

## /file-bug-issue

所以做了一個 skill。在 debug 對話中直接說 `/file-bug-issue`，它會：

1. **從對話上下文自動收集**——錯誤訊息、重現步驟、已嘗試的修復、相關檔案、環境資訊
2. **問你要開到哪個 repo**——用 `gh repo view` 驗證存取權限
3. **預覽 issue 內容**——讓你確認或調整
4. **`gh issue create`**——建立帶 `bug` label 的 issue

整個過程不到一分鐘。出來的 issue 長這樣：

```markdown
## 錯誤描述

CI Pipeline 在 "Validate Schema SQL on pg-dev" 步驟中，
執行到 190_create_table_user_join_group.sql 時，PostgreSQL 異常關閉：

    psql: error: connection to server failed:
    FATAL:  the database system is shutting down

## 重現步驟

1. 對 main 或 dev branch 開 PR
2. CI 觸發 ci-postgres.yml workflow
3. Schema validation step 依序執行 ./schema/*.sql
4. 執行到第 20 個檔案時失敗

## 根因分析

Docker 預設 /dev/shm 只有 64MB...（完整分析）

## 建議修復方向

- [ ] docker-compose.dev.yml 加上 shm_size: 256mb
- [ ] CI 使用獨立的 compose override 檔
- [ ] Schema validation 改用單一連線執行
- [ ] CI workflow 加 failure debug step
```

重點是：**所有 debug 過程中累積的 context 都保留了**。不是事後補寫的模糊記憶，是當下的完整分析。

## 設計取捨

### 為什麼不用 GitHub issue template？

GitHub issue template 適合外部使用者回報 bug——他們不知道你的 codebase，需要一個結構化的表格引導他們提供資訊。

但開發者自己開的 bug issue 不一樣。你已經在 debug 了，錯誤訊息就在眼前，根因分析已經做完。這時候需要的不是空白模板，而是有人幫你把散落在對話裡的資訊整理成文件。

### 為什麼是 skill 而不是 hook？

Hook 適合自動觸發的防禦性動作（擋住壞 commit、自動格式化）。但「開 bug issue」是一個需要人類判斷的動作——不是每個錯誤都值得開 issue，issue 內容也需要確認。所以做成 skill，由人類主動觸發。

### 繁體中文 + 原文錯誤訊息

Issue 內容用繁體中文寫（我們團隊的慣例），但錯誤訊息、指令、程式碼保持英文原文。這很重要——翻譯錯誤訊息會讓它變得無法搜尋。`FATAL: the database system is shutting down` 翻成「致命錯誤：資料庫系統正在關閉」，Google 就搜不到了。

## 跟 Remote Agent 串接

這才是有趣的部分。

之前寫過 [Remote Agent 自動開發的流程](/posts/tech/deep-dive/2026-03-27-remote-agent-auto-dev-pipeline)——用 `/publish-tasks` 把 OpenSpec 的工程任務發成帶 `auto` label 的 GitHub issues，Scheduled Remote Agent 每 2 小時掃描、自動實作、開 PR。

`/file-bug-issue` 建立的 issue 目前標的是 `bug` label，不是 `auto`。這是刻意的——不是每個 bug 都適合讓 AI 自動修。但如果你判斷這個 bug 的修法很明確（像上面的 CI 問題，就是加一行 `shm_size: 256mb`），可以手動加上 `auto` label，Remote Agent 下一輪掃描就會接手。

```
Debug 對話
    ↓
/file-bug-issue → GitHub Issue (bug label)
    ↓
人類判斷：AI 能修嗎？
    ↓
Yes → 加 auto label → Remote Agent 自動修 → 開 PR
No  → 留給人類處理
```

這比直接讓 AI 自動修所有 bug 安全。有些 bug 的修法涉及架構決策、跨專案協調、或者根本需要更多資訊才能判斷怎麼修。人類先過濾一層，AI 再執行。

## 適合的使用時機

不是所有 bug 都要開 issue。這些情境最適合：

| 情境 | 為什麼適合 |
|------|-----------|
| CI 持續失敗 | 根因分析完了但修復需要時間或協調 |
| 環境問題 | Docker、雲端、第三方服務，通常不是改一行 code 就好 |
| 跨專案 bug | 需要其他子專案配合修改，不是自己能搞定 |
| 非緊急但會忘 | 不阻塞當前開發，但三天後一定忘光 |

不適合的情境：你正在修的 bug（直接修就好，不需要開 issue）、一行就能修的 typo、已經有人在處理的問題。

## Skill 的本體

整個 skill 其實很短，核心邏輯就是告訴 Claude 該收集什麼、按什麼格式整理、用什麼指令建立 issue。它不是一個程式，而是一份結構化的指令。

```
1. 從對話收集：錯誤現象、重現步驟、已嘗試修復、相關檔案、環境
2. 問 repo → gh repo view 驗證
3. 確保 bug label 存在
4. 草擬 → 預覽 → 確認
5. gh issue create
6. 回報連結
```

Claude Code skill 的設計哲學就是這樣——不需要寫複雜的程式碼，只要把「一個有經驗的工程師會怎麼做」寫成步驟，AI 就能照著執行。最難的部分不是技術實作，是想清楚流程該怎麼走。

## 從對話到追蹤到修復

整理一下現在的 bug 處理流程：

```
遇到 bug
    ↓
在 Claude Code 裡 debug（分析、嘗試修復）
    ↓
修好了 → commit → 結束
修不了 → /file-bug-issue → GitHub Issue
                ↓
          簡單明確 → 加 auto label → Remote Agent 自動修
          需要判斷 → 留給人類
                ↓
          值得記錄 → /post → 寫成文章
```

三個 skill 各管一段：`/file-bug-issue` 負責追蹤，Remote Agent 負責執行，`/post` 負責知識沉澱。它們不是一個大系統，而是三個獨立的小工具，用 GitHub issue 和 label 串在一起。

這種鬆耦合的設計比較好維護。任何一個 skill 壞了或不需要了，直接拿掉，其他的不受影響。

## 參考資料

- [Claude Code 官方文件](https://docs.anthropic.com/en/docs/claude-code)
- [GitHub CLI (gh) 官方文件](https://cli.github.com/manual/)
- [GitHub Issues 官方文件](https://docs.github.com/en/issues)
- [用 Claude Code Remote Agent 做到半夜自動開發](/posts/tech/deep-dive/2026-03-27-remote-agent-auto-dev-pipeline) — Remote Agent 自動接 Issue 開 PR 的完整流程
- [Claude Code 的三層品質防線：Hook、Skill、指令檔](/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md) — Skill 與 Hook 的設計差異與搭配
- [從 OpenSpec 到自動部署的 AI 驅動開發流程](/posts/tech/deep-dive/2026-03-27-ai-driven-dev-workflow-openspec-to-deploy) — 完整的八階段開發流程
- [對話即文件：用 Claude Code 把 Debug 過程直接變成文章](/posts/tech/guide/2026-03-13-conversation-as-documentation) — 另一種從對話萃取知識的 Skill
