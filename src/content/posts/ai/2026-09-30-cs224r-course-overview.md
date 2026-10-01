---
title: "Stanford CS224R 導讀：Spring 2026 深度強化學習課程總覽"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, ai-course, stanford, reinforcement-learning, course-guide]
lang: zh-TW
series:
  name: "Stanford CS224R 導讀"
  order: 0
tldr: "CS224R 是 Chelsea Finn 在 Stanford 教的深度強化學習課，從模仿學習一路講到 LLM 的 RL 和機器人基礎模型。Spring 2026 的 17 份投影片、三份作業的題目與起始碼、default project 規格與起始碼都能匿名下載，本系列評為 A3（足以自學）。缺口是 2026 錄影只在 Canvas、期中考卷與解答不公開、HW2 和 HW3 規定在 Modal 上跑。公開錄影是 Spring 2025 版，本系列把它當補充，逐講標出差異。"
description: "Stanford CS224R Deep Reinforcement Learning（Spring 2026）系列總覽：依官方課程首頁、課表、作業 PDF、default project 規格、Spring 2025 封存頁與 YouTube 播放清單，整理課程定位、先修、評分與 AI 工具政策、校外讀者拿得到什麼、2026 與 2025 版的差異，以及整個系列的閱讀弧線。"
draft: false
glossary:
  - term: "A3 足以自學"
    definition: "本站課程地圖的公開程度分級之一：系統化教材加上作業與必要檔案都公開，可以照順序自學。"
    context: "CS224R Spring 2026 評為 A3，但公開錄影是 Spring 2025 版。"
  - term: "default project"
    aliases: ["預設專題"]
    definition: "課程提供題目與起始碼的期末專題選項；CS224R 2026 版是用 RL 微調 LLM，再加一個自選的研究延伸。"
    context: "另一個選項是自訂題目的 custom project。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs224r-course-overview-en)

> **來源年份**：投影片、作業、專題規格與評分依據 Spring 2026（2026-04-01 到 2026-06-08）。公開錄影是 Spring 2025 版（YouTube），只當補充，差異下面逐項標出。本文是 Stanford CS224R 導讀系列的第 0 篇，也是入口。

[CS224R: Deep Reinforcement Learning](https://cs224r.stanford.edu/) 是 [Chelsea Finn](https://ai.stanford.edu/~cbfinn/) 在 Stanford 開的深度強化學習課。Spring 2026 每週三、五早上 9:30 在 NVIDIA Auditorium 上課，首頁同時寫了一句：下一輪改在 Fall 2027 開，不開 Spring 2027。所以 2026 年 9 月這個時間點，Spring 2026 就是最新、也是最後一個完整版本。

這篇回答四個問題：這門課教什麼、校外讀者實際拿得到什麼、2026 版和有公開錄影的 2025 版差在哪、整個系列要怎麼讀。

## 這門課教什麼

首頁的課程描述開頭是：人、動物和機器人都得在世界裡做決定，而且這些決定會改變它們所在的世界。這門課教的是「從經驗學行為」的演算法，重點放在用深度神經網路、從高維觀測學行為的實用方法。

描述列出的主題有：從示範學習、model-based 與 model-free 的 deep RL、從 offline 資料學習，以及多任務的進階技巧（goal-conditioned RL、meta-RL）。例子來自機器人、視覺導航和控制。首頁也說明它和 [CS234](https://web.stanford.edu/class/cs234/) 互補，彼此不是先修；相較之下，CS224R 更偏應用和深度學習，並強調機器人與語言模型兩個場景。

[第一講投影片](https://cs224r.stanford.edu/slides/01_cs224r_intro_2026.pdf)把核心目標寫成一句：能理解並實作既有和新出現的方法。理論和其他應用，投影片直接叫你去看 CS234。

## 先修：官方假設你已經懂 MDP

首頁列了三層先修：

| 先修 | 官方寫法 | 站內對應 |
|---|---|---|
| 機器學習 | CS229 或同等程度；會用 SGD、cross-validation、機率、多變數微積分、線性代數 | [CS229 導讀](/posts/ai/2026-08-21-stanford-cs229-machine-learning) |
| 深度學習 | 懂 backprop、CNN、transformer 這類序列模型；作業用 PyTorch，第一週有 PyTorch 複習課 | [CS224N 導讀](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning)（transformer） |
| 強化學習 | 假設你熟悉 RL 基礎；入門材料看 [CS221 的 MDP 與 RL 模組](https://stanford-cs221.github.io/autumn2022/modules/)，或 [Sutton & Barto](http://incompleteideas.net/book/RLbook2020.pdf) 第 3–4 章 | [CS221 導讀](/posts/ai/2026-08-21-stanford-cs221-ai-principles)、[CS221 L7 MDP](/posts/ai/2026-08-22-stanford-cs221-lecture-07-mdp-value-iteration) |

第三層最容易被忽略。第一講的投影片說「We will go quickly over the basics」，也就是 MDP 只會快速帶過。沒碰過 value function 和 Bellman 方程的讀者，先讀 Sutton & Barto 第 3–4 章再進來，會省很多力。本系列的 [L1 導讀](/posts/ai/2026-09-30-cs224r-intro-mdps-behavior)會補一段 MDP 直覺，但不取代這兩章。

## 評分、期中考與遲交規則

Spring 2026 的評分寫在首頁和第一講投影片：

| 項目 | 比重 | 細節 |
|---|---|---|
| 作業 | 40% | HW1 模仿學習 10%，HW2 線上 RL 15%，HW3 offline RL 15% |
| 期末專題 | 35% | 1–3 人一組；proposal 4%、milestone 5%、poster 8%、report 18% |
| 期中考 | 25% | 5 月 15 日課堂考，範圍到 5 月 8 日的課 |
| 加分 | 最多 2% | 優秀專題或優秀的 Ed 討論參與 |

遲交有 5 天 late days，可用在作業、proposal 和 milestone，單份最多用 2 天；poster 和 final report 不能用。5 天用完之後，每多遲一天扣學期總分 2%。

這套規則和 2025 版不同。[Spring 2025 封存頁](https://cs224r.stanford.edu/spring_2025/)寫的是四份作業佔 50%、專題佔 50%，沒有考試，late days 是 6 天。2026 版砍掉一份作業、加了期中考。

期末專題分兩種。**Default project** 是在 Countdown 算術推理任務上用 Qwen 模型實作三個階段：SFT 暖身、DPO/IPO 式的偏好最佳化、用規則式 verifier 當 reward 的 RLOO，再加一個自選的研究延伸（見 [Default Project 規格](https://cs224r.stanford.edu/material/CS224R_Default_Project_Guidelines.pdf)）。**Custom project** 自己定題目（見 [Custom Project 規格](https://cs224r.stanford.edu/material/CS224R_Custom_Project_Guidelines.pdf)）。首頁提醒 default project 從 Spring 2025 之後調整過，所以 [2025 的專題範例](https://cs224r.stanford.edu/spring_2025/projects/cs224r_final_projects.html)只能參考方向。

## AI 工具政策：比首頁寫的更嚴

首頁的 Honor Code 段落說，解題過程中可以和同學、AI 工具討論，但解答和程式碼要自己獨立寫。AI 的協助比照「別人的協助」處理。抄、參考或看其他同學、AI 工具、以前學期的解答都算違反 honor code，**程式碼自動補全也算**。把自己的作業解答公開放上網（例如公開的 git repo）也違規。

真正下載作業 PDF 之後，規定更嚴：

- [HW1](https://cs224r.stanford.edu/material/hw1/CS224R_2026_Homework_1.pdf)、[HW2](https://cs224r.stanford.edu/material/hw2/CS224R_2026_Homework_2.pdf)、[HW3](https://cs224r.stanford.edu/material/hw3/CS224R_2026_Homework_3.pdf) 都寫明：為了加深理解，**禁止用生成式模型幫你寫這份作業的程式碼**。
- Default project 規格寫：除了 extension 以外，**任何部分**都不能和 GitHub Copilot、ChatGPT 這類 AI 工具協作。

對校外自學者來說，這些規則沒有強制力，但它說明了課程設計的意圖：作業的價值在於自己把 TODO 填完。本系列的作業篇只講任務、要實作的函式和實驗問題，不寫解答。

## 校外讀者拿得到什麼：A3，但有四個缺口

依本站[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)的分級，CS224R Spring 2026 評為 **A3 足以自學**。2026 年 9 月 30 日匿名打開，以下材料都拿得到：

- 17 份當期投影片 PDF（課表上的 01–13、15–18；14 號那天是期中考，沒有投影片）
- HW1–HW3 的題目 PDF、LaTeX 模板和起始碼 zip
- [Compute guide](https://cs224r.stanford.edu/material/CS224R_compute_guide.pdf)（Modal 使用說明，註明改編自 CS336 Spring 2026 的版本）
- Default project 規格與[起始碼](https://cs224r.stanford.edu/material/default_proj.zip)、custom project 規格
- Q-learning 的 [TA 加課講義](https://cs224r.stanford.edu/material/CS224R_Tutotial_Max.pdf)（檔名原本就拼成 Tutotial）、期中[複習 pptx](https://cs224r.stanford.edu/material/CS224R_Exam_Review_Session_Riya.pptx)
- [2026 期末專題列表](https://cs224r.stanford.edu/projects/cs224r_final_projects.html)

缺口有四個，後面每篇都會照實標：

1. **2026 錄影不公開。** 首頁寫錄影放在 Canvas 的 Panopto 分頁，只有修課學生看得到。公開的是 Spring 2025 版。
2. **期中考卷和解答不公開**，只有複習 pptx。作業解答、autograder、Ed 討論和 Gradescope 也都拿不到。
3. **HW2、HW3 規定用 Modal 跑。** 兩份作業都寫「all sections on Modal instances」，而且不支援其他平台的設定。Default project 規格寫每位修課學生有 500 美元 Modal credits，校外讀者沒有，要自備算力。HW1 另外提供 Colab 說明。
4. **部分客座投影片文字很少。** L10 由 Noam Brown 客座，投影片以圖為主，本系列那一篇只寫投影片上看得到的論點。

## 為什麼拿 Spring 2025 錄影當補充

2026 沒有公開錄影，[Stanford Online 的 Spring 2025 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rPwxE0ONYRa_itZFdaKCylL)是最接近的官方錄影：L1–L18 加一支 Q-learning tutorial，共 19 支。首頁「Previous Offerings」也直接把這個播放清單掛在 Spring 2025 旁邊。

大部分講次的標題和順序兩年相同，所以本系列每篇都在「配套影片」標成「Spring 2025 錄影（補充）」。但有幾講不能對等引用：

| 2026 講次 | 2025 對應影片 | 差異 |
|---|---|---|
| L1–L9、L11–L13、L15、L18 | 同號講次 | 標題相同；投影片已改成 2026 版，細節可能不同 |
| L10 RL for LLMs: Reasoning（客座 Noam Brown） | [2025 L10 RL for LLM Reasoning](https://www.youtube.com/watch?v=O2VpNnwB4lM)（封存頁列的講者是 Aviral Kumar） | **講者不同**，影片只能當背景 |
| L16 RL for Robots: Sim-to-Real Transfer（客座 Guanya Shi） | 2025 的 L16 是 Autonomous Learning；sim-to-real 在 2025 L17，封存頁列的講者是 Ashish Kumar（[影片](https://www.youtube.com/watch?v=Hp1WBWghrak)標題是「Advancing Robot Intelligence」） | 講者和切分方式都不同 |
| L17 RL for Robots: RL for VLAs | 沒有對應 | 2026 新增，沒有公開錄影 |
| 無（14 號是期中考日） | [2025 L14 Exploration](https://www.youtube.com/watch?v=4tlSKdi8teU) | 2026 拿掉這講，Meta-RL 篇會提一句，列為選看 |

作業也不一樣。2025 有四份作業，[2025 HW4](https://cs224r.stanford.edu/spring_2025/material/CS224R_2025_Homework_4.pdf) 分兩部分：goal-conditioned DQN 加 hindsight experience replay，以及 black-box meta-RL 對上 DREAM。2026 砍到三份，本系列只在多任務和 Meta-RL 兩篇把 2025 HW4 列成「延伸練習（2025 封存）」。

## 系列弧線

官方課序本身就符合學習順序，本系列直接沿用，只把作業篇插在它依賴的講次後面：

```text
行為怎麼表示（L1 MDP、L2 模仿）── HW1
   │
on-policy 梯度（L3 PG → L4 Actor-Critic）
   │
off-policy（L5 PPO/SAC → L6 Q-learning）── HW2
   │
不能再互動時（L7 Offline RL → L8 獎勵從哪來）── HW3
   │
套到 LLM（L9 RLHF/DPO → L10 Reasoning）── Default Project
   │
學世界和多任務（L11 MBRL → L12 多任務/GCRL → L13 Meta-RL → L15 階層式）
   │
套到機器人（L16 Sim-to-Real → L17 VLA）
   │
L18 前沿與研究方法
```

目標讀者是學過 ML/DL 基礎、會用 PyTorch，想從模仿學習一路讀到 LLM RL 和機器人基礎模型的工程師或研究生。

| 篇 | 主題 | 對應官方材料 |
|---|---|---|
| 1 | [L1：把做決策寫成 RL 問題](/posts/ai/2026-09-30-cs224r-intro-mdps-behavior) | 01_intro_2026 |
| 2 | [L2：模仿學習與能表達多峰分佈的 policy](/posts/ai/2026-09-30-cs224r-imitation-learning) | 02_imitation_2026 |
| 3 | [HW1：Flappy Bird 模仿學習](/posts/ai/2026-09-30-cs224r-hw1-imitation-flow-matching-dagger) | HW1 |
| 4–7 | [Policy Gradients](/posts/ai/2026-09-30-cs224r-policy-gradients)、[Actor-Critic](/posts/ai/2026-09-30-cs224r-actor-critic)、[Off-Policy Actor-Critic](/posts/ai/2026-09-30-cs224r-off-policy-actor-critic-ppo-sac)、[Q-learning](/posts/ai/2026-09-30-cs224r-q-learning) | L3–L6 |
| 8 | [HW2：線上 RL](/posts/ai/2026-09-30-cs224r-hw2-online-rl-sawyer) | HW2 |
| 9–10 | [Offline RL](/posts/ai/2026-09-30-cs224r-offline-rl)、[Reward Learning](/posts/ai/2026-09-30-cs224r-reward-learning) | L7–L8 |
| 11 | [HW3：Offline RL](/posts/ai/2026-09-30-cs224r-hw3-offline-rl-awac-iql) | HW3 |
| 12–13 | [RLHF 與偏好最佳化](/posts/ai/2026-09-30-cs224r-rlhf-dpo-preference-optimization)、[LLM Reasoning 的 RL](/posts/ai/2026-09-30-cs224r-rl-llm-reasoning) | L9–L10 |
| 14 | [Default Project：LLM 的 RL 微調](/posts/ai/2026-09-30-cs224r-default-project-llm-rl) | Default Project |
| 15–18 | [Model-Based RL](/posts/ai/2026-09-30-cs224r-model-based-rl)、[多任務與 GCRL](/posts/ai/2026-09-30-cs224r-multi-task-goal-conditioned-rl)、[Meta-RL](/posts/ai/2026-09-30-cs224r-meta-rl)、[階層式 RL 與 IL](/posts/ai/2026-09-30-cs224r-hierarchical-rl-il) | L11–L13、L15 |
| 19–20 | [Sim-to-Real](/posts/ai/2026-09-30-cs224r-sim2real-robot-learning)、[VLA 的 RL](/posts/ai/2026-09-30-cs224r-rl-for-vlas) | L16–L17 |
| 21 | [前沿與研究方法](/posts/ai/2026-09-30-cs224r-frontiers-how-to-research) | L18 |

## 今晚可以做的事

1. 打開[課程首頁](https://cs224r.stanford.edu/)，把課表那一欄從上到下看一遍，記下每講的 optional reading。
2. 如果 value function、Q-function 對你還陌生，先讀 [Sutton & Barto](http://incompleteideas.net/book/RLbook2020.pdf) 第 3 章。
3. 下載 [HW1 PDF](https://cs224r.stanford.edu/material/hw1/CS224R_2026_Homework_1.pdf) 和[起始碼](https://cs224r.stanford.edu/material/hw1/hw1_starter_code.zip)，照 installation.md 把環境裝起來。HW1 不用 Modal，筆電或 Colab 就能開始。
4. 看 [2025 L1 錄影](https://www.youtube.com/watch?v=EvHRQhMX7_w)，配著 2026 的第一講投影片，然後讀[本系列第 1 篇](/posts/ai/2026-09-30-cs224r-intro-mdps-behavior)。

## 延伸閱讀

這些站內系列和 CS224R 有重疊，但本系列不因此刪減內容，只在這裡放連結：

- [Berkeley CS285 Spring 2026 導讀](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview)：另一門深度 RL 研究所課，理論推導更完整；相關篇目有[模仿學習與 RL 基礎](/posts/learning/2026-08-22-berkeley-cs285-imitation-rl-basics)、[policy 與 value 方法](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods)、[推論與 offline RL](/posts/learning/2026-08-22-berkeley-cs285-inference-offline-rl)、[探索與開放問題](/posts/learning/2026-08-22-berkeley-cs285-exploration-open-problems)、[作業與專題路線](/posts/learning/2026-08-22-berkeley-cs285-homework-project-route)
- CS336：[SFT 與 RLHF](/posts/ai/2026-08-22-cs336-sft-rlhf)、[RLVR](/posts/ai/2026-08-22-cs336-rlvr)，從語言模型訓練流程看 RL
- CME295：[偏好調整](/posts/ai/2026-09-29-cme295-preference-tuning)、[LLM 的 RL](/posts/ai/2026-09-29-cme295-rl-with-llms)、[LLM reasoning](/posts/ai/2026-09-29-cme295-llm-reasoning)
- [全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)：A0–A3 分級的定義

**系列導覽**：下一篇 [L1：把做決策寫成 RL 問題](/posts/ai/2026-09-30-cs224r-intro-mdps-behavior)

## 參考資料

- [CS224R 課程首頁與課表（Spring 2026）](https://cs224r.stanford.edu/)
- [Lecture 1 投影片：Course Intro + Start of MDPs & Imitation（2026）](https://cs224r.stanford.edu/slides/01_cs224r_intro_2026.pdf)
- [CS224R Spring 2025 封存頁](https://cs224r.stanford.edu/spring_2025/)
- [CS224R Spring 2025 YouTube 播放清單（Stanford Online）](https://www.youtube.com/playlist?list=PLoROMvodv4rPwxE0ONYRa_itZFdaKCylL)
- [HW1 PDF（2026）](https://cs224r.stanford.edu/material/hw1/CS224R_2026_Homework_1.pdf)
- [HW2 PDF（2026）](https://cs224r.stanford.edu/material/hw2/CS224R_2026_Homework_2.pdf)
- [HW3 PDF（2026）](https://cs224r.stanford.edu/material/hw3/CS224R_2026_Homework_3.pdf)
- [CS224R Compute Guide（Modal）](https://cs224r.stanford.edu/material/CS224R_compute_guide.pdf)
- [Default Project Guidelines（2026）](https://cs224r.stanford.edu/material/CS224R_Default_Project_Guidelines.pdf)
- [Custom Project Guidelines（2026）](https://cs224r.stanford.edu/material/CS224R_Custom_Project_Guidelines.pdf)
- [2025 HW4：Goal-Conditioned RL & Meta-RL](https://cs224r.stanford.edu/spring_2025/material/CS224R_2025_Homework_4.pdf)
- [Sutton & Barto, Reinforcement Learning: An Introduction（2nd ed.）](http://incompleteideas.net/book/RLbook2020.pdf)
- [CS221 Autumn 2022 modules](https://stanford-cs221.github.io/autumn2022/modules/)
