---
title: "AI Engineer 面試日練 — 2026-11-27：Coding"
date: 2026-11-27
category: daily
type: digest
tags: [ai-engineer-interview, daily, coding]
lang: zh-TW
description: "星期五主題 Coding：手刻一個簡化版 continuous batching scheduler，練習怎麼在面試中講清楚 prefill／decode 的不同成本結構，以及續批排程的收益為什麼跟輸出長度變異度直接綁在一起。"
tldr: "Continuous batching 不是穩賺的加速：實測顯示輸出長度完全一致（CV=0）時跟 static batching 吞吐一樣，只有長度分散到 CV 接近 1 時才衝到 2.91 倍；面試時最容易漏講的是排程器（誰在跑）跟 PagedAttention（KV cache 怎麼存）是互補但分離的兩層，slot 空出來能不能馬上塞進新請求，取決於記憶體管理允不允許任意分配，不是排程邏輯本身能決定的。"
series:
  name: "AI Engineer 面試日練"
  order: 100
---

> :globe: [English version](/posts/daily/2026-11-27-ai-interview-daily-en)

## 今日主題

星期五固定練 Coding，範圍收在 ML 味最重的那一類實作題——batch inference、tokenizer、data processing、numpy。這類題目考的不是會不會呼叫某個函式庫，是知不知道函式庫底下在做什麼。

今天挑的題目是手刻一個簡化版的 continuous batching scheduler：模擬 LLM serving engine 一個 decode step 在做的事——哪些請求正在跑、誰跑完了、空出來的位置要補誰進來。這題同時考「排程演算法寫得乾不乾淨」跟「ML 系統設計」兩層：迴圈寫得出來只是及格線，講得出續批排程的收益其實跟流量的輸出長度分佈綁在一起、不是穩賺，才是這題真正在篩的東西。

## 核心概念速記

### Prefill 跟 decode 是兩種完全不同的成本結構

Prefill 是把整段 prompt 一次讀完，算力需求隨 prompt 長度長，GPU 有大量矩陣運算可以餵飽；decode 則是每一步只吐一個 token，但每一步都要把整套模型權重重新讀一次。有實測量過：Qwen2.5-7B 在 bfloat16 下權重約 15.2 GB，一台 GB10 的記憶體頻寬約 273 GB/s，理論下限是 55.7 ms 讀一次權重，而單個請求 decode 一步實測 78.05 ms；把 batch 從 1 拉到 32，單步時間幾乎沒變（78.05 ms → 74.77 ms），總吞吐卻衝了 26.7 倍。換句話說，decode 這一步的成本幾乎是固定的，batch 裡塞的人越多越划算，空著的 slot 才是純損失。

### Static、dynamic、continuous 三種批次策略差在「誰決定換批的時機」

Static batching 收滿一批固定數量的請求，等這批全部跑完才收下一批——只要其中一個請求特別長，其他已經跑完的請求就得白白佔著位置等它。Dynamic batching 多加一個 timeout，佇列沒滿也會在時限到了之後開始跑，但批次一旦開始，策略跟 static 一樣，長請求照樣卡住其他人的 slot。Continuous batching 把排程單位從「一整批」改成「每一個 decode step」：每跑完一步就檢查有沒有請求結束，結束了就把它的 slot 立刻交給等待佇列裡的下一個請求，不必等整批收工。

### Continuous batching 的收益跟輸出長度的變異度直接綁在一起，不是穩賺

這是這題最容易被問倒、也最容易被想簡單的地方。用變異係數（CV，標準差除以平均值）衡量輸出長度分散程度，實測結果很清楚：CV=0（所有請求輸出長度完全相同）時，continuous batching 對 static batching 的吞吐比是 1.00 倍，完全沒有差——因為所有請求同時結束，沒有空出來的 slot 可以回收。CV 升到 0.58 時比值是 1.40 倍，CV 到 0.94 時直接跳到 2.60 倍，CV 到 0.99（接近真實聊天流量的分佈）時到 2.91 倍。面試官想聽到的不是「continuous batching 一定比 static 快」，是「它的收益來自回收空出來的 slot，輸出長度越分散、空出來的 slot 越多，收益才越大」。

### Scheduler 跟 KV cache 記憶體管理是互補但分離的兩層

排程器決定「這一步誰在跑」，但一個 slot 真的能馬上塞進新請求，前提是記憶體管理允許任意請求佔用任意一塊記憶體——這是 PagedAttention 在解的問題：把每個請求的 KV cache 存成固定大小的小頁面，從共享池裡分配，用一張 block table 記錄哪些頁面屬於哪個請求，頁面不需要連續存放。如果 KV cache 是連續配置的一大塊記憶體，一個請求結束後留下的洞，大小往往跟下一個等待中請求需要的不一樣，就算排程器想換人，記憶體也擠不出剛好的空間。面試時把這兩層講清楚——排程器管「誰在跑」，PagedAttention 管「怎麼存」——比單講「continuous batching 比較快」更能顯示你懂系統怎麼接起來的。

### Token 預算跟 slot 數是兩個獨立的生產環境限制

真實系統不是只有「幾個請求同時在跑」這一個限制，還有「這一步總共能處理多少 token」的預算：slot 數（像 vLLM 的 `max_num_seqs`，等於同時能坐的人數上限）跟每步 token 預算（像 `max_num_batched_tokens`，等於一步裡所有正在 decode 的 token 加上正在讀的 prompt 片段）是兩個分開的旋鈕。一個長 prompt 如果在一步內讀完，會把這一步的 token 預算吃光，讓其他正在 decode 的請求那一步被迫暫停——這也是為什麼生產系統要用 chunked prefill，把長 prompt 拆成好幾步讀，讓它跟別人的 decode token 分攤同一個預算，而不是獨佔一整步。

```flow-diagram
{
  "title": "Continuous batching 的一個 decode step",
  "lang": "zh-TW",
  "width": 640,
  "height": 460,
  "nodes": [
    {"id": "decode", "label": "讓 slot 裡所有請求\n各吐一個 token", "x": 230, "y": 50, "w": 300, "h": 70},
    {"id": "check", "label": "檢查剩餘輸出長度：\n哪些請求這一步結束了？", "x": 230, "y": 160, "w": 300, "h": 70},
    {"id": "free", "label": "結束的請求離開 slot，\n回收它的 KV cache 頁面", "x": 230, "y": 270, "w": 300, "h": 70, "tone": "accent"},
    {"id": "fill", "label": "從等待佇列 FIFO 補進新請求，\n受 token 預算限制", "x": 230, "y": 380, "w": 300, "h": 60}
  ],
  "edges": [
    {"from": "decode", "to": "check", "step": 1},
    {"from": "check", "to": "free", "step": 2},
    {"from": "free", "to": "fill", "step": 3},
    {"from": "fill", "to": "decode", "step": 4, "label": "下一個 decode step", "via": [[420, 380], [420, 50]], "labelAt": [420, 220], "tone": "warn"}
  ],
  "steps": [
    "每個 decode step 先讓目前 slot 裡的所有請求各往前吐一個 token，這一步的成本幾乎跟 slot 裡有幾個請求無關，主要是重讀一次模型權重。",
    "吐完 token 後檢查每個請求的剩餘輸出長度，哪些已經到 0——這一步決定了這次 step 結束後誰要離開。",
    "結束的請求離開 slot，釋出它佔用的 KV cache 頁面（PagedAttention 用小頁面存，讓釋出的空間可以被任何新請求重用，不需要剛好等長）。",
    "用釋出的 slot，照 FIFO 從等待佇列補進新請求；新請求的 prefill 要跟其他正在 decode 的 token 共用同一步的 token 預算，太長就要分幾步讀完（chunked prefill），不能一次吃光，否則會卡住正在 decode 的其他請求。"
  ],
  "caption": "簡化示意：省略 preemption（KV cache 滿了被迫踢出已在跑的請求）與跨 GPU 排程細節，重點是「decode 成本固定、空出來的 slot 才是純損失」跟「排程器換人、記憶體管理讓換人可行」兩段要分開講。"
}
```

## 今日練習題

### 題目

寫一個簡化版的 LLM serving continuous batching scheduler。引擎有固定數量的 decode slot（`max_slots`），每個 decode step 只能讓目前佔用 slot 的請求各吐一個 token。請求以 `(request_id, output_len)` 的形式陸續抵達等待佇列，不保證同時到達。

**Level 1**：寫 `step()`，模擬一次 decode step：讓所有佔用中的請求剩餘 token 數 -1；剩餘 token 數到 0 的請求離開 slot 並回傳在這份清單中；用釋出的 slot，依 FIFO 從等待佇列補進新請求。

**Level 2（進階）**：引擎額外有 `max_batched_tokens`，一個新請求進場時，它的 prefill 要先佔用等同其 prompt 長度的 token 預算，且這個預算要跟同一步裡所有正在 decode 的 token 數共用上限；prompt 太長時要能分成多步讀完（chunked prefill），不能讓它一次吃光整步的預算、卡住其他正在 decode 的請求。

**來源**：FastPrep 題庫收錄的 Anthropic Fellow Program project coding 題「Inference Engine Scheduler」——「Implement the request scheduler of an LLM inference engine, assigning prefill and decode work across progressively harder levels」，2026 年 11 月仍有回報　**難度**：中等至進階　**環節**：project coding（live coding + 逐層加難度的追問）

### 拆解思路

1. **先釐清問題**：面試時該問的 clarifying questions——每個請求的輸出長度是先驗已知還是要邊跑邊猜（實務上通常不知道，排程器只能用已經吐出的 token 數判斷）；slot 數是固定值還是跟 GPU 顯存動態掛鉤；prefill 跟 decode 是不是共用同一個 token 預算；KV cache 滿的時候要不要支援 preemption（把跑到一半的請求踢出去，之後重建）。
2. **建立框架**：用兩個資料結構——一個 dict 存「目前佔用 slot 的請求與各自剩餘 token 數」，一個 FIFO queue 存等待中的請求。`step()` 的邏輯固定三段：先把佔用中的請求剩餘數全部 -1，濾出到 0 的當作本步完成，再用釋出的 slot 數從等待佇列依序補位。
3. **深入核心**：技術上最關鍵的 trade-off 是續批排程的收益不是穩賺的——完全看流量的輸出長度變異度（CV）。CV=0 時跟 static batching 吞吐一樣（1.00 倍），CV 到 0.94 才衝到 2.60 倍、CV 到 0.99 才到 2.91 倍。另外要講清楚排程器（決定誰在跑）跟記憶體管理（PagedAttention，決定 KV cache 怎麼存）是分開但互補的兩層：排程器想換人，前提是記憶體允許任意請求佔用任意頁面，不然換進來的新請求可能找不到剛好大小的連續空間。
4. **收尾**：強調這題真正在篩的不是迴圈寫得多乾淨，是知道這個排程器要跟哪些生產環境的真實限制打交道——token 預算跟 slot 數是兩個獨立旋鈕、長 prompt 要靠 chunked prefill 分批讀完避免卡住別人、KV cache 滿了要有 preemption 的退路。能主動提這三點,比把 Level 1 寫完就停下來更接近面試官想看到的深度。

### 範例回答（面試時可以這樣講）

> 我會先把這題拆成「排程」跟「記憶體」兩層分開講，因為這是生產系統裡真正分工的方式。**排程那一層**：維護一個目前佔用中的請求表跟一個等待佇列，每個 decode step 固定做三件事——讓佔用中的請求各往前吐一個 token、濾出剩餘長度到 0 的請求、用釋出的 slot 從等待佇列依 FIFO 補位。這個邏輯本身不難，但我會特別提一句：continuous batching 的收益不是穩賺的，它的大小完全看流量的輸出長度有多分散——如果所有請求輸出長度都一樣，根本沒有空出來的 slot 可以回收，跟 static batching 一樣快；只有長度分散、有人很快結束有人跑很久時，才能靠不斷補位把吞吐拉上去，實測從完全一致到接近真實聊天流量的分佈，吞吐比可以從 1 倍拉到快 3 倍。
>
> **記憶體那一層**：排程器說「這個 slot 現在換人」是一句話，但真的要換得起來，KV cache 得用分頁的方式管理——每個請求的 cache 存成固定大小的小頁面，從共享池裡分配，不要求連續記憶體，這樣舊請求釋出的空間才能被任何新請求重用，不用剛好大小一致。生產環境我還會再加兩個限制：同一步的 token 預算要把 decode 跟 prefill 算在一起，長 prompt 進來要拆成好幾步讀完，不然會把其他人正在 decode 的那一步卡住；KV cache 滿的時候要能把最晚進來的請求先踢出去、放回佇列前面，之後重讀它的 prompt 重建狀態，這叫 preemption，答案最後還是會完整送出，只是晚一點。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 區分 prefill（compute-bound，隨 prompt 長度）跟 decode（每步成本接近固定，重讀一次權重） | |
| 續批（continuous batching）跟靜態批（static batching）的差異：不是等整批跑完才換人 | |
| 續批的收益取決於輸出長度的變異度（CV），不是穩賺，CV=0 時跟 static 一樣快 | |
| 有提到 token 預算（如 `max_num_batched_tokens`）跟 slot 數（如 `max_num_seqs`）是兩個獨立限制 | |
| 有提到排程器（誰在跑）跟 KV cache 記憶體管理／PagedAttention（怎麼存）是分開但互補的兩層 | |
| 加分項：主動提 chunked prefill（長 prompt 分批讀）或 preemption（KV cache 滿了的退路） | |

## 延伸閱讀

- [Continuous Batching Beats Static and Dynamic by Up to 2.91× in vLLM](https://towardsdatascience.com/continuous-batching-beats-static-and-dynamic-by-up-to-291-in-vllm) — 用同一顆 GPU、固定住引擎跟記憶體管理，只換排程策略做對照實驗，把續批排程的收益跟輸出長度變異度（CV）的關係量化到實測數字
- [vLLM 的「Inference Engine Scheduler」題感怎麼問：vLLM interview questions, answered with numbers from a real GPU](https://systemdesignacademy.medium.com/vllm-interview-questions-answered-with-numbers-from-a-real-gpu-5c666bf27328) — 續批排程、PagedAttention、preemption、chunked prefill 在真實 vLLM 參數（`max_num_seqs`、`max_num_batched_tokens`）上的實測數字，面試被追問細節時可以直接對照

## 參考資料

- [Anthropic Interview Questions (35, Updated Nov 2026) — fastprep.io](https://www.fastprep.io/anthropic-interview) — 對應「今日練習題」的題型來源，FastPrep 收錄的 Anthropic AI Engineer 面試題庫，列出 Anthropic Fellow Program project coding 題「Inference Engine Scheduler」：assigning prefill and decode work across progressively harder levels
- [Continuous Batching Beats Static and Dynamic by Up to 2.91× in vLLM — Towards Data Science](https://towardsdatascience.com/continuous-batching-beats-static-and-dynamic-by-up-to-291-in-vllm) — 對應「Prefill 跟 decode 是兩種完全不同的成本結構」「Continuous batching 的收益跟輸出長度的變異度直接綁在一起」兩節的實測數字（CV 0 到 0.99 對應 1.00x 到 2.91x、decode 單步 78.05ms→74.77ms）
- [vLLM interview questions, answered with numbers from a real GPU — systemdesignacademy](https://systemdesignacademy.medium.com/vllm-interview-questions-answered-with-numbers-from-a-real-gpu-5c666bf27328) — 對應「Static、dynamic、continuous 三種批次策略」「Scheduler 跟 KV cache 記憶體管理是互補但分離的兩層」「Token 預算跟 slot 數是兩個獨立的生產環境限制」三節，PagedAttention 頁面大小、`max_num_seqs`／`max_num_batched_tokens` 預設值、preemption 實測數字均出自此文
