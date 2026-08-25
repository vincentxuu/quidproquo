# Claude Code 系列寫作聖經（Agent 必讀）

> 任何 agent 要動 `src/content/posts/tech/deep-dive/` 的 Claude Code 系列（含 troubleshooting 合集）之前，先讀完這份。最後更新：2026-08-25。

## 一、系列現狀

- **34 檔空殼大綱**（17 主題 × 中英），位於：
  - `src/content/posts/tech/deep-dive/2026-03-2[678]-claude-code-*.md`
  - `src/content/posts/tech/2026-03-28-claude-code-troubleshooting-collection{,-en}.md`
- 全部 `draft: true`，正文只有「## 預計大綱」＋ `<!-- TODO: 待撰寫 -->`。
- 大綱已完成事實查證與修正（2026-08-25），報告在 `.research/cc-outline-verify/report-{a,b,c}.md`（不入版控）。
- 寫作任務＝把大綱展開成正文，中英文都要寫，保持章節結構一致。

## 二、權威來源（依優先序）

| 優先 | 來源 | 用途 |
|------|------|------|
| 1 | https://code.claude.com/docs/en/* | Claude Code 官方文件，唯一規範性來源 |
| 1b | https://code.claude.com/docs/llms.txt | 官方完整文件索引（~180 頁），盤點主題用 |
| 2 | https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md | 每版 CLI 變更，版本號第一手 |
| 3 | https://code.claude.com/docs/en/changelog 與 whats-new 週報（W13–W34+） | 功能時間線 |
| 4 | https://platform.claude.com/docs/en/release-notes/overview | 平台／模型／SDK 級變化 |
| 5 | https://support.claude.com/en/articles/12138966-release-notes | Claude Apps（claude.ai/Cowork）更新 |
| 6 | https://academy.claude.com/products/code | 官方課程結構（教學切分參考）；官方 blog 深度文入口 |
| 7 | github.com/anthropics：skills、claude-code、claude-cookbooks、claude-plugins-official、prompt-eng-interactive-tutorial、claude-agent-sdk-python/typescript | 官方庫與範例 |
| 8 | anthropic.com/news（發佈第一手）、/engineering（工程博客）、status.anthropic.com、@claude_code（X）、官方 Discord | 公告與狀態 |

**鐵律**：版本號、指令旗標、plan 限制一律查上述來源，不憑記憶寫；查不到就刪掉或標「待確認」，不猜。

## 三、已查證的關鍵事實（寫作時不可回退）

### 機制類
- **Checkpointing 不是 git commit**——是內建 snapshot 機制：每個 user prompt 一個、保留最近 100 個、30 天清除、不出現在 git 歷史、非版控替代品。bash 變更不追蹤、subagent 編輯不 restore、symlink 跳過。
- `/undo`、`/checkpoint` 都是 `/rewind` 的別名；rewind menu 有五個選項。
- CLAUDE.md 各層是**串接進 context**（concatenated），不是繼承覆蓋。
- **AGENTS.md 是跨工具規範**，Claude Code 只讀 CLAUDE.md；要用 `@AGENTS.md` import 或 symlink。sub-agent 定義在 `.claude/agents/*.md`。
- MCP server 設定**不在 settings.json**：project `.mcp.json`／user・local `~/.claude.json`／managed config；SSE transport 已 deprecated。
- Sandbox：`--sandbox`／`--no-sandbox` 旗標不存在，用 `/sandbox` panel ＋ `sandbox.enabled`；網路隔離走 sandbox proxy allowlist（`sandbox.network.allowedDomains`）。檔案系統：寫入限工作目錄＋session temp，**讀取預設整機可讀**。
- settings.json：`allowedTools/disallowedTools` 已被 `permissions.allow/deny/ask` 取代；有第四層 managed-settings.json；清單型 key 是跨層 merge。優先序最高是 Managed settings。
- Auto-compaction：`/autocompact`、`autoCompactWindow`、`CLAUDE_CODE_AUTO_COMPACT_WINDOW`（100K–1M）。Sub-agent auto-compaction 無官方依據，不要寫。

### 多代理生態
- Sub-agents：Explore 不再固定 Haiku（v2.1.198 起繼承主對話模型）；Bash 不在內建 agent 清單；`/agents` 互動精靈已移除。
- Agent Teams：方向鍵選取＋Enter 切換 teammate（沒有 Shift+Down）；點對點傳訊，**無 broadcast**；teammateMode 有 `"iterm2"`（v2.1.186+）與 `"in-process"`。
- 官方多代理全貌：subagents／agent view／agent teams／dynamic workflows／cross-session messaging／worktrees（見 llms.txt 對應頁）。

### 版本與 plan
- Channels 不標版本號需求（v2.1.80+ 查無官方依據，已移除）；channel plugins 需要 Bun。
- Chrome 整合：正式支援 Chrome/Edge，Brave/Arc/Vivaldi/Opera 會偵測擴充套件連線；Web Store ID `fcoeoabgfenejglbffodgkkbkcdhcgfn`。
- Slack 整合：Team/Enterprise 版本退役改推 **Claude Tag**（獨立產品線）；Marketplace app ID `A08SF47R6P4`；Pro/Max 仍是原路徑。
- Remote Control／Routines：Routines 是雲端排程；scheduled-tasks 是本地 `/loop`+cron；`--spawn` 三值含 `session`；Team/Enterprise 需 Owner 開啟。
- 排程三兄弟：Routines（雲端，可由 API/GitHub 事件觸發）、Desktop scheduled tasks（本機）、`/loop`（session 內）。
- 模型家族現狀：**Fable 5 / Opus 5 / Sonnet 5 / Haiku 4.5**；Opus 5 自 W30 起為預設 Opus，Sonnet 5 自 W27 起為預設模型。寫到模型名一律用這組。

### 產品邊界（不要混寫）
- Claude Code（code.claude.com/docs）≠ Claude Platform API（platform.claude.com/docs）≠ Managed Agents（平台級全託管 agent 基礎設施）≠ Claude Tag（Slack 產品線）。
- Headless 頁現在定位就是 **Agent SDK 入口**（CLI `-p` → Python/TS SDK）。

## 四、URL 遷移對照

所有 `docs.anthropic.com/en/docs/claude-code/*` → `code.claude.com/docs/en/*`。三條非單純換網域：

| 舊 | 新 |
|----|----|
| `.../environment-variables` | `/docs/en/env-vars` |
| `.../programmatic-usage` | `/docs/en/headless` |
| `.../mcp#mcp-installation-scopes` | `/docs/en/mcp#installing-mcp-servers` |

新文章直接引新網域；遇到舊連結順手換掉。

## 五、主題重構藍圖（2026-08-25 盤點）

現有 17 主題 → 重構為 8 叢集：

```
A. 核心運作   how-claude-code-works / .claude 目錄 / sessions 管理 / checkpointing
B. 設定與權限 settings.json / permissions+permission modes+auto mode / terminal config
C. Context    CLAUDE.md+memory(auto memory)+imports / context window / prompt caching
D. 擴充       skills / hooks / MCP / sub-agents / plugins+marketplaces
E. 自動化     headless→Agent SDK / GitHub Actions(+GitLab) / channels / routines+排程 / goal
F. 多代理     agent teams / agent view / dynamic workflows / worktrees / cross-session messaging
G. Surface    Chrome / computer use / Slack+Claude Tag / remote control+web+mobile / desktop / IDE
H. 營運       costs+analytics / OTel monitoring / 企業部署子系列(managed settings/gateways/self-hosted) / troubleshooting 三篇(安裝/執行/設定診斷)
```

拆分：DevContainer+Sandboxing → B/H 各自歸位；CLAUDE.md 篇 → C 的 Memory 體系篇；Headless → E 的 Agent SDK 篇；Troubleshooting → H 拆三篇。

新增候選（高價值）：Hooks、Permissions/auto mode、Sessions、排程自動化、成本管理、Desktop 多 surface。

## 六、工作流程

1. 動筆前先抓該篇對應的官方文件頁（llms.txt 找路徑），逐條核對大綱。
2. 展開正文：中文精寫，英文同步翻譯（章節一一對應，不允許分岔超過一輪）。
3. 文末必備 `## 參考資料`（≥1 官方來源，全部新網域）＋`## 更新紀錄`。
4. 正文每個主張最多一個數字、但書不堆疊（站上語域規範，見 post skill writing-guide）。
5. 完成後跑：`pnpm check:references && pnpm lint && pnpm astro check`，最後 `pnpm verify`。
6. 發佈要使用者明確說了才算；預設維持 `draft: true`。
7. commit 格式：`post(tech): <描述>`；不改 slug、不改 frontmatter date。
