---
title: "模型成績單怎麼看：Benchmark、Arena 排名、還有那些數字背後的陷阱"
date: 2026-08-26
category: ai
type: deep-dive
tags: [benchmark, evaluation, mmlu, chatbot-arena, llm-evaluation, ai-model, perplexity]
lang: zh-TW
series:
  name: "認識 AI 模型"
  order: 10
tldr: "模型發布時貼的 benchmark 數字有三個常見陷阱：只秀贏的（cherry-picking）、訓練資料混入考題（contamination）、大家都考 90 分以上就沒鑑別力（saturation）。Arena（原 Chatbot Arena）的真人盲測投票，題目最難被事先背下來，但它有自己的偏誤：廠商可以私下測多個版本，只公開最好的那個。"
description: "LLM 評估入門：MMLU、HumanEval、GSM8K 等常見 benchmark 各測什麼、Arena 真人投票排名能補上什麼又有哪些偏誤，以及讀 benchmark 表格要注意的三個陷阱。"
draft: false
glossary:
  - term: "MMLU"
    def: "Massive Multitask Language Understanding，涵蓋 57 個學科的選擇題 benchmark，測模型的廣泛知識"
  - term: "Chatbot Arena"
    def: "匿名模型對戰平台，真人盲測投票，再用 Bradley-Terry 模型把投票算成分數與名次。起於 UC Berkeley 的 LMSYS 研究計畫，2025 年起由 Arena Intelligence 公司經營，2026 年改名 Arena"
---

> :globe: [English version](/posts/ai/2026-08-26-understanding-ai-models-evaluation-en)

每次有新模型發布，你一定會看到一張表格：一堆縮寫排成行列，每格填著百分比數字，然後發布者把自己最高的那幾格用粗體標出來。「我們在 MMLU 上拿了 90.2%！」「GSM8K 達到 95.1%！」

但這些數字到底在說什麼？你該相信嗎？

## 為什麼需要考試

你用 ChatGPT 寫了一段程式碼，感覺不錯。你又用 Claude 寫了同一段，也感覺不錯。哪個比較好？

「感覺」沒辦法規模化。你可能只試了一個任務，而且你的判斷會受到很多因素干擾——排版好看的回答看起來就比較厲害，先看到的那個會被拿來當基準。

Benchmark 的存在就是為了解決這個問題：**用標準化的題目，讓不同模型在同一份考卷上作答，產生可以比較的分數**。就像大學入學考試——不完美，但至少每個人考的是同一套。

## 三種評估方法

模型評估大致分成三個層級，各有不同的用途。

### 1. Perplexity：模型的「內部成績」

在[第四篇](/posts/ai/2026-08-26-understanding-ai-models-loss-function)討論 loss function 時，我們提過 perplexity。它衡量的是模型預測下一個 token 時有多「困惑」——perplexity 為 10 表示模型平均在 10 個選項間猶豫。

Perplexity 的好處是不需要額外的測試題目，直接用一段文本就能算。但它有個根本限制：**它只告訴你模型預測文字的能力，不告訴你模型能不能解數學題、寫程式、或回答歷史問題**。一個 perplexity 很低的模型，可能只是很會預測常見句型，碰到推理題照樣翻車。

所以業界需要更具體的考試。

### 2. Benchmark：標準化考試

這是你在模型發布頁面最常看到的東西。每個 benchmark 設計來測一種特定能力：

| Benchmark | 測什麼 | 形式 |
|-----------|--------|------|
| **MMLU** | 廣泛知識（57 學科） | 四選一選擇題 |
| **HellaSwag** | 常識推理 | 句子接龍選擇題 |
| **ARC** | 科學推理（小學到國中程度） | 選擇題 |
| **GSM8K** | 數學應用題（國小程度） | 生成答案 |
| **HumanEval** | 程式碼生成（Python） | 寫出能通過測試的函式 |
| **MATH** | 高中到大學數學 | 生成答案 |

這些 benchmark 各有分工。MMLU 像是通識考試，看模型知道多少東西；GSM8K 看模型能不能一步步算數學；HumanEval 看模型寫的程式碼能不能跑。

分數通常是正確率——答對幾題除以總題數。數字越高越好。

### 3. Human Preference：真人盲測投票

Benchmark 有個根本問題：它測的是「標準答案」，但現實中很多任務沒有標準答案。你問模型「幫我寫一封道歉信」，哪個版本比較好？這沒有選擇題可以評分。

**[Arena](https://arena.ai)**（原名 Chatbot Arena，起於 UC Berkeley 的 LMSYS 研究計畫，現在由 Arena Intelligence 公司經營）用了一個簡單的方法：讓真人盲測。使用者輸入一個問題，系統同時把問題送給兩個匿名模型，使用者看到兩個回答後投票選比較好的那個。使用者不知道自己在跟哪個模型對話。

大量投票累積下來，平台用 Bradley-Terry 模型（早期用西洋棋的 Elo，現在仍常被叫成 Elo 分數）算出每個模型的分數和信賴區間。**分數越高，表示真人投票時越常選它的回答**。

這個方法最大的優勢：**題目不在廠商手上**。傳統 benchmark 的題目是固定、公開的，廠商可以針對題目優化，甚至不小心把題目混進訓練資料。Arena 的題目來自全球使用者，每天都不一樣，沒辦法事先背下來。

但它有自己的偏誤。第一，廠商可以在發布前私下測很多個版本，只公開分數最好的那個：[The Leaderboard Illusion](https://arxiv.org/abs/2504.20879) 統計到 Llama 4 發布前一個月，最多有 27 個 Meta 模型在平台上私測。從一堆有雜訊的分數裡挑最高的，期望值一定偏高。Arena [回應](https://arena.ai/blog/our-response)說所有廠商都能這樣測；之後平台替匿名測試過的模型加上「preliminary」標記，發布後收夠新的投票才拿掉（[changelog](https://arena.ai/company/leaderboard-changelog)），但沒有禁止只公開最好的那個。

第二，真人投票會被回答的風格影響，回答越長越容易被選；平台現在預設顯示[控制風格後](https://arena.ai/blog/style-control)的分數。

所以 Arena 量的是「真人在日常提問上比較常選誰」。它補得上 benchmark 量不到的東西，但它的分數一樣要先弄清楚是怎麼算出來的，才能拿來比。

## 怎麼讀 Benchmark 表格

現在你打開一篇模型發布部落格，看到一張表格。行是模型，列是 benchmark，每格是分數。看起來很客觀。但你需要注意三個陷阱。

### 陷阱一：Cherry-Picking（只秀贏的）

每個模型都有強項跟弱項。發布者會選擇展示自己分數最高的幾個 benchmark，跳過表現差的。

假設 A 模型在 MMLU 上贏了 B 模型，但在 HumanEval 上輸了。A 模型的發布頁面只會放 MMLU 的比較表，HumanEval 那欄直接消失。

**怎麼辨識**：看表格裡包含了哪些 benchmark。如果某個常見的 benchmark 明顯缺席，問自己：是因為不相關，還是因為分數不好看？

### 陷阱二：Contamination（訓練資料混入考題）

這是最嚴重的問題。模型的訓練資料通常是從網路上爬下來的大量文本。如果 benchmark 的題目出現在訓練資料裡，模型等於是看過考卷才去考試——分數自然高，但不代表它真的學會了。

實際案例：有研究者發現某些模型在 MMLU 上拿到很高的分數，但把題目的選項順序打亂之後，正確率就暴跌。這強烈暗示模型記住了答案的位置，而不是真的理解問題。

**怎麼辨識**：如果一個模型在某個 benchmark 上的分數遠高於同等規模的其他模型，但在功能相近的其他 benchmark 上沒有同樣的優勢，就需要懷疑 contamination。

### 陷阱三：Saturation（考試太簡單）

當大多數模型在某個 benchmark 上都拿到 90% 以上，這個 benchmark 就失去了鑑別力。就像一場考試所有人都考 95 分——你沒辦法從中看出誰真的比較厲害。

HellaSwag 就是一個典型的例子。幾年前它是區分模型能力的重要指標，但現在主流模型幾乎都超過 95%，差異只剩小數點後面的噪音。

**怎麼辨識**：如果表格裡某一列的數字全部擠在 90% 到 98% 之間，那一列的數字基本上可以忽略。

## 實際建議

1. **不要只看一個 benchmark 選模型**。每個 benchmark 測的是不同能力。你的應用場景最接近哪個 benchmark，那個分數才值得參考。要寫程式？看 HumanEval。要做通識問答？看 MMLU。

2. **把 Arena 當成 benchmark 的對照，不是裁判**。它的題目來自真人、持續更新，最難被事先背下來，適合拿來檢查「benchmark 分數高的模型，用起來是不是也被偏好」。看名次時先看信賴區間有沒有重疊，新上榜的模型留意有沒有「preliminary」標記。

3. **自己的 eval 最重要**。Benchmark 告訴你模型的一般能力，但你的應用有自己的特殊需求。花時間建一套自己的測試題，用你自己的資料、你自己的任務來比較模型，比盯著公開 benchmark 有用得多。

4. **注意發布時間**。Benchmark 分數會隨時間膨脹——新的訓練技巧、更大的資料集、甚至 contamination 都會推高分數。跨越不同月份或年份的分數不能直接比較。

## 下一篇

我們已經知道怎麼評估模型了。但到目前為止，我們討論的模型都是先訓練好、再拿來用。現實中還有一個關鍵步驟：[fine-tuning](/posts/ai/2026-08-26-understanding-ai-models-finetuning-vs-rag)——拿已經訓練好的模型，再用特定資料微調，讓它專精某個領域。

## 更新紀錄

- 2026-11-24：改寫 Arena 段落與實際建議第 2 點。平台已改名 Arena、由公司經營，計分方式更正為 Bradley-Terry 模型；拿掉「最抗操弄」的說法，補上私測挑最佳與風格偏誤。標題、tldr、description、術語同步更新，並補上對應參考資料。更深入的討論見〈[benchmark 分數能信多少](/posts/ai/2026-11-24-understanding-benchmarks-overview)〉系列。

## 參考資料

- Hendrycks, D. et al. (2021). [Measuring Massive Multitask Language Understanding](https://arxiv.org/abs/2009.03300). ICLR 2021.
- Zellers, R. et al. (2019). [HellaSwag: Can a Machine Really Finish Your Sentence?](https://arxiv.org/abs/1905.07830) ACL 2019.
- Cobbe, K. et al. (2021). [Training Verifiers to Solve Math Word Problems](https://arxiv.org/abs/2110.14168). arXiv:2110.14168.
- Chen, M. et al. (2021). [Evaluating Large Language Models Trained on Code](https://arxiv.org/abs/2107.03374). arXiv:2107.03374.
- Chiang, W. et al. (2024). [Chatbot Arena: An Open Platform for Evaluating LLMs by Human Preference](https://arxiv.org/abs/2403.04132). arXiv:2403.04132.
- Singh, S. et al. (2025). [The Leaderboard Illusion](https://arxiv.org/abs/2504.20879). arXiv:2504.20879.
- Arena. (2025). [Our Response to 'The Leaderboard Illusion' Writeup](https://arena.ai/blog/our-response).
- Arena. (2024). [Does Style Matter? Disentangling style and substance in Chatbot Arena](https://arena.ai/blog/style-control).
- Arena. (2026). [LMArena is now Arena](https://arena.ai/blog/lmarena-is-now-arena).
- Arena. [Leaderboard Changelog](https://arena.ai/company/leaderboard-changelog).
- Oren, Y. et al. (2024). [Proving Test Set Contamination in Black-Box Language Models](https://arxiv.org/abs/2310.17623). ICLR 2024.
