---
title: "林軒田機器學習基石 L5–L6：假說有無限多個，為什麼還能泛化？——成長函數與 break point"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, machine-learning, learning-theory, ai-course, course-guide]
lang: zh-TW
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 3
tldr: "L4 的 Hoeffding 保證裡有一個 M（假說個數），感知器有無限多條線，M 直接爆掉。L5 的解法是不數假說、改數它們在 N 筆資料上能切出幾種 ○× 組合（dichotomy），取最大值就是成長函數 m_H(N)。二維感知器在 4 個點上最多只切得出 14 種，不到 2⁴＝16，4 就是它的 break point。L6（官方標 optional）證明：只要有 break point，m_H(N) 就被一個多項式壓住，VC bound 因此成立。"
description: "台大林軒田《機器學習基石》第 5–6 講導讀：從 union bound 為什麼高估講起，定義 dichotomy、成長函數、shatter 與 break point，走過 positive rays、positive intervals、convex sets、二維感知器四個例子；L6 的 bounding function B(N,k) 與 VC bound 證明三步驟放在折疊區。附 Caltech 英文 Lecture 6 對照與 Fall 2024 HW2 練習對應。"
draft: false
glossary:
  - term: "dichotomy"
    aliases: ["二分法", "dichotomies"]
    definition: "把一個假說 h 只看它在 N 筆輸入 x₁…x_N 上的輸出，得到一個長度 N 的 ○× 向量。無限多個假說在固定的 N 個點上，最多只有 2^N 種 dichotomy。"
    context: "林軒田《機器學習基石》L5 用它取代「假說個數 M」。"
    links:
      - label: "L5 投影片"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/05_handout.pdf"
  - term: "成長函數"
    aliases: ["growth function", "m_H(N)"]
    definition: "對所有可能的 N 筆輸入取最大，假說集合 H 能產生的 dichotomy 數量。上限是 2^N。"
    context: "VC bound 裡用它取代 Hoeffding + union bound 中的 M。"
    links:
      - label: "L5 投影片"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/05_handout.pdf"
  - term: "break point"
    aliases: ["最小 break point"]
    definition: "若沒有任何 k 個輸入能被 H shatter（切出全部 2^k 種組合），k 就是 H 的 break point；k+1、k+2… 也都是。課程通常只討論最小的那個。"
    context: "二維感知器的 break point 是 4。"
    links:
      - label: "L5 投影片"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/05_handout.pdf"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function-en)

**影片狀態：已附影片；播放未逐支確認。** [影片來源與說明](#課程影片來源)

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)系列第 3 篇，接續[學習可行嗎：Hoeffding 與「出了資料之外」](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning)。範圍是[《機器學習基石》](https://www.csie.ntu.edu.tw/~htlin/mooc/)第 5 講 Training versus Testing 與第 6 講 Theory of Generalization，也就是四大問題裡「Why Can Machines Learn?」的前半段。

用到的官方材料：

- MOOC 投影片 [05_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/05_handout.pdf)（L5）、[06_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/06_handout.pdf)（L6），以及 Fall 2026 新增的 [05e_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/05e_handout.pdf)（L5 extended slides，3 頁）。
- [基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)的第 18–25 支影片（下面逐支列出）。
- 教科書 [Learning from Data](http://amlbook.com)（LFD）：L5 對應 2.0、2.1.1，L6 對應 2.1.2（依 [Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)）。
- 練習：[Fall 2024 HW2](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw2/hw2_red.pdf)。

**存取等級**：只看影片與投影片是 A2；加上 Fall 2024 的作業 PDF，這一段可以做到 A3，但沒有官方解答，Gradescope 批改只限修課生。分級定義見[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)。

## 課程影片來源

以下沿用本文已列出的課程影片來源；尚未逐支重新驗證可播放狀態，不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=6FWRijsmLtE
title: Caltech Lecture 6（Yaser Abu-Mostafa）
```

```youtube
url: https://www.youtube.com/watch?v=4aIAxH8eBMs
title: Recap and Preview
```

原始影片：[Caltech Lecture 6（Yaser Abu-Mostafa）](https://www.youtube.com/watch?v=6FWRijsmLtE)、[Recap and Preview](https://www.youtube.com/watch?v=4aIAxH8eBMs)、[Effective Number of Lines](https://www.youtube.com/watch?v=oAW0_j8_l3Y)、[Effective Number of Hypotheses](https://www.youtube.com/watch?v=dnVofdAomWY)、[Break Point](https://www.youtube.com/watch?v=z3TpJRqPzcg)、[Restriction of Break Point](https://www.youtube.com/watch?v=rUFqB5Z3YHQ)、[Bounding Function: Basic Cases](https://www.youtube.com/watch?v=OmRekto9rkc)、[Bounding Function: Inductive Cases](https://www.youtube.com/watch?v=6jtWUmaBqFU)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

## L6 是選修，這篇怎麼處理

兩個學期都把 L6 標成非必看。[Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)把 L6 的四支影片列在 W4（09/30）的「suggested watching (anytime)」，L5 的影片則是「required watching (before class)」。Fall 2024 課程頁把 L6 放在「optional」，旁邊並列兩個版本：Caltech Yaser Abu-Mostafa 的[英文 Lecture 6](https://www.youtube.com/watch?v=6FWRijsmLtE)，以及林軒田的中文版四段。

所以本篇的正文只講 L5 的概念，加上 L6 的**結論**：break point 會把成長函數壓成多項式。證明步驟全部收在折疊區塊，想跳過的讀者不會漏掉後面需要的東西。

## 問題出在哪：M 是無限大

L4 的結論是：假說集合有限（|H| = M）、資料量 N 夠大時，

P[|E<sub>in</sub>(g) − E<sub>out</sub>(g)| > ε] ≤ 2 · M · exp(−2ε²N)

L5 開場先把學習拆成兩個問題（投影片第 3 頁）：

1. E<sub>out</sub>(g) 跟 E<sub>in</sub>(g) 夠接近嗎？
2. E<sub>in</sub>(g) 能不能做到夠小？

M 在這兩題上的作用剛好相反。M 小，第一題有保證，但選擇太少，第二題做不好；M 大則反過來。問題是 L2 的感知器（PLA）有無限多條線，M = ∞，上面那條不等式直接失效。

投影片第 7–8 頁指出 M 從哪裡來：為了讓演算法自由挑假說，要 bound「任何一個假說出現 BAD 事件」的機率，用的是 union bound，也就是假設每個假說的 BAD 事件互不重疊、機率直接相加。但兩條很接近的線 h₁ ≈ h₂，在大部分資料集上的 E<sub>in</sub> 根本一樣，它們的 BAD 事件高度重疊。union bound 把重疊的部分重複算了無限次。

**L5 的想法**：既然相似的假說會一起出事，就把它們按「種類」分組，改數種類。

## 從數線條到數 dichotomy

### 從一個點的視角看，有幾種線

平面上有無限多條線。但如果只從一個輸入 x₁ 看，線只有兩種：把 x₁ 判成 ○ 的，和判成 × 的。兩個點是 4 種，三個點一般位置是 8 種；三點共線時只剩 6 種。四個點呢？投影片第 13 頁說：**不管四個點怎麼放，最多 14 種**，比 2⁴ = 16 少。

少掉的兩種就是 XOR 形狀：對角同色、另一條對角異色，一條直線切不出來。

這個「最多幾種」就叫 effective number of lines。只要它能取代 M，而且遠小於 2<sup>N</sup>，無限多條線也能學。

### Dichotomy 與成長函數

把上面的直覺一般化（投影片第 16–17 頁）：

- **Dichotomy**：假說 h 只看它在 x₁…x<sub>N</sub> 上的輸出，得到一個 ○× 向量 (h(x₁), …, h(x<sub>N</sub>))。H 在這 N 個點上能產生的所有 dichotomy 記為 H(x₁, …, x<sub>N</sub>)，數量最多 2<sup>N</sup>。
- **成長函數** m<sub>H</sub>(N)：dichotomy 數量會隨輸入怎麼擺而變，所以對所有可能的 N 個輸入取最大值，消掉對輸入的依賴。

### 四個例子

投影片第 18–23 頁算了四個假說集合，這四個例子會一路用到 L7：

| 假說集合 | 長相 | m<sub>H</sub>(N) | break point |
|---|---|---|---|
| positive rays | 一維，h(x) = sign(x − a) | N + 1 | 2 |
| positive intervals | 一維，區間內為 +1 | ½N² + ½N + 1 | 3 |
| convex sets | 二維，凸區域內為 +1 | 2<sup>N</sup> | 沒有 |
| 2D perceptrons | 平面上的線 | 在某些 N 上 < 2<sup>N</sup> | 4 |

Convex sets 的算法值得記住：把 N 個點放在一個大圓上，任何一種 ○× 組合都能用「沿著所有 ○ 點外緣稍微擴一點」的凸區域做出來。這種「存在 N 個點能切出全部 2<sup>N</sup> 種」的情形叫做 **shatter**。

[05e extended slides](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/05e_handout.pdf) 補了兩個例子。一維正負 ray（也就是 decision stump）的 m<sub>H</sub>(N) = 2N：正 ray 有 N + 1 種，負 ray 對稱也有 N + 1 種，全 ○ 和全 × 重複算了，要扣 2。過原點的二維感知器也是 2N，做法是把點正規化到單位半圓上，再用掃角度的方式化約成 decision stump。

**怎麼做**：拿一張紙，畫 4 個點，親手找出二維感知器切不出來的那兩種組合。這是整段 VC 理論最具體的一個畫面。

## Break point：成長函數在哪裡停止指數成長

投影片第 24 頁的定義：**如果沒有任何 k 個輸入能被 H shatter，k 就是 H 的 break point**，也就是 m<sub>H</sub>(k) < 2<sup>k</sup>。k 是 break point，k + 1、k + 2… 也都是，課程只討論最小的那個。

注意定義裡的量詞。二維感知器在 3 個點上「存在」一組能 shatter（一般位置的三點）；在 4 個點上則是「對所有」擺法都不能 shatter。所以 break point 是 4。

投影片第 25 頁從上面的表觀察到一個猜想：

- 沒有 break point：m<sub>H</sub>(N) = 2<sup>N</sup>，這是確定的。
- break point 為 k：m<sub>H</sub>(N) = O(N<sup>k−1</sup>)。

positive rays（k = 2）是 O(N)，positive intervals（k = 3）是 O(N²)，都吻合。如果猜想成立，把 m<sub>H</sub>(N) 放進 Hoeffding 取代 M，多項式遲早會被 exp(−2ε²N) 壓下去。L6 證的就是這件事。

## L6：break point 怎麼壓住成長函數

L6 的四支影片是 Restriction of Break Point、Bounding Function: Basic Cases、Bounding Function: Inductive Cases、A Pictorial Proof。結論只有兩句：

1. 定義 **bounding function** B(N, k)：在 break point 為 k 的前提下，m<sub>H</sub>(N) 最大可能是多少。它是純組合數量，跟 H 長什麼樣無關，例如 positive intervals 和一維感知器的 break point 都是 3，都被 B(N, 3) 管住。
2. 可以證明 B(N, k) ≤ Σ<sub>i=0</sub><sup>k−1</sup> C(N, i)，最高次項是 N<sup>k−1</sup>。所以**只要存在 break point，m<sub>H</sub>(N) 就是 N 的多項式**。

最後把 m<sub>H</sub> 放回 BAD 事件的機率，得到 Vapnik–Chervonenkis（VC）bound（投影片第 25 頁）：

P[∃h ∈ H 使得 |E<sub>in</sub>(h) − E<sub>out</sub>(h)| > ε] ≤ 4 · m<sub>H</sub>(2N) · exp(−ε²N / 8)

跟原本的 2 · M · exp(−2ε²N) 相比，M 換成了 m<sub>H</sub>(2N)，常數也變差了。以二維感知器來說，break point 是 4，m<sub>H</sub>(N) 是 O(N³)，所以用二維感知器學習是可行的。這就是 L2 的 PLA 在理論上被「救回來」的時刻。

<details>
<summary>證明一：B(N, k) 的表格與遞迴式（投影片第 6–19 頁）</summary>

**邊界情形**（第 8–10 頁）：

- B(N, 1) = 1：連一個點都不能 shatter，表示每一欄只能有同一個符號，放進第一個 dichotomy 之後就不能再放別的。
- B(N, k) = 2<sup>N</sup>，當 N < k：點數還沒到 break point，所有組合都可以放。
- B(N, k) = 2<sup>N</sup> − 1，當 N = k：拿掉任意一種組合就滿足「不能 shatter k 個點」。

**遞迴情形**（第 12–17 頁）以 B(4, 3) 為例。窮舉 2<sup>2⁴</sup> 種 dichotomy 集合之後，最大是 11 種。把這 11 種按前三個點 (x₁, x₂, x₃) 分組：

- 前三碼相同、x₄ 分別為 ○ 與 × 的成對出現，有 α 組（共 2α 個）。
- 前三碼只出現一次的有 β 個。

所以 B(4, 3) = 2α + β。接著兩個觀察：

- α + β 是 (x₁, x₂, x₃) 上的 dichotomy，原本就不能 shatter 任何 3 個點，所以 α + β ≤ B(3, 3)。
- α 這部分如果能 shatter 前三點中的任意 2 個，配上成對的 x₄ 就 shatter 了 3 個點，矛盾。所以 α ≤ B(3, 2)。

推廣後得到 B(N, k) ≤ B(N − 1, k) + B(N − 1, k − 1)。用歸納法就能證明 B(N, k) ≤ Σ<sub>i=0</sub><sup>k−1</sup> C(N, i)。投影片第 18 頁說這個「≤」其實可以是「=」，留給喜歡數學的讀者自己證；Fall 2024 HW3 的 bonus 題 Q13 正好就是要你證 ≥ 這個方向。

投影片第 11 頁的小題提醒一件事：二維感知器的 m<sub>H</sub>(4) = 14，但 B(4, 4) = 15。bounding function 可以很鬆。

</details>

<details>
<summary>證明二：VC bound 的圖解證明三步驟（投影片第 21–25 頁）</summary>

目標是把「有無限多個 E<sub>out</sub>」的問題變成「只有有限多種情形」。

1. **用 E′<sub>in</sub> 取代 E<sub>out</sub>**：再抽一份同樣大小 N 的驗證資料 D′（ghost data），在上面算 E′<sub>in</sub>。如果 h 在 E<sub>in</sub> 和 E<sub>out</sub> 之間出了 BAD，它在 E<sub>in</sub> 與 E′<sub>in</sub> 之間也很可能出 BAD。這一步讓 ε 變成 ε/2，機率前面多乘 2。
2. **按種類分解 H**：現在只看 D 與 D′ 共 2N 個點，假說在這 2N 個點上最多只有 m<sub>H</sub>(2N) 種。對這有限多種做 union bound。
3. **不放回的 Hoeffding**：把 2N 個例子看成一個小罐子，隨機抽 N 個算 E<sub>in</sub>，剩下的算 E′<sub>in</sub>。|E<sub>in</sub> − E′<sub>in</sub>| > ε/2 等價於 |E<sub>in</sub> − (E<sub>in</sub> + E′<sub>in</sub>)/2| > ε/4，對固定的 h 套用不放回版本的 Hoeffding。

三步合起來就是 4 · m<sub>H</sub>(2N) · exp(−ε²N / 8)。投影片第 26 頁的小題把 positive rays 代進去（ε = 0.1、N = 10,000），得到的 bound 約是 0.298。一萬筆資料，BAD 機率的上界還是不小。這個鬆散程度 L7 會再回來談。

</details>

## 影片清單

L5（Fall 2026 列為課前必看）：

- [Recap and Preview](https://www.youtube.com/watch?v=4aIAxH8eBMs)
- [Effective Number of Lines](https://www.youtube.com/watch?v=oAW0_j8_l3Y)
- [Effective Number of Hypotheses](https://www.youtube.com/watch?v=dnVofdAomWY)
- [Break Point](https://www.youtube.com/watch?v=z3TpJRqPzcg)

L6（兩個學期都是選修）：

- [Restriction of Break Point](https://www.youtube.com/watch?v=rUFqB5Z3YHQ)
- [Bounding Function: Basic Cases](https://www.youtube.com/watch?v=OmRekto9rkc)
- [Bounding Function: Inductive Cases](https://www.youtube.com/watch?v=6jtWUmaBqFU)
- [A Pictorial Proof](https://www.youtube.com/watch?v=GcxpsIvR7t8)

英文對照：[Caltech Learning from Data](https://work.caltech.edu/telecourse) 的 Lecture 5 也叫 Training versus Testing，Lecture 6 叫 Theory of Generalization，用的是同一本教科書。Fall 2024 課程頁直接把 [Abu-Mostafa 的 Lecture 6](https://www.youtube.com/watch?v=6FWRijsmLtE) 放在林軒田中文版旁邊。

## 練習：Fall 2024 HW2

[HW2](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw2/hw2_red.pdf) 在 2024-09-23 發布、10/07 截止，滿分 200 分另有 20 分 bonus。題目涵蓋 L4 到 L7，跟本篇直接相關的是這幾題：

- **Q1**：只允許斜率 1 或 −1 的二維感知器，N ≥ 4 時的成長函數。
- **Q3**：一定要通過點 (11, 26) 的二維感知器的成長函數。可以先讀 05e 裡「過原點感知器化約成 decision stump」的那一頁。
- **Q4**：6211 個固定感知器組成的有限集合，VC 維度最緊的上界（這題用到 L7 的定義，但想法是「有限個假說最多切出幾種組合」）。
- **Q10–12**：decision stump。Q10 證明在指定的雜訊資料分布下 E<sub>out</sub>(h<sub>s,θ</sub>) = u + v·|θ|；Q11 實作一維 decision stump 演算法，在 N = 12、雜訊 15% 下重複 2000 次，畫 (E<sub>in</sub>, E<sub>out</sub>) 散佈圖；Q12 改成隨機挑假說再比一次。
- **Q13（bonus）**：多維 decision stump 的 VC 維度上界。

Q2、Q6、Q7 是 L4 的多 bin 抽樣題，放在[上一篇](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning)。Fall 2024 HW3 的 Q13 bonus 則是證 B(N, k) 的下界，見上面證明一的折疊區塊。

**怎麼做**：Q11 和 Q12 不需要任何資料集，程式自己產生資料。兩張散佈圖放在一起，看「挑 E<sub>in</sub> 最小的假說」和「隨便挑一個」的 E<sub>out</sub> − E<sub>in</sub> 中位數差多少，這就是本篇在問的泛化差距。沒有官方解答，可以用 Q10 推出的 E<sub>out</sub> 公式驗算自己的模擬結果。

Fall 2026 的 hw2 依課程頁排程在 10/07 公布，截至 2026-09-30 還沒公開。

## 下一步

下一篇[VC 維度、雜訊與誤差衡量](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error)會把「最大的非 break point」正式命名為 VC 維度 d<sub>VC</sub>，證明 d 維感知器的 d<sub>VC</sub> = d + 1，再把理論推廣到有雜訊的資料。

延伸閱讀：Stanford CS229 的[泛化一章導讀](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-08-generalization)用不同的路線講同一個問題，可以對照。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [Machine Learning Foundations / Techniques MOOC 頁（林軒田）](https://www.csie.ntu.edu.tw/~htlin/mooc/)
- [L5 Training versus Testing 投影片](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/05_handout.pdf)
- [L6 Theory of Generalization 投影片](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/06_handout.pdf)
- [L5 extended slides（Fall 2026）](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/05e_handout.pdf)
- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)
- [Fall 2024 Homework 2](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw2/hw2_red.pdf)
- [Fall 2024 Homework 3](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf)
- [Caltech Learning from Data telecourse](https://work.caltech.edu/telecourse)
- [Caltech Lecture 6（Yaser Abu-Mostafa）](https://www.youtube.com/watch?v=6FWRijsmLtE)
- [Learning from Data 教科書](http://amlbook.com)
- [MOOC 投影片勘誤](https://www.csie.ntu.edu.tw/~htlin/mooc/errata.php)
