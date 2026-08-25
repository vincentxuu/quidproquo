---
title: "Django: Python Web Applications with ORM, Admin, Auth, and Long-Term Evolution"
date: 2026-08-22
category: tech
type: deep-dive
tags: [django, python, backend, orm, web-development]
lang: en
tldr: "Django combines data models, migrations, authentication, admin, forms, and security defaults into one system; using it well still requires understanding QuerySets, middleware, async boundaries, and production settings."
description: "Django projects and apps, ORM and migrations, admin, auth, middleware, ASGI async, secure deployment, and API-first framework trade-offs."
series:
  name: "Technology Choices in the AI Era"
  order: 97
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-django-web-framework)

[Django](https://docs.djangoproject.com/en/5.2/) is a batteries-included Python web framework. It combines URL routing, views, ORM, migrations, authentication, sessions, admin, forms, templates, caching, and security mechanisms into one evolution model. For products centered on relational data, operational workflows, and permissions, that integration often matters more than a single benchmark.

## Projects deploy; apps compose capabilities

A project owns settings, the root URLconf, and WSGI or ASGI entry points. An app packages one domain capability for independent testing and possible reuse. An app is not automatically a microservice: inside one process, transaction boundary, and deployment, it is a module boundary.

Models describe fields, relations, and common queries. `makemigrations` records model changes as versioned migrations; `migrate` executes them. Migration history does not guarantee zero-downtime changes. Adding a non-null column to a large table, building an index, changing a type, or moving data still needs expand-migrate-contract sequencing, batched backfills, lock limits, and rollback design.

```py
from django.db import models

class Note(models.Model):
    title = models.CharField(max_length=200)
    owner = models.ForeignKey("auth.User", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

notes = Note.objects.filter(owner=request.user).select_related("owner")[:20]
```

QuerySets are lazy; template iteration, `len()`, serialization, or relation access may trigger queries. Inspect list pages for N+1 behavior, use `select_related` or `prefetch_related` appropriately, and verify query counts and plans with production-like data. Use `transaction.atomic()` where atomicity matters instead of assuming each request is one transaction.

## Admin and auth are leverage, not a public product UI

Django admin derives internal CRUD, search, filtering, and permission operations from models. It is excellent for operations and support staff, but it is a trusted management interface rather than a consumer frontend. Built-in authentication supplies users, password hashing, permissions, groups, sessions, and pluggable backends. If custom user identifiers are required, define a custom user model before the first migration; changing later is expensive.

Middleware wraps requests and responses like an onion. Order affects sessions, authentication, CSRF, messages, and exception handling. SecurityMiddleware, CSRF protection, template escaping, parameterized ORM queries, and clickjacking headers reduce common risks, but cannot repair unsafe raw SQL, `mark_safe`, untrusted uploads, missing object authorization, or bad production settings.

## ASGI does not make the entire stack asynchronous

Django supports async views. Under ASGI they can help with long polling, streaming, and many slow connections. Under WSGI, an async view runs in a one-off event loop without the benefit of a fully async stack. Any synchronous middleware may require thread adaptation, and third-party middleware may not support both modes. Django 5.2's built-in authentication backends have native async support, but a custom sync-only backend is adapted with `sync_to_async` at a cost.

Do not infer scalability from an `async def` signature. Measure the complete middleware, ORM, cache, authentication, and external-I/O path; wrap synchronous sections correctly and verify transaction behavior. CPU-heavy or long-running work still belongs in workers outside the request lifecycle.

## Choosing Django means choosing a product skeleton

Django fits relational CRUD, publishing, marketplaces, SaaS back offices, and Python teams needing mature authentication and admin ecosystems. FastAPI favors OpenAPI-first typed APIs and thinner async services; Flask favors assembly; NestJS serves TypeScript teams wanting opinionated DI and modules. Django requires a shared understanding of its conventions, settings, and ORM behavior, and it does not replace queues, object storage, observability, or a deployment platform.

Before release, run `manage.py check --deploy` against production settings, disable `DEBUG`, protect and rotate `SECRET_KEY`, configure `ALLOWED_HOSTS`, HTTPS, secure cookies, static and media handling, database backups, logging, and error monitoring, and use a production WSGI or ASGI server rather than `runserver`. This operational layer determines whether the included batteries remain safe in production.

## References

- [Django 5.2 documentation](https://docs.djangoproject.com/en/5.2/)
- [Models and databases](https://docs.djangoproject.com/en/5.2/topics/db/)
- [Migrations](https://docs.djangoproject.com/en/5.2/topics/migrations/)
- [Authentication](https://docs.djangoproject.com/en/5.2/topics/auth/)
- [Middleware](https://docs.djangoproject.com/en/5.2/topics/http/middleware/)
- [Asynchronous support](https://docs.djangoproject.com/en/5.2/topics/async/)
- [Security in Django](https://docs.djangoproject.com/en/5.2/topics/security/)
- [Deployment checklist](https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/)
