---
title: "工具推薦｜INE MCP — 西班牙國家統計局自己發布的 MCP server，讓 Agent 直接查官方統計數據"
date: 2026-11-28
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "INE MCP 是西班牙國家統計局官方發布的 MCP server，讓 AI 助理用自然語言查詢失業率、人口等官方統計數據，並用伺服器端強制的五步順序擋住亂猜統計代碼"
tldr: "INE MCP 是西班牙國家統計局（INE）自己發布的 MCP server，讓 Agent 直接查詢官方統計數據。安裝：uv sync 後 uv run ine-mcp。解決了 INE 統計代碼體系複雜、agent 容易亂猜步驟與變數代碼的問題。"
series:
  name: "AI Tool of the Day"
  order: 92
---

> :globe: [English version](/posts/daily/2026-11-28-tool-ine-mcp-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | INE MCP |
| 類型 | MCP server |
| GitHub | [es-ine/mcp](https://github.com/es-ine/mcp) |
| Stars | 195（2026-11-28 查核時數字，兩天前由西班牙國家統計局官方帳號發佈） |
| 語言 | Python |
| 授權 | EUPL-1.2 |
| 安裝 | `uv sync && uv run ine-mcp`（先 git clone 這個 repo） |

## 解決什麼問題

你想知道西班牙近四個季度穆爾西亞男性的失業率，數字其實都在 INE（Instituto Nacional de Estadística，西班牙國家統計局）的公開 API 上，但要先從上百個「統計作業」裡找到對的那個，再挑出對的表格，表格裡的省、性別、年齡組全部用數字代碼表示——人要摸熟這套代碼體系就要花時間，讓 LLM 自己猜代碼更危險：猜錯的代碼看起來完全合理，卻可能抓到錯的統計類別甚至整個查詢失敗，而你很難從結果本身看出哪裡錯了。

INE MCP 是 INE 自己做的，不是第三方包裝 API 的工具，把這套查詢拆成五個唯讀工具，並在伺服器端強制五步順序：先選統計作業、再選表格、再選表格的變數分類、再選變數的值、最後才能真的抓資料。每一步只接受前一步真正回傳過的 ID，跳過步驟或自己編代碼會直接被擋下來，回傳 `BLOCKED` 並說明該先呼叫哪個工具。每筆結果都附上 INE 官方表格的網址與套用的篩選條件，方便查核與引用。

適合做歐洲經濟或政策研究、新聞資料查核，或任何需要可信賴西班牙官方統計的分析 agent；也值得當成「怎麼讓 agent 安全呼叫有依賴關係的多步驟 API」的參考案例，不只限統計資料這一種場景。

```diagram
title: INE MCP 用強制步驟擋住跳步查詢
desc: 跳過前面步驟直接要資料會被 MCP 擋下來，照順序從查統計作業開始，才真的呼叫 INE 的公開 API 拿到資料。
caption: 依官方 README「Enforced order」簡化；完整流程共五步，這裡只畫出跳步失敗與重新照順序成功這兩段。
step: AI 助理跳過前面步驟，直接呼叫查資料的工具
step: MCP 在本機就擋下來，回傳 BLOCKED
step: AI 助理改成從第一步開始，查詢統計作業
step: MCP 把查詢轉給 INE 的公開 API
step: INE API 回傳符合的作業清單
step: MCP 把作業 ID 交給 AI 助理，可以進下一步
---
<svg viewBox="0 0 640 456">
  <line class="dg-rule" x1="96" y1="72" x2="96" y2="420"/>
  <line class="dg-rule" x1="320" y1="72" x2="320" y2="420"/>
  <line class="dg-rule" x1="544" y1="72" x2="544" y2="420"/>

  <g data-step="1">
    <path class="dg-line" d="M96 132H312" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="208" y="120" text-anchor="middle" dominant-baseline="central">跳步直接查資料</text>
  </g>
  <g data-step="2">
    <path class="dg-line dg-line--warn dg-line--dashed" d="M316 180H100" marker-end="url(#arrow-warn)"/>
    <text class="dg-edge dg-text--warn" x="208" y="168" text-anchor="middle" dominant-baseline="central">BLOCKED</text>
  </g>
  <g data-step="3">
    <path class="dg-line" d="M96 252H312" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="208" y="240" text-anchor="middle" dominant-baseline="central">查詢統計作業</text>
  </g>
  <g data-step="4">
    <path class="dg-line" d="M324 300H536" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="432" y="288" text-anchor="middle" dominant-baseline="central">查詢作業目錄</text>
  </g>
  <g data-step="5">
    <path class="dg-line dg-line--dashed" d="M540 348H328" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="432" y="336" text-anchor="middle" dominant-baseline="central">回傳作業清單</text>
  </g>
  <g data-step="6">
    <path class="dg-line dg-line--accent dg-line--dashed" d="M316 396H100" marker-end="url(#arrow-accent)"/>
    <text class="dg-edge dg-text--accent" x="208" y="384" text-anchor="middle" dominant-baseline="central">可進下一步</text>
  </g>

  <rect class="dg-box" x="316" y="120" width="8" height="72" rx="2" data-step="1 2"/>
  <rect class="dg-box" x="316" y="240" width="8" height="168" rx="2" data-step="3 4 5 6"/>
  <rect class="dg-box" x="540" y="288" width="8" height="72" rx="2" data-step="4 5"/>

  <rect class="dg-box" x="32" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="96" y="48" text-anchor="middle" dominant-baseline="central">AI 助理</text>
  <rect class="dg-box dg-box--accent" x="256" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="320" y="48" text-anchor="middle" dominant-baseline="central">INE MCP</text>
  <rect class="dg-box" x="480" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="544" y="48" text-anchor="middle" dominant-baseline="central">INE API</text>
</svg>
```

## 快速上手

### 安裝

```bash
git clone https://github.com/es-ine/mcp.git ine-mcp
cd ine-mcp
uv sync                 # 需要 Python 3.11+ 與 uv
claude mcp add ine -- uv run --directory "$(pwd)" ine-mcp
```

### 基本用法

問一句自然語言，INE MCP 會依序呼叫五個工具，每步只用前一步真正回傳的 ID：

```text
你問：「過去四個季度，穆爾西亞男性的失業率是多少？」

1. ine_select_operation("labour force survey")        → 找到勞動力調查的 operation_id
2. ine_select_multiple_tables(operation_id)            → 列出可用表格，選出失業率表
3. ine_select_multiple_table_groups(table_id)          → 讀出表格的變數分類（省、性別、年齡…）
4. ine_select_multiple_values(table_id, group_id)      → 把「穆爾西亞」「男性」轉成對應的值 ID
5. ine_select_multiple_table_data(table_id, tv=[...])  → 回傳數字＋INE 官方表格網址
```

### 進階用法（選填）

```bash
# VS Code 一行指令安裝
code --add-mcp '{"name":"ine","command":"uv","args":["run","--directory","/path/to/ine-mcp","ine-mcp"]}'
```

```toml
# Codex CLI（~/.codex/config.toml）
[mcp_servers.ine]
command = "uv"
args = ["run", "--directory", "/path/to/ine-mcp", "ine-mcp"]
```

## 與現有工具的比較

| | INE MCP | 手動查 INE 官網 | 通用網頁抓取（Firecrawl 等） |
|---|---|---|---|
| 自然語言問，自動找對統計作業和表格 | ✓ | ✗（要自己認代碼） | 部分（讀得到文字，但不懂 INE 的作業／表／變數代碼結構） |
| 結果固定附官方表格網址 | ✓ | ✓（自己找到的那個） | 視頁面而定，常常只拿到片段文字 |
| 擋住亂猜或跳步的變數代碼 | ✓（伺服器端強制五步順序） | — | ✗（LLM 可能自己編代碼） |
| 需要先懂 INE 統計體系才能用 | ✗ | ✓ | 部分 |
| 即時連回 INE API，不是舊快取資料 | ✓ | ✓ | 視爬取時間點而定 |

## 注意事項

- **目前只能本機跑**：README 寫「Hosted endpoint: Available soon」，託管端點還沒上線，要用就得先 `git clone` 再 `uv sync`，不是裝一個套件就能直接連遠端服務。
- **166 個統計作業裡只有 110 個有表格可查**：剩下 56 個在目錄裡列得到名字，但 INE 還沒公開對應的表格，查這些作業會拿不到資料。
- **資料標籤是西班牙文**：工具描述是英文，但實際回傳的變數值、分類名稱照 INE 公開時的西班牙文原樣，不懂西班牙文的使用者或 agent 要自己處理翻譯。
- 專案標著「Work in progress」，README 的免責聲明寫明以「as is」提供、INE 不為使用造成的損害負責；2026-11-26 才發佈，雖然兩天內衝到 195 星，但還沒有外部使用者回報過坑，正式環境導入前建議先用自己會查的統計項目跑過一輪。

## 今日收穫

把一個官方統計局推出自己的 MCP server這件事放進脈絡看，重點不只是「西班牙失業率查得到了」，而是資料的第一方——不是爬蟲、不是第三方包裝——親自決定要給 agent 看到什麼樣的介面。他們選的介面不是一個大而複雜的 `query(sql)` 工具，而是五個被強制排序的小工具，讓「這個變數值真的存在」這種事在呼叫流程中就被攔住，不用等到最後拿到一堆垂直座標名稱卻跟表格的實際欄位對不起來才發現錯了。這個「用狀態機卡住呼叫順序」的做法，對任何自家要包一個有依賴關係的多步驟 API 給 agent 用的人，都是可以直接抄的設計。

## 參考資料

- [es-ine/mcp — GitHub](https://github.com/es-ine/mcp)
- [es-ine/mcp — README](https://github.com/es-ine/mcp/blob/main/README.md)
- [Instituto Nacional de Estadística（INE）官網](https://www.ine.es)
- [INE JSON API 文件](https://www.ine.es/dyngs/DAB/index.htm?cid=1099)
- [Model Context Protocol](https://modelcontextprotocol.io)
