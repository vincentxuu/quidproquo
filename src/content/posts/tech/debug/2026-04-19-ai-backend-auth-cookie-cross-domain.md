---
title: "本機開發 AI Backend API 永遠回空資料：Cookie Domain 隔離問題"
date: 2026-04-19
type: debug
category: tech
tags: [cookie, cors, fastapi, nextjs, auth, local-dev, debug]
lang: zh-TW
tldr: "主後端跑在遠端 HTTPS，auth_token cookie 的 domain 是遠端，瀏覽器不會把它送到本機 AI backend，導致 API 認為未登入。"
description: "本機開發時 AI backend 推薦 API 回傳空陣列，根本原因是 cookie domain 隔離：auth_token 由遠端伺服器設定，瀏覽器不會把它送到 localhost。"
draft: false
---

## TL;DR

主後端跑在遠端 HTTPS（`server-dev.daodao.so`），`auth_token` cookie 的 domain 是遠端，瀏覽器不會把它送到本機 AI backend（`localhost:8002`），導致 AI backend 一直認為你沒登入，回傳空陣列。

## 情境

前後端分離架構，有三個服務：

- 前端：`http://localhost:3001`
- AI backend：`http://localhost:8002`（本機）
- 主後端：`https://server-dev.daodao.so`（遠端 dev server）

開發推薦功能時，呼叫 `GET /api/v1/recommendation/topic_cards`，資料庫有資料、使用者也已登入，但 response 固定是：

```json
{ "success": true, "data": [] }
```

## 問題

API 回空資料，不報錯，第一直覺是資料庫沒資料或 query 條件太嚴。

翻了 AI backend 的 `recommendation.py`：

```python
if not user_id:
    return build_success_response(data=[])
```

`user_id` 是 `None`。再看 `dependencies.py`：

```python
def get_current_user(request: Request, ...):
    token = request.cookies.get("auth_token")
    if not token:
        return None
```

沒有 `auth_token` cookie。

但 DevTools Network 明明看到打主後端的 request 有帶 `auth_token`……

## 嘗試過程

一開始以為是 `cookie-config.ts` 的 `secure: true` 問題——本機跑 HTTP，`secure` cookie 不會被儲存。但仔細看後發現 `auth_token` 確實存在瀏覽器的 cookie 清單裡，只是不會被送到 `localhost:8002`。

前端的 `fetchAiBackend` 設了 `credentials: "include"`，理論上應該帶 cookie，但沒有用。

## 解法（根本原因）

**Cookie 是 domain-scoped 的。**

`auth_token` 是由 `server-dev.daodao.so`（HTTPS）在登入時設定的，瀏覽器把這個 cookie 與該 domain 綁定。當你打 `http://localhost:8002` 時，瀏覽器不會把 `server-dev.daodao.so` 的 cookie 帶過去——即使設了 `credentials: "include"` 也沒用。

## 為什麼會這樣

瀏覽器的 cookie 安全模型：

1. Cookie 儲存時附帶 `domain`（預設是設定它的 host）
2. `credentials: "include"` 只是告訴瀏覽器「跨域請求時把屬於目標 domain 的 cookie 帶上」
3. 但 `auth_token` 的 domain 是 `server-dev.daodao.so`，不是 `localhost`
4. 所以打 `localhost:8002` 時，這個 cookie 不在「屬於目標 domain」的範圍內

打到同一個遠端主後端的 request 沒問題，是因為目標 domain 跟 cookie domain 相符。

完整問題鏈：

```
request → localhost:8002
→ fetchAiBackend: credentials: "include"
→ 瀏覽器查 localhost 的 cookie → 找不到 auth_token
→ FastAPI get_current_user() → return None
→ if not user_id: return []
```

## 學到的事

`credentials: "include"` 不是「把所有 cookie 都帶上」，而是「把屬於這個 domain 的 cookie 帶上」。多服務本機開發時，如果各服務的 auth cookie domain 不同，就要考慮用 server proxy 或統一 domain。

---

## 參考資料

- [MDN - Using credentials with Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#including_credentials)
- [MDN - Set-Cookie: Domain attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#domaindomain-value)
