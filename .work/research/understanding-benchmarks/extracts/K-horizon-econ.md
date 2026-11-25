# K-horizon-econ：長任務與經濟價值類評測（抽取紀錄）

批次：K-horizon-econ｜精讀日期：2026-11-23｜讀取工具：arXiv PDF → `pdftotext`（scratchpad，分段 24KB 依序讀完）；METR／CAIS 網頁以 `curl` 存檔轉文字或 Exa `web_fetch_exa` 全文讀取。

來源總覽：

| # | 來源 | 狀態 |
|---|---|---|
| 1 | METR, Measuring AI Ability to Complete Long (Software) Tasks（arXiv 2503.14499v4） | ✅ |
| 2a | METR, Time Horizon 1.1（2026-01-29） | ✅ |
| 2b | METR, AI R&D-relevant model capabilities are improving rapidly and are getting harder to measure（2026-11-20，Q4 2026 capability update，含 TH2） | ✅ 正文全讀＋附錄 A、B 全讀；附錄 C–O 未逐段讀 |
| 2c | Nguyen & Fithian, On the estimation and validity of AI time horizons（arXiv 2610.12466） | ✅ |
| 3 | OpenAI, GDPval（arXiv 2510.04374v1） | ✅ |
| 3u | GDPval 後續（OpenAI GPT-5.5 發表頁、GPT-6.2 發表頁、HF 資料集頁） | 🟡 只讀到與 GDPval 相關段落（見該節） |
| 4 | Scale AI & CAIS, Remote Labor Index（arXiv 2510.26787v1） | ✅ |
| 4u | CAIS, A Significant Increase in Digital Labor Automation（2026-07-01）＋Scale Labs RLI 排行榜頁＋remotelabor.ai | ✅（CAIS 文全文）／✅（排行榜頁全文，但表格部分欄位未渲染） |
| 補1 | Mertens et al., Crashing Waves vs. Rising Tides（arXiv 2604.01363v3） | ✅ 正文全讀；線上附錄未讀 |

---

### Measuring AI Ability to Complete Long Software Tasks（2025；v4 2026-07-10）
- 網址：https://arxiv.org/abs/2503.14499 （讀 PDF v4：https://arxiv.org/pdf/2503.14499 ）
- 讀取狀態：✅
- 讀取紀錄：pdftotext 後約 127,000 字元；依序讀 0–24k、24k–48k、48k–72k、72k–96k、96k–120k、120k–127k（正文、全部附錄 A–J、表 1–11、作者貢獻），涵蓋全文。注意 v4 標題已改為「Long *Software* Tasks」（v1–v2 為 "Long Tasks"），NeurIPS 2025 收錄。
- 類型：研究論文
- 研究設計或文件目的：提出「50% task-completion time horizon」：模型有 50% 機率完成的任務，其「有相關專業的人類」完成所需時間。任務集 170 題（3 個套件）：HCAST 子集 97 題（46 個 family，1 分鐘–30 小時，資安／ML／SWE／一般推理）、RE-Bench 7 題（每題 8 小時的 ML 研究工程）、SWAA 66 題（1–30 秒的軟體原子動作，為了量 GPT-2/GPT-3 而新做）。人類基準：800+ 次 baseline、共 2,529 小時；HCAST+RE-Bench 558 次（286 成功），SWAA 249 次（236 成功）；169 題中 148 題有人類基準，21 題用研究員估計。baseliner 為 SWE／ML／資安專業人士，多數來自全球前百大學、平均約 5 年經驗。模型：2019–2025 年 12 個前沿＋4 個近前沿模型，每個 agent/task 約 8 次 run。計算：先把每題結果二元化（連續分數用「代表人類表現」的門檻；RE-Bench 用 7–9 小時人類 run 的平均分），任務時長取「成功人類 baseline 的幾何平均」，再對每個模型做 logistic 迴歸 `p_success = σ((log h_agent − log t_task)·β_agent)`，h_agent 即 50% 時間地平線；task 權重為 1/√(family 大小)。之後對 log(horizon) vs 發布日做 OLS 得倍增時間，CI 用三層階層 bootstrap（task family → task → run，10,000 次）。
- 會被引用的結果：
  - 倍增時間 207 天，95% CI 166–240 天（約 ±19%）；§3.2："time horizon has doubled every 207 days with a 95% bootstrapped confidence interval 166-240 days (roughly ±19%)."
  - GPT-2 的 50% horizon 約 2 秒，o3 約 110 分鐘；o1 約 39 分鐘（附錄 C.4）；§3.2："GPT-2 has a 50% time horizon of only 2 seconds, while o3 has a 110-minute time horizon"。o3 高於長期趨勢（p = 0.006）。
  - 80% horizon 倍增時間 204 天（與 50% 的 207 天相近），但絕對值短 4–6 倍；§3.2.1："models' 80% time horizons are 4-6x shorter, suggesting that even models that sometimes succeed on difficult and diverse tasks cannot reliably perform tasks of moderate length."
  - 只用 2023–2025 非 SWAA 資料：倍增 172 天；只用 2024 年模型：約 3 個月（附錄 F.1）；2024 模型在 HCAST+SWAA+RE-Bench 的倍增 143 天（§4.1）。
  - 外推 1 個月（167 工時）horizon：80% CI「mid-2028 到 mid-2030」，中心估計 mid-2029；若照 2024–2025 趨勢則一半機率落在 2027、甚至 2026 年底（§5、§6）。
  - 「messiness」：16 個因素（如非自動評分、資源受限、動態環境、需主動找資訊），HCAST+RE-Bench 平均 3.2/16，無一題超過 8/16；控制長度後每多 1 分成功率約降 8.1%（b = −0.081，R² = 0.251），但高低 messiness 子集的進步速度相近（sub-hour 任務 2023-01 到 2025-05 都升 40 個百分點）（附錄 F.2）。
  - 內部 PR 實驗：外包 baseliner 比 repo 維護者慢 5–18 倍；模型表現與「外包者時間」一致、比「維護者時間」預測的差（§4、附錄 C.2）："time horizons may have better correspondence to the labor of a low-context human, rather than a high-context human."
  - SWE-bench Verified 複製：倍增約 70 天（較陡），因標註時間低估簡單題（"<15 min" 桶的 4 題 baseliner 實際 8、26、67、84 分鐘，幾何平均 32.9 分鐘）（§4.1、附錄 H.5、表 8–9）。
  - 人類自己的 50% horizon 若照同法計算只有約 1.5 小時（雖然有付錢做到 8 小時），作者認為是付費機制造成的放棄（附錄 C.1.4）。
  - 成本：以 $143.61/小時計，80%+ 的成功 run 成本低於人類的 10%（附錄 E.4、圖 14）。
- 作者自己列的限制：
  - 任務集偏軟體／ML 研究；全部可自動評分、無多 agent 互動、資源限制寬鬆、少有一錯就毀、環境靜態（附錄 B.2）。
  - "time horizon is always measured relative to a domain, task distribution, and human baseliners' level of skill and context"（§6）。
  - 人類基準只取成功者會偏短、長任務的人類成功率常 < 50%，長任務時長評等信心較低，可能「低估進步速度」（附錄 C.1.4）；baseliner 低 context 會拉長時長，但高技能會縮短（附錄 E.3）。
  - 量 95%、98% 等高可靠度 horizon 需要大量低噪音任務，目前做不到（附錄 E.3）。
  - elicitation 投入有限（o1 與原 Claude 3.5 Sonnet 各約 2–3 工程師週），結果是下界（附錄 E.4）。
  - messiness 因子本身「at least somewhat adversarially selected against current models」（附錄 H.6）。
  - 外推的不確定性主要來自外部效度與未來趨勢變化，敏感度分析並未涵蓋（圖 6 說明）。
- 與摘要說法不一致處：
  - 1 個月 horizon 的區間：§1 寫 "between mid-2028 and mid-2031"，§6 寫 80% CI "from mid-2028 to mid-2030"；兩處不一致。
  - 模型數：§1 寫 "12 frontier models"，§6 寫 "11 frontier AI models"。
  - 摘要稱 o3 為 "current frontier AI models"，但 v4 日期為 2026-07-10，內容未更新到 2026 年模型（v4 只改了標題與小處）；引用時要寫明數字是 2025 年初的量測。
  - 摘要說 "doubled approximately every seven months since 2019, though the trend may have accelerated since 2024"，正文 §3.2 的 207 天＋o3 p=0.006 支持；但附錄 E.4 承認 2024–2025 段「due to the small number of models it is unclear if this is noise」。摘要的 "may" 措辭與正文一致，不算矛盾。
- 反證或後續修正：
  - TH1.1（2026-01）換任務集後，2023 後倍增由 165 天變 131 天，GPT-4 系列估值下修 35–57%（見 2a）。
  - METR 2026-03-20 研究筆記：logistic 迴歸原本誤加正則化（C=10），2026-03-03 修正後近期模型 50% horizon 下降最多約 20%；任務長度噪音可能使前沿 50% horizon 高估約 30%（0–60% 都排除不了）：https://metr.org/notes/2026-03-20-impact-of-modelling-assumptions-on-time-horizon-results/ （本批只讀 Exa 摘錄，未全文精讀）
  - METR 2026-01-22「Clarifying limitations of time horizon」：視覺電腦操作的 horizon 低 40–100 倍；SWE-Lancer 上任務金額與成功率不相關；誤差約每方向 2 倍：https://metr.org/notes/2026-01-22-time-horizon-limitations/ （只讀 Exa 摘錄）
  - 外部統計批評見 2c；跨領域低預測力見補1、4u。
- 對系列的用途：支撐「benchmark 從答對題轉向『能做多長的工作』」的核心例子，以及「人類基準怎麼定（成功者幾何平均、低 context 外包者 vs 維護者差 5–18 倍）會直接改變結論」的論點。

---

### Time Horizon 1.1（METR，2026-01-29）
- 網址：https://metr.org/blog/2026-01-29-time-horizon-1-1/
- 讀取狀態：✅
- 讀取紀錄：curl 存檔轉文字約 14,900 字元（含導覽列），一次讀完 0–14,900（正文、兩張比較表、Vivaria vs Inspect 附錄、註腳）。
- 類型：官方文件（研究部落格）
- 研究設計或文件目的：更新 time horizon 任務集與評測基礎設施。任務 170 → 228（新增 73 題 HCAST、移除 15 題、更新 53 題：27 題改定義、13 題改人類時間、13 題兩者皆改）；8 小時以上長任務 14 → 31；評測框架由自研 Vivaria 改為英國 AISI 的 Inspect。33 個有 TH1 估值的模型只重估 14 個。
- 會被引用的結果：
  - 倍增時間（全期，拼接 TH1 舊模型）：TH1 195.8 天 [162, 223] vs TH1.1 196.5 天；2023 起：165.3 天 [129, 211] vs 130.8 天 [107, 161]；2024 起：108.9 天 vs 88.6 天（附錄表）。正文："The post-2023 doubling-time is 131 days under TH1.1, compared to 165 days under TH1, meaning progress is estimated to be 20% more rapid under TH1.1."
  - 個別模型：Claude Opus 4.5 289 → 320 分鐘（+11%）；GPT-5 138 → 214（+55%）；o3 94 → 121（+29%）；GPT-4 1106 8.5 → 3.6（−57%）；GPT-4 0314 5.4 → 3.5（−35%）。
  - 31 題長任務中只有 5 題有實測人類 baseline："we measured human baseline times for only 5 of our 31 long (8h+) tasks. The remainder use estimated times."（TH1 的 14 題長任務中有 6 題實測）
  - Opus 4.5 的 CI 上界由點估計的 4.4 倍縮到 2.3 倍。
  - 框架效應：同一批 TH1 任務，GPT-4o 在 Vivaria 9.2 分 vs Inspect 6.0 分；o3 94 vs 78；Sonnet 4.5 122 vs 164；GPT-4o 與 o3 在 Vivaria 顯著較高（配對 t 檢定）。
- 作者自己列的限制："The trend in time horizon is somewhat sensitive to task composition."；新任務「drawn from a slightly different distribution of difficulty」，是「updating our pool of tasks without having a rigid selection criteria」的自然結果；bootstrap CI 代表「換一整組新任務」的變異，但 TH1 與 TH1.1 任務大量重疊，所以落在 CI 內不代表穩定；TH1.1 已接近飽和，「relatively few tasks that the latest generation of models cannot perform successfully」。
- 與摘要說法不一致處：開頭說 "The new estimates generally fall within our existing confidence intervals"，但同文承認這些 CI「over-estimate the run-level variance」且兩版任務重疊，"within CI" 的安慰作用被自己削弱；其餘逐項對過，沒有。
- 反證或後續修正：2026-03 正則化錯誤修正（見來源 1）；2026-11 Q4 update 稱 TH1.1 已被飽和並加入 TH2（見 2b），且引用「previous TH1.1 doubling trend of 105 days」，與本文的 130.8／88.6 天都不同，Q4 文未說明區間定義（未解）。
- 對系列的用途：說明「倍增時間」這個數字會隨任務組成變動 20%，以及長任務的人類基準大多是估的。

---

### AI R&D-relevant model capabilities are improving rapidly and are getting harder to measure（METR Q4 2026 capability update，2026-11-20）
- 網址：https://metr.org/blog/2026-11-20-q4-2026-capability-update/
- 讀取狀態：✅（正文 §1–§6 全讀；附錄 A Difficulty Estimation and Baselining、附錄 B Time Horizon Diagnostics 全讀；附錄 C–O 只以關鍵字查核數字，未逐段讀）
- 讀取紀錄：curl 轉文字約 189,000 字元（大量為圖表資料與附錄）。正文（第 1–253 行，約 59,000 字元）分 0–22k、22k–44k、44k–59k 讀完；附錄 A、B（第 255–385 行，約 20,000 字元）讀完；其後約 110,000 字元附錄（MCI、Lifecycle Cost 估法、reward hacking、swarm、AZsPCs、NanoGPT 等）以 grep 抽查。
- 類型：官方文件（研究報告）
- 研究設計或文件目的：TH1.1 已被前沿模型飽和，METR 新做 TH2（36 題、12 個 family；verifiable 8 個 family：AZsPCs、Budget NanoGPT、Minecraft Bot、Reverse Conway、Train a Program、Earthborne Rangers、Slay the Spire、Dominion-like；hard-to-verify & judgment 4 個 family：Making METR Tasks、Investigate Wiki Incident、LMCA、Judge Run），並併用 TH1.1（222 題）與 MirrorCode（75 題）。TH2 每題有多個 (score, time) 門檻而非單一門檻；部分題由人工或模型評分。另引入 IRT 型的 METR Capability Index（MCI）與「Lifecycle Cost」（把任務做成 RL 環境並跑 100 次的估計成本，由 Opus 5.5 估）。測 15 個模型（GPT-4o 到 GPT-6 Astra、Opus 5.5）。
- 會被引用的結果：
  - 人類基準大轉向：「Human baselines are directly used for only 9% of our estimates for how long it takes a human to complete the task.」36 題中 34 題有 (score, time) 點，其中只有 3 題來自成功人類 baseline，31 題是研究員估計（§2）。baseliner 時薪 $200–350、7 次 baseline 花約 $9 萬，且允許用 Sonnet 5 寫實作（§3.A.1、附錄 A）。
  - 三題正式 baseline 上，最佳模型都贏過所有人類 baseliner（附錄 A）；但在有大量人類資料的 AZsPCs，最強模型中位數落在人類參賽者第 96–98 百分位、每場約 4 位人類贏過模型；Budget NanoGPT 最佳 agent 48 小時提速 15.7%，人類紀錄 #92 約 60 小時提速 41%（§3.A.2）。
  - TH2 verifiable 子集上前沿模型 50% horizon「up to 27 hours」（§3.A.1）。
  - 倍增時間：TH1.1＋TH2 合併為 3.61 個月（95% CI 2.08–4.94），約 110 天；naive 外推 2027 年 7 月達到任務集最長門檻 200 小時；TH2 verifiable 單獨為 1.65 個月（95% CI 0.79–3.99）（§3.C.1）。作者自己提出「任務越不多樣，倍增時間越短」的替代解釋："doubling times may tend to be shorter on less diverse sets of tasks."
  - Lifecycle Cost：控制人類時長後，成本越高的任務模型越差；高成本子集平均貴 2.9 倍，模型 horizon 差 2.9 倍（約 1.5 次倍增）；但兩子集倍增速度相近（§3.B.1）。
  - 判斷力：LMCA 上所有公開模型仍低於「花 15 分鐘的專家」一致度；模型做的 METR 任務沒有一個好到能放進報告；模型當評審時對「比自己強或一樣強的模型」的產出高估，Opus 5.5 對 Astra 的任務平均高估約 0.2（滿分 1）（§3.B.2）。
  - MCI 上整體前沿看不到明顯加速或減速（§3.C.2）。
  - 時間估計穩健性：把 TH2 高分門檻時間全乘 4 倍，反而讓近期模型的 horizon 估值變低、CI 變窄（logistic 擬合在遠端資料點少時會變平）（附錄 B）。
  - 背景轉變："We are increasingly concerned that our easy-to-run, containerized evals could overestimate real-world capabilities, due to similar RL environments becoming common in training."（§1）
- 作者自己列的限制：時間估計「quite speculative」（附錄 A）；新任務不像 TH1.1 涵蓋一般 SWE；Lifecycle Cost 由 LLM 估、以 METR 自身成本校準，與「真實感」的關係不明；判斷類任務少、部分僅一位評分者；swarm 可能讓 verifiable 任務被低估（swarm 實驗花約 $50 萬 token）；MCI 的開發商別斜率變化對方法選擇很敏感；人類 baseliner 可能不如前沿實驗室研究員，且容器化任務對人「artificially unfriendly」。
- 與摘要說法不一致處：Overview 寫「Models usually match or outperform skilled humans on our coding and optimization tasks」，但 §3.A.2 在人類樣本較大的兩個 family 上，模型「generally unable to beat the very top performing humans」——「skilled humans」指的是 METR 自己招到的少數 baseliner，不是頂尖人類；引用時要分開。另 §3.C.1 說先前 TH1.1 倍增為 105 天，與 TH1.1 公告的 130.8 天（≥2023）／88.6 天（≥2024）都不同，文中未交代區間。
- 反證或後續修正：發布僅 3 天，尚未找到外部回應；MIT Technology Review（2026-11-20）報導強調「completion times are mostly estimates」與 LMCA 單一評分者問題（二手，未列為證據）。
- 對系列的用途：支撐「人類基準在長任務上變成估計值（只剩 9% 實測）」「可驗證任務 vs 判斷類任務的落差」「評測與 RL 訓練環境重疊會高估能力」三個論點，也是 time horizon 方法 2026 年底的最新狀態。

---

### On the estimation and validity of AI time horizons—a statistical look at the METR plot（Nguyen & Fithian，2026）
- 網址：https://arxiv.org/abs/2610.12466 （讀 PDF：https://arxiv.org/pdf/2610.12466 ）
- 讀取狀態：✅
- 讀取紀錄：pdftotext 約 55,400 字元；依序讀 0–24k、24k–48k、48k–55.4k（正文 §1–§4、參考文獻、附錄圖 7–9 說明），涵蓋全文。
- 類型：研究論文（外部統計批評，UC Berkeley 統計系）
- 研究設計或文件目的：用 METR 公開資料（TH1.1 的 228 題、79 個 task family、26 個 AI）重估 time horizon。比較四種模型設定：METR 原本逐模型 logistic、共用斜率 logistic（Barry 2026，作為 baseline）、Model 1（共用單調 spline 取代 log 時間的線性關係）、Model 2（解釋型 IRT：task 潛在難度 = f(log 人類時間)＋family 效應＋個別誤差，加 beta-binomial 過度離散）。以 5-fold（按 family 切）交叉驗證、12 個 proper scoring rule 指標與 Murphy diagram 評估。
- 會被引用的結果：
  - 人類時間 → AI 難度的轉換函數在 2–30 分鐘區間近乎平坦，其他區段近線性；摘要："a time-horizon jump from 3 min to 30 min is much easier than one from 30 min to 5 hours despite the same multiplier of 10×."
  - Model 1、2 在 12 個交叉驗證指標上點估計全面優於 baseline；改善集中在 horizon 2–15 分鐘的 GPT-4 世代模型，部分估值落到 METR 原 95% CI 之外（§2.5、圖 4、圖 9）。
  - 同一 AI-task 的多次 run 相關性高：若獨立，預期約 60% 的 run 組全對或全錯，實際 83%（§2.3）。
  - METR 原圖可能「其實在量另一個構念」：Model 2 的 Rasch ability 經仿射縮放後與 METR horizon 幾乎重合（R² = 0.996），比 Model 2 自己的 horizon 還接近；"even though the linear logistic model attempts to estimate time horizons, it may be inadvertently estimating another AI capability construct."（§3.4）
  - Model 2 估的倍增約 6.0 個月（圖 5a 標示）。
  - 228 題中 29% 沒有可用的人類 baseline，改用專家估計（§2.2）。
  - 構念效度檢查清單 5 項（任務代表性、二參數是否夠、時間標註是否客觀、可預測性、可比性），本文只處理後兩項，前三項假設成立（§3.1）。
- 作者自己列的限制：只處理 predictiveness 與 comparability，不挑戰任務代表性與人類時間的意義；不質疑指數成長本身（"the observed exponential growth is entirely empirical and we do not challenge it here"）；任務延伸到 30 小時以上時 f 可能再變形，線性模型偵測不到（§4）。
- 與摘要說法不一致處：逐項對過，沒有。
- 反證或後續修正：本文引用 METR 自己的 Barry（2026）筆記，其共用斜率設定在交叉驗證上已勝過原設定，表示 METR 內部也在修正估法；目前未見對本文的回應。
- 對系列的用途：支撐「time horizon 的『倍數』在不同區段意義不同、外推風險不只來自趨勢、也來自量尺本身」的論點，是一手的統計批評。

---

### GDPval: Evaluating AI Model Performance on Real-World Economically Valuable Tasks（OpenAI，2025）
- 網址：https://arxiv.org/abs/2510.04374 （讀 PDF v1：https://arxiv.org/pdf/2510.04374 ）；官方部落格 https://openai.com/index/gdpval/ （只讀 Exa 摘錄，用於比對說法）
- 讀取狀態：✅
- 讀取紀錄：pdftotext 約 78,900 字元；依序讀 0–24k、24k–48k、48k–72k、72k–78.9k（正文、附錄 A.1–A.7、表 1–7），涵蓋全文。
- 類型：研究論文（開發商自建評測）
- 研究設計或文件目的：
  - 職業怎麼選：(1) 取 2024 Q2 占美國 GDP 超過 5% 的 9 個產業；(2) 每產業取總薪資最高、且「以數位工作為主」的 5 個職業（Retail 只有 4 個，合計 44）。「數位」判定：用 GPT-4o 把每個 O*NET 任務分類為數位／非數位，依 O*NET 的 relevance、importance、frequency 加權，數位占比 ≥ 60% 即算；並以 Acemoglu & Autor（2011）任務內容框架驗證相關性（附錄 A.7）。44 個職業年薪資總額約 $3T。
  - 出題：業界專家至少 4 年經驗、平均 14 年，需過影片面試、背景調查、訓練與測驗，申請者不到 10% 錄取；每題由「需求（含參考檔）＋交付物」組成，依其真實工作產出改寫，對應 O*NET 任務。每題平均 5 次人工審查（至少 3 次），另有模型先篩（§2、附錄 A.5）。全集 1,320 題（每職業 30 題），金標子集 220 題（每職業 5 題）開源。
  - 評分：同職業專家盲評，看需求與參考檔後對兩份以上未標示來源的交付物排序（模型 vs 人類），寫理由；金標子集每次比較平均超過 1 小時。每模型每題取樣 3 次、每份由 3 位評審評，共 9 次比較（§2.5、註 2）。
  - 指標：win rate（模型被評為優於人類）與 win-or-tie rate（優於或相當）。
  - 自動評分器：以 GPT-5-high 為底的實驗性 pairwise grader（附錄 A.6）。
- 會被引用的結果：
  - 最佳模型 Claude Opus 4.1：47.6% 的交付物被評為優於或等同人類專家（§3.1）："47.6% of deliverables by Claude Opus 4.1 were graded as better than (wins) or as good as (ties) the human deliverable."
  - 純 win rate（表 2）：GPT-4o 12.5%、o4-mini 29.1%、o3 35.2%、GPT-5 39.0%。
  - 自動評分器與人類一致率 65.7%，人類評審間一致率 70.8%（附錄 A.6.2；正文四捨五入為 66% vs 71%）；自動評分器評 OpenAI 自家強模型時一致率較低，作者引自我偏好文獻；220 題中 12 題無法自動評分。
  - 速度／成本（附錄 A.2.1、表 2）：人類專家平均 404 分鐘、$361；評審一次平均 109 分鐘、$86。「Naive」比值 GPT-5 快 90 倍、便宜 474 倍；但「試一次，不行就自己做」只快 1.12 倍、便宜 1.18 倍；「試到成功為止」快 1.39 倍、便宜 1.63 倍。原文："When incorporating time to review and redo work, the payoff from using a model shrinks."
  - 失敗嚴重度：GPT-5 輸給人類的案例中，約 29% 被評為 bad 或 catastrophic（約 3% catastrophic）（附錄 A.2.6）。
  - win rate 隨任務時長下降，0–2 小時最高（附錄 A.2.5）。
  - 提示詞調整讓 GPT-5 win rate 提升 5 個百分點，PDF 黑框瑕疵從過半降到 0，PPT 嚴重格式錯誤 86% → 64%（§3.4）。
  - 任務特性：金標平均完成時間 9.49 小時（中位 5 小時、最長 100 小時）、平均價值 $398；全集平均 8.63 小時（最長 605 小時）、$391（表 3、4）；89% 被評為 well-specified（表 7）；O*NET 任務覆蓋率只有 14.15%（208/1,470）（表 6）。
- 作者自己列的限制（§5）：只有 44 職業×30 題；只含電腦上的自足知識工作，排除體力、大量隱性知識、PII、專有軟體、人際溝通；"Tasks are precisely-specified and one-shot, not interactive"；降低 context 的版本（提示長度剩 42%）GPT-5 表現變差（附錄 A.2.7）；自動評分器不能取代專家；人類時間為自報，可能高估或低估；評審可能從文風認出模型（OpenAI 愛用 em dash、Claude 第一人稱、Grok 自稱 Grok）；速度成本分析未計人類交付物的審查成本，也未計災難性錯誤成本。
- 與摘要說法不一致處：
  - §3.1 同一段先寫 47.6%，接著寫 "Model deliverables outperformed or matched expert humans' deliverables in just over half the tasks"——最佳模型 47.6% 不到一半；官方部落格寫 "just under half"。論文這句與自己的數字矛盾。
  - 摘要稱模型可能「cheaper and faster than unaided experts」、部落格寫「roughly 100x faster and 100x cheaper」；附錄 A.2.1 計入審查與重做後只有 1.1–1.6 倍。部落格雖有補一句不含人類監督，但頭條數字與論文的實際情境差兩個數量級。
  - 部落格同頁對 GPT-4o→GPT-5 先寫 "more than doubled" 再寫 "more than tripled"（12.5%→39.0% 的 win rate 是 3.1 倍）。
- 反證或後續修正：見下方「GDPval 後續」；CAIS 2026-07 引用其自動評分器 5 個百分點落差作為「LLM judge 不能取代人」的旁證（見 4u）。
- 對系列的用途：支撐「benchmark 轉向『能替代多少有償工作』」的代表例，以及「評分主觀性（人類評審間一致率只有 71%）」「把模型產出時間直接當省下的時間會誇大」兩個論點。

---

### GDPval 後續（OpenAI 官方，2025-12 至 2026-11）
- 網址：https://openai.com/index/introducing-gpt-5-5/ ；https://openai.com/index/introducing-gpt-6-2-astra-sol/ ；https://huggingface.co/datasets/openai/gdpval
- 讀取狀態：🟡（GPT-5.5、GPT-6.2 兩頁只透過 Exa 搜尋取得 GDPval 相關段落與評測表，未全文讀；HF 資料集頁讀到資料卡與前數列）
- 讀取紀錄：GPT-5.5 頁取得「Professional」評測表與 Knowledge work 段；GPT-6.2 頁取得 GDPval v2 段落；HF 頁取得欄位結構。未試 jina／WebFetch 全文，因本批只需 GDPval 數字與定義。
- 類型：官方文件（模型發表頁）
- 研究設計或文件目的：模型發表時自報 GDPval 分數。
- 會被引用的結果：
  - GPT-5.5（2026-04-23）："GDPval (wins or ties) 84.9%"；同表 GPT-5.4 83.0%、Claude Opus 4.7 80.3%、Gemini 3.1 Pro 67.3%；註明 "Evals of GPT were run with reasoning effort set to xhigh and were conducted in a research environment"。第三方彙整顯示 GPT-5.2（2025-12）為 70.9%（未讀一手頁）。
  - 2026 年中起 OpenAI 發表頁改報 Artificial Analysis 的 GDPval-AA（Elo，模型對模型）而非 win-or-tie（第三方彙整所述，未讀一手頁）。
  - GPT-6.2（2026-11-17）改報內部「GDPval v2」："Our internal GDPval v2 benchmark is our next iteration of GDPval that measures complex, long-horizon workflows from real projects in sectors like consulting, finance, and design."；GPT-6.2 Astra 比 GPT-6 Astra 高 6.2 個百分點；題數、評分方式、分數定義未公開。
  - HF 公開金標集 220 題現附 `rubric_pretty`／`rubric_json` 欄位（逐項評分準則，標 `author_type: human`），原論文未提 rubric。
- 作者自己列的限制：GPT-6.2 頁未列；GPT-5.5 頁只註明評測環境。
- 與摘要說法不一致處：GPT-5.5 頁把 GDPval 描述成 "tests agents' abilities to produce well-specified knowledge work"，與原論文「one-shot、非互動」一致；但未說明 84.9% 是否仍由人類專家盲評（原論文的主要方法），也未說明是否用自動評分器——無法確認可比性。
- 反證或後續修正：分數從 47.6%（2025-09）到 84.9%（2026-04）七個月內接近飽和，隨後 OpenAI 換成 v2；這是「新量法也很快飽和」的實例。
- 對系列的用途：支撐「經濟價值類 benchmark 同樣一年內飽和、改版後無法跨版比較，且開發商自報版本細節不透明」。

---

### Remote Labor Index: Measuring AI Automation of Remote Work（Scale AI & CAIS，2025）
- 網址：https://arxiv.org/abs/2510.26787 （讀 PDF v1：https://arxiv.org/pdf/2510.26787 ）
- 讀取狀態：✅
- 讀取紀錄：pdftotext 約 91,000 字元；依序讀 0–24k、24k–48k、48k–72k、72k–91k（正文、附錄 A–C、範例 brief），涵蓋全文。
- 類型：研究論文
- 研究設計或文件目的：以「整個自由接案專案」衡量 AI 能否自動化遠端工作。從 Upwork 64 個子類別過濾（排除需體力、需等待驗證如 SEO、需與客戶互動、需團隊、無法在網頁平台渲染等），再向 358 位已驗證 Upwork 接案者購買過往作品（每案 $15–200，平均 $41），加上長尾來源，收 550 案、清理後 240 案，涵蓋 23 個子類別（影片動畫 13%、3D/CAD 12%、平面設計 11%、建築、遊戲開發、音訊、產品設計等）。每案含 brief、輸入檔、人類金標交付物，以及接案者自報的時間與費用。私有測試集 230 案、公開 10 案。
- 指標：
  - Automation rate：AI 交付物「至少和人類一樣好、合理客戶會接受」的專案比例。
  - Elo：AI 兩兩比較（完成度優先、都完成才比品質），人類基準固定 1,000，差 400 = 10:1 勝率；Bradley-Terry 擬合。
  - Dollars earned：AI 完成專案的人類價格總和（上限 $143,991）。
  - Autoflation：用「人或 AI 中較便宜者」完成整包專案時的成本下降百分比。
- 評估方法：全人工、整體判斷（不用逐項 rubric，因 rubric 會讓「技術上符合但專業上不及格」的設計作品過關）；三分制（1 不被接受、2 一樣好、3 更好），2 或 3 計為自動化；三位獨立評審多數決；評審採「合理客戶」視角、人類交付物的瑕疵視為可接受誤差範圍；自建開源網頁評估平台可原生渲染數十種格式（含 CAD、3D、PSD）。
- 會被引用的結果：
  - 最佳 automation rate 2.5%（Manus）；Grok 4、Sonnet 4.5 2.1%；GPT-5 1.7%；ChatGPT agent 1.3%；Gemini 2.5 Pro 0.8%（表 1）。摘要："AI agents perform near the floor on RLI, with the highest-performing agent achieving an automation rate of 2.5%."
  - Elo：Manus 509.9 最高，所有模型都遠低於人類 1,000（表 3）。
  - Dollars earned：Manus $1,720 / $143,991（表 4）。
  - 專案規模：平均 28.9 小時、中位 11.5 小時、最長 450 小時；平均 $632.6、中位 $200、最高 $22,500；總計 6,000+ 小時、$140,000+（§3.1、附錄 C.5）。作者稱平均完成時間與隨機抽樣的 275 個 Upwork 工作相符，並超過 HCAST、GDPval 兩倍以上（圖 6）。
  - 評審一致率：automation rate 94.4%；Elo 三元一致率 56.9%（隨機 33.0%），硬性分歧 5.9%（§3.4）；評一案平均 11.4 分鐘。
  - 偽陰性率經 50 案抽查為 0，95% 信心下 ≤ 5.8%；所有判為成功的案例全數人工複核（附錄 B.5）。
  - 失敗類型（約 400 次評估）：品質差 45.6%、不完整 35.7%、檔案損毀或格式錯 17.6%、跨檔不一致 14.8%（表 2）。成功案例集中在音訊、圖像生成、報告撰寫、資料視覺化程式。
  - GPT-5 用 CLI 腳手架（1.7%）優於電腦操作腳手架（0.8%）（附錄 A.3）。
  - AI 產出平均成本 $2.34，均未超過 $30（圖 12）。
- 作者自己列的限制：排除需與客戶互動、需團隊、無法即時驗證等類型，"an AI obtaining 100% automation rate on RLI may still underperform humans on types of work that we do not evaluate"；費用未依通膨調整（低估現值）；費用與時間為接案者自報，95% 有費用、84% 有時間；預期 AI 交付物變複雜後評審一致率會下降、評審時間會增加。
- 與摘要說法不一致處：
  - §3.2 稱私有 230 案用於量化評估，但所有報告數字都是 240 的整數倍（2.5% = 6/240、2.1% = 5/240、1.7% = 4/240、1.3% = 3/240、0.8% = 2/240；若分母是 230，6 案應為 2.6%）。論文內的分母說法與數字不一致（2026-11 排行榜時期第三方也提出同一疑問，見 4u）。
  - §3.2 寫篩選後剩 "43 eligible categories"，附錄 C.2 寫 "45 total Upwork categories"。
  - 圖 11 兩張直方圖標題與 §3.4 文字的平均值對不上（文字：automation rate 評估平均 11.4 分鐘、Elo 17.4 分鐘；圖標題「Automation Rate Evaluation Time」下標 Mean 17.4），疑似標題互換。
  - 附錄 C.2 承認因「Many projects in the Content Writing category can already be solved by AIs」而整類排除，這會系統性壓低 automation rate；摘要與結論未提這個選擇效應（作者只說是類別層級排除）。
- 反證或後續修正：2026 年分數快速上升與腳手架改版（見 4u）；CAIS 2026-07 指出 time horizon 方法在 RLI 上不成立（見 4u）。
- 對系列的用途：支撐「以真實交易價格與『客戶會不會接受』定義成功」的量法，以及「當時最強模型只能自動化 2.5%」作為與 GDPval 47.6% 的對照（兩者差在一次性交付 vs 端到端專案、題目是否經人改寫成 well-specified）。

---

### RLI 後續：A Significant Increase in Digital Labor Automation（CAIS，2026-07-01）＋Scale Labs 排行榜（至 2026-11）
- 網址：https://safe.ai/blog/significant-increase-in-digital-labor-automation ；https://labs.scale.com/leaderboard/rli ；https://www.remotelabor.ai/
- 讀取狀態：✅（CAIS 文 Exa 全文約 10,000 字元一次讀完；Scale 排行榜頁全文讀完，但表格的部分分數欄位未渲染；remotelabor.ai 首頁讀完）
- 讀取紀錄：CAIS 文 0–10k 全文；Scale 頁 0–9k 全文；remotelabor.ai 0–4k。
- 類型：官方文件（共同作者機構部落格與排行榜）
- 研究設計或文件目的：發布新模型 RLI 結果、說明評測設定改版、檢驗自動評審與 time horizon 方法在 RLI 上是否適用。
- 會被引用的結果：
  - 2026-07：Fable 5 15.8%、Opus 4.8 8.3%、GPT-5.5 6.3%；先前領先者為 Opus 4.6（Claude Cowork 腳手架）4.17%（§1）。
  - 腳手架大改：改用各家「最強產業腳手架」（Anthropic 模型用 Claude Code、OpenAI 模型用 Codex CLI，加上電腦操作工具），Linux 桌面 VM 內裝 30+ 專業軟體（Blender、FreeCAD、GIMP、Kdenlive、Audacity、LibreOffice 等），每案最長 24 小時、必要時一張 A100、預算 $50（Fable 5 為 $150），並加入 worker-critic 迴圈（§4）。原論文是每案 1 小時 session、上限 $30。
  - 自動評審失準：以舊模型（合計人類判定 3.3%）校準的 LLM judge，套到新模型時 GPT-5.5 人類 6.25% vs judge 17.9%（約 2.9 倍）、Opus 4.8 8.33% vs 18.8%（約 2.3 倍）；排序仍正確（Spearman ρ = 0.90）（§3）。原文："an AI judge inherits the same limitations as the AI workers it grades."
  - Time horizon 不適用：§5 "A model's success rate does not fall as human completion time rises; many other factors determine whether it succeeds, and the time-horizon model fits the data poorly."
  - 2026-11 排行榜：Claude Fable 5.2 41.25%（remotelabor.ai 首頁）／41.3%；Opus 5.5 21.25%、GPT-6 Astra 20.83%、Gemini 4 Argon 17.08%；remotelabor.ai 稱「×2 every ~3.3 months」。排行榜註明 "There is no confidence interval for Automation Rate."
- 作者自己列的限制：排行榜頁沿用原論文限制（全人工評估難以高頻測試、排除客戶互動等）；CAIS 文說明推理設定曾誤植為 high，已更正為各家預設（註 1）。
- 與摘要說法不一致處：
  - 排行榜頁「Agent Methodology」段仍寫原論文設定（OpenHands／自建 CUA、$30 預算），與 CAIS 2026-07 的新腳手架不符；同一張排行榜混合兩代評測設定，未分版本標示。
  - 41.25% = 99/240，21.25% = 51/240，仍以 240 為分母，與「私有 230 案用於量化評估」的說法不一致（延續原論文的問題）。
- 反證或後續修正：第三方（Pebblous，經 i10x 轉述，未讀一手）指出分母與腳手架升級使 2.5% → 41.3% 不是純模型對模型比較；CAIS 推特稱「AIs may soon be able to do all remote work」屬外推，非 41.3% 本身的發現。
- 對系列的用途：支撐「同一個 benchmark 分數上升可能部分來自腳手架與預算改變」「LLM 評審在最需要它的前沿模型上最不準」「time horizon 不是普遍適用的量尺」。

---

### Crashing Waves vs. Rising Tides: Findings on AI Automation from Thousands of Worker Evaluations of Labor Market Tasks（Mertens et al.，MIT FutureTech，2026）【補搜 1】
- 網址：https://arxiv.org/abs/2604.01363 （讀 PDF v3，2026-07-23：https://arxiv.org/pdf/2604.01363 ）
- 讀取狀態：✅ 正文全讀（§1–§4.2）；線上附錄（約 88,000 字元，含模型清單、穩健性圖表、提示詞、範例）未讀，正文引用的附錄圖表（A.2、A.5、A.8、A.10、A.11）只依正文描述
- 讀取紀錄：pdftotext 約 154,000 字元；正文到參考文獻前約 65,500 字元，依序讀 0–24k、24k–48k、48k–65.5k。
- 類型：研究論文（經濟學／勞動市場；資金來自 Open Philanthropy 與「一家科技公司」）
- 研究設計或文件目的：從 O*NET 18,786 個任務中，用 GPT-4 篩出 LLM 可省 ≥10% 時間者 11,768 個；用 GPT-5 為每個任務生成 6 個約 150 字的自足情境（instance），再用 GPT-5 過濾；41 個 LLM（2023-06 到 2025-08）以同一提示回答（上限 700 字）。透過 Prolific 招募在該職業有 ≥6 個月經驗的美國工作者，先確認情境真實且具代表性，再對 5 個模型回答打 1–9 分（7 = 最低可接受且免修改、8 = 一般工作者品質、9 = 優於一般）並自報任務所需時間。第一波資料：6,648 個任務、12,078 個 instance、60,845 筆評分；約 43% 原始資料因品質檢查被剔除重收。以 logistic 迴歸估「成功率 vs log10(人類時間)」的斜率，再加入發布日趨勢估進步速度。
- 會被引用的結果：
  - 斜率很平：分數 ≥7 時，任務時長變 10 倍，log-odds 只降 0.27（在 60% 基準約降 6.6 個百分點）；控制變數後 −0.17 到 −0.25（§2.1）。METR 資料的斜率為 −1.08（排除最短任務後 −0.99）（§3）。作者稱要讓兩者一致，需要中位 5.5 倍的時間量測誤差，認為不太可能。
  - 職業族群差異大：約一半族群斜率顯著為負（−0.14 到 −0.39），另一半與 0 無異；"the relationship between LLM performance and task duration is not portable across labor market domains."（§2.2、表 2）
  - 整體成功率：≥7 為 60%、≥8 為 49.7%、=9 為 27%。
  - 進步速度：2024-Q2 前沿模型在 1.5 小時任務達 60% 成功、2025-Q3 超過 70%；失敗率每 2.2–2.8 年減半；換算成「同成功率下可處理任務長度」的倍增時間為 2.7 個月（§2.3）。作者自己警告：曲線越平，同樣的小幅上升會換算成越短的倍增時間，"our preferred measure of the speed of AI progress is the change in success rates over time ... rather than the shift in task-duration at given success rates."
  - 2030 外推：多數任務在最低可接受品質達 88–97% 成功率，並稱這是「upper-bound」情境（§2.4、§3）。
  - 新世代模型是平行上移（斜率 −0.27 vs −0.28），大模型 vs 小模型則是「短任務優勢較大」的旋轉（−0.32 vs −0.23）（§2.2）。
- 作者自己列的限制：只涵蓋 LLM 可省 ≥10% 時間的文字型任務；情境必須自足、全部資訊在提示中，無法表示需要開檔、操作軟體或多輪人際互動的工作；700 字上限；評分者資格靠平台與驗證題把關；評的是最終產出而非過程；外推假設趨勢不變、logistic 形式在尾端成立，應視為上界。
- 與摘要說法不一致處：摘要只說「rising tides are the primary form of AI progress」，正文表 2 顯示約一半職業族群斜率與 0 無顯著差異、另一半顯著為負，「rising tide」是整體平均的描述，族群間差異在摘要中被淡化；其餘逐項對過，沒有。
- 反證或後續修正：Nguyen & Fithian（2c）引用本文作為「人類時間在經濟相關任務上預測力低」的證據；CAIS 2026-07 在 RLI 上得到同方向結論（成功率不隨人類時間下降）。
- 對系列的用途：直接回答「time horizon 換到真實勞動任務還成立嗎」——斜率比 METR 平 4 倍，且「倍增時間」這個指標在平坦曲線上會失真；也示範用大量在職工作者評分的另一種經濟價值量法。

---

## 補搜紀錄

查詢與結果（2026-11-23，Exa `web_search_exa`；Exa 全程可用，未需降級到 jina／WebFetch）：

1. 「METR Time Horizon 1.1 updated task suite time horizon methodology」→ 找到 TH1.1 公告（收為 2a）、METR 2026-03-20 建模假設筆記、METR time-horizons 頁（註明「This page is no longer actively updated」）。
2. 「METR November 2026 new time horizon report long tasks hundreds of hours」→ 找到 METR Q4 2026 update（收為 2b）；MIT Technology Review 2026-11-20 與多篇轉述（二手，不收）。
3. 「critique of METR time horizon metric extrapolation task representativeness 50% threshold flaws」→ 找到 Nguyen & Fithian（arXiv，收為 2c，選它因為是唯一有完整替代估計量與交叉驗證的一手學術批評）；METR「Clarifying limitations of time horizon」（METR 自己，只讀摘錄，列在來源 1 的後續修正）；Apart Research 黑客松專題、Montana Research Foundation 部落格、TuesdayBornWhale 部落格、LessWrong 文、Jacob Carlson 重分析 PDF（皆不收：非同儕審查或篇幅只到論點層級；Carlson 的 agnostic 重分析結論為「progress still looks very fast」，與本批結論方向一致，未精讀）。
4. 「GDPval 2026 update new version results OpenAI」與「openai.com Introducing GPT-5.5 GDPval」「GPT-6.2 Astra GDPval v2」→ 收 OpenAI 一手發表頁中的 GDPval 數字（3u）；Artificial Analysis GDPval-AA、Snorkel GDPval+ 訓練文、第三方排行榜（不收為主要來源：前者是模型互評 Elo、後者是用 GDPval 訓練的案例，可作為「benchmark 變訓練資料」的線索）。
5. 「Remote Labor Index leaderboard 2026 automation rate latest models」與「CAIS July 2026 RLI automated judge」→ 收 CAIS 2026-07 文與 Scale 排行榜（4u）；BenchLeader、i10x、Sulat 等轉述（不收，但其「分母 230 vs 240」疑問已用論文自身數字驗證並寫入 4 與 4u）。
6. 限定 2024 後、加 criticism／replication：Nguyen & Fithian 參考文獻帶出 Mertens et al.（2026）「人類時間對經濟任務預測力低」→ 讀正文後收為補 1（直接檢驗 time horizon 在勞動市場任務上的外部效度，且有 60,000+ 筆在職者評分）。未收：Kwa & Cheng「How Does Time Horizon Vary Across Domains?」（2025-07，METR 跨領域 9 個 benchmark；與本批已收的 METR 限制筆記重疊，名額留給外部研究）、Jonas Moss／Gregory Lewis／Witkin 的 LessWrong／部落格批評（非正式出版）。

結論是否被推翻：
- METR「約 7 個月倍增」在原任務集上仍被 METR 自己維持（TH1.1 拼接後 196 天），但 2023 後、2024 後與 2026 年 TH2 的倍增更短（131 天、89 天、3.6 個月）；同時外部研究（2c、補 1、4u）顯示這個量尺在 2–30 分鐘區段、非軟體領域與 RLI 上預測力弱或不成立。結論「被修正而非推翻」：趨勢本身沒被否定，但「倍增時間是跨領域通用的能力量尺」這個解讀被削弱。
- GDPval 的 47.6% 七個月內被推到 84.9%，OpenAI 已改用不公開的 v2；RLI 的 2.5% 一年內到 41.25%，但期間換了腳手架與預算。兩者的早期數字都不能代表 2026 年底的狀態。
