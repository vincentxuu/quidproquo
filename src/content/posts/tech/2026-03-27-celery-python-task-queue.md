---
title: "Celery：Python 生態裡分散式任務佇列的標準解法"
date: 2026-03-27
type: guide
category: tech
tags: [celery, python, task-queue, async]
lang: zh-TW
tldr: "Celery 是 Python 最主流的分散式任務佇列，用 Redis 或 RabbitMQ 當 broker，讓耗時工作跑在背景。島島的 AI 服務用它處理 LLM 回饋生成等非同步任務。"
description: "Celery 讓 Python 應用輕鬆把任務推進背景執行，支援重試、排程、優先級、任務鏈。這篇介紹 Celery 的基本架構、設定方式，以及島島（DaoDao）AI 服務（FastAPI + Celery）如何用它處理耗時的 AI 推論任務。"
draft: false
---

🌏 [English version](/posts/tech/2026-03-27-celery-python-task-queue-en)

Python 的 async/await 可以處理 I/O 並發，但 CPU 密集或需要長時間等待外部 API（像是呼叫 LLM）的任務，塞在 request/response 週期裡一樣會讓 API 變慢。解法是把這些任務推進背景佇列，讓 worker process 非同步消化。

Celery 是 Python 生態裡做這件事的標準工具，成熟、有完整生態、FastAPI / Django / Flask 都支援。

---

## Celery 是什麼

Celery 是分散式任務佇列框架，由三個角色組成：

- **Producer**：把任務推進佇列的那一方（通常是 API server）
- **Broker**：訊息中介，存放待處理的任務（用 Redis 或 RabbitMQ）
- **Worker**：從 broker 取任務出來執行的 process

```
FastAPI (Producer)
      │
      ▼
   Redis (Broker)
      │
      ▼
Celery Worker(s)
```

Worker 可以開多個 process，水平擴展很直接。Broker 負責確保每個任務只被一個 worker 取走（at-least-once 語意，需要 idempotency 要自己處理）。

---

## 安裝

```bash
pip install celery redis
```

---

## 基本設定

**`celery_app.py`**

```python
from celery import Celery

app = Celery(
    'daodao_ai',
    broker='redis://localhost:6379/0',
    backend='redis://localhost:6379/1',  # 存任務結果
)

app.conf.update(
    task_serializer='json',
    result_serializer='json',
    accept_content=['json'],
    timezone='Asia/Taipei',
    enable_utc=True,
)
```

Broker 存待處理任務，Backend 存執行結果。如果不需要查詢結果，可以不設 backend。

---

## 定義和呼叫任務

**定義任務**

```python
from celery_app import app

@app.task(
    bind=True,
    max_retries=3,
    default_retry_delay=60,  # 秒
)
def generate_ai_feedback(self, user_id: str, practice_id: str):
    try:
        # 呼叫 LLM 生成學習回饋
        feedback = llm_client.generate(
            prompt=build_feedback_prompt(user_id, practice_id)
        )
        save_feedback(practice_id, feedback)
        return {"status": "ok", "practice_id": practice_id}
    except Exception as exc:
        raise self.retry(exc=exc)
```

**從 FastAPI 呼叫**

```python
from fastapi import FastAPI
from tasks import generate_ai_feedback

api = FastAPI()

@api.post("/practices/{practice_id}/feedback")
async def request_feedback(practice_id: str, user_id: str):
    # 丟進佇列，立即回應 202
    task = generate_ai_feedback.delay(user_id, practice_id)
    return {"task_id": task.id, "status": "queued"}

@api.get("/tasks/{task_id}")
async def get_task_status(task_id: str):
    from celery.result import AsyncResult
    result = AsyncResult(task_id)
    return {"status": result.status, "result": result.result}
```

---

## 排程任務（Celery Beat）

Celery Beat 是排程器，類似 crontab，讓任務定時執行。

```python
from celery.schedules import crontab

app.conf.beat_schedule = {
    # 每天凌晨 2 點更新推薦快取
    'refresh-recommendations': {
        'task': 'tasks.refresh_recommendation_cache',
        'schedule': crontab(hour=2, minute=0),
    },
    # 每小時跑一次 embedding 更新
    'update-embeddings': {
        'task': 'tasks.update_user_embeddings',
        'schedule': crontab(minute=0),
    },
}
```

啟動 Beat scheduler（獨立 process）：

```bash
celery -A celery_app beat --loglevel=info
```

---

## 啟動 Worker

```bash
# 單一 worker，4 個並發
celery -A celery_app worker --concurrency=4 --loglevel=info

# 指定 queue（不同任務分到不同 queue）
celery -A celery_app worker -Q ai_tasks,default --concurrency=4
```

---

## 任務鏈（Chain）和分組（Group）

Celery 支援把多個任務串起來：

```python
from celery import chain, group

# Chain：依序執行
result = chain(
    preprocess_data.s(user_id),
    generate_embeddings.s(),
    update_recommendations.s(),
).delay()

# Group：並行執行，等所有完成
result = group(
    generate_feedback.s(pid) for pid in practice_ids
).delay()
```

這在 AI pipeline 裡很有用：先做 embedding，再做向量搜尋，再做 LLM 生成，每一步都可以獨立 retry。

---

## 島島的 AI 服務怎麼用 Celery

島島的 Python AI 後端（`daodao-ai-backend`）是 FastAPI + Celery 的組合，Redis 同時當 BullMQ 的 broker 和 Celery 的 broker（用不同的 db index 隔開）。

**主要任務類型**

- **`generate_ai_feedback`**：使用者完成學習實踐後，非同步呼叫 LLM 生成個人化回饋，可能要 10-30 秒，不能在 request 裡等
- **`update_user_embeddings`**：使用者更新學習目標或實踐記錄時，重新計算 embedding 存到 Qdrant，供推薦引擎使用
- **`refresh_recommendation_cache`**：定期從 ClickHouse 拿最新的行為資料，重新算推薦結果存到 Redis

```
FastAPI endpoint 收到請求
        │
        └── .delay() 把任務推進 Redis
                │
        Celery Worker 取走
                │
                ├── 呼叫 LLM（Ollama / OpenAI）
                ├── 寫結果回 PostgreSQL
                └── 更新 Redis 快取
```

Node.js 後端透過 HTTP 呼叫 FastAPI 觸發這些任務，只要 FastAPI 回 202 Accepted 就好，不用等 Celery 跑完。

---

## 監控：Flower

Celery 的官方監控工具是 Flower，可以看 worker 狀態、任務執行歷史、失敗任務：

```bash
pip install flower
celery -A celery_app flower --port=5555
```

---

## 取捨

**優點**
- Python 生態最成熟的選擇，Django / FastAPI / Flask 都有完整整合
- 功能完整：重試、排程、任務鏈、worker 優先級
- 水平擴展直接，多開 worker process 即可
- Flower 監控介面完整

**缺點**
- 設定比 BullMQ 複雜一些（broker + backend + beat scheduler 三個 process）
- 跨語言不友好：Node.js 的 BullMQ job 不能直接被 Celery worker 消費
- 序列化坑：task payload 預設用 pickle，要改成 json 才安全
- at-least-once 語意：任務可能被執行超過一次（worker crash 重啟），需要自己處理 idempotency

---

## Celery vs BullMQ

| | Celery | BullMQ |
|---|---|---|
| 語言 | Python | Node.js |
| Broker | Redis / RabbitMQ | Redis（唯一） |
| 排程 | Celery Beat | 原生 Cron repeat |
| 任務鏈 | chain / group | Flow |
| 監控 | Flower | Bull Board |

語言決定選哪個。島島的 Python AI 服務用 Celery，Node.js 後端用 BullMQ，兩邊各自獨立，共用同一台 Redis（不同 db index）。

---

## 參考資料

- [Celery 官方文件](https://docs.celeryq.dev/)
- [Celery + Redis 設定指南](https://docs.celeryq.dev/en/stable/getting-started/backends-and-brokers/redis.html)
- [Flower 監控工具](https://flower.readthedocs.io/)
- [FastAPI + Celery 整合範例](https://testdriven.io/blog/fastapi-and-celery/)
- [島島阿學技術架構全覽](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture) — Celery 在 Python AI 服務（FastAPI + Celery）中處理 LLM 回饋生成與 embedding 更新的實際架構
