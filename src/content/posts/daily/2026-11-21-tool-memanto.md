---
title: "工具推薦｜Memanto — 寫入不燒 LLM token 的 Agent 記憶，專治多 Agent 互相矛盾"
date: 2026-11-21
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "Memanto 是開源的記憶 agent：remember 寫入不呼叫 LLM、不建向量索引就能即時檢索，內建跨 agent 矛盾偵測與到期政策，今天上線免安裝的 Memanto Cloud"
tldr: "Memanto 是一個開源 agent 記憶系統，pip install memanto 五分鐘可跑，支援 MCP 與 38 種整合。解決了多個 agent 各自記憶、彼此矛盾卻沒人發現的問題。"
series:
  name: "AI Tool of the Day"
  order: 85
---

> :globe: [English version](/posts/daily/2026-11-21-tool-memanto-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | Memanto |
| 類型 | CLI + SDK（Python/TS/Go）+ MCP server |
| GitHub | [moorcheh-ai/memanto](https://github.com/moorcheh-ai/memanto) |
| Stars | 2.4k（查核時 GitHub 頁面顯示為 2.4k，無法取得精確整數；forks 743） |
| 語言 | Python（核心與 CLI），TypeScript／Go 為官方 SDK |
| 授權 | MIT |
| 安裝 | `pip install memanto` |

## 解決什麼問題

你幫同一個專案接了好幾個 agent——Claude Code 寫後端、Cursor 改前端、Codex 跑重構——結果三個月後發現，其中兩個 agent 對「我們用哪個資料庫」這件事有完全不同的答案：一個記得三月定的 Postgres，另一個記得上週才改成 MongoDB，誰都不知道對方記的是舊的。多數記憶工具只負責「存」，不負責「這兩筆互相矛盾，你要不要看一下」。

Memanto 把自己定位成「記憶 agent」而不是「記憶 API」：`remember` 寫入時不呼叫任何 LLM 做抽取，也不用建向量索引，寫完立刻可被任何 agent 檢索到；底層跑的是作者自家的 Moorcheh 檢索引擎（把 embedding 壓縮成二進位再做資訊理論式排序，不是最近鄰向量搜尋），同一個查詢每次回傳結果都一樣，方便除錯。每筆記憶都有型別（決策、偏好、事實、失敗經驗……13 種）、信心分數、來源與時間戳；當新資訊和舊的衝突，Memanto 不是直接覆蓋，而是讓新的「取代」舊的但保留歷史版本，並把跨 agent 的矛盾標記出來等你人工確認。到期也是規則驅動：你寫一份 YAML policy 決定哪種型別記憶該在幾天後退休，退休的記憶會被標記但仍可還原，不是直接刪掉。

```diagram
title: 兩個 agent 寫入矛盾記憶，Memanto 標記待審
desc: Agent A 先記下「用 Postgres」，Agent B 後來記下「用 MongoDB」；Memanto 偵測到兩者矛盾並標記待審，之後 Agent B 查詢時會同時拿到目前版本和矛盾紀錄。
step: Agent A 寫入「用 Postgres」
step: Memanto 回覆寫入完成
step: Agent B 寫入「用 MongoDB」
step: Memanto 偵測到矛盾，標記待審
step: Agent B 查詢「資料庫用哪個」
step: Memanto 回傳目前版本與矛盾紀錄
---
<svg viewBox="0 0 640 420">
  <line class="dg-rule" x1="96" y1="72" x2="96" y2="380"/>
  <line class="dg-rule" x1="320" y1="72" x2="320" y2="380"/>
  <line class="dg-rule" x1="544" y1="72" x2="544" y2="380"/>

  <g data-step="1">
    <path class="dg-line" d="M96 120H312" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="208" y="108" text-anchor="middle" dominant-baseline="central">remember：用 Postgres</text>
  </g>
  <g data-step="2">
    <path class="dg-line dg-line--dashed" d="M316 164H100" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="208" y="152" text-anchor="middle" dominant-baseline="central">寫入完成（cp-1）</text>
  </g>
  <g data-step="3">
    <path class="dg-line" d="M540 208H328" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="434" y="196" text-anchor="middle" dominant-baseline="central">remember：用 MongoDB</text>
  </g>
  <g data-step="4">
    <path class="dg-line dg-line--warn dg-line--dashed" d="M324 252H536" marker-end="url(#arrow-warn)"/>
    <text class="dg-edge dg-text--warn" x="430" y="240" text-anchor="middle" dominant-baseline="central">偵測到矛盾，標記待審</text>
  </g>
  <g data-step="5">
    <path class="dg-line" d="M540 296H328" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="434" y="284" text-anchor="middle" dominant-baseline="central">recall：資料庫用哪個</text>
  </g>
  <g data-step="6">
    <path class="dg-line dg-line--accent dg-line--dashed" d="M324 340H536" marker-end="url(#arrow-accent)"/>
    <text class="dg-edge dg-text--accent" x="430" y="328" text-anchor="middle" dominant-baseline="central">回傳 MongoDB + 矛盾紀錄</text>
  </g>

  <rect class="dg-box" x="316" y="108" width="8" height="68" rx="2" data-step="1 2"/>
  <rect class="dg-box" x="316" y="196" width="8" height="68" rx="2" data-step="3 4"/>
  <rect class="dg-box" x="316" y="284" width="8" height="68" rx="2" data-step="5 6"/>

  <rect class="dg-box" x="32" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="96" y="48" text-anchor="middle" dominant-baseline="central">Agent A</text>
  <rect class="dg-box dg-box--accent" x="256" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="320" y="48" text-anchor="middle" dominant-baseline="central">Memanto</text>
  <rect class="dg-box" x="480" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="544" y="48" text-anchor="middle" dominant-baseline="central">Agent B</text>
</svg>
```

適合場景：同一個專案同時掛了多個 coding agent，需要共用一份「現在是真的」的知識；需要把 agent 做過的決策、踩過的坑整理成可稽核的記憶流水帳，而不是信任 agent 自己口述過去；或者想把記憶從某個平台（Mem0、Letta、Supermemory 等）搬到另一個，又不想重新打一輪資料。

## 快速上手

### 安裝

免安裝、託管版（今天上線的 Memanto Cloud，瀏覽器登入即可，不用 Docker）：

```bash
pip install memanto
memanto login      # 瀏覽器授權，不用複製貼上 API key
memanto connect    # 選要接的工具：claude-code、cursor、codex... 共 15+ 種
```

完全地端、資料不出機器（需要 Docker + Ollama）：

```bash
pip install memanto
memanto            # 互動選單選「Memanto local」→「on-prem」
```

接上 MCP（任何 MCP 相容客戶端一行設定）：

```bash
pip install memanto-mcp
```

```json
{
  "mcpServers": {
    "memanto": {
      "command": "memanto-mcp",
      "env": {
        "MOORCHEH_API_KEY": "mch_xxxxxxxxxxxxxxxxxx",
        "MEMANTO_DEFAULT_AGENT_ID": "my-assistant"
      }
    }
  }
}
```

`MOORCHEH_API_KEY` 可在 [console.moorcheh.ai](https://console.moorcheh.ai/api-keys) 免費申請，免費額度每月 10 萬次操作，不用卡號。

### 基本用法

```bash
# 週一：backend agent 學到一件事
memanto remember "Auth migrated to JWT — session cookies deprecated" --type decision

# 週五：review agent 從沒看過那個 session，但已經知道
memanto recall "how does auth work"
memanto answer "why did we drop session cookies?"   # 從記憶裡找證據回答
```

MCP 介面則對應 7 個預設開放的工具：`remember`、`batch_remember`、`recall`、`recall_recent`、`recall_as_of`、`recall_changed_since`、`answer`。

### 進階用法

查某個時間點「當時」agent 相信什麼，以及這段時間改了什麼：

```bash
memanto recall "deployment policy" --as-of 2026-10-01
memanto recall "deployment policy" --changed-since "last 7 days"
```

寫自己的到期政策（存在 `~/.memanto/policies/<agent>.yaml`）：

```yaml
retention:
  context: 7d
  event: 30d
  preference: never          # 使用者偏好這類持久事實不過期
rules:
  - name: low-confidence-guesses
    match: {provenance: [inferred], confidence_below: 0.5}
    expire_after: 14d
```

## 與現有工具的比較

| | Memanto | Mem0（agentic 流程） | 手寫在 CLAUDE.md / AGENTS.md |
|---|---|---|---|
| 寫入時呼叫 LLM | 不呼叫 | 呼叫（抽取實體/建圖） | 不適用 |
| 寫完多久可被檢索 | 立刻 | 需等索引（README 實測約 48 分鐘） | 立刻（但是純文字，agent 要自己判斷真假） |
| 跨 agent 矛盾偵測 | 有，自動標記待審 | 無內建機制 | 無，全靠人工發現 |
| 到期 / 過時記憶清理 | 政策驅動，可還原 | 需自行實作 | 檔案只會越長 |
| 完全地端跑 | 可以（Docker + Ollama） | 視部署方式 | 本來就是本機檔案 |
| MCP 原生支援 | 有（`memanto-mcp`，7+4 個工具） | 需另接 | 不適用 |

## 注意事項

- **雲端模式仍要一支 Moorcheh API key**：免費額度每月 10 萬次操作，超過要付費；只有選「Memanto local + on-prem」才完全不需要任何 key、資料也不出機器。
- **README 自己揭露的 benchmark 限制**：作者在文件裡坦白寫「不同專案發布的分數不能直接比較，讀者模型、裁判模型、裁判 prompt 都會讓結果跑掉幾個百分點」，也公開列出自己在對抗性測試套件裡輸給 Mem0 的項目（放進更多過時/被污染的記錄到檢索結果前段）；把這些數字當方向參考，不要當絕對值。
- **和專案既有的 `CLAUDE.md`/`AGENTS.md` 記憶慣例會重疊**：導入前先想清楚哪一個是 single source of truth，不然等於多了一套要同步的記憶來源。
- **Admin 工具預設關閉，開啟前想清楚**：MCP server 預設只開放讀寫記憶的 7 個工具，`create_agent`/`delete_agent` 這類管理工具要手動設 `MEMANTO_EXPOSE_ADMIN=true` 才會出現，避免 agent 誤刪掉別的 agent 的記憶空間。

## 今日收穫

多數 agent 記憶工具在優化「怎麼存、怎麼搜」，Memanto 的切入點是「怎麼知道哪筆記憶現在才是對的」——在單一 agent、單一 session 的場景下，檢索準確率確實是主要瓶頸；但一旦變成多個 agent 共用一份記憶，版本化與矛盾偵測的重要性會超過單純的搜尋精準度，這也是為什麼它在「同一件事情被反覆修正」的時序測試集上，領先得比一般檢索準確率測試明顯更多。

## 參考資料

- [moorcheh-ai/memanto — GitHub](https://github.com/moorcheh-ai/memanto)
- [Memanto README（原始檔）](https://raw.githubusercontent.com/moorcheh-ai/memanto/main/README.md)
- [memanto-mcp 整合文件（原始檔）](https://raw.githubusercontent.com/moorcheh-ai/memanto/main/integrations/mcp/README.md)
- [Memanto: Typed Semantic Memory with Information-Theoretic Retrieval for Long-Horizon Agents（arXiv）](https://arxiv.org/abs/2604.22085)
- [Memanto by Moorcheh — Product Hunt](https://producthunt.com/products/memanto-by-moorcheh)
- [Model Context Protocol 官方文件](https://modelcontextprotocol.io)
