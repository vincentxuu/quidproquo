---
title: "Kubernetes：從 Pod、Controller 到 Declarative Reconciliation 的容器編排"
date: 2026-08-22
category: tech
type: deep-dive
tags: [kubernetes, containers, orchestration, cloud-native, devops]
lang: zh-TW
tldr: "Kubernetes 的核心不是 YAML，而是 API objects、controllers 與 reconciliation loop；它管理 workload lifecycle，卻不自動解決 application state、資料一致性與組織治理。"
description: "介紹 Kubernetes control plane、Pod、Deployment、Service、ConfigMap、Secret、probe、autoscaling、storage 與選型邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 90
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-kubernetes-container-orchestration-en)

[Kubernetes](https://kubernetes.io/docs/concepts/) 是管理 containerized workloads 的 declarative control plane。團隊提交 API objects 描述 desired state，controllers 持續觀察 actual state 並收斂差異。價值在通用 scheduling、service discovery、rollout、self-healing 與 extensibility，而不是把所有維運變成 YAML。

## Control plane 協調，Node 執行

API server 是入口；etcd 保存 cluster state；scheduler 選擇 Pod 所在 Node；controller managers 執行各種 reconciliation。Node 上的 kubelet 確保 Pod containers 符合 spec，container runtime 實際執行，network proxy/data plane 讓 Service 能路由。

Pod 是最小 deploy unit，不是 durable machine。Deployment 透過 ReplicaSet 管理 stateless replicas 與 rolling update；StatefulSet 提供穩定 identity/volume ordering，但不替 database 實作 replication；DaemonSet 讓每個或部分 nodes 跑 agent；Job/CronJob 管 completion，而非長駐 web server。

## Service 穩定的是位址，不是健康語意

Service 用 label selector 找 Pods 並提供 stable virtual endpoint；Ingress/Gateway 再處理外部 HTTP routing。Label 是鬆耦合接縫，錯誤 selector 可能送到不相容版本或完全沒有 endpoints。NetworkPolicy 需要 CNI 支援，且預設允許還是拒絕要明確設計。

[Probes](https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/) 分工不同：startup 保護慢啟動；readiness 決定是否接流量；liveness 判斷是否重啟。把 database 暫時失聯放進 liveness 會製造 restart storm；readiness 過度依賴所有 downstream 也會把局部故障放大。

## Config 與 Secret 不是完整安全方案

ConfigMap 和 Secret 把設定與 image 分離，但 Kubernetes Secret 預設只是 API object 的敏感資料語意，不等於自動端到端加密。要啟用 etcd encryption、RBAC least privilege、service account token controls、external secret manager、audit 與 rotation。能在 namespace 讀 Secret 的 workload 仍能取得明文。

Requests/limits 影響 scheduling 與 eviction；HPA/VPA/cluster autoscaler 解決不同維度，且都依 metrics 與 application behavior。Autoscaling 不會消除 cold start、queue backpressure、database connection storm 或 capacity ceiling。

PersistentVolume/PVC 抽象 storage provisioning，但 access mode、zone、snapshot、replication 和 restore 仍由 CSI/storage product 決定。Controller 讓 Pod 重建不代表資料已復原；stateful workload 必須以 application-native backup/failover 演練。

Kubernetes 適合多團隊、多服務、需要標準化 runtime API、policy、operator 或混合基礎設施的組織。少量 web/worker 用 managed PaaS 往往更便宜；需要 cluster 時優先 managed control plane。驗收應包含 node/zone loss、bad rollout、probe failure、RBAC escalation、network isolation、quota exhaustion、etcd/control-plane recovery 與 data restore。

## 參考資料

- [Kubernetes concepts](https://kubernetes.io/docs/concepts/)
- [Kubernetes components](https://kubernetes.io/docs/concepts/overview/components/)
- [Kubernetes workloads](https://kubernetes.io/docs/concepts/workloads/)
- [Services, load balancing, and networking](https://kubernetes.io/docs/concepts/services-networking/)
- [Liveness, readiness, and startup probes](https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/)
- [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)
