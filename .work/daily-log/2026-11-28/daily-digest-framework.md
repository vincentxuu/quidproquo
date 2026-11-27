產出：Pydantic AI v2.76.0 框架更新文章（zh-TW + en），主軸是 realtime session 中途換工具（UpdateTools）。

- 掃過 watchlist B2 全部 12 個框架（GitHub releases/releases.atom），只有 pydantic-ai v2.76.0（2026-11-26T23:49:06Z）落在過去 24 小時窗內且構成「minor 版本有重要新功能」；其餘（langgraph、crewai、mastra、composio、haystack、dspy、smolagents、llama_index、claude-code、agno、MCP spec）最新 release 都在窗外或只是 patch/bug fix，不寫。
- toolDegradation：`gh api` 對這些 repo 回 403（session 未 attach，且 GH_TOKEN 本身也 invalid），`api.github.com`／`github.com` 網頁版走 agent-proxy 都是 403（網域未在環境白名單）；改用 Groundlane `web_fetch` 讀 GitHub releases 頁與 `releases.atom`（走 Groundlane 自己的網路路徑，不受此限），Step 3b 用 Groundlane `web_search`（provider: keenable）交叉驗證，結果一致。
- E0 圖解：中英各畫一張（座標相同），示意「斷線重連」vs「UpdateTools 不斷線換工具」。
- E2 check:references：0 WARN。
- E4：pnpm install 正常；check:references／check:lang-parity／check:tw／check:series-order／check:diagram-text／check:no-emoji 均過（check:diagram-text 過程中修了英文版兩個文字溢出框，已修正為 0 error）。diagram-preview 未跑：無瀏覽器（/opt/pw-browsers 缺 chrome-headless-shell），check:diagram-text 已過。
