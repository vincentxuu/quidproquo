# 抽取紀錄：DORA, Accelerate State of DevOps Report 2023（重點：Chapter 4 Documentation is foundational）

read_status=full（95 頁全文依序讀完，v. 2023-12 版）

角色：任務 6 的「2023–2026 企業內部文件品質的可信產業調查」。同時含反證式發現（文件品質對 software delivery performance 無效果；對 underrepresented 群體 burnout 反而上升）。

## 書目

- 發布者：DORA（Google Cloud 主持的研究計畫），Accelerate State of DevOps Report 2023，v. 2023-12；授權 CC BY-NC-SA 4.0（"by Google LLC"）
- 作者群（p.59–61）：Derek DeBellis（lead investigator）、Amanda Lewis、Daniella Villalba、Dave Farley、Eric Maxwell、James Brookbank、Jeffrey Winer、Kevin Storer、Kim Castillo、Michelle Irvine（技術文件研究負責人）、Nathen Harvey、Steve McGhee
- 實際讀的檔案：https://dora.dev/research/2023/dora-report/2023-dora-accelerate-state-of-devops-report.pdf（95 頁）
- 全文文字檔：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/dora2023.txt
- 利益關係：Google Cloud 主持且有贊助商（封面 "Premiere Sponsors / Gold Sponsors"）；報告的雲端章節對 Google 產品有直接商業關聯。文件章節與產品關聯較弱，但不能視為完全中立。

## 設計、樣本、量了什麼

- 橫斷面網路問卷，"nearly 3,000 working professionals"（p.72）。招募分 organic（部落格、email、社群、滾雪球）與 panel（補 underrepresented 與特定產業）（Methodology Step 5，p.68）。organic 回覆比 2022 多 3.6 倍。
- 樣本特徵（p.73–80）：男 81%、女 12%；underrepresented 15%；工作年資中位約 15 年（25% >22 年）；在現團隊 50% <3 年；角色開發／工程 30.5%、DevOps/SRE 18.1%、經理 16.4%；產業科技 36.6%、金融 13.7%；10,000 人以上組織 21.4%；美國 28%、英國 11%、印度 8%。全職員工 88%。
- 文件品質的測量（Ch.4 Introduction，p.27）："To measure documentation quality, we measured the degree to which documentation is reliable, findable, updated, and relevant. We then calculate one score for the entire documentation experience. We're not evaluating documentation page-by-page, but as a whole." 定義（p.8）："The quality of written content that people in the organization create and use in their daily work." 分數 0–10：Mean 5.8、IQR 3.8–7.9、Median 6.25。
- 分析：CFA（lavaan）驗證構念；貝氏 SEM／迴歸（blavaan、rstanarm）；以 DAG（Dagitty）選共變數；LOOCV／WAIC 比模型；「Nx」倍數＝在 ±1 SD 下的預測值比（Appendix p.94）。
- 題目原文另見 dora.dev（p.6 註 1，未讀）。

## 可引用結果（Chapter 4，p.27–30；Ch.8 p.52–56）

1. 範圍：內部文件
   - 原文："This year we look deeper at internal documentation—the written knowledge that people in the organization use day-to-day."

2. 放大技術能力對組織績效的效果（p.28 表）
   - Continuous integration 2.4x、Continuous delivery 2.7x、Trunk-based development 12.8x、Loosely coupled architecture 1.2x、Reliability practices 1.4x、AI contribution 1.5x。
   - 計算：「高文件品質下該技術能力的影響」÷「低文件品質下的影響」。
   - 原文："As we found in 2021 and 2022, documentation quality continues to drive the successful implementation of every single technical capability we study."

3. 對結果的效果（p.28）
   - Team performance、Organizational performance、Operational performance：Substantial increase。
   - Software delivery performance：No effect。原文："We continue to be surprised to find no effect of quality documentation on software delivery performance. This is the second year we see this behavior."
   - Well-being：Burnout substantial decrease、Job satisfaction substantial increase、Productivity substantial increase；"some of this impact is because quality documentation increases knowledge sharing."

4. 為什麼有用（p.29）
   - 原文："Creating high-quality documentation requires teams to decide on processes in the first place. Documentation can force teams across an organization to explicitly discuss and get aligned on what to do and how to do it."
   - 原文："Quality documentation also acts as a repository for team knowledge, even as people come and go."

5. 反向發現：對 underrepresented 者，文件品質越高 burnout 越高（p.29–30）——跟「誰來寫」直接相關
   - 原文："For this group, documentation quality is tied to an increase in burnout."；性別本身沒有這個效果。
   - 作者的推測（不是結論）："It takes work to create and maintain high-quality documentation. ... It's also work that might not be consistently recognized for the importance and impact that it has. Are people who identify as underrepresented doing a disproportionate amount of this work, and if so, does this work help explain the effect on burnout?"；"More research is needed."
   - Ch.8（p.52）：underrepresented 者 "24% more repetitive work (toil)"；女性或自述性別者 "40% more repetitive work"；並做更多 unplanned、不被看見的工作。作者引 Babcock et al. 的 non-promotable tasks 概念。

6. 分配文件工作的正式流程提高文件品質（p.30）
   - 原文："This year, we also found that work distribution, including formal processes to distribute documentation work, significantly increase the quality of documentation."
   - Work distribution 的定義（p.9）："Formal processes to help employees distribute tasks equitably within a team."；Mean 5.8。
   - 但 Ch.8（p.53）：work distribution 降低了男女的 burnout 差距，"had no impact on the level of burnout experienced by respondents who identify as underrepresented."

7. 新人（Ch.8 p.55–56）
   - 新人（在團隊 <1 年）生產力低 8%。
   - 原文："new hires on teams with well-written documentation (1 standard deviation above average) are 130% as productive as new hires on teams with poorly written documentation (1 standard deviation below average)."
   - 但："these practices do help new hires, but these practices do not help new hires more or less than everyone else."

8. Knowledge sharing（Ch.7 p.47–48）：與 software delivery／operational performance 正相關，對 organizational performance 是 "Minor decrease"；定義 "Team members answer questions once, and make the information available to others. People don't have to wait for answers."（定義註腳引 Stack Overflow 2022 survey）

## 作者／發布者寫的限制

- 非實驗資料（Ch.8 p.56）："our data is not experimental, and although we try to control for factors that could bias our results ... it is difficult to draw sharp conclusions"
- 混淆無法窮盡（Methodology p.66）："It's impossible to capture all the elements that bias researchers' estimates"
- 情境化（Exec summary p.5）："The most important comparisons are from looking at the same application over time, not by looking at other applications, organizations, or industries."
- 機制未明：underrepresented 的 burnout 結果只有假說，"More research is needed."
- organic 招募含滾雪球（非機率樣本）；作者以 Stack Overflow 2022 為參照檢查偏誤，自承樣本歐洲人比例較低、年資偏高。

## 與摘要或常見轉述不一致處

- 「高品質文件讓團隊績效提高 25%」：這個數字出自 Google Cloud 部落格發布文（2023-10-05，Exa 搜尋摘錄），**報告本文 Chapter 4 與 Executive summary 都沒有 25% 這個數字**，只寫 "Substantial increase"。引用報告時不要用 25%，或註明出處是部落格。
- 「12.8 倍」常被轉述成「文件好的團隊績效高 12.8 倍」：實際是「trunk-based development 對組織績效的效果」在高 vs 低文件品質下的比值。trunk-based development 本身對組織績效只是 "Minor increase"（p.21），小效果的比值可以很大。這是效果的放大倍數，不是績效倍數。
- 「文件品質對交付速度有幫助」：報告明說對 software delivery performance 無效果，連續兩年。
- 「好文件對大家都好」：對 underrepresented 者 burnout 反而上升。
- 文件品質是受訪者對「整體文件體驗」的單一自評分數（reliable／findable／updated／relevant），不是對實際文件的稽核；績效也是自評。所有結果都是同一份問卷內的自評變數關係。
- 報告內部數字不一致：Executive summary（p.4）寫 "Underrepresented respondents do 29% more repetitive work"，Ch.8（p.52）寫 "24% more repetitive work (toil)"；24% 在 Exec summary 是 burnout 的差距。引用時以 Ch.8 為準並註明。
- 「新人生產力 130%」是 ±1 SD 文件品質下的預測值比，且作者說文件對新人的幫助並不大於對其他人。

## 讀取紀錄

- 全文檔：fulltext/dora2023.txt，4,716 行，280,854 bytes；PDF 95 頁。
- 依序讀過：1–800（封面、目錄、Executive summary、Concepts and measures、Ch.1 How do you compare?）→ 800–1600（Ch.2、Ch.3、Ch.4 Documentation 全章、Ch.5 開頭）→ 1600–2500（Ch.5、Ch.6、Ch.7 前半）→ 2500–3600（Ch.7 後半、Ch.8、Afterword、Acknowledgments、Authors、Methodology、Demographics 前半）→ 3600–4716（Demographics 後半、Firmographics、The models、Further reading、Appendix）。涵蓋全文。圖表（例如 burnout 模擬線、AI 任務重要性圖）只有軸標籤，數值讀不出。
- 管道：Exa search 找到 dora.dev PDF → `curl -L -A "Mozilla/5.0"` → 200 PDF → `pdftotext -layout`（成功）。未讀：DORA 2021 報告 p.22（作者指向的「驅動文件品質的實務」）、dora.dev 上的問卷題目原文。
