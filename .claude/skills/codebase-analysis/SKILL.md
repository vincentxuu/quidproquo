---
name: codebase-analysis
description: 追蹤一個本機 repo 的程式碼結構與實作邏輯——定位關鍵檔案、追資料流（入口→處理→儲存）、列相依與風險——產出附 `檔案:行號` 的分析報告。適用本 repo（quidproquo，Astro＋Cloudflare Workers）與 MaiAgent 三個 repo（maiagent-django／maiagent-admin-vue／maiagent-vue），目錄地圖在 references/。觸發：分析程式碼、看一下 code、trace code、API 怎麼實作、這個功能怎麼做、現有系統、目前架構、可行性評估。不用於研究第三方服務（service-teardown）或修 bug（diagnosing-bugs）。
---

# codebase-analysis skill

回答「這個功能在程式碼裡是怎麼跑的」：**定位 → 追資料流 → 列相依與風險 → 報告**。所有結論都要對到實際檔案與行號，找不到就寫「未找到」，不猜。

## 何時用

| 情境 | 用 | 不用 |
|---|---|---|
| 「RAG 查詢在這個站裡怎麼走的？」 | ✅ | |
| 「MaiAgent 的 AI Slide 編輯 API 怎麼實作？」 | ✅ | |
| 「做 X 功能要動哪些檔、成本多大？」 | ✅（可行性評估） | |
| 「Genspark 的 AI Edit 怎麼做的？」 | | ❌ 第三方服務 → service-teardown |
| 「這個 endpoint 為什麼回 500？」 | | ❌ 除錯 → diagnosing-bugs |
| 「幫我設計這個模組的介面」 | | ❌ → codebase-design |

## 執行步驟

### 0. 選 repo、確認基準

- 對照 `references/` 找目標 repo 的目錄地圖；沒有地圖的 repo 先用 `ls`／`git ls-files | head` 自己畫一份放進報告。
- 記下分析當下的 branch 與 commit（`git -C <repo> log -1 --oneline`），寫進報告開頭。**不要自行 checkout 或 pull**——工作樹可能有別人進行中的變更；要看 `develop`／`main` 最新版就用 `git -C <repo> show origin/<branch>:<path>` 或 `git worktree`。

### 1. 定位關鍵檔案

用字界比對搜尋（`grep -rnw`／Grep 工具），先找入口再找定義：
- 路由／URL → handler／view → model／schema → 外部服務呼叫。
- 前端：頁面 → API 封裝 → store／state。
- 搜尋詞從使用者說的功能名、UI 文字、API 路徑三個方向各試一次；命中要逐一判讀語境（`grep -i exa` 會命中 example）。

### 2. 追資料流

一條線寫到底：**入口（HTTP／cron／CLI／UI 事件）→ 處理（handler、service、task）→ 儲存／外呼（DB、KV、Vectorize、第三方 API）→ 回應**。
每一跳給 `檔案:行號`。非同步分支（Celery、Workers cron、queue）另列一條線。

### 3. 列相依與風險

- 相依：這段碼依賴哪些模組、feature flag、環境變數、binding。
- 風險：特殊邏輯、隱含假設、沒有測試的分支、與文件不一致處。
- 可行性評估時多加一節：要動的檔案清單＋粗估改動量＋需要先問的決策（schema、migration、flag）。

### 4. 報告

```markdown
## 分析結果：<功能>
基準：<repo> @ <branch> <commit>（YYYY-MM-DD）

### 關鍵檔案
- `path/to/file.ts:42` — 用途

### 資料流程
1. … `path:line`
2. …

### 相依性
- …

### 注意事項／風險
- …

### 未找到
- <找過哪裡、用什麼詞>
```

## 跟其他 skill 的關係

- `service-teardown`：L6 對照自家產品時呼叫本 skill 讀 MaiAgent 原始碼。
- `diagnosing-bugs`：本 skill 交代「正常時怎麼跑」，除錯迴圈交給它。
- `codebase-design`／`domain-modeling`：分析完要改介面或補 CONTEXT.md 時接手。
- `notion-spec-codebase-annex`：分析結果要回寫 Notion 時用它。

## 詳細參考

- `references/quidproquo-map.md`：本 repo（Astro 6 SSR＋Cloudflare Workers）的目錄地圖與速查表。
- `references/maiagent-map.md`：maiagent-django／admin-vue／vue 的目錄地圖、關鍵路徑模式、速查表。
