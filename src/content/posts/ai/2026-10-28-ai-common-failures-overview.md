---
title: "AI 通病總覽：否定式對比、意義抬高、指示型摘要、過度概括"
date: 2026-10-28
category: ai
type: guide
tags: [llm-writing, llm, writing-process]
lang: zh-TW
tldr: "LLM 寫作有四個常見通病：否定式對比（先駁倒沒人說過的 X）、意義抬高（把普通事實包成轉折）、指示型摘要（只說談什麼、不給結論）、過度概括（摘要丟掉條件與範圍）；前三個刪空話、直接寫答案，第四個拿原文逐句對。否定式對比已追到訓練用的偏好資料，模型修訂稿時還會把它換成另一種對比句型，所以只在 prompt 禁字未必擋得住。"
description: "「AI 通病」系列總覽：用一則被退三次的 tldr，說明否定式對比、意義抬高、指示型摘要、過度概括四種寫法怎麼認、怎麼修，以及依讀者身分的閱讀順序。"
series:
  name: "AI 通病"
  order: 0
draft: false
---

> 🌏 [English version](/posts/ai/2026-10-28-ai-common-failures-overview-en)

## 一則被退三次的 tldr

本站有一篇比較 [Cloudflare Agents SDK 四個入口](/posts/ai/2026-10-28-cloudflare-agents-sdk-entry-points)的文章。正文「我會怎麼選」那節給了明確的答案：

- 已經有想用的 harness，而且能接受它 experimental 的 API：用 `PiHarness`。
- 做 chat 介面、每次模型呼叫要自己組：用 `AIChatAgent`；想交給框架：用 `Think`。
- 不是 chat，但需要狀態、排程、MCP：用 `Agent`。

tldr 交給 AI 寫，退了三次：

| 版本 | tldr（節錄） | 讀者拿到什麼 |
|---|---|---|
| 1 | 「…同一個 SDK 有四個 loop 歸屬不同的起點。這篇用一張分層圖、四個條件和三個 delegation 機制，說明第一版該從哪裡開始。」 | 文章有哪些段落 |
| 2 | 「Cloudflare 文件叫你從 Pi harness 開始，repo README 的第一個範例卻是 Agent。兩個都對，差別在 agent loop 歸誰跑…」 | 一個反差，答案沒出現 |
| 3 | 「四個起點不是四種功能，是四種『loop 歸誰跑』的安排…」 | 一個沒人主張的說法被駁倒 |
| 改寫 | 「已有 harness 就用 PiHarness；做 chat、要自己組模型呼叫用 AIChatAgent，交給框架用 Think；不是 chat 但要狀態、排程、MCP，用 Agent。」 | 該選哪個 class |

前三版的文法都對，內容也都跟文章有關。讀者看完，還是不知道自己該選哪個 class。答案一直在正文的決策段，最後一列只是把它搬出來。

這個系列把這類寫法叫做 **AI 通病**：讀起來像有資訊，讀者卻拿不到答案，或拿到範圍錯的答案。人也會這樣寫。其中三個（否定式對比、意義抬高、過度概括）已經有研究量到 LLM 比人寫得更頻繁；而且每一句單獨看都說得過去，所以很難靠「這句怪怪的」抓出來。

## 四個通病

| 通病 | 長什麼樣 | 怎麼修 | 系列篇次 |
|---|---|---|---|
| 否定式對比 | 「不是 X，是 Y」，而 X 沒人主張 | 刪掉 X，直接寫 Y；X 是讀者真有的誤解才留 | [第 1 篇](/posts/ai/2026-10-28-ai-contrast-framing) |
| 意義抬高 | 「標誌著…的關鍵時刻」「反映更廣泛的趨勢」 | 換成讀者能查的具體事實，沒有就刪 | 第 2 篇 |
| 指示型摘要 | 「本文介紹…」「這篇用三個面向說明…」 | 把結論本身寫進摘要 | 第 3 篇 |
| 過度概括 | 「在某條件下有關聯」變成「X 能改善 Y」 | 拿原文逐句對對象、條件、時態 | 第 4 篇 |

前兩個是句子層的問題，後兩個是摘要層的問題。

### 否定式對比

上表第 3 版就是：先否定「四種功能」，再給出「四種 loop 歸屬」。問題在於沒有讀者以為這四個 class 是四種功能，被否定的 X 是作者自己架起來的。

`rather than` 在 NLP 論文裡七年多了約 7 倍（[Zamaraeva 等人，2026](https://arxiv.org/abs/2610.10092)）。中文的「不是X，而是Y」，五個商用模型的密度是人類參考語料的 2.5 到 9.2 倍，幾乎都沒用錯，但一半以上可有可無（[Peng 等人，2026](https://arxiv.org/abs/2610.22249)）。

### 意義抬高

[Wikipedia 的 AI 寫作特徵整理](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)收了一段 2024 年的條目修訂：

> The Statistical Institute of Catalonia was officially established in 1989, marking a pivotal moment in the evolution of regional statistics in Spain.

前半句是讀者能查的事實（1989 年成立），後半句「標誌著關鍵時刻」是評價，沒有給出任何新資訊。

[Reinhart 等人（2025，PNAS）](https://pmc.ncbi.nlm.nih.gov/articles/PMC11874169/)比較 Llama 3 指令微調前後的版本，微調後的寫作風格離人類更遠。他們也量到 GPT-4o 用現在分詞子句的頻率是人類的 5.3 倍；這個數字涵蓋所有分詞子句，句尾掛評價的 ", marking…" 只是其中一種。

### 指示型摘要

上表第 1 版：讀者知道文章有一張圖、四個條件，不知道結論。摘要研究很早就把摘要分成兩型：**指示型**（indicative）只說文件談什麼，**資訊型**（informative）把結果與結論寫出來。美國的摘要標準 [ANSI/NISO Z39.14](https://www.oregon.gov/ODOT/Programs/ResearchDocuments/Abstract-Guidelines.pdf) 規定，報告實驗、調查結果的文件寫資訊型；指示型留給社論、書、名錄這類沒有單一結果可報的文件。

所以指示型摘要本身沒有錯。通病出在文章明明有結論，摘要卻只給目錄。

### 過度概括

這一型的摘要會給結論，只是給錯範圍。示意：原文寫「在 65 歲以上、輕度高血壓的受試者中，A 組十二週後收縮壓比 B 組低」，摘要寫成「A 能降血壓」。對象、條件、比較組都不見了。

[Peters 與 Chin-Yee（2025）](https://pmc.ncbi.nlm.nih.gov/articles/PMC12042776/)測了 10 個模型、4,900 份科學摘要。其中一組比較拿 4 個模型（兩個 GPT-4 Turbo 介面、ChatGPT-4o、DeepSeek）跟 NEJM Journal Watch 的專家摘要比，LLM 摘要出現過度概括的機率約是專家的 5 倍。

要求模型「要準確」，過度概括反而約多了一倍。各家模型的差別也很大：Claude 2、3.5、3.7 的摘要跟原文沒有顯著差異，GPT-4o、LLaMA 3.3、DeepSeek 最嚴重。

## 成因：至少否定式對比已追到訓練資料

訓練 LLM 時，偏好資料是讓人或模型從兩個回答中挑比較好的一個（訓練流程見[模型訓練階段導讀](/posts/ai/2026-08-26-understanding-ai-models-training-stages)）。否定式對比有直接證據：Zamaraeva 等人發現，偏好資料的評分者和開源獎勵模型都偏好帶 `rather than` 的句子；Peng 等人的獎勵模型實驗也得到同樣方向的結果。

Zamaraeva 等人推測，成對比較只看得到單一回答裡這個句子的好處，看不到同一篇文字反覆出現的代價。這是作者的推測，還沒有實驗驗證。其他三個通病目前只有間接跡象，例如 Reinhart 的指令微調前後對照；證據與反例在系列第 5 篇整理。

## 只禁字面，未必擋得住習慣

最直覺的修法是在 prompt 寫「不要用『不是…而是…』」。目前沒有人做過「禁掉一個句型」的受控實驗，但有跡象：Zamaraeva 等人讓模型依審稿意見修訂自己寫的論文（prompt 裡沒提任何對比句型），Claude Sonnet 5.5、Opus 5.5 和 GPT-6-sol 修訂後，`rather than` 沒有一致變多，後置的「X, not Y」卻明顯增加。作者也逐句檢查過：被刪掉的 `rather than` 剛好換成另一種對比句型，是例外而非常態。

本站那則 tldr 走過類似的路：每一輪都避開上一輪被點出的問題，又落到另一型。最後是規定 **tldr 要寫什麼**（讀者要的結論，從正文的決策段取），才寫出上表最後一列。防護怎麼做、禁令什麼時候有用，是第 6、7 篇的內容。

## 也別矯枉過正

這四種句型人也常用。肉眼判斷「像不像 AI」因人而異：[Russell 等人（2025）](https://arxiv.org/abs/2501.15654)找 4 位不用 LLM 寫作的人判斷，約一半的人類文章被誤判成 AI；常用 LLM 寫作的 5 位專家多數決，300 篇只錯 1 篇。沒練過的人拿「像不像 AI」當判準，會冤枉很多人類作者。

所以本系列的判準一律是：這句缺了什麼資訊。第 8 篇專門談這件事。

## 從哪篇讀起

- **寫稿、審稿的人**：依序讀第 1 到 4 篇，每篇都有改寫範例與自我檢查。
- **設計寫作流程、寫 prompt、做檢查器的人**：本站最常退的是 tldr，先讀講這件事的第 3 篇，再讀第 6、7、8 篇。
- **想知道為什麼會這樣的人**：第 5 篇。
- **在用 coding agent、常看到「已完成」的人**：第 9 篇談同一個病出現在寫作以外的地方：agent 宣稱完成，其實沒做完。

## 自我檢查

下面是同一篇（虛構的）RAG 切塊文章的四種 tldr，各有哪個通病？

1. 「本文整理 RAG 的五種切塊策略，以及各自的優缺點。」
2. 「切塊大小不是一個技術細節，而是決定檢索品質的核心。」
3. 「研究顯示小切塊能提升檢索準確率。」（原文：在一個法律問答資料集上，256 token 切塊的 recall@5 比 1024 token 高。）
4. 「短答案查詢用 256 token 切塊；需要整段脈絡的摘要任務改用 1024 token 加 overlap。」

<details>
<summary>答案</summary>

1. 指示型摘要：讀者知道有五種策略，不知道該選哪個。
2. 否定式對比加意義抬高：沒有人主張切塊只是細節，「決定品質的核心」也沒給出任何可用的資訊。
3. 過度概括：「一個法律問答資料集」與「recall@5」都不見了，變成通則。
4. 沒有通病：讀者照著做就有答案。這句的內容是虛構的示範，數字不能當真。

</details>

做完之後，打開你最近一篇文章或 PR 的摘要，遮掉正文只看摘要：讀者能做決定嗎？不能，就回正文的決策段，把結論搬上來。

## 參考資料

- [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)：Wikipedia 編輯整理的 LLM 寫作特徵，每條附真實條目修訂
- [Zamaraeva et al. (2026). I would rather quit NLP than read another paper like this: The rise of antithesis in NLP papers. arXiv:2610.10092](https://arxiv.org/abs/2610.10092)
- [Peng et al. (2026). Not X, but When: Diagnosing a Mandarin LLM Writing Tic through Contextual Appropriateness. arXiv:2610.22249](https://arxiv.org/abs/2610.22249)
- [Reinhart et al. (2025). Do LLMs write like humans? Variation in grammatical and rhetorical styles. PNAS 122(8)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11874169/)
- [Peters & Chin-Yee (2025). Generalization bias in large language model summarization of scientific research. Royal Society Open Science](https://pmc.ncbi.nlm.nih.gov/articles/PMC12042776/)
- [ANSI/NISO Z39.14-1997 (R2009) Guidelines for Abstracts](https://www.oregon.gov/ODOT/Programs/ResearchDocuments/Abstract-Guidelines.pdf)
- [Russell et al. (2025). People who frequently use ChatGPT for writing tasks are accurate and robust detectors of AI-generated text. ACL 2025](https://arxiv.org/abs/2501.15654)
