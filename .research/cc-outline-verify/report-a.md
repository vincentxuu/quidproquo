# Claude Code 大綱事實查證報告（report-a.md）

查證日期：2026-08-25。對照官方文件 code.claude.com/docs（docs.anthropic.com/en/docs/claude-code 已遷移）。

共通問題：六篇的「參考資料」全部使用舊網域 `docs.anthropic.com/en/docs/claude-code/...`，該網域已遷移至 `code.claude.com/docs/en/...`，建議全部更新為新網域。

---

## 1. Agent Teams（2026-03-28-claude-code-agent-teams-guide.md）

來源：https://code.claude.com/docs/en/agent-teams

- 【正確】Agent Teams 為實驗性功能、預設關閉，需設 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`（settings.json env 或 shell）。
- 【正確】Teammates 可互相直接溝通；sub-agents 回報結果給呼叫者。（小但書：文件註明「Claude 命名的 subagents 也可以互相傳訊」，比較表若寫「只能回報給主代理」略過於絕對。）
- 【正確】teammateMode 設定值 `"auto"` / `"in-process"` / `"tmux"`（v2.1.186 起新增 `"iterm2"`；目前預設是 `"in-process"`，v2.1.179 前預設才是 `"auto"`——大綱若暗示 auto 為預設需注意）。
- 【過時：應為方向鍵上下選取 teammate，按 Enter 開啟並輸入訊息】In-process 切換方式不是「Shift+Down」。Escape 是中斷選定 teammate 的當前回合（正確）；另可按 `x` 停止、Ctrl+T 切換任務清單。
- 【正確】Split panes 需要 tmux 或 iTerm2（it2 CLI + Python API）；不支援 VS Code 整合終端機、Windows Terminal、Ghostty。
- 【正確】任務三態 pending → in progress → completed；依賴未完成會 block；Lead 指派 vs 自行認領；file locking 防搶任務。
- 【正確】Plan approval：teammate 在 read-only plan mode 提計畫，Lead 審核；可在 prompt 給審核標準（如必須包含測試）。
- 【正確】Task list 存 `~/.claude/tasks/{team-name}/`；Team config 存 `~/.claude/teams/{team-name}/config.json`（名稱為 session 衍生：`session-` + session ID 前 8 碼，非自訂名稱）。Mailbox 為 `~/.claude/teams/{team-name}/inboxes/{agent-name}.json`。
- 【正確】Hooks：`TeammateIdle` / `TaskCreated` / `TaskCompleted`，exit code 2 可阻擋並回饋。
- 【正確】自動訊息傳遞不需輪詢；idle 通知 Lead；teammates 不繼承 Lead 對話歷史；權限繼承 Lead 設定。
- 【存疑】「message vs broadcast」——官方文件只描述點對點 by-name 傳訊，「要通知所有人就逐一發訊息」，沒有 broadcast 機制。建議改寫。
- 【正確】限制清單全數吻合：無 session resumption（in-process）、任務狀態延遲、關閉慢、一 session 一 team、不支援巢狀 teams、Lead 固定不可轉移。
- 【正確】最佳實踐數字：3–5 teammates、每人 5–6 任務，與官方 Tip 一致。
- 【正確】平行 code review（PR #142 三種 reviewer）與競爭假設除錯案例皆為官方範例。
- 參考資料連結：過時網域（見共通問題）；其中「Common Workflows / claude-code-action」兩條與 Agent Teams 主題關聯弱。

## 2. Best Practices & Workflows（2026-03-28-claude-code-best-practices-workflows.md）

來源：https://code.claude.com/docs/en/permission-modes 、https://code.claude.com/docs/en/commands

- 【正確】`/plan` 存在：`/plan [description]` 直接進 plan mode，也可單則 prompt 加前綴。
- 【正確】plan 核准後可切 auto mode（「Yes, and use auto mode」選項）或逐筆確認編輯。
- 【正確】`/undo` 存在——但它是 `/rewind` 的別名（aliases: `/checkpoint`, `/undo`），不是獨立的「還原到上一個 checkpoint」指令。大綱寫「Review diff，必要時 `/undo`」可用，但不宜與 `/rewind` 描述成兩種不同行為。
- 【正確】auto mode 由 classifier 模型審查動作（「classifier 把關」）。
- 【正確】acceptEdits 自動核准檔案編輯＋常見檔案系統指令（mkdir/touch/rm/rmdir/mv/cp/sed）。
- 【正確】漸進式信任四層 default → acceptEdits → auto → bypassPermissions（隔離環境限定）成立。補充：Pro/Max/Team 內建起始模式已是 auto（v2.1.228+），「新專案用 default」不再是普遍預設。
- 【正確】git worktree 平行開發流程與官方 common workflows 一致。
- 【存疑】「CLAUDE.md 精簡（< 200 行）」——現行官方文件只說 keep it concise，無 200 行這個數字門檻。建議拿掉具體數字或標註為經驗值。
- 【正確】`/compact` 手動壓縮 context。
- 【存疑】bypassPermissions 相關：現行文件另有 `dontAsk` 模式（CI/腳本用），反模式段「YOLO 模式裸跑（沒有 checkpoint）」中的 checkpoint 機制請參見第 4 篇——checkpoint 不是 git commit。

## 3. Channels（2026-03-28-claude-code-channels-guide.md）

來源：https://code.claude.com/docs/en/channels

- 【正確】Channels 是把外部事件推送到執行中 session 的 MCP server，雙向溝通（讀事件、同一 channel 回覆）。
- 【正確】Research Preview 狀態。
- 【無法驗證】「需要 v2.1.80+」——channels 頁面未提及任何最低版本號。建議移除或改引用 release notes 來源。
- 【正確】Telegram 流程：BotFather 建 bot → `/plugin install telegram@claude-plugins-official` → `/telegram:configure <token>` → `claude --channels plugin:telegram@claude-plugins-official` → 配對碼 + allowlist，全與官方一致。Discord（Message Content Intent、bot 權限）亦同。iMessage（macOS only、免 token、Full Disk Access、自己傳給自己即繞過配對）亦同。補充：所有 channel plugins 需要 Bun。
- 【正確】安全機制：sender allowlist、pairing code、permission relay、`--channels` 每 session 控管（且只在 `.mcp.json` 不夠，必須列在 `--channels`）。
- 【正確】Enterprise 控制：`channelsEnabled` master switch（claude.ai Team/Enterprise 預設關閉；Console API key 預設允許）、`allowedChannelPlugins`、Pro/Max 無組織使用者不受限。
- 【正確】自製 channel 用 `--dangerously-load-development-channels` 測試（preview 期間兩個 flag 都不出現在 `claude --help` 但有效）。
- 【正確】功能比較表五列（web / Slack / MCP server / Remote Control / Channels）與官方表格一致。
- 【存疑】大綱說「基於 MCP server 協議」正確，但可補充：v2 MCP client runtime 若協議協商到 2026-07-28 revision，channel 會註冊失敗（`MCP_PROTOCOL_NEGOTIATION=auto` 相關）。

## 4. Checkpointing（2026-03-28-claude-code-checkpointing-guide.md）

來源：https://code.claude.com/docs/en/checkpointing 、https://code.claude.com/docs/en/commands

- 【過時：應為「內建 snapshot 機制，不是 git commit」】整篇核心框架「用 Git 建立 AI 操作的安全還原點」「不是額外的系統——就是 git commit」與官方文件矛盾。Checkpoint 是 Claude Code 自己管理的檔案快照：每個 user prompt 建一個 checkpoint、保留最近 100 個的快照檔、30 天後隨 session 清除；官方明言「Not a replacement for version control」，checkpoint commit 不會出現在 git 歷史。「Checkpoint commit 的格式和辨識方式」「與一般 commit 的差異」這兩節前提不成立，應重寫為 snapshot 的儲存與保留規則。
- 【部分正確／需修正】Esc Esc（prompt 空時）開啟 rewind menu：正確。`/rewind` 存在：正確。`/undo` 也存在，但它是 `/rewind` 的別名，兩者行為相同（都開 rewind menu 選還原點），不是「/undo 還原上一個、/rewind 還原指定點」的分工。
- 【正確】rewind menu 選項：Restore code / Restore conversation / Restore code and conversation / Summarize from here / Summarize up to here。
- 【重要遺漏（建議加入限制章節）】bash 指令造成的檔案變更（rm/mv/cp 等）不被追蹤、無法 rewind；非前景 forked skill 的 subagent 編輯通常也不會被 restore；symlink/hard-link 路徑會被跳過。
- 【無法驗證】「Agent Teams 的 `--spawn worktree` 模式」——agent-teams 與 cli-reference 文件均無此 flag。疑似不存在，建議刪除或改講 worktrees 頁的 manual parallel sessions。
- 【正確】`--max-turns` flag 存在（cli-reference / github-actions 文件皆提及）。
- 【存疑】「web/desktop 介面的 diff 預覽和還原」——checkpointing 頁僅提到 VS Code extension 以第一個 snapshot 作為 session diff baseline，web/desktop 的 diff 預覽 UI 未在文件中描述。
- 【存疑】「Checkpoint + Docker = 雙重保險」屬合理建議但非官方主張；另外 bypassPermissions 下 checkpoint 不是萬能防線（bash 變更不在涵蓋範圍），行文應加此但書。

## 5. Chrome 整合（2026-03-28-claude-code-chrome-integration.md）

來源：https://code.claude.com/docs/en/chrome

- 【正確】`claude --chrome` 啟動；session 內 `/chrome` 查狀態/管理權限；`/chrome` → "Enabled by default" 設為預設。
- 【正確】Chrome extension v1.0.36+。
- 【存疑／可能過時】「Beta 階段」——現行頁面標題與內文已不再標 beta（僅外部支援文章連結仍帶 beta 字樣）。建議寫「beta／早期階段（依官方頁面為準）」或移除。
- 【過時：應為「正式支援 Chrome 與 Edge；也會在其他 Chromium 瀏覽器（Brave、Arc、Vivaldi、Opera）偵測擴充套件並建立連線」】大綱寫「不支援 Brave、Arc 等非主流 Chromium 瀏覽器」與現行文件矛盾。
- 【正確】不支援 WSL。另補充：API key / setup-token 認證的 session 無法用 Chrome 整合（需 `/login` claude.ai 帳號；第三方 provider 不可用）。
- 【正確】能力：開分頁導航、點擊輸入滾動、讀 DOM 與 console log、截圖、錄 GIF、跨分頁操作、檔案上傳（v2.1.211+）。
- 【正確】遇到 CAPTCHA 或登入頁會暫停交由使用者處理。
- 【存疑】參考資料的 Chrome Web Store 擴充套件 ID `ghkclklbadheamoidpamljhmaopggfkf` 與官方文件連結的 ID `fcoeoabgfenejglbffodgkkbkcdhcgfn` 不同，請確認哪個是現行上架版本。
- 【正確】實際案例（live debugging、console 分析、表單自動化、Google Docs、錄 GIF）皆為官方範例。
- 【正確】「預設啟用會增加 context 消耗」與官方 Note 一致。

## 6. GitHub Actions（2026-03-28-claude-code-ci-cd-github-actions.md）

來源：https://code.claude.com/docs/en/github-actions

- 【正確】`/install-github-app` 快速設定（裝 App + secrets + 開 workflow PR）；手動設定路徑正確。secret 名稱：`ANTHROPIC_API_KEY`（API key）或 `CLAUDE_CODE_OAUTH_TOKEN`（訂閱 token，`claude setup-token` 產生）。
- 【正確】互動模式（@claude 觸發）vs 自動化模式（有 `prompt` input 即自動執行）。
- 【正確】workflow YAML 結構與官方範例相符（issue_comment / pull_request_review_comment + anthropics/claude-code-action@v1）；建議補上官方範例有的 `if: contains(... '@claude')`、`permissions:`（含 `id-token: write`）區塊。
- 【正確】Action 參數表：`prompt`、`claude_args`、`anthropic_api_key`、`trigger_phrase`（預設 @claude）、`use_bedrock` / `use_vertex` 全部存在；可補 `use_foundry`（Microsoft Foundry）與 `claude_code_oauth_token`。
- 【正確】@claude 範例 prompt 三則與官方文件幾乎逐字相同；cron 排程（`0 9 * * *`）為官方範例。
- 【正確】企業級 OIDC 身份驗證（Bedrock / Vertex / Foundry 不存靜態 credentials）；自訂 GitHub App vs 官方 Claude App 的取捨官方有描述。
- 【正確】GitHub Code Review 為獨立產品：每個 PR 自動 review、不需寫 workflow、與 claude-code-action 有別。
- 【正確】成本控制：Actions minutes + API tokens、`--max-turns`、workflow timeouts、concurrency controls。
- 【正確】安全最佳實踐：GitHub Secrets、最小權限、merge 前審查、CLAUDE.md 定義標準。
- 【小補充】觸發檢查：觸發者需有 repo write access、bots 預設被拒（`allowed_bots` 可例外）——大綱未提，建議納入安全段落。

---

## 總結（需修正優先序）

1. **第 4 篇最嚴重**：checkpoint ≠ git commit，核心框架需重寫；`/undo` 是 `/rewind` 別名；`--spawn worktree` 疑似不存在。
2. **第 5 篇**：「不支援 Brave/Arc」已過時（現行文件偵測支援）；beta 標示存疑；擴充套件 ID 待確認。
3. **第 1 篇**：Shift+Down 不存在，改方向鍵+Enter。
4. **第 3 篇**：v2.1.80+ 版本號無法驗證。
5. **第 2 篇**：CLAUDE.md <200 行無官方依據；Pro/Max/Team 預設已是 auto mode。
6. 六篇參考資料 URL 全面改用 code.claude.com/docs 新網域。
