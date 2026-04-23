# claude advisor artifact

- Provider: claude
- Exit code: 0
- Created at: 2026-04-21T08:37:43.001Z

## Original task

請用 haiku 模型（快速、精準）審查 docs/TODO.md 的合理性。重點：1) 還有哪些優先序問題？2) 有沒有遺漏的任務依賴？3) 哪些任務描述不夠清楚、執行時會卡住？給出具體建議，每點附上行號或任務名稱。

## Final prompt

請用 haiku 模型（快速、精準）審查 docs/TODO.md 的合理性。重點：1) 還有哪些優先序問題？2) 有沒有遺漏的任務依賴？3) 哪些任務描述不夠清楚、執行時會卡住？給出具體建議，每點附上行號或任務名稱。

## Raw output

```text
審查完成，以下是重點摘要：

---

## TODO.md 審查結果

### 1. 優先序問題（5 項高風險）

- **第 66-78 行** Blog 前端改版依賴第 82 行 CLAUDE.md（目錄規範），但 CLAUDE.md 排在後面——建議將第 82 行升為 P0
- **第 103+ 行** RAG Phase 1 的 P1 Harness 基礎建設（第 80-86 行）未完成前不該開始
- **第 89-91 行** Deterministic Validation Node → Critic 降級是串聯的，卻被寫成平行任務
- **第 156-164 行** 爬蟲整合驗證排 P2，但爬蟲不穩定會污染後續 RAG 資料，建議升 P1

### 2. 遺漏的任務依賴（6 項）

| 依賴關係 | 行號 |
|---------|------|
| `MAX_CHUNK_CHARS` 改完須重新 embed，但 RAG Phase 1 沒標此前置條件 | 第 41-42 行 vs 103+ 行 |
| 統一 tag 命名 → 自動 tag 建議 | 第 32 行 vs 140 行 |
| Series 系列化 → AI 驅動相關文章推薦 | 第 151 行 vs 138 行 |
| CI Gate → Pre-commit hook 執行順序未明確 | 第 36-37 行 |
| 批次回填完成 → 排程發布 | 第 55-58 行 vs 152 行 |

### 3. 描述不清楚（7 項會卡住的任務）

- **第 55-58 行**：批次回填的「抽樣規則」、「失敗回滾」未定義（git revert？D1 restore？）
- **第 66-78 行**：Task 1-14 完全無驗收條件（Icons 多少個？CSS tokens 移到哪？）
- **第 106 行**：Task 4 未指明 embed model、RRF 係數、batch 大小
- **第 123 行**：RAGAS baseline 的通過門檻未定（Faithfulness ≥ ? ）
- **第 127 行**：Semantic Cache 0.95 threshold 的命中率驗收條件缺失

### 立即建議的行動

1. 第 82 行升為 P0（Blog 改版的前置條件）
2. 第 55-58 行補：抽樣規則、失敗回滾機制、驗收門檻
3. 第 41-42 行後加註：「RAG Phase 1 前須確認 embed 重跑完成」
4. 第 103+ 行各 Task 補 TDD 驗收清單（指明改哪個檔案、預期輸出）
5. 第 138、151 行加依賴標記

```

## Concise summary

Provider completed successfully. Review the raw output for details.

## Action items

- Review the response and extract decisions you want to apply.
- Capture follow-up implementation tasks if needed.
