---
title: "Claude Academy：AI-Native SDLC Playbook 課程導讀"
date: 2026-09-12
category: ai
type: guide
tags: [claude-code, sdlc, claude-academy, agent-skills, hooks, ci-cd, governance, context-engineering]
lang: zh-TW
tldr: "Anthropic 在 Claude Academy 推出 14 堂免費課程，把 AI 寫程式從「個人用 Claude Code」拉高到「整個團隊的開發流程」。核心概念只有四個：intent.md、CLAUDE.md、Skills、Hooks，但它們串起來就是一套完整的 AI-native SDLC。"
description: "Claude Academy 的 AI-Native SDLC Playbook 課程導讀：14 堂課、6 個階段，從 intent.md 到 CI/CD 整合，幫你在上課前建立完整心智模型。"
draft: false
series:
  name: "AI-Native SDLC Playbook"
  order: 0
---

大多數團隊用 Claude Code 的方式停在「個人開發加速」——每個工程師各自在終端機裡跟 Claude 對話，寫出來的程式碼品質取決於個人的 prompt 能力。這能提升個人產出，但**組織層級的開發流程沒有改變**。

Anthropic 在 [Claude Academy](https://academy.claude.com/courses/ai-native-sdlc-playbook/introduction) 推出的 *The AI-Native SDLC Playbook*，正好要解決這個落差。14 堂課、6 個階段，從需求擷取到上線後的監控回饋，畫出一條讓 AI agent 嵌入每個 SDLC 環節的路徑。這篇文章是課程導讀，幫你在上課前先建立心智模型、判斷哪些章節跟你的角色最相關。

## 課程結構一覽

14 堂課沿著傳統 SDLC 的階段排列，但重新定義了每個階段「誰做什麼」：

| 階段 | 課堂 | 核心問題 |
|------|------|----------|
| **Intro** | 1. Introduction | 傳統 SDLC 在 AI 加速下的瓶頸在哪？ |
| **Plan** | 2. Capture as intent.md | 需求怎麼從模糊對話變成機器可執行的文件？ |
| **Design** | 3. Requirements and design | 規格與設計為什麼可以合併成同一個 session？ |
| **Build** | 4. Plan mode as default | 為什麼 Claude Code 要從 plan mode 開始，而不是直接寫？ |
| | 5. The CLAUDE.md | 怎麼把組織的慣例、架構、常見錯誤編碼成 repo 級別的上下文？ |
| | 6. Skills as institutional knowledge | 怎麼把審查標準、部署流程打包成可版控的 skill？ |
| | 7. Parallel sessions and subagents | 多個 Claude session 同時開發時怎麼協調？ |
| **Test** | 8. Give Claude a feedback loop | 怎麼讓 Claude 在提交前自我驗證？ |
| | 9. Continuous evals in CI | 怎麼在 CI pipeline 裡對 agent 的產出做回歸測試？ |
| **Deploy** | 10. AI in the PR review loop | PR review 怎麼分層——哪些交給 agent、哪些留給人？ |
| | 11. Hooks as approval gates | 怎麼用確定性的閘門防止 agent 做出不可逆的操作？ |
| | 12. CI/CD integration | 怎麼把上面所有機制接進自動部署管線？ |
| **Maintain** | 13. Closing the loop on metrics | 上線後的監控怎麼自動回饋成新的 intent.md？ |
| **Closing** | 14. Closing thoughts | 資源整理與下一步 |

## 四個核心概念

整門課的骨架建立在四個 artifact 上，理解它們就等於理解這門課的設計哲學。

### intent.md — 需求的機器可讀形式

傳統開發的需求散落在 Jira ticket、Slack 訊息、會議紀錄裡。`intent.md` 的做法是把需求合成成一份版控檔案，格式是「問題 + 預期結果」，人看得懂、Claude 也能直接執行。

依 Anthropic 在課程中的說法，`intent.md` 不是規格書（spec），而是「我們想要解決什麼」的陳述。規格會在 Design 階段由 Claude 根據 intent 生成，經人確認後才進入 Build。這個分離很重要——它讓需求方不需要會寫技術規格，但工程端拿到的依然是結構化的輸入。

### CLAUDE.md — repo 級別的 agent 上下文

`CLAUDE.md` 放在 repo 根目錄，告訴 Claude「這個專案的慣例是什麼」。包含但不限於：

- 程式碼風格與 lint 規則
- 架構決策（為什麼用這個框架、哪些模式是刻意的）
- 常見錯誤（「不要用 X，因為 Y」）
- commit 格式與分支策略

課程的重點不在「怎麼寫 CLAUDE.md」——這在 [Claude Code 文件](https://docs.anthropic.com/en/docs/claude-code/memory)裡已經有——而是在**為什麼它是組織級別的基礎設施**。當每個 repo 都有維護良好的 CLAUDE.md，新人 onboarding 的時間成本降低，agent 產出的程式碼風格也不再因人而異。

### Skills — 把組織規範編碼成可重用的 skill

如果 CLAUDE.md 是「靜態的上下文」，那 Skill 就是「可觸發的標準作業程序」。一個 skill 是一個資料夾，裡面有一份 `SKILL.md` 描述觸發條件和執行步驟，加上任何需要的模板、參考檔案。

課程把 skill 定位為 *institutional knowledge*——組織裡那些「只有老手知道」的隱性知識，例如「開 PR 前要跑哪些檢查」、「部署到 staging 的完整步驟」、「這個 API 的 breaking change 歷史」。把它們打包成 skill，agent 就能一致地執行，不依賴個別工程師的記憶。

### Hooks — 確定性的核准閘門

Hooks 是整門課的治理基石。跟 CLAUDE.md 和 Skills 不同（它們是建議性的、Claude 「應該」遵守），Hooks 是確定性的——它們在 agent 執行動作前後觸發 shell 命令，不通過就擋下。

典型的 hook 場景：

- `PreToolUse`：在 Claude 執行 `git push` 前攔截，確認目標分支
- `PostToolUse`：在檔案寫入後跑 lint，不通過就要求修正
- `Stop`：在 Claude 結束前印出 diff 摘要，確認沒有遺漏

依課程的說法：「Humans remain accountable for every decision that requires judgment.」Hooks 就是落實這句話的機制——把不需要判斷的檢查自動化，留下需要判斷的給人。

## 誰應該上這門課

這門課**不是** Claude Code 入門教學。它假設你已經會用 Claude Code 做個人開發，問題在於「怎麼把它推到整個團隊」。

最直接受益的角色：

| 角色 | 重點章節 |
|------|----------|
| **工程主管 / Tech Lead** | L1-L3（策略面）、L10-L11（治理） |
| **平台工程師** | L5-L6（CLAUDE.md / Skills）、L8-L9（CI evals）、L11-L12（Hooks / CI/CD） |
| **資安 / 合規** | L11（Hooks as approval gates）、L13（metrics 回饋） |
| **個人開發者（想升級）** | L4（plan mode）、L7（parallel sessions）、L8（feedback loop） |

如果你的團隊還在「每個人各自用 Claude Code」的階段，建議從 L5（CLAUDE.md）和 L11（Hooks）開始，這兩堂的 ROI 最高——一份維護良好的 CLAUDE.md 加上基本的 hook 就能統一產出品質，不需要等所有人都上完 14 堂課。

## 跟站內其他文章的關係

這門課談的很多概念在 quidproquo 都有更深入的單篇介紹：

- **SDLC 全景**：[把 AI Agent 接進開發流程：從 SDLC 五大階段看怎麼做](/posts/ai/2026-04-18-agentic-ai-sdlc-workflow)——從更廣的產業視角看 Agentic AI 在 SDLC 各階段的應用
- **Context Engineering**：[Harness Engineering：讓 AI Agent 穩定交付的工程方法論](/posts/tech/2026-09-05-ai-native-agent-2026-harness-engineering)——深入 CLAUDE.md、hooks、skills 的實戰設計
- **Claude Code 入門**：[Claude Code 創業者指南](/posts/ai/2026-08-22-claude-code-startup-guide)——如果你還沒開始用 Claude Code，先看這篇

## 整體來說

*The AI-Native SDLC Playbook* 的核心論點很簡單：**當程式碼生成速度不再是瓶頸，瓶頸就移到了程式碼生成以外的環節**——需求擷取、設計審查、測試策略、部署治理、上線後回饋。這門課提供的不是新工具，而是一套把現有工具（Claude Code、CLAUDE.md、Skills、Hooks）串進完整開發生命週期的框架。

14 堂課的安排邏輯是一個迴圈：intent.md（需求）→ 設計 → 建置 → 測試 → 部署 → 監控 → 新的 intent.md。最後一堂課（Closing the loop on metrics）講的就是怎麼讓監控系統自動產出新的需求文件，形成持續改善的閉環。

免費、14 堂、每堂可獨立看。如果你只有 30 分鐘，看 L2（intent.md）和 L11（Hooks）——這兩堂定義了「AI-native」跟「AI-assisted」的分界線。

## 參考資料

- [The AI-Native SDLC Playbook — Claude Academy](https://academy.claude.com/courses/ai-native-sdlc-playbook/introduction)
- [Claude Code Memory (CLAUDE.md) — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/memory)
- [Claude Code Hooks — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/hooks)
- [Claude Code Skills — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/skills)
- [把 AI Agent 接進開發流程：從 SDLC 五大階段看怎麼做](/posts/ai/2026-04-18-agentic-ai-sdlc-workflow)
- [Harness Engineering：讓 AI Agent 穩定交付的工程方法論](/posts/tech/2026-09-05-ai-native-agent-2026-harness-engineering)
- [Claude Code 創業者指南：從零到產品的 AI 開發實戰](/posts/ai/2026-08-22-claude-code-startup-guide)
