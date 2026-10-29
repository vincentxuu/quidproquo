---
title: "做 agent 前，先懂模型怎麼讀前文、怎麼吐字｜Stanford CS329Z 第 2 堂"
date: 2026-09-10
updated: 2026-10-29
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent]
lang: zh-TW
series:
  name: "Stanford CS329Z 導讀"
  order: 3
tldr: "Lecture 02 從解碼策略、注意力與線性注意力，走到訓練流程、KV cache、test-time scaling、結構化輸出與 context engineering。指定讀物 Anthropic 的 context engineering 指南回答每一輪該讓模型看見什麼。"
description: "依實體頁碼帶讀 CS329Z Lecture 02 LLMs for Builders 的 176 頁投影片，從解碼、注意力到結構化輸出與 context engineering，再深讀 Anthropic 的 context engineering 指南。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-10-stanford-cs329z-lecture-02-llms-for-builders-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

第 2 堂（9/28，LLMs for Builders）是給 agent 開發者的模型內部速成：解碼怎麼選字、注意力怎麼讀前文、為什麼 context 長度有代價，以及結構化輸出為什麼是元件之間的契約。後面每一堂的工程取捨，都會回到這幾個限制。

指定讀物有 Vaswani 等人的 Transformer、Katharopoulos 等人的線性注意力，以及 Anthropic 的 [Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)。本文深讀最後一篇，前兩篇的機制已在投影片導讀中說明。以下先依 PDF 實體頁碼帶讀投影片，再接指定讀物的深入解說。本文的例子與自測題是教學練習，不是官方作業解答；重複動畫、課務與章節分隔頁合併說明。

## Lecture 02 投影片導讀

<div class="slide-reader" data-slide-reader data-pages="176" data-pdf-src="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf">
<p>共 176 頁，以 PDF 實體頁碼對照。點各節頁碼可查看相應投影片。</p>
<button type="button" data-slide-open>開啟投影片對照</button>
<p><a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf" target="_blank" rel="noopener noreferrer">另開分頁看原始 PDF</a></p>
</div>

### 第 1–23 頁：從機率分布到解碼策略

<a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf#page=1" data-slide-page="1">投影片第 1–23 頁</a>

開頭先把本課放在 LLM application 層，再回到模型到底輸出什麼：一串 token 的機率可以拆成逐步條件機率。投影片用「The class was about…」逐格展開，說明下一個 token 有許多候選；生成時的選擇方式才是 decoding。Greedy 每次取最高機率，top-k／top-p 縮小抽樣集合，beam search 同時保留候選序列。

做 agent 時，這會影響工具選擇與參數是否穩定。低 temperature 可以減少抽樣變化，卻不能替代參數驗證。自測時固定同一個工具 schema，重跑相同輸入，分開記錄「選錯工具」與「格式不合法」，別把兩種失敗都算成模型不夠聰明。

### 第 24–62 頁：Transformer：每個位置如何讀取前文

<a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf#page=24" data-slide-page="24">投影片第 24–62 頁</a>

這段用多張逐步動畫拆 decoder-only Transformer。Token 先變成 embedding，加入位置資訊，再經過 attention 與 feed-forward 層，最後由 LM head 給出下一個 token 的分布。Attention 的 query 與 key 決定要讀哪些位置，再用權重混合 value；causal mask 擋住訓練時不應看見的未來 token。多頭注意力讓模型在不同子空間處理關係。

圖中箭頭值得逐步看，不必把每張視為新概念。讀到這裡應能回答：模型正在生成工具參數時，工具定義與使用者限制如何影響這個位置？它們必須真的出現在可讀的 context 中。架構提供存取路徑，沒有保證每次都會抓對限制。

### 第 63–91 頁：線性注意力以壓縮狀態換取效率

<a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf#page=63" data-slide-page="63">投影片第 63–91 頁</a>

完整 softmax attention 保留過去位置的 key／value；線性注意力則逐步更新壓縮狀態，讓新 token 與狀態互動。投影片先畫出狀態保存與更新，再比較序列長度增加時的計算與記憶體需求，接著指出長 context 的取用能力仍要實測，並展示混合兩類注意力的設計。

不要從「視窗很長」直接推論「能找回所有細節」。挑一份實際會交給助理的繁中長文件，把同一條限制移到前、中、後段，檢查答案與延遲。這是本文的自擬測法；它把架構比較轉成選模型時可用的證據。

### 第 92–118 頁：訓練階段決定模型學過什麼

<a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf#page=92" data-slide-page="92">投影片第 92–118 頁</a>

從 next-token cross-entropy 出發，這段依序介紹 pretraining 的清理、去重與資料混合，midtraining 的領域分布調整，以及 post-training 的指令遵循與偏好學習。人類偏好不是客觀真值：標註可能不可靠，偏好也可能互相衝突。可驗證獎勵則把測試、證明或環境狀態當回饋，仍須檢查 verifier 是否真的代表任務成功。SWE-smith 是 agent 軌跡訓練的課堂案例。

因此，會寫自然語言與會在你的工具環境完成工作，是兩項需要分別驗收的能力。給模型一個會失敗的工具結果，觀察它是否改參數、改策略或要求協助；這比只考一次正常呼叫更貼近 harness 的需求。

### 第 119–137 頁：Prefill、decode 與 KV cache

<a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf#page=119" data-slide-page="119">投影片第 119–137 頁</a>

Prefill 先處理輸入，decode 再逐步產生輸出。圖中保留下來的 key／value 就是 KV cache：後續生成可重用既有計算。這解釋了為何長 prompt 的首次等待、逐字輸出速度與整段耗時應分開觀察。Speculative decoding 則讓較小的 draft model 提議續文，再交由 target model 驗證。

對多輪 agent，可先檢查工具結果是否過長、穩定前綴是否一直改寫。投影片提供的是推論機制；實際供應商的快取條件與費率仍需看其文件。不要把 KV cache、應用層答案快取與保存使用者記憶混成同一件事。

### 第 138–148 頁：多花推論算力，需要選出好答案的方法

<a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf#page=138" data-slide-page="138">投影片第 138–148 頁</a>

這段把更長的 reasoning 與 repeated sampling 放在一起比較。多生成候選可能增加找到好答案的機會，但還需要可靠的 verifier 或彙整方法；self-consistency 用多條推理結果的共識做選擇，也會受共同錯誤影響。投影片的外套漲價再打折例子，提醒讀者檢查百分比的基準，而非只看推理文字的長度。

自擬練習可把相同預算分成「一次較長推理」與「多次較短生成」。固定評分規則，同時記錄成功率、成本與延遲，才能判斷多花的 token 是否值得。

### 第 149–159 頁：結構化輸出是元件間的契約

<a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf#page=149" data-slide-page="149">投影片第 149–159 頁</a>

複合系統不能只靠「看起來像答案」的字串連接。這段從欄位契約談到 constrained decoding，並展示 DSPy signature 與工具呼叫。限制可生成的 token，有助於維持結構；schema 合法仍不代表內容正確，更不代表操作已獲授權。

例如繁中郵件寫「週四可以談」，抽出 meeting intent 合法，卻沒有時區、日期與收件人確認。先驗證結構，再查語意與必要欄位，最後才交給執行器。這個例子是本文延伸，不是投影片中的作業解答。

### 第 160–176 頁：Context engineering：保留決策需要的資訊

<a href="https://web.stanford.edu/class/cs329z/slides/lecture02.pdf#page=160" data-slide-page="160">投影片第 160–176 頁</a>

最後把 system prompt、歷史、記憶、工具結果與附件列成同一份 context 預算。重點包括避免肥大、按需檢索、盡量維持可重用的前綴、用 eval 比較取捨，以及 compaction 時保存關鍵限制。Recursive LM 是另一種把大量材料放在外部、按需操作的課堂方向。結尾回顧全課並銜接 RAG。

自測時先保存完整事件，再製作送入模型的精簡版本。檢查任務目標、未完成步驟與使用者禁止事項是否還在。這讓「減少 token」有明確的驗收條件，也銜接下面 Anthropic 的延伸閱讀。

## 讀物｜Anthropic：每輪應該讓模型看見什麼？

[主讀物](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)

### TL;DR

Context engineering 管理整輪輸入：指令、工具、歷史與外部資料共同競爭有限注意力；用按需讀取、摘要與隔離保存高訊號內容。

### 編輯判斷

| 面向 | 判斷 |
|---|---|
| 證據基礎 | 第一方工程指南，提供長任務與工具設計經驗及策略分類。 |
| 應保留的界線 | 策略有資訊流失、額外檢索與協調成本；文章不提供套用後必然改善的效果量。 |
| 閱讀價值 | 適合長任務的 context 與工具輸入設計。 |

### 領域背景

Prompt engineering 常以單次輸入措辭為中心；長任務每輪又會加入新觀察，因此必須管理持續變化的輸入。長視窗放得下，不代表每一段都會被正確使用。

### 中階導讀

**延伸閱讀：context 是預算，不是水桶**

Anthropic 的 [Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) 把設計單位從 prompt 擴到整個推論狀態。每一輪塞進模型的不只系統指令，還有工具定義、外部資料、訊息歷史與工具結果。目標不是把視窗填滿，而是留下最少、訊號最強、足以引出正確行為的 token。靜態內容要精簡：工具邊界不要重疊，回傳不要肥大，few-shot 範例寧可少而典型。

動態內容則按需取回。先留路徑、查詢或 URL 等輕量索引，等下一個決策真的需要時才讀全文。長任務另有三種手段：compaction 壓縮過長軌跡、結構化筆記把重要狀態寫到視窗外、subagent 把深入探索隔離後只回傳結論。代價也不同：壓太兇會丟掉後來才變重要的細節，自主檢索則會增加延遲，也可能追錯線索。這是第一方實務指南，不是提供效果量的 benchmark；適合拿來做檢查表，不適合承諾用了就會漲幾分。

對第 3 堂的 RAG 練習，重點是別停在「抓 top-k 全貼上去」。固定檢索器後，分別改 top-k、chunk 長度、工具回傳格式與 history pruning，同時量答案品質、token 與延遲。另一版可以先只給來源索引，再讓 agent 按需讀段落，看看 progressive disclosure 是否真的省下成本。

### 深入要點

壓縮前先定義不能丟的欄位：使用者限制、進度、未決問題與來源指標。子任務摘要要能回到證據，否則父流程只能相信結論，無法核對。

### Reviewer 一句話評

它把 context 從文字收納問題，改成有成本與驗收條件的狀態設計。

### 給你的 take-away

固定模型與題目，分別比較全文重播、摘要與按需檢索；另外檢查舊限制是否仍被遵守。

## 它在課程裡的位置

第 2 堂把模型當成有成本、有限制的元件來看，這是之後一切設計的前提。[第 3 堂](/posts/ai/2026-09-10-stanford-cs329z-lecture-03-rag)接著談 RAG：模型讀不到的知識，要靠檢索放進 context；第 6 堂的 context 管理模式則把本堂的 context engineering 擴展到長時間執行的 agent。

## 本堂 Course Material 對照

- 官方投影片（PDF）：[LLMs for Builders — Lecture 02](https://web.stanford.edu/class/cs329z/slides/lecture02.pdf)
- 指定閱讀：Vaswani 等人〈Attention Is All You Need〉、Katharopoulos 等人〈Transformers are RNNs〉、Rajasekaran 等人〈Effective Context Engineering for AI Agents〉（本文深讀）
- 課表原文：[CS329Z 官網](https://cs329z.stanford.edu/)

## 課程影片來源

[官方 Logistics 頁](https://cs329z.stanford.edu/logistics.html)寫明，課堂錄影須登入課程 Canvas 取得。本文依公開 PDF 與指定讀物帶讀，沒有把受限錄影當作已觀看材料。錄影取得方式於 2026-10-23 依官方頁面核對。

## 更新紀錄

- 2026-10-29：系列由一週一篇改為一堂一篇。本篇收錄 Lecture 2（9/28 週一）的內容，原屬「第 2 週：先分清 workflow 和 agent，再手刻第一個 RAG」導讀；以下保留拆分前的紀錄。
- 2026-10-23：依兩堂官方 PDF 補成逐段投影片導讀，加入頁碼對照、機制與自測，保留並分開指定讀物解說。
- 2026-10-23：補入workflow／agent 對照表與 RAG 架構圖，只將既有解說視覺化，未重新查核事實。
- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：補上本週官方課堂投影片直連，保留既有課程影片來源與錄影取得方式。
- 2026-09-29：HW1 改版（不再分 Part A／Part B、不再要求 DSPy 重寫、語料換成企業 email），同步改寫相關段落
- 2026-09-12：補上 Effective Context Engineering 與 ColBERT 兩篇延伸閱讀的實質導讀。
- 2026-10-10：重查影片狀態。官方 Logistics 頁寫明錄影需登入課程 Canvas，實際開啟入口確認有登入牆，也沒有找到公開錄影；狀態改為需登入。

## 參考資料

- 站內：[第 1 堂：複合式 AI 系統](/posts/ai/2026-09-09-stanford-cs329z-lecture-01-compound-ai-systems)、[第 3 堂：RAG](/posts/ai/2026-09-10-stanford-cs329z-lecture-03-rag)、[CS329Z 總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)
- 課堂投影片：[LLMs for Builders — Lecture 02](https://web.stanford.edu/class/cs329z/slides/lecture02.pdf)
- 課程：[CS329Z 官網課表](https://cs329z.stanford.edu/)
- 原文：[Anthropic, Effective Context Engineering for AI Agents (2025)](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
