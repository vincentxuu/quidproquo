產出 2026-11-21 GitHub Digest（中英雙版）：mattpocock/skills 反超 obra/superpowers、Claude-BugHunter、stitch-skills、firecrawl 四個 trending repos，CrewAI 1.15.44 與 Claude Code v2.1.329 兩個 release。

- toolDegradation：`gh api repos/{owner}/{repo}/...`（Step 4a 指定方法）在本 session 被 agent-proxy 擋下（僅限已 attach 的 repo），github.com 一般網頁同樣被同一層擋；改用 Groundlane `web_fetch` 直接抓各框架 `/releases` 與 `/releases/tag/*` 頁面取得版本與日期，`gh api search/repositories`（search 端點不受 repo scope 限制）維持可用，用於找新 repo 候選與驗證 star 數。
- 圖解：無適合段落（純排行與 release 條列，無可畫的結構關係）。
- `gh api search/repositories` 以 topic 篩選（ai-agent、ai-agents、mcp-server、llm-agent）回來的多數是明顯灌水／農場帳號重複鋪的仿冒 repo（如大量近乎同名的 "Gemini-Config-Checker" 帳號），全部排除，改採 Groundlane web_search 找到的編輯內容（trending 整理文、star-history）交叉驗證後的候選。
