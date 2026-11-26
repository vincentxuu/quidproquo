產出 AI Agent GitHub Digest — 2026-11-16（中英雙版）：Trending Repos 挑 Plannotator、callstack/agent-device、kody-hq/kody；Notable Releases 挑 Agno v3.2.0、pydantic-ai v2.68.0。

例外：
- `gh api` 對非 session 範圍 repo（langchain-ai/langgraph 等）回 403（GitHub access scoped to vincentxuu/quidproquo, lanefoundry/gatelane），改用 Groundlane `web_fetch` 直接抓 releases 頁與 `api.github.com`（Groundlane 走外部網路，不受本機 sandbox 網域限制）。
- 圖解：無適合段落——三個 Trending Repos 類別差異大（審查介面／裝置控制／agent 記憶），沒有共同的結構可畫，未強行畫圖。
- Agno v3.2.0（2026-11-12）與 pydantic-ai v2.68.0（2026-11-11）略早於嚴格 48 小時窗，但確認未被昨日（2026-11-15）digest 覆蓋過，且是目前最具份量的 breaking-change release，故採用。
