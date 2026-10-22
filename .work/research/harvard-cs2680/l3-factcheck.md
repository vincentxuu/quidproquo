# L3「Agent From a User's Perspective II: Multi-agent and Best Practice」查證

- 查證日期：2026-10-22
- 對象：Harvard CS2680 L3 投影片（`sources/slides/3_agent_use_2.txt`／`.pdf`，72 頁；頁碼 = PDF 頁序，投影片頁尾印的號碼不同，例如 PDF p68 頁尾印 78）
- 工具：Claude Code 官方文件用 `curl -sL https://code.claude.com/docs/en/<page>.md`（agent-teams、sub-agents、workflows、goal、scheduled-tasks、worktrees、desktop、hooks 皆 200；`/loop` 沒有獨立頁，在 scheduled-tasks）。GitHub repo 用 `gh api`。Anthropic 文章與 arXiv 直接 curl。OpenAI 文章 curl 回 403；Groundlane MCP 本 session 未掛載、Groundlane HTTP 先前回 401、Exa MCP 連線失敗（404 Server not found），改用 jina reader（`r.jina.ai`）取得全文。反證搜尋用 Keenable keyless API，再以 jina reader 讀全文。
- 判定：Confirmed｜Outdated（以前大致對，現在不完整或已改）｜Contradicted｜Not found（來源沒寫）

## 結果統計

| Verdict | 數量 |
|---|---|
| Confirmed | 31 |
| Outdated | 5 |
| Contradicted | 3 |
| Not found | 3 |

## 查證表

| # | 主張 | 頁 | 來源 | 原文（節錄） | Verdict |
|---|---|---|---|---|---|
| 1 | Superpowers 安裝 `/plugin install superpowers@claude-plugins-official` | p5 | github.com/obra/superpowers README | "/plugin install superpowers@claude-plugins-official" | Confirmed |
| 2 | 同模型同工具，只有指示不同；流程 clarify → design → plan → TDD → review → finish | p6 | README「The Basic Workflow」 | brainstorming → using-git-worktrees → writing-plans → subagent-driven-development/executing-plans → test-driven-development → requesting-code-review → finishing-a-development-branch | Confirmed（repo 現行流程多一步 worktree 與 subagent 執行） |
| 3 | 九個 skill | p7 | `gh api repos/obra/superpowers/contents/skills` | 2026-10-22 共 15 個 skill（多 dispatching-parallel-agents、executing-plans、subagent-driven-development、receiving-code-review、writing-skills、diagnosing-superpowers） | Outdated（投影片九個全在，但不是全部） |
| 4 | hooks.json：SessionStart、matcher `startup\|clear\|compact`、async false | p11 | repo `hooks/hooks.json` | `"matcher": "startup|clear|compact"`…`"async": false` | Confirmed |
| 5 | session-start 讀 using-superpowers 的 SKILL.md，以 `hookSpecificOutput.additionalContext` 回傳 | p12 | repo `hooks/session-start` | `skill_md="${PLUGIN_ROOT}/skills/using-superpowers/SKILL.md"`；`"hookSpecificOutput": {"hookEventName": "SessionStart", "additionalContext": "%s"}` | Confirmed |
| 6 | SessionStart hook 可回傳 additionalContext；matcher 值 | p11–12 | /hooks | "SessionStart, SubagentStart, PostModelSwitch｜Context only｜`hookSpecificOutput.additionalContext` adds context for Claude"；matcher `startup`, `resume`, `clear`, `compact`, `fork` | Confirmed（官方多了 resume、fork） |
| 7 | Caveman 安裝 `claude plugin marketplace add JuliusBrussee/caveman`、`claude plugin install caveman@caveman` | p15 | caveman README | "claude plugin marketplace add JuliusBrussee/caveman && claude plugin install caveman@caveman" | Confirmed（README 主推 install.sh，plugin 方式列在「Other ways in」） |
| 8 | 「Reported: 65% fewer output tokens」 | p17 | caveman README「Say less」 | 10 題、claude-opus-5-5：None 6,983／`Answer concisely.` 4,334／`/caveman` 4,119／`/ultracave` 2,693；"'Be concise' is the real baseline… `/caveman` cuts 3% more at the median and `/ultracave` 35% more… The rules cost about 1,160 tokens of input" | Outdated（現行 README 不再寫 65%；對「不加指示」約少 41%，對「Answer concisely」只少 3%（ultra 35%）。投影片「skill 本身增加 input」與 README 1,160 token 一致） |
| 9 | 獨立評估 | — | README Proof 表 | JetBrains：86 tasks paired A/B "No measurable quality loss (p = 0.82). 8.5% fewer output tokens"；Elastic：63.6% fewer response tokens | Confirmed（反證／補充：獨立測得的省量差很多） |
| 10 | 雙向壓縮、保留原文可取回 | p16–17 | README「Read less」 | "The voice shrinks what the agent says. This shrinks what it reads."；"Every original stays on your disk. The agent can pull it back any time." | Confirmed |
| 11 | plugin 有 SessionStart、UserPromptSubmit 兩個 hook | p19、p22 | repo `.claude-plugin/plugin.json`（v4.0.1） | hooks：SessionStart（caveman-activate.js）、SubagentStart（--subagent）、UserPromptSubmit（caveman-mode-tracker.js） | Outdated（現行多一個 SubagentStart） |
| 12 | 五個 MCP tool：compress、retrieve、stats、toon_encode、toon_decode；`ratio`、`recovery_handle` | p23 | repo `mcp/README.md` | "five compression tools — `caveman_compress`, `caveman_retrieve`, `caveman_stats`, `caveman_toon_encode`, and `caveman_toon_decode`"；compress 回 "compressed text, inferred `ratio`, `recovery_handle`" | Confirmed |
| 13 | TOON | p23 | github.com/toon-format/toon（Keenable 搜尋結果標題） | "Token-Oriented Object Notation (TOON) – JSON for LLM prompts at half the tokens" | Confirmed（只讀到 repo 標題，用於一句白話定義） |
| 14 | proxy 介於 agent 與 model provider 之間攔每個 request | p24 | repo `proxy/README.md` | "A base-URL-swap reverse proxy: point an agent at `http://127.0.0.1:8787` and its LLM traffic flows through Caveman with no code change." | Confirmed |
| 15 | 「Hooks 不能透明改寫送給 LLM 的 request，需要 proxy」 | p24 | /hooks | "`PostToolUse`: `updatedToolOutput` replaces the tool's result… before it is sent to Claude"；"`UserPromptSubmit`: can't replace the prompt; it only injects `additionalContext`" | Outdated（現在 hook 能替換單一工具結果；但仍不能改寫整個 request（system prompt、歷史訊息），所以要壓整段 request 還是得用 proxy） |
| 16 | 三個 scaling 軸 | p27 | 講者框架 | — | Not found（講者自己的分類，無外部來源；正文標為投影片說法） |
| 17 | `claude -w <name>` 建 worktree | p28 | /worktrees | "Pass `--worktree` or `-w` with a name… created under `.claude/worktrees/<name>/`… on a new branch named `worktree-<name>`" | Confirmed |
| 18 | 桌面版每個新 session 自動有 worktree | p28 | /desktop | "turn on **Worktree** before you start a session… By default, **Worktree** is off and Claude works in the project folder itself." | Contradicted |
| 19 | subagent 好處：保留 context、限制工具、重用、平行、route 到 Haiku | p31 | /sub-agents | "Control costs by routing tasks to faster, lower-cost models like Haiku"；"Reuse configurations across projects with user-level subagents" | Confirmed |
| 20 | 內建 Explore（唯讀、thoroughness）、Plan、General-purpose | p32 | /sub-agents | Explore："quick… medium… very thorough"；Plan："A research agent used during plan mode"；General-purpose："requires both exploration and modification" | Confirmed |
| 21 | Explore、Plan 不載 CLAUDE.md 與 git status | p32 | /sub-agents | "Explore and Plan start without your CLAUDE.md files and the git status snapshot to keep research fast and inexpensive." | Confirmed |
| 22 | Markdown＋YAML frontmatter，body 成為 system prompt；`.claude/agents/` 專案、`~/.claude/agents/` 使用者 | p33 | /sub-agents | "The body becomes the system prompt"；"Project subagents (`.claude/agents/`)… Check them into version control" | Confirmed（官方補：subagent 只收到這段 prompt 加基本環境資訊，不收 Claude Code 的 system prompt） |
| 23 | 巢狀：tools 要含 Agent | p34 | /sub-agents | "If you omit `Agent` from the `tools` list entirely, the agent can't spawn any subagents" | Confirmed |
| 24 | 巢狀最多 5 層，2–3 層最佳 | p34 | /sub-agents | "By default, a subagent can spawn subagents of its own, up to three layers below the main conversation… set `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`" | Contradicted（預設三層，可用環境變數調；「2–3 層最佳」官方未提） |
| 25 | model ID `claude-sonnet-5-0` | p34 | /sub-agents | 範例寫 "a full model ID such as `claude-opus-5-5` or `claude-sonnet-5`" | Not found（文件沒有 `-5-0` 寫法；正文改用別名 `sonnet`） |
| 26 | 三種呼叫：自然語言、`@agent-<name>`、`claude --agent` | p36 | /sub-agents | "Three patterns escalate from a one-off suggestion to a session-wide default"；`@agent-<name>`；`claude --agent code-reviewer` | Confirmed |
| 27 | subagent 只回報給呼叫者 | p40–42 | /agent-teams 比較表 | "Return a result to the caller. Subagents that Claude named when it spawned them can also message each other" | Outdated（具名 subagent 現在也能互傳訊息） |
| 28 | Agent teams 實驗性、預設關閉 | p38 | /agent-teams | "Agent teams are experimental and disabled by default. Enable them by setting `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`" | Confirmed |
| 29 | 適合 review、獨立模組、競爭假設、跨層；不適合循序、同檔、高依賴 | p38 | /agent-teams | "For sequential tasks, same-file edits, or work with many dependencies, a single session or subagents are more effective." | Confirmed |
| 30 | 四元件 lead、teammates、task list、mailbox（每人一個 JSON inbox） | p39 | /agent-teams | "Each agent's mailbox is a JSON file at `~/.claude/teams/{team-name}/inboxes/{agent-name}.json`"；任務三狀態 pending／in progress／completed，可有依賴 | Confirmed |
| 31 | teammate 不繼承對話，載 CLAUDE.md 與 skills | p39 | /agent-teams | "loads the same project context as a regular session: CLAUDE.md, MCP servers, and skills… The lead's conversation history does not carry over." | Confirmed（官方多列 MCP servers） |
| 32 | teams token 成本較高 | p41 | /agent-teams | "Higher: each teammate is a separate Claude instance" | Confirmed |
| 33 | Dynamic workflow：JavaScript script 在背景編排 subagent；`ultracode` 或 `/effort ultracode` | p43 | /workflows | "A dynamic workflow is a JavaScript script that orchestrates many subagents at once… a runtime executes it in the background"；"include the keyword `ultracode` in your prompt"；"set `/effort ultracode` and Claude plans a workflow for every substantive task" | Confirmed（官方補：中間結果存在 script 變數，不進 Claude 的 context） |
| 34 | `/goal`：可驗證終態、evaluator 每次重查 | p44 | /goal | "After each turn, a model checks whether the condition holds"；"sends the condition and the conversation so far to your configured small fast model"；"It doesn't run commands or read files independently" | Confirmed（官方補：evaluator 只看對話內容，不自己跑指令） |
| 35 | `/goal --max-tries` | p44 | /goal、/commands | 兩頁皆無 `--max-tries`；"To bound how long a goal runs, include a turn or time clause in the condition, such as `or stop after 20 turns`" | Contradicted（沒有這個旗標；上限寫進條件句） |
| 36 | `/loop 5m "…"`、按 Esc 停、預設 prompt 放 `.claude/loop.md` | p45 | /scheduled-tasks | `/loop 5m check the deploy`；"press `Esc` to stop it"；"`.claude/loop.md`｜Project-level"；"The seven-day expiry applies to the loop too" | Confirmed（官方補：不給間隔時 Claude 自選 1 分鐘到 1 小時；七天到期） |
| 37 | C compiler：16 agents、約 2,000 sessions、兩週、2B input／140M output、略低於 $20,000、約 10 萬行、Linux 6.9 x86/ARM/RISC-V、QEMU 等、約 99% | p47 | anthropic.com/engineering/building-c-compiler（2026-02-05） | "Over nearly 2,000 Claude Code sessions across two weeks, Opus 4.6 consumed 2 billion input tokens and generated 140 million output tokens, a total cost just under $20,000."；"The 100,000-line compiler can build a bootable Linux 6.9 on x86, ARM, and RISC-V."；"After the test suite reached a 99% pass rate" | Confirmed |
| 38 | lock file、git 協調、每個 agent 一個容器 | p48–49 | 同上 | "Claude takes a 'lock' on a task by writing a text file to current_tasks/"；"for each agent, a Docker container is spun up"；harness 是 `while true` 迴圈 | Confirmed（注意：這是 Carlini 自寫的 harness，不是 Claude Code 的 agent teams 功能） |
| 39 | 限制：merge conflict 頻繁、同一 kernel bug 時平行沒用、16-bit x86 靠 GCC、產出程式比 GCC 慢 | p50 | 同上 | "Merge conflicts are frequent"；"Every agent would hit the same bug, fix that bug, and then overwrite each other's changes"；"calls out to GCC"；"outputs less efficient code than GCC" | Confirmed |
| 40 | Karpathy Software 1.0/2.0/3.0 | p53 | YouTube oEmbed：「Andrej Karpathy: Software Is Changing (Again)」，Y Combinator；Software 2.0（2017-11-11） | "Software 2.0 is written in… the weights of a neural network" | Confirmed（演講本身未逐字讀，只用投影片表格的三列定義） |
| 41 | Codex：individual <1%、organizational 17.3%、5× 成長 | p61 | arXiv 2606.26959 | "fewer than 1% of active individual users used Codex in the last 28 days"；"In the last 28 days, 17.3% of organizational users used Codex"；"weekly active users increasing more than fivefold between January 1 and June 1, 2026" | Confirmed |
| 42 | ≥1 human-hour 35.4% → 70.2%；≥8 hours 2.1% → 25.6%（12×） | p62 | 同上 | "in December 2025, only 35.4% of active Individual users sent at least one prompt that we estimate would have taken an experienced human at least one hour… in May 2026… 70.2%"；"8 hours… risen from 2.1% to 25.6%" | Confirmed（分母是「至少送過一次這種請求的個人用戶比例」，耗時由模型估計，不是任務本身的比例） |
| 43 | 28.6% OpenAI 用戶同時跑 5+ agents；中位 2.5 agent-hours；P99 約 71、+88% since April | p63 | 同上 | "nearly 28.6% managed five or more concurrent agents"；"the median employee had Codex turns running for 2.5 hours"；"99th percentile… about 71 hours… increasing… by nearly 88% since April 7, 2026" | Confirmed |
| 44 | OpenAI 是特別有利的環境 | — | 同上 | "OpenAI is an unusually favorable environment for agentic AI: workers are highly familiar with frontier models, usage is cheap at the margin…" | Confirmed（論文自己的但書） |
| 45 | 研究組織 agent 工作量 3.14×、中位研究員每天約 $600、P90 約 $7,000 | p64、p67 | openai.com/index/research-acceleration-view-inside-openai（jina reader） | "the research organization uses 3.1 agent-workdays of effort for every workday of human labor"；"more than $600 per day of inference at API prices. The 90th percentile user… more than $7,000 of tokens per day" | Confirmed（原文寫 3.1；3.14 是圖上數字） |
| 46 | 「Almost 8x」程式碼產出 | p65 | 同上 | 文字版未給倍數，只見圖 | Not found（文字版沒有；正文只用「程式碼產出增加數倍」或不寫） |
| 47 | 依人類耗時分組的成功率：<15m 86% 零介入；64–128h 16% 零介入、51% 需介入、26% 失敗 | p66 | 投影片圖（已讀 PDF 圖）；OpenAI 原文 "over half of successful 4-8 hour tasks involved 1 or more interventions" | 圖上數值如上 | Confirmed（圖值取自投影片；原文文字只給 4–8 小時的介入比例） |
| 48 | Delegation Ladder 五級、「OpenAI's workforce sits near the bottom」 | p68 | 投影片；Codex 論文全文搜尋無 ladder／Chatbot 字樣 | 圖上第 5 級畫在最下方 | Not found（無外部出處，視為講者框架；「near the bottom」依版面指第 4–5 級，屬推論） |

## 反證與補充（正文有用到的）

| 來源 | 讀取 | 重點 |
|---|---|---|
| METR, *Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity*（2025-07-10）https://metr.org/blog/2025-07-10-early-2025-AI-experienced-os-dev-study | ✅ jina 全文 | 16 位資深開源開發者、246 個 issue；用 AI 時多花 19% 時間；事前預期快 24%，事後仍自認快 20% |
| METR, *We are Changing our Developer Productivity Experiment Design*（2026-02-24）https://metr.substack.com/p/2026-02-24-uplift-update | ✅ jina 全文 | 第二輪 57 人、800+ 任務；原受試者估計 -18%（CI -38%～+9%），新受試者 -4%（CI -15%～+9%）；不想在沒 AI 下工作的人退出，造成選擇偏誤，結果是下限；一些開發者表示等 agent 時在做別的任務，難以計時 |
| Cognition, *Don't Build Multi-Agents*（2025-06-12）https://cognition.ai/blog/dont-build-multi-agents | ✅ jina 全文 | 兩原則：Share context；Actions carry implicit decisions |
| Cognition, *Multi-Agents: What's Actually Working*（2026-04-22）https://cognition.ai/blog/multi-agents-working | ✅ jina 全文 | "Our original observations still hold today for parallel-writer swarms… a narrower class of patterns that do: setups where multiple agents contribute intelligence to a task while writes stay single-threaded"；clean-context reviewer 有效 |
