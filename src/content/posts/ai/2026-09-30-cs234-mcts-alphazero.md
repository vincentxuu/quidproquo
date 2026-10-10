---
title: "CS234 導讀 16：規劃＋學習——MCTS、UCT 與 AlphaGo／AlphaZero"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, mcts, alphazero]
lang: zh-TW
series:
  name: "Stanford CS234 導讀"
  order: 16
tldr: "到目前為止，CS234 都在替整個狀態空間算一個策略。第 13、14 講換一個問題：如果我只在乎「現在這一步」該怎麼走，能不能多花一點本地運算，做出更好的決定？從 simple Monte Carlo search、expectimax tree 到 MCTS，再把每個節點當成一個 bandit，就得到 UCT。AlphaZero 把 MCTS 跟一個同時預測策略與價值的網路綁在一起，用 self-play 互相推進。投影片借用 Silver et al. 2017 的圖回答三個問題：架構有多重要、MCTS 加了多少、需不需要人類資料。"
description: "Stanford CS234 Reinforcement Learning（Winter 2026）第 13–14 講〈Monte Carlo Tree Search〉導讀：只為當下狀態規劃的想法、simple MC search、expectimax tree 與 (|S||A|)^H 的代價、MCTS、UCT、AlphaZero 的 PUCT 選步與 self-play、策略／價值網路，以及架構、MCTS 與人類資料的消融圖。對照 2024 公開影片 14〈Multi-Agent Game Playing〉。"
draft: false
glossary:
  - term: "MCTS（Monte Carlo Tree Search）"
    aliases: ["蒙地卡羅樹搜尋"]
    definition: "以當下狀態為根建一棵搜尋樹，用模型反覆模擬 K 個 episode 來擴展與更新樹上的價值估計，搜完之後選根節點上價值最高的動作。只需要能從模型抽樣，不需要解整個 MDP。"
    context: "CS234 L13–L14；AlphaGo 與 AlphaZero 的搜尋骨架。"
  - term: "UCT（Upper Confidence Tree）"
    aliases: ["Upper Confidence bounds applied to Trees"]
    definition: "MCTS 的一種選步規則：把樹上每個可以選動作的節點當成一個多臂老虎機，對每個動作的平均回報加上 UCB 式的信賴上界，選上界最高的動作去模擬。"
    context: "CS234 L13 把它當成 bandit（第 13 篇）與規劃的交會點。"
  - term: "expectimax tree"
    aliases: ["期望極大樹"]
    definition: "以當下狀態為根，交替展開「選動作（取 max）」與「環境轉移（取期望）」兩種節點的前向搜尋樹，可以精確算出當下狀態的最佳 Q 值，但大小是 (|S||A|)^H。"
    context: "CS234 L13 用它說明為什麼需要抽樣版的 MCTS。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs234-mcts-alphazero-en)

**本文依據 [CS234](https://web.stanford.edu/class/cs234/) Winter 2026 投影片與作業；錄影是 Spring 2024 公開版。** 這是 [Stanford CS234 導讀](/posts/ai/2026-09-30-cs234-course-overview)系列第 16 篇。

**系列位置**：上一篇 [資料效率 III：MDP 的 PAC、MBIE-EB、PSRL、策略性探索](/posts/ai/2026-09-30-cs234-fast-rl-mdps-exploration)｜下一篇 [價值對齊：對齊誰、對齊什麼](/posts/ai/2026-09-30-cs234-value-alignment-ethics)｜[系列總覽](/posts/ai/2026-09-30-cs234-course-overview)

用到的官方材料：[第 13 講投影片（post 版）](https://web.stanford.edu/class/cs234/slides/lecture13post.pdf)（13 頁，只有 simulation-based search 那段）與[第 14 講投影片（post 版）](https://web.stanford.edu/class/cs234/slides/lecture14post.pdf)（30 頁，AlphaZero）。兩份的標題都是〈Monte Carlo Tree Search〉，講義頁把它們歸在「Monte Carlo Tree Search and Conquering Go」單元。聽講補充是 [2024 公開播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)的[影片 14〈Multi-Agent Game Playing〉](https://www.youtube.com/watch?v=UgANzoWc0nc)；YouTube 章節跟 2026 投影片對得上，細節見下方「2024 影片怎麼對照」。

存取等級是 **A3（足以自學）**（定義見 [全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)）：兩份投影片公開。缺口是 2026 錄影只在 Canvas；另外兩份投影片的 Class Structure 頁顯示 MCTS 在 2026 是跟客座課共用時段講的（第 13 講配 Shane Gu 的世界模型客座，第 14 講配倫理與社會客座第二部分），所以 PDF 頁數比一般講次少。

## 課程影片來源

本文以 Winter 2026 教材為準；下列 Spring 2024 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=UgANzoWc0nc
title: Stanford CS234 Spring 2024 影片 14〈Multi-Agent Game Playing〉
```

```youtube
url: https://www.youtube.com/watch?v=FOlPpjNbHjE
title: 影片 15 的前 15 分鐘
```

原始影片：[Stanford CS234 Spring 2024 影片 14〈Multi-Agent Game Playing〉](https://www.youtube.com/watch?v=UgANzoWc0nc)、[影片 15 的前 15 分鐘](https://www.youtube.com/watch?v=FOlPpjNbHjE)

課程與錄影入口：

- [2024 公開播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)
- [官方課程／講次來源](https://web.stanford.edu/class/cs234/)

## 換一個問題：只為現在這一步規劃

第 13 講第 5 頁一句話交代轉折：到目前為止，這門課都在替**整個狀態空間**算一個策略。關鍵想法是：用額外的**本地運算**，替**現在**做出更好的決定。

這跟前面各篇的差別在於花力氣的地方。value iteration 對每個狀態都做 backup，DQN 要讓一個網路在所有狀態上都準；可是下棋時你只需要知道「這一盤、這個局面」怎麼走。把運算集中在當下狀態附近，是整個 MCTS 家族的出發點。

投影片從 AlphaZero 開場：它在過去十年最重要的 AI 成就之一裡扮演要角，也就是成為比任何人類都強的圍棋棋手，而且它結合了好幾個有意思的想法。

## 三步走到 MCTS

### 第一步：simple Monte Carlo search

給你一個模型 $M_v$ 和一個模擬策略 $\pi$：

1. 對每個動作 $a$，從當下的真實狀態 $s_t$ 出發模擬 $K$ 個 episode
2. 用平均回報估計 $Q(s_t, a) = \frac{1}{K}\sum_k G_t^k$，這會趨近 $q_\pi(s_t, a)$
3. 選 $\arg\max_a Q(s_t, a)$

投影片的評語是：這基本上是做**一步 policy improvement**。它只比 $\pi$ 好一步，因為第一步之後都照 $\pi$ 走。

### 第二步：expectimax tree

能不能比一步 policy improvement 更好？如果有 MDP 模型，可以以 $s_t$ 為根建一棵 expectimax tree：動作節點取 max、轉移節點取期望，一路往前看。這樣算出的是當下狀態的**最佳** $Q(s,a)$，而且只需要解從現在開始的子 MDP，不用解整個 MDP。

代價是樹的大小是 $(|S||A|)^H$，隨視野 $H$ 指數成長。

### 第三步：MCTS

MCTS 的做法是用**抽樣**取代完整展開：

- 以當下狀態 $s_t$ 為根建樹
- 抽樣動作與下一個狀態，而不是全部展開
- 從根出發跑 $K$ 個模擬 episode，每跑一個就擴展並更新一次樹
- 搜完之後，在真實世界選 $\arg\max_a Q(s_t, a)$

剩下的問題是：模擬時在樹裡怎麼選動作？

## UCT：把每個節點當成一個 bandit

UCT 借用 bandit 的想法，把樹上每個能選動作的節點 $i$ 當成一個多臂老虎機，每個動作是一個 arm：

$$
Q(s, a, i) = \frac{1}{N(i,a)} \sum_{k=1}^{N(i,a)} G_k(i,a) + c\sqrt{\frac{O(\log N(i))}{N(i,a)}}
$$

- $N(i,a)$：在節點 $i$ 選 arm $a$ 的次數
- $G_k(i,a)$：第 $k$ 次從節點 $i$ 選 $a$ 之後得到的折扣回報
- 第 $k$ 個模擬 episode 在節點 $i$ 選上界最高的動作，拿它去擴展或評估樹

第一項是平均，第二項就是[第 13 篇](/posts/ai/2026-09-30-cs234-bandits-regret-ucb) UCB 的信賴寬度。投影片特別提醒一個後果：用來模擬的策略會隨 episode 改變，因為每跑一次，計數與平均都變了。

第 13 講最後列出 MCTS 的優點：高度選擇性的 best-first search、動態評估狀態、用抽樣打破維度詛咒、只要能從「黑盒」模型抽樣就能用、計算上有效率、可以隨時中止（anytime）、可以平行化。

### 一個值得停下來想的問題

第 14 講有一頁選修的 Check Your Understanding 問：UCT 其實有點奇怪，為什麼？提示是：UCB 當初之所以好，是因為它在平衡探索與利用；可是在**模擬**的 episode 裡，真的有探索與利用的取捨嗎？

下一頁的小測給了答案：「UCT 會優先模擬通往後續高回報的動作，所以有用」是 True；「UCB 最小化 regret，UCT 就是在樹的 rollout 裡最小化 regret」也是 True，但投影片接著要你想這是不是好主意。模擬裡犯的錯不會真的扣分，你想要的是「搜完之後選對真實的那一步」，而不是「模擬過程中累積的回報最高」。投影片把這個問題指向 metalevel reasoning，引用 Hay, Russell, Tolpin & Shimony（2012）〈Selecting Computations: Theory and Applications〉。

另一題小測問 MCTS 適合什麼樣的 MDP，答案是 F、F、T：

| 情境 | 適合 MCTS？ |
|---|---|
| 短視野、狀態與動作都少 | 否（直接解就好） |
| 長視野、動作空間大、狀態空間小 | 否 |
| 長視野、狀態空間大、動作空間小 | 是 |

原因回到 MCTS 的設計：它用抽樣處理大量的下一個狀態，但每個節點仍要替每個動作維持統計量。

## AlphaZero：搜尋跟網路互相推進

### 圍棋為什麼難

第 14 講的案例頁：圍棋有 2500 年歷史，是最難的經典棋類，是 John McCarthy 口中的 grand challenge，傳統的博弈樹搜尋在圍棋上失敗了。投影片留了一個問題：下圍棋算不算「在動態與獎勵模型未知的世界裡學決策」？投影片沒有在這頁給答案。

### 一步棋怎麼選

投影片用 [Silver et al.（Nature 2017）〈Mastering the game of Go without human knowledge〉](https://www.nature.com/articles/nature24270)的圖，一步步走過單局裡選一步棋的流程。它受 UCT 啟發但改了很多地方，選步規則改用 PUCT：

1. **從根開始**：用 PUCT 選動作往下走
2. **反覆擴展**：一路走到葉節點
3. **用網路的動作機率**：選步時參考策略網路對每個動作的預測
4. **在葉節點代入網路的價值預測**：不用 rollout 到終局，直接用價值網路估計
5. **更新祖先**：把價值往上 backup
6. **重複很多次**：之後在根節點依拜訪次數 $N(s,a)$ 算出策略 $\pi(s) \propto N(s,a)^{1/\tau}$

投影片特別提醒：網路內部是輪流由對手與自己「最大化」價值，所以這棵樹其實在模仿 min-max tree。

### self-play

選好一步之後，照根節點的策略走一步，然後對新局面重複整個搜尋，直到棋局結束、觀察到勝或負。投影片列出 self-play 的兩個好處：

- 瓶頸只剩運算，不需要人
- 對手永遠跟自己勢均力敵

小測問：這對策略訓練有什麼幫助？獎勵密度如何？答案是：因為雙方實力相當，獎勵會相當密集，這形成一種 curriculum learning。

接著訓練網路去預測策略與價值。論文摘要的說法是：網路被訓練來預測 AlphaGo 自己的選步，以及自己對局的勝方；網路變強讓樹搜尋變強，樹搜尋變強又讓下一輪 self-play 的品質更高。

投影片把 AlphaGo／AlphaZero 的要素整理成六個詞：self-play、strategic computation、highly selective best-first search、power of averaging、local computation、learn and update heuristics。

## 三個評估問題

投影片接著問三個問題，每個問題用論文的一張圖回答。以下數字是從投影片上的長條圖與曲線目測讀出的近似值，精確數字請看原論文。

**架構有多重要？** 圖比較四種網路：策略與價值共用一個網路（dual）或分開（sep），主幹用 residual（res）或一般卷積（conv）。dual-res 的 Elo 最高（約 4,300 以上），sep-conv 最低（約 3,100），另外兩種在中間。兩個改變各自都有幫助，合在一起幫助最大。

**MCTS 加了多少？** 同一張圖上，只用網路、不做搜尋的「Raw network」Elo 約 3,000；加上 MCTS 的 AlphaGo Zero 約 5,200，高於 AlphaGo Master、AlphaGo Lee、AlphaGo Fan，以及 Crazy Stone、Pachi、GnuGo 等程式。搜尋本身貢獻了一大段差距。

**需要人類資料嗎？** 投影片的「Overall performance」與「Need for Human Data?」兩頁放的是同一張曲線：40 blocks 的 AlphaGo Zero 從零開始，大約幾天內就超過 AlphaGo Lee 的水準，之後在 40 天的訓練期間追上並超過 AlphaGo Master。論文摘要的結論是：不用人類資料、只靠規則從零開始，AlphaGo Zero 以 100 比 0 擊敗先前擊敗世界冠軍的 AlphaGo 版本。

## 不只是圍棋

第 14 講最後一頁內容頁指出，這些想法在圍棋以外也有用：西洋棋、將棋等其他棋類，發現更快的矩陣乘法（AlphaTensor），發現更快的排序演算法（AlphaDev）。投影片的說法是：只要一個問題能寫成（極大的）搜尋問題，就能用 RL 大幅加速。

最後一題複習小測把整個後半學期串起來：

- UCB 用來平衡探索與「利用已得資訊拿高獎勵」：True
- 這類演算法可以用在 bandit 與 MDP：True
- 如果獎勵模型已知，用 UCB 類演算法沒有好處：看情況。bandit 裡沒有額外好處；RL 裡如果動態模型未知，仍然有好處

## 2024 影片怎麼對照

2024 的第 14 支影片標題是〈Multi-Agent Game Playing〉，YouTube 章節顯示內容就是 2026 L13–L14 這一段：[7:47 起](https://www.youtube.com/watch?v=UgANzoWc0nc&t=467s)是 simulation-based search 與 expectimax tree，[19:00](https://www.youtube.com/watch?v=UgANzoWc0nc&t=1140s) 進 MCTS、24:45 講 UCT，[35:10 起](https://www.youtube.com/watch?v=UgANzoWc0nc&t=2110s)是 AlphaGo、圍棋規則、self-play 與神經網路。AlphaZero 的收尾在[影片 15 的前 15 分鐘](https://www.youtube.com/watch?v=FOlPpjNbHjE)（5:13「AlphaZero mechanism review」、8:55「AlphaZero technical details」）。

## 自學怎麼做

1. 先確定[第 13 篇](/posts/ai/2026-09-30-cs234-bandits-regret-ucb)的 UCB 公式你能寫出來，UCT 就是把它放進每個樹節點。
2. 把 simple MC search → expectimax → MCTS 三者寫成一張表，欄位是「需要什麼模型」「算出什麼」「代價」。
3. 讀 AlphaZero 的六張流程圖時，對每一步問：這裡用的是搜尋、網路，還是兩者？
4. 最後想清楚 UCT 那個「奇怪之處」：為什麼在模擬裡最小化 regret，不一定是最好的搜尋目標。

今晚可以做的一件事：寫一個井字遊戲的 MCTS，選步用 UCT、葉節點用隨機 rollout 評估。跑幾百次模擬後看它會不會下出不輸的棋，再把 $c$ 調大調小，觀察搜尋樹的形狀怎麼變。

## 延伸閱讀

- 另一門課從 MDP、Q-learning 一路講到 AlphaZero：[CMU 07-280 階段複習三：從 MDP、Q-learning 到 AlphaZero](/posts/ai/2026-08-22-cmu-07280-stage-3-rl-alphazero)
- 規劃與模型在深度 RL 裡的其他用法：[CS224R L11：Model-Based RL](/posts/ai/2026-09-30-cs224r-model-based-rl)
- 本系列下一段會碰到的世界模型客座：[客座：Shane Gu〈World of World Modeling〉](/posts/ai/2026-09-30-cs234-guest-world-models)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [CS234 第 13 講投影片（Winter 2026，post 版）](https://web.stanford.edu/class/cs234/slides/lecture13post.pdf) — simulation-based search、expectimax、MCTS、UCT
- [CS234 第 14 講投影片（Winter 2026，post 版）](https://web.stanford.edu/class/cs234/slides/lecture14post.pdf) — 圍棋案例、PUCT 選步流程、self-play、三個評估問題、小測
- [CS234 講義頁](https://web.stanford.edu/class/cs234/modules.html) — 「Monte Carlo Tree Search and Conquering Go」單元
- [CS234 課程首頁（Winter 2026）](https://web.stanford.edu/class/cs234/) — 課表：Week 8「RL and MCTS」
- [Stanford CS234 Spring 2024 影片 14〈Multi-Agent Game Playing〉](https://www.youtube.com/watch?v=UgANzoWc0nc) — 公開錄影，章節涵蓋 MCTS、UCT、AlphaGo
- [Silver et al., Mastering the game of Go without human knowledge (Nature 2017)](https://www.nature.com/articles/nature24270) — 投影片所有 AlphaZero 圖的來源；摘要中的 100–0 結果
