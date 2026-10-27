---
title: "工具推薦｜noteful-mcp — 讓 Agent 讀寫 iPad 手寫筆記 App Noteful"
date: 2026-10-28
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "MCP server 讓 agent 讀取 iPad 手寫筆記 app Noteful 的筆記內容,並寫回可編輯的手寫墨跡——不是純文字，也不是截圖"
tldr: "noteful-mcp 是一個 MCP server，讓 agent 讀寫 Noteful（iPad 手寫筆記 app）的筆記本，寫回去的是可編輯的手寫墨跡而非純文字或圖片。安裝：`claude mcp add -s user noteful -- uvx --from git+https://github.com/openninoor/noteful-mcp noteful-mcp`。解決了多數筆記類 MCP 工具只能讀純文字或唯讀截圖、沒辦法回寫可編輯手寫內容的問題。"
series:
  name: "AI Tool of the Day"
  order: 66
---

> 🌏 [English version](/posts/daily/2026-10-28-tool-noteful-mcp-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | noteful-mcp |
| 類型 | MCP server（stdio，Python） |
| GitHub | [openninoor/noteful-mcp](https://github.com/openninoor/noteful-mcp) |
| Stars | 13（2026-10-26 建立，標示 beta） |
| 語言 | Python（需 uv，含 Python 3.12+） |
| 授權 | MIT（內附字型另採 SIL Open Font License） |
| 安裝 | `claude mcp add -s user noteful -- uvx --from git+https://github.com/openninoor/noteful-mcp noteful-mcp` |

## 解決什麼問題

你在 iPad 上用 Noteful 做手寫筆記——上課畫重點、貼標籤、用螢光筆圈題目。這些內容對 agent 來說是一座孤島：OCR 類工具或許能把文字抓出來讓你搜尋，但沒有工具能把東西寫回筆記本裡，而且寫回去的如果是一張圖片或一段純文字，看起來就不像「你自己寫的」,也沒辦法疊在原本的頁面上繼續互動。

noteful-mcp 把 Noteful 的筆記本接進 MCP：讀的那一半，`render_page`、`search_text`、`page_marks` 能把頁面渲染成圖、搜尋 Noteful 自己索引出來的手寫與 PDF 文字、找出螢光筆與貼紙標記過的位置；寫的那一半才是真正的差異——`create_notebook`、`add_pages`、`write_on_page` 不是輸出截圖或貼一段文字,而是用一套帶顏色標記的 Markdown 語法（例如 `>> [coral] 收縮期 → 高壓：肌肉收縮 || [sky] 舒張期 → 低壓：心室回填`）畫出可編輯的手寫墨跡筆劃,連字型都走專案自己附的字型檔,寫出來的東西開在 Noteful 裡跟你手寫的頁面是同一種資料。沒有 Mac 的話,改成手動把 iPad 上的 `.noteful` 檔匯出到同步資料夾,讓 server 讀取；要連上即時的 Noteful for Mac library,才能做到 agent 寫完、你馬上在 iPad 上看到。

適合的場景是主動複習：你已經在筆記上畫了重點和標記,想請 agent 幫你把這些整理成考題、出完考卷你用手寫作答,再請 agent 批改並在同一頁上打勾打叉；也適合想研究「AI 寫進手寫格式」這條路線能做到什麼程度的人——它直接把限制（哪個平台能即時同步、什麼時候需要連外部圖像模型）攤開在 README 裡。

```diagram
title: 從找題目到批改作答的四步
desc: agent 先讀筆記上已經做好的標記找出要考的題目，寫出一份新的手寫考卷，你在 iPad 上作答，agent 再批改寫在卷子上的答案。
caption: 依 noteful-mcp README 的範例流程簡化；完整工具清單更長，這裡只取與這段練習直接相關的四個。
step: agent 讀筆記上已經做的標記，找出要考的題目
step: 把這些題目寫成一份新的、可編輯手寫墨跡考卷
step: 你在 iPad 上收到考卷，動手寫下作答——這一步不經過 agent
step: agent 批改你寫在卷子上的作答，加註記與分數
---
<svg viewBox="0 0 640 368">
  <circle class="dg-dot" cx="320" cy="8" r="6" data-step="1"/>
  <path class="dg-line" d="M320 14V24" marker-end="url(#arrow)" data-step="1"/>

  <g data-step="1">
    <rect class="dg-box" x="120" y="24" width="400" height="56" rx="6"/>
    <text class="dg-label" x="320" y="43" text-anchor="middle" dominant-baseline="central">page_marks</text>
    <text class="dg-sub" x="320" y="63" text-anchor="middle" dominant-baseline="central">找出筆記上螢光筆與貼紙標記過的題目</text>
  </g>

  <path class="dg-line" d="M320 80V112" marker-end="url(#arrow)" data-step="2"/>

  <g data-step="2">
    <rect class="dg-box dg-box--accent" x="120" y="112" width="400" height="56" rx="6"/>
    <text class="dg-label" x="320" y="131" text-anchor="middle" dominant-baseline="central">create_notebook</text>
    <text class="dg-sub" x="320" y="151" text-anchor="middle" dominant-baseline="central">寫成可編輯手寫墨跡的新考卷（不是截圖）</text>
  </g>

  <path class="dg-line dg-line--dashed" d="M320 168V200" marker-end="url(#arrow)" data-step="3"/>

  <g data-step="3">
    <rect class="dg-box dg-box--ghost" x="120" y="200" width="400" height="56" rx="6"/>
    <text class="dg-label" x="320" y="219" text-anchor="middle" dominant-baseline="central">你在 iPad 上手寫作答</text>
    <text class="dg-sub" x="320" y="239" text-anchor="middle" dominant-baseline="central">這一步在 Noteful 裡完成，不經過 agent</text>
  </g>

  <path class="dg-line dg-line--dashed" d="M320 256V288" marker-end="url(#arrow)" data-step="4"/>

  <g data-step="4">
    <rect class="dg-box" x="120" y="288" width="400" height="56" rx="6"/>
    <text class="dg-label" x="320" y="307" text-anchor="middle" dominant-baseline="central">write_on_page</text>
    <text class="dg-sub" x="320" y="327" text-anchor="middle" dominant-baseline="central">批改：加勾、打叉、圈記與分數</text>
  </g>
</svg>
```

## 快速上手

### 安裝

```bash
# 需要 uv（含自帶 Python，README 標示 3.12+）
claude mcp add -s user noteful -- uvx --from git+https://github.com/openninoor/noteful-mcp noteful-mcp

# 健康檢查：看目前環境能存取到哪些 Noteful 資料
uvx --from git+https://github.com/openninoor/noteful-mcp noteful-mcp doctor
```

有 Apple silicon Mac 且用同一個 Apple ID 登入 Noteful for Mac，才能讀即時的 library；否則把 iPad 上的 `.noteful` 檔匯出到一個會同步的資料夾，透過環境變數 `NOTEFUL_ROOTS` 指給 server。

### 基本用法

跟 agent 說，例如：

> 幫我看一下「心臟生理」那本筆記裡，我用螢光筆圈起來、還貼了標籤的題目，幫我出一份小考，用跟課堂筆記一樣的手寫風格。

agent 會依序呼叫 `page_marks` 找出標記過的段落、`create_notebook` 用帶顏色標記的 Markdown 寫出考卷：

```markdown
# 心臟生理 · 小考
>> [coral] 收縮期 → 高壓：肌肉 **收縮** || [sky] 舒張期 → 低壓：心室 **回填**
1. 收縮期時，哪一個心瓣會打開？
2. 畫出心臟電傳導系統的四個主要結構，依順序標號。
```

寫完的考卷會以可編輯墨跡開在 Noteful 裡，你直接在 iPad 上手寫作答，再請 agent 呼叫 `write_on_page` 批改、打分數。

### 進階用法（選填）

```bash
# 讓一個圖像模型先畫草圖，server 再把草圖重繪成 Noteful 墨跡
# 需要自己的 Google AI Studio key 或 Vertex AI 專案
export GEMINI_API_KEY="your-key"
```

`design_mockup` 先出一張頁面草圖，`mockup_grid` 疊上像素格方便標定位置，`design_page` 再依草圖畫出對應的手寫版面；README 寫明這一步只有頁面文字描述會送到 Google，其他內容不會離開你的電腦。

## 與現有工具的比較

| | noteful-mcp | goodnotes-mcp（withsivram） | Goodnotes 官方 remote MCP |
|---|---|---|---|
| 平台 | iPad app Noteful；Mac 讀即時 library，其他平台靠手動匯出 | macOS only（讀本機 SQLite） | 雲端 hosted endpoint，各平台 client 都能連 |
| 讀取 | 頁面渲染、OCR／PDF 文字搜尋、螢光筆與貼紙標記偵測 | GoodNotes OCR 文字搜尋（唯讀） | 官方文件未提供讀取既有筆記的工具 |
| 寫入 | 可編輯手寫墨跡（真實筆劃，非圖片） | 幾乎不寫，僅寫自己的處理狀態檔 | 格式化文字／互動 widget，不是手寫筆劃 |
| 是否需要雲端帳號 | 不需要；本機執行，mockup 選用才連 Google | 不需要 | 需要連到 Goodnotes 的雲端 MCP endpoint |
| 現況 | beta，個人專案，13 stars | 1 star，個人專案 | 官方維護 |

另一條常見的路是像 apple-notes-mcp 那樣，把搜尋範圍擴大到 Apple Notes 裡 OCR 出來的手寫文字——這解決的是「找得到」的問題，不是「寫得進去」；noteful-mcp 是目前少數真的在處理「回寫手寫本身」這一半的工具。

## 注意事項

- **beta，格式是逆向工程出來的**：README 自己寫「Noteful 的格式是逆向工程的」，代表 app 更新後可能某天讀寫就壞了，沒有官方 API 保證相容。
- **即時同步只在 Apple silicon Mac 上成立**：沒有 Mac（或用 Intel Mac／Windows／Linux）就只能手動從 iPad 匯出 `.noteful` 檔案，改完要重新匯出才會反映在 server 讀到的內容上，不是真的即時。
- **mockup 功能會把頁面文字描述送到 Google**：只有啟用 `design_mockup` 這條選用路徑時才會發生，README 說明「只有你描述的頁面內容會送出，其他什麼都不會」，但若你的筆記內容敏感，這條路徑本身就該避免啟用。
- **非官方專案**：README 聲明與 Noteful 官方無關、未獲授權，手寫排版風格也是參考某部第三方影片調整出來的，長期維護性未知。

## 今日收穫

多數「AI 接上筆記」的整合卡在同一個地方：讀取端做得到 OCR 轉文字,但寫入端頂多是丟一段純文字或一張渲染圖回去，看起來就不是「你自己寫的那本筆記」。noteful-mcp 選的是比較難的那條路——把寫入也做成真正可編輯的手寫墨跡筆劃，而不是一張圖片假裝成手寫。這讓 agent 從「幫你讀筆記、生成文字答案」變成「可以直接在你的筆記本上動筆」，兩者中間差的不是功能多寡，而是輸出的東西是不是能被你接著繼續手寫、繼續編輯的同一份資料。

## 參考資料

- [openninoor/noteful-mcp — GitHub](https://github.com/openninoor/noteful-mcp)
- [noteful-mcp README（raw）](https://raw.githubusercontent.com/openninoor/noteful-mcp/main/README.md)
- [withsivram/goodnotes-mcp — GitHub（比較對象，唯讀）](https://github.com/withsivram/goodnotes-mcp)
- [Goodnotes 官方 Remote MCP Server — mcpservers.org（比較對象）](https://mcpservers.org/remote-mcp-servers/goodnotes)
- [xiaofeng-han/apple-notes-mcp — GitHub（提及的 OCR 搜尋路線）](https://github.com/xiaofeng-han/apple-notes-mcp)
