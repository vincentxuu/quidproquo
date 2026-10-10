---
title: "政大蔡炎龍 生成式AI L13：強化學習——從 AlphaGo 到讓 LLM「不要那麼唬爛」的 RLHF"
date: 2026-09-30
category: ai
type: guide
tags: [nccu-generative-ai, generative-ai, ai-course, reinforcement-learning, q-learning, policy-gradient, rlhf]
lang: zh-TW
series:
  name: "政大蔡炎龍 生成式AI 導讀"
  order: 13
tldr: "前 12 講的模型都靠人準備好的訓練資料。L13 換一個問題：沒有標準答案，只知道做得好不好的時候，電腦要怎麼學？老師從 AlphaGo 和打磚塊講起，分成兩條路：value based 學一個 Q 函數替每個動作打分數（Deep Q-Learning、TD、Experience Replay、ε-greedy），policy based 直接學動作（Policy Gradient、Actor-Critic）。後半回到 LLM：ChatGPT 怎麼用人類排名訓練 reward model，再用 PPO 做 RLHF；DeepSeek 則讓電腦自動判斷數學題對錯當獎勵。第十三週作業是期末專案提案。"
description: "政大蔡炎龍「生成式 AI：文字與圖像生成的原理與實務」1132 學期第 13 講導讀：強化學習的 agent／state／action／reward、AlphaGo 發展里程、policy based 與 value based、Deep Q-Learning 的訓練資料（Monte-Carlo 與 Temporal-Difference）、Experience Replay 與 ε-greedy、Policy Gradient 與 Actor-Critic、RLHF 三步驟與 reward model 的 loss、DeepSeek 的自動獎勵，以及長庚衛星班版第十三週期末提案作業。"
draft: false
glossary:
  - term: "experience replay"
    aliases: ["經驗回放"]
    definition: "讓電腦一邊玩、一邊把每一步的 (狀態, 動作, 獎勵, 下一個狀態) 存起來，之後再從這堆經驗裡抽樣出來當訓練資料更新 Q 函數。"
    context: "L13 用它說明 Deep Q-Learning 的訓練資料怎麼來：玩一步就有一筆。"
    links:
      - label: "Mnih et al. 2015（Nature）"
        url: "https://www.nature.com/articles/nature14236"
  - term: "ε-greedy"
    aliases: ["epsilon-greedy", "ε-Greedy Policy"]
    definition: "每次要做動作時抽一個 0 到 1 之間的亂數：大於 ε 就照目前的 Q 函數選最高分的動作，小於等於 ε 就亂選。一開始 ε 設大一點，讓電腦多探索。"
    context: "L13 用它解決「Q 函數一開始還很爛，電腦要照什麼規則玩」的問題。"
---

> 🌏 [English version](/posts/ai/2026-09-30-nccu-genai-13-reinforcement-learning-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

**本文依據政大蔡炎龍「生成式 AI：文字與圖像生成的原理與實務」2025 春季（政大學期代碼 1132）版。** 這是[政大蔡炎龍 生成式AI 導讀](/posts/ai/2026-09-30-nccu-genai-course-overview)系列第 13 篇，接續 [L12 ControlNet 與 Fooocus](/posts/ai/2026-09-30-nccu-genai-12-controlnet-fooocus)。

用到的官方材料有三份：[第 13 講錄影](https://www.youtube.com/watch?v=xG8ccKlW_Cc)（2025-05-13，3 小時 3 分）、投影片 [GenAI12 強化學習與生成式 AI 綜合應用](https://drive.google.com/file/d/1uPDkwB4uu183yKczp0lcxyIcQC08XdaR/view)（73 頁），以及[長庚衛星班課程頁](https://yangchihyuan.github.io/courses/GenerativeAI2025)上的第十三週作業說明。注意投影片檔名的編號是 12，但它是第 13 講的講義，投影片頁尾也寫「13 強化學習與生成式 AI 綜合應用」。存取等級是 **A3**：錄影、投影片、作業說明都公開；這一講沒有對應的 Demo notebook。

## 課程影片來源

影片來源已對照官方課程頁，並於 2026-10-10 即時查核：講次與影片一致，YouTube 公開且可嵌入（2026-10-10 播放器回應 playableInEmbed 為 true）。影片沒有可取得的字幕，本篇引用的錄影章節時間與主題都是影片說明欄的標示，只對照說明欄、沒有逐段聽過內容，因此不加「已依字幕核對」標記。不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=xG8ccKlW_Cc
title: 【生成式 AI】13. 強化學習與生成式 AI 綜合應用（YouTube 錄影，2025-05-13）
```

原始影片：[【生成式 AI】13. 強化學習與生成式 AI 綜合應用（YouTube 錄影，2025-05-13）](https://www.youtube.com/watch?v=xG8ccKlW_Cc)

課程與錄影入口：

- [官方課程與錄影入口](https://yangchihyuan.github.io/courses/GenerativeAI2025)

查核日期：2026-10-10。

## 本週在課程中的位置

這門課一路用「函數學習機」的角度看 AI：想清楚輸入和輸出，準備好訓練資料，剩下交給神經網路。L13 碰到的情況是，**我們根本不知道正確答案**。打磚塊的每一刻該往左還是往右？圍棋這一手該下哪裡？沒有人能標出來。我們只知道最後的結果好不好。

強化學習就是為這種情況設計的。這一講在弧線上有兩個任務：一是補完「不靠標註也能學」的第三種學習方式，二是回答 L04、L06 留下來的問題：只會猜下一個字的 LLM，為什麼後來變得比較聽話、比較不唬爛？答案是 RLHF。

投影片分三部分：強化學習（第 2–41 頁）、讓唬爛王不要那麼唬爛（第 42–53 頁）、生成式 AI 的應用（第 54 頁起）。第三部分的內容跟 L14 投影片最後一節幾乎相同，集中在 [L14](/posts/ai/2026-09-30-nccu-genai-14-new-trends) 講。

## 強化學習：打造 AlphaGo 的神奇魔法

### 兩個出名的例子

第一個是 DeepMind 2015 年登上 Nature 的論文 [Human-level control through deep reinforcement learning](https://www.nature.com/articles/nature14236)，基本上就是教電腦玩 Atari 遊戲，用的方法是 Deep Q-Learning。

第二個是 AlphaGo。老師放了一張 2017 年台灣人工智慧年會的照片，講者是 AlphaGo 創始人之一**黃士傑博士**，投影片提到他博士班時期開發的 Erica 拿過電腦圍棋世界冠軍。第 7 頁把 AlphaGo 的發展排成一條時間線：

| 時間 | 版本 | 投影片的說明 |
|---|---|---|
| 2016.3 | AlphaGo Lee | 4:1 擊敗世界棋王李世乭 |
| 2016.12.29–2017.1.4 | AlphaGo Master | 神秘高手網路 60 連勝 |
| 2017.5 | 中國烏鎮圍棋會 | 與柯潔對弈，人工智慧與人的合作 |
| 2017.10 | AlphaGo Zero | 完全自學的人工智慧，擊敗之前版本 |

### 強化學習在做什麼

第 8 頁的圖是整講的骨架。Agent（電腦）看到環境的**狀態** Sₜ，決定做一個**動作** aₜ，環境回給它一個**獎勵** rₜ，然後進到下一個狀態。**目標就是拿到最多的獎勵。**

老師接著回到全課的口頭禪：要打造的「呆萌型 AI 機器人」，就是一個函數學習機 f_θ，只要知道輸入是什麼、輸出長什麼樣子。那強化學習要學的是哪個函數？以打磚塊為例，主要有兩種想法：**policy based** 和 **value based**。

### Policy based：直接學「該做什麼動作」

最自然的選擇是學一個 **policy function** π：輸入目前的遊戲畫面 Sₜ，輸出往左、往右或不動。

問題是前面說過，這個函數很難準備訓練資料。每一個畫面該往哪邊移，沒有人知道標準答案。

### Value based：替每個動作打分數

另一條路是學一個 **value function** Q：輸入狀態加上一個動作，輸出一個分數（通常是估計之後能拿到多少 reward）。

如果 Q 真的學成了，最好的動作也就知道了：把所有動作都丟進 Q，看哪個分數最高。

<details>
<summary>用式子寫 value based 的決策</summary>

π(S) = argmax_{a∈𝒜} Q_θ(S, a)

𝒜 是所有可能動作的集合（打磚塊裡就是左、右、停）。深度強化學習最常見的 **Deep Q-Learning**，就是用神經網路把 Q 函數學起來。

</details>

## Deep Q-Learning：訓練資料從哪裡來？

換成 Q 函數，問題還是一樣：訓練資料怎麼來？老師的回答是：**讓電腦自己去玩。**一開始會玩得很差，Q 值也可能很沒用，但玩的過程中，部分情況的 Q 值是算得出來的。把這些算得出來的 Q 值當訓練資料，再用深度學習把完整的 Q 函數學起來。投影片還開玩笑說，這樣「自己的訓練資料自己學」，應該叫 self-supervised learning。

### 兩種算 Q 值的方法

**蒙地卡羅（Monte-Carlo，MC）法**：把從現在到遊戲結束拿到的獎勵全部加起來。通常還會乘上一個 discount γ，讓越遠的未來權重越小，一來級數比較會收斂，二來未來本來就比較不確定。缺點是要等完整玩完一次（一個 episode）才算得出來。

**時序差分（Temporal-Difference，TD）法**：有沒有可能玩一步就有一筆訓練資料？認真想想，這一步的 Q 值，基本上就是立即拿到的 rₜ，加上下一步的 Q 值（假設之後都用最佳的方式玩）。所以只要記下 (Sₜ, aₜ, rₜ, Sₜ₊₁) 這一小段，就能更新 Q 值。

<details>
<summary>MC 與 TD 的式子</summary>

MC：Q(Sₜ, aₜ) = rₜ + γ·rₜ₊₁ + ⋯ + γ^(T−t)·r_T

TD：Q(Sₜ, aₜ) = rₜ + γ · max_{a∈𝒜} Q(Sₜ₊₁, a)

γ 是自己設定的 discount，通常介於 0 和 1 之間。

</details>

### Experience Replay：自己學自己

TD 法帶來 **Experience Replay**：讓電腦一直玩，每一步都收集 (Sₜ, aₜ, rₜ, Sₜ₊₁)，存起來當訓練資料。

仔細想想，這是一個「自己學自己」的過程。投影片把上一次的參數叫 θ⁻（舊版），正在更新的叫 θ（新版）。每一筆經驗 (Sₜ, aₜ, rₜ, Sₜ₊₁)，用舊版 Q 算出 rₜ + γ·max Q_θ⁻(Sₜ₊₁, a) 當作 (Sₜ, aₜ) 的目標值，再拿去對新版 Q_θ 做 gradient descent。

### Greedy 與 ε-greedy

Q 函數學成之後，完全照 Q 選最高分的動作，叫 **greedy policy**。

但訓練時還有一個問題：一開始電腦要照什麼規則玩？照目前的 Q 選最高分當然可以，可是這時的 Q 函數還爛得不得了。解法是 **ε-greedy**：每次要做動作時抽一個 0 到 1 的亂數 r，r > ε 就照 Q 函數決定，r ≤ ε 就亂亂玩。一開始 ε 設大一點。

Q-Learning 還有一個缺點：動作選擇如果有無限多個（例如連續的動作），就很難做。投影片特別註明：Q 函數本身還是能訓練，難在拿它來選最佳動作。

## Policy Gradient：我們真的不能直接學 policy 嗎？

回到一開始的 policy function。我們不知道任何情況的正確答案，但就是想學這個函數。「糟糕，好熟悉的句子。」老師的轉折是：我們的目標其實很清楚，就是要最大化 reward，那能不能把這個目標直接放進目標函數？

這就是 **Policy Gradient**：設計一個跟 π 有關的目標函數 J(θ)，最大化它。最直接的定義是 π 的 state value，但這個值不會算。

替代做法是：拿一段實際玩過的過程（trajectory）τ，算出這段過程的總得分 R(τ)。總得分本身跟 π 無關，所以要換個想法：如果神經網路做的動作跟這段過程一樣，就會得這麼多分，那麼得分越高的過程，就要學得越像。

<details>
<summary>Policy Gradient 與 Actor-Critic 的 loss</summary>

τ = {S₁, a₁, r₁, S₂, a₂, r₂, …, S_T, a_T, r_T}，R(τ) = Σₜ rₜ

Policy Gradient 對每條 trajectory 最小化：

R(τ) · Σₜ −log π_θ(aₜ | Sₜ)

最後把好幾條實際的 trajectory 加總。計分也可以更細膩，甚至另外訓練一個 value function 取代 R(τ)，這就是 **Actor-Critic**：

Σₜ −Q_θ′(Sₜ, aₜ) · log π_θ(aₜ | Sₜ)

</details>

第 41 頁總結：不管是 Deep Q-Learning 還是 Policy Gradient，都是在沒有人為準備訓練資料的情況下，讓電腦自己去學。**不知道答案，我們也可以學。**

## 讓唬爛王不要那麼唬爛：RLHF

第二部分回到 LLM。生成模式很有趣，但久了之後大家發現，只會唬爛的模型還真的沒什麼用。怎麼「導正」這個唬爛王？投影片把 ChatGPT 的做法拆成三步：

**Step 1. 手把手教你。**由真人回答問題，當作範例，拿去 fine-tune GPT。但對話的可能性這麼多，再多真人範例也不夠。

**Step 2. 打造評分系統（reward function）。**讓 ChatGPT 對同一個問題生出好幾個答案（唬爛 A、B、C），由人類排名，例如 A > B = C。用這些排名訓練一個評分模型 r_φ：輸入問題 x 和答案 y，輸出分數。

<details>
<summary>reward model 的 loss</summary>

假設對問題 x，ChatGPT 說了 y_w 和 y_ℓ 兩個答案，人類標記 y_w 比較好：

ℓ(φ) = −log( σ( r_φ(x, y_w) − r_φ(x, y_ℓ) ) )

y_w 要比較高分、y_ℓ 要比較低分。方向對了，sigmoid 值會趨近 1，取 log 就會接近 0。

</details>

**Step 3. 用強化學習。**讓 ChatGPT 想辦法從 r_φ 那裡拿高分。這種由人類回饋來做強化學習的方法，就叫 **RLHF**（Reinforcement Learning from Human Feedback），常用 **PPO**（Proximal Policy Optimization）來訓練。這個三步驟流程出自 OpenAI 的 [InstructGPT 論文](https://arxiv.org/abs/2203.02155)；PPO 本身見 [Schulman et al. 2017](https://arxiv.org/abs/1707.06347)。

### DeepSeek：不想學 r_φ 可以嗎？

投影片最後舉 DeepSeek 的例子。DeepSeek 專注在產生好的 thoughts（`<think>` 裡面那段思考），而不是直接回應。這時候還是可以用 RLHF，但要等很多人類回應，才知道生出來的東西好不好。

那能不能不學 r_φ？可以：如果題目是數學題，答案對不對可以**自動判斷**。答對 r = 1，答錯 r = −1，直接拿來當獎勵做強化學習。

投影片到這裡為止，沒有展開 DeepSeek 用的具體演算法。想看這條「可驗證獎勵」路線怎麼做，見延伸閱讀的 CS336 RLVR。

## 作業拆解：第十三週（長庚衛星班版本）

這週的作業是**期末專案提案**，依[長庚衛星班課程頁](https://yangchihyuan.github.io/courses/GenerativeAI2025)整理，繳交期限是 2025-05-26：

- 目的：幫同學提早發想期末專案，也讓助教有機會提早引導
- 寫下你預期的期末專案樣子；已經動工的，可以附連結或截圖
- 助教認為題目需要調整的，會在評論區回覆

評分標準：0 分是沒交，2 分是應付了事，7–10 分依「說明專案預期想呈現的」完整程度給分，越能完整表達想法分數越高。

期末專案本身的規則（Gather Town 線上研討會）見 [L14](/posts/ai/2026-09-30-nccu-genai-14-new-trends)。自學的話，可以把前 12 講做過的東西（對話機器人、RAG、Agent、生圖 Web App）挑一兩個組合起來，寫成一頁提案：要解決誰的什麼問題、用哪幾講的技術、Demo 長什麼樣子。

## 自學檢查點

1. 強化學習裡的 state、action、reward 在打磚塊遊戲中分別是什麼？
2. 為什麼 policy based 的想法「很自然」，卻很難直接用監督式學習訓練？
3. MC 法和 TD 法算 Q 值，最大的差別是什麼？
4. ε-greedy 為什麼一開始要把 ε 設大一點？
5. RLHF 的 Step 2 為什麼讓人類「排名」答案，而不是直接寫出標準答案？

<details>
<summary>參考答案</summary>

1. state 是目前的遊戲畫面，action 是往左、往右或不動，reward 是打掉磚塊得到的分數。
2. 因為每個畫面下「正確動作」是什麼，沒有人能標出來，準備不了訓練資料。
3. MC 要等整個 episode 結束，把後面所有獎勵加起來；TD 只要知道這一步的獎勵和下一個狀態，玩一步就能更新。
4. 一開始 Q 函數還很爛，完全照它玩會一直重複爛決策；多亂玩一點，才能探索到更好的動作。
5. Step 1 已經顯示真人範例永遠不夠；比較兩個答案哪個好，比從頭寫出好答案容易得多，也能大量收集。

</details>

## 延伸閱讀

本篇自己講完整，想往下挖再看這些：

- Policy Gradient、Actor-Critic、DQN 的完整推導：[Berkeley CS285 L5–10：Policy Gradient、Actor-Critic、DQN 與 SAC](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods)
- RLHF 與 DPO：[CME295 第 5 講：RLHF 與 DPO](/posts/ai/2026-09-29-cme295-preference-tuning)、[清大高宏宇 NLP 導讀：GPT-3、InstructGPT 與 RLHF](/posts/ai/2026-09-30-nthu-nlp-gpt3-instructgpt-rlhf)
- DeepSeek 那條可驗證獎勵路線：[CS336 Lecture 16：RLVR](/posts/ai/2026-08-22-cs336-rlvr)

系列導覽：[系列總覽](/posts/ai/2026-09-30-nccu-genai-course-overview)｜上一篇 [L12 ControlNet 與 Fooocus](/posts/ai/2026-09-30-nccu-genai-12-controlnet-fooocus)｜下一篇 [L14 生成式 AI 新趨勢與期末專案](/posts/ai/2026-09-30-nccu-genai-14-new-trends)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。對照官方課程頁與 YouTube，講次與嵌入影片一致、可公開嵌入，狀態改為已附影片。
- 2026-10-10：核對影片內容。影片無字幕可用，只對照說明欄章節；確認播放器回應為可嵌入。

## 參考資料

- [長庚衛星班課程頁：生成式AI：文字與圖像生成的原理與實務 2025（課表、第十三週作業與評分標準）](https://yangchihyuan.github.io/courses/GenerativeAI2025)
- [【生成式 AI】13. 強化學習與生成式 AI 綜合應用（YouTube 錄影，2025-05-13）](https://www.youtube.com/watch?v=xG8ccKlW_Cc)
- [1132 生成式 AI 錄影播放清單](https://www.youtube.com/playlist?list=PL-eaXJVCzwbukEFU2k5vu_BlUqgVLsEnv)
- [GenAI12 強化學習與生成式 AI 綜合應用投影片（Google Drive，第 13 講講義）](https://drive.google.com/file/d/1uPDkwB4uu183yKczp0lcxyIcQC08XdaR/view)
- [1132 投影片資料夾入口（yenlung.me/1132GenAI）](https://yenlung.me/1132GenAI)
- [Mnih et al. 2015：Human-level control through deep reinforcement learning（Nature）](https://www.nature.com/articles/nature14236)
- [Silver et al. 2017：Mastering the game of Go without human knowledge（AlphaGo Zero，Nature）](https://www.nature.com/articles/nature24270)
- [Ouyang et al. 2022：Training language models to follow instructions with human feedback（InstructGPT）](https://arxiv.org/abs/2203.02155)
- [Schulman et al. 2017：Proximal Policy Optimization Algorithms](https://arxiv.org/abs/1707.06347)
