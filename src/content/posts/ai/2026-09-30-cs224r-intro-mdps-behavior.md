---
title: "CS224R L1：把做決策寫成 RL 問題"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, ai-course, stanford, reinforcement-learning, mdp]
lang: zh-TW
series:
  name: "Stanford CS224R 導讀"
  order: 1
tldr: "CS224R Spring 2026 第一講做三件事：交代課務、說明為什麼要學 deep RL、把「行為」寫成可以學的東西。核心是一組定義：state、action、trajectory、reward、policy，以及「最大化期望總獎勵」這個目標。最後用一個例子收尾：拿 ℓ2 回歸去模仿一群要切換車道、一群要直行的駕駛，policy 會學到兩者的平均值，一個沒人示範過的半切換動作。這個問題是 L2 的起點。"
description: "Stanford CS224R（Spring 2026）第一講導讀：依官方 01_cs224r_intro_2026 投影片整理課程目標、deep RL 和監督學習的差別、MDP 與 POMDP 的定義、policy 與期望獎勵目標、五類 RL 演算法的取捨，以及模仿學習 version 0 為什麼會學到平均值。配套影片為 Spring 2025 L1（補充）。"
draft: false
glossary:
  - term: "MDP"
    aliases: ["Markov decision process", "馬可夫決策過程"]
    definition: "描述序列決策的數學框架：狀態、動作、獎勵函數、初始狀態分佈，以及只依賴目前狀態和動作的轉移機率。"
    context: "CS224R L1 用 state、action、reward 和 dynamics 定義它；觀測不完整時改用 POMDP。"
  - term: "policy"
    aliases: ["策略", "π"]
    definition: "根據狀態或觀測選擇動作的規則，通常寫成條件分佈 π(a | s)；RL 要學的就是它。"
    context: "CS224R 用神經網路參數化 policy，寫成 πθ(a | s)。"
  - term: "Markov property"
    aliases: ["馬可夫性質"]
    definition: "下一個狀態只取決於目前的狀態和動作，和更早的歷史無關。"
    context: "觀測（observation）通常不滿足這個性質，所以 policy 需要記憶。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs224r-intro-mdps-behavior-en)

**影片狀態：僅附相關補充影片；原講次錄影未確認。** [影片來源與說明](#課程影片來源)

> **來源年份**：依據 Spring 2026 的 [01_cs224r_intro_2026 投影片](https://cs224r.stanford.edu/slides/01_cs224r_intro_2026.pdf)（2026-04-01）。配套影片是 [Spring 2025 L1 錄影（補充）](https://www.youtube.com/watch?v=EvHRQhMX7_w)，標題相同，但投影片已改成 2026 版，細節可能不同。本文是 [Stanford CS224R 導讀](/posts/ai/2026-09-30-cs224r-course-overview)系列的第 1 篇。

[CS224R](https://cs224r.stanford.edu/) 的第一講在課表上叫「Course Intro + Start of MDPs & Imitation」。投影片把當天的學習目標寫成三條：怎麼表示行為、怎麼把問題寫成強化學習問題、模仿學習的基礎。

課務部分（評分、late days、AI 工具政策）[系列總覽](/posts/ai/2026-09-30-cs224r-course-overview)已經整理過，這裡只講內容。

## 課程影片來源

本文以 Spring 2026 教材為準；下列 Spring 2025 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=EvHRQhMX7_w
title: Spring 2025 Lecture 1: Class Intro（YouTube，補充）
```

原始影片：[Spring 2025 Lecture 1: Class Intro（YouTube，補充）](https://www.youtube.com/watch?v=EvHRQhMX7_w)

課程與錄影入口：

- [官方課程／講次來源](https://cs224r.stanford.edu/)

Spring 2026 當季講次錄影放在需 Stanford 登入的 Canvas／Panopto；公開 YouTube 播放清單是 Spring 2025。 查核日期：2026-10-10。

## 先補一段：MDP 是什麼

官方先修寫的是「假設你熟悉 RL 基礎」，投影片也說 MDP 會快速帶過。如果你從沒碰過，先抓住這個直覺就夠了：

> 一個 agent 看到世界的**狀態**，選一個**動作**，世界因此變到下一個狀態，並給出一個**獎勵**。這樣一直重複。

MDP 就是把這個循環寫成數學。它最重要的假設是「下一步只看現在」：只要知道目前的狀態和動作，就能決定下一個狀態的機率分佈，不需要知道更早發生過什麼。

想要比較完整的背景，官網推薦兩個入口：[Sutton & Barto](http://incompleteideas.net/book/RLbook2020.pdf) 第 3–4 章，或 CS221 的 MDP 與 RL 模組。站內的 [CS221 L7：MDPs I](/posts/ai/2026-08-22-stanford-cs221-lecture-07-mdp-value-iteration) 和 [L8：MDPs II](/posts/ai/2026-08-22-stanford-cs221-lecture-08-reinforcement-learning-q-learning) 講的就是這一塊。

## 什麼叫 deep RL

投影片的定義分兩半。問題是**序列決策問題**：系統要根據一連串資訊做很多次決定，觀察、行動、再觀察、再行動。解法包括模仿學習、offline 與 online RL、LLM 的 RL、model-free 與 model-based RL、多任務與 meta RL、機器人的 RL。「deep」指的是重點放在能擴展到深度神經網路的方法。

它和監督學習的差別，投影片用一張對照表講完：

| | 監督學習 | 強化學習 |
|---|---|---|
| 學什麼 | 給定標註資料 {(xᵢ, yᵢ)}，學 f(x) ≈ y | 學行為 π(a \| s) |
| 回饋 | 直接告訴你該輸出什麼 | 從經驗學，回饋是間接的 |
| 資料分佈 | 輸入 x 是 i.i.d. | 不是 i.i.d.：動作會影響之後看到的觀測 |

最後一列是整門課反覆回來的地方。在 RL 裡，模型的輸出會改變它接下來看到的資料。L2 的 compounding errors、L7 的 offline RL，都是從這裡長出來的問題。

投影片列的「行為」例子有馬達控制、聊天機器人、下棋打遊戲、開車和 web agent。

## 為什麼要學

投影片列了四個理由：

1. **超越 (x, y) 監督。** 模型的預測會產生後果；沒有直接監督時，RL 可以從任何目標學，包括不可微分、不只是準確率的目標。會跟人互動的系統（chatbot、推薦系統），以及部署後會影響未來觀測的系統（投影片叫 feedback loops），都屬於這類。
2. **已經廣泛部署。** 例子有四足機器人、機器人操作、AlphaGo 對李世乭的「第 37 手」、交通控制、讓影像生成模型更聽 prompt，以及 Google 用在 TPU 晶片設計的 RL。投影片特別寫：幾乎所有現代語言模型的 post-training 都用了某種 RL，進階推理尤其如此。
3. **從經驗學習像是智慧的基本能力。** 例子是 Levine、Finn 等人 2015–2016 年的機器人研究：機器人靠練習變得更好，先是「閉著眼睛」，後來加上視覺。
4. **還有很多開放問題。**

第四點的投影片寫得最有用，因為它把研究問題一一對到後面的講次：

| 研究問題 | 對應講次 |
|---|---|
| 機器人怎麼知道什麼對任務是好是壞？ | Reward learning（L8） |
| 怎麼利用大量多樣的資料集？ | Offline RL（L7） |
| 怎麼從其他任務、目標遷移？ | 多任務 RL、meta-RL（L12–L13） |
| 能不能學煮一頓飯這種長 horizon 任務？ | 階層式方法、reasoning（L15、L10） |
| 機器人能不能完全自主練習？ | 機器人的 RL（L16–L17） |

中間還有一張標題叫「Behind the scenes of RL」的照片：機器人在練習，畫面後方用箭頭標出一個人：Yevgen，註解寫著「Yevgen 做的工比機器人還多」，用這種方式收集大量資料不實際。這張圖解釋了為什麼後面要講 offline RL 和自主練習。

## 把經驗寫成資料

這是這一講的主體。投影片先給四個定義：

- **state sₜ**：時間 t 時世界的狀態
- **action aₜ**：時間 t 做的決定
- **trajectory τ**：狀態和動作的序列 (s₁, a₁, …, s_T, a_T)，長度可以只有 1
- **reward r(s, a)**：這組 s、a 有多好

再加上未知的轉移 p(sₜ₊₁ | sₜ, aₜ)。下一個狀態只由目前的狀態和動作（加上隨機性）決定，和 sₜ₋₁ 無關，這就是 Markov property。

**看不到完整狀態時怎麼辦？** 投影片給兩個選項：把感測器讀數當近似（例如視野良好的相機影像通常夠接近），或明確建模部分可觀測性，引入 observation oₜ。代價是觀測不滿足 Markov property：把狀態積分掉之後，下一個觀測會依賴所有過去的觀測，也就是 p(oₜ₊₁ | o₁:ₜ, a₁:ₜ) ≠ p(oₜ₊₁ | oₜ, aₜ)。

投影片用兩個例子把定義落地：

| | 機器人掛毛巾 | 聊天機器人 |
|---|---|---|
| 狀態／觀測 | state：RGB 影像、關節位置和速度 | observation：使用者最新的訊息 |
| 動作 | 下一個關節位置指令 | chatbot 的下一則訊息 |
| trajectory | 10 秒、20 Hz，T = 200 | 長度不定的對話紀錄 |
| reward | 毛巾掛在鉤子上給 1，否則 0 | 使用者按讚給 1、按倒讚給 -10，沒回饋給 0 |

課堂上接著是 think-pair-share：自己定義自動駕駛、web agent 或撲克玩家的 state、action、trajectory 和 reward。這個練習值得真的做一次，下面「今晚可以做的事」會用到。

## 用神經網路表示行為

**policy** πθ(a | s) 是一個神經網路：輸入狀態，輸出動作的分佈。跑起來的流程是：觀察 sₜ，從 πθ(· | sₜ) 取樣一個動作 aₜ，世界依未知的 dynamics 給出 sₜ₊₁。重複下去得到的 trajectory，也叫 roll-out 或 episode。

如果只有觀測 o，投影片的建議是給 policy 記憶：πθ(aₜ | oₜ₋ₘ, …, oₜ)。

## RL 的目標：期望總獎勵

直覺的目標是最大化獎勵總和 Σₜ r(sₜ, aₜ)。但這個量不是確定的。投影片問：變異從哪來？答案有兩個：世界是隨機的；而且同一個 policy 每次不一定做同樣的決定。

所以 trajectory 本身是一個分佈：

```text
pθ(τ) = p(s₁) · ∏ₜ πθ(aₜ | sₜ) · p(sₜ₊₁ | sₜ, aₜ)
```

RL 的目標是最大化**期望**總獎勵：

```text
max_θ  E_{τ ~ pθ(τ)} [ Σₜ r(sₜ, aₜ) ]
```

**為什麼 policy 要是隨機的？** 投影片給兩個理由：要從自己的經驗學習，就得嘗試不同的事（探索）；而既有資料本身就會呈現不同的行為。第二點帶出一個伏筆：我們可以借用生成模型的工具，把 policy 當成「給定狀態下的動作生成模型」。L2 整講都在講這件事。

**怎麼評估一個 policy？** 兩個函數：

- **value function V^π(s)**：從 s 出發、之後一直照 π 做，未來的期望獎勵
- **Q-function Q^π(s, a)**：從 s 出發、先做 a、之後照 π 做，未來的期望獎勵

## 五類演算法，各自做了不同的取捨

同一個目標，投影片列出五類解法，剛好就是這門課前半的目錄：

| 類別 | 做法 | 本系列 |
|---|---|---|
| 模仿學習 | 模仿一個能拿高獎勵的 policy | [L2](/posts/ai/2026-09-30-cs224r-imitation-learning) |
| Policy gradients | 直接對目標函數求梯度 | [L3](/posts/ai/2026-09-30-cs224r-policy-gradients) |
| Actor-critic | 估計目前 policy 的價值，用它改進 policy | [L4](/posts/ai/2026-09-30-cs224r-actor-critic)、[L5](/posts/ai/2026-09-30-cs224r-off-policy-actor-critic-ppo-sac) |
| Value-based | 估計最佳 policy 的價值 | [L6](/posts/ai/2026-09-30-cs224r-q-learning) |
| Model-based | 學 dynamics 模型，拿來規劃或改進 policy | [L11](/posts/ai/2026-09-30-cs224r-model-based-rl) |

為什麼需要這麼多種？投影片的回答是：不同演算法做了不同取捨，在不同假設下表現最好。選擇時要問的問題有：

- 用 policy 收資料容易嗎、便宜嗎？（有模擬器，還是要人手動？）
- 哪種監督比較便宜：示範，還是細緻的獎勵？
- 穩定性和好不好用有多重要？
- 動作空間的維度多高？連續還是離散？
- dynamics 模型好不好學？

讀後面每一講時，都可以回來對照這五個問題。

## 模仿學習 version 0：為什麼會學到平均值

最後十幾頁開始講模仿學習。投影片說它既是某些 RL 演算法的子程序，本身也是很強的方法。

設定是：給定專家收集的示範 trajectory（來自某個未知的 π_expert），學一個表現跟專家一樣好的 πθ。例子是人類駕駛的資料集：感測器讀數加上方向盤指令。

**Version 0** 最直接：用確定性 policy，對專家的動作做監督回歸，最小化 ‖a − â‖²，其中 â = πθ(s)。訓練完就部署。

投影片接著問：用 ℓ2 回歸訓練出來的 policy 會做什麼？圖上是高速公路，示範資料裡有兩種方向盤指令：一群人往左切換車道（約 -2），一群人維持直行（約 0）。合起來是兩個峰，ℓ2 回歸學到的卻是**資料的平均值**，大約 -0.5，落在兩個峰之間，是一個沒有人示範過、半切不切的動作。投影片說這種狀況「All the time!」發生，尤其是多人收集資料的時候。

所以問題變成：怎麼表示比平均值更多的東西？投影片給了兩個起點：

- **離散動作**：網路輸出每個動作的機率，形成 categorical 分佈，表達力最強
- **連續動作**：網路輸出 μ 和 σ，形成 Gaussian 分佈，**表達力不夠**

Gaussian 只有一個峰，無法同時表示「往左」和「往右」。怎麼用神經網路表示多峰的連續分佈，就是下一講的題目。

## 今晚可以做的事

拿你熟悉的一個系統（客服 bot、推薦系統、你自己寫的 agent），照 L1 的 think-pair-share 寫出四行：

```text
state 或 observation：
action：
trajectory 長度：
reward：
```

寫完問自己兩件事：你的 observation 滿足 Markov property 嗎？如果不滿足，policy 需要看多長的歷史？再想一個情況：一批人類示範裡，同一個情境有兩種都合理的做法。這時 ℓ2 回歸會學到什麼？

## 延伸閱讀

- [Berkeley CS285 L1–4：模仿學習、分布偏移與 RL 基礎](/posts/learning/2026-08-22-berkeley-cs285-imitation-rl-basics)：同一段內容的另一種講法
- [強化學習：MDP、價值迭代與連續狀態（CS229 講義第 19 章）](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-19-reinforcement-learning)：MDP 的完整數學定義
- [CS221 導讀](/posts/ai/2026-08-21-stanford-cs221-ai-principles)：官網推薦的 RL 前置課

**系列導覽**：上一篇 [系列總覽](/posts/ai/2026-09-30-cs224r-course-overview)｜下一篇 [L2：模仿學習與能表達多峰分佈的 policy](/posts/ai/2026-09-30-cs224r-imitation-learning)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入的影片屬於較早學期的公開錄影，不是 2026 當季課程，狀態改為相關補充影片。

## 參考資料

- [CS224R 課程首頁與課表（Spring 2026）](https://cs224r.stanford.edu/)
- [Lecture 1 投影片：Course Intro + Start of MDPs & Imitation（2026）](https://cs224r.stanford.edu/slides/01_cs224r_intro_2026.pdf)
- [Spring 2025 Lecture 1: Class Intro（YouTube，補充）](https://www.youtube.com/watch?v=EvHRQhMX7_w)
- [Sutton & Barto, Reinforcement Learning: An Introduction（2nd ed.），第 3–4 章](http://incompleteideas.net/book/RLbook2020.pdf)
- [CS221 Autumn 2022 modules（MDP、RL）](https://stanford-cs221.github.io/autumn2022/modules/)
