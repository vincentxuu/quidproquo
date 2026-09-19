# Deep Research 全景系列文規劃

> Status: 2026-09-19 規劃完成，待確認後動筆

## 系列資訊

- **系列名**：Deep Research 前沿（暫定）
- **目標讀者**：混合（工程師 + 非技術但有興趣），由淺入深
- **總篇數**：16 篇（order 0–15）
- **弧線**：Survey → 架構 → 訓練 → 工具 → 評估 → 應用 → 展望
- **語言**：zh-TW + en 成對（跟 `autonomous-deep-research-agent` 模式一致）

## 系列結構

| order | 主題 | 狀態 | 對應素材 |
|---|---|---|---|
| 0 | Survey 導讀：80+ 實作的全景圖 | **已寫** | arXiv:2506.12594 + arXiv:2508.12752 |
| 1 | 四個環節：規劃、檢索、仲裁、驗證 | **已寫** | `autonomous-deep-research-agent` |
| 2 | WebDancer & WebThinker：從零訓練 agent | **已寫** | arXiv:2504.21776 + arXiv:2505.22648 |
| 3 | IterResearch & AREX：長時程迭代 | **已寫** | arXiv:2511.07327 + arXiv:2607.21461 |
| 4 | WebWeaver & DeepPlanner：雙 agent 與規劃優化 | **已寫** | arXiv:2509.13312 + arXiv:2510.12979 |
| 5 | Tongyi DeepResearch：MoE + Agentic CPT | **已寫** | arXiv:2510.24701 |
| 6 | 數據合成：WebShaper & S1-DeepResearch | **已寫** | arXiv:2507.15061 + arXiv:2606.15367 |
| 7 | 評估困境：基準可信度與 STC | **已寫** | STC 論文 + daily 2026-06-07 |
| 8 | 基準深度解析：DR Bench II、DeepResearch-9K、HLE | **已寫** | DeepResearch Bench II + SIGIR 2026 |
| 9 | 測試時擴展：BrowseConf & Heavy Mode | **已寫** | ACL Findings 2026 + Tongyi Heavy Mode |
| 10 | 多模態與視覺：WebWatcher | **已寫** | arXiv 2508.05748 |
| 11 | 開源工具全景：GPT-Researcher、STORM、smolagents… | **已寫** | 調研結果 |
| 12 | 商用產品格局：OpenAI、Perplexity、Gemini… | **已寫** | 調研結果 |
| 13 | **【專案篇】我們怎麼做 deep-research skill** | **已寫** | Groundlane MCP、7 步驟 workflow |
| 14 | **【生態篇】社群的 deep-research skill 都怎麼做** | **已寫** | hyperresearch、hashbulla、jamoeight v2 等 |
| 15 | 未來展望：具身研究、科學自動化、agent 叢集 | **已寫** | AREX + `CS329z` 系列 |

## 斷崖處理

- order 0→1：Survey→架構，order 0 預告「四個環節」
- order 1→2：概念→訓練方法論
- order 6→7：數據→評估
- order 9→10：文本→多模態

## 站內前置知識連結

- RAG 基礎 → `rag-patterns-complete-guide`
- Agent 架構 → `ai-agent-patterns-guide`
- 搜尋/爬取基礎 → `搜尋與爬取實戰` series
- CS329z 課程 → `stanford-cs329z-week2-workflows-rag` 等

## 外部開源 Skill 參考（生態篇素材）

| 開源 Skill | GitHub | 核心特點 |
|---|---|---|
| hyperresearch (jordan-gibbs) | — | 16-step pipeline, 持久 vault, MCP server, 16 agents |
| hashbulla/deep-research | — | 7-phase, NATO Admiralty 2×6 grading, CRAG grounding |
| jamoeight/claude-code-deep-research-v2 | — | Co-Scientist, AlphaEvolve, BrowseConf, BATS |
| tolmachevmaxim/deep-research-skill | — | 3 agents (Optimist/Pessimist/Fact-Checker) |
| kaynquang/multi-agent-research | — | 13 agents, 7 phases |
| Silence-view/deep-research | — | 10 phases, STORM-inspired, citation chasing |
| Socialpranker/deepdive | — | 7 phases, 75 report blocks, 29 channels |
| ramit-mitra/deep-research-skill | — | skills.sh 兼容, subagent-driven |
| Bhllcoder1/deep-dive-skill | — | 15 runtime adapters, adversarial verification |
| robertnowell/deep-research | — | 6-phase, source quality gates |
| Weizhena/Deep-Research-skills | — | Human-in-the-loop, OpenCode/Codex 兼容 |

## 專案 deep-research skill 架構（專案篇素材）

- **工具邊界**：嚴格只用 Groundlane MCP（`web_search` / `web_fetch` / `web_extract`）
- **Workflow**：拆問題 → 多源蒐集 → 交叉驗證 → 萃取 → 產出 research note → 交 `post` skill 發文
- **來源品質**：A（官方一手）/ B（一手作者）/ C（高品質二手）/ D（低品質二手）
- **學術論文品質判斷**：硬指標（會議、引用數、機構）+ 軟指標（可重現性、被後來工作引用）
- **搭配 skill**：`research-selection`（多案例選取）、`post`（發文）、`post-review`（自審）、`post-verify`（事實驗證）
- **輸出**：`.research/<YYYY-MM-DD>-<slug>.md`（不入版控）

## Groundlane MCP 說明（專案篇引用）

- 作者：vincentxuu
- 版本：0.1.0 early preview
- 定位：vendor-neutral remote MCP server
- 工具：`web_search`、`web_fetch`、`web_extract`
- Providers：Tavily、Exa、Parallel、Browserbase、Brave、Firecrawl、SerpApi、Linkup、Serper、You.com
- 部署：Cloudflare Workers + Containers、本地 Node

## 完成條件

- [ ] 確認 16 篇順序與範圍
- [ ] 從 order 0 或 order 13/14 開始動筆
- [ ] 每篇用 `post` skill 產出
- [ ] zh-TW + en 成對
- [ ] 每篇完成後用 `post-review` 自審
- [ ] 系列完成後用 `pnpm verify`
