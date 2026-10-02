---
title: "CS234 從示範學：behavioral cloning、DAgger、inverse RL 與 MaxEnt IRL"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, imitation-learning]
lang: zh-TW
series:
  name: "Stanford CS234 導讀"
  order: 10
tldr: "有專家示範、沒有 reward 時，CS234 L7 後半給三條路：直接用監督式學習抄動作（behavioral cloning），發現誤差會隨時間累積後改成邊跑邊問專家（DAgger），或者乾脆反推專家在最佳化什麼 reward（inverse RL）。反推 reward 會碰到「無限多組 reward 都解釋得了示範」的問題，feature matching 與最大熵原則是兩種收斂答案的方式。這一段是下一篇 RLHF 的前身：從示範換成偏好，問題結構幾乎一樣。"
description: "Stanford CS234（Winter 2026）L7 後半與 L8 開頭導讀：reward shaping、behavioral cloning 與 ALVINN、compounding errors 的 εT² 直覺、DAgger、線性特徵的 inverse RL、feature matching（Abbeel & Ng 2004）、MaxEnt IRL（Ziebart et al. 2008）。附 Spring 2024 影片 07、08 的對照時間點。"
draft: false
glossary:
  - term: "behavioral cloning"
    aliases: ["BC", "行為複製"]
    definition: "把模仿學習直接當成監督式學習：用專家示範裡的 (狀態, 動作) 配對訓練一個分類器或迴歸器，當作策略。"
    context: "L7 p.31–34；早期成功例子是 ALVINN（Pomerleau, NIPS 1989）。"
  - term: "compounding errors"
    aliases: ["累積誤差", "distribution mismatch"]
    definition: "模仿來的策略犯一次錯，就會走到專家沒去過的狀態，後面每一步的錯誤機率都變高。L7 的粗略直覺是：每步錯誤率 ε 時，總錯誤從監督式學習的 εT 變成大約 εT²。"
    context: "L7 p.36–38，引用 Ross et al. 2011。"
  - term: "DAgger"
    aliases: ["Dataset Aggregation"]
    definition: "讓目前學到的策略去跑，在它實際走到的狀態上請專家標註正確動作，把這些標註併入資料集後重新訓練，反覆進行。"
    context: "L7 p.39；Ross, Gordon & Bagnell 2011。"
  - term: "MaxEnt IRL"
    aliases: ["Maximum Entropy Inverse RL", "最大熵逆強化學習"]
    definition: "在所有能吻合示範特徵期望的軌跡分布裡，選熵最大的那一個；結果是軌跡機率正比於 exp(wᵀμ_τ)，再用最大概似法學 reward 權重 w。"
    context: "L7 p.51–59；Ziebart et al., AAAI 2008。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs234-imitation-learning-irl-en)

> **版本說明**：本文依據 [CS234](https://web.stanford.edu/class/cs234/) Winter 2026 投影片：[Lecture 7](https://web.stanford.edu/class/cs234/slides/lecture7post.pdf) p.25–62 與 [Lecture 8](https://web.stanford.edu/class/cs234/slides/lecture8post.pdf) p.6–17（頁碼是 PDF 頁碼）。2026 錄影只給修課生；公開錄影是 [Spring 2024 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX) 的第 7、8 支，本文只當聽講補充，時間點依 YouTube 章節標記。存取等級 **A3**（定義見 [全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)）。所有事實都在 2026-09-30 打開上述 PDF 與影片頁核對。

**系列位置**：上一篇 [A2：REINFORCE、baseline 與 PPO 實作](/posts/ai/2026-09-30-cs234-a2-policy-gradient-ppo)｜下一篇 [從人類偏好學：Bradley-Terry、RLHF、DPO](/posts/ai/2026-09-30-cs234-rlhf-dpo)｜[系列總覽](/posts/ai/2026-09-30-cs234-course-overview)

到上一篇為止，reward 一直是題目給的。L7 後半換了一個問題：如果世界上已經有很好的決策者（人類司機、飛行員、醫師），我們能不能直接從他們的示範學，而不先寫出 reward？

投影片用一句話交代動機：讓人類在 RL 演算法做決定時給 reward 訊號，是便宜的監督，但樣本複雜度很高。另一條路是 **imitation learning**。

## 投影片範圍與 2024 影片對照

2026 的檔案邊界跟主題不一致，這裡依主題切：

| 2026 投影片 | 內容 | Spring 2024 影片（章節時間） |
|---|---|---|
| L7 p.26–30 | 從過去決策學、reward shaping、問題設定 | 影片 07 [45:26 起「Introduction to imitation learning」](https://www.youtube.com/watch?v=4ngb0IZTg8I&t=2726s) |
| L7 p.31–39 | behavioral cloning、ALVINN、compounding errors、DAgger | 影片 07 50:03–1:03:48 |
| L7 p.40–50 | reward learning、線性特徵 IRL、feature matching、ambiguity | 影片 07 [1:03:48 起](https://www.youtube.com/watch?v=4ngb0IZTg8I&t=3828s) |
| L7 p.51–62 | MaxEnt IRL、從 IRL 到策略、總結 | 影片 08 [4:28 起](https://www.youtube.com/watch?v=IEbuJtjqtMU&t=268s) 到 52:26 |
| L8 p.6–17 | 「How Can RL Enable Transformative LLM?」、DAgger 與 feature reward 複習、Imitation Learning Summary | 影片 08 開頭 1:11–4:28 有對應的概覽 |

影片 08 在播放清單上的標題是「Offline RL 1」，但 YouTube 章節顯示它的內容是 MaxEnt IRL 與 RLHF 的開頭。2026 投影片裡沒有 offline RL 的專講，本文不替 2026 補寫這部分。

## 為什麼要從示範學

**Reward shaping** 是第一個動機。時間上密集的 reward 能緊緊引導代理人，但要怎麼提供？投影片列了兩條路：手動設計，通常很脆弱；或者透過示範隱含地指定。例子包括模擬的高速公路駕駛（Abbeel & Ng 2004 等）與停車場導航（Abbeel、Dolgov、Ng、Thrun，IROS 2008）。

投影片接著說明 imitation learning 什麼時候有用：專家**示範**想要的行為，比寫出會產生這種行為的 reward、或直接寫出策略都容易的時候。

問題設定（L7 p.30）：

- 已知狀態空間、動作空間、轉移模型 P(s′|s, a)
- **沒有** reward function R
- 有一條或多條專家示範 (s₀, a₀, s₁, a₁, …)，動作來自專家策略 π*

從這裡分出三個問題：

1. **Behavioral cloning**：能不能直接用監督式學習學出專家策略？
2. **Inverse RL**：能不能把 R 找回來？
3. **Apprenticeship learning via inverse RL**：能不能用找回來的 R 產生一個好策略？

## Behavioral cloning：把 RL 變成監督式學習

做法很直接：固定一個策略類別（神經網路、決策樹都行），用 (s₀, a₀), (s₁, a₁), … 當訓練資料去擬合。投影片列了兩個早期成功例子：Pomerleau 在 NIPS 1989 的 **ALVINN**（用影像學開車），以及 Sammut 等人在 ICML 1992 用飛行模擬器學飛。

投影片也強調它在實務上常常很好用：特別是用 BC-RNN 時，並引用 Mandlekar 等人 CoRL 2021 的〈What Matters in Learning from Offline Human Demonstrations for Robot Manipulation〉。結論是「Extensively used in practice」。

### 問題在累積誤差

監督式學習假設 (s, a) 配對是 i.i.d.，忽略了時間結構。如果錯誤在時間上彼此獨立，每步錯誤機率 ε，總錯誤期望大約是 εT。

但在 MDP 裡，訓練與測試的資料分布不一樣：

- 訓練時 sₜ 來自專家策略 π* 走出的分布
- 測試時 sₜ 來自學到的策略 π_θ 走出的分布

一旦犯錯，代理人就走到專家從沒去過的狀態，後面的錯誤機率跟著變高。投影片的粗略直覺是 E[總錯誤] ≲ ε(T + (T−1) + … + 1) ≈ εT²，並註明嚴謹結果要看 [Ross & Bagnell AISTATS 2010](http://www.cs.cmu.edu/~sross1/publications/Ross-AIStats10-paper.pdf) 的 Theorem 2.1。

### DAgger：在自己走到的地方問專家

[Ross、Gordon、Bagnell 2011](https://arxiv.org/abs/1011.0686) 的想法是：沿著 behavior cloning 策略實際走的路徑，向專家要更多動作標註。L7 p.39 的演算法：

1. 資料集 D 從空集合開始，π̂₁ 任選
2. 第 i 輪讓 πᵢ = βᵢπ* + (1−βᵢ)π̂ᵢ，用它跑 T 步
3. 對跑到的每個狀態請專家給 π*(s)，得到 Dᵢ
4. D ← D ∪ Dᵢ，在 D 上訓練出 π̂ᵢ₊₁
5. 最後回傳在驗證集上最好的 π̂ᵢ

投影片說它能得到一個在**自己誘導的狀態分布**下表現好的 stationary deterministic 策略，然後留下一個問題：「Key limitation?」。答案可以從演算法第 3 步想：每一輪都需要專家在場、對任意狀態即時標註。

## Inverse RL：反推專家在最佳化什麼

換個角度：假設專家的策略是最佳的，我們能推出關於 R 的什麼？

L7 p.42–43 的小測直接給答案：**有無限多組 R** 能讓專家策略是最佳的。這個 ambiguity 是整個 IRL 的核心難題。

### 線性特徵 reward

先限縮成 R(s) = wᵀx(s)，x 是狀態特徵、w 是要學的權重。代入價值函數：

V^π(s₀) = E[Σ γᵗ wᵀx(sₜ)] = wᵀ E[Σ γᵗ x(sₜ)] = wᵀμ(π)

μ(π) 是策略 π 下**折扣加權的特徵頻率**。這跟線性價值函數近似很像，差別是這次線性的是 reward。

如果示範來自最佳策略，要找 w，只要找到 w* 使得對所有 π ≠ π*，都有 w*ᵀμ(π*) ≥ w*ᵀμ(π)。

### Feature matching

Abbeel & Ng（2004）的觀察：要保證一個策略 π 至少跟專家一樣好，只要它的折扣特徵期望跟專家的夠接近。精確地說，如果 ‖μ(π) − μ(π*)‖₁ ≤ ε，那麼對所有 ‖w‖∞ ≤ 1，都有 |wᵀμ(π) − wᵀμ(π*)| ≤ ε（用 Hölder 不等式）。

這個結果很漂亮：不需要知道真正的 w，只要特徵對得上，表現就對得上。

但 ambiguity 沒有消失，反而多了一層。L7 p.49 寫：有無限多組 reward 對應同一個最佳策略，也有無限多個隨機策略能吻合特徵計數。該選哪一個？投影片指向兩篇關鍵論文：[Ziebart 等人的 MaxEnt IRL（AAAI 2008）](https://cdn.aaai.org/AAAI/2008/AAAI08-227.pdf) 與 [Ho & Ermon 的 GAIL（NeurIPS 2016）](https://arxiv.org/abs/1606.03476)。本課接著講前者。

## MaxEnt IRL：在所有吻合的分布裡選最不偏心的

仍假設 R(s) = wᵀx(s)。這次特徵計數是**單條軌跡**上的加總 μ_τ = Σ x(sᵢ)（投影片特別提醒這跟前面的定義略有不同），m 條示範的平均是 μ̃。

在確定性 MDP 裡，對線性 reward 來說，一個策略完全由它在 H 步軌跡上的分布決定。所以問題變成：給定 m 條示範，要選哪個軌跡分布？

**最大熵原則**：除了吻合示範的特徵期望，不加任何額外偏好。寫成最佳化問題就是在 Σ P(τ)μ_τ = μ̃、Σ P(τ) = 1 的限制下最大化 −Σ P(τ) log P(τ)。

在線性 reward 下，這等價於最大化示範資料在指數族分布下的概似：

P(τⱼ | w) = exp(wᵀμ_τⱼ) / Z(w)

投影片的解讀是：強烈偏好低成本路徑，而成本相同的路徑機率相同。隨機 MDP 則要再乘上軌跡上各步的轉移機率。

### 學 w

選 w 讓示範的對數概似最大。梯度是一個很乾淨的差：

∇L(w) = μ̃ − Σ_τ P(τ | w)μ_τ = μ̃ − Σ_s D(s)x(s)

也就是**示範的特徵計數減去目前 reward 下學習者的期望特徵計數**，後者可以用狀態造訪頻率 D(s) 表示。L7 p.58 給了計算 D(s) 的演算法：一個 backward pass 算局部動作機率，一個 forward pass 傳遞狀態造訪頻率，最後把各時間步加總。

投影片接著問：「算這個需要知道轉移模型嗎？」L7 p.59 的回答是：原始版本需要轉移模型，或能在世界裡行動、取樣轉移。接著又反問一次：behavior cloning 需要嗎？這一對比值得記住：BC 只要示範，IRL 要示範加上模型或互動。

投影片對 MaxEnt 的評價是「hugely influential」：它給了一個有原則的方式，在許多可能的 reward 裡做選擇。

## 從 IRL 回到策略

學到 reward 之後，通常真正想要的是一個表現等於或超過專家的策略。L7 p.60 的一種做法是：把學到的 reward 接回一般 RL。然後投影片問：能不能更直接地學出想要的策略？這個問題沒有在本講回答，但 GAIL 那一條線就是從這裡出發。

## 總結與銜接

L7 p.61 的總結有三點值得帶走：

- Imitation learning 能大幅減少學到好策略所需的資料
- 把 inverse RL／示範學習跟線上 RL 結合，是仍然活躍的方向
- 很多時候我們只拿得到**偏好配對**（y₁ ≻ y₂），而不是示範。投影片說這就是「dueling bandits」的設定，接下來的課與作業三都會碰到

L8 開頭把這段收成一頁「Imitation Learning Summary」：非常強大、有很多延伸、最大熵 reward learning 是一個重要的想法。在那之前，L8 p.6 先放了一張 ChatGPT 回答「寫個程式示範 RLHF 怎麼運作」的截圖，當作從機器人示範跳到 LLM 的橋。

下一篇就從這裡接：把「專家示範」換成「人類說 A 比 B 好」，IRL 的問題結構幾乎原封不動地變成 RLHF 的 reward modeling。

## 自學怎麼做

1. 先讀 L7 p.26–39，停在 DAgger 的「Key limitation?」，自己寫下答案再往下。
2. 讀 p.40–50 時，拿一張紙把 V^π = wᵀμ(π) 那三行推導抄一次；feature matching 的 Hölder 不等式只要一行。
3. MaxEnt 的部分（p.51–59）配著 2024 影片 08 的「Max entropy IRL math」到「Max entropy IRL algorithm」幾個章節看，影片對梯度推導講得比投影片細。
4. 如果你想動手，CS234 的作業沒有模仿學習題；[CS224R 的 HW1](/posts/ai/2026-09-30-cs224r-hw1-imitation-flow-matching-dagger) 有 BC 與 DAgger 實作。

今晚可以做的一件事：把 BC、DAgger、IRL 三個方法各自「需要什麼」列成一張表：要不要轉移模型、要不要專家一直在場、要不要跟環境互動。這張表就是 L7 所有「Check your understanding」的答案骨架。

## 延伸閱讀

- 同一主題在深度 RL 課裡的版本：[CS224R L2：模仿學習與多峰 policy](/posts/ai/2026-09-30-cs224r-imitation-learning)
- 分布偏移的另一種講法：[Berkeley CS285 L1–4：模仿學習、分布偏移與 RL 基礎](/posts/learning/2026-08-22-berkeley-cs285-imitation-rl-basics)

## 參考資料

- [CS234 Lecture 7 投影片（post 版，Winter 2026）](https://web.stanford.edu/class/cs234/slides/lecture7post.pdf) — p.25–62：reward shaping、BC、compounding errors、DAgger、線性 IRL、feature matching、MaxEnt IRL
- [CS234 Lecture 8 投影片（post 版，Winter 2026）](https://web.stanford.edu/class/cs234/slides/lecture8post.pdf) — p.6–17：LLM 的橋接頁與模仿學習總結
- [CS234 課程首頁（Winter 2026）](https://web.stanford.edu/class/cs234/) — 課表（Week 4「Offline RL, Imitation Learning」）
- [Stanford CS234 Spring 2024 Lecture 7「Policy Search 3」](https://www.youtube.com/watch?v=4ngb0IZTg8I) — 後半是模仿學習、DAgger、IRL（依 YouTube 章節）
- [Stanford CS234 Spring 2024 Lecture 8「Offline RL 1」](https://www.youtube.com/watch?v=IEbuJtjqtMU) — 章節顯示內容是 MaxEnt IRL 與 RLHF 開頭
- [Ross & Bagnell, Efficient Reductions for Imitation Learning (AISTATS 2010)](http://www.cs.cmu.edu/~sross1/publications/Ross-AIStats10-paper.pdf) — 投影片引用的 compounding error 定理
- [Ross, Gordon & Bagnell, A Reduction of Imitation Learning and Structured Prediction to No-Regret Online Learning (2011)](https://arxiv.org/abs/1011.0686) — DAgger
- [Abbeel & Ng, Apprenticeship Learning via Inverse Reinforcement Learning (ICML 2004)](https://ai.stanford.edu/~ang/papers/icml04-apprentice.pdf) — feature matching
- [Ziebart et al., Maximum Entropy Inverse Reinforcement Learning (AAAI 2008)](https://cdn.aaai.org/AAAI/2008/AAAI08-227.pdf) — MaxEnt IRL
- [Ho & Ermon, Generative Adversarial Imitation Learning (NeurIPS 2016)](https://arxiv.org/abs/1606.03476) — 投影片列的另一篇關鍵論文
