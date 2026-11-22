推薦 pulsar（yocontra/pulsar）：MCP server，讓 Claude Code、Codex、OpenCode、pi、omp、Cursor、Gemini CLI 等不同 harness 的 agent 互相看到、傳訊息、request/reply，甚至叫醒閒置中的 session。中英雙版皆已產出。

- 候選來源：`gh search repos` 搜「MCP server」created>2026-11-15（32 候選），另評估過 otpkit（臨時信箱/簡訊 OTP MCP）、nexus（coding agent 本機工程記憶）；pulsar 新聞價值最高且與本站自己用的 SendMessage/ListAgents 工具直接相關
- stars：gh search repos 回報 32（查核時），與 repo 頁面快取的 24 有落差，採用 live API 數字
- 圖解：加 1 張架構圖（daemon 居中,三種 harness 左接右出,下接 SQLite 訊息紀錄；push vs 拉取用實線/虛線區分），check:diagram-geometry 與 diagram-preview（light/dark/phone）皆通過，中英兩版都跑過
- check:references / check:lang-parity / check:tw / check:series-order / lint：新檔皆 0 warning、0 error；series order 82 無撞號
