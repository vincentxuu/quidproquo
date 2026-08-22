---
title: "Scaleway：歐洲 Cloud 的 Instance、Kapsule、Serverless 與 Managed Data"
date: 2026-08-22
category: tech
type: deep-dive
tags: [scaleway, cloud-computing, kubernetes, serverless, european-cloud]
lang: zh-TW
tldr: "Scaleway 已不只是低價 VM，而是涵蓋 compute、Kapsule、serverless、database、storage、AI 與 IAM 的歐洲 cloud；選型仍要逐 region 驗證成熟度與整合。"
description: "介紹 Scaleway Instances、Elastic Metal、Kapsule/Kosmos、Serverless Containers/Jobs、databases、VPC、IAM 與歐洲資料治理。"
series:
  name: "AI 時代的技術選擇"
  order: 67
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-scaleway-cloud-platform-en)

[Scaleway](https://www.scaleway.com/en/docs/) 是歐洲 public cloud。產品已涵蓋 CPU/GPU Instance、Elastic Metal、Kubernetes、Serverless Containers/Functions/Jobs 與 managed/serverless database。其他服務還有 object/block/file storage、VPC、IAM、secret/key manager、queue/event 與 Generative APIs。

## 選 compute 的同時也在選責任

Instance 與 bare metal 給完整 runtime/host 控制，也把 OS patch、部署、capacity、monitoring 與 recovery 交給團隊。Kapsule 代管 Kubernetes control plane，適合需要 Kubernetes API、controller 與多服務平台；Kosmos 則面向 multi-cloud node。兩者都不免除 workload policy、RBAC、upgrade compatibility、backup 與 SLO。

[Serverless Containers](https://www.scaleway.com/en/docs/serverless-containers/reference-content/serverless-overview/) 適合 stateless HTTP/event workload；Jobs 適合 run-to-completion。不要把背景 daemon 塞進 request container，也不要把需重試的 job 寫成非冪等。cold start、timeout、concurrency、min/max scale 與下游連線上限要以負載測試決定。

## 產品多，不代表每區一樣

Scaleway region 主要在歐洲，但新 region 與產品會逐步開放。建立 product-by-region matrix，確認 instance/GPU、Kapsule、database、storage、KMS、audit 與 support 是否同區可用。資料主權不只看公司總部：還要查實際 region、subprocessor、support access、backup/replica 位置與 deletion 流程。

[VPC](https://www.scaleway.com/en/docs/vpc/) 透過 Private Network 連接資源；serverless、database 與 Kubernetes 的 attach/ingress/egress 能力各有差異。逐向驗證 public gateway、NAT、ACL、DNS、load balancer 與 private endpoint，不把「支援 VPC」當成單一開關。

## Managed data 仍有 shared responsibility

Managed PostgreSQL/MySQL 與 Serverless SQL 代管部分 patch、backup、HA 與 scaling。應用程式仍負責 schema、index/query、connection、tenant authorization 與 restore drill。Serverless database 的 idle/resume 與 PostgreSQL 相容差異要用 ORM、migration 與 latency workload 實測。

Scaleway 適合重視歐洲區域、希望從 VM 延伸到 Kubernetes/serverless/data/AI 的團隊。若依賴 hyperscaler 特有服務或全球 region 深度，需計算替代成本。驗收時部署壞 revision、restore database、撤銷 IAM application、切斷 Private Network，確認 Cockpit/alert 與 runbook 真能定位。

## 參考資料

- [Scaleway documentation](https://www.scaleway.com/en/docs/)
- [Scaleway Kubernetes](https://www.scaleway.com/en/docs/containers/kubernetes/)
- [Scaleway Serverless Containers](https://www.scaleway.com/en/docs/serverless-containers/reference-content/serverless-overview/)
- [Scaleway VPC](https://www.scaleway.com/en/docs/vpc/)
- [Scaleway Managed Databases](https://www.scaleway.com/en/docs/managed-databases-for-postgresql-and-mysql/)
