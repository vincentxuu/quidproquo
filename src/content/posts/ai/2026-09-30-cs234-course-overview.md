---
title: "Stanford CS234 導讀：總覽與自學路線（Winter 2026）"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, course-guide]
lang: zh-TW
series:
  name: "Stanford CS234 導讀"
  order: 0
tldr: "CS234 是 Emma Brunskill 在 Stanford 教的強化學習入門課，從有模型的 MDP 規劃一路講到策略梯度、RLHF／DPO、bandit 探索和 MCTS。Winter 2026 的 14 講投影片、三份作業的題目與起始碼、專題規格都能匿名下載，本系列評為 A3（足以自學）。缺口是官網沒有 2026 錄影、L15 與 L16 沒有投影片、期中考與 tutorials 不公開。公開錄影是 Spring 2024 版，本系列只拿它當補充；2024 有兩講 Offline RL，2026 投影片裡沒有對應內容。"
description: "Stanford CS234 Reinforcement Learning（Winter 2026）系列總覽：依官方首頁、講義頁、作業頁、專題頁與 Spring 2024 YouTube 播放清單，整理課程定位、先修、學習目標、校內外兩套評分、校外讀者拿得到什麼、2026 教材搭 2024 影片的對照方式，以及含期末專題的 10 週自學路線。"
draft: false
glossary:
  - term: "A3 足以自學"
    definition: "本站課程地圖的公開程度分級之一：系統化教材加上作業與必要檔案都公開，可以照順序自學。"
    context: "CS234 Winter 2026 評為 A3，但公開錄影是 Spring 2024 版。"
  - term: "tutorials（CS234）"
    definition: "Winter 2026 新增的校內小組課：每週 30 分鐘，4 位學生加 1 位助教，練習把概念講清楚；校內評分佔 24%。"
    context: "校外（off campus）學生沒有 tutorials，改用另一套評分。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs234-course-overview-en)

> **來源年份**：投影片、作業、專題規格與評分依據 Winter 2026（2026-01-05 開課，3 月結課）。公開錄影是 Spring 2024 版（YouTube），只當聽講補充，差異下面逐項標出。本文是 Stanford CS234 導讀系列的第 0 篇，也是入口。

[CS234: Reinforcement Learning](https://web.stanford.edu/class/cs234/) 是 Emma Brunskill 在 Stanford 開的強化學習課。Winter 2026 每週一、三下午 3:00–4:20 上課，課表從 1 月 5 日排到 3 月 17 日交期末報告。

這篇回答五個問題：這門課教什麼、要先會什麼、校外讀者實際拿得到什麼、2026 教材和 2024 錄影怎麼搭、10 週要怎麼排。

## 課程影片來源

下方提供官方課程與既有錄影入口。尚未核對到可直接嵌入、且對應本文範圍的單支公開影片。

課程與錄影入口：

- [Stanford CS234 Spring 2024 YouTube 播放清單（Stanford Online）](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)
- [官方課程／講次來源](https://web.stanford.edu/class/cs234/)

## 這門課教什麼

首頁的課程描述開頭是：要實現 AI 的影響力，需要能學會做好決策的自主系統，而強化學習是其中一個有力的方法。這門課要給 RL 一個扎實的入門，核心挑戰與方法包括 generalization 和 exploration。作業涵蓋 RL 基礎、deep RL，以及 RL from human feedback 的基礎訓練。

[第一講投影片](https://web.stanford.edu/class/cs234/slides/lecture1post.pdf)的課程大綱分七段：

1. Markov decision processes 與 planning
2. Model-free policy evaluation
3. Model-free control
4. Policy search
5. Offline RL，包括 RLHF 與 DPO
6. Exploration
7. 進階主題

跟同校的 [CS224R](/posts/ai/2026-09-30-cs224r-course-overview) 比，CS234 花更多時間在「為什麼會收斂」「要多少資料」這類分析上。首頁列的學習目標裡，有一條是要能用 regret、sample complexity、計算複雜度、實際表現、收斂性等多種標準評估 RL 演算法。

## 先修：四層

| 先修 | 官方寫法 | 站內對應 |
|---|---|---|
| Python | 作業全部用 Python；寫過 C/C++、Matlab、JavaScript 的人大概沒問題 | — |
| 微積分與線代 | 例如 MATH 51、CME 100；會求導、看得懂矩陣向量記號 | — |
| 機率與統計 | 例如 [CS109](/posts/learning/2026-08-21-stanford-cs109-probability)；知道 Gaussian、平均、標準差 | [CS109 導讀](/posts/learning/2026-08-21-stanford-cs109-probability) |
| ML 基礎 | 會寫 cost function、求導、用 gradient descent 最佳化；CS221 或 CS229 都涵蓋 | [CS229 導讀](/posts/ai/2026-08-21-stanford-cs229-machine-learning)、[CS221 導讀](/posts/ai/2026-08-21-stanford-cs221-ai-principles) |

首頁另外提到，懂一點 convex optimization 會讓某些最佳化技巧更直覺。講義頁在第一講旁邊附了 [CS229 的線代複習](http://cs229.stanford.edu/section/cs229-linalg.pdf)、[機率複習](http://cs229.stanford.edu/section/cs229-prob.pdf)和 [Python 教學](http://cs231n.github.io/python-numpy-tutorial/)。

## 學習目標

首頁列了五條，每條都註明用什麼考：

1. 說出 RL 跟一般 AI、非互動式 ML 的關鍵差別（考試）
2. 拿到一個應用問題，判斷它該不該寫成 RL 問題；該的話，正式定義狀態空間、動作空間、dynamics 和 reward model，並說明課上哪個演算法最適合（考試）
3. 用程式實作常見的 RL 演算法（作業）
4. 列出並定義分析 RL 演算法的多種標準，拿這些標準評估演算法（作業與考試）
5. 描述 exploration 與 exploitation 的兩難，並比較至少兩種處理方法（作業與考試）

第 2 條是整門課的主軸。系列第 1 篇會從這裡開始。

## 評分：校內、校外兩套

Winter 2026 首頁的評分標題寫著「Will be Updated First Week of Class」，以下是 2026-09-30 頁面上的版本。校內學生多了必修的 tutorials，作業比重因此降低：

| 項目 | 校內（on campus） | 校外（off campus） |
|---|---|---|
| A1、A2、A3 | 各 7% | 各 15% |
| Tutorials | 24%（8 次取最好 6 次） | 沒有 |
| Midterm | 25% | 25% |
| Quiz | 5% | 5% |
| Course Project | 25%（proposal 1%、milestone 2%、poster 5%、paper 17%） | 25%（同左） |

頁面排版上，midterm、quiz 和 project 列在兩套清單之後；兩欄各自加總都是 100%，所以本文把它們讀成兩套共用。

Tutorials 是 2026 版的新設計。[第一講投影片](https://web.stanford.edu/class/cs234/slides/lecture1post.pdf)的說法是：把想法講清楚是關鍵技能，每週一次 30 分鐘，4 位學生加 1 位助教，第二週開始。出席並參與拿 4/4，沒準備或只出席不參與拿 1/4，缺席 0。

遲交規則：總共 5 天 late days，A1–A3、proposal 和 milestone 各最多用 2 天；poster 和 final paper 不能用。考試是一次 midterm、一次 quiz，midterm 可帶一張單面手寫筆記，quiz 可帶一張雙面。

## AI 工具政策

首頁的 Academic Collaboration 段落允許使用 Gemini、GPT-4、Copilot 這類生成式 AI，但比照「跟同學合作」的標準：不能直接要答案、不能抄程式碼，而且要註明用過。專題的 milestone 和 final report 不能把 LLM 列為合作者，理由是生成式 AI 無法承擔責任。把作業解答公開放上網（例如公開 git repo）也算違反 honor code。

本系列的作業篇只講題目在練什麼、要實作哪些函式，不寫解答。

## 校外讀者拿得到什麼：A3，但有四個缺口

依本站[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)的分級，CS234 Winter 2026 評為 **A3 足以自學**。2026 年 9 月 30 日匿名打開，以下材料都拿得到：

- [講義頁](https://web.stanford.edu/class/cs234/modules.html)上 L1–L14 的 post-class 投影片（L10 只有 post 版）
- 兩份客座投影片：Lecture 14 Guest Slides Part 2（[ethics_society_234_2.pdf](https://web.stanford.edu/class/cs234/slides/ethics_society_234_2.pdf)）和 Shane Gu 的 [World of World Modeling](https://web.stanford.edu/class/cs234/slides/ShaneGuCS234_2026.pdf)
- [作業頁](https://web.stanford.edu/class/cs234/assignments.html)上三份作業的題目 PDF、LaTeX 範本和起始碼（A3 起始碼放在 Google Drive）
- [專題頁](https://web.stanford.edu/class/cs234/project.html)的時程與 proposal、milestone、final report 規格

缺口有四個，後面每篇都會照實標：

1. **2026 錄影不公開。** 官網沒有任何 2026 錄影連結；講義頁原始碼裡只留著被註解掉的 Canvas/Panopto 連結。公開的是 Spring 2024 版。
2. **L15、L16 沒有投影片。** `lecture15post.pdf` 和 `lecture16post.pdf` 都回 404。課表 Week 9 的 Guest Lecture 和 Week 10 的「Alignment, Impacts」只能靠上面兩份客座 PDF 和 L10 後半補。
3. **考試與 tutorials 不公開。** Midterm、quiz 的題目與解答、tutorials 內容、Gradescope autograder 和課程論壇都拿不到。首頁連到的 FAQ 頁目前是 404。
4. **專題頁的「Project Ideas」還寫著 To be added**，往年範例清單沒有放上來。

## 為什麼 2026 教材配 2024 影片

基準選 Winter 2026，因為它是 2025–2026 學年最新的完整版本，作業也跟著改過：例如 [A3](https://web.stanford.edu/class/cs234/assignments/a3/hw3_questions.pdf) 有一整題 Direct preference optimization（6 分 writeup 加 19 分 coding）。

[Stanford Online 的 Spring 2024 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)是唯一公開的官方錄影，共 16 支，同樣由 Emma Brunskill 主講。它只當「聽講補充」，因為有兩處跟 2026 對不上：

1. **2024 真正講 offline RL 的那一講在 2026 投影片裡沒有對應。** 2024 的 Lecture 8 標題叫「Offline RL 1」，但 YouTube 章節顯示它講的是 MaxEnt IRL 和 RLHF 開頭，內容對得上 2026 的 L7 後半與 L8 前半；真正講 offline RL 的是 Lecture 10「Offline RL 3」（章節從 5:51「Offline reinforcement learning」起，接 model-based／model-free 的 policy evaluation 與 importance sampling）。我把 2026 的 14 份 post 投影片全部轉成文字搜「offline」，只在 L4 出現 1 次。2026 課表 Week 4–6 雖然標著「Offline RL」，實際的 L7、L8 講 PPO、模仿學習和 RLHF／DPO，L9 開始講 bandit。第一講大綱把 RLHF 和 DPO 放在 offline RL 那一段底下，這大概是課表標籤的由來。本系列不替 2026 補寫 offline RL 內容，想學的讀者可以看 2024 影片 10 或 [CS224R 的 Offline RL 篇](/posts/ai/2026-09-30-cs224r-offline-rl)。
2. **DPO 的講法不同。** 2024 的 Lecture 9 是 Rafael Rafailov、Archit Sharma、Eric Mitchell 的 DPO 客座；2026 則把 DPO 併進 L8 由 Brunskill 自己講。

### 影片對照表

以下依影片標題與 YouTube 章節（2026-10-01 核對）對照，影片沒有逐支看完：

| 2024 影片 | 標題 | 對應本系列 |
|---|---|---|
| [01](https://www.youtube.com/watch?v=WsvFL-LjA6U) | Introduction to Reinforcement Learning | 第 1 篇 |
| [02](https://www.youtube.com/watch?v=gHdsUUGcBC0) | Tabular MDP Planning | 第 2 篇 |
| [03](https://www.youtube.com/watch?v=jjq51TRNVvk) | Policy Evaluation | 第 4 篇 |
| [04](https://www.youtube.com/watch?v=b_wvosA70f8) | Q learning and Function Approximation | 第 5 篇；58:04 起的 DQN 對應第 6 篇 |
| [05](https://www.youtube.com/watch?v=L6OVEmV3NcE)–[07](https://www.youtube.com/watch?v=4ngb0IZTg8I) | Policy Search 1–3 | 第 7、8、10 篇 |
| [08](https://www.youtube.com/watch?v=IEbuJtjqtMU) | Offline RL 1 | 第 10、11 篇（章節實際是 MaxEnt IRL 與 RLHF） |
| [09](https://www.youtube.com/watch?v=Q7rl8ovBWwQ) | Guest Lecture on DPO | 第 11 篇 |
| [10](https://www.youtube.com/watch?v=F6APGIAm5fw) | Offline RL 3 | 2026 沒有對應；前 6 分鐘複習 RLHF／DPO，之後是 offline RL |
| [11](https://www.youtube.com/watch?v=sqYii3nd78w)–[13](https://www.youtube.com/watch?v=pc7oayCSZmQ) | Exploration 1–3 | 第 13–15 篇 |
| [14](https://www.youtube.com/watch?v=UgANzoWc0nc) | Multi-Agent Game Playing | 第 16 篇 |
| [15](https://www.youtube.com/watch?v=FOlPpjNbHjE) | Emma Brunskill & Dan Webber | 前 15 分鐘收尾 AlphaZero（第 16 篇），15:24 起是 Dan Webber 的 value alignment（第 17 篇） |
| [16](https://www.youtube.com/watch?v=eenJzay5aLo) | Value Alignment | 標題是 Value Alignment，章節實際是小考檢討、課程回顧與 RL 應用案例，沒有對應單篇 |

## 系列弧線

官方順序本身就是一條好走的路：有模型時規劃 → 沒模型時評估 → 沒模型時控制 → 函數近似 → 直接搜策略 → 從人類資料學 → 資料效率與探索 → 規劃加學習 → 對齊。本系列只做三處調整：

1. **依主題切篇，不依 PDF 切篇。** 投影片的檔案邊界跟主題不一致，例如 L5 前半是 DQN、後半是策略梯度。每篇開頭會標明用到哪一講的哪一段。
2. **作業篇緊接在它需要的講次後面。** A1 放在 MDP 規劃之後，A2 放在 PPO 之後，A3 放在 RLHF／DPO 之後。
3. **價值對齊客座移到最後。** L10 後半是價值對齊客座，跟 ethics 客座 PDF 合成一篇，不讓它夾在 bandit 中間。

```text
問題設定（1）→ 有模型：規劃（2）→ A1（3）
  → 沒模型：評估（4）→ 控制＋函數近似（5）→ DQN（6）
    → 策略搜尋：PG 基礎（7）→ PPO/GAE（8）→ A2（9）
      → 從人類學：模仿學習/IRL（10）→ RLHF/DPO（11）→ A3（12）
        → 資料效率：bandit/UCB（13）→ Thompson（14）→ MDP 的探索（15）
          → 規劃＋學習：MCTS/AlphaZero（16）
            → 收尾：價值對齊（17）→ 世界模型客座（18）
```

| 篇 | 主題 | 對應官方材料 |
|---|---|---|
| 1 | [RL 是什麼、MDP 的語言](/posts/ai/2026-09-30-cs234-intro-sequential-decisions) | L1 |
| 2 | [有模型時怎麼規劃：policy evaluation、PI、VI](/posts/ai/2026-09-30-cs234-mdp-planning) | L2 |
| 3 | [A1：有效視野、reward hacking、Bellman residual、RiverSwim](/posts/ai/2026-09-30-cs234-a1-mdp-bellman-riverswim) | A1 |
| 4 | [沒模型時怎麼評估：MC、TD(0)](/posts/ai/2026-09-30-cs234-model-free-policy-evaluation) | L3、L4 開頭 |
| 5 | [沒模型時怎麼控制：SARSA、Q-learning、函數近似](/posts/ai/2026-09-30-cs234-model-free-control-function-approx) | L4 |
| 6 | [DQN](/posts/ai/2026-09-30-cs234-dqn-deep-q-learning) | L5 前半 |
| 7 | [策略梯度：REINFORCE、baseline、actor-critic](/posts/ai/2026-09-30-cs234-policy-gradient-reinforce) | L5 後半、L6 前半 |
| 8 | [進階策略梯度：PPO、GAE](/posts/ai/2026-09-30-cs234-ppo-gae-monotonic-improvement) | L6 後半、L7 前半 |
| 9 | [A2：策略梯度與 PPO 實作](/posts/ai/2026-09-30-cs234-a2-policy-gradient-ppo) | A2 |
| 10 | [從示範學：BC、DAgger、IRL](/posts/ai/2026-09-30-cs234-imitation-learning-irl) | L7 後半、L8 開頭 |
| 11 | [從人類偏好學：RLHF、DPO](/posts/ai/2026-09-30-cs234-rlhf-dpo) | L8 |
| 12 | [A3：Hopper 上的 RLHF、DPO 與 best arm identification](/posts/ai/2026-09-30-cs234-a3-rlhf-dpo-bandits) | A3 |
| 13 | [Bandit、regret、UCB](/posts/ai/2026-09-30-cs234-bandits-regret-ucb) | L9、L10 前半 |
| 14 | [Thompson sampling 與貝氏 bandit](/posts/ai/2026-09-30-cs234-thompson-sampling-bayesian-bandits) | L11 |
| 15 | [MDP 裡的探索：PAC、MBIE-EB、PSRL](/posts/ai/2026-09-30-cs234-fast-rl-mdps-exploration) | L12 |
| 16 | [MCTS 與 AlphaZero](/posts/ai/2026-09-30-cs234-mcts-alphazero) | L13、L14 |
| 17 | [價值對齊](/posts/ai/2026-09-30-cs234-value-alignment-ethics) | L10 後半、ethics 客座 PDF |
| 18 | [客座：World of World Modeling](/posts/ai/2026-09-30-cs234-guest-world-models) | Shane Gu 客座 PDF |

## 10 週自學路線

下表左欄是 [Winter 2026 課表](https://web.stanford.edu/class/cs234/)上的週次標籤與截止日，右欄是本系列建議的讀法。考試不公開，所以 midterm 那週拿來補進度。

| 週 | 官方課表 | 建議讀法 |
|---|---|---|
| 1 | Introduction to RL、Tabular MDP Planning；A1 發布 | 第 1、2 篇，開始 A1 |
| 2 | Policy Evaluation、Q-learning and function approximation；A1 截止（1/16） | 第 3、4、5 篇；交 A1 |
| 3 | Policy Search | 第 6、7 篇，開始 A2 |
| 4 | Policy Search、Offline RL / Imitation Learning；A2 截止（2/1） | 第 8、9、10 篇；交 A2 |
| 5 | Offline RL / RLHF、Midterm；A3 發布；Proposal 截止（2/8） | 第 11 篇；寫專題 proposal |
| 6 | Offline RL / Bandits、Strategic data gathering / Exploration | 第 12、13 篇，開始 A3 |
| 7 | Exploration；A3 截止（2/20） | 第 14 篇；交 A3（Q4 用到第 13 篇的 bandit 概念） |
| 8 | Exploration、RL and MCTS；Milestone 截止（2/25） | 第 15、16 篇；寫 milestone |
| 9 | Guest Lecture、In Class Quiz | 第 18 篇；專題實驗 |
| 10 | Alignment, Impacts；Poster Session（3/11） | 第 17 篇；做 poster |
| 11 | Final Project Writeup 截止（3/17） | 交 final report |

### 期末專題怎麼做

專題頁說，novel research 歡迎但不是拿滿分的必要條件；方法沒成功也沒關係，只要用理論或實驗仔細說明它為什麼沒成功。「沒寫夠程式」不算好理由。專題頁也鼓勵重現近期 RL 論文的結果。

組隊上限 3 人，官方強烈建議 3 人一組，而且期待成果規模跟人數成正比。三個繳交物：

- **Proposal（200–400 字）**：要回答研究什麼問題、為什麼有趣；用什麼資料、模擬器或真實 RL 環境；提出什麼方法、演算法或理論分析；讀過哪些文獻；怎麼評估結果、預期看到什麼圖表或指標。
- **Milestone（2–3 頁，ICML 範本）**：Introduction 加 Approach，說明已完成的步驟、最好有早期結果，並精確列出剩下的工作。
- **Final report（6–8 頁，ICML 範本）**：Abstract 不超過 300 字，接著 Introduction、Background/Related Work、Approach、理論結果（如果有）、實驗結果（要詳細到可重現）、Conclusion、References。證明細節可以放 supplementary，不算頁數。

2026 首頁原始碼裡有一段被註解掉的「default project／第 4 份作業」選項，專題頁同樣註解掉了。所以 Winter 2026 沒有預設專題，校外讀者要自己定題目。

## 今晚可以做的事

1. 打開[講義頁](https://web.stanford.edu/class/cs234/modules.html)，下載 L1、L2 的 post-class 投影片。
2. 讀 [Sutton & Barto 第 1 章](http://incompleteideas.net/book/RLbook2018.pdf)，這是講義頁指定給第一講的補充讀物。
3. 下載 [A1 題目](https://web.stanford.edu/class/cs234/assignments/a1/CS234_A1_Questions.pdf)和[起始碼](https://web.stanford.edu/class/cs234/assignments/a1/code.zip)，先看 RiverSwim 那題的環境說明。
4. 看 [2024 Lecture 1 錄影](https://www.youtube.com/watch?v=WsvFL-LjA6U)，配著 2026 第一講投影片，然後讀[本系列第 1 篇](/posts/ai/2026-09-30-cs234-intro-sequential-decisions)。

## 延伸閱讀

這些站內系列和 CS234 有重疊，但本系列不因此刪減內容，只在這裡放連結：

- [Stanford CS224R 導讀](/posts/ai/2026-09-30-cs224r-course-overview)：同校的深度 RL 課，更偏機器人與 LLM 應用；相關篇目有[Policy Gradients](/posts/ai/2026-09-30-cs224r-policy-gradients)、[Offline RL](/posts/ai/2026-09-30-cs224r-offline-rl)、[RLHF 與偏好最佳化](/posts/ai/2026-09-30-cs224r-rlhf-dpo-preference-optimization)
- [Berkeley CS285 Spring 2026 導讀](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview)：另一門深度 RL 研究所課；相關篇目有[模仿學習與 RL 基礎](/posts/learning/2026-08-22-berkeley-cs285-imitation-rl-basics)、[policy 與 value 方法](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods)、[探索與開放問題](/posts/learning/2026-08-22-berkeley-cs285-exploration-open-problems)
- [強化學習：MDP、價值迭代與連續狀態（CS229 講義第 19 章）](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-19-reinforcement-learning)：先修課裡的 RL 章節
- [全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)：A0–A3 分級的定義

**系列導覽**：下一篇 [RL 是什麼、MDP 的語言](/posts/ai/2026-09-30-cs234-intro-sequential-decisions)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [CS234 課程首頁、課表與評分（Winter 2026）](https://web.stanford.edu/class/cs234/)
- [CS234 Lecture Materials（Winter 2026）](https://web.stanford.edu/class/cs234/modules.html)
- [CS234 Assignments（Winter 2026）](https://web.stanford.edu/class/cs234/assignments.html)
- [CS234 Course Project（Winter 2026）](https://web.stanford.edu/class/cs234/project.html)
- [Lecture 1 投影片：Introduction to RL（2026 post-class）](https://web.stanford.edu/class/cs234/slides/lecture1post.pdf)
- [A1 題目 PDF（2026）](https://web.stanford.edu/class/cs234/assignments/a1/CS234_A1_Questions.pdf)
- [A2 題目 PDF（2026）](https://web.stanford.edu/class/cs234/assignments/a2/CS234_A2_Questions.pdf)
- [A3 題目 PDF（2026）](https://web.stanford.edu/class/cs234/assignments/a3/hw3_questions.pdf)
- [Ethics and Society 客座投影片 Part 2](https://web.stanford.edu/class/cs234/slides/ethics_society_234_2.pdf)
- [Shane Gu：World of World Modeling（2026 客座投影片）](https://web.stanford.edu/class/cs234/slides/ShaneGuCS234_2026.pdf)
- [CS234 Spring 2024 封存頁](https://web.stanford.edu/class/cs234/CS234Spr2024/index.html)
- [Stanford CS234 Spring 2024 YouTube 播放清單（Stanford Online）](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)
- [Sutton & Barto, Reinforcement Learning: An Introduction（2nd ed.）](http://incompleteideas.net/book/RLbook2018.pdf)
