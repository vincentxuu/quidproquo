---
title: "六家 Coding Agent 怎麼記東西：從 CLAUDE.md 到 JIT 驗證"
date: 2026-09-19
category: ai
type: deep-dive
tags: [agent-memory, coding-agent, claude-code, codex, gemini-cli, cursor, copilot, devin]
series:
  name: "AI Agent 記憶工程"
  order: 3
lang: zh-TW
tldr: "六家 coding agent 的長期記憶走了三條路：Claude Code 和 Codex 用 Markdown 檔（agent 寫、人可讀）、Gemini CLI 用 inbox 核准（agent 提案、人拍板）、Copilot 用引用＋JIT 驗證（28 天沒被驗證就自動刪）。Cursor 則把 Memories 功能整個拔掉，退回純 Rules。六家在寫入時機、遺忘機制、跨團隊共享上的選擇完全不同，而且沒有任何一家公布過記憶功能的對照實驗數據。"
description: "比較 Claude Code、Codex、Gemini CLI、Cursor、GitHub Copilot、Devin Desktop 六家 coding agent 的長期記憶設計：指示檔層級、自動記憶寫入、遺忘機制、跨 session 共享與 prompt cache 的取捨。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-19-coding-agent-memory-comparison-en)

[上一篇](/posts/ai/2026-08-21-context-full-seven-answers)講的是 working memory——context 滿了怎麼辦。壓縮、剪枝、換手，全是在顧「這一次 session」。但下一次打開呢？

你昨天花三小時教 Claude Code 你們的 API 命名慣例、跟 Codex 解釋過部署流程、在 Cursor 裡標記了五條團隊規範——關掉 terminal，這些東西還在嗎？

這篇比較六家 coding agent 在長期記憶上的設計選擇。範圍限定在有公開文件的機制，不含平台 API（[下一篇](/posts/ai/2026-09-19-cloud-platform-memory-apis)）或開源框架。

## 先看全貌：每家都有什麼

六家 coding agent 的記憶機制可以拆成三層：

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

**Agent 寫的記憶：Auto memory**

路徑在 `~/.claude/projects/<project>/memory/`，結構是 `MEMORY.md` 當索引加上主題檔（frontmatter 標 `type: user | feedback | project | reference`）。

寫入時機：session 進行中 Claude 自行決定，也可以明確要求「記住這件事」。讀取：每次 session 開始注入 `MEMORY.md` 前 200 行或 25 KB，主題檔按需讀取。

關鍵限制：跨 session 有效（以 repo 為單位），但**不跨使用者、不跨團隊**（存本機），subagent 也不繼承（只有 fork 才會拿到）。

**Prompt cache 是記憶設計的硬約束**

依 [官方文件](https://code.claude.com/docs/en/prompt-caching)，Claude Code 的 prompt cache 分三層：

1. System prompt + tools + output style
2. 專案 context = CLAUDE.md + auto memory + unscoped rules
3. 對話本身

第二層只在 session 開始、`/clear`、`/compact` 時變動——這是刻意的。如果每一輪都動態注入新記憶，就會打破 cache 前綴，訂閱制的 1 小時 TTL 等於浪費。

> 設計含義：Claude Code 選擇「session 開頭注入一次、session 中不變」的記憶策略，是為了 prompt cache 的穩定性。這個取捨在其他家看不到，因為其他家沒有公開過 cache 設計。

**Compaction**

`/compact [指示]`，CLAUDE.md 裡可寫 `# Compact instructions` 客製摘要方向。壓縮後保留 system prompt、根 CLAUDE.md、unscoped rules、auto memory、plan，並重新讀最近改過的最多 5 個檔案。`/autocompact 500k` 可調閾值。

## Codex（OpenAI）

Codex 的記憶設計最有趣的地方在寫入時機——不是 session 進行中寫，是**結束後等 6 小時才寫**。

**指示檔：AGENTS.md**

依 [官方文件](https://learn.chatgpt.com/docs/agent-configuration/agents-md)：

- `~/.codex/AGENTS.override.md` → `~/.codex/AGENTS.md` → 專案從 git root 逐層串接到 cwd
- 越近的覆蓋越遠的
- `project_doc_max_bytes` 預設 32 KiB，超過靜默截斷（不會報錯）

**Agent 寫的記憶：Memories（preview）**

依 [2026-04-16 公告](https://openai.com/index/codex-for-almost-everything) 與 [官方文件](https://learn.chatgpt.com/docs/customization/memories)，Memories 預設關閉（要在 config 設 `[features] memories = true`）。

寫入是兩階段的背景作業：

1. rollout 閒置 `min_rollout_idle_hours`（預設 6 小時，可設 1–48）後，逐 thread 抽取原始記憶
2. 全域整併（`max_raw_memories_for_consolidation` 預設 256 條）

儲存在本機 `~/.codex/memories/`，檔案布局依 [codex-rs/memories README](https://github.com/openai/codex/blob/main/codex-rs/memories/README.md)：`raw_memories.md`、`rollout_summaries/`（每個 rollout 一檔）、`MEMORY.md` 與 `memory_summary.md`（整併輸出）、`skills/`。

**遺忘機制**

依 [config reference](https://learn.chatgpt.com/docs/config-file/config-reference)：`max_unused_days` 預設 30（可設 0–365）、`max_rollout_age_days` 預設 30（0–90）。這是六家中唯一有明確自動遺忘的（Copilot 也有，但機制不同）。

> 設計哲學：Codex 選擇「等你做完再想」的寫入時機，避免 session 進行中的記憶抽取干擾推理。代價是即時性——你教它的東西最快 1 小時後才會被記住。

**與 Agents SDK sandbox memory 的關係**

Codex Memories 的檔案布局和 OpenAI Agents SDK 的 [sandbox memory](https://openai.github.io/openai-agents-python/sandbox/memory/) 是同一套。OpenAI 把「檔案即記憶」從消費端產品推到了開發者 SDK。

## Gemini CLI（Google）

Gemini CLI 走的是「agent 提案、人核准」的路線，是六家中對寫入權控制最嚴格的。

**指示檔：GEMINI.md**

依 [官方文件](https://geminicli.com/docs/cli/gemini-md/)：

- 全域 → workspace → 祖先目錄 → 碰到的目錄 JIT 載入
- `@./file.md` import
- `discoveryMaxDirs` 200

和其他家不同的是，GEMINI.md **每一輪都以 system instruction 注入**，不是只在 session 開始讀一次。

**Auto Memory（experimental）**

依 [官方文件](https://geminicli.com/docs/cli/auto-memory)，`experimental.autoMemory` 預設 false。啟用後的行為：

1. 背景掃描「10+ 則使用者訊息且閒置 3+ 小時」的 session
2. 草擬 memory patch 和 SKILL.md 候選
3. 送進**審核 inbox**，使用者核准才生效

限制：不能直接改 active memory、settings、憑證或專案 GEMINI.md。

> Gemini CLI 的 Auto Memory 有一個獨特之處：它不只學事實（semantic memory），還學流程——產出的 SKILL.md 候選本質上是 procedural memory。這在六家中是唯一的。

**Compaction 與 session**

`/compress`，`model.compressionThreshold` 預設 0.5，`sessionRetention` 30 天。

註：無付費方案的 Gemini CLI 已於 2026-06-18 由 Antigravity CLI 取代。

## Cursor（Anysphere）

Cursor 的記憶故事是六家中最曲折的——它曾經有 Memories 功能，然後**整個拔掉了**。

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
- 2025 下半年：1.2 GA，加入背景產生記憶的核准流程（[changelog](https://cursor.com/changelog/1-2)）
- 2025-11：**自 2.1.17 起移除**

[官方論壇工作人員回覆](https://forum.cursor.com/t/memories-not-showing/143820)：「The Memories feature was removed starting from version 2.1.17」，建議以 `Cmd+Shift+P` 匯出成 `.mdc` 併入 Rules。2.1 changelog 本身沒提這件事，現行文件也沒有 Memories 頁面。

> Cursor 的選擇耐人尋味：它不是記憶功能沒人用，而是決定讓 Rules 承擔長期記憶的角色。這把記憶的寫入權完全交回給人類。

**Automations memory**

依 [官方文件](https://cursor.com/docs/cloud-agents/automations)，Cursor 的雲端 Automations 有自己的記憶機制：具名檔（預設 `MEMORIES.md`）放在工作檔案系統之外，跨執行讀寫、預設開啟、UI 可編輯。文件明確附上 prompt injection 警語。

## GitHub Copilot（GitHub / Microsoft）

Copilot 的記憶設計最獨特的地方是**每條記憶都附引用（citation），並在讀取時做 JIT 驗證**。

**指示檔**

依 [官方文件](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions)：

- `.github/copilot-instructions.md`
- `.github/instructions/*.instructions.md`（有 `applyTo` 和 `excludeAgent`）
- 也讀 AGENTS.md / CLAUDE.md / GEMINI.md
- 優先序：個人 > repo > 組織

**Copilot Memory（public preview）**

依 [2026-01-15 公告](https://github.blog/changelog/2026-01-15-agentic-memory-for-github-copilot-is-in-public-preview) 與 [概念文件](https://docs.github.com/en/copilot/concepts/agents/copilot-memory)：

- 兩種記憶：**repository-level facts**（有 repo 存取權者共享）和 **user-level preferences**
- GitHub 託管（不在本機），每條記憶附 citation
- 寫入：agent 執行中以 tool call 寫入；repo 記憶只能由有寫入權的貢獻者產生
- 讀取：session 開始注入近期 repo 記憶，並做 **JIT 驗證**——記憶引用的程式碼如果已經不存在，就不用（依 [工程部落格](https://github.blog/ai-and-ml/github-copilot/building-an-agentic-memory-system-for-github-copilot)）

**遺忘：28 天未驗證即刪**

使用（被 JIT 驗證確認還有效）會重置計時器。這是六家中唯一把遺忘跟「記憶還有沒有用」掛鉤的設計。

**公開數據**

依工程部落格，啟用 Memory 後：PR 合併率 83% → 90%、review 正評 75% → 77%（p < 0.00001）。這是六家中唯一公開 A/B 數據的。

**跨團隊共享**

Copilot Memory 是六家中唯一內建 repo 層級共享的。repo 記憶對所有有權限的貢獻者可見，個人偏好只有自己看到。可見可編輯：個人設定 → Memory；repo Settings > Copilot > Memory；組織政策控制開關。

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

## 六家對比

| | Claude Code | Codex | Gemini CLI | Cursor | Copilot | Devin Desktop |
|---|---|---|---|---|---|---|
| **儲存形式** | 本機 Markdown | 本機 Markdown | 本機 Markdown | Rules 檔 | GitHub 託管 KV | 本機 + 雲端 |
| **寫入時機** | session 中自動 | 閒置 6h 後背景 | 閒置 3h+ 後 → inbox | 人手動寫 Rules | session 中 tool call | 自動 + 手動 |
| **寫入需核准** | 否 | 否 | **是（inbox）** | N/A（人寫） | 否 | 部分（Suggestions） |
| **遺忘機制** | 無 | 30 天未用 | 無 | N/A | 28 天未驗證 | 手動 |
| **跨 session** | ✓ | ✓ | ✓ | ✓（Rules） | ✓ | ✓ |
| **跨團隊共享** | ✗ | ✗ | ✗ | Team Rules | **repo 層級** | 組織 Knowledge |
| **Procedural memory** | CLAUDE.md | AGENTS.md | GEMINI.md + SKILL.md | Rules | 指示檔 | **Playbooks** |
| **Cache 考量** | 明確（三層 cache） | 未公開 | 未公開 | 未公開 | 未公開 | 未公開 |
| **公開 A/B 數據** | 無 | 無 | 無 | 無 | **有** | 無 |

## 三條路線、三種賭注

從上面的對比可以看出三條不同的設計路線：

**路線一：Agent 自己記（Claude Code、Codex）**

Agent 在 session 中（Claude Code）或結束後（Codex）自動把值得記的東西寫成 Markdown。人可以讀、可以改，但寫入不需要人核准。

賭注：LLM 的記憶抽取夠準確，不會記錯或記太多。風險是記憶變成持久化的 prompt injection 載體（[系列第 8 篇](/posts/ai/2026-09-19-agent-memory-attack-surface)會展開這個問題）。

**路線二：Agent 提案、人核准（Gemini CLI、Devin Knowledge Suggestions）**

Agent 產出候選記憶，但最後一步交給人。Gemini CLI 的 inbox 機制最徹底——Auto Memory 產出的 patch 和 SKILL.md 候選都要人核准才生效。

賭注：人願意花時間審核記憶。風險是 inbox 堆積到被忽略，功能等於沒開。

**路線三：不信任 agent 記憶，退回人寫（Cursor）**

Cursor 曾經有自動記憶，但拔掉了。長期知識完全靠人寫的 Rules 承擔。

賭注：人寫的品質比 agent 抽取好。風險是記憶的維護成本完全落在人身上。

**Copilot 走了第四條路**：引用＋驗證。每條記憶附引用，讀取時 JIT 檢查引用來源是否還存在。這不是在賭「記得準不準」，而是在記憶端加入了自我修正——過期的記憶會被自然淘汰。這也是唯一把記憶與程式碼版本掛鉤的設計。

## 一個沒人跑的實驗

六家都聲稱自己的記憶設計有用，但只有 Copilot 公開過 A/B 數據（PR 合併率 +7pt）。沒有任何一家做過這個對照實驗：

> 同一批任務，分別在「有記憶」和「沒記憶」的條件下執行，控制模型版本、prompt、工具，量測 pass rate、token 消耗、人為修正次數。

Codex 的 30 天遺忘和 Copilot 的 28 天衰減是合理的設計，但「30 天」這個數字從哪來的？沒有公開的實驗依據。Claude Code 的 auto memory 沒有遺忘機制——這是因為記憶不會過時，還是因為還沒處理這個問題？

在記憶 benchmark 被[嚴重質疑](https://arxiv.org/abs/2507.05257)的 2026 年（LoCoMo 有 6.4% 答案本身是錯的，LLM judge 接受了 63% 的錯答），coding agent 的記憶評估更是一片空白。

## 下一篇

Coding agent 的記憶是給「用工具的人」設計的——本機、個人、跟著 session 走。但如果你是在**建** agent，各家雲平台提供的記憶 API 是另一個世界：託管儲存、多租戶隔離、非同步抽取管線。[下一篇](/posts/ai/2026-09-19-cloud-platform-memory-apis)拆解 OpenAI、Anthropic、Google、AWS、Microsoft 五朵雲的記憶 API。

## 參考資料

- [Claude Code — Memory 官方文件](https://code.claude.com/docs/en/memory)
- [Claude Code — Prompt caching 官方文件](https://code.claude.com/docs/en/prompt-caching)
- [Claude Code — Model configuration 官方文件](https://code.claude.com/docs/en/model-config)
- [Codex — AGENTS.md 官方文件](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- [Codex — Memories 官方文件](https://learn.chatgpt.com/docs/customization/memories)
- [Codex — Config reference](https://learn.chatgpt.com/docs/config-file/config-reference)
- [Codex — codex-rs/memories README](https://github.com/openai/codex/blob/main/codex-rs/memories/README.md)
- [OpenAI — Codex for almost everything（2026-04-16）](https://openai.com/index/codex-for-almost-everything)
- [OpenAI — Agents SDK Sandbox Memory 官方文件](https://openai.github.io/openai-agents-python/sandbox/memory/)
- [Gemini CLI — GEMINI.md 官方文件](https://geminicli.com/docs/cli/gemini-md/)
- [Gemini CLI — Auto Memory 官方文件](https://geminicli.com/docs/cli/auto-memory)
- [Cursor — Rules 官方文件](https://cursor.com/docs/rules)
- [Cursor — Automations 官方文件](https://cursor.com/docs/cloud-agents/automations)
- [Cursor 1.2 Changelog](https://cursor.com/changelog/1-2)
- [Cursor 論壇官方回覆 — Memories removed starting from 2.1.17](https://forum.cursor.com/t/memories-not-showing/143820)
- [GitHub Copilot — Repository instructions 官方文件](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions)
- [GitHub Copilot — Memory 概念文件](https://docs.github.com/en/copilot/concepts/agents/copilot-memory)
- [GitHub — Agentic memory for GitHub Copilot public preview（2026-01-15）](https://github.blog/changelog/2026-01-15-agentic-memory-for-github-copilot-is-in-public-preview)
- [GitHub Engineering — Building an agentic memory system for GitHub Copilot](https://github.blog/ai-and-ml/github-copilot/building-an-agentic-memory-system-for-github-copilot)
- [Cognition — Introducing Devin Desktop（2026-06-02）](https://cognition.com/blog/introducing-devin-desktop)
- [Devin Desktop — Memories 官方文件](https://docs.devin.ai/desktop/cascade/memories)
- [Devin — Knowledge 官方文件](https://docs.devin.ai/product-guides/knowledge)
- [Coding agent session 持久化與 crash recovery](/posts/ai/2026-08-25-coding-agent-session-persistence-crash-recovery)
- [Context 滿了怎麼辦：七種答案](/posts/ai/2026-08-21-context-full-seven-answers)
