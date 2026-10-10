---
title: "林軒田機器學習基石導讀：學習可行嗎？Hoeffding 與「出了資料之外」"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, learning-theory]
lang: zh-TW
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 2
tldr: "基石 Lecture 4 先證明學習「不可能」：只看資料 D，D 以外的答案怎麼猜都可能被說錯，這是 No Free Lunch。接著用抽彈珠換個問法：如果資料是從同一個分布獨立抽出來的，Hoeffding 不等式保證樣本錯誤率 E_in 很可能接近真實錯誤率 E_out。只驗證一個固定的 h 不算學習；演算法要從 M 個假說裡挑，就得用 union bound 付出 2M exp(−2ε²N) 的代價。結論：假說集合有限、E_in 又小，學習就可行。M 無限大怎麼辦，留給下一講。"
description: "台大林軒田《機器學習基石》Lecture 4 導讀：No Free Lunch 的直覺與 Wolpert 1996 論文、抽彈珠與 Hoeffding 不等式、E_in／E_out 與 PAC、只驗證一個假說和真正學習的差別、BAD data 與有限假說的 union bound，加上 Fall 2026 extended slides 的補充與 Fall 2026 hw1 Q6–10、Fall 2024 HW2 的對應題目。"
draft: false
glossary:
  - term: "Hoeffding's inequality"
    aliases: ["Hoeffding 不等式"]
    definition: "N 個獨立同分布樣本的平均值 ν 與真實期望值 µ 相差超過 ε 的機率，不超過 2exp(−2ε²N)；這個上界不需要知道 µ。"
    context: "基石 Lecture 4 用它說明：資料夠多時，E_in(h) 很可能接近 E_out(h)。"
  - term: "PAC"
    aliases: ["probably approximately correct", "大概差不多正確"]
    definition: "「大概（高機率）差不多（誤差在 ε 內）正確」。基石用它描述 ν ≈ µ、E_in ≈ E_out 這類機率性的保證。"
    context: "基石 Lecture 4 的核心用語，之後的 VC bound 也是 PAC 形式的保證。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning-en)

**影片狀態：已附影片；播放未逐支確認。** [影片來源與說明](#課程影片來源)

這一篇是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)系列的第 2 篇，對應[機器學習基石](https://www.csie.ntu.edu.tw/~htlin/mooc/)的 Lecture 4「feasibility of learning」，是第一個問題「When Can Machines Learn?」的最後一講。

[第 1 篇](/posts/ai/2026-09-30-ntu-htlin-ml-learning-problem-perceptron)的 PLA 在訓練資料上可以做到零錯誤，但我們真正在乎的是**沒看過的資料**。這一講從「演算法」跳到「機率保證」，是整門課的第一道斷崖，所以本系列讓它單獨一篇。

**本文依據**：MOOC 投影片 [04_handout](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/04_handout.pdf)、[Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) W3 的課前必看清單、extended slides [04e](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/04e_handout.pdf)、[Fall 2026 hw1](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/hw1.pdf) 與 [Fall 2024 HW2](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw2/hw2_red.pdf)，全部在 2026-09-30 打開核對。

## 課程影片來源

以下沿用本文已列出的課程影片來源；尚未逐支重新驗證可播放狀態，不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=tOgbh5_747w
title: YouTube
```

```youtube
url: https://www.youtube.com/watch?v=MgAihqFPkZc
title: YouTube
```

原始影片：[YouTube](https://www.youtube.com/watch?v=tOgbh5_747w)、[YouTube](https://www.youtube.com/watch?v=MgAihqFPkZc)、[YouTube](https://www.youtube.com/watch?v=iXbbfjJNfwU)、[YouTube](https://www.youtube.com/watch?v=MFL6xDn1lXM)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

## 這篇對應的教材

| 小節 | 影片 | 投影片摘要（04 handout 最後一頁） |
|---|---|---|
| Learning is Impossible? | [YouTube](https://youtu.be/tOgbh5_747w) | absolutely no free lunch outside D |
| Probability to the Rescue | [YouTube](https://youtu.be/MgAihqFPkZc) | probably approximately correct outside D |
| Connection to Learning | [YouTube](https://youtu.be/iXbbfjJNfwU) | verification possible if E_in(h) small for fixed h |
| Connection to Real Learning | [YouTube](https://youtu.be/MFL6xDn1lXM) | learning possible if \|H\| finite and E_in(g) small |

LFD 章節：1.3（依 Fall 2026 課程頁）。Fall 2026 與 Fall 2024 課程頁都在這一講旁邊列了延伸閱讀：Wolpert 的 [The Lack of A Priori Distinctions Between Learning Algorithms](https://direct.mit.edu/neco/article-abstract/8/7/1341/6016/The-Lack-of-A-Priori-Distinctions-Between-Learning)。

上面那張摘要表的四句話，就是這一講的完整論證。下面一節一節拆開。

## 學習是不可能的？

### 兩個都對的答案

投影片先出一道「人類學習」題：6 個 3×3 黑白格子的圖案，分成標 −1 與標 +1 兩組，問新的一個圖案 g(x) 是什麼。你可以說它是 +1，因為 +1 的圖都對稱；也可以說它是 −1，因為 −1 的圖左上角都是黑的。兩種理由都成立，所以不管你答什麼，出題的老師都可以說你「沒學會」。

### 把它變成數學：No Free Lunch

接著換成可以窮舉的版本：X = {0,1}³，只有 8 種可能的輸入。D 給了其中 5 個輸入的標籤，剩下 3 個輸入的標籤未知，所以和 D 一致的目標函數 f 有 2³ = 8 種。

演算法從 H 裡挑一個在 D 上全對的 g。問題是：在 D 以外那 3 個點上，g 對不對，完全取決於真正的 f 是 8 種裡的哪一種。只要任何 f 都可能發生，**g 在 D 裡一定對，在 D 外卻沒有任何保證**，而 D 外才是我們真正要的。

這一節的 Fun Time 是一個網路流行題：(5, 3, 2) → 151022，問 (7, 2, 5) → ?。這等於 N = 1 的學習問題，參考答案是「沒有正確答案」。出題者心中的規則只是無限多種可能規則之一。

**Fall 2026 補充（04e）**：extended slides 用數列 1, 4, 1, 5 再示範一次：同樣的前四項，可以用三條不同的遞迴式接出三種不同的下一項，「any number can be the next!」。接著把 Wolpert 1996 的 No Free Lunch 定理粗略寫成一句話：在對學習問題沒有任何假設時，所有學習演算法的表現都一樣。換句話說，沒有一個演算法對所有問題都最好。

## 機率來救援：抽彈珠與 Hoeffding

學習問題的 f 在 D 外不可知，那換一個場景：有一個罐子，裡面有很多橘色與綠色彈珠，橘色比例 µ 未知。我們不可能數完所有彈珠，但可以抽 N 顆出來，看樣本中的橘色比例 ν。

ν 能告訴我們 µ 嗎？投影片的回答分成兩半：

- **possibly not**：樣本可能大部分是綠的，罐子裡卻大部分是橘的。
- **probably yes**：ν 很可能接近 µ。

「很可能接近」可以寫成 **Hoeffding 不等式**：N 顆彈珠獨立抽出時，

**P[ |ν − µ| > ε ] ≤ 2 exp(−2ε²N)**

投影片強調三件事：它對所有 N 與 ε 都成立；它不依賴 µ，所以不需要知道 µ；N 越大或容許的誤差 ε 越寬，ν ≈ µ 的機率就越高。「ν = µ」這個說法因此是 **probably approximately correct（PAC）**：大概、差不多正確。

這一節的 Fun Time 很適合手算一次：µ = 0.4，抽 10 顆，ν ≤ 0.1 的機率上界是多少？代入 N = 10、ε = 0.3，得到 2exp(−1.8) ≈ 0.33。投影片補了一句：實際機率遠小於這個數，Hoeffding 只給上界。

## 連回學習：驗證一個假說

把彈珠換成學習的元件：

| 罐子 | 學習 |
|---|---|
| 一顆彈珠 | 一個輸入 x ∈ X |
| 橘色 | 固定的 h 在這個 x 上答錯：h(x) ≠ f(x) |
| 綠色 | h 在這個 x 上答對 |
| 從罐子獨立抽 N 顆 | 從某個分布 P 獨立抽出 x₁,…,x_N，得到 D |

這樣一換，學習流程圖多了一個元件：產生輸入的**未知分布 P**。對任何**固定**的 h，定義

- E_out(h) = 在 P 上 h(x) ≠ f(x) 的機率（相當於 µ）
- E_in(h) = h 在 D 上答錯的比例（相當於 ν）

Hoeffding 直接給出 P[ |E_in(h) − E_out(h)| > ε ] ≤ 2exp(−2ε²N)。而且 f 與 P 都可以保持未知。如果 E_in(h) 又很小，就能說 h ≈ f，這是 PAC 意義下的保證。

但投影片馬上指出限制：這只是**驗證**。如果演算法被迫只能交出這一個 h，那 E_in(h) 幾乎不會剛好很小。真正的學習是 A 在 H 裡做選擇，像 PLA 那樣。

這一節的 Fun Time 是一個投資問題：朋友說某支股票「早上跌下午就漲」，你從過去 10 年隨機挑 100 天，有 80 天符合。最好的保證是什麼？參考答案是：如果市場行為和過去 10 年類似，接下來 100 天照這個規則操作「很可能」賺錢。「從另外 20 個朋友的規則裡挑最好的一個」就不在保證範圍內了，因為那已經是在做選擇，不是驗證。

## 連回真正的學習：有選擇就有代價

### 丟硬幣遊戲

投影片的例子：一個 150 人的台大 ML 班，每人丟 5 次硬幣，有一位同學丟出 5 次正面。她的硬幣神奇嗎？不。就算每枚硬幣都公正，150 人裡至少一人丟出 5 次正面的機率是 1 − (31/32)¹⁵⁰，超過 99%。

這就是「選擇」的問題。單看一枚硬幣，5 次正面很罕見；但從 150 枚裡挑最好的那枚，罕見的事幾乎一定會發生。

### BAD data 與 union bound

投影片把「E_in 和 E_out 差很遠」的資料集叫做 **BAD data**。對單一個 h，Hoeffding 保證 BAD data 的機率很小。

演算法要能自由地在 M 個假說裡挑，就需要 D 對每一個 h 都不是 BAD。只要有一個 h 碰上 BAD data，A 就可能剛好挑到它。用 union bound 加起來：

**P_D[BAD D] ≤ P_D[BAD D for h₁] + … + P_D[BAD D for h_M] ≤ 2M exp(−2ε²N)**

投影片稱它是「有限個罐子版本的 Hoeffding」：對所有 M、N、ε 都成立，也不需要知道任何 E_out(h_m)。所以不管 A 怎麼挑，「E_in(g) = E_out(g)」都是 PAC。最合理的 A（像 PLA 或 pocket）會挑 E_in 最小的假說。

### 結論與下一個問題

整理成一句話：**如果 |H| = M 有限、N 夠大，A 又找到 E_in(g) ≈ 0 的 g，就有 PAC 保證 E_out(g) ≈ 0，學習是可行的。**

但感知器的 H 有無限多條線，M = ∞ 時 2M exp(−2ε²N) 直接失效。這一節最後的 Fun Time 已經埋了伏筆：四個假說 sign(x₁)、sign(x₂)、sign(−x₁)、sign(−x₂) 之中，h₁ 與 h₃ 的 BAD data 完全相同，所以 union bound 可以從 8exp(−2ε²N) 收緊到 4exp(−2ε²N)。很多假說其實「長得很像」，這個觀察就是下一講處理無限 H 的起點。

**Fall 2026 補充（04e）**：extended slides 最後一頁把 M 個假說畫成共用同一組 x₁,…,x_N 的 M 個罐子，強調這是 dependent sampling：各假說的 BAD 事件互相相關，不像丟硬幣遊戲那樣各自獨立，所以很難直接分析，union bound 是保守的做法。

## 練習：Fall 2026 hw1 Q6–10 與 Fall 2024 HW2

兩份作業都公開，沒有官方解答，批改只限修課生。

**[Fall 2026 hw1](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/hw1.pdf) 的「Feasibility of Learning」段**（10/21 截止）：

- Q6：off-training-set error。6 個點的 universe 裡任選 3 個當 D，用感知器做到 E_in = 0，問 D 外錯誤率的最小與最大值。這題是 No Free Lunch 的直接演練。
- Q7：用 Monte Carlo 丟飛鏢估計 π，要丟幾支才能讓誤差在 10⁻² 內的機率超過 0.999，照課堂版 Hoeffding 推。
- Q8–9：在 [−1, +1]² 上算兩個假說的 E_out，再算抽 4 個點時兩者 E_in 相等的機率。題目註明這是分不出哪個假說比較差的 BAD data。
- Q10：用骰子代替彈珠做 multiple-bin sampling。每個數字是一個假說、每顆骰子是一個樣本，問抽 5 顆時「某個數字全是綠色」的機率。

**[Fall 2024 HW2](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw2/hw2_red.pdf)** 有幾題練的是同一件事（這份作業涵蓋 L4–L7）：

- Q2：16 袋黑白各半的牌，各抽 5 張，至少一手全白的機率。這是獨立版的丟硬幣遊戲。
- Q5：批判 chatGPT 對「已知前 N − 1 項來自某個 N 次多項式，能不能預測下一項」的回答，練 No Free Lunch 的論證。
- Q6–7：四種彩券的多罐子遊戲，題目提示把每個數字看成假說、抽到的彩券看成資料，並說明 Q6 要考慮抽樣相依。
- Q8：M 台吃角子老虎機，從單邊 Hoeffding 出發，證明所有機器、所有時間步的上信賴界能以至少 1 − δ 的機率同時成立。題目提示這是 multi-armed bandit 的 upper-confidence bound 演算法的核心技巧。

沒有解答時，機率題最直接的自我驗收是模擬。例如 Hoeffding 那題 Fun Time：

```python
import numpy as np
rng = np.random.default_rng(0)
mu, N, trials = 0.4, 10, 1_000_000
nu = rng.binomial(N, mu, size=trials) / N
print("simulated P[nu <= 0.1]:", (nu <= 0.1).mean())
print("Hoeffding bound:", 2 * np.exp(-2 * 0.3**2 * N))
```

模擬值會遠小於 0.33，正好對應投影片說的「Hoeffding 只給上界」。hw1 Q9、Q10 這類題目也可以用同樣方式，先模擬出數值，再去檢查你的推導。

## 今晚可以做的事

1. 看 [Connection to Real Learning](https://youtu.be/MFL6xDn1lXM) 這一支，然後自己寫出「一個 h 的 Hoeffding」到「M 個 h 的 union bound」這兩行，不看投影片。
2. 跑上面的模擬，把 N 改成 100、1000，看模擬機率和 Hoeffding 上界的差距怎麼變。
3. 模擬丟硬幣遊戲：150 人各丟 5 次，重複一萬次，數有幾次至少一人 5 次正面，和 1 − (31/32)¹⁵⁰ 對照。

## 延伸閱讀

- [Wolpert, The Lack of A Priori Distinctions Between Learning Algorithms](https://direct.mit.edu/neco/article-abstract/8/7/1341/6016/The-Lack-of-A-Priori-Distinctions-Between-Learning)（Neural Computation, 1996）：課程頁列出的 No Free Lunch 原始論文。
- [Caltech Learning from Data](https://work.caltech.edu/telecourse)：同一本教科書的英文課，第 2 講「Is Learning Feasible?」對應這一講。
- [Stanford CS229 導讀](/posts/ai/2026-08-21-stanford-cs229-machine-learning)：學習理論的另一種講法。

**系列導覽**：上一篇 [學習問題、PLA 與學習的種類](/posts/ai/2026-09-30-ntu-htlin-ml-learning-problem-perceptron)｜[總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)｜下一篇 [訓練與測試：有效假說數、成長函數與 break point](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/) — Lecture 4 的小節標題與投影片
- [Lecture 4: Feasibility of Learning（04_handout.pdf）](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/04_handout.pdf)
- [Lecture 4 extended slides（04e_handout.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/04e_handout.pdf)
- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) — W3 課前必看清單、LFD 章節與延伸閱讀
- [Fall 2026 Homework 1（hw1.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/hw1.pdf)
- [Fall 2024 Homework 2（hw2_red.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw2/hw2_red.pdf)
- [Wolpert (1996), The Lack of A Priori Distinctions Between Learning Algorithms](https://direct.mit.edu/neco/article-abstract/8/7/1341/6016/The-Lack-of-A-Priori-Distinctions-Between-Learning)
- [Learning from Data 教科書網站](http://amlbook.com)
- [Caltech Learning from Data telecourse](https://work.caltech.edu/telecourse)
