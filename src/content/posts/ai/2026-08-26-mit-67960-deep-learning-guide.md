---
title: "MIT 6.7960 導讀：一門課兩個官方版本——想修完走 2024 OCW，要最新內容讀 2025 投影片"
date: 2026-08-26
category: ai
type: guide
tags: [mit, ai-course, deep-learning, course-guide]
lang: zh-TW
series:
  name: "MIT 6.7960 導讀"
  order: 0
tldr: "[MIT 6.7960 Deep Learning](https://deeplearning6-7960.github.io/) 有兩個公開程度截然不同的官方版本：Fall 2025 課站 21 講投影片全公開但 psets 在 Gradescope、解答與錄影鎖在 Canvas（A2）；[MIT OCW 的 Fall 2024 版](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)連影片、五份作業題目與起始檔都開放（接近 A3）。兩版綱要重疊約六成，講師從 Isola／Bernstein 換成 Kaiming He／Omar Khattab，不能拿舊影片硬配新講義。本文給出按目的分流的兩條自學路線。"
description: "導讀 MIT 6.7960 Deep Learning 的兩個官方版本：Fall 2025 課站的 21 講投影片與免費教科書路線，MIT OCW Fall 2024 的錄影、五份作業與解答，以及按目的分流的兩條校外自學路線。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-26-mit-67960-deep-learning-guide-en)

[MIT 6.7960: Deep Learning](https://deeplearning6-7960.github.io/) 是 MIT EECS 的研究所級深度學習課，Fall 2025 由 [Sara Beery](https://beerys.github.io/)、[Kaiming He](https://people.csail.mit.edu/kaiming/) 與 [Omar Khattab](https://omarkhattab.com/) 三人合授。整學期的 21 講投影片每一份都以 Dropbox PDF 直接公開，每週 readings 排在 schedule 上，期末 project 的 [guidelines PDF](https://www.dropbox.com/scl/fi/mwqtppp1dlub9l0i75qyh/6_7960_Fall_2025_Project_Guidelines.pdf?rlkey=j07t54chig54yqzmnv9l47dlg&st=xeh3qw8j&dl=0) 也看得到。

但這不是一門全公開課。psets 從 [Gradescope](https://www.gradescope.com/courses/1110115) 發布、解答放在 [Canvas](https://canvas.mit.edu/courses/33933)，上課錄影同樣只在 Canvas——三樣都要 MIT 身分。按照本站[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)的四級標準，它是 **A2：教材部分開放**。不過故事沒有停在這裡：同一門課的 [Fall 2024 版上了 MIT OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)，影片與作業全部公開。所以「6.7960 能不能自學」的答案不是一句話，而是先選版本。

本文要回答四件事：這門課教什麼、三位講師怎麼分工、21 講的主題怎麼接起來，以及兩個版本各自能讓你走到哪裡。查證範圍是 Fall 2025 官方課站與 MIT OCW Fall 2024 的完整 schedule、grading 與 policies。我沒有逐份打開每個投影片 PDF 檢查內頁；以下對各講內容的描述來自官網自己的摘要文字。

## 先判斷它是不是你要的課

官方描述是「深度學習的基礎，理論與應用並重」：神經網路架構（MLP、CNN、RNN、graph nets、transformers）、反向傳播與自動微分、高維度的學習理論與泛化，再接到電腦視覺、自然語言處理和機器人。先修列得很硬：18.05（機率統計），外加 6.3720、6.3900 或 6.C01 擇一——進教室前你應該已經修過一門機器學習或演算法課。它是 3-0-9 學分的正式課；因為選課人太多，這學期連跨校註冊都不收。

跟[MIT 6.S191](/posts/ai/2026-08-21-mit-6s191-introduction-to-deep-learning)相比，定位完全不同。6.S191 是九週 bootcamp，廣度優先；6.7960 是整學期的主幹課，帶證明與理論。泛化理論、逼近論、資訊理論這些在 bootcamp 被跳過的東西，這裡各佔整整一講。如果你想要的是「理解為什麼」而不只是「會呼叫 API」，這門課的骨架值得走一遍。

評分結構也透露它的重心：5 個 psets 各佔 10%，合計一半；剩下的一半由 midterm 和期末 research project 對分。筆試兩小時、閉卷，只能帶一頁手寫筆記——這門課預期你把推導內化，不是查表。

## 三位講師，正好一人七講

21 講在三位講師之間均分，每人恰好七講。分工不是輪流代課，而是各自負責一條主線：

| 講師 | 主線 | 負責講次 |
|---|---|---|
| [Sara Beery](https://beerys.github.io/) | 工程基礎與部署 | 1–2、4、6、17–18、20 |
| [Kaiming He](https://people.csail.mit.edu/kaiming/) | 表示學習與生成模型 | 5、8、10、13–14、16、21 |
| [Omar Khattab](https://omarkhattab.com/) | 理論與基礎模型 | 3、7、9、11–12、15、19 |

Beery 拍板「怎麼把模型訓練起來、部署到真世界」：開場兩講的訓練基礎、CNN、Transformer、OOD 泛化、transfer learning，最後一堂 evaluation。He 負責「模型內部發生什麼」：序列建模、三種 representation learning、生成模型的四講，以及壓軸的 Applying Deep Learning to Your Problems。Khattab 承接理論與 LLM 一側：逼近理論、泛化理論，還有他本行的 neural information retrieval。foundation models 從 pre-training 到 post-training 三講，加上 inference-time algorithms，也都在他手上。

這個陣容本身就有故事。Kaiming He 是 ResNet 作者；Omar Khattab 是 [ColBERT](https://arxiv.org/abs/2004.12832) 與 DSPy 的作者。Fall 2024 這門課還由 Phillip Isola 與 Jeremy Bernstein 合授，換血之後課綱明顯往 LLM 與檢索靠——foundation models 三講和 inference-time algorithms 都是新的。

## 21 講的主題地圖

把 schedule 攤開，21 講可以切成六段：

| 段落 | 講次 | 內容 |
|---|---:|---|
| 地基 | 1–3 | DNN 積木、SGD／backprop／autodiff、universal approximation 到 Barron's theorem |
| 架構 | 4–6 | CNN（grid）、RNN／LSTM（memory）、Transformer（tokens、attention、positional codes） |
| 泛化與表示學習 | 7–10 | 泛化理論、重建式表示學習、相似度式（contrastive、InfoNCE）、資訊理論視角 |
| 基礎模型 | 11–12、15 | pre-training、scaling laws、post-training |
| 生成模型 | 13–14、16 | 生成基礎、VAE 與 GAN、diffusion 與 flows |
| 實務與部署 | 17–21 | OOD 泛化、transfer learning、inference-time algorithms、evaluation、實戰建議 |

三件事值得注意。第一，架構只佔三講：MLP、CNN、RNN、Transformer 各自被當成「同一組想法的變體」教，而不是逐一介紹熱門模型。第二，「泛化」出現兩次——第 7 講講理論，第 17 講講 distribution shift 與 robustness，理論面和工程面分開處理。第三，LLM 不是一門獨立講座，而是拆散成 pre-training、scaling laws、post-training、inference-time algorithms 四塊，嵌在整條深度學習主線裡。

中間穿插三場 guest lecture：Rose E Wang（OpenAI）、Zongyi Li（MIT/NYU）、Jiajun Wu（Stanford），沒有公開投影片。另有一次 PyTorch tutorial，[Colab notebook](https://colab.research.google.com/drive/1nZg9_wYpVYWS9xZAiSft5_gyluuQpBWY?usp=sharing) 是公開的，校外也能直接跑。

## 兩本免費教科書，就是你的錄影替身

錄影拿不到，readings 就成了校外自學的主力。好消息是這門課的 readings 大量對應免費教科書：

- [Foundations of Computer Vision](https://visionbook.mit.edu/)（Torralba、Isola、Freeman 著，MIT Press，全文免費線上閱讀）。required readings 多數出自這裡：第 1 講配 neural networks 章；第 2 講配 gradient-based learning 與 backpropagation 兩章；CNN 與 Transformer 也各有一章對應。
- [Understanding Deep Learning](https://udlbook.github.io/udlbook/)（Simon Prince 著，免費 PDF）。官網原話稱它是「probably the best textbook devoted entirely to deep learning」。課站沒有逐講指定章節，但 UDL 的 inference、diffusion、transformer 各章剛好補上 visionbook 不深談的部分。
- 想複習機器學習基礎，官網另外指向 [6.390 的公開 notes](https://introml.mit.edu/notes/?fbclid=PAQ0xDSwMxDVNleHRuA2FlbQIxMAABp0r1wjiBU7px9Kf6ziMGCn6NGB3GhTW-QhmDeMG5oCD9T6qAQW5ItdrbpohF_aem_jL3v0-a5F6jpmw5iOtA7Aw)。

optional readings 同樣認真：

- 泛化理論一講列了 [Understanding deep learning requires rethinking generalization](https://arxiv.org/abs/1611.03530)。
- pre-training 一講列了 GPT-3 論文 [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165) 與開源模型的 OLMo 2。
- scaling laws 一講配 [Kaplan et al.](https://arxiv.org/abs/2005.10242) 加上 [Chinchilla](https://arxiv.org/abs/2203.15556)，還附了「emergent abilities 是不是海市蜃樓」的正反兩篇。

這些全是公開連結，等於一份策展過的深度學習必讀清單。

自學時的做法很直接：把官網 schedule 當課綱，每講先讀 required readings 再開投影片，投影片裡看不懂的推導回到教科書對應章節重算。UDL 作者還提供全套 [notebook](https://github.com/udlbook/udlbook)，公式看不懂可以直接跑程式驗證。

## 作業鏈的缺口，明確列出

這是 A2 與 A3 的分界線，逐項寫清楚（以 Fall 2025 課站為準）：

| 項目 | 狀態 | 說明 |
|---|---|---|
| 21 講投影片 | 公開 | Dropbox PDF 直連 |
| 每週 readings | 公開 | 教科書章節免費、論文在 arXiv |
| Project guidelines | 公開 | 含評分方向與分組規則 |
| PyTorch tutorial | 公開 | Colab notebook 可直接執行 |
| psets 題目 | 不公開 | 經 Gradescope 發布，需課程邀請 |
| psets 解答 | 不公開 | 連結指向 Canvas 檔案 |
| 上課錄影 | 不公開 | Canvas 外部工具，僅限選課生 |
| 助教、office hours、回饋 | 不公開 | 課內環境 |

project 是唯一「校外能做完整版」的評量。[guidelines PDF](https://www.dropbox.com/scl/fi/mwqtppp1dlub9l0i75qyh/6_7960_Fall_2025_Project_Guidelines.pdf?rlkey=j07t54chig54yqzmnv9l47dlg&st=xeh3qw8j&dl=0) 明確要求新穎的實驗與視覺化呈現、至多三人一組，而且課程提供 Google Colab Pro、明言不要規劃大算力——「be creative」。這個設計對自學者非常友善：一個小而乾淨的研究問題，比堆 GPU 時數更符合課程期待。

順帶一提它的 [AI 使用政策](https://deeplearning6-7960.github.io/#AI_policy)：對 ChatGPT 等 AI 助手的規定與對人類助理完全相同——歡迎問概念、不許代寫，用了要在作業開頭聲明。這門課把「玩懂 AI 能做什麼、不能做什麼」當成課程內容的一部分，政策寫得比多數課程誠實。

遲交政策也有參考價值：超過期限最多收 7 天，分數乘以 (1−n/14)，每人自動豁免十天罰則額度。這套設計假設生活會出狀況，不用逐案求情。

## 校外自學路線

承認缺口之後，能走的路其實很清楚。我的建議是把「讀完」換成「做出」：

1. **先測水溫**：打開 PyTorch tutorial 的 Colab，不看解答完成第一個 cell 區塊。卡住就先回去補 6.390 notes，不要硬闖。
2. **選一條路線再動工**：要影片和作業就走 OCW Fall 2024（見下方分流表）；只追最新課綱才留在 2025 投影片。不要兩版來回混著走。
3. **以教科書為主、投影片為輔**：前三週照 readings 讀 visionbook 的 learning 部分（gradient-based learning、backpropagation、neural networks 三章），搭配第 1–3 講投影片。每讀完一章，在白紙上重推一次關鍵式子。
4. **練習用真題**：走 2024 路線直接做 OCW 的五份作業；留在 2025 路線的人，可以借用 OCW 對應主題的 pset 當練習，或像讀完 backprop 後用 NumPy 對一層 network 做 finite-difference gradient check——這不能冒充正式 pset，但足以驗證你有沒有真的懂。
5. **foundation models 四講配論文讀**：這段是 2025 新增的課綱重心，optional readings 的 GPT-3、OLMo 2、Kaplan、Chinchilla 就是正文材料。
6. **期末做一個 mini project**：按 guidelines 的精神選一個能在免費 Colab 上跑完的小問題，寫成像 Distill 那樣的分析文章。這是唯一能完整重現的評量環節。

節奏上，正式課走 15 週；校外自學抓 12 週比較現實，因為你沒有 office hours，卡住的時間要自己吸收。

## 一門課，兩個官方版本：按目的分流

[MIT OCW 的 Fall 2024 版](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)補掉了 Fall 2025 的大部分缺口——但先說清楚：**這不是同一門課的錄影版**。兩版綱要重疊約六成，差異集中在換講師就換掉的進階主題：

| | Fall 2024（OCW） | Fall 2025（課站） |
|---|---|---|
| 講師 | Isola、Beery、Bernstein | Beery、**Kaiming He、Omar Khattab** |
| 評分 | psets 65% ＋ project 35%，無期中考 | psets 50% ＋ midterm 25% ＋ project 25% |
| 獨有內容 | graph nets、optimization scaling rules、metrized deep learning | foundation models 三連講（pre-training／scaling／post-training）、diffusion and flows 獨立成講、evaluation |

OCW 版公開的東西很完整：

- [Lecture videos](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/video_galleries/lecture-videos/)：全學期錄影
- [Homework](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/lists/homework/)：HW1–5 題目 PDF，HW3／HW4／HW5 附 LaTeX 起始檔，**HW5 有官方解答**
- [Final project ideas](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/pages/project-ideas/) 與 [grading rubric](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/pages/final-project-grading-rubric/)：Fall 2025 只有一份 guidelines PDF

所以「6.7960 能不能自學」變成一張分流表：

**路線 A：想完整修完一門課 → 走 OCW Fall 2024。** 影片對應自己的作業，題目做得下去、HW5 還能對解答。代價是內容停在 2024：沒有 post-training、沒有 He 的生成模型視角，graph nets 反而比新版多。

**路線 B：要最新內容 → 讀 Fall 2025 投影片 ＋ 免費教科書。** foundation models 三連講和 diffusion 是 2025 才有的課綱重心。代價是無影片無作業，練習只能借用 OCW 對應主題的 pset——用之前先對照兩版 schedule，確認主題真的接得上。

我的建議是主線走 A：把五份作業做完，走到 generative models 段落之後切去 B 讀新投影片補 foundation models 那段。兩版重疊的主幹看 A 就夠，不用來回跳。

站上相關背景可搭配[MIT AI／ML 課程地圖](/posts/learning/2026-08-21-mit-ai-ml-course-map)與[CMU 11-785 導讀](/posts/ai/2026-08-22-cmu-11785-course-overview)一起看：前者解釋 6.7960 在 MIT 課程階梯的位置，後者是另一門「講授公開、作業封閉」的同型課。

## 小結

6.7960 的自學答案取決於你要什麼。走 OCW Fall 2024，你拿到的是接近 A3 的完整包——影片、五份作業、起始檔、一份解答、project rubric；讀 Fall 2025 投影片，你拿到最新的 foundation models 課綱，但要自己造練習。兩版都公開了策展過的 readings 和免費教科書路線，也都不給你 office hours 和 MIT 的學分。先選版本，再開第一份作業。

## 參考資料

- [MIT 6.7960 Deep Learning, Fall 2025 課程官網](https://deeplearning6-7960.github.io/) — 21 講 schedule、grading、policies 與所有公開連結的原始出處
- [6.7960 Fall 2025 Project Guidelines PDF](https://www.dropbox.com/scl/fi/mwqtppp1dlub9l0i75qyh/6_7960_Fall_2025_Project_Guidelines.pdf?rlkey=j07t54chig54yqzmnv9l47dlg&st=xeh3qw8j&dl=0) — 期末 project 要求、分組與算力建議
- [PyTorch Tutorial Colab](https://colab.research.google.com/drive/1nZg9_wYpVYWS9xZAiSft5_gyluuQpBWY?usp=sharing) — Week 2 官方 tutorial notebook
- [Foundations of Computer Vision](https://visionbook.mit.edu/)（Torralba、Isola、Freeman）— 多數 required readings 的來源教科書，全文免費線上
- [Understanding Deep Learning](https://udlbook.github.io/udlbook/)（Simon Prince）— 官網推薦的免費深度學習教科書
- [6.7960 Fall 2024 課站](https://phillipi.github.io/6.7960/) — Isola／Bernstein 時期的課綱與投影片
- [MIT OCW：6.7960 Fall 2024](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/) — 公開錄影與完整作業的歷史版本
- [OCW Fall 2024 Homework](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/lists/homework/) — HW1–5 題目、HW3–5 起始檔與 HW5 官方解答
- [OCW Fall 2024 Lecture Videos](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/video_galleries/lecture-videos/) — 全學期公開錄影
- [OCW Fall 2024 Final Project Ideas](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/pages/project-ideas/) 與 [Grading Rubric](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/pages/final-project-grading-rubric/)
- [6.s898 Fall 2023 課站](https://phillipi.github.io/6.s898/index.html) — 更早的課程版本
- [6.390 Intro to ML 公開 notes](https://introml.mit.edu/notes/) — 官網指定的 ML 基礎複習材料
- [Understanding deep learning requires rethinking generalization（arXiv:1611.03530）](https://arxiv.org/abs/1611.03530) — 第 7 講 optional reading
- [Language Models are Few-Shot Learners（GPT-3，arXiv:2005.14165）](https://arxiv.org/abs/2005.14165) — 第 11 講 optional reading
- [Scaling Laws for Neural Language Models（arXiv:2005.10242）](https://arxiv.org/abs/2005.10242) — 第 12 講 optional reading
- [Training Compute-Optimal LLMs（Chinchilla，arXiv:2203.15556）](https://arxiv.org/abs/2203.15556) — 第 12 講 optional reading
- [ColBERT（arXiv:2004.12832）](https://arxiv.org/abs/2004.12832) — 講師 Khattab 的代表作，第 9 講相關
- 站內：[世界名校 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map) — A0–A3 公開程度分級的定義
- 站內：[MIT AI／ML 課程地圖](/posts/learning/2026-08-21-mit-ai-ml-course-map) — 6.7960 在 MIT 課程階梯中的位置
