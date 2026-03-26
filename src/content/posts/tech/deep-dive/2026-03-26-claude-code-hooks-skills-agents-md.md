---
title: "Claude Code 的三層品質防線：Hook、Skill、指令檔"
date: 2026-03-26
category: tech
tags: [claude-code, ai-agent, dx, ci-cd, code-quality, claude-md, agents-md]
lang: zh-TW
tldr: "Hook 是自動化安全網（擋住壞 commit），Skill 是互動式工作流程（跑檢查 + 自動修），指令檔（CLAUDE.md / AGENTS.md）是行為指引。三層各自獨立，組合起來讓 AI agent 在 commit 前自動完成 lint、typecheck、build 檢查。"
description: "介紹 Claude Code 的 Hook、Skill、指令檔（CLAUDE.md / AGENTS.md）三種機制如何各司其職，組合成 commit 前的自動化品質檢查流程，包含實際設定範例與設計取捨。"
draft: false
---

CI 跑在 GitHub Actions，push 之後才知道 lint 沒過、type 報錯。來回修一次要五到十分鐘，改一個 typo 又要再跑一輪。問題不在 CI 設計不好，而是檢查發生得太晚。

如果 Claude Code 在幫你 commit 之前，就先跑完 lint、typecheck、build，發現問題直接修掉再 commit——這件事不需要改 CI，只要搞懂 Claude Code 的三個機制怎麼用。

## 三個機制，三種職責

| 機制 | 本質 | 能做什麼 | 不能做什麼 |
|------|------|---------|-----------|
| **Hook** | 自動觸發的 shell command | 攔截、阻擋、記錄 | 不能修 code，不能互動 |
| **Skill** | Claude 可以載入的工作流程指令 | 跑檢查、讀錯誤、自動修復、與使用者互動 | 不會自動觸發，要呼叫才跑 |
| **指令檔** | 給 AI agent 讀的行為指引 | 告訴 AI「什麼時候該做什麼」 | 沒有強制力，AI 可能忽略 |

三層各自獨立運作。Hook 不需要 Skill 也能擋；Skill 不需要 Hook 也能跑檢查；指令檔不靠另外兩個也能影響 AI 行為。但組合起來才完整。

## Hook：自動化安全網

Hook 定義在 `~/.claude/settings.json`，在 Claude 的特定事件發生時自動執行 shell command。

### 事件類型

```
使用者送出訊息 ──→ UserPromptSubmit
Claude 即將用工具 ──→ PreToolUse
Claude 用完工具 ──→ PostToolUse
Claude 結束任務 ──→ Stop
```

### 運作方式

```jsonc
// ~/.claude/settings.json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash(git commit*)",
        "hooks": [{
          "type": "command",
          "command": "cd $CLAUDE_WORKING_DIRECTORY && pnpm run lint && pnpm run typecheck"
        }]
      }
    ]
  }
}
```

`matcher` 是過濾條件。`Bash(git commit*)` 只會在 Claude 執行 `git commit` 開頭的指令時觸發。command 回傳 exit code 0 就通過，非 0 就阻擋。

### Hook 的限制

Hook 跑的是 shell command，不是 Claude。它只能回報「過了」或「沒過」，不能叫 Claude 去讀錯誤訊息然後修 code。所以 Hook 是安全網——最後一道防線，確保即使其他機制沒跑，壞 code 也不會被 commit。

### 實用範例

```jsonc
{
  "hooks": {
    // commit 前跑 lint + typecheck
    "PreToolUse": [
      {
        "matcher": "Bash(git commit*)",
        "hooks": [{
          "type": "command",
          "command": "cd $CLAUDE_WORKING_DIRECTORY && pnpm run lint && pnpm run typecheck"
        }]
      }
    ],
    // Claude 結束時發 Mac 通知
    "Stop": [
      {
        "matcher": "",
        "hooks": [{
          "type": "command",
          "command": "osascript -e 'display notification \"Done\" with title \"Claude Code\"'"
        }]
      }
    ]
  }
}
```

## Skill：互動式工作流程

Skill 是一個 markdown 檔案，裡面寫著 Claude 應該執行的步驟。放在 `.claude/skills/` 目錄下，Claude 在需要時載入執行。

### 與 Hook 的關鍵差異

Hook 只能判斷 pass/fail。Skill 可以讓 Claude：

1. 跑 `pnpm run lint`，拿到錯誤訊息
2. 讀懂錯誤，找到對應檔案
3. 修改程式碼
4. 再跑一次確認修好了
5. 通過後才繼續

這是 Hook 做不到的。Hook 擋住之後，你只能自己去修。Skill 可以讓 Claude 幫你修。

### Skill 的結構

```
.claude/skills/
├── format-commit/SKILL.md      ← commit message 格式化
└── pre-commit-check/SKILL.md   ← commit 前品質檢查（新增）
```

一個 pre-commit-check skill 的範例：

```markdown
---
name: pre-commit-check
description: commit 前執行 lint、typecheck 檢查，自動修復可修的錯誤
---

# Pre-Commit Check

## 步驟 1：偵測子專案

根據 `$CLAUDE_WORKING_DIRECTORY` 判斷當前子專案，決定要跑的指令。

## 步驟 2：執行 lint 檢查

1. 執行 lint（如 `pnpm run lint`）
2. 如果有錯誤，先嘗試 `pnpm run lint:fix` 自動修復
3. 再次執行 lint 確認
4. 仍有錯誤 → 讀取錯誤訊息，手動修復

## 步驟 3：執行 typecheck

1. 執行 `pnpm run typecheck`
2. 如果有錯誤 → 讀取錯誤訊息，逐一修復
3. 修復後重新執行確認

## 步驟 4：回報結果

- 全部通過 → 告知使用者可以 commit
- 有無法自動修復的錯誤 → 列出錯誤，詢問使用者
```

### 拆分職責

Skill 之間不應該耦合。`pre-commit-check` 只負責品質檢查，`format-commit` 只負責 commit message 格式。指令檔（CLAUDE.md）負責告訴 Claude「commit 前先跑 pre-commit-check，通過後再跑 format-commit」。

## 指令檔：行為指引

不同的 AI 工具讀不同的指令檔。放在 repo 根目錄，AI 啟動時自動載入，告訴它在這個專案裡應該遵循什麼規則。

### 誰讀什麼

| 檔案 | 誰讀 | 自動載入？ |
|------|------|----------|
| `CLAUDE.md` | Claude Code | 啟動時自動載入 |
| `AGENTS.md` | Cursor、Codex、Gemini CLI | 各工具自動載入 |
| CI/CD workflow 裡的 prompt | GitHub Models 等 API | **不會**自動讀任何檔案 |

這是最容易搞混的地方。Claude Code **不讀** AGENTS.md，Cursor **不讀** CLAUDE.md。如果你的團隊用多種 AI 工具協作，兩個檔案都要維護，內容保持同步。

CI/CD 裡透過 API 呼叫的 AI（例如 GitHub Models 自動產生 PR description），不會去讀 repo 裡的任何指令檔。它的 prompt 是寫死在 workflow YAML 裡的。如果要讓 CI 的 AI 也遵守規範，需要在 workflow 裡手動把檔案內容塞進 prompt：

```yaml
RULES=$(cat CLAUDE.md)
# 塞進 system prompt
"content": "請遵守以下規範：\n$RULES"
```

### 實際範例（CLAUDE.md）

```markdown
# Commit 流程

commit 時必須依序執行：

1. 先執行 `pre-commit-check` skill 跑品質檢查
2. 檢查通過後，執行 `format-commit` skill 產生 commit message
3. 使用者確認後才執行 git commit

## 各子專案檢查指令

| 子專案 | lint | typecheck | lint:fix |
|--------|------|-----------|----------|
| daodao-f2e | `pnpm run lint` | `pnpm run typecheck` | `pnpm run lint:fix` |
| daodao-server | `pnpm run lint` | `pnpm run typecheck` | `pnpm run lint:fix` |
| daodao-ai-backend | `make check` | — | `make format` |
```

### 指令檔的定位

不管是 CLAUDE.md 還是 AGENTS.md，本質都是「建議」，不是「強制」。AI 在大多數情況下會遵守，但不保證。所以需要 Hook 當安全網——即使 AI 跳過了指令檔的指示，Hook 依然會在 `git commit` 前攔截。

## 三層怎麼組合

```
使用者說「commit」
      │
      ▼
CLAUDE.md 指示：先跑 pre-commit-check skill
      │
      ▼
┌─────────────────────────────┐
│  pre-commit-check skill     │
│  1. pnpm run lint           │
│  2. 失敗 → lint:fix → 再檢查 │
│  3. pnpm run typecheck      │
│  4. 失敗 → Claude 讀錯修 code │
│  5. 全過 → 繼續              │
└─────────────────────────────┘
      │
      ▼
format-commit skill（產生 commit message）
      │
      ▼
Claude 執行 git commit
      │
      ▼
┌─────────────────────────────┐
│  Hook 攔截（安全網）          │
│  再跑一次 lint + typecheck   │
│  過 → commit 成功            │
│  不過 → 阻擋                 │
└─────────────────────────────┘
```

正常情況下，Skill 已經把問題修完了，Hook 只是走個過場。但如果 Claude 跳過了 Skill（直接 commit），Hook 會擋住。

## 跟 CI 的關係

這不是要取代 CI。CI 跑在 remote，是團隊層級的守門員，跑完整測試、build 驗證、安全掃描。本地的 Hook + Skill 是個人層級的快速檢查，目標是在 push 之前就修掉明顯的錯誤，減少 CI 失敗次數。

```
本地（快，秒級）          Remote（完整，分鐘級）
Hook + Skill             GitHub Actions CI
commit 前攔截             PR 時完整檢查
lint + typecheck         lint + typecheck + test + build
Claude 自動修             失敗要手動修
```

兩層互補，不互相取代。

## 為什麼不用現有工具就好？

在 Claude Code 之前，commit 前檢查早就有成熟方案了：

| 工具 | 做法 | 能擋 | 能自動修 |
|------|------|------|---------|
| **husky + lint-staged** | git pre-commit hook 跑 lint | 能 | 能跑 `--fix`，僅限格式問題 |
| **lefthook** | 類似 husky，設定更簡潔 | 能 | 同上 |
| **pre-commit（Python 生態）** | `.pre-commit-config.yaml` | 能 | 同上 |
| **IDE 即時檢查** | VS Code / WebStorm 紅線 | 提示，不擋 | 部分 quick fix |

這些工具處理 lint 格式問題綽綽有餘。`eslint --fix` 或 `biome lint --write` 能自動修掉大部分格式和 import 問題。

**但它們修不了 typecheck 和 build 錯誤。**

```
TS2345: Argument of type 'string' is not assignable to
  parameter of type 'number'.
```

遇到這種錯誤，husky 只能擋住 commit，然後你要自己去看錯誤訊息、找到對應檔案、理解上下文、改 code、再跑一次。如果改完又觸發連鎖的 type error，再來一輪。

Claude Code Skill 的差異在這裡：**AI 能讀懂錯誤訊息、理解程式碼上下文、直接修改檔案、再驗證一次。** 這不是 shell script 做得到的事。

### 那為什麼還需要 Hook？

如果 Skill 已經能修，為什麼不全靠 Skill？

因為 Skill 需要 Claude **主動執行**。如果 Claude 忘了跑 Skill 就直接 commit（AI 不是 100% 遵守指令），或者你在 terminal 手動跑 `git commit` 繞過 Claude，就沒有檢查了。

Hook 是被動的安全網。不管是誰觸發 commit，它都會攔截。不需要 AI 記得，不需要人記得，**機制層面保證**。

### 那為什麼還需要指令檔？

Hook 擋得住但修不了。Skill 修得了但要被呼叫。

誰來呼叫 Skill？指令檔。

CLAUDE.md 寫著「commit 前先跑 pre-commit-check skill」，Claude 讀到這個指示就會主動去跑。沒有指令檔，Claude 不知道這個 Skill 存在，也不知道什麼時候該用。

### 三層的必要性

每一層解決不同的失敗模式：

| 失敗模式 | 誰防 |
|---------|------|
| Claude 不知道要跑檢查 | 指令檔告訴它 |
| lint/type 錯誤需要修復 | Skill 讓 Claude 修 |
| Claude 跳過 Skill 直接 commit | Hook 擋住 |
| 人在 terminal 手動 commit | CI 擋住（push 之後） |
| 本地漏網，推到 remote | CI 擋住 |

少任何一層都會有漏洞。但不需要一次全裝——根據痛點漸進式加就好。

## 那 husky 呢？

聊到 commit 前檢查，很多人第一反應是 husky + lint-staged。這是 JavaScript 生態的標準做法，但不是銀彈。

### husky 有用的情境

- 單一 Node.js 專案
- 團隊有紀律，不會 `--no-verify`
- lint 跑得快（幾秒內）

### husky 不一定有用的情境

**可以被繞過。** `git commit --no-verify` 直接跳過所有 git hook。趕著上線的時候，很多人就這樣跳了。一旦有人養成習慣，等於沒裝。

**Monorepo 設定複雜。** 如果你的 repo 有 Node.js（ESLint / Biome）、Python（ruff）、Go 混在一起，husky 裝在哪？lint-staged 要怎麼知道跑哪個 linter？設定複雜度很高，維護成本也高。

**拖慢 commit 速度。** lint 整個專案要幾秒到幾十秒。開發者一旦反感就開始 `--no-verify`，惡性循環。

**安裝不一定成功。** husky 靠 `postinstall` script 裝 git hook。CI 環境、Docker build、`--ignore-scripts` 安裝都可能讓它沒裝到，靜默失效。

### 跟 Claude Code Hook 的比較

| | husky (git hook) | Claude Code Hook |
|---|---|---|
| 觸發時機 | `git commit` 指令 | Claude 使用 Bash 工具時 |
| 對誰有效 | 所有人（裝了 husky 就生效） | 只對 Claude Code 有效 |
| 團隊協作 | 跟著 repo 走，大家共用 | 在個人 settings.json，不共享 |
| 能被繞過？ | `--no-verify` 就跳了 | 不能被繞過（除非改 settings） |
| 多語言支援 | 需要額外設定 | shell command，什麼都能跑 |

兩者不衝突。如果已經有 husky 且運作良好，留著。如果沒有，也不一定要為了 AI 工作流去裝——CI 是最終防線，Claude Code Hook + Skill 已經覆蓋了 AI 協作場景。

## 整體來說

這三個機制的分工很清楚：指令檔是導航，Skill 是引擎，Hook 是安全帶。導航告訴你該走哪條路，引擎帶你到目的地，安全帶在出事時保護你。

傳統 git hook 工具解決的是「擋住壞 commit」。Claude Code 的獨特價值不在「擋」，而在「修」——AI 讀懂錯誤、改 code、驗證結果，這個迴圈是 shell script 做不到的。

漸進式的導入建議：

1. **在 CLAUDE.md 加 commit 規範**——零成本，Claude 讀到就會遵守
2. **加 pre-commit-check Skill**——讓 Claude 能自動修 lint 和 type 錯誤
3. **加 Claude Code Hook**——防止 Claude 跳過 Skill 直接 commit
4. **CI 維持不變**——最終防線，不管本地做了什麼，PR 時都會完整檢查
