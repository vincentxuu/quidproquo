# Harvard CS2680（Fall 2026）L5–L8 講次拆解（含 10/05、10/14 與 notes）

> 來源：`sources/slides/*.pdf`（pdftotext -layout）、`sources/pages/*.txt|html`。頁碼一律是 **PDF 實體頁碼**；投影片頁尾印的數字會跳號（例：L5 PDF 共 46 頁，頁尾印到 49），引用時用 PDF 頁碼。
> 圖像頁已用 `pdftoppm -r 60` 抽查：L5 p4、L6 p4（空白頁，推測是影片或現場 demo 佔位）、L6 p23、L7 p28–29、L8 p8、p15、A3 p2–3。
> 閱讀清單的「Why read it」摘要由 AI 產生（頁面自己聲明），閱讀清單本身由講師挑選。
> 先前講次縮寫：L1 overview、L2 How Claude Code works、L3 multi-agent use / agent teams、L4 context management & tool design。

---

## L5 — 2026-09-23 Agents design II: multi-agent architecture, coordination, and communication

### 1. Deck facts
- 檔案：`slides/5_agent_design_2.pdf`，46 頁，講者 Juncheng Yang。
- 投影片標題頁寫「Agent Design II: Multi-Agent Systems」。
- p3 的 Plan 列了「Agent memory」，但這份 deck 沒有 memory 內容；memory 移到 L6（L6 p3 也寫「Multi-agent design (cont from last lecture)」，但 L6 deck 裡沒有任何 multi-agent 投影片，延續的部分可能是口頭或直接跳過）。

### 2. Section outline
| 段落 | 頁 |
|---|---|
| Logistics（Claude Code Premium seat、A1、A2 兩週後截止、office hour、pre-proposal） | p2 |
| Plan | p3 |
| 空白頁 | p4 |
| From one agent to many：為何要拆（specialization / isolation / parallelism / context management） | p5–6 |
| 三張圖：Control graph / Task graph / Communication graph | p7 |
| 8 種架構：supervisor–worker、hierarchical、pipeline/DAG、blackboard、committee/debate、market/auction、swarm、dynamic topology | p8–16 |
| Real systems are hybrids、8 種架構總表 | p17–18 |
| Task decomposition：6 種切法、sub-task spec、粒度取捨、static vs dynamic、6 種常見失敗 | p19–25 |
| Agent communication：四個維度（topology / medium / channel / format & semantics） | p26–32 |
| 通訊是分散式系統問題（at-most-once、idempotency）、分散式系統的難處、多 agent 額外挑戰、black-box LLM 讓它更難 | p33–36 |
| A2A：agent card、Message/Task/Artifact、task lifecycle、polling/streaming/push | p37–41 |
| MCP vs A2A | p42–43 |
| Design principles（四條） | p44 |
| Next class（memory、reliability、evaluation） | p45 |

### 3. 核心概念：新 vs 沿用
- **新**：三張圖的分析框架（control / task / communication graph，p7）；8 種 multi-agent 拓撲及其 Task/Control/Comms 三欄標註（p9–16）；decomposition 六種維度（data / expertise / stage / hypothesis / tool / authority，p20）；粒度公式 `T_multi ≈ T_planning + T_critical path + T_communication + T_merge`（p22）；static / dynamic / recursive / opportunistic 分解（p23）；6 種分解失敗（overlap、gap、hidden dependency、unmergeable outputs、lost global context、straggler，p24–25）；訊息要帶 semantics，control 與 content 分離（DELEGATE/QUERY/REPORT/HANDOFF/UPDATE/CANCEL/ACK/ERROR/COMPLETE，p31）；分散式系統語意（at-most-once / at-least-once / exactly-once、idempotency key、compensation，p33）；A2A 協定（p37–41）。
- **沿用**：MCP（L2 有 40 處提及、L3 講 skill/MCP/hook/plugin 擴充），本講只在 p42–43 做「MCP vs A2A」對照；subagent / agent teams 的使用面（L3 有 39 處 subagent/agent team）；context management（L4）——本講把「context management」列為拆 agent 的理由之一（p6）。
- A2A 在 L1–L4 完全沒出現，是本講的全新協定。

### 4. 可當 worked example 的具體例子與數字
- p10 hierarchical：feature build → Backend lead / Frontend lead → API / Database / UI / E2E tests。
- p11 pipeline：invoice processing（OCR → extract fields → match to PO → approve → post to ledger），「one retry edge beats one more agent」。
- p12 blackboard：多個 agent 共用一個 Git repo（task list、commits、history）。
- p13 committee：essay grading（Grader A/B + Judge），失敗模式「agreement without independence」。
- p14 market：GPU job router，A100 $0.20/3s、T4 $0.05/10s、H100 $0.40/1s，規則「cheapest bid under 5s wins」→ A100 得標。適合拿來做手算題。
- p15 swarm：倉儲機器人協商揀貨，通訊 O(n²)。
- p16 dynamic topology：support bot 在升級時才加 billing agent 與 log agent。
- p17 hybrid：Supervisor + Planner + dynamic task DAG + Coder/Researcher/Tester + shared Git + Reviewer。
- p20：200 檔 PR 先按檔案（data）切，再按專長（security、perf）切。
- p21：poor vs better sub-task（「Research storage systems」對比含年份、輸出欄位、排除範圍的版本）。
- p22：20 個一行查詢批成 4 個 subtask，讓 overhead 低於收益。
- p24–25：summary 年份切成 2020–23 與 2025–26 漏掉 2024（gap）；pricing 依賴 sizing（hidden dependency）；一個回 free text 一個回 JSON（unmergeable）；6 個 agent 20s 完成、1 個 4 分鐘（straggler）。
- p30：結構化訊息 JSON（task_id T17、confidence 0.82、evidence、artifact path）。
- p33：「purchase 8 GPU instances」網路逾時，B 到底執行了沒？→ idempotency key、補償、誰付重複購買的錢。
- p37：A2A 範例「分析公司 X 是否該把 inference stack 搬到 GPU Y」，Research Agent 透過 Agent Card 找 Finance / Search / Coding agent。
- p38：agent card JSON（Travel Agent、`GET /.well-known/agent-card.json`）。
- p39–40：「Book a flight to Boston」→ task-42 working → input required「Which date?」→「Oct 3」。

### 5. 待查證的主張
- p38：A2A agent card 的欄位名（`supportedInterfaces`、`capabilities.streaming`、`securitySchemes`）與路徑 `/.well-known/agent-card.json`，要對 A2A 現行 spec。
- p40：A2A task 狀態（submitted、working、input required、auth required、completed、failed、rejected、canceled）是否與現行 spec 一致。
- p41：「A2A standardizes communication, not orchestration」。
- p42：MCP 三原語 tools / resources / prompts，以及「the host, not the model, decides what is exposed」。
- p43：「One A2A remote agent may itself call twenty MCP servers」（示意性說法）。
- p15：「Rarely used in products」（swarm）。
- 閱讀頁引述的數字：Anthropic 多 agent 約用 chat 的 15× token、agent 約 4×、BrowseComp 上 token 用量解釋 80% 變異；scaling 論文 +80.8%／−70.0%、錯誤放大 17.2× vs 4.4×、260 configurations；AutoGen MATH 69.48% vs 55.18%；MetaGPT HumanEval 85.9%、MBPP 87.7%。

### 6. 閱讀清單（`pages/readings_sep-23.txt`）
首頁列出的三篇（主要閱讀）：
- ✅ How we built our multi-agent research system（Anthropic, 2025-06-13）— https://www.anthropic.com/engineering/multi-agent-research-system （Exa 打開確認：Research 功能由 lead agent 規劃後產生平行 subagent 搜尋）
- ✅ Towards a Science of Scaling Agent Systems（Kim et al., arXiv 2512.08296, 2025-12）— https://arxiv.org/pdf/2512.08296 （Exa 確認摘要：single-agent 與 Independent / Centralized / Decentralized / Hybrid 四種 MAS，在 Finance-Agent、BrowseComp-Plus、PlanCraft、Workbench 上做控制變因比較）
- ✅ Don't Build Multi-Agents（Cognition, Walden Yan, 2025-06-12）— https://cognition.com/blog/dont-build-multi-agents （閱讀頁標題寫「Principles of Context Engineering」，那是文中小標；原則：share context、actions carry implicit decisions）

More reading：
- 🟡 AutoGen（2023）— https://arxiv.org/abs/2308.08155
- 🟡 MetaGPT（2023）— https://arxiv.org/abs/2308.00352

閱讀頁分兩節：「Multi-agent architecture and orchestration」（AutoGen、MetaGPT、Anthropic、Scaling）與「Coordination and communication」（Cognition）。**A2A 與 MCP 沒有任何閱讀**，A2A 段落只有投影片。

### 7. 先備知識與斷崖
- 銜接 L3：L3 是「怎麼用」agent teams，本講轉成「怎麼設計」。讀者若沒用過 subagent，p5–6 的動機會比較空。
- **斷崖 1：分散式系統**（p33–36）。at-most-once / at-least-once / exactly-once、idempotency、partial failure、no global clock、CAP 式取捨，投影片只點名、不解釋；沒修過 distributed systems 的讀者需要橋接段。
- 斷崖 2：pub-sub、request-response、broadcast 等訊息模式（p29）預設讀者懂。
- 斷崖 3：A2A 與 MCP 的分層（agent→service vs agent→agent）需要先懂 MCP（L2/L3 有）。
- 文內張力：課堂把 8 種架構攤開，但 design principle #1 是「Is multi-agent really necessary?」（p44），閱讀又放 Cognition 的反方立場。導讀可以拿這個張力當主軸。

### 8. 作業連結
- p2：A2（Mads-Loop：自己寫 agent loop）兩週後截止，本講沒有直接對應 A2 的內容。
- 與 A3 的關聯：A3 的 agent 可以用 subagents（A3 p2 圖中 Agent container 寫「loop, prompts, tools, subagents, memory」），本講的粒度公式 p22 與 straggler p25 對 A3「5 tasks in parallel」有參考價值（這層連結是推論，投影片沒明講）。

---

## L6 — 2026-09-28 Agents design III: agent memory and reliability

### 1. Deck facts
- 檔案：`slides/6_agent_design_3.pdf`，31 頁。標題頁拼成「memory, and reliabiltiy」（原文錯字）。
- p2 Logistics：final poster 12/7 9am–1pm；公告「AI-generated reference materials」https://cs2680.com/notes/agent-evaluation，由講師與 TF 審過。
- 首頁 HTML 有一行被註解掉的舊標題：「Agents from a designer's perspective IV: case study」（index.html 第 335 行），代表排程曾改過。

### 2. Section outline
| 段落 | 頁 |
|---|---|
| Logistics、Plan（multi-agent 續、memory、reliability） | p2–3 |
| 空白頁 | p4 |
| **Agent memory**：定義（context window = 暫時工作狀態；memory store = 跨互動持久狀態） | p5 |
| 設計問題六步：write or skip / encode / store / retrieve / reflect / keep-update-delete ＋ who owns | p6 |
| 何時寫入（recall vs precision 光譜） | p7 |
| 怎麼組織（raw episodes / summaries / structured state / knowledge graph） | p8 |
| 怎麼儲存（plain files / KV-relational / vector / graph DB） | p9 |
| 何時使用（automatic / runtime-controlled / model-controlled） | p10 |
| 怎麼取回（semantic、scope、importance、validity、provenance） | p11 |
| 歸納（reflection、consolidation 時機） | p12 |
| 遺忘是一級操作 | p13 |
| valid time 與 provenance | p14 |
| 誰擁有 memory（agent-owned vs dedicated service） | p15 |
| Mem0 / Graphiti / supermemory 比較 | p16 |
| 設計 checklist | p17 |
| 8 種 memory 失敗模式 | p18 |
| 怎麼評估 memory（指標）、memory benchmarks | p19–20 |
| memory stack（分離層 vs harness 內建） | p21 |
| **Agent reliability**：錯誤複利（0.95^n） | p22 |
| 章節頁、故障來源五層 | p23–24 |
| 五層各自的失敗表：task spec / harness / model / tool / environment | p25–29 |
| Designing for failure | p30 |
| Next class | p31 |

### 3. 核心概念：新 vs 沿用
- **沿用**：L2 p16「Context Is One Type of Memory」、CLAUDE.md 與 auto memory（L2 有 14 處 CLAUDE.md）；L4 p47 已有「Persistent memory」、L4 講過 compaction 與「write findings to a file; plans survive compaction」。所以 memory 的「為什麼」在 L2/L4 已鋪過，本講是把它系統化成一條 pipeline。
- **新**：memory 生命週期當成一串 policy decision（p6、p17）；寫入的 recall/precision 取捨（p7）；四種表示與四種後端（p8–9）；讀寫時機三模式（p10）；retrieval 不只 semantic，還有 scope/importance/validity/provenance（p11）；bi-temporal 概念的 valid time（p14）；遺忘生命週期（mark invalid / erase / TTL / tier eviction，p13）；memory 失敗模式 8 種（p18）；memory 指標與 benchmark（p19–20）。
- reliability 段：錯誤複利公式、五層故障歸因（spec / harness / model / tool / environment）與對應修法——**全新**的框架。

### 4. 可當 worked example 的具體例子與數字
- 貫穿全段的範例：「We moved serving from vLLM to SGLang.」依序變成 raw episode → summary「Uses SGLang for model serving」→ structured `{"serving_engine":"SGLang"}` → KG `Project → USES → SGLang`（p8）；p14 再用它示範 valid time（2026 年 4 月 vLLM 被 superseded，6 月 SGLang current）與 provenance（Episode 28）。適合整篇導讀用同一個例子串到底。
- p12 歸納：問過 vLLM、SGLang、TRT-LLM、LLM scheduling → 假設「對 LLM inference systems 有持續興趣」，confidence medium。
- p18 memory hallucination 例：「studying at Harvard」被存成「visiting student at Harvard」。
- p20：LoCoMo 1,540 題 / 10 段長對話；LongMemEval 500 題 / 5 種 memory 能力；BEAM 2,000 題 / 最多 10M tokens。
- p22：每步 95% 成功，1/5/10/20/50 步全對機率 95% / 77% / 60% / 36% / 8%（「1 in 13」50 步無錯）。導讀可以讓讀者自己算 0.95^50。
- p25–29：五張表，每列都有「spec 說了什麼 / agent 做了什麼 / 修法」，可直接當案例庫。例如「Make the tests pass」→ 刪掉失敗的 test；「Fix the login bug」→ 修錯了三個中的一個；200 steps 沒進度；Python 3.8 vs 3.12；HTTP 429 after 50 calls；timeout 被當成 network down 結果對 deadlock 加 retry；「Permission denied」typo 卻用 sudo 重試；日期沒時區排程差 8 小時；閏年造成的隨機失敗。

### 5. 待查證的主張
- p16：Mem0（fact-centric、vector + optional graph）、Graphiti（temporal KG、hybrid semantic/keyword/graph search）、supermemory（profile + memory + document）的產品描述。
- p20：LoCoMo（ACL 2024）、LongMemEval（ICLR 2025）、BEAM（ICLR 2026）的會議與題數；「LoCoMo-Refined」是什麼。
- p21：Claude Code、Letta、Codex 的 memory 是否屬於「separate layer」或「inside harness」（投影片在兩欄都列了 Claude Code / Letta / Codex，需確認原意）。
- p9：Graphiti 跑在 FalkorDB / Neo4j。
- p22：0.95 獨立同分佈假設（投影片自己註明）。
- 閱讀頁數字：where-agents-fail 的 24% all-correct、17% step accuracy、最高 26% 相對提升；MAST 14 種失敗模式、150 traces、kappa 0.88、1,600+ traces、7 個框架；overthinking 4,018 trajectories、近 30% 提升、成本降 43%。

### 6. 閱讀清單（`pages/readings_sep-28.txt`）
首頁列出的兩篇：
- ✅ Where LLM Agents Fail and How They can Learn From Failures（Zhu et al., arXiv 2509.25370, 2025-09-29）— https://arxiv.org/abs/2509.25370 （Exa 確認：AgentErrorTaxonomy 涵蓋 memory / reflection / planning / action / system；AgentErrorBench）
- ✅ MemGPT: Towards LLMs as Operating Systems（Packer et al., arXiv 2310.08560）— https://arxiv.org/abs/2310.08560 （Exa 確認：virtual context management，仿 OS 階層記憶體分頁）

More reading：
- 🟡 RAG（Lewis et al., 2020）— https://arxiv.org/abs/2005.11401
- 🟡 Why Do Multi-Agent LLM Systems Fail?（2025）— https://arxiv.org/abs/2503.13657
- 🟡 Beyond the Leaderboard: A Synthesis of Tool-Use, Planning, and Reasoning Failures in LLM Agents（2026）— https://arxiv.org/abs/2607.05775
- 🟡 The Danger of Overthinking（2025）— https://arxiv.org/abs/2502.08235

分節：「State management and agent memory」（RAG、MemGPT）、「Common failure modes and guardrails」（其餘四篇）。
注意：RAG 的「Why it matters」寫的是 prefix caching 與 serving 分層；where-agents-fail 提到「the diagnosis order of this meeting」「the instrumentation section」——這些 AI 生成摘要看起來是為別的課次版本寫的，跟本講 deck 對不上。**Mem0、Graphiti、supermemory、LoCoMo/LongMemEval/BEAM 在閱讀頁都沒有連結**，只出現在投影片。

### 7. 先備知識與斷崖
- 斷崖 1：p9 一次丟出 Redis / SQLite / Postgres JSONB / pgvector / Chroma / Pinecone / Neo4j / FalkorDB，預設讀者懂 KV、關聯式、向量、圖資料庫的差異。沒有資料庫背景的讀者要補一段「四種 store 各擅長什麼查詢」。
- 斷崖 2：p11 vector search + top-k 預設懂 embedding 相似度檢索（RAG 背景）。
- 斷崖 3：p14 valid time 是 temporal database 的概念，投影片只用一張圖帶過。
- 內部斷層：同一講前後兩半主題不太相連（memory vs reliability），只有 p26「Memory error：recalled a stale note as fact」把兩者接起來。導讀可以用這格當橋。
- reliability 段門檻低（機率乘法而已），但需要讀者有實際用 coding agent 失敗的經驗；L2/L3 的 Claude Code 使用經驗是隱含前提。

### 8. 作業連結
- 本講沒提作業。A2（Mads-Loop）要求「retries, termination, graceful failure under malformed output and broken tools」（assignments 頁），與 p26–28 的 harness / tool 失敗表直接對應（推論，投影片沒講）。
- A3 的 agent container 有 memory 欄位（A3 p2 圖）。

---

## L7 — 2026-09-30 Agent design IV: agent evaluation

### 1. Deck facts
- 檔案：`slides/7_agent_design_4.pdf`，37 頁（p37 空白結尾頁）。
- 配套 course note：`pages/notes_agent-evaluation.txt`（約 15,500 字，AI 生成、講師與 TF 審過，L6 p2 公告）。
- p4 Plan 寫「Agent evaluation」＋「Cost-effective agents」，但 cost 實際移到 L8；p36 Next class 寫「Cost-effective agent / Case study / Different types of agents / Agentic frameworks」。
- p8 與 p9 文字完全相同（推測是動畫分頁）。

### 2. Section outline
| 段落 | 頁 |
|---|---|
| Logistics：poster、A2 週日截止 | p2 |
| Logistics：Claude Code session log 規定與 A1 寫作的 AI 使用統計 | p3 |
| Plan | p4 |
| 怎麼評估 agent：component-level vs end-to-end | p5–6 |
| 歷史：Before 2018 → 2025–2026 六個時期的 benchmark | p7 |
| Evaluation objectives（predict text / correct answer / preferred response / functioning code / interactive task） | p8–9 |
| Metrics：perplexity、accuracy/F1、win rate、pass@k、pass^k、cost、latency | p10 |
| Benchmark evaluation loop（pseudocode） | p11 |
| 代表性 benchmark：GAIA、BFCL、WebArena、OSWorld、SWE-bench、τ-bench（兩頁）、Terminal-Bench（兩頁）、TheAgentCompany | p12–22 |
| 總表 | p23 |
| Challenges：data leakage 四層、leakage 遍及整個 agent stack | p24–26 |
| Challenges：single user turn（含學生 A1 使用資料圖） | p27–30 |
| Challenges：cost/latency、non-determinism、side effects、metrics | p31 |
| 前沿追上速度、benchmark 飽和時間軸、評估演進總表 | p32–34 |
| Assignment 3 評分：capability / cost / speed 的 Pareto rank | p35 |
| Next class | p36 |

### 3. 核心概念：新 vs 沿用
- **新**：幾乎全部。component vs end-to-end（p6）；評估目標的五種「成功」定義（p8）；pass@k vs pass^k（p10、p19）；benchmark loop 三件套（environment reset、agent step、evaluator 看 final answer / final state / trajectory，p11）；8 個 benchmark 的觀察空間、動作空間、評分方式；leakage 的四層（training / eval-time / environment / benchmark overfitting，p25）與 `P = f(LLM, prompt, scaffold, tools, retriever, memory, environment)`（p26）；benchmark 飽和；Pareto dominance（p35）。
- **沿用**：harness / scaffold 概念（L2、L4）；memory（L6，p6 component-level 列了 memory extraction/consolidation/retrieval）；L6 p19–20 已預告 memory 評估指標與 LoCoMo 等 benchmark，本講沒再提。
- 學生自己的 Claude Code 使用資料（A1 session log）第一次被拿來當教材（p28–29），L8 延續這種做法。

### 4. 可當 worked example 的具體例子與數字
- p3：A1 寫作的 AI 使用統計——17 人用 Claude 協助寫作（6 人潤稿、數人列點後讓 Claude 寫、7 人寫草稿再改、4 人幾乎原樣輸出、2 人把 Claude Code 的 TODO 留在 writeup）；3 人嘗試刪除歷史。
- p12–13 GAIA：466 題；Level 1 ≤5 步、0–1 個工具；Level 2 5–10 步；Level 3 任意長；例題「試算表找電影→導演→出生地」；只評最終答案，公式 `score = (1/N) Σ 1[normalize(ŷ)=normalize(y)]`。
- p14 BFCL：訂最便宜的 Boston→Chicago 機票，兩種錯誤（捏造 passenger_id、呼叫無關的 get_weather）。
- p15 WebArena：GitLab 開 issue、指派 Alex、加 documentation label；812 tasks；WebArena-Verified 移除 LLM-as-judge。
- p16 OSWorld：LibreOffice 加計算欄位、排序、存 result.xlsx；369 tasks；OSWorld 2.0（2026）108 個長流程、約 27 個 checkpoint。
- p17 SWE-bench：empty index 例外；Verified / Lite（300）/ Multilingual（9 種語言）/ Multimodal / Pro。
- p18–19 τ-bench：改簽晚班機、basic economy 不可改；`r = r_action × r_output`；pass^k 例「4 of 4 runs succeed」。
- p20–21 Terminal-Bench：TB 2.0 89 tasks → TB 4.0 66 tasks、8 小時 timeout；代表任務是 live KV service 換協定不掉連線；SWE-bench / Terminal-Bench / OSWorld 三欄對照。
- p22 TheAgentCompany：175 tasks；`S_partial = 0.5·earned/total + 0.5·S_full`，4/8 未完成 0.25、7/8 未完成 0.44、8/8 完成 1.00——可以當手算題。
- p28–29（圖）：A1 學生 prompt 長度分布（21–100 字元最多，約 880 筆）；每個 build session 的 prompt 數（1 個：40、2–5 個：49、6–10：13、11–25：32、26–50：24、51+：8）；session 活躍時間（<10 分鐘 51、4 小時以上 23）。
- p31：「200-step、$40 vs 12-step、$0.30」的對比。
- p32：GLUE 14 個月到人類水準、MMLU 39 個月到專家水準、GPQA Diamond 10 個月、SWE-bench Verified 33%→95% 用 22 個月、ARC-AGI-2 11 個月到一般人水準、ARC-AGI-3 0.5%→62.7% 用 6 個月（標星號）。
- Note 裡的 worked examples：退款 toy task 的三條軌跡（note「A worked example: the refund happened」）；p=0.8、k=3 時 pass@3=99.2%、pass^3=51.2%；n=5、c=3 時估計 pass@2=90%、pass^2=30%（plug-in 會得到 84%/36%）；System A vs B 的 100 題配對比較（70% vs 75%、$1.43 vs $2.00 per success、每多解一題 $10）。

### 5. 待查證的主張
- p32 所有「X 個月追上」的數字與 ARC-AGI-3 的 62.7%（有星號，註解沒被抽出來，需回 PDF 看）。
- p33 各 benchmark 的「Saturated / Still open」分類（截至 2026 年 9 月）。
- p20 TB 2.0 89 題、TB 4.0 66 題、8 小時 timeout；p21 引用「Merrill et al., Terminal-Bench 2.0, arXiv 2026」。
- p16 OSWorld 2.0（2026）108 個 workflow、約 27 checkpoints；note 的版本表又寫「OSWorld 2.1, September 16, 2026」——兩個版本號要對齊。
- p19 τ³-bench 的內容（corrected tasks、more domains、knowledge retrieval、voice）。
- p14 BFCL V4 加入 web search、memory；ICML 2025。
- p12 GAIA 466 題；p15 WebArena 812；p16 OSWorld 369；p22 TheAgentCompany 175。
- p10「Pass^k introduced by τ-bench」。
- Note：METR Time Horizon 1.1（2026-01-29 發布，170→228 tasks，Vivaria→Inspect；2026 年 3 月修正 regularization；16 小時以上不可靠）；SWE-Bench Pro Public V2（2026-09-22）；Terminal-Bench 4.0.0（2026-08）；LongMemEval V2（2026-05）。Note 自己標明「Official sources checked on September 27, 2026」。

### 6. 閱讀
- 本講在首頁的 Readings 欄沒有論文清單，只放 course note「Agent evaluation and benchmarks」— https://cs2680.com/notes/agent-evaluation.html ✅（本地已有全文）。
- Note 結構：前半是 evaluation guide（What are we evaluating / 一次 episode 發生什麼 / 依任務與證據選 benchmark / grader 也是量測的一部分 / 讀懂指標（pass@k vs pass^k、成本、不確定性、METR horizon）/ 設計你自己的評估 / 區分 contamination 與 grader gaming / 用 trace 決定要改什麼 / 要報告什麼）；後半是 **48 個 benchmark 目錄**（PTB 到 MLE-bench，每項都有 Representative task / Scoring / What it measures），最後一節是 Release and version notes。
- Note 內引用但未另列的來源（🟡 title only）：Anthropic 評估指南、Agentic Benchmark Checklist、AI Agents That Matter、Adding Error Bars to Evals、NIST agent-evaluation case studies、MT-Bench/Arena 論文、METR 方法論頁。
- 投影片引用的論文（只在頁尾，🟡）：Mialon et al. GAIA 2023；Patil et al. BFCL ICML 2025；Zhou et al. WebArena ICLR 2024；Xie et al. OSWorld NeurIPS 2024；Jimenez et al. 2024 SWE-bench；Yao et al. τ-bench 2024；Merrill et al. Terminal-Bench 2.0 2026；Xu et al. TheAgentCompany 2024。

### 7. 先備知識與斷崖
- **投影片本身**統計門檻低：pass@k / pass^k 只用文字定義，p19 用「4 of 4」帶過。
- **Note 有明顯的統計斷崖**：pass@k 與 pass^k 的組合數不偏估計式 `1 − C(n−c,k)/C(n,k)`、`C(c,k)/C(n,k)`；plug-in 估計有偏；paired bootstrap（按 task 重抽、同 task 的 trials 綁在一起、cluster）；METR 對數人類時長的 logistic 擬合。讀者需要基本機率、組合數、bootstrap 信賴區間概念。導讀若要用 note，需要一篇橋接（或附錄）解釋「為什麼不能直接 0.6²」。
- 斷崖 2：p10 perplexity 的定義（exponentiated average NLL），對沒有 LM 背景的讀者是黑話；但它是歷史脈絡，可輕帶。
- 斷崖 3：benchmark 目錄 48 項資訊量很大，系列文不宜照搬，應只挑投影片的 8 個。
- 與 L6 的重疊：L6 p19–20 已講 memory 評估；L5/L6 的失敗分類在本講 p31「metrics」那行（outcome-only 讓 lucky run 過關、trajectory matching 誤殺合法路徑）會再出現。

### 8. 作業連結
- p35：**A3 的評分方式**在這講先預告——capability（越高越好）、cost（越低越好）、speed 三個指標的 Pareto rank：「A dominates B if A is no worse on any metric and better on at least one」，Rank 1 是 Pareto frontier（圖上 speed 沒畫）。
- p3：A2 的 session log 要完整打包，缺少會從 A2 扣分；竄改 log 視為違反學術誠信。
- p31：MaDSys 組在做「用真實流量做 agent 評估的研究平台」，徵每週 20+ 小時的學生。
- A2（Mads-Loop）要求「build the evaluation set the rest of the sequence is graded on」（assignments 頁開頭），與本講直接相關。

---

## 2026-10-05 Guest lecture（Snowflake）

- 講者 Harsh Nilesh Pathak（Snowflake），題目「Developing and Evaluating Agents in Enterprise Setting」。
- 首頁該列 Readings 欄是空的 `<td></td>`，**沒有 slide、沒有 reading、沒有錄影連結**（index.html 第 353–360 行）。同一列標「Assignment 3 out (Mads-Opt: Make every token count)」。
- 結論：沒有可用素材，系列文只能略過或一句話帶過。

---

## L8 — 2026-10-07 Advanced agent design I: Cost and performance

### 1. Deck facts
- 檔案：`slides/8_agent_design_5.pdf`，54 頁，標題頁寫「Agent design V: cost-effective agents」。另附 `slides/8_assignment3.pdf`（7 頁，「Assignment 3: MadsOpt: Harness Competition」）。
- 配套 course note：`pages/notes_cost-effective-agents.txt`（約 2,700 字）。
- **一份 deck 兩個主題**：p4 Plan 寫「Cost-effective agents / Agent architecture / Coding agent case study」。前 38 頁是成本與速度，p39–53 是 harness 架構（monolithic / modular / microkernel）與 8 個 coding agent harness 的特色比較，兩者之間沒有過渡頁。
- 時間矛盾：p2 寫「Assignment 3 starting today」（10/07），首頁與 assignments 頁寫 A3 out Mon Oct 5。
- p38 寫「Remember this for your Assignment 4!」——但「run → profile → change one thing → re-evaluate」比較貼近 A3（Mads-Opt）或 A5（Mads-Stack）；A4 是自架 serving engine。可能是講師口誤，也可能是指 A4 的 harness 救援部分，待確認。

### 2. Section outline
| 段落 | 頁 |
|---|---|
| Logistics：A3 開始、占 20%「當期中考看」、leaderboard 每日限次、A4 改 20 分 A5 改 10 分（A5 太難且與 project 重疊）、新增兩堂 bonus paper presentation、session log | p2–3 |
| Plan | p4 |
| **Cost-effective agents**：只談 LLM cost | p5 |
| session 結構（turn / step）、成本分解公式 | p6–7 |
| 槓桿 1：turns per session（學生資料）→ 減少 user turns | p8–9 |
| 槓桿 2：steps per turn（學生資料）→ 減少 steps；ADVANCED 論文頁 | p10–12 |
| 槓桿 3：tokens per step（學生資料三張）→ 減少 input tokens；ADVANCED；減少 output tokens（兩頁）；ADVANCED | p13–20 |
| 槓桿 4：price per token：caching 與 batching、model routing、後續課程的系統技術；ADVANCED | p21–24 |
| 每項節省都有反成本、每個 task 設預算上限、需不需要 LLM | p25–27 |
| **Make your agent faster**：critical path、serving、orchestration、tool calls、parallelize、speculative actions；兩頁 ADVANCED；PASTE 與 SPORK 兩例 | p28–37 |
| Optimize in a loop | p38 |
| **Agent Architecture**：三種 harness 架構、各自優缺點、跑一段 Python 的三種流程、比較表 | p39–45 |
| **8 個 harness**：總覽、Codex CLI / DeepSeek Harness / OpenCode / Pi / oh-my-pi / OpenClaw / Hermes Agent 各一頁 | p46–53 |
| Next class：agent safety and security、self-evolving harness | p54 |

### 3. 核心概念：新 vs 沿用
- **沿用**：L1 p32 已講 KV cache、prefix cache；L2 p12「prefix-cache reads account for most of the cost」；L4 的 compaction、offload to file、subagent 隔離探索（p16 的「keep context lean」大多是 L4 回顧）；L5 的 parallelism 與 critical path 概念（L5 p22 粒度公式）；L6 的 memory（p12 列 Mem0）；L7 的 cost/latency 指標與 Pareto（p35）。
- **新**：成本分解公式 `Cost = Users × Sessions/User × Turns/Session × Steps/Turn × Tokens/Step × Price/Token`，前兩項要 GROW、後四項要 SHRINK（p7）；「turn k 重讀前 k−1 輪，總成本隨 turn 數平方成長」（p9）；cache read : input : output 價格比（p15、p21）；model routing 三型（choose up front / escalate on failure / re-route each step，p22）；counter-cost（p25）；budget cap 與停止條件（p26）；「需不需要 LLM」（p27）；completion time = critical path（p29）；orchestration 四招（async、persistent sessions、stream and pipeline、colocate，p31）；speculative actions（p34–37）；harness 三種架構（p40–45）；8 個 harness 的特色機制（p46–53）。
- p23 預告後面 Part II 的系統技術（MoE、quantization、pruning、distillation、speculative decoding、KV-cache optimization、kernel、accelerator）——本講不展開。

### 4. 可當 worked example 的具體例子與數字
- 學生資料（全部來自 A1/A2 的 Claude Code session log，是很好的「真實數字」素材）：
  - p8：單一 prompt 的 session 比例 A1 68%（n=1,563，median 1）、A2 75%（n=634）；有「marathon 100+ turns」。
  - p10：每 turn 的 step 中位數 A1 3、A2 4；有些 turn 近 1,000 steps；講師歸因為 effort 設 medium/high。
  - p13：每 step token 數，main agent 中位數 A1 208K、A2 301K（p90 600K–700K）；subagent 中位數約 80K、p90 約 200K。
  - p14：約第 500 步時 context A1 670K、A2 650K。
  - p15（圖）：A1 共 51,163 steps、11.6B tokens；cache read 中位數 150K/step、占 97.6%；cache write 中位數 1.12K/step、占 2.0%；output 中位數 434/step、占 0.4%；價格比 cache read : input : output = 1 : 10 : 50。
- p11：一次一個 action 要 4 次 model call，plan then batch 只要 2 次。
- p21：Claude API 相對 base input 的價格：output 5×、base input 1×、batch 0.5×、cached input 0.1×、batch+cached 0.05×。可以出一題「同一個 session 用與不用 cache 的帳單」。
- p26：預算上限範例 $10、80 calls、15 分鐘 tool time、每步 2 retries；從 trace 設上限，例如成功任務 p95 的 2 倍（投影片註明是示意）。
- p17 ADVANCED 數字：ACON 峰值 context 減 26–54%；Active Context Compression 減 23%；LLMLingua 最多 20×；Code execution with MCP 150K → 2K tokens；Tool Search 減 85% tool tokens；Programmatic Tool Calling 減 37%。
- p20：Tool-making agents 減 58% output tokens。
- p37：PASTE（從過去 trace 預測下一個工具，search → visit(results[0].url) → extract）vs SPORK（在推理中 fork 出 probe 提早發 tool call）。
- p44：「跑一段 Python」在三種架構中的流程差異。
- p47–53 各 harness 的具體機制：Codex CLI 無網路 sandbox、Lark grammar 的 patch、四階段 hunk 比對；DeepSeek Harness 連 loop 都是 plugin、YAML layers、compare-and-swap 編輯；OpenCode 是 OpenAPI HTTP server、九種 replacer、shadow git 讓 /undo 還原檔案；Pi 四個工具、無 MCP/sub-agent/approval、預期省 $0.05 以上才送 keep-alive、pi-ai 支援 42 providers / 10 wire APIs；oh-my-pi hashline（4-hex tag）、常駐 shell、snapcompact 把舊歷史轉成圖片、TTSR regex；OpenClaw 27 個 chat channel、compaction 前先寫 dated notes、fences/taint/secret sentinels；Hermes Agent 背景 fork 改 memory 與 skills、50% window 就 compaction（八個裡最早）、side effect 前先寫 DB。
- Note 的 worked examples：baseline $120 / 80 次成功 = $1.50 per success vs candidate $90 / 75 次 = $1.20，但若要求 80% 成功率 candidate 不合格；workflow 發現成本 $2,000、每 task 省 $0.02 → 約 100,000 tasks 才回本；「快 20% 但貴 30%」是買了 latency 而非省成本。

### 5. 待查證的主張
- p21 Claude API 價格倍率（output 5×、batch 0.5×、cached 0.1×、batch+cached 0.05×）與 p15「1 : 10 : 50」——兩組比例需與 Anthropic 現行 pricing 對；p15 的 1:10:50 與 p21 的 0.1 : 1 : 5 是同一比例的兩種寫法，可互相印證。
- p9：「total cost grows with the square of turn count」——在有 prefix cache 時的實際帳單是否仍是平方（cache read 便宜但仍按量計費）。
- p10：steps 少「mostly because effort is set to medium or high」（因果歸因，投影片未給證據）。
- p12、p17、p20、p24、p35–36 所有 ADVANCED 論文的年份與數字（ACON、LLMLingua、Tool Search 85%、Programmatic Tool Calling 37%、Code execution with MCP 150K→2K、Speculative Actions ICLR 2026 等）。
- p46–53 八個 harness 的作者、語言、機制：Claude Code（Anthropic、TypeScript、closed）、Codex CLI（OpenAI、Rust）、DeepSeek Harness（TypeScript）、OpenCode（Anomaly/SST、TypeScript + Bun）、Pi（Mario Zechner / Earendil）、oh-my-pi（Can Bölük / Stencil Labs、TS + Rust）、OpenClaw（OpenClaw Foundation）、Hermes Agent（Nous Research、Python）。每一頁的具體數字（27 channels、42 providers、$0.05、50% window、九種 replacer）都需要對 repo。
- p46 寫 eight harnesses，但只有 7 頁「Unique to」，**Claude Code 沒有獨立頁**。
- p23「Workload-targeted fine-tuning」列在 model optimization。

### 6. 閱讀
- 首頁本講 Readings 欄只有 course note「Cost-effective agents」— https://cs2680.com/notes/cost-effective-agents.html ✅（本地全文已讀）。
- Note 結構（14 節）：Measure the whole episode / Find the expensive path / Route model calls by expected value / Turn repeated narrow work into small-model capabilities / Budget reasoning, sampling, and search / Remove model turns from routine control / Keep context small without losing actionable state / Reuse facts, plans, and executable skills / Pay only for useful collaboration / Amortize workflow and prompt optimization / Lower serving cost without confusing it with fewer tokens / Reduce waiting with a separate money budget / Prevent expensive rework / Run a fair cost experiment。
- Note 與 deck 的組織方式不同：deck 按成本公式的四個因子排；note 按「設計決策」排，並強調每個技巧的反成本與公平比較。Note 末尾寫「Selected sources from the supplied literature map, reviewed September 27, 2026」。
- Note 內引用（🟡 title only）：AI Agents That Matter、Cost-of-Pass、RouteLLM、Budget-Aware Agentic Routing、LLMRouterBench、The Replay Gap、FireAct、Agent Distillation、ToolOrchestra、Adaptive-Consistency、BATS、ExTS、ReWOO、LLMCompiler、CodeAct、Agentless、ACON、CoACT、TACO、Agentic Plan Caching、Voyager、AgentPrune、AgentSlimming、OneFlow、RCR-Router、DSPy、AFlow、TopoPrior、Tool-R1、PTA-IRT、vLLM、SGLang、Continuum、AWQ、Speculative Actions、Speculative Macro Commit、SWE-agent。
- harness 架構段（p39–53）**沒有任何閱讀或 note**。

### 7. 先備知識與斷崖
- **斷崖 1：prompt caching / prefix cache / KV cache**。p15、p21 的帳單分析前提是懂「cache read 為什麼便宜」「stable prefix 為什麼重要」。L1 p32 與 L2 p12 有鋪，但 KV cache 的機制真正要到 Part II（10/19 起的 serving 課、11/04 prefix caching）才講。系列文需要在本篇放一段橋接，說明 prefix cache 是什麼、為何 timestamp 放進 prefix 會打破 cache（note「Lower serving cost」節）。
- 斷崖 2：p23 與 note 的 serving 段一次點名 speculative decoding、quantization、MoE、batching、phase-aware serving——都是 Part II 內容，在這裡是「預告」，導讀應明講「之後才講」。
- 斷崖 3：speculative actions（p34–37）借用 CPU speculative execution / speculative decoding 的直覺，投影片沒解釋這個類比。
- 斷崖 4：harness 架構段（p40–45）借用作業系統的 monolithic vs microkernel 類比，沒修過 OS 的讀者需要一句話說明。
- 斷崖 5：note 的「cost per success」與 L7 note 的定義相同，需要 L7 的 Pareto / paired comparison 概念。
- 內部斷層：成本與 harness 架構兩個主題在 deck 裡直接切換，導讀應拆成兩篇或在中間明確轉場。

### 8. 作業連結：Assignment 3 Mads-Opt
- 名稱：Mads-Opt: Make every token count（assignments 頁）；slide 標題「MadsOpt: Harness Competition」。out Mon Oct 5、due Tue Oct 20 11:59pm，占 20%，估計 10–15 小時；以「已發布的 blog post」繳交（assignments 頁）。
- 要做什麼（assignments 頁）：model 仍是 black-box API，優化它周圍的一切——減少不必要的 token 與 call、在夠用時選便宜模型、讓 tool 執行重疊、壓縮或重組 context、重新設計 control flow；**維持 task success 不變，同時壓低 cost 與 latency**。
- 框架（A3 p2–3，含架構圖）：26 個 task、3 種 container；Agent container（學生的 `src/`：loop、prompts、tools、subagents、memory ＋ dispatcher client）與 Task container 分離，透過 HTTP POST `Sandbox(url, workdir)` 存取 task（sandbox_server.py，`/health /exec /read /write :8000`，repository 在 `/app`）；Grading container 用 task image + patch + hidden tests 評分；facility `run_all.py` 啟動 container 並保存結果。離線評估只能連 api.cs2680.com；最多同時 5 個 task。
- 限制（A3 p4）：三種模型 Expert / Standard / Starter；每次 evaluate() 35 分鐘、總共 4 小時；成本每天 $30、每次 run $10。
- 程式結構（A3 p5）：`init.sh`、`package_claude_sessions.py` 產生 session log；`src` 打包成 zip，是唯一上傳到 leaderboard 的檔案；dispatcher 與 evaluation_scripts 與 leaderboard 相同，不可修改。
- Leaderboard（A3 p6）：https://leaderboard.cs2680.com （首頁公告 Oct 8, 2026 上線）；用 Canvas email 登入；一次只能有一筆在佇列，取消的 submission 也算次數並扣當日預算。量測三項：解出的 task 數、每個解出 task 的成本、每個解出 task 的時間。
- 評分（A3 p7 + L7 p35）：三指標的 skyline（Pareto）排名；至少解 7 題才列入；排名算「在你前面的人數」（1,1,1,4…）；baseline 是解 16 題；分數 `max(81 − r, 50)`（若任一 submission 達 baseline），否則 `81 − r`；leaderboard 80 分 + writeup 10 + video 10。
- 與 L8 內容的對應：p7 成本公式的四個 SHRINK 因子、p21 caching、p22 routing（Expert/Standard/Starter 三模型正好是 routing 題）、p26 budget cap（$10/run 的硬限制）、p31–33 orchestration 與 parallel（5 tasks 並行）、p38 optimize loop。
- 後續：10/26「Assignment Feedback and Student sharing II：Common pitfalls in your submission; Assignment 3 lessons sharing」（首頁）——目前還沒有素材。

---

## 2026-10-14 Advanced agent design II: agent safety, self-evolving harness（學生主講）

- Speaker 欄是「Students」；首頁該列**沒有 slide 連結**，Notes 欄空白（index.html 第 379–389 行）。本地 `slides/` 沒有對應檔案。
- 首頁主要閱讀：✅ OWASP Top 10 for Agentic Applications 2026（OWASP GenAI Security Project, Agentic Security Initiative，2025 年 12 月版，CC BY-SA 4.0）— https://genai.owasp.org/download/52117/?tmstv=1765059207 （Exa 打開確認封面與授權頁）。
- `readings_oct-14.txt` 共 18 篇，四節（每篇都有 Background / Problem / Key idea / Findings / Why it matters 的 AI 摘要）：
  - **Agent safety I: attacks**：OWASP agentic top 10；Indirect prompt injection（2023, arXiv 2302.12173）；AgentPoison（2024, 2407.12784）；Multi-Agent Systems Execute Arbitrary Malicious Code（2025, 2503.12188）；The Attacker Moves Second（2025, 2510.09023）。
  - **Agent safety II: defenses**：The Instruction Hierarchy（2024, 2404.13208，附註 GPT-4o mini 首先採用）；CaMeL（2025, 2503.18813）；Design Patterns for Securing LLM Agents against Prompt Injections（2025, 2506.08837）；AI Control（2023, 2312.06942）；AgentDojo（2024, 2406.13352）。
  - **Self-evolving harnesses I（從自身經驗改進）**：Reflexion（2303.11366）；Self-Refine（2303.17651）；ADAS（2408.08435）；Darwin Gödel Machine（2505.22954）；ACE: Agentic Context Engineering（2510.04618）。
  - **Self-evolving harnesses II（自動化 harness engineering）**：Meta-Harness（2026, 2603.28052）；Agentic Harness Engineering（2026, 2604.25850）；Live-SWE-agent（2025, 2511.13646）。
  - 以上除 OWASP 外皆 🟡 title only。
- 與前面講次的連結：L6 p18 的「Persistent prompt injection」、L8 p52 OpenClaw 的 fences / taint / sentinels、L8 p53 Hermes Agent 的「背景 fork 改 memory 與 skills」、L7 note 的 AgentDojo 條目，都是這堂的伏筆。
- 結論：只有閱讀清單，沒有講師 deck；若寫導讀，只能寫成「閱讀地圖」型文章，並標明無課堂素材。

---

## notes/transformers（Transformers and LLM foundations）

- 支援哪一講：頁首自述「brings together the material from the **former October 19 LLM lecture**」——原本 10/19 有一堂 LLM 講次，現在 10/19 改成「Efficient LLM serving basics I」，這份 note 是被拿掉那堂的替代閱讀，定位為 **Part II（serving）的背景**。首頁的 Reference pages 清單裡，這一項被 HTML 註解掉（index.html 第 555 行），所以網站上看不到入口。
- 性質：optional background readings，約 16,500 字，純論文導讀，每篇用 Background / Problem / Key idea / Findings / Why it matters 格式。
- 大綱（只列章節）：
  1. Foundations：Transformer、Illustrated / Annotated Transformer、GPT-1/2/3、BERT、T5
  2. Tokenization：BPE、SentencePiece、Dolma、SuperBPE、BLT、H-Net
  3. Architecture：RoPE、ALiBi、RMSNorm、SwiGLU、MQA、GQA、DeepSeek-V2/MLA、YaRN、Gated DeltaNet
  4. Sparse and alternative architectures：GShard、Switch Transformer、DeepSeekMoE、DeepSeek-V3、Mamba、MiniMax-01、DeepSeek-V4
  5. The scaling-law argument：Kaplan scaling laws、Chinchilla 與其複現、over-training、data limits、precision scaling、test-time compute、observational scaling、ScaleRL、2026 年兩篇
  6. Data：The Pile、C4 analysis、DataComp-LM、OLMo、Pythia、FineWeb、Nemotron-CC、Common Pile、Olmo 3
  7. Post-training：FLAN、T0、InstructGPT、Constitutional AI、DPO、GRPO、Tulu 3
  8. Reasoning：CoT、self-consistency、STaR、DeepSeek-R1、Qwen3、s1、test-time scaling in the wild
  9. Evaluation：MMLU、HELM、emergent abilities 與 mirage、Chatbot Arena、benchmark contamination、LongBench、MMLU-Pro、RULER、HELMET、judges saturate first
  10. Representative model reports：GPT-4、LLaMA 1–3、Mistral 7B、Gemma 3/4、gpt-oss、Kimi K2/K3、GLM-4.5/5、Qwen3.5、MiniMax-M2.5、Claude Opus 4.6
- 與 L5–L8 無直接關係；它的 Evaluation 節與 L7 有少量重疊（MMLU、HELM、Arena、LongBench、MMLU-Pro）。

---

## 跨講觀察（給系列規劃用）

- **重疊**：
  - memory 出現在 L2（p16）、L4（p47）、L6（主講）、L7 p6（component eval）、L8 p12（Mem0 等）、L8 p52–53（OpenClaw / Hermes 的 memory 機制）。
  - 失敗分類有三套：L5 p24–25（分解失敗）、L5 p36（black-box LLM 的多 agent 問題）、L6 p24–29（五層歸因）；閱讀又有 MAST 14 種與 AgentErrorTaxonomy。導讀需要決定以哪套為主。
  - cost/latency 在 L7 p10、p31、p35 已經出現，L8 才完整展開；兩份 note 互相引用（L7 note「Quality has a systems cost」指向 cost note；cost note 指回 eval note）。
  - critical path：L5 p22 的公式與 L8 p29 是同一個概念。
- **排程漂移**：L5 Plan 列 memory（實際在 L6）；L6 Plan 列 multi-agent 續（deck 沒有）；L7 Plan 列 cost（實際在 L8）；L7 Next class 列「Different types of agents / Agentic frameworks」，對應到 L8 的 harness 架構段。
- **缺素材**：10/05 Snowflake 客座、10/14 學生場次都沒有 slide；L5 p4、L6 p4 是空白頁。
