產出框架更新文（中英雙版）：Mastra `@mastra/core@1.83.0`（Release November 12, 2026）。重點是所有 Agent 都預設有 resumable stream、`@mastra/server` 內建 MCP 伺服器在 `/api/mcp`，以及一項 breaking change（`durable` 選項拆成串流重連與崩潰復原兩件事）。

- 掃過 watchlist B2 的所有框架（LangGraph、crewAI、MCP spec、Mastra、Pydantic AI、Agno、Composio、Haystack、DSPy、smolagents、LlamaIndex、Temporal、Inngest、AG2、AutoGen）；其餘在 `$YESTERDAY`（2026-11-12T00:00Z）之後發布但判定跳過：
  - Agno v3.2.0（2026-11-12）：已由昨天的 routine 覆蓋（`2026-11-13-framework-agno-v3.2.0.md`），不重複。
  - Pydantic AI v2.68.0（2026-11-12）：功能增量（RequestInput、DelegationTasks.discover 等），無明確 breaking changes 區段，判定「不如本次選中的 Mastra 重要」，本次未寫；留給下次 routine 複查是否仍值得寫。
  - Haystack v3.5.0（2026-11-10）、DSPy 3.5.0（2026-11-10）：發布日早於 `$YESTERDAY`，跳過。
  - MCP spec 最新 2026-07-28 僅為 RC、非本次新發布，跳過。
  - 其餘（LangGraph patch、crewAI patch、Composio beta、LlamaIndex 舊安全性批次、Temporal/Inngest/AG2/AutoGen 無新於窗口的重要版本）：不符合「必寫/寫」門檻,跳過。
- toolDegradation：`gh api` 對非 scope 內 repo（watchlist 的所有框架 repo）一律回 403「not enabled for this session」，改用 Groundlane `web_fetch` 讀 GitHub releases 頁面 + PyPI/npm registry JSON API 取代 GitHub API 來源與時間戳。
- 圖解：補 1 張 before/after 比較圖（MCP 曝露方式的前後對照），中英文版座標相同。
- diagram-preview 未跑：無瀏覽器（`/opt/pw-browsers` 下找不到 headless_shell 執行檔）。
- `pnpm install --frozen-lockfile` 成功（`gray-matter` 等先前缺的依賴已裝回）。
- targeted verify（check:references / check:lang-parity / check:tw / check:series-order）全部通過，0 blocking。
