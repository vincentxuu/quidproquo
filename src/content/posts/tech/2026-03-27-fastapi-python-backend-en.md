---
title: "FastAPI: The Go-To Framework for Python AI Services"
date: 2026-03-27
type: guide
category: tech
tags: [fastapi, python, api, async]
lang: en
tldr: "FastAPI is a modern Python web framework built on type hints — it auto-generates OpenAPI docs, supports native async, and delivers performance close to Node.js. It's the top choice for AI/ML services and the most worthwhile framework to learn in the Python backend ecosystem."
description: "An introduction to FastAPI: why it outshines Flask and Django for AI service workloads, how Pydantic handles type validation, its async-first design, and how DaoDao uses it to build a standalone AI recommendation service."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-27-fastapi-python-backend)

The Python backend ecosystem has long had a familiar problem: Flask is too bare-bones, Django is too heavy. FastAPI arrived in 2018 to fill that gap — lightweight, type-safe, async-first, and with automatic documentation baked in. For AI/ML services in particular, it has become the de facto standard.

DaoDao separates its AI layer into a standalone Python FastAPI application (`daodao-ai-backend`), deployed independently from the Node.js main backend. This is a sensible split: Python's ML toolchain is far superior to Node.js — LangChain, sentence-transformers, and scikit-learn all live in the Python ecosystem. Forcing Node.js to run AI workloads is asking for pain.

## What It Is

FastAPI is built on top of Starlette (an ASGI web framework) and Pydantic (data validation). Its core features:

- **Type inference**: Python type hints become runtime validation logic directly
- **Automatic OpenAPI docs**: Swagger UI available out of the box at `/docs`
- **Native async**: `async def` routes that don't block on IO-bound tasks
- **Performance**: Faster than Flask/Django, approaching Node.js and Go levels (powered by ASGI + uvicorn)

## Basic Example

The simplest possible FastAPI application:

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class RecommendRequest(BaseModel):
    user_id: str
    limit: int = 10

class RecommendResponse(BaseModel):
    items: list[str]
    score: float

@app.post("/recommend", response_model=RecommendResponse)
async def recommend(req: RecommendRequest) -> RecommendResponse:
    # Pydantic automatically validates the request body
    # response_model automatically strips extra fields
    items = await get_recommendations(req.user_id, req.limit)
    return RecommendResponse(items=items, score=0.92)
```

The type information, validation logic, and OpenAPI schema for `req` are all generated automatically from the `RecommendRequest` Pydantic model. No separate validation code to write, no manual OpenAPI spec.

## Pydantic: Types as Docs, Types as Validation

The core design philosophy of FastAPI is: **a type definition is simultaneously documentation, validation, and the source of IDE completions.**

```python
from pydantic import BaseModel, Field, validator
from typing import Optional
from enum import Enum

class ContentType(str, Enum):
    article = "article"
    video = "video"
    course = "course"

class SearchRequest(BaseModel):
    query: str = Field(min_length=1, max_length=500, description="Search keyword")
    content_type: Optional[ContentType] = None
    limit: int = Field(default=10, ge=1, le=100)

    @validator('query')
    def strip_whitespace(cls, v):
        return v.strip()
```

FastAPI converts this schema into an OpenAPI request body definition — including field descriptions, type constraints, and enum options — all automatically.

## Dependency Injection

FastAPI's DI system keeps shared logic clean:

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer

security = HTTPBearer()

async def get_current_user(token: str = Depends(security)) -> dict:
    payload = verify_jwt(token.credentials)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    return payload

async def get_db():
    async with AsyncSession(engine) as session:
        yield session

@app.get("/me")
async def get_me(
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return {"user_id": user["sub"]}
```

`Depends()` can be nested, and FastAPI automatically resolves the dependency graph and handles lifecycle management — the `yield` pattern ensures the DB session is closed automatically after the request completes.

## DaoDao's AI Service Architecture

DaoDao's `daodao-ai-backend` handles:

- **LLM recommendation engine**: recommends resources and community members based on a user's learning history
- **Semantic search**: embeddings stored in Qdrant, retrieved by semantic similarity
- **Celery async tasks**: time-consuming AI feedback generation runs in the background

```python
from fastapi import FastAPI, BackgroundTasks
from celery import Celery
import httpx

app = FastAPI()
celery = Celery(broker="redis://localhost:6379/0")

@app.post("/recommend")
async def recommend(user_id: str, background_tasks: BackgroundTasks):
    # Return cached result immediately
    cached = await redis.get(f"recommend:{user_id}")
    if cached:
        return json.loads(cached)

    # Async refresh in the background
    background_tasks.add_task(refresh_recommendations, user_id)
    return {"items": [], "status": "computing"}

@celery.task
def generate_ai_feedback(practice_id: str):
    # Time-consuming tasks go to Celery, keeping API responses non-blocking
    feedback = llm.generate(get_practice(practice_id))
    save_feedback(practice_id, feedback)
```

The Node.js backend calls FastAPI over HTTP, with each side managing its own data:

```typescript
// Node.js calling FastAPI
const response = await fetch(`${AI_BACKEND_URL}/recommend`, {
  method: 'POST',
  body: JSON.stringify({ user_id: userId }),
  headers: { 'Content-Type': 'application/json' }
})
const { items } = await response.json()
```

## Choosing Between Async and Sync

FastAPI supports both `async def` and regular `def`:

```python
# IO-bound: use async to avoid blocking the event loop
@app.get("/search")
async def search(q: str):
    results = await qdrant.search(q)  # wait for DB
    return results

# CPU-bound: use regular def; FastAPI routes it to a thread pool
@app.post("/embed")
def embed(text: str):
    vector = model.encode(text)  # CPU-intensive computation
    return vector.tolist()
```

The rule is simple: use `async` when waiting on IO (databases, HTTP); use regular `def` for CPU-intensive work. FastAPI automatically runs regular `def` routes in a thread pool to avoid blocking the event loop.

## Tradeoffs

**FastAPI's weaknesses:**

- **Python GIL**: limits parallelism for CPU-bound tasks — you'll need multiprocessing or Celery to work around it
- **Relatively young ecosystem**: newer than Flask/Django; some enterprise middleware is still maturing
- **Python's type system**: looser than TypeScript — `Any` can quietly creep in and undermine type guarantees

**Why it's worth choosing:**

- The AI/ML toolchain lives in the Python ecosystem; FastAPI lets you avoid compromising between ML libraries and your API framework
- Automatic OpenAPI docs streamline frontend-backend integration
- Performance is an order of magnitude better than Flask
- Pydantic v2 brought a major speed boost to type validation

If your Python service is primarily AI/ML inference, the combination of FastAPI + Celery (async tasks) + Redis (caching) is essentially the standard stack.

## References

- [FastAPI official docs](https://fastapi.tiangolo.com/)
- [Pydantic official docs](https://docs.pydantic.dev/)
- [Celery official docs](https://docs.celeryq.dev/)
- [Qdrant vector database](https://qdrant.tech/documentation/)
- [DaoDao Technical Architecture Overview](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture) — FastAPI's role in the dual-backend architecture
