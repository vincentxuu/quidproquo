---
title: "九家 Coding Agent 怎麼記東西：從 CLAUDE.md 到 MemFS"
date: 2026-09-19
category: ai
type: deep-dive
tags: [agent-memory, coding-agent, claude-code, codex, antigravity-cli, cursor, copilot, devin, hermes-agent, openclaw, letta-code]
series:
  name: "AI Agent 記憶工程"
  order: 3
lang: zh-TW
tldr: "九家 coding agent 的長期記憶走了至少四條路：Claude Code 和 Codex 用 Markdown 檔（agent 寫、人可讀）、Antigravity CLI 繼承 Gemini CLI 的 inbox 核准（agent 提案、人拍板）、Copilot 用引用＋JIT 驗證（28 天沒被驗證就自動刪）。Cursor 把 Memories 拔掉退回純 Rules。Hermes Agent、OpenClaw、Letta Code 則把記憶當成 harness 的核心元件，不只是外掛。寫入時機、遺忘機制、跨團隊共享上的選擇完全不同，而且沒有任何一家公布過記憶功能的對照實驗數據。"
description: "比較 Claude Code、Codex、Antigravity CLI、Cursor、GitHub Copilot、Devin Desktop、Hermes Agent、OpenClaw、Letta Code 九家 coding agent 的長期記憶設計：指示檔層級、自動記憶寫入、遺忘機制、跨 session 共享與 prompt cache 的取捨。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-19-coding-agent-memory-comparison-en)

[上一篇](/posts/ai/2026-08-21-context-full-seven-answers)講的是 working memory——context 滿了怎麼麼辦。壓縮、剪枝、換手，全是在顧「這一次 session」。但下一次打開呢？

你昨天花三小時教 Claude Code 你們的 API 命名慣例、跟 Codex 解釋過部署流程、在 Cursor 裡標記了五條團隊規範——關掉 terminal，這些東西還在嗎？

這篇比較九家 coding agent 在長期記憶上的設計選擇。範圍限定在有公開文件的機制，不含平台 API（[下一篇](/posts/ai/2026-09-19-cloud-platform-memory-apis)）或開源框架。相較於上次調查的六家，這次新增了 Hermes Agent、OpenClaw、Letta Code 三個把記憶當成核心元件的 harness，也反映了 Gemini CLI 已於 2026-06-18 退役、由 Antigravity CLI 取代的現狀。

## 先看全貌：每家都有什麼

九家 coding agent 的記憶機制可以拆成三層：

1. **人寫的指示檔**（CLAUDE.md、AGENTS.md、Rules 等）——procedural memory，進 git、進 code review
2. **Agent 寫的記憶**（auto memory、Memories、Knowledge Suggestions）——semantic / episodic memory，跨 session 保留
3. **Session 記憶管理**（compaction、resume）——working memory 的延續

每家在這三層的投入程度差很大。以下逐家拆解。

## Claude Code（Anthropic）

Claude Code 的記憶設計最完整，也最明確地考慮了 prompt cache 的影響。

**指示檔：四層 CLAUDE.md**

依 [官方文件](https://code.claude.com/docs/en/memory) 的載入順序：

1. Managed policy（組織層級）
2. `~/.claude/CLAUDE.md`（全域個人）
3. `./CLAUDE.md` 或 `./.claude/CLAUDE.md`（專案）
4. `./CLAUDE.local.md`（gitignored，個人偏好）

祖先目錄在 session 開始時全部載入，子目錄的 CLAUDE.md 碰到才 JIT 載入。`@path` import 最深 4 層，`.claude/rules/*.md` 可用 frontmatter `paths` 做條件式載入。官方建議每份 < 200 行、超過 4 MiB 直接跳過。

2026 年新增了 **Managed Memory**（帳戶層級）：記憶不再綁定單一專案，而是可以跨專案保留專案架構和團隊編碼規範。

**Agent 寫的記憶：Auto memory**

路徑在 `~/.claude/projects/<project>/memory/`，結構是 `MEMORY.md` 當索引加上主題檔（frontmatter 標 `type: user | feedback | project | reference`）。

寫入時機：session 進行中 Claude 自行決定，也可以明確要求「記住這件事」。讀取：每次 session 開始注入 `MEMORY.md` 前 200 行或 25 KB，主題檔按需讀取。

關鍵限制：跨 session 有效（以 repo 為單位），但**不跨使用者、不跨團隊**（存本機），subagent 也不繼承（只有 fork 才會拿到）。

**記憶統一到 Chat 與 Cowork（2026-08-25）**

Anthropic 於 2026-08-25 統一了 Claude 的記憶系統。原先 chat 與 Claude Cowork 各有一套記憶，現在完全打通：

- 記憶改為**個別分類條目**（不再使用每日摘要）
- 條目在 session 中被 Claude 讀取和更新
- Opus 4.7 改進了 file-system memory 的長時間多 session 可靠性
- `claude /memory` 指令可檢視和管理所有記憶
- 舊版記憶匯出窗口於 2026-09-09 關閉

> 設計含義：Claude Code 選擇「session 開頭注入一次、session 中不變」的記憶策略，是為了 prompt cache 的穩定性。這個取捨在其他家看不到，因為其他家沒有公開過 cache 設計。

**Prompt cache 是記憶設計的硬約束**

依 [官方文件](https://code.claude.com/docs/en/prompt-caching)，Claude Code 的 prompt cache 分三層：

1. System prompt + tools + output style
2. 專案 context = CLAUDE.md + auto memory + unscoped rules
3. 對話本身

第二層只在 session 開始、`/clear`、`/compact` 時變動——這是刻意的。如果每一輪都動態注入新記憶，就會打破 cache 前綴，訂閱制的 1 小時 TTL 等於浪費。

**Compaction**

`/compact [指示]`，CLAUDE.md 裡可寫 `# Compact instructions` 客製摘要方向。壓縮後保留 system prompt、根 CLAUDE.md、unscoped rules、auto memory、plan，並重新讀最近改過的最多 5 個檔案。`/autocompact 500k` 可調閾值。

## Codex（OpenAI）

Codex 的記憶設計最有趣的地方在寫入時機——不是 session 進行中寫，是**結束後等 6 小時才寫**。

**指示檔：AGENTS.md**

依 [官方文件](https://learn.chatgpt.com/docs/agent-configuration/agents-md)：

- `~/.codex/AGENTS.override.md` → `~/.codex/AGENTS.md` → 專案從 git root 逐層串接到 cwd
- 越近的覆蓋越遠的
- `project_doc_max_bytes` 預設 32 KiB，超過靜默截斷（不會報錯）

**Agent 寫的記憶：Memories**

Memories 已從 preview 轉為 GA。依 [2026-04-16 公告](https://openai.com/index/codex-for-almost-everything) 與 [官方文件](https://learn.chatgpt.com/docs/customization/memories)，預設關閉（要在 config 設 `[features] memories = true`）。

寫入是兩階段的背景作業：

1. rollout 閒置 `min_rollout_idle_hours`（預設 6 小時，可設 1–48）後，逐 thread 抽取原始記憶
2. 全域整併（`max_raw_memories_for_consolidation` 預設 256 條）

儲存在本機 `~/.codex/memories/`，檔案布局依 [codex-rs/memories README](https://github.com/openai/codex/blob/main/codex-rs/memories/README.md)：`raw_memories.md`、`rollout_summaries/`（每個 rollout 一檔）、`MEMORY.md` 與 `memory_summary.md`（整併輸出）、`skills/`。

**2026 年重大改版**

2026-04-16 的「Codex for almost everything」大改版帶來了 computer use（macOS）、內建瀏覽器、gpt-image-1.5、persistent memory、scheduled agents、90+ plugins。2026-09-10 進一步升級，記憶更穩定且與 ChatGPT 資料 plugin 打通。社群也有 [記憶統一請求](https://community.openai.com/t/features-request-memory-unification-between-codex-and-chatgpt/1380684)（944 瀏覽），希望在 ChatGPT 和 Codex 之間共享記憶。

**遺忘機制**

依 [config reference](https://learn.chatgpt.com/docs/config-file/config-reference)：`max_unused_days` 預設 30（可設 0–365）、`max_rollout_age_days` 預設 30（0–90）。

> 設計哲學：Codex 選擇「等你做完再想」的寫入時機，避免 session 進行中的記憶抽取干擾推理。代價是即時性——你教它的東西最快 1 小時後才會被記住。

**與 Agents SDK sandbox memory 的關係**

Codex Memories 的檔案布局和 OpenAI Agents SDK 的 [sandbox memory](https://openai.github.io/openai-agents-python/sandbox/memory/) 是同一套。OpenAI 把「檔案即記憶」從消費端產品推到了開發者 SDK。

## Antigravity CLI（Google）

Gemini CLI 已於 2026-06-18 正式退役，由 **Antigravity CLI** 取代。這是 Google 在 I/O 2026（5/19）宣布的整合方案，將 Antigravity 2.0 平台的核心 agent harness 帶到終端機。

**記憶機制：繼承 Gemini CLI 的 inbox 核准路線**

Antigravity CLI 保留了 Gemini CLI 的核心開發者體驗結構，包括 skills 和 hooks。記憶系統沿用 Gemini CLI 的設計哲學：

- **指示檔路徑遷移**：全域從 `~/.gemini/skills/` 搬到 `~/.gemini/antigravity-cli/skills/`，專案從 `.gemini/skills/` 搬到 `.agents/skills/`
- **MCP 設定分離**：MCP servers 從偏好設定中拆出，獨立為輕量 JSON profiles
- **寫入核准**：與 Gemini CLI 一致，agent 提案 → inbox → 人核准才生效
- **自動導入轉換**：提供 migration command 序列和 first-launch onboarding，自動轉換舊設定

Antigravity CLI 是 Go 編譯的 multi-agent tool，支援 Agent Manager 進行多 agent 並行執行，與 Antigravity 2.0 IDE（VS Code fork）共用同一套 harness。

> 設計含義：Google 選擇「agent 提案、人核准」的路線並延續到 CLI 端。這在六家（現在九家）中仍然是對寫入權控制最嚴格的設計之一。代價是 inbox 可能堆積到被忽略。

## Cursor（Anysphere）

Cursor 的記憶故事是九家中最曲折的——它曾經有 Memories 功能，然後**整個拔掉了**。

**指示檔：Rules**

依 [官方文件](https://cursor.com/docs/rules)：

- `.cursor/rules/*.mdc`（有 `alwaysApply` / `globs` / `description` 三種模式）
- `~/.cursor/rules`（2.1 起支援全域）
- User Rules、Team Rules（dashboard 管理、可強制）
- 也讀 AGENTS.md
- 每條 ≤ 500 行

**Memories：從上線到移除**

時間線：

- 2025-06：Cursor 1.0 beta 推出 Memories（per-project、per-user）
- 2025 下半年：1.2 GA，加入背景產生記憶的核准流程
- 2025-11：**自 2.1.17 起移除**

[官方論壇工作人員回覆](https://forum.cursor.com/t/memories-not-showing/143820)：「The Memories feature was removed starting from version 2.1.17」，建議以 `Cmd+Shift+P` 匯出成 `.mdc` 併入 Rules。

> Cursor 的選擇耐人尋味：它不是記憶功能沒人用，而是決定讓 Rules 承擔長期記憶的角色。這把記憶的寫入權完全交回給人類。

**Automations memory**

依 [官方文件](https://cursor.com/docs/cloud-agents/automations)，Cursor 的雲端 Automations 有自己的記憶機制：具名檔（預設 `MEMORIES.md`）放在工作檔案系統之外，跨執行讀讀寫、預設開啟、UI 可編輯。文件明確附上 prompt injection 警語。

## GitHub Copilot（GitHub / Microsoft）

Copilot 的記憶設計最獨特的地方是**每條記憶都附引用（citation），並在讀取時做 JIT 驗證**。

**指示檔**

依 [官方文件](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions)：

- `.github/copilot-instructions.md`
- `.github/instructions/*.instructions.md`（有 `applyTo` 和 `excludeAgent`）
- 也讀 AGENTS.md / CLAUDE.md / GEMINI.md
- 優先序：個人 > repo > 組織

**Copilot Memory（GA）**

依 [2026-01-15 公告](https://github.blog/changelog/2026-01-15-agentic-memory-for-github-copilot-is-in-public-preview) 與 [概念文件](https://docs.github.com/en/copilot/concepts/agents/copilot-memory)：

- 兩種記憶：**repository-level facts**（有 repo 存取權者共享）和 **user-level preferences**
- GitHub 託管（不在本機），每條記憶附 citation
- 寫入：agent 執行中以 tool call 寫入；repo 記憶只能由有寫入權的貢獻者產生
- 讀取：session 開始注入近期 repo 記憶，並做 **JIT 驗證**——記憶引用的程式碼如果已經不存在，就不用（依 [工程部落格](https://github.blog/ai-and-ml/github-copilot/building-an-agentic-memory-system-for-github-copilot)）

**2026 年重要更新**

- **5/15**：Copilot Memory 擴充到 **user-level preferences**——不再只有 repo 層級。個人偏好可跨所有 repo 追隨使用者
- **6/1**：Usage-based billing 上線，Copilot code review 消耗 GitHub Actions minutes
- **9/2026**：多個模型將於 10/19 退役（Gemini 3.7 Flash、GPT-5.5、GPT-5.4、GPT-5 mini、Grok 4.5），GPT-5.2-Codex GA 跨 VS Code、Copilot Chat、Coding Agent、CLI
- Copilot SDK 進入技術預覽（Node.js/TypeScript、Python、Go、.NET）

**遺忘：28 天未驗證即刪**

使用（被 JIT 驗證確認還有效）會重置計時器。這是九家中唯一把遺忘跟「記憶還有沒有用」掛鉤的設計。

**公開數據**

依工程部落格，啟用 Memory 後：PR 合併率 83% → 90%、review 正評 75% → 77%（p < 0.00001）。這是九家中唯一公開 A/B 數據的。

**跨團隊共享**

Copilot Memory 是九家中唯一內建 repo 層級共享的。repo 記憶對所有有權限的貢獻者可見，個人偏好只有自己看到。可見可編輯：個人設定 → Memory；repo Settings > Copilot > Memory；組織政策控制開關。

## Devin Desktop（Cognition）

2026-06-02 Cognition [公告](https://cognition.com/blog/introducing-devin-desktop)「Devin Desktop — the next generation of Windsurf」，Windsurf 文件已併入 docs.devin.ai。

Devin 的記憶分三個獨立系統，覆蓋面比其他家廣但機制揭露最少。

**Memories（Cascade 層）**

依 [官方文件](https://docs.devin.ai/desktop/cascade/memories)：Cascade 自動建立 + 使用者顯式建立 + 手動編輯。存本機 `~/.codeium/windsurf/memories/`，workspace 專屬，不跨 workspace 也不跨團隊。自動記憶不扣 credit。檢索機制未公開。遺忘靠手動。

**Knowledge（組織層）**

依 [官方文件](https://docs.devin.ai/product-guides/knowledge)：每條 Knowledge = Trigger Description + Content（可加 `!macro`），走組織或企業 scope，可 pin 到特定 repo 或全部。

寫入有兩條路徑：手動建立，或 **Knowledge Suggestions**——Devin 從對話回饋自動建議，使用者核准才生效。另外 Repo Knowledge 會自動從 README、`.rules`、`.mdc`、`.cursorrules`、`.windsurf`、`CLAUDE.md`、`AGENTS.md` 匯入。

讀取是 trigger-based 檢索（機制未公開），pinned 的 Knowledge 永遠注入。沒有自動衰減，官方建議每週清理。

**Playbooks（procedural memory）**

`.devin.md` 格式的可重用組織 prompt，分成 Procedure / Specifications / Advice / Forbidden / Required from User 五類。Devin 可以從過去 session 自動生成 Playbook 候選——本質上是 procedural memory 的自動建立。

**DeepWiki（semantic memory）**

自動產生的 repo 文件，`.devin/wiki.json`（repo_notes ≤ 10,000 字元、頁數 30 / 企業 80）。更新週期未公開。

**Rules**

全域 `global_rules.md`（6,000 字元上限），`.devin/rules/*.md` 或 `.windsurf/rules/*.md`（每檔 12,000 字元）。有 always_on / model_decision / glob / manual 四種模式。AGENTS.md 放根目錄等同 always-on，放子目錄等同 glob-scoped。

## Hermes Agent（Nous Research）

Hermes Agent 是 Nous Research 於 2026-02-25 發布的開源 coding agent，定位是「自我進化的 agent」。它的記憶系統不是外掛，而是 harness 的核心元件。

**記憶架構：三層 + 多 Provider**

Hermes 使用 **三種記憶類型**：

1. **Persistent Memory**（`~/.hermes/memories/MEMORY.md`，~2,200 字元上限）：關於世界的筆記
2. **USER.md**（~1,375 字元上限）：關於使用者的筆記
3. **Skills**（程序性記憶）：完成複雜任務後自動寫入的技能文件

核心記憶（MEMORY.md + USER.md）總共約 1,300 tokens，永遠在 system prompt 中，成本固定每 session。Session Search（FTS5 全文檢索所有過去 session，SQLite 儲存）則是按需使用，約 20ms 查詢。

**寫入時機：主動學習迴圈**

Hermes 有個 consent-aware learning loop：

1. 每輪對話後，背景 self-improvement review 決定是否保存記憶或更新 skill
2. 重複的糾正和可持續的工作流程教訓會變成記憶條目或程序性 skills
3. `write_approval` 可以預先 staging 寫入，供人審核後才生效
4. 預設在 chat 中顯示 `💾 Memory updated` 提示

**Honcho 用戶建模**

Hermes 支援 Honcho dialectic user modeling——一個 AI-native 的跨 session 用戶建模系統，透過辯證推理（dialectic reasoning）逐步建立對使用者的深入理解。分層載入：L0（~100 tokens）→ L1（~2k）→ L2（完整）。

**多 Provider 架構**

Hermes 的記憶系統支援 plug-in 式 external providers：

| Provider | 特色 |
|---|---|
| **Honcho** | 跨 session 用戶建模，dialectic reasoning |
| **Byterover** | 記憶前壓縮（壓縮前先保存洞察），知識樹 |
| **Supermemory** | 知識圖譜，時間與多 session 推理，自動遺忘 |
| **Mem0** | 向量 + 圖搜尋 |

所有 provider 都是 native integration（不是 bolt-on script），共用 agent 的 lifecycle hooks。

**自動 Skill 創建**

當 agent 完成一個複雜任務（5+ tool calls）且結果良好時，Hermes 會自動將流程寫成 skill 文件。目前內建 85 個 skills（22 個類別），並會定期 grading 和 pruning 掉表現差的 skills。

> 設計哲學：Hermes 把記憶當成 harness 的第一類公民（first-class citizen），而不是一個可以隨時插拔的 plugin。記憶、skills、schedules、plugins 可以打包成一個 portable profile，在不同環境間遷移。

## OpenClaw

OpenClaw 是一個開源 terminal coding agent，以其模組化架構和記憶系統聞名。截至 2026 年，它已經歷了重大演進——2026-04-29 的 4.7 版本帶來 TaskFlow orchestration 和 provenance-rich memory，2026-08-31 的 2.0 版本（v2026.8.1）更是有 16,000+ PR、933 位貢獻者參與，是專案史上最大更新。

**記憶架構：檔案為主 + 證明標籤**

OpenClaw 的記憶系統建立在檔案（Markdown / YAML）之上，核心特點是 **provenance tracking**：每條記憶都標記「誰、什麼時候、從哪裡來」。這使得記憶可以在不同模型之間遷移——當你更換 provider 時，記憶仍在，因為它不綁定任何特定模型。

**Memory Wiki**

OpenClaw 2.0 引入了 **Memory Wiki**——一個將 durable knowledge 編譯成 provenance-rich wiki vault 的插件：

- 結構化 claims 附帶 evidence
- 支援 Obsidian-friendly workflows
- Dashboard 和 machine-readable digests
- Bridge mode 可以導出 artifacts 給其他系統
- 支援 import 來自 Codex、Claude Code、Hermes 的記憶

**Hybrid Search**

支援混合檢索（semantic + keyword），可配置 per-agent search 設定。`rememberAcrossConversations` 預設開啟（個人安裝），可以從其他私訊對話中提取相關上下文。

**記憶子 Agent**

OpenClaw 有一個 dedicated 的 memory sub-agent 負責互動式 session 中的記憶管理，以及 background dreaming 流程將短期回憶促進為長期記憶。

**Brain-Swappable 設計**

OpenClaw 的 provider manifest 允許 runtime 時替換模型大腦而不重建 workflow。這個設計哲學是：記憶應該獨立於模型存在。這在 2026 年模型更換越來越頻繁的環境下尤其重要。

> 設計哲學：OpenClaw 把記憶當成一個「可移植的操作系統」，而不是特定 agent 的附屬品。provenance 標籤讓任何模型都能理解記憶的來源和可信度。

## Letta Code（原 MemGPT）

Letta Code 是從 MemGPT 演化而來的記憶優先（memory-first）coding agent，由 UC Berkeley 研究團隊創立。它明確的定位是「記憶不是 plugin，context 和 state management 是 harness 的核心職責」。

**記憶架構：三層 OS 級設計**

Letta 的記憶系統模仿操作系統的記憶 hierarchy：

1. **Core Memory**（核心記憶）：可編輯的 in-context memory blocks，agent 自己可以讀寫。針對特定主題（user preferences、persona、當前任務）。每個 block 可以被 agent 透過 `memory_replace` 工具獨立更新
2. **Recall Memory**（回憶）：近期訊息緩衝區，保持對話流
3. **Archival Memory**（長期存儲）：可查詢的歷史存儲

**MemFS（Git-backed Memory）**

2026-02 推出的 Context Repositories（MemFS）是 Letta 的標誌性創新：記憶用 git 版本控制，agent 的每一次記憶修改都被 git 追蹤。這帶來了：

- **可重播性**（replayability）：可以回到任何時間點的記憶狀態
- **可稽核性**（auditability）：誰在什麼時候改了什麼
- **可合併性**（mergeability）：多 agent 的記憶可以合併

**讓 Agent 自己管理記憶**

Letta 的設計哲學是「agent 應該自己決定什麼值得記」。agent 透過工具呼叫自己更新記憶 blocks，而不是依賴外部系統。這創造了一個明確的、trackable 的學習過程——每個記憶更新都有日誌紀錄。

**產品演進**

- 2026-02：Context Repositories（git-backed memory）
- 2026-03：Building Draft、Remote Environments
- 2026-04：**Letta Code App** 發布——桌面端的 memory-first agent 互動界面
- 2026-06：**Mods**——harness-level 的自我適應機制
- 2026-08：Letta Agents SDK——支援 stateful agents 的 SDK

**Sleep-time Compute**

Letta 率先提出讓 agent 在「睡著的時候」反思、整合、改進。Dream agents 會在 background 運行，整理白天積累的經驗。

**Model-Agnostic**

Letta Code 是 model-agnostic 的（OpenAI、Anthropic、Mistral 等），記憶系統不綁定特定模型提供商。在 TerminalBench 上是排名第一的開源 harness。

> 設計哲學：記憶不是一個可以外加的 plugin。context 和 state management 是 agent harness 的核心職責。讓 agent 自己決定什麼值得記、什麼值得忘，才是真正的持續學習。

## 九家對比

|  | Claude Code | Codex | Antigravity CLI | Cursor | Copilot | Devin Desktop | Hermes Agent | OpenClaw | Letta Code |
|---|---|---|---|---|---|---|---|---|---|
| **儲存形式** | 本機 Markdown | 本機 Markdown | 本機 Markdown | Rules 檔 | GitHub 託管 KV | 本機 + 雲端 | 本機 Markdown + SQLite | 檔案 + Wiki | Git-backed MemFS |
| **寫入時機** | session 中自動 | 閒置 6h 後背景 | 閒置 → inbox | 人手動寫 Rules | session 中 tool call | 自動 + 手動 | 背景 nudge + 自動 | 背景 + 證明 | Agent 工具呼叫 |
| **寫入需核准** | 否 | 否 | **是（inbox）** | N/A（人寫） | 否 | 部分 | write_approval | 部分 | 否 |
| **遺忘機制** | 無 | 30 天未用 | 無 | N/A | 28 天未驗證 | 手動 | 定期 grading | 無（手動） | 手動 |
| **跨 session** | ✓ | ✓ | ✓ | ✓（Rules） | ✓ | ✓ | ✓ | ✓ | ✓ |
| **跨團隊共享** | ✗ | ✗ | ✗ | Team Rules | **repo 層級** | 組織 Knowledge | ✗ | ✗ | ✗ |
| **Procedural memory** | CLAUDE.md | AGENTS.md | GEMINI.md + SKILL.md | Rules | 指示檔 | **Playbooks** | **Skills** | **Memory Wiki** | **Skills + Mods** |
| **Cache 考量** | 明確（三層 cache） | 未公開 | 未公開 | 未公開 | 未公開 | 未公開 | Cache-aware | 未公開 | 未公開 |
| **公開 A/B 數據** | 無 | 無 | 無 | 無 | **有** | 無 | 無 | 無 | 無 |
| **記憶 Provider 可替換** | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | **✓** | ✗ | ✗ |
| **Git 版本控制記憶** | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | **✓** |

## 路線圖：四條路線、三種賭注

從上面的對比可以看出四條不同的設計路線：

**路線一：Agent 自己記（Claude Code、Codex）**

Agent 在 session 中（Claude Code）或結束後（Codex）自動把值得記的東西寫成 Markdown。人可以讀、可以改，但寫入不需要人核准。

賭注：LLM 的記憶抽取夠準確，不會記錯或記太多。風險是記憶變成持久化的 prompt injection 載體（[系列第 8 篇](/posts/ai/2026-09-19-agent-memory-attack-surface)會展開這個問題）。

**路線二：Agent 提案、人核准（Antigravity CLI）**

Agent 產出候選記憶，最後一步交給人。Antigravity CLI 繼承 Gemini CLI 的 inbox 機制——Auto Memory 產出的 patch 和 SKILL.md 候選都要人核准才生效。

賭注：人願意花時間審核記憶。風險是 inbox 堆積到被忽略，功能等於沒開。

**路線三：不信任 agent 記憶，退回人寫（Cursor）**

Cursor 曾經有自動記憶，但拔掉了。長期知識完全靠人寫的 Rules 承擔。

賭注：人寫的品质比 agent 抽取好。風險是記憶的維護成本完全落在人身上。

**路線四：引用＋驗證（Copilot）**

每條記憶附引用，讀取時 JIT 檢查引用來源是否還存在。不是在賭「記得準不準」，而是在記憶端加入了自我修正——過期的記憶會被自然淘汰。也是唯一把記憶與程式碼版本掛鉤的設計。

**路線五：記憶即核心元件（Hermes、OpenClaw、Letta）**

這三家不走「加一個記憶功能」的路，而是把記憶系統建成 harness 的核心架構元件：

- **Hermes**：記憶可替換 provider（Honcho、Byterover、Supermemory、Mem0），core memory 永遠在 context window，FTS5 全文檢索所有 session
- **OpenClaw**：provenance 標籤讓記憶跨模型可移植，Memory Wiki 編譯成知識庫
- **Letta Code**：MemFS 用 git 版本控制記憶，agent 自己管理核心/回憶/長期存儲三層

賭注：記憶不應該是外掛，而是 harness 的一等公民。風險是這些系統的複雜度更高，對一般開發者門檻較高。

## 一個沒人跑的實驗

九家都聲稱自己的記憶設計有用，但只有 Copilot 公開過 A/B 數據（PR 合併率 +7pt）。沒有任何一家做過這個對照實驗：

> 同一批任務，分別在「有記憶」和「沒記憶」的條件下執行，控制模型版本、prompt、工具，量測 pass rate、token 消耗、人為修正次數。

Codex 的 30 天遺忘和 Copilot 的 28 天衰減是合理的設計，但「30 天」這個數字從哪來的？沒有公開的實驗依據。Claude Code 的 auto memory 沒有遺忘機制——這是因為記憶不會過時，還是因為還沒處理這個問題？

在記憶 benchmark 被[嚴重質疑](https://arxiv.org/abs/2507.05257)的 2026 年（LoCoMo 有 6.4% 答案本身是錯的，LLM judge 接受了 63% 的錯答），coding agent 的記憶評估更是一片空白。

Letta 的 Context Repositories 提出了一個有趣的方向：用 git 的 replayability 和 auditability 作為記憶的 engineering substrate，不靠準確度提升，靠可重播、可稽核、可合併。但這個方向還沒有被嚴格的對照實驗驗證。

## 下一篇

Coding agent 的記憶是給「用工具的人」設計的——本機、個人、跟著 session 走。但如果你是在**建** agent，各家雲平台提供的記憶 API 是另一個世界：託管儲存、多租戶隔離、非同步抽取管線。[下一篇](/posts/ai/2026-09-19-cloud-platform-memory-apis)拆解 OpenAI、Anthropic、Google、AWS、Microsoft 五朵雲的記憶 API。

## 參考資料

- [Claude Code — Memory 官方文件](https://code.claude.com/docs/en/memory)
- [Claude Code — Prompt caching 官方文件](https://code.claude.com/docs/en/prompt-caching)
- [Claude Code — Release notes](https://support.claude.com/en/articles/12138966-release-notes)
- [Claude — Memory Now Spans Chat and Cowork（2026-08-25）](https://www.memorylake.ai/en/blogs/claude-memory-chat-and-cowork)
- [Codex — AGENTS.md 官方文件](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- [Codex — Memories 官方文件](https://learn.chatgpt.com/docs/customization/memories)
- [Codex — Config reference](https://learn.chatgpt.com/docs/config-file/config-reference)
- [Codex — codex-rs/memories README](https://github.com/openai/codex/blob/main/codex-rs/memories/README.md)
- [OpenAI — Codex for almost everything（2026-04-16）](https://openai.com/index/codex-for-almost-everything)
- [OpenAI — Introducing upgrades to Codex（2026-09-10）](https://openai.com/index/introducing-upgrades-to-codex)
- [OpenAI — Agents SDK Sandbox Memory 官方文件](https://openai.github.io/openai-agents-python/sandbox/memory/)
- [Google — An important update: Transitioning Gemini CLI to Antigravity CLI（2026-05-19）](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli)
- [Google Antigravity Docs — Migrating from Gemini CLI](https://antigravity.google/docs/cli/gcli-migration)
- [Cursor — Rules 官方文件](https://cursor.com/docs/rules)
- [Cursor — Automations 官方文件](https://cursor.com/docs/cloud-agents/automations)
- [Cursor 論壇官方回覆 — Memories removed starting from 2.1.17](https://forum.cursor.com/t/memories-not-showing/143820)
- [GitHub Copilot — Repository instructions 官方文件](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions)
- [GitHub Copilot — Memory 概念文件](https://docs.github.com/en/copilot/concepts/agents/copilot-memory)
- [GitHub — Agentic memory for GitHub Copilot public preview（2026-01-15）](https://github.blog/changelog/2026-01-15-agentic-memory-for-github-copilot-is-in-public-preview)
- [GitHub Engineering — Building an agentic memory system for GitHub Copilot](https://github.blog/ai-and-ml/github-copilot/building-an-agentic-memory-system-for-github-copilot)
- [GitHub — Copilot Memory supports user preferences（2026-05-15）](https://github.blog/changelog/2026-05-15-copilot-memory-supports-user-preferences-for-pro-pro-users)
- [Cognition — Introducing Devin Desktop（2026-06-02）](https://cognition.com/blog/introducing-devin-desktop)
- [Devin Desktop — Memories 官方文件](https://docs.devin.ai/desktop/cascade/memories)
- [Devin — Knowledge 官方文件](https://docs.devin.ai/product-guides/knowledge)
- [Hermes Agent — Persistent Memory 官方文件](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory)
- [Hermes Agent — Memory Providers 官方文件](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory-providers)
- [Letta — Memory Models: Towards Agents That Learn（2026-06-25）](https://www.letta.com/blog/towards-agents-that-learn)
- [Letta — Agent Memory: How to Build Agents That Learn and Remember](https://www.letta.com/blog/agent-memory)
- [Letta — Letta Code: A Memory-First Coding Agent](https://www.letta.com/blog/letta-code)
- [OpenClaw — Memory overview](https://docs.openclaw.ai/concepts/memory)
- [OpenClaw — Memory Wiki](https://docs.openclaw.ai/plugins/memory-wiki)
- [OpenClaw — v2026.9.3 Release](https://docs.openclaw.ai/releases/2026.9.3)
- [OpenClaw 2.0 說明（2026-08-31）](https://cellcog.ai/blog/openclaw-2-0)
- [OpenBrain — Memory Provenance for OpenClaw](https://www.mindstudio.ai/blog/openbrain-memory-provenance-openclaw-labels)
- [Coding agent session 持久化與 crash recovery](/posts/ai/2026-08-25-coding-agent-session-persistence-crash-recovery)
- [Context 滿了怎麼辦：七種答案](/posts/ai/2026-08-21-context-full-seven-answers)

[上一篇一句 'Write a script' 的差距：Skill Instructions 如何決定 LLM 成功或失敗](/posts/ai/2026-09-19-docx-skill-instructions-stream-stall)[下一篇五朵雲的記憶 API：OpenAI、Anthropic、Google、AWS、Microsoft 怎麼讓 Agent 記住事情](/posts/ai/2026-09-19-cloud-platform-memory-apis)

### 相關文章

[系列導讀：AI Agent 記憶工程1 min](/posts/ai/2026-09-19-agent-memory-engineering-series-intro)[四種記憶與六個設計軸：Agent 記憶系統的設計空間1 min](/posts/ai/2026-09-19-agent-memory-taxonomy)[2026 記憶系統往哪走：檔案贏了向量，遺忘才剛開始1 min](/posts/ai/2026-09-19-agent-memory-2026-trends)
