---
title: "Google Kubernetes Engine：GKE Autopilot 降低 Node 操作，不會消除 Kubernetes"
date: 2026-08-22
category: tech
type: deep-dive
tags: [google-cloud, gke, kubernetes, containers, platform-engineering]
lang: zh-TW
tldr: "GKE 代管 Kubernetes control plane；Autopilot 再代管多數 node 基礎設施，但 workload、policy、網路、升級相容性與成本治理仍屬於團隊。"
description: "介紹 GKE Autopilot 與 Standard、共享責任、Workload Identity、requests/limits、升級與 Cloud Run 選型。"
series:
  name: "AI 時代的技術選擇"
  order: 54
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-google-kubernetes-engine-en)

[Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/docs/concepts/kubernetes-engine-overview) 是代管 Kubernetes。Google 維護 control plane；你仍用 Deployment、Service、Job、Gateway、policy 與 controller 組出平台。真正的第一個選擇不是 machine type，而是 Autopilot 或 Standard。

## Autopilot 與 Standard 是責任選擇

[GKE modes](https://cloud.google.com/kubernetes-engine/docs/concepts/choose-cluster-mode) 將 Autopilot 定位為大多數 workload 的建議模式：Google 管 node provisioning、scaling 與多項安全預設。Standard 讓團隊直接控制 node pool、placement、特權設定與底層容量。需要 privileged workload、特殊 kernel/agent 或精細 node topology 才是選 Standard 的理由，不是「我們一向自己管」。

Autopilot 仍是 Kubernetes。錯的 requests/limits 會造成排程與成本問題；PodDisruptionBudget、readiness、topology spread、HPA、rollout 與 application SLO 仍由你負責。[共享責任文件](https://cloud.google.com/kubernetes-engine/docs/concepts/shared-responsibility) 也不會替團隊處理 RBAC、workload policy、資料保護與應用程式漏洞。

## 身分不要繞回 node key

用 Workload Identity Federation 將 Kubernetes ServiceAccount 對應 Google Cloud 權限，避免把 service-account JSON key 放 Secret。namespace 不是強安全邊界；RBAC、NetworkPolicy、Pod Security、admission policy 與 tenant 資料授權要一起設計。

控制面 endpoint、private nodes、egress、Cloud NAT、load balancer、DNS 與 firewall 都會影響可達性與成本。不要先裝 service mesh 再問需求；只有 mTLS、traffic policy、跨服務 telemetry 的價值高於 sidecar/ambient 複雜度時才引入。

## Managed 不等於不用升級

GKE 會升級受支援版本。[Release channel](https://cloud.google.com/kubernetes-engine/docs/concepts/release-channels) 幫你選更新節奏，maintenance window/exclusion 則控制時機。先在較低風險 cluster 驗證 API deprecation、admission webhook、CSI/CNI 與 controller 相容性，再推 production；不能把 exclusion 當永久凍結。

## GKE 還是 Cloud Run

若只需要 stateless HTTP、event、job 或簡單 worker，Cloud Run 通常交付更快。多團隊共用平台、Kubernetes operator、複雜 networking、GPU scheduling、stateful workload 或跨環境一致 API，GKE 才有足夠回報。

採用 GKE 等於採用一個持續營運的內部平台。驗收要 drain node、破壞一個 zone、撤銷 workload identity、套用不相容 upgrade，確認 budget、autoscaling、policy、backup 與 rollback 都不是紙上設定。

## 參考資料

- [GKE overview](https://cloud.google.com/kubernetes-engine/docs/concepts/kubernetes-engine-overview)
- [About GKE modes of operation](https://cloud.google.com/kubernetes-engine/docs/concepts/choose-cluster-mode)
- [GKE shared responsibility](https://cloud.google.com/kubernetes-engine/docs/concepts/shared-responsibility)
- [Workload Identity Federation for GKE](https://cloud.google.com/kubernetes-engine/docs/concepts/workload-identity)
- [GKE release channels](https://cloud.google.com/kubernetes-engine/docs/concepts/release-channels)
