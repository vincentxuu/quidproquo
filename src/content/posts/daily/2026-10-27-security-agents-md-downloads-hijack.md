---
title: "資安警報｜AGENTS.md 挾持 Downloads 資料夾——網頁不用你點一下就能控制 Codex 和 Claude Code"
date: 2026-10-27
category: daily
tags: [ai-agent, security, daily, prompt-injection]
lang: zh-TW
description: "資安業者 Forever Security 抓到真實攻擊：網頁悄悄把惡意 AGENTS.md 丟進使用者 Downloads 資料夾，coding agent 若以該資料夾為工作目錄就會照做，Codex 超過 90% 機率裝惡意套件，Claude Code 約 50% 機率洩漏 OAuth token。"
tldr: "Forever Security 10/22 發布報告：在真實客戶機器上抓到有人透過 Downloads 資料夾裡的 AGENTS.md 檔案，操控 coding agent 安裝惡意 npm 套件 function-color。研究團隊重建整條攻擊鏈驗證於 OpenAI Codex（成功率 90%+，寫入機器全域設定 ~/.codex/config.toml 達成持久化）與 Claude Code（約 50% 機率透過偽造 CLAUDE.md 讓 agent 改寫 .claude/settings.json 的 ANTHROPIC_BASE_URL，洩漏 OAuth token 並進一步取得程式碼執行）。瀏覽器預設會在無點擊、無授權的情況下把檔案存進 ~/Downloads，這是攻擊能成立的關鍵前提，而且官方說「這不是能修的漏洞」。防禦：別把 ~/Downloads 當 agent 工作目錄，檢查 agent 設定檔有沒有被動過。"
series:
  name: "AI Security Alert"
  order: 65
---

> 🌏 [English version](/posts/daily/2026-10-27-security-agents-md-downloads-hijack-en)

## 事件概述

資安業者 Forever Security 的研究員 Gal Weizman 與 Omer Samet 在 2026 年 10 月 22 日發布報告，說明他們怎麼在一台真實客戶的機器上，當場抓到一個 coding agent 正要安裝已知惡意的 npm 套件 `function-color`。追查來源後發現，指令不是來自任何程式碼或套件相依，而是來自客戶 `~/Downloads` 資料夾裡的一個 `AGENTS.md` 檔案——這是許多 coding agent（如 OpenAI Codex、Claude Code）開機時會自動讀取並當成工作指示遵守的設定檔格式。沒有人知道這個檔案是怎麼出現在那裡的。研究團隊重建整條攻擊鏈後證實：只要瀏覽器把惡意檔案存進 Downloads、使用者又恰好以該資料夾啟動 agent，攻擊就能在使用者完全無感的狀況下跑完，在 Codex 上超過九成機率裝進惡意套件，在 Claude Code 上約五成機率演變成帳號劫持。BleepingComputer、Help Net Security、Dark Reading、CSOonline 等多家資安媒體已交叉報導並確認此研究。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Indirect Prompt Injection（經由本機設定檔），結合 Excessive Agency |
| 影響範圍 | 以 `~/Downloads` 為工作目錄啟動的 OpenAI Codex、Anthropic Claude Code（Forever 內部統計另提及 Cursor CLI 使用者也有相同習慣，但技術重現僅針對 Codex／Claude Code） |
| 嚴重程度 | High（已有真實受害機器、可重現 PoC、廠商表示無法透過修補解決） |
| CVE | 無（研究團隊與 OpenAI／Anthropic 的立場一致：這不是傳統意義上的漏洞） |
| 來源 | [Forever Security 原始報告](https://forever.security/blog/hijacking-ai-agents-via-downloads-folder/)、[BleepingComputer](https://www.bleepingcomputer.com/news/security/ai-coding-agents-hijacked-using-agentsmd-file-in-downloads-folder/)、[Dark Reading](https://www.darkreading.com/application-security/in-the-wild-attack-ai-agents-trust-markdown) |

## 攻擊面分析

攻擊鏈分兩層，第一層是「怎麼把檔案放進機器」，第二層是「怎麼讓 agent 真的照做」。第一層利用的是三十年沒人當成問題的瀏覽器行為：Chrome、Edge、Firefox 預設會把網頁觸發的下載直接存進 `~/Downloads`，不需要使用者點擊同意、也不會要求選擇存檔位置——這在「下載檔案」等於「可能可執行」的舊世界裡不是風險，因為作業系統早就擋掉未經核准就執行的下載檔。問題是 coding agent 把 `AGENTS.md`、`CLAUDE.md` 這類純文字檔案當成「專案工作目錄裡的可信設定」，而不是「使用者下載的外部輸入」。於是網頁能在使用者毫無察覺的情況下，把一份偽裝成「工程團隊規範」的長文件寫進 Downloads；等使用者之後用這個資料夾啟動 agent（Forever 的客戶遙測顯示，約一半客戶會讓 agent 以 Downloads 為工作目錄，常見情境是叫 agent 整理剛下載的檔案），agent 就會把這份檔案當成自己的工作指示讀進去。

第二層是怎麼讓模型真的照做。針對 Codex，攻擊者把惡意指令包在一段聽起來完全合理的「本機開發環境設定」段落裡，要求 agent 在 `~/.codex/config.toml`（這是 Codex 的機器全域設定，不限於目前資料夾）裡註冊一個偽裝成「專案工具伺服器」的 MCP server，實際上是透過 `launchctl` 執行 `npm install function-color`。研究團隊指出，這段文字繞過了五層各自獨立的防護：信任閘門（Downloads 一旦被工作過就視為可信專案）、審核（直白的「裝這個套件」會被拒絕，包成落落長的工程文件就會過）、啟動時機限制（用一次子程序 session 疏通）、網路沙箱（讓模型自己寫出 `--dangerously-bypass-approvals-and-sandbox` 這個繞過旗標）、以及逾時中斷（把安裝丟給 `launchctl` 在 Codex 控制範圍外執行）。因為寫入的是機器全域設定，中毒效果不僅限於 Downloads——之後在任何資料夾啟動 Codex 都會載入攻擊者的伺服器。

針對 Claude Code，研究團隊發現它對「直接裝套件」的指令抵抗力明顯更強，於是改用偽裝成「公司內部 API gateway 設定」的 `CLAUDE.md`，誘導 agent 把 `.claude/settings.json` 寫進一個指向攻擊者伺服器的 `ANTHROPIC_BASE_URL`。這一步同時達成兩件事：Claude 之後每次呼叫模型 API 都會把 OAuth token 送到攻擊者的伺服器（等於帳號劫持），而攻擊者的伺服器又能冒充模型回傳工具呼叫（例如帶著 `dangerouslyDisableSandbox: true` 的 `Bash` 指令），讓受害者的 agent 在「以為是模型自己決定」的情況下執行任意程式碼。這套手法對應 OWASP LLM Top 10 的 **LLM01 Prompt Injection**（攻擊載荷藏在本機檔案這類間接管道）與 **LLM06 Excessive Agency**（agent 被賦予改寫自己執行環境設定、而且改完就自動信任新設定的能力，遠超過「讀一份文件」所需要的權限）。Forever 與 OpenAI、Anthropic 的共同立場是：這不是傳統可修補的漏洞——agent 讀取工作目錄裡的指示檔並照做，正是它被設計要做的事，問題出在「網頁能悄悄改變使用者信任的資料夾內容」這個落在誰的威脅模型之外的縫隙。

```diagram
title: 網頁下載的檔案如何劫持 Codex 與 Claude Code
desc: 惡意網頁讓瀏覽器把 AGENTS.md 靜默存進 Downloads，使用者以該資料夾啟動 agent 後，檔案被當成可信指示，分別讓 Codex 安裝惡意套件、讓 Claude Code 洩漏 OAuth token
caption: 成功率為 Forever Security 原始測試數據；實際攻擊鏈另需繞過多層防護（信任閘門、審核、沙箱、逾時中斷等），詳見正文
---
<svg viewBox="0 0 640 440">
  <path class="dg-line" d="M320 76V88" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 148V164" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 224V232Q320 240 312 240H168Q160 240 160 248V260" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 224V232Q320 240 328 240H472Q480 240 480 248V260" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 320V356" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M480 320V356" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="200" y="20" width="240" height="56" rx="6"/>
  <text class="dg-label" x="320" y="48" text-anchor="middle" dominant-baseline="central">惡意網頁誘導下載</text>

  <rect class="dg-box" x="160" y="92" width="360" height="56" rx="6"/>
  <text class="dg-label" x="320" y="111" text-anchor="middle" dominant-baseline="central">瀏覽器靜默寫入</text>
  <text class="dg-sub dg-mono" x="320" y="131" text-anchor="middle" dominant-baseline="central">~/Downloads/AGENTS.md</text>

  <rect class="dg-box" x="160" y="168" width="360" height="56" rx="6"/>
  <text class="dg-label" x="320" y="187" text-anchor="middle" dominant-baseline="central">以 Downloads 啟動 agent</text>
  <text class="dg-sub" x="320" y="207" text-anchor="middle" dominant-baseline="central">檔案被當成可信工作指示</text>

  <rect class="dg-box" x="30" y="264" width="260" height="56" rx="6"/>
  <text class="dg-label" x="160" y="283" text-anchor="middle" dominant-baseline="central">寫入全域設定</text>
  <text class="dg-sub dg-mono" x="160" y="303" text-anchor="middle" dominant-baseline="central">~/.codex/config.toml</text>

  <rect class="dg-box" x="350" y="264" width="260" height="56" rx="6"/>
  <text class="dg-label" x="480" y="283" text-anchor="middle" dominant-baseline="central">改寫專案設定</text>
  <text class="dg-sub dg-mono" x="480" y="303" text-anchor="middle" dominant-baseline="central">.claude/settings.json</text>

  <rect class="dg-box dg-box--warn" x="30" y="360" width="260" height="56" rx="6"/>
  <text class="dg-label" x="160" y="379" text-anchor="middle" dominant-baseline="central">安裝惡意套件</text>
  <text class="dg-sub" x="160" y="399" text-anchor="middle" dominant-baseline="central">90%+ 成功率</text>

  <rect class="dg-box dg-box--warn" x="350" y="360" width="260" height="56" rx="6"/>
  <text class="dg-label" x="480" y="379" text-anchor="middle" dominant-baseline="central">OAuth token 外流</text>
  <text class="dg-sub" x="480" y="399" text-anchor="middle" dominant-baseline="central">約 50% 成功率</text>

  <text class="dg-edge" x="240" y="228" text-anchor="middle" dominant-baseline="central">Codex</text>
  <text class="dg-edge" x="400" y="228" text-anchor="middle" dominant-baseline="central">Claude Code</text>
</svg>
```

## 防禦做法

現在能做的，是把這個攻擊面當成「已知存在、無法修補，只能靠使用習慣避開」來管理，而不是等廠商推送修補。長期則要補上「agent 自己改寫設定、自己換掉通訊端點」這一類傳統端點防護看不到的行為層監控。

**立即動作**
- 停止把 `~/Downloads` 當成 Codex、Claude Code 或任何 coding agent 的工作目錄，改成只在明確的專案資料夾啟動
- 檢查 `~/.codex/config.toml` 有沒有不認得的 `[mcp_servers.*]` 區塊，以及專案裡的 `.claude/settings.json` 有沒有不是自己設的 `ANTHROPIC_BASE_URL`
- 找出 Downloads 資料夾或新 clone 下來的 repo 裡，有沒有自己沒寫過的 `AGENTS.md`、`CLAUDE.md`，讀過內容再決定要不要讓 agent 碰
- 查有沒有裝到 Forever 公布的指標套件 `function-color`（npm 已下架），若有，假設整台機器已受影響，立即輪換所有相關憑證與 token

**長期架構**
- 保持 approval gate 與 sandbox 開著，對任何要求「暫時關掉沙箱／核准」的指令提高警覺——這類旗標幾乎都是攻擊者自己寫出來說服 agent 用的
- 導入 agent 執行層的設定完整性監控，對 `~/.codex/config.toml`、`.claude/settings.json` 這類全域或專案設定檔的非使用者寫入即時告警，watchlist B7 的 Netzilo 定位就是 agent runtime governance 與一鍵斷線（kill switch），適合攔這種「agent 自己改自己設定」的場景
- 若 agent 流量會對外連到非預期端點（像這次的 `ANTHROPIC_BASE_URL` 被改向），watchlist B7 的 WitnessAI 專注在企業 agent 流量的可見性與護欄，能在 base URL 被重導的瞬間抓到異常，而不是等 token 被用掉才發現

## 影響範圍

Forever 的客戶遙測顯示，約有一半的客戶會以 `~/Downloads` 作為 agent 工作目錄，約四分之一的 agent session 會自己開瀏覽器——這代表攻擊面不是少數邊緣案例。光是 Claude Code，該公司客戶群裡就記錄到超過 1,300 次從 Downloads 資料夾啟動的 session。目前已知唯一一次真實攻擊是在這台被攔下的客戶機器上，研究團隊在惡意套件真正執行前就擋下，沒有造成損害；但攻擊者是怎麼把 `AGENTS.md` 放進那台機器的 Downloads 資料夾，至今仍未查明，也沒有證據顯示這是孤立個案或已大規模複製。由於 OpenAI 與 Anthropic 都表示這屬於「agent 設計上就該信任工作目錄」的既有行為，不會發布修補，這個攻擊面會持續開放，直到使用者或企業自己改變啟動 agent 的習慣。

如果你的團隊有人習慣讓 Claude Code 或 Codex「順手整理一下 Downloads」，這篇報告說的就是你現在正暴露的攻擊面。

## 今日收穫

過去談 prompt injection，預設場景多半是「agent 執行任務中讀到一份惡意網頁或 PR 內容，被誘導做壞事」——攻擊發生在任務進行的過程裡。這次事件的不同之處在於，攻擊發生在任務開始之前的「讀取工作目錄設定」這一步，而且目標不是讓 agent 立刻做一件壞事，而是讓它悄悄改寫自己的信任邊界（全域設定檔、API 端點），把一次性的讀取變成機器層級、跨 session 的持久入侵。這提醒我：agent 的「設定載入」階段本身就是一塊攻擊面，不比「工具呼叫」階段安全多少。

## 參考資料

- [Forever Security — Markdown Is the New Executable: Attackers Are Dropping Agent Instructions Into Your Downloads Folder From the Web](https://forever.security/blog/hijacking-ai-agents-via-downloads-folder/)
- [BleepingComputer — AI coding agents hijacked using AGENTS.md file in Downloads folder](https://www.bleepingcomputer.com/news/security/ai-coding-agents-hijacked-using-agentsmd-file-in-downloads-folder/)
- [Dark Reading — In-the-Wild Attack Abuses AI Agents' Trust in Markdown](https://www.darkreading.com/application-security/in-the-wild-attack-ai-agents-trust-markdown)
- [Help Net Security — AI coding agents fall for malicious instructions planted in the Downloads folder](https://www.helpnetsecurity.com/2026/10/26/ai-coding-agents-malware-openai-codex/)
- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/)
