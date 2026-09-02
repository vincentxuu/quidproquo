---
title: "資安警報｜Git 設定檔裡藏一行指令,就能讓 Claude Code、Codex、Cursor 等七款 AI coding agent 執行任意程式碼——GitSpawn 手法仍有四款未修補"
date: 2026-09-03
category: daily
tags: [ai-agent, security, daily, privilege-escalation]
lang: zh-TW
description: "資安研究機構 Manifold Security 揭露名為 GitSpawn 的攻擊手法:AI coding agent 開機時呼叫 git 蒐集專案資訊,卻沒有清掉 repo 自帶的 git 設定,讓惡意 repo 能在使用者核准信任對話框之前,於本機以使用者權限執行任意指令。goose、Codex、Claude Code 已修補,Hermes Agent、Qwen Code、Grok Build 及 Claude Code 的第二條路徑仍未修補。"
tldr: "資安公司 Manifold Security 於 9 月 1 日發布研究 GitSpawn:七款命令列 AI coding agent(goose、Codex CLI/Desktop、Claude Code、Hermes Agent、Qwen Code、Grok Build)開機或建立 session 時會呼叫 git status、git diff 等指令蒐集專案資訊,但沒有先清掉該 repo 自己的 .git/config——而 core.fsmonitor 等 git 設定的值本身就是「要執行的指令」。只要收到一份保留 .git 目錄的檔案(zip、共用磁碟、隨身碟,而非 git clone),打開它的瞬間 agent 就會以使用者權限執行 repo 指定的指令,發生在沙箱之外、且早於任何信任對話框或核准提示。goose(CVE-2026-72718,CVSS 7.0)、Codex(OpenAI 同日發布三組 CVE)、Claude Code 的 core.fsmonitor 路徑已修補;但 Claude Code 透過 claude ultrareview 觸發的第二條路徑,以及 Hermes Agent、Qwen Code、Grok Build 三款工具,截至 9 月 1 日 Manifold 重新測試時仍可利用。目前無證據顯示已遭在野利用。防禦:開啟未知來源目錄前先檢查 .git/config,並全域關閉 core.fsmonitor。"
series:
  name: "AI Security Alert"
  order: 20
---

> 🌏 [English version](/en/posts/daily/2026-09-03-security-gitspawn-git-config-rce-en)

## 事件概述

資安研究公司 Manifold Security 於 9 月 1 日發布研究報告,揭露一個他們命名為 GitSpawn 的攻擊手法模式,同時影響七款命令列 AI coding agent:goose、Codex CLI/Desktop、Claude Code、Hermes Agent、Qwen Code、Grok Build,另外三週前已先揭露過 Cursor CLI 的同類問題。這些 agent 在啟動或建立 session 時,會呼叫 `git status`、`git diff` 這類指令來判斷目前分支、有哪些檔案異動,藉此蒐集專案上下文——但呼叫時沒有先清掉這個 repo 自己的 git 設定。問題在於,`core.fsmonitor` 這類 git 設定值本身就是「要執行的指令」,git 讀到就會執行,而且是在使用者權限下、於沙箱之外、早於任何信任對話框或核准提示執行。攻擊者不需要誘騙使用者點擊或核准任何東西,只要對方打開一份「保留 `.git` 目錄的檔案」——例如共用的 zip 壓縮檔、共用磁碟、同步資料夾或隨身碟,而不是透過 `git clone` 取得——AI agent 一啟動就會踩到這個陷阱。OpenAI 同一天也為 Codex 發布了三組 CVE,分別由三個互不相關的研究團隊各自回報同一類問題。The Hacker News 已跟進報導。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | 惡意 Git 設定觸發任意指令執行(GitSpawn,沙箱繞過 / 信任邊界失效) |
| 影響範圍 | goose(<1.44.0)、Codex CLI(0.102.0–0.130.0)、Codex Desktop(macOS/Windows 特定版本區間)、Claude Code(core.fsmonitor 路徑於 2.1.193 確認、2.1.196 修補;`claude ultrareview` 路徑於 2.1.252 仍可觸發,對照目前版本 2.1.258)、Hermes Agent(0.18.2、0.21.0,未修補)、Qwen Code(0.19.6、0.22.3,未修補)、Grok Build(0.2.93、1.0.13,未修補)、Cursor CLI(先前已揭露並修補) |
| 嚴重程度 | High(可在使用者核准前,以使用者權限執行任意指令;目前無已知在野利用,且需要以保留 `.git` 目錄的檔案形式收到 repo,一般 `git clone` 不觸發) |
| CVE | CVE-2026-72718(goose,GitHub Advisory GHSA-r5pp-p5r8-466r,CVSS 4.0 基礎分數 7.0)、CVE-2026-19592(OpenAI Codex,另有兩組同批 CVE)、CVE-2026-71963(Hermes Agent,VulnCheck 指派,截至 9 月 2 日尚未見於 MITRE CVE List 公開紀錄);goose 是目前唯一有公開 CVSS 評分的個案 |
| 來源 | [Manifold Security(GitSpawn 原始揭露)](https://www.manifold.security/blog/ai-coding-agents-git-hijack)、[The Hacker News](https://thehackernews.com/2026/09/malicious-git-configs-can-make-claude.html)、[GitHub Security Advisory GHSA-r5pp-p5r8-466r(goose)](https://github.com/aaif-goose/goose/security/advisories/GHSA-r5pp-p5r8-466r) |

## 攻擊面分析

GitSpawn 的根本原因不是模型或 prompt 出問題,而是 agent 底層那段「開機先搞清楚自己在哪裡」的 plumbing 程式碼。Manifold 的原話是:「漏洞不在模型裡,也不是什麼新東西,它就在最平凡的底層管線裡——agent 在 session 開始時,為了搞清楚自己身在何處而生出的那個 subprocess。」`core.fsmonitor` 是 git 為大型 repo 設計的效能選項:與其每次都掃全部檔案,git 會呼叫一支輔助程式回報哪些檔案異動過,而這支輔助程式是什麼,寫在 repo 自己的 `.git/config` 裡。任何會刷新 index 的 git 操作——包含最無害的 `git status`、`git diff`——都會觸發這支輔助程式執行。攻擊者要做的事只有一步:把惡意指令寫進 `.git/config` 的 `core.fsmonitor`,然後把整個目錄(而不是用 `git clone`)交給受害者,受害者的 AI coding agent 一開機呼叫 `git status` 蒐集上下文,指令就以受害者的權限跑掉了——不需要 agent 呼叫模型、不需要任何工具核准、甚至早於 workspace-trust 對話框被接受之前。在 Claude Code 和 Hermes Agent 上,payload 在信任對話框被接受之前就先觸發;在 Qwen Code 上是使用者尚未驗證身分前;在 Grok Build 上則是第一次按鍵就觸發。

這個問題其實不算全新:資安公司 Sonar 今年 4 月就回報過同一個 sink,並指出 Anthropic 當時已經調整過 Claude Code 的啟動順序來堵這個洞,同時在 VS Code(CVE-2021-43891)與 JetBrains IDE(CVE-2022-24346)裡找到過同類的信任對話框繞過。但 Manifold 這次重新測試發現,Claude Code 在 2.1.193(2026 年 6 月 25 日發布)這個更新版本裡,同樣的啟動行為又出現了一次,而且透過 `claude ultrareview` 觸發的第二條路徑,Manifold 用 9 月 1 日的版本 2.1.252 確認仍然存在,對照目前公開版本 2.1.258,沒有任何來源證實後續版本是否已修補。這說明「修過一次」不代表這類問題不會用另一條路徑捲土重來,因為問題出在整個工具鏈都習慣用同一套「先跑 git 蒐集上下文」的模式,而不是單一函式的邊界條件。

對照 OWASP 的分類,GitSpawn 同時命中傳統 LLM Top 10 裡的 **Excessive Agency**(agent 在使用者尚未核准信任的階段,就已經有能力在本機執行任意指令)以及 OWASP Agentic Security Initiative 特別點名的 **Insufficient Sandboxing / Tool Misuse**(核准機制與沙箱設計者假設「所有指令執行都會經過某個核准點」,卻漏算了 agent 自己為了蒐集上下文而在背景 spawn 的 git subprocess,這條路徑完全繞過了整個信任模型)。

## 防禦做法

**立即動作**
- 在用任何 AI coding agent 打開一個「以檔案形式收到」的目錄之前(zip 解壓縮、共用磁碟、同步資料夾、USB),先檢查該目錄的 `.git/config`,留意 `core.fsmonitor`、`core.hooksPath`、`attr.tree` 這幾個鍵,以及是否搭配了 clean/process filter
- 對任何以檔案形式收到的 repo,執行 `git config --get core.fsmonitor` 檢查是否被設定
- 執行 `git config --global --list | grep fsmonitor` 稽核自己機器上的全域設定
- 執行 `git config --global core.fsmonitor false` 全域關閉這個選項,作為預設防線
- 盤點團隊裡正在用的 CLI AI coding agent 版本,對照 Manifold 公布的受影響版本區間:goose 升級到 1.44.0+、Codex CLI 升級到 0.131.0+(目前最新為 0.152.1)、Claude Code 至少升級到 2.1.196 以上,並留意其官方公告是否已涵蓋 `claude ultrareview` 路徑
- Hermes Agent、Qwen Code、Grok Build 三款工具截至本文撰寫時仍未修補,若團隊有使用,建議先避免用它們開啟來源不明、且是以檔案而非 `git clone` 方式取得的專案目錄

**長期架構**
- 若你也在打造會呼叫 git 的 agent 或工具鏈,啟動時蒐集上下文的 git 呼叫一律加上 `-c core.fsmonitor=false` 之類的旗標明確清空可疑設定,而不是仰賴預設值,這正是 Manifold 建議廠商採取的修補方式
- 把「早於信任對話框執行的程式碼路徑」納入安全審查範圍,不要只審查使用者核准之後的工具呼叫——這正是本次多款 agent 共同踩到的盲點
- 評估 watchlist B7 中 Invariant Labs、Zenity 這類專注 agent/工具鏈安全態勢的公司,對內部自建或整合的 CLI agent 做沙箱邊界與核准流程的滲透測試,而不是只信任廠商的預設安全宣稱
- 建立內部規範,要求以檔案形式(而非版本控制系統)接收的第三方或客戶專案,一律先用 `git config --get` 系列指令做設定檔健檢,再交給任何 AI agent 開啟

## 影響範圍

Manifold 表示這個模式在他們點名的七款工具之外「還在更多 agent 裡發現過」,只是這次報告只詳細寫出其中五個。就修補狀態而言,goose、Codex(CLI 與 Desktop)、以及 Claude Code 的 `core.fsmonitor` 路徑已經修補;Hermes Agent(曾在 7 月被攻擊者用來對泰國政府網路發動無人值守入侵)、Qwen Code、Grok Build,以及 Claude Code 透過 `claude ultrareview` 觸發的第二條路徑,截至 Manifold 於 9 月 1 日的重新測試,仍會執行 repo 指定的指令。The Hacker News 於 9 月 2 日查核美國 CISA 的已知遭利用漏洞(KEV)目錄(2026.09.01 版,共 1,687 筆),沒有找到任何一組相關 CVE 在列,目前沒有證據顯示這個手法已被用於實際攻擊。

這起事件對任何會把「不明來源的專案目錄」交給 AI coding agent 開啟的工作流程都有意義——包括代收客戶專案的顧問、跨團隊共用程式碼的協作場景、或是任何用共用磁碟而非版控系統交接程式碼的習慣。由於觸發條件是「以檔案形式取得、且 `.git` 目錄完整」,一般透過 `git clone` 取得的 repo 不受影響,這也是為什麼交付流程的選擇本身就是一道防線。

## 今日收穫

過去談 AI coding agent 的資安風險,直覺會先想到「惡意 prompt 誘騙 agent 做壞事」,但 GitSpawn 完全不需要碰到模型——它利用的是 agent 為了「搞清楚自己在哪個專案」而在背景默默呼叫的 git 指令,這條路徑存在的意義是效能與上下文蒐集,設計者從沒把它當成需要被信任邊界涵蓋的執行路徑。這提醒我:agent 的攻擊面不只是「prompt 進得去、工具呼叫核准得過」這兩端,任何 agent 為了自己方便而在背景 spawn 的 subprocess,都可能是一條完全繞過核准機制的旁路。

## 參考資料

- [GitSpawn: A Single Flaw Lets Untrusted Repos Run Code in Claude Code, Codex, Cursor, and Grok — Manifold Security](https://www.manifold.security/blog/ai-coding-agents-git-hijack)
- [Malicious .git Configs Can Make Claude, Codex, Cursor, and Other AI Agents Run Attacker Code — The Hacker News](https://thehackernews.com/2026/09/malicious-git-configs-can-make-claude.html)
- [GHSA-r5pp-p5r8-466r: goose git subprocess arbitrary command execution — GitHub Security Advisory](https://github.com/aaif-goose/goose/security/advisories/GHSA-r5pp-p5r8-466r)
