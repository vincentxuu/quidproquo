# O1 補缺口抽取紀錄（認識 benchmark 系列）

日期：2026-11-24。工具：curl 下載 arXiv PDF → `pdftotext`（含 `-layout`）、`pdftoppm` 轉圖後用 Read 看圖；Exa `web_search_exa`／`web_fetch_exa`；curl 抓 metr.org 原始 HTML 再用 Python 去標籤。jina 未使用（指示改用 Exa）。下載檔在 scratchpad `/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/261adb0a-4096-4f86-81fd-0ed73b43ab71/scratchpad/o1/`。

---

## 缺口 1：結局 ✅（數字全對，但 o4-mini 那格要注意「Low」以外還有「High」；另發現論文正文「11 of 12」與表格對不上）

### Holistic Agent Leaderboard（Kapoor et al., 2025）Table A19
- 網址：https://arxiv.org/pdf/2510.11977 （v1，2025-10-13，66 頁）
- 讀取狀態：✅（本缺口只需核表；表格用 `pdftotext -layout` 抽出，並把 PDF 第 58 頁轉 PNG 目視比對，兩者一致）
- 讀取紀錄：Table A19 在 PDF p.58（A10.8 SWE-bench Verified Mini）；另讀正文 §4 發現 7（scaffold 比較）、A10.9 TAU-bench Airline（Table A20）。全文其他部分本批未重讀。
- 類型：研究論文（附錄排行榜表）
- 研究設計：SWE-bench Verified Mini＝SWE-bench Verified 隨機 50 題；"We ran 27 evaluations using 14 different language models and 2 agent scaffolds (SWE-Agent and HAL Generalist Agent)."
- 會被引用的結果（逐格核對，Scaffold／Model／Accuracy／Cost）：
  - SWE-Agent｜o4-mini Low (April 2025)｜**54.0%**｜$259.20｜Pareto Yes（表內第一列）
  - HAL Generalist Agent｜o4-mini Low (April 2025)｜**6.0%**｜$87.03
  - SWE-Agent｜o3 Medium (April 2025)｜**46.0%**｜$483.43
  - HAL Generalist Agent｜o3 Medium (April 2025)｜**0.0%**｜$585.71（表內最後一列）
  - SWE-Agent｜GPT-5 Medium (August 2025)｜**46.0%**｜$162.93｜Pareto Yes
  - HAL Generalist Agent｜GPT-5 Medium (August 2025)｜**12.0%**｜$57.58
  - 補充同表：o4-mini High 是 SWE-Agent 50.0% vs Generalist 2.0%；唯一 Generalist 勝的是 DeepSeek R1（SWE-Agent 0.0% vs Generalist 6.0%）。
  - 正文 §4 發現 7 原句："A similar gap appears on SWE-bench Verified Mini (11 of 12). The generalist scaffolds also cost less in 20 of 24 model comparisons, but the accuracy penalty is substantial."
- 作者自己列的限制：A 節 "Limited benchmark coverage. We use SWE-Bench Verified Mini (50 tasks) rather than the full SWE-Bench Verified dataset (500 tasks)"。
- 與摘要說法不一致處：**有**。表內兩個 scaffold 都跑過的模型有 13 個（SWE-Agent 13 列全部有 Generalist 對應；Generalist 另多一個 Claude Opus 4 High），逐對比較是 SWE-Agent 勝 12、Generalist 勝 1（DeepSeek R1），不是正文的「11 of 12」。差異不影響方向，但引用時以表為準，或寫「13 組裡 12 組」。另：o3 Generalist 花了 $585.71 拿 0 分，論文未解釋（未查到是否為執行故障）。
- 反證或後續修正：
  - Poisson Labs 用 Hardy et al. 釋出的 HAL rollouts 重做配對檢定（https://poissonlabs.ai/research/can-leaderboards-tell-neighbors-apart/ ，2026-10-22）：50 題的 board 上「every gap under 12 points out of reach」；同一系統重跑有 14.5% 的題目結果翻轉。SWE-bench Verified Mini 上 hal_generalist vs sweagent 的 scaffold 交互作用被確認（1 of 1）。所以「54% vs 6%」這種 48 點差距遠超偵測下限，結論站得住；但 46% vs 46% 這類同分比較沒有意義。
  - 同一份 rollout 資料與 HAL 線上榜已有更新：Poisson 表中 SWE-Agent 第一名是 Claude Sonnet 4.5（68%），且 6 個系統的「HAL 線上分數」與分析用 run 的通過率不同。Table A19 是 2025-10 論文快照，引用要寫明出處是論文表、不是線上榜。
- 對系列的用途：支撐「同一模型換 scaffold，分數可差 40 多點；排行榜比的是系統不是模型」。

---

## 缺口 2：結局 ✅（全文讀完；維護者確認有一手出處）

### Silent Instrument Errors Reorder Agent Leaderboards（Liu, 2026）
- 網址：https://arxiv.org/pdf/2611.04399 （v1，2026-11-03，12 頁，單一作者 Yangze Liu，Shandong University）
- 讀取狀態：✅
- 讀取紀錄：`pdftotext` 全文約 42,751 字元，0–25,000、25,000–42,751 兩段讀完（含 Appendix A 與 Table 2）。另讀 HF 討論串全文（見下）。
- 類型：研究論文（只用公開產物重算，不跑 agent）
- 研究設計：解密 HAL 在 Hugging Face 公開的加密 trace（138 個 archive：TAU-bench Airline、ScienceAgentBench、CORE-Bench Hard，另加 SciCode、SWE-bench Verified Mini 做成本分析），用 HAL 釘住的 τ-bench commit 把紀錄裡的動作離線重放、user simulator 打樁；τ²-bench 部分裝四個版本交叉重評公開 trajectory。
- 會被引用的結果：
  - 約一半沒評分（§3.2）："Tool-Calling was graded in 98% of its episodes and the Generalist in 51%." 未評分的 episode 被記為 reward 0："the database is never compared and the episode is stored with reward zero."
  - 機制："TAU-bench computes the reward only when an episode formally ends, and the Generalist often closes its episodes in a way that does not trigger that ending"（Generalist 自己跑完迴圈、送一句結尾訊息就退出，模擬使用者通常不回 stop token；除非中途呼叫 transfer_to_human_agents 這個終止工具）。
  - 補評後差距消失（§3.2，範圍：九個兩種 scaffold 都跑過的模型、50 題中 41 題 gold 會查或改資料庫的題）："the Generalist's pooled accuracy on those 41 tasks rises from 0.30 to 0.43 … a published gap of 13 points in Tool-Calling's favour becomes a tie." 需改資料庫的題，Generalist 從 0.28 → 0.33，23 個未評分但通過的 episode 都在 agent 自己的 tool call 裡做了必要寫入："These are solved tasks recorded as failures."
  - 逐模型：Generalist 落後的模型數從 9 中 8 個變成 7 個，只有 gemini-2.0-flash 兩個 scaffold 的順序翻轉；27 個 run 之間 351 組兩兩順序有 48 組翻轉。作者明說每格只有約 41–82 筆，"the claim we rest on them is the direction of the shift."
  - 另外三個 instrument error：成本欄重複計算（"Exactly 2× in 70 of 134 runs"；133 個有 usage 的 run 平均高估 36.5%；例：Tool-Calling＋Claude Opus 4.1 High 列 $149.98，root-span 成本 $74.99）；trajectory 混入 grader 重放的 gold 動作（2,334 筆 airline 紀錄中 68%；58 筆 agent 一個 tool call 都沒做卻顯示完整 gold 序列）；τ²-bench 重評不穩（banking 1.0.1 公告過的重評仍翻轉 17 個提交中 136 組裡的 4 組，gemini-3-flash 從第 9 變並列第 5；airline 1.0.0 改了 50 題中 14 題的評分標準未警示，800 次模擬翻轉 77 次；telecom solo-mode 判斷錯誤讓 4 個檔案分數掉 59–82 點且不報錯）。
  - 維護者確認（§3.5）："On 7 October a HAL maintainer replied that the team had reproduced all three on its own archive and added disclosures to the leaderboard, which are dated 5 October." archive 本身未改。
- 一手出處（已直接讀）：Hugging Face 討論串 https://huggingface.co/datasets/agent-evals/hal_traces/discussions/9 。2026-10-07 帳號 kanghengliu（標示 "hal org"）回覆原文："Thanks — we've reproduced all three on our own archives and can confirm them." 並列出三項前台揭露：成本欄註記重複計算且「not uniform across rows」；TAU-bench Airline 的 Generalist 列標為 "a lower bound on that scaffold's accuracy and not directly comparable to the task-specific scaffolds, since episodes that never terminate are recorded as 0"；trace 下載說明要求剝除 gold 動作。
- 作者自己列的限制（§8）："Our evidence comes from two leaderboards … the expectation that similar errors are common elsewhere rests on the mechanisms in Section 4 rather than on a survey. The HAL re-grades use the τ-bench commit HAL's setup pins with the user simulator stubbed, so they evaluate the database and output criteria only." 另 §3.2：兩個 scaffold 的步數預算、政策放置方式不同，"the corrected comparison is between scaffolds as built, now graded alike."
- 與摘要說法不一致處：**有一處要注意版本**。作者 9 月在 HF 首發的數字（Generalist 評分率 39.3%、補評後 0.468）已於 2026-11-01 在同一討論串自行更正為 51.2%、0.426（原因：把 gold 只認在紀錄尾端，漏掉 73 筆 gold 夾在中間的紀錄），並更正「逐模型重排」說法不成立。論文用的是更正後數字（51%、0.30→0.43、13 點→tie；HF 更正版寫 12.7 點→0.1 點）。**引用一律用論文版本，不要用 9 月首發數字**（網路上二手報導可能還是舊數字）。摘要的「about half」「closes the pooled gap」與正文一致。
- 反證或後續修正：未找到反駁。二手轉述 https://andreasrau.tech/writing/agentic-coding-paper-2026-11-04 內容與論文一致。注意 HAL 論文 Table A20 只列 Generalist 一種 scaffold（14 個 eval），Tool-Calling 與 Few-Shot 的 run 只在 archive 與線上榜；Few-Shot 被 HAL 以測試集外洩撤下。
- 對系列的用途：支撐「評分程式本身是量測的一部分、會靜默出錯；13 點的 scaffold 差距其實是『評分有沒有跑』的差距」。

---

## 缺口 3：結局 ✅（正文全讀；附錄的文字段落全讀，部分大表只讀了與 SWE-mini／τ-bench 相關列）

### Agent Evaluation Reliability: More Tasks Won't (Always) Fix An Agent Leaderboard（Hardy, Azam, Reuel, Kochenderfer, Koyejo, 2026）
- 網址：https://arxiv.org/pdf/2610.00651 （v1，2026-09-30，50 頁，Stanford／UIUC，"Under review as a conference paper"）；程式與資料 https://github.com/hardy-education/scaffold_eval
- 讀取狀態：✅
- 讀取紀錄：`pdftotext` 全文約 185,509 字元。正文（第 1–1,300 行，約 45,000 字元）逐段讀完；附錄（第 1,508 行起）先濾掉圖表碎行（<45 字元）後讀完約 89,000 字元的文字段落；Table 16、17 另用 `-layout` 版完整讀出。未逐格讀的是 Table 8、10–14、20–21 的數字格（只讀其說明文字）。
- 類型：研究論文
- 研究設計：用概化理論（G-theory）做貝氏變異數分解（Bernoulli–logit 混合模型），資料是 HAL 九個 benchmark 共 29,923 個 rollout（54 模型、13 scaffold、1,117 題），加 Harbor Index 佐證；比較「排模型」與「排模型＋scaffold 系統」兩種量測對象的信度，並做 D-study 推估加題、加 scaffold、加 benchmark 的效果。
- 會被引用的結果：
  - 對象決定信度（摘要、§5.1）："Fixed model–scaffold systems are ranked reliably (Eρ2 = 0.935–0.994), while underlying-model reliability is substantially lower (0.148–0.841)."
  - 換 scaffold 會改結論（§5.2）：inter-scaffold reliability 從 Online-Mind2Web 0.151 [0.004, 0.577] 到 CORE-Bench Hard 0.852 [0.631, 0.947]。"At the low end, changing only the scaffold can substantially change which models appear to perform best on a benchmark, even when the models and tasks remain fixed."
  - 加題有上限（摘要、§5.3）："Even infinitely many similarly constructed tasks improve model-ranking reliability of the dataset by at most 0.097 when uncertainty is dominated by limited scaffold coverage." Online-Mind2Web 只從 0.148 升到 0.153。Table 16：SWE-mini 0.543→上限 0.552；τ-Airline 0.572→0.669（0.097 即出自這格）。
  - 合併 benchmark（§5.4）：同樣題數預算下 0.44 → 0.75；全 HAL battery 成本 >$47,000，平衡配置約 $19,000 達到相近信度；目標 SNR 2.5（Eρ2≈0.71）約每個 benchmark 14 題、$8,144，"an estimated (83%) reduction"。
  - 外部效度（Table 3）：潛在模型效果 θ̂ 與四個外部 benchmark 的平均 Kendall τ 0.789，原始平均分 0.463。
  - 附錄 G.5："Reliable rankings do not imply reliable scores"；"For the HAL dataset, there is simply not enough signal relative to noise in the benchmarks for any reliable absolute scoring."
  - 附錄變異分解（leave-one-LLM-out）：題目難度約 32.8%、benchmark 25.8%、殘差 23.7%，模型本身只有約 3.3%。
- 作者自己列的限制：信度不等於效度（"a benchmark can be reliable but invalid"）；結果限於這批模型與 scaffold，"Scaffolds are selected artifacts, often co-developed with the benchmarks they evaluate"，每個 benchmark 只有 2–3 個 scaffold；pooling 依賴 HAL-Generalist 當跨 benchmark 錨點；信度在 logit 潛在尺度，與排行榜百分比不一一對應；移除 CORE-Bench Hard（尤其 CORE Agent）時 SNR 掉到偵測帶以下；設計無法支持「換 scaffold」的因果主張。
- 與摘要說法不一致處：摘要寫「0.935–0.994」，§1 條列寫 "[0.94,0.99]"（四捨五入，無實質差）；摘要「at most 0.097」，§1、§5.3 寫「approximately 0.10」。逐項對過，其餘一致。
- 反證或後續修正：
  - **資料層的問題**：本文 τ-bench Airline 用了 3 個 scaffold（Table 7：hal_generalist、taubench_tool_calling、taubench_fewshot），其中 Few-Shot 已被 HAL 以測試集外洩撤下，Generalist 依 Liu（2611.04399，晚一個月）約一半 episode 沒評分、被記 0。本文對 τ-bench 的 scaffold 效果（inter-scaffold 0.545、上限 0.669）建立在這兩個有問題的 scaffold 上，作者未討論（發表時 Liu 的揭露尚未公開；HF 討論串開於 9-03、維護者 10-07 才確認）。引用本文 τ-bench 數字時應附這個但書。
  - Poisson Labs 用本文釋出資料做預註冊的配對重分析（見缺口 1）：重現本文所有 HAL 計數，"nothing here disputes their numbers"；但補充「整體排序可靠」不等於「相鄰名次分得開」：278 組相鄰對只有 3 組（全在 USACO）在配對檢定下有差。
- 對系列的用途：支撐「排行榜可靠地排『系統』，卻不一定可靠地排『模型』；題數不是萬靈丹」。

---

## 缺口 4：結局 ✅（正文全讀；附錄文字段落全讀）

### Balance of Benchmarks: Evidence Retention and Multiplicity-Aware Model Comparison（Hong-Yun Lin、Jhen-Ke Lin, 2026）
- 網址：https://arxiv.org/pdf/2608.30044 （讀的是 **v4，2026-11-19**，40 頁；作者單位 NTU、NYCU）
- 讀取狀態：✅
- 讀取紀錄：`pdftotext` 全文約 143,152 字元；濾掉碎行後正文＋參考文獻約 42,000 字元讀完；附錄 A–I 文字段落約 60,000 字元讀完（含 A.2 重複分解、C.2 re-listing、E.2 reporting overlap、E.4 RULER、I.5–I.9）。
- 類型：研究論文
- 研究設計：WildScores＝5,371 個廠商自報分數（148 個 benchmark × 354 個模型設定、316 個 release group，覆蓋率 10.3%）；每個 benchmark 擬合一條反應曲線放到共同能力尺度，再用 benchmark 描述的嵌入向量（Qwen3-Embedding-8B）做「反密度加權」：描述相近的 benchmark 擠在一起時各自分到較少權重。對照組是等權重。用整個 benchmark 家族留出做預測，並用「把同一 benchmark 再列 N 次」的人為介入測排名位移。另用 Artificial Analysis（14 個 benchmark）與 BIG-bench 驗證。
- 會被引用的結果（「清單密度＝隱性權重」的實證）：
  - 機制（摘要）："With equal weighting, repeated or closely related benchmarks gain influence as their number grows."（§1："Listing a benchmark twice gives one set of measurements extra weight under equal weighting."）
  - 重複列表的排名位移（§4.2、Table 4/13）：對 8 個 benchmark 各加 4 份完全相同的副本，平均絕對排名位移：等權標準化平均 5.907、等權等化 1.948、密度加權 0.626（"a 67.9% reduction"）；改寫描述的副本 0.955。最壞情況單一模型位移 44 名（完全副本）、55 名（改寫）。AA 參考集上（附錄 H）4 份副本的最大排名位移：等權 98.9 名，密度加權 15.8–24.1 名。
  - 自然發生的密集（附錄 E.4）：RULER 六個 context 長度在等權下合計權重 6，密度加權下 2.581。
  - 第三方重測（附錄 I.9）：AA 自己重測 13 個 benchmark，加入後這 13 個的權重占比在等權下從 33.8% 升到 44.1%，模型密度加權下 33.7%→35.9%。
  - 共享題目（附錄 I.9）：OpenVLM 榜平均 8 個 benchmark，其中 MMStar 有 345/1,500 題取自 MathVista，同一題在合成分數裡算兩次。
  - 反轉（§4.2）：只有 25% 模型回報副本時，密度加權反而比等權差（0.761 vs 0.684，24 個情境中 11 個較差）；改成「依每個模型實際回報的 benchmark 計算密度」後 88 個情境全部優於等權（25% 時 0.151 vs 0.684）。
  - 預測力：擴大證據池（從 10 個策展 benchmark 到全部）讓留出預測 Spearman 提升約 +0.035（strict panel 95% CI [0.0183, 0.0520]），但密度加權相對等權的預測增益區間都跨 0。
- 作者自己列的限制（§5）：協議可比性限制結論（metadata 篩選後保留增益 +0.0241，Holm p = 0.6093 不顯著）；回報機制未識別（"The actual WildScores reporting process remains unidentified"）；fixed-population 設計是看過早期結果後才定的；描述相似度與分數殘差相關性區間跨 0（0.0136 [-0.0275, +0.0610]），"functional redundancy among heavily downweighted benchmarks unverified"；reporting-aware 形式是 discussion period 才加入。
- 與摘要說法不一致處：逐項對過，沒有。注意：摘要的 0.63 vs 1.95 即正文 0.626 vs 1.948（四捨五入）。
- 反證或後續修正：本文 v4 本身就是多輪修正（v4 加入 reporting-aware density 以處理 v 早期的反轉）。引用時寫明版本 v4。未找到外部反駁。
- 對系列的用途：支撐「綜合分數裡，相近 benchmark 列得越多、該能力的隱性權重越大；把同一份測量多列四次就能讓等權排名平均移動約 2 名、最多 44 名」。

---

## 缺口 5：結局 ✅（105 天的出處與計算區間已找到）

### METR Q4 2026 capability update（2026-11-20）＋ Frontier Risk Report（2026-05-19）＋ TH1.1 公告（2026-01-29）
- 網址：
  - https://metr.org/blog/2026-11-20-q4-2026-capability-update/
  - https://metr.org/blog/2026-05-19-frontier-risk-report/
  - https://metr.org/blog/2026-01-29-time-horizon-1-1/
  - https://metr.org/time-horizons/
- 讀取狀態：✅（Q4 update 用 Exa 取得正文段落＋ curl 原始 HTML 找到腳註 50；Frontier Risk Report 用 curl 抓 HTML 全文搜尋「105」「doubling」；TH1.1 公告由 Exa 取得含附錄表的正文）
- 類型：官方部落格／報告
- 會被引用的結果：
  - Q4 update §3.C.1："time horizons are doubling roughly every 3.61 months (95% CI 2.08-4.94), or 110 days … This is similar to the previous TH1.1 doubling trend of 105 days." **腳註 50 只放一個連結**，指向 Frontier Risk Report 的 `#coding-agents-did-real-projects-that-would-take-humans-hours-or-days` 段。
  - **105 天的計算區間**（Frontier Risk Report，Time horizon frontier lead estimation methodology）："draw a line of best fit for models released after January 1st, 2024 (chosen as a "break-point" between an older, slower trend and the current trend, in agreement with recent results from Epoch AI). This fit has a doubling time of 105 days, and an R2 of 0.98." 同報告用它算內部模型領先公開趨勢 "a lead estimate of 66 days"（log2(平均 TH 比 1.55) × 105 天）。
  - 同一份報告另一處（SHUSHCAST 段）用了另一個數字："The trend line is based on frontier models since gpt-4-0314 and has a doubling time of 126 days (about four months)."（eval-analysis-public 計算）
  - TH1.1 公告附錄表：P50 doubling time ≥2023 為 130.8 天 [107, 161]，≥2024 為 88.6 天（TH1.0 分別 165.3、108.9）。
  - 時間軸：metr.org/time-horizons 更新紀錄 "March 3rd, 2026: Corrected a regularization mistake that affected our measurements."；之後又加入 GPT-5.3-Codex、Opus 4.6（2-20）、GPT-5.4（4-10）、Gemini 3.1 Pro（4-15）等模型。
- 為什麼對不上：105 天與 88.6 天都是「2024 年以後發布的前沿公開模型」區間，差別在**資料版本與模型集合**：88.6 天是 2026-01-29 公告時的 14 個 TH1.1 模型；105 天是 2026-05 報告時的擬合，已套用 3 月 3 日的 regularization 修正、並納入 1 月後新增的模型。METR 沒有在 Q4 update 裡說明這個區間，「the previous TH1.1 doubling trend of 105 days」容易被讀成 TH1.1 公告的數字。
- 作者自己列的限制：Q4 update 說 TH1.1 已飽和（"models had saturated the TH1.1 suite"），time-horizons 頁註明 "Measurements above 16 hrs are unreliable with our current task suite."
- 與摘要說法不一致處：Q4 update 稱「previous TH1.1 trend of 105 days」，但 TH1.1 公告裡沒有 105；三個數字（130.8／88.6／105）加上同報告的 126 天，是不同起點、不同資料快照的擬合。
- 反證或後續修正：第三方 rsi.watch 的說法「METR's latest figure is a 105-day doubling time … Not in METR's Time Horizon 1.1 post; we found the figure only in secondary coverage」**不正確**，一手出處就在 Frontier Risk Report。SingularityPlus（2026-11-13 更正）稱 METR 目前結果檔給出 ≥2023 為 128.7 天、全時段 187.8 天、沒有 ≥2024 的數字（二手，未直接讀結果檔）。
- 對系列的用途：「倍增時間」要附起點與資料快照；同一機構一年內的公開數字有 196.5、130.8、126、105、88.6、110 天，差別來自擬合區間與修正，不是能力變化。
- 不需要 ✉️：區間已找到。若要更精確（105 天用了哪些模型、是否含 Mythos Preview），可問 METR：「Frontier Risk Report 的 105 天擬合用了哪些模型、截至哪天的資料、是否已含 3 月 3 日修正」。

---

## 缺口 6：結局 ✅（**原說法錯誤**：27.15% 不是主估計）

### ConStat: Performance-Based Contamination Detection in Large Language Models（Dekoninck, Müller, Vechev, 2024）
- 網址：https://arxiv.org/pdf/2405.16281 （v1，2024-05-25，38 頁，ETH Zürich；NeurIPS 2024）
- 讀取狀態：✅（正文全讀；附錄 A.1、Table 4、完整結果表 InternLM-2 段讀過）
- 讀取紀錄：`pdftotext` 全文約 105,114 字元；正文（至 References）濾碎行後 34,701 字元讀完；附錄 A.1–A.2 與 Table 4、完整結果表 InternLM-2 段用 `-layout` 讀。附錄 B–E 的模擬與設定細節未逐段讀。
- 類型：研究論文
- 研究設計：把污染定義成「相對參考模型，在原 benchmark 的表現顯著高於在相似參考 benchmark 的表現」。三種參考：改寫（syntax-specific，最嚴重）、同分布合成新題（sample-specific）、同任務的另一個 benchmark（benchmark-specific，作者稱最不嚴重）。20 個參考模型擬合難度校正函數，bootstrap 求效果 δ̂ 與 95% 下界 δ̂0.95、p 值。GSM8k 的 benchmark-specific 參考是 **MathQA**（選擇題）。
- 會被引用的結果：
  - Table 4（p < 1% 的全部結果）與完整結果表：`InternLM-2-Math-7b｜GSM8k｜Type B｜Perf. 72.93｜p < 10^-2 %｜δ̂ = 39.40｜δ̂0.95 = 27.15`。
  - **欄位定義**（Table 2 說明）："the estimated effect δ̂, the 95% lower bound of the effect δ̂0.95"。所以 **39.40% 是點估計，27.15% 是 95% 信賴下界**。附錄 A.1 正文寫的「40%」就是 39.40 的四捨五入："INTERNLM-2-7b and INTERNLM-2-MATH-7b show significant benchmark-specific contamination on GSM8k with p < 0.5% and estimated effects of 20% and 40% respectively."
  - 同一模型在 GSM8k 的另兩種檢定都不顯著：sample-specific p = 64.34%、δ̂ = −0.89；syntax-specific p = 71.92%、δ̂ = −1.16。
  - 作者對這類結果的解讀（附錄 A.1）："The size of this effect is likely due to the same reasons as the measured contamination in the PHI models, where the models are too small to solve mathematical questions in one go and have been trained/finetuned to perform chain-of-thought mathematics."（§4.3 對 Phi 的說明：GSM8k 是自由作答可推理、MathQA 是選擇題須立即作答）。正文 §2："benchmark-specific contamination is by far the least severe type of contamination … requires a more nuanced interpretation."
- 作者自己列的限制：參考模型本身可能被污染，只能量相對效果；合成題由 GPT-4-Turbo 產生，可能有分布偏差；每個 benchmark 只取 2,000 題。
- 與摘要說法不一致處：論文本身逐項對過，沒有。**不一致在轉述端**：GEM 2026 綜述（Nourbakhsh et al., https://aclanthology.org/2026.gem-main.50.pdf ）多處寫「the primary reported estimate is 27.15%, with a 40% sensitivity estimate under alternate reporting settings」，附錄還寫成「over-performance on GSM8K relative to a semantically equivalent reference」。三處都錯：(1) 27.15 是下界不是主估計；(2) 40 是點估計不是敏感度分析；(3) 參考是不同 benchmark（MathQA），對「語意等價改寫」的檢定（syntax-specific）不顯著。brief 裡「27.15% 主估計、40% 敏感度估計」的說法源頭就是這篇綜述。
- 反證或後續修正：未找到勘誤。
- 對系列的用途：只能寫成「ConStat 估計 InternLM-2-Math-7B 在 GSM8K 比換成 MathQA 時預期的高約 39 個百分點（95% 下界 27），但作者認為主因可能是作答格式（自由作答可推理 vs 選擇題），不是背題；改寫題與新題的檢定都沒有偵測到污染」。不能寫成「背了 27% 的題」。

---

## 缺口 7：結局 ✅（出處是 MMLU-Redux 6.49%；GEM 綜述把定義縮窄了）

### Are We Done with MMLU?（Gema et al., NAACL 2025；MMLU-Redux）＋ GEM 2026 綜述的引用
- 網址：https://aclanthology.org/2025.naacl-long.262.pdf （arXiv 2406.04127）；引用端 https://aclanthology.org/2026.gem-main.50.pdf
- 讀取狀態：MMLU-Redux 讀了摘要、§1、§2（錯誤分類協定）、§3.1、結論、限制（✅ 就本缺口所需段落；§4 自動修正實驗未讀）。GEM 綜述只讀了引用 Gema 與 ConStat 的段落（第 60–75、240–420、830–880、1075–1160 行），不是全文。
- 類型：研究論文／綜述
- 會被引用的結果：
  - 數字出處（§3.1）："Using stratified sampling, we estimate that 6.49% of the questions in the complete MMLU dataset contain errors." 抽樣：57 科各隨機 100 題共 5,700 題，14 位人工標註。
  - 「錯誤」的定義包含兩大類（§2.1）：Type 1 題目問題（1a 題意不清、1b 選項不清）與 Type 2 答案問題（2a 無正確選項、2b 多個正確選項、2c 標準答案錯）。**6.49% 是所有錯誤類型合計，不只是「標準答案錯」**。
  - 同節另一個數字："we find that more than 9% of the examples are incorrect"——這是 5,700 題子集的未加權比例；6.49% 是依各科題數分層加權到完整 MMLU 的估計。Virology 子集 57% 有錯（其中 30% 標準答案錯、15% 題意不清）。
  - GEM 綜述原句："a 2024 manual audit found 6.5% of questions contain ground-truth errors (Gema et al., 2025)"。
- 作者自己列的限制：只標了 5,700 題，其餘 8,342 題未標；標註協定可能受標註者個人偏見影響。
- 與摘要說法不一致處：Gema 論文自身一致。**轉述端有兩處偏差**：(1) GEM 綜述寫「ground-truth errors」，但 6.49% 包含題意與選項不清等非答案錯誤；(2) 寫「2024 manual audit」，引用的卻是 2025 NAACL 版（arXiv 初版 2024-06，年份差異無害）。
- 反證或後續修正：EMNLP 2026 一篇（https://aclanthology.org/2026.emnlp-main.768.pdf ）轉述為「estimated that 6.49% of the entire dataset could contain errors」，與原文一致。未找到推翻 6.49% 的研究。
- 對系列的用途：寫「MMLU-Redux 抽查估計約 6.5% 的 MMLU 題目有問題（含題意不清、選項錯、答案錯）」，不要寫「6.5% 的答案是錯的」。

---

## 補搜紀錄

| 查詢（Exa web_search_exa） | 找到 | 收／不收 |
|---|---|---|
| METR Q4 2026 capability update time horizon doubling TH1.1 | Q4 update 原文、Bluesky、多篇二手報導 | 收原文；二手只用來確認 105／110 天被廣泛轉述 |
| METR Time Horizon 1.1 announcement doubling time 130.8 days 88.6 days | TH1.1 公告、metr.org/time-horizons、SingularityPlus、rsi.watch | 收 TH1.1 公告與 time-horizons 頁（一手）；SingularityPlus 只當 3/3 修正的線索並回 METR 頁確認；rsi.watch 的「105 天無一手出處」已被反證 |
| GEM 2026 survey … MMLU 6.5% of questions contain errors | GEM 綜述（Nourbakhsh et al.）、MMLU-Redux、EMNLP 2026、LREC 2026 | 收 GEM 綜述（引用端）與 MMLU-Redux（原始）；另兩篇只當轉述對照 |
| critique or replication of HAL … 2026（加 criticism／replication 反證輪） | Poisson Labs 配對重分析、Andreas Rau 的 Liu 摘要、ashvin 部落格 | **收 Poisson Labs（補精讀 1 篇）**：預註冊、用 Hardy 釋出資料、重現其數字，並提供 50 題 board 的偵測下限（約 12 點）與重跑翻轉率 14.5%；Rau 只是 Liu 的轉述不收；ashvin 未讀，與本批缺口無關 |
| 一手確認：HF 討論串 agent-evals/hal_traces #9（web_fetch_exa） | HAL 維護者 10-07 確認全文、作者 11-01 自行更正 | 收（缺口 2 的確認出處） |

### 補精讀：Can agent leaderboards tell neighbors apart? A paired reanalysis of the HAL rollouts（Kolasinski／Poisson Labs, 2026）
- 網址：https://poissonlabs.ai/research/can-leaderboards-tell-neighbors-apart/ （2026-10-22）
- 讀取狀態：✅（Exa web_fetch 全文，約 17,000 字元，一次讀完）
- 類型：部落格／研究筆記（預註冊、程式公開；非同儕審查）
- 研究設計：用 Hardy et al. 釋出的 scaffold_eval（commit e7ec464，29,923 rollouts、287 個系統），對每個 benchmark 的相鄰名次做精確雙尾 McNemar 檢定＋BH 校正；估算偵測下限；用 HAL 18 組重跑估翻轉率；檢查同模型換 scaffold 的逐題翻動。
- 會被引用的結果："Across the nine HAL benchmarks 3 of 278 pairs separate, all on USACO (0 of 265 on the other eight)"；"On a 50-task benchmark that puts every gap under 12 points out of reach"；"14.5% of task outcomes flipped between runs (95% interval 12.7% to 16.5%)"；τ-bench Airline 上 "24 of 42 agents could be ranked first"；SWE-bench Verified Mini 上三個 sweagent 系統可宣稱第一。
- 作者自己列的限制：重跑基準只來自 16 個系統；每次比較是單次 rollout，混合了「抽到哪些題」與「這次怎麼跑」；名次區間是探索性分析，不是名次的信賴區間。
- 與摘要說法不一致處：逐項對過，沒有。
- 反證或後續修正：沒有找到。注意它沿用的資料含 τ-bench 的 Generalist 未評分問題（Liu 2611.04399），文中沒有處理。
- 對系列的用途：支撐「50 題的榜上，差 12 分以內的相鄰名次在統計上分不開；名次應讀成區間」。
