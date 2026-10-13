---
title: "雜訊與誤差衡量：目標有雜訊、錯誤有輕重時怎麼學｜台大林軒田 機器學習基石 第 8 堂"
date: 2026-10-13
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, learning-theory, classification]
lang: zh-TW
math: true
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 8
tldr: "這堂課把固定的目標函數換成目標分布 P(y|x)：只要 (x, y) 是從同一個聯合分布獨立抽出來的，VC bound 在有雜訊時照樣成立。誤差衡量 err 和 P(y|x) 一起決定每個 x 上最理想的預測，0/1 誤差選機率最大的 y，平方誤差選加權平均。CIA 指紋辨識把誤放罰 1000 倍，這種加權分類等於把 −1 的資料複製 1000 次再做一般分類。"
description: "台大林軒田機器學習基石第 8 堂 Noise and Error 導讀：雜訊與目標分布 P(y|x)、逐點誤差衡量、ideal mini-target 的推導、超市與 CIA 指紋辨識的代價矩陣、演算法用的 êrr、加權分類與 weighted pocket，四題 Fun Time 逐題解釋，並用八個一維的點把加權誤差算完。"
draft: false
glossary:
  - term: "目標分布"
    aliases: ["target distribution", "P(y|x)"]
    definition: "給定輸入 x 時，標籤 y 的條件機率分布 P(y|x)。它取代原本固定的目標函數 f，可以看成「每個 x 上最理想的預測」加上雜訊；固定的 f 是機率只取 0 或 1 的特例。"
    context: "基石第 8 堂用它把 VC 理論推廣到有雜訊的資料。"
    links:
      - label: "基石第 8 堂講義"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/08_handout.pdf"
  - term: "ideal mini-target"
    aliases: ["理想小目標"]
    definition: "在有雜訊的情況下，給定一個輸入 x，讓平均誤差最小的預測值。它由 P(y|x) 和誤差衡量一起決定：0/1 誤差下是機率最大的 y，平方誤差下是 y 的期望值，絕對誤差下是加權中位數。"
    context: "林軒田《機器學習基石》第 8 堂的用語。"
    links:
      - label: "基石第 8 堂講義"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/08_handout.pdf"
  - term: "逐點誤差衡量"
    aliases: ["pointwise error measure", "err"]
    definition: "只看單一個 x 上的預測 ỹ 與標籤 y 來計分的函數 err(ỹ, y)。E_in 是它在 N 筆訓練資料上的平均，E_out 是它對資料分布的期望值。"
    context: "基石第 8 堂之後的演算法都用這種形式的誤差；最常見的兩種是 0/1 誤差與平方誤差。"
  - term: "演算法誤差衡量"
    aliases: ["algorithmic error measure", "êrr"]
    definition: "演算法在最佳化時實際使用的誤差衡量，記成 êrr。它不一定等於應用真正在意的 err，通常是因為說得出道理（plausible）或容易最佳化（friendly）才被選用。"
    context: "基石第 8 堂區分 err 與 êrr；之後的線性迴歸與邏輯迴歸各用一種 êrr。"
  - term: "加權分類"
    aliases: ["weighted classification", "cost-sensitive classification"]
    definition: "不同的資料 (x, y) 分錯時付出不同代價的分類問題。E_in 與 E_out 裡每一筆錯誤先乘上自己的權重再平均。"
    context: "基石第 8 堂用 CIA 指紋辨識當例子，並用「把資料複製權重那麼多次」化約回一般的 0/1 分類。"
---

> 🌏 [English version](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-08-noise-and-error-en)

**影片狀態：已附影片。** 這篇依官方 MOOC 講義 [08_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/08_handout.pdf) 與這堂四支官方影片的機器轉錄逐字稿寫成，公式以講義為準；逐字稿未經人工校對。每一節開頭附該節的官方影片與大致的時間區段。文中的頁碼指投影片右下角的編號（0/25 到 25/25），寫「課堂上」的地方是轉述影片裡的說法。

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)裡的基石第 8 堂。講義第 1 頁的 Roadmap 把它放在四大問題的第二個 Why Can Machines Learn? 底下，是這個問題的最後一堂。上一堂[基石第 7 堂：VC 維度](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error)的結論在同一頁只有一行：$d_{\text{VC}}$ 有限、$N$ 夠大、$E_{\text{in}}$ 夠低，學習就會發生。

那個結論是在兩個簡化的設定下推出來的：每個 $\mathbf{x}$ 的標籤由一個固定的目標函數 $f$ 決定，而且對錯只用「分對或分錯」來算。真實的資料兩樣都不符合。標籤會記錯，同樣條件的人會拿到不同的結果；錯誤也有輕重，把入侵者放進機密系統和把員工擋在門外不是同一回事。課堂上對這堂的定位是：回頭檢查 VC bound 推導時的假設，看能放寬到什麼程度。

先備是[基石第 4 堂](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning)的彈珠罐與 Hoeffding 不等式、[基石第 2 堂](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm)的 PLA 與 pocket、期望值與條件機率。讀完之後，你應該能做到四件事：

1. 說明為什麼把 $f$ 換成 $P(y \mid \mathbf{x})$ 之後 VC bound 還成立，並對一個小的分布算出任何假說的 $E_{\text{out}}$。
2. 給定 $P(y \mid \mathbf{x})$ 與誤差衡量，推導並算出最理想的預測（0/1、平方、絕對誤差三種）。
3. 把一張代價矩陣寫成 $E_{\text{in}}$ 的式子，並算出它對「該不該預測 $+1$」的門檻有什麼影響。
4. 解釋加權分類為什麼等於複製資料，以及 pocket 要改哪兩個地方。

## 資料有雜訊時，VC bound 還成立嗎

```youtube
url: https://www.youtube.com/watch?v=Br8J5pZM_CE
title: Noise and Error :: Noise and Probabilistic Target @ Machine Learning Foundations (機器學習基石)
```

（影片 00:19–02:22 回顧上一堂與學習流程，02:22–04:31 是三種雜訊，04:31–10:14 是會變色的彈珠，10:14–12:56 是目標分布，12:56–15:00 是新的學習流程，之後是 Fun Time。）

### 原本的流程圖少了什麼

講義第 2 頁重畫了前幾堂一直在用的學習流程圖。圖上有五個元件：

1. 左上角是未知的目標函數 $f: \mathcal{X} \to \mathcal{Y}$，它替每個 $\mathbf{x}$ 產生標籤。
2. 上方是未知的分布 $P$，訓練用的 $\mathbf{x}_1, \dots, \mathbf{x}_N$ 與將來測試用的 $\mathbf{x}$ 都從它抽出來。
3. 兩者合起來產生訓練資料 $\mathcal{D}: (\mathbf{x}_1, y_1), \dots, (\mathbf{x}_N, y_N)$。
4. 演算法 $\mathcal{A}$ 從假說集合 $\mathcal{H}$ 裡挑一個假說。
5. 挑出來的就是最後的假說 $g$，希望 $g \approx f$。

這一頁在 $f$ 的框裡多加了一個橘色的「+ noise」，頁尾問：有雜訊的話呢？

雜訊在基石第 2 堂講 pocket 演算法時出現過一次，那時只是說資料可能分不開。講義第 3 頁用銀行核發信用卡的例子（23 歲、女性、年薪 100 萬、居住 1 年、工作 0.5 年、負債 20 萬，要不要發卡）列出三種來源：

| 雜訊在哪裡 | 講義的說法 | 課堂上舉的情況 |
|---|---|---|
| $y$ | 好客戶被誤標成壞客戶 | 紀錄錯誤、人為錯誤，或當初用來核卡的公式本身有錯 |
| $y$ | 一樣的客戶，標籤不同 | 資料來自不同來源，專家一號和專家二號的想法不一樣；畫在二元分類的圖上，就是兩個點疊在一起，一個標圈、一個標叉 |
| $\mathbf{x}$ | 客戶資料不精確 | 顧客填資料時填得不準，或收集資料時收得不準 |

前幾堂的推導沒有考慮這些：$\mathbf{x}$ 從某個分布來，$y$ 由固定的 $f$ 產生。這一頁要問的是，VC bound 在有雜訊時還能不能用。

### 會變色的彈珠

要回答這個問題，得回到 VC bound 的起點。講義第 4 頁說 VC bound 的一個關鍵是彈珠。基石第 4 堂的設定是這樣（頁面左欄，講義稱為 deterministic marbles）：

- 每顆彈珠是一個 $\mathbf{x}$，從 $P(\mathbf{x})$ 抽出來。
- 彈珠的顏色是固定的：對一個假說 $h$，$\llbracket f(\mathbf{x}) \ne h(\mathbf{x}) \rrbracket$ 成立就是橘色（$h$ 在這裡錯了），不成立就是綠色。

罐子裡橘色彈珠的比例是 $E_{\text{out}}(h)$，抓一把出來數到的比例是 $E_{\text{in}}(h)$。Hoeffding 不等式說這兩個比例有很高的機率很接近。

右欄是有雜訊的版本，講義稱為 probabilistic (noisy) marbles：

- 彈珠一樣是 $\mathbf{x} \sim P(\mathbf{x})$。
- 顏色變成隨機的：$\llbracket y \ne h(\mathbf{x}) \rrbracket$，其中 $y \sim P(y \mid \mathbf{x})$。

課堂上把這種彈珠講成會變色的彈珠：它的顏色不固定，可能六成的時間是橘色、四成的時間是綠色。整個罐子在任一瞬間仍然有一個橘色的比例。要估計這個比例，做法還是抽樣，只是抽出來的那一瞬間要馬上記下顏色。例如抽 100 顆，抽出的瞬間有 20 顆是橘色，就拿 20% 來估計罐子裡同一時間橘色的比例。

講義把兩欄的共同點寫成一句：same nature，只要抽樣是 i.i.d.，就能估計 $\mathbb{P}[\text{orange}]$。結論是 VC bound 對下面這種資料成立：

$$
\mathbf{x} \overset{\text{i.i.d.}}{\sim} P(\mathbf{x}),\quad y \overset{\text{i.i.d.}}{\sim} P(y \mid \mathbf{x}) \qquad\Longleftrightarrow\qquad (\mathbf{x}, y) \overset{\text{i.i.d.}}{\sim} P(\mathbf{x}, y)
$$

先抽 $\mathbf{x}$ 再依 $P(y \mid \mathbf{x})$ 抽 $y$，和直接從聯合分布 $P(\mathbf{x}, y) = P(\mathbf{x})\,P(y \mid \mathbf{x})$ 抽一對 $(\mathbf{x}, y)$，是同一件事。課堂上的說法是：要讓 VC 能用，唯一堅持的只有取樣這個過程，所以 $y$ 也得是取樣來的；訓練時這樣抽，測試時也這樣抽。講義沒有重寫證明，課堂上也只說把那些複雜的證明用會變色的彈珠重寫一次，結論不變。

本文補充為什麼可以這樣相信。固定一個假說 $h$，定義每筆資料的「有沒有錯」為

$$
Z_n = \llbracket y_n \ne h(\mathbf{x}_n) \rrbracket
$$

$(\mathbf{x}_n, y_n)$ 彼此獨立、來自同一個 $P(\mathbf{x}, y)$，所以 $Z_1, \dots, Z_N$ 是獨立同分布、只取 0 或 1 的隨機變數，期望值都是 $\mathbb{P}[y \ne h(\mathbf{x})]$。Hoeffding 不等式需要的條件就只有這些，它不在乎 $Z_n$ 等於 1 是因為 $h$ 和 $f$ 不同，還是因為 $y$ 被雜訊翻掉了。於是新的 $E_{\text{out}}$ 與 $E_{\text{in}}$ 是

$$
E_{\text{out}}(h) = \mathop{\mathbb{E}}_{(\mathbf{x}, y) \sim P} \llbracket y \ne h(\mathbf{x}) \rrbracket, \qquad E_{\text{in}}(h) = \frac{1}{N}\sum_{n=1}^{N} \llbracket y_n \ne h(\mathbf{x}_n) \rrbracket
$$

單一假說的 Hoeffding 照舊成立。後面把很多假說合起來算的步驟（成長函數、VC bound），數的是假說在 $\mathbf{x}_1, \dots, \mathbf{x}_N$ 上能分出幾種結果，和標籤怎麼產生無關。以上只是讓「結論不變」這件事可信的理由，不是完整的證明：完整的證明要把 VC bound 的每一步用 $(\mathbf{x}, y)$ 重寫一次，講義與課堂都沒有做，這裡也不做。

### 目標分布與 mini-target

講義第 5 頁給 $P(y \mid \mathbf{x})$ 一個名字：目標分布（target distribution）。它描述的是單一個 $\mathbf{x}$ 上的 mini-target 會怎麼表現。講義提供兩種看法。

**看法一：理想的 mini-target 加上雜訊。** 講義的例子是

$$
P(\circ \mid \mathbf{x}) = 0.7, \qquad P(\times \mid \mathbf{x}) = 0.3
$$

課堂上直接問學生：圈的機率是 0.7、叉是 0.3，你要猜哪一個？猜圈的錯誤率是 30%，猜叉是 70%，所以在這個 $\mathbf{x}$ 上圈是比較好的選擇。講義把這個最好的選擇叫 ideal mini-target，$f(\mathbf{x}) = \circ$；剩下的 0.3 是翻轉雜訊的程度（'flipping' noise level）。課堂上的講法是，猜圈還是會錯的那 30%，可以看成是在最好的選擇上面加的雜訊。

**看法二：固定的 $f$ 是目標分布的特例。** 沒有雜訊時，

$$
P(y \mid \mathbf{x}) = 1 \ \text{ for } y = f(\mathbf{x}), \qquad P(y \mid \mathbf{x}) = 0 \ \text{ for } y \ne f(\mathbf{x})
$$

所以前七堂的結果都包含在新的設定裡，沒有哪一條要丟掉。

這一頁的頁尾把學習的目標重寫成：在常見的輸入上（依 $P(\mathbf{x})$），預測理想的 mini-target（依 $P(y \mid \mathbf{x})$）。兩個分布各管一件事。課堂上解釋 $P(\mathbf{x})$ 的角色：某個點的 $P(\mathbf{x})$ 大，代表它常被抽到，在 $E_{\text{in}}$ 裡常出現，算 $E_{\text{out}}$ 時也占比較重的分量，所以在這些常見的點上要預測得接近 mini-target。

講義第 6 頁據此更新流程圖（The New Learning Flow），和第 2 頁比有兩處不同：

- 左上角的框從「unknown target function $f$」換成「unknown target distribution $P(y \mid \mathbf{x})$, containing $f(\mathbf{x})$ + noise」，它產生訓練資料的 $y_1, \dots, y_N$。
- 多了一條從這個框拉到右邊 $g \approx f$ 的虛線，標著 $y$。課堂上說這條線是特別畫出來強調的：測試時用來和 $g$ 比對的 $y$，也要從同一個分布產生。

頁尾寫著 VC still works, pocket algorithm explained。pocket 做的事是在資料分不開時盡量把 $E_{\text{in}}$ 壓低。課堂上的解釋是：只要雜訊能用目標分布來描述，壓低 $E_{\text{in}}$ 仍然會讓 $E_{\text{out}}$ 跟著低。基石第 2 堂教 pocket 時還沒有這層理由，到這裡才補上。

### 算一次：有雜訊時的 E_out 與它的下限

以下是本文自擬的例子，不在講義上。把銀行的顧客簡化成三群，$\mathbf{x}$ 只記錄顧客屬於哪一群，$y = +1$ 代表發卡後正常繳款。

| 群 | $P(\mathbf{x})$ | $P(y = +1 \mid \mathbf{x})$ | ideal mini-target | 這一群最少會錯多少 |
|---|---|---|---|---|
| A | 0.5 | 0.9 | $+1$ | 0.1 |
| B | 0.3 | 0.6 | $+1$ | 0.4 |
| C | 0.2 | 0.2 | $-1$ | 0.2 |

ideal mini-target 那一欄用的是剛才的規則：猜機率比較大的那一邊。任何假說 $h$ 的 $E_{\text{out}}$ 可以先固定 $\mathbf{x}$、對 $y$ 取期望值，再對 $\mathbf{x}$ 取期望值：

$$
E_{\text{out}}(h) = \sum_{\mathbf{x}} P(\mathbf{x}) \cdot \mathbb{P}\big[y \ne h(\mathbf{x}) \mid \mathbf{x}\big]
$$

$h$ 在某一群預測 $+1$，那一群的錯誤機率就是 $P(y = -1 \mid \mathbf{x})$；預測 $-1$ 則是 $P(y = +1 \mid \mathbf{x})$。三個假說算出來：

| 假說（A, B, C 三群的預測） | $E_{\text{out}}$ 的計算 | 結果 |
|---|---|---|
| $(+1, +1, -1)$，每群都猜 ideal mini-target | $0.5 \times 0.1 + 0.3 \times 0.4 + 0.2 \times 0.2$ | 0.21 |
| $(+1, +1, +1)$，全部發卡 | $0.5 \times 0.1 + 0.3 \times 0.4 + 0.2 \times 0.8$ | 0.33 |
| $(-1, -1, -1)$，全部不發 | $0.5 \times 0.9 + 0.3 \times 0.6 + 0.2 \times 0.2$ | 0.67 |

三群各有兩種預測，總共八個假說；把八個都算一遍，最小的就是 0.21。這個結果有兩層意思。第一，$E_{\text{out}}$ 有一個不是 0 的下限：就算知道完整的 $P(y \mid \mathbf{x})$，每群都猜對邊，還是會錯 21%，這部分是雜訊，換什麼模型都消不掉。第二，下限以上的差距才是假說的責任：全部發卡的 0.33 比 0.21 多出 0.12，全部來自 C 群猜錯邊（$0.2 \times (0.8 - 0.2) = 0.12$）。

再看抽樣。下面的程式從這個聯合分布抽 1,000 筆，算兩個假說的 $E_{\text{in}}$：

```python
import random

random.seed(8)
P_pos = [0.9, 0.6, 0.2]            # A、B、C 三群 y = +1 的機率
data = []
for _ in range(1000):
    r = random.random()
    g = 0 if r < 0.5 else (1 if r < 0.8 else 2)   # 依 0.5 / 0.3 / 0.2 抽一群
    y = +1 if random.random() < P_pos[g] else -1  # 依 P(y|x) 抽標籤
    data.append((g, y))

for name, h in [("ideal", (+1, +1, -1)), ("always +1", (+1, +1, +1))]:
    print(name, sum(h[g] != y for g, y in data) / 1000)
```

輸出是 `ideal 0.204` 與 `always +1 0.308`，對照 $E_{\text{out}}$ 的 0.21 與 0.33，差距是 0.006 與 0.022。對單一假說，Hoeffding 給的保證是 $\mathbb{P}[\lvert E_{\text{in}} - E_{\text{out}} \rvert > 0.05] \le 2e^{-2 \times 0.05^2 \times 1000} = 2e^{-5} \approx 0.013$，兩個差距都在 0.05 以內。標籤是隨機的，抽樣估計照樣準，這就是會變色的彈珠在說的事。

本文再補一個常用的特例。假設背後有一個固定的 $f$，每筆標籤獨立地以機率 $\tau$ 被翻掉（$\tau < 0.5$）。令 $\mu = \mathbb{P}_{\mathbf{x}}[h(\mathbf{x}) \ne f(\mathbf{x})]$，也就是沒有雜訊時 $h$ 的錯誤率。在 $h$ 和 $f$ 一致的 $\mathbf{x}$ 上，$h$ 只有在標籤被翻掉時才算錯，機率是 $\tau$；在兩者不一致的 $\mathbf{x}$ 上，標籤沒被翻掉才算錯，機率是 $1 - \tau$。所以

$$
E_{\text{out}}(h) = (1 - \mu)\,\tau + \mu\,(1 - \tau) = \tau + (1 - 2\tau)\,\mu
$$

$\tau = 0.3$、$\mu = 0.1$ 時是 $0.3 + 0.4 \times 0.1 = 0.34$。因為 $1 - 2\tau > 0$，對著有雜訊的標籤算出來的 $E_{\text{out}}$ 愈小，$\mu$ 也愈小：用有雜訊的資料挑假說，挑到的方向和沒有雜訊時一致，只是數字不一樣：$\mu$ 被乘上 $1 - 2\tau$ 再加上 $\tau$，最低只能到 $\tau$。

### Fun Time：資料可不可分，能推出 f 是不是線性嗎

**題目（第 7 頁）：** 回頭看 PLA 與 pocket。下列哪一個敘述正確？

1. 實務上，決定用 PLA 之前，應該先算出 $\mathcal{D}$ 是不是線性可分。
2. 如果知道 $\mathcal{D}$ 不是線性可分，那目標函數 $f$ 一定不是線性函數。
3. 如果知道 $\mathcal{D}$ 是線性可分，那目標函數 $f$ 一定是線性函數。
4. 以上皆非

**答案：4。** 三個敘述各錯在不同的地方。

- **選項 1。** 講義的解答是：算出 $\mathcal{D}$ 可不可分之後，你就已經知道 $\mathbf{w}^*$ 了，不需要再跑 PLA。要確認資料線性可分，就得找出一條把它分開的線，而那正是 PLA 要給你的東西。課堂上說邏輯上通常不會這樣做。
- **選項 2。** 講義只寫了一句 What about noise?。$f$ 可以是線性的，但標籤加了雜訊，資料就分不開了；課堂上指的就是基石第 2 堂 pocket 那張圖的情況。
- **選項 3。** 講義寫的是 What about 'sampling luck'?。課堂上舉了兩種運氣：$f$ 其實彎彎曲曲，只是抽到的點剛好能用一條線分開；或者 $f$ 有雜訊，但你運氣好，抽到的資料完全沒碰到被雜訊影響的點。

課堂上花了一點時間強調這題背後的觀念：從資料的性質，不見得能推出 $f$ 的性質。VC 給的保證是另一個方向的：得到很低的 $E_{\text{in}}$，再配上小的 $d_{\text{VC}}$，就有很低的 $E_{\text{out}}$。它沒有說 $f$ 一定是線性或一定不是線性。

## 怎麼替 g 打分數：誤差衡量與每個 x 上最理想的預測

```youtube
url: https://www.youtube.com/watch?v=2gCnX0V1do8
title: Noise and Error :: Error Measure @ Machine Learning Foundations (機器學習基石)
```

（影片 00:01–02:02 整理原本的 E_out 有哪三個特性，02:02–04:10 是逐點誤差，04:10–05:55 是 0/1 與平方誤差，05:55–11:30 是 ideal mini-target，11:30–14:10 是加了誤差衡量的流程圖與 VC 的推廣，之後是 Fun Time。）

### 原本的 E_out 做了三個選擇

流程圖最後一格是 $g \approx f$。「多像才算像」需要一個計分方式，課堂上把這件事叫打分數：別人給你一個 $g$，你心裡有想要的 $f$，總要有個方法告訴人家好或不好。講義第 8 頁先寫出前幾堂一直用的那一個：

$$
E_{\text{out}}(g) = \mathop{\mathbb{E}}_{\mathbf{x} \sim P} \llbracket g(\mathbf{x}) \ne f(\mathbf{x}) \rrbracket
$$

更一般的寫法是一個誤差衡量 $E(g, f)$。講義指出原本的 $E_{\text{out}}$ 自然而然地做了三個選擇：

- **out-of-sample：** 對還沒看過的 $\mathbf{x}$ 取平均。
- **pointwise（逐點）：** 一次只在一個 $\mathbf{x}$ 上評估。課堂上的對照是，它不需要一次抽十個 $\mathbf{x}$ 再做某種綜合的衡量；一個點算一次，最後取平均就好。
- **classification：** 只看 $\llbracket \text{prediction} \ne \text{target} \rrbracket$，也就是對或錯。

第三種有個常見的別名叫 0/1 誤差。課堂上解釋這個名字：只有兩種情形，對的付出 0 的代價，錯的付出 1 的代價。

### 逐點誤差衡量

講義第 9 頁把「逐點」這件事抽出來。很多誤差衡量都能寫成某個函數 $\text{err}$ 在各點上的平均，原本的 $E_{\text{out}}$ 就是：

$$
E_{\text{out}}(g) = \mathop{\mathbb{E}}_{\mathbf{x} \sim P} \underbrace{\llbracket g(\mathbf{x}) \ne f(\mathbf{x}) \rrbracket}_{\text{err}(g(\mathbf{x}),\, f(\mathbf{x}))}
$$

$\text{err}$ 叫逐點誤差衡量（pointwise error measure）。有了它，訓練資料上與分布上的誤差是同一個 $\text{err}$ 的兩種平均：

$$
E_{\text{in}}(g) = \frac{1}{N}\sum_{n=1}^{N} \text{err}\big(g(\mathbf{x}_n), f(\mathbf{x}_n)\big), \qquad E_{\text{out}}(g) = \mathop{\mathbb{E}}_{\mathbf{x} \sim P}\, \text{err}\big(g(\mathbf{x}), f(\mathbf{x})\big)
$$

這一頁的式子是用 $f$ 寫的。課堂上補了一句，把它和「目標分布與 mini-target」的設定接起來：在有雜訊的設定下，式子裡的 $f(\mathbf{x}_n)$ 其實就是 $y_n$，$E_{\text{out}}$ 裡的 $f(\mathbf{x})$ 也換成從分布抽出來的 $y$，量的是 $g$ 和 $y$ 的差別。講義到第 20 頁寫加權分類時，式子就直接用 $y$ 了。

講義說為了簡單，之後主要考慮逐點的 $\text{err}$。課堂上的理由是：其他的衡量方式通常比較複雜，有些不好處理，而且往往也要從逐點的方式出發。

### 兩個最重要的 err

講義第 10 頁把 $\text{err}$ 的兩個輸入重新命名：預測 $g(\mathbf{x})$ 記成 $\tilde{y}$，目標 $f(\mathbf{x})$ 記成 $y$。然後列出兩個之後會一直用的 $\text{err}$：

| | 0/1 誤差 | 平方誤差 |
|---|---|---|
| 定義 | $\text{err}(\tilde{y}, y) = \llbracket \tilde{y} \ne y \rrbracket$ | $\text{err}(\tilde{y}, y) = (\tilde{y} - y)^2$ |
| 在問什麼 | 對還是錯 | $\tilde{y}$ 離 $y$ 多遠 |
| 常用在 | 分類 | 迴歸 |

課堂上對平方誤差的說明：差 2 的話誤差是 4，差 10 的話誤差是 100，離得愈遠漲得愈快。它適合迴歸，因為輸出是實數時要求「完全一樣」沒有意義；要預測 3.141592，猜到 3.14 可能已經很準了，所以看的是距離，而不是對或錯。

這一頁的頁尾問：$\text{err}$ 怎麼引導學習？

### err 和 P(y|x) 一起決定 ideal mini-target

「目標分布與 mini-target」那一小節說 ideal mini-target 是「在這個 $\mathbf{x}$ 上最好的預測」。0.7 對 0.3 的例子裡，最好的預測就是猜機率大的。講義第 11 頁指出這個答案其實依賴誤差衡量：$P(y \mid \mathbf{x})$ 與 $\text{err}$ 一起定義 ideal mini-target $f(\mathbf{x})$。例子是一個有三種可能輸出的 $\mathbf{x}$：

$$
P(y = 1 \mid \mathbf{x}) = 0.2, \qquad P(y = 2 \mid \mathbf{x}) = 0.7, \qquad P(y = 3 \mid \mathbf{x}) = 0.1
$$

對每個候選的預測 $\tilde{y}$，算它在這個 $\mathbf{x}$ 上的平均誤差 $\sum_{y} P(y \mid \mathbf{x})\,\text{err}(\tilde{y}, y)$。講義的表只列了結果，計算過程如下。

| $\tilde{y}$ | 0/1 誤差的平均 | 平方誤差的平均 |
|---|---|---|
| 1 | $0.7 + 0.1 = 0.8$ | $0.2 \times 0 + 0.7 \times 1 + 0.1 \times 4 = 1.1$ |
| 2 | $0.2 + 0.1 = 0.3$（最小） | $0.2 \times 1 + 0.7 \times 0 + 0.1 \times 1 = 0.3$ |
| 3 | $0.2 + 0.7 = 0.9$ | $0.2 \times 4 + 0.7 \times 1 + 0.1 \times 0 = 1.5$ |
| 1.9 | $0.2 + 0.7 + 0.1 = 1.0$ | $0.2 \times 0.81 + 0.7 \times 0.01 + 0.1 \times 1.21 = 0.29$（最小） |

0/1 那一欄：預測 $\tilde{y}$ 時，只要 $y$ 是別的值就錯，所以平均誤差是其他值的機率和。預測 1.9 的話，三種可能的 $y$ 沒有一個等於 1.9，一定全錯，平均誤差是 1.0。講義在這個數字旁邊加了「really? :-)」。課堂上的講法是，在 0/1 誤差底下猜 1.9 會被笑，因為它根本不是可能的答案。

平方那一欄：$(1.9 - 1)^2 = 0.81$、$(1.9 - 2)^2 = 0.01$、$(1.9 - 3)^2 = 1.21$，加權後是 $0.162 + 0.007 + 0.121 = 0.29$，比預測 2 的 0.3 還小一點。剛才被笑的 1.9，換成平方誤差就成了最好的預測。

同一個 $P(y \mid \mathbf{x})$，換一個 $\text{err}$，最理想的預測就從 2 變成 1.9。講義把兩種情況的一般結果寫在表格下方：

$$
\text{0/1 誤差：}\ f(\mathbf{x}) = \mathop{\text{argmax}}_{y \in \mathcal{Y}} P(y \mid \mathbf{x}) \qquad\qquad \text{平方誤差：}\ f(\mathbf{x}) = \sum_{y \in \mathcal{Y}} y \cdot P(y \mid \mathbf{x})
$$

講義沒有證明這兩條。課堂上說證明不困難，鼓勵大家自己試。下面是本文補的推導。

**0/1 誤差。** 預測某個可能的值 $\tilde{y} \in \mathcal{Y}$ 時，平均誤差是

$$
\sum_{y \ne \tilde{y}} P(y \mid \mathbf{x}) = 1 - P(\tilde{y} \mid \mathbf{x})
$$

要讓它最小，就要讓 $P(\tilde{y} \mid \mathbf{x})$ 最大，也就是選機率最大的那個 $y$。預測 $\mathcal{Y}$ 以外的值，平均誤差是 1，不可能更好。

**平方誤差。** 把平均誤差看成 $\tilde{y}$ 的函數：

$$
G(\tilde{y}) = \sum_{y} P(y \mid \mathbf{x})\,(\tilde{y} - y)^2
$$

它是 $\tilde{y}$ 的二次函數，$\tilde{y}^2$ 的係數是 $\sum_y P(y \mid \mathbf{x}) = 1 > 0$，開口向上，微分等於 0 的地方就是最小值：

$$
\frac{dG}{d\tilde{y}} = \sum_{y} P(y \mid \mathbf{x}) \cdot 2(\tilde{y} - y) = 2\tilde{y} - 2\sum_{y} y \cdot P(y \mid \mathbf{x}) = 0 \quad\Longrightarrow\quad \tilde{y} = \sum_{y} y \cdot P(y \mid \mathbf{x})
$$

第二個等號用到機率加起來是 1。最佳的預測是以機率為權重的平均值，課堂上稱為加權平均。代入例子：$1 \times 0.2 + 2 \times 0.7 + 3 \times 0.1 = 1.9$。

把這個平均值記成 $m$，$G$ 還可以拆成兩塊（把 $\tilde{y} - y$ 寫成 $(\tilde{y} - m) + (m - y)$ 再展開，交叉項因為 $\sum_y P(y \mid \mathbf{x})(m - y) = 0$ 而消失）：

$$
G(\tilde{y}) = (\tilde{y} - m)^2 + \sum_{y} P(y \mid \mathbf{x})\,(m - y)^2
$$

第二塊和 $\tilde{y}$ 無關，是這個 $\mathbf{x}$ 上的變異數，也是平方誤差在這個點上消不掉的雜訊。例子裡它等於 0.29，於是表格的平方那一欄可以一眼核對：預測 1 是 $0.9^2 + 0.29 = 1.1$，預測 2 是 $0.1^2 + 0.29 = 0.3$，預測 3 是 $1.1^2 + 0.29 = 1.5$。

### 流程圖多了一個元件

既然 $\text{err}$ 會改變「最理想的目標」是什麼，它就得出現在流程圖裡。講義第 12 頁（Learning Flow with Error Measure）在右下角加了一個藍色的橢圓 error measure $\text{err}$，拉出兩條箭頭：一條指向最後的 $g \approx f$，表示用它來評估 $g$ 好不好；一條指向演算法 $\mathcal{A}$，表示演算法也要知道它。課堂上解釋第二條箭頭：如果不告訴演算法，它悶著頭把 0/1 誤差做得很好，結果我們在意的是平方誤差，兩邊可能天差地遠。

這一頁的頁尾寫：extended VC theory／'philosophy' works for most $\mathcal{H}$ and $\text{err}$。課堂上說明了要改什麼，但沒有進細節：例如做迴歸時，要先定義「輸出是實數的函數」的 VC 維度怎麼算；做了這類定義上的修改之後，可以得到幾乎一樣或很類似的 VC bound。課堂上明講這些數學推導太繁複，不要求大家走一遍，希望大家記得的是精神：前幾堂雖然只在「二元分類、固定的 $f$、0/1 誤差」這個受限的設定下推導，結論可以帶到別的問題與別的誤差衡量上。

### Fun Time：絕對誤差的 ideal mini-target

**題目（第 13 頁）：** 考慮下面的 $P(y \mid \mathbf{x})$，誤差衡量是 $\text{err}(\tilde{y}, y) = \lvert \tilde{y} - y \rvert$。ideal mini-target $f(\mathbf{x})$ 是哪一個？

$$
P(y = 1 \mid \mathbf{x}) = 0.10, \quad P(y = 2 \mid \mathbf{x}) = 0.35, \quad P(y = 3 \mid \mathbf{x}) = 0.15, \quad P(y = 4 \mid \mathbf{x}) = 0.40
$$

1. 2.5 = $\mathcal{Y} = \{1, 2, 3, 4\}$ 的平均
2. 2.85 = 依 $P(y \mid \mathbf{x})$ 算的加權平均
3. 3 = 依 $P(y \mid \mathbf{x})$ 算的加權中位數
4. 4 = $\text{argmax}\, P(y \mid \mathbf{x})$

**答案：3。** 講義的解答只有一句：對絕對誤差，可以證明加權中位數讓平均誤差最小。課堂上建議最簡單的做法是把四個數字代進去比，並說加權中位數就是機率累積到大約一半的地方的那個數字。先照課堂上的建議代數字：

| 選項 | $\tilde{y}$ | 平均絕對誤差 | 結果 |
|---|---|---|---|
| 1 | 2.5 | $0.10 \times 1.5 + 0.35 \times 0.5 + 0.15 \times 0.5 + 0.40 \times 1.5$ | 1.000 |
| 2 | 2.85 | $0.10 \times 1.85 + 0.35 \times 0.85 + 0.15 \times 0.15 + 0.40 \times 1.15$ | 0.965 |
| 3 | 3 | $0.10 \times 2 + 0.35 \times 1 + 0.15 \times 0 + 0.40 \times 1$ | 0.950 |
| 4 | 4 | $0.10 \times 3 + 0.35 \times 2 + 0.15 \times 1 + 0.40 \times 0$ | 1.150 |

最小的是 $\tilde{y} = 3$。課堂上提到這四個數字各有各的意義，但沒有逐一說明。本文補上：選項 4 是 0/1 誤差的 ideal mini-target（機率最大的是 4），選項 2 是平方誤差的（$0.10 + 0.70 + 0.45 + 1.60 = 2.85$），選項 3 是絕對誤差的。選項 1 完全沒用到機率，把四個值當成一樣可能。同一個分布，三種誤差衡量給出 4、2.85、3 三個不同的理想預測。

為什麼是中位數，本文補上推導。令 $G(\tilde{y}) = \sum_y P(y \mid \mathbf{x})\,\lvert \tilde{y} - y \rvert$。$\tilde{y}$ 往右移一點點，它和左邊每個 $y$ 的距離增加、和右邊每個 $y$ 的距離減少，所以在 $\tilde{y}$ 不等於任何一個 $y$ 的地方，

$$
\frac{dG}{d\tilde{y}} = \sum_{y < \tilde{y}} P(y \mid \mathbf{x}) - \sum_{y > \tilde{y}} P(y \mid \mathbf{x})
$$

斜率是「左邊的機率」減「右邊的機率」。左邊累積的機率還不到一半時斜率是負的，往右走誤差會變小；超過一半之後斜率是正的。最小值就在累積機率跨過 0.5 的那個 $y$。這一題的累積機率是 0.10、0.45、0.60、1.00，在 $y = 3$ 跨過 0.5。對照斜率：$\tilde{y}$ 在 2 與 3 之間時是 $0.45 - 0.55 = -0.10$，在 3 與 4 之間時是 $0.60 - 0.40 = +0.20$，$G$ 在 3 的左邊下降、右邊上升。用表格的數字也驗得出來：從 2.85 走到 3，誤差減少 $0.15 \times 0.10 = 0.015$，正好是 $0.965 - 0.950$。

## 誤差衡量從哪裡來：應用決定 err，演算法另外挑 êrr

```youtube
url: https://www.youtube.com/watch?v=0ApgGq4mh1E
title: Noise and Error :: Algorithmic Error Measure @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–02:20 是指紋辨識與兩種錯誤，02:20–05:00 是超市，05:00–06:57 是 CIA，06:57–11:55 是 err 與 êrr，11:55–12:36 是更新後的流程圖，之後是 Fun Time。）

### 指紋辨識的兩種錯誤

講義第 14 頁用指紋辨識當例子。分類器看到一枚指紋，輸出 $+1$ 代表是你本人，$-1$ 代表是入侵者（intruder）。課堂上舉的用途是判斷你是不是這台電腦的主人，指紋符合才讓你用。這個分類器會犯兩種錯：

| | $g = +1$（放行） | $g = -1$（拒絕） |
|---|---|---|
| $f = +1$（是本人） | 沒有錯 | false reject（誤拒） |
| $f = -1$（是入侵者） | false accept（誤放） | 沒有錯 |

誤放是該拒絕的卻放行了，誤拒是該放行的卻拒絕了。講義在頁尾指出：0/1 誤差對這兩種錯罰得一樣重。課堂上的說法是，之前的演算法只算錯誤的個數，圈變成叉、叉變成圈都算一個錯，至於兩種錯相對有多重要，它不管。

### 超市與 CIA：同一個問題，兩張代價表

講義第 15、16 頁把同一套指紋辨識放進兩個場合，各配一張表，數字是分錯時付出的代價。

**超市**用指紋辨識決定要不要給折扣，常客才有。

| 超市 | $g = +1$ | $g = -1$ |
|---|---|---|
| $f = +1$ | 0 | 10 |
| $f = -1$ | 1 | 0 |

- 誤拒：講義寫 very unhappy customer, lose future business。課堂上描述得很具體：一個每天都來的常客拿不到折扣，會非常生氣，從此不來，還會告訴朋友別來，超市損失的是之後所有的生意。
- 誤放：講義寫 give away a minor discount, intruder left fingerprint。課堂上說只是少賺一點，而且對方還在系統上留下了指紋，要追查也不難。

**CIA** 用指紋辨識管制門禁（講義寫 fingerprint for entrance）；課堂上的說法是，用它決定員工能不能進某個系統看機密資料。

| CIA | $g = +1$ | $g = -1$ |
|---|---|---|
| $f = +1$ | 0 | 1 |
| $f = -1$ | 1000 | 0 |

- 誤放：講義寫 very serious consequences。沒有權限的人看到了機密資料。
- 誤拒：講義寫 unhappy employee, but so what?。課堂上說員工頂多在心裡罵一句爛系統，再刷一次就好；對 CIA 整體的目標來說，員工不高興相對不重要。

課堂上把這種表叫成本表，也說有時叫錯誤表。兩張表對角線都是 0，分對了沒有代價；差別在哪一種錯比較貴。

### 代價表會把決策門檻推到哪裡

以下是本文自擬的例子，用「err 和 P(y|x) 一起決定 ideal mini-target」那一小節的做法把兩張表算一次：$P(y \mid \mathbf{x})$ 與 $\text{err}$ 一起決定 ideal mini-target，現在 $\text{err}$ 換成代價表。

假設某一枚指紋 $\mathbf{x}$ 有 $P(y = +1 \mid \mathbf{x}) = 0.8$，也就是八成是本人。預測 $+1$ 只有在 $y = -1$ 時才錯（誤放），預測 $-1$ 只有在 $y = +1$ 時才錯（誤拒）：

| | 預測 $+1$ 的平均代價 | 預測 $-1$ 的平均代價 | ideal mini-target |
|---|---|---|---|
| 0/1 誤差 | $0.2 \times 1 = 0.2$ | $0.8 \times 1 = 0.8$ | $+1$ |
| 超市 | $0.2 \times 1 = 0.2$ | $0.8 \times 10 = 8$ | $+1$ |
| CIA | $0.2 \times 1000 = 200$ | $0.8 \times 1 = 0.8$ | $-1$ |

同一枚八成是本人的指紋，超市應該放行，CIA 應該拒絕。一般的情況可以直接推出門檻。令 $p = P(y = +1 \mid \mathbf{x})$，誤放的代價是 $c_{\text{FA}}$，誤拒的代價是 $c_{\text{FR}}$。預測 $+1$ 的平均代價是 $c_{\text{FA}}(1 - p)$，預測 $-1$ 的是 $c_{\text{FR}}\,p$。預測 $+1$ 比較划算的條件是

$$
c_{\text{FA}}(1 - p) < c_{\text{FR}}\,p \quad\Longleftrightarrow\quad c_{\text{FA}} < (c_{\text{FA}} + c_{\text{FR}})\,p \quad\Longleftrightarrow\quad p > \frac{c_{\text{FA}}}{c_{\text{FA}} + c_{\text{FR}}}
$$

| | $c_{\text{FA}}$ | $c_{\text{FR}}$ | 門檻 $c_{\text{FA}} / (c_{\text{FA}} + c_{\text{FR}})$ |
|---|---|---|---|
| 0/1 誤差 | 1 | 1 | $1/2 = 0.5$ |
| 誤拒是誤放的 3 倍（本文假設的數字） | 1 | 3 | $1/4 = 0.25$ |
| CIA | 1000 | 1 | $1000/1001 \approx 0.999$ |

0/1 誤差的門檻是 0.5，就是「猜機率大的那一邊」。誤拒比較貴時，門檻會降到 0.5 以下：誤拒的代價是誤放的 3 倍，只要有 25% 以上的機率是本人就該預測 $+1$。超市的表也屬於誤拒比較貴的這一類，所以剛才八成是本人的指紋在超市該放行。誤放比較貴時門檻往上升，CIA 要有 99.9% 以上的把握才放行。代價表沒有改變 $P(y \mid \mathbf{x})$，它改變的是 ideal mini-target，所以兩個場合想要的分類器長得不一樣。課堂上的總結是：不是說了「二元分類」就一律用分類錯誤來算，同樣是二元分類，用在 CIA 和用在超市是完全不同的情形。

### 真正的 err 與演算法用的 êrr

講義第 17 頁的標題是 Take-home Message for Now，第一行是：$\text{err}$ is application/user-dependent。誤差衡量由應用和使用者決定。

最理想的情況是使用者把 $\text{err}$ 交給你，你在演算法裡直接用它。課堂上說這常常做不到，並拿自己舉的數字當例子：CIA 的 1000 是老師自己講的，真的去問 CIA，他們說不出來到底是 1000 倍、2000 倍還是 5000 倍。使用者心裡有想法，但要把它變成演算法能處理的數字很困難。

所以演算法在最佳化時用的往往是另一個誤差衡量，講義記成 $\widehat{\text{err}}$（algorithmic error measure）。課堂上解釋那頂帽子：它和使用者真正在意的不見得完全一樣。講義列出 $\widehat{\text{err}}$ 的三種來源：

**true：就用 $\text{err}$。** 使用者給得出來的話，這是最好的。

**plausible：說得出道理的。** 課堂上稱為能說服我們自己的方式。講義舉兩個：

- 0/1 誤差對應 minimum 'flipping noise'。課堂上回到 pocket 的想法：假設分不對的點都是翻轉雜訊，而且這種雜訊的量很少，那麼找一個讓 0/1 誤差最小的假說就有道理。講義在這一行後面提醒：NP-hard to optimize, remember?，這是[基石第 2 堂](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm)講 pocket 之前提過的事。
- 平方誤差對應 minimum Gaussian noise。課堂上的說明是：如果相信雜訊是高斯分布，高斯分布的指數裡有一個平方項，把平方項減到最小，就像在找最小的高斯雜訊。

本文把第二句話寫成式子。假設 $y = h(\mathbf{x}) + \epsilon$，$\epsilon$ 是平均為 0、標準差為 $\sigma$ 的高斯雜訊，那麼看到 $y_n$ 的機率密度正比於 $\exp\!\big(-(y_n - h(\mathbf{x}_n))^2 / 2\sigma^2\big)$。$N$ 筆獨立的資料同時出現的機率密度是各筆相乘，取對數後變成相加：

$$
\ln \prod_{n=1}^{N} \exp\!\Big(-\frac{(y_n - h(\mathbf{x}_n))^2}{2\sigma^2}\Big) = -\frac{1}{2\sigma^2}\sum_{n=1}^{N} \big(y_n - h(\mathbf{x}_n)\big)^2
$$

讓資料看起來最可能出現的 $h$，就是讓平方誤差總和最小的 $h$。這個論證只說明平方誤差「說得通」，前提是雜訊真的接近高斯分布。

**friendly：好最佳化的。** 0/1 誤差雖然說得通，卻很難最佳化，所以還需要第三種：對演算法 $\mathcal{A}$ 友善的。講義舉兩種：

- closed-form solution（閉式解）。課堂上的說法是式子列出來，照著算下去馬上就得到解。
- convex objective function（凸的目標函數）。課堂上的比喻是，做最小化時只要像一顆球從山上滾到山谷裡。

頁尾寫 $\widehat{\text{err}}$: more in next lectures。本文補充接下來會看到的兩個實例：[基石第 9 堂](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression)的線性迴歸用平方誤差，有閉式解；[基石第 10 堂](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-10-logistic-regression)的邏輯迴歸用的誤差是凸的。

講義第 18 頁再更新一次流程圖（Learning Flow with Algorithmic Error Measure）：$\text{err}$ 的橢圓還在右下角，仍然指向 $g \approx f$ 與 $\mathcal{A}$；演算法 $\mathcal{A}$ 的橢圓裡多了一小塊 $\widehat{\text{err}}$。頁尾把兩者的分工寫成兩行：$\text{err}$ 是應用的目標（application goal），$\widehat{\text{err}}$ 是很多演算法的關鍵部分（a key part of many $\mathcal{A}$）。課堂上對 $\widehat{\text{err}}$ 的形容是，它是演算法裡試著讓我們日子好過一點的那一塊。

### Fun Time：把 CIA 的代價表寫成 E_in

**題目（第 19 頁）：** 用 CIA 的代價表（誤放 1000、誤拒 1）當 $\text{err}$，$E_{\text{in}}(g)$ 是哪一個？

1. $\frac{1}{N}\sum_{n=1}^{N} \llbracket y_n \ne g(\mathbf{x}_n) \rrbracket$
2. $\frac{1}{N}\Big(\sum_{y_n = +1} \llbracket y_n \ne g(\mathbf{x}_n) \rrbracket + 1000\sum_{y_n = -1} \llbracket y_n \ne g(\mathbf{x}_n) \rrbracket\Big)$
3. $\frac{1}{N}\Big(\sum_{y_n = +1} \llbracket y_n \ne g(\mathbf{x}_n) \rrbracket - 1000\sum_{y_n = -1} \llbracket y_n \ne g(\mathbf{x}_n) \rrbracket\Big)$
4. $\frac{1}{N}\Big(1000\sum_{y_n = +1} \llbracket y_n \ne g(\mathbf{x}_n) \rrbracket + \sum_{y_n = -1} \llbracket y_n \ne g(\mathbf{x}_n) \rrbracket\Big)$

**答案：2。** 關鍵是分清楚兩種錯各發生在哪一類資料上。$y_n = -1$ 的資料是入侵者，$g$ 在這種資料上錯，就是把入侵者放行，是誤放，代價 1000。$y_n = +1$ 的資料是本人，在上面錯是誤拒，代價 1。所以 1000 要乘在 $y_n = -1$ 的那個加總上。

講義的解答把這種錯寫成 false positive：$y_n = -1$ 時犯的 false positive 被罰 1000 倍。這和前幾頁的 false accept 是同一件事（把負的判成正的），課堂上講解這題時用的仍是 false accept。

其他選項：選項 1 是原本的 0/1 誤差，兩種錯一樣重。選項 4 把 1000 乘到 $y_n = +1$ 的錯誤上，罰重的變成誤拒，方向和 CIA 相反（比較像超市，只是倍數不同）。選項 3 把誤放的項變成負的，放進愈多入侵者 $E_{\text{in}}$ 反而愈低。

本文用一組小數字核對。$N = 5$，其中 3 筆是本人、2 筆是入侵者；$g$ 誤拒了 2 個本人、誤放了 1 個入侵者。四個選項分別是 $3/5 = 0.6$、$(2 + 1000)/5 = 200.4$、$(2 - 1000)/5 = -199.6$、$(2000 + 1)/5 = 400.2$。照代價表逐筆加總是 $1 + 1 + 1000 = 1002$，除以 5 是 200.4，和選項 2 一致。

## 兩種錯誤不等價時怎麼學：加權分類與複製資料

```youtube
url: https://www.youtube.com/watch?v=XfuRb1jT4hs
title: Noise and Error :: Weighted Classification @ Machine Learning Foundations (機器學習基石)
```

（影片 00:01–02:54 是加權分類的定義，02:54–05:55 是直覺的改法與它的疑問，05:55–09:32 是複製資料，09:32–12:50 是 weighted pocket 與 reduction，12:50–14:58 是 Fun Time，之後是整堂的總結。）

### 加權分類的 E_in 與 E_out

講義第 20 頁把 CIA 的表叫作 Cost (Error, Loss, …) Matrix。課堂上說明這幾個名字：cost 是成本，loss 是損失，error 是錯誤，不同的書和論文用不同的名字，意思相近，都是希望它愈小愈好；這門課盡量用 error。表的列是真實的 $y$，欄是 $h(\mathbf{x})$：

| CIA | $h(\mathbf{x}) = +1$ | $h(\mathbf{x}) = -1$ |
|---|---|---|
| $y = +1$ | 0 | 1 |
| $y = -1$ | 1000 | 0 |

照這張表，out-of-sample 與 in-sample 的誤差是

$$
E_{\text{out}}(h) = \mathop{\mathbb{E}}_{(\mathbf{x}, y) \sim P} \left\{ \begin{array}{ll} 1 & \text{if } y = +1 \\ 1000 & \text{if } y = -1 \end{array} \right\} \cdot \llbracket y \ne h(\mathbf{x}) \rrbracket
$$

$$
E_{\text{in}}(h) = \frac{1}{N}\sum_{n=1}^{N} \left\{ \begin{array}{ll} 1 & \text{if } y_n = +1 \\ 1000 & \text{if } y_n = -1 \end{array} \right\} \cdot \llbracket y_n \ne h(\mathbf{x}_n) \rrbracket
$$

大括號裡是這筆資料的權重，後面的 $\llbracket \cdot \rrbracket$ 仍是對或錯。$E_{\text{in}}$ 的式子就是「把 CIA 的代價表寫成 E_in」那題 Fun Time 的答案換個寫法。講義把這類問題叫加權分類（weighted classification）：不同的 $(\mathbf{x}, y)$ 有不同的權重。

課堂上先澄清一個容易混淆的地方：這裡的 weight 是每筆資料的重要性，和 PLA 裡那條線的權重向量 $\mathbf{w}$ 是兩回事。接著給了一個比喻：像考卷上每一題配分不同，有的題目一題一千分，有的只有一分。權重也不一定只跟 $y$ 有關，課堂上提到另一種可能是不同的顧客有不同的重要性。

### 直覺的改法，以及它少了什麼

VC 理論在這裡仍然適用（課堂上請大家相信這一點），所以剩下的問題和以前一樣：怎麼把 $E_{\text{in}}$ 做小。為了和原本的 0/1 版本區分，講義第 21 頁把加權的版本記成 $E_{\text{in}}^{\text{w}}$，原本的記成 $E_{\text{in}}^{0/1}$。這一頁的標題是 Naïve Thoughts，檢查手上已有的兩個演算法：

- **PLA：** 講義寫 doesn't matter if linear separable。資料線性可分時，PLA 跑完會得到一條完全沒有錯誤的線，$E_{\text{in}}^{0/1} = 0$。沒有任何一筆分錯，不管每筆的權重是多少，$E_{\text{in}}^{\text{w}}$ 也是 0，而 0 已經是最小值。所以 PLA 完全不用管權重，照跑就好。
- **pocket：** 資料分不開時 PLA 停不下來，要用 pocket。pocket 裡和 $E_{\text{in}}$ 有關的步驟只有一個：新找到的 $\mathbf{w}_{t+1}$ 比口袋裡的 $\hat{\mathbf{w}}$ 好就換掉。直覺的改法是把「好」的標準換成加權的：$\mathbf{w}_{t+1}$ 的 $E_{\text{in}}^{\text{w}}$ 比 $\hat{\mathbf{w}}$ 小，就用 $\mathbf{w}_{t+1}$ 取代 $\hat{\mathbf{w}}$。

這個改法看起來合理。講義在頁尾問：原本的 pocket 對 $E_{\text{in}}^{0/1}$ 有某種保證，改過的 pocket 對 $E_{\text{in}}^{\text{w}}$ 有類似的保證嗎？課堂上講得比較直白：拿一個演算法來改一行，靠的是自己腦袋裡的直覺，還半開玩笑地把這叫作工人智慧；這樣改完，理論上的保證還在不在，並不清楚。接下來要找一個有根據的改法。

### 把 −1 的資料複製 1000 次

講義第 22 頁的標題是 Systematic Route: Connect $E_{\text{in}}^{\text{w}}$ and $E_{\text{in}}^{0/1}$。做法是把加權的問題接到已經會解的 0/1 問題上。頁面分左右兩欄：

| | 原始問題（左） | 等價問題（右） |
|---|---|---|
| 代價表 | 誤放 1000、誤拒 1 | 誤放 1、誤拒 1（就是 0/1 誤差） |
| 資料 | $\mathcal{D}$：每筆出現一次 | 每筆 $y_n = +1$ 的資料出現一次，每筆 $y_n = -1$ 的資料出現 1000 次 |

講義的結論是：把 $-1$ 的資料複製 1000 次之後，左邊的 $E_{\text{in}}^{\text{w}}$ 等價於右邊的 $E_{\text{in}}^{0/1}$。

課堂上用收錢來解釋。假設 $h$ 在 $(\mathbf{x}_2, -1)$ 上犯了誤放。右邊的資料把這筆複製了 1000 次，$h$ 在其中一份上錯，在另外 999 份上也一定錯，因為它們是同一個 $\mathbf{x}_2$。如果每個錯誤收一塊錢，$h$ 在右邊要為這筆付一千塊。在 $+1$ 的資料上犯錯則只付一塊。所以在右邊「每種錯都收一塊」收到的錢，和在左邊照代價表收到的錢完全一樣；而每種錯都收一塊就是 0/1 誤差。

本文把這段話寫成式子。設 $h$ 在 $\mathcal{D}$ 上犯了 $a$ 個誤放、$r$ 個誤拒，$\mathcal{D}$ 裡有 $N_+$ 筆 $+1$、$N_-$ 筆 $-1$（$N = N_+ + N_-$）。複製後的資料集記成 $\mathcal{D}'$，大小是 $N' = N_+ + 1000N_-$。那麼

$$
E_{\text{in}}^{\text{w}}(h) \text{ on } \mathcal{D} = \frac{r + 1000a}{N}, \qquad E_{\text{in}}^{0/1}(h) \text{ on } \mathcal{D}' = \frac{r + 1000a}{N'}
$$

兩者的分子相同，分母差一個和 $h$ 無關的常數 $N'/N$。所以嚴格說兩個數字不相等，講義用的符號是「≡」；但任何兩個假說，在左邊誰的 $E_{\text{in}}^{\text{w}}$ 小，在右邊誰的 $E_{\text{in}}^{0/1}$ 就小，讓其中一個最小的 $h$ 也讓另一個最小。對「找最好的假說」這件事，兩個問題是同一個問題。

右邊是一般的 0/1 分類，pocket 可以直接用，它原有的保證也跟著適用（課堂上補了一句：這個保證他沒有真的證明過，只是請大家相信）。於是最簡單的解法出現了：真的把資料複製好，丟給原本的 pocket。

### weighted pocket：只在腦中複製

真的複製要多花記憶體、硬碟與時間。課堂上說一般不會真的這樣做，而是設計演算法時想像資料已經複製過。講義第 23 頁把這叫 virtual copying，並列出原本的 pocket 跑在 $\mathcal{D}'$ 上時，哪兩個步驟會受影響。這兩個步驟合起來就是 weighted pocket algorithm：

1. **weighted PLA：** pocket 裡面的 PLA 每一輪要隨機找一筆資料檢查有沒有分錯。在 $\mathcal{D}'$ 上隨機挑一筆，每筆 $-1$ 的資料因為有 1000 份，被挑到的機率是每筆 $+1$ 資料的 1000 倍。講義寫的是：randomly check $-1$ example mistakes with 1000 times more probability。
2. **weighted pocket replacement：** 在 $\mathcal{D}'$ 上比較 $E_{\text{in}}^{0/1}$，等於在 $\mathcal{D}$ 上比較 $E_{\text{in}}^{\text{w}}$。所以 $\mathbf{w}_{t+1}$ 的 $E_{\text{in}}^{\text{w}}$ 比 $\hat{\mathbf{w}}$ 小就換掉。

第二步就是剛才直覺想到的那一行。直覺的改法漏掉的是第一步：挑資料的機率也要跟著權重改。走系統性的路才看得出來。

課堂上還指出這種寫法的一個好處。複製只能做整數次，但「挑到的機率乘上權重」不受這個限制：權重是 11.26 的話，把機率提高成 11.26 倍就可以了。

講義在頁尾給這種做法一個名字：systematic route，也叫 reduction（化約），並強調它可以套用到很多其他演算法上。課堂上說它和資訊科學理論裡把一個問題轉化成另一個問題來解是類似的；之後教的二元分類演算法，也都可以用同樣的方式延伸成加權的版本。這個系列後面的[技法第 8 堂：AdaBoost](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-08-adaptive-boosting) 會再用到「每筆資料帶一個權重」的想法。

### 數值例子：八個點、三張代價表

以下是本文自擬的例子，不在講義上。用[基石第 5 堂](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function)的 positive ray 當假說集合：$h_\theta(x) = +1$ 若 $x > \theta$，否則 $-1$。輸入是一維的，可以想成指紋比對系統給的相似度分數，分數超過門檻 $\theta$ 就放行。資料有 8 筆，4 筆本人、4 筆入侵者：

| $x_n$ | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| $y_n$ | $-1$ | $-1$ | $+1$ | $-1$ | $+1$ | $+1$ | $-1$ | $+1$ |

資料不是「左邊全是 $-1$、右邊全是 $+1$」，任何門檻都會分錯幾筆。8 個點把數線切成 9 段，每段取一個 $\theta$ 就涵蓋了所有不同的分法。對每個 $\theta$，數出誤拒（$y_n = +1$ 但 $x_n \le \theta$）與誤放（$y_n = -1$ 但 $x_n > \theta$）的筆數，再套三張代價表：

| $\theta$ | 誤拒 $r$ | 誤放 $a$ | 0/1：$\frac{r + a}{8}$ | 超市：$\frac{10r + a}{8}$ | CIA：$\frac{r + 1000a}{8}$ |
|---|---|---|---|---|---|
| 0.5 | 0 | 4 | 0.5 | 0.5 | 500 |
| 1.5 | 0 | 3 | 0.375 | 0.375 | 375 |
| 2.5 | 0 | 2 | **0.25** | **0.25** | 250 |
| 3.5 | 1 | 2 | 0.375 | 1.5 | 250.125 |
| 4.5 | 1 | 1 | **0.25** | 1.375 | 125.125 |
| 5.5 | 2 | 1 | 0.375 | 2.625 | 125.25 |
| 6.5 | 3 | 1 | 0.5 | 3.875 | 125.375 |
| 7.5 | 3 | 0 | 0.375 | 3.75 | **0.375** |
| 8.5 | 4 | 0 | 0.5 | 5 | 0.5 |

以 $\theta = 4.5$ 為例：$x = 5, 6, 7, 8$ 被判成 $+1$。$x = 3$ 是本人卻被拒絕（$r = 1$），$x = 7$ 是入侵者卻被放行（$a = 1$）。CIA 的加權誤差是 $(1 + 1000)/8 = 125.125$。

**這張表代表什麼。**

- 0/1 誤差在 $\theta = 2.5$ 與 $\theta = 4.5$ 打平，都是 0.25，它分不出這兩個門檻的差別。
- 超市選 $\theta = 2.5$：門檻放低，一個常客都不拒絕，代價是放進兩個不該有折扣的人。
- CIA 選 $\theta = 7.5$：門檻拉到最高分的入侵者（$x = 7$）之上，一個入侵者都不放，代價是 4 個本人裡拒絕了 3 個。它的 0/1 誤差是 0.375，比 0.25 差，但 CIA 在意的不是那個數字。
- 加權的 $E_{\text{in}}$ 不再是 0 到 1 之間的比例，可以遠大於 1。它的單位是「每筆資料平均付出的代價」。

**驗證複製資料的說法。** 把 4 筆 $-1$ 各複製 1000 次，$\mathcal{D}'$ 有 $4 + 4000 = 4004$ 筆。$\theta = 4.5$ 在 $\mathcal{D}'$ 上錯了 $1 + 1000 = 1001$ 筆，$E_{\text{in}}^{0/1} = 1001/4004 = 0.25$；$\theta = 7.5$ 錯了 3 筆，$E_{\text{in}}^{0/1} = 3/4004 \approx 0.00075$。對每一個 $\theta$，$\mathcal{D}$ 上的 $E_{\text{in}}^{\text{w}}$ 除以 $\mathcal{D}'$ 上的 $E_{\text{in}}^{0/1}$ 都是 $4004/8 = 500.5$，就是前面說的常數 $N'/N$。九個門檻在兩邊的排名完全一樣，最好的都是 $\theta = 7.5$。本文用程式把資料實際複製出來逐筆數過，九列都相符。

**weighted PLA 的挑選機率。** 在 $\mathcal{D}'$ 上均勻地挑一筆，挑到某一筆特定入侵者資料的機率是 $1000/4004 \approx 0.2498$，挑到某一筆特定本人資料的機率是 $1/4004 \approx 0.00025$。四筆入侵者合計占了 $4000/4004 \approx 99.9\%$ 的檢查機會，演算法幾乎把所有心力都花在「不要放錯人」上。

### Fun Time：資料很不平衡時，永遠放行的假說有多糟

**題目（第 24 頁）：** 用 CIA 的代價表。資料裡有 10 筆 $y_n = -1$（入侵者）與 999,990 筆 $y_n = +1$（本人）。一個永遠輸出 $+1$ 的常數假說 $h$，$E_{\text{in}}^{\text{w}}(h)$ 是多少？

1. 0.001
2. 0.01
3. 0.1
4. 1

**答案：2。** 永遠輸出 $+1$，999,990 筆本人全對，10 筆入侵者全部誤放，每筆的代價是 1000。$N = 10 + 999{,}990 = 1{,}000{,}000$：

$$
E_{\text{in}}^{\text{w}}(h) = \frac{0 \times 1 + 10 \times 1000}{1{,}000{,}000} = \frac{10{,}000}{1{,}000{,}000} = 0.01
$$

選項 1、3、4 分別差了 10 倍、10 倍、100 倍，相當於把入侵者的筆數或權重看錯一個位數。

講義的解答說，這題的計算很簡單，但這類應用的資料常常非常不平衡（unbalanced），適當地設定權重可以避免偷懶的常數預測。課堂上說明為什麼這個數字讓人擔心：入侵者本來就少見，所以資料會是這種比例；一個不管誰來都放行的假說顯然很爛，但 0.01 是個很小的數字，電腦可能覺得它還不錯。

本文補幾個數字看得更清楚。用 0/1 誤差算，這個假說只錯 $10/1{,}000{,}000 = 0.00001$，幾乎完美，權重 1000 已經把它的誤差放大了 1000 倍，卻還是只有 0.01。拿一個認真的假說來比：它抓到全部 10 個入侵者，但誤拒了 2% 的本人（約 20,000 筆），$E_{\text{in}}^{\text{w}} \approx 20{,}000/1{,}000{,}000 = 0.02$，反而比永遠放行的 0.01 差。用複製資料的角度看，原因很直接：10 筆入侵者複製 1000 次只有 10,000 筆，在一百萬筆裡仍然只占大約 1%。要讓「永遠放行」和「永遠拒絕」（誤差 $999{,}990/1{,}000{,}000 \approx 1$）一樣糟，權重得拉到 $999{,}990/10 = 99{,}999$。所以代價表上的數字要和資料的比例一起看；課堂上的結論是，調整權重是處理不平衡資料的一種常用方式。

本文補充一個做法：遇到不平衡的分類問題，先寫下兩種錯誤各自的代價，再決定要調整每筆資料的權重（這一節的做法），還是調整決策的門檻（「代價表會把決策門檻推到哪裡」那一小節的做法）。

### 這堂的總結

講義第 25 頁把四節各收成一句：

| 節 | 結論 |
|---|---|
| Noise and Probabilistic Target | 可以用 $P(y \mid \mathbf{x})$ 取代 $f(\mathbf{x})$ |
| Error Measure | 誤差衡量會影響「理想的」目標 |
| Algorithmic Error Measure | 由使用者決定；給不出來時，用 plausible 或 friendly 的 |
| Weighted Classification | 用虛擬的「複製資料」就能輕鬆做到 |

頁尾的預告是 next: more algorithms, please?。課堂上說這堂結束了基石裡比較偏理論的部分，接下來三到四堂要教更多演算法。Roadmap 也從第二個問題 Why Can Machines Learn? 進到第三個 How Can Machines Learn?。

## 自我檢查

**1. 某個 $\mathbf{x}$ 上，$P(y = 0 \mid \mathbf{x}) = 0.45$、$P(y = 1 \mid \mathbf{x}) = 0.15$、$P(y = 10 \mid \mathbf{x}) = 0.40$。分別求 0/1 誤差、平方誤差、絕對誤差下的 ideal mini-target，以及各自的最小平均誤差。**

答案：0/1 誤差選機率最大的 $y = 0$，平均誤差 $1 - 0.45 = 0.55$。平方誤差選加權平均 $0 \times 0.45 + 1 \times 0.15 + 10 \times 0.40 = 4.15$，平均誤差是變異數 $0.45 \times 4.15^2 + 0.15 \times 3.15^2 + 0.40 \times 5.85^2 = 22.9275$。絕對誤差選加權中位數：累積機率是 0.45、0.60、1.00，在 $y = 1$ 跨過 0.5，所以是 1，平均誤差 $0.45 \times 1 + 0.15 \times 0 + 0.40 \times 9 = 4.05$（預測 0 是 4.15，預測 4.15 是 4.68，都比較大）。三個答案 0、4.15、1 差很多，因為有一個離得很遠的 $y = 10$：平方誤差被它拉過去，絕對誤差與 0/1 誤差不太受影響。

**2. 背後有一個固定的 $f$，標籤以機率 0.2 被隨機翻掉。假說 $h$ 和 $f$ 在 10% 的 $\mathbf{x}$ 上不一致。$h$ 對著有雜訊的標籤算的 $E_{\text{out}}$ 是多少？最好的假說能做到多少？如果你量到某個假說的 $E_{\text{in}} \approx 0.2$，該怎麼解讀？**

答案：$E_{\text{out}}(h) = \tau + (1 - 2\tau)\mu = 0.2 + 0.6 \times 0.1 = 0.26$。最好的假說是 $f$ 本身，$\mu = 0$，$E_{\text{out}} = 0.2$。判準：解讀要說出 0.2 是雜訊造成的下限，$E_{\text{in}} \approx 0.2$ 代表這個假說已經接近最好，而不是「錯了兩成所以模型很差」；要比較假說，看的是超出下限的部分。

**3. 一枚指紋有 $P(y = +1 \mid \mathbf{x}) = 0.95$。用 CIA 的代價表與超市的代價表，ideal mini-target 各是什麼？**

答案：CIA：預測 $+1$ 的平均代價是 $0.05 \times 1000 = 50$，預測 $-1$ 是 $0.95 \times 1 = 0.95$，應該預測 $-1$（0.95 沒有超過門檻 $1000/1001 \approx 0.999$）。超市：預測 $+1$ 是 $0.05 \times 1 = 0.05$，預測 $-1$ 是 $0.95 \times 10 = 9.5$，應該預測 $+1$。同一枚 95% 是本人的指紋，CIA 仍然拒絕。

**4. $N = 1{,}000$，其中 900 筆 $+1$、100 筆 $-1$。假說 $h$ 犯了 30 個誤拒、2 個誤放。用 CIA 的代價表，$E_{\text{in}}^{0/1}$ 與 $E_{\text{in}}^{\text{w}}$ 各是多少？把 $-1$ 的資料複製 1000 次之後，資料集多大？$h$ 在上面的 0/1 誤差是多少？**

答案：$E_{\text{in}}^{0/1} = 32/1000 = 0.032$。$E_{\text{in}}^{\text{w}} = (30 + 2 \times 1000)/1000 = 2.03$。複製後有 $900 + 100 \times 1000 = 100{,}900$ 筆，$h$ 錯了 $30 + 2000 = 2030$ 筆，0/1 誤差是 $2030/100{,}900 \approx 0.0201$。$2.03 \div (2030/100{,}900) = 100.9$，就是 $N'/N$。只有 2 筆誤放，卻占了加權誤差的 $2000/2030 \approx 98.5\%$。

**5. 把 pocket 改成 weighted pocket，要改哪兩個地方？只改「口袋替換規則」那一個地方，少了什麼？**

判準：答案要說出（一）隨機挑資料檢查時，權重大的資料被挑到的機率要等比例提高；（二）比較 $\mathbf{w}_{t+1}$ 與 $\hat{\mathbf{w}}$ 時用 $E_{\text{in}}^{\text{w}}$。並且要說明這兩點的來源是「原本的 pocket 跑在複製後的資料上」：複製後均勻挑資料，自然就是加權的機率。只改替換規則的版本，不等於任何一份資料上的原版 pocket，所以原版的保證沒有理由自動搬過來。

## 練習與對應閱讀

**兩個學期的對應。** [Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) 這堂的投影片是 [08u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/08u_handout.pdf)，只有三個小節，拿掉了 MOOC 版的 Weighted Classification。[Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) 在 W4（09/30）的課前必看清單裡，這堂也只列前三支影片。本文保留加權分類這一節，因為 MOOC 仍有這支影片，而且技法的 AdaBoost 會用到每筆資料帶權重的想法。這些對應是 2026-09-30 查的。

**教科書。** 兩份課程頁都把這堂標在 [Learning from Data](http://amlbook.com)（LFD）的 1.4。

**作業。** [Fall 2024 HW3](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf)（2024-10-07 發布、10-21 截止，涵蓋第 7 到第 10 堂）裡和這堂相關的有兩題，沒有官方解答，批改只限修課生：

- **Q6：** 超市的誤差衡量下（誤拒比誤放重要 10 倍），理想目標變成 $\text{sign}(P(y = +1 \mid \mathbf{x}) - \alpha)$，求 $\alpha$。本文在「代價表會把決策門檻推到哪裡」推過門檻的一般式，那是本文的推導，不是官方解答；作業的設定請以題目為準。做完可以代入幾個具體的 $P(y \mid \mathbf{x})$，檢查你的 $\alpha$ 在超市的代價表下真的讓平均代價最小。
- **Q7：** 課堂上有兩種 $E_{\text{out}}$ 的定義，一種和 $f$ 比，一種和 $P(y \mid \mathbf{x})$ 比。證明兩者之間的不等式，其中 $E_{\text{out}}(f)$ 代表無法消除的雜訊。本文「算一次」那一小節的翻轉雜訊公式是它的一個特例，可以先拿來建立直覺。

HW3 其他題目見[基石作業導讀](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide)。Fall 2026 的 hw2 依課程頁排在 10/07 公布，2026-09-30 查的時候還沒公開。

**取得方式。** 影片與講義都免費公開；Fall 2024 的作業 PDF 也公開，但沒有官方解答。

**英文對照。** [Caltech Learning from Data](https://work.caltech.edu/telecourse) 用的是同一本教科書，Error and Noise 排在它的第 4 堂；它的第 8 堂是 Bias-Variance Tradeoff，和林軒田把第 8 堂排成 Noise and Error 的路線不同。

**下一堂。** [基石第 9 堂：線性迴歸](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression)進入 How Can Machines Learn?，用這堂的平方誤差當 $\widehat{\text{err}}$，推出有閉式解的演算法。

## 課程影片來源

原始影片：[Noise and Probabilistic Target](https://www.youtube.com/watch?v=Br8J5pZM_CE)、[Error Measure](https://www.youtube.com/watch?v=2gCnX0V1do8)、[Algorithmic Error Measure](https://www.youtube.com/watch?v=0ApgGq4mh1E)、[Weighted Classification](https://www.youtube.com/watch?v=XfuRb1jT4hs)

- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

查核日期：2026-10-13。影片 ID、標題與長度於當天從官方播放清單取得；YouTube 上沒有字幕軌，本文的課堂說法來自自行轉錄的逐字稿。

## 更新紀錄

- 2026-10-13：系列改為一堂一篇，這篇是新拆出的一堂，依講義與影片逐字稿寫成。

## 參考資料

- [基石第 8 堂講義 08_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/08_handout.pdf)：本文的主要底本，四節的內容、流程圖、代價表與四題 Fun Time 都出自這份講義。
- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)：四支影片的 ID 與標題；文中「課堂上」的說法轉述自這四支影片的機器轉錄逐字稿。
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/)：官方講義與錄影入口。
- [Fall 2024 版第 8 堂投影片（08u_handout.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/08u_handout.pdf)：確認 Fall 2024 只上前三節。
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)：對應的 LFD 章節。
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)：W4 的課前必看清單與 hw2 的排程。
- [Fall 2024 Homework 3（hw3_red.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf)：Q6 與 Q7 的題目內容。
- [Learning from Data 教科書網站](http://amlbook.com)：1.4 節的出處。
- [Caltech Learning from Data telecourse](https://work.caltech.edu/telecourse)：英文對照的課程。
- [台大林軒田 機器學習基石與技法 導讀：課程總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)：整門課的位置與閱讀路線。
