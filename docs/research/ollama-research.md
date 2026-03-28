# Ollama 研究筆記

## 1. Ollama 是什麼？

Ollama 是一個**開源平台**，用於在本地機器上運行大型語言模型（LLM）。它把 llama.cpp 推理引擎包裝成簡單的 CLI 和 REST API，自動處理模型量化、GPU 記憶體分配和模型檔案管理。可以把它想成「LLM 的 Docker」——把模型權重、設定和運行環境打包成一個叫 Modelfile 的單元。

- **授權**：MIT（完全免費開源）
- **GitHub**：https://github.com/ollama/ollama
- **截至 2026 Q1**：每月下載量達 5200 萬次

---

## 2. 核心特色

| 特色 | 說明 |
|------|------|
| 一行指令管理模型 | `ollama run llama3.2` 自動下載並啟動 |
| 隱私與離線使用 | 所有資料留在本地，不需要網路 |
| OpenAI 相容 API | `http://localhost:11434/v1/` 可直接替換 OpenAI endpoint |
| Modelfile 系統 | 類似 Dockerfile 的設定檔，自訂系統提示、參數、模板 |
| 自動 GPU 偵測 | 自動使用 NVIDIA CUDA、AMD ROCm 或 Apple Metal |
| 自動 VRAM 管理 | 多模型同時載入記憶體，按需卸載 |
| 內容定址儲存 | 模型層像容器映像一樣快取，共享層不需重複下載 |
| 多 GPU 支援 | 跨多 GPU 張量平行 |
| 工具呼叫 | 模型可以呼叫外部工具（function calling） |
| 多模態支援 | 支援視覺 + 文字模型 |
| 結構化輸出 | 基於 JSON Schema 的結構化回應 |
| 思考/推理模式 | 支援 DeepSeek R1 等推理模型 |
| Web 搜尋整合 | 2026 年新增，模型可以搜尋網路 |
| 官方 SDK | Python 和 JavaScript |

---

## 3. 支援的模型

完整清單：https://ollama.com/library

### 通用模型
| 模型 | 來源 | 大小 |
|------|------|------|
| Llama 3.1 | Meta | 8B, 70B, 405B |
| Llama 3.2 | Meta | 1B, 3B |
| Llama 4 | Meta | 最新世代 |
| Mistral 7B / Mistral Small 3 | Mistral AI | 7B+ |
| Qwen 2.5 / Qwen 3 | Alibaba | 多種大小 |
| Gemma 2 / Gemma 3 | Google | 2B, 9B, 27B |
| Phi-3 / Phi-4 | Microsoft | 3B, 14B |

### 推理模型
- DeepSeek R1（多種大小，含 32B）
- Nemotron-3-Super（122B，NVIDIA）

### 程式碼模型
- Qwen 2.5-Coder
- CodeLlama
- Qwen3-Coder

### 多模態/視覺
- Llama 3.2 Vision
- LLaVA
- Gemma 3（4B+ 含圖片分析）

### Embedding
- Nomic Embed（274 MB，效能可比 OpenAI ada-002）

---

## 4. 安裝方式

### macOS
從 https://ollama.com/download 下載 `.dmg`，拖到 Applications。Apple Silicon（M1/M2/M3/M4）自動啟用 Metal GPU 加速。

### Linux
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Windows
```bash
winget install Ollama.Ollama
```

### Docker
```bash
# CPU only
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama

# NVIDIA GPU
docker run -d --gpus all -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama

# AMD GPU
docker run -d --device /dev/kfd --device /dev/dri -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama:rocm
```

> 注意：macOS Docker Desktop 不支援 GPU passthrough，建議直接在本機安裝。

---

## 5. CLI 基本指令

| 指令 | 說明 |
|------|------|
| `ollama serve` | 啟動 Ollama server（port 11434） |
| `ollama run <model>` | 下載（如需要）並互動式執行模型 |
| `ollama pull <model>` | 從 registry 下載模型 |
| `ollama list` | 列出已下載的模型及大小 |
| `ollama ps` | 顯示目前載入記憶體的模型 |
| `ollama show <model>` | 顯示模型資訊（架構、量化、授權） |
| `ollama create <name> -f Modelfile` | 從 Modelfile 建立自訂模型 |
| `ollama cp <src> <dst>` | 本地複製/別名模型 |
| `ollama rm <model>` | 刪除模型 |
| `ollama push <model>` | 推送模型到 registry |
| `ollama stop <model>` | 停止運行中的模型 |

**互動模式指令**（在 `ollama run` 內）：
- `/set parameter temperature 0.8` — 即時調整參數
- `/set system "You are a helpful assistant"` — 設定系統提示
- `/show info` — 顯示當前模型細節
- `/bye` — 離開

---

## 6. API 功能

Ollama 預設在 `http://localhost:11434` 提供服務。

### 原生 Ollama API
| 端點 | 用途 |
|------|------|
| `POST /api/generate` | 文字生成 |
| `POST /api/chat` | 多輪對話 |
| `POST /api/embed` | 生成 embeddings |
| `GET /api/tags` | 列出模型 |
| `POST /api/pull` | 下載模型 |
| `POST /api/create` | 建立模型 |
| `DELETE /api/delete` | 刪除模型 |

### OpenAI 相容端點（`/v1/`）
| 端點 | 用途 |
|------|------|
| `POST /v1/chat/completions` | 聊天 |
| `POST /v1/completions` | 文字補全 |
| `POST /v1/embeddings` | Embeddings |
| `GET /v1/models` | 列出模型 |

### Python 範例（使用 OpenAI SDK）
```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1/",
    api_key="ollama",  # Ollama 不驗證，但 SDK 需要此欄位
)

response = client.chat.completions.create(
    model="llama3.2",
    messages=[{"role": "user", "content": "你好！"}],
)
print(response.choices[0].message.content)
```

---

## 7. 與其他本地 LLM 方案比較

| 面向 | Ollama | llama.cpp | LM Studio | vLLM |
|------|--------|-----------|-----------|------|
| 介面 | CLI + REST API | 純 CLI | 完整 GUI | Server API |
| 安裝難度 | 簡單（一行指令） | 困難（需編譯） | 最簡單（安裝包） | 中等 |
| 開源 | 是 | 是 | 否 | 是 |
| 適合對象 | 開發者、API 整合 | 進階用戶、最大控制 | 初學者、GUI 用戶 | 生產環境 |
| GPU 控制 | 自動 | 完全手動 | GUI 滑桿 | 為吞吐量最佳化 |
| 效能額外開銷 | 極小 | 無（原始引擎） | 視情況 | 極小 |

**重點**：Ollama 和 LM Studio 底層都使用 llama.cpp。Ollama 的主要優勢是自動 VRAM 管理和開發者友善的 API。

---

## 8. 硬體需求

### RAM/VRAM 指南
| 模型大小 | 所需記憶體（4-bit 量化） |
|----------|------------------------|
| 7B | ~4-5 GB |
| 13B | ~8-9 GB |
| 30B | ~16-20 GB |
| 70B | ~40+ GB |

> 總是預留 2-3 GB 給作業系統。

### GPU 支援

**NVIDIA（支援最好）**：
- 需要 CUDA compute capability 5.0+
- 建議驅動 550+
- RTX 4090（24 GB）消費級首選；RTX 4060（8 GB）預算選擇

**AMD**：
- 僅 Linux 支援 ROCm（Windows 實驗性）
- RX 7900 XTX（24 GB）和 RX 7800 XT（16 GB）不錯
- 部分顯卡需設定 `HSA_OVERRIDE_GFX_VERSION`

**Apple Silicon**：
- Metal API 自動啟用，不需設定
- 統一記憶體架構 = 所有系統 RAM 都可供 GPU 使用
- M1/M2/M3/M4 全部支援
- 建議 32 GB+ 統一記憶體跑較大模型

### 重要提醒
當模型超過 VRAM 時，Ollama 自動把部分層溢出到系統 RAM。這避免了崩潰，但會有 **5-30 倍的速度降低**。

---

## 9. 生態系統與整合

### 常見整合
| 類型 | 工具 |
|------|------|
| Web UI | OpenWebUI（類 ChatGPT 介面） |
| IDE | Continue（VS Code/JetBrains）、Cline |
| CLI 工具 | aichat、oterm、gollama |
| RAG 框架 | LangChain、LlamaIndex |
| 智慧家庭 | Home Assistant |
| 訊息平台 | WhatsApp、Telegram、Slack、Discord（via OpenClaw） |

### 常見用途
- 私密 AI 助手（資料不離開你的機器）
- 本地程式碼補全和 review
- 搭配 RAG 做文件問答
- 在部署到雲端前用本地 LLM 開發原型
- 離線 / 氣隙環境的 AI
- 免費實驗推理

---

## 10. Modelfile 自訂

Modelfile 使用類似 Dockerfile 的語法來建立自訂模型變體。

### 主要指令
| 指令 | 用途 |
|------|------|
| `FROM` | 基礎模型（必填） |
| `SYSTEM` | 系統提示，定義個性/行為 |
| `PARAMETER` | 調整設定（temperature、context size 等） |
| `TEMPLATE` | 自訂 prompt 模板（Go template 語法） |
| `ADAPTER` | 套用 LoRA 微調 adapter |

### 常用參數
- `temperature` — 創意度 vs 一致性（0.0-2.0）
- `num_ctx` — context window 大小（tokens）
- `top_k` — 限制 token 候選數
- `top_p` — nucleus sampling 閾值
- `repeat_penalty` — 重複懲罰
- `stop` — 停止序列
- `num_predict` — 最大生成 token 數

### 範例
```dockerfile
FROM llama3.2
PARAMETER temperature 0.7
PARAMETER num_ctx 8192
PARAMETER top_p 0.9
SYSTEM You are a senior software engineer. Always provide code examples and explain your reasoning step by step.
```

```bash
# 建立自訂模型
ollama create my-code-assistant -f ./Modelfile

# 執行
ollama run my-code-assistant

# 檢視任何模型的 Modelfile
ollama show --modelfile llama3.2
```

---

## 11. 限制與注意事項

### 非開箱即用的生產環境方案
- 沒有內建的擴展、負載均衡或可觀測性
- 請求排隊是靜默的（不會拒絕），延遲會無聲地惡化
- 沒有自動更新機制，每個模型都要手動 `ollama pull`

### 安全性（重要！）
- 預設**沒有任何認證**，綁定到 `0.0.0.0` 會把 API 暴露在所有網路介面上
- 2026 年 1 月有報告指出 175,000 個暴露的 Ollama 伺服器被利用
- 任何網路部署都應該用反向代理 + 認證

### GPU 限制
- AMD GPU 支援僅限 Linux，且不如 NVIDIA 成熟
- 長時間運行後 GPU-to-CPU fallback 已被多次報告

### 自訂限制
- 無法選擇特定量化方法（Ollama 自動管理）
- 模型檔以 Ollama 專有 blob 格式儲存，不便跨工具共享
- 只做推理（inference），微調需要外部工具（可套用 LoRA adapter）

### 沒有內建 GUI
- Ollama 本身是 CLI/API，需要第三方前端如 OpenWebUI

---

## 12. 與我們專案的關聯性

目前 quidproquo 專案使用：
- **LLM**：Claude（Anthropic API）— claude-sonnet-4-6
- **Embedding**：`@cf/baai/bge-m3`（Cloudflare Workers AI）
- **Reranker**：`@cf/baai/bge-reranker-base`（Cloudflare Workers AI）

### 可能的整合方向
1. **開發/測試階段用 Ollama 替代雲端 API** — 節省 API 費用
2. **本地 Embedding** — 用 Ollama 的 Nomic Embed 替代 Cloudflare embedding
3. **離線開發** — 在沒有網路的環境也能開發和測試 RAG pipeline
4. **OpenAI 相容 API** — 因為 Ollama 提供 `/v1/` 端點，現有使用 OpenAI SDK 的程式碼可以幾乎不修改就切換

### 注意
- Ollama 的模型品質和速度取決於本地硬體，通常不如雲端 API
- 生產環境仍建議使用 Claude/Cloudflare 等雲端服務
- 適合作為開發階段的輔助工具，不適合直接替代生產環境的 LLM

---

## 參考資料
- [Ollama 官網](https://ollama.com)
- [Ollama GitHub](https://github.com/ollama/ollama)
- [Ollama CLI 文件](https://docs.ollama.com/cli)
- [Ollama Modelfile 文件](https://docs.ollama.com/modelfile)
- [Ollama OpenAI 相容性文件](https://docs.ollama.com/api/openai-compatibility)
- [Ollama API 文件](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [Ollama GPU 支援](https://docs.ollama.com/gpu)
- [Ollama Docker 文件](https://docs.ollama.com/docker)
- [Ollama 模型庫](https://ollama.com/library)
