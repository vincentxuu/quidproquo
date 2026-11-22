---
title: "32GB Mac 怎麼跑四個熱門開放模型：Qwen3.8、Muse Glimmer、Nemotron 3.5 Bolt、Inkling 2 Mini 的工具對照與指令"
date: 2026-11-22
type: guide
category: ai
tags: [apple-silicon, local-inference, gguf, llama-cpp, ollama, mlx, coding-agent, quantization]
lang: zh-TW
series:
  name: "本機跑模型"
  order: 4
tldr: "截至 2026-11-22，四個模型在 32–36 GB 的 Apple Silicon Mac 上都有能跑的組合，但工具差很多：Qwen3.8-27B 六個工具全通；Muse Glimmer 只有 Splash 不行；Inkling 2 Mini 兩天前才釋出，llama.cpp 要 b12600 以上，請用官方安裝腳本（Homebrew 版停在 11/13 的 1.0.0，跑不了）、mlx-lm 還沒合併；Nemotron 3.5 Bolt 的 22 GB 檔在 Ollama 官方標明不支援 Apple Silicon，llama.cpp 能跑但有一部分權重會落到 CPU。"
description: "Qwen3.8-27B、Muse Glimmer、Nemotron 3.5 Bolt 74B-A9B、Inkling 2 Mini 在 mlx-lm、oMLX、Splash、llama.cpp、Ollama、LM Studio 上的相容矩陣，每個模型挑一個放得進 32GB 的量化檔、下載與啟動指令、接 Claude Code 的方式，以及 macOS GPU 記憶體上限怎麼調。"
draft: false
glossary:
  - term: "wired memory 上限"
    aliases: ["iogpu.wired_limit_mb", "recommendedMaxWorkingSetSize", "wired limit"]
    definition: "macOS 允許 GPU 鎖住（不換出到 swap）的記憶體上限。預設只有整台記憶體的一部分，模型加 KV cache 超過它就會變慢或載入失敗。"
    context: "36 GB 的 Mac 上，Nemotron 3.5 Bolt 的 22 GB 權重會貼近預設上限。"
  - term: "mmproj"
    aliases: ["多模態投影器", "vision projector"]
    definition: "llama.cpp 生態把視覺編碼器另存成一個獨立的 GGUF 檔，叫 mmproj。要讀圖才需要下載它；只用文字就可以不載入，省下記憶體。"
    context: "四個模型都是視覺語言模型，各自有 0.6–1.7 GB 的 mmproj。"
  - term: "NVFP4"
    aliases: ["nvfp4"]
    definition: "NVIDIA 定義的 4-bit 浮點格式，每 16 個數共用一個縮放係數。Blackwell 世代 GPU 有硬體直接算；Apple GPU 沒有 FP4 硬體，要靠軟體 kernel 解碼。"
    context: "Inkling 2 Mini 的原始權重和 Nemotron 3.5 Bolt GGUF 的部分層都用這個格式，這直接影響 Mac 上哪些工具跑得動。"
---

> :globe: [English version](/posts/ai/2026-11-22-run-open-models-on-32gb-mac-en)

這是[本機跑模型](/posts/ai/2026-11-22-mlx-apple-silicon-array-framework)系列第四篇。前三篇分別介紹了 [MLX 與 mlx-lm](/posts/ai/2026-11-22-mlx-apple-silicon-array-framework)、[oMLX](/posts/ai/2026-11-22-omlx-apple-silicon-inference-server) 和 [Splash](/posts/ai/2026-11-22-splash-apple-silicon-inference-engine) 三個工具。這篇反過來從模型出發。假設你手上是一台 32–36 GB 記憶體的 Apple Silicon Mac（例如 M3 Pro 36 GB），想跑最近熱門的四個開放權重模型：每個該用哪個工具、下載哪個檔、打什麼指令。

四個模型是：

- **Qwen3.8-27B**：阿里 Qwen 團隊的 27B 稠密視覺語言模型，262K context，Apache 2.0（[Hugging Face](https://huggingface.co/Qwen/Qwen3.8-27B)）。同家族的 MoE 預覽版見 [Qwen3.8-Flash-Next 模型卡](/posts/daily/2026-08-26-model-qwen-qwen3-8-flash-next)。
- **Muse Glimmer**：Meta 的 29.6B 本機 agent 模型，Apache 2.0（[模型卡](/posts/daily/2026-08-17-model-meta-muse-glimmer)）。
- **Nemotron 3.5 Bolt 74B-A9B-24GB**：NVIDIA 從 Super VL 壓縮出來、專家權重用 2-bit 訓練的混合 Mamba2/Transformer MoE，256K context（[家族介紹](/posts/tech/2026-10-10-ai-model-family-nemotron)）。
- **Inkling 2 Mini**：Thinking Machines Lab 在 2026-11-20 釋出的 looped transformer，26.4B 總參數、3.4B 啟用，1M context（[模型卡](/posts/daily/2026-11-21-model-thinking-machines-inkling-2-mini)）。

工具是六個：[mlx-lm](https://github.com/ml-explore/mlx-lm)（`mlx_lm.server`）、[oMLX](https://github.com/jundot/omlx)、[Splash](https://github.com/incoai/splash)、[llama.cpp](https://github.com/ggml-org/llama.cpp)（`llama-server`）、[Ollama](https://ollama.com/) 和 [LM Studio](https://lmstudio.ai/)。

所有支援狀態都是 2026-11-22 對著原始碼、模型頁和 release notes 查的，指令照官方文件寫，**沒有在 Mac 上實際執行過**。兩天前才出的 Inkling 2 Mini 尤其會變，照做前先看一下各工具的最新版。

## 相容矩陣

✓ 能跑　:warning: 能跑但有限制　✗ 不支援　— 每格的依據列在表下。

| 模型 | mlx-lm | oMLX | Splash | llama.cpp | Ollama | LM Studio |
|---|---|---|---|---|---|---|
| [Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B) | :warning: 只有文字 | ✓ | ✓ | ✓ | ✓ | ✓ |
| [Muse Glimmer](https://huggingface.co/meta-models/Muse-Glimmer-30B) | :warning: 只有文字 | ✓ | ✗ | ✓ | ✓ | ✓ |
| [Nemotron 3.5 Bolt](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Bolt-74B-A9B-24GB-GGUF) | ✗ | :warning: 社群檔，作者建議 48 GB | ✗ | :warning: 部分權重落到 CPU | ✗ Mac 不支援 | 未確認 |
| [Inkling 2 Mini](https://huggingface.co/thinkingmachines/Inkling-2-Mini) | ✗ PR 未合併 | ✓ 0.8.1 起 | ✗ | ✓ b12600 起 | ✓ 0.40.17 起 | ✓ |

**每格的依據：**

- **mlx-lm**：[`mlx_lm/models/`](https://github.com/ml-explore/mlx-lm/tree/main/mlx_lm/models) 有 `qwen3_5` 和 `muse_glimmer`，兩者載入時都會丟掉視覺權重（`checkpoint.py` 裡把 `vision_tower` 開頭的 key 濾掉），所以只有文字。Bolt 的語言部分是 `nemotron_h_puzzle` 架構，目前沒有，支援它的 [PR #1982](https://github.com/ml-explore/mlx-lm/pull/1982) 從 10 月開著。Inkling 2 Mini 的 [PR #2086](https://github.com/ml-explore/mlx-lm/pull/2086) 也還沒合併。
- **oMLX**：Qwen3.8 走 mlx-lm 的 `qwen3_5`；Muse Glimmer 有專用的 `omlx/adapter/muse_glimmer.py`；Inkling 2 Mini 在 [v0.8.1 release notes](https://github.com/jundot/omlx/releases/tag/v0.8.1) 列為新支援。Bolt 沒有官方支援。社群的 [txgsync/…-24GB-MLX](https://huggingface.co/txgsync/NVIDIA-Nemotron-3.5-Bolt-74B-A9B-24GB-MLX) 附了一個自訂 Metal kernel 檔，要開 Trust Remote Code 才能在 oMLX 載入。作者寫明「需要 48 GB 以上，沒測過更小的 Mac」。
- **Splash**：[README](https://github.com/incoai/splash#quick-start) 與 [docs/models.md](https://github.com/incoai/splash/blob/main/docs/models.md) 列的 1.7.0 支援清單是 Qwen3.8-27B、Qwen3.6-35B-A3B、Ornith-1.5-122B、Qwen3.8-Flash-Next、Flint 與 Ternary Bonsai 2。另外三個模型不在上面，Splash 也沒有通用的退路。
- **llama.cpp**：[`src/llama-arch.cpp`](https://github.com/ggml-org/llama.cpp/blob/master/src/llama-arch.cpp) 有 `qwen35`、`muse-glimmer`、`nemotron_h_moe`、`inkling2_loop` 四個架構，`tools/mtmd/models/` 也都有對應的視覺模組。Inkling 2 Mini 由 [PR #32694](https://github.com/ggml-org/llama.cpp/pull/32694) 在 2026-11-20 合併，第一個包含它的 release 是 [b12600](https://github.com/ggml-org/llama.cpp/releases/tag/b12600)。Bolt 的限制見下面 Bolt 一節。
- **Ollama**：[qwen3.8](https://ollama.com/library/qwen3.8)、[muse-glimmer](https://ollama.com/library/muse-glimmer)、[inkling-2-mini](https://ollama.com/library/inkling-2-mini) 都有官方 tag。[nemotron-3.5-bolt](https://ollama.com/library/nemotron-3.5-bolt) 頁面直接寫「Apple Silicon / Metal is not currently supported for 74B-A9B」。
- **LM Studio**：[qwen3.8](https://lmstudio.ai/models/qwen3.8)、[muse-glimmer](https://lmstudio.ai/models/muse-glimmer)、[inkling-2-mini](https://lmstudio.ai/models/inkling-2-mini) 都在官方模型目錄。Bolt 只有社群的 [lmstudio-community GGUF](https://huggingface.co/lmstudio-community/NVIDIA-Nemotron-3.5-Bolt-74B-A9B-GGUF)，目錄裡沒有它的頁面。LM Studio 在 Mac 上用 llama.cpp 引擎跑 GGUF，推測會遇到跟 llama.cpp 一樣的 CPU 回退。我們沒查到 LM Studio 自己的說明，所以標未確認。

## 先算記憶體：macOS 只讓 GPU 用一部分

Apple Silicon 的 CPU 和 GPU 共用記憶體，但 macOS 預設只讓 GPU 鎖住其中一部分。llama.cpp 啟動時會印出 `recommendedMaxWorkingSetSize`，就是這個上限。[llama.cpp issue #1870](https://github.com/ggml-org/llama.cpp/issues/1870) 的討論引用 Apple 的 tech talk：64 GB 機器約 75%，32 GB 以下約 65%。36 GB 機器落在 23–27 GB 之間，實際數字請看你自己機器的啟動 log。

四個模型這次挑的量化檔：

| 模型 | 這篇用的檔 | 權重大小 | 讀圖另加 |
|---|---|---|---|
| Qwen3.8-27B | `unsloth/Qwen3.8-27B-GGUF` 的 `UD-Q4_K_M` | 16.56 GB | mmproj 0.93 GB |
| Muse Glimmer | `meta-models/Muse-Glimmer-30B-GGUF` 的 `KQuant-17GB-Q4_K_M` | 16.76 GB | mmproj 1.40 GB |
| Nemotron 3.5 Bolt | `nvidia/…-Bolt-74B-A9B-24GB-GGUF` | 22.02 GB | mmproj 1.73 GB |
| Inkling 2 Mini | `ggml-org/Inkling-2-Mini-GGUF` 的 `IQ4_NL` | 17.63 GB | mmproj 0.64 GB |

檔案大小都是用 Hugging Face API 加總 LFS 檔得到的。前三個 17 GB 左右的檔，在 36 GB Mac 上預設上限內還有幾 GB 給 KV cache；Bolt 的 22 GB 加上 mmproj 已經貼著上限，這時才需要調系統參數。[mlx-lm README](https://github.com/ml-explore/mlx-lm#large-models) 給的做法是：

```bash
sysctl iogpu.wired_limit_mb            # 先看目前值，0 代表系統預設
sudo sysctl iogpu.wired_limit_mb=28672 # 36 GB 機器舉例：讓 GPU 用到 28 GB
```

README 的規則是 N 要大於模型的 MB 數、小於整台機器的記憶體。設太高，macOS 和瀏覽器、編輯器會沒記憶體可用，所以要留 6–8 GB 給系統。32 GB 的機器同理，往下調整數字。

另一個不用改系統的省法：只用文字的話不要載入 mmproj，並且把 context 先設在 32K 之類的值，夠用再往上加。

## Qwen3.8-27B：六個工具都能跑

這是四個裡面支援最完整的一個。Qwen3.8 沿用 Qwen3.5 的架構（config 的 `model_type` 是 `qwen3_5`），所以所有既有工具早就認得它。

**Splash（M3 以上的首選）**。它只支援少數模型，Qwen3.8-27B 正好在清單上，而且有專屬的 DFlash 2 草稿模型：

```bash
brew install incoai/tap/splash
splash serve --model unsloth/Qwen3.8-27B-GGUF:UD-Q4_K_M
# 另一個終端機：
splash claude      # 或 splash opencode / splash codex
```

要注意 [Splash 發表文](https://inco.ai/blog/splash/)寫的最低需求是 36 GB、建議 48 GB，32 GB 的機器低於最低需求。Splash 的 [performance.md](https://github.com/incoai/splash/blob/main/docs/performance.md#smaller-ggufs-on-24-gb-macs) 對小記憶體機器的建議是改用較小的 GGUF（例如 27B 的 `UD-IQ3_XXS`，10.93 GB）並加 `--language-only`。其他細節見[系列第三篇](/posts/ai/2026-11-22-splash-apple-silicon-inference-engine)。

如果你習慣在 LM Studio 裡用 Splash，要知道兩邊版本不同步。LM Studio Bionic 1.2.2 內建的 Splash runtime 是 1.3.0（跟 Splash 的 1.3.0 tag 完全相同，2026-11-22 確認），仍然載入 `incoai/*-Splash` 這種打包模型。命令列版的 Splash 從 1.3.1 起不再吃這種打包。所以 LM Studio 和 Homebrew 版各自照自己的說明下載模型，不能共用。

**llama.cpp**：

```bash
curl -LsSf https://llama.app/install.sh | sh     # 2026-11-22 會裝到 b12607
llama serve -hf unsloth/Qwen3.8-27B-GGUF:UD-Q4_K_M --jinja -c 32768
```

`llama serve` 是 v1.0 起的統一指令，等同以前的 `llama-server`。`-hf` 會自動一起下載 mmproj；不讀圖就加 `--no-mmproj`（[mtmd 文件](https://github.com/ggml-org/llama.cpp/blob/master/docs/multimodal.md)）。注意 server 預設 port 已經改成 **9931**（[`common/common.h`](https://github.com/ggml-org/llama.cpp/blob/master/common/common.h)），舊教學寫的 8080 要自己帶 `--port`。

**Ollama**：`ollama run qwen3.8`。`latest` 指向 `27b`，18 GB，另有 `27b-mlx` 走 Ollama 的 MLX 引擎（[tag 列表](https://ollama.com/library/qwen3.8/tags)）。

**mlx-lm**（只有文字）：

```bash
pip install mlx-lm
mlx_lm.server --model mlx-community/Qwen3.8-27B-4bit   # 16.07 GB，聽 127.0.0.1:8080
```

**oMLX**：把同一個 `mlx-community/Qwen3.8-27B-4bit` 下載到 `~/models` 底下，`omlx serve --model-dir ~/models` 就會掃到，讀圖也支援。

**LM Studio**：`lms get qwen3.8`，或在 App 裡搜尋。目錄頁列的是 GGUF 與 MLX 兩種格式。

## Muse Glimmer：除了 Splash 都行

Muse Glimmer 是 29.6B 的稠密模型，含 1.8B 視覺編碼器。Meta 自己發了 GGUF，模型卡把版本需求寫得很清楚：llama.cpp 要 **b10353** 以上。

**llama.cpp**（照 [Meta 的 GGUF 模型卡](https://huggingface.co/meta-models/Muse-Glimmer-30B-GGUF)）：

```bash
hf download meta-models/Muse-Glimmer-30B-GGUF \
  --include "Muse-Glimmer-30B-KQuant-17GB-Q4_K_M.gguf" \
  --include "mmproj-Muse-Glimmer-30B-Q4_K_M.gguf" \
  --local-dir Muse-Glimmer-30B-GGUF

llama-server \
  -m Muse-Glimmer-30B-GGUF/Muse-Glimmer-30B-KQuant-17GB-Q4_K_M.gguf \
  --mmproj Muse-Glimmer-30B-GGUF/mmproj-Muse-Glimmer-30B-Q4_K_M.gguf \
  -a muse-glimmer-30B -ngl 99 -c 32768 --jinja \
  --temp 1.0 --top-p 0.95 --top-k 64 --port 8080
```

Meta 原本範例是 `-c 131072 -np 4`，這裡把 context 縮到 32K、只開一個 slot，比較適合 36 GB。模型卡估的總記憶體是文字約 17 GB、加視覺約 19 GB、再加 DFlash 草稿模型約 20 GB。想試推測解碼就多下載 `dflash-Muse-Glimmer-30B-Q4_K_M.gguf`（1.63 GB），啟動時加 `-md <檔案> -ngld 99`。

**Ollama**：`ollama run muse-glimmer`（18 GB）。模型頁說 MLX 引擎支援 DFlash 和讀圖，對應的 tag 是 `muse-glimmer:30b-mlx`（19 GB）。

**mlx-lm**（只有文字）：`mlx_lm.server --model mlx-community/Muse-Glimmer-30B-4bit`（19.44 GB）。

**oMLX**：可以用同一個 mlx-community 檔，或 oMLX 作者自己量化的 [`Jundot/Muse-Glimmer-30B-oQ4e`](https://huggingface.co/Jundot/Muse-Glimmer-30B-oQ4e)（20.59 GB）。oMLX 有一個還開著的 [issue #4599](https://github.com/jundot/omlx/issues/4599)：0.7.1rc1 上 Muse Glimmer 搭 DFlash 第一個請求會失敗，用 DFlash 前先確認你的版本。

**LM Studio**：目錄裡的 `meta/muse-glimmer` 標 25.77 GB、最少要 26 GB 記憶體，在 36 GB 機器上很緊。可以用 `lms get muse-glimmer -a` 叫出所有量化選項，挑 [lmstudio-community 的 Q4_K_M](https://huggingface.co/lmstudio-community/Muse-Glimmer-30B-GGUF)（16.76 GB）。

## Nemotron 3.5 Bolt：只有 llama.cpp 這條路，而且有代價

Bolt 是 NVIDIA 專門為 24 GB 機器做的版本。74B 總參數、每個 token 啟用 9B，專家權重用量化感知蒸餾訓練成 IQ2_XXS，模型卡稱為「native 2-bit」。它的大哥 Super VL 120B-A12B 放不進 32 GB：最小的量化是 rapid-mlx 的 MLX 3-bit（42.76 GB）和 unsloth 的 `UD-IQ1_M`（46.1 GB）。NVIDIA 官方的 NVFP4 版是 75 GB，而 NVFP4 是 Blackwell 原生的格式，Apple GPU 沒有 FP4 硬體。Bolt 就是 NVIDIA 給小記憶體機器的答案。

問題出在 Mac。[NVIDIA 的 GGUF 模型卡](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Bolt-74B-A9B-24GB-GGUF)只寫 RTX、DGX Spark 和 RTX 獨顯的配方，沒有提到 Apple Silicon。Ollama 直接標明 Mac 不支援。llama.cpp 能載入（GGUF 標頭的架構是 `nemotron_h_moe`），問題在格式。這個檔裡 Mamba 層的輸入輸出投影是 NVFP4，而 llama.cpp 的 Metal 後端在矩陣乘法上排除了 NVFP4（[`ggml-metal-device.m`](https://github.com/ggml-org/llama.cpp/blob/master/ggml/src/ggml-metal/ggml-metal-device.m) 的 `ggml_metal_supports_mul_mat_op` 對 `GGML_TYPE_NVFP4` 回傳 false），這些張量就留在 CPU 上算。

llama.cpp 的指令（從 NVIDIA 的配方改：拿掉 RTX 用的 DFlash 草稿模型、context 縮小、先不載視覺）：

```bash
hf download nvidia/NVIDIA-Nemotron-3.5-Bolt-74B-A9B-24GB-GGUF \
  NVIDIA-Nemotron-3.5-Bolt-74B-A9B-24GB.gguf --local-dir models/bolt

sudo sysctl iogpu.wired_limit_mb=28672   # 36 GB 機器，見上面記憶體一節

llama-server --model models/bolt/NVIDIA-Nemotron-3.5-Bolt-74B-A9B-24GB.gguf \
  --ctx-size 32768 --parallel 1 -ngl 999 \
  --cache-type-k q8_0 --cache-type-v q8_0 \
  --flash-attn on --jinja --temp 1.0 --top-p 0.95 --port 8080
```

要讀圖再加 `mmproj-NVIDIA-Nemotron-3.5-Bolt-74B-A9B-24GB.gguf`（1.73 GB）和 `--mmproj`，總量會到 23.75 GB。

社群有一個專門處理 CPU 回退的版本：[UraionLabs/Nemotron-3.5-Bolt-74B-A9B-24GB-Metal-GGUF](https://huggingface.co/UraionLabs/Nemotron-3.5-Bolt-74B-A9B-24GB-Metal-GGUF) 只把那 80 個 NVFP4 張量轉成 Metal 能算的 Q8_0。其他權重原樣複製，檔案變成 24.21 GB。它在 64 GB 的 M5 Pro 上自測解碼從 12.8 提升到 24.6 tok/s。這是第三方的數字、測試機記憶體比你多一倍，而 24.21 GB 在 36 GB 機器上一定要調 wired 上限、而且只能用文字。

MLX 這一側：mlx-lm 還沒有 `nemotron_h_puzzle`；oMLX 能透過上面提到的 txgsync 社群檔跑，但作者只測過 128 GB 的機器。

**結論**：36 GB 的 Mac 想試 Bolt，用 llama.cpp、只開文字、context 從 32K 開始，接受它比同大小的其他模型慢。32 GB 的機器就算調了上限也只剩幾 GB 給系統，不建議。

## Inkling 2 Mini：兩天內補上了四個工具

Inkling 2 Mini 的架構是全新的：24 層裡中間 12 層跑三次，每次重跑有自己的 cache。這種架構要每個執行環境各自實作，所以發表當天支援狀況很亂。截至 2026-11-22：

- **Ollama**：[v0.40.17 release notes](https://github.com/ollama/ollama/releases/tag/v0.40.17) 寫明這一版只在 Apple Silicon 上支援它。三個 tag 指向同一個 20 GB 的 MLX NVFP4 檔，也就是官方原始精度。
- **llama.cpp**：要 b12600 以上。Homebrew 上的 `llama.cpp` 是 v1.0.0（11 月 13 日），比 Inkling 的合併早，**用 brew 裝的跑不了**。改用 llama.app 安裝腳本（今天給的是 b12607）或從 [releases](https://github.com/ggml-org/llama.cpp/releases) 下載 `macos-arm64` 的壓縮檔。
- **oMLX**：0.8.1 起支援，含讀圖和 DSpark 推測解碼。
- **LM Studio**：目錄頁 `thinkingmachines/inkling-2-mini` 是 17.50 GB 的 GGUF，最少 18 GB 記憶體。需要哪一版 llama.cpp runtime 頁面沒寫，載入失敗就先到「Settings > Runtime」更新。
- **mlx-lm**：還不行，[PR #2086](https://github.com/ml-explore/mlx-lm/pull/2086) 開著。[mlx-vlm](https://github.com/Blaizzy/mlx-vlm) 的 main 分支已經合併了 Inkling 2 Mini，但最新的 PyPI 版 0.8.0（11 月 16 日）還沒包含，要從 git 安裝。

**最省事的是 Ollama**：

```bash
ollama run inkling-2-mini            # 20 GB，含讀圖
ollama launch claude --model inkling-2-mini
```

**llama.cpp**：

```bash
llama serve -hf ggml-org/Inkling-2-Mini-GGUF:IQ4_NL --jinja -c 32768
```

一個容易踩到的坑：[unsloth/Inkling-2-Mini-GGUF](https://huggingface.co/unsloth/Inkling-2-Mini-GGUF) 根目錄的 GGUF 架構標的是 `inkling2`，是給 Unsloth Desktop 用的；給上游 llama.cpp 的檔放在 `Mainline_Support/` 資料夾，副檔名還是 `.gguf_file`，`-hf` 不會挑到。所以這裡用 ggml-org 的檔。

**oMLX**：

```bash
hf download mlx-community/Inkling-2-Mini-oQ4e-mtp --local-dir ~/models/Inkling-2-Mini-oQ4e-mtp
omlx serve --model-dir ~/models
```

這個 16.87 GB 的檔是 oMLX 自己的 oQ 混合精度量化，附帶 DSpark 草稿模型，模型卡寫明需要 oMLX 0.8.1 以上。

官方模型卡另外提醒兩件事：在本機執行環境上跑 looped 模型「是新的，速度依環境和硬體差很多」；debug 程式時偶爾會陷入重複推理，建議限制輸出 token 和 agent 輪數。1M context 是模型上限，32 GB 機器實際能開多少，要看你給 KV cache 留了多少記憶體。

## 接 API 與 Claude Code

六個工具都開 OpenAI 相容 API，差在預設 port 和有沒有 Anthropic 端點：

| 工具 | 預設位址 | Anthropic `/v1/messages` | 接 Claude Code |
|---|---|---|---|
| mlx-lm | `127.0.0.1:8080` | 沒有 | 要自己找轉接層 |
| oMLX | `localhost:8000` | 有 | `omlx launch claude --model <ID>` |
| Splash | `127.0.0.1:8000` | 有 | `splash claude` |
| llama.cpp | `127.0.0.1:9931` | 有（工具呼叫要 `--jinja`） | 設 `ANTHROPIC_BASE_URL` |
| Ollama | `localhost:11434` | — | `ollama launch claude --model <名稱>` |
| LM Studio | `localhost:1234`（`lms server start --port 1234`） | 有 | 設 `ANTHROPIC_BASE_URL` |

oMLX 和 Splash 同樣預設 8000，同時開要給其中一個換 port。llama.cpp 的 Anthropic 端點見 [server README](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md)；LM Studio 的寫法照 [Anthropic 相容文件](https://lmstudio.ai/docs/developer/anthropic-compat)：

```bash
export ANTHROPIC_BASE_URL=http://localhost:1234
export ANTHROPIC_AUTH_TOKEN=lmstudio
claude --model <LM Studio 裡的模型 ID>
```

最簡單的 OpenAI 格式測試，以 llama.cpp 為例：

```bash
curl http://127.0.0.1:9931/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"用一句話解釋 KV cache。"}]}'
```

Claude Code 光系統提示就約 33K token（Splash 的 performance.md 估計），所以接 coding agent 時 context 至少開到 64K。這會吃掉記憶體，Bolt 在 36 GB 機器上幾乎沒有餘裕做這件事。

## 怎麼挑

- **只想要一個最穩的**：Qwen3.8-27B。六個工具都支援，36 GB 的 M3 以上機器先試 Splash，其他機器用 Ollama 或 llama.cpp。
- **重視工具呼叫的 agent 工作**：Muse Glimmer 用 Ollama 或 llama.cpp。Meta 有官方 GGUF 和 DFlash 草稿模型，版本需求寫得最清楚。
- **想試最新的 Inkling 2 Mini**：今晚就能做的是 `ollama run inkling-2-mini`。llama.cpp 記得先確認 `llama --version` 是 b12600 以上，不要用 brew 的版本。
- **Bolt**：36 GB 以下先不要當主力。真的要試，照上面 llama.cpp 的指令、只開文字，並先調好 wired 上限。

## 參考資料

- [Qwen/Qwen3.8-27B（Hugging Face）](https://huggingface.co/Qwen/Qwen3.8-27B)
- [unsloth/Qwen3.8-27B-GGUF](https://huggingface.co/unsloth/Qwen3.8-27B-GGUF)
- [mlx-community/Qwen3.8-27B-4bit](https://huggingface.co/mlx-community/Qwen3.8-27B-4bit)
- [meta-models/Muse-Glimmer-30B-GGUF 模型卡](https://huggingface.co/meta-models/Muse-Glimmer-30B-GGUF)
- [mlx-community/Muse-Glimmer-30B-4bit](https://huggingface.co/mlx-community/Muse-Glimmer-30B-4bit)
- [nvidia/NVIDIA-Nemotron-3.5-Bolt-74B-A9B-24GB-GGUF 模型卡](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Bolt-74B-A9B-24GB-GGUF)
- [UraionLabs/Nemotron-3.5-Bolt-74B-A9B-24GB-Metal-GGUF](https://huggingface.co/UraionLabs/Nemotron-3.5-Bolt-74B-A9B-24GB-Metal-GGUF)
- [txgsync/NVIDIA-Nemotron-3.5-Bolt-74B-A9B-24GB-MLX](https://huggingface.co/txgsync/NVIDIA-Nemotron-3.5-Bolt-74B-A9B-24GB-MLX)
- [rapid-mlx/NVIDIA-Nemotron-3.5-Super-VL-120B-A12B-MLX-3bit](https://huggingface.co/rapid-mlx/NVIDIA-Nemotron-3.5-Super-VL-120B-A12B-MLX-3bit)
- [unsloth/NVIDIA-Nemotron-3.5-Super-VL-120B-A12B-GGUF](https://huggingface.co/unsloth/NVIDIA-Nemotron-3.5-Super-VL-120B-A12B-GGUF)
- [nvidia/NVIDIA-Nemotron-3.5-Super-VL-120B-A12B-NVFP4](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Super-VL-120B-A12B-NVFP4)
- [thinkingmachines/Inkling-2-Mini 模型卡](https://huggingface.co/thinkingmachines/Inkling-2-Mini)
- [ggml-org/Inkling-2-Mini-GGUF](https://huggingface.co/ggml-org/Inkling-2-Mini-GGUF)
- [unsloth/Inkling-2-Mini-GGUF](https://huggingface.co/unsloth/Inkling-2-Mini-GGUF)
- [mlx-community/Inkling-2-Mini-oQ4e-mtp](https://huggingface.co/mlx-community/Inkling-2-Mini-oQ4e-mtp)
- [mlx-lm README（Large Models 一節）](https://github.com/ml-explore/mlx-lm#large-models)
- [mlx-lm PR #1982：Nemotron 3.5 Bolt](https://github.com/ml-explore/mlx-lm/pull/1982)
- [mlx-lm PR #2086：Inkling 2 Mini](https://github.com/ml-explore/mlx-lm/pull/2086)
- [oMLX v0.8.1 release notes](https://github.com/jundot/omlx/releases/tag/v0.8.1)
- [oMLX issue #4599：Muse Glimmer + DFlash](https://github.com/jundot/omlx/issues/4599)
- [Splash README](https://github.com/incoai/splash) 與 [docs/models.md](https://github.com/incoai/splash/blob/main/docs/models.md)
- [Splash: A local engine built around the model（Inco AI）](https://inco.ai/blog/splash/)
- [llama.cpp PR #32694：Inkling 2 Mini](https://github.com/ggml-org/llama.cpp/pull/32694)
- [llama.cpp release b12600](https://github.com/ggml-org/llama.cpp/releases/tag/b12600)
- [llama.cpp server README](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md)
- [llama.cpp issue #1870：Apple Silicon 的 GPU 記憶體上限](https://github.com/ggml-org/llama.cpp/issues/1870)
- [Homebrew llama.cpp formula](https://github.com/Homebrew/homebrew-core/blob/main/Formula/l/llama.cpp.rb)
- [Ollama：qwen3.8](https://ollama.com/library/qwen3.8)、[muse-glimmer](https://ollama.com/library/muse-glimmer)、[nemotron-3.5-bolt](https://ollama.com/library/nemotron-3.5-bolt)、[inkling-2-mini](https://ollama.com/library/inkling-2-mini)
- [Ollama v0.40.17 release notes](https://github.com/ollama/ollama/releases/tag/v0.40.17)
- [LM Studio：Inkling 2 Mini 模型頁](https://lmstudio.ai/models/inkling-2-mini)
- [LM Studio：lms get](https://lmstudio.ai/docs/cli/local-models/get)
- [LM Studio：Anthropic 相容 API](https://lmstudio.ai/docs/developer/anthropic-compat)
- [LM Studio Bionic changelog](https://lmstudio.ai/changelog)
- [MLX：Apple Silicon 的陣列框架](/posts/ai/2026-11-22-mlx-apple-silicon-array-framework)
- [oMLX：MLX 上的推論伺服器](/posts/ai/2026-11-22-omlx-apple-silicon-inference-server)
- [Splash：為模型量身打造的推論引擎](/posts/ai/2026-11-22-splash-apple-silicon-inference-engine)
- [Ollama 本機 LLM 指南](/posts/ai/2026-03-14-ollama-local-llm-guide)
- [llama.cpp 本機 LLM 推論](/posts/ai/2026-04-01-llama-cpp-local-llm-inference)
