---
title: "AWS App Runner：從原始碼或 Container 到 Web Service 的最短 AWS 路徑"
date: 2026-08-22
category: tech
type: deep-dive
tags: [aws, app-runner, paas, containers, cloud-computing]
lang: zh-TW
tldr: "App Runner 把 build、deploy、TLS、load balancing 與 autoscaling 包成 Web service；換來的是較少的編排控制與必須理解的 VPC、instance 與健康檢查邊界。"
description: "介紹 AWS App Runner 的 source/image deployment、auto scaling、health checks、VPC、observability，以及與 Fargate、Lambda 的取捨。"
series:
  name: "AI 時代的技術選擇"
  order: 52
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-aws-app-runner-en)

[AWS App Runner](https://docs.aws.amazon.com/apprunner/latest/dg/architecture.html) 把 repository 或 ECR image 變成 HTTPS Web service，代管 build/deploy、instance、load balancing 與 auto scaling。它比 ECS/Fargate 少很多組裝，定位更接近 AWS 原生 PaaS。

## Source code 與 source image 是兩條供應鏈

source code 模式由 App Runner build；source image 模式直接部署 ECR/ECR Public image。[官方 image 文件](https://docs.aws.amazon.com/apprunner/latest/dg/service-source-image.html) 仍把 image patching 責任留給使用者。production 應鎖定 immutable digest、掃描 vulnerability、產 SBOM，並明確決定自動部署是否符合 change-control 流程。

服務必須 listen 在設定的 port、保持 stateless，並把 upload 與 durable state 放到外部服務。不要假設 instance 固定存在，也不要依賴 local filesystem 跨 deployment 保存資料。

## Auto scaling 的核心是 concurrency

App Runner 依每個 instance 的 request concurrency 與 min/max size 擴縮。值太高會讓 latency、memory 與 connection pool 先飽和；太低則增加 instance 與成本。用 load test 找到每種 CPU/memory 下的安全 concurrency，再設定 max size 保護資料庫。

[Health check](https://docs.aws.amazon.com/apprunner/latest/dg/manage-configure-healthcheck.html) 可用 TCP 或 HTTP。production 應提供輕量 HTTP endpoint，確認 process 能服務但不要每次執行昂貴的全依賴查詢；readiness 若無法表達所有依賴，就靠應用程式 timeout、circuit breaker 與 metrics 補足。

## Ingress 與 egress 要分開看

App Runner 預設提供 public endpoint，也能配置 private ingress。要從服務連到 RDS、ElastiCache 等 private resource，使用 VPC connector 處理 outbound；它不表示所有流量自動變 private，也不表示 public internet egress 一定存在。逐條畫出 ingress、DNS、security group、NAT/endpoint 與 database route。

[Observability](https://docs.aws.amazon.com/apprunner/latest/dg/monitor.html) 整合 CloudWatch Logs/metrics、EventBridge、CloudTrail 與 X-Ray。至少監控 request、latency、HTTP status、active instance、deployment event 與 application saturation，並把 deploy revision 寫入 log/trace。

## 何時不要用 App Runner

單一 stateless HTTP API、內部工具或 prototype，且團隊已在 AWS，App Runner 很合適。需要多 container task、sidecar、worker、cron、精細 ALB rule、service mesh 或複雜 deployment policy，Fargate/ECS 更自然；短事件 handler 用 Lambda；追求跨雲 PaaS 體驗則比較 Render、Railway 或 Fly.io。

驗收時推送一個壞 image、讓 health endpoint 失敗、打滿 concurrency、切斷 private dependency，再確認 deployment 不會吃掉最後一個健康版本，alarm 能指出是 app、network 還是 scaling 問題。

## 參考資料

- [AWS App Runner architecture and concepts](https://docs.aws.amazon.com/apprunner/latest/dg/architecture.html)
- [App Runner service based on a source image](https://docs.aws.amazon.com/apprunner/latest/dg/service-source-image.html)
- [Configuring App Runner health checks](https://docs.aws.amazon.com/apprunner/latest/dg/manage-configure-healthcheck.html)
- [Observability for App Runner](https://docs.aws.amazon.com/apprunner/latest/dg/monitor.html)
- [Choosing an AWS container service](https://docs.aws.amazon.com/decision-guides/latest/containers-on-aws-how-to-choose/choosing-aws-container-service.html)
