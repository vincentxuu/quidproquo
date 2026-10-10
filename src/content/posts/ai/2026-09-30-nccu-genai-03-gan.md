---
title: "政大蔡炎龍 生成式AI L03：紅極一時的 GAN——讓兩個網路互相對抗，怎麼就生得出圖？"
date: 2026-09-30
category: ai
type: guide
tags: [nccu-generative-ai, ai-course, course-guide, generative-ai, gan, cross-entropy]
lang: zh-TW
series:
  name: "政大蔡炎龍 生成式AI 導讀"
  order: 3
tldr: "同一句「一個可愛的女孩」有無數種正確答案，硬把它當函數訓練，只會學到所有答案的平均。GAN 的解法是改訓練兩個網路：生成器 G 從隨機 latent 向量造圖，鑑別器 D 判真假，兩邊互相對抗。L03 從 2014 年的原始論文一路講到 WGAN、Progressive GAN、StyleGAN 的 512 維 latent 與 AdaIN，再到 Pix2Pix、CycleGAN；後半的附錄把 cross entropy 與 KL divergence 講成「驚訝指數」。第三週作業二選一：實際跑一個 GAN，或用自己的話解釋 CE 與 KL。"
description: "政大蔡炎龍「生成式 AI：文字與圖像生成的原理與實務」1132 學期第 3 講導讀：創作型 AI 為什麼不是函數、GAN 的生成器與鑑別器、min-max loss、WGAN 與 mode collapse、Progressive GAN 與 StyleGAN、Pix2Pix 與 CycleGAN，附錄的 cross entropy 與 KL divergence，以及長庚衛星班版第三週作業的題目與評分標準。"
draft: false
glossary:
  - term: "mode collapse"
    aliases: ["模式崩壞", "Collapse 崩壞"]
    definition: "GAN 的生成器發現某一種輸出總能騙過鑑別器後，不管輸入什麼 latent 向量都只生那一種，失去多樣性。"
    context: "L03 投影片在 WGAN 那一頁用「管他的，反正都生這張」的漫畫說明。"
  - term: "KL divergence"
    aliases: ["KL 散度", "Kullback-Leibler divergence"]
    definition: "衡量兩個機率分布差多少的量，等於 cross entropy 減掉真實分布自己的 entropy；兩個分布相同時為 0。"
    context: "L03 附錄用它說明為什麼學 soft target（例如知識蒸餾）時，KL 比 cross entropy 更能看出差距。"
---

> 🌏 [English version](/posts/ai/2026-09-30-nccu-genai-03-gan-en)

**影片狀態：僅附官方入口或錄影清單。** [影片來源與說明](#課程影片來源)

**本文依據政大蔡炎龍「生成式 AI：文字與圖像生成的原理與實務」2025 春季（政大學期代碼 1132）版。** 這是[政大蔡炎龍 生成式AI 導讀](/posts/ai/2026-09-30-nccu-genai-course-overview)系列第 3 篇，接續 [L02 神經網路的概念](/posts/ai/2026-09-30-nccu-genai-02-neural-networks)。

用到的官方材料有三份：[第 3 講錄影](https://www.youtube.com/watch?v=akt4A3OJ9h4)（2025-03-04，2 小時 45 分）、投影片 [GenAI03 GAN 生成對抗網路](https://drive.google.com/file/d/1UqnoeRSgHfNC0o6X5ENeWmLKqZNagskI/view)（91 頁），以及[長庚衛星班課程頁](https://yangchihyuan.github.io/courses/GenerativeAI2025)上的第三週作業說明。存取等級是 **A3**：錄影、投影片、作業題目與評分標準都公開，但作業繳交與批改走各校平台，校外讀者只能自評。

## 課程影片來源

影片來源已對照官方課程頁（查核日期：2026-10-10），講次與影片連結一致；這支影片的 YouTube 播放器回應標示不允許嵌入（playableInEmbed 為 false，先前 oEmbed 也回 401），所以下方的嵌入區塊不會播放，請直接開原始影片連結（公開可看）。影片沒有可取得的字幕，本篇引用的錄影章節時間與主題都是影片說明欄的標示，只對照說明欄、沒有逐段聽過內容，因此不加「已依字幕核對」標記。不提供時間跳轉。

原始影片：[【生成式 AI】03. 紅極一時的生成對抗網路 GAN（YouTube 錄影，2025-03-04）](https://www.youtube.com/watch?v=akt4A3OJ9h4)

課程與錄影入口：

- [官方課程與錄影入口](https://yangchihyuan.github.io/courses/GenerativeAI2025)

查核日期：2026-10-10。

## 本週在課程中的位置

L02 把神經網路講成一台「函數學習機」：你想清楚輸入是什麼、輸出是什麼，剩下交給它學。L03 一開頭就丟出這台機器的死穴：**創作型的 AI，輸入跟輸出根本不是函數關係。**

這一講是全課第一個真正的生成模型。它在弧線上負責回答「生成為什麼難」，後面的 LLM（L04）和 diffusion（L10–L11）都會回來用到這一講建立的直覺：生成模型的輸入裡要有一份隨機的「想法」。

錄影的章節大致分成三段：前 75 分鐘講 GAN 的原理與 StyleGAN，第二節講 This X Does Not Exist、CycleGAN，再用將近 50 分鐘講 cross entropy 與 KL divergence，最後是助教課。

## 創作型 AI 為什麼不能當函數訓練

投影片第 4–9 頁用一個例子講完這個問題。你想做一台機器，輸入「一個可愛的女孩」，輸出一張圖。問題是同一句話有無數張正確的圖。

一個輸入對應多個輸出，這**不是函數**。如果硬要訓練，模型學到的會是所有正確答案的**平均**，平均出來很可能四不像；就算運氣好看得過去，也不是我們要的「創作」。

解法是在輸入裡多放一樣東西：一個隨機產生的向量 z，投影片叫它 **latent tensor（潛張量）**，比喻成「天馬行空的想法」。同一句話配上不同的 z，就能畫出不同的圖，這時輸入和輸出又回到一對一了。

問題變成：z 要怎麼對應到一張像樣的圖？沒有人能替每個 z 標註「正確答案」。

## GAN：訓練兩個網路，讓它們互相對抗

[Ian Goodfellow 等人 2014 年的 GAN 論文](https://arxiv.org/abs/1406.2661)給了一個很聰明的答案：不要準備正確答案，改訓練兩個神經網路。

- **生成器 G（generator）**：吃隨機向量 z，吐出一張圖 G(z)。
- **鑑別器 D（discriminator）**：吃一張圖，判斷它是真的（來自真實資料）還是假的（G 造的），輸出 0 到 1 之間的分數。

D 希望真圖的分數接近 1、假圖接近 0；G 希望自己的假圖被 D 打成接近 1。兩邊互相較勁，G 就被逼著越畫越像。投影片引了 Yann LeCun 2016 年的話，說 adversarial training 是深度學習近年最有意思的發展。

投影片第 18 頁還放了一個本校例子：政大學生與蔡炎龍合作的字型生成 GAN（Variational Grid Setting Network），當年參加 GAN 比賽得了佳作。

### 學習過程長什麼樣

投影片第 29–30 頁引用原論文的示意圖：一開始 G 的分布 p_g 跟真實分布 p_data 差很遠，D 很容易分辨，G 先被「下馬威」；隨著訓練，p_g 慢慢貼近 p_data。學成的時候兩個分布重合，D 已經分不出哪張是真的，圖上 D 的曲線變成一條水平線。

<details>
<summary>GAN 的 loss（投影片第 24–28 頁）</summary>

先記兩件事：log 是遞增函數；log 把乘法變成加法，`log(a·b) = log(a) + log(b)`。

鑑別器 D 要讓下面兩項都越大越好：

```
E_{x~p_data}[ log D(x) ]          ← 真圖的分數越接近 1 越好
E_{z~p_z}[ log(1 − D(G(z))) ]     ← 假圖的分數越接近 0 越好
```

生成器 G 只管第二項，而且要它越小越好（讓 D(G(z)) 接近 1）。合起來就是原論文的 min-max 形式：

```
min_G max_D V(D, G) = E_{x~p_data}[ log D(x) ] + E_{z~p_z}[ log(1 − D(G(z))) ]
```

符號對照：p_z 是 latent 向量的分布，p_data 是真實世界的分布，p_g 是生成器造出來的分布。

</details>

## GAN 的高光時刻：WGAN、Progressive GAN、StyleGAN

### WGAN 與 mode collapse

投影片第 31–32 頁說 WGAN「把 GAN 真正推上高峰」，並點出它解決的問題之一：**mode collapse（崩壞）**。漫畫裡的 G 說：「管他的，反正都生這張，我知道老師會接受！」也就是生成器找到一張騙得過 D 的圖，就不管 z 是什麼都只生那一張。投影片沒有展開 WGAN 的數學，本文也不補。

### Progressive GAN：先畫小圖，再慢慢放大

[Progressive GAN](https://arxiv.org/abs/1710.10196)（Karras 等人，NVIDIA，ICLR 2018）的觀察很樸素：直接生 1024×1024 很難，生低解析度很容易。於是生成器從 4×4 開始學，逐步加層到 8×8、一路到 1024×1024，「從簡單學到精細」，做出了當年讓人驚呆的假明星照。

### StyleGAN：latent 向量能不能「控制」？

接下來的問題是：既然 z 是「想法」，能不能控制生出來的東西？投影片第 39 頁的想像是，latent 向量裡有內容向量，再「加上」一個風格向量。

StyleGAN 的做法比直接相加更有學問（第 40–44 頁）：

1. 先把 512 維的 z 轉成另一個 512 維的 w。
2. 對 w 做一次 affine transformation，得到每個 channel 的縮放與平移參數。
3. 用 **AdaIN** 把這組參數注入生成器的每一層，同時加入雜訊。生成器一樣從 4×4 長到 1024×1024。

投影片的比喻是「w 就像是 prompt」，在每一層不斷提醒 AI 該怎麼畫。換成不同的 w 當內容、另一個 w 當風格，就能混出新的圖。

<details>
<summary>AdaIN 的式子（投影片第 42 頁）</summary>

對第 i 個 channel 的特徵 x_i，先做 normalization，再用從 w 學來的 y = (y_s, y_b) 縮放與平移：

```
AdaIN(x_i, y) = y_s,i · (x_i − μ(x_i)) / σ(x_i) + y_b,i
```

</details>

StyleGAN 的成果就是 [This Person Does Not Exist](https://thispersondoesnotexist.com/) 這類網站，以及後來的 [This X Does Not Exist](https://thisxdoesnotexist.com/) 合集。投影片也提到魏澤人老師把「真人臉變迪士尼風格」整理成 Colab notebook（[bit.ly/colab_toonify](https://bit.ly/colab_toonify)）。

## 條件式生成：Pix2Pix 與 CycleGAN

GAN 不只能從雜訊生圖，也能「把一張圖變成另一張圖」。

- **[Pix2Pix](https://arxiv.org/abs/1611.07004)**（Isola、朱俊彥等人，CVPR 2017）：把衛星圖變地圖、隨手畫的線條變街景。關鍵設計是**輸入與輸出要同時送進鑑別器**，D 判斷的是「這組配對像不像真的」。投影片推薦 Christopher Hesse 依論文做的[線上版](https://affinelayer.com/pixsrv/)，可以畫一隻貓試試。代價是訓練資料必須成對。
- **[CycleGAN](https://arxiv.org/abs/1703.10593)**（朱俊彥等人，ICCV 2017）：資料**不需要配對**。它用兩個生成器（A→B 的 G、B→A 的 F）和兩個鑑別器，最有名的例子是把馬變成斑馬。投影片也放了作者群自己收錄的失敗例。

投影片第 58 頁總結這一段：大家一度認為 GAN 是電腦創作的巔峰，**直到出現 diffusion models**。diffusion 留到 L10–L11。

## 附錄：學 AI 一定要弄懂的 cross entropy

投影片後三分之一（錄影 1:32:10 起）是跟 GAN 本身關係不大、但第三週作業會考的附錄。它的講法很好記，核心是「驚訝指數」。

1. **為什麼不用 MSE**：正確答案 [1, 0, 0]，模型答 [0.7, 0.19, 0.11] 和 [0.7, 0.3, 0]，MSE 分別約 0.14 與 0.18，但兩次對正確類別的信心都是 0.7。cross entropy 兩者都是 0.36，只在意正確答案那一格。
2. **資訊量**：發生機率 p 很低的事，我們會很驚訝，所以用 `−log p` 當「驚訝指數」，正式名稱是資訊量 `I(x) = −log P(x)`。投影片的例子是：在幾乎不下雨的加州說「明天下大雨」，資訊量很大；說「明天是晴天」，跟廢話差不多。
3. **Entropy**：資訊量的平均。只有一個必然發生的事件時 entropy 是 0，所以常被稱為「亂度」。
4. **分類問題的 cross entropy**：正確答案是 one-hot，公式只剩 `−log ŷ_i`。正確答案你還說機率很低，就重重扣分。
5. **KL divergence**：cross entropy 減掉真實分布自己的 entropy。真實分布固定時，兩者只差一個常數，所以一起變大變小；但看「差距的量級」時，KL 清楚得多。

<details>
<summary>公式與投影片的數值例子（第 70–88 頁）</summary>

```
Entropy:        H(P)    = − Σ_i p_i log p_i
Cross entropy:  H(P, Q) = − Σ_i p_i log q_i      （Q = P 時最小，最小值是 H(P)，不一定是 0）
KL divergence:  D_KL(P‖Q) = H(P, Q) − H(P)       （Q = P 時為 0）
```

投影片第 86 頁：正確答案是 soft target y = [0.7, 0.2, 0.1]。

| 模型輸出 | Cross Entropy | KL Divergence |
|---|---|---|
| [0.75, 0.15, 0.1] | 0.81 | 0.01 |
| [0.6, 0.3, 0.1] | 0.83 | 0.03 |

兩次 cross entropy 只差 0.02，KL 卻差了 3 倍。所以投影片的結論是：**需要學 soft target 的時候，就該考慮 KL 散度**，例如知識蒸餾，學生模型要學的不是老師的標準答案，而是老師的「思路」（像是 [0.7, 0.25, 0.05] 這種分布）。

</details>

## 這週的 Demo notebook

1132 學期這一講**沒有對應的 AI-Demo notebook**。主講者的 [AI-Demo repo](https://github.com/yenlung/AI-Demo) 目前的檔案裡沒有 GAN 範例；投影片推薦的可操作資源是上面的 Toonify Colab、Pix2Pix 線上版與 This X Does Not Exist。錄影最後 30 分鐘是助教課，本文沒有逐段核對其內容。

## 作業拆解：第三週（長庚衛星班版本）

以下題目與評分標準出自[長庚衛星班課程頁](https://yangchihyuan.github.io/courses/GenerativeAI2025)，由政大助教訂定評分標準、長庚協同教師公布。政大本校與其他衛星班的評分比重可能不同。

**二選一：**

- **主題一：實際操作一個 GAN。** 找一個 GAN 模型（上課沒講過的也可以），同一主題多生幾張，最多五組輸入／輸出圖，每組合成一張圖；附上模型來源連結並簡介；再比較看看**為什麼現在比較少人用 GAN 生圖**。評分：1–2 組 6 分、3–5 組 7 分、完成比較與延伸內容 8 分，清楚介紹模型來源再加 2 分。
- **主題二：用自己的方式解釋 cross entropy 與 KL divergence。** 可延伸到實際計算、比較兩者效果、程式實驗、使用情境。Colab 或 PDF 繳交。評分重點是說明品質：Colab 只有一串程式、沒有 Markdown 說明是 8 分，有漂亮的 Markdown 說明（或 PDF 是完整報告）才是 10 分；「GPT 水準」或離題只有 2 分。

**共同規則：** 沒有引入老師的「固定 4 行套件」總分 −1（見 [L01](/posts/ai/2026-09-30-nccu-genai-01-why-generative-ai)）；有請生成式 AI 幫忙的地方要特別說明、附上 prompt 與生成結果截圖，否則視為抄襲 AI；認定抄襲除該次 0 分外，總成績再扣 10 分。

**寫主題一「為什麼現在少用 GAN」時**，投影片本身給的線索有兩條：mode collapse 這類訓練問題，以及第 58 頁「直到出現 diffusion models」。再往下的論證要自己找來源，不要只憑印象下結論。

## 自學檢查點

讀完這一講，你應該能不看投影片回答：

1. 為什麼「輸入一句話、輸出一張圖」不能直接當監督式學習訓練？latent 向量 z 解決了什麼？
2. 生成器與鑑別器各自希望 D 的輸出接近多少？學成的時候 D 會輸出什麼？
3. mode collapse 是什麼？用一句話描述。
4. Pix2Pix 和 CycleGAN 最大的差別在哪？
5. 真實分布固定時，為什麼 cross entropy 與 KL divergence 會一起變大變小？

**今晚能做的動作**：打開一個 Colab，把下面幾行貼進去跑，確認你算出的數字跟投影片第 86 頁一樣（用自然對數）。能自己改出第三組輸出、並預測 KL 會變大還是變小，第三週主題二就有了骨架。

```python
import numpy as np

y = np.array([0.7, 0.2, 0.1])          # 正確答案（soft target）
H = -(y * np.log(y)).sum()             # 真實分布的 entropy

for q in ([0.75, 0.15, 0.1], [0.6, 0.3, 0.1]):
    q = np.array(q)
    ce = -(y * np.log(q)).sum()        # cross entropy
    print(q, round(ce, 2), round(ce - H, 2))   # 0.81 0.01 / 0.83 0.03
```

## 延伸閱讀

本篇自己講完整，想往下挖再看這些：

- GAN 的訓練細節與數學：[CMU 11-785 Lecture 24：生成對抗網路](/posts/ai/2026-08-22-cmu-11785-24-gans)
- 自迴歸、VAE、GAN 三者各自在最佳化什麼：[CS231N L13：生成模型（一）](/posts/ai/2026-09-30-cs231n-generative-models-vae-gan)
- cross entropy 與最大概似的關係：[CMU 07-280 Lecture 16：Maximum Likelihood](/posts/ai/2026-08-22-cmu-07280-lecture-16-maximum-likelihood)

系列導覽：[系列總覽](/posts/ai/2026-09-30-nccu-genai-course-overview)｜上一篇 [L02 神經網路的概念](/posts/ai/2026-09-30-nccu-genai-02-neural-networks)｜下一篇 [L04 大型語言模型原來這麼簡單](/posts/ai/2026-09-30-nccu-genai-04-llm-next-token)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。官方課表的講次與影片連結一致，但嵌入播放未能逐支確認，狀態維持不變。
- 2026-10-10：核對影片內容。影片無字幕可用，只對照說明欄章節；確認這支影片不允許嵌入播放（頁內嵌入區塊無法播放，請用原始影片連結）。
- 2026-10-10：這支影片的擁有者停用了嵌入，無法在頁內播放，已移除播放器；來源段保留原始影片連結，狀態改為僅附官方入口或錄影清單。

## 參考資料

- [長庚衛星班課程頁：生成式AI：文字與圖像生成的原理與實務 2025（課表、第三週作業與評分標準）](https://yangchihyuan.github.io/courses/GenerativeAI2025)
- [【生成式 AI】03. 紅極一時的生成對抗網路 GAN（YouTube 錄影，2025-03-04）](https://www.youtube.com/watch?v=akt4A3OJ9h4)
- [1132 生成式 AI 錄影播放清單](https://www.youtube.com/playlist?list=PL-eaXJVCzwbukEFU2k5vu_BlUqgVLsEnv)
- [GenAI03 GAN 生成對抗網路投影片（Google Drive）](https://drive.google.com/file/d/1UqnoeRSgHfNC0o6X5ENeWmLKqZNagskI/view)
- [1132 投影片資料夾入口（yenlung.me/1132GenAI）](https://yenlung.me/1132GenAI)
- [yenlung/AI-Demo（主講者的 Demo notebook repo）](https://github.com/yenlung/AI-Demo)
- [Goodfellow et al. 2014：Generative Adversarial Networks](https://arxiv.org/abs/1406.2661)
- [Karras et al. 2018：Progressive Growing of GANs for Improved Quality, Stability, and Variation](https://arxiv.org/abs/1710.10196)
- [Isola et al. 2017：Image-to-Image Translation with Conditional Adversarial Networks（Pix2Pix）](https://arxiv.org/abs/1611.07004)
- [Zhu et al. 2017：Unpaired Image-to-Image Translation using Cycle-Consistent Adversarial Networks（CycleGAN）](https://arxiv.org/abs/1703.10593)
