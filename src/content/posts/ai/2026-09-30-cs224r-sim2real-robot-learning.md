---
title: "CS224R L16：Sim-to-Real 機器人學習"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, ai-course, stanford, reinforcement-learning, embodied-ai, sim-to-real]
lang: zh-TW
series:
  name: "Stanford CS224R 導讀"
  order: 19
tldr: "模擬器便宜、快、安全，還附贈真實世界拿不到的標籤，但它永遠和真實世界有落差。CMU 的 Guanya Shi 在 CS224R 第 16 講把縮小落差的方法分成三類：domain randomization 讓一個 policy 在很多種物理參數下都能用；teacher-student 先用特權資訊訓練老師、再讓只看得到真實感測器的學生去模仿；real2sim2real 用真實資料把模擬器修得更像。進階題目是用人類動作資料定義任務，以及挑選適合 sim2real 的 RL 演算法。"
description: "Stanford CS224R Spring 2026 第 16 講（客座：Guanya Shi，CMU／Amazon FAR）導讀：物理模擬器與框架的區分、sim2real 的通用流程與兩類 mismatch、domain randomization、learning to adapt 與 teacher-student、RMA 與 asymmetric actor-critic、system ID 與 actuator net、用人類資料做 retargeting、sim2real 用的 RL 演算法，以及 Sim2Real 1.0 到 4.0 的演進，加上課表指定閱讀 Tan et al. 2018。"
draft: false
glossary:
  - term: "domain randomization"
    aliases: ["領域隨機化"]
    definition: "在模擬器裡隨機化環境參數 e（質量、摩擦、感測延遲、外觀等），訓練單一 policy π(x) 在各種 e 下都能完成任務，讓它對真實世界的未知參數夠穩健。講者把它類比為 robust control。"
    context: "CS224R L16 縮小 sim2real 落差的第一類方法。"
  - term: "privileged teacher"
    aliases: ["特權老師", "teacher-student"]
    definition: "先在模擬器裡用只有模擬器才有的特權資訊（接觸、地形、摩擦、擾動等）訓練老師 policy π(x, e)，再訓練只吃真實世界可得觀測的學生 policy 去模仿老師，最後把學生部署到真機。第二階段是一個模仿學習問題。"
    context: "CS224R L16 的 learning to adapt 通用流程。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs224r-sim2real-robot-learning-en)

**本文依據 [CS224R](https://cs224r.stanford.edu/) Spring 2026 版。** 這是 [Stanford CS224R 導讀](/posts/ai/2026-09-30-cs224r-course-overview)系列第 19 篇，接續 [L15 階層式 RL 與模仿學習](/posts/ai/2026-09-30-cs224r-hierarchical-rl-il)，對應 2026 年 5 月 22 日（第 8 週週五）的第 16 講「RL for Robots: Sim-to-Real Transfer」。這講是客座演講，講者是 [Guanya Shi](https://lecar-lab.github.io/)，投影片上的頭銜是 CMU Robotics Institute 助理教授、Amazon Frontier AI & Robotics（FAR）的 Amazon Scholar。

用到的官方材料：

- 當期投影片 [16_cs224r_sim2real_robot_learning_2026.pdf](https://cs224r.stanford.edu/slides/16_cs224r_sim2real_robot_learning_2026.pdf)（46 頁，標題是「Sim2Real Robot Learning: A Holistic Overview」）
- 課表上的指定閱讀：[Sim-to-Real: Learning Agile Locomotion For Quadruped Robots（Tan et al. 2018）](https://arxiv.org/abs/1804.10332)

存取等級是 **A3**：投影片匿名可下載，2026 錄影只放在 Canvas 上。

**配套影片的差異要先講清楚。** 2025 年這一段的切法不一樣：2025 的 L16 是「RL for Robots: Autonomous Learning」，sim-to-real 放在 2025 L17，封存頁列的客座講者是 Ashish Kumar，YouTube 上的標題是 [Lecture 17: Advancing Robot Intelligence](https://www.youtube.com/watch?v=Hp1WBWghrak)（約 50 分鐘）。講者不同，內容不能和 2026 對等引用，只適合當背景。本文完全依 2026 投影片寫。

## 課程影片來源

本文以 Spring 2026 教材為準；下列 Spring 2025 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=Hp1WBWghrak
title: Spring 2025 Lecture 17: Advancing Robot Intelligence（YouTube，講者不同，只當背景）
```

原始影片：[Spring 2025 Lecture 17: Advancing Robot Intelligence（YouTube，講者不同，只當背景）](https://www.youtube.com/watch?v=Hp1WBWghrak)

課程與錄影入口：

- [官方課程／講次來源](https://cs224r.stanford.edu/)

## 場景：為什麼要在模擬器裡學

上一講結尾說，接下來兩講要處理 RL 用在機器人上的特殊考量。第一個是：真機器人很貴、很慢、會壞，能不能在模擬器裡學好再搬出來？

講者一開始先打預防針（第 2 頁）：sim2real 題目很大，這講偏重廣度，子題很多；挑的論文只是很小一部分，而且**偏向他自己的研究群**；所有挑選的論文都有開源。他也推薦自己團隊維護的人形機器人 sim2real 框架 [holosoma](https://github.com/amazon-far/holosoma)，涵蓋 retargeting、policy 訓練和部署。

### 先分清楚模擬器和框架

第 5–6 頁：

- 這講只談**以物理為基礎的模擬器**，也就是模擬過程由明確的物理定律決定。另外也有不以物理為基礎的模擬器，例如 world model。
- **模擬器不等於框架**。IsaacSim 是模擬器，IsaacLab 是蓋在 IsaacSim 上的機器人學習框架。
- MuJoCo 家族有 MuJoCo（CPU）、基於 JAX 的 MuJoCo XLA（MJX）、MuJoCo Warp，以及 mjlab。投影片的等式是 mjlab = MuJoCo Warp + IsaacLab − IsaacSim，也就是 IsaacLab 風格的 API 接在 MuJoCo Warp 上。

完整的模擬器比較，投影片指向 [Simulately 的比較表](https://simulately.wiki/docs/comparison)。

### 通用流程

第 7 頁把 sim2real policy 學習畫成一條線：物理模擬器（可加上 real2sim）→ 大規模平行的訓練環境（加外力擾動、地形隨機化）→ 用 RL（圖上是 PPO）最佳化 policy → 部署到真實世界。

### 模擬資料的好處

第 8–10 頁：

- 便宜、快、可擴展。第 9 頁的例子是在 2020 年的 M1 MacBook Pro 上用 RLtools 訓練 18 秒。
- 安全
- **自帶標籤**，拿得到「oracle」或 ground truth。第 10 頁的圖是 PyBullet 裡的 ground truth，同頁引了 Joonho Lee 等人在 Science Robotics 的四足越野論文。
- 不會磨損機器人

## 問題：兩種 mismatch

第 11–14 頁說 sim2real 從來不簡單，因為很難完全複製真實世界。落差分兩種：

| | 參數型 mismatch | 非參數型 mismatch |
|---|---|---|
| 意思 | 模擬器用的參數和真實的不同 | 模擬器根本沒考慮某些效應 |
| 例子 | 機器人質量與慣量、摩擦 | 複雜的空氣動力、流體動力、輪胎動力，連桿建模不完美 |

第 11 頁還點出另一個大挑戰：**在模擬器裡要怎麼設計獎勵、定義任務？** 講者把這題留到後面的「人類資料＋sim2real」。

**怎麼做**：替你想做的機器人任務列一張兩欄表，左欄寫「我知道但不確定數值的參數」，右欄寫「模擬器可能根本沒模擬到的東西」。左欄適合下面的 domain randomization 和 system ID，右欄通常要靠 residual 模型或真實資料。

## 機制一：Domain randomization

第 16 頁寫成一條式子：動態是 x_{t+1} = f_sim(x_t, u_t, e)，**隨機化 e**，訓練**單一個** policy π(x) 在很多種 e 下都能用。講者的一句話總結：這本質上就是 **robust control**。

投影片提到，原始論文關注的是感知，但這個想法後來被用在模擬的各個部分：感知、動力學、感測器輸入、延遲等。投影片沒有寫出原始論文是哪一篇。

兩個例子都是講者團隊的工作：

- 第 17–18 頁：[Agile But Safe](https://agile-but-safe.github.io/)
- 第 19–20 頁：RPL（Learning Robust Humanoid Perceptive Locomotion on Challenging Terrains，Zhang et al.），在 Amazon FAR 完成

## 機制二：Learning to adapt 與 teacher-student

第 22 頁一樣隨機化 e，但改成訓練一個**會適應的** policy π(x, e)。講者的類比：這是 **adaptive control**。它和 domain randomization 不衝突，可以兩個一起做，也就是 robust adaptive control。

問題是 π(x, e) 要吃 e，但**真實世界裡 e 通常不知道**。所以常見流程是向一個「特權老師」學：

1. **模擬器**：先用特權資訊訓練老師 policy π(x, e)
2. **模擬器**：再讓學生 policy π'(x, 真實世界可得的資訊) 向老師學
3. **真實世界**：部署學生 π'

投影片強調：**第二步是一個模仿學習問題**。這裡可以回頭對照 [L2 模仿學習](/posts/ai/2026-09-30-cs224r-imitation-learning)，老師就是那個隨時能問的專家。

第 24 頁的四足例子補了細節：

- 特權資訊幾乎包含模擬器裡的一切：接觸、地形、摩擦、擾動等
- 老師用 PPO 訓練
- 學生只看本體感覺的歷史（IMU、關節角度等）

### 兩個變體

- **學生不一定要在動作空間學**（第 25 頁）：[RMA](https://arxiv.org/abs/2107.04034) 在潛在空間裡學
- **Asymmetric actor-critic**（第 26 頁）：一階段就訓完。「學生」是 actor π'(x, 真實可得資訊)，「老師」是 critic V(x, e)。例子是 FALCON（人形機器人的移動操作，L4DC'26）：actor 看當下的本體感覺加 4 步歷史，critic 另外看得到 root 速度和末端受力

<details>
<summary>為什麼 critic 可以看特權資訊，actor 不行</summary>

這段是我的補充，投影片上沒有寫。部署時只需要 actor，critic 只在訓練時用來估計價值、降低 policy gradient 的變異（見 [L4 Actor-Critic](/posts/ai/2026-09-30-cs224r-actor-critic)）。所以 critic 看多少資訊都不影響部署，看得越多，價值估計通常越準。

</details>

## 機制三：Real2sim2real

第三類方法是反過來，用真實資料把模擬器修得更像。

- **System ID**（第 28 頁）：[SPI-Active](https://lecar-lab.github.io/spi-active_/) 用取樣式 system ID，加上主動探索：收資料時用能讓 Fisher information 最大的 policy（Sobanbabu, He et al., CoRL'25）
- **學感知或動力學的 residual**（第 29 頁）：用真實資料「擴充」模擬器，在模擬器裡訓練深度 RL，再部署到真實世界
- **Actuator net**（第 30–31 頁）：學一個馬達模型需要力矩標籤。要讓它變成「非監督」的，可以用 RL 訓練一個 residual 力矩模型，讓模擬軌跡去對齊真實軌跡

## 進階一：用人類資料定義任務

第 33 頁回到前面留下的問題：在模擬器裡定義任務和獎勵可能非常棘手。移動（locomotion）相對簡單，移動操作和靈巧操作就很難。

那為什麼不用人類資料？投影片說**沒有白吃的午餐**：人類的意圖和機器人的動作之間有一道「物理落差」，而**模擬器可以補上這道落差**，講者稱為 physics grounding。

第 34 頁的兩步流程：

1. 動作 retargeting（通常是運動學層級）
2. 在模擬器裡學 policy

全身追蹤的例子有 BeyondMimic（2025 年 8 月）和 [ASAP](https://agile.human2humanoid.com/)（2025 年 2 月，RSS'25）。

接下來三個例子：

- [OmniRetarget](https://omniretarget.github.io/)（ICRA'26，第 35–36 頁）：要**同時考慮物體和機器人**，用 interaction mesh 做 retargeting。影片中機器人只靠本體感覺，第 35 頁標註的蹬牆翻（wall flip）最大角速度是每秒 890 度
- [Perceptive Humanoid Parkour](https://php-parkour.github.io/)（RSS'26，第 37 頁）：延伸到有感知的設定，用 motion matching 串接人類的動態技能
- SPIDER（第 38 頁）：**動力學層級**的 retargeting，把 retargeting 當成最佳控制問題，用取樣式方法求解。投影片說這些展示都是把 retarget 後的動作軌跡直接開迴路在真機上重播

## 進階二：sim2real 用哪種 RL 演算法

第 40–42 頁：

- **像 PPO 這樣的 on-policy PG 方法非常有效**。PPO 的細節見 [L5 Off-Policy Actor-Critic](/posts/ai/2026-09-30-cs224r-off-policy-actor-critic-ppo-sac)
- 更善用大規模平行環境：SAPG（split and aggregate policy gradient）
- sim2real 的 off-policy 方法：FastTD3 和 FastSAC
- 對 flow matching policy 做 policy gradient：FPO 和 FPO++
- 用 forward-backward 表示做非監督 RL：BFM-Zero（ICLR'26），測試時可以最佳化任何使用者指定的獎勵函數

投影片只列了名稱，沒有展開這些方法的細節，本文也不補寫。

## 連回來：Sim2Real 1.0 到 4.0

第 44 頁提醒，控制領域做 sim2real 已經幾十年了。**Sim2Real 1.0** 用倒單擺、單一剛體這類降階模型當「模擬器」，搭配線上 model predictive control。講者覺得迷人也奇怪的地方是：它沒有「預訓練」，100% 靠非常快（超過 100 Hz）的線上推理。

第 45 頁把演進畫在兩個軸上，一軸是「學習發生在什麼時候」（線上推理 → 離線訓練 → 兩者兼有），另一軸是「模擬器的保真度與多樣性」：

| 版本 | 做法 | 模型 |
|---|---|---|
| Sim2Real 1.0 | NMPC | 降階模型 |
| Sim2Real 2.0 | RL | 完整模擬器 |
| Sim2Real 3.0 | RL++ | 模擬器＋real2sim |
| Sim2Real 4.0 | 更好的模型、更好的 RL 演算法、更好的線上推理 | 生成式模擬、world model 等 |

第 46 頁列了這講沒講到的題目：模擬與真實資料的共同訓練、用模擬器做 policy 評估、可微分模擬。

**怎麼做**：想入門的話，照講者的建議挑一篇有開源的論文，用 holosoma 或 IsaacLab／mjlab 把第 7 頁那條流程從頭跑一次，先只加 domain randomization，再加 teacher-student，看每一步對模擬中的穩健度有什麼影響。

## 指定閱讀：Tan et al. 2018

課表把 [Tan et al. 2018](https://arxiv.org/abs/1804.10332) 列為這講的閱讀，2026 投影片沒有直接引用它。依論文摘要，它幾乎就是這講前半段的縮影：

- 用深度 RL 從頭學四足機器人的移動，只用簡單的獎勵訊號；需要控制步態時可以加一條開迴路參考
- 用兩招縮小 reality gap：**改進模擬器**（system ID、精確的致動器模型、模擬延遲）和**學穩健的 policy**（隨機化物理環境、加擾動、設計精簡的觀測空間）
- 在真實四足機器人上成功做出小跑（trotting）和奔跑（galloping）兩種步態

對照來看，前者就是 real2sim，後者就是 domain randomization。

下一講問的是另一個方向：如果手上已經有預訓練好的機器人基礎模型，要怎麼直接在真機上用 RL 改進它？見 [L17 用 RL 改進機器人基礎模型（VLA）](/posts/ai/2026-09-30-cs224r-rl-for-vlas)。

站內延伸閱讀：

- [Berkeley CS285 Spring 2026 導讀](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview)

## 這一篇可以確認與不能確認的

可以確認：2026 投影片的文字、式子與論文標註；課表的日期、講者與指定閱讀；2025 封存頁的講次切分與 2025 影片標題、長度；投影片上列出的專案網址都能開啟。不能確認：投影片裡大量影片與圖的內容，包括第 9 頁 18 秒訓練的任務是什麼、各方法在真機上的具體數據；SAPG、FastTD3/FastSAC、FPO/FPO++、BFM-Zero 的細節；2025 L17 錄影的內容（本文沒有拿它當依據）。

系列導覽：上一篇 [L15 階層式 RL 與模仿學習](/posts/ai/2026-09-30-cs224r-hierarchical-rl-il)｜下一篇 [L17 用 RL 改進機器人基礎模型（VLA）](/posts/ai/2026-09-30-cs224r-rl-for-vlas)｜[系列入口](/posts/ai/2026-09-30-cs224r-course-overview)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [CS224R: Deep Reinforcement Learning（Spring 2026 課程官網與課表）](https://cs224r.stanford.edu/)
- [Lecture 16 投影片：Sim2Real Robot Learning: A Holistic Overview（Guanya Shi，2026）](https://cs224r.stanford.edu/slides/16_cs224r_sim2real_robot_learning_2026.pdf)
- [CS224R Spring 2025 封存頁](https://cs224r.stanford.edu/spring_2025/)
- [Spring 2025 Lecture 17: Advancing Robot Intelligence（YouTube，講者不同，只當背景）](https://www.youtube.com/watch?v=Hp1WBWghrak)
- [Tan et al. 2018：Sim-to-Real: Learning Agile Locomotion For Quadruped Robots](https://arxiv.org/abs/1804.10332)
- [Kumar et al. 2021：RMA: Rapid Motor Adaptation for Legged Robots](https://arxiv.org/abs/2107.04034)
- [holosoma：Amazon FAR 的人形機器人 sim2real 框架](https://github.com/amazon-far/holosoma)
- [LeCAR Lab（Guanya Shi 研究群）](https://lecar-lab.github.io/)
- [Simulately：機器人模擬器比較](https://simulately.wiki/docs/comparison)
- [Agile But Safe](https://agile-but-safe.github.io/)
- [SPI-Active](https://lecar-lab.github.io/spi-active_/)
- [ASAP](https://agile.human2humanoid.com/)
- [OmniRetarget](https://omniretarget.github.io/)
- [Perceptive Humanoid Parkour](https://php-parkour.github.io/)
