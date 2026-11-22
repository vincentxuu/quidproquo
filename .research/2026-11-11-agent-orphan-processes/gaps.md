# 缺口補查（gaps）

研究日：2026-11-11。讀取等級：✅ 原文全讀（或本機 man／原始碼）｜🟡 讀了相關段落｜🔎 只看到搜尋摘要｜🔴 讀取失敗。[推論] 為本筆記自己的推斷，非來源原話。

## 工具嘗試紀錄（全部缺口共用）

| 工具 | 結果 |
|---|---|
| Groundlane MCP | 🔴 只有 `authenticate`，未授權，跳過 |
| Reddit JSON（`www.reddit.com/r/<sr>/search.json`、`api.reddit.com`，curl＋瀏覽器 UA） | 🔴 全部 HTTP 403；`old.reddit.com` 回 302 |
| Tavily search／extract（`include_domains: reddit.com`） | ✅ 可讀 Reddit 討論串全文（含留言） |
| Exa search／fetch | ✅ 用於部落格、論壇與 Reddit 鏡像 |
| HN Algolia API（`hn.algolia.com/api/v1/search`、`/items/<id>`） | ✅ |
| jina read_url | 🔴 HTTP 402（帳戶額度不足） |
| Firecrawl | 未用（前一輪已知額度 0，重置 2026-11-14） |
| `gh` CLI（issue view／contents API） | ✅；search API 每分鐘 30 次，中途撞到一次 rate limit，等待後重試成功 |
| 本機 `man`／`sysctl` | ✅ |

---

## 缺口 1：Reddit／HN 社群討論（孤兒程序、RAM 耗盡、平行 agent 每個要多少 RAM）

### ✅ r/ClaudeAI「The new Claude Code CLI is eating 35GB of RAM and killed my Swap」（約 2026-02，全串含留言讀完，經 Tavily extract）
<https://www.reddit.com/r/ClaudeAI/comments/1r5pbnj/the_new_claude_code_cli_is_eating_35gb_of_ram_and>
- 發文者：原生安裝版 2.1.37，「consuming **35.09 GB of physical memory**」，24 GB 機器「forced the system to use over **14GB of Swap**」。
- 最高讚留言（Neoaxizz）：「Could be Orphaned child processes. Claude Code spawns bash subprocesses for every tool call. If those don't terminate cleanly (hanging builds, background processes, watch mode commands), they pile up」。
- Deep_Ad1959：「this is 5x worse when you run multiple agents in parallel. I had to write a cleanup script that kills orphaned node processes every few hours because 5 claude instances each spawning their own subprocesses」。
- toby_hede：「Sometimes have a dozen instances of `node` or `rust-analyzer` running. I need to run kill regularly.」
- easternguy 貼了給 MCP server 加 parent-PID watchdog 的 patch：「When the parent (Claude CLI / npm exec) exits, macOS reparents us to launchd (PID 1). Poll every 5s and shut down if that happens.」
- 其他留言把原因歸到 typescript-lsp 外掛、新版回歸（降版解決）、對話 context 未釋放；串中沒有定論，指向官方 issue #18859。
- [推論] 社群對「記憶體爆掉」的歸因混雜三種來源：CLI 本身記憶體洩漏、孤兒子程序、MCP/LSP 子程序。單看 Activity Monitor 的單一數字分不出來。

### 🔎 r/ClaudeAI、r/ClaudeCode、r/claude 其他相關串（只看到搜尋摘要／標題）
- r/ClaudeCode「Is ClaudeCode (terminal) eating all the computer resources?」（約 2026-09，27 則留言）：「All RAM gone or severe slowdowns」。<https://www.reddit.com/r/ClaudeCode/comments/1wkfv3j/>（Tavily extract 回傳空內容，🔴）
- r/ClaudeAI「Looks claude code desktop is leaking the memory」：摘要「kill orphaned Node/Claude child processes before swap memory hits the disk limits」。<https://www.reddit.com/r/ClaudeAI/comments/1vi6imx/>
- r/claude「Claude Code found a 9 GB RAM leak on my PC」（1.8K 讚、341 留言，約 2026-11-02）：摘要指 9 GB 未歸屬記憶體，未讀全文。<https://www.reddit.com/r/claude/comments/1xjj7ge/>
- r/ClaudeCode「Claude Code eats 80+ MB/min of RAM sitting idle」（65 讚）：只見標題。

### 🟡 「每台機器能跑幾個 agent」的社群數字（Reddit 鏡像，非 reddit.com 本站）
來源：reddit.sentinel-team.org 對某 Reddit 貼文的快照（2026-08-15），原帖網址 `reddit.com/comments/1vjbe31` 經 Tavily extract 回空（🔴）。<https://reddit.sentinel-team.org/posts/1vjbe31/snapshots/2026-08-15T02%3A07%3A43.063054Z>
- 發文者：「At 2 concurrent agents my host would clash hard (swap pressure, freezes)」。
- 回覆分歧很大：「I usually hit the wall around 4 to 6 agents before RAM and swap become the real problem」；「Three before it turns unusable here, and it was never CPU. RAM plus whatever the editor's file watcher does」；「With 64gb maybe about 10 active」；「i run 4 in containers on a macbook and it's fine til one of them decides to eat 16gb by itself」；也有人說「Agents themselves use almost no resources … I'm very routinely running 20 or 30 simultaneous agents」。
- [推論] 社群經驗上限散佈在 2～10 個之間，差異主要來自 IDE／MCP／dev server 等附帶程序，而非 agent 本體。

### ✅ 有量測的部落格（全文讀）
- John Young「Claude Code Memory Usage: How Many Sessions Fit on One Machine」（2026-10-19，WSL2、Claude Code 2.1.303）<https://jyoung.dev/blog/claude-code-parallel-sessions-memory/>
  - 「three sessions ran 32 processes, only three were Claude, and MCP servers outweighed Claude in two of them」。
  - 三個 session 的 `claude` RSS 326～515 MB、MCP 子程序 RSS 301～710 MB；整棵樹 PSS 約 550～660 MB／session，20 分鐘內持平。
  - 「With stdio servers, N sessions times M servers is the number that fills RAM」；引官方文件：stdio servers「long-lived and outlive the session that spawned them」。
  - 「macOS readers get none of this … "macOS has no cgroups to contain per-process memory"」（引 issue #45880）。
  - 作者自承直接量測只有約 20 分鐘，不能代表長時間成長。
- Amit Kumar Agrawal「How Many Claude Code Sessions Can — and Should — You Run Simultaneously?」（2026-03-13）<https://artificialcuriositylabs.ai/posts/how-many-claude-code-sessions/>
  - 「roughly 150–200MB at idle, growing to 300–500MB per session」（作者估計，非量測表）。
  - 16 GB Mac 三個 session 加 Zellij 開四個 shell，「macOS JETSAM cascaded into a forced reboot」；結論「2 sessions on a 16GB machine with a full software stack — 3 is the cliff」。
  - [推論] 作者對 jetsam「can force a system reboot」的描述沒有引 Apple 文件，與下方 XNU 原始碼（macOS 只有極有限的 jetsam）對不太上，應視為個人觀察。
- 🟡 MacRumors 論壇（2026-10-25）：64 GB M5 Pro 跑 8 個平行 Claude Code agent＋6 個 headless Chromium，「92% free / 0 swap / 37.4GB」，「Claude Code's own logger put the whole agent workload at ~11GB over baseline」。<https://forums.macrumors.com/threads/8-claude-code-agents-a-27b-local-model-on-64gb-still-44-free.2492699/>（只讀到 Exa 擷取的首帖）

### 🟡 Cursor 官方論壇 staff 回覆（Exa 擷取段落）
- 「Cursor reaches ~98GB memory with 6 parallel background agents」（16 GB Mac）。staff：「running several long background agents at once in the Agents Window makes memory climb without a firm ceiling … Activity Monitor rolls all child processes into the single "Cursor" entry」；建議「Cap concurrent background agents to 2-3」。<https://forum.cursor.com/t/title-cursor-reaches-98gb-memory-with-6-parallel-background-agents-macos-memory-pressure-system-freeze-16gb-mac/168061>
- 「Keeps crashing while using multiple agents at same time」（2026-07-09）staff：「each Cursor window runs as one process with a shared memory budget, and every agent, worktree, and loop in that window shares it」。<https://forum.cursor.com/t/keeps-crashing-while-using-multiple-agents-at-same-time/165300>

### 🔎 GitHub issue（Exa 摘要，未全讀）
- anthropics/claude-code#64366：Claude Desktop 11 個 MCP 設定卻生出「~300 MCP server processes」、swap 23～42 GB 持續 5 小時、四次 kernel panic；「MCP servers from closed sessions are not reaped」。<https://github.com/anthropics/claude-code/issues/64366>
- stepcodex 轉載的 claude-code issue：約 10 個平行 chat，「~30 GB (RAM + compressed + swap)」觸發 macOS「Your system has run out of application memory」。<https://www.stepcodex.com/en/issue/bug-excessive-ram-usage-with-multiple>（第三方轉載站，權威低）

### ✅ Hacker News（Algolia API，items 全文）
- 「Show HN: Auto-cleanup for Claude Code's orphan process memory leak」（2026-03-01，3 分、0 留言）與「Show HN: Cc-reaper – Three-layer cleanup for orphan Claude Code processes」（2026-03-02，2 分、0 留言）。兩者 repo 現在都指向 theQuert/cc-reaper。<https://news.ycombinator.com/item?id=47206177>、<https://news.ycombinator.com/item?id=47213511>
  - 🟡 cc-reaper README（讀前約 150 行／共 79 KB）：「When sessions end (especially abnormally), these processes become orphans (PPID=1) and keep consuming RAM and CPU — often 200-400 MB each … this can accumulate to 7+ GB」。表列 subagent「180-300 MB each」、MCP server「40-110 MB each」、agent browser／Chrome-for-Testing「100-600 MB each」。做法：Stop hook 預設只殺 PPID=1 孤兒，crash 時由 LaunchAgent 每 30 秒掃、60 秒寬限後殺；「Claude Code sessions are process group leaders (PGID = session PID)」所以 `kill -- -$PGID` 可整組清。<https://github.com/theQuert/cc-reaper>（19★，2026-11-11 仍有更新）
- HN 留言（2026-08-05，item 49186806）：「I regularly have 10+ instances of my harness running or idling on my laptop. My laptop is often at near-100% CPU and memory usage」。回覆者 r_lee：「every now and then though it'll start just growing in memory usage and needs to be restarted」。<https://news.ycombinator.com/item?id=49186806>
- HN 留言（2026-09-08，item 49612773）：跑「~20-agent dev harness」，把 CI 搬到單台 8 GB 機器，規則「provision 3 runners, but cap concurrency at 2」，並為 OOM 加 swap、`vm.swappiness=10`。<https://news.ycombinator.com/item?id=49612773>（下一則回覆指其為 AI 代寫，權威低）
- 搜尋「claude code zombie processes」無結果。

### ⚪ 仍未補
- r/ChatGPTCoding、r/cursor：Tavily `include_domains: reddit.com` 搜「cursor agents leave dev server processes running memory」只回比較文與工具推薦，沒有孤兒程序／RAM 討論；Reddit JSON API 403。結論：這兩個版沒找到相關討論串（不代表不存在）。

---

## 缺口 2：Cline／Roo Code 的孤兒終端機／MCP 程序

全部 ✅（`gh issue view` 讀本文＋全部留言）。

### Cline
- cline/cline#14622（OPEN，2026-09-28，CLI 3.0.65 beta）「CLI hub mode: MCP server processes are never stopped after /clear or quitting」：「Each new session starts its own set of MCP servers, and the old ones stay alive under the `--cline-hub-daemon` process until the hub daemon itself exits」；實例「about a day and a half of normal use left 10 Serena instances plus their language servers running, while only 2 sessions were actually in use」；原因追到「Interactive turns end in `completeInteractiveTurn`, which never shuts the session down」「I found no idle-session reaper in the hub」。<https://github.com/cline/cline/issues/14622>
- cline/cline#10857（OPEN，stale，2026-05-18，CLI 3.0.7）「leaks running processes after handling a session task」；2026-07-22 回報「partially resolved with CLI 3.0.46. There is still a leaked running process (`… cline.exe … --port 25463 --pathname /hub`) but it does not accumulate anymore」。<https://github.com/cline/cline/issues/10857>
- cline/cline#12001（OPEN，2026-06-30，VS Code 擴充 v4.0.4，Windows 8 GB）：「Cline was getting terminal session errors and not closing them. The sessions persisted and kept growing until they clogged Win OS」；重開機才解。<https://github.com/cline/cline/issues/12001>
- 搜尋另見 #15032「orphaned hub daemon persists」、#14700「helper daemon leak … OOM crash」、#14091「Massive memory leak (5GB+ RAM, 11GB+ swap)」（只看標題 🔎）。

### Roo Code
- RooCodeInc/Roo-Code#11726（OPEN，2026-02-24）「MCP stdio transport leaks child process when client.connect() fails during handshake」：`transport.start()` 先 spawn，握手失敗的 catch「never calls `transport.close()`」，「Each retry spawns a new orphan」。<https://github.com/RooCodeInc/Roo-Code/issues/11726>
- Roo-Code#11776（OPEN，2026-02-27）「Actively clean-up MCP server processes before quitting」：有些 stdio MCP server「don't automatically quit when the stdio is disconnected」，要求「terminate the process _tree_ … because some MCP servers spawn a whole process tree」。官方 bot（roomote）分析：「The SDK's `close()` method sends `SIGTERM` to the immediate child process only -- it does **not** kill the entire process tree」（bot 分析，未經人工確認）。<https://github.com/RooCodeInc/Roo-Code/issues/11776>
- Roo-Code#12153（OPEN，2026-04-19，3.52.1）「Terminal Management」：「leaves behind a large number of useless terminals, like zombie processes」；bot 分析 `releaseTerminalsForTask()` 只清 `taskId`，draft PR #12156 加 `maxTerminalPoolSize`（預設 5）。<https://github.com/RooCodeInc/Roo-Code/issues/12153>
- Roo-Code#5397（CLOSED，2025-07-04）：debug session 結束後 Node 程序「each consuming ~1GB memory」「persist even after VSCode is closed」；PR #5398 加 ProcessRegistry。<https://github.com/RooCodeInc/Roo-Code/issues/5397>

[推論] Cline／Roo 與 Claude Code 是同一類問題：stdio MCP 以「每 session 一份」啟動，關閉時只送訊號給直接子程序，不清整棵樹；長駐 daemon（Cline hub）讓孤兒不會因父程序結束而浮現，而是在 daemon 底下累積。

---

## 缺口 3：macOS memory pressure／jetsam／dynamic swap 的 Apple 一手來源

### ✅ XNU 原始碼（apple-oss-distributions/xnu，main 分支，2026-11-11 抓取）
- `bsd/kern/kern_memorystatus.c` 約 525–541 行（`#if XNU_TARGET_OS_OSX` 區塊註解）：「we use the aging bands to protect processes from jetsam. But on macOS, we have a very limited jetsam that is only invoked under extreme conditions where we have no more swap / compressor space OR are under critical pressure.」
- 同檔約 1146–1153 行（`!CONFIG_JETSAM`）：「On compressor/swap exhaustion, kill the largest process regardless of its chosen process policy.」但正式版 `bool kill_on_no_paging_space = false;`（只在 DEVELOPMENT／DEBUG 可用 boot-arg 開）。
- `bsd/kern/kern_memorystatus_policy.c` 約 425–480 行（`!CONFIG_JETSAM` 的 `memorystatus_pick_action`）：「Without CONFIG_JETSAM, we only kill if the system is unhealthy. There is no aggressive jetsam and no early highwatermark killing.」compressor 或 swap「low on space」時先「Kill all idle processes before invoking the no paging space action」，之後才走節流（預設 5 秒）的 `MEMORYSTATUS_NO_PAGING_SPACE`；critical pressure 時先殺 long-idle／idle 程序，再清快取。
- <https://github.com/apple-oss-distributions/xnu/blob/main/bsd/kern/kern_memorystatus.c>、<https://github.com/apple-oss-distributions/xnu/blob/main/bsd/kern/kern_memorystatus_policy.c>
- [推論] 這修正了 sq4-5.md 的推論：macOS 不是「完全不殺」，而是只在 swap／compressor 快耗盡或 critical pressure 時才動手，且優先殺 jetsam「idle band」的程序（launchd 管理、宣告可被回收的 daemon 等）。一般從終端機啟動的 node／python 孤兒是否算在 idle band，原始碼沒有直接回答，未查證。實務上使用者看到的是 swap 一路長大、系統變慢，最後跳「out of application memory」對話框，而不是孤兒程序被自動清掉。
- [推論] `NO_PAGING_SPACE` 動作的使用者可見結果，推測就是「Your system has run out of application memory」的強制結束對話框；Apple 支援文件沒找到這句的說明頁（下方 ⚪）。

### ✅ Apple Developer：Identifying high-memory use with jetsam event reports（經 `developer.apple.com/tutorials/data/...json` 取全文）
<https://developer.apple.com/documentation/xcode/identifying-high-memory-use-with-jetsam-event-reports>
- 開頭就界定平台：「iOS, iPadOS, tvOS, visionOS, and watchOS have a virtual memory system that relies on all apps releasing memory when the operating system encounters memory pressure … the system frees memory by terminating applications … This is a jetsam event」。**macOS 不在列表內**，與 XNU 註解一致。
- reason 欄位定義：`per-process-limit`、`vm-pageshortage`、`vnode-limit`、`highwater`（「A system daemon exceeded its highest-expected memory footprint」）、`fc-thrashing`。

### ✅ Apple Support：Activity Monitor 使用手冊
- 「View memory usage」：「Memory pressure is determined by the amount of free memory, swap rate, wired memory, and file cached memory.」「When your computer approaches its maximum memory capacity, inactive apps in memory are compressed」；Swap Used 是「space being used on your startup disk to swap unused files to and from RAM」。<https://support.apple.com/guide/activity-monitor/view-memory-usage-actmntr1004/mac>
- 「Check if your Mac needs more RAM」：「Green … using all of its RAM efficiently」「Yellow … might eventually need more RAM」「Red … needs more RAM」。<https://support.apple.com/guide/activity-monitor/check-if-your-mac-needs-more-ram-actmntr34865/mac>

### ✅ 本機 man page（macOS 26.5.2）
- `memory_pressure(1)`：「Tool to apply real or simulate memory pressure on the system」，`-l warn|critical` 施加壓力「till low memory notifications corresponding to <level> are generated」，`-S` 模擬。可用來在本機測試「critical pressure 時 Claude Code 會不會回收背景任務」（sq3 提到的 `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP` 行為）。
- `dynamic_pager(8)`：「swap configuration daemon」，swapfile 在 `/private/var/vm/swapfile*`，設定檔 `/System/Library/LaunchDaemons/com.apple.dynamic_pager.plist`。man page 沒寫動態增長策略與上限。
- `vm_stat(1)`：列出 compressor、swap 相關計數（Pages used by VM compressor、Pageins／Pageouts、Swapins／Swapouts）。
- 本機觀察（2026-11-11 執行當下）：`sysctl vm.swapusage` → `total = 18432.00M used = 17360.25M free = 1071.75M`；`kern.memorystatus_level: 30`。[推論] swap 已用 17 GB／可用約 1 GB，接近 XNU 所說「low on space」區間，與本研究要處理的症狀一致。

### ⚪ 仍未補
- 「Your system has run out of application memory」的 Apple 官方說明頁：Tavily `include_domains: support.apple.com` 只回 Force Quit（<https://support.apple.com/en-us/102586>）、「If your Mac runs slowly」等通用頁，沒有解釋此對話框或 swap 上限。
- macOS swap 檔動態成長的上限規則：`man dynamic_pager` 沒寫；未找到 Apple 文件。

---

## 缺口 4：process-compose 自己被 SIGKILL 時、mprocs／pm2／overmind 的清理行為

### ✅ process-compose（F1bonacc1/process-compose，2934★，2026-11-09 仍更新）
- 原始碼 `src/command/stopper_unix.go`（全讀，44 行）：每個子程序以 `c.cmd.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}` 啟動，停止時 `syscall.Kill(-pgid, sig)` 送給該子程序自己的 process group。整個 `src/command` 沒有 `Pdeathsig`／`Setsid`。<https://github.com/F1bonacc1/process-compose/blob/main/src/command/stopper_unix.go>
- [推論] 因此 process-compose 本身被 SIGKILL（或 crash）時，沒有任何機制通知子程序：子程序各在自己的 process group，也不會收到終端機對前景 process group 的 SIGHUP，會變成 PPID=1 的孤兒繼續跑。正常的 SIGTERM／Ctrl+C／`process-compose down` 才會走整組 kill。未實測。
- #49（CLOSED，2023-03-20）「Use process group-based killing to make sure frequently starting processes don't remain running after shutdown」：上述 group kill 的由來。<https://github.com/F1bonacc1/process-compose/issues/49>
- #354（CLOSED，2025-06-17）「how is shutdown handled?」：使用者「process-compose is regularly unable to shutdown」，自寫 `killall.sh`；維護者建議把 `shutdown.signal` 設成 `9`。另一位用 `(trap 'kill -9 0' SIGINT EXIT; dotnet watch)` 繞過。<https://github.com/F1bonacc1/process-compose/issues/354>

### ✅ overmind（DarthSim/overmind）
- #50「Better way to deal with unexpected termination」，維護者 2025-02-04 回覆：「Overmind runs all the processes in tmux, so it has only a tmux client as its child process. All other processes are children of the tmux server. So when you kill Overmind, you basically only kill the tmux client … the server and the processes in it will still be alive. So our only hope is that the terminal emulator will send Overmind a proper signal」。macOS 使用者回報關分頁後「sometimes the sub-processes still alive as well」，`.overmind.sock` 殘留。<https://github.com/DarthSim/overmind/issues/50>

### ✅ mprocs（已改名 dekit，pvolok/dekit，2801★）
- README（全讀）：「dekit is the next version of mprocs」；新行為「The tasks keep running after you close the terminal」（`dekit up`／`dekit down`，runner 常駐）。<https://github.com/pvolok/dekit>
- #90（OPEN，2023-05-27）「Some Programs won't stop using 'x'」：Windows 上「only wrapping cmd.exe is being terminated and the inner process keeps running」（維護者確認）；2026-01-02 Linux 使用者：「launching a command using just. The actually command I run gets orphaned unless I use `exec`」；2026-05-14 仍有人回報「prevents me being able to restart an "npm run dev" process」。<https://github.com/pvolok/dekit/issues/90>
- [推論] mprocs 停止時只送訊號給它直接啟動的那個程序；用 shell／`just`／`npm run` 包一層時，真正的 server 會漏掉。用 `exec` 讓 wrapper 被取代可以避開。

### ✅ pm2（Unitech/pm2）
- #6084（CLOSED，2026-02-22）「pm2 stop/delete does not kill child worker processes (Next.js next-server orphaned)」：「PM2 only kills the parent Node.js process — the child next-server worker survives and continues holding the port」→ `EADDRINUSE`。維護者 2026-05-02：「Fixed in **v7.0.0**」。<https://github.com/Unitech/pm2/issues/6084>
- [推論] pm2 是常駐 daemon，pm2 本身被 SIGKILL 時的行為沒查到文件。

### 小結 [推論]
四套工具都只在「自己正常收到停止指令」時清理；被 SIGKILL 或終端機直接關掉時，沒有一套能保證子程序跟著死。macOS 沒有 `PR_SET_PDEATHSIG`，所以要可靠清理，只能靠外部 reaper（例如以 PGID／PPID=1 掃描）或讓子程序自己偵測父程序消失（esbuild 的做法，見缺口 5）。

---

## 缺口 5：uvicorn --reload、celery worker、esbuild 在父程序死掉時的子程序

### 🟡 uvicorn（encode/uvicorn 已轉到 Kludex/uvicorn）
- 原始碼 `uvicorn/supervisors/basereload.py`（讀了 15–115 行）：reloader 只攔 `HANDLED_SIGNALS = (signal.SIGINT, signal.SIGTERM)`；`startup()` 用 `get_subprocess()` 啟動 server 子程序，`shutdown()` 才 `self.process.terminate()`＋`join()`。`uvicorn/_subprocess.py`：`spawn = multiprocessing.get_context("spawn")`。<https://github.com/Kludex/uvicorn/blob/main/uvicorn/supervisors/basereload.py>
- [推論] reloader 被 SIGKILL 時 `shutdown()` 不會執行，spawn 出來的 server 子程序（持有 port）會留成孤兒。沒找到直接描述這個情境的 issue。
- Kludex/uvicorn#2289（CLOSED，2024-03-26）「Child Processes Not Terminating with Uvicorn 0.29.0」：app 自己 spawn 的子程序「become orphaned and are reassigned to PID 1」；維護者稱 0.30.0 修正，但 2024-08、2024-12 仍有人回報 0.30.6 還在。<https://github.com/Kludex/uvicorn/issues/2289>
- Kludex/uvicorn#364（CLOSED，2019）「docker-compose graceful shutdown of uvicorn --reload」：reloader 在 `wait4` 卡住，最後被 SIGKILL。<https://github.com/Kludex/uvicorn/issues/364>
- `gh search` 以「reload orphan／zombie／port already in use／child not killed」查，沒有 reloader 被 SIGKILL 後殘留的專門 issue（⚪ 這一點）。

### ✅ celery
- 官方文件 `docs/userguide/workers.rst`〈Stopping the worker〉（讀 86–122 行）：「Also as processes can't override the KILL signal, the worker will not be able to reap its children; make sure to do so manually. This command usually does the trick: `pkill -9 -f 'celery worker'`」；「versionchanged:: 5.2 On Linux systems, Celery now supports sending KILL signal to all child processes after worker termination. This is done via `PR_SET_PDEATHSIG` option of `prctl(2)`.」<https://docs.celeryq.dev/en/stable/userguide/workers.html#stopping-the-worker>（原始檔 <https://github.com/celery/celery/blob/main/docs/userguide/workers.rst>）
- [推論] `PR_SET_PDEATHSIG` 是 Linux 專屬；macOS 上 celery worker 被 SIGKILL，prefork 子程序會留下，官方文件就是叫你手動 `pkill`。
- celery/celery#2353（CLOSED，2014）：task 啟動的 phantomjs 在 worker 被殺後留下；維護者 ask：「This is actually simply how unix work! If you have already forked once, then the child processes will not be terminated with the parent process」。<https://github.com/celery/celery/issues/2353>

### ✅ esbuild
- 原始碼 `cmd/esbuild/service.go`（讀 95–175 行）：service 讀 stdin，「if n == 0 || err == io.EOF { break // End of stdin }」後結束；並「Periodically ping the host even when we're idle. This will catch cases where the host has disappeared … we will now try to write to stdout and fail, and then know that we should exit」，寫 stdout 失敗即 `os.Exit(1)`。<https://github.com/evanw/esbuild/blob/main/cmd/esbuild/service.go>
- evanw/esbuild#3558（CLOSED，2023-12-19）evanw：「Once activated, the esbuild process stays around until node exits (for performance reasons), but should not keep node open」；有人回報 watch 模式「used 54G of memory」，作者無法重現。<https://github.com/evanw/esbuild/issues/3558>
- evanw/esbuild#985（CLOSED，2021-03）：lingering 只發生在 node 還活著時，「by design」。<https://github.com/evanw/esbuild/issues/985>
- [推論] esbuild service 是「父程序消失就自己退出」的正面範例，孤兒風險低；真正會殘留的是持有它的 node 程序（vite／dev server）本身。

---

## 總結：缺口狀態

| # | 缺口 | 狀態 |
|---|---|---|
| 1 | Reddit／HN 社群討論與每 agent RAM | ✅ r/ClaudeAI 35GB 串、HN items、兩篇量測部落格；🟡 Reddit 鏡像的平行數量討論；⚪ r/ChatGPTCoding、r/cursor 沒找到相關串 |
| 2 | Cline／Roo 孤兒終端機／MCP | ✅ 7 個 issue 全讀 |
| 3 | macOS memory pressure／jetsam 一手來源 | ✅ XNU 原始碼、Apple jetsam 文件、Activity Monitor 手冊、本機 man；⚪「out of application memory」說明頁與 swap 上限規則 |
| 4 | process-compose 被 SIGKILL、mprocs／pm2／overmind | ✅ process-compose 原始碼＋issue、overmind 維護者回覆、mprocs README＋issue、pm2 issue；SIGKILL 結論為讀碼推論，未實測 |
| 5 | uvicorn／celery／esbuild | ✅ celery 官方文件、esbuild 原始碼；🟡 uvicorn reloader 讀碼推論，無專門 issue |
