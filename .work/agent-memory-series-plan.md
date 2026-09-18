# 系列：AI Agent 記憶工程

SSOT for series planning. See also: research note at `/Users/vincent/Work/ai-agent-memory-systems-landscape-2026-08.md`

## 目標讀者

已在用 coding agent 或正在建 AI 應用的工程師/PM，想理解「記憶」的設計空間與選型取捨。

## 弧線

導讀 → 分類地圖 → 短期 context → 長期-工具端 → 長期-平台端 → 長期-開源端 → 深潛×2 → 安全 → 趨勢

## 篇目

| order | 主題 | 聚焦問題 | 狀態 |
|---|---|---|---|
| 0 | 系列導讀：AI Agent 記憶工程 | 這系列在講什麼、為什麼值得讀、路線圖 | 待寫 |
| 1 | 四種記憶與六個設計軸 | 記憶系統的設計空間長什麼樣？ | 待寫 |
| 2 | Context 滿了怎麼辦：七種答案 | Working memory 滿了各家怎麼處理？ | 已有，加 series frontmatter |
| 3 | 六家 Coding Agent 怎麼記東西 | 我每天用的工具，長期記憶怎麼設計？ | 待寫 |
| 4 | 五朵雲的記憶 API | 各家雲平台提供什麼記憶能力？ | 待寫 |
| 5 | 開源記憶框架選型 | 不被平台綁定，開源有什麼選擇？ | 待寫 |
| 6 | Mem0 完整介紹 | Mem0 怎麼運作？該放在架構哪裡？ | 已有，加 series frontmatter |
| 7 | OpenViking：Agent 記憶做成虛擬檔案系統 | 檔案系統式 vs 向量式有什麼不同？ | 已有，加 series frontmatter |
| 8 | Agent 記憶的攻擊面 | 記憶系統會被怎麼攻擊？怎麼防？ | 待寫 |
| 9 | 2026 記憶系統往哪走 | 這個領域的走勢和值得下的 bet？ | 待寫 |

## 斷崖處理

- 0→1：導讀收尾自然指向「先拿到地圖」
- 2→3：「壓縮顧的是這一次 session；但下一次打開呢？」
- 5→6：「接下來兩篇分別拆解光譜兩端的代表方案」
- 7→8：用攻擊場景 hook 開頭

## 站內交叉連結

- RAG 個性化（2026-03-12）→ 從 order 1 連結
- Session 持久化（2026-08-25）→ 從 order 3 連結
- CoALA 論文 → order 1 引用
- Anthropic harness 系列文 → order 2、4 引用
