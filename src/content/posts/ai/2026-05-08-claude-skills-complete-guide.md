---
title: "Claude Skills 完整指南：用一個資料夾教 Claude 重複處理工作流"
date: 2026-05-08
type: guide
category: ai
tags: [claude, claude-skills, anthropic, mcp, agent, prompt-engineering]
lang: zh-TW
tldr: "Skills 把指令、腳本、參考資料打包成資料夾，靠 progressive disclosure 在 token 預算內讓 Claude 重複處理特定工作流。和 MCP 是知識層 vs 連線層的關係：MCP 給 Claude 連線能力，Skills 教 Claude 怎麼用。"
description: "Anthropic Skills 的設計哲學、和 MCP 的分工、三種典型用法、frontmatter 寫法以及五個常用 pattern。整理自官方 The Complete Guide to Building Skills for Claude。"
draft: false
---

Anthropic 在 2025 年底推出 Skills 並開放成 open standard。Skills 不是又一種 prompt 模板，而是把工作流的指令、腳本、參考資料打包成資料夾，靠「漸進式揭露」讓 Claude 在 token 預算內重複處理特定任務。這篇整理 Skills 的設計哲學、和 MCP 的分工、三種典型用法，以及寫得好的關鍵幾個欄位。

## Skill 是什麼：一個資料夾

一個 skill 就是包含以下內容的資料夾：

```
your-skill-name/
├── SKILL.md       # 必要 - 指令本文 + YAML frontmatter
├── scripts/       # 可選 - 可執行程式碼（Python、Bash）
├── references/    # 可選 - 按需載入的補充文件
└── assets/        # 可選 - 模板、字體、圖示
```

只有 `SKILL.md` 必要，檔名必須完全一致（區分大小寫）。資料夾名稱用 kebab-case，不能有空格、底線、大寫。

## 設計哲學：Progressive Disclosure

Skills 解決一個具體問題：怎麼把大量領域知識交給 Claude，又不爆 context？答案是分三層揭露：

- **Level 1：YAML frontmatter**——永遠載入系統 prompt，只放「這個 skill 在做什麼、什麼時候用」。
- **Level 2：SKILL.md 本文**——Claude 判斷當前任務相關時才載入，包含完整指令。
- **Level 3：`references/` 與 `scripts/`**——只有真的要用到時才開檔讀取或執行。

這個設計讓你能塞下一整套團隊 SOP，但平時只佔用幾十個 token 的元資料。多個 skills 可同時啟用，這也意味著 skill 不能假設自己是唯一的能力，要寫得能跟其他 skills 共存。

另外兩個原則是 **Composability**（同時載入多個）和 **Portability**（同份 skill 在 Claude.ai / Claude Code / API 都能用，已是 open standard）。

## Skills 跟 MCP 是什麼關係

很多人會混淆 Skills 和 MCP，官方用「廚房比喻」說得很清楚：

| | MCP | Skills |
|---|---|---|
| 角色 | 連線層（Connectivity） | 知識層（Knowledge） |
| 功能 | 把 Claude 接上外部服務 | 教 Claude 怎麼用這些服務 |
| 解答 | Claude **能做** 什麼 | Claude **應該怎麼做** |
| 比喻 | 食材與工具 | 食譜 |

只有 MCP 沒有 Skills 時，使用者連上服務但不知道下一步該做什麼，每次對話都要從頭描述工作流。有 Skills 後，預先設計的工作流會自動觸發，使用門檻大幅降低。

對 MCP 提供者來說，Skills 是讓自家整合「真的能用」的關鍵——光是接上沒人會買單，Skills 才是把工具變成穩定工作流的那一層。

## 三種常見類型

Anthropic 觀察到內部與早期使用者的 skills 大致落在三類：

**Category 1：文件與素材生成**——靠 Claude 內建能力產出一致風格的文件、簡報、設計或程式碼。代表是 `frontend-design`、`docx`、`pptx`、`xlsx`。重點技巧：嵌入風格指南、模板結構、品質檢查清單，完全不需要外部工具。

**Category 2：工作流自動化**——多步驟、需要一致方法論的流程，可能跨多個 MCP server。代表是 `skill-creator`：互動式引導使用者定義 use case、生成 frontmatter、寫指令、驗證。重點技巧：步驟驗證閘、模板、迭代修正循環。

**Category 3：MCP 強化**——在已有 MCP server 之上提供工作流指引。代表是 Sentry 的 `sentry-code-review`：透過 Sentry MCP 自動分析並修補 GitHub PR 中的 bug。重點技巧：協調多個 MCP 呼叫、處理常見錯誤、嵌入領域知識。

## YAML frontmatter 是 skill 寫得好不好的關鍵

因為 frontmatter 永遠載入系統 prompt，Claude 是否在對的時機載入這個 skill，幾乎完全取決於 description 寫得好不好。

最小範例：

```yaml
---
name: your-skill-name
description: What it does. Use when user asks to [specific phrases].
---
```

description 三個要素缺一不可：

1. **它做什麼**
2. **什麼時候用**（觸發條件）
3. **使用者會說的具體話**（觸發詞）

對照看：

```yaml
# 太抽象，不會觸發
description: Helps with projects.

# 缺觸發詞
description: Creates sophisticated multi-page documentation systems.

# 好的：具體 + 觸發詞 + 檔案類型
description: Analyzes Figma design files and generates developer
  handoff documentation. Use when user uploads .fig files, asks
  for "design specs", "component documentation", or
  "design-to-code handoff".
```

幾個硬規則：description 上限 1024 字元、不能有 XML 角括號（安全限制）、name 不能含 `claude` / `anthropic`（保留字）、name 與資料夾名都用 kebab-case。

## 五個典型 pattern

Anthropic 從早期使用者觀察到幾個常用設計模式：

1. **Sequential workflow orchestration**：明確的步驟順序與依賴關係，每一步驗證再進下一步，失敗有 rollback。例：客戶 onboarding（建帳號 → 設付款 → 建訂閱 → 寄歡迎信）。
2. **Multi-MCP coordination**：跨服務工作流。例：Figma 出設計 → Drive 上傳資產 → Linear 開任務 → Slack 通知。重點是清楚的 phase 分隔與 phase 間資料傳遞。
3. **Validation / refinement loop**：產出後跑驗證腳本，找出問題再修，直到品質達標。適合報告、文件這類靠迭代提升品質的場景。
4. **Context-aware tool selection**：同樣的目的，視情境選不同工具。例：依檔案大小、類型把檔案存到雲端、Notion、GitHub 或本機，並向使用者說明選擇原因。
5. **Domain expertise embedding**：把合規、法務、財務這類領域知識壓縮進 skill。例：付款處理前先做制裁清單與管轄區檢查，並產出稽核軌跡。

## 測試與常見問題

Skills 是活的文件，會持續迭代。建議的三類測試：

- **Triggering tests**：列 10–20 個應該/不該觸發的句子，看 skill 是否載入正確。
- **Functional tests**：執行實際工作流，驗證輸出正確、API 呼叫成功、邊界情況有涵蓋。
- **Performance comparison**：跟沒裝 skill 的基準比，量 token 消耗、API 失敗次數、來回訊息數。

最常踩到的問題：

- **不會觸發**：description 太抽象或缺觸發詞 → 加具體任務名、技術詞、檔案類型。
- **過度觸發**：description 太廣 → 加 negative trigger，限縮 scope。
- **指令沒被照做**：SKILL.md 太冗長、關鍵指令埋太深 → 移到頂端，用 `## Critical` 強調，把細節挪到 `references/`，把硬性驗證改寫成腳本。程式是確定的，語言詮釋不是。
- **整體變慢**：SKILL.md 控制在 5000 字以內，同時啟用的 skill 不要超過 20–50 個。

## 整體來說

Skills 的核心取捨是：用「資料夾」這個極輕量的格式，換取一致、可攜、可組合的工作流知識。它的價值不在「Claude 多會一招」，而在「使用者不必再每次重述同一套流程」。

對只用內建能力的場景（Category 1、2），Skills 已經能單獨派上用場。對有 MCP 整合的團隊（Category 3），Skills 補上 MCP 沒給的最後一哩——MCP 給連線、Skills 給知識，兩者疊起來才是穩定可用的整合。

如果你準備寫第一個 skill，最快的起點是直接在 Claude.ai 用 `skill-creator`：用自然語言描述想自動化的工作流，它會幫你產出 SKILL.md 初稿，再依本文提到的 description 三要素與 patterns 微調即可。多數人能在 15–30 分鐘內做出第一個能跑的 skill。

## 參考資料

- [The Complete Guide to Building Skills for Claude (PDF)](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf)
- [Anthropic Skills 官方文件](https://docs.anthropic.com/)
- [anthropics/skills (GitHub)](https://github.com/anthropics/skills)
- [Model Context Protocol](https://modelcontextprotocol.io/)
