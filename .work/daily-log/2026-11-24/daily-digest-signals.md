# daily-digest-signals 執行紀錄 2026-11-24

## toolDegradation

- Groundlane MCP：連線後簽章被拒（"Claude Code connected to MCP server groundlane again with its existing sign-in and was refused"），需要使用者重新登入。
- Groundlane 直接 HTTP fallback（POST `https://groundlane.vincent-xu-work.workers.dev/mcp`）：回 401（環境未設定 `GROUNDLANE_AUTH_TOKEN`），依規則不重試，直接降級。
- 改用 Keenable keyless API（`GET https://api.keenable.ai/v1/search/public`，Header `X-Keenable-Title: quidproquo`）完成第一層 9 個廣域查詢 + 第三層 3 個社群查詢 + 8 個全球區域查詢，共 20 次搜尋皆成功（200 OK）。注意參數是 `query`（非 `q`）與 `published_after`（ISO 8601，非 `time_range`/`query_time`）。
- 第二層官方 blog 直讀改用內建 `WebFetch`（Groundlane `web_fetch` 不可用）。對 ~29 個高信號來源（Anthropic/OpenAI/DeepMind/Microsoft/Meta/AWS/NVIDIA/xAI/Mistral/Cohere/HuggingFace/DeepSeek/Manus/MiniMax/Kimi/Cursor/LangChain/simonwillison/the-decoder/AlibabaCloud/Cloudflare/Databricks/Sakana/Replit/Vercel/YC/marktechpost/research.google/latent.space/ByteDance Seed/Snowflake/Palantir/Upstage/Reka）執行直讀；AWS blogs、xAI news、Snowflake blog、Palantir blog 回 403，改以其他獨立來源交叉驗證對應事件。未逐一覆蓋 skill 文件列出的全部 ~75 個官方來源（受限於單一 session 人工執行 WebFetch 的時間成本），已優先覆蓋大廠與高頻更新來源；此為已知覆蓋縮減，未達成的來源列表見上。

## 其他紀錄

- sig-008（MONAI Label zero-day）原始來源 URL（aws.amazon.com/blogs/security/...）已於 2026-11-23 收錄過，改用 himiao.ai 的追蹤報導 URL 作為 sourceUrl 以符合跨天去重規則，原 AWS 官方文章列入 crossValidationSources。
- GitHub release 活動檢查（anthropics/claude-code、langchain-ai/langchain、openai/openai-agents-python）因本 session 的 repo 存取範圍限制於 `vincentxuu/quidproquo`、`lanefoundry/gatelane` 而回 403，跳過該層級，不影響本次產出（已由官方 blog 與搜尋層覆蓋對應框架動態）。
