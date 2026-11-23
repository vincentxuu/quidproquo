---
title: "AWS App Runner 停收新客戶之後：現有服務怎麼辦、新專案改用什麼"
date: 2026-08-22
category: tech
type: deep-dive
tags: [aws, app-runner, paas, containers, cloud-computing]
lang: zh-TW
tldr: "AWS App Runner 從 2026-04-30 起不再接受新客戶，也不再加新功能。新專案改用 Amazon ECS Express Mode；現有服務照常運作，但應排程搬到 Express Mode，搬之前先把 concurrency、健康檢查與 VPC 邊界記清楚。"
description: "AWS App Runner 停收新客戶後的處境：現有服務的維運重點、遷移到 ECS Express Mode 的步驟與差異，以及新專案在 ECS Express Mode、Fargate、Lambda 之間怎麼選。"
series:
  name: "AI 時代的技術選擇"
  order: 52
draft: false
---

> :globe: [English version](/posts/tech/2026-08-22-aws-app-runner-en)

[AWS App Runner](https://docs.aws.amazon.com/apprunner/latest/dg/architecture.html) 把 repository 或 ECR image 變成 HTTPS Web service，代管 build/deploy、instance、load balancing 與 auto scaling。它比 ECS/Fargate 少很多組裝，定位接近 AWS 原生 PaaS。

## 先講結論：新專案不要選 App Runner

[AWS 官方公告](https://aws.amazon.com/apprunner/)：App Runner 從 2026-04-30 起不再接受新客戶。既有客戶照常使用，仍可以建立新的 resource 與 service；AWS 繼續處理安全性與可用性，但不打算再加新功能。官方建議的替代品是 [Amazon ECS Express Mode](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/express-service-overview.html)。

所以這篇的讀法分兩種：

- **還沒用過 App Runner**：直接跳到最後一節，看新專案在 ECS Express Mode、Fargate、Lambda 之間怎麼選。帳號本來就開不了新的 App Runner。
- **已經有 App Runner 服務**：服務不會被關，不用急著搬；但一個不再長新功能的平台，遲早會跟不上你的需求。下面幾節是現有服務要守住的維運重點，也是搬遷時要帶過去的設定清單。

## Source code 與 source image 是兩條供應鏈

source code 模式由 App Runner build；source image 模式直接部署 ECR/ECR Public image。[官方 image 文件](https://docs.aws.amazon.com/apprunner/latest/dg/service-source-image.html) 仍把 image patching 責任留給使用者。production 應鎖定 immutable digest、掃描 vulnerability、產 SBOM，並明確決定自動部署是否符合 change-control 流程。

這個區分在搬遷時最要緊：ECS Express Mode 只吃 container image。用 source code 模式的服務，要先在 CI 補一段 build 並推到 registry 的步驟，才有東西可以部署過去。

服務必須 listen 在設定的 port、保持 stateless，並把 upload 與 durable state 放到外部服務。不要假設 instance 固定存在，也不要依賴 local filesystem 跨 deployment 保存資料。

## Auto scaling 的核心是 concurrency

App Runner 依每個 instance 的 request concurrency 與 min/max size 擴縮。值太高會讓 latency、memory 與 connection pool 先飽和；太低則增加 instance 與成本。用 load test 找到每種 CPU/memory 下的安全 concurrency，再設定 max size 保護資料庫。

[Health check](https://docs.aws.amazon.com/apprunner/latest/dg/manage-configure-healthcheck.html) 可用 TCP 或 HTTP。production 應提供輕量 HTTP endpoint，確認 process 能服務但不要每次執行昂貴的全依賴查詢；readiness 若無法表達所有依賴，就靠應用程式 timeout、circuit breaker 與 metrics 補足。

這兩組數字（安全 concurrency、health check 路徑與門檻）搬遷時要原樣帶到 ECS 的 auto scaling policy 與 ALB target group，不要讓預設值悄悄換掉你量過的結果。

## Ingress 與 egress 要分開看

App Runner 預設提供 public endpoint，也能配置 private ingress。要從服務連到 RDS、ElastiCache 等 private resource，使用 VPC connector 處理 outbound；它不表示所有流量自動變 private，也不表示 public internet egress 一定存在。逐條畫出 ingress、DNS、security group、NAT/endpoint 與 database route。

[Observability](https://docs.aws.amazon.com/apprunner/latest/dg/monitor.html) 整合 CloudWatch Logs/metrics、EventBridge、CloudTrail 與 X-Ray。至少監控 request、latency、HTTP status、active instance、deployment event 與 application saturation，並把 deploy revision 寫入 log/trace。

## 現有服務怎麼搬到 ECS Express Mode

ECS Express Mode 只要三樣東西：一個 container image、一個 task execution role、一個 infrastructure role。它會在你的帳號裡建好一整套：跑在 Fargate 上的 ECS service、帶 TLS 的 Application Load Balancer、auto scaling、監控與網路設定。Express Mode 本身不另外收費，付的是底下的 Fargate、ALB、CloudWatch 與資料傳輸。

[官方遷移指南](https://docs.aws.amazon.com/apprunner/latest/dg/apprunner-availability-change.html) 走 blue/green，兩邊同時跑，用 DNS 加權慢慢切流量：

1. 記下現有 App Runner 服務的 image、port、環境變數、custom domain 與對應的 ACM 憑證。
2. 用同一個 image 建 Express Mode 服務。
3. 有 custom domain 的話，Express Mode 服務掛同一個網域。
4. 用 Route 53（或你的 DNS）的加權紀錄，從小比例開始把流量移過去；出問題就調回權重。
5. 確認穩定後刪掉 App Runner 服務。

一個常被忽略的前提：如果服務只用 App Runner 預設的 `*.awsapprunner.com` 網址，沒有 custom domain，新舊兩邊沒有共同的 hostname 可以分流，只能先驗好 Express Mode 服務，再一次把 client 或 DNS 改到新 endpoint。

搬過去之後，你拿回的是完整的 ECS：sidecar、多 container task、細緻的 ALB rule、deployment circuit breaker 都可以直接改底層資源。代價是成本結構不同：ALB 是常駐計費的資源（同一組網路設定下的多個 Express Mode 服務會共用同一個 ALB），小流量的內部工具要先估一下帳單再切。

## 新專案改用什麼

App Runner 原本的甜蜜點是「單一 stateless HTTP API、內部工具或 prototype，團隊已經在 AWS」。這個位置現在由 ECS Express Mode 接手，而且它不像 App Runner 是一條封閉的捷徑：需要 worker、cron、sidecar、service mesh 或複雜 deployment policy 時，直接在同一個 ECS service 上往下改，不必換平台。

- **HTTP 服務、想要最少設定**：ECS Express Mode。
- **需要完全自己掌握 task definition、網路與部署**：直接用 [Fargate/ECS](/posts/tech/2026-08-22-aws-fargate-containers)。Express Mode 建出來的也是 Fargate 上的 ECS service，兩者的差別在誰先幫你填好設定。
- **短事件 handler、流量高度不規則**：[Lambda](/posts/tech/2026-08-22-aws-lambda-compute)。
- **追求跨雲的 PaaS 體驗**：比較 Render、Railway 或 Fly.io。

不論選哪個，驗收方式跟以前一樣：推一個壞 image、讓 health endpoint 失敗、打滿 concurrency、切斷 private dependency，再確認 deployment 不會吃掉最後一個健康版本，alarm 能指出是 app、network 還是 scaling 問題。

## 更新紀錄

- 2026-11-23：AWS App Runner 從 2026-04-30 起停收新客戶、不再加新功能，改寫標題與結論：新增「新專案不要選 App Runner」與「現有服務怎麼搬到 ECS Express Mode」兩節，選型段改成新專案在 ECS Express Mode、Fargate、Lambda 之間怎麼選。

## 參考資料

- [AWS App Runner（含 end of support notice）](https://aws.amazon.com/apprunner/)
- [AWS App Runner availability change（遷移到 ECS Express Mode 的指南）](https://docs.aws.amazon.com/apprunner/latest/dg/apprunner-availability-change.html)
- [Amazon ECS Express Mode](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/express-service-overview.html)
- [AWS App Runner architecture and concepts](https://docs.aws.amazon.com/apprunner/latest/dg/architecture.html)
- [App Runner service based on a source image](https://docs.aws.amazon.com/apprunner/latest/dg/service-source-image.html)
- [Configuring App Runner health checks](https://docs.aws.amazon.com/apprunner/latest/dg/manage-configure-healthcheck.html)
- [Observability for App Runner](https://docs.aws.amazon.com/apprunner/latest/dg/monitor.html)
- [Choosing an AWS container service](https://docs.aws.amazon.com/decision-guides/latest/containers-on-aws-how-to-choose/choosing-aws-container-service.html)
