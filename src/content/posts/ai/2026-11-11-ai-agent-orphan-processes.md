---
title: "平行開 AI coding agent 把記憶體吃光：孤兒程序從哪來、怎麼收"
date: 2026-11-11
category: ai
type: debug
tags: [coding-agent, claude-code, mcp, macos, developer-tools]
lang: zh-TW
tldr: "同時開好幾個 Claude Code、Codex 或 Cursor 的 session，dev server、測試 worker 和 Playwright MCP 會在 session 結束後變成孤兒繼續跑，swap 被吃到 30 GB、測試卡住。macOS 沒有單一程序的記憶體上限，要靠 SessionEnd hook、定期回收孤兒、記憶體守門三層一起擋。"
description: "AI coding agent 平行開發時留下孤兒程序的成因（程序收養、只殺外層 shell、MCP 每 session 一份）、各家工具的現況，以及在 macOS 上用 SessionEnd hook、launchd 定期回收與 swap 通知三層防護的做法和限制。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-11-11-ai-agent-orphan-processes-en)

## TL;DR

同時開好幾個 AI coding agent 的 session，電腦變慢最常見的原因是 session 留下來的程序：dev server、測試 worker、[Playwright MCP](https://github.com/microsoft/playwright-mcp) 和它開的瀏覽器。開它們的程式一結束，它們就被系統收養（PPID 變成 1），沒有任何人會關。macOS 又沒辦法替單一程序設記憶體上限，只能用三層補：session 正常結束時收自己開的、定期回收沒人管的孤兒、記憶體快滿時通知。

## 情境

我習慣同時開幾個 [Claude Code](https://code.claude.com/docs/en/overview) session，各自在不同的 git worktree 改後端和前端。某天一組 pytest 跑了 25 分鐘還沒結束，實際用到的 CPU 時間只有 1.5 分鐘，其他時間都在等記憶體換頁。

## 問題

`sysctl vm.swapusage` 一看，swap 用了 29.6 GB，總量 30.7 GB。正在跑的 agent 沒吃多少，記憶體都在一堆沒人在用的程序手上：

- 4 個 vite dev server，開了一天以上，開它們的 session 早就結束了
- 另一個 worktree 的 uvicorn 加 celery，掛在一個開了兩天、一直被 resume 的 session 底下
- 3 個 playwright-mcp，最舊的開了 2 天，加上它開的瀏覽器約 3.5 GB

這些都關掉之後，swap 用量從 21 GB 降到 9 GB，卡住的測試才開始動。

## 先確認是不是孤兒程序

這三個指令可以在一分鐘內看出問題在哪：

```bash
# swap 用了多少（macOS）
sysctl vm.swapusage

# 最占記憶體的程序（含壓縮記憶體，比 ps 的 RSS 準）
top -l 1 -o mem -n 10 -stats pid,mem,command

# 父程序已經是 launchd（PPID=1）的開發服務：這些就是孤兒
ps -axo pid,ppid,etime,command | awk '$2 == 1' | grep -E 'uvicorn|celery|vite|vitest|pytest|playwright-mcp'
```

`etime` 欄位是程序已經跑了多久。開了好幾個小時、父程序是 1 的 dev server，幾乎可以確定沒人在用。

## 為什麼會留下孤兒

```diagram
title: agent 異常結束後，dev server 被 launchd 收養
desc: session 還在時，vite 掛在 agent 開的工具 shell 底下；agent 異常結束後，shell 跟著消失，npm 與 vite 被 launchd（PID 1）收養並繼續執行。
caption: 簡化示意：launchd 一直都在，這裡畫在原本 agent 的位置，方便對照。
---
<svg viewBox="0 0 640 448">
  <text class="dg-heading" x="20" y="28" dominant-baseline="central">session 還在</text>
  <text class="dg-heading" x="340" y="28" dominant-baseline="central">session 異常結束後</text>
  <line class="dg-rule" x1="316" y1="16" x2="316" y2="332"/>

  <path class="dg-line" d="M160 104V128" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 176V200" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 248V272" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent" d="M560 82H604Q612 82 612 90V218Q612 226 604 226H564" marker-end="url(#arrow-accent)"/>
  <path class="dg-line" d="M480 248V272" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="80" y="60" width="160" height="44" rx="6"/>
  <text class="dg-label" x="160" y="82" text-anchor="middle" dominant-baseline="central">Claude Code</text>
  <rect class="dg-box" x="80" y="132" width="160" height="44" rx="6"/>
  <text class="dg-label" x="160" y="154" text-anchor="middle" dominant-baseline="central">工具 shell</text>
  <rect class="dg-box" x="80" y="204" width="160" height="44" rx="6"/>
  <text class="dg-label" x="160" y="226" text-anchor="middle" dominant-baseline="central">npm run dev</text>
  <rect class="dg-box" x="80" y="276" width="160" height="44" rx="6"/>
  <text class="dg-label" x="160" y="298" text-anchor="middle" dominant-baseline="central">vite＋esbuild</text>

  <rect class="dg-box dg-box--accent" x="400" y="60" width="160" height="44" rx="6"/>
  <text class="dg-label" x="480" y="82" text-anchor="middle" dominant-baseline="central">launchd（PID 1）</text>
  <rect class="dg-box dg-box--ghost" x="400" y="132" width="160" height="44" rx="6"/>
  <text class="dg-label" x="480" y="154" text-anchor="middle" dominant-baseline="central">工具 shell</text>
  <rect class="dg-box" x="400" y="204" width="160" height="44" rx="6"/>
  <text class="dg-label" x="480" y="226" text-anchor="middle" dominant-baseline="central">npm run dev</text>
  <rect class="dg-box dg-box--warn" x="400" y="276" width="160" height="44" rx="6"/>
  <text class="dg-label" x="480" y="298" text-anchor="middle" dominant-baseline="central">vite＋esbuild</text>

  <text class="dg-edge dg-text--accent" x="604" y="154" text-anchor="end" dominant-baseline="central">收養</text>
  <g class="dg-badge"><circle cx="384" cy="154" r="10"/><text x="384" y="154" text-anchor="middle" dominant-baseline="central">−</text></g>

  <line class="dg-rule" x1="20" y1="352" x2="620" y2="352"/>
  <text class="dg-tag" x="20" y="376" dominant-baseline="central">變更清單</text>
  <g class="dg-badge"><circle cx="32" cy="404" r="10"/><text x="32" y="404" text-anchor="middle" dominant-baseline="central">−</text></g>
  <text class="dg-sub" x="52" y="404" dominant-baseline="central">移除 agent 與工具 shell（crash）</text>
  <g class="dg-badge dg-badge--accent"><circle cx="352" cy="404" r="10"/><text x="352" y="404" text-anchor="middle" dominant-baseline="central">→</text></g>
  <text class="dg-sub" x="372" y="404" dominant-baseline="central">改接 npm 的父程序變成 launchd</text>
  <text class="dg-sub" x="52" y="432" dominant-baseline="central">vite 沒收到任何信號，照常佔記憶體和 port</text>
</svg>
```

原因可以拆成四個，彼此會疊加：

1. **父程序死了，子程序不會跟著死。** POSIX 規定程序結束時，它的子程序改由系統程序收養（[`_exit()`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/_exit.html)），macOS 上就是 launchd。agent 的工具 shell 通常不是終端機的控制程序，所以子程序連 SIGHUP 都收不到，會一直跑下去。
2. **agent 常用的寫法本來就是要讓程序脫離。** `nohup uvicorn ... > log 2>&1 &` 這種寫法，`&` 讓指令立刻返回，[`nohup`](https://www.gnu.org/software/coreutils/manual/html_node/nohup-invocation.html) 擋掉 SIGHUP，再加 `setsid` 就連程序群組都換掉，按群組殺也殺不到。Cursor 的工作人員在[論壇](https://forum.cursor.com/t/agent-started-long-running-servers-vite-disappear-from-the-terminal-ui-aborting-the-agent-shell-orphans-the-process-ppid-1/171517)回覆時也是先問這幾種寫法。
3. **停止時只殺最外層。** Node 的 [`subprocess.kill()`](https://nodejs.org/api/child_process.html) 只會殺直接的子程序，官方文件的範例就寫明 shell 裡的程序不會被殺。`npm run dev` → `vite` → `esbuild`、`pytest` → xdist worker 這種一層包一層的指令，停掉 shell 之後，底下的程序都會留下。
4. **MCP server 每個 session 一份。** [MCP 規格](https://modelcontextprotocol.io/specification/2025-06-18/basic/lifecycle)把關閉 stdio server 的責任交給 client，而且只寫 SHOULD。每個 session 各自起一套 MCP，平行 session 一多，程序數直接相乘。一篇[實測文章](https://jyoung.dev/blog/claude-code-parallel-sessions-memory/)量到三個 session 裡，有兩個的 MCP server 比 Claude Code 本身還吃記憶體。

Claude Code 另外有一個放大因素：[前景指令逾時後不會被停掉，而是轉到背景繼續跑](https://code.claude.com/docs/en/interactive-mode)。卡住的 pytest 會從「一次工具呼叫」活成「整個 session 的壽命」，session 一異常結束就成了孤兒。

## 不是你一個人

各家工具都有公開回報，而且大多還沒修完（2026-11 查詢的狀態）：

| 工具 | 代表回報 | 狀態 |
|---|---|---|
| Claude Code | [#95821](https://github.com/anthropics/claude-code/issues/95821)：MCP 連線逾時後不殺已啟動的程序，5 個 session 累積 373 個孤兒 | 未關閉 |
| Claude Code | [#96625](https://github.com/anthropics/claude-code/issues/96625)：crash 或強制結束後，背景程序被 launchd 收養繼續跑 | 未關閉 |
| Codex CLI | [#30408](https://github.com/openai/codex/issues/30408)：每個 thread 各起一套 MCP 且不回收，25 個 thread 後約 9.3 GB | 未關閉 |
| Cursor | [論壇](https://forum.cursor.com/t/possible-memory-leak-with-test-command/147911)：工作人員承認 session 結束後背景終端機的程序不會關，是已知問題 | 已知問題 |
| Cline | [#14622](https://github.com/cline/cline/issues/14622)：hub 模式下 MCP 從不停止，一天半累積 10 份 Serena | 未關閉 |
| Playwright MCP | Claude Code [#78551](https://github.com/anthropics/claude-code/issues/78551)：重新連線後舊瀏覽器沒收，3 天累積約 13 GB | 已關閉（未處理） |

也有反過來的教訓。Claude Code #96625 的留言提到，Codex 0.97–0.98 曾經改成「一輪對話結束就殺背景工作」，結果把正常要長跑的 `nohup` 工作和 watch 迴圈一起弄壞。所以工具不能一律直接殺，這也是問題拖這麼久的原因。

## 官方機制能做到哪

Claude Code 在**正常結束**時其實會清得很乾淨。[官方文件](https://code.claude.com/docs/en/interactive-mode)寫明：

> Background tasks are automatically cleaned up when Claude Code exits. On macOS and Linux, when you stop a background task from `/tasks` or Claude Code stops it at exit, processes that detached from the task's shell, such as ones started under `setsid` or `timeout`, stop too.

缺口在保證範圍以外的情況：

- **crash、被 kill、直接關終端機。** [SessionEnd hook](https://code.claude.com/docs/en/hooks) 的 reason 只有 `clear`、`resume`、`logout`、`prompt_input_exit`、`other`，文件沒有承諾異常結束時會觸發。
- **SessionEnd 的時間很短。** 預設總共只有 1.5 秒，要靠個別 hook 的 `timeout` 或 `CLAUDE_CODE_SESSIONEND_HOOKS_TIMEOUT_MS` 拉長。
- **背景 session 的程序會轉交。** session 閒置被 supervisor 回收時，[它開的背景 shell 會帶到下一個程序](https://code.claude.com/docs/en/agent-view)，只有刪除 session 才會收。設 `CLAUDE_CODE_DISABLE_BG_EXIT_HANDOFF=1` 可以改成一起停。
- **記憶體上限只有 Linux。** `CLAUDE_CODE_TOOL_MEMORY_LIMIT` 用 cgroup 實作，只支援 Linux 和 WSL。

Codex 有 [`/ps` 和 `/stop`](https://developers.openai.com/codex/cli/slash-commands) 可以列出、停止背景終端機；Cursor 的 [sessionEnd hook](https://cursor.com/docs/hooks) 是不等結果的 fire-and-forget。三家都沒有保證異常結束後清乾淨。

## macOS 為什麼沒辦法設上限

在 Linux 上，最完整的做法是用 cgroup 把整個 session 包起來（後面會講）。macOS 沒有 cgroup，其他看起來能用的方法實際上都不行：

- **`ulimit` 沒用。** 我在 macOS 26 上實測，`ulimit -m` 回 bad option，`ulimit -v` 回 setrlimit failed。`setrlimit(2)` 的 man page 說，記憶體吃緊時「the system will prefer to take memory from processes that are exceeding their declared resident set size」。這只是回收時的偏好，不是上限。launchd 的 `ResidentSetSize` 也是同一段文字。
- **swap 沒有固定上限。** Apple 的[虛擬記憶體文件](https://developer.apple.com/library/archive/documentation/Performance/Conceptual/ManagingMemory/Articles/AboutMemory.html)寫明 swap「uses all of the available space on the machine's boot partition」。孤兒程序的閒置頁會一直被換出去，系統不會當掉，只會越來越慢。
- **系統也不太會幫你殺。** [XNU 原始碼](https://github.com/apple-oss-distributions/xnu/blob/main/bsd/kern/kern_memorystatus.c)的註解寫 macOS 只有「a very limited jetsam that is only invoked under extreme conditions」，要等到 swap 或壓縮空間快用完才動手。

macOS 上唯一真正的硬上限是容器：[Docker](https://docs.docker.com/engine/containers/resource_constraints/) 的 `--memory`，或 Docker Desktop 整個 VM 的上限。

## 我的做法：三層一起擋

單靠一層都有漏洞，所以我用三層，每一層補前一層抓不到的情況：

| 層 | 什麼時候動作 | 抓得到 | 抓不到 |
|---|---|---|---|
| 1. SessionEnd hook | session 正常結束 | 這個 session 開的 dev server、測試 | crash、被 kill、一直不關的 session |
| 2. 定期回收 | 每 5 分鐘 | 父程序是 1 的孤兒、開太久的 Playwright MCP | 掛在活著的 session 底下的服務 |
| 3. 記憶體守門 | 隨時 | 測試合計超量時暫停最新一組；swap 快滿時通知 | 不會自己殺東西，要人決定 |

### 第 1 層：SessionEnd hook 收這個 session 開的服務

hook 從自己往上找到這個 session 的 `claude` 程序，收掉它底下所有符合條件的程序樹。重點有兩個。第一，hook 一啟動就要先拍下程序清單，因為 `claude` 一結束，子程序就被 launchd 收養，樹就斷了。第二，要 fork 到背景再殺，才不會被 1.5 秒的時間限制卡住。

```python
MATCH = re.compile(
    r"(^|[/\s])pytest(\s|$)|-m pytest|vue-tsc"
    r"|(^|[/\s])uvicorn\s|(^|[/\s])celery\s.*\bworker\b|manage\.py\s+runserver"
    r"|vite(\.js)?\s|vitest|pnpm\s+(dev|vite)\b|npm\s+run\s+dev\b"
)
# 1. snapshot：ps -axo pid=,ppid=,comm=,command=
# 2. 往上找到 comm == "claude" 的祖先
# 3. 往下收集 MATCH 的程序與它們的子孫
# 4. fork + setsid 脫離，送 SIGTERM（加 SIGCONT 叫醒被暫停的），5 秒後還活著就 SIGKILL
```

在 `~/.claude/settings.json` 的 `hooks.SessionEnd` 掛上這支腳本即可。比對清單只列開發服務，MCP server 不會被誤殺。

### 第 2 層：launchd 每 5 分鐘回收孤兒

用一個 LaunchAgent（`StartInterval` 設 300）跑掃描腳本，兩條規則：

- 父程序已經是 1、跑超過 4 小時的 uvicorn、celery worker、runserver、vite、vitest、`pnpm dev`：沒有人管，整棵收掉。
- Playwright MCP 不論父程序，跑超過 12 小時就收掉。它常掛在長期不關的 session 底下，瀏覽器分頁會越開越多。

```bash
ps -axo pid=,ppid=,etime=,command= | while read -r pid ppid etime cmd; do
  [ "$ppid" = 1 ] || continue
  grep -Eq "$PATTERN" <<<"$cmd" || continue
  grep -q 'mcp' <<<"$cmd" && continue
  [ "$(etime_secs "$etime")" -ge "$orphan_secs" ] || continue
  pids=$(tree "$pid" | tr '\n' ' ')
  log "REAP pid=$pid age=$etime tree=[$pids]"
  kill -TERM $pids; kill -CONT $pids
  ( sleep 10; kill -KILL $pids 2>/dev/null ) &
done
```

`tree` 是用 `pgrep -P` 遞迴找子孫的小函式。腳本留一個 `DRY_RUN=1` 模式，只列出會動到誰，第一次裝之前先跑一次確認。

### 第 3 層：記憶體守門

另一支常駐的守護程式定期加總所有 pytest、vue-tsc 程序樹的記憶體。超過實體記憶體一半，就對最新開始的那一組送 SIGSTOP 暫停（不殺），降下來再依序恢復。

第 2 層的腳本順便檢查 swap：用到 80% 以上就用 `osascript` 跳通知，列出最占記憶體的幾個程序，半小時最多通知一次。

用 `top` 的 MEM 欄位而不是 `ps` 的 RSS：記憶體吃緊時大量頁面被壓縮或換出，RSS 會嚴重低估。

被暫停的測試看起來就像卡住。我這次就是先誤以為測試卡死，查了 log 才發現是被守門程式暫停。所以 log 要寫清楚每次暫停和恢復。

## Linux 和容器的選項

在 Linux 上，[`systemd-run --user --scope`](https://www.freedesktop.org/software/systemd/man/latest/systemd-run.html) 加 [`MemoryHigh`、`MemoryMax`](https://www.freedesktop.org/software/systemd/man/latest/systemd.resource-control.html) 可以替整個 agent session 設上限，結束時寫 cgroup 的 [`cgroup.kill`](https://docs.kernel.org/admin-guide/cgroup-v2.html) 連 fork 出去的程序一起清掉，不怕 `setsid`：

```bash
systemd-run --user --scope -p MemoryHigh=6G -p MemoryMax=8G -p MemorySwapMax=0 -- claude
```

要注意 OOM 殺掉 xdist worker 時，[整組測試可能卡住](https://github.com/pytest-dev/pytest-xdist/issues/658)，所以測試指令要另外包 `timeout -k`。

容器方案（每個 agent 一個容器）在兩個平台都能用，但 devcontainer 的 [`hostRequirements.memory`](https://containers.dev/implementors/json_reference/) 是最低需求不是上限，要限制得在 `runArgs` 加 `--memory`。

## 從源頭少開一點

回收是事後補救，這幾個設定可以讓程序一開始就少一點：

- **Playwright MCP 設閒置關閉。** [`--idle-timeout`](https://github.com/microsoft/playwright-mcp) 對無頭瀏覽器預設 1 小時，有畫面的瀏覽器預設永遠不關。多個 agent 要共用一組瀏覽器，可以用 HTTP 模式加 `--shared-browser-context`，代價是分頁會互相干擾。
- **xdist 的 worker 數依記憶體算。** [`-n auto`](https://pytest-xdist.readthedocs.io/en/stable/distribution.html) 只看實體 CPU 核心數，不看記憶體。幾個 agent 同時跑測試時，用 `PYTEST_XDIST_AUTO_NUM_WORKERS` 壓低。
- **測試用一次跑完的指令。** `vitest run` 而不是 `vitest`，`tsc` 而不是 `tsc --watch`。watch 模式本來就不會結束。
- **celery 在 macOS 被 SIGKILL 不會收子程序。** [官方文件](https://docs.celeryq.dev/en/stable/userguide/workers.html#stopping-the-worker)寫明 Linux 才有 `PR_SET_PDEATHSIG` 補救，macOS 要自己 `pkill`。

## 限制

- **回收會誤殺故意留著的服務。** 如果你用 `nohup` 開了一個要長開的 dev server，超過 4 小時就會被收。門檻做成環境變數，自己調。
- **長期不關的 session 抓不到。** 服務的父程序還活著，第 2 層不會動它，只能靠 swap 通知提醒你去關。
- **launchd 在睡眠期間不會跑**，醒來後最多要等 5 分鐘才會補一次。
- 社群也有現成工具，例如 [cc-reaper](https://github.com/theQuert/cc-reaper) 用 Stop hook 加 LaunchAgent 收 Claude Code 的孤兒，做法類似，可以直接拿來改。

## 學到的事

AI agent 的工具在正常結束時大多清得乾淨，漏的是 crash、強制結束和一直不關的 session。平行開越多 session，漏掉的程序就越多。在 macOS 上沒有記憶體上限可以設，所以要自己補一個定期回收孤兒的程式，再加一個 swap 快滿時的通知。

## 參考資料

- [Claude Code：Background Bash commands（interactive mode）](https://code.claude.com/docs/en/interactive-mode)
- [Claude Code：Hooks reference（SessionEnd）](https://code.claude.com/docs/en/hooks)
- [Claude Code：Agent view 與 supervisor](https://code.claude.com/docs/en/agent-view)
- [Claude Code issue #95821：MCP 重試留下孤兒程序](https://github.com/anthropics/claude-code/issues/95821)
- [Claude Code issue #96625：crash 後背景程序變孤兒](https://github.com/anthropics/claude-code/issues/96625)
- [Claude Code issue #78551：Playwright MCP 瀏覽器累積](https://github.com/anthropics/claude-code/issues/78551)
- [OpenAI Codex issue #30408：每個 thread 的 MCP 不回收](https://github.com/openai/codex/issues/30408)
- [Codex CLI slash commands（/ps、/stop）](https://developers.openai.com/codex/cli/slash-commands)
- [Cursor 論壇：agent 開的 vite 變成 PPID 1 孤兒](https://forum.cursor.com/t/agent-started-long-running-servers-vite-disappear-from-the-terminal-ui-aborting-the-agent-shell-orphans-the-process-ppid-1/171517)
- [Cursor 論壇：測試指令的記憶體洩漏](https://forum.cursor.com/t/possible-memory-leak-with-test-command/147911)
- [Cursor Hooks（sessionEnd）](https://cursor.com/docs/hooks)
- [Cline issue #14622：hub 模式 MCP 不停止](https://github.com/cline/cline/issues/14622)
- [Playwright MCP README（--idle-timeout、--shared-browser-context）](https://github.com/microsoft/playwright-mcp)
- [MCP 規格：Lifecycle › Shutdown](https://modelcontextprotocol.io/specification/2025-06-18/basic/lifecycle)
- [Node.js child_process：subprocess.kill()](https://nodejs.org/api/child_process.html)
- [POSIX _exit()](https://pubs.opengroup.org/onlinepubs/9799919799/functions/_exit.html)
- [GNU coreutils：nohup](https://www.gnu.org/software/coreutils/manual/html_node/nohup-invocation.html)
- [Apple：About the Virtual Memory System](https://developer.apple.com/library/archive/documentation/Performance/Conceptual/ManagingMemory/Articles/AboutMemory.html)
- [XNU 原始碼 kern_memorystatus.c](https://github.com/apple-oss-distributions/xnu/blob/main/bsd/kern/kern_memorystatus.c)
- [systemd-run](https://www.freedesktop.org/software/systemd/man/latest/systemd-run.html)
- [systemd.resource-control（MemoryHigh、MemoryMax）](https://www.freedesktop.org/software/systemd/man/latest/systemd.resource-control.html)
- [Linux cgroup v2 文件](https://docs.kernel.org/admin-guide/cgroup-v2.html)
- [pytest-xdist issue #658：OOM 殺 worker 後卡住](https://github.com/pytest-dev/pytest-xdist/issues/658)
- [pytest-xdist：Distribution（-n auto）](https://pytest-xdist.readthedocs.io/en/stable/distribution.html)
- [Docker：Resource constraints](https://docs.docker.com/engine/containers/resource_constraints/)
- [Dev Container JSON reference（hostRequirements）](https://containers.dev/implementors/json_reference/)
- [Celery：Stopping the worker](https://docs.celeryq.dev/en/stable/userguide/workers.html#stopping-the-worker)
- [John Young：Claude Code Memory Usage: How Many Sessions Fit on One Machine](https://jyoung.dev/blog/claude-code-parallel-sessions-memory/)
- [cc-reaper](https://github.com/theQuert/cc-reaper)
