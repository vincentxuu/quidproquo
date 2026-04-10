---
title: "Agent Skills：讓 AI 代理像資深工程師一樣工作的技能框架"
date: 2026-04-10
category: ai
tags: [agent-skills, ai-agents, harness-engineering, claude-code, cursor, gemini-cli, development-workflow]
lang: zh-TW
tldr: "Agent Skills 是 Addy Osmani 開源的 19 個生產級工程技能，透過 /spec → /plan → /build → /test → /review → /ship 的指令驅動 AI 代理遵循資深工程師的開發紀律，而不是走捷徑。"
description: "介紹 Addy Osmani 的 Agent Skills 開源專案——一套為 AI 編碼代理設計的生產級工程工作流程，涵蓋 7 大開發階段指令、19 個核心技能、3 個專家角色，以及反合理化表格等獨特設計。"
draft: false
---

AI 編碼代理很強，但它們有個共同的傾向：走最短路徑。能跑就好，測試之後再說，錯誤處理先不管。這在 prototype 階段沒問題，但進到 production 就是災難。

Addy Osmani（Google Chrome 團隊）的 [Agent Skills](https://github.com/addyosmani/agent-skills) 試圖解決這個問題：把資深工程師的開發紀律編碼成結構化的 Markdown 技能，讓 AI 代理在每一步都遵循生產級標準。

---

## 核心概念：技能不是 prompt，是工作流程

Agent Skills 跟一般的 system prompt 或 coding guideline 不一樣。每個 skill 是一套完整的工作流程，包含具體步驟、品質閘門、驗證要求，甚至連「你可能會想跳過這一步的藉口」都列出來了。

這比較接近 harness engineering 的思路——不只告訴 agent「要寫好程式」，而是設計一個環境，讓它很難寫出爛程式。

---

## 七個開發階段指令

整個框架圍繞開發生命週期設計了七個斜線指令：

```
/spec  →  定義需求，釐清邊界
/plan  →  拆解任務，標示依賴
/build →  增量實作，逐步驗證
/test  →  瀏覽器測試，除錯
/review → 程式碼審查，品質把關
/code-simplify → 簡化程式碼
/ship  →  部署上線
```

重點是這不是建議你「應該先規劃再開發」——而是每個指令背後都有對應的 skill 文件，定義了具體要做什麼、怎麼驗證做完了、什麼情況算 red flag。

---

## 19 個核心技能

按開發階段分類：

### Define（2 個）

- **Idea Refinement**：引導探索和釐清想法，避免一頭栽進實作
- **Specification-Driven Development**：先寫規格再寫程式，定義輸入輸出和邊界條件

### Plan（1 個）

- **Task Breakdown**：把規格拆成原子級任務，排列依賴順序，控制每個 change 在約 100 行左右

### Build（5 個）

- **Incremental Implementation**：不要一次寫完所有東西，每步都有驗證點
- **Test-Driven Development**：先寫測試，遵循測試金字塔（80% 單元 / 15% 整合 / 5% E2E）
- **Context Engineering**：管理 agent 的上下文，確保每一步都有足夠的背景資訊
- **Frontend UI Engineering**：前端特化的建構流程
- **API and Interface Design**：融入 Hyrum's Law 等設計原則

### Verify（2 個）

- **Browser Testing**：用 Chrome DevTools 做瀏覽器測試
- **Debugging and Error Recovery**：結構化的除錯流程，不是亂試

### Review（4 個）

- **Code Review and Quality Gates**：以資深工程師的標準審查
- **Code Simplification**：套用 Chesterton's Fence 原則——先理解為什麼存在，再決定要不要刪
- **Security and Hardening**：安全掃描和加固
- **Performance Optimization**：效能目標和量測

### Ship（5 個）

- **Git Workflow**：trunk-based development、feature flags
- **CI/CD and Automation**：自動化流水線
- **Deprecation and Migration**：棄用和遷移策略
- **Documentation and ADR**：文件和架構決策記錄
- **Shipping Procedures**：上線檢查清單

---

## 三個專家角色

除了技能之外，Agent Skills 預設了三個可切換的審查視角：

| 角色 | 視角 | 關注重點 |
|------|------|----------|
| Code Reviewer | 資深 Staff Engineer | 架構、可讀性、可維護性 |
| Test Engineer | QA 專家 | 測試覆蓋、邊界案例、測試金字塔 |
| Security Auditor | 安全工程師 | OWASP Top 10、注入攻擊、權限控制 |

這讓你可以對同一段程式碼做多角度審查，而不是依賴單一視角。

---

## 設計哲學：讓 agent 很難偷懶

Agent Skills 有幾個設計細節特別值得注意：

### 反合理化表格

每個 skill 都內建一張表，列出常見的「跳過這步的藉口」和對應的反駁。例如：

| 藉口 | 反駁 |
|------|------|
| 「這只是個小改動，不需要測試」 | 小改動造成的 regression 佔了 bug 總數的大宗 |
| 「之後再補文件」 | 之後永遠不會來 |
| 「我很趕，先上線再說」 | 修 production bug 的時間遠超過寫測試的時間 |

這個設計直接針對 LLM 的弱點：它們很擅長合理化自己的偷懶。有了明確的反駁，agent 更難自我說服跳過關鍵步驟。

### 驗證要求是硬性的

每個 skill 的結尾都有驗證檢查點，要求提供具體證據——測試結果、build 輸出、runtime 數據。不是「我覺得做完了」，而是「這是證明做完了的 output」。

### 漸進式揭露

模組化設計，每個 skill 獨立運作，不需要一次載入全部 19 個。這控制了 token 使用量，也避免 context window 被不相關的指令塞滿。

---

## 平台支援

Agent Skills 本質上是結構化的 Markdown，所以幾乎能用在任何 AI 編碼工具上：

| 平台 | 安裝方式 |
|------|----------|
| Claude Code | Marketplace 安裝或 `--plugin-dir` 本地載入 |
| Cursor | 放入 `.cursor/rules/` |
| Gemini CLI | `gemini skills install` |
| Windsurf | 複製到 rules 設定 |
| GitHub Copilot | 放入 `.github/copilot-instructions.md` |
| 其他 | 任何接受 Markdown 指令的 agent 都能用 |

---

## 整體來說

Agent Skills 解決的問題很明確：AI 代理預設最佳化速度，但生產環境需要的是可靠性。

這套框架適合：
- 團隊已經在用 AI 代理做開發，但對產出品質不滿意
- 想要在 AI 輔助開發中保留工程紀律，而不是事後補救
- 需要一個可跨平台、可漸進採用的標準化流程

不適合：
- 純 prototype 或 hackathon，速度比品質重要的場景
- 已經有成熟內部工程規範的團隊（可能會衝突）

核心取捨是用 token 和步驟數換取品質保證。如果你的 AI 代理經常產出「能跑但不能上線」的程式碼，Agent Skills 值得試試。

## 參考資料

- [Agent Skills - GitHub](https://github.com/addyosmani/agent-skills)
- [Addy Osmani - GitHub](https://github.com/addyosmani)
- [Claude Code - Anthropic](https://docs.anthropic.com/en/docs/claude-code)
- [Cursor IDE](https://cursor.com)
- [Gemini CLI - Google](https://github.com/google-gemini/gemini-cli)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Hyrum's Law](https://www.hyrumslaw.com/)
