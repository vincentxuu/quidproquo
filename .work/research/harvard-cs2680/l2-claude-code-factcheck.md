# L2「How Claude Code Works」產品行為查證

- 查證日期：2026-10-21
- 對象：Harvard CS2680 L2 投影片（`sources/slides/2_agent_use_1.txt`，頁碼 = PDF 第 N 頁，即第 N 個 form-feed 區塊；投影片頁尾印的號碼跟 PDF 頁不同）＋ A1 頁面（`sources/pages/assignments_assignment1.txt`）
- 來源：Claude Code 官方文件 `https://code.claude.com/docs/en/<page>`，用 `curl -sL` 抓 `.md` 版本（22 頁全部成功，不必降級到 Exa／WebFetch）。另外對照本機 `claude --version` = 2.1.306 和 `claude --help`。
- 判定：Confirmed（文件現況支持）｜Outdated（以前大致對，現在不完整或已改）｜Contradicted（跟文件不符）｜Not found（官方文件沒寫）

## 結果統計

| Verdict | 數量 |
|---|---|
| Confirmed | 32 |
| Outdated | 2 |
| Contradicted | 2 |
| Not found | 4 |

## 查證表

| # | 主張 | 頁 | 文件 URL | 文件原文（節錄） | Verdict |
|---|---|---|---|---|---|
| 1 | Agentic loop：Gather context → Generate action → Run tool，重複，每步依上一步結果 | p6 | /how-claude-code-works | "three phases: **gather context**, **take action**, and **verify results**. These phases blend together." | Confirmed（官方的第三階段叫 verify results，投影片叫 Run tool，切法不同但概念一致） |
| 2 | 打字前 context 已含 system、CLAUDE.md／memory、tools、skills／MCP | p7 | /context-window | "Before you type anything: CLAUDE.md, auto memory, MCP tool names, and skill descriptions all load into context." | Confirmed |
| 3 | Skill／MCP 開場只載名稱與描述，用到才載全文 | p7 | /how-claude-code-works | "MCP tool definitions are deferred by default … only tool names and server instructions consume context"；"Claude sees skill descriptions at session start, but the full content only loads when a skill is used." | Confirmed（細節：MCP 開場只載 tool 名稱與 server instructions，不含 tool 描述；skill 載 description） |
| 4 | 開場 context 已有 10k+ tokens | p7 | /context-window | 互動時間軸只說用「representative token counts」，文字版沒有具體開場數字 | Not found |
| 5 | 預設工具含 Glob、Grep；範例 `Grep("authentication")` | p7–8 | /tools-reference | "On macOS, Linux, and WSL, Claude Code leaves Glob and Grep out of the default tool set, and Claude searches with `find` and `grep` through the Bash tool instead." | Outdated（只有 Windows 預設還有 Glob/Grep 工具；「不送整個 repo、按需搜尋」的論點仍成立） |
| 6 | Model proposes, harness executes | p9 | /how-claude-code-works | "Claude Code is the layer around the model that provides the tools and manages the context … This surrounding layer is what the term agentic harness refers to." | Confirmed |
| 7 | 權限模式：Manual／Accept Edits／Bypass／Auto | p11 | /permission-modes | 模式表：`default`(Manual)、`acceptEdits`、`plan`、`auto`、`dontAsk`、`bypassPermissions`；`claude --help` choices 同樣六種 | Outdated（少列 `plan` 與 `dontAsk`；四個名稱本身都正確） |
| 8 | Auto mode 由「a small model」檢查 | p11 | /permission-modes | "a separate classifier model reviews actions before they run"；"By default, classifier requests go to Claude Sonnet 5." | Contradicted（確實是另一個模型審，但預設是 Sonnet 5 不是小模型，也可能在 server 端審） |
| 9 | 權限結果三種：allowed／ask／denied | p11 | /permissions | allow／ask／deny 三類規則；"Deny rules block in every mode" | Confirmed |
| 10 | Compaction 摘要舊軌跡 | p12 | /how-claude-code-works | "It clears older tool outputs first, then summarizes the conversation if needed." | Confirmed（先清舊 tool output，必要時才摘要） |
| 11 | Compaction 後重新注入 CLAUDE.md 與 memory | p12 | /context-window、/memory | "Project-root CLAUDE.md and unscoped rules: Re-injected from disk"；"Auto memory: Re-injected from disk" | Confirmed（巢狀 CLAUDE.md 和 `paths:` rules 要等再碰到對應檔案才重新載入） |
| 12 | 典型 context 1M tokens（Sonnet／Opus／Fable） | p12 | /model-config | "Fable 5.1, Fable 5, Sonnet 5 and later, Haiku 5.5, and Opus 4.7 and later run with the 1M window by default" | Confirmed（Opus 4.6／Sonnet 4.6 要選 `[1m]` 版本才有 1M） |
| 13 | GPT 5.6 也是 1M；今年稍早 256K 常見 | p12 | — | Claude Code 文件不涵蓋其他廠商模型，也沒有這個歷史說法 | Not found（要另找 OpenAI 來源查） |
| 14 | 「prefix-cache reads account for most of the cost」 | p12 | /costs | "Claude Code re-reads that history at the cached token rate"（`/cost` 範例：940.0k cache read vs 1.2k input） | Not found（文件說歷史以 cache 價重讀、範例 token 數也以 cache read 為主，但沒說它佔成本大宗） |
| 15 | Auto memory 每 session 載入前 200 行／25KB | p18、p23 | /memory | "The first 200 lines of `MEMORY.md`, or the first 25KB, whichever comes first, are loaded at the start of every conversation." | Confirmed（這個上限只針對 MEMORY.md；CLAUDE.md 最多 4 MiB 會整份載入） |
| 16 | Auto memory 依 repository 分、worktree 共用、只存本機 | p18、p23 | /memory | "Auto memory is machine-local. All worktrees and subdirectories within the same git repository share one auto memory directory." | Confirmed |
| 17 | Auto memory 預設開啟，可在 /memory 關掉 | p23 | /memory | "Auto memory is on by default in local sessions … open `/memory` in a session and use the auto memory toggle" | Confirmed（self-hosted 環境預設關閉） |
| 18 | CLAUDE.md 四個位置：managed `…/ClaudeCode/CLAUDE.md`、`~/.claude/CLAUDE.md`、`./CLAUDE.md` 或 `./.claude/CLAUDE.md`、`./CLAUDE.local.md` | p20 | /memory | macOS: `/Library/Application Support/ClaudeCode/CLAUDE.md`；"A project CLAUDE.md can be stored in either `./CLAUDE.md` or `./.claude/CLAUDE.md`" | Confirmed |
| 19 | 載入順序由範圍最大到最小，最近的檔案最後讀 | p20 | /memory | "lists them in load order, from broadest scope to most specific, so a project instruction appears in context after a user instruction." | Confirmed（檔案是串接起來，不是互相覆蓋） |
| 20 | Managed policy CLAUDE.md 不能被排除 | p20 | /memory | "Managed policy CLAUDE.md files cannot be excluded." | Confirmed |
| 21 | 每份 CLAUDE.md 控制在 200 行以下 | p21 | /memory | "target under 200 lines per CLAUDE.md file. Longer files consume more context and reduce adherence." | Confirmed |
| 22 | `.claude/rules/` 加 `paths:` frontmatter 只在碰到符合的檔案時載入；沒有 paths 就每個 session 載入 | p22 | /memory | "Rules without a `paths` field are loaded unconditionally … A path-scoped rule loads when Claude uses the Read, Write, or Edit tool on a matching file." | Confirmed |
| 23 | Auto memory 四種 type（user／feedback／project／reference），每個檔案用 type 欄位標記 | p23 | /memory | "Claude records the kind as a `type` field in the memory file's frontmatter: user … feedback … project … reference" | Confirmed |
| 24 | 位置 `~/.claude/projects/<project>/memory/`；MEMORY.md 是 index；topic 檔按需讀取 | p23–24 | /memory | "Each project gets its own memory directory at `~/.claude/projects/<project>/memory/`"；"Claude Code doesn't load topic files … at startup. Claude reads them on demand" | Confirmed |
| 25 | `/memory`：瀏覽、編輯、刪除或停用 memory | p25 | /commands、/memory | "Edit `CLAUDE.md` files, enable or disable auto memory, and view auto memory entries" | Confirmed（「刪除」沒有明列，靠開檔編輯或開資料夾處理） |
| 26 | `/context` 看哪些 instruction 檔有載入 | p25 | /memory | "Run `/context` and check the list under **Memory files**" | Confirmed |
| 27 | `/init` 產生入門版 CLAUDE.md | p25 | /commands | "Initialize project with a `CLAUDE.md` guide" | Confirmed（已有 CLAUDE.md 時會改成建議修改） |
| 28 | `/doctor` 找出不該放在 CLAUDE.md 的內容 | p25 | /commands、/memory | "diagnoses installation, settings, extension, and `CLAUDE.md` problems"；`/doctor prompt-audit` 檢查 "outdated or conflicting content" | Confirmed（現在是 bundled skill；instruction 審查走 `prompt-audit` 子指令，需要 v2.1.283 以上） |
| 29 | 核心工具六類：Read、Search、Fetch、Edit/Write、Shell、Delegate | p28 | /how-claude-code-works | "The built-in tools generally fall into five categories": File operations、Search、Execution、Web、Code intelligence；"Claude also has tools for spawning subagents…" | Contradicted（官方分五類：Read 和 Edit 合成 File operations，另有 Code intelligence；Delegate 算在 orchestration 工具，不列為核心類別。投影片是教學用的自訂分類） |
| 30 | Skill = 資料夾＋SKILL.md（description＋body）＋references/scripts | p33–34 | /skills | "Every skill needs a `SKILL.md` file with two parts: YAML frontmatter … and markdown content with the instructions" | Confirmed |
| 31 | Description 在 session 開始時載入，body 執行時才載入 | p35 | /how-claude-code-works | "Claude sees skill descriptions at session start, but the full content only loads when a skill is used." | Confirmed |
| 32 | Model-invoked vs user-invoked；有副作用的流程應要求明確呼叫 | p33、p35 | /skills | "actions you want to invoke directly with `/skill-name` … Add `disable-model-invocation: true`" | Confirmed（加了 `disable-model-invocation: true` 後，description 也不會先放進 context） |
| 33 | Hook 事件：Session start／User prompt／Before tool use／After tool use／Before stopping | p38 | /hooks | `SessionStart`、`UserPromptSubmit`、`PreToolUse`、`PostToolUse`、`Stop` | Confirmed（現在還有約 30 種其他事件，例如 PreCompact、SubagentStop、PermissionRequest） |
| 34 | Hook 可以跑 command、HTTP、MCP tool、prompt、subagent | p38 | /hooks | "`type`: `\"command\"`, `\"http\"`, `\"mcp_tool\"`, `\"prompt\"`, or `\"agent\"`" | Confirmed（不是每個事件都支援全部五種，例如 SessionStart 只支援 command／mcp_tool） |
| 35 | Plugin 目錄：skills/、hooks/、agents/、.mcp.json、.lsp.json、.claude-plugin/plugin.json | p39 | /plugins-reference | "Save the manifest at `.claude-plugin/plugin.json` … Put every other plugin file at the plugin root"；"Loaded together with `.lsp.json`" | Confirmed |
| 36 | Project settings 優先於 user settings | p41 | /settings | "Settings precedence, highest first: managed settings, command line, project local, shared project, user." | Confirmed |
| 37 | stream-json：先 init，再 assistant／user（tool_use／tool_result），最後 result；subagent 事件帶 `parent_tool_use_id` | A1 | /headless | "The `system/init` event … is the first event in the stream"；"Their `parent_tool_use_id` field says which run each one belongs to." | Confirmed |
| 38 | print mode 下 stream-json「requires --verbose」 | A1 | /headless、/cli-reference | 所有 stream-json 範例都帶 `--verbose`，但只在 `--prompt-suggestions` 那一項明寫 "Requires … `--verbose`" | Not found（沒有明文規定；本機沒有實跑驗證，因為規定不能跑 agent 任務） |
| 39 | result 事件含 `total_cost_usd`、`duration_ms`、`num_turns`、`session_id` | A1 | /agent-sdk/typescript | `SDKResultMessage`：`duration_ms: number; … num_turns: number; … total_cost_usd: number;` | Confirmed |
| 40 | `claude -p --resume <session-id> "<follow-up>"` 接續 session | A1 | /headless | "`--resume` with a session ID to continue a specific conversation"；`claude -p "Continue that review" --resume "$session_id"` | Confirmed |

## 寫導讀時的提醒

- 第 5、7、8、29 條改寫時要用官方現況，或明講「講者的簡化說法」。
- 第 13、14 條在 Claude Code 文件找不到；要保留就另外找來源，不然改成講者觀點。
- 這份 deck 的產品細節會隨版本變（本次對照 v2.1.306），文章要寫查證日期。
