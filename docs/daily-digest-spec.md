# Daily Digest 規格

最後更新：2026-08-16

## 定位

以 AI Agent engineer 的視角，每天系統性掃描 AI 生態的學習系統。
公開在部落格上，同時作為台大資管所準備的素材庫與 portfolio。

核心目的是**學習**，不是新聞搬運。每篇結尾都要回答「我今天學到什麼」。

---

## 知識地圖：四圈模型

| 圈層 | 涵蓋面向 | 追蹤頻率 |
|---|---|---|
| **核心圈：AI Agent** | 框架（LangGraph/CrewAI/Agents SDK）、協定（MCP/A2A）、部署模式、安全與 guardrails、開發工具、MCP server 生態 | 每日 |
| **第二圈：AI 基礎層** | 模型發佈與能力邊界、推理成本與定價、Benchmark 異動（SWE-bench/Arena/Terminal-Bench）、開源模型與 GitHub trending | 每日 |
| **第三圈：應用與商業** | 企業 AI 落地案例（成敗分析）、融資與 M&A、商業模式、平台策略、法規政策（AI 法案/資料治理/AI 公平性） | 每日（法規為事件驅動） |
| **第四圈：IT 管理視角** | IT 投資報酬分析、數位轉型、組織變革、科技趨勢的 why 層 | 每週回顧 |

**不追的**：純學術非 Agent AI 研究（CV/NLP 基礎/訓練方法論）、硬體晶片、機器人——除非直接影響 Agent 生態。

---

## 資料來源

依優先級分三批建置。每個來源標註對應的圈層和可抓取方式。

### 第一批：核心來源（立刻啟用）

| 來源 | 圈層 | 餵哪種內容 | 抓取方式 |
|---|---|---|---|
| **arxiv**（cs.AI / cs.CL / cs.MA） | 第二圈 | Arxiv Digest | arxiv API |
| **GitHub Trending**（AI/Agent 相關） | 第二圈 | GitHub Digest | GitHub API |
| **Hacker News**（AI 相關帖子） | 核心＋第二圈 | 日報：社群風向 | HN API（algolia） |
| **HuggingFace**（new models / trending） | 第二圈 | 日報：模型動態 | HF API |
| **大廠官方 Blog × 20** | 核心＋第三圈 | 日報：廠商動態 | RSS / scrape |
| — Anthropic Blog | | | |
| — OpenAI Blog | | | |
| — Google AI Blog | | | |
| — Microsoft AI Blog | | | |
| — Meta AI Blog | | | |
| — NVIDIA AI Blog / Newsroom | | | |
| — Amazon / AWS AI Blog | | | |
| — xAI Blog | | | |
| — Salesforce AI Blog | | | |
| — Oracle AI Blog | | | |
| — IBM Research Blog | | | |
| — Adobe AI Blog | | | |
| — Cloudflare Blog（AI 標籤） | | | |
| — Databricks Blog | | | |
| — Snowflake Blog | | | |
| — Palantir Blog | | | |
| — Samsung AI Blog | | | |
| — Huawei Cloud Blog | | | |
| — Baidu AI Blog | | | |
| — Apple Machine Learning Journal | | | |
| **Product Hunt**（AI category） | 第二圈 | 日報：工具與生態 | API / scrape |
| **LMSYS Chatbot Arena** | 第二圈 | 日報：Benchmark 異動 | scrape |
| **SWE-bench Leaderboard** | 第二圈 | 日報：Benchmark 異動 | scrape |
| **MorphLLM Leaderboard** | 核心圈 | 日報：Coding Agent 賽道 | scrape |
| **explainx.ai** | 第二圈 | 日報：模型定價/用量追蹤 | scrape |
| **Benchmarking Agents** | 第二圈 | 日報：Agent Benchmark 追蹤 | scrape |

### 第二批：擴大覆蓋（穩定運轉後加入）

| 來源 | 圈層 | 餵哪種內容 | 抓取方式 |
|---|---|---|---|
| **Reddit** r/MachineLearning | 第二圈 | 日報：社群討論 | Reddit API |
| **Reddit** r/LocalLLaMA | 第二圈 | 日報：開源動態 | Reddit API |
| **Reddit** r/StableDiffusion | 多模態 | 日報：圖像生成社群 | Reddit API |
| **Reddit** r/aivideo | 多模態 | 日報：影片生成社群 | Reddit API |
| **VentureBeat** AI 版 | 第三圈 | 日報：產業新聞 | RSS |
| **TechCrunch** AI 版 | 第三圈 | 日報：產業新聞 | RSS |
| **The Decoder** | 第二圈 | 日報：模型動態 | RSS |
| **SiliconANGLE** | 第三圈 | 日報：產業新聞 | RSS |
| **36kr** AI 頻道 | 第三圈 | 日報：中國生態 | scrape |
| **機器之心** | 第二圈 | 日報：中國 AI 技術 | RSS / scrape |
| **iThome** | 第三圈 | 日報：台灣生態 | RSS |
| **數位時代** | 第三圈 | 日報：台灣生態 | RSS |
| **MarkTechPost** | 第二圈 | 日報：AI 技術新聞 | RSS |
| **Pandaily** | 第三圈 | 日報：中國科技（英文） | RSS |
| **Bloomberg** | 第三圈 | 日報：金融/產業新聞 | RSS |
| **Unit 42 / Palo Alto Networks** | 核心圈 | 日報：AI 資安威脅研究 | RSS / scrape |
| **The Hacker News**（資安版） | 核心圈 | 日報：資安事件 | RSS |
| **Globes** | 第三圈 | 日報：以色列科技新聞 | scrape |
| **Fortune** | 第三圈 | 日報：融資/企業動態 | RSS |
| **Forbes** | 第三圈 | 日報：產業分析/模型發布 | RSS |
| **Axios** | 第三圈 | 日報：科技新聞 | RSS |
| **SCMP (南華早報)** | 第三圈 | 日報：中國科技 | RSS / scrape |
| **Nikkei Asia** | 第三圈 | 日報：日本科技/商業 | RSS |
| **Korea Herald** | 第三圈 | 日報：韓國科技 | RSS |
| **X/Twitter 關鍵帳號** | 全部 | 日報：KOL 觀點 | scrape |
| — @simonw (Simon Willison) | | | |
| — @kaboratoff (Ethan Mollick) | | | |
| — @swyx | | | |
| — @karpathy | | | |
| — @AnthropicAI | | | |
| — @OpenAI | | | |

### 第三批：選擇性加入

| 來源 | 圈層 | 餵哪種內容 | 抓取方式 |
|---|---|---|---|
| **Crunchbase** | 第三圈 | 日報：融資數據 | API（付費） |
| **Substack KOL** | 第四圈 | 週回顧：深度觀點 | RSS |
| — Gary Marcus | | | |
| — Import AI (Jack Clark) | | | |
| — Interconnects (Nathan Lambert) | | | |
| — Ahead of AI (Sebastian Raschka) | | | |
| **HBR Technology** | 第四圈 | 週回顧：IT 管理 | ⚠️ 付費牆 |
| **Gartner / McKinsey** AI reports | 第四圈 | 週回顧：趨勢 | ⚠️ 付費牆 |
| **MCP GitHub repo**（issues/releases） | 核心圈 | 日報：協定動態 | GitHub API |
| **LangGraph / CrewAI** changelog | 核心圈 | 日報：框架更新 | GitHub API |
| **BusinessWire / PR Newswire** | 第三圈 | 日報：融資/發佈 | RSS |
| **aifunding.me** | 第三圈 | 日報：Agent 融資追蹤 | scrape |
| **Dealroom** | 第三圈 | 日報：Startup 數據 | scrape |
| **The Japan Times** | 第三圈 | 日報：日本 AI 政策 | RSS |
| **PricePerToken** | 第二圈 | 日報：模型成本比較 | scrape |
| **OWASP LLM Top 10** | 核心圈 | 日報：Agent 安全攻擊面 | scrape |
| **MITRE ATLAS** | 核心圈 | 日報：AI 威脅矩陣 | scrape |
| **AI Incident Database** | 核心圈 | 日報：真實 AI 事故 | RSS / scrape |
| **Civitai** | 多模態 | 圖像生成模型/社群趨勢 | scrape |
| **OmniDocBench** | 第二圈 | OCR benchmark 排名 | scrape |
| **Cursor Blog / Changelog** | 核心圈 | Coding Agent 龍頭動態 | RSS |
| **Warp Blog** | 核心圈 | AI 終端機 + Agent 編排 | RSS |
| **Levelop** | 核心圈 | Coding Agent 比較/排名 | scrape |
| **Runway / Pika / Midjourney Blog** | 多模態 | 影片/圖像生成官方更新 | RSS / scrape |
| **OCR / Document AI 全追蹤** | 第二圈 | OCR 模型與工具進展 | 混合 |
| — PaddleOCR GitHub releases | | 最高 stars，版本更新頻繁 | GitHub API |
| — Surya / Datalab Blog + GitHub | | 開源 OCR 最準 | RSS / GitHub API |
| — Docling GitHub releases | | IBM 開源，結構化文件 | GitHub API |
| — Tesseract GitHub releases | | 經典 OCR，社群大 | GitHub API |
| — Mistral OCR（Mistral Blog） | | 模型廠出的 OCR | RSS |
| — Google Document AI Blog | | 雲端 OCR 更新 | RSS |
| — AWS Textract What's New | | 雲端 OCR 更新 | RSS |
| — Azure AI Document Intelligence Blog | | 雲端 OCR 更新 | RSS |
| — OmniDocBench（benchmark） | | OCR 準確率排名 | scrape |
| — olmOCR-bench（benchmark） | | OCR 品質評測 | scrape |

### 公司 Watchlist

Routine 每日掃描時，比對此清單決定哪些動態值得納入日報。清單維護在 `src/data/agent-watchlist.json`，routine 可讀取但只能**建議**修改，最終由人工拍板。

---

### A. 基礎層（模型、推理、基礎設施）

#### A1. 大廠（21 家）

大廠不只追官方 Blog——每家的動態要從官方公告、產業新聞、社群討論、VC 分析多個來源交叉掃描。

**模型 / AI 核心廠**

| 公司 | 追蹤重點 |
|---|---|
| Anthropic | Claude Code、MCP、Cowork |
| OpenAI | Codex、Agents SDK、ChatGPT Agent |
| Google | Gemini、A2A、Vertex AI Agent Builder |
| Microsoft | Copilot、Azure Foundry、Microsoft Agent Framework (MAF，AutoGen + Semantic Kernel 的繼任者，1.0 GA) |
| Meta | Llama 開源生態 |
| Amazon | Bedrock Agents、Nova |
| NVIDIA | 推理基礎設施、Nemotron |
| Apple | Apple Intelligence（有動態才追） |
| xAI | Grok、開源動態 |

**企業平台 / 基礎設施大廠**

| 公司 | 追蹤重點 |
|---|---|
| Salesforce | Agentforce，企業 Agent 最大平台 |
| Oracle | Oracle AI Agent、企業雲 AI |
| IBM | watsonx、企業 AI |
| Adobe | Firefly、GenStudio、AI 創意工具鏈 |
| Cloudflare | Workers AI、Vectorize、AI Gateway、Agents SDK |
| Databricks | 資料 + AI 平台、Mosaic ML |
| Snowflake | Cortex、資料 + AI |
| Palantir | AIP 平台、FDE 模式原創者 |
| Samsung | Galaxy AI、端側 AI |
| Huawei | CloudRobo、AI 基礎設施 |
| Baidu | 文心、中國搜尋 + AI |
| SAP | AI Agent Hub、企業軟體巨頭 |

#### A2. AI 模型 / 平台公司（9 家）

查驗日期：2026-08-16。不只做模型——多數已擴展為模型 + 推理 + 平台 + 垂直解決方案。

| 公司 | 國家 | 追蹤重點 |
|---|---|---|
| Mistral | 法國 | 模型（Small/Medium/Large）+ Mistral Compute AI 雲 + OCR + Vibe Agent + 工業 AI（收購 Emmi）+ 主權 AI（Airbus/BMW/歐洲政府）+ Microsoft 戰略合作 |
| Cohere | 加拿大 | 企業 RAG + Command 系列 + Rerank + 正在收購 Aleph Alpha（$20B 合併估值）+ $240M ARR |
| Aleph Alpha | 德國 | 歐洲主權 AI + Bundeswehr 客戶 + STACKIT（Schwarz Group）+ 正被 Cohere 收購 |
| AI21 Labs | 以色列 | Jamba 系列 + 企業 LLM |
| Reka AI | 美國/新加坡 | 多模態模型 + $170M 融資（NVIDIA/Snowflake 投資）|
| Upstage | 韓國 | Solar Pro 3 + Document AI/Parse + 日本市場（Syn Pro）+ 韓國主權 AI |
| Writer | 美國 | Palmyra 企業 LLM + 企業 AI 平台 |
| Sakana AI | 日本 | 進化式 AI 研究 + 前 Google Brain 創辦 |
| AI2 / Allen Institute | 美國 | OLMo 開源模型 + olmOCR（非營利研究機構）|

#### A3. 推理基礎設施（13 家）

| 公司 | 追蹤重點 |
|---|---|
| Together AI | 開源模型託管、推理成本 |
| Fireworks | 低延遲推理 |
| Groq | LPU 硬體推理 |
| Cerebras | wafer-scale 推理 |
| CoreWeave | GPU 雲端，$12B+ 估值 |
| Lambda Labs | GPU 雲端，$800M 融資 |
| Anyscale (Ray) | 分散式 AI 計算框架 |
| Ollama | 本地跑 LLM，開源 |
| vLLM | 開源推理引擎 |
| Baseten | 模型服務，$13B 估值，Cursor/Notion/Mercor 客戶 |
| Nebius | 前 Yandex，$4.3B 融資，Meta 合作 |
| RunPod | GPU 雲，$1B 獨角獸，1M+ 開發者 |
| Modular | 收購 BentoML，Mojo/Max 統一 AI 計算 |

#### A4. Gateway / 模型路由（4 家）

| 公司 | 追蹤重點 |
|---|---|
| LiteLLM (BerriAI) | 開源多模型 proxy，4.18 億月下載 |
| Portkey（Palo Alto Networks 旗下） | AI gateway + 可觀測性（2026/5 被收購，仍運作） |
| OpenRouter | 多模型聚合 |
| Martian | AI 自動模型選擇路由，~$1.3B 估值 |

---

### B. Agent 開發工具鏈

#### B1. Coding AI / 開發工具（19 家）

| 公司 | 追蹤重點 |
|---|---|
| Cursor (Anysphere) | IDE-first，$500M ARR，Background Agents |
| Cognition（Devin） | 自主 Coding Agent 標竿 |
| Windsurf (Codeium) | Coding Agent 競爭者 |
| Replit | 雲端開發 + Agent |
| Augment Code | $252M Series B，企業 Coding Agent |
| Poolside AI | $500M Series B，大量融資 |
| Magic AI | $465M Series B，長 context |
| Factory AI | 企業級自主 Coding Agent |
| Lovable | $100M ARR，對話式全端生成 |
| Bolt (StackBlitz) | 瀏覽器內全端 Agent |
| Cline | 開源 VS Code Agent，MCP-native |
| Aider | CLI-based Coding Agent，開源 |
| Blitzy | 全專案自主 Coding Agent，$1.4B 估值 |
| Emergent | 印度 Coding Agent 獨角獸，$1.5B |
| Warp | AI 終端機 + Oz 雲端 Agent 編排，開源 |
| Orca | Agent Development Environment，多 Agent 多 worktree 並行，開源 |
| v0 (Vercel) | Agentic 全端 app builder |
| Sourcegraph (Cody) | AI 程式碼智能，$225M Series D |
| OpenHands | 開源 AI 軟體工程師（前 OpenDevin） |

#### B2. Agent 框架 / 編排（14 家）

查驗日期：2026-08-16。大廠 SDK（OpenAI Agents SDK / Google ADK / Claude Agent SDK / MAF）跟著大廠追蹤，此處列獨立框架。

**活躍開發中**

| 框架 | 語言 | Stars | 追蹤重點 |
|---|---|---|---|
| LangChain / LangGraph | Python, JS/TS | 38.4k | 生產最廣（Uber/LinkedIn/Klarna），graph-based，1.x |
| CrewAI | Python | 56.3k | 最大獨立社群，role-based multi-agent，1.x |
| Pydantic AI | Python | 18.9k | type-safe，FastAPI 式 DX，2.x |
| Mastra | TypeScript | 26.7k | TypeScript 唯一首選，workflows + RAG + evals，1.x |
| Agno | Python | 41.5k | Agentic Index 排名第一，多模型靈活 |
| Composio | Python | 29.4k | Agent 工具聚合，200+ 整合 |
| Haystack (deepset) | Python | 19k+ | Pipeline/RAG 框架，模組化 |
| DSPy (Stanford) | Python | — | 程式化 LLM 框架，prompt 最佳化 |
| smolagents (HuggingFace) | Python | — | 輕量開源框架，開源模型友善 |
| LlamaIndex | Python | — | RAG 編排框架 + LlamaParse |

**持久執行 / Workflow 引擎**（Agent 生產架構的底層）

| 框架 | 追蹤重點 |
|---|---|
| Temporal | 持久執行引擎，$5B 估值，Agent 長時序任務的生產架構 |
| Inngest | Serverless workflow + Agent |

**維護模式 / 社群 fork**（仍需追蹤動態，但不建議新專案採用）

| 框架 | 狀態 | 追蹤重點 |
|---|---|---|
| AG2 | 社群維護 | AutoGen 社群 fork，v1.0，A2A 支援 |
| AutoGen | ❌ 維護模式 | 不再開發，遷移到 MAF 或 AG2 |

#### B3. Agent 平台 / Builder（11 家）

| 公司 | 追蹤重點 |
|---|---|
| Dify | 開源 Agent 平台，self-hosted，內建 RAG |
| n8n | 開源自動化 + Agent，$50M Series B |
| Relevance AI | 低代碼 Agent builder |
| Lindy.ai | 個人 Agent 平台 |
| Stack AI | 企業 Agent builder |
| Botpress | 對話式 Agent 平台 |
| Dust | 歐洲企業 workspace Agent |
| Zapier Agents | 自動化巨頭的 Agent 化 |
| Langflow (DataStax) | 開源 graph-style LLM builder |
| Voiceflow | 對話式 Agent builder |
| Vellum | 視覺 + 程式碼 AI 平台，prompt 管理 + eval |

#### B4. Agent 記憶 / Context（6 家）

| 公司 | 追蹤重點 |
|---|---|
| Mem0 | 向量記憶層，62k stars，AWS Agent SDK 獨家整合，$24.5M 融資 |
| Zep | 時序知識圖譜（Graphiti），sub-200ms 檢索，SOC 2 / HIPAA |
| Letta | OS 式三層記憶（core/recall/archival），$10M seed，Felicis 領投 |
| LangMem (LangChain) | LangGraph 原生記憶模組 |
| Cognee | 非結構化文件→知識圖譜，開源 |
| Cloudflare Agent Memory | 型別化記憶系統（Facts/Events/Instructions/Tasks），beta |

#### B5. Agent 身分 / 認證（4 家）

| 公司 | 追蹤重點 |
|---|---|
| Auth0（Okta 旗下） | Agent as Principal — Agent 作為一等身分，Early Access |
| Okta | Okta for AI Agents — Agent-to-Agent 連線、MCP Bridge、kill switch |
| cidaas | 歐洲 Agent IAM，OAuth 2.1 MCP/A2A 認證，PSD2 等級 consent |
| Gravitee | Agent IAM + AI Gateway，SPIFFE/SPIRE 身分，MCP token 交換 |

#### B6. Agent 可觀測性 / 評估（10 家）

| 公司 | 追蹤重點 |
|---|---|
| Arize AI | Agent 可觀測性 + Phoenix 開源 |
| Braintrust | AI 評估，$800M 估值 |
| Langfuse（ClickHouse 旗下） | 開源 LLM 可觀測性（2026/1 被收購，開源繼續） |
| Helicone（Mintlify 旗下） | 開源 AI gateway（2026/3 被收購，⚠️ 維護模式） |
| Laminar | 開源 Agent 除錯 |
| AgentOps | Agent 可觀測性 |
| LangSmith | LangChain 原生可觀測性 |
| Galileo AI | AI 評估 + 幻覺偵測 |
| Confident AI (DeepEval) | 開源 eval，50+ 指標 |
| HoneyHive | 統一可觀測性 + 評估，$9.3M |

#### B7. Agent 安全 / 治理 / 資安技術（11 家）

| 公司 | 追蹤重點 |
|---|---|
| Zenity | 企業 Agent 行為監控 |
| Protect AI | ML 供應鏈安全 |
| Lakera | prompt injection 防護（技術層） |
| Guild.ai | Agent 控制面板 |
| WitnessAI | Agent 信任平台 |
| Netzilo | 跨平台 agent runtime governance + kill switch |
| Invariant Labs | Agent 安全研究、formal verification |
| Hidden Layer | AI 模型安全（adversarial ML） |
| Prompt Security | prompt injection 防禦技術 |
| Lasso Security | LLM 安全平台 |
| Straiker | AI Agent 安全，$21M（Lightspeed 領投） |

**資安技術學習資源**（routine 定期掃描）：

| 資源 | 用途 |
|---|---|
| OWASP LLM Top 10 | Agent/LLM 最常見攻擊面分類 |
| MITRE ATLAS | AI 系統的對抗性威脅矩陣（類似 ATT&CK） |
| NIST AI RMF | AI 風險管理框架 |
| AI Incident Database | 真實 AI 事故案例庫 |
| AgentBeats（開源） | 自適應多輪 Agent 攻防測試平台 |
| Simon Willison 的 prompt injection 系列 | 最佳技術解說來源 |

#### B8. 沙箱 / 執行環境（6 家）

| 公司 | 追蹤重點 |
|---|---|
| E2B | 開源程式碼沙箱 |
| Modal | Serverless GPU |
| Tensorlake | Agent 沙箱 + 持久儲存 |
| Celesto | microVM 沙箱 |
| Replicate | 模型 API + 執行 |
| Riza | 程式碼執行 API，數十億次/月 |

---

### C. Agent 能力層

#### C1. 搜尋 API / Answer Engine（9 家）

| 公司 | 追蹤重點 |
|---|---|
| Perplexity | AI 搜尋、answer engine，$250M Series C |
| You.com | AI 搜尋引擎，$90M Series B |
| Exa | 語意搜尋 API（Agent 用） |
| Tavily | 搜尋 API（Agent 用，多個 routine 採用） |
| Jina AI | embeddings + 搜尋 API + Reader |
| Firecrawl | 網頁抓取 + 結構化搜尋 API |
| Serper | Google SERP API（Agent 常用） |
| Brave Search | 隱私導向 AI 搜尋，有 API |
| Parallel | 自建 web index，SimpleQA 最高準確率 |

#### C2. 文件解析 / OCR / Document AI

文件解析依你的三層階梯架構分類（見 /series/document-parsing/）。

**轉換層（有文字層，重新序列化，毫秒級）**

| 工具 | 追蹤重點 |
|---|---|
| anydoc（Firecrawl） | Rust，14 種辦公格式，4.7ms 中位耗時，MIT |
| MarkItDown（Microsoft） | Python，含圖片 OCR/音訊轉文字，格式廣 |

**抽取層（有文字沒結構，啟發式規則，十毫秒級）**

| 工具 | 追蹤重點 |
|---|---|
| PyMuPDF / pymupdf4llm | 最快，⚠️ AGPL-3.0 授權 |
| pdfplumber | MIT，表格最強，可視化除錯 |
| Xberg | Rust 重寫，多語綁定 + MCP server |

**解析層 — Pipeline 式（模型推斷，百毫秒到秒級）**

| 工具 | 追蹤重點 |
|---|---|
| MinerU | 開源，MinerU2.5-Pro VLM，OmniDocBench 90.67，⚠️ $20M 月營收需另談授權 |
| Marker v2（Datalab） | 開源程式碼 Apache-2.0，⚠️ 模型權重 OpenRAIL-M 過門檻要付費 |
| Docling（IBM → Linux Foundation） | MIT，最乾淨授權，VlmPipeline 新增 |

**解析層 — 端到端 VLM**

| 工具 | 追蹤重點 |
|---|---|
| olmOCR（AllenAI） | 7B，Apache-2.0 |
| dots.ocr | 3B，olmOCR-bench 83.9 |
| Chandra（Datalab） | 4B，手寫最準，多格式輸出 |
| DeepSeek-OCR | 視覺 token 壓縮實驗，研究方向 |

**OCR 引擎**

| 工具 | 追蹤重點 |
|---|---|
| PaddleOCR（Baidu） | 85k stars，PP-OCRv6，50 語言統一模型，吞吐量最高 |
| Surya OCR（Datalab） | 650M 參數，olmOCR-bench 83.3，髒文件最準 |
| RapidOCR | 零配置、1.5s/頁、免費，實務粗篩首選 |
| Tesseract | 經典 OCR，75k stars，100+ 語言 |
| EasyOCR | 80+ 語言，入門簡單 |
| Mistral OCR | 模型廠出的 OCR |
| PaddleOCR-VL | 0.9B VLM，OmniDocBench v1.6 96.3% |

**商業 API**

| 公司 | 追蹤重點 |
|---|---|
| Reducto | Agentic 文件平台，$108.5M，龍頭 |
| LlamaParse（LlamaIndex） | ParseBench 領先，⚠️ 自家 benchmark |
| LandingAI | Andrew Ng，Agentic Document Extraction |
| Unstructured | 非結構化文件解析 |
| Google Document AI | 雲端 |
| AWS Textract | 雲端 |
| Azure Document Intelligence | 雲端 |
| Firecrawl parse | 雲端，你的 routine 在用 |

**Benchmark**

| Benchmark | 測什麼 |
|---|---|
| OmniDocBench | 文件解析整體準確率 |
| olmOCR-bench（AllenAI） | OCR 品質 |
| ParseBench（LlamaIndex） | 企業文件解析（⚠️ 自家產品第一，注意偏誤） |
| anydoc benchmark（Firecrawl） | 轉換層速度與品質 |

#### C3. 向量資料庫（8 家）

| 公司 | 追蹤重點 |
|---|---|
| Weaviate | 開源向量資料庫 |
| Pinecone | 託管向量資料庫 |
| Chroma | 開源向量資料庫 |
| Qdrant | 開源向量資料庫（CrewAI Edge memory） |
| Milvus / Zilliz | 開源向量資料庫，$113M Series C |
| Turbopuffer | Serverless 向量 DB，Cursor/Notion/Linear 採用 |
| LanceDB | Arrow-native 嵌入式向量 DB |
| pgvector / pgvectorscale | PostgreSQL 向量擴充，「just use Postgres」趨勢 |

#### C4. 瀏覽器 / 電腦操控 Agent（5 家）

| 公司 | 追蹤重點 |
|---|---|
| browser-use | 開源 Playwright + LLM，107k stars，瀏覽器 Agent 標準 |
| Browserbase | Agent 瀏覽器基礎設施 |
| Skyvern | 視覺型瀏覽器自動化，CAPTCHA/2FA 處理 |
| Multion | 瀏覽器自主 Agent |
| Steel | 瀏覽器自動化基礎設施 |

#### C5. 語音 AI / Voice Agent（9 家）

| 公司 | 追蹤重點 |
|---|---|
| Vapi | 語音 Agent 基礎設施 |
| Retell | 語音 Agent 開發平台 |
| Bland AI | 大規模外撥語音 |
| ElevenLabs | 語音合成 + 對話式 AI |
| PolyAI | 語音客服 Agent，$200M Series D |
| Parloa | 語音客服 Agent，$560M Series D，歐洲 |
| Synthflow | 語音 Agent 平台 |
| Cartesia | 低延遲語音模型 |
| LiveKit | 即時語音/影片 Agent 基礎設施 |

#### C6. 多模態 AI 生成工具

**圖像生成**

| 公司/產品 | 追蹤重點 |
|---|---|
| Midjourney | 圖像生成龍頭 |
| Stability AI | Stable Diffusion 開源生態 |
| Black Forest Labs | FLUX 模型系列 |
| Ideogram | 文字渲染最強的圖像模型 |

**影片生成**

| 公司/產品 | 追蹤重點 |
|---|---|
| Runway | Gen-3 影片生成 |
| Pika | 影片生成 |
| Luma Labs | Dream Machine 影片生成 |
| Kling（快影/快手） | 中國影片生成，開源 |
| Sora（OpenAI） | 影片生成（大廠產品） |
| Veo（Google） | 影片生成（大廠產品） |

**音樂/音訊生成**

| 公司/產品 | 追蹤重點 |
|---|---|
| Suno AI | AI 音樂生成 |
| Udio | AI 音樂生成 |

**語音合成/克隆**

| 公司/產品 | 追蹤重點 |
|---|---|
| ElevenLabs | 語音合成 + 克隆（也列在語音 AI） |
| Play.ht | 語音合成 API |
| Cartesia | 低延遲語音模型 |

**3D / 空間**

| 公司/產品 | 追蹤重點 |
|---|---|
| Meshy | AI 3D 模型生成 |
| Tripo | AI 3D 生成 |

---

### D. 垂直應用 / 產業 Agent

#### D1. 客服 / CX（6 家）

| 公司 | 追蹤重點 |
|---|---|
| Sierra AI | Bret Taylor 的 CX 平台，$10B 估值 |
| Decagon | 企業客服 Agent |
| Intercom (Fin) | 老牌客服 + Agent 化 |
| Ada | 客服自動化 |
| Forethought | 客服 Agent |
| Zendesk | 客服 AI，企業市佔大 |

#### D2. Sales / GTM（3 家）

| 公司 | 追蹤重點 |
|---|---|
| Clay | 外展數據 + Agent 編排 |
| 11x | AI SDR（Alice / Jordan） |
| Artisan | AI SDR |

#### D3. HR / 招募（5 家）

| 公司 | 追蹤重點 |
|---|---|
| Mercor | AI 招募平台，$350M Series C，$2B 估值 |
| Eightfold AI | Talent Intelligence Platform，$396M 融資，Oracle 整合 |
| Phenom | Applied AI for HR，Agent 驅動招募 |
| HireVue | AI 面試 Agent，收購 Hireguide，$150M 營收 |
| Findem | HR AI 引擎，$105M 融資 |

#### D4. 法律 AI（3 家）

| 公司 | 追蹤重點 |
|---|---|
| Harvey | 法律 AI，$5B 估值，AmLaw 100 |
| Leya | 歐洲法律 AI，多法域 |
| Ironclad | 合約管理 + AI，$333M Series E |

#### D5. 醫療 AI（4 家）

| 公司 | 追蹤重點 |
|---|---|
| Abridge | 醫療臨床文檔 |
| Hippocratic AI | 醫療 Agent |
| Suki AI | 臨床文檔，$70M Series C |
| Ambience Healthcare | 醫療環境 AI |

#### D6. 金融服務 / 保險（6 家）

| 公司 | 追蹤重點 |
|---|---|
| Hebbia | 金融研究 Agent |
| Hadrius | 金融合規 Agent，$27M，500+ 金融機構 |
| Taktile | 高風險金融決策自動化，$110M，Goldman Sachs 投資 |
| Poetic | 合規 + 承保自動化，$50M，OpenAI 投資 |
| Pints AI | 受監管金融機構的可稽核 Agent，東南亞 |
| Aveni | 英國金融 AI，Agent Assure 治理，£12M |

#### D7. Data Analytics / BI（5 家）

| 公司 | 追蹤重點 |
|---|---|
| Cube | Agentic analytics，語意層 + MCP，Brex/Drata/Alcon 客戶 |
| Wren AI | 開源 agentic GenBI，20+ 資料來源，MDL 語意模型 |
| Semaphor | Agent-native BI，內嵌 + 多租戶 |
| Knowi | Agentic BI，70+ 資料源直連，私有 AI |
| Definite | AI-native 資料平台，MCP 原生，500+ connectors |

#### D8. Retail / 電商（3 家）

| 公司 | 追蹤重點 |
|---|---|
| Bloomreach | Loomi agentic 個人化平台，1,400+ 品牌 |
| Gorgias | 電商客服 + Shopping Assistant Agent |
| Shopbox AI | AI 商務層，即時個人化 |

#### D9. 工業 / 製造 / 供應鏈（4 家）

| 公司 | 追蹤重點 |
|---|---|
| Trimble | Arc Agent，供應鏈自動化，1M+ 卡車網路 |
| Plataine | 製造 AI Agent，Digital Twin，航太/國防客戶 |
| Eyelit | Agent EyeQ，MES/APS/SIOP，1,700+ 可呼叫操作 |
| Infor | Industry AI Agents，供應鏈規劃 |

#### D10. 企業 AI 平台（4 家）

| 公司 | 追蹤重點 |
|---|---|
| Moveworks | 企業 IT Agent，$305M 融資 |
| Glean | 企業知識搜尋 + Agent，$7.2B 估值 |
| ServiceNow | 企業 IT Agent（Now Assist） |
| UiPath | RPA → Agentic Automation 轉型 |

#### D11. Workflow 自動化（3 家）

| 公司 | 追蹤重點 |
|---|---|
| Make (Integromat) | 視覺化自動化 + Agent 層 |
| Activepieces | 開源 Zapier 替代 |
| Bardeen | 瀏覽器自動化 + Agent |

---

### E. FDE / AI 部署服務（4 家）

| 公司 | 追蹤重點 |
|---|---|
| Scale AI | 資料標註 → AI 部署，FDE 團隊 |
| Cognizant | EMEA AI Unit，企業 Agent PoC → 生產的 delivery model |
| Accenture | 企業 AI 部署服務，全球最大 SI |
| Anduril | 國防 AI 部署，FDE 重度使用者 |

---

### F. 區域生態

#### F1. 中國 AI 生態

**模型 / 平台（9 家）**

| 公司 | 追蹤重點 |
|---|---|
| DeepSeek | 開源模型 + Coding Agent + 推理定價破壞者 |
| 智譜 Zhipu | GLM 系列 + AutoGLM Agent + tool-use 生態 |
| 阿里（通義/Qwen） | Qwen 開源模型 + Qwen Office Agent 平台 + 阿里雲 AI 服務 + 釘釘整合 |
| ByteDance（豆包/Coze） | 豆包模型 + Coze Agent 平台（全球用戶）+ 企業 Agent |
| 美團 | LongCat 開源 + Agentic Coding + 國產 ASIC 訓練 |
| 百川 | 企業場景 + 搜尋增強 |
| 月之暗面（Moonshot/Kimi） | Kimi 長 context 產品 + K3 開源 + Arena 編碼榜 |
| 騰訊（混元） | 混元模型 + 企業微信 AI + 企業 AI Office |
| MiniMax | MiniMax-M3 模型 + 語音/影片生成（海螺 AI）|

**應用 / 硬體（5 家）**

| 公司 | 追蹤重點 |
|---|---|
| 小米 | 端側 AI、MiMo 系列、Arena top 10 |
| 商湯 SenseTime | 日日新模型、企業 AI |
| 科大訊飛 iFlytek | 語音 AI、星火模型 |
| 釘釘 (DingTalk) | 企業 Agent 平台（Qwen Office 整合） |
| Manus | 通用 AI Agent（被收購），瀏覽器自動化 |

**政策 / 研究機構**

| 機構 | 追蹤重點 |
|---|---|
| 中國國家網信辦 (CAC) | AI 法規（生成式 AI 管理辦法、演算法備案） |
| 中國科學院 (CAS) | AI 基礎研究 |
| WAIC（世界人工智慧大會） | 年度重要發佈場合 |

**中國來源**（已在第二批來源）：36kr、機器之心、Pandaily、SCMP、tmtpost

#### F2. 台灣（14 家 + 4 機構）

**AI / Agent 公司**

| 公司 | 追蹤重點 |
|---|---|
| 台智雲 | 台灣 AI 基礎設施，營收年增雙位數 |
| MaiAgent | 台灣 Agent SaaS，亞太 18 市場經銷 |
| iKala | AI 行銷/社群商務 |
| Kdan | AI 文件/生產力工具 |
| Appier | AI 行銷科技，台灣 AI 獨角獸 |
| CloudMile | Google Cloud AI 合作夥伴 |
| iGroup | MaiAgent 亞太經銷夥伴 |

**硬體 / 基礎設施**

| 公司 | 追蹤重點 |
|---|---|
| 聯發科 (MediaTek) | 端側 AI 晶片，ASIC 業務 $1B，Agent-first PC |
| QCT (Quanta Cloud) | AI 伺服器，MaiAgent COMPUTEX 夥伴 |
| 台積電 (TSMC) | AI 晶片製造，影響整個 Agent 基礎設施 |
| 廣達 (Quanta) | AI 伺服器/邊緣運算 |

**資安**

| 公司 | 追蹤重點 |
|---|---|
| 趨勢科技 (Trend Micro) | AI 資安、Agent 安全研究 |
| 奧義智慧 (CyCraft) | 台灣 AI 資安新創，MDR 服務 |
| TeamT5 | 威脅情報，APT 追蹤 |

**研究 / 政策機構**

| 機構 | 追蹤重點 |
|---|---|
| 數位發展部 (moda) | 台灣 AI 政策、資安法規 |
| 工研院 (ITRI) | AI 技術研發 |
| 資策會 (III) | AI 產業推動、政策研究 |
| 國家資通安全研究院 (NICS) | 資安研究與事件應變 |

#### F3. 日韓（4 家）

| 公司 | 追蹤重點 |
|---|---|
| SoftBank | Agent 生態投資者（Zenity、Sierra Japan）+ 主權 AI |
| NTT DATA | AI Agent Service 全球開放，FDE 模式 |
| NAVER | Shopping AI Agent，韓國市場 |
| LG Technology Ventures | AI Agent 資安領域投資（Zenity C 輪） |

#### F4. 歐洲（6 家 + 法規）

| 公司 | 國家 | 追蹤重點 |
|---|---|---|
| Mistral | 法國 | 開源模型、歐洲 AI 冠軍（已在 A2，此處追蹤歐洲政策面） |
| Aleph Alpha | 德國 | 歐洲主權 AI，政府/國防客戶 |
| Dust | 法國 | 企業 workspace Agent 平台（已在 B3） |
| DeepL | 德國 | AI 翻譯，企業 Agent 工具鏈 |
| Poolside AI | 法國/美國 | Coding Agent，$500M Series B（已在 B1） |
| Stability AI | UK | 開源圖像生成（已在 C6） |

**歐洲法規追蹤**：
- EU AI Act（全球影響力最大的 AI 法規，2026 部分條款生效）
- UK AI Safety Institute
- GDPR 對 AI Agent 的影響

**歐洲來源**：
- The Register（UK 科技）、Sifted（歐洲新創）、EU AI Act 官方文件

#### F5. 以色列（4 家）

| 公司 | 追蹤重點 |
|---|---|
| Zenity | Agent 治理（已在 B7，此處追蹤以色列生態） |
| Run:ai（NVIDIA 旗下） | GPU 編排 |
| AI21 Labs | LLM（已在 A2） |
| Lightricks | AI 創意工具 |

以色列 Unit 8200 出身的 AI 公司密度全球最高，新創雷達特別留意此區域。

#### F6. 新加坡 / 東南亞（3 家 + 2 機構）

| 公司 | 國家 | 追蹤重點 |
|---|---|---|
| Pints AI | 新加坡 | 受監管金融 Agent（已在 D6） |
| Sea Group (Shopee) | 新加坡 | 電商 AI、東南亞最大科技公司 |
| Grab | 新加坡 | 超級 App + AI |

| 機構 | 追蹤重點 |
|---|---|
| MAS（新加坡金管局） | AI 治理先行者，Agent 相關指引 |
| AI Singapore (AISG) | 國家 AI 計畫、SEA LION 模型 |

#### F7. 印度（3 家）

| 公司 | 追蹤重點 |
|---|---|
| Emergent | Coding Agent 獨角獸，$1.5B（已在 B1） |
| Krutrim | 印度自研 LLM，Ola 創辦人 |
| Sarvam AI | 印度語言 LLM，$41M Series A |

#### F8. 中東（3 家）

| 公司/機構 | 國家 | 追蹤重點 |
|---|---|---|
| G42 | UAE | AI 基礎設施，Microsoft 合作，$1.5B 融資 |
| MBZUAI | UAE | AI 研究大學，Falcon 模型 |
| SDAIA | 沙烏地 | 國家 AI 戰略 |

---

**合計約 230 家獨立實體 + 10 個研究/政策機構，6 大分類 35+ 個子類別。**

#### Watchlist 自動維護機制

**新增候選觸發條件**（routine 在掃描時自動偵測）：
- 不在清單上的公司，一週內在來源中出現 3+ 次
- GitHub 新 repo 一週內破 1k stars
- 完成 Series A 以上融資
- Benchmark 排行榜新進入者

#### 新創雷達（每週固定掃描）

除了被動偵測，routine 每週主動掃描以下來源發掘早期新創：

| 來源 | 頻率 | 能多早發現 | 掃描方式 |
|---|---|---|---|
| **Y Combinator** batch 公告 | 每季（Demo Day 前後密集掃） | 成立 3-6 個月 | YC 官網 / HN Launch 帖 |
| **Hacker News "Show HN"** | 每日（已在日常掃描中） | 上線第一天 | HN API，篩 AI/Agent 關鍵字 |
| **Product Hunt** AI 類 | 每日（已在日常掃描中） | 上線當天 | PH API |
| **GitHub Trending** | 每日（已在日常掃描中） | 開源起步時 | GitHub API |
| **VC portfolio 頁面** | 每週 | 融資公告前後 | scrape 以下 VC 的 portfolio 頁 |
| — a16z AI portfolio | | | |
| — Sequoia AI portfolio | | | |
| — Benchmark | | | |
| — Lightspeed | | | |
| — Accel | | | |
| — Index Ventures | | | |
| — Greylock | | | |
| **aifunding.me** | 每日 | 即時 | scrape |
| **Crunchbase** AI Agent 類 | 每週 | 融資公告時 | API（付費）/ scrape |
| **Dealroom** | 每週 | 融資公告時 | scrape |
| **X/Twitter 創辦人圈** | 每日 | 比新聞早 1-2 天 | 追蹤 AI 創辦人互相 RT |
| **AI 大會展商/贊助商名單** | 事件驅動 | 大會前 1-2 個月 | scrape |
| — AI Engineer Summit | | | |
| — NeurIPS / ICML sponsors | | | |
| — TechCrunch Disrupt AI | | | |
| — COMPUTEX（台灣相關） | | | |

**新創雷達的輸出**：週回顧加一個固定段落「本週新創雷達」，列出本週發現的新公司（名稱、做什麼、融資階段、為什麼值得注意），由人工決定是否加入 watchlist。

**移除候選觸發條件**（寧可多追不要漏掉）：
- 公司已**確認關閉或被收購且產品下線**（被收購但產品持續運作的不移除，例如 Langfuse 被 ClickHouse 收購後仍活躍）
- 產品方向**明確宣佈**轉離 Agent 領域（不是猜測、不是「最近沒發佈」）
- 沒有動態**不構成移除理由** — AI 公司可能在 stealth 開發，幾個月沒新聞不代表死了

**注意**：移除的門檻要遠高於新增。加一家只需要出現 3 次，但移除需要確認性的負面信號。寧可清單稍長、多追幾家不重要的，也不要因為「最近沒動靜」就漏掉即將有大動作的公司。

**更新方式**：週回顧底部固定段落「Watchlist 更新建議」，列出本週的新增/移除候選。移除候選必須附上確認來源（關閉公告、收購新聞、官方轉型聲明）。人工確認後修改 `src/data/agent-watchlist.json`。

### 來源使用原則

1. **交叉驗證**：同一事件至少從兩個獨立來源確認後才寫入日報
2. **一手優先**：官方 Blog > 產業新聞 > 社群討論。能連到一手公告就不引二手報導
3. **付費牆標注**：無法取得全文的來源，標明「摘要取自 X，全文須付費」
4. **社群來源降權**：Reddit / HN / X 的討論可作為風向參考，但數字和事實不以社群帖子為唯一來源
5. **中國來源覆核**：36kr / 機器之心的報導若涉及具體數字或技術宣稱，須找原始論文或官方公告交叉驗證
6. **每日掃描量控制**：routine 不需要讀完所有來源的所有文章。每個來源取 top 5-10 則，由 LLM 判斷是否進入日報

---

## Benchmark 追蹤清單

Routine 定期掃描以下 Benchmark 的排名變動，有異動時寫入日報的「模型與基礎設施」或「Coding Agent 賽道」段落。

### 模型整體能力

| Benchmark | 測什麼 | 來源 | 掃描頻率 |
|---|---|---|---|
| **LMSYS Chatbot Arena** | 模型整體能力（人類投票） | lmsys.org | 每日 |
| **Open LLM Leaderboard**（HuggingFace） | 開源模型排名 | huggingface.co | 每日 |
| **MMLU / MMLU-Pro** | 模型知識與推理 | 各家發佈時 | 事件驅動 |
| **SimpleQA**（OpenAI） | 事實準確率 | 各家發佈時 | 事件驅動 |
| **MT-Bench** | 多輪對話品質 | 各家發佈時 | 事件驅動 |

### Coding Agent

| Benchmark | 測什麼 | 來源 | 掃描頻率 |
|---|---|---|---|
| **SWE-bench Verified** | Coding Agent 解真實 GitHub issue（已驗證子集） | swebench.com | 每日 |
| **SWE-bench Pro** | 更難的子集 | CodingFleet | 每日 |
| **SWE-bench Live** | 即時更新的 issue | swebench.com | 每週 |
| **MorphLLM Leaderboard** | Coding Agent 綜合排名 | morphllm.com | 每日 |
| **Levelop** | Coding Agent 比較 | levelop.ai | 每週 |
| **HumanEval / MBPP** | 程式碼生成基礎 | 各家發佈時 | 事件驅動 |
| **BigCodeBench** | 程式碼生成進階 | bigcode-bench | 事件驅動 |
| **Terminal-Bench**（Stanford） | 長 CLI 任務 | qaskills.sh | 每週 |
| **LongCLI-Bench** | 長時序 CLI 對照 | 論文/GitHub | 事件驅動 |

### Agent 綜合能力

| Benchmark | 測什麼 | 來源 | 掃描頻率 |
|---|---|---|---|
| **tau-bench** | 工具呼叫 Agent 客服模擬 | GitHub | 每週 |
| **GAIA** | 通用 AI 助手任務 | huggingface.co | 每週 |
| **AgentBench** | Agent 多環境綜合能力 | GitHub | 事件驅動 |
| **ToolBench** | Agent 工具呼叫能力 | GitHub | 事件驅動 |

### 瀏覽器/電腦操控 Agent

| Benchmark | 測什麼 | 來源 | 掃描頻率 |
|---|---|---|---|
| **WebArena** | 瀏覽器 Agent 網頁任務 | webarena.dev | 每週 |
| **VisualWebArena** | 視覺型瀏覽器 Agent | GitHub | 事件驅動 |
| **OSWorld** | 電腦操控 Agent | GitHub | 事件驅動 |

### OCR / Document AI

| Benchmark | 測什麼 | 來源 | 掃描頻率 |
|---|---|---|---|
| **OmniDocBench** | 文件解析準確率 | GitHub | 事件驅動 |
| **olmOCR-bench** | OCR 品質（AllenAI） | huggingface.co | 事件驅動 |

### 多模態

| Benchmark | 測什麼 | 來源 | 掃描頻率 |
|---|---|---|---|
| **VBench** | 影片生成品質 | GitHub | 事件驅動 |
| **GenAI-Bench** | 圖像生成品質 | GitHub | 事件驅動 |

### 安全

| Benchmark | 測什麼 | 來源 | 掃描頻率 |
|---|---|---|---|
| **AgentBeats** | 自適應多輪 Agent 攻防 | GitHub（開源） | 事件驅動 |
| **OWASP LLM Top 10** | Agent/LLM 攻擊面分類 | owasp.org | 年度更新 |
| **MITRE ATLAS** | AI 對抗性威脅矩陣 | atlas.mitre.org | 季度更新 |

---

## 內容類型

12 種內容類型，每種對應獨立的 routine（避免 context window 爆炸）。

### 每日固定產出

| 類型 | 檔名模式 | Series | 服務角色 | Routine 來源 |
|---|---|---|---|---|
| AI Agent 日報 | `YYYY-MM-DD-ai-agent-daily.md` | AI Agent 日報 | Engineer + 創業 + 資管所 | 新聞源 + 中繼檔彙整 |
| Arxiv Digest | `YYYY-MM-DD-ai-agent-arxiv-digest.md` | AI Agent Arxiv Digest | Engineer + 資管所 | arxiv API |
| GitHub Digest | `YYYY-MM-DD-ai-agent-github-digest.md` | AI Agent GitHub Digest | Engineer | GitHub API |

### 事件驅動產出（有事才產，獨立成篇）

| 類型 | 檔名模式 | Series | 服務角色 | 觸發條件 |
|---|---|---|---|---|
| 模型卡 | `YYYY-MM-DD-model-{model-name}.md` | AI Model Tracker | Engineer + 創業 + 資管所 | 新模型發佈 |
| 資安警報 | `YYYY-MM-DD-security-{slug}.md` | AI Security Alert | Engineer + 創業 + 資管所 | Agent 安全事件 |
| Benchmark 異動 | `YYYY-MM-DD-benchmark-{slug}.md` | AI Benchmark Watch | Engineer + 創業 | 排行榜洗牌 |
| 框架更新 | `YYYY-MM-DD-framework-{name}-{version}.md` | AI Framework Changelog | Engineer | 重要版本發佈 |
| 工具推薦 | `YYYY-MM-DD-tool-{slug}.md` | AI Tool of the Day | Engineer + 創業 | 值得裝的工具/MCP |
| 融資速報 | `YYYY-MM-DD-funding-{company}.md` | AI Agent Funding | 創業 + 資管所 | Series A+ 融資 |
| 定價追蹤 | `YYYY-MM-DD-pricing-{slug}.md` | AI Pricing Watch | Engineer + 創業 + 資管所 | 定價/促銷/API sunset |

### 每週產出

| 類型 | 檔名模式 | Series | 服務角色 | 產出時間 |
|---|---|---|---|---|
| 週回顧 | `YYYY-MM-DD-weekly-review.md` | AI Agent 週回顧 | 全部 | 每週五 |
| 區域焦點 | `YYYY-MM-DD-region-{slug}.md` | AI Region Focus | 創業 + 資管所 | 每週或有重大事件 |

### Routine 架構（解決 context window 問題）

```
階段 1：獨立掃描（平行，各自 context 極小）
  Routine A: arxiv API → Arxiv Digest markdown        (~8k token)
  Routine B: GitHub API → GitHub Digest markdown      (~5k token)
  Routine C: HuggingFace + 官方 Blog → 模型卡         (~2k token)
  Routine D: 資安來源 → 資安警報（有事才觸發）          (~3k token)
  Routine E: Benchmark 站 → Benchmark 異動（有事才觸發）(~2k token)
  Routine F: 框架 GitHub releases → 框架更新（有事才觸發）(~2k token)
  Routine G: Product Hunt + GitHub → 工具推薦           (~2k token)
  Routine H: Crunchbase + BusinessWire → 融資速報       (~2k token)
  Routine I: explainx.ai + 官方公告 → 定價追蹤          (~2k token)

階段 2：新聞掃描 + 中繼檔
  Routine J: 掃描所有新聞源 → 篩出 30-50 則信號
           → 存到 src/data/daily-signals/YYYY-MM-DD.json (~15k token)

階段 3：彙整產出
  Routine K: 讀中繼檔 + 階段 1 產出 → AI Agent 日報    (~15k token)

階段 4：每週彙整
  Routine L: 讀本週所有產出 → 週回顧                    (~20k token)
  Routine M: 讀本週區域相關信號 → 區域焦點              (~10k token)
```

每個 routine 的 context 都控制在 20k token 以內。最重的是 Routine K（日報彙整）和 Routine L（週回顧），但它們讀的是已經篩選過的中繼檔，不是原始來源。

---

## 檔案規範

| 項目 | 規則 |
|---|---|
| 目錄 | `src/content/posts/daily/` |
| 語言 | 預設 `zh-TW`；英文版加 `-en` 後綴 |
| 一天最多 | 每種類型各一篇 |
| category | `daily` |

### Frontmatter 模板

```yaml
---
title: "AI Agent 日報 — 2026-08-16"
date: 2026-08-16
category: daily
tags: [ai-agent, daily]                       # 論文摘加 arxiv；GitHub 加 open-source
lang: zh-TW
description: "一句話概述今天最重要的事"
tldr: "3-5 行的今日重點，讀完這段就夠了"
series:
  name: "AI Agent 日報"
  order: 1                                    # 按日期遞增
---
```

---

## 內容結構

### A. AI Agent 日報（產業綜合）

```markdown
## 今日重點摘要
3-5 個 bullet，每個一句話帶結論

## 廠商動態
按公司分小節（Anthropic / OpenAI / Google / ...）
每條附來源連結

## 模型與基礎設施
新模型發佈、定價變動、推理成本、Benchmark 異動。
有新模型時附模型卡：
- Model ID / Context Window / Input-Output 定價 / 開源與否

## 定價與 API 生命週期（有事才出現）
- 限時促銷窗口（如「Sonnet 5 $2/$10 促銷至 8/31」）
- API sunset 時程（如「Assistants API 8/26 sunset」）
- 用量政策變更

## Coding Agent 賽道
並排比較主要 Coding Agent 的最新狀態變化：
Claude Code / Cursor / Devin / GitHub Copilot / Windsurf / Cline / Aider
（無變化的週可省略）

## 工具與生態
值得關注的 MCP server、SDK、開發工具

## 技術進展
- 框架版本更新（LangGraph / CrewAI / MCP spec 等）
- MCP spec 版本追蹤（具體變更內容，如 stateless core、OAuth/OIDC）
- 協定動態（MCP vs A2A 標準化進展）
- 學術論文摘選（2-3 篇值得注意但不到 Arxiv Digest 深讀程度的論文）

## 商業案例 / 融資 / 併購
- 融資：公司名、金額、投資人、一句話意義
- 併購：收購方、被收購方、金額、對生態的影響
- 企業導入：成功案例與失敗信號並重（「PoC 未能規模化」跟成功上線一樣重要）

## 資安事件與防禦技術（有事才出現）

**攻擊面追蹤**：
- Agent 越獄/逃出沙箱事件
- prompt injection 實際攻擊案例
- AI 被用於攻擊的報告（如 DeepSeek 被用於自主攻擊）
- 供應鏈攻擊（惡意 MCP server、slopsquatting 等）

**防禦技術追蹤**（核心學習目標）：
- prompt injection 防禦方法（instruction hierarchy、input/output 分離、canary token）
- Agent 沙箱隔離架構（E2B、Celesto、Firecracker microVM）
- runtime guardrails 實作（Lakera、Netzilo kill switch、Invariant formal verification）
- Agent 行為監控與 audit log（Zenity、Guild.ai）
- 內容真實性（C2PA metadata、IPTC 標記）
- 紅隊方法論（AgentBeats 自適應多輪攻擊、MITRE ATLAS 框架）

與「法規」分開——資安是技術事件，法規是政策回應。
每次寫資安事件時，同時寫「這件事的防禦做法是什麼」。

## 法規與治理（有事才出現）
- AI 法案生效/執法（SB 942、EU AI Act）
- 政府會議/行政命令
- 合規要求變更

## 中國 / 台灣 / 日韓動態
區域生態獨立成段，不混在「廠商動態」裡。
追蹤重點：開源模型、Agent 平台整合、在地法規、投資動向。

## 觀察與洞察
2-4 段分析。這是日報的核心價值。
有意識地使用 MIS 框架：交易成本、互補資產、網路效應、五力、轉換成本、IT 投資理論。
不只報新聞，要寫「所以呢」和「這對組織/產業代表什麼」。

## 我今天學到什麼
1-3 句話，寫下今天改變了什麼認知。不是摘要，是認知差。

## 參考連結
所有來源的完整 URL，按出現順序排列
```

### B. Arxiv Digest（論文深讀）

```markdown
## 今日總覽
3-5 行，串起今天幾篇論文的共同主題

## 讀這篇前該知道的詞
| 詞 | 白話解釋 |

---

## 論文一｜{論文標題}
作者 / arxiv ID / 連結

### TL;DR
一句話結論

### Read Priority
必讀 / 略讀 / 跳過 + 一句話理由

### 領域背景
這個問題在整個領域裡的位置

### 中階導讀
- **問題**：用類比說明
- **方法**：怎麼做的
- **為什麼重要**：對從業者的意義

### 深入要點
- 具體數字、benchmark、limitation
- 與主流框架的關聯
- 落地門檻

### Reviewer 一句話評
以審稿人角度給一句客觀評價

### Take-away
1-2 個 actionable 建議，用「如果你在做 X：…」的句式

---
（每篇論文重複以上結構）

## 我今天學到什麼
1-3 句話，認知差。
```

### C. GitHub Trending Digest

```markdown
## 今日亮點
1-2 句，今天 GitHub 上 AI/Agent 相關最值得注意的趨勢

## Trending Repos
每個 repo：
### {repo-name} ⭐ {stars} (+{today})
- **是什麼**：一句話
- **為什麼值得看**：解決什麼問題、跟現有工具的差異
- **技術棧**：語言、框架、依賴
- **連結**：GitHub URL

## Notable Releases
重要專案的新版本，列出 breaking changes 或值得注意的新功能

## 我今天學到什麼
1-3 句話，認知差。
```

### D. 週回顧：本週認知更新（每週五）

```markdown
## 本週最重要的 5 件事
每件事一段，不是摘要而是「這件事改變了什麼」

## 本週認知更新
這週我對 AI Agent / AI 產業的理解，哪裡變了？
用「之前以為 X，現在知道 Y」的句式。

## 企業落地觀察
本週的部署案例、成敗分析，用 MIS 框架解讀

## 下週值得追蹤的
預告下週可能有動態的事件
```

---

## 品質規則

| 規則 | 說明 |
|---|---|
| 來源必附 | 每個事實主張都要有連結，不能「據報導」沒出處 |
| 數字要精確 | 金額、ASR、benchmark 分數寫到小數點，不四捨五入成「約」 |
| 觀點標記 | 分析段落用「我認為」或「觀察」開頭，和事實段落區分 |
| 不寫沒查的 | 查不到來源就不寫，寧可少一條 |
| 論文標注限制 | 未複現結果加 ⚠️（如「Stanford 自測，需等外部複現」） |
| 字數控制 | 日報 < 3000 字、論文摘每篇 < 800 字、GitHub digest < 1500 字 |
| MIS 框架意識 | 「觀察與洞察」段落有意識使用 IT 管理理論框架分析 |
| 認知差必寫 | 每篇最後的「我今天學到什麼」不得省略 |

---

## 路由與 UI

| 項目 | 規則 |
|---|---|
| 專屬頁面 | `/daily` — 時間軸倒序，按日期分組 |
| 首頁 | **不顯示** daily category 的文章 |
| RSS | 包含在主 RSS 中 |
| 系列頁 | 各 series 獨立頁面 |
| 英文版 | `/en/daily` 同結構 |

---

## 與台大資管所考試的對應

| 考試科目 | 日報哪個段落直接餵 |
|---|---|
| MIS 申論：IT 投資 / 平台經濟 / AI 部署 | 觀察與洞察（用 MIS 框架分析） |
| MIS 申論：數位轉型 / ESG / 組織變革 | 企業落地觀察（週回顧） |
| 計概選擇：Transformer / RAG / 新興科技 | Arxiv Digest + 模型動態 |
| 口試技術關 | 所有寫過的日報內容都是可追問的彈藥 |
| 口試生涯關 | 日報本身就是 portfolio |

---

## 產製流程

```
Claude Code routine（每日 UTC 00:00 或指定時間）
  1. 掃描第一批來源（arxiv API / GitHub API / HN API / HF API / 6 官方 Blog RSS / Product Hunt / Benchmark 站）
  2. 每個來源取 top 5-10 則，LLM 判斷是否與 AI Agent 四圈相關
  3. 交叉驗證：同一事件需至少兩個獨立來源
  4. 分流產生三篇 Markdown：
     - AI Agent 日報 → src/content/posts/daily/YYYY-MM-DD-ai-agent-daily.md
     - Arxiv Digest → src/content/posts/daily/YYYY-MM-DD-ai-agent-arxiv-digest.md
     - GitHub Digest → src/content/posts/daily/YYYY-MM-DD-ai-agent-github-digest.md
  5. 每週五額外產生週回顧 → src/content/posts/daily/YYYY-MM-DD-weekly-review.md
  6. git commit + push
  7. Cloudflare Workers 自動 deploy
```

Routine 的 skill 另案設計（見 `.agents/skills/daily-digest/`）。
