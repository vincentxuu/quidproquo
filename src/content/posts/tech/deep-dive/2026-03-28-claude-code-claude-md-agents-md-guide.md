---
title: "Claude Code 怎麼記住你的專案：CLAUDE.md 層級串接、imports、rules 與 auto memory"
date: 2026-03-28
type: deep-dive
category: tech
tags: [claude-code, claude-md, auto-memory, rules, agents-md]
lang: zh-TW
tldr: "Claude Code 每個 session 都是乾淨的 context window，靠三種記憶跨 session 帶知識：每個 session 都載入的 CLAUDE.md、寫 paths 就條件載入的 .claude/rules/、以及 Claude 自己累積的 auto memory。各層 CLAUDE.md 是串接進 context，不是繼承覆蓋。本文拆解層級行為、@path imports、monorepo 拆檔策略，以及用 @AGENTS.md 讓多個工具共用一份指示。"
description: "深入介紹 Claude Code 的記憶設計：CLAUDE.md 四個層級如何串接進 context、imports 語法、.claude/rules/ 條件載入、auto memory 運作方式，與 monorepo 的 nested CLAUDE.md 策略。"
draft: true
series:
  name: "Claude Code 深入介紹"
  order: 9
---

> 🌏 [English version](/posts/tech/deep-dive/2026-03-28-claude-code-claude-md-agents-md-guide-en)

每次啟動 Claude Code，都是一個全新的 context window——上一個 session 教過它的事，預設全忘。[系列入口篇](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works)提過它的存取範圍裡有 CLAUDE.md 和 auto memory，[目錄導覽](/posts/tech/deep-dive/2026-08-26-claude-code-claude-directory)則逐檔講過這些東西放在哪。這篇聚焦一個更核心的問題：**記憶體系本身是怎麼設計的**——什麼該記、誰負責記、載入時怎麼疊。

## 三種記憶：你寫的、條件載入的、它自己寫的

官方文件把跨 session 的知識分成兩大類：CLAUDE.md（你寫給它的指示）和 auto memory（它自己做的筆記）。加上 `.claude/rules/`，實務上是三種：

| 記憶 | 誰寫 | 何時載入 | 適合放 |
|------|------|----------|--------|
| `CLAUDE.md` | 你 | 每個 session 開頭 | build 指令、慣例、「永遠做 X」 |
| `.claude/rules/*.md` | 你 | 有 `paths:` 時碰到符合的檔案才載 | 只對特定類型檔案有意義的規則 |
| auto memory | Claude | 每個 session 開頭載索引 | 你的偏好、你糾正過它的事 |

關鍵分野是**強制與否**：這三種都是 context，不是 enforced configuration。Claude 讀了會盡量照做，但不保證——要保證每次 commit 前都跑 lint，那要寫 hook，不是寫進 CLAUDE.md。

### CLAUDE.md 語法與最佳實踐
- 基本結構：專案描述、tech stack、慣例
- 常見指令模式：commit message 格式、命名規範、測試策略
- 反模式：過長、過於模糊、與 Hook 職責重疊

Auto memory 預設開啟，Claude 把學到的東西記在 `~/.claude/projects/<project>/memory/` 下：`MEMORY.md` 是索引，每個 session 開頭只載前 200 行或 25KB；細節拆成主題檔（`user_role.md`、`feedback_testing.md`），需要時才讀。它記四種東西——你的角色與偏好、你給過的修正、code 裡看不出來的專案脈絡、外部資源在哪——而 codebase 本身能推導出來的架構、路徑一律不記。用 `/memory` 可以瀏覽、編輯、刪除，也可以整個關掉。

## 層級與串接：全部進 context，不是覆蓋

CLAUDE.md 有四個層級，依載入順序從廣到窄：

1. **Managed policy**：IT 部署到整台機器（macOS 在 `/Library/Application Support/ClaudeCode/`），組織級規範，個人無法排除。
2. **User**：`~/.claude/CLAUDE.md`，你的個人偏好，跨所有專案。
3. **Project**：repo 根目錄的 `./CLAUDE.md` 或 `./.claude/CLAUDE.md`，團隊共用，進版控。
4. **Local**：`./CLAUDE.local.md`，你在這個專案的私人筆記，自己加進 `.gitignore`。

最容易搞錯的一點：**這些層是串接（concatenated）進 context，不是子層覆蓋父層**。你的個人偏好和團隊規範會同時在場，順序是從檔案系統根一路往下排到你啟動的目錄——越靠近工作目錄的越晚被讀到，同一層內 `CLAUDE.local.md` 排在 `CLAUDE.md` 後面。所以衝突不會自動解決：兩份檔案對同一件事給不同指示，Claude 可能任選一個。官方建議定期回頭清掉過時或矛盾的條目。

還有一個常被忽略的行為：上層目錄和目前工作目錄的 CLAUDE.md 會在啟動時載入，但**子目錄的不會**——等到 Claude 實際讀到那些目錄裡的檔案才載入。這正是 monorepo 策略的基礎，後面講。

## Imports：用 @path 把檔案拉進來

CLAUDE.md 裡寫 `@path/to/file`，那個檔案的內容就會在啟動時展開、跟著一起進 context：

```markdown
See @README for project overview and @package.json for available npm commands.

# Additional Instructions
- git workflow @docs/git-instructions.md
```

幾條規則：相對路徑以**包含 import 的那個檔案**為基準，不是工作目錄；可以遞迴 import，最深四層；包在反引號裡的路徑（`` `@README` ``）不會被解析，想提到檔名又不真引入就用這招。注意 import 是組織手段不是省 token 手段——被 import 的檔案照樣在啟動時全文載入。

## 什麼東西該放哪一層

判斷標準只有一句話：**你會不會想在每個 session 都重複講一遍？**

- 會，而且全團隊都需要 → 專案 `CLAUDE.md`
- 會，但只有你需要 → `~/.claude/CLAUDE.md` 或 `CLAUDE.local.md`
- 只有碰到某類檔案才有意義 → `.claude/rules/` 加 `paths:` frontmatter
- 多步驟流程、只在特定任務用到 → skill（按需載入）
- 必須保證發生 → hook

尺寸有明確數字：單一 CLAUDE.md 官方建議壓在 200 行以內，超過 4 MiB 會直接被跳過不載。檔案越長遵循度越低——因為它佔的是每個 session 都在燒的 context。接近上限時，往 path-scoped rules 拆。

## Monorepo：nested CLAUDE.md

大型 repo 常見的失敗是一份根目錄 CLAUDE.md 想涵蓋所有子系統——結果不是肥到沒人讀完，就是泛到沒有用。官方的做法是兩層拆：

- 根目錄 `CLAUDE.md`：跨套件通用的規則（commit 格式、禁改產生的檔案）
- 各子目錄自己的 `CLAUDE.md`：該區技術堆疊特有的慣例

從 `packages/api/` 啟動時，根目錄加 api 目錄的檔案會載入，`packages/web/` 的不會；從根目錄啟動時各套件的檔案等 Claude 讀到才載。如果某些套件的 CLAUDE.md 你永遠不碰（別的團隊的、legacy 的），用 `claudeMdExcludes` 按路徑排除，managed policy 層除外。另外 settings.json 不吃這套階層邏輯——它只從你啟動的那個目錄載入，不往上找，跟 CLAUDE.md 行為不同。

## AGENTS.md：跨工具共存

AGENTS.md 是多家 coding agent 共用的指示檔規範，但 Claude Code **只讀 CLAUDE.md，不讀 AGENTS.md**。要讓兩邊看同一份內容，官方給兩條路：

```markdown
@AGENTS.md

## Claude Code
Use plan mode for changes under `src/billing/`.
```

import 之後可以在下面追加 Claude 專屬指示；不需要追加就直接 symlink（`ln -s AGENTS.md CLAUDE.md`）。Windows 建 symlink 要 Administrator 權限，所以官方建議 Windows 用 import。本站兩種都試過，細節和取捨寫在[另一篇：用 symlink 讓 CLAUDE.md 與 AGENTS.md 共存](/posts/tech/2026-04-05-symlink-agents-md-claude-md)，這裡不重講。

## 學到的事

這套記憶體系的分工其實很清楚：**CLAUDE.md 管「每次都要知道的事」，rules 管「碰到才需要知道的事」，auto memory 管「你懶得每次講的事」**。三種都是建議不是命令，命令歸 hooks 和 settings。設計的原點是省 context——200 行的上限、paths 條件載入、MEMORY.md 只載前 200 行，全是同一件事：讓每個 session 帶著剛好夠用的記憶開場。

## 參考資料

- [How Claude remembers your project（Memory）— Claude Code Docs](https://code.claude.com/docs/en/memory) — CLAUDE.md 層級表、串接載入順序、imports 語法、`.claude/rules/` 與 auto memory 的官方完整說明
- [Set up Claude Code in a monorepo or large codebase — Claude Code Docs](https://code.claude.com/docs/en/large-codebases) — nested CLAUDE.md 兩層拆法、`claudeMdExcludes`、per-directory skills 的官方指南

## 更新紀錄

- 2026-08-26：由 CLAUDE.md+AGENTS.md 骨架改題重寫，聚焦記憶體系；依 2026-08 官方文件撰寫。
