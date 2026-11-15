# 研究 03：E2B（含 E2B Desktop）與 Daytona（含 Computer Use）

訪問日期：2026-11-09。所有數字除非標 [推論]，皆來自當日讀到的原頁。工具鏈：Groundlane MCP（web_fetch / web_extract / web_search）全程可用，未降級。GitHub 統計走 `api.github.com` 經 Groundlane 取得（`gh` CLI 回 403，因 session 未授權該 repo，改走公開 API）。

## 一、結論摘要

### E2B（+ E2B Desktop）
- 定位：以「沙盒」為本體；桌面是附加元件（`@e2b/desktop` / `e2b-desktop` SDK + `desktop` 模板），Linux 專用（Ubuntu 22.04 + Xfce）。
- 隔離：Firecracker microVM、每個 sandbox 獨立 kernel。無 GPU（官方 FAQ 明寫）。
- 價格（2026-11-09 官方頁）：Hobby $0 + 一次性 $100 credit；Pro $150/月 + 用量；per-second 計費：$0.0504/vCPU-h、$0.0162/GiB-h，磁碟 Hobby 10 GiB / Pro 20 GiB 免費。
- 持久化：pause 同時存檔檔案系統與記憶體；暫停的 sandbox 無限期保留、不計算力費、不佔並行額度；連續執行上限 Hobby 1 h、Pro 24 h（pause/resume 重置）；預設 timeout 5 分鐘且預設 onTimeout = kill（具破壞性）。
- 限制：Hobby 20 並行、Pro 100（可加購到 1,100）；桌面串流「同一時間只能一條 stream」；桌面解析度預設 1024x768（可自訂）。
- 整合：Python/JS SDK、CLI、REST；有 computer-use 原語（screenshot/mouse/keyboard）；官方有 Claude Code / Codex 在 sandbox 內跑的文件與 `@e2b/claude-toolsets`；獨立 MCP server repo 已 archived。
- 開源：E2B repo Apache-2.0，14,778 星；runtime `e2b-dev/infra` Apache-2.0（1,823 星、今天仍有 push）；desktop repo 1,558 星、6 個 open issue。

### Daytona（+ Computer Use）
- 定位：沙盒為本體（預設 Linux container）；Computer Use 是沙盒上的 API/程序（Xvfb+xfce4+x11vnc+noVNC），另有 Linux VM、Windows VM、macOS（Mac 實機預約）。
- 價格：$0.0504/vCPU-h、$0.0162/GiB-h、磁碟 $0.000108/GiB-h（前 5 GiB 免費）、Windows $0.0858/vCPU-h；$200 免費算力、免信用卡；per-second。
- 持久化：container 只能 stop（保留檔案、不保留記憶體）；Linux VM / Windows VM 支援 pause 且保留記憶體。auto-stop 預設 15 分鐘（背景程序不重置）；VM 預設 auto-pause 60 分鐘。
- 限制：Tier 1（驗證 email）10 vCPU / 20 GiB / 30 GiB；單 sandbox 預設上限 4 vCPU / 8 GiB / 10 GiB。
- 整合：Python/TS/Ruby/Go/Java SDK、CLI、REST；本機 stdio MCP（`daytona mcp start`，含 computer use 工具）；Computer Use 含 mouse/keyboard/screenshot/錄影/AT-SPI accessibility tree。
- 開源：`daytonaio/daytona` 已 archived（71,343 星，2026-06 核心轉私有，最後 release v0.190.0 / 2026-06-23），授權 AGPL-3.0；SDK/clients 在 `daytona/clients`。
- 風險：文件正在 v1（daytona.io）→ v2（daytona.com）遷移，v2 的 Windows 頁寫「coming soon」；第三方記錄到 Windows runner 與區域性建立失敗事件。

## 二、逐家逐題發現

### E2B

**1. 定位**
- 官網首頁（read）："An isolated machine for every AI agent: run code, browse, use tools, pause, fork." "Your agent is the product. E2B is where it runs." "One isolated microVM per session… a full desktop" 列在 Execution 能力中。https://e2b.dev/
- 桌面是附加元件：GitHub e2b/E2B README 把 Desktop 列為獨立套件「5. Computer use with Desktop … install the Desktop SDK」。https://github.com/e2b-dev/E2B
- 結論：沙盒本體 + 桌面 SDK 附加（非原生桌面產品）。桌面 SDK 原始碼已併入 E2B monorepo（`packages/desktop-js|python`），`e2b-dev/desktop` repo 只留 template 與範例（該 repo README 的 Note）。https://github.com/e2b-dev/desktop

**2. 規格與 OS**
- 預設 sandbox：getInfo 範例 `cpuCount: 2, memoryMB: 512`；billing FAQ："Start with default resources (2 vCPU, 512 MiB RAM)"。https://docs.e2b.dev/sandbox.md ；https://docs.e2b.dev/billing.md
- 注意內部不一致：pricing 頁記憶體表標 "4 [Default]" GiB。https://e2b.dev/pricing （[推論] 此為 E2B 自身文件矛盾，需實測確認）
- 上限：Hobby 8 vCPU / 8 GiB / 10 GiB disk；Pro 8+ vCPU（聯絡 support 更高）/ 20+ GiB disk。https://docs.e2b.dev/billing.md
- 桌面模板：Ubuntu 22.04 + XFCE + noVNC + xdotool + scrot + LibreOffice，build 時用 8 vCPU / 8 GiB；預設 Xvfb 1024x768x24。https://docs.e2b.dev/template/examples/desktop.md ；https://docs.e2b.dev/use-cases/computer-use.md
- OS：僅 Linux 桌面（"based on Linux and Xfce at the moment"）。另有 Android 16（adb）用例頁，見 llms.txt 索引（只讀到標題，標 partial）。
- 隔離：「proprietary MicroVM runtime, built on Firecracker with dedicated kernels」。https://e2b.dev/ 。無 GPU：FAQ "Does E2B support GPUs? No."（llms.txt 摘要行，read 索引）。

**3. 價格（2026-11-09，e2b.dev/pricing，read）**
| 項目 | 值 |
|---|---|
| Hobby | $0，$100 一次性 credit，sessions ≤1 h，20 並行 |
| Pro | $150/月 + 用量，sessions ≤24 h，100 並行（可擴至 1,100；每個 add-on +500 slots $500/月） |
| Enterprise | 自訂；"starts at a $2,000/mo commit, 500 concurrent included"；含 BYOC |
| vCPU | 1 vCPU $0.000014/s（= $0.0504/h）；2 vCPU $0.000028/s |
| 記憶體 | 4 GiB $0.0000180/s（= $0.0162/GiB-h） |
| 磁碟 | Hobby 10 GiB 免費、Pro 20 GiB 免費 |
- 2 vCPU + 4 GiB = $0.000046/s ≈ $0.1656/h（[推論] 我的計算，與 Simular 的 $0.166/h 一致）。2 vCPU + 512 MiB（官方文件的預設）≈ $0.109/h（[推論]）。
- 計費：按秒，「only while a sandbox is actively running」；暫停/kill/逾時即停止計算力費。每月初結算前月。可設花費上限（budget page）。https://docs.e2b.dev/billing.md
- Pro 不附額外 credit（"Upgrading to the Pro tier does not grant additional credits"）。

**4. 持久化與限制（原頁 read）**
- 暫停：預設存檔案系統 + 記憶體；"A paused sandbox is kept indefinitely"；暫停約 4 秒 / GiB RAM，resume 約 1 秒。https://docs.e2b.dev/sandbox/persistence.md
- 預設 timeout 5 分鐘；`onTimeout` 預設 `kill`（"the default is destructive"）；設 `pause` 才自動暫停；`autoResume` 預設 false。https://docs.e2b.dev/faq/sandbox-lifetime.md
- pause 可能被拒（503 ServiceBusy）；auto-pause 在節點忙碌時最長重試約 2 分鐘，之後可能退成 filesystem-only（resume 會重開機、記憶體遺失）。https://docs.e2b.dev/sandbox/persistence.md
- 連續執行：Hobby 1 h / Pro 24 h / Enterprise 自訂；pause+resume 重置。多日 session 僅 Enterprise（pricing 頁 "Multi-day and persistent sessions"）。
- 並行：Hobby 20 / Pro 100–1,100；paused 不計入。建立速率 Hobby 1/s、Pro 5/s。
- 桌面串流：README「There can be only one stream at a time」；串流指定應用視窗時，應用關閉則 stream 結束。https://github.com/e2b-dev/desktop

**5. 整合**
- SDK：JS/TS、Python（e2b、@e2b/code-interpreter、@e2b/desktop）、CLI、REST（OpenAPI）。
- computer-use API：`screenshot()`、left/right/middle/double click、`moveMouse`、`drag`、`mousePress/Release`、`scroll`、`write`、`press`、`launch`、window 控制；VNC stream（可 view-only、可設 auth key）。https://github.com/e2b-dev/desktop
- Claude 相關：docs 有「Claude Code」（在 sandbox 內執行）、「Claude Managed Agents」、「Claude Toolsets」（`E2BBrowserToolset` / `E2BComputerToolset`，在 E2B 桌面上跑 Claude computer use，live view）、Codex、Cursor、Devin 等頁面。https://docs.e2b.dev/llms.txt ；https://docs.e2b.dev/agents/claude-toolsets.md（後者 partial：回傳在 "Optional browser actions" 段被截斷，約讀完 90%，其餘為選用動作設定）。
- MCP：docs 站有公開 MCP `https://docs.e2b.dev/mcp`（查文件用）；sandbox 內有 MCP gateway（200+ 工具）。獨立 `e2b-dev/mcp-server` repo 為 **archived**（API：archived=true，最後 push 2026-04-16，393 星）。
- 判讀 [推論]：E2B 沒有「把桌面直接當 MCP computer-use 工具」的官方現成 server；Claude Code 要操作 E2B 桌面需自行包 SDK 或使用 claude-toolsets 走 Anthropic SDK tool runner。若要確認請查 claude-toolsets 以外的 MCP 路徑（本次未發現）。

**6. 開源/自架（GitHub API，2026-11-09 取得）**
| repo | 星 | open issues（含 PR） | 最後 push | 授權 |
|---|---|---|---|---|
| e2b-dev/E2B | 14,778 | 127 | 2026-11-09 | Apache-2.0 |
| e2b-dev/desktop | 1,558 | 11（其中 6 個為 issue） | 2026-11-08 | Apache-2.0 |
| e2b-dev/infra（runtime） | 1,823 | 152 | 2026-11-09 | Apache-2.0 |
- 自架：官網「The runtime is Apache-2.0. Run the full stack on one node with E2B Embed」；README 列 AWS/GCP/Azure/Linux（Terraform）。BYOC 為 Enterprise 專屬託管部署。https://docs.e2b.dev/llms.txt（BYOC 頁標題與摘要）
- 最新 SDK：JS v2.62.1、Python v2.62.0（docs 索引）；第三方記錄 10 月的 minor 版曾含 breaking change（見 §4）。

**7. 限制與反證 → 見 §四**

### Daytona

**1. 定位**
- 官網："Fast, Scalable, Stateful Infrastructure for AI Agents"；"Computer Use Sandbox: Secure virtual desktops (Linux, Windows, macOS) you can control with code."（read，首頁）https://www.daytona.io/
- 文件：「Sandboxes run as Linux containers by default. Daytona also provides VM sandboxes with a dedicated Linux VM or Windows OS, GPU sandboxes… and macOS sandboxes running on dedicated Apple silicon hardware.」https://www.daytona.io/docs/en/sandboxes/
- Computer Use 是沙盒上要 `computer_use.start()` 啟動的程序（Xvfb、xfce4、x11vnc、novnc）；官方預設 snapshot 已含相關套件，自訂映像需自行安裝。https://www.daytona.io/docs/en/computer-use/ ；https://www.daytona.io/docs/en/vnc-access/
- 結論：沙盒本體 + 桌面為附加能力（比 E2B 整合更深：有 accessibility tree、錄影、Windows/macOS）。

**2. 規格與 OS**
- 預設 1 vCPU / 1 GiB / 3 GiB；組織預設上限 4 vCPU / 8 GiB / 10 GiB。https://www.daytona.io/docs/en/sandboxes/
- 預設 snapshot：daytona-vm-small/medium/large = 1/2/4 vCPU、1/4/8 GiB、3/8/10 GiB（Linux VM）；windows-small/medium/large = 1/2/4 vCPU、4/8/16 GiB、30/50/50 GiB。同上。
- 桌面預設 1024x768；`VNC_RESOLUTION` 可設 640x480 至 7680x4320，僅能在建立時設定。https://www.daytona.io/docs/en/computer-use/
- Linux 桌面 = Xvfb + xfce4 + noVNC；Windows 桌面（v1 文件）= computer use 於 Linux 與 Windows 可用；v2 的 Windows 文件寫「commands run in PowerShell, desktop is reached over RDP」且 **「Windows sandboxes for Daytona v2 are coming soon.」** https://www.daytona.com/docs/windows-sandboxes（read 全頁，僅 2.5 KB）
- macOS：Mac mini M4 Pro（12 核 / 24 GiB / sandbox 磁碟 220 GiB），**預約制**：一台 Mac 預約 24 小時，$2.5032/Mac-hour、$60.08 / 24h 期；同一台最多 2 個 sandbox；預約不能提前結束；映像 macOS 26.6.2 + Xcode 26.6；桌面 1280x800；SDK 需釘 `daytona==2.0.0a8`（alpha）。https://www.daytona.com/docs/macos-sandboxes（partial：頁面 71 KB，只讀到約前 55%，後段 filesystem persistence / VNC client / errors 未讀）
- 隔離：container = 獨立 namespace + 共用 host kernel（第三方與 Daytona 文件一致）；Linux VM / Windows VM = 獨立 kernel；Daytona README 稱 "dedicated kernel" 為通稱，與 container 預設有落差 [推論]。https://www.anchorterminal.com/tools/daytona（第三方，read）

**3. 價格（2026-11-09，daytona.io/pricing，read；以 extract=full + text 格式取得，預設 markdown 模式僅回標題）**
| 項目 | 值 |
|---|---|
| 免費額度 | "$200 in free compute included"、"Sign up for a free trial - no credit card required" |
| vCPU | $0.0504/h |
| 記憶體 | $0.0162/GiB-h |
| 儲存 | $0.000108/GiB-h（"Price per GiB after first 5 free"） |
| Windows（OS 加價列） | $0.0858/vCPU/h |
| GPU | 例：H100 on-demand $3.95/h、preemptible $2.27/h |
| 計費 | "All billing is calculated per second." |
| Startups | 最高 $50k credit；Enterprise：SSO、audit log、BYOC |
- 2 vCPU + 4 GiB Linux = 0.1008 + 0.0648 = $0.1656/h（[推論] 自算，磁碟 ≤5 GiB 免費）。
- Windows 那一列是加價（surcharge）還是取代 vCPU 單價：頁面只寫「OS Windows $0.0858/vCPU/h」，**未寫明**。⚪（見 §六）
- 計費狀態：Started 計 vCPU+RAM+磁碟；Stopped 只計磁碟；Paused（僅 VM）只計磁碟，記憶體狀態不計費；Archived（僅 container）不計費。https://www.daytona.io/docs/en/billing/
- Tier 階梯（Limits 頁，read）：T1 email 驗證 10 vCPU/20 GiB（表內另寫 10GiB，同頁兩處不一致）/30 GiB；T2 信用卡 + $25 → 100/200/300；T3 $500 → 250/500/2000；T4 每 30 天 $2000 → 500/1000/5000。
  - 同頁「Requirements」表寫 Tier 1 為 "10 / 10GiB / 30GiB"，而下方彙總表寫 Memory 20 GiB（Daytona 文件內部不一致）。

**4. 持久化與限制（read）**
- auto-stop 預設 15 分鐘；`0` = 不自動停止；「auto-stop triggers even if there are internal processes running」；背景腳本、SDK 非 toolbox 請求不重置計時器；重置條件：生命週期變更、sandbox preview 網路請求、SSH 連線、Toolbox SDK API 請求。https://www.daytona.io/docs/en/sandboxes/
- auto-pause（僅 VM）：未設定 auto-pause/auto-stop 時，支援 pause 的類別預設 60 分鐘 auto-pause 且 auto-stop 關閉；與 auto-stop 互斥。同上。
- auto-archive 預設 7 天（container）；最大 30 天。
- container 不支援 pause：「filesystem preserved on stop, but memory state is not」。VM：pause 保留檔案系統 + 記憶體，狀態卸載到附近儲存。同上。
- 最長連續執行時間：**文件中未找到明確上限**；auto-stop 設 0 即可無限期執行（"Running indefinitely"）。另有 wall-clock TTL 選項。⚪→ 已讀 sandboxes 頁，結論：官方無固定最長上限，由 TTL 設定決定。
- 並行：以 vCPU/RAM/磁碟「池」而非 sandbox 數計（Tier 1 = 10 vCPU 共用）；建立速率 300/min（T1）至 600/min（T4）。https://www.daytona.io/docs/en/limits/
- 桌面串流數限制：文件未寫明「同時串流數」；VNC 以 Dashboard / noVNC 連線。⚪（逐一列在 §六）

**5. 整合**
- SDK：Python、TypeScript、Ruby、Go、Java；CLI；REST。https://github.com/daytonaio/daytona（read）
- MCP：`daytona mcp init claude|cursor|windsurf`、`daytona mcp start`（本機 stdio）；工具含 sandbox 管理、檔案、git、程序/程式碼執行、**computer use**、preview。https://www.daytona.io/docs/en/mcp/ （read）
- 第三方（Anchor Terminal，read）給出 Claude Code 指令 `claude mcp add daytona -- daytona mcp start`；此為第三方整理，非 Daytona 官方原文。
- Computer Use API：mouse click/move/drag/scroll/down/up；keyboard type/press/hotkey/down/up；screenshot（全螢幕、區域、壓縮）、螢幕錄影、Linux AT-SPI accessibility tree（get_tree / find_nodes / invoke_node / set_node_value）、display info、視窗列表。https://www.daytona.io/docs/en/computer-use/

**6. 開源/自架（GitHub API，2026-11-09）**
- `daytonaio/daytona`：71,343 星、5,659 forks、open issues 457、archived=true、最後 push 2026-07-24；latest release v0.190.0（2026-06-23）。README 頂端：「This repository is no longer maintained. As of June 2026, Daytona's core development has moved to a private codebase…」 https://github.com/daytonaio/daytona
- 授權：v0.190.0 的 LICENSE 為 GNU AGPL v3（read 檔頭）；Anchor Terminal 註記 SDK/API clients 為 Apache-2.0、CLI 為 AGPL-3.0。
- SDK/clients 轉到 `daytona/clients`（第三方稱 v0.231.0 於 2026-11-07 發布；我未直接讀該 repo → 此項為 snippet 級）。
- 自架：官網首頁 FAQ「Can I Run My Own Instance of Daytona?」標題存在，但本次未讀到答案內容。目前公開 repo 已凍結，自架可行性以 [推論] 視為「僅能使用凍結版本」。

**7. 限制與反證 → 見 §四**

## 三、讀取完整度盤點表

| 來源 | 狀態 | 備註 |
|---|---|---|
| Simular 比較文 | read（完整，174 KB，truncated=false，含 E2B、Daytona 全段） | 廠商自述；頁面 publishedAt 2026-11-09，正文寫數據取自 2026-10-10 |
| e2b.dev 首頁 | read（擷取主內容） | |
| e2b.dev/pricing | read（markdown + text 全頁兩種取法） | 計算機互動值未讀 |
| docs.e2b.dev 首頁、llms.txt、billing、sandbox、persistence、faq/sandbox-lifetime、faq/paused-sandboxes-concurrency、use-cases/computer-use、template/examples/desktop | read | |
| docs.e2b.dev/agents/claude-toolsets | partial（約 90%，尾端被截斷） | |
| github.com/e2b-dev/desktop README、e2b-dev/E2B README | read | |
| GitHub API：desktop、E2B、infra、mcp-server、issues | read（欄位級，用 pattern 抽取） | 非全文 |
| daytona.io 首頁 | read（主內容；擷取器移除大量頁面，warning 已記） | |
| daytona.io/pricing | read（需 extract=full text 才完整） | 預設模式只回標題，為擷取問題 |
| daytona.io/docs/en/limits、billing、computer-use、vnc-access、mcp | read | |
| daytona.io/docs/en/sandboxes | read（52,762 字元，存檔後分段檢視；以 grep 檢視關鍵段，非逐行） | 視為 partial（約 70% 逐段看過） |
| daytona.com/docs/macos-sandboxes | partial（~55%，被截斷） | |
| daytona.com/docs/windows-sandboxes | read | 僅一頁簡介 |
| github.com/daytonaio/daytona README | read | |
| raw LICENSE（v0.190.0） | partial（只讀檔頭，確認 AGPL v3） | main 分支 LICENSE 404 |
| Anchor Terminal：E2B（partial，被截斷約 60%）、Daytona（read 全頁） | 第三方評測站 | 自稱 desk review，無實機測試 |
| 搜尋：Blaxel/ZenML/Agent37/Upstash/Morph/Sandbox0 等 | snippet | 多為競品行銷文，僅作線索，不進結論 |
| E2B GitHub issue #899 | partial（正文前段） | |

## 四、反證與風險

已跑搜尋：`E2B desktop sandbox problems limitations complaints issues`、`Daytona sandbox complaints limitations pricing issues alternatives`（Groundlane 融合搜尋，Brave + You）。未另跑 Hacker News / Reddit 專搜（見 §六）。

**E2B**
1. 官方承認：Hobby 1 h、Pro 24 h 連續上限；預設 timeout 5 分鐘且預設 kill；pause 在高負載可被拒或降級成 filesystem-only；桌面同時只能一條 stream；無 GPU；Volumes 為 beta（檔案鎖可能卡住等，llms.txt 摘要行）。
2. GitHub：issue #899「Getting 404 errors when connecting to paused sandboxes」（2025-09 開，2025-10-31 已關，回報 resume 時 404/409 並延遲約 10 秒）。read(partial)。
3. desktop repo 開放 issue（6 個）：Xvfb 啟動 "context deadline exceeded"（2025-10）、Docker 內 gRPC 連線問題（2025-07）、e2b-desktop 2.3.0 wheel 釘 `pillow<12.0.0`（2026-04，會強迫舊版 Pillow）、串流游標合成需求（2026-08）。標題級（abstract）。
4. 第三方（Anchor Terminal，read partial）：10 月 minor 版 2.53.0 / 2.56.0 / 2.62.0 含標示為 breaking 的變更；每個 project 僅一把無範圍 API key、未見 audit log；無 SLA；ToS 含「可無通知暫停/終止」。
5. 第三方（ZenML、Blaxel，snippet）：Build System 2.0 模板建置可靠度、persistence 在多次 resume 後檔案未保留的 issue 等。利益相關（Blaxel 為競品），僅作線索。
6. 價格面：Pro $150/月底價；memory 預設值在官方頁面與文件間不一致（512 MiB vs 4 GiB）。
7. 桌面僅 Linux/Xfce、預設 1024x768；沒有官方現成 MCP computer-use server（獨立 mcp-server repo 已封存）。

**Daytona**
1. 官方承認：repo 不再維護、核心私有；container 預設不支援 pause；15 分鐘 auto-stop 即使有程序在跑也會停；Windows v2「coming soon」；macOS 為預約制且 SDK 為 alpha（2.0.0a8）。
2. 第三方（Anchor Terminal，read）：Windows runner 於 2026-07-31（3 h 50 m）與 08-01（1 h 40 m）無法建立 sandbox；2026-08-11 us-central-1 建立降級 17.5 小時；10 月有列表降級；2026-06 發布 4 則安全通告（2 High：跨組織角色更新/刪除、preview 設為 private 後仍可存取；2 Moderate），皆已修；container 共享 host kernel；Tier 1/2 網路受限、完整對外網路與 allow list 要 Tier 3；SLA 的服務抵扣僅 Tier 4 以上；舊 repo 的 open issues 不會被回應。
3. 第三方（Blaxel、Agent37、Upstash，snippet，均為競品）：auto-stop 15 分鐘造成閒置計費；長時間常駐成本高（Agent37 宣稱 2 vCPU/4 GB 一個月 730 小時 $120.89，此為自算 + 競品數字，Daytona 自身單價 $0.1656/h × 730 = $120.9，數學自洽 [推論]）。
4. 文件內部不一致：Tier 1 記憶體 10 GiB vs 20 GiB（Limits 頁兩表）。
5. 域名遷移：docs 由 daytona.io 轉到 daytona.com，部分頁面（macOS/Windows）只存在 v2 站。

**共通**：兩家皆為「給開發者的 API 基礎設施」，不含 agent；用於「讓 Claude Code 這類 agent 直接用一台長期桌面」需自行組裝（Daytona 有本機 MCP；E2B 無官方現成桌面 MCP）。

## 五、與 Simular 比較文不一致處（利益相關來源：Simular 為競品，並自稱 layer-3 唯一產品）

| # | Simular 寫法 | 查證結果 | 判定 |
|---|---|---|---|
| 1 | E2B「Open-source runtime (Apache-2.0, 13.4k stars)」 | GitHub API 14,778；E2B 官網顯示 14.8K | 過時/偏低（約 10%） |
| 2 | E2B「≈$0.166/hr derived」以 2 vCPU/4 GiB 為基準 | 單價一致（$0.0504 / $0.0162）；但 E2B 文件稱預設為 2 vCPU/512 MiB（pricing 頁表則標 4 GiB 預設），Simular 未說明基準取捨 | 單價一致；基準可議 |
| 3 | E2B「20 concurrent free, 100 on Pro」 | 一致；漏寫可加購到 1,100 | 省略 |
| 4 | E2B「1 h / 24 h continuous；pausing resets」「約 4 s/GiB pause、約 1 s resume」 | 與官方一致 | 一致 |
| 5 | E2B「one stream per desktop at a time」 | 與 README 一致 | 一致 |
| 6 | E2B 比較未提 | 獨立 MCP server repo 已 archived；有 Claude Toolsets / Claude Code 官方整合；無 GPU | 省略（有利於 Simular 敘事的缺漏） |
| 7 | Daytona「≈$0.166/hr derived (Windows $0.0858/vCPU-hr)」 | Linux 單價一致；省略儲存 $0.000108/GiB-h（前 5 GiB 免費）；Windows 價是否為加價頁面未寫明 | 大致一致；Windows 語意未證實 |
| 8 | Daytona「15-min auto-stop default; VM pause keeps memory」 | 一致；但漏寫 VM 預設改為 60 分鐘 auto-pause（未設定時） | 部分省略，且對 VM 預設行為描述不完整 |
| 9 | Daytona「Linux and Windows desktops (noVNC)」；「macOS sandboxes documented separately」 | v1 文件：Computer Use 支援 Linux 與 Windows；v2 文件的 Windows 頁寫 coming soon 且用 RDP；macOS 為 Mac mini 預約 24 小時 $60.08、SDK alpha，Simular 未提 | 一致但省略重大條件 |
| 10 | Daytona「repo still shows 72k stars, no further updates」 | 71,343 星、archived、最後 release 2026-06-23 | 一致（約略） |
| 11 | Daytona「10 vCPU pooled on verified email, 100 vCPU after $25」 | 與 Limits 頁一致 | 一致 |
| 12 | Daytona「default per-sandbox cap 4 vCPU / 8 GiB」 | 一致（另有磁碟 10 GiB） | 一致 |
| 13 | Daytona「Open-source repository unmaintained since June 2026」 | 一致；未寫授權為 AGPL-3.0 | 一致/省略 |
| 14 | 全文「Every figure was read from the vendor's own pricing or documentation page on 10 October 2026」 | 頁面 publishedAt 為 2026-11-09；Daytona 另有 10 月後的版本與遷移（daytona.com） | 資料新鮮度約 1 個月 |
| 15 | 分類「E2B / Daytona = BYO agent，你要自己寫點擊邏輯」 | 屬實（無內建 agent），但 Daytona 有 MCP 含 computer use、E2B 有 Claude Toolsets，皆可由現成 agent 驅動，並非全需自寫 | 框架偏向（有利於 layer-3 定位） |

Simular 對 box 自身的敘述（睡眠約 1 秒、MCP 連線等）不在本次查證範圍。

## 六、⚪／✉️ 清單

✅ 已找到並讀過：E2B 與 Daytona 價格、持久化、限制、授權、星數、最近 commit/release、computer-use API、Simular 對應段落。

⚪ 整條鏈（Groundlane → 官網/文件原頁）已試仍無公開資料：
1. Daytona「Windows $0.0858/vCPU-h 是加價還是取代」：試過 daytona.io/pricing（text 全頁）、docs/en/billing、docs/en/sandboxes；頁面只列單價，無語意說明。
2. Daytona 桌面「同時串流數」限制：試過 computer-use、vnc-access、limits、sandboxes 頁；無此項數字。
3. Daytona 最長連續執行時間：sandboxes 頁寫 auto-stop 0 = 可無限；無固定上限數字，僅有 wall-clock TTL 機制（該 TTL 小節內容未逐字讀）。
4. E2B 桌面專屬規格（RAM 需求、預設桌面 sandbox 的 vCPU/RAM）：試過 template/examples/desktop、use-cases/computer-use、pricing；僅有 build 用 8 vCPU/8 GiB，執行期預設未明示。
5. Daytona 自架可行性（首頁 FAQ 答案）：首頁只回問題標題，答案未渲染；未再試 docs 自架頁。

✉️ 只能寫信問：
1. E2B：Pro 與 Hobby 預設 sandbox RAM 到底是 512 MiB 還是 4 GiB（support@e2b.dev）。
2. Daytona：v2（daytona.com）Windows 與 macOS 的 GA 時程與定價、`daytona.io` 舊文件 sunset 時程（support@daytona.io）。

未做（誠實揭露，非 ⚪）：Hacker News / Reddit / X 的用戶抱怨未另行搜尋；E2B desktop/E2B 的 issue 內文只讀了 #899 前段與標題清單；Daytona `daytona/clients` repo 與 changelog 未直接讀。
