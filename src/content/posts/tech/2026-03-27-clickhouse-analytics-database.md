---
title: "ClickHouse：當 PostgreSQL 的分析查詢開始變慢，你需要 OLAP"
date: 2026-03-27
type: guide
category: tech
tags: [clickhouse, analytics, olap, database]
lang: zh-TW
tldr: "ClickHouse 是欄導向 OLAP 資料庫，掃幾億行只要幾秒，島島用它記錄使用行為事件，供 AI 推薦引擎的特徵工程使用，讓 PostgreSQL 專心處理交易型資料。"
description: "ClickHouse 是開源的欄導向分析資料庫，設計給大量資料的聚合查詢。這篇說明 OLAP vs OLTP 的差異、ClickHouse 的核心設計、基本 SQL 語法，以及島島（DaoDao）為什麼在 PostgreSQL 旁邊另外加一個 ClickHouse 來處理行為分析。"
draft: false
---

🌏 [English version](/posts/tech/2026-03-27-clickhouse-analytics-database-en)

PostgreSQL 拿來做 CRUD 無可挑剔。但如果你需要「統計過去 30 天所有使用者的學習行為事件、按類型彙整、算出各功能的使用率」，一個有幾百萬行的 events table 跑起來就開始痛了。

這不是 PostgreSQL 的問題，而是工具用錯了地方。PostgreSQL 是 OLTP 資料庫，設計給點查詢（find user by id）和寫入。ClickHouse 是 OLAP 資料庫，設計給大量資料的聚合查詢。

---

## OLTP vs OLAP

| | OLTP（如 PostgreSQL） | OLAP（如 ClickHouse） |
|---|---|---|
| 設計目標 | 交易型讀寫 | 聚合分析查詢 |
| 資料儲存 | 列導向（row-oriented） | 欄導向（column-oriented） |
| 查詢類型 | 點查詢、JOIN | GROUP BY、SUM、COUNT |
| 寫入 | 逐列寫入 | 批次寫入 |
| 適合場景 | 使用者資料、訂單、關聯 | 行為事件、日誌、指標 |

**欄導向的關鍵優勢**：分析查詢通常只用幾個欄位（`SELECT event_type, COUNT(*) FROM events GROUP BY event_type`），列導向需要讀整列，欄導向只讀那幾個欄的資料，I/O 少很多。加上同一欄的資料型別相同，壓縮率高——ClickHouse 的壓縮通常比 PostgreSQL 好 5-10 倍。

---

## ClickHouse 的核心特性

**MergeTree 引擎**：ClickHouse 的預設 table engine，資料寫入後非同步合併，primary key 排序，範圍查詢效率高。

**向量化執行**：查詢引擎用 SIMD 指令批次處理資料，同一個操作一次處理多行，比逐列處理快很多。

**分散式查詢**：ClickHouse Cluster 支援 sharding 和 replication，單機跑不下時水平擴展。

**SQL 相容**：基本 SQL 語法跟 PostgreSQL 差不多，有一些 ClickHouse 特有的函數（如 `toStartOfHour()`、`quantile()`）。

---

## 基本用法

**建立事件表**

```sql
CREATE TABLE user_events (
    event_id     UUID DEFAULT generateUUIDv4(),
    user_id      String,
    event_type   LowCardinality(String),  -- 重複值多，用 LowCardinality 壓縮
    page         String,
    duration_ms  UInt32,
    created_at   DateTime DEFAULT now()
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(created_at)   -- 按月分 partition
ORDER BY (user_id, created_at);      -- primary key，排序索引
```

幾個 ClickHouse 的型別選擇技巧：
- `LowCardinality(String)`：欄位值的種類少（如 event_type 就幾十種），用這個壓縮效果很好
- `DateTime` vs `DateTime64`：前者精確到秒，後者到毫秒
- partition by 月份讓查詢可以跳過不相關的 partition，加速「查最近 30 天」這類查詢

**寫入資料**

```sql
-- 批次寫入（千筆以上效率最好）
INSERT INTO user_events (user_id, event_type, page, duration_ms)
VALUES
  ('user-1', 'page_view', '/dashboard', 1200),
  ('user-2', 'click', '/goals', 300),
  ...
```

ClickHouse 不適合逐筆寫入（一筆 INSERT 建一個 part），要批次寫，或者用 Buffer table 做緩衝。

**聚合查詢**

```sql
-- 過去 7 天各 event_type 的使用次數
SELECT
    event_type,
    COUNT(*) AS cnt,
    COUNT(DISTINCT user_id) AS unique_users
FROM user_events
WHERE created_at >= now() - INTERVAL 7 DAY
GROUP BY event_type
ORDER BY cnt DESC;

-- 每日活躍使用者趨勢
SELECT
    toDate(created_at) AS date,
    COUNT(DISTINCT user_id) AS dau
FROM user_events
WHERE created_at >= now() - INTERVAL 30 DAY
GROUP BY date
ORDER BY date;
```

這種查詢在 PostgreSQL 跑幾百萬行可能要幾秒到幾十秒，ClickHouse 通常在幾百毫秒內搞定。

---

## 島島怎麼用 ClickHouse

島島在 Python AI 後端（`daodao-ai-backend`）引入 ClickHouse，專門處理使用行為分析：

**記錄的事件類型**
- `page_view`：頁面瀏覽（哪個頁面、停留多久）
- `practice_start` / `practice_complete`：學習實踐的開始和完成
- `goal_interaction`：目標頁的互動行為
- `social_action`：追蹤、按讚、留言等社交動作

**用途：推薦引擎特徵工程**

```python
# Celery 任務，定期從 ClickHouse 拉特徵
@app.task
def build_user_features(user_id: str):
    features = clickhouse_client.query("""
        SELECT
            COUNT(*) AS total_practices,
            AVG(duration_ms) AS avg_session_duration,
            groupArray(event_type) AS recent_actions
        FROM user_events
        WHERE user_id = %(user_id)s
          AND created_at >= now() - INTERVAL 14 DAY
    """, parameters={"user_id": user_id})

    # 把特徵向量存回 Redis 快取，推薦引擎使用
    redis.set(f"features:{user_id}", json.dumps(features), ex=3600)
```

**架構分工**

```
使用者操作
    │
    ├── 寫 PostgreSQL（結構化資料：目標、實踐記錄、社交關係）
    │
    └── 寫 ClickHouse（行為事件：頁面瀏覽、互動、學習進度）
                │
        Celery Worker（特徵工程）
                │
          推薦引擎（Qdrant 語意搜尋 + 行為特徵）
```

PostgreSQL 和 ClickHouse 的職責分界清楚：PostgreSQL 負責「這個使用者有什麼資料」，ClickHouse 負責「這個使用者做了什麼行為」。

---

## 連接 ClickHouse（Python）

```bash
pip install clickhouse-connect
```

```python
import clickhouse_connect

client = clickhouse_connect.get_client(
    host='localhost',
    port=8123,
    username='default',
    password='',
    database='daodao',
)

# 插入
client.insert('user_events', [
    ['user-123', 'page_view', '/dashboard', 1200],
], column_names=['user_id', 'event_type', 'page', 'duration_ms'])

# 查詢
result = client.query(
    "SELECT event_type, COUNT(*) FROM user_events GROUP BY event_type"
)
for row in result.result_rows:
    print(row)
```

---

## 取捨

**優點**
- 聚合查詢極快，億級資料幾秒跑完
- 壓縮率高，儲存成本比 PostgreSQL 低
- SQL 語法熟悉，學習曲線低
- 開源，可自架或用 ClickHouse Cloud

**缺點**
- 不支援 UPDATE / DELETE（技術上可以，但很慢且有限制）——事件資料本來就不需要改，但如果你的資料需要頻繁修改就不適合
- JOIN 效能比 PostgreSQL 差，設計上應盡量 denormalize
- 逐筆寫入效率差，要批次
- 不適合取代 PostgreSQL 做 OLTP——這是兩個互補工具

---

## 什麼時候該加 ClickHouse

如果你的 PostgreSQL 分析查詢還在幾百毫秒以內，不用急著加 ClickHouse。加入的時機：

- events / logs table 超過幾百萬行，GROUP BY 開始變慢
- 需要跨多個維度的即時分析（每日活躍、留存率、漏斗分析）
- 推薦系統需要大量行為特徵工程

早期 MVP 一個 PostgreSQL 就夠了。等到真的痛了再加，不要過早優化。

---

## 參考資料

- [ClickHouse 官方文件](https://clickhouse.com/docs)
- [MergeTree 引擎詳解](https://clickhouse.com/docs/en/engines/table-engines/mergetree-family/mergetree)
- [clickhouse-connect Python client](https://github.com/ClickHouse/clickhouse-connect)
- [ClickHouse vs PostgreSQL 比較](https://clickhouse.com/docs/en/faq/general/columnar-database)
- [島島阿學技術架構全覽](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture) — ClickHouse 在 AI 後端作為行為分析資料庫，搭配 Qdrant 和 Celery 構成推薦引擎特徵工程管線的完整脈絡
