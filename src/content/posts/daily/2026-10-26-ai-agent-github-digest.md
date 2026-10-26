---
title: "AI Agent GitHub Digest — 2026-10-26"
date: 2026-10-26
category: daily
tags: [ai-agent, github, open-source, daily, multi-agent, mcp, coding-agent]
lang: zh-TW
description: "PrimeIntellect 把可編程子代理和可控自我改進做進一個 coding harness，微軟研究院反過來證明不靠中央協調也能把 agent 規模推到上千個——今天的 GitHub trending 在吵『agent 一多怎麼不失控』"
tldr: "**PrimeIntellect-ai/prime-agent**（⭐ 22,325）用「Recursive Language Model」把上下文當變數、子代理當函式呼叫，外加可回滾的自我改進 harness；**microsoft/Agensh**（⭐ 238）開源微軟研究院的去中心化多代理人系統，無中央協調者就把規模推到 1,024 個 agent，Pandoc 任務測試通過率因此多出四到五成；**finereli/whatsapp-mcp**（⭐ 375）把 WhatsApp 讀取包成唯讀 MCP server，老實講清楚誰能看到你的訊息。Release：Claude Code v2.1.310 新增 Monitor 工具與多平台外掛監控。"
series:
  name: "AI Agent GitHub Digest"
  order: 72
---

> 🌏 [English version](/posts/daily/2026-10-26-ai-agent-github-digest-en)

## 今日亮點

今天的 Trending Repos 都在解同一個問題——「agent 一多就會失控」。PrimeIntellect 把「可編程子代理＋可受控的自我改進」做進單一 coding harness；微軟研究院反過來證明「不要中央協調者」也能把規模推到上千個 agent；個人開發者 finereli 的 WhatsApp MCP 則示範了「讀取使用者私有資料的 agent 工具」該怎麼把加密模型和責任邊界講清楚。背景裡，Claude Code 新版把「監控」本身也做成了一等公民功能。

## Trending Repos

### PrimeIntellect-ai/prime-agent ⭐ 22,325

[GitHub](https://github.com/PrimeIntellect-ai/prime-agent)　·　Rust　·　MIT

- **是什麼**：Prime Intellect 打造的開源編碼／研究 agent，核心是「Recursive Language Model（RLM）」——把對話上下文當成變數、把工具和子代理當成函式呼叫，全部跑在一個持久的 Python REPL 裡；外加「Continual Harness」讓 agent 能用 `/refine` 把運行中學到的教訓、記憶、技能描述，以小幅且有證據支持的方式寫回可延續的狀態。
- **為什麼值得看**：多數 coding agent 的「記憶」是外部拼裝的 RAG 或筆記檔，Prime Agent 把「可編程的子代理呼叫」和「範圍受限的自我改進」做成一等公民——它永遠不改寫不可變的基礎 system prompt，且每次改動都留有可回滾的快照。daemon 常駐讓 session 能斷線重連，多個 agent 之間也能直接互相傳訊而不必每次繞回使用者，解決了長任務 agent 常見的「終端機一關就斷」問題。
- **tech stack**：Rust 核心 + 持久 Python REPL + RLM（論文 arXiv:2608.23552）
- **上手難度**：低——一行安裝指令即可，但它會用使用者權限直接執行 model 產生的 Python，官方建議在可拋棄的 clone 或受限環境裡跑，不是沙箱。

---

### microsoft/Agensh ⭐ 238

[GitHub](https://github.com/microsoft/Agensh)　·　Python　·　MIT

- **是什麼**：微軟研究院開源的「去中心化、可擴展多代理人 harness」，讓最多 1,024 個 agent 在沒有中央協調者的情況下自組織認領子任務、互相分享進度、驗證彼此的結果、非同步合併進度，共用一個工作區（Gitea）、訊息層（Mattermost）和共享上下文機制（源自 DeLM）。
- **為什麼值得看**：多數多代理人框架到幾十個 agent 就會卡在協調成本上，Agensh 的論文直接把規模推到 1,024，並量化了協調本身帶來的增益——在 ProgramBench 最難的 5 個任務上，用 GPT-5.6-sol、六小時預算、斷網環境，平均最終測試通過率從單一 agent 的 19.31% 提升到 128 個 agent 的 28.78%（相對提升約 49%），其中 Pandoc 任務在 1,024 個 agent 下衝到 55.06%。換成最新 GPT-6.1-sol，Pandoc 任務的六小時通過率從單一 agent 的 56.19% 衝到 32 個 agent 的 79.59%（相對提升約 41.64%）。
- **tech stack**：Python + Gitea（共享工作區）+ Mattermost（訊息層）+ Copilot harness（實驗中整合的 per-agent 執行迴圈）
- **上手難度**：高——此次開源是單節點的實驗重現環境（Docker Compose 多代理人團隊 + 單代理人基準線，皆用原生 Copilot ACP session），目的是重現論文實驗，不是直接拿來生產部署。

---

### finereli/whatsapp-mcp ⭐ 375

[GitHub](https://github.com/finereli/whatsapp-mcp)　·　TypeScript　·　MIT

- **是什麼**：一個唯讀的 MCP server，讓 Claude、ChatGPT 或 Grok 能搜尋並讀取使用者自己的 WhatsApp 訊息；可以用作者架設的免費 beta，也可以在自己的 Cloudflare 帳號上跑一份獨立副本。
- **為什麼值得看**：市面上多數 WhatsApp 整合要你把帳號交給第三方雲端服務，或完全不談加密細節；這個專案把「連線方式」（偽裝成另一台 WhatsApp Web 連線裝置，agent 問的時候才連線、問完即斷）、「加密模型」（每人一個 Cloudflare Durable Object、AES-256-GCM 封裝的資料金鑰、電話號碼和聊天 id 全部用 keyed hash 取代）和「誰能看到什麼」寫得非常透明——包括誠實承認 hosted 版本的登入服務運營者原則上能推導出金鑰，以及這不是端到端加密。
- **tech stack**：Cloudflare Workers + Durable Objects（內嵌 SQLite）+ Baileys（WhatsApp Web 協定函式庫）+ MCP TypeScript SDK
- **上手難度**：中——hosted 版本掃 QR code 即可用，但自架版本需要 Cloudflare Workers Paid 方案（$5/月起），且專案得自行處理 Baileys 在 workerd 執行環境上要補的三個相容層（WebSocket、wasm 載入、計時器）。

## Notable Releases

### Claude Code v2.1.310

[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.310)

- **重要變更**：新增 Monitor 工具與外掛監控，覆蓋 Bedrock／Vertex／Foundry，以及關閉遙測或非必要流量時的場景，同時把「長時間前景 sleep」也納入同一限制；修掉部分 gateway／相容伺服器因拒絕 `effort-2025-11-24` beta 值或對話中系統訊息而導致請求失敗的問題（現在會自動重試、不帶這些欄位）；修掉壓縮對話時在「Prompt is too long」錯誤後仍保留過多密集文字（如 base64／SVG），導致下一次請求又失敗的問題。
- **Breaking Changes**：無。
- **對你的影響**：如果你的工作流程仰賴長時間背景監控，或跑在 Bedrock／Vertex／Foundry 上，升級後多了原生 Monitor 工具可用；如果曾被某些相容 gateway 擋過請求，這版應該能解掉。

## 今日收穫

之前以為多代理人協調的瓶頸主要卡在模型推理能力——agent 不夠聰明，協調自然做不好。但 Agensh 的數字顯示：就算模型完全不變，光是把協調機制從「中央調度」換成「自組織認領＋非同步合併」，同一個任務的通過率就能多出四到五成。協調架構本身，可能比等模型升級更快把 agent 數量的收益榨出來。

## 參考資料

- [PrimeIntellect-ai/prime-agent — GitHub](https://github.com/PrimeIntellect-ai/prime-agent)
- [Prime Agent: A Self-Improving RLM Harness — arXiv:2608.23552](https://arxiv.org/abs/2608.23552)
- [microsoft/Agensh — GitHub](https://github.com/microsoft/Agensh)
- [Agensh: Scaling Organizational Intelligence to 1,024 Agents — arXiv:2609.26781](https://arxiv.org/abs/2609.26781)
- [finereli/whatsapp-mcp — GitHub](https://github.com/finereli/whatsapp-mcp)
- [Show HN: WhatsApp MCP running free on Cloudflare — Hacker News](https://news.ycombinator.com/item?id=50145715)
- [Claude Code v2.1.310 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.310)
