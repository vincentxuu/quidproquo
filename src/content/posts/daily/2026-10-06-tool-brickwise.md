---
title: "工具推薦｜Brickwise — 讓 AI 助手別再用舊版 Roblox API 唬你"
date: 2026-10-06
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "開源 MCP server，把 DevForum 討論串和官方文件整理成帶來源的 Roblox 開發知識庫，讓 Claude Code、Cursor 查完再寫，不用訓練資料裡過時的 API"
tldr: "Brickwise（roblox-logics-mcp）是一個開源 MCP server，把 Roblox 開發的常見坑整理成帶來源連結的知識庫給 AI 助手查。安裝：`git clone` + `npm install && npm run build`，`claude mcp add` 接上。解決了 AI 助手用訓練資料裡過時的 Roblox API（例如還在寫 `PhysicsService` 而不是 `WorldRoot`）寫出會壞掉的程式碼的問題。"
series:
  name: "AI Tool of the Day"
  order: 46
---

> 🌏 [English version](/posts/daily/2026-10-06-tool-brickwise-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | Brickwise（repo 名稱 roblox-logics-mcp） |
| 類型 | MCP server |
| GitHub | [EL4CTEO/roblox-logics-mcp](https://github.com/EL4CTEO/roblox-logics-mcp) |
| Stars | 1（2026-10-05 在 Roblox DevForum 公開發布） |
| 語言 | TypeScript |
| 授權 | 程式碼 MIT；內容為社群來源整理，附連結回原始出處 |
| 安裝 | `git clone` + `npm install && npm run build`，再用 `claude mcp add` 接上 |

## 解決什麼問題

你叫 Claude Code 或 Cursor 幫你寫一段 Roblox 存檔或碰撞偵測的程式碼，它多半會給你一段看起來很合理、實際上已經過時的 API——比如還在呼叫 `PhysicsService` 設定碰撞群組，但 Roblox 早就把這個介面搬到 `WorldRoot`；或是直接 `Humanoid.Health = 0`，完全忘了 `ForceField` 只擋 `TakeDamage`，不擋直接改血量。這些坑分散在 DevForum 的討論串和 Creator Docs 的某個角落，訓練資料截止時間之後的變動，AI 助手根本沒看過。

Brickwise 做的事很直接：把這些坑整理成一份一份帶來源連結的「logic」文件，透過 MCP 開給 AI 助手查。助手先用 `search_logics` 查關鍵字拿到一行摘要（便宜），覺得相關才用 `get_logic` 把完整寫法、常見錯誤和原始連結讀進來（貴，但只付一次）。免費版涵蓋資料存取、連線安全、戰鬥、課金、UI/UX、NPC、效能等 8 個核心分類、50 篇；更完整的 600+ 篇、19 分類版本是 €7 一次性付費、架在雲端不用自己裝。

適合場景：用 AI 助手開發 Roblox 遊戲，尤其是會踩到「課金道具在玩家加入前就能擁有」「`OrderedDataStore` 沒法清空只能換名字輪替」這類引擎細節陷阱的人。如果你不寫 Roblox/Luau，這工具完全用不到。

## 快速上手

### 安裝

```bash
git clone https://github.com/EL4CTEO/roblox-logics-mcp.git
cd roblox-logics-mcp
npm install
npm run build

# 註冊到 Claude Code
claude mcp add roblox-logics -- node /absolute/path/to/roblox-logics-mcp/dist/index.js
```

Cursor、Claude Desktop 等其他 client 改用設定檔接線：

```json
{
  "mcpServers": {
    "roblox-logics": {
      "command": "node",
      "args": ["/absolute/path/to/roblox-logics-mcp/dist/index.js"]
    }
  }
}
```

### 基本用法

接上之後 AI 助手會多六個工具，直接用自然語言問就會觸發：

```
你：「怎麼存玩家資料又不會弄丟道具？」

助手依序呼叫：
1. search_logics("save player data without losing items")
   → 拿到幾個一行摘要，排序後挑最相關的
2. get_logic("data-persistence/orderedstore-save-retry")
   → 讀完整寫法：UpdateAsync 的重試邏輯、常見錯誤、DevForum 原始連結
3. 根據讀到的內容生成程式碼，附上來源給你自己核對
```

### 進階用法

```
# 用 API 名稱直接找相關 logic，不用自己想關鍵字怎麼問
search_code("UpdateAsync")

# 找同一個系統裡相鄰的其他坑（例如存檔之外的連線安全檢查）
find_related("data-persistence/orderedstore-save-retry")
```

## 與現有工具的比較

| | Brickwise | 直接問 AI 助手 | 自己查 DevForum / Creator Docs |
|---|---|---|---|
| 反映 2026 年的 API 變動 | ✅ | ❌ 卡在訓練資料截止時間 | ✅ |
| 附原始出處可核對 | ✅ | ❌ 經常編得很像真的 | ✅（本來就是原始出處） |
| 查詢成本 | 先讀摘要，命中才讀全文 | 免費但可能錯 | 自己花時間搜尋、閱讀、篩選 |
| 覆蓋範圍 | 免費版 8 類 50 篇，付費版 19 類 600+ 篇 | 看訓練資料涵蓋到哪 | 全部，但要自己找 |

## 注意事項

- **內容是個人整理，不是 Roblox 官方文件**：README 寫得很清楚，每篇 logic 是作者「用自己的話」整理自 DevForum、Creator Docs 或 GitHub repo，附連結但不保證跟原文逐字一致。上線前還是要點進附的來源連結核對一次。
- **剛公開，星數和驗證都還很少**：repo 2026-04 就建了，但 2026-10-05 才在 DevForum 公開發布，目前只有 1 顆星，實際涵蓋的坑夠不夠用你的情境還沒有大量使用者驗證過。
- **免費版只有 8 類 50 篇**：如果你踩到的坑是移動、物理特效、世界系統、遊戲循環、音訊、動畫、社交或 live-ops 這些分類，免費版查不到，得買 €7 的完整版或自己去 DevForum 找。

## 今日收穫

AI 助手寫 Roblox（或任何變動快的平台）程式碼最大的風險不是「不會寫」，是「寫得很有信心但用的是半年前的 API」——而這種錯誤很難靠讀程式碼本身抓出來，因為語法完全合法，只是在執行期才會因為引擎已經改版而行為不對。Brickwise 的做法不是訓練更新的模型，是把「哪裡改了、原始討論在哪」這件事外部化成一份可查詢、附來源的知識庫，讓助手在下筆前先查一次，比事後除錯便宜得多。

## 參考資料

- [EL4CTEO/roblox-logics-mcp — GitHub](https://github.com/EL4CTEO/roblox-logics-mcp)
- [Brickwise | MCP server that teaches your AI assistant how Roblox systems really work — Roblox DevForum](https://devforum.roblox.com/t/brickwise-mcp-server-that-teaches-your-ai-assistant-how-roblox-systems-really-work/4916492)
- [Brickwise 官網（含範例 logic）](https://brickwise.dev/)
- [Model Context Protocol 官方規格](https://modelcontextprotocol.io)
