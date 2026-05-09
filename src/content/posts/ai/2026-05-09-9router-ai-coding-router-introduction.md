---
title: "9Router：把 Claude Code / Cursor / Cline 路由到 40+ 家供應商的本地三層 fallback 路由器"
date: 2026-05-09
category: ai
tags:
  - ai-router
  - 9router
  - claude-code
  - cursor
  - cline
  - codex
  - llm-routing
  - token-saving
  - oauth
  - fallback
lang: zh-TW
tldr: "本地起一支 OpenAI 相容端點 localhost:20128，把 Claude Code / Cursor / Cline / Codex / Copilot 等 CLI 的請求，自動依 訂閱 → 便宜 → 免費 三層 fallback 路由到 40+ 家供應商。內建 RTK 壓縮 tool_result（省 20–40% input token）、Caveman mode 壓 output、OAuth 自動 refresh、多帳號輪詢，npm install -g 9router 兩條指令裝完。"
description: "9Router 是把 Claude Code / Cursor / Cline 等 AI coding CLI 統一路由到 40+ 家 LLM 供應商的本地路由器，提供三層 fallback、RTK token 壓縮、format translation 與多帳號管理。"
draft: false
---

[前一篇 LLM inference 比較](https://quidproquo.cc/posts/ai/2026-05-09-llm-inference-free-tier-comparison/) 把 30+ 家 inference 服務商的免費額度與定價攤開來，下一個問題是：拿到一堆 API key 之後，要怎麼讓 Claude Code、Cursor、Cline 這些 CLI 工具自動切換、用滿訂閱、quota 用完無痛 fallback 到便宜或免費 tier？

`decolua/9router` 就是專門做這件事的本地路由器。Claude Code、Codex、Cursor 預設都允許指向自訂 OpenAI endpoint，9Router 把自己起在 `http://localhost:20128/v1`，背後接 40+ 家供應商與 100+ 模型，按你寫好的「combo」自動 fallback。

## 為什麼是路由器，不是 SaaS gateway

OpenRouter、Vercel AI Gateway、HF Inference Providers 都是雲端 gateway，把請求集中到一個遠端 endpoint。9Router 走另一個方向：

- **本地執行**（npm 全域裝、Docker、VPS、Cloudflare Workers 都行）
- **OAuth token 留在本機**（直接吃 Claude Code、Codex、Antigravity、Cursor、GitHub Copilot 訂閱）
- **API key 留在本機**，不經第三方
- **9Router 本體完全免費、開源**，dashboard 顯示的「cost」是換算對比、不會扣款

把訂閱型的 OAuth token 餵給雲端 gateway 在 ToS 上多半是灰色的，9Router 走本地就避開了這層問題。代價是要自己跑一支 Node.js daemon。

## 3-tier 自動 fallback 是核心邏輯

把訂閱、便宜、免費三層綁進同一個 combo，quota 用完或 429 就切下一層：

```
Combo: my-coding-stack
  Tier 1  cc/claude-opus-4-6      ← 訂閱（用滿才切）
  Tier 2  glm/glm-4.7             ← $0.6/1M 便宜備援
  Tier 3  kr/claude-sonnet-4.5    ← Kiro AI 免費
```

這比手動切 endpoint、複製貼上 API key 省力很多，也比寫一個自家 wrapper 健全——它順手把以下事情都做了：

- **OAuth token 自動 refresh**：Claude Code、Codex、Antigravity 的 token 過期前自動拿新的
- **多帳號 round-robin**：每家 provider 可以掛多組帳號，輪詢或優先序
- **即時 quota 追蹤**：每家剩多少 token、距下次 reset 倒數多少
- **format translation**：CLI 用 OpenAI 格式打進來，後端是 Claude / Gemini / Cursor / Kiro / Vertex / Antigravity / Ollama 之一，9Router 在中間翻譯

最後這點最關鍵——讓 Claude Code 直接打 Gemini、Codex 直接打 Claude，原本要寫 adapter 的事被一個 router 收走了。

## RTK Token Saver：省 20–40% input token

9Router 內建 [RTK](https://github.com/rtk-ai/rtk)，是 LLM 還沒看到 prompt 之前先壓縮 `tool_result` 內容的 middleware。

Coding agent 最吃 token 的不是對話本身，是工具輸出：`git diff` 一發幾千行、`grep -r` 整個 repo、`tree` 列目錄結構、build log、測試輸出，這些一回合可以吃掉 30–50% 的 prompt budget。

RTK 內建 filter：`git-diff` / `git-status` / `grep` / `find` / `ls` / `tree` / `dedup-log` / `smart-truncate` / `read-numbered` / `search-list`。**自動偵測**——讀每個 `tool_result` 前 1KB 就決定要套哪個 filter，不用手動設定。**安全 fallback**——壓縮失敗、變大、丟錯都直接走原文，不會弄壞請求。**跑在 format translation 之前**，所以對 OpenAI / Claude / Gemini / Cursor / Kiro / OpenAI Responses 一律有效。

```
Without RTK: 47K tokens sent to LLM
With RTK:    28K tokens sent to LLM   (40% saved · same context · same answer)
```

預設 ON，dashboard 可以關。光這一個 feature 對 coding agent 而言就值得裝。

另一邊還有 **Caveman Mode**（[Caveman](https://github.com/JuliusBrussee/caveman)）——把 caveman-speak prompt 注進 system 讓 LLM 用簡略語回，技術內容保留、output token 最多省 65%。比較適合純自動化 pipeline，要看 LLM 回應的場景就別開。

## 支援的 CLI 工具與供應商

**CLI 端（任何能設自訂 OpenAI endpoint 的工具都行）**：Claude Code、OpenClaw、Codex、OpenCode、Cursor、Antigravity、Cline、Continue、Droid、Roo、Copilot、Kilo Code。

**供應商分三類**：

- **OAuth 訂閱**：Claude Code、Antigravity、Codex、GitHub Copilot、Cursor。你已付的訂閱，9Router 幫你壓榨到 reset 前最後一秒。
- **真免費（無限或很大方）**：Kiro AI（含 Claude 4.5 + GLM-5 + MiniMax）、OpenCode Free（無需註冊、自動抓模型清單）、Vertex AI（新 GCP 帳號 $300 credits）。
- **API Key 40+**：OpenRouter、GLM、Kimi、MiniMax、OpenAI、Anthropic、Gemini、DeepSeek、Groq、xAI、Mistral、Perplexity、Together、Fireworks、Cerebras、Cohere、NVIDIA、SiliconFlow，再加 Nebius、Chutes、Hyperbolic 與任意 OpenAI / Anthropic 相容端點。

便宜層常用的三家（直接從 README 抄定價）：GLM-5.1 / 4.7 約 `$0.60 / 1M token`、MiniMax M2.7 約 `$0.20 / 1M token`、Kimi K2.5 月費 $9 平頭。把訂閱用滿、quota 燒到 0 之後切到這三家，比直接用 Anthropic / OpenAI API 便宜一個量級。

## 一個務實的注意事項

README 裡有一條重要警告：

> **iFlow、Qwen、Gemini CLI 免費 tier 已於 2026 年停止運作。請改用 Kiro / OpenCode Free / Vertex。**

很多 2025 年寫的 9Router 教學都把 iFlow 當無限免費備援，現在不能再用了。如果你 follow 舊文裝起來發現第三層一直 fail，原因就在這裡。免費 tier 變動極快，這也是為什麼九層的 fallback 名單值得讓 router 幫你管，而不是寫死在自己的 wrapper 裡。

## 安裝與接線

兩條指令：

```bash
npm install -g 9router
9router
```

Dashboard 會自動開在 `http://localhost:20128/dashboard`，連上 provider（OAuth 點一下、API key 貼上）就完工。把 CLI 工具的 endpoint 指過來：

```
Endpoint: http://localhost:20128/v1
API Key:  <dashboard 給你的>
Model:    <在 dashboard 建好的 combo 名稱>
```

資料存在 `~/.9router/db.json`（Windows 是 `%APPDATA%/9router/db.json`），純檔案、好備份。

要從 source 跑（公開 repo 是 `9router-app`，npm 套件名是 `9router`）：

```bash
git clone https://github.com/decolua/9router
cp .env.example .env
npm install
PORT=20128 NEXT_PUBLIC_BASE_URL=http://localhost:20128 npm run dev
```

VPS 與 Docker 部署 README 都有 ready snippet。Cloudflare Workers 也支援，但個人用 localhost 就夠。

## 整體來看

如果你只用一家 provider、quota 也吃不完，9Router 是 over-engineering。它的價值場景是：

- **同時有訂閱與 API**：Claude Pro 想用滿 + GLM 當便宜備援 + Kiro 當免費保險
- **多 CLI 工具**：Claude Code、Cursor、Cline 想共用同一組 provider 設定
- **跨 format**：Codex CLI 想打 Claude、Claude Code 想打 Gemini
- **多帳號**：團隊或自己手上有兩三組同樣 provider 的帳號
- **省 token**：coding agent 一天打幾百次 tool call，RTK 那 30–40% 是真金白銀

不適合的場景：純自動化 batch pipeline 已經有自家 throttle / fallback 邏輯、不想多跑一支 daemon、或是模型用量極小不需要省 token。

實務上推薦的最小組合：**Kiro AI（免費無限 Claude 4.5）+ OpenCode Free（無需註冊）+ 你已有的訂閱**，三層綁成一個 combo，配 RTK 預設開，當天就能感覺到差別。

## 參考資料

- [9Router 官網](https://9router.com/)
- [9Router GitHub](https://github.com/decolua/9router)
- [9Router npm](https://www.npmjs.com/package/9router)
- [RTK Token Saver](https://github.com/rtk-ai/rtk)
- [Caveman](https://github.com/JuliusBrussee/caveman)
- [Kiro AI](https://kiro.dev/)
- [OpenCode](https://opencode.ai/)
- [Vertex AI Free Trial](https://cloud.google.com/free)
- [GLM (Zhipu)](https://open.bigmodel.cn/)
- [MiniMax](https://www.minimax.io/)
- [Kimi (Moonshot)](https://platform.moonshot.cn/)
- [站內：2026 年 LLM Inference 服務商免費額度與定價](https://quidproquo.cc/posts/ai/2026-05-09-llm-inference-free-tier-comparison/)
