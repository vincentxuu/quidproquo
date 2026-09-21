---
title: "AI Agent GitHub Digest — 2026-09-22"
date: 2026-09-22
category: daily
tags: [ai-agent, github, open-source, daily, agent-security, agent-memory, mcp-server]
lang: zh-TW
description: "今天上榜的不是新框架，是幫 agent 收拾責任邊界的基礎設施——政策引擎、記憶可攜、金融垂直範本、MCP 除錯工具都在補這一塊"
tldr: "Microsoft 開源 agent-governance-toolkit（6,303 星）把 tool call 攔截做成程式碼層強制執行，引用 ICLR 2025 論文（對 GPT-4o／Claude 3／Llama-3 的自適應攻擊 100% 成功率）反駁純提示詞防護；ai-memory 一個月從 2,900 星漲到 7,575，讓長期記憶能跨 20 多種 coding agent CLI 共用；anthropics/financial-services 把金融垂直 agent 同時發成 Cowork plugin 跟 Managed Agents API 範本，35,728 星；MCP 官方 Inspector 出到 v2.7.0，web／cli／tui 三個 client 統一成一支 binary；coder/coder 把 AI coding agent 塞進 Terraform 定義的受控工作環境，API key 不進 workspace。"
series:
  name: "AI Agent GitHub Digest"
  order: 38
---

## 今日亮點

今天候選清單裡沒有一個新框架，五個上榜的專案全在補同一塊：agent 已經好用到能放權限讓它做事，剩下的問題是怎麼替它的行為負責——Microsoft 把提示詞安全搬到程式碼層強制執行，Coder 把 agent 塞進 Terraform 定義的受控環境，MCP 官方除錯工具做到 v2，ai-memory 讓記憶不再綁死單一廠商，Anthropic 自己也把整套金融垂直 agent 同時發成 Cowork plugin 跟 Managed Agent API 範本。能力的競賽在往基礎設施收斂。

## Trending Repos

### microsoft/agent-governance-toolkit ⭐ 6,303

[GitHub](https://github.com/microsoft/agent-governance-toolkit)　·　Python（另有 TypeScript／.NET／Rust／Go SDK）　·　MIT

- **是什麼**：Microsoft 官方開源的 agent 治理框架，把「這個 tool call 准不准執行」從提示詞層搬到程式碼層——每一次工具呼叫、訊息傳送、委派都先經過 policy engine 攔截判定，通過才放行。
- **為什麼值得看**：README 直接引用學術數據反駁「靠提示詞防護就夠」——ICLR 2025 的論文對 GPT-4o、GPT-3.5、Claude 3、Llama-3 做自適應攻擊（有 logprob 存取、suffix 最佳化），成功率達 100%。AGT 的解法是把攔截做成「結構上不可能」而非「機率上不太會發生」：YAML／OPA／Cedar policy engine 判斷允許或拒絕，SPIFFE／DID／mTLS 做身分辨識，每個決策寫進防竄改稽核紀錄，還內建 MCP Security Gateway（掃描 tool poisoning、typosquatting、隱藏指令）跟 Shadow AI Discovery（抓沒登記的野生 agent）。目前是 Public Preview，GA 前可能有 breaking change。
- **tech stack**：Python 核心 + Rust 寫的 policy 決策引擎（fail-closed、無狀態）+ TypeScript／.NET／Rust／Go 官方 binding
- **上手難度**：低——`pip install "agent-governance-toolkit[full]"` 後兩行程式碼就能包住既有的 tool function，也能直接裝成 Claude Code plugin。

---

### akitaonrails/ai-memory ⭐ 7,575

[GitHub](https://github.com/akitaonrails/ai-memory)　·　Rust　·　MIT

- **是什麼**：一個獨立跑的記憶伺服器，讓 Claude Code、Codex、Cursor、Gemini CLI 等 20 多種 coding agent CLI 共用同一份長期記憶——[本專欄 8/20 期](https://quidproquo.cc/posts/daily/2026-08-20-ai-agent-github-digest)出現時是 2,900 星，一個月漲到 7,575，成長沒有慢下來。
- **為什麼值得看**：解的是「換 agent 就失憶」的痛點——中途從 Claude Code 切到 Codex，下一個 session 直接接手上次做到哪、失敗過哪些做法、還有哪些問題沒解決，不用重講一次架構。記憶來源是 git-backed 的純 markdown wiki，可以直接 `grep`、用 Obsidian 開、手動編輯；預設路徑完全不呼叫 LLM，capture／search／handoff 都能在沒有 API key 的情況下運作。團隊也能共用同一台伺服器，個人 session 跟專案知識分開存，還內建多人身分辨識跟稽核紀錄。
- **tech stack**：Rust 單一執行檔 + SQLite（可重建的衍生索引）+ 20 多種 CLI 的 lifecycle hooks 整合
- **上手難度**：中——要先自架伺服器（同一台筆電、家用小主機都行），再讓每個 agent CLI 掛上 hooks，設定一次後續是背景自動運作。

---

### anthropics/financial-services ⭐ 35,728

[GitHub](https://github.com/anthropics/financial-services)　·　Python　·　Apache-2.0

- **是什麼**：Anthropic 官方發的「Claude for Financial Services」——一整組針對投資銀行、股票研究、私募股權、財富管理工作流程寫好的 reference agent、skill 跟資料連接器。
- **為什麼值得看**：同一份系統提示跟 skill 用兩種方式部署——裝成 Claude Cowork plugin 直接用，或透過 Claude Managed Agents API（`/v1/agents`）接進自家的 workflow engine，邏輯不用重寫。命名 agent 包含 Pitch Agent（comps／precedents／LBO 一路做到品牌化 pitch deck）、Market Researcher（產業或主題→產業概況、競爭格局、同業比較、標的清單）、Earnings Reviewer（財報電話會議＋申報文件→更新模型→草擬報告）。README 也把責任邊界寫得很清楚：這些 agent 只產出給合格專業人士審核的草稿，不做投資建議、不執行交易、不過帳，每一筆輸出都要人工簽核。
- **tech stack**：Python + Claude Cowork plugin 格式 + Claude Managed Agents API
- **上手難度**：低——挑符合自己工作內容的 agent 裝上去，再依公司實際流程調整 prompt、skill、connector。

---

### modelcontextprotocol/inspector ⭐ 10,916

[GitHub](https://github.com/modelcontextprotocol/inspector)　·　TypeScript　·　MIT

- **是什麼**：MCP 官方維護的視覺化除錯工具，讓開發者用網頁、CLI 或 TUI 檢查一個 MCP server 到底註冊了哪些 tool／resource／prompt。
- **為什麼值得看**：v2 把過去分開的 web／cli／tui 三個 client 統一成一支 `mcp-inspector` launcher binary，設定方式從單純的 `--config` 拆成 `--config` 跟 `--catalog` 兩種，Node 引擎版本也跟著往上拉。v1 沒有被砍，改成只吃安全性修補的 legacy branch，繼續發到 npm 的 `v1-latest` tag，不逼舊使用者立刻遷移。最新的 2.7.0（9/16）把 OAuth 流程的每個 request 都加上逾時保護。
- **tech stack**：TypeScript monorepo（Vite + React + Mantine 網頁版、tsup 打包的 CLI／TUI，Ink + React 做 TUI 介面）
- **上手難度**：低——`npx @modelcontextprotocol/inspector` 直接開網頁版，加 `--cli` 或 `--tui` 切換介面。

---

### coder/coder ⭐ 16,345

[GitHub](https://github.com/coder/coder)　·　Go　·　AGPL-3.0

- **是什麼**：自架的雲端開發環境平台，workspace 用 Terraform 定義，再加上一個跑在 control plane、不是跑在使用者 workspace 裡的原生 AI coding agent。
- **為什麼值得看**：定位跟「幫你在本機開一個 agent」的工具不同——重點是企業要的可控性：agent 可以接 Anthropic、OpenAI、Google、Bedrock 或自架模型，但 API key 完全不進 workspace，每個動作都綁定使用者身分，模型用量、成本、稽核紀錄集中管理。workspace 本身透過 WireGuard 建安全通道，閒置自動關機省成本。對已經在用 Coder 管理開發環境、現在還想把 AI coding agent 一起納管的團隊，是同一套基礎設施就能做到，不用另外接一套 agent 平台。
- **tech stack**：Go + Terraform（workspace 定義）+ WireGuard（連線通道）+ AI Gateway（模型流量集中管理）
- **上手難度**：中——`curl -L https://coder.com/install.sh | sh` 能很快起一個本機 server，但正式環境要接 PostgreSQL、對外網址，還要寫 Terraform template，AI Gateway 等治理功能屬於進階設定。

## Notable Releases

今日無重要框架更新。逐一檢查了 watchlist 上的 13 個框架（LangGraph、CrewAI、Mastra、pydantic-ai、Agno、Claude Code、Composio、smolagents、LlamaIndex、DSPy、Haystack、browser-use、MCP spec），過去 48 小時內只有 LangGraph 1.2.12（純 bug fix／小功能，非 breaking）跟 llama_index 0.14.25（一批子套件的安全性修補）發版，都不到「重要新功能或 breaking changes」的門檻。

## 今日收穫

原以為 agent 生態的競爭還在拼模型能力和框架功能，但今天五個上榜的專案沒有一個是新框架——全部在補「怎麼安全、可控地把 agent 放進正式環境」這塊：政策引擎、金鑰隔離、記憶可攜性、跨廠商協定工具鏈成熟度。當 agent 已經好用到可以放權限讓它做事，下一步要解的問題就變成怎麼替它的行為負責，而不是它還能做到多聰明。

## 參考資料

- [microsoft/agent-governance-toolkit](https://github.com/microsoft/agent-governance-toolkit)
- [Andriushchenko et al., ICLR 2025（自適應攻擊 100% 成功率的論文）](https://arxiv.org/abs/2404.02151)
- [akitaonrails/ai-memory](https://github.com/akitaonrails/ai-memory)
- [本專欄 2026-08-20 期（ai-memory 當時 2,900 星）](https://quidproquo.cc/posts/daily/2026-08-20-ai-agent-github-digest)
- [anthropics/financial-services](https://github.com/anthropics/financial-services)
- [modelcontextprotocol/inspector](https://github.com/modelcontextprotocol/inspector)
- [modelcontextprotocol/inspector v2.7.0 Release Notes](https://github.com/modelcontextprotocol/inspector/releases/tag/2.7.0)
- [coder/coder](https://github.com/coder/coder)
- [langchain-ai/langgraph 1.2.12 Release Notes](https://github.com/langchain-ai/langgraph/releases/tag/langgraph%3D%3D1.2.12)
- [run-llama/llama_index v0.14.25 Release Notes](https://github.com/run-llama/llama_index/releases/tag/v0.14.25)
