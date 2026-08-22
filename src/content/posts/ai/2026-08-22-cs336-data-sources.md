---
title: "CS336 Lecture 13：語料不會從天上掉下來，每個來源都有存取與授權成本"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs336, training-data, common-crawl, copyright, llm]
lang: zh-TW
series:
  name: "Stanford CS336 導讀"
  order: 14
tldr: "第十三講沿著 Common Crawl、Wikipedia、GitHub、arXiv、書籍與歷代開放資料集追溯語料來源；抓得到不等於可合法使用，raw data 也不等於 training data，來源 provenance 必須先於清理與混合。"
description: "Stanford CS336 Spring 2026 Lecture 13 導讀：web crawl、walled gardens、robots.txt、授權與著作權風險，以及 WebText、C4、The Pile、RefinedWeb、Dolma、DCLM 等資料集沿革。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs336-data-sources-en)

本篇對應 **CS336 Spring 2026 Lecture 13: Data (sources, datasets)**，2026 年 5 月 11 日由 Percy Liang 主講。主要來源是官方可執行講義 [`lecture_13.py`](https://github.com/stanford-cs336/lectures/blob/main/lecture_13.py)。本文整理課程內容，不構成法律意見。

資料是最容易被一句「我們用網路語料」掩蓋的部分。第十三講從 live service 一路追到 raw snapshot，再到後續 processed data，先問來源、取得方式與權利，下一講才談 filtering、deduplication 與 mixing。

## Web crawl 不是下載整個網路

Crawler 從 seed URLs 發現連結並下載頁面，但現代網站常依 JavaScript、按鈕、表單與登入狀態動態產生內容。Paywall、CAPTCHA、rate limit、地區封鎖與 bot detection 都讓「公開網址」不等於匿名可大量取得。

`robots.txt` 表達網站對 crawler 的偏好，terms of service 可能另有限制，伺服器負載也有實際成本。即使技術上能繞過控制，也不能把可存取性誤寫成授權。

Common Crawl 提供週期性 web snapshots 與 WARC/WAT/WET 等形式，成為許多 open dataset 的起點。它仍只是原始快照，會包含模板、垃圾內容、重複頁、個資與受著作權保護的表達。

## 每一種來源帶來不同偏差

Wikipedia 結構清楚、授權明確，但文體與知識範圍集中。GitHub 提供大量程式碼，也混有 generated files、secrets、license 差異與重複 forks。arXiv 有高密度技術內容，卻不是一般對話。Books 提供長篇連貫文字，取得與授權風險則更高。

Stack Exchange、Project Gutenberg 等來源各自有授權與社群結構。資料 mixture 因此不是「網路的自然分布」，而是 crawler、平台人口、授權策略與清理規則共同形成的編輯決策。

## 著作權、license 與 fair use 不能混成一件事

講義區分 expression 與 idea、copyright 與 contract license，也回顧多起生成式 AI 訴訟。工程上不要替所有司法管轄區下通則，而要保存 provenance。內容包括 URL、抓取日期、取得方法、license、robots/ToS 狀態、處理步驟與刪除機制。

Creative Commons、public domain 或直接授權可提供較清楚的使用基礎；沒有標示 license 不代表內容沒有著作權。從影子圖書館取得的副本也不能因後續訓練具有轉化性，就倒推最初取得行為一定合法。法律仍在演變，資料治理必須能重新判斷與移除來源。

## 資料集世代是一連串取樣決策

BERT 使用 Wikipedia 與 BooksCorpus，GPT-2 以 Reddit outbound links 建 WebText，C4 則從 Common Crawl 清理。GPT-3 混合 filtered web、books、Wikipedia 等來源；The Pile 讓多來源組成更透明。後續資料集再各自改進 filtering、provenance 或可重現性。

這條歷史不能只看 token count。每個資料集都應交代 raw sources、snapshot 日期、語言選擇、過濾與去重方法。還要說明是否保留 document IDs、哪些內容被排除，以及下游能否遵守刪除請求。

## Raw source manifest 應先於訓練

替每個 source 建一列 manifest。欄位包括 owner/platform、取得方式、時間範圍、license/terms、content type、預估規模、敏感資料風險、允許用途，以及退出與刪除流程。Raw files 使用 immutable snapshot，所有 transformation 以版本化程式與輸出 hash 追蹤。

沒有 manifest，模型出問題後只能猜是哪批資料。有 manifest 才能重建某個 checkpoint 看過什麼，也才能在法律、隱私或品質判斷改變後重新處理。

第十三講的核心不是列出更多資料源，而是把資料取得視為模型工程的第一級系統，而不是訓練前的一次性下載。

## 材料完整度

本講有 Spring 2026 當期 schedule 與完整可執行講義。法律段落僅轉述課堂框架與工程含意；具體使用仍須依司法管轄區與法律專業意見判斷。

## 參考資料

- [CS336 Spring 2026 課程與 schedule](https://cs336.stanford.edu/)
- [Lecture 13 可執行講義](https://github.com/stanford-cs336/lectures/blob/main/lecture_13.py)
- [Common Crawl](https://commoncrawl.org/)
- [DataComp-LM](https://arxiv.org/abs/2406.11794)
