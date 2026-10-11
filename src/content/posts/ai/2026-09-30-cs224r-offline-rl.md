---
title: "CS224R L7：Offline RL——不能再互動時，Q-learning 為什麼會壞掉"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, ai-course, stanford, reinforcement-learning, offline-rl]
lang: zh-TW
series:
  name: "Stanford CS224R 導讀"
  order: 9
tldr: "CS224R Spring 2026 第七講處理一個問題：手上只有一批別人收的資料、不能再跟環境互動時，要怎麼學出比資料更好的 policy。直接拿 SAC 這類 off-policy 演算法來訓練會壞掉，因為 Q-function 在資料沒出現過的動作上亂估，policy 又專挑被高估的動作。投影片給兩類解法：只在資料裡的動作上訓練 policy（filtered BC、AWR、AWAC），以及用不對稱的 expectile loss 估計比資料更好的 policy 的價值、完全不查詢資料外的動作（IQL）。兩者都能做到模仿學習做不到的事：把不同軌跡的好片段拼起來。"
description: "Stanford CS224R（Spring 2026）第七講導讀：依官方 07_cs224r_offline_rl_2026 投影片整理為什麼需要 offline RL、data stitching 的例子、off-policy 演算法在靜態資料上高估 Q 值的原因、filtered BC 與 advantage-weighted regression、AWAC，以及用 expectile regression 的 IQL。配套影片為 Spring 2025 L7（補充）。"
draft: false
glossary:
  - term: "offline RL"
    aliases: ["離線強化學習", "batch RL"]
    definition: "只用一批固定、事先收集好的資料訓練 policy，訓練期間不再跟環境互動收新資料。"
    context: "CS224R L7 的設定：資料來自未知的 behavior policy πβ，目標是讓學到的 πθ 期望獎勵最大。"
  - term: "behavior policy"
    aliases: ["πβ", "行為策略"]
    definition: "產生 offline 資料集的那個（或那些）policy，通常未知，可能是多個 policy 的混合。"
    context: "CS224R 投影片的資料來源例子有人類收集、手工設計的控制器、之前的 RL 訓練，或以上混合。"
  - term: "data stitching"
    aliases: ["trajectory stitching", "軌跡拼接"]
    definition: "把資料集中不同軌跡的好片段組合起來，得到一條資料裡沒有完整出現過的更好路徑。"
    context: "CS224R L7 用它說明 offline RL 為什麼能勝過模仿學習。"
  - term: "expectile regression"
    aliases: ["expectile loss", "期望分位數回歸"]
    definition: "用不對稱的平方損失，讓估計值落在分佈偏高或偏低的位置，而不是平均值。"
    context: "IQL 用它估計資料支撐範圍內較好動作的價值，不需要查詢資料外的動作。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs224r-offline-rl-en)

**影片狀態：僅附相關補充影片；原講次錄影未確認。** [影片來源與說明](#課程影片來源)

> **來源年份**：依據 Spring 2026 的 [07_cs224r_offline_rl_2026 投影片](https://cs224r.stanford.edu/slides/07_cs224r_offline_rl_2026.pdf)（課表日期 2026-04-22）。配套影片是 [Spring 2025 L7 錄影（補充）](https://www.youtube.com/watch?v=lRDaXnPIzks)，標題相同，但切分不同：[2025 的 L7 投影片](https://cs224r.stanford.edu/spring_2025/slides/07_cs224r_offline_rl_2025.pdf)把「implicit policy constraint」和「conservative methods」（[CQL](https://arxiv.org/abs/2006.04779)）並列為兩類方法，課表也把 CQL 列為指定閱讀；2026 版的第二類改成 IQL 的 expectile 做法，指定閱讀只剩 [IQL](https://arxiv.org/abs/2110.06169)。我讀過這支 L7 影片的字幕，它沒有講 CQL（講到 IQL 為止，結尾提到 IDQL）；2025 的 CQL 段落在下一講 L8 錄影的開頭，不在這支影片裡。本文是 [Stanford CS224R 導讀](/posts/ai/2026-09-30-cs224r-course-overview)系列的第 9 篇。

前面幾講（[L3 policy gradients](/posts/ai/2026-09-30-cs224r-policy-gradients) 到 [L6 Q-learning](/posts/ai/2026-09-30-cs224r-q-learning)）都有一個共同假設：policy 可以一邊學、一邊到環境裡收新資料。[CS224R](https://cs224r.stanford.edu/) 的第七講拿掉這個假設。現在你只有一批固定的資料，不能再互動，要怎麼學？

投影片把當天的學習目標寫成三條：

- offline RL 的關鍵挑戰是什麼
- 兩類 offline RL 核心技巧，以及它們**為什麼有效**
- offline RL 怎麼做到比模仿學習更好

這講也是 [HW3](/posts/ai/2026-09-30-cs224r-hw3-offline-rl-awac-iql) 的理論基礎，投影片在 AWAC 和 IQL 兩頁都直接寫「你會在 HW3 實作它」。

## 課程影片來源

本文以 Spring 2026 教材為準；下列 Spring 2025 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=lRDaXnPIzks
title: Spring 2025 Lecture 7: Offline RL（YouTube，補充）
```

原始影片：[Spring 2025 Lecture 7: Offline RL（YouTube，補充）](https://www.youtube.com/watch?v=lRDaXnPIzks)

內容核對：已依字幕核對（2026-10-10）：抽樣讀取 Spring 2025 L7 Offline RL 字幕（前／中／後段加關鍵字搜尋，非逐字比對）。確認影片是 L7、講者為 Chelsea Finn，內容是 offline RL 的分佈偏移問題、filtered BC／advantage-weighted 方法、IQL 與 expectile regression（結尾提到 IDQL）。發現並修正：原文說「看影片時遇到 CQL 的段落」，但這支 L7 影片完全沒有講 CQL；CQL 在下一講（L8 Reward Learning）錄影的開頭。本文以 2026 投影片為準，影片只當補充。

課程與錄影入口：

- [官方課程／講次來源](https://cs224r.stanford.edu/)

Spring 2026 當季講次錄影放在需 Stanford 登入的 Canvas／Panopto；公開 YouTube 播放清單是 Spring 2025。 查核日期：2026-10-10。

## 先回顧：線上 RL 的四種 model-free 演算法

投影片開頭用一張表收束前半學期：

| | Vanilla PG | PPO 類 | Off-policy actor-critic（如 SAC） | Q-learning |
|---|---|---|---|---|
| 用什麼資料 | on-policy | 技術上是 off-policy，通常稱 on-policy | off-policy，有 replay buffer | off-policy，有 replay buffer |
| 怎麼變成 off-policy | 不適用 | importance weights | 用 TD 擬合 Q，從 π 取樣 a | 用 TD 擬合 Q* |
| 擬合哪個 value | 不擬合 | V^π | Q^π | Q* |

最右邊兩欄已經能用舊資料了。那 offline RL 還有什麼難的？這講後半就是在回答這個問題。

## 為什麼需要 offline RL

線上 RL 的流程是「收資料 → 用最新或全部資料更新 policy → 再收資料」。Offline RL 只有前半：給一份靜態資料集，在上面訓練 policy，結束。

投影片列三個適用情境：

1. 想利用別人或既有系統已經收好的資料
2. 線上收資料有風險、不安全
3. 重複使用以前收過的資料，不要每次重收（例如之前的實驗、專案、機器人或其他機構的資料）

投影片也提醒兩種混合做法：先 offline 預訓練再 online 微調，以及反覆做 offline 訓練的「batch online RL」。

形式上，資料來自某個**未知**的 behavior policy πβ（可能是多個 policy 的混合），目標卻是在**學到的** policy πθ 下最大化期望獎勵。兩個分佈不一樣，這就是 distribution shift。資料來源的例子有：人類收集、手工設計的控制器、之前的 RL 訓練，或以上混合。

## Stitching：offline RL 跟模仿學習差在哪

投影片用一張九個狀態的圖說明。資料裡有兩條不完整的好行為：s1 → s3 是好的，s7 → s9 也是好的，走到 s9 得 +1，走到 s6 得 −1。問題是：能不能學出一個從 s1 一路走到 s9 的 policy？

投影片丟出兩個問題：

1. 用一般模仿學習學到的 policy 會做什麼？
2. 用 RL 學到的 policy 應該做到什麼？答案跟 value function 用 TD 還是 Monte Carlo 學有沒有關係？

投影片給的結論是三句話：

- 模仿學習的表現沒辦法超過收集資料的 policy
- offline RL 可以利用獎勵資訊，超過 behavior policy
- 好的 offline RL 方法能把好的行為**拼接（stitch）**起來

第二題投影片沒有直接寫答案。我的理解是：TD 用下一個狀態的估計值當目標，只要兩條軌跡經過同一個狀態，後段軌跡的高價值就能往回傳到前段；Monte Carlo 只加總同一條軌跡實際拿到的獎勵，傳不過去。後面 AWR 那頁寫「Monte Carlo 估計雜訊大」，IQL 則改用 TD，可以對照著讀。

## 為什麼不能直接拿 off-policy 演算法來用

SAC 這類 off-policy actor-critic 本來就能用 replay buffer 裡的舊資料。把 buffer 換成一份固定資料集，會發生什麼事？

關鍵在 critic 的目標值 r + γ·E_{a′~πθ}[Q(s′, a′)]。這裡的 a′ 是從**正在學的 policy** 取樣，很可能是資料裡從沒出現過的動作（out-of-distribution，OOD）。投影片畫了一條隨機初始化的 Q(s′, a′) 曲線，只有資料支撐範圍內被訓練過，範圍外的值是隨便的。接著就會連鎖出錯：

- Q-function 在 OOD 動作上不可靠
- policy 會去找 Q-function 過度樂觀的動作
- policy 更新之後，Q 值被嚴重高估

投影片也給了另一個角度：學到的 policy 偏離 behavior policy 太遠。下一講開頭的複習補上一句關鍵差別：線上 RL 裡，新 policy 收來的資料會在之後修正這些錯誤；offline RL 沒有新資料，所以要更保守。

投影片說得很直接：**怎麼減少高估，就是 offline RL 方法的核心目標。**

## 第一類技巧：只在資料裡的動作上訓練 policy

### Filtered behavior cloning

有獎勵標註的話，最簡單的做法是只模仿好的軌跡：

1. 依 return 排序所有軌跡
2. 只留前 k%
3. 對留下的資料做 behavior cloning，最大化 log πθ(a | s)

投影片評它「非常原始」，所以正好拿來當比較的 baseline。HW3 的 PointMass 題也用它當對照組。

### Advantage-weighted regression（AWR）

比「留或不留」更細的做法，是依每個動作有多好來加權。衡量動作好壞的工具是 L4 講過的 advantage：

```text
θ ← argmax_θ  E_{(s,a)~D} [ log πθ(a | s) · exp(A(s, a)) ]
```

這仍然是模仿學習，只是每筆資料乘上一個權重。投影片附了一個旁註：可以證明這個加權目標近似於「在 KL(π‖πβ) < ε 的限制下最大化 Q」，出處是 Peters 等人的 REPS 和 Rawlik 等人的 psi-learning。換句話說，只在資料的動作上做加權模仿，等於隱含地把 policy 綁在 πβ 附近。

接下來的問題是 advantage 怎麼估。[AWR（Peng 等人 2019）](https://arxiv.org/abs/1910.00177)的做法最簡單：用 Monte Carlo 擬合 V^πβ，advantage 就是實際 return 減掉 V。完整演算法兩步：擬合 value function，再用 exp(advantage / α) 加權模仿，α 是超參數。

投影片列的優缺點：

| 優點 | 缺點 |
|---|---|
| 簡單 | Monte Carlo 估計雜訊大 |
| 完全不查詢、也不在 OOD 動作上訓練 | 估的是 πβ 的 advantage，比 πθ 弱 |

投影片還留了一題：如果 πβ 是確定性的，你會學到什麼？值得停下來想。

### AWAC：改用 TD 估 advantage

要估**目前 policy** πθ 的 advantage，可以改用 TD 擬合 Q^πθ，advantage 是 Q(s, a) − E_{ā~πθ}[Q(s, ā)]，再用它做 AWR 式的更新。投影片把這叫做「advantage-weighted actor-critic」，也就是 [AWAC](https://arxiv.org/abs/2006.09359)。

| 優點 | 缺點 |
|---|---|
| 得到的是目前 policy πθ 的 Q，不是 πβ 的 | TD 目標要查詢 OOD 動作的 Q 值 |
| policy 仍然只在資料的動作上訓練 | |

投影片在這裡也提到一個替代寫法：TD 目標裡的 a′ 改從資料取樣（a′ ~ D）。於是逼出這講的關鍵問題：**能不能估計比 πβ 更好的 policy 的 advantage，同時完全不查詢 OOD 動作？**

## 第二類技巧：不查詢 OOD 動作，也能估更好的價值

### 想法：不對稱的損失

如果 TD 目標裡的 a′ 從資料取樣，得到的是 Q^πβ，也就是 behavior policy 的價值。投影片畫了一張 V(s) 的直方圖：同一個狀態下，資料裡不同動作的 Q 值有高有低。一般的 L2 損失會學到平均值 E_{a~πβ}[Q(s, a)]；我們想要的是「資料支撐範圍內最好的 policy」的價值，也就是分佈偏高的那一端。

工具是 **expectile regression**。它把 L2 損失改成不對稱：誤差在一側乘 λ，另一側乘 1 − λ。調整 λ，估計值就會往分佈的高端或低端移，而不是停在平均值。

### IQL 的完整演算法

投影片列的 [Implicit Q-Learning（Kostrikov、Nair、Levine，ICLR 2022）](https://arxiv.org/abs/2110.06169)是三步：

1. **擬合 V**：對 V(s) − Q̂(s, a) 用 expectile loss，λ 取小於 0.5 的值
2. **更新 Q**：一般的 MSE，目標是 r + γ·V̂(s′)
3. **抽出 policy**：用 AWR，權重是 exp((Q̂(s, a) − V̂(s)) / α)

> **注意符號方向。** 投影片把損失寫在 V − Q 上，所以取「小的 λ」；IQL 原論文和 HW3 PDF 把損失寫在 Q − V 上，取的是大於 0.5 的值。兩種寫法都是要 V 落在偏高的 expectile，做 HW3 時別被方向搞混。

投影片列的優點：

- 完全不需要查詢 OOD 動作
- policy 仍然只在資料的動作上訓練
- actor 和 critic 的訓練解耦，計算上很快

名字的由來也寫在投影片上：policy improvement 是**隱含**在 expectile 裡完成的，所以叫 implicit Q-learning。

## 整理：這講的三個技巧

投影片最後一頁的總結：

- **為什麼要 offline RL**：線上資料很貴，重用 offline 資料是好事
- **關鍵挑戰**：πβ 和 πθ 之間的分佈差異，導致 Q 值被高估
- **技巧**：
  1. filtered 或 weighted 模仿學習是簡單的 baseline
  2. 只在資料的動作上監督，隱含地把 policy 限制在 πβ 附近
  3. 用不對稱損失估計比 πβ 更好的 policy 的價值
- **Trajectory stitching** 讓 offline RL 能勝過模仿學習

下一講開頭會再用一頁複習這兩個關鍵想法，並舉一個機器人 post-training 的實際例子。

## 今晚可以做的事

拿紙畫出投影片那張九狀態圖，假設資料只有兩條軌跡：s1 → s2 → s3 → s4 → s6（得 −1）和 s7 → s8 → s3 → s5 → s9（得 +1）。這兩條軌跡是我為了練習自己編的，不是投影片上的原始資料。分別用 Monte Carlo 和 TD 算一次 V(s3)、V(s2)，看看哪一種會讓「從 s1 出發」的 policy 知道該往 s9 走。算完再回頭讀 filtered BC 那段：只留 return 最高的軌跡，它會學到什麼？

## 延伸閱讀

- [Berkeley CS285：推論與 offline RL](/posts/learning/2026-08-22-berkeley-cs285-inference-offline-rl)：同一主題的另一種講法，涵蓋更多保守式方法
- [CS224R L6：Q-learning](/posts/ai/2026-09-30-cs224r-q-learning)：本講的 TD 目標與 target network 都從這裡來

**系列導覽**：上一篇 [HW2：線上 RL](/posts/ai/2026-09-30-cs224r-hw2-online-rl-sawyer)｜下一篇 [L8：獎勵從哪裡來](/posts/ai/2026-09-30-cs224r-reward-learning)｜[系列總覽](/posts/ai/2026-09-30-cs224r-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入的影片屬於較早學期的公開錄影，不是 2026 當季課程，狀態改為相關補充影片。
- 2026-10-10：依字幕核對影片內容。發現 L7 影片沒有講 CQL（CQL 在 L8 錄影開頭），已更正原文「看影片時遇到 CQL 的段落」。

## 參考資料

- [CS224R 課程首頁與課表（Spring 2026）](https://cs224r.stanford.edu/)
- [Lecture 7 投影片：Offline Reinforcement Learning（2026）](https://cs224r.stanford.edu/slides/07_cs224r_offline_rl_2026.pdf)
- [Spring 2025 Lecture 7: Offline RL（YouTube，補充）](https://www.youtube.com/watch?v=lRDaXnPIzks)
- [CS224R Spring 2025 封存頁（課表與指定閱讀）](https://cs224r.stanford.edu/spring_2025/)
- [Kostrikov, Nair, Levine. Offline Reinforcement Learning with Implicit Q-Learning（arXiv 2110.06169）](https://arxiv.org/abs/2110.06169)
- [Peng, Kumar, Zhang, Levine. Advantage-Weighted Regression（arXiv 1910.00177）](https://arxiv.org/abs/1910.00177)
- [Nair, Gupta, Dalal, Levine. AWAC: Accelerating Online Reinforcement Learning with Offline Datasets（arXiv 2006.09359）](https://arxiv.org/abs/2006.09359)
- [Kumar et al. Conservative Q-Learning for Offline Reinforcement Learning（arXiv 2006.04779，2025 指定閱讀）](https://arxiv.org/abs/2006.04779)
