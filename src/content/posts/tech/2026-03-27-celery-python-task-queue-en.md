---
title: "Celery: The Standard Distributed Task Queue for Python"
date: 2026-03-27
type: guide
category: tech
tags: [celery, python, task-queue, async]
lang: en
tldr: "Celery is Python's go-to distributed task queue, using Redis or RabbitMQ as a broker to offload long-running work to the background. DaoDao's AI service uses it to handle async tasks like LLM feedback generation."
description: "Celery makes it easy to push tasks into background execution in Python applications, with support for retries, scheduling, priority queues, and task chaining. This post covers Celery's core architecture, configuration, and how DaoDao's AI service (FastAPI + Celery) uses it to handle time-intensive AI inference tasks."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-27-celery-python-task-queue)

Python's async/await handles I/O concurrency well, but CPU-intensive work or tasks that wait on external APIs (like calling an LLM) will still slow down your API if they sit inside the request/response cycle. The solution is to push these tasks into a background queue and let worker processes consume them asynchronously.

Celery is the standard tool for this in the Python ecosystem — mature, well-integrated, and supported by FastAPI, Django, and Flask alike.

---

## What Is Celery

Celery is a distributed task queue framework made up of three roles:

- **Producer**: the party that pushes tasks into the queue (usually the API server)
- **Broker**: the message intermediary that holds pending tasks (Redis or RabbitMQ)
- **Worker**: the process that pulls tasks from the broker and executes them

```
FastAPI (Producer)
      │
      ▼
   Redis (Broker)
      │
      ▼
Celery Worker(s)
```

You can run multiple workers and scale horizontally with ease. The broker ensures each task is picked up by exactly one worker (at-least-once semantics — idempotency is your responsibility if needed).

---

## Installation

```bash
pip install celery redis
```

---

## Basic Configuration

**`celery_app.py`**

```python
from celery import Celery

app = Celery(
    'daodao_ai',
    broker='redis://localhost:6379/0',
    backend='redis://localhost:6379/1',  # store task results
)

app.conf.update(
    task_serializer='json',
    result_serializer='json',
    accept_content=['json'],
    timezone='Asia/Taipei',
    enable_utc=True,
)
```

The broker stores pending tasks; the backend stores execution results. If you don't need to query results, you can omit the backend.

---

## Defining and Calling Tasks

**Defining a task**

```python
from celery_app import app

@app.task(
    bind=True,
    max_retries=3,
    default_retry_delay=60,  # seconds
)
def generate_ai_feedback(self, user_id: str, practice_id: str):
    try:
        # Call LLM to generate learning feedback
        feedback = llm_client.generate(
            prompt=build_feedback_prompt(user_id, practice_id)
        )
        save_feedback(practice_id, feedback)
        return {"status": "ok", "practice_id": practice_id}
    except Exception as exc:
        raise self.retry(exc=exc)
```

**Calling from FastAPI**

```python
from fastapi import FastAPI
from tasks import generate_ai_feedback

api = FastAPI()

@api.post("/practices/{practice_id}/feedback")
async def request_feedback(practice_id: str, user_id: str):
    # Push to queue, respond immediately with 202
    task = generate_ai_feedback.delay(user_id, practice_id)
    return {"task_id": task.id, "status": "queued"}

@api.get("/tasks/{task_id}")
async def get_task_status(task_id: str):
    from celery.result import AsyncResult
    result = AsyncResult(task_id)
    return {"status": result.status, "result": result.result}
```

---

## Scheduled Tasks (Celery Beat)

Celery Beat is a scheduler — similar to crontab — that triggers tasks on a recurring schedule.

```python
from celery.schedules import crontab

app.conf.beat_schedule = {
    # Refresh recommendation cache at 2 AM daily
    'refresh-recommendations': {
        'task': 'tasks.refresh_recommendation_cache',
        'schedule': crontab(hour=2, minute=0),
    },
    # Update embeddings every hour
    'update-embeddings': {
        'task': 'tasks.update_user_embeddings',
        'schedule': crontab(minute=0),
    },
}
```

Start the Beat scheduler (runs as a separate process):

```bash
celery -A celery_app beat --loglevel=info
```

---

## Starting Workers

```bash
# Single worker with 4 concurrent processes
celery -A celery_app worker --concurrency=4 --loglevel=info

# Specify queues (route different tasks to different queues)
celery -A celery_app worker -Q ai_tasks,default --concurrency=4
```

---

## Task Chaining and Grouping

Celery lets you compose tasks into pipelines:

```python
from celery import chain, group

# Chain: execute in sequence
result = chain(
    preprocess_data.s(user_id),
    generate_embeddings.s(),
    update_recommendations.s(),
).delay()

# Group: execute in parallel, wait for all to finish
result = group(
    generate_feedback.s(pid) for pid in practice_ids
).delay()
```

This is particularly useful in AI pipelines: generate embeddings first, then do a vector search, then run LLM generation — each step can be retried independently.

---

## How DaoDao Uses Celery

DaoDao's Python AI backend (`daodao-ai-backend`) is a FastAPI + Celery stack, with Redis serving as both the BullMQ broker and the Celery broker (separated by different DB indices).

**Main task types**

- **`generate_ai_feedback`**: After a user completes a learning practice, asynchronously calls an LLM to generate personalized feedback. This can take 10–30 seconds — far too long to block a request.
- **`update_user_embeddings`**: When a user updates their learning goals or practice records, recomputes embeddings and stores them in Qdrant for the recommendation engine.
- **`refresh_recommendation_cache`**: Periodically pulls the latest behavior data from ClickHouse, recomputes recommendations, and caches the results in Redis.

```
FastAPI endpoint receives request
        │
        └── .delay() pushes task into Redis
                │
        Celery Worker picks it up
                │
                ├── Calls LLM (Ollama / OpenAI)
                ├── Writes result back to PostgreSQL
                └── Updates Redis cache
```

The Node.js backend triggers these tasks via HTTP calls to FastAPI. As long as FastAPI returns 202 Accepted, the Node.js side doesn't need to wait for Celery to finish.

---

## Monitoring: Flower

The official Celery monitoring tool is Flower — it shows worker status, task execution history, and failed tasks:

```bash
pip install flower
celery -A celery_app flower --port=5555
```

---

## Trade-offs

**Pros**
- The most mature option in the Python ecosystem, with full integrations for Django, FastAPI, and Flask
- Feature-complete: retries, scheduling, task chaining, worker priority queues
- Straightforward horizontal scaling — just spin up more worker processes
- Comprehensive monitoring via Flower

**Cons**
- More setup complexity than BullMQ (broker + backend + beat scheduler = three separate processes)
- Not cross-language friendly: a Node.js BullMQ job cannot be consumed directly by a Celery worker
- Serialization gotcha: task payloads default to pickle; switch to JSON for safety
- At-least-once semantics: a task may execute more than once if a worker crashes and restarts — idempotency must be handled explicitly

---

## Celery vs BullMQ

| | Celery | BullMQ |
|---|---|---|
| Language | Python | Node.js |
| Broker | Redis / RabbitMQ | Redis (only) |
| Scheduling | Celery Beat | Native cron repeat |
| Task chaining | chain / group | Flow |
| Monitoring | Flower | Bull Board |

The language determines the choice. DaoDao's Python AI service uses Celery; the Node.js backend uses BullMQ. The two are independent and share the same Redis instance on different DB indices.

---

## References

- [Celery Official Docs](https://docs.celeryq.dev/)
- [Celery + Redis Configuration Guide](https://docs.celeryq.dev/en/stable/getting-started/backends-and-brokers/redis.html)
- [Flower Monitoring Tool](https://flower.readthedocs.io/)
- [FastAPI + Celery Integration Example](https://testdriven.io/blog/fastapi-and-celery/)
- [DaoDao Tech Architecture Overview](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture) — The full architecture of how Celery powers LLM feedback generation and embedding updates in the Python AI service (FastAPI + Celery)
