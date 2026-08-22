---
title: "Pulumi：用 TypeScript、Python、Go 等一般語言寫 Infrastructure as Code"
date: 2026-08-22
category: tech
type: deep-dive
tags: [pulumi, infrastructure-as-code, typescript, devops, cloud-computing]
lang: zh-TW
tldr: "Pulumi 讓一般程式語言註冊 cloud resources，再由 deployment engine、providers 與 stack state 執行 preview/update；語言能力增加，也要求更嚴格的 abstraction discipline。"
description: "介紹 Pulumi projects、stacks、providers、Inputs/Outputs、components、preview/up、state backends、secrets、drift 與 Automation API。"
series:
  name: "AI 時代的技術選擇"
  order: 92
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-pulumi-infrastructure-as-code-en)

[Pulumi](https://www.pulumi.com/docs/iac/concepts/) 是以 TypeScript/JavaScript、Python、Go、C#、Java 或 YAML 定義 infrastructure 的 IaC 平台。程式由 language host 執行並註冊 resources，deployment engine 建 dependency graph，再由 providers 呼叫 cloud/SaaS APIs。

## 一般語言不等於命令式 script

Pulumi program 執行時建立 desired resource graph，不應把任意 cloud mutation 藏在一般函式或 shell call。Resource constructors、Inputs/Outputs 與 dependencies 才是 engine 能 preview、追蹤與復原的部分。用 loop、type、package 和 test 很方便，但 network/time/randomness 造成的不穩定分支會讓 preview 與 update 難以推理。

`Output<T>` 代表 deployment 過程才知道的值；用 `apply` 或 interpolation 轉換，而不是強制 unwrap。Output dependency 讓 engine 正確排序。若在 callback 裡埋大量 resources 或 side effects，會產生難以預覽和測試的隱性 topology。

## Project、Stack 與 Component 是三個邊界

Project 是一份 Pulumi program；Stack 是 dev/staging/prod 等獨立 configuration/state instance；ComponentResource 將多個低階 resources 封裝成可重用 domain API。Component 要固定 child naming、register outputs、propagate provider/options，並提供 migration path，否則 refactor 可能被判定為 delete/create。

`pulumi preview` 顯示預計 operations，`pulumi up` 執行。Provider/plugin 與 package versions 應 lock；PR preview 後仍要在 protected branch 以最新 stack state 重新確認。Update plan 可限制操作集合，但官方仍說明不是先以 all-or-nothing 方式完整評估後才開始。

## State、Secrets 與 Drift 仍然存在

每個 Stack 有 [state](https://www.pulumi.com/docs/reference/state/)，可存在 Pulumi Cloud 或 S3、Blob、GCS、PostgreSQL、local 等 DIY backend。Cloud 提供 transactional checkpoints、locking、history、RBAC 與 audit；DIY 代表自行管理 access、locking、backup、HA 和 disaster recovery。

Pulumi 不會每次 operation 自動 refresh 全部 remote resources。Console 手改造成 drift 時，要明確 `pulumi refresh` 或在 preview/up 加 `--refresh`；refresh 只更新 state，不會改 program，下一次 update 仍可能覆蓋手動變更。

[Secrets](https://www.pulumi.com/docs/iac/concepts/secrets/) 會追蹤 transitive taint 並在 state 加密，但明確 `--show-secrets`、log、export 或錯誤的 secrets provider 仍能洩漏。Cloud credentials 留在 CLI runner，不送 Pulumi Cloud；runner identity 要用短效 OIDC 與 least privilege。

Pulumi 適合希望以現有語言、types/packages 與 component abstractions 建跨雲平台的團隊。偏成熟 declarative module ecosystem 可選 Terraform；application-first composition 可看 SST；runtime reconciliation 仍是 Kubernetes。驗收應涵蓋 preview/update 差異、provider upgrade、component rename、partial failure、lock contention、drift、stack export/import、secrets-provider rotation 與 clean-backend restore。

## 參考資料

- [Pulumi concepts](https://www.pulumi.com/docs/iac/concepts/)
- [Pulumi resource providers](https://www.pulumi.com/docs/iac/concepts/providers/)
- [Pulumi Inputs and Outputs](https://www.pulumi.com/docs/iac/concepts/inputs-outputs/)
- [Pulumi state and backends](https://www.pulumi.com/docs/reference/state/)
- [Pulumi secrets](https://www.pulumi.com/docs/iac/concepts/secrets/)
- [Pulumi Automation API](https://www.pulumi.com/docs/iac/concepts/automation-api/)
