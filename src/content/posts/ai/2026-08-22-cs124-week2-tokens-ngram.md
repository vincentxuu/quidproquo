---
title: "CS124 Week 2 Words, Tokens, Edit Distance, and N-grams：LLM 之前先決定模型看見什麼"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, nlp, tokenization, language-model]
lang: zh-TW
series: { name: "Stanford CS124 導讀", order: 3 }
tldr: "Week 2 把文字處理拆成三層：以 BPE 建立 token 詞彙、以動態規劃求最小編輯距離，再以 n-gram 近似序列機率；PA1 把正規表示式與 BPE 變成可執行作業。"
description: "Stanford CS124 Winter 2026 Week 2 逐週筆記：斷詞、BPE、最小編輯距離、n-gram 語言模型、Lab 1 與 PA1。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs124-week2-tokens-ngram-en)

CS124 Week 2 回答一個比「用哪個模型」更早的問題：模型到底看見什麼？官方 agenda 依序是 words and tokenization、minimum edit distance、n-gram language modeling，再用 Unix text-processing Lab 1 與 PA1 把概念變成資料處理流程。

**課程版本：** Winter 2026。**官方單元：** Week 2，2026-01-13、01-15。**講師／活動：** Dan Jurafsky 預錄主題；Lab 1 與 NumPy tutorial。**公開材料：** [schedule](https://web.stanford.edu/class/cs124/lec/)、[token slides](https://www.stanford.edu/class/cs124/lec/tokens_jan26.pdf)、[edit-distance slides](https://www.stanford.edu/class/cs124/lec/med25.pdf)、[n-gram slides](https://www.stanford.edu/class/cs124/lec/lm_jan25.pdf)、[Lab 1](https://www.stanford.edu/class/cs124/lec/Lab1_UnixText_2026_upload.pdf)、[PA1](https://github.com/cs124/pa1-regular-expressions)。指定閱讀是課綱鎖定的 SLP3 August 2025 release，Chapter 2 pp.1–32 與 Chapter 3 pp.1–14。**缺口：** Canvas 旁白與 Gradescope Quiz 1 不公開；本文不能聲稱重現影片中的例子順序或測驗內容。

## 詞不是天然存在的欄位

公開 [Words and Tokens slides](https://www.stanford.edu/class/cs124/lec/tokens_jan26.pdf) 從「一句話有幾個 words」開始。標點算不算？`I'm` 是一個正字法單位，還是代名詞與動詞兩個語法單位？口語中的 `uh` 與半截詞怎麼算？中文、日文與泰文又沒有一致的空白界線。這些例子要破除的直覺是：斷詞不是把字串照空白切開，而是替下游任務選擇計算單位。

[Words and Tokens slides](https://www.stanford.edu/class/cs124/lec/tokens_jan26.pdf) 用 type 與 instance 區分詞彙表中的種類與語料中的出現次數。語料越大，觀察到的 word types 越多；若把每個完整單字都放進固定 vocabulary，拼字變化、新詞與多語言很快造成稀疏問題。

## BPE 在字元與單字之間找折衷

Byte Pair Encoding 從較小單位開始，反覆合併語料中最常一起出現的相鄰 pair。它不需要先相信「正確單字邊界」只有一套，也不必把每個可能單字納入詞彙表。常見片段可成為較長 token，罕見字串仍能拆成已知片段。

這個折衷有成本。token 並不等於語言學上的 word 或 morpheme；同一字串可能因前置空白、大小寫或語料統計而有不同切法。模型上下文長度計的是 tokens，也因此不能把「一千個 token」直接理解成固定的一千個字或詞。

[PA1](https://github.com/cs124/pa1-regular-expressions) 把 BPE 與 regular expressions 放在一起，原因很實際：真正的 tokenizer 在統計合併前仍需要清理、匹配與切分字串。作業 repo 明確要求先讀 Week 2 slides、Lab 1 與 SLP3 Chapter 2 的相關段落，而不是只套一個現成 tokenizer。

## 編輯距離把相似度變成最短路徑

公開 [Minimum Edit Distance slides](https://www.stanford.edu/class/cs124/lec/med25.pdf) 將 Minimum edit distance 定義為把一個字串轉成另一個字串所需的最小 insertion、deletion 與 substitution 成本。它可以用來做拼字校正，也能比較語音辨識假設與 reference transcript，或對齊生物序列。

直接枚舉所有編輯序列會爆炸。[Minimum Edit Distance slides](https://www.stanford.edu/class/cs124/lec/med25.pdf) 把問題寫成 `D(i,j)`：來源前 `i` 個符號與目標前 `j` 個符號的最小距離。每個格子只需要比較從插入、刪除、替換／匹配而來的最佳前綴結果。這是動態規劃的核心：不同路徑會抵達同一個子問題，只保留其中最便宜的一條。

成本設計決定「相似」的意思。若 substitution 成本設為二，它等價於一次 deletion 加 insertion；若各操作成本都是一，替換會更便宜。演算法沒有替應用決定價值判斷，它只忠實最小化你給的成本。

## N-gram 用有限歷史近似語言

公開 [N-gram slides](https://www.stanford.edu/class/cs124/lec/lm_jan25.pdf) 將 language model 定義為對下一個 token 給出機率分布，也可為整段序列指定機率。完整條件機率需要考慮所有先前歷史，但即使巨大語料也看不到所有可能句子。n-gram 的做法是作 Markov approximation：只保留最近的 `n-1` 個 token。

bigram 估計 `P(w_i | w_{i-1})`，trigram 估計 `P(w_i | w_{i-2}, w_{i-1})`。整句機率用 chain rule 拆解，再把每一項替換為有限歷史的估計。`n` 增大時上下文更具體，計數也更稀疏；`n` 變小時資料較充足，卻丟掉長距離依賴。這是 Week 2 第一個明確的 bias–variance 式取捨。

零次計數不表示語言上不可能，只表示訓練語料沒看到。這也是 smoothing 必須存在的理由：把少量機率權重留給未見事件，而不是讓含一個未見 n-gram 的整句機率直接歸零。

## 三段 agenda 其實是一條資料管線

tokenization 定義狀態空間；edit distance 衡量兩個序列如何對齊；n-gram 對序列延續性建模。Lab 1 再要求用 Unix text tools 操作語料，PA1 則把正規表示式與 BPE 交付為程式。這不是四個互不相干的小技巧，而是從原始字串、相似度到機率模型的第一條完整 NLP pipeline。

本週最小練習：手算一組字串的 DP table，再用小語料做三輪 BPE merge，最後列出一個 bigram count table。若只能呼叫函式卻無法說明 vocabulary、cost 與 context window 如何改變結果，就還沒有完成本週的核心。

## Tokenization slides 裡的多語言問題

[Words and Tokens slides](https://www.stanford.edu/class/cs124/lec/tokens_jan26.pdf) 用中文例子「姚明進入總決賽」展示 word segmentation 並非唯一答案。Chinese Treebank、其他標註規範與純字元切分可得到不同數量的 tokens。這不是某一套標註一定錯，而是每套規範選擇了不同分析單位。模型若用字元，序列較長但幾乎沒有 out-of-vocabulary character；若用較長詞單位，序列縮短，卻要面對新詞與切分歧義。

[Words and Tokens slides](https://www.stanford.edu/class/cs124/lec/tokens_jan26.pdf) 接著用 Shakespeare、Brown Corpus、Switchboard、COCA 與 Google N-grams 說明 corpus 越大，word types 仍持續增加。這是採 subword units 的第二個理由：問題不只在沒有空白的語言，即使英文也會因名稱、拼字、屈折變化與新造詞不斷擴張 vocabulary。

BPE 的手算流程可以忠實重現課堂概念。先把每個 training word 拆成基本 symbols 並保留 word boundary，計算所有相鄰 pairs 的頻率；選最高頻 pair 合併，更新 corpus representation，再重算下一輪。merge rules 的順序就是 tokenizer model 的一部分。只保存最後 vocabulary、不保存 ordered merges，無法重建相同 encoding。

遇到頻率 tie 時，實作還需要 deterministic tie-breaking。課堂小例子可能不在意，PA 或 production tokenizer 卻會因此產生不同 vocabulary。自學紀錄應寫清楚排序規則與 preprocessing，否則兩次「同樣 BPE」仍可能無法對齊。

## Edit distance recurrence 要逐格說得出來

對來源 `X[1..n]` 與目標 `Y[1..m]`，DP matrix 邊界是 `D(i,0)` 等於刪除前 `i` 個 symbols 的成本，`D(0,j)` 等於插入前 `j` 個 symbols 的成本。內部格子比較三條來源：`D(i-1,j)+del`、`D(i,j-1)+ins`、`D(i-1,j-1)+sub/match`。

只得到 `D(n,m)` 還不完整。若保存每格選到的 predecessor，就能 backtrace 一條 minimum-cost alignment，看到哪裡發生 insertion、deletion、substitution。語音辨識的 word error analysis 需要這條 alignment，不只需要一個總距離；同樣的 distance 可能由完全不同錯誤組成。

[Minimum Edit Distance slides](https://www.stanford.edu/class/cs124/lec/med25.pdf) 比較 reference 與兩個 speech hypotheses，正是在示範 alignment 如何讓錯誤可分類。若 substitution 設為二，某些 path 會改用 insertion 加 deletion；若設為一，直接替換較便宜。報告 edit distance 時必須連 cost scheme 一起報，否則數字不可比較。

時間與空間複雜度也來自 matrix。完整表需要 `O(nm)` 時間與空間；只求距離可保留相鄰 rows 降低空間，但若要 alignment 就仍需 backpointers 或其他重建策略。這個取捨是 Week 2 從公式走向實作的關鍵。

## N-gram 的 boundary、unknown 與 smoothing

整句機率需要 sentence boundary symbols。加入 `<s>` 讓模型學句首可能出現什麼，加入 `</s>` 讓不同長度句子有終止機率。若沒有終止符，模型只對 token transition 建模，沒有完整描述「一句話在這裡結束」。

訓練與測試 vocabulary 也必須固定。測試時出現 unseen word，不能臨時新增一個沒有 counts 的 type；常見做法是在訓練階段把低頻詞映射到 `<UNK>`，讓模型學到 unknown token 的機率。何時替換、threshold 多大，會同時改變 vocabulary size 與 evaluation。

maximum-likelihood bigram probability 以 count ratio 估計。若某個 bigram 沒看過，它得到零，整句連乘也成零。add-one smoothing 把每個可能 continuation 加一，概念容易但會把太多 mass 移給大量未見事件；更好的方法會依 counts-of-counts、discounting 或 lower-order distribution 重新分配。Week 2 指定閱讀只需要建立「零計數不等於不可能」與 smoothing 的必要性，不需把後續所有方法混進這篇。

perplexity 將測試序列平均負 log probability 轉回指數尺度。只有 tokenizer、vocabulary、test set 與 boundary handling 相同時才適合比較。用不同 tokenization 的模型直接比 perplexity，分母中的 prediction steps 已不同，結論會失真。

## Lab 1 與 PA1 的 exercise-level 完成證據

[Lab 1 slides](https://www.stanford.edu/class/cs124/lec/Lab1_UnixText_2026_upload.pdf) 把 Unix text processing 放在 n-gram 與資料準備前面。可公開投影片採「題目後一頁通常是解答」的形式，[課表](https://web.stanford.edu/class/cs124/lec/)還特別提醒先做再翻頁。自學證據不該只是看完 PDF，而應保存實際 command、輸入與 output，再與 solution 對照差異。

[PA1 repo](https://github.com/cs124/pa1-regular-expressions) 明列 Week 2 slides、Lab 1 與 SLP3 Chapter 2 sections 為前置材料。clone、啟動 `cs124` conda environment、開 `pa1.ipynb` 只是取得作業；真正內容在 notebook 的 regex 與 BPE exercises。完成時至少保存 unit tests／公開 checks、最後 merge rules，以及一個 tokenizer 失敗案例。

可以刻意測三種輸入：未在 training corpus 出現的新名字、含縮寫與標點的英文、沒有空白的中文片段。重點不是宣稱這份 PA tokenizer 已解決多語言，而是看清它在哪些 preprocessing assumptions 下工作。

## 延伸

現代 LLM tokenizer 規模與實作比課堂小例子大得多，但同一個問題仍在：表示單位會改變序列長度、罕見字處理與跨語言成本。延伸時應比較 tokenizer 的實際 vocabulary 與 encoding，而不是把「subword」當成單一固定演算法。

## 參考資料

- [CS124 Winter 2026 schedule](https://web.stanford.edu/class/cs124/lec/)
- [Words and Tokens slides](https://www.stanford.edu/class/cs124/lec/tokens_jan26.pdf)
- [Minimum Edit Distance slides](https://www.stanford.edu/class/cs124/lec/med25.pdf)
- [N-gram Language Modeling slides](https://www.stanford.edu/class/cs124/lec/lm_jan25.pdf)
- [Lab 1: Unix Text Processing](https://www.stanford.edu/class/cs124/lec/Lab1_UnixText_2026_upload.pdf)
- [CS124 PA1](https://github.com/cs124/pa1-regular-expressions)
