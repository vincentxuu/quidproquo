# Content Plan：Claude Code 深入介紹系列 v2 主題重構

> 2026-08-25 規劃。依據：`code.claude.com/docs` 全索引（llms.txt）、whats-new W13–W34、大綱查證報告（`.research/cc-outline-verify/`）、Academy 課程結構、platform.claude.com 邊界確認。寫作前必讀 `docs/claude-code-series-guide.md`。
> 原則：既有空殼保留檔名身份（slug 不動、只改內容方向）；拆分與新增用新檔；全系列中英雙語同步；每篇完成才翻 `draft: false`。

## 系列命名

- 中文：**Claude Code 深入介紹**
- 英文：**Claude Code Deep Dives**

## 叢集 A：核心運作

| # | 主題 | 檔案處理 | 大綱要點 |
|---|------|----------|----------|
| A1 | Claude Code 如何運作：agentic loop 與內建工具 | **新增** `claude-code-how-it-works` | agent loop、tools reference 重點、與一般 chatbot 差異；讀者地圖篇，系列入口。**最早批次寫**（入口篇先立，後續每篇挂導覽連結）；開頭與已發佈的 `2026-03-31-claude-code-overview`（選型角度）分工互鏈，避免混淆系列入口 |
| A2 | `.claude` 目錄完全導覽 | **新增** `claude-code-claude-directory` | 專案 `.claude/` 與家目錄 `~/.claude/` 各檔職責：settings、rules、skills、agents、commands、workflows、auto memory。緊隨 A1 |
| A3 | Sessions 管理：continue、resume、branch | **新增** `claude-code-sessions-guide` | `--continue`/`--resume`/`--from-pr`、`/resume` picker、session 命名、transcript 匯出與存放位置 |
| A4 | Checkpointing：rewind 與 session state | **既有骨架** `checkpointing-guide`（已修正） | snapshot 機制（100 個/30 天）、rewind menu 五選項、bash 不追蹤等限制 |
| A5 | 實戰工作流與最佳實踐 | **既有骨架** `best-practices-workflows`（已修正） | plan→implement→review 循環、prompt 技巧、常見工作流；引用 common-workflows／best-practices／prompt-library |

## 叢集 B：設定與權限

| # | 主題 | 檔案處理 | 大綱要點 |
|---|------|----------|----------|
| B1 | settings.json 設定大全 | **既有骨架** `settings-json-guide`（已修正） | 四層合併規則、permissions.allow/deny/ask、settings-reference 全欄位索引 |
| B2 | Permissions 與 auto mode：讓 Claude 自主到什麼程度 | **新增** `claude-code-permissions-auto-mode` | 四種 permission mode、Shift+Tab 切換、auto mode 分類器與 hard deny、組織層 trust config（auto-mode-config） |
| B3 | CLAUDE.md 與 Memory 體系 | **既有骨架** `claude-md-agents-md-guide` 改題聚焦 memory | CLAUDE.md 層級串接、imports、auto memory、`.claude/rules/` 條件載入、monorepo nested CLAUDE.md（承接官方 large-codebases 要點）；AGENTS.md 降為一節（跨工具 import/symlink），**解法細節互鏈已發佈的 symlink 文，不重講** |
| ~~B4~~ | 終端機體驗設定 | **移出本輪**：官方頁面薄、需求未證實；output styles 要點併入 A5 一節即可 | — |

## 叢集 C：Context 管理

| # | 主題 | 檔案處理 | 大綱要點 |
|---|------|----------|----------|
| C1 | Context Window 管理 | **既有骨架** `context-window-management`（已修正） | 自動載入順序、各功能 context 成本表、compaction 三件套（`/compact`/`/autocompact`/`autoCompactWindow`） |
| C2 | Prompt caching 為什麼重要 | **新增（P1）** `claude-code-prompt-caching` | 快取命中機制、換模型觸發未快取回合、CLAUDE.md 改動不即時生效的原因、cache hit rate 查看。解釋的是最高頻日常困惑，升 P1 |

## 叢集 D：擴充機制

| # | 主題 | 檔案處理 | 大綱要點 |
|---|------|----------|----------|
| D1 | Hooks 進階參考：schema、exit code 與非同步模式 | **差異化改題**（站上已有已發佈的 `2026-03-27-claude-code-hooks-guide` 概念指南與 `2026-03-26-hooks-skills-agents-md` 入門視角） | 聚焦 hooks-reference 層級：完整設定 schema、exit code 語意、async/HTTP/prompt hooks、MCP tool hooks；開頭互鏈舊文並定位「進階參考」，入門概念不重講 |
| D2 | Skills 與自訂指令 | **互鏈不重寫**：站上已有 `2026-03-27-claude-code-skill-design-guide`（已發佈），本篇僅在系列導覽連結 |
| D3 | MCP Server 整合 | **既有骨架** `mcp-server-integration`（已修正） | 三種 scope（`.mcp.json`／`~/.claude.json`／managed）、transport 現狀（SSE deprecated）、`claude mcp add/login` |
| D4 | Sub-agents：獨立 context 的專業助手 | **既有骨架** `sub-agent-parallel-execution`（已修正） | frontmatter schema、委派機制、背景執行、巢狀 spawn、permission 繼承 |
| D5 | Plugins 與 Marketplaces | **既有骨架** `plugins-marketplaces-guide`（已修正） | plugin 結構、`${CLAUDE_PLUGIN_ROOT}`、marketplace 發佈、dependencies 版本約束 |

## 叢集 E：自動化

| # | 主題 | 檔案處理 | 大綱要點 |
|---|------|----------|----------|
| E1 | Headless 與 Agent SDK：從 `claude -p` 到程式化 agent | **既有骨架** `headless-mode-guide` 改題擴充 | **硬約束：正文以 `-p` CLI 為主體（≥60%）**，SDK 只講「什麼時候該離開 CLI」（session、streaming、structured output、custom tools 概覽），深水區指向官方 SDK 章節，不做半套文件翻譯 |
| E2 | GitHub Actions 與 GitLab CI/CD | **既有骨架** `ci-cd-github-actions` 擴充 | @claude 觸發、`/install-github-app`、Bedrock/Vertex/Foundry 後端、GitLab MR。**Code Review 拆出**（見 E2b） |
| E2b | GitHub Code Review 與 ultrareview | **新增（P2）** `claude-code-code-review` | multi-agent PR 審查、`/code-review ultra`；官方自成一頁且主題獨立 |
| E3 | Channels：把外部事件推進 session | **既有骨架** `channels-guide`（已修正） | channel contract、reply tools、sender gating、channel plugins 需 Bun |
| E4 | ~~排程自動化~~ **取消獨立篇**：站上已有已發佈的 `2026-05-09-claude-code-scheduled-tasks-guide`（Routines 三種觸發＋與 Desktop scheduled tasks／`/loop` 差異），與原構想幾乎重複 | **互鏈不重寫**；goal mode 若要寫併入 A5 或 H 叢集小節 | — |

## 叢集 F：多代理

| # | 主題 | 檔案處理 | 大綱要點 |
|---|------|----------|----------|
| F1 | 多代理全景：subagents、agent view、teams、workflows 怎麼選 | **新增** `claude-code-multi-agent-overview` | 官方 agents.md 四方式比較表為骨架；本叢集閱讀路徑入口；**worktree 隔離策略併入本篇一節**（不獨立成篇，收斂工作量） |
| F2 | Agent Teams | **既有骨架** `agent-teams-guide`（已修正） | Team Lead+Teammates、點對點傳訊、teammateMode、任務板管理 |
| F3 | Agent View：一個螢幕管所有 session | **新增** `claude-code-agent-view` | dispatch、狀態監控、需要輸入的提醒；含 cross-session messaging（同機與跨機傳訊） |
| F4 | Dynamic Workflows：腳本化編排大量 subagents | **新增** `claude-code-dynamic-workflows` | Claude 寫腳本你可重跑；適用 codebase audit／大遷移／交叉查證研究。**大綱寫死互鏈**站上 harness-engineering 系列 |
| ~~F5~~ Worktrees | 併入 F1 一節，取消獨立篇 | — | — |

## 叢集 G：Surface 整合（收斂後僅保留 G1/G3）

| # | 主題 | 檔案處理 | 大綱要點 |
|---|------|----------|----------|
| G1 | Chrome 整合與瀏覽器自動化 | **既有骨架** `chrome-integration`（已修正） | GA 現狀、Chrome/Edge＋Chromium 偵測、console 抓 log、表單填寫 |
| G3 | Slack 與 Claude Tag | **既有骨架** `slack-integration` 擴充 | 原 Slack 整合（Pro/Max 路徑）＋Team/Enterprise 退役改推 Claude Tag；兩條設置並列 |
| （延後） | Computer use、Desktop app、Remote Control 跨裝置疑雲端部分、IDE 整合、terminal config、artifacts/deep-links | **全部移出本輪**：產品 tour 類內容 UI 迭代快、保養成本高、官方頁面薄 | 待 A–E、H 完成、或出現明確搜尋需求再立。Remote Control 骨架仍保留展開（屬既有 24 檔），但雲端 web/mobile 擴充暫緩 |

## 叢集 H：安全與營運

| # | 主題 | 檔案處理 | 大綱要點 |
|---|------|----------|----------|
| H1 | Sandboxing 與安全執行環境 | **拆自** `devcontainer-sandboxing`：骨架改題為 sandboxing 專篇 | sandboxed Bash tool、sandbox runtime/devcontainer/Docker/VM 威脅模型比較、network allowlist |
| H2 | DevContainer 團隊標準化 | **新增** `claude-code-devcontainer`（原骨架剩餘內容歸此） | devcontainer.json 範例、CI 一致性、團隊 rollout |
| H3 | 成本、用量與模型設定 | **新增** `claude-code-costs-usage` | token 追蹤、`/usage`、**model config／effort／fast mode／advisor 一節**（讀者找「該用哪個模型」的系統性答案）、extended thinking 取捨、analytics dashboard |
| （取消） | ~~H4 OTel monitoring~~、~~H5 Security plugins~~ | **移出本輪**：官方頁面薄、需求未證實，待需求出現再立 | — |
| H6 | Troubleshooting：安裝與登入 | **拆自** troubleshooting 合集 | command not found、PATH、網路、auth；對應 troubleshoot-install |
| H7 | Troubleshooting：執行期問題 | **拆自** troubleshooting 合集 | CPU/記憶體、hang、autocompact thrashing、搜尋問題 |
| H8 | Troubleshooting：設定診斷與 error reference | **拆自** troubleshooting 合集 | `/doctor`、`/hooks`、`/mcp`、safe mode、常見錯誤訊息對照；原合集檔轉為三篇索引頁 |
| H9 | 企業部署 | **另開子系列**（不在本系列 order 內）：admin-setup、managed-settings/server-managed-settings、network-config/mTLS、LLM gateway 系列、self-hosted environments。待核心完成後另立 content-plan |

## 盤點結果（v2.1，依 review 修正）

- **既有 34 檔骨架的去向（逐檔算清）**：
  - 直接展開 17 組 zh+en＝34 檔中的 30 檔：A4/A5/B1/B3/C1/D3/D4/D5/E1/E2/E3/F2/G1/G3/G4/H6–H8 對應骨架（H6–H8 共用原合集 2 檔＋拆出新檔）
  - `devcontainer-sandboxing` 2 檔 → 拆成 H1（改寫骨架）＋H2（新檔）
  - troubleshooting 合集 2 檔 → H6/H7/H8 三篇共用素材，原檔轉索引
- **本輪實際寫作量**：既有展開 15 組 ＋ 新增 8 組（A1/A2/A3/B2/C2/D1 改題/E2b/F1/F3/F4 中 P1 部分）≈ **23–26 組 zh+en**
- **取消／延後**：E4 排程（已有已發佈文）、D1 改差異化改題、F5 併 F1、G 叢集僅留 G1/G3、B4/E5/G6/H4/H5 全部移出
- **優先序**：
  - **P0-1：A1 入口篇＋A2 目錄導覽**（入口先立）
  - **P0-2：既有骨架展開**，內部按 A→B→C→D→E→F→G→H 順序（讀者價值排序，非生產便利排序）
  - P1＝B2 Permissions/auto mode、A3 Sessions、C2 Prompt caching、F1 多代理全景、F4 Dynamic Workflows、F3 Agent View、H3 成本
  - P2＝E2b Code Review；其餘視需求
  - 延後＝G 擴充、選配篇、H9 子系列
- **執行節奏**：一次一叢集，中文先寫、英文緊跟（同一 PR）；每篇過 `pnpm verify` 才翻 draft。
- **互鏈寫死在大綱**：F4↔harness-engineering 系列、H1↔coding-agent sandbox 兩篇、B3↔symlink-agents-md 文、A1↔claude-code-overview——不靠作者臨場判斷。
