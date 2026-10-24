# 審稿紀錄：AI Agent 的資安工具怎麼分（series order 0）

審稿日：2026-10-24。審稿者是沒有參與撰寫的獨立 agent，報告全文在 session scratchpad（`review-verify.md`、`review-structure.md`），摘要如下。

## post-verify

獨立查證，回一手來源（Adversa 全文、baldur.dk 全文、MalSkillBench HTML 全文、Claude Code hooks 官方 markdown 與 sandboxing 頁、AgentDojo 論文）。

| 問題 | 處理 |
|---|---|
| ❌ 無 | — |
| 🟡 「Adversa 8 個都關閉 LLM」不精確：純 LLM 判斷的 skillcop 另用本機模型測 | 已改成「7 個離線…／另一個純 LLM 另測」的說法；A0 只保留「每一個都讓至少一個惡意 skill 通過，有的被繞過、有的幾乎不檢查」 |
| 🟡 AgentDojo 也評了 prompt injection detector | 已改成「量整條 agent 被注入時的攻擊成功率與任務可用性」 |
| 🟡 「四個入口、七類」是作者分類被寫成事實 | 已在標題層、tldr、小節標題改成「我把…分成」，內文註明「本系列自己的歸納」 |
| 🟡 Adversa 「賣」同類產品 | 已改成「自己也做同類的掃描器」 |
| ✅ Claude Code hook 預設放行、沙箱預設關閉且只包 shell | 措辭貼合官方原文 |
| ✅ MalSkillBench 21.6%／87.9%、Strix 案例、OWASP／AgentDojo 連結 | — |
| 英文版一致性 | 逐段一致，已同步修改 |

## post-review

對照規劃表 order 0 範圍卡與斷崖報告。

| 項目 | 處理 |
|---|---|
| tldr 與標題把「每一類」「共通」寫得比證據大 | 已改成「反覆出現的限制」，tldr 縮到有證據的範圍 |
| A0 提前使用 hook 而未定義 | 已用白話定義（動作前先跑的檢查腳本），移除 `onFailure` 與版本號，留給第 3 篇 |
| 結語沒有做得出來的動作 | 已改成「今晚先做」：`ls ~/.claude/skills`、看 MCP 設定、畫四個入口並各寫一行 |
| 入口與工具類別缺對應 | 入口表新增第三欄「本系列的對應工具」，並註明是作者歸納 |
| 範例沒帶讀者找自己的目錄 | 入口表前加一句對應到 `~/.claude/skills/`、`.mcp.json`、repo |
| 自我檢查沒有成題 | 週末例子改成先提問、再給答案 |
| 第七類歸入「測試自己做的東西」說不通 | 已改寫：第七類是同一件事的延伸、對象可以是別人 |
| 七類清單未標第幾篇 | 每項加「（第 N 篇）」，並說明預計九篇陸續發表 |
| 限制一引 Adversa 未標利益關係 | 已補「Adversa 自己也做同類的掃描器」 |
| mermaid 圖 | 節點標籤加時間點，第二部分標題註明「並列沒有先後」；是否改為手寫 SVG（diagram skill）列為可選 |
| 系列後續篇章尚未存在 | 改成「預計九篇，陸續發表」；整篇維持 `draft: true`，直到使用者確認與後續篇章排程 |

## post-polish

| 指標 | 結果 |
|---|---|
| 長句、但書密度、引述區塊、數字密度、模板化轉折、姓名當主詞 | 全部 0 或綠 |
| 「不是 A 而是 B」「與其…不如」重複結論 | 已刪（情境段的修辭句、結語改為直接動作） |
| 「召回率」「野外子集」黑話 | 召回率就地加括號白話；「野外」改「真實環境蒐集到的樣本」 |
| 限制一第二句塞兩件事 | 已拆成兩句 |
| 腳本沒有的詞：子行程、不預警 | A0 不含；A1 已改（見該篇紀錄） |
| 英文版 | "stretch" 全部改為 "stage"；其餘自然 |
| 機械檢查 | check-tw-terms 0 blocking、check-process-leak 通過、scan-ledger 三區皆空、新文章無引用警告 |
