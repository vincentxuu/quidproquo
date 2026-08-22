---
title: "RunPod：GPU Pod 與 Serverless Endpoint 是兩種不同產品"
date: 2026-08-22
category: tech
type: deep-dive
tags: [runpod, gpu-cloud, serverless, inference, machine-learning]
lang: zh-TW
tldr: "RunPod Pod 適合互動與長駐 GPU 工作，Serverless 適合 queue-based 或 load-balanced inference；選錯會把 persistence、cold start 與重試語意混在一起。"
description: "介紹 RunPod Pods、network volumes、Serverless queue/load-balancing endpoints、worker scaling、cold start 與 production 邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 59
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-runpod-gpu-cloud-en)

[RunPod](https://docs.runpod.io/api-reference/overview) 提供兩個主要抽象：Pod 是可 SSH、長時間存在的 GPU instance；Serverless endpoint 則依請求啟停 container worker。開發 notebook、training 或自管 daemon 選 Pod；有明確 request/job contract 的 inference 才選 Serverless。

## Pod 的重點是可重現與 storage lifecycle

Pod 讓你選 image、GPU、volume 與 port，很適合快速實驗。風險是環境被手動改壞、資料留在 container disk，以及關機後才發現 volume 與 region 綁定。template 與 image 要版本化，checkpoint 放 network volume/object storage，API/SSH key 不放 notebook。

供應池的 GPU 型號、region 與可用性會變動。多 GPU training 不能只看卡數；先測 interconnect、shared storage 與 distributed framework。如果工作需要穩定 cluster topology、SLA 與企業 network，專用 GPU cloud 可能更合適。

## Serverless 又分 queue 與 load balancing

[Endpoint 文件](https://docs.runpod.io/serverless/endpoints/overview) 區分 queue-based 與 load-balancing。queue endpoint 有 async/sync job、排隊與自動重試，適合 batch 與較長 prediction；load balancer 把 HTTP 直接送 worker，適合 streaming/低延遲，但 backlog、retry 與 application protocol 由你處理。

重試表示 handler 必須冪等。job id 對應 idempotency record，output 立即搬到 durable storage，不依賴平台短期結果保存。execution timeout、job TTL 與 client timeout 是三個不同時鐘，應分別測試。

## Cold start 是模型載入問題

worker 從零啟動要拉 image、載 weights、初始化 CUDA，幾十 GB 模型不可能像小型 function 一樣瞬間醒來。[Endpoint settings](https://docs.runpod.io/serverless/endpoints/endpoint-configurations) 提供 active/min/max worker、model cache、GPU priority 與 network volume；warm worker 降 latency，但產生 idle cost。以 p95 queue delay + initialization + inference 衡量，而非只看 kernel time。

RunPod 適合 prototype、彈性 GPU 與自行封裝模型的團隊。需要 curated public model API 可看 Replicate；需要大型固定 cluster、Kubernetes 與高速 fabric 可看 CoreWeave、Lambda 或 Nebius。上線前故意重送 job、移除首選 GPU、讓 worker timeout，再確認 fallback、成本上限與 output durability。

## 參考資料

- [RunPod API overview](https://docs.runpod.io/api-reference/overview)
- [RunPod Serverless overview](https://docs.runpod.io/serverless/overview)
- [RunPod endpoint types](https://docs.runpod.io/serverless/endpoints/overview)
- [RunPod endpoint settings](https://docs.runpod.io/serverless/endpoints/endpoint-configurations)
