---
title: "資安警報｜Claude Code「不再詢問」功能把密碼和金鑰原樣存進 GitHub 公開 repo"
date: 2026-11-09
category: daily
tags: [ai-agent, security, daily, data-exfiltration]
lang: zh-TW
description: "Apiiro 研究發現：Claude Code 的「Yes, and don't ask again」權限選項會把使用者核准過的 shell 指令原封不動存進專案裡的 .claude/settings.local.json，如果指令本身含密碼或金鑰，這個檔案被 commit 進 GitHub 後,機密值就跟著公開了——已在 1,994 個公開 repo 裡找到 2,539 組機密值,影響 63 個組織。"
tldr: "Apiiro 11/5 發表研究：Claude Code 選「不再詢問」會把核准過的完整 shell 指令（含其中的密碼、金鑰）原樣寫進專案的 .claude/settings.local.json；這個檔案常被 commit 進公開 GitHub repo，掃了 10 萬多份公開複本後找到 2,539 組機密值、涉及 1,994 個 repo、63 個組織,至少一組金鑰已確認還在生效。防禦：撤銷並輪換金鑰、把檔案從 git 追蹤移除、改用環境變數取代指令裡的明文密碼。"
series:
  name: "AI Security Alert"
  order: 75
---

> 🌏 [English version](/posts/daily/2026-11-09-security-claude-code-dont-ask-again-secrets-leak-en)

## 事件概述

應用程式安全公司 Apiiro 在 11 月 5 日發表研究，指出 Anthropic 的 Claude Code 在使用者對一個 shell 指令選擇「Yes, and don't ask again」（核准後不再詢問）時，會把**那個指令原封不動**存進專案目錄下的 `.claude/settings.local.json`，當成之後自動核准的規則。問題是，如果使用者當時輸入或核准的指令裡本來就含著密碼、API 金鑰或 token（例如 `mysql -p你的密碼` 這類寫法），這些機密值會跟著指令字串一起被原樣寫進檔案——而這個檔案常常被 Claude Code 自己（或使用者）commit 進公開的 GitHub repo。Apiiro 掃描了公開 GitHub 上 104,185 份這個檔案的複本，找到 1,122 份含有至少一組機密值，合計 1,379 組；再加上歷史版本、被團隊故意共用的 `.claude/settings.json`、以及 agent 對話紀錄，總數來到 **2,539 組機密值、涉及 1,994 個 repo、63 個組織**。研究者已通知其中一家企業，該企業確認自己外流的金鑰當時仍在生效。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | 機密值外洩（coding agent 權限快取設計缺陷） |
| 影響範圍 | 使用 Claude Code 並選過「不再詢問」的公開 GitHub repo，63 個組織受影響 |
| 嚴重程度 | High |
| CVE | 無（研究揭露，非編號漏洞） |
| 來源 | [Apiiro 研究報告](https://apiiro.com/blog/coding-agents-leaking-secrets-github-dont-ask-again)、[The Hacker News](https://thehackernews.com/2026/11/claude-codes-dont-ask-again-file.html) |

## 攻擊面分析

根本原因出在 Claude Code 的權限快取機制只記「核准了什麼」，不記「為什麼核准」。使用者第一次執行一個會動到機密資料的指令時（像是連資料庫、用 `sshpass` 登入伺服器、呼叫雲端 API），Claude Code 會問要不要核准；如果選「不再詢問」，它存的規則有時是像 `npm test *` 這種模式，但如果當時核准的是一個完整、特定的指令（而不是一個模式），就會把那行指令整串、包含裡面寫死的密碼或 token，一字不漏寫進 `.claude/settings.local.json`。Apiiro 拿最新的 Opus 5.5 和 Fable 5.1 重現了同樣的行為，確認這不是舊版才有的問題。

真正讓問題擴大的是 git 層面的防護只做了一半：Claude Code 第一次在一個 git repo 裡寫這個檔案時，會把它加進使用者**那台電腦的全域** git exclude 清單，但從不把它寫進**專案自己的** `.gitignore`。這代表保護只跟著「這台電腦、這個使用者」走，一旦檔案在另一台電腦、或在它被加進全域排除清單**之前**就已經被 commit 過，這層保護完全不生效——而 Apiiro 發現在 1,105 個追蹤到的 repo 裡，有 539 個是由列名 Claude 為共同作者的 commit 動到這個檔案，顯示 Claude Code 常常是自己把這個檔案 commit 上去的。更麻煩的是，刪掉檔案不等於清除外洩：舊版本留在 git 歷史和 fork 裡，Apiiro 另外在 509 個 repo 的歷史版本中找到 734 組已經從現在版本消失、但歷史紀錄裡還查得到的機密值，211 個 fork 也把原始外洩的機密值複製了一份。

```diagram
title: Claude Code 核准指令外洩密碼的路徑
desc: 使用者核准含密碼的完整指令會被原樣存進設定檔；全域 git 排除清單只護得住目前這台電腦，換電腦、CI 或已提交過，就會外洩進公開 repo，之後連歷史版本和 fork 都留著。
caption: 簡化示意，依 Apiiro 2026-11-05 研究整理。
step: 使用者對一句含密碼的指令選「不再詢問」
step: 判斷核准的是指令模式還是完整指令
step: 選模式的話只存模式字串，不含密碼
step: 選完整指令的話，密碼連同指令整串存入設定檔
step: 判斷這份複本在哪台電腦、全域排除清單是否生效
step: 生效中的話本機暫時安全，沒生效或已提交過就直接外洩進公開 repo
step: 本機暫時安全也只是暫時，之後換電腦或被 fork 一樣會外洩
step: 外洩之後，連歷史版本和 fork 都還留著，刪除現在的檔案救不回
---
<svg viewBox="0 0 712 640">
  <path class="dg-line" d="M320 34V56" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M320 104V136" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line dg-line--accent" d="M460 180H540" marker-end="url(#arrow-accent)" data-step="3"/>
  <path class="dg-line" d="M320 224V256" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line" d="M320 312V344" marker-end="url(#arrow)" data-step="5"/>
  <path class="dg-line" d="M460 388H540" marker-end="url(#arrow)" data-step="6"/>
  <path class="dg-line dg-line--warn" d="M320 432V464" marker-end="url(#arrow-warn)" data-step="6"/>
  <path class="dg-line dg-line--warn" d="M616 412V484Q616 492 608 492H460" marker-end="url(#arrow-warn)" data-step="7"/>
  <path class="dg-line dg-line--warn" d="M320 520V552" marker-end="url(#arrow-warn)" data-step="8"/>

  <circle class="dg-dot" cx="320" cy="28" r="6" data-step="1"/>

  <g data-step="1">
    <rect class="dg-box" x="180" y="56" width="280" height="48" rx="6"/>
    <text class="dg-label" x="320" y="80" text-anchor="middle" dominant-baseline="central">使用者核准一個含密碼的 shell 指令</text>
  </g>

  <g data-step="2">
    <path class="dg-box" d="M320 136L460 180L320 224L180 180Z"/>
    <text class="dg-label" x="320" y="172" text-anchor="middle" dominant-baseline="central">核准規則是哪一種？</text>
    <text class="dg-sub" x="320" y="194" text-anchor="middle" dominant-baseline="central">模式，或完整指令</text>
  </g>

  <g data-step="3">
    <rect class="dg-box dg-box--accent" x="540" y="156" width="152" height="48" rx="6"/>
    <text class="dg-label" x="616" y="180" text-anchor="middle" dominant-baseline="central">只存模式，不含密碼</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="180" y="256" width="280" height="56" rx="6"/>
    <text class="dg-label" x="320" y="284" text-anchor="middle" dominant-baseline="central">完整指令連密碼一起存入設定檔</text>
  </g>

  <g data-step="5">
    <path class="dg-box" d="M320 344L460 388L320 432L180 388Z"/>
    <text class="dg-label" x="320" y="380" text-anchor="middle" dominant-baseline="central">全域排除清單生效嗎？</text>
    <text class="dg-sub" x="320" y="402" text-anchor="middle" dominant-baseline="central">只護本機，不算進 repo</text>
  </g>

  <g data-step="6">
    <rect class="dg-box" x="540" y="364" width="152" height="48" rx="6"/>
    <text class="dg-label" x="616" y="382" text-anchor="middle" dominant-baseline="central">本機暫時安全</text>
    <text class="dg-sub" x="616" y="400" text-anchor="middle" dominant-baseline="central">排除清單生效中</text>
  </g>

  <g data-step="6">
    <rect class="dg-box dg-box--warn" x="180" y="464" width="280" height="56" rx="6"/>
    <text class="dg-label" x="320" y="492" text-anchor="middle" dominant-baseline="central">外洩進公開 GitHub repo</text>
  </g>

  <g data-step="8">
    <rect class="dg-box dg-box--warn" x="180" y="552" width="280" height="64" rx="6"/>
    <text class="dg-label" x="320" y="576" text-anchor="middle" dominant-baseline="central">歷史版本與 fork 持續留著</text>
    <text class="dg-sub" x="320" y="598" text-anchor="middle" dominant-baseline="central">刪除現在的檔案救不回</text>
  </g>

  <text class="dg-edge" x="500" y="168" text-anchor="middle" dominant-baseline="central" data-step="3">模式</text>
  <text class="dg-edge" x="332" y="240" text-anchor="start" dominant-baseline="central" data-step="4">完整指令</text>
  <text class="dg-edge" x="500" y="376" text-anchor="middle" dominant-baseline="central" data-step="6">生效中</text>
  <text class="dg-edge dg-text--warn" x="332" y="448" text-anchor="start" dominant-baseline="central" data-step="6">沒生效或已提交過</text>
  <text class="dg-edge dg-text--warn" x="626" y="448" text-anchor="start" dominant-baseline="central" data-step="7">之後仍會外洩</text>
</svg>
```

對照 OWASP LLM Top 10，這起事件同時踩到 **LLM02 Sensitive Information Disclosure**（機密資料被不當保存與暴露）和 **LLM06 Excessive Agency**（agent 被授權自動重跑一個指令時，沒有區分「指令的操作模式」和「指令裡夾帶的機密參數」，等於把過多的自主權交給了一個只會逐字複製使用者輸入的快取機制）。值得注意的是，Apiiro 比較了 16 款 coding agent 的文件後，Claude Code 是唯一被確認「預設會把完整核准指令存進專案檔案」的一款。

## 防禦做法

**立即動作**
- 在自己的 GitHub 組織內搜尋 `.claude/settings.local.json` 與 `.claude/settings.json`，連同每個 repo 的 git 歷史一起查，就算檔案現在已經被刪除也要查
- 找到任何含機密值的檔案，**先輪換，再清理**：假設裡面每一組密碼、token、金鑰都已經洩漏，逐一撤銷並重新產生
- 執行 `git rm --cached .claude/settings.local.json`，把檔案從 git 追蹤移除，並補上專案自己的 `.gitignore` 規則（不要只依賴 Claude Code 寫入的全域排除清單）

**長期架構**
- 核准指令時盡量選模式（例如 `Bash(npm run:*)`），避免核准帶著明文機密值的單一完整指令；指令裡該用的密碼改成環境變數參照（如 `$DB_PASSWORD`），讓快取下來的規則只存變數名稱
- 把 `.claude/`、`.cursor/`、`.gemini/` 這類 agent 設定資料夾和 agent 對話紀錄，當成跟 `.env` 一樣的機密資料來源，納入 pre-commit 與 CI 的 secret scanning，連 git 歷史都要掃
- 一般 secret scanner 常抓不到這類洩漏：Apiiro 測試發現 gitleaks 和 TruffleHog 分別只抓到 1,122 份問題檔案中的 564 和 643 份，215 份兩者都沒抓到，因為 `PGPASSWORD=`、`sshpass -p`、`mysql -p` 後面接的密碼不符合一般金鑰格式規則；若要補這塊，watchlist B7 的 WitnessAI 這類針對 agent 執行動作（含 shell 指令、tool call）做持續擷取與稽核的 runtime governance 平台，能在指令被核准、寫入快取之前先攔一次,而不是只靠 commit 後的掃描補救

## 影響範圍

Apiiro 核對時，每一份含機密值的檔案都還留在各自 repo 的預設分支上，其中一半已經放了至少 217 天沒人處理。63 個受影響組織多數是軟體公司，其中研究者特別點出兩個較嚴重的案例：一組資料庫廠商自己的、具管理員權限的雲端金鑰，以及一組醫療紀錄資料庫的擁有者密碼。研究者沒有測試這些機密值是否仍然有效，也沒有聯絡伺服器方驗證，只有一家受通知的企業自行確認其金鑰確實還在生效——這代表實際能被濫用的規模可能比「2,539 組」這個數字本身更難估計。值得一提的是，GitHub 上至少從 2025 年 8 月就有使用者提交過類似的 issue，但相關回報都在無人回應的狀態下被自動機器人關閉。

如果你或你的團隊在用 Claude Code（或任何會把核准過的指令快取下來重跑的 coding agent），這起事件代表「不再詢問」這個選項本身就是一個需要重新評估的攻擊面——它原本是為了減少操作摩擦而設計的功能，卻可能讓你習慣性貼進終端機的機密值，變成一份靜靜躺在公開 repo 裡好幾個月的外洩紀錄。

## 今日收穫

這起事件的有趣之處在於它完全不需要攻擊者：沒有惡意程式碼、沒有 prompt injection、沒有供應鏈下毒，純粹是一個「為了方便而快取使用者輸入」的設計決策，疊加上「保護機制只跟著單一使用者的本機設定走、不跟著專案走」這個邊界沒畫對，兩者加起來就足以讓機密值大規模外洩。比起過去報導過的那些刻意的攻擊鏈，這提醒我們：agent 工具裡任何「記住你上次核准過什麼」的功能，都該先問一句——它記住的到底是「操作方式」，還是連「你當時打的內容」都一起記下來了。

## 參考資料

- [Apiiro — Coding Agents Are Leaking Secrets to GitHub via "Don't Ask Again"](https://apiiro.com/blog/coding-agents-leaking-secrets-github-dont-ask-again)
- [The Hacker News — Claude Code's "Don't Ask Again" File Exposes Passwords and Keys in 1,122 Public Copies on GitHub](https://thehackernews.com/2026/11/claude-codes-dont-ask-again-file.html)
- [GBHackers — Claude Code's "Don't Ask Again" Feature Exposes 2,539 Secrets Across 1,994 GitHub Repositories](https://gbhackers.com/claude-codes-dont-ask-again-feature-exposed/)
- [Claude Code 官方文件 — Permissions](https://code.claude.com/docs/en/permissions)
- [Claude Code 官方文件 — Settings](https://code.claude.com/docs/en/settings)
- [GitHub Issue #5544（2025-08-11 提交，已被自動關閉）](https://github.com/anthropics/claude-code/issues/5544)
- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/)
