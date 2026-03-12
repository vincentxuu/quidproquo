---
title: "RAG A/B 測試：怎麼科學地比較兩個 Pipeline 配置"
date: 2026-03-12
category: ai
tags: [rag, ab-testing, experimentation, metrics, pipeline]
lang: zh-TW
tldr: "「加了 Cross-Encoder 之後感覺好多了」不是科學的評估。A/B 測試讓你知道改動是否真的有效，效果多大，在哪類查詢上有效。"
description: "RAG A/B 測試的設計：流量分配、指標選擇、統計顯著性判斷，以及如何避免常見的測試陷阱。"
draft: false
---

RAG 系統每次改動，都應該透過 A/B 測試驗證效果。沒有對照組的改動，無法知道是改動本身帶來的效果，還是查詢分布的自然變化。

## 為什麼 RAG 的 A/B 測試很難

幾個讓 RAG 測試比一般 web 功能 A/B 測試更複雜的因素：

**回答品質難以自動量化**：不像點擊率可以直接統計，回答「好不好」需要人工判斷或 LLM-as-Judge，兩者都有誤差。

**查詢的多樣性**：同一個配置對「簡單查詢」和「複雜查詢」的效果可能完全不同。平均分數可能掩蓋了子群體的問題。

**順序效應**：使用者記得上次的回答，如果同一使用者交替看到 A 和 B 的回答，可能會有比較效應。

**小樣本問題**：RAG 的配額限制了查詢量，樣本可能不夠達到統計顯著性。

## 流量分配設計

**使用者層級的分組**（推薦）：

```typescript
function assignVariant(userId: string): 'A' | 'B' {
  // 用 userId 的 hash 穩定分組，同一使用者每次看到同一個版本
  const hash = murmurhash(userId) % 100;
  return hash < 50 ? 'A' : 'B';
}
```

同一使用者每次都是同一組，避免使用者體驗不一致。

**請求層級的分組**（適合快速測試）：

```typescript
function assignVariant(): 'A' | 'B' {
  // 每次請求隨機分組，更快收集到兩組的對比資料
  return Math.random() < 0.5 ? 'A' : 'B';
}
```

請求層級分組樣本累積更快，但同一使用者可能看到不一致的體驗。

## 控制什麼變量

一次只測試一個改動。常見的反例：「讓我們同時加 HyDE 和 Cross-Encoder 看看效果」——這樣即使效果好，也不知道是哪個帶來的，也不知道兩者組合是否有相互影響。

**正確做法**：

```
實驗 1：Control（無 HyDE）vs Treatment（有 HyDE）
  → 只控制 HyDE 開關，其他配置完全相同

實驗 2：Control（無 Reranking）vs Treatment（有 Reranking）
  → 在實驗 1 的最優配置基礎上，只控制 Reranking
```

## 指標設計

**主要指標**（決定成敗的指標）：

| 指標 | 說明 | 計算方式 |
|------|------|---------|
| Groundedness | 回答準確度 | LLM-as-Judge 評分平均 |
| User Satisfaction | 使用者滿意度 | thumbs up / (thumbs up + thumbs down) |
| Task Completion | 查詢解決率 | 沒有後續澄清查詢的比例 |

**次要指標**（輔助判斷）：

| 指標 | 說明 |
|------|------|
| Latency p50/p99 | 確認改動沒有讓速度變差 |
| Context Precision | 搜尋到的文件相關性 |
| Cache Hit Rate | 改動是否影響了快取效率 |

**護欄指標**（任何一個超閾值就停止實驗）：

- Latency p99 超過 15 秒
- Error rate 超過 5%
- Groundedness 平均低於 0.5

## 樣本量計算

在開始收集資料之前，先計算需要多少樣本：

```python
from scipy import stats
import math

def required_sample_size(
    baseline_rate: float,  # 現有的指標（如 Groundedness = 0.72）
    minimum_effect: float, # 最小期望改善（如 +0.05 = 5%）
    alpha: float = 0.05,   # 顯著性水準
    power: float = 0.80,   # 統計檢定力
) -> int:
    effect_size = minimum_effect / math.sqrt(
        baseline_rate * (1 - baseline_rate)
    )
    n = stats.norm.ppf(1 - alpha/2) + stats.norm.ppf(power)
    return math.ceil((n / effect_size) ** 2)

# 例：baseline Groundedness 0.72，期望改善 5%，需要多少樣本？
n = required_sample_size(0.72, 0.05)
print(f"每組需要 {n} 個樣本")  # 大約 500-1000 個
```

如果配額限制讓每日查詢量只有幾百個，測試可能需要跑幾週才能有足夠樣本。

## 子群體分析

整體指標好，不代表所有查詢類型都好。必須做子群體分析：

```sql
-- 按查詢類型分析 A/B 結果
SELECT
  variant,
  query_type,
  AVG(judge_groundedness) as avg_groundedness,
  AVG(judge_quality) as avg_quality,
  COUNT(*) as sample_count
FROM ai_query_logs
WHERE experiment_id = 'exp-2026-03-01'
  AND created_at BETWEEN :start AND :end
GROUP BY variant, query_type;
```

可能的發現：
- HyDE 對 complex 查詢提升 10%，但對 simple 查詢反而降低（多了不必要的處理）
- Cross-Encoder 對包含多個岩場的比較查詢幫助最大

這些子群體發現比整體平均更有價值，可以指引更精細的 skipWhen 條件設計。

## 決策框架

```
實驗結束後：

1. 主要指標是否顯著提升？
   No → 放棄改動（可能有其他問題）

2. 護欄指標是否全部通過？
   No → 放棄（成本太高）

3. 子群體有沒有某類查詢顯著變差？
   Yes → 考慮只對特定查詢類型啟用新配置

4. 統計顯著性是否足夠（p < 0.05）？
   No → 延長實驗或降低期望效果

全部通過 → 全量推出
```

## 整體來說

RAG 的 A/B 測試不需要複雜的工具，核心是：清楚的對照設計（每次只動一個變量）、合適的指標（主要 + 護欄）、足夠的樣本量、子群體分析。

最重要的習慣：**在系統上線時就埋下 experiment_id 欄位**，不要等到需要測試時才發現沒有資料可以分析。預先設計可觀測性，才能讓每次改動都有數據支撐。
