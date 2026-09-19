---
title: "每修一次都以為好了：Vision PDF 解析的三階段優化"
date: 2026-09-19
category: ai
type: debug
tags: [vision-api, pdf-parsing, concurrency, rate-limiting, bedrock, performance, debugging]
lang: zh-TW
tldr: "用 Vision API 解析 150 頁 PDF 要 29 分鐘（一頁一請求）。分批送頁降到 1.5 倍，加上 5 路併發壓到 24 秒。上線一週後客戶一次傳 23 份 PDF，70 個並行請求打爆 Bedrock 限流——90 頁被跳過、5 份失敗、8 份卡住。最終用 Redis slot 做全叢集上限 + backoff 重試修復。"
description: "記錄一次 Vision API PDF 解析從效能瓶頸到併發優化再到生產限流事故的完整除錯過程，包含分批策略、對半縮批、併發架構與限流降級設計。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-09-19-vision-pdf-parse-too-fast-for-aws-en)

## TL;DR

我們的 AI 助理平台用 [Amazon Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html) 的 Vision API（Converse API + 多模態輸入）解析 PDF。原始架構一頁一個請求，150 頁 PDF 耗時 29 分鐘。三階段優化後翻車：

1. **分批**（N 頁一請求）：耗時降到約 1.5 倍
2. **併發**（同時送 5 批）：20 頁 PDF 從 139 秒降到 24 秒
3. **翻車**：客戶一次上傳 23 份 PDF → 14 份同時解析 × 5 併發 ≈ 70 個並行 Converse 請求 → Bedrock 全面限流

## 情境

平台的知識庫支援 PDF 上傳：使用者把文件丟進來，系統解析成 markdown 文字，切 chunk 後進向量資料庫供 RAG 檢索。

對於掃描件、圖表密集的 PDF，文字萃取工具（如 PyMuPDF、docling）效果有限。我們用 Bedrock Converse API 搭配 Vision 能力，把每一頁當圖片送給 Claude，請模型「看圖說話」產出結構化 markdown。

這條路徑在小文件上運作良好。問題出在大文件。

## 問題：一頁一請求，150 頁要 29 分鐘

原始實作：

```
for page in pdf.pages:
    image = render_page_to_image(page)
    markdown = bedrock_converse(image, prompt="將此頁轉為 markdown")
    results.append(markdown)
```

每個 Converse 請求含一張圖片，等回應後才送下一頁。150 頁 PDF 在 Sonnet 上實測 29 分鐘。

瓶頸很明顯：Bedrock Converse API 每次請求支援最多 20 張圖片（依[官方文件](https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference-supported-models-features.html)，部分模型可達 100 張），但我們只送 1 張。

## 第一刀：分批送頁

把多頁 PDF 圖片塞進同一個請求，要求模型在輸出中用 `<!-- Page N -->` 標記分隔各頁：

```
prompt = """
將以下 {n} 頁 PDF 分別轉為 markdown。
每頁用 <!-- Page N --> 標記開頭（N 從 1 開始）。
"""
```

### 分批的三重約束

實際的 `pages_per_request` 不能直接設 100，要取三個上限的最小值：

| 約束 | 來源 | 算法 |
|------|------|------|
| 設定值 | 管理員在後台設的 `pages_per_request`，預設 10 | 直接讀取 |
| API 上限 | Bedrock 每請求 100 張圖片 | `min(設定值, 100)` |
| Token 預算 | `max_output_tokens ÷ 每頁估計 token`（預設 16,384 ÷ 1,500 ≈ 10） | 避免輸出被截斷 |

### 對半縮批（Halving on Failure）

10 頁一批送出去，模型可能只回 8 頁的標記——輸出被 `max_tokens` 截斷了。這時不能直接放棄這 10 頁，也不能只拿前 8 頁（標記順序可能不完整）。

策略：**對半縮批重送**。

```
工作堆疊：[pages 1-10]

→ 送出 10 頁，回來只有 8 個標記（截斷）
→ 丟棄結果，拆成 [pages 1-5] 和 [pages 6-10] 推回堆疊
→ 送出 5 頁，成功，收下
→ 送出 5 頁，又截斷
→ 拆成 [pages 6-8] 和 [pages 9-10]
→ ...直到單頁
```

單頁截斷就保留已有的部分，標記 `<!-- Page N: truncated -->`，發一個 Sentry warning。

### 效果

Sonnet 上，10 頁一批約 1.5 倍速——不到 2 倍是因為模型處理多張圖片的計算量接近線性，省的是網路往返和請求建立。但結合下一步的併發，這個分批是必要的前置。

## 第二刀：批次間併發

分批把 150 個請求降到 15 個，但仍然是序列的。下一步：同時送多批。

### 架構選擇

| 方案 | 優缺 | 結論 |
|------|------|------|
| Celery fan-out | 每批一個 task，天然並行 | ❌ 同一份文件的批次要在同一個 task 內歸位、共用 token 累計與快取寫入 |
| asyncio | 原生 async | ❌ 現有 Celery task 是 sync，改造範圍太大 |
| ThreadPoolExecutor | 有界執行緒池 | ✅ boto3 client 是 thread-safe，可共用；結果依頁碼寫回固定位置，完成順序不影響文件 |

最終用 `concurrent.futures.ThreadPoolExecutor`，`max_workers` 來自後台設定（預設 5，上限 10）：

```python
with ThreadPoolExecutor(max_workers=concurrency) as pool:
    futures = {}
    while pending or futures:
        # 補滿在途
        while len(futures) < concurrency and pending:
            batch = pending.pop()
            ctx = copy_context()
            future = pool.submit(ctx.run, send_batch, batch)
            futures[future] = batch

        # 等任一完成
        done, _ = wait(futures, return_when=FIRST_COMPLETED)
        for f in done:
            batch = futures.pop(f)
            result = f.result()
            if result.needs_split:
                # 對半縮批推回 pending
                pending.extend(batch.halves())
            else:
                # 依頁碼寫回結果
                for page_num, text in result.pages:
                    output[page_num] = text
```

注意 `copy_context()` ——每個 worker thread 要複製呼叫端的 `contextvars`，Sentry 的 span 才能正確串聯。

### 實測數字

同一份 20 頁 PDF，Sonnet，同一個 Bedrock endpoint：

| 設定 | 請求數 | 耗時 | 對比序列逐頁 138.9s |
|------|--------|------|----------------------|
| 4 頁/批 × 並行 5 | 5 個同時在途 | **23.8 秒** | **1/5.8** |
| 10 頁/批 × 並行 5 | 2 個同時在途 | 48.4 秒 | 1/2.9 |

4 頁一批 × 5 併發是最佳組合：批次小到不會被截斷，併發高到打滿。

## 翻車：上線一週，23 份 PDF 打爆 Bedrock

上線一週後，某企業客戶一次上傳 23 份 PDF 到知識庫。

我們的知識庫上傳本來就支援多檔並行處理——每份文件一個 Celery task。問題是：**每份文件內部已經有 5 路併發了**。

```
14 份同時解析 × 每份 5 路併發 = 70 個同時的 Bedrock Converse 請求
```

依 [AWS Bedrock 配額文件](https://docs.aws.amazon.com/bedrock/latest/userguide/quotas.html)，每個 AWS 帳號對每個模型有 RPM（Requests Per Minute）和 TPM（Tokens Per Minute）限制。我們的帳號配額吃不消 70 個並行的 Vision 請求。

### 症狀

從 Sentry 看到的三種死法：

1. **跳頁但顯示完成**：一份 270 頁文件，90 頁被 throttle 後跳過，但 task 狀態是 `done`——因為我們的設計是「跳過被限流的頁面，其餘照常回傳」
2. **寫 DB 失敗**：5 份文件 parse 完成，但要寫 token 用量到資料庫時，Django 的 DB 連線已經因為閒置太久被切斷（生產環境 `CONN_MAX_AGE=0`，每次請求完就關連線，但 parse 可能跑好幾分鐘）
3. **卡在 processing**：8 份文件的 Celery task 因為限流重試耗盡後拋例外，但 task 狀態沒正確更新

### 根因分析

三層問題：

| 層 | 問題 | 為什麼之前沒發現 |
|----|------|-----------------|
| 併發上限 | 沒有跨文件的全域上限 | 開發/測試時一次只傳 1-2 份，沒有打到 RPM 上限 |
| 限流重試 | botocore 內建重試只有 3 次、幾秒就放棄 | 單份文件的限流通常是暫態的，多份文件的限流是持續的 |
| DB 連線 | parse 期間 DB 連線閒置過久 | 序列版最多幾分鐘，併發版同一份文件也只是幾十秒，但多份排隊可能讓 task 跑很久 |

## 修法：三層防護

### 1. Redis Slot 全叢集上限

新增 `VisionParseSlotService`，用 Redis 的原子操作（INCR + TTL）實作全叢集的 slot：

```
全叢集同時進行的 Vision parse task 上限 = 3
```

- 每個 Celery task 啟動前申請 slot
- 滿了就 requeue（延遲 60 秒後重新排隊）
- task 結束時釋放 slot
- slot 有 TTL（防 task 崩潰不釋放）

3 份 × 每份 5 路併發 = 最多 15 個同時的 Converse 請求，在配額範圍內。

### 2. Backoff 重試

botocore 的內建重試太快放棄。在我們自己的層加上 backoff：

```python
THROTTLE_BACKOFF = [5, 10, 20]  # 秒

for delay in THROTTLE_BACKOFF:
    result = send_batch(single_page)
    if not is_throttled(result):
        break
    time.sleep(delay)  # 佔住 slot，形成 backpressure
else:
    mark_page_skipped(page, reason="throttled")
```

等待期間佔住併發 slot，形成天然的 backpressure——一個 batch 被限流，其他 batch 就等著，整體請求率自然降下來。

### 3. DB 連線重新建立

parse 結束、要寫 token 用量之前，先 `close_old_connections()`：

```python
from django.db import close_old_connections

def _store_vision_token_usage(parse_result):
    close_old_connections()  # 重新建立 DB 連線
    TokenUsage.objects.create(...)
```

這在 Django 裡是常見的 pattern——任何長時間不碰 DB 的 task，結束前都該呼叫一次。

## 學到的事

**效能優化必須跟限流意識一起做**。我們的三次迭代：

| 階段 | 做了什麼 | 漏了什麼 |
|------|----------|----------|
| 分批 | 減少請求數 | — |
| 併發 | 壓縮單份文件耗時 | 沒有考慮多份文件疊加 |
| 限流修復 | Redis slot + backoff | 這應該在第二階段就做 |

依 [AWS Well-Architected Framework 的可靠性支柱](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/design-interactions-in-a-distributed-system-to-mitigate-or-withstand-failures.html)：

> "Implement client-side throttling to prevent a client from overwhelming a service."

這句話在文件裡看到時覺得理所當然，在 Sentry 裡看到 70 個限流錯誤時才真正理解。

三個可以帶走的 pattern：

1. **對半縮批（Halving on Failure）**：批次失敗不要直接放棄，拆成兩半重試。最壞退化到逐個處理，不會比改前差
2. **Slot-based 全域上限**：單份文件的併發好控制，跨文件的併發要用共享狀態（Redis、DB）做全域限制
3. **長 task 的 DB 連線**：Django 的 `CONN_MAX_AGE=0` + 長時間 task = 寫 DB 時連線已死。`close_old_connections()` 是標準解法

## 參考資料

- [Amazon Bedrock Converse API — Supported models and features](https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference-supported-models-features.html)
- [Amazon Bedrock Service Quotas](https://docs.aws.amazon.com/bedrock/latest/userguide/quotas.html)
- [AWS Well-Architected Framework — Reliability Pillar](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html)
- [Django — close_old_connections()](https://docs.djangoproject.com/en/5.2/ref/databases/#persistent-connections)
- [Python concurrent.futures — ThreadPoolExecutor](https://docs.python.org/3/library/concurrent.futures.html#threadpoolexecutor)
- [botocore retry behavior](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/retries.html)
