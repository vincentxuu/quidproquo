---
title: "Screenpipe 怎麼給 Agent 螢幕記憶：擷取、MCP、Pipes 與授權隱私取捨"
date: 2026-10-24
category: ai
type: deep-dive
tags: [screenpipe, agent-memory, mcp, context-engineering, ai-agent, privacy]
lang: zh-TW
tldr: "Screenpipe 在本機持續擷取螢幕與音訊，存進 SQLite，再透過 MCP 與 localhost API 讓 agent 查「你剛剛做了什麼」。它不是開源而是 source-available，商用要另外授權，預設還會送出使用分析。"
description: "介紹 Screenpipe 的事件驅動擷取、SQLite 儲存、MCP 與 Pipes 排程 agent，以及導入前要先看的授權、遙測與權限範圍。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-10-24-screenpipe-local-screen-memory-en)

你的 agent 不知道你剛才在看什麼文件、開了哪個會議、複製過哪段程式碼。[Screenpipe](https://github.com/screenpipe/screenpipe) 的做法是讓電腦自己記下來：在本機持續擷取螢幕與音訊，存進 SQLite，再讓 Claude、Cursor 這類工具透過 MCP 查詢。這篇說明它怎麼運作、怎麼接上 agent，以及在你把它裝上去之前要先看清楚的三件事：授權、預設的遙測、權限能管到哪裡。

## 是什麼

Screenpipe 是用 Rust 寫的桌面應用，支援 macOS、Windows 與 Linux，公司是 Negentropy Labs（YC S26）。它的 README 現在的主訴求是「記錄公司電腦上的工作、找出值得自動化的流程、提供 agent 的上下文」，同時也列出個人開發者與知識工作者的用法。

它解決的是 agent 記憶裡很具體的一塊：**你在電腦上的操作歷史**。這跟對話記憶不同。對話記憶記的是你跟模型說過什麼，Screenpipe 記的是你在所有應用程式裡看到、聽到、打過什麼。如果你還在釐清這兩種記憶的差別，可以先看[Agent 記憶工程系列入門](/posts/ai/2026-09-19-agent-memory-engineering-series-intro)。

## 給誰、先備知識

適合想讓 coding agent 或聊天助手知道「我剛才在做什麼」的個人開發者，以及想自動產出每日摘要、站會報告、時間記錄的人。需要會用命令列，也要對 MCP 有基本概念。

不適合在不能錄螢幕的環境工作的人，也不適合需要把它裝進公司電腦卻還沒看過授權條款的人。這兩點在後面的限制一節。

## 內容地圖

整個系統是一條單向的管線，每一段都有明確的出口：

| 階段 | 做什麼 | 細節 |
|---|---|---|
| 擷取 | 事件觸發時截圖 | 切換應用程式、視窗取得焦點、點擊或捲動、打字停頓、複製到剪貼簿都會觸發；畫面沒動時約每 5 秒補拍一次 |
| 文字抽取 | 讀取畫面上的字 | 優先走作業系統的 accessibility tree（按鈕、標籤、輸入框的結構化文字）；抽不到時才退到 OCR（macOS 用 Apple Vision，Windows 用系統內建，Linux 用 Tesseract） |
| 音訊 | 麥克風與系統音訊 | 預設每 30 秒一段，用本機的 Whisper 轉文字，也可改用雲端的 Deepgram；有說話者辨識 |
| 儲存 | 全部寫在本機 | `~/.screenpipe/db.sqlite` 放文字與索引（含 FTS5 全文檢索），截圖與音訊放在 `~/.screenpipe/data/` |
| 對外介面 | REST 與 MCP | `localhost:3030` 的 REST API，包含 `/search` 和 `/raw_sql`；MCP server 讓 agent 直接查 |
| 排程 | Pipes | 一個 `pipe.md` 檔就是一個定時執行的 agent |

用事件觸發取代固定幀率，是這個設計的重點。畫面沒有變化就不存，所以儲存和 CPU 成本比連續錄影低；官方估計 CPU 佔用約 5% 到 20%，RAM 與儲存量隨設定和活動而異，建議自己量一天。

官方 App 現在把 Pipes 叫做 Scheduled tasks，但 CLI 指令、API 路徑和設定檔仍是 `pipe` 與 `pipe.md`，查文件時兩個名字都會看到。

## 一個具體範例

先裝起來，再接上 Claude Code：

```bash
npx screenpipe record
claude mcp add screenpipe -- npx -y screenpipe-mcp@latest
```

接著直接問 `what did i see in the last 5 mins?`。要看原始資料，可以直接打本機 API：

```bash
export SCREENPIPE_LOCAL_API_KEY="$(npx -y screenpipe@latest auth token)"

curl -H "Authorization: Bearer $SCREENPIPE_LOCAL_API_KEY" \
  "http://localhost:3030/search?q=budget&content_type=audio&limit=10"
```

再來是定時任務。下面這個 `pipe.md` 改寫自官方的站會與時間報告範例，每天產出一份草稿，而且只給讀取權限：

```markdown
---
schedule: daily
enabled: false
permissions: reader
---

用 context header 給的時間範圍，從 /search 與 /activity-summary 整理昨天的工作：
做了什麼、接下來做什麼、卡在哪裡。
寫到 ./output/<date>.md。不要寄出、不要更新任何外部服務。
```

`enabled: false` 是故意的：先用 `npx -y screenpipe@latest pipe run <名稱>` 手動跑一次，看輸出對不對，再打開排程。

## 限制

**授權不是開源。** README 自稱 source-available，LICENSE 是 Screenpipe Commercial License。個人非商業、非營利／教育／研究用途可以免費使用，另有 7 天的評估期。商用的規定很直接：

> Any Commercial Use of the Licensed Work, including source code you modify and binaries you or a third party compile from source, requires a paid Screenpipe Enterprise plan.

官方安裝檔走另一份服務條款：同一家公司最多 4 人各自持有個人授權，5 人以上要 Team 或 Enterprise。LICENSE 末尾註明，先前以 MIT 釋出的舊版本仍維持 MIT。要在公司導入，請讀完 LICENSE.md 和服務條款，不要只看 repo 的星數。

**「本機優先」不等於完全不外送。** 截圖、音訊、轉錄和索引預設留在本機，但 README 的 FAQ 說明桌面 App 預設開啟 PostHog 使用分析和 Sentry 錯誤回報；雲端轉錄、雲端 AI、同步和各種整合，會把該功能需要的資料送到對應的服務。想完全在本機跑，要在 Settings → Privacy → Analytics 關掉分析，並選本機轉錄加上 Ollama 這類本機模型。

**權限只管得到 Screenpipe 的 API。** Pipes 預設有完整 API 存取權。加上 `permissions: reader` 或自訂 `allow`、`deny` 規則（可限制應用程式、視窗、內容類型與 API 路徑，deny 優先）能收窄範圍，但官方文件也寫明這不會把 agent 的其他工具關進沙盒。README 寫的欄位名稱（`allow-apps`、`deny-windows` 等）和文件頁的 `permissions` 語法並不一致，實際請看你安裝版本的文件。

**螢幕上的內容會變成 agent 的輸入。** 網頁、訊息或文件裡的惡意指令，有機會影響一個有寫入權限的 pipe。所以只需要讀取的任務一律用 `reader`，寫入類動作另外審核。相關的授權設計見[AI 安全系列的工具授權篇](/posts/ai/2026-10-22-ai-security-tool-authorization)與 [MCP 信任篇](/posts/ai/2026-10-22-ai-security-mcp-trust)。

**主分支變動很快。** README 直接寫明 main 分支「moving fast and breaking things」，要穩定版請用 releases；正式 App 的部分功能在付費方案裡。

**企業部署的資料路徑不同。** 組織管理的共用儲存、同步和匯出，可能讓有權限的管理員看到擷取內容。導入前要先談清楚儲存位置、存取範圍和保留期限，並讓員工知情。

## 怎麼用

1. **先決定資料能去哪裡。** 在 Settings 關掉 Analytics，選本機轉錄與本機模型。需要雲端功能時，只開一項，確認它送出什麼。
2. **先限縮擷取範圍。** README 列有 app 與視窗過濾，先把密碼管理器、網銀、私人通訊軟體排除，再開始錄。
3. **用 MCP 驗證價值。** 接上 Claude Code，連問三天「我昨天在 X 上做了什麼」。答案對你沒用，就不必再進到 Pipes。
4. **Pipes 從 `reader` 開始。** 手動跑一次、看輸出、再開排程；要讓它寫檔或呼叫外部服務時，再單獨提高權限。
5. **量你自己的一天。** 記下 CPU、RAM 和 `~/.screenpipe` 的大小，用來決定保留多久。
6. **公司使用先看授權。** 超過個人非商業範圍，先聯絡官方，再裝。

## 參考資料

- [screenpipe/screenpipe（README）](https://github.com/screenpipe/screenpipe)
- [LICENSE.md：Screenpipe Commercial License](https://github.com/screenpipe/screenpipe/blob/main/LICENSE.md)
- [Screenpipe architecture（官方文件）](https://docs.screenpi.pe/architecture)
- [Build and manage scheduled tasks（官方文件）](https://docs.screenpi.pe/pipes)
- [Agent 記憶工程系列入門](/posts/ai/2026-09-19-agent-memory-engineering-series-intro)
- [AI 安全：工具授權](/posts/ai/2026-10-22-ai-security-tool-authorization)
- [AI 安全：MCP 信任](/posts/ai/2026-10-22-ai-security-mcp-trust)
