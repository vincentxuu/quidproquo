---
title: "Claude Skills：把專業知識打包成資料夾，教一次就一直記得"
date: 2026-05-08
type: deep-dive
category: ai
tags: [claude, anthropic, claude-skills, prompt-engineering, agent, context-engineering]
lang: zh-TW
tldr: "Skill 是一個資料夾、一份 SKILL.md。三層 progressive disclosure 讓 Claude 在需要時才載入細節，避免每次對話重新解釋偏好。"
description: "解讀 Anthropic 官方《The Complete Guide to Building Skills for Claude》：Skill 的資料夾結構、三層漸進揭露、YAML frontmatter 規則、撰寫與測試流程。"
draft: false
---

每次跟 Claude 對話都要重新交代「我們公司簡報用 sans-serif、引用要用 APA、PR 標題不能超過 70 字元」很煩。Anthropic 在 2026 年 1 月釋出的官方指南把這套設定方式收斂成一個概念：**Skill 是一個資料夾**，裡面放好一次，每次需要時 Claude 自動載入。這篇整理 Skill 的結構、三層載入機制、frontmatter 規則、以及實際寫一個 Skill 該注意什麼。

## Skill 是什麼

Skill 是一份打包好的指令集合，教 Claude 怎麼處理某類特定工作。它不是一條 prompt，也不是一個 fine-tune，而是一個有固定結構的資料夾：

```
your-skill-name/
├── SKILL.md         # 必填：YAML frontmatter + Markdown 指令
├── scripts/         # 選填：可執行程式碼（Python / Bash）
├── references/      # 選填：被連結進來的補充文件
└── assets/          # 選填：模板、字型、圖示等資源
```

跟 system prompt 比起來，Skill 的差別在「composability」與「portability」：可以同時掛多個 Skill，且同一個 Skill 在 Claude.ai、Claude Code、API 三邊行為一致。跟 MCP 比起來，MCP 提供工具存取（API 連線），Skill 提供領域知識（怎麼用這些工具），兩者疊在一起才會變成可靠的工作流。

## Progressive Disclosure：三層載入

Skill 的核心設計是「**漸進揭露**」——不要一次把所有東西塞進 context window，而是按需載入：

| 層級 | 內容 | 載入時機 |
|------|------|---------|
| 1 | YAML frontmatter（`name` + `description`） | 每次對話都載入 system prompt |
| 2 | SKILL.md 主體（Markdown 指令） | Claude 判斷這個 Skill 跟當前任務相關時 |
| 3 | `references/`、`scripts/`、`assets/` 內檔案 | 主體裡明確被引用、且 Claude 認為需要時 |

第一層只放「這個 Skill 是做什麼的、什麼時候用」——夠 Claude 判斷要不要往下挖就好。第二層放實際指令，但建議不超過 5,000 字（官方文件建議 SKILL.md 主體控制在 500 行內）。真正的細節（API 規格、長範例、模板）丟到第三層。

這個設計直接對應到 token 經濟：第一層永遠付錢，第二層在相關對話付一次錢然後留在 context，第三層只在需要時載入。把所有東西寫在 SKILL.md 裡會讓每個對話都背負完整成本。

## YAML Frontmatter 規則

最小可用的 frontmatter 只要兩個欄位：

```yaml
---
name: pdf-form-filler
description: Fills PDF forms using field metadata. Use when user uploads a .pdf form, asks to "fill in this form", or mentions form auto-completion.
---
```

幾條硬性規定：

- `name` 必須跟資料夾名稱一致，**kebab-case only**
- `description` 上限 1024 字元，要同時包含「做什麼」+「什麼時候用」
- 不可包含 XML 角括號（`<` `>`）
- 名稱不可包含 `claude` 或 `anthropic`（保留字）

選填欄位有 `license`、`compatibility`（環境需求，1-500 字元）、`metadata`（自訂 key-value，例如 author、version、mcp-server）。

## description 是觸發條件，不是介紹文

`description` 寫得好不好，直接決定 Skill 會不會被觸發。Anthropic 給的公式是：

> **[做什麼] + [什麼時候用] + [關鍵能力]**

對照範例：

```
✅ 好：Analyzes Figma design files and generates developer
   handoff documentation. Use when user uploads .fig files,
   asks for "design specs", or "design-to-code handoff".

❌ 太模糊：Helps with projects
❌ 缺觸發詞：Creates sophisticated documentation
❌ 機器語言：Implements the Project entity model
```

關鍵是要寫「使用者會說什麼」，而不是「這個 Skill 內部怎麼做」。Claude 在判斷要不要觸發時，比對的是當前對話的語氣與關鍵字，不是技術細節。

## 撰寫指令的結構

SKILL.md 主體建議放這幾塊：

1. **明確的步驟流程**：第一步做什麼、第二步做什麼，不要寫「請考慮以下幾點」這種開放式建議
2. **具體可執行的指令**：要跑哪個 script、要呼叫哪個工具，命令行原樣寫進來
3. **錯誤處理**：常見失敗模式 + 對應處置
4. **範例**：好的輸入、好的輸出長什麼樣
5. **疑難排解**：使用者最常踩到什麼坑

跟寫 CLAUDE.md 一樣的紀律：**陳述要做什麼，不要敘述為什麼**。Skill 一旦載入，每個 turn 都會付 token 成本，每行字都要值得。長範例、規格表、API schema 這種東西丟到 `references/`，主體只留「需要時去查 references/api-schema.md」這種指引。

## 三類典型用例

官方把 Skill 分成三大類：

**1. 文件與資產生成**：簡報、報告、設計稿、程式碼，套用組織既有規範。例如「公司簡報模板」「程式碼風格」「APA 引用」。Skill 把這些隱性標準寫死，輸出穩定。

**2. 工作流自動化**：多步驟流程，每一步有驗證。例如「PR 審查流程」「事件回應 runbook」「客戶 onboarding」。價值在於一致的方法論，不是單一輸出。

**3. MCP 加值**：MCP 提供 raw API connectivity，Skill 在上面疊一層領域知識。例如 Salesforce MCP 給你 CRUD，Salesforce Skill 教 Claude 怎麼正確地建 lead、什麼欄位該填什麼。

## 測試三件事

寫完 Skill 不能只測「跑得起來」。官方建議三個測試面向：

```
觸發測試 (Triggering)
├── 直白請求 → 應該觸發
├── 改寫過的請求 → 應該觸發
└── 不相關話題 → 不應觸發

功能測試 (Functional)
├── 輸出是否合法
├── API 呼叫成功
├── 錯誤處理運作
└── 邊界 case 覆蓋

效能比對 (Performance)
├── Token 用量降低？
├── 訊息往返次數降低？
└── API 失敗率降低？
```

迭代訊號很明確：**不夠觸發**就在 description 加關鍵字、加情境；**過度觸發**就加負面條件、收窄範圍；**執行錯**就改指令、補錯誤處理。

## 整體架構

把 Skill 跟其他元件擺在一起，責任分配長這樣：

```
┌─────────────────────────────────────────┐
│             User Conversation            │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────▼──────────┐
        │    System Prompt    │
        │  + 所有 Skill 的    │
        │    YAML frontmatter │  ← Level 1（永遠載入）
        └──────────┬──────────┘
                   │
        判斷哪個 Skill 相關
                   │
        ┌──────────▼──────────┐
        │   SKILL.md 主體     │  ← Level 2（相關時載入）
        └──────────┬──────────┘
                   │
        指令明確指向時才讀
                   │
        ┌──────────▼──────────┐
        │ references/ scripts/│  ← Level 3（需要時載入）
        │     assets/         │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │   MCP Tools / API   │  ← 執行層（Skill 教怎麼用）
        └─────────────────────┘
```

這個結構讓 Skill **不是 prompt 的替代品**，而是 prompt 的組織工具。原本散在 system prompt、CLAUDE.md、對話記憶裡的隱性知識，現在被拆成有明確觸發條件、有版本、可分享的單位。

## 整體來說

Claude Skills 解決的不是「能不能做」的問題，而是「能不能穩定做、能不能不重複講」。它的核心取捨是：你願不願意花一次力氣把工作流寫成資料夾結構，換取後續每次對話都不用再交代一遍。

適合：團隊有共通規範（程式風格、文件模板、審查流程）、跟 MCP 工具搭配的領域工作流、需要在 Claude.ai / Code / API 三邊行為一致的任務。

不適合：一次性問題、個人偏好極不穩定（每天都在改）、純創意發想（觸發條件難以定義）。

寫第一個 Skill 大概 15-30 分鐘，用 `skill-creator` 這個 meta-skill 起手最快。先挑一個讓你最煩的重複工作，把它寫成資料夾，看看成不成。

## 參考資料

- [The Complete Guide to Building Skills for Claude (PDF)](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf)
- [Anthropic：Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Claude API Docs：Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- [Claude API Docs：Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- [Claude Code Docs：Extend Claude with skills](https://code.claude.com/docs/en/skills)
- [Claude Cookbook：Introduction to Claude Skills](https://platform.claude.com/cookbook/skills-notebooks-01-skills-introduction)
- [Anthropic Skilljar：Introduction to agent skills（互動課程）](https://anthropic.skilljar.com/introduction-to-agent-skills)
- [joyrexus/gist：PDF 轉 Markdown 完整版](https://gist.github.com/joyrexus/ff71917b4fc0a2cbc84974212da34a4a)
