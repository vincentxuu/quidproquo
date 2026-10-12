---
title: "Transformer、訓練與解碼：三個不同問題｜CMU 10-423 主題單元"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, cmu, ai-course, transformer, self-attention, language-model, tokenization, decoding]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 35
tldr: "同樣一份歷史文字，模型怎麼讀、怎麼學、怎麼抽下一個token，是三個問題。注意力決定資訊如何混合；訓練目標用正確答案改參數；解碼策略在固定模型下選輸出。原本把第2–3堂合在一起，容易讓讀者以為換解碼策略就是換模型。這篇保留主題關係，完整機制與練習分開讀。"
description: "同樣一份歷史文字，模型怎麼讀、怎麼學、怎麼抽下一個token，是三個問題。注意力決定資訊如何混合；訓練目標用正確答案改參數；解碼策略在固定模型下選輸出。原本把第2–3堂合在一起，容易讓讀者以為換解碼策略就是換模型。這篇保留主題關係，完整機制與練習分開讀。"
draft: false
glossary:
  - term: "causal mask"
    aliases: ["causal attention", "因果遮罩"]
    definition: "在 attention 的 softmax 之前，把每個 query 右邊（未來時間步）的分數設成負無限大，讓模型預測下一個 token 時看不到答案。"
    context: "CMU 10-423 第 2 講用矩陣 M 表示：對角線與左下為 0，右上為 −∞。"
  - term: "ancestral sampling"
    aliases: ["祖先取樣"]
    definition: "從語言模型生成時，每一步依模型給的機率隨機挑下一個 token。只要分布是逐步正規化的，這樣取出的整條序列機率就等於它的總機率，是精確的取樣方法。"
    context: "CMU 10-423 第 3 講拿它和只挑最可能 token 的 greedy decoding 對比。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu10423-transformer-lm-decoding-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

同樣一份歷史文字，模型怎麼讀、怎麼學、怎麼抽下一個token，是三個問題。注意力決定資訊如何混合；訓練目標用正確答案改參數；解碼策略在固定模型下選輸出。原本把第2–3堂合在一起，容易讓讀者以為換解碼策略就是換模型。這篇保留主題關係，完整機制與練習分開讀。

## 先讀哪一篇

- [因果注意力](/posts/ai/2026-10-11-cmu10423-lecture-02-causal-attention)：依該篇的完整例子與答案自我檢查。
- [訓練與解碼](/posts/ai/2026-10-11-cmu10423-lecture-03-training-decoding)：依該篇的完整例子與答案自我檢查。
- [現代Transformer](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa)：依該篇的完整例子與答案自我檢查。

總覽的 [課程地圖](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)列出完整核心主線；本篇是主題導覽，不是額外課堂。先選你要回答的問題，再去對應的教學篇。

## 用一個例子看出分界

本站自擬例子：固定下一token分布為A=0.6、B=0.3、C=0.1。Greedy選A；top-p=0.8先取A與B，重新正規化後為2/3與1/3，再抽樣。若temperature=0.5，機率與原機率的平方成比例，得到約0.783、0.196、0.022。這些結果來自同一個模型輸出，沒有做反向傳播，也沒有更新權重。注意力則在這個分布產生以前，處理歷史token的表示。

## 自我檢查

把top-p改成0.5會留下哪些候選？這會改變模型的訓練loss嗎？

<details>
<summary>答案與判準</summary>

只保留A，因為最高機率已超過門檻；抽樣分布成為A=1。固定模型與訓練資料下，解碼設定不會改變原訓練目標的loss；生成結果及由它算的評估可能改變。

</details>

## 怎麼使用這張地圖

先不看答案，用自己的話指出輸入、被改動的部分與輸出，再到上面的教學篇完成變式。如果把兩種機制混在一起，回到資料流，找出哪一步的條件不同。這篇只驗關係與分界；不能用它代替各堂的推導、實作或評估。

本文沿用Spring 2026公開教材；自擬例子不是官方考題或課堂口述。原課程錄影仍須依授權存取。

## 課程影片來源

[Spring 2026 官方課站](https://www.cs.cmu.edu/~mgormley/courses/10423/)將錄影導向 SCS Panopto。2026-10-12 匿名讀取回傳資料夾未載入與登入提示，未取得可播放的課堂內容；這是存取限制，不能推論沒有錄影。本文依公開文字教材整理，沒有重建未取得的課堂口述或提供原音逐字稿。

- [官方錄影資料夾](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)

## 更新紀錄

- 2026-10-11：重整教學範圍、完整例子與理解檢查，保留原網址及發文日期。

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。確認登入牆屬實（匿名開啟 Panopto 資料夾無影片並提示登入），官方頁面也沒有公開 YouTube 版本，狀態維持不變。

## 參考資料

- [CMU 10-423/623/723 課程首頁（Spring 2026）](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)：L2、L3 日期與 readings
- [Lecture 2 投影片：Transformer Language Models](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture2-transformer.pdf)
- [Lecture 3 投影片：Learning Large Language Models](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture3-llms.pdf)
- [Lecture 3 投影片（手寫註記版）](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture3-llms-ink.pdf)
- [Goodfellow, Bengio & Courville, Deep Learning, Chapter 10](http://www.deeplearningbook.org/contents/rnn.html)：L2 指定 10.10–10.12（LSTM 與其他 gated RNN）
- [Vaswani et al. (2017), Attention Is All You Need](https://arxiv.org/abs/1706.03762)
- [Alammar (2018), The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/)
- [Graves (2014), Generating Sequences With Recurrent Neural Networks](https://arxiv.org/pdf/1308.0850.pdf)
- [Mikolov et al. (2010), Recurrent neural network based language model](https://pdfs.semanticscholar.org/bba8/a2c9b9121e7c78e91ea2a68630e77c0ad20f.pdf)
- [Radford et al. (2018), Improving Language Understanding by Generative Pre-Training（GPT-1）](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf)
- [Radford et al. (2019), Language Models are Unsupervised Multitask Learners（GPT-2）](https://d4mucfpksywv.cloudfront.net/better-language-models/language-models.pdf)
- [Practice Exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf) 與 [Solutions](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf)
