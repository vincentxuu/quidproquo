---
title: "Fly.io：Machines、Fly Proxy 與多區域部署的真實邊界"
date: 2026-08-22
category: tech
type: deep-dive
tags: [fly-io, paas, containers, edge-computing, devops]
lang: zh-TW
tldr: "Fly.io 把可快速啟停的 Machines 放到指定 region，再由 Fly Proxy 與私有 6PN 接線；真正困難仍是有狀態資料的跨區一致性。"
description: "介紹 Fly.io Machines、Fly Proxy、regions、6PN、Volumes、autostop/autostart 與多區部署取捨。"
series:
  name: "AI 時代的技術選擇"
  order: 76
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-fly-io-machines-platform-en)

[Fly.io Machines](https://fly.io/docs/machines/overview/) 是可透過 API 建立、啟動、停止與銷毀的輕量 VM primitive。`fly launch` 和 `fly deploy` 提供 PaaS 體驗，但底層思維更接近「把 container VM 放到指定 region」，不是把所有 topology 隱藏起來。

## Machine、App 與 Proxy 各負責一層

App 是設定、secret、network 與 Machines 的管理邊界；Machine 執行 image；[Fly Proxy](https://fly.io/docs/networking/fly-proxy/) 接 public Anycast 或 private Flycast 流量，依 health、region 與 service 設定路由。Process groups 可讓同一 image 分成 web、worker 等角色，但 scaling 與 shutdown contract 仍要逐組設計。

同一 private network 的 Machines 有 IPv6 位址與 `.internal` DNS；[6PN](https://fly.io/docs/networking/private-networking/) 可透過 WireGuard 從本機或外部網路接入。private reachability 不等於 authorization：服務仍要驗證身份，secret 不可放 image，對外 port 也要刻意列出。

## Autostop 不是無上限 autoscaling

[Autostop/autostart](https://fly.io/docs/launch/autostop-autostart/) 由 Proxy 根據 incoming traffic 與 concurrency，停止、suspend 或啟動既有 Machines。它不會建立或刪除 Machines；最大可運行數就是預先建立的數量。queue worker、長連線與沒有 Proxy service 的 private process 也不能直接套用 HTTP traffic 判斷。

因此 scale-to-zero 要同時評估 cold start、primary region 最低副本、連線重試與突發流量。若做 per-user sandbox，Machines API 很有吸引力，但必須自己負責 quota、租戶隔離、image provenance、idle reclamation 與 orphan cleanup。

## Volume 是單區資產

[Fly Volumes](https://fly.io/docs/volumes/overview/) 是綁定單一 host、單一 region 的 persistent storage，一個 volume 同時掛一台 Machine；平台不會自動複寫內容。建立第二顆 volume 只得到第二份空白磁碟，不等於 HA database。

多區 stateless API 很直接；多區寫入資料則必須選 replication protocol、primary placement、failover、backup 與 split-brain 策略。不要因為 compute 靠近使用者，就假設 database 也已全球一致。可接受單區 state 時仍需 snapshot/backup 演練與 Machine replacement 流程。

Fly.io 適合全球低延遲 API、可程式化 sandbox、每租戶隔離 workload，以及需要比傳統 PaaS 更多 placement/network 控制的團隊。只求 repository-to-URL 可比較 Railway/Render；複雜 stateful control plane 或完整企業 IAM 則評估 Kubernetes 與大雲。驗收應包含 region failure、stopped Machine 喚醒、volume host failure、DNS/service discovery 與 graceful drain。

## 參考資料

- [Fly Machines overview](https://fly.io/docs/machines/overview/)
- [Fly Proxy](https://fly.io/docs/networking/fly-proxy/)
- [Fly private networking](https://fly.io/docs/networking/private-networking/)
- [Autostop and autostart Machines](https://fly.io/docs/launch/autostop-autostart/)
- [Fly Volumes overview](https://fly.io/docs/volumes/overview/)
- [Fly regions](https://fly.io/docs/reference/regions/)
