產出資安警報：官方 MCP 參考伺服器 mcp-server-git 的 git_status 等唯讀工具會被不受信任 repository 自己的 `.git/config`（core.fsmonitor／diff.external）誘發任意程式碼執行，CVSS 4.0 7.0 High，已於 2026-11-11 隨 v2.4.0 修補（GHSA-6hqx-gqrx-c5r2），屬於已在多個 agent 工具核發過 CVE 的 GitSpawn 漏洞類別。中英雙版皆已產出並通過 check:references / check:lang-parity / check:tw / check:series-order。

例外：
- diagram-preview 未跑：環境預裝 playwright headless_shell 版本（1243）與專案鎖定版本（1208）不符，`--skip-if-no-browser` 已優雅跳過，中英文皆同一錯誤。已另跑 `check:diagram-geometry` 確認線段幾何 0 錯誤。
