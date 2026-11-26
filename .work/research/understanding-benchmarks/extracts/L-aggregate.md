# L-aggregate：聚合指數與綜合評測平台（精讀抽取紀錄）

- 批次：L-aggregate（聚合指數、benchmark 健康度、退役）
- 讀取日期：2026-11-23
- 讀取管道：arXiv 論文一律 Bash `curl -sL https://arxiv.org/html/<id>` 抓 HTML，再用 scratchpad 的 `scripts/h2t.py`（HTMLParser，數學式取 alttext）轉純文字依序讀（brief fallback 第 4 步；HTML 全文一次取得）。網頁（Artificial Analysis、Vals、Epoch data insight）用 Exa `web_fetch_exa`（maxCharacters 30,000–200,000）。jina `search_arxiv` 第一次呼叫就回「key out of quota」，之後未再用 jina；搜尋改用 Exa `web_search_exa`。
- 工作檔（不入 repo）：`/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/261adb0a-4096-4f86-81fd-0ed73b43ab71/scratchpad/L/`
- 本批共精讀 7 份：指定 4 項（ECI 方法原始論文 Rosetta Stone＋Epoch data insight、AA Intelligence Index 方法頁＋v5 公告＋Progress Index 方法頁、BHI、Deprecating Benchmarks）、指定加讀 2 份（聚合批評：Zhang & Hardt 2024；其他平台：Vals Index 方法頁＋Vals methodology 頁）、補搜 1 篇（One Capability or Many?, 2026）。
- 與 C 批分工：ECI 主頁、方法頁、2026-11 Bayesian 更新、FAQ 已在 `extracts/C-statistics.md` 第 102–149 行，本檔不重讀，只補原始論文與「ECI → 單一 benchmark 預期分數」的解讀頁。

---

### A Rosetta Stone for AI Benchmarks（2025）＋ Epoch data insight〈Epoch’s Capabilities Index stitches together benchmarks across a wide range of difficulties〉（2025）

- 網址：
  - 論文：https://arxiv.org/abs/2512.00193 （v1，2025-11-28；Anson Ho、Jean-Stanislas Denain、David Atanasov〔Epoch AI〕、Samuel Albanie、Rohin Shah〔Google DeepMind〕；Google DeepMind 出資；全文 https://arxiv.org/html/2512.00193 ；code https://github.com/epoch-research/benchmark-stitching ）
  - Data insight：https://epoch.ai/data-insights/interpreting-eci （Jaeho Lee、Luke Emberson，2025-11-06；CSV 更新 2025-11-13）
- 讀取狀態：✅
- 讀取紀錄：
  - 論文 HTML 轉文字約 100,700 字元（1,279 行）。依序讀 1–257 行（§1 引言、§2 方法〔2.1 模型、2.2 資料、2.3 最佳化〕、§3 結果〔3.1 能力與難度、3.1.1 解讀、3.1.2 是否各家優化不同目標、3.2 趨勢〔預測、演算法進步〕、3.3 偵測加速〕、§4 討論〔4.1–4.5 限制〕、§5 結論）；258–665 行為參考文獻，掃過未逐條讀；666–1279 行附錄 A（相關研究）、B（資料：38 個 benchmark 清單、模型篩選）、C（演算法進步替代設定）、D（合成資料）、E（穩健性：重疊門檻、錨點、隨機刪 benchmark、「被優化過」與否、clipped linear、2023 前資料）、F（模型適配）全讀。表格中的純數字列（Table 5–7、9、10 的數值）在轉文字時被濾掉，正文有引用的數字已逐一由正文取得。
  - Data insight 約 25,000 字元（Exa 全文），全讀（資料表＋Learn more：Data／Analysis／Limitations）。
- 類型：研究論文（ECI 的方法原型）＋官方資料解讀頁
- 研究設計或文件目的：用最簡單的「類 IRT」模型把不同 benchmark 放到同一條數線上。每個模型一個能力 C_m、每個 benchmark 一個難度 D_b 與斜率 α_b，假設 score(m,b) = σ(α_b (C_m − D_b))。資料是 Epoch benchmarking hub 的內部自跑＋外部收集分數，篩掉只有 ≤3 個 benchmark 分數的模型後，共 179 個模型、38 個 benchmark、1,324 個分數。用 scipy least squares＋L2 正則（強度 0.1）擬合。比較對象：METR time horizon（Kwa et al. 2025）、單一 benchmark 的 logit。
- 會被引用的結果：
  - **模型式與參數意義**（§2.1 Eq.1）：C_m − D_b = 0 時預測分數 50%；D_b 是「能力達到多少時這個 benchmark 拿一半分」；α_b 控制「題目難度分布有多寬」：α 大＝分數從 0 爬到 100% 只需很小的能力差（題目難度集中），α 小＝要跨很大範圍（題目難度分散）。原文："a difference C_m − D_b = 0 corresponds to achieving a score of 50%" 與 "the slope parameter α_b controls the spread in difficulty of the tasks on benchmark b"。
  - **為什麼可以「拼接」**：只要 benchmark 之間有足夠多「共同受測模型」，就能互相校準，不需每個模型都考同一套。原文（§1）："allowing us to compare models evaluated on different benchmarks, and across long periods of time"。（§4.2）"benchmarks must have enough models evaluated on them, with enough overlap of models across different benchmarks for this “stitching” framework to function."
  - **可識別性（為什麼要錨點）**（§2.3）：同一組資料可用 {kα, C/k, D/k} 或整體加常數 δ 擬合得一樣好，所以必須固定兩個自由度：論文把 WinoGrande 的斜率固定為 1、難度固定為 0。ECI 正式版改用模型錨點並重新縮放（C 批紀錄：Claude 3.5 Sonnet=130、GPT-5=150）。原文："we remove two degrees of freedom. We choose one benchmark (e.g. WinoGrande) and fix its slope α_WinoGrande=1 ... D_WinoGrande=0"。換錨點 benchmark，估計值變化很小（附錄 E.2 Figure 16）。
  - **與 IRT 的差別**（§4.4、附錄 A）：IRT 用逐題 0/1 資料，這裡用整個 benchmark 的平均分當輸入，代價是失去不變性：把一個 benchmark 任意拆成兩個難度相近的子集，等於給它兩倍權重。原文："if a benchmark B is arbitrarily split into two benchmarks B1 and B2 with similar difficulties, fitting the model with B1 and B2 is essentially tantamount to giving B double the weight"。（這是「聚合指數的權重藏在 benchmark 清單裡」的一手說法。）
  - **難度估計會偏高**（§3.1）：最新、最難的 benchmark 大多數資料點落在 sigmoid 平坦段，難度可能被高估、誤差也最大。原文："most of the data points tend to be at the “flat part of the sigmoid” in Equation 1, overestimating the benchmark’s true difficulty."
  - **能力分數的範例**（Table 1）：GPT-5-high 2.65、o3-high 2.51、Grok 4 2.51、Claude Opus 4（16K thinking）2.26、GPT-4o 1.77、GPT-4（2023-03）1.60、Claude 2.0 1.40（WinoGrande 難度＝0 的尺度）。
  - **怎麼解讀數字**（§3.1.1）：兩種方法，(1) 用「GPT-4 到 GPT-5 的一跳」當單位；(2) 對應到 METR time horizon：60% 模型擬合、40% 驗證，R²=0.85，轉換式 time horizon = exp(3.69 × C_m − 4.58)。單用 GPQA Diamond logit 只有 R²=0.75；38 個 benchmark 中 20 個與 METR 重疊不足 5 點，其餘 18 個單獨預測的中位 R²=0.62；SWE-Bench Verified 與 LiveBench 單獨預測 time horizon 的 R² 為負。（聚合優於單一 benchmark 的具體證據。）
  - **聚合指數掩蓋專長的一手證據**（§3.1.2、Figure 4）：有 >25 個分數的 benchmark 平均 R²=0.71、>40 個分數者 0.81；但 SWE-Bench Verified 上 Claude Sonnet 4.5 實際分數高於預測、Gemini 2.0 Flash 低於預測；GeoBench（多模態）則 Gemini 高於預測、多個 Claude 低於預測。原文："This provides weak evidence that Anthropic’s models are more heavily optimized for code and less for multimodal tasks, whereas Google DeepMind’s models are the reverse." §4.3 再引 Burnham（2025）PCA：兩個主成分解釋大部分變異，第二個是「Claudiness」（強 coding、弱 vision 與 math）。
  - **外推與預測**（§3.2.1）：前緣模型能力每年 +0.55 單位（95% CI 0.45–0.67），約等於 GPT-4.5 到 GPT-5-high 的差距，換算 time horizon 約 4 個月倍增（註 10：每年 ×7.6）。前 10 名模型彼此在 0.2 單位內（「彼此相差不到一年，可能只差幾個月」）。天真外推到 2028-10：再 +1.65 單位，time horizon 約 17 週（95% CI 2.6–30 週）。若在 2024-09 做同樣外推，會低估接下來一年（推理模型出現）。
  - **「需要多少 ECI 才能解某任務」**（data insight）：把擬合出的 α_b、D_b 代回公式，就能畫出「某 ECI 值在某 benchmark 的預期分數」曲線。原文："To back out the expected performance on each benchmark across a range of ECI scores, we simply plug in the estimated α_b and D_b values for each benchmark, and plot how performance changes as C_m varies." 資料表可當教學例：GPT-4（2023-03）ECI 125.69：GSM8K 0.92、OTIS Mock AIME 0.01；GPT-5（high）ECI 149.63：OTIS Mock AIME 0.91、FrontierMath Tier 1–3 0.27。同一個 ECI 值在簡單 benchmark 已飽和、在難 benchmark 幾乎為 0，這正是單一 benchmark 只能看見一段能力區間的原因。限制原文："The plotted 90% confidence intervals represent a confidence interval over the expected performance, not a prediction interval for the performance obtainable for a given ECI. In practice, individual models may perform above or below the 90% confidence interval."
  - **偵測加速**（§3.3）：合成資料中 2× 加速約 2–3 個月可偵測，但無加速時誤報率平均 38%（14–54%）。真實資料找到 2024-04 斷點，前後斜率 0.352 → 0.689/年（1.95×，未過 2× 門檻），與 METR time horizon 倍增從 7 個月變 4 個月（1.75×）一致。
  - **benchmark 組合敏感度**（附錄 E.3.1）：隨機刪掉部分 benchmark 重擬 100 次，年增中位數 0.54（95% 區間 0.43–0.64），與主估計 0.55 相近。
  - **「被優化過的 benchmark」是否灌水**（附錄 E.3.2）：定義「至少一家前沿實驗室公開報過分數」為 optimized-for；只取 2024 後 benchmark 比較，optimized-for 組估出的能力只高 0.12 單位（約 1/6 年進展），排列檢定 p 值 0.1–0.37（平均 0.22），不顯著。原文："our results do not provide statistically significant evidence of model developers optimizing for or strategically reporting benchmark scores."
  - **取各設定最高分**（附錄 B.2 註 20）："In cases where there are multiple models with different evaluation settings, we take the max over these model performances."（與 C 批 ECI 前處理「取各設定最高分」一致，源頭在此。）
  - **sigmoid 與 clipped linear 交叉驗證表現相近**（附錄 E.4）。
  - **GPT-3→4 vs 4→5**（附錄 E.5）：text-davinci-001 → GPT-4 約 +0.6 單位，GPT-4 → GPT-5（high）接近 +1 單位，模型認為後者是前者的近兩倍；作者承認早期模型資料稀疏、估計不可靠。
- 作者自己列的限制：(1) 單一數字無法完整描述能力（§4.3），存在專長差異；(2) 能力值難以直觀解讀，速度與價格完全不在模型內（§4.1）；(3) 繼承各 benchmark 的缺陷：缺乏真實性、偏重數學與推理、錯誤率造成天花板、分數高度依賴 prompt／scaffold／推理算力（§4.2）；(4) 用平均分不用逐題資料，拆分 benchmark 等於加權（§4.4）；(5) 加速偵測方法 ad hoc、誤報率高（§4.5）；(6) 演算法進步估計區間極寬（每年 1–50×），且假設與規模無關；(7) 殘差常態假設只部分成立（附錄 D.1：KS 檢定不拒絕、Shapiro-Wilk 等拒絕）；(8) 資料多在 2023 後，早期估計不可靠（附錄 E.5）。
- 與摘要說法不一致處：
  1. 摘要說框架 "works without assuming how capabilities evolve across time"，正文確實沒用時間或算力；但附錄 E.3.2 的 benchmark 篩選與 E.5 的「只用 2023 後資料」都是依時間做的分析選擇，結果（每年 0.55 vs 含早期資料的 0.42）對這個選擇敏感。
  2. Figure 5 圖說寫「三年 +1.8 單位」，§3.2.1 正文寫「+1.65 單位、到 2028-10 約 4.4」，附錄 E.5 又寫「Instead of 4.5 capability units in three years」：同一預測在文中出現 1.65／1.8 與 4.4／4.5 兩組數字，引用時用正文 §3.2.1 的 0.55×3=1.65。
  3. 論文規模是 179 模型／38 benchmark／1,324 分數；data insight（2025-11）寫 147 模型／39 benchmark／1,123 筆；C 批記錄的 ECI 頁與 Bayesian 報告又是 58–59 benchmark、252–258 模型。四個數字對應不同時點與篩選，引用要附日期與出處。
  4. 論文說 GPT-5-high 能力 2.65（WinoGrande=0 尺度），ECI 正式版 GPT-5 錨定為 150：兩者是同一方法的不同縮放，不能混用。
- 反證或後續修正：
  - Epoch 自己在 2026-11-04 改成 Bayesian 版（C 批已記）：改的理由正是舊法對每模型 4–10 個分數做 bootstrap 不可靠。
  - Alexander Barry〈Kicking the Tires of the ECI〉Part 1／2（2026-02，https://abstatisticalconsulting.substack.com/p/kicking-the-tires-of-the-epoch-capabilities ）：用公開資料與程式碼複現 ECI，指出 (a) 公開的 benchmark 清單過期；(b) 「只合併同一天發表的同名模型」與實作不符（144 組中 24 組合併了不同發布日的版本，例：DeepSeek V3 與 V3-0324；Gemini 1.5 Pro 因此被誤判為發布即 SOTA）；(c) bootstrap 只用 100 次、且非階層式；(d) 實際正則化強度比論文所寫弱約 200 倍。Epoch 確認 (a)(b) 並承諾修正。Barry 後來是 Bayesian 更新報告的共同作者。只讀到 Exa 摘要段，屬二手轉述 Epoch 回應，未精讀全文。
  - LessWrong〈General capability and capabilities generally have no good y-axis〉（https://www.lesswrong.com/posts/RxfTG5jcHH3azKQTA/ ，只讀摘要段）：IRT 能區分「模型變強」與「benchmark 變難／變窄」，前提是每個 benchmark 的連結函數形狀相同；放寬這個假設，能力只在單調轉換下可識別，ECI 的「等距」解讀（例如加速）因此是約定而非發現。
  - 補搜精讀的 Zhu（2026）〈One Capability or Many?〉（見下）：在 AA 排行榜上，第一因子佔共同變異 74.5%，與單一能力假設方向一致；但多因子表示預測被留出的 benchmark 仍優於單一指數。
- 對系列的用途：「聚合指數怎麼讀」一篇的核心機制來源：能力 vs 難度同一數線、50% 點與斜率的意義、靠重疊模型拼接、錨點決定尺度、拆 benchmark 等於加權、Claude 在 SWE-Bench 高於預測與 GeoBench 低於預測的專長殘差，以及「把 α_b、D_b 代回就能算出某 ECI 在某 benchmark 的預期分數」。

---

### Artificial Analysis Intelligence Index v5.0.1 方法頁＋〈Announcing Artificial Analysis Intelligence Index v5〉＋ Progress Index v1 方法頁（2026）

- 網址：
  1. https://artificialanalysis.ai/methodology/intelligence-benchmarking （Intelligence Benchmarking 方法頁，讀取時版本 v5.0.1）
  2. https://artificialanalysis.ai/articles/artificial-analysis-intelligence-index-v5 （2026-10-27 公告）
  3. https://artificialanalysis.ai/methodology/progress-index （Progress Index v1 方法頁，2026-10）
- 讀取狀態：✅（方法頁的長篇 prompt 範本與 Python／系統套件清單只掃過，見讀取紀錄）
- 讀取紀錄：
  1. 方法頁 Exa 全文約 163,600 字元（3,054 行），存檔分段讀：1–400 行全讀（Index 組成表、Additional Evaluations 表、原則、通用參數、9 個成分 evaluation 的實作）；401–2,398 行為 Additional Evaluation Details：GDPval-AA、Harvey LAB-AA、APEX-Agents-AA、AA-AnalystAgent、EnterpriseOps-Gym-AA、ITBench-AA、Code2Video-AA、MLCR-AA、CritPt v2、HealthBench、VIALS-AA 的實作段全讀；其中 419 個 Python 套件與 762 個系統套件的版本清單（約 1,200 行）以及各 evaluation 的 agent／judge prompt code block 只掃過、未逐行讀；2,399–2,637 行 Legacy Evaluations 全讀；2,638–3,054 行 prompt 範本與答案抽取 regex 全讀。
  2. 公告頁 Exa 全文約 9,000 字元，全讀。
  3. Progress Index 方法頁約 4,500 字元，全讀。
- 類型：官方文件（方法頁）＋官方公告
- 研究設計或文件目的：說明 AA Intelligence Index 由哪些 evaluation 組成、權重、自跑設定、各 evaluation 怎麼跑與怎麼評分、哪些已退役；Progress Index 說明為何另做一條跨版本可比的 IRT 尺度。
- 會被引用的結果：
  - **組成與權重（v5.0.1）**（方法頁組成表）：四大類各 25%。Knowledge Work：AA-Briefcase v1.1 15%、AutomationBench-AA 5%、GDP.pdf 5%；Coding：FrontierCode-AA 2.0 15%、Terminal-Bench 4.0 10%；Science：Terminal-Bench-Science 0.1 15%、CritPt v2（Hard Subset）10%；General：AA-Omniscience v1.1 15%（accuracy 10%＋1−hallucination rate 5%）、HLE-Diamond 10%。原文："The Intelligence Index is calculated as a weighted average across four categories: Knowledge Work (25%), Coding (25%), Science (25%), and General (25%)."
  - **自跑還是收集**：全部自跑。Index 頁原文："All evaluations are conducted independently by Artificial Analysis."（https://artificialanalysis.ai/evaluations/artificial-analysis-intelligence-index ，Exa 摘要段）。方法頁也說維護所有資料集的內部副本、用 e2b 沙箱、多數 agentic evaluation 用自家開源 harness Stirrup，Terminal-Bench 系列用 mini-swe-agent。
  - **私有比例**：公告原文："With v5, 60% of the Index is now based on evaluations with private test sets or held-out answers."
  - **通用設定**（General Testing Parameters）：溫度非推理模型 0、推理模型 0.6（除非實驗室另有建議）；最大輸出 token：非推理 16,384，推理模型用廠商公開的上限；API 失敗自動重試最多 30 次，30 次都失敗的題目人工檢視，「持續 API 失敗造成問題的結果不發布」；一般用 pass@1，多次重複則跨重複平均。
  - **reasoning effort 怎麼處理**：方法頁沒有一段專講受測模型的 effort 設定；做法是把每個 effort 設定當成獨立一列（排行榜上的「Claude Opus 5.5 (max)」「GPT-6 Astra (high)」等）。Progress Index 方法頁原文："We fit each effort variant as a separate model and represent each model by its highest-scoring variant." 公告指出 effort 的影響在 v5 變大，原文："Effort settings matter more in v5 than in v4.3. Claude Opus 5.5 scores 35 at low effort and 58 at max, at 10x the cost per Intelligence Index task ($0.98 vs $10.04). Claude Sonnet 5.5 spans 29 points from low to max, up from 20 in v4.3, and GPT-6.1 Sol's spread doubles from 10 to 20 points."
  - **非準確率分數怎麼併入**：AA-Briefcase 是 Elo，併入時「凍結在模型加入當下」並用固定區間正規化 clamp((Elo − 500)/2000)，Elo 錨定 GPT-5.5（medium）=1000。原文："the combined AA-Briefcase v1.1 Elo is frozen at the time of a model's addition and normalized as clamp((Elo - 500) / 2000) ... the fixed normalization range preserves stable Intelligence Index contributions over time. Artificial Analysis may update the reference parameters as models progress against the evaluation"。
  - **主動做難題子集**：CritPt v2 Hard Subset 是 70 題中去掉「七個前沿模型五次都答對」的 30 題後的 40 題私有清單。原文："selected to remove the 30 problems that seven frontier models solved in all five attempts at the time CritPt v2 was launched." AA-Omniscience v1.1 從 6,000 題減到 3,000 題，"We filtered out saturated questions, removed the 600 questions published in the v1 public set"，且 "Scores are not directly comparable with v1."
  - **版本更新怎麼處理舊分數**：Progress Index 方法頁原文："Its composition is updated periodically: evaluations are added as models improve, and evaluations that no longer differentiate leading models are retired. Each version of the Intelligence Index is therefore measured on a different set of evaluations, and scores across versions are not intended for long-run comparison." 解法是另做 Progress Index：IRT（每題或每 benchmark 一個難度與鑑別度）、加權 log loss、每個 benchmark 對每個模型權重相同、benchmark 至少 4 個模型、模型至少 4 個 benchmark、猜測基線重縮放為 0（GPQA Diamond 25% 計為 0）、錨點 o3-mini（high）=220 與 GPT-5.5（xhigh）=320、只用 AA 自跑資料；並註明參考 ECI（Ho et al. 2025）。
  - **退役紀錄（Legacy Evaluations）**：MMLU-Pro 與 LiveCodeBench 在 v4.0 移出；GPQA Diamond 在 v4.2 移出（仍單獨跑）；τ³-Banking 在 v4.3 移出；SciCode、AA-LCR v1.1、HLE（完整版）、CritPt（舊版）、GDPval-AA v2.1 在 v5.0 移出或被取代；Terminal-Bench Hard → 2.1 → 4.0；τ²-Bench Telecom 被 τ³-Banking 取代；MATH-500、AIME 2025 退出主動報告。原文："Evaluations we have retired, superseded, or removed from the Artificial Analysis Intelligence Index. We keep their methodology here for reference and historical comparability."
  - **HLE 的對抗式篩題偏誤**（Legacy HLE 段）：原文："the HLE authors disclose that their dataset curation process involved adversarial selection of questions based on tests with GPT-4o, Gemini 1.5 Pro, Claude 3.5 Sonnet, o1, o1-mini, and o1-preview ... We therefore discourage direct comparison of these models with models that were not used in the HLE curation process"。
  - **v5 結果與分項領先者**（公告）：Claude Opus 5.5（max）58、GPT-6 Astra（max）57、GPT-6.1 Sol（max）55；九項沒有任何一個模型全贏，Opus 5.5 領先 3 項，另外 5 個模型各領先其餘 6 項（例：Kimi K3.1 Pro 在 Terminal-Bench 4.0 67% 領先，但總分 46）。原文："no single model leads them all"。開源差距從 v4.3 的 3 分擴大到 12 分。
  - **成本與 token**（公告）：前 10 名每題成本差 13 倍以上（GPT-6.1 Terra max $0.96 vs Claude Fable 5.1 max $13.04）；v5 每個模型輸出 token 都比 v4.3 多，中位數 35k → 59k；四個 agentic evaluation 佔 55% 權重但約 90% 輸出 token。
  - **評分者也是模型**：多個 evaluation 用 LLM judge（GPT-5.6 Luna、GPT-6 Luna 等）或三家模型組成的 judge panel，並說明「同一 rubric 項固定由同一 judge 評」以維持可比性。
- 作者自己列的限制：方法頁開頭原文："Like all evaluation metrics, it has limitations and may not apply directly to every use case. However, we are confident that it is a more useful synthesis comparison between language models than any other metric in existence today." Index 以英文文字為主，視覺、語音、多語言另外評。多處註明 AA 版本與原作者版本「不可直接比較」（GDP.pdf、Harvey LAB、HLE-Diamond vs HLE）。
- 與摘要說法不一致處：
  1. 公告把 CritPt v2 寫成 "GPT-6 Astra leads at 72% on high effort"，其他項都報 max；同一份公告中各模型的「代表設定」不一致，引用時要寫設定名。
  2. 方法頁的 AA-Briefcase 段說 pairwise judge panel 是 Claude Opus 5、GPT-5.6 Sol、Gemini 3.8 Flash，rubric panel 是 Claude Opus 4.8、GPT-5.5、Gemini 3.1 Pro Preview；Harvey LAB-AA 與 MLCR-AA 又用另一組（GPT-6 Sol／6.1 Sol、Grok 4.7、Claude Opus 5.5）。judge 組合因 evaluation 而異，不能說「AA 用某一組 judge」。
  3. Index 頁目前寫「Claude Fable 5.2 (Max, Default Fallback) ... 65」，「Default Fallback」在方法頁找不到定義。
  4. 公告說 GDPval-AA 被移出；方法頁說 GDPval-AA v2.1 Elo 錨定 DeepSeek V4.1 Flash（max）=1600，而 AA-Briefcase 錨定 GPT-5.5（medium）=1000：兩個 Elo 尺度錨點不同，數字不能互比。
  5. 逐項對過組成表與公告的權重，一致。
- 反證或後續修正：
  - Capital & Compute〈Artificial Analysis Index v5: Which Models Dropped〉（2026-10-28，更新 11-10，https://capitalandcompute.net/blog/artificial-analysis-index-v5-which-models-dropped/ ，Exa 摘要段，二手）：25 個兩版都有分數的模型中 21 個下降，Kimi K3.1 Pro 55 → 46、GLM-5.3 45 → 32，只有三個 OpenAI 模型上升；中位數模型 −10 分。並統計 v4.1（6 月）、v4.2（9-04）、v4.3（9-07）、v5（10-27）：不到五個月四個版本。用途：示範「同一個模型換版本分數掉 10 分不代表變弱」。數字是第三方自行記錄的舊版分數，引用時要標二手。
  - Nathan Lambert〈Artificial Analysis v5 and the benchmarker's dilemma〉（Interconnects，2026-10-28，https://www.interconnects.ai/p/artificial-analysis-v5-and-the-benchmarkers ，只讀 Exa 摘要段）：評論者觀點，指出選哪些 benchmark 進指數本身就是立場，"you can always shift the numbers to match your narrative"；AA 收入來自替實驗室驗證結果（利益結構）；主張需要多個有不同偏好的指數並存。
  - Zhu（2026）〈One Capability or Many?〉（下方補搜精讀）用 AA 排行榜做因素分析。
- 對系列的用途：「聚合指數怎麼讀」一篇的主要實例：權重表、私有題比例、effort 每個設定分開列（同一模型 35 到 58 分）、Elo 類成分如何凍結與正規化、版本之間不可比（AA 自己說的）以及為此另做 IRT 尺度；「benchmark 退役」一篇可用 Legacy Evaluations 當「實務上怎麼退役」的時間線（MMLU-Pro、LiveCodeBench、GPQA Diamond、HLE 依序移出）。

---

### Benchmark Health Index: A Systematic Framework for Benchmarking the Benchmarks of LLMs（2026）

- 網址：https://arxiv.org/abs/2602.11674 （v1 2026-02-12、v2 2026-10-31、v3 2026-11-07；Longyuan Zhu、Hairan Hua、Linlin Miao、Wei Wang、Bing Zhao；SKYEVAL、Alibaba DAMO Academy；全文 https://arxiv.org/html/2602.11674 （v3）；code https://github.com/SKYLENAGE-AI/Benchmark_Health_Index ）
- 讀取狀態：✅（以 v3 為主；v1 對讀方法差異段）
- 讀取紀錄：v3 HTML 轉文字約 201,700 字元（4,368 行）。依序讀 1–367 行（摘要、§1–§8）；368–1,495 行為參考文獻，未逐條讀；1,496–2,200 行附錄 A（限制）、B（延伸相關研究）、C（EDR 門檻與 RCV 區間敏感度）、D（SDM 權重）、E（資料流程）、F（CRITIC）、G（雜訊／模型刪除／定向錯誤穩健性）、H（抗飽和參數敏感度）、I（覆蓋率與冷啟動偏誤）、J（個案與分領域）、K（運算資源）、L（2026-06 時序穩健性）全讀；Table 14（158 個 benchmark 完整排名）用程式解析成 158 列後逐列看過；檔尾 NeurIPS checklist 掃過。另抓 v1 HTML（約 115,400 字元）對讀 §3.4 Impact、§5 結果與 Table 1。附錄中部分表格純數字列在轉文字時被濾掉，正文與附錄文字有寫出的數字已取用；Table 12、13 另以原始行重組取得。
- 類型：研究論文（benchmark 的後設評估）
- 研究設計或文件目的：把 benchmark 本身當評估對象，從 2025 至 2026-04 發布的 117 個代表性模型技術報告中抽出 416 個候選評測集，過濾（至少 3 個模型有分數）後保留 158 個，計算三軸：(1) Capability Discrimination（S_Disc：EDR＝分差超過觀測範圍 2% 的模型配對比例＋RCV＝P90−P10 分數區間，用 SDM 標準差權重合併）；(2) Anti-Saturation（S_AS＝0.8×靜態抗性〔以 LOBO 能力加權的剩餘空間〕＋0.2×動態飽和投影〔OLS 趨勢外推 30 天〕）；(3) Impact（S_Imp＝以 LOBO 能力加權的採用覆蓋率開根號）。三軸再用 CRITIC 客觀權重合成 BHI。
- 會被引用的結果：
  - **指令說的「106 個 benchmark」是 v1**：v1 摘要 "By distilling 106 validated benchmarks from the technical reports of 91 representative models in 2025"；v3 改為 158 個 benchmark、117 個模型（2025 至 2026-04）；附錄 L 的 2026-06 更新再擴到 185 個 benchmark、133 個模型。
  - **權重**（§5.1）：CRITIC 得出 S_Disc 32.63%、S_AS 35.74%、S_Imp 31.63%；2026-06 更新為 32.72%／37.45%／29.83%（Table 13，最大變動 1.80 個百分點）。原文："These weights are snapshot-specific estimates rather than fixed constants."
  - **排名頂端（仍有鑑別力／尚有空間）**（Table 14）：1 Humanity’s Last Exam 0.6846、2 SWE-Lancer 0.5992（只有 3 個模型報分）、3 SimpleQA 0.5857、4 BrowseComp 0.5845、5 ARC-AGI-2 0.5787、6 LiveCodeBench-V6 0.5779、7 ZeroBench 0.5593、8 Graphwalks bfs>128k、9 SWE-Bench 0.5293、10 Graphwalks parents>128k；GPQA-Diamond 第 13（0.5124，S_AS 只有 0.1638，但 Impact 最高 0.8175、74 個模型報分）、FrontierMath 第 14、AIME 2025 第 16。
  - **排名底端（該退休）**（Table 3、Table 14）：HumanEval 113、MMLU 126、MBPP 129、GSM8K 140（BHI 0.2199，S_AS 0.0865）、BBH 141、HellaSwag 142、C-Eval 143、CMMLU 145、AIME 2026 146、ARC-Challenge 155、CMATH 156、EgoSchema 157、DocVQA 158（0.1192）。MATH-500 137、MMLU-Redux 139、IFEval 104、LiveBench 114。
  - **外部驗證**（§6 Table 3）：獨立定義的「已知飽和」組平均 BHI 0.225 ± 0.036，「活躍前沿」組 0.605 ± 0.045。原文："This supports directional consistency with external practice, though it should be interpreted as face validity rather than calibration against an absolute ground-truth health score."
  - **失效模式可拆解**（§6）：HellaSwag、ARC-Challenge 主要是天花板（S_AS 極低）；HumanEval、MBPP 仍有鑑別度但抗飽和低；C-Eval 三軸都差；GSM8K、MMLU 的 Impact 仍不低，低分主要來自飽和。原文："BHI not only ranks benchmarks, but also distinguishes failure modes including saturation-driven obsolescence, weak adoption, and reduced discrimination."
  - **高鑑別度但快飽和的例子**（附錄 J.1.2）：τ²-bench Telecom S_Disc 0.9005（很能排名次）但 S_AS 0.1108；Airline 子集 S_AS 0.4798。原文："while its logic is highly precise for ranking, procedural workflows are more susceptible to standardization once model architectures master the underlying patterns"。
  - **「改版可以救回」**（附錄 J.1.4）：MMLU-Pro S_Disc 0.4572、BHI 0.3919，高於 MMLU 的 0.3215／0.2502。HealthBench Hard（0.4546）已取代 HealthBench（0.3524）成為更有資訊的版本。
  - **三軸互補**（§5.2–5.3）：拿掉任一軸平均名次變動 11.3–16.2、最大 49–82 名；三軸兩兩相關都 <0.5（S_Disc 與 S_AS Spearman 0.46 最高）。
  - **覆蓋率不等於健康**（附錄 I Table 12）：報分模型數與 S_Imp 相關 0.913（Pearson），與 S_Disc 0.28、與 S_AS −0.03，與 BHI 0.47。新 benchmark：12 個月內發布者 36.6% 進入前四分之一，較舊者 21.6%。
  - **穩健性**（附錄 C、G、H、L）：EDR 門檻 0.5–5% Spearman 0.958–1.000；RCV 區間 P0–P100 到 P25–P75 至少 0.9922；高斯雜訊 σ=0.20 時 Spearman 0.8575；隨機刪 60% 模型仍 >0.92；2026-06 新資料對 2026-04 共同集 Spearman 0.9848，但前 10 名只有 7/10 重疊。
- 作者自己列的限制（附錄 A）：(1) 結論是「蒐集到的生態內」的相對訊號，不是絕對品質；報分少、協定特殊或版本變動快的 benchmark 估計不穩；(2) 技術報告異質，prompt、解碼、切分、汙染控制、指標變體揭露程度不一，不能取代單一 benchmark 的複現研究；(3) 抗飽和用線性趨勢與固定投影窗，真實生命週期可能非線性（新訓練法、工具使用或資料曝光會造成突然飽和）；(4) Impact 只看公開報告中的採用，看不到私下或內部使用；廣泛報告的 benchmark 可能在診斷價值下降後仍維持高採用；(5) 外部驗證只是 face validity，不是對獨立 ground truth 的 criterion validity。
- 與摘要說法不一致處：
  1. v1 摘要說三軸是 "three orthogonal and complementary axes"，v1 正文報兩兩相關 0.15–0.29；v3 摘要改成 "complementary"，正文 S_Disc 與 S_AS Spearman 0.46。v3 已修正「正交」說法。
  2. v1 的 Impact 由 N_Usage（含 6 個月半衰期的時間衰減）與 Community Heat（GitHub stars/forks、HuggingFace likes/downloads，2.5 年半衰期）用 CV 權重合成；v3 改成純「能力加權採用率」並刻意排除 stars／下載數。v1 排名與 v3 不同：v1 第 3 名是 ZeroBench、第 4 名 SWE-Bench-Verified，HumanEval 第 62、GSM8K 第 85（106 個中）；v3 HumanEval 113、GSM8K 140（158 個中）。引用排名要標版本。
  3. 摘要說能 "supporting the dynamic filtering and continuous updating of evaluation sets"，但全文沒有給「BHI 低於多少就退休」的門檻；「該退休」只是排名底端與獨立定義的 known-saturated 組，不是 BHI 算出的二元判定。
  4. SWE-Lancer 第 2 名只有 3 個模型報分（N_Usage=3），EDR 在 N=3 時只能取 {0, 1/3, 2/3, 1}（附錄 D.1 自己承認），高分有小樣本成分；正文未對此特別說明。
  5. 附錄 J 用 S_Sat 一詞指 S_AS，兩者是同一個量。
- 反證或後續修正：沒找到反駁 BHI 的研究。相關的平行工作：Akhtar et al.（2026）「六十個 benchmark 中近半已飽和、飽和隨年齡上升」（由 Zhu 2026 轉引，A 批飽和研究可能已涵蓋）。Pith 機器評論（https://pith.science/paper/2507.06434 ）是對另一篇的 AI 摘要，不採用。
- 對系列的用途：「benchmark 生命週期與退役」可用 BHI 的三軸（還能分高下、還有空間、還有人用）當判準框架，並用 GSM8K、HellaSwag、MMLU 在底端、HLE／SimpleQA／BrowseComp 在頂端當例；GPQA Diamond「抗飽和只有 0.16 但採用最高」是「大家還在報、但已經快量不出差距」的好例子。

---

### Deprecating Benchmarks: Criteria and Framework（2025）

- 網址：https://arxiv.org/abs/2507.06434 （v1，2025-07-08；Ayrton San Joaquin、Rokas Gipiškis、Leon Staufer、Ariel Gil；AI Standards Lab、Vilnius University、TU Munich／LMU；全文 https://arxiv.org/html/2507.06434 ；機構頁 https://aistandardslab.org/deprecating-benchmarks-criteria-and-framework/ ）
- 讀取狀態：✅
- 讀取紀錄：HTML 轉文字約 43,200 字元（384 行）。依序讀 1–124 行（摘要、§1 引言、§2 文獻回顧、§3 七項退役準則、§4 三階段框架、§5 EU 實作藍圖、§6 八項建議、影響聲明、貢獻聲明）；125–322 行參考文獻掃過；323–384 行附錄 A（三種情境）、附錄 B（SWE-bench 與 SWE-bench Lite 的部分退役報告範例）全讀。
- 類型：研究論文（立場／政策框架；cs.CY）
- 研究設計或文件目的：回顧 benchmark 實務文獻，提出「何時」該全部或部分退役 benchmark 的準則，以及「怎麼」退役的流程；對象是 benchmark 開發者、使用者、治理機構與政策制定者。非實證研究，沒有資料分析。
- 會被引用的結果：
  - **為什麼需要退役**（§1）：原文 "Some persist simply because they are historically tied to influential models, thereby functioning as de facto standards despite their limitations"；"AI labs have little incentive to deprecate benchmarks that support the superiority of their models"；"With no regulatory mandate to reassess benchmark validity, the market defaults to inertia"。退役的定義："By deprecation, we mean to avoid the use of the target benchmarks for evaluation of current and future models."
  - **七項退役條件**（§3），分兩類：量化訊號（飽和、汙染、統計偏誤）與質性問題（標註錯誤率高、任務過時、假設失效、語意漂移）。例子：MMLU、GSM8K、HumanEval 飽和；MMLU Virology 子集 57% 的題目有錯、全 MMLU 6.49%（引 Gema et al. 2024）；Needle-in-a-Haystack 只測單一事實檢索，不代表多段檢索＋推理的真實 RAG。原文強調是軟準則："They should be treated more like “soft” guidance, similar to case law"，且 "determining concrete thresholds for these criteria is beyond the scope of this paper."
  - **全部退役 vs 部分退役（升級）**（§4.1）：統計偏誤與汙染可部分退役（重抽樣平衡類別、加入隨機變數、移除外洩資料）；任務過時與假設失效通常要全部退役；標註錯誤看比例，少量可修正後部分退役，大量則整個子集或整個 benchmark 退役。
  - **三階段流程**（§4）：Assessment（定期追蹤飽和曲線、文獻批評、社群回饋；設申訴機制與獨立專家審查）→ Reporting（退役報告：理由與風險、未來怎麼用、時程、替代 benchmark、**過去結果怎麼解讀**、授權研究用途、申訴流程、執行者聯絡方式）→ Notification（在原發表管道公告，目錄與論文中加視覺標記，類似論文撤稿；升級版用版本控制區分）。
  - **退役後舊分數怎麼辦**（附錄 B 範例，情節虛構但缺陷屬實）：SWE-bench v1.0 範例寫 "Historical results from SWE-Bench v1.0 are no longer valid for comparison due to identified flaws. Users should transition to SWE-Bench Verified for future evaluations."；SWE-bench Lite 範例寫「歷史結果應重新評估：排除退役題、用 SWE-Bench-Lite-S 重估」。引用的真實缺陷：OpenAI 標註後 68.3% 的 SWE-bench 樣本被濾掉（38.3% 題目敘述不清、61.1% 單元測試可能錯判正確解）；SWE-bench Lite 有 4.3% 題目敘述含正確 patch、10.0% 缺關鍵資訊、5.0% 含誤導解法。
  - **第三方退役**（§4、附錄 A）：開發者不作為或已解散時，治理機構（政府、產業聯盟、公益團體）可自行列「退役清單」。
  - **八項建議**（§6）：benchmark 版本控制（建議 DOI，版本號緊跟名稱；換版日之前測的結果視為舊版）、建立時就要有退役計畫、設聯絡窗口、依情境建立退役清單、清單透明可驗證、說明每項列入理由、把「不用已退役 benchmark」列為合規要求、設申訴機制。
  - **EU 實作藍圖**（§5）：建議 EU AI Office 依 AI Act 第 15.2、51.3 條，針對 CBRN 等安全關鍵能力建立退役清單；在歐盟商用的模型收到通知後要更新 model card。
- 作者自己列的限制：準則清單「刻意不完整」，門檻不在範圍內；影響聲明原文："Benchmark deprecation is discussed as a potential solution, but it may not be sufficient on its own to address the problems highlighted in this paper." 對公開 vs 私有 benchmark 的優劣保持中立（註 3）。
- 與摘要說法不一致處：逐項對過，沒有。摘要說提出「準則」與「框架」，正文都有，但沒有量化門檻，摘要也沒聲稱有。附錄 B 的退役時程與發布者是虛構的（作者在表註明 "deprecation details are fictional, while the mentioned flaws in the benchmarks are real"），引用時不能寫成 SWE-bench 真的被官方退役。
- 反證或後續修正：沒找到反駁或勘誤。實務對照：AA Intelligence Index 的 Legacy Evaluations 與 Vals Index 的 Updates（下方）都是「退役後保留方法說明、新分數不與舊版比」的做法，大致符合本文的 Reporting 精神，但沒有正式退役報告或申訴機制。BHI（上方）提供了本文說「不在範圍內」的量化訊號。
- 對系列的用途：「benchmark 的生命週期與退役」一段的框架來源：七項退役條件（飽和只是其中一項）、全部 vs 部分退役、退役後要說清楚「舊分數還能不能比」，以及「為什麼沒人主動退役」（實驗室與開發者的誘因）。

---

### Inherent Trade-Offs between Diversity and Stability in Multi-Task Benchmarks（2024）〔指定加讀：聚合指數的批評〕

- 網址：https://arxiv.org/abs/2405.01719 （v2，2024-05-06；Guanhua Zhang、Moritz Hardt；Max Planck Institute for Intelligent Systems；ICML 2024；全文 https://arxiv.org/html/2405.01719 ；code https://socialfoundations.github.io/benchbench/ ）
- 讀取狀態：✅
- 讀取紀錄：HTML 轉文字約 79,700 字元（1,100 餘行）。依序讀 §1 引言、§1.1 貢獻、§2 相關研究、§3 社會選擇觀點與 Arrow 定理、§4 多樣性與敏感度定義與演算法、§5 cardinal 實驗、§6 ordinal 實驗、§7 結論（全讀）；參考文獻掃過；附錄 A（各 benchmark 細節）全讀；附錄 B（Arrow 定理證明）讀到記號定義段，證明本體未逐步驗證；附錄 C（最少需幾個 task 才能重現總排名）全讀。圖中數值只取正文有寫出的部分。
- 類型：研究論文（理論＋實證）
- 研究設計或文件目的：把多任務 benchmark 類比為選舉（模型＝候選人、task＝選民），區分 cardinal（平均分數，例：BIG-Bench、OpenLLM）與 ordinal（只用各 task 名次，例：HELM 的 mean win rate）。定義「多樣性」（各 task 排名不一致的程度，用反向 Kendall's W）與「敏感度」（不改變模型相對表現的無關變動〔cardinal：注入標籤雜訊；ordinal：加入無關模型〕最多能讓總排名變多少，用 Kendall τ 與最大名次變動 MRC）。對 7 個 cardinal 與 11 個 ordinal benchmark 計算。
- 會被引用的結果：
  - **Arrow 定理直接適用於 ordinal 聚合**（§3 Theorem 3.1）：沒有 ordinal benchmark 能同時滿足非獨裁、Pareto、無關選項獨立（IIA）與普遍性；mean win rate 違反 IIA。三模型九 task 的例子：加入第四個模型後，原本三者在每個 task 的相對順序都沒變，總排名卻從 L1=L2>L3 變成 L2>L1>L3。原文："adding irrelevant models to a benchmark can perturb the order of top contenders."
  - **cardinal 聚合的問題**（§3）：各 task 分數尺度不同時，總分可能被單一 task 主導（等於違反非獨裁）；即使尺度相同，容易進步的 task 也會被不成比例地獎勵。原文："a cardinal benchmark would then reward improvements in the easier task more than in the harder task, leading to discrepancies in how improvements are valued."
  - **多樣性與穩定性此消彼長**（§5、§6、Figure 2–5）：cardinal benchmark 多樣性與敏感度的 Pearson 相關 0.96（τ）與 0.77（MRC）；ordinal 為 0.61 與 0.50。原文："The more diverse a multi-task benchmark, the more sensitive to trivial changes it is."；"all existing multi-task benchmarks strike a trade-off no better than a linear interpolation between random and constant."
  - **具體數字**（§5）：OpenLLM 多樣性 W=0.82、敏感度 τ=0.54、MRC=0.86；GLUE W=0.16、τ=0.11、MRC=0.72；SuperGLUE W=0.13、τ=0.12、MRC=0.33。保留 10% 資料不加雜訊（ε=0.1）時，非基線 benchmark 的 MRC 為 0.18–0.71；OpenLLM 在 ε=0.5 仍有 τ=0.13、MRC=0.45。ordinal（§6）：超過一半的 benchmark MRC ≥ 0.5；HEIM-aesthetics-auto MRC 0.5、τ 0.4。
  - **模型越多越不穩**（§6）：原文："as the number of candidate models increases over time, the aggregated final rankings could be more unstable."
  - **多樣性高的 benchmark 需要更多 task 才能重現總排名**（附錄 C）：OpenLLM、HEIM-quality-auto 需要最多；VTAB、HEIM-quality-human 少數 task 就夠，暗示低多樣性 benchmark 有冗餘 task。
- 作者自己列的限制：ordinal 敏感度只考慮「前 20% 模型＋加入其餘 80% 中的子集」，是 IIA 違反程度的下界；最佳化近似可能找不到最大值，計算出的距離是下界；HELM／HEIM 有缺值，用 KNN 補值算多樣性，可能失準（解釋 ordinal 相關較低）；附錄 C 的分析受 task 數影響。
- 與摘要說法不一致處：摘要說 "the aggregated rankings of existing benchmarks are highly unstable under irrelevant changes"，正文 GLUE／SuperGLUE 的 τ 只有 0.11–0.12，「高度不穩」主要是 OpenLLM 與部分 HEIM；摘要的概括偏強。其餘逐項對過，一致。
- 反證或後續修正：
  - Gordienko et al.（2026）〈How Hard is it to Rig a Benchmark?〉（https://arxiv.org/abs/2605.23628 ，只讀 Exa 摘要與部分正文段）：從「操弄」角度比較聚合規則：在 BBH（24 task、4,507 個模型）上要把一個模型推到第一，算術平均中位數只需改善 13 個 task（54%），mean win rate 需要 22 個（92%）；結論：mean win rate 最難被操弄，但正如 Zhang & Hardt 所說它依賴比較對象集合。兩篇合讀：沒有同時抗雜訊、抗操弄、不受新模型影響的聚合規則。
  - Zheng & Yang（2026）〈Are Near-Tied LLM Rankings Robust to Family-DIF-Guided Benchmark Recomposition?〉（https://arxiv.org/abs/2609.00482 ，只讀摘要與 Table 1）：整體排名穩（τ_b 0.900–0.948），但原本相差 1 個百分點以內的跨家族模型配對，換題目組成後 30.9–47.1% 會反轉（四個 benchmark）。
  - 沒找到推翻 trade-off 結論的研究。
- 對系列的用途：「聚合指數的失真」一段的理論與實證來源：權重或成分的小變動（甚至加入不相干的模型）就能改變前幾名；越想涵蓋多種能力（多樣性高），總排名越容易被無關變動推動。

---

### Vals Index（Vals AI，2026）〔指定加讀：其他綜合平台的方法頁〕

- 網址：
  1. https://www.vals.ai/benchmarks/vals_index （Vals Index Leaderboard and Methodology，頁面更新 2026-11-19，v2.2）
  2. https://www.vals.ai/methodology （Vals 整體評測方法頁）
  3. 對照用：https://www.vals.ai/benchmarks/vals_index_v2 （v2 封存頁，Exa 摘要段）
- 讀取狀態：✅
- 讀取紀錄：1. Exa 全文約 14,000 字元，全讀（排行榜 43 列、分項表前 15 列、Motivation、Results、Methodology、Component Scores、Updates 至 2026-05-04）；2. Exa 全文約 8,500 字元，全讀；3. 只讀 Exa 摘要段（方法段與 1 相同，差在沒有 Tax）。
- 類型：官方文件（方法頁＋排行榜）
- 研究設計或文件目的：用美國各產業佔 GDP 的比例當權重，把金融、程式、法律、稅務四個領域的 agentic benchmark 合成一個「潛在經濟影響」指數。
- 會被引用的結果：
  - **權重公式**（Methodology）：Finance＝AVG(Finance Agent v2.1, EMB v1.1)、Coding＝AVG(Terminal-Bench 4.0, Vibe Code Bench v1.1, Code Migration v1.1)、Legal＝AVG(Legal Research, HLAB-Vals-1.1)、Tax＝Tax Agent Bench；Vals_Index＝(8.0×Finance＋5.6×Coding＋1.2×Legal＋0.5×Tax)/15.3。權重來自 BEA 各產業附加價值佔 GDP：金融保險約 8.0%、資訊業約 5.6%、法律服務約 1.2%、會計稅務約 0.5%。原文："While this represents a vast oversimplification of how AI might impact the economy, it provides a useful proxy"。換算後金融約佔 52%、稅務約 3%。
  - **與 AA 的設計對比**：原文 "Unlike existing aggregated metrics that treat all capabilities equally, the Vals Index is designed to reflect the potential impact of AI models on the U.S. economy." 8 個成分中 6 個私有、2 個公開；公開 benchmark 也由 Vals 用同一 harness 自跑（methodology 頁："we run every model ourselves under the same harness and settings"）。
  - **權重掩蓋分項的實例**（Accuracy by Benchmark 表，2026-11-19）：第 1 名 Claude Fable 5.2 總分 71.31%，但 HLAB-Vals-1.1（法律）只有 5.0%、Tax 32.1%；第 2 名 Gemini 4 Neon 70.87%，HLAB 19.6%、Tax 54.9%。法律與稅務合計權重約 11%，所以法律分項差 4 倍、稅務差 23 個百分點，總分只差 0.44 個百分點。
  - **與 AA 排名不同**：Vals 2026-11-19 前五為 Claude Fable 5.2、Gemini 4 Neon、Claude Sonnet 5.5、Gemini 4 Carbon、Claude Opus 5.5；GPT-6.2 Astra 第 8、GPT-6 Astra 第 11。AA v5 公告當時（10-27）GPT-6 Astra 第 2。兩者資料日期不同、權重哲學不同，但可示範「換一個聚合方式，同一批模型排名就變」。
  - **只有成分齊全才列入**：Vals 部落格〈How Much Does Reasoning Effort Affect Score and Cost?〉（2026-11-03，Exa 摘要段）原文 "A model appears in the Index only when all eight benchmarks have a score."（與 ECI 允許缺值、靠 IRT 補位的做法相反。）
  - **版本更新紀錄**（Updates）：2026-05-04 移除 CaseLaw 整個 Law 部門，理由 "had become saturated, and was no longer providing useful differentiation between models"，分母從 3.7 改 3.4；2026-08-13（v2）移除 SWE-Bench Verified，理由 "SWE-Bench has become saturated"；2026-09-25（v2.1）加入 Tax、Terminal-Bench 2.1 換 4.0，"Terminal-Bench 4.0 is substantially harder, so index scores are lower than under v2"；2026-10-19（v2.2）多個成分升版。半年內至少 6 次組成變動。
  - **子集抽樣**（Component Scores）：Code Migration 在指數中只用 120 個 CLI 任務中的 50 個＋全部 10 個 COBOL 任務（75%／25%），以蒙地卡羅搜尋選子集，對完整結果 Spearman 0.99、平均絕對誤差 0.8 點、名次最多變 3 名；換到 v1.1 時 MAE 1.4 點。
  - **誤差棒怎麼合成**（methodology 頁）：單次跑用逐題 SEM（引 Miller 2024）；多次跑（目前 3 次）用跑次間 SEM；組合 benchmark 用加權變異合併 SE_overall = sqrt(Σ w_k² SE_k²) / Σ w_k。原文提醒這些誤差棒 "do not reflect variability across prompts, seeds, deployment settings, or the stochastic nature of LLM generation."
- 作者自己列的限制：GDP 權重是 "a vast oversimplification"；誤差棒不涵蓋 prompt、seed、部署設定的變異。
- 與摘要說法不一致處：
  1. 頁首寫「six private and two public benchmarks」，但 Methodology 只逐項標出 Code Migration、EMB、Legal Research、Tax Agent 為 private；可確定公開的只有 Terminal-Bench 4.0，另一個公開者是哪一個頁面沒寫（HLAB 在 AA 方法頁被描述為 Harvey 的私有 120 題資料集，不像是公開那個）。引用「6 私 2 公」時寫成 Vals 自述。
  2. 2026-05-04 的更新寫 coding 權重 "0.25"、分母 3.7 → 3.4，與現行 GDP 權重（5.6、分母 15.3）是不同時期的權重體系，頁面未說明權重何時從 0.x 改成 GDP 百分比。
- 反證或後續修正：HoneyHive〈Vals Index〉（2026-11-20，https://www.honeyhive.ai/learn/vals-index ，Exa 摘要段，二手）列出限制：單一數字混合四個部門、權重是一種選擇、指數為專有無法自行重跑、版本常變。Capital & Compute 文章建議把 AA 與 Vals 對照，「ranks the same models differently」。
- 對系列的用途：「聚合指數怎麼讀」可用 Vals 當對照組：同樣是綜合分數，AA 四類各 25%，Vals 依 GDP 讓金融佔一半以上；排名第一的模型在法律分項只有 5%，示範聚合如何掩蓋特定能力。

---

### One Capability or Many? Structural and Predictive Tests of Benchmark Validity Disagree About Economic Benchmarks for Frontier AI（2026）〔補搜精讀：聚合成單一指數是否丟資訊〕

- 網址：https://arxiv.org/abs/2608.29420 （v1 2026-08-29、v2 2026-09-25；Louis Yiven Zhu，University of Oxford；全文 https://arxiv.org/html/2608.29420 ；code https://github.com/louisyzhu/frontier-ai-economic-validity ；分析計畫預先登錄 https://doi.org/10.17605/OSF.IO/VD34J ）
- 讀取狀態：✅
- 讀取紀錄：v2 HTML 轉文字約 94,300 字元（778 行）。依序讀 1–131 行（摘要、§1–§6、致謝、生成式 AI 使用聲明、可重現性聲明）全讀；132–455 行參考文獻掃過；456–778 行附錄 A–N 全讀文字段（表格純數字列被濾掉，正文有寫出的數字已取用）。
- 類型：研究論文（心理計量／建構效度，預先登錄假設）
- 研究設計或文件目的：把 Artificial Analysis 排行榜 2026-07-06 快照（SHA-256 固定）當題目×受試者矩陣：548 個模型設定，依預先訂好的覆蓋規則留下 421 個設定、12 個 benchmark（4 個「經濟型」：GDPval、Terminal-Bench v2.1、τ³-Banking、τ²-Bench；8 個學術型）。結構檢定：探索性因素分析＋Horn 平行分析＋以發布日期殘差化；預測檢定：留一 benchmark 出去（LOBO），比較「單一平均指數」與「k 個因子」預測被留出 benchmark 的誤差。
- 會被引用的結果：
  - **一個主因子吃掉大部分變異**（§5.1）：第一主成分佔總變異 79.4%；三因子抽取中第一因子佔共同變異 74.5%；平行分析只保留 1 個因子。依基礎模型去重後升到 90.2%。12 個 benchmark 兩兩 Spearman 平均 0.79、全部為正。
  - **這個主軸很大一部分是發布時間**（§5.2）：第一因子分數對發布日期的 R²=0.505。原文摘要 v1："the leading axis of capability is substantially a time trend"。以日期殘差化後第一因子佔比 74.5% → 59.6%（降 14.9 點；bootstrap 95% 區間 −5.3 到 +32.7，跨零）；去重後降 24.1 點。加入訓練算力不再加深修正。
  - **經濟型 benchmark 不構成獨立因子**（§5.3）：依預先規則不成立；只有在規則不支持的三因子過度抽取下，四個經濟型 benchmark 才集中在同一因子（GDPval 0.84、Terminal-Bench v2.1 1.01、τ³-Banking 0.54、τ²-Bench 0.50）。
  - **但單一指數會丟失可預測的結構**（§5.4 Table 1）：單一平均指數預測經濟型 benchmark 的 R² 已達 0.771（RMSE 0.474），k 因子表示改善到 R² 0.808（RMSE 0.433）；ΔMSE 合併 +0.037（95% 區間 +0.019～+0.055），去重後 +0.038；四個中三個個別顯著（τ²-Bench 區間跨零）。對其餘 8 個學術 benchmark 也平均改善 0.048。只在線性學習器（ridge、elastic net）成立，樹模型反轉。原文："A single index reproduces most of what distinguishes models, 77% of economic-block variance out of sample, and that agreement does not license the claim that the economic benchmarks add nothing at the margin."
  - **對讀排行榜的建議**（§6）：原文 "A leaderboard ranking models released months apart is ranking them largely along an axis that tracks release date. A comparison within one release window holds that trend fixed, as a buyer choosing between contemporaneous models needs." 並主張分項分數應與總分並列報告。
  - **給 benchmark 建造者的兩步檢定**（§6）：先以日期殘差化做因素分析看新 benchmark 是否自成一因子，再做 LOBO 預測看多因子是否優於單一指數；兩者都過才算「多量到一個構念」，都不過則是「在重複量進步趨勢」。
- 作者自己列的限制（§6、附錄 C、J）：經濟因子來自探索性過度抽取，需在獨立快照上做驗證性因素分析；觀察性研究，日期包含真實進步，無法分離；經濟型 benchmark 覆蓋稀疏（只有 96 個設定有完整 12 項），不確定性大；只有一個排行榜一個日期；樣本是廠商選擇送測的模型（便利樣本）；H2(ii) 門檻是根據對 Kearns（2026）的錯誤解讀訂的（附錄 J 自承）；計畫中的 effort 變體分析（R5）未執行。
- 與摘要說法不一致處：
  1. v1 摘要說 "the leading axis of capability is substantially a time trend"、"Removing the date trend lowers that share by 14.9 percentage points"，但正文 H2(ii)（≥15 點）判定「未達成」，且 bootstrap 區間跨零；v2 摘要改為較保守的 "tracks release date"。引用「主因子主要是時間趨勢」時要附上這個不確定性。
  2. v1 摘要結論 "the evidence does not support treating them as a distinct latent capability"，v2 標題與摘要改強調「結構與預測兩種檢定意見相反」；兩版重點不同，引用以 v2 為準。
  3. 多因子優勢只在線性學習器成立，摘要有寫明（"an advantage that reverses for tree learners"），一致。
- 反證或後續修正：作者引用 Kearns（2026）在 Open LLM Leaderboard 上得到單一因子 72%；Maimon et al.（2026）在 60 模型×44 benchmark 上得 8 個因子；Burnell et al.（2023）得 3 個因子：因子數高度依賴保留規則。與 Rosetta Stone 的「Claudiness」第二主成分（Burnham 2025）方向一致：主因子很強，但不是全部。
- 對系列的用途：「聚合指數掩蓋什麼」的實證：單一指數能解釋約八成差異，但留出 benchmark 的預測顯示仍有指數抓不到的結構；且隔幾個月發布的模型比較，大部分差距來自「新」，同期模型的小差距要謹慎讀。

---

## 補搜紀錄

用 Exa `web_search_exa`（jina 額度用完）。

| 查詢 | 找到 | 收或不收、理由 |
|---|---|---|
| "A Rosetta Stone for AI benchmarks Epoch AI arXiv paper item response theory" | arXiv 2512.00193、Epoch 出版頁、Samuel Albanie 頁、Chris Ge 部落格筆記 | 收 arXiv 全文（指定來源 1）；部落格是二手筆記不收 |
| "Deprecating Benchmarks: Criteria and Framework arXiv 2025" | arXiv 2507.06434、AI Standards Lab 頁、Pith 機器摘要 | 收 arXiv 全文；Pith 是 AI 自動評論、未經人審，不收 |
| "Artificial Analysis Intelligence Index v5 announcement changes ... reasoning effort" | AA v5 公告、AA 方法頁、Capital & Compute、heise、Ridge、ISD、braindetox | 收 AA 公告（一手）；Capital & Compute 的 v4.3.2→v5 對照表只當二手旁證寫入「反證或後續修正」；其餘新聞稿只轉述公告，不收 |
| "Vals Index methodology ..." | Vals Index 頁、v2 封存頁、Vals methodology 頁、HoneyHive、Vals 部落格 reasoning effort | 收 Vals Index＋methodology（指定加讀）；HoneyHive 二手不收；Vals reasoning-effort 部落格只取一句「八項齊全才列入」 |
| 2024 後更新：「criticism of composite AI capability indices like ECI or AA Intelligence Index, 2025 2026」 | Lambert〈AA v5 and the benchmarker's dilemma〉、Montana Research Foundation 評 ECI、Barry〈Kicking the Tires of the ECI〉Part 1／2、LessWrong〈no good y-axis〉、Zhu 2608.29420、Epoch Bayesian 報告 | 精讀 Zhu 2608.29420（補搜第 1 篇：唯一用預先登錄設計、直接測「單一指數丟了什麼」的一手實證）；Barry 複現文與 LessWrong 只讀摘要段，寫進 Rosetta 的「反證」欄（Barry 指出的問題已由 Epoch 確認，且其後 Bayesian 更新由 Barry 共同撰寫，C 批已讀）；Lambert 是評論觀點，寫進 AA 的「反證」欄；Montana Research Foundation 為二手評論，不收 |
| 反證／限制：「arXiv 2025 2026 LLM leaderboard aggregation weighting sensitivity rankings change mean win rate IRT」 | Gordienko et al. 2605.23628（操弄聚合規則）、Balance of Benchmarks 2608.30044（依語意密度重新加權）、AI Cartography 2605.25272、Rank Intervals 2606.08679、Zheng & Yang 2609.00482（近平手排名對題目組成敏感）、Oyarhoseini et al. 2605.15761（Bradley-Terry 排行榜擾動）、LLM Swiss Round 2512.21010 | 未精讀（本批補搜上限 2 篇，只用了 1 篇；這幾篇都是在 Zhang & Hardt 的結論上延伸，方向一致）。Gordienko 與 Zheng & Yang 讀了摘要與部分正文，寫進 Zhang & Hardt 條的「反證或後續修正」。Balance of Benchmarks 的「benchmark 清單密度就是隱性權重」與 Rosetta §4.4「拆 benchmark 等於加權」是同一個論點的實證版，若「聚合指數」一篇要談權重藏在清單裡，建議下批精讀 2608.30044 |
| "Epoch ECI interpret expected performance at a given ECI" | Epoch data insight〈interpreting-eci〉（及 Samaritan Research 鏡像） | 收 Epoch 原頁（回答「需要多少 ECI 才能解某任務」）；鏡像不收 |

### 未解或待確認

- AA 排行榜的「(Max, Default Fallback)」標記在方法頁找不到定義；若文章要解釋，需查 AA FAQ 或問 AA。
- AA 版本升級時「哪些舊模型會在新版重跑」沒有官方說明；Index 頁顯示 v5 只有「28 of 157 models」有分數（Exa 摘要段），推測只重跑部分模型，未證實。
- BHI 沒有給退役門檻；「BHI 低於多少該退休」不能寫成論文結論。
- Deprecating Benchmarks 附錄 B 的 SWE-bench 退役報告是虛構情境，不能寫成真的退役事件。
