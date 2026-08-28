---
title: "Claude Code 怎麼上雲：Claude Code on the web、--cloud/--teleport 與手機接手"
date: 2026-08-26
type: deep-dive
category: tech
tags: [claude-code, claude-code-web, cloud, teleport, mobile]
lang: zh-TW
tldr: "Claude Code on the web 把任務丟到雲端環境執行，預設是 Anthropic 託管 VM，也可由組織路由到 self-hosted environment：GitHub 授權後從瀏覽器或手機派工，`--cloud` 從終端機開雲端 session，`--teleport` 把雲端 session 拉回本地續作。目前是 Pro/Max/Team 的 research preview，不另收運算費用但共享帳號 rate limit。"
description: "深入介紹 Claude Code 的雲端執行面：web 派工流程、GitHub 授權兩條路、--cloud 與 --teleport 的單向性、auto-fix PR、安全隔離、自架環境邊界與手機端的分工。"
draft: false
series:
  name: "Claude Code 深入介紹"
  order: 38
---

> 🌏 [English version](/posts/tech/deep-dive/2026-08-26-claude-code-on-the-web-en)

上一篇 [Remote Control](/posts/tech/deep-dive/2026-03-28-claude-code-remote-control-guide) 講的是「程式跑在你機器上、瀏覽器當遙控器」。這篇講另一半：**程式根本不在你機器上跑**的雲端執行——Claude Code on the web。兩者共用 claude.ai/code 這個介面，差別只在 session 在哪裡執行；把這條邊界畫清楚，是這篇最主要的事。

## 它現在是什麼狀態

Claude Code on the web 目前是 **research preview**，開放 Pro、Max、Team 方案（Enterprise 需 premium seat 或 Chat + Claude Code seat）。任務跑在雲端環境，預設是 Anthropic 管理的 VM；若組織設定 self-hosted environment，也可以路由到自己的 runner。session 不因為你關掉瀏覽器而停止；手機裝 Claude app 可以隨時查看和接手。

先講它適合什麼——官方 quickstart 點名四種情境：

- **平行任務**：每個 `--cloud` 指令開一個獨立 session 和分支，不用自己管多個 worktree
- **本地沒 clone 的 repo**：雲端每次重新 clone，不需要本地 checkout
- **不需要頻繁 steering 的任務**：描述清楚、送出、回來驗收
- **純探索**：理解一個 codebase 不用先在本地建環境

需要你的本地設定、工具或 MCP servers 的工作，雲端做不了——那是[本地執行或 Remote Control](/posts/tech/deep-dive/2026-03-28-claude-code-remote-control-guide) 的地盤。

## GitHub 授權：兩條路

雲端 session 要 clone repo、推分支，授權有兩種方式：

| 方式 | 做法 | 適合 |
|------|------|------|
| GitHub App | 在 claude.ai/code 引導中安裝授權 | 瀏覽器上手；要啟用 auto-fix PR 的團隊 |
| `/web-setup` | 終端機執行，把本地 `gh` CLI 的 token 同步到 Claude 帳號 | 已經在用 `gh` 的個人開發者 |

要注意的是權限範圍：不管哪條路，雲端 session 能存取**該 GitHub 帳號看得到的所有 repo**，不是只有安裝了 Claude App 的 repo。App 安裝的作用是啟用 PR webhook（auto-fix 需要），不是 session 層級的存取控制——想限縮，要去 GitHub 本身限團隊和 repo 成員。另外 Zero Data Retention（ZDR）組織不能用 `/web-setup` 和其他雲端 session 功能。

首次連線會建立一個叫 **Default** 的雲端環境：CLI `/web-setup`、Pro/Max 的 web onboarding 通常會自動建立；Team/Enterprise 可能先看到建立表單，除非 Owner 開了 Quick web setup。Default 的網路存取層級是 Trusted——只通往常見套件註冊站、GitHub、cloud SDK 等允許清單內的網域。環境可以改：網路層級、環境變數、session 開跑前的 setup script 都能設，setup script 有大約五分鐘的時間預算（超過會卡在建環境快取），重活應該挪進 SessionStart hook 讓它在背景跑。

## 從終端機上雲：`--cloud`

```bash
claude --cloud "Fix the authentication bug in src/auth/login.ts"
```

這會開一個新的雲端 session。關鍵細節：**VM clone 的是 GitHub remote 上你目前的分支，不是你的本地 checkout**——本地有 commit 還沒 push 的話，先 push 再說。舊拼法 `--remote` 還能用，但是 deprecated 別名。

還有一個 fallback：repo 沒連 GitHub 時，`claude --cloud` 會把本地 repo 直接打包上傳（含完整歷史與 tracked 檔案的未 commit 變更，但不含 untracked files），上限 100 MB，超出會退化成只打包當前分支、再不行壓成單一快照。打包建立的 session 沒配 GitHub 授權就推不回 remote。`CCR_FORCE_BUNDLE=1` 可以強制走這條路。

已經在跑的雲端 session，事後可以從任何一台登入同帳號的機器補訊息：

```bash
claude -p "改完順便補測試" --cloud <session-id>
```

這是排隊即走的模式（印出 session ID 和連結就結束）；這個指令可以在任何已登入同帳號的機器上跑，不會帶入本機 session state。不加 `-p` 則是把終端機附掛上去對話——這個互動模式還在逐步發放中。注意方向性：**CLI 只能把雲端 session 拉回來（teleport），不能把既有的本地 session 推上雲端**（Desktop app 的 Continue in menu 例外）。`--cloud` 和 `--remote-control` 也完全不相干，官方特別註明避免混淆。

## 從雲端回本地：`--teleport`

```bash
claude --teleport            # 互動式 picker
claude --teleport <session-id>
```

Teleport 也能從 CLI 裡的 `/teleport`／`/tp`、`/tasks` 清單按 `t`、web 介面的 **Open in > Terminal**，或雲端 session 內輸入 `/teleport` 取得指令。它會驗證四件事：git 工作目錄乾淨（不乾淨會先叫你 stash）、你在同一個 repo 的 checkout（fork 不行）、雲端 session 的分支已推上 remote、同一個 claude.ai 帳號。通過之後它 fetch 並 checkout 雲端分支、載入完整對話歷史。

最容易被誤解的一點：**teleport 之後終端機拿到的是自己的副本**——之後的新工作只存在本地，不會同步回 claude.ai 上的雲端 session。想在手機上繼續顧，就在本地 session 開 `/remote-control`。它跟 `--resume` 也是兩回事：`--resume` 讀本機歷史，`--teleport` 拉雲端 session 連分支一起。

## 手機端：三個入口一個 app

Claude app（iOS／Android）不是「Claude Code 的手機版」，它是 client——程式碼在哪裡跑由你選的入口決定：

| 入口 | 連到什麼 | 適合 |
|------|----------|------|
| Claude Code on the web | 雲端 session（預設 Anthropic 託管 VM） | repo 在 GitHub 上，手機放下後任務要繼續跑 |
| Remote Control | 你電腦上的 session | 工作需要本地檔案系統、工具或 MCP servers |
| Dispatch | Desktop app | 傳訊息派任務讓它自己決定怎麼跑（限 Pro/Max） |

手機上的權限模式也有邊界：雲端 session 只有 Accept edits／Plan／Auto 三種可選，Remote Control session 是 Manual／Accept edits／Plan——**兩種都選不到 Bypass permissions**，Remote Control 也開不了 Auto。

## Auto-fix PR：讓 Claude 盯著 pull request

開啟後 Claude 訂閱 PR 的 GitHub 事件：CI 失敗或 reviewer 留言時自動調查，有明確修法就直接推 fix。開啟方式有好幾條——web session 的 CI status bar、終端機在 PR 分支上跑 `/autofix-pr`、手機上直接叫它盯、或把 PR URL 貼進任何 session。前提是 Claude GitHub App 有裝在該 repo。

行為邏輯值得知道：有信心的修法直接做並說明；模糊或有架構影響的留言會先問你；重複事件記一筆就過。它可能用你的 GitHub 帳號回覆 review thread——每則回覆會標注來自 Claude Code，但在 reviewer 眼裡是你帳號發的。官方特別警告：如果你的 repo 有靠 `issue_comment` 事件觸發的自動化（Atlantis、Terraform Cloud 之類），Claude 的代回覆可能觸發它們，這類 repo 想清楚再開。

Auto-fix 對 base branch 前進造成的 merge conflict 沒轍——GitHub 不發那種 webhook，得自己開 session 叫它 rebase。

## 安全與成本

隔離設計三層：Anthropic 託管時每個 session 一台獨立 VM；網路存取由環境設定控管（預設受限，可完全關閉）；git credentials 這類敏感憑證不進 Anthropic sandbox，透過 scoped credential 的安全 proxy 處理。self-hosted environment 則由你自己的部署負責 runner 隔離、網路邊界與憑證注入。

成本面：雲端 VM **不另收運算費**，但消耗跟你所有 Claude 用量共享的 rate limit——平行開多個任務就是按比例多吃額度。組織若有 IP allowlist 會整批擋掉 Anthropic 託管的雲端 session（API 從 Anthropic 的網路呼叫，不是你的）——self-hosted environments 就是為這種場景準備的，屬於企業部署子系列的範圍，這篇不展開。

## 跟 Remote Control 怎麼選

一句話版本：**工作需要在哪裡跑，決定用哪個**。本地做到一半要離席、或需要本地環境——Remote Control；repo 在 GitHub、想零本地設定派工或平行多開——on the web。官方比較表的判準其實就三行：code 跑在哪、吃不吃你的本地設定、斷線後活不活。

## 學到的事

這套雲端面的概念負擔集中在兩個方向性事實：`--cloud` 只能開新的（clone 的是 remote 不是本地；bundle fallback 不含 untracked files），`--teleport` 只能拉回來（拉回後分岔、不再同步）。把這兩條記住，加上「GitHub App 安裝 ≠ 存取控制」「Anthropic 託管 VM 不另收費但 rate limit 共享」，剩下的都是照表操作。

## 參考資料

- [Use Claude Code on the web — Claude Code Docs](https://code.claude.com/docs/en/claude-code-on-the-web) — `--cloud`／`--teleport` 完整語意、GitHub 授權、bundle fallback、auto-fix PR、安全隔離與限制
- [Get started with Claude Code on the web](https://code.claude.com/docs/en/web-quickstart) — onboarding 流程、Default 環境、Trusted 網路層級、自架環境邊界與比較表
- [Configure cloud environments](https://code.claude.com/docs/en/cloud-environments) — Default 環境建立規則、網路層級、setup script、proxy 與 cloud session 可用工具
- [Claude Code on mobile — Claude Code Docs](https://code.claude.com/docs/en/mobile) — 三入口定位表、手機端權限模式邊界
- [Continue local sessions with Remote Control](https://code.claude.com/docs/en/remote-control) — 本地接續的對照面（系列 G4 主題）

## 更新紀錄

- 2026-08-26：初版，依 2026-08 官方文件撰寫（research preview 現況）。
