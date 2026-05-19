---
title: "Osaurus 導讀：macOS 原生的 local-first AI agent harness"
date: 2026-05-19
category: ai
type: deep-dive
tags: [osaurus, agent-harness, apple-silicon, mlx, mcp, local-llm, ollama]
lang: zh-TW
tldr: "MIT 授權、Apple Silicon-only 的 Swift native AI harness，5.4k stars / 117k+ downloads。把 agent loop、memory、20+ plugin、Apple Containerization Sandbox VM、雙向 MCP 全綁在本機，inference 在 8+ provider 之間隨意換。"
description: "從 Mac 版 Ollama 演進成 AI agent harness 的開源專案 Osaurus：設計哲學、跟 Ollama/LM Studio 的真實效能比較、Sandbox VM 與 MCP 雙向設計，以及為何把命運押在 Apple 平台上。"
draft: false
---

Osaurus 是 Apple Silicon 上 MIT 開源、Swift native 的 AI agent 平台。它一開始（2025-08）只是「Mac 版的 Ollama」，2026 年初整個重新定位成 **harness**：把 inference 以外的東西——context、memory、tools、identity——全搬回本機。截至 2026-05-19 釋出 v0.18.27，5.4k stars、117k+ 下載、半年內 375 個 release。值不值得關注，看你怎麼回答一個問題：**inference 商品化之後，剩下的層該歸誰**。

## Osaurus 的核心賭注

創辦人 Terence Pae（前 Tesla、Netflix 工程師）在 2026-01 的 thesis 把話講得很白：「Inference is a transformation, nothing more.」模型每月在變便宜、變可互換，真正不可替代的是模型周圍那層——你的偏好、你過去的對話、你的工具、你的身分。OpenAI / ChatGPT 把這層綁在伺服器上，**「Switch providers, and that context stays behind. Accumulated understanding becomes a retention mechanism, not a user asset.」**（[On Personal AI](https://osaurus.ai/blog/on-personal-ai)）

Osaurus 的設計回應就是 harness：底下接 MLX、OpenAI、Anthropic、Gemini、xAI、Venice、OpenRouter、Ollama、LM Studio，上面是 agents / memory / tools / identity 共用層。Pae 在另一篇早期文章寫的：「Models are getting cheaper and more interchangeable by the day. What's irreplaceable is the layer around them.」（[The Missing macOS LLM Server](https://osaurus.ai/blog/the-missing-macos-llm-server)）

這個賭注的另一面是極限聚焦 Mac：放棄整個 Intel Mac、Linux、Windows、Electron。「No Electron. No compromises.」整個 app 約 10 MB（早期版本是 7 MB binary），直接接 Apple MLX 拿 unified memory + Neural Engine。代價是用戶池被切到只剩 Apple Silicon、macOS 15.5+ 的人，且要享受 Sandbox 與 Apple Foundation Models 還得升到 macOS 26 (Tahoe)。

## 跟 Ollama / LM Studio 比，效能不是賣點

「Osaurus 比 Ollama 快 20%」這句行銷話要打折。依官方自家 benchmark（M2 Pro 32GB、Llama 3.2 3B 4-bit，[docs.osaurus.ai/benchmarks](https://docs.osaurus.ai/benchmarks)）：

| 指標 | Osaurus | Ollama | LM Studio |
|---|---|---|---|
| TTFT (ms) | 87 | **33** | 113 |
| Throughput (chars/s) | 554 | 430 | **588** |
| End-to-end | 1.24s | 1.62s | **1.22s** |
| Binary | ~10 MB | ~200 MB | ~300-500 MB |
| 平台 | Apple Silicon only | macOS+Linux+Windows | macOS+Linux+Windows |
| MLX backend | ✅ 唯一引擎 | ❌（llama.cpp+Metal） | ✅ 與 GGUF 並存 |
| MCP server | ✅ 完整雙向 | ❌ | ❌ |
| Sandbox VM | ✅（macOS 26+） | ❌ | ❌ |
| 雲端 provider 聚合 | ✅ 8+ | ❌ | ❌ |
| Apple Foundation Models | ✅ | ❌ | ❌ |
| 開源 | ✅ MIT | ✅ MIT | ❌（閉源免費） |

TTFT 上 Ollama 反而快了 2.6 倍，Osaurus 真正贏的是穩態 throughput；end-to-end 跟 LM Studio 基本同分。換句話說，**選 Osaurus 不是因為 token 跑得快，是因為 stack 整合度**。

選擇邏輯實際上是這樣：

- **vs Ollama**：你只在 Mac 上跑、想要 GUI、想接 MCP、想要 agent 在沙箱跑 shell、想 cloud + local 都能用同一介面
- **vs LM Studio**：你要開源 + 非 Electron + 要 agent / MCP / sandbox / voice 這整套整合
- **vs 直接用 OpenAI SDK**：你不想把 context / memory 留在別人家

## Sandbox 用 Apple Containerization，不是 Docker

agent harness 最難的不是讓模型呼叫工具，是讓它**真的能跑 shell 卻又不會把使用者的 Mac 炸掉**。Osaurus 的解法是 macOS 26 才有的 [Apple Containerization framework](https://developer.apple.com/documentation/containerization)：每個 agent 拿到自己的 Alpine Linux VM、自己的 Linux user、vsock bridge 回 Osaurus 取 inference / memory / secrets，檔案掛 VirtioFS。

```
┌────────────────┐       ┌────────────────────────────┐
│    Osaurus     │       │   Linux VM (Alpine)        │
│                │       │                            │
│  Sandbox Mgr ──┼───────┤→ /workspace  (VirtioFS)    │
│  Host API   ←──┼─vsock─┤→ osaurus-host bridge       │
│                │       │                            │
│                │       │  agent-alice  (Linux user) │
│                │       │  agent-bob    (Linux user) │
└────────────────┘       └────────────────────────────┘
```

代價是 macOS 26 (Tahoe) 才能用——又把硬體門檻拉高一級。換回來的能力：agent 在 VM 裡可以亂跑 shell / Python / Node / 編譯器 / 套件管理器，全套 dev 環境，連 vsock 都還能回呼 host 拿模型推論。這條 Ollama、LM Studio、Msty 都沒有。

Pae 在 TechCrunch 訪談裡說得直接：「Last year, local AI could barely finish sentences, but today it can actually run tools, write code, access your browser, and order stuff from Amazon...」（[TechCrunch 2026-05-15](https://techcrunch.com/2026/05/15/osaurus-brings-both-local-and-cloud-ai-models-to-your-mac/)）

## MCP 雙向：既當 server 也當 client

Osaurus 不只是個能被叫的 MCP server，它本身也是 MCP client，會聚合遠端 provider。

**當 server 用**：在 Cursor / Claude Desktop 設定一條 `osaurus mcp`，stdio bridge 就把 Osaurus 安裝的工具暴露出去。等於把你的 Mac 本機工具（Mail、Calendar、Vision、macOS Use、XLSX、PPTX、Browser、Music、Git、Filesystem、Search、Fetch、20+ 個 plugin）整包餵給任何 MCP-compatible harness。

```json
{
  "mcpServers": {
    "osaurus": {
      "command": "osaurus",
      "args": ["mcp"]
    }
  }
}
```

**當 client 用**：UI 上一鍵 OAuth 2.1 + Dynamic Client Registration 接 ~25 個常見遠端 MCP provider（Linear、Notion、GitHub、Vercel、Supabase、Sentry、Stripe、Cloudflare 等），或貼 API key 也行。這雙向的設計把 Osaurus 放在「Mac 上所有 AI 工具的中樞」位置，而不只是又一個 chat app。

API 介面同時對外講三種方言（全部走 `127.0.0.1:1337`，所有前綴都 OK）：

| 協定 | Endpoint |
|---|---|
| OpenAI | `/v1/chat/completions` |
| Anthropic | `/anthropic/v1/messages` |
| Ollama | `/api/chat` |

`/chat/completions` 維持嚴格 OpenAI 語意——回 `tool_calls` 讓 client 自己跑 tool loop，這樣現有的 harness 都能直接接上；要走 server-side autonomous loop 就改用 `POST /agents/{id}/run`。

## Memory 三層，不是 RAG 大雜燴

Osaurus 的 memory 不是把全部對話塞向量庫然後 cosine similarity 一通。三層分工：

- **Identity**：使用者是誰、agent 是誰
- **Pinned facts**：明確標記重要的事實
- **Per-session episodes**：最近發生的對話片段

session 結束才跑 distillation，不是每 turn 都做；背景有 consolidator 會衰減、合併、清掉 stale entries。官方說「多數對話注入 ≤800 tokens，很多是 0」（[Memory Guide](https://github.com/osaurus-ai/osaurus/blob/main/docs/MEMORY.md)）。對比一堆 chat app 把 RAG 用在所有地方、context 越塞越長的做法，這個設計誠意明顯。

## 加密身分與 Relay

每個參與者——人、agent、device——都拿到一個 secp256k1 加密位址；master key 放在 iCloud Keychain，往下發 per-agent 的 `osk-v1` access key，可隨時撤銷。授權鏈整個是 cryptographically verifiable 的。

對應的網路層叫 Relay：透過 `agent.osaurus.ai` 的 WebSocket 隧道，給每個 agent 一個由它 crypto address 衍生的穩定公開 URL。不用設 port forwarding、不用裝 ngrok、不用自己配置。這套機制目前只有單一官方文件來源、沒看到第三方安全審計報告，要不要採用得看你對閉源運營商搭自家 tunnel 的容忍度。

## 適合 / 不適合的情境

**適合**：
- Apple Silicon Mac（64 GB+ RAM 比較舒服；依 [TechCrunch](https://techcrunch.com/2026/05/15/osaurus-brings-both-local-and-cloud-ai-models-to-your-mac/) Pae 訪談，DeepSeek V4 級別要 128 GB）、macOS 15.5+
- 想要本地 agent 跑工具但又怕 shell 炸機 → 用 Sandbox VM（要 macOS 26+）
- 想把本機工具當 MCP server 餵給 Cursor / Claude Desktop
- 同時用 OpenAI + Anthropic + 本機模型，希望 context 跨 provider 保留
- 隱私敏感場景：legal、healthcare、個人資料整理（這也是團隊瞄準的企業方向）
- macOS 原生 app 開發者要加 local AI 而不想自己做 inference / provider 抽象

**不適合**：
- Intel Mac / Linux / Windows（直接不支援）
- 16 GB Mac 想跑 30B+ 模型（VRAM 跟系統 RAM 不夠）
- 想要 enterprise multi-user hosting（目前定位是單機 personal AI）
- macOS 26 以下又想用 Sandbox 或 Apple Foundation Models
- 對 secp256k1 identity + 自家 tunnel 沒第三方審計這套機制不放心的人

## 整體架構

Osaurus 的內部分層（簡化自 [GitHub README](https://github.com/osaurus-ai/osaurus)）：

```
┌─────────────────────────────────────────────────────┐
│                   The Harness                       │
├──────────┬──────────┬────────────┬──────────────────┤
│ Agents   │ Memory   │ Agent Loop │ Automation       │
├──────────┴──────────┴────────────┴──────────────────┤
│              MCP Server + Client                    │
├──────────┬──────────┬───────────┬───────────────────┤
│ MLX      │ OpenAI   │ Anthropic │ Ollama / Others   │
│ Runtime  │ API      │ API       │                   │
├──────────┴──────────┴───────────┴───────────────────┤
│      Plugin System (v1 / v2 / v3 ABI)               │
├──────────┬──────────┬───────────┬───────────────────┤
│ Identity │ Relay    │ Tools     │ Skills · Methods  │
├──────────┴──────────┴───────────┴───────────────────┤
│  Sandbox VM (Alpine · Apple Containerization)       │
│  vsock bridge · VirtioFS · per-agent isolation      │
└─────────────────────────────────────────────────────┘
```

每一層都對應一個 inference 之外的問題：runtime 抽象 provider；MCP 抽象工具供需兩端；identity 抽象授權；relay 抽象網路暴露；sandbox 抽象執行隔離；memory 抽象 context 持續性。inference 在這張圖裡只是中間一層、可隨時替換的零件。

## 限制與要先想清楚的事

1. **硬體門檻很硬**。Apple Silicon + macOS 15.5（Sandbox/Foundation Models 要 macOS 26）+ 64-128 GB RAM 才能跑像樣的模型。要享受全功能等於要 M3/M4 Max 級別。
2. **效能優勢被官方自己 benchmark 打折**。TTFT 是 Ollama 2.6 倍，throughput 才略勝。對話互動感未必比 Ollama 好。
3. **生態系成熟度仍早期**。雖然 20+ plugin、~25 個 MCP provider、Skills 可從 GitHub 匯入聽起來很多，但 26 個 contributors 中主要靠 @tpae 推動（376 個 releases 半年內，依賴單點顯著）。
4. **HN 早期反應冷**。2025-10-15 的 [Show HN](https://news.ycombinator.com/item?id=45593355) 只 6 points / 2 comments。爆紅靠的不是 HN，是 TechCrunch + organic 成長（半年內下載從 54k 翻倍到 117k+）。
5. **Identity / Relay 沒第三方審計**。secp256k1、`agent.osaurus.ai` tunnel、`osk-v1` access key 都是自家設計，目前只有單一官方文件來源。
6. **命運綁在 Apple 平台**。macOS 26 Tahoe 需要的功能（Containerization、Foundation Models）等於把產品鎖在 Apple 的更新節奏上。Pae 自己在 12 月那篇文章吐槽過「Recent macOS releases have been riddled with issues」——既要靠 Apple 又在批 Apple，這條線會一直緊。

## 整體來說

Osaurus 用「極限聚焦 Mac」換「極限的整合」。它放棄的：跨平台、Intel Mac、企業 multi-tenant、低階 Mac、平台中立。換到的：~10 MB binary、Swift 原生、MLX 直連、macOS Sandbox / Foundation Models / Keychain / Containerization 全用上、雙向 MCP、harness 級的 agent 抽象。

如果 inference 真的會像 Pae 預測那樣繼續商品化，「continuity layer 該歸誰」這題就是真的。Osaurus 是目前少數同時押注「本機 + 開源 + Mac 原生」三件事的選項。風險也對稱：押錯任一條（Apple 改方向、harness 抽象沒人吃、企業最後還是要 cloud）整個 thesis 就崩。

對 Apple Silicon 主力使用者、又對 cloud-only AI 工具有抵抗感、願意吃 macOS 升級成本的人來說，這是 2026 年最值得認真試一輪的 local-first AI 平台。對其他人——Linux 工程師、Windows 用戶、企業 ops、低 RAM Mac 使用者——它連門票都不打算賣給你。

## 參考資料

- [Osaurus 官網](https://osaurus.ai/)
- [Osaurus 官方文件](https://docs.osaurus.ai/)
- [Osaurus benchmarks](https://docs.osaurus.ai/benchmarks)
- [GitHub: osaurus-ai/osaurus](https://github.com/osaurus-ai/osaurus)
- [On Personal AI（Pae thesis, 2026-01-21）](https://osaurus.ai/blog/on-personal-ai)
- [The Missing macOS LLM Server（Pae, 2025-12-14）](https://osaurus.ai/blog/the-missing-macos-llm-server)
- [TechCrunch: Osaurus brings both local and cloud AI models to your Mac（Sarah Perez, 2026-05-15）](https://techcrunch.com/2026/05/15/osaurus-brings-both-local-and-cloud-ai-models-to-your-mac/)
- [Show HN: Osaurus（2025-10-15）](https://news.ycombinator.com/item?id=45593355)
- [Apple Containerization framework](https://developer.apple.com/documentation/containerization)
- [Apple MLX framework](https://github.com/ml-explore/mlx)
- [Liquid AI LFM models](https://www.liquid.ai/models)
- [OsaurusAI on Hugging Face（curated MLX quantizations）](https://huggingface.co/OsaurusAI)
- [Osaurus Plugin Registry](https://github.com/osaurus-ai/osaurus-tools)
- 站內延伸：[Ollama 本地 LLM 指南](/posts/ai/ollama-local-llm-guide)、[AI 硬體與本地推論指南](/posts/ai/ai-hardware-local-inference-guide)
