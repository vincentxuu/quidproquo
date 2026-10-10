---
title: "CMU 10-423 L20：推理模型——從 chain-of-thought 到 o1、DeepSeek-R1 與 GRPO，再看一眼機制可解釋性"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, reasoning, chain-of-thought, grpo, deepseek-r1, interpretability]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 19
tldr: "CMU 10-423 Spring 2026 的 L20 把推理模型講成一條線：先用 chain-of-thought 提示讓模型寫出中間步驟，再用 STaR 把「寫對的推理」拿回來微調，接著 OpenAI o1 用強化學習訓練思考 token，訓練和推論時的算力都能往上加。開源這邊，DeepSeek-R1-Zero 只用規則式獎勵和 GRPO 就讓推理長度自己變長，DeepSeek-R1 再補上 SFT 修掉可讀性與語言混雜。講座最後轉到機制可解釋性：superposition 為什麼讓模型難懂，以及 sparse autoencoder、circuits、cross-layer transcoder 這些「替代模型」怎麼處理。"
description: "CMU 10-423/623/723 Generative AI（Spring 2026）第 20 講導讀：chain-of-thought 與 zero-shot CoT、o1 的密碼解題範例、STaR、AIME 資料集、o1 的訓練與推論算力、PPO 與 GRPO 的差別、DeepSeek-R1-Zero 的規則式獎勵與結果、DeepSeek-R1 的四段訓練流程，以及機制可解釋性裡的 superposition、sparse autoencoder 與 cross-layer transcoder。"
draft: false
glossary:
  - term: "GRPO"
    aliases: ["Group Relative Policy Optimization", "群組相對策略最佳化"]
    definition: "類似 PPO 的強化學習演算法：對同一個問題抽樣一組回答，用組內其他回答的平均獎勵當基準來算優勢值，因此不需要另外訓練 value model，記憶體需求大幅下降；KL 懲罰直接加進 loss，而不是加在獎勵裡。"
    context: "CMU 10-423 第 20 講介紹 DeepSeek-R1 之前先講的演算法，出自 DeepSeekMath。"
    links:
      - label: "DeepSeekMath（Shao et al., 2024）"
        url: "https://arxiv.org/abs/2402.03300"
  - term: "STaR"
    aliases: ["Self-Taught Reasoner"]
    definition: "用少量人工寫的推理範例當 in-context 示範，讓模型替大量沒有推理過程的題目生成推理；答錯就再試著生成一段能導向正確答案的推理，最後只拿導向正確答案的推理來微調，反覆進行。"
    context: "CMU 10-423 第 20 講在 CoT 提示與 o1 之間介紹的自我訓練方法。"
    links:
      - label: "STaR（Zelikman et al., 2022）"
        url: "https://arxiv.org/abs/2203.14465"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu10423-reasoning-models-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

**本文依據 [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 版。** 這是 [CMU 10-423 導讀](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)系列第 19 篇，接續 [L19 + L21：長上下文與 State Space／Hybrid 模型](/posts/ai/2026-09-30-cmu10423-long-context-ssm)。範圍是 2026 年 3 月 30 日的 Lecture 20「Reasoning Models」，講者 Aran Nayebi 與 Matt Gormley。

用到的官方材料：[講次表](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)與 [L20 投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture20-reasoning.pdf)（39 頁，沒有手寫版）。投影片封面的完整標題是「Reasoning Models + Mechanistic Interpretability」，比講次表多了後半的可解釋性。講次表沒有列這一講的 readings，本文只引投影片和它標註的出處。這門課的存取等級是 **A3**（定義見[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)），但錄影放在要 CMU 登入的 Panopto，本篇只依投影片撰寫。

這一講要回答的問題是：**推理模型和一般 LLM 的訓練與推論方式差在哪？** 投影片的答案分三步：先讓模型把推理寫出來，再用強化學習獎勵寫對的推理，最後讓推論時也能花更多算力想久一點。

## 課程影片來源

官方課站將 Spring 2026 錄影放在 SCS Panopto；匿名頁面未載入影片並提示登入。本文依公開投影片與作業導讀，錄影需依課程授權存取。

課程與錄影入口：

- [CMU 10-423/623/723 Spring 2026 — official Panopto recordings](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [cmu-10-423-generative-ai — official course materials and recording index](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## 先交代一件事：這天晚上考試

投影片第二頁是提醒：當晚 7 點有 80 分鐘的考試，範圍是 Lectures 1–15（和 Quiz 1–4 相同），可以帶一張雙面筆記；和全是選擇題的 Quiz 不同，考試會有開放式問題。所以 L20 本身不在考試範圍，只由 Quiz 5（4 月 6 日，涵蓋 L16–L20）驗收，題目不公開。

## 第一步：讓模型把推理寫出來

### Chain-of-thought 提示

投影片從 [L10 的 in-context learning](/posts/ai/2026-09-30-cmu10423-peft-in-context-learning) 接過來：

- 在 few-shot 示範裡附上推理過程，模型的表現會變好，這就是 [chain-of-thought 提示（Wei et al. 2022）](https://arxiv.org/abs/2201.11903)
- 更省事的是：就算不給示範，只要提示模型「一步一步想」，表現也會變好，出自 [Kojima et al. 2022](https://arxiv.org/abs/2205.11916)

### 一段真的很長的「思考」

接著投影片花了八頁放 [OpenAI 介紹 o1 的文章](https://openai.com/index/learning-to-reason-with-llms/)裡的密碼題。題目給一組範例：`oyfjdnisdr rtqwainr acxz mynzbhhx` 解碼後是 `Think step by step`，要模型照同樣規則解另一串密文。

投影片摘錄的思考過程很像人在草稿紙上試錯：先數字母數、發現密文每個字剛好是明文的兩倍長、猜「每兩個字母對應一個字母」、試加總字母序號，一路試到解出 `THERE ARE THREE R'S IN STRAWBERRY`。投影片在中間標了一句「1276 lines later」，提醒你這段思考有多長。

這裡的重點不在密碼本身，而是 o1 的一個產品決定：**OpenAI 沒有公開完整的「Thinking」輸出，只給使用者一份摘要。**

### STaR：把寫對的推理拿回來訓練

在 o1 之前，投影片先介紹 [STaR（Self-Taught Reasoner）](https://arxiv.org/abs/2203.14465)。資料只有兩種：少量人工標註的推理範例，以及大量沒有推理過程的題目。流程反覆執行：

1. 用少量推理範例做 ICL，替沒有推理的題目生成推理
2. 如果生成的答案錯了，就試著重新生成一段能導向正確答案的推理
3. 拿所有導向正確答案的推理來微調

這一步把「推理」從提示技巧變成訓練資料。

## 第二步：用強化學習訓練思考 token

### AIME 與 o1

投影片先介紹之後反覆出現的評測：[AIME 2024 資料集](https://huggingface.co/datasets/Maxwell-Jia/AIME_2024)，美國數學邀請賽的題目。

然後是 o1 的整理：

- o1 用強化學習訓練，學會替答案生成 chain-of-thought 風格的推理
- 這些推理（稱為 Thinking token）不給使用者看，改呈現摘要
- **訓練時**可以透過做更多強化學習增加算力；**推論時**可以讓模型想更久來增加算力
- 結果一：訓練算力越多，推理題的準確率越高；結果二：推論算力越多，準確率也越高

投影片在這裡自問自答：為什麼這段描述這麼模糊、這麼不技術？因為 OpenAI 只發了一篇部落格文章，這些大概就是它說過的全部。

投影片接著引 OpenAI 的圖說明 o1 在數學、推理、常識、程式等多種題目上都勝過 GPT-4o，並下結論：閉源的 o1 明顯勝過任何開源模型，「所以我們等開源模型追上來……」

### DeepSeek-R1 登場

[DeepSeek-R1](https://arxiv.org/abs/2501.12948) 是投影片給的答案：開源、開放權重、671B 參數，是基礎模型 DeepSeek-V3 仔細調校後的版本，表現和 o1 相當。

### PPO 與 GRPO 差在哪

要看懂 R1 怎麼訓練，投影片先回到演算法。GRPO 早於 R1，由 [DeepSeekMath](https://arxiv.org/abs/2402.03300) 提出。投影片的一句話版本：**GRPO 是類似 PPO 的強化學習演算法，但拿掉了 value model，記憶體需求因此大幅下降。**

投影片直接貼了 DeepSeekMath 論文的兩段原文與流程圖，差異可以整理成一張表：

| | PPO | GRPO |
|---|---|---|
| 要訓練的模型 | policy model + value model | 只有 policy model |
| 優勢值從哪來 | 用獎勵和 value model 的估計值，經 GAE 算出 | 對同一題抽樣一組回答（o₁…o_G），用組內回答的相對獎勵當基準 |
| KL 懲罰放哪 | 加在每個 token 的獎勵裡 | 直接加進 loss，不讓優勢值的計算變複雜 |

PPO 的部分可以回頭對照 [L11 的 RLHF](/posts/ai/2026-09-30-cmu10423-ift-rlhf-dpo)：那裡的 PPO 就是這張表左欄。

<details>
<summary>展開：GRPO 目標函數的結構</summary>

投影片貼的 DeepSeekMath 式 (3) 可以拆成三層：

1. 對每個問題 q，從舊策略抽樣 G 個回答
2. 對每個回答的每個 token，算新舊策略的機率比，乘上優勢值 Â，再做和 PPO 一樣的 clip（範圍 1−ε 到 1+ε）
3. 對所有回答、所有 token 取平均後，再減去 β 乘上新策略與 reference 策略之間的 KL

ε 和 β 是超參數。和 PPO 的差別只在 Â 怎麼來、KL 放在哪。

</details>

### DeepSeek-R1-Zero：只用強化學習

投影片用五頁講 R1-Zero：

**訓練方法**
- 完全用強化學習，沒有任何監督式微調（SFT）
- 從預訓練好的 DeepSeek-V3-Base 出發，強化學習不用人類偏好
- 投影片稱它是第一批大規模示範「只用強化學習訓練 LLM」的例子之一
- 目的是看推理能力能不能只靠強化學習、不靠標註資料就自己長出來

**獎勵模型**：沒有用神經網路獎勵模型，只用兩種規則式獎勵：
- **正確性獎勵**：答案對不對
- **格式獎勵**：有沒有遵守提示模板

模板要求模型先把推理寫在 `<think>` 標籤裡，再把答案寫在 `<answer>` 標籤裡。

**結果**
- 在 AIME 上，強化學習訓練越久，表現越好，最後超越 o1
- 模型逐漸學會用越來越長的 Thinking token 序列，這完全是強化學習目標的結果，沒有任何直接拉長推理長度的做法

**問題**
- 可讀性差：人類看不太懂它在說什麼
- 語言混雜：英文和中文混成一種洋涇浜語言

### DeepSeek-R1：補回 SFT

R1 在 R1-Zero 的基礎上改用混合訓練策略。投影片引的圖列出四步：

1. **Cold start**：先用幾千筆人工整理、人類讀得懂的長 CoT 微調基礎模型
2. **以推理為主的強化學習**：用數學、程式、邏輯題擴大強化學習，並加上語言一致性獎勵，讓模型停在單一語言
3. **Rejection sampling + SFT**：從強化學習後的模型抽樣正確、結構良好的推理，加上寫作、問答、自我認知等一般能力資料，訓練新的基礎模型 checkpoint
4. **跨情境的強化學習**：第二輪強化學習同時包含推理題和一般任務，兼顧「helpfulness」與「harmlessness」

投影片的文字稱這是「two-stage pipeline」，引用的圖卻列了四步；我的讀法是「SFT 接強化學習」這組做兩輪，但這是推測，課堂口述拿不到。投影片的結論很明確：先 SFT 再強化學習，修掉了 R1-Zero 的重複與語言混雜，可讀性、連貫性與任務準確率都變好。

## 後半：機制可解釋性

講座最後六頁轉到另一個主題。投影片列出可解釋性重要的四個理由：安全（事後修正）、安全（事前預防）、防止 AI 末日，以及向 AI 學習。

**為什麼難**：最大的問題是 superposition。人類能理解的「特徵」很少只在網路的單一位置被激發，它的激發幾乎總是分散在很多地方：跨 head、跨 MLP 神經元、跨層。

**替代模型**：對網路裡的特定區塊，訓練一個「替代區塊」模仿原區塊的輸入到輸出，關鍵在於讓替代區塊更好解釋。投影片列的技巧：

- **Sparse autoencoder**：把 Transformer 區塊裡的 MLP 層換成自編碼器版本，隱藏層的神經元（特徵）更多，並加上鼓勵激發稀疏的正則化，例如 L1
- **Circuits**
- **Cross-layer transcoder**：讓替代區塊能直接存取所有較早的替代區塊

最後一頁是 Anthropic 的 [On the Biology of a Large Language Model](https://transformer-circuits.pub/2025/attribution-graphs/biology.html)，用 circuit tracing 方法研究 Claude 3.5 Haiku 在多步推理、押韻規劃、多語言、醫療診斷、拒答、越獄、CoT 忠實度等情境下的內部機制。投影片只放了這份研究的目錄圖，沒有展開個別案例。

## 一張表收束

| 階段 | 代表 | 推理從哪來 | 算力加在哪 |
|---|---|---|---|
| 提示 | CoT、zero-shot CoT | 示範或一句「一步一步想」 | 推論時多生成幾個 token |
| 自我訓練 | STaR | 模型自己生成、只留答對的 | 微調 |
| 強化學習 | o1、R1-Zero、R1 | 獎勵答對（R1 另加格式與語言一致性） | 訓練時做更多強化學習、推論時想更久 |

**怎麼做**：今晚手算一次 GRPO 的優勢值。假設同一題抽了 4 個回答，規則式獎勵是 [1, 0, 0, 1]。依 DeepSeekMath 論文的 outcome supervision 做法，把獎勵減去組平均（0.5）再除以組標準差（用母體標準差是 0.5），得到優勢值 [1, −1, −1, 1]。再把獎勵改成 [1, 1, 1, 1] 算一次，減去平均後全是 0，照公式還會除以 0。這個小例子說明：一組回答全對或全錯時，組內沒有比較基準，這一題就提供不了學習訊號。

## 這一篇可以確認與不能確認的

可以確認：講次表的日期與 Quiz 範圍，投影片上的文字、表格、圖說與出處標註，GRPO 優勢值的正規化方式（查 DeepSeekMath 論文原文），投影片引用論文的標題（以 arXiv 核對）。不能確認：課堂口述（Panopto 需登入）、只以圖呈現的數字（例如 o1 的算力曲線、R1-Zero 的 AIME 準確率曲線、R1 與 o1 的評測長條圖），以及「two-stage」與四步驟圖之間的官方解釋。

延伸閱讀：站上 [CME295 的 LLM 推理篇](/posts/ai/2026-09-29-cme295-llm-reasoning)、[CS336 的 RLVR 篇](/posts/ai/2026-08-22-cs336-rlvr)從不同角度談推理模型與可驗證獎勵；可解釋性可以接著讀 [CS224N 可解釋性篇](/posts/ai/2026-08-22-cs224n-interpretability)與 [Harvard CS2881R 可解釋性篇](/posts/ai/2026-09-30-cs2881r-lecture-10-interpretability)。

系列導覽：上一篇 [L19 + L21：長上下文與 State Space／Hybrid 模型](/posts/ai/2026-09-30-cmu10423-long-context-ssm)｜下一篇 [L22 + L26：實務風險與對齊科學](/posts/ai/2026-09-30-cmu10423-risks-alignment)｜[系列總覽](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [CMU 10-423/623/723 Generative AI（Spring 2026）課程首頁](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [課程講次表（L20 日期、考試與 Quiz 5 範圍）](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
- [Lecture 20 投影片：Reasoning Models + Mechanistic Interpretability](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture20-reasoning.pdf)
- [Wei et al. 2022：Chain-of-Thought Prompting Elicits Reasoning in Large Language Models](https://arxiv.org/abs/2201.11903)
- [Kojima et al. 2022：Large Language Models are Zero-Shot Reasoners](https://arxiv.org/abs/2205.11916)
- [OpenAI：Learning to Reason with LLMs](https://openai.com/index/learning-to-reason-with-llms/)
- [Zelikman et al. 2022：STaR: Bootstrapping Reasoning With Reasoning](https://arxiv.org/abs/2203.14465)
- [Maxwell-Jia/AIME_2024 資料集（Hugging Face）](https://huggingface.co/datasets/Maxwell-Jia/AIME_2024)
- [DeepSeek-AI 2025：DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning](https://arxiv.org/abs/2501.12948)
- [Shao et al. 2024：DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models](https://arxiv.org/abs/2402.03300)
- [DeepSeek-R1 explained（Hugging Face 部落格，投影片 R1 流程圖出處）](https://huggingface.co/blog/NormalUhr/deepseek-r1-explained)
- [Anthropic 2025：On the Biology of a Large Language Model](https://transformer-circuits.pub/2025/attribution-graphs/biology.html)
