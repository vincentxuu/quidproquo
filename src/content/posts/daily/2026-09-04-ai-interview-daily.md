---
title: "AI Engineer 面試日練 — 2026-09-04：Coding"
date: 2026-09-04
category: daily
type: digest
tags: [ai-engineer-interview, daily, coding]
lang: zh-TW
description: "今日練 ML coding 面試：徒手實作 BPE tokenizer 的合併邏輯與 encode/decode 對稱性,搭配 building blocks 徒手寫、batch inference 取捨、NumPy 向量化三個核心概念。"
tldr: "ML coding 面試考的不是背 LeetCode 樣板,而是能不能用 NumPy 徒手寫出 building blocks(linear、residual、layer norm、causal self-attention)並且看得懂別人的訓練/推論迴圈在哪裡壞掉。今天聚焦四個概念:coding 面試的真正考點是徒手實作能力而不是背答案;BPE tokenizer 的核心是「頻率統計 → 迭代合併 → 用同樣的合併順序 encode」,順序錯了 encode 就會跟 decode 對不上;batch inference 的吞吐量/延遲取捨要處理不同長度序列的 padding 與浪費運算;NumPy 向量化的判斷依據是「這段迴圈裡有沒有跨元素依賴」。練習題是 Glean 技術篩選常出的題目:實作一個 BPE tokenizer,走一遍從訓練到 encode/decode 的完整思路。"
series:
  name: "AI Engineer 面試日練"
  order: 16
---

> 🌏 [English version](/en/posts/daily/2026-09-04-ai-interview-daily-en)

## 今日主題

Coding 面試在 AI Engineer 的面試流程裡,已經跟三年前很不一樣了。以前考的是「你會不會實作 KNN、跑一次 gradient descent」,現在更常見的是給一段訓練或推論的程式碼,要你抓出哪裡壞了,或是要你徒手寫出一個模型的 building block——linear layer、residual connection、layer norm、causal self-attention——完全不能靠 Google 查 API 語法。

今天不練通用的資料結構與演算法,而是練這種「ML/NLP 味」的 coding 題:徒手實作一個 tokenizer,順便釐清 training 和 encode 這兩個階段各自要處理的細節。這種題型常出現在 LLM infra、search、或平台工程團隊的技術篩選,考的是你對「文字怎麼變成模型看得懂的 token」有沒有紮實的底層理解,而不是只會呼叫 `tokenizer.encode()`。

## 核心概念速記

### ML coding 面試考的是徒手實作能力,不是背答案模板

現在的 ML coding 面試常見兩種形式:給一段模型程式碼(model class、training loop、inference loop)要你抓出效能或正確性的 bug,或是要你用 NumPy/PyTorch 徒手寫出常見架構(MLP、CNN、RNN、Transformer encoder/decoder)和它們的組成元件(linear、projection、residual connection、layer norm、batch norm、causal self-attention、bidirectional self-attention、activation function、optimizer)。很多候選人把時間花在讀懂題目給的程式碼、或是查 NumPy/PyTorch 語法上,結果沒時間真正 debug 或實作。面試官要看的訊號是:你對這些「深度學習原語」熟不熟到可以直接手寫,而不是熟到「看得懂別人寫的」。

### BPE Tokenizer 的核心邏輯:頻率統計、迭代合併、encode 順序要跟訓練一致

Byte-Pair Encoding 的訓練過程,是把語料庫裡每個詞拆成字元序列,統計所有「相鄰符號對」出現的頻率,把頻率最高的那一對合併成一個新符號,重複這個過程直到達到目標詞彙量。這個訓練過程會產生一份「合併順序表」(merge list)。這題最容易出錯的地方在 encode 階段:遇到新字串時,不能直接查「哪些子字串在最終詞彙表裡」就貪心切,而是必須照著訓練時學到的合併順序,一步一步套用同樣的合併規則——順序錯了,同一個字串可能被切成不同的 token 序列,encode 出來的結果跟 decode 就對不起來。

### Batch Inference 的吞吐量/延遲取捨與 padding 浪費

把多筆請求湊成一批一起跑模型,可以大幅提高 GPU 利用率、拉高吞吐量,這是生產環境常見的優化,面試也常把它包裝成「怎麼設計一個 batch inference 函式」的 coding 題。核心難處在於同一批裡的序列長度通常不一樣,要嘛 padding 到批次內最長的長度(但短序列上會浪費運算,還要搭配 attention mask 蓋掉 padding 位置),要嘛用 bucketing 把長度相近的請求分到同一批減少浪費。這題背後真正考的是「你知不知道 batch size 拉大不是免費的午餐」——延遲會因為要湊滿一批而變高,這是吞吐量換來的代價,面試時要能講出這個取捨,而不是只會說「batch 越大越快」。

### NumPy 向量化的判斷依據:這段迴圈裡有沒有跨元素依賴

面試官很愛在給的程式碼裡藏一段用 Python for 迴圈跑的運算,考你會不會用 broadcasting 改寫成向量化版本。判斷能不能向量化的關鍵問題是:「這次迭代的計算,需不需要用到上一次迭代算出來的結果?」如果每個元素的計算彼此獨立(例如逐元素的加總、正規化、element-wise 相乘),幾乎都能用 broadcasting 一次算完;但如果像 RNN 的 hidden state 遞迴、或是 BPE 训练裡的迭代合併,本質上是序列依賴的,就沒辦法簡單向量化,這時候面試該講的是怎麼用其他方式優化(例如用 heap 維護頻率排序,而不是每輪重新掃描一次全部的 pair)。

## 今日練習題

### 題目

「請實作一個 Byte-Pair Encoding(BPE)tokenizer:給定一組語料庫和目標合併次數,訓練出合併規則;再用學到的合併規則對新字串做 encode 和 decode,確保兩者可以還原回原始字串。」

**來源**：Glean《Software Engineer》技術篩選面試題（PracHub 面試題庫收錄）　**難度**：中等　**環節**：Technical Screen

### 拆解思路

1. **先釐清問題**：面試時先確認幾件事會讓後面的實作方向完全不同——目標詞彙量怎麼定義(合併次數本身,還是包含初始字元表的總詞彙量)?需不需要處理詞邊界(每個詞結尾加一個特殊符號,避免跨詞合併)?字串裡出現訓練時沒見過的字元怎麼辦(要不要退化成 byte-level 保底)?這些邊界條件不問清楚,寫出來的函式簽名可能整個要重改。

2. **建立框架**：把問題拆成兩個獨立階段來想,而不是想成一個函式——train 階段輸入語料庫、輸出一份「合併順序表」;encode/decode 階段輸入合併順序表和一個字串,套用相同規則做雙向轉換。這樣拆分之後,train 的複雜度問題(要不要優化頻率統計的效率)和 encode 的正確性問題(合併順序有沒有跟訓練一致)可以分開處理,不會互相干擾。

3. **深入核心**:整題最容易出 bug 的地方是 encode 階段——很多人會忍不住用「詞彙表裡有沒有這個子字串」去貪心比對,而不是照著訓練時的合併順序逐步套用。這樣寫出來的結果在大部分測試案例可能剛好符合預期,但遇到合併順序有交錯關係的字串就會出錯,因為 BPE 的合併順序本質上是有依賴關係的:後面學到的合併規則,可能是建立在前面合併規則產生的新符號上。次要的技術難點是效率:naive 版本每次合併都要重新掃描整個語料庫統計 pair 頻率,面試時如果被追問優化,可以講用一個 pair 頻率的 hash map 搭配 lazy 更新,合併發生時只更新受影響的詞,而不是整個重算。

4. **收尾**:用一句話收斂——「BPE 的訓練和 encode 是同一套規則的兩種套用方式,train 決定了規則和它們的順序,encode 必須完全照那個順序重放,少了這個對稱性,tokenizer 就不是一個可逆的轉換。」這句話點出為什麼這題不是單純的字串處理題,而是在考「你有沒有理解訓練出來的產物(merge list)本身帶有順序這個隱藏狀態」。

### 範例回答（面試時可以這樣講）

> 我會先把問題拆成 train 和 encode/decode 兩個階段分開設計。**Train 階段**:先把語料庫裡每個詞拆成單一字元的序列,結尾加一個 `</w>` 符號標記詞邊界,避免合併規則跨到下一個詞;然後用一個 hash map 統計所有相鄰符號對的加權頻率(用詞在語料庫裡的出現次數當權重,不是每個詞只算一次),每一輪取出頻率最高的那一對合併成新符號,同時把這個合併規則記進一份有順序的 merge list,重複到達到目標合併次數為止。
>
> **Encode 階段**是最容易出錯、也最該講清楚的地方:拿到新字串後,先拆成單一字元加上詞邊界符號,然後嚴格按照 merge list 的順序,每一條規則都掃過一次整個符號序列,只要找到符合當前規則的相鄰符號對就合併,直到跑完整份 merge list。這裡的關鍵是「順序」——不能用「詞彙表裡有這個子字串就切」的貪心邏輯,因為後面學到的合併規則有可能建立在前面合併產生的新符號上,順序錯了同一個字串會被切成不同的 token,decode 回去也對不上原字串。
>
> 效率上,naive 訓練版本每一輪都要重新掃描整個語料庫統計頻率,對大語料庫是 O(合併次數 × 語料庫大小),如果面試官追問怎麼優化,我會提用一個優先佇列維護 pair 頻率,每次合併只更新受影響的少數幾個詞的頻率,而不是整個重算——這是生產級 tokenizer(像 GPT-2 的 byte-level BPE)實際會做的優化方向。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 主動釐清詞彙量定義、詞邊界符號、未見字元的處理方式 | |
| 把問題拆成 train 和 encode/decode 兩個獨立階段 | |
| 講出 encode 必須嚴格按照訓練時的合併順序套用,而不是貪心比對詞彙表 | |
| 提到加權頻率統計(用詞出現次數當權重,不是每個詞算一次) | |
| 討論 naive 版本的效率問題與可能的優化方向(優先佇列、lazy 更新) | |
| 加分：連結到生產級 tokenizer 的 byte-level fallback 設計(避免 OOV) | |

## 延伸閱讀

- [Implement a Byte Pair Encoding (BPE) Tokenizer — PracHub](https://prachub.com/interview-questions/implement-a-byte-pair-encoding-bpe-tokenizer) — 今天練習題的原始出處,Glean 的 Software Engineer 技術篩選題目
- [MLE Interview 2.0: Research Engineering and Scary Rounds — Yuan Meng](https://www.yuan-meng.com/posts/mle_interviews_2.0) — 深入拆解現在的 ML coding 面試在考什麼:徒手寫 building blocks、debug 別人的訓練/推論程式碼
- [Deep-ML — Practice Machine Learning](https://www.deep-ml.com/) — 免費的 ML coding 題庫平台,可以照分類(NumPy、Deep Learning、NLP)持續練習徒手實作

## 參考資料

- [Implement a Byte Pair Encoding (BPE) Tokenizer — PracHub](https://prachub.com/interview-questions/implement-a-byte-pair-encoding-bpe-tokenizer) — 今日練習題完整來源與難度/環節標註
- [MLE Interview 2.0: Research Engineering and Scary Rounds — Yuan Meng](https://www.yuan-meng.com/posts/mle_interviews_2.0) — 核心概念速記第一段「ML coding 面試考的是徒手實作能力」段落的依據
- [Python Developer Interview Questions 2026 — KORE1](https://www.kore1.com/python-developer-interview-questions) — Batch inference 段落中「延遲/吞吐量取捨」與生產環境考量的佐證
