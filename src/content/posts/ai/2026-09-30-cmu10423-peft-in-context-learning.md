---
title: "PEFT與ICL：改參數，還是改輸入｜CMU 10-423 主題單元"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, peft, lora, fine-tuning, in-context-learning, prompt-engineering]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 42
tldr: "你可以讓模型適應新任務而不重訓所有參數，但這句話包含兩種不同做法。LoRA等PEFT方法仍有訓練，少量參數會改變；ICL把示例放進上下文，推論時不因這些示例做參數更新。來源也不只兩堂：第9堂末段已有zero/few-shot，第10堂講PEFT，第11堂接ICL與後續調適。"
description: "你可以讓模型適應新任務而不重訓所有參數，但這句話包含兩種不同做法。LoRA等PEFT方法仍有訓練，少量參數會改變；ICL把示例放進上下文，推論時不因這些示例做參數更新。來源也不只兩堂：第9堂末段已有zero/few-shot，第10堂講PEFT，第11堂接ICL與後續調適。"
draft: false
glossary:
  - term: "PEFT"
    aliases: ["parameter efficient fine-tuning", "參數高效微調"]
    definition: "只微調模型的一小部分參數（或額外加上的少量參數），其餘預訓練權重凍結不動，目標是逼近全參數微調的效果。"
    context: "CMU 10-423 L10 介紹四種做法：只調最上面 K 層、adapter、prefix tuning、LoRA。"
  - term: "prefix tuning"
    definition: "在真實 token 前面假裝多了一串前綴 token，只訓練這些前綴在每一層的 key/value 向量，Transformer 本身的參數全部凍結。"
    context: "L10 的第三種 PEFT 方法；投影片提到用較低維的 MLP 產生前綴參數，是為了讓訓練更穩定。"
    links:
      - label: "Li & Liang 2021"
        url: "https://arxiv.org/abs/2101.00190"
  - term: "in-context learning"
    aliases: ["ICL", "上下文學習"]
    definition: "不更新模型參數，把任務說明與幾組輸入／輸出範例直接放進 prompt，讓 LLM 在生成時從範例推出規律並作答。"
    context: "L10 與 L11 把它當成監督式微調以外的另一種「學習」方式，並比較兩者的優缺點。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu10423-peft-in-context-learning-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

你可以讓模型適應新任務而不重訓所有參數，但這句話包含兩種不同做法。LoRA等PEFT方法仍有訓練，少量參數會改變；ICL把示例放進上下文，推論時不因這些示例做參數更新。來源也不只兩堂：第9堂末段已有zero/few-shot，第10堂講PEFT，第11堂接ICL與後續調適。

## 先讀哪一篇

- [參數高效微調](/posts/ai/2026-10-11-cmu10423-peft)：依該篇的完整例子與答案自我檢查。
- [ICL與提示](/posts/ai/2026-10-11-cmu10423-lecture-11a-in-context-learning)：依該篇的完整例子與答案自我檢查。
- [SFT與RLHF](/posts/ai/2026-10-11-cmu10423-lecture-11b-sft-rlhf)：依該篇的完整例子與答案自我檢查。

總覽的 [課程地圖](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)列出完整核心主線；本篇是主題導覽，不是額外課堂。先選你要回答的問題，再去對應的教學篇。

## 用一個例子看出分界

本站自擬例子：任務是把「好吃」標成正面。ICL輸入先放「難吃→負面，好吃→正面」，再問新句子的標籤；示例用掉上下文，但模型權重保持不變。LoRA則把訓練例的誤差反傳到adapter，之後新請求不一定要重貼示例。假設底座有一個4×4矩陣，rank=1的A為1×4、B為4×1，需要8個adapter參數而非16個完整更新參數；這個節省是此玩具矩陣的結果，不是整個模型的固定比例。

## 自我檢查

不重貼示例後效果仍存在，是否足以證明模型做過LoRA？

<details>
<summary>答案與判準</summary>

不足。可能是原有能力、system prompt、記憶或其他微調。要判定機制需看參數更新與實際請求路徑，不能只靠輸出猜。

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

- [CMU 10-423/623/723 Generative AI（Spring 2026）課程首頁](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [課程講次表](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)——L9–L11 日期、Quiz 2／Quiz 3
- [Lecture 9 投影片：VAEs / In-context learning](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture9-vae-icl.pdf)——zero-shot、few-shot、prompting
- [Lecture 10 投影片：Parameter Efficient Fine-Tuning](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture10-peft.pdf)
- [Lecture 11 投影片：In-Context Learning / Instruction Fine-tuning / RLHF](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture11-ift-rlhf.pdf)
- [Lecture 12 投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture12-dpo-text2img.pdf)——Reminders 頁的 Quiz 3 範圍
- [HW3 handout（hw3.zip）](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw3.zip)——配分表與題目結構
- [Practice Exam（Spring 2026）](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)
- [Hu et al. 2021：LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685)
- [Houlsby et al. 2019：Parameter-Efficient Transfer Learning for NLP](https://arxiv.org/abs/1902.00751)
- [Li & Liang 2021：Prefix-Tuning](https://arxiv.org/abs/2101.00190)
- [Li et al. 2018：Measuring the Intrinsic Dimension of Objective Landscapes](https://arxiv.org/abs/1804.08838)
- [Aghajanyan et al. 2020：Intrinsic Dimensionality Explains the Effectiveness of Language Model Fine-Tuning](https://arxiv.org/abs/2012.13255)
- [Mosbach et al. 2023（ACL Findings）：Few-shot Fine-tuning vs. In-context Learning](https://aclanthology.org/2023.findings-acl.779.pdf)
- [Anyscale 部落格：在 Llama-2 上比較 LoRA 與全參數微調](https://www.anyscale.com/blog/fine-tuning-llms-lora-or-full-parameter-an-in-depth-analysis-with-llama-2)
- [Brown et al. 2020：Language Models are Few-Shot Learners（GPT-3）](https://arxiv.org/abs/2005.14165)
- [Lu et al. 2021：Fantastically Ordered Prompts and Where to Find Them](https://arxiv.org/abs/2104.08786)
- [Min et al. 2022：Rethinking the Role of Demonstrations](https://arxiv.org/abs/2202.12837)
- [Wei et al. 2022：Chain-of-Thought Prompting Elicits Reasoning in Large Language Models](https://arxiv.org/abs/2201.11903)
- [Kojima et al. 2022：Large Language Models are Zero-Shot Reasoners](https://arxiv.org/abs/2205.11916)
