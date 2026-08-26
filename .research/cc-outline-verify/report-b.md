# Claude Code 文章大綱事實查證報告（report-b）

查證日期：2026-08-25
對照來源：code.claude.com/docs（官方現行文件；docs.anthropic.com/en/docs/claude-code 已遷移至 code.claude.com/docs，舊連結會 redirect 但建議更新）
核對頁面：/docs/en/memory、/docs/en/costs、/docs/en/context-window、/docs/en/model-config、/docs/en/devcontainer、/docs/en/sandboxing、/docs/en/headless、/docs/en/cli-reference、/docs/en/mcp、/docs/en/plugins-reference

通用問題（適用所有 6 篇）：
- 參考資料區的 `https://docs.anthropic.com/en/docs/claude-code/*` 連結全部已遷移到 `https://code.claude.com/docs/en/*`。舊網域會 redirect，不算壞鏈，但建議批次改新網域。

---

## 7. 2026-03-28-claude-code-claude-md-agents-md-guide.md

- 【正確】CLAUDE.md 放 repo 根目錄（`./CLAUDE.md` 或 `./.claude/CLAUDE.md`），session 開始自動載入 — https://code.claude.com/docs/en/memory
- 【正確】`~/.claude/CLAUDE.md` 為 user 全域層級；另有 managed policy 層級（macOS `/Library/Application Support/ClaudeCode/CLAUDE.md` 等）與 `CLAUDE.local.md`，大綱可補充
- 【過時：應為「串接而非覆蓋」】「繼承與覆蓋的優先序」——官方明載所有找到的 CLAUDE.md 是 **concatenated into context rather than overriding each other**，順序由檔案系統根往下到工作目錄（越近工作目錄越後讀），不是互相覆蓋 — https://code.claude.com/docs/en/memory#how-claude-md-files-load
- 【過時：應為…】「AGENTS.md 是給子代理（sub-agent）的任務範本」——**這是本篇最大的事實錯誤**。官方明載：「Claude Code reads CLAUDE.md, not AGENTS.md」。AGENTS.md 是跨工具的通用 agent 指引規範，Claude Code 要透過 `@AGENTS.md` import 或 symlink 讀取；它與 sub-agent 無關。sub-agent 的定義檔是 `.claude/agents/*.md`。tldr 與 description 也有同樣錯誤，需一併改寫 — https://code.claude.com/docs/en/memory#agentsmd
- 【正確】200 行內建議、4 MiB 硬上限（超過整檔跳過）、`.claude/rules/` path-scoped rules 按需載入、`claudeMdExcludes` 設定皆存在 — https://code.claude.com/docs/en/memory
- 【存疑】參考資料「OpenAI — AGENTS.md 規範」指向 `github.com/openai/openai-agents-python`（OpenAI Agents SDK 的 Python repo），不是 AGENTS.md 規範本身；規範在 https://agents.md 。建議改連結。
- 【過時：應為新網域】參考資料 7 條全是 docs.anthropic.com 舊網域。

## 8. 2026-03-28-claude-code-context-window-management.md

- 【正確】CLAUDE.md 建議 200 行內、硬上限 4 MiB 超過整檔跳過 — https://code.claude.com/docs/en/memory#write-effective-instructions / #my-claude-md-is-too-large
- 【正確】根目錄與上層 CLAUDE.md 每次 session 載入；子目錄的 CLAUDE.md 在讀到該目錄檔案時才載入 — https://code.claude.com/docs/en/memory
- 【正確】`.claude/rules/` path-scoped rules 在讀到符合 pattern 的檔案時觸發，「not on every tool use」— https://code.claude.com/docs/en/memory#path-specific-rules
- 【正確（可解除原「待確認」）】`disable-model-invocation: true` 欄位存在且行為如大綱所述：帶此 frontmatter 的 skill 不進啟動 skill index，完全不出現在 context，直到以 `/name` 手動呼叫 — https://code.claude.com/docs/en/context-window（skill descriptions 條目）及 /docs/en/skills
- 【正確】MCP tool schemas 預設 deferred，只載 tool names，需要時經 tool search 載入 — https://code.claude.com/docs/en/mcp#scale-with-mcp-tool-search 、/docs/en/costs
- 【正確（含但書）】Hooks 本身零 context；但官方明載 hook 經 `hookSpecificOutput.additionalContext` 回注的內容會進 context，exit 0 的 plain stdout 不會——大綱括號裡的「待確認」描述與官方一致，可改為確定句 — https://code.claude.com/docs/en/context-window（Hook: prettier 條目）
- 【過時：應為…】「95% 門檻與 `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE`」——兩者皆未見於現行官方文件。現行機制是：預設在接近模型 context 上限時 compaction；門檻可用 `/autocompact <tokens>`、settings 的 `autoCompactWindow`、CLI `--autocompact`、env `CLAUDE_CODE_AUTO_COMPACT_WINDOW` 設定（100K–1M）。Sonnet 5 預設約 967K 觸發 — https://code.claude.com/docs/en/model-config#set-the-auto-compact-window 、/docs/en/context-window
- 【無法驗證】「Sub-agents 也支援 auto-compaction」——官方文件未提及此主張。
- 【正確】Sub-agent 完全獨立 context，只回傳摘要；Agent Teams 每 teammate 獨立 context window — https://code.claude.com/docs/en/sub-agents 、/docs/en/costs#agent-team-token-costs
- 【小補充】skill descriptions 清單在 `/compact` 後不會重新注入（只有實際叫用過的 skill body 會保留，每 skill 上限 5,000 tokens）——若文章談 compaction 可提 — https://code.claude.com/docs/en/context-window
- 【過時：應為新網域】多數參考資料仍用 docs.anthropic.com 舊網域。

## 9. 2026-03-28-claude-code-devcontainer-sandboxing.md

DevContainer 部分：
- 【正確】devcontainer.json + Dev Container Feature（`ghcr.io/anthropics/devcontainer-features/claude-code:1.0`）、GitHub Codespaces、本地 VS Code + Docker、auth/PATH/MCP 特殊考量皆有官方說明 — https://code.claude.com/docs/en/devcontainer
- 【正確】`--dangerously-skip-permissions` 在容器中以 non-root 使用者執行的安全機制；root 會被 CLI 拒絕該 flag — https://code.claude.com/docs/en/devcontainer#run-without-permission-prompts
- 【正確】server-managed settings 強制政策、`permissions.disableBypassPermissionsMode: "disable"` 禁用 bypass、防火牆限制 egress（reference container 的 init-firewall.sh + NET_ADMIN/NET_RAW）— 同上

Sandboxing 部分：
- 【過時：應更精確】「檔案系統限制：只能存取工作目錄」——實際是：**寫入**僅限工作目錄 + session temp 目錄；**讀取**預設整台電腦可讀（除 denied 路徑，含 ~/.aws/credentials、~/.ssh，需另用 sandbox.credentials 或 denyRead 擋）。照原稿寫會誤導 — https://code.claude.com/docs/en/sandboxing#filesystem-isolation
- 【過時：應為 proxy allowlist】「網路限制：`--network none`」——`--network none` 未出現在現行官方文件。現行機制是 sandbox 外部的 proxy + domain allowlist（`sandbox.network.allowedDomains`、首次連線詢問、WebFetch(domain:...) rules）；devcontainer 的 egress 限制是用 init-firewall.sh 防火牆腳本 — https://code.claude.com/docs/en/sandboxing#network-isolation
- 【過時：應為 /sandbox 與 settings.json】「`--sandbox` / `--no-sandbox` flag」——CLI reference 中沒有這兩個 flag。現行入口是互動式 `/sandbox` panel 與 settings.json 的 `sandbox.enabled`（managed settings 可強制）— https://code.claude.com/docs/en/cli-reference 、/docs/en/sandboxing#get-started
- 【正確】安全等級組合表中的模式名稱（default / auto mode / bypassPermissions）皆存在；星級評比屬編輯判斷不驗證。auto mode 有 classifier 審查 — https://code.claude.com/docs/en/sandboxing#sandbox-modes 、/docs/en/permission-modes
- 【過時：應為新網域】參考資料第 1、2、6、7 條為 docs.anthropic.com 舊網域；其中「settings#sandbox-settings」應改指 https://code.claude.com/docs/en/settings-reference#sandbox-settings 。

## 10. 2026-03-28-claude-code-headless-mode-guide.md

- 【正確】`claude -p "prompt"` 非互動執行、pipe stdin（上限 10MB）、exit code 語意 — https://code.claude.com/docs/en/headless
- 【正確】`--bare` 跳過 hooks、skills、custom commands、subagents、plugins、MCP servers、auto memory、CLAUDE.md 自動探索；官方明言 bare mode 是 scripted/SDK 呼叫的建議模式，未來將成為 `-p` 預設 — 同上 #start-faster-with-bare-mode
- 【正確】bare mode 手動指定 context 的四個旗標（`--append-system-prompt`、`--settings <file>`、`--mcp-config <file>`、`--agents <json>`）全在官方表格中 — 同上
- 【小補充】bare mode 不讀 OAuth/keychain，需設 `ANTHROPIC_API_KEY`（或 --settings 內 apiKeyHelper）——大綱未提，CI/CD 段落建議補 — 同上
- 【正確】`--output-format json` 含 result、session ID、metadata；`--json-schema` 搭配 json 格式輸出到 `structured_output` 欄位（範例與官方幾乎逐字相同）— 同上 #get-structured-output
- 【正確】`stream-json` + `--verbose` + `--include-partial-messages`、每行一個 JSON event、jq 過濾 text delta（jq `-rj` 範例也在官方文件）— 同上 #stream-responses
- 【正確】permission rule syntax `Bash(git diff *)`：空格 + 星號 = prefix matching，缺空格會誤 match `git diff-index` —— 大綱描述正確 — 同上 #auto-approve-tools
- 【正確】`--continue` 繼續最近對話；`session_id=$(... | jq -r '.session_id')` + `--resume "$session_id"` 範例與官方完全一致 — 同上 #continue-conversations
- 【正確】Agent SDK（Python/TypeScript）提供 structured output、tool approval callbacks、native message objects — 同上開頭
- 【過時：應為新網域】參考資料 6 條 docs.anthropic.com 舊網域（cli-reference、programmatic-usage、permissions 等）。其中「programmatic-usage」頁已併入 headless 頁。

結論：本篇大綱事務性主張全數正確，僅網域待更新。

## 11. 2026-03-28-claude-code-mcp-server-integration.md

- 【過時：應為 .mcp.json / ~/.claude.json】「settings.json 中的 mcpServers 欄位」——MCP servers 不是設定在 settings.json。三種 scope：local（預設，存 `~/.claude.json`）、project（repo 根目錄 `.mcp.json`，入版控）、user（`~/.claude.json`）；企業集中管理用 managed configuration；plugin 用 plugin root 的 `.mcp.json` 或 plugin.json inline — https://code.claude.com/docs/en/mcp#mcp-installation-scopes
- 【正確但建議補充】stdio vs HTTP transport：stdio（本地 process，`claude mcp add ... -- command`）、HTTP（`--transport http`，遠端建議選項）、SSE（`--transport sse`，**已 deprecated**，官方建議改 HTTP）、WebSocket（僅 JSON 設定，`--transport` 不接受 ws）——大綱只列 stdio vs HTTP，寫作時應涵蓋 SSE deprecation 與 ws — https://code.claude.com/docs/en/mcp#installing-mcp-servers
- 【正確】`claude mcp add` / `add-json` / `list` / `get` / `remove`、`--scope`、`--env`、`--header`、環境變數展開 `${VAR}` / `${VAR:-default}` — 同上
- 【正確】Managed MCP Configuration 存在（企業集中管理）— https://code.claude.com/docs/en/mcp#managed-mcp-configuration
- 【正確（主題層級）】--dangerously-skip-permissions 對 MCP 的影響：bypassPermissions 下 `.mcp.json` server approval prompt 也被跳過（除非 skipDangerousModePermissionPrompt 相關設定），可作為安全段落素材 — https://code.claude.com/docs/en/mcp#project-scope
- 【正確】GitHub / Slack / DB MCP server 案例、TypeScript/Python SDK、MCP Inspector 連結皆合理存在
- 【過時：應為新網域】參考資料第 1、7 條為 docs.anthropic.com 舊網域。

## 12. 2026-03-28-claude-code-plugins-marketplaces-guide.md

Plugin 結構：
- 【正確】`.claude-plugin/plugin.json` manifest（name 為唯一必填欄位；manifest 可省略，省略時 auto-discover）、`commands/`、`skills/`（SKILL.md）、`agents/`、`hooks/hooks.json`（或 plugin.json inline）、`.mcp.json`、`.lsp.json` — https://code.claude.com/docs/en/plugins-reference
- 【存疑：官方未列此元件】「settings.json # 預設設定」——plugins-reference 的元件清單（skills、commands、agents、hooks、MCP、LSP、monitors、themes、output-styles）中沒有 plugin root 放 settings.json 提供預設設定的機制。plugin.json schema 也沒有對應欄位。建議刪除此行或先向官方再確認。
- 【正確】命名空間：plugin 元件以 `<plugin-name>:<component-name>` scope（如 `my-plugin:code-reviewer`）；skills 建立 `/name` shortcuts — https://code.claude.com/docs/en/plugins-reference#agents （scoped name 示例）
- 【正確】`--plugin-dir` 本地測試、`/reload-plugins` 熱載入 — https://code.claude.com/docs/en/headless（bare mode 表格）、/docs/en/mcp#plugin-provided-mcp-servers
- 【正確】Marketplace = 含多個 plugin 的 repo；`/plugin install`、marketplace add；enabledPlugins / extraKnownMarketplaces 設定欄位存在 — https://code.claude.com/docs/en/plugin-marketplaces 、/docs/en/settings-reference
- 【無法驗證】「提交到官方 Marketplace」——官方 marketplace repo（anthropics/claude-plugins-official）存在，但提交審核流程未在本次核對頁面中查到明文程序。
- 【正確】「Plugin agents 不支援 hooks、mcpServers、permissionMode」——與官方逐字吻合（"For security reasons, hooks, mcpServers, and permissionMode are not supported for plugin-shipped agents"）— https://code.claude.com/docs/en/plugins-reference#agents
- 【可補充】plugin 還支援 monitors、themes（experimental）、output-styles、userConfig、dependencies（含 semver）、`${CLAUDE_PLUGIN_ROOT}` / `${CLAUDE_PLUGIN_DATA}` 路徑替換 — plugins-reference
- 【過時：應為新網域】參考資料 7 條全是 docs.anthropic.com 舊網域。

---

### 摘要統計

| # | 文章 | 主要問題 |
|---|------|---------|
| 7 | claude-md-agents-md-guide | AGENTS.md 定義根本錯誤（不是子代理任務範本）；「覆蓋」應為「串接」；openai repo 連結錯置 |
| 8 | context-window-management | 95% 門檻與 CLAUDE_AUTOCOMPACT_PCT_OVERRIDE 查無（應改 autoCompactWindow 機制）；disable-model-invocation 已證實存在；subagent auto-compaction 查無 |
| 9 | devcontainer-sandboxing | `--network none`、`--sandbox`/`--no-sandbox` 皆非現行機制；「只能存取工作目錄」漏了讀取預設全開 |
| 10 | headless-mode-guide | 全對（僅舊網域參考資料） |
| 11 | mcp-server-integration | mcpServers 不在 settings.json（應為 .mcp.json / ~/.claude.json）；SSE 已 deprecated |
| 12 | plugins-marketplaces-guide | 「plugin root 放 settings.json 預設設定」查無；「提交官方 Marketplace」流程查無；其餘結構主張正確 |
