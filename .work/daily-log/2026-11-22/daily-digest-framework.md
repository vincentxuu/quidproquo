# daily-digest-framework — 2026-11-22

今日無框架更新。

## 檢查範圍

Skill 清單 12 個 repo + watchlist B2 補的 temporal/inngest/ag2/autogen，共 16 個，逐一查最新 release（GitHub releases Atom feed）：

| 框架 | 最新版本 | 發布時間 | 判斷 |
|---|---|---|---|
| LangGraph | 1.2.24 | 2026-11-20T01:10 | patch，只修一個 bug，跳過 |
| CrewAI | 1.15.44 | 2026-11-19T17:59 | 在 24 小時回看窗口外（早於 2026-11-20T00:00Z），跳過 |
| MCP Specification | 2026-07-28 (stable) | 2026-07-28 | 非近期，跳過 |
| Mastra | 多個子套件 patch | 2026-11-18 | 超過回看窗口，跳過 |
| Pydantic AI | v2.71.0 | 2026-11-19T02:13 | 已於 2026-11-20 寫過；今日最新條目「CLAI2 bleeding」(2026-11-21T09:34) 官方標註非正式 release，跳過 |
| Agno | v3.2.1 | 2026-11-17T17:05 | 超過回看窗口，跳過 |
| Composio | CLI 0.6.4-beta.573 | 2026-11-20T20:47 | 窗口內但純文件/依賴更新，beta CLI，跳過 |
| Haystack | v3.5.0 | 2026-11-10 | 超過回看窗口，跳過 |
| DSPy | 3.5.0 | 2026-11-10 | 超過回看窗口，跳過 |
| smolagents | v1.26.0 | 2026-05-29 | 超過回看窗口，跳過 |
| LlamaIndex | v0.14.26 | 2026-11-13 | 超過回看窗口，跳過 |
| Temporal | v1.33.0-168.0 | 2026-11-16 | 超過回看窗口，跳過 |
| Inngest | v1.54.0 | 2026-11-20T17:24 | 窗口內但內容是 panic 處理修復，無新 Agent 原語（昨日已判斷過同一版本），跳過 |
| AG2 | v1.3.3 | 2026-11-19T20:30 | 在窗口外，google-genai 相容性 patch（昨日已判斷過同一版本），跳過 |
| AutoGen | python-v0.7.5 | 2025-09-30 | 維護模式，無新動態 |
| Claude Code | v2.1.330 | 2026-11-20T22:32 | 窗口內，但是例行迭代版號（功能+修復混合，非 major/breaking），非 B2 核心框架，跳過 |

Step 3b 補充 web_search（AI agent framework release changelog, time_range=day）：命中 openclaw、n8n、Microsoft Agent Framework 教學文、Hermes Agent changelog 等，均非本 skill 追蹤的 Agent 框架或非當日新發布，無新線索。

## 工具降級記錄

`gh api repos/{owner}/{repo}/releases`／直接 `curl api.github.com` 對所有未 attach 的追蹤 repo 一律回 403（"GitHub access to this repository is not enabled for this session"），`github.com/.../releases.atom` 走 agent-proxy 直接 curl 也回同樣的 repo-scope 403——雲端 session 的 GitHub API／網域代理把存取限制在 `add_repo` 清單內（本 session 僅 vincentxuu/quidproquo、lanefoundry/gatelane）。改用 Groundlane `web_fetch` 讀各 repo 公開 `releases.atom`（不經過該代理層），16 個目標全數取得版本與發布時間，未再降級到 Keenable/You.com。`toolDegradation: "gh api + agent-proxy curl both blocked by repo-scope 403, fallback to Groundlane web_fetch on releases.atom"`。
