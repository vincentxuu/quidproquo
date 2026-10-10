---
title: "台大 ADL 2025 第 10 講：偏見、安全、幻覺與對齊，加上期末專題 Jailbreaking Olympics"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, ai-safety, hallucination, alignment]
lang: zh-TW
series:
  name: "台大陳縕儂 深度學習之應用 2025 Fall 導讀"
  order: 13
tldr: "ADL Fall 2025 第 10 講把預訓練模型的問題分成四組，每組配一個目標：bias 對 fairness、toxicity 對 safety、hallucination 對 factuality，最後是 alignment。講義的主張是偏見可能從 ML 管線任何一個環節進來，安全防護要在資料、輸入、訓練、輸出四層都做，幻覺可以拆成原子事實逐條查，而 reward model 被過度優化時，會出現囉嗦、過度道歉、過度拒答這些熟悉的症狀。同一週公布的期末專題叫 Jailbreaking Olympics，但公開的只有兩支說明影片的標題與一行說明。"
description: "導讀台大陳縕儂 ADL Fall 2025（114-1）11/03 的 Issues and Development in PLMs 講義與影片 10.1–10.3：bias 的定義與來源、系統層的緩解、StereoSet、toxicity 與四層 safeguard、jailbreaking（AutoDAN、GCG）、長文事實性評估與 FactAlign、reward model 與 DogeRM、over-optimization、對齊的非預期影響；以及期末專題 Jailbreaking Olympics 公開到哪裡。"
draft: false
glossary:
  - term: "jailbreaking"
    aliases: ["越獄", "jailbreak"]
    definition: "用精心設計的對抗式 prompt 繞過模型的安全對齊與防護，迫使它產生原本會被限制或有害的內容。"
    context: "講義第 19 頁的定義，列出手動 prompt、自動搜尋 prompt、以梯度優化三類方法。"
  - term: "over-optimization"
    aliases: ["overoptimization", "過度優化"]
    definition: "用 reward model 當作人類偏好的替身來做 RL 時，模型把替身的分數刷得太高，實際表現反而變差。"
    context: "講義第 38 頁列出 ChatGPT 的症狀：過度冗長、過度道歉、過度拒答等。"
  - term: "atomic fact"
    aliases: ["原子事實", "atomic claim"]
    definition: "把一段長回答拆成的最小可查證陳述，每一條單獨判斷真假。"
    context: "講義第 25 頁介紹 FactScore、LongFact 的長文事實性評估流程。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-adl2025-fairness-safety-factuality-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

這是[台大陳縕儂 深度學習之應用 2025 Fall 導讀](/posts/ai/2026-09-30-ntu-adl2025-course-overview)的第 13 篇。ADL Fall 2025（114-1，2025/09/01–12/15）在 11/03 上這一講，[課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)的同一列還有「Final Project Announcement」與助教課 LLM Deployment，這一週是實體課（Physical）。

**本文依據**：講義 [Issues and Development in PLMs: Fairness, Safety, Factuality, Alignment（251103_Issues.pdf）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/251103_Issues.pdf)（42 頁），以及三支影片：[10.1 Fairness for Bias Mitigation 如何讓有偏見的模型更公平?](https://youtu.be/3BAFtBS27UI)（24:53）、[10.2 Model Safety 模型不產生有害內容更安全](https://youtu.be/V2Pot_Uv31E)（23:46）、[10.3 Factuality for Hallucination Mitigation 減少幻想讓資訊更符合事實](https://youtu.be/v9Vqk_mfDyA)（33:43）。三支影片的說明欄都標 2025/11/03，並註明投影片取材自 Stanford 與 CMU 的課程；講義最後一頁也列出這兩個出處。講義於 2026-09-30 打開核對，本文頁碼都指講義 PDF。

**系列位置**：上一篇 [NLG：解碼、控制與評估](/posts/ai/2026-09-30-ntu-adl2025-nlg-decoding-evaluation)｜下一篇 [Language Agents](/posts/ai/2026-09-30-ntu-adl2025-language-agents)｜[系列總覽](/posts/ai/2026-09-30-ntu-adl2025-course-overview)

> **存取提醒**：系列整體是 A2。這一講的講義與三支影片都公開，但講義第 29–40 頁的 **Alignment 一節沒有對應影片**：播放清單裡第 10 講只有 10.1–10.3 三支，標題分別對應 fairness、safety、factuality。期末專題的規格也沒有公開，見文末。

前幾講把模型越做越強：預訓練、[後訓練](/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf)、[RAG](/posts/ai/2026-09-30-ntu-adl2025-rag-hw3)。這一講倒過來問：**用大量網路資料訓練出來的模型，帶著哪些問題？怎麼測、怎麼修？**

講義的骨架是四組「問題 → 目標」：

| 問題 | 目標 | 講義頁 | 影片 |
|---|---|---|---|
| Bias | Fairness | 2–13 | 10.1 |
| Toxicity | Safety | 14–22 | 10.2 |
| Hallucination | Factuality | 23–28 | 10.3 |
| （調整模型往特定目標） | Alignment | 29–40 | 無 |

## 課程影片來源

以下影片已於 2026-10-10 對照官方課程頁與官方 YouTube 播放清單（講次編號與標題相符）；不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=3BAFtBS27UI
title: ADL 10.1: Fairness for Bias Mitigation（YouTube）
```

```youtube
url: https://www.youtube.com/watch?v=V2Pot_Uv31E
title: ADL 10.2: Model Safety（YouTube）
```

原始影片：[ADL 10.1: Fairness for Bias Mitigation（YouTube）](https://www.youtube.com/watch?v=3BAFtBS27UI)、[ADL 10.2: Model Safety（YouTube）](https://www.youtube.com/watch?v=V2Pot_Uv31E)、[ADL 10.3: Factuality for Hallucination Mitigation（YouTube）](https://www.youtube.com/watch?v=v9Vqk_mfDyA)、[ADL 2025 Final Project Introduction（YouTube）](https://www.youtube.com/watch?v=UBe9eGPwRyg)、[ADL 2025 Final Project Grand Challenge（YouTube）](https://www.youtube.com/watch?v=pZxBNlSqy6I)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

查核日期：2026-10-10。

字幕嘗試（2026-10-10）：嵌入的 10.1（24:53）與 10.2（23:46）在 YouTube 上沒有可取得的字幕，影片內容未核對；文章的內容依講義頁碼，沒有把任何說法歸給影片口述。兩支的上傳日是 2025-11-06、說明欄寫 2025/11/03，並註明投影片取材自 Stanford 與 CMU 課程。

## Bias → Fairness

### 偏見從哪裡來

第 3 頁引維基百科的定義：偏見是對某個想法或事物「不成比例地偏向或反對」，通常帶著封閉、成見或不公平。講義把關係寫成「有偏見 ≃ 沒有公平」，而 algorithmic fairness 就是修正 ML 系統裡的偏見。

第 4 頁是這一節最值得記的圖：ML 管線從資料分布、資料篩選、標註、特徵與任務設定、模型選擇、loss 選擇、效能評估到下游應用，**每一個設計決策都可能引入偏見**。

講義接著分兩類舉例：

- **資料偏見**（第 5–6 頁）：[Zhao 等人 2017](https://arxiv.org/abs/1707.09457) 的 visual semantic role labeling，訓練資料裡做菜的圖片有 66% 的執行者是女性，模型在測試時把 84% 的做菜圖片預測成女性，偏見被放大了。第 6 頁再舉 ChatGPT 替幼兒園老師、護士、技師、建築工人選代名詞時仰賴性別刻板印象。
- **模型偏見**（第 7 頁）：objective 追求整體 loss 最小，會學著預測最常見的類別，犧牲少數類別；simplicity bias 則讓容量有限的模型先學捷徑，例如刻板印象。

### 系統層的緩解

第 8–11 頁的例子都不改模型，而是改系統：

- Google 翻譯遇到不分性別的語言（例如土耳其文）時，翻兩次，同時給出男性與女性的版本。講義的歸納是「偵測歧義、給出多個答案，同時涵蓋多數與少數」。
- ChatGPT 被問「台灣隊長是誰？」時先反問情境；補上「棒球界」或「政治界」之後，給的答案就完全不同。講義的結論是**透過互動請使用者澄清，可以把模型帶離多數路徑**。

第 12 頁補上語言偏見：MMLU 在英文與低資源語言（講義舉 Telugu）之間有明顯落差。第 13 頁介紹量測刻板印象偏見的資料集 StereoSet。

## Toxicity → Safety

第 15 頁先區分 bias 與 toxicity（引 CMU Advanced NLP 課的投影片），第 16 頁說明問題的根源：預訓練的配方是「能用多少資料就用多少」，結果模型也學會了毒性、偏見與極端內容。第 17 頁給兩個數據方向：模型越大毒性越高（Touvron 等人 2023），GPT-2 的預訓練資料裡超過 4% 的文件有毒（Gehman 等人 2020）。

第 18 頁把 LLM 的防護分成四層，這張表可以直接拿來盤點自己的系統：

| 層 | 做法 |
|---|---|
| 訓練資料 | 過濾有毒的訓練資料 |
| 輸入 prompt 分類 | 主題過濾、有毒內容偵測 |
| Instruction tuning 與 RLHF | 寫「拒絕回答」的示範；讓 RLHF 偏好無毒的生成 |
| 輸出層 | 先生成再分類；可控文字生成 |

### Jailbreaking

第 19 頁定義 **jailbreaking**：用精心設計的對抗式 prompt 繞過模型的安全對齊，迫使它產生原本會被限制的內容。常見方法分三類：

1. 手動 prompt engineering：角色扮演、長 context、模仿 system prompt、few-shot。
2. 自動搜尋 jailbreak prompt：講義舉 [AutoDAN](https://arxiv.org/abs/2310.04451)（Liu 等人 2024，第 20 頁），目標是找出能觸發危險回應的 prompt。
3. 以梯度優化：講義舉 [Greedy Coordinate Gradient（GCG）](https://arxiv.org/abs/2307.15043)（Zou 等人 2023，第 21–22 頁），用梯度學出對抗 prompt。

講義在這裡只給方法的分類與兩篇代表論文的想法，沒有展開攻擊細節。

## Hallucination → Factuality

第 24 頁的例子很有說服力：請模型寫陳縕儂的簡介，它說她在 UC Berkeley 拿博士、指導教授是 Dan Klein；投影片旁邊標出正確的是 Carnegie Mellon University 與 Alexander I. Rudnicky。講義的主張是：**LLM 要成為下一代資訊引擎，事實性是關鍵**。

### 長文事實性怎麼評

第 25 頁的流程：把回答拆成原子陳述、把每條改寫成可獨立理解的句子、再用搜尋或維基百科逐條查證。講義列的兩個代表是 [FactScore](https://arxiv.org/abs/2305.14251)（Min 等人 2023）與 [LongFact](https://arxiv.org/abs/2403.18802)（Wei 等人 2024），指標有 precision、Recall@K、F1@K，並提到這類評估器與人工標註的一致性很高。

### FactAlign

第 26–28 頁是陳縕儂實驗室的 [FactAlign](https://arxiv.org/abs/2410.01691)（Huang & Chen 2024）。想法是把對齊從「整個回答給一個二元標籤」細化到**句子層級**，演算法叫 fKTO，並做迭代優化。第 28 頁的結果是在 LongFact 上，LLaMA-3-8B、Phi3-Mini、Gemma-2B 三個模型加上 FactAlign 後 F1@100 都比 SFT 高。

## Alignment（講義限定，沒有影片）

### SFT 與 RLHF 各要什麼資料

第 30–31 頁比較兩種人類回饋：

- **指令跟隨資料**（給一個輸入、寫一個好輸出）比較難做；**偏好資料**（兩個輸出選一個）比較容易。
- SFT 學的是預測下一個好的 token，是局部的；RLHF 學的是產生好的整個回答，是全局的。

這跟[上一篇 RL for NLG](/posts/ai/2026-09-30-ntu-adl2025-nlg-decoding-evaluation) 的「局部 vs 全局」是同一個論點。講義也提醒：人類回饋仍然昂貴、難以擴大規模。

### Reward model 與 DogeRM

第 32–33 頁：reward model 是模擬人類回饋的模型，從收集到的偏好資料做監督式學習。問題是特定領域（例如寫程式）的偏好資料很難收集。

第 34–35 頁的 [DogeRM](https://arxiv.org/abs/2407.01470)（Lin 等人 2024）的出發點是：領域的 SFT 資料比偏好資料多得多，所以用 **model merging** 把領域知識併進 reward model。講義說它在不同 benchmark 上都有效。

第 36–37 頁說明 reward model 的兩種用法：每次生成多個答案、讓 RM 挑分數最高的（慢、貴），或用 RM 的分數透過 RL 調整 LLM，之後只要生成一次。

### 過度優化與它的症狀

第 38 頁：**over-optimization 可能傷害效能**。講義引 ICML 2023 invited talk 列出的 ChatGPT 症狀：

- 過度冗長
- 過度道歉、自我懷疑
- 「As an AI language model」
- 模稜兩可的措辭，例如「沒有放諸四海皆準的解法」
- 過度拒答

第 39 頁引 Ryan 等人 2024：SFT 與偏好調整都會把模型推向美國的偏好與觀點。第 40 頁留下三個大問題：無害與有用怎麼平衡、人的偏好本身有偏見或可被操弄怎麼辦（例如人偏好確定的答案勝過不確定的答案），以及根本問題：**所有價值與文化無法放進同一個排序**。

## 期末專題：Jailbreaking Olympics

11/03 這一週也公布了期末專題。依 [Course Logistics](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Course.pdf)，期末團體專題佔總成績 35%；課程頁把 2025/12/15 列為 Final Project Due。

公開的只有兩支影片，本文能確定的內容只有標題與說明欄：

| 影片 | 長度 | 說明欄 |
|---|---|---|
| [ADL 2025 Final Project Introduction](https://youtu.be/UBe9eGPwRyg) | 10:58 | Rules and Grading |
| [ADL 2025 Final Project Grand Challenge](https://youtu.be/pZxBNlSqy6I) | 38:30 | Jailbreaking Olympics: Building & Breaking Satety Systems（原文拼字如此） |

從說明欄只能讀出題目方向：同時「建」與「破」安全系統，和本講 safety 一節的 safeguard 與 jailbreaking 正好對應。**規則、評分方式、資料、平台都沒有公開文件**，本系列也沒有從影片畫面轉述細節，所以不寫。如果你要自己做類似練習，本講第 18 頁的四層防護表與第 19 頁的三類攻擊，就是設計攻防兩邊的起點。

## 自學怎麼用這一講

1. 先看 10.2，對照第 18–22 頁，把四層防護和三類 jailbreak 對起來。
2. 讀 10.3 時，拿任何一個 LLM 請它寫某位你熟悉的人的簡介，照第 25 頁的流程拆成原子事實，自己逐條查。
3. Alignment 一節沒有影片，直接讀第 29–40 頁；第 38 頁的症狀清單可以當作你評自家模型回答時的檢查表。

今晚可以做的一件事：拿你手上一個 LLM 應用，用第 18 頁的四層表格逐層寫下「目前有做 / 沒做」，找出最空的那一層。

## 延伸閱讀

- [CS224N 第 16 講：Hallucination、創造力、工作與價值對齊](/posts/ai/2026-08-22-cs224n-social-impacts)：同樣題材的 Stanford 視角，也是這份講義的取材來源之一。
- [CME295 第 5 講：RLHF 與 DPO](/posts/ai/2026-09-29-cme295-preference-tuning)：reward model 與偏好調整的細節。
- [CS224N 第 8 講：從 instruction tuning、RLHF 到 DPO](/posts/ai/2026-08-22-cs224n-post-training)

上一篇：[NLG：解碼、控制與評估](/posts/ai/2026-09-30-ntu-adl2025-nlg-decoding-evaluation)
下一篇：[Language Agents](/posts/ai/2026-09-30-ntu-adl2025-language-agents)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入影片與官方課程頁、播放清單的講次相符。
- 2026-10-10：嘗試依字幕核對 10.1、10.2，但兩支都取不到字幕，內容未核對；文章未改動。

## 參考資料

- [ADL Fall 2025 課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) — 11/03 課表列、Final Project Due 日期
- [Issues and Development in PLMs 講義（251103_Issues.pdf）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/251103_Issues.pdf) — 本文所有頁碼
- [Course Logistics 投影片（250901_Course.pdf）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Course.pdf) — 期末專題佔 35%
- [ADL 10.1: Fairness for Bias Mitigation（YouTube）](https://youtu.be/3BAFtBS27UI)
- [ADL 10.2: Model Safety（YouTube）](https://youtu.be/V2Pot_Uv31E)
- [ADL 10.3: Factuality for Hallucination Mitigation（YouTube）](https://youtu.be/v9Vqk_mfDyA)
- [ADL 2025 Final Project Introduction（YouTube）](https://youtu.be/UBe9eGPwRyg)
- [ADL 2025 Final Project Grand Challenge（YouTube）](https://youtu.be/pZxBNlSqy6I)
- [Zhao et al., Men Also Like Shopping: Reducing Gender Bias Amplification using Corpus-level Constraints (EMNLP 2017)](https://arxiv.org/abs/1707.09457)
- [Liu et al., AutoDAN: Generating Stealthy Jailbreak Prompts on Aligned Large Language Models](https://arxiv.org/abs/2310.04451)
- [Zou et al., Universal and Transferable Adversarial Attacks on Aligned Language Models (GCG)](https://arxiv.org/abs/2307.15043)
- [Min et al., FActScore: Fine-grained Atomic Evaluation of Factual Precision in Long Form Text Generation](https://arxiv.org/abs/2305.14251)
- [Wei et al., Long-form factuality in large language models (LongFact)](https://arxiv.org/abs/2403.18802)
- [Huang & Chen, FactAlign: Long-form Factuality Alignment of Large Language Models](https://arxiv.org/abs/2410.01691)
- [Lin et al., DogeRM: Equipping Reward Models with Domain Knowledge through Model Merging](https://arxiv.org/abs/2407.01470)
