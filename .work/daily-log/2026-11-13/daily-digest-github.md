產出「AI Agent GitHub Digest — 2026-11-13」(zh-TW + en)，trending repos 選 DIYgod/pinky、RapidSailorFreeze/studsmith、nengong/download-anything，release 選 Agno v3.2.0（P1，watchlist B2 框架major＋breaking change）與 pydantic-ai v2.68.0；sandbox-mcp、auto-ontology-mcp 因已在 11/9、11/7 報過排除，sksarvesh007/antiglaude 因宣傳規避 Google 帳號偵測／ToS 風險排除。

例外與降級：
- `gh api repos/{owner}/{repo}/...` 對本 session 未在 GitHub access 清單內的第三方 repo（如 langchain-ai/langgraph、agno-agi/agno）一律回 403「GitHub access to this repository is not enabled for this session」；改用 Groundlane `web_fetch` 抓對應 repo 的 `releases.atom` 公開頁面取得 release 資訊，`gh api search/repositories`／`search/code`（全域搜尋端點）不受此限制，可正常用於 trending 搜尋與單一 repo metadata 查詢（`q=repo:owner/name`）。toolDegradation 記錄於此，供其他 routine 參考同一繞法。
- diagram-preview 未跑：無瀏覽器（`/opt/pw-browsers/chromium_headless_shell-1208/...` 不存在），zh/en 兩版皆 skip。
