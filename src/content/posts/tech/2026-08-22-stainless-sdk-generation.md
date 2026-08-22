---
title: "Stainless：從 OpenAPI 持續產生可發布的多語言 SDK"
date: 2026-08-22
category: tech
type: deep-dive
tags: [stainless, openapi, sdk-generation, api-design, codegen, developer-experience]
lang: zh-TW
tldr: "Stainless 以 OpenAPI 加上專屬 config 產生多語言 SDK、文件、CLI 與 MCP；重點不是一次性 codegen，而是 preview、發布與升級的持續產品管線。"
description: "介紹 Stainless SDK generator 的 spec、config、resource model、preview build、generated repository 與 vendor boundary。"
series:
  name: "AI 時代的技術選擇"
  order: 42
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-stainless-sdk-generation-en)

[Stainless](https://www.stainless.com/docs/) 從 OpenAPI 產生 TypeScript、Python、Go、Java 等 SDK，也能延伸到 reference docs、CLI、Terraform provider 與 MCP server。它解的不是「把 schema 轉成 interface」，而是每次 API 變更後，怎麼穩定產生、測試、預覽、發布並升級多個語言 package。

## OpenAPI 還不夠，config 決定 SDK 長相

OpenAPI 描述 endpoint 與 schema，卻不一定知道 SDK 應如何分 resource、pagination 怎麼走、method 要叫什麼、哪些 convenience helper 值得存在。Stainless config 補這一層；首次產生時平台可建立草稿，但團隊仍需 review，不能把 LLM 建議當成 API design decision。

以下只表示 spec 與 config 的概念分工，實際欄位以當期專案 schema 為準：

```yaml
resources:
  users:
    models: [User]
    methods:
      list: get /users
      retrieve: get /users/{id}
```

真正的 source of truth 因而是 spec 加 config。只 version spec、把 config 留在 UI 裡，build 就不可重現；兩者都應放進 repository、經 code review 與 change policy。

## Generated repository 仍是產品

Stainless 可把各語言輸出到 staging／production repository，建立 preview build，並協助 package publishing。官方列出的 TypeScript generator 使用原生 Fetch、預設不帶 runtime dependency；不同語言仍各有自己的 error、pagination、retry 與 async 慣例。

不要直接在 generated repository 修 bug，因為下次 regeneration 會覆蓋。修正應回到 OpenAPI、Stainless config 或 generator customization；若真有 hand-written extension，要放在官方保留的 extension point，並測試再次生成後仍存在。

## Preview 比「產完就發」重要

SDK breaking change 不一定來自 OpenAPI breaking change。operationId 改名、resource grouping 移動、nullable mapping 或 generator upgrade，都可能讓使用者程式無法編譯。每次 spec PR 應先產 preview SDK，對前一版跑 compile 與 API diff，再由各語言 owner review。

發布也要有獨立 approval：版本號、changelog、package registry credential 與 generated commit 都應可稽核。vendor 能自動化流程，不能替團隊決定 semver。

## 跟 openapi-typescript、Speakeasy 怎麼選

只服務 TypeScript、要薄 Fetch client 時，openapi-typescript 較透明也沒有 hosted control plane。Stainless 適合公開 API，尤其是 SDK 本身會影響產品採用、需要多語言一致品質與文件。Speakeasy 同樣做多語言 SDK，但以 repo 內 workflow、OpenAPI Overlay 與多 target pipeline 為強烈工作模型。

選 vendor 前要做 exit drill：匯出 spec、config、generated repositories 與發布紀錄，確認停用服務後舊 SDK 仍能 build、修 security patch、重新發布。也要確認哪些 API payload、schema 與 telemetry 會離開自己的環境。

AI agent 能協助補 description、example 與 migration note，但不能拿 production secret 跑 generated client。可執行的驗收是挑一個 pagination、一個 error union 和一個 upload endpoint，在兩種語言 preview SDK 上跑真實 integration test。

## 參考資料

- [Stainless documentation](https://www.stainless.com/docs/)
- [Stainless SDK quickstart](https://app.stainless.com/docs)
- [Stainless TypeScript SDK generator](https://www.stainless.com/docs/sdks/typescript/)
- [Stainless automated builds](https://www.stainless.com/docs/sdks/publish/automate-builds/)
