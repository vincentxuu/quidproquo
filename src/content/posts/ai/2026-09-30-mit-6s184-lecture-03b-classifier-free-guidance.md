---
title: "MIT 6.S184 L3B：Guidance 與 classifier-free guidance"
date: 2026-09-30
category: ai
type: guide
tags: [ai-course, mit, diffusion-model, flow-matching, generative-ai]
lang: zh-TW
series:
  name: "MIT 6.S184 導讀"
  order: 6
tldr: "把 prompt 當成神經網路的額外輸入，理論上就能從 p_data(x|y) 取樣，但實際生成的圖不夠貼 prompt。第 3B 講用 Bayes 定理把有條件向量場拆成「無條件向量場＋一個分類器梯度」，把分類器那項放大 w 倍就是 classifier guidance；再把分類器換成「有條件減無條件」的差，就得到不用訓練分類器的 CFG：ũ = (1−w)·u(x|∅) + w·u(x|y)。訓練只要以機率 η 把標籤換成空標籤 ∅。代價是每一步要呼叫網路兩次，而且 w>1 之後就不再是從資料分佈取樣。"
description: "MIT 6.S184（IAP 2026）第 3B 講導讀，依講義 §5、Slides 3 後半與錄影：vanilla guidance 與 Remark 25 術語、classifier guidance（eq. 62）、classifier-free guidance 推導與 Remark 26、label dropout 的 CFG 訓練目標（eq. 63–64）、Algorithm 5、Summary 27（eq. 65），以及 Remark 28 如何套到 diffusion model。"
draft: false
glossary:
  - term: "guidance scale"
    aliases: ["引導強度", "CFG scale", "w"]
    definition: "classifier-free guidance 裡放大 prompt 影響的權重 w。w=1 時等於一般的有條件向量場；w>1 會把樣本推向更貼 prompt、但多樣性較低的區域。"
    context: "MIT 6.S184 講義 Summary 27；講義說多數 AI 生成的圖片與影片用 w≥4。"
  - term: "label dropout"
    aliases: ["丟標籤", "條件丟棄"]
    definition: "訓練 CFG 模型時，以機率 η 把樣本的標籤 y 換成代表「沒有條件」的空標籤 ∅，讓同一個網路同時學會有條件與無條件的向量場。"
    context: "MIT 6.S184 講義 eq. (63)–(64) 與 Algorithm 5。"
---

> 🌏 [English version](/posts/ai/2026-09-30-mit-6s184-lecture-03b-classifier-free-guidance-en)

**影片狀態：已附影片；播放未逐支確認。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文依據 [MIT 6.S184](https://diffusion.csail.mit.edu/2026/index.html) IAP 2026 的[講義](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) §5（pp.34–40）、[Slides 3](https://diffusion.csail.mit.edu/2026/docs/20260123_Lecture_03.pdf) 的 Classifier-free guidance 段落，以及[第 3B 講錄影](https://www.youtube.com/watch?v=8oWZ1bHwyRI)（39 分鐘）。公式、Remark、Algorithm 編號都照講義。存取等級 A3：講義、slides、錄影、lab 與官方解答都公開；lab 評分只給 MIT 修課生。2026-09-30 核對。

**系列位置**：上一篇 [Lab 2：親手寫 flow matching 與 score matching](/posts/ai/2026-09-30-mit-6s184-lab-02-flow-score-matching)｜下一篇 [L4：U-Net、DiT 與 latent space](/posts/ai/2026-09-30-mit-6s184-lecture-04-latent-spaces-architectures)｜[系列總覽](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview)

到目前為止，這門課的模型只會「生成一張圖」，你沒辦法指定要什麼圖。第 3B 講補上最後一塊：讓模型聽 prompt 的話。講者 Peter Holderrieth 在錄影裡說，這是這類模型「最關鍵的部分之一」。

這一講的主角是 **classifier-free guidance（CFG）**。它的推導只用到兩樣你已經有的東西：Bayes 定理，以及[第 3A 講](/posts/ai/2026-09-30-mit-6s184-lecture-03a-score-matching)的 Proposition 1（高斯路徑下，向量場和 score 可以互換）。如果 Prop. 1 還不熟，先回去看那篇。

時間慣例和整個系列一樣：t=0 是雜訊，t=1 是資料。

## 課程影片來源

影片連結已與本文採用版本的官方課程頁核對。

```youtube
url: https://www.youtube.com/watch?v=8oWZ1bHwyRI
title: 第 3B 講錄影：Classifier-free Guidance (2026)
```

原始影片：[第 3B 講錄影：Classifier-free Guidance (2026)](https://www.youtube.com/watch?v=8oWZ1bHwyRI)

課程與錄影入口：

- [mit-6s184 — official course materials and recording index](https://diffusion.csail.mit.edu/2026/index.html)

## 先統一用詞：guided 不是 conditional

**Remark 25** 先處理一個撞名問題。前幾講的「conditional」一直指「以單一資料點 z 為條件」，例如條件機率路徑 `p_t(x|z)`、條件向量場 `u_t^target(x|z)`。現在又多了一種條件：prompt y。為了不混淆，講義把「以 y 為條件」一律叫 **guided**。

所以這篇會同時出現三種向量場，記清楚誰是誰：

| 名稱 | 符號 | 意思 |
|---|---|---|
| 條件向量場 | `u_t^target(x\|z)` | 以單一資料點 z 為條件，有公式可算，是訓練目標 |
| unguided 向量場 | `u_t^target(x)` | 不看 prompt 的邊際向量場 |
| guided 向量場 | `u_t^target(x\|y)` | 看 prompt 的邊際向量場，是我們想學的東西 |

## Vanilla guidance：把 prompt 餵進網路，其他照舊

最直接的做法（§5.1）是：把 prompt y 當成網路的第三個輸入，`u_t^θ(x|y)`，其他什麼都不改。y 可以是文字、類別標籤，講義對 y 的空間不設任何限制。

訓練也幾乎不變。唯一差別是資料變成成對的 (z, y)，也就是圖片和它的 prompt，所以 PyTorch 的 dataloader 要一次回傳兩樣東西。loss 仍然是拿網路輸出去回歸條件向量場 `u_t^target(x|z)`，這個目標本身不看 y。取樣時固定一個 y，每一步都把它餵給網路，模擬 ODE 從 t=0 到 t=1。

<details>
<summary>講義 eq. (58)：guided conditional flow matching loss</summary>

```text
L_CFM^guided(θ) = E_{(z,y)~p_data(z,y), t~Unif[0,1], x~p_t(·|z)} ‖u_t^θ(x|y) − u_t^target(x|z)‖²   (58)
```

跟第 2 講 unguided 的 CFM loss（eq. 26）相比，只差在從 `p_data` 取的是 (z, y) 一對，而不只是 z。

錄影裡有學生問：條件向量場 `u_t^target(x|z)` 為什麼不跟著 prompt 變？講者的回答是可以，理論照樣成立，只是實務上沒人這樣做，寫起來也只會增加符號負擔。

</details>

理論上，事情到這裡就結束了：訓練得夠好，這樣就是從 `p_data(x|y)` 取樣。但講義和 slides 都放了同一張圖：用 ImageNet 訓練的模型，prompt 是「corgi dog」，vanilla guidance 生出來的圖不太像柯基，還有瑕疵。講義給了兩個可能原因：模型欠擬合，沒有真的學到邊際向量場；或者資料本身就不乾淨，網路上的圖文配對有很多錯。

所以需要一個辦法，**人為地加強 prompt 的影響**。

## Classifier guidance：把「分類器」那一項放大

先講 CFG 的前身。講義這段只處理高斯機率路徑，才能套用 Prop. 1。

推導分三步，直覺先講：

1. 用 Bayes 定理，guided score `∇log p_t(x|y)` 可以拆成 unguided score `∇log p_t(x)` 加上 `∇log p_t(y|x)`。分母 `p_t(y)` 跟 x 無關，取梯度後消失。
2. 用 Prop. 1 把 score 換回向量場，guided 向量場就等於 **unguided 向量場＋ a_t 倍的 `∇log p_t(y|x)`**。
3. `p_t(y|x)` 是「看一張加了雜訊的圖 x，猜它的標籤 y」，這就是一個分類器。整個式子裡只有這一項跟 prompt 有關。

既然圖不夠貼 prompt，自然的想法就是把跟 prompt 有關的那一項放大 w 倍（w>1），這就是 **classifier guidance**，講義 eq. (62)。

<details>
<summary>講義 eq. (59)–(62)：classifier guidance 的推導</summary>

高斯路徑 `p_t(·|z) = N(α_t z, β_t² I_d)`，`α_0 = β_1 = 0`、`α_1 = β_0 = 1`。由 Prop. 1：

```text
u_t^target(x|y) = a_t ∇log p_t(x|y) + b_t x                                   (59)
p_t(x|y) = p_t(x) p_t(y|x) / p_t(y)                                           (60)
∇log p_t(x|y) = ∇log p_t(x) + ∇log p_t(y|x)          (∇ 對 x 取，∇log p_t(y) = 0) (61)

⇒ u_t^target(x|y) = u_t^target(x) + a_t ∇log p_t(y|x)

ũ_t(x|y) = u_t^target(x) + w a_t ∇log p_t(y|x)       (classifier guidance)     (62)
```

講義特別註明：w ≠ 1 時，`ũ_t(x|y) ≠ u_t^target(x|y)`，也就是說這已經不是「真正的」guided 向量場，而是一個 heuristic。

</details>

分類器怎麼來？用監督式學習訓練一個「看雜訊圖猜標籤」的模型。講義和錄影都指出這條路的兩個麻煩：

- **要多訓練一個網路。** 而且不能拿現成的分類器，因為輸入 x 是加了雜訊的資料，分類器得在雜訊資料上重新訓練。工作量直接翻倍。
- **y 是文字時很難做。** prompt 是一長串文字而不是一個類別，`p_t(y|x)` 很難學，梯度也很難算。

講義說 classifier guidance 後來大致被 CFG 取代，所以只當作推導的跳板。

## Classifier-free guidance：分類器其實不用存在

CFG 的關鍵一步是**把分類器從式子裡消掉**。

回到 Bayes 那條式子，把它反過來用：分類器的梯度 `∇log p_t(y|x)` 等於 guided score 減 unguided score。代回 eq. (62)，再用 Prop. 1 把兩個 score 換成向量場，整理後得到：

**ũ_t(x|y) = (1 − w) · u_t^target(x) + w · u_t^target(x|y)**

式子裡只剩兩個向量場，沒有分類器了。講者在錄影裡的說法是：我們加強了一個分類器的效果，卻從來沒有訓練過它，這個分類器「完全是假想的」。這就是名字裡「classifier-free」的由來。

換個角度讀這條式子：`ũ = u(x|y) + (w−1)·[u(x|y) − u(x)]`。「有 prompt 和沒 prompt 的差」就是 prompt 帶來的方向，CFG 沿著這個方向多走 w−1 倍。w=1 時什麼都沒放大，就是原本的 guided 向量場。

<details>
<summary>講義 §5.2：從 eq. (62) 推到 CFG 的四行</summary>

```text
ũ_t(x|y) = u_t^target(x) + w a_t ∇log p_t(y|x)
         = u_t^target(x) + w a_t (∇log p_t(x|y) − ∇log p_t(x))
         = u_t^target(x) − (w b_t x + w a_t ∇log p_t(x)) + (w b_t x + w a_t ∇log p_t(x|y))
         = (1 − w) u_t^target(x) + w u_t^target(x|y)
```

第三行是同加同減 `w b_t x`，好讓兩個括號各自湊成 Prop. 1 的形式。

**Remark 26**：雖然推導用了高斯路徑，最後這條線性組合對任何機率路徑都成立。w=1 時很容易驗證 `ũ_t(x|y) = u_t^target(x|y)`。高斯路徑只是用來說明「放大一個假想分類器」的直覺。

</details>

### 一個網路同時當兩個

式子裡還是有兩個向量場，看起來要訓練兩個模型。講義的解法是在標籤集合裡多加一個**空標籤 ∅**，代表「不告訴你 prompt」，並令 `u_t^target(x) = u_t^target(x|∅)`。這樣同一個網路餵真的 y 就是 guided，餵 ∅ 就是 unguided。

訓練時的問題是：從資料裡取樣 (z, y)，永遠不會抽到 y=∅。所以要人為製造：設一個超參數 η，**以機率 η 把原本的標籤換成 ∅**。錄影裡講者隨口舉的例子是 20%。模型因此同時學會「照 prompt 做」和「沒有 prompt 時該怎麼做」。

講者強調，這是對既有訓練程序最小的改動，也是 CFG 好用、能規模化的原因：只有一個網路。

<details>
<summary>講義 eq. (63)–(64)、Algorithm 5：CFG 訓練</summary>

```text
L_CFM^CFG(θ) = E_□ ‖u_t^θ(x|y) − u_t^target(x|z)‖²                                  (63)
□ = (z,y) ~ p_data(z,y), t ~ Unif[0,1], x ~ p_t(·|z), 以機率 η 把 y 換成 ∅            (64)
```

Algorithm 5（高斯路徑 `p_t(x|z) = N(x; α_t z, β_t² I_d)`）：

```text
Require: 成對資料 (z, y) ~ p_data、神經網路 u_t^θ
for 每個 mini-batch:
    取一筆資料 (z, y)
    取 t ~ Unif[0,1]
    取 ε ~ N(0, I_d)
    x = α_t z + β_t ε
    以機率 p 丟掉標籤：y ← ∅
    L(θ) = ‖u_t^θ(x|y) − (α̇_t z + β̇_t ε)‖²
    對 L(θ) 做梯度下降
```

注意：Algorithm 5 第 6 行把丟標籤的機率寫成 p，正文和 eq. (64) 寫成 η，指的是同一個超參數。Summary 27 裡的 eq. (66)–(67) 則是 eq. (63)–(64) 的重述。

</details>

### 取樣：換一個向量場，其他照舊

**Summary 27** 把整件事收成一條式子，eq. (65)：

**ũ_t(x|y) = (1 − w) · u_t^target(x|∅) + w · u_t^target(x|y)**，w > 1

取樣和 vanilla guidance 完全一樣：固定 y，從 `X_0 ~ p_init` 出發，模擬 ODE 到 t=1。唯一的差別是每一步用的向量場換成 `ũ_t^θ(x|y)`。Slides 3 的原話是「Sampling with Classifier-Free Guidance simply is the same as before but we use the weighted vector field」。

實作上，每一步要算兩次網路：一次餵 y，一次餵 ∅，再照上式加權。講者在錄影最後特別點出這是 CFG 的缺點：**網路呼叫次數變兩倍，效率減半。**

## CFG 是 heuristic，而且它離開了資料分佈

這一段是整講最值得記住的觀念。

w>1 時，`X_1` 的分佈**不再**是 `p_data(·|y)`。講義說 CFG 主要是靠極好的實驗結果撐起來的 heuristic，而且「幾乎你看到的每一張 AI 生成圖片或影片，都大量依賴 w≥4 的 CFG」。Slides 3 的說法更直接：沒有 CFG，幾乎什麼都跑不動。

錄影裡講者把這件事講得更細：

- **這是整門課第一次「超出」資料分佈。** 之前所有東西都是為了從資料分佈取樣。講者提到，拿現代模型的生成圖去量圖文對齊度，可能比網路上隨機的真實圖文配對還高。網路資料本來就有錯的 caption，模型反而在這件事上做得比資料好。
- **代價是多樣性。** 他把 CFG 描述成把分佈往「最能代表這個條件」的眾數擠。slides 有一張示意圖：guidance 越強，分佈越集中。w 拉太高，圖會過度飽和，除了「最像貓的貓」以外的變化都消失。
- **w<1 也可以**，效果是減弱 prompt。有學生問負方向，講者說大概就是「避開」那個 prompt。

講義和 slides 都拿 Stable Diffusion 3 當例子。Slides 3 寫 SD3 的 guidance scale 約 4.0；講義 §6.3 寫 SD3 取樣用 2.0–5.0 之間的權重。講義 Figure 13 也展示了 MNIST 在 w=1.0、2.0、4.0 的差別，並說 [Lab 3](/posts/ai/2026-09-30-mit-6s184-lab-03-dit-vae-latent-diffusion) 你會自己做出類似的圖。

**怎麼做**：用任何開源 text-to-image 工具時，把 CFG scale 從 1 慢慢調到 10 以上，同一個 prompt、同一個 seed 各生一張。你會親眼看到講義說的兩件事：越高越貼 prompt，也越單調、越飽和。

## 套到 diffusion model

**Remark 28** 只有一句：把 `u_t^θ(x|y)` 換成 `ũ_t^θ(x|y)`，再用第 3A 講的 SDE 取樣就行。換句話說，CFG 改的是向量場，跟你用 ODE 還是 SDE 取樣無關。

## 這一講沒講什麼

- **網路怎麼吃 prompt。** 文字怎麼變成向量、時間 t 怎麼嵌入、網路長什麼樣，是[第 4 講](/posts/ai/2026-09-30-mit-6s184-lecture-04-latent-spaces-architectures)的事。
- **文獻導覽。** Slides 3 在 CFG 之後還有一節「A guide to the diffusion literature」（時間慣例、DDPM／DDIM 等不同觀點），但講者在錄影結尾說這部分延到下週。同一段內容以 Bonus 形式出現在 Slides 4 的最後。

## 讀完這講，你應該能

- 分清楚 conditional（以 z 為條件）與 guided（以 prompt y 為條件）。
- 說出 vanilla guidance 為什麼理論上夠、實務上不夠。
- 用 Bayes 定理和 Prop. 1，三行推出 classifier guidance 的形式。
- 寫出 CFG 的向量場 `(1−w)·u(x|∅) + w·u(x|y)`，並解釋 w=1 時為什麼退回 vanilla guidance。
- 說出 label dropout 在訓練中扮演什麼角色，以及 CFG 取樣每一步要呼叫網路幾次。
- 解釋為什麼 w>1 時，模型不再從資料分佈取樣。

**今晚就能做的事**：讀講義 pp.34–40，只要能把 §5.2 那四行推導自己重寫一遍就夠了。接著打開 [Lab 3](/posts/ai/2026-09-30-mit-6s184-lab-03-dit-vae-latent-diffusion) 的 Part 2，先做 Question 2.2 與 2.3，再用 Sanity Check 2.4 在三群高斯混合上試不同的 w。

## 延伸閱讀

- DDPM 視角的條件生成與 guidance（時間方向與本課相反）：[CMU 11-785 L23：Diffusion](/posts/ai/2026-08-22-cmu-11785-23-diffusion)
- 生成模型的整體介紹：[MIT 6.S191 L4：生成模型](/posts/ai/2026-08-22-mit-6s191-l04-generative-modeling)
- CFG 原始論文：[Ho & Salimans, Classifier-Free Diffusion Guidance](https://arxiv.org/abs/2207.12598)（講義參考文獻 [18]，也是 slides 的圖源）

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [MIT 6.S184 課程網站（IAP 2026）](https://diffusion.csail.mit.edu/2026/index.html) — 第 3-B 講主題：Guided generation、Classifier guidance、Classifier-free guidance
- [Holderrieth & Erives, An Introduction to Flow Matching and Diffusion Models（講義 PDF）](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) — §5：Remark 25、eq. (57)–(67)、Remark 26、Algorithm 5、Summary 27、Figure 11–13、Remark 28；§6.3.1 SD3 的 CFG 權重
- [Slides 3（20260123_Lecture_03.pdf）](https://diffusion.csail.mit.edu/2026/docs/20260123_Lecture_03.pdf) — Section 6: Classifier-free guidance、SD3 guidance scale ≈ 4.0、「CFG does not model the data distribution anymore」
- [第 3B 講錄影：Classifier-free Guidance (2026)](https://www.youtube.com/watch?v=8oWZ1bHwyRI)
- [Slides 4（20260128_Lecture_04_edited.pdf）](https://diffusion.csail.mit.edu/2026/docs/20260128_Lecture_04_edited.pdf) — Bonus: A guide to the diffusion literature
- [Ho & Salimans (2022), Classifier-Free Diffusion Guidance](https://arxiv.org/abs/2207.12598)
- [eje24/iap-diffusion-labs（branch 2026）](https://github.com/eje24/iap-diffusion-labs/tree/2026) — Lab 3 Part 2 的 CFG 實作
