---
title: "Git Hooks 介紹：在對的時機自動做對的事"
date: 2026-04-20
category: tech
tags: [git, hooks, workflow, tooling]
lang: zh-TW
tldr: "Git hooks 讓你在 commit、push、merge 等事件發生時自動執行腳本。搭配 husky + lint-staged，可以把格式化、lint、測試自動卡在 commit 前，避免髒東西進 repo。"
description: "介紹 git hooks 的運作原理、client-side 與 server-side hooks 的差別、常用 hook 類型（pre-commit、commit-msg、pre-push、post-merge 等），以及在 Node.js 專案如何用 husky + lint-staged 設定團隊共用的自動化流程。"
draft: false
---

很多團隊的 code review 其實都在修同一件事：縮排、forgotten console.log、忘記跑格式化、commit message 格式不對。這類問題不該靠人眼，應該讓 git 自己在對的時機擋下來。Git hooks 就是為了這件事存在——它讓你在 commit、push、merge 等事件觸發時，自動執行一段腳本。

## Git Hooks 是什麼

Git hooks 是一組在特定 git 事件發生時自動執行的腳本。它們放在每個 repo 的 `.git/hooks/` 目錄下，預設已經內建一堆 `.sample` 範例檔：

```bash
ls .git/hooks/
# applypatch-msg.sample
# commit-msg.sample
# pre-commit.sample
# pre-push.sample
# pre-receive.sample
# post-update.sample
# ...
```

把 `.sample` 拿掉、加上可執行權限就會啟用：

```bash
mv .git/hooks/pre-commit.sample .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

Hook 可以用任何語言寫，只要有對應的 shebang（`#!/bin/sh`、`#!/usr/bin/env node`、`#!/usr/bin/env python` 都可以）。Git 只看兩件事：檔名對不對、exit code 是不是 0。非 0 就會中斷該動作（例如 pre-commit 回傳 1 就不會 commit）。

## Client-side vs Server-side Hooks

Hooks 依觸發位置分兩類，常被混淆：

**Client-side hooks**：跑在開發者本機，commit、push、merge、rebase 這類本機操作時觸發。用途是提早發現問題、統一流程。限制是可以被 `--no-verify` 繞過，而且沒辦法強制團隊每個人都裝——所以通常搭配 `husky` 這類工具把 hook 版控進 repo。

**Server-side hooks**：跑在 git server（例如公司的 GitLab、Gitea 或自架 bare repo），收到 push 時觸發。`pre-receive`、`update`、`post-receive` 屬於這類，用來做不可繞過的把關：禁止直接 push 到 main、檢查 commit 簽章、觸發 CI/CD。

一般人日常接觸的幾乎都是 client-side。server-side 通常由 DevOps 管，或者被 GitHub/GitLab 的 branch protection、CI 規則取代。

## 常見的 Client-side Hooks

每個 hook 在 git 流程的特定階段觸發，選對 hook 才能達到想要的效果。

**pre-commit**：`git commit` 之後、commit 真正建立之前觸發。最常用，用來跑 linter、formatter、快速測試。這個階段 staged 的檔案已經選好，是最適合攔截「不該進 repo 的內容」的地方。

**prepare-commit-msg**：commit message 編輯器打開之前觸發。適合自動在 commit message 前面帶入分支名稱、issue 編號、template。

**commit-msg**：commit message 寫完之後、commit 建立之前觸發。用來驗證 commit message 格式，例如強制 Conventional Commits（`feat:`、`fix:`、`chore:` 開頭）。

**post-commit**：commit 完成之後觸發。不能中斷 commit（已經建立了），通常用來發通知、更新其他紀錄。

**pre-push**：`git push` 之後、實際送出前觸發。適合跑比較慢但重要的檢查：完整 test suite、build 驗證、型別檢查。pre-commit 要跑得快（< 5 秒），pre-push 可以稍微放寬到十幾秒。

**post-merge**：`git merge` 或 `git pull` 完成後觸發。經典用途是自動偵測 `package.json`、`pnpm-lock.yaml` 有變就自動 `pnpm install`，省下 pull 完發現跑不起來、才想起來要裝依賴的麻煩。

**post-checkout / post-rewrite**：切分支或 rebase 完成後觸發。類似 post-merge，用來處理依賴同步或環境變數切換。

## 原生設定的限制

直接寫進 `.git/hooks/` 有幾個現實問題：

1. `.git/` 目錄不會被版控，hook 沒辦法跟 repo 一起 commit，每個人要自己裝。
2. 新人 clone 下來是沒有 hook 的，必須有人提醒。
3. 要跨平台（macOS / Linux / Windows）寫 shell script 很麻煩。

Git 從 2.9 開始提供 `core.hooksPath` 設定，可以把 hook 目錄指到 repo 內的版控資料夾：

```bash
git config core.hooksPath .githooks
```

但每個成員還是要手動執行這行設定。所以 Node.js 生態最後收斂到 `husky` 這個工具。

## Husky + lint-staged：Node 生態的標準組合

`husky` 的核心是自動化「把 `core.hooksPath` 指到 `.husky/`」這件事，並在 `pnpm install` 後自動啟用。`lint-staged` 則解決另一個問題：pre-commit 只應該對「這次要 commit 的檔案」跑工具，而不是整個 repo 掃一遍。

**安裝**

```bash
pnpm add -D husky lint-staged

# husky v9+ 初始化：建立 .husky/ 並設定 prepare script
pnpm exec husky init
```

執行後 `package.json` 會多一條：

```json
{
  "scripts": {
    "prepare": "husky"
  }
}
```

`prepare` 是 npm/pnpm 的生命週期 script，每次 `install` 後會自動跑，所以團隊成員 clone 下來裝依賴就會自動啟用 hook。

**設定 pre-commit**

編輯 `.husky/pre-commit`：

```bash
#!/usr/bin/env sh
pnpm exec lint-staged
```

**設定 lint-staged**

在 `package.json`：

```json
{
  "lint-staged": {
    "*.{js,ts,jsx,tsx}": [
      "biome check --write --no-errors-on-unmatched"
    ],
    "*.{md,json,yml}": [
      "prettier --write"
    ]
  }
}
```

`lint-staged` 只會對 staged 的檔案執行對應指令，跑完會自動 `git add` 修改結果。10 個檔案的 repo 跟 10000 個檔案的 repo 跑 pre-commit 的時間幾乎一樣。

**commit-msg 驗證格式**

搭配 `commitlint` 強制 Conventional Commits：

```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional
```

建立 `commitlint.config.js`：

```js
export default { extends: ['@commitlint/config-conventional'] }
```

`.husky/commit-msg`：

```bash
#!/usr/bin/env sh
pnpm exec commitlint --edit "$1"
```

這樣 commit message 不符合 `<type>(<scope>): <subject>` 格式就會被擋下來。

## 實際的一組設定

一個典型 Node.js 專案的 hook 配置大致長這樣：

```
.husky/
├── pre-commit       → lint-staged（快速檢查 staged 檔案）
├── commit-msg       → commitlint（驗證 commit message）
├── pre-push         → pnpm test + pnpm typecheck（完整驗證）
└── post-merge       → 偵測 lockfile 變更 → 自動 pnpm install
```

`post-merge` 範例：

```bash
#!/usr/bin/env sh
changed_files="$(git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD)"
if echo "$changed_files" | grep -q "pnpm-lock.yaml"; then
  echo "[post-merge] lockfile 變更，執行 pnpm install"
  pnpm install
fi
```

## 何時該繞過 hook

`--no-verify`（或 `-n`）可以跳過 pre-commit 和 commit-msg：

```bash
git commit -n -m "wip: 暫存"
git push --no-verify
```

合理的場景：WIP commit 要快速存檔、hook 自身壞掉需要先修、緊急 hotfix 但 CI 已經另外把關。不合理的場景：lint 紅了懶得修、測試沒過先 push 再說。`--no-verify` 是逃生門，不是日常用法，用太多 hook 就失去意義了。

## 整體架構

```
開發者本機
├─ git commit ─┬─→ pre-commit       → lint-staged（快速，必過）
│              ├─→ prepare-commit-msg → 自動加 issue 編號
│              ├─→ commit-msg        → commitlint（格式驗證）
│              └─→ post-commit       → 通知、log
│
├─ git push ───→ pre-push           → 完整 test / build / typecheck
│
├─ git merge ──→ post-merge          → 偵測 lockfile、自動 install
│
└─ git checkout → post-checkout      → 環境切換、依賴同步

Server 端
└─ git push 到 server ─┬─→ pre-receive  → 擋直接 push main
                        ├─→ update       → 逐 ref 驗證
                        └─→ post-receive → 觸發 CI / webhook
```

## 整體來說

Git hooks 的價值不在於「做了多了不起的事」，而在於「讓該做的事不被忘記」。對個人專案，直接改 `.git/hooks/` 最輕。對團隊，`husky + lint-staged + commitlint` 幾乎是 Node 生態的事實標準：把檢查跟著 repo 一起版控、新人裝依賴就自動啟用、跑的時候只動到相關檔案。真正該避免的是把 hook 當成 CI 的替代品——hook 跑太久會被繞過，關鍵的驗證還是要留在 CI/CD 上才可靠。

## 參考資料

- [Git Hooks 官方文件](https://git-scm.com/docs/githooks)
- [Pro Git - Customizing Git: Git Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- [Husky](https://typicode.github.io/husky/)
- [lint-staged](https://github.com/lint-staged/lint-staged)
- [commitlint](https://commitlint.js.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [core.hooksPath (git-config)](https://git-scm.com/docs/git-config#Documentation/git-config.txt-corehooksPath)
