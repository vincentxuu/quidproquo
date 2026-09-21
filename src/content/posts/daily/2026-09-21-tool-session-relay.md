---
title: "工具推薦｜SessionRelay — 讓 AI 編程會話記憶跨工具、跨人交接"
date: 2026-09-21
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "本地優先的 MIT 授權 MCP server，把 Claude Code、Codex、Qoder、ZCode 等工具的完整對話記憶統一收進一份可查詢資料庫，並能打包成交接包讓接手的人立刻取得上下文"
tldr: "SessionRelay 是本地優先的 AI 編程會話記憶層，透過 MCP server 讓 Agent 查詢跨工具、跨會話的完整對話紀錄。安裝：npx @ewanjasper/sessionrelay init。解決了換 AI 工具、換會話、換人接手時，之前討論的決策與脈絡就消失的問題。"
series:
  name: "AI Tool of the Day"
  order: 35
---

> 🌏 [English version](/en/posts/daily/2026-09-21-tool-session-relay-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | SessionRelay（會話接力） |
| 類型 | MCP server |
| GitHub | [EwanJasper/SessionRelay](https://github.com/EwanJasper/SessionRelay) |
| Stars | 2（新專案，2026-08-28 建立） |
| 語言 | TypeScript |
| 授權 | MIT |
| 安裝 | `npx @ewanjasper/sessionrelay init` |

## 解決什麼問題

你跟 AI 討論一個方案討論了三天，中間開了好幾個新 session，也可能中途從 Claude Code 換到 Codex 或別的工具繼續聊。新開一個 session 問「上週討論的資料庫選型？」，AI 完全不記得——它只看得到當前這個 session 的上下文，之前的推理過程、被否決的方案、最後拍板的理由全部隨著關窗消失。如果專案要交接給別人，接手的人往往只能翻 commit 訊息和程式碼猜脈絡，AI 也幫不上忙。

SessionRelay 是一個跑在本機的守護行程，被動監看 Claude Code、Codex、Qoder、ZCode 留下的會話紀錄（Trae 因為 AI 回覆端到端加密，只能採到使用者提問那一半），統一寫進一份本機 SQLite 資料庫。ZCode 會在 context 壓縮時直接物理刪除舊訊息，這也是 SessionRelay 需要守護行程每 30 秒同步一次的原因——晚一步同步，被刪掉的原文就永久救不回來。每個會話會經過 `active → pending_end → confirmed` 兩階段判定才固化並抽取決策、話題、摘要；已固化的內容在追加新訊息時仍會自動回滾重算，避免記憶碎片化。任何支援 MCP 的 Agent 接上後，就能呼叫 `search_sessions`、`get_decisions`、`get_file_history` 等 16 個工具直接查歷史，而且每筆結果都強制帶出處（會話 ID、來源 agent、日期、訊息序號），不是壓縮後的模糊摘要。需要交接時可以匯出成 `.hop` 交接包（開放格式，MIT 授權，sha256 逐檔校驗、預設密鑰脫敏、匯入預設隔離正文），接手的人 `srelay import` 之後，AI 立刻能回答「為什麼當初選 PostgreSQL」。

適合場景：長期迭代、多 session 斷續開發的專案；團隊內需要在 Claude Code、Codex 等不同工具間切換但不想失憶；專案交接或新人 onboarding，想讓 AI 直接把決策脈絡講給接手的人聽。

## 快速上手

### 安裝

```bash
# 需要 Node >= 22

# 方式一：npm 全域安裝（推薦）
npm install -g @ewanjasper/sessionrelay

# 方式二：零安裝試用
npx @ewanjasper/sessionrelay init

# 方式三：從源碼
git clone https://github.com/EwanJasper/SessionRelay.git
cd SessionRelay && npm install && npm run build && npm link
```

### 基本用法

```bash
cd 你的專案
srelay init                    # 初始化 + 回填近 30 天對話
srelay sync --backfill all     # 或全量回填所有歷史紀錄

srelay search 資料庫選型 --json  # 中文全文檢索（jieba 分詞 + FTS5）
srelay decisions                # 列出所有已確認決策，附出處
srelay history src/db/          # 這個檔案被哪些會話討論過
srelay watch --install-service  # 常駐守護行程，自動同步

# 接上 Claude Code
claude mcp add sessionrelay --scope user -- srelay serve
```

### 進階用法

```json
// .mcp.json：任何 MCP 客戶端通用接法，繞過 PATH / 工作目錄偵測問題
{
  "mcpServers": {
    "sessionrelay": {
      "command": "node",
      "args": ["/你的安裝路徑/SessionRelay/dist/srelay.js", "serve"],
      "env": { "SRELAY_PROJECT_ROOT": "/你的專案路徑" }
    }
  }
}
```

接上後開新對話問 AI「我們之前為什麼決定用 PostgreSQL？」，正確的行為是 AI 呼叫 `get_decisions` 或 `search_sessions`，回答帶出處；若它說不知道，代表 MCP 沒接通，跑 `srelay doctor` 檢查。

## 與現有工具的比較

| | SessionRelay | claude-mem | Mem0 |
|---|---|---|---|
| 儲存粒度 | 完整會話，原文可回跳 | AI 壓縮後的觀察片段 | 向量化的事實／偏好片段 |
| 本地優先、零雲端依賴 | ✅ | 依外部儲存設定而定 | 預設走雲端 API，自架需另配 embedder／向量庫 |
| 跨 Agent 工具通用 | ✅ 五源 adapter（Claude Code／Codex／Qoder／ZCode／Trae 部分），另有自訂 adapter SDK | 主打 Claude Code，另列出對 Codex／Gemini 等工具的支援 | 需自行在每個 Agent 裡呼叫 `memory.add()` / `memory.search()` |
| 中文全文檢索 | ✅ jieba 分詞 + SQLite FTS5，可選本地語意檢索 | 依模型摘要品質而定，無中文分詞特化 | 依 embedding 模型而定，無中文分詞特化 |
| 團隊交接匯出包 | ✅ `.hop` 協議，sha256 校驗 + 預設密鑰脫敏 | 無對應機制 | 無對應機制 |
| 刪除權限 | 僅使用者可執行 `forget`，MCP 工具無刪除能力 | 未見公開的權限分離設計 | 由呼叫端應用邏輯自行控制 |

## 注意事項

- **規則式抽取精度約 60–70%**：決策與話題是用規則從對話抽取，不是 LLM 二次摘要，準確度有限；README 誠實列出這點，並靠「出處塊」讓你逐條回跳原文核驗。
- **守護行程是必要條件，不是選配**：README 明確提到 ZCode 在 context 壓縮時會物理刪除舊訊息（實測一次 500 條會話壓縮後刪掉 3976 條），沒開 `srelay watch`，壓縮發生在下次手動 sync 之前的訊息就永久遺失。
- **專案還很新**：2026-08-28 才建立，目前 2 顆 star、0 個 fork，issue 數為 0（尚未被廣泛使用驗證），採用前建議先在非關鍵專案試跑，並留意後續版本是否有破壞性變更。

## 今日收穫

大多數「AI 記憶」工具解的是「怎麼把舊對話塞進下一次的 context」，SessionRelay 解的是另一個更少人談的問題：記憶要怎麼在「人」之間交接。`.hop` 交接包把記憶做成一個可以脫敏、可以校驗、可以審計的檔案格式，而不是留在某個工具的私有資料庫裡——這讓「AI 幫忙做交接」第一次變得像正常的工程資產一樣可以版本化、可以審查。

## 參考資料

- [EwanJasper/SessionRelay — GitHub](https://github.com/EwanJasper/SessionRelay)
- [SessionRelay GitHub API metadata（license／stars／建立時間）](https://api.github.com/repos/EwanJasper/SessionRelay)
- [@ewanjasper/sessionrelay — npm registry](https://www.npmjs.com/package/@ewanjasper/sessionrelay)
- [thedotmack/claude-mem — GitHub](https://github.com/thedotmack/claude-mem)
- [mem0ai/mem0 — GitHub](https://github.com/mem0ai/mem0)
- [Mem0 Open Source Overview（embedder／vector store 設定）](https://docs.mem0.ai/open-source/overview)
