---
title: "CS224R L18：Deep RL 的前沿問題，以及怎麼做研究"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, ai-course, stanford, reinforcement-learning, research-project, ai-safety]
lang: zh-TW
series:
  name: "Stanford CS224R 導讀"
  order: 21
tldr: "CS224R 最後一講分三段：先把整學期的方法收成一個工具箱，再列七個還沒解決的問題（沒有可驗證獎勵的領域、怎麼用 prior data、world model、怎麼 scale、安全、幻覺與校準、通才系統的評估），最後用一半的篇幅講怎麼做研究：同時要有重要的問題和可行的計畫、先把風險挪到最前面、及早考慮轉向、研究成果要分享出去才算數。配著 2026 年 244 份公開的期末專題報告一起讀，最容易看出這些原則落地的樣子。"
description: "Stanford CS224R Spring 2026 第 18 講「Frontiers」導讀：2026 版新增的整學期方法總整理、七個 deep RL 前沿問題與投影片引用的論文、Chelsea Finn 的研究方法建議（選題、處理風險、何時轉向、怎麼分享），以及 2026 期末專題列表頁的內容與怎麼拿來選題。"
draft: false
glossary:
  - term: "batch online RL"
    aliases: ["批次線上 RL"]
    definition: "介於 online 與 offline RL 之間的做法：不在每一步交錯更新模型和收資料，而是做少數幾輪「收一大批資料 → 更新模型」。適合真實使用者對話、真實機器人這類很難頻繁更新模型的場景。"
    context: "CS224R L18 在「怎麼 scale」一節把它列為開放問題。"
  - term: "sycophancy"
    aliases: ["諂媚", "迎合"]
    definition: "語言模型傾向說出使用者想聽的話，例如附和使用者的立場，而不是給出正確的答案。偏好最佳化是成因之一，因為人給的偏好本身就會獎勵「同意我」和「聽起來有自信」。"
    context: "CS224R L18 用它說明聊天機器人的獎勵為什麼難定義。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs224r-frontiers-how-to-research-en)

**影片狀態：僅附相關補充影片；原講次錄影未確認。** [影片來源與說明](#課程影片來源)

**本文依據 [CS224R](https://cs224r.stanford.edu/) Spring 2026 版。** 這是 [Stanford CS224R 導讀](/posts/ai/2026-09-30-cs224r-course-overview)系列第 21 篇，也是最後一篇，接續 [L17 VLA 的 RL](/posts/ai/2026-09-30-cs224r-rl-for-vlas)，對應 2026 年 5 月 29 日（第 9 週週五）的第 18 講「Frontiers」。課表上這一講沒有列指定閱讀。

用到的官方材料：

- 當期投影片 [18_cs224r_frontiers_how_to_research_2026.pdf](https://cs224r.stanford.edu/slides/18_cs224r_frontiers_how_to_research_2026.pdf)（57 頁）
- [2026 期末專題列表頁](https://cs224r.stanford.edu/projects/cs224r_final_projects.html)（244 份報告，每份可點開 PDF）
- [Custom Project Guidelines](https://cs224r.stanford.edu/material/CS224R_Custom_Project_Guidelines.pdf)，用來對照「研究方法」一段講的東西在專題評分上怎麼落地

存取等級是 **A3**：投影片、專題規格和專題報告都匿名可讀，2026 錄影只放在 Canvas。

配套影片（**補充教材**）：[Spring 2025 Lecture 18: Frontiers](https://www.youtube.com/watch?v=FacJ_1tTSx4)（約 71 分鐘）。我對照過 [2025 版投影片](https://cs224r.stanford.edu/spring_2025/slides/18_cs224r_frontiers_how_to_research.pdf)（53 頁）和 2026 版：2026 版多了開頭三頁的整學期總整理和一頁研究案例，其餘前沿問題和研究建議的文字幾乎一樣。所以 2025 影片可以涵蓋本講大部分內容，只是開頭的總整理要以 2026 投影片為準。

## 課程影片來源

本文以 Spring 2026 教材為準；下列 Spring 2025 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=FacJ_1tTSx4
title: Spring 2025 Lecture 18: Frontiers（YouTube，補充）
```

原始影片：[Spring 2025 Lecture 18: Frontiers（YouTube，補充）](https://www.youtube.com/watch?v=FacJ_1tTSx4)

課程與錄影入口：

- [官方課程／講次來源](https://cs224r.stanford.edu/)

Spring 2026 當季講次錄影放在需 Stanford 登入的 Canvas／Panopto；公開 YouTube 播放清單是 Spring 2025。 查核日期：2026-10-10。

## 場景：學完整套工具之後，還剩什麼沒解決

投影片第 2 頁的課程提醒很現實：下週三海報發表，再下週一交期末報告，**不能用 late day，也不能延期**。這一講是修課學生在專題最後衝刺階段聽的。

這講的結構是三段：

1. 回顧：deep RL 是一個工具箱（2026 新增）
2. 前沿與開放問題：七個還沒解決的方向
3. 怎麼做（deep RL）研究

第三段佔了將近一半的投影片。這是整門課裡唯一一講不教演算法、而是教「接下來怎麼自己往下走」。

## 回顧：deep RL 是一個可以混搭的工具箱

2026 版開頭先用三頁把整學期收起來。

第 3 頁是 [L6 Q-learning](/posts/ai/2026-09-30-cs224r-q-learning) 那張四類 online 方法的總表（vanilla PG、PPO 類、off-policy actor-critic、Q-learning），這裡不重複，細節看那一篇。

第 4 頁把方法按「能不能收新資料」再切一次：

| | Offline（不收新資料） | Online（要收資料） |
|---|---|---|
| 模仿學習 | Behavior cloning：直接監督資料裡的動作 | DAgger |
| RL | Offline RL（AWR、AWAC、IQL）：只用離線資料，IQL 用非對稱 loss 學 V | Off-policy RL（DQN、SAC）：可以重用別的 policy 的資料；On-policy RL（PPO、importance sampling）：只用目前 policy 的資料 |

投影片在兩端各標了代價：模仿學習需要專家資料但不需要 reward；越往 on-policy 走，需要的線上資料越多。

第 5 頁是本講最值得存下來的一張圖，標題是「What makes up an RL algorithm?」，把一個 RL 演算法拆成五個可替換的零件：

- **資料**：offline 的示範或儲存的經驗；online 的 DAgger 或 policy rollout
- **獎勵函數**：直接給定或人工標註、從範例或偏好學來（[L8](/posts/ai/2026-09-30-cs224r-reward-learning)）、自監督（例如 goal-conditioned RL）
- **Policy 更新方法**：監督式 BC、policy gradient、actor-critic、Q-learning
- **價值學習**：Monte Carlo、TD、n 步回報
- **網路模型**：Gaussian、Categorical、diffusion、flow、autoregressive

旁邊再列四組「工具」：用 off-policy 資料（importance weighting、replay buffer）、用 offline 資料（監督資料動作、非對稱價值 loss）、跨任務共享（多任務 policy、hindsight relabeling）、學到的模型（合成資料、測試時規劃）。

投影片的結論是：**很多演算法就是依照使用情境的需求，把這些工具混搭起來。**

**怎麼做**：挑一篇你最近讀的 RL 論文，把它填進這五個零件和四組工具。如果某一格你填不出來，通常就是論文沒講清楚、或是你還沒讀懂的地方。

## 前沿：七個還沒解決的問題

第 7 頁把前沿問題分成三類、七項：

1. 問題設定：(a) 沒有獎勵、不可驗證的領域
2. 方法：(b) 利用先驗資料與知識、(c) 使用 world model、(d) 怎麼 scale
3. 部署與評估：(e) 安全、(f) 處理不準確與幻覺、(g) 通才系統的評估

下面照順序走。投影片每一項都以問題的形式呈現，**沒有給答案**，我也不替它補答案。

### (a) 沒有獎勵、不可驗證的領域

第 8–11 頁先劃出「沒問題」的領域：遊戲、數學推理、程式題，這些都有可驗證的獎勵。難的是獎勵不存在、或延遲非常久的領域，投影片列了五個：

- **聊天機器人**：目前靠偏好最佳化，但得到的是「你想聽的話」。投影片引用 [Sharma & Tong et al. 2023](https://arxiv.org/abs/2310.13548) 的諂媚（sycophancy）研究，把人類偏好拆成「同意我」「有自信」「真的是對的」三個因素，並寫出「People don't actually give good preferences!」。後面還列了個人化與極化的拉扯，以及多個目標互相競爭的問題。
- **機器人**：目前的獎勵通常是二元的或手工設計的。投影片放了幾張摺襯衫的照片，問你要怎麼替每一種摺法打分數。
- **YouTube 推薦**：用 engagement（例如點擊）和滿意度（例如按讚）的加權組合，而**權重是人工調的**。
- 從數學推理延伸到**科學實驗與推理**。
- **機器能不能以「學習」本身為最佳化目標？**

這一項直接接上 [L8 Reward Learning](/posts/ai/2026-09-30-cs224r-reward-learning) 和 [L9 RLHF](/posts/ai/2026-09-30-cs224r-rlhf-dpo-preference-optimization)：那兩講教的是怎麼學獎勵，這一講提醒你學到的獎勵可能本身就有偏差。

### (b) 怎麼利用先驗資料與知識

第 13 頁先講目前的預設做法：**用預訓練模型初始化權重，用離線資料初始化 replay buffer。** 投影片引用 [Ball et al. 2023](https://arxiv.org/abs/2302.02948)，並特別標註這個方法只初始化 buffer、不初始化權重。

接著提兩個開放問題：

1. 更抽象的先驗知識怎麼用？例如提示，或新聞文章裡的知識。
2. 預訓練的權重和資料，會不會反過來把學習限制住？

投影片把第二個問題具體化成兩句：LLM 怎麼超越預訓練，去解人類還沒解過的問題？機器人和自駕車怎麼學得比人更快、更可靠？

### (c) 怎麼用 world model（影片生成模型）

第 15 頁的立場是：影片生成模型有豐富的世界知識，應該有用，**但有大而微妙的挑戰**。

投影片舉的例子：用示範資料加上某一個 policy 的 rollout，訓練一個「給定目前狀態和接下來 h 步動作，預測未來 h 步狀態」的模型，再拿它評估新 policy 的動作好不好。問題有兩個：

- 新 policy 的動作對這個模型來說是**分佈外**的
- 物理上的小誤差就會讓表現變很差

投影片列了兩個可能的解法：用更多不同 policy 的資料來訓練；或是換一種用法，例如只用示範訓練「給定狀態預測未來影片」，再配一個 goal-conditioned policy 去追那段預測的影片。

這一項接的是 [L11 Model-Based RL](/posts/ai/2026-09-30-cs224r-model-based-rl) 講的模型誤差問題，只是模型從 dynamics 換成了影片生成器。

### (d) 怎麼 scale

第 17 頁的判斷是：LLM 的大規模 RL 很令人興奮，但目前**要嘛 horizon 很短，要嘛非常 online**。兩個例子：

- **LLM 偏好最佳化**通常只看單輪對話，不看整段對話的結果。這讓問題變成短 horizon，也省掉了收集人在迴圈中資料的麻煩。
- **數學推理的 RL** 依賴從模型大量線上取樣，並和 policy 更新交錯進行。

所以開放問題是：**能不能用更長的 horizon、更少的線上資料做大規模 RL？** 第 18 頁拆成兩個子問題：

1. 能不能在大規模下訓練並使用準確的價值函數？投影片指出 PPO 這類演算法只拿價值函數來降低梯度變異，準確度可能不夠支撐 actor-critic 演算法。
2. 能不能做大規模的 **batch online RL**？很多應用很難把模型更新和資料收集交錯進行，尤其是大模型，例如跟真實使用者收對話、在真實機器人上收資料。比較實際的是做少數幾輪「收一大批資料 → 更新模型」，而且可能是非同步的。這會帶來新的考量，例如 policy 要夠有表達力，資料才夠廣。

第 18 頁引用了「Dong et al., 2025」。我找到的對應論文是 [What Matters for Batch Online Reinforcement Learning in Robotics?](https://arxiv.org/abs/2505.08078)（Perry Dong、Suvir Mirchandani、Dorsa Sadigh、Chelsea Finn），主題吻合，但投影片沒有給完整書目，這個對應是我自己比對的。

### (e) 安全

第 20–22 頁問：在醫療、自駕、心理諮商、法律和政治討論這類安全關鍵領域，AI 要怎麼開發和測試？

投影片的論證有三步：

1. 傳統做法是形式化驗證和機率保證，但它們的假設在真實世界通常不成立，而且開放世界的情境多到不可能逐一保證。投影片也提醒，人類司機、外科醫師、飛行員同樣會犯錯。
2. 大規模 ML 可以說是處理開放世界情境最成功的方法。那是不是去收大量「不安全情境」的資料？投影片的回答是：這樣做曾經帶來可怕的後果。
3. 所以留下兩個開放問題：能不能**不靠大量不安全事件的資料**就學會什麼是不安全的（也許用合成資料、也許用先驗知識）？能不能**一邊探索新行為、一邊保持安全**？

### (f) 處理不準確與幻覺

第 24 頁先指出，LLM 的輸出通常由人接收（聊天、程式碼生成），錯誤多半可以處理，**但人機介面沒有被好好最佳化**。投影片引用 Rajpurkar & Topol 在 2025 年《紐約時報》的評論和 Goh et al. 2024 的 JAMA 研究：AI 單獨診斷的準確率是 92%，醫師有 AI 協助時只有 76%，幾乎等於沒有 AI 時的 74%。

接著兩個開放問題：

1. **能不能最佳化「人加 AI」這個整體系統？** 例如讓模型更會估計和表達自己的不確定性。第 25 頁引用 [GPT-4 Technical Report](https://arxiv.org/abs/2303.08774) 的校準圖，左右對照預訓練的 GPT-4 和 PPO 後訓練的 GPT-4，標題寫「RLHF hurts model's calibration!」。投影片列出的一個可能方向是 [Tian et al. 2023](https://arxiv.org/abs/2305.14975)：讓模型用文字說出信心，並列出多個候選答案。
2. **沒有人在迴圈裡的時候，怎麼做到 99.99% 的可靠度？** 投影片認為 RL 很可能是解法的一部分，並舉 [Luo et al. 2024](https://arxiv.org/abs/2410.21845) 為「某些情境下有希望的結果」。

### (g) 通才系統的評估

第 28 頁把 RL 評估的難處講得很直接：

- 監督學習可以在留出的驗證集上量準確率
- RL 通常**沒有可靠的離線指標**，因為手上的資料是別的 policy 收的，很難評估新 policy 在它自己會到達的狀態上表現如何
- 通才模型要在很多條件下評估，問題更嚴重

那怎麼決定一個 policy 夠好可以部署？或是在幾個模型之間選哪一個？第 30 頁留下兩個開放問題：能不能發展出離線指標，**至少能排除爛模型**，更別說估計表現？怎麼挑出有代表性的真實情境，來做通才 policy 的線上評估？

第 29 頁只放了一則社群貼文的連結，標註「About one month ago」。這頁跟 2025 版一字不差，所以「一個月前」指的是 2025 年的時間點，不是 2026。

第 31 頁收尾：**「你們現在都已經具備開始處理這些挑戰的能力了。」**

**怎麼做**：從這七項裡挑一項，對照 [2026 期末專題列表](https://cs224r.stanford.edu/projects/cs224r_final_projects.html)，找兩三份標題相近的報告打開讀。學生專題的規模通常就是一個人一學期做得完的大小，很適合拿來估自己的第一個題目該切多大。

## 怎麼做（deep RL）研究

第 32 頁以後是研究方法。投影片沒寫講者名字，但課程首頁只列 Chelsea Finn 一位 instructor，以下第一人稱的故事應該是她本人的經驗。

第 33 頁的前言只有一句：**研究方法多元是好事。** 所以下面是一個人的建議，不是唯一正解。

### 先看清楚幾個現實

第 34 頁的背景故事：講者原本沒打算走研究（「你們也沒有！」），是因為想做 AI 前沿、還沒成熟的題目，而她在業界遇到做這些題目的人都有博士學位；後來發現研究的模糊性很有智識上的吸引力。

第 35 頁列了三個現實：

1. **不到 1% 的研究想法有長期影響。** 很多想法寫不成論文，很多論文影響很小。
2. **研究是漸進的。** 投影片舉的例子建立在一個 20 年的學術計畫 CASP（蛋白質結構預測的關鍵評估）和神經網路的進展上。
3. **在規模很重要的世界裡，簡單的想法影響更大，因為它們可以被 scale。**

第 36 頁的大綱分四部分：做什麼、怎麼做、怎麼分享、其他。投影片特別標註**前三部分同等重要**。

### 做什麼：重要的問題，加上可行的計畫

第 37–39 頁是三步檢查：

1. **需要兩樣東西：一個重要的問題，和一個怎麼解它的計畫。** 反例各一個：「解決氣候變遷」缺的是計畫；「一個很酷、能讓機器人成功率提高 1% 的演算法」缺的是重要的問題。投影片接著問：如果你非常成功，結果會長什麼樣子？
2. **你對它興奮嗎？** 研究是大量的工作，你興奮的話會成功得多。
3. **如果你殘酷地誠實面對它為什麼可能解不了問題，這個想法還有很高的機率成功嗎？** 如果沒有，它大概不會成功。

第 40 頁比較兩種起點：

| | 想法驅動 | 問題驅動 |
|---|---|---|
| 起點 | 先有想法，再找問題 | 先有問題，再找最好的解法 |
| 風險 | 可能根本不存在一個它能解的重要問題 | 如果解法事後看來很顯然，論文可能比較難寫 |
| 好處 | — | 保證你在做重要的問題 |
| 目標 | 讓想法成功 | 解決問題 |

第 42–43 頁是講者博士第二年實習的故事：她想建預測模型、用它讓很多台機器人學技能，結果發現現有的影片生成模型非常差。她是 ML 加機器人背景、不是電腦視覺背景，還是決定先去做一個更好的影片生成模型。投影片寫那篇論文後來成為她求職演講的基礎，有 1300 次引用，也讓社群知道這是值得研究的問題。

兩個結論：**不要把自己框在一個領域**，跨領域會帶來新問題和新想法；**不要當完美主義者**，專案一開始你永遠無法知道它的影響。

### 怎麼做：把風險挪到最前面

第 45 頁回到「不到 1% 的想法有長期影響」，所以關鍵是**處理風險**：

1. **盡可能把風險挪到前面。** 這很不舒服。在建大規模基礎設施之前，先設計並跑一些教學性質的小實驗，測試核心未知數。
2. 設計有針對性的實驗，用最快的方式測試未知數。
3. 嘗試很多想法，包括不同的問題，也就是「製造運氣」。
4. 在核心未知數出現生命跡象之前，**不要在心裡認定這個專案**。

第 46 頁是讓東西成功的五個做法：

1. 從一個能用的東西開始，再逐步加難度
2. 簡化
3. 跟朋友、同事、指導者聊
4. 重新檢查假設，專案開始時你以為對的事，可能會被實驗推翻
5. 它「想要」成功嗎？如果完全不想，大概也不會有影響力；能不能把專案範圍縮到「想要」成功的那部分？

第 47 頁是 2026 版新加的一頁，替第 5 點舉了一個例子，引用「Shi et al. 2025」。PDF 上只有標題和引用標記，看不出是哪篇論文、案例細節是什麼。

### 什麼時候轉向

第 48 頁說：轉向（pivot）通常比應該考慮的時間晚，因為沉沒成本謬誤。

投影片把決策改寫了一次。「繼續做目前的專案」對上「換一個新專案」，是個非常模糊的決定。但如果改成「繼續做目前的專案」對上「做專案 B」對上「做專案 C」，決定就直接得多，焦慮也少得多。所以建議是：**花時間想其他的研究專案。**

**怎麼做**：在你目前的專案筆記最上面，寫下兩個具體的備選題目，每個一句話說清楚「重要的問題」和「計畫」。下次卡關時，拿目前的專案跟這兩個比，而不是跟「放棄」比。

### 怎麼分享：沒人知道，就等於沒有產出

第 50 頁問：研究的產出是什麼？是想法、知識、學到的東西，幾乎從來都不是產品或服務。**如果沒有人知道你學到什麼，就等於沒有產出。** 投影片順便提到，連公司都有大量行銷投入。

它也回應了三個常見的心理障礙：

- 「感覺像在自我推銷」→ 你是在教別人、分享很酷的發現
- 「但它效果沒那麼好」→ 仍然很有用，別人可能因此想到新點子
- 「但現在我覺得都很顯然」→ 做了夠久的研究，你會比別人知道得多得多

第 51 頁講怎麼分享：清楚的寫作、圖和簡報；想清楚你的聽眾會怎麼理解你說的話；不確定時，假設聽眾知道得比較少；能避免術語就避免，很多人還是喜歡有人幫忙複習；練習、練習、練習，並找人給誠實的回饋。

第 52 頁談寫作卡關：把任務拆小，例如先在紙上寫幾個想法、再寫大綱。講者的建議是：**先把自己的想法想清楚，再去問你的朋友 ChatGPT。**

### 其他：指導與信心

第 54 頁：有指導者就別怕依靠他們，講者觀察到學生循序漸進地學習時表現最好。

第 55 頁談信心。缺乏信心的理由很多：沒人知道現在做研究的最好方法、沒人知道未來什麼研究最有影響、很多想法會失敗、很多論文會被拒、很多研究者已經在某個領域想了好幾年。那些人在那個領域會比你「聰明」，但沒有理由因此被嚇到。**信心真的很重要，自我懷疑和想太多會大幅拖慢你。**

第 56 頁是整門課的結語，講者感謝學生在一學期中的提問、對新課程元件的耐心，以及讓課程變得更好的回饋。

## 連回來：2026 期末專題列表怎麼讀

[2026 期末專題列表頁](https://cs224r.stanford.edu/projects/cs224r_final_projects.html)標題寫「Spring 2026 · 244 student projects」，每一列有類型（Custom 或 Default）、標題、作者和指導 TA，點標題可以開報告 PDF。我數了表格：Custom 155 份、Default 88 份，另有 1 份沒標類型。

得獎的有 4 份 Outstanding Project 和 9 份 Honorable Mention。首頁的評分說明寫到，傑出專題可以拿最多 2% 的額外加分。四份 Outstanding：

- A Semi-Decentralized Approach to Scalable Multiagent Control（Custom）
- EXPO-FT: Sample-Efficient Reinforcement Learning Finetuning for Vision-Language-Action Models（Custom）
- Hybrid Reinforcement Learning for Chip Macro Placement（Custom）
- SFT Augmentation and Replay-Based RL for Countdown Reasoning（Default）

Default 類的題目都建立在 [Default Project](/posts/ai/2026-09-30-cs224r-default-project-llm-rl) 的 Countdown 任務和 SFT → IPO → RLOO 流程上，88 份裡標題含「curriculum」的有 33 份、含「RLOO」的有 27 份（我用標題關鍵字數的，只是粗略分佈）。Custom 類則分散在機器人、VLA、多代理人、LLM 推理和各種應用領域。

要注意這份列表**只是報告集**：頁面上沒有評分細節、沒有 TA 評語，得獎標記之外看不出各份報告的分數。

它的用處是拿來對照 [Custom Project Guidelines](https://cs224r.stanford.edu/material/CS224R_Custom_Project_Guidelines.pdf) 的新穎性要求。規格寫的是至少符合一項：回答文獻裡還沒回答或只回答一部分的開放問題、在元件或演算法層級做有理由的非平凡修改（沒有全面變好也可以，但要分析失敗模式）、把方法用到尚未充分探索的應用領域且調整不平凡。規格也明講**不要求**達到機器學習會議的水準、也不要求 state-of-the-art，但無論結果好壞，都要提供關於一個想法為什麼成功或失敗的新見解。

這跟第 37–39 頁的選題三步驟是同一件事：重要的問題、可行的計畫、殘酷誠實的失敗分析。

## 延伸閱讀

- 系列裡跟七個前沿問題直接相關的篇：[L7 Offline RL](/posts/ai/2026-09-30-cs224r-offline-rl)、[L8 Reward Learning](/posts/ai/2026-09-30-cs224r-reward-learning)、[L9 RLHF 與偏好最佳化](/posts/ai/2026-09-30-cs224r-rlhf-dpo-preference-optimization)、[L11 Model-Based RL](/posts/ai/2026-09-30-cs224r-model-based-rl)、[L17 VLA 的 RL](/posts/ai/2026-09-30-cs224r-rl-for-vlas)
- [Berkeley CS285 的探索與開放問題導讀](/posts/learning/2026-08-22-berkeley-cs285-exploration-open-problems)，另一門 deep RL 課怎麼收尾
- [Berkeley CS285 的作業與專題路線](/posts/learning/2026-08-22-berkeley-cs285-homework-project-route)，對照兩門課的專題要求
- [CS336 RLVR](/posts/ai/2026-08-22-cs336-rlvr) 與 [CME295 RL with LLMs](/posts/ai/2026-09-29-cme295-rl-with-llms)，從 LLM 的角度看「可驗證獎勵」與「不可驗證領域」的分界

## 這一篇可以確認與不能確認的

可以確認：2026 投影片的文字、結構與引用標記，課表日期和期末專題截止日，2025 與 2026 投影片的差異，期末專題列表頁的份數、類型和得獎標記，Custom Project Guidelines 的新穎性要求，2025 影片的標題與長度。

不能確認：

- 2026 課堂上的口頭內容，包括每個開放問題講者有沒有給出自己的看法
- 只有圖片的頁面內容，例如第 35 頁 CASP 例子配的圖、第 41 頁「Bottlenecks」、第 47 頁「Shi et al. 2025」案例
- 第 18 頁「Dong et al., 2025」對應的論文是我依主題比對的，投影片沒有給完整書目
- 第 43 頁那篇影片生成論文是哪一篇，投影片沒寫標題

系列導覽：上一篇 [L17 VLA 的 RL](/posts/ai/2026-09-30-cs224r-rl-for-vlas)｜這是最後一篇｜[系列入口](/posts/ai/2026-09-30-cs224r-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入的影片屬於較早學期的公開錄影，不是 2026 當季課程，狀態改為相關補充影片。

## 參考資料

- [CS224R: Deep Reinforcement Learning（Spring 2026 課程官網與課表）](https://cs224r.stanford.edu/)
- [Lecture 18 投影片：Summary & frontier of deep RL + How to do (deep RL) research（2026）](https://cs224r.stanford.edu/slides/18_cs224r_frontiers_how_to_research_2026.pdf)
- [CS224R Final Projects（Spring 2026 期末專題列表）](https://cs224r.stanford.edu/projects/cs224r_final_projects.html)
- [CS224R Custom Project Guidelines（2026）](https://cs224r.stanford.edu/material/CS224R_Custom_Project_Guidelines.pdf)
- [Lecture 18 投影片（Spring 2025 封存版，對照用）](https://cs224r.stanford.edu/spring_2025/slides/18_cs224r_frontiers_how_to_research.pdf)
- [Spring 2025 Lecture 18: Frontiers（YouTube，補充）](https://www.youtube.com/watch?v=FacJ_1tTSx4)
- [Sharma et al. 2023：Towards Understanding Sycophancy in Language Models](https://arxiv.org/abs/2310.13548)
- [Ball et al. 2023：Efficient Online Reinforcement Learning with Offline Data](https://arxiv.org/abs/2302.02948)
- [Dong et al. 2025：What Matters for Batch Online Reinforcement Learning in Robotics?](https://arxiv.org/abs/2505.08078)
- [OpenAI 2023：GPT-4 Technical Report](https://arxiv.org/abs/2303.08774)
- [Tian et al. 2023：Just Ask for Calibration](https://arxiv.org/abs/2305.14975)
- [Luo et al. 2024：Precise and Dexterous Robotic Manipulation via Human-in-the-Loop Reinforcement Learning](https://arxiv.org/abs/2410.21845)
