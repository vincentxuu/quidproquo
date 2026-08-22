# AI 學位與課程全球地圖 — 研究筆記

> 交接文件：本 session 的查證結果，供下一個 agent 接手寫文章用。
> 撰寫日期：2026-08-21
> 最近補查：2026-08-21（HKUST / TUM / 東京大學 / Edinburgh / 清華 / Tübingen）
> 查證工具：tavily_search / tavily_extract / firecrawl_scrape / GitHub API / web.run

## 文章目標

寫一篇「哪些學校有完整 AI 相關課程」的傘狀地圖文，收錄約 53 間學校 + 全球 AI 教育網路。

### 主論點（已從查證中浮現）

1. **「AI 學位」在頂尖學校是例外不是常態** — MIT 和 Stanford 都沒有 AI 學位，發的是 CS 學位，AI 是裡面的一條線。真正把 AI 印在學位名稱上的是少數（CMU、NUS、UPenn、USC）。
2. **「AI 學位」有四種濃度** — 獨立學位 > major > specialization/track > 中途轉入的 stream。Oxford 那種「寫論文前才能轉進 AI」跟「我念了 AI 碩士」給人的印象差距最大。
3. **2024–2026 AI 學士正在爆發** — 美國從 90 個翻倍到 193 個（Programs.com 數據）。UPenn 2024、USC/UCSB/Stevens/U Maryland 2026。
4. **全球有六個 AI 教育網路，解決六個不同的問題** — 美國怕集中、歐洲怕流失、加拿大怕教父走、台灣怕不公平、日本在穿針引線、東南亞剛開始談。
5. **US News 全球 AI 排名 vs 美國國內 CS 排名是兩個完全不同的故事** — 全球 AI 前十中國佔五間（清華 #1），CMU 排 #39；美國國內 CS 排名 CMU/MIT 並列 #1。引用排名必須標清楚是哪一個。
6. **CS 學位是常態，AI 學位是行政層產物** — 課表重疊度極高，差別在 AI 學位多了強制分類要求和倫理必修。

### 建議結構

1. 主文：結構性觀察（上述六點）
2. 按地區分節，每間一句定位
3. 交叉比較表（排名、學費、線上與否、簽證）
4. 全球 AI 教育網路專節
5. 連結已有的 CMU deep-dive 與課程總覽文

### 已寫好待 commit 的相關檔案

- `src/content/posts/learning/2026-08-21-cmu-ai-degree.md` — CMU AI 學位 deep-dive（verify 綠，未 commit）
- `~/Work/posts/learning/2026-08-21-cmu-ai-degree.md` — 同上的備份

---

## 查證分級

- 🟢 逐頁查過官方來源，可直接引用
- 🟡 有輪廓但缺細節，寫進文章時要標明或補查
- 🔴 只知道名字和排名，需要補查才能寫具體內容

### 2026-08-21 補查批次：來源讀取盤點

| 學校 | 主要一手來源 | 讀取層級 | 阻礙 / 備註 |
|---|---|---|---|
| HKUST | 工學院 MSc AI 課程頁 + CSE 研究所學程清單 | ✅ 一手 | 無；兩頁都確認是獨立 MSc |
| TUM | Informatics MSc 學程頁 + 非 EU 學費規則 | ✅ 一手 | 無；舊資料的「免學費」已被 2024/25 起的新制推翻 |
| 東京大學 | 資訊理工研究科組織、招生、English Program 頁 | ✅ 一手 | 無；AI Center 是研究中心，不是授予 AI 學位的專攻 |
| Edinburgh | MSc AI 課程頁 + School of Informatics handbook + Registry 學費表 | ✅ 一手 | 課程主頁直接抓取回 403，改讀官方搜尋索引全文；另兩頁可直接抓取並交叉確認 |
| 清華 | 2026 國際研究生招生頁 + 人工智能學院學程清單 | ✅ 一手 | 2026 對國際生只列博士學程，不能寫成獨立 AI 碩士 |
| Tübingen | MSc ML 學程頁 + 2026/27 申請頁 | ✅ 一手 | 無；學程頁與申請頁對資格、截止日、語言一致 |

### 補查事實交叉表

| 事實 | 來源 A | 來源 B | 狀態 |
|---|---|---|---|
| HKUST 有獨立 MSc in Artificial Intelligence | 工學院 MSc AI 課程頁 | CSE 研究所學程清單 | ✅ |
| TUM Informatics MSc 對一般新入學非 EU/EEA 生收 €6,000/學期 | Informatics MSc 學程頁 | TUM 非 EU 學費規則 | ✅；原筆記「免學費」錯誤 |
| 東京大學沒有獨立 AI 碩士；AI 是資訊理工研究科內的研究與課程方向 | 六專攻組織頁 | English Program / 招生頁 | ✅ |
| Edinburgh 有獨立 MSc AI，2026/27 全職一年 | Degree Finder | MSc handbook | ✅ |
| 清華人工智能學院 2026 對國際生只列四個博士學程 | 國際招生學院頁 | 人工智能學院 graduate programs 頁 | ✅ |
| Tübingen MSc ML 2026/27 截止日為 4/30 | 學程頁 | 申請頁 | ✅ |

---

## 美國（17 間）🟢

### CMU 🟢🟢🟢（已寫完 deep-dive）

- **學士**：B.S. in Artificial Intelligence（2018，全美第一個）
  - Math Core 7 門 / CS Core 5 門 / AI Core 2 或 3 門（官方頁打架）/ AI Cluster Electives 4 門（四個 cluster 各一：Decision Making & Robotics / Machine Learning / Perception & Language / Human-AI Interaction）/ Ethics 1 門 / 人文藝術 7 門（一門必須認知科學或認知心理）
  - 輔系 6 門，**SCS 學生不能修**
  - 來源：https://www.cs.cmu.edu/bs-in-artificial-intelligence/curriculum + http://coursecatalog.web.cmu.edu/schools-colleges/schoolofcomputerscience/artificialintelligence
- **碩士**：
  - MSAII（LTI）：195 學分（84 Core 含 36 Capstone + 72 Knowledge + 36 Electives + 3 Practicum）。Core 幾乎是創業流程。入學前須過 15-513。Fall 2027 申請 2026-09-09 開放，早鳥 11/18、最終 12/09。$80/$100 申請費。
    - 官方頁自打架：同一頁寫 192 又寫 195（84+72+36=192，加 3 學分 Practicum 才 195）
    - 來源：https://www.lti.cs.cmu.edu/academics/masters-programs/msaii.html
  - MS in Machine Learning（MLD）：16 個月、修課為主、不能寫碩士論文
    - 來源：https://www.ml.cmu.edu/academics/
- **博士**：PhD in Machine Learning + 四個聯合博士（Statistics and ML / ML and Public Policy / Neural Computation and ML / Autonomous & Human Decision Making）
  - 跨 9 個 home school、3 個 college
  - 來源：https://ml.gatech.edu/admissions（注意這是 GT 的；CMU 的見 MLD 頁）

### Stanford 🟢

- **學士**：CS + AI track（九選一），無獨立 AI 學位
- **碩士**：MS in Computer Science，AI 是 track。45 units，~1.5 年，只收秋季，12 月初截止，不要 GRE。學費聚合站估 $90,000–100,000（🟡 非官方一手）
  - HCP（在職兼職）：**限人在美國且受僱於美國**
  - 來源：https://www.cs.stanford.edu/admissions/masters-admissions
- **博士**：CS PhD，AI 是研究領域（SAIL）。5–6 年。**不要求 CS 學士**（"strong quantitative and analytical skills"）
  - 來源：https://cs.stanford.edu/admissions/phd
- **2026 大事**：HAI 跟瑞士 National AI Institute（ETH + EPFL）結盟做開源基礎模型（2026-01-22）；HAI 與 Data Science 合併（2026-05-04），Fei-Fei Li 升全校 AI 特別顧問
  - 來源：https://hai.stanford.edu/news/stanford-hai-and-swiss-national-ai-institute-form-alliance-to-advance-open-human-centered-ai

### MIT 🟢

- **學士**：CS（6.4110 Representation, Inference, and Reasoning in AI）
- **碩士**：**無獨立 AI 碩士**，無獨立終端碩士（MS 是 PhD 過程中順帶拿的）
- **博士**：EECS PhD，約 700 名博士生。研究在 CSAIL（全 MIT 最大實驗室，年研究預算 $65M）。TQE 要修 4 門課（2 門可來自 AI group），RQE 是研究 project
- 來源：programs.com/programs/ai-phd-programs（🟡 二手整理，但細節吻合官方）

### Berkeley 🟢

- **學士**：CS / EECS + AI 方向
- **碩士**：**對外只有 MEng**（1 年專業學位，1 月初截止）。5th Year MS 限自家大學部。研究型 MS「intended primarily for registered Ph.D. students」
  - 來源：https://eecs.berkeley.edu/academics/graduate/industry-programs + https://eecs.berkeley.edu/academics/graduate
- **博士**：EECS PhD，AI 是 CS division 底下的研究領域（另有 DBMS/HCI/OSNT/PS/SCI/SEC/THY）。12/1 截止，不收 GRE。
  - 來源：https://eecs.berkeley.edu/academics/graduate/research-programs/admissions

### Georgia Tech 🟢

- **學士**：CS + Intelligence Thread（非獨立 AI 學位）
- **碩士**：OMSCS（AI 或 ML specialization）。$225/學分 × 30 = $6,750 + 雜費，總額估 $8,510–9,350（不同站不同算法）。74% 錄取率、13,000+ 畢業生、畢業率 <50%。文憑跟校內生完全相同，不註明線上。不要 GRE。
  - 來源：https://aws.amazon.com/training/digital（🟡 學費數字來自多個聚合站，非 GT 官方頁。GT 官方是 $225/credit + $440 technology fee）
- **博士**：**PhD in Machine Learning**（獨立學位）。跨 9 個 school、3 個 college。核心分四區：數學基礎 / 機率統計 / 最佳化 / ML 理論與方法。通過 9 個 home school 之一申請。
  - 來源：https://catalog.gatech.edu/programs/machine-learning-phd + https://ml.gatech.edu/admissions

### UT Austin 🟢

- **學士**：CS（ML & AI Concentration），非獨立 AI 學位
- **碩士**：**線上 MSAI $10,000**（獨立 AI 學位），與 edX 合作，2023 開辦
  - 來源：campustechnology.com + degreeforum.net
- **博士**：CS PhD
  - US News AI #7（從 #12 暴升，2026 最大異動）
  - 來源：https://www.cs.utexas.edu/graduate/degrees-and-programs

### UPenn 🟢

- **學士**：**BSE in Artificial Intelligence**（2024 首屆，**第一間 Ivy League**）
- **碩士**：**MSE in Artificial Intelligence（線上）**，10 門課。Spring 2027 最終截止 2026-10-19。另有 4 門課的 AI Graduate Certificate
  - 來源：https://catalog.upenn.edu/graduate/programs/artificial-intelligence-mse + https://online.seas.upenn.edu/degrees/mse-ai-online/admissions
- **博士**：CS PhD，透過 Penn AI 統合（ASSET Center for Trustworthy AI、CIS 系有 ML & AI / NLP / HCI / algorithmic fairness / AI for health 研究群）
  - 來源：https://ai.upenn.edu/education

### USC 🟢

- **學士**：**B.S. in Artificial Intelligence**（**Fall 2026 首屆入學**），Viterbi + School of Advanced Computing 聯辦，三個 track。三個系合作：CS / ECE / ISyE
  - 來源：https://viterbischool.usc.edu/news/2025/08/usc-viterbi-school-of-engineering-and-the-usc-school-of-advanced-computing-launch-an-undergraduate-degree-in-artificial-intelligence
- **碩士**：**MS in Computer Science（Artificial Intelligence）**，32 units，「one of the first programs of its type in the nation」。STEM OPT eligible。不要 GRE（2027 申請）。申請費 $105（2026 起從 $90 漲）
  - PhD 12/15 截止，MS 12/15（獎學金）1/15（最終）
  - 來源：https://viterbigradadmission.usc.edu/programs/masters/msprograms/computer-science/ms-computer-science-artificial-intelligence
- **博士**：CS PhD + **ORAI PhD Certificate**（AI × Operations Research，2024 底拿 NSF $2.9M grant，CS 系與 ISyE 合辦）
  - 來源：https://viterbischool.usc.edu/news/2024/12/usc-launches-first-of-its-kind-interdisciplinary-phd-program-in-artificial-intelligence-and-operations-research

### UIUC 🟡

- CS + AI 方向，碩士有**線上 MCS <$30k**（非 AI 獨立學位）
- US News CS #5 並列、AI #6 並列
- 來源：mastersinai.org（🟡 二手）

### Cornell 🟡

- CS + AI/ML Focus，CS PhD 前十。Cornell Tech 有 AI 方向
- ML 理論、computational social science
- 來源：programs.com（🟡 二手）

### U Washington 🟡

- CS / ECE，US News 前十。**Allen Institute for AI（AI2）在旁邊**
- NLP 與 robotics 極強
- 來源：gabble.ai（🟡 二手）

### Princeton 🟢

- **不開碩士（PhD only）**。PhD 的 breadth requirement 含 AI area（Advanced CV、Neural Rendering、Foundations of DL）。通過 General Exam 後順帶拿「incidental MS」
- ML 研究領域活躍：2026 有 ML Theory Summer School（8/3–14）
- 來源：https://gradschool.princeton.edu/academics/degrees-requirements/fields-study/computer-science + https://www.cs.princeton.edu/research/areas/mlearn

### UCSD 🟡

- **B.S. in Artificial Intelligence**（2026 新開）
- 來源：collegekickstart.com（🟡 二手）

### Rice 🟡

- **BS in Artificial Intelligence**（Fall 2025 開辦）
- 來源：programs.com（🟡 二手）

### U Maryland 🟡

- **2026 新開兩個 AI 學士**：B.A. in Human-Centered AI + Technical B.S. in AI
- 來源：collegekickstart.com（🟡 二手）

### Columbia 🟡

- CS PhD 前十，Data Science Institute，MSc CS 有 AI 方向
- 來源：towardsai.com（🟡 二手）

### Michigan 🟡

- CS & Engineering + AI/ML 方向，AI Lab，Ford/Toyota 合作
- US News AI 前十五
- 來源：mastersinai.org（🟡 二手）

---

## 加拿大（5 間）🟡

### Toronto / Vector Institute 🟡

- **MScAC AI Concentration**：16 個月（8 修課 + 8 實習），Fall only，12/1 截止。國際生 ~CAD 58k
- CS PhD
- **Vector Institute**：Geoffrey Hinton（Nobel 2024）。獎學金 $2.1M/年給 Ontario 碩士生
- 來源：agihouse.ca（🟡 二手整理但資訊密度高）

### Montreal / McGill / Mila 🟡

- **Mila**：Yoshua Bengio，全球最大學術深度學習中心，140+ 教授。UdeM / McGill / Polytechnique / HEC / Concordia / ETS 附屬
- McGill MSc CS（thesis 或 non-thesis），1.5–2 年，國際生 ~CAD 20–25k
- Mila supervisor matching：10/15–12/15
- 來源：mila.quebec + agihouse.ca

### Alberta / AMII 🟡

- **AMII**：Richard Sutton（強化學習之父）
- MSc CS（ML），國際生 ~CAD 10–18k
- 來源：studentbuddy.io

### Waterloo 🟡

- MDSAI（16 個月 + co-op），國際生 ~CAD 45k
- 來源：agihouse.ca

### UBC 🟡

- MSc CS / Data Science MEng，國際生研究型 ~CAD 10k
- 來源：agihouse.ca

---

## 歐洲（14 間）

### ETH Zurich 🟢

- MSc CS，**Machine Intelligence major**（Advanced ML / Deep Learning / Probabilistic AI / Machine Perception / Optimization for Data Science）。120 ECTS / 4 學期。**CHF 730/學期，不分國籍**
- 另有 MAS in AI and Digital Technology（CHF 42,000，須已有碩士 + 管理經驗，2.5 年，申請期 5/1–6/1 已過）
- **AI Center Doctoral Fellowship**：每年 5–8 人，兩位跨領域 PI 共同指導（權重相同），fellow 年薪 CHF 73.1k→78.3k→83.5k。申請 portal 2026-09 開。855 申請收 18 人（~2%，🟡 二手數字）
- 另有 CLS（與 Max Planck 合辦）與 ELLIS PhD Fellowship
- 來源：https://ai.ethz.ch/research/phd-and-postdoc-programs/phd-fellowships.html + study-abroad.org

### EPFL 🟡

- 跟 ETH 齊名，學費同 CHF 730/學期。ML 系統、robotics
- 來源：study-abroad.org（🟡 未查官方頁）

### Oxford 🟢

- **MSc Advanced Computer Science**，1 年。AI 是**中途轉入的 stream**（"you may have the opportunity to transfer... prior to completing your dissertation"），取決於選課與論文題目
  - 2026-27 學費：£45,760（QS 比較站數字；🟡 Oxford 官方頁只寫 annual course fees 但未列金額在抓到的內容裡）
  - 來源：https://www.ox.ac.uk/admissions/graduate/courses/msc-advanced-computer-science
- **AIMS CDT**（EPSRC Centre for Doctoral Training in Autonomous Intelligent Machines and Systems）：4 年全職 / 8 年在職。**2026-27 已截止**（截止 2026-01-28），下一梯 2027-28。學費：Home £10,470 / Overseas £34,700（在職減半）。生活費 £1,405–2,105/月
  - 有全額獎助：Amazon Fellowship、LIGHTSPEED、Oxford Martin AI Governance Initiative
  - TechExpert pilot：Home 學生 stipend £31,000
  - 來源：https://www.ox.ac.uk/admissions/graduate/courses/cdt-autonomous-intelligent-machines-and-systems + https://aims.robots.ox.ac.uk

### Cambridge 🟡

- MPhil Advanced CS，1 年，£37,290/年。DeepMind 研究合作
- 來源：study-abroad.org（🟡 未查官方頁）

### Imperial College London 🟡

- **MSc AI（獨立學位）**。倫敦
- 來源：edubrain.ai（🟡 未查官方頁）

### UCL 🟡

- **MSc Machine Learning and Data Science**。Gatsby Computational Neuroscience Unit
- 來源：edubrain.ai（🟡 未查官方頁）

### Edinburgh 🟢

- **MSc Artificial Intelligence（獨立學位）**。全職 1 年，也可兼職 2–3 年；2026 年 9 月入學
- 180 credits：20-credit Informatics Project Proposal + 60-credit dissertation + 100 credits 選修，其中至少 60 credits 必須來自 AI / Cognitive Science
- 典型 AI 選修涵蓋 NLP、computer vision、speech、probabilistic modelling、reinforcement and robot learning、AI ethics；選修不保證每年開，熱門課可能限額
- 2026/27 學費：英國本地全職 £18,000；International/EU £45,410。校方估計生活費 £18,504/年
- 入學底線是相關領域 UK 2:1；官方明說競爭激烈，典型 offer 通常要 first-class。須有 programming 課與約 30 ECTS 數學背景；IELTS 7.0、各項至少 6.5
- 來源：https://study.ed.ac.uk/programmes/postgraduate-taught/107-artificial-intelligence + https://informatics.ed.ac.uk/taught-students/msc-students/taught-msc-handbook-202526/degree-programmes-and-courses/artificial + https://registryservices.ed.ac.uk/tuition-fees/find/postgraduate-taught/2026-2027/taught-masters

### TUM（慕尼黑工大）🟢

- MSc Informatics，120 ECTS / 4 學期，通常以英語授課；可自由組合專長，AI 是可選方向之一，不是獨立 AI 學位
- **原筆記「非歐盟也免學費」錯誤。** 自 2024/25 冬季起，多數新入學的非 EU/EEA 學士與碩士生要付 tuition；Informatics MSc 是 **€6,000/學期**，另加 2026 年 München/Garching semester fee €97
- EU/EEA 生、已在德國教育系統取得至少六學期學位者、博士生、協議交換生等通常免 tuition；另有 waiver 與 scholarship，但不能把例外寫成一般價格
- 冬季班申請 2/1–5/31，夏季班 10/1–11/30；須通過 aptitude assessment，英語能力證明要在截止日前交
- 來源：https://www.tum.de/en/studies/degree-programs/detail/informatics-master-of-science-msc + https://www.tum.de/en/studies/fees/tuition + https://www.tum.de/en/studies/fees

### Tübingen 🟢

- International MSc Machine Learning，英語授課、4 學期，只在冬季入學；研究環境連到 Tübingen AI Center、Max Planck Institute for Intelligent Systems 與 ELLIS
- 2026/27 申請 2026-02 開放，**4/30 截止**，EU 與非 EU 同一天；走 ALMA 線上申請，無申請費、不用郵寄紙本
- 先修硬門檻：CS / 數學 / 物理或相關自然科學學士，換算德國成績至少 2.0；數學至少 27 ECTS，CS 至少 18 ECTS，其中 algorithms and data structures 至少 6 ECTS
- 英語：IELTS 7.0、TOEFL iBT 100（舊制）/ 5.0（2026 新制）或 Cambridge 180；「學士全英授課」本身通常不能免成績。GRE 與推薦信都不要求
- 非 EU 生一般另付 €1,500/學期 tuition，加約 €200 semester fee；官方申請頁表示目前學程本身不提供 scholarship
- 來源：https://uni-tuebingen.de/en/study/finding-a-course/degree-programs-available/detail/course/machine-learning-master/ + https://uni-tuebingen.de/en/166353

### Amsterdam 🟡

- **MSc AI（獨立學位）**。€18,750/年（非歐盟）。ELLIS unit
- 來源：admissiongoals.com（🟡 未查官方頁）

### Freiburg 🟡

- MSc CS，ELLIS unit，自動駕駛與 RL
- 來源：studying-in-germany.org（🟡）

### TU Darmstadt 🟡

- MSc AI & ML。DFKI（德國 AI 研究中心）實驗室。Hessian.AI 成員。ELIZA 學校（Konrad Zuse School）協調方
- 來源：studying-in-germany.org（🟡）

### KU Leuven 🟡

- **MSc AI（獨立學位）**。比利時 #1
- 來源：edubrain.ai（🟡）

### ELLIS 網路 🟢

- 47 站點、19 國、2,000+ 成員、560 Fellows & Scholars、500+ PhD + Postdoc
- ELLIS PhD Program：雙 PI 指導（不同機構）、內建 6 個月跨國交換
- 完整站點清單含 Helsinki、Prague、Delft、Aalto、INRIA、Politecnico di Milano 等（本文不逐校展開）
- Max Planck School in AI：2025-06 公告 Call for Proposals，尚未成立
- 來源：https://ellis.eu + https://ellis.eu/research/phd-postdoc + https://www.maxplanckschools.org

---

## 亞洲（17 間）

### 清華大學 🟢

- 2024 年成立**人工智能學院（College of AI）**，研究分 AI Core 與 AI+；但學院名稱不能直接等同於「AI 學位」
- **2026 國際生目錄只列四個博士學程**：Electronic Science and Technology、Information and Communication Engineering、Control Science and Engineering、Computer Science and Technology；沒有列獨立 AI 碩士
- 碩士替代路徑分散在其他院系：自動化系對國際生列 Electronic and Information Engineering 碩士；交叉信息研究院列 Computer Science and Technology 碩士，AI 是其培養與研究方向之一
- 國際研究生一般申請期為 9 月到隔年 2 月，但各院系截止日不同；語言條件也依院系目錄決定。碩士須有學士學位，國際學位須在 2026 註冊前完成 CSCSE 認證
- US News 全球 AI **#1**是研究產出排名，不能拿來推論有英語授課 AI 碩士
- 來源：https://yz.tsinghua.edu.cn/en/info/1014/1471.htm + https://yz.tsinghua.edu.cn/en/info/1035/1523.htm + https://yz.tsinghua.edu.cn/en/info/1014/1107.htm + https://yz.tsinghua.edu.cn/en/info/1014/1147.htm

### 北京大學 🔴

- QS CS ~#14，智能科學與技術系
- Baidu/ByteDance 人才庫——但**具體學程未查證**
- 來源：排名站引用

### 浙江大學 🔴

- US News 全球 AI #3——但**具體學程未查證**

### 上海交大 🔴

- US News 全球 AI 前十——但**具體學程未查證**

### NUS 🟢

- **學士**：BComp in Artificial Intelligence（前兩年可在 CS/AI 之間猶豫再選）
  - 來源：https://www.comp.nus.edu.sg/programmes/ug/ai/
- **碩士**（兩個，容易搞混）：
  - MComp **in** AI：40 units，五門核心（須橫跨四個 AI 子領域中至少三個）+ 五門選修。全職 1.5 年 / 在職 2.5 年 / 最長 3 年。GPA 3.0 畢業。**S$61,600（未稅）/ S$67,144（含 9% GST）**。申請費 S$109，接受 offer 訂金 S$6,714.40 可抵學費。**國際生須全職才能辦 Student's Pass**
  - MComp（AI Specialisation）：同規格 40 units
  - 來源：https://www.comp.nus.edu.sg/programmes/pg/mcomp-ai + https://www.comp.nus.edu.sg/programmes/pg/mai
- **博士**：PhD in CS，4 年結構（Y1 修課+CS6101 / Y2 修課+QE / Y3 論文提案 / Y4 口試）。**五個 cluster 至少三個各修 4 units**（Algorithm & Theory / Computer Systems / Knowledge Systems / Media Technologies / PL & SE）
  - 來源：https://www.comp.nus.edu.sg/programmes/pg/phdcs

### NTU Singapore 🟡

- MSAI / Enterprise AI（PACE）— 你 HackMD 的方案 A/B
- US News 全球 AI #2
- 來源：你的 HackMD 文件 + 排名站

### KAIST 🟡

- AI Graduate School，94% 國際生拿 RA 獎學金
- 你 HackMD 的方案 C
- 來源：你的 HackMD 文件

### SNU（首爾大學）🟡

- 협동과정 인공지능전공
- 你 HackMD 的方案 D
- 來源：你的 HackMD 文件

### 東京大學 🟢

- **沒有獨立 AI 碩士。** 最直接的入口是 Graduate School of Information Science and Technology（IST）的碩士，學位由六個專攻之一授予：Computer Science、Mathematical Informatics、Information Physics & Computing、Information & Communication Engineering、Mechano-Informatics、Creative Informatics
- AI / ML 分布在 Computer Science、Creative Informatics 等專攻與 Next Generation Artificial Intelligence Research Center；AI Center 是跨校研究中心，不是第七個授予學位的專攻
- IST 的 English Program 也不是另一個學位：先考進一般 master / doctoral course，再註冊全英語課程；畢業證仍由所屬專攻授予。2026-04 起研究科多數課程改以英語授課
- 舊的 English Program on Intelligent Information Processing 特別招生已自 AY2026 廢止；2027 夏季碩士招生採一般入試，2026-05-29 至 6/4 線上申請，並用 TOEFL 評估英語
- 來源：https://www.i.u-tokyo.ac.jp/edu/intro/index_e.shtml + https://www.i.u-tokyo.ac.jp/edu/entra/entra_e.shtml + https://www.i.u-tokyo.ac.jp/ist_en/en-course/prg.shtml

### HKUST 🟢

- **MSc in Artificial Intelligence（獨立學位）**；CSE 學程清單與工學院課程頁都已確認
- 30 credits：12 core + 12 elective + 6-credit compulsory Capstone；平日晚間與週六在校上課
- CS / Computer Engineering 或相關學士可申請；其他科系須至少兩年相關畢業後工作經驗
- 2026/27 nominal program fee **HK$400,000**；全職分兩期、兼職分四期。英語門檻依研究院通則，IELTS 6.5 且各項 5.5，或對應 TOEFL 成績；英語母語／全英授課學位可免
- 2026 年 9 月入學採 rolling admission；三輪截止日為 2025-11-01、2026-01-01、2026-03-01
- 來源：https://seng.hkust.edu.hk/academics/taught-postgraduate/msc-ai + https://cse.hkust.edu.hk/pg/ + https://fytgs.hkust.edu.hk/adm-req

### CUHK（中文大學）🔴

- US News 全球 AI #9，MMLab 電腦視覺
- **具體學程未查證**

### HKU（港大）🔴

- QS 亞洲 #6
- **具體學程未查證**

### IIT Bombay 🔴

- 印度 #1，矽谷 AI lab 的 feeder（5W Index Composite 45.5）
- **具體學程未查證**

### IISc Bangalore 🔴

- 印度理論 CS 最強（5W Index Composite 43.0）
- **具體學程未查證**

### 台灣大學 🟡

- **人工智慧頂尖研究中心（AICoRE）**：合作方含 MIT/Stanford/Berkeley/ETH/Oxford + Google DeepMind/Meta AI/NVIDIA/OpenAI。主辦 ACML 2025（李宏毅議程主席）
- 資工所：林軒田 ML、李宏毅 GenAI
- 無獨立 AI 學位（CS 底下有 AI 課）
- 來源：https://aicore.ntu.edu.tw

### 陽明交大 🟡

- **人工智慧技術與應用碩士學位學程**（115 學年招生中）— 有獨立 AI 碩士
- **智慧科學暨綠能學院** PhD
- AI Forum 第 28 屆（2026-07-03，Google DeepMind 講者）
- 台南校區有 AI Center
- 來源：https://aigp.ece.nycu.edu.tw + https://ai.nycu.edu.tw

### 成功大學 🟡

- **人工智慧科技碩士學位學程** + 數據科學研究所 — 有獨立 AI 碩士
- 來源：https://aim.ncku.edu.tw

---

## 全球 AI 教育網路

### NSF National AI Research Institutes（美國）🟢

- 啟動 2020，**29 個研究所、500+ 機構、40+ 州、總計 ~$5 億**
- 每個所最高 $20M、五年期。2026-07-29 又宣佈新所（U Delaware HAIC，$21.5M）
- 解決的問題：AI 研究集中在加州 → 錢撒到全國
- 來源：https://www.nsf.gov/focus-areas/ai/institutes + https://en.wikipedia.org/wiki/National_Artificial_Intelligence_Research_Institutes

### ELLIS（歐洲）🟢

- 2018 成立，學術界自發
- 47 站點、19 國、2,000+ 成員、560 Fellows & Scholars、500+ PhD + Postdoc
- ELLIS PhD Program：雙 PI（不同機構、通常不同國家）、6 個月跨國交換、fully funded
- 解決的問題：歐洲 AI 人才流失到美國
- 成員含 ETH / Oxford / Amsterdam / Tübingen / Max Planck / Cambridge / Edinburgh / Imperial / UCL / Helsinki / Prague / Delft / INRIA 等
- 來源：https://ellis.eu

### Vector / Mila / AMII（加拿大三巨頭）🟡

- Vector（Toronto）：Geoffrey Hinton（Nobel 2024）
- Mila（Montreal）：Yoshua Bengio，140+ 教授，全球最大學術深度學習中心
- AMII（Alberta）：Richard Sutton（RL 之父）
- 解決的問題：留住三教父的研究生態
- 加拿大有 PR pathway（TEER 1 Express Entry 加分）
- 來源：agihouse.ca + vectorinstitute.ai + mila.quebec

### TAICA（台灣）🟢

- **教育部成立，55 所大學加入**，113 學年度第 2 學期啟動
- 四個跨校學分學程：AI 探索應用 / AI 工業應用 / AI NLP / AI CV
- 台大林軒田 ML、政大蔡炎龍 GenAI 在聯盟課單裡
- 解決的問題：師資不均 →「怎麼讓不是台清交成的學生也能學到 AI」
- 來源：https://taicatw.net

### RIKEN AIP（日本）🟡

- 2016 啟動，MEXT 出錢。東京
- 單一研究所但合作網廣：
  - 2026-07-24：NTU AI-CoRE & RIKEN AIP Workshop（台灣）
  - 2026-07-05：RIKEN AIP–Vector–NAIRL Workshop（首爾）— 串聯加拿大 Vector + 韓國 NAIRL
  - 2026-03-25：RIKEN AIP–IIT Hyderabad（印度）
- 來源：https://aip.riken.jp/news-list

### ASEAN 教育工作計畫 2026–2030（東南亞）🟡

- 2026-07-22 第 14 屆 ASEAN 教育部長會議（新加坡主持）發佈
- 把 AI 列為戰略優先，新加坡 2026–2027 擔任主席，辦 AI-in-Education 區域論壇
- 對話夥伴含中日韓
- 制度層級（還沒有具體跨校學程）
- 來源：LinkedIn（Svetlana Popova 引用 Singapore MOE 2026-07-22 公告）

### Stanford HAI × Swiss National AI Institute 🟢

- 2026-01-22 宣佈：Stanford + ETH + EPFL 結盟做開源基礎模型
- 學校對學校跨國，不是政府計畫
- 來源：https://hai.stanford.edu/news/stanford-hai-and-swiss-national-ai-institute-form-alliance-to-advance-open-human-centered-ai

### Max Planck School in AI（德國，籌備中）🟡

- 2025-06 公告 Call for Proposals
- 如果成立會是德國聯邦級 AI PhD program
- 來源：https://www.maxplanckschools.org

---

## 排名交叉比對

### US News 2026 美國國內 CS 研究所排名

1. CMU（並列）
1. MIT（並列）
3. Stanford
4. Berkeley
5. Georgia Tech（並列）
5. UIUC（並列）
7. Princeton（並列）
7. Cornell（並列）
7. UW（並列）
10. UT Austin

### US News 2026 AI 子排名（美國國內）

前十大致同上但順序不同，**UT Austin 升到 #7**（2026 最大異動）

### US News 2026 全球 AI 排名（⚠️ 跟上面完全不同）

1. 清華
2. NTU Singapore
3. 浙大
4. 北大
5. NUS
6. 電子科大
7. 中科大
8. 武大
9. CUHK
10. 華中科大 / 上交

**CMU 排 #39，Stanford/MIT/Berkeley 連前 30 都沒進。** 這個排名看的是論文產出量，不是教學品質或企業聲望。**引用時必須標清楚是哪個排名。**

### QS 2026 CS 排名（全球）

MIT #1 / Stanford #2 / Cambridge #3 / Oxford #4 / ETH #5 / NUS #6 ...

### QS 2026 總排名（全球前 15 含本文相關校）

MIT #1 / Stanford #3 / Oxford #4 / ETH #7 / NUS #8 / UPenn #15

---

## 下一步建議

1. **寫地圖文時，按查證分級處理**：🟢 直接引用、🟡 標明「未逐校查證」、🔴 放在「其他值得注意」的簡表裡不展開
2. **下一批補查優先順序**：EPFL > Cambridge > Imperial > UCL > Amsterdam > KU Leuven；這六間仍只有二手輪廓
3. **地圖文建議用 `post` skill 走完整流程**：分類 `learning`，type `guide`，series 可掛在 Stanford 課程導讀同一個系列或另開
