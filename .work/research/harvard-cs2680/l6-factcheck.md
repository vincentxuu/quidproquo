# L6「Agent design III: memory and reliability」主張查證

- 查證日期：2026-10-22
- 對象：Harvard CS2680 L6 投影片（`sources/slides/6_agent_design_3.pdf`，31 頁；頁碼 = PDF 頁序，已用 `pdftotext -f N -l N` 逐頁對過，跟研究筆記一致；投影片頁尾印的號碼從 p19 起比 PDF 頁多 1（p17 沒印頁碼））。p21 圖頁以 60 dpi 渲染讀過（兩欄之間有一個大問號，表示兩種做法孰優是開放問題）。
- 工具：本 session 沒有 Groundlane MCP；Groundlane HTTP 先前回 401；Exa connector 斷線。候選搜尋用 Keenable keyless；一手頁面用 `curl -sL` 直接抓（arXiv export API、arXiv PDF、GitHub raw README、code.claude.com 的 `.md` 文件、ACL Anthology），Mem0 文件頁與 Letta 文件頁用 `https://r.jina.ai/` 讀全文。沒有再往下降級。
- 判定：Confirmed｜Outdated（原文成立但現況已改）｜Contradicted｜Not found

## 結果統計

| Verdict | 數量 |
|---|---|
| Confirmed | 20 |
| Confirmed（需加條件） | 3 |
| Outdated | 1 |
| Contradicted | 0 |
| Not found | 0 |

## 查證表

| # | 主張 | 頁 | 來源 URL | 原文（節錄） | Verdict |
|---|---|---|---|---|---|
| 1 | MemGPT：仿作業系統的階層記憶體，把 context window 當最上層，由模型用 function call 搬移資料 | 閱讀 9/28 | https://arxiv.org/abs/2310.08560（PDF 全文） | "virtual context management, a technique drawing inspiration from hierarchical memory systems in traditional operating systems"；§2："main context (analogous to main memory/physical memory/RAM) and external context (analogous to disk memory/disk storage)"；main context = system instructions、working context、FIFO queue；external = recall storage、archival storage；"memory pressure" 警告時模型把資訊存到 working context 或 archival | Confirmed |
| 2 | Letta 就是 MemGPT 團隊的產品 | p15、p21 | https://github.com/letta-ai/letta README | "Letta (f.k.a. MemGPT) is actively developed." | Confirmed |
| 3 | Mem0：fact-centric；輸入依 user／agent／run 分範圍；向量檢索加過濾，graph memory 可選 | p16 | https://docs.mem0.ai/core-concepts/memory-types ；https://docs.mem0.ai/open-source/features/graph-memory ；https://github.com/mem0ai/mem0 README | 範圍：「Scope memory by `user_id`, `agent_id`, `run_id`, and metadata」✅；儲存的是抽出的事實：「`"I prefer aisle seats"` → `User prefers aisle seats`」✅。但檢索與 graph 已改：「Platform retrieval fuses these signals」（semantic、keyword、entity、temporal）；graph memory「Earlier versions of Mem0 offered graph memory by connecting an external graph database … No external graph store … Always on, all plans」；2026-04 新演算法「Single-pass ADD-only extraction -- one LLM call, no UPDATE/DELETE. Memories accumulate; nothing is overwritten.」 | Outdated（「向量＋可選 graph」是舊版描述；現行平台版是多訊號融合、graph 自動開啟、寫入只新增不覆寫） |
| 4 | Graphiti：時序知識圖；episodes 產生實體與有時間的事實；混合 semantic／keyword／graph 檢索 | p16 | https://github.com/getzep/graphiti README | 「Hybrid Retrieval: Combines semantic embeddings, keyword (BM25), and graph traversal」；「Facts have validity windows. When information changes, old facts are invalidated — not deleted.」；「Explicit bi-temporal tracking with automatic fact invalidation」；「Every entity and relationship traces back to the episodes (raw data) that produced it.」 | Confirmed |
| 5 | Graphiti 跑在 Neo4j／FalkorDB | p9 | 同上 | 「Neo4j 5.26 / FalkorDB 1.1.2 / Amazon Neptune … / Kuzu 0.11.2 (deprecated)」 | Confirmed（另支援 Neptune） |
| 6 | Graphiti 是 Zep 的核心元件，時序 KG | p16 | https://arxiv.org/abs/2501.13956 | 「Zep addresses this fundamental limitation through its core component Graphiti -- a temporally-aware knowledge graph engine」 | Confirmed |
| 7 | supermemory：維護使用者 profile，加上 memory 與 document 檢索 | p16 | https://github.com/supermemoryai/supermemory README | 「extracts facts, builds user profiles, handles knowledge updates and contradictions, forgets expired information」；「Hybrid Search: RAG + Memory in a single query」 | Confirmed |
| 8 | LoCoMo：ACL 2024；10 段長對話；1,540 題 | p20 | https://aclanthology.org/2024.acl-long.747/ ；https://github.com/snap-research/locomo（README＋`data/locomo10.json` 實際計數） | README：「The benchmark consists of ten conversations」，初版 50 段、公開版取 10 段。實際數 `locomo10.json`：QA 共 1,986 題，category 1/2/3/4/5 = 282/321/96/841/446；扣掉第 5 類（adversarial，考「不知道就說不知道」）剛好 1,540 | Confirmed（需加條件：1,540 是一般評測慣例扣掉 446 題 adversarial 後的數字；投影片同頁說這些 benchmark 涵蓋 abstention，但 1,540 這組不含 LoCoMo 的 abstention 題） |
| 9 | LongMemEval：ICLR 2025；500 題；5 種記憶能力 | p20 | https://arxiv.org/abs/2410.10813 | 「five core long-term memory abilities … information extraction, multi-session reasoning, temporal reasoning, knowledge updates, and abstention. With 500 meticulously curated questions」；comment「ICLR 2025」 | Confirmed |
| 10 | BEAM：ICLR 2026；2,000 題；最長 10M tokens | p20 | https://arxiv.org/abs/2510.27246 ；ICLR 2026 proceedings 頁 | 「long (up to 10M tokens) … BEAM, a new benchmark comprising 100 conversations and 2,000 validated questions」；PDF 首頁「Published as a conference paper at ICLR 2026」 | Confirmed |
| 11 | LoCoMo-Refined 是什麼 | p20 | https://github.com/mem-eval-suite/LoCoMo_refined README | 「recalibrates the original LoCoMo benchmark … the original evaluation could over-credit answers that were close in topic but wrong in detail」；1,382 題、修訂 337 題；原 judge 與人工一致率 43.67%，新 judge 86.33% | Confirmed（第三方專案，技術報告尚未發表） |
| 12 | 記憶 benchmark 分數的可信度（反證） | p20 | https://github.com/dial481/locomo-audit README（獨立稽核專案） | 「99 of 1,540 questions (6.4%) have wrong golden answers」；「62.81% of intentionally wrong vague-but-topical answers accepted by the LLM judge」；「GPT-4.1-mini … on full context scores 92.62%, exceeding EverMemOS (92.32%)」；「446 adversarial questions … no published LoCoMo result evaluates them」 | Confirmed（第三方稽核，非同儕審查；正文只當「要檢查 judge 與 baseline」的理由，不當定論） |
| 13 | 各家記憶服務自報的 benchmark 分數 | p16、p20 | Mem0 README；supermemory README | Mem0：「LoCoMo 92.5」「LongMemEval 94.4」「BEAM (1M) 64.1」，並註明「Scores reflect Mem0's managed platform」；supermemory：「#1 on every major AI memory benchmark — LongMemEval, LoCoMo, and ConvoMem」 | Confirmed（廠商自報；正文標明是自家數字，並指出兩家都宣稱領先） |
| 14 | Claude Code 的記憶在 harness 裡、存成 markdown 檔 | p15、p21 | https://code.claude.com/docs/en/memory.md | 「Each project gets its own memory directory at `~/.claude/projects/<project>/memory/`」；「The directory contains a `MEMORY.md` index and one topic file per memory」；「The first 200 lines of `MEMORY.md`, or the first 25KB, whichever comes first, are loaded at the start of every conversation」；「Claude Code doesn't load topic files … Claude reads them on demand」；「Auto memory is machine-local」 | Confirmed |
| 15 | Claude Code 記憶的寫入判準與時間戳（對照 p7、p14） | p7、p14 | 同上 | 「Claude doesn't save something every session. It decides what's worth remembering based on whether the information would be useful in a future conversation.」；「Claude skips anything it can derive from the codebase」；「Claude Code records the write time in a `modified` frontmatter field as an ISO 8601 timestamp」；接近上限時提醒「merge or drop stale entries」 | Confirmed |
| 16 | 「persistent prompt injection」：不可信內容寫進記憶，之後被當成指令取回 | p18 | https://arxiv.org/abs/2503.03704（MINJA） | 「The attacker injects malicious records into the memory bank by only interacting with the agent via queries and output observations」 | Confirmed（攻擊研究，支持投影片的失敗類型） |
| 17 | 0.95 每步成功率，1／5／10／20／50 步全對 95%／77%／60%／36%／8%；50 步約 13 次才 1 次全對 | p22 | 自行計算 | 0.95⁵ = 0.774、0.95¹⁰ = 0.599、0.95²⁰ = 0.358、0.95⁵⁰ = 0.0769（≈ 1/13.0） | Confirmed（投影片自己註明假設每步獨立） |
| 18 | 「真實執行比這個模型更糟：錯誤會傳播」 | p22 | https://arxiv.org/abs/2509.09677（Sinha et al., 2025） | 「the per-step accuracy of models degrades as the number of steps increases … we observe a self-conditioning effect -- models become more likely to make mistakes when the context contains their errors from prior turns」；「thinking mitigates self-conditioning」 | Confirmed（支持投影片；也說明「每步獨立」不成立的方向） |
| 19 | 指數衰減模型在實測資料上的表現 | p22 | https://arxiv.org/abs/2505.05115（Toby Ord, 2025） | 「the performance of AI agents on longer-duration tasks can be explained by an extremely simple mathematical model -- a constant rate of failing during each minute a human would take to do the task」；「Whether this model applies more generally on other suites of tasks is unknown」 | Confirmed（需加條件：只在 METR 的研究工程題組上驗證） |
| 20 | 閱讀：Where LLM Agents Fail — 失敗分類涵蓋 memory、reflection、planning、action、system；AgentDebug 24% all-correct、17% step accuracy、最高 26% 相對提升 | 閱讀 9/28 | https://arxiv.org/abs/2509.25370 | 「AgentErrorTaxonomy, a modular classification of failure modes spanning memory, reflection, planning, action, and system-level operations」；「a single root-cause error propagates through subsequent decisions」；「24% higher all-correct accuracy and 17% higher step accuracy compared to the strongest baseline … up to 26% relative improvements」 | Confirmed |
| 21 | 閱讀：MAST 14 種、150 traces、kappa 0.88、1,600+ traces、7 個框架 | 閱讀 9/28 | https://arxiv.org/abs/2503.13657 | 「1600+ annotated traces collected across 7 popular MAS frameworks … analysis of 150 traces … kappa = 0.88 … 14 unique modes, clustered into 3 categories」 | Confirmed |
| 22 | 閱讀：Beyond the Leaderboard 綜合 27 篇、六群失敗；加更多 scaffolding 不一定更可靠 | 閱讀 9/28 | https://arxiv.org/abs/2607.05775 | 「synthesizes 27 benchmark, taxonomy, and audit papers (2023-2026) … six failure clusters」；「failures compound nonlinearly with task length … additional scaffolding does not consistently improve reliability」 | Confirmed |
| 23 | 閱讀：Overthinking 4,018 條軌跡、近 30% 提升、成本降 43% | 閱讀 9/28 | https://arxiv.org/abs/2502.08235 | 「analyze 4018 trajectories … selecting the solution with the lower overthinking score, can improve model performance by almost 30% while reducing computational costs by 43%」 | Confirmed（需加條件：SWE-bench Verified 上的事後挑選，不是即時控制） |
| 24 | 閱讀：RAG 把知識從權重搬到可編輯的外部索引，檢索後再生成 | 閱讀 9/28、p11 | https://arxiv.org/abs/2005.11401 | 題名「Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks」（arXiv API 確認）；閱讀頁摘要「Knowledge moves out of the weights and into a store you can edit」 | Confirmed |

## 投影片內部與編排上的注意事項

- p3 的大綱列了「Multi-agent design (cont from last lecture)」，但這份投影片 p4 是空白頁，沒有多 agent 的續講內容。正文只寫「從第 5 堂接著講」，不聲稱這份投影片有多 agent 內容。
- p21 兩欄都列 Claude Code／Letta／Codex，中間一個問號：投影片把「記憶獨立成一層」與「記憶做在 harness 裡」並列成開放問題，沒有說誰屬於哪邊。正文只用 Claude Code 官方文件確認它目前屬於後者（markdown 檔、harness 內管理），Letta 與 Codex 不另做歸類。
- p26 把「Memory error：recalled a stale note as fact」放在 harness 層，是前後兩半唯一的接點；規劃表的自我檢查判準寫「memory」層，但五層裡沒有 memory 層，正文照投影片歸在 harness 層。
- 9/28 閱讀頁的 AI 摘要提到「the diagnosis order of this meeting」「the instrumentation section」，本份投影片沒有這兩段（研究筆記已記），正文不引用這兩句。
- 投影片沒有給「怎麼判斷錯在哪一層」的步驟；正文的「先找第一個出錯的步驟」引自 Where LLM Agents Fail 的 root-cause 觀點，標為延伸。

## 反證與近期研究（已全文或摘要層級讀過）

- 記憶 benchmark：locomo-audit（第三方）指出 LoCoMo 標準答案有錯、LLM judge 寬鬆、full-context 基準線可追平記憶系統；LoCoMo-Refined 重新校正 judge。結論：看記憶系統的 LoCoMo 分數，要同時看 judge 與 full-context 基準線。
- 錯誤複利：Sinha et al.（2025）實測每步正確率會隨步數下降（self-conditioning），比獨立假設更糟；Ord（2025）在 METR 題組上，固定失敗率的指數模型擬合得很好，但作者自己說不確定能否推廣。
- 記憶安全：MINJA（2025）示範只靠查詢就能把惡意紀錄寫進 agent 記憶。
