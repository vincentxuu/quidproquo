---
title: "Terraform：Provider、Plan、Apply 與 State 的 IaC 工作模型"
date: 2026-08-22
category: tech
type: deep-dive
tags: [terraform, infrastructure-as-code, devops, cloud-computing, automation]
lang: zh-TW
tldr: "Terraform 以 provider resource schema、configuration 與 state 對照真實 API，產生 plan 再 apply；最重要的資產不是 HCL，而是受控的 state 與變更流程。"
description: "介紹 Terraform providers、resources、modules、plan/apply、state backend、locking、drift、import、secrets 與團隊工作流。"
series:
  name: "AI 時代的技術選擇"
  order: 91
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-terraform-infrastructure-as-code-en)

[Terraform](https://developer.hashicorp.com/terraform/intro) 是 declarative infrastructure as code 工具。HCL configuration 描述 resources 與 dependencies，providers 把它翻成 AWS、Google Cloud、Cloudflare、GitHub 等 API 操作；Terraform 再用 state 將 resource address 對應到真實物件。

## Write、Plan、Apply 是變更協定

`terraform init` 下載 providers/modules 並初始化 backend；`validate` 檢查結構；`plan` 對照 configuration、state 與 remote objects，產生 create/update/replace/destroy；`apply` 才執行。Plan 是有副作用變更的 review artifact，不是「看起來沒有 syntax error」。

CI 應在 pull request 產 speculative plan，在受保護 branch 重新以最新 state 產 final plan，再由受權者核准 apply。兩次 plan 可能因 merge、drift、provider data 或時間而不同。保存 plan 時也要當敏感 artifact，避免跨 commit、跨 environment 或過期 credential 重用。

## State 是綁定資料，也是高敏感資產

[State](https://developer.hashicorp.com/terraform/language/state) 保存 resource identity、attributes、dependency metadata 和 outputs。它不是可隨意重建的 cache；遺失 state 會失去 Terraform 對既有物件的 ownership mapping，錯 state 可能規劃重建或刪除。

團隊使用支援 access control、versioning、encryption 與 locking 的 remote backend。[Locking](https://developer.hashicorp.com/terraform/language/state/locking) 防止同一 state 同時有 writers；不要用 `-lock=false` 解決等待，也不要在未確認 owner/process 前 `force-unlock`。State 需備份、restore drill 與最小權限。

標記 variable/output 為 `sensitive` 只會隱藏 UI/CLI 顯示，值仍可能存在 state/plan。能用 ephemeral/write-only provider arguments 才避免持久化；否則以 secret manager 注入並將 state 視同 secrets database，絕不可 commit Git。

## Module 是 API，不是複製貼上

Module 應用少量 typed inputs、清楚 outputs、provider/version constraints 與可升級 contract 封裝重複 topology。Registry/Git module 要固定版本並 review source。把所有可能性塞入 boolean flags 會形成難以測試的「mega-module」；優先組合小而有責任邊界的 modules。

Refactor resource address 時用 `moved` block；接管既有資源用 import block/command；停止管理但保留實體要用 removed/state workflow。直接改 state 或 `-target` 只適合受控 recovery，不應成為日常流程。Lifecycle `prevent_destroy` 是護欄，不是 backup。

Terraform 適合跨 provider provisioning、network/IAM/database/cluster 等生命週期較長的 infrastructure。Kubernetes controller 管 runtime desired state；Pulumi 用一般語言表達 IaC；SST 聚焦 application cloud composition。驗收應包含 destructive replacement review、credential expiry、state lock contention、drift reconciliation、provider upgrade、module migration、state restore 與 break-glass audit。

## 參考資料

- [Terraform overview](https://developer.hashicorp.com/terraform/intro)
- [Terraform core workflow](https://developer.hashicorp.com/terraform/intro/core-workflow)
- [Terraform resources](https://developer.hashicorp.com/terraform/language/resources)
- [Terraform state](https://developer.hashicorp.com/terraform/language/state)
- [State backends and locking](https://developer.hashicorp.com/terraform/language/state/backends)
- [Managing sensitive data](https://developer.hashicorp.com/terraform/language/manage-sensitive-data)
