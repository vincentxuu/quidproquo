# 05 沙盒 A 組查證：Fly.io Sprites / Modal Sandboxes / Vercel Sandbox / Cloudflare Sandbox+Containers
訪問日期：2026-11-09（所有價格、規格皆為該日讀到的官方頁面）。工具：Groundlane MCP（mcp__Groundlane__web_fetch / web_search）全程可用，未需降級到後段 fallback（僅有兩次 CONCURRENCY_LIMIT / proxy stream closed 的暫時錯誤，重試即成功）。

## 一、結論摘要
**共通點**：四家都是「只給 shell / API / SDK 的 Linux 執行環境」，官方定位是讓程式或 agent 跑指令、跑程式碼；沒有一家把「AI 看螢幕＋滑鼠點擊的桌面」當作內建產品能力。跟 Simular box（有桌面、AI 經 MCP 點擊）的根本差異：這四家的輸出是 stdout/檔案/HTTP port，不是畫面。（以下「沒有 GUI」的判斷依據是：我讀過的官方定位與功能清單頁都沒有列出桌面/VNC/computer-use 能力；「官方明文否認」只在少數頁面找到，見各家第 2 題。）

**Fly.io Sprites**：Firecracker 式 microVM（官方稱 hardware-isolated microVM）、持久 ext4 磁碟、閒置即不計費。每個 Sprite 固定 8 vCPU / 100GB，記憶體平台管理。計價 $0.0385/CPU-hr、$0.021875/GB-hr、熱儲存 $0.50/GB-月；新用戶 $30 試用額度。有官方 MCP（sprites.dev/mcp）。最大風險：2026-02 社群回報穩定度差（約 1/5 成功）、官方 2026-10-22 自承舊檔案系統讓部分 Sprite 永久失去 checkpoint 能力並改用 SBD。無桌面。
**Modal Sandboxes**：gVisor（預設）或 VM runtime（自有 Linux kernel）；唯一有 GPU 的一家（僅 gVisor）。Starter 方案每月 $30 免費額度；Sandbox 以「非搶佔 3 倍價」計：$0.00003942/物理核/秒 + $0.00000667/GiB/秒，彈性 burst、`max(request, actual)` 計費。預設存活 5 分鐘、上限 24 小時；有 filesystem / directory / memory snapshot（memory 為 alpha、7 天過期）。**官方文件有「Xvfb+x11vnc+noVNC 桌面 + Browser Use 驅動 Chromium」範例**，所以 Modal 是四家中最接近 box 的（但要自己組、不是內建產品）。
**Vercel Sandbox**：Firecracker microVM，預設 Ubuntu 26.04，預設持久化（stop 自動快照、下次 SDK 呼叫自動 resume）。Hobby 免費（5 小時 Active CPU/月、420 GB-hr 記憶體、單次 45 分鐘、最多 8GB/4 vCPU）；Pro $0.128/Active-CPU-hr + $0.0212/GB-hr，單次最長 24 小時。Active CPU 計價：等 LLM 回應的時間不收 CPU 錢，但記憶體照收。官方有 MCP 工具與 Claude Code/Codex/OpenCode/Devin/Cursor 整合。無內建 GUI；官方 labs 專案在裡面跑 headless Chrome（agent-browser）。
**Cloudflare Sandbox / Containers**：Containers 每個實例是 Firecracker microVM（own kernel）；另有 Dynamic Workers（V8 isolate，非 Linux）。實例最大 4 vCPU / 12GiB / 20GB 磁碟，需 Workers Paid（$5/月）。按啟動中每 10ms 計費，閒置但實例仍在跑仍收記憶體與磁碟費；預設磁碟是暫時的，快照（public beta）只存檔案系統、不存記憶體/程序，30 天過期。實例壽命不保證，且 Cloudflare 官方明寫「不保證執行時間」。無 GUI。

## 二、逐家逐題發現

### 1. Fly.io Sprites
**1. 定位與隔離**
- 官方：「Sprites are persistent, hardware-isolated Linux VMs on Fly.io for AI agents, dev environments and untrusted code, billed by the second and free when idle.」（https://docs.fly.io/sprites ，read）
- 行銷頁：「Sprites are Linux computers for AI agents: hardware-isolated microVMs, persistent or disposable, with checkpoint and restore for the whole environment.」（https://fly.io/sprites/ meta description，read）
- 注意：頁面寫 microVM，但我讀過的 Sprites 頁面沒明寫 Firecracker 這個字；不要在文章裡斷言「Sprites = Firecracker」。[推論：Fly Machines 底層是 Firecracker，但本輪沒讀到 Sprites 官方明文]
**2. 規格 / OS / GUI**
- 「Each Sprite runs with: 8 vCPUs; Memory the platform manages for you, sized per Sprite and able to scale up under pressure; 100 GB of storage」，且「You don't set or resize these yourself」（https://docs.fly.io/sprites/concepts/lifecycle.md ，read）。社群 2026-01 有人問「如何超過 8GB RAM」（只讀到搜尋摘要，snippet）。
- OS：「Sprites run Ubuntu 25.10 with common tools preinstalled」（working-with-sprites.md，read；此頁較舊，版本號可能已變）。預裝 Claude CLI、Gemini CLI、Codex、Cursor 等。
- GUI / 瀏覽器 / computer-use：讀過的官方頁（首頁、docs overview、working-with-sprites、lifecycle、pricing）完全沒有桌面、VNC、瀏覽器自動化的功能描述。官方互動方式是 `sprite exec`、`sprite console`（TTY）、HTTP URL、port proxy、SSHFS。→ 結論：沒有內建 GUI；依據是「官方功能清單未列出」（非明文否認）。第三方 HN（2026-08）提到使用者痛點是缺少「可存取的 tty」，需用 CLI 或自己包 API（HN id=49372904，read，但只是單一留言）。
**3. 價格（2026-11-09，來源 https://fly.io/pricing.md 與 https://fly.io/sprites/ ，read；Ashburn iad）**
- CPU $0.0385/CPU-hr（cpu.stat 累積 CPU 時間）；記憶體 $0.021875/GB-hr（實際使用量）；熱儲存 $0.000683/GB-hr（約 $0.50/GB-月，Sprite 醒著才計）；冷儲存 $0.000027/GB-hr（約 $0.02/GB-月，只要資料存在就計）。
- 免費額度：新用戶 $30 試用額度（每用戶一次、每 org 最多一次）；fly.io/pricing.md 另寫「Every new user gets a $1 free trial… invoices under $5 are waived」，兩處數字不同，我只確定 Sprites 頁面寫 $30（來源兩頁都 read，未能調和差異，使用前請再看帳單頁）。
- 閒置：running 計費；warm、cold 不計算力費；cold 儲存持續計。「A sprite that exists but does nothing costs nothing beyond its storage.」Bandwidth 不計費（Sprites 頁 FAQ）。
- 方案（FAQ）：Hero $100/月含 1,200 CPU-hr、4,800 RAM GB-hr、150GB 儲存；超過照單價另計；Hero 並行 100 running + 100 warm sprites；建立速率 pay-as-you-go 10/分鐘。
- 官方範例：4 小時 Claude Code session 約 $0.23；Web app 30 小時醒著/月約 $1.05。
- 對照條件：單價依實際使用量（CPU 以 cpu.stat、記憶體以實際用量），不是預留量。
**4. 持久化**
- ext4 檔案系統：NVMe 熱快取 + 物件儲存持久副本，持續同步（lifecycle.md，read）。
- 閒置約 30 秒後暫停；**warm**：VM 暫停、記憶體凍結，「100–500ms」恢復且程序接續；**cold**：VM 完全停止、記憶體丟失，「1–2s」喚醒、程序重來；開啟的 TCP 連線都不保留。
- Checkpoint：行銷頁「captures your entire writable filesystem… restoring rewinds your files rather than resuming a paused process」（只存磁碟，不存程序）；建立「10–30 秒」（working-with-sprites）。**文件矛盾**：working-with-sprites 的「What gets saved」清單同時列了 Running processes / In-memory state（我讀到的 markdown 沒有勾叉符號，無法判定是保存還是不保存），而行銷頁與 SBD 部落格明講只是磁碟快照。以行銷頁/部落格為準，標為待確認。
- 最長存活：沒有固定上限；Tasks API 可讓 Sprite 保持 active（單次最長 1 小時、可續）（行銷頁 FAQ）。
**5. 整合**
- SDK：JS/TS（@fly/sprites）、Python（sprites-py）、Go、Elixir、REST API、CLI（fly.io/llms.txt，read）。
- MCP：官方託管 MCP `sprites.dev/mcp`（瀏覽器 OAuth），預設上限 5 個 Sprite 與 `mcp-` 名稱前綴（https://fly.io/blog/sprites-mcp/ ，read，2026-09-03）。另有 Claude Code plugin、Codex、Cursor、OpenCode 等官方外掛（行銷頁）。
**6. 限制與反證**
- 官方承認：舊的自製檔案系統（JuiceFS 改版）出事——「We pointed it at 400 JuiceFS Sprites for about 5,000 cycles. A nonzero number of them permanently lost the ability to checkpoint.」，因此改用 SBD；10/6 前建立的 Sprite 需手動遷移（https://fly.io/blog/sprites-block-device/ ，2026-10-22，read）。
- 社群：「maybe 1 in 5 succeed… timing out at either the sprite creation or any variety of exec steps」（community.fly.io/t/trouble-with-sprites-stability/27104，2026-02-10，read，內有 2026-02-19 另一人也有 503；之後有人說「最近幾天好些」）。這是 2026-02 的資料，之後官方改版（release notes 2026-03 有多項穩定性修補，release notes 頁 partial read）。
- 第三方負面：HN 2026-01 抱怨文件稀疏（僅 snippet）；Ry Walker 研究頁（snippet）。
- 計費驚喜：FAQ 自承有人在 Hero 方案超額，且 RAM 通常是最大項；「Credits apply to Sprites usage only. The monthly subscription fee is billed separately」；儲存不自動擴張、100GB 為上限。
- 搜尋輪次：已跑 limitations / complaints / issues / pricing surprise。
**7. 適用情境** [推論]：要一台「睡著幾乎免費、醒來還在、有自己的 HTTPS URL」的個人/團隊 coding agent 工作機或長壽命小服務，且接受以 CLI/API/MCP 操作而非畫面。不適合需要看畫面、點 GUI 的任務，也先觀察穩定度。

### 2. Modal Sandboxes
**1. 定位與隔離**
- 「Sandboxes, secure containers for executing untrusted code on Modal」（https://modal.com/docs/guide/sandboxes ，read 完整）。兩種 runtime：「gVisor… provides strong isolation and is suitable for most workloads. VMs run the Sandbox in a virtual machine with its own Linux kernel.」可用 `runtime` 參數切換或讓 Modal 自選。
- VM runtime 才能跑 Docker、FUSE、nested cgroups；「GPU Sandboxes are only supported with runtime="gvisor"」；巢狀虛擬化只在 Enterprise。
**2. 規格 / OS / GUI**
- 預設請求 0.125 核 / 128 MiB，可 burst；CPU 軟上限預設為請求值 + 16 物理核；磁碟預設配額 512 GiB（VM runtime root fs 固定 512GiB），最大可 3 TiB（ephemeral_disk，Function 端）（modal.com/docs/guide/resources、sandbox-resources，read）。明確的「最大 vCPU/記憶體」數字在我讀過的頁面沒有（只寫「a maximum is enforced」）；vendor repo README 寫「>16 CPUs、>64GB memory、GPU L4 到 B200」（modal-labs GitHub，partial read，行銷性質）。
- OS：任意 Linux image（OCI/registry/Debian slim 等）。
- **GUI：有官方範例但非內建產品**。「Watch a Browser Use agent drive Chromium over VNC」：VM runtime Sandbox 內 `Xvfb :99 -screen 0 1280x720x24`＋x11vnc＋websockify/noVNC，Browser Use 以 headless=False 驅動 Chromium（https://modal.com/docs/examples/computer_use_vnc ，read 完整）。Modal 官方 X 帳號 2025-07 也貼過「Anthropic's computer use tool in Modal Sandboxes」範例（snippet only，未讀原頁）。→ 要桌面得自己組 image，沒有 box 那種「開機就有桌面＋MCP」。
**3. 價格（2026-11-09，https://modal.com/pricing ，read）**
- Starter $0/月 + 用量，含 $30/月免費額度、100 containers + 10 GPU 並行、3 席；Team $250/月含 $100 額度。
- Sandbox 計價頁：「Sandboxes are billed at non-preemptible rates of 3x list price.」CPU $0.00003942 / 物理核（=2 vCPU）/ 秒，最少 0.125 核；記憶體 $0.00000667 / GiB / 秒。[換算] 約 $0.1419/核-小時（≈$0.071/vCPU-hr）、$0.024/GiB-hr。
- 計費方式：`max(request, actual)`，burst 時只付實際用量；「You never pay for idle resources」是指 serverless 層級，但 Sandbox 存活期間仍依請求值/實際用量計（請求值在 sandbox 整個存活期間都收，即使閒置）。（sandbox-resources.md，read：「You are charged for requested resources for the lifetime of your Sandbox, regardless of whether the resources are being used.」）
- 區域選擇加價 1.15–1.75 倍；非搶佔 3 倍（價格頁表格，read）。
- 第三方比較（只有 snippet，不採信為事實）：morphllm 稱 1 vCPU 約 $0.14/hr vs E2B/Daytona 約 $0.05；beri.net 稱貴 41%；我的換算 $0.071/vCPU-hr 與「貴 41%」大致吻合，但方向數字皆需自行驗證。
**4. 持久化**
- 預設存活 5 分鐘，`timeout` 最長 24 小時；idle_timeout 可設（活動判定：有 exec 進行、stdin 寫入、Tunnel 有 TCP 連線）。超過 24 小時建議用 Filesystem Snapshot 再還原。
- 三種快照（sandbox-snapshots.md，read 完整）：Filesystem（僅 root fs，預設 30 天 TTL，可設無期限）、Directory（30 天）、Memory（alpha，7 天、不可延長）。Memory snapshot 限制：快照會使 Sandbox 終止、開啟的 TCP 連線會關、exec 執行中不能快照、背景程序不會恢復、只能在同樣 instance type 還原、不能用 GPU、不能指定 region。
- Volumes 提供持久儲存（Filesystem Snapshot 不含掛載的 Volume）。
- 休眠恢復時間：官方只說「fast cold starts」，無具體秒數（⚪，見第五節）。
**5. 整合**
- SDK：Python、JavaScript、Go。範例：Run Claude Code in a Modal Sandbox（modal.com/docs/examples/sandbox_agent，snippet）；modal-labs 官方 repo「Claude Managed Agents using Modal Sandboxes」（README partial read）。
- MCP：我沒找到 Modal 官方的 sandbox MCP；找到社群套件 `mcp4modal-sandbox`（PyPI，snippet only，2025-07）。官方 docs 有「Hook it up to your custom MCP Server」的提示語（snippet）。→ ⚪ 官方 MCP 未見。
**6. 限制與反證**
- 官方明載的限制：Memory snapshot 一長串（見上）；GPU 只能 gVisor；Sandbox 以 3 倍非搶佔價；磁碟大小不可增加（VM runtime 固定 512GiB）。
- 第三方負面（皆為搜尋摘要，未讀原頁）：tech-insider「highest base vCPU and memory rates of the three platforms; gVisor weaker boundary than Firecracker; core engine closed-source」；druce.ai「gVisor does not implement every Linux syscall」「pricing multipliers stack」；HN 有人說 gVisor 有效能退化。這些是 snippet，只能當線索。
- 搜尋輪次：已跑 pricing surprise / limitations / HN。
**7. 適用情境** [推論]：需要 GPU 或大量並行、burst 型 CPU 的 agent 執行環境，且願意用 Python/JS/Go SDK 自己組 image；要桌面就得照官方 VNC 範例自己搭。

### 3. Vercel Sandbox
**1. 定位與隔離**
- 「Run untrusted or agent-generated code in isolated Linux microVMs.」「Each sandbox runs in a secure Firecracker microVM with its own filesystem and network.」專用 kernel（https://vercel.com/docs/sandbox 、/concepts，read 完整）。
**2. 規格 / OS / GUI**
- OS：Ubuntu 26.04（預設）、Arch 或自訂 OCI image（VCR）；預設 image 含 Node LTS、Python 3.14、coding agents、常用工具；有完整 root、可跑 Docker/VPN/FUSE（需 sudo）。
- 規格（https://vercel.com/docs/sandbox/pricing ，read 完整）：Hobby 最多 4 vCPU/8GB；Pro 8 vCPU/16GB；Enterprise 32 vCPU/64GB；每 vCPU 含 2GB；磁碟 64GB 暫時 NVMe；最多 15 個開放 port；可掛 4 個 Drive。
- GUI：官方 docs 首頁/概念頁/ecosystem 頁都沒有桌面/VNC/computer-use 的功能。「Features」清單無 GUI。vercel-labs 的 `remote-agent-browser` / `agent-browser` 在 Sandbox 內跑 headless Chromium 給 agent 用（GitHub README，read；vercel-labs 非核心產品文件，屬實驗/範例）：它給的是「accessibility snapshot / 命令式」瀏覽器，不是桌面。
**3. 價格（2026-11-09，sandbox/pricing，read）**
- Hobby：免費，5 小時 Active CPU/月、420 GB-hr 記憶體、5,000 次建立、20GB 傳輸、15GB 快照儲存；超過則暫停建立（不會被收費）。單次最長 45 分鐘、並行 10。
- Pro / Enterprise（iad1）：Active CPU $0.128/小時、Provisioned Memory $0.0212/GB-hr、建立 $0.60/百萬次、快照 $0.08/GB-月、Drive $0.05/GB-月；Pro 用量先抵 $20/月 credit；並行 10,000；單次最長 24 小時。
- 計費方式：Active CPU 只算「CPU 真的在用」的時間（等 I/O、等 LLM 不算）；記憶體以「配置量 × 時間」計，含閒置，最小 1 分鐘單位；「Stop a sandbox when work is done to end CPU and memory charges.」
- 官方範例（sandbox 首頁，read）：1 vCPU/2GB 在 iad1 跑一整天——「Idle（1% CPU）$1.05/天、約 $31.45/30 天；Busy 全天 $4.09/天、約 $122.69/30 天；Stopped $0」。計價條件：iad1 現行費率、閒置假設 1% CPU。
- 網路：Sandbox 對外送出與對外暴露 port 的流量計費；下載（npm 等）免費。
**4. 持久化**
- 預設持久：stop 時自動快照檔案系統，下一次 SDK 呼叫（runCommand 等）自動 resume；名稱在專案內唯一。session 最長：Hobby 45 分 / Pro 24 小時，「limit resets every time a sandbox stops and resumes」，所以 persistent sandbox 總壽命實質無上限。
- 快照：預設 30 天（從最後使用起算，可設永久）；可 keepLastSnapshots 1–10；無法從快照恢復的 sandbox 14 天不活動即被移除（persistence 頁，read）。
- 只保存檔案系統；程序、記憶體不保存（官方寫「filesystem」；「onResume 用來重啟背景服務」）。
- 恢復時間：官方稱 startup「in milliseconds」、「Resuming from a snapshot is even faster than starting a fresh sandbox」，無實測秒數；有部落格「Optimizing Vercel Sandbox snapshots」（只讀到 snippet，提到先前全是 cache miss、之後加本機 NVMe 快取）。
**5. 整合**
- JS SDK `@vercel/sandbox`、Python SDK、CLI；官方 ecosystem 頁（read）：CLI 一行 `npx sandbox create claude|codex|opencode|pi`；Cursor、Devin、Herdr、Hermes、OpenCode、Paseo；Harbor/AgentEnv eval；LangChain、Mastra、AI SDK、OpenAI/Anthropic SDK、TanStack AI。
- MCP：Vercel MCP 有 Sandboxes 工具集（create sandbox、run command、read/write file、snapshot、update network policy 等，https://vercel.com/docs/agent-resources/vercel-mcp/tools/sandboxes ，read）。
**6. 限制與反證**
- 官方：「Sandboxes are not designed to run continuously… not suitable for permanent hosting」；WebSocket 到 sandbox 公網 URL 可能被關閉；Hobby 超額即暫停；單次 session 上限。
- 第三方/社群：GitHub vercel/eve issue #4393（2026-10-06，read）：snapshot 過期後 resume 回 410 `snapshot_not_found`，「any session resumed after its sandbox snapshot expired loses sandbox access for good」（這是 eve 框架的 bug，不是 Vercel 本體，但顯示快照過期後行為）。Blaxel 部落格（競品，snippet only）稱 stop-restore 循環增加延遲、每次 teardown 都是潛在失敗點。
- 搜尋輪次：已跑 limitations / issues / complaints。vercel/sandbox 的 GitHub issues 頁只有 snippet，未讀。
**7. 適用情境** [推論]：已在 Vercel/Next.js 生態、要給使用者產出 app 預覽或執行 agent 產生的程式碼，且重視「等 LLM 時不被收 CPU 錢」。需要看畫面的任務不適合。

### 4. Cloudflare Sandbox / Containers
**1. 定位與隔離**
- 「A sandbox is an isolated place to run code」。兩種環境：Containers（跑你提供的 Linux image）與 Dynamic Workers（V8 isolate，只能 JS/Python/Wasm，不能起子程序）（https://developers.cloudflare.com/sandbox/ ，/concepts/，read 完整）。
- 「Each instance is a microVM with its own kernel and network, so no other workload shares it.」；architecture 頁：「Each container instance runs in a Firecracker microVM… Your image runs as a Linux container inside the VM.」（containers/concepts/architecture，read）。
- 重要差異：沙盒本身是 Worker + Durable Object 的程式碼架構（`@cloudflare/sandbox` SDK 1.x，2026-09-30 發布），必須先有 Cloudflare Workers 專案。
**2. 規格 / OS / GUI**
- 預設 instance types（containers/platform/limits，read）：lite 1/16 vCPU 256MiB 2GB；basic 1/4 vCPU 1GiB 4GB；standard-1 1/2 vCPU 4GiB 8GB；standard-2 1 vCPU 6GiB 12GB；standard-3 2 vCPU 8GiB 16GB；standard-4 4 vCPU 12GiB 20GB。自訂：最小 1 vCPU、最大 4 vCPU、12GiB、20GB，記憶體至少 3GiB/vCPU；「defaults and can be increased」（聯絡帳務團隊）。帳號上限：並行 1,500 vCPU / 6TiB 記憶體。
- OS：自備 `linux/amd64` image；官方預建 `cloudflare/debian-trixie`。
- GUI：官方 sandbox / containers 頁面完全沒有桌面或瀏覽器。「Containers 只能經 Worker 以 HTTP 存取，終端使用者不能做非 HTTP 的 TCP/UDP」（architecture 頁，明文）。網上「Container Sandbox MCP」是第三方目錄（mcp.directory，snippet）。→ 沒有內建 GUI。
**3. 價格（2026-11-09，containers/platform/pricing，read；Workers Paid $5/月）**
- 含 25 GiB-hr 記憶體、375 vCPU-分鐘、200 GB-hr 磁碟；超過：記憶體 $0.0000025/GiB-秒、CPU $0.000020/vCPU-秒、磁碟 $0.00000007/GB-秒。Free 方案：N/A（需付費方案）。
- 出口流量：北美/歐洲 $0.025/GB（含 1TB）；大洋洲/韓/台 $0.05（500GB）；其他 $0.04（500GB）。另計 Workers 與 Durable Objects、Logs 費用。
- [換算] CPU $0.072/vCPU-hr（只算實際使用）；記憶體 $0.009/GiB-hr（算配置量）；磁碟 $0.000252/GB-hr（算配置量）。
- 閒置：「Memory and disk usage are based on provisioned resources… CPU usage is based on active usage only」；lifetime 頁明寫「An idle instance is still billed… Containers bill its memory and disk, whether or not anything inside it does work. After the instance stops, it is not billed.」
**4. 持久化**
- 預設：「All disk is ephemeral by default.」instance 睡眠後用 image 重開。
- Snapshot（public beta，僅 `durable_object` scheduling policy）：只存可寫 root filesystem，不含記憶體、程序、掛載點；快照最大 20GB、保留 30 天（還原會重新計）；`/run`（記憶體）不存。
- 存活：實例沒有固定上限，由 DO 活動與 `setInactivityTimeout()`（最長 6 小時）決定；「Cloudflare does not guarantee that an instance runs for a set time」；容器內跑的程式不算活動，沒有請求進來就會在 timeout 後停止；`Container` class 預設 `sleepAfter` 10 分鐘；停止時先 SIGTERM，最多等 15 分鐘再 SIGKILL。
- 冷啟動：「often in the 1-3 second range」（architecture，read）。第三方 explainx 稱 SDK 1.0「6x faster agent starts」（read，但內文被抽取移除，只讀到 snippet，不採信）。
- 還原快照後的恢復時間：官方未給（⚪）。
**5. 整合**
- Workers/TypeScript SDK `@cloudflare/sandbox`；官方 coding-agents 頁（read）：Claude Code、Codex、OpenCode、Pi 的 runner 教學；Devin、Cursor Cloud Agents、Claude Managed Agents、OpenAI Agents API 可把沙盒放在你的 Cloudflare 帳號（vendor 迴圈在他們服務）。Agents SDK 有 sandbox tool。
- MCP：Cloudflare 官方 MCP（mcp.cloudflare.com/mcp）是管理 Cloudflare API 用（snippet），不是「把沙盒當 MCP 工具給 agent 用」的官方產品；後者本輪只見第三方（mcp.directory，snippet）。→ ⚪ 官方「sandbox MCP」未見。
**6. 限制與反證**
- 官方：實例不保證存活時間、timeout 不跨 DO 重啟（需在 constructor 重設）、snapshot 不含記憶體/程序、snapshot 綁定 image 版本、無法自訂 snapshot TTL、DO scheduling policy 仍是 public beta、outbound 單次請求 body 100MiB 上限。
- GitHub 實際 bug（read）：sandbox-sdk #1047（2026-11-04）：`DirectoryBackup.restore()` 在壓縮效果好的資料上 ENOSPC，備份建立成功但同機型還原失敗；#1043（2026-10-28）：S3Mount 在 production 首次讀取回傳錯誤大小（13/21 檔案）；cloudflare-docs PR #34455：0.x 的 Docker-in-Docker 指南在約 1/7 冷啟動壞掉。issues 頁當日顯示 3 個 open（只能作為「版本還很新、仍有 bug」的線索）。
- 第三方：HN 2025-10「all or nothing」網路出站控制（snippet）；Nicholas Griffin 部落格「Disk usage is ephemeral」（snippet）。
- 搜尋輪次：已跑 limitations / issues / complaints。
**7. 適用情境** [推論]：已經在 Cloudflare Workers 生態、想把「每個 session/任務一個 Linux 沙盒」綁在 Durable Object 上、且能接受快照要自己管的團隊。

## 三、讀取完整度盤點表
| 來源 | 狀態 |
|---|---|
| fly.io/sprites/（sprites.dev 首頁） | read（用 extract=full；第一次抽取只剩 footer，已補抓） |
| docs.fly.io/sprites（Overview） | read |
| docs.fly.io/sprites/working-with-sprites.md | read |
| docs.fly.io/sprites/concepts/lifecycle.md | read |
| fly.io/pricing.md | read |
| fly.io/llms.txt | read |
| fly.io/blog/sprites-block-device/、sprites-mcp/ | read |
| fly.io/sprites/release-notes/ | partial（內容被抽取，只讀到 2026-03 前後幾條） |
| community.fly.io 穩定度討論 | read（內容約前 5 則） |
| HN 49372904 | read（單一留言） |
| runtimewire 報導 | read（只有首段，付費牆/登入） |
| sprites.dev/api、network policy、keeping-sprites-running、sprite-maintenance | 未讀（⚪ 非必要） |
| modal.com/pricing | read |
| modal.com/docs/guide/sandboxes | read |
| sandbox-snapshots / sandbox-resources / resources / examples/computer_use_vnc | read |
| modal docs 首頁、sandbox-networking、sandbox-files | 未讀 |
| modal-labs/claude-managed-agents-modal-sandbox | partial（README 被抽取） |
| vercel.com/docs/sandbox、/pricing、/concepts、/concepts/persistent-sandboxes、/ecosystem、vercel MCP sandboxes 工具頁 | read |
| vercel github eve #4393、vercel-labs/remote-agent-browser | read |
| vercel snapshots / images / duration-persistence KB / sdk | 未讀 |
| developers.cloudflare.com/sandbox/、/concepts/、/concepts/lifetime/、/coding-agents/ | read |
| containers/、/platform/pricing/、/platform/limits/、/concepts/architecture/、/guides/snapshots/ | read |
| cloudflare/sandbox-sdk issues 頁與 #1043 #1047、cloudflare-docs PR #34455 | partial（issues 頁只列出 3 筆；#1043 #1047 read；PR 頁只讀到合併與預覽資訊） |
| sandbox/concepts/security、sandbox/network | 未讀 |
| 各家第三方比較文（tech-insider、morphllm、beri.net、Blaxel、explainx…） | snippet（explainx 內文抽取失敗，視為 snippet） |
| fly.io/learn/sprites-vs-e2b-vs-modal-vs-daytona | snippet，且為 Fly 自家行銷頁，不採用 |

## 四、反證與風險（整併）
1. 「沒有 GUI」的證據強度：四家都是「官方頁面未列出」型證據；唯一確定有桌面做法的是 Modal 官方範例。不要寫成「Modal 不支援 GUI」。
2. Sprites 穩定度證據偏舊（2026-02）；官方後續自承儲存層問題並改版，目前可靠度未見獨立第三方評測。
3. Sprites 文件內部矛盾：checkpoint 是否存程序/記憶體（見 2.1.4），以及 $30 vs $1 試用額度。
4. Cloudflare 的 `@cloudflare/sandbox` 1.x 與 DO snapshot 仍是新/beta，GitHub 近期（10–11 月）仍有資料正確性類 bug。
5. Modal 的「閒置不收費」不等於 Sandbox 存活期間不收費：請求值在整個存活期都收；加上 3 倍非搶佔價。
6. Vercel：Hobby 的 45 分鐘上限與 10 並行，超額即停；快照過期後 resume 失敗是已知風險面。
7. 價格都是 2026-11-09 當日頁面；Fly 與 Cloudflare、Modal 有區域係數或方案條件，跨家比較要統一假設（本檔未做統一）。

## 五、⚪／✉️ 清單
- ⚪ Sprites 官方明文「無 GUI / 無瀏覽器」：試過 fly.io/sprites/、docs.fly.io/sprites、working-with-sprites.md、lifecycle.md、pricing.md、firecrawl 外的 Groundlane 搜尋「Sprites Chrome headless browser Playwright desktop GUI VNC computer use」→ 搜尋結果皆無關（Playwright/Docker VNC 通用文）。結案：官方功能清單未列；無明文否認。
- ⚪ Sprites 具體隔離技術名稱（是否為 Firecracker）：以上各頁僅寫 hardware-isolated microVM；未讀 fly.io/blog/design-and-implementation（未抓）。
- ⚪ Modal 明確最大 vCPU/記憶體數字：guide/resources、sandbox-resources 只寫「a maximum is enforced」；vendor README 有「>16 CPUs、>64GB」宣稱；未找到公開上限表。
- ⚪ Modal 官方 sandbox MCP：搜尋 Groundlane（brave+you）「Modal sandbox MCP server…」只得到社群套件 mcp4modal-sandbox；未見官方。
- ⚪ Modal / Vercel / Cloudflare「從休眠/快照恢復的具體秒數」：Modal sandbox-snapshots.md 無秒數；Vercel concepts 只寫 milliseconds 與「resume 更快」，未讀 blog 內文；Cloudflare 只給冷啟動 1–3 秒，快照還原時間未載。
- ⚪ Cloudflare 官方 sandbox MCP：只有 Cloudflare API MCP 與第三方目錄；mcp.cloudflare.com 頁未讀。
- ⚪ Vercel 核心文件對 GUI 的明文否認：docs 首頁/concepts/ecosystem 無；只有 vercel-labs 的 headless Chrome 範例。
- ✉️ Sprites 兩處免費額度（$30 vs $1）與 checkpoint 是否存記憶體的矛盾：若文章要寫死，需寄信/到 fly.io 支援確認。
