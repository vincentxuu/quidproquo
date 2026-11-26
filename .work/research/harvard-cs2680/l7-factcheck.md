# L7「Agent design IV: evaluation」主張查證

- 查證日期：2026-10-22
- 對象：Harvard CS2680 L7 投影片（`sources/slides/7_agent_design_4.pdf`，37 頁；頁碼 = PDF 頁序，已用 `pdftotext -f N -l N` 逐頁對過。p34 以前頁尾號碼等於 PDF 頁，作業 3 那頁 PDF 是 p35、頁尾印 36）；課程筆記 notes/agent-evaluation。
- 時效：2026-10-22 重抓投影片 PDF，sha1 與 10-21 存檔相同（`011dd08d…`）；重抓 https://cs2680.com/notes/agent-evaluation ，抽出文字逐行比對 10-21 存檔，0 行差異。
- 工具：本 session 沒有 Groundlane MCP 工具；Groundlane 直接 HTTP 先前回 401；Exa connector 斷線（404）。候選搜尋用 Keenable keyless（可用）；一手頁面用 `curl -sL` 直抓（arXiv PDF 與 export API、tbench.ai、GitHub issue 用 `gh issue view`）；OpenAI 與 NIST 頁面用 `https://r.jina.ai/` 讀全文。
- 判定：Confirmed（原文支持）｜Outdated（原文成立但有更新的反面證據）｜Contradicted（與原文不符）｜Not found（原文查不到）｜Not checked（正文不用，沒查）

## 結果統計

| Verdict | 數量 |
|---|---|
| Confirmed | 19 |
| Confirmed（需加條件） | 3 |
| Outdated | 0 |
| Contradicted | 0 |
| Not found | 0 |
| Not checked（正文不引用） | 1 |

## 查證表

| # | 主張 | 頁 | 來源 URL | 原文（節錄） | Verdict |
|---|---|---|---|---|---|
| 1 | pass@k 的不偏估計式 1 − C(n−c,k)/C(n,k)，plug-in 1−(1−p̂)^k 有偏 | note、p10 | https://arxiv.org/abs/2107.03374（Chen et al. 2021，Codex／HumanEval） | "we generate n ≥ k samples per task … count the number of correct samples c ≤ n … and calculate the unbiased estimator pass@k := E[1 − C(n−c,k)/C(n,k)] … One may be tempted to estimate pass@k with 1−(1−p̂)^k … but we show that it is biased in Appendix A." | Confirmed |
| 2 | pass@k 這個指標更早出自 Kulal et al. 2019 | （補充） | 同上；https://arxiv.org/abs/1906.04908 | "Kulal et al. (2019) evaluate functional correctness using the pass@k metric" | Confirmed |
| 3 | pass^k 由 τ-bench 提出：同一題 k 次獨立試驗全部成功的機率，跨題平均；估計式 C(c,k)/C(n,k) | p10、p19 | https://arxiv.org/abs/2406.12045（Yao et al. 2024） | "we propose a new metric – pass^k (pass hat k), defined as the chance that all k i.i.d. task trials are successful, averaged across tasks … unbiased estimates for pass^k and pass@k would be: pass^k = E_task[C(c,k)/C(n,k)]" | Confirmed |
| 4 | τ-bench 獎勵 r = r_action × r_output：最終資料庫完全一致＋回覆含必要資訊 | p19 | 同上 | "The reward of a task episode r = raction × routput ∈ {0, 1} is based on (1) whether the final database is identical to the unique ground truth outcome database (raction), and (2) whether the agent's responses to the user contain all necessary information (routput)" | Confirmed |
| 5 | τ-bench 的 r=1 不等於守規：可能沒確認就退款（課程筆記的退款例） | note | 同上 | "Note that r = 1 might be a necessary but not sufficient condition for a successful episode e.g., the agent might issue the return without explicit user confirmation, which violates the policy." | Confirmed |
| 6 | τ-bench 原始數字：gpt-4o retail pass^1 約 61%、pass^8 約 25% | （補充） | 同上 | "(∼61% on τ-retail and ∼35% on τ-airline) … to as low as ∼25% for pass^8 on τ-retail for the same model" | Confirmed（2024 年的模型，只當「pass^k 會掉很快」的示例） |
| 7 | GAIA 466 題；Level 1 不用工具或最多一個、≤5 步；Level 2 約 5–10 步、多工具；Level 3 任意長 | p12 | https://arxiv.org/abs/2311.12983 | "we devise 466 questions and their answer"；"Level 1 questions generally require no tools, or at most one tool but no more than 5 steps. Level 2 … roughly between 5 and 10 and combining different tools" | Confirmed |
| 8 | WebArena 812 題 | p15 | https://arxiv.org/abs/2307.13854 | "we curated 241 templates and 812 instantiated intents" | Confirmed |
| 9 | WebArena-Verified 拿掉 LLM-as-judge、改決定性比對 | p15 | https://github.com/ServiceNow/webarena-verified ；https://servicenow.github.io/webarena-verified/v1.2.3/evaluation/removing_llm_based_evaluation | "WebArena-Verified removed LLM-as-judge evaluation in favor of deterministic, data type-aware exact matching"；README："deterministic evaluators that operate on agent responses and captured network traces" | Confirmed |
| 10 | OSWorld 369 題 | p16 | https://arxiv.org/abs/2404.07972 | "we create a benchmark of 369 computer tasks" | Confirmed |
| 11 | OSWorld 2.0：108 個長流程、約 27 個 checkpoint | p16 | https://arxiv.org/abs/2606.29537 ；Snorkel 排行頁（二手） | arXiv 摘要："a benchmark of 108 long-horizon computer-use workflows … takes human users a median of about 1.6 hours"；Snorkel："avg 27.25 checkpoints per task" | Confirmed（checkpoint 數只在二手頁看到；課程筆記版本表另記 OSWorld 2.1, 2026-09-16。正文只寫 108 個長流程與部分給分） |
| 12 | SWE-bench Lite 300 題、Multilingual 9 種語言 | p17 | https://www.swebench.com/ ；https://swe-bench.github.io/multilingual | "300 curated SWE-bench style tasks from 42 repositories representing 9 programming languages" | Confirmed |
| 13 | BFCL V4 加入 web search 與 memory；ICML 2025 | p14 | https://gorilla.cs.berkeley.edu/blogs/15_bfcl_v4_web_search.html ；BFCL V4 release commit | "At ICML 2025, we're delighted to introduce BFCL V4 Agentic … Web search with multi-hop reasoning"；memory 另見 blog 16 | Confirmed |
| 14 | Terminal-Bench 2.0 有 89 題（Merrill et al.） | p20、p21 | https://arxiv.org/abs/2601.11868（ICLR 2026） | "Terminal-Bench 2.0: a carefully curated hard benchmark composed of 89 tasks … Each task features a unique environment, human-written solution, and comprehensive tests" | Confirmed |
| 15 | TB 4.0：66 題、8 小時 timeout、移除飽和題 | p20 | https://www.tbench.ai/news/terminal-bench-4-0（2026-08-28） | "All tasks in TB 4.0 are now set to a flat agent timeout of 8 hours"；"We removed 8 tasks: for saturation (2), refusals (2), public solutions (2), and unresolved quality or platform-compatibility issues (2)"；66 題見 EvalScope 與 evals.report（二手） | Confirmed（需加條件：被移除的 8 題中 2 題是因為「解答已公開」，正好是洩漏的例子，正文採用） |
| 16 | TheAgentCompany 175 題；S_partial = 0.5·Result/Total + 0.5·S_full | p22 | https://arxiv.org/abs/2412.14161 | "a set of 175 diverse, realistic and professional tasks"；"we define partial completion score as: Spartial = 0.5 · Result/Total + 0.5 · Sfull" | Confirmed（4/8→0.25、7/8→0.4375、8/8→1.00 用 Python 驗過） |
| 17 | 環境洩漏實例：SWE-bench Verified 的 agent 用 `git log --all` 看到未來修正 commit | p25「Environment leakage」 | https://github.com/SWE-bench/SWE-bench/issues/465（2025-09-03，Meta 研究員開） | "agents may look at future repository state … A trajectory with Claude 4 Sonnet … the agent uses `git log --all` which leaks future commits that directly fix the issue" | Confirmed |
| 18 | 訓練洩漏與測試瑕疵：OpenAI 停報 SWE-bench Verified | p25「Training leakage」、p31 | https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/ | "all frontier models we tested were able to reproduce the original, human-written bug fix … or verbatim problem statement specifics for certain tasks"；"We audited … 138 SWE-bench Verified problems that OpenAI o3 did not consistently solve over 64 independent runs … 59.4% of the 138 problems contained material issues in test design and/or problem description"；"OpenAI recommends reporting results for SWE-bench Pro" | Confirmed（需加條件：59.4% 是「o3 常解不出的 138 題」裡的比例，不是全體 500 題；發文日期頁面未顯示，正文不寫月份） |
| 19 | 執行時洩漏與評分器被鑽：NIST CAISI 在自家評測紀錄找到 agent 上網抓 CTF 解答、curl 新版程式碼、用 /dev/urandom 灌爆伺服器過關 | p25、p31、note | https://www.nist.gov/caisi/cheating-ai-agent-evaluations/2-examples-cheating-caisis-agent-evaluations（2025-11-28） | "we found several examples of both solution contamination and grader gaming"；"GPT-5 uses curl to find and submit a flag from an online challenge write-up"；"o3 curls the latest version of the code for the function it is supposed to fix"；"gpt-4o … sends infinite random data until the server is overwhelmed" | Confirmed |
| 20 | 評分設計瑕疵：τ-bench 什麼都不做的 agent 拿 38% | （補充，反證） | https://arxiv.org/abs/2507.02825（Agentic Benchmark Checklist） | "τ-bench contains intentionally unsolvable tasks—38% of the airline subset and 6% of the retail subset. Because success is defined as leaving the environment unchanged, an agent that does nothing still passes evaluation of these tasks." | Confirmed（需加條件：38% 是 airline 子集；摘要另說 trivial agent 勝過一個 GPT-4o agent） |
| 21 | p32「X 個月追上」各數字與 ARC-AGI-3 0.5%→62.7%（星號未註明） | p32 | — | — | Not checked（正文只轉述「benchmark 越來越快被追上」的趨勢並標投影片頁，不引用個別數字） |
| 22 | SWE-Bench Pro 公開 Docker 映像同樣沒清掉未來 git 歷史 | p25「Environment leakage」 | https://github.com/scaleapi/SWE-bench_Pro-os/issues/93（2026-04-29，Poolside evals 團隊） | "I found a reward hacking exploit in the SWE-Bench Pro Open Source dataset via future git history mining. This exploit is very similar in shape to the problem reported in SWE-Bench Verified last year" | Confirmed（課程 A2 容器是否沿用公開映像未查證，正文不宣稱） |
| 23 | Terminal-Bench 3.0 是另起的一組 74 題（2.0 → 3.0 → 4.0，不是 89 直接刪到 66） | p20 | https://www.tbench.ai/news/terminal-bench-3-0 | "Our first release contains 74 tasks across 7 domains. The best models achieve ~34% on Terminal-Bench 3.0." | Confirmed（投影片寫「89 tasks in TB 2.0 → 66 in TB 4.0」，正文補出中間的 3.0） |

另讀（不進正文數字，作延伸／背景）：
- Kapoor et al.〈AI Agents That Matter〉 https://arxiv.org/abs/2407.01502 ："a narrow focus on accuracy without attention to other metrics … SOTA agents are needlessly complex and costly"；"many agent benchmarks have inadequate holdout sets"。對應 p31 成本與 note 的「simple baselines」。
- 課程筆記的成本例子（A 70%／$1.43、B 75%／$2.00、每多解一題 $10）是筆記自己的假設數字，正文標「課程筆記的假設例子」。

## 投影片內部、沒有外部出處的說法

- p3 的 A1 寫作 AI 使用統計（17 人用 Claude、3 人想刪紀錄）與 p28–29 的學生使用分布圖：課程內部資料，正文照投影片轉述並標頁碼。p28 讀圖數值（21–100 字元約 880 筆）是讀圖估計；p29 的長條旁有數字（1 個 prompt 40、2–5 個 49 …），照圖上數字。
- p26 的 P = f(LLM, prompt, scaffold, tools, retriever, memory, environment) 是講者的框架。
- p35 Pareto rank 是作業 3 的評分方式，留給作業 3 那篇。

## 文章處理

- pass@k 估計式的出處寫 Chen et al.（HumanEval 論文），pass^k 寫 τ-bench；課程筆記把兩個估計式都歸給 τ-bench 的定義，正文不跟著寫。
- 59.4% 一律帶「o3 常解不出的 138 題」條件。
- TB 4.0 刪掉「解答已公開」的 2 題，當執行時洩漏的例子。
