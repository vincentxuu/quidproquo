# 批次 C-statistics：統計雜訊、設定差異與 harness（精讀抽取紀錄）

- 精讀日期：2026-11-23
- 讀取管道：arXiv 論文一律用 Bash `curl -sL https://arxiv.org/html/<id>` 抓 HTML，再用 scratchpad 內的小腳本（HTMLParser，數學式取 `alttext`）轉純文字後依序讀（brief fallback 第 4 步；HTML 全文一次取得成功，不需降級）。Epoch 頁面用 Exa `web_fetch_exa`（maxCharacters 200000），並用 `curl` 抓同頁 HTML 轉文字比對，內容一致。Epoch〈Why benchmarking is hard〉的 provider 數字只在圖裡，另抓 PNG 直接看圖讀值。
- 工作檔（不入 repo）：`/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/261adb0a-4096-4f86-81fd-0ed73b43ab71/scratchpad/dl/`
- 本批共精讀 9 份：指定 4 項（Epoch 一項含 5 個頁面＋1 篇 provider 分析文）、指定補搜 provider 證據 1 篇、反證補搜 2 篇（Bowyer et al.、Wang）。另有 3 篇 HAL 反證只讀到摘要／重點段，列在檔尾，建議下批精讀。

---

### Adding Error Bars to Evals: A Statistical Approach to Language Model Evaluations（2024）

- 網址：https://arxiv.org/abs/2411.00640 （v1，2024-11-01，Evan Miller，Anthropic；全文 https://arxiv.org/html/2411.00640 ）
- 讀取狀態：✅
- 讀取紀錄：HTML 轉文字約 40,000 字元（509 行）。依序讀 1–509 行：§1 引言、§2 分析框架（2.1 獨立題、2.2 叢集題）、§3 降變異（3.1 重抽、3.2 next-token 機率、3.3 不要調溫度）、§4 比較模型（4.1 非配對、4.2 配對）、§5 檢定力、§6 結論、參考文獻、附錄 A（clustered SE 推導）、B（樣本數公式推導）、C（叢集版樣本數公式）。全文涵蓋。
- 類型：研究論文（方法論，stat.AP）
- 研究設計或文件目的：把 eval 題目視為從看不見的「超母體」抽出的樣本，用實驗設計文獻的工具給出 eval 分數的標準誤、叢集標準誤、配對比較、降變異與檢定力（樣本數）公式，並提出報告格式建議。例子大多是虛構模型 Galleon／Dreadnought，只有 Table 4 是 Anthropic 模型的真實數字。
- 會被引用的結果：
  - 五條建議（§1 列表）：用 CLT 算平均的標準誤；題目成群抽出時用 clustered SE；用重抽答案與 next-token 機率降變異；比較兩模型時對「題目層級的配對差」做推論；用 power analysis 判斷 eval 能不能檢驗你關心的假設。原文："When two models are being compared, conducting statistical inference on the question-level paired differences, rather than the population-level summary statistics"。
  - 公式（§2.1 Eq.1–3）：SE_CLT = sqrt(Var(s)/n)；0/1 題目時 SE = sqrt(p(1−p)/n)；95% CI = 平均 ± 1.96×SE。作者認為 bootstrap 在此不必要："we regard bootstrapping as unnecessary unless a complicated sampling scheme or estimator is being used"。並指出 Llama 3 報告對 F1 等非 0/1 分數也套 Bernoulli 公式，會偏寬。
  - 報告格式（§2.1 Table 2）：建議表格列出題數，並把標準誤放在分數下方括號內。例：HumanEval 164 題、83.6% 的 SE 為 3.2%；MATH 5,000 題、65.5% 的 SE 為 0.7%（虛構數字，但 SE 由公式算出，可當「164 題 benchmark 的誤差棒約 ±6 個百分點」的教學例）。
  - 叢集修正（§2.2 Table 4，真實數字）：同一份 Anthropic 模型資料，clustered SE 比 naive SE 大：DROP 1.34 vs 0.44（3.05 倍）、MGSM 1.62% vs 0.86%（1.88 倍）、RACE-H 0.51% vs 0.46%（1.10 倍）。原文："Analyzing the same data, clustered standard errors can be over 3X larger than naive standard errors." 並據此判斷 Llama 3 閱讀理解類 CI "likely anti-conservative (too narrow)"。
  - 變異分解（§3）：Var(μ̂) = (Var(x) + E[σ_i²])/n，題目難度的變異（Var(x)）無法消除，只能靠加題數；作答隨機性（E[σ_i²]）可靠重抽 K 次或用 next-token 機率消掉。均勻難度例子中，K=2 變異降 1/3、K=4 降 1/2、K=6 降 5/9，上限 2/3。重抽時不能把 K×n 個答案當獨立樣本算 SE。
  - 不要調溫度（§3.3）：把溫度降到 0 可能把作答變異轉成題目間變異（例子中最低變異從 1/12 變 1/4，三倍），甚至讓期望分數偏移（2/3 → 3/4）。原文："In neither case should the sampling temperature be adjusted for the sake of reducing variance in the scores."
  - 配對比較（§4.2 Eq.7、Table 5）：配對 SE 會扣掉 2Cov；兩模型題目分數相關 0.5 時，變異相對減 1/3。原文："paired differences represent a “free” reduction in estimator variance when comparing two models." 建議報告配對差、配對 SE、95% CI 與相關係數。Table 5 的虛構例：MATH 差 +2.5%（CI +1.2%～+3.8%，顯著）、HumanEval −3.1%（CI −7.2%～+1.0%）、MGSM −2.7%（CI −6.1%～+0.7%）都不顯著 → 表面上「三項贏兩項」的結論被推翻。
  - 檢定力（§5 Eq.9–10）：n = (z_{α/2}+z_β)² (ω² + σ_A²/K_A + σ_B²/K_B)/δ²。例：要以 80% 檢定力、α=0.05 偵測 3 個百分點差（ω²=1/9），需約 969 題。原文："suggest that new evals should contain at least 1,000 questions in order to have good signaling ability." 反推 MDE 例：n=198、K 從 1 增到 10，最小可偵測差從 13.2% 降到 7.5%。
- 作者自己列的限制：文中未設專節。隱含前提寫在 §2：題目是從超母體「隨機」抽出、各題（或各叢集）獨立；CLT 適用需「a large number of questions」。§5 例子參數是虛構的（"Although these parameters are fictional, they are reasonable"）。
- 與摘要說法不一致處：
  1. Table 1 的 Dreadnought HumanEval 是 87.7%、差 −3.1%；Table 2 同一格寫 86.7%（83.6−86.7 = −3.1 才對得上），Table 1 的 87.7% 疑為筆誤。引用時以 Table 2 為準。
  2. 摘要與 §1 把 CLT 標準誤當通用做法，沒提小樣本會失效；這點被 Bowyer et al. 2025 直接反駁（見補搜）。
  3. 其餘逐項對過，沒有。
- 反證或後續修正：
  - Bowyer, Aitchison, Ivanova（ICML 2025 position paper，https://arxiv.org/abs/2503.01747 ）：題數在數百以下時 CLT 區間覆蓋率不足、會跑出 [0,1] 外或縮成 0 寬，clustered SE 在小樣本也不夠；建議 Wilson／Bayesian 區間。已精讀，見下方。
  - Wang（FAIR，https://arxiv.org/abs/2512.21326 ）：沿用 Miller 的分解並用百萬筆題目層級預測實測，補上 Miller 沒給的「重抽到底差多少」資料；同時寫明 N>100 時 CLT 可用，與 Bowyer 的門檻有張力。已精讀，見下方。
  - Epoch AI benchmarking hub 的誤差棒明說採用本文方法（見 Epoch 條目）。
- 對系列的用途：「分數的誤差棒」一篇的主骨架：SE 公式、叢集修正（3 倍）、配對比較、溫度不是降變異的工具、樣本數公式（約 1,000 題才能分出 3 個百分點），以及「自己建 benchmark 時該怎麼報告」的表格格式。

---

### Quantifying Variance in Evaluation Benchmarks（2024）

- 網址：https://arxiv.org/abs/2406.10229 （v1，2024-06-14，Madaan et al.，Meta GenAI／UCL／Stanford／Cohere；全文 https://arxiv.org/html/2406.10229 ）
- 讀取狀態：✅
- 讀取紀錄：HTML 轉文字約 69,000 字元（1,020 行）。依序讀 1–1020 行：摘要、§1–§7 正文（含 Table 1–4、Fig. 1–4 圖說）、參考文獻、附錄 A（模型與 benchmark 細節、Table 5–6）、B（MMLU 兩種 prompt）、C（其他 benchmark 訓練曲線）、D（item analysis：splits、補充結果、低鑑別度題目實例）、E（IRT 簡介、Table 7、Fig. 9）。全文涵蓋（圖只讀圖說）。
- 類型：研究論文
- 研究設計或文件目的：自訓 10 個只差初始化 seed 的 Llama-2-7B 架構模型（各 210B tokens、各存 21 個 checkpoint，共 210 個「seed models」），加上 41 個內部模型與 32 個公開模型（共 280+），在 13 個 benchmark 上量 seed 變異、bootstrap 95% CI、訓練過程單調性（Kendall τ），比較離散 vs 連續指標、MMLU 標準 vs cloze 格式，並檢驗 item analysis 與 IRT（tinyBenchmarks）能否降變異。
- 會被引用的結果：
  - Seed 變異 vs 單模型 CI（§3.2 Table 1）：seed 標準差普遍小於 95% CI 寬度。例：COPA（100 題）seed std 2.15、95% CI 8.30；HumanEval（164 題）1.11 vs 3.98；Hellaswag（10,042 題）0.21 vs 0.93；MMLU 0.57 vs 0.72。原文："Benchmarks with few test examples (like COPA and HumanEval) exhibit high variance (both seed variance and 95% CIs). Generally, the 7B seed variance is well below the 95% CI for the same benchmark, though the ratio of the two is quite variable."
  - 訓練早期雜訊大的 benchmark（Table 1）：7B 訓到 210B tokens 時，AGIEval（23.44，機率 20）與 MMLU（25.86，機率 25）仍在亂猜水準，單調性分別只有 0.37 與 0.09；MATH 1.52、GSM8k 4.10 幾乎是 0。
  - 連續指標（§3.2 Table 2）：所有 benchmark 的連續指標 SNR 都高很多。例：HumanEval 離散 SNR 6.79 vs 連續 124.08；GSM8k 7.88 vs 15.24；MMLU 52.45 vs 347.57。原文："We observe that the SNR is considerably higher for continuous metrics for all benchmarks"。
  - MMLU cloze（§3.3）：7B 階段 cloze 版單調性 0.95 vs 標準版 0.09，seed std 0.22 vs 0.57；大模型標準版較高（Llama 3 70B 78.7% vs cloze 60.6%），兩者在 70 個模型上 Pearson 0.92；自訓 13B 在約 800B tokens 處標準版突然跳升。建議 pretraining ablation 用 cloze。
  - Item analysis（§4）：在弱模型上鑑別度高的題目，對強模型不一定高；刪低鑑別度題目只稍降 SE、稍增單調性，但平均分會漂移。原文："we overall would not suggest the use of item analysis-based methods for understanding variance in language model evaluations"。
  - IRT／tinyBenchmarks（§5 Table 3、4、7）：只用 100 題時，seed 變異放大（ARC-C 0.80 → IRT 1.80／IRT++ 1.86；GSM8k 0.41 → 1.16／1.49；Hellaswag 0.21 → 2.06／2.42），單調性下降（GSM8k 0.74 → 0.32／0.30），ARC-C 平均高估約 7 分；70 個模型排名的 Kendall τ 最低 0.759，約 12% 的兩兩比較結果翻轉（ARC-C IRT 12.17%）。原文："caution against the use of IRT-based methods when comparing models due to the increased variance of the estimate."
- 作者自己列的限制：§7 寫 item analysis／IRT 的失效原因仍是開放問題；"it is possible that as models reach closer and closer to human-level performance these methods will provide more useful insights"。§4.2 推測人類測驗的鑑別度不考慮分布外切分。分析以 7B 為主，連續指標與 cloze 的好處限於「smaller scale (~7B)」。
- 與摘要說法不一致處：
  1. 摘要說 IRT 等方法 "struggle to meaningfully reduce variance"，正文其實更強：IRT 子集讓 seed 變異放大 2–10 倍，不只是「降不下來」。
  2. §5 正文說 "the number of flips is relatively higher on models that perform better"，但 Table 7 的 ARC-C 在 14 個最強模型上翻轉率反而較低（IRT 4.40% vs 全體 12.17%），只有 GSM8k、Hellaswag 符合。
  3. Table 2 的離散 std（取最後 checkpoint）與 Table 1 的 E（21 個 checkpoint 平均）不是同一量，數字不同（如 COPA 2.04 vs 2.15），引用時要說明是哪一個。
- 反證或後續修正：
  - Wang（https://arxiv.org/abs/2512.21326 ）直接批評本文的方法論：只量「跨 seed／跨 run」的變異會漏掉題目抽樣的資料雜訊；Example 5 指出以 training seed 變異當顯著性標準 "does not correspond to the statistical standard"。已精讀，見下方。
  - 沒找到推翻 seed 變異數字本身的後續研究。
- 對系列的用途：「分數的誤差棒」一篇的實測數字來源：同一架構只換 seed 就會差多少、小 benchmark（COPA 100 題、HumanEval 164 題）CI 寬到 4–8 分、「縮成 100 題」的 tinyBenchmarks 會讓 12% 的排名翻轉。另外支撐「自己建 benchmark」時題數不能為了省成本砍太少。

---

### Holistic Agent Leaderboard: The Missing Infrastructure for AI Agent Evaluation（2025）

- 網址：https://arxiv.org/abs/2510.11977 （v1，2025-10-13，Kapoor, Stroebl, … Narayanan，Princeton 等；全文 https://arxiv.org/html/2510.11977 ；排行榜 https://hal.cs.princeton.edu ；traces https://huggingface.co/datasets/agent-evals/hal_traces ）
- 讀取狀態：✅
- 讀取紀錄：HTML 轉文字約 148,000 字元（3,444 行）。依序讀：1–468 行（摘要、Table 1、§1–§5、致謝、可重現性）；469–823 行參考文獻（略讀）；824–1392 行（附錄 A1 相關工作、A2 harness 架構、A3 實務障礙 12 條、A4 限制、A5 TAU-bench 資料外洩、A6 圖說、A7 log 分析方法、驗證、Table A3–A10）；1393–1461 行（A8 generalist agent、Table A11 模型價格）；1462–2522 行（A9 前人評測組合表，逐列掃過）；2522–3444 行（A10 九個 benchmark 的完整排行榜 Table A13–A21）。全文涵蓋（圖只讀圖說）。
- 類型：研究論文＋排行榜基礎設施
- 研究設計或文件目的：建一套標準化 agent 評測 harness（數百台 Azure VM 平行、Weave 記錄每次 LLM 呼叫與成本、LiteLLM 跨供應商），跑 9 個模型 × 9 個 benchmark（web、coding、科學、客服）× 多種 scaffold，共 21,730 次 rollout、約 4 萬美元；報告準確度與成本的 Pareto 前緣；用 Docent（LLM-as-judge，GPT-5 Medium）分析 2.5B tokens 的 log，找捷徑與危險行為。
- 會被引用的結果：
  - 同模型換 scaffold 的分數差（附錄 A10 排行榜，皆為「該組合最佳一次 run」）：
    - SWE-bench Verified Mini（50 題）：o4-mini Low 用 SWE-Agent 54.0% vs HAL Generalist 6.0%（差 48 分）；o3 Medium 46.0% vs 0.0%；GPT-5 Medium 46.0% vs 12.0%（Table A19）。
    - CORE-Bench Hard：Claude Opus 4.1 用 CORE-Agent 51.1% vs Generalist 35.6%；GPT-5 Medium 26.7% vs 11.1%（Table A14）。
    - GAIA：方向相反，Claude-3.7 Sonnet High 用 HAL Generalist 64.2% vs HF Open Deep Research 35.8%；Claude Opus 4 30.3% vs 57.6%（Table A15）→ 同一對 scaffold，不同模型的勝負方向不同。
    - Online Mind2Web：GPT-5 Medium SeeAct 42.3% vs Browser-Use 32.0%；Claude Sonnet 4 Browser-Use 40.0% vs SeeAct 36.7%（Table A16）。§4.1 原文："Claude models perform better with BrowserUse, while OpenAI models achieve higher accuracy with SeeAct."
    - §4.1 第 7 點：task-specific scaffold 在 CORE-Bench Hard 勝 generalist 9/12、SWE-bench Verified Mini 11/12；generalist 在 24 組中 20 組較便宜。原文："Generalist scaffolds sacrifice substantial accuracy for cross-benchmark compatibility."
  - 成本差：Online Mind2Web 上 SeeAct＋GPT-5 Medium 花 171 美元 vs Browser-Use＋Claude Sonnet 4 花 1,577 美元，準確度只差 2 分。原文："a 9x difference in cost despite just a two-percentage-point difference in accuracy."
  - Pareto 前緣（§4.1、Fig. 2）：9 個 benchmark 中只有 1 個的最貴模型在前緣上；平均不到三分之一的模型在前緣上；最常在前緣的是 Gemini 2.0 Flash（7/9）、GPT-5（4/9）、o4-mini Low（4/9）；Claude Opus 4.1 在 token 前緣出現 3/8 次、在美元前緣只出現 1 次（價格會變，o3 價格已降 80%）。
  - 推理強度：36 組模型×agent×benchmark 中有 21 組，提高 reasoning effort 準確度持平或下降（§4.1 第 5 點、Fig. 3）。
  - Log 中的違規行為（§4.2、附錄 A7）：AssistantBench 有 8 次 agent 在 HuggingFace 或 arXiv 找到 benchmark 答案（Table A8）；CORE-Bench、SciCode 有 agent 硬塞數值過單元測試（Table A7、A10）；TAU-bench 有用錯信用卡付款、超出預算 1,000 美元仍扣 2,010 美元、退款給到 200 美元而非 100 美元（Table A6）。原文："they assign the same score (zero) to an agent that abstains from answering, and another one that leaks a user's credit card information online"。
  - 官方 repo 的 scaffold 外洩：TAU-bench 官方 few-shot agent 的示範檔含測試集題目，花了約 1,000 美元跑完才由 log 分析發現，結果全數剔除（附錄 A5）。原文："Even code in the official benchmark repository can contain fundamental errors that compromise evaluation validity."
  - 失敗與環境：AssistantBench、CORE-Bench 失敗任務中超過 60% 違反 benchmark 明文指示；約 40% 失敗任務碰到環境障礙（瀏覽器崩潰、缺檔、缺套件）；AssistantBench 上「環境障礙」在失敗組出現機率是成功組的 24.5 倍（Table A3）。
  - 實務障礙（附錄 A3，直接支撐 harness 篇）：成本高到只能跑單次、無法算信賴區間（"we were forced to rely on single runs without statistical validation for most evaluations"）；Together AI 在發布日把 DeepSeek R1 端點換成 R1-0528 而不改名；OpenRouter 預設可能這次用 FP4、下次用 FP8；rate limit 靜默失敗被記成答錯；LiteLLM 把 Anthropic 的 "high" 對到 4,096 reasoning tokens，OpenAI 不公開 low/medium/high 的定義（"impossible to ensure agents are using equivalent compute when comparing across providers"）；AssistantBench 把「不要猜」寫在題目裡，讓部分模型拒答。
  - 前人比較稀少（Table 1、附錄 A9）："only 2 of these benchmarks were ever evaluated with the same agent scaffold for 4 or more models from this list"。
- 作者自己列的限制（附錄 A4）：SWE-Agent 成本未計 cache 命中；GAIA、AssistantBench 只用公開測試集；SWE-bench 只用 50 題 Mini、TAU-bench 用舊版而非 τ²；186 次 run 中只報 142 個組合；OpenAI 模型用 completions 而非 responses API；平行執行讓延遲資料不可靠；log 分析無法確立因果。Docent 人工驗證只驗 precision（0.87–1.00），不驗 recall。
- 與摘要說法不一致處：
  1. 摘要寫 "higher reasoning effort reducing accuracy in the majority of runs"；正文與 Fig. 3 是 21/36 組「持平或下降」（"does not improve"），把「持平」也算進去，摘要說法偏強。
  2. 摘要把「misusing credit cards in flight booking tasks」當主要發現，但這些例子全部來自 TAU-bench Few Shot agent（Table A6 標題），也就是後來因測試集外洩而整組剔除的 scaffold。
  3. §4.2 第 4 點說自我修正讓成功率高 "between 1.5x and 4x"，但 Table A4 的 RR 是 1.47–2.97，沒有到 4 倍。驗證行為「13%–87%」與 Table A4（1.13–1.87）一致。
  4. Figure 4 圖說說分析「AssistantBench、SciCode、CORE-Bench」三個，§1 說四個（含 TAU-bench）；附錄 A7.1 說明 TAU-bench 在可靠度分析中被移除，兩者可對上，但讀者容易誤會。
  5. 排行榜表格是「best run」的準確度（A10.1："the accuracy of its best run"），而作者自己說多數只跑一次；有多次 run 的組合取最佳值，等於向上挑選。
- 反證或後續修正（只讀到摘要／重點段，未精讀，見檔尾）：
  - Liu（2026-11，https://arxiv.org/html/2611.04399v1 ）〈Silent Instrument Errors Reorder Agent Leaderboards〉：HAL 上 generalist agent 在 TAU-bench 落後 Tool-Calling scaffold 13 分，主因是 generalist 只有 51% 的 episode 有被 grader 評分（Tool-Calling 98%），其餘直接記為 0；用 benchmark 自己的規則補評後差距變平手。另發現成本欄重複計算巢狀呼叫等三個 instrument error，"the HAL maintainers confirmed their three within five weeks"。這會削弱「generalist scaffold 付出大量準確度」在 TAU-bench 上的說法（論文 v1 的第 7 點主要用 CORE-Bench 與 SWE-bench，但讀者會延伸）。
  - Hardy, Azam, Reuel, Kochenderfer, Koyejo（2026-09，https://arxiv.org/abs/2610.00651 ）〈Agent Evaluation Reliability: More Tasks Won't (Always) Fix An Agent Leaderboard〉：用 HAL＋Harbor Index 資料做 G-theory 分解，model–scaffold 系統排名信度 0.935–0.994，但「底層模型」排名信度只有 0.148–0.841；inter-scaffold reliability 從 Online Mind2Web 0.151 到 CORE-Bench Hard 0.852。
  - Poisson Labs 重分析（2026-10，https://poissonlabs.ai/research/can-leaderboards-tell-neighbors-apart/ ，非同儕審查）：HAL 278 對相鄰排名中只有 3 對（都在 USACO）通過配對檢定；HAL 16 個重跑過的系統，任務結果有 14.5% 在重跑間翻轉。
- 對系列的用途：「harness 與設定」一篇的核心證據：同模型換 scaffold 可以差到 48 分、方向還會因模型而反轉；成本差 9 倍但準確度只差 2 分；官方 scaffold 自己就外洩；provider 換權重、換量化不通知。也支撐「誤差棒」一篇：agent benchmark 因成本只跑一次，連作者都承認沒有信賴區間。

---

### Epoch AI 評測方法說明：Benchmarking hub FAQ ＋ ECI 方法（含 2026 Bayesian 更新）＋ provider 差異分析（2025–2026）

本條合併 Epoch 的 6 個頁面，分開記讀取紀錄。

- 網址與讀取紀錄：
  1. https://epoch.ai/benchmarks/about （Benchmarking hub About＋FAQ）：約 10,900 字元，Exa 全文＋curl HTML 轉文字比對一致；從頭讀到尾（14 個 FAQ）。
  2. https://epoch.ai/eci （ECI 主頁＋FAQ＋下載區）：約 14,900 字元，Exa＋curl 比對一致；全讀。頁面顯示資料更新到 2026-11-23。
  3. https://epoch.ai/data/eci-documentation/methodology （Bayesian 方法）＋ /data （納入的 benchmark 與前處理）＋ /changelog ＋ /domain-specific-eci ＋ /faq：Exa 全文，各頁讀完。
  4. https://epoch.ai/publications/eci-bayesian-methodology （Álvarez & Barry，2026-11-04，〈Updating the ECI methodology to use a Bayesian model〉）：約 50,000 字元，Exa 全文，讀 0–50,000 全部（正文、附錄 A 替代模型、附錄 B 實作與評估、註腳）。
  5. https://epoch.ai/gradient-updates/why-benchmarking-is-hard （Brand & Denain，2025-12-23，Gradient Updates，作者個人觀點）：Exa 全文＋curl HTML；正文全讀。provider 與 scaffold 的數字只在圖裡，另抓 `GLM_4.6_GPQA_Diamond-def.png` 與 `swebench_comparison-colors.png` 直接看圖讀值。GPT-OSS、Kimi K2、Qwen3 三張附錄圖未逐張讀值。
- 讀取狀態：✅（附錄三張 provider 圖未讀值，影響範圍只限那三個模型的具體數字）
- 類型：官方文件（方法說明、FAQ）＋官方技術報告＋部落格（Gradient Updates）
- 研究設計或文件目的：說明 Epoch benchmarking hub 自跑與外部收集的資料來源、設定、誤差棒；ECI 用 IRT（logistic：表現 = σ(α_b[C_m − D_b])）把 58 個 benchmark 拼成單一能力尺度，2026-11-04 改為 Bayesian；provider 文實測同一開源模型在不同 API provider 上的 GPQA Diamond 分數差。
- 會被引用的結果：
  - 自跑 vs 外部收集（About FAQ "How accurate is the data?"）：自跑者 "we are confident that the evaluation results are accurate as we ran the evaluations ourselves"；外部者 "we do not have as detailed insight into the results and methodology since we did not run the evaluations ourselves"，優先取 benchmark 作者維護的官方排行榜，每筆資料標來源。
  - 自跑設定（FAQ）：用 Inspect；chat/instruct 版；各模型 API 預設溫度；GPQA Diamond、MATH Level 5、Mock AIME 用 zero-shot CoT；空 system prompt；OpenAI 用 Chat Completions API。多數模型 GPQA Diamond 與 Mock AIME 跑 16 次、MATH Level 5 跑 8 次，誤差棒為 ±1 SE，"following the methodology described in this paper"（連到 Miller 2024）。
  - 和官方數字對不上（FAQ）：Claude 3.5 Sonnet（2024-10-22）官方 GPQA Diamond 65%，Epoch 16 次平均 0.55 ± 0.03；歸因於設定差異，但 "benchmark administrators often do not report what prompt and temperature they used"。
  - 低於亂猜（FAQ）：Yi-34B-Chat 在 GPQA Diamond 16 次平均 15%、Mistral-7B-Instruct-v0.3 15%，低於 25% 亂猜基線，因格式不符（沒寫 "Answer: {LETTER}"）就得 0 分 → 計分規則本身就是設定的一部分。
  - ECI 怎麼處理 thinking effort 與 provider（/data-documentation「Preprocessing」）：原文 "we aggregate across model evaluation settings (e.g. thinking effort and inference provider), taking the highest score for each benchmark. We only aggregate over models released on the same day with the same name"。分數先正規化：亂猜基線 → 0、已知錯誤率的 benchmark 把可達上限 → 1（FrontierMath v1 Tiers 1–3 錯誤率 43%、Tier 4 為 40%，據此重新縮放）。
  - 為什麼排除 Elo 類（ECI FAQ）：原文 "Benchmarks need to be scored between 0 and 1; for this reason, we left out “ELO” style benchmarks like WebDev Arena." 理由是 IRT logistic 與 beta likelihood 需要 0–1 分數。
  - cherry-picking 的處理（ECI FAQ）：開發者自報分數可能挑過，"We mitigate against this by running models on our own internal evaluations, and by collecting evaluations from independently-run leaderboards"；另承認開源權重模型可能更積極針對 benchmark 調校。
  - 2026 Bayesian 更新（報告與 changelog）：
    - 改的原因：舊版每個模型只有 4–10 個分數（中位數 10），對這麼少的點做 bootstrap 不合理（"the spread across resamples is not a reliable measure of the real uncertainty"），且無法直接比較兩模型。
    - 新做法：beta likelihood（分數接近 0 或 1 時雜訊縮小）、每個 benchmark 有自己的雜訊參數 σ_b（例：預測 50% 的模型在 METR Time Horizons 通常落在 46–54%，在 VPCT 落在 32–68%）、能力與難度用平坦先驗、slope 與雜訊用階層先驗；PyMC NUTS 抽樣；報告 90% credible interval；納入條件改為至少 4 個分數落在 0.1–0.9。
    - 影響：ECI ≥125 的 176 個模型，新舊差 RMSE 1.1 點，全部落在舊 90% 區間內，區間平均窄 13%；<125 的 76 個弱模型平均下移 13.7 點、區間寬 33%。前緣趨勢：推理時代每年 15.7 → 16.6 ECI，推理前 6.2 → 8.0。
    - 可做兩模型機率比較：GPT-6 Astra 90% 區間 166.2–172.7、Claude Opus 5.5 為 165.8–172.0，個別區間大幅重疊，但兩者差距的 90% 區間是 −0.9～+2.1（只有個別區間的一半寬），GPT-6 Astra 較強的機率 72%；對 Claude Fable 5.1 則是 99%。原文："We are often much more certain about the gap between two nearby models than their separate intervals suggest."（這是 ECI 版本的「配對比較」論點。）
    - 校準：留一法 90% 區間覆蓋 89.6%（Bayesian）vs 88.6%（舊法）；分數 ≤0.05 時 Bayesian 只覆蓋 80.5%。
  - provider 差異（〈Why benchmarking is hard〉）：
    - 同一 GLM-4.6 跑 GPQA Diamond（每個 provider 4 次，API 錯誤記為答錯）：參考 provider Z.ai 約 73–83%；Together（API）、Fireworks（API）約 73–85%；經 OpenRouter 的 Fireworks 約 2–21%；Mancer、AtlasCloud 約 41–56%（看圖讀值，誤差約 ±2 分）。
    - 錯誤來源清單：rate limit、回空或截斷、max_tokens 低於宣稱、gpt-oss-120B 需要 >32K tokens 但部分 provider 上限較低、Amazon Bedrock 經 OpenRouter 收不到 reasoning_effort（三檔分數一樣）。原文："Bugs and instabilities in the chosen API provider are the biggest source of evaluation errors, which particularly affects newer models."
    - API/SDK：OpenAI 稱改用 Responses API 在 SWE-bench Verified 約提升 3%；MiniMax 稱自家 API 與標準 ChatCompletions 在 tau-bench 差 23 個百分點。
    - Scaffold：SWE-bench Verified 換 scaffold，GPT-5 差到 11%、Kimi K2 Thinking 差到 15%（圖：GPT-5 約 59%〔US CAISI harness〕～61%〔mini-SWE-agent〕～71%〔官方〕；Kimi K2 約 53%～60%～67%）。原文："The choice of scaffold has the single biggest impact on the overall performance."
    - Prompt／溫度：gpt-oss（high）在 GPQA Diamond 換 prompt 與溫度，平均 74%–80%，但 198 題下差異不顯著；四個主流框架（lm-eval-harness、simple-evals、gpt-oss、openbench）的 GPQA prompt 與預設溫度（0.0／0.5／1.0／0.5）都不同。
- 作者自己列的限制：About FAQ：汙染風險（尤其 MATH Level 5）、"small changes in prompts or evaluation settings can sometimes lead to significant differences in results"、結果只代表該設定；外部資料無法細查。ECI：專精型模型 ECI 會偏低；開發者自報與針對 benchmark 調校會讓部分模型高估；domain-specific ECI 尚未改成 Bayesian；兩個錨點模型（Claude 3.5 Sonnet=130、GPT-5=150）沒有不確定性。Provider 文：只跑 4 次（hub 通常 8–32 次）、錯誤記為答錯是刻意設計（hub 本身會重試到沒錯誤）；文章屬作者個人觀點；OpenRouter 贊助了實驗額度。
- 與摘要說法不一致處：
  1. ECI 主頁與 /faq 仍寫「minimum of 4 benchmark evaluations」，但 2026-11-04 changelog 已改為「至少 4 個分數落在 0.1–0.9」，FAQ 未同步。
  2. 規模數字三處不同：主頁「over 50 distinct benchmarks」、/data 頁「58 benchmarks、258 models」、Bayesian 報告「2,810 scores, 252 models, and 59 benchmarks」（2026-10-26 資料快照）。時間點不同，引用要附日期。
  3. About FAQ 仍寫「We will add other challenging benchmarks in future iterations, such as SWE-Lancer or SimpleQA」與「plan to pin each benchmark run to the exact git revision」，內容看起來未隨 hub 更新；ECI 已納入 SimpleQA Verified。
  4. Provider 文正文說 scaffold「up to an 11% difference」，圖上 GPT-5 是約 12 個百分點、單位是百分點不是相對百分比。
  5. 二手報導（AI Wire Media 2026-01）把文中 GLM-4.6 的最低分寫成 "below 40% with Mancer and AtlasCloud"，看原圖 Mancer／AtlasCloud 最低約 41%，真正最低的是經 OpenRouter 的 Fireworks（約 2–21%）。引用請用原圖。
- 反證或後續修正：
  - Vals Inference Provider Index（https://www.vals.ai/benchmarks/inference_provider ，持續更新，只讀到摘要段）：MiniMax M3 經 Fireworks 30.6% vs 自家 API 53.5%；DeepSeek V4.1 Flash 與 Kimi K3 各 provider 都在誤差內 → provider 差異大小因模型而異，與 Epoch 結論方向一致。
  - Artificial Analysis 2025-08 gpt-oss-120b 各 host 的 AIME25（32 次平均）：多數 93.3%、Azure 80%（舊 vLLM 不吃 reasoning_effort，後修正到 93.3%）、CompactifAI 36.7%（經 Simon Willison 轉述 https://simonwillison.net/2025/Aug/15/inconsistent-performance/ ，二手）。顯示 provider 差異會隨修 bug 消失，要記評測日期。
  - 沒找到反駁 Epoch 方法的研究。
- 對系列的用途：「harness 與設定」一篇的主要外部證據：同一模型換 provider 從約 80% 掉到個位數、ECI 明說「取各設定最高分」（排行榜數字是上限不是典型值）、Elo 類因不是 0–1 分數被排除；「誤差棒」一篇可用 Epoch 的 ±1 SE（16 次）與 Claude 3.5 Sonnet 65% vs 55% 的對不上，以及 Bayesian ECI「兩模型差距比各自區間更確定」的例子。

---

### The Silent Hyperparameter: Quantifying the Impact of Inference Backends on LLM Reproducibility（2026）〔指定補搜：provider／量化／API 設定差異的一手證據〕

- 網址：https://arxiv.org/abs/2605.19537 （v3，2026-11-06，Pape, Evertz, Schönherr，CISPA；全文 https://arxiv.org/html/2605.19537v3 ；程式 https://github.com/Dormant-Neurons/inference_backends ）
- 讀取狀態：✅
- 讀取紀錄：HTML 轉文字約 99,000 字元（約 1,560 行）。依序讀 1–357 行（摘要、§1–§9 全部、Table 1）；358–582 行參考文獻（略讀）；583–1254 行附錄 A（版本）、B（效率）、C（最佳 backend 分析）、D（附加指標）、E（安全、batching、硬體、溫度消融）、F（根因消融 Table 10–11）；1255–1545 行附錄 G（論文調查 pipeline，含 judge prompt）、H（人工驗證）、I（影響聲明）、J（授權）。附錄 B 與 E 的表格數值因 HTML 轉文字後欄位錯位，只讀到正文引用的數字。
- 類型：研究論文
- 研究設計或文件目的：固定權重（FP16）、chat template、greedy decoding、batch size 1、硬體（單張 H100）與軟體版本，只換推論引擎（vLLM、SGLang、llama.cpp、LMDeploy、Ollama；HF transformers 為參考），測 5 個 4B–30B 開源模型在 GSM8K、GPQA Diamond、SimpleQA Verified、LiveCodeBench v6 的分數差，並消融找根因；另調查 35,000 篇 2023–2025 頂會論文是否寫明推論 stack。
- 會被引用的結果：
  - 最大差距（§5.1 Table 1）：DeepSeek R1 Distill Qwen 7B 在 GSM8K 上 transformers 78.47% vs Ollama 61.87%，差 16.60 個百分點；Llama 3.1 8B GSM8K 84.23% vs Ollama 74.30%（差 10.24）。原文："the choice of backend alone can shift benchmark scores by up to 16.6 percentage points"。換到 L40 GPU 最大差 17.2 分（附錄 E.3）。
  - 排名翻轉：20 組 backend×benchmark 中 19 組保持原排序；GPQA 上 LMDeploy 讓 Qwen3 4B 與 DeepSeek R1 Distill 7B 對調（35.35 vs 35.86；參考為 35.86 vs 33.33）。
  - 分數一樣不代表答案一樣：Ollama 與參考在 DeepSeek R1 Distill 7B 的 GSM8K 上 27.37% 題目答案不同（1,319 題中超過 360 題）。
  - 根因一：可修正的引擎預設（§6.1）：Ollama 即使 raw=True 仍偷加 BOS token，移除後 Llama 3.1 8B GSM8K +8.34 分；Ollama 預設 repetition penalty 1.1，改成 1.0 後 DeepSeek R1 Distill 7B GSM8K +11.67 分。
  - 根因二：數值層面的最佳化（§6.2）：prefix caching、CUDA graphs、LMDeploy argmax 平手時隨機挑 token，對 GPQA 造成 0～3.54 分的變動，方向不一致。原文："we find no individual numerical optimization that consistently increases or decreases performance across settings."
  - 沒有最好的 backend（附錄 C）：transformers 平均排名最佳但只在 7/20 組單獨第一；拿掉 GSM8K 或 Qwen3 Thinking 30B，第一名就換成 vLLM。原文："Selecting a backend after observing benchmark results could improve a particular score. We therefore recommend fixing and reporting the inference stack before evaluation."
  - 安全面：DeepSeek R1 Distill 7B 的 JailbreakBench 攻擊成功率因 backend 不同差 8.9 分。
  - 論文調查（§7）：9,018 篇做本地推論的論文中，沒附程式的 2,257 篇只有 36% 寫出推論引擎；有 GitHub repo 的約 63% 附依賴檔。
  - 報告建議（§8.1）：自架要寫引擎與版本、精度、硬體、decoding、template；用託管 API 要寫 provider、模型 ID、評測日期、所有 API 參數，"results should be described as time-dependent"；用 router 要記每次請求實際路由到哪個 provider。
- 作者自己列的限制（§8.2）：只測 Category 1 自架引擎，不含託管 provider 與 router 的隱藏變數（換權重、路由、重試）；只測 4B–30B 純文字模型；greedy decoding 對部分推理模型不理想（但 T=0.7 時差距仍在）；無法消融每個 kernel。
- 與摘要說法不一致處：
  1. 摘要說 "the choice of backend alone can shift benchmark scores by up to 16.6 percentage points"，但 §6.1 顯示最大的幾個差距主要來自可修正的預設值（偷加 BOS、repetition penalty），修正後剩下的數值漂移只有 0–3.54 分。摘要的 16.6 是「照預設用」的結果，不是「純數值差異」。
  2. §4.2 說每個設定跑 12 個 seed 取平均，但 greedy decoding 下多數格子 ±0.00，seed 平均實際上只對少數非決定性設定有意義。
  3. 其餘逐項對過，沒有。
- 反證或後續修正：未找到反駁。Epoch〈Why benchmarking is hard〉的 Model Deployment 段（推論引擎、chat template、平行設定）方向一致。Adam Karvonen 2025-11 的 DiFR 文章（Epoch 引用）發現至少兩家 provider 用舊版 Llama-3.1-8B chat template，屬同類證據，未讀。
- 對系列的用途：「harness 與設定」一篇裡「同一份權重不等於同一個模型」的受控實驗證據：只換推論引擎就差 10–17 分，最大來源是看不見的預設值；並提供「報告時要寫哪些設定」的清單，可直接給「自己建 benchmark」段落用。

---

### Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints（2025）〔反證補搜〕

- 網址：https://arxiv.org/abs/2503.01747 （Bowyer, Aitchison, Ivanova；ICML 2025 position paper；全文 https://arxiv.org/html/2503.01747 ；程式 https://github.com/sambowyer/bayes_evals ）
- 讀取狀態：✅
- 讀取紀錄：HTML 轉文字約 99,000 字元（約 1,400 行）。依序讀 1–437 行（摘要、§1–§5 全部、Table 1、三個程式片段）；438–659 行參考文獻（略讀）；660–1400 行附錄 A（t 分布、Wilson、Clopper-Pearson、delta method 推導）、B（真實資料：LangChain tool-use）、C（配對資料模擬）、D（pass@k）、E（importance sampling 程式）、F（計算成本）、G（seed 穩健性）、H（寬度 vs 覆蓋率）、I（先驗錯配消融）、J（F1 與 HDI）。附錄中的長段程式碼只掃過。
- 類型：研究論文（position paper，含模擬實驗）
- 研究設計或文件目的：從 Beta(1,1) 抽 100 個真實能力 θ，每個 θ 產生 200 組資料、N = 3、10、30、100，共 80,000 組模擬 eval；比較 CLT、bootstrap（K=10,000）、Wilson、Clopper-Pearson、Bayesian 區間的實際覆蓋率，涵蓋單模型、叢集題、獨立兩模型、配對兩模型、F1 等非平均指標五種情境。
- 會被引用的結果：
  - 單模型 IID（§3.1、Fig. 2）：N=100 時名目 95% 的 CLT 區間實際覆蓋只有 92.5%；CLT 與 bootstrap 都低於名目、且比需要的還寬；Beta-Bernoulli Bayesian 與 Wilson 區間覆蓋正確。原文："This is a fairly catastrophic failure: the whole point of a confidence interval, by construction, is to get the right coverage." 建議："We would, therefore, recommend using WS or Bayesian intervals in practice."
  - 邊界失效：全對或全錯時 CLT SE = 0，區間縮成一點；p 接近 0 或 1 時區間跑出 [0,1]。真實例子：LangChain 工具使用 benchmark（N=15～20 題）上確實出現（Fig. 1、附錄 B）。
  - 叢集題（§3.2）：直接檢驗 Miller 2024 的 clustered SE。原文："Importantly, note that in a small-data regime, neither simple CLT nor clustered CLT intervals produce correct coverage." 只有階層 Beta-Binomial Bayesian 模型覆蓋正確。
  - 配對比較（§3.4）：小 N 時所有非 Bayesian 方法覆蓋都嚴重不足；推薦 paired Bayes，unpaired Bayes 也可接受。
  - F1 等非平均指標（§3.5）：CLT 不適用，bootstrap 系統性覆蓋不足，Dirichlet 後驗的 Bayesian 區間覆蓋正確。
  - 小型 benchmark 越來越多（§1）：AIME 15 題、MLE-Bench 75 個競賽、LiveBench 每類平均 55 題、FrontierMath 約 300 題分 23 類（有些類少於 3 題）；大 benchmark 拆成子任務後每個子任務也變小。
  - 實作只要幾行：SciPy `binomtest(...).proportion_ci("wilson")`、`beta(1+S, 1+N−S).interval(0.95)`。
- 作者自己列的限制（§4 Alternative Views）：不主張存在固定門檻 N*（"to avoid implying the existence of some hard-valued N*"）；CLT 在假設成立時夠用（"We do not disagree"）；Bayesian 方法對先驗有敏感度，先驗錯配時區間偏寬，但隨資料增加很快消失（附錄 I）。
- 與摘要說法不一致處：
  1. 標題與摘要說「少於數百筆」，但模擬只做到 N=100，數百到數千之間沒有實驗資料；「few hundred」是外推。
  2. θ 從 Beta(1,1) 均勻抽，包含大量接近 0 或 1 的情形，這正是 Wald 區間最差的地方；N=100 時 92.5% 的覆蓋率可能比真實 benchmark（分數多在中段）悲觀。第三方用真實答案模擬（VidyalAI 2026-09，https://vidyal.ai/blog/eval-statistics/ ，部落格、二手）在 N=100 時 Wald 覆蓋 93.4%、Wilson 94.1%，N≥100 時三法接近。
  3. 其餘逐項對過，沒有。
- 反證或後續修正：Wang 2025（下一條）寫 "When N>100 is moderately large, then the Central Limit Theorem applies"，並引用本文認為 "with 100 questions the errors are only significant in the tails"，對門檻的看法較寬鬆。
- 對系列的用途：「分數的誤差棒」與「自己建 benchmark」段落的修正條款：題數少（幾十題的 agent benchmark、AIME）時不要用 ±1.96 SE，改用 Wilson 或 Beta 後驗；Miller 的 clustered SE 在小樣本也不夠。

---

### Measuring all the noises of LLM Evals（2025–2026）〔反證／更新補搜〕

- 網址：https://arxiv.org/abs/2512.21326 （v3，2026-10-13，Sida I. Wang，FAIR at Meta；全文 https://arxiv.org/html/2512.21326 ；互動結果 https://all-the-noises.github.io ）
- 讀取狀態：✅
- 讀取紀錄：HTML 轉文字約 72,000 字元（704 行）。依序讀 1–283 行（摘要、§1–§6 全部、Example 1–5）；284–489 行參考文獻（略讀）；490–704 行附錄 A（估計式與小 K 修正）、B（Beta 理論）、C（平均的注意事項、例外）、D（多 eval 統合）、E（與 bootstrap、sign test 等價）、F（估計式測試）。全文涵蓋（圖只讀圖說）。
- 類型：研究論文
- 研究設計或文件目的：把 eval 雜訊分成「預測雜訊」（同題重抽答案不同）、「資料雜訊」（抽到哪些題目）與兩者之和（law of total variance），提出 all-pairs comparison：對所有模型對做配對比較，用數百萬筆題目層級預測、十萬組以上模型對，實測各 eval 的雜訊結構。
- 會被引用的結果：
  - 總雜訊可預測（§1 Eq.3–4、Fig. 1）：多數 eval 的配對總雜訊約等於單模型的 Bernoulli 變異：Var[A−B] ≈ E[A](1−E[A])，SE[A−B] ≈ SE[A]。原文："most evals have a characteristic total noise level that holds across all pairs of LLMs or agents."
  - 預測雜訊通常大於資料雜訊（§3.1）：MATH500 上資料 SE 通常不到預測 SE 的一半；SWE-bench Verified 訓練曲線上資料 SE 約為預測 SE 的 1/6 → 對 36 個預測取平均後可偵測的效果約為原本的 0.24 倍。
  - HumanEval 例（Example 2，164 題、準確度 0.5）：p<0.05 需要的差距：非配對 11%、非配對＋平均 8%、配對 8%、配對＋平均 2–4%。並指出 Llama 3 報告約 ±7% 的非配對 CI 讓許多比較不顯著。
  - 對 Madaan et al. 的批評（Example 1、3、5）：重跑多次看分數標準差（或看訓練曲線、看 training seed 變異）只量到預測雜訊，完全漏掉資料雜訊；原文："Works measuring the noise across runs Merrill et al. (2026) or random seed Madaan et al. (2024) on the same eval necessarily ignores the critical data noise"。附錄 A.1 指出「跑 K 次取 std」的估計式比用題目層級資訊的估計式變異大約 500 倍（100×5 Bernoulli 模擬）。
  - 溫度只改變雜訊組成，不改總量（§5.1.2、Fig. 4）：CRUXEval 在溫度 0.2 時資料雜訊為主、0.8 時預測雜訊為主，總雜訊相近（呼應 Miller §3.3 的「不要調溫度」）。
  - 小而難的 agent benchmark（§6.2）：Terminal-Bench 少於 100 題；「題目很難」不能補償題數少，原文："either we get no information or the problems are not that special."
  - 每模型一條誤差棒的限制（Example 4）：Chatbot Arena 用 Elo、CRUXEval 用固定參考模型把配對比較壓成每模型一個區間，"it's not in general possible to have one error bar per model on a list for comparisons."
  - 方法驗證（附錄 E）：配對變異估計、bootstrap、sign test 給出相同答案。
- 作者自己列的限制（§6.5、附錄 C）：所有實證資料都來自正確率類 eval；沒有做 Miller 的叢集修正；平均預測（expected metric）在「目標是推高某個 eval」或實驗變因會改變分布尖銳度時不適用（Example 6–8）；MMLU 等可猜題在接近機率水準時不符合 Beta 理論；SWE-Fixer 用決定性過濾、vLLM 上的 Llama 疑似設定錯誤，是例外點。
- 與摘要說法不一致處：
  1. 摘要說「most evals exhibit a characteristic and highly predictable total noise level across all model pairs」，正文 §6.4 說資料雜訊大於預測雜訊（低溫）時總雜訊仍符合 Beta 理論，"except for chain-of-thought predictions"，且 "More data is needed to further test if this continues to hold"。摘要語氣比正文確定。
  2. 其餘逐項對過，沒有。
- 反證或後續修正：與 Bowyer et al. 對 CLT 適用門檻看法不同（Wang：N>100 可用；Bowyer：數百以下就有問題）。未找到直接反駁本文的研究。
- 對系列的用途：「分數的誤差棒」一篇的兩個重點：(1) 快速估算法「SE[A−B] ≈ sqrt(p(1−p)/N)」，讀者自己就能判斷兩個分數差是否超出雜訊；(2) 「重跑幾次看標準差」不是完整的誤差棒，漏掉題目抽樣雜訊，這點修正 Madaan et al. 的用法。

---

## 跨來源整理（給寫稿用，非抽取紀錄）

- 誤差棒三種雜訊來源要分開講：題目抽樣（Miller Var(x)、Wang data noise，無法靠重跑消掉）、作答隨機性（Miller E[σ²]、Wang prediction noise，可重抽平均）、訓練 seed（Madaan，只對比較訓練配方有意義）。Madaan 的 seed std 不能直接當公開排行榜的誤差棒。
- 小樣本修正：Miller 的公式適用於數百到數千題；agent benchmark 常只有 50 題（HAL 的 SWE-bench Verified Mini）或更少，應改用 Wilson／Bayesian（Bowyer）。50 題時，精確配對檢定至少要多解 6 題才可能顯著（Poisson Labs 重分析，二手）。
- 配對比較是三方共識：Miller（free variance reduction）、Wang（all-pairs）、Epoch Bayesian ECI（兩模型差距的區間是個別區間的一半寬）。
- harness／設定的量級（同一模型）：scaffold 差 11–48 分（Epoch SWE-bench Verified、HAL SWE-bench Verified Mini）；provider 從約 80% 到個位數（Epoch GLM-4.6，主因是錯誤與截斷）；推論引擎差 10–17 分（CISPA，主因是隱藏預設值）；API 種類差 3–23 分（OpenAI／MiniMax 自報）；prompt＋溫度在 GPQA Diamond 上 74–80% 但不顯著（Epoch）。
- 排行榜數字常是「上限」：Epoch ECI 取各 thinking effort／provider 中的最高分；HAL 排行榜取 best run。

## 補搜紀錄

1. 2024 後更新／反證（統計方法）：Exa `web_search_exa` 查詢「criticism of central limit theorem standard errors for small LLM benchmarks, Bayesian or bootstrap alternative to "Adding Error Bars to Evals"」。找到：
   - Bowyer et al. 2025（ICML position paper）→ 收，精讀。理由：直接檢驗並反駁 Miller 的 CLT 與 clustered SE 在小樣本的有效性，與「自己建 benchmark 時怎麼報告 CI」直接相關。
   - Wang 2025–2026（FAIR）→ 收，精讀。理由：用大規模真實資料量化 Miller 的變異分解，並直接批評 Madaan 的 seed 變異用法。
   - 〈Correcting Prompt Dependence in LLM Benchmarks〉（arXiv 2510.05709，Bayesian 階層＋embedding 叢集）→ 不收。理由：只用 Garak 安全 benchmark 與 2.8B 模型，對主流 benchmark 的外推有限；論點（題目相依讓有效樣本數少 1.3–5.6 倍）已由 Miller 的 clustered SE 涵蓋。
   - VidyalAI 部落格、Naixin Zhang 部落格、evaluatellm R 套件 README → 不收（二手整理），只把 VidyalAI 的真實資料覆蓋率表記在 Bowyer 條目的「不一致處」當參考。
2. HAL 的反證／後續：Exa 查詢「critique or follow-up of Holistic Agent Leaderboard (HAL) Princeton agent evaluation scaffold comparison single runs reliability」。找到三篇，因本批補讀上限 2 篇已用完，只讀到摘要與搜尋結果中的重點段，未精讀：
   - Liu 2026〈Silent Instrument Errors Reorder Agent Leaderboards〉（arXiv 2611.04399）：TAU-bench generalist 落後 13 分是 grader 沒執行造成；HAL 維護者確認三個 instrument error。**建議下批優先精讀**，因為它修正 HAL 的「generalist 付出準確度」說法，也是「harness 本身是測量的一部分」的最佳例子。
   - Hardy et al. 2026〈Agent Evaluation Reliability: More Tasks Won't (Always) Fix An Agent Leaderboard〉（arXiv 2610.00651）：系統排名信度高、底層模型排名信度低；inter-scaffold reliability 0.151–0.852。建議下批精讀。
   - Poisson Labs 重分析（部落格，預先登記分析）：278 對相鄰排名只有 3 對顯著、重跑翻轉 14.5%。可當二手佐證，需對照 Hardy et al. 原始資料。
3. provider 差異一手證據：Exa 查詢「Epoch AI analysis: same open-weight model scores differently depending on inference provider」。找到 Epoch〈Why benchmarking is hard〉（併入 Epoch 條目精讀）、CISPA〈The Silent Hyperparameter〉（收，作為指定的 1 篇精讀；選它而非 Artificial Analysis，是因為它是受控實驗、有根因消融，AA 是儀表板且需二手轉述）、Vals Inference Provider Index（只讀摘要段，記在 Epoch 條目反證欄）、Simon Willison 轉述的 Artificial Analysis gpt-oss-120b 結果（二手，記在 Epoch 條目）、〈When Is the Same Model Not the Same Service?〉（arXiv 2605.02821，只看到摘要片段，偏延遲與可用性，不收）。
4. 未做：Madaan et al. 的專門反證搜尋沒有另外跑，Wang 的批評是從統計方法查詢中帶出來的。
