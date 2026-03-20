# Claude Certified Architect — Foundations 考試導讀（重點整理）

## 概覽
Claude Certified Architect — Foundations 測試考生對 agentic 架構、工具整合、Claude Code 設定與工作流程、提示工程（prompt engineering）、以及對話上下文與可靠性管理的基礎能力。考試以情境題與任務陳述為主，要求既有概念理解也能提出可執行設計或配置方案。

## 考試重點（五大領域）

- **Domain 1 — Agentic Architecture & Orchestration**：掌握子代理(subagent)召喚、上下文傳遞、委派與調度策略。能設計多流程協調與失敗復原機制。
- **Domain 2 — Tool Design & MCP Integration**：了解如何為 Claude/agent 設計工具、整合 MCP 伺服器、定義介面與安全邊界。
- **Domain 3 — Claude Code Configuration & Workflows**：熟悉 CLAUDE.md 結構、技能/指令（slash commands）配置、以及在 CI/CD 中自動化 Claude Code 的流程。
- **Domain 4 — Prompt Engineering & Structured Output**：掌握提示分層、結構化輸出格式與多回合校驗、多實例/多次審查設計。
- **Domain 5 — Context Management & Reliability**：管理長互動時的上下文保存、來源可溯（provenance）、不確定性處理與訊息合併策略。

## 典型任務與題型

- 配置 subagent 的呼叫與上下文映射（Task Statement 1.3）
- 在團隊開發流程中整合 Claude Code（Scenario / Exercise）
- 為工具撰寫 CLAUDE.md 與自定義 slash command（Task Statement 3.1/3.2）
- 設計 CI/CD pipeline 以自動化測試與部署 Claude Code（Task Statement 3.6）

## 備考策略（具體可執行）

1. 以每個 Domain 分章複習：列出每個 Task Statement 的「輸入→預期輸出→檢驗方式」。
2. 實作練習（最重要）：建立小型專案，完成 CLAUDE.md、1 個自定義 slash command、並在 CI 流程中跑一次自動化測試。
3. 情境演練：模擬題目要求的設計決策，寫出簡潔的系統步驟與回復策略（可在限時內完成）。
4. 注意範圍：檔案列出 In‑Scope / Out‑of‑Scope，先熟記考試邊界避免浪費時間。
5. 考場技巧：先掃題、找關鍵任務陳述（Task Statement）、把時間分配在設計/驗證上，並在答案中寫出驗證步驟或回退計畫。

## 快速複習清單（打卡式）

- [ ] 能說明 subagent 呼叫流程與 error-handling
- [ ] 能寫出基本 CLAUDE.md 範本與模組化結構
- [ ] 能設計一個簡單的 MCP 工具整合流程
- [ ] 能提出 prompt 分割與結構化輸出樣式
- [ ] 能描述上下文持久化與 provenance 處理方法

## 結語
以實作為核心的準備最有效：讀題抓關鍵（Task Statement）、動手做範例、並把每個設計決策用短句列出驗證方法與回退策略。

需要我幫你把「每個 Domain 的重點做成可打卡的學習清單」或「生成 5 題模擬考題與參考答案」嗎？
