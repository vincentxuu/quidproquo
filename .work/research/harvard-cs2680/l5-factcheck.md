# L5「Agent Design II: Multi-Agent Systems」主張查證

- 查證日期：2026-10-22
- 對象：Harvard CS2680 L5 投影片（`sources/slides/5_agent_design_2.pdf`，46 頁；頁碼 = PDF 頁序，已用 `pdftotext -f N -l N` 逐頁對過，跟研究筆記一致；投影片頁尾印的號碼在 p32 之後比 PDF 頁多 2）。
- 工具：本 session 沒有掛 Groundlane MCP 工具；Groundlane 直接 HTTP 先前回 401；Exa connector 斷線（404）。候選搜尋用 Keenable keyless（可用）；一手頁面全部用 `curl -sL` 直接抓原頁（Anthropic Engineering、Cognition 兩篇、arXiv abs 與 HTML 全文、A2A spec 原始 Markdown、MCP spec `.md`、Confluent 文件），全部 200，沒有再往下降級。
- 判定：Confirmed（原文支持）｜Outdated（原文成立但有更新的反面證據）｜Contradicted（與原文不符）｜Not found（原文查不到該數字或說法）

## 結果統計

| Verdict | 數量 |
|---|---|
| Confirmed | 13 |
| Confirmed（需加條件） | 3 |
| Outdated | 1 |
| Contradicted | 1 |
| Not found | 0 |

## 查證表

| # | 主張 | 頁 | 來源 URL | 原文（節錄） | Verdict |
|---|---|---|---|---|---|
| 1 | Anthropic Research：lead agent 規劃後平行派出 subagent 搜尋 | 閱讀 9/23 | https://www.anthropic.com/engineering/multi-agent-research-system（2025-06-13） | "the lead agent analyzes it, develops a strategy, and spawns subagents to explore different aspects simultaneously" | Confirmed |
| 2 | agent 約用 chat 的 4× token，多 agent 約 15× | 閱讀 9/23 | 同上 | "agents typically use about 4× more tokens than chat interactions, and multi-agent systems use about 15× more tokens than chats" | Confirmed（Anthropic 自家數據） |
| 3 | BrowseComp 上 token 用量解釋 80% 變異 | 閱讀 9/23 | 同上 | "three factors explained 95% of the performance variance … token usage by itself explains 80% of the variance, with the number of tool calls and the model choice as the two other explanatory factors" | Confirmed |
| 4 | 多 agent（Opus 4 lead＋Sonnet 4 subagent）比單一 Opus 4 好 90.2% | 閱讀 9/23 | 同上 | "outperformed single-agent Claude Opus 4 by 90.2% on our internal research eval" | Confirmed（需加條件：內部 research eval、自家數據、廣度優先的研究題） |
| 5 | 多數 coding 任務可平行的部分比研究少；共享 context、依賴多的領域不適合 | 閱讀 9/23 | 同上 | "most coding tasks involve fewer truly parallelizable tasks than research, and LLM agents are not yet great at coordinating and delegating to other agents in real time" | Confirmed |
| 6 | 子任務描述不清會重工、漏洞（對應 p21、p24 的 overlap／gap） | p21、p24 | 同上 | "Each subagent needs an objective, an output format, guidance on the tools and sources to use, and clear task boundaries. Without detailed task descriptions, agents duplicate work, leave gaps…"；早期版本 "spawning 50 subagents for simple queries" | Confirmed |
| 7 | Cognition〈Don't Build Multi-Agents〉：share context／actions carry implicit decisions | 閱讀 9/23、p44 | https://cognition.com/blog/dont-build-multi-agents（Walden Yan，2025-06-12） | "Principle 1 Share context, and share full agent traces, not just individual messages"；"Principle 2 Actions carry implicit decisions, and conflicting decisions carry bad results"；"The simplest way to follow the principles is to just use a single-threaded linear agent" | Confirmed |
| 8 | Cognition 的反方立場現況 | 閱讀 9/23 | https://cognition.ai/blog/multi-agents-working（Walden Yan，2026-04-22） | "Our original observations still hold today for parallel-writer swarms … But we've found a narrower class of patterns that do: setups where multiple agents contribute intelligence to a task while writes stay single-threaded"；code review loop "work best when the coding and review agents do not share any context beforehand" | Outdated（原文仍成立於「多個 agent 同時寫」；作者 2026-04 補充：讀、審、諮詢可以多 agent，寫入維持單線） |
| 9 | Kim et al.：260 種設定、單 agent 與四種多 agent 架構控制變因比較；+80.8% 到 −70.0% | 閱讀 9/23 | https://arxiv.org/abs/2512.08296（v3，2026-04-08；Google Research、MIT 等） | "Across 260 configurations spanning six agentic benchmarks, five canonical architectures (Single-Agent and four Multi-Agent: Independent, Centralized, Decentralized, Hybrid)"；"+80.8% relative improvement (structured financial reasoning under centralized coordination) to −70.0% degradation (sequential planning under independent coordination)" | Confirmed（需加條件：+80.8% 是可拆的財務推理＋中央協調，−70.0% 是循序規劃＋各自獨立） |
| 10 | 錯誤放大：獨立 17.2×、中央協調 4.4× | 閱讀 9/23 | https://arxiv.org/html/2512.08296 | "Independent systems amplify trace-level errors 17.2× through unchecked error propagation … Centralized coordination, however, contains this to 4.4× by enforcing validation bottlenecks" | Confirmed |
| 11 | 單 agent 已經夠好時，加 agent 反而變差 | p44 | 同上 | "tasks where single-agent performance already exceeds 45% accuracy experience negative returns from additional agents" | Confirmed |
| 12 | 反證：算力打平時單 agent 不輸多 agent | p44（補充） | https://arxiv.org/abs/2604.02460（Tran、Kiela，2026-04-02） | "SAS consistently match or outperform MAS on multi-hop reasoning tasks when reasoning tokens are held constant"；"many reported advantages of multi-agent systems are better explained by unaccounted computation and context effects" | Confirmed（需加條件：多跳推理題、固定思考 token 預算） |
| 13 | MAST：多 agent 失敗分類 14 種、3 大類 | 延伸 | https://arxiv.org/abs/2503.13657（Cemri et al.，v3） | "identifies 14 unique modes, clustered into 3 categories: (i) system design issues, (ii) inter-agent misalignment, and (iii) task verification"；"1600+ annotated traces collected across 7 popular MAS frameworks" | Confirmed |
| 14 | 三種送達語意 at-most-once／at-least-once／exactly-once；idempotency 讓重送不重複 | p33 | https://docs.confluent.io/kafka/design/delivery-semantics.html | "At most once: Messages are delivered once, and if there is a system failure, messages may be lost and are not redelivered. At least once: … messages are never lost, but they may be delivered more than once. Exactly once: … each message is delivered once and only once"；"The idempotent delivery option guarantees that resending a message will not result in duplicate entries in the log … deduplicates messages using a sequence number" | Confirmed |
| 15 | A2A agent card 欄位 `supportedInterfaces`、`capabilities.streaming`、`securitySchemes`，路徑 `/.well-known/agent-card.json` | p38 | https://github.com/a2aproject/A2A/blob/main/docs/specification.md（Latest Released Version 1.0.0） | 範例含 `"supportedInterfaces": [`、`"streaming": false`、`"securitySchemes": {`；`GET /.well-known/agent-card.json HTTP/1.1` | Confirmed |
| 16 | A2A task 狀態 submitted、working、input required、auth required、completed、failed、rejected、canceled | p40 | 同上 | "Must be one of: TASK_STATE_SUBMITTED, TASK_STATE_WORKING, TASK_STATE_COMPLETED, TASK_STATE_FAILED, TASK_STATE_CANCELED, TASK_STATE_REJECTED, TASK_STATE_INPUT_REQUIRED, TASK_STATE_AUTH_REQUIRED"；終態四個（completed、failed、canceled、rejected），中斷狀態兩個（input required、auth required） | Confirmed |
| 17 | A2A 追蹤長任務：polling、streaming、push notification；agent 內部可不透明 | p41、p43 | 同上 | "Support various interaction modes including synchronous request/response, streaming for real-time updates, and asynchronous push notifications for long-running tasks"；"Opaque Execution: Agents collaborate … without needing to share their internal thoughts, plans, or tool implementations" | Confirmed（「A2A standardizes communication, not orchestration」是講者的整理；spec 的目標列表只談發現、協商、管理任務與交換資訊，沒有規定怎麼拆工作，與講者說法一致） |
| 18 | MCP 三原語 tools／resources／prompts；host（不是模型）決定暴露什麼；「one client speaks to many servers」 | p42 | https://modelcontextprotocol.io/specification/2026-07-28/server/index（現行版 2026-07-28）、https://modelcontextprotocol.io/specification/2026-07-28/architecture | 三原語：Prompts「User-controlled」、Resources「Application-controlled」、Tools「Model-controlled」；Host「Creates and manages multiple client instances · Controls client connection permissions and lifecycle · Enforces security policies and consent requirements」；Client「Each client is created by the host and communicates with exactly one server」 | Contradicted（「one client speaks to many servers」與 spec 用語相反：是一個 host 開多個 client，每個 client 只連一個 server。三原語與「host 決定暴露什麼」成立，但 tools 的呼叫時機是 model-controlled） |

## 投影片內部、沒有外部出處的說法

- p14 GPU 競標例子、p22 粒度公式、p24–25 六種分解失敗、p31 九種訊息型別、p44 四條原則：講者自己的整理，文章當成課堂框架寫，不當成業界定論。
- p15「Rarely used in products」（swarm）：講者判斷，沒有引用資料；文章寫成講者說法。
- p43「One A2A remote agent may itself call twenty MCP servers」：示意說法，文章照「示意」寫。

## 文章處理

- #2–#4：寫明是 Anthropic 自家數據與內部 eval；90.2% 的條件（廣度優先的研究題）一起寫。
- #5：放在「真的需要多 agent 嗎」那節，和 Cognition 並列，說明連做多 agent 的 Anthropic 也說 coding 不太適合。
- #8：Cognition 兩篇都寫：2025 年的反方原則，加上 2026 年的修正「寫入維持單線」。
- #9–#12：Kim 的條件寫清楚（拆得開的任務 vs 循序規劃）；Tran & Kiela 的反證寫明是多跳推理、固定 token 預算。
- #14：橋接小節用 Confluent 的定義。
- #18：MCP 寫成「一個 host 開多個 client，每個 client 接一個 server」，並註明投影片的說法簡化了。
