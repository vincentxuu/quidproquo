---
title: "三個學習原則：Occam's Razor、抽樣偏差與資料窺探｜台大林軒田 機器學習基石 第 16 堂"
date: 2026-10-13
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, learning-theory, validation]
lang: zh-TW
math: true
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 16
tldr: "基石最後一堂不教新演算法，講三個讓前十五堂的保證失效的情況。簡單的模型很難碰巧把亂標的資料分開：10 個點配隨機標籤，decision stump 分得開的機率只有 20/1024，所以分得開才有意義。訓練與測試不是同一個分布時 VC 保證不成立；資料只要影響過學習流程的任何一步，就不能再拿來評估結果。最後用 Power of Three 把整門課收成五組三。"
description: "台大林軒田機器學習基石第 16 堂 Three Learning Principles 導讀：Occam's razor 與成長函數的關係、1948 年美國大選與 Netflix 競賽的抽樣偏差、看圖選轉換、縮放與論文接力三種資料窺探，以及 Power of Three 總結，附四題 Fun Time 的推理與用 Python 驗算過的數值例子。"
draft: false
glossary:
  - term: "Occam's razor"
    aliases: ["奧坎剃刀", "Occam 剃刀"]
    definition: "能把資料解釋好的模型裡，最簡單的那個最可信。簡單指假說的參數少，或假說集合裡的假說少。"
    context: "林軒田基石第 16 堂的第一個學習原則，用成長函數解釋為什麼簡單的模型擬合成功才有意義。"
  - term: "sampling bias"
    aliases: ["抽樣偏差"]
    definition: "訓練資料的分布與測試情境的分布不同時，VC 保證不再成立，學到的結果也會帶著同樣的偏差。"
    context: "林軒田基石第 16 堂的第二個學習原則，經驗法則是讓訓練與驗證盡量貼近測試情境。"
  - term: "data snooping"
    aliases: ["資料窺探", "偷看資料"]
    definition: "只要某份資料影響過學習流程中的任何一步（包括看圖挑特徵、用它做縮放、讀過別人在同一份資料上的結果），它評估最終結果的能力就被污染了。"
    context: "林軒田基石第 16 堂的第三個學習原則。"
---

> 🌏 [English version](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-16-three-learning-principles-en)

**影片狀態：已附影片。** 這篇依官方 MOOC 講義 [16_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/16_handout.pdf) 與這堂四支官方影片的機器轉錄逐字稿寫成，公式以講義為準；逐字稿未經人工校對。每一節開頭附該節的官方影片與大致的時間區段。文中的頁碼指投影片右下角的編號（0/25 到 25/25），寫「課堂上」的地方是轉述影片裡的說法。

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)裡的基石第 16 堂，也是基石的最後一堂。講義第 1 頁的 Roadmap 把它放在四大問題的第四個 How Can Machines Learn Better? 底下。上一堂[基石第 15 堂：驗證](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles)在同一頁上只有一行：（交叉地）保留驗證資料來模擬測試的程序，用它做模型選擇。這堂沒有新的演算法。課堂上說要送三個做機器學習時的錦囊妙計，再把十六堂課整理一遍。

三個原則各自對應到前面某個保證的漏洞：

1. **Occam's razor**：模型太複雜時，把資料分開這件事本身沒有意義。
2. **Sampling bias**：訓練資料和測試情境不是同一個分布時，VC 保證不成立。
3. **Data snooping**：資料影響過你的決定之後，就不能再拿它來評估結果。

先備是成長函數（[基石第 5 堂](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function)）、Hoeffding 不等式（[基石第 4 堂](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning)）、VC bound（[基石第 6 堂](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-06-theory-of-generalization)與[第 7 堂](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error)）、特徵轉換（[基石第 12 堂](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-12-nonlinear-transformation)）與上一堂的驗證。這堂公式很少，但每個原則都能算出數字。讀完之後，你應該能算出「一個模型碰巧把亂標的資料分開」的機率並解釋它和 Occam's razor 的關係，能指出一個流程裡訓練、驗證與測試的分布哪裡對不上，也能逐步檢查自己的流程在哪幾步偷看了資料、該用哪一個 bound 估計代價。

## 能解釋資料的模型裡，為什麼要挑最簡單的

```youtube
url: https://www.youtube.com/watch?v=Oj6j98ceUz8
title: Three Learning Principles :: Occam's Razor @ Machine Learning Foundations (機器學習基石)
```

（影片 00:18–01:00 回顧上一堂，01:00–03:17 是剃刀的由來與兩張圖，03:17–06:00 講什麼叫簡單，06:00–08:24 講為什麼簡單比較好，08:24–09:25 是該採取的行動，之後是 Fun Time。）

### 剃刀這句話從哪來

講義第 2 頁放了兩句話。第一句是 An explanation of the data should be made as simple as possible, but no simpler，署名 Albert Einstein（1879–1955），名字後面打了一個問號。課堂上解釋那個問號：這句話通常被認為是愛因斯坦說的，但目前沒有歷史證據顯示他真的說過。句子的意思是，對資料的解釋愈簡單愈好；後半句 but no simpler 則是提醒不要簡單過頭，太簡單就沒辦法把資料解釋好了。

第二句是 entia non sunt multiplicanda praeter necessitatem，講義附的英譯是 entities must not be multiplied beyond necessity，出自 William of Occam（1287–1347）。課堂上說這句話的哲學可以追溯到十四世紀，意思是不要對一件事做多餘的處理。講義把這個想法稱為 Occam's razor，用來 trimming down unnecessary explanation，旁邊配了一張老式刮鬍刀片的圖。課堂上的講法是：對資料過分的解釋，就拿剃刀像刮鬍子一樣把它剃掉。

### 兩張圖選哪一張

第 3 頁把剃刀改寫成機器學習的版本：

> The simplest model that fits the data is also the most plausible.

能把資料擬合好的模型裡，最簡單的也最可信。下面並排兩張圖，資料是同一份：中間一群藍色圓圈，四周是紅色叉叉。左圖用一個大橢圓把圓圈全部圈起來；右圖用一串小圓把圓圈一個一個包住，邊界彎彎曲曲。兩張圖都把資料完全分對。講義問 which one do you prefer?，課堂上說大部分人會選左邊，因為同樣的資料沒有理由畫一堆複雜的曲線來解釋，一個大圓就圈得起來。

這是直覺。講義接著把它拆成兩個要回答的問題：模型「簡單」是什麼意思？又怎麼知道簡單的比較好？

### 什麼叫簡單：假說的簡單與模型的簡單

第 4 頁分兩個層次。

| | 簡單的假說 $h$ | 簡單的模型 $\mathcal{H}$ |
|---|---|---|
| 複雜度記號 | $\Omega(h)$ 小 | $\Omega(\mathcal{H})$ 小 |
| 意思 | 「看起來」簡單 | 裡面的假說不多 |
| 具體的量 | 用少數幾個參數就能指定 | 包含的假說數量少 |

課堂上替兩邊各舉了例子。假說這一邊：左圖那個大圓只要圓心與半徑就說得清楚長什麼樣子，不需要很多參數。模型這一邊：講義寫的是 small number of hypotheses，課堂上補成「有效的」假說數量不多，也就是成長函數長得慢、VC 維度小。

兩種簡單是連在一起的。講義寫的關係是

$$
h \text{ specified by } \ell \text{ bits} \ \Longleftarrow\ \lvert\mathcal{H}\rvert \text{ of size } 2^{\ell}
$$

理由是編號：$\mathcal{H}$ 裡如果只有 $2^{\ell}$ 個假說，把它們從 0 編到 $2^{\ell} - 1$，每個編號寫成二進位剛好是 $\ell$ 個 bit，所以指定其中任何一個 $h$ 只需要 $\ell$ 個 bit。因此 $\Omega(\mathcal{H})$ 小，就保證裡面每個 $h$ 的 $\Omega(h)$ 也小。箭頭是單向的：講義只說模型簡單可以推出假說簡單。

本文補充一個例子。一維的 decision stump $h(x) = s \cdot \text{sign}(x - \theta)$ 在 10 個點上只做得出 20 種標法（下面會算），$2^4 = 16 < 20 \le 32 = 2^5$，所以 5 個 bit 就能指定要哪一種。反過來，如果一個模型在這 10 個點上 $2^{10} = 1024$ 種標法全部做得出來，指定其中一種要 10 個 bit，等於把 10 個標籤逐一背下來。

講義這一頁的結論是：simple 指的是 small hypothesis/model complexity。課堂上回顧了前面做到這件事的兩條路：一開始就只用簡單的模型，或者用[正則化](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization)限制最後得到的假說。

### 為什麼簡單比較好：擬合成功有多稀奇

數學上的理由已經在 VC bound 裡：$m_{\mathcal{H}}(N)$ 長得慢，$E_{\text{in}}$ 和 $E_{\text{out}}$ 就靠得近。第 5 頁說，除了已經看過的 math proof，還有一個哲學上的講法，寫成三個推論：

$$
\text{simple } \mathcal{H} \ \Longrightarrow\ \text{smaller } m_{\mathcal{H}}(N) \ \Longrightarrow\ \text{less likely to fit data perfectly: } \frac{m_{\mathcal{H}}(N)}{2^N} \ \Longrightarrow\ \text{more significant when fit happens}
$$

中間那個分數要解釋一下。課堂上設想的情境是：輸入 $\mathbf{x}_1, \dots, \mathbf{x}_N$ 固定，標籤用丟銅板產生，這樣的資料沒有任何規律。$N$ 個標籤共有 $2^N$ 種可能，每一種的機率都是 $1/2^N$。模型 $\mathcal{H}$ 在這 $N$ 個點上最多做得出 $m_{\mathcal{H}}(N)$ 種標法，只有丟出來的標籤剛好是其中一種時，$\mathcal{H}$ 才找得到 $E_{\text{in}} = 0$ 的假說。講義只寫了分數本身，本文把它補成一條不等式：

$$
\mathbb{P}\big[\text{random labels are perfectly fit by } \mathcal{H}\big] \ \le\ \frac{m_{\mathcal{H}}(N)}{2^N}
$$

寫「$\le$」是因為 $m_{\mathcal{H}}(N)$ 是對所有輸入取的最大值，特定的 $N$ 個點做得出的標法可能更少。

接下來是課堂上的推理。模型簡單時這個機率很小，亂標的資料大部分時候分不開。反過來看，如果你手上的資料真的被這個簡單的模型完美分開了，它多半不是亂標的資料，裡面應該有某種規律。課堂上用的詞是「顯著性」：這個結果是有顯著性的。模型很複雜時就下不了這個結論，因為不管資料有沒有規律它都分得開，分開了也不知道手上的是哪一種資料。

### 數值例子：10 個點，四種模型

以下的表是本文算的，不在講義上；decision stump 那一列就是這一節 Fun Time 的答案。成長函數用[基石第 5 堂](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function)的結果，$N = 10$，標籤由公平的銅板產生，共 $2^{10} = 1024$ 種。

| 模型 | $m_{\mathcal{H}}(N)$ | $m_{\mathcal{H}}(10)$ | 隨機標籤被完美分開的機率上限 |
|---|---|---|---|
| positive rays | $N + 1$ | $11$ | $11/1024 \approx 1.07\%$ |
| decision stump（正反兩個方向的 rays） | $2N$ | $20$ | $20/1024 \approx 1.95\%$ |
| positive intervals | $\frac{1}{2}N^2 + \frac{1}{2}N + 1$ | $56$ | $56/1024 \approx 5.47\%$ |
| 能 shatter 這 10 個點的模型（例如點在圓周上時的 convex sets） | $2^N$ | $1024$ | $100\%$ |

前三列的輸入都在一維的數線上，10 個點互不相同時，表上的數字就是實際做得出的標法數，機率是等號。本文用 Python 把 1024 種標籤全部列出來逐一檢查，decision stump 分得開的剛好 20 種，positive intervals 是 56 種。

**這個結果代表什麼。** 假設你拿 decision stump 去分一份 10 筆的資料，結果 $E_{\text{in}} = 0$。如果資料其實沒有規律，這件事發生的機率不到 2%，所以比較合理的解讀是資料裡真的有一個門檻。換成最後一列的模型，$E_{\text{in}} = 0$ 是必然的，它沒有告訴你任何關於資料的事。資料多一點差距更大：$N = 20$ 時 decision stump 的機率是 $40/2^{20} \approx 0.004\%$。

### 該採取的行動

第 5 頁的結論是兩件事：

- **linear first。** 課堂上說線性模型幾乎是你想得到最簡單的模型，簡單的模型能解決就解決了，其他的再說。
- **always ask whether data over-modeled。** 課堂上特別區分：這裡問的不是機器跑完之後才看得到的那種過擬合，而是你在決定用什麼模型的那一刻，有沒有先用了腦袋裡想得出來最簡單的那一個。用了更複雜的模型，做出好結果時就很難解釋是什麼原因。

### Fun Time：10 個隨機標籤被 decision stump 分開的機率

**題目（第 6 頁）：** 以 $\mathbb{R}^1$ 上的 decision stump 當假說集合 $\mathcal{H}$，已知 $m_{\mathcal{H}}(N) = 2N$。有 10 個不同的輸入 $x_1, x_2, \dots, x_{10}$，標籤 $y_n$ 由公平的銅板獨立產生。資料 $\mathcal{D} = \{(x_n, y_n)\}_{n=1}^{10}$ 能被 $\mathcal{H}$ 分開的機率是多少？

1. $\frac{1}{1024}$
2. $\frac{10}{1024}$
3. $\frac{20}{1024}$
4. $\frac{100}{1024}$

**答案：3。** 講義的解答是：1024 種可能的 $\mathcal{D}$ 裡，只有 $2N = 20$ 種能被 $\mathcal{H}$ 分開。

20 是這樣數的。把 10 個點由小到大排好，門檻 $\theta$ 可以放在相鄰兩點之間的 9 個空隙。每個空隙配兩個方向（右邊標正，或右邊標負），得到 $9 \times 2 = 18$ 種標法。門檻放在所有點的左邊或右邊時，10 個點的標籤全部相同，再多出「全正」與「全負」2 種。合計 $18 + 2 = 20$。每種標籤出現的機率是 $(1/2)^{10} = 1/1024$，所以機率是 $20/1024 \approx 1.95\%$。

其他選項各漏了一件事。選項 1 是某一種特定標法出現的機率。選項 2 只算了 10，是忘了 decision stump 有兩個方向。選項 4 的 100 是 $N^2$，decision stump 的成長函數是 $N$ 的一次式，沒有平方項。

## 訓練資料和考試不是同一個分布時會發生什麼

```youtube
url: https://www.youtube.com/watch?v=8QZZiIAdTUU
title: Three Learning Principles :: Sampling Bias @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–03:14 是 1948 年大選的故事，03:14–05:07 講原則與 VC 的假設，05:07–07:47 是 Netflix 競賽的經驗，07:47–09:31 講怎麼處理，09:31–11:00 是信用卡的謎題，之後是 Fun Time。）

### 1948 年的電話民調

講義第 7 頁的故事：1948 年美國總統選舉是 Truman 對 Dewey，一家報紙用電話民調問選民投給了誰，依結果下了標題「Dewey Defeats Truman」。課堂上補了兩個細節：這是投完票之後才問的，沒有投票意向後來改變的問題；也假設多數人誠實回答。照理說這就是一次抽樣，可以用來估計誰會贏。

頁面上是一張歷史照片，一個人笑著高舉那份報紙，講義問 who is this?。第 8 頁揭曉：他是 Truman，而且他贏了。講義列了兩個嫌疑並逐一排除：

- editorial bug？no。課堂上說事後追查，不是編輯看錯結果或寫錯文章。
- bad luck of polling（$\delta$）？no。$\delta$ 是 Hoeffding 不等式裡「抽到壞樣本」的機率，課堂上的比方是公平的銅板丟十次都出現正面。事後看也不是這個原因。

講義的提示是 phones were expensive。課堂上把故事講完：當年電話很貴，抽得到的都是比較有錢的人，而那一年有錢人支持 Dewey 的比例比較高，其他人支持 Truman 的比較多。只抽到有電話的人，自然會以為 Dewey 的支持率比較高；一人一票全部算完，贏的是 Truman。

### 自擬的數字：樣本再多也救不回來

為什麼講義說這不是運氣？以下是本文自擬的例子，數字是為了計算虛構的，不是 1948 年的實際資料。

假設全體選民裡 25% 家裡有電話。有電話的人 60% 投 Dewey，沒電話的人 40% 投 Dewey。Dewey 的真實得票率是

$$
0.25 \times 0.60 + 0.75 \times 0.40 = 0.15 + 0.30 = 0.45
$$

他輸了。電話民調抽到的全是有電話的人，那個母體的 Dewey 支持率是 0.60。訪問 $N = 1000$ 人，令 $\nu$ 是樣本中投 Dewey 的比例，Hoeffding 不等式說

$$
\mathbb{P}\big[\lvert\nu - 0.60\rvert > 0.05\big] \ \le\ 2\exp\big(-2 \times 0.05^2 \times 1000\big) = 2e^{-5} \approx 0.0135
$$

也就是至少有 98.6% 的機率，民調結果落在 55% 到 65% 之間，報紙會很有把握地寫 Dewey 贏。把樣本加到 10,000 人，右邊變成 $2e^{-50} \approx 3.9 \times 10^{-22}$，民調更穩定地指向 60%，離真實的 45% 一樣遠。本文用 Python 各模擬五次 1000 人的民調：只抽有電話的人得到 0.590、0.574、0.594、0.608、0.594；從全體選民抽得到 0.471、0.472、0.443、0.461、0.462。這是其中一次執行的結果，重跑時每個數字會有一兩個百分點的出入，但前一組都在 0.60 附近，後一組都在 0.45 附近。

**這個結果代表什麼。** Hoeffding 保證的是樣本接近「被抽樣的那個母體」。$\delta$ 管的是運氣，增加 $N$ 可以把它壓小。抽錯母體造成的 15 個百分點差距不在這條不等式裡，$N$ 再大也不會縮小。

### 原則，以及 VC 那個「小」假設

第 9 頁把原則寫成一句話：

> If the data is sampled in a biased way, learning will produce a similarly biased outcome.

資料抽樣有偏差，學出來的結果也會有類似的偏差。講義給了兩種解釋：

- **技術上的解釋：** 資料來自 $P_1(\mathbf{x}, y)$，測試卻在 $P_2 \ne P_1$ 底下進行，VC fails。
- **哲學上的解釋：** 努力讀數學，考的卻是英文，no strong test guarantee。課堂上的說法是，數學讀得再好，英文不一定考得好，兩者沒有很強的關聯。

頁尾點出被忽略的前提：VC 有一個「minor」的假設，data and testing both iid from $P$。課堂上回顧，推導 VC bound 時用的假設非常少，其中一條就是訓練用的資料與測試用的資料來自同一個分布。講義替 minor 加了引號。本文的理解是：這條假設在推導時很少被特別提起，這一節的兩個故事卻都是它不成立的情況。

### Netflix 競賽：驗證集抽錯了

第 10 頁標題是 A True Personal Story。[基石第 1 堂](/posts/ai/2026-09-30-ntu-htlin-ml-learning-problem-perceptron)提過 Netflix 的電影推薦競賽：把推薦系統改善 10%，就能拿到 100 萬美元。課堂上說，林軒田當年在加州理工學院念書時參加了這個比賽。做機器學習的人不會把資料全部拿去訓練，所以他留了一塊資料做驗證（講義寫 formed $\mathcal{D}_{\text{val}}$）。第一次嘗試（講義寫 in my first shot），在其餘的資料上訓練一個模型，$E_{\text{val}}(g)$ 顯示改善了 13%。

講義的下一行是 why am I still teaching here?。課堂上說，去領獎的事當然沒有發生。原因寫在頁尾：

- validation：random examples within $\mathcal{D}$
- test：'last' user records 'after' $\mathcal{D}$

他的驗證資料是從 $\mathcal{D}$ 裡隨機抽的，這是最常用的做法。比賽的測試資料卻不是隨機抽的。課堂上描述：一位使用者看了好幾部電影，主辦單位把時間上前面的紀錄（課堂上舉的是前七部）當訓練資料，後面的（後三部）當測試資料，兩者之間有先後關係。於是驗證用的分布和測試用的分布不同，驗證集上看到的 13% 到了測試上就不算數。課堂上說兩邊大約差了 6%、7%，測試上的改善沒有跨過 10% 的門檻。

這個故事和上一堂接得起來。上一堂說隨機切出 $\mathcal{D}_{\text{val}}$ 是為了讓它仍然是從 $P$ 抽出來的；這裡的問題是測試根本不在那個 $P$ 底下。

### 怎麼處理：盡量貼近測試情境

第 11 頁的經驗法則是 match test scenario as much as possible。課堂上的講法比較有彈性：不必硬性要求訓練與測試的分布一模一樣，要做的是先了解測試環境，再讓訓練環境盡可能接近它。以「測試是 $\mathcal{D}$ 之後的最後幾筆使用者紀錄」為例，講義列了兩個做法：

- **訓練：** emphasize later examples。課堂上解釋，既然時間上比較後面的資料比較重要，就給它們比較重的權重，或用其他方式加強，讓訓練出來的假說偏向後面的資料。講義標註 KDDCup 2011，課堂上說這是台大隊伍在那一年採用的解法之一。
- **驗證：** use 'late' user records。不要隨機抽，改拿手上資料裡時間最晚的那些當驗證資料。

### 最後一個謎題：用銀行既有紀錄學核卡

第 11 頁最後留了一題：danger when learning 'credit card approval' with existing bank records? 講義沒有寫答案，答案在課堂上。

銀行手上的紀錄，是過去核准了卡的顧客後來有沒有亂刷。被拒絕的申請人如果當初拿到卡會怎樣，銀行沒有資料。所以這份資料已經被舊的核卡規則篩選過。新系統上線後面對的是所有申請人，其中有舊規則會核准的，也有舊規則會拒絕的，分布和訓練資料不一樣。課堂上的結論是：照前面教的方法訓練出來的 $g$ 直接拿去用，可能不如預期，需要做一些調整。至於怎麼調整，課堂上沒有展開。

### Fun Time：哪個子集還是沒有偏差的樣本

**題目（第 12 頁）：** 資料 $\mathcal{D}$ 是從二元分類的分布 $P$ 抽出的無偏樣本。下列哪一個 $\mathcal{D}$ 的子集也是 $P$ 的無偏樣本？

1. 所有正例（$y_n > 0$）
2. 從 $\mathcal{D}$ 均勻隨機、不放回地抽出的一半資料
3. $\lVert\mathbf{x}_n\rVert$ 最小的那一半資料
4. 線性可分的最大子集

**答案：2。** 講義的解答是：That's how we form the validation set, remember? 課堂上只多說了選項 1：只挑正例，明顯不是有代表性的隨機樣本。其他選項的推理是本文補的。

選項 2 的挑法不看 $\mathbf{x}_n$ 也不看 $y_n$，每一筆被選中的機率相同，所以選出來的資料仍然像是直接從 $P$ 抽的。另外三個選項都是看了資料內容才決定要不要留：

- 選項 1 依 $y_n$ 篩選，子集裡 $P(y = +1)$ 變成 1。
- 選項 3 依 $\mathbf{x}_n$ 篩選，子集只涵蓋輸入空間靠近原點的區域。
- 選項 4 同時依 $\mathbf{x}_n$ 與 $y_n$ 篩選：要讓剩下的資料線性可分，被丟掉的正是和多數鄰居標籤不合的那些點，其中很多是帶雜訊的資料。子集看起來比真實的 $P$ 乾淨。

本文用一個自擬的一維例子驗算。$x$ 在 $[-1, 1]$ 均勻分布，目標是 $\text{sign}(x)$，每筆標籤有 20% 的機率被翻轉，抽 20,000 筆。一維的「線性可分」就是能被一個門檻分開，最大的可分子集可以直接算出來。下表是其中一次抽樣的結果，重抽時小數第二、三位會變，各列之間的差別不會變。

| 子集 | 筆數 | 正例比例 | $\lvert x\rvert$ 的平均 | 被翻轉的比例 |
|---|---|---|---|---|
| 整份 $\mathcal{D}$ | 20,000 | 0.495 | 0.505 | 0.199 |
| 選項 1：所有正例 | 9,910 | 1.000 | 0.509 | 0.197 |
| 選項 2：隨機一半 | 10,000 | 0.495 | 0.508 | 0.195 |
| 選項 3：$\lvert x\rvert$ 最小的一半 | 10,000 | 0.487 | 0.256 | 0.202 |
| 選項 4：最大的可分子集 | 16,023 | 0.497 | 0.505 | 0.000 |

只有選項 2 的三個統計量都和整份資料接近。選項 1 的正例比例變成 1，選項 3 的輸入範圍縮了一半，選項 4 把雜訊全部濾掉了：在這個子集上估計出來的錯誤率是 0，真實的分布上最好的分類器也有 20% 的錯誤。

## 資料影響過任何一步之後，就不能再拿它來打分數

```youtube
url: https://www.youtube.com/watch?v=7nP5zWMQmxM
title: Three Learning Principles :: Data Snooping @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–01:52 是用眼睛看資料，01:52–06:11 是匯率資料的縮放，06:11–09:10 是論文重複使用同一份資料，09:10–11:57 講怎麼處理，之後是 Fun Time。）

### 用眼睛看圖決定轉換

第 13 頁回到[基石第 12 堂](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-12-nonlinear-transformation)的警告。資料在 $\mathcal{X} = \mathbb{R}^2$，右邊的圖是正方形 $[-1, 1]^2$ 裡的點：藍色圓圈集中在一個以原點為圓心的圓裡，紅色叉叉在圓外。講義列了一路「愈看愈聰明」的轉換：

| 選用的轉換 | $d_{\text{VC}}$ | 怎麼決定的 |
|---|---|---|
| 完整的二次轉換 $\boldsymbol{\Phi}_2$：$\mathbf{z} = (1, x_1, x_2, x_1^2, x_1x_2, x_2^2)$ | 6 | 沒看資料 |
| $\mathbf{z} = (1, x_1^2, x_2^2)$ | 3 | 看了圖（after visualizing） |
| $\mathbf{z} = (1, x_1^2 + x_2^2)$ | 2 | 看了圖，發現邊界是正圓 |
| $\mathbf{z} = \big(\text{sign}(0.6 - x_1^2 - x_2^2)\big)$ | 沒有標 | 直接把答案寫進轉換 |

「怎麼決定的」那一欄是本文的整理：講義只在第二列寫了 after visualizing，第三、四列寫的是 or better 與 or even better。表上的 $d_{\text{VC}}$ 是在 $\mathcal{Z}$ 空間做線性分類的參數個數：6 個分量、3 個分量、2 個分量。最後一列已經沒有東西要學。課堂上說，這等於你用人腦把最後的假說學起來再放進去。

數字愈來愈小，看起來愈來愈安全，講義的評語卻是 careful about your brain's 'model complexity'。寫在表上的 $d_{\text{VC}}$ 只算了機器那一段，沒算到你的大腦看過資料之後替機器做的選擇。結論是：for VC-safety, $\boldsymbol{\Phi}$ shall be decided without 'snooping' data。課堂上解釋 snooping 就是偷看，用肉眼看過資料再做決定，前面推導的 VC 保證就不安全了。

本文補充一個量級上的感覺。用[基石第 7 堂](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error)的模型複雜度懲罰項 $\Omega = \sqrt{\frac{8}{N}\ln\frac{4(2N)^{d_{\text{VC}}}}{\delta}}$，取 $N = 1000$、$\delta = 0.1$：$d_{\text{VC}} = 6$ 時 $\Omega \approx 0.628$，$d_{\text{VC}} = 3$ 時約 $0.460$，$d_{\text{VC}} = 2$ 時約 $0.389$。看了圖才選第三列的人，帳面上只付 0.389，實際上他是從包含完整二次轉換在內的更大集合裡挑出這一個，該付的至少是 0.628 那一級，而且大腦考慮過哪些可能其實算不出來。

### 只是做縮放也算偷看

第 14 頁先把原則寫出來：

> If a data set has affected any step in the learning process, its ability to assess the outcome has been compromised.

一份資料只要影響過學習流程的任何一步，它評估結果的能力就打了折扣。課堂上的說法是：使用資料的任何過程都讓你間接看到資料的表現，看了之後下的每個決策都是一次選擇，選擇就會帶進額外的模型複雜度。

講義的例子是匯率預測：

- 8 年的匯率交易資料，前 6 年訓練，後 2 年測試。
- 輸入 $\mathbf{x}$ 是前 20 天的匯率，輸出 $y$ 是第 21 天的匯率，是一個迴歸問題。
- 迴歸之前先把數值平移縮放（shift-scale）。課堂上說，數值變動範圍太大時不好做迴歸，例如把 0 到 100 元縮到 0 到 1 之間，預測完再放縮回來。

差別只在縮放用的統計量從哪裡算：

- **no snooping：** 只用訓練的 6 年算，再套到全部資料。
- **snooping：** 用訓練加測試的 8 年一起算。課堂上說這是一個偷懶的做法：反正 8 年的資料都在手上，一次縮放完比較省事。

右邊的圖橫軸是測試期間的天數（0 到 500），縱軸是累積獲利的百分比。講義沒有列出數值，以下都是從圖上讀出來的大約值。前 140 天左右，兩條線都在 0 附近幾個百分點內上下。之後就分開了：標著 snooping 的紅線起起伏伏地往上，第 460 天前後最高到 30% 左右，結束時大約 24%；標著 no snooping 的藍線掉到 0 以下，之後最多只回到貼近 0 的位置，第 250 天前後最低，大約 $-14\%$，結束時在 $-4\%$ 附近。講義的說法是 superior profit possible。課堂上的解讀是紅線看起來好得不得了，藍線沒賺多少，甚至有點虧。

測試的 2 年沒有直接參與訓練，影響是間接的。課堂上的解釋：縮放的過程讓機器知道了後兩年的統計量，例如最大值、最小值、平均數、標準差。這就像把考卷混進來一起看。紅線的做法也沒辦法實際使用，課堂上的說法是，你得先收集完未來兩年的匯率，系統才能告訴你未來兩年怎麼賺。未來的資料即使只是間接偷看也不行，課堂上說那是自欺欺人。

以下是本文自擬的小例子，用來看縮放到底洩漏了什麼。訓練期間的 6 個匯率是 28、30、32、31、29、30，測試期間的 4 個是 33、35、36、34。用最小值與最大值把數值線性縮放到 0 與 1：

| 做法 | 用的最小值、最大值 | 訓練資料縮放後 | 測試資料縮放後 |
|---|---|---|---|
| 只用訓練資料算 | 28、32 | 0、0.5、1、0.75、0.25、0.5 | 1.25、1.75、2、1.5 |
| 訓練加測試一起算 | 28、36 | 0、0.25、0.5、0.375、0.125、0.25 | 0.625、0.875、1、0.75 |

第二種做法下，訓練資料最高只到 0.5，而尺度的上限是 1。光看訓練資料的範圍就知道：未來的匯率會往上漲，最高點離最低點的距離會是目前的兩倍（$36 - 28 = 8$ 對 $32 - 28 = 4$）。這個訊息來自測試期間，卻在訓練開始之前就進了輸入。第一種做法的測試資料會超出 $[0, 1]$，那是誠實的結果，真正上線時未來的數值本來就可能超出過去的範圍。

### 大家在同一份資料上接力發論文

第 15 頁的情境是做研究。有一份大家都在用的 benchmark 資料 $\mathcal{D}$：

- 論文 1：提出 $\mathcal{H}_1$，在 $\mathcal{D}$ 上表現不錯。
- 論文 2：找到改進空間，提出 $\mathcal{H}_2$，and publish only if better than $\mathcal{H}_1$ on $\mathcal{D}$。
- 論文 3：再提出 $\mathcal{H}_3$，只有在 $\mathcal{D}$ 上贏過 $\mathcal{H}_2$ 才發表。
- 依此類推。

講義從兩個角度看這件事。第一，把所有論文當成同一位作者寫的一篇大論文：這篇大論文試過 $\mathcal{H}_1, \mathcal{H}_2, \mathcal{H}_3, \dots$，泛化要付的代價是 $d_{\text{VC}}(\cup_m \mathcal{H}_m)$。這和上一堂「用 $E_{\text{in}}$ 在兩個模型之間選，要付聯集的 VC 維度」是同一個道理。第二，一步一步看：後面的作者讀了前面的論文，就是間接偷看了這份資料上什麼方法表現好；publish only if better 讓情況更糟。

課堂上補了三點。每位作者都可以說自己很誠實，但他已經站在前人的肩膀上，愈晚的論文受污染愈重。上面的計算還沒算進那些試了發現不好、被丟掉的模型。一份資料用了十年、有一千篇論文在上面做研究之後，大家都說自己比較好，卻分不清是真的比較好，還是某種形式的間接過擬合。

講義引了一句話：if you torture the data long enough, it will confess。課堂上解釋它套用的原句：拷問犯人夠久，他就會招供。資料招供出來的是一個在它身上表現很好的假說，真的拿去測試會不會好，不知道。

以下是本文自擬的例子，把「拷問」算成數字。假設 benchmark 的測試集有 1000 筆二元分類資料，而每一個被拿來試的方法其實都是亂猜，真實正確率都是 50%。單一方法在這 1000 筆上碰巧答對 540 筆以上的機率，用二項分布精確計算是

$$
p = \sum_{k=540}^{1000} \binom{1000}{k}\Big(\frac{1}{2}\Big)^{1000} \approx 0.0062
$$

$M$ 個互相獨立的方法裡至少有一個達到 54% 的機率是 $1 - (1 - p)^M$：

| 試過的方法數 $M$ | 至少一個達到 54% 的機率 |
|---|---|
| 1 | 0.6% |
| 10 | 6.1% |
| 100 | 46.4% |
| 1000 | 99.8% |

再模擬一次「贏了才發表」：依序試 1000 個亂猜的方法，只有刷新紀錄的才算發表。下面這段程式用 Python 標準函式庫的 `random`，亂數種子設成 1126，每個方法在 1000 筆資料上各丟 1000 次公平的銅板當作答對與否：

```python
import random

random.seed(1126)
best = -1
for i in range(1, 1001):
    correct = sum(random.getrandbits(1) for _ in range(1000))
    if correct > best:
        best = correct
        print(i, correct / 1000)
```

印出四行，也就是四篇論文：第 1 個方法 49.3%，第 2 個 53.0%，第 31 個 53.4%，第 217 個 54.4%。換一個種子，篇數與數字會不同，但紀錄只會往上。每一篇都誠實地回報自己在 benchmark 上的數字，每一篇都贏過前一篇。

**這個結果代表什麼。** 排行榜上一路上升的數字，有一部分來自「在同一份資料上試了很多次並且只留下最好的」。這四個方法拿到新的資料上，正確率的期望值都是 50%。單看任何一篇都沒有問題，問題出在整個社群對同一份資料做了多少次選擇。

### 怎麼處理：誠實的程度與兩個習慣

第 16 頁第一句是實話：very hard to avoid, unless being extremely honest。課堂上說完全不偷看很難做到，而且完全不看資料，機器學習也可能做不好。講義依誠實的程度列了兩級：

- **extremely honest：** lock your test data in safe。課堂上的說法是，資料一拿來就把測試資料鎖進櫃子，等到最後真的要測試的時候才拿出來用。
- **less honest：** reserve validation and use cautiously。驗證資料拿來做類似測試的事，而且會重複使用（模型選擇就是）。課堂上提醒要用得小心，不要拿同一份驗證資料去選一千萬個模型。

另外是兩個習慣：

- **be blind：** avoid making modeling decision by data。課堂上舉語音當例子：有領域知識，就在看資料之前把它想好、做成特徵放進去；不要看完資料覺得它好像有某種特性，再把那個特徵加進去，否則人腦的複雜度又跟著進去了。
- **be suspicious：** 讀論文、看研究結果時保持懷疑，講義特別註明 including your own，要有 proper feeling of contamination。課堂上說，要去感覺一個結果是經過多少過程得到的、可能被污染得多嚴重，這要靠經驗慢慢磨出來。

頁尾是 one secret to winning KDDCups：在 data-driven modeling（snooping）與 validation（no-snooping）之間小心取得平衡。課堂上講得很白：data-driven modeling 是好聽的說法，其實就是偷看，只是偷看得小心一點；另一邊則靠驗證的結果做合理的選擇。

### Fun Time：什麼會讓測試表現不好

**題目（第 17 頁）：** 下列哪一項可能造成機器學習的測試表現不如預期？

1. data snooping
2. overfitting
3. sampling bias
4. 以上皆是

**答案：4。** 講義的解答是 A professional like you should be aware of those!，課堂上也說這是簡單的題目。三個選項各自是一種讓 $E_{\text{out}}$ 比你以為的差的方式：

- **overfitting**（[基石第 13 堂](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization)）：$E_{\text{in}}$ 很低，但模型複雜度太高，$E_{\text{out}}$ 和它差很遠。
- **sampling bias**：$E_{\text{in}}$ 與 $E_{\text{val}}$ 估計的是 $P_1$ 上的表現，測試卻在 $P_2$。
- **data snooping**：拿來評估的資料已經參與過決策，估計值偏樂觀。

三者的共同點是你手上那個用來估計表現的數字失準了。

## 把十六堂課收成幾組三

```youtube
url: https://www.youtube.com/watch?v=29jgHPeRAqI
title: Three Learning Principles :: Power of Three @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–01:00 是三個相關領域，01:00–01:55 三個理論保證，01:55–03:24 三個線性模型，03:24–05:06 三個工具，05:06–05:31 三個原則，05:31–07:02 三個未來方向，07:02–07:22 Fun Time，之後是整堂的總結。）

最後一節講義稱為 Power of Three。課堂上說整門課介紹的東西好像都跟三有關，就像哈利波特裡的三人組，三個加在一起威力最強。以下一頁一組。

### 三個相關領域

第 18 頁回顧[基石第 1 堂](/posts/ai/2026-09-30-ntu-htlin-ml-learning-problem-perceptron)比較過的三個領域：

| 領域 | 它想做的事 | 和機器學習的關係 |
|---|---|---|
| Data Mining | 用（大量）資料找出有趣的性質 | 實務上很難和機器學習區分 |
| Artificial Intelligence | 算出有智慧表現的東西 | 機器學習是實現人工智慧的一條路 |
| Statistics | 用資料對未知的過程做推論 | 統計提供機器學習很多有用的工具 |

### 三個理論保證

第 19 頁把三個 bound 並排，重點是各自用在哪裡：

| | Hoeffding | Multi-Bin Hoeffding | VC |
|---|---|---|---|
| $\mathbb{P}[\text{BAD}] \le$ | $2\exp(-2\epsilon^2 N)$ | $2M\exp(-2\epsilon^2 N)$ | $4\,m_{\mathcal{H}}(2N)\exp(\dots)$ |
| 適用的對象 | 一個假說 | $M$ 個假說 | 整個 $\mathcal{H}$ |
| 用在哪裡 | 測試（verifying/testing） | 驗證（validation） | 訓練（training） |

講義上 VC 那一格的指數寫成「$\dots$」，完整的式子在[基石第 6 堂](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-06-theory-of-generalization)，是 $\exp(-\frac{1}{8}\epsilon^2 N)$。課堂上把三者串起來：測試時只有一個假說，Hoeffding 就夠；驗證是在有限個候選之間做選擇，用多個 bin 的版本；訓練時假說有無限多個，要靠 VC bound。

這張表也是計算偷看代價的工具：資料被用來做了幾次選擇，就該套用哪一欄。以下是本文自擬的比較。想要 $\epsilon = 0.1$、壞事發生的機率不超過 $\delta = 0.05$，三種情況各需要多少筆資料？

- **測試一個假說：** $2\exp(-2\epsilon^2 N) \le \delta$ 解出 $N \ge \frac{\ln(2/\delta)}{2\epsilon^2} = \frac{\ln 40}{0.02} \approx 184.4$，需要 185 筆。
- **在 100 個候選之間選：** $N \ge \frac{\ln(2M/\delta)}{2\epsilon^2} = \frac{\ln 4000}{0.02} \approx 414.7$，需要 415 筆。
- **用 decision stump 訓練：** $m_{\mathcal{H}}(2N) = 4N$，要 $16N\exp(-\frac{1}{8} \times 0.01 \times N) \le 0.05$。這個式子沒有公式解，用程式從小到大試，最小的 $N$ 是 12,138。

**這個結果代表什麼。** 同一個保證，測試只要 185 筆，從 100 個裡面挑要 415 筆，連最簡單的模型做訓練都要一萬多筆。乾淨的測試資料很省，原因是它只評估一個已經定案的假說。拿它來挑選之後，它就要改套中間那一欄；被拿來反覆調整到等同於訓練，就落到最右邊那一欄。

### 三個線性模型

第 20 頁是[基石第 11 堂](/posts/ai/2026-09-30-ntu-htlin-ml-linear-classification-nonlinear-transform)那張圖。三個模型都先算分數 $s = \mathbf{w}^\top\mathbf{x}$，差在分數怎麼輸出、用什麼誤差、怎麼最小化：

| | PLA／pocket | 線性迴歸 | 邏輯迴歸 |
|---|---|---|---|
| 假說 | $h(\mathbf{x}) = \text{sign}(s)$ | $h(\mathbf{x}) = s$ | $h(\mathbf{x}) = \theta(s)$ |
| 誤差 | 0/1（plausible：small flipping noise） | squared（friendly：easy to minimize） | cross-entropy（plausible：maximum likelihood） |
| 最小化的方式 | specially | analytically | iteratively |

講義用兩個形容詞區分誤差函數：0/1 與 cross-entropy 是 plausible，各有一個說得通的來源；平方誤差是 friendly，好算。課堂上補充：0/1 誤差的最小化是很困難的問題，所以 PLA 與 pocket 用的是特殊的方法；線性迴歸有公式解；邏輯迴歸把分數通過 S 形的函數再輸出，用梯度下降或隨機梯度下降做最佳化。

### 三個工具

第 21 頁是第四個問題 How Can Machines Learn Better? 的三個答案，每個都是拿一樣東西換另一樣：

| | Feature Transform | Regularization | Validation |
|---|---|---|---|
| 改了什麼 | $E_{\text{in}}(\mathbf{w}) \to E_{\text{in}}(\tilde{\mathbf{w}})$；$d_{\text{VC}}(\mathcal{H}) \to d_{\text{VC}}(\mathcal{H}_{\boldsymbol{\Phi}})$ | $E_{\text{in}}(\mathbf{w}) \to E_{\text{in}}(\mathbf{w}_{\text{REG}})$；$d_{\text{VC}}(\mathcal{H}) \to d_{\text{EFF}}(\mathcal{H}, \mathcal{A})$ | $E_{\text{in}}(h) \to E_{\text{val}}(h)$；$\mathcal{H} \to \{g_1^-, \dots, g_M^-\}$ |
| 做法 | 用更複雜的 $\boldsymbol{\Phi}$ | 加上 regularizer $\Omega$ | 保留 $K$ 筆當 $\mathcal{D}_{\text{val}}$ |
| 得到 | 較低的 $E_{\text{in}}$ | 較低的 $d_{\text{EFF}}$ | 較少的選擇（fewer choices） |
| 付出 | 較高的 $d_{\text{VC}}$ | 較高的 $E_{\text{in}}$ | 較少的訓練資料（fewer examples） |

課堂上說正則化和特徵轉換是「反其道而行」：一個讓 $d_{\text{VC}}$ 變大來換 $E_{\text{in}}$ 變小，另一個讓有效的 VC 維度變小、接受 $E_{\text{in}}$ 變大一點。驗證走第三條路：留下一塊乾淨的資料，也不在整個 $\mathcal{H}$ 上做選擇，只在各模型選出來的有限個代表之間選，選擇少，保證就比較好。課堂上說這三樣是之後學各種機器學習方法的基本工具。

### 三個原則，套到核卡問題走一遍

第 22 頁把這堂課的三個原則各配一句話：

| Occam's Razor | Sampling Bias | Data Snooping |
|---|---|---|
| simple is good | class matches exam | honesty is best policy |

講義這一頁第一格的標題拼成了 Occam's Razer，其他頁都是 Razor。

以下是本文自擬的走查，把三個原則套到這門課從第 1 堂用到現在的信用卡核卡問題，數字都是虛構的。假設銀行有 10,000 筆過去核卡顧客的紀錄，每筆有 10 個特徵，要學一個決定要不要發卡的分類器。

1. **先鎖測試資料，而且照測試情境切。** 上線後面對的是未來的申請人，所以照時間排序：最晚的 1,000 筆鎖起來當測試，再往前的 2,000 筆當驗證，最早的 7,000 筆訓練。這是 match test scenario 與 lock your test data in safe 兩件事一起做。
2. **Occam's razor：先試線性。** 直接用 10 個特徵做邏輯迴歸，是 11 個參數。完整的二次轉換有 $\binom{12}{2} = 66$ 個分量。線性模型在驗證集上夠好，就不需要動用 66 維。
3. **縮放只用訓練資料算。** 平均數與標準差從那 7,000 筆算，再套到驗證與測試資料。
4. **數一數驗證集被用了幾次。** 假設在 20 個候選（幾種轉換配幾個 $\lambda$）之間用 $E_{\text{val}}$ 選。多個 bin 的 Hoeffding 給出 $\epsilon = \sqrt{\frac{\ln(2M/\delta)}{2K}}$，代入 $M = 20$、$K = 2000$、$\delta = 0.05$ 得 $\epsilon \approx 0.041$。如果把候選擴大到一千萬個，$\epsilon \approx 0.070$。
5. **測試只做一次。** 最後定案的 $g$ 在 1,000 筆測試資料上評估一次，套單一假說的 Hoeffding，$\epsilon = \sqrt{\frac{\ln(2/\delta)}{2 \times 1000}} \approx 0.043$。如果中途拿測試資料比過那 20 個候選，它就要改用 $M = 20$ 來算，$\epsilon \approx 0.058$，而且手上再也沒有乾淨的資料。
6. **還沒解決的 sampling bias。** 這 10,000 筆都是舊規則核准的人。假設舊規則核准了六成申請人，被核准的人有 5% 後來違約，被拒絕的人如果拿到卡會有 30% 違約。全體申請人的違約率是 $0.6 \times 0.05 + 0.4 \times 0.30 = 0.15$，是訓練資料裡看到的 5% 的三倍。前五步做得再仔細，$E_{\text{val}}$ 與測試結果估計的都是「舊規則會核准的人」這個分布上的表現。

**這個走查代表什麼。** 第 4、5 步的數字要在驗證與測試資料確實來自未來的分布時才成立，Hoeffding 管不到分布不同這件事。前五步是自己做得到的紀律，第 6 步是資料本身的限制，只能先知道它存在，上線後留意。這也是講義把 sampling bias 與 data snooping 分成兩個原則的原因：一個問資料從哪裡來，一個問你拿資料做了什麼。

### 三個未來方向

第 23 頁列的三個方向是 More Transform、More Regularization、Less Label。課堂上各用一句話說明：比多項式轉換更多樣、更複雜的轉換，以及它們的計算怎麼解決；更進階的正則化，怎麼控制機器不要像脫韁野馬一樣跑掉；以及標籤沒有那麼多的時候（例如 unsupervised）會發生什麼事。

投影片下半部散落著一大堆名詞：bagging、decision tree、support vector machine、neural network、kernel、AdaBoost、aggregation、sparsity、autoencoder、coordinate descent、dual、uniform blending、deep learning、nearest neighbor、decision stump、kernel LogReg、large-margin、prototype、quadratic programming、SVR、GBDT、PCA、random forest、matrix factorization、Gaussian kernel、soft-margin、k-means、OOB error、RBF network、probabilistic SVM。頁尾寫 ready for the jungle!。課堂上說，這些名詞稍微去學一下就會發現，很多都和這十六堂的內容有很深的關聯，這門課想給的就是一個基石。課堂上也預告，後半部的機器學習技法會講到其中幾個方向；它的十六堂從[技法第 1 堂：線性 SVM](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm)開始。

### Fun Time：這門課的魔術數字

**題目（第 24 頁）：** 這門課反覆出現的魔術數字是哪些？

1. 3
2. 1126
3. 3 和 1126 都是
4. 3 和 1126 都不是

**答案：3。** 講義的解答是 3 as illustrated, and you may recall 1126 somewhere。3 就是這一節的五組三，加上未來方向是六組。1126 在前面的講義裡當過好幾次例子：基石第 10 堂 Fun Time 的選項「err 小於 1126」、第 13 堂的 1126 次目標函數與 $\sin(1126x)$、第 14 堂的 $\mathcal{H}(1126)$、第 15 堂的 $\boldsymbol{\Phi}_{1126}$。選項 1 與 2 各只說對一半，選項 4 兩個都否定了。這題沒有要推導的東西，是整門課結束前的玩笑。

第 25 頁的總結把四節各收成一句：Occam's razor 是 simple, simple, simple!；sampling bias 是 match test scenario as much as possible；data snooping 是 any use of data is 'contamination'；Power of Three 是 relatives, bounds, models, tools, principles。下一步寫的是 ready for jungle!。

## 自我檢查

**1. 一維數線上有 6 個不同的點，標籤由公平的銅板產生。positive intervals（一段區間內標正、其餘標負）把資料完美分開的機率是多少？換成 positive rays 呢？哪一個模型分開時比較有意義？**

答案：positive intervals 的 $m_{\mathcal{H}}(6) = \frac{1}{2} \times 36 + \frac{1}{2} \times 6 + 1 = 22$，機率是 $22/64 \approx 34.4\%$。positive rays 的 $m_{\mathcal{H}}(6) = 7$，機率是 $7/64 \approx 10.9\%$。positive rays 分開時比較有意義，因為亂標的資料比較難碰巧被它分開。兩個機率都不小，6 個點太少，用哪個模型分開都不算強的證據。

**2. 某次民調只訪問得到 30% 的選民（例如只打市內電話）。這群人 55% 支持候選人 A，其餘 70% 的選民 42% 支持 A。A 的真實支持率是多少？訪問 2000 人，民調結果落在 50% 以下的機率最多有多大？**

答案：真實支持率是 $0.3 \times 0.55 + 0.7 \times 0.42 = 0.165 + 0.294 = 0.459$，A 沒有過半。民調抽到的母體支持率是 0.55，結果低於 0.50 表示偏離超過 0.05，Hoeffding 給的上界是 $2\exp(-2 \times 0.05^2 \times 2000) = 2e^{-10} \approx 9 \times 10^{-5}$。所以民調幾乎一定顯示 A 過半，與事實相反，而且加大樣本不會改善。

**3. 下面四個流程，哪些有 data snooping？各自污染了哪一份資料？（a）先用全部資料算平均數與標準差做標準化，再切訓練與測試；（b）在測試集上比較 5 個 λ，回報最好的那個測試誤差；（c）用全部資料算每個特徵與標籤的相關係數，留下最高的 10 個特徵，再做交叉驗證；（d）看資料之前，依領域知識決定只用二次轉換。**

判準：（a）有，測試資料的統計量進了輸入的尺度，和匯率例子相同。（b）有，測試集被拿來做選擇，回報的數字應套 $M = 5$ 的 bound，而且偏樂觀。（c）有，挑特徵這一步看了所有資料的標籤，包括之後每一折的驗證資料，交叉驗證的結果不再乾淨；正確做法是在每一折的訓練部分裡各自挑特徵。（d）沒有，這正是 be blind 的做法。答案要能說出「哪一份資料影響了哪一個決定」。

**4. 三個情境各該用哪一個 bound？（a）最後定案的 $g$ 在鎖起來的 1000 筆測試資料上評估；（b）用 1000 筆驗證資料在 5 個模型之間選；（c）用 PLA 在訓練資料上學出 $g$。前兩個情境在 δ = 0.05 時的 ε 各是多少？**

答案：（a）單一假說的 Hoeffding，$\epsilon = \sqrt{\ln(40)/2000} \approx 0.043$。（b）多個 bin 的 Hoeffding，$M = 5$，$\epsilon = \sqrt{\ln(200)/2000} \approx 0.051$。（c）VC bound，因為 PLA 是從無限多條線裡選。

**5. 某個 benchmark 的測試集有 400 筆二元分類資料。有 50 個方法其實都是亂猜（真實正確率 50%）。至少有一個方法在測試集上達到 55% 的機率大約是多少？這說明了什麼？**

答案：單一方法答對 220 筆以上的機率，用二項分布算是 $\sum_{k=220}^{400}\binom{400}{k}/2^{400} \approx 0.0255$。50 個獨立的方法至少一個達到的機率是 $1 - (1 - 0.0255)^{50} \approx 0.725$。也就是說，有七成以上的機率，排行榜第一名的 55% 完全來自選擇。判準：答案要指出測試集被用來做了 50 次比較，回報最好的那個數字時不能再把它當成單一假說的測試結果。

## 練習與對應閱讀

**兩個學期的對應週次。** [Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)把驗證與這堂排在同一週（W8，10/21），這堂的投影片是 [16u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/16u_handout.pdf)。[Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)排在 W8（10/28），兩堂一起上；這一週的投影片連結在 2026-09-30 還是 404，所以本文只用 MOOC 版講義。

**教科書。** 兩份課程頁都把這堂標在 [Learning from Data](http://amlbook.com)（LFD）的第 5 章。

**作業。** [Fall 2024 HW5](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw5/hw5.pdf)（2024-11-04 發布、11-18 截止）有兩題和這堂直接相關，沒有官方解答：

- **Q3**：題目明寫「In Lecture 16」。5 個點、隨機標籤下，decision stump 能做到的最小 $E_{\text{in}}$ 的期望值；附註說 1 減兩倍的期望值就是經驗 Rademacher complexity。這是第 6 頁 Fun Time 的延伸：Fun Time 問的是 $E_{\text{in}} = 0$ 的機率，這題問分不開的時候最好能做到多好。做之前可以先把這篇的 20 種標法自己列一次。
- **Q9**：分類器部署到正負例比例不同的測試分布時，什麼情況下會和常數分類器一樣差。對應這堂的 sampling bias：測試分布和訓練分布不同。

整份作業的導讀在[基石作業導讀](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide)。

**今晚可以做的一件事。** 打開你最近一次模型評估的程式，確認縮放或標準化的統計量只用訓練資料算（例如 scikit-learn 的 scaler，`fit` 只呼叫在訓練資料上）。再看驗證集是不是貼近真正的使用情境。這兩件事分別對應匯率例子與 Netflix 的故事。

**下一堂。** 基石到此結束。[技法第 1 堂：線性 SVM](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm) 從第 23 頁那堆名詞裡的 large-margin 與 support vector machine 開始。

## 課程影片來源

原始影片：[Occam's Razor](https://www.youtube.com/watch?v=Oj6j98ceUz8)、[Sampling Bias](https://www.youtube.com/watch?v=8QZZiIAdTUU)、[Data Snooping](https://www.youtube.com/watch?v=7nP5zWMQmxM)、[Power of Three](https://www.youtube.com/watch?v=29jgHPeRAqI)

- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

查核日期：2026-10-13。影片 ID、標題與長度於當天從官方播放清單取得；YouTube 上沒有字幕軌，本文的課堂說法來自自行轉錄的逐字稿。這四支是基石播放清單的第 62 到 65 支，第 65 支是整份清單的最後一支。

## 更新紀錄

- 2026-10-13：系列改為一堂一篇，這篇是新拆出的一堂，依講義與影片逐字稿寫成。

## 參考資料

- [基石第 16 堂講義 16_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/16_handout.pdf)：本文的主要底本，三個原則的敘述、兩個故事、匯率與論文接力的例子、Power of Three 的五張表與四題 Fun Time 都出自這份講義。
- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)：四支影片的 ID 與標題；文中「課堂上」的說法轉述自這四支影片的機器轉錄逐字稿。
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/)：官方講義與錄影入口。
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)：對應週次、16u 投影片與 LFD 章節。
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)：對應週次。
- [Fall 2024 Homework 5](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw5/hw5.pdf)：Q3 與 Q9 的題目內容。
- [Learning from Data 教科書網站](http://amlbook.com)：第 5 章的出處。
- [台大林軒田 機器學習基石與技法 導讀：課程總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)：整門課的位置與閱讀路線。
