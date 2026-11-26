產出工具推薦：0（0sec-labs/0，開源 AI 資安 harness，CLI／MCP／Web UI，921 stars，官方 2026-11-08 公告開源），中英雙版 + 1 張架構圖。

例外：
- diagram-preview 未跑：無瀏覽器（/opt/pw-browsers 的 chromium-headless-shell 版本與 playwright-core 預期版本不符，跳過；check:diagram-geometry 0 error 已過）。
- 排除候選：GitHub 搜尋到的 `Nanoutrolley/roblox-studio-mcp`（280 stars，當日新建）實為假星／惡意倉庫——README 宣稱 Node/TypeScript MCP server，實際內容只有兩個不相關的 Python stub 檔，「Quick Start」要求從 telegra.ph 連結下載並執行 `ProjectFiles.exe`，典型的刷星誘導下載惡意執行檔手法，未採用。
- 本機環境 git 的 `main` branch ref 落後 origin/main 6 天（55 commits），且雙方各有彼此沒有的 commit（疑似上游曾被 force-push）；未嘗試合併或重置該分支，全程改在與 origin/main 一致的 commit 上工作，發現即登錄供人處理，不在本次 routine 範圍內動它。
