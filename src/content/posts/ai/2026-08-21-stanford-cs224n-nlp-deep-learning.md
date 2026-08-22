---
title: "Stanford CS224N 導讀：打開 2019 年那版課表，Transformer 還排在第 14 堂"
date: 2026-08-21
category: ai
type: deep-dive
tags: [cs224n, ai-course, stanford, nlp, transformer, llm]
lang: zh-TW
series:
  name: "Stanford CS224N 導讀"
  order: 1
additionalSeries:
  - name: "Stanford CS 主線課程導讀"
    order: 12
tldr: "CS224N 把 2000 年以來每一屆的課程網站都留在線上。2019 冬季那版，Transformer 是第 14 堂的客座講題；2026 冬季那版，它是第 5 堂，之後每一堂都預設你已經懂它。機器翻譯作業整個消失了，第三份作業改成自己刻一個 decoder-only Transformer，附 pytest 可以在筆電上跑。"
description: "Stanford CS224N: Natural Language Processing with Deep Learning 完整導讀。逐屆比對 2019、2022、2023、2024、2025、2026 六個版本的課表與作業清單，看同一門課在七年裡砍掉什麼、補進什麼，並逐項確認自學者實際拿得到哪些材料。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning-en)

[CS224N: Natural Language Processing with Deep Learning](https://web.stanford.edu/class/cs224n/) 是 Stanford 電腦科學系的 NLP 主課，也是整條 NLP 分支的樞紐——CS224U、CS224V、CS329A 的官方先修欄位都指回它。它教的是怎麼用神經網路處理語言，從詞向量與反向傳播開始，一路到預訓練、後訓練、推理與評估。

它還有一件別的課做不到的事：**課程網站把 2000 年以來每一屆的版本都留著**。首頁的 Previous offerings 那一區是一長排連結，最舊的一條標著 Spring 2000。這代表你可以把 2019 年冬季那版跟現在這版並排打開——同一門課、同一批投影片檔名慣例、同一間 NVIDIA Auditorium——看它在七年裡砍掉了什麼。

這篇就是做這件事。主軸是逐屆比對課表與作業清單，涵蓋 [Winter 2019](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1194/)、[Winter 2022](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1224/)、[Winter 2023](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1234/)、[Winter 2024](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1244/)、[Spring 2024](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1246/)、[Winter 2025](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1254/) 六個封存版本與現行的 Winter 2026。**不包含**逐堂投影片精讀，也不包含錄影逐字內容——現行這屆的錄影鎖在 Canvas 裡，非選課者拿不到。

課程網站只列出課表與作業，**它從來沒有解釋任何一次改動的理由**。所以底下講的全部是「改了什麼」，不是「為什麼改」。

## 這門課的硬事實

現行是 Winter 2026，授課者兩位：[Diyi Yang](https://cs.stanford.edu/~diyiy/) 與 [Yejin Choi](https://yejinc.github.io/)。每週二、四下午在 NVIDIA Auditorium 上課，助教掛了二十位。

[ExploreCourses 的 CS 224N 條目](https://explorecourses.stanford.edu/search?q=CS+224N&view=catalog)寫的先修是一句話：「calculus and linear algebra; CS124, CS221, or CS229.」它只在冬季開，下一次排在 2026–2027 學年的冬季。

課程網站自己列的先修比較細，分成 Python 流利度、大學微積分與線性代數、基本機率統計、機器學習基礎四項。第四項後面接了一句很少被引用的話：

> 「If you already have basic machine learning and/or deep learning knowledge, the course will be easier; however it is possible to take CS224N without it.」

也就是說機器學習不是硬門檻，只是會比較累。這句話從 2019 年那版一路留到現在，一個字沒改。

四份作業合計佔 48%，剩下的幾乎全在期末專案。

**旁聽的規則跟 CS329A 相反。** CS329A 直接寫不接受旁聽，CS224N 則歡迎 Stanford 社群成員來坐，寫信給課程信箱即可，官網還強烈建議旁聽者把作業全做完。但它同時明講「due to high enrollment, we cannot grade the work of any students who are not officially enrolled」。你可以坐進去，沒有人會改你的東西。

## 主軸：Transformer 從第 14 堂搬到第 5 堂

先看 2019 年冬季那版的課表。那年整學期 20 堂，Transformer 排在**第 14 堂**，而且不是 Manning 自己講，是[客座](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1194/slides/cs224n-2019-lecture14-transformers.pdf)。講者是 Attention Is All You Need 的作者之一 Ashish Vaswani 與 Anna Huang，講題叫「Transformers and Self-Attention For Generative Models」。它夾在 ConvNets for NLP 跟 Natural Language Generation 中間，是一種當時值得請人來介紹的新架構。

同一張課表往回翻，前面十三堂在講這些：詞向量兩堂、word window classification 與矩陣微積分、反向傳播與計算圖、dependency parsing、RNN 與語言模型、vanishing gradient 與 fancy RNN、機器翻譯與 seq2seq＋attention、問答與 SQuAD、ConvNets、subword models、contextual representations 與預訓練。Transformer 之後還有五堂：NLG、coreference、多任務學習、constituency parsing 與 TreeRNN、bias 與 fairness。

現在打開 Winter 2026 的課表。Transformer 是 **[第 5 堂](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture05-transformers.pdf)**，第三週的星期二，由授課者自己講。它前面只剩三堂內容課（History of NLP、Word Vectors、Backpropagation and Neural Network Basics）加一堂 Language Models and RNNs。第 6 堂就是期末專案說明，第 7 堂開始講預訓練。

中間幾屆剛好排出一條連續的線：

| 學期 | Transformer 是第幾堂 | 日期 |
|---|---|---|
| [Winter 2019](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1194/) | 14（客座） | 2 月 21 日 |
| [Winter 2022](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1224/) | 9 | 2 月 1 日 |
| [Winter 2023](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1234/) | 8 | 2 月 2 日 |
| [Winter 2025](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1254/) | 8 | 1 月 30 日 |
| [Winter 2026](https://web.stanford.edu/class/cs224n/) | 5 | 1 月 20 日 |

**這條線是整篇最有用的一件事，因為它決定了前面那些課還值不值得看。** 在 2019 那版，前十三堂是通往 Transformer 的路；在 2026 那版，通往 Transformer 的路只有三堂，剩下的十四堂全部建在 Transformer 之上。

## 被砍掉的那半個學期

把 2019 與 2026 兩張課表逐列對照，消失的講次是這一批：word window classification、dependency parsing、vanishing gradient 與 fancy RNN、機器翻譯與 seq2seq、問答與 SQuAD、ConvNets for NLP、subword models、natural language generation、coreference resolution、multitask learning、constituency parsing 與 tree recursive neural networks。

其中有幾條的消失時間點可以查得很準：

- **Coreference resolution** 最後一次出現在 Winter 2023 的第九週。Winter 2024 與 Spring 2024 的課表都沒有它。
- **ConvNets、TreeRNN 與 constituency parsing** 合成一堂，撐到 Spring 2024 的第 16 堂，之後不見。
- **機器翻譯**在 Spring 2024 還是獨立一堂，標題是 Sequence to Sequence Models and Machine Translation，排在第三週。Winter 2026 的課表上一堂都沒有。

RNN 的收縮也很具體。2019 年 RNN 佔兩堂，語言模型一堂、vanishing gradient 與 LSTM 一堂。2026 年剩[一堂](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture04-rnnlm.pdf)，標題是 Language Models and RNNs，而且它的建議閱讀清單裡直接就掛著 Attention Is All You Need。詞向量同樣從兩堂變一堂。

補進來的是：Pretraining（Scaling, Systems, Data）、Post-training（RLHF、SFT、DPO）、Efficient Adaptation（Prompting 與 PEFT）、Agents/Tool Use/RAG、Benchmarking and Evaluation、Reasoning 兩堂、Tokenization 與多語言、可解釋性、多模態，以及一堂 [John Schulman](http://joschu.net/) 講 Tinker 與 LoRA。

有一件事跟「刪掉舊東西」的敘事相反，值得單獨記：**Winter 2026 新增了一堂「History of NLP」，而且排在第一堂。** 網站上這一堂掛了兩份投影片，intro 與 history 各一份，建議閱讀是 Manning 在 Daedalus 上那篇 [Human Language Understanding & Reasoning](https://www.amacad.org/publication/daedalus/human-language-understanding-reasoning)。2025 那版的第一堂是 Word Vectors，沒有這一堂。課程沒有說明為什麼加。

## 作業：從自己刻 word2vec 到自己刻 Transformer

作業清單的改版比課表更乾脆，因為每一屆的百分比都寫在網頁上。

| 學期 | 作業 | 預設期末專案 |
|---|---|---|
| [Winter 2019](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1194/) | 五份（54%）：詞向量／word2vec 導數與實作／dependency parsing／NMT seq2seq＋attention／NMT ConvNet＋subword | SQuAD 2.0 問答 |
| [Winter 2022](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1224/) | 五份（54%）：前四份同上，A5 改成 Transformer 自監督與微調 | SQuAD 2.0 問答 |
| [Winter 2023](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1234/) | 五份（54%），與 2022 相同 | minBERT |
| [Winter 2024](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1244/) | 五份（54%），與 2022 相同 | minBERT |
| [Spring 2024](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1246/) | 四份（48%）：A2、A3 合併成「神經網路基礎、張量微分、dependency parsing」 | minBERT |
| [Winter 2025](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1254/) | 四份（48%）：A3 是 NMT，A4 是 Transformer 自監督與微調 | minGPT-2 |
| [Winter 2026](https://web.stanford.edu/class/cs224n/) | 四份（48%）：A3 是 Self-Attention and Transformers，A4 是 LLM 評估 | minGPT-2 |

兩個轉折點看得很清楚。**第一個在 Spring 2024**：作業從五份減成四份，砍掉的方式是把 word2vec 那份與 dependency parsing 那份併起來。**第二個在 Winter 2026**：機器翻譯作業消失，位置給了 Transformer，而最後一份作業不再是「訓練一個模型」，是「評估一個模型」。

四份作業的 handout 全部公開，直接從課程網站下載，不需要登入。逐份看過之後：

- **[A1](https://web.stanford.edu/class/cs224n/assignments_w26/a1.zip)（6%）**：一本 Jupyter notebook，共現矩陣、SVD、用 gensim 玩詞向量。暖身用，難度最低。
- **[A2](https://web.stanford.edu/class/cs224n/assignments_w26/a2.pdf)（14%）**：handout 的標題是「Word2Vec and Dependency Parsing」。第一部分是 naive softmax 損失的偏微分推導，第二部分講 Adam 與 dropout，第三部分用 PyTorch 實作一個神經 dependency parser 並分析錯誤剖析結果。**注意 word2vec 這一半現在只剩數學**——2019 年那份是要你把演算法寫出來的。
- **[A3](https://web.stanford.edu/class/cs224n/assignments_w26/a3.pdf)（14%）**：**這份是分水嶺。** 前 20 分是紙筆題：attention 的複製行為、單頭 attention 的極限、把序列做置換後證明輸出也跟著置換（所以需要位置編碼）。後 30 分是「Coding a transformer from scratch」——實作一個 decoder-only、GPT-2 風格的 Transformer 加訓練迴圈。handout 原話是「code a transformer (almost) from scratch, and start training it on your laptop」。
- **[A4](https://web.stanford.edu/class/cs224n/assignments_w26/a4.pdf)（14%）**：三部分。用字串比對在 GSM8k 上跑標準 benchmark 並自己設計更好的 prompt、用 LLM-as-judge 在 Alpaca Eval 上算勝率、最後一部分是 red-team 一個模型讓它違反自己的 system prompt。

A4 有一個自學者會撞到的硬限制：它要求學生**用 GCP 額度去呼叫模型 API**，handout 第一題就是「Claiming GCP Credits（0 points）」，額度由課程提供。你可以照著做，但錢要自己出。

## 為什麼別的課都接回這裡

CS224N 是 NLP 分支的樞紐，這件事在 ExploreCourses 的先修欄位裡有原文可對：

- **[CS 224U: Natural Language Understanding](https://explorecourses.stanford.edu/search?q=CS+224U&view=catalog)**：「Prerequisites: CS 224N or CS 224S (This is a smaller number of courses than previously.)」括號那句是官方自己加的，代表它縮減過可接受的先修清單。
- **[CS 224V: Agentic AI](https://explorecourses.stanford.edu/search?q=CS+224V&view=catalog)**：「Prerequisites: one of LINGUIST 180/280, CS 124, CS 224N, CS 224S, or CS 224U.」
- **[CS 329A: Self-Improving AI Agents](https://explorecourses.stanford.edu/search?q=CS+329A&view=catalog)**：「Prerequisites: CS224N or CS229S; Fluency in Python programming and using large language model APIs.」

**這三條的嚴格程度不一樣，排計畫的時候要分清楚。** CS224U 幾乎只有 CS224N 一條路（另一條是語音課 CS224S）；CS329A 的另一個選項 CS229S 已經停開兩年；CS224V 則給了五個選項，CS224N 只是其中之一，CS124 也算數。也就是說「CS224N 是進階 NLP 課的必經之路」這個講法對 CS224U 成立，對 CS224V 不成立。

站內的 [CS329A 深度導讀](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents)拆過那門課的內容；整條階梯的排序見[系列入口地圖](/posts/learning/2026-08-20-stanford-cs-course-map)。

## 自學者實際拿得到什麼

逐項講，拿得到與拿不到分開列。

**拿得到：現行這屆的投影片。** Winter 2026 的每一堂投影片都掛在課程網站上，`slides_w26/` 底下，公開直連。

**拿得到：現行這屆的四份作業。** 四份 handout 與程式碼壓縮檔全部公開。而且 A3 的壓縮檔裡有 `pytest.ini`、`tests/test_student.py` 與一整組 `.npy` 快照檔——**每個子題都有可以在自己筆電上跑的單元測試**。這是自學者最缺的東西：一個不需要助教就能給出對錯的評分器。handout 明講「we have included unit tests for each sub problem that can run locally on your laptop」。對比 2019 年那版：A5 的程式碼標著「requires Stanford login」，另外掛一個閹割過的 public version；A4 要你去申請 Azure 虛擬機。

**拿得到：2019 年那屆的逐堂錄影，而且跟投影片對得起來。** 封存的 [Winter 2019 課表](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1194/)每一列都有 slides、video、notes 三個連結並排，[公開播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOhcuXMZkNm7j3fVwBBY42z)裡 20 堂一堂不缺（結尾另外補了兩支 2020 年的）。想看 Transformer 剛進課綱時怎麼被介紹的，直接點第 14 堂那一列——那支只有 54 分鐘，是整屆最短的一堂。

**拿得到：Spring 2024 的完整錄影。** 公開播放清單標題是「Spring 2024 I Professor Christopher Manning」，那是 Manning 親自上完的一屆。要注意兩件事：清單裡從 Lecture 16 直接跳到 Lecture 18，中間那堂沒有上架；結尾補了兩支 2023 年的客座（Douwe Kiela 的多模態、Been Kim 的可解釋性）。

**拿不到：Winter 2026 的錄影。** 網站原話是「it is not possible to make these videos viewable by non-enrolled students」。這屆新增的 History of NLP、Reasoning 兩堂、Agents/RAG 那堂，都只有投影片沒有影片。

**拿不到：作業與專案的分數。** 全部走 Gradescope，非選課者進不去。A3 的單元測試是唯一的例外。

**拿不到：期末專案的算力。** 現行這屆的算力由 Google、Kimi、Modal、Qwen 贊助給選課學生。

有一個落差值得寫下來：**公開的完整錄影是 Spring 2024，公開的投影片與作業是 Winter 2026，中間隔了三次改版。** 影片裡有機器翻譯專堂、有 ConvNets 與 TreeRNN，而現行作業裡一份都沒有。拿影片當唯一教材，會學到一份已經被課程自己下架的課綱。

## 怎麼開始

今晚就能做的一件事：把 [A3 的壓縮檔](https://web.stanford.edu/class/cs224n/assignments_w26/a3.zip)下載下來，`pip install -r requirements.txt`，然後在什麼都還沒寫的狀態下跑一次 `pytest`。你會看到一整排紅字，每一條對應 Transformer 的一個部件——attention、MLP、decoder block、forward、loss、generate。**那排紅字就是你的進度條。** 把它們一條一條變綠，你就有一個 decoder-only Transformer 了，全程不需要 GPU。

先讀 handout 第三題再動手，它給的提示（用 assert 檢查張量形狀）不是客套話。

如果你想先看課再做作業，順序建議是：先看 Spring 2024 錄影的第 1、3、5 講把詞向量與反向傳播補起來，然後**直接跳到 Winter 2026 的投影片**從第 5 堂 Transformer 往下讀。中間那幾堂 2024 版的 RNN 與機器翻譯可以略過——課程自己已經略過了。

## 附錄：數字與查證方式

- **學分與開課**：ExploreCourses 顯示 CS 224N 為 3–4 學分、Terms: Win，2026–2027 學年的 Winter 排在課表上，PI 欄位列的是 Hashimoto, T. 與 Yang, D.。現行 Winter 2026 的課程網站列的授課者是 Diyi Yang 與 Yejin Choi——兩者指的是不同學年，不是矛盾。
- **評分比重（Winter 2026）**：作業 48%（A1 6%、A2–A4 各 14%）、期末專案 49%（proposal 8%、milestone 6%、poster 3%、report 32%）、參與 3%。2019 那屆是作業 54%（A1 6%、A2–A5 各 12%）、專案 43%、參與 3%。
- **遲交規則**：每人 6 個 late day，單份作業最多用 3 個；用完之後每多遲一天扣總成績 1%。2019 那版的罰則是「每多一天扣該份作業的 10%」，2022 那版起改成扣總成績 1%。
- **封存網址學期代碼**：`cs224n.1194` = Winter 2019、`1224` = Winter 2022、`1234` = Winter 2023、`1244` = Winter 2024、`1246` = **Spring** 2024、`1254` = Winter 2025。末碼 2=秋、4=冬、6=春。2023–24 學年開了兩次（冬季與春季），Winter 2024 的網站首頁自己寫了這件事。
- **講次總數**：Winter 2019 課表列出 20 堂編號講次；Winter 2026 的投影片檔名編到 `lecture19`，其中四堂是客座（tokenization 與多語言、可解釋性、多模態、Tinker 與 LoRA）。
- **A4 handout 的內部矛盾**：檔案第一頁的標題行寫「CS 224N Winter 2025 Assignment 4」，但每一頁的頁首寫的是 Winter 2026，截止日期（2 月 19 日星期四）與 Winter 2026 課表一致。Winter 2025 的 A4 是 Transformer 自監督與微調、2 月 13 日截止，所以標題行是複製時留下的舊字串。
- **未能確認**：課程網站沒有公開任何一屆的選課人數，也沒有說明任何一次課綱改動的理由——「為什麼砍掉機器翻譯」「為什麼加一堂 NLP 歷史」在一手材料上查不到答案，本篇不做推測。Winter 2020、Winter 2021、Winter 2017 等其餘封存版本我沒有逐一打開，所以上面的「最後一次出現」判斷只在我實際比對過的六個版本範圍內成立。

## 參考資料

- [CS224N 課程官網（Winter 2026）](https://web.stanford.edu/class/cs224n/) — 現行課表、四份作業配分、旁聽與錄影政策、歷屆網站索引
- [CS224N Winter 2019 封存網站](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1194/) — 20 堂課表、五份作業、Transformer 為第 14 堂客座、A5 需 Stanford 登入
- [CS224N Winter 2022 封存網站](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1224/) — Transformer 移到第 9 堂、coreference 與 ConvNets 仍在、遲交罰則改版
- [CS224N Winter 2023 封存網站](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1234/) — 最後一堂 coreference、預設專案改為 minBERT
- [CS224N Winter 2024 封存網站](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1244/) — 2023–24 學年開兩次的公告、投影片版權註記
- [CS224N Spring 2024 封存網站](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1246/) — 作業從五份減成四份、仍有機器翻譯與 ConvNets 講次
- [CS224N Winter 2025 封存網站](https://web.stanford.edu/class/archive/cs/cs224n/cs224n.1254/) — A3 仍是 NMT、預設專案改為 minGPT-2
- [CS224N Spring 2024 公開錄影播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOaMFbaqxPDoLWjDaRAdP9D) — 清單標題標明講者為 Manning、Lecture 16 之後跳號、結尾補兩支 2023 客座
- [CS224N Winter 2019 公開錄影播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOhcuXMZkNm7j3fVwBBY42z) — 20 堂完整、與封存課表逐堂對得起來，第 14 堂即 Vaswani 與 Huang 的 Transformer 客座
- [Winter 2026 Assignment 2 handout](https://web.stanford.edu/class/cs224n/assignments_w26/a2.pdf) — word2vec 只剩導數推導、dependency parser 實作
- [Winter 2026 Assignment 3 handout](https://web.stanford.edu/class/cs224n/assignments_w26/a3.pdf) — attention 紙筆題、位置編碼證明、從零刻 decoder-only Transformer
- [Winter 2026 Assignment 3 程式碼](https://web.stanford.edu/class/cs224n/assignments_w26/a3.zip) — 內含 pytest 設定與快照測試
- [Winter 2026 Assignment 4 handout](https://web.stanford.edu/class/cs224n/assignments_w26/a4.pdf) — GSM8k benchmark、LLM-as-judge、red teaming、GCP 額度要求
- [ExploreCourses: CS 224N](https://explorecourses.stanford.edu/search?q=CS+224N&view=catalog) — 官方先修原文、學分、開課學期
- [ExploreCourses: CS 224U](https://explorecourses.stanford.edu/search?q=CS+224U&view=catalog) — 先修「CS 224N or CS 224S」
- [ExploreCourses: CS 224V](https://explorecourses.stanford.edu/search?q=CS+224V&view=catalog) — 先修五選一，CS224N 只是其中之一
- [ExploreCourses: CS 329A](https://explorecourses.stanford.edu/search?q=CS+329A&view=catalog) — 先修「CS224N or CS229S」
- 站內：[Stanford CS329A 深度導讀](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents)
- 站內：[Stanford CS 課程導讀地圖](/posts/learning/2026-08-20-stanford-cs-course-map)
