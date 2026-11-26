# 批次 I-arc：抽象推理（ARC-AGI）抽取紀錄

讀取日期：2026-11-23。PDF 一律以 `curl -sL` 下載 arXiv PDF 後 `pdftotext` 轉文字（存於本 session scratchpad），再依行號分段讀；網頁用 Exa `web_fetch_exa`（maxCharacters 25k–60k，皆未截斷）。

---

### On the Measure of Intelligence（Chollet，2019）
- 網址：https://arxiv.org/abs/1911.01547 （讀 PDF v2，2019-11-25）
- 讀取狀態：✅（指定範圍讀完；依任務指示只精讀部分章節）
- 讀取紀錄：pdftotext 全文約 179k 字元、2,531 行。依序讀過：摘要＋目錄（行 1–90）；第 I 部全部 I.1–I.3.5（行 85–707）；II.1.1（行 710–821）；II.2.1 開頭的直覺說明與問題設定（行 1077–1180）；II.2.1 中 Generalization Difficulty 定義（行 1355–1400）與定義總結「in plain English」及 key observations（行 1670–1716）；II.2.3、II.3.1、II.3.2（行 1745–1905）；第 III 部全部 III.1–III.3＋Taking stock（行 1905–2290）。**略過**：II.1.2（generality 與 g factor，行 822–961）、II.1.3（發展心理學與先天／後天，行 962–1076）、II.2.1 其餘 AIT 形式化細節（curriculum、priors、experience 定義與完整公式，約行 1180–1355、1400–1670）、II.2.2（運算／時間／能源／風險效率）、參考文獻。
- 類型：研究論文（立場論文＋benchmark 提案）
- 研究設計或文件目的：論證「量技能」不等於「量智能」，提出以演算法資訊理論（AIT）定義智能為「技能習得效率」，據此列出理想智能 benchmark 的條件，並提出 ARC（Abstraction and Reasoning Corpus）作為第一個實作。
- 會被引用的結果：
  - 核心主張：技能可以被「買」出來。摘要：“unlimited priors or unlimited training data allow experimenters to “buy” arbitrary levels of skills for a system, in a way that masks the system’s own generalization power.”（Abstract；II.1.1 再述 “Testing for skill at a task that is known in advance to system developers ... can be gamed without displaying intelligence, in two ways: 1) unlimited prior knowledge, 2) unlimited training data.”）
  - 智能定義（II.2.1）：“The intelligence of a system is a measure of its skill-acquisition efficiency over a scope of tasks, with respect to priors, experience, and generalization difficulty.” 白話版（II.2.1 結尾）：“intelligence is the rate at which a learner turns its experience and priors into new skills at valuable tasks that involve uncertainty and adaptation.”
  - 技能 vs. 智能：“Skill is not possessed by an intelligent system, it is a property of the output artifact of the process of intelligence (a skill program). High skill is not high intelligence”（II.2.1 key observations）。下棋例：“there is no task X such that skill at X demonstrates intelligence, unless X is actually a meta-task involving skill-acquisition across a broad range of tasks.”（I.3.1）
  - 兩種泛化（I.3.2）：system-centric generalization（系統沒看過）vs. developer-aware generalization（“situations that neither the system nor the developer of the system have encountered before”）。後者是 ARC 要量的。
  - 泛化分級（I.3.2）：absence of generalization → local generalization／robustness（“adaptation to known unknowns within a single task”）→ broad generalization／flexibility（“adaptation to unknown unknowns across a broad category of related tasks”）→ extreme generalization（“adaptation to unknown unknowns across an unknown range of tasks and domains”），另有理論上的 universality。並對應 CHC 三層：task-specific skill／broad ability／g factor（Figure 1）。
  - 既有多任務 benchmark 的缺陷（I.3.3）：GLUE、SuperGLUE、ALE 等 “the set of tasks is still known in advance to the developers ... merely widening task-specific skill evaluation to more tasks does not produce a qualitatively different kind of evaluation.”
  - 直接拿 IQ 測驗測 AI 的問題（I.3.4）：開發者看得到題目，“it is the system developers who are solving the test problems, rather than any AI.”
  - 泛化難度 GD（II.2.1）：以「最短訓練期最佳解」要被改寫多少才能成為評估期解來定義，介於 0–1；“If the shortest skill program that performs optimally during training also happens to perform at a sufficient skill level during evaluation, the task has zero generalization difficulty”。推論：“Intelligence is not curve-fitting”。
  - 理想 benchmark 六條件（II.3.2）：描述 scope 與 validity；reliable；量 broad abilities 與 developer-aware generalization（評估集不得含事先已知任務、量化泛化難度）；控制經驗量（“It should not be possible to “buy” performance on the benchmark by sampling unlimited training data. The benchmark should avoid tasks for which new data can be generated at will.”）；明列 priors；對人與機器公平（只假設 Core Knowledge、只需人類量級的練習）。
  - ARC 規格（III.1.1）：訓練集 400 題、評估集 600 題（公開 400＋私有 200），每題平均 3.3 組示範，測試多為 1 組；格子 1×1–30×30、10 色；輸出格須從零建構（含大小）；每個測試例 3 次嘗試、二元回饋；“The existence of a private evaluation set enables us to strictly enforce this in the setting of a public competition.”
  - Core Knowledge priors（III.1.2）四類：objectness（cohesion、persistence、influence via contact）、goal-directedness、numbers & counting（數量約小於 10）、basic geometry & topology。不需語言、真實物體圖片或常識。
  - 與心理測驗差異（III.1.3）：只測流體智力不測晶體智力；題目對開發者未知；題目多樣性高於傳統 IQ 測驗；**多數題目非程式生成**——“merely reverse-engineering the generative program shared across tasks ... would be sufficient to fully solve all tasks”，因此手工出題。
  - 人類可解性（III.1.4）：每題至少被三位高 IQ 受試者之一解出（彼此不溝通）。
  - 預期解法（III.1.4）：“ARC is perhaps best understood as a program synthesis benchmark”，DSL＋候選程式搜尋＋以簡潔度挑選，但 “we do not expect that merely selecting the simplest possible program that works on training pairs will generalize well to test pairs”。
- 作者自己列的限制（III.2，五條）：
  1. “Generalization is not quantified”——沒有量化評估集或單題的泛化難度。
  2. “Test validity is not established”——沒有大樣本人類研究證明預測效度。
  3. “Dataset size and diversity may be limited”——只有 1,000 題，概念可能重疊，“This could make ARC potentially vulnerable to shortcut strategies”；計畫以公開競賽群眾外包找捷徑。
  4. “The evaluation format is overly close-ended and binary”——建議改成可與範例產生器互動、以「需要多少回饋才穩定答對」計分（這正是後來 ARC-AGI-3 互動式、以行動效率計分的雛形）。
  5. “Core Knowledge priors may not be well understood and may not be well captured in ARC.”
  另外 III.1.4 自承：“Our claims are highly speculative and may well prove fully incorrect, much like Newell’s 1973 hopes that progress on chess playing would translate ...”
- 與摘要說法不一致處：摘要說 ARC “enables fair general intelligence comparisons between AI systems and humans”，但 III.2 承認效度未建立、泛化難度未量化，II.3.2 的「量化泛化難度」條件 ARC 本身沒做到；摘要的公平比較是設計意圖而非已驗證結果。另，論文設定每題 3 次嘗試，後續競賽改為 2 次（見 ARC Prize 2024 報告「two attempts per test input」）。
- 反證或後續修正：作者群自己在後續報告中修正——ARC Prize 2024 報告指出 2020 年 49% 私有題可被暴力程式搜尋集體解出（https://arxiv.org/abs/2412.04604 §4.2），等於證實 III.2 第 3 條擔心的捷徑；ARC Prize 2025 報告與 ARC-AGI-3 報告承認前沿模型對 ARC-AGI-1/2 出現「知識型過擬合」（見下）。Pfister & Jud（2025）主張 ARC 題型本質上可被大量試誤解（見下）。
- 對系列的用途：支撐 ARC 專文的核心論點——ARC 想量的是「學新技能的效率（控制 priors 與經驗）」而非「會多少技能」，以及「只要題目事先可知或可無限生成資料，技能分數就能被買到」。

---

### ARC Prize 2024: Technical Report（Chollet, Knoop, Kamradt, Landers，2024）
- 網址：https://arxiv.org/abs/2412.04604 （讀 PDF v2，2025-01-08）
- 讀取狀態：✅
- 讀取紀錄：pdftotext 全文約 41k 字元、610 行；依序讀完 Abstract、§1（ARC-AGI 與資料組成、2024 前進展）、§2（Kaggle 與公開排行榜、論文獎）、§3（三類方法）、§4（2025 與 ARC-AGI-2）、§5 結論、§6 附錄與參考文獻（全文）。
- 類型：官方技術報告
- 研究設計或文件目的：總結 ARC Prize 2024 競賽（2024-06-11 至 11-10）結果、方法路線與 ARC-AGI-1 的缺陷。
- 會被引用的結果：
  - SOTA：私有評估集由 33% 升到 55.5%（MindsAI，未開源故不得獎）；第一名 the ARChitects 53.5%（Table 1）。Abstract：“the state-of-the-art score on the ARC-AGI private evaluation set increased from 33% to 55.5%”。
  - 資料組成（§1.1）：公開訓練 400（easy）、公開評估 400（hard）、半私有 100、私有 100；SOTA 只報私有集。半私有集 “has been exposed to commercial APIs and thus suffers from a risk of leakage.”
  - 人類表現（§1.1）：原始私有題由兩人測試得 97%、98%，合起來 100%；NYU（H-ARC）MTurk 研究 99% 公開評估題至少有一人解出、每題 10 人。
  - Kaggle 規則與算力（§2.1）：“a single P100 GPU in under 12 hours with no internet access”，須開源才能領獎；大獎 $600,000 門檻 85%，未領走。
  - 公開排行榜 ARC-AGI-Pub（§2.2）：可連網、API 花費上限 $10,000，約 Kaggle 的 1,000 倍算力（Kaggle 約等於每次 $10）；以半私有集驗證，若半私有與公開評估差距超過 ±10 個百分點視為過擬合。Table 2：Jeremy Berman 53.6%（半私有）／58.5%（公開）、Akyürek et al. 47.5%／62.8%、Greenblatt 43%／42%、o1-preview 18%／21%、Claude 3.5 Sonnet 14%／21%、GPT-4o 5%／9%、Gemini 1.5 4.5%／8%。原句：“both the competition and secondary public leaderboard top scores tracked closely. This suggests algorithmic improvements towards AGI hold significant power and that massive compute may not be necessary”。
  - 參與規模：1,430 隊、17,789 次提交；至少七家融資超過 $1M 的公司投入。
  - 2020 前歷史（§1.2）：2020 Kaggle 冠軍 20%，深度學習法無一超過 1%，GPT-3 直接提示 0%；到 2024 初只到 33%。
  - 三類方法（§3）：(1) 深度學習引導的程式合成（Greenblatt 用 GPT-4o 每題生成數千個 Python 程式；Hodel 的 DSL）；(2) 測試時訓練 TTT（“there does not exist any static inference-style transduction solution that scores above 11%”）；(3) 歸納（程式合成）＋轉導（直接預測輸出）合併——“The best transduction-only and induction-only single submissions score around 40%, so only an ensemble of both can compete”。
  - 算力與分數不可分（§3.1）：“any search-based approach can always score higher if provided with more compute, and it is thus no longer possible to assign a score to an approach, but only to the combination of an approach plus a compute budget.” 估計 Greenblatt 式方法每題產生約 1 億個程式可達 85%，“a multi-million dollar compute budget to solve 100 tasks”。
  - TTT 依賴合成資料（§3.2）：ARC-Heavy/Potpourri（400,000 道類 ARC 題）、Re-ARC（可無限取樣 400 道訓練題的新實例）。
  - ARC-AGI-1 缺陷（§4.2）：私有集只有 100 題、四屆競賽累計回報約 10,000 次私有集分數（資訊洩漏風險）；2020 年所有提交合起來解出 49% 私有題（皆為暴力程式搜尋）——“a large fraction of the ARC-AGI-1 dataset is overly susceptible to these kinds of brute-force program search techniques and therefore does not carry a useful signal towards AGI”；各評估子集難度分布不一致。
- 作者自己列的限制：即 §4.2 三點（私有集太小且反覆回饋、近半題可暴力解、子集難度不一致）；另 §3.1 自承程式搜尋與暴力 DSL 搜尋目前 “does not currently decisively beat” 彼此。
- 與摘要說法不一致處：摘要稱 ARC-AGI “remains unbeaten” 並把 55.5% 當 SOTA，但正文 §4.2/§5 同時承認 2020 年暴力搜尋集合就能達 49%，等於 55.5% 中有相當部分不代表「通往 AGI 的訊號」，摘要沒提這層折扣。**本報告未提 o3**（o3 結果 2024-12-20 才公布，v2 也未補）；任務指示中「o3 分數與每題成本」改由 o3 部落格與 ARC-AGI-2 論文取得（見下）。
- 反證或後續修正：o3-preview 於報告發布兩週後在半私有集得 75.7%／87.5%（https://arcprize.org/blog/oai-o3-pub-breakthrough ），部落格並稱「a large ensemble of low-compute Kaggle solutions can now score 81% on the private eval」，即 ARC-AGI-1 在 2024 年底已接近飽和，推動 ARC-AGI-2。
- 對系列的用途：支撐「同一個 benchmark 分數必須連同算力預算一起報」以及「ARC-AGI-1 近半題可被暴力程式搜尋解，為何要出第二版」。

#### 附：OpenAI o3 Breakthrough High Score on ARC-AGI-Pub（Chollet，2024-12-20，後續多次更新）
- 網址：https://arcprize.org/blog/oai-o3-pub-breakthrough
- 讀取狀態：✅（Exa 全文，未截斷）
- 會被引用的結果（以頁面目前版本為準，含 2025-03-24 與 2025-12-10 兩次定價更新註記）：半私有 100 題，high-efficiency（6 samples）75.7%，總成本 $2,680、每題 $26、1.3 分鐘；low-efficiency（1024 samples，172 倍算力）87.5%，總成本 $456,000、每題 $4,560、13.8 分鐘、5.7B tokens。公開 400 題：82.8%（每題 $167）／91.5%（每題 $1,900）。成本註記：“o3 pricing costs have been updated to use o3-pro pricing of $80/M/Tokens.”
- 關鍵附註：“OpenAI shared they trained the o3 we tested on 75% of the Public Training set.”；“ARC-AGI is not an acid test for AGI”；“You’ll know AGI is here when the exercise of creating tasks that are easy for regular humans but hard for AI becomes simply impossible.”；人類每題約 $5。
- 與其他來源不一致：**o3 每題成本在不同來源差很多**——部落格目前版 $26／$4,560；ARC-AGI-2 論文寫 “76% (low-compute; estimated cost: $200 per task) and 88% (high-compute; estimated cost: $20,000 per task)”；Pfister & Jud（2025-01）引用原始版 $20／$3,460（總 $2,012／$346,000）。差異來自部落格三度改用不同定價假設（原始估價→o1-pro 定價→o3-pro 定價）。ARC-AGI-2 論文的「low-compute」對應的其實是 75.7%，「88%」是 87.5% 四捨五入。寫文章時要寫明「依哪一版定價」，或只寫「高算力設定約為低算力的 172 倍」。另：部落格文中一處又寫 “o3-preview requires $27 per task in the low-compute mode”，與表格 $26 也差 $1。

---

### ARC-AGI-2: A New Challenge for Frontier AI Reasoning Systems（Chollet, Knoop, Kamradt, Pinkard, Landers，2025）
- 網址：https://arxiv.org/abs/2505.11831 （讀 PDF v2，2026-01-15）
- 讀取狀態：✅
- 讀取紀錄：pdftotext 全文約 37k 字元、690 行；依序讀完 Abstract、§1（ARC-AGI-1 歷史）、§2（ARC-AGI-1 限制）、§3（目標）、§4（人類校準測試：protocol、demographics、results、performance）、§5（選題流程）、§6（SOTA 表）、§7（設計變更與例題）、§8（ARC Prize 2025 規則）、§9 結論、致謝、參考文獻（全文）。
- 類型：研究論文（benchmark 論文）
- 研究設計或文件目的：說明為何需要第二版、如何以大規模人類測試校準難度、新版針對哪些弱點設計。
- 會被引用的結果：
  - 為何改版（§2）五個限制：可被非泛化策略（暴力程式搜尋，2020 年集體 49%）解；缺第一方人類基準；“the benchmark saturated well before it could capture the full spectrum of human fluid intelligence”（高智力者可解 97% 以上）；子集難度不一致（公開評估較私有簡單）；私有 100 題重複使用、累計約 10,000 次分數回饋的洩漏風險。
  - 設計目標（§3）：同原則、同格式；“Less brute-forcible”；大規模第一方人類測試；更寬的「訊號頻寬」；各子集人類難度校準一致。開發自 2021 年底開始。
  - 人類測試（§4）：受試者在聖地牙哥的會議室環境、同時最多 34 人；90 分鐘一場，基本報酬 $115–150＋每題答對 $5；2024-11 至 2025-05 共三次測試。**407 名不重複受試者、515 場次、1,848 個不重複測試對、13,405 次嘗試，其中 8,277 次（62%）成功**；嘗試的中位數耗時 2.3 分鐘，成功者 2.2 分鐘。人口變項（職業、程式、數學、解謎經驗等）與表現**無統計顯著關係**——“ARC-AGI-2 tasks assess general problem-solving capabilities rather than domain-specific knowledge”。
  - 選題（§5）：任務須「至少兩位獨立受試者在前兩次嘗試內解出一個以上子對」才保留；以「完全答對比例」當難度指標，公開／半私有／私有三組平均人類正確率差 ≤ 1 個百分點；新題優先放私有集；冗餘偵測標準為「單一程式可能同時解兩題」。最終：“100% of ARC-AGI-2 tasks were solved by at least two independent, non-expert human testers ... with each task attempted by between 2 and 10 humans.” 以題目聚合，75% 嘗試成功；全部嘗試聚合 66%。
  - 前沿模型分數（§6 Table 1，半私有集，2025-05-14）：ARC-AGI-1／ARC-AGI-2 分別為 o3-mini (High) 34.5%／3.0%、o3 (Medium) 53.0%／3.0%、ARChitects（2024）56.0%／2.5%、o4-mini (Medium) 41.8%／2.4%、Icecuber（2020）17.0%／1.6%、o1-pro (Low) 23.3%／0.9%、Claude 3.7 (8K) 21.2%／0.9%。“ARC-AGI-2 accuracies below 5% are generally not treated as meaningful ... consistent signal begins to emerge only once performance exceeds the 5% threshold.”
  - 設計上針對的弱點（§7）：題目更獨特（“every ARC-AGI-2 task is, to the best of our knowledge, entirely novel”）；資訊量更大（格子更大、物件更多、每題概念更多，“Any attempt at compressing ARC-AGI-2 tasks would result in more bits per task”）；聚焦組合泛化，四種形式——multi-rule compositional reasoning、multi-step compositional reasoning（第 N+1 步依賴前 N 步，無法不執行就預測）、contextual rule application（規則套用受情境條件控制，“a form of control flow”）、in-context symbol definition（物件代表別的東西，意義在題內定義；“a major challenge for frontier AI systems”）。人類平均完成時間 2.7 分鐘，“all tasks in ARC-AGI-2 require some amount of deliberate thinking”。
  - o3 背景（§1.2）：o3-preview 在 ARC-AGI-1 半私有 76%／88%，“surpassing the nominal human baseline for the first time”；公開版 o3-medium 53%。
  - ARC Prize 2025 規則（§8.1）：總獎金 $1,000,000，大獎 $700,000 門檻私有集 ≥85%；Kaggle 4 張 NVIDIA L4、12 小時、離線，120 題半私有＋120 題私有；2025-03-24 開賽、11-03 截止。公開排行榜以「每題成本 × 分數」2D 呈現。
- 作者自己列的限制：論文本身沒有獨立的限制節。隱含承認：低於 5% 的分數無意義；Public Training 集未做難度校準、部分題未完整人測；發現部分訓練對有少數格子錯誤（已修正）。
- 與摘要說法不一致處：(1) 摘要說人類測試是 “robust baseline”，但正文每題只有 2–10 人嘗試，納入門檻是「至少 2 人解出」，所以「100% 人類可解」是指「每題至少兩人解出」，不是「一般人都能解」；同一批資料的整體嘗試成功率只有 62%–66%。排行榜「Human Panel 100%」沿用的是前者定義，寫文章時要區分。(2) 耗時數字不一致：§4.3 中位數 2.3 分鐘，§7.1 平均 2.7 分鐘；ARC-AGI-3 報告又說 ARC-AGI-2 一題「about 300 seconds」（5 分鐘）。(3) 參考文獻 10（On the Measure of Intelligence）網址誤植為 2412.04604。(4) Table 1 經 pdftotext 欄位錯位，以上配對依兩欄各 7 個數值依序對應，與 arcprize.org 排行榜（ARChitects 56.0%／2.5%、Icecuber 17.0%／1.6%）一致。
- 反證或後續修正：ARC Prize 2025 報告承認 ARC-AGI-2 也出現知識型過擬合；到 2026-11 排行榜上 ARC-AGI-2 最高已 95.8%（見排行榜一節），等於一年半內被商用推理模型飽和。Kaggle 受限算力組 2025 年最高僅 24%，與前沿 API 模型差距大。
- 對系列的用途：支撐「改版是針對第一版被暴力搜尋與洩漏削弱的訊號」與「以人類校準定義『對人簡單』」，並提供 ARC-AGI-2 的組合推理設計例子。

---

### ARC Prize 2025: Technical Report（Chollet, Knoop, Kamradt, Landers，2026-01）
- 網址：https://arxiv.org/abs/2601.10904 （HTML：https://arxiv.org/html/2601.10904 ）
- 讀取狀態：✅
- 讀取紀錄：pdftotext 全文約 35k 字元、496 行。開頭至 §3.2.1（Abstract、§1、§2 競賽結果與論文獎、§3.1 refinement loop 類型、TRM 引文）由 Exa 讀 arXiv HTML 取得；§3.2.2 CompressARC 至文末（§3.3 商用例、§3.4 Refinement harness、§4 AGI 進展、§4.1 知識過擬合、§4.2、§4.3 ARC-AGI-3、§5、§6、參考文獻）由 PDF 文字行 242–496 讀完。兩段銜接於 TRM 引文，涵蓋全文。
- 類型：官方技術報告
- 研究設計或文件目的：總結 ARC Prize 2025（ARC-AGI-2）競賽、分析 2025 年方法主軸，並宣布 ARC-AGI-3。
- 會被引用的結果：
  - 競賽（§2.1–2.2）：2025-03-26 至 11-03；1,455 隊、15,154 次提交；最高私有分 24.03%（NVARC，“at a compute cost of $0.20 per task”），the ARChitects 16.53%、MindsAI 12.64%、Lonnie 6.67%、Barbadillo 6.53%；論文 90 篇（2024 年 47 篇）。大獎未領。
  - ARC-AGI-2 組成（§1.1）：公開訓練 400（沿用 ARC-AGI-1）、半私有 120、私有 120。
  - 年度主題 refinement loop（§3）：“a per-task iterative program optimization loop guided by a feedback signal”，包括 TTT、零預訓練深度學習（TRM 7M 參數：ARC-AGI-1 45%、ARC-AGI-2 8%；CompressARC 76K 參數、無預訓練、ARC-AGI-1 20%）、演化程式合成（Berman、Pang）、CoT 最佳化。
  - Harness 效果（§3.4）：Poetiq 的 Gemini 3 Pro refinement harness，ARC-AGI-2 由 31%（$0.81/題）升到 54%（$31/題）；Claude Opus 4.5 用同法分數相近、約 $60/題。
  - 知識型過擬合（§4.1）：“even well-designed benchmarks resistant to direct memorization can now be “overfit” if the public training and private test sets are too similar ... We assert that this phenomenon is now occurring with ARC-AGI-1 and ARC-AGI-2 – accidentally or intentionally, although we cannot determine which.” 證據：Gemini 3 Deep Think 的推理鏈在提示未提及 ARC 的情況下使用正確的 ARC 數字↔顏色對應。
  - 定位轉變（§4）：“the Grand Prize accuracy gap is now primarily bottlenecked by engineering, while the efficiency gap remains bottlenecked by fundamental science and new ideas.” 四家前沿實驗室（Anthropic、Google DeepMind、OpenAI、xAI）在 model card 報 ARC-AGI 分數。
  - 「AGI 判準」的操作化（§4.2）：把 benchmark 設計本身當 refinement loop——持續出「對人簡單、對 AI 難」的題，直到做不出來。
- 作者自己列的限制：“we cannot precisely quantify the magnitude of this effect”（知識過擬合的程度無法量化）；refinement harness 目前是領域專屬的。
- 與摘要說法不一致處：摘要稱 ARC-AGI 已成「industry standard benchmark」，正文同時說它被知識過擬合、需要改版——兩者並存但摘要未提過擬合的程度不明。**MindsAI 分數不一致**：表格 12.64%，同期官方部落格（https://arcprize.org/blog/arc-prize-2025-results-analysis ）文字描述寫 “a competitive 15.42% ARC-AGI-2 score”（可能是半私有集分數，來源未說明）。
- 反證或後續修正：ARC-AGI-3 報告（2026-04）把 §4.1 的推論講得更具體：前沿模型可「自己生成題目→解→用驗證器篩→訓練推理軌跡」大量覆蓋任務空間，“considerably reducing or outright removing the need for test-time adaptation”。外部批評 Pfister & Jud、UnlikelyAI Lab 指出 TTT＋合成資料屬於 ARC 專用技能（見下）。
- 對系列的用途：支撐「抗污染設計（私有測試集）在推理模型時代失效的新形式：不是背題，而是把整個題型分布學起來」。

---

### ARC-AGI-3：官方說明、技術報告、計分文件與現況（ARC Prize Foundation，2026）
- 網址：
  - 技術報告（2026-04-22 版 PDF）：https://arcprize.org/media/ARC_AGI_3_Technical_Report.pdf （arXiv v1：https://arxiv.org/abs/2603.24621 ，2026-03-24）
  - 說明頁：https://arcprize.org/arc-agi/3/
  - 計分文件：https://docs.arcprize.org/methodology
  - 人類資料部落格：https://arcprize.org/blog/arc-agi-3-human-dataset （2026-04-14）
  - GPT-6 Astra 分析：https://arcprize.org/blog/astra （2026-09-03）
  - 排行榜：https://arcprize.org/leaderboard ；ARC Prize 2026：https://arcprize.org/competitions/2026
- 讀取狀態：✅（技術報告 PDF 全文；各網頁 Exa 全文）。arXiv v1 只透過 Exa 搜尋摘錄讀了計分公式段，用來比對版本差異，未全文讀。
- 讀取紀錄：技術報告 pdftotext 約 62k 字元、920 行；§2.2–§2.3、§4.1–§4.2、§5.1、§5.3.2 先由 Exa 摘錄讀過，其餘行 1–162、192–365、498–500、567–686、708–920 以 PDF 文字依序讀完（§1 系列回顧、§2.1 目標、§3 建置與驗證、§3.6 資料集、§4.3 排行榜政策、§5 人類校準、§6 預發布測試、§7 ARC Prize 2026、結論、參考文獻），合計涵蓋全文。說明頁、計分文件、兩篇部落格、排行榜、競賽頁各一次讀完。
- 類型：官方文件／技術報告／排行榜頁
- 研究設計或文件目的：把 ARC 從靜態「輸入→輸出」題改成互動式回合制遊戲環境，直接量「行動效率」，第一次讓人與 AI 的學習效率可以正式比較。
- 會被引用的結果：
  - 定位（§2.1）：“We define AGI not merely as a set of static capabilities, but as a system’s ability to acquire any skill a human can, as efficiently as a human can.” 四個能力：Exploration、Modeling、Goal-Setting、Planning & Execution；“the agent is never told the objective nor provided instructions.”
  - 智能即效率（§2.2）：把資料、時間、算力、風險效率合成單一的 action efficiency——“It penalizes “brute-forcing””。破關標準：“an AI system matches or exceeds human-level action efficiency on ARC-AGI-3 environments that it sees for the first time, averaged across all private environments.”
  - 格式（§2.3）：64×64 格、16 色；動作空間＝5 個按鍵＋Undo＋點選格子；推理步驟、工具呼叫不算動作；回合制（避免考反應速度）。
  - 設計約束（§3.4）：只用 Core Knowledge（objectness、幾何拓樸、基本物理、agentness），不用數字、字母、可辨識圖示或文化慣例；新穎性測試——若一個程式解兩個環境的長度比兩個獨立解法串接短 50% 以上，視為不夠不同；每個環境多種機制，難度來自組合；第一關為教學關。
  - 自動驗證（§3.5）：隨機策略 50,000 步不得過任何關；1,000,000 步不得過非教學關；以狀態圖估計，隨機策略過關機率須低於 1/10,000。
  - 資料集（§3.6 Table 1）：公開示範 25、半私有 55、完全私有 55（共 135）；私有集刻意與公開集分布不同（out-of-distribution），公開／私有比例相對 ARC-AGI-2 反轉。
  - 計分 RHAE（§4.1，2026-04 版）：每關 S = min(1.15, (h/a)²)，h＝「upper-median」人類行動數、a＝AI 行動數；環境分數＝各關以關卡序號線性加權平均（5 關時第 5 關佔 5/15），並以「已完成關卡的加權比例」為上限；總分＝各環境平均。範例：人類 10 步、AI 100 步 → (10/100)² = 1%。評測時每關行動上限為人類中位數的 5 倍。
  - 人類校準（§5）：每個環境 10 人首次遊玩，至少 2 人獨立全破才收；舊金山測試中心每週三次、90 分鐘、$115–140＋每破一個環境 $5；486 位受試者、414 個候選環境、2,893 次嘗試；嘗試中位數 7.4 分鐘。部落格版本：458 位受試者；公開示範 25 個環境 342 次遊玩、145 次全破；r11l 10/10 人破、tr87 6/12、bp35 2/14、sp80 2/12。
  - 官方排行榜政策（§4.3.1）：區分 task-specific overfitting 與 domain-specific overfitting；“we will never report public set scores of any system on the official leaderboard”；“the official leaderboard will not use a harness to report official scores”。證據：Duke 團隊的 harness 讓 Opus 4.6 在 TR87 變體由 0.0% 變 97.1%，但在未看過的 BP35 仍 0.0%——“Specifically engineered harnesses are not a useful way to measure AGI progress”。發布時（2026-03）前沿模型：Opus 4.6 (Max) 0.50%、Gemini 3.1 Pro Preview 0.40%、GPT 5.4 (High) 0.20%、Grok-4.20 0.10%。
  - 預覽競賽（§6）：2025-07-18 至 08-19，第一名 StochasticGoose（Tufa Labs，CNN＋RL）12.58%，兩名頭獎都是「盡量探索動作空間碰運氣」的資訊性搜尋。
  - ARC Prize 2026（§7＋競賽頁）：總獎金 $2M，三軌（ARC-AGI-3、ARC-AGI-2、論文）；ARC-AGI-2 軌為最後一年、大獎保證發出；2026-03-25 開賽、11-02 截止、**12-04 公布結果**（截至 2026-11-23 尚未公布）。
  - 現況（排行榜，2026-11-23 讀取；ARC-AGI-3 為半私有集）：
    - ARC-AGI-3 Standard harness 最高：Claude Fable 5.2 81.2%（總成本 $21.9K，2026-11-09）、GPT-6.2 Astra 70.3%（$24.2K）、Gemini 4 Carbon 65.1%（$7.2K）、GPT-6 Astra 62.7%。
    - ARC-AGI-3 Provider Adapter harness 最高：GPT-6.2 Astra 100.0%（$4.1K）、GPT-6 Astra 99.9%、Gemini 4 Carbon 99.1%。
    - ARC-AGI-2 最高：GPT-6.2 Astra 95.8%（$0.50/題，2026-11-17）、GPT-6 Astra 95.0%（$1.12/題）、GPT-6.1 Sol 94.2%（$0.254/題）、Gemini 4 Carbon 94.2%、Claude Fable 5.2 93.8%。Human Panel 欄：ARC-AGI-1 98%、ARC-AGI-2 100%。
    - 對照時間軸：o3 (Preview) 2024-12 ARC-AGI-2 4.0%；o3 2025-04 6.5%；Gemini 3 Pro 2025-11 31.1%；GPT-5.2 Pro 2025-12 54.2%；Gemini 3 Deep Think 2026-02 84.6%。
  - Astra 部落格（2026-09-03）：Standard harness＝模型自選筆記帶到下一回合；Provider Adapter＝保留供應商不透明的推理狀態並壓縮長對話。GPT-6 Astra 在 Provider Adapter 下 “used fewer actions than the human baseline on 96.0% of levels and used 51.7% fewer actions per level on average”；“by ARC-AGI-3’s measure of action efficiency, Astra matched and surpassed human parity.” 作者原先假設行動效率會是人機分界線，實際觀察到 “Once frontier AI “understands” the mechanics, it generally executes within the range of human efficiency.” 仍強調 “we are not claiming that it is AGI”，並承認 “its environments have deterministic, closed-ended mechanics and goals. It does not represent the complexity and open-endedness of the real world.” 之後排行榜兩種 harness 並列。
- 作者自己列的限制：行動上限 5 倍人類中位數可能讓分數略低；公開集比私有集簡單，不代表進展；harness 結果不可推廣；Astra 文承認環境封閉、確定性，不代表真實世界。
- 與摘要說法不一致處／版本差異（重要）：
  1. **計分規則改過**：arXiv v1（2026-03-24）以「second-best human」為基準、每關上限 1.0、無環境上限；2026-04-14 部落格宣布改成「median／upper-median human」、上限 1.15，2026-04-22 版報告加入「環境上限＝已完成關卡加權比例」。引用公式時要註明版本。
  2. **「不用 harness」政策後來改變**：報告 §4.3.1 說官方榜不使用 harness，但目前排行榜的官方分數全部標明 Standard harness 或 Provider Adapter harness（後者讓 GPT-6.2 Astra 達 100%）。Standard harness 本身就是官方提供的筆記機制，與報告「Models will not be given tools」的描述不同。
  3. 受試者人數：報告 486 人，同月部落格 458 人。
  4. 關卡數：§3.4 說每個環境「at least six levels」，§4.1 計分卻以 n=5 舉例並寫「a simple linearly weighted average across the five levels」；公開示範中 lf52 人類最高完成 10 關。
  5. 「100% 人類可解」定義為「每個環境至少 2/10 人全破」，個別環境破關率可低到 2/14（bp35）。
  6. 摘要寫 “frontier AI systems which, as of March 2026, score below 1%”，到 2026-09 起已有 60%–100% 分數，摘要是發布時點的事實，不是現況。
- 反證或後續修正：GPT-6 Astra（2026-09）在 Provider Adapter 下 99.9%、行動效率超過人類中位數——ARC-AGI-3 在發布約半年後就在一種官方設定下達到人類對等。The New Stack 報導（https://thenewstack.io/openai-astra-harness-arc-agi-3/ ，只讀搜尋摘錄）指出 OpenAI 對外販售的 API 不等於拿到 98.6% 的那套系統，可再追。
- 對系列的用途：支撐「ARC 一路改版的邏輯——從『推斷規則』走到『在互動中學、以行動數計效率』，正是 2019 論文 III.2 第 4 條限制的實作」，以及「harness 設定改變分數幅度可達數十個百分點，報分數必須連同 harness 一起報」。

---

### Understanding and Benchmarking Artificial Intelligence: OpenAI's o3 Is Not AGI（Pfister & Jud，2025）
- 網址：https://arxiv.org/abs/2501.07458 （讀 PDF v1，2025-01-13）
- 讀取狀態：✅
- 讀取紀錄：pdftotext 全文約 47k 字元、572 行；§3（ARC-AGI 作為 AGI benchmark 的適切性）與 §5（結論）由 Exa 搜尋結果全文段落讀取，其餘 Abstract、§1、§2（行 1–215）與 §4（行 331–結論前）由 PDF 文字讀完；腳註與參考文獻略讀。
- 類型：研究論文（立場／分析論文，無實驗）
- 研究設計或文件目的：以 Chollet 的技能／智能區分為基礎，提出新智能定義，並論證 ARC-AGI 題型結構使其能被「大量試誤預定義操作的組合」解出，因此 o3 的高分不代表智能。
- 會被引用的結果：
  - 定義：“an agent is the more intelligent, the more efficiently it can achieve the more diverse goals in the more diverse worlds with the less knowledge.”（§2）
  - 核心批評一（題型）：ARC 每題都是「從小而有限的 core knowledge 操作集合中選出並組合出最簡轉換規則」，等於問題表徵已預先給定，“AI approaches can solve ARC-AGI by relying only on the exploitation of a given problem representation, without the need for exploration”。（§3）
  - 核心批評二（可驗證）：示範對可用來檢查候選規則，“ARC-AGI allows, within the limited computational resources, for unrestricted trialling of possible transformation rules”，而真實世界多半只能試一次（咖啡機、開車例）。（§3）
  - 其他弱點：不計訓練成本（2024 參賽者用大量人工生成的 ARC 題訓練）；私有集可被重複提交數百次探測；“ARC-AGI appears to be subject to Goodhart’s Law”。（§3、§4）
  - 結論：“The analysis of ARC-AGI has shown that it cannot serve as a benchmark for general intelligence”；o3 的 87.5% 估計成本 $346,000（每題 $3,460），“o3’s performance on ARC-AGI is not due to intelligence but due to the application of knowledge and computing resources that together enable an effective search”。（§5）
  - 提案：以隨機生成、彼此差異極大的模擬世界（如火星機器人、四維氣態行星）做 benchmark，不以人類 core knowledge 為前提。（§4）
- 作者自己列的限制：新 benchmark 只是構想，“Many more details of the benchmark have to be specified and it has to be implemented in practice”；生成的世界仍受可形式化、算力、人類想像力限制，可能被專屬技能攻略。
- 與摘要說法不一致處：摘要說 ARC 題 “can be solved by massive trialling of combinations of predefined operations”，但正文沒有提出實證（沒有跑搜尋實驗），論據是題型分析加引用 2020 年暴力搜尋與 o3 成本；o3 成本數字是 ARC Prize 部落格原始估價，後已改為 $456,000／$4,560（見 o3 附錄），作者論點方向不受影響但數字已過時。**利益關係**：兩位作者隸屬 Lab42（曾與 Chollet 合辦 2022、2023 ARCathon，ARC Prize 2024 報告致謝名單有 Pfister 與 Jud），並非完全獨立的外部評論者。
- 反證或後續修正：ARC Prize 自己在 ARC-AGI-2 改為「less brute-forcible」，在 ARC-AGI-3 改以行動數計分並明說 “It penalizes “brute-forcing””、自動驗證要求隨機策略過關率低於 1/10,000——等於部分採納「可無限試誤」的批評。但 ARC-AGI-3 仍以人類 core knowledge 為前提，與 Pfister & Jud「不該以人類為參照」的主張相反。
- 對系列的用途：支撐「ARC 作為智能測驗的批評：可驗證、可試誤、表徵預先給定，讓大規模搜尋能拿高分」，並可對照 ARC-AGI-3 如何回應。

---

### 補搜精讀：Your Reasoning Benchmark May Not Test Reasoning: Revealing Perception Bottleneck in Abstract Reasoning Benchmarks（Wang et al.，2025）
- 網址：https://arxiv.org/abs/2512.21329 （讀 PDF v2，2026-01-09）
- 讀取狀態：✅
- 讀取紀錄：pdftotext 全文約 42k 字元、886 行；依序讀完 Abstract、Introduction、Related Work、§3 兩階段方法與四類錯誤歸因、§4 實驗（Setting 1、2、錯誤歸因）、結論、Limitations；參考文獻略讀。
- 類型：研究論文（實驗）
- 研究設計或文件目的：檢驗「VLM 在 ARC 類題目落後人類是因為推理不足」的解讀。把每張圖獨立轉成自然語言描述（感知階段，避免跨圖歸納線索洩漏），再讓模型用描述推理，與端到端單階段比較；資料集為 Mini-ARC、ACRE、Bongard-LOGO。
- 會被引用的結果：
  - Setting 1（同一模型做感知與推理）：成功率提升 11–13 個百分點；Mini-ARC（GPT-4o）8.05% → 20.13%（約 2.5 倍），Bongard-LOGO 62.00 → 73.00，ACRE（LLaVA-1.5）22.00 → 34.50（Table 2）。
  - Setting 2（強模型感知＋GPT-4o 推理）：Mini-ARC o1 感知＋GPT-4o 推理 31.54%，o1 單階段 52.03%；Claude Sonnet 4.5 感知＋GPT-4o 推理 32.89%，Sonnet 4.5 單階段 34.22%（Table 4）。原句：“perception constitutes the main bottleneck explaining the performance difference between the strong model (d*) and the weak model (a).”
  - 錯誤歸因（Table 5）：Mini-ARC 單階段感知錯誤（示範＋測試）86.4%＋2.3%、兩階段 59.5%＋5.4%。摘要：“approximately 80 percent of model failures stem from perception errors.”
  - 結論：“ARC-style benchmarks conflate perceptual and inductive challenges, potentially overstating deficiencies in model reasoning.”
- 作者自己列的限制：自然語言不是最佳或標準的中介表徵；錯誤歸因靠人工檢查、有主觀性；結論只限 ARC 類知識輕量視覺抽象題與所測 VLM。
- 與摘要說法不一致處：(1) 標題與摘要針對「ARC 與 ARC-AGI」，但實驗沒有用 ARC-AGI-1/2 本身，只用 Mini-ARC（簡化版）與兩個非 ARC 資料集。(2) 「約 80% 失敗來自感知」只對應單階段設定的大致範圍（Mini-ARC 約 89%、Bongard 約 84%、ACRE 約 84%），兩階段設定下 Bongard 約 48%、Mini-ARC 約 65%。(3) o1 在 Mini-ARC 的落差作者自己解釋為可能的訓練資料污染，屬推測。(4) 錯誤歸因樣本只有每設定 50 或 100 題。
- 反證或後續修正：同方向的 Hu et al.〈ARC Is a Vision Problem!〉（arXiv 2511.14761，ARC Prize 2025 榮譽提名，未精讀）以視覺架構在 ARC-AGI-1 達近人類水準。反方向：ARC Prize 2025 報告認為前沿推理模型受限於「知識覆蓋」而非感知，兩種解讀未直接對質。到 2026 年前沿模型在 ARC-AGI-2 已 90%+，感知瓶頸對最新模型的重要性未知。
- 對系列的用途：支撐「ARC 分數低不一定代表推理差：輸入呈現方式（2D 圖 vs. 序列化 JSON）本身就是混淆變因」，可在專文的批評段與「人機公平比較」段使用。

---

## 補搜紀錄

**查詢（2024 年以後的更新）**
1. Exa：「ARC Prize 2025 technical report results ARC-AGI-2 winners」→ 找到 ARC Prize 2025 技術報告（2601.10904）、2025 結果部落格、2025 競賽頁、一篇 living survey（2603.13372）。收：技術報告（屬任務指定的「2026 年度總結」範圍，已精讀）；survey 不收（二手綜述，無新一手數據）。
2. Exa：「ARC-AGI-3 technical paper interactive benchmark scoring action efficiency human baseline」→ 技術報告 PDF、arXiv v1、計分文件、人類資料部落格、30 天預覽部落格。收：前四者（任務指定）；30 天預覽部落格內容已被技術報告 §6 摘要，未另讀。
3. Exa fetch：arcprize.org/leaderboard、/competitions/2026、/blog 索引 → 取得 2026-11 現況與部落格清單；依清單補讀 Astra 部落格（2026-09-03，解釋 harness 政策轉變，屬「排行榜現況」必要脈絡）。
4. Exa：「arcprize.org blog GPT-6 Astra ARC-AGI-3 standard harness provider adapter」→ Astra 部落格、Astra 結果頁、The New Stack 報導（只看摘錄，未收）。

**查詢（criticism / limitations / flaws）**
5. jina `search_web` 三組查詢（criticism、brute force／synthetic data、ARC-AGI-3 criticism）→ 失敗：Jina API key 額度用盡（“This key is out of quota”）。改用下一層 Exa。
6. Exa：「critique paper arguing ARC-AGI does not measure fluid intelligence, solved by scaling synthetic data or brute-force search ...」→ 結果：Pfister & Jud（2501.07458）、Wang et al. 感知瓶頸（2512.21329）、UnlikelyAI Lab 部落格〈Are AI Benchmarks Slowing Real Progress?〉、Wu et al. NAACL 2025〈Understanding LLMs’ Fluid Intelligence Deficiency〉、Mitchell 等〈Distinguishing Performance From Competence ...〉（2510.02125）、Seeth 部落格。
   - 收 Pfister & Jud 作為任務指定的「一篇一手批評」：唯一直接論證「ARC 題型可被大規模試誤攻破」的論文。注意作者與 ARC 生態有關聯（Lab42）。
   - 收 Wang et al. 作為補搜第 1 篇：提出不同於「可被搜尋攻破」的另一種效度批評（感知混淆），有實驗數據，2025-12 發表。
   - 不收 UnlikelyAI 部落格精讀：論點（TTT＋合成資料只是利用比賽格式、NVARC 提升的是技能不是效率）有價值，但屬企業部落格、無新數據；只讀到搜尋摘錄，若專文要引用「TTT 不算真正適應」的觀點可再補讀全文。
   - 不收 Mitchell 等 2510.02125：與 ConceptARC 相關、看規則是否真的抓到概念，跟本批主題相關但補搜名額已用完；建議 A 或 D 批若需要「performance vs. competence」論點時再精讀。
   - 不收 Wu et al. NAACL 2025：主題是 LLM 在 ARC 上的流體智力缺陷分析，與 ARC Prize 報告結論方向相同，未提供反證。

**結論是否被更新或推翻**
- 2019 論文「ARC 無法被現有 ML 方法處理」：已被推翻（2024 TTT 55.5%、o3 87.5%、2026 前沿模型 ARC-AGI-1 98.5%）。作者群自己承認 ARC-AGI-1/2 都出現「知識型過擬合」。
- 「技能分數可被 priors／資料買到」：2025–2026 年作者群再度援引並延伸到「合成整個題型分布」與「harness 注入人類策略」，核心論點未被推翻，反而成為改版理由。
- ARC-AGI-2「抗暴力搜尋、人類容易 AI 難」：受限算力 Kaggle 組 2025 年最高 24%，但 API 前沿模型 2026-11 已達 95.8%，ARC-AGI-2 實質飽和。
- ARC-AGI-3「行動效率是人機分界」：作者原本假設如此，2026-09 Astra 部落格承認前沿模型在 Provider Adapter harness 下行動效率已超過人類中位數；Standard harness 下最高 81.2%，仍未滿分。

## 寫作時要特別注意的地方
- o3 每題成本有三個版本（$17–20／$26／$200 對應低算力；$3,460／$4,560／$20,000 對應高算力），要註明定價假設或只寫倍數。
- 「100% 人類可解」在 ARC-AGI-2/3 都是「每題至少兩位一般受試者解出」，不是「多數人能解」；ARC-AGI-2 全部嘗試成功率 62%–66%。
- ARC-AGI-3 計分公式有 v1（2026-03）與 2026-04 修訂兩版；官方排行榜的 harness 政策 2026-09 後改成兩種 harness 並列。
- 排行榜數字是 2026-11-23 讀取的快照；ARC Prize 2026 結果 12-04 才公布。
