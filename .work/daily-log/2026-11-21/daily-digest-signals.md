# daily-digest-signals 2026-11-21 執行紀錄

## 搜尋層完成度
- 第一層廣域主題查詢（9 個 Groundlane `web_search`）：全部完成。
- 第三層社群（HN/Reddit，3 個）與全球區域矩陣（8 個）：全部完成。
- 第二層官方 blog 直讀：僅完成約 28 個（Anthropic、OpenAI、Meta、Microsoft Agent Framework、Cloudflare、x.ai、NVIDIA ×2、Apple、Mistral、Cohere、AWS ×2、Databricks、Cursor、LangChain、Cognition、DeepSeek、Manus、HuggingFace blog、the-decoder、marktechpost、a16z、Kimi、MiniMax、Alibaba Cloud、Sakana AI、Allen AI、Anthropic Research、OpenAI Research Index），清單中其餘約 45–50 個（HF/GitHub 公司頁、SAP、Writer、Palantir、Snowflake、IBM Research、Azure/Microsoft Research blog、Amazon Science、NVIDIA Research Publications、Replit、Vercel、Mastra、Sourcegraph、Pydantic AI、Agno、AI21、Reka、Upstage、ByteDance Seed/BytePlus、SenseTime、騰訊、百度、YC blog、a16z 子頁、BVP Atlas、Lightspeed Stories、artificialintelligence-news.com 等）因時間與 token 成本考量未逐一直讀，改以廣域查詢結果交叉覆蓋。

## toolDegradation 記錄
- `web_fetch` 的 `waitFor` 參數實際是 CSS selector 等待條件，不是自然語言摘要指令；本次一開始誤用造成 anthropic.com/research 第一次呼叫失敗（INVALID_INPUT）與多個併發呼叫逾時（60s timeout）。後續改為不帶 `waitFor`、降低併發數後恢復正常。
- `https://deepmind.google/blog` 回傳未解壓的 gzip 二進位亂碼，內容無法解析，該來源今日視為「無法確認」（0 筆），非漏查。
- `https://aws.amazon.com/blogs/aws`、`https://aws.amazon.com/blogs/machine-learning`、`https://www.databricks.com/blog`、`https://cohere.com/blog` 在 `extract=full` 模式下回傳大量導覽列/頁尾 HTML，在 `maxOutputChars` 截斷前未能抓到文章卡片列表，視為「無法確認」。
- `https://www.minimaxi.com/news`（跳轉 minimax.cn/news）需要 JS 渲染且回傳空內容（`fallbackReason: js_empty_document`），視為「無法確認」。
- `https://a16z.com/ai` 僅回傳法遵免責聲明文字，未抓到實際文章卡片，視為「無法確認」。
- `https://www.latent.space/archive` 僅回傳搜尋介面骨架，未抓到文章列表，視為「無法確認」。

## 去重排除紀錄（已出現在 seen-signal-urls.txt，today 排除）
- NVIDIA "Inside NVIDIA Sentry" (`developer.nvidia.com/blog/inside-nvidia-sentry-secure-ai-agents-at-runtime/`)：2026-11-20 已收錄。
- Cursor changelog `/agent-sdk`、`/voice-chat`、`/origin-app-marketplace`：先前已收錄。
- Microsoft Agent Framework PyPI 供應鏈攻擊、OpenAI "Managing frontier AI risk"、"Inside the Codex sandbox"、"Advancing chip design"、GPT-6.2 Astra/Sol 發佈文、Alibaba AgentLoop DeepSeek Harness 評測、Perplexity Multiagent、MAS 新加坡 agent 協議、Visa Agentic Commerce APAC 擴展、Arva AI $20M 募資：皆已出現在 2026-11-18～20 的 seen-signal-urls.txt，今日排除以避免重複報導同一事件。

## 本次未收錄但覆蓋已審酌的區域
- 南亞（India/Pakistan/Bangladesh/Sri Lanka）：本次查詢結果多為舊聞或已於前幾日收錄之事件，48 小時內查無新的高品質獨立信號，0 筆為真實查核結果。
- 大洋洲（Australia/New Zealand）：查無 48 小時內且非舊聞的 agent 相關事件，0 筆為真實查核結果。
