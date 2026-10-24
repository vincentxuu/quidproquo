---
title: "AI Agent GitHub Digest — 2026-10-24"
date: 2026-10-24
category: daily
tags: [ai-agent, github, open-source, daily, agent-evaluation, mcp, agent-framework]
lang: zh-TW
description: "一個獨立開源 agent 稽核工具、一個金融 K 線基礎模型同天衝上數萬星，crewAI 和 Pydantic AI 的新版都在把「驗證 agent 做對了」收進框架核心"
tldr: "**ifixai-ai/ifixai**（3.4 萬★）把『稽核 agent』做成一個獨立開源 CLI——用另一家模型當裁判，把你的 agent 丟進模擬情境裡找出偏離指令、操弄或杜撰的地方；**shiyu-coder/Kronos**（4.3 萬★，AAAI 2026 收錄）是第一個專門用金融 K 線資料訓練的開源基礎模型；**mcp-use/mcp-use**（1.1 萬★）是全 TypeScript 的 MCP server 框架，工具可以直接綁 React View 做成互動式 ChatGPT／Claude App；**crestalnetwork/intentkit**（6.5k★）把多 agent 團隊做成雲端自架服務，agent 本身拿不到你的任何金鑰。Release：crewAI 1.15.29 把 eval／guardrail runner 收進核心指令；Pydantic AI v2.60.0 的相容性筆記要求同一台 host 上的多個 MCP server 必須給明確 id，否則直接拒絕啟動。"
series:
  name: "AI Agent GitHub Digest"
  order: 70
---

> 🌏 [English version](/posts/daily/2026-10-24-ai-agent-github-digest-en)

## 今日亮點

今天的主線是「怎麼確定 agent 真的做對了」——ifixai 把稽核做成一個獨立、對抗式的開源測試工具，crewAI 1.15.29 把 eval／guardrail runner 直接收進核心指令，Pydantic AI v2.60.0 的相容性筆記則進一步鎖死「不可信輸入」和多 MCP server 共用一台 host 時的邊界；同時 IntentKit 和 Kronos 從另外兩個方向擴張版圖——前者把多 agent 團隊做成雲端自架服務，後者把基礎模型做進金融 K 線這個特化領域。

## Trending Repos

### ifixai-ai/ifixai ⭐ 34k

[GitHub](https://github.com/ifixai-ai/ifixai)　·　Python　·　Apache-2.0

- **是什麼**：一個獨立的開源 CLI，專門稽核「已經部署」的 AI agent 有沒有照著自己宣稱的角色和權限做事——把 agent 丟進模擬的業務情境裡，送出真實一天會遇到的請求（包括故意超出職責範圍的），再由另一家供應商的模型當裁判打分。
- **為什麼值得看**：稽核邏輯刻意跟被測 agent 本身的測試套件脫鉤，而且裁判模型規則上一定要跟 agent 用的供應商不同，避免「自己人審自己人」；內建 10 項預設稽核（`--full-run` 有 61 項），從杜撰、操弄到不可預測性各給一個 A–F 等級，三項必過項目沒過直接封頂在 D，可以直接拿 `--min-score` 接進 CI。
- **Tech stack**：Python CLI + 可插拔 LLM 裁判（OpenAI／Anthropic／Gemini／Azure／Bedrock／OpenRouter）+ Claude Code／Codex plugin 整合
- **上手難度**：中——`pip install ifixai` 後有內建 demo agent 一行指令就能看到完整流程，但正式稽核自己的 agent 要先寫一份 agent profile（或讓 coding agent 讀程式碼自動生成），並準備一個跟被測 agent 不同供應商的裁判 API key。

---

### shiyu-coder/Kronos ⭐ 43k

[GitHub](https://github.com/shiyu-coder/Kronos)　·　Python　·　MIT

- **是什麼**：第一個專門為金融 K 線（OHLCV）資料訓練的開源基礎模型家族，用兩階段架構——先把連續的 K 線數值量化成分層離散 token，再用自回歸 Transformer 在這些 token 上預訓練——橫跨 45 個以上交易所的資料。
- **為什麼值得看**：不是 agent 框架，而是 agent／量化 pipeline 可以直接呼叫的預測模型；論文已被 AAAI 2026 收錄，mini／small／base 三個尺寸（410 萬～1.02 億參數）都公開在 Hugging Face Hub 上可直接下載，官方還提供 BTC/USDT 24 小時預測的線上 demo 可以先看效果。
- **Tech stack**：Python + PyTorch + Hugging Face Hub（模型與 tokenizer 權重）
- **上手難度**：中——`KronosPredictor` 幾行程式碼就能跑預測，但輸入資料要先整理成固定欄位（open/high/low/close，volume/amount 可選）加對應時間戳記的 DataFrame。

---

### mcp-use/mcp-use ⭐ 11k

[GitHub](https://github.com/mcp-use/mcp-use)　·　TypeScript　·　MIT

- **是什麼**：一套全 TypeScript 的 MCP 框架，讓你用官方 MCP SDK v2 為底，直接把工具綁上 React View，做出能在 ChatGPT／Claude 裡顯示互動介面的 MCP App，而不只是回文字結果。
- **為什麼值得看**：多數 MCP server 範例只示範「呼叫工具拿到 JSON」，mcp-use 把 Zod schema、工具呼叫、React View 三者打通成一條型別安全的管線，還內建 Inspector 可以在瀏覽器或終端機直接檢查工具和畫面；官方也附了一套跟 FastMCP TS、官方 SDK v2、xmcp 等競品的效能對照表。
- **Tech stack**：TypeScript + MCP SDK v2 + Zod + React（Views）+ 內建 Inspector
- **上手難度**：低——`npx create-mcp-use-app@latest` 建專案、`npm run dev` 就能在瀏覽器打開 Inspector 看到完整的工具 + 畫面流程。

---

### crestalnetwork/intentkit ⭐ 6.5k

[GitHub](https://github.com/crestalnetwork/intentkit)　·　Python　·　MIT

- **是什麼**：一套開源、自架的「雲端 agent 叢集」，讓多個 agent 互相呼叫、協作，用雲端服務的方式跑，而不是每個人在自己電腦上開一堆本機 agent 腳本。
- **為什麼值得看**：設計上刻意讓 agent 完全碰不到你的任何密鑰（金鑰只在服務端，agent 看不到），跟常見的「本機優先」agent（官方拿 OpenClaw 當對比）比起來，資源需求和維護成本都低很多；專案源自 web3／加密貨幣場景（有選用的社群媒體和區塊鏈整合），但核心的 agent 叢集設計跟產業無關，也能單純當 Python library 匯入用。
- **Tech stack**：Python + PyPI 套件／Docker image 雙發行管道 + 可選 Web3 整合
- **上手難度**：中——當 Python library 直接 import 很快，但要發揮完整的「雲端自架叢集」能力得照官方 Deployment Guide 自己架服務。

## Notable Releases

### crewAI 1.15.29

[Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.29)

- **重要變更**：`AgentExecutor` 正式升級出 experimental 狀態；新增可以離線跑的 eval／guardrail evaluation runner，一行指令讓 crew 自己跑出評測結果；新增 Azure DocumentDB 向量搜尋整合；支援 LiteLLM 相容的 kwargs 傳遞。
- **Breaking Changes**：無——release notes 裡沒有標示破壞性變更。
- **對你的影響**：如果你在用 crewAI 做 agent 評測，現在可以直接用內建的 eval runner 產生報告而不用自己外接評測框架；LanceDB filter 的轉義修復也代表之前如果 scope／id 裡有特殊字元，查詢可能失敗或誤判，升級後這個邊界案例解掉了。

---

### Pydantic AI v2.60.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.60.0)

- **重要變更**：`RetryPromptPart` 正式標記為 deprecated，改用 `ToolReturnPart(outcome='retried')` 和新的 `RetryFeedbackPart`；harness 額外塞進對話「使用者頻道」的內容，現在統一包成 `<harness_data>`、不再假裝是使用者訊息；MCP capability 的預設 `id` 現在只用 server URL 的 hostname 推導，同一台 host 上兩個沒給明確 id 的 server 會直接被拒絕啟動。
- **Breaking Changes**：以上三項都列在官方的「⚠️ Compatibility Notes」底下——直接判斷 `RetryPromptPart` 型別的程式碼要改；同一台 host 上跑兩個沒自訂 id 的 MCP server，升級後會直接報錯而不是悄悄碰撞。
- **對你的影響**：如果你在用 pydantic-ai 接多個 MCP server，先檢查有沒有同 host、沒設 id 的狀況，升級前補上明確 id 可以避免直接炸版；用 `RetryPromptPart` 判斷重試狀態的程式碼，趁這次還沒變成強制移除之前先遷移到 `ToolReturnPart(outcome='retried')`。

## 今日收穫

之前以為「agent 稽核」還停留在學術論文或企業內部稽核流程，今天看到 ifixai 把它做成一個可以直接塞進 CI 的獨立開源指令，加上 crewAI 把 eval runner 收進核心、Pydantic AI 鎖死不可信輸入與多 server 共用 host 的邊界，才意識到「驗證 agent 真的做對了」正在從「要自己額外搭」變成「框架原生就有」的標準配備。

## 參考資料

- [ifixai-ai/ifixai GitHub](https://github.com/ifixai-ai/ifixai)
- [shiyu-coder/Kronos GitHub](https://github.com/shiyu-coder/Kronos)
- [Kronos 論文（arXiv）](https://arxiv.org/abs/2508.02739)
- [mcp-use/mcp-use GitHub](https://github.com/mcp-use/mcp-use)
- [crestalnetwork/intentkit GitHub](https://github.com/crestalnetwork/intentkit)
- [crewAI 1.15.29 Release Notes](https://github.com/crewAIInc/crewAI/releases/tag/1.15.29)
- [Pydantic AI v2.60.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.60.0)
