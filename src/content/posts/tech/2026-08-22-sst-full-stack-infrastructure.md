---
title: "SST v3：用 Components、Link 與 Dev Mode 組合 Full-Stack Cloud App"
date: 2026-08-22
category: tech
type: deep-dive
tags: [sst, infrastructure-as-code, serverless, aws, typescript]
lang: zh-TW
tldr: "SST v3 以 TypeScript config、高階 app components、Pulumi/Terraform providers 與 resource linking 組合自有雲資源；它是 application-first IaC，不是代管 PaaS。"
description: "介紹 SST v3 components、providers、resource linking、stage、dev mode、state home、secrets、removal 與 v2 遷移邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 93
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-sst-full-stack-infrastructure-en)

[SST](https://sst.dev/docs) 是 application-first infrastructure framework。整個 app 在 `sst.config.ts` 定義 frontend、API、Function、container Service、database、bucket、queue、domain 和第三方 provider resources，實際資源建立在團隊自己的 AWS、Cloudflare 等帳號。

現在談 SST 要標明 v3：Ion deployment engine 已離開舊版 CDK/CloudFormation，改以 Pulumi engine 與 Pulumi/Terraform provider ecosystem。舊文章中的 Stack、Construct、CloudFormation quota 與 v2 plugin 假設不能直接套用。

## Component 把多個低階資源包成 app feature

[Built-in Components](https://sst.dev/docs/components/) 例如 `sst.aws.Nextjs`、`Function`、`Service` 或 `Bucket`，用較少設定建立一組 IAM、compute、routing、build 與 deployment resources。`nodes` 和 transform 可深入調整底層 Pulumi resources，但每次 override 都提高與 component implementation 耦合。

Component name 在 app 內是 identity；更名可能被視為新 resources。App `name` 更改更會部署新資源並留下舊資源 orphan。Rename 前先看 diff、採 migration/alias 能力並盤點 DNS、database、bucket 等不可隨意 replace 的 state。

## Link 是 typed wiring，也包含權限

[Resource linking](https://sst.dev/docs/linking/) 把 bucket name、API URL、secret 等 properties 提供給 Function、Service 或 frontend runtime，程式以 `Resource.MyBucket` 讀取，避免手抄 environment variables。對 AWS components，link 常同時配置 IAM permissions；這是便利的 security boundary，必須檢查實際 actions/resources，不能把整個 account 權限當成 link。

公開 frontend 只能取得可公開 properties，secret 必須留 server runtime。`sst.Secret` 值按 stage 管理並加密保存，但 deploy 會把使用到的 secret 帶進 function package/runtime；rotation 需要重新 deploy，log、bundle 與 debug output 仍要防洩漏。

## Stage、Dev Mode 與 State 決定環境生命週期

`sst deploy --stage production` 建立獨立 stage；personal/PR stages 要有 naming、quota、budget、secret fallback 與 cleanup policy。[Dev mode](https://sst.dev/docs/live/) 建立真實 cloud resources，同時 watch local code、live functions、tunnel VPC 與啟動 frontend/backend；它不是完全離線 emulator，仍可能碰到 cloud cost、IAM 與 shared data。

App 的 `home` 決定 [state](https://sst.dev/docs/state/) 存 AWS、Cloudflare 或 local。State 追蹤 resources 與 secrets，deploy 會 lock 以避免 concurrency；`sst unlock` 只在確認沒有 active deploy 後使用。Cloud home 的 bootstrap/state resources、access、backup 和 recovery 也需要治理。

`removal` 可是 `remove`、`retain` 或 `retain-all`，production 應顯式設定。`sst remove` 是否刪 database/bucket 取決於 policy；retain 又可能留下收費與敏感資料。刪 stage 前需要 inventory、backup、legal retention 和 owner approval。

SST 適合 TypeScript full-stack 團隊，尤其 AWS/Cloudflare serverless 與 framework deployments，希望 application code 和 infrastructure 一起演進。通用平台 IaC 看 Pulumi/Terraform；不想管理雲資源細節用 Vercel/Cloudflare managed products；runtime cluster 用 Kubernetes。驗收應涵蓋 v2→v3 migration、component/provider upgrade、rename、link IAM、stage collision、state lock/recovery、secret rotation、failed deploy 與 protected removal。

## 參考資料

- [What is SST](https://sst.dev/docs)
- [SST components](https://sst.dev/docs/components/)
- [SST providers](https://sst.dev/docs/providers/)
- [SST resource linking](https://sst.dev/docs/linking/)
- [SST state](https://sst.dev/docs/state/)
- [SST configuration reference](https://sst.dev/docs/reference/config)
- [SST v3 announcement](https://sst.dev/blog/sst-v3)
