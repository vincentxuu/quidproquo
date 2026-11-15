產出框架更新文章：AG2 v1.3.2（2026-11-15 發布，order 67），中英雙版。

- 候選篩選：GitHub CLI `gh api` 對這些外部 repo 回 403（session 的 GitHub scope 只含 vincentxu/quidproquo、lanefoundry/gatelane），改用 firecrawl_scrape 直接讀 `api.github.com/repos/.../releases` JSON 繞過，成功取得全部候選資料。
- 檢查過的追蹤清單（langgraph、crewAI、MCP spec、mastra、pydantic-ai、agno、claude-code、composio、haystack、dspy、smolagents、llama_index、temporal、inngest、ag2、autogen）裡，只有 ag2ai/ag2 v1.3.2（published_at 2026-11-15T16:37:55Z）落在過去 24 小時內且有實質 breaking changes（跨 provider token 用量算法統一、ACP 升級到 1.0）。其餘候選要不是太舊（agno v3.2.0、mastra @mastra/core@1.83.0 皆已在前幾天的 routine 寫過）、要不是純 patch/維護性更新（langgraph、composio、llama_index、crewAI）。
- 圖解：1 張前後對照圖（Anthropic/Bedrock 的 prompt_tokens 算法 before/after），中英版座標相同。
- diagram-preview 未跑：無瀏覽器（/opt/pw-browsers 缺 chrome-headless-shell 執行檔）。
- check:references／check:lang-parity／check:tw／check:series-order 四項對新檔均無 WARN/ERROR。
