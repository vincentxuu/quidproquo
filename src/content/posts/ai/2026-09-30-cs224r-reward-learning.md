---
title: "CS224R L8：獎勵從哪裡來——從範例與偏好學獎勵"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, ai-course, stanford, reinforcement-learning, rlhf]
lang: zh-TW
series:
  name: "Stanford CS224R 導讀"
  order: 10
tldr: "CS224R Spring 2026 第八講先花幾頁複習 offline RL，再問一個前面七講都跳過的問題：獎勵從哪裡來？遊戲有分數，真實世界的機器人、對話和自駕通常沒有。投影片給兩條路。第一條是從成功範例訓練一個目標分類器當獎勵，但 RL 會去鑽分類器的漏洞，解法是把 policy 走過的狀態不斷加進負例，跟 GAN 同一個結構。第二條是請人比較兩條軌跡哪條好，用 Bradley-Terry 式的 log σ(r(τw) − r(τl)) 學獎勵，這也是 LLM 的 RLHF 在用的方法。整講的第一個重點只有一句：獎勵不能視為理所當然。"
description: "Stanford CS224R（Spring 2026）第八講導讀：依官方 08_cs224r_reward_learning_2026 投影片整理 offline RL 兩個關鍵想法的複習與 π*0.6 例子、任務規格為什麼難、目標分類器與被鑽漏洞的問題、VICE 式的負例更新與 GAN 的關係、從人類偏好學獎勵（Christiano 2017）、LLM 的 RLHF 三階段與 RLAIF。配套影片為 Spring 2025 L8（補充）。"
draft: false
glossary:
  - term: "goal classifier"
    aliases: ["目標分類器", "success classifier"]
    definition: "用成功與不成功狀態的範例訓練的二元分類器，輸出當作 RL 的獎勵訊號。"
    context: "CS224R L8 的第一種獎勵學習方法；直接拿預訓練好的分類器當獎勵容易被 RL 鑽漏洞。"
  - term: "reward hacking"
    aliases: ["exploiting the reward", "鑽獎勵漏洞"]
    definition: "policy 找到讓學到的獎勵函數給高分、實際上卻沒完成任務的狀態或行為。"
    context: "CS224R L8 用它說明為什麼目標分類器要在 RL 過程中持續更新。"
  - term: "Bradley-Terry model"
    aliases: ["Bradley-Terry", "BT 模型"]
    definition: "把「A 比 B 好」的機率寫成 σ(r(A) − r(B)) 的配對比較模型，σ 是 sigmoid。"
    context: "CS224R L8 用它從人類的軌跡偏好學出獎勵函數；LLM 的 reward model 也用同一個目標。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs224r-reward-learning-en)

**影片狀態：僅附相關補充影片；原講次錄影未確認。** [影片來源與說明](#課程影片來源)

> **來源年份**：依據 Spring 2026 的 [08_cs224r_reward_learning_2026 投影片](https://cs224r.stanford.edu/slides/08_cs224r_reward_learning_2026.pdf)（課表日期 2026-04-24）。配套影片是 [Spring 2025 L8 錄影（補充）](https://www.youtube.com/watch?v=PDIxDhA9Z6Y)，標題相同，但開頭的 offline RL 複習不同：[2025 的 L8 投影片](https://cs224r.stanford.edu/spring_2025/slides/08_cs224r_reward_learning_2025.pdf)標題是「Conservative Offline RL and Reward Learning」，複習段講的是保守式方法；2026 版改成複習 L7 的兩個關鍵想法，再加一個 π*0.6 的例子。reward learning 部分的三個小節兩年相同。本文是 [Stanford CS224R 導讀](/posts/ai/2026-09-30-cs224r-course-overview)系列的第 10 篇。

從 [L1](/posts/ai/2026-09-30-cs224r-intro-mdps-behavior) 開始，[CS224R](https://cs224r.stanford.edu/) 一直把 reward r(s, a) 當成已知。第八講終於回頭問：這個數字到底誰給的？

投影片的學習目標有兩條：

- 為什麼任務規格很難寫（以及為什麼天真的做法會失敗）
- 從人類監督學獎勵的方法

當天的計畫分成兩部分。第一部分是 offline RL 的複習和例子，投影片標註「HW3 的一部分」；第二部分是 reward learning，其中「從人類偏好學獎勵」標註為「default project 的一部分」和「LLM 就是這樣被監督的」。

## 課程影片來源

本文以 Spring 2026 教材為準；下列 Spring 2025 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=PDIxDhA9Z6Y
title: Spring 2025 Lecture 8: Reward Learning（YouTube，補充）
```

原始影片：[Spring 2025 Lecture 8: Reward Learning（YouTube，補充）](https://www.youtube.com/watch?v=PDIxDhA9Z6Y)

課程與錄影入口：

- [官方課程／講次來源](https://cs224r.stanford.edu/)

Spring 2026 當季講次錄影放在需 Stanford 登入的 Canvas／Panopto；公開 YouTube 播放清單是 Spring 2025。 查核日期：2026-10-10。

## 先收尾 offline RL

這段是把 [L7](/posts/ai/2026-09-30-cs224r-offline-rl) 濃縮成兩個關鍵想法。問題設定不變：資料來自未知的 πβ，想在 πθ 下最大化獎勵。

投影片先補一句 L7 沒明講的對比：Q-function 在 OOD 動作上的查詢會造成高估。**線上 RL 裡，新 policy 收來的資料會在之後幾輪修正這些錯誤；offline RL 沒有額外資料，所以要更保守。**

- **關鍵想法 1**：只在從資料取樣的動作上訓練 policy，例如 advantage-weighted regression。AWR 還擬合 πβ 而不是 πθ 的價值，所以連 value function 都不會查詢 OOD 動作。
- **關鍵想法 2**：用不對稱的 expectile loss 擬合比 πβ 更好的 policy 的價值，再用這個 V 擬合 Q。這是 IQL 的做法。

接著投影片舉了一個實際例子：[π*0.6（2025）](https://arxiv.org/abs/2511.14759)用「反覆 offline RL」做機器人 post-training，流程是三步：

1. 用 π 收一大批資料（roll-out 和 DAgger 混合）
2. 用 Monte Carlo 擬合 V^πβ
3. 訓練一個以 advantage 為條件的 policy π(aₜ | sₜ, Â(sₜ, aₜ))

投影片只列到這個程度，細節要看原論文。這個例子把 L2 的 DAgger、L7 的 Monte Carlo value 和 advantage 串在一起。

## 獎勵從哪裡來

投影片左邊放電腦遊戲（引 Mnih 等人 2015 的 Atari），遊戲本身就有分數。右邊是真實世界：機器人、對話、自動駕駛，旁邊只寫一句「reward 是什麼？」，實務上通常用代理指標（proxy）。

有沒有更簡單的方式提供任務監督？前面其實已經看過一種：**直接模仿專家的動作**。但投影片列了它的限制：

- 不推理結果或 dynamics
- 專家的自由度可能跟機器人不一樣
- 有些任務根本沒辦法示範

所以問題變成：**能不能推理出專家想達成什麼？**

## 路線一：從目標範例學獎勵

### 目標分類器

最直接的想法是學一個分辨「目標狀態」和「其他狀態」的分類器。投影片的例子是「把鉛筆盒放到筆記本後面」：

1. 收集成功和不成功的狀態範例（在目標集合 G 內和外）
2. 訓練二元分類器，輸入 sᵢ，標籤是 1(sᵢ ∈ G)
3. 用分類器的輸出當獎勵跑 RL

投影片接著問：會出什麼錯？答案是 **RL 會去找分類器認為好的狀態**，而這些狀態很可能是分類器沒看過的。policy 找到的是分類器的弱點，不是任務的解。

### 把 policy 走過的狀態加進負例

投影片提出的修正出自 [Fu 等人 2018（VICE）](https://arxiv.org/abs/1805.11686)：

1. 收集初始的成功狀態 D+ 和不成功狀態 D−
2. 用 D+ 和 D− 更新分類器，每個 batch 保持 50/50
3. 用 policy π 收經驗
4. 用分類器給的獎勵更新 π
5. 把走過的狀態加進負例：D− ← D− ∪ {sₜ}

課堂上先讓學生想三個問題：分類器會準嗎？policy 會有用嗎？對成功狀態，分類器會輸出什麼？投影片給的答案：

- 分類器沒辦法被鑽漏洞，因為 policy 去過的地方都會變成負例
- 但如果有些走過的狀態其實是成功的呢？
- 只要 batch 維持平衡，分類器對成功狀態的輸出仍會 ≥ 0.5

### 機器人上的結果

投影片引 [Sharma 等人 2023](https://arxiv.org/abs/2303.01488) 的實驗：收 50 條示範，最後狀態當成功範例，示範也拿來初始化 RL 的 replay buffer。直接模仿示範的成功率是 26%，用學到的分類器訓練 RL policy 是 62%。投影片旁邊特別註明：**分類器要做正則化**。

### 這就是 GAN 的結構

投影片插了一段旁註：GAN 也是這樣運作。先訓練分類器分辨真實資料和生成資料，再訓練生成器產生分類器以為是真的資料。收斂時，生成器會對上資料分佈 p(x)。例子是 ViT-VQGAN 和 Phenaki 的影片生成。

對照一下：policy 是生成器，成功範例是真實資料，目標分類器是判別器。

投影片對這條路的整理：

| | |
|---|---|
| 優點 | 實用的任務規格框架 |
| 要注意 | 對抗式訓練可能不穩定（GAN 文獻有很多正則化技巧可用） |
| 缺點 | 需要期望行為或結果的範例 |

另一個重點：只有成功範例時，可以學目標分類器；有完整示範時，可以學完整的獎勵。

## 路線二：從人類偏好學獎勵

### 比較比打分數容易

如果不要示範、也不要目標範例，改成讓人對 policy 的 roll-out 給回饋呢？投影片列兩種問法：

- 「這條軌跡有多好？」
- 「哪條軌跡比較好？」

投影片的判斷是：**相對偏好比較容易給。**

### 從偏好到獎勵函數

人說 τw 比 τl 好，寫成 τw ≻ τl。我們想要一個獎勵 rθ，讓 τw 上的獎勵總和大於 τl 上的總和。τ 可以是完整或部分的 roll-out。

投影片的說法是：人在做分類，判斷哪條軌跡比較好，所以獎勵也應該是判別式的。具體做法是把 σ(rθ(τa) − rθ(τb)) 定義成「τa 比 τb 好」的估計機率，然後最大化對數機率：

```text
max_θ  E_{τw, τl} [ log σ( rθ(τw) − rθ(τl) ) ]
```

完整的演算法：

1. 從資料集 {τᵢ} 抽 k 條軌跡一組，請人排序（LLM 的情況，這 k 條都來自同一個 prompt）
2. 用目前的 rθ 算出每條軌跡的獎勵
3. 對每組的 k 取 2 個配對，計算上式的梯度
4. 用梯度更新 θ

投影片特別註明：這可以放在線上 RL 的迴圈裡做。

### 兩個例子

- [Christiano 等人 2017](https://arxiv.org/abs/1706.03741) 在線上 RL 的迴圈裡學獎勵，投影片寫用了 900 次人類偏好查詢
- Sadigh 等人 2017（RSS）用偏好學駕駛的獎勵，拿來權衡不同因素

### 套到 LLM：RLHF

LLM 的版本是：給 prompt x，取樣兩個回答 y 和 y′，請人判斷哪個好，訓練一個 reward model r(x, y) 評估回答 y 對 prompt x 有多好。

投影片把它放進 LLM 訓練的三階段：

1. 大規模預訓練：下一個 token 預測，資料品質混雜
2. 監督式微調：用品質較高的（prompt, response）
3. RLHF：
   - 3a. 收集偏好資料
   - 3b. 訓練 reward model
   - 3c. 用 RL 最大化獎勵（例如 PPO）

### RLAIF：換成 AI 來回饋

投影片最後一個變化是把人換成另一個語言模型，問它「哪個回答比較無害？」，出處是 [Anthropic 的 Constitutional AI（2022）](https://arxiv.org/abs/2212.08073)。投影片寫的關鍵洞察是：**批評比生成容易**。

## 整理：兩條路的取捨

投影片的總結頁第一行是：**獎勵不能視為理所當然。**

| | 從目標、示範學 | 從人類偏好學 |
|---|---|---|
| 優點 | 實用的任務規格框架 | 配對偏好容易給，不需要目標範例或示範；已經大規模部署 |
| 要注意 | 對抗式訓練可能不穩定 | |
| 缺點 | 需要期望行為或結果的範例 | 可能需要在 RL 迴圈裡持續監督，通常花更多人力時間 |

投影片留了一個思考題：還有哪些形式的回饋或監督可能有用？

最後一頁提到一整個「非監督式 RL」領域：agent 能不能自己提出目標？例子是 [Sukhbaatar 等人 2018 的 asymmetric self-play](https://arxiv.org/abs/1703.05407)，把問題寫成雙人遊戲，一個出目標，一個去達成。

## 今晚可以做的事

挑一個你在做的 agent 或 LLM 功能，寫出你現在用的「獎勵」是什麼：人工評分、規則、LLM judge，還是使用者按讚。然後照這講的兩個問題檢查它：policy 最佳化它的時候，會不會找到「分數高但沒完成任務」的輸出？如果會，你能不能像 VICE 一樣，把被鑽漏洞的輸出持續加回負例？

## 延伸閱讀

- [CS224R L9：RLHF 與偏好最佳化](/posts/ai/2026-09-30-cs224r-rlhf-dpo-preference-optimization)：同系列下一講，從 reward model + RL 走到 DPO
- [CME295：偏好微調](/posts/ai/2026-09-29-cme295-preference-tuning)：從 LLM 角度看 RLHF 和 DPO
- [CS336：SFT 與 RLHF](/posts/ai/2026-08-22-cs336-sft-rlhf)：實作面的 post-training 流程

**系列導覽**：上一篇 [L7：Offline RL](/posts/ai/2026-09-30-cs224r-offline-rl)｜下一篇 [HW3：AWAC、IQL 與 AntMaze 上的 stitching](/posts/ai/2026-09-30-cs224r-hw3-offline-rl-awac-iql)｜[系列總覽](/posts/ai/2026-09-30-cs224r-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入的影片屬於較早學期的公開錄影，不是 2026 當季課程，狀態改為相關補充影片。

## 參考資料

- [CS224R 課程首頁與課表（Spring 2026）](https://cs224r.stanford.edu/)
- [Lecture 8 投影片：Recap of offline RL + Reward Learning（2026）](https://cs224r.stanford.edu/slides/08_cs224r_reward_learning_2026.pdf)
- [Spring 2025 Lecture 8: Reward Learning（YouTube，補充）](https://www.youtube.com/watch?v=PDIxDhA9Z6Y)
- [Christiano et al. Deep Reinforcement Learning from Human Preferences（arXiv 1706.03741）](https://arxiv.org/abs/1706.03741)
- [Fu et al. Variational Inverse Control with Events（arXiv 1805.11686）](https://arxiv.org/abs/1805.11686)
- [Sharma et al. Self-Improving Robots: End-to-End Autonomous Visuomotor Reinforcement Learning（arXiv 2303.01488）](https://arxiv.org/abs/2303.01488)
- [Bai et al. Constitutional AI: Harmlessness from AI Feedback（arXiv 2212.08073）](https://arxiv.org/abs/2212.08073)
- [π*0.6: a VLA That Learns From Experience（arXiv 2511.14759）](https://arxiv.org/abs/2511.14759)
- [Sukhbaatar et al. Intrinsic Motivation and Automatic Curricula via Asymmetric Self-Play（arXiv 1703.05407）](https://arxiv.org/abs/1703.05407)
