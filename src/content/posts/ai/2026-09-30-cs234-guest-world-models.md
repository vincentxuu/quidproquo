---
title: "CS234 客座：Shane Gu〈World of World Modeling〉——世界模型是 model-based RL 裡的那個 model"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, world-model, planning, guest-lecture]
lang: zh-TW
series:
  name: "Stanford CS234 導讀"
  order: 18
tldr: "CS234 Winter 2026 的最後一份客座投影片，由 Google DeepMind 的 Shane Gu 主講，36 頁、沒有公開錄影。主線有三段：先用 Solomonoff induction 說「最好的預測就是找出最短的生成程式」，再把預測分成三個層次；接著把正向模型 F、逆向模型 Π 與 Q 寫在同一組符號裡，說明 shooting 與 direct collocation 兩種規劃方式怎麼各用一種模型，並把 TDM 與 Generalized Decision Transformer 解讀成「換了時間尺度的世界模型」；最後談影片模型能不能成為物理世界的基礎模型。"
description: "Stanford CS234（Winter 2026）客座講者 Shane Gu 的〈World of World Modeling〉投影片導讀：Solomonoff induction、empowerment 與三個層次的預測、forward／inverse models、shooting vs direct collocation、Temporal Difference Models、Generalized Decision Transformer，以及影片模型與符號模型。只有投影片，沒有錄影。"
draft: false
glossary:
  - term: "shooting method"
    aliases: ["shooting", "射擊法"]
    definition: "只對動作序列做最佳化的規劃方法：每換一組動作，就用正向模型把狀態一步步推出來，再算總獎勵。狀態不是變數，而是動作的結果。"
    context: "Shane Gu 投影片 p.20 的第一條式子。"
  - term: "direct collocation"
    aliases: ["直接配置法", "collocation"]
    definition: "把未來每一步的狀態（有時連同動作）都當成最佳化變數，再用動力學當約束，要求相鄰狀態之間「做得到」。可以先放寬約束解任務，再把物理修回來。"
    context: "Shane Gu 投影片 p.20–22、26、28。"
  - term: "Temporal Difference Model (TDM)"
    aliases: ["TDM", "temporal difference models"]
    definition: "Pong 等人（ICLR 2018）提出的 goal-conditioned Q 函數，多了一個剩餘步數 τ：它估的是「τ 步之後離目標狀態還有多遠」，所以同時是價值函數，也是一個跨多步的隱式動力學模型。"
    context: "Shane Gu 投影片 p.25–26。"
    links:
      - label: "Pong et al., Temporal Difference Models (ICLR 2018)"
        url: "https://arxiv.org/abs/1802.09081"
  - term: "empowerment"
    aliases: ["賦能"]
    definition: "代理人的動作 z 與未來狀態 s 之間的互資訊 I(s; z)。值越大，代表你的動作越能決定世界接下來會變成什麼樣。"
    context: "Shane Gu 投影片 p.14 用它的變分下界來定義三個層次的預測。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs234-guest-world-models-en)

**影片狀態：僅附官方入口或錄影清單。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文依據 [CS234](https://web.stanford.edu/class/cs234/) Winter 2026 講義頁上的客座投影片 [ShaneGuCS234_2026.pdf](https://web.stanford.edu/class/cs234/slides/ShaneGuCS234_2026.pdf)（36 頁），2026-09-30 打開逐頁核對。存取等級 **A3**（定義見 [全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)），但這一講有明確缺口：**只有投影片，沒有錄影**。2026 的錄影只放在 Canvas，公開的 [Spring 2024 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX) 裡沒有這場客座。投影片有很多頁只有圖、幾乎沒有文字，所以本文只寫投影片上看得到的東西；講者口頭怎麼串接、怎麼回答問題，我們拿不到。

**系列位置**：上一篇 [價值對齊：對齊誰、對齊什麼](/posts/ai/2026-09-30-cs234-value-alignment-ethics)｜這是系列最後一篇｜[系列總覽](/posts/ai/2026-09-30-cs234-course-overview)

## 課程影片來源

下方提供官方課程與既有錄影入口。尚未核對到可直接嵌入、且對應本文範圍的單支公開影片。

課程與錄影入口：

- [Stanford CS234 Spring 2024 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)
- [官方課程／講次來源](https://web.stanford.edu/class/cs234/)

## 這場客座放在哪裡

[講義頁](https://web.stanford.edu/class/cs234/modules.html) 把這份 PDF 單獨列成一列「RL Guest Lecture」，連結名稱是「Shane Gu: World of World Modeling」，旁邊沒有錄影連結。投影片封面寫的是 **2026 年 2 月 25 日**，講者是 Google DeepMind 的 Senior Staff Research Scientist Shane Gu。

有一個對不起來的地方要先講。依 [課程首頁](https://web.stanford.edu/class/cs234/) 的課表，2 月 25 日落在 Week 8（主題「Exploration」「RL and MCTS」），而課表上寫著「Guest Lecture」的是 Week 9（3 月 2–8 日）。官方沒有說明兩者的關係，本文以投影片封面的日期為準，不替課表補解釋。

為什麼放在系列最後？前面 17 篇大多站在 model-free 那一側：MC、TD、Q-learning、策略梯度、PPO、RLHF。真正用到「模型」的地方只有 [規劃那篇](/posts/ai/2026-09-30-cs234-mdp-planning)（假設已知轉移）與 [MCTS 那篇](/posts/ai/2026-09-30-cs234-mcts-alphazero)（有模擬器可以往前推）。這場客座回頭問一個前面一直沒正面回答的問題：**如果模型要自己學，它該長什麼樣子，又要怎麼拿來規劃？**

## 投影片的結構

講者在 p.8 的大綱分成三段，另外列了一條沒講到的題目：

| 頁碼 | 段落 | 在講什麼 |
|---|---|---|
| p.3–7 | 什麼是世界模型 | 定義之爭與 2015–2021 的代表作 |
| p.9–17 | 什麼是預測 | Solomonoff induction、因果與 OOD 泛化、empowerment 與三個層次 |
| p.18–28 | 正向與逆向世界模型 | shooting vs collocation、TDM、Generalized Decision Transformer |
| p.29–35 | 物理與符號世界模型 | 影片模型當推理器、世界建模的未來 |

大綱最後一行寫「(Forgot) Control as inference: e.g. particle smoothing as optimal control, MCTS vs beam search」，投影片裡沒有對應內容。講者也在 p.8 註明不談 Gemini、Veo 與 Genie。

## 一、「世界模型」這個詞本身就有爭議（p.3–7）

投影片先並列三種說法：

- **Jürgen Schmidhuber**：p.3 列出他 1990 年提出用 RNN 世界模型做規劃，以及 2004–2005 年把世界模型用在實體 AI 與自我修復機器人等主張（這些是投影片上的條列，本文沒有另外查證）。
- **Jitendra Malik**：p.4 引述他的話，認為控制理論 1960 年代就有「dynamics model」這個好詞，「world models」的說法反而讓大家搞不清楚在講哪一種定義。
- **Shane Gu 自己**：p.5 只有一句，「World model is the 'model' in model-based RL.」

接著 p.6–7 用四篇論文示範這條線怎麼走過來：2015 年 [Oh 等人在 Atari 上做 action-conditional 影片預測](https://arxiv.org/abs/1507.08750)、2016 年 [Finn 等人用影片預測學機械手臂的物理互動](https://arxiv.org/abs/1605.07157)、2017 年 DeepMind 的 [Imagination-Augmented Agents](https://arxiv.org/abs/1707.06203)，以及 2021 年的 [DreamerV2（Mastering Atari with Discrete World Models）](https://arxiv.org/abs/2010.02193)。

對 CS234 的讀者來說，p.5 那句定義最好用：它把世界模型接回你已經熟悉的東西。[第 2 篇](/posts/ai/2026-09-30-cs234-mdp-planning) 的 policy iteration 需要的 P(s'|s,a) 就是模型，只是那時候它是給定的。

## 二、什麼叫「預測得好」（p.9–17）

### Solomonoff induction：最好的模型是最短的程式

p.10 把世界畫成一台產生資料的程式 P：程式往前跑是「generation」，從資料倒推程式是「induction」。例子是看到 {1, 3, 5, 7, …} 推出 D<sub>t+1</sub> = D<sub>t</sub> + 2。

p.11 寫下兩條式子：

- 貝氏定理套在程式上：p(P|D) ∝ p(D|P) p(P)
- Occam's razor 當先驗：p(P) ∝ 2<sup>−|P|</sup>，程式越短，先驗機率越高

投影片提到這個想法啟發了 Hernández-Orallo 等人（1998）的 C-Test，以及 [Legg & Hutter（2007）的 Universal Intelligence](https://arxiv.org/abs/0712.3329)。p.12 引 Ilya Sutskever 的話：「The best prediction is inferring the shortest program that reproduces the data.」講者由此推出「預測 = 理解」。

### 因果：理解 = 分布外泛化

p.13 引 [Invariant Risk Minimization（2019）](https://arxiv.org/abs/1907.02893)：資料裡非因果的偶然關聯，會讓模型在分布外失效。講者的結論是：如果資料來自真實因果圖的許多不同介入，就能學到泛化，他把這寫成「Diversity is all you need」，並拿 GPT-3「什麼都拿來預測」當例子。

### Empowerment 與三個層次的預測

p.14 用 s 表示世界的未來、z 表示你的動作，引了 empowerment 的變分下界（出自講者參與的 [Choi 等人，Variational Empowerment as Representation Learning for Goal-Based RL](https://arxiv.org/abs/2106.01404)）：

I(s; z) ≥ E<sub>z∼p(z), s∼p(s|z)</sub>[log q<sub>φ</sub>(s|z) − log p(s)]

然後把「讓模型預測得準」分成三層：

| 層次 | 做法 | 投影片舉的例子 | 資料分布 |
|---|---|---|---|
| Level 1 | 被動地讓模型擬合世界 | 預訓練、監督式與自監督學習、生成模型 | 訓練時不變 |
| Level 2 | 主動地讓模型擬合世界 | 後訓練、DAgger、GAIL、active learning；ICM 等鼓勵新奇、VIME 處理 noisy TV 問題 | 訓練時會變 |
| Level 3 | 主動改變世界，讓世界符合你的模型 | 政治人物、金融公司、X 上的網紅 | — |

p.17 對 Level 3 的評語是「Difficult objective. Nobody has cracked this yet at scale.」最後一頁 p.36 的標題也是「Remember the Level 3」。

這張表可以直接接回本系列：Level 2 的 DAgger 在 [模仿學習那篇](/posts/ai/2026-09-30-cs234-imitation-learning-irl) 出現過，它的重點正是「資料分布會隨你的策略改變」；[bandit 與探索](/posts/ai/2026-09-30-cs234-bandits-regret-ucb) 那三篇在做的，也是主動去收集能減少不確定性的資料。

## 三、正向模型與逆向模型（p.18–28）

這一段是整份投影片跟 CS234 最貼近的部分。

### 同一組符號寫三種模型

p.19 先假設環境是確定性的，然後寫下：

- **正向模型**：s<sub>t+1</sub> = F(s<sub>t</sub>, a<sub>t</sub>)
- **逆向模型一**：a<sub>t</sub> = Π(s<sub>t</sub>, s<sub>t+1</sub>)，給定現在與下一個狀態，告訴你該做什麼動作
- **逆向模型二**：0 = Q(s<sub>t</sub>, a<sub>t</sub>, s<sub>t+1</sub>)，一個「這組轉移是否一致」的判準

三者要互相一致：對所有 s、a，a = Π(s, F(s, a))，且 0 = Q(s, a, F(s, a))。p.24 揭曉符號為什麼這樣選：Π 其實是**以 s<sub>t+1</sub> 為條件的策略**，Q 是**以 s<sub>t+1</sub> 為條件的 Q 函數**。換句話說，你在前面學的策略與 Q 函數，只要把「目標狀態」放進輸入，就變成一種逆向世界模型。

### Shooting vs direct collocation

p.20 把兩種規劃法寫成最佳化問題：

- **Shooting**：只對動作 a<sub>t:t+T</sub> 求 argmax Σ r(s<sub>i</sub>)，狀態由 s<sub>i+1</sub> = F(s<sub>i</sub>, a<sub>i</sub>) 推出來。用的是正向模型。
- **Direct collocation**：直接對狀態 s<sub>t:t+T</sub> 求 argmax Σ r(s<sub>i</sub>)，約束是 −|A| ≤ Π(s<sub>i</sub>, s<sub>i+1</sub>) ≤ |A|（相鄰狀態之間需要的動作要在合法範圍內）；或同時對狀態與動作求解，約束是 Q(s<sub>i</sub>, a<sub>i</sub>, s<sub>i+1</sub>) = 0。用的是逆向模型。

p.21–22 用 Mordatch 等人 2012 年 SIGGRAPH 的 Contact Invariant Optimization 說明 collocation 的好處：規劃時可以先放寬（講者說「hacking」）動力學約束，**「First solve task, then fix physics」**。這讓需要大量接觸的任務幾乎不用 reward shaping，因為放寬動力學本身就提供了合適的 shaping。講者的類比是：shooting 像自回歸的影片擴散模型，collocation 像雙向的影片擴散模型。

p.23 反過來舉例：[Ghasemipour 等人（2022）的積木組裝](https://arxiv.org/abs/2203.13733)說明用 shooting 做靈巧操作很難。

如果你剛讀完 [MCTS 那篇](/posts/ai/2026-09-30-cs234-mcts-alphazero)，可以把 MCTS 想成 shooting 那一側：它拿一個能往前推的模擬器，從當下狀態一路展開動作序列。（這是本文的對照，投影片沒有這樣寫。）

### TDM：價值函數就是換了時間尺度的世界模型

p.25 介紹 [Temporal Difference Models（Pong 等人，ICLR 2018）](https://arxiv.org/abs/1802.09081)。TDM 的獎勵只在剩餘步數 τ = 0 時給，值是下一個狀態離目標 s<sub>g</sub> 的負距離：

r<sub>d</sub>(s<sub>t</sub>, a<sub>t</sub>, s<sub>t+1</sub>, s<sub>g</sub>, τ) = −D(s<sub>t+1</sub>, s<sub>g</sub>) · 1[τ = 0]

Q 函數的遞迴是：τ = 0 時取 −D(s<sub>t+1</sub>, s<sub>g</sub>)；τ ≠ 0 時取 max<sub>a</sub> Q(s<sub>t+1</sub>, a, s<sub>g</sub>, τ − 1)。投影片把重點寫成三條：goal-conditioned 的最佳策略或 Q 函數是一種跨多步的隱式世界模型；訓練時用 hindsight relabeling；**「Value functions are world models with different time scale and representation.」**

p.26 把 TDM 接回 collocation：每隔 K 步取一個狀態當決策變數，約束寫成 Q(s<sub>i</sub>, a<sub>i</sub>, s<sub>i+K</sub>, K − 1) = 0，就得到一種用 goal-conditioned Q 函數做 collocation 的階層式 RL。這正好是 p.20 第二條 collocation 式子的多步版本。

<details>
<summary>為什麼 TDM 的 Q 可以當約束用？</summary>

依 p.25 的定義，Q(s, a, s<sub>g</sub>, τ) 估的是「做了 a、再照最佳策略走 τ 步之後，離 s<sub>g</sub> 的負距離」。它等於 0，代表 s<sub>g</sub> 在 τ+1 步內到得了。所以「Q(s<sub>i</sub>, a<sub>i</sub>, s<sub>i+K</sub>, K−1) = 0」讀成「從 s<sub>i</sub> 出發，K 步內到得了 s<sub>i+K</sub>」，就是 collocation 需要的「相鄰決策點之間做得到」。
</details>

### Generalized Decision Transformer

p.27 介紹講者團隊的 [Generalized Decision Transformer（Furuta、Matsuo、Gu，ICLR 2022）](https://arxiv.org/abs/2111.10364)：

- 訓練：對「任意的未來統計量」做 hindsight behavioral cloning
- 測試：給它一個沒看過的「未來」，要它泛化

投影片的表格把許多方法放在同一個框架下比較，差別在用什麼函數 I<sup>Φ</sup>(τ) 來摘要未來，例如最後狀態、折扣回報或回報分布，Decision Transformer 用的是回報總和。

p.28 標題寫明「untested」：用 GDT 的策略函數去搜尋「到得了的未來」，等於 p.20 第一條 collocation 式子（用 Π 當約束）。這頁還附了講者 2022 年的一則貼文，把三件事並排：World Model 是**因果**預測器，Decision Transformer 是**反因果**預測器，[Hindsight Experience Replay](https://arxiv.org/abs/1707.01495) 是把因果方向翻轉過來的技巧。

## 四、物理與符號世界模型（p.29–35）

最後一段比較像講者的研究觀點，技術細節少：

- **p.30「2022: AGI Year 0」**：「LLMs can reason」代表符號層面的 AGI 可以透過 LLM 達成；ImagenVideo、DreamFusion 代表物理層面的 AGI 可以透過影片模型達成。
- **p.31「2025: Video model as the missing foundation model」**：世界由符號、空間與時間組成。LLM 用符號推理，影片模型在空間與時間中推理，對照組是 Chain-of-Frames 與 Chain-of-Thoughts。
- **p.32**：講者 2022 年的貼文，介紹 [Mind's Eye](https://arxiv.org/abs/2210.05359)：讓語言模型先寫程式、丟進 MuJoCo 模擬，再用模擬結果回答物理問題。
- **p.33**：[Sanchez-Gonzalez 等人（2020）](https://arxiv.org/abs/2002.09405) 把粒子模擬寫成圖上的訊息傳遞。講者認為之後大概不需要 graph net 或 NeRF 這類專門結構，影片模型就夠了。
- **p.34–35「2026+」**：模擬人類（投影片寫「Simile: model 8B people」），以及模擬金融市場（附 [AIA Forecaster 技術報告](https://arxiv.org/abs/2511.07678) 的流程圖）。p.34 右半邊在 PDF 裡是一張沒載入的圖。

這一段的主張大多是講者的判斷，投影片沒有附實驗數據來支持，讀的時候把它當成「一位研究者怎麼看方向」，不要當成已經確定的結論。

## 自學怎麼做

1. **先讀 p.19、p.20、p.24 三頁**，把 F、Π、Q 三條式子抄在一張紙上，旁邊寫「Π = 以下一個狀態為條件的策略」「Q = 以下一個狀態為條件的 Q 函數」。整份投影片的技術核心都繞著這三條式子轉。
2. **拿前面學過的東西對號入座**：policy iteration 用的是已知的 F，MCTS 用可模擬的 F 做 shooting，DQN 學的 Q(s, a) 少了目標狀態那個輸入。問自己：把 s<sub>t+1</sub> 或 s<sub>g</sub> 加進輸入之後，它能拿來做什麼？
3. **讀 TDM 論文裡定義 TDM 的那一節**（p.25 的式子從那裡來），再回頭看 p.26 的 collocation 式子。
4. p.9–17 與 p.29–35 當觀點讀即可，不用推導。

今晚可以做的一件事：在紙上寫出 p.20 的 shooting 與 collocation 兩條式子，各圈出「最佳化變數」是什麼、「模型」出現在目標式還是約束裡。圈完之後，「First solve task, then fix physics」這句話為什麼只有 collocation 做得到，應該就很清楚了。

## 延伸閱讀

- 另一門 Stanford 課怎麼完整講 model-based RL（學模擬器、用它規劃、以及別太相信它）：[CS224R L11：Model-Based RL](/posts/ai/2026-09-30-cs224r-model-based-rl)
- goal-conditioned RL 與 hindsight relabeling 的完整講法：[CS224R L12：多任務與 Goal-Conditioned RL](/posts/ai/2026-09-30-cs224r-multi-task-goal-conditioned-rl)
- 從電腦視覺角度看世界模型與機器人學習：[CS231N 收尾：World Modeling／Robot Learning](/posts/ai/2026-09-30-cs231n-world-models-hcai-final-project)
- 深度 RL 的完整課程路線：[Berkeley CS285 Spring 2026 導讀](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [Shane Gu, World of World Modeling（CS234 Winter 2026 客座投影片，PDF，36 頁）](https://web.stanford.edu/class/cs234/slides/ShaneGuCS234_2026.pdf) — 本文唯一的一手材料
- [CS234 講義頁](https://web.stanford.edu/class/cs234/modules.html) — 「RL Guest Lecture」列，只有投影片連結、沒有錄影
- [CS234 課程首頁（Winter 2026）](https://web.stanford.edu/class/cs234/) — 課表（Week 8、Week 9 的排程）與「影片只給修課生」的說明
- [Stanford CS234 Spring 2024 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX) — 公開錄影，沒有這場客座
- [Pong et al., Temporal Difference Models: Model-Free Deep RL for Model-Based Control (ICLR 2018)](https://arxiv.org/abs/1802.09081) — p.25–26
- [Furuta, Matsuo & Gu, Generalized Decision Transformer for Offline Hindsight Information Matching (ICLR 2022)](https://arxiv.org/abs/2111.10364) — p.27–28
- [Choi et al., Variational Empowerment as Representation Learning for Goal-Based Reinforcement Learning](https://arxiv.org/abs/2106.01404) — p.14 的 empowerment 下界
- [Legg & Hutter, Universal Intelligence: A Definition of Machine Intelligence](https://arxiv.org/abs/0712.3329) — p.11
- [Arjovsky et al., Invariant Risk Minimization](https://arxiv.org/abs/1907.02893) — p.13
- [Oh et al., Action-Conditional Video Prediction using Deep Networks in Atari Games](https://arxiv.org/abs/1507.08750)、[Finn et al., Unsupervised Learning for Physical Interaction through Video Prediction](https://arxiv.org/abs/1605.07157)、[Weber et al., Imagination-Augmented Agents](https://arxiv.org/abs/1707.06203)、[Hafner et al., Mastering Atari with Discrete World Models](https://arxiv.org/abs/2010.02193) — p.6–7 的四篇代表作
- [Ghasemipour et al., Blocks Assemble! Learning to Assemble with Large-Scale Structured Reinforcement Learning](https://arxiv.org/abs/2203.13733) — p.23
- [Andrychowicz et al., Hindsight Experience Replay](https://arxiv.org/abs/1707.01495) — p.28 貼文提到的技巧
- [Liu et al., Mind's Eye: Grounded Language Model Reasoning through Simulation](https://arxiv.org/abs/2210.05359) — p.32
- [Sanchez-Gonzalez et al., Learning to Simulate Complex Physics with Graph Networks](https://arxiv.org/abs/2002.09405) — p.33
- [AIA Forecaster: Technical Report](https://arxiv.org/abs/2511.07678) — p.35
