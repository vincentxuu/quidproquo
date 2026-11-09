# 06 沙盒/雲端 VM（無 GUI 桌面取向）B 組：Runloop / Blaxel / Morph Cloud / Northflank Sandboxes / machine0

訪問日期：2026-11-09。官方頁一律走 Groundlane `web_fetch`（鏈 (1)），除註明外未降級。
**先講一個會推翻前提的發現**：這五家裡有三家「不是純 shell」。Runloop 有官方 Computer（Ubuntu Desktop + 滑鼠/鍵盤/截圖 API）與 Browser；Morph 有官方「瀏覽器遠端桌面」範例（XFCE+VNC+noVNC，需自己跑安裝腳本）；Northflank 沒有桌面，只能自己在容器裡裝 Playwright；Blaxel 與 machine0 在我讀過的官方文件索引中沒有任何桌面/瀏覽器功能。「沒有桌面」不能當成這個品類的通則。

## 一、結論摘要（每家最多 6 行）

**Runloop（Devbox，Firecracker 類 μVM 之說見推論；官方只寫 virtual machine technology）**
- 官方有 Computer（Ubuntu Desktop，`key/type/mouse_*/screenshot` API，附 live_screen_url）與 Browser（Playwright/CDP）能力，離 box 最近。
- 持久化只有磁碟：suspend/resume 不保留記憶體與 daemon；suspend 需 Pro（$250/月 + 用量）。
- 價格：CPU $0.108/CPU-hr、記憶體 $0.0252/GB-hr；Basic $0 + 用量，標「1st month FREE」。免費試用限 3 個 running devbox。
- 整合：Python/TS SDK、CLI 內建 MCP server（`rli mcp start`）、Agent Gateway、MCP Hub。
- 風險：公司小（種子輪 $7M，第三方 2026-06 稿）、第三方稱有 Computer Use 但 Daytona 較合適。

**Blaxel（microVM，2026-09-10 被 Baseten 收購）**
- 每個沙盒一個 microVM，待機 ~25ms 恢復且保留記憶體+行程；待機不收算力費，只收快照儲存 $0.20/GB·月。
- 官方文件索引中找不到桌面/瀏覽器/computer-use 功能（只有 code-server 教學與 preview URL）→ 結論：沒有。每個沙盒內建 MCP server（Bearer token，無 OAuth）。
- 免費 Tier 0：10 個沙盒、TTL 最長 7 天；Tier 1（$20 儲值/月）最長 30 天；更高階才無限持久。
- 風險：已被收購，官方承諾「平台持續運作」但無期限；無 GPU。

**Morph Cloud（Infinibranch，完整 VM）**
- 快照/分叉/還原含記憶體與行程，官方宣稱 <250ms；計價用 MCU（$0.05/MCU-hr），暫停只收快照儲存。
- 官方有「瀏覽器遠端桌面」範例（XFCE+VNC+noVNC，自己跑腳本建 snapshot），非開箱即用的 computer-use API（第三方 boat.dev 稱「Browser/Computer-use API: No documented way」）。
- 整合：Python/TS SDK、CLI、Devbox API（含 tmux API 驅動 Claude Code/Codex）；沒讀到官方 MCP server。
- 風險：morph.so 首頁所有工具都只抓到空殼；Free 檔「不含 MCU，要買才能跑」；區域/出口流量價未公開。

**Northflank Sandboxes（CPU 用 microVM/Cloud Hypervisor，GPU 用 gVisor）**
- 本質是 Northflank 的 service/job 平台加沙盒用法，從 0.5 vCPU 到單一沙盒 288 vCPU/2TB RAM、無時間上限，按秒計價 $0.01667/vCPU-hr + $0.00833/GB-hr。
- 沒有桌面/computer-use 產品；官方部落格只說可在沙盒裡跑 Playwright（自備映像）。
- 暫停 = 縮到 0 實例：RAM 不保留、行程結束、暫存碟清空，只有掛載的 volume 活下來。
- 整合：JS/Python SDK、CLI、REST；官方沒有原生沙盒 MCP（第三方 Composio 有 Northflank MCP 工具包）。
- 免費：Sandbox 方案「最多 $20/月資源，2 services、2 jobs、1 db」。

**machine0（YC S26，跑在 DigitalOcean 上的完整 KVM VM）**
- 持久 VM，CLI + 遠端 MCP server，1–60 vCPU/240GB、GPU 到 8×H200；按分鐘計費，**停止（stop）仍全額計費**，要 suspend 才停算力費。
- 無 SDK、無 GUI/桌面/瀏覽器功能（官方文件索引無此頁）；有網頁終端機與 `<vm>.mac0.io` HTTPS 預覽。
- suspend 只快照磁碟，行程不保留；恢復會換 IP；佈建需 1–3 分鐘。
- 無免費額度，最低儲值 $5（可退）。

## 二、逐家逐題發現

### 1. Runloop
**定位與隔離**：「Devbox」是給 AI agent 用的沙盒開發環境。原文：`We use virtual machine technology to provide isolation and safety for your API keys, code, secrets, sensitive data, and internal systems.`（docs.runloop.ai devboxes/overview，read）。第三方 Ry Walker（2026-02/06，read）稱用「custom bare-metal hypervisor」並支援 arm64+x86、非開源；官方 TS SDK README 搜尋摘要寫 `secure microVM sandboxes`（snippet，僅旁證）。[推論] 具體 hypervisor 官方文件未點名。
**規格/OS/GUI**：starter image 為 Ubuntu 系（含 Python 3.12、Node 22.15）。官方頁（runloop-features，read）：`Browser: A remotely-controllable Playwright browser inside your Devbox` 與 `Computer: A remotely-controllable Ubuntu Desktop environment inside your Devbox. Useful for agents that need to interact with GUI applications.`；computer 頁（read）列出動作 `key, type, mouse_move, left_click, left_click_drag, right_click, middle_click, double_click, screenshot, cursor_position`，回傳 `live_screen_url`。Browser 頁：`live_view_url` / `connection_url` 預設只在 devbox 內 localhost，遠端要另開 tunnel。規格上限（vCPU/RAM 最大值）：⚪ 我讀過的官方頁（devbox overview、pricing）沒給具體上限，只說 `You can choose machine size and resources from a range of options`。
**價格（2026-11-09 讀 runloop.ai/pricing，read；FAQ 為折疊，內容未抓到）**：Basic = Free + 用量，`100 GB Free Storage`，`1st month FREE`；Pro = `$250/month + usage`，含 `Suspend and Resume`、Repo Connections、1 TB 免費儲存；Enterprise 洽談。用量：Devbox CPU `$0.108 / CPU-hr`、Memory `$0.0252 / GB-hr`、Devbox Storage `$0.00034236 / GB-hr`、Snapshot/Blueprint/Object Storage `$0.000072 / GB-hr`、Blueprint Build `$0.252 / hour`。試用上限：`3 Running Devboxes / 5 blueprints / 10 snapshots / 3 objects`。閒置計費：lifecycle 頁（read）`Compute is billed only while devbox status is one of [initializing, running, suspending, resuming]`；`Suspended Devboxes still incur storage charges until explicitly shut down`。注意：運行中閒置的 devbox 照收算力（[推論]，官方只說有 idle management 設定）。第三方 DevTune（snippet，僅摘要）稱新帳號 $50 額度、免信用卡，Ry Walker（read）亦寫 $50 credits；官方 pricing 頁抓到的文字沒這句，兩者不一致，不採信。
**持久化**：devbox 概念上是 `ephemeral`；suspend 頁：`Only disk state, not in-memory state is preserved during suspend/resume operations`；`Daemons or other processes running at suspend time must be manually restarted after resuming`；resume 通常「數秒」；原 Devbox ID 與 SSH key 保留。Snapshots：`Currently only disk snapshots are supported.`，預設 `persist indefinitely and continue to incur storage costs`，可從 snapshot 扇出多個 devbox。最長存活時間：⚪ 官方頁未見明確上限（devbox 概述「run for hours or days」見 TS SDK README 摘要，snippet）。
**整合**：Python/TS SDK、CLI、Dashboard；CLI 文件（snippet）：`The CLI includes a Model Context Protocol (MCP) server that allows AI assistants like Claude to interact with your devboxes`（`rli mcp start`）；Agent Gateways 讓 Claude Code 在 devbox 裡用 gateway token 不碰真 key；MCP Hub 把 GitHub/Slack MCP 工具集中管控（features 頁，read）。
**限制與反證**：官方：只存磁碟、daemon 要手動重啟、suspend 屬 Pro。第三方 Ry Walker（read）：CPU-only、閉源、Pro 基本費 $250/月、「No substantive third-party developer commentary」、Computer Use 需求「Daytona better fit」（他的判斷，與官方 Computer 頁並存）。DevTune（snippet）稱員工約 12 人、種子階段。搜尋 limitations/complaints 一輪，沒有找到第三方負評貼文。
**一句話**：[推論] 想要「有桌面+瀏覽器、可由 API 控制、按秒計費」的雲端 VM，且能接受只存磁碟、Pro 才能 suspend 的團隊，是這五家裡最接近 box 的選項。

### 2. Blaxel
**定位與隔離**：官方 pricing（read）：`One microVM per agent, app, or job. Boot in milliseconds, resume from standby in about 25ms`。platform 頁（read）：`Every sandbox runs in its own microVM with no shared kernel.`；Blaxel 自家部落格（2026-04-30，read）稱 `custom Firecracker fork on bare metal`。**2026-09-10 被 Baseten 收購**（blaxel.ai 官方部落格與 TNW/VKTR 多方報導，snippet 級）。
**規格/OS/GUI**：文件：Linux 映像（`blaxel/base-image` 等預置映像），memory 以 MB 設定、CPU 依記憶體自動配（8GB→4 core，16GB→6 core，docs read）。最大值：依 Tier 的記憶體上限，具體值在 console，⚪（app.blaxel.ai/account/quotas 需登入）。檔案系統根在記憶體內（EROFS 唯讀底層 + tmpfs 可寫層，約保留 50% 記憶體給 tmpfs）。**GUI/瀏覽器/computer-use：沒有**。依據：我把 docs.blaxel.ai/llms.txt（完整頁面索引）以 grep 搜 desktop/browser/vnc/playwright/chrom，僅命中 code-server 教學與 OpenAI「computers」措辭，無桌面/瀏覽器/computer-use 頁；Blaxel 自家比較文（2026-04-30）把 Daytona 的 Computer Use API 列為 Daytona 的優勢而非自己的。Android 核心選項（Carbon 世代）存在但那是跑 Android 的 kernel，不是桌面。
**價格（pricing 頁，read）**：沙盒 `Active CPU … $0.0000115 / GB RAM · second`（約 $0.0414/GB-hr；CPU 隨記憶體配、不另收）；`Snapshots storage $0.20 / GB · month`；Images `$0.045/GB·月`；Volumes `$0.12/GB·月`（按配置量收，不管寫多少）。免費層：Tier 0 免費，沙盒上限 10；Tier 1 儲值 $20/月→50；Tier 2 $50/月→200。儲值是預付，不是手續費，促銷額度不算進升級門檻（Quotas 頁，read）。閒置：`suspended time does not count towards active CPU`；約 5 秒（pricing FAQ）/約 15 秒（docs 概述）無連線即進待機（兩頁數字不一致，原文保留）；WebSocket/TCP 連線閒置 15 分鐘才轉待機。
**持久化**：待機保留記憶體+檔案系統+行程（docs）；`Memory state is maintained even after scaling down`；快照不含外部網路連線（DB 連線等會斷）。永久持久要掛 Volume 或 Agent Drive（beta 免費）。**最長存活：免費 Tier 0 TTL 最長 7 天、Tier 1 最長 30 天，更高階可無限**（Expiration 頁，read）。`ttl-idle` 的「活動」只算 resume/suspend 事件，連續運行超過 idle TTL 即使在使用也會被刪（官方警告）。恢復：約 25ms（官方宣稱）。封存模式：只保留檔案系統，記憶體不保留，恢復時間依檔案量。Snapshot/fork 在自家比較文標為 private preview。
**整合**：TS/Python/Go SDK；每個沙盒內建 MCP server `https://<SANDBOX_BASE_URL>/mcp`（Bearer，`there is no OAuth`），官方給 Cursor/Claude Code/Windsurf/Goose 設定；有「Connect Claude Code to a Blaxel Sandbox」教學；OpenAI Agents SDK 沙盒供應商。MCP 工具：process/fs/codegen；`codegenEditFile` 需 Morph 或 Relace API key。
**限制與反證**：官方：Tier 0/1 有到期；free plan 不能申請提升額度；Volume 要刪除重建沙盒才能掛；檔案系統放記憶體→ ENOSPC 需加記憶體或掛 volume（knowledge-base 標題，未全文）。自家比較文承認：CPU-only、無 GPU、無 air-gapped。第三方：收購後承諾「無期限、無 SLA/價格承諾」，標準條款允許未經同意轉讓、終止後 90 天刪資料（beri.net，snippet 摘要）；bex.co 建議備好可攜性方案（snippet）。性能數字多為自家宣稱（含「比其他快 5x」），無獨立驗證。
**一句話**：[推論] 適合代理「反覆回到同一個環境、要即時恢復且只用 shell/檔案」的雲端後端；要點瀏覽器或桌面它不合。

### 3. Morph Cloud
**定位與隔離**：`Infinibranch … snapshot, branch, and restore entire computational environments in under 250ms`（cloud.morph.so/docs/developers，read）。官方 devboxes 頁：「Full virtual machines capable of running any configuration of containers: docker-in-docker, a local Kubernetes cluster … experimental support for Windows, OSX (x86), and nested virtualization」。底層 hypervisor 官方頁未點名 ⚪。
**規格/OS/GUI**：Linux 為主；Windows/macOS(x86)/nested 為 experimental。方案上限（cloud.morph.so/web/subscribe，read，需 render=always 才抓到）：MorphVM「Up to 64 vCPU / 256 GB RAM / 1024 GB 儲存」（第一欄）、256/1024/4096 GB、1024/4096/16384 GB；Devbox 同時 8/32/128、總數 32/128/512。表頭有 Free/Developer/Team/Enterprise/Scale 五欄但數值只有三欄，欄位對應有歧義；boat.dev（第三方，read）把三組數字解讀為 Free/Team/Scale。**GUI**：docs 概述表列 `Remote Desktop … Built-in browser-based access`；範例頁（read）：`Launch full Linux desktop environments in your browser`，內容是 XFCE + VNC + noVNC 的設定腳本並建立可重複使用的 snapshot；devboxes 頁：「programmatically configure devboxes with remote desktops for computer-use」。第三方 boat.dev：Morph 的「Browser: No documented way」「Computer-use API: No documented way」，「you set up the browser and any computer use agent」。所以：有可用的遠端桌面做法，但是自己組裝，沒有 Runloop 那種現成 computer-use API。
**價格（subscribe 頁，read）**：1 MCU = 1 vCPU-hr 或 4GB RAM-hr 或 16GB 磁碟-hr（取最大者），標準 $0.05/MCU；Free $0/月，起始 0 MCU（`Purchase MCUs to use compute`）；Developer 1000 MCU（頁面「Popular」標籤，價格欄對應模糊）；Team $40/月（20% 折扣，$50 價值）；Scale $250/月（33% 折扣，$375 價值）；範例：8vCPU/8GB/8GB 的快照存放 $0.12/月；快照儲存 5 TB-hr = 1 MCU。暫停時只收快照儲存（boat.dev 與 sandbox.watch 摘要一致，subscribe 頁範例亦支持）。出口流量價：未公開（boat.dev 稱）。
**持久化**：快照/分叉含記憶體+行程；devbox 支援 pause/resume、wake-on-SSH/HTTP、TTL 自動暫停、可關閉 auto-sleep 當 VPS 用（docs read）。最長存活：官方頁沒有硬上限，instance 範例用 `ttl_seconds=3600`（參數）；⚪ 沒讀到最大值。恢復時間：<250ms（官方宣稱，未獨立驗證）。
**整合**：Python/TS SDK（Apache-2.0）、CLI、Devbox OpenAPI；tmux API 可驅動 Claude Code/Codex/Gemini CLI；VSCode/Cursor 一鍵 SSH；agent token 最小權限；GitHub Actions runner；Morph Volumes（S3 相容）。MCP server：官方頁沒讀到（boat.dev 表列 `MCP server: No documented way`）。
**限制與反證**：morph.so 首頁（Groundlane 瀏覽器渲染與 Jina 皆只回「morph paragraph sequence」）讀不到內容，pricing 路徑 morph.so/pricing 與 cloud.morph.so/docs/pricing 回 404；Windows/macOS/nested 為 experimental；磁碟超過 16GiB/vCPU 會抬高帳單（boat.dev）；無出站白名單、無密鑰代理（boat.dev）；Math Inc 的案例是「與 Morph 關係密切的公司」自述（rl-list.com 提醒）。boat.dev 是競品（賣 boat 沙盒），其比較表有利益衝突，僅當旁證。搜尋 complaints 一輪沒有找到獨立負評。
**一句話**：[推論] 適合需要「從同一狀態大量分叉（含記憶體）」的評測/RL/平行探索，也可自組桌面；不適合要開箱即用 computer-use。

### 4. Northflank Sandboxes
**定位與隔離**：官方 quickstart（read）：`Each sandbox is a Linux environment running against its own kernel rather than the host's`；`Isolation comes from microVMs for CPU workloads and gVisor for GPU workloads on Northflank cloud`；product 頁：`microVMs on Cloud Hypervisor`。每個沙盒其實是一個 deployment service（docs：`each sandbox is one`）。部落格另稱 Kata+Cloud Hypervisor 為主、也支援 Firecracker/gVisor。
**規格/OS/GUI**：product 頁：`Up to 288 vCPU, 2 TB of memory, and 64 TB of volume storage, with GPUs from L4 to B200`；`50,000+` 同時沙盒；任意 OCI 映像（預設範例 ubuntu:22.04）；Docker inside。**GUI/瀏覽器/computer-use：沒有現成產品**；官方部落格（2026-09-09，read）只說 Playwright 可「與瀏覽器 runtime 一起跑在沙盒裡」，要自己備映像，並把「Browser sessions」列為 ephemeral 用途。沒有桌面串流或 computer-use API 的官方頁。
**價格（northflank.com/pricing，read）**：Sandbox（免費）方案：`2 services, 2 jobs, and 1 database`、`Up to $20/mo of resources on Northflank Cloud`、`Always on, no sleeping`、可接 1 個 BYOC cluster（12 vCPU/48GB，雲端費自付）；Pay as you go：CPU `$0.01667/vCPU/hour`、Memory `$0.00833/GB/hour`、臨時儲存免費、持久碟 `$0.11657/GiB/month`、出口 `$0.06/GB`、Egress gateway `$15/月`；方案例 nf-compute-200（2 vCPU/4GB）`$0.06667/hr`，按秒計費、無座位費。BYOC 只收節點 vCPU `$0.02083/hr`。GPU：L4 $0.80/hr … H100×8 $2.74/hr（頁面標示）… B200 $5.87/hr。閒置：暫停（縮到 0）停算力費；持久碟照收（sandboxes-on-northflank-cloud，read）。運行中閒置照收（[推論]，按秒計「runtime」）。
**持久化**：預設 ephemeral；`No time limits`，沙盒可跑「seconds or weeks」（product，read）。暫停頁（configure-and-manage，read）：`Pausing stops compute billing and ends any running processes and terminal sessions`；`Anything written only to ephemeral storage is lost when the sandbox pauses`；volume 資料保留，resume 後 ephemeral 從空開始。第三方 sandbox.watch（snippet）：RAM 不快照、resume 為冷啟動。→ 無記憶體快照/分叉。冷啟動：官方 `<1s`/0.8s（帶快取映像，自述）；改 plan 需重啟。
**整合**：JS/Python SDK、CLI、REST、exec session 串流；可以 `claude code`/Codex 等在容器裡跑（product 頁列 Codex、Claude Code、OpenCode、Pi 圖示）。原生 sandbox MCP server：我沒讀到官方頁 ⚪；Composio 提供第三方 Northflank MCP 工具包（snippet）。出口注入密鑰、mTLS、Tailscale、S3 FUSE 掛載。
**限制與反證**：官方：region 建專案後不可改；GPU 需特定 region 與帳號 GPU 權限；GPU 沙盒用 gVisor 非 microVM。第三方：RAM 不保存（sandbox.watch snippet）。Ry Walker 提到 Northflank 比較文刻意略過 Runloop（對 Runloop 的批評，不是對 Northflank）。Northflank 的比較表（對 Daytona/Render）是自家行銷。搜尋 limitations 一輪沒有找到獨立負評貼文。
**一句話**：[推論] 已經在用 Northflank 或需要「同一平台放 DB、服務和大量短命沙盒、可自管雲端（BYOC）」的後端團隊；不適合要桌面或記憶體級快照的人。

### 5. machine0
**官網確認**：machine0.io（`Powerful & Persistent Virtual Machines`），文件 docs.machine0.io，YC S26（RockB 部落格與 Pinggy，第三方；Launch HN 2026-08-18 見 Pinggy）。
**定位與隔離**：官方概述（read）：`persistent cloud VMs, designed for long-running agents`。Pinggy（第三方，read）引創辦人：`Every machine is a full KVM virtual machine, not a container or sandbox.`；FAQ（read）：跑在 DigitalOcean，5 區（NY/SF/London/Amsterdam/Singapore）。
**規格/OS/GUI**：`1-60 vCPU, up to 240 GB RAM. Not shared.`（概述，read；實際 pricing 表 `-premium` 才是專用 vCPU，一般尺寸是否共享以後者為準，兩頁措辭不完全一致）；最大 6xl = 60 vCPU/240GB/900GB 碟；GPU 到 8×H200（$39.336/hr）；NixOS 或 Ubuntu 24.04（預裝 Docker、Node、Python、Go、Rust、Bun、Claude Code、Codex、OpenCode）。**GUI/瀏覽器/computer-use：沒有**。依據：docs.machine0.io/llms.txt 完整頁面索引（read）沒有任何桌面/瀏覽器/VNC 頁；功能列只有 SSH、網頁終端機、`<vm>.mac0.io` HTTPS（預設代理 port 80）與 dashboard Web 預覽。
**價格（machine0.io 與 docs pricing，read，2026-11-09）**：按分鐘計費；small 1vCPU/1GB/25GB `$0.013/hr`、large 2vCPU/4GB `$0.052/hr`、xl 4/8 `$0.104/hr`、6xl `$3.714/hr`；映像/快照 `$0.078/GB/月`；磁碟 `~$0.1667/GB/月`；頻寬超額 `$0.01/GiB`。最低儲值 $5、未用餘額可退。**無免費額度**（Pinggy：machine0 是該文章唯一沒有免費額度的產品）。**閒置計費**：`Stopped VMs bill at full rate`；運行中當然全額；suspend 才只收映像儲存；可選 `--on-idle suspend|destroy`（預設 30 分鐘，需 managed SSH key，AMD GPU 尺寸不可用）；餘額到「停機門檻」會自動快照並銷毀運行中的機器。
**持久化**：VM 預設一直開，直到 stop/suspend；suspend＝快照磁碟、刪除雲端實例、IP 變更；Pinggy 與 vm-management 頁一致：只存磁碟不存行程。Disks（beta）可跨 suspend/銷毀保留。最長存活：無限（官方：`VMs remain on unless stopped or suspended`）。恢復時間：建立 1–3 分鐘（官方 lifecycle 表）；suspend 後 resume 時間官方沒給 ⚪（可能因容量不足而 `UNAVAILABLE`，GPU 常見）。
**整合**：無語言 SDK；CLI 每個指令有 `--json`；遠端 MCP server（`claude mcp add --transport http machine0 https://app.machine0.io/mcp`，Pinggy 摘錄）用來管理 VM 並 SSH 執行；Profiles 注入 Claude Code/Codex/GitHub 憑證、MCP 與 prompt；`machine0 skills install` 裝 /create-machine skill；`sync push/pull`。
**限制與反證**：官方：stop 照收費；suspend 換 IP；out-of-capacity 狀態；idle detection 已知限制（極安靜的 SSH 工作階段可能被當閒置）。第三方 RockB（read，摘 HN）：DigitalOcean 鎖定與加價、NixOS 學習曲線、按分鐘計費難預估、IP 保留語意；Pinggy：佈建需 1–3 分鐘，預覽埠要改 80 或開 ufw。產品很新（2026-08 才發表），沒有長期穩定性紀錄。
**一句話**：[推論] 想給 agent 一台「自己擁有的長期主機」且要大規格或 GPU、用 CLI/MCP 操控的人；要桌面或快速啟動的不合。

## 三、讀取完整度盤點表

| 來源 | 讀取程度 | 備註 |
|---|---|---|
| runloop.ai/pricing | read（FAQ 為折疊，內容未抓到，標 partial） | Groundlane，extract 警告「移除大半」但價格表齊全 |
| docs.runloop.ai（概述/devbox overview/features/lifecycle/snapshots/computer/browser） | read | .md 版本 |
| docs.runloop.ai/docs/tools/rl-cli（MCP） | snippet | 僅搜尋摘要 |
| blaxel.ai/pricing、/platform/sandboxes | read | |
| docs.blaxel.ai Sandboxes/Overview、Expiration、MCP、Security/Quotas、sandbox-limits | read | |
| docs.blaxel.ai/llms.txt | read（本機 grep，僅作索引） | 用於「無 GUI」證據 |
| blaxel.ai 比較文 2026-04-30 | read | 自家行銷 |
| Baseten 收購報導（baseten/Blaxel 部落格、TNW、VKTR、beri.net、bex.co） | snippet | 未逐篇讀全文 |
| cloud.morph.so/docs/developers、devboxes/getting-started、examples/remote-desktop | read（頁面經 extract，部分被判為「移除大半」） | |
| cloud.morph.so/web/subscribe | read（render=always）；表格欄位有歧義，標 partial | 一般抓取只得空殼 |
| morph.so（首頁） | partial：Groundlane 瀏覽器渲染、Jina read_url 皆僅「morph paragraph sequence」 | 見 ⚪ |
| morph.so/pricing、cloud.morph.so/docs/pricing | blocked：404（Groundlane） | |
| boat.dev Morph vs Freestyle | read（競品第三方） | |
| northflank.com/pricing、/product/sandboxes | read（警告「移除大半」，內容含完整價格） | |
| northflank docs quickstart、sandboxes-on-northflank-cloud、configure-and-manage-sandboxes | read | |
| northflank 瀏覽器 agent 部落格 | read | |
| machine0.io、docs.machine0.io（overview/pricing/faq/vm-management/llms.txt） | read | |
| Pinggy 比較文（2026-09-28）、RockB machine0 評論 | read | 第三方 |
| docs.morph.so | blocked：Groundlane DNS 無法解析 | 網域不存在，改用 cloud.morph.so/docs |
| Jina search_web | blocked：需 API key | 未再試其他鏈（已有足夠來源） |
| Ry Walker Runloop 研究 | read | 第三方，2026-02 發布、內容至 2026-06 |
| DevTune/sandbox.watch/rl-list/agentic.ai/aifordevelopers | snippet | 只當線索，不進結論 |

## 四、反證與風險

1. **「沒桌面」不是品類通則**：Runloop 官方有 Computer 與 Browser；Morph 官方有遠端桌面範例；Daytona/E2B Desktop 等（不在本批）也有（Pinggy）。Blaxel、machine0、Northflank 才是真的只給 shell/容器。
2. **記憶體保留差異很大**：Blaxel、Morph 保留記憶體與行程；Runloop、machine0、Northflank 都只留磁碟/volume。要「恢復後瀏覽器分頁還在」只有前兩者可能做到（[推論]，且 Morph 需自己裝桌面）。
3. **持久≠免費待機**：machine0 stop 照收全價；Runloop suspend 需 $250/月 Pro；Blaxel 待機收快照費且免費檔 7 天到期；Northflank 暫停後 volume 繼續收費。
4. **廠商自述居多**：Blaxel「25ms」、Morph「<250ms」、Northflank「<1s」皆為官方宣稱；本次沒有獨立量測。Blaxel、Northflank、boat.dev 的比較文都出自賣家，有利益衝突。
5. **收購/新公司風險**：Blaxel 已被 Baseten 收購（2026-09-10），承諾無期限；Runloop 約 12 人種子輪；machine0 與 boat 等為 2026 年新創；Morph 的公司頁與首頁抓不到內容。
6. **文件互相不一致**：Blaxel 待機延遲 5 秒（pricing）vs 15 秒（docs）；machine0「Not shared」vs 只有 premium 為專用 vCPU；Runloop 免費額度官方頁（1st month FREE）vs 第三方（$50 額度）。以上皆保留原文，不替廠商調和。
7. 搜尋 limitations/complaints 的結果：五家都沒有找到獨立的使用者負評貼文（Runloop 連 HN 討論都沒有，Ry Walker 亦如此說）；machine0 的批評來自 RockB 整理的 HN 討論（二手）。這不代表沒有問題，只代表本次搜不到。

## 五、⚪／✉️ 清單

- ⚪ Runloop 單一 devbox vCPU/RAM 上限、最長存活：試了 runloop.ai/pricing、docs.runloop.ai devbox overview/lifecycle/snapshots/features（Groundlane，皆 read），文中無具體上限。可能在 blueprint/resources 頁；未續查。
- ⚪ Runloop 價格頁 FAQ（含「Do I get charged for suspended devboxes?」等答案）：Groundlane 只回問題標題，答案折疊未渲染；lifecycle 頁已有等價說明。
- ⚪ Blaxel 單沙盒最大記憶體與 Tier 0/1 限制細項：docs 指向 app.blaxel.ai/account/quotas，需登入；試過 docs Security/Quotas、sandbox-limits 兩頁（read），無數值。
- ⚪ Morph morph.so 首頁與公司頁文字：Groundlane（含瀏覽器渲染，js_empty_document）、Jina read_url 皆只有空殼；morph.so/pricing、cloud.morph.so/docs/pricing 回 404；docs.morph.so DNS 失敗。已改用 cloud.morph.so/docs 與 /web/subscribe。
- ⚪ Morph 方案欄位對應（Free/Developer/Team/Enterprise/Scale 的數值各是哪一欄）、最長存活、出口流量價、區域：subscribe 頁（render=always）表格欄位數與表頭不齊，boat.dev 稱出口價與區域未公開。
- ⚪ Morph 官方 MCP server：docs 頁沒讀到；boat.dev 表列「No documented way」。
- ⚪ Northflank 原生沙盒 MCP：官方沙盒/部落格頁沒有；只找到 Composio 第三方工具包（snippet）。
- ⚪ machine0 suspend→resume 實際耗時：docs 只給建立 1–3 分鐘與「resume exactly where it left off」（但同頁寫行程不保留）；官方 overview 與 vm-management 都沒量測。
- ⚪ 降級紀錄（toolDegradation）：Jina `search_web` 缺 API key；Groundlane 在 CONCURRENCY_LIMIT/502 時改為逐一重試，未降到鏈的下一層；Morph 首頁額外用了 Jina read_url（鏈 (5)）仍失敗。
- ✉️ 若要確認：Runloop 單 devbox 上限與 Pro 以外是否能 suspend、Morph Free 方案真實額度與 TTL 上限、Blaxel 收購後 SLA/價格承諾，只能寫信（support@runloop.ai、廠商 sales、support@machine0.io 等）。
