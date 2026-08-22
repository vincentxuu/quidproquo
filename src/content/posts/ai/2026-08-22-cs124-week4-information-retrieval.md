---
title: "CS124 Week 4 Information Retrieval：從倒排索引、tf-idf 到 RAG 的檢索底座"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, information-retrieval, rag, nlp]
lang: zh-TW
series: { name: "Stanford CS124 導讀", order: 5 }
tldr: "Week 4 從倒排索引建立候選集，以 tf-idf 與 cosine similarity 排序，再把檢索結果接到生成模型；PA3 要求實作的不是聊天介面，而是 RAG 前半段可檢查的搜尋核心。"
description: "Stanford CS124 Winter 2026 Week 4：information retrieval、倒排索引、tf-idf、cosine ranking、RAG、Lab 3 與 PA3。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs124-week4-information-retrieval-en)

Week 4 把「模型知道什麼」改寫成「系統去哪裡找」。官方課表直接把指定章節叫做 *Information Retrieval and Retrieval-Augmented Generation*：先建立傳統搜尋引擎的 index 與 ranking，再看檢索如何替生成模型提供外部證據。

**版本：** CS124 Winter 2026。**單元：** Week 4，2026-01-27、01-29。**活動：** Information Retrieval Canvas material；1 月 27 日 Lab 3。**公開材料：** [schedule](https://web.stanford.edu/class/cs124/lec/)、[SLP3 Chapter 11](https://web.stanford.edu/~jurafsky/slp3/11.pdf)、[Lab 3](https://github.com/cs124/labs/blob/main/Lab3_InformationRetrieval.md)、[solutions](https://github.com/cs124/labs/blob/main/Lab3_InformationRetrieval_Solutions.md)、[PA3](https://github.com/cs124/pa3-information-retrieval)。**缺口：** Canvas 影片與 Gradescope Quiz 3 gated；主站 Chapter 11 是 2026-08 更新版，不能把其中所有新增段落都歸給 1 月課堂。本文聚焦課表、lab 與 PA 都共同支持的 retrieval pipeline。

## 檢索從候選集開始，不是從 LLM 開始

指定的 [SLP3 Chapter 11](https://web.stanford.edu/~jurafsky/slp3/11.pdf) 說明：給定查詢 `q` 與文件集合，系統先要快速找出可能相關的文件。若每次查詢都掃過所有文件，成本會隨 corpus 線性增加。倒排索引把方向反過來：對每個 term 記錄它出現在哪些 documents。查詢進來時，讀取 posting lists 並做交集或聯集，就能建立候選集。

index 建置依賴 Week 2 的 tokenization。大小寫正規化、標點、stemming、stop words 都會改變 posting lists。這再次說明前處理不是附帶步驟：切詞不同，後面的搜尋空間就不同。

## tf-idf 同時衡量局部重要與全域稀有

term frequency 表示某詞在文件中出現多少；document frequency 表示它橫跨多少文件。常見功能詞即使在單篇出現多次，辨識力仍低。inverse document frequency 對廣泛出現的詞降權，對較稀有的詞升權。

tf-idf 把兩者相乘，得到 query 與 document 的向量。cosine similarity 比較夾角，避免只因長文件含有更多詞就全面占優。這個 ranking 不理解句子真值，卻提供可追蹤的分數：哪個 query term、哪個 document term、哪個權重推高結果，都可檢查。

## 評估搜尋要分 precision 與 recall

檢索不是只看第一名「感覺不錯」。precision 衡量取回文件中有多少 relevant；recall 衡量所有 relevant 文件中找回多少。搜尋引擎常關心排名前段，因此還需要 precision@k、平均 precision 或其他 rank-aware metric。

候選階段通常偏向 recall，避免相關文件根本沒進 ranking；後段 reranking 再追求 precision。若只報一個總分，容易掩蓋「找不到」與「排序錯」兩種不同故障。

## RAG 把檢索變成生成的輸入

生成模型的參數可以記住訓練中見過的資訊，但資料有時間界線，也可能生成無來源支持的內容。Retrieval-Augmented Generation 先用 query 找 passages，再把結果放入生成上下文。檢索器決定模型能看到哪些外部證據，生成器再決定如何組織答案。

這不是「接上向量資料庫就完成」。tokenization、chunking、index、query formulation、ranking 與 context packing 都會改變結果。若 retrieval miss，生成器再強也拿不到正確段落；若取回互相衝突的來源，系統還需處理出處與時間。

Week 4 的安排刻意先教稀疏檢索。它讓學生有一個可手算、可 debug 的基準，再理解 dense retrieval 改變了 representation，沒有取消候選、排序與評估三個問題。

## Lab 3 與 PA3 把搜尋核心攤開

Lab 3 提供問題與公開 solutions，PA3 repo 則要求學生 clone notebook 實作 information retrieval。自學時最有價值的做法是先不看 solution，建立一個五篇短文件的小 corpus：產生 inverted index、計算 tf-idf、用 cosine 排序兩個 queries，再逐項說明 top result 為什麼上升。

接著故意加入一個同義詞查詢。如果稀疏模型完全找不到語義相近但字面不同的文件，就得到一個真實 failure case。dense embeddings 可改善詞彙落差，但也需要新的可解釋與評估工具。比較應從同一 corpus、同一 relevance judgments 開始，而不是只看 demo。

## 倒排索引裡實際保存什麼

最小 posting 只保存 document IDs，足以回答 Boolean AND／OR query。若要計算 term frequency，posting 還要存每篇文件的 count；若要 phrase query，還需保存 positions。索引越豐富，query 能力越強，storage 與建置成本也越高。

建立 index 時先為每篇 document 指定穩定 docID，再依 tokenizer 產生 terms，將 postings 依 docID 排序。AND query 可以用雙指標線性合併兩份 sorted lists，而不是把兩份結果轉成任意集合後再掃。若某 term 的 posting list 特別短，先處理它也能更快縮小多詞 query 的 candidates。

phrase query 不能只知道 `new` 與 `york` 都在同一篇文件，還要確認 positions 相鄰。proximity query 則允許距離小於某個 window。這些需求再次把 Week 2 tokenization 拉回來：hyphen、apostrophe、大小寫與 stop-word removal 會改變 position stream。

索引還需要 document statistics，例如 document length 與 corpus document count，才能做 normalization 和 IDF。若 corpus 更新，IDF 也會變；線上系統要決定何時重建、如何合併 segments，以及 query 時讀哪個版本。CS124 小作業不必實作完整 production index，但應保存 corpus version，讓分數可重現。

## 手算 tf-idf 才看得見 ranking

建立三篇短文件與一個兩詞 query，就能把 ranking 拆開。先計算每詞在各 document 的 TF，再由 DF 得 IDF，最後形成 query 與 document vectors。dot product 顯示共有 terms 的貢獻；除以兩個 vector norms 後，cosine 將長度效果納入。

若 query term 在每篇文件都出現，IDF 接近零，它幾乎無法區分結果。若某稀有詞只出現在一篇，它會有較大權重。這不是說罕見詞必定更重要，而是 tf-idf 將 corpus-wide rarity 當辨識訊號。拼錯字、亂碼或專有名詞也會稀有，因此 ranking 仍需資料清理與其他 signals。

score breakdown 應保留到 term level。當 top result 不合理時，可以問是 TF 過高、IDF 過高、query normalization、document length，還是 tokenizer 造成 mismatch。只有最後一個 cosine number，會把所有原因壓平。

## Retrieval evaluation 需要 judgments 與 query set

relevance 不是文件自身固定屬性，而是相對於 query 與 information need。建立 evaluation set 時，每個 query 應有可接受 relevant documents；若 judgments 不完整，系統找回一篇未標註但其實有用的文件，precision 會被低估。

precision@k 關心前 `k` 個結果，recall 關心涵蓋度。Mean Reciprocal Rank 特別重視第一個 relevant result 的位置；Average Precision 會整合多個 relevant documents 出現的排名。選 metric 要配合任務，不是把所有數字都報一遍。

還要將 query types 分組，例如 exact fact、broad topic、rare entity、synonym mismatch。aggregate metric 可能在熱門 queries 很好，卻完全找不到 rare entities。error slice 讓 index 或 ranking 修改對準問題。

評估改動時固定 corpus、queries、judgments 與 metric implementation。一次只改一個主要因素，例如 tokenizer、TF scaling 或 IDF；同時換三項即使分數上升，也無法知道哪個改動有效。

## Chapter 11 如何把 retrieval 接到 generation

Chapter 11 從 information need、factoid questions 與 web retrieval 開始，再說明 LLM 可直接從 parameters 生成答案，但參數知識有更新與來源限制。retrieval 提供外部 text，使回答可依當下 corpus 與可引用 passages 建立。

RAG pipeline 至少可分 query processing、candidate retrieval、ranking、context selection、generation。每層都應保存 artifact：normalized query、candidate IDs 與 scores、送入 context 的 passages、最後 answer 與 citations。若只保存 answer，hallucination 發生時無法判斷是沒有取回、選錯 passage，還是 generator 忽略證據。

chunking 是把 document 轉成 retrievable units。chunk 太短可能失去上下文，太長則將無關內容塞入 context 並減少可放單元數。overlap 可保留跨邊界資訊，也會增加 index size 與重複結果。這些不是框架預設值能替所有 corpus 決定的參數。

生成端還要區分「答案沒有 source support」與「source 本身錯」。citation 能改善 traceability，卻不自動保證 passage 品質。Chapter 11 的 retrieval-to-RAG 路線應保留這個分層，而不是把 RAG 簡化成「LLM 變得不會 hallucinate」。

## Lab 3／PA3 的可重現交付

公開 [Lab 3](https://github.com/cs124/labs/blob/main/Lab3_InformationRetrieval.md) 題目與 solutions 允許先盲做再對帳。保留 query、手算 postings、tf-idf term contributions 與預期 ranking；若和 solution 不同，逐步找 tokenizer、log base、normalization 或排序 tie-break。

[PA3 README](https://github.com/cs124/pa3-information-retrieval) 指定 Week 4 videos/slides/readings 與 Lab 3 為前置。clone repo、啟動 notebook 之後，至少對三種 queries 建 failure log：exact lexical match、同義但無共同詞、常見詞過多。再把 solution code 的結果和手算小 corpus 對齊。

完成證據應包含 index statistics、query set、top-k results、metric 與 error slices。這套資料到 production RAG 仍直接可用，比展示一段成功問答更能證明 retrieval layer 的品質。

## 延伸

想把本週接到 production RAG，第一個動作不是挑框架，而是保留一組查詢、relevant passages 與失敗分類。先讓 retrieval evaluation 可重跑，再換 chunking 或 embedding；否則每次「感覺變好」都無法區分索引、排序或生成端的變化。

## 參考資料

- [CS124 Winter 2026 schedule](https://web.stanford.edu/class/cs124/lec/)
- [SLP3 Chapter 11: Information Retrieval and Retrieval-Augmented Generation](https://web.stanford.edu/~jurafsky/slp3/11.pdf)
- [CS124 Lab 3](https://github.com/cs124/labs/blob/main/Lab3_InformationRetrieval.md)
- [CS124 Lab 3 Solutions](https://github.com/cs124/labs/blob/main/Lab3_InformationRetrieval_Solutions.md)
- [CS124 PA3](https://github.com/cs124/pa3-information-retrieval)
