# Deep Research 系列文選案研究

日期：2026-08-26
狀態：已盤點站上既有覆蓋，重新切缺口，待使用者確認系列架構

## 母群定義

**Deep Research 系統** = 能自主執行多步驟研究的 AI 系統——拆解問題、多輪搜尋/閱讀、交叉驗證、產出結構化報告。

- **算**：商業產品、開源專案、底層設計模式（orchestration loop、source grading、synthesis strategy）
- **不算**：單次 RAG、純搜尋引擎、通用 Agent 框架（除非有專門 research recipe）、學術文獻管理工具（Elicit 等，可之後獨立一篇）

**系列角度**：不只盤點誰在做，而是拆解「一個好的 deep research agent 需要解決哪些問題」，每篇對應一個核心問題。使用者同時有兩條線：(1) 自己在用的 deep-research skill（方法論體感）；(2) 想建一個 deep research agent（工程線）。

## 掃描方法

| 方法 | 查詢 |
|---|---|
| Web 搜尋（Jina、Exa、Firecrawl） | "deep research AI" products 2025 2026、"AI research agent" commercial、"deep research" alternatives comparison |
| GitHub 掃描 | "deep research" agent repos (trending, starred)、"GPT Researcher" alternatives open source |
| arXiv 搜尋 | "agentic research" survey、"multi-step reasoning" web search agent、"research agent" benchmark |
| awesome-list | DavidZWZ/Awesome-Deep-Research、ai-agents-2030/awesome-deep-research-agent、scienceaix/deepresearch |

## 完整清單

### 商業產品 (10)

| Name | Company | ~Launch | Pricing | Key Differentiator |
|---|---|---|---|---|
| Deep Research | OpenAI | 2025-02 | Plus $20/mo (limited), Pro $200/mo | o3-based, 最長最詳細報告, multi-step agentic browsing |
| Gemini Deep Research | Google | 2024-12 | Free (Advanced $20/mo) | 1M token context, Google Search 整合, 匯出 Docs |
| Deep Research | Perplexity | 2025-02 | Pro $20/mo | 速度 + 最多來源 (~57 vs ~20), inline citations |
| Grok DeepSearch | xAI | 2025-02 | Free (SuperGrok $30/mo) | 搜 X/Twitter + web; ~10× faster than OpenAI; 即時社群訊號 |
| Claude Deep Search | Anthropic | ~2025 mid | Pro $20/mo, Max $100–200/mo | Extended thinking + 200K context; 261 sources in ~6 min |
| Kimi AI | Moonshot AI | 2024 | Free + paid | 中國市場領先; 長 context (2M tokens claimed); deep research mode |
| You.com Research | You.com | 2024 | Free + Pro | Research mode, developer-oriented API |
| Kompas AI | Kompas AI | ~2024 | Team plans | Enterprise-focused; multi-agent collaboration |
| Consensus | Consensus | 2022 (research mode ~2025) | Free + Pro | 學術論文限定搜尋; evidence-based answers |
| Deepwriter AI | Deepwriter | ~2025 | Freemium | Writing-focused deep research; academic slant |

### 開源專案 (8)

| Name | Stars | Architecture | LLMs | Status |
|---|---|---|---|---|
| GPT Researcher | ~29k | Single-agent plan→search→write loop; web+local docs | Any via API | Active (mature) |
| STORM (Stanford OVAL) | ~31k | Multi-agent simulated expert conversation → outline → article | OpenAI + config | **Stale** (~10 個月沒更新) |
| dzhng/deep-research | ~19.6k | Single-agent iterative loop; TypeScript | OpenAI (Firecrawl) | Active but lightweight |
| Open Deep Research (LangChain) | ~4k | LangGraph orchestration graph; configurable search+MCP | Any provider | Active |
| Local Deep Research | ~8k+ | Local-first; iterative multi-source (web, arXiv, PubMed) | Ollama + cloud | Active (healthy community) |
| Tongyi DeepResearch (Alibaba) | ~91k | **RL-trained** 30.5B MoE model (3.3B active); end-to-end web agent | Own model | Active; weights on HF |
| DeepResearcher (GAIR-NLP) | ~800 | **RL-trained** 7B agent; end-to-end in real-world web env | Own 7B model | Research project |
| Cerno | ~few hundred | Local-first workspace; Django backend; multi-step | Cloud + local | Early stage |

### 關鍵論文與方法論 (8+)

| Paper/Method | Source | Core Idea |
|---|---|---|
| STORM (2402.14207) | Stanford, Shao et al. 2024, 293 citations | Multi-perspective question asking → outline → article |
| Deep Research Survey (2508.12752) | Aug 2025 | 4-stage pipeline: planning → question developing → searching → synthesizing |
| Comprehensive Survey (2506.12594) | Jun 2025 | 80+ implementations 分析; hierarchical taxonomy |
| From Web Search towards Agentic DR (2506.18959) | Jul 2025 | 從 one-shot 到 multi-step reasoning + active search |
| How to Train Your DR Agent (2602.19526) | 2026 | RL training: prompt design, reward shaping for multi-step reasoning |
| Step-DeepResearch (2512.20491) | Dec 2025 | o3-mini reasoning + async multi-step web exploration |
| DataSTORM (2604.06474) | Apr 2026 | 擴展 STORM 到結構化資料庫 + 網路 |
| LangChain Open Deep Research | Jul 2025 blog | LangGraph-based, pluggable data sources + MCP servers |

### 評估基準 (6)

| Benchmark | Core Idea |
|---|---|
| BrowseComp (OpenAI) | Challenging web browsing questions |
| BrowseComp-Plus (2508.06600) | 擴展版, 157 citations |
| LiveBrowseComp (2605.28721) | Live-web variant; 所有 agent < 2% closed-form accuracy |
| EvoBrowseComp (2606.13120) | Evolving questions 抗 contamination |
| DeepWideSearch (2510.20168) | First benchmark measuring both depth AND width |
| DeepScholar-Bench (2508.20033) | Live benchmark for generative research synthesis |

## 最大發現

**架構上有兩個根本不同的陣營：**

1. **編排式 (Orchestration-based)**：用 prompt 驅動通用 LLM 跑搜尋迴圈。大多數商業產品和開源專案都是這條路。GPT Researcher、STORM、OpenAI Deep Research 都屬於此。
2. **RL 端到端訓練 (End-to-end RL-trained)**：模型本身透過強化學習在真實 web 環境中學會研究。Tongyi DeepResearch (91k stars, 30.5B MoE) 和 DeepResearcher (7B) 屬於此。這是更新的路線，但目前只有中國團隊在推。

## 站上既有覆蓋盤點

### 直接命中

| 站上文章 | 覆蓋內容 | 與新系列的關係 |
|---|---|---|
| `autonomous-deep-research-agent` (2026-06-04) | 兩條路線（RL vs 編排）、四環節架構（規劃→檢索迴圈→證據仲裁→可驗證輸出）、引 OpenAI/Anthropic/GPT Researcher/Search-R1 數據 | **核心前置文**——新系列導讀應引用此篇作為架構總覽，不重寫 |
| `local-deep-research-walkthrough` (2026-05-08) | Local Deep Research 導讀：定位、架構、30+ 策略池 | **已有個案深入**——系列中提到 LDR 時交叉引用 |

### 「搜尋與爬取實戰」系列（12+ 篇）

| order | 篇名 | 覆蓋 |
|---|---|---|
| 1 | AI search MCP tools | 搜尋工具選型 |
| 2 | Self-hosted search stack | SearXNG + 自架搜尋 |
| 3 | SearXNG + Crawl4AI setup | 實作設定 |
| 6 | Local Deep Research walkthrough | LDR 導讀 |
| 7 | Web retrieval fallback routing | 多源 fallback 策略 |
| 8 | Web retrieval benchmark | 搜尋品質評測 |
| 9 | Agent search query writing | Query 拆解與改寫 |
| 11 | Search results reliable citations | URL 去重、來源分級、claim-source mapping |
| 12 | Academic search pipeline | 學術搜尋管線 |

### 個別工具介紹（站上已有）

Exa、Tavily、Firecrawl、Jina Reader、Crawl4AI、Brave Search API、SerpAPI、Serper、Linkup、SearXNG、Meilisearch、Typesense、Algolia、Elasticsearch/OpenSearch

### Agent 框架（站上已有）

LangChain、LangGraph、CrewAI、AG2、Mastra、Microsoft Agent Framework、DSPy、Pydantic AI

### RAG 相關（站上已有，大量）

RAG 技法大全系列（chunking、embedding、reranking、hybrid search、self-RAG、corrective RAG、graph RAG、multimodal RAG、agentic RAG 等 20+ 篇）、RAG evaluation frameworks、RAG framework selection guide、private corpus retrieval eval

## 覆蓋矩陣（含已有/缺口標註）

| 維度 | 值 | 選入案例 | 站上已有 | 缺口 |
|---|---|---|---|---|
| **架構路線** | 編排式 | GPT Researcher, OpenAI DR, STORM | ✅ autonomous-DR-agent 已覆蓋總覽 | 個別產品細節不足 |
| | RL 端到端 | Tongyi DeepResearch, DeepResearcher | ⚠️ autonomous-DR-agent 提到 Search-R1 但沒深入 | **需 deep-research 深挖** |
| | 混合 | Step-DeepResearch | ❌ | **新內容** |
| **部署模式** | 商業 SaaS | OpenAI, Gemini, Perplexity, Grok, Claude | ❌ 無產品橫向比較 | **新內容** |
| | 開源自架 | GPT Researcher, Open Deep Research | ⚠️ LDR 有，GPT Researcher 無獨立篇 | |
| | 本地離線 | Local Deep Research | ✅ 已有導讀 | |
| **來源範圍** | 通用 Web | 大多數 | ✅ 搜尋系列覆蓋 | |
| | 學術論文 | STORM, Consensus | ✅ academic-search-pipeline | |
| | 社群/即時 | Grok (X/Twitter) | ❌ | **新內容** |
| | 結構化資料 | DataSTORM | ❌ | **新內容** |
| **設計挑戰** | 問題拆解 (Planning) | STORM, OpenAI DR | ⚠️ autonomous-DR-agent 有一節 | 可深化 |
| | 搜尋品質 | Perplexity, BrowseComp | ✅ 搜尋系列大量覆蓋 | 不需重寫 |
| | 合成與引用 | — | ✅ reliable-citations + autonomous-DR-agent | 不需重寫 |
| | 評估基準 | BrowseComp 系列, DeepScholar-Bench | ❌ 無獨立評估篇 | **新內容** |
| | 成本與商業模式 | 商業 vs 自架 | ❌ | **新內容** |
| **生命週期** | 停滯/轉型 | STORM | ❌ | 有趣但不夠撐一篇 |
| | 失敗/收掉 | ？ | ❌ | 類別太新找不到 |

## 偏誤標註

1. **英語圈偏誤**：中國市場（Kimi、Tongyi、DeepSeek）的細節較薄弱，掃描主要靠英文搜尋引擎
2. **倖存者偏誤**：找不到明確失敗/收掉的 deep research 產品（這個類別太新，大多還活著或剛起步）
3. **企業級盲區**：Kompas AI 等 enterprise 產品公開資訊極少，難以深入分析
4. **Star ≠ 活躍**：STORM 31k★ 但 10 個月停滯；star count 和專案健康度已分離
5. **選擇理由**：以「對想建 deep research agent 的讀者最有參考價值」為選入標準，偏向有公開架構/論文/程式碼的案例
6. **自家覆蓋偏誤**：站上已有大量搜尋/RAG/引用相關文章，新系列可能下意識跳過這些主題——但讀者不一定看過，需要在導讀中明確導流

## 核心設計挑戰（六大題）

1. **Plan vs. React** — 先拆解再搜（STORM）vs. 搜了再調整計畫（OpenAI DR）
2. **Source quality & ranking** — 怎麼分級、去重、偏好權威來源而非 SEO 垃圾
3. **Synthesis hallucination** — 跨來源拼接時捏造宣稱；inline citation verification 尚未解決
4. **Depth vs. breadth tradeoff** — 窮舉搜尋燒 token/時間；淺搜漏細節
5. **Long-context fidelity** — 多步 agent 累積 100K+ tokens；推理品質在晚期 context 劣化
6. **Evaluation gap** — 「好的研究」沒有共識定義；現有 benchmark 測 retrieval 不測 synthesis

## 系列文架構提案（v2：扣除已有覆蓋）

**系列名**：Deep Research：從使用到自建

**定位**：站在已有的「搜尋與爬取實戰」系列和 `autonomous-deep-research-agent` 架構文之上，聚焦它們沒覆蓋的角度——產品全景、RL 路線、benchmark、商業模式、以及自建經驗。

**與既有內容的關係**：
- `autonomous-deep-research-agent` → 系列的「理論底座」，導讀引用
- 「搜尋與爬取實戰」系列 → 搜尋/爬取/引用的工程細節，不重寫，交叉引用
- 個別工具介紹 → 提到時連結，不重複

| # | 篇名方向 | 為什麼是缺口 | 主要案例 | 需 deep-research skill 深挖 |
|---|---|---|---|---|
| 0 | **導讀：Deep Research 的設計空間** | 全景地圖 + 閱讀路徑（含站上已有文章的導流） | 全部 | 是（survey papers 精讀） |
| 1 | **產品橫向比較：五大 frontier lab 的 Deep Research** | 站上無產品橫評 | OpenAI, Gemini, Perplexity, Grok, Claude | 是（各家最新功能/定價） |
| 2 | **RL 路線深入：Tongyi DeepResearch 與 DeepResearcher** | 站上只提到 Search-R1，沒深入 RL 訓練法 | Tongyi DR, DeepResearcher, Search-R1, How to Train | 是（論文精讀） |
| 3 | **開源選型：GPT Researcher vs STORM vs Open Deep Research** | LDR 有導讀，其他三個沒有 | GPT Researcher, STORM, Open DR, dzhng/deep-research | 是（程式碼走讀 + 社群活躍度） |
| 4 | **怎麼知道 Deep Research 做得好不好：評估的現狀與缺口** | 站上無 benchmark 獨立篇 | BrowseComp 系列, DeepWideSearch, DeepScholar-Bench | 是（benchmark papers 精讀） |
| 5 | **自建實戰：從 skill 到 agent 的經驗** | 實作者視角（自己的 skill + 站上工具鏈） | 自己的 deep-research skill, 站上搜尋系列 | 否（經驗整理） |
| 6 | **成本、隱私、護城河：Deep Research 的商業決策** | 站上無商業面分析 | 商業 vs 自架 tradeoff, token 成本 | 是（定價/用量數據） |

**每篇寫法**：先用 deep-research skill 對該篇主題做深度研究（出 research note），再用 post skill 寫成文章。

## 下一步

1. 使用者確認系列架構
2. 從 order 0 導讀開始，用 deep-research skill 精讀 3 篇 survey papers
3. 逐篇推進，每篇都先 deep-research → research note → post → post-translate
