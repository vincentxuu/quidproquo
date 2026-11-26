# daily-digest-framework — 2026-11-23

今日無框架更新。

## 檢查範圍

Skill 清單 12 個 repo + watchlist B2 補的 temporal/inngest/ag2/autogen，共 16 個，逐一查最新 release（GitHub releases Atom feed）：

| 框架 | 最新版本 | 發布時間 | 判斷 |
|---|---|---|---|
| LangGraph | 1.2.24 | 2026-11-20T01:10 | 超過回看窗口（早於 2026-11-21T00:00Z），跳過 |
| CrewAI | 1.15.44 | 2026-11-19T17:59 | 超過回看窗口，跳過 |
| MCP Specification | 2026-07-28 (stable) | 2026-07-28 | 非近期，跳過 |
| Mastra | 多個子套件 patch | 2026-11-18 | 超過回看窗口，跳過 |
| Pydantic AI | v2.71.0 | 2026-11-19T02:13 | 已於 2026-11-20 寫過；今日最新條目「CLAI2 bleeding」(2026-11-22T02:58) 官方標註非正式 release（main 分支 sdist 重建），跳過 |
| Agno | v3.2.1 | 2026-11-17T17:05 | 超過回看窗口，跳過 |
| Composio | CLI 0.6.4-beta.573 | 2026-11-20T20:47 | 超過回看窗口，且為 beta CLI，跳過 |
| Haystack | v3.5.0 | 2026-11-10 | 超過回看窗口，跳過 |
| DSPy | 3.5.0 | 2026-11-10 | 超過回看窗口，跳過 |
| smolagents | v1.26.0 | 2026-05-29 | 超過回看窗口，跳過 |
| LlamaIndex | v0.14.26 | 2026-11-13 | 超過回看窗口，跳過 |
| Temporal | v1.33.0-168.0 | 2026-11-16 | 超過回看窗口，跳過 |
| Inngest | v1.54.0 | 2026-11-20T17:24 | 超過回看窗口（昨日已判斷過同一版本），跳過 |
| AG2 | v1.3.4 | 2026-11-22T18:21 | 窗口內，但確認為純 bugfix／文件修正（knowledge 輪詢回呼、network turn_within、ACPConfig 型別、docs 修正），無新功能，跳過 |
| AutoGen | python-v0.7.5 | 2025-09-30 | 維護模式，無新動態 |
| Claude Code | v2.1.330 | 2026-11-20T22:32 | 超過回看窗口，且為例行迭代版號，非 B2 核心框架，跳過 |

Step 3b 補充搜尋（Keenable keyless，因 Groundlane 本次登入被拒）：兩輪查詢（`published_after=2026-11-20`／`2026-11-21`）命中 Kore.ai Artemis、Spring AI 2.1.0 GA、Cloudflare Agents SDK（Pi 1.6）、LangSmith、Braintrust、FastMCP 等 changelog，均非本 skill 追蹤的 Agent 框架，或發布時間早於回看窗口，無新線索。

## 工具降級記錄

- Groundlane MCP 本次重新連線被使用者拒絕（已登入過但這次連線被拒），改走 fallback 鏈下一層。
- `gh api repos/{owner}/{repo}/releases` 對所有未 attach 的追蹤 repo 一律回 403（repo-scope 限制在 `add_repo` 清單內，本 session 僅 vincentxuu/quidproquo、lanefoundry/gatelane）。改用內建 `WebFetch` 讀各 repo 公開 `releases.atom`，16 個目標全數取得版本與發布時間。
- Step 3b 用 Keenable keyless API（`api.keenable.ai/v1/search/public`）補搜，未再降級到 You.com。
- `toolDegradation: "groundlane reconnect refused by user this turn; gh api + repo-scope blocked, fallback to built-in WebFetch on releases.atom + Keenable keyless for step 3b"`
