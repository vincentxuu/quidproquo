# Claude Code 大綱事實查證報告 C（文章 13–17）

查證日期：2026-08-25
對照來源：https://code.claude.com/docs（docs.anthropic.com/en/docs/claude-code 已遷移至 code.claude.com/docs/en/*）

---

## 13. src/content/posts/tech/deep-dive/2026-03-28-claude-code-remote-control-guide.md

| # | 主張 | 判定 |
|---|------|------|
| 1 | 從手機/平板/其他電腦繼續本地 session；Claude 在你的電腦上執行（非雲端） | 【正確】https://code.claude.com/docs/en/remote-control |
| 2 | 本地 MCP servers、工具、專案設定全部可用 | 【正確】同上 |
| 3 | 多裝置同步：terminal + 瀏覽器 + 手機可交替操作 | 【正確】同上 |
| 4 | Server Mode：`claude remote-control`，專用 server 模式等待遠端連線 | 【正確】同上 |
| 5 | flags `--name`、`--spawn`（same-dir/worktree）、`--capacity` | 【正確】同上。【補充】`--spawn` 還有第三個值 `session`（單一 session 模式）；另有 `--continue`、`--session-id`（v2.1.200+）、`--sandbox` |
| 6 | Interactive Session：`claude --remote-control`，正常互動 session + 遠端可控，本地和遠端都可以打字 | 【正確】同上 |
| 7 | 從既有 Session：`/remote-control` 帶著完整對話歷史繼續 | 【正確】同上。【補充】官方還列了第 4 種：VS Code extension 的 `/remote-control` |
| 8 | 連線方式：Session URL 直接開啟、QR code（手機掃描）、claude.ai/code 或 Claude app 找 session | 【正確】同上 |
| 9 | 安全機制：只有 outbound HTTPS、不開 inbound port、流量經 Anthropic API over TLS、多個短期 credentials 各自獨立過期 | 【正確】同上。【補充】session transcript 連線期間會存在 Anthropic 伺服器上以同步裝置 |
| 10 | vs web 對照表：Remote Control 跑在本機（本地檔案/MCP ✅）；web 跑在 Anthropic 雲端（fresh clone、無 MCP ❌） | 【正確】同上及 https://code.claude.com/docs/en/claude-code-on-the-web |
| 11 | 五種遠端工作方式表 — Dispatch：手機 Claude app → Desktop | 【正確】https://code.claude.com/docs/en/desktop（"Dispatch sessions from your phone"） |
| 12 | 五種遠端工作方式表 — Channels：Telegram/Discord/iMessage 觸發本地 CLI session | 【正確，但需加註】https://code.claude.com/docs/en/channels — Telegram/Discord/iMessage 為 research preview 的 plugin，且 Team/Enterprise 需管理員明確啟用 |
| 13 | 五種遠端工作方式表 — Slack：@Claude → Anthropic 雲端 | 【正確，但需加註】https://code.claude.com/docs/en/slack — Team/Enterprise 的此版本正在退役，改推 Claude Tag |
| 14 | 五種遠端工作方式表 — Scheduled Tasks：Cron，「雲端或本地」 | 【存疑】https://code.claude.com/docs/en/scheduled-tasks 的 `/loop` + cron 工具是在本地 Claude Code session 內排程；跑在雲端的排程功能現在叫 **Routines**（https://code.claude.com/docs/en/routines）。建議把「雲端」那格改成 Routines 或註明 |
| 15 | （大綱未提）plan 限制 | 【建議補充】Remote Control 需要 Pro/Max/Team/Enterprise 訂閱（API key 不支援）；Team/Enterprise 預設關閉，需 Owner 在 admin settings 開啟。來源：https://code.claude.com/docs/en/remote-control |

**結論**：大綱整體正確度高。建議修正 Scheduled Tasks 的「雲端」描述、補 plan 限制、`--spawn` 第三模式。

---

## 14. src/content/posts/tech/deep-dive/2026-03-28-claude-code-settings-json-guide.md

| # | 主張 | 判定 |
|---|------|------|
| 1 | `~/.claude/settings.json`（全域）/ `.claude/settings.json`（專案）/ `.claude/settings.local.json`(本地、不進 git) 三層位置 | 【正確】https://code.claude.com/docs/en/settings 。【過時之處】官方現在是**四層**：還有 `managed-settings.json`（企業 managed settings，MDM 或 claude.ai console 下發，優先序最高）；另有第五檔 `~/.claude.json`（Claude Code 自己寫的 global config）。settings.local.json 由 Claude Code 自動加入 global git excludes，手動建立的才要自己 gitignore |
| 2 | 三者的合併規則 | 【部分過時】完整優先序：managed settings > CLI（`--settings`/flags）> `.claude/settings.local.json` > `.claude/settings.json` > `~/.claude/settings.json`。且**清單型 key（如 permissions.allow）跨層 merge 而非覆蓋**。來源：https://code.claude.com/docs/en/settings#settings-precedence |
| 3 | 欄位：hooks、permissions、model、env | 【正確】https://code.claude.com/docs/en/settings-reference |
| 4 | 欄位：`allowedTools` / `disallowedTools` | 【過時】settings.json 的頂層欄位已是 `permissions.allow` / `permissions.deny` / `permissions.ask`；`--allowedTools`/`--disallowedTools` 只剩 CLI flag 身分。settings-reference 已無 `allowedTools` 設定 key。來源：https://code.claude.com/docs/en/settings-reference |
| 5 | 欄位：`mcpServers`（MCP server 設定） | 【過時】MCP server 定義不在 settings.json——在 `.mcp.json`（專案）、`~/.claude.json`（`claude mcp add` 寫入）或 enterprise managed MCP config；settings.json 只有相關控制鍵如 `enableAllProjectMcpServers`、`allowedMcpServers`/`deniedMcpServers`。例外：sub-agent frontmatter 的 `mcpServers` 是合法的。來源：https://code.claude.com/docs/en/mcp 、https://code.claude.com/docs/en/settings-reference |
| 6 | 除錯技巧：`/status` 看 Setting sources、`claude doctor`、Settings Error/Warning 分級 | 【正確】https://code.claude.com/docs/en/settings#check-what-loaded 、https://code.claude.com/docs/en/debug-your-config |
| 7 | JSON Schema：json.schemastore.org/claude-code-settings.json | 【正確】官方 settings 頁自己引用此 schema |

**結論**：三處要修——(a) 補 managed settings 第四層；(b) `allowedTools/disallowedTools` 改成 `permissions.allow/deny`；(c) `mcpServers` 從 settings.json 欄位清單移除（改說 .mcp.json / claude mcp add）。另外完整欄位清單的權威來源已拆到 `/docs/en/settings-reference`，參考資料應補這條。

---

## 15. src/content/posts/tech/deep-dive/2026-03-28-claude-code-slack-integration.md

| # | 主張 | 判定 |
|---|------|------|
| 1 | @Claude 留言 → 偵測 coding intent → 啟動 Claude Code web session → 回報 Slack | 【正確】https://code.claude.com/docs/en/slack |
| 2 | 需要 Pro/Max/Teams/Enterprise plan + Claude Code on the web access | 【正確】prerequisites 表列 Pro、Max、Team、Enterprise with Claude Code access + web access enabled。同上。【重要補充】官方宣布 **Team 與 Enterprise 的此版本正在退役，改由 Claude Tag 取代**（組織共用身分、admin 配置存取權）；Pro/Max 仍走此路徑。文章發布前應加註 |
| 3 | 設定步驟 1–5（Marketplace 安裝 → App Home 連結帳號 → 設定 web+GitHub → 選路由模式 → `/invite @Claude`） | 【正確】同上。【補充】安裝需 workspace administrator 執行；Claude 只在被 invite 的 channel 回應，DM 不支援 |
| 4 | 路由模式 Code only / Code + Chat；判斷錯了可以 "Retry as Code" | 【正確】同上 |
| 5 | 運作流程六步 + View Session / Create PR / Change Repo 按鈕 | 【正確】同上 |
| 6 | Context 收集：讀 thread 全部訊息 / channel 最近訊息 / 自動選 repo | 【正確】同上 |
| 7 | 安全與權限：自己的帳號、計入個人 plan 額度、只能存取自己連結的 repo、channel-based access control | 【正確】同上。【補充】Enterprise/Team 從 Slack 建立的 session 會自動對組織可見（web sharing） |
| 8 | 參考資料 Slack Marketplace 連結 `slack.com/marketplace/A07DNBDB84N-claude` | 【過時】官方文件目前指向 `https://slack.com/marketplace/A08SF47R6P4`。舊 app ID 可能仍指向同一 app，但應以官方文件連結為準。來源：https://code.claude.com/docs/en/slack |
| 9 | GitHub Actions 作為替代觸發方式 | 【正確】https://code.claude.com/docs/en/github-actions 仍在 |

**結論**：內容基本全對。兩件事必須處理：(1) 加註 Team/Enterprise 改走 Claude Tag 的退役消息；(2) 更新 Marketplace 連結 ID。

---

## 16. src/content/posts/tech/deep-dive/2026-03-28-claude-code-sub-agent-parallel-execution.md

| # | 主張 | 判定 |
|---|------|------|
| 1 | Sub-agent 獨立 context window、有自己的 system prompt/工具權限/模型、依 description 自動委派、保護主 context | 【正確】https://code.claude.com/docs/en/sub-agents |
| 2 | 內建表 — Explore：Haiku（快速）、唯讀 | 【過時】自 v2.1.198 起 Explore **繼承主對話模型**（Claude API 上限 Opus），不再固定 Haiku。工具唯讀仍正確。同上 |
| 3 | 內建表 — Plan：繼承主對話、唯讀、Plan mode 研究 | 【正確】同上 |
| 4 | 內建表 — General-purpose：繼承、全部工具 | 【正確】同上 |
| 5 | 內建表 — **Bash** agent：「獨立 context 中跑指令」 | 【過時／查無此事】官方內建清單為 Explore、Plan、general-purpose，加上 helper agents：`claude`（catch-all）、`statusline-setup`（Sonnet）、`claude-code-guide`（Haiku）。沒有獨立的「Bash」agent。同上 |
| 6 | 內建表 — Claude Code Guide：Haiku | 【正確】同上 |
| 7 | `/agents` 互動介面建立/編輯/刪除 | 【過時】自 v2.1.198 起 `/agents` **不再開啟互動建立精靈**，改為提示直接請 Claude 建立 or 手动編輯 `.claude/agents/`。v2.1.197 以前才有 wizard。同上 |
| 8 | Scope 優先序：`--agents` flag > `.claude/agents/` > `~/.claude/agents/` > Plugin agents/ | 【部分過時】相對順序正確，但**最高的是 Managed settings（組織層級）**，官方五層：Managed(1) > `--agents`(2) > `.claude/agents/`(3) > `~/.claude/agents/`(4) > plugin(5)。同上 |
| 9 | Frontmatter 必填 name/description | 【正確】同上 |
| 10 | `tools`/`disallowedTools`、`model`（sonnet/opus/haiku/inherit/full ID）、`permissionMode`、`maxTurns`、`skills`、`mcpServers`（inline 或引用）、`hooks`、`memory`（user/project/local）、`background`、`effort`、`isolation` | 【全部正確】同上。【補充】model 還接受 `fable`；permissionMode 還有 `auto` 與 `manual` alias；另有 `color`、`initialPrompt` 欄位可提 |
| 11 | memory 路徑：user→`~/.claude/agent-memory/<name>/`、project→`.claude/agent-memory/<name>/`、local→`.claude/agent-memory-local/<name>/`；MEMORY.md 自動管理 | 【正確】同上（MEMORY.md 取前 200 行或 25KB 注入 system prompt） |
| 12 | `Agent(worker, researcher)` 限制可 spawn 的子代理 | 【正確】僅適用於以 `claude --agent` 跑在 main thread 的 agent。同上 |
| 13 | 背景：並行執行、Ctrl+B 轉背景、背景權限預批准機制 | 【Ctrl+B 正確】同上。fork mode 開啟時 subagent 預設就在背景跑。「背景權限預批准機制」細節官方頁未以此措辭描述——背景 subagent 有縮減的工具集（保留 Read/Grep/Glob/Bash/Edit/Write 等固定清單 + 所有 MCP tools），【存疑】建議改寫成官方的工具縮減描述 |
| 14 | 呼叫方式：自然語言自動委派、@-mention、`--agent <name>`、`"agent": "name"` 專案預設 | 【正確】@-mention 與 `--agent` 見同頁；`agent` 為合法 settings key（見 https://code.claude.com/docs/en/settings-reference ） |
| 15 | 與 Agent Teams 比較表 | 【正確（概念層面）】https://code.claude.com/docs/en/agent-teams — teammates 共享 task list、互相傳訊、由 Claude spawn/supervise |
| 16 | tldr「內建 Explore、Plan、general-purpose 三種」 | 【正確】主要三種無誤，但表格若列 Bash 要刪 |

**結論**：四處要修——Explore 模型描述、刪掉 Bash 內建 agent、`/agents` wizard 已移除、優先序補 Managed settings 第一層。

---

## 17. src/content/posts/tech/2026-03-28-claude-code-troubleshooting-collection.md

| # | 主張 | 判定 |
|---|------|------|
| 1 | Skills 相關問題（找不到、中斷、跳過步驟） | 【大綱性質，無事實衝突】官方 skills 除錯在 https://code.claude.com/docs/en/debug-your-config |
| 2 | Hooks 相關（不觸發、matcher 語法、command 失敗未阻擋、PreToolUse vs PostToolUse） | 【合理】hook 除錯官方指引在 debug-your-config 與 https://code.claude.com/docs/en/hooks-guide |
| 3 | 設定相關（語法錯誤導致失效、全域 vs 專案衝突、local 沒被讀） | 【合理且與官方一致】settings 頁的 "Troubleshoot a setting that doesn't apply"、"Fix a broken settings file"（Settings Error/Warning 分級）正是這些主題。https://code.claude.com/docs/en/settings |
| 4 | `--dangerously-skip-permissions` 開了但工具還是被擋 | 【無法驗證】官方文件未記載此症狀。bypassPermissions 模式下「actions no mode auto-approves」仍有部分動作會擋（https://code.claude.com/docs/en/permission-modes ），建議以此官方機制改寫 |
| 5 | allowedTools 在 bypass 模式下的已知 bug | 【無法驗證】官方 troubleshooting/error reference 無此條目。且 `allowedTools` 已被 `permissions.*` 取代（見文章 14）。若指 GitHub issue 需附連結佐證 |
| 6 | 子代理權限繼承問題 | 【可驗證的官方行為】parent 用 bypassPermissions/acceptEdits 時 subagent 不能覆蓋；parent 用 auto mode 時 subagent 強制繼承 auto 且忽略 frontmatter permissionMode。https://code.claude.com/docs/en/sub-agents#permission-modes |
| 7 | MCP 相關（逾時、token 過期、schema 不符） | 【合理】`/mcp` 查狀態、debug-your-config 有 MCP 段落。https://code.claude.com/docs/en/debug-your-config |
| 8 | 效能相關（context 滿、大型 repo 啟動慢、token 異常） | 【正確方向】官方 troubleshooting 頁核心就是 High CPU/memory、autocompact thrashing、hangs、search 問題；`--safe-mode`、`/compact`、`/heapdump` 都是官方解法。https://code.claude.com/docs/en/troubleshooting |
| 9 | 參考資料描述「Troubleshooting…涵蓋常見安裝與執行問題」 | 【過時】troubleshooting 頁已縮窄為**效能/穩定性/搜尋**問題；安裝與登入問題已拆到 https://code.claude.com/docs/en/troubleshoot-install ；設定/hooks/MCP 不生效在 https://code.claude.com/docs/en/debug-your-config 。參考資料應補這兩條 |
| 10 | Permission Modes 參考描述（default、acceptEdits、auto、bypassPermissions） | 【正確】auto mode 已存在且是 Pro/Max/Team 新 session 預設；另有 plan、dontAsk。https://code.claude.com/docs/en/permission-modes |
| 11 | Context Window 互動模擬頁存在 | 【正確】https://code.claude.com/docs/en/context-window |
| 12 | Best Practices 頁存在 | 【正確】https://code.claude.com/docs/en/best-practices |

**結論**：結構 OK。要修：參考資料對 troubleshooting 頁範圍的描述（安裝問題已拆頁）；「allowedTools bypass bug」標題需改寫或附證據，否則建議換成官方可查證的 auto mode / parent-mode 繼承行為。

---

## 附錄：docs.anthropic.com → code.claude.com URL 對照

以下為這 10 個檔案（5 zh-TW + 5 en）參考資料中所有 `docs.anthropic.com/en/docs/claude-code/*` 連結的新對應：

| 舊 URL 路徑 | 新 URL | 備註 |
|---|---|---|
| `…/claude-code/remote-control` | https://code.claude.com/docs/en/remote-control | |
| `…/claude-code/claude-code-on-the-web` | https://code.claude.com/docs/en/claude-code-on-the-web | |
| `…/claude-code/cli-reference` | https://code.claude.com/docs/en/cli-reference | |
| `…/claude-code/slack` | https://code.claude.com/docs/en/slack | |
| `…/claude-code/channels` | https://code.claude.com/docs/en/channels | |
| `…/claude-code/scheduled-tasks` | https://code.claude.com/docs/en/scheduled-tasks | |
| `…/claude-code/settings` | https://code.claude.com/docs/en/settings | 完整欄位索引已拆到 /docs/en/settings-reference |
| `…/claude-code/settings#settings-precedence` | https://code.claude.com/docs/en/settings#settings-precedence | anchor 仍有效 |
| `…/claude-code/settings#subagent-configuration` | https://code.claude.com/docs/en/settings#subagent-configuration | anchor 仍有效 |
| `…/claude-code/permissions` | https://code.claude.com/docs/en/permissions | |
| `…/claude-code/hooks` | https://code.claude.com/docs/en/hooks | |
| `…/claude-code/environment-variables` | https://code.claude.com/docs/en/env-vars | **路徑改名** environment-variables → env-vars |
| `…/claude-code/mcp` | https://code.claude.com/docs/en/mcp | |
| `…/claude-code/mcp#mcp-installation-scopes` | https://code.claude.com/docs/en/mcp | **anchor 改名**：現為 #installing-mcp-servers |
| `…/claude-code/sub-agents` | https://code.claude.com/docs/en/sub-agents | |
| `…/claude-code/sub-agents#scope-mcp-servers-to-a-subagent` | https://code.claude.com/docs/en/sub-agents#scope-mcp-servers-to-a-subagent | anchor 仍有效 |
| `…/claude-code/agent-teams` | https://code.claude.com/docs/en/agent-teams | |
| `…/claude-code/programmatic-usage` | https://code.claude.com/docs/en/headless | **改名**："Run Claude Code programmatically"；SDK 內容另見 /docs/en/agent-sdk/overview |
| `…/claude-code/troubleshooting` | https://code.claude.com/docs/en/troubleshooting | 範圍縮窄為效能/穩定性；安裝問題拆至 troubleshoot-install |
| `…/claude-code/permission-modes` | https://code.claude.com/docs/en/permission-modes | |
| `…/claude-code/context-window` | https://code.claude.com/docs/en/context-window | |
| `…/claude-code/best-practices` | https://code.claude.com/docs/en/best-practices | |
| `…/claude-code/github-actions` | https://code.claude.com/docs/en/github-actions | |

非 anthropic 網域連結（json.schemastore.org、claude.ai/download、claude.ai/upgrade、anthropic.com/news、www.anthropic.com/research）不在本次遷移範圍，未逐一核對外站有效性。

### 需要特別注意的 3 條

1. **environment-variables → env-vars**（唯一單純改名的路徑）
2. **programmatic-usage → headless**（改名＋內容重構）
3. **mcp#mcp-installation-scopes → mcp#installing-mcp-servers**（anchor 改名，deep link 會 404 anchor）
