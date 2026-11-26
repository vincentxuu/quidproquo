# daily-digest-framework — 2026-11-21

今日無框架更新。

## 檢查範圍

B2 清單（agent-watchlist.json）共 14 個框架／專案，逐一查最新 release（GitHub releases Atom feed，因 gh API 對這些 repo 無權限改用 Atom）：

| 框架 | 最新版本 | 發布時間 | 判斷 |
|---|---|---|---|
| LangGraph | 1.2.24 | 2026-11-20T01:10 | patch，只修 bug，跳過 |
| CrewAI | 1.15.44 | 2026-11-19T17:59 | patch，功能僅一項小補強，跳過 |
| MCP Specification | 2026-07-28 (stable) | 2026-07-28 | 非近期，跳過 |
| Mastra | 多個子套件 patch | 2026-11-18 | patch，無說明，跳過 |
| Pydantic AI | v2.71.0 | 2026-11-19T02:13 | **昨天已寫**（`2026-11-20-framework-pydantic-ai-v2.71.0.md`），今天不重複 |
| Agno | v3.2.1 | 2026-11-17T17:05 | 超過回看窗口，跳過 |
| Composio | CLI 0.6.3 | 2026-11-20T18:43 | patch，跳過 |
| Haystack | v3.5.0 | 2026-11-10 | 超過回看窗口，跳過 |
| DSPy | 3.5.0 | 2026-11-10 | 超過回看窗口，跳過 |
| smolagents | v1.26.0 | 2026-05-29 | 超過回看窗口，跳過 |
| LlamaIndex | v0.14.26 | 2026-11-13 | 超過回看窗口，跳過 |
| Temporal | v1.33.0-168.0 | 2026-11-16 | 超過回看窗口，跳過 |
| Inngest | v1.54.0 | 2026-11-20T17:24 | minor 版號但內容全是 bug fix（panic 處理、worker concurrency semaphore、connect 路由修復），無新 Agent 原語，跳過 |
| AG2 | v1.3.3 | 2026-11-19T20:30 | patch（google-genai 3.x 相容性修正），跳過 |
| AutoGen | python-v0.7.5 | 2025-09-30 | 維護模式，無新動態 |

## 工具降級記錄

`gh api repos/{owner}/{repo}/releases` 對所有追蹤 repo 回 403（"GitHub access to this repository is not enabled for this session"）——這些 repo 未被 `add_repo` attach，雲端 session 的 GitHub API 存取需個別 attach 才能用。改用 GitHub 公開 `releases.atom` feed（經 Firecrawl scrape）取得版本與發布時間，不需要 attach 即可讀取，涵蓋到所有 14 個追蹤目標。`toolDegradation: "gh api release 403 (repo not attached), fallback to releases.atom via firecrawl_scrape"`。

## 環境修復

本 session 啟動時，/home/user/quidproquo 的本機 `main` 與 `origin/main` 顯示「50 筆 vs 50 筆」分歧——實際上是 depth=50 的 shallow clone，本機 `main` 落後太多，merge-base 找不到共同祖先。工作樹乾淨（無未提交變更）後，確認後用 `git reset --hard origin/main` 同步到最新。
