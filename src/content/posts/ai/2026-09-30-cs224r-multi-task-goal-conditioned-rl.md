---
title: "CS224R L12：多任務與 Goal-Conditioned RL——共享權重，也共享資料"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, reinforcement-learning, stanford, ai-course, course-guide, multi-task-learning]
lang: zh-TW
series:
  name: "Stanford CS224R 導讀"
  order: 16
tldr: "多任務 RL 把「任務是哪一個」當成狀態的一部分：s = (s̄, z_i)，於是它還是一個普通的 MDP，標準 RL 演算法照樣能用。CS224R 第 12 講講兩種共享：權重共享（一個網路以 z_i 為條件做所有任務）和資料共享（hindsight relabeling：把為任務 A 收的資料改標成任務 B 的資料）。Goal-conditioned RL 是特例，任務就是要到達的目標狀態；用「最後到達的狀態」當目標重新標記，稀疏獎勵的探索問題就緩解很多。資料共享有三個前提：dynamics 跨任務一致、reward 能算、演算法是 off-policy。"
description: "Stanford CS224R Spring 2026 第 12 講導讀：依官方 12_cs224r_mtrl_gcrl_2026 投影片整理多任務 RL 的動機與形式化、任務識別碼 z_i 的三種形式、stratified sampling、BC-Z、OpenVLA、π0.5 的任務條件化、goal-conditioned RL 的 reward 設計、hindsight relabeling（HER）的演算法與適用前提。延伸練習為 Spring 2025 HW4 Part 1（封存），配套影片為 Spring 2025 L12（補充）。"
draft: false
glossary:
  - term: "hindsight relabeling"
    aliases: ["hindsight experience replay", "HER", "事後重新標記"]
    definition: "把一條為某個任務或目標收集的軌跡，改標成另一個任務（例如「實際到達的狀態」這個目標）的資料，重算 reward 後也存進 replay buffer。"
    context: "CS224R L12 的資料共享技巧，指定閱讀是 Andrychowicz et al. 的 HER 論文。"
  - term: "goal-conditioned RL"
    aliases: ["目標條件強化學習", "GCRL"]
    definition: "多任務 RL 的特例：任務識別碼就是要到達的目標狀態 s_g，reward 通常定義為與目標的距離或是否到達。"
    context: "CS224R L12 用它展示 hindsight relabeling 最直接的用法。"
  - term: "stratified sampling"
    aliases: ["分層抽樣"]
    definition: "組每個 minibatch 時，從每個任務都抽一些資料，讓梯度的變異變小。"
    context: "CS224R L12 從多任務監督學習借來的技巧，RL 版本是每個任務各自一個 replay buffer。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs224r-multi-task-goal-conditioned-rl-en)

**影片狀態：僅附相關補充影片；原講次錄影未確認。** [影片來源與說明](#課程影片來源)

**本文依據 [CS224R](https://cs224r.stanford.edu/) Spring 2026 版。** 這是 [Stanford CS224R 導讀](/posts/ai/2026-09-30-cs224r-course-overview)系列第 16 篇，接續 [L11 Model-Based RL](/posts/ai/2026-09-30-cs224r-model-based-rl)，對應 2026 年 5 月 8 日的第 12 講「Multi-Task and Goal-Conditioned RL」。HW3 也在同一天晚上 9 點截止。

用到的官方材料：

- 當期投影片 [12_cs224r_mtrl_gcrl_2026.pdf](https://cs224r.stanford.edu/slides/12_cs224r_mtrl_gcrl_2026.pdf)（29 頁）
- 課表上的指定閱讀：[Hindsight Experience Replay（Andrychowicz et al.）](https://arxiv.org/abs/1707.01495)
- 延伸練習：[Spring 2025 HW4](https://cs224r.stanford.edu/spring_2025/material/CS224R_2025_Homework_4.pdf) 的 Part 1（**2025 封存**，2026 沒有這份作業）

存取等級是 **A3**：投影片匿名可下載，2026 錄影只放在 Canvas 上。

配套影片（**補充教材**）：[Spring 2025 Lecture 12: Multi-Task RL](https://www.youtube.com/watch?v=qNdsI_4AQJw)（約 70 分鐘）。[2025 年的 L12 投影片](https://cs224r.stanford.edu/spring_2025/slides/12_cs224r_mtrl_gcrl_2025.pdf)前半段還在收尾 model-based RL（合成資料生成、什麼時候用 model-based RL），我讀過字幕，錄影開頭確實先收尾 model-based RL（合成資料生成與何時使用 model-based RL），才進入多任務。以下以 2026 投影片為準。

## 課程影片來源

本文以 Spring 2026 教材為準；下列 Spring 2025 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=qNdsI_4AQJw
title: Spring 2025 Lecture 12: Multi-Task RL（YouTube，補充）
```

原始影片：[Spring 2025 Lecture 12: Multi-Task RL（YouTube，補充）](https://www.youtube.com/watch?v=qNdsI_4AQJw)

內容核對：已依字幕核對（2026-10-10）：抽樣讀取 Spring 2025 L12 Multi-Task RL 字幕（前／中／後段加關鍵字搜尋，非逐字比對）。確認影片是 L12、講者為 Chelsea Finn；開頭明說「今天先收尾 model-based RL（用 learned model 生成合成資料、何時使用 model-based RL）」，接著才講多任務模仿與 RL、任務識別碼、goal-conditioned 與 hindsight relabeling，與本文所述前段是 model-based 收尾相符。本文以 2026 投影片為準，影片只當補充。

課程與錄影入口：

- [官方課程／講次來源](https://cs224r.stanford.edu/)

Spring 2026 當季講次錄影放在需 Stanford 登入的 Canvas／Panopto；公開 YouTube 播放清單是 Spring 2025。 查核日期：2026-10-10。

## 為什麼要一次學很多任務

第 6 頁的問題是：能不能訓練一個**通才** policy，做很多「任務」而不只一個？投影片的例子橫跨好幾個領域：LLM 助理訂機票和買菜、足式機器人走路跑步跳舞、行動操作機器人掛毛巾和清洗碗機、音樂推薦系統對很多不同使用者做個人化、遊戲 agent 玩 Flappy Bird 和 Pokemon。這些任務的 reward、dynamics，甚至動作空間都可能不同。

第 7 頁回顧到目前為止的主題（模仿、on-/off-policy 與 offline RL、model-free 與 model-based、reward function），然後問：**目前最大的挑戰是什麼？資料效率。** 多任務的想法是把資料成本攤到很多任務上，因為很多學到的東西可以共享：LLM 助理共享文法、足式機器人共享平衡、推薦系統共享使用者之間的相似性。

投影片還提了一個更深的動機：**通才型 ML 系統常常比專才更可靠、表現更好。**

這一講的學習目標：**怎麼跨任務共享權重和資料，提高學習效率。**

## 任務就是不同的 MDP

### 形式化

第 8 頁把一個任務寫成一個 MDP：T_i ≜ {S_i, A_i, p_i(s_1), p_i(s'|s, a), r_i(s, a)}，也就是狀態空間、動作空間、初始狀態分佈、dynamics、reward。投影片提醒，這個定義允許的變化，遠比日常說的「任務」多。

第 9–10 頁用四個例子練習「哪些部分在變」：

| 例子 | 變的部分 |
|---|---|
| 角色動畫學多種動作 | r_i |
| 對多位使用者推薦影片 | dynamics 和 r_i |
| 穿不同衣服、從不同初始狀態開始 | 初始狀態分佈和 dynamics |
| 多台機器人一起學摺衣服 | 狀態空間、動作空間、初始狀態分佈、dynamics |

### 怎麼告訴 policy 現在是哪個任務

第 11 頁列出三種任務識別碼 z_i：任務編號（task 0、task 1……）、語言描述、示範影片。

第 12–13 頁換一個角度：**把任務識別碼當成狀態的一部分**，s = (s̄, z_i)。這樣它還是一個標準的 MDP，那為什麼不直接用標準 RL 演算法？投影片的回答是：**可以。有些情況還能做得更好。**

Reward 的部分，多任務 RL 跟以前一樣。goal-conditioned RL 的 z_i 就是目標狀態 s_g，reward 寫成 r(s) = −d(s̄, s_g)，距離 d 可以是歐氏距離，也可以是稀疏的 0/1。

## 權重共享：以 z_i 為條件

### 先從多任務模仿學習開始

第 14 頁從多任務監督學習借一個技巧：**stratified sampling**，每個 minibatch 都放每個任務的資料，梯度變異會比較小。

第 15–18 頁用幾個機器人例子說明實務上怎麼把 z_i 餵進去：

- [BC-Z（Jang et al., CoRL 2021）](https://arxiv.org/abs/2202.02005)
- [OpenVLA（Kim et al., CoRL 2024）](https://arxiv.org/abs/2406.09246)：現代架構直接把 z_i 當 prompt 餵給（微調過的）LLM
- [π0.5（Physical Intelligence, 2025）](https://arxiv.org/abs/2504.16054)：兩個任務的例子是「把毛巾攤平」和「把毛巾掛起來」；多任務的例子則有「把盤子放進抽屜」「關微波爐」「清理灑出來的東西」等

第 18 頁留了一個問題：「把廚房打掃乾淨」這種高層、長 horizon 的任務呢？答案留到階層式 RL 那講。

### 多任務 RL 的基本做法

第 19 頁很短：

- Policy：π_θ(a | s̄) 改成 π_θ(a | s̄, z_i)
- Q 函數：Q_φ(s̄, a) 改成 Q_φ(s̄, a, z_i)
- 可以每個任務各自一個 replay buffer，做 stratified sampling

然後投影片問出這講的核心問題：**以 z_1 為條件收的資料，能拿來學任務 2 嗎？**

## 資料共享：hindsight relabeling

### 意外的好傳球

第 21 頁的例子是冰球：任務 1 是傳球，任務 2 是射門。如果你想射門，結果意外傳出一記好球呢？做法是：照常存這筆經驗，**另外**把它改標成另一個任務的 ID 和 reward 再存一份。這就叫 **hindsight relabeling**，也叫 hindsight experience replay（HER）。投影片原文寫的是「relabel with task 2 ID」；照這個例子的邏輯，意外做出來的是傳球，改標的對象應該是任務 1（傳球）。這裡照邏輯讀，原文照錄供對照。

### 多任務版演算法

第 22 頁：

1. 用某個 policy 收資料 D_k = {(s_{1:T}, a_{1:T}, z_i, r_{1:T})}
2. 存進 replay buffer
3. Hindsight relabeling：把 D_k 改標成任務 T_j，得到 D'_k，其中 r'_t = r_j(s_t)，也存進 buffer
4. 用 replay buffer 更新 policy

要改標成哪個任務 j？投影片給兩個選項：隨機選，或選這條軌跡能拿到高 reward 的任務。

同一頁問：**什麼情況下可以做 relabeling？**投影片的答案是三個條件：

- reward function 的形式已知、而且能算
- dynamics 跨目標或任務一致
- 用的是 off-policy 演算法

<details>
<summary>為什麼一定要 off-policy（我的補充）</summary>

投影片只列出條件，沒有逐條解釋。以下是我依前幾講內容的推論：改標過的資料是「在任務 i 的 policy 下」收的，對任務 j 的 policy π(a | s̄, z_j) 來說就是別的 policy 的資料。[L3 policy gradients](/posts/ai/2026-09-30-cs224r-policy-gradients) 那類 on-policy 方法要求資料來自目前的 policy；[L6 Q-learning](/posts/ai/2026-09-30-cs224r-q-learning) 那類 off-policy 方法只需要 (s, a, r, s') 轉移，才能直接吃這些資料。dynamics 要一致也是同樣道理：轉移 (s, a, s') 在任務 j 下必須仍然是真的會發生的轉移。

</details>

### Goal-conditioned 版演算法

第 23 頁把同一套放到 goal-conditioned RL：

1. 收資料 D_k = {(s_{1:T}, a_{1:T}, s_g, r_{1:T})}
2. 存進 buffer
3. **用最後到達的狀態當目標**重新標記：D'_k = {(s_{1:T}, a_{1:T}, s_T, r'_{1:T})}，其中 r'_t = −d(s_t, s_T)，也存進 buffer
4. 更新 policy

其他標記策略？投影片的答案是：用這條軌跡裡**任何一個未來狀態**。結果是：**探索的困難緩解了。**這一段同時引用了 Kaelbling 1993 年在 IJCAI 發表的 Learning to Achieve Goals 和 HER 論文。

**怎麼做**：在紙上畫一個 5 格的一維走廊，目標在最右邊，reward 只在到達時是 0、其他時候是 −1。隨手寫一條只走到第 3 格的軌跡，分別用「原始目標」和「最後狀態當目標」標記一次 reward。你會看到原始標記整條都是 −1，relabel 之後至少有一步是 0，這就是 Q 函數第一次拿到有用訊號的時刻。

## 連回來：兩種共享各需要什麼

第 26–28 頁的總結：

- **多任務 RL = 在一個聯合 MDP 裡做單任務 RL**，狀態是 s = (s̄, z_i)，每個 episode 先抽一個任務
- **Goal-conditioned RL 是特例**，z_i = s_g，每個任務都是到達某個目標狀態。離散狀態的 reward 是 δ(s = s_g)，連續狀態是 δ(‖s − s_g‖ ≤ ε)

goal-conditioned 的優缺點：

- 不用定義 reward（自監督）
- 很多任務都能寫成到達目標的形式
- 訓練起來可能相當困難

| | 權重共享 | 資料共享 |
|---|---|---|
| 做法 | 訓練一個網路做所有任務，以 z_i 為條件 | 把為一個任務收的資料改標 reward 和任務 ID，加進另一個任務的 buffer |
| 需要 | — | 跨任務 dynamics 一致、reward 能算、off-policy 演算法 |
| goal-conditioned | — | 可以直接套用 |

下一講問：能不能**快速適應**一個新任務？也就是 RL 的 in-context learning。見 [L13 Meta-RL](/posts/ai/2026-09-30-cs224r-meta-rl)。

## 延伸練習：Spring 2025 HW4 Part 1（封存）

2026 年只有三份作業，這講沒有對應的作業。**2025 年的 HW4 Part 1** 剛好是本講主題，題目 PDF 和 [starter code](https://cs224r.stanford.edu/spring_2025/material/hw4_starter_code.zip) 都還能匿名下載，適合自學者當練習。以下只列題目要求，不寫解答。

依 PDF，Part 1 要做四件事：

1. 把現成的 DQN 改成 goal-conditioned，Q 網路吃串接起來的狀態和目標
2. 在兩個環境上跑 goal-conditioned DQN
3. 在上面實作 HER
4. 比較有無 HER 的表現

兩個環境：

- **Bit flipping**：狀態和目標都是長度 n 的 0/1 向量，每步翻一個 bit。狀態和目標不相等時 reward 是 −1，相等時是 0，是稀疏 reward 的例子；n 越大，拿到非負 reward 的機會越少
- **2D Sawyer reach**：把機械手臂末端移到目標 XY 座標，reward 是負的歐氏距離，是稠密 reward 的例子

要實作的函式在 `run_episode.py` 和 `trainer.py`；HER 要實作 final、random、future 三種變體（future 只能從該步之後的狀態挑目標）。分析題把 bit 數從 6 拉到 15 再到 25，比較有無 HER；再在 15 bits 上比三種變體；最後比較 HER 在 bit flipping 和 Sawyer reach 上的貢獻差異。

自學者要注意的地方：

- 這份作業規定在 AWS EC2 上跑，PDF 指定 c4.4xlarge 和課程提供的自訂 AMI，並寫明不支援其他平台。校外讀者只能在本機依 starter code 的 README 自行設定環境
- PDF 禁止用生成式模型協助寫這份作業的程式碼
- autograder 和 Gradescope 不公開，只能自己看 tensorboard 曲線判斷

## 延伸閱讀

- [Berkeley CS285 Spring 2026：更難的探索與跨任務重用](/posts/learning/2026-08-22-berkeley-cs285-exploration-open-problems)
- [CS224R L2 模仿學習](/posts/ai/2026-09-30-cs224r-imitation-learning)，本講的多任務模仿學習建立在它上面

## 這一篇可以確認與不能確認的

可以確認：2026 投影片的文字、演算法和總結表，課表日期與指定閱讀，2025 HW4 題目 PDF 的內容與算力規定，2025 L12 影片的標題與長度。不能確認：第 9 頁思考題在課堂上的討論、第 15–18 頁影片素材的內容，以及 relabeling 三個前提在課堂上的口頭解釋（上面折疊區是我的推論）。

系列導覽：上一篇 [L11 Model-Based RL](/posts/ai/2026-09-30-cs224r-model-based-rl)｜下一篇 [L13 Meta-RL](/posts/ai/2026-09-30-cs224r-meta-rl)｜[系列入口](/posts/ai/2026-09-30-cs224r-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入的影片屬於較早學期的公開錄影，不是 2026 當季課程，狀態改為相關補充影片。
- 2026-10-10：依字幕核對影片內容。影片是 Spring 2025 L12，字幕證實前段是 model-based 收尾，原文的「可能」改為確認。

## 參考資料

- [CS224R: Deep Reinforcement Learning（Spring 2026 課程官網與課表）](https://cs224r.stanford.edu/)
- [Lecture 12 投影片：Multi-Task and Goal-Conditioned RL（2026）](https://cs224r.stanford.edu/slides/12_cs224r_mtrl_gcrl_2026.pdf)
- [Spring 2025 Lecture 12: Multi-Task RL（YouTube，補充）](https://www.youtube.com/watch?v=qNdsI_4AQJw)
- [Spring 2025 Lecture 12 投影片（封存）](https://cs224r.stanford.edu/spring_2025/slides/12_cs224r_mtrl_gcrl_2025.pdf)
- [CS224R Spring 2025 Homework 4 題目（封存）](https://cs224r.stanford.edu/spring_2025/material/CS224R_2025_Homework_4.pdf)
- [CS224R Spring 2025 HW4 starter code（封存）](https://cs224r.stanford.edu/spring_2025/material/hw4_starter_code.zip)
- [Andrychowicz et al. Hindsight Experience Replay（arXiv 1707.01495）](https://arxiv.org/abs/1707.01495)
- [Jang et al. BC-Z: Zero-Shot Task Generalization with Robotic Imitation Learning（arXiv 2202.02005）](https://arxiv.org/abs/2202.02005)
- [Kim et al. OpenVLA: An Open-Source Vision-Language-Action Model（arXiv 2406.09246）](https://arxiv.org/abs/2406.09246)
- [Physical Intelligence. π0.5: a Vision-Language-Action Model with Open-World Generalization（arXiv 2504.16054）](https://arxiv.org/abs/2504.16054)
