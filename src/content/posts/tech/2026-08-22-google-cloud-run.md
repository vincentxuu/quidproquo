---
title: "Google Cloud Run：Service、Job、Worker Pool 是三種不同的 Container 生命週期"
date: 2026-08-22
category: tech
type: deep-dive
tags: [google-cloud, cloud-run, serverless, containers, paas]
lang: zh-TW
tldr: "Cloud Run 不只是一個 HTTP container 平台；先按 request、run-to-completion、always-on pull worker 選對 resource，再設計 concurrency、identity 與擴縮。"
description: "介紹 Google Cloud Run services、jobs、worker pools、container contract、concurrency、revisions、網路與 GKE 選型。"
series:
  name: "AI 時代的技術選擇"
  order: 53
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-google-cloud-run-en)

[Cloud Run](https://cloud.google.com/run/docs/overview/what-is-cloud-run) 是 Google Cloud 的全代管 application platform。它現在有三種 resource：service 接 HTTP／event，job 執行後結束，worker pool 處理長駐 pull-based background work。三者共用 container 基礎，生命週期卻不能混用。

## 先選生命週期，再談 scaling

service 必須 listen 在平台指定的 port，由 revision 接流量。它依 request、CPU 等訊號擴縮，可 scale to zero；每個 instance 能同時處理多個 request，因此 concurrency 要以 load test 決定。Node/async server 常能提高 concurrency，CPU-heavy inference 則可能需要降低，並用 max instances 保護 Cloud SQL 與外部 API。

[Job](https://cloud.google.com/run/docs/create-jobs) 不 listen port，而是讓一或多個 task run to completion。排程 migration、批次轉檔和資料回填適合 job；任務要能依 index 分片、重試與冪等。長駐 Kafka consumer 不該假裝成永不回應的 HTTP service，worker pool 才符合它的 pull lifecycle。

## Revision 是部署快照，不是永久主機

每次設定或 image 變更產生 immutable revision，可逐步導流與回滾。container 要 stateless、正確處理 termination，並把 durable state 放 Cloud SQL、Firestore、Cloud Storage 等服務。local filesystem 與 instance identity 都不可依賴。

Cloud Run container contract 會規範啟動、port、signal 與檔案系統行為。使用任意 OCI image 不代表能跑 privileged container、host networking 或任意 Kubernetes primitive。需要 DaemonSet、custom scheduler、特殊 device 或 cluster-level policy 時改用 GKE。

## Identity 與 network 是兩條邊界

invoker IAM 決定誰能呼叫 service；service account 決定 workload 能呼叫哪些 Google API。不要使用下載的長效 service-account key，改用 service identity。對 public service，應用程式仍要做 end-user authorization、rate limit 與 input validation。

連 private VPC、Cloud SQL 或 internet egress 時，逐條確認 connector/direct VPC egress、route、firewall、NAT 與 DNS。CPU allocation、minimum instances、startup probe 和 concurrency 一起影響 cold start、background work 與成本。

## Cloud Run 還是 GKE

標準 HTTP API、webhook、event handler、批次 job 與簡單 worker 優先考慮 Cloud Run。只有在需要 Kubernetes API、生態 controller、多容器拓撲、特權或細緻 node control 時，才承擔 GKE 的平台成本。驗收時壓滿 concurrency、部署壞 revision、切斷 downstream 並重跑同一 job，確認 max instances、rollback、timeout 與 idempotency 都有效。

## 參考資料

- [What is Cloud Run](https://cloud.google.com/run/docs/overview/what-is-cloud-run)
- [Cloud Run container runtime contract](https://cloud.google.com/run/docs/container-contract)
- [Create Cloud Run jobs](https://cloud.google.com/run/docs/create-jobs)
- [Configure maximum concurrency](https://cloud.google.com/run/docs/configuring/concurrency)
- [Cloud Run service identity](https://cloud.google.com/run/docs/securing/service-identity)
