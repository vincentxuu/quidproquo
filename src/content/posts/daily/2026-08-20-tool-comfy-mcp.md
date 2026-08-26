---
title: "工具推薦｜comfy-mcp — Comfy 官方 MCP server，讓 Agent 直接開你本機的 ComfyUI"
date: 2026-08-20
category: daily
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "Comfy 官方推出的 local MCP server，把 comfy-cli 包成 39 個 MCP tool，讓 Claude Code、Cursor 等 Agent 直接跑你電腦上的 ComfyUI workflow，不用你手動開終端機"
tldr: "comfy-mcp 是 Comfy 官方推出的 local MCP server，把 comfy-cli 的完整功能包成 39 個 MCP tool。安裝：pip install comfy-mcp \"comfy-cli>=1.14.0\"。解決了 Agent 想幫你跑圖像/影片生成 workflow 時，得靠你手動開終端機下指令、自己確認有沒有裝對 node 和模型的問題。"
series:
  name: "AI Tool of the Day"
  order: 5
---

> 🌏 [English version](/en/posts/daily/2026-08-20-tool-comfy-mcp-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | comfy-mcp |
| 類型 | MCP server |
| GitHub | [Comfy-Org/comfy-mcp](https://github.com/Comfy-Org/comfy-mcp) |
| Stars | 88 |
| 語言 | Python |
| 授權 | AGPL-3.0-or-later OR Commercial |
| 安裝 | `pip install comfy-mcp "comfy-cli>=1.14.0"` |

## 解決什麼問題

你是否用 Agent 幫忙做圖像或影片生成任務時，發現 Agent 只能「告訴你」該用哪個 ComfyUI workflow、哪個 node，剩下裝套件、開伺服器、跑 workflow、確認有沒有跑出東西全部要自己手動來？ComfyUI 的操作習慣是在瀏覽器裡拖節點、按 Queue，Agent 過去沒有一個標準管道能直接碰到這台機器上正在跑的 ComfyUI。

comfy-mcp 是 Comfy 官方（也就是 ComfyUI 背後的公司）自己維護的 local MCP server，把 `comfy-cli` 的功能整組包成 39 個 MCP tool 開給 Agent 用：從 `run_workflow`、`generate_image` 這種直接執行，到 `validate_workflow`、`workflow_deps` 這種跑之前先檢查 workflow 用到的 node 包裝有沒有裝、`search_templates`／`fetch_template` 直接從官方模板庫抓現成 workflow，甚至 `launch_comfyui`／`install_node` 這種連「開伺服器」「裝套件」本身都能讓 Agent 代勞。所有 tool 底層都是呼叫 `comfy --json --where local`，等於是把 comfy-cli 原本要人手動下的指令，變成 Agent 可以直接呼叫、有結構化回傳值的介面。

適合場景：用 Claude Code／Cursor 之類工具做圖像或影片生成流程的自動化，例如批次跑一組 workflow 變體、Agent 幫忙除錯「這個 workflow 為什麼跑不出來」（透過 `validate_workflow`／`node_dependencies` 找出缺的 node）、或是想讓 Agent 自己去官方模板庫挑一個現成 workflow 再依需求調參數。

## 快速上手

### 安裝

```bash
pip install comfy-mcp "comfy-cli>=1.14.0"
comfy install    # 如果還沒有 ComfyUI workspace
comfy launch     # 啟動 ComfyUI 本體
```

### 基本用法

```json
// Claude Desktop / Cursor 的 mcp.json
{
  "mcpServers": {
    "comfy-mcp": {
      "command": "comfy-mcp",
      "env": {
        "COMFY_BIN": "/path/to/venv/bin/comfy"
      }
    }
  }
}
```

Agent 連上後可直接呼叫的核心 tool：

- `server_info()` — 確認 ComfyUI 有沒有在跑、硬體規格
- `search_templates(query, tag, model)` — 從官方模板庫找 workflow
- `run_workflow(workflow_path, wait, confirm_spend)` — 執行 workflow
- `job(action="status|wait|watch|cancel", prompt_id)` — 監控排隊中的任務
- `fetch_outputs(prompt_id, out_dir)` — 拿到產出的圖片/影片

### 進階用法

```bash
# 跑之前先驗證 workflow 用到的 node 包裝是否齊全
comfy-mcp validate_workflow --workflow_path ./my_workflow.json

# 缺什麼就用這個查依賴、再用 install_node 裝
comfy-mcp workflow_deps --workflow_path ./my_workflow.json
```

同一個 workflow 也能一次 fan 出多組參數變體，交給 Agent 批次比較：

```bash
comfy-mcp vary_workflow \
  --workflow_path ./portrait.json \
  --slots '{"steps": [20, 30, 40], "cfg": [4, 7]}' \
  --out_dir ./variants
```

## 與現有工具的比較

| | comfy-mcp | 手動操作 ComfyUI 網頁介面 | Comfy Cloud MCP |
|---|---|---|---|
| Agent 直接執行 workflow | ✅ | ❌ | ✅ |
| 跑在自己機器、自己的 GPU/模型 | ✅ | ✅ | ❌（跑在 Comfy Cloud GPU） |
| 免另申請雲端額度 | ✅ | ✅ | ❌（按用量計費） |
| workflow 依賴檢查（node/模型是否齊全） | ✅ | 需自己排查 | 由雲端環境保證 |
| 官方維護 | ✅ Comfy-Org | — | ✅ Comfy-Org |

## 注意事項

- **授權是 AGPL-3.0-or-later 或商業授權雙軌制**，不是單純 MIT／Apache，如果你的專案會把 comfy-mcp 整合進商業產品對外提供服務，AGPL 的 copyleft 條款可能要求你開源整合後的程式碼，需要先確認自己的使用情境是否符合，或改談商業授權。
- **仍是 Beta 狀態**，README 自己標註「Status: Beta」，目前只在 Python 3.10 和 3.14 上跑 CI，中間版本沒有明確保證。
- **花費類 tool 有加保護**：`partner_generate` 這類會呼叫付費 partner API 的 tool 預設一定會先跳出確認，`run_template`／`run_workflow` 則要顯式傳 `confirm_spend=True` 才會跳確認，避免 Agent 沒注意到就把你的 API 額度燒完。

## 今日收穫

comfy-mcp 有意思的地方不在「幫 ComfyUI 加了個 MCP 介面」本身，而在它把 comfy-cli 原本設計給人在終端機打指令的操作邏輯，完整搬進了 Agent 可呼叫的 39 個 tool 裡——包含「跑之前先驗證依賴」「模板庫直接查詢」這種原本要人有經驗才知道該做的前置檢查步驟，也變成 Agent 可以主動呼叫的動作。這說明一個成熟 CLI 工具要接上 MCP，重點往往不是包一層轉接器，而是把工具鏈裡「有經驗的人會多做的那幾步」也一併結構化出來。

## 參考資料

- [Comfy-Org/comfy-mcp — GitHub](https://github.com/Comfy-Org/comfy-mcp)
- [Open Sourcing Comfy MCP on Local — Comfy Blog](https://blog.comfy.org/p/open-sourcing-comfy-mcp-on-local)
