---
title: "用 LLM 做知識管理：從 Karpathy 的 llm-wiki 到開源生態全覽"
date: 2026-04-23
category: ai
tags: [llm-wiki, knowledge-management, karpathy, obsidian, cloudflare, second-brain]
lang: zh-TW
tldr: "Karpathy 在 2026 年提出 llm-wiki 模式，讓 LLM 主動維護 markdown wiki 而非每次從頭 RAG；目前已有 100+ 開源實作，從本機 CLI 到 serverless Telegram bot 各有差異。"
description: "整理 Karpathy llm-wiki 模式的核心概念，以及目前開源社群的 100+ 個衍生專案，按自動化程度與部署方式分類比較。"
draft: false
---

2026 年 4 月，Andrej Karpathy 在 X 上分享了一個工作流轉變：他不再只用 LLM 生成程式碼，而是用它來建立並維護個人知識庫。他把這套做法叫做 **llm-wiki**，原始 gist 幾天內突破 5000 星。

這篇文章整理 llm-wiki 的核心概念，以及目前開源社群圍繞它長出的生態。如果你對 Karpathy 框架本身和三種實踐模式（知識庫 / 經驗庫 / 部落格）有興趣，可以先看 [[llm-knowledge-vault]]。

## 問題：RAG 的根本限制

大多數人用 LLM 處理文件的方式都是 RAG（Retrieval-Augmented Generation）：把檔案丟進去，每次提問時模型從向量庫撈相關段落，再拼出答案。

這有個根本問題：**知識沒有累積**。每次問問題，模型都在從零重新發現相同的事情。遇到需要跨五份文件綜合的問題，模型要重新找、重新理解、重新拼接。沒有記憶，沒有沉澱。

更實際的問題是：你存進 Obsidian 或 Notion 的東西，三個月後你只記得「好像在哪裡看過」，卻找不到、說不清重點是什麼。

## llm-wiki 模式的核心思路

Karpathy 的解法不是更好的 RAG，而是完全換個方向：

> 讓 LLM 事先把原始資料提煉成結構化的 wiki，而不是每次查詢時重新處理原始資料。

具體做法：
1. 原始資料（文章、影片逐字稿、PDF）放進 `raw/`
2. LLM agent 讀取原始資料，提取知識，寫成互連的 markdown wiki 頁面放進 `wiki/`
3. 之後查詢時，模型讀的是已整理好的 wiki，而不是原始資料

wiki 會隨著新資料進入持續更新，知識是**累積的**，不是每次從零開始。

這跟 RAG 的差異在一個關鍵細節：RAG 是查詢時即時處理，llm-wiki 是攝取時預先提煉。前者每次都要重新發現，後者讓知識沉澱下來。

## 開源生態現況

GitHub 上 `llm-wiki` topic 目前有 **102 個**公開 repo，以下依特性分類。

### 直接實作 Karpathy 模式

**[lucasastorian/llmwiki](https://github.com/lucasastorian/llmwiki)**（623 stars）  
最完整的 web UI 實作。上傳文件，透過 MCP 連接 Claude，自動寫入 wiki。後端用 Supabase，有完整的 web 介面，不需要懂指令列。

**[Astro-Han/karpathy-llm-wiki](https://github.com/Astro-Han/karpathy-llm-wiki)**（589 stars）  
Agent Skills 相容，支援 Claude Code、Cursor、Codex。以 citation 為中心，每個 wiki 頁面都能追溯來源，並內建 lint 系統確保知識庫健康。

**[swarmclawai/swarmvault](https://github.com/swarmclawai/swarmvault)**（260 stars）  
Local-first，加入了 knowledge graph 和 hybrid search（keyword + embeddings），同時支援 MCP server 供 Claude Code / Codex / OpenCode 使用。

**[SamurAIGPT/llm-wiki-agent](https://github.com/SamurAIGPT/llm-wiki-agent)**（2.2k stars）  
目前 stars 最多的實作。Drop sources，Claude/Codex/Gemini 自動建立 interlinked wiki，不需要 API key（跑在 Claude Code 訂閱下）。

### 全本機、零外送

**[kytmanov/obsidian-llm-wiki-local](https://github.com/kytmanov/obsidian-llm-wiki-local)**（289 stars）  
完全 local，用 Ollama 跑模型。丟 markdown 筆記進去，AI 提取概念並在 Obsidian 裡自動建立互連。資料完全不離開本機。

**[Pratiyush/llm-wiki](https://github.com/Pratiyush/llm-wiki)**（148 stars）  
從 Claude Code / Codex / Cursor / Gemini 的 session 歷史自動提取知識，同時可生成 static site 方便瀏覽。

### Serverless + 行動端

**[walle45611/LLM-Wiki-Worker](https://github.com/walle45611/LLM-Wiki-Worker)**  
在這批專案裡最特別的組合：Cloudflare Worker + Queue 處理 webhook timeout、GitHub 作為知識庫後端、Obsidian 本地雙軌編輯、Telegram 作為查詢介面。整個系統幾乎零成本（CF Workers free tier）。

架構核心是用 Queue 解決 serverless 的限制——Telegram webhook 30 秒就 timeout，但知識查詢往往需要更長時間，所以任務進 queue，背景處理後再回覆。

### 更廣義的 LLM 知識管理

除了 llm-wiki 模式，還有幾個不同路線的成熟專案：

**[khoj-ai/khoj](https://github.com/khoj-ai/khoj)**  
目前最接近「完整產品」的開源選項。Self-hostable，支援 PDF/Notion/Org-mode，可接本地 LLM（llama、qwen、mistral）或雲端模型（GPT、Claude、Gemini），內建 web 搜尋、deep research、排程自動化。跟 llm-wiki 的差異在於它是完整平台，而不是純粹的 wiki 模式。

**[rmusser01/tldw_server](https://github.com/rmusser01/tldw_server)**（1.3k stars）  
開源版 NotebookLM。YouTube / PDF / 網頁多模態摘要，存成個人研究資料庫。比較偏向「摘要存檔」而不是「知識重構」。

**[memex-lab/memex](https://github.com/memex-lab/memex)**  
Flutter app，文字/照片/語音都能輸入，multi-agent 自動組織，全 local-first。定位比較像生活記錄，不限技術內容。

## 各方案的核心取捨

```
自動程度
  高 │ llm-wiki-agent  LLM-Wiki-Worker  khoj
     │ swarmvault       memex
     │
  低 │ obsidian-ava    silverbullet
     └──────────────────────────────── 部署複雜度
        低（本機）              高（serverless）
```

選擇上的幾個關鍵問題：

**資料要不要離開本機？**  
如果不行，選 `obsidian-llm-wiki-local`（Ollama）或 `memex`。如果可以接受，選擇就多很多。

**有沒有固定查詢介面需求？**  
想用手機隨時查 → Telegram bot（LLM-Wiki-Worker）；只在電腦上用 → Claude Code plugin 型；想要 web UI → llmwiki 或 khoj。

**想要完整平台還是單純 wiki 模式？**  
khoj 功能最完整但複雜度也最高。llm-wiki-agent 最輕，就是 drop sources + 自動 wiki，沒有額外功能。

## 整體來說

llm-wiki 解決的問題很真實：你累積了大量讀過、看過的東西，但需要它時找不到、串不起來。這個模式的核心洞見是——與其每次查詢時讓 AI 重新理解原始資料，不如讓 AI 事先把知識提煉成可以被查詢的形式。

目前這個生態還很早期，多數專案都是個人或小團隊在過去幾個月內快速開發的。整體方向是對的，但穩定性和長期維護性還有待觀察。值得關注 `khoj`（最成熟）和 `llm-wiki-agent`（最純粹），再依自己的部署偏好選擇變體。

---

## 參考資料

- [Karpathy llm-wiki 原始 gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
- [lucasastorian/llmwiki](https://github.com/lucasastorian/llmwiki)
- [Astro-Han/karpathy-llm-wiki](https://github.com/Astro-Han/karpathy-llm-wiki)
- [SamurAIGPT/llm-wiki-agent](https://github.com/SamurAIGPT/llm-wiki-agent)
- [swarmclawai/swarmvault](https://github.com/swarmclawai/swarmvault)
- [kytmanov/obsidian-llm-wiki-local](https://github.com/kytmanov/obsidian-llm-wiki-local)
- [walle45611/LLM-Wiki-Worker](https://github.com/walle45611/LLM-Wiki-Worker)
- [khoj-ai/khoj](https://github.com/khoj-ai/khoj)
- [rmusser01/tldw_server](https://github.com/rmusser01/tldw_server)
- [GitHub llm-wiki topic](https://github.com/topics/llm-wiki)
- [GitHub personal-knowledge-management topic](https://github.com/topics/personal-knowledge-management)
