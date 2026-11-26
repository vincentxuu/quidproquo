# G-math：數學 benchmark 精讀抽取紀錄

批次：G-math（FrontierMath、Epoch 錯誤率與 v2、Open Problems／Erdős、MathArena、FrontierMath 資金與存取爭議）
讀取日期：2026-11-23
工具：arXiv HTML／PDF 以 `curl` 下載後 `pandoc`／`pdftotext` 轉純文字分段讀；epoch.ai、matharena.ai、substack 用 Exa `web_fetch_exa`（maxCharacters 15000–200000，頁面均未截斷）；搜尋用 Exa `web_search_exa`。

---

### FrontierMath: A Benchmark for Evaluating Advanced Mathematical Reasoning in AI（2024，arXiv 2411.04872）
- 網址：https://arxiv.org/html/2411.04872 （讀的是 v7，2025-12-23）；版本比對另讀 v1、v4、v5、v6 PDF（https://arxiv.org/pdf/2411.04872v1 等）
- 讀取狀態：✅
- 讀取紀錄：v7 HTML 轉純文字約 121,000 字元。依序讀過：0–41,700（摘要、§1–§6 前段）、41,700–67,000（§6–§8、參考文獻、附錄 A.1 題目與部分解答）、101,145–117,256（附錄 B 評估、C 難度評分、D metadata 到文末）。附錄 A.2–A.5（約 67,000–101,000）是五道公開樣題的數學解答，只掃過標題、註腳與敘述句（找有無方法論註記），未逐行讀數學推導。另用 `pdftotext` 讀 v1／v4／v5／v6 的致謝段與版本差異（見「與摘要說法不一致處」）。
- 類型：研究論文（技術報告）
- 研究設計或文件目的：建一個「研究等級、未公開、答案可自動驗證」的數學 benchmark。60 多位數學家出題（含 14 面 IMO 金牌、1 位 Fields 獎得主），每題附解答、驗證腳本、難度三維評分（Background 1–5、Creativity 小時、Execution 小時）與 MSC 分類；至少一位領域專家盲審。評估時讓模型在 Python 環境裡反覆試驗、最後以 pickle 存答案；比較 o1-preview、o1-mini、GPT-4o、Claude 3.5 Sonnet、Grok 2 Beta、Gemini 1.5 Pro。論文分析的是 119 題版本（見 Epoch about 頁 versioning）。
- 會被引用的結果：
  - 四條出題要求（§2.1）：Originality、Automated verifiability、Guessproofness、Computational tractability。原文："Problems had to possess definitive, computable answers that could be automatically verified. To facilitate automated verification, we often structured problems to have integer solutions, which are straightforward to check programmatically."
  - 防猜答門檻 1%（§2.1 Guessproofness）："As a rule of thumb, we require that there should not be a greater than 1% chance of guessing the correct answer without doing most of the work that one would need to do to “correctly" find the solution."
  - 計算可行性：參考解的腳本合計要在標準硬體上一分鐘內跑完（§2.1）："These scripts must cumulatively run less than a minute on standard hardware."
  - 驗證機制（§2.2）：整數答案精確比對；符號實數答案用 SymPy 檢查差值化簡為 0；其餘題目要客製驗證腳本。"If the problem has a unique symbolic real answer, it uses SymPy evaluation to check that the difference between the submitted answer and the actual answer simplifies to 0."
  - 為何不用證明、不用 Lean（§2.2 與註 4）："we cannot include problems that require mathematical proofs or formal reasoning steps, as these would demand human evaluation"；Lean 的理由兩條：模型未受訓寫形式證明、mathlib "doesn’t fully cover the undergraduate math curriculum"。
  - 錯誤率估計（§2.3）：35 題接受第二輪盲審，2 題答案錯誤；Jeffreys prior 後驗 ≈6.9%，作者取「約 10%」為 critical error rate。原文："estimating a critical error rate of approximately 10% is reasonable." 另有 6/35 缺假設、2/35 違反防猜答。
  - 作者自承審題制度的缺陷（§2.3）："the mistakes we have spotted highlight the issues of a passive review system, in which the reviewer sees the full solution document and simply has to state their approval"，之後改為 active review（審者要實際確認、必要時自己解）。
  - 防外洩（§2.4、註 6、註 7）：加密通道傳題；承認 "in some cases, standard email clients were used"；抄襲檢查只送題目不送解答，選 Quetext、Copyscape 而非 Turnitin，因 "posed the lowest risk of our problems being stored in databases that might later be used to train AI models."
  - 領域分布（§3、Table 1）：數論 17.8%、組合 15.8%，兩者合計約 34% 的 MSC 標籤；作者解釋這反映 "these domains’ natural amenability to problems with numerical solutions that can be automatically verified."
  - 主結果（§4.2.1）：六個模型全都 <2%；只有 4 題被任一模型解過一次，重跑五次變異很大（只有 o1-preview 在第 2 題 5/5）。原文："no model achieving even a 2% success rate on the full benchmark"。
  - 答對不等於推理對（§4.2.1）："on one of these problems running a few simple simulations was sufficient to make accurate guesses without any deeper mathematical understanding."
  - 評估設定（§4.1）：token 上限 10,000；o1-preview 平均只回 1.29 次就交卷、Grok 2 Beta 3.81 次（§4.2.2）。
  - 飽和對照（附錄 B.3、Figure 2）：以 pass@1 最佳成績換算未解比例，MMLU college math 98.1%、GSM8K 96.4%、MATH 94.8%、AIME 74%、Omni-MATH 60.54%、MathVista 73.9%，FrontierMath 未解 >98%。
  - 專家訪談（§6）：Tao 預估 "resist AIs for several years at least"；Borcherds 指出數值答案格式 "aren’t quite the same as coming up with original proofs."
- 作者自己列的限制（§7）：只收可自動驗證的數值答案，排除證明與開放探索；題目只需數小時到數天，不測長期研究能力；目前模型幾乎全 0，暫時無法比較模型相對能力；難度評分初審與二審 "rarely matched"（§2.3），只能當粗略指引（§2.5）；錯誤率估 ~10%。
- 與摘要說法不一致處：
  1. 摘要說 "a benchmark of hundreds of original ... problems"，但論文實際分析的版本是 `FrontierMath_10-22-24`，只有 119 題（Epoch about 頁 Versioning："Includes 119 questions. This version of the benchmark was analyzed in our arXiv paper."）。
  2. 致謝段在 v1–v4（2024-11-07 至 11-22）沒有 OpenAI；v5（2024-12-20，與 o3 發表同一天）起才加上 "We gratefully acknowledge OpenAI for their support in creating the benchmark." 摘要與正文從未說明 OpenAI 的資料存取權。
  3. 論文估錯誤率 ~10%（§2.3），Epoch about 頁寫 "approximately 1 in 20"，2025-10 gradient update 又說原版估 7%：同一份資料三種說法（見下方 Epoch 各條）。
- 反證或後續修正：2026-06-12 FrontierMath v2 審計後宣布 42% 題目有錯（Tiers 1–3 43%、Tier 4 40%），遠高於論文的 ~10%（https://epoch.ai/benchmarks/frontiermath-tiers-1-3-v2 ，https://epoch.ai/data/eci-documentation/data ）。<2% 的成績在半年內被 o3 宣稱 25.2% 打破，2026 年 Tiers 1–3 v2 最佳 85%（GPT-5.5 xhigh，Epoch LinkedIn 公告）。
- 對系列的用途：支撐數學篇「答案可自動驗證＋防猜答＋專家出題」三個設計怎麼讓 benchmark 晚飽和，以及這些設計的代價（排除證明、偏向數論組合、靠人審答案鍵）。

---

### Epoch AI：About FrontierMath（Tiers 1–4 說明頁，含利益衝突聲明與版本紀錄）（2024 起持續更新，讀取時含 2026-09-22 更新）
- 網址：https://epoch.ai/frontiermath/tiers-1-4/about
- 讀取狀態：✅
- 讀取紀錄：Exa fetch 全頁約 9,000 字元，一次讀完（未截斷）。
- 類型：官方文件
- 研究設計或文件目的：對外說明 FrontierMath 的出題要求、Tier 劃分、Tier 4 製作、人類基準、利益衝突與資料版本。
- 會被引用的結果：
  - Tier 劃分：核心 300 題分 Tier 1（~20%，"generally resemble International Math Olympiad problems and advanced undergraduate exercises"）、Tier 2（~40%，"advanced graduate-level complexity"）、Tier 3（~40%，"resemble early exploratory research problems of a PhD student"）；Tier 4 另 50 題。Tier 由 Background／Creativity／Execution 三維評分 "condensed into three tiers"。
  - Tier 4 製作："The writers for Tier 4 were mostly math professors and postdocs, each contracted to conduct a several-week research project culminating in one problem"；2025 年 5 月 FrontierMath Symposium 30 位數學家、五個領域各 $5,000 獎。
  - 人類基準：MIT 約 40 名數學系大學生與領域專家，8 隊、4.5 小時、23 題（Tiers 1–3），"the average team scored 19%, while 35% of the problems were solved collectively across all teams."
  - 錯誤率說法："finding that approximately 1 in 20 problems had errors requiring correction—comparable to error rates in other major machine learning benchmarks like ImageNet."（2026-09-22 註記錯誤懸賞已關閉，但這句未改）
  - 利益衝突聲明："OpenAI commissioned 300 questions for the core FrontierMath dataset and 50 problems for Tier 4. They have access to all problem statements and solutions up to FrontierMath_12-04-24, except for 53 solutions randomly withheld in version FrontierMath_02-28-25 for holdout evaluation. Additionally, OpenAI has access to 30 of the 50 Tier 4 problems, with the remaining 20 reserved as a holdout set."
  - 版本紀錄：10-22-24（119 題，論文版）、11-06-24（147 題）、11-26-24（180 題，"OpenAI’s o3 announcement on December 20th, 2024, claimed a 25.2% score on this version"）、12-04-24（197 題，後發現 1 題重複）、02-28-25（300 題，53 題解答對 OpenAI 保留）、T4_06-30-25（50 題，20 題保留）。
- 作者自己列的限制：數值答案格式與傳統證明不同（"Although this format differs from traditional proof-writing"）；人類基準難建立，因為 "no single person could likely solve all problems without extensive, targeted study."
- 與摘要說法不一致處：頁首寫 Tiers 1–3 共 300 題、v2 後已是 295 題，本頁未同步；錯誤率仍寫 1 in 20，與同站 v2 頁「42%」並存未更正。
- 反證或後續修正：v2 審計（見下條）；"1 in 20" 被 Epoch 自己的 ECI 文件改寫為 43%／40%。
- 對系列的用途：支撐「誰能看題」的治理段落——holdout 的具體數字（53／300、20／50）與 o3 25.2% 對應的是哪個版本。

---

### Epoch AI：FrontierMath Tiers 1-3 (v2)／Tier 4 (v2) benchmark 頁與 changelog（2026-06-12）
- 網址：https://epoch.ai/benchmarks/frontiermath-tiers-1-3-v2 ；https://epoch.ai/benchmarks/frontiermath-tier-4-v2 ；舊版 https://epoch.ai/benchmarks/frontiermath-tier-4-v1 （僅搜尋摘錄）
- 讀取狀態：✅（兩個 v2 頁全文）；Tier 4 v1 頁 🟡（只讀到 Exa 搜尋摘錄的 Methodology 段）
- 讀取紀錄：兩頁各約 6,500 字元，Exa fetch 一次讀完。v1 頁只有搜尋摘錄約 2,500 字元。
- 類型：排行榜頁／官方文件
- 研究設計或文件目的：公布 v2 資料集規模、評估 prompt 與 scaffold、changelog。
- 會被引用的結果：
  - 規模："On 2026-06-12, we released a major update, addressing errors in 42% of problems. Following this update, the full FrontierMath dataset consists of 338 problems ... a base set of 295 problems ... and an expansion set of 43"；公開 12 題（Tiers 1–3 10 題、Tier 4 2 題）。
  - Changelog："We released v2, which corrected 123 problems in Tiers 1-3 and 12 problems in Tier 4. We also removed 5 problems from Tiers 1-3 and 7 problems from Tier 4."（換算：Tiers 1–3 128/300 = 42.7%；Tier 4 19/50 = 38%；合計 147/350 = 42%）
  - 現行評估設定：模型提交無參數的 Python 函式 `answer()`；token 硬上限 1,000,000、660,000 起強制交卷；答案函式 30 秒內跑完；可用 sympy、gmpy2、galois、pyadic 等函式庫；"If your answer is correct you will get 1 point. If it is incorrect, or if you don’t submit an answer, you will get 0 points."（論文版是 10,000 token）
  - 資金揭露："FrontierMath was developed with funding from OpenAI, who has exclusive access to a subset of the benchmark."
  - v1 頁（摘錄）關於 o3 分數落差："The difference between our results and OpenAI’s might be due to OpenAI evaluating with a more powerful internal scaffold, using more test-time compute, or because those results were run on a different subset of FrontierMath (the 180 problems in `frontiermath-2024-11-26` vs the 290 problems in `frontiermath-2025-02-28-private`)." 並寫明 "we were not involved in running these evaluations."
- 作者自己列的限制：v2 頁本身未列限制；LinkedIn 公告補充 "given the complexity of FrontierMath solutions, we can’t be sure that we’ve caught all errors."
- 與摘要說法不一致處：「42%」是 corrected＋removed 合計占 350 題的比例，不是「42% 題目數學上錯」；第三方（systems-analysis.info）指出修正也包含措辭、假設、驗證器，Epoch 頁面沒有細分。Tier 4 依 changelog 算是 38%，ECI 文件寫 40%（可能以 48 題私有集為分母：19/48 = 39.6%，Epoch 未說明）。
- 反證或後續修正：無推翻；Epoch 表示會定期用新模型做 AI 輔助複查。
- 對系列的用途：支撐「可自動驗證不等於答案鍵正確」——exact match 下，答案鍵錯一位數，所有答對的模型都被判錯；v1 與 v2 分數不可直接比較。

---

### Epoch AI：FrontierMath: Tiers 1–4 (v2) is live（官方 LinkedIn 公告）（2026-06-12）＋ 2026-05-11 審計預告
- 網址：https://www.linkedin.com/posts/epochai_frontiermath-tiers-14-v2-is-live-we-activity-7471253846296711168-bRlG ；預告 https://www.linkedin.com/posts/epochai_frontiermath-llm-benchmark-for-advanced-activity-7459761131767738368-whW2 （X 原文 https://x.com/EpochAIResearch/status/2053995435870892048 ）
- 讀取狀態：✅（LinkedIn 兩則全文，經 Exa 搜尋結果取得；貼文本身短，摘錄與全文相同）；X 原文 ⚪（未直接抓，第三方紀錄 X 回 HTTP 402，改以同帳號 LinkedIn 同文為準）
- 讀取紀錄：公告約 2,000 字元、預告約 400 字元，全讀。
- 類型：官方公告
- 研究設計或文件目的：說明 v2 審計起因、方法、錯誤類型與結果。
- 會被引用的結果：
  - 起因："This project began in April when OpenAI shared with us that they had found more errors than expected when conducting an internal review."
  - 存取比例："OpenAI funded the development of Tiers 1–4 and has exclusive access to about 80% of it, with Epoch holding out the rest."
  - 方法："We used GPT-5.5 and Opus 4.7 to flag possible errors and then engaged mathematicians to review these flags. Almost all were determined to be real and severe errors that rendered the problems impossible to solve."
  - 錯誤類型："Simple calculation mistakes accounted for the vast majority of errors, typically made when the problem author was extracting the final answer. These include things like off-by-one errors and flipped signs. Some problem statements were also fatally ambiguous."
  - 移除："We also removed 5 problems (2%) from Tiers 1–3 and 7 (15%) from Tier 4 ... The higher removal rate for Tier 4 reflects the greater complexity of its problems."
  - 結果："Rankings are similar but scores are higher across the board. The current leaders are GPT-5.5 (xhigh) with 85% on Tiers 1–3 and Google’s AI co-mathematician with 76% on Tier 4."
  - 定位轉向："FrontierMath: Tiers 1–4 is now approaching saturation. We believe the future of math benchmarking lies in open problems drawn from real research"
  - 預告（2026-05-11）："This has flagged fatal errors in about a third of problems, and we believe most of these flags to be valid."
- 作者自己列的限制："we can’t be sure that we’ve caught all errors. We plan to conduct additional AI-assisted reviews periodically"
- 與摘要說法不一致處：預告說「約三分之一」，最終是 42%；Epoch 原本估 5%–10%。
- 反證或後續修正：無。
- 對系列的用途：支撐兩件事：(1) 專家出題的答案鍵本身會錯，而且錯在「抽最終答案」這一步；(2) 出資方（OpenAI）同時是發現錯誤的一方、被評估模型也被拿來審題，治理關係比「出資—受測」更糾纏。

---

### Epoch AI：ECI documentation – Included benchmarks（Preprocessing 段）（2026，讀取日現行版）
- 網址：https://epoch.ai/data/eci-documentation/data
- 讀取狀態：🟡（只讀到 Exa 搜尋摘錄的 Preprocessing 段與 benchmark 清單，約 2,000 字元；未 fetch 全頁）
- 讀取紀錄：摘錄約 2,000 字元。全頁其他段落是 ECI 模型擬合的 benchmark 清單，與本批無關，未補讀。
- 類型：官方文件
- 研究設計或文件目的：說明 Epoch Capabilities Index 如何正規化各 benchmark 分數。
- 會被引用的結果："For benchmarks with a known error rate, we also rescale scores so that the maximum possible score is scaled to one. For example, FrontierMath v1 was found to have an error rate of 43% across Tiers 1-3, and 40% for Tier 4, so its scores are rescaled accordingly."（這是 brief 所說 43%／40% 的出處）
- 作者自己列的限制：未列。
- 與摘要說法不一致處：Tier 4 40% 與 changelog 換算的 38% 不一致（見上一條）。
- 反證或後續修正：無。
- 對系列的用途：v1 分數的天花板只有約 57%–60%——錯誤率要被當成「可得滿分上限」來修正，是解讀舊分數時的必要校正。

---

### Epoch AI：Benchmarking AI on unsolved math problems（FrontierMath: Open Problems 發表文）（2026-01-27）
- 網址：https://epoch.ai/latest/benchmarking-ai-on-unsolved-math-problems
- 讀取狀態：✅
- 讀取紀錄：全文約 14,000 字元（含 12 個註腳與附錄 caveats），Exa fetch 一次讀完。
- 類型：官方文件／部落格
- 研究設計或文件目的：發表以「真正的未解問題」構成的 benchmark（pilot 14 題，Schmidt Sciences 資助），只收「解答可由程式驗證」的題目。
- 會被引用的結果：
  - 選題原則："We do not select problems to be difficult for AI per se. Unlike problems contrived for a test, these problems are core to doing research math."（註 1："this benchmark has high construct validity"）
  - 人類基準：曾認真嘗試的數學家人數 2–4 人到 50–100 人；最強人選全職解題達 50% 機率的時間 1–4 週到 3–10 年（註 2 承認這估計 "quite possibly, no better than noise"）。
  - 驗證設計："a proposed solution can be checked by a relatively straightforward computer program running on a typical computer"；兩種形式：構造具體物件（例：Galois 群為 M23 的 23 次多項式），或要求演算法並在「搜尋不可行」的大整數挑戰集上驗證。
  - 偏差自承："Our ideal would be to take a random sample of all unsolved math problems, but this constraint introduces a bias. The benchmark problems tend to be relatively concrete, and may not require fuzzier mathematical pursuits like “theory building”."
  - 可解性：目標是出題者評估 ≥80% 可解，但 "mathematicians often expressed high uncertainty when assigning a probability in the 50–80% range."；刻意排除 Goldbach 反例這類共識上不存在解的題（註 6）。
  - 解出即移除："If a problem is solved — whether by humans or AI — the result will be published ... we will remove solved problems from the benchmark."；因此 "The benchmark won’t give a score that can be used to compare models’ ability"。
  - 驗證器付費取得："we offer access for a fee ... We commit to grant access uniformly, and not exclusively to any entity."；註 8：購買者須通報成功、與出題者及 Epoch 共享發表權。
  - 預先登記的 caveats（附錄）：人機協作分工、prior art、傳統算力暴力搜尋、verifier misspecification、樣本偏差。
  - 初步結果：GPT-5.2 Pro、Gemini 3 Deep Think 能解 warm-up 變體，但對真題 "don’t show much promise"，有時 "recognize the problem as open and simply give up."
- 作者自己列的限制：題目可能無解（物件不存在或太大無法驗證）；可驗證性限制造成取樣偏差；不出百分比分數。
- 與摘要說法不一致處：逐項對過，沒有。
- 反證或後續修正：2026-07-31 擴到 50 題並移除 3 題（2 題 "the verifiers for these problems would not detect correct solutions with high enough fidelity"，1 題不夠 notable，例如本文舉例的 unknotting number 題就被移除）；2026-09-16 新增 "human + AI" 解題狀態、再移除 1 題（https://epoch.ai/frontiermath/open-problems ，搜尋摘錄）。
- 對系列的用途：支撐「把未解問題當 benchmark」的設計邏輯——題目不是為難 AI 而出，所以構念效度高；代價是不能給分、只能記「第一個解出」，而且偏向可構造、可驗證的離散數學。

---

### Epoch AI：About FrontierMath: Open Problems – FAQ（2026-07 擴版時）
- 網址：https://epoch.ai/frontiermath/open-problems/about/faq
- 讀取狀態：✅
- 讀取紀錄：全文約 9,500 字元，Exa fetch 一次讀完。
- 類型：官方文件
- 研究設計或文件目的：說明擴版後的選題、notability 分級、驗證、測試流程與存取政策。
- 會被引用的結果：
  - 編輯委員會 Thomas Bloom、Daniel Litt、Dan Romik 審 notability；四級：Moderately Interesting（至少 10 年前提出、至少兩個獨立團隊做過）、Solid Result、Major Advance、Breakthrough；"When multiple tiers seemed plausible for a problem, we erred in the conservative direction."
  - 允許「強數值證據」型 verifier："We allow verifiers that provide strong numerical evidence that the AI system has solved the problem, without constituting full proof."
  - 可解性估計："we estimate that a significant proportion are not solvable: very likely at least 10% and probably (hopefully) less than 40%."
  - 不用 Lean 的三個理由：題目難以形式化、"separate mathematical ability from formalization ability"、Lean "likely has a higher potential for inscrutable bugs which AI systems might exploit."
  - 測試：每題跑 4 次，scaffold 含 Python、命令列與 web search，每個 sample 一百萬 output token。
  - 存取："As of the project launch (July, 2026), OpenAI is the only entity to have purchased access to the verifiers. OpenAI funded the creation of the original FrontierMath: Tiers 1-4, but FrontierMath: Open Problems is developed independently and owned solely by Epoch."
  - verifier 怎麼驗：在已知解的變體上測，並做含 frontier 模型的 code review。
- 作者自己列的限制：偏 constructive、偏組合與數論；"It may even turn out that AI is especially well-suited to this sort of verifiable problem."
- 與摘要說法不一致處：發表文說「commit to grant access uniformly」，FAQ 顯示上線時唯一買家仍是 OpenAI——不矛盾，但「人人可買」與「實際只有一家買」值得並列。
- 反證或後續修正：見上一條 changelog（verifier 保真度不足而移除題目）。
- 對系列的用途：治理段落的第二個例子——Epoch 從「OpenAI 委託、OpenAI 擁有」改成「Epoch 擁有、verifier 公開販售」，但第一個買家仍是同一家公司。

---

### Epoch AI：Announcing FrontierMath Erdős（2026-09-01）＋ FrontierMath Erdős benchmark 頁（讀取日 2026-10-29 更新版）
- 網址：https://epoch.ai/latest/announcing-frontiermath-erdos ；https://epoch.ai/benchmarks/frontiermath-erdos ；論文 https://arxiv.org/abs/2609.25050 （只讀搜尋摘錄）
- 讀取狀態：公告與 benchmark 頁 ✅；論文 🟡（未讀全文，只讀 Exa 摘錄的摘要、§3.1–3.5、§4.1–4.2 段落約 9,000 字元）
- 讀取紀錄：公告約 11,000 字元、benchmark 頁約 12,000 字元，各一次讀完。
- 類型：官方文件
- 研究設計或文件目的：把「AI 解 Erdős 問題」這種零散宣稱變成固定題組、固定預算的可重現 benchmark：68 個 2026 年 8 月仍未解的 Erdős 猜想（Bloom 從 652 個未解題中挑，約 10%），Lean 4＋Mathlib 陳述，模型要寫出證明或反證並通過 Lean FRO 的 Comparator。
- 會被引用的結果：
  - 三個問題：curation、verification、replicability（"the most impressive results have come from within AI companies, and these companies have not disclosed much about the experiments"）。
  - 驗證：50 題陳述取自 Google DeepMind 的 Formal Conjectures，其餘由 AI 自動形式化後 Bloom 審；Comparator "is designed to be robust to a submission that actively tries to cheat"；agent 與 comparator 分在兩個無網路的 Docker container，"What remains trusted is the Lean kernel, Comparator itself, and its sandbox."
  - 預算：每題一次嘗試、$300、72 小時；離線提供 476,000 篇 2022 年以前的純數 arXiv LaTeX 原始檔。
  - 初次結果：GPT-6 Astra（pre-release）3%（2/68），GPT-5.6 Sol、GPT-5.5、Claude Fable 5.1、Claude Fable 5 皆 0%。非系統性加碼嘗試共解 5 題，花費 "over $220,000 of compute ... compared with roughly $20,000 for the benchmark run itself."
  - 形式化成本："the natural language proof was 18 pages long whereas a subsequent effort that formalized the result in Lean consisted of 1.2 million lines of code."（Erdős unit distance 問題）
  - 污染處理：公開 benchmark、不設強防護；"Problems solved before a model’s training cutoff can be filtered out"。
  - benchmark 頁（2026-10-29）：68 題已有 17 題被解，其中多題來自 "OpenAI's October 2026 release of over 700 proofs"；Claude Opus 5.5、Sonnet 5.5、GPT-6.1 Sol 等在官方 run 中解出 #74、#126。
- 作者自己列的限制：形式化是額外負擔、可能低估數學能力；資料污染會隨時間出現；Erdős 問題不代表全部數學；選題主觀（Bloom："No doubt every mathematician will see some problems on this list and think “why on earth did they include that?”"）。
- 與摘要說法不一致處：
  1. 公告說 AI 形式化「remaining 18」題；benchmark 頁與論文說 17 個問題、拆成 18 個猜想（#713 分兩部分）。
  2. 公告寫 #74 花 $222、10 小時，#126 花 $172、10 小時；論文 Table 2 寫 $218／15 h、$247／16 h（論文說明 GPT-6 Astra 價格未公布，事後依實價重算成本，論文數字較可信）。
  3. 加碼嘗試總數：公告寫 269 次，論文寫 56 題共 172 次（計算範圍不同，Epoch 未對齊說明）。
- 反證或後續修正：OpenAI 2026-10 一次發布 700 多個證明，解掉多題（benchmark 頁）；題目被解後即可能進入訓練資料。
- 對系列的用途：對照 FrontierMath 的「數值答案驗證」：Erdős 走「Lean 形式證明驗證」，驗證最硬、但把形式化成本加到模型身上；同時是「公開題組＋公開 harness」回應「AI 公司內部成果不透明」的例子。

---

### MathArena: Evaluating LLMs on Uncontaminated Math Competitions（2025，arXiv 2505.23281）
- 網址：https://arxiv.org/html/2505.23281 （讀 v3，2026-01-14；v1 2025-05-29、v2 2025-10-02）
- 讀取狀態：✅
- 讀取紀錄：HTML 轉純文字約 92,000 字元。依序讀過：3,081–33,000（摘要、§1–§4.1）、33,000–51,669（§4.2–§6、致謝）、51,669–82,137（附錄 A 授權、B 全部結果表／領域結果／各競賽 CI／token 用量／污染來源清單、C 置換檢定）、82,137–90,700（附錄 D prompts）；附錄 E 為圖片範例（約 1,500 字元）。污染來源清單在純文字版遺失，另從 HTML 抽出補讀。
- 類型：研究論文
- 研究設計或文件目的：用「比賽結束後才公開」的新題即時評估 LLM：AIME、HMMT、BRUMO、CMIMC（答案題）、USAMO、IMO（證明題）、Project Euler；2025 年共 7 場 162 題、50 多個模型。比賽一結束（數小時到數天）就評，每題 4 次取樣取平均；答案題用自製 LaTeX→SymPy 解析器＋Gemini-2.5-Flash 判官交叉檢查；證明題由兩位專家各自依自訂評分表評分。
- 會被引用的結果：
  - 核心主張（§1）："By evaluating models on competitions occurring after model release, MathArena eliminates the risk of contamination"；且題目 "pre-vetted by the competition organizers for originality"。
  - 對私有 benchmark 的批評（§1）："the benchmark creators may selectively grant access to certain organizations [10], creating an uneven playing field"（[10] 指 FrontierMath／OpenAI 事件）；HLE "required a $500,000 prize pool"。
  - 對只看最終答案的批評（§1）："models may arrive at the correct answer through pattern recognition or brute-force enumeration, rather than genuine mathematical reasoning."
  - 多次取樣（§3.2）："each model generates four responses per question, and we report the average score across these runs."；用廠商建議超參數、不調參，"This avoids overfitting and reduces the risk of information leakage."
  - 解析器雙保險（§3.3）："If the parser and judge disagree, we manually inspect the model response and update the parser as needed."
  - 證明題評分（§3.3）："Two independent judges grade each solution, providing not only a final score but also a justification for their decision."；評分表仿照比賽給部分分。
  - AIME 2024 污染證據（§4.1、Fig. 4）：以人類分位數校正難度後，多數模型 AIME 2024 比 2025 高出 10%–20%；"QwQ-Preview-32B is a notable outlier and outperforms the expected human-aligned performance by nearly 60%, indicating extreme contamination."；HMMT 差距小，"likely because HMMT is less prominent"。
  - 新比賽也可能撞題（§4.1、附錄 B）：用 Deep Research 搜到 AIME 2025 有 8 題、HMMT 2025 有 1 題在網路上有相似題（Math StackExchange、Quora 等）；作者說 "mostly easier problems that do not affect the overall results"。
  - 主結果（Table 2）：GPT-5 (high) 91.25%、Grok 4 Fast 90.57%、Grok 4 90.36%（四場答案題平均）；AIME 人類前 1% 為 84.35%、HMMT 66.79%。
  - 變異（§3.4、§4.1、附錄 C）：準確率 CI 用 Bernoulli 變異 p̂(1−p̂)/N；排名 CI 用配對置換檢定；前三名都在 1% 以內。AIME、HMMT、CMIMC 間 Spearman 相關 >80%。
  - IMO 2025 證明題（§4.3、Table 5）：GPT-5 平均 38%（16/42 分），不到銅牌 19 分；用 32 取 1 的 best-of-n、由模型自己當裁判做 bracket tournament；"without filtering, model scores would likely have dropped below 10%."
  - 失敗模式（§4.3）：Grok 4 常只給答案不給說明；Gemini-2.5-Pro "often cites non-existent theorems"。
  - 領域差異（附錄 B Table 8）：整體 Algebra 64.5%、Number Theory 68.6%、Combinatorics 48.8%、Geometry 55.5%；幾何多靠座標暴力法。
  - 成本：全部實驗 API 約 USD 2,000（§4 Setup）。
- 作者自己列的限制（§5）：夠難的年度比賽數量少、題組小、CI 寬；"such benchmarks may soon become saturated, possibly as early as 2026"；比賽公開到評估之間仍有時間差，閉源模型理論上可能先吃到新題，但作者判斷 "contamination risks in our setting are minimal"。
- 與摘要說法不一致處：
  1. 摘要說 "we effectively eliminate the risk of contamination"，正文附錄卻找到 AIME 2025 有 8/30 題在網上有相似題。
  2. 摘要說 "MathArena is also the first benchmark for proof-writing capabilities"，相關工作自己列了 GHOSTS 的人工證明評估（作者以「只評兩個舊模型、2023 年後未更新」區隔）。
  3. 摘要「IMO 2025 top models achieve slightly less than 40%」沒說這是 32 選 1、模型自評挑出的最佳證明；未篩選估計 <10%。
- 反證或後續修正：
  - MathArena 自己的後續：2026-05-12「Farewell」文宣告最終答案型競賽題已不再適合當 frontier benchmark（見補搜第 2 篇）；USAMO 2026 改用 LLM 陪審團半自動評分，GPT-5.4 得 95%（https://matharena.ai/usamo/ ，搜尋摘錄）。
  - 平台論文 "Beyond Benchmarks: MathArena as an Evaluation Platform"（https://arxiv.org/html/2605.00674v2 ，只讀搜尋摘錄）承認 USAMO 2026 陪審團「兩位數內取最低分」的門檻是 bug，建議改為一分："Due to a bug in our pipeline, the minimum was already taken when graders agreed within two points, but we recommend a one-point threshold"；而 USAMO 2026 部落格寫的是兩分。
- 對系列的用途：支撐「用時間切分防污染」這條路線（對照 FrontierMath 的「不公開」路線），並提供 AIME 2024 被污染的量化證據；IMO 證明題評分說明「無法自動驗證時要付出什麼成本」。

---

### Epoch AI：Clarifying the creation and use of the FrontierMath benchmark（2025-01-23）
- 網址：https://epoch.ai/latest/openai-and-frontiermath
- 讀取狀態：✅
- 讀取紀錄：全文約 4,500 字元（含註腳），Exa 搜尋結果即全文（含作者介紹段），一次讀完。
- 類型：官方文件（聲明）
- 研究設計或文件目的：回應 2025-01 承包數學家與社群對 OpenAI 資助與資料存取未揭露的批評。
- 會被引用的結果：
  - "OpenAI commissioned Epoch AI to produce 300 advanced math problems ... OpenAI retains ownership of these questions and has access to the problems and solutions, with the exception of a holdout set."
  - "we cannot share the questions and answers with other parties without written permission from OpenAI."
  - "We are finalizing a 50-problem set for which OpenAI will only receive the problem statements and not the solutions ... OpenAI will still own these problems"
  - 揭露時序："Per our agreement, we needed OpenAI’s permission before publicly disclosing their involvement. We requested this permission ahead of the benchmark announcement in November 2024. We received permission from OpenAI ahead of the o3 announcement"
  - 承包者告知："Many contributors were unaware of these details, and our communication with them should have been more systematic and transparent."
  - 註 1："a pilot of the benchmark was funded by Nat Friedman."
- 作者自己列的限制：承認溝通失誤；承諾之後事前揭露資助與資料存取協議。
- 與摘要說法不一致處：本文說 holdout 是「正在 finalize 的 50 題」；about 頁後來寫「02-28-25 版隨機保留 53 題解答」。另見下條：Besiroglu 1/19 的 LessWrong 留言先寫成 holdout 已存在，後來加註修正；Glazer 同日說 holdout「正在開發」。
- 反證或後續修正：2025-04 Epoch 自測 o3 約 10%（見下條）；Tier 4 holdout 結果顯示 OpenAI 模型在未看過的題目上不比看過的差（見 Battle Royale、GPT-5.2 Pro 條）。
- 對系列的用途：治理段落的一手出處：出資方擁有題目、能看答案、揭露時機由出資方決定。

---

### Tamay Besiroglu 在 LessWrong 的回應與 Elliot Glazer 的 Reddit 說法（2025-01-19）＋ TechCrunch 報導（2025-01-19）
- 網址：https://www.greaterwrong.com/posts/cu2E8wgmbdZbqeWqb/ （meemi shortform 與留言串）；https://techcrunch.com/2025/01/19/ai-benchmarking-organization-criticized-for-waiting-to-disclose-funding-from-openai/
- 讀取狀態：🟡（只讀 Exa 搜尋摘錄：LessWrong 串約 4,000 字元、TechCrunch 約 3,000 字元；未 fetch 全文）
- 讀取紀錄：摘錄合計約 7,000 字元。Glazer 的 Reddit 原文未直接讀，引文經 LessWrong 與 TechCrunch 兩處轉引一致。
- 類型：論壇留言（當事人一手）＋新聞
- 研究設計或文件目的：爭議當下的當事人說法。
- 會被引用的結果：
  - Besiroglu："Our contract specifically prevented us from disclosing information about the funding source and the fact that OpenAI has data access to much but not all of the dataset."
  - Besiroglu："we have a verbal agreement that these materials will not be used in model training."
  - Glazer（Reddit，經轉引）："We haven’t yet independently verified their 25% claim. To do so, we’re currently developing a hold-out dataset"
  - TechCrunch 轉 Carina Hong："Six mathematicians who significantly contributed to the FrontierMath benchmark confirmed [to me] … that they are unaware that OpenAI will have exclusive access to this benchmark (and others won’t)... Most express they are not sure they would have contributed had they known."
  - meemi（承包者）："contractors should have transparent information about the potential of their work being used for capabilities"
- 作者自己列的限制：無。
- 與摘要說法不一致處：Besiroglu 留言原寫 holdout 已存在，事後加註 "[Edit: Clarified OpenAI’s data access...]"；meemi 指出 Besiroglu 12/20 推文曾說 holdout 由獨立資金支付，1/23 聲明卻說 OpenAI 擁有 holdout 題目（此點只有 meemi 轉述，未讀到推文原文）。
- 反證或後續修正：同上條。
- 對系列的用途：說明「不訓練」只有口頭協議、holdout 在爭議發生時還沒做好——治理承諾的強度要看形式（合約、口頭、技術隔離）。

---

### o3 宣稱分數 vs Epoch 自測（OpenAI 2024-12-20 宣稱 25.2%；Epoch 2025-04-18 自測約 10%）
- 網址：Epoch hub 方法論說明（Tier 4 v1 頁摘錄）https://epoch.ai/benchmarks/frontiermath-tier-4-v1 ；Epoch X 貼文 2025-04-18（經 https://techcrunch.com/2025/04/20/openais-o3-ai-model-scores-lower-on-a-benchmark-than-the-company-initially-implied/ 與 https://ypredict.ai/news/openais-o3-model-falls-short-on-benchmark-scores-raising-questions-about-accuracy/ 轉引）
- 讀取狀態：🟡（Epoch 方法論段為一手摘錄；Epoch X 貼文原文未直接讀，X 對自動抓取常回 402，改以兩家媒體逐字引文為準，兩處一致）
- 讀取紀錄：TechCrunch 摘錄約 4,000 字元；Epoch 方法論段約 800 字元。
- 類型：官方說明＋新聞
- 研究設計或文件目的：第三方（題目擁有者 Epoch）在自家 scaffold、較新的 290 題私有集上重測公開版 o3。
- 會被引用的結果：
  - Epoch（經轉引）："o4-mini, with high reasoning, sets a new record in our evaluations, with an accuracy of 17% (±2%)! o3 scores 10% (±2%) with high reasoning"
  - OpenAI 12 月的說法（Mark Chen，經 TechCrunch）："We’re seeing [internally], with o3 in aggressive test-time compute settings, we’re able to get over 25%."
  - Epoch 列的三個可能原因：更強的內部 scaffold、更多 test-time compute、不同題組（180 題的 2024-11-26 版 vs 290 題的 2025-02-28 私有集）。
  - TechCrunch："The benchmark results the company published in December show a lower-bound score that matches the score Epoch observed."
  - ARC Prize：公開版 o3 "is a different model [...] tuned for chat/product use"；"All released o3 compute tiers are smaller than the version we [benchmarked]."
- 作者自己列的限制：Epoch 明說 "we were not involved in running these evaluations"（指 OpenAI 自測）。
- 與摘要說法不一致處：媒體標題多寫「o3 實際只有 10%」，但兩者測的不是同一個模型版本、同一題組、同一算力，不構成同條件對照；OpenAI 12 月材料本身就含與 10% 相符的下界。
- 反證或後續修正：Epoch 2026-01 GPT-5.2 Pro 在 Tier 4 holdout 上表現更好（見下條），是「看過題目沒有灌水」的反向證據，但只涵蓋 Tier 4、且是後來的模型。
- 對系列的用途：說明「自報分數」與「第三方獨立重測」為什麼會差 2.5 倍，而且差距可以完全不靠作弊解釋：模型版本、算力設定、題組版本三者都要一起公布才可比。

---

### Epoch AI：FrontierMath Tier 4: Battle Royale（2025-10-13）＋ New record on FrontierMath Tier 4（2026-01-23）
- 網址：https://epochai.substack.com/p/frontiermath-tier-4-battle-royale ；https://epochai.substack.com/p/new-record-on-frontiermath-tier-4
- 讀取狀態：✅
- 讀取紀錄：兩篇各約 2,000–3,000 字元，Exa fetch 全文。
- 類型：官方部落格（短報）
- 研究設計或文件目的：在 Tier 4 上比較高算力模型，並用 holdout 檢查 OpenAI 模型是否因看過題目而灌水。
- 會被引用的結果：
  - Battle Royale："OpenAI, which funded FrontierMath, has access to 28/48 problems and solutions. Epoch holds out the remaining 20 problems and solutions. Of the eight problems solved at least once by GPT-5 Pro, five are in the held-out set."；GPT-5 Pro 13% 領先 Gemini 2.5 Deep Think 一題，"not statistically significant"。
  - GPT-5.2 Pro："GPT-5.2 Pro solved 5 (18%) of the non-held-out set and 10 (50%) of the held-out set. In other words: no evidence of over-fitting."
  - 同文也揭露評估中發現兩題有問題、修正後補分："During evaluation we found issues with two problems."
  - 出題者觀察：Jay Pantone 的兩題被解，但 "both used numerical shortcuts that he didn’t intend"；Ken Ono 認為解答 "the rigor of its prose explanation was somewhat lacking"。
- 作者自己列的限制：網頁版人工評估、與 API scaffold 不同；樣本小（20 vs 28 題）。
- 與摘要說法不一致處：逐項對過，沒有。
- 反證或後續修正：v2 後 holdout 怎麼對應到 43 題新版，Epoch 未公布（第三方 klu.ai、aiwiki.ai 指出）。
- 對系列的用途：holdout 設計的實際用法與證據：比較「出資方看過的題」與「沒看過的題」上的成績；也說明可驗證答案仍會放過「用數值捷徑而非預期推理」的解法。

---

## 補搜紀錄

### 收錄精讀（2 篇）

### Less than 70% of FrontierMath is within reach for today’s models（Epoch AI Gradient Updates，Greg Burnham，2025-10-17）
- 網址：https://epoch.ai/gradient-updates/less-than-70-percent-of-frontiermath-is-within-reach-for-todays-models
- 讀取狀態：✅
- 讀取紀錄：全文約 11,000 字元（含 8 個註腳），Exa fetch 一次讀完。
- 類型：官方分析文章
- 研究設計或文件目的：用 GPT-5 (medium) 跑 32 次（10 倍 token 預算）看 pass@N 怎麼成長，並彙整 Epoch 所有歷史 run 算「至少被解過一次」的比例，估計 FrontierMath Tiers 1–3 的可及上限。
- 會被引用的結果：
  - GPT-5 pass@1 29%、pass@32 46%；每次加倍的增益從 5.4% 遞減到 1.5%，"Pass@N on these runs shows sub-logarithmic growth and appears to cap out below 50%."
  - 抽 10 題沒解過的題再各跑 100 次，0 題被解。
  - pass@the-kitchen-sink 57%（165/290）；140 題在至少兩個來源都被解，"models do not have very different skill profiles"。
  - ChatGPT Agent 獨解 14 題（5%），作者歸因於唯一有 web search。
  - 錯誤率："In the original release of FrontierMath, we estimated that 7% of problems were erroneous ... Currently we are only aware of uncorrected errors in 2% of problems. Conservatively taking the error rate to be 10%, we are thus left with 20% of FrontierMath problems being likely out of reach"
  - 註 2：可以大量重複取樣而不擔心猜中，正是因為 "answers are typically large integers or complicated symbolic real numbers"——防猜答設計讓 pass@N 有意義。
- 作者自己列的限制：無法區分 p(solve)=0 與 p(solve) 很小（註 6）；GPT-5 (high) 因 bug 實際跑成 medium（註 4）；kitchen-sink 估計含猜測。
- 與摘要說法不一致處：本文說原版估錯誤率 7%，論文寫約 10%、about 頁寫 1 in 20。
- 反證或後續修正：8 個月後 v2 審計發現 Tiers 1–3 錯誤率 43%，所以本文「最多 10% 錯、20% 真正超出能力」的拆解大幅低估了錯題比例；「<70% 可及」的結論至少部分是錯題造成的天花板。v2 後 GPT-5.5 xhigh 達 85%。
- 對系列的用途：說明「看起來還沒飽和」可能部分來自答案鍵錯誤：錯題會被誤讀成「模型能力上限」；也示範防猜答設計怎麼讓 pass@N 分析成立。
- 收錄理由：它是 Epoch 自己在 v2 前對錯誤率與飽和的一手判斷，正好被 v2 推翻，是「2024 後更新」與「反證」兩關都命中的材料。

### Farewell to Final-Answer Competition Problems as Frontier Benchmarks（MathArena 部落格，Chenhao Sun、Jasper Dekoninck、Martin Vechev，2026-05-12）
- 網址：https://matharena.ai/no_final_answer/
- 讀取狀態：✅
- 讀取紀錄：全文約 5,500 字元，Exa fetch 一次讀完。
- 類型：部落格（benchmark 維護者）
- 研究設計或文件目的：試圖用 2025-08 之後的新比賽題建 Apex v2（收錄條件：所有受測 frontier 模型所有嘗試都解不出）。
- 會被引用的結果：
  - "We selected 176 qualifying final-answer problems and ran Gemini 3.1 Pro four times on each. The result: 162 problems were solved in all four attempts, and the remaining 14 were each solved at least once. Thus, no problem met Apex's original inclusion criterion"
  - 原 Apex："GPT-5.5 recently solved the last unsolved problem on MathArena Apex (the infamous IMO Problem 6), and Apex Shortlist is now also at 90%+ accuracy."
  - 結論："final-answer competition problems are no longer an effective source of hard benchmark tasks for frontier models."
  - 建議方向：證明評估、研究數學、正確性以外的性質（USAMO 2026、ArXivMath、ArXivLean、BrokenArXiv）。
- 作者自己列的限制：只跑了一個模型（Gemini 3.1 Pro）；比賽季還沒結束，但已納入最難的 China／USA TST 等，判斷不會改變結論；最終答案題仍適合追蹤小模型與學術方法。
- 與摘要說法不一致處：逐項對過，沒有。
- 反證或後續修正：無（作者原論文預測的 "possibly as early as 2026" 飽和在此應驗）。
- 對系列的用途：支撐「時間切分防污染」能擋污染、擋不住飽和：MathArena 原論文 §5 的預測在一年內實現，維護者主動宣布退場並轉向證明與研究題。
- 收錄理由：2024 年後的一手更新，直接回應 MathArena 論文自列的限制。

### 補搜查詢與取捨
| 查詢（Exa web_search） | 找到 | 收或不收 |
|---|---|---|
| Epoch AI FrontierMath error rate review Tiers 1-3 Tier 4 errors found | Epoch v2 頁、LinkedIn 公告、多篇二手報導 | 一手頁收進指定來源 2；二手（nerdleveltech、digitortoise、digitalapplied、cryptobriefing）不收，只用來交叉核對數字 |
| epoch.ai article FrontierMath v2 audit errors 43% … | Tiers 1-3 v2 頁、aiwiki、alphasignal | 一手頁已收；二手不收 |
| "FrontierMath" errors "43%" Tiers 1-3 "40%" Tier 4 Epoch | ECI documentation、Less than 70% | ECI 收（43%／40% 出處，🟡）；Less than 70% 收為補搜精讀 |
| Epoch AI FrontierMath Open Problems unsolved research problems benchmark design | 發表文、FAQ、overview、editorial commentary、Open Problems 首頁 | 發表文、FAQ 精讀；overview 與首頁 changelog 只用摘錄；editorial commentary 未讀（摘錄只有片段，屬補充觀點，不影響設計說明） |
| FrontierMath Erdős benchmark Epoch AI Lean proofs … | 公告、benchmark 頁、arXiv 2609.25050、GitHub repo | 公告與頁面精讀；論文只讀摘錄（🟡），因說明頁已涵蓋方法，論文主要多了成本校正細節 |
| Epoch AI clarification OpenAI funding FrontierMath holdout set January 2025 | Epoch 聲明、Tamay 推文串、TechCrunch、LessWrong、Decrypt、Paul Romer、Montana Research Foundation | Epoch 聲明精讀；LessWrong／TechCrunch 以摘錄收（🟡）；Romer、Montana、Decrypt 為評論，不收（論點已由當事人一手材料涵蓋） |
| Epoch AI independent evaluation o3 FrontierMath 10% versus OpenAI claimed 25% | TechCrunch 2025-04-20、Epoch v1 頁方法論、多篇轉載 | 收 TechCrunch＋Epoch 方法論段（🟡） |
| Epoch AI FrontierMath holdout vs non-holdout OpenAI models performance | Klu、aiwiki、Epoch 聲明 | 由此找到 Battle Royale 與 GPT-5.2 Pro 兩篇一手短報並精讀；Klu／aiwiki 不收（二手，但 Klu 指出「v2 之後 holdout 對應未公布、2026-08-25 之後的 run 沒有 log」，列為待查疑點） |
| Epoch AI FrontierMath Tier 4 battle royale GPT-5 Pro holdout | Battle Royale、GPT-5.2 Pro 紀錄、Less than 70% | 見上 |
| MathArena blog 2026 proof grading methodology update saturation | ArXivMath/BrokenArXiv 更新、USAMO 2026、ProofRank、平台論文 2605.00674、blogs 列表 | Farewell 收為補搜精讀；USAMO 2026 與平台論文只用摘錄記入 MathArena 條的「後續修正」 |
| criticism of MathArena evaluation methodology … | Apex 頁、USAMO 2025「Proof or Bluff」、BrokenArXiv、aiwiki | 不另收：Apex 頁的污染自述與 USAMO 2025 的 LLM 判官高估（最多 20 倍）屬 MathArena 自身材料，與已收內容重疊；可在證明評分段落引用 https://arxiv.org/html/2503.21934v5 Table 2 |

### 待查疑點（未解決，留給寫稿時判斷）
- Tier 4 錯誤率：changelog 算 38%（19/50），ECI 寫 40%，Epoch 未說明分母。
- v2 後 holdout 怎麼對應新的 295／43 題，Epoch 未公布；LinkedIn 只說 OpenAI 可存取「約 80%」。
- Besiroglu 2024-12-20 推文是否說過 holdout「獨立出資」，只有 meemi 轉述，原推文未讀到。
