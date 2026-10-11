---
title: "CS224R L9：RLHF、DPO 與偏好最佳化"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, ai-course, stanford, reinforcement-learning, rlhf, dpo, post-training]
lang: zh-TW
series:
  name: "Stanford CS224R 導讀"
  order: 12
tldr: "CS224R Spring 2026 第九講由 Archit Sharma 客座，投影片註明改寫自 CS224N。主線是一條推導鏈：instruction tuning 解決不了「沒有標準答案」和「錯誤輕重不同」，所以改成最大化人類偏好；人類評分太貴又不準，所以改用成對比較訓練 Bradley-Terry reward model；RLHF 拿它當獎勵、加 KL 懲罰做 policy gradient；DPO 則利用 KL 約束問題的封閉解，把 reward 寫成 policy 的對數比值，整件事變成一個二元分類損失。最後一段談前沿：reward hacking、可驗證獎勵，以及用 AI 回饋取代人類回饋。"
description: "Stanford CS224R（Spring 2026）第九講導讀：依官方 09_cs224r_rlhf_2026 投影片整理 LLM 訓練流程、instruction finetuning 的限制、REINFORCE 與 log-derivative trick、Bradley-Terry reward model、帶 KL 懲罰的 RLHF 目標、DPO 的推導，以及 reward hacking、可驗證獎勵與 Constitutional AI。附課表指定讀物 DPO（2023）與 IPO（2025）的說明，配套影片為 Spring 2025 L9（同一位講者，補充）。"
draft: false
glossary:
  - term: "Bradley-Terry 模型"
    aliases: ["Bradley-Terry", "BT model"]
    definition: "1952 年提出的成對比較模型：假設每個選項有一個分數，A 勝過 B 的機率是兩者分數差經過 sigmoid 的結果。"
    context: "CS224R L9 用它把人類的成對偏好轉成 reward model 的訓練損失：−log σ(RM(x, y_w) − RM(x, y_l))。"
  - term: "DPO"
    aliases: ["Direct Preference Optimization", "直接偏好最佳化"]
    definition: "Rafailov 等人 2023 年提出的偏好最佳化方法：不訓練獨立的 reward model，直接把 reward 寫成 policy 與參考模型的對數機率比，用成對偏好資料做二元分類。"
    context: "CS224R L9 從 RLHF 的 KL 約束目標推導出 DPO 損失。"
  - term: "reward hacking"
    aliases: ["獎勵駭客", "reward model over-optimization"]
    definition: "policy 找到能拿高分、但不符合設計者真正意圖的行為。學到的 reward model 越不準，越容易發生。"
    context: "CS224R L9 把它列為 RLHF 的核心風險，並以此引出可驗證獎勵。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs224r-rlhf-dpo-preference-optimization-en)

**影片狀態：僅附相關補充影片；原講次錄影未確認。** [影片來源與說明](#課程影片來源)

> **來源年份**：依據 Spring 2026 的 [09_cs224r_rlhf_2026 投影片](https://cs224r.stanford.edu/slides/09_cs224r_rlhf_2026.pdf)（課表日期 2026-04-29）。配套影片是 [Spring 2025 L9 錄影（補充）](https://www.youtube.com/watch?v=XKLGuwvSKvI)：[2025 封存頁](https://cs224r.stanford.edu/spring_2025/)列的講者同樣是 Archit Sharma，但投影片是 2025 版，細節可能不同。本文是 [Stanford CS224R 導讀](/posts/ai/2026-09-30-cs224r-course-overview)系列的第 12 篇。

[CS224R](https://cs224r.stanford.edu/) 的課表把這一講叫「RL for LLMs: Preference Optimization」，由客座講者 Archit Sharma 主講。投影片標題是「The Post-Training Frontier: RLHF, DPO and Modern Preference Optimization」，封面寫著「Based on slides from CS224N」，也就是改寫自 Stanford NLP 課的版本。

前面十一篇都在講機器人和控制，這一講突然跳到語言模型。先把兩邊對上，後面的推導會好讀很多。

## 課程影片來源

本文以 Spring 2026 教材為準；下列 Spring 2025 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=XKLGuwvSKvI
title: Spring 2025 Lecture 9: RL for LLMs（YouTube，補充）
```

原始影片：[Spring 2025 Lecture 9: RL for LLMs（YouTube，補充）](https://www.youtube.com/watch?v=XKLGuwvSKvI)

內容核對：已依字幕核對（2026-10-10）：抽樣讀取 Spring 2025 L9 RL for LLMs（偏好最佳化客座講） 的字幕（前／中／後段加關鍵字搜尋，非逐字比對），確認影片確實是這一講、講者為 Archit Sharma、主題與本文相符。講者為 Archit Sharma（頁面描述標示為 DPO 第一作者），與本文所述同一位講者相符；字幕談 reward model、Bradley-Terry、帶 KL 的 RLHF 目標與 DPO，與本文主題相符。本文敘述以 2026 投影片為準，影片只當補充。

課程與錄影入口：

- [官方課程／講次來源](https://cs224r.stanford.edu/)

Spring 2026 當季講次錄影放在需 Stanford 登入的 Canvas／Panopto；公開 YouTube 播放清單是 Spring 2025。 查核日期：2026-10-10。

## 先把 LLM 對到 RL 的語言

投影片沒有畫這張表，這是本系列為了銜接加上的對照。它用的是 [L1](/posts/ai/2026-09-30-cs224r-intro-mdps-behavior) 的定義：

| RL（L1 的定義） | LLM 後訓練 |
|---|---|
| state sₜ | prompt 加上目前已經生成的 token |
| action aₜ | 下一個 token |
| trajectory τ | 一整段回答 |
| policy πθ(a \| s) | 語言模型本身 pθ(y \| x) |
| reward r | 人類（或 reward model）對整段回答的評價 |

這一講的獎勵通常只在回答結束時給一次，所以投影片直接把整段回答 y 當成一個樣本，寫成 pθ(y | x)，不逐 token 拆開。

另一個要回扣的是 [L8 Reward Learning](/posts/ai/2026-09-30-cs224r-reward-learning)：那一講已經講過「從人類偏好學獎勵」（課表讀物是 Christiano 2017）。L9 把同一個想法搬到語言模型上。

## LLM 是怎麼訓練出來的

投影片把訓練流程分成四段：

1. **Pre-training**：用大量、主要來自網路的自然資料訓練
2. **Mid-training**：針對特定領域、資料量較小
3. **Supervised fine-tuning／instruction tuning**：小量、精選的資料，讓模型學會照人類意圖做事
4. **Reinforcement learning（from human feedback）**：對齊人類「隱含」的意圖

預訓練學到什麼？投影片用一串填空題示範：史丹佛大學位在哪裡（知識）、「I put ___ fork down」（語法）、指代、情緒判斷、簡單推理和算術。語言模型甚至可能粗略地模擬 agent 和信念（引用 Andreas 2022）。

問題是：從「Stanford University is located in ___」要怎麼走到一個能回答各種請求的助理？投影片把後訓練分成三部分，本文照同樣的順序走：instruction finetuning、針對人類偏好最佳化（DPO/RLHF）、一窺前沿的後訓練。

## 第一步：instruction finetuning，以及它的上限

語言模型的訓練目標是預測下一個字，這跟「幫使用者做事」不是同一件事（投影片引用 [InstructGPT](https://arxiv.org/abs/2203.02155)，Ouyang et al. 2022）。解法是收集大量（指令，輸出）配對，跨很多任務微調，再在沒看過的任務上評估。例子是 FLAN-T5（Chung et al. 2022）；資料規模很關鍵，SuperNaturalInstructions 有超過 1,600 個任務。評估則靠 MMLU、BIG-Bench 這類多任務 benchmark。

它的優點是簡單直接，而且能泛化到沒看過的任務。投影片接著問：還有什麼比較不明顯的限制？答案列了三個：

- **開放式生成沒有標準答案**：「寫一個小狗和她的寵物蚱蜢的故事」要怎麼給正解？
- **語言模型的損失對每個 token 的錯誤一視同仁**，但有些錯比別的錯嚴重得多
- **人類寫的示範本身也不一定最好**

所以結論是兩條：示範很難大規模收集；而且語言模型的目標和「滿足人類偏好」之間始終有落差。下一步就是直接去最佳化人類偏好。

## 第二步：把人類偏好寫成 RL 目標

假設對一個指令 x 和模型的輸出 y，有辦法拿到人類給的分數 R(x, y)，越高越好。投影片的例子是新聞摘要：同一則舊金山地震新聞，「地震襲擊舊金山，財產輕微損失，無人受傷」拿 8.0；「灣區天氣好但容易地震和野火」拿 1.2。目標就是最大化模型取樣結果的期望分數：

```text
max_θ  E_{ŷ ~ pθ(y | x)} [ R(x, ŷ) ]
```

**怎麼對這個期望值求梯度？** R 可能不可微分，期望值也沒辦法直接算。投影片在這裡快速複習了 [L3](/posts/ai/2026-09-30-cs224r-policy-gradients) 的 REINFORCE（Williams 1992）：用 log-derivative trick 把梯度搬到期望值裡面，再用 Monte Carlo 樣本估計。

<details>
<summary>展開：REINFORCE 的三行推導（投影片版本）</summary>

```text
∇θ E_{s~pθ}[R(s)] = Σ_s R(s) ∇θ pθ(s)
                  = Σ_s pθ(s) R(s) ∇θ log pθ(s)      # ∇p = p ∇log p
                  = E_{s~pθ}[ R(s) ∇θ log pθ(s) ]
                  ≈ (1/m) Σᵢ R(sᵢ) ∇θ log pθ(sᵢ)
```

</details>

投影片對這條式子的解讀很直白：R 大，就推高這個樣本的機率；R 小，就壓低它。這就是「強化」這個名字的由來。它也提醒這是「高度簡化」的版本，真正拿來訓練語言模型還需要很多東西。

## 獎勵從哪裡來：Bradley-Terry reward model

上面假設每個回答都有人打分數。投影片點出兩個問題，各自有一個解法：

**問題一：人類一直在迴圈裡太貴了。** 解法是把人類偏好本身當成一個要學的問題：用標註資料訓練一個 reward model RMφ(x, y) 來預測人類的分數，之後改最佳化 RMφ（引用 Knox & Stone 2009）。

**問題二：人類的評分有雜訊、而且尺度不一致。** 同一個「4.2 級地震造成嚴重損害」的摘要，該給 4.1 還是 6.6？解法是不要求直接打分，改問「兩個裡面哪個比較好」，成對比較比較可靠（引用 Phelps 2015、Clark 2018）。

有了成對比較，就用 Bradley-Terry（1952）模型訓練 reward model。它只要求「贏的樣本 y_w 分數要比輸的樣本 y_l 高」：

```text
J_RM(φ) = − E_{(x, y_w, y_l) ~ D} [ log σ( RMφ(x, y_w) − RMφ(x, y_l) ) ]
```

## RLHF：最佳化學到的獎勵，但別跑太遠

手上有一個預訓練（可能也做過 instruction tuning）的模型 p^PT，和一個 reward model。RLHF 的做法是複製一份模型 p^RL_θ，去最大化 RMφ 的期望值。

投影片問：這樣有什麼問題？學到的獎勵並不完美，直接最大化它，模型會去鑽 reward model 的漏洞。所以加一個懲罰，不讓模型離初始模型太遠：

```text
max_θ  E_{ŷ ~ p^RL_θ(y | x)} [ RMφ(x, ŷ) − β · log( p^RL_θ(ŷ | x) / p^PT(ŷ | x) ) ]
```

當新模型給某個回答的機率比原模型高，就要付代價。這一項在期望值下就是兩個分佈之間的 KL divergence。

效果上，投影片引用 [Stiennon et al. 2020](https://arxiv.org/abs/2009.01325) 的摘要實驗：RLHF 模型比預訓練模型和單純微調的模型都好。代價是很複雜：要擬合 value function、線上取樣很慢、對超參數很敏感（引用 Secrets of RLHF，Zheng et al. 2023）。這些正是 [L5](/posts/ai/2026-09-30-cs224r-off-policy-actor-critic-ppo-sac) 講 PPO 時碰到的麻煩。

## DPO：把 reward model 寫成 policy

投影片提出的問題是：能不能把 reward model 直接用 policy 表示？整個最佳化過程唯一的外部資訊就是偏好標籤，所以這件事有機會做到。

推導分三步。

**第一步，KL 約束問題有封閉解。** 上面那個帶 KL 懲罰的目標，最佳 policy 是：

```text
p*(ŷ | x) = (1 / Z(x)) · p^PT(ŷ | x) · exp( RM(x, ŷ) / β )
```

**第二步，反過來解 reward。** 移項之後：

```text
RM(x, ŷ) = β · log( p*(ŷ | x) / p^PT(ŷ | x) ) + β · log Z(x)
```

投影片強調這對任意語言模型都成立，所以可以把 p* 換成正在訓練的 p^RL_θ，得到一個「由 policy 定義的 reward」RMθ。

**第三步，Z(x) 在相減時消掉。** Bradley-Terry 損失只需要 y_w 和 y_l 的分數差，而 β log Z(x) 只跟 x 有關，兩邊相減就不見了：

```text
J_DPO(θ) = − E [ log σ( β log( p^RL_θ(y_w|x) / p^PT(y_w|x) )
                       − β log( p^RL_θ(y_l|x) / p^PT(y_l|x) ) ) ]
```

投影片的結語是：這是一個簡單的分類損失，直接把偏好資料和語言模型參數連起來。論文是 [Rafailov et al. 2023, Direct Preference Optimization](https://arxiv.org/abs/2305.18290)，也是這一講課表上的第一篇讀物。

## 兩條路的對照

投影片用一張摘要頁收尾這一段：

| | RLHF | DPO |
|---|---|---|
| 做法 | 在比較資料上訓練顯式 reward model，再在 KL 約束下最大化它的分數 | 直接在偏好資料上解一個二元分類問題，更新模型參數 |
| 優點 | 調得好時非常有效 | 簡單有效，性質和 RLHF 相近 |
| 缺點 | 計算昂貴、很難做對 | 不利用線上資料 |

「不利用線上資料」這一點值得記住：DPO 只從固定的偏好資料集學，是一種 offline 方法。這跟 [L7 offline RL](/posts/ai/2026-09-30-cs224r-offline-rl) 的處境類似：資料不是目前 policy 產生的。

實際案例方面，投影片列了 InstructGPT（投影片標出 30k 個任務，另一頁列出標註員收集的任務類型）、ChatGPT（先 instruction finetuning、再 RLHF），並寫著 DPO 讓開源模型也能持續進步。RLHF/DPO 帶來的一個明顯變化是風格：回答更詳細、更常用清單格式（引用 Dubois et al. 2023）。

## 前沿：獎勵本身就不可靠

最後一段「Peeking into frontier post-training」談的是還沒解決的問題：

- **reward hacking 在 RL 裡很常見**，而人類偏好本身就不可靠，學出來的偏好模型更不可靠。投影片引用 Stiennon 2020 的 reward model over-optimization 圖：對 RMφ 最佳化過頭，真實品質反而下降。
- **改用可驗證的獎勵**：數學、程式和科學問題有可以驗證的答案，不容易被鑽漏洞。投影片說這條路催生了 reasoning model，下一講會講；同時也提醒：不是所有東西都能變得可驗證。
- **模型行為很難精確控制**：偏好訓練會讓模型過度使用 emoji、變得過度奉承（sycophantic）。我們想要更精確地控制禮貌程度、何時拒答等行為，但很難同時平衡多個 reward function。
- **讓 AI 給自己獎勵**：投影片的最後一個例子是 [Constitutional AI](https://arxiv.org/abs/2212.08073)（Bai et al. 2022）。模型先給出有害的回答（教人入侵鄰居 Wi-Fi），再依要求自我批評、自我修改成拒絕並說明風險的版本。

## 課表上的第二篇讀物：IPO（2025）

課表在這一講列了兩篇讀物，第二篇是 [Garg et al. 2025, IPO: Your Language Model is Secretly a Preference Classifier](https://arxiv.org/abs/2502.16182)。投影片沒有講它。依論文摘要，這裡的 IPO 是 **Implicit Preference Optimization**：把生成式語言模型本身當偏好分類器來產生偏好，減少對人類標註或外部 reward model 的依賴。

要注意撞名。[Default Project](/posts/ai/2026-09-30-cs224r-default-project-llm-rl) 規格裡要你實作的 IPO，引用的是另一篇：[Gheshlaghi Azar et al. 2023, A General Theoretical Paradigm to Understand Learning from Human Preferences](https://arxiv.org/abs/2310.12036)，那是一個放鬆 Bradley-Terry 假設、用平方損失取代 log-sigmoid 的偏好目標。兩者縮寫相同、內容不同，讀規格時別混在一起。

## 今晚可以做的事

拿一個你手邊的偏好資料集（或自己寫五組「同一個 prompt、一好一壞」的回答），寫下 DPO 損失需要的四個數字：

```text
log p_θ(y_w | x)     log p_ref(y_w | x)
log p_θ(y_l | x)     log p_ref(y_l | x)
```

用任何一個小模型算出來，代入 DPO 公式。模型還沒訓練時 p_θ = p_ref，損失會是多少？（答案是 log 2，因為括號裡是 0。）這個起點值在你實作 Default Project 時可以當成 sanity check。

## 延伸閱讀

- [CS336：SFT 與 RLHF](/posts/ai/2026-08-22-cs336-sft-rlhf)：從語言模型訓練流程的角度看同一套方法
- [CME295：偏好調整](/posts/ai/2026-09-29-cme295-preference-tuning)：另一門 Stanford 課對 RLHF 與 DPO 的講法
- [CS224N 導讀](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning)：這一講投影片的來源課

**系列導覽**：上一篇 [HW3：用 AWAC 和 IQL 做 offline RL](/posts/ai/2026-09-30-cs224r-hw3-offline-rl-awac-iql)｜下一篇 [L10：LLM 推理的 RL 與 test-time compute](/posts/ai/2026-09-30-cs224r-rl-llm-reasoning)｜[系列總覽](/posts/ai/2026-09-30-cs224r-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入的影片屬於較早學期的公開錄影，不是 2026 當季課程，狀態改為相關補充影片。
- 2026-10-10：依字幕核對影片內容。講者與主題皆與本文說法相符，沒有需修正之處。

## 參考資料

- [CS224R 課程首頁與課表（Spring 2026）](https://cs224r.stanford.edu/)
- [Lecture 9 投影片：The Post-Training Frontier: RLHF, DPO and Modern Preference Optimization（2026）](https://cs224r.stanford.edu/slides/09_cs224r_rlhf_2026.pdf)
- [CS224R Spring 2025 封存頁](https://cs224r.stanford.edu/spring_2025/)
- [Spring 2025 Lecture 9: RL for LLMs（YouTube，補充）](https://www.youtube.com/watch?v=XKLGuwvSKvI)
- [Rafailov et al. 2023, Direct Preference Optimization: Your Language Model is Secretly a Reward Model](https://arxiv.org/abs/2305.18290)
- [Garg et al. 2025, IPO: Your Language Model is Secretly a Preference Classifier](https://arxiv.org/abs/2502.16182)
- [Gheshlaghi Azar et al. 2023, A General Theoretical Paradigm to Understand Learning from Human Preferences](https://arxiv.org/abs/2310.12036)
- [Ouyang et al. 2022, Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155)
- [Stiennon et al. 2020, Learning to summarize from human feedback](https://arxiv.org/abs/2009.01325)
- [Bai et al. 2022, Constitutional AI: Harmlessness from AI Feedback](https://arxiv.org/abs/2212.08073)
