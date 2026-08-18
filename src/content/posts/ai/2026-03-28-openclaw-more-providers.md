---
title: "OpenClaw 的 60 個供應商：分類地圖，與接本地模型真正會踩的坑"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, deepseek, groq, ollama, openrouter, vllm, bedrock, sglang, mistral]
lang: zh-TW
series:
  name: "OpenClaw 文件導讀"
  order: 7
tldr: "官方 provider 目錄現在有 60 個條目。接本地模型最常見的失敗是把 Ollama 的 base URL 寫成 /v1——那會破壞 tool calling，模型會把 tool JSON 當純文字吐出來。"
description: "OpenClaw 60 個模型供應商的分類地圖，以及本地模型（Ollama、vLLM、SGLang、LM Studio）接入時的認證規則、探索機制與實際門檻。"
draft: false
---

上一篇講模型的層級關係，這篇看生態的實際樣貌。官方的 provider 目錄現在列出 **60 個條目**——但逐個介紹沒有意義（設定細節在各自的文件裡，而且會變），所以這篇做兩件事：**給一張分類地圖**，然後**把本地模型那幾個真的會擋住你的規則講清楚**。

## 分類地圖

60 個條目裡有相當比例不是 LLM，而是語音、影像、音樂、影片的供應商——這點本身就說明 OpenClaw 想當的是整個模型層的閘道，不只是聊天。

| 類別 | 供應商 |
|---|---|
| 頂級商用 | Anthropic、OpenAI、Google |
| 中國廠商 | DeepSeek、Qwen、Z.AI（GLM）、MiniMax、Moonshot（Kimi）、Qianfan、Volcengine（豆包）、Tencent、Xiaomi、LongCat、StepFun、BytePlus |
| 推理加速 | Groq、Cerebras、Together、Fireworks、Baseten、Novita、Chutes、GMI、Featherless |
| 本地部署 | Ollama、LM Studio、vLLM、SGLang、inferrs、ds4 |
| 代理閘道 | OpenRouter、LiteLLM、ClawRouter、Vercel AI Gateway、Cloudflare AI Gateway |
| 雲廠商 | Amazon Bedrock（含 Mantle）、Alibaba Model Studio |
| 訂閱制編碼 | GitHub Copilot、OpenCode（含 Go 版）、Kilocode |
| 語音轉錄 | Deepgram、ElevenLabs、Azure Speech、SenseAudio、Mistral（Voxtral）、xAI |
| 媒體生成 | ComfyUI、fal、Runway |
| 其他 | xAI、Mistral、NVIDIA、Hugging Face、Cohere、Arcee、Venice、Perplexity、Synthetic、Gradium、Vydra |

要看某一家怎麼設定，去官方的 [Provider directory](https://docs.openclaw.ai/providers/) 找那一頁——這篇不複製那些指令，因為它們正是最會過期的內容。

## 供應商邏輯活在 plugin 裡

理解這件事會讓你少查很多文件：**大部分供應商特有的邏輯都在供應商 plugin 裡**（`registerProvider(...)`），OpenClaw 核心只保留通用的推論迴圈。

plugin 負責的東西包括：onboarding 流程、模型目錄、認證環境變數對應、傳輸與設定正規化、tool schema 清理、failover 分類、OAuth 更新、用量回報、thinking／reasoning 設定檔。

所以當你問「這家支援不支援 X」，答案通常在那個 plugin，不在核心設定。

## 接本地模型：Ollama 的三條規則

本地模型是這批供應商裡最容易出事的，而且失敗方式很難懂。

**規則一：絕對不要用 `/v1` 的 OpenAI 相容 URL。** OpenClaw 走的是 Ollama 的原生 API（`/api/chat`），不是 `/v1`。用了 `/v1` 的後果是**破壞 tool calling**——模型會把 tool call 的 JSON 當成純文字吐出來。設定寫 `baseUrl: "http://host:11434"`，不加 `/v1`。

（設定鍵的正規寫法是 `baseUrl`；`baseURL` 也接受，但新設定用前者。）

**規則二：私網不需要真的 token。** 認證規則按主機分：

- **loopback、私有網段、`.local`、裸主機名** — 不需要真的 bearer token，OpenClaw 用 `ollama-local` 這個標記
- **公開遠端主機與 `https://ollama.com`** — 需要真憑證（`OLLAMA_API_KEY`、auth profile，或供應商的 `apiKey`）

還有一個防洩漏設計值得知道：**純 `OLLAMA_API_KEY` 環境變數值被視為 Ollama Cloud 的慣例，預設不會送到本地／自架主機**。供應商層級的 key 也只送到那個供應商自己的主機。

**規則三：模型要真的支援 tool，而且 context 夠大。** 引導設定要自動推薦一個已安裝的本地模型時，條件是 `/api/show` 確認**支援 tool 且 context window 至少 16K**；中繼資料缺漏或太小就退回手動設定路徑。這個自動檢查**不會**幫你拉模型。

這兩個數字是接本地模型的實際門檻——比「建議用強一點的模型」有用得多。

## Ollama 的三種模式

設定時要選一個，差別在誰提供模型：

| 模式 | 用什麼 |
|---|---|
| Cloud + Local | 一台連得到的 Ollama 主機，同時服務本地模型與（登入後的）`:cloud` 模型 |
| Cloud only | 直接連 `https://ollama.com`，不需要本地 daemon |
| Local only | 一台連得到的 Ollama 主機，只有本地模型 |

Cloud + Local 是 Ollama 的混合流程，需要在同一台主機上跑過 `ollama signin`；沒登入的話設定會停在 local-only。

如果只要雲端、不想裝本地 daemon，用獨立的 `ollama-cloud` provider id：

```bash
openclaw onboard --auth-choice ollama-cloud
```

用 `ollama-cloud/<model>` 這種 ref，可以讓雲端路由和本地的 `ollama` provider 分開管理。

還有個細節透露了官方的設計取向：onboarding 顯示的雲端模型清單是**即時**從 `https://ollama.com/api/tags` 抓的（上限 500 筆），連不上時才退回內建的建議清單。也就是說連官方自己都不把模型清單寫死。

## 自訂 provider 與隱含探索

**隱含探索**：設了 `OLLAMA_API_KEY`（或 auth profile）而且沒有定義 `models.providers.ollama`、也沒有其他 `api: "ollama"` 的自訂供應商時，OpenClaw 會從 `http://127.0.0.1:11434` 自己探索模型。vLLM 也是類似機制。

**自訂 provider**：用 `api: "ollama"` 建一個自訂供應商（例如指向區網主機的 `ollama-remote`），同樣的認證規則適用——它可以用 `apiKey: "ollama-local"` 這個標記，sub-agent 會透過 Ollama 的 provider hook 解析它，而不是當成缺憑證。`memory.search.provider` 也可以指向自訂 provider id，讓 embedding 走那個端點。

**設定要放對地方**：憑證放 auth profile，端點設定（`baseUrl`、`api`、模型、headers、逾時）放 `models.providers.<id>`。老式的扁平檔案不是執行期格式，`openclaw doctor --fix` 會把它改寫成標準的 API-key profile 並留備份；那種檔案裡的 `baseUrl` 是雜訊，該搬到供應商設定去。

## 整體來說

這 60 個條目不需要記，需要記的是**三件會讓你卡住的事**：模型 ref 用 `openclaw models list` 查而不是背；供應商的特有行為在它的 plugin 裡；本地模型的門檻是 tool support 加 16K context，而 base URL 千萬別加 `/v1`。

下一篇講模型壞掉時的容錯與省錢機制。

## 更新紀錄

- 2026-08-18：對照官方文件現況大改。供應商數量從「35+」更新為官方目錄現列的 60 個條目，分類地圖重編（新增媒體生成、語音轉錄、訂閱制編碼等類別）。**移除各供應商的逐項設定與模型清單**（DeepSeek、Groq 的具體型號與 context 大小本輪未查證，且屬於官方文件更新更快的內容），改為分類地圖加官方連結。改以本地模型接入的實際規則為主：Ollama 走原生 `/api/chat` 而非 `/v1`、按主機分的認證規則與 `ollama-local` 標記、`OLLAMA_API_KEY` 預設不送往本地主機的防洩漏行為、自動推薦本地模型的門檻（tool support 且 context ≥ 16K）、三種模式、獨立的 `ollama-cloud` provider id、隱含探索與自訂 `api: "ollama"` 供應商的設定歸屬。

## 參考資料

本篇整理自以下 OpenClaw 官方文件：

- [Provider directory](https://docs.openclaw.ai/providers/) — 完整供應商目錄
- [Ollama](https://docs.openclaw.ai/providers/ollama) — 原生 API、認證規則、模式與模型探索
- [Ollama Cloud](https://docs.openclaw.ai/providers/ollama-cloud) — 獨立的雲端 provider id
- [Model providers](https://docs.openclaw.ai/concepts/model-providers) — plugin 擁有的供應商行為
- [Models CLI](https://docs.openclaw.ai/concepts/models) — 模型 ref 與本地模型的允許清單寫法
