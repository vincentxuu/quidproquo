---
title: "CS234 資料效率 II：Bayesian bandit、Thompson sampling 與 Gittins index"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, exploration, multi-armed-bandit, bayesian-statistics]
lang: zh-TW
series:
  name: "Stanford CS234 導讀"
  order: 14
tldr: "CS234 L11 把探索的邏輯從「樂觀」換成「抽樣」。Thompson sampling 替每隻手臂維護一個後驗分布，每一步從後驗各抽一個值，選抽到最大的那隻；Bernoulli reward 配 Beta 先驗時，更新只是把成功或失敗次數加一。它剛好實作了 probability matching：選每隻手臂的機率，等於它是最佳手臂的後驗機率。在 Bayesian regret 下它跟 UCB 同階，在批次與延遲回饋的場景裡還比確定性的 UCB 更合適；代價是先驗錯得離譜時會表現很差。"
description: "Stanford CS234（Winter 2026）L11 導讀：Bayesian bandit 與貝氏推論 refresher、Beta-Bernoulli 共軛更新、Thompson sampling 演算法與骨折例子逐步推演、probability matching、frequentist regret 與 Bayesian regret 的差別、contextual TS 新聞推薦、TS 與 optimism 的小測、Gittins index，以及 PAC 的玩具例子。"
draft: false
glossary:
  - term: "Thompson sampling"
    aliases: ["TS", "posterior sampling", "後驗抽樣"]
    definition: "Bayesian bandit 演算法：每一步從每個動作的 reward 後驗分布各抽一個樣本，選樣本值最大的動作，觀察 reward 後用 Bayes rule 更新該動作的後驗。"
    context: "CS234 L11 的核心演算法，L12 會把同樣的想法搬到 MDP（PSRL）。"
  - term: "probability matching"
    aliases: ["機率匹配"]
    definition: "以「某動作是最佳動作的後驗機率」作為選它的機率的決策規則。直接算這個機率通常很難，而 Thompson sampling 用一次抽樣就實作了它。"
    context: "CS234 L11 說明 TS 為什麼有效的關鍵觀念。"
  - term: "Gittins index"
    aliases: ["Gittins 指數"]
    definition: "Bayesian multi-armed bandit 在最大化期望折扣 reward 時的最佳策略。它是一種 index policy：替每隻手臂只用它自己的統計量算一個實數指數，選指數最大的那隻。"
    context: "CS234 L11 用它回答「Thompson sampling 是不是最佳」這個問題。"
  - term: "Bayesian regret"
    aliases: ["貝氏 regret"]
    definition: "把 regret 再對參數的先驗分布取期望。frequentist regret 假設有一組固定的真實參數，Bayesian regret 則平均所有可能的問題。"
    context: "CS234 L11 用來評估 Thompson sampling 的框架。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs234-thompson-sampling-bayesian-bandits-en)

**影片狀態：僅附相關補充影片；原講次錄影未確認。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文依據 [CS234](https://web.stanford.edu/class/cs234/) Winter 2026 的投影片；公開錄影是 [Spring 2024 版](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)，本篇對應第 12 支「Exploration 2」（依 YouTube 章節，內容是 UCB 的限制、PAC、optimistic initialization、Bayesian bandit 與 Thompson sampling）。所有事實都在 2026-09-30 打開 [Lecture 11 投影片](https://web.stanford.edu/class/cs234/slides/lecture11post.pdf)（post 版，50 頁）核對。這份 PDF 的標題頁寫著「Lecture 13」，下面自己註明「Typo: Lecture 11」。存取等級 **A3**（定義見 [全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)）：投影片公開；2026 錄影只在 Canvas 給修課生。

**系列位置**：上一篇 [資料效率 I：bandit、regret、UCB](/posts/ai/2026-09-30-cs234-bandits-regret-ucb)｜下一篇 [資料效率 III：MDP 裡的 PAC、MBIE-EB、PSRL、策略性探索](/posts/ai/2026-09-30-cs234-fast-rl-mdps-exploration)｜[系列總覽](/posts/ai/2026-09-30-cs234-course-overview)

上一篇的 UCB 只假設 reward 有界，對 reward 分布長什麼樣不做任何假設。它的探索靠一個確定性的規則：替每隻手臂加上信賴寬度，選最大的。

L11 換一個角度：**如果你對 reward 有先驗知識，能不能用上？** 答案是 Bayesian bandit，而它最有名的演算法 Thompson sampling 用的是一個完全不同的探索邏輯：照你現在的信念抽一次籤。

## 課程影片來源

本文以 Winter 2026 教材為準；下列 Spring 2024 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=gFJNsfg_35E
title: Stanford CS234 Spring 2024 播放清單第 12 支「Exploration 2」
```

原始影片：[Stanford CS234 Spring 2024 播放清單第 12 支「Exploration 2」](https://www.youtube.com/watch?v=gFJNsfg_35E)

課程與錄影入口：

- [Spring 2024 版](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)
- [官方課程／講次來源](https://web.stanford.edu/class/cs234/)

Winter 2026 官方課程頁的 Lecture Materials 只列投影片，沒有列錄影；公開 YouTube 播放清單是 Spring 2024。 查核日期：2026-10-10。

## 開場：確定性 reward 的小測

L11 用一題小測開場：如果 bandit 的 reward 是確定性的，UCB 會怎樣？

官方解答：在確定性的環境裡，只要拉過一次，手臂的平均 reward 就**完全等於**真實期望值。信賴界以 100% 的機率成立（而不只是 1 − δ），所以 UCB 以機率 1 有 sublinear regret。也不會發生除以零的問題。

這題在確認你真的懂 UCB 證明裡「好事件」的角色：好事件失敗的機率，就是 regret 界裡那些額外項的來源。

投影片接著放了期中課程調查的結果：學生最喜歡 tutorials，希望講課多一點高層次的結構、概念理解與例子。Brunskill 說之後會多強調概念並提供具體例子。L11 本身也照這個方向走：骨折例子在這一講占了將近十頁。

## 貝氏推論 refresher

Bayesian 的觀點是：先對未知參數放一個先驗，觀察到資料後，用 Bayes rule 更新對參數的不確定性。

對 bandit 來說，未知參數就是每隻手臂的 reward 分布。設手臂 i 的 reward 分布由參數 φ_i 決定，先驗是 p(φ_i)。拉一次、觀察到 r_i1 之後：

```text
p(φ_i | r_i1) = p(r_i1 | φ_i) p(φ_i) / ∫ p(r_i1 | φ_i) p(φ_i) dφ_i
```

分母的積分一般很難算。但如果先驗與後驗的參數形式相同，就叫**共軛**（conjugate），更新可以用解析式完成。指數族分布都有共軛先驗。

bandit 裡最常用的組合是 Bernoulli reward 配 Beta 先驗。reward 是 0 或 1，例子包括廣告點擊率、治療成功與否。先驗是 Beta(α, β)，觀察到 reward r ∈ {0, 1} 之後，後驗是 Beta(r + α, 1 − r + β)。

換句話說：**成功就把第一個參數加一，失敗就把第二個參數加一。** 整個貝氏更新就這麼簡單。

投影片接著列出 Bayesian bandit 的整體架構：維護 reward 的後驗 p[R | h_t]，h_t 是到目前為止的動作與 reward 歷史，再用後驗指導探索。兩種用法是 Bayesian UCB 與 probability matching（Thompson sampling）。如果先驗知識準確，表現會更好。

## Thompson sampling

演算法本身只有幾行：

```text
1: 替每隻手臂 a 初始化先驗 p(R_a)
2: for iteration = 1, 2, ... do
3:     對每隻手臂 a，從後驗抽一個 reward 分布 R_a
4:     計算 Q(a) = E[R_a]
5:     a_t = argmax_a Q(a)
6:     觀察 reward r
7:     用 Bayes rule 更新 p(R_a_t)
8: end for
```

跟 UCB 對照：UCB 選的是「上界最大」的手臂，TS 選的是「這次抽到最大」的手臂。前者是確定性的，後者是隨機的。

## 骨折例子：逐步推演

L11 用上一篇同一個骨折例子（手術 0.95、taping 0.9、什麼都不做 0.1，投影片再次註明是編的）。三隻手臂的先驗都是 Beta(1,1)，也就是 [0, 1] 上的均勻分布。投影片一步一步走：

| 步 | 當前後驗（手術, taping, 不做） | 抽到的值 | 選 | 結果 | 更新 |
|---|---|---|---|---|---|
| 1 | Beta(1,1), Beta(1,1), Beta(1,1) | 0.3, 0.5, 0.6 | 不做 | 0 | 不做 → Beta(1,2) |
| 2 | Beta(1,1), Beta(1,1), Beta(1,2) | 0.7, 0.5, 0.3 | 手術 | 1 | 手術 → Beta(2,1) |
| 3 | Beta(2,1), Beta(1,1), Beta(1,2) | 0.71, 0.65, 0.1 | 手術 | 1 | 手術 → Beta(3,1) |
| 4 | 投影片仍寫 Beta(2,1), … | 0.75, 0.45, 0.4 | 手術 | 1 | 手術 → Beta(4,1) |

幾個值得注意的地方：

- 第 1 步三隻手臂的先驗一樣，選誰完全看運氣。這次抽到「什麼都不做」，失敗了，它的後驗往 0 偏。
- 從第 2 步開始，手術連續成功，後驗越來越集中在高值，被抽到最大的機率越來越高。
- 第 4 步的後驗欄位投影片寫的是 Beta(2,1)，但照前一步的更新應是 Beta(3,1)；最後的更新結果 Beta(4,1) 是一致的，看起來是複製上一頁時沒改。

投影片最後留了一個問題：到目前為止，optimism 與 TS 拉手臂的順序比起來怎樣？可以把上一篇 UCB 的手算結果並排比較。

## 為什麼有效：probability matching

L11 接著回答 TS 在做什麼。先定義 probability matching：**選動作 a 的機率，等於 a 是最佳動作的後驗機率**：

```text
π(a | h_t) = P[ Q(a) > Q(a'), ∀a' ≠ a | h_t ]
```

這個機率直接從後驗算很困難，要對所有手臂的聯合分布積分。投影片的說法是「somewhat incredibly」：Thompson sampling 剛好實作了 probability matching。因為從後驗抽一組值、選最大者，被選中的機率正是 E_{R|h_t}[1(a = argmax Q(a))]。

投影片還補了一句：probability matching 通常也是 optimistic in the face of uncertainty，因為**不確定的動作更有機會被抽到最大值**。所以 TS 仍然是樂觀的，只是改用機率的方式實作。

## 怎麼評估：frequentist regret 與 Bayesian regret

TS 的表現要用什麼框架評估？L11 區分兩種 regret：

- **frequentist regret** 假設有一組固定、未知的真實參數 θ，對演算法造成的動作與 reward 歷史取期望。上一篇的 UCB 界就是這種。
- **Bayesian regret** 再多一層：假設參數本身從先驗抽出，對先驗也取期望。

投影片也複習了 optimism 怎麼界住 regret：在 U_t 確實是上界的事件下，每一步的 regret Q(a*) − Q(a_t) 不超過 U_t(a_t) − Q(a_t)，也就是信賴寬度。

TS 的理論定位有兩句話：

- 標準 TS 的 **frequentist** 界，（投影片註明「last checked」）還比不上最好的 frequentist 演算法
- 但在 **Bayesian regret** 下，posterior sampling 的界跟 UCB 同階（忽略常數），見 L11 p.49

加上一句實務觀察：**經驗上 TS 很有效，特別是在 contextual multi-armed bandit。**

## contextual TS：新聞推薦

contextual bandit 多了一個輸入的情境：情境會影響每隻手臂的 reward，而且每一步從某個分布 i.i.d. 抽出。投影片用新聞推薦當例子（引用 Chapelle 與 Li 的研究）：

- 手臂 = 文章
- reward = 使用者有沒有點擊（+1）
- Q(a) = 點擊率

接著是一題很實務的小測。一個新聞網站每秒有上千人登入，常常上一個人還沒決定點不點，下一個人就來了。官方解答：

1. **對**：這裡 TS 比 optimism 好，因為 optimism 演算法是確定性的，拿到回饋之前會一直選同一個動作
2. **錯**：optimism 在這個設定下並沒有更強的 regret 界
3. **對**：先驗錯得離譜時，TS 可能比 optimism 差很多。投影片的例子是：對真實參數 0.1 的 Bernoulli 手臂放 Beta(100,1) 先驗，先驗會在很長一段時間把大部分機率放在高值上

第 1 點回應了上一篇 COVID 案例裡的「batched、delayed feedback」：確定性演算法在批次決策下，整批都會選同一隻手臂，TS 的隨機性反而自然分散了探索。

## TS 是最佳的嗎？Gittins index

TS 常常表現很好，但它是不是最佳的？L11 的回答分兩層。

原則上可以：給定先驗與已知的 horizon，你可以算出最大化期望 reward 的決策策略。問題是計算：天真的做法會得到一個「從整段歷史映射到下一隻手臂」的策略，大到算不動。

然後介紹 **index policy**：替每隻手臂算一個實數指數，選指數最大的那隻，而且指數只用那隻手臂自己的統計量與 horizon（投影片引用 Lattimore 與 Szepesvári《Bandit Algorithms》的定義）。**Gittins index** 就是這種策略，而且它是 Bayesian multi-armed bandit 在最大化期望**折扣** reward 時的最佳策略。

投影片對 Gittins index 只講到這裡，沒有給計算方法或證明。想深入可以看 [Bandit Algorithms](https://tor-lattimore.com/downloads/book/book.pdf)。

## PAC：另一種評估框架的預告

L10 與 L11 的「Today」清單都列了「Bandits and Probably Approximately Correct」，但兩份投影片裡，PAC 的具體內容只有 L11 最後一頁的玩具例子：

- 同一個骨折例子，設 ε = 0.05
- 除了逐步記錄 optimism（O）與 TS 的 regret，再多記一欄「W/in ε」：這一步選的動作是否在最佳值的 ε 以內，也就是指示函數 I(Q(a_t) ≥ Q(a*) − ε)

直覺是：regret 算的是累積少拿多少，PAC 關心的是**有多少步不是 ε-最佳的**。在這個例子裡，taping（0.9）跟手術（0.95）差距剛好是 0.05，選 taping 仍算在 ε 以內；只有選「什麼都不做」才算犯錯。

PAC 的正式定義與它在 MDP 上的版本，是下一篇 [order 15](/posts/ai/2026-09-30-cs234-fast-rl-mdps-exploration)（L12）的主題。

## 學習目標清單

L11 p.47 列出整個 bandit 段落該會的事，可以直接拿來當自我檢查：

- 理解 multi-armed bandit 跟 MDP 的關係
- 能定義 regret 與 PAC
- 能證明 UCB bandit 演算法為什麼有 sublinear regret
- 能舉例說明為什麼 ε-greedy、greedy 與 pessimism 會造成線性 regret
- 能實作 UCB bandit 演算法
- 能實作 Bernoulli reward 的 Thompson sampling

## 自學怎麼做

1. **手算骨折例子的前四步。** 照上面的表，自己拿隨機數抽一遍 Beta 分布，看看在你的隨機數下會選哪隻手臂。
2. **實作 Bernoulli TS。** 在上一篇的 UCB1 模擬上加一個 TS，共用同一組三隻手臂，比較兩者的累積 regret 曲線。
3. **做一個批次實驗。** 每 50 步才回饋一次 reward，看 UCB1 與 TS 各自會怎樣。這就是 L11 新聞推薦小測的情境。
4. **做一個錯誤先驗實驗。** 對「什麼都不做」那隻手臂放 Beta(100,1)，看 TS 要花多久才發現它其實很差。

今晚可以做的一件事：用 numpy 的 `np.random.beta` 寫一個 20 行的 Bernoulli Thompson sampling，跑骨折例子 1,000 步，印出三隻手臂最後的 Beta 參數。你會看到手術的參數大得多，而「什麼都不做」大概只被拉了少少幾次。

## 延伸閱讀

- 探索在深度 RL 裡的做法（count-based、posterior sampling 等）：[Berkeley CS285 L19–25：探索、RL 理論與開放問題](/posts/learning/2026-08-22-berkeley-cs285-exploration-open-problems)
- 課程定位、存取缺口與 2024 影片對照：[Stanford CS234 導讀（系列總覽）](/posts/ai/2026-09-30-cs234-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入的影片屬於較早學期的公開錄影，不是 2026 當季課程，狀態改為相關補充影片。

## 參考資料

- [CS234 課程首頁（Winter 2026）](https://web.stanford.edu/class/cs234/) — 課表與 learning outcomes
- [CS234 講義頁](https://web.stanford.edu/class/cs234/modules.html) — 「Data Efficient RL」單元（L9–L12）
- [CS234 Lecture 11 投影片（post 版）](https://web.stanford.edu/class/cs234/slides/lecture11post.pdf) — 確定性 bandit 小測、貝氏推論、Beta-Bernoulli、Thompson sampling、骨折例子、probability matching、Bayesian regret、contextual TS、Gittins index、PAC 玩具例子、學習目標
- [CS234 Lecture 10 投影片（post 版）](https://web.stanford.edu/class/cs234/slides/lecture10post.pdf) — 「Today」清單中的 Bayesian bandits 與 PAC 預告
- [Lattimore & Szepesvári, Bandit Algorithms](https://tor-lattimore.com/downloads/book/book.pdf) — L11 引用的 index policy 定義
- [Stanford CS234 Spring 2024 播放清單第 12 支「Exploration 2」](https://www.youtube.com/watch?v=gFJNsfg_35E) — 公開錄影（2024 版，講次與 2026 不完全對齊）
