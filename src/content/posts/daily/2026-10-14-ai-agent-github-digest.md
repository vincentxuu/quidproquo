---
title: "AI Agent GitHub Digest — 2026-10-14"
date: 2026-10-14
category: daily
tags: [ai-agent, github, open-source, daily, mcp, coding-agent, hardware-agent, local-search]
lang: zh-TW
description: "一塊 7 美元的 ESP32 板讓 AI 直接操作真的 iPhone；opencode-rust 把 TypeScript coding agent 重寫成 Rust 省記憶體；Mastra 1.76.0 和 DSPy 3.4.1 同日都補上明確的 breaking changes"
tldr: "onehumanbeing/esp32-iphone-agent 用一塊 7 美元的 ESP32 板 + AirPlay，讓 vision model 不需要 Mac、開發者帳號或越獄就能操作真實 iPhone；TedHaley/pensieve 把本機檔案、git repo 和 AI agent session 一起做成可搜尋的 MCP server；vakandi/opencode-rust 把 OpenCode 從 TypeScript 重寫成 Rust，衝著「原版吃記憶體又吃 CPU」而來。Mastra 1.76.0 加入 durable agent run ownership 防止多機搶跑，DSPy 3.4.1 把 GEPA 的 reflection 預設換成結構化輸出，兩者都明確列出 breaking changes。"
series:
  name: "AI Agent GitHub Digest"
  order: 60
---

> 🌏 [English version](/posts/daily/2026-10-14-ai-agent-github-digest-en)

## 今日亮點

今天沒有單一爆款衝上 trending 第一，反而是三個方向各自往「agent 要摸到更多真實世界的東西」收斂——esp32-iphone-agent 讓 agent 摸到一支實體 iPhone，pensieve 讓 agent 摸到自己過去跑過的 session 記錄，opencode-rust 則是把「跑 agent 的工具本身」換一種語言重寫以求更省資源；同時 Mastra 和 DSPy 同日都發了帶明確 breaking changes 的版本，對生產環境裡已經在用這兩個框架的人是今天最該看的部分。

## Trending Repos

### onehumanbeing/esp32-iphone-agent ⭐ 1,400 (+1,400)

[GitHub](https://github.com/onehumanbeing/esp32-iphone-agent)　·　Python + C++　·　MIT

- **是什麼**：用一塊約 7 美元的 Seeed XIAO ESP32-S3 開發板插在 iPhone 的 USB 孔上模擬鍵盤滑鼠（USB HID），手機畫面透過 AirPlay 鏡像傳到電腦，再讓 vision model 看畫面、決定下一步動作，不需要 Mac、開發者帳號或越獄。
- **為什麼值得看**：市面上多數「agent 操作手機」的方案都綁死在 Appium／模擬器或需要企業簽署的自動化框架，這個專案反其道而行，用一塊便宜開發板加 USB HID 繞過所有官方限制，而且有 planner／actor 雙模型分工、動作後檢查畫面是否真的改變、卡住會重新規劃，不是單純盲打。
- **Tech stack**：Python + FastAPI（server）、C++／Arduino（韌體）、UxPlay + GStreamer（AirPlay 擷取）、任何 OpenAI 相容的 vision model
- **上手難度**：中——需要自己焊接／接線 ESP32 板並用 arduino-cli 燒錄韌體，軟體端設定門檻不高。

---

### TedHaley/pensieve ⭐ 63 (+63)

[GitHub](https://github.com/TedHaley/pensieve)　·　Python　·　MIT

- **是什麼**：在 macOS 上把本機檔案、git repo commit 歷史和過去的 AI agent session 一起建立索引，支援關鍵字和語意搜尋，並透過 MCP server 讓 Claude Code、Codex、Cursor 等 agent 直接拿到最相關的幾個檔案或段落，不用自己對整顆硬碟做 grep。
- **為什麼值得看**：多數「agent context」工具解決的是單一 session 內的記憶問題，這個工具把範圍拉大到「這台機器上所有 agent session 跑過的東西」，加上 git blame 分析找出程式碼的知識落差，對同一台機器上長期用多個 coding agent 的人是個新的切入點，而不是又一個 vector DB wrapper。
- **Tech stack**：Qwen3-Embedding-0.6B（Apple Silicon 上跑 MLX，其他平台用 sentence-transformers）+ SQLite trigram 全文索引 + turbovec 向量索引 + MCP server
- **上手難度**：中——目前只支援 macOS，且用 uv 管理 Python 環境，另有獨立的 Mac app 需要 Xcode 工具鏈建置。

---

### vakandi/opencode-rust ⭐ 51 (+51)

[GitHub](https://github.com/vakandi/opencode-rust)　·　Rust　·　MIT

- **是什麼**：把開源 coding agent OpenCode 從 TypeScript 整個重寫成 Rust，提供 CLI、終端機 UI 和 HTTP server 三種跑法，核心拆成 21 個 crate（session、agent、tools、providers、MCP、LSP 等）。
- **為什麼值得看**：README 直接點名原版 TypeScript 引擎記憶體和 CPU 用量偏高，這不是功能面的競爭，是針對「coding agent 長時間背景跑」這個場景做資源優化；同時保留 MCP、LSP 和 TypeScript plugin bridge（透過 Node.js 啟動），不是砍功能換效能。
- **Tech stack**：Rust（21 crates）+ Node.js 18+（plugin bridge／透過 npx 啟動 MCP server）+ SQLite 儲存
- **上手難度**：低——提供預編譯二進位和 Homebrew／npm 安裝，但要用到 MCP 或 plugin 仍需另外裝 Node.js。

## Notable Releases

### Mastra 1.76.0

[Release Notes](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.76.0)

- **重要變更**：新增 durable agent run ownership——每個 run 被實際執行它的 process「claim」，當 process 掛掉後其他 replica 的 crash recovery 會跳過仍在跑的 run，storage adapter 也能擋下已失去 ownership 的寫入，避免多機搶同一個 run 造成狀態損壞；PostgreSQL 上的 working memory 支援 row-locked 交易做原子性合併；新增 `nestUnderParent`／`nestUnderRun()` 讓 run 可以當成另一個 run 的子 span；中斷的 workflow run 重啟時會並行恢復（預設最多 5 個）。
- **Breaking Changes**：`@mastra/playground-ui` 移除舊版 Metrics 卡片，`MetricsCardGroup` 不再接受 `variant`、`MetricsLineChart` 拿掉 `xAxisInterval`／`xAxisMinTickGap`；`@mastra/memory` 的 Observational Memory 預設模型從固定的 `google/gemini-2.5-flash` 改成跟著主模型走的 `model: 'auto'`，可能因此換了底層供應商或模型。
- **對你的影響**：如果你自訂過 Metrics 面板元件要照新 API 改；如果你依賴 Observational Memory 用固定模型（例如為了壓成本才選 Gemini Flash），升級後記得顯式指定模型，不然會跟著主模型變動。

---

### DSPy 3.4.1

[Release Notes](https://github.com/stanfordnlp/dspy/releases/tag/3.4.1)

- **重要變更**：GEPA 的 reflection 預設改用 `dspy.Predict` + `JSONAdapter` 做結構化輸出，對話歷史、工具軌跡、圖片都能以結構化內容送進 reflection LM；`dspy.RLM` 的 REPL 現在可以在裡面動態建立 `dspy.Predict`／`dspy.ChainOfThought`／`dspy.ReActV2` 甚至巢狀 `dspy.RLM` 子 agent，並共用同一個 `max_llm_calls` 預算；新增 Python 3.15 支援。
- **Breaking Changes**：`reflection_lm` 現在必須是能回傳可解析 JSON 的 `dspy.LM`，舊版用純函式或純文字答案的設定會失效且結果可能跟 3.4.0 不同；RLM 每個 prompt 都會多塞一段 sub-agent 區塊，導致 3.4.0 的快取和錄製回應全部對不上；`dspy.predict.flex.bridge` 底下的常數搬到 `dspy.primitives.facade`，舊的 import 路徑直接丟 `ImportError`；儲存了 null level 的 `Score` 物件在 3.4.0 存的檔案會載入失敗。
- **對你的影響**：如果你有用 GEPA 做 prompt 最佳化，升級後最好重新跑一次優化而不是直接套用舊結果；有自訂 RLM 流程或存了舊版 cache／recorded response 的人，升級前得先確認這些是否能棄用重建。

## 今日收穫

之前以為「agent 操作真實世界」主要是指瀏覽器或桌面自動化，但 esp32-iphone-agent 提醒我這個邊界可以直接往下探到「用 7 美元硬體繞過官方限制」這一層——當某個介面沒有開放 API，社群不會等官方開放，而是找最便宜的旁路硬體自己接上去。

## 參考資料

- [onehumanbeing/esp32-iphone-agent](https://github.com/onehumanbeing/esp32-iphone-agent)
- [GitHub Search — created:>2026-10-06 stars:>100 topic:ai-agent](https://github.com/search?q=created%3A%3E2026-10-06+stars%3A%3E100+topic%3Aai-agent&type=repositories&s=stars&o=desc)
- [TedHaley/pensieve](https://github.com/TedHaley/pensieve)
- [vakandi/opencode-rust](https://github.com/vakandi/opencode-rust)
- [Mastra 1.76.0 Release Notes](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.76.0)
- [DSPy 3.4.1 Release Notes](https://github.com/stanfordnlp/dspy/releases/tag/3.4.1)
