---
title: "Serena 怎麼讓 Coding Agent 改程式像用 IDE：語意工具、兩種後端與 Claude Code 設定"
date: 2026-10-25
category: ai
type: deep-dive
tags: [serena, mcp, coding-agent, lsp, claude-code, open-source]
lang: zh-TW
tldr: "Serena 是 MCP server，用 language server 讓 coding agent 以「符號」為單位查找、改名、改寫程式，而不是靠 grep 和行號。免費的 LSP 後端支援 40 多種語言，搬移與內聯等重構要付費的 JetBrains 外掛；v2 起授權改為 GPL。"
description: "介紹 Serena 的符號層級工具、LSP 與 JetBrains 兩種後端的能力差異、Claude Code 的安裝與 hooks 設定，以及授權與 agent 不愛用它的問題。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-10-25-serena-semantic-code-tools-mcp-en)

Coding agent 讀程式碼的預設做法是 grep 加讀檔：搜尋字串、打開整個檔案、再用行號或字串比對去改。在大型專案裡，這既耗 context，也容易改錯地方。[Serena](https://github.com/oraios/serena) 的主張是反過來，讓 agent 像人用 IDE 那樣，以「符號」（函式、類別、方法）為單位查找與修改。這篇說明它提供哪些工具、兩種後端差在哪裡、怎麼接到 Claude Code，以及導入前要先知道的限制。

## 是什麼

Serena 的自我介紹是「The IDE for Your Coding Agent」。它是一個 MCP server，提供[符號層級的檢索、編輯、重構與除錯工具](https://github.com/oraios/serena)，任何支援 [MCP](/posts/ai/2026-03-22-mcp-model-context-protocol) 的客戶端都能接，包括 Claude Code、Codex、VS Code、Cursor 與 JetBrains 系列。

要分清楚它**不是**什麼：Serena 本身不是 agent，也沒有模型。它只提供工具，實際判斷何時呼叫的仍是你原本用的 LLM。這點決定了它的成敗，限制一節會回到這裡。

## 給誰、先備知識

適合已經在用 coding agent、專案夠大到 grep 開始失靈（要跨檔改名、找某個函式所有呼叫處、搬移程式）的人。需要會設定 MCP server，並裝得起 [uv](https://docs.astral.sh/uv/getting-started/installation/)。

小專案、只改單檔、或主要在改設定檔與跑 shell 的人，收益有限。官方自己的評估也這麼說，見限制一節。

## 內容地圖

Serena 的能力可以用兩張表看完。第一張是工具類別，名稱取自[官方工具文件](https://oraios.github.io/serena/01-about/035_tools.html)：

| 類別 | 代表工具 | 做什麼 |
|---|---|---|
| 符號檢索 | `find_symbol`、`find_referencing_symbols`、`get_symbols_overview` | 找符號、找誰在引用它、看一個檔案的符號大綱，不必讀完整檔案 |
| 符號編輯 | `replace_symbol_body`、`insert_before_symbol`、`insert_after_symbol`、`safe_delete_symbol` | 直接改寫或插入一個符號，刪除前先檢查有沒有人在用 |
| 重構 | `rename_symbol`（LSP）；`jet_brains_move`、`jet_brains_inline_symbol`（JetBrains） | 跨檔改名；搬移與內聯要走 JetBrains |
| 記憶與認識專案 | `onboarding`、`write_memory`、`read_memory` | 先認識專案結構，再把資訊存成記憶檔，下次對話再讀 |
| 基本檔案與 shell | `read_file`、`search_for_pattern`、`execute_shell_command` | 補齊用；在 Claude Code 這類 harness 裡預設是關的，因為 harness 已經有 |

第二張是兩種後端。Serena 的語意能力來自 [README](https://github.com/oraios/serena) 說明的兩個互斥選擇：

| | Language server（預設） | JetBrains 外掛 |
|---|---|---|
| 費用 | 免費 | 付費，有試用 |
| 語言 | 40 多種 | JetBrains IDE 支援的語言（不含 Rider 與 CLion） |
| 改名 | 符號 | 符號、檔案、目錄 |
| 搬移、內聯、傳播刪除 | 沒有 | 有 |
| 型別階層、除錯 | 沒有 | 有 |

另有 v2 新增的 [REPL 介面](https://oraios.github.io/serena/01-about/035_tools.html)，目前標示為 BETA：原本每個操作是一個獨立的 MCP 工具，REPL 模式只留一個執行 Python 的工具，agent 自己組合多個操作，只把需要的結果帶回對話。官方文件的例子是一次呼叫就找出類別並列出成員：

```python
result = s.lsp.find_symbol("SerenaAgent", depth=1)
[member.name for member in result.symbols[0].iter_children()]
```

## 一個具體範例：接到 Claude Code

依 [README 的安裝步驟](https://github.com/oraios/serena)，Serena 用 uv 安裝；官方特別註明不要從 MCP 或外掛市集安裝，因為那裡的安裝指令已經過時：

```bash
uv tool install -p 3.13 serena-agent
serena init
serena setup claude-code
```

`serena setup claude-code` 是[官方客戶端文件](https://oraios.github.io/serena/02-usage/030_clients.html)給的快捷方式。手動設定時，全域用 `--scope user` 加 `--project-from-cwd`，只給單一專案則用 `--project "$(pwd)"`：

```bash
claude mcp add --scope user serena -- serena start-mcp-server --context claude-code --project-from-cwd
```

裝完用 `/mcp` 確認連線；Serena 啟動太慢時，把 `MCP_TIMEOUT` 調高（官方範例是 60000）。接著給一個真正需要語意工具的任務，例如：「把 `UserService.get` 改名為 `fetch`，並更新所有呼叫處」。此時 agent 應該呼叫 `rename_symbol`，一次完成跨檔改名，而不是逐檔 grep 再替換。

## 限制

**agent 不一定會用它。** 這是官方在[客戶端文件](https://oraios.github.io/serena/02-usage/030_clients.html)裡寫明的問題：Claude Code 近期的改動（動態載入工具）讓 agent 常常沒載入 Serena 的工具，或長對話中忘記使用，這種現象稱為 agent drift。官方的描述更直接：Claude Code 內建工具的說明約佔 16k tokens，且無法調整，造成對內建工具的強烈偏好，在 Opus 4.7 上「幾乎不可能說服它使用 Serena」。對策有兩個：設定官方提供的 `serena-hooks`（remind、activate、cleanup、auto-approve，都標示為 alpha），或用 `claude --system-prompt="$(serena prompts print-cc-system-prompt-override)"` 覆寫系統提示。裝了不等於會用，上線前要實際看 agent 有沒有呼叫它。

**`auto-approve` hook 會跳過確認。** 它在 Claude Code 處於 `acceptEdits` 或 `auto` 模式時，自動放行 Serena 的所有呼叫，包括 `replace_symbol_body`、`rename_symbol` 這類會改檔案的工具。只在你信任當前專案與模型時啟用，授權設計可參考[AI 安全系列的工具授權篇](/posts/ai/2026-10-22-ai-security-tool-authorization)。

**免費後端的重構比較少。** 依 [README 的能力表](https://github.com/oraios/serena)，language server 後端的改名只涵蓋符號，沒有搬移、內聯與傳播刪除，這些要付費的 JetBrains 外掛。語言覆蓋也依賴各 language server 的品質，有些語言需要另外安裝依賴。

**效果的證據是 agent 自述。** README 和[評估頁](https://oraios.github.io/serena/04-evaluation/000_evaluation-intro.html)引用的是 agent 做完約 20 項日常任務後給的一句話評語，官方明說「agent 自己評估自己」是刻意設計，並且要求把「Serena 沒有幫助」和「超出範圍」的結果一併記錄。同一頁的結論也提醒：它的強項是把跨檔、需要語意的操作收成一次呼叫，小範圍的文字修改、文字搜尋、設定檔與 shell 工作，內建工具仍然比較合適。這是專案方的評估，不是獨立 benchmark；想看第三方的對照，可以參考站內[CodeGraph 那篇對 Serena 的比較](/posts/ai/2026-05-23-codegraph-code-knowledge-graph-mcp)。

**授權在 v2 改了。** [LICENSE 總覽](https://github.com/oraios/serena/blob/main/LICENSE)寫明：language server 用戶端函式庫 SolidLSP 維持 MIT，Serena 應用程式從 v2 起改為 GPL-3.0-or-later，最後一個 MIT 版本是 v1.7.0。把它當工具用沒有問題；要把 Serena 的程式碼嵌進會對外散布的產品之前，先讀完 LICENSE。

## 怎麼用

1. **先確認瓶頸真的是 grep。** 找一個跨檔改名或「這個函式被誰呼叫」的真實任務，先不裝 Serena 跑一次，記下步驟數與 token 用量，作為比較基準。
2. **只裝在一個專案。** 用 `--project "$(pwd)"` 設定單一專案，不要一開始就全域啟用。
3. **用 `/mcp` 確認連線，再派一個語意任務。** 觀察 agent 有沒有真的呼叫 `find_referencing_symbols` 或 `rename_symbol`。沒呼叫就先設定 hooks；hooks 仍沒有效果，再考慮覆寫系統提示。
4. **大專案考慮 JetBrains 後端。** 需要搬移與內聯時才付費；先用免費後端跑兩週看夠不夠。
5. **用同一個任務比較。** 裝了之後再跑一次步驟 1 的任務，對照步驟數與 token；沒有明顯改善就關掉，不必留著。

想了解 Serena 的 LSP 路線跟預先建索引的圖路線怎麼取捨，看[CodeGraph 介紹](/posts/ai/2026-05-23-codegraph-code-knowledge-graph-mcp)；想知道 coding agent 內部怎麼處理 LSP 診斷，看[LSP 整合那一篇](/posts/ai/2026-08-30-coding-agent-lsp-integration)。

## 參考資料

- [oraios/serena（README）](https://github.com/oraios/serena)
- [LICENSE：Serena Licensing Overview](https://github.com/oraios/serena/blob/main/LICENSE)
- [Tools and APIs（官方文件）](https://oraios.github.io/serena/01-about/035_tools.html)
- [Connecting Your MCP Client（官方文件）](https://oraios.github.io/serena/02-usage/030_clients.html)
- [Evaluation（官方文件）](https://oraios.github.io/serena/04-evaluation/000_evaluation-intro.html)
- [uv 安裝說明](https://docs.astral.sh/uv/getting-started/installation/)
- [MCP 介紹](/posts/ai/2026-03-22-mcp-model-context-protocol)
- [CodeGraph：程式碼知識圖譜 MCP](/posts/ai/2026-05-23-codegraph-code-knowledge-graph-mcp)
- [跟成熟 coding agent 學設計（36）：LSP 整合](/posts/ai/2026-08-30-coding-agent-lsp-integration)
- [AI 安全：工具授權](/posts/ai/2026-10-22-ai-security-tool-authorization)
