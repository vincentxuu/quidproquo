---
title: "FastAPI：Python AI 服務的標準答案"
date: 2026-03-27
type: guide
category: tech
tags: [fastapi, python, api, async]
lang: zh-TW
tldr: "FastAPI 是基於 Python type hint 的現代 Web framework，自動生成 OpenAPI 文件、原生 async 支援、效能接近 Node.js。AI/ML 服務的首選，也是 Python 後端裡最值得學的框架。"
description: "介紹 FastAPI：為什麼它在 AI 服務場景裡比 Flask 和 Django 更合適、Pydantic 型別驗證、async 設計，以及島島（DaoDao）如何用它搭建獨立的 AI 推薦服務。"
draft: false
---

🌏 [English version](/posts/tech/2026-03-27-fastapi-python-backend-en)

Python 後端框架的老問題：Flask 太簡陋、Django 太重。FastAPI 在 2018 年出現，補上了這個空缺——輕量、type-safe、async-first、自動文件。特別是在 AI/ML 服務這個場景，它幾乎已經是事實標準。

島島（DaoDao）把 AI 服務獨立成 Python FastAPI 應用（`daodao-ai-backend`），和 Node.js 主後端分開部署。這個決策很合理：Python 在 ML 生態的工具鏈遠優於 Node.js，LangChain、sentence-transformers、scikit-learn 都在 Python 生態，強行用 Node.js 跑 AI 是自找麻煩。

## 它是什麼

FastAPI 建在 Starlette（ASGI web framework）和 Pydantic（資料驗證）之上，核心特性：

- **型別推斷**：Python type hint 直接成為 runtime validation 邏輯
- **自動 OpenAPI 文件**：在 `/docs` 開箱即用的 Swagger UI
- **原生 async**：`async def` 路由，IO-bound 任務不阻塞
- **效能**：比 Flask/Django 快，接近 Node.js 和 Go 的水準（基於 ASGI + uvicorn）

## 基礎範例

一個最簡單的 FastAPI 應用：

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
    # Pydantic 自動驗證 request body
    # response_model 自動過濾多餘欄位
    items = await get_recommendations(req.user_id, req.limit)
    return RecommendResponse(items=items, score=0.92)
```

`req` 的型別、驗證、OpenAPI schema 全部從 `RecommendRequest` 這個 Pydantic model 自動生成。不需要另外寫 validation 邏輯，不需要手寫 OpenAPI spec。

## Pydantic：型別就是文件就是驗證

FastAPI 最核心的設計理念是：**型別定義同時是文件、驗證和 IDE 補全的來源**。

```python
from pydantic import BaseModel, Field, validator
from typing import Optional
from enum import Enum

class ContentType(str, Enum):
    article = "article"
    video = "video"
    course = "course"

class SearchRequest(BaseModel):
    query: str = Field(min_length=1, max_length=500, description="搜尋關鍵字")
    content_type: Optional[ContentType] = None
    limit: int = Field(default=10, ge=1, le=100)

    @validator('query')
    def strip_whitespace(cls, v):
        return v.strip()
```

FastAPI 會把這個 schema 轉成 OpenAPI 的 request body 定義，包含欄位說明、型別約束、enum 選項——全部自動。

## Dependency Injection

FastAPI 的 DI 系統讓共用邏輯變得乾淨：

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

`Depends()` 可以巢狀，FastAPI 自動解析依賴關係、處理 lifecycle（`yield` 讓 db session 在請求結束後自動關閉）。

## 島島的 AI 服務架構

島島的 `daodao-ai-backend` 處理：

- **LLM 推薦引擎**：根據使用者學習歷程推薦資源和社群成員
- **語意搜尋**：embedding 存 Qdrant，用語意相似度找相關內容
- **Celery 非同步任務**：耗時的 AI 回饋生成放背景跑

```python
from fastapi import FastAPI, BackgroundTasks
from celery import Celery
import httpx

app = FastAPI()
celery = Celery(broker="redis://localhost:6379/0")

@app.post("/recommend")
async def recommend(user_id: str, background_tasks: BackgroundTasks):
    # 即時回傳快取結果
    cached = await redis.get(f"recommend:{user_id}")
    if cached:
        return json.loads(cached)

    # 背景非同步更新
    background_tasks.add_task(refresh_recommendations, user_id)
    return {"items": [], "status": "computing"}

@celery.task
def generate_ai_feedback(practice_id: str):
    # 耗時任務放 Celery，不阻塞 API 回應
    feedback = llm.generate(get_practice(practice_id))
    save_feedback(practice_id, feedback)
```

Node.js 後端透過 HTTP 呼叫 FastAPI，兩邊各自維護自己的資料：

```typescript
// Node.js 側呼叫 FastAPI
const response = await fetch(`${AI_BACKEND_URL}/recommend`, {
  method: 'POST',
  body: JSON.stringify({ user_id: userId }),
  headers: { 'Content-Type': 'application/json' }
})
const { items } = await response.json()
```

## Async 與 Sync 的選擇

FastAPI 同時支援 `async def` 和普通 `def`：

```python
# IO-bound：用 async，不阻塞 event loop
@app.get("/search")
async def search(q: str):
    results = await qdrant.search(q)  # 等待 DB
    return results

# CPU-bound：用普通 def，FastAPI 會放到 thread pool
@app.post("/embed")
def embed(text: str):
    vector = model.encode(text)  # CPU 密集運算
    return vector.tolist()
```

規則很簡單：等待 IO（資料庫、HTTP）用 `async`，CPU 密集用普通 `def`。FastAPI 會把普通 `def` 放到 thread pool 執行，避免阻塞 event loop。

## Tradeoffs

**FastAPI 的問題：**

- **Python GIL**：CPU-bound 任務的並行能力受限，需要 multiprocessing 或 Celery 繞過
- **生態相對年輕**：比 Flask/Django 新，某些企業場景的 middleware 還不完整
- **型別系統是 Python 的**：比 TypeScript 寬鬆，`Any` 很容易溜進來讓型別保證消失

**值得選的理由：**

- AI/ML 工具鏈在 Python 生態，FastAPI 讓你不需要在 ML 和 API 框架之間妥協
- 自動 OpenAPI 文件讓前後端對接更順
- 效能比 Flask 好一個數量級
- Pydantic v2 之後型別驗證速度大幅提升

如果你的 Python 服務主要是 AI/ML 推論，FastAPI + Celery（非同步任務）+ Redis（快取）這個組合幾乎是標準配備。

## 參考資料

- [FastAPI 官方文件](https://fastapi.tiangolo.com/)
- [Pydantic 官方文件](https://docs.pydantic.dev/)
- [Celery 官方文件](https://docs.celeryq.dev/)
- [Qdrant 向量資料庫](https://qdrant.tech/documentation/)
- [島島阿學技術架構全覽](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture) — FastAPI 在雙後端架構中的定位
