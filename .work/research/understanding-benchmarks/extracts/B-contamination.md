# 批次 B：資料污染（contamination）抽取紀錄

精讀日期：2026-11-23。工具：Exa `web_fetch_exa` 為主；ConTAM 與 Sun et al. 兩篇補搜論文用 Exa 搜尋只拿到摘要片段，全文改用 `curl` 抓 arXiv HTML 後去標籤閱讀；EMNLP 綜述 Table 2 的符號另用 `curl`＋`pdftotext -layout` 補讀。LiveBench 2.0 方法論頁是 SPA，Exa 只抓到排行榜，改用 `curl` 下載 `livebench.ai/static/js/main.7ddd6ae5.js` 取出方法論文字。

---

### Are LLM Benchmarks Already Contaminated? A Systematic Review of Contamination Detection Methods（2026）
- 網址：https://doi.org/10.18653/v1/2026.gem-main.50 → https://aclanthology.org/2026.gem-main.50.pdf （GEM 2026 workshop，pp. 518–539，Nourbakhsh et al., UTSA）
- 讀取狀態：✅
- 讀取紀錄：Exa 回傳約 95,000 字元，存檔後一次讀完 0–95,025（正文 §1–§9、Limitations、Ethics、References、附錄 A–G 全部）。PDF 轉文字時 Table 2、Table 4/5、Table 6、Table 8 的欄位被打散，靠上下文重組；表內數字與正文一致的才採用。
- 類型：研究論文（系統性文獻回顧）
- 研究設計或文件目的：PRISMA 式文獻回顧，2020-01 至 2025-12 在 ACL Anthology、arXiv、OpenReview、Google Scholar 搜尋，812 筆 → 去重 645 → 全文審 124 → 納入 55 篇（Table 4）。不做統合分析（meta-analysis），而是按「量測家族」（TS-Guessing 命中率、likelihood AUC、ConStat/TED 等 benchmark 層級差值）分層呈現證據；另提出自訂的偏誤風險工具 RoB-LLM-Contam（六個面向，low/some/high）。貢獻：四層污染分類 T1–T4、五類偵測法比較、四個 benchmark 的證據彙整、緩解策略比較、Contamination Transparency Card（CTC）揭露框架。
- 會被引用的結果：
  1. **四層分類**（§3、Table 1/2）：T1 Exact（逐字或近逐字出現在訓練語料）、T2 Syntactic（換句話說、選項重排、同義詞替換後出現，n-gram 過濾抓不到）、T3 Semantic（無字面重疊但語意等價，主要是翻譯污染）、T4 Task-level（沒看過題目本身，但大量訓練過同格式同類型題）。判定規則是「取證據支持的最嚴重層」。原文："T4 contamination is theoretically indistinguishable from legitimate generalization."（§3.5）。表中的可偵測度：T1 High、T2 Medium、T3 Low、T4 Very Low（Table 2）。另一軸是 input-only（只看過題目）與 input-label（題目和答案都看過）。
  2. **五類偵測法與失效模式**（§4、附錄 C、Table 6）：
     - 字串比對（white-box，要語料）：只保 T1；"provides only illusory safety"，改寫就能繞過（附錄 C.1）。
     - Likelihood 類（gray-box，要 log-prob）：常見高頻文字本來就低困惑度，易誤判；選擇題格式下訊號弱（附錄 C.2）。
     - Membership inference（gray-box）：單筆層級 "perform near random guessing (ROC-AUC < 0.6) on properly constructed evaluations"，原因是大模型多半只訓練一個 epoch；用時間切分建資料集時，可能量到的是寫作風格的分布差異而不是成員身分（附錄 C.3）。文件層級較可行，ROC-AUC 可到 0.86（Meeus et al. 2024）。
     - LLM 提問式（black-box，只要 API）："heuristic, gameable, and less calibrated"、沒有效果量；TS-Guessing 不適用於開放式生成題（§4.4、附錄 C.4）。
     - Benchmark 層級稽核（ConStat、時間切分）：唯一能涵蓋 T1–T4 的家族，但需要參考 benchmark 與「假設乾淨」的參考模型，只能看母體層級、事後回推（Table 6）。
     - 共同盲點：指令微調（IFT）階段的污染，Table 6 的 IFT 欄除 benchmark 稽核（有參考集時才部分可行）外全是 No；結論寫 "remains undetectable by all evaluated methods (Samuel et al., 2025)"（§9）。
  3. **MMLU**（§5、附錄 B.1）：GPT-4 在 TS-Guessing 猜中被遮蓋選項 57%（隨機 25%；ChatGPT 52%）；ITD 去污染後 MMLU 灌水最多 19.0%，Phi-3 −6.7%、Mistral −3.6%；Open LLM Leaderboard 前三名 7B 模型 ConStat 效果量 > 10%；6.5% 題目標準答案有錯（Gema et al. 2025）。
  4. **GSM8K**（附錄 B.2）：GSM1k 落差最多 8%；ConStat 對 InternLM-2-Math-7B 估計 27.15%（主估計）／40%（替代設定的敏感度估計）；Qwen、Aquila、InternLM 測試集困惑度異常低（Xu et al. 2024）。
  5. **HumanEval**（附錄 B.3）：Qwen2.5-Coder 技術報告自承 10-gram 碰撞並移除；LiveCodeBench 上 DeepSeek-Coder 過了訓練截止日後表現下滑。
  6. **HellaSwag／PIQA**（附錄 B.4）：至少兩種獨立方法都標記；ConStat 效果 6–11%。
  7. **6%–40% 灌水估計的對照條件**（Abstract、§2.4、§9、Limitations）：這個區間是把不同方法、不同 benchmark、不同模型的數字拼起來的範圍，下限約對應 HellaSwag 的 ConStat 6%，上限是 InternLM-2-Math-7B 在 GSM8K 的 ConStat **敏感度**估計 40%（主估計是 27.15%）。作者自己寫：原文 "these values are not directly comparable across methods or task families and should be interpreted as medium-confidence, setting-specific estimates."（§2.4）以及 "we report setting-specific effect families (rather than pooled point estimates)"（Limitations）。不能讀成「benchmark 分數普遍灌水 6–40%」。
  8. **緩解策略**（§6、附錄 D）：n-gram 過濾只防 T1；LLM 語意去污染可補 T2 但成本是 O(|D|×|B|)；加密測試集（Jacovi et al. 2023）擋不住已被爬走的資料；ITD 改寫是「每個模型各考一份不同的考卷」，"ITD undermines the apples-to-apples comparability required for standardized leaderboards"（§6.2），排行榜情境應改用 MMLU-CF、GSM1k 這類固定的無污染版本；動態／滾動更新 benchmark 是 T3/T4 最強的預防手段（§6.3）。
  9. **CTC 五欄**（§7、Table 3）：Training Data（語料名稱版本、截止日、去重、token 數）、Decontamination（方法、n-gram 門檻、是否做語意檢查、比對了哪些資料集、已知失效模式）、Evidence Provided（n-gram 重疊、likelihood 檢定、ConStat/TED 等表現層級稽核、已知污染的 benchmark）、IFT Stage（微調資料組成、是否含 benchmark、答案擴增策略）、Reproducibility（prompt 模板、few-shot 數量與順序、評分流程、多次執行變異、生成參數）。原文："absence of contamination evidence is not evidence of absence."（§7）。附錄 E 以 Llama 2 技術報告示範：Evidence Provided 與 IFT Stage 兩欄 Missing。
- 作者自己列的限制：只涵蓋到 2025 年底；分類法只是一種組織方式；沒做原始實驗，全靠各論文自述；各證據的效果量定義不同、多數沒有可合併的不確定區間，因此不是正式 meta-analysis；不少來源是未經同儕審查的 preprint，結論應視為暫定；英文 benchmark 覆蓋多於其他語言（附錄 G）。
- 與摘要說法不一致處：
  1. 摘要說納入 55 篇，§1.4 正文寫 "The final synthesis corpus contains more than 50 studies"（數字一致但正文用語模糊）。
  2. **GSM1k 相關係數引錯**：本文多處寫 "Spearman ρ = 0.60 (ρ² = 0.36)"（§1.2、§3.5、Table 2），但 GSM1k 原論文正文是 "a Spearman's rank correlation of 0.36"（§5.4），摘要寫成 "Spearman's r² = 0.36"。原論文本身用語就不一致，本文再把 0.36 當成 ρ² 開根號得到 0.60，這個 0.60 在原文中找不到。引用時用原文的 0.36（p=0.03）。
  3. **ITD 的 22.9%／19.0% 出處張冠李戴**：本文把 "ITD reduces inflated accuracy by 22.9% on GSM8K and 19.0% on MMLU" 歸給 Dong et al. (2024)（§1.2、§6.2），附錄 C.2 又把同一組數字說成 TED 的結果。查 ACL Anthology：這組數字出自 Zhu et al. (2024)〈Inference-Time Decontamination〉（https://aclanthology.org/2024.findings-emnlp.532/ ）；Dong et al. (2024) 是 CDD/TED，摘要寫的是 TED "mitigates performance improvements up to 66.9%"（https://aclanthology.org/2024.findings-acl.716/ ）。
  4. **「13B 模型用改寫題微調就達 GPT-4 水準」出處錯**：本文歸給 Dekoninck et al. (2025)（§3.3、附錄 C.1），但這是 Yang et al. (2023)〈Rethinking Benchmark and Contamination for Language Models with Rephrased Samples〉的結果（https://arxiv.org/abs/2311.04850 ：Llama-2-13B 在改寫後的 MMLU 測試集上訓練可到 85.9，n-gram 抓不到；並在 RedPajama、StarCoder-Data 找到 8–18% HumanEval 重疊）。「LLM 語意去污染套用在 Pile、RedPajama、Dolma」同樣應是 Yang et al.。
  5. HellaSwag 的 ConStat 6–11%：附錄 B.4 說是 "across all three top-ranked Leaderboard models"，附錄 C.5 說是 "across all three InternLM 7B variants"，兩處對象不同。
  6. LiveBench 的描述（附錄 D.2）："top models below 65% accuracy"，與 LiveBench 最新版（v2, 2025-04）摘要的 "below 70%" 不同，且仍稱 "contamination-free"，原論文 v2 已改名 "Contamination-Limited"。
  7. ConStat 的 27.15%／40% 我沒有回到 ConStat 原論文核對，只確認本文內部前後一致。
- 反證或後續修正：
  - 偵測法不可靠的獨立佐證：Samuel et al. (COLING 2025, https://aclanthology.org/2025.coling-main.338/ ) 五種方法、四個模型、八個資料集，"Limited consistencies between SOTA contamination detection techniques"；Fu et al. (NAACL Findings 2025, https://aclanthology.org/2025.findings-naacl.291/ ) 回顧 50 篇，MIA 在預訓練資料上接近隨機。
  - 2026-06 的 arXiv 2606.03305〈The Reliability Gap in Benchmark Auditing〉（只讀到搜尋摘要）稱 335 次稽核中只有 201 次結果正確，方向一致。
  - 沒有找到推翻本文主要結論的研究；問題在引用錯誤（見上）。
- 對系列的用途：支撐「污染」篇的分類（T1–T4，以及為什麼 T4 幾乎無法與真正的泛化區分）、「偵測法各自的盲點」，以及檢查表的「揭露清單」（CTC 五欄可直接改寫成自建 benchmark 時要記錄的項目）；引用 6–40% 時必須附上「跨方法拼湊的範圍，上限是敏感度估計」的條件，具體數字請改引原始論文。

---

### Benchmarking Large Language Models Under Data Contamination: A Survey from Static to Dynamic Evaluation（2025）
- 網址：https://aclanthology.org/2025.emnlp-main.511.pdf （EMNLP 2025 main，pp. 10080–10098，Chen et al., Columbia/NUS 等）
- 讀取狀態：✅（Table 2 的「完全支持」符號在 Exa 與 pdftotext 都抽不出來，靠欄位位置推回，見下）
- 讀取紀錄：Exa 回傳約 87,400 字元，一次讀完 0–87,449（§1–§6、Limitations、Ethics、References、附錄 A–D）。Table 2 另用 `pdftotext -layout` 讀第 6 頁核對欄位位置。
- 類型：研究論文（綜述）
- 研究設計或文件目的：整理靜態 benchmark 的污染補救法與限制，並把動態 benchmark 的設計抽象成六項評估準則；作者表示回顧了 50 篇以上動態 benchmark 論文，檢查它們怎麼評估自己。附錄 A 有一個小型概念驗證實驗。
- 會被引用的結果：
  1. **污染定義**（§2.1）：exact（同一筆資料同時出現在訓練與測試集）與 syntactic（經過標點、空白、同義詞、詞形、句法改寫後出現）。作者承認 syntactic 算不算污染有爭議，"it is difficult to separate memorization from reasoning"，本文選擇算進去。
  2. **靜態 benchmark 的四種補救與限制**（附錄 C）：
     - Canary string（BIG-bench）：要靠訓練方自律，"If a developer aims to leak benchmarking data to boost scores, this method will not work."（C.1）
     - 加密（Jacovi et al. 2023、TRUCE 私密運算）：依賴金鑰管理、有額外運算成本，金鑰外洩就失效（C.2）。
     - 標籤保護（GLUE、SuperGLUE 不公開測試集答案）："limits transparency and independent verification"，研究者只能依賴中央評測，難做錯誤分析與重現（C.3）。
     - 事後偵測（n-gram、embedding 相似度、遮罩、補全、偏好原句）：常拿不到訓練語料；「污染題困惑度較低」這類假設在不同模型、任務上不一定成立（C.4）。
     - 總結：因為「無法驗證資料是否已外洩」，這些補強採用有限，所以研究轉向動態 benchmark（§1）。
  3. **動態 benchmark 的形式定義**（§4.1）：B_dynamic = (D, T(·))，每個時間點 t 的評測集 D_t = T_t(D)；種子集 D 為空時就是從零生成。
  4. **六項設計準則**（§4.3）：
     - Correctness：生成資料與真值的一致度；保證不了正確性，"may provide a false sense of reliability"。
     - Scalability：每單位成本（金錢、時間、人工）能產生多少題；題目太少，統計誤差就大。
     - Collision：兩次獨立轉換產生的題目重疊率（Collision Rate），以及要幾次轉換才會重現某一版（Repeat Trials）。這項針對的是「生成演算法公開之後，有人拿它產生的題目去訓練」。
     - Stability of Complexity：各版本複雜度的變異數；複雜度不穩，分數下降就分不清是污染消失還是題目變難。
     - Diversity：外部多樣性（和種子集的差異）、內部多樣性（各版本之間的差異）。
     - Interpretability：轉換過程可解釋，就能少做人工驗證；規則式天生可解釋，用 LLM 轉換的就要另加人工審核。
  5. **四類動態方法及限制**（§4.4）：
     - 時間切分（LiveBench、LiveCodeBench、AntiLeak-Bench、AcademicEval、LiveAoPSBench、ForecastBench）：要持續投入人力；"using recent information from competitions to evaluate LLMs can still lead to data contamination, as these problems are likely to be reused in future competitions"；"Verification is often overlooked in these live benchmarks (White et al., 2024)."
     - 規則生成（GSM-Symbolic 模板、S3Eval 隨機 SQL 表、DyVal 隨機 DAG、NPHardEval）：碰撞機率極低，但規則限制了多樣性，而且公開的規則產生的題目可能造成 "in-distribution contamination during training (Tu et al., 2024)"。
     - LLM 生成（改寫既有題、互動式出題、多代理）：品質不確定，LatestEval 人工標註發現 10% 樣本不忠實或無法作答；互動式評測的可靠度取決於出題的 LLM。
     - 混合式（LatestEval、DARG、C²LEVA）。
  6. **Table 2：現有動態 benchmark 沒有一個六項全滿**（§4.2）。依版面位置推回 LiveBench 的評分：Correctness 支持、Scalability 部分、Collision 部分、Stability of Complexity 不支持、Diversity 不支持、Interpretability 支持。（「支持」那格的實心符號在兩種抽取方式都是空白，「部分」顯示為 G#、「不支持」為 #；我依附錄 D 的判定規則「時間切分天生保證正確性」推定空白＝支持。這是推論，引用前要看 PDF 原圖確認。）
  7. **附錄 A 概念驗證**（Table 3）：故意把 HumanEval 洩漏 0%–100% 給三個小模型做微調。Llama-3.2-1B 在 HumanEval 從 0.19（0%）升到 0.82（100%），在動態版 DyCodeEval 則是 0.14 → 0.11；Llama-3.2-3B 0.28 → 0.87 對 0.25 → 0.18；DeepSeek-Coder-1.3B 0.41 → 0.62 對 0.41 → 0.07。原文："on the dynamic DyCodeEval, even when a model is overfitted on one version, it maintains stable accuracy scores across different versions."
  8. **結論**（§6）："static methods, though consistent, become more vulnerable to contamination as training datasets grow. While dynamic methods show promise, they face challenges in reliability and reproducibility."
- 作者自己列的限制：領域變化快，可能漏掉新方法；六項準則只是第一步，需要實際驗證；偏重高層概念，缺實作細節。
- 與摘要說法不一致處：
  1. 附錄 A 的說法比表中數字樂觀：正文說模型在 DyCodeEval 上 "maintains stable accuracy"，但 DeepSeek-Coder-1.3B 從 0.41 掉到 0.07～0.16，Llama-3.2-1B 從 0.14 掉到 0.07～0.11，都是明顯下滑，並不穩定。比較合理的讀法是「靜態分數被灌高、動態分數沒有跟著灌高（甚至因為過擬合而下降）」，不是「動態分數穩定」。另外這個實驗只用三個 1–3B 小模型，DyCodeEval 也是第一作者自己的方法（Chen et al. 2025）。
  2. 摘要說提出 "optimal design principles"，正文 Limitations 說準則只是 "a first step and may need further refinement"，兩者口氣不同。
  3. MMLU-CF 被歸類為「規則式模板生成」，描述是「打亂選項並把錯誤選項隨機換成 None of the other choices」；GEM 綜述則把 MMLU-CF 描述成五步驟的去污染重寫流程（從 270 萬候選題開始）。兩篇對同一個 benchmark 的描述重點不同，引用 MMLU-CF 時要回到原論文。
  4. 其餘逐項對過，沒有其他不一致。
- 反證或後續修正：Sun et al. (2025, arXiv 2503.16402，本批補讀，見下) 以受控實驗檢驗 20 種「更新既有 benchmark」的策略，發現沒有一種在所有 benchmark 上的抗污染力顯著優於「完全不改」，並且沒有一種能同時兼顧忠實度與抗污染力。這直接削弱了本綜述歸在「LLM-based benchmark rewriting」那一類方法（ITD 等）的效力；不過 Sun et al. 沒有檢驗時間切分類與規則生成類。
- 對系列的用途：支撐檢查表的「防污染」段，給出靜態補強四招各自的代價（特別是 canary string 防不了蓄意作弊、標籤保護犧牲可驗證性），以及自建動態 benchmark 時要檢查的六項準則（尤其是 Collision 與 Stability of Complexity：分數下降時要能分辨是污染被拿掉，還是題目變難了）。

---

### A Careful Examination of Large Language Model Performance on Grade School Arithmetic（GSM1k；2024）
- 網址：https://arxiv.org/html/2405.00332 （最新版 HTML，Exa 標示 2024-11-22；v1 為 https://arxiv.org/abs/2405.00332v1 ；NeurIPS 2024 Datasets & Benchmarks）
- 讀取狀態：✅
- 讀取紀錄：最新版 HTML 約 119,000 字元、744 行。0–120 行（本文 §1–§6）用 Read 讀完；120–162 行是參考文獻（略讀）；163–744 行（附錄 A–M：checklist、資料集文件、標註說明、prompt、Table 1/2 全模型結果、50 題範例、圖說、人工抽答案消融、few-shot 消融、HF 模型清單）用 awk 逐段讀完。v1 摘要與 §1–§6 另由 Exa 讀到，用來比對版本差異。
- 類型：研究論文
- 研究設計或文件目的：Scale AI 雇用人工（不使用任何 LLM）重新出 1,205 題，風格與難度對齊 GSM8K，做成「GSM8K 的未公開複製測試集」，比較各模型在 GSM8K 與 GSM1k 的落差，用來量測過擬合／污染。比照 Recht et al. (2019) 重建 ImageNet／CIFAR-10 測試集的做法。
  - 對齊難度的方法：依解題步驟數分配出題數量；再依答案大小分布從 1,375 題篩到 1,205 題（§3.2）。
  - 驗證可比性：19 位標註者在「4 題 GSM8K＋1 題 GSM1k」中找出新題的成功率 21.83%（隨機 20%）；14 位標註者 15 分鐘內解出 GSM8K 4.07±0.93 題、GSM1k 4.36±1.11 題（GSM1k 可能略簡單）；GSM8K 發布前就訓練完成的 GPT-NeoX-20B、GPT-2 在兩邊沒有明顯差異（§3.2.1–3.2.3）。
  - 品質管控：三層審核，2,108 題 → 1,419 題通過「第二人獨立解題答案一致」→ 1,375 題通過品質稽核（§3.1）。成本約 18 萬美元（附錄 B）。
  - 評測：EleutherAI LM Evaluation Harness 的 fork，5-shot（範例從 GSM8K train 抽），開源模型 temperature 0，最大生成長度 1000 tokens；API 模型的查詢時間是 2024-04-16 至 07-10（§4）。
- 會被引用的結果：
  1. **最大落差 8 個百分點**（摘要、附錄 F Table 1）：Yi-6B-Chat 在 GSM8K 43.7%、GSM1k 35.7%（差 0.080，z=4.135）；math-shepherd-mistral-7b-rl 82.6% 對 75.4%（0.072）；Xwin-Math-13B 0.064；phi-2 0.063；Meta-Llama-3-8B-Instruct 0.062。原文："we observe accuracy drops of up to 8%, with several families of models showing evidence of systematic overfitting across almost all model sizes."
  2. **落差最大的模型家族**（§5.1）：原文 "Several families of models, including the Phi and Mistral families of models, show systematic tendencies to perform stronger on GSM8k compared to GSM1k for almost every release and scale of models. Other model families, such as Yi, Xwin, Gemma and CodeLlama also show this pattern to a lesser extent."
  3. **前沿模型幾乎沒有落差**（§5.2、Table 1）：gpt-4o 0.002、gpt-4-turbo 0.003、gpt-4 −0.012、claude-3-opus −0.022、gemini-1.5-pro 0.005～0.006、mistral-large −0.001。作者偏好的解釋是「夠強的模型即使看過 GSM8K 也能推廣到新題」，證據是 Mistral 家族裡只有 Mistral Large 沒有落差。
  4. **過擬合的模型仍然會推理**（§5.3）：phi-2 落差約 6%，但在 GSM1k 仍解出一半以上，和參數多 25 倍的 Llama2-70B 相當。
  5. **「會不會背出 GSM8K」與落差的相關**（§5.4）：用每字元平均 log-likelihood 當「模型生成 GSM8K 測試題的機率」，與 GSM8K－GSM1k 落差的 Spearman 等級相關 0.36（p=0.03）；Pearson r²=0.26；Kendall τ=0.29。原文："We observe a Spearman's rank correlation of 0.36 between the per-character log-likelihood of generating GSM8k and the performance gap between GSM8k and GSM1k (p=0.03)"。
  6. **污染不是唯一解釋**（§5.4）：最過擬合之一的 Math-Shepherd-Mistral-7B-RL 對 GSM8K 的 log-likelihood 反而偏低，作者推測是 process reward model 的合成資料洩漏了解題鏈；Llemma 的訓練語料確實含少量 GSM8K 題目，但沒有過擬合。原文："overfitting on GSM8k is not purely due to data contamination, but rather may be through other indirect means, such as model builders collecting data similar in nature to benchmarks as training data or selecting final model checkpoints based on performance on benchmarks ... Conversely, the reverse is also true: small amounts of data contamination do not necessarily lead to overfitting."
  7. **OpenLLM Leaderboard 上的不知名模型**（§4）："discover evidence of Goodhart's law: many of these models perform substantially worse on GSM1k"。
  8. **防污染設計：預先承諾的延後公開**（§3）：不公開資料集，承諾在「三個不同基底血統的開源模型達到 95%」或「2025 年 6 月」（取較早者）時公開；另保留少量通過品管、但不放進正式集的題目，用來偵測經 API 外洩。原文："We encourage future benchmarks to follow a similar pattern, where they are not released publicly lest they be gamed, but are precommitted to be released at a future date or upon a future condition."
- 作者自己列的限制：GSM1k 與 GSM8K "only highly similar, but not identically distributed"（§3）；難度用 calculator 標記數估計，只是粗估（§3.2）；分數高度依賴 prompt，採用統一設定，因此部分模型的 GSM8K 分數低於官方公布值（§4）；自動抽答案會誤判格式，人工抽答案的消融顯示落差結論不變，但絕對分數會變（附錄 J，例如 Claude 3 Opus 的 GSM1k 從自動 0.825 變成人工 0.952）；替代 prompt 下「哪個家族過擬合」大致相同，但個別數字差很多（附錄 E、K）；評測閉源模型時必須透過 API 把題目送出去。
- 與摘要說法不一致處：
  1. **版本差異（最重要）**：v1（2024-05）摘要是 "accuracy drops of up to 13%"、"Spearman's r²=0.32"、1,250 題、"several families of models (e.g. Phi and Mistral)"，承諾在 2025 年底公開，並說 Llama2 家族各尺寸都幾乎沒有過擬合；最新版改為 8%、0.36、1,205 題、2025 年 6 月公開。附錄 G 也自承前一版誤放了非最終版的題目。引用時要註明版本，網路上流傳的「13%」是舊版數字。
  2. **相關係數的寫法自相矛盾**：摘要與 §1 寫 "Spearman's r² = 0.36"，§5.4 寫 "Spearman's rank correlation of 0.36"，接著又說 outliers "cause the r² = 0.36 value to be relatively low"。0.36 究竟是 ρ 還是 ρ²，原文沒有一致的說法；依 §5.4 的完整敘述（另列 Pearson r²=0.26、Kendall τ=0.29），較可能是 ρ = 0.36。GEM 綜述把它寫成 ρ=0.60，是錯讀。
  3. **「Mistral 家族系統性過擬合」比表格說得強**：Table 1 標準 prompt 下 Mistral-7B-v0.1 落差 0.027（p=0.078）、Mistral-7B-Instruct-v0.1 0.025（p=0.095）、v0.2 0.009（p=0.319），單看都不顯著；顯著的是 Mixtral-8x7B（p=0.038）、mistral-medium（p=0.018）、math-shepherd（Mistral 衍生）。「家族」結論是看整體模式，不是每個成員都顯著。
  4. **替代 prompt 下結論會變**：Table 2 中 deepseek-math-7b-rl 從 −0.031 變成 +0.064（p<0.001），gemini-1.5-pro-0409 從 0.005 變成 0.035（p=0.002）。換 prompt 會讓個別前沿模型也出現顯著落差，正文的「前沿模型沒有過擬合」只在標準 prompt 下成立。
- 反證或後續修正：
  - 資料集已公開：Hugging Face `ScaleAI/gsm1k` 有 1,205 列（https://huggingface.co/datasets/ScaleAI/gsm1k ，Exa 搜尋結果頁顯示列數）。公開日期 2025-03-31 只見於第三方 Benchmark Almanac，未在官方來源核對。公開之後，GSM1k 本身也可能進入新模型的訓練資料，2025 年以後的 GSM1k 分數不再具有「未污染」的保證。
  - Scale 的 SEAL Math 排行榜頁標示「Deprecated (as of January 2025)」，頁面寫的是 1,000 題、公開 50 題（https://labs.scale.com/leaderboard/math ），與論文的 1,205 題不同。GitHub `scaleapi/gsm1k_eval` README 仍寫「只公開 50 題，等三個開源模型達到 95% 才公開」，沒有更新。
  - 沒有找到推翻主要結果的後續研究。ConTAM（Singh et al. 2024，本批補讀）用另一種方法得到相近的方向：Llama 1 能利用 GSM8K 污染，Pythia 不能，大模型比小模型更能利用污染。這和 GSM1k「前沿模型沒有落差」看起來相反，但兩者量的東西不同：ConTAM 量的是「看過的題目比沒看過的題目多拿幾分」，GSM1k 量的是「換一份新考卷掉幾分」，強模型可能兩者同時成立（看過的題目更有利，但沒看過的題目也會做）。這個調和是我的推論，不是任何一篇論文的結論。
- 對系列的用途：「污染」篇的核心案例，示範「重新出一份同分布的考卷」這種最直接的檢驗法：怎麼對齊難度、怎麼驗證可比性（人眼辨識率、人類解題率、GSM8K 發布前的模型）；也提醒讀者「落差不等於污染」（Goodhart、挑 checkpoint、相似資料）與「看過不等於會過擬合」。檢查表可以引用它的「預先承諾延後公開＋保留暗題偵測 API 外洩」做法。

---

### LiveBench: A Challenging, Contamination-Free LLM Benchmark（2024；v2 改名 Contamination-Limited，2025）
- 網址：https://arxiv.org/html/2406.19314 （v2, 2025-04-18；ICLR 2025 spotlight）；現況：https://livebench.ai/ 、https://github.com/LiveBench/LiveBench 、changelog https://github.com/LiveBench/LiveBench/blob/main/changelog.md
- 讀取狀態：✅（論文 v2 全文；LiveBench 2.0 的方法論只有網站前端文字，沒有論文）
- 讀取紀錄：論文 HTML 約 126,700 字元、977 行。1–219 行（本文 §1–§7）用 Read 讀完；220–303 行是參考文獻（略讀）；304–974 行（附錄 A.1–A.7、B.1–B.5，含全部表格）用 awk 逐段讀完。另讀 GitHub README（約 76,000 字元，搜尋 release 相關段落）、changelog 全文、livebench.ai 首頁，以及從前端 JS bundle（389 KB）取出的 LiveBench 2.0 方法論字串。
- 類型：研究論文＋排行榜頁
- 研究設計或文件目的：用三項設計同時避開測試集污染與 LLM 評審的偏差：（1）題目來自最近的資訊來源並定期更新；（2）只收有客觀標準答案的題目，自動評分，不用 LLM 或人類評審；（3）六大類、18 個任務。論文 v2 評測 40 個模型，共 1,000 題。
- 會被引用的結果：
  1. **定期換題的機制**（§2.7、附錄 A.6）：每次更新平均替換 1/6 的題目，"so that the benchmark is fully refreshed roughly every 6 months"；新題延後一個月才公開，"so that the public leaderboard always has 1/6 questions that are private"。優先更新最舊與最容易的任務；每次更新都會修改出題腳本，讓題目分布改變並變難。
  2. **題目來源**（§1、附錄 A.3、Table 13）：數學（AMC12 2023、AIME 2024，改寫敘述與選項順序；USAMO/IMO 2024 證明題改成「把遮掉的公式排回正確位置」；合成的 AMPS_Hard）、程式（LiveCodeBench 2023-11 以後的 LeetCode/AtCoder 題；程式補完）、推理（Web of Lies v2、程式生成的 Zebra puzzles、50 題人工空間推理）、資料分析（Kaggle/Socrata 近期資料集）、指令遵循（The Guardian 新文章＋IFEval 25 條可驗證指令中的 16 條）、語言（NYT Connections、近期 arXiv 摘要的錯字修正、2024 年以後電影情節重排）。
  3. **客觀評分與避開 LLM 評審**（§1、附錄 A.4–A.5）：regex 自動評分、刻意寬鬆接受多種格式（boxed 或 fbox、選項字母或原答案皆可），避免偏袒被特定格式訓練過的模型；定期人工抽查被判錯的答案、修正解析器後所有模型重算。依各任務性質用 exact match、SymPy 等價、Levenshtein、F1、pass@1 等指標。
  4. **LLM 評審在難題上不可靠**（附錄 A.2、Table 8/9）：以 GPT-4-Turbo 當評審（MT-Bench 式 prompt），判 GPT-4-Turbo 自己答案的錯誤率為 AMC12 2024 38.0%、AIME 2024 21.4%、SMC 2023 35.3%、Zebra 42.0%；判 Claude-3-Opus 答案時 Zebra 錯誤率 46.0%。LLM 評審給的分數多半偏高，例如 GPT-4-Turbo 的 AIME 真值 13.8%、LLM 評審給 35.7%；Zebra 真值 38、LLM 評審給 68。原文："LLM judges are not appropriate for challenging math and logic tasks."（作者也註明結果 "not definitive"，換更好的評審 prompt 可能不同）
  5. **與其他排行榜的相關**（§3.3）：與 ChatBot Arena 0.91、與 Arena-Hard 0.88；gpt-4 系列在 Arena-Hard 明顯較高，作者歸因於 Arena-Hard 用 GPT-4 當評審的自我偏好。
  6. **更新前後排名的穩定性**（§3.4）：原版與第一次更新、第一次與第二次更新的等級相關都 > 0.997；整體平均分數下降約 1.2%。
  7. **難度**（Table 1）：最高為 o1-preview 64.7。
  8. **作者對「污染」的兩種定義**（附錄 A.7）：(1) 測試集污染（題目答案出現在訓練資料）；(2) 任務污染（train–test 分布相似）。作者認為 (2) 在某種程度上是 "fair game"，但仍以不公開出題程式碼、每次更新都修改出題程式、新題延後一個月公開來防範。也承認 "LiveBench does not fully satisfy (1)"：部分程式題來自 2023-11，AMC 題只做了輕度改寫，"a limited fraction of LiveBench is likely contaminated on all recent LLMs."
  9. **可自動更新的程度**（Table 14）：18 個任務中，空間推理必須人工出題；math_comp 與 olympiad 的來源一年只能更新一次；其餘可用腳本更新。
  10. **維運成本**（§2.7、附錄 B.5）：排行榜只保留 40–50 個模型，每個家族約兩版；跑一輪完整評測 o1-preview 約 47.87 美元、claude-3-haiku 約 0.90 美元（2024-10 價格）。
- **LiveBench 後續版本現況（查核至 2026-11-23）**：
  - v1 的 changelog 依序為 2024-06-12 首發（960 題）→ 2024-06-24（移除 house traversal 任務：修好解析器的歧義後，部分模型拿到 100%）→ 2024-07-26（達到 1,000 題）→ 2024-08-31 → 2024-11-25（針對 o1 等推理模型的高分提高難度）→ 2025-04-02（換成更新的 LiveCodeBench 題，原文 "The previous questions were likely heavily contaminated for newer models"；AMC 2023 換成 2024；Web of Lies 混入 BIG-Bench Extra Hard 格式）→ 2025-04-25（程式題改為自行出題、評估真實函式庫用法，不再取自 LiveCodeBench；退役 cta 任務）→ 2025-05-30（新增 agentic coding，用 SWE-Agent＋Multi-SWE-Bench harness）→ 2025-10-03（換成 Mini-SWE-Agent，步數上限從 50 改為 250，並重算 2025-05-30 的榜單）→ 2025-11-25（更新 connections、math、IF、zebra；以 theory_of_mind 取代 web_of_lies_v3；原文說是為了 "resolve (to some extent) saturation and contamination"）→ 2025-12-23 → 2026-01-08。livebench.ai 的時間軸另列 2026-06-25 為 v1 最後一版。
  - 實際的換題節奏不是論文寫的「每月」：2024-11-25 到 2025-04-02 之間隔了四個多月。GitHub README 寫 "The current LiveBench release is 2025-04-25; however, not all questions for this release are public on Huggingface"，要跑完整評測必須退回 2024-11-25 的公開題；論文說的「延後一個月公開」實際上變成更長期地保留未公開題。
  - **LiveBench 2.0**（2026-10-14 首發，之後有 10-25、11-06 兩版；站上標示 "Last updated 11 November 2026"）：網站標語仍是 "a challenging, contamination-free long-horizon AI benchmark"，內容改為長時程代理任務，共七個 suite：Long Agentic、Coding（真實已合併 PR 的 bug 修復，凍結的 codebase，"deterministic grading, a regression scores a hard 0"）、Browser Use（透過截圖操作真實網頁 app）、Data Analysis、Research（"Open-ended research reports graded against a rubric"）、Design（"visual and structural checks" 渲染後的文件）、Reasoning。每個 suite 每個模型只跑一次，"A task the run could not measure ... scores 0"；10-25 版起 Overall 改為加權（Long Agentic ×2、Design 與 Coding ×1.5），10-14 版是等權，"a published release's values never change"，所以兩版的 Overall 不能直接比較。方法論字串沒有提到題目是否公開、多久換題，也沒說 Research 的 rubric 由誰評分（人、LLM 或腳本）。
  - 第三方整理（tomrochette.com，未經官方核對）指出 2.0 只公開分數與各任務分數，不公開題目，GitHub 的程式碼只涵蓋 v1，因此 2.0 的分數無法從外部重算。
- 作者自己列的限制：只有英文；有些用途（例如「寫一份夏威夷旅遊指南」）無法定義標準答案；部分 LLM 家族偏好特定 prompt 格式，仍有偏差（§5）；附錄 A.7 承認部分題目可能已被污染；Connections 任務只給一次作答機會、比原遊戲難（附錄 A.3.6）。
- 與摘要說法不一致處：
  1. 標題與 README 仍寫 "Contamination-Free"，論文 v2 標題改為 "Contamination-Limited"，附錄 A.7 承認有部分題目已污染；附錄 A.6 卻又寫延後公開的 1/6 題 "private and completely contamination-free"。網站的 2.0 再度使用 "contamination-free"。
  2. 摘要說開源模型 "ranging from 0.5B to 405B"，§1 寫 "0.5B to 8x22B"（未隨 v2 更新）。
  3. 摘要說 "Questions are added and updated on a monthly basis"，§2.7 寫每次換 1/6、約 6 個月完全換新，Table 14 顯示數學題一年只能更新一次；實際 changelog 間隔數週到數個月不等。
  4. 摘要說 "below 70%"，Table 1 最高 64.7（v1 摘要為 "below 65%"，隨模型更新而改）。
  5. §2.3 說推理類有三個任務（含空間推理），附錄 A.3.3 開頭寫 "we include two reasoning tasks"，後面又列出第三個。
- 反證或後續修正：
  - 官方 changelog 自承舊的程式題 "likely heavily contaminated for newer models"（2025-04-02），以及 2025-11-25 的更新是為了處理 "saturation and contamination"。也就是說，就算有換題機制，維運方仍需要不定期大幅翻新。
  - EMNLP 綜述（本批）指出時間切分類 benchmark "Verification is often overlooked"，舉的例子就是 LiveBench；並指出競賽題目常在後來的競賽中重複出現。
  - Sun et al. (2025) 選樣時以 LiveBench 的 Min-K% 分數當作 GSM8K 的「未污染」門檻（附錄 C.2 Table 11），等於把 LiveBench 當成乾淨參考集使用。
  - 我的觀察（推論）：LiveBench 2.0 的 Coding suite 用「真實已合併 PR 修過的 bug」，修法本身公開在 GitHub 上，這與 A 批 OpenAI 停用 SWE-bench Verified 的理由（模型背得出標準修法）屬同一類風險；官方方法論沒有說明如何防範。
- 對系列的用途：「污染」篇介紹「動態／滾動更新 benchmark」時的代表案例。它示範三件事：持續換題、延後公開保留暗題、只收有客觀答案的題目以避開 LLM 評審（附錄 A.2 的評審錯誤率是很好的數字）。它也同時是反例：即使設計來防污染，維運方仍自承部分題目已污染，「每月更新」實際上做不到，2.0 換成長任務後改用 rubric 並且不公開題目，可重現性下降。檢查表可以引用：換題比例與週期、暗題比例、出題程式碼不公開、每次換題都修改生成器。

---

## 補讀（補搜後收錄，最多 2 篇）

### The Emperor's New Clothes in Benchmarking? A Rigorous Examination of Mitigation Strategies for LLM Benchmark Data Contamination（2025）
- 網址：https://arxiv.org/abs/2503.16402 （全文 https://arxiv.org/html/2503.16402 ，v1, 2025-03-20；版面為 ICML 格式，是否正式收錄未核對）
- 讀取狀態：✅（表格數字在去標籤時遺失，只採用正文中寫出的數字）
- 讀取紀錄：`curl` 抓 HTML，去標籤後約 92,000 字元。本文 §1–§6 與 Impact Statement（第 34–633 行）全部讀完；附錄 A–C 的文字段落讀完；參考文獻略讀。Table 3/4 的數值格在轉換時遺失。
- 類型：研究論文
- 研究設計或文件目的：檢驗「更新既有 benchmark」這類污染緩解策略（改寫、翻譯、加干擾、選項重排、ITD、Clean-Eval、MPA，以及 LLM 生成延伸題，共 20 種）到底有沒有用。先用 Min-K% Prob、Sharded Rank Comparison Test、TS-Guessing 三種方法篩出 10 個「三種方法都判定未污染」的 3B–34B 模型（14 個候選中排除 4 個）；在 Arc-C、MMLU、TruthfulQA、GSM8K、RepliQA（2024-12 才發布、內容虛構，保證沒有模型看過）上，用兩種配方人工污染：mild（混入 2 萬筆 OpenOrca，訓練 1 epoch）與 intensive（只訓練 benchmark，3 epoch）。提出兩個逐題比對的指標：fidelity（乾淨模型在原題與改寫題上的對錯是否一致）與 contamination resistance（被污染後，模型在改寫題上的對錯是否不變），以正規化 Hamming distance 計算。
- 會被引用的結果：
  1. 原文（摘要）："no existing strategy significantly improves resistance over the vanilla case (i.e., no benchmark update) across all benchmarks, and none effectively balances fidelity and contamination resistance."
  2. 小幅改動（同義詞、錯字、句法改寫、加無關前綴）的 fidelity 通常 > 0.9，但 resistance 和完全不改沒有差別；MPA、ITD 這類大幅改動的 resistance 最高，只在 MMLU、TruthfulQA、RepliQA 上達到顯著（§5.1）。MPA 在 MMLU 的 fidelity 只有 0.686。
  3. 語意改變類（LLM 生成延伸題）resistance 可到約 0.97，但 fidelity 平均比語意保留類低約 0.15；並舉例 Analysis Extension 讓題目變難很多、MPA 加上「在美國」使原答案變錯、LLM 生成的答案經專家判定錯誤（§5.2–5.3、附錄 C.4.2）。
  4. 對既有評估方式的批評（§1、Fig. 2）：「準確率下降」沒有乾淨模型的基準，不知道降多少才算有效；「準確率吻合」只看總分，總分相同時逐題對錯可能完全不同，代表改寫後的考卷量的是不同能力。
- 作者自己列的限制：只評估「更新既有 benchmark」類策略，不評估重新出題的新 benchmark；污染是用微調模擬，不是真的混進預訓練；附錄 A.1 討論連續分數時改用 Pearson 相關的延伸版本。
- 與摘要說法不一致處：逐項對過，沒有。
- 反證或後續修正：沒有找到。
- 對系列的用途：反駁「把舊考題改寫一下就能去污染」的直覺；檢查表可寫：自己更新題目時，要用逐題對錯比對（fidelity／resistance）來驗證，不能只看總分有沒有下降。

### Evaluation data contamination in LLMs: how do we measure it and (when) does it matter?（ConTAM；2024）
- 網址：https://arxiv.org/abs/2411.03923 （全文 https://arxiv.org/html/2411.03923 ，v1, 2024-11-06；Singh, Lomeli 等，Meta）
- 讀取狀態：✅（圖表只有圖說，沒有圖中數值）
- 讀取紀錄：`curl` 抓 HTML，去標籤後約 112,800 字元。本文 §1–§8 全部讀完（含 Table 2 的數值）；附錄 A（過去研究使用的污染度量表）與 B（benchmark 說明）略讀標題；參考文獻略讀。
- 類型：研究論文
- 研究設計或文件目的：有完整預訓練語料可查時（Llama 1 語料、The Pile），比較四種 n-gram 污染度量（token-match、ngram-match、token-extend，以及本文新提出的 longest-match）與其超參數。用 EPG（estimated performance gain，整份 benchmark 與「被判定乾淨的子集」之間的分數差）當作判準：好的度量應該挑出「真的讓模型多拿分」的題目。涵蓋 13 個 benchmark、7 個模型（Llama 1 7B–65B、Pythia 1.4B–12B）。
- 會被引用的結果：
  1. 主要發現（§1）：原文 "The impact of evaluation data contamination has been underestimated in many prominent LLM releases, likely because of false negatives in the chosen contamination metrics"。
  2. n 太大會漏抓（§6.1）：原文 "For virtually all benchmarks we considered, smaller n is better and even one occurrence in the pre-training data matters: both using values of n larger than 8 and setting a minimal count higher than one for occurrence in the pre-training corpus leads to false negatives"。以 PIQA 為例，n=8 時 67.9% 的題目有非零污染分數，換成較大的 n 只剩 33.8%。這直接挑戰 GPT-3 以來常用的 8–13-gram 門檻。
  3. 影響大小（§5.2.2）：Llama 1 65B 在 HumanEval 的 EPG 約 18 分、Big Bench Hard 約 25 分；HellaSwag、MMLU、PIQA ≥ 10 分；Pythia 只有約 2–8 分。Llama 1 語料中有 8/13 個 benchmark 平均超過 50% 的題目被判定污染。
  4. 規模效應（§5.2.3）：約一半的模型與 benchmark 組合中，大模型更能利用污染；但 TriviaQA、HellaSwag、COPA、PIQA 相反，作者推測是大模型不靠污染也已接近滿分，沒有提升空間。GSM8K、MBPP、MATH 只有 Llama 1 出現顯著 EPG，Pythia 沒有。
  5. 給從業者的建議（§7.3）：優先用 longest-match；每個模型與 benchmark 組合各自選門檻；回報污染比例、EPG 與所選門檻；可能的話人工檢查被標記的題目。
- 作者自己列的限制（§8）：以「有沒有讓分數變高」定義有效污染，所以「污染了卻沒影響」會被當成偽陽性，不能據此推論污染無害；被標記的題目太多或太少時沒有統計檢定力；只做字串類度量，抓不到改寫；分析是相關性的、事後的，不是因果；只看預訓練模型，沒看 SFT/RLHF。
- 與摘要說法不一致處：逐項對過，沒有。
- 反證或後續修正：沒有找到推翻它的研究。GEM 綜述把 n-gram 過濾形容為 "illusory safety"，方向一致，但理由不同：GEM 談的是改寫能繞過；ConTAM 指出即使是逐字污染，常用的 n 值也太大而漏抓。
- 對系列的用途：說明「技術報告說做過 n-gram 去污染」為什麼不夠：門檻參數本身就會讓污染被低估。檢查表可以寫成「問清楚用幾 gram、是否過濾低頻、是否回報 EPG」。

---

## 補搜紀錄

| 查詢（工具） | 找到什麼 | 收或不收、原因 |
|---|---|---|
| Exa：`limitations of LLM benchmark contamination detection methods empirical evaluation 2025 paper inconsistent results`（目標限定 2024–2026、criticism／replication） | Samuel et al. COLING 2025；Fu et al. NAACL Findings 2025；ConTAM（arXiv 2411.03923）；DyePack（EMNLP 2025，用 backdoor 標記測試集）；Sun et al. 2025（arXiv 2503.16402）；Sander et al. 2025（用浮水印偵測 benchmark 污染）；Zarzecki et al. 2026（arXiv 2606.03305，可靠度落差）；Cheng et al. 2025 綜述 | 收 **Sun et al.**：直接檢驗 EMNLP 綜述所列「改寫既有 benchmark」類方法的效力，結果是負面，屬反證。收 **ConTAM**：補上「n-gram 去污染的參數讓污染被低估」這個檢查表需要、但四篇指定來源都沒講透的論點。Samuel、Fu 的摘要已足以佐證 GEM 的結論（兩篇都被 GEM 引用），不重複精讀。DyePack、浮水印是「事前埋標記」的新方向，可作為檢查表延伸，但已超過每批 2 篇的上限，列為候選。Zarzecki 2026 只讀到搜尋摘要，未精讀。 |
| Exa：`GSM1k dataset public release Scale AI huggingface` | HF `ScaleAI/gsm1k`（1,205 列）、Scale SEAL Math 頁（2025-01 標示 deprecated）、`scaleapi/gsm1k_eval` README、第三方 Benchmark Almanac（稱 2025-03-31 公開） | 用於 GSM1k 的「後續修正」欄；公開日期只有第三方來源，已註明。 |
| Exa：`LiveBench 2.0 long-horizon benchmark methodology grading rubric judge 2026` | livebench.ai 首頁；第三方：llmlearner、TrueIQ、AI Wiki、vakati-tech、tomrochette、benchmarklist | 第三方只當線索；suite、評分方式、權重、單次執行等事實改用官方前端 JS bundle 的方法論字串核對後才寫入。各頁的任務數略有出入（Coding 29 或 24），未寫入正文。 |
| Exa fetch：LiveBench GitHub README、changelog、arXiv v1 abs（2406.19314v1、2405.00332v1） | changelog 全文；README 的 release 說明；GSM1k v1 的 13%／0.32／1,250 題 | 用於版本差異與後續現況。 |
| Exa fetch：ITD（ACL Anthology 2024.findings-emnlp.532）、Yang et al. 2023（arXiv 2311.04850）、Dong et al. 2024（2024.findings-acl.716）摘要 | 確認 GEM 綜述把 ITD 與 Yang et al. 的結果歸錯作者 | 只用於核對引用，不另立抽取紀錄。 |

未完成或待確認：
- EMNLP 綜述 Table 2 的「完全支持」符號是依版面位置推定，引用前要看 PDF 原圖。
- GEM 綜述引用的 ConStat 27.15%／40%、MMLU 6.5% 標註錯誤率，未回到 ConStat 與 Gema et al. 原文核對。
- GSM1k 在 HF 的公開日期只有第三方來源。
- LiveBench 2.0 的 Research rubric 由誰評分、題目是否公開、換題頻率，官方方法論沒寫；需要的話可以去問 LiveBench 維運方（Abacus.AI，GitHub issue 或論文通訊作者 Colin White）。
