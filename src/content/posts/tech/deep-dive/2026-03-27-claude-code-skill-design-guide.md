---
title: "Claude Code Skill 完整指南：把重複的工作流程變成一句指令"
date: 2026-03-27
category: tech
tags: [claude-code, skill, ai-agent, dx, automation, workflow, agent-skills]
lang: zh-TW
tldr: "Skill 是寫給 AI 看的 SOP。一個 markdown 檔案定義步驟，Claude 照著執行。不用寫程式，不用學框架，只要把「有經驗的人會怎麼做」寫成步驟就好。"
description: "從零開始介紹 Claude Code Skill 的設計哲學、檔案結構、實作方式，以及四個實際案例（format-commit、post、job-filter、file-bug-issue）的設計取捨。"
draft: false
---

每次 commit 都要想 message 格式、每次寫文章都要建檔案填 frontmatter、每次篩職缺都要跑同樣的流程。這些事情不難，但重複做很煩，而且每次都有可能漏掉某個步驟。

Claude Code Skill 解決的就是這件事：**把重複的工作流程定義成一個 markdown 檔案，之後用 `/skill-name` 一句話觸發，Claude 照著步驟執行。**

不是外掛，不是 API，不需要寫程式。它就是一份寫給 AI 看的 SOP。

## Skill 是什麼

一個 Skill 就是一個 markdown 檔案，放在 `~/.claude/skills/` 目錄下。檔案裡寫著：

1. 什麼時候該用這個 skill
2. 該收集哪些資訊
3. 按什麼順序執行什麼步驟
4. 輸出什麼結果

Claude Code 啟動時會掃描這個目錄，把所有 skill 註冊為可用指令。使用者在對話中打 `/skill-name`，Claude 就載入對應的 markdown，照著裡面的步驟執行。

### 跟 Hook 和指令檔的差異

這三個機制常搞混，但職責很不一樣：

| 機制 | 觸發方式 | 能做什麼 | 典型場景 |
|------|---------|---------|---------|
| **Hook** | 自動（事件觸發） | 跑 shell command，pass/fail | commit 前擋住 lint 錯誤 |
| **Skill** | 手動（`/name`）| 多步驟工作流程，能互動 | 產生 commit message、寫文章 |
| **指令檔** | 自動（啟動載入） | 行為指引，沒有強制力 | 告訴 AI「commit 前先跑檢查」 |

Hook 是被動安全網，Skill 是主動工作流程，指令檔是行為導航。詳細的比較可以看[三層品質防線](/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md)。

## 檔案結構

```
~/.claude/skills/
├── format-commit/
│   └── SKILL.md
├── post/
│   └── SKILL.md
└── job-filter/
    └── SKILL.md
```

每個 skill 是一個資料夾，裡面放一個 `SKILL.md`。除了主檔案，還可以放模板、範例、腳本等輔助檔案：

```
my-skill/
├── SKILL.md           # 主指令（必要）
├── template.md        # 模板，讓 Claude 填入
├── examples/
│   └── sample.md      # 範例輸出
└── scripts/
    └── validate.sh    # Claude 可以執行的腳本
```

SKILL.md 的 frontmatter 最少只需要 `description`：

```markdown
---
name: format-commit
description: 產生符合專案格式的 commit message
---

# Format Commit Message

## 步驟 1：分析變更
...
```

`name` 是觸發指令的名稱（`/format-commit`），省略就用資料夾名稱。`description` 讓 Claude 判斷什麼時候該建議使用這個 skill。

### Frontmatter 完整欄位

除了 `name` 和 `description`，還有幾個控制行為的欄位值得知道：

| 欄位 | 說明 |
|------|------|
| `disable-model-invocation` | 設為 `true`，Claude 不會自動觸發，只能人手動 `/name` |
| `user-invocable` | 設為 `false`，從 `/` 選單隱藏，只有 Claude 能用 |
| `context` | 設為 `fork`，在獨立的 subagent 執行，不影響主對話 |
| `agent` | 搭配 `context: fork` 指定用哪種 agent（`Explore`、`Plan`...） |
| `allowed-tools` | 限制 skill 執行時可用的工具（如 `Read, Grep, Glob`） |
| `argument-hint` | autocomplete 時顯示的參數提示（如 `[issue-number]`） |

**控制誰能觸發**是最常用的設計決策：

- `/deploy` 這種有副作用的 → `disable-model-invocation: true`，防止 Claude 自作主張
- `legacy-system-context` 這種背景知識 → `user-invocable: false`，Claude 需要時自動載入
- 預設兩者都能觸發，大多數 skill 用預設就好

### 全域 vs 專案

| 位置 | 路徑 | 生效範圍 |
|------|------|---------|
| 企業 | 透過 managed settings 部署 | 組織內所有人 |
| 全域 | `~/.claude/skills/` | 你的所有專案 |
| 專案 | `<project>/.claude/skills/` | 僅該專案 |
| Plugin | `<plugin>/skills/` | 啟用 plugin 的地方 |

同名 skill 的優先順序：企業 > 全域 > 專案。commit 格式、寫文章這種跨專案通用的，放全域。專案特定的檢查流程，放專案。

Monorepo 也有支援：Claude 會自動發現子目錄裡的 `.claude/skills/`，例如 `packages/frontend/.claude/skills/` 裡的 skill 在你編輯 frontend 檔案時會被找到。

## 設計一個 Skill 的思路

不是「我要寫什麼程式」，而是「如果我教一個新人做這件事，我會怎麼說」。

### 1. 定義觸發條件

什麼時候該用這個 skill？寫在 description 裡，Claude 會根據對話上下文判斷要不要建議。

```markdown
---
description: Use when committing changes - asks user for commit type and Why,
  auto-generates How from git diff
---
```

也可以在 CLAUDE.md 裡明確指定：

```markdown
# Commit 流程

commit 時必須使用 format-commit skill
```

### 2. 拆解步驟

把流程拆成清楚的步驟。每個步驟要明確：做什麼、用什麼工具、結果是什麼。

好的步驟：

```markdown
## 步驟 1：分析變更

1. 執行 `git diff --staged` 查看變更內容
2. 執行 `git status` 確認哪些檔案被修改
3. 簡要總結變更的範圍
```

壞的步驟：

```markdown
## 步驟 1

看一下改了什麼，然後繼續。
```

### 3. 明確互動點

哪些地方需要問使用者、哪些地方 AI 自己判斷，要寫清楚。

```markdown
## 步驟 2：收集 Why

**Why — 詢問使用者：**
- question: "請列出需要這次變更的原因"

**How — 從 git diff 自動推導，不詢問使用者：**
執行 `git diff --staged` 分析變更，自行歸納出 3-5 個具體解決方式。
```

這個區分很重要。Why 是意圖，只有人知道。How 是事實，diff 裡已經有了。

### 4. 定義輸出格式

告訴 Claude 最終產出長什麼樣。有範例最好。

```markdown
## 輸出格式

<type>(<scope>): <簡短描述>

## Why is this necessary?

- <原因 1>
- <原因 2>

## How does it address?

- <解決方案 1>
- <解決方案 2>
```

### 5. 加上確認機制

不要讓 AI 直接執行不可逆的動作。先預覽、確認、再執行。

```markdown
## 步驟 5：確認和執行

1. 向使用者展示生成的 commit message
2. 詢問是否需要修改
3. 確認後才執行 git commit
```

## 四個實際案例

### format-commit：標準化 commit message

**問題**：每次 commit 都要想格式，有時候偷懶就寫個 "fix bug"，三個月後看 git log 完全不知道當初在修什麼。

**設計**：

```
git diff --staged → 分析變更
    ↓
問使用者 type（feat/fix/refactor...）
問使用者 scope（哪個模組）
問使用者 Why（為什麼要改）
    ↓
AI 從 diff 自動推導 How
    ↓
組合成 type(scope): 描述 + Why/How 區塊
    ↓
預覽 → 確認 → git commit
```

**取捨**：Why 一定要問人，因為程式碼的 diff 看不出意圖。How 不問，因為改了什麼 diff 已經說清楚了，讓 AI 歸納比人類回想更準確。

### post：把對話變成文章

**問題**：解決了一個有趣的技術問題，想寫下來。但從零開始建檔案、填 frontmatter、想結構太麻煩，熱情就過了。

**設計**：

```
判斷分類（tech/climbing/ai...）
    ↓
選模板（踩坑文/介紹文/通用）
    ↓
從對話提取內容
    ↓
產生 markdown 檔案（含 frontmatter）
    ↓
預覽 → 確認 → git add + commit
```

**取捨**：模板不多，只有三個（tech-post、tech-deep-dive、general-post）。夠了。模板太多反而讓 AI 選錯。寫作風格指南放在 skill 裡，不是每次生成文章都重新解釋，而是確保一致性。

### job-filter：兩層職缺篩選

**問題**：從 104 和 LinkedIn 撈回來的 JSON 有幾百筆，一個一個看太慢。

**設計**：

```
104 JSON + LinkedIn JSON
    ↓
Layer 1: 關鍵字預篩（Python regex，毫秒級）
    ↓
Layer 2: claude -p 逐筆評分（1-10 分）
    ↓
輸出排名報告（推薦/還行/略過）
```

**取捨**：不把幾百筆全丟給 LLM 評分。先用關鍵字過濾掉明顯不相關的（PHP-only、C#-only），剩下的才用 LLM 精排。省 token，也快。

### file-bug-issue：Debug 對話直接開 issue

**問題**：花了二十分鐘在 Claude Code 裡 debug，找到根因但不是現在該修。跳去 GitHub 開 issue，要把錯誤訊息、分析結果重新打一遍。

**設計**：

```
從對話上下文收集：錯誤、重現步驟、根因、建議修法
    ↓
問 repo → gh repo view 驗證
    ↓
草擬 issue → 預覽 → 確認
    ↓
gh issue create --label bug
```

**取捨**：標 `bug` label 不標 `auto`。不是每個 bug 都適合讓 AI 自動修，讓人類判斷後再手動加 `auto` label 交給 Remote Agent。詳細設計見 [/file-bug-issue 的設計](/posts/tech/deep-dive/2026-03-27-file-bug-issue-skill-remote-agent)。

## 寫 Skill 的原則

**寫給 AI 看，不是寫給人看。** 人類看流程圖就懂了，AI 需要明確的步驟、具體的指令、清楚的判斷條件。

**一個 Skill 做一件事。** `format-commit` 只管 commit message，`pre-commit-check` 只管品質檢查。需要組合就在 CLAUDE.md 裡串：「commit 前先跑 check，通過了再跑 format」。

**不可逆動作前一定要確認。** git commit、gh issue create、發 API 請求——這些都要先預覽再執行。AI 偶爾會判斷錯，人類確認一下成本很低。

**用具體指令，不要用模糊描述。** 「檢查 code 品質」太模糊。「執行 `pnpm run lint`，如果有錯誤，先跑 `pnpm run lint:fix`，再次檢查」才是 AI 能執行的步驟。

**測試很簡單。** 跑一次 `/skill-name`，看 Claude 有沒有照步驟走。不對就改 markdown，不需要重新部署任何東西。

## 進階功能

基礎的 skill 用上面的方式就能寫。但 Claude Code 還提供了幾個進階功能，讓 skill 能做更複雜的事。

### 動態注入上下文

`` !`<command>` `` 語法可以在 skill 載入前先跑 shell command，把結果塞進 prompt。Claude 看到的不是指令，而是指令的輸出。

```markdown
---
name: pr-summary
description: 摘要 PR 的變更
context: fork
agent: Explore
---

## PR 資訊
- Diff: !`gh pr diff`
- 留言: !`gh pr view --comments`
- 變更檔案: !`gh pr diff --name-only`

## 任務
根據以上資訊摘要這個 PR...
```

這是預處理，不是 Claude 執行的。Claude 只看到最終結果。

### 在 Subagent 中執行

加上 `context: fork`，skill 會在獨立的 subagent context 中執行，不會污染主對話。適合大量搜尋、分析等不需要對話上下文的任務。

```markdown
---
name: deep-research
description: 深入研究某個主題
context: fork
agent: Explore
---

Research $ARGUMENTS thoroughly:
1. 用 Glob 和 Grep 找到相關檔案
2. 讀取並分析程式碼
3. 產出帶具體檔案引用的摘要
```

### 參數傳遞

Skill 可以接收參數。`$ARGUMENTS` 取得全部參數，`$0`、`$1` 取得個別參數。

```markdown
---
name: fix-issue
description: 修復 GitHub issue
---

修復 GitHub issue $ARGUMENTS：
1. 讀取 issue 描述
2. 理解需求
3. 實作修復
4. 寫測試
5. 建立 commit
```

`/fix-issue 123` → Claude 收到「修復 GitHub issue 123」。

### 內建 Bundled Skills

Claude Code 內建了幾個 skill，不需要額外安裝：

| Skill | 用途 |
|-------|------|
| `/batch <instruction>` | 大規模平行改動——研究 codebase、拆解任務、每個單元在獨立 worktree 中執行並開 PR |
| `/claude-api` | 載入 Claude API 參考文件，寫 Anthropic SDK 程式碼時自動觸發 |
| `/debug [description]` | 啟用 debug logging，分析 session log 排查問題 |
| `/loop [interval] <prompt>` | 重複執行指令，適合輪詢部署狀態或定期跑檢查 |
| `/simplify [focus]` | 平行派三個 review agent 檢查最近修改的程式碼，自動修復品質問題 |

## Agent Skills：跨工具的開放標準

Claude Code 的 Skill 格式不是封閉的。它遵循 [Agent Skills](https://agentskills.io) 開放標準——由 Anthropic 開發並釋出，現在已被 30+ 個 AI 工具採用。

這代表你寫的 SKILL.md **不只能在 Claude Code 裡用**。以下工具都支援同樣的格式：

**IDE 與編輯器**：Cursor、VS Code (Copilot)、JetBrains Junie、Roo Code、Firebender、Kiro

**CLI 工具**：Gemini CLI、OpenAI Codex、OpenCode、Goose、Mistral Vibe、Laravel Boost

**平台與框架**：GitHub Copilot、Databricks、Snowflake、Spring AI、Letta、OpenHands

**同一份 skill，不同的 AI 工具都能讀懂。** 這對團隊協作特別重要——不是每個人都用 Claude Code，但 `.claude/skills/` 裡的 skill 放進 repo，用 Cursor 的同事一樣能用。

### Plugin Marketplace：安裝別人寫好的 Skill

不想自己寫？Claude Code 有 Plugin 系統和 Marketplace，可以直接安裝別人做好的 skill。

**官方 Marketplace**（`claude-plugins-official`）啟動時自動載入，在 `/plugin` 的 Discover tab 瀏覽，或到 [claude.com/plugins](https://claude.com/plugins) 看完整目錄。安裝只要一行：

```bash
/plugin install github@claude-plugins-official
```

官方 Marketplace 提供的 plugin 包含：

| 類別 | 範例 |
|------|------|
| **Code Intelligence** | TypeScript、Python、Rust、Go 等語言的 LSP 支援 |
| **外部整合** | GitHub、GitLab、Slack、Notion、Jira、Linear、Figma、Sentry |
| **開發流程** | commit-commands、pr-review-toolkit、agent-sdk-dev |
| **文件處理** | DOCX、PDF、PPTX、XLSX 操作 |

**Anthropic Demo Marketplace**（`anthropics/claude-code`）需要手動加入，包含更多範例 plugin：

```bash
/plugin marketplace add anthropics/claude-code
```

提供 feature-dev（七階段功能開發流程）、code-review（五個平行 agent 審 PR）、hookify（對話分析自動產生 hook）、security-guidance（安全模式檢測）等。

除了官方的，任何 Git repo 都可以當 marketplace：

```bash
# GitHub repo
/plugin marketplace add your-org/claude-plugins

# 任何 Git URL（GitLab、Bitbucket、自架）
/plugin marketplace add https://gitlab.com/company/plugins.git
```

團隊可以在 `.claude/settings.json` 設定 `extraKnownMarketplaces`，新成員 clone repo 後自動取得團隊的 plugin。

### 社群生態

除了 plugin marketplace，GitHub 上已經有大量社群整理的 skill 集合：

| 專案 | 內容 |
|------|------|
| [anthropics/skills](https://github.com/anthropics/skills) | 官方範例 skill（文件處理、開發工具等） |
| [awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) | 75+ skill 分類整理，涵蓋文件、開發、行銷、自動化 |
| [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) | skill、hook、plugin、agent 的綜合清單 |
| [awesome-claude-plugins](https://github.com/ComposioHQ/awesome-claude-plugins) | plugin 策展清單 |
| [claude-code-plugins-plus-skills](https://github.com/jeremylongshore/claude-code-plugins-plus-skills) | 340 個 plugin + 1,367 個 skill |
| [antigravity-awesome-skills](https://github.com/sickn33/antigravity-awesome-skills) | 1,326+ skill，跨 Claude Code / Cursor / Codex / Gemini CLI |

GitHub 上標記 `agent-skills` 的 repo 已超過 2,100 個。因為 Agent Skills 是開放標準，這些 skill 大多不限於 Claude Code——Cursor、Codex CLI、Gemini CLI 等工具也能直接使用。

**安裝社群 skill 的方式很簡單**：把 skill 資料夾複製到 `~/.claude/skills/` 即可。如果是完整的 plugin，用 `--plugin-dir` 載入或透過 marketplace 安裝。

### Skill 的分享層級

| 方式 | 適合場景 |
|------|---------|
| **專案 skill** | commit 到 `.claude/skills/`，跟著 repo 走 |
| **Plugin** | 打包成 plugin，透過 marketplace 分發 |
| **企業部署** | 透過 managed settings 推送到組織內所有人 |

如果想提交 plugin 到官方 Marketplace，可以在 [claude.ai/settings/plugins/submit](https://claude.ai/settings/plugins/submit) 或 [platform.claude.com/plugins/submit](https://platform.claude.com/plugins/submit) 送審。

官方的範例 skill 可以在 [github.com/anthropics/skills](https://github.com/anthropics/skills) 找到。

## 整體來說

Skill 的設計門檻很低——不需要學框架、不需要寫程式、不需要理解 API。只要你能把一件事的步驟寫清楚，它就能變成一個可重複執行的自動化流程。

而且這不是 Claude Code 獨有的東西。Agent Skills 作為開放標準，意味著你投入的設計工作可以跨工具複用。今天寫給 Claude Code 的 skill，明天 Cursor、Gemini CLI、Codex 都能直接用。

真正困難的不是技術實作，是想清楚流程該怎麼走。哪些步驟需要人類判斷、哪些可以自動化、輸出格式是什麼、失敗了怎麼處理。這些問題跟「寫程式」無關，跟「設計工作流程」有關。

如果你的日常開發中有任何重複的流程——commit 格式、PR 模板、程式碼 review checklist、部署前檢查——都值得考慮做成 skill。從最簡單的開始，跑過幾次再根據實際問題調整。

---

## 參考資料

- [Claude Code Skills 官方文件](https://code.claude.com/docs/en/skills)
- [Agent Skills 開放標準](https://agentskills.io)
- [官方範例 Skills](https://github.com/anthropics/skills)
- [Claude Code Hooks 官方文件](https://code.claude.com/docs/en/hooks)
- [Claude Code Subagents 官方文件](https://code.claude.com/docs/en/sub-agents)
- [Claude Code Plugins 官方文件](https://code.claude.com/docs/en/plugins)
- [Plugin Marketplace 瀏覽與安裝](https://code.claude.com/docs/en/discover-plugins)
- [Plugin Marketplace 目錄](https://claude.com/plugins)
- [Equipping Agents with Agent Skills（Anthropic 工程 blog）](https://anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Claude Code 的三層品質防線：Hook、Skill、指令檔](/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md)
- [用 Claude Code Skill 把 Debug 對話變成 GitHub Issue](/posts/tech/deep-dive/2026-03-27-file-bug-issue-skill-remote-agent)
