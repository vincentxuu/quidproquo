---
title: "CS224R L6：Q-learning 與它的穩定化"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, reinforcement-learning, q-learning, stanford, ai-course, course-guide]
lang: zh-TW
series:
  name: "Stanford CS224R 導讀"
  order: 7
tldr: "Q-learning 把 actor-critic 的 actor 拿掉：直接學最優 Q 函數，要行動時取 argmax。代價是它不保證收斂，連線性 Q 都可能發散。CS224R 第 6 講用三個工程技巧把它拉回來：target network 讓目標值暫時不動、Double Q 拆開「選動作」和「估價值」來壓低高估、n 步回報用一點偏差換速度。"
description: "Stanford CS224R Spring 2026 第 6 講與 TA 加課講義導讀：從 policy iteration 推到 Bellman optimality equation、Q-learning 為什麼是 off-policy、ε-greedy 與 Boltzmann 探索、target network 與 DQN、高估問題與 Double Q-learning、n 步回報，以及 PG、PPO、SAC、DQN 四類 online RL 方法的總整理。"
draft: false
glossary:
  - term: "Bellman optimality equation"
    aliases: ["Bellman 最優方程"]
    definition: "最優 Q 函數滿足的遞迴式：Q*(s, a) = r(s, a) + γ E_{s'}[max_a' Q*(s', a')]。Q-learning 的訓練目標就是讓學到的 Q 滿足這條等式。"
    context: "CS224R L6 從 policy iteration 推到這條式子，作為拿掉 actor 的理由。"
  - term: "target network"
    aliases: ["目標網路"]
    definition: "計算 Bellman 目標值時使用的一份凍結參數副本，定期（或以指數移動平均）從主網路同步，讓目標值不會每一步都跟著變。"
    context: "DQN 的核心穩定化技巧，HW2 的 off-policy actor-critic 也用了。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs224r-q-learning-en)

**影片狀態：已附影片；播放未逐支確認。** [影片來源與說明](#課程影片來源)

**本文依據 [CS224R](https://cs224r.stanford.edu/) Spring 2026 版。** 這是 [Stanford CS224R 導讀](/posts/ai/2026-09-30-cs224r-course-overview)系列第 7 篇，接續 [L5 Off-Policy Actor-Critic](/posts/ai/2026-09-30-cs224r-off-policy-actor-critic-ppo-sac)，對應 2026 年 4 月 17 日的第 6 講「Q-learning」，以及同一天下午 4:45 在 Thornton 102 的 TA 加課「Extra section on Q-learning」。

用到的官方材料：

- 當期投影片 [06_cs224r_qlearning_2026.pdf](https://cs224r.stanford.edu/slides/06_cs224r_qlearning_2026.pdf)（30 頁）
- TA Maximilian Du 的加課講義 [CS224R_Tutotial_Max.pdf](https://cs224r.stanford.edu/material/CS224R_Tutotial_Max.pdf)（41 頁，檔名原本就拼成 Tutotial）
- 課表上的指定閱讀：[Double Q-learning（van Hasselt et al. 2015）](https://arxiv.org/abs/1509.06461)與 [Distributional RL（Bellemare et al. 2017）](https://arxiv.org/abs/1707.06887)。DQN 原論文 [Mnih et al. 2013](https://arxiv.org/abs/1312.5602) 掛在前一講的閱讀清單，這講才正式講到。

存取等級是 **A3**：投影片與講義匿名可下載，2026 錄影只放在 Canvas。

配套影片（**補充教材**）有兩支：[Spring 2025 Lecture 6: Q-Learning](https://www.youtube.com/watch?v=-7kv6jf0isQ)（約 62 分鐘）和 [Spring 2025 Tutorial Session: Review of Q-Learning](https://www.youtube.com/watch?v=07MQNMcxhZU)（約 51 分鐘）。兩支都是 2025 年的錄影，內容可能和 2026 投影片、講義有出入，以下以 2026 教材為準。

## 課程影片來源

本文以 Spring 2026 教材為準；下列 Spring 2025 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=-7kv6jf0isQ
title: Spring 2025 Lecture 6: Q-Learning（YouTube，補充）
```

```youtube
url: https://www.youtube.com/watch?v=07MQNMcxhZU
title: Spring 2025 Tutorial Session: Review of Q-Learning（YouTube，補充）
```

原始影片：[Spring 2025 Lecture 6: Q-Learning（YouTube，補充）](https://www.youtube.com/watch?v=-7kv6jf0isQ)、[Spring 2025 Tutorial Session: Review of Q-Learning（YouTube，補充）](https://www.youtube.com/watch?v=07MQNMcxhZU)

課程與錄影入口：

- [官方課程／講次來源](https://cs224r.stanford.edu/)

## 場景：能不能連 policy 都不學

上一篇走到 SAC 式的 off-policy actor-critic：critic 學 Q，actor 往 Q 高的方向走。投影片第 6 頁問了下一個問題：**如果 Q 已經告訴你哪個動作最好，還需要另外學一個 policy 嗎？**

這講的三個學習目標：

- Q 函數和 policy 是什麼關係
- 怎麼在不學顯式 policy 的情況下做 RL
- 實務上怎麼讓 Q-learning 穩定

投影片也提醒，這是「the very first deep RL method」。

## 直覺：先評估，再貪婪

第 7 頁是一個思考題。假設你對某個 policy π 有完全準確的 Q^π，然後定義新 policy：每個狀態都選 Q^π 最大的動作。新 policy 會比較好、比較差，還是一樣？它是最優的嗎？

投影片用一個 2D 導航例子讓學生討論，PDF 上沒有寫答案。以下是我的補充，屬於教科書上 policy improvement 的標準結論：argmax Q^π 至少不會比 π 差，因為它在每個狀態都選了「之後照 π 走、期望最高」的動作；但它未必最優，因為 Q^π 評估的前提是「之後照舊 π 走」。

把這兩步反覆做，就是 **policy iteration**（第 10 頁）：

1. **policy evaluation**：擬合目前 policy 的 Q（可以做多步梯度）
2. **policy improvement**：新 policy = 每個狀態取 argmax Q

第 10 頁接著問：能不能把 improvement 直接併進 Q 的更新裡？第 11 頁的答案是把目標值改成 y = r + γ max_a' Q(s', a')。這樣算出來的，直接是「新 policy」的 Q。

## 機制一：Bellman optimality 與 Q-learning

### 為什麼 max 是對的

第 12 頁區分了兩個名詞：

- **Bellman equation**：對任何 policy π 都成立，Q^π(s, a) = r + γ E[Q^π(s', ā')]，其中 ā' 從 π 抽
- **Bellman optimality equation**：如果 π* 是最優 policy，π* 在 s' 會選的就是 Q* 最大的動作，所以 Q*(s, a) = r + γ E[max_a' Q*(s', a')]

優化 Q-learning 的目標值，就是在設法讓第二條等式成立。

TA 講義第 12 頁用反證法講同一件事：如果 π* 不是 argmax Q*，那它選的動作回報就不是最高的，也就不是最優 policy。講義也提醒，**Q 一定要寫上標**（Q^π 或 Q*），因為它估的是「照哪個 policy 走下去」的回報。

<details>
<summary>TA 講義怎麼從定義推出 Bellman 式（講義第 7–10 頁）</summary>

講義從 Q 的定義出發：

```
Q(s_t, a_t) := E_τ[ Σ_{t'=t}^{T} γ^{t'−t} r(s_{t'}, a_{t'}) ]
```

把第一步的獎勵「剝出來」，剩下的和式就是下一步的 Q：

```
Q(s_t, a_t) = r(s_t, a_t) + γ E_{s_{t+1}, a_{t+1}}[ Q(s_{t+1}, a_{t+1}) ]
```

期望值裡有兩層：s_{t+1} ~ p(·|s_t, a_t) 是「環境怎麼回應」，a_{t+1} ~ π(·|s_{t+1}) 是「我們怎麼行動」。講義旁邊寫著「This is very important!! Make sure you understand this :)」。

接下來講義第 14 頁叫它「Fake it till you make it」：我們手上沒有正確的 Q，就先假設右邊的 Q 是對的，拿右邊算左邊。等號變成了賦值（←）。這就是 fitted Q iteration。

</details>

### Q-learning 是 off-policy 的

第 13 頁特別標註：Q-learning 是 off-policy 的。目標值 r + γ max Q(s', a') 只需要一筆轉移 (s, a, r, s')，不管這筆資料是哪個 policy 收的。

但它會收斂嗎？投影片的回答分兩層：

- **表格型**（每個狀態、動作各存一格 Q）：會
- **一般情況**：不會。投影片說可以構造出發散的例子，連線性 Q 都會。不過實務上可以讓它表現得很好。

TA 講義第 16 頁的直覺是：右邊含有真實的 reward，每次更新都把一點「真資訊」灌進 Q。表格型情況下可證明每次更新都以指數速度逼近真解；換成參數化的網路就沒有保證。講義建議想看證明的人去修 [CS234](https://web.stanford.edu/class/cs234/)。

### 資料怎麼收

第 14 頁：既然 Q-learning 是 off-policy，資料可以來自某個探索 policy，重點是要**涵蓋很多動作**。兩種常見做法：

- **ε-greedy**：以機率 ε 均勻隨機選動作，其餘時候選 argmax。通常一開始 ε 大，訓練過程逐漸調小。
- **Boltzmann exploration**：動作被選的機率和它的 Q 值成正比。

第 15 頁把完整演算法寫成兩層迴圈：外層用某個 policy（例如 ε-greedy）收資料進 replay buffer；內層抽 batch、對 Q 做 K 步梯度。投影片註記 K=1 很常見，但 K 大一點效率更高。最後的 policy 就是 argmax Q。

**怎麼做**：拿一個表格型環境（例如 [HW2](/posts/ai/2026-09-30-cs224r-hw2-online-rl-sawyer) 的 gridworld）實作一次 ε-greedy Q-learning，觀察 ε 從大到小時學到的路徑怎麼變。表格型保證收斂，所以出錯一定是程式的問題，很適合拿來除錯直覺。

## 機制二：讓 Q-learning 穩定的三個技巧

### Target network：讓目標值暫時別動

第 17 頁指出問題：目標值 r + γ max Q_φ(s', a') 裡的 Q_φ 就是正在更新的網路。你每走一步，目標也跟著動，這是一個**移動的靶**，優化會不穩定。

第 18 頁的簡單想法：把計算目標值的參數**凍結起來，定期才更新**。多加一層迴圈，先存一份 φ' ← φ，內層迴圈裡目標值都用 Q_φ'。投影片的說法是，這樣內層迴圈就是在做監督學習，因為標籤在內層迴圈裡不變。這就是 **DQN**（deep Q network）。

TA 講義第 30 頁補了兩種同步方式：

- **硬更新**：每 N 步直接複製 w' ← w
- **軟更新（Polyak）**：每步做 w' ← τ·w + (1−τ)·w'

講義也說明，目標值那一項要做 stop-gradient（semi-gradient），不然模型同時出現在等式兩邊，會有「追自己尾巴」的問題。第 31 頁再加兩個處理 TD 梯度的工具：**gradient clipping** 擋掉破壞性的雜訊、**Huber loss** 降低離群值的影響。

### Double Q：別用同一個網路選動作又估價值

第 19–20 頁先問：Q 值準嗎？一方面，DQN 在 Breakout、Seaquest 上預測的 Q 越高，實際回報也越高，方向是對的。但另一張圖取自 van Hasselt 的論文，在 Alien、Space Invaders、Time Pilot、Zaxxon 四個遊戲上，DQN 的 Q 估計都明顯高於它的真實值；Double DQN 的估計則貼近真實值得多。

第 21 頁解釋原因。max_a' Q_φ'(s', a') 可以拆成兩件事：用 Q_φ' **選**出最好的動作，再用 Q_φ' **估**這個動作的值。Q_φ' 有雜訊，對雜訊取 max 就會系統性地偏高。

TA 講義第 32 頁講得更直白：就算誤差是以零為中心，對它取最大值之後也不再以零為中心。**對無偏的雜訊取 max，得到的是有偏的結果。**

第 22 頁的解法：用兩個網路，一個選動作、另一個估值。兩個 Q 的雜訊不相關，問題就消失了。第 23 頁說明實務上不必另外訓練一個網路：

- 標準 Q-learning：y = r + γ Q_φ'(s', argmax_a' Q_φ'(s', a'))
- Double Q-learning：y = r + γ Q_φ'(s', argmax_a' **Q_φ**(s', a'))

也就是**用目前的網路選動作，仍然用 target network 估價值**。

TA 講義第 34 頁再往前推一步：既然兩個 Q 就能減少高估，也可以擴展成一整組 critic ensemble。這正是 HW2 Problem 3 的做法。

### N 步回報：用一點偏差換速度

第 24–25 頁回到 L4 的老問題。Monte Carlo 目標變異大；一步 bootstrap 偏差大；n 步回報介於兩者之間。Q-learning 也能用 n 步目標：

- **優點**：Q 值還不準的時候，目標值的偏差小很多；通常學得比較快，尤其是訓練初期。
- **缺點**：只有 on-policy 時才完全正確，因為中間那幾步的 reward 是收資料的 policy 拿到的。N=1 時沒有這個問題。

投影片列出三種處理方式，**最常見的是忽略這個問題，照樣用 N > 1**。另外兩種是動態選擇 N、只用符合目前 policy 的資料（資料大多 on-policy、動作空間小的時候可行），以及用 importance sampling。

TA 講義第 25–27 頁用 bias–variance 講同一件事：Bellman backup 的估計可能不正確（偏差），Monte Carlo 的估計會隨單條軌跡劇烈變動（變異），n 步回報的 k 就是調整兩者的旋鈕。

<details>
<summary>講義第 29 頁：離散與連續動作的 Q 網路長相</summary>

- 連續動作：網路輸入狀態和動作，輸出一個純量 Q^π(s, a)
- 離散動作：網路只輸入狀態，輸出一個向量，第 i 個分量是 Q^π(s, a_i)

離散版一次前向就拿到所有動作的 Q，取 argmax 很便宜。這也是為什麼投影片第 28 頁建議 DQN 用在離散或低維連續動作。

</details>

## 連回來：四類 online RL 方法總整理

第 26 頁舉了兩個實例：Q-learning 在大多數 Atari 遊戲上超越人類（Mnih et al. 2015），以及 Q-learning 訓練的機器人抓取系統（Kalashnikov et al. 2018）。

第 27 頁把到這裡的 online RL 方法整理成一張表：

| | Vanilla PG | PPO 類 | Off-policy AC（如 SAC） | Q-learning |
|---|---|---|---|---|
| 用什麼資料 | On-policy | 技術上 off-policy，常被稱為 on-policy | Off-policy，有 replay buffer | Off-policy，有 replay buffer |
| 怎麼變成 off-policy | 不適用 | Importance weight | 用 TD 擬合 Q，動作從 π 抽 | 用 TD 擬合 Q* |
| 擬合什麼價值函數 | 不擬合 | V^π | Q^π | Q* |
| 怎麼估「好壞」 | Σr − b | V 用 MC、TD 或 n 步；A 用 r+γV(s')−V(s) 或 GAE | TD 或 n 步 | TD 或 n 步 |
| Policy 怎麼更新 | ∇log π 乘 (Σr − b) | ∇log π 乘 Â | ∇log π 乘 Q̂ | argmax Q̂ |

第 28 頁是 Chelsea Finn 自己的建議：

- **PPO 及其變體**：在意穩定、好用，不在意資料效率時
- **DQN 及其變體**：動作是離散的，或是低維連續動作時
- **SAC 及其變體**：最在意資料效率，而且能接受調參、比較不穩時

**怎麼做**：把這張表印出來，讀任何一篇 RL 論文時先對照四個欄位：用什麼資料、擬合哪個價值函數、怎麼估好壞、policy 怎麼更新。大部分新方法都能放進其中一格，或是兩格的混合。

## 延伸：Distributional RL 與 2026 投影片沒講的

課表把 [Bellemare et al. 2017](https://arxiv.org/abs/1707.06887) 列為這講的閱讀，但 2026 投影片沒有任何一頁提到它。依論文摘要，它主張學習**回報的完整分佈**，而不只是期望值，並把 Bellman 方程用在近似的價值分佈上，在 Atari 遊戲上驗證。投影片沒展開，本文也不補寫細節。

TA 講義最後兩節是 DQN walkthrough 和 Soft Actor-Critic，PDF 上只有標題與圖，沒有可引用的文字。

下一講進入 offline RL：如果完全不能再和環境互動，這一講的 Q-learning 會怎麼壞掉。見 [L7 Offline RL](/posts/ai/2026-09-30-cs224r-offline-rl)。

站內延伸閱讀：

- [CS221 L8 強化學習與 Q-learning](/posts/ai/2026-08-22-stanford-cs221-lecture-08-reinforcement-learning-q-learning)，從表格型的角度講同一套想法
- [Berkeley CS285 的 policy 與 value 方法導讀](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods)。本講有多頁投影片標註「Slide adapted from Sergey Levine」

## 這一篇可以確認與不能確認的

可以確認：2026 投影片與 TA 講義的文字、公式與圖表標題，課表日期、地點與閱讀清單，2025 兩支影片的標題與長度。不能確認：第 7 頁思考題在課堂上給的答案、TA 加課的口頭內容、講義 DQN 與 SAC walkthrough 的細節。第 2 頁的課程提醒提到會分享「去年 head CA 的筆記」，這份筆記沒有出現在公開頁面上。

系列導覽：上一篇 [L5 Off-Policy Actor-Critic](/posts/ai/2026-09-30-cs224r-off-policy-actor-critic-ppo-sac)｜下一篇 [HW2：Gridworld Q-learning、PPO 與 Sawyer 鐵鎚任務](/posts/ai/2026-09-30-cs224r-hw2-online-rl-sawyer)｜[系列入口](/posts/ai/2026-09-30-cs224r-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [CS224R: Deep Reinforcement Learning（Spring 2026 課程官網與課表）](https://cs224r.stanford.edu/)
- [Lecture 6 投影片：Q-Learning（2026）](https://cs224r.stanford.edu/slides/06_cs224r_qlearning_2026.pdf)
- [TA 加課講義：Review of Q-Learning（Maximilian Du）](https://cs224r.stanford.edu/material/CS224R_Tutotial_Max.pdf)
- [Spring 2025 Lecture 6: Q-Learning（YouTube，補充）](https://www.youtube.com/watch?v=-7kv6jf0isQ)
- [Spring 2025 Tutorial Session: Review of Q-Learning（YouTube，補充）](https://www.youtube.com/watch?v=07MQNMcxhZU)
- [Mnih et al. 2013：Playing Atari with Deep Reinforcement Learning](https://arxiv.org/abs/1312.5602)
- [van Hasselt et al. 2015：Deep Reinforcement Learning with Double Q-learning](https://arxiv.org/abs/1509.06461)
- [Bellemare et al. 2017：A Distributional Perspective on Reinforcement Learning](https://arxiv.org/abs/1707.06887)
- [Stanford CS234: Reinforcement Learning](https://web.stanford.edu/class/cs234/)
