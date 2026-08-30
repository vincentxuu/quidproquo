---
title: "Cloudflare Smart Shield 怎麼用：讓 Origin 少扛一點流量"
date: 2026-08-30
type: guide
category: tech
tags: [cloudflare, cloudflare-smart-shield, cdn, performance, origin-protection]
lang: zh-TW
tldr: "Smart Shield 是 Cloudflare 的 origin protection bundle：用 Smart Tiered Cache、connection reuse、Argo Smart Routing、Regional Tiered Cache、Cache Reserve、Health Checks 和 Dedicated CDN Egress IPs，減少打到 origin 的 request 與 connection。"
description: "從 Smart Tiered Cache、connection reuse、Argo Smart Routing、Regional Tiered Cache、Cache Reserve、Health Checks 到 Dedicated CDN Egress IPs，拆解 Cloudflare Smart Shield 如何降低 origin load，以及和 Cache Rules 的分工。"
draft: false
series:
  name: "Cloudflare Edge Platform"
  order: 12
---

> 🌏 [English version](/en/posts/tech/2026-08-30-cloudflare-smart-shield-origin-protection-en)

[Cache Rules](/posts/tech/2026-08-30-cloudflare-cache-rules-edge-cache-policy) 回答的是「什麼東西可以 cache、cache 多久、cache key 怎麼定」。[Cloudflare Smart Shield](https://developers.cloudflare.com/smart-shield/) 回答的是另一個問題：當 cache miss、突發流量、全球訪客和 origin connection 一起來時，怎麼讓 origin 少扛一點？

官方把 Smart Shield 定位成 origin protection 與 performance features 的 bundle。它不是一條單一規則；比較像一組放在 visitor、Cloudflare cache hierarchy、Cloudflare network、origin server 之間的能力：Smart Tiered Cache、connection reuse、Argo Smart Routing、Regional Tiered Cache、Cache Reserve、Health Checks、Dedicated CDN Egress IPs。

這篇不重講 Cache Rules。重點放在 request 如何流向 origin、哪一層能擋下來、哪些功能是免費起步、哪些屬於 Advanced 或 Enterprise。

## Smart Shield 解什麼問題

沒有 Smart Shield 時，Cloudflare 每個邊緣資料中心都可能在 cache miss 時直接問 origin。全球流量一衝，origin 會遇到兩種壓力：

- **request volume**：同一個 cacheable asset 在多個地點同時 miss，origin 被重複打。
- **connection pressure**：大量 Cloudflare data centers 對 origin 開連線，origin 的 socket、TLS、worker process、database connection 都會受壓。

Smart Shield 把這兩種壓力分開處理：

```txt
Visitor
  |
  v
Lower-tier Cloudflare data center
  |
  +--> local cache HIT
  |
  v
Regional hub / Upper-tier cache
  |
  +--> Cache Reserve
  |
  v
Origin server
```

cacheable 內容先在 lower-tier cache 找；miss 時再往 upper-tier 或 regional layer 找；仍然 miss 才回 origin。dynamic request 沒有 cache 可以吃，就靠 Argo Smart Routing 找比較快的網路路徑，並透過 connection reuse 減少 origin 看到的連線數。

## 和 Cache Rules 的分工

兩篇要分開讀：

| 問題 | 主要工具 |
|---|---|
| 哪些 URL、header、cookie、query string 會影響 cache | Cache Rules |
| Edge TTL / Browser TTL 怎麼設 | Cache Rules |
| HTML、API、private page 要不要 bypass | Cache Rules |
| cache miss 之後誰能打 origin | Smart Tiered Cache |
| 多個 request 能不能共用到 origin 的 connection | Connection Reuse |
| cacheable 但不常被讀的 asset 能不能留久一點 | Cache Reserve |
| dynamic request 到 origin 的網路路徑怎麼縮短 | Argo Smart Routing |
| origin firewall 能不能只 allowlist 固定 egress IP | Dedicated CDN Egress IPs |

我會先把 Cache Rules 設對，再打開 Smart Shield。規則錯了，Smart Shield 只是把錯誤 cache policy 放大；規則對了，Smart Shield 才能讓 cache hierarchy 和 origin protection 真的發揮。

## Base package：Smart Tiered Cache 和 Connection Reuse

Smart Shield base package 包含 [Smart Tiered Cache](https://developers.cloudflare.com/smart-shield/configuration/smart-tiered-cache/) 與 [Connection Reuse](https://developers.cloudflare.com/smart-shield/concepts/connection-reuse/)。

Smart Tiered Cache 的做法是把 Cloudflare data centers 分成 lower-tier 和 upper-tier。訪客附近的 lower-tier 沒有內容時，會先問 upper-tier；只有 upper-tier 可以向 origin 要 cacheable content。這樣會減少 origin request，也會讓 origin connection 集中在少數 data centers。

Smart Tiered Cache 會根據 Cloudflare 的 latency 與 routing data，替每個 origin 動態選一個最近的 upper-tier。對 AWS、GCP、Azure、Oracle Cloud 這類 public cloud origin，官方文件提醒：anycast 或 regional unicast 可能讓 Cloudflare 只靠 latency 難以判斷 origin 位置，這時要設定 cloud region hint，讓 upper-tier 選在接近 origin region 的位置。

Connection Reuse 則處理 connection count。Smart Shield 會讓 upper-tier data center 到 origin 的多個 requests 走 shared connection，而不是每個 request 都新開一條。官方文件寫到，這平均可減少 30% origin connections。對會被 socket 數、TLS handshakes、reverse proxy worker 數打滿的 origin，這比單純 cache hit ratio 更有感。

## Argo Smart Routing：dynamic request 也要走快一點

[Argo Smart Routing](https://developers.cloudflare.com/smart-shield/configuration/argo/) 是 Smart Shield + Argo 和 Smart Shield Advanced 裡的功能。它會偵測即時網路狀況，把 web traffic 導到比較有效率的 Cloudflare network path，避開 congestion。

這對 dynamic request 特別重要。cacheable asset 可以靠 cache hierarchy 擋 origin；登入後 API、checkout、admin action 這類 request 通常不能 cache，但仍然要從 Cloudflare 到 origin。Argo 的 analytics 以 origin 到 Cloudflare network 的 TTFB 觀察效果，目標是縮短 origin transit time。

使用判斷很簡單：

- 全球使用者離 origin 很遠，dynamic request latency 明顯受網路影響：考慮 Smart Shield + Argo。
- 主要瓶頸是 origin CPU、database、慢 SQL：先修 origin，Argo 不會修 application latency。
- 大部分流量都是 cacheable assets：先看 Smart Tiered Cache、Cache Reserve、Cache Rules。

## Advanced：Regional Tiered Cache 和 Cache Reserve

[Regional Tiered Cache](https://developers.cloudflare.com/smart-shield/configuration/regional-tiered-cache/) 是 Smart Shield Advanced / Enterprise 層級的功能。它在 lower-tier 和 upper-tier 之間再加一個 regional hub。當 lower-tier miss 時，先問區域 hub，再問可能在更遠位置的 upper-tier。這適合有全球流量、但希望 cache miss 不要每次都跨很遠去找 upper-tier 的網站。

[Cache Reserve](https://developers.cloudflare.com/smart-shield/configuration/cache-reserve/) 則是更持久的 cache layer，底層建在 R2 上。它適合大型、cacheable、但不一定常被讀的 assets，例如下載檔、文件、媒體、build artifacts。一般 edge cache 可能因為冷門被 eviction；Cache Reserve 的角色是當最後一層 upper-tier cache，讓內容留得更久，減少 origin egress。

Cache Reserve 有幾個重要門檻：

- asset 必須符合 Cloudflare 一般 cacheability 條件。
- freshness TTL 至少 10 小時。
- response 要有 `Content-Length`。
- Image transformations 的原始檔可 eligible，resize variant 不 eligible，因為 transformation 在 response flow 中發生於 Cache Reserve 之後。
- Smart Shield Advanced 目前包含 2 TB Cache Reserve storage。

這層最適合「origin egress 貴、asset 很多、熱門程度長尾」的網站。如果內容每分鐘變、不能 stale、或 response 是 API JSON，Cache Reserve 通常不是答案。

## Health Checks 和 Dedicated CDN Egress IPs

Smart Shield 也可以把 origin availability 和 firewall posture 納入同一個故事。

[Health Checks](https://developers.cloudflare.com/smart-shield/configuration/health-checks/) 在 Pro 以上方案可用，從多個資料中心監控 origin 是否在線、是否有回應。這不會自動修好 origin，但能讓你在 Smart Shield dashboard 或相關觀測面裡看到 origin health。

[Dedicated CDN Egress IPs](https://developers.cloudflare.com/smart-shield/configuration/dedicated-egress-ips/) 是 Enterprise 功能，前身是 Cloudflare Aegis。它提供專屬於帳號的 Cloudflare-to-origin egress IP，讓 origin firewall 可以只 allowlist 一小組固定 IP。對安全要求高的 origin，這比放行整個 Cloudflare IP range 更容易控管。

這兩個功能不是每個個人專案需要，但對 production origin 很重要：前者回答「origin 有沒有活著」，後者回答「origin 只接受誰打進來」。

## Packages 怎麼選

官方 get started 頁目前把 Smart Shield 分成三層：

| package | 包含 | 適合 |
|---|---|---|
| Smart Shield | Smart Tiered Cache、Connection Reuse | 先降低 cache miss 對 origin 的 request / connection 壓力 |
| Smart Shield + Argo | base package + Argo Smart Routing | 全球 dynamic traffic，origin 距離使用者遠 |
| Smart Shield Advanced | base + Argo + Regional Tiered Cache + Cache Reserve | Enterprise / Advanced 場景，有大量長尾 cacheable assets 和全球 cache locality 需求 |

Free、Pro、Business 可以購買 Smart Shield 和 Smart Shield + Argo；Smart Shield Advanced 目前只給 Enterprise。Regional Tiered Cache 是 Enterprise plans 內含；Dedicated CDN Egress IPs 也屬 Enterprise，要找 account team。

方案可用性和包裝會變，上線前要再查官方 get started 頁。文章的設計重點不依賴包裝名稱：先把 origin load 分成 request volume、connection pressure、network transit、persistent cache、origin access control，再選對應功能。

## 什麼時候該開 Smart Shield

我會在這些情況考慮 Smart Shield：

- cache hit ratio 不差，但 origin 還是被全球 miss 打到。
- 靜態 asset 分散在世界各地被讀，冷門內容反覆從 origin 拉。
- origin connection 數、TLS handshakes 或 reverse proxy worker 被打滿。
- 使用者離 origin region 很遠，dynamic request TTFB 長尾明顯。
- origin egress 費用高，尤其是大檔案或媒體。
- production origin 想用固定 Cloudflare egress IP 做 firewall allowlist。

我不會拿它處理這些問題：

- private page 被錯誤 cache。
- API response 因 cookie/query/cache key 設錯而互相污染。
- origin SQL 很慢、CPU 滿、程式本身有 N+1 query。
- 應該用 R2、Images、Stream、D1、DO 拆掉的資料路徑仍然全部壓在單一 origin。

前兩個要先回 Cache Rules 和 application headers；第三個要修 app；第四個要回到 Edge Platform 的資料層設計。

## Production 前的檢查清單

上線前我會照這個順序看：

- DNS record 已 proxied；DNS-only record 不會經過 Smart Shield。
- Cache Rules 已確認哪些內容 cache、哪些 bypass。
- `CF-Cache-Status`、origin logs、Cloudflare analytics 能看出 miss 從哪裡來。
- public cloud origin 設好 cloud region hint。
- 有觀察 Smart Tiered Cache 啟用後的 cache hit ratio 和 origin request volume。
- dynamic request latency 問題明確，再評估 Argo。
- Cache Reserve 只放 TTL 足夠長、可 cache、帶 `Content-Length` 的 assets。
- purge 流程有測過，知道 edge cache 和 Cache Reserve 的行為。
- Health Checks 的告警不是只看首頁，要覆蓋真正代表 origin health 的 endpoint。
- Dedicated CDN Egress IPs 上線前先演練 firewall allowlist，避免把 Cloudflare 到 origin 的流量擋掉。

Smart Shield 的核心價值是讓 origin 不再被每個 cache miss、每個地理位置、每條新 connection 直接消耗。Cache Rules 決定什麼能被 cache；Smart Shield 決定 cache miss 和 dynamic request 怎麼更溫和地抵達 origin。兩者一起看，才是 Cloudflare Edge Platform 裡完整的 origin protection。

## 參考資料

- [Cloudflare Smart Shield — Overview](https://developers.cloudflare.com/smart-shield/)
- [Cloudflare Smart Shield — Get started](https://developers.cloudflare.com/smart-shield/get-started/)
- [Cloudflare Smart Shield — Network diagram](https://developers.cloudflare.com/smart-shield/concepts/network-diagram/)
- [Cloudflare Smart Shield — Smart Tiered Cache](https://developers.cloudflare.com/smart-shield/configuration/smart-tiered-cache/)
- [Cloudflare Smart Shield — Connection reuse](https://developers.cloudflare.com/smart-shield/concepts/connection-reuse/)
- [Cloudflare Smart Shield — Argo Smart Routing](https://developers.cloudflare.com/smart-shield/configuration/argo/)
- [Cloudflare Smart Shield — Regional Tiered Cache](https://developers.cloudflare.com/smart-shield/configuration/regional-tiered-cache/)
- [Cloudflare Smart Shield — Cache Reserve](https://developers.cloudflare.com/smart-shield/configuration/cache-reserve/)
- [Cloudflare Smart Shield — Dedicated CDN Egress IPs](https://developers.cloudflare.com/smart-shield/configuration/dedicated-egress-ips/)
- [Cloudflare Cache — Tiered Cache](https://developers.cloudflare.com/cache/how-to/tiered-cache/)
- [Cloudflare Cache — Cache Reserve](https://developers.cloudflare.com/cache/advanced-configuration/cache-reserve/)
