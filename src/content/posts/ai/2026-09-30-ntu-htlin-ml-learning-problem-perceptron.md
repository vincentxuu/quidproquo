---
title: "林軒田機器學習基石導讀：學習問題、PLA 與學習的種類"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, perceptron]
lang: zh-TW
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 1
tldr: "基石前三講先把「機器學習」定義成一張流程圖：未知的目標函數 f 產生資料 D，演算法 A 從假說集合 H 挑出 g，希望 g ≈ f。接著用最簡單的 H（感知器）與 A（PLA）示範這張圖怎麼跑：資料線性可分時，PLA 的更新次數有 R²/ρ² 的上限；不可分時改用 pocket。第三講把學習問題依輸出、標籤、protocol、輸入四個軸分類，基石的主場是批次、監督式、具體特徵的二元分類或迴歸。練習用 Fall 2024 HW1 與 Fall 2026 hw1。"
description: "台大林軒田《機器學習基石》Lecture 1–3 導讀：機器學習的定義與三個使用條件、f／D／A／H／g 五個元件、感知器假說與 PLA、收斂保證 T ≤ R²/ρ² 的推導骨架、pocket 演算法、依輸出空間／標籤／protocol／輸入空間分類的學習類型，加上 Fall 2026 extended slides 的補充與 Fall 2024 HW1、Fall 2026 hw1 的對應題目。"
draft: false
glossary:
  - term: "linear separable"
    aliases: ["線性可分"]
    definition: "存在一個權重向量 w_f，讓每筆訓練資料都滿足 y_n = sign(w_fᵀx_n)，也就是一條直線（高維是超平面）能把正負例完全分開。"
    context: "PLA 保證會停下來的前提；基石 Lecture 2 的收斂證明只在這個條件下成立。"
  - term: "pocket algorithm"
    aliases: ["pocket 演算法"]
    definition: "PLA 的變形：照常修正錯誤，但另外把目前看過錯誤最少的權重存在「口袋」裡，跑完固定迭代次數後回傳口袋裡的權重。"
    context: "基石 Lecture 2 用來處理不可分或有雜訊的資料。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-htlin-ml-learning-problem-perceptron-en)

這一篇是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)系列的第 1 篇，對應[機器學習基石](https://www.csie.ntu.edu.tw/~htlin/mooc/)的 Lecture 1–3，也就是四大問題裡的第一個「When Can Machines Learn?」的前三講。

這三講回答兩件事：機器學習問題由哪些元件組成，以及最簡單的學習演算法長什麼樣。讀完你應該能自己寫出 PLA，並說出一個問題屬於哪一類學習。「PLA 學到的線，在沒看過的資料上也對嗎？」這個問題留給[第 2 篇](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning)。

**本文依據**：MOOC 投影片 [01](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/01_handout.pdf)、[02](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/02_handout.pdf)、[03](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/03_handout.pdf) handout；[Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)的 W2–W3 課前必看清單與 extended slides [01e](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/01e_handout.pdf)、[02e](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/02e_handout.pdf)、[03e](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/03e_handout.pdf)；[Fall 2024 HW1](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw1/hw1_red.pdf) 與 [Fall 2026 hw1](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/hw1.pdf)。全部在 2026-09-30 打開核對。

## 課程影片來源

以下沿用本文已列出的課程影片來源；尚未逐支重新驗證可播放狀態，不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=nQvpFSMPhr0
title: Course Introduction
```

```youtube
url: https://www.youtube.com/watch?v=sS4523miLnw
title: What is Machine Learning
```

原始影片：[Course Introduction](https://www.youtube.com/watch?v=nQvpFSMPhr0)、[What is Machine Learning](https://www.youtube.com/watch?v=sS4523miLnw)、[Applications of Machine Learning](https://www.youtube.com/watch?v=PveL3-fO_Qk)、[Components of Machine Learning](https://www.youtube.com/watch?v=pR1xsocj_Pw)、[Machine Learning and Other Fields](https://www.youtube.com/watch?v=vc2BimJ3XJA)、[Perceptron Hypothesis Set](https://www.youtube.com/watch?v=WlpF1Phkv28)、[Perceptron Learning Algorithm](https://www.youtube.com/watch?v=1xnUlrgJJGo)、[Guarantee of PLA](https://www.youtube.com/watch?v=Okrrz0IYoSE)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

## 這篇對應的教材

| 講 | 影片（YouTube，依 MOOC 小節） | LFD 章節（依 Fall 2026 課程頁） |
|---|---|---|
| L1 the learning problem | [Course Introduction](https://www.youtube.com/watch?v=nQvpFSMPhr0)、[What is Machine Learning](https://youtu.be/sS4523miLnw)、[Applications of Machine Learning](https://youtu.be/PveL3-fO_Qk)、[Components of Machine Learning](https://youtu.be/pR1xsocj_Pw)、[Machine Learning and Other Fields](https://youtu.be/vc2BimJ3XJA) | 1.0、1.1.1、1.2.4 |
| L2 learning to answer yes/no | [Perceptron Hypothesis Set](https://youtu.be/WlpF1Phkv28)、[Perceptron Learning Algorithm](https://youtu.be/1xnUlrgJJGo)、[Guarantee of PLA](https://youtu.be/Okrrz0IYoSE)、[Non-Separable Data](https://youtu.be/vT-mUeRJfys) | 1.1.2、3.1 |
| L3 types of learning | [Different Output Space](https://youtu.be/XyJQm4mvVUA)、[Different Data Label](https://youtu.be/8w1lDGaoFTI)、[Different Protocol](https://youtu.be/emLW7jLh-n0)、[Different Input Space](https://youtu.be/cIsgI7tktQM) | 1.2、1.3 |

共 13 支影片。Fall 2026 把 L1、L2 與 L3 第一支排在 W2 課前看，L3 後三支排在 W3。

## Lecture 1：機器學習是什麼

### 從「學習」到「機器學習」

L1 的定義很樸素：學習是從觀察累積經驗、得到技能；機器學習是從**資料**計算經驗，而技能指的是「改進某個表現指標」，例如預測準確率。所以投影片上的定義是：

> machine learning: improving some performance measure with experience computed from data

接著給了使用 ML 的場景：人沒辦法手寫程式（在火星上導航）、人很難定義答案（語音與影像辨識）、需要人做不到的快速決策（高頻交易）、要對大量使用者個別服務（精準行銷）。

### 什麼時候該用 ML：三個條件

投影片把這頁叫「Key Essence of Machine Learning」，用途是幫你判斷一個問題該不該用 ML：

1. 存在某種可以學的「潛在模式」，所以表現指標有改進空間。
2. 這個模式沒有容易寫成程式的定義，所以才需要 ML。
3. 手上有關於這個模式的資料，ML 才有東西可以學。

緊接著的 Fun Time 很好用來自我檢查：嬰兒下一次哭是不是在偶數分鐘（沒有模式）、判斷一張圖有沒有環（有程式定義）、核不核發信用卡（三個條件都滿足）、十年內地球會不會毀於核武誤用（沒有足夠資料）。答案是信用卡。

### 五個元件：f、D、A、H、g

L1 全課最重要的一張圖，是用信用卡核發問題畫出的學習流程：

| 符號 | 意思 | 信用卡例子 |
|---|---|---|
| x ∈ X | 輸入 | 申請人資料 |
| y ∈ Y | 輸出 | 核卡後是好客戶或壞客戶 |
| f: X → Y | 未知的目標函數 | 「理想的核卡公式」 |
| D = {(x₁,y₁),…,(x_N,y_N)} | 訓練資料 | 銀行的歷史紀錄 |
| H | 假說集合，候選公式的集合 | 「年薪超過 80 萬就核」「負債超過 10 萬就核」… |
| A | 學習演算法 | 從 H 裡挑一個 |
| g | 最後的假說 | 真正拿去用的公式，希望 g ≈ f |

兩個重點。第一，f 是未知的，所以 g 只能「希望」接近 f，不可能保證完全相同。第二，投影片把 **A 和 H 合稱學習模型**（learning model = A and H）。後面 16 講幾乎都在換 H、換 A，或是問「換了之後還學得會嗎」。

L1 的實用定義就是一句話：用資料算出一個近似目標 f 的假說 g。

### ML 和其他領域

最後一節比較 ML 與資料探勘、人工智慧、統計：資料探勘「用（大量）資料找有趣的性質」，現實中和 ML 很難分；ML 是實現 AI 的一條路；統計是「用資料做推論」，提供 ML 許多工具，但傳統統計更重視可證明的數學結果。

**Fall 2026 補充（01e）**：extended slides 換上更近的應用例，包括醫療對話診斷、4G LTE 通訊設定、PCB 瑕疵檢測、人臉辨識、颱風強度估計（TCIR 資料集），並把 ML 比成「把（大）資料這種食材做成 AI 這道菜的工具」。最後用 AlphaGo 說明好的 AI 同時需要 ML（深度學習）與非 ML 的技術（蒙地卡羅樹搜尋）。

## Lecture 2：感知器與 PLA

### 假說集合：感知器

L2 回到信用卡問題，挑一個最簡單的 H。每位申請人的特徵 x = (x₁,…,x_d) 算一個加權分數，超過門檻就核卡：

- h(x) = sign(Σᵢ wᵢxᵢ − threshold)
- 把門檻當成第 0 維：令 x₀ = +1、w₀ = −threshold，就能寫成 h(x) = sign(wᵀx)

這個 h 歷史上叫做**感知器**（perceptron）。在二維平面上，每個 w 就是一條線，一邊判 +1，一邊判 −1，所以投影片的結論是：感知器就是線性二元分類器。

### 演算法：PLA

H 裡有無限多條線，要怎麼挑？投影片的想法是：先隨便拿一條線，**看到錯就改**。

```text
從 w₀（例如 0）開始，t = 0, 1, …
  1. 找一個 w_t 分錯的例子 (x_n(t), y_n(t))，即 sign(w_tᵀ x_n(t)) ≠ y_n(t)
  2. 修正：w_{t+1} ← w_t + y_n(t) · x_n(t)
直到沒有錯為止，回傳最後的 w 當作 g（稱為 w_PLA）
```

為什麼這樣算「修正」？把更新式兩邊乘上 y_n x_n 就能看出 y_n w_{t+1}ᵀx_n ≥ y_n w_tᵀx_n，也就是分數往正確的方向推了一點。實作上常用 cyclic PLA：照固定順序或預先打亂的順序掃過資料，掃完一整輪都沒錯就停。投影片接著用「Seeing is Believing」一連串圖，示範 PLA 在二維資料上修正 9 次後停下來。

### 保證：線性可分時一定會停

PLA 停下來代表 D 上沒有錯誤，所以停下來的必要條件是存在某個 w 能完全分對，這叫**線性可分**（linear separable）。反過來，資料線性可分時，PLA 一定會停嗎？

投影片的證明分成兩個事實。設 w_f 是一條完美的線：

1. **w_t 和 w_f 越來越對齊**：每次更新，w_fᵀw_t 至少增加 ρ' = min_n y_n w_fᵀx_n > 0。
2. **w_t 長得不會太快**：只有分錯時才更新，而分錯代表 y_n w_tᵀx_n ≤ 0，所以 ‖w_t‖² 每次最多增加 R² = max_n ‖x_n‖²。

<details>
<summary>把兩個事實接起來（對照 02 handout 與 02e 的「Magic Chain」）</summary>

從 w₀ = 0 開始，更新 T 次之後：

- w_fᵀw_T ≥ T · min_n y_n w_fᵀx_n
- ‖w_T‖² ≤ T · R²

令 ρ = min_n y_n (w_f/‖w_f‖)ᵀx_n。兩個向量夾角的 cos 不會超過 1：

1 ≥ (w_fᵀw_T) / (‖w_f‖‖w_T‖) ≥ Tρ / (√T · R) = √T · ρ / R

整理得到 **T ≤ R²/ρ²**。這就是 L2 Fun Time 的參考答案。ρ 可以理解成「資料離完美分界線最近有多遠」，資料分得越開，PLA 停得越快。

</details>

這個保證有兩個限制，投影片也直接列出：它**假設**資料線性可分才會停，而且 ρ 取決於未知的 w_f，所以實際上不知道要跑多久。

### 不可分資料：pocket

資料有雜訊時，可能根本不存在完美的線。改問「找錯誤最少的線」聽起來合理，但投影片指出這是 NP-hard 問題。

折衷是 **pocket 演算法**：照常跑 PLA，但口袋裡永遠放著目前錯誤最少的權重 ŵ；每次更新後，如果新的 w_{t+1} 錯得比 ŵ 少，就換進口袋。跑夠多次之後回傳 ŵ。代價是每一輪都要在整份 D 上算一次錯誤數，所以在可分的資料上，pocket 比 PLA 慢；兩者最後回傳的權重相同，都沒有錯誤。

**Fall 2026 補充（02e）**：extended slides 補了四件事。一是 sign(0) 該怎麼算：從 w₀ = 0 出發時第一步必然碰到 sign(0)，投影片列出 −1、+1、0、隨機四種慣例，並說只要 w₁ 通常變成非零，選哪種影響不大。二是 x₀ 的角色：每次更新都讓 w_{t,0} 改變 y_n(t)。三是上面那條 Magic Chain 的完整推導。四是把 pocket「產生候選、留下更好的」這個模式，對照到當代對齊生成式 AI 的做法，引用 Lu、Lin、Wang 在 ICML 2026 Workshop on Generative and Agentic AI for Biology 的論文。

## Lecture 3：學習的種類

L3 把學習問題沿四個軸分類。每個軸都有一個「核心」選項，也就是基石主要處理的情況（下表粗體）：

| 軸 | 選項 | 例子（投影片） |
|---|---|---|
| 輸出空間 Y | **二元分類**、多類別分類、**迴歸**、structured learning | 美國硬幣辨識（1c／5c／10c／25c）是多類別；病人幾天後康復是迴歸；詞性序列標註是 structured |
| 資料標籤 y_n | **監督式**、非監督式、半監督式、強化學習 | 分群、密度估計、離群值偵測是非監督；只有少數臉有標註是半監督；訓練狗「坐下」靠獎懲是強化學習 |
| protocol | **batch**、online、active | 一次給一批 email 訓練垃圾信過濾器是 batch；邊收信邊改進是 online；讓演算法自己挑 x_n 去問標籤是 active |
| 輸入空間 X | **具體特徵**、raw 特徵、抽象特徵 | 硬幣的大小與重量是具體特徵；16×16 灰階數字影像是 raw；只有 (userid, itemid) 的評分預測是抽象特徵 |

投影片把核心工具收斂成三句：輸出看二元分類與迴歸、標籤看監督式、protocol 看 batch。基石接下來 13 講的主場，就是「批次、監督式、具體特徵的二元分類或迴歸」。raw 與抽象特徵要靠人或機器做特徵轉換，這條線會在基石 L12 與技法後段回來。

**Fall 2026 補充（03e）**：extended slides 在每個軸上補了近年的例子。輸出空間多了 multilabel classification（一張圖裡有哪幾種水果）、用 binary relevance 把它拆成多個是非題，以及影像生成（風格轉換、去噪、超解析度）。標籤軸多了 self-supervised（拼圖任務）與 weakly-supervised（只給「不是哪一類」的 complementary label）。強化學習的例子換成 AlphaGo 與 GPT-3。protocol 軸補了「online 加每日批次重訓」的實務做法，以及台大 CLLab 的 active learning 工具 [libact](https://github.com/ntucllab/libact)。

## 練習：Fall 2024 HW1 與 Fall 2026 hw1

兩份作業都公開在課程頁的 `hw1/` 子頁，沒有官方解答，批改只限修課生（Gradescope）。

**[Fall 2024 HW1](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw1/hw1_red.pdf)**（09/09 發布、10/07 截止，200 分加 20 分 bonus）：

- Q1：哪個任務最適合 ML，直接練 L1 的三個條件。
- Q3–4、Q7–8：資料縮放、x₀ 的取值怎麼改變 PLA 的上限與行為（題目引用 Lecture 2 的收斂上限頁）。
- Q5–6：先問一個 chatGPT 類的 agent「active learning 可以用在哪裡」「ML 能預測地震嗎」，再用 10–20 句英文以「老闆」的立場批判它的回答。
- Q9：用感知器做仇恨文章偵測的推導。
- Q10–12：在 LIBSVM 的 [rcv1_train.binary](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/binary/rcv1_train.binary.bz2) 前 200 筆上跑隨機挑選的 PLA 1000 次，畫更新次數的直方圖與 ‖w_t‖ 的變化，再比較「同一筆一直改到對」的變形。Q13 是 bonus。

**[Fall 2026 hw1](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/hw1.pdf)**（09/23 發布、09/25 紅字更正、10/21 截止，16 題 240 分）：

- Q1：哪個任務最適合 ML。
- Q2–4：保證修正一個錯誤所需的最少更新次數、正規化輸入後上限怎麼變、K = 2 時多類別 PLA 和二元 PLA 的關係。
- Q5：台灣降雨圖預測屬於哪一種學習問題，練 L3 的四個軸。
- Q6–10 是 L4 的可行性題，留給[第 2 篇](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning)。
- Q11–16（程式題）：在 [hw1_train.dat](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/hw1_train.dat)（N = 256、x ∈ ℝ¹²）上跑 1000 次隨機 PLA，量 E_in = 0 的比例、更新次數與 ‖w_PLA‖ 的中位數，再看把 x 縮小一半、x₀ 改成 0.5 或 0 時更新次數怎麼變。

沒有官方解答時，程式題可以這樣自己驗收：用同一份資料跑 scikit-learn 的 `Perceptron`，確認最後的 E_in 是否也是 0；或者在自己生成、確定線性可分的小資料上，檢查更新次數有沒有超過 R²/ρ²。

## 今晚可以做的事

1. 看 [Perceptron Learning Algorithm](https://youtu.be/1xnUlrgJJGo) 這一支，然後不看投影片，把 PLA 寫成 20 行以內的 Python。
2. 在二維平面自己生 50 個線性可分的點跑你的 PLA，把每次更新的線畫出來，和投影片的「Seeing is Believing」那一頁對照。
3. 挑三個你工作上的問題，照 L3 的四個軸各標一次，再用 L1 的三個條件判斷該不該用 ML。

## 延伸閱讀

- [Stanford CS229 導讀](/posts/ai/2026-08-21-stanford-cs229-machine-learning)：感知器與線性分類的另一種講法。
- [Caltech Learning from Data](https://work.caltech.edu/telecourse)：Abu-Mostafa 用同一本教科書開的英文課，第 1 講「The Learning Problem」對應這一篇的開頭。

**系列導覽**：[總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)｜下一篇 [學習可行嗎：Hoeffding 與「出了資料之外」](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/) — Lecture 1–3 的小節標題與投影片
- [Lecture 1: The Learning Problem（01_handout.pdf）](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/01_handout.pdf)
- [Lecture 2: Learning to Answer Yes/No（02_handout.pdf）](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/02_handout.pdf)
- [Lecture 3: Types of Learning（03_handout.pdf）](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/03_handout.pdf)
- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) — W2–W3 課前必看清單與 LFD 章節
- [Lecture 1 extended slides（01e）](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/01e_handout.pdf)、[Lecture 2（02e）](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/02e_handout.pdf)、[Lecture 3（03e）](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/03e_handout.pdf)
- [Fall 2026 Homework 1（hw1.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/hw1.pdf)、[hw1_train.dat](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/hw1_train.dat)
- [Fall 2024 Homework 1（hw1_red.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw1/hw1_red.pdf)
- [LIBSVM Data: rcv1.binary](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/binary/rcv1_train.binary.bz2)
- [libact: Pool-based Active Learning in Python](https://github.com/ntucllab/libact)
- [Learning from Data 教科書網站](http://amlbook.com)
