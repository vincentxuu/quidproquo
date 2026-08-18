---
title: "OpenClaw 工具篇（四）：當工具多到塞不進 prompt——Code Mode、Tool Search 與 MCP"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, code-mode, tool-search, mcp, plugins, lobster, media-tools]
lang: zh-TW
series:
  name: "OpenClaw 文件導讀"
  order: 23
tldr: "工具目錄大到塞不進 prompt 時，OpenClaw 有兩個答案：Code Mode 只讓模型看到 exec 與 wait，由它寫小程式去搜尋與呼叫隱藏的目錄；Tool Search 則保留結構化的搜尋／描述／呼叫控制。兩者都不繞過工具政策。"
description: "OpenClaw 處理大型工具目錄的方式：Code Mode 的 QuickJS-WASI 沙箱與 auto 分層啟用、Tool Search 的取捨、MCP 伺服器的連接與 toolFilter，以及 plugin 提供的其餘工具面。"
draft: false
---

前三篇講的是個別工具。這篇講**當工具太多時**會發生什麼——這是 agent 系統長大之後必然遇到的問題，而 OpenClaw 給了兩個不同的答案。

## 問題：每個工具都要付 schema 的錢

模型看到的每個工具都是一份結構化的函式定義，佔 prompt。裝了十幾個 plugin、接了幾個 MCP 伺服器之後，光是工具 schema 就能吃掉可觀的 context——而且大部分工具在大部分回合裡用不到。

## 答案一：Code Mode

**Code Mode 讓模型不再看到每個工具的 schema。** 它只看到 `exec`、`wait`，以及少數結構化結果無法穿越 JSON-only guest bridge 的直接工具。模型改成**寫一小段 JavaScript 或 TypeScript 程式**，去搜尋、描述、呼叫那個隱藏的工具目錄。

幾個關鍵事實：

- **執行在隔離的 QuickJS-WASI worker thread 裡**
- 每個符合條件的已啟用工具（OpenClaw 核心、plugin、MCP、client）都被藏起來，改成在 guest 程式裡透過 `ALL_TOOLS` 與 `tools` 暴露
- **guest 呼叫工具走的是正常 agent 回合用的同一條執行路徑**——政策、核准、hook、遙測全部照舊
- **MCP 工具被歸在 `MCP` 命名空間底下，在 code mode 裡這是呼叫它們的唯一支援方式**
- `wait` 用來在巢狀工具呼叫仍在進行時恢復一個暫停的 code-mode 執行

**它預設是 `"auto"` 分層**：只在該次執行的模型被供應商目錄標記為偏好的 code-mode 表現者時才啟用，其他模型維持正常的工具暴露。要全域關掉設 `tools.codeMode: false`，要強制開設 `true`。

有兩個設計細節值得學：

**`exec` 的描述帶一份有界的快速索引**——確切的 OpenClaw／plugin 目錄 id、精簡的輸入提示，以及可信工具提供輸出 schema 時的精簡輸出提示。它**省略描述、完整 schema、MCP 條目與溢出條目**，guest 端的目錄查詢是後備。也就是說：不是「全部藏起來」，而是「留一份夠用的索引」。

**它 fail closed**：code mode 啟用但 QuickJS-WASI 執行期不可用時，**執行直接失敗，而不是安靜地退回廣泛的直接工具暴露**。

還有一個容易混淆的地方官方特別澄清了：**OpenClaw Code Mode 與 Codex Code Mode 是兩套不同的實作**，只是名字和控制工具名（`exec`、`wait`）相同。Codex 的跑在 Codex 編碼 harness 的 V8 執行期、`exec` 是自由語法工具；OpenClaw 的跑在通用 agent 執行期、`exec` 收 JSON `{ code, language }`。

**而且兩者的 `exec` 都不是 shell 面**——在 code mode 裡 `command` 是 `code` 的別名，看起來像 shell 指令的輸入會在 QuickJS worker 啟動前就被拒絕並給出可行動的指引。

## 答案二：Tool Search

如果你想要精簡的目錄，但**偏好結構化的搜尋／描述／呼叫控制而不是 QuickJS guest**，就用 Tool Search（`tool_search`、`tool_describe`、`tool_search_code`）。

官方給的選擇判準很乾脆：**目錄小、或模型不擅長寫短程式時，保留直接的工具暴露**；目錄大且模型會寫程式，Code Mode 的 token 效益更好；想要中間值就用 Tool Search。

Code Mode 與 Tool Search **都是實驗性的 OpenClaw agent 介面**。Codex harness 的執行改用 Codex 原生的 code mode、原生工具搜尋、延遲動態工具與巢狀工具呼叫，不走 `tools.codeMode` 或 `tools.toolSearch`。

## MCP：借用別的程式的工具

MCP 的定位一句話：**agent 向另一個程式借工具。** 伺服器定義放在設定的 `mcp.servers`，而**它們暴露的工具走跟其他工具一樣的 profile 與政策控制——連接一台伺服器不會繞過你的政策。**

三種加入方式：Control UI 的 **Settings → MCP**、聊天輸入框的 **+ → Connectors → Add MCP server…**（需要管理者存取，可選「這個 session」或「全域」），或 CLI：

```bash
openclaw mcp add docs \
  --url https://mcp.example.com/mcp \
  --transport streamable-http \
  --include 'search,read_*'
openclaw mcp doctor docs --probe
```

**最值得記住的一句是關於驗證的**：

> 儲存一個定義完全不能證明它連得上——**探測才能**。

而且已經在跑的 Gateway 或 agent 程序**可能需要重啟或執行期重載**才會看到新定義；`openclaw mcp reload` 只重整當前 CLI 程序擁有的執行期。

其他實用細節：傳輸有 Streamable HTTP、SSE、Stdio 三種；`toolFilter.include` / `exclude` 可以只暴露部分工具；HTTP 伺服器要 OAuth 時用 `openclaw mcp login <name>`；**伺服器名稱 `__proto__` 是保留字**；`enabled: false` 保留定義但不連線。

反向也支援：**`openclaw mcp serve` 把 OpenClaw 的頻道對話暴露給另一個 MCP client。**

沙箱環境有個額外設定要記：**用了沙箱化的 agent 又設定了 MCP 伺服器時，要在沙箱工具政策裡允許內建的 MCP plugin**（`tools.sandbox.tools.alsoAllow: ["bundle-mcp"]`）。

## Plugin 提供的其餘工具面

除了核心工具，plugin 還註冊了一批值得知道的：

| 工具 | 用途 |
|---|---|
| **Lobster** | 具型別的工作流，**支援可恢復的核准** |
| **Tokenjuice** | 壓縮吵雜的 `exec` 與 `bash` 工具輸出 |
| **Diffs** | 渲染檔案與 markdown 的差異 |
| **Show widget** | 在支援的聊天客戶端顯示自足的內聯 SVG 與 HTML |
| **Screen** | 排列已連線的 Control UI 窗格、面板與導覽 |
| **LLM Task** | 只回 JSON 的工作流步驟 |
| **Canvas** | node 的 Canvas 控制與 A2UI |

其中 **Tokenjuice** 的存在本身就說明了一個真實問題：**`exec` 的輸出經常又長又沒用**，而把壓縮做成一個工具而不是硬編在 exec 裡，讓你可以選擇要不要付那個模型呼叫的成本。

媒體那組則是 `image`、`image_generate`、`music_generate`、`video_generate`、`tts`——共用的媒體生成工具會在沒設定時**推斷有認證支撐的供應商預設值**（先當前預設供應商，再依供應商 id 順序找其餘註冊過的），**跨供應商的 fallback 是固定的預設行為**。

## 整體來說

這篇的三個工具其實在回答同一個問題的三個層次：**MCP 讓你接更多工具、Code Mode 與 Tool Search 讓接了很多工具之後還付得起 prompt 的錢、Tokenjuice 讓工具回來的東西也付得起。**

而貫穿它們的共同保證只有一句，但很重要：**這些機制改變的都只是「模型面對的編排介面」，不改變工具本身、政策、核准、認證或頻道行為。** 藏起來的工具仍然走同一條執行路徑，接進來的 MCP 工具仍然受同一套政策管。

## 更新紀錄

- 2026-08-18：對照官方文件現況大改，主題從個別工具（TTS／PDF）改為**大型工具目錄的處理方式**，因為這是 3 月之後最大的變化。新增：**Code Mode**（QuickJS-WASI worker、`"auto"` 分層的 per-model 啟用、`exec` 描述帶有界快速索引、fail closed 而非退回廣泛暴露、MCP 工具歸於 `MCP` 命名空間、與 Codex Code Mode 是兩套實作的澄清、`exec` 不是 shell 面）、**Tool Search** 與兩者的選擇判準、**MCP 的三種加入方式與 `toolFilter`**（含「儲存不等於連得上，探測才算」與沙箱下需允許 `bundle-mcp`）、以及 plugin 提供的工具面（Lobster 的可恢復核准、Tokenjuice、Diffs、Show widget、Screen、LLM Task、Canvas）與媒體工具的跨供應商 fallback。

## 參考資料

本篇整理自以下 OpenClaw 官方文件：

- [Code Mode](https://docs.openclaw.ai/tools/code-mode) — QuickJS-WASI 沙箱、分層啟用與 MCP 命名空間
- [Tool Search](https://docs.openclaw.ai/tools/tool-search) — 結構化的目錄搜尋控制
- [Connect MCP servers](https://docs.openclaw.ai/tools/mcp) — 加入、驗證與 toolFilter
- [Tools overview](https://docs.openclaw.ai/tools/) — 工具類別與 plugin 提供的工具
- [Media overview](https://docs.openclaw.ai/tools/media-overview) — 媒體生成與供應商選擇
