---
title: "Django：ORM、Admin、Auth 與長期演進的 Python Web Framework"
date: 2026-08-22
category: tech
type: deep-dive
tags: [django, python, backend, orm, web-development]
lang: zh-TW
tldr: "Django 的價值是把資料模型、migration、auth、admin、forms 與安全預設組成一致系統；代價是要理解 QuerySet、middleware、async 邊界與 production settings。"
description: "介紹 Django project/app、ORM 與 migrations、admin、auth、middleware、ASGI async、安全部署，以及與 API-first framework 的選型差異。"
series:
  name: "AI 時代的技術選擇"
  order: 97
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-django-web-framework-en)

[Django](https://docs.djangoproject.com/en/5.2/) 是 Python 的 batteries-included web framework。它不是只把 HTTP request 映射成 function，而是把 URL routing、views、ORM、migrations、auth、sessions、admin、forms、templates、cache 與安全機制放進同一套演進模型。當產品核心是關聯資料、後台流程與權限管理，這種整合通常比單項 benchmark 更重要。

## Project 是部署單位，app 是可組合能力

Django project 管 settings、root URLconf、WSGI/ASGI entrypoint；app 封裝一塊 domain capability，並可獨立測試或打包重用。不要把 app 誤當成 microservice：同一 process、database transaction 與 deployment boundary 內，app 只是模組化邊界。

Model 同時描述欄位、關聯和常用查詢；`makemigrations` 把 model 差異寫成版本化 migration，`migrate` 才執行。Migration 是 schema history，不是自動的零停機保證。大型 table 新增 non-null column、建 index、改型別或 data migration，仍需 expand/migrate/contract、分批 backfill、lock timeout 與 rollback 設計。

```py
from django.db import models

class Note(models.Model):
    title = models.CharField(max_length=200)
    owner = models.ForeignKey("auth.User", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

notes = Note.objects.filter(owner=request.user).select_related("owner")[:20]
```

QuerySet 是 lazy 的；template iteration、`len()`、serialization 或關聯存取才可能真正查 DB。列表頁要主動檢查 N+1，依關係使用 `select_related`／`prefetch_related`，並用 query count、execution plan 與 production-like data 驗證。需要原子性時明確用 `transaction.atomic()`，不要假設一次 request 自動是一個 transaction。

## Admin 與 auth 是槓桿，不是公共產品介面

Django admin 能根據 model 快速建立內部 CRUD、搜尋、filter 與權限操作，非常適合營運和客服後台；它是給可信任 staff 的管理工具，不應直接當消費者產品 UI。內建 auth 提供 user、password hashing、permissions、groups、sessions 與 authentication backend；若一開始就需要自訂 user identifier，應在第一次 migration 前建立 custom user model，事後替換成本很高。

Middleware 像洋蔥包住 request/response，順序直接影響 session、authentication、CSRF、messages 與 exception handling。SecurityMiddleware、CSRF protection、template escaping、ORM parameterization 和 clickjacking headers 降低常見風險，但不會修正錯誤的 raw SQL、`mark_safe`、不可信 upload、object-level authorization 或 production settings。

## ASGI 不會自動把整條 stack 變 async

Django 支援 async views，部署在 ASGI 下可受益於 long-polling、streaming 與大量慢連線；在 WSGI 下，async view 會進一次性的 event loop，沒有完整 async stack 的優勢。任何 sync middleware 都可能造成 thread adaptation，第三方 middleware 也未必同時支援 sync/async。Django 5.2 的內建 auth backend 已有 native async support，但自訂 backend 若只有 sync interface，仍會經 `sync_to_async` 並付出成本。

因此不要用「函式寫成 `async def`」判斷擴展性。要測完整 middleware、ORM、cache、auth 與外部 I/O 路徑；同步區段正確包裝，並確認 transaction 行為。CPU-bound 工作或長任務仍應送到 worker，不應卡在 request lifecycle。

## 選 Django 是選一套長期產品骨架

Django 適合 relational CRUD、內容管理、marketplace、SaaS back office，以及需要成熟 auth/admin 生態的 Python 團隊。FastAPI 適合 OpenAPI-first、typed API 與較薄的 async service；Flask 適合自行組裝；NestJS 適合 TypeScript 團隊和 opinionated DI/modules。Django 的代價是 framework conventions、settings 與 ORM 行為需要整隊理解，也不會自動替代 queue、object storage、observability 或部署平台。

上線前至少以 production settings 執行 `manage.py check --deploy`，關閉 `DEBUG`，保護並輪替 `SECRET_KEY`，設定 `ALLOWED_HOSTS`、HTTPS、secure cookies、static/media handling、database backup、logging 和 error monitoring；使用 production WSGI/ASGI server，而不是 `runserver`。這些才是 batteries-included 在真實環境裡能否成立的最後一段。

## 參考資料

- [Django 5.2 documentation](https://docs.djangoproject.com/en/5.2/)
- [Models and databases](https://docs.djangoproject.com/en/5.2/topics/db/)
- [Migrations](https://docs.djangoproject.com/en/5.2/topics/migrations/)
- [Authentication](https://docs.djangoproject.com/en/5.2/topics/auth/)
- [Middleware](https://docs.djangoproject.com/en/5.2/topics/http/middleware/)
- [Asynchronous support](https://docs.djangoproject.com/en/5.2/topics/async/)
- [Security in Django](https://docs.djangoproject.com/en/5.2/topics/security/)
- [Deployment checklist](https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/)
