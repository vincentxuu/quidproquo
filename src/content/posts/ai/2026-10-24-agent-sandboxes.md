---
title: "沙箱怎麼選：四種隔離的差別，以及 Claude Code 與 Codex 的預設差在哪"
date: 2026-10-24
category: ai
type: deep-dive
tags: [security, ai-agent, sandbox, claude-code, mcp]
lang: zh-TW
series:
  name: "AI Agent 資安工具地圖"
  order: 2
tldr: "我把 agent 沙箱分成四種：共用核心的作業系統隔離、容器編排、本機 microVM、遠端 microVM。Claude Code 的沙箱預設關閉、只包 shell 指令；Codex CLI 本機預設開啟。公開的逃逸案例多半繞過邊界旁邊的設定檔或檢查腳本，不是打穿核心；沙箱回答的是被騙之後能走多遠，不是會不會被騙。用 Claude Code 的話，先開沙箱，再把 ~/.ssh、~/.aws 列進拒絕清單，並另外擋住 Read 工具。"
description: "說明 agent 沙箱的四種隔離層級，比較 Claude Code 與 Codex CLI 的預設範圍與已知繞過，指出沙箱管得到什麼、管不到什麼，並給 Claude Code 使用者可直接照做的設定。"
draft: true
---

> 🌏 [English version](/posts/ai/2026-10-24-agent-sandboxes-en)

上一篇的掃描器管的是「裝進來之前」。有些風險掃不到：agent 讀到網頁裡的惡意指令，被說服去執行一條指令。沙箱的出發點是承認這件事會發生，只問一個問題：agent 被騙之後，最遠能碰到什麼？

先講結論：Claude Code 的沙箱預設關著，開了之後也只包 shell 指令。

在[系列地圖](/posts/ai/2026-10-24-ai-agent-security-tooling-map)上，這是第二類工具，限制的是「agent 執行的指令」這個入口的損害範圍。適合想知道 Claude Code 或 Codex 的預設到底保護了什麼的人。內容依據官方文件、原始碼與公開研究，沒有安裝實測。

## 我把沙箱分成四種

「沙箱」這個詞底下其實是四種不同的東西。這個分法是本文自己的歸納，不是業界標準。

- **共用核心的作業系統隔離。** 用作業系統內建的機制限制單一程序：macOS 的 Seatbelt、Linux 的 bubblewrap 加 seccomp 或 Landlock。Claude Code 的沙箱（底層是 [sandbox-runtime](https://github.com/anthropics/sandbox-runtime)）、Codex CLI、[nono](https://github.com/nolabs-ai/nono) 都屬於這一類。輕、快，但所有程序共用同一個核心。
- **容器編排。** [kubernetes-sigs/agent-sandbox](https://github.com/kubernetes-sigs/agent-sandbox) 自己不提供隔離，把隔離交給 gVisor 或 Kata Containers 這類執行環境，管的是在 Kubernetes 上怎麼大量開沙箱。
- **本機 microVM（輕量虛擬機）。** [smolvm](https://github.com/smol-machines/smolvm) 之類的工具在本機開一台有獨立 guest kernel 的小型虛擬機，邊界比共用核心強，代價是需要 KVM 這類硬體虛擬化支援。
- **遠端 microVM。** [E2B](https://github.com/e2b-dev/E2B) 是雲端代管的 Firecracker microVM，每個沙箱與其他沙箱和主機隔離（見 [E2B 文件](https://docs.e2b.dev/faq/security-and-compliance)），用來跑 LLM 產生或使用者提供的程式碼，不是給本機開發者包住 Claude Code 用的。

共用核心的隔離和有獨立核心的虛擬機，防的東西不一樣，所以不能放在同一張表比強弱。目前也沒有獨立研究量過這些沙箱實際擋得住多少，這篇只比範圍，不排名。

沙箱工具也會有維護風險。代管沙箱服務 Daytona 的公開 repo 在 2026 年 6 月起凍結，最後版本是 v0.190.0，核心搬到私有碼庫，官方宣布[轉為閉源](https://www.daytona.io/dotfiles/updates/daytona-is-going-closed-source)（repo 的 [README](https://github.com/daytonaio/daytona) 有說明）。選沙箱前，先看 repo 最近一次發版的日期和授權有沒有變。

## Claude Code 與 Codex 的預設差在哪

| 項目 | Claude Code | Codex CLI |
|---|---|---|
| 預設是否啟用 | 關閉 | 本機預設啟用（`workspace-write`） |
| 隔離方式 | macOS Seatbelt、Linux bubblewrap；網路經本機 proxy，允許網域清單一開始是空的 | macOS Seatbelt、Linux 預設 bubblewrap 加 seccomp；網路預設關閉 |
| 範圍 | 只包 shell 指令與它啟動的子程序；Read、Edit、WebFetch 等內建工具、你設定在動作前後自動執行的檢查腳本（第 0 篇提過的 hook）、本機 MCP server 都在沙箱外 | 網路 proxy 只過濾沙箱內指令的流量（需自行開啟 `network_proxy`，預設關）；web search、MCP 連線、瀏覽器不在範圍內 |
| 讀寫 | 寫入預設限工作目錄與暫存；讀取幾乎是整台機器，包含 `~/.ssh` 與 `~/.aws/credentials` | 寫入預設限工作目錄與暫存；`.git`、`.aws` 等路徑唯讀；文件沒有列出預設讀取範圍 |
| 完全不用沙箱的出口 | 指令失敗後可用 `dangerouslyDisableSandbox` 重試，要設 `allowUnsandboxedCommands: false` 才關 | `--yolo`（同時關掉核准與沙箱）或 `--sandbox danger-full-access`（只關沙箱） |

Claude Code 的官方文件說得很直接：沒有內建的憑證拒絕清單，只有你列出的檔案和環境變數會被限制。另外，沙箱無法啟動時，預設是不用沙箱照常執行指令，要改成失敗就停，得設 `failIfUnavailable: true`。

沙箱和 Claude Code 本來就有的權限確認是兩層不同的東西。權限確認決定「這個動作要不要跑」，沙箱限制的是「Bash 指令跑起來之後碰得到什麼」。官方文件說明，開了沙箱的自動允許模式後，在沙箱內的 Bash 指令不再逐條問你，所以邊界設得好不好，比沒開沙箱時更要緊。

## 逃逸多半發生在邊界旁邊

兩個 Claude Code 的 CVE 說明了這個模式，共通點是沙箱裡寫下的東西，後來被沙箱外的 Claude Code 當成可信的設定或路徑使用。

- [CVE-2026-25725](https://nvd.nist.gov/vuln/detail/CVE-2026-25725)：Linux 的 bubblewrap 沙箱沒有把啟動時還不存在的設定檔設成唯讀，沙箱內的程式直接建立它，寫入一段啟動時自動執行的腳本，Claude Code 重新啟動後以主機權限執行。
- [CVE-2026-39861](https://nvd.nist.gov/vuln/detail/CVE-2026-39861)：沙箱內的指令建立一個指向工作目錄外的符號連結，沙箱外的 Claude Code 程序之後寫入該路徑，跟著連結寫到了工作目錄外。NVD 的原文把這點說得最清楚：沙箱內的指令和沙箱外的程式各自都寫不到工作目錄外，兩者合起來就能。

兩個都已修復，確認你的 Claude Code 在 2.1.64 以上就好。

Pillar Security 把這類案例概括成：agent 能波及的，是它寫得進去、主機之後會信任的所有東西（[原文](https://www.pillar.security/blog/the-week-of-sandbox-escapes)）。

另一類是沙箱自己產生規則時的邏輯錯誤，例如 [CVE-2025-59532](https://nvd.nist.gov/vuln/detail/CVE-2025-59532)（Codex 0.39.0 以前，模型產生的工作目錄被當成可寫根目錄）和 [CVE-2025-66479](https://nvd.nist.gov/vuln/detail/CVE-2025-66479)（sandbox-runtime 0.0.16 以前，沒設允許網域時網路沙箱沒有生效）。Claude Code 的文件也提醒過：`allowUnixSockets` 若放行 `/var/run/docker.sock`，等於把主機交出去。

就目前公開的 Claude Code 與 Codex 案例來看，繞過的是邊界旁邊的設定檔、檢查腳本、Docker socket 和規則產生邏輯，不是 Seatbelt 或 bubblewrap 本身。我的判斷是，作業系統的隔離機制本身相對可靠，出問題的是它周邊的信任鏈。

## 沙箱答的是「被騙之後走多遠」

沙箱不防止 agent 被說服，它只決定被騙之後能走多遠。Baldur Security 的研究者讓 AI 滲透工具 Strix 去掃一個放了 prompt injection 的網頁，Strix 被騙去執行指令，研究者拿到有 sudo 的 shell。作者寫 Strix 把掃描放在沙箱容器內，這 significantly lowers the impact（大幅降低了影響），文章也沒有示範逃出沙箱。這個案例說明的是：agent 在邊界內仍擁有被授權的一切（這裡至少包括 sudo 和對外連線），沙箱限制的是這些東西以外的世界。

Claude Code 與 nono 都寫得很直接。Claude Code 的文件說沙箱能降低風險，但不是完整的隔離邊界；允許 `github.com` 這類廣泛網域，仍然是一條資料外洩的路。nono 的[安全模型文件](https://nono.sh/docs/cli/internals/security-model)說它不是防逃逸的沙箱，專案的安全說明也寫目前不建議用在正式環境。

## 怎麼用

0. **先看版本。** `claude --version` 確認在 2.1.64 以上（上面兩個 CVE 都已修復）。
1. **Claude Code：開沙箱，補憑證，另外擋 Read。** 在 Claude Code 裡跑 `/sandbox` 開啟，或直接寫進 `~/.claude/settings.json`：

   ```json
   {
     "sandbox": {
       "enabled": true,
       "allowUnsandboxedCommands": false,
       "failIfUnavailable": true,
       "credentials": {
         "files": [
           { "path": "~/.ssh", "mode": "deny" },
           { "path": "~/.aws/credentials", "mode": "deny" }
         ]
       }
     },
     "permissions": {
       "deny": ["Read(~/.ssh/**)", "Read(~/.aws/**)"]
     }
   }
   ```

   兩個但書。`sandbox.credentials` 只管沙箱內的 Bash 指令，擋不了 Read 工具，所以才要另外用 `permissions.deny` 的 `Read(...)` 規則。另外，專案與本機設定檔裡的 `credentials` 條目 Claude Code 不採用，要寫在使用者（或管理員）設定檔。
2. **驗證有生效。** 官方文件的做法：請 Claude 跑 `touch ~/sandbox-probe`，在沙箱裡它應該失敗；如果它問你要不要在沙箱外重試，拒絕。
3. **嚴格模式。** 上面的 `allowUnsandboxedCommands: false` 關掉無沙箱重試（官方稱為 Strict sandbox mode）；`failIfUnavailable: true` 再加上沙箱起不來就拒絕啟動，不會悄悄退回沒有沙箱。
4. **別為了讓 `docker`、`gh` 能跑就丟進 `excludedCommands`。** 官方文件自己警告，被排除的指令用你的完整權限執行。
5. **本機 MCP server 要另外處理。** 它在沙箱外。想一起包住，就把整個 Claude Code 放進容器或虛擬機，或用 sandbox-runtime：`npm install -g @anthropic-ai/sandbox-runtime`，設定放 `~/.srt-settings.json`（預設拒絕所有網路，要先寫好允許的網域和可寫路徑），然後用 `srt claude` 啟動。範例見 Claude Code 文件的 [Sandbox runtime](https://code.claude.com/docs/en/sandbox-environments#sandbox-runtime) 一節。
6. **依情境挑強度。** 下面是我的建議，不是業界規範：

   | 情境 | 建議的隔離 |
   |---|---|
   | 日常開發、信任的專案 | 共用核心的作業系統隔離（Claude Code 沙箱或 Codex 預設） |
   | 要跑不信任的 MCP server 或外來程式碼 | 本機 microVM（例如 smolvm，從它的 README 開始） |
   | 多人共用的雲端服務 | 遠端 microVM（例如 E2B） |
7. **掛載前先問自己：這個目錄被刪光可以嗎？** 掛進虛擬機的目錄、轉發進去的 ssh-agent，agent 都用得到。例如 clawk（一個在虛擬機裡跑 agent 的工具）預設用「跳過權限提示」的模式啟動 agent，因為它把虛擬機當邊界，加 `--safe` 才關。掛載什麼，就等於放行什麼。

## 自我檢查

- Claude Code 的沙箱開了之後，本機 MCP server 在沙箱內嗎？不在，官方文件明說它在沙箱外。
- 只設了 `sandbox.credentials`，Claude 的 Read 工具讀得到 `~/.ssh` 嗎？讀得到。那組設定只管沙箱內的 Bash，Read 工具要用 `Read(...)` 的拒絕規則擋。

## 整體來說

沙箱不防止被騙，它只決定被騙之後能走多遠。共用核心的隔離便宜好用，但邊界旁邊的設定檔和檢查腳本是它最常被繞的地方；虛擬機更強，前提是你掛進去的東西少。今晚可以做一件事：打開 Claude Code 的設定，確認沙箱有沒有開、憑證路徑有沒有列進拒絕清單，Read 工具有沒有另外擋。第 3 篇談動作發生之前的把關：第 0 篇提過的檢查腳本（hook）、護欄與閘道，以及它們出錯時預設是放行還是擋下。

## 參考資料

- [Claude Code 文件：Sandboxing](https://code.claude.com/docs/en/sandboxing)
- [Claude Code 文件：Choose a sandbox environment](https://code.claude.com/docs/en/sandbox-environments)
- [anthropics/sandbox-runtime](https://github.com/anthropics/sandbox-runtime)
- [OpenAI Codex 文件：Sandbox](https://developers.openai.com/codex/sandboxing)
- [OpenAI Codex 文件：Agent approvals & security](https://developers.openai.com/codex/agent-approvals-security)
- [nolabs-ai/nono](https://github.com/nolabs-ai/nono)
- [nono 文件：Security model](https://nono.sh/docs/cli/internals/security-model)
- [smol-machines/smolvm](https://github.com/smol-machines/smolvm)
- [e2b-dev/E2B](https://github.com/e2b-dev/E2B)
- [E2B 文件：Security and compliance](https://docs.e2b.dev/faq/security-and-compliance)
- [kubernetes-sigs/agent-sandbox](https://github.com/kubernetes-sigs/agent-sandbox)
- [Daytona：going closed source](https://www.daytona.io/dotfiles/updates/daytona-is-going-closed-source)
- [daytonaio/daytona](https://github.com/daytonaio/daytona)
- [NVD：CVE-2026-25725](https://nvd.nist.gov/vuln/detail/CVE-2026-25725)
- [NVD：CVE-2026-39861](https://nvd.nist.gov/vuln/detail/CVE-2026-39861)
- [NVD：CVE-2025-59532](https://nvd.nist.gov/vuln/detail/CVE-2025-59532)
- [NVD：CVE-2025-66479](https://nvd.nist.gov/vuln/detail/CVE-2025-66479)
- [Pillar Security：The Week of Sandbox Escapes](https://www.pillar.security/blog/the-week-of-sandbox-escapes)
- [Baldur Security：RCE in Strix Agent](https://baldur.dk/blog/strix-ai-pentester-rce/)
- [clawkwork/clawk](https://github.com/clawkwork/clawk)
- [上一篇：裝 skill 與 MCP 前怎麼掃](/posts/ai/2026-10-24-skill-mcp-pre-install-scanners)
