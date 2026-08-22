# 內容規劃：世界名校 AI／ML 課程地圖第二季與 CMU 完整課程導讀

- 建立日：2026-08-22
- 參考體裁：[Stanford CS230 系列計畫](./content-plan-cs230.md)
- 上層系列：[世界名校 AI／CS 課程地圖計畫](./global-ai-cs-course-guide-series-plan.md)
- 目標：完成五篇新學校地圖，並把 CMU 地圖延伸成四門課的完整課程導讀，而不是只做課名與公開程度摘要。
- 語言：zh-TW／en 成對。
- 類別：學校地圖用 `learning`；CMU 單課內容原則上用 `ai`，只有純學習路線或課程制度篇才用 `learning`。
- 停止條件：每篇責任不重疊、每門課有完整來源 manifest、版本不混寫、校外限制逐項實測，且每批 `pnpm verify` 全綠。

## 0. 使用者要的不是一篇「長摘要」

本計畫沿用 CS230 系列已確認的標準：

1. **完整覆蓋官方 agenda**，不能只挑作者有發揮空間的主題。
2. 每篇開頭鎖定學期、講次、日期、講者與主要教材；有影片才寫片長。
3. 正文照授課順序重建概念、推導、案例與作業目的。
4. 作者的比較、更新與實務延伸集中到文末 `## 延伸：`，不插隊改寫課程本身。
5. 課程沒有公開影片時，不能假裝還原講者口頭內容；改以 slides、notes、recitation、作業與 starter code 為證據。
6. LMS、正式評分、隱藏測試、課內算力與助教回饋分開標示，不用「公開／不公開」一個詞全部包掉。

學校地圖與單課系列分工：

```text
學校地圖：學位結構 → 先修關係 → 當期開課 → 公開程度 → 自學路線
                                         │
                                         ▼
完整單課：逐講／逐模組 → 作業 → 推導 → 限制 → 完成後能做什麼
```

## 1. 總規模

| 軌道 | 中文文章 | 雙語 Markdown | 拆法 |
|---|---:|---:|---|
| A. 五篇學校地圖 | 5 | 10 | 一校一篇；Oxford／UCL 為一篇雙校比較 |
| B. CMU 新舊核心比較 | 1 | 2 | 15-281＋10-315 對 07-280＋07-380 |
| C1. CMU 07-280 | 29 | 58 | 總覽 1＋逐講 24＋階段複習 3＋結業路線 1 |
| C2. CMU 10-301/601 | 10 | 20 | 總覽 1＋依九份公開 HW 組成 9 個模組 |
| C3. CMU 11-785 | 29 | 58 | 總覽 1＋逐講 28；Course Logistics 併入總覽 |
| C4. CMU 10-414/714 | 13 | 26 | 總覽 1＋來源一致的 12 個主題模組 |
| **合計** | **87** | **174** | 不含 series registry、研究 manifest 與 progress 更新 |

這不是一次批次產生的工作。依治理規則，任何 **>20 檔**的實際寫作批次都要先取得使用者同意；本文只是規劃，不代表授權一次建立 174 檔。

---

# A 軌：世界名校 AI／CS 課程地圖第二季

現有傘狀系列：

| order | 分冊 |
|---:|---|
| 0 | 全球入口 |
| 1 | Stanford |
| 2 | CMU |
| 3 | MIT |
| 4 | Berkeley |

第二季延續 order 5–9。

## A5 — Harvard AI／ML 課程導讀

暫定標題：`Harvard AI／ML 課程導讀：CS50 AI、CS181、CS182 的影片與作業是不是同一版？`

核心問題：Harvard 最容易搜尋到的是 CS50 AI，但正式本科與研究型 ML 路線不能只靠一門 MOOC 代表。

必查課程：

- CS50's Introduction to Artificial Intelligence with Python
- CS181 Machine Learning
- CS182 Artificial Intelligence
- 發稿時由現行 catalog 補入的 NLP／vision／robotics 代表課，正文最多詳寫 12 門

研究子問題：

1. CS50 AI 的 current course、edX／YouTube playlist、project starter 與 specification 是否屬於同一版本？
2. CS181／182 在 2025–2026 是否實際開課，公開頁是當期站還是教師歷史站？
3. Harvard College 的 CS／Statistics 地基如何接入 AI／ML；哪些是正式 prerequisite，哪些只是實務建議？
4. 匿名讀者能否取得影片、slides、作業、starter、data、solutions 與 autograder？

文章主脊：**從 CS50 AI 的高可見度出發，逐步還原 Harvard 校內真正的 ML／AI 路線。**

禁止事項：不能因為影片與作業都能開，就假設兩者出自同一學期；不能把 HarvardX 身分、證書或討論區算成 Harvard 校內修課。

## A6 — Princeton AI／ML 課程導讀

暫定標題：`Princeton AI／ML 課程導讀：理論型 CS 地基怎麼接到 ML、NLP 與視覺`

核心問題：Princeton 的課號與教師頁相對分散，重點不是列名課，而是證明每一條先修邊與教材狀態。

研究子問題：

1. 現行 COS undergraduate／graduate requirements 如何形成演算法、機率、線代與系統地基？
2. 2025–2026 的 introductory ML、NLP、vision、robotics／RL 分別是哪幾門，是否真的開課？
3. 教師個人頁、過往 course site 與 registrar 的學期能否對上？
4. 沒有公開錄影時，notes、problem sets、starter code 與 exams 是否仍足以構成 A3？

文章主脊：**一條理論地基，接三個專題分支；公開度另畫，不把研究名聲當教材證據。**

停止條件：若找不到至少一條由官方 prerequisite 重建的完整路線，先保留研究筆記，不發地圖。

## A7 — ETH Zürich AI／ML 課程導讀

暫定標題：`ETH Zürich AI／ML 課程導讀：Probabilistic AI、Deep Learning 與 Computer Vision 怎麼排`

核心問題：歐洲課程常由 semester catalog、教授站、YouTube 與 exercise repository 分散呈現，必須先鎖定學期再組路線。

必查主題：

- introductory machine learning
- probabilistic artificial intelligence
- deep learning
- computer vision
- NLP／robot learning 作為後續分支候選

研究子問題：

1. Bachelor／Master 的正式課程入口與 prerequisites 是否一致？
2. 2025–2026 當期頁面是否公開 lecture recordings、exercise sheets、solutions 與 code？
3. 影片若來自舊版公開課，和現行 exercise／slides 是否能對齊？
4. ETH 的 semester、ECTS 與 exam 形式如何影響校外學習節奏？

文章主脊：**用機率模型、深度學習與視覺三條線，示範歐洲 semester course 如何轉成校外路線。**

## A8 — Toronto AI／ML 課程導讀

暫定標題：`Toronto AI／ML 課程導讀：CSC311 到 CSC413，歷史 Hinton 課程不能冒充現行教材`

核心問題：Toronto 有大量經典教材與名師歷史，但讀者要分清楚「研究史上的 Toronto」與「2025–2026 實際可修的課」。

必查路線：

```text
數學／程式地基 → CSC311 → CSC413
                         ├─ NLP
                         └─ Computer Vision
```

研究子問題：

1. CSC311、CSC413 的當期 prerequisites 與實際開課學期是什麼？
2. 最新 slides、assignments、starter code、video 各自屬於哪個學期？
3. Hinton 等歷史課程材料仍適合補哪一段，不適合拿來代表哪一段？
4. U of T、Vector Institute 與教師個人課站的角色要如何分開標示？

文章主脊：**先以 CSC311→413 建現行主幹，再把歷史材料放進明確標示的補充層。**

## A9 — Oxford／UCL AI 公開課比較

暫定標題：`Oxford／UCL AI 公開課比較：看得到 syllabus，離完整自學還差哪些材料？`

核心問題：這不是學校排名文，而是兩校在「公開程度」上的同欄比較。

共同稽核欄位：

| 欄位 | 必查內容 |
|---|---|
| current offering | 2025–2026 是否實際開課 |
| syllabus | 是否含完整週次、閱讀與評量 |
| lecture material | slides／notes 是否全學期可得 |
| practice | exercises／problem sets／labs |
| code | starter repository、data、environment |
| feedback | solutions、local tests、公開 autograder |
| recordings | 完整 playlist、零散講座或校內 LMS |

文章主脊：**同樣以 AI 聞名的兩校，校外讀者究竟能拿到什麼；A0–A3 是材料判斷，不是教學品質排名。**

分拆條件：若兩校可比較的正式課程重疊少於三個主題，或課程層級差異過大，改成兩篇學校地圖，不勉強湊比較文。

---

# B 軌：CMU 新舊 AI 核心比較

暫定標題：`CMU AI 核心改制：15-281＋10-315 到 07-280＋07-380，不只是換課號`

定位：連接現有 [CMU AI／ML 課程地圖](/posts/learning/2026-08-21-cmu-ai-ml-course-map)與 07-280 完整系列，不重複學位總表。

主脊：

```text
舊版：15-281 廣義 AI + 10-315 SCS Machine Learning
                         ↓ 內容重新混合與切分
新版：07-280 AI & ML I → 07-380 AI & ML II
```

固定比較欄：

1. 生效時間與 transition exception。
2. prerequisite 變化。
3. search、probability、classical ML、deep learning、RL、generative AI 的重新分配。
4. 10-301 為何仍存在，以及它和 07-280 的方向差異。
5. 學位替代規則的非對稱性：07-280 可在部分 MLD prerequisite 中替代 10-301；反方向不自動成立。
6. 校外教材：新課較新、舊課 archive 可能更穩定。

不做：07-380 尚未完成首開前，不對教學品質、作業難度或實際工作量下結論。

---

# C1 軌：CMU 07-280 完整課程導讀

## 系列定義

- zh-TW：`CMU 07-280 完整課程導讀`
- en：`Reading CMU 07-280`
- canonical edition：**Spring 2026，首次完成的班次**。
- Fall 2026 用途：只作課綱與版本變動對照；在學期完成前不得取代 canonical edition。
- 來源：官方 syllabus、lecture PDFs／notes、recitation worksheets／solutions、written homework、公開 notebooks。
- 限制：沒有完整公開 lecture video／transcript，正文不得虛構課堂口述、問答或講者語氣。

## 篇序

| order | 文章責任 |
|---:|---|
| 0 | 課程總覽：改制、先修、24 講、12 份作業、評量、版本與匿名限制 |
| 1 | Introduction |
| 2 | Heuristic Search |
| 3 | Adversarial Search |
| 4 | Constraint Satisfaction Problems |
| 5 | ML Problem Formulation |
| 6 | Decision Trees |
| 7 | Linear Regression |
| 8 | Optimization |
| 9 | Logistic Regression |
| 10 | Feature Engineering and Regularization |
| 11 | Neural Networks |
| 12 | Backpropagation |
| 13 | AI Alignment |
| 14 | Computer Vision and CNNs |
| 15 | Pre-training, Transfer Learning, and Fine-tuning |
| 16 | Maximum Likelihood and Probabilistic Modeling |
| 17 | MLE continued, NLP, Tokenization, and N-grams |
| 18 | Markov Chains, N-grams, and Sampling |
| 19 | Feature Learning and Word Embeddings |
| 20 | Attention, Transformers, and LLMs |
| 21 | Markov Decision Processes |
| 22 | Reinforcement Learning |
| 23 | Deep Reinforcement Learning |
| 24 | Monte Carlo Tree Search |
| 25 | 階段複習一：搜尋、CSP、監督式學習與 backpropagation |
| 26 | 階段複習二：AlexNet、transfer learning、GPT-2 與表示學習 |
| 27 | 階段複習三：RL、Deep Q-Learning、MCTS 與 AlphaZero |
| 28 | 全課結業路線：07-280 教會什麼、缺什麼，以及如何接 07-380／10-301 |

上表已依 Spring 2026 實際教材重建；Fall 2026 的新增或調序不混入 canonical edition。

## 每篇固定結構

1. 本篇對應的 official materials 與讀取完整度。
2. 這一講接續上一講的哪個問題。
3. 依 slides／notes agenda 完整展開。
4. recitation 或 written HW 如何測同一概念。
5. 數學／程式實作：至少一個可重做的推導或小例子。
6. `## 延伸：` 與舊 15-281／10-315、現代 AI 系統或站內文章的對照。
7. 校外讀者今晚能做的一個動作。

目標長度：中文每篇約 5,000–9,500 字元；大型作業篇可到 12,000，但超過前先檢查是否混入兩篇責任。

---

# C2 軌：CMU 10-301/601 完整課程導讀

## 系列定義

- zh-TW：`CMU 10-301 機器學習完整課程導讀`
- en：`Reading CMU 10-301 Machine Learning`
- canonical edition：Spring 2026；若後續匿名稽核證明 Fall 2025 的公開資產更完整，manifest 必須明列差異，不能默默混版。
- 來源優勢：27 講 slides／inked slides、readings、recitation handouts／solutions、9 份 HW starter、practice exams／solutions。
- 來源限制：Panopto、Piazza、Gradescope 與正式作業解答受限，不能做逐字課堂重建。

## 為什麼不機械拆成 27 篇

CS230 有逐講影片與 transcript；10-301 沒有匿名當期影片。若硬做一講一篇，只會把 slides 膨脹成散文。這門課改以**九份公開 homework**作為能力交付點，每篇完整覆蓋該 HW 前的 lecture、recitation 與 starter code。

## 篇序

| order | 文章責任 |
|---:|---|
| 0 | 課程總覽：10-301／601 同堂、先修、27 講、9 份作業與公開限制 |
| 1 | HW1 模組：數學／Python primer 與機器學習問題定義 |
| 2 | HW2 模組：decision trees 與資料切分 |
| 3 | HW3 模組：linear／logistic models 與最佳化 |
| 4 | HW4 模組：feature engineering、regularization 與 model selection |
| 5 | HW5 模組：neural networks 與 backpropagation |
| 6 | HW6 模組：probabilistic learning 與 sequence／language modeling |
| 7 | HW7 模組：margin、kernel 或 ensemble 主題，以當期 coursework 為準 |
| 8 | HW8 模組：unsupervised／representation 主題，以當期 coursework 為準 |
| 9 | HW9 模組：當期整合題、special topic 與全課能力總結 |

正式開寫前，必須讀完九份 handout／starter，將 order 1–9 的暫定主題替換成當期官方名稱。不能只按常見 ML syllabus 猜內容。

每篇必寫：相關 lecture agenda、recitation 解題方法、starter code 邊界、可本機完成的部分、缺少 hidden grader 後如何自我檢查。

---

# C3 軌：CMU 11-785 完整課程導讀

## 系列定義

- zh-TW：`CMU 11-785 深度學習完整課程導讀`
- en：`Reading CMU 11-785 Deep Learning`
- canonical edition：Spring 2026。
- 來源：28 講正式內容的 YouTube、slides、readings、course notes、bootcamp／recitation notebooks。
- Course Logistics 不獨立成篇，併入 order 0。
- 作業限制：HW1–4 多數進入 Piazza／Autolab；除非 handout、starter、data 全部匿名可得，不做假裝完整的作業解答篇。

## 篇序

| order | 官方講次／文章主題 |
|---:|---|
| 0 | 課程總覽：29 場課表、28 講內容、14 quizzes、算力與作業限制 |
| 1 | Introduction |
| 2 | Neural Nets as Universal Approximators |
| 3 | Training I：Learning and Empirical Risk Minimization |
| 4 | Training II：Gradient Descent |
| 5 | Training III：Backpropagation |
| 6 | Training IV：Convergence, Loss Surfaces, Momentum |
| 7 | Training V：Batch Size, SGD, and Second-order Methods |
| 8 | Training VI：Optimizers, Regularizers, BatchNorm, Dropout |
| 9 | CNNs I |
| 10 | CNNs II |
| 11 | CNNs III |
| 12 | CNNs IV |
| 13 | RNNs I |
| 14 | RNNs II |
| 15 | Seq2Seq and CTC |
| 16 | CTC Blanks and Beam Search |
| 17 | Language Models and Translation |
| 18 | Attention and Transformers |
| 19 | Transformers and Newer Architectures |
| 20 | Large Language Models |
| 21 | Representations and Autoencoders |
| 22 | Variational Autoencoders |
| 23 | Diffusion |
| 24 | Generative Adversarial Networks |
| 25 | Graph Neural Networks |
| 26 | Reinforcement Learning |
| 27 | Hopfield Networks |
| 28 | Boltzmann Machines |

每篇比照 CS230：標 lecture date、影片、slides、講者；agenda 完整覆蓋；公式與圖必須自行重算／重畫；文末才做現代模型延伸。

特殊風險：影片表與主頁的相對 slide URL 曾出現路徑差異。manifest 必須保存匿名實測後的 canonical URL，不從 HTML 字串直接拼網址。

---

# C4 軌：CMU 10-414/714 Deep Learning Systems 完整課程導讀

## 系列定義

- zh-TW：`CMU 10-414 深度學習系統完整課程導讀`
- en：`Reading CMU 10-414 Deep Learning Systems`
- 版本政策：目前網站混合 Fall 2026 schedule、舊 slides、2022 videos 與標示 2025 的 assignments。**不能稱為 Fall 2026 完整逐講系列。**
- 寫法：每篇以能對齊的 slides＋2022 video＋implementation notebook 為來源，標明各自年份；只做來源一致的主題模組。
- 作業現況：HW0–3 GitHub 連結曾於 2026-08-21 匿名測試回 404；修復前不寫成可執行完整作業。

## 篇序

| order | 主題模組 | 對應課程材料 |
|---:|---|---|
| 0 | 課程總覽與版本矩陣 | schedule、slides、2022 videos、assignments 狀態 |
| 1 | ML refresher and softmax regression | lectures 1–2 |
| 2 | Manual neural networks and backpropagation | lecture 3 |
| 3 | Automatic differentiation：原理與實作 | lectures 4–5 |
| 4 | Optimization and neural-network library abstractions | lectures 6–9 |
| 5 | Convolutional networks | lecture 10 |
| 6 | Hardware acceleration, linear algebra, and GPUs | lectures 11–13 |
| 7 | Convolution implementation | lecture 14 notebook |
| 8 | Sequence modeling and RNN implementation | lectures 15–16 |
| 9 | Transformers and autoregressive models | lectures 17–18 |
| 10 | Training large models | lecture 19 |
| 11 | Generative models：原理與實作 | lectures 20–21 |
| 12 | Customization, deployment, and the missing project layer | lectures 22–23＋project boundary |

學生 project presentations、Future Directions／Q&A 不獨立成篇：公開材料不足時只在 order 12 說明它們在正式課程中的角色。

每篇必寫：Needle 中這一層新增了什麼、抽象介面、資料流、local notebook 能做到哪裡、正式 `mugrade`／compute 缺口，以及與 PyTorch／JAX 類型系統的對照。

---

# 2. 共用研究 manifest

任何學校地圖或單課系列開寫前，都要建立 `.research/<date>-<slug>-manifest.md`。每一列至少有：

| 欄位 | 意義 |
|---|---|
| canonical semester | 本系列真正採用的學期 |
| lecture/module number | 官方講次或本文模組編號 |
| official title/date/instructor | 只能抄官方來源 |
| primary material | video／slides／notes／notebook／HW |
| source completeness | ✅ 全讀、🟡 部分、🔴 未讀 |
| access | anonymous／login／broken |
| edition | 每份材料自己的年份，禁止默認相同 |
| claims to verify | 人名、數字、歷史、論文、模型版本 |
| article status | research／draft／review／verified／published |

逐講系列額外要求：

- 影片必須取得 transcript 或完整觀看筆記；只有影片標題不能開寫。
- slides／notes 要按頁讀完，不用搜尋摘要代替。
- 有公式就重新推導；有數值例子就重算。
- 課堂引用論文時讀論文本身，不只轉述投影片。
- 公開 solution 只分析教學意義，不整份重製；未公開 solution 不尋找或引用非官方洩漏版。

# 3. 每篇 frontmatter 與內鏈

單課系列共同 tags 基底：

```yaml
tags: [cmu, ai-course, machine-learning, course-notes]
```

依主題替換 `machine-learning`，每篇維持 3–7 個 tags。

逐講文章：

```yaml
type: deep-dive
series:
  name: "<中文系列名>"
  order: N
additionalSeries:
  - name: "CMU AI／ML 課程"
    order: <只在確實需要第二入口時設定>
```

不預先建立空 series page。第一篇草稿完成、系列名稱鎖定後才修改 `src/utils/series.ts`。

內鏈固定模型：

```text
世界名校總入口
  → CMU 課程地圖
    → 新舊核心比較
      → 07-280／10-301／11-785／10-414 各自總覽
        → 逐講或模組文章
          → 站內對應技術實作
```

# 4. 發布順序

## Phase 0 — 來源 manifest，不寫正文

1. Harvard、Princeton、ETH、Toronto、Oxford／UCL 各一份 source matrix。
2. 07-280 Spring 2026 逐講 manifest，先解決首頁被 Fall 2026 覆寫的問題。
3. 10-301 九份 homework 與 27 講的對應表。
4. 11-785 影片／slides／notebook canonical URL 表。
5. 10-414 每份 slides、video、notebook、assignment 的版本矩陣與壞鏈重測。

## Phase 1 — 五篇地圖與 CMU 四篇課程總覽

建議順序：

1. Harvard（高辨識入口，先驗證「影片與作業同版」這個方法）。
2. Toronto（現行與歷史課程分層）。
3. ETH（歐洲第一張單校地圖）。
4. Princeton（來源較分散，放在方法穩定後）。
5. Oxford／UCL（最後才做雙校共同矩陣）。
6. CMU 新舊核心比較。
7. 07-280、10-301、11-785、10-414 四篇 order 0 總覽。

這一階段共 10 篇、20 個雙語 Markdown；若同批還要修改 registry、progress 或其他檔案，總檔數會超過 20，開工前必須取得批次授權。

## Phase 2 — 各系列 pilot

每個系列先做小批，驗證體裁再擴寫：

- 07-280：Lectures 1–4 已通過，並完成全系列。
- 10-301：HW1–2 模組。
- 11-785：Lectures 1–4。
- 10-414：Modules 1–2。

pilot review 問四件事：是否完整覆蓋、是否只在擴寫 slides、數學密度是否可讀、校外動作是否做得出來。未通過就先改模板，不往後量產。

## Phase 3 — 分批完成

- 每批最多 8 篇中文＋8 篇英文，保持在 20 檔以下並留 registry／progress 空間。
- 一門課完成一個自然單元後再切換，避免四系列同時留下大量半成品。
- 優先順序：07-280 → 11-785 → 10-301 → 10-414。
- 理由：07-280 承接剛完成的 CMU 地圖；11-785 來源最接近 CS230；10-301 與 10-414 需要先驗證非逐講拆法。

# 5. 驗收標準

## 學校地圖

- order 5–9 無缺號、重號，與 0–4 雙語名稱一致。
- 每篇最多詳寫 12 門課。
- 每條 prerequisite edge 有官方來源。
- 每門核心課完成 catalog、實際開課、教材、作業、code、solutions、recordings 七欄 audit。
- 只把 A2／A3 課程延伸成單課文章；A0 不得稱為公開課。
- CSDIY 只作歷史自學路線與社群經驗，不單獨支撐當期開課、授權或登入判斷。

## CMU 完整課程系列

- 每篇對應 manifest 中明確的一講或一個模組，沒有「泛談這個主題」的孤兒文章。
- 正文完整覆蓋官方 agenda；延伸段不替代任何原課內容。
- 每個外部數字、歷史說法、論文結論都回原始來源。
- 沒有影片的課不寫講者口述；混版材料逐項標年分。
- 每篇至少有一個可重做的推導、練習、notebook 動作或 starter-code 檢查。
- 不承諾校外讀者能使用 LMS、hidden grader、課內 GPU、助教或學分。
- 中文長文通過台灣用語與 register scan；英文不是逐句直譯。

## 每篇驗證

1. `pnpm check:references <zh> <en>`
2. `pnpm check:tw <zh>`
3. `pnpm check:lang-parity`
4. `pnpm check:series-order`
5. `post-review`：結構、重複、可讀性。
6. `post-verify`：外部事實、引文、版本與存取。
7. 每批最後跑唯一品質閘門 `pnpm verify`。

# 6. 已知風險與處理

| 風險 | 處理 |
|---|---|
| Fall 2026 頁面覆寫 Spring 2026 | manifest 保存 canonical direct URLs；標查核日，不假設永久可用 |
| 文章數膨脹成 174 檔 | 先 manifest、總覽、pilot；每批不超過 8 組雙語稿 |
| slides 被機械改寫成散文 | 沒影片者改用 HW／module 作交付點；每篇必須含推導或可執行動作 |
| 版本混寫 | 每份 material 都有 edition 欄；10-414 每篇正文標明影片／slides／notebook 年分 |
| 與站內 ML／RAG／agent 文章重複 | 課堂內容照樣完整寫；延伸只做交叉連結，不用重複當理由刪課 |
| 作業解答或 hidden tests 不公開 | 寫題目設計與 starter boundary，不猜解答、不引用洩漏 repo |
| 新學期發布後內容變動 | 已發布文章保留 canonical semester；新學期另做版本差異更新，不無聲換料 |

# 7. 下一個可執行批次

先不一次開 174 檔。下一批只做研究與兩篇示範：

1. 建立 Harvard source matrix，完成 CS50 AI／CS181／CS182 的版本與匿名存取核對。
2. 建立 07-280 Spring 2026 manifest，先重建 Lectures 1–4 的官方材料鏈。
3. 撰寫 Harvard 地圖中英文草稿。
4. 撰寫 07-280 order 0 課程總覽中英文草稿。
5. 07-280 已由 pilot 展開為完整 29 篇／58 檔系列，待整體審稿後再 commit。

這個批次的停止條件：兩份 research manifest、四個 Markdown 草稿、`post-review`／`post-verify` 無 blocking issue、`pnpm verify` 全綠；未經 review 不 commit。
