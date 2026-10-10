---
title: "CS224R L3：Policy Gradients——不知道環境怎麼運作，也能直接對 policy 求梯度"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, ai-course, stanford, reinforcement-learning, policy-gradient]
lang: zh-TW
series:
  name: "Stanford CS224R 導讀"
  order: 4
tldr: "Policy gradient 是 CS224R 的第一個線上 RL 演算法。它的梯度長得跟模仿學習的梯度幾乎一樣，只是每條軌跡多乘上一個獎勵權重：好結果的動作變得更可能，壞結果的動作變得更不可能。原始版本雜訊很大，L3 用兩招降低變異：只算「未來」的獎勵（causality）和減掉平均獎勵（baseline）。它也是 on-policy 的，每走一步梯度就要重新收資料；用 importance sampling 加上 KL 限制，才能在同一批資料上多走幾步。"
description: "Stanford CS224R Deep Reinforcement Learning（Spring 2026）第 3 講 Policy Gradients 導讀：從 RL 目標出發推導 policy gradient 與 REINFORCE、它和模仿學習梯度的關係、用人形機器人和摺外套的例子看它為什麼雜訊大、causality 與 baseline 怎麼降低變異、如何用 surrogate objective 實作，以及 importance sampling 與 KL 限制怎麼讓它部分 off-policy。"
draft: false
glossary:
  - term: "REINFORCE"
    aliases: ["vanilla policy gradient"]
    definition: "最基本的 policy gradient 演算法：用目前的 policy 取樣一批軌跡，以每條軌跡的總獎勵加權 log 機率的梯度，更新一步後重新取樣。"
    context: "CS224R L3 投影片第 11 頁的「Full algorithm」。"
  - term: "reward to go"
    aliases: ["未來獎勵總和"]
    definition: "從時間 t 開始到軌跡結束的獎勵總和。用它取代整條軌跡的總獎勵，是利用「現在的動作影響不了過去的獎勵」來降低梯度變異。"
    context: "L3 在 causality 一段引入，L4 再用價值函數估計它。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs224r-policy-gradients-en)

> **來源年份**：本文依據 [CS224R](https://cs224r.stanford.edu/) Spring 2026 第 3 講投影片 [03_cs224r_policy_gradients_2026.pdf](https://cs224r.stanford.edu/slides/03_cs224r_policy_gradients_2026.pdf)（29 頁，2026-04-08 上課）。2026 錄影只放在 Canvas，校外看不到；配套影片是 [Spring 2025 L3 錄影](https://www.youtube.com/watch?v=KCAOXd4IO9o)（補充）。我比對過 2025 與 2026 版投影片：講次大綱相同，2026 版多了一張第 8 頁的「梯度搶先看」，其餘差在日期與小改動。影片內容本文沒有逐段引用。

這是 [Stanford CS224R 導讀](/posts/ai/2026-09-30-cs224r-course-overview)系列第 4 篇。前一篇是 [HW1](/posts/ai/2026-09-30-cs224r-hw1-imitation-flow-matching-dagger)，到那裡為止都還是監督學習：有專家示範，照著學。從這一講開始，agent 要從自己的嘗試裡學。

投影片第 5 頁列的學習目標只有兩個：理解 policy gradient 背後的關鍵直覺，以及知道怎麼實作、什麼時候該用它。同一頁也註明，這是 default project 的基礎之一。

這一篇的數學負荷比前面重。正文只放直覺和結論，推導收在折疊區。

## 課程影片來源

本文以 Spring 2026 教材為準；下列 Spring 2025 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=KCAOXd4IO9o
title: Spring 2025 Lecture 3: Policy Gradients（YouTube，Stanford Online）
```

原始影片：[Spring 2025 Lecture 3: Policy Gradients（YouTube，Stanford Online）](https://www.youtube.com/watch?v=KCAOXd4IO9o)

課程與錄影入口：

- [CS224R Spring 2025 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rPwxE0ONYRa_itZFdaKCylL)
- [官方課程／講次來源](https://cs224r.stanford.edu/)

## 場景：模仿學習的天花板

投影片第 4 頁先總結模仿學習的優缺點：簡單、可擴展、能學出不錯的行為；但**超越不了示範者**，也沒辦法從練習中進步。

同一頁定義了兩個詞，後面會一直用到：

- **offline**：只用現成的資料集，不從學到的 policy 收新資料。
- **online**：會用學到的 policy 收新資料。

線上 RL 的流程（第 6 頁）是一個迴圈：先初始化 policy（隨機、用模仿學習、或用人工規則都可以），然後重複「跑 policy 收一批資料 → 用這批資料改進 policy」。

問題是第二步：沒有專家告訴你正確動作，只有一個獎勵分數，要怎麼算梯度？

## 直覺：模仿學習的梯度，乘上獎勵

第 8 頁和第 12 頁是這一講最重要的兩張投影片。它們把 policy gradient 和模仿學習的梯度並排：

- 模仿學習：對示範資料裡每個動作，把它的 log 機率往上推。
- Policy gradient：對自己跑出來的每條軌跡裡的每個動作，把它的 log 機率往上推，**但推的力道乘上那條軌跡拿到的總獎勵**。

投影片的說法是「imitation gradient, but weighted by reward」。直覺是：

- 高獎勵軌跡裡做過的動作，提高它的機率。
- 負獎勵軌跡裡做過的動作，降低它的機率。

也就是「多做好事，少做壞事」。第 20 頁說它把「試誤學習」形式化了。

這個式子裡**沒有環境的轉移機率**。你不需要知道鳥或機器人的物理模型，只需要能跑、能看到獎勵。

<details>
<summary>推導：從 RL 目標到 policy gradient（投影片第 3、9–11 頁）</summary>

RL 目標是最大化期望總獎勵：

$$J(\theta) = \mathbb{E}_{\tau\sim p_\theta(\tau)}\left[\sum_t r(s_t, a_t)\right],\quad p_\theta(\tau) = p(s_1)\prod_t \pi_\theta(a_t\mid s_t)\, p(s_{t+1}\mid s_t, a_t)$$

關鍵是一個恆等式（log-derivative trick）：$p_\theta(\tau)\nabla_\theta \log p_\theta(\tau) = \nabla_\theta p_\theta(\tau)$。用它可以把梯度寫成期望值：

$$\nabla_\theta J(\theta) = \mathbb{E}_{\tau\sim p_\theta(\tau)}\left[\nabla_\theta \log p_\theta(\tau)\, r(\tau)\right]$$

展開 $\log p_\theta(\tau)$，初始狀態分佈和轉移機率都跟 $\theta$ 無關，求梯度時消掉，只剩 policy 那一項：

$$\nabla_\theta J(\theta) = \mathbb{E}_{\tau\sim p_\theta(\tau)}\left[\left(\sum_{t=1}^T \nabla_\theta \log\pi_\theta(a_t\mid s_t)\right)\left(\sum_{t=1}^T r(s_t, a_t)\right)\right]$$

用 N 條取樣軌跡的平均來估計，就得到第 11 頁的 **REINFORCE**（vanilla policy gradient）：

1. 用 $\pi_\theta$ 取樣 $\{\tau^i\}$
2. $\nabla_\theta J(\theta) \approx \sum_i \left(\sum_t \nabla_\theta\log\pi_\theta(a_t^i\mid s_t^i)\right)\left(\sum_t r(s_t^i, a_t^i)\right)$
3. $\theta \leftarrow \theta + \alpha\nabla_\theta J(\theta)$

第 7、9、10、11 頁標注改編自 Sergey Levine 的投影片。

</details>

## 機制一：為什麼原始版本雜訊很大

第 13 頁和第 15 頁用人形機器人在模擬器裡學走路當例子，獎勵是「往前的速度」，往後退就是負的。

**例子一**（第 13 頁）：一批軌跡裡有「往後跌倒」「往前一小步然後往後跌」「往前跌倒」「站著不動」「往後一大步然後往前一小步」。投影片的答案是：梯度會鼓勵 policy **往前跌**，而不是往前踏步。「往前一小步然後往後跌」這條軌跡的總獎勵不高，連那一小步也一起被壓低了。

**例子二**（第 15 頁）：軌跡是「往前跌」「慢慢往前踉蹌」「穩定往前走」「往前跑」。四條的獎勵都是正的，所以梯度會把四種行為**全部**往上推，包括跌倒和踉蹌。投影片標注：policy gradient 雜訊大、對獎勵的尺度很敏感。

兩個例子點出兩個不同的問題，L3 各給一招。

### 招式一：causality，只看未來的獎勵

第 14 頁的觀察：時間 t 的動作影響不了 t 之前的獎勵。所以每個動作只該用「從 t 開始往後的獎勵總和」（reward to go）來加權，不該連它之前發生的事一起算。

回到例子一：「往後一大步然後往前一小步」這條軌跡，總獎勵是負的。但後面那一小步本身帶來的是正獎勵，用 reward to go 加權後，它就不會被一起壓低。

### 招式二：baseline，減掉平均

第 16–17 頁處理例子二。把每條軌跡的獎勵減掉一個常數 b，最常用的是這批軌跡的平均獎勵。這樣低於平均的行為會拿到**負**的梯度：「往前跌」雖然獎勵是正的，但比平均差，機率就會被壓低。

第 17 頁接著問：可以這樣做嗎？答案是可以。減掉常數 baseline 不會改變梯度的期望值，也就是**不偏**，而且能降低變異。投影片的結論是「平均獎勵是很不錯的 baseline」。

第 18 頁再用摺外套當例子（摺得整齊得 1 分、有皺摺得 0.5、沒摺好得 0），讓學生思考加了 baseline 之後梯度會怎麼推。

<details>
<summary>為什麼 baseline 不偏（第 17 頁）</summary>

$$\mathbb{E}[\nabla_\theta\log p_\theta(\tau)\, b] = \int p_\theta(\tau)\nabla_\theta\log p_\theta(\tau)\, b\, d\tau = \int \nabla_\theta p_\theta(\tau)\, b\, d\tau = b\,\nabla_\theta\int p_\theta(\tau)\,d\tau = b\,\nabla_\theta 1 = 0$$

加上 causality 和 baseline 後的梯度（第 19 頁）：

$$\nabla_\theta J(\theta) \approx \frac{1}{N}\sum_{i=1}^N\sum_{t=1}^T \nabla_\theta\log\pi_\theta(a_{i,t}\mid s_{i,t})\left(\left(\sum_{t'=t}^T r(s_{i,t'}, a_{i,t'})\right) - b\right)$$

</details>

## 機制二：怎麼實作

第 19 頁指出一個實務問題：如果對每個 $(i, t)$ 分別算 $\nabla_\theta\log\pi_\theta$，要做 N×T 次反向傳播，太慢。

解法是寫一個 **surrogate objective**：把上面式子裡的梯度符號拿掉，得到一個「以 reward to go 減 baseline 加權的 log likelihood」，讓自動微分一次算完。投影片稱它為 weighted maximum likelihood，並註明：離散動作的 policy 就是加權的 cross-entropy，高斯 policy 就是加權的平方誤差。

換句話說，程式上它跟模仿學習的 loss 幾乎一樣，只多了一個權重。這也是第 12 頁把兩者並排的原因。

第 20 頁的小結：log gradient trick、用未來獎勵加權、減 baseline；但**即使用了這些技巧，梯度還是很吵**。

## 機制三：on-policy 的代價與 off-policy 版本

第 21 頁指出另一個問題：梯度公式假設樣本來自**目前**的 policy $\pi_\theta$。但演算法的第 3 步一更新 θ，手上的資料就不再是新 policy 產生的了，所以**每走一步梯度都要重新收資料**。

投影片在這裡定義了線上 RL 演算法的一個屬性：

- **on-policy**：更新只用目前 policy 的資料。
- **off-policy**：更新可以重用其他、過去的 policy 的資料。

Vanilla policy gradient 是 on-policy 的。

### Importance sampling

想用舊 policy $\pi_\theta$ 的樣本去更新新 policy $\pi_{\theta'}$，可以用 importance sampling（第 22–24 頁）：用機率比值重新加權樣本。第 22 頁的提醒是：proposal 分佈在目標分佈機率高的地方必須有非零的機率。

問題是整條軌跡的比值是 T 個比值相乘，T 一大就會變得極小或極大。改成對每個時間步分開加權比較穩，但需要狀態分佈的比值，這很難量。投影片說實務上常把它近似成 1，得到第 24 頁的「常見最終形式」：每一項只乘上該步動作的機率比 $\pi_{\theta'}(a\mid s)/\pi_\theta(a\mid s)$。

有了這個式子，就能在**同一批資料上走多步梯度**（第 25 頁）。

### KL 限制

但如果 policy 在收新資料前變了很多呢？第 25–26 頁的回答：資料就不再反映新 policy 會走到的狀態，梯度估計也跟著變差。

解法是限制每次更新不要離舊 policy 太遠。投影片給的一個常見選擇是：

$$\mathbb{E}_{s\sim\pi_\theta}\left[D_{KL}\left(\pi_{\theta'}(\cdot\mid s)\,\|\,\pi_\theta(\cdot\mid s)\right)\right] \le \delta$$

L4 投影片第 27 頁會再提到這個 KL 限制，並說它會在 LLM 偏好最佳化裡再次出現。

## 連回整門課

第 27 頁的複習整理成四點：

- 用 policy gradient 做線上 RL：on-policy，直接對 RL 目標微分。
- 用 baseline 和 causality 降低梯度變異。
- 推導出 off-policy 版本：importance sampling 加 KL 限制，同一批資料可以走多步梯度。
- 直覺：多做高獎勵的事、少做低獎勵的事。梯度仍然很吵，**適合大 batch 和密集獎勵**。

最後一點是判斷「什麼時候用」的線索。如果獎勵很稀疏、或一次只能收少量資料，policy gradient 會很辛苦。第 29 頁預告下一講的 actor-critic 會直接建立在 policy gradient 上，也是 PPO 這類熱門演算法的基礎。

**今晚可以做的事**：打開投影片第 12 頁和第 19 頁並排看。把你在 HW1 寫過的 BC loss 找出來，想一想：要把它改成 policy gradient 的 surrogate objective，需要多加哪一個量？這一個量從哪裡來？

## 延伸閱讀

- [Williams 1992：Simple statistical gradient-following algorithms for connectionist reinforcement learning](https://link.springer.com/article/10.1007/BF00992696)：課表列的指定閱讀，提出 REINFORCE 這一類演算法的論文
- [Berkeley CS285：policy 與 value 方法](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods)：同一套推導在另一門課的講法
- [CME295：LLM 的 RL](/posts/ai/2026-09-29-cme295-rl-with-llms)、[CS336：RLVR](/posts/ai/2026-08-22-cs336-rlvr)：policy gradient 用在語言模型上的樣子

**系列導覽**：上一篇 [HW1：Flappy Bird 上的 BC、Flow Matching 與 DAgger](/posts/ai/2026-09-30-cs224r-hw1-imitation-flow-matching-dagger)｜下一篇 [L4：Actor-Critic 與價值估計](/posts/ai/2026-09-30-cs224r-actor-critic)｜[系列總覽](/posts/ai/2026-09-30-cs224r-course-overview)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [CS224R: Deep Reinforcement Learning（Spring 2026 課程首頁與課表）](https://cs224r.stanford.edu/)
- [L3 Policy Gradients 投影片（2026）](https://cs224r.stanford.edu/slides/03_cs224r_policy_gradients_2026.pdf)
- [L3 Policy Gradients 投影片（Spring 2025 封存）](https://cs224r.stanford.edu/spring_2025/slides/03_cs224r_policy_gradients_2025.pdf)
- [Spring 2025 Lecture 3: Policy Gradients（YouTube，Stanford Online）](https://www.youtube.com/watch?v=KCAOXd4IO9o)
- [CS224R Spring 2025 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rPwxE0ONYRa_itZFdaKCylL)
- [Williams 1992，Machine Learning 8](https://link.springer.com/article/10.1007/BF00992696)
