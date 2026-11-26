# SQ3：AI coding agent 工具官方提供的程序管理／清理機制

查詢日：2026-11-11。Claude Code 文件為 code.claude.com 現行版（changelog 最新 2.1.322）；Codex 最新正式版 rust-v0.167.1；MCP spec 2025-06-18 與 2025-11-25。

標記：✅ 原文全讀並引用／🟡 部分段落讀過（grep 定位後讀該節）／🔎 只看到標題或摘要／🔴 讀取失敗。

工具降級紀錄：Groundlane MCP 未授權（只有 authenticate），沒有用；Claude Code、MCP、Codex、Cursor 官方頁都用 curl 抓 `.md` 版（各站都有提供 .md），GitHub changelog、release、issue 用 `gh`；Cursor 的探索搜尋用 Exa。`cursor.com/docs/agent/hooks.md` 是 404，改從 `cursor.com/llms.txt` 找到正確路徑 `/docs/hooks.md`。

---

## A. Claude Code

### A1. SessionEnd hook（重點：哪些情況會觸發、timeout 多少）

來源：https://code.claude.com/docs/en/hooks（🟡，讀了 SessionEnd、Common input fields、timeout 欄位三節）

- 原文：「Runs when a Claude Code session ends. Useful for cleanup tasks, logging session statistics, or saving session state. Supports matchers to filter by exit reason.」
- `reason` 的值：`clear`（/clear）、`resume`（interactive /resume）、`logout`、`prompt_input_exit`（「User exited while prompt input was visible」）、`other`（「Other exit reasons」）。`bypass_permissions_disabled`「Removed in v2.1.234」。
- 輸入欄位：`session_id`、`transcript_path`、`cwd`、`hook_event_name`、`reason`。共用欄位另有 `scratchpad_dir`（v2.1.257+）、`permission_mode`（不一定每個事件都有）、`agent_id`／`agent_type`（在 subagent 內觸發時）。
- 不能擋下結束：「SessionEnd hooks have no decision control. They can't block session termination but can perform cleanup tasks. Claude Code discards their JSON output fields」。
- **Timeout**：「SessionEnd hooks have a default timeout of 1.5 seconds. It applies when you exit, run `/clear`, or switch sessions with interactive `/resume`.」要延長有兩種做法：個別 hook 的 `timeout`（「The overall budget rises automatically to match the highest per-hook `timeout` in your settings files, up to 60 seconds … Timeouts set on plugin-provided hooks don't raise the budget.」），或是 `CLAUDE_CODE_SESSIONEND_HOOKS_TIMEOUT_MS`（「Before v2.1.268 … a hook without its own `timeout` was still canceled after 1.5 seconds.」）。
- 其他事件預設 timeout 的原文：「Defaults: 600 for `command`, `http`, and `mcp_tool`; 30 for `prompt`; 60 for `agent` … SessionEnd hooks share a 1.5-second budget」。
- 終端機被關掉、程序被 kill、crash 時會不會觸發：**文件沒有寫**。reason 表裡沒有 SIGHUP、SIGKILL、crash 對應的值。
  - [推論] SIGKILL 和 crash 一定不會觸發（行程攔截不到 SIGKILL）。關終端機（SIGHUP）時可能落在 `other`，但官方沒有承諾。
  - 反證：#81210（OPEN，2026-07-25）原文「Because the crash is uncatchable, no cleanup ran at all」，crash 後背景任務以 PPID 1 繼續跑。
  - #96625（OPEN，macOS，2.1.278）：「terminated abnormally (force-quit, crash, terminal closed, sleep/wake issue) … background children are not cleaned up. They get reparented to launchd/PID 1」。
  - #105210（OPEN，2.1.308）：Remote Control `--spawn worktree` 的 session 不觸發 SessionEnd，靠 SessionEnd 收 broker 的 plugin 因此洩漏（單機看到 326 個 stdio MCP 程序，約 13.5 GB RSS）。
  - #98075（CLOSED/COMPLETED）：headless `-p` 約一半的 session 沒有觸發 SessionEnd（Windows）。
  - #79702（CLOSED）：`-p` 正常結束時不觸發。
  - #73924（CLOSED）：長時間跑的 remote-control 從來不觸發。
- 結論：SessionEnd 只能當「正常離開時盡力清理」用，不能當作保證。異常結束需要外部 reaper（cron 或 launchd 定期掃 PPID=1 的孤兒）補上。[推論]

### A2. 其他相關 hook

來源同上（🟡）。

- `Stop`、`SubagentStop` 可以用 `decision: "block"` 讓 agent 繼續跑（不是清理用途）。`SubagentStop` 的 `reason`「delivers `reason` to the subagent as its next instruction」。
- `WorktreeCreate`／`WorktreeRemove`：「`WorktreeRemove` | When a worktree that a `WorktreeCreate` hook created is being removed」。在 WorktreeRemove 裡順手關掉該 worktree 的 dev server 是可行的掛點。[推論]
- 決策控制表原文：「Setup, Notification, SessionEnd, PostCompact, … | None | No decision control. Used for side effects like logging or cleanup」。
- `async: true` 的 hook 不受 timeout 約束：「Claude Code doesn't enforce it on a command hook you run with `async: true`」。
- PreToolUse 可以擋 Bash 指令，例如拒絕裸 `&`、`nohup`、`--watch`，或要求改用 `run_in_background`。這是政策掛點，不是官方建議。[推論]

### A3. 背景指令（run_in_background／Ctrl+B／/tasks／TaskStop）

來源：https://code.claude.com/docs/en/interactive-mode（🟡，讀了〈Background Bash commands〉一節）、https://code.claude.com/docs/en/tools-reference（🟡，讀了 Bash 與 Monitor 兩節）

- 列出與停止：「List and stop background tasks with `/tasks`.」工具 `TaskStop`：「Stops a running background task by ID」。`TaskOutput`「Removed in v2.1.277」，改成用 Read 讀 output file。舊的 `KillShell`／`BashOutput` 名稱在現行 tools 表已經沒有。[推論：已改名或移除]
- **離開時的行為**（原文）：「Background tasks are automatically cleaned up when Claude Code exits. On macOS and Linux, when you stop a background task from `/tasks` or Claude Code stops it at exit, processes that detached from the task's shell, such as ones started under `setsid` or `timeout`, stop too」。
- 但把 session 送到背景時，背景任務會留著：「If you background the session instead of exiting it, your background tasks keep running in the background session.」
- **本機沒有時間上限**：「Background commands in a local session you work in from a terminal, the desktop app, or the VS Code extension have no time limit.」只有 unattended（`-p`、SDK、CI、cloud）才有上限：預設 30 分鐘（`-p` 文字 prompt 是 10 分鐘），最多 2 小時。
- 前景逾時會自動轉背景：「When a foreground command reaches its timeout without finishing, Claude Code moves it to the background instead of stopping it, unless the command starts with `sleep`.」[推論] 這是外洩來源之一：pytest 或 vitest 一逾時就被轉成背景，還會繼續吃記憶體。
- 關掉這個行為：`CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1`，「a command that reaches its timeout stops instead」。
- Subagent：「A command that a foreground subagent started stops when that subagent's run ends … A command that the main conversation or a background subagent started keeps running after a final response」。
- 記憶體壓力自動回收：「On macOS and Linux, Claude Code stops your running background tasks when the operating system reports critical memory pressure, provided the session has been idle for at least 30 minutes and no turn or subagent is running」。關閉用 `CLAUDE_CODE_DISABLE_BG_SHELL_PRESSURE_REAP=1`（env-vars 頁，🟡）。2.1.274 起只在「critically low」時觸發。
- 輸出超過 5GB 會自動終止。
- 逾時相關環境變數（tools-reference）：`BASH_DEFAULT_TIMEOUT_MS` 預設 120000，`BASH_MAX_TIMEOUT_MS` 預設 600000（「the effective ceiling is the larger of the two」）；設超過 1800000／7200000 時，也會調高 unattended 背景上限。
- **記憶體上限（只限 Linux／WSL）**：`CLAUDE_CODE_TOOL_MEMORY_LIMIT=4G`（v2.1.233+），用 memory cgroup 實作，「counts all of a session's Bash, PowerShell, and Monitor commands against the one cap」，「When commands can't stay under the cap, the kernel kills a command, and nothing in its result names the cap.」`CLAUDE_CODE_TOOL_MEMORY_CGROUP_EXCLUDE` 可以把 `mcp`、`lsp`、`hooks`、`plugin`、`helper`、`agent` 列入或排除（v2.1.246+）。**macOS 沒有對應機制。**
- Monitor：「Stop a monitor by asking Claude to cancel it or by ending the session.」反證 #95242（OPEN，Windows desktop）：TaskStop 或 Monitor 逾時後，面板上的項目消失了，但 `tail -F` 還活著。

### A4. Headless（`-p`）離開時的行為

來源：https://code.claude.com/docs/en/headless（🟡，讀了〈Background tasks at exit〉一節）

- 「a `claude -p` run can stay open to wait for background work」。沒有主對話背景指令時，閒置 10 分鐘後停止（`CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS`）。主對話的背景指令會等它結束或到時間上限才走。
- 反證 #102511（OPEN，Linux 2.1.300）：orchestrator 對 `claude -p` 的 process group 送 SIGTERM，被自動轉背景的 `bash -c` 在自己的 pgid 裡存活，成了孤兒，跑了 1 小時 47 分鐘。

### A5. Agent view／背景 session（supervisor）

來源：https://code.claude.com/docs/en/agent-view（🟡，讀了〈The supervisor process〉一節）

- 「The supervisor is a background service that runs your background sessions so they keep working after you close agent view or your terminal.」
- 閒置回收：「Finished or waiting for your next message, and unattached for about an hour: the supervisor stops the process to free resources … Pin a session with Ctrl+T to keep its process running.」
- **背景 shell 會跨行程轉移**：「When a session's process stops or restarts, the background shell commands and background subagents Claude started in it carry over to its next process … If you delete the session, everything it carried over stops. To stop all of it with the process instead, set `CLAUDE_CODE_DISABLE_BG_EXIT_HANDOFF` to `1`.」[推論] 這代表 session 閒置被回收後，dev server 不會跟著被收，只有刪除 session（`Ctrl+X` 兩次或 `claude rm`）才會收。
- 停止與刪除：`Ctrl+X`／`claude stop`，`Ctrl+X` 連按兩下會刪除。

### A6. MCP stdio server 的關閉方式

來源：https://code.claude.com/docs/en/mcp（🟡，讀了〈How Claude Code stops a stdio server〉一節）

- 原文：「On macOS and Linux: Claude Code sends `SIGINT`, then `SIGTERM` if the process is still running 100 milliseconds later, then `SIGKILL` after a further 400 milliseconds.」Windows 則是「closes the server's stdin, then ends the server's process tree if the process is still running 300 milliseconds later」（v2.1.296 起）。
- [推論] macOS 和 Linux 的描述只提到 server process 本身，沒寫會殺 process tree。如果 Playwright MCP 收到 SIGKILL 前來不及關 Chromium，Chromium 子程序可能變成孤兒。
- 反證 #78551（CLOSED，stale，macOS）：`/mcp` reconnect 後舊的 Chromium 沒被收，3 天累積 26 個 browser root、217 個程序，約 13GB。
- #60747（CLOSED/NOT_PLANNED）：要求 parent 離開時收掉 MCP 子程序，被標為 not planned。

### A7. Worktree 清理

來源：https://code.claude.com/docs/en/worktrees（🟡）

- 互動式 worktree session 離開時：乾淨的話自動移除，有改動的話會問。「Non-interactive runs with `-p` have no exit prompt, so Claude doesn't clean up their worktrees」。
- subagent 和背景 session 的 worktree 由 periodic sweep 依 `cleanupPeriodDays` 清掉。「The sweep also releases a lock Claude Code set for a session whose process has exited」。
- 這些都只清目錄，文件沒有提到會順便停掉 worktree 裡跑著的程序。[推論] dev server 要靠 `WorktreeRemove` hook 或自訂 reaper 處理。

### A8. Changelog（程序清理相關，原文）

來源：`gh api repos/anthropics/claude-code/contents/CHANGELOG.md`（✅ 全檔 grep，下列逐條讀過）

| 版本 | 原文 |
|---|---|
| 1.0.21 | Fixed a bug where stdio MCP server processes would linger after quitting Claude Code |
| 1.0.36 | Fixed a bug where stdio MCP servers were not terminating properly on exit |
| 1.0.85 | Hooks: Introduced SessionEnd hook |
| 2.1.6 | Fixed `mcp list` and `mcp get` commands leaving orphaned MCP server processes |
| 2.1.19 | Fixed dangling Claude Code processes when terminal is closed by catching EIO errors from `process.exit()` and using SIGKILL as fallback |
| 2.1.46 | Fixed orphaned CC processes after terminal disconnect on macOS |
| 2.1.74 | Fixed `SessionEnd` hooks being killed after 1.5 s on exit regardless of `hook.timeout` — now configurable via `CLAUDE_CODE_SESSIONEND_HOOKS_TIMEOUT_MS` |
| 2.1.79 | Fixed `SessionEnd` hooks not firing when using interactive `/resume` to switch sessions |
| 2.1.132 | Fixed an uncaught exception when the terminal is closed or SSH disconnects mid-session under the native build |
| 2.1.153 | [VSCode] Fixed Claude Code processes not shutting down cleanly when VS Code closed on Windows, causing false "unclean exit" reports and orphaned MCP servers |
| 2.1.160 | Improved background-session teardown (`claude rm`/`stop`, idle reap) to send SIGTERM to running shell subprocesses before SIGKILL, so cleanup handlers run |
| 2.1.163 | Fixed `claude -p` hanging forever after its final result when a backgrounded command never exits — background shells are now stopped ~5s after the result once stdin closes |
| 2.1.196 | Improved background session reliability: long-running commands and workflows now survive the session's process being stopped, restarted, or updated |
| 2.1.210 | Fixed killed background sessions leaving a permanent `git worktree lock` behind |
| 2.1.212 | Fixed SIGTERM during a running Bash tool orphaning the command's process tree in print/SDK mode; the CLI now aborts the turn, kills the tree, and exits 143 |
| 2.1.217 | Fixed background shells sometimes becoming impossible to stop after a session is sent to the background … or when the session exits on a heavily loaded machine |
| 2.1.257 | Fixed background commands that detach from their shell (for example under `timeout` or `setsid`) surviving a task stop or Claude Code exit |
| 2.1.268 | Fixed `CLAUDE_CODE_SESSIONEND_HOOKS_TIMEOUT_MS` not extending SessionEnd hooks that have no per-hook `timeout` |
| 2.1.274 | Fixed background commands being stopped after 30 idle minutes on machines under mild memory pressure; they're now stopped only when memory is critically low |
| 2.1.285 | Fixed synchronous hooks hanging Claude Code while a background process the hook started (for example `some-daemon &`) kept its output open |
| 2.1.296 | Windows: Fixed stdio MCP servers being force-killed at shutdown; stdin now closes first and the process tree is killed only if the server is still running after 300 ms |
| 2.1.299 | Windows: Fixed the process-liveness check leaving orphaned PowerShell processes behind on busy machines until memory ran out |
| 2.1.300 | Fixed SessionEnd hooks sometimes not running when you exit while a background command is still running |
| 2.1.317 | Fixed child processes of a stopped shell command sometimes being sent SIGTERM twice, which could make some programs skip their cleanup |

[推論] 修補頻率很高（2.1.2xx 到 2.1.3xx 每隔幾版就有一條），代表官方持續在補，但還沒完全收斂。所以升到最新版是第一步，但不能只靠升版。

---

## B. OpenAI Codex CLI

- `/ps` 與 `/stop`：來源 https://developers.openai.com/codex/cli/slash-commands（🟡）
  - 原文：「`/ps` Show background terminals and their recent output.」「`/stop` Stop all background terminals.」「Expected: Codex stops all background terminals for the current session. `/clean` is still available as an alias for `/stop`.」
  - 「Background terminals appear when `unified_exec` is in use」。
- 設定：來源 https://developers.openai.com/codex/config-reference（🟡）
  - `features.unified_exec`：「Use resumable command execution (stable; enabled on all platforms).」
  - `background_terminal_max_timeout`：「Maximum poll window in milliseconds for empty `write_stdin` polls … Default: `300000`」。這是輪詢視窗，不是程序壽命上限。[推論]
- Hooks 的 SessionEnd：來源 https://developers.openai.com/codex/hooks（🟡，該頁指向 learn.chatgpt.com）
  - 原文：「It runs for the main thread when you archive or delete a conversation that's still open, when Codex closes normally, or after a conversation has been idle and isn't open in any connected client for 30 minutes. It won't run for subagents.」「For now, `reason` is always `other`.」
  - Timeout：「`SessionEnd` and `Interrupt` use `1` second by default and support up to `3` seconds.」config 參考頁另寫：「`SessionEnd` always runs synchronously」。
- Release notes：來源 `gh release view` 抓 181 個正式版，✅ grep 後逐條讀
  - 0.9.0「ensure shell commands spawned by Codex get `SIGTERM` when `codex` is killed (Linux only)」
  - 0.57.0「Kill shell tool process groups on timeout」
  - 0.86.0「Unified exec cleans up background processes to prevent late End events」
  - 0.99.0「Process-group cleanup for stdio MCP servers to prevent orphan process storms」
  - 0.105.0「use process group to kill the PTY」
  - 0.115.0「interrupting a turn no longer tears down background terminals by default」（#14602「rename cleanup command to /stop」）
  - 0.128.0「Terminate stdio MCP servers on shutdown to avoid process leaks」
  - 0.140.0「Add app-server background terminal process APIs」
  - 0.146.0「reliably terminate sandboxed process trees」（Windows job objects）
  - 0.148.0「Harden local MCP server process tree cleanup」「Terminate timed-out hook process trees」「Reap orphaned processes in Linux sandboxes」
  - 0.155.0「Bound app-server stdio shutdown and handle Unix SIGTERM gracefully」
  - 0.161.0「Clean up process groups for failed shell snapshot captures」
- [推論] Codex 用 process group 或 job object 殺整棵 tree，策略跟 Claude Code 一致。但 0.115 起中斷 turn 不會再收背景 terminal，要靠手動 `/stop`。

## C. Cursor

- 來源 https://cursor.com/docs/agent/tools/terminal（✅ 全頁，很短）：只談 sandbox、Run Mode、`CURSOR_AGENT` 環境變數，**沒有背景程序管理或清理的說明**。
- Hooks：來源 https://cursor.com/docs/hooks（🟡，讀了 sessionEnd 一節）
  - 原文：「Called when a composer conversation ends. This is a fire-and-forget hook useful for logging, analytics, or cleanup tasks. The response is logged but not used.」
  - `reason` 可能是 `"completed" | "aborted" | "error" | "window_close" | "user_close"`，另有 `is_background_agent`。
  - 「`sessionEnd` is tied to the IDE session, not a cloud agent chat」。
  - 失敗處理：「Crashes, timeouts, and non-zero exit codes other than `2` fail open by default」。
- 官方論壇回覆（staff，🟡 讀了 Exa 摘要段落；非文件，權威度中）：
  - https://forum.cursor.com/t/possible-memory-leak-with-test-command/147911（2026-01-04）：「This is a known issue. The agent's background terminal processes don't shut down properly after a session ends. … please quit the `vitest` processes manually」。使用者的解法是改用不 watch 的 `testOnce` 指令。
  - https://forum.cursor.com/t/multiple-background-cursor-processes-after-closing-the-ide/167692（2026-08-07）：完全退出 IDE 後還殘留 `cursorsandbox`，staff 建議 `pkill -f cursorsandbox`，並說「we're tracking it」。

## D. MCP 規格：stdio 的 Shutdown

來源：https://modelcontextprotocol.io/specification/2025-06-18/basic/lifecycle 與 /2025-11-25/basic/lifecycle（✅，Shutdown 一節兩版內容相同）

> For the stdio transport, the client **SHOULD** initiate shutdown by:
> 1. First, closing the input stream to the child process (the server)
> 2. Waiting for the server to exit, or sending `SIGTERM` if the server does not exit within a reasonable time
> 3. Sending `SIGKILL` if the server does not exit within a reasonable time after `SIGTERM`
>
> The server **MAY** initiate shutdown by closing its output stream to the client and exiting.

- 規格**沒有定秒數**，只寫「reasonable time」，也沒有規定要殺子程序或 process tree。
- 與實作比對：Claude Code 在 macOS 和 Linux 是 SIGINT → 100ms → SIGTERM → 400ms → SIGKILL，第一步不是關 stdin。這跟規格建議的順序不一樣。Windows 版從 v2.1.296 起才照規格先關 stdin。[推論] 總共只給約 0.5 秒，Playwright MCP 這類要關 Chromium 的 server 很可能來不及收尾。

---

## 缺口狀態

- ✅ SessionEnd 的觸發條件、reason、timeout 原文都已確認。官方**沒有**承諾 crash、SIGKILL、關終端機時會觸發，反證 issue 已列出。
- ✅ 背景指令的列出、停止、離開時清理、時間上限、記憶體壓力回收、cgroup 上限（只限 Linux）都已確認。
- ✅ MCP stdio 關閉：規格與 Claude Code 實作的時序都已確認。
- ✅ Codex `/ps`、`/stop`、SessionEnd、process group 修補都已確認。
- 🟡 Cursor：hooks 有 sessionEnd，但 terminal 文件沒有清理說明，只能靠論壇 staff 回覆。Cursor CLI（`agent`）的背景程序行為沒找到官方文件。⚪ 未補。
- ⚪ Claude Code 收到 SIGHUP（關終端機）時會不會觸發 SessionEnd、reason 是什麼：文件沒寫，沒有實測。✉️ 需要本機實測：開 session、掛一個 SessionEnd hook 寫檔，再關掉 terminal window。
- ⚪ Claude Code 在 macOS 和 Linux 關 MCP server 時會不會連 process tree 一起殺：文件沒寫。✉️ 需要實測：開 Playwright MCP，`/exit` 後用 `pgrep -f chrom` 檢查。
