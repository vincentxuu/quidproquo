---
title: "Mem0 完整介紹：替 AI Agent 加上可控的長期記憶"
date: 2026-08-22
category: ai
type: deep-dive
tags: [mem0, memory, ai-agent, personalization, vector-database]
lang: zh-TW
tldr: "Mem0 是介於 agent 與儲存層之間的記憶服務：從對話抽出值得保留的事實，以 user、agent、run 分區，再於下一次生成前搜尋；優勢是 API 簡單，風險則是抽取錯誤、過期記憶與權限邊界。"
description: "從記憶抽取、分區、搜尋與刪除，到開源版和代管平台差異，完整說明 Mem0 的架構、用法、限制與適用情境。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-mem0-agent-memory-en)

[Mem0](https://docs.mem0.ai/platform/overview) 是 AI 應用程式的外接記憶層。它不替你執行 agent，也不是單純把完整對話塞進向量資料庫；它把互動轉成較短、可搜尋、可刪除的記憶，再於後續請求中取回相關項目。

如果想先理解 episodic、semantic、procedural memory 的差別，先看[〈AI Agent 記憶與個人化〉](/posts/ai/2026-03-12-memory-personalization)。這篇只回答 Mem0 本身怎麼運作、該放在架構哪裡，以及什麼時候不該用。

## 核心流程：寫入不是保存 transcript

```text
conversation / event
        │
        ▼
  fact extraction
        │
        ├── scope: user_id / agent_id / run_id
        ├── metadata
        ▼
 vector-backed memory store
        │ semantic / hybrid search
        ▼
 relevant memories → prompt → model response
```

`add` 的輸入可以是文字或訊息陣列。記憶層會抽出「使用者吃素」「專案改用 PostgreSQL」這類可重用事實，而不是要求每次查詢重讀所有聊天紀錄。查詢則必須帶身分範圍，否則個人化很容易變成跨使用者資料外洩。

```python
from mem0 import MemoryClient

memory = MemoryClient(api_key="your-api-key")

memory.add(
    [
        {"role": "user", "content": "我吃素，而且對堅果過敏。"},
        {"role": "assistant", "content": "我會記住飲食限制。"},
    ],
    user_id="user-123",
)

result = memory.search(
    "使用者有哪些飲食限制？",
    filters={"user_id": "user-123"},
)
```

這段採用目前 Platform v2 的 filter 形狀。Mem0 開源版與代管平台的 API 並非完全相同；照舊文章抄 `user_id` 到 `search()` 頂層，可能直接遇到 breaking change。

## 開源版與 Platform 是兩條路

**Mem0 Open Source** 把抽取和檢索放在你的應用程式程序內，LLM、embedding 與 vector store 由你設定。它適合資料不能交給另一個處理者、需要替換底層模型，或想控制成本與部署位置的團隊。代價是資料庫、升級、監控與刪除傳播都由你負責。

**Mem0 Platform** 提供代管 API、workspace、進階搜尋與治理功能。它縮短導入時間，但資料處理邊界多了一家供應商，而且功能與 OSS 不必然對等。例如官方遷移文件指出，Platform 沒有和 OSS 相同的 `update()` 路徑，更新可能要用 delete + add 表達。

更容易踩坑的是「Mem0 架構」會隨版本變動。官方的新 OSS memory algorithm 已改為 ADD-only extraction，檢索結合 semantic、BM25 與 entity matching，並移除原本 OSS graph store 設定。評估時要鎖定文件版本，不要把舊版 graph memory、目前 Platform 與目前 OSS 當成同一套能力。

## Mem0 解決什麼，不解決什麼

Mem0 適合保存偏好、人物關係、已確認的專案事實，以及跨 session 仍有價值的互動摘要。它替應用省下記憶抽取、分區、搜尋、history 與 CRUD 的通用工程。

它不會自動保證四件事：

- 抽出的事實是真的，而不是模型誤解一句玩笑；
- 新記憶一定能正確取代舊記憶；
- 搜到的記憶適合在當下回答中使用；
- `user_id` 是可信任的，而不是 client 任意傳入。

因此 production 寫入最好保留來源事件、抽取版本與時間。敏感類別需要確認或禁止自動保存；刪除帳號時，要測試 memory、向量、event history 與備份是否一起處理。

## 跟 Zep、Cognee、Letta 怎麼分

- 想用最小 API 替既有 agent 加一層個人化記憶：Mem0 最直接。
- 事實會隨時間失效，而且「何時成立」是查詢的一部分：Zep／Graphiti 的時序圖更貼題。
- 要把大量文件轉成可自訂 pipeline 的知識圖：Cognee 的資料處理面較完整。
- 要的是能自改 memory block、管理 context window 的完整 stateful agent runtime：Letta 更接近那個問題。

這不是功能數量排名。真正的決策是你要外掛 memory API、時間圖、知識處理 pipeline，還是一整個 agent runtime。

## 上線前的最小測試

用同一位測試使用者寫入三組互相衝突的偏好，再逐次查詢：舊事實是否仍出現、結果有沒有來源與時間、刪除後是否還能被搜尋。接著換另一個 `user_id` 重問一次，確認結果為空。這組測試比 demo 裡「記住我喜歡披薩」更接近 production 風險。

## 參考資料

- [Mem0 Platform Overview](https://docs.mem0.ai/platform/overview)
- [Mem0 Platform Quickstart](https://docs.mem0.ai/platform/quickstart)
- [Mem0 OSS REST API Server](https://docs.mem0.ai/open-source/features/rest-api)
- [Mem0 OSS New Memory Algorithm Migration](https://docs.mem0.ai/platform/features/graph-memory)
- [Mem0 OSS to Platform Migration](https://docs.mem0.ai/migration/oss-to-platform)
