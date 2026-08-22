---
title: "CMU 07-280 Lecture 17：從 Tokenization 到 N-gram Language Model"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cmu, ai-course, natural-language-processing, language-model, n-gram]
lang: zh-TW
tldr: "第 17 講先決定文字如何切成 token，再用 N-gram 把序列機率改寫成可從 corpus 計數的條件機率；tokenization 不是前處理小事，而是模型能看見什麼的第一個設計決定。"
description: "逐段導讀 CMU 07-280 Spring 2026 Lecture 17：corpus、character/word/BPE tokenization、N-gram 與語言模型的機率問題。"
draft: false
series:
  name: "CMU 07-280 完整課程導讀"
  order: 17
---

> 🌏 [English version](/posts/ai/2026-08-22-cmu-07280-lecture-17-ngram-language-models-en)

這是 **CMU 07-280 Spring 2026 Lecture 17** 的逐講導讀。官方投影片封面題為 *Natural Language Processing (NLP): N-gram Language Models*，內容從 corpus、tokenization 一路走到 N-gram 與 language model。這不是現代 LLM 的縮小版介紹，而是在回答更早的問題：文字要先變成什麼，才可能被機率模型處理？

## 官方材料與讀取範圍

本文完整讀取 [Lecture 17 官方投影片](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec17_NLP.pdf)，並用課程首頁與 syllabus 核對 offering。官方頁沒有提供 Spring 2026 的逐講公開錄影，因此本文只解讀投影片可見內容，不補寫講者口述、課堂問答或現場示範結果。

投影片的材料順序是 NLP 任務例子、詞彙定義、tokenization、BPE、language model 應用與 N-gram worksheet。這篇也依同一條主脊展開。

## 承上問題：神經網路吃的是數字，語言卻不是

前一段課程已經建立神經網路、CNN 與訓練流程。把同一套工具搬到文字上，第一個障礙不是網路深度，而是輸入單位：一句話可以切成字元、單字、標點與 subword，每種選擇都會改變 vocabulary 大小、序列長度與未知詞問題。

課程先把幾個詞分開：**corpus** 是用來學習的文字集合；**tokenizer** 把文字切成 tokens；**vocabulary** 是模型可使用的 token 清單；**context** 是預測目前位置時允許看的前文。這四個名詞之後會分別出現在資料、編碼、參數尺寸與條件機率裡。

## 完整概念脈絡：三種 token 粒度的取捨

投影片用 *I am Sam* 的小 corpus 比較三種做法：

- character token 幾乎不會遇到未知詞，vocabulary 小，代價是序列很長；
- word token 讓每一步帶有較完整語意，代價是 vocabulary 大，拼字變化也會製造新詞；
- byte pair encoding（BPE）先從字元開始，反覆把 corpus 中最常共現的相鄰 pair 合併，得到介於字元與單字之間的 subword。

BPE 的關鍵不是「把常見單字收進字典」這句結果，而是那個可重複的過程：初始化字元 vocabulary、重新切分 corpus、計數相鄰 pair、加入最高頻的新 token，再重複。模型的 token 預算因此被資料分布分配：常見片段用較少步表示，罕見詞仍能拆回較小單位。

完成編碼後，language model 的目標才有形式：對 token sequence 指派 joint probability，或在既有 context 下預測下一個 token。投影片以語音辨識說明兩種證據可以相乘：聲學模型回答「聲音像哪個詞」，language model 回答「在 *artificial* 後哪個詞比較合理」。

## 可重做小例子：親手跑兩輪 BPE

取 corpus `low low lower`，先把每個單字拆成字元並保留結尾符號：

```text
l o w </w>
l o w </w>
l o w e r </w>
```

第一輪計數相鄰 pair：`l o` 出現 3 次，`o w` 也出現 3 次。若 tie-break 選 `l o`，新增 token `lo`：

```text
lo w </w>
lo w </w>
lo w e r </w>
```

第二輪 `lo w` 出現 3 次，合併成 `low`。此時 `low` 能以一個 token 表示，`lower` 則是 `low e r`。這個例子同時顯示 BPE 的好處與限制：它學到的是高頻字串片段，不是先驗的語素或語意邊界。

接著做最小 bigram 計數。若 corpus token sequence 是 `<s> I am Sam </s>` 與 `<s> I am here </s>`，則：

\[
P(am\mid I)=\frac{C(I,am)}{C(I)}=\frac{2}{2}=1,
\qquad
P(Sam\mid am)=\frac{1}{2}.
\]

N-gram 的核心近似已經出現：不保留整段無限長歷史，只用最近幾個 token 的計數預測下一步。

## Recitation／HW 對應

Lecture 17 在公開材料中主要是概念與 worksheet 起點；完整 N-gram 計算延續到 Lecture 18。後面的 [Recitation 10](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec10.pdf) 會把 one-token context 改寫成 embedding language model，[HW11](https://www.cs.cmu.edu/~07280/assignments/hw11_blank.pdf) 則進一步要求建立 GPT-2 並檢查 training loss、perplexity 與 generation。

這不是說 Lecture 17 直接教完 GPT-2，而是它決定 HW11 最底層的資料介面：模型看到的是 token index，不是原始字串。正式 notebook、autograder 與成績回饋不等於匿名公開；自學者能重做概念，但沒有完整修課服務。

## 延伸對照：N-gram 與現代 LLM 差在哪裡

N-gram 和 autoregressive transformer 都把 sequence probability 拆成逐 token 的 conditional probabilities。差別在條件如何表示：N-gram 直接以固定長度的離散前綴計數；transformer 用學得的向量與 attention 壓縮較長 context。

因此 N-gram 不是被淘汰後毫無用途的古董。它讓 chain rule、context、sampling 與資料稀疏問題都能在小表格裡看清楚。到了 attention，公式變大，這些問題仍然存在，只是參數化方式不同。

## 今晚可做動作

拿一段 100–300 字的文字，分別用 character、空白切 word、以及你手動做兩輪 BPE 的方式 tokenization。記下每種 vocabulary 大小與 token sequence 長度，再用 bigram counts 產生十個 token。若某個 context 沒在 corpus 出現，先不要偷偷補答案；把它標成 zero-count，留給下一講處理資料稀疏與 sampling。

## 參考資料

- [CMU 07-280 Spring 2026 Lecture 17 slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec17_NLP.pdf)
- [CMU 07-280 official course site](https://www.cs.cmu.edu/~07280/)
- [CMU 07-280 syllabus](https://www.cs.cmu.edu/~07280/07280_syllabus_v1.pdf)
- [CMU 07-280 Recitation 10](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec10.pdf)
- [CMU 07-280 Homework 11](https://www.cs.cmu.edu/~07280/assignments/hw11_blank.pdf)
