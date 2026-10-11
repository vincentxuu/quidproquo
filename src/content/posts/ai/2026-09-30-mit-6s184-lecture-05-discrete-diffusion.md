---
title: "MIT 6.S184 L5：離散擴散，用 CTMC 生成語言"
date: 2026-09-30
category: ai
type: guide
tags: [ai-course, mit, diffusion-model, flow-matching, generative-ai, language-model]
lang: zh-TW
series:
  name: "MIT 6.S184 導讀"
  order: 9
tldr: "文字是一串離散 token，沒有方向可以走，ODE 和 SDE 都不存在。第 5 講把前四講的配方原封不動搬過來，只換掉底層的隨機過程：向量場換成 rate matrix，ODE 換成連續時間馬可夫鏈（CTMC），continuity equation 換成 Kolmogorov forward equation。用 factorized mixture path 當機率路徑時，要學的邊際 rate matrix 只剩一個未知數：給定加噪句子，每個位置原本是哪個 token 的機率。於是訓練離散擴散模型變成對每個位置做分類，loss 就是 cross-entropy；把雜訊設成全部 [mask]，就得到 masked diffusion language model。"
description: "MIT 6.S184（IAP 2026）第 5 講導讀，依講義 §7（標為 Optional，沒有對應 lab）、Slides 5 與錄影：CTMC 與 rate matrix（Theorem 33、Example 34）、factorized CTMC 與 Algorithm 7、factorized mixture path（Example 35）、離散 marginalization trick（Theorem 36）、Kolmogorov forward equation（Proposition 2）、Example 37、Theorem 38 與 discrete flow matching loss、masked diffusion language model（Example 39）、Algorithm 8、Remark 40 generator matching。"
draft: false
glossary:
  - term: "rate matrix"
    aliases: ["速率矩陣", "Q_t"]
    definition: "CTMC 裡取代向量場的物件。Q_t(y|x) 是在時間 t 從狀態 x 跳到 y 的瞬間速率：非對角項不小於 0，對角項等於所有離開速率總和的負值。"
    context: "MIT 6.S184 講義 §7.1，eq. (84)–(87)。"
  - term: "CTMC"
    aliases: ["continuous-time Markov chain", "連續時間馬可夫鏈"]
    definition: "狀態空間離散、時間連續、沒有記憶的隨機過程。未來只取決於現在的狀態，行為由 rate matrix 完全決定（講義 Theorem 33）。"
    context: "MIT 6.S184 講義把 CTMC 當成 SDE 在離散空間的類比。"
  - term: "factorized mixture path"
    aliases: ["逐 token 混合路徑"]
    definition: "離散擴散最常用的機率路徑：每個位置獨立地以機率 κ_t 保留資料 token、以機率 1−κ_t 換成雜訊 token。κ_t 從 0 單調增加到 1。"
    context: "MIT 6.S184 講義 Example 35；雜訊設成 [mask] 時就是 masked diffusion language model（Example 39）。"
---

> 🌏 [English version](/posts/ai/2026-09-30-mit-6s184-lecture-05-discrete-diffusion-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文依據 [MIT 6.S184](https://diffusion.csail.mit.edu/2026/index.html) IAP 2026 的[講義](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) §7（pp.54–66）、[Slides 5](https://diffusion.csail.mit.edu/2026/docs/20260130_Lecture_05.pdf)，以及[第 5 講錄影](https://www.youtube.com/watch?v=d0kmyEJN2hI)（1 小時 21 分）。Theorem、Example、Algorithm、eq. 編號都照講義。存取等級 A3：講義、slides、錄影、lab 與官方解答都公開；但這一講**沒有對應的 lab**，講義 §1.2 也把 §7 標成 Optional。2026-09-30 核對。

**系列位置**：上一篇 [Lab 3：DiT、VAE 到 latent diffusion](/posts/ai/2026-09-30-mit-6s184-lab-03-dit-vae-latent-diffusion)｜本篇是系列最後一篇｜[系列總覽](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview)

前四講處理的資料都是向量：一張圖是 `R^d` 裡的一個點，向量場告訴每個點往哪個方向走。文字不是這樣。一句話是一串 token，「cat」和「dog」之間沒有中間點，也沒有「往 dog 的方向走一小步」這回事。

講義 §7 開頭把話講得很直：離散狀態空間裡**沒有數學意義上的擴散過程**，SDE 在這裡不存在。機器學習文獻說的「discrete diffusion model」，其實是把 flow matching 的學習原則搬到另一種隨機過程上：**連續時間馬可夫鏈（CTMC）**。Slides 5 的標題也因此寫成「Discrete diffusion models and discrete flow matching」。

這一講的好消息是：你在[第 2 講](/posts/ai/2026-09-30-mit-6s184-lecture-02-flow-matching)學過的配方一步都不用改。講義 §7.2 開頭列的三步就是 flow matching 的三步：(1) 造一條從雜訊到資料的機率路徑；(2) 推出條件與邊際的訓練目標；(3) 不模擬就能學會邊際目標。變的只是每一步裡的物件。

時間慣例和整個系列一樣：t=0 是雜訊，t=1 是資料。

## 課程影片來源
2026-10-10 已即時回官方課程頁核對講次與影片連結，影片公開且允許嵌入。

```youtube
url: https://www.youtube.com/watch?v=d0kmyEJN2hI
title: MIT 6.S184: Flow Matching and Diffusion Models - Lecture 05 - Discrete Diffusion Models (2026)
```

原始影片：[MIT 6.S184: Flow Matching and Diffusion Models - Lecture 05 - Discrete Diffusion Models (2026)](https://www.youtube.com/watch?v=d0kmyEJN2hI)

課程與錄影入口：

- [mit-6s184 — official course materials and recording index](https://diffusion.csail.mit.edu/2026/index.html)

查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-10）：讀了影片大部分字幕（81 分 11 秒，與文中「1 小時 21 分」相符）：CTMC 與 rate matrix、factorized 設計與每個位置平行跳、mixture path 與 mask、Kolmogorov forward equation、學 rate matrix 等於分類（對每個位置做 softmax 與 negative log likelihood）、masked diffusion LM 與 LLaDA 示範、與自回歸模型的取捨（平行生成、任意順序、KV cache 較難），以及結尾的課程評鑑提醒。與本文相符。字幕裡聽不到 Slides 5 的 “teleported”、“Only unknown!” 等標註與講義編號，那些依 slides 與講義。

## 先看對照表：每個連續物件都有離散版

Slides 5 把連續 flow matching 的六格表（條件／邊際 × 機率路徑／向量場／loss）直接換成離散版。下表把講義裡對應的編號排在一起，後面每一節就是在填這張表：

| 連續（第 1–3 講） | 離散（第 5 講） |
|---|---|
| 狀態空間 `R^d` | `S = V^d`：長度 d 的 token 序列，詞彙量 V |
| 向量場 `u_t(x)` | rate matrix `Q_t(y\|x)`（eq. 84–86） |
| ODE／SDE | CTMC（eq. 87） |
| 解的存在唯一（Theorem 3） | CTMC 存在唯一（Theorem 33） |
| Euler 取樣（Algorithm 1） | 逐 token Euler 取樣（eq. 88、Algorithm 7） |
| 高斯機率路徑（Example 8） | factorized mixture path（Example 35） |
| marginalization trick（Theorem 9） | 離散 marginalization trick（Theorem 36） |
| continuity equation（Theorem 11） | Kolmogorov forward equation（Proposition 2） |
| CFM loss：回歸 | discrete flow matching loss：分類 |

## CTMC：把「往哪走」換成「多快跳」

### 狀態空間與馬可夫性

講義先定狀態空間：詞彙表 `V = {v_1, …, v_V}`，序列長度 d，所有可能的句子就是 `S = V^d`。對語言來說 V 可以是字母或 token；講義也舉 DNA 當例子，V 是 4 種鹼基。

`X_t` 是在 S 上隨時間跳來跳去的隨機軌跡。講義要求它是**馬可夫過程**：未來只看現在，過去沒用。講義也順帶指出，ODE 和 SDE 其實也是馬可夫過程，只是不在離散空間上。狀態離散、時間連續，就叫 CTMC。

### Rate matrix：離散版的向量場

在連續空間，向量場告訴你「往哪個方向走」。離散空間只能**跳**，所以要描述的是「從 x 跳到 y 有多快」。這就是 rate matrix `Q_t(y|x)`，它有兩個條件：

1. **跳到別的狀態的速率不能是負的**：`Q_t(y|x) ≥ 0`，只要 y ≠ x。
2. **留在原地的速率等於離開速率總和的負值**：`Q_t(x|x) = −Σ_{y≠x} Q_t(y|x)`。講義的說法是，你要嘛留下、要嘛離開，沒有第三種選擇。

所以 rate matrix 的對角項都 ≤ 0，非對角項都 ≥ 0。

CTMC「跟著」rate matrix 走的意思，是轉移機率在 h=0 的導數等於 rate matrix，eq. (87)。這就是離散版的「微分方程」。

<details>
<summary>講義 eq. (84)–(87) 與 Theorem 33</summary>

```text
Q : S × S × [0,1] → R,  (x, y, t) ↦ Q_t(y|x)                              (84)
Q_t(y|x) ≥ 0            whenever x ≠ y                                    (85)
Q_t(x|x) = −Σ_{y≠x} Q_t(y|x)   for all x                                  (86)

d/dh p_{t+h|t}(X_{t+h}=y | X_t=x) |_{h=0} = Q_t(y|x)   for all x, y ∈ S   (87)
```

講義先驗證反方向：任何 CTMC 的轉移機率在 h=0 的導數，都會自動滿足 (85)–(86)。因為 h=0 時還沒時間跳，`p_{t|t}(y|x)=0`（y≠x），導數只能非負；再用機率總和為 1 推出 (86)。

**Theorem 33（CTMC 存在唯一）**：對任何有界、對時間連續的 rate matrix `Q_t`，都存在唯一的一組轉移機率滿足 eq. (87)。證明在講義附錄 C（p.74）。

它對機器學習的意義和第 1 講的 Theorem 3 一樣：你可以用神經網路造一個 rate matrix，然後放心假設它對應到唯一一條 CTMC。

</details>

### 一個算得出來的例子：兩個狀態來回跳

**Example 34**：狀態只有 a、b 兩個，兩個方向都以固定速率 λ 跳。這時轉移機率有封閉解：經過時間 h 後，留在原狀態的機率是 `(1 + e^{−2λh})/2`，跳到另一邊是 `(1 − e^{−2λh})/2`。

直覺很清楚：`e^{−2λh}` 是「對起點的記憶」在衰減。h 趨近無限時兩個機率都變成 1/2，鏈忘了自己從哪出發；λ 越大，忘得越快。Slides 5 用同一個例子示範「對轉移機率取導數就得到演化方程」。

### 怎麼模擬：離散版的 Euler

大多數 CTMC 的轉移機率沒有封閉解，你手上只有 rate matrix。但 eq. (87) 說轉移機率在小時間內近似線性，所以：

**下一步的分佈 ≈ 「留在原地」的指示函數 + h 倍的 rate matrix**，eq. (88)。

講義說，只要 h 夠小，這是個合法的機率分佈，從裡面抽一個類別就是一步模擬。這就是[第 1 講](/posts/ai/2026-09-30-mit-6s184-lecture-01-flow-diffusion-models) Euler 法的離散版。

<details>
<summary>講義 eq. (88)</summary>

```text
p_{t+h|t}(X_{t+h}=y | X_t=x) = 1_{y=x} + h Q_t(y|x) + R_t(h)      (R_t(h) 在 h 小時可忽略)
X_{t+h} ~ p̃_{t+h|t}(·|x) = (1_{y=x} + h Q_t(y|x))_{y∈S}                    (88)
```

</details>

## CTMC 模型：為什麼一定要 factorized

**CTMC 模型**（也就是離散擴散模型）由兩樣東西組成：初始分佈 `p_init`，以及神經網路 `Q_t^θ`。給定目前狀態 x，網路要輸出 rate matrix 的**一整欄** `{Q_t^θ(y|x)}_{y∈S}`，因為 eq. (88) 取樣時要用到所有 y。

問題馬上出現：`|S| = V^d`。詞彙量幾萬、序列長度幾百，這一欄大到電腦根本存不下。

解法是加一個稀疏限制：**一次只准改一個位置**。只差一個 token 的句子叫 x 的鄰居 `N(x)`，不是鄰居的 rate 一律為 0。這樣網路只要對每個位置 j、每個候選 token v 輸出一個 rate，輸出形狀是 **d × V**，跟序列長度線性成長，而不是指數成長。講義說幾乎所有 CTMC 模型都是 factorized 的，而一個 sequence 長度 d、輸出維度 V 的 transformer 就能輸出這種形狀。

Slides 5 用三個序列 x、y、z 示範鄰居關係：x 和 y 是鄰居、y 和 z 是鄰居，但 z 和 x 不是，因為它們差了兩個位置。

### Algorithm 7：每個位置平行跳

取樣時，每一步讓網路算出 d × V 的 rate，然後**每個位置各自、平行地**做一次 Euler 取樣：換成 v 的機率是 `h·q_j(v)`，留在原 token 的機率是 1 減掉這些。

這裡有個近似：真正的 factorized CTMC 一次只會動一個位置，但平行更新可能同時改到好幾個位置。講義說這個逐 token 近似跟完整的 CTMC Euler 步在 h 的一階上一致，同時更新多個位置的機率只有 O(h²)。

<details>
<summary>講義 Algorithm 7：從 factorized CTMC 模型取樣</summary>

```text
Require: factorized rate 網路 Q_t^θ、初始分佈 p_init、步數 n
1: t ← 0, h ← 1/n
2: 取 X_0 ~ p_init, X_0 = (X_0^(1), …, X_0^(d)) ∈ V^d
3: for i = 1, …, n:
4:     算出 factorized 跳躍速率 {q_j(v)}_{j=1..d, v∈V} ← Q_t^θ(·|X_t)
5:     for j = 1, …, d（平行）:
6:         x ← X_t^(j)
7:         p̃_{j,t}(v|x) = h·q_j(v)                 若 v ≠ x
                        = 1 − h·Σ_{v'≠x} q_j(v')   若 v = x
8:         X_{t+h}^(j) ~ Categorical(p̃_{j,t}(·|x))
10:    t ← t + h
12: return X_1
```

</details>

## 訓練：同一套 flow matching 配方

目標和連續情況一模一樣：訓練 `Q_t^θ`，讓 CTMC 從 `X_0 ~ p_init` 出發，到 t=1 時 `X_1 ~ p_data`。差別只在 `p_data` 現在是 S 上的機率質量函數，講義舉的例子是「網路上所有的文字」。

### 機率路徑：不是搬運，是淡入淡出

**離散條件機率路徑** `p_t(x|z)` 要求 t=0 時等於 `p_init`（跟 z 無關），t=1 時所有質量都在 z 上（`δ_z`）。邊際路徑一樣是對資料平均：`p_t(x) = Σ_z p_t(x|z) p_data(z)`，於是 `p_0 = p_init`、`p_1 = p_data`，eq. (89)。

最常用的具體路徑是 **factorized mixture path**（Example 35）。選一個排程 `κ_t`，從 `κ_0=0` 單調增加到 `κ_1=1`，然後**每個位置獨立地擲一枚硬幣**：

- 以機率 `κ_t` 保留資料 token `z_j`；
- 以機率 `1−κ_t` 換成一個從 `p_init` 抽的雜訊 token。

t=0 時每個 token 都被毀掉，t=1 時一個都沒毀。講義說這跟[第 2 講](/posts/ai/2026-09-30-mit-6s184-lecture-02-flow-matching)的高斯路徑很像，都是用排程控制資訊被毀掉的速度；但也有根本差別：高斯路徑是把機率質量**沿著空間搬過去**，mixture path 沒有方向可言，只是**把一個分佈淡出、另一個淡入**。Slides 5 的說法是機率被「teleported」，講義 Figure 19 用西洋棋盤圖案畫出這個過程。

<details>
<summary>講義 Example 35：factorized mixture path</summary>

```text
p_init(x) = Π_{j=1}^d p_init^(j)(x_j)
0 ≤ κ_t ≤ 1,  κ_0 = 0,  κ_1 = 1,  κ̇_t ≥ 0

p_t(x|z) = Π_{j=1}^d [ (1 − κ_t) p_init^(j)(x_j) + κ_t δ_{z_j}(x_j) ]

等價的取樣方式：
m_j ~ Bernoulli(κ_t),  ξ_j ~ p_init^(j)
x_j = m_j z_j + (1 − m_j) ξ_j,   j = 1, …, d
```

</details>

### 邊際 rate matrix：還是那個 marginalization trick

**條件 rate matrix** `Q_t^z` 是一個會讓 CTMC 沿著條件路徑 `p_t(·|z)` 走的 rate matrix，對應連續版的條件向量場。

**Theorem 36（離散 marginalization trick）** 說：把條件 rate matrix 用後驗機率 `p_{1|t}(z|x)` 加權平均，就得到邊際 rate matrix，而它的 CTMC 會沿著邊際路徑走，最後到達 `p_data`。這和第 2 講的 Theorem 9 是同一句話，只是向量場換成 rate matrix。`p_{1|t}(z|x)` 的意思是：看到時間 t 的加噪狀態 x，它原本是資料點 z 的機率。

<details>
<summary>講義 Theorem 36，eq. (90)</summary>

```text
Q_t(y|x) = Σ_{z∈S} Q_t^z(y|x) · p_t(x|z) p_data(z) / p_t(x)
         = Σ_{z∈S} Q_t^z(y|x) · p_{1|t}(z|x),
其中 p_{1|t}(z|x) := p_t(x|z) p_data(z) / p_t(x)                             (90)

Q_t 是合法的 rate matrix，而且：X_0 ~ p_init，X_t 為 Q_t 的 CTMC ⇒ X_t ~ p_t
```

</details>

### Kolmogorov forward equation：離散版的機率守恆

要證明 Theorem 36，講義需要一個 CTMC 的基本方程：**Kolmogorov forward equation（KFE）**，Proposition 2。Slides 5 直接稱它為「continuity equation 的離散類比」。

直覺是一句話：**某個狀態的機率變化率＝流進來的淨量**。每個狀態 y 以速率 `Q_t(x|y)` 把自己的機率 `p_t(y)` 送到 x；把所有來源加起來（y=x 那項是負的，代表流出），就是 `p_t(x)` 的變化率。Proposition 2 說：CTMC 的分佈是 `p_t`，**若且唯若** KFE 成立。

有了 KFE，證明 Theorem 36 就只剩代數：對邊際路徑取導數、對每個 z 用條件路徑的 KFE、乘除 `p_t(y)`，就湊出邊際 rate matrix。

<details>
<summary>講義 Proposition 2 與證明骨架</summary>

```text
d/dt p_t(x) = Σ_{y∈S} Q_t(x|y) p_t(y)
```

**必要性**：若 `X_t ~ p_t`，把 `p_{t+h}(x)` 寫成 `Σ_y p_{t+h|t}(x|y) p_t(y)`，對 h 在 0 取導數、交換和與導數，再用 eq. (87) 就得到 KFE。

**充分性**：把 KFE 寫成矩陣形式 `d/dt p_t = Q_t p_t`，這是 `R^S` 上的線性 ODE，初始條件由 `p_0` 固定。由第 1 講的 Theorem 3（ODE 解唯一），任何滿足同一方程的 `q_t` 都等於 `p_t`。

**Theorem 36 的證明**（講義 p.62）：

```text
d/dt p_t(x) = Σ_z d/dt p_t(x|z) p_data(z)
            = Σ_z [Σ_y Q_t^z(x|y) p_t(y|z)] p_data(z)                 （條件路徑的 KFE）
            = Σ_y p_t(y) [Σ_z Q_t^z(x|y) p_t(y|z) p_data(z) / p_t(y)]
            = Σ_y p_t(y) Q_t(x|y)
```

</details>

### 條件 rate matrix 長什麼樣

**Example 37** 給出 factorized mixture path 的條件 rate matrix。它簡單到可以用一句話講完：**如果位置 j 還不是正確答案 `z_j`，就以速率 `κ̇_t/(1−κ_t)` 跳到 `z_j`；已經是了就不動。** 它不會跳到任何其他 token。

Slides 5 在同一頁加了一個提醒：`1−κ_t` 在 t=1 時趨近 0，所以 **rate 在 t=1 會爆掉**。直覺上也合理：時間快用完了，還沒到位的 token 必須立刻跳過去。

<details>
<summary>講義 Example 37</summary>

```text
Q_t^z(v_i, j | x_j) = κ̇_t / (1 − κ_t) · (δ_{z_j}(v_i) − δ_{x_j}(v_i))

                    = κ̇_t / (1 − κ_t) ×   0   若 x_j = z_j
                                          1   若 v_i = z_j, x_j ≠ z_j
                                          0   若 v_i ≠ z_j, x_j ≠ z_j
                                         −1   若 v_i = x_j, x_j ≠ z_j
```

證明（講義 pp.62–63）：路徑和 rate matrix 都完全逐位置分解，所以只需處理 d=1，然後直接驗證 KFE 成立。

</details>

## 關鍵一步：學 rate matrix 就是學一個分類器

**Theorem 38** 把 Example 37 代進 Theorem 36。邊際 rate matrix 一樣是 factorized 的，而且形式幾乎和條件版一樣，只是「正確答案 `z_j`」換成了「正確答案的機率」：

**Q_t(v_i, j | x) = κ̇_t/(1−κ_t) · ( p_{1|t}(z_j = v_i | x) − δ_{x_j}(v_i) )**

這條式子裡，`κ_t` 是你自己選的排程，`δ_{x_j}` 看目前狀態就知道。**唯一的未知數**是 `p_{1|t}(z_j = v_i | x)`：看到整句加噪的 x，第 j 個位置原本是 token `v_i` 的機率。Slides 5 在這一項下面標著「Only unknown!」。

講義說這個結果很了不起：學邊際 rate matrix，實際上就是**對每個位置學一個分類器**。網路吃進加噪序列 x，輸出 d × V 的 logits，每個位置過一次 softmax。任何 sequence-to-sequence 網路都行，講義點名 transformer（見[第 4 講](/posts/ai/2026-09-30-mit-6s184-lecture-04-latent-spaces-architectures)的 §6.1.2）。

分類器就用 cross-entropy 訓練，這就是 **discrete flow matching loss**：

**L_DFM(θ) = E[ −Σ_j log p^θ_{1|t}(z_j | x) ]**

講義把兩邊並排：連續 flow matching 把生成模型的訓練化成簡單的**回歸**，離散 flow matching 和離散擴散則化成簡單的**分類**。

<details>
<summary>講義 Theorem 38 的證明，eq. (91)–(95)</summary>

```text
Q_t(y|x) = Σ_z Q_t^z(y|x) p_{1|t}(z|x)                                      (91)
```

x 和 y 不是鄰居時，每個 `Q_t^z(y|x)` 都是 0，所以邊際 rate matrix 也 factorized。接著：

```text
Q_t(v_i, j|x) = Σ_z Q_t^z(v_i, j|x) p_{1|t}(z|x)                            (92)
              = Σ_z κ̇_t/(1−κ_t) (δ_{z_j}(v_i) − δ_{x_j}(v_i)) p_{1|t}(z|x)  (93)
              = κ̇_t/(1−κ_t) (Σ_z δ_{z_j}(v_i) p_{1|t}(z|x) − δ_{x_j}(v_i))  (94)
              = κ̇_t/(1−κ_t) (p_{1|t}(z_j = v_i|x) − δ_{x_j}(v_i))           (95)
```

(94) 用了 `Σ_z p_{1|t}(z|x) = 1`，(95) 是對 z 的其他位置邊際化。

</details>

### Algorithm 8：訓練迴圈

訓練迴圈和第 2 講的 Algorithm 3 是同一個形狀，只是加噪方式和 loss 換掉了：

<details>
<summary>講義 Algorithm 8：訓練 factorized CTMC 模型（離散擴散）</summary>

```text
Require: 序列資料 z ~ p_data、每個位置的雜訊 token 分佈 p_init^(j)、排程 κ_t、
         輸出每個位置 logits 的網路 f_θ、optimizer
for 每個訓練 iteration:
    取資料 z ~ p_data
    取 t ~ Unif[0,1]，κ ← κ_t
    從 factorized mixture path 取加噪狀態 x ~ p_t(·|z)：
        for j = 1..d（平行）:
            m_j ~ Bernoulli(κ)
            ξ_j ~ p_init^(j)
            x_j ← m_j z_j + (1 − m_j) ξ_j
    ℓ_j(·) ← f_θ(x, t)_j,   p^θ_{1|t}(v|x)_j = Softmax(ℓ_j(v))
    L_DFM(θ) ← Σ_j −log p^θ_{1|t}(z_j|x)_j
    θ ← Opt.step(∇_θ L_DFM(θ))
```

訓練完用 Algorithm 7 取樣：每一步用網路預測的機率代入 Theorem 38，得到 rate，再逐位置跳。

</details>

**怎麼做**：這一講沒有 lab，但 Algorithm 8 的每一行都很短。拿你手邊任何一個小型 transformer（例如 [Lab 3](/posts/ai/2026-09-30-mit-6s184-lab-03-dit-vae-latent-diffusion) 寫過的 attention 層），在一個字元級的小語料上照 Algorithm 8 訓練，雜訊用下一節的 [mask]，再照 Algorithm 7 取樣。能跑出通順的短句，就代表你真的讀懂了這一講。

## Masked diffusion language model

**Example 39** 是上面框架最重要的特例。做法是在詞彙表裡多加一個 **[mask]** token，代表「這個位置被遮住了」，然後把初始分佈設成**整句都是 [mask]**：`p_init = δ_{[mask]^d}`。

套進 factorized mixture path，加噪就是「每個 token 以機率 `1−κ_t` 被換成 [mask]」；生成就是從全遮的句子出發，一個一個位置揭開。講義 Figure 20 用「The cat sat on the mat.」畫出這條軌跡：t=0.25 只揭開「on」，t=0.75 多了「cat」「the」「mat」，t=1 整句完成。Slides 5 用《百年孤寂》開頭一整段示範同一件事，在 t=0.3、0.6、0.8、1.0 各截一張，可以看到字詞不是由左到右出現，而是散落各處、逐漸填滿。

講義說，目前最先進的離散擴散模型用的就是這套配方，搭配在網路規模資料上訓練的神經網路（通常是 transformer），並引用 [LLaDA2.0](https://arxiv.org/abs/2512.15745)（講義參考文獻 [4]）。

### 和自回歸模型比

Slides 5 有一頁討論離散擴散與自回歸模型的取捨，每一點都打了問號，是開放問題而不是結論：

- **可能的優點**：可以平行生成多個 token（更快？）；可以用任意順序生成（能拿來改寫文字？）；可以設計新的機率路徑（能不能做出有語意的加噪方式？）。
- **可能的缺點**：沒有 KV cache（反而更慢？）；模型得學會用任意順序生成（更難學？）；由左到右的順序本身就有語意（放棄它值得嗎？）。

如果你想看這些取捨在實際 diffusion LLM 上怎麼表現，本站的 [CME295 Diffusion LLM 導讀](/posts/ai/2026-09-29-cme295-diffusion-llms)從 LLM 工程角度談了平行解碼的代價。

## 為什麼配方能搬得這麼順：generator matching

**Remark 40** 回答了讀到這裡自然會有的疑問：為什麼 flow matching 的原則可以這麼無縫地搬到離散空間？

講義的答案是，這些原則本來就不是 flow 或 CTMC 專屬的，而是**用馬可夫過程建構生成模型的一般學習原則**。這個想法發展成 [Generator Matching](https://arxiv.org/abs/2410.20587) 框架（講義參考文獻 [19]）：**generator** 是向量場 `u_t` 和 rate matrix `Q_t` 的共同推廣。講義列出的延伸方向包括平滑流形上的模型（幾何資料）、混合狀態空間（文字和圖片一起生成），以及 jump process 這類其他馬可夫過程。Slides 5 在課程總結前也以同一個問題收尾。

## 讀完這講，你應該能

- 說出為什麼離散空間沒有 ODE／SDE，以及 CTMC 如何取代它們。
- 寫出 rate matrix 的兩個條件，並解釋對角項為什麼非正。
- 解釋 factorized CTMC 為什麼是必要的，以及網路輸出為什麼是 d × V。
- 說出 factorized mixture path 和高斯路徑的相同點（排程控制資訊毀損）與不同點（淡入淡出、不搬運）。
- 用 KFE 說明離散 marginalization trick 為什麼成立。
- 從 Theorem 38 推出：訓練離散擴散模型等於對每個位置做分類，loss 是 cross-entropy。
- 描述 masked diffusion language model 的初始分佈和生成過程。

**今晚就能做的事**：讀講義 pp.59–65（§7.2），把開頭那張連續／離散對照表自己重畫一次，每一格都寫上講義編號。接著手推一次 Example 34：把兩狀態的轉移機率對 h 求導，確認在 h=0 等於 rate matrix。

## 延伸閱讀

- Diffusion LLM 的工程面、三種雜訊與平行解碼：[CME295：Diffusion LLM](/posts/ai/2026-09-29-cme295-diffusion-llms)
- DDPM 視角的連續擴散（時間方向與本課相反）：[CMU 11-785 L23：Diffusion](/posts/ai/2026-08-22-cmu-11785-23-diffusion)
- 講義引用的離散擴散起點：[Campbell et al., A Continuous Time Framework for Discrete Denoising Models](https://arxiv.org/abs/2205.14987)（參考文獻 [5]）、[Gat et al., Discrete Flow Matching](https://arxiv.org/abs/2407.15595)（參考文獻 [16]）
- 講義 Figure 18 的圖源：[Lipman et al., Flow Matching Guide and Code](https://arxiv.org/abs/2412.06264)（參考文獻 [26]）

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。即時核對官方課程頁，講次與影片連結一致且影片公開，狀態改為「已附影片」。
- 2026-10-10：依字幕核對影片內容。L5 影片主題、長度（81:11）與各段說法與本文相符，正文未改。

## 參考資料

- [MIT 6.S184 課程網站（IAP 2026）](https://diffusion.csail.mit.edu/2026/index.html) — 第 5 講主題：Continuous-time Markov chains (CTMCs)、Sampling from CTMC models、Training CTMC models
- [Holderrieth & Erives, An Introduction to Flow Matching and Diffusion Models（講義 PDF）](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) — §1.2（§7 標為 Optional）；§7：eq. (84)–(95)、Theorem 33、Example 34、Algorithm 7、Example 35、Theorem 36、Proposition 2、Example 37、Theorem 38、Example 39、Algorithm 8、Remark 40、Figure 17–20；附錄 C（Theorem 33 證明）
- [Slides 5（20260130_Lecture_05.pdf）](https://diffusion.csail.mit.edu/2026/docs/20260130_Lecture_05.pdf) — 連續／離散 flow matching 對照表、「KFE 是 continuity equation 的離散類比」、「Rates explode at t=1」、「Only unknown!」、masked diffusion LM 取樣示範、離散擴散 vs 自回歸討論
- [第 5 講錄影：Discrete Diffusion Models (2026)](https://www.youtube.com/watch?v=d0kmyEJN2hI)
- [eje24/iap-diffusion-labs（branch 2026）](https://github.com/eje24/iap-diffusion-labs/tree/2026) — 只有 Lab 1–3，沒有第 5 講的 lab
- [Holderrieth et al. (2024), Generator Matching: Generative Modeling with Arbitrary Markov Processes](https://arxiv.org/abs/2410.20587)
- [Bie et al. (2025), LLaDA2.0: Scaling Up Diffusion Language Models to 100B](https://arxiv.org/abs/2512.15745)
