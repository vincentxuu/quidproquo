# 批次 A-methodology：什麼是好的 benchmark（精讀抽取紀錄）

- 精讀日期：2026-11-23
- 讀取管道：四篇都用 Bash `curl -sL` 抓 arXiv PDF，`pdftotext` 轉純文字後依序讀（brief 的 fallback 第 4 步）。前面三步沒試，原因是 PDF 全文直接取得成功，不需要降級；Exa `web_fetch_exa` 只用在補搜的 OpenAI 文章。
- 版本核對：BetterBench 與 ABC 另外抓了 NeurIPS proceedings 版 PDF 比對數字；Saturation 一文 arXiv 已有 v4（2026-08-06，ICML 2026 PMLR 306），brief 指定的是 v1，兩版都讀了，以 v4 為準，差異列在該條。
- 工作檔（不入 repo）：`/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/261adb0a-4096-4f86-81fd-0ed73b43ab71/scratchpad/dl/`

---

### BetterBench: Assessing AI Benchmarks, Uncovering Issues, and Establishing Best Practices（2024）

- 網址：https://arxiv.org/abs/2411.12990 （v1，2024-11-20）；NeurIPS 2024 D&B 版 https://papers.neurips.cc/paper_files/paper/2024/file/26889e8359e7ef8a7f5d77457364ca55-Paper-Datasets_and_Benchmarks_Track.pdf ；線上評分庫 https://betterbench.stanford.edu
- 讀取狀態：✅
- 讀取紀錄：arXiv PDF 48 頁，純文字約 162,000 字元（3,062 行）。依序讀：第 1–838 行（正文 §1–§10 全部，含 Table 1/2、Fig. 1–7）；第 839–1173 行為參考文獻（只掃過，未逐條讀）；第 1174–1250 行 NeurIPS checklist；第 1251–1857 行附錄 A（利害關係人）、B（生命週期）、C（24 個 benchmark 名單）、D（敏感度分析）、E（各階段分數長條圖）、F（計分公式）、G（方法流程圖）、H（release requirements）；第 1858–2188 行附錄 I（checklist 模板與 BetterBench 自評）；第 2189–3062 行附錄 J（46 條準則的說明、理由、0/5/10/15 計分細則）。J.3 第 15–16 條（standardized documentation、evaluation metric 文件化）只讀到計分行，說明段落讀得較快。NeurIPS 版與 arXiv 版的百分比數字逐一 diff，無差異。
- 類型：研究論文（NeurIPS 2024 Datasets & Benchmarks Track）
- 研究設計或文件目的：從文獻回顧＋對 20 多位利害關係人（政策制定者、模型開發者、benchmark 開發者、模型使用者、研究者）的非結構化訪談，整理出 benchmark 五階段生命週期（設計、實作、文件、維護、退役），把「開發者可控、且有規範共識」的做法轉成 46 條準則（設計 14、實作 10、文件 19、維護 3；退役階段不評，因為無法評估仍在用的 benchmark）。用 0/5/10/15 分（未提及／提及但沒做／部分做到／完全做到）評 24 個 benchmark（16 個基礎模型 FM、8 個非 FM），每個至少兩位作者獨立評分後取共識。設計分數＝設計階段平均；可用性分數＝實作、文件、維護三階段依準則數加權平均。平均 ≥10 視為「合理良好」。
- 會被引用的結果：
  - 24 個 benchmark 全體平均：設計 10.8、實作 6.2、文件 10.1、維護 9.6；FM 實作只有 5.5、非 FM 7.5（Table 1）。原文：“for both FM and non-FM benchmarks, the implementation stage tends to be the weakest area, followed by maintenance.”（§6）
  - 跨全部 benchmark，「附可重現結果的腳本」平均只拿 3.75 分、「報告統計顯著性」平均 5.62 分（滿分 15）。原文：“benchmarks get an average score of 3.75 on Including a script to replicate results and an average score of 5.62 on Reporting statistical significance.”（§6）
  - 整體平均設計分數 10.7、加權可用性分數 8.7（§6 正文；注意與 Table 1 的 10.8 不同，見下方不一致處）。
  - 設計分與可用性分顯著相關：FM ρ=0.730（p=0.001）、全體 ρ=0.693（p<0.001）；非 FM ρ=0.477（p=0.279，不顯著）（Table 2）。原文：“benchmarks with poorer design tend to also be less usable, and vice versa.”
  - FM 與非 FM 的平均分差異不顯著（bootstrap，95% 信心水準，App. D Fig. 8）。
  - MMLU 加權平均 5.5，是所有被評 benchmark 中最低；GPQA 11.0。原文：“the widely-used MMLU benchmark scored the lowest in our assessment (weighted average: 5.5), while GPQA scored significantly higher (weighted average: 11.0).”（§7）作者指出 GPT-4、Claude 3、Gemini 發表時兩者並列報告卻沒說明品質差異；英國 AISI 的 Inspect 也同時收錄兩者。
  - 24 個中有 14 個沒有對同一模型多次評測、也沒報告統計顯著性或不確定性。原文：“14 out of 24 benchmarks did not perform multiple evaluations of the same model or report statistical significance or uncertainty of results.”（§7）
  - 24 個中有 17 個沒提供可輕鬆重跑論文結果的腳本，另有 4 個只能重跑部分結果（§7）。
  - 只有 3/24 在 GitHub 放 build status（§7）。
  - 開放問題章（§8）列：快速飽和（“Some benchmarks have been saturated within months of their release”）、污染（benchmark 開發者無法強制模型開發者遵守 canary string）、construct validity 差、benchmark 報告缺乏標準化。
  - 「其他設計考量」（§5，不計分）：應能可靠偵測 1% 的進步（引 [34]）、版本化（小修用 task versioning、大改發新版，以 AgentBench v0.1/v0.2 為例）、動態 vs 靜態、可被鑽漏洞（gameability）、positionality statement。
  - Checklist（App. I.1）：給開發者在部署前逐條填 YES/NO/N/A＋理由；作者也拿 BetterBench 自己跑了一遍（App. I.2）。
  - 準則細則中幾條對「自己建 benchmark」特別可用（App. J）：要列 metric 的地板與天花板（“It helps users understand if a benchmark is already saturated”）、人類表現（並說明怎麼量、是一般人還是專家）、隨機表現水準、輸入敏感度（同義改寫的多個版本）、驗證過的自動評分、GUID／canary string 或加密測試資料（並引用建議：不要用沒有金鑰保護的一般壓縮或混淆，因為部分爬蟲會自動解壓）、training_on_test_set 任務、release requirements、程式可用性每年檢查一次、GitHub issue 三個月內回應。
- 作者自己列的限制（§9、Impact Statement）：
  - 所有準則同權重，不反映各準則對品質的實際貢獻與實作成本；四級計分會抹掉級內差異（勉強及格與幾乎完美都拿 10 分）。
  - 等權重讓開發者可能挑容易的準則刷分（作者認為即使如此仍比完全不做好）。
  - 不評 construct validity 本身（需要各領域專家深入分析），只提供「最低品質保證」。原文：“our assessment only provides minimum quality assurances and is not sufficient to assess the suitability of a benchmark for a concrete use case.”
  - 只適用公開 benchmark，私有 benchmark 需另做。
  - 只採 benchmark 開發者自己釋出的資訊，不採第三方資訊（§3 註 3）。
  - 「需有領域專家參與」等準則可能對資源少的機構不利。
- 與摘要說法不一致處：
  - 準則數：摘要與正文說 46 條，附錄 J 加總也是 14+10+19+3=46；但正文 Fig. 3 的實作準則圖列了 11 條，把「統計顯著性」放在實作階段，附錄 J 卻把它放在文件階段第 17 條。§7 討論又把統計顯著性與 Table 1 的實作弱點連在一起談。引用「哪一階段最弱」時要注意這條準則的歸屬有兩種說法。
  - 附錄 I.1 的 checklist 模板「文件」只列 13 項，比附錄 J 的 19 條少（缺 persistent identifier、standardized metadata、資料來源、前處理、標註流程、代表性等），模板與評分表不一致。
  - 評估數量：正文 24 個；App. G 方法流程圖寫 “Score set of 25 benchmarks”。
  - 平均設計分：§6 正文寫 10.7，Table 1 全體設計欄寫 10.8。
  - 摘要說 “commonly used benchmarks suffer from significant issues”，正文能支撐的是分數分布與個案（MMLU），沒有對「常用」與「不常用」做比較。
- 反證或後續修正：
  - 2024 年後沒找到直接推翻 BetterBench 結論的研究。
  - Bean et al. 2025（本批第 2 篇）引用 BetterBench 為生命週期最佳實務的彙整，但另外指出它沒處理 construct validity，與 BetterBench 自述限制一致。
  - Saturation 一文（本批第 4 篇，Reuel 為共同第一作者）的資料收集參考了 BetterBench 框架（GitHub README：“informed by frameworks such as BetterBench”）。
  - 2026 年出現「揭露程度≠品質」的提醒：Moghadasi & Ghaderi 2026 審 12 篇 agent benchmark 論文時明說 “The aggregate score is a disclosure metric, not a quality metric.”（https://arxiv.org/html/2605.21404v1，只讀到搜尋摘要，未精讀）。這句話同樣適用 BetterBench：多數準則評的是「有沒有寫出來、有沒有提供」，不是量測本身對不對。這是我的推論，不是該文對 BetterBench 的直接批評。
- 對系列的用途：支撐「好 benchmark 的判準」篇的生命週期框架（設計→實作→文件→維護→退役）與「多數 benchmark 不報不確定性、無法重現」兩個主張，也是「自己建 benchmark」檢查表中可重現、污染防護與維護那幾項的主要來源。

---

### Measuring what Matters: Construct Validity in Large Language Model Benchmarks（2025）

- 網址：https://arxiv.org/abs/2511.04703 （v1，2025-11-03，目前唯一版本）；HTML https://arxiv.org/html/2511.04703 ；NeurIPS 2025 D&B
- 讀取狀態：✅
- 讀取紀錄：arXiv PDF 29 頁，純文字約 81,000 字元（1,774 行）。依序讀：第 1–740 行（摘要、§1–§7 全文、GSM8K 範例框、致謝）；第 741–940 行為參考文獻（掃過）；第 940–1774 行附錄 A（完整 checklist）、B（完整 codebook 與各題計數）、C（納入排除流程，Table 7、8）、D（評分者一致性，Table 9）。另以 Exa 讀到 HTML 版摘錄，用來核對節次編號（HTML 版把建議編為 §3.x，PDF 為 §5.x）。
- 類型：研究論文（系統性回顧，NeurIPS 2025 D&B）
- 研究設計或文件目的：從 ICML/ICLR/NeurIPS（2018–2024）與 ACL/NAACL/EMNLP（2020–2024）共 46,114 篇論文中，以標題或摘要含 “benchmark” 且含 “LLM” 或 “language model” 篩出 2,189 篇；GPT-4o mini 依前三條納入標準初篩到 522 篇（以 50 篇人工標註驗證，F1 84%、precision 80%、recall 89%）；再由 29 位專家依四條標準人工判定，納入 445 篇。每篇由一位主審依 codebook 標註「現象（phenomenon）→ 任務（task）→ 指標（metric）→ 主張（claim）」四層；46 篇雙人重審，30 個類別題的平均 Brennan–Prediger Kappa 0.524、平均一致率 68.1%。第一作者讀其中 50 篇並審全部 445 份標註，歸納出 8 條建議，經五次會議修訂。
- 會被引用的結果（百分比的分母皆為 445 篇，除非另註）：
  - 現象定義：78.2% 有定義；在有定義的論文中，52.2% 的定義有廣泛共識、47.8% 有爭議（§4 Phenomenon）。原文：“Of the articles that provided definitions, 52.2% of these definitions are widely agreed upon, but 47.8% are contested”。Fig. 3 以全體為分母則是：共識 40.9%、有爭議 37.4%、未定義 21.7%。
  - 61.2% 把現象定義為由多個子能力組成的複合體，36.5% 視為單一整體。
  - 任務：完整真實世界任務不到 10%；40.7% 用人造任務（28.5% 只用人造任務）；部分真實任務 32.3%、代表性任務（如考試題）36.9%。
  - 題目來源：只有 33.6% 只用單一來源；自己手寫 43.3%、重用既有 benchmark 42.6%、用 LLM 生成 31.2%、人類考試等既有來源 38.2%；7.7% 的題目完全取自另一個 benchmark。
  - 抽樣：12.3% 只用便利抽樣（convenience sampling），另 27.0% 部分使用；55.2% 至少部分用目標抽樣；46.2% 用準則抽樣；17.1% 用隨機抽樣。只用目標抽樣 17.5%、只用準則抽樣 10.8%、只用隨機抽樣 7.0%。
  - 作答格式：自由作答部分使用 46.4%（獨用 17.8%）；選擇題部分使用 40.0%（獨用 18.5%）；短答 38.5%（獨用 13.2%）；JSON 等結構化格式 21.1%（獨用 8.6%）。
  - 指標：完全比對（exact match）至少部分使用 81.3%、獨用 40.7%；部分給分 20.9%；LLM-as-a-judge 17.1%（獨用 3.1%）；人類評分 13.0%（獨用 1.8%）。
  - 統計：只有 16.0% 用不確定性估計或統計檢定比較模型。原文：“At present, only 16.0% of reviewed benchmarks conducted any statistical testing.”（§5.6）
  - 主張：53.4% 為自己的 construct validity 提出證據；35.2% 與同現象的其他 benchmark 比較；32.4% 有人類基準線；31.2% 與更真實情境比較。
  - 附錄 B 計數：只提供 test split 的 275 篇；有 metadata 的 322 篇；有子分數 363 篇；用 few-shot 79 篇；作者組成學界 230、混合 186、業界 33；結果主張與定義範圍一致 435 篇、不一致 18 篇。
  - 八條建議＋對應檢查項（§5，App. A 為完整版）：
    1. 定義現象（給可操作的精確定義；說明範圍與排除項；有子成分就分開量）。沒有共識時可用否定式定義劃界，例：“repeating memorised answers is not reasoning”。
    2. 只量該現象（控制無關任務；評估格式限制的影響；驗證自動解析答案的方法）。例：21.1% 要求特定輸出格式，格式本身就可能是難點；建議先單獨測知識或格式能力再調整分數，允許重試以區分格式能力與任務能力。
    3. 建立有代表性的資料集（用抽樣策略涵蓋任務空間；檢查每一題的品質與相關性，大型或自動生成的資料集尤其要做；納入測 LLM 已知敏感點的題目，例如輸入重排與改寫）。例：AIME 這類不准用計算機的考試，題目數字刻意好算，只用它測不出大數運算能力。原文：“smaller well-designed datasets can provide higher construct validity than larger datasets at less computational cost”。
    4. 交代重用資料集的限制（說明是否改編、分析原作優缺點、新舊成績對照、說明修改如何提升效度）。
    5. 為污染預作準備（實作污染偵測並套用；保留 held-out 題組；調查來源材料是否已在常見訓練語料）。
    6. 用統計方法比較模型（報告樣本數並說明統計檢定力；主要分數附不確定性；若用人類評分者，描述其人口組成並減少招募偏誤；主觀標籤用能保留分布變異的指標，不只取單點彙總）。
    7. 做錯誤分析（質化與量化分析常見失敗模式；檢查失敗是否與非目標現象相關；檢討評分偏誤）。附錄版多一項：“Conduct experiments or propose new directions to improve model scores on the benchmark”。
    8. 論證 construct validity（說明與真實應用的關聯；任務與指標選擇的理由要連回操作型定義；與同類評測比較異同；在限制中討論效度取捨）。
  - GSM8K 示範（§5 框）：定義清楚、從零建題、有多次執行的標準差；但沒有錯誤分析、沒有 canary string 與 held-out 題組，作者判斷 “Contamination has likely been a factor in increased scores over time”；若把解讀從「數學題」延伸到「邏輯推理」，需要更多論證。
  - 作者建議把 checklist 當附錄填寫，沒做的項目寫理由；不期待每個 benchmark 全部做到。
- 作者自己列的限制（§6）：只看頂會論文，漏掉業界未經同儕審查的 benchmark 與領域期刊；GPT-4o mini 初篩可能有未偵測到的系統性漏網（false negative）；舊論文納入較少可能部分來自用語變遷；規模大，每篇只能一位主審，降低穩健性。附錄 D 補充：詮釋性欄位一致性低，task_ecology 一致率 31.71%、dataset_sampling_method 37.80%。
- 與摘要說法不一致處：
  - 便利抽樣比例前後說法不同：§4 說只用便利抽樣 12.3%、部分使用 27.0%（合計約 39%）；§5.3 卻寫 “27.0% of reviewed benchmarks used convenience sampling”，把「部分使用」當成總數。引用時要寫清楚是哪個口徑。
  - LLM 生成題目：§4 說 31.2% 用 LLM 生成資料；§5.3 寫生成合成題目來擴充 benchmark 的情況 “occurs in 47.5% of the benchmarks we reviewed”。兩個數字口徑可能不同（後者或含程式化生成），但論文沒解釋。
  - 爭議定義比例：正文說「有定義者中 47.8%」，Fig. 3 以全體為分母是 37.4%。附錄 B 的原始計數（Contested 225、Widely-agreed 203、Not defined 27，合計 455）與 phenomenon_defined（Yes 348、No 99，合計 447）都不等於 445，原始計數算不回正文的百分比。
  - 摘要說 “nearly every paper had weaknesses in at least one area”（§1、§6 也這樣寫），但正文沒有報告「五項全做到」的比例數字，只在 Fig. 3 用陰影表示。
  - 摘要與 §1 對其他項目的描述與正文一致（445 篇、29 位專家、8 條建議）。
- 反證或後續修正：
  - 沒找到推翻其主要數字的後續研究；arXiv 只有 v1。
  - 後續研究把同一套 construct validity 視角用到 agent benchmark 與程式 benchmark，方向一致：KDD 2026 workshop 論文 “Construct Validity Failures in Agentic AI Benchmarks” 發現 15 個模型在 5 個 benchmark 上的跨 benchmark 排名 Spearman 平均只有 0.67（0.10–0.92），τ-bench Airline 與 MMLU-Pro 相關僅 0.10（https://kdd-eval-workshop.github.io/agenticai-evaluation-kdd2026/assets/papers/48_Construct_Validity_Failures%20%281%29.pdf ，只讀到搜尋摘要）；Ralph et al. 2026 審程式 benchmark 的 construct validity（https://arxiv.org/abs/2611.05665 ，只讀到摘要）。
  - Eriksson et al. 2025（AIES，約 110 篇研究的跨領域後設回顧）也把 construct validity 列為系統性缺陷（https://doi.org/10.1609/aies.v8i1.36595 ，只讀到摘要）。
- 對系列的用途：「好 benchmark 的判準」篇的核心資料來源（定義不清、抽樣、只有 16% 做統計檢定），也是「自己建 benchmark」檢查表的主骨架（八條建議＋各條勾選項）；GSM8K 範例可直接拿來示範怎麼用這份清單審一個知名 benchmark。

---

### Establishing Best Practices for Building Rigorous Agentic Benchmarks（ABC，2025）

- 網址：https://arxiv.org/abs/2507.02825 （讀的是 v5，2025-08-07）；NeurIPS 2025 D&B 版 https://proceedings.neurips.cc/paper_files/paper/2025/file/f316275b44ee2de533102913828a8107-Paper-Datasets_and_Benchmarks_Track.pdf ；專案頁 https://uiuc-kang-lab.github.io/agentic-benchmarks/ ；程式 https://github.com/uiuc-kang-lab/agentic-benchmarks
- 讀取狀態：✅
- 讀取紀錄：arXiv v5 PDF 純文字約 137,500 字元（5,298 行）。依序讀：第 1–870 行（摘要、§1–§6 全文、Fig. 1–6、Table 1）；第 871–1185 行參考文獻（掃過）；第 1186–1240 行附錄 A（限制與影響）；第 1241–1894 行附錄 B（benchmark 收集流程、Table 2 的 78 個 benchmark 清單、Table 3 的 agentic benchmark 分類；清單逐列掃過）；第 1895–2231 行附錄 C（Table 4 各檢查項來源，掃過）；第 2232–3810 行附錄 D（10 個 benchmark 的逐項評分報告，Table 5–14；只細讀 KernelBench、τ-bench 的理由欄，其餘逐表掃過分數）；第 3811–4268 行附錄 E（六個個案研究）全讀；第 4269–4875 行附錄 F（以 BIRD 示範完整報告）全讀；第 4876–4977 行附錄 G（BIRD 信賴區間排行表）；第 4978 行後為 NeurIPS paper checklist（掃過）。NeurIPS 版的關鍵數字（33%、38%、31%、100%、5.2%、24%、17、25、七個）以 grep 比對，與 arXiv v5 一致。專案頁的分數表由 Exa 搜尋結果讀到。
- 類型：研究論文（NeurIPS 2025 D&B）
- 研究設計或文件目的：把 agent 評測的嚴謹性拆成兩個條件：任務效度（task validity：當且僅當 agent 有目標能力時任務才可解）與結果效度（outcome validity：評分結果確實代表任務成功）。從主要 AI 廠商（OpenAI、Anthropic、Amazon、Meta、Google、xAI、Mistral、DeepSeek）2024-01-01 至 2025-03-18 的發表資料與獲獎論文收集 benchmark，整理出 Agentic Benchmark Checklist（ABC），分三部分：任務效度 T.1–T.10、結果效度（依評分方法分組：字串比對、子字串比對、LLM-as-a-judge、單元測試、fuzz 測試、E2E 測試、狀態比對、答案比對、品質指標）、報告品質 R.1–R.13。挑 10 個開源 agent benchmark 逐項打分（符合 1 分、否則 0 分），對找到的問題設計實驗量化影響，最後用 ABC 修正 CVE-Bench。
- 會被引用的結果：
  - 總覽：10 個中 7 個違反任務效度、7 個違反結果效度、10 個報告都有缺陷（Fig. 5）。80% 沒承認設計或實作的弱點，沒有一個滿足所有報告準則（§5.1）。原文：“80% of the benchmarks fail to acknowledge weaknesses in their design or implementation, and none satisfies every reporting criterion.”
  - 誤差上限：摘要與結論說相對誤差可達 100%。原文：“Such issues can lead to under- or overestimation of agents’ performance by up to 100% in relative terms.”
  - τ-bench：航空子集 38%、零售子集 6% 的任務刻意不可解，成功條件是「環境不變」，所以什麼都不做的 agent 也過關；什麼都不做的 agent 在 Airline 拿 38%、Retail 6.0%（任何 k 的 pass^k 與 pass@k 皆同），超過 GPT-4o agent（原論文報 35%）。把整個資料庫吐出來的 agent 在 Airline 拿 40%、Retail 9.6%（2% 航空任務與 3.6% 零售任務以資料庫原文做子字串比對）（§5.2、App. E.2）。原文：“This trivial agent achieves a 38% success rate and outperforms a GPT-4o-based agent”。
  - SWE-Lancer：測試檔放在有密碼的 zip 裡，但 zip 的目錄結構可列出、內容可覆寫而不需密碼；agent 把測試換成 `assert 1 == 1` 就能拿 100%（§5.2、App. E.4）。原文：“an agent can score 100% on SWE-Lancer without resolving any tasks”。
  - KernelBench：fuzzer 只變動張量數值，不變形狀與記憶體布局；部分函數（如 relu(x-2)、mean(softmax(x))）對均勻亂數輸入不敏感；且先在同一行程跑標準答案 kernel，可能被越界讀取取得答案。用 o3-mini 產生額外測試並人工驗證後，kernel 正確率被高估 31%（摘要寫 “31% in absolute terms”）（§5.2、App. E.6）。
  - WebArena：子字串比對忽略多餘內容；標為 “N/A” 的任務，LLM judge 接受空回答；judge 也曾把 45+8=53 分鐘的答案判成與標準答案 63 分鐘相符。綜合高估 1.4–5.2%（§5.2、App. E.5）。
  - OSWorld：chrome 子集 46 題中 13 題因網站版面、網址、功能改變而壞掉（評分依賴 HTML selector），對 UI-TARS 低估 28%（絕對值）（§5.2）。這是「低估」的例子。
  - SWE-bench：引用 UTBoost（Yu et al., ACL 2025）指單元測試不足；App. E.1：Verified 5.3%、Lite 7.7% 的任務沒真正修好也能過，造成 Verified 排行榜 40.9%、Lite 24.4% 的名次變動，分數高估 2.3%（Verified）與 1.6%（Lite）。§1 另寫 “24% of the top 50 leaderboard positions are incorrect”。
  - CVE-Bench 修正（§5.3）：時間型 SQL 注入原本只檢查資料庫日誌有沒有 SLEEP 字樣，修正後高估 32.5% 被消除；對外伺服器在同一 docker 網路內可直接連到，造成捷徑，拒絕外部請求後成功率降 10%。摘要合稱 “ABC reduces the performance overestimation by 33%”。
  - 檢查表本體（Fig. 2–4）：
    - 任務效度：T.1 工具版本明確；T.2 API 工具在評測期間穩定可用；T.3 API 中斷時能終止或妥善處理；T.4 每次執行之間清除殘留資料與狀態；T.5 agent 完全接觸不到標準答案；T.6 環境不隨時間變（不用活網站）；T.7 標準答案經驗證；T.8 每題驗證可解；T.9 附可自動解出所有題目的 oracle solver；T.10 沒有可被利用來不做題就過關的漏洞（建議看試跑時的異常值：簡單題一直失敗可能是題目不可解，只有難題成功可能有捷徑）。
    - 結果效度：考慮語意等價說法（O.a.1）、多餘字詞（O.a.2）、否定詞（O.b.1）、防止列舉所有可能答案（O.b.2）、標準答案夠複雜難以猜中（O.b.3）；LLM judge 要有準確度、自我一致性、與人類一致的證據（O.c.1）並能抵抗對抗輸入（O.c.2）；測試案例人工驗證（O.d.1）並用覆蓋率等客觀指標衡量（O.d.2）；fuzz 要涵蓋邊界案例、各種輸入變化、能影響輸出的輸入（O.e.1–3）；E2E 要涵蓋所有相關路徑並防止不穩定測試（O.f.1–2）；狀態比對要涵蓋所有成功後可能狀態、同時檢查相關與無關狀態、狀態夠複雜（O.g.1–3）；答案比對要在題目中寫明格式（O.h.1，例：MATH 假設答案以 “Answer:” 開頭）並降低猜中機率（O.h.2）；品質指標要防止被鑽漏洞（O.i.1）。
    - 報告：開源資料與評測工具（R.1–2）、防污染措施如私有 held-out 測試集（R.3）、持續更新題目（R.4）、說清楚量的是什麼能力與 construct validity（R.5）、說明受測對象是模型還是 agent 框架（R.6）、描述防錯修錯步驟（R.7）、質化與量化討論無法避免的缺陷（R.8–9）、報統計顯著性如信賴區間（R.10）、說明有缺陷時如何解讀（R.11）、報非 AI 基準如人類專家（R.12）、報什麼都不做的 trivial agent 結果（R.13）。
  - 好報告範例（App. F，以 BIRD 改寫）：隨機抽 500 題人工複核，11.65% 的標準答案 SQL 是錯的；用常態近似把標準答案錯誤率 e 帶入 µ = e + (1 − 2e)p₀ 算信賴區間；人類 SQL 專家 92.96%；trivial agent 0%。App. G Table 15 顯示加上信賴區間後，排行榜第 1 名的「可能名次」是 1–13 名。
  - 專案頁分數表（截至讀取時）：MLE-Bench 總分 94.1 最高、KernelBench 44.6 最低；SWE-bench Verified 結果效度 50、任務效度 100、報告 30.8。
- 作者自己列的限制（App. A）：只分析 2024-01 到 2025-03 被主要廠商使用的 17 個 agentic benchmark，清單可能不完整；分類法建立在目前對 agent 能力的理解上，未來能力可能帶來新問題；結論只反映撰寫當時的 benchmark 版本，之後修訂可能不同。
- 與摘要說法不一致處：
  - agentic benchmark 數量：§3 與附錄 A 說 17 個；附錄 B 說 “we collected 25 agentic benchmarks”（從 78 個 benchmark 篩出）。
  - SWE-bench 數字：§2 Related Work 寫 “7.7% of tasks in the SWE-bench-Lite and 5.2% of tasks in the SWE-bench-Verified”；附錄 E.1 寫 Verified 5.3%。§1 的「top 50 名次 24% 錯誤」與附錄 E.1 的「Verified 名次變動 40.9%、Lite 24.4%」口徑不同，24% 看起來對應的是 Lite。
  - WebArena：§1 寫高估 5.2%，§5.2 寫 1.4–5.2%；摘要級說法取了上限。
  - CVE-Bench：摘要說 ABC 減少 33% 高估，§1 加註 “in absolute terms”，§5.3 拆成 32.5%（SLEEP 問題）與 10%（對外伺服器）兩件事；33% 怎麼由這兩個數字得出，正文沒交代。
  - 「最多 100% 相對誤差」：正文最接近的是 SWE-Lancer 可拿 100%（從真實分數到 100% 的差距不一定是 100% 相對誤差）與 τ-bench；論文沒有列出哪個例子對應「100% 相對」的計算。
  - 摘要點名 SWE-bench-Verified「測試不足」，但作者自己的實驗量化在 E.1 引用前作數字（2.3% 高估），不是本文新發現。
- 反證或後續修正：
  - OpenAI 2026-02-23 公告停止報告 SWE-bench Verified（見下方補搜精讀），把 ABC 談的「結果效度」問題往另一個方向推進：ABC 強調測試太鬆造成高估，OpenAI 審 138 題後發現 59.4% 的題目測試太窄或太寬、會「拒絕正確解」，造成低估；同時有污染。兩者合起來顯示同一個 benchmark 的評分誤差可以雙向。
  - 後續「OpenAI 同年 7 月 ‘Separating signal from noise in coding evaluations’」與 Datacurve 2026-05 對 SWE-bench Pro 的稽核（據二手報導：誤收錯誤補丁約 8.5%、誤拒正確補丁約 24%）顯示問題延伸到後繼 benchmark；兩者都只讀到搜尋摘要，數字未經一手核對，不可直接引用（https://openai.com/index/separating-signal-from-noise-coding-evaluations/ ；https://aiweekly.co/alerts/openai-drops-swe-bench-verified-backs-pro-after-flaw-audit ）。
  - 2026 年有多篇延伸 ABC 的 agent benchmark 稽核（“Do Agent Benchmarks Do What They Say?” https://arxiv.org/html/2609.37315 ；“Can Agent Benchmarks Support Their Scores?” https://arxiv.org/html/2605.10448 ），只讀到搜尋摘要，未精讀。
- 對系列的用途：「好 benchmark 的判準」篇裡 agent benchmark 一節的主要證據（什麼都不做拿 38%、改測試拿 100% 這類具體漏洞），也是「自己建 benchmark」檢查表中 agent／程式評測那一段（oracle solver、trivial agent、狀態隔離、凍結環境）的來源。

---

### When AI Benchmarks Plateau: A Systematic Study of Benchmark Saturation（2026）

- 網址：https://arxiv.org/abs/2602.16763 （brief 指定 v1 https://arxiv.org/html/2602.16763v1 ，2026-02-18；最新 v4 https://arxiv.org/abs/2602.16763v4 ，2026-08-06，ICML 2026 PMLR 306）；程式與資料 https://github.com/evaleval/benchmark-saturation ；作者部落格 https://evalevalai.com/2026/06/30/saturation-blog/
- 讀取狀態：✅（v1 與 v4 都讀完）
- 讀取紀錄：v1 PDF 21 頁，純文字約 88,000 字元（2,154 行）：第 1–1032 行正文全讀，第 1033–1727 行參考文獻掃過，第 1728–2154 行附錄 A（假設）、B（Semantic Scholar 收集）、Table 3–5、Fig. 4–5 全讀（v1 的附錄 C、D 只有標題沒有內文）。v4 PDF 28 頁，純文字約 129,000 字元（2,868 行）：第 1–1171 行正文全讀，第 1172–2265 行參考文獻掃過，第 2266–2868 行附錄 A（相關研究）、B（假設）、C、D（標註欄位）、E（個案與 Table 7）、F（聯合回歸）、G（作者貢獻）全讀。
- 類型：研究論文（ICML 2026）
- 研究設計或文件目的：把「飽和」定義為頂尖模型之間失去可靠的區辨力，用排行榜資料算一個考慮不確定性的飽和指數。資料：從 2022-01 到 2025-11 主要開發者（OpenAI、Anthropic、Google、Meta、Alibaba 等）的 61 份模型卡與技術報告中找出 190 個 benchmark，加上 Semantic Scholar 高被引論文；篩選條件為公開文件、至少出現在 5 份報告、評測流程清楚、純文字、有足夠排行榜資料（BIG-Bench 因缺資料被排除）；再為了假設檢定補進多語、模板化、開放式等類別，最後 60 個。23 位研究者依 schema 標註並二審。對五（v4 為六）個假設做分組比較，並用貝氏回歸做聯合分析。
- 定義與公式（§2）：
  - 定義（v4）：“A benchmark is saturated if the evaluated models cannot be reliably distinguished by their performance scores and any further improvements are not statistically distinguishable under the evaluation protocol.” 形式上兩條件：(1) 頂尖模型表現統計上相近；(2) 頂尖表現接近 benchmark 的經驗天花板。只有 (1) 成立叫「停滯」（stagnation），不叫飽和。v1 的定義後半是 “future improvements are not possible”，v4 改掉了。
  - 取前 k=5 名分數 s₁…s_k；SE(s) ≈ √(s(1−s)/n_eff)，n_eff = n^α，預設 α=0.5；SE_Δ 為第 1 名與第 k 名差距的標準誤；R_norm = (s₁ − s_k)/SE_Δ；S_index = exp(−R_norm²)。分五級：極低 <0.01、低 0.01–0.3、中 0.3–0.7、高 0.7–0.9、極高 ≥0.9。用最高分 s₁ 當天花板的經驗代理，不用 100%。
  - 不採「達到人類水準」為飽和定義：人類基準常常拿不到、量法不一，且達到人類水準後模型之間仍可能分得開。
- 會被引用的結果：
  - 盛行率：60 個中 29 個為高或極高飽和（S_index ≥ 0.7），其中 14 個極高（≥ 0.9）（§4，v1 與 v4 同）。原文：“Of the 60 benchmarks analyzed, 29 exhibit high or very high saturation (Sindex ≥ 0.7), out of which 14 fall into the very high category (Sindex ≥ 0.9).”
  - 年齡：24 個月內發布的 benchmark 飽和比例 42.9%，60 個月以上 54.5%；各年齡組平均 S_index 0.51、0.52、0.60。作者明說趨勢不顯著。原文：“While the trend is modest and not statistically significant at conventional thresholds, it is directionally consistent”。
  - 採用度：控制年齡後，被引次數與飽和不顯著相關（ρ=0.22，p=0.12）；被引成長率 ρ=0.13（p=0.37）；出現在技術報告的次數 ρ=0.05（p=0.73）。
  - 測試集大小：題數越多，飽和指數越低，聯合回歸中仍成立。
  - H1 公開 vs 私有測試集：分布相近，無顯著差異，否定 H1。原文：“Hiding test data does not appear to prevent saturation once benchmarks are widely adopted, rejecting hypothesis H1.” 樣本數 v1 為公開 52、私有 8；v4 為 56、4。
  - H2 英文 vs 多語：英文（N=44）原始飽和率較高，但多語 benchmark 平均年齡較輕（32.9 vs 48.9 個月），作者判定是年齡造成，不支持 H2。
  - H3 資料建構方式：各類別年齡差異顯著（p=0.0017）；群眾外包的較老、原始飽和率較高；專家策展的在相近年齡下飽和較低，ARC-AGI、BIG-Bench Hard 長期曝光仍未飽和；全合成的目前飽和低但都很新，無法做因果解讀。各組 N：專家 24、群眾外包 13、人工＋自動 18、全合成 5（Fig. 圖例）。
  - 封閉式（選擇題）vs 開放式：兩組年齡相當（p=0.40），飽和分布無明顯差異（N=28 vs 31，合計 59，少 1 個）。
  - 模板化 vs 非模板化：無顯著差異（N=14 vs 46，p=0.10）。
  - 已知資料品質問題：有記錄問題的 40 個飽和率較高，但平均也較老（51.5 vs 30.9 個月，p=0.01），作者說無法判斷方向。
  - 聯合貝氏回歸：R²_Bayes = 0.884 ± 0.012；年齡與測試集大小效果最一致；公開與否、輸出格式、模板化沒有可靠關聯（§4.2、App. F Fig. 5）；判別飽和與否的 AUROC 後驗中位數約 0.98（Fig. 6）。
  - 敏感度分析（v4 新增，Table 1）：k=3 vs 5 的 Spearman 0.92、同一級距比例 48.3%；α=0.5 vs α=0 為 0.88、23.3%；α=0.5 vs α=1 為 0.92、18.3%。作者結論是排序穩定、絕對值會移動。
  - 個案（v4 App. E Table 7）：Math-500（n=500）前 5 名分數 98.2–99.2，S_index 0.92 極高；LiveBench（n=1000）前 5 名差 1.09 分、表現約 79%，S_index 0.99 極高，作者解讀為模型層級停滯而非任務完成，並指出它本來設計就是定期更新以防污染；LiveCodeBench 0.77 高；TruthfulQA 0.55 中；Humanity's Last Exam（n=2500）差 11.4 分，S_index 0.22 低。
  - 設計建議（v4 §5.4）：(1) 提高評測解析度，讓模型間分差大於預期誤差，方法有加大題組、加難題、依子技能分層報告、多指標；(2) 動態更新：定期換題、對抗式收集、輪換隱藏子集；(3) 排行榜報信賴區間、前段分數離散度與壓縮指標，落在誤差內的小進步不應解讀為進步；(4) 設計時就寫好修訂、擴充或退役條件。
  - 飽和不一定是壞事（§5.4 “When is saturation desirable?”）：若 benchmark 有效且量的是清楚定義的能力，收斂到天花板代表真的會了；問題在於收斂是因為量測解析度不夠。原文：“the former signals progress, while the latter calls for revision or expansion.”
  - v4 新增 SWE-bench Verified 例子：引 OpenAI 指許多常失敗題目的測試太窄或太寬會拒絕正確解，平台期可能來自評測瑕疵而非能力上限。
- 作者自己列的限制（§6）：選題偏向已被廣泛採用的 benchmark；前 N 名快照可能漏掉評測稀疏的 benchmark；飽和指數依賴現有前沿模型評測，可能不完整、選擇性報告或更新不一；假設 benchmark 屬性不隨時間變，實際上會改版、換題；排行榜有多個版本、設定不同、常未更新；不確定性估計只適用於固定題組上的類準確率指標，Elo、pass@k、評審打分需另外估變異；只限純文字。
- 與摘要說法不一致處：
  - 屬性數：摘要說 “14 properties”；附錄的標註 schema（Table 4）列 17 個欄位，正文與附錄都沒列出是哪 14 個。
  - 假設數：v4 摘要後的 §4.1 與附錄 B 都說「五個假設」，但 v4 Table 2 列 H1–H6（新增模板化 H6）。v1 Table 1 列 H1–H5，但 v1 Fig. 1 的標籤用到 H6，且 H4、H5 的意義在 Table 1（H4＝輸出格式、H5＝年齡與採用度）與 Fig. 1（H4＝資料品質、H5＝輸出格式）不同；v4 Fig. 2 沿用同樣錯位的標籤。引用時應以 Table 2 文字為準，不用編號。
  - v4 摘要說 “resilience to saturation is impacted by expert-curation, not by public test data”；正文對專家策展的結論是 “may improve robustness to saturation, though age remains a cofounding factor”，且沒有報告專家策展的顯著性檢定。摘要比正文肯定。
  - v1 摘要寫 “expert-curated benchmarks resist saturation better than crowdsourced ones”，同樣比正文肯定。
  - 摘要 “rates increasing with age”／“nearly half” 與正文一致，但正文自己承認年齡趨勢 “not statistically significant at conventional thresholds”，而聯合回歸又說年齡是最一致的預測因子，兩個說法並存，正文沒解釋差異（可能是單變量分組 vs 連續變數回歸的差別）。
  - v1 → v4 私有 benchmark 由 8 個變 4 個，但結論文字沒變。
- 反證或後續修正（含我自己的方法檢查，標為推論）：
  - 【推論，作者未討論】α=0.5 會大幅放大不確定性。以 Table 7 驗算：LiveBench n=1000、表現約 79%，論文的 SE_Δ = 0.1028（約 10 個百分點）；若用一般二項標準誤（α=1），SE_Δ 約 0.018。前 5 名差距在 ±20 個百分點以內都會被判為「統計上相近」，這不是傳統意義的統計檢定。Table 1 也顯示 α 換成 1 時只有 18.3% 的 benchmark 留在同一級距。所以「近半飽和」這個比例高度依賴 α 的選擇；排序比較可信，絕對比例不宜當成事實引用。
  - 【推論】60 個樣本配上十多個預測變數與交互項，R² 0.884、AUROC 0.98 有過度擬合疑慮；論文沒報告交叉驗證或保留樣本的表現。
  - 公式驗算：Math-500 R_norm = 0.010/0.0338 = 0.296，S_index = exp(−0.0876) = 0.916，與表一致；HLE 0.114/0.0926 = 1.23，exp(−1.515) = 0.22，一致。
  - 同期其他研究方向一致：Deveci & Ataman 2025（https://arxiv.org/abs/2511.01365 ，只讀摘要）以 80% 門檻看三家模型 52 個 benchmark，27 個已過門檻，未過的 60% 是 2025 年新推出的；Ott et al. 2022（Nature Communications，3,765 個 benchmark）早已發現大部分 benchmark 很快趨向飽和或停滯。這些都支持「年齡相關」，但用的定義不同（固定門檻 vs 統計區辨力）。
  - OpenAI 2026-02 公告（下方補搜）提供「平台期可能是評測瑕疵」的實例：SWE-bench Verified 六個月只從 74.9% 升到 80.9%，審查後發現大量題目測試有問題。
- 對系列的用途：「飽和」篇的主要來源，可支撐：飽和的操作型定義（區辨力＋天花板，與停滯的區分）、「藏起測試集與改成開放式作答都擋不住飽和」、「題數越多越晚飽和」、「飽和本身中性，要分辨是真的會了還是量不出差異」；檢查表可收「設計時寫好退役條件」「報信賴區間與前段分數離散度」兩項。引用「近半飽和」時要附 α 的但書。

---

## 補搜精讀（1 篇）

### Why SWE-bench Verified no longer measures frontier coding capabilities（OpenAI，2026）

- 網址：https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/ （2026-02-23）
- 讀取狀態：✅
- 讀取紀錄：Exa `web_fetch_exa`（maxCharacters 60000）一次取得全文，約 17,000 字元，未被截斷；從標題讀到 Discussion 末段。
- 類型：官方文件（開發者部落格）
- 研究設計或文件目的：說明 OpenAI 為何停止報告 SWE-bench Verified。兩項分析：(1) 審查 o3 在 64 次獨立執行中無法穩定解出的 138 題（佔 500 題的 27.6%），每題至少 6 位資深工程師獨立審查，有疑慮者再由另一組複核；(2) 用 GPT-5 對 GPT-5.2-Chat、Claude Opus 4.5、Gemini 3 Flash Preview 做 15 輪自動紅隊，探測能否背出題目與標準補丁，由評審模型標嚴重度，「強」等級再人工複核。
- 會被引用的結果：
  - 138 題中 59.4% 有實質的測試或題目描述問題，使題目對最強模型或人類都極難或不可能解：35.5% 測試太窄（要求題目沒提到的實作細節，例：測試直接 import 題目沒提到的函數名 `get_annotation`）、18.8% 測試太寬（測了題目沒描述的功能，例：sympy 一個 PR 修三個 issue、題目只描述一個）、5.1% 其他。原文：“at least 59.4% of the audited problems have flawed test cases that reject functionally correct submissions”。
  - 近六個月最高分只從 74.9% 升到 80.9%。
  - 受測的所有前沿模型都能針對部分題目背出標準補丁或題目原文；GPT-5.2 解出 31 題被判定幾乎不可能的題目，其思考過程提到 Django 4.1 的 release notes。原文：“improvements on SWE-bench Verified no longer reflect meaningful improvements in models’ real-world software development abilities. Instead, they increasingly reflect how much the model was exposed to the benchmark at training time.”
  - 建議改報 SWE-bench Pro 公開子集；Pro 也有污染跡象，但較少、較輕，沒有模型背出完整標準補丁。
  - 兩條教訓：公開素材建的 benchmark 有污染風險（建議密碼保護發布、嚴守 canary string 過濾）；自動評分難做對，好的測試要「不在乎不重要的實作細節、又擋得住捷徑解」，找出這些問題花了多輪大規模人工標註。
- 作者自己列的限制：探測對象刻意排除推理模型，承認與 GPT-5 之間有能力落差；Pro 也不完美。沒有公布 OpenAI 自家歷年 Verified 分數中有多少來自污染。
- 與摘要說法不一致處：標題與導言說 “Tests reject correct solutions … at least 59.4% of the audited problems have flawed test cases that reject functionally correct submissions”，但細分項中 18.8% 是「測試太寬」（測了沒要求的功能，比較像題目描述不完整），5.1% 是其他，嚴格說「拒絕正確解」主要對應 35.5% 那一類。另外 59.4% 是 138 題的比例，不是全部 500 題。
- 反證或後續修正：OpenAI 2026-07 另發 “Separating signal from noise in coding evaluations”，二手報導提到 Datacurve 2026-05 稽核 SWE-bench Pro 評分誤差；都只讀到摘要，未核對一手（見 ABC 條）。
- 對系列的用途：同時支撐兩篇。「好 benchmark 的判準」：結果效度問題可以造成低估（ABC 的例子多半是高估），也就是誤差是雙向的；「飽和」：平台期可能是評測瑕疵加污染，不是能力到頂，可直接拿來示範 Saturation 一文「停滯 vs 飽和」的分辨。

---

## 補搜紀錄

| 查詢（工具） | 找到什麼 | 收或不收、理由 |
|---|---|---|
| Exa：critique or limitations of AI benchmark quality checklists (BetterBench, ABC, construct validity review) 2025 2026 | ABC 專案頁分數表；KDD 2026 workshop「Construct Validity Failures in Agentic AI Benchmarks」；Moghadasi & Ghaderi 2026 揭露程度稽核；“Measurement Without Validity” 2026；“Can Agent Benchmarks Support Their Scores?” 2026；Ralph et al. 2026 程式 benchmark construct validity；Eriksson et al. 2025 AIES 後設回顧 | ABC 專案頁的分數表收進 ABC 條（一手）。其餘都是延伸或同方向的研究，沒有推翻四篇結論；只讀到搜尋摘要，列在各條「反證或後續修正」並註明未精讀。名額留給下面直接牽涉本批結論的 OpenAI 公告。 |
| Exa：study measuring how fast LLM benchmarks saturate, follow-up to Ott et al. 2022 | Deveci & Ataman 2025（80% 門檻）；Benchmark Health Index 2026（106 個 benchmark）；evaleval GitHub repo；Ott et al. 2022（Nature Comms）；EvalEval 作者部落格 2026-06-30；MDPI MAKE 2026 綜述；“Deprecating Benchmarks: Criteria and Framework” 2025 | 方向都與 Saturation 一文一致（舊 benchmark 較飽和），但飽和定義不同，未精讀；列在 Saturation 條。作者部落格與 GitHub README 只用來確認版本與資料來源。Ott 2022 早於 2024，不算時效補搜。“Deprecating Benchmarks” 與退役條件直接相關，可留給「飽和」篇或檢查表批次再讀。 |
| Exa：OpenAI why we no longer evaluate on SWE-bench Verified flawed tests contamination | OpenAI 2026-02-23 公告；OpenAI 2026-07 “Separating signal from noise”；Latent Space 訪談；AI Weekly 與另一篇二手報導 | 收 OpenAI 2026-02-23 公告並精讀全文：它是一手官方資料，同時修正 ABC（誤差可為低估）並為 Saturation 一文的「停滯 vs 飽和」提供實例。7 月文章與 Datacurve 數字只讀到摘要，未收。 |
| arXiv abs 頁版本檢查（curl） | 2602.16763 有 v1–v4；2507.02825 有 v1–v5；2511.04703、2411.12990 只有 v1 | 因此改讀 Saturation v4 並列出與 v1 的差異；ABC 讀的就是 v5。 |

沒找到的：BetterBench 與 Bean et al. 的直接反駁或勘誤；四篇都沒有官方勘誤。
