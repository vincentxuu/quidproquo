---
title: "AI Agent GitHub Digest — 2026-10-11"
date: 2026-10-11
category: daily
tags: [ai-agent, github, open-source, daily, mcp-server, agent-platform, model-inference]
lang: zh-TW
description: "appwrite 重新定位成「agent 專用雲」、sglang 的 trending 反映 agentic workload 已成推理框架的優化重點；agno v3.1.2 補上對話壓縮和 Codex adapter"
tldr: "appwrite/appwrite（57,624★）從開發者後端 BaaS 轉型成直接開 MCP 介面給 agent 呼叫的雲；DeusData/codebase-memory-mcp（46,293★）用 AST＋知識圖譜取代 embedding 式 RAG，單一 binary 把整個 codebase 索引成可查詢的 MCP server；Yeachan-Heo/oh-my-claudecode（39,768★）幫 Claude Code 補上原生沒有的 multi-agent 團隊編排層；sgl-project/sglang（36,965★）這波 trending 顯示 agentic workload 的 serving 需求已經是推理框架要優先優化的目標。agno v3.1.2 加入 Conversation Compaction 把舊對話摺成摘要，還新增了 Codex External Agent adapter。"
series:
  name: "AI Agent GitHub Digest"
  order: 57
---

> 🌏 [English version](/en/posts/daily/2026-10-11-ai-agent-github-digest-en)

## 今日亮點

今天上榜的四個 repo 有三個是基礎設施層的動作——appwrite 把自己從開發者後端重新定位成「agent 專用雲」、codebase-memory-mcp 用知識圖譜取代 embedding 式 RAG 去索引程式碼、sglang 的推理框架在優化 agentic workload 而不只是單輪聊天；只有 oh-my-claudecode 是應用層的 multi-agent 編排工具。基礎設施廠商開始主動重新設計介面給 agent 用，而不是被動等 agent 來呼叫。

## Trending Repos

### appwrite/appwrite ⭐ 57,624

[GitHub](https://github.com/appwrite/appwrite)　·　TypeScript　·　BSD-3-Clause

- **是什麼**：原本是給開發者用的開源後端 BaaS（Auth／Database／Storage／Functions／Messaging／Realtime），現在整個定位改成「開源的 agent 與開發者雲」，同一套服務直接開 MCP 介面讓 AI agent 呼叫。
- **為什麼值得看**：多數 agent 框架（LangGraph、CrewAI 等）要接資料庫、auth、檔案儲存都得自己兜方案；appwrite 把這些基礎設施打包好、再疊一層 MCP，agent 可以直接呼叫「幫我建一個使用者」「存這個檔案」而不用先學各家 SDK，對做 agent SaaS 原型的人省掉「後端要選什麼」這一層決定。
- **Tech stack**：Appwrite 自家 Function runtime + MCP gateway + 多語言 SDK
- **上手難度**：中——自架需要 Docker／Kubernetes，官方也提供雲端版本可以直接接，不用自己維運。

---

### DeusData/codebase-memory-mcp ⭐ 46,293

[GitHub](https://github.com/DeusData/codebase-memory-mcp)　·　C　·　MIT

- **是什麼**：一個 MCP server，把整個 codebase 索引成一份持久化的知識圖譜，查詢是 sub-ms 級，支援 158 種語言，單一靜態 binary、沒有額外依賴，官方宣稱比把原始檔案整包塞進 context 省下 99% 的 token。
- **為什麼值得看**：多數「codebase RAG」工具要你自己架 vector DB、自己管 embedding pipeline；這個直接用 AST（tree-sitter）解析加知識圖譜查詢取代 embedding 式檢索，裝一個 binary 就能跑，對不想維護額外 infra 的 coding agent 使用者是更直接的解法。
- **Tech stack**：Tree-sitter AST 解析 + 知識圖譜（Cypher 查詢）+ SQLite 儲存，單一 C 語言 binary
- **上手難度**：低——下載對應平台的 binary 跑 install script，裝進 Claude Code／Cursor／Codex 等的 MCP 設定即可使用。

---

### Yeachan-Heo/oh-my-claudecode ⭐ 39,768

[GitHub](https://github.com/Yeachan-Heo/oh-my-claudecode)　·　TypeScript　·　MIT

- **是什麼**：給 Claude Code 用的 multi-agent 編排層，主打「teams-first」——同一個任務可以拆成多個子 agent 平行跑，作者也維護對應的 oh-my-codex 版本給 Codex 使用者。
- **為什麼值得看**：Claude Code 原生的 subagent 機制要自己寫設定才能組出團隊協作流程；這個包好一套 team 模板和平行執行邏輯，星數在約 9 個月內衝到快 4 萬，顯示「幫 Claude Code 補 multi-agent 編排」這個需求本身就很大。
- **Tech stack**：TypeScript + npm 套件包裝 Claude Code 的 subagent／hook API
- **上手難度**：低——npm 全域安裝後跑一個 setup 指令即可開始用。

---

### sgl-project/sglang ⭐ 36,965

[GitHub](https://github.com/sgl-project/sglang)　·　Python　·　Apache-2.0

- **是什麼**：開源的 LLM／多模態模型推理框架，針對 agentic workload、大規模 serving 和 RL rollout 做最佳化，內建 SGLang Diffusion 做圖片／影片生成。
- **為什麼值得看**：這次重新衝上 trending，反映的是「agentic workload」（大量平行、長 context 快取的小請求）本身已經變成推理框架要優先優化的場景，不再只是單輪聊天那種負載模式，是 vLLM 之外另一個被大量生產環境採用的推理引擎。
- **Tech stack**：Python + 自家 RadixAttention 前綴快取 + CUDA kernel 最佳化
- **上手難度**：中——單機用 `uv pip install sglang` 就能跑起來，但要發揮完整效能通常需要 GPU cluster 環境。

## Notable Releases

### Agno v3.1.2

[Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.1.2)

- **重要變更**：新增 Conversation Compaction（`Agent(compaction=True)`），把長對話中較舊的輪次摺成摘要存進新的 `agno_compactions` 表，原始訊息不會被改寫，隨時能還原完整對話；新增 `CodexAgent`，把 OpenAI Codex 接進來當外部 agent adapter，跟既有的 Claude Agent SDK、LangGraph、DSPy 等adapter並列；新增 `HyDE` query transformer，用假設性答案去搜尋知識庫而不是直接用原始問題搜；新增 `AgentOS(cors=CORSConfig(...))` 讓 CORS 政策同時套用到 preflight、公開 run／cancel、WebSocket 和 MCP alias。
- **Breaking Changes**：無明確列出的 breaking change，但 Compaction 和新 adapter 都是選擇性啟用的新功能，預設行為不變。
- **對你的影響**：如果你的 agent session 常跑到塞爆 context window，Compaction 可以直接解決，不用自己寫摘要邏輯；如果團隊同時在用 Claude Code 和 Codex，CodexAgent adapter 讓兩邊可以用同一套 Agno 介面呼叫。

## 今日收穫

之前以為 agent 生態的創新大多發生在應用層（新框架、新 skill），但今天看到的四個 trending repo 有三個其實是基礎設施層的動作——資料庫後端、程式碼索引、推理引擎都在重新設計自己的介面給 agent 用，顯示基礎設施廠商已經不只是被動等 agent 來呼叫，而是主動把 MCP 和 agent workload 當成一等公民去優化。

## 參考資料

- [appwrite/appwrite](https://github.com/appwrite/appwrite)
- [DeusData/codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp)
- [Yeachan-Heo/oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode)
- [sgl-project/sglang](https://github.com/sgl-project/sglang)
- [Agno v3.1.2 Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.1.2)
