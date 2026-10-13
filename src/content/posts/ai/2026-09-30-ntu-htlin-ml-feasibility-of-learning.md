---
title: "學習可行嗎：Hoeffding 不等式與資料以外的保證｜台大林軒田 機器學習基石 第 4 堂"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, learning-theory, probability]
lang: zh-TW
math: true
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 4
tldr: "這堂課先證明只靠資料 D 推不出 D 以外的答案（No Free Lunch），再加上一個假設：資料與未來的輸入都從同一個分布獨立抽出。Hoeffding 不等式於是保證，一個事先固定的假說 h，E_in 與 E_out 相差超過 ε 的機率不超過 2exp(−2ε²N)。演算法要從 M 個假說裡挑，上界乘上 M 變成 2M exp(−2ε²N)；假說有限、資料夠多、E_in 又小，學習就可行。"
description: "台大林軒田機器學習基石第 4 堂 Feasibility of Learning 導讀：No Free Lunch 的窮舉例子、抽彈珠與 Hoeffding 不等式、E_in 與 E_out、驗證一個假說和真正學習的差別、BAD data 與 union bound 的逐步推導，四題 Fun Time 都附解釋與驗算。"
draft: false
glossary:
  - term: "Hoeffding's inequality"
    aliases: ["Hoeffding 不等式"]
    definition: "N 個獨立抽出的樣本，樣本比例 ν 與真實機率 µ 相差超過 ε 的機率不超過 2exp(−2ε²N)；這個上界不需要知道 µ。"
    context: "基石第 4 堂用它說明：資料夠多時，一個固定假說的 E_in(h) 很可能接近 E_out(h)。"
  - term: "PAC"
    aliases: ["probably approximately correct", "大概差不多正確"]
    definition: "「大概（高機率）差不多（誤差在 ε 內）正確」。基石用它描述 ν ≈ µ、E_in ≈ E_out 這類機率性的保證。"
    context: "基石第 4 堂的核心用語，之後的 VC bound 也是 PAC 形式的保證。"
  - term: "BAD data"
    aliases: ["BAD sample", "不好的資料"]
    definition: "讓某個假說的 E_in 與 E_out 相差超過 ε 的資料集 D。有很多假說時，只要對其中一個假說是 BAD，這份 D 就算 BAD。"
    context: "基石第 4 堂用它把「演算法能不能放心挑」寫成一個機率。"
  - term: "union bound"
    aliases: ["連集上界"]
    definition: "幾個事件至少發生一個的機率，不超過各事件機率的總和。不需要事件互相獨立。"
    context: "基石第 4 堂用它把一個假說的 Hoeffding 推到 M 個假說，代價是上界乘上 M。"
  - term: "No Free Lunch"
    aliases: ["天下沒有白吃的午餐", "NFL"]
    definition: "對目標函數不做任何假設時，只靠資料 D 無法保證假說在 D 以外的表現。"
    context: "基石第 4 堂的出發點；後面三節都在回答要加什麼假設才能繞過它。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning-en)

**影片狀態：已附影片。** 這篇依官方 MOOC 講義 [04_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/04_handout.pdf) 與這堂四支官方影片的機器轉錄逐字稿寫成，公式以講義為準；逐字稿未經人工校對。每一節開頭附該節的官方影片與大致的時間區段。文中的頁碼指投影片右下角的編號（0/26 到 26/26），寫「課堂上」的地方是轉述影片裡的說法。

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)裡的基石第 4 堂。講義第 1 頁的 Roadmap 把基石分成四個問題，這堂是第一個問題「When Can Machines Learn?」的最後一堂。上一堂[基石第 3 堂：學習的種類](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-03-types-of-learning)在 Roadmap 上只留一行：之後專心處理批次、監督式、具體特徵的二元分類與迴歸。課堂上回顧時說，上一堂結尾埋了一個梗：就算在這麼核心的設定裡，學習也可能根本做不到。

這堂就從這個壞消息開始。[基石第 2 堂](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm)的 PLA 可以在看過的資料上全對，但銀行在乎的是還沒上門的顧客。看過的資料全對，能不能保證沒看過的也大致會對？四節的答案依序是：不加假設的話不能；加上「資料是獨立抽樣來的」之後，一個事先固定的假說可以驗證；演算法要在很多假說裡挑的話，保證還在，但要付代價。

先備是[基石第 1 堂](/posts/ai/2026-09-30-ntu-htlin-ml-learning-problem-perceptron)的學習流程圖（$f$、$\mathcal{D}$、$\mathcal{H}$、$\mathcal{A}$、$g$）、基石第 2 堂的 PLA，以及基礎機率（獨立事件、二項分布、指數函數與自然對數）。讀完之後，你應該能自己寫出從一個假說的 Hoeffding 不等式到 $M$ 個假說的 union bound 這幾行推導，代數字算出上界，並且說清楚「驗證」和「學習」差在哪裡。

## 只看資料，為什麼保證不了資料以外的答案

```youtube
url: https://www.youtube.com/watch?v=tOgbh5_747w
title: Feasibility of Learning :: Learning is Impossible? @ Machine Learning Foundations (機器學習基石)
```

（影片 00:18–01:37 回顧上一堂，01:37–05:28 是圖形題，05:28–11:45 是三個位元的例子與 No Free Lunch，之後是 Fun Time。）

### 一道怎麼答都會被說錯的題目

講義第 2 頁出了一題給人做的學習題，課堂上說這題考的是「工人智慧」。六張 3×3 的黑白格子圖，上排三張標 $y_n = -1$，下排三張標 $y_n = +1$，問第七張圖的 $g(\mathbf{x})$ 是多少。把圖寫成文字，■ 是黑格、□ 是白格，三列由上到下用「／」隔開：

| 圖 | 標籤 | 三列（由上到下） | 黑格數 |
|---|---|---|---|
| 上排左 | $-1$ | ■□□／■□■／□■□ | 4 |
| 上排中 | $-1$ | ■□□／□□■／■□■ | 4 |
| 上排右 | $-1$ | ■□□／□□■／□□□ | 2 |
| 下排左 | $+1$ | □□■／□■□／■□□ | 3 |
| 下排中 | $+1$ | □■□／■□■／□■□ | 4 |
| 下排右 | $+1$ | □■■／■■□／□■■ | 6 |
| 要預測的圖 | ? | ■□□／□■□／□□■ | 3 |

第 3 頁的標題是 Two Controversial Answers，列了四條規則，每一條都把六張圖分對：

| 規則 | 對六張圖 | 對第七張圖 |
|---|---|---|
| 有對稱 ⇔ $+1$ | 下排三張各有對稱軸，上排三張都沒有 | 沿對角線對稱，$+1$ |
| （黑格或白格剛好 3 個）或（黑格 4 個且上排中間是黑的）⇔ $+1$ | 下排：黑 3、黑 4 且上中黑、白 3；上排都不符合 | 黑格 3 個，$+1$ |
| 左上角是黑的 ⇔ $-1$ | 上排左上角全黑，下排全白 | 左上角黑，$-1$ |
| 中間那一行最多 1 個黑格，而且右上角是白的 ⇔ $-1$ | 上排三張都符合，下排三張都不符合 | 中間行 1 黑、右上白，$-1$ |

本文把七張圖照上表輸入，用 Python 逐條檢查過，四條規則在六張有標籤的圖上都全對，前兩條對第七張圖說 $+1$，後兩條說 $-1$。

課堂上把這演成一段對話：學生答 $-1$，老師就說「我心裡的規則是對稱，答案是 $+1$」；學生答 $+1$，老師就說「我心裡的規則是左上角，答案是 $-1$」。講義的結論是：這些都是成立的理由，一位存心作對的老師（adversarial teacher）永遠可以說你沒學會。課堂上補充，這題已經用了最核心的設定：二元分類、監督式、六筆資料，照樣怎麼答都能被判錯。

### 換成可以窮舉的版本

圖形題的規則太多，數不完。第 4 頁把問題縮到可以全部列出來：輸入是三個位元，$\mathcal{X} = \{0,1\}^3$，共 8 種輸入；輸出 $\mathcal{Y} = \{\circ, \times\}$。資料 $\mathcal{D}$ 給了其中 5 種輸入的答案：

| $\mathbf{x}_n$ | $y_n = f(\mathbf{x}_n)$ |
|---|---|
| 000 | ○ |
| 001 | × |
| 010 | × |
| 011 | ○ |
| 100 | × |

8 種輸入、每種輸出有 2 種可能，所以從 $\mathcal{X}$ 到 $\mathcal{Y}$ 的函數一共 $2^8 = 256$ 個。講義說這時可以把所有可能的 $f$ 都放進 $\mathcal{H}$；課堂上的說法是，既然只有 256 種，就全部放進假說集合。演算法從裡面挑一個在 5 筆資料上全對的 $g$，也就是所有 $g(\mathbf{x}_n) = y_n$。講義在這裡註明 like PLA，課堂上解釋：PLA 做的大致也是這件事，找到一條線把看過的圈圈叉叉完全分開。問題是這樣的 $g$ 跟 $f$ 像不像。

第 5 頁把答案列成表。$\mathcal{D}$ 沒涵蓋的輸入剩 101、110、111 三種，每種的真實答案可以是 ○ 或 ×，所以跟 $\mathcal{D}$ 完全相容的目標函數有 $2^3 = 8$ 個，講義記成 $f_1$ 到 $f_8$：

| $\mathbf{x}$ | $y$ | $g$ | $f_1$ | $f_2$ | $f_3$ | $f_4$ | $f_5$ | $f_6$ | $f_7$ | $f_8$ |
|---|---|---|---|---|---|---|---|---|---|---|
| 000 | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ |
| 001 | × | × | × | × | × | × | × | × | × | × |
| 010 | × | × | × | × | × | × | × | × | × | × |
| 011 | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ | ○ |
| 100 | × | × | × | × | × | × | × | × | × | × |
| 101 | | ? | ○ | ○ | ○ | ○ | × | × | × | × |
| 110 | | ? | ○ | ○ | × | × | ○ | ○ | × | × |
| 111 | | ? | ○ | × | ○ | × | ○ | × | ○ | × |

前五列是 $\mathcal{D}$，八個 $f$ 在這裡長得一模一樣，$g$ 也被演算法調成一樣。講義的兩行結論：

- $g \approx f$ inside $\mathcal{D}$：當然。
- $g \approx f$ outside $\mathcal{D}$：不行。但這才是我們要的。

課堂上用一個具體的 $g$ 把後三列走了一遍：假設你的 $g$ 在 101、110、111 上的預測是 ○×○。最壞的情形是真正的 $f$ 剛好是 ×○×（表上的 $f_6$），三個全錯。

本文補充，把這個 $g$ 對八個 $f$ 各數一次。它在三個新輸入上答對的個數，對 $f_1$ 到 $f_8$ 依序是 2、1、3、2、1、0、2、1，合計 12，平均 $12/8 = 1.5$ 個，正好一半。換成別的 $g$ 也一樣：本文用 Python 把 8 種可能的預測都列過，每一種對八個 $f$ 的答對個數都是一個 3、三個 2、三個 1、一個 0。三個新輸入、每個猜對的機會一半，跟丟銅板沒有差別。這就是課堂上說的：如果八個 $f$ 都有可能，平均來說我們好像沒有學到任何東西。

### No Free Lunch 說了什麼

講義第 5 頁的最後一句：只要任何「未知的」$f$ 都可能發生，從 $\mathcal{D}$ 學習、想推論 $\mathcal{D}$ 以外的事，就注定失敗。課堂上說機器學習裡有一系列研究把這件事叫 No Free Lunch，天下沒有白吃的午餐。

這句話的條件要看清楚。課堂上的講法是：我們一直堅持 $f$ 是未知的；如果只堅持這一點、別的什麼都不假設，就沒辦法說 $g$ 在資料以外是好是壞，要說得出來就得加上一些假設。課堂上也提醒我們要的確實是資料以外的部分：信用卡的例子裡，銀行想知道的是新顧客上門時，$g$ 的答案跟理想公式的答案一不一樣，舊顧客答對不算數。

所以這一節留下的問題是：要加什麼假設。後面三節加的那個假設跟 $f$ 長什麼樣子無關，只管資料是怎麼來的。

### Fun Time：只有一筆資料的智力題

**題目（第 6 頁）：** 這是一個流傳很廣的動腦題，號稱全世界最聰明的 2% 的人才看得出「隱藏的規律」：

$$
(5, 3, 2) \rightarrow 151022, \qquad (7, 2, 5) \rightarrow \ ?
$$

它就像一個 $N = 1$ 的學習問題，$\mathbf{x}_1 = (5, 3, 2)$、$y_1 = 151022$。從這一筆資料學一個假說，去預測 $\mathbf{x} = (7, 2, 5)$。你的答案是？

1. 151026
2. 143547
3. 我需要更多例子才能得到正確答案
4. 沒有「正確」答案

**答案：4。** 講義的理由是，這跟剛才的 No Free Lunch 是同一回事：在這種存心作對的設定下，沒辦法指望答對。講義順帶說明選項 2 是出題者的答案：前兩位是 $x_1 \cdot x_2$，中間兩位是 $x_1 \cdot x_3$，最後兩位是 $x_1 \cdot x_2 + x_1 \cdot x_3 - x_2$。驗算：$(5,3,2)$ 得到 15、10、$15 + 10 - 3 = 22$，接起來是 151022；$(7,2,5)$ 得到 14、35、$14 + 35 - 2 = 47$，接起來是 143547。

選項 1 也講得出道理。本文自擬一條規則：$y = 151012 + 2x_1$。$(5,3,2)$ 給 $151012 + 10 = 151022$，跟資料相符；$(7,2,5)$ 給 $151012 + 14 = 151026$。只有一筆資料時，兩條規則都全對，沒有理由說哪一條才是真的。

選項 3 聽起來謹慎，但也不對。剛才的表已經示範過：8 種輸入看了 5 種，剩下 3 種照樣什麼都可能。例子再多，只要問的是沒看過的輸入，又不對 $f$ 做任何假設，就沒有所謂正確答案。課堂上的說法是：你要答任何數字，都可以說自己是對的；網路上那個答案只是其中一種解釋。

## 換一個推得動的問題：從一把彈珠推整罐的比例

```youtube
url: https://www.youtube.com/watch?v=MgAihqFPkZc
title: Feasibility of Learning :: Probability to the Rescue @ Machine Learning Foundations (機器學習基石)
```

（影片 00:01–01:27 提出罐子的問題，01:27–04:33 是抽樣，04:33–08:19 是 Hoeffding 不等式與 PAC，08:19–10:29 讀這條式子，之後是 Fun Time。）

### 罐子與樣本

講義第 7 頁先退一步：在學習問題裡推論 $\mathcal{D}$ 以外的 $f$ 很難，那有沒有別的場合，我們其實推論得出未知的東西？例子是一個裝了非常多橘色與綠色彈珠的罐子（bin）。橘色占多少比例？不知道。課堂上說，彈珠多到沒辦法一顆一顆數。

第 8 頁的做法是統計課的第一堂：抓一把出來看。

| | 罐子（bin） | 樣本（sample） |
|---|---|---|
| 橘色 | 機率 $\mu$ | 比例 $\nu$ |
| 綠色 | 機率 $1 - \mu$ | 比例 $1 - \nu$ |
| 知不知道 | $\mu$ 未知 | $\nu$ 已知 |

樣本是獨立抽出的 $N$ 顆彈珠。課堂上舉的數字是抓 10 顆、其中 3 顆橘色，就猜罐子裡橘色大約占 30%。講義在這一頁引進兩個之後一直用的詞：$\nu$ 是 in-sample 的量，$\mu$ 是 out-of-sample 的量。問題是 $\nu$ 有沒有告訴我們任何關於 $\mu$ 的事。

第 9 頁的回答分兩半，標題是 Possible versus Probable：

- **No，possibly not**：樣本可能大部分是綠的，罐子裡卻大部分是橘的。
- **Yes，probably yes**：$\nu$ 很可能接近未知的 $\mu$。

「有可能發生」和「很可能發生」是兩件事。課堂上說，罐子裡大部分是橘色、抓一把卻幾乎全綠，這種事機率很小但確實會發生，所以我們得不到確定的答案，只能說有很大的機率是這樣。本文補充兩者的差別：No Free Lunch 那一節的對手可以指定最壞的 $f$；這裡沒有人指定你抓到哪一把，抽樣是隨機的，最壞的情形就只是一個機率很小的事件。

### Hoeffding 不等式

「很可能接近」的數學寫法在第 10 頁。$N$ 夠大時，$\nu$ 很可能落在 $\mu$ 的 $\epsilon$ 範圍內：

$$
\mathbb{P}\big[\,\lvert \nu - \mu \rvert > \epsilon\,\big] \ \le\ 2\exp\big(-2\epsilon^2 N\big)
$$

這叫 Hoeffding 不等式（Hoeffding's Inequality）。講義註明它適用於彈珠、銅板、民調等等，課堂上的例子是：銅板丟很多次，正面的比例會接近它真實的正面機率；選舉前打電話做民調，結果跟最後的得票率會很接近。講義沒有證明這條不等式；本文同樣不證，改用數字確認它說的事。

式子裡的每個符號：

- 左邊是一個「壞事」的機率。壞事指樣本比例 $\nu$ 跟真實機率 $\mu$ 差了超過 $\epsilon$。
- $\epsilon$ 是你願意容忍的誤差。
- 右邊是這個機率的上界，$N$ 在指數上，而且帶負號。$N$ 加倍，指數那一項會被平方（$e^{-2a} = (e^{-a})^2$），所以上界掉得很快。

本文補充一個容易看錯的地方：隨機的是 $\nu$。$\mu$ 是罐子的性質，是一個固定但未知的數；每抓一把，$\nu$ 都可能不同。機率 $\mathbb{P}$ 算的是「抓一把」這個動作的所有可能結果裡，壞結果占多少。

講義把結論寫成一句話：「$\nu = \mu$」這個說法是 probably approximately correct（PAC）。課堂上把兩個副詞分開解釋：probably 是「大概」，有很大的機率是對的；approximately 是「差不多」，抽到 30% 橘色，罐子裡可能是 32%、33%、28%、29%，不會剛好相等，但很接近。

### 這條式子好用在哪裡

第 11 頁列了三點：

1. **對所有 $N$ 與 $\epsilon$ 都成立。** 不需要 $N$ 大到某個門檻才能用。
2. **右邊沒有 $\mu$。** 所以不需要知道 $\mu$。課堂上強調這是它能用來做推論的原因：本來就不知道 $\mu$，式子裡也完全沒有對 $\mu$ 做假設。
3. **$N$ 愈大，或容忍的 $\epsilon$ 愈寬，「$\nu \approx \mu$」的機率愈高。** 課堂上對後半句加了評語：把容忍度設大一點，壞事的機率當然變小，但這有點自欺欺人。

頁尾的結論是：$N$ 夠大時，可以用已知的 $\nu$ 大概推論出未知的 $\mu$。

下面的數字是本文算的。先看上界本身，把 $N$ 與 $\epsilon$ 代進 $2\exp(-2\epsilon^2 N)$：

| $N$ | $\epsilon = 0.3$ | $\epsilon = 0.1$ | $\epsilon = 0.05$ |
|---|---|---|---|
| 10 | 0.331 | 1.64 | 1.90 |
| 100 | $3.0 \times 10^{-8}$ | 0.271 | 1.21 |
| 1,000 | 小於 $10^{-77}$ | $4.1 \times 10^{-9}$ | 0.0135 |
| 10,000 | 更小 | 小於 $10^{-86}$ | $3.9 \times 10^{-22}$ |

兩件事值得注意。第一，表裡有超過 1 的數字。機率不會超過 1，所以「上界是 1.64」等於什麼都沒說。式子對所有 $N$ 與 $\epsilon$ 都「成立」，不代表都「有用」。課堂上舉的 10 顆彈珠就是這種情形：要求誤差在 0.1 以內，Hoeffding 給不出任何保證；放寬到 0.3，上界才降到 0.331。第二，$\epsilon$ 在式子裡是平方。誤差要求縮成一半，$N$ 要變成四倍，上界才會一樣；縮成十分之一，$N$ 要一百倍：$N = 100$、$\epsilon = 0.1$ 與 $N = 10{,}000$、$\epsilon = 0.01$ 的上界都是 0.271。

再看它是不是真的只是上界。取 $\mu = 0.4$、$\epsilon = 0.1$，用二項分布把壞事的機率精確算出來：

| $N$ | 精確的 $\mathbb{P}[\lvert\nu - \mu\rvert > 0.1]$ | Hoeffding 上界 |
|---|---|---|
| 10 | 0.334 | 1.64 |
| 100 | 0.0315 | 0.271 |
| 1,000 | $8.7 \times 10^{-11}$ | $4.1 \times 10^{-9}$ |

精確值都在上界底下，而且差了一大截。算精確值要用到 $\mu = 0.4$，算上界不用，這是兩者的交換：Hoeffding 寬鬆，但在不知道 $\mu$ 的時候也算得出來。

最後把式子反過來用。想要「誤差超過 $\epsilon$ 的機率不超過 $\delta$」，令右邊 $2\exp(-2\epsilon^2 N) \le \delta$。兩邊除以 2 再取自然對數得 $-2\epsilon^2 N \le \ln(\delta/2)$，同乘 $-1$ 會讓不等號反向：

$$
N \ \ge\ \frac{1}{2\epsilon^2}\ln\frac{2}{\delta}
$$

代 $\epsilon = 0.1$、$\delta = 0.05$，得 $N \ge \ln 40 / 0.02 \approx 184.4$，抽 185 顆就夠。把誤差收到 $\epsilon = 0.03$，同樣的 $\delta$ 需要 $N \ge \ln 40 / 0.0018 \approx 2049.4$，也就是 2,050 顆。這個反過來用的形式講義這堂沒有寫，只是把同一條不等式移項。

### Fun Time：10 顆彈珠的上界

**題目（第 12 頁）：** 設 $\mu = 0.4$。用 Hoeffding 不等式

$$
\mathbb{P}\big[\,\lvert \nu - \mu \rvert > \epsilon\,\big] \ \le\ 2\exp\big(-2\epsilon^2 N\big)
$$

估計抽 10 顆彈珠時 $\nu \le 0.1$ 的機率上界。你得到多少？

1. 0.67
2. 0.40
3. 0.33
4. 0.05

**答案：3。** 講義的解法是代 $N = 10$、$\epsilon = 0.3$：$\nu \le 0.1$ 表示 $\nu$ 比 $\mu = 0.4$ 至少低了 0.3。

$$
2\exp\big(-2 \times 0.3^2 \times 10\big) = 2\exp(-1.8) \approx 2 \times 0.1653 = 0.331
$$

講義補了一句：選項 4 是實際的機率，Hoeffding 只給上界。本文驗算實際機率：$\nu \le 0.1$ 就是 10 顆裡橘色不超過 1 顆，

$$
0.6^{10} + 10 \times 0.4 \times 0.6^{9} \approx 0.0060 + 0.0403 = 0.0464
$$

四捨五入是 0.05。講義沒有說明另外兩個選項怎麼來的，以下是本文的推測。選項 2 的 0.40 在數值上就是 $\mu$ 本身，跟要算的機率無關。選項 1 的 0.67 在數值上等於 $1 - 0.3306 = 0.6694$，也就是拿 1 減掉上界；那個數是「$\nu$ 與 $\mu$ 相差不超過 0.3」的機率下界，題目問的是 $\nu \le 0.1$ 的機率上界，兩者方向相反。

這題有兩個細節，本文補充。第一，式子裡的事件是嚴格的「大於 $\epsilon$」，而 $\nu = 0.1$ 時 $\lvert\nu - \mu\rvert$ 剛好等於 0.3。要嚴謹的話，取任何比 0.3 小一點的 $\epsilon'$，$\nu \le 0.1$ 就落在 $\lvert\nu - \mu\rvert > \epsilon'$ 裡，上界是 $2\exp(-2\epsilon'^2 \times 10)$；讓 $\epsilon'$ 靠近 0.3，上界就靠近 0.331，答案不變。第二，Hoeffding 管的是兩邊：$\nu$ 太低與太高都算。$\nu \ge 0.7$ 的機率是 0.0548，兩邊合計 0.101，仍然在 0.331 以下；題目只問低的那一邊，所以實際值更小。

課堂上對這題的評語是：要算實際的機率，就一定得知道 $\mu$；Hoeffding 對任何 $\mu$ 都成立，所以它會高估，只是一個上限。

## 把彈珠換成資料：一個固定的假說可以驗證

```youtube
url: https://www.youtube.com/watch?v=iXbbfjJNfwU
title: Feasibility of Learning :: Connection to Learning @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–06:00 是罐子與學習的對應，06:00–07:27 是流程圖多出來的元件，07:27–10:55 是 E_in、E_out 與保證，10:55–15:00 談驗證與學習的差別，之後是 Fun Time。）

### 罐子裡的彈珠是什麼

課堂上先替學生問了一句：這是機器學習課，講一堆彈珠做什麼。第 13 頁把罐子的每個元件對到學習問題：

| 罐子 | 學習 |
|---|---|
| 未知的橘色機率 $\mu$ | 固定的假說 $h$ 與目標 $f$ 不一樣的機率 |
| 罐子裡的一顆彈珠 | 輸入空間裡的一個 $\mathbf{x} \in \mathcal{X}$ |
| 橘色 | $h$ 在這個 $\mathbf{x}$ 上答錯：$h(\mathbf{x}) \ne f(\mathbf{x})$ |
| 綠色 | $h$ 在這個 $\mathbf{x}$ 上答對：$h(\mathbf{x}) = f(\mathbf{x})$ |
| 從罐子獨立抽出 $N$ 顆 | 在 $\mathcal{D} = \{(\mathbf{x}_n, y_n)\}$ 上檢查 $h$，其中 $\mathbf{x}_n$ 是 i.i.d. 抽出的，$y_n = f(\mathbf{x}_n)$ |

課堂上解釋這個對應是怎麼想出來的。未知的是 $f$，要在 $\mathcal{X}$ 的每個點上都估出 $f$ 太難，所以先問簡單一點的問題：手上有一個假說 $h$，來一位新顧客，$h$ 說的跟 $f$ 說的一不一樣。接著把每個 $\mathbf{x}$ 當成一顆彈珠，$h$ 與 $f$ 答案不同就漆成橘色，相同就漆成綠色。

這個漆法有一個前提，課堂上講得很重：手上要先有一個 $h$，而且要固定，不能現在拿這個 $h$ 來漆、等一下換另一個。漆好之後的罐子是這個 $h$ 專屬的罐子。

彈珠的顏色我們看不到（要知道 $f$ 才看得到），但抓出來的那一把看得到。資料裡有 $\mathbf{x}_n$ 也有 $y_n$；課堂上補了一個條件，沒有雜訊時 $y_n$ 就是 $f(\mathbf{x}_n)$。拿 $h(\mathbf{x}_n)$ 跟 $y_n$ 比，就知道第 $n$ 顆是橘是綠。講義的結論：$N$ 夠大、$\mathbf{x}_n$ 又是 i.i.d. 的話，可以用已知的「$h(\mathbf{x}_n) \ne y_n$ 的比例」大概推論未知的「$h(\mathbf{x}) \ne f(\mathbf{x})$ 的機率」。

### 流程圖多了一個元件

第 14 頁在基石第 1 堂的流程圖上加東西。新增的是一個方塊：$\mathcal{X}$ 上的未知機率分布 $P$。它用虛線連到兩個地方：

1. 連到訓練資料，表示 $\mathbf{x}_1, \mathbf{x}_2, \dots, \mathbf{x}_N$ 是從 $P$ 抽出來的。
2. 連到「$h \approx f$ 嗎」這個判斷，表示衡量 $h$ 好不好時用的 $\mathbf{x}$ 也從同一個 $P$ 來。

另外有兩條實線也連到「$h \approx f$ 嗎」這個判斷：一條從訓練資料出發，一條從 $\mathcal{H}$ 出發，線上標著 fixed $h$。判斷的對象是從 $\mathcal{H}$ 借來的一個固定假說，判斷的依據是資料。課堂上說虛線代表這個東西我們不知道，而同一個 $P$ 用在兩個地方就對應到同一個罐子：資料是從罐子裡抓的那一把，衡量的是整個罐子。

有了 $P$，兩個量可以正式定義。講義的寫法：

$$
E_{\text{out}}(h) = \mathop{\mathcal{E}}_{\mathbf{x} \sim P} \llbracket h(\mathbf{x}) \ne f(\mathbf{x}) \rrbracket, \qquad E_{\text{in}}(h) = \frac{1}{N}\sum_{n=1}^{N} \llbracket h(\mathbf{x}_n) \ne y_n \rrbracket
$$

$\llbracket \cdot \rrbracket$ 是這門課的布林記號：裡面的敘述成立就是 1，不成立就是 0。$\mathcal{E}$ 是期望值。所以 $E_{\text{out}}(h)$ 是從 $P$ 抽一個 $\mathbf{x}$ 時 $h$ 答錯的機率，對應 $\mu$，未知；$E_{\text{in}}(h)$ 是 $h$ 在 $N$ 筆資料上答錯的比例，對應 $\nu$，已知。課堂上說 in 指 in-sample，手上樣本裡的錯誤；out 指 out-of-sample，樣本以外、整個罐子的錯誤率。

本文補充：照這個定義，$E_{\text{out}}$ 是對整個 $P$ 取的期望值，$\mathcal{D}$ 裡出現過的輸入如果再被抽到，也照樣算進去。它跟「只數 $\mathcal{D}$ 以外的輸入」是兩個不同的量：No Free Lunch 那一節數的是後者，只看沒出現過的 101、110、111。講義總結頁把彈珠那一節收成 probably approximately correct outside $\mathcal{D}$，課堂上也把 out-of-sample 說成樣本以外、罐子裡的部分，那是比較口語的講法；式子裡的 $E_{\text{out}}$ 以上面的定義為準。輸入空間很大時（例如特徵是連續的數值），再抽到同一個點的機率小到可以忽略，兩個量幾乎相等。輸入只有少數幾種時兩者會差很多，下面「八個輸入的世界」就是照定義對整個 $P$ 算的。

### 一個假說的保證

課堂上說接下來只是做文字代換。把 Hoeffding 裡的 $\nu$ 換成 $E_{\text{in}}(h)$、$\mu$ 換成 $E_{\text{out}}(h)$，就是第 15 頁的 The Formal Guarantee。對任何固定的 $h$：

$$
\mathbb{P}\big[\,\lvert E_{\text{in}}(h) - E_{\text{out}}(h) \rvert > \epsilon\,\big] \ \le\ 2\exp\big(-2\epsilon^2 N\big)
$$

講義列的性質跟罐子那一頁一一對應：

- 對所有 $N$ 與 $\epsilon$ 都成立。
- 右邊沒有 $E_{\text{out}}(h)$，所以不需要知道 $E_{\text{out}}(h)$；$f$ 與 $P$ 都可以保持未知。
- 「$E_{\text{in}}(h) = E_{\text{out}}(h)$」是 PAC。

課堂上對第二點的說法是：$f$ 與 $P$ 只是我們假設它們存在，不需要真的知道；知道 $f$ 的話就不用玩了，根本不必學習。

頁尾是這一節的推論鏈：

$$
E_{\text{in}}(h) \approx E_{\text{out}}(h) \ \text{ 且 } \ E_{\text{in}}(h) \text{ 很小} \ \Longrightarrow\ E_{\text{out}}(h) \text{ 很小} \ \Longrightarrow\ h \approx f \ \text{（對 } P \text{ 而言）}
$$

「對 $P$ 而言」不能省。課堂上說這不是任意的保證：資料要繼續從同一個 $P$ 產生，$h$ 與 $f$ 才會接近。

### 驗證不等於學習

到這裡好像可以宣布學習可行了。第 16 頁問：可以說這是好的學習（$g \approx f$）嗎？課堂上先提醒，演算法最後交出來的叫 $g$，$h$ 只是 $\mathcal{H}$ 裡的一個候選。講義的回答分兩邊：

| | 條件 | 結論 |
|---|---|---|
| Yes | 這個固定的 $h$ 的 $E_{\text{in}}(h)$ 很小，而且 $\mathcal{A}$ 選它當 $g$ | 「$g = f$」是 PAC |
| No | $\mathcal{A}$ 被迫永遠選這個 $h$ 當 $g$ | $E_{\text{in}}(h)$ 幾乎都不小，於是「$g \ne f$」是 PAC |

右邊那一格是重點。前面的推導從頭到尾只針對一個事先固定的 $h$。要讓保證成立，演算法就得不管資料長什麼樣子都交出同一個 $h$。課堂上的說法是：一個不管遇到什麼題目都回傳同一個 $h$ 的演算法，那個 $h$ 十之八九不好，$E_{\text{in}}$ 很大。這時 Hoeffding 仍然成立，$E_{\text{in}}$ 與 $E_{\text{out}}$ 仍然接近，只是你得到的結論變成：可以很有信心地說 $g$ 跟 $f$ 一點也不像。

講義的結語：真正的學習是 $\mathcal{A}$ 在 $\mathcal{H}$ 裡做選擇（像 PLA），而不是被迫選某一個 $h$。課堂上舉 PLA 當對照：給它不同的資料，它就回傳不同的線。

所以目前做到的事有另一個名字。第 17 頁把流程圖改成 The 'Verification' Flow，跟學習的流程圖比：

| 位置 | 學習的流程 | 驗證的流程 |
|---|---|---|
| 資料 | training examples | verifying examples |
| 候選 | 假說集合 $\mathcal{H}$ | 一個假說 $h$ |
| 演算法 $\mathcal{A}$ | 有，負責挑 | 沒有，直接 $g = h$ |
| 輸出 | 學到的公式 | 一條被驗證過的既有公式 |

講義的說法是：現在可以拿歷史紀錄來驗證「一條」候選公式。課堂上強調，這份資料沒有經過學習、沒有經過選擇的程序。這一點到了講很多個假說的那一節會變成關鍵。

### 數值例子：八個輸入的世界

以下的設定與計算是本文自擬的，不在講義上；用的是講義第 5 頁那張表的輸入與函數。

**設定。** $\mathcal{X} = \{0,1\}^3$，$P$ 是 8 種輸入各 $1/8$ 的均勻分布。真正的目標是表上的 $f_6$。假說 $h$ 事先固定為：前五種輸入的答案跟表上的 $y$ 一樣，101、110、111 的答案是 ○×○（就是課堂上那位同學的 $g$）。

**算 $E_{\text{out}}$。** $f_6$ 在 101、110、111 上是 ×○×，$h$ 三個都答錯，其他五個都答對。$E_{\text{out}}(h) = 3/8 = 0.375$。這個數字在真實世界裡看不到，這裡因為整個世界是我們自己造的才算得出來。

**抽樣。** 從 $P$ 獨立抽 $N = 5$ 個輸入（可以重複），每一個有 $3/8$ 的機率落在 $h$ 答錯的地方。答錯的個數 $k$ 服從二項分布，$E_{\text{in}}(h) = k/5$：

| $k$ | $E_{\text{in}}(h)$ | 機率 | $\lvert E_{\text{in}} - E_{\text{out}}\rvert$ | 超過 $\epsilon = 0.3$？ |
|---|---|---|---|---|
| 0 | 0 | $3125/32768 \approx 0.0954$ | 0.375 | 是 |
| 1 | 0.2 | $\approx 0.2861$ | 0.175 | 否 |
| 2 | 0.4 | $\approx 0.3433$ | 0.025 | 否 |
| 3 | 0.6 | $\approx 0.2060$ | 0.225 | 否 |
| 4 | 0.8 | $\approx 0.0618$ | 0.425 | 是 |
| 5 | 1 | $\approx 0.0074$ | 0.625 | 是 |

**結果。** 取 $\epsilon = 0.3$，壞事的機率是 $0.0954 + 0.0618 + 0.0074 = 0.1646$（精確值 $5393/32768$）。Hoeffding 的上界是 $2\exp(-2 \times 0.09 \times 5) = 2\exp(-0.9) \approx 0.813$。精確值在上界以下。

**這代表什麼。** 第一，$N = 5$ 太小，上界 0.813 幾乎沒有資訊；Hoeffding 要 $N$ 大才有用。第二，講義那份 $\mathcal{D}$ 就屬於 $k = 0$ 這一列：五筆資料全落在 $h$ 答對的地方，$E_{\text{in}} = 0$，看起來完美，實際上 $E_{\text{out}} = 0.375$。對一個事先固定的 $h$，這種誤導人的樣本只有約 9.5% 的機率出現。可是講義表上的 $g$ 並非事先固定，它是看了資料才被調成全對的。這個差別留到「演算法要挑，保證要付多少代價」那一節的數值計算再處理。

### Fun Time：朋友的股票規則

**題目（第 18 頁）：** 朋友告訴你她投資某支股票的祕密規則：「早上跌，下午就會漲；反過來也一樣。」為了驗證，你從過去 10 年的股票資料裡均勻隨機挑了 100 天，發現其中 80 天符合這條規則。你能從這次驗證得到的最好保證是什麼？

1. 接下來 100 天照這條規則操作，一定會變有錢。
2. 如果市場的行為跟過去 10 年類似，接下來 100 天照這條規則操作，很可能會變有錢。
3. 從另外 20 位朋友的規則裡挑出「最好的規則」，接下來 100 天照它操作，很可能會變有錢。
4. 如果過去 10 年都照這條規則操作，一定已經變有錢了。

**答案：2。** 講義對其他三個選項各給一句：選項 1 是 no free lunch；選項 3 是驗證裡沒有「學習」的保證；選項 4 是只驗證了 100 天，這條規則在整整 10 年裡大部分是錯的也有可能。

本文把這題代進這一節的對應走一遍。規則是固定的 $h$（你挑日子之前她就說了）；罐子是過去 10 年的每一天，$P$ 是在這些日子上的均勻分布；100 天是 $N = 100$ 的樣本；80 天符合，所以 $E_{\text{in}}(h) = 0.2$。把這 100 天當成獨立抽出的，取 $\epsilon = 0.15$：

$$
2\exp\big(-2 \times 0.15^2 \times 100\big) = 2\exp(-4.5) \approx 0.022
$$

所以至少有 97.8% 的把握，這條規則在 10 年裡的錯誤率不超過 $0.2 + 0.15 = 0.35$，也就是至少 65% 的日子符合。這是一個「很可能」的保證，而且對象是過去 10 年這個罐子。

- 選項 2 對在兩個地方：用「很可能」而非「一定」；並且加上「市場跟過去 10 年類似」，也就是未來的日子來自同一個 $P$。這正是推論鏈最後那句「對 $P$ 而言」。
- 選項 1 錯在「一定」，而且沒有未來跟過去相似的前提。沒有這個前提，未來的 100 天就是 $\mathcal{D}$ 以外的輸入，什麼都可能發生。
- 選項 4 也錯在「一定」。課堂上的說法是，抽出來的 100 天搞不好跟這 10 年的分布很不一樣；那就是剛才表格裡 $k = 0$ 的那種樣本。
- 選項 3 把驗證當成學習。你驗證的是這一條規則，別的規則沒驗過；就算把 21 條規則都拿同樣的 100 天來驗、再挑最好的，那也已經是在做選擇。課堂上說，從 20 條規則裡選一條出來，就不一定有這麼強的保證。弱多少，「演算法要挑，保證要付多少代價」那一節算得出來。

## 演算法要挑，保證要付多少代價

```youtube
url: https://www.youtube.com/watch?v=MFL6xDn1lXM
title: Feasibility of Learning :: Connection to Real Learning @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–01:17 是很多個罐子，01:17–04:23 是丟銅板，04:23–06:57 定義 BAD，06:57–09:59 是很多假說時的 BAD data，09:59–12:16 是 union bound，12:16–15:00 是學習流程與 M 無限大的問題，之後是 Fun Time 與總結。）

### 很多個罐子

第 19 頁畫了 $M$ 個罐子，一個假說一個：$h_1$ 的罐子橘色比例是 $E_{\text{out}}(h_1)$，抽出來的樣本橘色比例是 $E_{\text{in}}(h_1)$，一路排到 $h_M$。圖上 $h_M$ 那個罐子抽出來的 10 顆全是綠的。頁尾問：真正的學習（例如 PLA）抽到全綠的時候，可以喊 BINGO 嗎？

課堂上把問題講白：10 個假說就是 10 個罐子，其中一個罐子抽出來的彈珠全綠，對應到有一個假說在你看到的資料上全對。要不要選它？

### 丟銅板：有選擇，罕見的事就不罕見

第 20 頁用銅板回答。問：台大 ML 班 150 人，每人把一枚銅板丟 5 次，有一位同學 5 次都是正面，她那枚銅板「$g$」真的特別神奇嗎？

答：不。就算每一枚都是公正的銅板，150 枚裡有一枚 5 次全正面的機率是

$$
1 - \Big(\frac{31}{32}\Big)^{150} > 99\%
$$

推導：一枚公正銅板丟 5 次全正面的機率是 $(1/2)^5 = 1/32$，所以「沒有」全正面的機率是 $31/32$。150 枚銅板互相獨立，150 枚都沒有全正面的機率是 $(31/32)^{150} \approx 0.0085$。用 1 去減，至少有一枚全正面的機率約 0.9915。

課堂上補了一個自己在家就能做的版本：一個人坐在電腦前，可以自己丟 150 輪，通常丟個 20、30、40 輪就會出現全正面。本文驗算：20 輪內出現的機率是 $1 - (31/32)^{20} \approx 0.47$，30 輪 0.61，40 輪 0.72；第 22 輪起超過一半。

這跟學習的對應：銅板是假說，5 次丟擲是 5 筆資料，正面是答對，公正銅板的 $E_{\text{out}} = 1/2$。全正面就是 $E_{\text{in}} = 0$。挑出那枚全正面的銅板，等於挑 $E_{\text{in}}$ 最小的假說，而它的 $E_{\text{out}}$ 還是 $1/2$。課堂上的結論是：有選擇的時候就有了偏見，這些銅板明明都一樣。單看一枚，全正面的機率是 $1/32$；有 150 個選擇，機率超過 99%。講義的說法：BAD sample 指 $E_{\text{in}}$ 與 $E_{\text{out}}$ 差很遠，牽涉到「選擇」時會更糟。

### BAD sample 與 BAD data

第 21 頁把「壞」定義清楚：

- **BAD sample**：例如 $E_{\text{out}} = 1/2$，卻抽到全正面（$E_{\text{in}} = 0$）。
- **BAD data for one $h$**：$E_{\text{out}}(h)$ 與 $E_{\text{in}}(h)$ 差很遠。講義舉的典型情形是 $E_{\text{out}}$ 很大（離 $f$ 很遠），$E_{\text{in}}$ 卻很小（在多數資料上答對）。

課堂上補上「遠」的標準：差得比 $\epsilon$ 多。

接著講義畫了一列表格。把所有可能抽到的資料集排成一排，$\mathcal{D}_1, \mathcal{D}_2, \dots, \mathcal{D}_{1126}, \dots, \mathcal{D}_{5678}, \dots$，每一份都是 $N$ 筆資料。對一個固定的 $h$，每一格要嘛是 BAD、要嘛不是。講義的圖上，$h$ 這一列在 $\mathcal{D}_1$ 與 $\mathcal{D}_{5678}$ 是 BAD。BAD 的機率是把所有可能的資料集加起來：

$$
\mathbb{P}_{\mathcal{D}}\big[\text{BAD } \mathcal{D}\big] = \sum_{\text{all possible } \mathcal{D}} \mathbb{P}(\mathcal{D}) \cdot \llbracket \text{BAD } \mathcal{D} \rrbracket
$$

Hoeffding 說這個總和很小。課堂上再三強調機率是算在哪裡：算在「抽一把」這個動作上。Hoeffding 保證的是這一列裡 BAD 的格子加起來機率很小，至於你手上這一份是不是 BAD，它沒說。

### 很多假說時，怎樣算壞

第 22 頁把表格擴成很多列，一列一個假說。講義上的表：

| | $\mathcal{D}_1$ | $\mathcal{D}_2$ | … | $\mathcal{D}_{1126}$ | … | $\mathcal{D}_{5678}$ | Hoeffding |
|---|---|---|---|---|---|---|---|
| $h_1$ | BAD | | | | | BAD | $\mathbb{P}_{\mathcal{D}}[\text{BAD } \mathcal{D} \text{ for } h_1] \le \dots$ |
| $h_2$ | | BAD | | | | | $\mathbb{P}_{\mathcal{D}}[\text{BAD } \mathcal{D} \text{ for } h_2] \le \dots$ |
| $h_3$ | BAD | BAD | | | | BAD | $\mathbb{P}_{\mathcal{D}}[\text{BAD } \mathcal{D} \text{ for } h_3] \le \dots$ |
| … | | | | | | | |
| $h_M$ | BAD | | | | | BAD | $\mathbb{P}_{\mathcal{D}}[\text{BAD } \mathcal{D} \text{ for } h_M] \le \dots$ |
| all | BAD | BAD | | | | BAD | ? |

每一列各自有 Hoeffding 管著，BAD 的格子機率加起來很小。新的是最下面那一列。講義的定義用了兩個等價的說法：

$$
\text{BAD data for many } h \iff \mathcal{A} \text{ 沒有選擇的自由} \iff \text{存在某個 } h \text{ 使 } E_{\text{out}}(h) \text{ 與 } E_{\text{in}}(h) \text{ 差很遠}
$$

也就是說，一欄裡只要有一格 BAD，這份資料對整個 $\mathcal{H}$ 就算 BAD。課堂上的比喻是踩地雷：好的資料讓演算法怎麼選都對，照自己的意思選就好；不好的資料裡埋了雷，演算法看到某個假說的 $E_{\text{in}}$ 很低就選了它，結果它的 $E_{\text{out}}$ 很大。課堂上照著表唸：拿到 $\mathcal{D}_1$，可能踩到的雷是 $h_1$、$h_3$、$h_M$；拿到 $\mathcal{D}_2$，雷是 $h_2$ 與 $h_3$；只有像 $\mathcal{D}_{1126}$ 這種整欄都沒有雷的才是好資料。

右下角的問號就是這一節要算的：$M$ 個假說時，$\mathbb{P}_{\mathcal{D}}[\text{BAD } \mathcal{D}]$ 的上界是多少。

### union bound：四行推導

第 23 頁的推導只有四行，一行一行看。

**第一行，把定義寫成「或」。** BAD 的定義是存在某個假說出事，所以

$$
\mathbb{P}_{\mathcal{D}}\big[\text{BAD } \mathcal{D}\big] = \mathbb{P}_{\mathcal{D}}\big[\text{BAD } \mathcal{D} \text{ for } h_1 \ \textbf{or} \ \text{BAD } \mathcal{D} \text{ for } h_2 \ \textbf{or} \ \dots \ \textbf{or} \ \text{BAD } \mathcal{D} \text{ for } h_M\big]
$$

**第二行，把「或」拆成加法。** 這一步叫 union bound：

$$
\le\ \mathbb{P}_{\mathcal{D}}\big[\text{BAD } \mathcal{D} \text{ for } h_1\big] + \mathbb{P}_{\mathcal{D}}\big[\text{BAD } \mathcal{D} \text{ for } h_2\big] + \dots + \mathbb{P}_{\mathcal{D}}\big[\text{BAD } \mathcal{D} \text{ for } h_M\big]
$$

為什麼是「小於等於」：課堂上用集合的面積解釋，幾個集合聯集的面積，不會超過各自面積的總和。本文補上兩個事件的版本：$\mathbb{P}[A \text{ or } B] = \mathbb{P}[A] + \mathbb{P}[B] - \mathbb{P}[A \text{ and } B]$，最後一項不會是負的，丟掉它就得到 $\mathbb{P}[A \text{ or } B] \le \mathbb{P}[A] + \mathbb{P}[B]$。重疊的部分被算了兩次，所以直接相加只會多、不會少。這一步不需要事件互相獨立。

**第三行，每一項各用一次 Hoeffding。** 每個 $h_m$ 都是抽資料之前就擺在 $\mathcal{H}$ 裡的固定假說，所以「一個假說的保證」對它成立：

$$
\le\ 2\exp\big(-2\epsilon^2 N\big) + 2\exp\big(-2\epsilon^2 N\big) + \dots + 2\exp\big(-2\epsilon^2 N\big)
$$

**第四行，$M$ 個一樣的數相加。**

$$
=\ 2M\exp\big(-2\epsilon^2 N\big)
$$

講義稱它是 Hoeffding 的 finite-bin 版本，列了三點：

- 對所有 $M$、$N$、$\epsilon$ 都成立。
- 不需要知道任何 $E_{\text{out}}(h_m)$；$f$ 與 $P$ 可以保持未知。
- 不管 $\mathcal{A}$ 是什麼，「$E_{\text{in}}(g) = E_{\text{out}}(g)$」都是 PAC。

第三點是整堂課的落點，講義只寫了結論，本文把理由補上。演算法交出來的 $g$ 是 $h_1, \dots, h_M$ 裡的某一個，是哪一個要看資料。如果這份 $\mathcal{D}$ 不是 BAD，那麼每一個 $h_m$ 的 $E_{\text{in}}$ 與 $E_{\text{out}}$ 都在 $\epsilon$ 之內，不論演算法挑中誰，$g$ 也在 $\epsilon$ 之內。反過來說，「$g$ 的 $E_{\text{in}}$ 與 $E_{\text{out}}$ 差超過 $\epsilon$」只可能發生在 BAD 的 $\mathcal{D}$ 上：

$$
\mathbb{P}_{\mathcal{D}}\big[\,\lvert E_{\text{in}}(g) - E_{\text{out}}(g) \rvert > \epsilon\,\big] \ \le\ \mathbb{P}_{\mathcal{D}}\big[\text{BAD } \mathcal{D}\big] \ \le\ 2M\exp\big(-2\epsilon^2 N\big)
$$

「驗證不等於學習」卡住的地方是 $g$ 看過資料、不是固定的。這裡的解法是不去追蹤演算法會挑誰，直接要求所有候選同時安全。課堂上的說法是每一個 $h$ 都安全，演算法怎麼選都可以。代價是右邊多了一個 $M$；課堂上舉例，假說集合裡有 100 個假說，壞事發生的機率上界就是原來的 100 倍。

既然怎麼選都安全，講義說最合理的 $\mathcal{A}$（像 PLA 或 pocket）就是挑 $E_{\text{in}}(h_m)$ 最低的那個當 $g$。課堂上的理由：每個假說的 $E_{\text{in}}$ 與 $E_{\text{out}}$ 都接近，$E_{\text{in}}$ 最小的那個，$E_{\text{out}}$ 也會落在比較小的那一邊。

本文補充：丟銅板的例子裡 150 枚銅板互相獨立，所以算得出精確的 $1 - (31/32)^{150}$。學習問題裡 $M$ 個假說看的是同一份資料，各自的 BAD 事件彼此相關，精確值不好算；union bound 不需要獨立，才用它。它也可能很寬鬆：對銅板用 union bound 得到 $150 \times 1/32 \approx 4.69$，比 1 還大。

### 把數字代進去

以下是本文的計算，接續前面兩個自擬的情境。

**股票規則，21 條挑一條。** 你把自己朋友的規則與另外 20 位朋友的規則，都拿同樣的 100 天來驗，挑符合天數最多的那一條。$M = 21$、$N = 100$：

| $\epsilon$ | 一條規則：$2\exp(-2\epsilon^2 N)$ | 21 條挑一條：$2 \times 21 \times \exp(-2\epsilon^2 N)$ |
|---|---|---|
| 0.10 | 0.271 | 5.68 |
| 0.15 | 0.022 | 0.467 |
| 0.20 | 0.00067 | 0.0141 |

只驗一條時，$\epsilon = 0.15$ 就有 97.8% 的把握。挑過之後，同樣的 $\epsilon$ 只剩 53.3% 的把握；要回到差不多的信心水準，$\epsilon$ 得放寬到 0.2。同樣是「100 天裡 80 天符合」，一條規則時可以說錯誤率很可能不超過 0.35，21 條挑出來的只能說很可能不超過 0.4。保證還在，只是變弱了。

**需要多少資料。** 令 $2M\exp(-2\epsilon^2 N) \le \delta$，跟前面一樣移項：

$$
N \ \ge\ \frac{1}{2\epsilon^2}\ln\frac{2M}{\delta}
$$

$M$ 在對數裡面。取 $\epsilon = 0.1$、$\delta = 0.05$：$M = 1$ 要 185 筆，$M = 100$ 要 415 筆，$M = 10^6$ 要 876 筆。假說多一萬倍，資料只要多一倍左右。這是有限個假說時的好消息。

**回到八個輸入的世界。** 講義第 4 頁把全部 256 個函數都放進 $\mathcal{H}$，$N = 5$。取 $\epsilon = 0.3$，上界是 $2 \times 256 \times \exp(-0.9) \approx 208$，遠大於 1，沒有任何保證。這裡還可以直接算出真相：不管抽到哪 5 筆，最多涵蓋 5 種輸入，至少有 3 種沒被抽到。256 個函數裡一定有一個在抽到的輸入上跟 $f$ 全同、在沒抽到的輸入上全部相反，它的 $E_{\text{in}} = 0$、$E_{\text{out}} \ge 3/8 = 0.375 > 0.3$。所以每一份可能的 $\mathcal{D}$ 都是 BAD，$\mathbb{P}_{\mathcal{D}}[\text{BAD } \mathcal{D}] = 1$。

這就把 No Free Lunch 那一節與後面講機率的三節接起來了。No Free Lunch 的例子用機率的語言重講一次，就是 $M$ 太大、$N$ 太小，union bound 的上界超過 1。反過來，如果事先把候選限制成 2 個假說，並且有 $N = 50$ 筆獨立抽出的資料，同樣的 $\epsilon = 0.3$ 給出 $2 \times 2 \times \exp(-9) \approx 0.0005$。學習可行的條件，是候選不能太多、資料要夠多，兩者由 $2M\exp(-2\epsilon^2 N)$ 這個式子綁在一起。

### 可行的條件，以及還沒解決的事

第 24 頁把結論寫成 The 'Statistical' Learning Flow：

- 如果 $\lvert\mathcal{H}\rvert = M$ 有限、$N$ 夠大，那麼不管 $\mathcal{A}$ 挑出哪個 $g$，$E_{\text{out}}(g) \approx E_{\text{in}}(g)$。
- 如果 $\mathcal{A}$ 找得到一個 $E_{\text{in}}(g) \approx 0$ 的 $g$，就有 PAC 的保證 $E_{\text{out}}(g) \approx 0$，學習是可能的。

流程圖跟基石第 1 堂比，課堂上說只多了兩條線，都從未知的 $P$ 出發：一條產生訓練資料的 $\mathbf{x}_1, \dots, \mathbf{x}_N$，一條產生用來測試 $g \approx f$ 的 $\mathbf{x}$。

圖的右下角留了一個問題：$M = \infty$ 呢（像感知器）？平面上的線有無限多條，$2M\exp(-2\epsilon^2 N)$ 直接變成無限大。課堂上替學生把話講了：講了這麼多，$\mathcal{H}$ 還是得有限，這不是在打嘴砲嗎？回答是：確實還沒完全解決，但有限的情形是很好的出發點；無限的情形有點困難，大約要花接下來兩到三次上課的時間。

第 26 頁的總結把四節各收成一句，順序就是這堂課的論證：

1. Learning is Impossible?：absolutely no free lunch outside $\mathcal{D}$。
2. Probability to the Rescue：probably approximately correct outside $\mathcal{D}$。
3. Connection to Learning：verification possible if $E_{\text{in}}(h)$ small for fixed $h$。
4. Connection to Real Learning：learning possible if $\lvert\mathcal{H}\rvert$ finite and $E_{\text{in}}(g)$ small。

### Fun Time：四個假說的 BAD data

**題目（第 25 頁）：** 考慮 4 個假說：

$$
h_1(\mathbf{x}) = \text{sign}(x_1), \quad h_2(\mathbf{x}) = \text{sign}(x_2), \quad h_3(\mathbf{x}) = \text{sign}(-x_1), \quad h_4(\mathbf{x}) = \text{sign}(-x_2)
$$

對任意的 $N$ 與 $\epsilon$，下面哪一個敘述「不」成立？

1. $h_1$ 的 BAD data 和 $h_2$ 的 BAD data 完全相同
2. $h_1$ 的 BAD data 和 $h_3$ 的 BAD data 完全相同
3. $\mathbb{P}_{\mathcal{D}}[\text{BAD for some } h_k] \le 8\exp(-2\epsilon^2 N)$
4. $\mathbb{P}_{\mathcal{D}}[\text{BAD for some } h_k] \le 4\exp(-2\epsilon^2 N)$

**答案：1。** 講義的解答只有兩句：重點是看出選項 2 成立，回頭看 union bound 就知道選項 4 也成立；類似的想法之後會用來處理 $M = \infty$。

**選項 2 為什麼成立。** $h_3 = -h_1$，兩者在每個點上的答案相反。$h_1$ 答對的點 $h_3$ 答錯，反之亦然，所以

$$
E_{\text{in}}(h_3) = 1 - E_{\text{in}}(h_1), \qquad E_{\text{out}}(h_3) = 1 - E_{\text{out}}(h_1)
$$

相減之後 $E_{\text{in}}(h_3) - E_{\text{out}}(h_3) = -\big(E_{\text{in}}(h_1) - E_{\text{out}}(h_1)\big)$，絕對值一樣。一份資料對 $h_1$ 是 BAD，對 $h_3$ 就也是 BAD。這是課堂上的解釋：把我乘上負號，$E_{\text{in}}$ 與 $E_{\text{out}}$ 都跟我反過來，所以隔得一樣遠。（$x_1$ 剛好是 0 的點兩者都是 $\text{sign}(0)$，這裡不討論。）

**選項 3 成立。** 它就是 $M = 4$ 代進 $2M\exp(-2\epsilon^2 N)$。

**選項 4 也成立。** 同理 $h_2$ 與 $h_4$ 的 BAD data 相同。四個事件其實只有兩個不同的事件，推導的第一行變成「BAD for $h_1$ or BAD for $h_2$」，union bound 只需要加兩項：$2 \times 2\exp(-2\epsilon^2 N) = 4\exp(-2\epsilon^2 N)$。

**選項 1 為什麼不成立。** $h_1$ 看第一個座標，$h_2$ 看第二個，兩者答錯的點不同，沒有理由在同樣的資料上出事。本文自擬一個可以手算的反例。$P$ 是四個點 $(+1,+1)$、$(+1,-1)$、$(-1,+1)$、$(-1,-1)$ 上的均勻分布，$f$ 在前三個點是 $+1$、在 $(-1,-1)$ 是 $-1$。那麼 $h_1$ 只在 $(-1,+1)$ 答錯，$h_2$ 只在 $(+1,-1)$ 答錯，$E_{\text{out}}$ 都是 $1/4$。取 $N = 2$、$\epsilon = 0.3$，依序抽兩個點共 16 種等機率的資料集。$E_{\text{in}}$ 只可能是 0、$1/2$、1。對 $h_1$ 與 $h_2$，跟 $E_{\text{out}} = 1/4$ 差超過 0.3 的只有 $E_{\text{in}} = 1$，也就是兩筆都抽到它答錯的那個點。$h_3$ 與 $h_4$ 的 $E_{\text{out}}$ 是 $3/4$，差超過 0.3 的只有 $E_{\text{in}} = 0$，也就是兩筆都抽到它唯一答對的那個點：$h_3$ 唯一答對的是 $(-1,+1)$，$h_4$ 是 $(+1,-1)$。

| 假說 | BAD 的資料集 | 機率 |
|---|---|---|
| $h_1$ | 兩筆都是 $(-1,+1)$ | $1/16$ |
| $h_2$ | 兩筆都是 $(+1,-1)$ | $1/16$ |
| $h_3$ | 兩筆都是 $(-1,+1)$ | $1/16$ |
| $h_4$ | 兩筆都是 $(+1,-1)$ | $1/16$ |

$h_1$ 與 $h_2$ 的 BAD data 是兩份不同的資料集，選項 1 不成立；$h_1$ 與 $h_3$ 是同一份，選項 2 成立。至少一個假說出事的機率是 $2/16$，四列直接相加是 $4/16$，多出來的就是重疊被重複計算的部分。這個例子的 $N$ 太小，Hoeffding 的數字本身超過 1，它只用來看集合之間的關係。

課堂上說這題稍微難一點，出它是為了讓大家想到 BAD 會重疊，下一堂要用這個性質討論無限多條線的情形。

## 自我檢查

**1. 一個事先固定的假說，在 $N = 500$ 筆獨立抽出的資料上量到 $E_{\text{in}} = 0.08$。取 $\epsilon = 0.05$，Hoeffding 的上界是多少？如果這個假說是從 20 個候選裡挑 $E_{\text{in}}$ 最低的，上界變成多少？要讓 20 個候選、$\epsilon = 0.05$ 時壞事機率不超過 0.05，需要幾筆資料？**

答案：一個假說時 $2\exp(-2 \times 0.0025 \times 500) = 2\exp(-2.5) \approx 0.164$，有 83.6% 的把握 $E_{\text{out}}$ 在 0.03 到 0.13 之間。20 個候選時乘上 20，得 3.28，超過 1，沒有保證。$N \ge \ln(2 \times 20 / 0.05) / (2 \times 0.0025) = \ln 800 / 0.005 \approx 1336.9$，要 1,337 筆。

**2. 用自己的話說明：為什麼 Hoeffding 不等式不能直接用在 PLA 找出來的 $g$ 上？**

判準：答案要提到三件事。第一，把彈珠漆成橘色或綠色需要先有一個固定的 $h$，罐子是那個 $h$ 專屬的。第二，$g$ 是看了資料才決定的，換一份資料就換一個 $g$，所以它不是事先固定的假說。第三，補救的方式是要求 $\mathcal{H}$ 裡每個候選同時不出事，用 union bound 付出 $M$ 倍的代價。只回答「因為 $g$ 不固定」而沒說出為什麼固定很重要，不算完整。

**3. 一個 60 人的班，每人把公正銅板丟 6 次。至少有一人 6 次全是正面的機率是多少？用 union bound 得到的上界是多少？**

答案：一人全正面的機率是 $1/64$。至少一人全正面的機率是 $1 - (63/64)^{60} \approx 0.611$。union bound 給 $60 \times 1/64 = 0.9375$。上界確實比精確值大，差距來自「兩個人以上同時全正面」被重複計算。

**4. $\mathcal{X} = \{0,1\}^4$，資料 $\mathcal{D}$ 給了其中 10 種不同輸入的答案，沒有雜訊。跟 $\mathcal{D}$ 完全相容的目標函數有幾個？某個在 $\mathcal{D}$ 上全對的 $g$，在 $\mathcal{D}$ 以外的輸入上，平均（對所有相容的目標函數取平均）答對幾個？**

答案：$\mathcal{X}$ 有 $2^4 = 16$ 種輸入，$\mathcal{D}$ 以外剩 6 種，每種有 2 種可能的答案，相容的目標函數有 $2^6 = 64$ 個。對每一個沒看過的輸入，64 個函數裡剛好一半說 ○、一半說 ×，$g$ 不管猜什麼都只對上一半，所以平均答對 $6 \times 1/2 = 3$ 個，跟亂猜一樣。

**5. 假說集合有 100 個假說，剛好是 50 組「$h$ 與 $-h$」。$\mathbb{P}_{\mathcal{D}}[\text{BAD } \mathcal{D}]$ 的上界可以寫得比 $200\exp(-2\epsilon^2 N)$ 更小嗎？**

答案：可以。$h$ 與 $-h$ 的 BAD data 完全相同，100 個事件裡只有 50 個不同的事件，union bound 加 50 項就夠，上界是 $2 \times 50 \times \exp(-2\epsilon^2 N) = 100\exp(-2\epsilon^2 N)$。判準：要說出「BAD 事件重疊時，直接相加會重複計算」。

## 練習與對應閱讀

**動手驗算。** 這堂的數字都可以用 Python 標準函式庫重算，不需要安裝套件。下面這段先算精確值，再用模擬對照：

```python
import random
from math import comb, exp

# Fun Time：mu = 0.4，抽 10 顆，nu <= 0.1
exact = sum(comb(10, k) * 0.4**k * 0.6**(10 - k) for k in (0, 1))
bound = 2 * exp(-2 * 0.3**2 * 10)
print(f"exact {exact:.4f}  Hoeffding bound {bound:.4f}")

# 丟銅板：150 人各丟 5 次，至少一人全正面
print(f"exact {1 - (31 / 32) ** 150:.4f}")
random.seed(0)
trials = 10_000
hits = sum(
    any(all(random.random() < 0.5 for _ in range(5)) for _ in range(150))
    for _ in range(trials)
)
print(f"simulated {hits / trials:.4f}")
```

前兩行輸出應該是 `exact 0.0464  Hoeffding bound 0.3306` 與 `exact 0.9915`，模擬值會落在 0.99 附近。接著可以把彈珠那一段的 $N$ 改成 100、1,000，看精確值與上界的差距怎麼變。

**兩個學期的對應。** [Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)把這堂列在 W3 的課前必看清單，教科書章節標的是 [Learning from Data](http://amlbook.com)（LFD）1.3。Fall 2026 與 Fall 2024 的課程頁都在這堂旁邊列了延伸閱讀：Wolpert 的 [The Lack of A Priori Distinctions Between Learning Algorithms](https://direct.mit.edu/neco/article-abstract/8/7/1341/6016/The-Lack-of-A-Priori-Distinctions-Between-Learning)（Neural Computation, 1996），No Free Lunch 的原始論文。以上於 2026-09-30 查核。

**Fall 2026 extended slides（[04e](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/04e_handout.pdf)）的補充。** MOOC 講義沒有的有三處：

- 用數列 1, 4, 1, 5 再示範一次 No Free Lunch：同樣的前四項，可以用三條不同的遞迴式接出三種不同的下一項，投影片的說法是 any number can be the next。
- 把 Wolpert 1996 的 No Free Lunch 定理粗略寫成一句：對學習問題沒有任何假設時，所有學習演算法的表現都一樣。
- 最後一頁把 $M$ 個假說畫成共用同一組 $\mathbf{x}_1, \dots, \mathbf{x}_N$ 的 $M$ 個罐子，強調這是 dependent sampling：各假說的 BAD 事件互相相關，不像丟銅板那樣各自獨立，所以很難直接分析，union bound 是保守的做法。

**作業。** 兩份都公開，沒有官方解答，批改只限修課生。

[Fall 2026 hw1](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/hw1.pdf) 的「Feasibility of Learning」段（10/21 截止）：

- **Q6**：off-training-set error。6 個點的 universe 裡任選 3 個當 $\mathcal{D}$，用感知器做到 $E_{\text{in}} = 0$，問 $\mathcal{D}$ 外錯誤率的最小與最大值。這是 No Free Lunch 那張表的直接演練。
- **Q7**：用 Monte Carlo 丟飛鏢估計 $\pi$，要丟幾支才能讓誤差在 $10^{-2}$ 內的機率超過 0.999。做法就是把 Hoeffding 反過來解 $N$。
- **Q8–9**：在 $[-1, +1]^2$ 上算兩個假說的 $E_{\text{out}}$，再算抽 4 個點時兩者 $E_{\text{in}}$ 相等的機率。題目註明這是分不出哪個假說比較差的 BAD data。
- **Q10**：用骰子代替彈珠做 multiple-bin sampling。每個數字是一個假說、每顆骰子是一個樣本，問抽 5 顆時「某個數字全是綠色」的機率。

[Fall 2024 HW2](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw2/hw2_red.pdf) 涵蓋第 4 到第 7 堂，其中練這堂的有：

- **Q2**：16 袋黑白各半的牌，各抽 5 張，至少一手全白的機率。這是獨立版的丟銅板。
- **Q5**：批判 ChatGPT 對「已知前 $N - 1$ 項來自某個 $N$ 次多項式，能不能預測下一項」的回答，練 No Free Lunch 的論證。
- **Q6–7**：四種彩券的多罐子遊戲，題目提示把每個數字看成假說、抽到的彩券看成資料，並說明 Q6 要考慮抽樣相依。
- **Q8**：$M$ 台吃角子老虎機，從單邊 Hoeffding 出發，證明所有機器、所有時間步的上信賴界能以至少 $1 - \delta$ 的機率同時成立。題目提示這是 multi-armed bandit 的 upper-confidence bound 演算法的核心技巧，用到的正是這堂的 union bound。

沒有解答時，機率題最直接的自我驗收是模擬：先模擬出數值，再回頭檢查推導。整份作業的導讀在[基石作業導讀](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide)。

**延伸閱讀。** [Caltech Learning from Data](https://work.caltech.edu/telecourse) 是同一本教科書的英文課，Lecture 2: Is Learning Feasible? 對應這堂。[Stanford CS229 導讀](/posts/ai/2026-08-21-stanford-cs229-machine-learning)有學習理論的另一種講法。

**下一堂。** [基石第 5 堂：訓練與測試](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function)從最後一題 Fun Time 的觀察出發：很多假說的 BAD data 是重疊的，union bound 把它們重複計算了。把重疊算進來，無限大的 $M$ 就有機會換成一個有限的數。

## 課程影片來源

原始影片：[Learning is Impossible?](https://www.youtube.com/watch?v=tOgbh5_747w)、[Probability to the Rescue](https://www.youtube.com/watch?v=MgAihqFPkZc)、[Connection to Learning](https://www.youtube.com/watch?v=iXbbfjJNfwU)、[Connection to Real Learning](https://www.youtube.com/watch?v=MFL6xDn1lXM)

- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

查核日期：2026-10-13。影片 ID、標題與長度於當天從官方播放清單取得；YouTube 上沒有字幕軌，本文的課堂說法來自自行轉錄的逐字稿。

## 更新紀錄

- 2026-10-13：全系列改為一堂一篇。這篇原本就只寫第 4 堂，這次依講義與影片逐字稿重寫，補上四節的推導、四題 Fun Time 的解釋與數值例子。
- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入影片與官方播放清單的講次相符。

## 參考資料

- [基石第 4 堂講義 04_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/04_handout.pdf)：本文的主要底本，四節的內容、表格、四題 Fun Time 與所有公式都出自這份講義。
- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)：四支影片的 ID 與標題；文中「課堂上」的說法轉述自這四支影片的機器轉錄逐字稿。
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/)：官方講義與錄影入口。
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)：W3 課前必看清單、LFD 章節與延伸閱讀。
- [Fall 2026 extended slides 04e_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/04e_handout.pdf)：數列 1, 4, 1, 5 的例子、No Free Lunch 定理的一句話版本、dependent sampling 的說明。
- [Fall 2026 Homework 1（hw1.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/hw1.pdf)：Q6–10 的題目內容。
- [Fall 2024 Homework 2（hw2_red.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw2/hw2_red.pdf)：Q2、Q5–8 的題目內容。
- [Wolpert (1996), The Lack of A Priori Distinctions Between Learning Algorithms](https://direct.mit.edu/neco/article-abstract/8/7/1341/6016/The-Lack-of-A-Priori-Distinctions-Between-Learning)：課程頁列出的 No Free Lunch 延伸閱讀。
- [Learning from Data 教科書網站](http://amlbook.com)：LFD 1.3 的出處。
- [Caltech Learning from Data telecourse](https://work.caltech.edu/telecourse)：延伸閱讀，Lecture 2: Is Learning Feasible? 對應這堂。
- [Stanford CS229 導讀](/posts/ai/2026-08-21-stanford-cs229-machine-learning)：延伸閱讀，站內文章。
- [台大林軒田 機器學習基石與技法 導讀：課程總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)：整門課的位置與閱讀路線。
