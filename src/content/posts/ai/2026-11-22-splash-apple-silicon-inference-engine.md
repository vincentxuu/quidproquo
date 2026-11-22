---
title: "Splash 是什麼：Apple Silicon 上為模型量身打造的推論引擎、DFlash 2 與 coding agent"
date: 2026-11-22
type: deep-dive
category: ai
tags: [splash, apple-silicon, local-inference, speculative-decoding, coding-agent, gguf, llm-inference]
lang: zh-TW
series:
  name: "本機跑模型"
  order: 3
tldr: "Splash 是 Inco AI 開源的 Mac 推論引擎（Apache-2.0，1.7.0），只支援五個模型家族，但每個都配一顆訓練好的 DFlash 2 草稿模型與專屬 Metal kernel；官方在 M5 Pro 上測 Qwen3.8-27B 解碼 74 tok/s，同權重 llama.cpp 是 16。需要 M3 以上、macOS 26.4 以上。"
description: "介紹 Splash 的設計思路（引擎圍繞模型而建）、DFlash 2 推測解碼怎麼運作、安裝與第一次啟動、如何接 Claude Code / Codex / OpenCode 等 coding agent、硬體需求，以及和 llama.cpp、oMLX、Ollama 的取捨與不該用的情境。"
draft: false
glossary:
  - term: "DFlash 2"
    aliases: ["DFlash", "DFlash2"]
    definition: "Inco AI 的推測解碼草稿模型設計：草稿模型一次平行猜出整段 token，再由主模型一次驗證。第二版加了路徑選擇器與短卷積，讓每次驗證多留下約兩成 token。"
    context: "Splash 每個支援的模型都綁一顆 DFlash 2 草稿模型，解碼一律走這條路。"
    links:
      - label: "DFlash 2 部落格文"
        url: "https://inco.ai/blog/dflash2/"
  - term: "草稿模型"
    aliases: ["draft model", "drafter", "draft"]
    definition: "推測解碼裡負責「先猜」的小模型。它猜的 token 會交給大模型（target）驗證，猜對的直接採用，猜錯的丟掉，所以不會改變輸出。"
    context: "Splash 會依你選的主模型自動下載對應的草稿模型。"
  - term: "接受長度"
    aliases: ["acceptance length"]
    definition: "每次驗證平均能留下幾個 token（含主模型自己補的下一個）。數字越大，代表一次前向計算換到越多輸出。"
    context: "DFlash 2 文章用它比較不同草稿模型的效果。"
  - term: "Prefill"
    aliases: ["預填", "prefill"]
    definition: "模型開始生成之前，先把整段輸入 prompt 讀完、算出 KV cache 的階段。prompt 越長，等第一個 token 的時間越久。"
    context: "coding agent 第一次讀整個 repo 時最吃 prefill 速度。"
  - term: "Prefix caching"
    aliases: ["前綴快取", "prefix cache"]
    definition: "把已經算過的 prompt 開頭（例如系統提示詞與前幾輪對話）的 KV cache 存起來，下一個請求開頭一樣時直接重用，不必重算。"
    context: "agent 每一輪都會把整段歷史再送一次，所以這項對 agent 影響最大。"
  - term: "統一記憶體"
    aliases: ["unified memory"]
    definition: "Apple Silicon 上 CPU 與 GPU 共用同一塊記憶體。Mac 的記憶體容量就是能放下多大模型的上限。"
    context: "Splash 的記憶體規劃以 Metal 建議的工作集上限為預算。"
---

> :globe: [English version](/posts/ai/2026-11-22-splash-apple-silicon-inference-engine-en)

[Splash](https://github.com/incoai/splash) 是 [Inco AI](https://inco.ai/) 開源的本機推論引擎，只跑在 Apple Silicon 上，用 C++ 與 Metal 寫成，Apache-2.0 授權。它在 2026 年 9 月發表，截至 2026-11-22 最新版是 1.7.0。它做的事跟 [Ollama](/posts/ai/2026-03-14-ollama-local-llm-guide) 或 [llama.cpp](/posts/ai/2026-04-01-llama-cpp-local-llm-inference) 的 server 一樣：在你的 Mac 上開一個 OpenAI／Anthropic 相容的 API，讓 coding agent 或其他應用程式接上來。

不一樣的是取捨方向。一般引擎想辦法「什麼模型都能跑」，Splash 反過來，只支援少數幾個模型家族，然後替每一個量身做 kernel、配一顆訓練好的草稿模型、算好記憶體預算。官方 README 的副標就是這句：「built around the model」。

這篇是[本機跑模型](/posts/ai/2026-11-22-mlx-apple-silicon-array-framework)系列第三篇。前兩篇講 [MLX](/posts/ai/2026-11-22-mlx-apple-silicon-array-framework) 框架和以它為底的 [oMLX](/posts/ai/2026-11-22-omlx-apple-silicon-inference-server) 伺服器；這篇講 Splash 是什麼、DFlash 推測解碼怎麼運作、怎麼裝、怎麼接 Claude Code 這類 agent，以及什麼情況下不該選它。第四篇會用四個開放模型[對照各工具在 32GB Mac 上怎麼跑](/posts/ai/2026-11-22-run-open-models-on-32gb-mac)。

## 「圍繞模型而建」是什麼意思

[Splash 發表文](https://inco.ai/blog/splash/)把引擎拆成兩層。共用的一層是 runtime、排程器、快取與 API；其餘的部分每個模型各做一份：

```
          每個模型各一份                      所有模型共用
┌──────────────────────────────┐   ┌────────────────────────────┐
│ 依模型形狀產生的 Metal kernel │   │ 排程：請求合批、prefill/decode │
│ 為它訓練的 DFlash 2 草稿模型  │ → │ 分頁式 KV cache + 前綴快取    │
│ 依權重大小算好的記憶體計畫    │   │ OpenAI / Anthropic 相容 API   │
└──────────────────────────────┘   └────────────────────────────┘
```

實際的後果有三個：

- **支援清單很短。** 截至 1.7.0，README 列出 Qwen3.8-27B、Qwen3.6-35B-A3B、Ornith-1.5-122B、Qwen3.8-Flash-Next、Flint 五個家族，加上 Ternary Bonsai 2 這個 2-bit 變體。清單外的模型就是不能跑，沒有退回通用路徑。
- **權重格式照常用社群的。** 你給它 Hugging Face 上的 GGUF（例如 Unsloth 的 `UD-Q4_K_M`）或 MLX 4-bit checkpoint，它在載入時把權重轉成自己 kernel 的排列方式，磁碟上不多存一份。kernel 預先編譯好，使用者不用裝 Xcode。
- **幾乎沒有東西要調。** 發表文的說法是可調的只有上限，例如 `--max-memory`、`--max-context`，用來讓出記憶體給你同時開的編輯器和瀏覽器。

這也是它跟 llama.cpp 的根本差別。llama.cpp 的 GGUF 涵蓋大多數主流開源架構，代價是每個模型都走同一套泛用 kernel；Splash 放棄廣度，換每個模型的峰值速度。

## DFlash 推測解碼：白話版

LLM 生成文字時，每產生一個 token 都要把整個模型讀過一次。在 Mac 上，瓶頸通常是記憶體頻寬，GPU 的計算力反而閒著。推測解碼（speculative decoding）就是拿這段閒置的算力來做事：

1. 一個小的**草稿模型**先猜接下來的一整段 token。
2. 大的**主模型**用一次前向計算，同時檢查這一整段。
3. 從頭比對，猜對的直接採用，第一個猜錯的位置之後全部丟掉，主模型順便補上正確的下一個 token。

因為最後採用的每個 token 都經過主模型認可，輸出跟不用推測解碼時一樣。差別只在速度：猜得準，一次計算就能換到好幾個 token。衡量指標叫**接受長度**，也就是每次驗證平均留下幾個 token。

傳統草稿模型自己也是一個字一個字猜，猜八個就要跑八次。Inco 團隊在 2026 年 1 月發表的 [DFlash 論文](https://arxiv.org/abs/2602.06036)（arXiv:2602.06036）改成一次前向計算平行猜出整段。問題是每個位置各猜各的，彼此不一定接得起來。

[DFlash 2](https://inco.ai/blog/dflash2/)（2026 年 8 月）補了兩個零件：

- **路徑選擇器**：每個位置保留前 16 名候選，再替相鄰兩個候選的組合打分，挑出一條前後連貫的路徑。Inco 的分析是，第一個位置的正確答案有 99.5% 落在前 16 名裡，只是第一名不一定對，所以「挑」比「重新預測」便宜。
- **短卷積**：在草稿模型每一層插入只看前一個位置的小卷積，緩解越後面的位置越容易猜錯的問題。

兩者加起來，依 DFlash 2 文章，在 Qwen3.5-4B 的五個基準上平均接受長度比初代 DFlash 多 21%，每次循環的延遲只多 1.3%。

```
主模型已確認：  def add(a, b):
草稿一次猜 8 個：  ⏎  ␣␣  return  ␣a  ␣+  ␣b  ⏎  ⏎
主模型一次驗證：  ✓  ✓    ✓       ✓   ✓   ✓   ✗
採用：           前 6 個 + 主模型自己補的第 7 個
```

在 Splash 裡，推測解碼是唯一的解碼路徑，不是開關。發表文說引擎有三處是圍繞草稿模型設計的。第一，起草、驗證、接受與狀態更新包成一個單位送給 GPU。第二，每個請求各自帶著草稿狀態，所以推測解碼能跟多請求合批並存。第三，草稿模型用滑動視窗注意力，長 context 下記憶體不會跟著長。1.7.0 再把驗證從一條鏈改成最多 16 列的樹，並加入從 prompt 內文找重複片段的 prompt lookup（見 [1.7.0 release notes](https://github.com/incoai/splash/blob/main/docs/release-notes/1.7.0.md)）。

## 硬體與系統需求

| 項目 | 需求 | 來源 |
|---|---|---|
| 晶片 | Apple M3 或更新 | [README](https://github.com/incoai/splash#quick-start) |
| 作業系統 | macOS 26.4 或更新 | README |
| 記憶體 | Qwen3.8-27B 4-bit 至少 36 GB，建議 48 GB | [Splash 發表文](https://inco.ai/blog/splash/) |
| 小記憶體 | 24 GB 可跑較小的 GGUF 變體（如 27B 的 `UD-IQ3_XXS`） | [performance.md](https://github.com/incoai/splash/blob/main/docs/performance.md#smaller-ggufs-on-24-gb-macs) |
| 磁碟 | 27B 4-bit 範例含草稿約 21 GB，35B-A3B 約 24 GB | [server.md](https://github.com/incoai/splash/blob/main/docs/server.md#model-storage) |

M1、M2 不在支援範圍。至於為什麼建議 48 GB：依發表文，Qwen3.8-27B 光權重就占 15 GiB，再加上草稿模型，剩下的才留給 KV cache 和你同時開的編輯器、瀏覽器。

## 安裝與第一次啟動

有兩條路。想要圖形介面，下載 [Splash.dmg](https://github.com/incoai/splash/releases/latest/download/Splash.dmg) 拖進「應用程式」。想用命令列，需要 [Homebrew](https://brew.sh)：

```bash
brew install incoai/tap/splash
splash serve --model unsloth/Qwen3.8-27B-GGUF:UD-Q4_K_M
```

第一次執行會下載主模型與對應的草稿模型（走 Hugging Face 快取，預設在 `~/.cache/huggingface/hub`），然後在 `127.0.0.1:8000` 開始服務。升級後第一次啟動還會準備 GPU 程式，[server.md](https://github.com/incoai/splash/blob/main/docs/server.md#build-and-run) 說要多等幾分鐘。

看到 `Ready` 之後，這個終端機視窗不要關。用瀏覽器開 <http://127.0.0.1:8000> 就是內建的聊天頁；或從另一個終端機打 API：

```bash
curl http://127.0.0.1:8000/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "unsloth/Qwen3.8-27B-GGUF:UD-Q4_K_M",
    "messages": [{"role": "user", "content": "Explain speculative decoding in one sentence."}]
  }'
```

API 涵蓋 OpenAI 的 Chat Completions、Responses、Completions，以及 Anthropic 的 Messages（`/v1/messages`），支援串流、工具呼叫、JSON Schema 輸出，也吃 base64 圖片和 PDF。停止服務就在 server 視窗按 Ctrl+C。

模型已經在本機的話，可以直接指檔案，不連 Hub：

```bash
splash serve --model local/qwen \
  --model-dir /models/Qwen3.8-27B-GGUF/Qwen3.8-27B-UD-Q4_K_M.gguf \
  --draft-model /models/Qwen3.8-27B-DFlash2
```

如果你習慣 [LM Studio](https://lmstudio.ai/)，照 [LM Studio 的 Splash 說明](https://lmstudio.ai/blog/splash-engine)做就好：在 LM Studio Bionic 1.1.5 以上的「Settings > Runtime」下載 Splash (Metal) 後端，再下載 `incoai/Qwen3.8-27B-Splash` 這類預先打包的模型。要注意 LM Studio 內建的 Splash 跟 Homebrew 裝的命令列版本不同步。2026 年 11 月 22 日我們在 Bionic 1.2.2 下載這個後端，裡面的 `release.json` 標的是 1.3.0，原始碼 commit 跟 Splash 的 [1.3.0 tag](https://github.com/incoai/splash/releases/tag/1.3.0) 完全相同，而且它仍然吃 `target/`、`draft/` 結構的打包模型。命令列版從 [1.3.1](https://github.com/incoai/splash/releases/tag/1.3.1) 起就[不再載入這種打包](https://github.com/incoai/splash/blob/main/docs/models.md#splash-packages)，要改用 `mlx-community/Qwen3.8-27B-4bit`。所以兩套說明在各自的環境下都對，只是同一份模型不能在兩邊共用。

## 接上 coding agent

這是 Splash 最主打的用途。server 跑起來後，在另一個終端機輸入：

```bash
splash opencode    # 或：splash claude / splash codex / splash hermes / splash pi
```

這些子指令會啟動你已經裝好的 [OpenCode](https://github.com/anomalyco/opencode)、[Claude Code](https://github.com/anthropics/claude-code)、[Codex](https://github.com/openai/codex)、[Hermes](https://github.com/NousResearch/hermes-agent) 或 [Pi](https://github.com/earendil-works/pi)，並把它們指到本機的 Splash。Splash 不會幫你安裝 agent 本身。後面接的參數會原樣傳給 agent，例如 `splash codex resume --last`。

依 [server.md 的 agent launchers 一節](https://github.com/incoai/splash/blob/main/docs/server.md#agent-launchers)：`splash claude`、`codex`、`opencode` 只在啟動時帶入設定，不寫任何檔案；`splash pi` 會在 Pi 的 `models.json` 加一個 `splash` provider，`splash hermes` 會建一個名為 `splash` 的 Hermes profile。server 若用了別的 `--port`，agent 那邊也要帶同樣的 `--port`。

兩個實務建議：

- **context 要留夠。** [performance.md](https://github.com/incoai/splash/blob/main/docs/performance.md#smaller-ggufs-on-24-gb-macs) 提到 coding agent 大約需要 100K token 的 context，Claude Code 光系統提示就約 33K。24 GB 的 Mac 跑 27B 時，官方建議加 `--language-only` 關掉視覺，把記憶體讓給 context。
- **閒置會釋放模型。** 預設閒置 10 分鐘後把模型移出記憶體，下一次請求要重新載入。整天開著 agent 工作的話，啟動時加 `--idle-release off`。

agent 的使用模式正好對到 Splash 優化的地方。它每一輪都把越來越長的對話歷史整段送回來，前綴快取讓重複的部分不用重算。subagent 同時發出多個請求時，自動合批讓它們共用一張 GPU。

## 常用設定

記憶體與 context 預設自動算到模型原生上限（目前支援的家族都是 256K）。想手動設上限，加在 `splash serve` 後面：

| 參數 | 用途 |
|---|---|
| `--max-memory 28G` | 限制 Metal 記憶體用量，替其他程式留空間 |
| `--max-context 100K` | 設定 context 上限 |
| `--idle-release off` | 閒置時不釋放模型（預設 10 分鐘後釋放） |
| `--language-only` | 不載入視覺，只服務文字 |
| `--max-cache-disk 16G` | SSD 快取上限（預設自動，最多 32 GiB；`0` 關閉） |
| `--persistent-cache` | 重開後保留 SSD 快取（預設關） |

預設只聽 localhost、沒有驗證。要讓區網其他機器連，[server.md](https://github.com/incoai/splash/blob/main/docs/server.md#network-and-authentication) 的寫法是 `--host 0.0.0.0` 搭配 `--api-key`。

## 跟 llama.cpp、oMLX、Ollama 怎麼選

先講清楚 Splash 的增量在哪。推測解碼本身不是 Splash 獨有的：DFlash 2 文章同時列出 llama.cpp（`--spec-type draft-dflash`）、vLLM、SGLang 的用法，也提供一個支援 DFlash 2 的 oMLX 分支，Ollama 則有一個尚未合併的 PR。換句話說，你不用 Splash 也能在 Mac 上用 DFlash 2 草稿模型。Splash 多做的是：草稿模型預設綁好且不能關、kernel 依模型形狀特製、記憶體依已知權重大小一次規劃完，再加上一行接 agent 的啟動指令。

| | Splash | [llama.cpp](https://github.com/ggml-org/llama.cpp) | [oMLX](https://github.com/jundot/omlx) | [Ollama](https://github.com/ollama/ollama) |
|---|---|---|---|---|
| 模型範圍 | 五個家族 | 大多數主流開源架構（GGUF） | MLX 生態的模型 | 官方模型庫 + GGUF |
| 推測解碼 | 一律開啟，自動配草稿 | 要自己指定草稿模型 | 分支版支援 DFlash 2 | DFlash 2 在未合併的 PR |
| 硬體 | 只限 M3 以上 Mac | CPU / Metal / CUDA / Vulkan 等 | Apple Silicon | macOS / Linux / Windows |
| 介面 | CLI、桌面 app、內建聊天頁 | CLI、server | 選單列 app | CLI、桌面 app |
| 接 agent | `splash claude` 等一行指令 | 自己設定 base URL | 自己設定 base URL | 自己設定 base URL |

速度數字目前都出自 Inco 自己的測試，方法學有公開但還沒看到第三方重現：

- [README 的 GGUF 對照](https://github.com/incoai/splash#gguf-against-llamacpp)用同一份 Unsloth `UD-Q4_K_M` 權重，在 M5 Pro（20 核 GPU）上 Qwen3.8-27B 解碼 Splash 74 tok/s、llama.cpp 16 tok/s。同一節也比了輸出：27B 上 Splash 與 llama.cpp 的下一個 token 一致率高於 99%，比 llama.cpp 自己 CPU 版與 GPU 版之間還接近。
- [Splash 發表文](https://inco.ai/blog/splash/)在 48 GB M5 Pro 上比較 Qwen3.8-27B 短 prompt 解碼：Splash 74、oMLX 38、Ollama 24 tok/s。每個引擎都用各自的建議設定，所以是端到端比較，不是單一技術的對照。

給 Mac 上跑 coding agent 的人，選擇大致是：

- 想跑的模型在 Splash 清單裡、Mac 是 M3 以上 → 先試 Splash，速度差距在 agent 長對話裡最明顯。
- 想同時切換很多不同模型、或要跑清單外的新模型 → [oMLX](/posts/ai/2026-11-22-omlx-apple-silicon-inference-server) 或 llama.cpp。
- 只想要最簡單的一行指令、跨平台、模型庫大 → [Ollama](/posts/ai/2026-03-14-ollama-local-llm-guide)。

## 什麼情況不要用 Splash

- **M1 / M2 或 macOS 26.4 以前。** 官方不支援，沒有降級模式。
- **模型不在清單上。** 想跑 Llama、Gemma、Mistral 或明天剛釋出的新模型，Splash 跑不了。完整 BF16／F16 的 GGUF 也會被拒絕。
- **Linux 或 NVIDIA GPU。** Splash 只做 Mac。DFlash 2 草稿模型在那些平台要搭 vLLM、SGLang 或 llama.cpp。
- **需要穩定不動的工具鏈。** 1.0 到 1.7.0 只隔兩個月，中間改過模型格式（命令列版 1.3.1 起停用 Splash packages）、改過 Hermes 設定的存放位置。拿來做長期固定的部署，要把版本與 `--revision` 都釘住。
- **SSD 很小或很在意寫入量。** SSD 快取預設開啟，在 `$TMPDIR` 最多用 32 GiB，macOS 會把它算進「系統資料」。performance.md 記錄過一次高負載測試約每小時寫入 50 GB，可以用 `--max-cache-disk 0` 關掉或用 `--max-cache-disk-writes` 設每日上限。
- **只想要第三方驗證過的數字。** 目前所有速度對照都是 Inco 自己量的，自己的 Mac 跑 [validate.md](https://github.com/incoai/splash/blob/main/docs/validate.md#local-benchmarks) 裡的本機 benchmark 再下結論。

## 整體來說

Splash 用模型廣度換單一模型的速度。它的賭注是：在 Mac 上跑 coding agent 的人，真正常用的模型只有少數幾個，與其每個都普普通通，不如把那幾個做到最快。如果你的 Mac 是 M3 以上、記憶體 48 GB 左右、想用的是 Qwen3.8-27B 或 Qwen3.6-35B-A3B，今晚可以這樣試：`brew install incoai/tap/splash`，起 server，再開一個終端機打 `splash claude` 或 `splash opencode`，拿你手上的一個 repo 跑一個小任務，跟你現在用的引擎比一下等待時間。

## 參考資料

- [incoai/splash（GitHub）](https://github.com/incoai/splash)
- [Splash 文件：Server](https://github.com/incoai/splash/blob/main/docs/server.md)
- [Splash 文件：Models](https://github.com/incoai/splash/blob/main/docs/models.md)
- [Splash 文件：Performance](https://github.com/incoai/splash/blob/main/docs/performance.md)
- [Splash 1.7.0 release notes](https://github.com/incoai/splash/blob/main/docs/release-notes/1.7.0.md)
- [Splash: A local engine built around the model（Inco AI，2026-09-17）](https://inco.ai/blog/splash/)
- [DFlash 2: Keep drafting parallel（Inco AI，2026-08-18）](https://inco.ai/blog/dflash2/)
- [Splash Engine in LM Studio Bionic（LM Studio，2026-09-18）](https://lmstudio.ai/blog/splash-engine)
- [MLX：Apple Silicon 的陣列框架](/posts/ai/2026-11-22-mlx-apple-silicon-array-framework)
- [oMLX：MLX 上的推論伺服器](/posts/ai/2026-11-22-omlx-apple-silicon-inference-server)
- [llama.cpp 本機 LLM 推論](/posts/ai/2026-04-01-llama-cpp-local-llm-inference)
- [Ollama 本機 LLM 指南](/posts/ai/2026-03-14-ollama-local-llm-guide)
