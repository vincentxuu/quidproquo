# 日報用大廠官方資料來源

> Stage 2 signals 掃描與各 routine 的事實查核用。SKILL.md 內的表格是掃描順序，這份是**每家的完整官方管道地圖**（含 release notes / changelog / status / X / GitHub / HF 等表格沒放的深層來源）。
> 最後驗證：2026-08-26。Anthropic 全部管道已逐條打開驗證；其餘以官方域名為準，引用前仍要打開確認頁面存在。

## 使用原則

- **模型/API 變化** → 該家 release notes / changelog 優先於新聞稿（更新更快、更精確）
- **重大發佈** → news/blog 官方公告頁是唯一可引用的第一手來源
- **API 故障與降速** → status page
- **X 帳號**只用於發現線索，引用一律回到官方 blog/docs 頁
- OpenAI／Meta／x.ai／Palantir／TSMC／Perplexity 等站對 curl 回 403/400 是 bot 防擋，瀏覽器可開即有效；Groundlane `web_fetch` 抓不到再換 firecrawl
- 多數文件站支援 `llms.txt` 或 RSS——寫 routine 抓取前先試這兩個，比解析 HTML 穩

---

## A1 超大廠

### Anthropic（已全驗證）

| 類型 | URL |
|---|---|
| 新聞稿 | https://www.anthropic.com/news |
| 研究/技術報告 | https://www.anthropic.com/research |
| 工程博客 | https://www.anthropic.com/engineering |
| **平台 release notes**（API/SDK/Console） | https://platform.claude.com/docs/en/release-notes/overview |
| Claude Apps release notes（claude.ai/Cowork） | https://support.claude.com/en/articles/12138966-release-notes |
| Claude Code CHANGELOG | https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md |
| 平台文件 | https://platform.claude.com/docs |
| Claude Code 文件 | https://code.claude.com/docs （機器索引：/docs/llms.txt） |
| Help Center | https://support.claude.com |
| 定價 | https://platform.claude.com/docs/en/about-claude/pricing |
| 狀態頁 | https://status.anthropic.com |
| X | @AnthropicAI、@claude_code |
| GitHub org | https://github.com/anthropics（skills / claude-code / claude-cookbooks / claude-plugins-official / claude-agent-sdk-* / anthropic-sdk-*） |

### OpenAI

| 類型 | URL |
|---|---|
| 新聞 | https://openai.com/news |
| 研究 index | https://openai.com/research/index |
| **API changelog** | https://platform.openai.com/docs/changelog |
| API 文件／定價 | https://platform.openai.com/docs、https://platform.openai.com/docs/pricing |
| Help Center | https://help.openai.com |
| 狀態頁 | https://status.openai.com |
| X | @OpenAI、@OpenAIDevs |
| GitHub org | https://github.com/openai |

### Google / DeepMind

| 類型 | URL |
|---|---|
| DeepMind blog | https://deepmind.google/blog |
| Google Research blog | https://research.google/blog |
| 官方 blog（AI 分類） | https://blog.google/technology/ai/ |
| **Gemini API changelog** | https://ai.google.dev/gemini-api/docs/changelog |
| Gemini API 文件 | https://ai.google.dev |
| Google Cloud release notes（Vertex AI） | https://cloud.google.com/release-notes |
| 狀態頁 | https://status.cloud.google.com |
| X | @GoogleDeepMind |
| GitHub org | https://github.com/google-deepmind、https://github.com/google-gemini |

### Microsoft

| 類型 | URL |
|---|---|
| Azure AI blog | https://azure.microsoft.com/en-us/blog/category/ai-machine-learning |
| AI devblogs | https://devblogs.microsoft.com/ai |
| Research blog | https://www.microsoft.com/en-us/research/blog |
| Azure OpenAI What's New | https://learn.microsoft.com/en-us/azure/ai-services/openai/whats-new |
| 狀態頁 | https://status.azure.com |
| X | @Microsoft、@Azure |
| GitHub org | https://github.com/microsoft |

### Meta

| 類型 | URL |
|---|---|
| AI blog | https://ai.meta.com/blog |
| Llama 官方頁 | https://www.llama.com |
| Newsroom | https://about.fb.com/news |
| 研究 pub 列表 | https://ai.meta.com/research/publications |
| X | @MetaAI |
| GitHub org | https://github.com/meta-llama |

### Apple

| 類型 | URL |
|---|---|
| Newsroom（Apple Intelligence） | https://www.apple.com/newsroom/topics/apple-intelligence |
| ML Research（含 Foundation Models） | https://machinelearning.apple.com |
| Developer release notes | https://developer.apple.com/news/releases |
| GitHub org | https://github.com/apple |

### Amazon / AWS

| 類型 | URL |
|---|---|
| **What's New（最即時）** | https://aws.amazon.com/about-aws/whats-new |
| AWS ML blog | https://aws.amazon.com/blogs/machine-learning |
| Bedrock 專區 | https://aws.amazon.com/blogs/aws（Bedrock 分類） |
| Amazon Science | https://www.amazon.science/blog |
| 狀態頁 | https://health.aws.amazon.com/health/status |
| GitHub org | https://github.com/aws |

### NVIDIA

| 類型 | URL |
|---|---|
| Blog | https://blogs.nvidia.com |
| Developer blog | https://developer.nvidia.com/blog |
| Research publications | https://research.nvidia.com/publications |
| X | @NVIDIAAI、@NVIDIA |
| GitHub org | https://github.com/NVIDIA |

### xAI

| 類型 | URL |
|---|---|
| News | https://x.ai/news |
| API 文件 | https://docs.x.ai |
| 狀態頁 | https://status.x.ai |
| GitHub org | https://github.com/xai-org |

---

## A2 一線模型公司

| 公司 | 公告/Blog | Docs/Changelog | GitHub/HF |
|---|---|---|---|
| Mistral | https://mistral.ai/news | https://docs.mistral.ai | GH github.com/mistralai、HF mistralai |
| Cohere | https://cohere.com/blog | https://docs.cohere.com/changelog | GH github.com/cohere-ai、HF CohereLabs |
| AI21 Labs | https://www.ai21.com/blog | https://docs.ai21.com | GH github.com/AI21Labs |
| Reka AI | https://reka.ai/news | https://docs.reka.ai | HF rekaai |
| Sakana AI | https://sakana.ai/blog | — | GH github.com/SakanaAI |
| AI2 (Allen) | https://allenai.org/blog | — | GH github.com/allenai、HF allenai |
| Twelve Labs | https://twelvelabs.io/blog | https://docs.twelvelabs.io | GH github.com/twelvelabs-io |
| Writer | https://writer.com/blog | https://dev.writer.com | — |
| Perplexity | https://www.perplexity.ai/hub | https://docs.perplexity.ai | — |

## B 推理基礎設施 / GPU 雲（pricing routine 高頻）

| 公司 | 公告/Blog | Docs | Status |
|---|---|---|---|
| Groq | https://groq.com/newsroom | https://console.groq.com/docs | https://groqstatus.com |
| Cerebras | https://www.cerebras.ai/blog | https://inference-docs.cerebras.ai | https://status.cerebras.ai |
| Together AI | https://www.together.ai/blog | https://docs.together.ai | https://status.together.ai |
| Fireworks | https://fireworks.ai/blog | https://docs.fireworks.ai | https://status.fireworks.ai |
| Modal | https://modal.com/blog | https://modal.com/docs | https://status.modal.com |
| Lambda | https://lambda.ai/blog | https://docs.lambda.ai | https://status.lambda.ai |
| RunPod | https://www.runpod.io/articles | https://docs.runpod.io | — |
| CoreWeave | https://www.coreweave.com/blog | https://docs.coreweave.com | — |
| Nebius | https://nebius.com/blog | https://docs.nebius.com | — |
| Crusoe | https://crusoe.ai/blog | https://docs.crusoecloud.com | — |

## C 開發平台 / Agent 工具（framework routine 高頻）

| 公司 | 公告/Blog | Changelog | GitHub |
|---|---|---|---|
| Cloudflare | https://blog.cloudflare.com（tag: ai） | https://developers.cloudflare.com/changelog | github.com/cloudflare |
| Vercel | https://vercel.com/blog | https://vercel.com/changelog | github.com/vercel |
| Hugging Face | https://huggingface.co/blog | https://huggingface.co/blog/zh（中文） | github.com/huggingface |
| GitHub（Copilot） | https://github.blog | https://github.blog/changelog（Copilot tag） | — |
| Cursor | https://cursor.com/blog | https://cursor.com/changelog | forum.cursor.com |
| Cognition / Devin | https://cognition.ai/blog | — | — |
| Replit | https://replit.com/blog | https://docs.replit.com/updates | github.com/replit |
| LangChain | https://www.langchain.com/blog | https://changelog.langchain.com | github.com/langchain-ai |
| LlamaIndex | https://www.llamaindex.ai/blog | — | github.com/run-llama |
| vLLM | — | releases 頁 | github.com/vllm-project |
| Pydantic AI | https://pydantic.dev/articles | — | github.com/pydantic/pydantic-ai |
| Mastra | https://mastra.ai/blog | github.com/mastra-ai/mastra/releases | github.com/mastra-ai |
| OpenRouter | https://openrouter.ai/blog | — | github.com/OpenRouter |

## D 資料平台 / 企业软件

| 公司 | 公告/Blog | GitHub |
|---|---|---|
| Databricks | https://www.databricks.com/blog | github.com/databricks |
| Snowflake | https://www.snowflake.com/blog | github.com/snowflakedb |
| IBM（Granite） | https://research.ibm.com/blog | github.com/IBM |
| Salesforce | https://www.salesforce.com/news | github.com/salesforce |
| Oracle | https://blogs.oracle.com/ai | github.com/oracle |
| Palantir | https://blog.palantir.com | github.com/palantir |
| SAP | https://news.sap.com/topics/artificial-intelligence | github.com/SAP |
| Elasticsearch | https://www.elastic.co/blog | github.com/elastic |
| MongoDB | https://www.mongodb.com/company/blog | github.com/mongodb |
| Supabase | https://supabase.com/blog | github.com/supabase |
| Neon | https://neon.com/blog | github.com/neondatabase |

## E 中國大廠（快速對照）

| 公司 | 公告/研究 | 模型動態 |
|---|---|---|
| Qwen／阿里 | https://qwenlm.github.io/blog/ | HF: huggingface.co/Qwen、GH: github.com/QwenLM |
| DeepSeek | https://api-docs.deepseek.com/news | HF: huggingface.co/deepseek-ai、GH: github.com/deepseek-ai |
| ByteDance Seed | https://seed.bytedance.com/en/research | GH: github.com/bytedance |
| Moonshot／Kimi | https://moonshotai.github.io/ | HF: huggingface.co/moonshotai |
| 智譜 GLM | https://www.zhipuai.cn/news（國內）／z.ai blog | GH: github.com/zai-org |
| MiniMax | https://www.minimaxi.com/news | HF: huggingface.co/MiniMaxAI |
| 騰訊 | https://www.tencent.com/zh-cn/newsroom | HF: huggingface.co/tencent |
| 百度 | https://ir.baidu.com/news-releases | HF: huggingface.co/baidu |
| 商湯 | https://www.sensetime.com/cn/news | — |
| Manus | https://manus.im/blog | — |
| StepFun 階躍 | https://www.stepfun.com（公告在官網） | HF: huggingface.co/stepfun-ai |
| 01.AI 零一 | https://www.01.ai/blog | HF: huggingface.co/01-ai |
| Huawei | https://www.huawei.com/en/news | GH: github.com/Ascend |

## F 硬體 / 晶片（region 與 supply chain 用）

| 公司 | 公告 |
|---|---|
| AMD | https://newsroom.amd.com |
| Intel | https://www.intc.com/news-events/press-releases、https://community.intel.com |
| Qualcomm | https://www.qualcomm.com/news |
| Broadcom | https://www.broadcom.com/company/news |
| TSMC | https://pr.tsmc.com/english/news |
