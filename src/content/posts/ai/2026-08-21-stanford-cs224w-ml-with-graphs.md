---
title: "Stanford CS224W 導讀：作業全在 Colab 上，但最大一塊分數自學者拿不到"
date: 2026-08-21
category: ai
type: deep-dive
tags: [cs224w, ai-course, stanford, graph, knowledge-graph, graphrag]
lang: zh-TW
series:
  name: "Stanford CS224W 導讀"
  order: 1
additionalSeries:
  - name: "Stanford CS 主線課程導讀"
    order: 15
tldr: "CS224W 的六份 Colab 現在全部可以直接下載開跑，第一份只用 NetworkX，連 PyG 都不用裝。但期末考佔 35%，是全課最大一塊，而它是閉書實體考。公開錄影停在 2021 年，涵蓋不到現在課表後半的 graph transformer、關聯式深度學習與 LLM+GNN。"
description: "Stanford CS224W: Machine Learning with Graphs 完整導讀——兩份官方頁面對先修條件的說法不一致、課程簡介比實際課表舊八年、六份 Colab 的實際依賴與硬體需求、學生專案為什麼是公開的 Medium 文章，以及自學者逐項拿得到什麼。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-21-stanford-cs224w-ml-with-graphs-en)

[CS224W: Machine Learning with Graphs](https://web.stanford.edu/class/cs224w/) 是 Stanford 電腦科學系的 3–4 學分課，Jure Leskovec 開的，只在秋季開，教室是 NVIDIA Auditorium。它教的是「當你的資料是關係而不是列表時，怎麼做機器學習」。內容涵蓋節點嵌入、圖神經網路（GNN）、graph transformer、知識圖譜推理，還有最近兩年新加的一整塊：直接在關聯式資料庫上做深度學習。

這門課在中文圈的名聲多半來自 2021 年那套 YouTube 錄影。錄影還在，也還很好，但它跟現在的課表已經對不上了。2021 年的第四堂是 PageRank；現行課表十九堂裡，沒有一堂的標題出現這個字。

這篇是把 2025 年秋季（Aut2526）的一手材料逐份讀過之後寫的。材料包括課程官網、`info.html` 的評分與誠信條款、三份作業 PDF、六份 Colab notebook（全部下載開過）、專案說明文件，以及三堂關鍵課的投影片。**不包含**論文精讀，也不包含 Canvas 後面的東西——那些我拿不到，下面會逐項講清楚。

## 這門課的硬事實

授課者是 [Jure Leskovec](https://profiles.stanford.edu/jure-leskovec)，Stanford 電腦科學系教授，做過 Pinterest 的 Chief Scientist。2025 年秋季有一位客座講師 Charilaos Kanatsoulis 共同掛名，投影片封面上兩人並列。

課只在秋季開。[ExploreCourses 的 2026-27 條目](https://explorecourses.stanford.edu/search?q=CS+224W&view=catalog)顯示下一次是 2026 年秋季，上課時段與教室跟 2025 年一模一樣。學分 3–4，可以選 Letter 或 Credit/No Credit。詳細班號與日期收在附錄。

課程官網對校外人士的態度寫得很直白：

> "The lecture slides and assignments will be posted online as the course progresses. We are happy for anyone to use these resources, but we cannot grade the work of any students who are not officially enrolled in the class."

也就是說：材料開放，評分不開放。錄影則明講「available on Canvas for all the enrolled Stanford students」——當屆錄影是鎖的。

想付費修的話有兩條路，兩條現在都寫著 Enrollment Closed：AI Professional Program 裡的 XCS224W，以及研究生學分的 CS224W（金額見附錄）。

## 兩份官方頁面對先修的說法不一樣

這門課「門檻低」的印象是真的，但你查到的門檻取決於你打開哪一頁——而兩頁不一致。

[Stanford Bulletin 的 CS224W 條目](https://bulletin.stanford.edu/courses/1058241)與 ExploreCourses 用的是同一句：`Prerequisites: CS109, any introductory course in Machine Learning.`

課程官網自己的 Prerequisites 那一區完全沒提機器學習課，而且把機率寫成非必要：

> "Knowledge of basic computer science principles, sufficient to write a reasonably non-trivial computer program (e.g., CS107 or CS145 or equivalent are recommended) / Familiarity with the basic probability theory (CS109 or Stat116 are sufficient but not necessary) / Familiarity with the basic linear algebra (any one of Math 51, Math 103, Math 113, or CS 205 would be much more than necessary)"

三條全是「recommended」「sufficient but not necessary」「much more than necessary」的語氣，沒有一條是硬性的。第一堂投影片的說法也是這一版：課程「self-contained」，難的地方在覆蓋面而不是單一主題的深度。**課程沒有說明為什麼兩份官方文件不一致。**

拿旁邊的課對照才看得出這是什麼位置。[CS224N](https://explorecourses.stanford.edu/search?q=CS224N&view=catalog) 的目錄先修是「calculus and linear algebra; CS124, CS221, or CS229」，必須先修完一門指定的 200 級課。同樣是 Leskovec 開的 [CS246: Mining Massive Data Sets](https://explorecourses.stanford.edu/search?q=CS246&view=catalog) 則是「At least one of CS107 or CS145」。後者比 CS224W 的目錄版更低，卻剛好跟 CS224W **官網版**的第一條一樣。

實務上的意思是：如果你有 PyTorch 經驗、線性代數沒忘光，官網那份清單你已經滿足了。

## 課程簡介停在 2018 年

目錄和官網共用的那段「Topics include」列了六項：representation learning and Graph Neural Networks、algorithms for the World Wide Web、reasoning over Knowledge Graphs、**influence maximization**、**disease outbreak detection**、social network analysis。

這段字從 [2021 年的封存站](https://snap.stanford.edu/class/cs224w-2021/)、[2024 年封存站](http://snap.stanford.edu/class/cs224w-2024)、現行官網一路到 2026-27 目錄，一字未改。但課表對不上：

- [2018 年秋季](http://snap.stanford.edu/class/cs224w-2018/)確實有整堂的 Influence Maximization in Networks 和 Outbreak Detection in Networks，也有 Link Analysis: PageRank。
- 2021 年秋季 PageRank 還在（第四堂），另外兩個主題已經沒有專堂。
- 2025 年秋季十九堂裡，三個主題一個都沒有。

換句話說，你在目錄上讀到的三個賣點，最後一次真的以整堂形式出現是八年前。課程網站沒有解釋這段描述為什麼沒跟著更新。

**如果你是衝著社群網路分析或傳播模型來的，這門課現在不教那個了。** 現在的重心是 GNN 的表達能力理論、graph transformer，以及關聯式深度學習。

## 十九堂課的重心在哪

第一堂的自我介紹列得很清楚：節點嵌入（DeepWalk、node2vec）→ GNN（GCN、GraphSAGE、GAT）→ Graph Transformers → 知識圖譜與推理（TransE）→ 圖的生成模型（GraphRNN）→ Relational Deep Learning → GNN + LLMs。

其中「Relational Deep Learning」（RDL）佔了兩整堂，是舊錄影完全沒有的一塊。它的問題設定是：企業的資料本來就躺在多張互相有外鍵的資料表裡，傳統做法是資料科學家手寫 SQL 把它壓成一張特徵表，再餵給 XGBoost。

第 12 堂的投影片拿一個 Stack Exchange 的「使用者六個月後還活躍嗎」任務做對照，找了一位五年年資的資料科學家實際實作一遍，記錄下手工路線要寫**約 682 行程式碼**。RDL 路線的對照數字放在同一張投影片上，收在附錄。

支撐這塊的是 [RelBench](https://relbench.stanford.edu/)，Stanford 自己出的關聯式資料庫 benchmark，投影片上明講它「Load as a PyG graph」。

## 作業長什麼樣

課程作業分兩軌，[官方 info 頁](https://web.stanford.edu/class/cs224w/info.html)寫得很細：

| 項目 | 佔比 | 形式 | 自學者拿得到嗎 |
|---|---|---|---|
| 3 份 Homework | 20% | 純書面推導，PDF 公開 | 題目拿得到，解答拿不到 |
| 5 份 Colab（外加 Colab 0） | 15% | 寫程式，notebook 公開 | notebook 拿得到，自動評分拿不到 |
| Exam | 35% | 兩小時閉書實體考 | **完全拿不到** |
| 課程專案 | 30% | 部落格文 + Colab 或 PR | 可以自己做，範例全公開 |

**分水嶺是考試那一格。** 它是四項裡最大的一塊，比三份作業加五份 Colab 加起來還多，而它是一場兩小時的實體閉書考，只能帶兩張雙面小抄。範圍是第 1 到 16 堂；第 17 堂在考試隔天才上，不算在內。

三份書面作業的難度曲線可以從 PDF 直接讀出來：

- **[Homework 1](https://web.stanford.edu/class/cs224w/homework/CS224W_Aut2526_HW1.pdf)**（11 頁）：GNN 表達能力、隨機漫步矩陣、over-smoothing、用 GNN 學 BFS；接著是節點嵌入與矩陣分解的等價性；最後一節 GCN。
- **[Homework 2](https://web.stanford.edu/class/cs224w/homework/CS224W_Aut2526_Homework_2.pdf)**（7 頁）：把 GIN 與 GraphSAGE 的更新式改寫到鄰接矩陣的特徵向量基底上，再做 TransE 與 RotatE 的表達能力分析。
- **[Homework 3](https://web.stanford.edu/class/cs224w/homework/CS224W_Aut2526_Homework_3.pdf)**（8 頁）：證明加了鄰接遮罩的自注意力等價於訊息傳遞、Laplacian 特徵向量位置編碼的強項與限制、LightGCN，以及 RDL 的計算圖。

三份都是推導題，沒有一份要你交程式碼跑出來的數字。真正動手的部分全在 Colab。

## 六份 Colab，全部可以直接下載開跑

這是本篇對自學者最實用的一段。Colab 0 到 5 的連結全掛在課程官網的課表上，我逐份用 Google Drive 的匯出網址抓下來，六份**全部**回 200 並拿到完整的 `.ipynb`——不需要 Stanford 帳號。內容是這樣：

| Colab | 主題 | 主要函式庫 | notebook 標記需要 GPU |
|---|---|---|---|
| 0 | 環境熟悉（不用交） | — | — |
| [1](https://colab.research.google.com/drive/1cNsHg6NClQyZiQEgRDCKoqofiik3y1XN) | 空手道社網路、PageRank 一次迭代、負邊取樣、node2vec | NetworkX + PyTorch | 否 |
| [2](https://colab.research.google.com/drive/1DqySwyevHcM7OE1Sh3xWGyKD0Jcr95R5) | PyG 資料結構、ENZYMES、ogbn-arxiv 節點分類 | PyG + OGB | 否 |
| [3](https://colab.research.google.com/drive/11F8K9lnVlGRNOeFWfyfeOim0NdxOdtae) | 自己刻 MessagePassing 層、GraphSAGE | PyG + DeepSNAP | 否 |
| [4](https://colab.research.google.com/drive/1AaNEIaIZhRNMueJDdrnNLdwiYuwwfFP9) | GAT 與多頭注意力 | PyG | 是 |
| [5](https://colab.research.google.com/drive/1S6LFPJxYHtBkWFgA4Yc5E173y59_rWpl) | 異質圖、DeepSNAP HeteroGraph、節點屬性預測 | DeepSNAP + PyDrive | 是 |

三個值得先知道的細節。

**Colab 1 完全不碰 PyG。** 它只用 NetworkX 和 PyTorch，也沒標 GPU，任何筆電都跑得動。這在整個 Stanford 課程系列裡是少見的起點——多數課的第一份程式作業就已經要你裝一整套。

**Colab 4 和 5 的 notebook metadata 標了 `"accelerator": "GPU"`**，但 Colab 免費層就給得起，這仍然不需要自備顯示卡。

**環境有時效風險。** 這幾份 notebook 把 torch 釘在 `2.4.0`，而且從 `git+https://github.com/snap-stanford/deepsnap.git` 直接裝 DeepSNAP。DeepSNAP 這個 repo 最後一次推送是 2025 年 11 月（在該學期進行中），[PyG 本身](https://github.com/pyg-team/pytorch_geometric)則是持續在動的。裝不起來的時候，先懷疑釘住的 torch 版本。

另外，notebook 裡到處是 `if 'IS_GRADESCOPE_ENV' not in os.environ:` 的保護判斷——這些 cell 在 Gradescope 的自動評分環境裡會被跳過。**你可以跑，但沒有評分器告訴你對不對。**

## 學生專案的最終產物是公開的部落格文

這是這門課最反常的一件事，而它剛好對自學者有利。

[專案說明文件](https://docs.google.com/document/d/1ffP5UGHRovHix4mBXweui62cj4L4sxib/edit)是公開可讀的，我用純文字匯出讀完。它開宗明義說專案目標是「create long-lasting resources for both your technical profiles and the graph machine learning community at large」。三種可選形態，全部以公開產出收尾：

1. **GNN 的真實應用**：部落格文 + Google Colab
2. **PyG 功能教學**：部落格文 + Google Colab
3. **前沿論文實作**：部落格文 + 一個送進 PyG `contrib` 套件的 pull request

三種都要交部落格文，最後會發到課程自己的 [Medium 專頁](https://medium.com/stanford-cs224w)上。那個專頁現在是活的，上面有一整批 Fall 2025 的專案文，發表日期落在專案報告截止日前後。題目從 EEG 癲癇時長預測、航班延誤、電網機組排程到知識圖譜問答都有，每篇標示的閱讀時間多在十五分鐘以上。

**所以這門課的分佈跟常態相反**：錄影鎖在 Canvas，但學生最深入的產出——含完整 Colab、可重現——是公開的。文件裡對寫作的要求也很具體，包括假設讀者「are familiar with machine learning (e.g., CS229)」但「are not familiar with graph ML」，以及要求附上「Link to your Google Colab that can be used to reproduce your results」。

還有一條 1–3% 的加分：對 OGB、PyG 或 GraphGym 送出被接受的 pull request。

## 哪些公開資源真的跟這門課綁在一起

Leskovec 名下的公開資源很多，但不是每一項都跟 CS224W 有關。逐項對過之後是這樣：

**綁得很緊的**：

- **[PyG（PyTorch Geometric）](https://pytorch-geometric.readthedocs.io/)**。第一堂投影片稱它「The ultimate library for Graph Neural Networks」，Colab 2 之後全部用它，專案的三種形態也全部繞著它。Leskovec 的 Stanford 個人頁寫著他「co-authored PyG, the most widely-used graph neural network library」。
- **[Open Graph Benchmark（OGB）](https://ogb.stanford.edu/)**。專案文件裡的建議資料集大半是 `ogbn-arxiv`、`ogbn-products`、`ogbl-collab`、`ogbl-ddi` 這一系列，Colab 2 直接 `import ogb`。[OGB 論文](https://arxiv.org/abs/2005.00687)（arXiv:2005.00687）的作者列表最後一位就是 Leskovec。
- **GraphGym**：第一堂投影片明列為建議工具，也在加分 PR 的名單裡。
- **[DeepSNAP](https://github.com/snap-stanford/deepsnap)**：Colab 3 和 5 直接從 GitHub 安裝。
- **[SNAP 資料集](https://snap.stanford.edu/data/)**：歷屆課程網站就掛在 `snap.stanford.edu` 底下，專案文件的蛋白質交互作用那一項也直接連到 SNAP 的 biodata。
- **[RelBench](https://relbench.stanford.edu/)**：第 12 堂的主角。

**沒綁在一起的**：Leskovec 自己的教科書《Mining of Massive Datasets》（與 Rajaraman、Ullman 合著）掛在他的[教學頁](https://cs.stanford.edu/~jure/teaching.html)上，但那是 CS246 的書，**CS224W 的建議讀物裡沒有它**。CS224W 官網列的三本全是別人寫的：[Graph Representation Learning](https://www.cs.mcgill.ca/~wlh/grl_book/)（William L. Hamilton，第一堂唯一點名的那本）、[Networks, Crowds, and Markets](http://www.cs.cornell.edu/home/kleinber/networks-book/)、[Network Science](http://networksciencebook.com/)。三本都可以免費線上讀。

## LLM 時代的位置：課程有講，而且是兩整堂

這題的答案是明確的「有」，而且可以指到具體投影片。

**第 16 堂「LLM + GNN」** 講的是 GraphRAG 的兩個方向。

「GNN 餵給 LLM」那一路走的是 [G-retriever](https://arxiv.org/abs/2402.07630) 的四步流程：LLM 編碼查詢 → 從知識圖譜取出相關子圖並用 GNN 編碼 → 把兩個嵌入合起來 → LLM 解碼生成答案。子圖檢索用 KNN 加 n-hop 鄰居先撈，再用 Prize-Collecting Steiner Tree 修剪。投影片上有一個 Neo4j 的案例研究：在 [STaRK Prime](https://stark.stanford.edu/) 上，PyG 的 GNN+LLM 方案把 Hit@1 翻了一倍，對照組與具體數字收在附錄。

反方向「LLM 餵給 GNN」則用 sentence transformer 把每個節點與邊的短語轉成特徵向量，再丟給 GNN 做節點分類。投影片也提到 PyG 2.7 釋出了 `TXT2KG`：拿 LLM 把非結構化文字抽成 (entity, relation, entity) 三元組。

**第 17 堂「Agents + Graphs」** 是 Shirley Wu 的客座，投影片自己標明「The first part is based on slides in CS224N and CS224R」——前半段是 LLM 訓練流程的補課，後半段才是本行：在半結構化知識庫上做檢索的 [STaRK](https://stark.stanford.edu/) benchmark，以及 AvaTaR。她給的關鍵結果是一句話：「For all methods, Hit@1 is below 18%.」

兩件事值得標出來。第一，這兩堂在課表上**沒有任何指定閱讀**，其他每一堂都有。第二，第 16 堂是考試前一天上的、在考試範圍內；第 17 堂是考試隔天上的、不在。課程頁面沒有說明這兩堂為什麼沒有閱讀清單。

## 自學者實際拿得到什麼

逐項來，這是本篇最該被存下來的一節。

**拿得到**：

- **十九堂的投影片 PDF**，全部掛在課程官網，沒有登入牆。
- **三份作業 PDF 與 LaTeX 模板**，含配分。
- **六份 Colab notebook**，可直接下載，不需要 Stanford 帳號。
- **每堂的建議閱讀**，幾乎全是 arXiv 或 openreview 的公開連結。
- **專案說明文件與評分 rubric**（兩份 Google Doc 都是公開可讀）。
- **學生專案成品**：Medium 專頁上的完整部落格文加可重現的 Colab。
- **2021 年的錄影**：Stanford Online 的 YouTube 頻道上有兩個 CS224W 播放清單，較大的那個 60 支，兩個都以同一支「2021 | Lecture 1.1 – Why Graphs」開頭。Leskovec 的教學頁也把這批影片標成對應「CS224W 2021 Syllabus」。

**拿不到**：

- **當屆錄影**（在 Canvas）。所以 graph transformer、關聯式深度學習、KG foundation models、LLM+GNN、Agents+Graphs 這五塊**只有投影片，沒有講解**。這是公開錄影與現行課表之間最大的缺口。
- **作業與 Colab 的自動評分**（Gradescope），也拿不到官方解答——課程明訂看往年解答是榮譽守則違規。
- **考試題目與 practice exam**（第 12 堂投影片提到會釋出，但釋出在 Ed 上）。
- **Ed 討論區**與辦公室時間。
- **助教專案 mentor**。

有一個灰色地帶值得一提：課程官網的課表上方有一行「Notes are available [here]」，指向的是 `archives.leni.sh` 這個第三方網域上的一份 13 MB PDF。它連得通，但它不在 `stanford.edu` 底下。

## 怎麼開始

**今晚就能做的一件事**：打開 [Colab 1](https://colab.research.google.com/drive/1cNsHg6NClQyZiQEgRDCKoqofiik3y1XN)，跑到 Question 3——「PageRank 跑一次迭代之後，節點 0 的值是多少」。它只需要 NetworkX，五分鐘之內會有數字。如果這一格對你來說是舒服的，這門課的前半段你修得動；如果卡住，先補線性代數而不是先補機器學習。

**接下來三步**，照課程自己的順序：

1. 讀第 1 到 6 堂的投影片，配 2021 年錄影的對應章節——這一段兩者重疊度最高。
2. 做 Colab 1 到 3，先不要碰 4 和 5。做完 Colab 3 你已經自己刻過一層 `MessagePassing`，這是這門課真正的分水嶺。
3. 從第 8 堂（Graph Transformers）開始，錄影就幫不上忙了。改成投影片配那一堂的建議閱讀原文，第 8 堂讀 [Graphormer](https://arxiv.org/pdf/2106.05234.pdf)、第 12 堂讀 [RelBench 論文](https://arxiv.org/pdf/2407.20060)。

**想要有人看你的東西**：專案的第三種形態（實作一篇論文成 PyG `contrib` 的 PR）不需要註冊這門課也能做，而且 PyG 是活的 repo。

## 附錄：數字與查證方式

- **學分與時段**：3–4 學分，只在秋季開。2026-27 秋季班號 2058，2026/09/22–2026/12/04，週二週四 15:00–16:20，NVIDIA Auditorium，Letter 或 Credit/No Credit。出處：ExploreCourses 2026-27 條目。
- **評分權重**：Homework 20%（三份各 6.67%）、Colab 15%（五份各 3%）、Exam 35%、Final Project 30%，Ed 參與另計加分。專案內部再拆成 proposal 13.33%、milestone 6.67%、report 80%，換算成總成績分別是 4%、2%、24%。出處：`info.html` 與專案說明文件。
- **遲交政策**：兩個 no-questions-asked 的 late period，每個 4 天，不適用於期末專案報告；用完之後每個 late period 扣 50%，超過一個 late period 不收。Gradescope 有 15 分鐘寬限期。
- **作業配分細節**：HW1 第一節 GNN Expressiveness 28 分、第三節 GCN 11 分（另有 3 分 BONUS 題）；HW2 三節分別 20、21、10 分；HW3 三節分別 20、13、15 分。三份都有 0 分的 Honor Code 節。
- **RDL 的對照數字**：第 12 堂投影片上，Stack Exchange 使用者活躍度預測任務，人工路線是「12 hours manual work / ~682 lines of code / 1hr model training」，RDL 路線是「<1 hour manual work / 54 lines of code / 1hr model training」。投影片標註工作量的定義是「the marginal effort to solve a new task」。這是投影片上的效率對照，**投影片上的這一組數字沒有同時給準確度對照**，不要把它讀成模型表現的比較。
- **STaRK 的 18%**：出自第 17 堂投影片的原文「For all methods, Hit@1 is below 18%」，指 STaRK benchmark 上所有受測的檢索增強方法與 LLM。
- **Neo4j 案例的 Hit@1**：第 16 堂投影片列出 .16→.32，資料集是 STaRK Prime。PyG 方案的組成是「LLAMA3.1-8B w/ LoRA + 10M param GAT」；對照組是 agentic GraphRAG 的 claude-3-opus（.18）與 gpt-4-turbo（.2）。這是投影片轉述的第三方案例，不是課程自己跑的實驗。
- **付費修課的金額**：AI Professional Program 個別報名 1,950 美元一門（XCS224W）；研究生學分的 CS224W 在 Stanford Online 標示學費 6,300 美元。兩者查詢當下皆為 Enrollment Closed，且 XCS224W 沒有列出開課日期，而同一頁上多門姊妹課有。**頁面沒有說明原因。**
- **DeepSNAP 與 OGB 的維護狀態**：查詢當下 GitHub API 顯示 `snap-stanford/deepsnap` 最後推送於 2025-11-24、`snap-stanford/ogb` 最後推送於 2025-05-06、`pyg-team/pytorch_geometric` 最後推送於 2026-08-17。兩個 repo 都沒有被標記為 archived。
- **未能確認的三項**：（1）Colab 0 的 Google Drive 連結回 200，但它是 Drive 的檢視頁而非 notebook，我沒有取得它的 cell 內容，上表因此留白；（2）Stanford Online 的兩個 YouTube 播放清單分別是 47 支與 60 支，但我沒有逐支比對確認兩者的差集是什麼；（3）第 16 堂投影片的講者未在投影片上具名，我沒有找到官方頁面說明那堂由誰主講，因此文中沒有寫講者姓名。

## 參考資料

- [CS224W: Machine Learning with Graphs 課程官網（Autumn 2025）](https://web.stanford.edu/class/cs224w/) — 十九堂課表、六份 Colab 連結、先修條件原文、建議讀物三本
- [CS224W Course Info](https://web.stanford.edu/class/cs224w/info.html) — 評分權重、閉書考規則、遲交政策、榮譽守則條款
- [CS 224W Project (Fall 2025) 專案說明文件](https://docs.google.com/document/d/1ffP5UGHRovHix4mBXweui62cj4L4sxib/edit) — 三種專案形態、Medium 發表流程、OGB/PyG/GraphGym 加分規則
- [CS224W Homework 1](https://web.stanford.edu/class/cs224w/homework/CS224W_Aut2526_HW1.pdf) — 證明第一份作業是純書面推導，並提供配分
- [CS224W Homework 2](https://web.stanford.edu/class/cs224w/homework/CS224W_Aut2526_Homework_2.pdf) — 特徵向量基底改寫、TransE/RotatE 表達能力
- [CS224W Homework 3](https://web.stanford.edu/class/cs224w/homework/CS224W_Aut2526_Homework_3.pdf) — graph transformer、LightGCN、RDL 計算圖
- [第 1 堂投影片：Introduction](https://web.stanford.edu/class/cs224w/slides/01-intro.pdf) — 課程自述涵蓋範圍、PyG 與 GraphGym 的定位、「self-contained」的說法
- [第 12 堂投影片：Relational Deep Learning](https://web.stanford.edu/class/cs224w/slides/12-RDL.pdf) — 682 行對 54 行的工作量對照、RelBench 定位
- [第 16 堂投影片：LLM + GNN](https://web.stanford.edu/class/cs224w/slides/Lecture16.pdf) — G-retriever 四步流程、Neo4j 案例、TXT2KG
- [第 17 堂投影片：Agents + Graphs](https://web.stanford.edu/class/cs224w/slides/2025-cs224w-lecture.pdf) — STaRK 的 Hit@1 低於 18%、AvaTaR、講者自述取材自 CS224N/CS224R
- [ExploreCourses：CS 224W](https://explorecourses.stanford.edu/search?q=CS+224W&view=catalog) — 2026-27 秋季開課、學分、目錄版先修條件
- [Stanford Bulletin：CS224W](https://bulletin.stanford.edu/courses/1058241) — 與 ExploreCourses 相同的先修句，以及它在哪些學位是必修
- [CS224W Fall 2018 封存站](http://snap.stanford.edu/class/cs224w-2018/) — 確認 Influence Maximization 與 Outbreak Detection 曾是整堂課
- [CS224W Fall 2021 封存站](https://snap.stanford.edu/class/cs224w-2021/) — 確認 2021 年課表仍有 PageRank，另兩個主題已不在
- [CS224W Fall 2024 封存站](http://snap.stanford.edu/class/cs224w-2024) — 確認課程簡介文字多年未改
- [Jure Leskovec 的 Stanford Profile](https://profiles.stanford.edu/jure-leskovec) — 「co-authored PyG」原文
- [Jure Leskovec 教學頁](https://cs.stanford.edu/~jure/teaching.html) — 公開影片對應 2021 syllabus；《Mining of Massive Datasets》歸在 CS246
- [Stanford CS224W Medium 專頁](https://medium.com/stanford-cs224w) — 確認學生專案成品確實公開，含 Fall 2025 那一批
- [Open Graph Benchmark](https://ogb.stanford.edu/) 與 [OGB 論文](https://arxiv.org/abs/2005.00687) — 確認 Leskovec 是共同作者、資料集與課程專案的對應關係
- [RelBench](https://relbench.stanford.edu/) — 第 12 堂的 benchmark 主體
- [Graph Representation Learning（Hamilton）](https://www.cs.mcgill.ca/~wlh/grl_book/) — 第一堂唯一點名的教科書，可免費線上讀
- [G-retriever 論文](https://arxiv.org/abs/2402.07630) — 第 16 堂 GraphRAG 流程的出處
- [STaRK benchmark](https://stark.stanford.edu/) — 第 16、17 堂共用的評估資料集
- [ExploreCourses：CS224N](https://explorecourses.stanford.edu/search?q=CS224N&view=catalog)、[CS246](https://explorecourses.stanford.edu/search?q=CS246&view=catalog) — 用來對照先修門檻的兩門鄰居課
- 站內：[Stanford CS 課程導讀地圖](/posts/learning/2026-08-20-stanford-cs-course-map)
- 站內：[Stanford CS329A 導讀](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents)
