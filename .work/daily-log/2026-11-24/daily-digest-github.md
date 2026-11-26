# daily-digest-github — 2026-11-24

產出 `2026-11-24-ai-agent-github-digest.md`（+ 英文版），選了 elementalsouls/Claude-BugHunter、obra/superpowers、t8y2/dbx、google-research/paper-orchestra 四個 repo，今日無符合門檻的框架 release。

例外：
- `gh api` 在本環境被限制在已 attach 的 repo，無法直接查任意公開 repo 的 release/search；改用 PyPI／npm registry JSON API 查框架最新版本與發布時間，trending 候選改用 Keenable keyless search + `raw.githubusercontent.com` 讀 jastfan/github-trending 的每日存檔（記為 toolDegradation：gh api repo-scoped only → PyPI/npm + raw.githubusercontent.com fallback）。
- Groundlane MCP 連線被拒（需使用者登入），依 fallback 鏈改用 Keenable keyless search。
- 圖解：無適合段落（4 個候選各自獨立的星數快照，單一數字對比用文字敘述就夠清楚，未強行畫圖）。
