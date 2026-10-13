---
title: "Agent 記憶：指定閱讀導讀｜Stanford CS329A 第 14 堂"
date: 2026-10-11
category: ai
type: deep-dive
tags: [cs329a, ai-agent, ai-course, evaluation, llm]
lang: zh-TW
series:
  name: "Stanford CS329A 導讀"
  order: 11
description: "比較 MemGPT、Cartridges 與 CacheBlend，算出離線表示的成本打平點，並檢查更新資料的正確性。"
tldr: "取回管理、訓練 KV 表示與 cache 重用處理不同瓶頸；速度與命中率都不保證資料新鮮。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-10-11-cs329a-session-14-agent-memory-readings-en)

「讓 agent 記住更多」可能是在解三個完全不同的問題：找回過去資訊、用較少記憶體表示長文件，或加速已看過文件的處理。[CS329A](https://cs329a.stanford.edu/) Autumn 2025 第 14 堂指定的三篇論文分別碰到這三層。讀完你應能替記憶瓶頸選方法，而不是看到 memory 就放進同一個比較表。先備是知道模型有有限的 context window；KV cache 是模型處理輸入後保存的 key/value 張量，不是文字摘要。

先讀[第 8 堂：搜尋與深度研究](/posts/ai/2026-10-11-stanford-cs329a-lecture-08-search-deep-research)，把資料取回與模型內部表示分開。

**影片狀態：官方課表未列錄影。** 2026-10-11 檢查的公開九支影片 inventory 未找到本堂對應影片；這不證明沒有錄影。課表另標 Junchen Jiang 客座，本文只依指定閱讀教機制，不還原其口述。

## MemGPT：把需要的資料搬進 context

[MemGPT](https://arxiv.org/abs/2310.08560)借用作業系統虛擬記憶體的想法，區分模型當下可見的 context 與外部儲存，讓 agent 透過工具管理與取回資訊。它提供長期記憶的使用方式，並沒有把固定 context window 變成無限大。外部有資料而未取回，模型仍看不到；錯誤摘要或漏掉的細節也不會因為叫 memory 而自動補回。

例如客服對話已移到外部儲存，但客戶說「照上次方式寄送」。Agent 必須先找回上次的寄送方式，再回答；不能把「搜尋完成」當成資料已正確讀入。這類問題的瓶頸是取回與管理，而非模型記憶體張量的大小。

## Cartridges：預先學一份較小的表示

[Cartridges](https://arxiv.org/abs/2506.06266)對固定文件 corpus 離線訓練較小的 KV cache，並凍結基礎模型。Self-study 先產生多樣的問答／對話，再讓 cartridge 條件下的模型模仿完整文件 context 下的輸出分布。直接把原文記熟，未必能回答換個問法的問題；這正是自擬問答與 context distillation 要處理的落差。

它的代價是離線處理與資料版本管理。文件每天改，而每次只有一個問題，就不一定值得先訓練表示。較適合反覆詢問同一批相對固定的資料；不能從「訓練完可重複用」推出「資料更新不用重做」。

## CacheBlend：重用 cache 仍須修補互相影響

[CacheBlend](https://arxiv.org/abs/2405.16444)處理多個文件片段已各自有 KV cache，但在新問題中重新拼接的情況。後方片段原本獨立計算的表示，沒有包含對前方片段的 attention。直接拼接可能影響答案，所以它選擇性重算一部分 token 的 KV，並安排 cache 讀取與計算的重疊。它在解 prefill 速度，不是在建立可搜尋的個人記憶，也不是訓練基礎模型。

## 一個完整的選法例子

以下是本文自擬規劃例子，成本數字不是論文結果。公司有固定的手冊 A、B，另有每天變動的工單 C。一天 100 個問題多次引用 A、B。完整 prefill 每題成本 100 單位，總共 10,000。假設離線 cartridge 建立成本 2,000，每題之後為 20，總成本是 2,000+100×20=4,000。若品質檢查通過，重複查詢有攤提的理由。

若只問 10 題，原方法成本 1,000，cartridge 為 2,200，反而較貴。令題數為 n，兩者打平是 100n=2,000+20n，所以 n=25；超過 25 題才在這個簡化模型中省成本。這只是選型直覺，不是實際吞吐量預測。

每天更新的 C 不應無條件用昨日表示。先用取回工具找到當日工單，將版本正確的內容放進 context；若 A、B 的片段 cache 要重組，可再評估 CacheBlend 類方法。三種方法能組合，前提是分別查明資料新鮮度、回答品質與執行成本。

## 變式檢查與答案

現在 A 每小時更新，總共只問 20 題；你仍用昨天訓練的 cartridge，回答速度很快。這足以交付嗎？**答案：不足。** 先驗證資料版本與回答是否引用最新內容。依上述成本假設，20 題的完整 prefill 是 2,000，離線加查詢是 2,400，連成本理由都不成立。若能增量更新或跨更多題攤提，需要另列實際成本，不能套舊算式。

常見誤解是將快取命中率當成正確答案率。今晚先記錄一個真實失敗：是找不到資料、資料過期、context 放不下，還是 prefill 太慢？再挑取回管理、訓練表示或 cache 重用的方法，並用更新前後的同一問題檢查新鮮度。

## 英文閱讀與表達

本文自擬句：*Retrieval decides what information enters the context.*（取回決定哪些資訊進入 context。）*Cache reuse reduces computation; it does not guarantee fresh information.*（重用 cache 減少計算，不保證資訊新鮮。）練習用兩句說明 C 的處理方式；這是閱讀／表達練習，沒有原音跟讀。


## 參考資料

- [Official Autumn 2025 schedule](https://cs329a.stanford.edu/)
- [Cartridges](https://arxiv.org/abs/2506.06266)
- [MemGPT](https://arxiv.org/abs/2310.08560)
- [CacheBlend](https://arxiv.org/abs/2405.16444)
