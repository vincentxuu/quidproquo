---
title: "GPUtw AI Skill 是什麼：讓 AI 編碼助理直接管 GPU 的技能包與 MCP 伺服器"
date: 2026-09-16
category: tech
type: deep-dive
tags: [gputw-ai, mcp, agent-skills, gpu-cloud, open-source, developer-tools]
lang: zh-TW
tldr: "GPUtw AI Skill 是官方的 Agent Skill 技能包加 MCP 伺服器，讓 Claude Code、Codex、Cursor、Copilot、Gemini CLI 用自然語言管理 GPUtw 的台灣 GPU 雲端。18 個 MCP 工具涵蓋目錄查詢、執行個體生命週期、狀態監控與 Vault 操作。MIT 開源。"
description: "介紹 GPUtw AI Skill V1.1.0-beta.1 的架構、MCP 工具清單、安裝方式、安全模型、支援平台，以及它跟直接呼叫 REST API 的差異。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-09-16-gputw-ai-skill-mcp-server-en)

[GPUtw AI Skill](https://github.com/GPUtw-ai/GPUtw-Skill) 是 [GPUtw.ai](https://gputw.ai/en) 官方推出的 AI 編碼助理技能包。它做的事很直接：把 GPUtw 的 REST API 文件和操作邏輯打包成一份 Agent Skill，讓 Claude Code、OpenAI Codex CLI、Google Gemini CLI、Cursor、GitHub Copilot 這些 AI 助理能讀懂 GPUtw 的 GPU 目錄、部署執行個體、監控狀態、搬資料，不需要使用者自己查 API 文件再手寫 curl。

V1.1.0-beta.1（2026-09-16）加入了官方 [MCP](https://modelcontextprotocol.io/) 伺服器，提供 18 個結構化工具。整套東西 MIT 開源，沒有執行期依賴，API 金鑰留在本機。

這篇介紹它的架構、工具清單、安裝方式和安全邊界。如果你還不知道 GPUtw.ai 是什麼，先看 [GPUtw.ai 是什麼：台灣在地 GPU 雲端、短租算力與研究者工作流](/posts/tech/2026-08-29-gputw-ai-taiwan-gpu-cloud)。

## 它解決的不是 API 本身，是 AI 助理跟 API 之間的落差

GPUtw.ai 本來就有公開的 [REST API](https://docs.gputw.ai/zh-TW/docs/rest-api-quickstart)，你可以用 curl 或 Python 自己呼叫。問題是，當你在 Claude Code 或 Codex 裡說「幫我開一台 RTX 3090 跑 PyTorch」，AI 助理不知道 GPUtw 的端點長什麼樣、要帶哪些參數、部署順序是什麼、哪些操作有風險。

GPUtw AI Skill 把這些知識預先打包好。沒有它，你可以自己寫一份 prompt 教 AI 用 GPUtw API；有了它，這些已經寫好、測過、有決策樹和錯誤處理，而且跨平台都能用。

真正的增量不是「讓你能管 GPU」——你本來就能；而是把管 GPU 的知識從使用者腦中搬進 AI 助理的 context，降低從「我想做」到「做完了」的摩擦。

## 三層查找架構

GPUtw AI Skill 的知識組織用三層漸進揭露：

```
SKILL.md（決策樹、規則、快速索引）
  → guides/NN-*.md（12 份整合指南，含快照表格）
      → references/docs-site.md → web_fetch gputw.ai/docs（即時官方文件）
```

第一層是 `SKILL.md`，AI 助理一載入就讀到：部署順序、安全規則、常見錯誤對照表。第二層是 12 份主題指南，涵蓋部署、監控、Vault、網路、帳務等。第三層是官方文件的即時查詢——指南裡的表格是 2026-09 快照，遇到快照沒覆蓋的情境就走 `web_fetch` 查最新文件。

這個設計避免了兩個極端：不是把整份 API 文件塞進 context（太大），也不是只給一個連結讓 AI 自己爬（太慢、太不穩定）。

## MCP 伺服器與 18 個工具

V1.1.0-beta.1 的核心新增是官方 MCP 伺服器（npm 套件 `@gputw/mcp-server`，TypeScript 實作，基於 [MCP SDK](https://modelcontextprotocol.io/) 1.30）。它把 GPUtw REST API 包成 18 個結構化工具，分四組：

### 目錄查詢（4 個）

| 工具 | 用途 | API 權限 |
|---|---|---|
| `list-gpus` | 列出可用 GPU 型號、價格、庫存 | 公開 |
| `list-available-nodes` | 查詢特定 GPU 的可用節點 | `catalog:read` |
| `list-templates` | 列出環境範本 | 公開 |
| `get-deploy-options` | 取得部署設定選項 | 公開 |

### 執行個體管理（5 個）

| 工具 | 用途 | API 權限 |
|---|---|---|
| `list-instances` | 列出所有執行個體 | `instances:read` |
| `create-instance` | 建立新執行個體 | `instances:create` |
| `stop-instance` | 停止執行個體 | `instances:manage` |
| `delete-instance` | 刪除執行個體（破壞性） | `instances:manage` |
| `restart-instance` | 重啟執行個體 | `instances:manage` |

### 狀態監控（4 個）

| 工具 | 用途 | API 權限 |
|---|---|---|
| `get-instance-status` | 查詢執行個體狀態 | `instances:read` |
| `get-instance-resources` | 查看 GPU/CPU/記憶體使用率 | `instances:read` |
| `get-instance-logs` | 取得容器日誌 | `instances:read` |
| `get-instance-events` | 取得事件歷程 | `instances:read` |

### Vault 操作（5 個）

| 工具 | 用途 | API 權限 |
|---|---|---|
| `list-vault` | 列出 Vault 檔案 | `vault:read` |
| `get-vault-stats` | 查看儲存用量 | `vault:read` |
| `upload-to-vault` | 上傳檔案（支援分段續傳，單檔最大 2TB） | `vault:write` |
| `download-model-to-vault` | 從 Hugging Face 等來源下載模型到 Vault | `vault:write` |
| `list-vault-downloads` | 列出下載任務 | `vault:read` |

另有一個預設關閉的 `exec-in-instance` 工具（需要設定 `GPUTW_MCP_ALLOW_EXEC=1` 環境變數才啟用），以 root 在容器內執行指令，每次呼叫寫入稽核紀錄。

每個工具都帶 MCP 標準的 `readOnlyHint`、`destructiveHint`、`idempotentHint` 標註，讓 AI 助理知道哪些操作安全、哪些要確認。回應經過欄位投射，從原本約 50 個欄位精簡到 20 個以內，省 context 空間。

## 安裝方式

GPUtw AI Skill 支援多種安裝方式，依平台和需求選擇。

**Claude Code**（三種方式）：

外掛市場安裝（推薦）：

```bash
/plugin marketplace add GPUtw-ai/GPUtw-Skill
/plugin install gputw@gputw
```

手動全域安裝：

```bash
git clone https://github.com/GPUtw-ai/GPUtw-Skill.git ~/.claude/skills/gputw
```

只裝 MCP 伺服器：

```bash
claude mcp add gputw -s user \
  -e GPUTW_API_KEY=gputw_live_xxx \
  -- npx -y @gputw/mcp-server@latest
```

**OpenAI Codex CLI**：Clone 到 `.gputw-skill/` 或 `~/.codex/gputw-skill/`，在專案的 `AGENTS.md` 加入指向 `AGENTS.md` 的引用。

**Google Gemini CLI**：Clone 到 `.gputw-skill/`，在 `GEMINI.md` 加入引用。

**Cursor**：Clone 到 `.gputw-skill/`，在 Cursor Rules 或 `AGENTS.md` 引用。

**GitHub Copilot**：Clone 到 `.gputw-skill/`，建立 `.github/copilot-instructions.md` 指向技能包。

**任何 MCP 客戶端**（Claude Desktop、VS Code、Windsurf 等）：在 MCP 設定檔加入 JSON 設定：

```json
{
  "mcpServers": {
    "gputw": {
      "command": "npx",
      "args": ["-y", "@gputw/mcp-server@latest"],
      "env": {
        "GPUTW_API_KEY": "gputw_live_xxx"
      }
    }
  }
}
```

安裝後可以用一個問題驗證：問 AI 助理「GPUtw API key 的前綴是什麼？」——正確答案是 `gputw_live_`。

## 安全模型

GPUtw AI Skill 在安全設計上有幾個值得注意的地方：

**金鑰處理**：API 金鑰（`gputw_live_` 前綴）只從環境變數讀取，只放在 `Authorization` header，不會出現在查詢字串、日誌或硬編碼。MCP 伺服器會主動遮蔽輸出中出現的金鑰字串。

**權限分級**：17 個 API scope 搭配 5 個預設組合——`readonly`、`deploy`、`operator`、`Upload token`（只有 `vault:write`）、`full`（含 `exec`）。你可以只給 AI 助理 `readonly` scope 的金鑰，讓它查資料但不能開機器。

**exec 預設關閉**：`exec-in-instance` 是 root 等級的容器內執行，預設不啟用。要開需要同時有 `instances:exec` scope 的金鑰和 `GPUTW_MCP_ALLOW_EXEC=1` 環境變數。每次呼叫寫入帳戶稽核紀錄。

**瀏覽器限定操作**：SSH 金鑰管理、儲值、密碼修改、團隊建立、通知設定、管理員操作不走 API，只能在網頁上做。AI 助理遇到這些需求會直接說「這個要去網頁操作」，不會嘗試繞過。

## MCP 伺服器還沒覆蓋的範圍

V1.1.0-beta.1 是 beta 版。以下操作目前還不在 MCP 工具裡，需要自己用 curl 或 REST API 處理：

- 連接埠與服務暴露（HTTP ports、raw TCP/UDP）
- API 金鑰管理
- 帳務與計費查詢
- 團隊管理
- 通知設定
- 預約與工單

技能包的 Skill 內容本身（指南、決策樹、錯誤對照表）是穩定版。

## 適合誰

- 已經在用 GPUtw.ai、想讓 AI 助理幫忙管 GPU 執行個體的開發者。
- 想用自然語言部署 GPU 來跑模型微調（LoRA/QLoRA/[Unsloth](https://github.com/unslothai/unsloth)）、影像辨識（YOLO）、推論（[vLLM](https://github.com/vllm-project/vllm)、[llama.cpp](https://github.com/ggerganov/llama.cpp)）或圖片生成（[ComfyUI](https://github.com/comfyanonymous/ComfyUI)）的人。
- 想用 MCP 伺服器把 GPUtw 整合進自動化工作流（CI/CD、批次部署、排程訓練）的團隊。

不適合：

- 還沒有 GPUtw.ai 帳號和 API 金鑰的人——技能包不替代平台本身，你還是要先註冊儲值。
- 需要 MCP 工具管理連接埠、帳務或團隊的人——這些還沒覆蓋。
- 期待一鍵完成複雜訓練流程的人——AI 助理能幫你操作 API，但模型訓練的知識（資料準備、超參數、評估）還是你自己的事。

## 整體來說

GPUtw AI Skill 做的是一件很具體的事：把「使用者讀 API 文件、寫 curl、管 GPU」的工作流，變成「告訴 AI 助理你要做什麼，它去呼叫 API」。18 個 MCP 工具覆蓋了 GPU 目錄、執行個體生命週期、狀態監控和 Vault 操作，安全模型有金鑰隔離、scope 分級和 exec 預設關閉。

它是技能包加 MCP 伺服器，不是新的 GPU 平台。GPUtw.ai 本身的定位、GPU 庫存、價格、SLA 等評估不在這篇範圍——那些看 [平台介紹](/posts/tech/2026-08-29-gputw-ai-taiwan-gpu-cloud)。

想試的話，最簡單的方式是在 Claude Code 裡跑 `claude mcp add gputw`，給它一支 `readonly` scope 的金鑰，先讓它列出 GPU 目錄和範本。確認能動之後再決定要不要裝完整技能包或升級金鑰權限。

## 參考資料

- [GPUtw AI Skill GitHub repo](https://github.com/GPUtw-ai/GPUtw-Skill)
- [GPUtw AI Skill CHANGELOG](https://github.com/GPUtw-ai/GPUtw-Skill/blob/master/CHANGELOG.md)
- [GPUtw.ai](https://gputw.ai/en)
- [GPUtw.ai REST API quickstart](https://docs.gputw.ai/zh-TW/docs/rest-api-quickstart)
- [GPUtw.ai API keys](https://docs.gputw.ai/zh-TW/docs/api-keys)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [@gputw/mcp-server npm](https://www.npmjs.com/package/@gputw/mcp-server)
- [GPUtw.ai 是什麼：台灣在地 GPU 雲端、短租算力與研究者工作流](/posts/tech/2026-08-29-gputw-ai-taiwan-gpu-cloud)
- [個人學模型訓練要租 GPU 嗎：GPUtw.ai、LoRA、Jupyter 與第一輪實驗](/posts/ai/2026-08-29-gputw-ai-learning-gpu)
