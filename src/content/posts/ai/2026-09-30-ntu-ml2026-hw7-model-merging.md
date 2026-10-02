---
title: "李宏毅 ML 2026 HW7：不再訓練，把日文模型和數學模型合成一個會解日文數學題的模型"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-ml-2026, ntu, ai-course, course-guide, model-merging, llm, fine-tuning]
lang: zh-TW
series:
  name: "台大李宏毅 機器學習 2026 Spring 導讀"
  order: 16
tldr: "HW7 給你兩個從 Mistral-7B-v0.1 微調出來的模型：擅長日文的 shisa-gamma-7b-v1 與擅長數學的 WizardMath-7B-V1.1，要你只做參數層級的合併（不准再訓練、不准 MoE 或 ensemble），讓合併後的模型答對助教自出的 20 題日文數學題。Part 1（60%）用 mergekit 調方法、weights 與 density，simple／strong baseline 是正確率 50% 與 75%；Part 2（40%）是 8 題論文選擇題。題目、Colab 與 Kaggle 都公開，但 JudgeBoi 在 2026-09-30 回傳 502、論文題在 NTU COOL 上，校外只能在 notebook 裡自己看正確率。"
description: "台大李宏毅《機器學習 2026 Spring》HW7「Model Merging」導讀，依 hw7.pdf、作業 Colab 與課程頁：兩個 7B 來源模型、20 題需要日本文化知識的日文數學題與答案擷取規則、task vector 觀念、mergekit 的 weights／density、linear／slerp／magnitude prune／DARE／TIES／SCE 逐一比較、Colab 預設設定與禁止事項、評分與繳交，以及校外讀者怎麼自己驗收。"
draft: false
glossary:
  - term: "Task vector"
    aliases: ["任務向量"]
    definition: "微調後模型參數減去 base model 參數得到的差值，代表這次微調學到的能力；多數合併演算法都在這些差值上操作。"
    context: "HW7 的兩個模型都從 Mistral-7B-v0.1 微調而來，所以可以各自算出 task vector 再合併。"
  - term: "Density"
    aliases: ["密度"]
    definition: "mergekit 的參數，表示一個 tensor 裡保留多少比例的數值；其餘被剪掉或歸零。"
    context: "magnitude prune、DARE、TIES、SCE 都要設 density；linear 與 slerp 不用。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-ml2026-hw7-model-merging-en)

**本文依據[台大李宏毅《機器學習 2026 Spring》](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)的 HW7。** 這是[台大李宏毅 機器學習 2026 Spring 導讀](/posts/ai/2026-09-30-ntu-ml2026-course-overview)系列第 16 篇。官方材料有：作業投影片 [hw7.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/hw7.pdf)、[作業 Colab](https://colab.research.google.com/drive/1B9692EHFAZFh5-8Q5LsVhzk9nTH1MEyD)（50 個 cell）、[Kaggle 版](https://www.kaggle.com/code/sylora1101/ml2026hw7)，以及助教的[說明影片](https://youtu.be/YQtwk_L686I)。課程頁寫 5/8 公告、截止 2026/05/28 23:59，助教是黃郁涵、陳思齊、董家愷、吳岳霖（投影片封面列前三位）。投影片註明參考 ML2025 HW9 Model Merging。

存取分級是 **A3 減評分**：題目規格、兩個模型、Colab 與評估程式都公開；排行榜要上傳 [JudgeBoi](https://ml.ee.ntu.edu.tw/home)（2026-09-30 回傳 502），論文題在需要台大帳號的 NTU COOL 上。

## 先備：hw7.pdf 沒有指定，但有一講正好對得上

HW7 投影片沒有列先備影片，本學期也沒有講 model merging 的正課。李宏毅 2025 年的[生成式人工智慧與機器學習導論 第 8 講](https://www.youtube.com/watch?v=EnWz5XuOnIQ)標題就是「通用模型的終身學習（Fine-tuning, Model Editing, Model Merging, Test-Time Training）」，[上一篇 AI 自我成長（上）](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part1)也用這支影片當 TTT 的延伸。要補概念，看這一講最省事。

和[上一份作業 HW6：Model Editing](/posts/ai/2026-09-30-ntu-ml2026-hw6-model-editing) 對照著看會更清楚：HW6 是精準改掉一條知識，HW7 是把兩整組能力疊在一起，兩者都不重新訓練。

## 任務：兩個 7B 模型，一個會日文、一個會數學

投影片的目標寫得很直白：在參數層級合併能力不同的模型，**不額外訓練**，得到一個同時保有日文理解與數學能力的模型。兩個來源模型：

| 模型 | 強項 |
|---|---|
| [augmxnt/shisa-gamma-7b-v1](https://huggingface.co/augmxnt/shisa-gamma-7b-v1) | 日文理解 |
| [WizardLMTeam/WizardMath-7B-V1.1](https://huggingface.co/WizardLMTeam/WizardMath-7B-V1.1) | 數學推理 |

兩個都從 Mistral-7B-v0.1 微調而來。這個組合出自 [Evolutionary Optimization of Model Merging Recipes](https://arxiv.org/abs/2403.13187)（Akiba 等人，Nature Machine Intelligence 2025），投影片把它列為這份作業的來源。

Colab 開頭有三條規則，比投影片更嚴格：

- 只能用上面兩個模型，不能引入第三個。
- 可以用任何套件或自己寫的演算法，不限 mergekit。
- **合併後的總參數量必須和單一 base model 相同**。MoE、ensemble、stacking 這類讓推論時可用參數變多的做法都算違規。

## 評估：20 題需要日本常識的數學題

評估集是助教董家愷自己出的 20 題日文數學題。它們不只是把數學題翻成日文，還需要日本文化背景知識。投影片給的兩個例子：

- 日本的都道府縣裡，扣掉東京都、北海道、京都府、大阪府，「縣」有幾個？
- 太郎平成 5 年出生、次郎令和 2 年出生，太郎比次郎大幾歲？

這正好說明為什麼要合併：數學模型看不懂題目，或不知道平成、令和怎麼換算；日文模型懂題目但算不好。

答案用規則擷取：先找「答え:」或「答え：」後面的數字，找不到就取輸出中最後一個數字。Colab 固定了日文 prompt 模板，最後要求模型以『答え: [数値]』作答，並註明**嚴禁修改**，理由是這份作業考的是合併技術，不是 prompt engineering。notebook 算出的正確率和 JudgeBoi 上的一模一樣。

## 合併演算法：從加權平均到選擇性合併

投影片先定義 model merging：只用參數上的簡單運算，不從頭訓練、也不碰原始訓練資料，就把各來源模型的能力整合進一個模型。並指出不同 task vector 之間的冗餘參數與正負號衝突會造成**參數干擾**，讓合併後表現下降。後面的演算法大多在處理這件事。

mergekit 有三個常用設定：

- **input models／base model**：要合併的來源模型，以及需要時當參考點的 base model
- **weights（α）**：每個模型貢獻多少的係數
- **density（d）**：一個 tensor 裡保留多少比例的數值

投影片介紹的方法：

| 方法 | 要設的參數 | 做法 |
|---|---|---|
| Task Arithmetic／linear | weights | task vector 加權相加；兩個模型時就是 (1−t)A + tB |
| Slerp | weights | 兩個模型權重的球面線性插值 |
| Magnitude Prune | density、weights | 每個 task vector 只留絕對值最大的前 d 比例，再加權相加 |
| [DARE](https://arxiv.org/abs/2311.03099) Linear | density、weights | 隨機把 1−d 比例的數值歸零，剩下的乘 1/d 維持期望值，再加權相加 |
| [TIES](https://arxiv.org/abs/2306.01708) | density、weights | Trim 留前 d 比例、Elect Sign 依加總決定每個參數的正負號、Disjoint Merge 只平均符號一致的值 |
| [SCE](https://arxiv.org/abs/2408.07990) | density | Select 跨 task vector 挑變異最大的前 k 個位置、Calculate 用平方和算每個模型的係數、Erase 剔除少數方向的值 |

SCE 和 TIES 最容易混：TIES 是**每個 task vector 各自**依大小剪枝，SCE 是**跨所有 task vector** 看同一個位置的變異再選。TIES 與 SCE 的出處分別是 NeurIPS 2023 的 TIES-Merging 與 [FuseChat](https://arxiv.org/abs/2408.07990)。

## Colab 的流程與可以動的地方

notebook 分三段：

1. **Section 1：觀察兩個 base model**。各丟一個日文問題與一個英文數學題，再各自跑一次 20 題評估，記下兩個 baseline 正確率。時間不夠可以跳過。
2. **Section 2：合併**。主要修改區是一段 mergekit YAML。說明文字寫「最簡單的 50/50 Linear Merge」，但程式裡的預設其實是 **slerp**：`self_attn` 與 `mlp` 各用一組沿層變化的 `t`，其餘用 0.5，以 shisa 為 base。TODO 建議的方向是調 weight 比例、改用 linear／ties／dare_ties，或對不同 layer 用不同參數。接著用 `mergekit-yaml … --lazy-unpickle --allow-crimes --cuda` 執行。
3. **Section 3：推論**。載入合併後的模型，用同一套 prompt 與擷取規則跑 20 題，輸出 `submission.json`。

投影片估計合併要 0.5–2 小時、推論 20 題要 1–2 小時；Colab 預設用 T4 GPU。每試一組設定都要重跑 Section 2 與 3，所以挑設定要有策略，不能亂槍打鳥。

## 評分與繳交

| 項目 | 條件 | 分數 |
|---|---|---|
| Public Simple Baseline | 日文數學 QA 正確率 ≥ 50% | 2 |
| Public Strong Baseline | 正確率 ≥ 75% | 2 |
| Code Submission | 上傳 NTU COOL | 2 |
| Paper Reading | 8 題，每題 0.5 | 4 |

- **Part 1（60%）**：把 `submission.json` 上傳 JudgeBoi（只收 .json，不能改格式，每天 5 次、23:59 重置）；`.ipynb` 壓成 `<學號>_hw7.zip` 上傳 NTU COOL。排行榜分數必須能用繳交的 notebook 重現，否則不計分，所以要固定 random seed。
- **Part 2（40%）**：在 NTU COOL 答選擇題。投影片寫 5 題是 model merging 基礎觀念，3 題針對 ICLR 2026 的 [LS-Merge: Merging Language Models in Latent Space](https://openreview.net/pdf?id=VSDV0SWwOC)。
- 規定：不准用 GPT-4、Gemini 等閉源 LLM API；不准找額外訓練資料或測試題答案；不准手改輸入或預測檔。不收遲交。

## 校外讀者拿不到的部分

- **JudgeBoi 502**：不能上傳，也看不到排行榜。不過 notebook 自己就會印出和 JudgeBoi 相同的正確率，這份作業的 Part 1 其實能完整自評。
- **論文題**：題目只在 NTU COOL 上，hw7.pdf 裡沒有印出來（這一點和 HW6、HW8 不同）。
- **說明影片**：YouTube 上沒有字幕，本文沒有依影片內容寫作。

**今晚就能做的事**：打開 Colab，先別改任何東西，直接跑預設的 slerp 設定並記下正確率；再把 `merge_method` 換成 `ties`、設一組 weights 與 density，比較兩次結果差在哪幾題。免費 Colab 不保證拿得到 GPU，notebook 也提醒過這一點。

## 想深入

- **論文**：先讀 [Editing Models with Task Arithmetic](https://arxiv.org/abs/2212.04089) 建立 task vector 的觀念，再讀 [TIES-Merging](https://arxiv.org/abs/2306.01708) 看參數干擾怎麼處理；想知道這兩個模型的組合怎麼被找出來，讀 [Evolutionary Optimization of Model Merging Recipes](https://arxiv.org/abs/2403.13187)。
- **工具**：[mergekit](https://github.com/arcee-ai/mergekit) 的 README 列了所有合併方法與參數；Hugging Face PEFT 也有 [model merging 指南](https://huggingface.co/docs/peft/developer_guides/model_merging)。

系列導覽：[系列總覽](/posts/ai/2026-09-30-ntu-ml2026-course-overview)｜上一篇 [AI 自我成長（上）](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part1)｜下一篇 [HW8：Test-Time Scaling](/posts/ai/2026-09-30-ntu-ml2026-hw8-test-time-scaling)

## 參考資料

- [Machine Learning 2026 Spring 課程頁](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) — HW7 公告日、截止時間、助教
- [ML2026 HW7 Model Merging（hw7.pdf）](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/hw7.pdf) — 任務、評估、演算法、評分與規定
- [HW7 Colab](https://colab.research.google.com/drive/1B9692EHFAZFh5-8Q5LsVhzk9nTH1MEyD) — 模型限制、prompt 模板、預設 mergekit 設定
- [HW7 Kaggle 版](https://www.kaggle.com/code/sylora1101/ml2026hw7)
- [HW7 說明影片（YouTube）](https://youtu.be/YQtwk_L686I)
- [JudgeBoi](https://ml.ee.ntu.edu.tw/home)（2026-09-30 回傳 502）
- [【生成式人工智慧與機器學習導論2025】第 8 講：通用模型的終身學習](https://www.youtube.com/watch?v=EnWz5XuOnIQ)
- [augmxnt/shisa-gamma-7b-v1（Hugging Face）](https://huggingface.co/augmxnt/shisa-gamma-7b-v1)
- [WizardLMTeam/WizardMath-7B-V1.1（Hugging Face）](https://huggingface.co/WizardLMTeam/WizardMath-7B-V1.1)
- [Evolutionary Optimization of Model Merging Recipes（arXiv 2403.13187）](https://arxiv.org/abs/2403.13187)
- [Editing Models with Task Arithmetic（arXiv 2212.04089）](https://arxiv.org/abs/2212.04089)
- [Language Models are Super Mario（DARE，arXiv 2311.03099）](https://arxiv.org/abs/2311.03099)
- [TIES-Merging: Resolving Interference When Merging Models（arXiv 2306.01708）](https://arxiv.org/abs/2306.01708)
- [FuseChat: Knowledge Fusion of Chat Models（SCE，arXiv 2408.07990）](https://arxiv.org/abs/2408.07990)
- [LS-Merge: Merging Language Models in Latent Space（OpenReview）](https://openreview.net/pdf?id=VSDV0SWwOC)
- [arcee-ai/mergekit（GitHub）](https://github.com/arcee-ai/mergekit)
- [Hugging Face PEFT：Model merging](https://huggingface.co/docs/peft/developer_guides/model_merging)
