---
title: "CS224R L10：LLM 推理的 RL 與 test-time compute"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, ai-course, stanford, reinforcement-learning, reasoning, grpo, test-time-compute]
lang: zh-TW
series:
  name: "Stanford CS224R 導讀"
  order: 13
tldr: "CS224R Spring 2026 第十講由 OpenAI 的 Noam Brown 客座，論點只有一條：reasoning model 替 scaling 開了新的維度，把算力從訓練推到推論。他從自己做撲克 AI 的經驗講起，再用西洋雙陸棋、西洋棋和圍棋說明「推論時多想一下」一直都有用；接著談 LLM 怎麼做到這件事：chain of thought、多數決、o1/o3、GRPO 和 DeepSeek-R1-Zero。後半段主張整個領域要為大規模 test-time compute 重新思考：multi-agent、以分數對算力作圖的評估方式、安全評估的預算假設。投影片以圖為主，本文只寫投影片上看得到的論點。"
description: "Stanford CS224R（Spring 2026）第十講導讀：依官方 10_cs224r_rl_for_llms_reasoning_2026 投影片（Noam Brown 客座）整理推論期搜尋在撲克、雙陸棋、西洋棋與圍棋的歷史，chain of thought 與多數決的極限，o1 到 o3、GRPO 與 DeepSeek-R1-Zero，以及 test-time compute 對 multi-agent、評估與安全評估的影響。Spring 2025 L10 講者不同，只當背景。"
draft: false
glossary:
  - term: "test-time compute"
    aliases: ["推論期算力", "inference compute", "test-time scaling"]
    definition: "模型在回答時投入的計算量，例如生成更長的推理過程、取樣多個答案再投票，或搜尋多條路徑。"
    context: "CS224R L10 的主張是 reasoning model 讓 test-time compute 成為和訓練算力並列的 scaling 維度。"
  - term: "GRPO"
    aliases: ["Group Relative Policy Optimization"]
    definition: "一種 LLM 的 policy gradient 方法：對同一個 prompt 取樣一組回答，用組內的相對獎勵當 advantage，不需要另外學 value model（critic）。"
    context: "CS224R L10 的投影片用它解釋 DeepSeek-R1-Zero 的訓練方式。"
  - term: "多數決"
    aliases: ["majority vote", "consensus", "self-consistency"]
    definition: "同一題取樣多個解答，取出現次數最多的答案。"
    context: "CS224R L10 用 Minerva 的例子說明它有效，但樣本數到 100 以前就停止進步。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs224r-rl-llm-reasoning-en)

**影片狀態：僅附相關補充影片；原講次錄影未確認。** [影片來源與說明](#課程影片來源)

> **來源年份**：依據 Spring 2026 的 [10_cs224r_rl_for_llms_reasoning_2026 投影片](https://cs224r.stanford.edu/slides/10_cs224r_rl_for_llms_reasoning_2026.pdf)（課表日期 2026-05-01）。[Spring 2025 L10 錄影](https://www.youtube.com/watch?v=O2VpNnwB4lM)的講者是 Aviral Kumar（見 [2025 封存頁](https://cs224r.stanford.edu/spring_2025/)），和 2026 **講者不同**，內容不能對等引用，只能當背景。本文是 [Stanford CS224R 導讀](/posts/ai/2026-09-30-cs224r-course-overview)系列的第 13 篇。

> **這篇的寫法限制**：這份投影片 42 頁，大多是圖表和截圖，能抽出的文字不到一千字。客座演講是觀點式的，講者在台上補充了什麼，投影片上看不到。本文只整理投影片標題、條列和圖上標出的數字，不替講者補寫論證。課表上這一講也沒有列指定讀物。

[CS224R](https://cs224r.stanford.edu/) 課表把這一講叫「RL for LLMs: Reasoning」，客座講者是 Noam Brown，投影片封面標示他的單位是 OpenAI。[上一講](/posts/ai/2026-09-30-cs224r-rlhf-dpo-preference-optimization)結尾提到：學到的 reward model 不可靠，改用數學、程式這類可驗證的獎勵，就走到了 reasoning model。這一講從那裡接著講，切入點是「算力該花在哪裡」，演算法放到後面才談。

## 課程影片來源

本文以 Spring 2026 教材為準；下列 Spring 2025 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=O2VpNnwB4lM
title: Spring 2025 Lecture 10: RL for LLM Reasoning（YouTube，講者不同，僅供背景）
```

原始影片：[Spring 2025 Lecture 10: RL for LLM Reasoning（YouTube，講者不同，僅供背景）](https://www.youtube.com/watch?v=O2VpNnwB4lM)

課程與錄影入口：

- [官方課程／講次來源](https://cs224r.stanford.edu/)

Spring 2026 當季講次錄影放在需 Stanford 登入的 Canvas／Panopto；公開 YouTube 播放清單是 Spring 2025。 查核日期：2026-10-10。

## 主線：scaling 多了一個維度

投影片前四頁就把論點擺出來：

- 2019 年到現在的 AI 進展，主要來自擴大資料和算力。圖上是 GPT-2 到 GPT-4 回答同一個行程安排問題，從答非所問到答對。
- 但 scaling 就夠了嗎？下一頁是 ChatGPT 下井字遊戲的截圖：對手底排已經有兩個 X，它卻把 O 下在右上角，沒擋住。
- **Reasoning model 是新的 scaling 維度。** 訓練成本增長很快，推論成本卻還很低，不帶推理的 ChatGPT 查詢一次不到一美分。reasoning model 擴大的是推論，不只是訓練。旁邊的圖是 o1 在 AIME 上的準確率，隨 test-time compute（對數尺度）上升。

後面的內容可以分成三段：為什麼相信推論期算力有用（遊戲 AI 的歷史）、LLM 怎麼用上它、它對整個領域意味著什麼。

## 證據一：撲克

講者用自己的經歷開場。

**年度電腦撲克競賽**：各實驗室每年帶撲克 bot 互相對打，投影片說後來變成一場比誰模型大的競賽，圖上是參數量逐年上升。

**2015 Brains vs. AI**：CMU 找四位頂尖職業玩家打 80,000 手，獎金 12 萬美元。他們的 bot Claudico 以每百手輸 9.1 個大盲（9.1 bb/100）落敗。

**規劃的重要性**：接著一張圖來自 [Brown & Sandholm 的 Safe and Nested Subgame Solving](https://arxiv.org/abs/1705.02955)（NeurIPS 2017 最佳論文）。在中型撲克遊戲裡，橫軸是模型大小（buckets），縱軸是離 Nash 均衡的距離。加上搜尋的那條線，整條都遠低於不搜尋的線。

**2017 Brains vs. AI**：Libratus 對四位職業玩家打 120,000 手，獎金 20 萬美元，以 15 bb/100 獲勝，p 值約 0.0002，每位玩家個別都輸。

投影片沒有把這個故事的結論寫成一句話，但圖本身在講：同樣的模型，推論時做搜尋，效果差很多。

## 證據二：雙陸棋、西洋棋、圍棋

接下來三頁是同一個論點在其他遊戲的版本：

| 遊戲 | 投影片上的重點 |
|---|---|
| 西洋雙陸棋（Tesauro 1994） | 1994 年達到人類大師水準，是第一個重大的神經網路遊戲成功案例；強度來自 value learning 加上淺層搜尋（2–3 層前瞻）。結論：「早期的神經網路遊戲系統就已經在推論時花算力。」 |
| 西洋棋（Campbell et al. 2002） | Deep Blue 1997 年擊敗 Kasparov；關鍵是大規模 alpha-beta 剪枝，每一步花好幾分鐘計算。結論：「更強的棋力來自推論時搜尋得更深。」 |
| 圍棋（Silver et al. 2017） | 完整的 AlphaGo Zero 是超人水準；拿掉 test-time search 的原始 policy 網路，Elo 只有約 3000。Elo 要提高 120，模型大小和訓練要大約翻倍，或是 test-time search 翻倍。要讓原始 policy 從 3000 Elo 升到 5200，模型得擴大約 10 萬倍。 |

圍棋這頁的數字最能說明問題：用訓練去換推論期搜尋能換到的東西，代價可能高到不實際。於是投影片丟出轉折頁：**有沒有一種通用的方法，能在 LLM 上擴大推論期算力？**

## LLM 的第一批答案：CoT 和多數決

**Prompted chain of thought**（[Wei et al. 2022](https://arxiv.org/abs/2201.11903)）：在 prompt 範例裡示範一步步推理，模型就會跟著寫出推理過程。投影片放了經典的網球和自助餐廳蘋果例子，以及 LaMDA、PaLM 在 MultiArith 和 GSM8K 上的圖：模型越大，CoT 相對於標準 prompt 的優勢越明顯。

**多數決（consensus）**：生成很多個解答，取最常出現的那個。投影片的例子是 [Minerva](https://arxiv.org/abs/2206.14858)（Lewkowycz et al.）：靠多數決，在 MATH 上從 33.6% 提升到 50.3%。但投影片也寫：**多數決在 100 個樣本之前就停止進步。** 旁邊附了 [Large Language Monkeys](https://arxiv.org/abs/2407.21787) 論文的圖，在 Llama-3 模型上比較多數決、reward model 選最佳，以及「至少有一個對」（coverage）。

這兩個方法都有用，但都有天花板。

## o1 到 o3，以及 GRPO 和 R1-Zero

**OpenAI o1**：投影片重放了開頭那張圖，o1 在 AIME 的 pass@1 準確率隨 test-time compute 上升。下一頁是 o1 到 o3 的比較：縱軸是 AIME 2025（不用工具），橫軸是估計的推論成本（美元），o3 的 low/medium/high 整條曲線都在 o1 上方。接著兩頁是 NYT Connections 謎題的例子，模型推理了 1 分 25 秒後給出四組答案。

**GRPO**（Group Relative Policy Optimization）：投影片用兩張圖解釋。對同一個問題取樣好幾個回答，交給 verifier 判斷對錯，在組內比較、排序，然後把模型往表現好的回答推。圖上特別標出「no critic」：不需要另外學一個 value model。第二張圖列出細節：advantage 是用組內獎勵的平均和標準差做正規化，目標函數帶 clip，並有一項 KL 正則，把 policy 拉回參考模型附近。GRPO 最早出現在 [DeepSeekMath](https://arxiv.org/abs/2402.03300)。

**R1-Zero：把 GRPO 放大**：[DeepSeek-R1-Zero](https://arxiv.org/abs/2501.12948) 在 RL 時每題取樣 16 個輸出。投影片的圖顯示：訓練過程中，AIME 準確率和回答長度一起上升。

**CoT vs 多數決**：下一頁是 deepseek-r1-lite-preview 的 AIME 準確率對平均思考 token 數作圖，比較「拉長推理」（pass@1）和「多數決」兩條曲線。延長思考那條線爬得比較陡。

如果你想把 GRPO 和 L3 的 policy gradient 接起來，可以這樣看：組內平均當 baseline，正是 [L3](/posts/ai/2026-09-30-cs224r-policy-gradients) 講的降低變異技巧；clip 來自 [L5](/posts/ai/2026-09-30-cs224r-off-policy-actor-critic-ppo-sac) 的 PPO；KL 項則和 [L9](/posts/ai/2026-09-30-cs224r-rlhf-dpo-preference-optimization) 的 RLHF 目標一樣。這段對照是本系列加的，不在投影片上。

## 主張：要為大規模 test-time compute 重新思考 AI

第 24 頁是一張只有一句話的轉折頁：「Claim: Need to rethink AI in an era of large-scale test-time compute.」後面每一段都在展開這句話。

**能推多遠？** 投影片的時間尺度是：o1 以秒計、o3 以分鐘計、講者團隊的 IMO 金牌模型以小時計，現在的 scaffold 則以天到週計。中間穿插了三張圖表：GPT-5.5 的 benchmark 表、一張自動調參進度圖（276 次實驗保留 29 次改進），以及網路攻擊演練的完成步數對累積 token 數。演練從初步偵察一路到完全接管網路。

**Multi-agent**：chain of thought 本質上是**序列式**的，延遲遲早變成瓶頸。有些 test-time scaling 技巧是**平行**的，例如 best-of-N 和多數決，延遲比較低，但算力效率比較差。旁邊的圖是 AIME 2024：GPT-4o 13.4、o1-preview 56.7、o1 83.3。

**評估該怎麼做：畫「分數對算力／時間」**。投影片用 ARC-AGI-2 排行榜（橫軸是每題成本）和 Artificial Analysis 的智慧指數對輸出 token 數圖說明：只報一個分數不夠，要把分數放在算力或時間的座標上比。

## 對安全評估的影響

這一段的文字比較多：

- **安全／preparedness 評估壞了。** 這類評估衡量模型會不會協助造成災難性危害（資安、核武、生物武器），但通常只用很低的預算做（不到 100 美元）。一個有決心的國家級行為者，卻可以輕易在推論上花 1,000 萬美元。
- **安全評估應該推估 test-time compute 放大之後的能力。**
- **長時間的安全評估很難。** 假設模型有一兆 token 的 context、能連續運作好幾個月，要怎麼知道它一個月後的行為和能力？唯一確定的辦法是真的讓它跑一個月。
- **推論算力的戰略價值被低估了。** 推論越重要，權重相對就越不重要。過去很重視保護模型權重，投影片說這件事仍然非常重要，但推論算力本身也是戰略優勢。
- **test-time compute 是一扇通往未來的窗。** 今天要花 100 萬美元的能力，明年可能只要 100 美元；用大規模推論可以提前看到未來模型的能力，趁這段時間做準備。

## 收尾：這會走向哪裡

最後兩頁：

- 推論算力還有很大的空間，代價是更高的推論成本，換來能力強得多的模型。投影片問：你願意為黎曼猜想的證明付多少推論成本？為新的救命藥物呢？
- 文明是幾十億人花了幾千年建起來的；同樣地，未來很可能會有幾十億個持續運作的 agent，像人類一樣分享知識、分工專精。
- 結尾引用 Richard Sutton 的〈The Bitter Lesson〉：70 年 AI 研究最大的教訓是，能利用計算的通用方法最終最有效，而看起來能無限擴展的兩種方法是**搜尋**和**學習**。

這句引文把整講串起來：撲克和圍棋的搜尋、GRPO 的學習，最後都指向同一件事。

## 今晚可以做的事

挑一個你常用、答案可以自動驗證的小任務（例如一組 24 點題目，或一組有單元測試的程式題），用同一個模型跑兩種設定：

```text
A：取樣 1 次，要求寫出推理過程
B：取樣 N 次（N = 1, 4, 16, 64），取多數決
```

把正確率對「總輸出 token 數」作圖，而不是對 N 作圖。這就是投影片主張的「分數對算力」評估，也能讓你親眼看到多數決在哪裡停止進步。

## 延伸閱讀

- [CS336：RLVR](/posts/ai/2026-08-22-cs336-rlvr)：用可驗證獎勵做 RL 的工程細節
- [CME295：LLM 的 RL](/posts/ai/2026-09-29-cme295-rl-with-llms)、[LLM reasoning](/posts/ai/2026-09-29-cme295-llm-reasoning)：另一門 Stanford 課對同一主題的講法
- [Berkeley CS285 Spring 2026 導讀](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview)：更完整的 RL 理論背景

**系列導覽**：上一篇 [L9：RLHF、DPO 與偏好最佳化](/posts/ai/2026-09-30-cs224r-rlhf-dpo-preference-optimization)｜下一篇 [Default Project：用 SFT、IPO、RLOO 微調 LLM 解 Countdown](/posts/ai/2026-09-30-cs224r-default-project-llm-rl)｜[系列總覽](/posts/ai/2026-09-30-cs224r-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入的影片屬於較早學期的公開錄影，不是 2026 當季課程，狀態改為相關補充影片。

## 參考資料

- [CS224R 課程首頁與課表（Spring 2026）](https://cs224r.stanford.edu/)
- [Lecture 10 投影片：RL for LLMs: Reasoning（Noam Brown，2026）](https://cs224r.stanford.edu/slides/10_cs224r_rl_for_llms_reasoning_2026.pdf)
- [CS224R Spring 2025 封存頁](https://cs224r.stanford.edu/spring_2025/)
- [Spring 2025 Lecture 10: RL for LLM Reasoning（YouTube，講者不同，僅供背景）](https://www.youtube.com/watch?v=O2VpNnwB4lM)
- [Brown & Sandholm 2017, Safe and Nested Subgame Solving for Imperfect-Information Games](https://arxiv.org/abs/1705.02955)
- [Wei et al. 2022, Chain-of-Thought Prompting Elicits Reasoning in Large Language Models](https://arxiv.org/abs/2201.11903)
- [Lewkowycz et al. 2022, Solving Quantitative Reasoning Problems with Language Models（Minerva）](https://arxiv.org/abs/2206.14858)
- [Brown et al. 2024, Large Language Monkeys: Scaling Inference Compute with Repeated Sampling](https://arxiv.org/abs/2407.21787)
- [Shao et al. 2024, DeepSeekMath（GRPO 出處）](https://arxiv.org/abs/2402.03300)
- [DeepSeek-AI 2025, DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning](https://arxiv.org/abs/2501.12948)
- [Richard Sutton, The Bitter Lesson](http://www.incompleteideas.net/IncIdeas/BitterLesson.html)
