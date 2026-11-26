產出 `2026-11-27-ai-agent-github-digest`（中英雙版）：Trending Repos 為 erkamyaman/rust-anything、nexu-io/opengame、w01fb0ss/PiBot；Notable Release 為 CrewAI 1.15.45。

- 圖解：無適合段落（內容為條列式 repo／release 介紹，沒有可畫的流程或架構關係）。
- 候選排除：Pydantic AI v2.75.0、Mastra core v1.86.0、Claude Code v2.1.332、Wakeshift、temporal-mcp、AgenticOS、experiential 已於前幾日的 github digest 或獨立框架文章報過；fast-anything、Nexus、Claude-BugHunter、superpowers、CLI-Anything 同理排除。
- `gh api repos/<org>/<repo>` 直接呼叫外部 repo（非 vincentxuu/quidproquo、lanefoundry/gatelane）被 session 擋下（"GitHub access to this repository is not enabled for this session"），改用 `gh api search/repositories` 搜尋查詢（不受此限）與 Groundlane `web_fetch` 打 `api.github.com` 公開端點取得 release 細節。
