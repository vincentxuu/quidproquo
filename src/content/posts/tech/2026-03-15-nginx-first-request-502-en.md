---
title: "nginx First Request Always 502, All Subsequent Requests Fine"
date: 2026-03-15
type: guide
category: tech
tags: [nginx, docker, dns, upstream, reverse-proxy]
lang: en
tldr: "When nginx uses the `set $variable` pattern for dynamic upstreams, the DNS cache expires every 30 seconds — the first request after expiry hits a 502 because no IP is available. Upgrading to nginx 1.27.3 and switching to an upstream block with the resolve parameter fixes this: DNS updates happen asynchronously in the background."
description: "The root cause of nginx's dynamic upstream DNS cache expiry causing 502 on the first request, and how to permanently fix it with nginx 1.27.3's resolve parameter."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-15-nginx-first-request-502)

## TL;DR

When nginx uses `set $variable` for dynamic upstreams, the DNS cache expires every 30 seconds. The first request after expiry gets a 502 because no IP is available yet. Upgrading to nginx 1.27.3 and switching to an `upstream` block with the `resolve` parameter fixes this permanently — DNS updates happen asynchronously in the background.

## Context

The service runs on Docker, with nginx as a reverse proxy in front of several containers. To support zero-downtime deployments (container restarts change the IP), the common `set $variable` trick was used to force nginx to re-resolve DNS on every request:

```nginx
# nginx.conf
resolver 127.0.0.11 valid=30s ipv6=off;

# conf.d/server.conf
location / {
    set $upstream production_app:3000;
    proxy_pass http://$upstream;
}
```

## The Problem

A simple stress test was run:

```bash
for i in {1..5}; do
  curl -s -o /dev/null -w "%{http_code}\n" https://server.daodao.so/api/v1/health
done
```

Results:

```
502
200
200
200
200
```

Three different endpoints showed the same pattern — **the first request always 502s, all subsequent ones succeed**. The containers were running the whole time, so this was not a cold start issue.

## Things Tried

**Assumed it was a DNS TTL caching issue and tried increasing `valid=`:**

```nginx
resolver 127.0.0.11 valid=300s ipv6=off;
```

This doesn't fix the root cause — it just changes the frequency from "possibly once every 30 seconds" to "possibly once every 5 minutes." The first request after cache expiry will still 502.

**Considered `proxy_next_upstream` for automatic retries:**

```nginx
proxy_next_upstream error timeout http_502;
proxy_next_upstream_tries 2;
```

This works for GET requests, but retrying POST requests risks sending duplicate submissions, so it can't be a universal solution.

## The Fix

nginx 1.27.3 open-sourced the `resolve` parameter from NGINX Plus. Switch to an `upstream` block and add `resolve`:

```nginx
# conf.d/upstreams.conf (centralized upstream management)
upstream production_app {
    zone production_app 64k;
    server production_app:3000 resolve;
    keepalive 32;
}

upstream backend_prod {
    zone backend_prod 64k;
    server backend-prod:8000 resolve;
    keepalive 16;
}
```

```nginx
# conf.d/server.conf
location / {
    proxy_pass http://production_app;
    include /etc/nginx/snippets/proxy-headers.conf;
}
```

The `resolver` directive stays in the `http` block of `nginx.conf` — the `resolve` parameter will use it automatically.

**`zone` is mandatory and cannot be omitted.** The `resolve` parameter requires the upstream to have a `zone` directive allocating shared memory, so that all worker processes share the same DNS resolution state. Without it, nginx fails to start:

```
[emerg] resolving names at run time requires upstream "production_app" to be in shared memory
```

64k is sufficient for a `zone` with a single server entry.

## Why This Happens

The `set $variable` + `proxy_pass http://$variable` mechanism works like this: **on each incoming request**, nginx checks the DNS cache. If the cache is still valid it uses the cached IP; if it has expired, it fires off an asynchronous DNS query.

The critical detail: **during that DNS query, no IP is available**. nginx doesn't wait, and it doesn't fall back to the old IP — it returns 502 immediately. Once the query completes and the cache is updated, the next request gets a cache hit and returns 200.

This is exactly why you see "first request 502, everything after fine" — all subsequent requests arrive within the 30-second window while the cache is still valid.

The `resolve` parameter behaves differently: **DNS updates happen in the background**, decoupled from any individual request. When the cache expires, nginx refreshes it on its own. Incoming requests continue to be served with the old IP until the update completes, then switch over automatically. When a container restarts and its IP changes, nginx tracks the update without needing a reload.

## Takeaways

`set $variable` is a workaround. nginx 1.27.3 and later have a cleaner solution. Before using the old pattern, check your nginx version. `resolve` and `zone` must be added together — either one alone won't work.

## References

- [nginx - Module ngx_http_upstream_module (server directive, resolve parameter)](https://nginx.org/en/docs/http/ngx_http_upstream_module.html#server)
- [nginx - Module ngx_http_core_module (resolver directive)](https://nginx.org/en/docs/http/ngx_http_core_module.html#resolver)
- [Docker embedded DNS server](https://docs.docker.com/engine/network/#dns-services)
- [Daodao Technical Architecture Overview](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture)
