---
title: "CS224R L17：用 RL 改進機器人基礎模型（VLA）"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, ai-course, stanford, reinforcement-learning, embodied-ai, vision-language-model]
lang: zh-TW
series:
  name: "Stanford CS224R 導讀"
  order: 20
tldr: "只用模仿學習訓練的 VLA，成功率常卡在 80% 左右，要讓機器人自己上工卻常需要 99% 以上。CS224R 第 17 講把「怎麼在真機上用 RL 改進 VLA」拆成三條路：把 RL 改寫成監督學習（iterated offline RL）、在 VLA 的表示或擴散雜訊上另外學一個小 policy、學一個小 policy 去修改 VLA 的動作。投影片自己說這是還沒解決的研究問題，內容是近期主題加講者觀點。"
description: "Stanford CS224R Spring 2026 第 17 講「RL for Robots: RL for VLAs」導讀：VLA 的組成與 action expert、為什麼模仿學習會停在 80% 左右、VLA 難用 RL 訓練的兩個原因、online 與 iterated offline RL 的取捨、直接用 PPO 可不可行、π*0.6 的 advantage-conditioned 監督學習、DSRL 的擴散雜訊控制、EXPO 的 edit policy 與 on-the-fly policy，以及講者對這個領域的展望。2026 新增講次，沒有公開錄影。"
draft: false
glossary:
  - term: "VLA"
    aliases: ["vision-language-action model", "視覺語言動作模型"]
    definition: "vision-language-action model。最常見的機器人基礎模型形式：從預訓練的視覺語言模型出發，用機器人示範、VLM 任務和人類影片等混合資料訓練，常另外接一個用擴散或 flow matching 輸出連續動作的 action expert。"
    context: "CS224R L17 的主角。"
  - term: "diffusion steering"
    aliases: ["擴散引導", "DSRL"]
    definition: "不改 VLA 權重，而是把 VLA 擴散過程的初始雜訊當成動作空間，另外訓練一個小的 RL policy 去輸出「會被去雜訊成好動作」的雜訊。CS224R L17 用 DSRL（Wagenmaker et al., CoRL 2025）示範，以 SAC 訓練。"
    context: "CS224R L17 key theme #2 的版本 A。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs224r-rl-for-vlas-en)

**影片狀態：僅附官方入口或錄影清單。** [影片來源與說明](#課程影片來源)

**本文依據 [CS224R](https://cs224r.stanford.edu/) Spring 2026 版。** 這是 [Stanford CS224R 導讀](/posts/ai/2026-09-30-cs224r-course-overview)系列第 20 篇，接續 [L16 Sim-to-Real 機器人學習](/posts/ai/2026-09-30-cs224r-sim2real-robot-learning)，對應 2026 年 5 月 27 日（第 9 週週三）的第 17 講「RL for Robots: RL for VLAs」。投影片封面標題是「RL for Robot Foundation Models」。

用到的官方材料：

- 當期投影片 [17_cs224r_rl_vlas_2026.pdf](https://cs224r.stanford.edu/slides/17_cs224r_rl_vlas_2026.pdf)（34 頁）
- 課表這一講**沒有列指定閱讀**，下面提到的論文都是投影片上引用的

存取等級是 **A3**：投影片匿名可下載，2026 錄影只放在 Canvas 上。

**這一講沒有配套影片。** 它是 2026 年新增的講次，[Spring 2025 封存頁](https://cs224r.stanford.edu/spring_2025/)和 [2025 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rPwxE0ONYRa_itZFdaKCylL)都沒有對應的一講。本文只能依投影片寫，投影片上的圖和影片說明不了的地方，不替它補。

投影片第 4 頁也先打了預防針：**這是一個開放、活躍的研究問題**，這講涵蓋的是近期的幾個主題，加上講者對這個領域的看法。讀的時候請把它當成一張研究地圖，不是定論。

## 課程影片來源

下方提供官方課程與既有錄影入口。尚未核對到可直接嵌入、且對應本文範圍的單支公開影片。

課程與錄影入口：

- [2025 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rPwxE0ONYRa_itZFdaKCylL)
- [官方課程／講次來源](https://cs224r.stanford.edu/)

## 場景：從模擬搬到真機，換成從預訓練模型出發

第 3 頁把這講和上一講接起來：

- 上一講：能不能在**模擬的**機器人上做 RL，再把行為搬到真實世界？
- 這一講：怎麼在**真實的**機器人上，對**預訓練好的基礎模型**做 RL？

### VLA 長什麼樣

第 5–6 頁描述最常見的機器人基礎模型，也就是 vision-language-action（VLA）模型：

- 從預訓練的視覺語言模型（VLM）出發；另一種設計是從生成式影片模型出發
- 訓練資料常混合三種：機器人示範（模仿學習）、VLM 任務（問答、描述、偵測）、人類影片（動作預測）
- 常會接一個以擴散為基礎的 **action expert**：
  - 用擴散或 flow matching 預測連續動作
  - attend 到 LLM backbone 的所有 activation
  - 設計成不必對整個 backbone 做多次前向
  - 梯度通常不回傳到 backbone

flow matching 在 [HW1](/posts/ai/2026-09-30-cs224r-hw1-imitation-flow-matching-dagger) 已經實作過，想補直覺可以讀 [MIT 6.S184 的 flow matching 與擴散導讀](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview)。

### 問題在哪：卡在 80%

第 7 頁：只用模仿學習訓練的 VLA，**表現常停在 80% 左右**，圖是 π0.5 在沒看過的房間裡的表現。

- 這和 LLM 在 SFT 之後再做 RL 會變強的情況類似（見 [L9 RLHF 與偏好最佳化](/posts/ai/2026-09-30-cs224r-rlhf-dpo-preference-optimization)）
- 機器人要自主工作，常需要 **99% 以上**的可靠度
- 所以這是 RL 微調的自然用途，預訓練好的 VLA 可以當 RL 的有效初始化

投影片也註明：DAgger 也有幫助，常和 RL 一起用。

## 為什麼 VLA 難用 RL 訓

第 8 頁列了兩大原因：

**1. VLA 很大，每次梯度更新都貴**

- 常想在雲端訓練，roll-out 則在機器人旁的本機跑
- 每個實驗的迭代時間變長
- 大量調超參數既貴又費時

**2. VLA 是用模仿學習預訓練的**

- 沒有預訓練好的價值函數或 critic
- 常用擴散或 flow matching 訓練，RL 演算法很難直接套上去
- 常用 action chunking，這在 RL 裡也不是常見選擇

### Online 還是 iterated offline

第 9 頁比較兩種迴圈：

| | Online RL（例如 SAC） | （Iterated）offline RL |
|---|---|---|
| 一輪收多少資料 | 1 個 timestep | 1k 個 episode |
| 一輪做多少梯度步 | 1 步 | 10k 步 |
| 有 bug 或超參數設錯時 | 要重跑實驗、重收資料 | 在既有資料上重跑訓練 |

投影片的結論是：offline 對大模型**簡單得多**。學習率、epoch 數、gradient clipping 這些常出錯的地方，offline 只要重訓就好。offline RL 的基礎見 [L7 Offline RL](/posts/ai/2026-09-30-cs224r-offline-rl)。

**怎麼做**：如果你在評估要不要替自家機器人或 agent 模型做 RL 微調，先估一件事：每次重收一輪資料要花多少時間和人力。這個數字越大，越該先走 iterated offline 的路。

## 工具一：直接用 PPO 行不行

第 11 頁的回答是「可以，但是……」。兩個例子：

- 用 RL 微調 OpenVLA：Li et al. [SimpleVLA-RL](https://arxiv.org/abs/2509.09674)（2025）
- 用 RL 微調 π0.5：Chen et al. πRL（2026）

但投影片點出兩個限制：

- 需要**大量的 online policy roll-out**，很多論文甚至不報告用了多少樣本
- 結果**只限於在模擬器裡訓練**

## 工具二：iterated offline RL，能不能只用監督學習

第 12 頁提出 **key theme #1**：能不能設計一個以監督學習為基礎的方法？如果可以，它可能比較容易擴展到大模型和大資料。

分兩步：

1. **學價值函數**：可以用 Monte Carlo 擬合 V
2. **用價值函數得到更好的 policy**：監督 policy 去做 V 認為比較好的動作

投影片用 Physical Intelligence 的 [π*0.6](https://arxiv.org/abs/2511.14759)（2025）說明：

- **價值函數**（第 13 頁）：在大規模示範資料上擬合一個多任務、語言條件的 V。用預訓練 VLM，條件是當下影像、語言指令和 episode metadata，**預測還要多久完成**（time to go）
- **Policy**（第 14 頁）：advantage-conditioned 監督學習
  - 用預測的價值估計 advantage A(s, a)
  - 把 advantage 二值化，告訴 policy 這個動作好不好
  - 以二值化的 advantage 為條件，用監督學習微調 policy
- **完整演算法**（第 15 頁）：收一大批 roll-out 和人為介入 → 更新價值函數預測 time-to-go → 用 advantage-conditioned 監督學習更新 VLA，然後重複

第 16 頁的結果標題是：RL 後訓練比 IL 後訓練的**吞吐量高 2 倍**。第 17 頁的影片是和人合作做拿鐵，以及連續運作 13 小時穩定做拿鐵。

<details>
<summary>為什麼二值化 advantage 就能改進 policy</summary>

這段是我的補充，投影片上沒有寫。訓練時 policy 同時看到「好」和「壞」兩種標記的動作，學會兩種條件下各自的動作分佈；推論時固定給「好」的條件，就只從好動作的分佈裡抽。這樣整個流程只剩監督學習，不需要 policy gradient，也就避開了第 8 頁說的「擴散或 flow matching 很難套 RL」。這個想法和 L7 講過的 advantage-weighted 類方法相近，都是用 advantage 去篩選或加權監督訊號。

</details>

### 這是最好的配方嗎

第 18 頁講者自己提了三點保留：

1. 即使在大規模設定下，**TD 更新**應該也能勝過 Monte Carlo 價值學習
2. 也應該能受益於更強的 policy improvement 方法
3. **Online RL** 應該更有資料效率，因為它能更快找到失敗模式、排除新策略，達到更高表現，代價是基礎設施更複雜

## 工具三：online RL，先降維

第 20 頁提出 **key theme #2**：不端到端微調 VLA，改成**用 VLA 的表示另外學一個 Gaussian policy**。兩個版本：

- **版本 A**：把 VLA 擴散過程的雜訊當成動作空間，訓練 RL policy 去控制雜訊（Wagenmaker et al. DSRL, 2025）
- **版本 B**：壓縮 VLA 的視覺表示，在這個表示上做 RL（Xu et al. RLT, 2026）

投影片加註：RL 之後，可以把 policy 產生的資料**蒸餾回 VLA**。

### DSRL：訓練一個會挑雜訊的 policy

第 21–23 頁展開版本 A，出自 [Steering Your Diffusion Policy with Latent Space Reinforcement Learning（Wagenmaker, Nakamoto, Zhang et al., CoRL 2025）](https://arxiv.org/abs/2506.15799)。直覺是：不同的雜訊向量會被去雜訊成不同的動作，那就訓練一個 policy 輸出「會變成好動作」的雜訊。

取樣：

1. 抽 w_t ∼ π_steer(· | s_t; θ)
2. 去雜訊得到一段動作 a_{t:t+h} = π_VLA(s_t, w_t)
3. 在環境執行 a_{t:t+h}，觀察 s_{t+h}

訓練：

1. 收 roll-out (s_1, w_1, r_1, …, s_T) 放進 buffer
2. 從 buffer 抽 minibatch
3. 用 **SAC** 更新 Q_ϕ(s_t, w_t) 和 π_steer(w_t | s_t; θ)

第 23 頁的數字：訓練資料是 65 個 online episode、大約 10k 步，**大約比 PPO 有效率 O(100 倍)**。

注意這裡 Q 的輸入是雜訊 w，不是實際動作 a。VLA 被當成環境的一部分凍結起來，SAC 只需要處理一個低維的 Gaussian policy，第 8 頁說的「擴散模型難套 RL」和「模型太大」兩個問題一起繞過了。SAC 的細節見 [L5 Off-Policy Actor-Critic](/posts/ai/2026-09-30-cs224r-off-policy-actor-critic-ppo-sac)。

## 工具四：online RL，學一個修改動作的小 policy

第 25 頁提出 **key theme #3**：學一個小的 Gaussian policy 去**修改**（擴散）VLA 的動作。兩個版本：

- **版本 A**：actor-critic 演算法，再蒸餾回 VLA（Xiao et al. Probe-Learn-Distill, 2025）
- **版本 B**：actor-critic 演算法，測試時加上 best-of-N 取樣（Dong et al. EXPO-FT, 2026）

### EXPO：edit policy 加上取樣

第 26–30 頁用 [EXPO: Stable Reinforcement Learning with Expressive Policies（Dong, Li, Sadigh, Finn, ICLR 2026）](https://arxiv.org/abs/2507.07986) 展開。基本做法：

1. 最佳化一個較小的 Gaussian **edit policy**，讓 Q 值最大（像一般 RL）
2. 基礎 policy 用模仿學習，在所有成功的資料上訓練

投影片提醒，只這樣做**可能不穩定**：edit policy 天生會落後 Q 函數，也可能崩潰。

穩定化的做法是**即時用取樣去最大化最新的 Q 函數**（第 27 頁）：

1. 從 π_base 抽多個 a
2. 從 π_edit(ã | s, a) 抽多個 ã
3. 在 {a_1, …, a_n, ã_1, …, ã_n} 裡挑 Q 最高的

好處是減少和 Q 函數之間的落差，也不怕 edit policy 崩潰。講者問：這也許可以看成一種 **test-time scaling**？

第 28 頁有一個標了「!!」的重點：擬合 Q 時，Bellman backup 裡的 a′ 要怎麼挑？答案是**用這個 on-the-fly policy**，也就是上面那套「抽樣再挑最高 Q」的程序。

第 30 頁的消融：

- 拿掉 edit policy：價值最大化明顯受阻
- Bellman backup 不用 on-the-fly policy：在某些環境表現很差

第 29 頁是真機結果，出自 EXPO-FT（Dong, Hung, Gao, Sadigh, Finn, 2026, Sample-Efficient RL Fine-Tuning for VLAs）：

- 比 SFT 和 DAgger 可靠度更高
- 訓練資料平均 19 分鐘的經驗，大約 11k 步
- 比 DSRL 和 HIL-SERL 學得更有效率、更有效

**怎麼做**：如果你只能拿到一個凍結的 VLA（或任何凍結的生成式 policy），這一講給了兩個不必動它權重的切入點：控制它的輸入雜訊，或在它的輸出上加一個小修正器。先挑你手上最容易暴露的那個介面開始。

## 連回來：總結與展望

第 32 頁的總結：

- **挑戰**：VLA 很大，梯度更新貴；VLA 是用模仿學習預訓練的
- **三個主題**：
  - #1：為了可擴展性，設計以監督學習為基礎的方法（offline RL）
  - #2：用 VLA 的表示另外學一個 Gaussian policy（online RL）
  - #3：學一個小的 Gaussian policy 去修改（擴散）VLA 的動作（online RL）

第 33 頁是講者的展望，分兩面：

1. **令人興奮的進展**：有證據顯示 RL 能大幅提升最先進 VLA 的表現和速度，也有證據顯示能達到真實部署需要的表現
2. **還沒有令人滿意的解法**：online RL 應該比 offline 更有效率、更有效；需要 residual policy 或退到潛在空間做 RL，比起直接對 VLA 權重做 RL，**感覺不夠令人滿意**

這個結尾也回應了 [L15 階層式 RL 與模仿學習](/posts/ai/2026-09-30-cs224r-hierarchical-rl-il) 第 41 頁的註記：用 RL 微調大型（階層式）機器人系統，是開放而且重要的研究方向。

下一講是最後一講，談總結、開放問題，以及怎麼做 RL 研究。見 [L18 前沿與研究方法](/posts/ai/2026-09-30-cs224r-frontiers-how-to-research)。

站內延伸閱讀：

- [Berkeley CS285 的 inference 與 offline RL 導讀](/posts/learning/2026-08-22-berkeley-cs285-inference-offline-rl)
- [CS336 RLVR](/posts/ai/2026-08-22-cs336-rlvr)，LLM 那一側「SFT 之後再做 RL」的對照

## 這一篇可以確認與不能確認的

可以確認：2026 投影片的文字、演算法步驟、數字（80%、99%、2 倍、13 小時、65 episode／約 10k 步、O(100 倍)、19 分鐘／約 11k 步）與論文標註；課表的日期與「沒有指定閱讀」；2025 封存頁和播放清單都沒有對應講次。不能確認：這講的講者（投影片沒有寫名字，只說「my opinion」）；各圖表的具體數值、比較基準和實驗設定；πRL、RLT、Probe-Learn-Distill、EXPO-FT 的論文全文（我沒有找到或沒有開啟它們的原始頁面，只依投影片上的標註）。

系列導覽：上一篇 [L16 Sim-to-Real 機器人學習](/posts/ai/2026-09-30-cs224r-sim2real-robot-learning)｜下一篇 [L18 前沿與研究方法](/posts/ai/2026-09-30-cs224r-frontiers-how-to-research)｜[系列入口](/posts/ai/2026-09-30-cs224r-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [CS224R: Deep Reinforcement Learning（Spring 2026 課程官網與課表）](https://cs224r.stanford.edu/)
- [Lecture 17 投影片：RL for Robot Foundation Models（2026）](https://cs224r.stanford.edu/slides/17_cs224r_rl_vlas_2026.pdf)
- [CS224R Spring 2025 封存頁（沒有對應講次）](https://cs224r.stanford.edu/spring_2025/)
- [Physical Intelligence 2025：π*0.6: a VLA That Learns From Experience](https://arxiv.org/abs/2511.14759)
- [Wagenmaker et al. 2025：Steering Your Diffusion Policy with Latent Space Reinforcement Learning（DSRL）](https://arxiv.org/abs/2506.15799)
- [Dong et al. 2025：EXPO: Stable Reinforcement Learning with Expressive Policies](https://arxiv.org/abs/2507.07986)
- [Li et al. 2025：SimpleVLA-RL: Scaling VLA Training via Reinforcement Learning](https://arxiv.org/abs/2509.09674)
- [Luo et al. 2024：Precise and Dexterous Robotic Manipulation via Human-in-the-Loop Reinforcement Learning（HIL-SERL）](https://arxiv.org/abs/2410.21845)
- [Physical Intelligence 2025：π0.5](https://arxiv.org/abs/2504.16054)
