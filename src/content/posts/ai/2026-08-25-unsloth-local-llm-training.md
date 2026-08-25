---
title: "Unsloth 完整指南：在本地微調和運行 LLM 的加速工具"
date: 2026-08-25
type: guide
category: ai
tags: [unsloth, llm, fine-tuning, local-inference, lora, qlora, gguf, self-hosted]
lang: zh-TW
tldr: "Unsloth 是目前最省 VRAM、最快的本地 LLM 微調工具，訓練速度快 2 倍、VRAM 省 70%。2026 年加入 Desktop 桌面應用後，整合了推論、微調、圖片影片生成、web search 和 agent 連接，從微調庫變成完整的本地 AI 工作站。"
description: "Unsloth 完整介紹：核心微調能力（SFT、RL、GRPO）、Desktop 與 Studio 的差異、硬體需求與平台支援（NVIDIA、AMD、Mac）、unsloth start agent 整合、模型匯出格式，以及與 Ollama、LM Studio、llama.cpp 的定位比較。"
draft: false
---

想在自己的硬體上微調 LLM，最常遇到的問題是：VRAM 不夠、訓練速度太慢、設定環境太複雜。Unsloth 用手寫的 Triton kernel 把這些問題壓下來——同樣的硬體能訓練更大的模型，而且速度快一倍以上。

2026 年它不只是一個微調庫了。加入 Desktop 桌面應用和 Studio Web UI 後，Unsloth 變成一個整合推論、訓練、圖片影片生成、web search 和 agent 連接的本地 AI 工作站。這篇從核心微調能力、平台支援、實際使用方式到與其他工具的比較，完整介紹 Unsloth。

---

## Unsloth 是什麼

Unsloth 是一個開源工具（Apache 2.0 + AGPL-3.0 雙授權），用來在本地機器上**微調和運行**大型語言模型。核心賣點是效能：訓練速度比原生 HuggingFace 快 2 倍，VRAM 消耗少 70%。

由 Daniel 和 Michael Han 兄弟在 2023 年 12 月創立。關鍵技術決策是手寫 Triton kernel 取代 PyTorch 的自動微分，讓反向傳播的記憶體開銷大幅降低。GitHub 星數超過 30K。

```bash
# 用 Unsloth Desktop 跑模型，一行指令連接 Claude Code
unsloth start claude
```

和 Ollama、LM Studio 最大的差異：**Unsloth 能微調模型，其他兩個只能跑推論。**

---

## 三種使用方式

Unsloth 提供三種入口，針對不同使用者：

### Desktop（桌面應用）

原生桌面應用，支援 Mac、Windows、Linux。最簡單的上手方式——下載安裝就能用，不需要設定 Python 環境。整合了推論、訓練、圖片影片生成、web search、agent 連接。

### Studio（Web UI）

開源的 no-code 網頁介面，用來訓練、運行和匯出模型。Desktop 本質上是 Studio 的原生包裝。可以透過 CLI 手動啟動：

```bash
# macOS / Linux / WSL
unsloth studio -H 0.0.0.0 -p 8888

# 透過 Cloudflare tunnel 開放 HTTPS 遠端存取
unsloth studio --secure
```

### Core（程式碼層）

Python 套件，`pip install unsloth` 安裝。適合需要完整控制訓練流程的開發者，可以在 Jupyter notebook 或腳本裡使用。這是最早的使用方式，文件和範例最齊全。

```python
from unsloth import FastLanguageModel

model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/Llama-3.2-3B-Instruct",
    max_seq_length=2048,
    load_in_4bit=True,
)

model = FastLanguageModel.get_peft_model(
    model,
    r=16,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj",
                     "gate_proj", "up_proj", "down_proj"],
    lora_alpha=16,
    lora_dropout=0,
    use_gradient_checkpointing="unsloth",
)
```

---

## 核心微調能力

這是 Unsloth 和其他本地 LLM 工具最大的區別。它不只是跑推論，而是讓你在消費級硬體上訓練自己的模型。

### 支援的訓練方式

| 方法 | 說明 | VRAM 需求 |
|------|------|-----------|
| QLoRA（4-bit） | 模型量化到 4-bit，只訓練 LoRA adapter | 最低（3B 模型約 3.5 GB） |
| LoRA（16-bit） | 凍結基礎模型，訓練低秩 adapter | 中等（3B 模型約 8 GB） |
| Full fine-tuning | 訓練整個模型 | 最高 |
| FP8 | 8-bit 浮點訓練，速度和精度的折衷 | 中等 |
| Pre-training | 從頭訓練或繼續預訓練 | 最高 |

### 強化學習（RL）

支援 GRPO（Group Relative Policy Optimization），官方宣稱比標準實作省 80% VRAM。這讓你能在消費級 GPU 上用 RL 訓練模型——以前這基本上只有大公司才做得到。

### 資料處理

Studio 和 Desktop 內建 no-code 資料處理：

- 支援 PDF、CSV、JSON、DOCX、TXT 匯入
- 自動轉換成訓練資料集格式
- 內建沙箱執行 Bash 和 Python，讓模型測試和驗證輸出

### 模型匯出格式

訓練完的模型可以匯出成多種格式：

| 格式 | 用途 |
|------|------|
| GGUF | 用 Ollama、llama.cpp、LM Studio 跑推論 |
| 16-bit safetensors | 用 HuggingFace Transformers 載入 |
| LoRA adapter | 套用到基礎模型上 |
| NVFP4 | NVIDIA GPU 最佳化推論 |

這是 Unsloth 在整個本地 AI 工具鏈裡的位置：**你用 Unsloth 微調 → 匯出 GGUF → 用 Ollama 或 LM Studio 跑推論。**

---

## 支援的模型

Unsloth 宣稱支援 500+ 模型。主要的有：

**通用對話**：Llama 3.1 / 3.2 / 3.3 / 4、Qwen 3 / 3.5 / 3.8、Gemma 2 / 3 / 4、DeepSeek R1 / V3 / V4、Mistral / Mixtral、Phi-4、GLM-5.2、Kimi K3

**視覺多模態**：Llama 3.2 Vision、Gemma 3 Vision、Qwen 2.5-VL

**Embedding**：支援 embedding 模型微調

**TTS / 語音**：支援語音合成模型微調

**圖片 / 影片生成**（Desktop / Studio）：MiniMax-H3、FLUX、Wan、LTX、DiffusionGemma

Unsloth 通常在新模型發布時提供 day-zero 支援，並且在 HuggingFace 上發布預量化的 Dynamic GGUF 版本，自動根據你的 VRAM 選擇最佳量化等級。

---

## 平台支援與硬體需求

### 作業系統

| 平台 | 推論 | 微調 |
|------|------|------|
| Linux / WSL（Ubuntu 20.04+） | 完整支援 | 完整支援 |
| Windows 10/11（64-bit） | 完整支援 | 完整支援 |
| macOS 12+（Intel 或 Apple Silicon） | 完整支援 | 完整支援（MLX） |

**Mac 使用者注意**：Mac 上的微調透過 Apple 的 MLX 框架執行，不是 CUDA。推論支援 MLX 和 GGUF 兩種格式。Desktop 應用原生支援 Mac。

### GPU 支援

| GPU | 推論 | 微調 |
|-----|------|------|
| NVIDIA（CUDA 7.0+） | 完整支援 | 完整支援，效能最佳 |
| AMD（ROCm） | 支援 | 支援（需額外設定） |
| Intel | 支援 | 支援（需額外設定） |
| Apple Silicon（MLX） | 完整支援 | 完整支援 |
| 純 CPU | GGUF 推論 | 不支援 |

### VRAM 需求（QLoRA 4-bit，最低門檻）

| 模型大小 | QLoRA 最低 VRAM | LoRA 最低 VRAM |
|----------|----------------|----------------|
| 3B | 3.5 GB | 8 GB |
| 7B | 5 GB | 19 GB |
| 14B | ~10 GB | ~35 GB |
| 70B | 41 GB | 164 GB |

QLoRA 4-bit 是 Unsloth 的甜蜜點：一張 RTX 4060（8 GB）就能微調 7B 模型，RTX 4090（24 GB）可以處理 14B。Mac 使用者的統一記憶體（16 GB / 32 GB / 64 GB）可以當作 GPU 記憶體使用。

---

## Agent 整合：unsloth start

Unsloth 2026 年的重要新功能是 `unsloth start`，讓你一行指令把本地模型連接到 coding agent：

```bash
# 連接 Claude Code
unsloth start claude

# 連接 Codex，指定模型和 context length
unsloth start codex --model unsloth/gemma-4-E2B-it-GGUF:UD-Q4_K_XL --context-length 32768

# 連接其他 agent
unsloth start hermes
unsloth start opencode
unsloth start openclaw
```

技術上，`unsloth start` 自動設定 endpoint、API key、provider、模型和 context length，不需要手動改 agent 的設定檔。不認識的參數會直接傳給 agent。

幾個注意事項：

- Codex 目前只支援透過 `llama-server` 後端 serve 的 GGUF 模型
- Codex、OpenClaw、Hermes 需要加 `--persist` flag 才能在重新啟動後保留狀態
- 可以透過 `UNSLOTH_STUDIO_URL` 和 `UNSLOTH_API_KEY` 環境變數連接遠端 Unsloth 伺服器

還有一個宣稱：tool calling 準確度提升 50%，內建 self-healing 機制會自動偵測失敗的 tool call 並重試。

---

## 其他內建功能

### Web Search 與 Deep Research

Desktop 和 Studio 內建免費無限次的 web search，直接存取頁面而非依賴搜尋引擎 snippet。Deep Research 模式會先建立研究計畫、搜集可信來源、最後產出附引用的報告。

### 圖片與影片生成

支援 MiniMax-H3、FLUX、Wan、LTX、DiffusionGemma 等 diffusion 模型，可以在本地生成圖片和影片。

### 遠端存取

內建 Cloudflare tunnel 支援，一行指令把本地模型透過 HTTPS 對外提供服務：

```bash
unsloth studio --secure
```

### OpenAI 相容 API

Unsloth 暴露 OpenAI 相容的 API endpoint，任何使用 OpenAI SDK 的程式碼都能直接連接。

---

## 與其他本地 AI 工具比較

| | Unsloth | Ollama | LM Studio | llama.cpp |
|---|---|---|---|---|
| **核心定位** | 微調 + 推論 + 生成 | 本地推論（一行跑模型） | 本地推論（GUI） | 推論引擎（C++ 底層） |
| **能微調** | 主打功能 | 不行 | 不行 | 不行 |
| **介面** | Desktop GUI + Web UI + CLI | CLI + REST API | 桌面 GUI | 純 CLI |
| **開源** | Apache 2.0 + AGPL-3.0 | MIT | 否（免費使用） | MIT |
| **Mac 支援** | 推論 + 微調（MLX） | 推論（Metal） | 推論（Metal） | 推論（Metal） |
| **GPU 管理** | 自動 | 自動 | GUI 控制 | 完全手動 |
| **圖片影片生成** | 有 | 無 | 無 | 無 |
| **Agent 整合** | `unsloth start` 一鍵連接 | TUI launcher | 無 | 無 |
| **模型格式** | HF + GGUF + MLX | GGUF（Modelfile） | GGUF | GGUF |

### 怎麼選

- **想微調自己的模型** → Unsloth（唯一有完整微調能力的選項）
- **只想最簡單跑推論 + 當 API server** → Ollama
- **想要 GUI 聊天介面、不碰終端機** → LM Studio
- **想要最底層控制、嵌入自己的程式** → llama.cpp

它們不是互斥的。最常見的搭配是：**Unsloth 微調 → 匯出 GGUF → Ollama 跑推論**。Unsloth Desktop 和 Ollama 底層都用 llama.cpp 做 GGUF 推論。

---

## 定價

| 方案 | 價格 | 特色 |
|------|------|------|
| 開源 / Desktop / Studio | 免費 | 2x 加速、70% VRAM 節省、單 GPU |
| Pro | 洽詢 | 多 GPU（最多 8 張）、額外加速、更少記憶體使用 |
| Enterprise | 洽詢 | 多節點、30% 準確度提升、5x 推論加速、客戶支援 |

對大多數個人使用者來說，免費版已經夠用。Pro 和 Enterprise 主要面向需要多 GPU 訓練的團隊。

---

## 限制與注意事項

### 訓練需要 GPU

純 CPU 只能跑推論，不能微調。訓練至少需要 NVIDIA（CUDA）、AMD（ROCm）、Intel GPU 或 Apple Silicon。

### 多 GPU 支援還在改進

官方文件標示多 GPU 「a much better version is coming」。目前可用但不是最佳化狀態。

### 不是生產推論方案

Unsloth 的推論功能是開發和測試用的，不適合高並發生產環境。生產推論應該用 vLLM 或 TGI。

### Mac 上的微調走 MLX

Mac 的微調透過 Apple MLX 框架而非 CUDA，部分進階功能和最新最佳化可能不完全對等。但基本的 LoRA / QLoRA 微調是完整支援的。

### 生態系不如 Ollama 成熟

Ollama 有大量第三方整合（OpenWebUI、LangChain、n8n 等）。Unsloth 的推論生態系比較新，agent 整合是主要賣點。

---

## 整體來說

Unsloth 的核心價值很明確：**讓消費級硬體能做 LLM 微調這件原本很貴的事**。QLoRA 4-bit 加上手寫 Triton kernel 的最佳化，一張 8 GB 顯卡就能微調 7B 模型。

2026 年的定位轉變也很有意思——從一個 Python 微調庫擴展成包含 Desktop GUI、Web UI、agent 整合、圖片影片生成的完整工作站。這跟 Ollama 從「LLM runner」變成「AI 開發者入口」的演進路線有點像。

適合的場景：在自己的資料上微調 LLM、用 RL 改善模型行為、在本地跑微調後的模型做開發測試、把本地模型連接到 Claude Code 或 Codex。

不適合的場景：只想聊天不想碰訓練（用 Ollama 或 LM Studio）、高並發生產推論（用 vLLM）、完全沒有 GPU 的機器（只能跑推論不能訓練）。

如果你已經用 Ollama 跑本地模型，覺得開源模型的表現差了那麼一截，Unsloth 讓你可以用自己的資料微調來補那個差距——而且不需要租 A100。

## 參考資料

- [Unsloth 官方網站](https://unsloth.ai/) — 下載 Desktop、文件與模型目錄
- [Unsloth GitHub 儲存庫](https://github.com/unslothai/unsloth) — 原始碼與 issue tracker
- [Unsloth 官方文件](https://unsloth.ai/docs) — 安裝、微調、推論與 agent 整合完整文件
- [Unsloth Start 文件](https://unsloth.ai/docs/integrations/unsloth-start) — agent 整合指令參考
- [Unsloth Studio 文件](https://unsloth.ai/docs/new/studio) — Web UI 功能與啟動方式
- [Ollama 完整指南](/posts/ai/2026-03-14-ollama-local-llm-guide/) — 站內 Ollama 推論工具介紹
- [llama.cpp 完整指南](/posts/ai/2026-04-01-llama-cpp-local-llm-inference/) — 站內 llama.cpp 推論引擎介紹
