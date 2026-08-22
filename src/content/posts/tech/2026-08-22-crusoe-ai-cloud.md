---
title: "Crusoe Cloud：從 GPU VM、Managed Kubernetes 到 Managed AI"
date: 2026-08-22
category: tech
type: deep-dive
tags: [crusoe, gpu-cloud, kubernetes, slurm, ai-infrastructure]
lang: zh-TW
tldr: "Crusoe 同時提供 Infrastructure Cloud 與 Managed AI；GPU VM/cluster 給控制，serverless/dedicated inference 給較高抽象，兩者責任不可混寫。"
description: "介紹 Crusoe GPU VM、CMK、Slurm、InfiniBand、ephemeral storage、Managed AI inference 與 AI 雲選型。"
series:
  name: "AI 時代的技術選擇"
  order: 61
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-crusoe-ai-cloud-en)

[Crusoe Cloud](https://docs.crusoecloud.com/) 把產品分成 Infrastructure Cloud 與 Managed AI。前者提供 GPU VM、Crusoe Managed Kubernetes（CMK）、Slurm、network 與 storage，讓團隊管理 training/serving；後者提供 serverless inference、dedicated deployment 與 fine-tuning 等較高階服務。

## VM、CMK、Slurm 解不同問題

VM 適合單機研究、自訂 runtime 與直接除錯，但 OS、driver/library、process 與 recovery 都由你維護。[VM 文件](https://docs.crusoecloud.com/compute/virtual-machines/overview/) 特別標示 GPU instance 的 local storage 是 ephemeral；checkpoint 與 dataset 不能只留 NVMe。

[CMK](https://docs.crusoecloud.com/orchestration/cmk/overview/) 代管 Kubernetes control plane，並可安裝 GPU/Network Operator 與 CSI。團隊仍負責 node pool、Pod requests、rollout、RBAC、policy 與 application SLO。Slurm 適合 queue、fair-share 與 distributed batch；Kubernetes 適合 service/platform。不要因兩者都能跑 container 就忽略 scheduler 語意。

## Cluster 要量 topology，不只卡型

同型 GPU 在 PCIe、NVLink/互連、InfiniBand/RoCE、CPU/RAM 與 storage throughput 下會得到不同 scaling efficiency。用實際 framework 跑 all-reduce、dataset read、checkpoint restore 與 node failure。Command Center 的 utilization、health 與 topology view 能協助定位，但 alarm/runbook 仍要由團隊定義。

Managed AI 適合不想自建 serving control plane 的產品。serverless 用 idle savings 換 cold start，dedicated deployment 用固定容量換 latency/隔離。比較時量 queue、model load、batching、output correctness 與 cost per successful request。

## 容量與永續敘事要分開驗證

Crusoe 的品牌強調能源與 AI infrastructure，但技術採購仍以 region capacity、reservation、SLA、support、network、data residency 與 egress 為證據。永續主張要查可稽核方法，不能用 marketing 取代 workload benchmark。

需要直接 cluster 與 Managed AI 並存時，Crusoe 值得評估。只需快速 API 可比較 Replicate；需要更廣 cloud service 或既有 hyperscaler 整合則另有取捨。上線前故障一個 node、刪除 ephemeral cache、切 storage path，確認 checkpoint、reschedule 與 inference failover。

## 參考資料

- [Crusoe Cloud documentation](https://docs.crusoecloud.com/)
- [Crusoe virtual machines](https://docs.crusoecloud.com/compute/virtual-machines/overview/)
- [Crusoe Managed Kubernetes](https://docs.crusoecloud.com/orchestration/cmk/overview/)
- [Spin up a GPU cluster](https://docs.crusoecloud.com/quickstart/spin-up-gpu-cluster/)
- [Crusoe infrastructure topology](https://docs.crusoecloud.com/command-center/topology/)
