---
title: "CoreWeave：以 Kubernetes、GPU Fabric 與儲存組成的 AI 專用雲"
date: 2026-08-22
category: tech
type: deep-dive
tags: [coreweave, gpu-cloud, kubernetes, ai-infrastructure, inference]
lang: zh-TW
tldr: "CoreWeave 的價值不只是租 GPU，而是把 Kubernetes、GPU 網路、儲存與 inference 組成 AI infrastructure；代價是仍需平台工程與容量治理。"
description: "介紹 CoreWeave Kubernetes Service、Slurm、儲存、serverless/dedicated inference，以及與 hyperscaler、模型 API 的取捨。"
series:
  name: "AI 時代的技術選擇"
  order: 57
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-coreweave-ai-cloud-en)

[CoreWeave](https://docs.coreweave.com/) 是聚焦 AI/HPC 的雲端基礎設施。它不只有一張「每小時 GPU」價目表。產品包含 CoreWeave Kubernetes Service（CKS）、Slurm-on-Kubernetes、object/file/block storage、VPC，以及 serverless 與 dedicated inference。

## CKS 是主平台，不是免維運的模型 API

CKS 把 Kubernetes control plane、GPU node 與高效能網路整合起來，適合 distributed training、自架 inference 與多團隊平台。你仍要寫 workload spec、requests/limits、queue、checkpoint、autoscaling、RBAC 與 rollout。若團隊沒有 Kubernetes platform owner，拿到 GPU 後仍可能卡在排程與故障復原。

訓練時先驗證 GPU topology、collective communication、共享檔案 throughput 與 checkpoint restore，不只跑單卡 benchmark。資料集與 model artifact 應分層：object storage 放 durable corpus，file storage 供多 node 熱資料，local/ephemeral disk 當 cache。任何一層不足都會讓昂貴 GPU 等 I/O。

## Inference 有兩種責任邊界

serverless inference 適合按請求部署、縮放與減少 idle；dedicated inference 適合穩定流量、latency SLO、特定硬體與隔離。兩者都要量 cold/model-load time、tokens per second、batching、queue delay、error 與 cost per successful output。

不要只比較 GPU 小時價格。若 serverless 封裝不支援自訂 runtime、parallelism 或 observability，應回到 CKS。若只想呼叫少數 foundation model，managed model API 又比自管 weights、runtime 與容量簡單。

## 容量、可攜性與失敗演練

GPU 型號相同不代表 cluster 等價。region capacity、reservation、interconnect、CPU/RAM 比例、storage egress、support 與 quota 都會影響交付。Terraform/Kubernetes manifest、OCI image、portable checkpoint 與 S3-compatible artifact layout 可降低供應商切換成本，但網路與效能調校仍不可攜。

上線前讓一個 node、storage mount 與一條 network path 故障，確認 job 能 checkpoint/resume、inference 能排空與重排。CoreWeave 適合 GPU 是核心生產資源的團隊；小規模實驗或 API-first 產品，RunPod、Replicate 或一般 hyperscaler 可能更省心。

## 參考資料

- [CoreWeave documentation](https://docs.coreweave.com/)
- [CoreWeave Kubernetes Service](https://docs.coreweave.com/docs/products/cks)
- [CoreWeave storage](https://docs.coreweave.com/docs/products/storage)
- [CoreWeave Inference](https://docs.coreweave.com/docs/products/inference)
