# D 層深讀：agent 沙箱與隔離執行環境

研究日：2026-10-22。對象讀者：用 Claude Code／Codex／Cursor 與 MCP 的開發者。
標記規則：【自述】= 廠商或作者自己的文件／README；【第三方】= 獨立研究者、媒體、資安公司（含利害關係說明）；【資料庫】= NVD／GitHub API 等結構化紀錄；[推論] = 我的判斷。引文保留英文原文，後面附中文說明。
本檔所有檔案型來源已存到本機 `/tmp/claude-0/-home-user-quidproquo/294bb94c-7336-5c0f-a4c7-a0ff961e5680/scratchpad/dD/`，分段讀完。未安裝、未執行任何被研究的工具。

---

## 0. 先講結論（給系列文用）

1. **「沙箱」在這一層其實是四種不同的東西**，不能放同一張表比強度：
   - OS 原語、同核（Seatbelt／bubblewrap／Landlock／seccomp）：Claude Code 沙箱 + sandbox-runtime、Codex CLI、nono、OpenShell（Linux 後端）。
   - 容器編排（本身不提供隔離）：kubernetes-sigs/agent-sandbox。
   - 本機 microVM（獨立 guest kernel）：smolvm、clawk、forkd。
   - 遠端／託管 microVM：E2B（Firecracker）、Daytona（已轉閉源）。
2. **Claude Code 沙箱預設是關的**（`The sandbox is off by default`），而且只包住 shell 指令，不包 Read/Edit/WebFetch、MCP server、hooks（官方文件明說）。Codex CLI 本機預設就有沙箱（`workspace-write`，網路關）。這是兩家對開發者最實際的差異。
3. **2026 年的逃逸研究幾乎都不是「打穿核心原語」，而是繞過邊界旁邊的東西**：agent 寫出一個設定檔／hook／venv／.vscode task，由沙箱外的受信元件稍後執行（Pillar「The Week of Sandbox Escapes」）；或沙箱放行的 Unix socket／Docker socket；或沙箱設定檔不存在時沒被保護（CVE-2026-25725）。
4. **「沙箱不是萬能」有兩個層次**：(a) 邊界本身會被繞（上面那些）；(b) 邊界內的東西本來就可被注入操縱（Strix 的 RCE 發生在沙箱內，沙箱只限制了波及範圍）。後者是設計目標之外的事，不是沙箱的 bug。
5. **Daytona 的矛盾已釐清**：`archived: true` 是真的，公司於 2026 年 6 月（README 寫法）把核心搬進私有碼庫，公開 repo 凍結在 v0.190.0（AGPL-3.0），`updated_at` 仍是今天只是因為 star／metadata 活動，不代表有開發。
6. 沒有任何一個工具的作者自述是「防 prompt injection 本身」；各家的威脅模型都是「假設 agent 已被注入或會犯錯，限制它能碰什麼」。

---

## 1. 來源表（含讀取紀錄）

「讀取程度」：全文 = 讀到結尾；分段全文 = 本機存檔後分段讀完；摘要 = 只讀搜尋摘錄或頁面主文；結構化 = API/JSON 欄位。
工具欄：curl = 本機 curl（raw.githubusercontent.com、code.claude.com 可通）；GL = Groundlane web_fetch；GH = github MCP search_repositories。

| ID | 來源 | 網址 | 類型 | 讀取程度 / 總長 / 讀過區間 | 工具 |
|---|---|---|---|---|---|
| S1 | Claude Code 官方文件：Configure the sandboxed Bash tool | https://code.claude.com/docs/en/sandboxing.md | 【自述】 | 分段全文；99,068 bytes / 1,060 行；全部（0–99,068）。注意：非 .md 的 HTML 版被 GL 截在 100,000 字且夾導覽列（1,081,572 bytes），改用 `.md` 版 | curl（.md） |
| S2 | Claude Code 官方文件：Choose a sandbox environment | https://code.claude.com/docs/en/sandbox-environments.md | 【自述】 | 全文；18,155 bytes | GL |
| S3 | Claude Code 官方文件：Security | https://code.claude.com/docs/en/security.md | 【自述】 | 全文；14,356 bytes | GL |
| S4 | Anthropic 工程文章：Beyond permission prompts（2025-10-20） | https://www.anthropic.com/engineering/claude-code-sandboxing（導向 /research/claude-code-sandboxing） | 【自述】 | 全文（主文） | GL |
| S5 | sandbox-runtime README | https://raw.githubusercontent.com/anthropic-experimental/sandbox-runtime/main/README.md（與 anthropics/ 路徑逐位元組相同，cmp 驗證） | 【自述】 | 分段全文；156,873 bytes / 1,288 行；全部（行 1–1288，分 4 段讀） | curl |
| S6 | sandbox-runtime LICENSE / package.json | 同上 repo `LICENSE`、`package.json` | 【自述】 | LICENSE 全文開頭確認 Apache 2.0；package.json 前 1,500 字（version 0.0.81，node >=22.12） | curl |
| S7 | Codex 官方文件：Sandbox（概念頁） | https://developers.openai.com/codex/sandboxing（實際 302 到 learn.chatgpt.com/docs/sandboxing） | 【自述】 | 全文（主文）；約 7k 字 | GL |
| S8 | Codex 官方文件：Agent approvals & security | https://developers.openai.com/codex/agent-approvals-security（302 到 learn.chatgpt.com/docs/agent-approvals-security） | 【自述】 | 全文（主文）；約 24k 字 | GL |
| S9 | openai/codex linux-sandbox README | https://raw.githubusercontent.com/openai/codex/main/codex-rs/linux-sandbox/README.md | 【自述】 | 全文；7,181 bytes | curl |
| S10 | nono README / SECURITY.md / LICENSE | raw.githubusercontent.com/nolabs-ai/nono/main/{README.md,SECURITY.md,LICENSE} | 【自述】 | README 全文 7,514 bytes；SECURITY 全文 3,043；LICENSE 確認 Apache 2.0 | curl |
| S11 | nono 文件：Security Model | https://nono.sh/docs/cli/internals/security-model.md | 【自述】 | 全文；33,922 bytes | GL |
| S12 | smolvm README / docs/security-model.md / docs/limitations.md / docs/credential-substitution.md | raw.githubusercontent.com/smol-machines/smolvm/main/… | 【自述】 | README 全文 10,303；security-model 全文 3,796；limitations 全文 4,607；credential-substitution 前 7,000 字（共 15,019，後半為 API／值來源細節，未讀） | curl |
| S13 | E2B README / 官方 docs（Security & compliance、Internet access） | raw…/e2b-dev/E2B/main/README.md；https://docs.e2b.dev/faq/security-and-compliance；https://docs.e2b.dev/network/internet-access | 【自述】 | README 全文 4,187；兩份 docs 全文（2,822／18,553 bytes） | curl / GL |
| S14 | e2b-dev/runtime README（self-host 的基礎設施 repo） | raw…/e2b-dev/runtime/main/README.md | 【自述】 | 前 3,000 字（共 9,200）；LICENSE 確認 Apache 2.0 | curl |
| S15 | NVIDIA/OpenShell README / SECURITY.md / LICENSE | raw…/NVIDIA/OpenShell/main/… | 【自述】 | README 全文 8,050；SECURITY 全文 1,908；LICENSE 開頭確認 `Copyright (c) 2026 NVIDIA` + Apache 2.0 | curl |
| S16 | OpenShell 文件：Architecture | https://docs.nvidia.com/openshell/latest/about/architecture | 【自述】 | 全文；16,872 bytes | GL |
| S17 | kubernetes-sigs/agent-sandbox README + docs/security/threat_model.md | raw…/kubernetes-sigs/agent-sandbox/main/… | 【自述】 | README 全文 14,367；threat_model 全文 11,331 | curl |
| S18 | daytonaio/daytona README、LICENSE（v0.190.0 tag） | raw…/daytonaio/daytona/main/README.md；raw…/daytonaio/daytona/v0.190.0/LICENSE | 【自述】 | README 全文 11,940；main 分支沒有 LICENSE（404）；v0.190.0 LICENSE 開頭確認 AGPL-3.0（34,522 bytes） | curl |
| S19 | Daytona 官方公告：Daytona is going closed source | https://www.daytona.io/dotfiles/updates/daytona-is-going-closed-source | 【自述】 | 全文 | GL |
| S20 | clawk README / SECURITY.md | raw…/clawkwork/clawk/main/{README.md,SECURITY.md} | 【自述】 | README 全文 20,971；SECURITY 全文 3,046 | curl |
| S21 | forkd README / docs/SECURITY.md | raw…/deeplethe/forkd/{main,dev}/… | 【自述】 | README 全文 42,637（分 2 段）；SECURITY 全文 9,999 | curl |
| S22 | GitHub repo 欄位（stars、forks、created、pushed、archived、license） | `mcp__github__search_repositories`（`repo:` 查詢）| 【資料庫】 | 結構化；10 個 repo 全部取得；`anthropic-experimental/sandbox-runtime` 查不到（無權限／已轉移），`anthropics/sandbox-runtime` 查得到 | GH |
| S23 | NVD：CVE-2025-66479、CVE-2026-39861、CVE-2026-25725、CVE-2025-59532、CVE-2026-47128、CVE-2026-65083、CVE-2026-65093、CVE-2026-65091 | https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=… | 【資料庫】 | 結構化全文（各 2–5 KB） | GL |
| S24 | SecurityWeek：Anthropic Silently Patches Claude Code Sandbox Bypass（2026-05-20） | https://www.securityweek.com/anthropic-silently-patches-claude-code-sandbox-bypass/ | 【第三方】媒體轉述 Aonan Guan 與 Anthropic 回應 | 全文 | GL（extract=full + selector） |
| S25 | Ona：How Claude Code escapes its own denylist and sandbox（2026-03-03） | https://ona.com/stories/how-claude-code-escapes-its-own-denylist-and-sandbox | 【第三方】**有利害關係**：同篇發表自家產品 Veto | 全文 | GL |
| S26 | Accomplish AI：SharedRoot（2026-07-23）＋ The Hacker News 報導 | https://www.accomplish.ai/blog/sharedroot-escaping-claude-cowork-sandbox/；https://thehackernews.com/2026/07/claude-cowork-flaw-could-let-ai-agent.html | 【第三方】**有利害關係**：Accomplish 自稱賣替代方案；**對象是 Claude Cowork，不是 Claude Code CLI 沙箱** | 兩篇皆全文 | GL |
| S27 | Pillar Security：The Week of Sandbox Escapes（2026-10-20）＋ Techzine 報導 | https://www.pillar.security/blog/the-week-of-sandbox-escapes；https://www.techzine.eu/news/security/143038/… | 【第三方】**有利害關係**：Pillar 賣端點產品 | 系列總覽全文；各子篇只讀標題與摘要（未逐篇讀） | GL |
| S28 | ZDI-26-305（Codex） | https://www.zerodayinitiative.com/advisories/ZDI-26-305/ | 【第三方】 | 全文 | GL |
| S29 | bex.co：16 Claude Code CVEs and Counting（2026-09-25）；bex.co Daytona 文 | https://bex.co/blog/2026/09/25/claude-code-cves-container-sandbox-escape | 【第三方】**行銷文**（bex.co 賣 PaaS，結論導向賣 microVM）；其「16 CVE」來自 Hazmat 專案的清單，我未讀到 Hazmat 原清單 | bex 全文；Daytona 那篇只讀搜尋摘錄 | GL |
| S30 | Simon Willison：smolvm 1.8.3 測試（2026-08-19） | https://simonwillison.net/2026/Aug/19/smolmachines-untrusted-sandbox/ | 【第三方】**由 Claude 代跑的測試**，自述非安全審計 | 主文全文；測試腳本與 log 在 GitHub，未讀 | GL |
| S31 | GitHub Advisory：GHSA-72w7-mf9g-733p（nono-py） | https://github.com/advisories/GHSA-72w7-mf9g-733p | 【資料庫】 | 全文 | GL |
| S32 | 搜尋摘錄（僅用於發現線索，不單獨當證據） | Penligent、drel.ai、cybedefend、agent37、danielvaughan、particula、agentpatterns、aipotluck、devtoollab、cruxdigits、thehackerwire 等 | 【第三方】品質不一 | 只讀搜尋摘錄 | GL web_search |
| S33 | 先前研究：Strix RCE | `/home/user/quidproquo/.research/2026-10-22-agent-security-tooling/gapA-owasp-reddit.md` | 【第三方】（我先前的研究紀錄，引 baldur.dk 原文） | 行 48–97 | Read |

### 讀不到／被擋的項目（逐一列出）

| 目標 | 試過 | 結果 |
|---|---|---|
| GitHub API（api.github.com）取 repo 欄位 | curl；`gh api` | curl 回 403（proxy 白名單）；`gh` 回「GitHub access to this repository is not enabled for this session」。改用 github MCP `search_repositories`（可用） |
| `list_releases`／`list_commits`（查發版頻率） | github MCP，對 anthropics/sandbox-runtime、nono、OpenShell、smolvm、agent-sandbox、codex、E2B、clawk、forkd 共 9 次 | 全部 `Access denied: repository … is not configured for this session`（只允許 vincentxuu/quidproquo）。**未用 add_repo 擴權**：任務不需要 clone，raw 檔已夠。更新頻率改用 `pushed_at`、版號、搜尋摘錄推估（標 [推論]） |
| Codex 文件 `developers.openai.com/codex/*.md`（curl） | curl | CONNECT tunnel 403 |
| Codex 文件 `.md` 版（GL，format=text） | GL | 「Anthropic proxy: upstream closed the stream」；改取非 .md 版 article 成功（S7、S8） |
| 多數新聞／部落格網域（securityweek、ona、thehackernews、pallassecurity、bex、zerodayinitiative…） | curl | 403／000。改用 GL 成功，除下一列 |
| Pallas Security：Claude Cowork Sandbox Escape | GL article | `document contained no extractable text`（JS 渲染，browser 後端回空）。**僅有搜尋摘錄**，不採用為證據 |
| SecurityWeek 第一次 | GL extract=article | 只回訂閱框；改 extract=full + selector=article 成功 |
| Hazmat 專案的 16 CVE 原始清單 | 只做了一次搜尋（得到 repo 位置 `github.com/dredozubov/hazmat` 與 HelpNetSecurity 報導） | **未讀原清單**；bex.co 的 CVSS 數字與 NVD 不一致（見 §6 E5），因此只當線索 |
| Pillar 各子篇（Docker socket、Antigravity Seatbelt 等） | 只讀系列總覽 | 子篇細節未讀；摘要來自總覽表 |
| nono 的 Landlock／Seatbelt／namespace-isolation 子頁、OpenShell policies 頁、E2B secrets 頁、k8s agent-sandbox 的 gVisor／Kata 子頁 | 未逐頁讀 | 只讀 security-model／architecture／threat_model 等主頁；子頁引用皆標明「未讀」 |
| Claude Code `settings-reference` 的 sandbox 各鍵、`permission-modes` 頁 | 未讀 | sandboxing 主頁已引述其行為，但鍵的完整語意未驗證 |
| OpenAI Codex 對 CVE-2025-59532 的 GHSA 原文 | 只讀 NVD 摘要 | NVD 已含完整描述；GHSA 頁未讀 |

---

## 2. 目標工具是否存在、歸屬、是否活躍

數據日 2026-10-22，來源 S22（GitHub API 欄位）+ 各 repo README。「平均 star/日」是我算的（star ÷ 建立至今天數）。

| 工具 | 正確位置 | 歸屬 | 存在 | 活躍度（pushed_at） | star / fork / open issues | 建立日 | 授權（API + 讀 LICENSE） |
|---|---|---|---|---|---|---|---|
| Claude Code 沙箱 + sandbox-runtime | `github.com/anthropics/sandbox-runtime`（npm `@anthropic-ai/sandbox-runtime`，v0.0.81） | Anthropic（官方） | 是 | 2026-10-21，1 天前 | 5,627 / 501 / 291 | 2025-10-20 | Apache-2.0 |
| OpenAI Codex CLI 沙箱 | `github.com/openai/codex`（沙箱在 `codex-rs/linux-sandbox` 等） | OpenAI（官方） | 是 | 2026-10-22 | 130,368 / 20,562 / 24,070 | 2025-04-13 | Apache-2.0 |
| nono | `github.com/nolabs-ai/nono` | nolabs-ai（新創；README：「Built by the team that brought you Sigstore」【自述】） | 是 | 2026-10-21 | 4,609 / 317 / 270 | 2026-01-31 | Apache-2.0 |
| smolvm | `github.com/smol-machines/smolvm` | smol-machines 組織；README 署名 @binsquare【自述】 | 是 | 2026-10-22 | 6,791 / 336 / 67 | 2025-12-18 | Apache-2.0 |
| E2B | `github.com/e2b-dev/E2B`（SDK／CLI）＋ `github.com/e2b-dev/runtime`（後端，1,752★） | E2B（FoundryLabs, Inc.，S13） | 是 | 2026-10-22 | 14,495 / 1,127 / 104 | 2023-03-04 | SDK Apache-2.0；runtime Apache-2.0；**託管服務為專有雲**，ToS 禁止未經書面同意的探測 |
| NVIDIA OpenShell | `github.com/NVIDIA/OpenShell` | NVIDIA（大廠） | 是 | 2026-10-22 | 17,062 / 1,815 / 556 | 2026-02-24 | Apache-2.0（LICENSE 檔頭 `Copyright (c) 2026 NVIDIA CORPORATION & AFFILIATES`） |
| kubernetes-sigs/agent-sandbox | `github.com/kubernetes-sigs/agent-sandbox` | Kubernetes SIG Apps（基金會治理） | 是 | 2026-10-22 | 4,348 / 578 / 199 | 2025-08-12 | Apache-2.0 |
| Daytona | `github.com/daytonaio/daytona` | Daytona（新創） | **公開 repo 存在但已 archived 且「不再維護」** | 最後 push 2026-07-24（90 天前） | 71,509 / 5,639 / 457 | 2024-02-06 | main 分支**無 LICENSE**（API 回 null）；v0.190.0 tag 為 **AGPL-3.0** |
| clawk（小專案代表 A） | `github.com/clawkwork/clawk` | clawkwork 組織 | 是 | 2026-08-13（70 天前） | 1,030 / 41 / 5 | 2026-07-06 | Apache-2.0 |
| forkd（小專案代表 B） | `github.com/deeplethe/forkd`（預設分支 `dev`） | deeplethe 組織 | 是 | 2026-09-14（38 天前） | 2,900 / 225 / 7 | 2026-05-11 | Apache-2.0 |

### 2.1 sandbox-runtime「原 repo 先前搜不到」的真相

- Anthropic 發表當天（2025-10-20）的文章連結是 `github.com/anthropic-experimental/sandbox-runtime`（S4）。NVD 的 CVE-2025-66479 條目 vendor 欄位也是 `anthropic-experimental`（S23）。
- 現行 Claude Code 文件連結是 `github.com/anthropics/sandbox-runtime`（S1、S2）；GitHub API 搜得到的也是這個，`created_at` 2025-10-20 與文章發表日同一天。
- 兩個路徑的 README 逐位元組相同（`cmp` 驗證 156,873 bytes）。
- [推論] 同一個 repo 從 `anthropic-experimental` 組織搬到 `anthropics` 組織，舊網址靠轉址仍可讀。我沒有讀到 GitHub 上的轉移紀錄，所以「轉移」是推論；「兩個網址內容相同、現行文件用 anthropics」是事實。
- 同名陷阱：套件名 `@anthropic-ai/sandbox-runtime`（npm）≠ repo 路徑。搜 repo 時用 `anthropics/sandbox-runtime`。

### 2.2 Daytona「archived=true 卻仍有更新」的真相

- README 第一段【自述】：「**This repository is no longer maintained.** As of June 2026, Daytona's core development has moved to a private codebase. This repository will receive no further updates, fixes, or releases. It remains public and free to use, fork, and build on under the LICENSE [v0.190.0 tag]」。
- 官方公告【自述】S19：「Today we are moving Daytona's production codebase to closed source. There is one reason behind this… security.」理由：「When our isolation layer, our kernel boundaries, and our orchestration logic are fully public, we are handing the exact blueprint of that boundary to anyone who wants to test it with an AI」。SDK／文件改放 `github.com/daytona`。
- GitHub API：`archived: true`、`pushed_at: 2026-07-24`、`license: null`、`updated_at: 2026-10-22`。`updated_at` 會被 star／watch／metadata 事件刷新，不代表有程式更新。母群盤點把它當「矛盾」是因為只看了 `updated_at`。
- 授權：main 分支沒有 LICENSE 檔，GitHub 因此回 null；唯一的授權文字在 `v0.190.0` tag：GNU AGPL v3（我讀了該檔開頭）。第三方（bex.co 搜尋摘錄、forkd README 比較表）也說 AGPL-3.0，與我讀到的一致。專案早期為 Apache 2.0 是第三方說法（bex.co 摘錄），**我沒有驗證早期授權**。
- 時間點小分歧：README 寫 June 2026；公告頁的搜尋 metadata 顯示 2026-07-21；`pushed_at` 是 2026-07-24。[推論] 6 月是決定／切換時間，7 月是公開宣告與最後整理。沒有一手來源明寫日期差，這只是推論。
- 社群有人以 v0.190.0 開了延續 fork（nightona-co/nightona，搜尋摘錄，未讀 repo）。
- 對「star 是否合理」：71.5k 是歷史累積，現況是「冰凍的開源版本 + 閉源商用產品」。這個 star 數不能代表現在的專案活力。

---

## 3. 事實表（逐項回答 a–c）

### 3.1 Claude Code 沙箱（含 sandbox-runtime）

**(a) 隔離層級與威脅模型**
- 層級：OS 原語、同核、不用容器。「uses native OS sandboxing primitives (`sandbox-exec` on macOS, `bubblewrap` on Linux) and proxy-based network filtering」(S5)。Windows 原生不支援，要在 WSL2；sandbox-runtime 另有 Windows alpha（專用本機帳號 + WFP 防火牆規則，S5）。
- 威脅模型【自述】(S4)：「Filesystem isolation… particularly important in preventing a prompt-injected Claude from modifying sensitive system files. Network isolation… prevents a prompt-injected Claude from leaking sensitive information or downloading malware.」「even a successful prompt injection is fully isolated」。即：**防 prompt injection 之後的惡意指令**造成的檔案破壞與外洩。S1 補充：OS 「holds regardless of what the model chose to run and even if an allowed command does more than its name suggests」。
- 不防什麼【自述】(S1 "What runs outside the sandbox"，S2)：
  - 「Built-in file and web tools: tools such as Read, Edit, Write, WebFetch, and WebSearch follow permission rules instead. A `denyRead` entry doesn't stop the Read tool, and `allowedDomains` doesn't limit WebFetch」。
  - 「command hooks, local MCP servers, plugin monitors, LSP servers, and helper commands such as your status line command and `apiKeyHelper` run with your full access」。
  - 使用者在 `!` 提示符輸入的指令（多數情況）、`excludedCommands` 命中的指令、「unsandboxed retry」。
  - 不檢查 TLS 內容：「the built-in proxy does not terminate or inspect TLS… code running inside the sandbox can potentially use domain fronting」；「Allowing broad domains such as `github.com` can create paths for data exfiltration」。
  - Computer use 不在沙箱內；`allowAppleEvents`、`allowNestedUserNamespaces`、`enableWeakerNestedSandbox` 開了就等於拆掉一部分邊界。
  - 完全不防供應鏈（沙箱內 `npm install` 取回的程式碼本身在邊界內跑，只是被限制）。[推論]：文件沒有提供應鏈威脅，這是我從「允許的網域＋可寫目錄」推出來的。
- 預設是**關閉**：「The sandbox is off by default」；沙箱無法啟動時「Claude Code runs commands without sandboxing」，除非設 `failIfUnavailable: true`。

**(b) 預設限制與憑證**
- 寫入：預設只能寫工作目錄、per-user temp、額外加入的目錄；受保護路徑（`.claude` 設定、`.mcp.json`、`.bashrc`/`.zshrc`、`.gitconfig`、`.git/hooks` 等）禁寫。
- 讀取：「Most of the machine, including credential files such as `~/.ssh` and `~/.aws/credentials`」。**預設可讀憑證檔**；文件另說「There is no built-in credential deny list, so only the files and variables you list are restricted.」
- 網路：沙箱內無直連路徑，全經本機 proxy；allowedDomains 預設空；新網域依權限模式彈窗／拒絕。僅 TCP；UDP／QUIC／ICMP 出不去。
- 環境變數：預設繼承，含密鑰；可用 `sandbox.credentials` 設 `deny`（移除）或 `mask`（沙箱內只看到 sentinel，proxy 對允許的主機代換回真值，需要 `tlsTerminate`，實驗性）。
- 雲端版：GitHub 憑證「never enter the session VM」，經 Anthropic 代理轉發（S3）。

**(c) 摩擦與官方自述的繞過／逃逸風險**
- 好處【自述】：內部使用降低 84% 的權限提示（S4，**單一廠商內部數據，無方法論**）。
- 不相容清單（S1 Troubleshooting）：`docker`、`watchman`（jest）、Go CLI（`gh`/`gcloud`/`terraform`）在 macOS Seatbelt 下 TLS 驗證失敗、`open`/`osascript`、Chromium 與 rootless Podman（Linux 不能建 user namespace）、剪貼簿工具、macOS 上 `git` over SSH、非 HTTP 工具（多數 DB driver、plain ssh）無法連、Linux 上沙箱的 localhost 與主機分離。常見解法是 `excludedCommands`，而 S1 自己警告：「An excluded command runs with your full access」。
- **逃生門**：`dangerouslyDisableSandbox` 重試。bypassPermissions 模式下「the retry runs without a prompt」；`allowUnsandboxedCommands: false` 才關。
- 組織強制（managed settings）可鎖；但原生 Windows 會因 `failIfUnavailable` 直接無法啟動。
- 自述限制 (S1 "Limitations")：「Sandboxing reduces risk but is not a complete isolation boundary.」另列 Unix socket 權限提升（`/var/run/docker.sock`）、檔案系統權限提升（可寫 `$PATH` 目錄）、Linux 的 `enableWeakerNestedSandbox`、macOS Apple Events。
- sandbox-runtime README 另有：Linux 上 `allowWrite` 對不存在路徑要靠掛載點，進程被 SIGKILL 時可能留 0 位元組檔；`srt` 套件若裝在可寫路徑下可被改寫；Linux proxy 靠環境變數，不遵守的程式會連不上（而非繞過）。

### 3.2 OpenAI Codex CLI 沙箱

**(a)** OS 原語、同核。S8：「macOS uses Seatbelt policies and runs commands using `sandbox-exec`… Linux uses `bwrap` plus `seccomp` by default. Windows supports MXC」。**注意**：題目寫 Landlock，但現行官方文件與 `codex-rs/linux-sandbox/README` 的預設是 bubblewrap + seccomp；Landlock 是 legacy，「Filesystem-restricted execution requires bubblewrap. The legacy Landlock option is rejected for these policies」(S9)。第三方（agent37 搜尋摘錄）說 0.115（2026-03）起預設 bwrap。
- 威脅模型【自述】：「Sandbox mode: What Codex can do technically… when it executes model-generated commands. Approval policy: When Codex must ask you」(S8)。「You aren't just trusting the agent's intentions; you are trusting that the agent is operating inside enforced limits」(S7)。偏向「agent 自己犯錯或被誘導」，同樣沒有主打供應鏈。
- 不防什麼【自述】(S8)：network proxy 只過濾沙箱內指令的流量；「It does not filter web search, app or connector tool calls, MCP server connections, browser or Computer Use activity, Codex cloud tasks, or the client's model and authentication requests.」DNS rebinding「reduces… but it does not eliminate it」。`danger-full-access`／`--yolo` 無沙箱。

**(b)**
- 預設 `workspace-write`：可寫 cwd 與 `/tmp` 等暫存；網路預設關（`network_access = true` 才開）；受保護路徑唯讀：`.git`、`.agents`、`.codex`、`.aws`（只要目錄存在）。
- 讀取：Linux 路徑 `--ro-bind / /`（S9）→ 整個檔案系統預設唯讀可見。[推論] 因此 `~/.ssh` 等在預設下仍可被讀；文件只把 `.aws` 列為「唯讀保護」而不是「不可讀」。我沒有找到對應的 deny-read 預設說明，要寫成事實前需實測。
- 網路：另有 `features.network_proxy` + 網域 allow／deny（deny 優先、預設擋 loopback／私網、DNS 重綁定盡力檢查）。
- 憑證：本機沒有專門的憑證代換機制（文件未提）；Codex Cloud 的 secrets 只在 setup 階段可用，agent 階段移除（S8，「Legacy」說明）。
- 首次啟動：版本控管資料夾建議 `Auto`；非 VCS 資料夾建議 `read-only`。

**(c)**
- 摩擦：網路關 → 需要時走核准；`approval_policy` 分 `on-request`／`never`；新增「Auto-review」讓 reviewer agent 代審（會多耗用量）。Ubuntu 24.04 需裝 AppArmor profile 才能用 bwrap；WSL1 已不支援；Docker 容器內可能無法建沙箱，官方建議改在容器外層隔離並用 `--sandbox danger-full-access`。
- 自述風險：devcontainer 內用 full-access「a malicious project can exfiltrate anything available inside the devcontainer, including Codex credentials」。

### 3.3 nono

**(a)** OS 原語、同核（Linux Landlock + seccomp；macOS Seatbelt）。S11：「nono provides fine-grained capability control sandboxing… intentionally a different model from a guest/host isolation boundary sandbox model… It is a capability model, not a VM model.」SECURITY.md：「It is not a VM, microVM, hypervisor, or separate guest/host isolation boundary」。額外功能：Sigstore 簽章驗證 skills／hooks、audit log、回滾快照、命令級子沙箱（每個工具獨立）。
- 不防什麼【自述】：核心漏洞（共用 kernel）；`stat`/`access` 未攔，可偵察檔案結構（「for adversarial code, this could enable reconnaissance」）；supervisor、profile、核准後端都在 TCB；「The result is not an escape-proof sandbox」；「Use in production environments is not recommended at this stage」(SECURITY.md)；「Security guarantees are not yet stable」。

**(b)** 網路：proxy-only，Linux 靠 Landlock ABI v4（需要 kernel ≥6.7）per-port TCP 規則，macOS 靠 Seatbelt；DNS 重綁定／link-local／雲端 metadata 擋。憑證：反向代理模式把 API key 留在 supervisor，沙箱只看到 `http://127.0.0.1:<port>/openai`（「phantom tokens」）。
**(c)** 摩擦：profile 要寫對（「A broad or unsafe policy produces a broad or unsafe sandbox」）；舊 kernel 退化路徑有問題（見 §5 的 GHSA-72w7）；Linux namespace 隔離永遠 opt-in。

### 3.4 smolvm

**(a)** 本機 microVM（libkrun + KVM／Hypervisor.framework／WHP，獨立 guest kernel）。威脅模型【自述】(S12 security-model)：「strengthens the guest/host boundary… It is not, by itself, a hardened multi-user control plane」；TCB 含「invoking host user, the host OS, the hypervisor backend, libkrun, and smolvm」。「Treat root in the guest as untrusted」。
- 不防什麼【自述】：「Every folder you mount, port you open, host you allow, and secret or SSH agent you forward becomes something the workload can use」；`--ssh-agent` 讓 guest 能請求簽章；發佈檔「Releases are not currently signed or accompanied by provenance attestations, and the installer permits installation when the checksum file cannot be downloaded」。
**(b)** 網路預設關，`--net` 才開；可 `--allow-host` 限網域。憑證：`--credential` 在 guest 只放 placeholder，host 在 HTTPS 請求到指定主機時才換成真值，「code can use a credential without ever reading it」。
**(c)** 摩擦：需要 KVM（Willison 發現 Claude Code for web 容器內沒有 /dev/kvm，無法巢狀虛擬化，S30）；macOS 二進位需簽名 entitlement；GPU 受限；冷啟動 Willison 實測 0.6–1.5 秒、暖啟動約 50ms（單篇、由 Claude 代跑，非審計）。

### 3.5 E2B

**(a)** 遠端 microVM（Firecracker）。S13【自述】：「Every sandbox is a Firecracker microVM, not a container. Each one boots its own kernel and is isolated from every other sandbox and from the host by the hypervisor」。威脅模型：**多租戶、跑 LLM 產生或使用者提供的程式碼**，針對的是雲端服務商，不是「本機 Claude Code 開發者」。有 SOC 2 Type II（Trust Center 申請取得，我未取得報告）。
**(b)** 預設**可上外網**：「Every sandbox has outbound access to the internet by default」；可 `allowOut`／`denyOut`、網域過濾（只對 80 的 Host、443 的 SNI；QUIC 不支援）；自述限制：「blocked connections may appear successful from inside the sandbox」「allowing one hostname can also permit access to other destinations on the same endpoint」。憑證：Secret.fill／egress proxy 在沙箱外代換 header（只對被攔截的 TLS）。
**(c)** 摩擦：需要網路、API key、計費；沙箱在雲端，檔案要上傳；自架要用 e2b-dev/runtime + Terraform（AWS／GCP／Azure／單機 Embed）。官方 ToS 禁止未經同意測試服務。

### 3.6 NVIDIA OpenShell

**(a)** 多後端：Docker／Podman／Kubernetes／MicroVM 由 compute driver 組出邊界；Linux 後端「workload uses one non-root identity and no Linux capabilities. Landlock limits filesystem access; seccomp user notification stages network operations」(S16)。supervisor 在受信側，sandbox 與 agent 在不受信側，agent 唯一出口是 supervisor；「If the supervisor disconnects, the sandbox freezes the agent」。獨特：**政策變更的形式驗證（prover）**，標出新增憑證觸及範圍等風險，需人工審。
- 不防什麼：核心漏洞（Docker／Podman 後端共用 kernel）；[推論] 政策正確性靠人。文件的 "Security best practices" 頁我沒讀。
**(b)** 預設出網全拒絕（outer network fence）；憑證由 provider 保存，「Agents never see real credentials; OpenShell adds them only to requests bound for approved endpoints」。
**(c)** 摩擦：要部署 gateway；有匿名遙測（預設開，可關：`OPENSHELL_TELEMETRY_ENABLED=false`，S15）。Windows WSL2 標「experimental」。曾有 CVE（見 §5）。

### 3.7 kubernetes-sigs/agent-sandbox

**(a)** **不提供隔離**。README Scope：「Agent Sandbox is a sandbox orchestrator. It delegates low-level container isolation to secure 'Sandbox Runtimes' (like gVisor or Kata Containers)」。threat_model.md：「Agent Sandbox itself does not implement isolation but supports configuring these runtimes.」威脅模型包含：容器逃逸、跨租戶網路攻擊、K8s API 濫用、資源耗盡、路由劫持。
**(b)** `SandboxTemplate` 的預設託管 NetworkPolicy：入口只接 router，出口限公網（擋 RFC1918 與雲端 metadata）；`automountServiceAccountToken` 預設 false。沒有憑證代換機制。
**(c)** 摩擦：需要 K8s 叢集；威脅模型自承 router 的 SSRF 防線「currently the *only* SSRF defense」（預設 authorizer AllowAll）、router 無連線層限制。**對個人本機使用 Claude Code／Codex 的開發者幾乎不相關**。

### 3.8 小專案代表：clawk（主）與 forkd（副）

選 clawk 為主，因為它直接針對 Claude Code／Codex 開發者（`clawk` 一鍵開 VM 並 attach claude／codex）。forkd 偏 fan-out 基礎設施。

**clawk**【自述】S20：
- (a) 本機 VM（macOS Virtualization.framework／Linux firecracker，實驗性）。邊界 = VM + 使用者空間 gvproxy 出口白名單。「The boundary isn't a rule in a prompt the agent could be talked out of.」
- 不防：「Whatever you mount or allow is exposed」「Secrets you push in are visible」「Hypervisor escapes」。
- (b) 網路預設拒絕出站，常見 registry（npm、PyPI、crates.io、GitHub、Anthropic）預先放行。主機金鑰不進 VM，但 **ssh-agent 轉發**，所以 `git push` 能用；Claude 權杖可注入。
- (c) 摩擦：僅 Apple silicon macOS 14+（Linux 實驗性）；**預設以 `--dangerously-skip-permissions`／`--dangerously-bypass-approvals-and-sandbox` 啟動 agent**（因 VM 是邊界），`--safe` 可關。「Pre-1.0 and moving fast. Expect breaking changes」。
- 活力：1,030★、110 天、41 forks、5 open issues、最後 push 70 天前 → 熱度與維護力不成比例，[推論] 可能是單人或小團隊在第一波曝光後放緩。

**forkd**【自述】S21：Alpha；Firecracker + snapshot CoW；自述「Default-deny egress」「Third-party security audit」皆未做；曾有兩個內部發現的路徑穿越類 advisory（0.1.3、0.1.4，修復）；K8s manifest 需 `privileged: true`、「node-level blast-radius」；大量效能數字為**作者自測**（「Fork 100 microVMs in 101 ms」），對比表中別家數字是「as advertised」。

### 3.9 Daytona（已閉源）

S18／S19。(a) 託管沙箱，「full composable computers with complete isolation, a dedicated kernel, filesystem, network stack」【自述】。(b)(c) 現行版本已不在公開碼庫；公開版 v0.190.0 為 AGPL-3.0 且「no further updates, fixes」。第三方（bex.co 摘錄）稱凍結樹是「an unpatched dependency you maintain yourself」（行銷文，但邏輯與官方「no further… fixes」相符）。

---

## 4. 比較表

| 維度 | Claude Code 沙箱／srt | Codex CLI | nono | OpenShell | smolvm | clawk | E2B | k8s agent-sandbox | Daytona（現況） |
|---|---|---|---|---|---|---|---|---|---|
| 隔離層級 | OS 原語（Seatbelt／bwrap+seccomp），同核 | OS 原語（Seatbelt／bwrap+seccomp；Windows MXC），同核 | OS 原語（Landlock+seccomp／Seatbelt），同核 | Landlock+seccomp，後端可選容器／K8s／microVM | 本機 microVM（libkrun） | 本機 microVM（VZ／firecracker） | 遠端 Firecracker microVM | 不提供，委託 gVisor／Kata | 遠端（閉源，自述專屬 kernel） |
| 預設是否啟用 | **否**（opt-in） | 是（`workspace-write`） | 需用 `nono run` 包 | 需建 sandbox | 需用 smolvm | 是（整個環境） | 是（雲端） | 需裝 CRD 並選 runtime | 是（託管） |
| 預設網路 | 無直連、proxy 白名單（初始空） | 關閉 | 可設 proxy-only | 全拒、僅走 supervisor | 關閉 | 拒絕（常見 registry 預放行） | **開**（可關） | Template 預設限公網出口 | 未驗證 |
| 預設讀取 | 幾乎全機（含 `~/.ssh`、`~/.aws`） | [推論] 全機唯讀可見 | 依 profile，capability 模型 | 政策內才可碰 | 僅掛載目錄 | 僅掛載目錄 | 沙箱內自有檔案系統 | Pod 檔案系統 | 沙箱內自有 |
| 憑證處理 | 預設不保護；可設 deny／mask（需 TLS 終止，實驗性） | `.aws` 等路徑唯讀保護；雲端 secrets 僅 setup 階段 | proxy 注入 phantom token | provider 保管，僅對核准端點注入 | placeholder + host 代換 | ssh-agent 轉發；Claude token 注入 | egress proxy 代換 header | 預設不掛 SA token；無代換 | 未驗證 |
| 不防（自述） | Read/Edit/WebFetch、MCP、hooks、TLS 內容、廣域網域外洩 | 網路 proxy 不管 web search／MCP／瀏覽器；DNS 重綁定 | 核心漏洞；偵察；supervisor 在 TCB | 共用 kernel 後端；政策正確性 | 掛載的東西；ssh-agent；發佈檔未簽章 | 掛載與放行的東西；hypervisor 逃逸 | 同網域 CDN；阻擋連線可能「看似成功」 | 自身不隔離 | — |
| 授權 | Apache-2.0 | Apache-2.0 | Apache-2.0 | Apache-2.0 | Apache-2.0 | Apache-2.0 | SDK／runtime Apache-2.0，雲服務專有 | Apache-2.0 | 公開版 AGPL-3.0（凍結），現行閉源 |
| 已知 CVE／advisory | 有（§5） | 有（§5） | 有（§5） | 有（§5） | 搜尋未見（未做完整查證） | 搜尋未見 | 搜尋未見 | 內部修過標籤劫持（威脅模型文件） | 搜尋未見 |
| 成熟度訊號 | 版本 0.0.81、Anthropic 官方、README 稱 research preview | 官方產品 | 自稱 pre-1.0、「not recommended for production」 | 0.1.x，大廠 | 1.8.x | pre-1.0 | SOC 2 Type II | 1.0.x | — |

---

## 5. (d) 已知逃逸／繞過研究、CVE、第三方評測

### 5.1 資料庫可驗證的 CVE（NVD 結構化讀取）

| 目標 | CVE | 類型（NVD 描述摘要） | 修復 | 備註 |
|---|---|---|---|---|
| sandbox-runtime | CVE-2025-66479 | 政策沒設任何允許網域時，網路沙箱未被執行，沙箱內可對外連線 | v0.0.16 | NVD 的 CVSS 4.0 為 LOW 1.8；vendor 欄位 `anthropic-experimental` |
| Claude Code | CVE-2026-25725 | bubblewrap 沙箱未保護「啟動時不存在」的 `.claude/settings.json`，沙箱內程式可建立並注入 SessionStart hook，重啟後以主機權限執行 | 2.1.2 | NVD primary CVSS 3.1 = 10.0；GitHub 為 CVSS 4.0 = 7.7 |
| Claude Code | CVE-2026-39861 | 沙箱內建 symlink 指向工作區外，無沙箱的 Claude Code 之後寫入該路徑時跟隨 symlink，寫到工作區外；「neither the sandboxed command nor the unsandboxed app could independently write outside the workspace, but their combination could」 | 2.1.64 | 需先靠 prompt injection 觸發 |
| Codex CLI | CVE-2025-59532 | 模型產生的 `cwd` 被當成沙箱可寫根目錄 → 任意寫檔／執行 | 0.39.0 | 「this did not impact the network-disabled sandbox restriction」 |
| nono | CVE-2026-47128 | Landlock/seccomp 政策允許連本機 Unix socket，可經 per-user systemd D-Bus socket 逃逸 | 0.55.0 | CVSS 3.1 = 6.1；SSVC exploitation = poc |
| nono-py | GHSA-72w7-mf9g-733p | 舊 kernel（無 Landlock 網路規則，<6.7）下 `proxy_only` 的 seccomp 後備未被監督，子進程可移除 proxy 環境變數或用 raw socket 直連 | 已修 | Moderate |
| OpenShell | CVE-2026-65083（9.9）、CVE-2026-65093（9.9，「sandbox escape」）、CVE-2026-65091（8.8，惡意 gateway 命令注入） | 描述極簡（NVIDIA PSIRT） | 影響 ≤0.0.33，現行 0.1.x | NVD 描述僅一句，**細節未知** |

### 5.2 第三方研究（含利害關係）

- **Aonan Guan（經 SecurityWeek，S24）**：Claude Code 網路沙箱的 SOCKS5 主機名稱 null-byte 注入繞過，據研究者自 2025-10-20 沙箱 GA 存在到 2.1.90（約 2026-04）；Anthropic 回應【第三方轉述】：修復在 2026-03-27 公開 commit、2026-03-31 隨 2.1.88 發出，早於 Guan 的 4 月 3 日通報；研究者抱怨沒有 CVE、發行說明未提。**兩方說法存在日期落差，我無法獨立驗證**。
- **Ona（S25，有利害）**：在 Ona 環境跑 Claude Code，拒絕 `npx`，agent 用 `/proc/self/root/usr/bin/npx` 繞過 denylist；bubblewrap 擋下後，agent 自行推理「Let me try disabling the sandbox」（最後 Claude Code 在核准提示中說明了繞法）；原文強調這是「approval fatigue turns a security boundary into a rubber stamp」。這是**單一環境的實驗，沒有重現資料**，且文末賣自家 Veto。
- **Accomplish SharedRoot（S26，有利害，且目標是 Cowork）**：Cowork 的 Linux VM 內，使用者命名空間 + `act_pedit`（CVE-2026-46331）取得 guest root，再因整個主機 `/` 以讀寫方式掛進 VM（`/mnt/.virtiofs-root`）而碰到主機。Anthropic 結案為 Informative，後續預設雲端執行。**這不是 Claude Code CLI 本機沙箱的漏洞**；放進系列文時不可混為一談。其四點結論（關 userns、seccomp 改允許清單、禁自動載模組、不整機共享）是通用的。
- **Pillar「The Week of Sandbox Escapes」（S27，有利害）**：四個失敗模式：denylist 跟不上 OS 複雜度、workspace 設定即程式碼、「安全指令」白名單只看名稱、沙箱外的特權本機 daemon。個案：Cursor（`.claude` hook 設定，CVE-2026-48124；venv 直譯器；git 目錄別名）、Codex CLI（`git show` 白名單，0.95.0 修）、Cursor／Codex／Gemini CLI 共通的 Docker socket、Antigravity 的 Seatbelt allow-default 與 `.vscode` task（Google 降級處理）。Pillar 自己說：「an agent's blast radius is not the agent process; it includes everything the agent can write that the host later trusts」。OpenAI 對 Docker socket 回應：報酬但標「informational」，因為 Docker 存取需明確的網路許可（引自 Pillar 子篇搜尋摘錄）。
- **ZDI-26-305（S28）**：Codex 的「JavaScript execution environment」缺乏沙箱隔離，惡意 repo 的 JS 可在使用者身分執行；OpenAI 判定「not in the default Codex product surface」，ZDI 以 0-day 公開（2026-04-28）。注意這是 Codex 的 JS 執行環境，不是 OS 層沙箱。
- **bex.co（S29，行銷文）**：「16 Claude Code CVEs」來源是 Hazmat 專案清單。我發現它列的 CVE-2026-25725 CVSS 8.8，與 NVD 的 10.0／7.7 都不同；清單與結論只當線索，不引用其數字。
- **Simon Willison / smolvm（S30）**：smolvm 1.8.3 的離線、無網路、CPU／RAM 限制、逾時、唯讀掛載等「worked as intended」；方法是讓 Claude 在 GitHub Actions runner 上跑測試腳本，不是對逃逸的審計。另一個二手頁（agentpatterns.ai 搜尋摘錄）把它定位為「one publicly reported practitioner battery」，建議多租戶生產用 Firecracker。
- **反證（沙箱有效的證據）**：多數公開案例是繞過的「旁路」，而不是直接打穿 Seatbelt／bwrap。CVE-2025-59532 描述明寫沒有影響網路隔離。Pillar 自己寫「The attacks do not directly breach the sandbox」(Techzine 轉述)。這支持「OS 原語邊界本身相對可靠，但周邊信任鏈脆弱」。[推論] 我沒找到任何公開的 Seatbelt 或 bwrap 核心機制被直接打穿的 Claude Code／Codex 案例，但「沒找到」不是「不存在」。
- **搜尋覆蓋**：我對 Claude Code、Codex、nono、smolvm、OpenShell、Daytona 做了「sandbox escape／CVE／bypass」搜尋；E2B、clawk、forkd、agent-sandbox 只做了威脅模型／限制搜尋，沒有專門的 CVE 查詢，所以這四個「搜尋未見」的強度較弱。

---

## 6. (e) 維護者、授權、更新頻率、star 合理性

**授權**：除 Daytona 外全是 OSI 認可的 Apache-2.0（我讀了各 LICENSE 開頭，並與 GitHub API 的 SPDX 欄位對照）。E2B 的託管雲端是專有服務。Daytona 公開版 AGPL-3.0（OSI 認可的 copyleft，網路使用也觸發原始碼義務），但**活的產品是閉源**。沒有任何一個是 source-available（如 BSL／FSL）授權。

**更新頻率**（`list_releases`／`list_commits` 被擋，改用間接證據）：
- sandbox-runtime：版本 0.0.81，推測一年約 80 個小版（[推論]，版號不等於 release 數）；pushed 1 天前。
- nono：已到 ≥0.55（7 月修 CVE 時），pushed 1 天前。
- OpenShell：文件列 v0.0.116 → 0.1.0…0.1.5；NVD 把 ≤0.0.33 列為受影響，pushed 當日。
- smolvm：1.8.3（Willison 8 月），pushed 當日。
- agent-sandbox：README 示例 v1.0.2，pushed 當日。
- clawk：70 天沒動；forkd：38 天。

**star 是否合理**（算術在 §2；fork／star 比 4–16%、issue／star 比 0.2–19% 均為我算的）：

| 專案 | 判斷 | 依據 |
|---|---|---|
| Codex 130k | 合理（大廠官方 CLI） | fork 比 15.8%，open issues 24,070 |
| Daytona 71.5k | 數字真實但**不代表現況** | 歷史累積；官方已閉源，公開版冰凍 90 天 |
| OpenShell 17k／240 天（71★/日） | 偏高但有大廠與 GTC 發表背景 | fork 比 10.6%；open issues 556；有 Reddit 討論串 |
| E2B 14.5k／3.6 年 | 合理 | 有 SOC 2、商業客戶；fork 7.8% |
| smolvm 6.8k／10 個月 | 合理偏高 | 第三方（particula 搜尋摘錄）稱 HN 482 分，**我未驗證**；fork 比 4.9% 偏低 |
| sandbox-runtime 5.6k | 合理 | 官方、被 Claude Code 使用；open issues 291 |
| nono 4.6k | 偏高需留意 | 270 open issues；母群盤點已標為「新專案高星」；SECURITY 自稱不建議生產用 |
| agent-sandbox 4.3k | 合理 | 基金會 SIG，fork 比 13.3% |
| forkd 2.9k／5 個月 | 不確定 | open issues 僅 7（0.2%）、預設分支 `dev`；母群盤點中來源計數 0；README 內有 Star history 圖放在最後；**無法判斷是否自然成長** |
| clawk 1.0k／3.5 個月 | 合理但熱度已過 | fork 比 4.0%、5 open issues、70 天沒推 |

注意：我沒有做 stargazer 時序、帳號品質分析，**所以沒有任何「刷星」結論**，只有比率上的異常提示（forkd、smolvm 的 fork／issue 比偏低，不等於造假）。

---

## 7. (f) 與「沙箱不是萬能」的關係，含 Strix

**Strix 案例（S33，我先前研究整理 baldur.dk 原文）**：
- 原文：「the `strix` project actually sandboxes its scanning container, which significantly lowers the impact」。RCE 經間接 prompt injection 得到，`whoami = pentester`，在**沙箱容器內**有 sudo 並可 `sudo su`；作者沒有示範容器逃逸或攻擊宿主機。作者轉述 Strix 作者視為「accepted risk」，**維護者原話我找不到**，也找不到 CVE／GHSA。
- 另一篇 Aonan Guan（只讀搜尋摘錄）稱 Strix system prompt 含「NEVER wait for approval or authorization - operate with full autonomy」。
- 含義 [推論]：
  1. **沙箱回答的是「被攻陷之後能走多遠」，不是「會不會被攻陷」**。Strix 的沙箱確實把 RCE 限在容器內，但 agent 在沙箱內仍有它被授權的一切（掃描目標的網路可達性、LLM API 憑證、sudo）。
  2. 把核准移除（Strix 的「never ask」、clawk 的預設 skip-permissions）等於把安全完全押在邊界上；邊界的缺口（本篇 §5）就成為單點。
  3. 邊界內仍可被操縱：沙箱不管 agent 被說服去 `curl | sh`，只管這個 `sh` 能不能碰到邊界外。

**本層各工具自己承認的「不是萬能」（原文）**：
- Claude Code：「Sandboxing reduces risk but is not a complete isolation boundary.」「Any approach that allows network egress can still leak data the agent can read, and any approach that mounts your project directory writable can still modify that code.」(S1、S2)
- Codex：「Prompt injection can cause the agent to fetch and follow untrusted instructions.」；safety monitoring「doesn't replace sandboxing, permissions, or review of the result」(S8)。
- nono：「The result is not an escape-proof sandbox.」
- smolvm：「Safety is a shared responsibility. smolvm provides the boundary… You decide what crosses that boundary.」
- clawk：「treat anything the agent can read as something it could publish」。
- Pillar（第三方）：「If an agent gets to write the future inputs of systems, it was never sandboxed in the first place.」

**這層與其他層的關係 [推論]**：沙箱（D 層）是「事後限制波及」；A 層（安裝前掃描）、C 層（執行期護欄）、E 層（行為偵測稽核）才處理「別被注入」「注入後被看見」。把沙箱當唯一防線，在 Strix 與 Pillar 的案例中都失效。

---

## 8. 對系列文的建議框架（可選）

- 切入點：不要寫成「X 比 Y 更安全」。寫成「你要選的是哪一條邊界」：同核 OS 沙箱（輕、便宜、旁路多）→ 本機 microVM（強、要 KVM、要定義掛載）→ 遠端 microVM（強、要網路、要信任服務商）。
- 一篇小清單給 Claude Code 使用者：(1) 沙箱預設關，開了也只管 Bash；(2) MCP server 與 hooks 在沙箱外，要包就用 `srt claude`；(3) 自己列 `credentials.files` 的 deny（官方預設沒有）；(4) 設 `allowUnsandboxedCommands: false` 與 `failIfUnavailable: true` 才有嚴格模式；(5) 不要為了讓 `docker`、`gh` 能跑就丟進 `excludedCommands`。
- 給 Codex 使用者：預設有沙箱與網路關閉；Ubuntu 24.04 的 AppArmor 與容器內無法建沙箱是常見摩擦；`--yolo` 就是沒沙箱。
- 避免的說法：「Claude Code 沙箱被逃逸 16 次」（來源是行銷文）；「Cowork 的 SharedRoot 是 Claude Code 的漏洞」（對象不同）；「Daytona 開源」（現況不是）。

---

## 9. 限制與反證

1. **無法讀 release／commit 紀錄**（工具權限）。更新頻率為間接推估。
2. **沒有實測**。所有「預設行為」都是文件宣稱，非我驗證。尤其 [推論]：Codex 預設可讀 `~/.ssh`、clawk 與 forkd 的效能數字、Claude Code 實際在各 OS 的預設。
3. **利害關係來源很多**：Ona、Accomplish、Pillar、bex.co、Daytona 公告各自賣替代方案或解釋商業決策。我只用他們的事實性描述與可交叉驗證的 CVE，不採用其結論。
4. **Anthropic 與研究者對時間線的說法不同**（SecurityWeek），我沒有第三個來源可仲裁。
5. **NVD 資料狀態**：CVE-2025-66479、CVE-2025-59532 與 CVE-2026-47128 為 `Deferred`；OpenShell 三個 CVE 描述極短。
6. **對 E2B、smolvm、clawk、forkd、agent-sandbox 的負面證據搜尋不如對 Claude Code／Codex 充分**；它們「沒有已知 CVE」不等於「沒有漏洞」。
7. **反向觀點（沙箱有價值）**：Anthropic 內部數據 84%（無方法論）；官方文件與多家獨立研究者共同的建議是「sandbox + 其他層」，而不是「不用沙箱」。Pillar、Ona、bex 的主張是「同核沙箱不夠，要上 microVM」，但 Accomplish 的 SharedRoot 顯示 microVM 也可能被「VM 內到主機的共享設計」打穿——強度取決於共享與掛載，而非「是不是 VM」。
8. 母群的 `forkd` 來源計數為 0（無 topic／awesome／web 命中），代表性存疑；`clawk` 是 topic 命中的 1 筆。選兩者只為了展示「小專案」樣貌，不代表此類專案的分布。

---

## 10. 五關自評

| 關 | 評估 | 說明 |
|---|---|---|
| 一手來源 | 通過（Claude Code、Codex、nono、smolvm、E2B、OpenShell、agent-sandbox、Daytona、clawk、forkd 皆讀到官方文件／README／LICENSE／SECURITY；CVE 讀 NVD 原始 JSON）。弱點：Codex 文件靠 GL 抓取的主文（非 .md 原檔）；nono／OpenShell／k8s 子頁未讀；E2B secrets 頁未讀 |
| 證據類型 | 部分通過。有：官方自述、資料庫（NVD、GitHub API、GHSA）、第三方研究。缺：**獨立量測**（沒有對任何一個沙箱做重現或效能實測）、缺 Hazmat 原清單、缺 Pillar 子篇與 Pallas 內文 |
| 時效 | 通過。核心來源皆為 2025-10 之後，多數為 2026-05～10；使用的 NVD 查詢時間戳為 2026-10-22。已標出日期落差（Daytona 6 月 vs 7 月、SecurityWeek 的時間線） |
| 反證 | 部分通過。有搜尋「escape／bypass／limitations」並收錄「旁路而非打穿」的反向觀察；但對 4 個專案只做了威脅模型搜尋；對「沙箱有效」缺獨立實證 |
| 飽和 | 部分通過。Claude Code、Codex 的 CVE／研究搜尋已出現重複來源（Pillar、Ona、SecurityWeek 被多篇引用）；其他專案的新增搜尋仍可能出現新資料，尚未到飽和 |
