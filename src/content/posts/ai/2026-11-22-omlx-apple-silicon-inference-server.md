---
title: "oMLX 怎麼讓 Mac 撐得住 coding agent：連續批次、SSD KV 快取與 Claude Code 串接"
date: 2026-11-22
category: ai
type: deep-dive
tags: [apple-silicon, local-inference, llm-inference, kv-cache, coding-agent, claude-code]
lang: zh-TW
tldr: "oMLX 是建在 MLX 上的 Mac 選單列推論伺服器（v0.8.2，2026-11-22 約 2.38 萬 stars）。它把 KV cache 分成 RAM 熱層與 SSD 冷層，coding agent 繞回舊前綴時從磁碟還原而不是重算，並提供 OpenAI 與 Anthropic 相容 API。"
description: "介紹 oMLX：它跟 MLX、mlx-lm 的關係，連續批次與分層 KV 快取各解決什麼問題，安裝與第一次啟動，怎麼接 Claude Code、Codex 等 agent，以及跟 Ollama、LM Studio、mlx-lm server、llama.cpp 的取捨與不適合的情境。"
draft: false
series:
  name: "本機跑模型"
  order: 2
glossary:
  - term: "Prefill"
    aliases: ["預填", "prompt processing"]
    definition: "模型生成第一個字之前，先把整段輸入算過一遍、建立 KV cache 的階段。"
    advanced: "prefill 的成本跟輸入長度成正比；在 Mac 上長 prompt 的等待時間主要花在這裡，而不是逐字生成。"
    context: "本文的 SSD 快取，就是為了讓重複出現的前綴不必再 prefill 一次。"
  - term: "TTFT"
    aliases: ["Time To First Token", "首字延遲"]
    definition: "從送出請求到收到第一個輸出 token 的時間。"
    context: "coding agent 每一輪都會重送整段對話，TTFT 主要由 prefill 決定。"
  - term: "Prefix Cache"
    aliases: ["前綴快取", "prompt cache"]
    definition: "把已經算過的輸入前綴的 KV cache 存起來，下一個請求開頭相同時直接沿用。"
    advanced: "oMLX 以固定大小的 block 管理前綴，可在多個請求間共享，並用 copy-on-write 處理分岔。"
    context: "oMLX 把這份快取延伸到 SSD，伺服器重開後仍可命中。"
---

> :globe: [English version](/posts/ai/2026-11-22-omlx-apple-silicon-inference-server-en)

在 Mac 上用本機模型跑 [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) 這類 coding agent，最先撞到的通常不是生成速度，而是每一輪都要等很久才吐第一個字。agent 每次呼叫都會重送系統提示、工具定義和整段對話，動輒幾萬 token；只要中間有一段變了，很多伺服器就得從頭 prefill。

[oMLX](https://github.com/jundot/omlx) 就是衝著這件事做的。它是一個跑在 Apple Silicon 上的 LLM 推論伺服器，從 macOS 選單列管理，底層用 Apple 的 [MLX](/posts/ai/2026-11-22-mlx-apple-silicon-array-framework)。核心賣點有兩個：**連續批次**（多個請求一起解碼）和**分層 KV 快取**（RAM 放熱資料、SSD 放冷資料，重開機也不會丟）。專案採 Apache-2.0 授權，本文以最新版 [v0.8.2](https://github.com/jundot/omlx/releases/tag/v0.8.2) 為準；寫作當天（2026-11-22）repo 約有 2.38 萬 stars。

這篇是「本機跑模型」系列第二篇。第一篇講 [MLX 框架本身](/posts/ai/2026-11-22-mlx-apple-silicon-array-framework)，第三篇講另一個 Mac 推論引擎 [Splash](/posts/ai/2026-11-22-splash-apple-silicon-inference-engine)，第四篇用四個開放模型[對照各工具在 32GB Mac 上怎麼跑](/posts/ai/2026-11-22-run-open-models-on-32gb-mac)。這篇回答三件事：oMLX 比直接用 mlx-lm 多做了什麼、怎麼裝起來接上 agent、什麼時候不該用它。

## oMLX 在堆疊裡的位置

oMLX 不是新的推論引擎，它是一層「伺服器 + 管理」。分工大致是這樣：

```
coding agent（Claude Code / Codex / OpenCode …）
        │  OpenAI /v1/chat/completions 或 Anthropic /v1/messages
        ▼
oMLX（FastAPI 伺服器）
  ├─ EnginePool：多模型、LRU 淘汰、TTL、手動載入／卸載
  ├─ Scheduler：FCFS，交給 mlx-lm 的 BatchGenerator
  └─ Cache Stack：GPU 分頁快取 → RAM 熱層 → SSD 冷層（safetensors）
        ▼
mlx-lm / mlx-vlm / mlx-embeddings
        ▼
MLX（Metal、統一記憶體）
```

架構出自 [README 的 Architecture 區塊](https://github.com/jundot/omlx#readme)。v0.8.2 的 `pyproject.toml` 釘住 `mlx==0.32.4` 和一個特定 commit 的 [mlx-lm](https://github.com/ml-explore/mlx-lm)；專案本身從 [vllm-mlx](https://github.com/waybarrios/vllm-mlx) v0.1.0 分出來，再加上多模型、分層快取、管理介面和選單列 app。

先講清楚一件事（文末會再展開）：**模型能不能跑、跑多快，主要是 MLX 和 mlx-lm 決定的。** oMLX 改變的是「同一台 Mac 上，agent 反覆送長 prompt 時要等多久」，以及「誰來管模型的載入與記憶體」。

## 連續批次：同時有好幾個請求時才有感

連續批次（continuous batching）讓伺服器在一次 GPU 前向計算裡同時推進多個請求，新請求不用排在舊請求後面等它講完。oMLX 這部分直接用 mlx-lm 的 `BatchGenerator`，預設最多同時處理 8 個請求，可用 `--max-concurrent-requests` 調整。

專案官網 [omlx.ai](https://omlx.ai) 在 M3 Ultra 512GB 上量過：某個模型在 pp1024／tg128、不重用快取的條件下，8 個並行請求的總生成速度是單一請求的 4.14 倍。這是專案自己的數字，換一台機器、換一個模型都會不同。

對單人用 Claude Code 的情境，批次的效益比想像中小：主 agent 一次只有一個請求在跑。它真正派上用場的是 subagent 平行跑、或同時開 agent 和聊天視窗的時候。

## 分層 KV 快取：為 agent 的「繞回去」設計

這是 oMLX 跟其他 Mac 伺服器差最多的地方。[README](https://github.com/jundot/omlx#tiered-kv-cache-hot--cold) 的說法是 block 式 KV 快取，參考 vLLM 的設計，有前綴共享和 copy-on-write，分兩層：

- **熱層（RAM）**：常用的 block 留在記憶體。
- **冷層（SSD）**：熱層滿了就把 block 以 safetensors 格式寫到 SSD。下一個請求前綴相符時，從磁碟讀回來，不重算，伺服器重開之後也一樣。

為什麼這對 coding agent 特別重要？因為 agent 的 prompt 長得像一棵樹。系統提示和工具定義是共同的樹幹；每個 subagent、每次 context 壓縮、每次你按 Esc 改指令，都是一條新分支。只放在記憶體裡的快取，空間不夠時就得丟掉舊分支；等 agent 繞回來，又要從頭 prefill。oMLX 的做法是把這些分支全部落地到 SSD。官網 FAQ 宣稱長 context 下第二輪之後的 TTFT 可以從 30–90 秒降到 5 秒以內，同樣是專案自己量的數字。

預設值值得先知道（以 v0.8.2 原始碼與 README 為準）：

| 設定 | 預設 | 說明 |
|---|---|---|
| SSD 快取 | 開啟，位置 `~/.omlx/cache` | `--no-cache` 關掉 |
| SSD 快取上限 | `auto` | 可用磁碟空間加上既有快取檔，取一半；`--paged-ssd-cache-max-size 20GB` 改成固定值 |
| RAM 熱層 | `0`（關閉） | `--hot-cache-max-size 20%` 或 `8GB` 開啟 |
| 行程記憶體上限 | 系統 RAM 減 8GB | 防止整台機器 OOM |

要注意 `auto` 的意思：512GB SSD 剩 200GB 時，快取最多可以吃到約 100GB。筆電硬碟吃緊的人，第一件事就是設固定上限。

## 安裝與第一次啟動

需求是 macOS 15（Sequoia）以上、Apple Silicon（M1 到 M5）。三種裝法：

**macOS app（最省事）**：到 [Releases](https://github.com/jundot/omlx/releases) 下載 `.dmg`，v0.8.2 分成 macOS 15 與 macOS 26／27 兩個版本。拖進「應用程式」後，歡迎畫面會帶你選模型資料夾、啟動伺服器、下載第一個模型。app 會順便裝一個 `~/.omlx/bin/omlx` 指令。

**Homebrew**：

```bash
brew tap jundot/omlx https://github.com/jundot/omlx
brew install jundot/omlx/omlx            # 不需要完整 Xcode
# 有完整 Xcode 才能加 --with-custom-kernel 編原生 kernel
omlx start                               # 背景服務，當掉會自動重啟
```

**原始碼**：`git clone` 之後 `make install`（含原生 kernel，需要完整 Xcode）或 `make install-no-kernels`，Python 需 3.11–3.13。

原生 kernel 不是可有可無：README 註明 GLM-5.2、MiniMax M3、Qwen3.5 沒有它會靜默退回較慢的路徑。沒裝 Xcode 的人用 DMG 最保險，因為裡面已經預編好 kernel。

前景啟動並指定模型資料夾：

```bash
omlx serve --model-dir ~/models
```

伺服器會自動掃描子資料夾裡的 MLX 模型，LLM、VLM、embedding、reranker 都算。依官網 FAQ，它也會讀標準的 Hugging Face 快取 `~/.cache/huggingface/hub` 和 LM Studio 的模型資料夾，已經下載過的不用再抓。API 在 `http://localhost:8000/v1`，內建聊天介面在 `http://localhost:8000/admin/chat`，管理後台在 `/admin`，可以直接搜尋、下載 Hugging Face 模型和跑效能測試。

確認伺服器活著：

```bash
curl http://localhost:8000/v1/models
```

## 接上 coding agent

oMLX 同時提供 OpenAI 相容的 `/v1/chat/completions` 和 Anthropic 相容的 `/v1/messages`，所以兩邊的 client 都能直接指過來。

**Claude Code**：最簡單的是讓 oMLX 幫你設環境變數再啟動：

```bash
omlx launch claude --model <模型 ID>
```

依 [`omlx/integrations/claude.py`](https://github.com/jundot/omlx/blob/main/omlx/integrations/claude.py)，它會設 `ANTHROPIC_BASE_URL`、`ANTHROPIC_AUTH_TOKEN`、把 Opus／Sonnet／Haiku 三個層級都指到同一個本機模型、把 `API_TIMEOUT_MS` 拉長到 3,000,000 毫秒，並關掉非必要的對外流量。`--opus`、`--sonnet`、`--haiku` 可以讓三個層級用不同模型，例如 subagent 用小模型。它也會擋下 context 小於 48K 的模型，因為 Claude Code 的系統提示本身就很長。

想自己設也可以：

```bash
export ANTHROPIC_BASE_URL=http://localhost:8000
export ANTHROPIC_AUTH_TOKEN=<oMLX 的 API key，沒設就隨便填>
claude --model <模型 ID>
```

**其他 agent**：`omlx launch` 目前支援 `claude`、`claude_desktop`、`codex`、`codex_app`、`copilot`、`opencode`、`openclaw`、`hermes`、`pi`、`vibe`、`dsh`，`omlx launch list` 會列出來。管理後台的 Integrations 頁也能一鍵產生設定。其中 Codex 需要 0.148 以上，Copilot CLI 需要 1.0.83 以上（README 寫的版本要求）。

**一般 OpenAI client**：base URL 填 `http://localhost:8000/v1` 就好。

**要開放給區網用**：oMLX 在非 loopback 位址上沒有設 API key 會拒絕啟動，這個預設是對的：

```bash
OMLX_API_KEY=換成你的金鑰 omlx serve --model-dir ~/models --host 0.0.0.0
```

## 跟其他 Mac 方案怎麼選

| 工具 | 引擎 | Anthropic API | 快取 | 適合 |
|---|---|---|---|---|
| [oMLX](https://github.com/jundot/omlx) | MLX（可外接 Splash） | 有 | RAM + SSD 分層，重開仍在 | 長時間跑 coding agent、多模型常駐 |
| [Ollama](/posts/ai/2026-03-14-ollama-local-llm-guide) | GGML；Apple Silicon 上 [0.19 起預覽 MLX](https://ollama.com/blog/mlx) | 有（`ollama launch claude`） | 記憶體內，0.19 改為跨對話重用 | 一行指令就要能用、跨平台 |
| [LM Studio](https://lmstudio.ai/blog/claudecode) | llama.cpp + MLX | 0.4.1 起有 `/v1/messages` | 記憶體內 | 想要 GUI 挑模型、試模型 |
| [mlx-lm server](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/SERVER.md) | MLX | 沒有，只有 OpenAI 格式 | 記憶體內 LRU | 寫程式測試、最少依賴 |
| [llama.cpp](/posts/ai/2026-04-01-llama-cpp-local-llm-inference) | GGML／Metal | 本文未查證 | 記憶體內，可手動存 slot | GGUF 生態、要跨 Mac／Linux／Windows |

幾個判斷點：

- **你已經在用 Ollama 而且夠快**：先別換。Ollama 2026 年 3 月的 MLX 預覽版也開始做跨對話的快取重用，而且同樣有 `ollama launch claude`。oMLX 的差異是快取會落地到 SSD、並可以調很多細節。
- **mlx-lm server 跟 oMLX 的差距**：兩者底層一樣，連批次都用同一個 `BatchGenerator`。mlx-lm 的 [SERVER.md](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/SERVER.md) 明說「not recommended for production as it only implements basic security checks」，也沒有 Anthropic 端點。要接 Claude Code，oMLX 省掉的是自己寫轉接層的工夫。
- **要跑 GGUF**：oMLX 本身的 MLX 引擎不載 GGUF，GGUF 要交給外接的 [Splash](https://github.com/incoai/splash) 引擎跑（見 [docs/Splash.md](https://github.com/jundot/omlx/blob/main/docs/Splash.md)）。只想用 GGUF 的話，直接用 llama.cpp 或 Ollama 比較單純。

更大範圍的伺服器選型，可以對照[自架推論伺服器怎麼選](/posts/tech/2026-08-24-self-hosted-inference-server-guide)。

## 增量在哪裡：沒有 oMLX 也做得到的事

把 oMLX 拿掉，以下能力仍然存在：

- **在 Mac 上用 MLX 跑模型**：mlx-lm 本來就能。
- **連續批次**：mlx-lm server 已經用 `BatchGenerator` 做批次。
- **記憶體內的前綴快取**：mlx-lm server、Ollama、LM Studio、llama.cpp 都有某種形式。
- **讓 Claude Code 連本機模型**：Ollama 和 LM Studio 都有 Anthropic 相容端點。

oMLX 真正多出來的是：

1. **SSD 冷層**：快取在 RAM 裝不下或伺服器重開之後還能命中。這是本篇最核心的增量。
2. **多模型常駐管理**：LRU 淘汰、釘選、每個模型各自的閒置 TTL、整體記憶體上限，加上選單列 app。
3. **agent 整合細節**：替 Claude Code 回報模型真實的 context 長度讓自動壓縮在正確時機觸發，長 prefill 期間送 SSE keep-alive 避免逾時，一鍵 `omlx launch`。

## 什麼時候不要用 oMLX

- **不是 Apple Silicon、或還在 macOS 14 以下**：裝不起來。
- **記憶體 32GB 以下**：官網寫 16GB 是最低、64GB 以上才舒服。coding agent 需要的 48K context 加上模型權重，小記憶體機器能選的模型很有限，問題不在伺服器。
- **SSD 空間緊**：預設 `auto` 會吃掉剩餘空間的一半。不想管快取就加 `--no-cache`，但那樣 oMLX 最大的優勢也沒了。
- **要穩定的生產環境**：專案 2026-02 才建立，到 v0.8.2 已經發了很多個 rc 和 dev 版，模型支援幾乎每週變。給團隊共用的服務，用 [vLLM 等伺服器](/posts/tech/2026-08-24-self-hosted-inference-server-guide)放在 GPU 機器上比較穩。
- **只是偶爾問答**：一次一個短問題，快取和批次都用不上，Ollama 或 LM Studio 的上手成本更低。

## 整體來說

oMLX 的取捨很明確：它用 SSD 空間和比較多的設定項，換 coding agent 長時間工作時的等待時間。如果你的使用方式是「開著 Claude Code 一整天、subagent 跑來跑去、常常切換分支」，它解決的正是最痛的那一段。今晚可以做的是：裝 DMG、在 `/admin` 下載一個 context 至少 48K 的 MLX 模型、跑 `omlx launch claude`，然後在管理後台看第二輪之後的快取命中與 TTFT。如果數字沒有明顯改善，回到原本的工具也只要關掉選單列 app。

## 參考資料

- [jundot/omlx — GitHub](https://github.com/jundot/omlx)（README、`omlx/cli.py`、`omlx/settings.py`、`omlx/integrations/claude.py`，v0.8.2，2026-11-22 讀取）
- [oMLX v0.8.2 release notes](https://github.com/jundot/omlx/releases/tag/v0.8.2)
- [oMLX v0.8.0 release notes](https://github.com/jundot/omlx/releases/tag/v0.8.0)
- [oMLX 官網與 benchmark](https://omlx.ai)
- [oMLX docs/Splash.md：外接 Splash 引擎](https://github.com/jundot/omlx/blob/main/docs/Splash.md)
- [mlx-lm SERVER.md](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/SERVER.md)
- [Ollama is now powered by MLX on Apple Silicon in preview](https://ollama.com/blog/mlx)
- [Use your LM Studio Models in Claude Code（LM Studio 0.4.1）](https://lmstudio.ai/blog/claudecode)
- [vllm-mlx — GitHub](https://github.com/waybarrios/vllm-mlx)
- [MLX：Apple Silicon 上的陣列框架](/posts/ai/2026-11-22-mlx-apple-silicon-array-framework)
- [Splash：Apple Silicon 推論引擎](/posts/ai/2026-11-22-splash-apple-silicon-inference-engine)
- [Ollama 本機 LLM 指南](/posts/ai/2026-03-14-ollama-local-llm-guide)
- [llama.cpp 本機推論](/posts/ai/2026-04-01-llama-cpp-local-llm-inference)
- [自架推論伺服器怎麼選](/posts/tech/2026-08-24-self-hosted-inference-server-guide)
