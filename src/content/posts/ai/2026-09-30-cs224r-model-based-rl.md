---
title: "CS224R L11：Model-Based RL——學一個模擬器，然後別太相信它"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, reinforcement-learning, stanford, ai-course, course-guide, world-model, planning]
lang: zh-TW
series:
  name: "Stanford CS224R 導讀"
  order: 15
tldr: "Model-based RL 先學一個預測 s_{t+1} 的 dynamics model，再拿它做兩件事：生成額外的訓練資料（Dyna、MBPO），或在執行時往前想幾步再行動（planning）。CS224R 第 11 講的主線是怎麼不被模型誤差拖垮：合成資料只從真實狀態出發跑短 rollout、用多個模型的 ensemble 平均掉誤差、長 horizon 的 planning 在尾端接一個 value function。模型值不值得學，取決於它比 policy 好學還是難學。"
description: "Stanford CS224R Spring 2026 第 11 講導讀：依官方 11_cs224r_mbrl_2026 投影片整理 learned simulator 的基本演算法、dynamics model 的三種來源、Dyna 與 MBPO 的資料生成、distribution shift 與短 rollout、模型 ensemble、sampling-based planning 與 receding horizon、加上 value function 的長 horizon planning、Nagabandi 2019 與 AlphaGo 兩個例子，以及什麼時候該用 model-based RL。配套影片為 Spring 2025 L11（補充）。"
draft: false
glossary:
  - term: "dynamics model"
    aliases: ["learned simulator", "world model", "動態模型"]
    definition: "預測「在狀態 s 做動作 a 之後會到哪個狀態」的模型 p_θ(s' | s, a)。學了它的 RL 演算法就叫 model-based RL。"
    context: "CS224R L11 投影片提到它有很多名字：dynamics model、simulator、world model，或直接叫 model。"
  - term: "MBPO"
    aliases: ["Model-Based Policy Optimization"]
    definition: "Janner et al. 2019 的方法：從 replay buffer 裡的真實狀態出發，用一組 dynamics model 跑短的合成 rollout，把合成資料和真實資料一起拿去訓練 model-free 的 actor-critic。"
    context: "CS224R L11 的指定閱讀，投影片稱為「Model-based RL: V2」。"
  - term: "receding horizon planning"
    aliases: ["MPC", "滾動時域規劃"]
    definition: "每一步都規劃一整段動作序列，但只執行第一個動作，到了下一個狀態再重新規劃。"
    context: "CS224R L11 在 sampling-based planning 的第一個附註裡提到。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs224r-model-based-rl-en)

**本文依據 [CS224R](https://cs224r.stanford.edu/) Spring 2026 版。** 這是 [Stanford CS224R 導讀](/posts/ai/2026-09-30-cs224r-course-overview)系列第 15 篇，接續 [Default Project：LLM 的 RL 微調](/posts/ai/2026-09-30-cs224r-default-project-llm-rl)，對應 2026 年 5 月 6 日的第 11 講「Model-Based RL」。

用到的官方材料：

- 當期投影片 [11_cs224r_mbrl_2026.pdf](https://cs224r.stanford.edu/slides/11_cs224r_mbrl_2026.pdf)（35 頁）
- 課表上的指定閱讀：[When to Trust Your Model: Model-Based Policy Optimization（Janner et al. 2019）](https://arxiv.org/abs/1906.08253)

存取等級是 **A3**：投影片匿名可下載，2026 錄影只放在 Canvas 上，校外看不到。

配套影片（**補充教材**）：[Spring 2025 Lecture 11: Model-Based RL](https://www.youtube.com/watch?v=PvqyGnOirgA)（約 73 分鐘）。要注意兩年的切法不同。[2025 年的 L11 投影片](https://cs224r.stanford.edu/spring_2025/slides/11_cs224r_mbrl_2025.pdf)先講 planning、再講資料生成，最後還有一段靈巧操作的 case study；[2025 L12 投影片](https://cs224r.stanford.edu/spring_2025/slides/12_cs224r_mtrl_gcrl_2025.pdf)開頭又接著講「用 learned model 生成合成資料」和「什麼時候用 model-based RL」。所以 MBPO 那段在 2025 錄影裡可能落在 L12 開頭。以下以 2026 投影片為準。

## 場景：前面十講都沒學過環境

第 4 頁把到目前為止的演算法畫成一張地圖：左邊是 offline（behavior cloning、offline RL 的 AWR/AWAC/IQL），右邊是 online（DAgger、DQN/SAC 這類 off-policy、PPO 這類 on-policy）。這張圖上每個方法都有一個共同點：它們只學 policy、value 或兩者，**從來沒有學「環境會怎麼回應」**。

第 6 頁問：能不能學一個「模擬器」，也就是給定 s_t 和 a_t、預測 s_{t+1} 的模型？投影片舉的領域很廣：

- 機器人與物理系統：直接建模物理，或是以動作為條件的影片預測（投影片放了 Veo 2 和 Sora 的畫面）
- 金融：股市預測
- 遊戲：遊戲規則。可能要建模其他玩家，這部分有時算在 dynamics 裡，有時另外建模（multi-agent RL）。像西洋棋這種規則已知的，**根本不用學模型**。

這一講的學習目標只有一條：**怎麼最好地利用 learned dynamics model**。

## 直覺：學模擬器，再在裡面練

第 7 頁寫出一個「概念上的」演算法：

1. 用某個 policy 收一批資料 D = {(s_t, a_t, s_{t+1})}
2. 用最大概似學模擬器：最小化 −Σ log p_θ(s_{t+1} | s_t, a_t)
3. 在模擬器裡跑你最喜歡的 RL 演算法，或是一個 planning 方法

投影片接著問「哪裡可能出錯」，第 8 頁在三步旁邊各貼了一個提醒：

- 第 1 步：**資料涵蓋範圍很重要**
- 第 2 步：建模難度跟領域有關，有些領域比其他領域好模擬得多
- 第 3 步：**就算模擬器不錯，這步也不簡單**，因為要處理模型不準的地方

這一講剩下的內容，幾乎都在回答第 3 步的提醒。

## 機制一：dynamics model 從哪來（投影片只帶過）

第 10 頁把情況分成三種：

- **完全知道**：例如某些遊戲
- **大致知道**：例如某些物理模型，只要用資料擬合未知參數
- **不知道**：實務上幾乎都是這種。可以端到端學，也可以先學一個低維的狀態表示，再在表示空間上學模型

投影片加了一個容易忘的附註：**通常也要學一個 reward model**。

## 機制二：拿模型生成資料（Dyna → MBPO）

### Dyna：真實資料加合成資料

第 12 頁的關鍵想法是「用模型模擬出來的 rollout 擴充資料」，投影片把這個演算法標成 **Dyna**：

1. 用目前的 policy π_φ 收資料，加進 D_env
2. 用 D_env 更新模型 p_θ(s' | s, a)
3. 在模型裡用 π_φ 跑合成 rollout，加進 D_model
4. 用 D_model ∪ D_env 更新 policy（和 critic Q）

第 4 步可以接很多種 model-free 方法，投影片特別註明這點。

### 它怎麼壞掉：policy 一改，資料就不對了

第 13 頁用一個爬坡的例子說明：policy 更新之後，新 policy 會走到的狀態分佈 p_{π_φ'}(s) 跟舊的 p_{π_φ}(s) 不一樣。模型只在舊資料附近準，新 policy 偏偏往模型沒看過的地方走（投影片的例子是「往右可以爬得更高」）。

投影片說，可以用以前學過的招：之後幾輪用新 policy 收資料，或限制 policy 每次不要改太多。**但在 model-based 的情況下，還有別的辦法。**

### 從哪裡開始模擬、模擬多長

第 14–15 頁拿一條真實軌跡 s1 → s6，問合成資料該怎麼生：

| 做法 | 問題 |
|---|---|
| 從初始狀態生成完整軌跡 | 長 horizon 上模型可能不準 |
| 從初始狀態生成部分軌跡 | 後段狀態可能涵蓋不到 |
| **從資料裡每個狀態出發，生成部分軌跡** | 模型不需要在長 horizon 上準 |

第三種是投影片標了燈泡的答案。第 16 頁接著問「部分軌跡要多長」，引用 MBPO 論文的一張圖作答。

第 17 頁把這段濃縮成兩個想法：

1. 用**短的**模型 rollout，起點是 replay buffer 裡的真實狀態
2. 用**一組模型的 ensemble**，讓誤差互相平均掉

### MBPO：投影片的「V2」

第 18 頁把兩個想法放回演算法，就是指定閱讀的 MBPO：

1. 用 π_φ 收資料，加進 D_env
2. 每個模型 p_θ^i 用從 D_env 抽的 minibatch 各自更新
3. 從 D_env 裡的狀態出發，在模型 p_θ^i 裡用 π_φ 跑**部分** rollout，加進 D_model
4. 用 D_model ∪ D_env 更新 policy 和 critic

投影片最後留了一題：這個方法跟 PPO、SAC 比起來如何？PDF 上沒有答案。

**怎麼做**：拿你在 [HW2](/posts/ai/2026-09-30-cs224r-hw2-online-rl-sawyer) 寫過的 off-policy actor-critic，想像要把它改成 MBPO。列出你得多寫哪三個元件：模型 ensemble 的訓練迴圈、從 replay buffer 抽起點跑短 rollout 的函式、第二個 buffer D_model。光是寫出這張清單，就會看清楚 model-based 多出來的工程量在哪。

## 機制三：拿模型在執行時 planning

### 想了再做

第 20 頁把到目前為止的執行方式寫出來：看到狀態 s，從 π(·|s) 抽一個動作，看到下一個狀態……如果遇到複雜或沒見過的情況呢？投影片的粗略草圖是：

1. 考慮幾個候選動作
2. 想像這些動作的結果
3. 選結果最好的那個

第 21 頁在旁邊標了兩組設計問題：要考慮哪些動作、幾個候選、多長的動作序列？以及，**怎麼判斷一個結果是好的**？

### Planning V1：抽樣、想像、選最好

第 22 頁把草圖寫成具體演算法。agent 在 s_t 時：

1. 抽 N 條長度 H 的動作序列 a^i_{t:t+H}
2. 在模型 p_θ 裡把每條序列跑出來，得到想像的狀態
3. 執行累積 reward 最高的那條

投影片畫重點：**這裡沒有另外一個 policy 網路，這個 planning 過程本身就是 policy**。

第 23 頁補兩個附註：

- 可以只執行第一個動作，到 s_{t+1} 再重新規劃，這叫 **receding horizon planning**
- 可以反覆迭代，往更好的動作序列抽樣

第 24 頁講它的限制。H 短的話 planning 會短視；它在短 horizon 問題上可以很好用，但長 horizon 需要準確的長程模型，也要大量推論算力。

### Planning V2：尾端接一個 value function

第 25–26 頁的修正是把目標改成「H 步內的 reward 總和，再加上 V̂(s_{t+H+1})」。代價和好處：

- 多了學 value function 的複雜度
- 只需要學 V，不用學 Q
- 可以處理長 horizon 問題

第 27 頁把它組回完整 RL 演算法：用目前的 planner 和模型收資料、更新模型、**選擇性地**用 Monte Carlo 或 TD 更新 V̂、**選擇性地**更新一個 policy（如果 planner 用它來抽候選動作的話）。

<details>
<summary>投影片上的兩個例子（第 28–29 頁）</summary>

**Nagabandi et al. 2019**（[Deep Dynamics Models for Learning Dexterous Manipulation](https://arxiv.org/abs/1909.11652)）：

- 模型：三個神經網路組成的 ensemble
- Planning：短 horizon、用 shaped reward，不用 value function；以迭代式抽樣最佳化（cross-entropy method）找動作
- 演算法：交替進行「用 planner 收 30 條軌跡」和「更新模型」

**AlphaGo**：

- 模型：已知的遊戲規則，加上對手的走法；對手是自己或過去版本組成的池子
- Planning：1 到 40 步的 horizon 加上終端 value function；policy 網路縮小動作空間；用啟發式平衡探索和利用
- 演算法：value function 用 Monte Carlo 回歸訓練，policy 訓練成去模仿 planner 選的動作；投影片寫 AlphaGo 訓練 3 週、AlphaGo Zero 40 天

</details>

## 連回來：什麼時候該用 model-based RL

第 31 頁的總結：只要學了 p_θ(s_{t+1} | s_t, a_t)，就算 model-based RL。用法有兩條：

| 用法 | 怎麼壓低模型誤差 |
|---|---|
| 模擬額外資料 | 從資料裡所有看過的狀態出發模擬、用短 rollout |
| Planning（往前看） | 配 value function 做長 horizon planning |
| 兩者共通 | 模型 ensemble 幫忙平均誤差 |

第 33 頁把優缺點攤開：

- **好處**：模型好學的話，資料效率高很多；模型可以用沒有 reward 標註的資料訓練，完全自監督；模型某種程度跟任務無關，有時可以換一個 reward 繼續用
- **壞處**：模型不是為任務表現最佳化的；有時比 policy 還難學；多一個要訓練的東西、更多超參數、更吃算力

投影片的一句話結論：**要不要用模型，取決於它有多難學。**

第 34 頁補充，p(s_{t+1} | s_t, a_t) 只是其中一種模型。還有 inverse model p(a_t | s_t, s_{t+1})、多步 inverse model、不帶動作的未來預測 p(s_{t+1:t+n} | s_t)、影片內插，以及整個轉移的聯合分佈 p(s_t, a_t, s_{t+1})，各有用途。投影片沒展開。

**怎麼做**：下次讀到一篇標榜「world model」的論文，先問兩個問題：它用模型生成資料，還是拿來 planning？它用什麼方法避免模型誤差在長 rollout 上累積？這兩題的答案，大概就決定了它屬於本講哪一格。

下一講從「學環境」轉到「一次學很多任務」：怎麼跨任務共享權重和資料。見 [L12 多任務與 Goal-Conditioned RL](/posts/ai/2026-09-30-cs224r-multi-task-goal-conditioned-rl)。

## 延伸閱讀

- [Berkeley CS285 Spring 2026：推論與 offline RL](/posts/learning/2026-08-22-berkeley-cs285-inference-offline-rl)，其中 L15–16 講 dynamics model 能做什麼
- [CMU 07-280 第三階段：RL 與 AlphaZero](/posts/ai/2026-08-22-cmu-07280-stage-3-rl-alphazero)，從遊戲搜尋的角度看本講的 AlphaGo 例子
- [CS224R L6：Q-learning](/posts/ai/2026-09-30-cs224r-q-learning)，MBPO 第 4 步接的就是這類 off-policy 方法

## 這一篇可以確認與不能確認的

可以確認：2026 投影片的文字、演算法步驟和圖說，課表日期與指定閱讀，2025 投影片的講次切分，以及 2025 L11 影片的標題與長度。不能確認：第 16 頁 MBPO 圖的細節結論（投影片只有圖）、第 18 頁「跟 PPO、SAC 比如何」在課堂上的答案，以及 2026 課堂口頭補充的內容。

系列導覽：上一篇 [Default Project：LLM 的 RL 微調](/posts/ai/2026-09-30-cs224r-default-project-llm-rl)｜下一篇 [L12 多任務與 Goal-Conditioned RL](/posts/ai/2026-09-30-cs224r-multi-task-goal-conditioned-rl)｜[系列入口](/posts/ai/2026-09-30-cs224r-course-overview)

## 參考資料

- [CS224R: Deep Reinforcement Learning（Spring 2026 課程官網與課表）](https://cs224r.stanford.edu/)
- [Lecture 11 投影片：Model-Based Reinforcement Learning（2026）](https://cs224r.stanford.edu/slides/11_cs224r_mbrl_2026.pdf)
- [Spring 2025 Lecture 11: Model-Based RL（YouTube，補充）](https://www.youtube.com/watch?v=PvqyGnOirgA)
- [Spring 2025 Lecture 11 投影片（封存）](https://cs224r.stanford.edu/spring_2025/slides/11_cs224r_mbrl_2025.pdf)
- [Spring 2025 Lecture 12 投影片（封存，開頭接續 MBRL）](https://cs224r.stanford.edu/spring_2025/slides/12_cs224r_mtrl_gcrl_2025.pdf)
- [Janner, Fu, Zhang, Levine. When to Trust Your Model: Model-Based Policy Optimization（arXiv 1906.08253，NeurIPS 2019）](https://arxiv.org/abs/1906.08253)
- [Nagabandi, Konolige, Levine, Kumar. Deep Dynamics Models for Learning Dexterous Manipulation（arXiv 1909.11652）](https://arxiv.org/abs/1909.11652)
