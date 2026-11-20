---
title: "資安警報｜官方 MCP Git Server 唯讀指令被 .git/config 誘發 RCE（GHSA-6hqx-gqrx-c5r2）"
date: 2026-11-15
category: daily
tags: [ai-agent, security, daily, privilege-escalation, mcp]
lang: zh-TW
description: "官方 Model Context Protocol 參考伺服器 mcp-server-git 被揭露：對不受信任 repository 呼叫看似唯讀的 git_status 等工具時，會讓該 repository 自己的 .git/config 指定程式以 MCP server 權限執行，已於 v2.4.0 修補。"
tldr: "HackerOne 研究者發現官方 mcp-server-git 對不受信任的 git repository 呼叫 git_status、git_diff_unstaged 這類唯讀工具時，會讓該 repository 自己 .git/config 裡的 core.fsmonitor、diff.external 等設定指定程式以 MCP server 權限執行，CVSS 4.0 評為 7.0 High，已於 2026-11-11 隨 v2.4.0 修補（GHSA-6hqx-gqrx-c5r2）。這屬於已在其他 agent 工具被核發 CVE 的 GitSpawn 漏洞類別，mcp-server-git 是最後一個補上同款修補的官方參考伺服器。防禦重點是把三個官方參考伺服器明確釘到修補版本，別讓套件管理器的版號排序邏輯騙你停在舊版。"
series:
  name: "AI Security Alert"
  order: 78
---

> :globe: [English version](/posts/daily/2026-11-15-security-mcp-git-server-gitconfig-rce-en)

## 事件概述

Anthropic 維護的官方 Model Context Protocol 參考伺服器專案 `modelcontextprotocol/servers` 於 2026 年 11 月 11 日發布 v2.4.0，修補六個資安弱點，其中最嚴重的一個評為 High：`mcp-server-git` 對一個不受信任的 git repository 呼叫看似唯讀的 `git_status` 工具時，會讓這個 repository 自己的 `.git/config` 指定一支程式，以 MCP server 行程的權限直接執行——沒有核准視窗，也不經過任何管控模型自身指令執行的 sandbox。這個漏洞透過 HackerOne 的 Anthropic 漏洞賞金計畫負責任揭露，追蹤編號 `GHSA-6hqx-gqrx-c5r2`，同一批修補還包含一個中度的 `--repository` 邊界繞過（`GHSA-q74p-4wrc-q7w6`）。這是同一組參考伺服器在不到三週內的第二次資安發布，目前沒有公開報告指出這個弱點已被實際利用。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Insecure Plugin Design — Git 設定注入導致任意程式碼執行（CWE-94） |
| 影響範圍 | `mcp-server-git` ≤ 2026.11.4（已修補至 2026.11.11）；同批次並修補 `@modelcontextprotocol/server-filesystem`（< 2.3.0，含 2025.1.14–2026.8.31 date 版本）與 `mcp-server-fetch`（≤ 2026.11.4） |
| 嚴重程度 | High，CVSS 4.0 7.0（`GHSA-6hqx-gqrx-c5r2`）；同批次 `--repository` 邊界繞過為 Medium（`GHSA-q74p-4wrc-q7w6`） |
| CVE | 無獨立 CVE 編號，追蹤為 GitHub Security Advisory：`GHSA-6hqx-gqrx-c5r2`、`GHSA-q74p-4wrc-q7w6` |
| 來源 | [GitHub Security Advisory GHSA-6hqx-gqrx-c5r2](https://github.com/modelcontextprotocol/servers/security/advisories/GHSA-6hqx-gqrx-c5r2)、[modelcontextprotocol/servers v2.4.0 release notes](https://github.com/modelcontextprotocol/servers/releases/tag/v2.4.0)、[dev.to 技術分析](https://dev.to/piekwerk/a-repos-gitconfig-could-run-programs-through-mcps-git-server-6-fixes-in-v240-and-4-checks-344g) |

## 攻擊面分析

攻擊者的準備工作很簡單：在一個 git repository 的 `.git/config` 裡寫入會「指定要執行的程式」的設定鍵，像 `core.fsmonitor`（git 每次刷新索引都會跑這支程式）或 `diff.external`（出 diff 時跑）；指令本身可以直接寫在設定值裡（`core.fsmonitor = sh -c '...'`），不需要另外夾帶檔案。被害者的 Agent 只要透過 `mcp-server-git` 開啟這個 repository，再呼叫一個聽起來完全無害的工具，如 `git_status` 或 `git_diff_unstaged`，git 在執行這些操作前就會照常讀取並套用該 repository 自己的 `.git/config`——而 `mcp-server-git` 在呼叫系統 git 指令時唯一做的設定覆寫只有 `core.quotepath=false`，其餘一律放行。於是攻擊者指定的程式就以 MCP server 行程的權限、連帶其持有的環境變數（包括用戶端 `env` 區塊傳入的任何憑證）一起被執行。

根本原因在於「唯讀」只是 MCP 工具描述層的語意，不是作業系統層的事實。`mcp-server-git` 把 `git_status` 包裝成唯讀工具,但底層執行的是完整的 git 二進位檔，而 git 本身有自己獨立、遠比「唯讀查詢」寬鬆的信任模型：它會讀取並執行 repository 自己宣告的 hooks、filter／merge driver、signing 程式。攻擊者控制的輸入（repository 內容）同時也是這段輸入的「安全政策」（repository 自己的 `.git/config`），這種「內容即設定」的結構正是這個漏洞不限於單一 MCP server 的原因：資安研究機構 Cloud Security Alliance 已在 2026 年 9 月把這整個類別命名為 **GitSpawn**，並指出 GitHub Copilot CLI（`CVE-2026-45033`，CVSS 8.5）、Goose（`CVE-2026-72718`，CVSS 7.0）、Hermes Agent（`CVE-2026-71963`，CVSS 8.6）這些會 shell out 到 git 的 agent 工具都中過同一個 `core.fsmonitor` 坑並已修補,`mcp-server-git` 是這批官方參考伺服器裡最後一個補上同款修補的。

對照 OWASP LLM Top 10：主要落在 **LLM07 Insecure Plugin Design**——工具的實際副作用超出它向模型與使用者宣稱的能力範圍（「查詢狀態」變成「執行任意程式」）；其次牽涉 **LLM05 Supply Chain Vulnerabilities**，因為 `mcp-server-git` 是被大量 agent 設定直接信任、不經二次審查引用的官方參考實作，這裡的一個漏洞衝擊的是整個「官方 server 已經審查過」的假設。值得注意的是攻擊手法的傳遞限制：單純 `git clone` 不會複製伺服器端的 `.git/config`，GitHub 的原始碼 ZIP 下載也不含 `.git` 目錄，真正會帶著惡意設定走的是封存檔、CI 產物、備份、vendored 進專案的依賴樹,或是用複製而非 `git clone` 建立的 agent 工作區。

## 防禦做法

**立即動作**
- 把 `mcp-server-git`、`mcp-server-fetch` 明確升級並**手動釘版號**到 `2026.11.11`，`@modelcontextprotocol/server-filesystem` 釘到 `2.3.0`——這三個套件剛從 CalVer（日期版號，如 `2026.11.4`）轉成 SemVer（如 `2.3.0`），套件管理器會把 `2.3.0` 排在所有 `2025.x`／`2026.x` 版本之後、視為「降級」而不主動升級,鎖在日期版號上的設定不會自動拿到修補
- 掃描所有 MCP client 設定檔（`~/.claude.json`、`~/.claude/`、`~/.cursor/`、`~/.codex/`）裡是否還引用這三個套件的舊版本
- 在 Agent 被允許對不受信任的 repository 呼叫任何 git 相關工具之前，先確認執行環境的 git 版本 ≥ 2.31——這次修補用 `GIT_CONFIG_COUNT` 覆寫設定，舊版 git 會忽略這個機制，因此直接被拒絕執行而不是悄悄失去保護

**長期架構**
- 不要把 MCP 工具描述裡的「唯讀」當成安全邊界；任何會 shell out 到外部程式（git、pandoc、imagemagick 等）的 MCP server，一律用容器或限權帳號隔離執行，且不要讓它持有敏感憑證的環境變數
- 避免 `npx -y`、`uvx` 這類不綁定版本的啟動方式——這次事件正好說明「相信套件管理器的預設排序邏輯」本身就可能讓你停在有漏洞的版本上
- 用 watchlist B7 的 Netzilo 一類 MCP server runtime governance／allowlist 工具，在設定層就擋掉引用舊版本或未經審核的 MCP server，不必靠每個使用者自己記得比對版本號

```diagram
title: 一個「唯讀」指令如何被 .git/config 誘發成 RCE
desc: 攻擊者準備好的 git repository 本身帶有會指定程式執行的設定，mcp-server-git 呼叫系統 git 處理一個看似唯讀的指令時，這些設定被直接讀取並套用執行。
caption: 簡化示意，依 GHSA-6hqx-gqrx-c5r2 官方漏洞報告與 modelcontextprotocol/servers v2.4.0 修補說明整理。
step: 攻擊者在 repository 的 .git/config 寫入 core.fsmonitor 或 diff.external，指向一支腳本
step: repository 以保留 .git 目錄的方式送到使用者手上（封存檔、CI 產物、vendored 依賴、複製而非 clone 的工作區）
step: Agent 透過 mcp-server-git 對它呼叫看似唯讀的工具（git_status、git_diff_unstaged）
step: mcp-server-git 唯一的設定覆寫只有 core.quotepath=false，git 照常讀取並套用該 repo 的 .git/config
step: .git/config 指定的程式以 MCP server 行程權限執行——無核准視窗、無 sandbox 介入，已於 2026-11-11 修補
---
<svg viewBox="0 0 712 460">
  <path class="dg-line" d="M320 26V48" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M320 104V126" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M320 182V204" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M320 260V282" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line dg-line--warn" d="M320 338V360" marker-end="url(#arrow-warn)" data-step="5"/>

  <circle class="dg-dot" cx="320" cy="20" r="6" data-step="1"/>

  <g data-step="1">
    <rect class="dg-box" x="120" y="48" width="400" height="56" rx="6"/>
    <text class="dg-label" x="320" y="68" text-anchor="middle" dominant-baseline="central">repository 的 .git/config 指定要執行的程式</text>
    <text class="dg-sub" x="320" y="88" text-anchor="middle" dominant-baseline="central">core.fsmonitor 或 diff.external 指向一支腳本</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="120" y="126" width="400" height="56" rx="6"/>
    <text class="dg-label" x="320" y="146" text-anchor="middle" dominant-baseline="central">repository 連 .git 目錄一起送到使用者手上</text>
    <text class="dg-sub" x="320" y="166" text-anchor="middle" dominant-baseline="central">封存檔、CI 產物、vendored 依賴、複製而非 clone 的工作區</text>
  </g>

  <g data-step="3">
    <rect class="dg-box" x="120" y="204" width="400" height="56" rx="6"/>
    <text class="dg-label" x="320" y="224" text-anchor="middle" dominant-baseline="central">Agent 對它呼叫看似唯讀的工具</text>
    <text class="dg-sub" x="320" y="244" text-anchor="middle" dominant-baseline="central">git_status、git_diff_unstaged</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="120" y="282" width="400" height="56" rx="6"/>
    <text class="dg-label" x="320" y="302" text-anchor="middle" dominant-baseline="central">mcp-server-git 只覆寫 core.quotepath</text>
    <text class="dg-sub" x="320" y="322" text-anchor="middle" dominant-baseline="central">git 照常讀取並套用該 repo 自己的 .git/config</text>
  </g>

  <g data-step="5">
    <rect class="dg-box dg-box--warn" x="120" y="360" width="400" height="64" rx="6"/>
    <text class="dg-label" x="320" y="384" text-anchor="middle" dominant-baseline="central">設定指定的程式以 MCP server 行程權限執行</text>
    <text class="dg-sub" x="320" y="404" text-anchor="middle" dominant-baseline="central">無核准視窗、無 sandbox 介入——已於 2026-11-11 修補</text>
  </g>
</svg>
```

## 影響範圍

這是同一組官方參考伺服器在不到三週內的第二次資安發布（前一次是 10 月 25 日修掉八個弱點），顯示這個被數百萬份 agent 設定直接信任的套件群持續在被仔細審查。六個弱點都沒有被核發獨立 CVE 編號，只追蹤為 GitHub Security Advisory，如果漏洞掃描只認 CVE 編號，這批修補不會被標記出來。目前沒有公開報告指出 `GHSA-6hqx-gqrx-c5r2` 已被實際利用——它是研究者透過 HackerOne 的 Anthropic 漏洞賞金計畫負責任揭露，修補發布後才公開完整細節。真正的風險在於暴露測試非常簡單：只要任何一處 MCP client 設定引用了這三個套件、且實際跑起來的版本落在受影響範圍內就算暴露,而前述 CalVer→SemVer 版號轉換,恰好會讓很多「以為自己有自動更新」的設定悄悄停在受影響版本上。

如果你的 Agent 系統會處理使用者提供的 git repository——code review 助手、自動修 bug 的 agent、CI 裡會 clone 第三方依賴來分析的流程都算——這個攻擊面是直接開放的：repository 的作者就是攻擊者，不需要說服使用者多做任何一步，一次 `git_status` 呼叫就足夠。

## 今日收穫

以前覺得「唯讀工具」在 Agent 的工具權限模型裡天然比較安全，這次事件提醒我，當一個 MCP 工具只是包裝一支外部程式時，「唯讀」只是這層包裝自己的宣稱——底下那支外部程式有沒有自己獨立、更寬的信任模型（像 git 會讀取並執行 `.git/config` 裡指定的程式），才是真正決定安全邊界在哪裡的關鍵。你信任的從來不只是 MCP server 自己的程式碼，還有它呼叫的每一支外部程式的完整行為，而 GitSpawn 這個漏洞類別已經在至少四個不同的 agent 工具上重複出現過。

## 參考資料

- [GitHub Security Advisory GHSA-6hqx-gqrx-c5r2 — mcp-server-git arbitrary command execution](https://github.com/modelcontextprotocol/servers/security/advisories/GHSA-6hqx-gqrx-c5r2)
- [GitHub Security Advisory GHSA-q74p-4wrc-q7w6 — mcp-server-git --repository confinement bypass](https://github.com/modelcontextprotocol/servers/security/advisories/GHSA-q74p-4wrc-q7w6)
- [modelcontextprotocol/servers v2.4.0 release notes](https://github.com/modelcontextprotocol/servers/releases/tag/v2.4.0)
- [dev.to（Piekwerk）— A repo's .git/config could run programs through MCP's git server](https://dev.to/piekwerk/a-repos-gitconfig-could-run-programs-through-mcps-git-server-6-fixes-in-v240-and-4-checks-344g)
- [GHSA-9ccr-r5hg-74gf / CVE-2026-45033 — GitHub Copilot CLI 的同類 core.fsmonitor 漏洞](https://github.com/advisories/GHSA-9ccr-r5hg-74gf)
- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/)
