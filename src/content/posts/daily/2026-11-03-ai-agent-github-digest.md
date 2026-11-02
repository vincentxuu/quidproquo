---
title: "AI Agent GitHub Digest — 2026-11-03"
date: 2026-11-03
category: daily
tags: [ai-agent, github, open-source, daily, agent-memory, mcp, model-serving]
lang: zh-TW
description: "記憶層擴大到幾乎所有 coding agent、平行 worktree 不再打結、Unreal Editor 整個變成 MCP 工具、290B 模型塞進一張遊戲顯卡——今天四個 repo 各補了 agent 基礎設施一層"
tldr: "**thedotmack/claude-mem**(⭐110k)是給 agent 用的常駐記憶壓縮系統,今天把相容清單擴大到 Grok Bot／T3 Code／Antigravity CLI／OMP／Pi／DeepSeek Harness,幾乎吃下市面上叫得出名字的 coding agent；**max-sixty/worktrunk**(⭐9.9k)用 Rust 把 git worktree 操作簡化成三個指令,解決平行跑多個 agent 時『開一個新工作目錄要打三次分支名』的麻煩；**db-lyon/ue-mcp**(⭐466)把整個 Unreal Editor 暴露成 MCP 工具,2114+ 個動作裡 830 個直接呼叫 Epic 官方原生 AI Toolset；**FlashML-org/FreeToken**(⭐16k)是 edge-native 的 MoE 推理引擎,想讓 290B+ 參數的前沿開放權重模型在一般遊戲電腦上跑出互動速度。今天沒有重要框架 release。"
series:
  name: "AI Agent GitHub Digest"
  order: 80
---

> 🌏 [English version](/posts/daily/2026-11-03-ai-agent-github-digest-en)

## 今日亮點

今天上榜的四個 repo 剛好補齊了 agent 基礎設施的四層:claude-mem 把記憶層的相容清單又拉長一輪,幾乎吃下所有叫得出名字的 coding agent;worktrunk 解決平行跑多個 agent 時 git worktree 操作太囉嗦的協作層問題;ue-mcp 把整個 Unreal Editor 暴露成 MCP 工具,補上遊戲引擎操作層;FreeToken 則想在推理層讓一般遊戲電腦也能跑 290B 的前沿模型。四個都不是在比模型聰不聰明,是在比 agent 真正被大量使用之後,各層基礎設施扎不扎實。

## Trending Repos

### thedotmack/claude-mem ⭐ 110k

[GitHub](https://github.com/thedotmack/claude-mem)　·　TypeScript　·　Apache-2.0

- **是什麼**：一個給 Claude Code 等 agent 用的常駐記憶壓縮系統,自動擷取每個工作階段(session)裡的工具呼叫觀察,用 AI 壓縮成語義摘要,下一次對話開始時自動注入回上下文,讓 agent 跨 session 記得之前做過什麼。
- **為什麼值得看**：今天的更新重點不是功能本身,是它支援的 harness 清單又擴大了一圈——除了 Claude Code,現在還支援 Grok Bot、OpenCode 2、T3 Code(同時管 Codex 與 Claude Code 兩種 provider)、Antigravity CLI、OMP(Oh My Pi)、Pi、DeepSeek Harness,幾乎把市面上叫得出名字的 coding agent 都接上了同一套記憶層。安裝時可選官方代管記憶服務(30 天免費試用)或自己接 OpenRouter／Gemini／Anthropic key。
- **tech stack**：TypeScript + npm 套件,透過各 harness 的 hook 機制或監看 log 檔案擷取事件,官方代管記憶服務 + BYOK 兩種模式
- **上手難度**：低——`npx claude-mem install` 一行裝完,免登入也能跑(指定 `--provider` 或設 `CLAUDE_MEM_ONLINE_OPTIN=false`)

---

### max-sixty/worktrunk ⭐ 9.9k

[GitHub](https://github.com/max-sixty/worktrunk)　·　Rust　·　MIT OR Apache-2.0

- **是什麼**：一個 CLI,把 git worktree(讓每個 agent 有自己獨立的工作目錄,彼此不會互改到對方檔案)的操作簡化成像操作 branch 一樣簡單。
- **為什麼值得看**：原生 git worktree 開一個新工作目錄得打三次分支名(`git worktree add -b feat ../repo.feat` 再 `cd ../repo.feat`),對一次平行跑 5-10 個 agent 的場景很不順手。Worktrunk 把這些收成三個核心指令,還附加 hook 自動化本機工作流程、以及 copy-on-write build cache 讓每個 worktree 不用重跑一次完整 build。發布不到一年已衝到近 1 萬星,作者稱已是目前最受歡迎的 git worktree 管理工具。
- **tech stack**：Rust 核心,worktrunk.dev 文件站,內建 CI／Codecov 整合
- **上手難度**：中——需要先熟悉 git worktree 概念,裝好後三個指令可以取代一整串原生 git 操作

---

### db-lyon/ue-mcp ⭐ 466

[GitHub](https://github.com/db-lyon/ue-mcp)　·　C++ + TypeScript　·　MIT

- **是什麼**：一個 MCP server,讓 AI assistant 透過 MCP 協定直接讀寫 Unreal Engine 編輯器——藍圖、材質、關卡、動畫、VFX、地景、PCG、音訊、UI、物理、導航、AI、StateTree、GAS、網路、Sequencer、build pipeline 全部可以用自然語言操作。
- **為什麼值得看**：30 個工具類別、2114+ 個動作,其中 1284+ 是 ue-mcp 自己寫的,其餘 830 個是直接呼叫 Epic 官方在 UE 5.8+ 內建的 AI Toolset Registry(原生工具,不是重新包一層)。架構是 TypeScript/Node.js 的 MCP server 透過 WebSocket+JSON-RPC 接一個裝進 Unreal Editor 的 C++ bridge plugin;檔案系統讀取(INI 設定、C++ header、資產清單)連編輯器都不用開就能做,等於 agent 可以先探勘專案再決定要不要真的動手。這是繼 Blender、Unity 之後,遊戲引擎類 MCP server 補上 Unreal 這一塊。
- **tech stack**：C++ bridge plugin(裝在編輯器內)+ TypeScript/Node.js MCP server,WebSocket JSON-RPC 橋接,YAML flow engine 跑多步驟工作流,npm plugin 系統可擴充
- **上手難度**：中——`npx ue-mcp init` 自動找 `.uproject`、部署 C++ bridge plugin、設定 MCP client,但裝完要重開一次編輯器讓 bridge plugin 生效,plugin 編譯失敗是最常見的卡關點

---

### FlashML-org/FreeToken ⭐ 16k

[GitHub](https://github.com/FlashML-org/FreeToken)　·　Python　·　Apache-2.0

- **是什麼**：一個 edge-native 的 MoE(Mixture-of-Experts)推理引擎,目標是讓 290B+ 參數的前沿開放權重模型(DeepSeek-V4-Flash、Qwen3.6-35B-A3B、GLM-5.2 等)能在一般遊戲電腦上跑出互動速度。
- **為什麼值得看**：把 GPU、CPU、主記憶體、互聯通道都當成一個彈性的推理平台統一調度——bandwidth-adaptive 的 CPU-GPU 協同執行、全層 double-buffered prefill streaming、全域 LRU expert 快取,外加「語義感知快取」:agent 常見的工具呼叫、思考區塊編輯不用整段重算 KV cache。對外提供 Anthropic/OpenAI 相容 API,Codex、Claude Code、OpenCode 等 coding agent 可以直接接上。團隊背景紮實——論文作者包含 Databricks 的 Matei Zaharia 與 UC Berkeley 的 Ion Stoica(Spark、Ray 原始作者之一),設計上也坦承是從 SGLang 的 mini-sglang 分支改出來的。
- **tech stack**：Python + uv 套件管理,桌面版有 Windows/Linux GUI,原生支援 NVIDIA RTX 30/40/50 系列消費級顯卡
- **上手難度**：中——桌面版下載即用,CLI 版要自己裝 uv 環境,且目前只支援 NVIDIA 消費顯卡

## Notable Releases

今日無重要框架更新——B2 watchlist 13 個框架裡,crewAI 1.15.34(11-01 發布)雖然落在 48 小時窗內,但內容是補寫「1.15.29 版已移除舊 agent executor」的遷移說明文件,而非這版新增的 breaking change;其餘新功能(`crewai skill search`、`run --inputs`)在 1.15.33 已出現過,未達新增門檻。Haystack v2.31.1-rc1(11-02)只是把 `anyio`／`certifi` 兩個傳遞依賴的版本下限拉高以修補上游 CVE,屬安全性修補而非框架功能變更。其餘框架(langgraph、pydantic-ai、agno、claude-code、composio 等)皆在窗外或純 patch 版號遞增。

## 今日收穫

之前覺得 MCP server 的戰場主要在雲端服務(接 Notion、Slack、Gmail 那種),但 ue-mcp 2114+ 個動作裡八百多個是直接呼叫 Epic 官方原生工具這件事提醒我,MCP 正在往「把整個重量級桌面應用的既有 API 整個暴露出來」這個方向長,不只是幫你少寫一個 API wrapper。

## 參考資料

- [thedotmack/claude-mem — GitHub repo](https://github.com/thedotmack/claude-mem)
- [thedotmack/claude-mem — README](https://raw.githubusercontent.com/thedotmack/claude-mem/main/README.md)
- [max-sixty/worktrunk — GitHub repo](https://github.com/max-sixty/worktrunk)
- [max-sixty/worktrunk — README](https://raw.githubusercontent.com/max-sixty/worktrunk/main/README.md)
- [db-lyon/ue-mcp — GitHub repo](https://github.com/db-lyon/ue-mcp)
- [db-lyon/ue-mcp — README](https://raw.githubusercontent.com/db-lyon/ue-mcp/main/README.md)
- [FlashML-org/FreeToken — GitHub repo](https://github.com/FlashML-org/FreeToken)
- [FreeToken 論文（arXiv 2608.16157）](https://arxiv.org/abs/2608.16157)
- [crewAIInc/crewAI 1.15.34 release notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.34)
- [deepset-ai/haystack v2.31.1-rc1 release notes](https://github.com/deepset-ai/haystack/releases/tag/v2.31.1-rc1)
