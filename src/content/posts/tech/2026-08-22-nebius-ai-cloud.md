---
title: "Nebius AI Cloud：GPU Cluster、Managed Kubernetes 與 Serverless AI 的完整平台"
date: 2026-08-22
category: tech
type: deep-dive
tags: [nebius, gpu-cloud, kubernetes, ai-infrastructure, inference]
lang: zh-TW
tldr: "Nebius 同時提供 GPU VM/cluster、Kubernetes、Slurm、storage 與 Serverless AI；先選責任層級，再比較硬體與價格。"
description: "介紹 Nebius AI Cloud 的 GPU compute、Managed Kubernetes、Soperator、storage、Serverless AI、身分與可攜性。"
series:
  name: "AI 時代的技術選擇"
  order: 60
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-nebius-ai-cloud-en)

[Nebius AI Cloud](https://docs.nebius.com/) 是以 AI workload 為中心的完整雲平台。底層有 GPU VM、InfiniBand GPU cluster、disk/file/object storage 與 VPC。編排有 Managed Kubernetes 和以 Slurm 為核心的 Soperator。上層再提供 Serverless AI endpoints/jobs、MLflow 與預組應用。

## 先選責任層，不要先選 GPU

VM 給你最大 runtime 控制，也把 patch、driver 相容性、process supervisor 與 recovery 交回團隊。Managed Kubernetes 適合多服務 inference、共享 platform 與 Kubernetes operator；Soperator 適合 queue-based distributed training/HPC。Serverless AI 則把 container endpoint/job 的啟停與 scaling 再往上代管。

如果需求只是公開模型 API，直接選 endpoint；若需要自訂 scheduler、multi-node collective、長時間 checkpoint 或複雜 sidecar，再下沉到 cluster。過早選低階 IaaS，常把產品團隊變成 GPU platform team。

## 資料路徑決定有效 GPU 利用率

訓練資料、container image、model weights、checkpoint 與線上 cache 的生命週期不同。S3-compatible object storage 放 durable artifact，shared filesystem 服務多 node 熱資料，local NVMe 當可重建 cache。用實際 shard 跑 throughput 與 restore benchmark；GPU utilization 低不一定是算力不足。

Kubernetes/Slurm cluster 要檢查 topology、RDMA、node health remediation、queue fairness 與 checkpoint-on-preemption。Serverless endpoint 則量 model load、cold start、queue delay、batching、max replicas 與 output durability。

## 身分、網路與可攜性

每個 workload 使用獨立 service account 與最小權限，不把 console/API key 烤進 image。private subnet、public endpoint、NAT、registry、object storage 與 observability 的流向要畫清楚；「在同一 cloud」不等於自動 private 或免 egress。

OCI image、Terraform、Kubernetes manifest、portable checkpoint 與標準 object layout 能降低 lock-in。GPU topology、managed service API 與效能調校仍不完全可攜。Nebius 適合想在同一 AI cloud 從研究擴到 cluster/serving 的團隊；單一 prototype 可先比較 RunPod，model-API-first 可比較 Replicate。

上線前中止一個 GPU node、切斷 shared storage、撤銷 service identity，並讓 endpoint 從零擴張。只有 recovery、audit、quota 與成本上限都能觀察，才算平台可用。

## 參考資料

- [Nebius AI Cloud documentation](https://docs.nebius.com/)
- [Nebius Compute](https://docs.nebius.com/compute/)
- [Nebius Managed Kubernetes](https://docs.nebius.com/kubernetes/)
- [Nebius Serverless AI](https://docs.nebius.com/serverless/)
- [Nebius Object Storage](https://docs.nebius.com/object-storage/)
