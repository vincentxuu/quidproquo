# 第二層：官方 blog 直讀 URL 清單

> Step 5 第二層掃描時讀。這是每天要逐一 `web_fetch` 的列表頁（掃描順序）；工具設定、prompt 與抓回後的處理方式在 SKILL.md「第二層：官方 blog 直讀」。每家更深的官方管道（release notes、changelog、status）見同目錄 `vendor-official-sources.md`。

**A1 大廠**

| # | URL | 公司 | 工具 |
|---|-----|------|------|
| 1 | `https://www.anthropic.com/news` | Anthropic | Groundlane `web_fetch` |
| 2 | `https://www.anthropic.com/research` | Anthropic | Groundlane `web_fetch` |
| 3 | `https://openai.com/news` | OpenAI | Groundlane `web_fetch` |
| 4 | `https://openai.com/research/index` | OpenAI | Groundlane `web_fetch` |
| 5 | `https://deepmind.google/blog` | Google DeepMind | Groundlane `web_fetch` |
| 5b | `https://research.google/blog` | Google Research | Groundlane `web_fetch` |
| 6 | `https://devblogs.microsoft.com/ai` | Microsoft | Groundlane `web_fetch` |
| 7 | `https://www.microsoft.com/en-us/ai/blog` | Microsoft | Groundlane `web_fetch` |
| 8 | `https://devblogs.microsoft.com/agent-framework` | Microsoft | Groundlane `web_fetch` |
| 9 | `https://azure.microsoft.com/en-us/blog/category/ai-machine-learning` | Microsoft Azure | Groundlane `web_fetch` |
| 9b | `https://www.microsoft.com/en-us/research/blog` | Microsoft Research | Groundlane `web_fetch` |
| 10 | `https://about.fb.com/news` | Meta | Groundlane `web_fetch` |
| 11 | `https://ai.meta.com/blog` | Meta | Groundlane `web_fetch` |
| 12 | `https://aws.amazon.com/blogs/aws/category/artificial-intelligence/amazon-machine-learning/amazon-bedrock` | AWS | Groundlane `web_fetch` |
| 13 | `https://aws.amazon.com/blogs/aws` | AWS | Groundlane `web_fetch` |
| 14 | `https://aws.amazon.com/blogs/machine-learning` | AWS ML | Groundlane `web_fetch` |
| 14b | `https://www.amazon.science/blog` | Amazon Science | Groundlane `web_fetch` |
| 15 | `https://blogs.nvidia.com/blog/category/generative-ai` | NVIDIA | Groundlane `web_fetch` |
| 16 | `https://developer.nvidia.com/blog` | NVIDIA Developer | Groundlane `web_fetch` |
| 16b | `https://research.nvidia.com/publications` | NVIDIA Research | Groundlane `web_fetch` |
| 17 | `https://x.ai/news` | xAI/SpaceXAI | Groundlane `web_fetch` |
| 18 | `https://blog.cloudflare.com/tag/ai` | Cloudflare | Groundlane `web_fetch` |
| 19 | `https://blog.cloudflare.com/tag/developers` | Cloudflare | Groundlane `web_fetch` |
| 20 | `https://www.snowflake.com/blog` | Snowflake | Groundlane `web_fetch` |
| 21 | `https://www.databricks.com/blog` | Databricks | Groundlane `web_fetch` |
| 22 | `https://research.ibm.com/blog` | IBM | Groundlane `web_fetch` |
| 23 | `https://www.apple.com/newsroom/topics/apple-intelligence` | Apple | Groundlane `web_fetch` |
| 24 | `https://news.sap.com/topics/artificial-intelligence` | SAP | Groundlane `web_fetch` |
| 25 | `https://writer.com/blog` | Writer | Groundlane `web_fetch` |
| 26 | `https://blog.palantir.com` | Palantir | Groundlane `web_fetch` |

**HuggingFace 社群 + 模型 trending**

| # | URL | 說明 | 工具 |
|---|-----|------|------|
| HF0a | `https://huggingface.co/blog` | HF 官方 blog（每日更新） | Groundlane `web_fetch` |
| HF0b | `https://huggingface.co/models?sort=trending` | 模型 trending 排行 | Groundlane `web_fetch` |

**HuggingFace + GitHub 模型/repo 動態追蹤**

| # | URL | 公司 | 工具 |
|---|-----|------|------|
| HF1 | `https://huggingface.co/google` | Google | Groundlane `web_fetch` |
| HF2 | `https://huggingface.co/microsoft` | Microsoft | Groundlane `web_fetch` |
| HF3 | `https://huggingface.co/nvidia` | NVIDIA | Groundlane `web_fetch` |
| HF4 | `https://huggingface.co/mistralai` | Mistral | Groundlane `web_fetch` |
| HF5 | `https://huggingface.co/MiniMaxAI` | MiniMax | Groundlane `web_fetch` |
| GH1 | `https://github.com/anthropics` | Anthropic | Groundlane `web_fetch` |
| GH2 | `https://github.com/openai` | OpenAI | Groundlane `web_fetch` |
| GH3 | `https://github.com/google-deepmind` | Google DeepMind | Groundlane `web_fetch` |
| GH4 | `https://github.com/meta-llama` | Meta Llama | Groundlane `web_fetch` |
| GH5 | `https://github.com/microsoft` | Microsoft | Groundlane `web_fetch` |
| GH6 | `https://github.com/NVIDIA` | NVIDIA | Groundlane `web_fetch` |
| GH7 | `https://github.com/mistralai` | Mistral | Groundlane `web_fetch` |
| GH8 | `https://github.com/MiniMax-AI` | MiniMax | Groundlane `web_fetch` |
| HF6 | `https://huggingface.co/meta-llama` | Meta Llama | Groundlane `web_fetch` |
| HF7 | `https://huggingface.co/openai` | OpenAI | Groundlane `web_fetch` |
| HF8 | `https://huggingface.co/ibm-granite` | IBM Granite | Groundlane `web_fetch` |
| HF9 | `https://huggingface.co/Snowflake` | Snowflake | Groundlane `web_fetch` |
| HF10 | `https://huggingface.co/apple` | Apple | Groundlane `web_fetch` |
| HF11 | `https://huggingface.co/amazon` | Amazon | Groundlane `web_fetch` |
| HF12 | `https://huggingface.co/Salesforce` | Salesforce | Groundlane `web_fetch` |
| HF13 | `https://huggingface.co/cohere` | Cohere (CohereLabs) | Groundlane `web_fetch` |
| GH9 | `https://github.com/cohere-ai` | Cohere | Groundlane `web_fetch` |
| GH10 | `https://github.com/aws` | AWS | Groundlane `web_fetch` |
| GH11 | `https://github.com/apple` | Apple | Groundlane `web_fetch` |
| GH12 | `https://github.com/cloudflare` | Cloudflare | Groundlane `web_fetch` |
| GH13 | `https://github.com/IBM` | IBM | Groundlane `web_fetch` |
| GH14 | `https://github.com/salesforce` | Salesforce | Groundlane `web_fetch` |
| GH15 | `https://github.com/snowflakedb` | Snowflake | Groundlane `web_fetch` |
| GH16 | `https://github.com/databricks` | Databricks | Groundlane `web_fetch` |
| GH17 | `https://github.com/xai-org` | xAI | Groundlane `web_fetch` |
| GH18 | `https://github.com/palantir` | Palantir | Groundlane `web_fetch` |
| GH19 | `https://github.com/SAP` | SAP | Groundlane `web_fetch` |
| HF7 | `https://huggingface.co/SakanaAI` | Sakana AI | Groundlane `web_fetch` |
| HF8 | `https://huggingface.co/allenai` | AI2 / Allen Institute | Groundlane `web_fetch` |

**A2 模型公司**

| # | URL | 公司 | 工具 |
|---|-----|------|------|
| 22 | `https://mistral.ai/news` | Mistral | Groundlane `web_fetch` |
| 23 | `https://cohere.com/blog` | Cohere | Groundlane `web_fetch` |
| 24 | `https://www.ai21.com/blog` | AI21 Labs | Groundlane `web_fetch` |
| 25 | `https://www.reka.ai/news` | Reka AI | Groundlane `web_fetch` |
| 26 | `https://www.upstage.ai/blog` | Upstage | Groundlane `web_fetch` |
| 27 | `https://sakana.ai/blog` | Sakana AI | Groundlane `web_fetch` |
| 28 | `https://allenai.org/blog` | AI2 | Groundlane `web_fetch` |

**B1/B2 開發工具與框架**

| # | URL | 公司 | 工具 |
|---|-----|------|------|
| 29 | `https://cursor.com/changelog` | Cursor | Groundlane `web_fetch` |
| 30 | `https://cursor.com/blog` | Cursor | Groundlane `web_fetch` |
| 31 | `https://www.langchain.com/blog` | LangChain | Groundlane `web_fetch` |
| 32 | `https://cognition.com/blog` | Cognition/Devin | Groundlane `web_fetch` |
| 33 | `https://replit.com/blog` | Replit | Groundlane `web_fetch` |
| 34 | `https://vercel.com/blog` | Vercel | Groundlane `web_fetch` |
| 35 | `https://mastra.ai/blog` | Mastra | Groundlane `web_fetch` |
| 36 | `https://sourcegraph.com/blog` | Sourcegraph | Groundlane `web_fetch` |
| 37 | `https://www.pydantic.dev/articles` | Pydantic AI | Groundlane `web_fetch` |
| 38 | `https://agno.com/blog` | Agno | Groundlane `web_fetch` |

**中國大廠**

| # | URL | 公司 | 工具 |
|---|-----|------|------|
| 39 | `https://www.alibabacloud.com/blog` | Alibaba Cloud（技術） | Groundlane `web_fetch` |
| 39b | `https://www.alibabagroup.com/en-US/news-and-resource` | Alibaba Group（集團公告） | Groundlane `web_fetch` |
| 40 | `https://huggingface.co/Qwen` | Qwen/阿里（模型發佈） | Groundlane `web_fetch` |
| 41 | `https://github.com/QwenLM` | Qwen/阿里（repo 動態） | Groundlane `web_fetch` |
| 42 | `https://seed.bytedance.com/en/research` | ByteDance/Seed（研究） | Groundlane `web_fetch` |
| 42b | `https://www.byteplus.com/en/blog` | BytePlus（海外雲） | Groundlane `web_fetch` |
| 43 | `https://www.deepseek.com/en/news` | DeepSeek | Groundlane `web_fetch` |
| 44 | `https://huggingface.co/deepseek-ai` | DeepSeek（模型發佈） | Groundlane `web_fetch` |
| 45 | `https://www.minimaxi.com/news` | MiniMax | Groundlane `web_fetch` |
| 46 | `https://www.kimi.com/blog` | Moonshot/Kimi | Groundlane `web_fetch` |
| 47 | `https://www.sensetime.com/cn/news` | 商湯 SenseTime | Groundlane `web_fetch` |
| 48 | `https://manus.im/blog` | Manus | Groundlane `web_fetch` |
| 49 | `https://www.tencent.com/zh-cn/newsroom` | 騰訊（集團公告） | Groundlane `web_fetch` |
| 50 | `https://huggingface.co/tencent` | 騰訊（模型發佈） | Groundlane `web_fetch` |
| 50b | `https://github.com/Tencent` | 騰訊（repo 動態） | Groundlane `web_fetch` |
| 51 | `https://huggingface.co/baidu` | 百度（模型發佈） | Groundlane `web_fetch` |
| 52 | `https://github.com/baidu` | 百度（repo 動態） | Groundlane `web_fetch` |

**AI 生態 / VC / 獨立媒體**

| # | URL | 說明 | 工具 |
|---|-----|------|------|
| M1 | `https://www.ycombinator.com/blog` | Y Combinator blog | Groundlane `web_fetch` |
| M1b | `https://a16z.com/ai` | a16z AI（投資 + podcast + 文章） | Groundlane `web_fetch` |
| M1c | `https://www.bvp.com/atlas` | Bessemer Atlas（AI 分析） | Groundlane `web_fetch` |
| M1d | `https://lsvp.com/stories` | Lightspeed Stories | Groundlane `web_fetch` |
| M2 | `https://the-decoder.com` | AI 新聞（每日更新） | Groundlane `web_fetch` |
| M3 | `https://www.artificialintelligence-news.com` | AI 產業新聞 | Groundlane `web_fetch` |
| M4 | `https://www.marktechpost.com` | AI 技術新聞（每日更新） | Groundlane `web_fetch` |
| M5 | `https://simonwillison.net` | AI 開發者生態 blogger | Groundlane `web_fetch` |
| M6 | `https://www.latent.space/archive` | Latent Space（AI 深度分析） | Groundlane `web_fetch` |
